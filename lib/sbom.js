const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Generates a CycloneDX SBOM for an npm project
 * @param {string} projectPath - Path to the npm project
 * @param {string} outputFile - Output file path for the SBOM
 * @returns {string} - Path to the generated SBOM file
 */
function generateSBOM(projectPath, outputFile = 'sbom.cdx.json') {
  const outputFilePath = path.resolve(projectPath, outputFile);
  
  try {
    execSync(
      `npx @cyclonedx/cyclonedx-npm --output-format JSON --output-file "${outputFilePath}"`,
      { 
        cwd: projectPath,
        stdio: 'pipe',
        env: { ...process.env, FORCE_COLOR: '0' }
      }
    );
  } catch (error) {
    // If cyclonedx fails, try to generate SBOM from package-lock.json directly
    console.warn('Warning: Standard SBOM generation failed, attempting fallback method...');
    
    // Check if package-lock.json exists
    const packageLockPath = path.join(projectPath, 'package-lock.json');
    if (fs.existsSync(packageLockPath)) {
      // Generate SBOM with --omit-dev flag to avoid issues with node_modules
      try {
        execSync(
          `npx @cyclonedx/cyclonedx-npm --output-format JSON --output-file "${outputFilePath}" --omit dev`,
          { 
            cwd: projectPath,
            stdio: 'pipe',
            env: { ...process.env, FORCE_COLOR: '0' }
          }
        );
      } catch (retryError) {
        console.warn('Warning: Fallback SBOM generation also failed. Using package-lock.json directly.');
        // Create a minimal SBOM from package-lock.json
        const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf-8'));
        const minimalSBOM = createSBOMFromPackageLock(packageLock);
        fs.writeFileSync(outputFilePath, JSON.stringify(minimalSBOM, null, 2));
      }
    } else {
      throw new Error(`SBOM generation failed and no package-lock.json found at ${projectPath}`);
    }
  }
  
  return outputFilePath;
}

/**
 * Creates a minimal SBOM from package-lock.json
 * @param {Object} packageLock - Parsed package-lock.json
 * @returns {Object} - Minimal SBOM object
 */
function createSBOMFromPackageLock(packageLock) {
  const components = [];
  
  if (packageLock.packages) {
    for (const [path, pkg] of Object.entries(packageLock.packages)) {
      if (path === '') continue; // Skip root package
      
      const name = pkg.name || path.split('node_modules/').pop();
      if (name && pkg.version) {
        components.push({
          type: 'library',
          name: name,
          version: pkg.version,
          bomRef: `pkg:npm/${name}@${pkg.version}`,
          externalReferences: pkg.resolved ? [{
            type: 'distribution',
            url: pkg.resolved
          }] : []
        });
      }
    }
  }
  
  return {
    bomFormat: 'CycloneDX',
    specVersion: '1.4',
    version: 1,
    components: components
  };
}

/**
 * Reads and parses a CycloneDX SBOM file
 * @param {string} sbomPath - Path to the SBOM file
 * @returns {Object} - Parsed SBOM content
 */
function readSBOM(sbomPath) {
  const content = fs.readFileSync(sbomPath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Extracts component information from SBOM
 * @param {Object} sbom - Parsed SBOM object
 * @returns {Array} - Array of components with name, version, repo_url
 */
function extractComponents(sbom) {
  const components = sbom.components || [];
  
  return components.map(component => ({
    name: component.name,
    version: component.version,
    repo_url: component.externalReferences?.find(ref => ref.type === 'vcs')?.url || null
  }));
}

module.exports = {
  generateSBOM,
  readSBOM,
  extractComponents,
  createSBOMFromPackageLock
};
