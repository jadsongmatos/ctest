const fs = require('fs');
const path = require('path');
const { createClient } = require('@libsql/client');
const { execSync } = require('child_process');
const { analyze } = require('../src/index');

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
    const libsql = createClient({
      url: `file:${resolvedPath}`
    });

    try {
      // Create tables manually for testing (idempotent)
      await libsql.execute(`
        CREATE TABLE IF NOT EXISTS components (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          version TEXT NOT NULL,
          repo_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(name, version)
        )
      `);

      await libsql.execute(`
        CREATE TABLE IF NOT EXISTS test_files (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          path TEXT NOT NULL UNIQUE
        )
      `);

      await libsql.execute(`
        CREATE TABLE IF NOT EXISTS source_files (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          path TEXT NOT NULL UNIQUE
        )
      `);

      await libsql.execute(`
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

      await libsql.execute(`
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

    libsql.close();
  }

  /**
   * Creates a libsql client for querying the test database
   */
  async function getLibsqlForDb(dbPath) {
    const resolvedPath = path.resolve(__dirname, '..', dbPath);
    const libsql = createClient({
      url: `file:${resolvedPath}`
    });
    return libsql;
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
      expect(result.sourceTestsMarkdown).toBeDefined();
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
      }).rejects.toThrow('SBOM generation failed');
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
      const libsql = await getLibsqlForDb(testDBPath);
      const result = await libsql.execute('SELECT * FROM components LIMIT 1');
      expect(result.rows.length).toBe(1);
      expect(result.rows[0][1]).toBeDefined(); // name
      expect(result.rows[0][2]).toBeDefined(); // version

      libsql.close();
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
      const libsql = await getLibsqlForDb(testDBPath);
      const result = await libsql.execute('SELECT * FROM components LIMIT 1');
      
      expect(result.rows.length).toBe(1);
      expect(result.rows[0][0]).toBeDefined(); // id
      expect(result.rows[0][1]).toBeDefined(); // name
      expect(result.rows[0][2]).toBeDefined(); // version
      expect(result.rows[0][3]).toBeDefined(); // repo_url
      expect(result.rows[0][4]).toBeDefined(); // created_at

      libsql.close();
    });
  });
});
