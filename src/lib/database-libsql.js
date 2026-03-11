const { createClient } = require('@libsql/client');
const path = require('path');
const fs = require('fs');

/**
 * Creates or opens a database connection
 * @param {string} dbPath - Path to the database file
 * @returns {Object} - Database client instance
 */
async function openDatabase(dbPath) {
  // Use provided path or default or environment variable
  let resolvedPath;

  if (dbPath) {
    resolvedPath = path.resolve(process.cwd(), dbPath);
  } else if (process.env.DATABASE_URL) {
    // Extract path from DATABASE_URL (format: file:/path/to/db.db)
    const urlPath = process.env.DATABASE_URL.replace('file:', '');
    resolvedPath = path.resolve(urlPath);
  } else {
    resolvedPath = path.resolve(process.cwd(), 'db', 'ctest.db');
  }

  // Ensure db directory exists
  const dir = path.dirname(resolvedPath);
  if (dir && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Create libsql client
  const db = createClient({
    url: `file:${resolvedPath}`
  });

  // Initialize database schema if tables don't exist
  await initializeSchema(db);

  return db;
}

/**
 * Initializes the database schema if tables don't exist
 * @param {Object} db - libsql client instance
 */
async function initializeSchema(db) {
  try {
    // Check if components table exists
    const result = await db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='components'");
    if (result.rows.length > 0) {
      // Tables already exist
      return;
    }

    // Create tables
    await db.execute(`
      CREATE TABLE IF NOT EXISTS components (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        version TEXT NOT NULL,
        repo_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(name, version)
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS test_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT NOT NULL UNIQUE
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS source_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT NOT NULL UNIQUE
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS functions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sourceFileId INTEGER NOT NULL,
        name TEXT NOT NULL,
        startLine INTEGER,
        startCol INTEGER,
        endLine INTEGER,
        endCol INTEGER,
        UNIQUE(sourceFileId, name, startLine, startCol, endLine, endCol)
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS function_hits (
        testFileId INTEGER NOT NULL,
        functionId INTEGER NOT NULL,
        hits INTEGER NOT NULL,
        PRIMARY KEY(testFileId, functionId),
        FOREIGN KEY(testFileId) REFERENCES test_files(id),
        FOREIGN KEY(functionId) REFERENCES functions(id)
      )
    `);

    // Create indexes
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_functions_name ON functions(name)`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_source_files_path ON source_files(path)`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_test_files_path ON test_files(path)`);
  } catch (e) {
    console.error('Error initializing schema:', e);
    throw e;
  }
}

/**
 * Inserts or updates components in the database in batches
 * @param {Object} db - Database client instance
 * @param {Array} components - Array of component objects
 * @param {number} batchSize - Number of components to process per batch (default: 50)
 * @returns {number} - Number of components inserted/updated
 */
async function importComponents(db, components, batchSize = 50) {
  console.log(`Importing ${components.length} components in batches of ${batchSize}...`);

  for (let i = 0; i < components.length; i += batchSize) {
    const batch = components.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(components.length / batchSize);

    console.log(`  Batch ${batchNum}/${totalBatches} (${batch.length} components)...`);

    const statements = batch.map(component => ({
      sql: `INSERT OR REPLACE INTO components (name, version, repo_url) VALUES (?, ?, ?)`,
      args: [component.name, component.version, component.repo_url]
    }));

    await db.batch(statements);
  }

  return components.length;
}

/**
 * Retrieves all components from the database
 * @param {Object} db - Database client instance
 * @returns {Array} - Array of component records
 */
async function getAllComponents(db) {
  const result = await db.execute('SELECT * FROM components ORDER BY name ASC');
  return result.rows.map(row => ({
    id: row[0],
    name: row[1],
    version: row[2],
    repo_url: row[3],
    created_at: row[4]
  }));
}

/**
 * Searches for components by name
 * @param {Object} db - Database client instance
 * @param {string} name - Component name to search for
 * @returns {Array} - Array of matching component records
 */
async function searchComponentsByName(db, name) {
  const result = await db.execute({
    sql: 'SELECT * FROM components WHERE name LIKE ?',
    args: [`%${name}%`]
  });
  return result.rows.map(row => ({
    id: row[0],
    name: row[1],
    version: row[2],
    repo_url: row[3],
    created_at: row[4]
  }));
}

/**
 * Finds tests that executed a function by name
 * @param {Object} db - Database client instance
 * @param {string} functionName - Function name to search for
 * @returns {Array} - Array of {test_path, source_path, function_name, hits}
 */
async function findTestsByFunctionName(db, functionName) {
  const result = await db.execute({
    sql: `
      SELECT tf.path as test_path, sf.path as source_path, f.name as function_name, fh.hits
      FROM function_hits fh
      JOIN test_files tf ON fh.testFileId = tf.id
      JOIN functions f ON fh.functionId = f.id
      JOIN source_files sf ON f.sourceFileId = sf.id
      WHERE f.name = ?
      ORDER BY fh.hits DESC
    `,
    args: [functionName]
  });
  
  return result.rows.map(row => ({
    test_path: row[0],
    source_path: row[1],
    function_name: row[2],
    hits: row[3]
  }));
}

/**
 * Finds tests that executed a function by source file path and line range
 * @param {Object} db - Database client instance
 * @param {string} sourcePathPattern - Pattern to match source file path (LIKE)
 * @param {number} startLine - Start line of the function
 * @param {number} endLine - End line of the function
 * @returns {Array} - Array of {test_path, hits}
 */
async function findTestsByFunctionLocation(db, sourcePathPattern, startLine, endLine) {
  const result = await db.execute({
    sql: `
      SELECT tf.path as test_path, fh.hits
      FROM function_hits fh
      JOIN test_files tf ON fh.testFileId = tf.id
      JOIN functions f ON fh.functionId = f.id
      JOIN source_files sf ON f.sourceFileId = sf.id
      WHERE sf.path LIKE ? AND f.startLine = ? AND f.endLine = ?
      ORDER BY fh.hits DESC
    `,
    args: [`%${sourcePathPattern}%`, startLine, endLine]
  });
  
  return result.rows.map(row => ({
    test_path: row[0],
    hits: row[1]
  }));
}

/**
 * Gets all functions executed by a specific test file
 * @param {Object} db - Database client instance
 * @param {string} testPathPattern - Pattern to match test file path (LIKE)
 * @returns {Array} - Array of {source_path, function_name, start_line, end_line, hits}
 */
async function getFunctionsByTest(db, testPathPattern) {
  const result = await db.execute({
    sql: `
      SELECT sf.path as source_path, f.name as function_name, f.startLine as start_line, f.endLine as end_line, fh.hits
      FROM function_hits fh
      JOIN test_files tf ON fh.testFileId = tf.id
      JOIN functions f ON fh.functionId = f.id
      JOIN source_files sf ON f.sourceFileId = sf.id
      WHERE tf.path LIKE ?
      ORDER BY sf.path ASC, f.startLine ASC
    `,
    args: [`%${testPathPattern}%`]
  });
  
  return result.rows.map(row => ({
    source_path: row[0],
    function_name: row[1],
    start_line: row[2],
    end_line: row[3],
    hits: row[4]
  }));
}

/**
 * Gets all components that have a repo_url
 * @param {Object} db - Database client instance
 * @returns {Array} - Array of components with repo_url
 */
async function getComponentsWithRepoUrl(db) {
  const result = await db.execute('SELECT * FROM components WHERE repo_url IS NOT NULL ORDER BY name ASC');
  return result.rows.map(row => ({
    id: row[0],
    name: row[1],
    version: row[2],
    repo_url: row[3],
    created_at: row[4]
  }));
}

/**
 * Upserts a test file and returns its id
 * @param {Object} db - Database client instance
 * @param {string} testPath - Test file path
 * @returns {number} - Test file id
 */
async function upsertTestFile(db, testPath) {
  await db.execute({
    sql: 'INSERT OR REPLACE INTO test_files (path) VALUES (?)',
    args: [testPath]
  });
  const result = await db.execute({
    sql: 'SELECT id FROM test_files WHERE path = ?',
    args: [testPath]
  });
  return result.rows[0][0];
}

/**
 * Upserts a source file and returns its id
 * @param {Object} db - Database client instance
 * @param {string} sourcePath - Source file path
 * @returns {number} - Source file id
 */
async function upsertSourceFile(db, sourcePath) {
  await db.execute({
    sql: 'INSERT OR REPLACE INTO source_files (path) VALUES (?)',
    args: [sourcePath]
  });
  const result = await db.execute({
    sql: 'SELECT id FROM source_files WHERE path = ?',
    args: [sourcePath]
  });
  return result.rows[0][0];
}

/**
 * Upserts a function and returns its id
 * @param {Object} db - Database client instance
 * @param {number} sourceFileId - Source file id
 * @param {Object} fn - Function data
 * @returns {number} - Function id
 */
async function upsertFunction(db, sourceFileId, fn) {
  await db.execute({
    sql: `INSERT OR REPLACE INTO functions (sourceFileId, name, startLine, startCol, endLine, endCol) 
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [sourceFileId, fn.name, fn.startLine, fn.startCol, fn.endLine, fn.endCol]
  });
  const result = await db.execute({
    sql: `SELECT id FROM functions 
          WHERE sourceFileId = ? AND name = ? AND startLine = ? AND startCol = ? AND endLine = ? AND endCol = ?`,
    args: [sourceFileId, fn.name, fn.startLine, fn.startCol, fn.endLine, fn.endCol]
  });
  return result.rows[0][0];
}

/**
 * Upserts a function hit
 * @param {Object} db - Database client instance
 * @param {number} testFileId - Test file id
 * @param {number} functionId - Function id
 * @param {number} hits - Number of hits
 */
async function upsertFunctionHit(db, testFileId, functionId, hits) {
  await db.execute({
    sql: `INSERT OR REPLACE INTO function_hits (testFileId, functionId, hits) 
          VALUES (?, ?, ?)`,
    args: [testFileId, functionId, hits]
  });
}

/**
 * Closes the database connection
 * @param {Object} db - Database client instance
 */
async function closeDatabase(db) {
  db.close();
}

module.exports = {
  openDatabase,
  importComponents,
  getAllComponents,
  searchComponentsByName,
  findTestsByFunctionName,
  findTestsByFunctionLocation,
  getFunctionsByTest,
  getComponentsWithRepoUrl,
  upsertTestFile,
  upsertSourceFile,
  upsertFunction,
  upsertFunctionHit,
  closeDatabase
};
