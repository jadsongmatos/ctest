const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const {
  openDatabase,
  importComponents,
  getAllComponents,
  searchComponentsByName,
  closeDatabase
} = require('../src/lib/database-libsql');

describe('Database Module (libsql)', () => {
  let db;
  const testDbPath = path.join(__dirname, 'test-ctest.db');
  const projectRoot = path.join(__dirname, '..');

  beforeEach(async () => {
    // Delete test database if it exists and create a fresh one with schema
    try {
      fs.unlinkSync(testDbPath);
    } catch (e) {
      // Ignore if file doesn't exist
    }
    
    // Create database with schema
    execSync(`DATABASE_URL=file:${testDbPath} npx prisma db push --accept-data-loss`, {
      cwd: projectRoot,
      stdio: 'ignore'
    });
    
    // Open database connection
    db = await openDatabase('test-ctest.db', __dirname);
  });

  afterEach(async () => {
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
      await db.component.create({
        data: { name: 'test', version: '1.0.0' }
      });
      const result = await db.component.findMany({
        where: { name: 'test' }
      });
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('test');
      expect(result[0].version).toBe('1.0.0');
    });
  });

  describe('importComponents', () => {
    it('should insert components into database', async () => {
      const components = [
        { name: 'test1', version: '1.0.0', repo_url: 'https://github.com/test1' },
        { name: 'test2', version: '2.0.0', repo_url: 'https://github.com/test2' }
      ];

      await importComponents(db, components);

      const result = await db.component.findMany({ orderBy: { name: 'asc' } });
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('test1');
      expect(result[1].name).toBe('test2');
    });

    it('should handle components without repo_url', async () => {
      const components = [
        { name: 'test1', version: '1.0.0', repo_url: null }
      ];

      await importComponents(db, components);

      const result = await db.component.findMany();
      expect(result.length).toBe(1);
      expect(result[0].repo_url).toBeNull();
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

      const result = await db.component.findMany();
      expect(result.length).toBe(1);
      expect(result[0].repo_url).toBe('https://github.com/updated');
    });
  });

  describe('getAllComponents', () => {
    it('should return all components ordered by name', async () => {
      await db.component.create({ data: { name: 'zebra', version: '1.0.0' } });
      await db.component.create({ data: { name: 'apple', version: '1.0.0' } });

      const components = await getAllComponents(db);

      expect(components.length).toBe(2);
      expect(components[0].name).toBe('apple');
      expect(components[1].name).toBe('zebra');
    });
  });

  describe('searchComponentsByName', () => {
    it('should find components containing search term', async () => {
      await db.component.create({ data: { name: 'express', version: '1.0.0' } });
      await db.component.create({ data: { name: 'lodash', version: '1.0.0' } });
      await db.component.create({ data: { name: 'jest-testing', version: '1.0.0' } });
      await db.component.create({ data: { name: 'test-lib', version: '1.0.0' } });

      const results = await searchComponentsByName(db, 'test');

      expect(results.length).toBe(2);
      expect(results.map(c => c.name)).toEqual(expect.arrayContaining(['jest-testing', 'test-lib']));
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
