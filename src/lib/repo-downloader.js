const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');
const crypto = require('crypto');

/**
 * Executes a shell command
 * @param {string} cmd - Command to execute
 * @param {string[]} args - Command arguments
 * @param {Object} opts - Options for execSync
 * @returns {string} - Command output
 */
function sh(cmd, args, opts = {}) {
  return execSync(cmd + ' ' + args.join(' '), {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
    ...opts
  });
}

/**
 * Creates a short hash from a string
 * @param {string} s - String to hash
 * @returns {string} - Hash value
 */
function hash(s) {
  return crypto.createHash('sha1').update(s).digest('hex').slice(0, 10);
}

/**
 * Parses a repo URL to extract git clone URL and version
 * Supports GitHub, GitLab, and generic git URLs
 * @param {string} repoUrl - Repository URL
 * @param {string} version - Package version
 * @returns {Object} - { gitUrl, ref }
 */
function parseRepoUrl(repoUrl, version) {
  if (!repoUrl) {
    return null;
  }

  let gitUrl = repoUrl;
  let ref = version;

  // Handle GitHub URLs
  if (repoUrl.includes('github.com')) {
    // Convert https://github.com/user/repo to git clone URL
    const match = repoUrl.match(/github\.com[\/:]([^\/]+\/[^\/]+?)(?:\.git)?(?:\/|$)/);
    if (match) {
      gitUrl = `https://github.com/${match[1]}.git`;
    }
  }
  // Handle GitLab URLs
  else if (repoUrl.includes('gitlab.com')) {
    const match = repoUrl.match(/gitlab\.com[\/:]([^\/]+\/[^\/]+?)(?:\.git)?(?:\/|$)/);
    if (match) {
      gitUrl = `https://gitlab.com/${match[1]}.git`;
    }
  }

  // Try to find a git tag for the version
  // Common tag formats: v1.2.3, 1.2.3, release-1.2.3
  if (version) {
    ref = `v${version}`; // Try with 'v' prefix first
  }

  return { gitUrl, ref };
}

/**
 * Clones a git repository to a local directory
 * @param {string} gitUrl - Git repository URL
 * @param {string} ref - Git ref (tag, branch, or commit) to checkout
 * @param {string} destDir - Destination directory
 * @returns {boolean} - Success status
 */
function cloneRepo(gitUrl, ref, destDir) {
  try {
    // Clone the repository
    console.log(`  Cloning ${gitUrl} (ref: ${ref})...`);
    sh('git', ['clone', '--depth', '1', '--branch', ref, gitUrl, destDir], {
      stdio: ['ignore', 'pipe', 'pipe']
    });
    return true;
  } catch (error) {
    console.warn(`  Warning: Failed to clone with ref '${ref}'. Trying without ref...`);
    try {
      // Try cloning without specific ref
      sh('git', ['clone', '--depth', '1', gitUrl, destDir], {
        stdio: ['ignore', 'pipe', 'pipe']
      });
      return true;
    } catch (retryError) {
      console.warn(`  Warning: Failed to clone ${gitUrl}`);
      return false;
    }
  }
}

/**
 * Downloads source code for a list of components with repo_url
 * @param {Array} components - Array of components with name, version, repo_url
 * @param {string} baseDir - Base directory for downloaded repos (default: temp dir)
 * @returns {Object} - Map of component name -> { path, success }
 */
function downloadRepos(components, baseDir) {
  const results = {};
  const downloadRoot = baseDir || fs.mkdtempSync(path.join(os.tmpdir(), 'ctest-repos-'));

  console.log(`\nDownloading source code for ${components.length} components...`);
  console.log(`Download directory: ${downloadRoot}`);

  for (const component of components) {
    const { name, version, repo_url } = component;

    if (!repo_url) {
      console.log(`  Skipping ${name}@${version}: no repo_url`);
      results[name] = { path: null, success: false, reason: 'no_repo_url' };
      continue;
    }

    const parsed = parseRepoUrl(repo_url, version);
    if (!parsed) {
      console.log(`  Skipping ${name}@${version}: invalid repo_url`);
      results[name] = { path: null, success: false, reason: 'invalid_url' };
      continue;
    }

    const { gitUrl, ref } = parsed;
    const destDir = path.join(downloadRoot, `${hash(name)}-${name}`);

    // Check if already downloaded
    if (fs.existsSync(destDir)) {
      console.log(`  Using cached: ${name}@${version}`);
      results[name] = { path: destDir, success: true, cached: true };
      continue;
    }

    const success = cloneRepo(gitUrl, ref, destDir);
    results[name] = { path: success ? destDir : null, success, repo: gitUrl };

    if (success) {
      console.log(`  -> Downloaded ${name}@${version} to ${destDir}`);
    }
  }

  return { results, downloadRoot };
}

/**
 * Installs dependencies for a downloaded repository
 * @param {string} repoPath - Path to the repository
 * @returns {boolean} - Success status
 */
function installDependencies(repoPath) {
  const packageJsonPath = path.join(repoPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.warn(`  Warning: No package.json found in ${repoPath}`);
    return false;
  }

  try {
    console.log(`  Installing dependencies for ${path.basename(repoPath)}...`);
    sh('npm', ['install', '--production'], {
      cwd: repoPath,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    return true;
  } catch (error) {
    console.warn(`  Warning: Failed to install dependencies for ${path.basename(repoPath)}`);
    return false;
  }
}

/**
 * Cleans up downloaded repositories
 * @param {string} downloadRoot - Root directory of downloaded repos
 */
function cleanupRepos(downloadRoot) {
  if (downloadRoot && fs.existsSync(downloadRoot)) {
    fs.rmSync(downloadRoot, { recursive: true, force: true });
  }
}

module.exports = {
  downloadRepos,
  installDependencies,
  cleanupRepos,
  parseRepoUrl,
  cloneRepo
};
