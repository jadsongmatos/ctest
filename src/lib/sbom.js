const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

/**
 * Fetches package metadata from npm registry
 * @param {string} packageName - Package name
 * @returns {Promise<Object|null>} - Package metadata or null
 */
async function fetchNpmPackageInfo(packageName) {
  return new Promise((resolve) => {
    const url = `https://registry.npmjs.org/${encodeURIComponent(packageName)}`;
    
    https.get(url, { timeout: 5000 }, (res) => {
      if (res.statusCode !== 200) {
        resolve(null);
        return;
      }
      
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

/**
 * Generates a CycloneDX SBOM for an npm project
 * @param {string} projectPath - Path to the npm project
 * @param {string} outputFile - Output file path for the SBOM
 * @param {boolean} fetchRepoUrls - Whether to fetch repo_url from npm registry (default: false)
 * @returns {Promise<string>} - Path to the generated SBOM file
 */
async function generateSBOM(projectPath, outputFile = 'sbom.cdx.json', fetchRepoUrls = false) {
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
        const minimalSBOM = await createSBOMFromPackageLock(packageLock, fetchRepoUrls);
        fs.writeFileSync(outputFilePath, JSON.stringify(minimalSBOM, null, 2));
      }
    } else {
      throw new Error(`SBOM generation failed and no package-lock.json found at ${projectPath}`);
    }
  }

  return outputFilePath;
}

/**
 * Creates a minimal SBOM from package-lock.json with repo_url from npm registry
 * @param {Object} packageLock - Parsed package-lock.json
 * @param {boolean} fetchRepoUrls - Whether to fetch repo_url from npm registry (default: false)
 * @returns {Promise<Object>} - Minimal SBOM object with repo_url
 */
async function createSBOMFromPackageLock(packageLock, fetchRepoUrls = false) {
  const components = [];
  const packageNames = [];

  if (packageLock.packages) {
    for (const [pkgPath, pkg] of Object.entries(packageLock.packages)) {
      if (pkgPath === '') continue; // Skip root package

      const name = pkg.name || pkgPath.replace('node_modules/', '').split('/node_modules/').pop();
      if (name && pkg.version) {
        packageNames.push({ name, version: pkg.version, resolved: pkg.resolved });
      }
    }
  }

  // Fetch repo_url from npm registry only if requested (slow for large projects)
  if (fetchRepoUrls && packageNames.length > 0) {
    console.log(`Fetching repository URLs for ${packageNames.length} packages from npm registry...`);
    
    for (let i = 0; i < packageNames.length; i++) {
      const { name, version, resolved } = packageNames[i];
      
      if (i % 50 === 0 && i > 0) {
        console.log(`  Progress: ${i}/${packageNames.length} packages...`);
        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 100));
      }
      
      const pkgInfo = await fetchNpmPackageInfo(name);
      let repoUrl = null;
      
      if (pkgInfo) {
        // Try to get repository URL from various fields
        const repo = pkgInfo.repository;
        if (repo) {
          if (typeof repo === 'string') {
            repoUrl = repo;
          } else if (repo && typeof repo === 'object' && repo.url) {
            repoUrl = repo.url;
          }
        }
        
        // Also check homepage as fallback
        if (!repoUrl && pkgInfo.homepage) {
          repoUrl = pkgInfo.homepage;
        }
      }
      
      components.push({
        type: 'library',
        name: name,
        version: version,
        bomRef: `pkg:npm/${name}@${version}`,
        externalReferences: resolved ? [{
          type: 'distribution',
          url: resolved
        }] : [],
        ...(repoUrl ? { repository: { url: repoUrl } } : {})
      });
    }

    console.log(`Completed fetching repository URLs for ${packageNames.length} packages`);
  } else {
    // Create components without repo_url
    for (const { name, version, resolved } of packageNames) {
      components.push({
        type: 'library',
        name: name,
        version: version,
        bomRef: `pkg:npm/${name}@${version}`,
        externalReferences: resolved ? [{
          type: 'distribution',
          url: resolved
        }] : []
      });
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

  return components.map(component => {
    // Try multiple sources for repo_url
    let repoUrl = null;
    
    // 1. Check externalReferences for vcs type
    if (component.externalReferences) {
      const vcsRef = component.externalReferences.find(ref => ref.type === 'vcs');
      if (vcsRef?.url) {
        repoUrl = vcsRef.url;
      }
    }
    
    // 2. Check repository.url field (from our generated SBOM)
    if (!repoUrl && component.repository?.url) {
      repoUrl = component.repository.url;
    }
    
    // 3. Clean up GitHub URLs (remove .git suffix)
    if (repoUrl && repoUrl.includes('github.com')) {
      repoUrl = repoUrl.replace(/\.git$/, '');
    }
    
    return {
      name: component.name,
      version: component.version,
      repo_url: repoUrl
    };
  });
}

module.exports = {
  generateSBOM,
  readSBOM,
  extractComponents,
  createSBOMFromPackageLock,
  fetchNpmPackageInfo
};
