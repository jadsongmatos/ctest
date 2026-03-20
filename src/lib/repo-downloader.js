const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { spawn } = require('child_process');

function hash (s) {
  return crypto.createHash('sha1').update(s).digest('hex').slice(0, 10);
}

function getRepoIdentifier (gitUrl) {
  const match = gitUrl.match(/github\.com[/:]([^/]+\/[^/]+?)(?:\.git)?(?:\/|$)/);
  return match ? match[1] : gitUrl;
}

function parseRepoUrl (repoUrl, version) {
  if (!repoUrl) { return null; }

  let gitUrl = repoUrl;
  const ref = version ? `v${version}` : null;

  const hashMatch = repoUrl.match(/^(.+?)(?:#(.+))?$/);
  if (hashMatch) {
    gitUrl = hashMatch[1];
  }

  if (gitUrl.includes('github.com')) {
    const match = gitUrl.match(/github\.com[/:]([^/]+\/[^/]+?)(?:\.git)?(?:\/|$)/);
    if (match) {
      gitUrl = `https://github.com/${match[1]}.git`;
    }
  }

  return { gitUrl, ref };
}

function shWithTimeout (cmd, args, timeout = 120000) {
  return new Promise((resolve) => {
    let completed = false;
    const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', data => { stdout += data.toString(); });
    child.stderr.on('data', data => { stderr += data.toString(); });

    child.on('close', code => {
      if (completed) { return; }
      completed = true;
      resolve({ success: code === 0, stdout, stderr });
    });

    child.on('error', err => {
      if (completed) { return; }
      completed = true;
      resolve({ success: false, error: err.message });
    });

    setTimeout(() => {
      if (!completed) {
        child.kill('SIGKILL');
        completed = true;
        resolve({ success: false, error: `Timeout after ${timeout}ms` });
      }
    }, timeout);
  });
}

async function cloneRepo (gitUrl, ref, destDir) {
  const cloneArgs = ['clone', '--depth', '1'];
  if (ref) { cloneArgs.push('--branch', ref); }
  cloneArgs.push(gitUrl, destDir);

  let result = await shWithTimeout('git', cloneArgs, 120000);
  if (result.success) { return true; }

  result = await shWithTimeout('git', ['clone', '--depth', '1', gitUrl, destDir], 120000);
  return result.success;
}

const { getCacheDir } = require('./utils');

async function downloadRepos (components, options = {}) {
  const results = {};
  const downloadRoot = options.baseDir || getCacheDir();
  let successCount = 0;
  let skippedCount = 0;
  let failCount = 0;

  for (const component of components) {
    const { name, version, repo_url } = component;

    if (!repo_url) {
      results[name] = { success: false, path: null, reason: 'no_repo_url' };
      failCount++;
      continue;
    }

    const parsed = parseRepoUrl(repo_url, version);
    if (!parsed) {
      results[name] = { success: false, path: null, reason: 'invalid_repo_url' };
      failCount++;
      continue;
    }

    const { gitUrl, ref } = parsed;
    const destDir = path.join(downloadRoot, `${hash(name)}-${name.replace(/[\\/]/g, '_')}`);

    if (fs.existsSync(destDir)) {
      skippedCount++;
      results[name] = {
        success: true,
        path: destDir,
        repo: gitUrl,
        identifier: getRepoIdentifier(gitUrl),
        cached: true
      };
      continue;
    }

    const success = await cloneRepo(gitUrl, ref, destDir);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    results[name] = {
      success,
      path: success ? destDir : null,
      repo: gitUrl,
      identifier: getRepoIdentifier(gitUrl)
    };
  }

  console.log(`Summary: ${successCount} new, ${skippedCount} cached, ${failCount} failed.`);
  return { results, downloadRoot };
}

module.exports = {
  downloadRepos,
  parseRepoUrl
};
