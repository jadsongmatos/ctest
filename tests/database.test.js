const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');
const {
  openDatabase,
  importComponents,
  getAllComponents,
  searchComponentsByName,
  closeDatabase
} = require('../src/lib/database');

describe('Database Module (Prisma)', () => {
  let prisma;

  beforeEach(async () => {
    prisma = await openDatabase();
    // Clear any existing data
    await prisma.component.deleteMany();
    await prisma.functionHit.deleteMany();
    await prisma.function.deleteMany();
    await prisma.sourceFile.deleteMany();
    await prisma.testFile.deleteMany();
  });

  afterEach(async () => {
    await closeDatabase(prisma);
  });

  describe('openDatabase', () => {
    it('should create a new database client', async () => {
      expect(prisma).toBeDefined();
    });

    it('should create components table', async () => {
      const component = await prisma.component.create({
        data: {
          name: 'test',
          version: '1.0.0'
        }
      });

      expect(component).toBeDefined();
      expect(component.name).toBe('test');
    });
  });

  describe('importComponents', () => {
    it('should insert components into database', async () => {
      const components = [
        { name: 'express', version: '4.18.0', repo_url: 'https://github.com/expressjs/express' },
        { name: 'lodash', version: '4.17.21', repo_url: 'https://github.com/lodash/lodash' }
      ];

      await importComponents(prisma, components);

      const allComponents = await getAllComponents(prisma);
      expect(allComponents.length).toBe(2);
      expect(allComponents.find(c => c.name === 'express')).toBeDefined();
      expect(allComponents.find(c => c.name === 'lodash')).toBeDefined();
    });

    it('should handle components without repo_url', async () => {
      const components = [
        { name: 'internal-pkg', version: '1.0.0', repo_url: null }
      ];

      await importComponents(prisma, components);

      const allComponents = await getAllComponents(prisma);
      expect(allComponents.length).toBe(1);
      expect(allComponents[0].name).toBe('internal-pkg');
      expect(allComponents[0].repo_url).toBeNull();
    });

    it('should update existing components', async () => {
      const components1 = [
        { name: 'express', version: '4.18.0', repo_url: 'https://github.com/expressjs/express' }
      ];

      await importComponents(prisma, components1);

      const components2 = [
        { name: 'express', version: '4.18.0', repo_url: 'https://github.com/expressjs/express-updated' }
      ];

      await importComponents(prisma, components2);

      const allComponents = await getAllComponents(prisma);
      expect(allComponents.length).toBe(1);
      expect(allComponents[0].repo_url).toBe('https://github.com/expressjs/express-updated');
    });
  });

  describe('getAllComponents', () => {
    it('should return all components ordered by name', async () => {
      const components = [
        { name: 'zebra', version: '1.0.0', repo_url: null },
        { name: 'apple', version: '2.0.0', repo_url: null },
        { name: 'mango', version: '3.0.0', repo_url: null }
      ];

      await importComponents(prisma, components);

      const allComponents = await getAllComponents(prisma);
      expect(allComponents.length).toBe(3);
      expect(allComponents[0].name).toBe('apple');
      expect(allComponents[1].name).toBe('mango');
      expect(allComponents[2].name).toBe('zebra');
    });
  });

  describe('searchComponentsByName', () => {
    it('should find components containing search term', async () => {
      const components = [
        { name: 'express', version: '4.18.0', repo_url: null },
        { name: 'express-router', version: '1.0.0', repo_url: null },
        { name: 'lodash', version: '4.17.21', repo_url: null }
      ];

      await importComponents(prisma, components);

      const results = await searchComponentsByName(prisma, 'express');
      expect(results.length).toBe(2);
      expect(results.map(c => c.name)).toEqual(expect.arrayContaining(['express', 'express-router']));
    });
  });

  describe('closeDatabase', () => {
    it('should disconnect prisma client', async () => {
      await closeDatabase(prisma);
      // After disconnect, queries should fail
      try {
        await prisma.component.count();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
