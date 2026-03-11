const fs = require('fs');
const path = require('path');
const { scanDirectory, parseFile } = require('./source-parser');

/**
 * Scans a dependency directory and extracts all functions from JavaScript files
 * @param {Object} prisma - Prisma client instance
 * @param {string} depName - Dependency name
 * @param {string} depPath - Path to the dependency
 * @returns {Object} - Summary of extracted functions
 */
async function scanDependency(prisma, depName, depPath) {
  if (!fs.existsSync(depPath)) {
    console.warn(`Warning: Dependency path does not exist: ${depPath}`);
    return { sourceFiles: 0, functions: 0 };
  }

  console.log(`Scanning dependency: ${depName} at ${depPath}`);

  // Scan for JavaScript files in the dependency
  const jsFiles = scanDirectory(depPath, {
    exclude: ['node_modules', '.git', 'dist', 'build', 'coverage', 'test', 'tests', '__tests__', '__mocks__']
  });

  let sourceFileCount = 0;
  let functionCount = 0;

  for (const file of jsFiles) {
    try {
      const functions = parseFile(file);
      
      if (functions.length > 0) {
        // Register source file in database
        const sourceFile = await prisma.sourceFile.upsert({
          where: { path: file },
          update: {},
          create: { path: file }
        });

        sourceFileCount++;

        // Register each function
        for (const fn of functions) {
          await prisma.function.upsert({
            where: {
              sourceFileId_name_startLine_startCol_endLine_endCol: {
                sourceFileId: sourceFile.id,
                name: fn.name,
                startLine: fn.startLine,
                startCol: fn.startCol,
                endLine: fn.endLine,
                endCol: fn.endCol
              }
            },
            update: {},
            create: {
              sourceFileId: sourceFile.id,
              name: fn.name,
              startLine: fn.startLine,
              startCol: fn.startCol,
              endLine: fn.endLine,
              endCol: fn.endCol
            }
          });
          functionCount++;
        }
      }
    } catch (error) {
      console.warn(`  Warning: Could not parse ${file}: ${error.message}`);
    }
  }

  return {
    sourceFiles: sourceFileCount,
    functions: functionCount
  };
}

/**
 * Scans all dependencies in node_modules and extracts functions
 * @param {Object} prisma - Prisma client instance
 * @param {string} projectPath - Path to the npm project
 * @returns {Object} - Summary of extracted functions
 */
async function scanAllDependencies(prisma, projectPath) {
  const nodeModulesPath = path.join(projectPath, 'node_modules');
  
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('No node_modules directory found. Skipping dependency scanning.');
    return { dependencies: 0, sourceFiles: 0, functions: 0 };
  }

  console.log('\nScanning dependencies in node_modules...');

  const deps = fs.readdirSync(nodeModulesPath);
  let depCount = 0;
  let totalSourceFiles = 0;
  let totalFunctions = 0;

  for (const dep of deps) {
    // Skip scoped packages (directories) - handle them separately
    if (dep.startsWith('@')) {
      const scopedDir = path.join(nodeModulesPath, dep);
      const scopedDeps = fs.readdirSync(scopedDir);
      
      for (const scopedDep of scopedDeps) {
        const scopedDepPath = path.join(scopedDir, scopedDep);
        const depName = `${dep}/${scopedDep}`;
        
        if (fs.existsSync(path.join(scopedDepPath, 'package.json'))) {
          depCount++;
          const result = await scanDependency(prisma, depName, scopedDepPath);
          totalSourceFiles += result.sourceFiles;
          totalFunctions += result.functions;
        }
      }
    } else {
      const depPath = path.join(nodeModulesPath, dep);
      
      if (fs.existsSync(path.join(depPath, 'package.json'))) {
        depCount++;
        const result = await scanDependency(prisma, dep, depPath);
        totalSourceFiles += result.sourceFiles;
        totalFunctions += result.functions;
      }
    }
  }

  return {
    dependencies: depCount,
    sourceFiles: totalSourceFiles,
    functions: totalFunctions
  };
}

/**
 * Scans downloaded dependencies (from repo_url) and extracts functions
 * @param {Object} prisma - Prisma client instance
 * @param {Object} downloadInfo - Download info from repo-downloader
 * @returns {Object} - Summary of extracted functions
 */
async function scanDownloadedDependencies(prisma, downloadInfo) {
  if (!downloadInfo?.results) {
    console.log('No downloaded dependencies to scan.');
    return { dependencies: 0, sourceFiles: 0, functions: 0 };
  }

  console.log('\nScanning downloaded dependencies...');

  let depCount = 0;
  let totalSourceFiles = 0;
  let totalFunctions = 0;

  for (const [depName, result] of Object.entries(downloadInfo.results)) {
    if (result.success && result.path) {
      depCount++;
      const scanResult = await scanDependency(prisma, depName, result.path);
      totalSourceFiles += scanResult.sourceFiles;
      totalFunctions += scanResult.functions;
    }
  }

  return {
    dependencies: depCount,
    sourceFiles: totalSourceFiles,
    functions: totalFunctions
  };
}

module.exports = {
  scanDependency,
  scanAllDependencies,
  scanDownloadedDependencies
};
