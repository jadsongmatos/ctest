const fs = require('fs');
const path = require('path');
const { downloadRepos, installDependencies, cleanupRepos } = require('./repo-downloader');
const { scanAllExternalTests } = require('./external-test-extractor');
const { scanSourceFiles } = require('./source-analyzer');
const { generateSourceFileTestsMarkdown } = require('./external-test-extractor');

/**
 * Generates markdown files with external tests for each source file in the project
 * @param {Object} db - Database client instance
 * @param {string} projectPath - Path to the npm project
 * @param {Object} options - Options object
 * @param {boolean} options.downloadDependencies - Whether to download dependencies with repo_url (default: false)
 * @returns {Object} - Summary of generated markdown files
 */
async function generateSourceTestsMarkdown(db, projectPath, options = {}) {
  const {
    downloadDependencies: shouldDownloadDeps = false
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
    const result = await db.execute('SELECT * FROM components WHERE repo_url IS NOT NULL');
    const componentsWithRepo = result.rows.map(row => ({
      id: row[0],
      name: row[1],
      version: row[2],
      repo_url: row[3],
      created_at: row[4]
    }));

    if (componentsWithRepo.length > 0) {
      console.log(`Found ${componentsWithRepo.length} components with repo_url`);
      downloadInfo = downloadRepos(componentsWithRepo);

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
  }

  // Scan source files in the project (excluding node_modules, test files, etc.)
  const sourceFiles = scanSourceFiles(resolvedProjectPath);
  console.log(`\nFound ${sourceFiles.length} source files`);

  // Generate markdown for each source file
  const generatedFiles = [];
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
