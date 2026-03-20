const { execFileSync } = require('child_process');

function ensureHorsebox () {
  try {
    execFileSync('hb', ['--help'], { stdio: 'ignore' });
  } catch {
    throw new Error('Horsebox not found. Install it and ensure `hb` is in PATH.');
  }
}

function runHb (args, options = {}) {
  return execFileSync('hb', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options
  });
}

function buildFileContentIndex (fromDir, indexDir) {
  runHb([
    'build',
    '--from', fromDir,
    '--index', indexDir,
    '--using', 'filecontent'
  ]);
}

function buildFileLineIndex (fromDir, indexDir) {
  runHb([
    'build',
    '--from', fromDir,
    '--index', indexDir,
    '--using', 'fileline'
  ]);
}

const searchCache = new Map();

function searchIndex (indexDir, query, limit = 30) {
  if (!query || !query.trim()) { return []; }

  const cacheKey = `${indexDir}:${query}:${limit}`;
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey);
  }

  const stdout = runHb([
    'search',
    '--index', indexDir,
    '--query', query,
    '--json',
    '--limit', String(limit)
  ]);

  const parsed = JSON.parse(stdout);
  let results = [];
  if (Array.isArray(parsed)) {
    results = parsed;
  } else if (Array.isArray(parsed.hits)) {
    results = parsed.hits;
  }

  searchCache.set(cacheKey, results);
  return results;
}

module.exports = {
  ensureHorsebox,
  buildFileContentIndex,
  buildFileLineIndex,
  searchIndex
};
