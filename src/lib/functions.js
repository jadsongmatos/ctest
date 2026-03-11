const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');
const os = require('os');
const { downloadRepos, installDependencies, cleanupRepos } = require('./repo-downloader');
const { scanDownloadedDependencies, scanAllDependencies } = require('./dependency-scanner');
const { upsertTestFile, upsertSourceFile, upsertFunction, upsertFunctionHit } = require('./database-libsql');

const isWin = process.platform === 'win32';
const npx = isWin ? 'npx.cmd' : 'npx';

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
 * Normalizes path separators to forward slashes
 * @param {string} p - Path to normalize
 * @returns {string} - Normalized path
 */
function norm(p) {
  return p.split(path.sep).join('/');
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
 * Maps test functions to source functions using Jest coverage and stores in database
 * @param {Object} db - libsql client instance
 * @param {string} projectPath - Path to the npm project with Jest tests
 * @param {Object} options - Options object
 * @param {boolean} options.downloadDependencies - Whether to download dependencies with repo_url (default: false)
 * @param {boolean} options.scanDependencies - Whether to scan dependencies for functions (default: false)
 * @returns {Object} - Summary of mapped functions
 */
async function mapFunctions(db, projectPath, options = {}) {
  const {
    downloadDependencies: shouldDownloadDeps = false,
    scanDependencies: shouldScanDeps = false
  } = options;

  const resolvedProjectPath = path.resolve(projectPath);

  // Check if project path exists
  if (!fs.existsSync(resolvedProjectPath)) {
    console.warn(`Warning: Project path does not exist: ${resolvedProjectPath}. Skipping function mapping.`);
    return { testFiles: 0, functions: 0, functionHits: 0 };
  }

  // Download dependencies if requested
  let downloadInfo = null;
  if (shouldDownloadDeps) {
    console.log('\nFetching components with repo_url from database...');
    const result = await db.execute('SELECT * FROM components WHERE repo_url IS NOT NULL');
    const componentsWithRepo = result.rows.map(row => ({
      id: row[0],
      name: row[1],
      version: row[2],
      repo_url: row[3],
      created_at: row[4]
    }));

    if (componentsWithRepo.length > 0) {
      console.log(`Found ${componentsWithRepo.length} components with repo_url`);
      downloadInfo = downloadRepos(componentsWithRepo);

      // Install dependencies for downloaded repos
      for (const [name, result] of Object.entries(downloadInfo.results)) {
        if (result.success && result.path) {
          installDependencies(result.path);
        }
      }
    } else {
      console.log('No components with repo_url found in database');
    }
  }

  // Scan dependencies for functions if requested
  if (shouldScanDeps) {
    console.log('\nScanning dependencies for functions...');
    
    // First scan downloaded dependencies (if available)
    if (downloadInfo?.results) {
      const downloadedResult = await scanDownloadedDependencies(db, downloadInfo);
      console.log(`Found ${downloadedResult.functions} functions in ${downloadedResult.dependencies} downloaded dependencies`);
    }
    
    // Then scan local node_modules
    const localResult = await scanAllDependencies(db, resolvedProjectPath);
    console.log(`Found ${localResult.functions} functions in ${localResult.dependencies} local dependencies`);
  }

  // 1) List tests
  console.log('Listing tests...');
  let testsOut;
  try {
    testsOut = sh(npx, ['jest', '--listTests'], { cwd: resolvedProjectPath });
  } catch (error) {
    console.warn('Warning: Jest not found or no tests detected. Skipping function mapping.');
    if (downloadInfo?.downloadRoot) {
      cleanupRepos(downloadInfo.downloadRoot);
    }
    return { testFiles: 0, functions: 0, functionHits: 0 };
  }

  const testFiles = testsOut.split(/\r?\n/).map(s => s.trim()).filter(Boolean);

  if (!testFiles.length) {
    console.log('No test files found. Skipping function mapping.');
    return { testFiles: 0, functions: 0, functionHits: 0 };
  }

  console.log(`Found ${testFiles.length} test files`);

  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'jest-fn-sqlite-'));

  // Clear old relations (keep catalog of functions/files)
  console.log('Clearing old function_hits...');
  await db.execute('DELETE FROM function_hits');

  let processed = 0;
  for (const testFileAbs of testFiles) {
    const testPath = norm(testFileAbs);
    processed++;
    console.log(`[${processed}/${testFiles.length}] Processing ${path.basename(testPath)}...`);

    const covDir = path.join(tmpRoot, hash(testPath));
    fs.mkdirSync(covDir, { recursive: true });

    // 2) Run only this test with coverage JSON
    try {
      sh(npx, [
        'jest',
        testFileAbs,
        '--runInBand',
        '--coverage',
        '--coverageReporters=json',
        '--coverageDirectory',
        covDir,
        '--silent'
      ], { cwd: resolvedProjectPath });
    } catch (error) {
      console.warn(`  Warning: Test execution failed for ${testPath}`);
      continue;
    }

    const covPath = path.join(covDir, 'coverage-final.json');
    if (!fs.existsSync(covPath)) {
      console.warn(`  Warning: No coverage file generated for ${testPath}`);
      continue;
    }

    const cov = JSON.parse(fs.readFileSync(covPath, 'utf8'));

    // 3) Extract executed functions (hits > 0)
    const called = [];

    for (const sourceFileAbs in cov) {
      const entry = cov[sourceFileAbs];
      if (!entry?.fnMap || !entry?.f) continue;

      const sourcePath = norm(sourceFileAbs);

      for (const fnId of Object.keys(entry.fnMap)) {
        const hits = entry.f[fnId];
        if (!hits) continue;

        const meta = entry.fnMap[fnId];
        const name = meta?.name || '(anonymous)';
        const loc = meta?.loc;

        called.push({
          sourcePath,
          name,
          startLine: loc?.start?.line ?? null,
          startCol: loc?.start?.column ?? null,
          endLine: loc?.end?.line ?? null,
          endCol: loc?.end?.column ?? null,
          hits: Number(hits) || 0
        });
      }
    }

    // Store in database
    await storeFunctionHits(db, testPath, called);
    console.log(`  -> Recorded ${called.length} functions`);
  }

  // Cleanup temp
  fs.rmSync(tmpRoot, { recursive: true, force: true });

  // Cleanup downloaded repos
  if (downloadInfo?.downloadRoot) {
    console.log('\nCleaning up downloaded repositories...');
    cleanupRepos(downloadInfo.downloadRoot);
  }

  // Show summary
  const testCountResult = await db.execute('SELECT COUNT(*) as count FROM test_files');
  const sourceCountResult = await db.execute('SELECT COUNT(*) as count FROM source_files');
  const fnCountResult = await db.execute('SELECT COUNT(*) as count FROM functions');
  const hitsCountResult = await db.execute('SELECT COUNT(*) as count FROM function_hits');

  const testCount = testCountResult.rows[0][0];
  const sourceCount = sourceCountResult.rows[0][0];
  const fnCount = fnCountResult.rows[0][0];
  const hitsCount = hitsCountResult.rows[0][0];

  console.log('\nFunction mapping summary:');
  console.log(`  Test files: ${testCount}`);
  console.log(`  Source files: ${sourceCount}`);
  console.log(`  Functions: ${fnCount}`);
  console.log(`  Function hits: ${hitsCount}`);

  return {
    testFiles: testCount,
    sourceFiles: sourceCount,
    functions: fnCount,
    functionHits: hitsCount
  };
}

/**
 * Stores function hits in the database
 * @param {Object} db - libsql client instance
 * @param {string} testPath - Path to the test file
 * @param {Array} calledFunctions - Array of called function data
 */
async function storeFunctionHits(db, testPath, calledFunctions) {
  // Ensure test file exists
  const testFileId = await upsertTestFile(db, testPath);

  for (const fn of calledFunctions) {
    // Ensure source file exists
    const sourceFileId = await upsertSourceFile(db, fn.sourcePath);

    // Ensure function exists
    const functionId = await upsertFunction(db, sourceFileId, fn);

    // Upsert function hit
    await upsertFunctionHit(db, testFileId, functionId, fn.hits);
  }
}

module.exports = {
  mapFunctions
};
