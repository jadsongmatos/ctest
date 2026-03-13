const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

let horseboxAvailable = false;
try {
  execSync('hb --help', { stdio: 'ignore' });
  horseboxAvailable = true;
} catch {
  // Horsebox not available
}

const {
  ensureHorsebox,
  buildFileContentIndex,
  buildFileLineIndex,
  searchIndex,
} = require('../src/lib/horsebox');

describe('Horsebox Module', () => {
  const testIndexDir = path.join(__dirname, 'fixtures', 'test-index');

  beforeEach(() => {
    if (fs.existsSync(testIndexDir)) {
      fs.rmSync(testIndexDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(testIndexDir)) {
      fs.rmSync(testIndexDir, { recursive: true, force: true });
    }
  });

  describe('ensureHorsebox', () => {
    it('should throw error if horsebox is not installed', () => {
      // Skip if horsebox is actually installed
      if (horseboxAvailable) {
        console.log('Skipping test - Horsebox is installed');
        return;
      }

      const originalExecFileSync = require('child_process').execFileSync;
      
      jest.spyOn(require('child_process'), 'execFileSync').mockImplementation(() => {
        throw new Error('Command not found');
      });

      expect(() => ensureHorsebox()).toThrow('Horsebox not found');

      jest.restoreAllMocks();
    });
  });

  describe('buildFileContentIndex', () => {
    it('should build a file content index', () => {
      if (!horseboxAvailable) {
        console.log('Skipping test - Horsebox not installed');
        return;
      }

      const sourceDir = path.join(__dirname, 'fixtures');
      
      if (!fs.existsSync(sourceDir)) {
        console.log('Skipping test - fixtures directory not found');
        return;
      }

      expect(() => {
        buildFileContentIndex(sourceDir, testIndexDir);
      }).not.toThrow();

      expect(fs.existsSync(testIndexDir)).toBe(true);
    });
  });

  describe('buildFileLineIndex', () => {
    it('should build a file line index', () => {
      if (!horseboxAvailable) {
        console.log('Skipping test - Horsebox not installed');
        return;
      }

      const sourceDir = path.join(__dirname, 'fixtures');
      
      if (!fs.existsSync(sourceDir)) {
        console.log('Skipping test - fixtures directory not found');
        return;
      }

      expect(() => {
        buildFileLineIndex(sourceDir, testIndexDir);
      }).not.toThrow();

      expect(fs.existsSync(testIndexDir)).toBe(true);
    });
  });

  describe('searchIndex', () => {
    it('should return empty array for empty query', () => {
      if (!horseboxAvailable) {
        console.log('Skipping test - Horsebox not installed');
        return;
      }

      const results = searchIndex(testIndexDir, '', 10);
      expect(results).toEqual([]);
    });

    it('should return empty array for whitespace-only query', () => {
      if (!horseboxAvailable) {
        console.log('Skipping test - Horsebox not installed');
        return;
      }

      const results = searchIndex(testIndexDir, '   ', 10);
      expect(results).toEqual([]);
    });
  });
});
