const fs = require('fs');
const path = require('path');
const { downloadRepos, installDependencies, cleanupRepos } = require('./repo-downloader');
const { scanAllExternalTests, registerExternalComponentsFromComponents } = require('./external-test-extractor');
const { scanSourceFiles, analyzeSourceFile } = require('./source-analyzer');
const { generateSourceFileTestsMarkdown } = require('./external-test-extractor');

/**
 * Generates markdown files with external tests for each source file in the project
 * @param {Object} db - Database client instance
 * @param {string} projectPath - Path to the npm project
 * @param {Object} options - Options object
 * @param {boolean} options.downloadDependencies - Whether to download dependencies with repo_url (default: false)
 * @param {string} options.sourceFile - Optional: generate markdown for a single source file only
 * @returns {Object} - Summary of generated markdown files
 */
async function generateSourceTestsMarkdown(db, projectPath, options = {}) {
  const {
    downloadDependencies: shouldDownloadDeps = false,
    sourceFile: singleSourceFile
  } = options;

  const resolvedProjectPath = path.resolve(projectPath);

  // Check if project path exists
  if (!fs.existsSync(resolvedProjectPath)) {
    console.warn(`Warning: Project path does not exist: ${resolvedProjectPath}. Skipping source tests markdown generation.`);
    return { generated: 0, files: [] };
  }

  // Download dependencies if requested
  let downloadInfo = null;
  if (shouldDownloadDeps) {
    console.log('\nFetching components with repo_url from database...');
    
    let componentsToDownload = [];
    
    if (singleSourceFile) {
      // Only download dependencies used in the specific source file
      const sourceFilePath = path.resolve(resolvedProjectPath, singleSourceFile);
      if (fs.existsSync(sourceFilePath)) {
        const libraryUsage = analyzeSourceFile(sourceFilePath);
        const libraryNames = Object.keys(libraryUsage);
        console.log(`  Found ${libraryNames.length} external libraries used in ${singleSourceFile}: ${libraryNames.join(', ')}`);
        
        // Get components that match the libraries used
        for (const libName of libraryNames) {
          const normalizedLibName = libName.replace(/^@/, '');
          const simpleName = normalizedLibName.split('/').pop();
          const scope = libName.startsWith('@') ? libName.split('/')[0] : null;
          
          // Find matching components
          const components = await db.component.findMany({
            where: {
              OR: [
                { name: libName },
                { name: normalizedLibName },
                { name: simpleName }
              ],
              repo_url: { not: null }
            }
          });
          
          // For scoped packages, also filter by repo_url containing the scope
          if (scope && components.length > 1) {
            const filtered = components.filter(c => 
              c.repo_url && c.repo_url.includes(scope.replace('@', ''))
            );
            if (filtered.length > 0) {
              componentsToDownload.push(...filtered);
            }
          } else {
            componentsToDownload.push(...components);
          }
        }
        
        console.log(`  Will download ${componentsToDownload.length} components used in this file`);
      }
    } else {
      // Download all components with repo_url (original behavior)
      componentsToDownload = await db.component.findMany({
        where: { repo_url: { not: null } }
      });
      console.log(`Found ${componentsToDownload.length} components with repo_url`);
    }

    if (componentsToDownload.length > 0) {
      // Add sparse checkout info for known monorepos
      const componentsWithSparse = componentsToDownload.map(comp => {
        let sparsePath = null;
        
        // Detect monorepos and specify package subdirectory
        if (comp.repo_url.includes('github.com/prisma/prisma')) {
          // Extract package path from repo_url if available
          const pkgMatch = comp.repo_url.match(/packages\/([^#\s]+)/);
          if (pkgMatch) {
            const pkgName = pkgMatch[1];
            sparsePath = `packages/${pkgName}`;
            
            // For Prisma client, also include the tests directory for this package
            if (pkgName.includes('client')) {
              // This will be handled by cloneRepo which adds tests directory
              sparsePath = `packages/${pkgName}`;
            }
          } else {
            // Default to packages directory for prisma
            sparsePath = 'packages';
          }
        }
        
        return { ...comp, sparsePath };
      });
      
      downloadInfo = await downloadRepos(componentsWithSparse);

      // Install dependencies for downloaded repos
      for (const [name, result] of Object.entries(downloadInfo.results)) {
        if (result.success && result.path) {
          installDependencies(result.path);
        }
      }
    } else {
      console.log('No components with repo_url found in database');
    }
  }

  // Scan downloaded dependencies for test files
  if (downloadInfo?.results) {
    await scanAllExternalTests(db, downloadInfo);
  } else {
    // Register external components from component table even without download
    console.log('\nRegistering external components from database...');
    await registerExternalComponentsFromComponents(db);
  }

  // Generate markdown for source file(s)
  const generatedFiles = [];
  
  if (singleSourceFile) {
    // Generate markdown for a single file
    const sourceFilePath = path.resolve(resolvedProjectPath, singleSourceFile);
    
    if (!fs.existsSync(sourceFilePath)) {
      console.warn(`Warning: Source file not found: ${sourceFilePath}`);
      return { generated: 0, files: [] };
    }
    
    const outputFile = sourceFilePath + '.md';
    
    console.log(`\nGenerating markdown for: ${singleSourceFile}`);
    const result = await generateSourceFileTestsMarkdown(db, sourceFilePath, outputFile);
    
    if (result.generated) {
      generatedFiles.push({
        sourceFile: singleSourceFile,
        outputFile: path.relative(resolvedProjectPath, outputFile),
        libraries: result.libraries,
        functions: result.functions
      });
    }
  } else {
    // Generate markdown for all source files in the project
    const sourceFiles = scanSourceFiles(resolvedProjectPath);
    console.log(`\nFound ${sourceFiles.length} source files`);

    for (const sourceFile of sourceFiles) {
      const relativePath = path.relative(resolvedProjectPath, sourceFile);
      const outputFile = sourceFile + '.md';
      
      console.log(`\nGenerating markdown for: ${relativePath}`);
      const result = await generateSourceFileTestsMarkdown(db, sourceFile, outputFile);
      
      if (result.generated) {
        generatedFiles.push({
          sourceFile: relativePath,
          outputFile: path.relative(resolvedProjectPath, outputFile),
          libraries: result.libraries,
          functions: result.functions
        });
      }
    }
  }

  // Cleanup downloaded repos
  if (downloadInfo?.downloadRoot) {
    console.log('\nCleaning up downloaded repositories...');
    cleanupRepos(downloadInfo.downloadRoot);
  }

  console.log(`\nGenerated ${generatedFiles.length} markdown files`);

  return {
    generated: generatedFiles.length,
    files: generatedFiles
  };
}

module.exports = {
  generateSourceTestsMarkdown
};
