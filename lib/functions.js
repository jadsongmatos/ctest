const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');
const os = require('os');

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
 * @param {Object} prisma - Prisma client instance
 * @param {string} projectPath - Path to the npm project with Jest tests
 * @returns {Object} - Summary of mapped functions
 */
async function mapFunctions(prisma, projectPath) {
  const resolvedProjectPath = path.resolve(projectPath);

  // Check if project path exists
  if (!fs.existsSync(resolvedProjectPath)) {
    console.warn(`Warning: Project path does not exist: ${resolvedProjectPath}. Skipping function mapping.`);
    return { testFiles: 0, functions: 0, functionHits: 0 };
  }

  // 1) List tests
  console.log('Listing tests...');
  let testsOut;
  try {
    testsOut = sh(npx, ['jest', '--listTests'], { cwd: resolvedProjectPath });
  } catch (error) {
    console.warn('Warning: Jest not found or no tests detected. Skipping function mapping.');
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
  await prisma.functionHit.deleteMany();

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

    // Store in database using Prisma
    await storeFunctionHits(prisma, testPath, called);
    console.log(`  -> Recorded ${called.length} functions`);
  }

  // Cleanup temp
  fs.rmSync(tmpRoot, { recursive: true, force: true });

  // Show summary
  const testCount = await prisma.testFile.count();
  const sourceCount = await prisma.sourceFile.count();
  const fnCount = await prisma.function.count();
  const hitsCount = await prisma.functionHit.count();

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
 * Stores function hits in the database using Prisma
 * @param {Object} prisma - Prisma client instance
 * @param {string} testPath - Path to the test file
 * @param {Array} calledFunctions - Array of called function data
 */
async function storeFunctionHits(prisma, testPath, calledFunctions) {
  // Ensure test file exists
  await prisma.testFile.upsert({
    where: { path: testPath },
    update: {},
    create: { path: testPath }
  });

  const testFile = await prisma.testFile.findUnique({
    where: { path: testPath }
  });

  for (const fn of calledFunctions) {
    // Ensure source file exists
    await prisma.sourceFile.upsert({
      where: { path: fn.sourcePath },
      update: {},
      create: { path: fn.sourcePath }
    });

    const sourceFile = await prisma.sourceFile.findUnique({
      where: { path: fn.sourcePath }
    });

    // Ensure function exists
    await prisma.function.upsert({
      where: {
        sourceFileId_name_startLine_startCol_endLine_endCol: {
          sourceFileId: sourceFile.id,
          name: fn.name,
          startLine: fn.startLine,
          startCol: fn.startCol,
          endLine: fn.endLine,
          endCol: fn.endCol
        }
      },
      update: {},
      create: {
        sourceFileId: sourceFile.id,
        name: fn.name,
        startLine: fn.startLine,
        startCol: fn.startCol,
        endLine: fn.endLine,
        endCol: fn.endCol
      }
    });

    const func = await prisma.function.findFirst({
      where: {
        sourceFileId: sourceFile.id,
        name: fn.name,
        startLine: fn.startLine,
        startCol: fn.startCol,
        endLine: fn.endLine,
        endCol: fn.endCol
      }
    });

    // Upsert function hit
    await prisma.functionHit.upsert({
      where: {
        testFileId_functionId: {
          testFileId: testFile.id,
          functionId: func.id
        }
      },
      update: {
        hits: fn.hits
      },
      create: {
        testFileId: testFile.id,
        functionId: func.id,
        hits: fn.hits
      }
    });
  }
}

module.exports = {
  mapFunctions
};
