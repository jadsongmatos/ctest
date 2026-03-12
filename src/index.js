#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { generateSBOM, readSBOM, extractComponents } = require('./lib/sbom');
const { openDatabase, importComponents, closeDatabase } = require('./lib/database-libsql');
const { generateSourceTestsMarkdown } = require('./lib/functions');

/**
 * Analyzes an npm project and generates markdown files with external tests for each source file
 * @param {string} projectPath - Path to the npm project to analyze
 * @param {Object} options - Options object
 * @param {string} options.dbPath - Path to SQLite database (default: ctest.db)
 * @param {string} options.sbomPath - Path to SBOM file (default: sbom.cdx.json)
 * @param {boolean} options.downloadDependencies - Whether to download dependencies with repo_url (default: false)
 * @param {string} options.sourceFile - Optional: generate markdown for a single source file only
 */
async function analyze(projectPath, options = {}) {
  const {
    dbPath = path.join(process.cwd(), 'db', 'ctest.db'),
    sbomPath = 'sbom.cdx.json',
    downloadDependencies: shouldDownloadDeps = false,
    sourceFile: singleSourceFile
  } = options;

  const resolvedProjectPath = path.resolve(projectPath);

  // Check if project path exists
  if (!fs.existsSync(resolvedProjectPath)) {
    throw new Error(`Project path does not exist: ${resolvedProjectPath}`);
  }

  // Generate SBOM
  console.log('Generating SBOM...');
  const sbomFile = await generateSBOM(resolvedProjectPath, sbomPath, shouldDownloadDeps);

  // Read and parse SBOM
  console.log('Reading SBOM...');
  const sbom = readSBOM(sbomFile);

  // Extract components
  console.log('Extracting components...');
  const components = extractComponents(sbom);
  console.log(`Found ${components.length} components`);

  // Import into database
  console.log('Importing into database...');
  const prisma = await openDatabase(dbPath);
  await importComponents(prisma, components);
  console.log(`Imported ${components.length} components`);

  // Generate source tests markdown
  console.log('\nGenerating source tests markdown...');
  const sourceTestsMarkdown = await generateSourceTestsMarkdown(prisma, resolvedProjectPath, {
    downloadDependencies: shouldDownloadDeps,
    sourceFile: singleSourceFile
  });

  await closeDatabase(prisma);

  return {
    sbomPath: sbomFile,
    componentCount: components.length,
    sourceTestsMarkdown
  };
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const projectPath = args[0] || process.cwd();
  const downloadDependenciesFlag = args.includes('--download-dependencies');
  const sourceFileFlag = args.find(arg => arg.startsWith('--file='));

  (async () => {
    try {
      const result = await analyze(projectPath, {
        downloadDependencies: downloadDependenciesFlag,
        sourceFile: sourceFileFlag ? sourceFileFlag.split('=')[1] : undefined
      });
      console.log(`\nAnalysis complete. Database: db/ctest.db`);
      console.log(`Generated ${result.sourceTestsMarkdown.generated} markdown files`);
      process.exit(0);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  })();
}

module.exports = { analyze };
