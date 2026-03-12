const fs = require('fs');
const path = require('path');
const { scanDirectory } = require('./source-parser');
const { upsertExternalComponent, upsertExternalTestFile } = require('./database-libsql');
const { analyzeSourceFile } = require('./source-analyzer');

/**
 * Common test file patterns to look for in external libraries
 */
const TEST_PATTERNS = [
  'test',
  'tests',
  '__tests__',
  'spec',
  'specs',
  '__specs__',
  '.test.js',
  '.test.ts',
  '.spec.js',
  '.spec.ts',
  'test.js',
  'test.ts',
  'spec.js',
  'spec.ts'
];

/**
 * Checks if a file path looks like a test file
 * @param {string} filePath - Path to check
 * @returns {boolean} - True if it's a test file
 */
function isTestFile(filePath) {
  const fileName = path.basename(filePath);
  const pathParts = filePath.split(path.sep);
  
  for (const part of pathParts) {
    if (TEST_PATTERNS.includes(part)) {
      return true;
    }
  }
  
  for (const pattern of TEST_PATTERNS) {
    if (fileName.includes(pattern)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Scans a downloaded external library for test files
 * @param {Object} db - Database client instance
 * @param {string} componentName - Component name
 * @param {string} componentVersion - Component version
 * @param {string} componentPath - Path to the downloaded component
 * @param {string} repoUrl - Repository URL
 * @returns {Object} - Summary of extracted test files
 */
async function scanExternalTestFiles(db, componentName, componentVersion, componentPath, repoUrl) {
  if (!fs.existsSync(componentPath)) {
    console.warn(`Warning: Component path does not exist: ${componentPath}`);
    return { testFiles: 0 };
  }

  console.log(`\nScanning external tests for: ${componentName}@${componentVersion}`);

  // Register external component
  const externalComponentId = await upsertExternalComponent(db, componentName, componentVersion, repoUrl, componentPath);

  // Scan for all JS/TS files in the component
  const allFiles = scanDirectory(componentPath, {
    exclude: ['node_modules', '.git', 'dist', 'build', 'coverage', 'examples', 'docs']
  });

  // Filter for test files
  const testFiles = allFiles.filter(isTestFile);

  console.log(`  Found ${testFiles.length} test files out of ${allFiles.length} total files`);

  // Store test files in database
  for (const testFile of testFiles) {
    await upsertExternalTestFile(db, externalComponentId, testFile);
  }

  return {
    testFiles: testFiles.length,
    paths: testFiles
  };
}

/**
 * Scans all downloaded external libraries for test files
 * @param {Object} db - Database client instance
 * @param {Object} downloadInfo - Download info from repo-downloader
 * @returns {Object} - Summary of extracted test files
 */
async function scanAllExternalTests(db, downloadInfo) {
  if (!downloadInfo?.results) {
    console.log('No downloaded dependencies to scan for tests.');
    return { components: 0, testFiles: 0 };
  }

  console.log('\nScanning downloaded dependencies for test files...');

  let componentCount = 0;
  let totalTestFiles = 0;

  for (const [depName, result] of Object.entries(downloadInfo.results)) {
    if (result.success && result.path) {
      componentCount++;
      const scanResult = await scanExternalTestFiles(
        db,
        depName,
        '', // version not available in downloadInfo
        result.path,
        result.repo || null
      );
      totalTestFiles += scanResult.testFiles;
    }
  }

  return {
    components: componentCount,
    testFiles: totalTestFiles
  };
}

/**
 * Generates a markdown file with external tests for a specific source file
 * @param {Object} db - Database client instance
 * @param {string} sourceFilePath - Path to the source file
 * @param {string} outputFile - Path to the output markdown file
 * @returns {Object} - Summary of generated markdown
 */
async function generateSourceFileTestsMarkdown(db, sourceFilePath, outputFile) {
  console.log(`\nGenerating tests markdown for: ${sourceFilePath}`);

  // Analyze source file to find library usage
  const libraryUsage = analyzeSourceFile(sourceFilePath);
  
  if (Object.keys(libraryUsage).length === 0) {
    console.log('  No external library usage found.');
    const content = `# External Tests for ${path.basename(sourceFilePath)}

No external library functions found in this file.
`;
    fs.writeFileSync(outputFile, content, 'utf-8');
    return { generated: true, libraries: 0, functions: 0, outputFile };
  }

  // Group tests by component
  const testsByComponent = {};

  // Get all test files for components that match our library usage
  for (const [libName, usage] of Object.entries(libraryUsage)) {
    // Get component from database
    const componentResult = await db.execute({
      sql: 'SELECT id, name, version FROM external_components WHERE name = ?',
      args: [libName]
    });

    if (componentResult.rows.length > 0) {
      for (const comp of componentResult.rows) {
        // Get test files for this component
        const testFilesResult = await db.execute({
          sql: 'SELECT id, path FROM external_test_files WHERE externalComponentId = ?',
          args: [comp.id]
        });

        for (const test of testFilesResult.rows) {
          if (!testsByComponent[comp.name]) {
            testsByComponent[comp.name] = {
              version: comp.version,
              tests: {},
              usedFunctions: new Set()
            };
          }

          // Add all functions from library usage
          const allFuncs = [...(usage.functions || []), ...(Object.values(usage.members || {}).flat())];
          allFuncs.forEach(fn => testsByComponent[comp.name].usedFunctions.add(fn));

          if (!testsByComponent[comp.name].tests[test.path]) {
            testsByComponent[comp.name].tests[test.path] = {
              id: test.id,
              path: test.path,
              functions: allFuncs
            };
          }
        }
      }
    }
  }

  // Generate markdown content
  let totalFunctions = 0;
  let content = `# External Tests for ${path.basename(sourceFilePath)}

Testes de dependências externas usadas neste arquivo.

**Arquivo:** \`${sourceFilePath}\`

## Sumário

- **Total de componentes:** ${Object.keys(testsByComponent).length}
- **Total de arquivos de teste:** ${Object.values(testsByComponent).reduce((sum, c) => sum + Object.keys(c.tests).length, 0)}

---

`;

  // Add content for each component
  for (const [componentName, data] of Object.entries(testsByComponent)) {
    const usedFuncs = Array.from(data.usedFunctions);
    totalFunctions += usedFuncs.length;
    
    content += `## ${componentName}@${data.version}\n\n`;
    content += `**Funções usadas neste arquivo:** ${usedFuncs.join(', ')}\n\n`;

    for (const [testPath, testData] of Object.entries(data.tests)) {
      const testFileName = path.basename(testPath);
      content += `### ${testFileName}\n\n`;
      content += `**Caminho original:** \`${testPath}\`\n\n`;

      content += `**Funções testadas:**\n\n`;
      for (const fn of testData.functions) {
        content += `- \`${fn}\`\n`;
      }
      content += `\n`;

      // Include test file content if it exists
      if (fs.existsSync(testPath)) {
        try {
          const testContent = fs.readFileSync(testPath, 'utf-8');
          content += `**Conteúdo do arquivo de teste:**\n\n`;
          content += '```javascript\n';
          content += testContent;
          content += '\n```\n\n';
        } catch (error) {
          content += `*Erro ao ler arquivo de teste: ${error.message}*\n\n`;
        }
      } else {
        content += `*Arquivo de teste não disponível*\n\n`;
      }

      content += `---\n\n`;
    }

    content += `\n`;
  }

  if (Object.keys(testsByComponent).length === 0) {
    content += `## Nenhum teste externo encontrado

As bibliotecas usadas neste arquivo não têm testes externos disponíveis no banco de dados.

`;
  }

  // Write to file
  fs.writeFileSync(outputFile, content, 'utf-8');

  console.log(`  Generated markdown with ${Object.keys(testsByComponent).length} components`);
  console.log(`  Total functions: ${totalFunctions}`);
  console.log(`  Output: ${outputFile}`);

  return {
    generated: true,
    libraries: Object.keys(testsByComponent).length,
    functions: totalFunctions,
    outputFile
  };
}

module.exports = {
  isTestFile,
  scanExternalTestFiles,
  scanAllExternalTests,
  generateSourceFileTestsMarkdown,
  TEST_PATTERNS
};
