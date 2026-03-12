const { createClient } = require('@libsql/client');
const path = require('path');
const fs = require('fs');

/**
 * Creates or opens a database connection
 * @param {string} dbPath - Path to the database file
 * @returns {Object} - Database client instance
 */
async function openDatabase(dbPath, projectPath) {
  let resolvedPath;

  if (dbPath) {
    resolvedPath = path.resolve(projectPath || process.cwd(), dbPath);
  } else if (process.env.DATABASE_URL) {
    const urlPath = process.env.DATABASE_URL.replace('file:', '');
    resolvedPath = path.resolve(urlPath);
  } else {
    resolvedPath = path.resolve(projectPath || process.cwd(), 'ctest.db');
  }

  const dir = path.dirname(resolvedPath);
  if (dir && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = createClient({
    url: `file:${resolvedPath}`
  });

  await initializeSchema(db);

  return db;
}

/**
 * Initializes the database schema if tables don't exist
 * @param {Object} db - libsql client instance
 */
async function initializeSchema(db) {
  try {
    const result = await db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='components'");
    if (result.rows.length > 0) {
      const extResult = await db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='external_components'");
      if (extResult.rows.length > 0) {
        return;
      }
      await createExternalTestTables(db);
      return;
    }

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

    await createExternalTestTables(db);

    await db.execute(`CREATE INDEX IF NOT EXISTS idx_components_name ON components(name)`);
  } catch (e) {
    console.error('Error initializing schema:', e);
    throw e;
  }
}

/**
 * Creates external test tables if they don't exist
 * @param {Object} db - libsql client instance
 */
async function createExternalTestTables(db) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS external_components (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      version TEXT NOT NULL,
      repo_url TEXT,
      downloadPath TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(name, version)
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS external_test_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      externalComponentId INTEGER NOT NULL,
      path TEXT NOT NULL,
      UNIQUE(externalComponentId, path),
      FOREIGN KEY(externalComponentId) REFERENCES external_components(id)
    )
  `);
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
 * Upserts an external component and returns its id
 * @param {Object} db - Database client instance
 * @param {string} name - Component name
 * @param {string} version - Component version
 * @param {string} repoUrl - Repository URL
 * @param {string} downloadPath - Local download path
 * @returns {number} - External component id
 */
async function upsertExternalComponent(db, name, version, repoUrl, downloadPath) {
  await db.execute({
    sql: `INSERT OR REPLACE INTO external_components (name, version, repo_url, downloadPath)
          VALUES (?, ?, ?, ?)`,
    args: [name, version, repoUrl, downloadPath]
  });
  const result = await db.execute({
    sql: `SELECT id FROM external_components WHERE name = ? AND version = ?`,
    args: [name, version]
  });
  return result.rows[0][0];
}

/**
 * Upserts an external test file and returns its id
 * @param {Object} db - Database client instance
 * @param {number} externalComponentId - External component id
 * @param {string} testPath - Test file path
 * @returns {number} - External test file id
 */
async function upsertExternalTestFile(db, externalComponentId, testPath) {
  await db.execute({
    sql: `INSERT OR REPLACE INTO external_test_files (externalComponentId, path)
          VALUES (?, ?)`,
    args: [externalComponentId, testPath]
  });
  const result = await db.execute({
    sql: `SELECT id FROM external_test_files WHERE externalComponentId = ? AND path = ?`,
    args: [externalComponentId, testPath]
  });
  return result.rows[0][0];
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
  upsertExternalComponent,
  upsertExternalTestFile,
  closeDatabase
};
