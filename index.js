#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { generateSBOM, readSBOM, extractComponents } = require('./lib/sbom');
const { openDatabase, importComponents, getAllComponents, closeDatabase } = require('./lib/database');
const { mapFunctions } = require('./lib/functions');

/**
 * Analyzes an npm project and imports its dependencies into SQLite
 * @param {string} projectPath - Path to the npm project to analyze
 * @param {Object} options - Options object
 * @param {string} options.dbPath - Path to SQLite database (default: ctest.db)
 * @param {string} options.sbomPath - Path to SBOM file (default: sbom.cdx.json)
 * @param {boolean} options.generateSBOM - Whether to generate SBOM (default: true)
 * @param {boolean} options.mapFunctions - Whether to map test functions (default: false)
 */
async function analyze(projectPath, options = {}) {
  const {
    dbPath = path.join(__dirname, 'db', 'ctest.db'),
    sbomPath = 'sbom.cdx.json',
    generateSBOM: shouldGenerateSBOM = true,
    mapFunctions: shouldMapFunctions = false
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
  const prisma = await openDatabase(dbPath);
  await importComponents(prisma, components);
  console.log(`Imported ${components.length} components`);

  // Map functions if requested
  let functionMapping;
  if (shouldMapFunctions) {
    console.log('\nMapping test functions...');
    functionMapping = await mapFunctions(prisma, resolvedProjectPath);
    console.log(`Mapped ${functionMapping.functions} functions across ${functionMapping.testFiles} test files`);
  }

  // Show summary
  console.log('\nComponents in database:');
  const allComponents = await getAllComponents(prisma);
  allComponents.forEach(c => {
    console.log(`  - ${c.name}@${c.version}${c.repo_url ? ` (${c.repo_url})` : ''}`);
  });

  await closeDatabase(prisma);

  return {
    sbomPath: sbomFile,
    componentCount: components.length,
    components: allComponents,
    ...(shouldMapFunctions && { functionMapping })
  };
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const projectPath = args[0] || process.cwd();
  const mapFunctionsFlag = args.includes('--map-functions');

  (async () => {
    try {
      const result = await analyze(projectPath, { mapFunctions: mapFunctionsFlag });
      console.log(`\nAnalysis complete. Database: db/ctest.db`);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  })();
}

module.exports = { analyze };
