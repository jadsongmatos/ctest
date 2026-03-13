const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const os = require('os');
const crypto = require('crypto');

/**
 * Default timeout for git operations (in milliseconds)
 */
const DEFAULT_GIT_TIMEOUT = 60000; // 60 seconds

/**
 * Maximum repository size to download (in MB)
 */
const MAX_REPO_SIZE_MB = 500;

/**
 * List of known large repositories to skip or handle specially
 */
const LARGE_REPOS = [
  'prisma/prisma',
  'microsoft/TypeScript',
  'babel/babel',
  'facebook/react',
  'vuejs/core',
  'angular/angular'
];

/**
 * Executes a shell command synchronously
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
 * Executes a shell command with timeout
 * @param {string} cmd - Command to execute
 * @param {string[]} args - Command arguments
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<{success: boolean, error?: string}>}
 */
function shWithTimeout(cmd, args, timeout = DEFAULT_GIT_TIMEOUT) {
  return new Promise((resolve) => {
    let completed = false;
    const child = spawn(cmd, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (completed) return;
      completed = true;
      resolve({
        success: code === 0,
        stdout,
        stderr
      });
    });

    child.on('error', (err) => {
      if (completed) return;
      completed = true;
      resolve({
        success: false,
        error: err.message
      });
    });

    // Force kill after timeout
    setTimeout(() => {
      if (!completed) {
        child.kill('SIGKILL');
        completed = true;
        resolve({
          success: false,
          error: `Command timed out after ${timeout}ms`
        });
      }
    }, timeout);
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
 * Checks if a repository is in the large repos list
 * @param {string} gitUrl - Git repository URL
 * @returns {boolean} - True if it's a known large repository
 */
function isLargeRepo(gitUrl) {
  return LARGE_REPOS.some(repo => gitUrl.includes(repo));
}

/**
 * Extracts repo owner/name from a git URL
 * @param {string} gitUrl - Git repository URL
 * @returns {string} - Repository identifier (e.g., "prisma/prisma")
 */
function getRepoIdentifier(gitUrl) {
  const match = gitUrl.match(/github\.com[\/:]([^\/]+\/[^\/]+?)(?:\.git)?(?:\/|$)/);
  return match ? match[1] : gitUrl;
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

  // Handle GitHub URLs with subdirectory (monorepos)
  // Format: git+https://github.com/prisma/prisma.git#packages/client
  const hashMatch = repoUrl.match(/^(.+?)(?:#(.+))?$/);
  if (hashMatch) {
    gitUrl = hashMatch[1];
    if (hashMatch[2]) {
      // Store subdirectory for later use (sparse checkout)
      // Don't modify ref, it will be handled separately
    }
  }

  // Convert to proper git clone URL
  if (gitUrl.includes('github.com')) {
    // Convert https://github.com/user/repo to git clone URL
    const match = gitUrl.match(/github\.com[\/:]([^\/]+\/[^\/]+?)(?:\.git)?(?:\/|$)/);
    if (match) {
      gitUrl = `https://github.com/${match[1]}.git`;
    }
  }
  // Handle GitLab URLs
  else if (gitUrl.includes('gitlab.com')) {
    const match = gitUrl.match(/gitlab\.com[\/:]([^\/]+\/[^\/]+?)(?:\.git)?(?:\/|$)/);
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
 * Clones a git repository to a local directory with timeout and retry logic
 * @param {string} gitUrl - Git repository URL
 * @param {string} ref - Git ref (tag, branch, or commit) to checkout
 * @param {string} destDir - Destination directory
 * @param {Object} options - Clone options
 * @param {number} options.timeout - Timeout in milliseconds
 * @param {boolean} options.sparseCheckout - Enable sparse checkout for monorepos
 * @param {string} options.sparsePath - Path to checkout in sparse mode
 * @returns {Promise<boolean>} - Success status
 */
async function cloneRepo(gitUrl, ref, destDir, options = {}) {
  const {
    timeout = 120000, // 2 minutes for large repos
    sparseCheckout = false,
    sparsePath = null
  } = options;

  const repoId = getRepoIdentifier(gitUrl);
  const isLarge = isLargeRepo(gitUrl);

  if (isLarge) {
    console.log(`  Note: ${repoId} is a known large repository, using blobless clone...`);
  }

  try {
    // For large monorepos like Prisma, use blobless clone then checkout specific paths
    if (isLarge) {
      console.log(`  Cloning ${gitUrl} with blobless filter...`);
      
      // Clone with blobless filter (gets tree but not file contents)
      const cloneArgs = ['clone', '--filter=blob:none', '--depth', '1'];
      
      if (ref) {
        cloneArgs.push('--branch', ref);
      }
      
      cloneArgs.push(gitUrl, destDir);
      
      let result = await shWithTimeout('git', cloneArgs, timeout);
      
      if (result.success) {
        console.log(`  -> Blobless clone successful for ${repoId}`);
        // Now checkout specific paths to get file contents
        if (sparsePath) {
          try {
            // Checkout the specific package directory
            await shWithTimeout('git', ['checkout', 'HEAD', '--', sparsePath], timeout);
            console.log(`  -> Checked out ${sparsePath}`);
          } catch (e) {
            console.warn(`  Warning: Could not checkout ${sparsePath}: ${e.message}`);
          }
        }
        return true;
      }
      
      // Fallback to regular shallow clone
      console.warn(`  Warning: Blobless clone failed, trying regular clone...`);
    }

    // Standard shallow clone
    console.log(`  Cloning ${gitUrl} (ref: ${ref || 'latest'})...`);

    const cloneArgs = ['clone', '--depth', '1'];

    // Add branch/tag if specified
    if (ref) {
      cloneArgs.push('--branch', ref);
    }

    cloneArgs.push(gitUrl, destDir);

    const result = await shWithTimeout('git', cloneArgs, timeout);

    if (result.success) {
      return true;
    }

    // Retry without ref if failed
    console.warn(`  Warning: Failed to clone with ref '${ref}'. Trying without ref...`);

    const retryArgs = ['clone', '--depth', '1', gitUrl, destDir];
    const retryResult = await shWithTimeout('git', retryArgs, timeout);

    if (retryResult.success) {
      return true;
    }

    console.warn(`  Warning: Failed to clone ${gitUrl}`);
    return false;
  } catch (error) {
    console.warn(`  Warning: Clone failed for ${gitUrl}: ${error.message}`);
    return false;
  }
}

/**
 * Downloads source code for a list of components with repo_url
 * @param {Array} components - Array of components with name, version, repo_url
 * @param {Object} options - Download options
 * @param {string} options.baseDir - Base directory for downloaded repos (default: temp dir)
 * @param {boolean} options.sparseCheckout - Enable sparse checkout for monorepos (default: true)
 * @returns {Promise<Object>} - Map of component name -> { path, success }
 */
async function downloadRepos(components, options = {}) {
  const {
    baseDir,
    sparseCheckout = true
  } = options;
  
  const results = {};
  const downloadRoot = baseDir || fs.mkdtempSync(path.join(os.tmpdir(), 'ctest-repos-'));

  console.log(`\nDownloading source code for ${components.length} components...`);
  console.log(`Download directory: ${downloadRoot}`);
  console.log(`Options: sparseCheckout=${sparseCheckout}`);

  let successCount = 0;
  let failCount = 0;

  for (const component of components) {
    const { name, version, repo_url, sparsePath } = component;

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
      successCount++;
      continue;
    }

    // Use sparse checkout for monorepos if sparsePath is provided
    const useSparse = sparseCheckout && sparsePath;
    
    const success = await cloneRepo(gitUrl, ref, destDir, {
      sparseCheckout: useSparse,
      sparsePath: sparsePath
    });
    
    results[name] = { path: success ? destDir : null, success, repo: gitUrl };

    if (success) {
      console.log(`  -> Downloaded ${name}@${version} to ${destDir}`);
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log(`\nDownload summary: ${successCount} succeeded, ${failCount} failed`);

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
