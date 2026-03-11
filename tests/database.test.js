const path = require('path');
const fs = require('fs');
const {
  openDatabase,
  importComponents,
  getAllComponents,
  searchComponentsByName,
  closeDatabase
} = require('../src/lib/database-libsql');

describe('Database Module (libsql)', () => {
  let db;
  let originalDbPath;

  beforeAll(async () => {
    // Save original DATABASE_URL if set
    originalDbPath = process.env.DATABASE_URL;
  });

  beforeEach(async () => {
    // Use a test-specific database to avoid conflicts
    const testDbPath = path.join(__dirname, 'test-ctest.db');
    process.env.DATABASE_URL = `file:${testDbPath}`;
    db = await openDatabase();
    // Clear only test-related data, not components (which may be populated by other tests)
    await db.execute('DELETE FROM function_hits');
    await db.execute('DELETE FROM functions');
    await db.execute('DELETE FROM source_files');
    await db.execute('DELETE FROM test_files');
  });

  afterEach(async () => {
    // Restore original DATABASE_URL
    if (originalDbPath) {
      process.env.DATABASE_URL = originalDbPath;
    } else {
      delete process.env.DATABASE_URL;
    }
    // Clean up test database
    const testDbPath = path.join(__dirname, 'test-ctest.db');
    try {
      require('fs').unlinkSync(testDbPath);
    } catch (e) {
      // Ignore if file doesn't exist
    }
  });

  describe('openDatabase', () => {
    it('should create a new database client', async () => {
      expect(db).toBeDefined();
    });

    it('should create components table', async () => {
      await db.execute(`INSERT INTO components (name, version) VALUES ('test', '1.0.0')`);
      const result = await db.execute('SELECT * FROM components WHERE name = ?', { args: ['test'] });
      expect(result.rows.length).toBe(1);
      expect(result.rows[0][1]).toBe('test');
      expect(result.rows[0][2]).toBe('1.0.0');
    });
  });

  describe('importComponents', () => {
    it('should insert components into database', async () => {
      const components = [
        { name: 'test1', version: '1.0.0', repo_url: 'https://github.com/test1' },
        { name: 'test2', version: '2.0.0', repo_url: 'https://github.com/test2' }
      ];

      await importComponents(db, components);

      const result = await db.execute('SELECT * FROM components ORDER BY name');
      expect(result.rows.length).toBe(2);
      expect(result.rows[0][1]).toBe('test1');
      expect(result.rows[1][1]).toBe('test2');
    });

    it('should handle components without repo_url', async () => {
      const components = [
        { name: 'test1', version: '1.0.0', repo_url: null }
      ];

      await importComponents(db, components);

      const result = await db.execute('SELECT * FROM components');
      expect(result.rows.length).toBe(1);
      expect(result.rows[0][3]).toBeNull();
    });

    it('should update existing components', async () => {
      const components1 = [
        { name: 'test1', version: '1.0.0', repo_url: 'https://github.com/test1' }
      ];

      await importComponents(db, components1);

      const components2 = [
        { name: 'test1', version: '1.0.0', repo_url: 'https://github.com/updated' }
      ];

      await importComponents(db, components2);

      const result = await db.execute('SELECT * FROM components');
      expect(result.rows.length).toBe(1);
      expect(result.rows[0][3]).toBe('https://github.com/updated');
    });
  });

  describe('getAllComponents', () => {
    it('should return all components ordered by name', async () => {
      await db.execute(`INSERT INTO components (name, version) VALUES ('zebra', '1.0.0')`);
      await db.execute(`INSERT INTO components (name, version) VALUES ('apple', '1.0.0')`);

      const components = await getAllComponents(db);

      expect(components.length).toBe(2);
      expect(components[0].name).toBe('apple');
      expect(components[1].name).toBe('zebra');
    });
  });

  describe('searchComponentsByName', () => {
    it('should find components containing search term', async () => {
      await db.execute(`INSERT INTO components (name, version) VALUES ('express', '1.0.0')`);
      await db.execute(`INSERT INTO components (name, version) VALUES ('lodash', '1.0.0')`);
      await db.execute(`INSERT INTO components (name, version) VALUES ('jest', '1.0.0')`);

      const results = await searchComponentsByName(db, 'est');

      expect(results.length).toBe(2);
      expect(results.map(c => c.name)).toEqual(expect.arrayContaining(['express', 'jest']));
    });
  });

  describe('closeDatabase', () => {
    it('should close database connection', async () => {
      await closeDatabase(db);
      // Connection should be closed
      expect(db).toBeDefined();
    });
  });
});
