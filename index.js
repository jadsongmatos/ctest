#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { generateSBOM, readSBOM, extractComponents } = require('./lib/sbom');
const { openDatabase, importComponents, getAllComponents, closeDatabase } = require('./lib/database');

/**
 * Analyzes an npm project and imports its dependencies into SQLite
 * @param {string} projectPath - Path to the npm project to analyze
 * @param {Object} options - Options object
 * @param {string} options.dbPath - Path to SQLite database (default: ctest.db)
 * @param {string} options.sbomPath - Path to SBOM file (default: sbom.cdx.json)
 * @param {boolean} options.generateSBOM - Whether to generate SBOM (default: true)
 */
function analyze(projectPath, options = {}) {
  const {
    dbPath = path.join(__dirname, 'db', 'ctest.db'),
    sbomPath = 'sbom.cdx.json',
    generateSBOM: shouldGenerateSBOM = true
  } = options;
  
  const resolvedProjectPath = path.resolve(projectPath);
  
  // Check if project path exists
  if (!fs.existsSync(resolvedProjectPath)) {
    throw new Error(`Project path does not exist: ${resolvedProjectPath}`);
  }
  
  // Generate or use existing SBOM
  let sbomFile;
  if (shouldGenerateSBOM) {
    console.log('Generating SBOM...');
    sbomFile = generateSBOM(resolvedProjectPath, sbomPath);
  } else {
    sbomFile = path.resolve(resolvedProjectPath, sbomPath);
    if (!fs.existsSync(sbomFile)) {
      throw new Error(`SBOM file not found: ${sbomFile}`);
    }
  }
  
  // Read and parse SBOM
  console.log('Reading SBOM...');
  const sbom = readSBOM(sbomFile);
  
  // Extract components
  console.log('Extracting components...');
  const components = extractComponents(sbom);
  console.log(`Found ${components.length} components`);
  
  // Import into database
  console.log('Importing into database...');
  const db = openDatabase(dbPath);
  const imported = importComponents(db, components);
  console.log(`Imported ${imported} components`);
  
  // Show summary
  console.log('\nComponents in database:');
  const allComponents = getAllComponents(db);
  allComponents.forEach(c => {
    console.log(`  - ${c.name}@${c.version}${c.repo_url ? ` (${c.repo_url})` : ''}`);
  });
  
  closeDatabase(db);
  
  return {
    sbomPath: sbomFile,
    componentCount: imported,
    components: allComponents
  };
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const projectPath = args[0] || process.cwd();
  
  try {
    const result = analyze(projectPath);
    console.log(`\nAnalysis complete. Database: db/ctest.db`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

module.exports = { analyze };
