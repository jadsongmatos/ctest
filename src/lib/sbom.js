const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

async function fetchNpmPackageInfo (packageName) {
  return new Promise((resolve) => {
    const url = `https://registry.npmjs.org/${encodeURIComponent(packageName)}`;

    https.get(url, { timeout: 5000 }, (res) => {
      if (res.statusCode !== 200) {
        resolve(null);
        return;
      }

      let data = '';
      res.on('data', chunk => { data += chunk; });
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

async function createSBOMFromPackageLock (packageLock, fetchRepoUrls = false, omitTransitive = false) {
  const components = [];
  const packageNames = [];

  const directDependencies = new Set();
  if (omitTransitive) {
    // Try to find direct dependencies from root package
    const rootPkg = packageLock.packages ? packageLock.packages[''] : null;
    if (rootPkg && rootPkg.dependencies) {
      Object.keys(rootPkg.dependencies).forEach(d => directDependencies.add(d));
    }
  }

  if (packageLock.packages) {
    for (const [pkgPath, pkg] of Object.entries(packageLock.packages)) {
      if (pkgPath === '') { continue; }

      // In lockfile v3, pkgPath is "node_modules/name"
      const name = pkg.name || pkgPath.replace(/^node_modules\//, '').split('/node_modules/').pop();
      if (name && pkg.version) {
        if (omitTransitive && !directDependencies.has(name)) {
          continue;
        }
        packageNames.push({ name, version: pkg.version, resolved: pkg.resolved });
      }
    }
  }

  if (fetchRepoUrls && packageNames.length > 0) {
    for (const { name, version, resolved } of packageNames) {
      const pkgInfo = await fetchNpmPackageInfo(name);
      let repoUrl = null;

      if (pkgInfo) {
        if (typeof pkgInfo.repository === 'string') {
          repoUrl = pkgInfo.repository;
        } else if (pkgInfo.repository && pkgInfo.repository.url) {
          repoUrl = pkgInfo.repository.url;
        }

        if (!repoUrl && pkgInfo.homepage) {
          repoUrl = pkgInfo.homepage;
        }
      }

      components.push({
        type: 'library',
        name,
        version,
        bomRef: `pkg:npm/${name}@${version}`,
        externalReferences: resolved ? [{ type: 'distribution', url: resolved }] : [],
        ...(repoUrl ? { repository: { url: repoUrl } } : {})
      });
    }
  } else {
    for (const { name, version, resolved } of packageNames) {
      components.push({
        type: 'library',
        name,
        version,
        bomRef: `pkg:npm/${name}@${version}`,
        externalReferences: resolved ? [{ type: 'distribution', url: resolved }] : []
      });
    }
  }

  return {
    bomFormat: 'CycloneDX',
    specVersion: '1.4',
    version: 1,
    components
  };
}

async function generateSBOM (projectPath, outputFile = 'sbom.cdx.json', fetchRepoUrls = false, omitTransitive = false) {
  const outputFilePath = path.resolve(projectPath, outputFile);

  try {
    const omitArgs = omitTransitive ? '--omit dev --omit optional --omit peer' : '';
    execSync(
      `npx @cyclonedx/cyclonedx-npm ${omitArgs} --output-format JSON --output-file "${outputFilePath}"`,
      {
        cwd: projectPath,
        stdio: 'pipe',
        env: { ...process.env, FORCE_COLOR: '0' }
      }
    );

    const sbom = JSON.parse(fs.readFileSync(outputFilePath, 'utf8'));

    // Ensure components is an array
    if (!sbom.components) { sbom.components = []; }

    // Post-process to ensure only direct dependencies if omitTransitive is true
    if (omitTransitive) {
      const packageJsonPath = path.join(projectPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const pkgJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const directDeps = new Set(Object.keys(pkgJson.dependencies || {}));

        // Filter existing components
        if (sbom.components.length > 0) {
          sbom.components = sbom.components.filter(c => directDeps.has(c.name));
        }

        // If components is empty after filtering (or was already empty),
        // try to populate from dependencies graph or directDeps
        if (sbom.components.length === 0 && directDeps.size > 0) {
          // Fallback to manual creation for those direct deps since tool omitted them
          const packageLockPath = path.join(projectPath, 'package-lock.json');
          if (fs.existsSync(packageLockPath)) {
            const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
            const fallbackSBOM = await createSBOMFromPackageLock(packageLock, false, true);
            sbom.components = fallbackSBOM.components;
          } else {
            // Last resort: just names
            for (const name of directDeps) {
              sbom.components.push({ type: 'library', name, version: 'unknown' });
            }
          }
        }
      }
    }

    // Always ensure components have repo URLs if fetchRepoUrls is true
    if (fetchRepoUrls && sbom.components && sbom.components.length > 0) {
      for (const component of sbom.components) {
        // Check if it already has a repo URL
        let hasRepo = false;
        if (component.externalReferences) {
          hasRepo = component.externalReferences.some(ref => ref.type === 'vcs');
        }
        if (!hasRepo && component.repository && component.repository.url) {
          hasRepo = true;
        }

        if (!hasRepo) {
          const pkgInfo = await fetchNpmPackageInfo(component.name);
          if (pkgInfo) {
            let repoUrl = null;
            if (typeof pkgInfo.repository === 'string') {
              repoUrl = pkgInfo.repository;
            } else if (pkgInfo.repository && pkgInfo.repository.url) {
              repoUrl = pkgInfo.repository.url;
            } else if (pkgInfo.homepage) {
              repoUrl = pkgInfo.homepage;
            }

            if (repoUrl) {
              if (!component.externalReferences) { component.externalReferences = []; }
              component.externalReferences.push({ type: 'vcs', url: repoUrl });
            }
          }
        }
      }
    }

    fs.writeFileSync(outputFilePath, JSON.stringify(sbom, null, 2));
  } catch (error) {
    const packageLockPath = path.join(projectPath, 'package-lock.json');

    if (!fs.existsSync(packageLockPath)) {
      throw new Error(`SBOM generation failed and no package-lock.json found at ${projectPath}: ${error.message}`);
    }

    const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
    const minimalSBOM = await createSBOMFromPackageLock(packageLock, fetchRepoUrls, omitTransitive);
    fs.writeFileSync(outputFilePath, JSON.stringify(minimalSBOM, null, 2));
  }

  return outputFilePath;
}

function readSBOM (sbomPath) {
  return JSON.parse(fs.readFileSync(sbomPath, 'utf8'));
}

function extractComponents (sbom) {
  const components = sbom.components || [];

  return components.map(component => {
    let repoUrl = null;

    if (component.externalReferences) {
      const vcsRef = component.externalReferences.find(ref => ref.type === 'vcs');
      if (vcsRef && vcsRef.url) { repoUrl = vcsRef.url; }
    }

    if (!repoUrl && component.repository && component.repository.url) {
      repoUrl = component.repository.url;
    }

    if (repoUrl && repoUrl.includes('github.com')) {
      repoUrl = repoUrl.replace(/\.git$/, '');
      if (!repoUrl.startsWith('http')) {
        repoUrl = repoUrl.replace(/^git\+/, '').replace(/^git:/, 'https:');
      }
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
  createSBOMFromPackageLock
};
