const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const {
  openDatabase,
  importComponents,
  getAllComponents,
  searchComponentsByName,
  closeDatabase
} = require('../lib/database');

describe('Database Module (SQLite)', () => {
  // Create unique in-memory database for each test
  const createDb = () => {
    const db = openDatabase(':memory:');
    // Clear any existing data
    db.exec('DELETE FROM components');
    return db;
  };

  describe('openDatabase', () => {
    it('should create a new in-memory database', () => {
      const db = createDb();
      
      expect(db).toBeDefined();
      expect(db.open).toBe(true);
      
      closeDatabase(db);
    });

    it('should create components table', () => {
      const db = createDb();
      
      const tableInfo = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='components'").get();
      
      expect(tableInfo).toBeDefined();
      expect(tableInfo.name).toBe('components');
      
      closeDatabase(db);
    });
  });

  describe('importComponents', () => {
    it('should insert components into database', () => {
      const db = createDb();
      
      const components = [
        { name: 'express', version: '4.18.0', repo_url: 'https://github.com/expressjs/express' },
        { name: 'lodash', version: '4.17.21', repo_url: 'https://github.com/lodash/lodash' }
      ];
      
      const count = importComponents(db, components);
      
      expect(count).toBe(2);
      
      const allComponents = getAllComponents(db);
      expect(allComponents).toHaveLength(2);
      
      closeDatabase(db);
    });

    it('should handle components without repo_url', () => {
      const db = createDb();
      
      const components = [
        { name: 'test-package', version: '1.0.0', repo_url: null }
      ];
      
      const count = importComponents(db, components);
      
      expect(count).toBe(1);
      
      const allComponents = getAllComponents(db);
      expect(allComponents[0].repo_url).toBeNull();
      
      closeDatabase(db);
    });

    it('should replace existing component with same name and version', () => {
      const db = createDb();
      
      const components1 = [
        { name: 'test-package', version: '1.0.0', repo_url: 'https://github.com/old/repo' }
      ];
      
      importComponents(db, components1);
      
      const components2 = [
        { name: 'test-package', version: '1.0.0', repo_url: 'https://github.com/new/repo' }
      ];
      
      importComponents(db, components2);
      
      const allComponents = getAllComponents(db);
      expect(allComponents).toHaveLength(1);
      expect(allComponents[0].repo_url).toBe('https://github.com/new/repo');
      
      closeDatabase(db);
    });
  });

  describe('getAllComponents', () => {
    it('should return all components from database', () => {
      const db = createDb();
      
      const components = [
        { name: 'express', version: '4.18.0', repo_url: 'https://github.com/expressjs/express' },
        { name: 'lodash', version: '4.17.21', repo_url: 'https://github.com/lodash/lodash' },
        { name: 'axios', version: '1.4.0', repo_url: 'https://github.com/axios/axios' }
      ];
      
      importComponents(db, components);
      
      const allComponents = getAllComponents(db);
      
      expect(allComponents).toHaveLength(3);
      expect(allComponents.map(c => c.name)).toEqual(expect.arrayContaining(['express', 'lodash', 'axios']));
      
      closeDatabase(db);
    });

    it('should return empty array for empty database', () => {
      const db = createDb();
      
      const allComponents = getAllComponents(db);
      
      expect(allComponents).toEqual([]);
      
      closeDatabase(db);
    });

    it('should include created_at timestamp', () => {
      const db = createDb();
      
      const components = [
        { name: 'test-package', version: '1.0.0', repo_url: null }
      ];
      
      importComponents(db, components);
      
      const allComponents = getAllComponents(db);
      
      expect(allComponents[0].created_at).toBeDefined();
      
      closeDatabase(db);
    });
  });

  describe('searchComponentsByName', () => {
    it('should find components by partial name match', () => {
      const db = createDb();
      
      const components = [
        { name: 'express', version: '4.18.0', repo_url: null },
        { name: 'express-router', version: '1.0.0', repo_url: null },
        { name: 'lodash', version: '4.17.21', repo_url: null }
      ];
      
      importComponents(db, components);
      
      const results = searchComponentsByName(db, 'express');
      
      expect(results).toHaveLength(2);
      expect(results.map(c => c.name)).toEqual(expect.arrayContaining(['express', 'express-router']));
      
      closeDatabase(db);
    });

    it('should return empty array for no matches', () => {
      const db = createDb();
      
      const components = [
        { name: 'express', version: '4.18.0', repo_url: null }
      ];
      
      importComponents(db, components);
      
      const results = searchComponentsByName(db, 'nonexistent');
      
      expect(results).toEqual([]);
      
      closeDatabase(db);
    });
  });

  describe('closeDatabase', () => {
    it('should close database connection', () => {
      const db = createDb();
      
      expect(db.open).toBe(true);
      
      closeDatabase(db);
      
      expect(db.open).toBe(false);
    });
  });
});
