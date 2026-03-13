const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

async function fetchNpmPackageInfo(packageName) {
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

async function createSBOMFromPackageLock(packageLock, fetchRepoUrls = false) {
  const components = [];
  const packageNames = [];

  if (packageLock.packages) {
    for (const [pkgPath, pkg] of Object.entries(packageLock.packages)) {
      if (pkgPath === '') continue;

      const name = pkg.name || pkgPath.replace('node_modules/', '').split('/node_modules/').pop();
      if (name && pkg.version) {
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
        ...(repoUrl ? { repository: { url: repoUrl } } : {}),
      });
    }
  } else {
    for (const { name, version, resolved } of packageNames) {
      components.push({
        type: 'library',
        name,
        version,
        bomRef: `pkg:npm/${name}@${version}`,
        externalReferences: resolved ? [{ type: 'distribution', url: resolved }] : [],
      });
    }
  }

  return {
    bomFormat: 'CycloneDX',
    specVersion: '1.4',
    version: 1,
    components,
  };
}

async function generateSBOM(projectPath, outputFile = 'sbom.cdx.json', fetchRepoUrls = false) {
  const outputFilePath = path.resolve(projectPath, outputFile);

  try {
    execSync(
      `npx @cyclonedx/cyclonedx-npm --output-format JSON --output-file "${outputFilePath}"`,
      {
        cwd: projectPath,
        stdio: 'pipe',
        env: { ...process.env, FORCE_COLOR: '0' },
      }
    );
  } catch {
    const packageLockPath = path.join(projectPath, 'package-lock.json');

    if (!fs.existsSync(packageLockPath)) {
      throw new Error(`SBOM generation failed and no package-lock.json found at ${projectPath}`);
    }

    const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
    const minimalSBOM = await createSBOMFromPackageLock(packageLock, fetchRepoUrls);
    fs.writeFileSync(outputFilePath, JSON.stringify(minimalSBOM, null, 2));
  }

  return outputFilePath;
}

function readSBOM(sbomPath) {
  return JSON.parse(fs.readFileSync(sbomPath, 'utf8'));
}

function extractComponents(sbom) {
  const components = sbom.components || [];

  return components.map(component => {
    let repoUrl = null;

    if (component.externalReferences) {
      const vcsRef = component.externalReferences.find(ref => ref.type === 'vcs');
      if (vcsRef && vcsRef.url) repoUrl = vcsRef.url;
    }

    if (!repoUrl && component.repository && component.repository.url) {
      repoUrl = component.repository.url;
    }

    if (repoUrl && repoUrl.includes('github.com')) {
      repoUrl = repoUrl.replace(/\.git$/, '');
    }

    return {
      name: component.name,
      version: component.version,
      repo_url: repoUrl,
    };
  });
}

module.exports = {
  generateSBOM,
  readSBOM,
  extractComponents,
  createSBOMFromPackageLock,
};
