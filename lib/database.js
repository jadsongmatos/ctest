const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

/**
 * Creates or opens a SQLite database for storing component information
 * @param {string} dbPath - Path to the database file
 * @returns {Object} - SQLite database instance
 */
function openDatabase(dbPath = 'db/ctest.db') {
  const resolvedPath = path.resolve(process.cwd(), dbPath);
  
  // Ensure directory exists
  const dir = path.dirname(resolvedPath);
  if (dir && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const db = new Database(resolvedPath);
  
  // Create table if not exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS components (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      version TEXT NOT NULL,
      repo_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(name, version)
    )
  `);
  
  return db;
}

/**
 * Inserts or updates components in the database
 * @param {Object} db - SQLite database instance
 * @param {Array} components - Array of component objects
 * @returns {number} - Number of components inserted/updated
 */
function importComponents(db, components) {
  const insert = db.prepare(`
    INSERT OR REPLACE INTO components (name, version, repo_url)
    VALUES (@name, @version, @repo_url)
  `);
  
  const insertMany = db.transaction((components) => {
    for (const component of components) {
      insert.run(component);
    }
  });
  
  insertMany(components);
  return components.length;
}

/**
 * Retrieves all components from the database
 * @param {Object} db - SQLite database instance
 * @returns {Array} - Array of component records
 */
function getAllComponents(db) {
  const select = db.prepare('SELECT id, name, version, repo_url, created_at FROM components ORDER BY name');
  return select.all();
}

/**
 * Searches for components by name
 * @param {Object} db - SQLite database instance
 * @param {string} name - Component name to search for
 * @returns {Array} - Array of matching component records
 */
function searchComponentsByName(db, name) {
  const select = db.prepare('SELECT id, name, version, repo_url, created_at FROM components WHERE name LIKE ?');
  return select.all(`%${name}%`);
}

/**
 * Closes the database connection
 * @param {Object} db - SQLite database instance
 */
function closeDatabase(db) {
  db.close();
}

module.exports = {
  openDatabase,
  importComponents,
  getAllComponents,
  searchComponentsByName,
  closeDatabase
};
