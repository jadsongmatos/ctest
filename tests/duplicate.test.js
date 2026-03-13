const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const {
  openDatabase,
  importComponents,
  getAllComponents,
  closeDatabase
} = require('../src/lib/database-libsql');

describe('Duplicate Execution Tests', () => {
  const testDbName = 'test-duplicate.db';
  const projectRoot = path.join(__dirname, '..');
  let db;
  let fullPath;

  beforeEach(async () => {
    // Set up database path
    fullPath = path.resolve(__dirname, testDbName);
    process.env.DATABASE_URL = `file:${fullPath}`;

    // Clean up test file if it exists
    try {
      fs.unlinkSync(fullPath);
    } catch (e) {
      // Ignore if file doesn't exist
    }

    // Create database with schema
    execSync(`DATABASE_URL=file:${fullPath} npx prisma db push --accept-data-loss`, {
      cwd: projectRoot,
      stdio: 'ignore'
    });

    // Open database connection
    db = await openDatabase(fullPath, process.cwd());
  });

  afterEach(async () => {
    // Close database connection
    if (db) {
      await closeDatabase(db);
    }

    // Clean up test file
    try {
      fs.unlinkSync(fullPath);
    } catch (e) {
      // Ignore if file doesn't exist
    }
  });

  describe('importComponents idempotency', () => {
    it('should not duplicate components when importing the same data twice', async () => {
      const components = [
        { name: 'test1', version: '1.0.0', repo_url: 'https://github.com/test1' },
        { name: 'test2', version: '2.0.0', repo_url: 'https://github.com/test2' },
        { name: 'test3', version: '3.0.0', repo_url: 'https://github.com/test3' }
      ];

      // First import
      await importComponents(db, components, 1);
      let resultAfterFirst = await getAllComponents(db);

      // Second import (same data)
      await importComponents(db, components, 1);
      let resultAfterSecond = await getAllComponents(db);

      // Third import (same data)
      await importComponents(db, components, 1);
      let resultAfterThird = await getAllComponents(db);

      // All imports should result in the same count
      expect(resultAfterFirst.length).toBe(3);
      expect(resultAfterSecond.length).toBe(3);
      expect(resultAfterThird.length).toBe(3);
    });

    it('should update repo_url when importing existing components with different data', async () => {
      const components1 = [
        { name: 'test1', version: '1.0.0', repo_url: 'https://github.com/original' }
      ];

      const components2 = [
        { name: 'test1', version: '1.0.0', repo_url: 'https://github.com/updated' }
      ];

      // First import
      await importComponents(db, components1, 1);

      // Second import with updated repo_url
      await importComponents(db, components2, 1);

      const components = await db.component.findMany({
        where: { name: 'test1' }
      });

      // Should have only one component
      expect(components.length).toBe(1);
      // repo_url should be updated
      expect(components[0].repo_url).toBe('https://github.com/updated');
    });

    it('should maintain unique components when importing multiple batches', async () => {
      const batch1 = [
        { name: 'test1', version: '1.0.0', repo_url: 'https://github.com/test1' },
        { name: 'test2', version: '2.0.0', repo_url: 'https://github.com/test2' }
      ];

      const batch2 = [
        { name: 'test2', version: '2.0.0', repo_url: 'https://github.com/test2-updated' },
        { name: 'test3', version: '3.0.0', repo_url: 'https://github.com/test3' }
      ];

      // Import first batch
      await importComponents(db, batch1, 1);
      let resultAfterFirst = await getAllComponents(db);

      // Import second batch (has one overlapping component)
      await importComponents(db, batch2, 1);
      let resultAfterSecond = await getAllComponents(db);

      // Should have 3 unique components (test1, test2, test3)
      expect(resultAfterFirst.length).toBe(2);
      expect(resultAfterSecond.length).toBe(3);

      // test2 should have updated repo_url
      const test2Component = await db.component.findFirst({
        where: { name: 'test2' }
      });
      expect(test2Component.repo_url).toBe('https://github.com/test2-updated');
    });

    it('should handle empty component arrays without errors', async () => {
      // Import empty array should not fail
      await importComponents(db, [], 1);
      const result = await getAllComponents(db);
      expect(result.length).toBe(0);
    });

    it('should handle components without repo_url', async () => {
      const components = [
        { name: 'test1', version: '1.0.0', repo_url: null }
      ];

      await importComponents(db, components, 1);
      await importComponents(db, components, 1);

      const result = await getAllComponents(db);
      expect(result.length).toBe(1);
      expect(result[0].repo_url).toBeNull();
    });
  });

  describe('component uniqueness verification', () => {
    it('should verify components are unique by name and version combination', async () => {
      const components = [
        { name: 'test', version: '1.0.0', repo_url: 'https://github.com/test1' },
        { name: 'test', version: '2.0.0', repo_url: 'https://github.com/test2' },
        { name: 'test', version: '1.0.0', repo_url: 'https://github.com/test3' } // duplicate
      ];

      await importComponents(db, components, 1);
      const result = await getAllComponents(db);

      // Should have only 2 unique components (test@1.0.0 and test@2.0.0)
      expect(result.length).toBe(2);

      // Verify unique keys
      const uniqueKeys = new Set(result.map(c => `${c.name}@${c.version}`));
      expect(uniqueKeys.size).toBe(result.length);
    });

    it('should verify no duplicates after multiple imports of mixed data', async () => {
      const imports = [
        [
          { name: 'pkg1', version: '1.0.0', repo_url: 'https://github.com/pkg1' },
          { name: 'pkg2', version: '1.0.0', repo_url: 'https://github.com/pkg2' }
        ],
        [
          { name: 'pkg2', version: '1.0.0', repo_url: 'https://github.com/pkg2-updated' },
          { name: 'pkg3', version: '1.0.0', repo_url: 'https://github.com/pkg3' }
        ],
        [
          { name: 'pkg1', version: '1.0.0', repo_url: 'https://github.com/pkg1-updated' },
          { name: 'pkg4', version: '1.0.0', repo_url: 'https://github.com/pkg4' }
        ]
      ];

      // Perform multiple imports
      for (const batch of imports) {
        await importComponents(db, batch, 1);
      }

      const result = await getAllComponents(db);

      // Should have 4 unique components
      expect(result.length).toBe(4);

      // Verify all components are unique
      const uniqueKeys = new Set(result.map(c => `${c.name}@${c.version}`));
      expect(uniqueKeys.size).toBe(4);
    });
  });
});
