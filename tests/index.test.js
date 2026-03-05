const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const { analyze } = require('../index');

describe('Main Module', () => {
  const testProjectPath = path.join(__dirname, 'fixtures', 'test-project');
  const testDBPath = path.join(__dirname, 'fixtures', 'test-analysis.db');
  const testSBOMPath = path.join(__dirname, 'fixtures', 'test-sbom.json');

  beforeEach(() => {
    // Clean up any existing test database
    if (fs.existsSync(testDBPath)) {
      fs.unlinkSync(testDBPath);
    }
  });

  afterEach(async () => {
    // Clean up test database after tests
    if (fs.existsSync(testDBPath)) {
      fs.unlinkSync(testDBPath);
    }
  });

  /**
   * Creates tables in the test database (idempotent)
   */
  async function createTables(dbPath) {
    const resolvedPath = path.resolve(__dirname, '..', dbPath);
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: `file:${resolvedPath}`
        }
      }
    });
    
    try {
      // Create tables manually for testing (idempotent)
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS components (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          version TEXT NOT NULL,
          repo_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(name, version)
        )
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS test_files (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          path TEXT NOT NULL UNIQUE
        )
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS source_files (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          path TEXT NOT NULL UNIQUE
        )
      `);

      await prisma.$executeRawUnsafe(`
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

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS function_hits (
          testFileId INTEGER NOT NULL,
          functionId INTEGER NOT NULL,
          hits INTEGER NOT NULL,
          PRIMARY KEY(testFileId, functionId)
        )
      `);
    } catch (e) {
      // Tables may already exist
    }
    
    await prisma.$disconnect();
  }

  /**
   * Creates a Prisma client for querying the test database
   */
  async function getPrismaForDb(dbPath) {
    const resolvedPath = path.resolve(__dirname, '..', dbPath);
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: `file:${resolvedPath}`
        }
      }
    });
    return prisma;
  }

  describe('analyze', () => {
    it('should throw error for non-existent project path', async () => {
      await expect(async () => {
        await analyze('/non-existent/path');
      }).rejects.toThrow('Project path does not exist');
    });

    it('should analyze project using existing SBOM', async () => {
      // Create tables first
      await createTables(testDBPath);
      
      const result = await analyze(testProjectPath, {
        dbPath: testDBPath,
        sbomPath: 'test-sbom.json',
        generateSBOM: false
      });

      expect(result).toBeDefined();
      expect(result.sbomPath).toBeDefined();
      expect(result.componentCount).toBeGreaterThan(0);
      expect(result.components).toBeDefined();
      expect(Array.isArray(result.components)).toBe(true);
    });

    it('should throw error when SBOM file not found and generateSBOM is false', async () => {
      const emptyProjectPath = path.join(__dirname, 'fixtures', 'empty-project');

      if (!fs.existsSync(emptyProjectPath)) {
        fs.mkdirSync(emptyProjectPath, { recursive: true });
      }

      await expect(async () => {
        await analyze(emptyProjectPath, {
          dbPath: testDBPath,
          sbomPath: 'nonexistent.json',
          generateSBOM: false
        });
      }).rejects.toThrow('SBOM file not found');
    });

    it('should create database with correct schema', async () => {
      // First create the schema
      await createTables(testDBPath);
      
      // Then run analyze (which will insert data)
      await analyze(testProjectPath, {
        dbPath: testDBPath,
        sbomPath: 'test-sbom.json',
        generateSBOM: false
      });

      // Query with a fresh connection
      const prisma = await getPrismaForDb(testDBPath);
      const component = await prisma.component.findFirst();
      expect(component).toBeDefined();
      expect(component.name).toBeDefined();
      expect(component.version).toBeDefined();

      await prisma.$disconnect();
    });

    it('should include all required fields in components', async () => {
      // First create the schema
      await createTables(testDBPath);
      
      // Then run analyze (which will insert data)
      await analyze(testProjectPath, {
        dbPath: testDBPath,
        sbomPath: 'test-sbom.json',
        generateSBOM: false
      });

      // Query with a fresh connection
      const prisma = await getPrismaForDb(testDBPath);
      const component = await prisma.component.findFirst();

      expect(component).toBeDefined();
      expect(component.id).toBeDefined();
      expect(component.name).toBeDefined();
      expect(component.version).toBeDefined();
      expect(component.repo_url).toBeDefined();
      expect(component.created_at).toBeDefined();

      await prisma.$disconnect();
    });
  });
});
