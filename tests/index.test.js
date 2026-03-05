const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
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

  afterEach(() => {
    // Clean up test database after tests
    if (fs.existsSync(testDBPath)) {
      fs.unlinkSync(testDBPath);
    }
  });

  describe('analyze', () => {
    it('should throw error for non-existent project path', () => {
      expect(() => analyze('/non-existent/path')).toThrow('Project path does not exist');
    });

    it('should analyze project using existing SBOM', () => {
      const result = analyze(testProjectPath, {
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

    it('should throw error when SBOM file not found and generateSBOM is false', () => {
      const emptyProjectPath = path.join(__dirname, 'fixtures', 'empty-project');
      
      if (!fs.existsSync(emptyProjectPath)) {
        fs.mkdirSync(emptyProjectPath, { recursive: true });
      }

      expect(() => analyze(emptyProjectPath, {
        dbPath: testDBPath,
        sbomPath: 'nonexistent.json',
        generateSBOM: false
      })).toThrow('SBOM file not found');
    });

    it('should create database with correct schema', () => {
      analyze(testProjectPath, {
        dbPath: testDBPath,
        sbomPath: 'test-sbom.json',
        generateSBOM: false
      });

      const db = new Database(testDBPath);
      
      const tableInfo = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='components'").get();
      
      expect(tableInfo.sql).toContain('name');
      expect(tableInfo.sql).toContain('version');
      expect(tableInfo.sql).toContain('repo_url');
      expect(tableInfo.sql).toContain('created_at');
      
      db.close();
    });

    it('should include all required fields in components', () => {
      analyze(testProjectPath, {
        dbPath: testDBPath,
        sbomPath: 'test-sbom.json',
        generateSBOM: false
      });

      const db = new Database(testDBPath);
      const component = db.prepare('SELECT * FROM components LIMIT 1').get();
      
      expect(component).toHaveProperty('id');
      expect(component).toHaveProperty('name');
      expect(component).toHaveProperty('version');
      expect(component).toHaveProperty('repo_url');
      expect(component).toHaveProperty('created_at');
      
      db.close();
    });
  });
});
