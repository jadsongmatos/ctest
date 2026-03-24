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

describe('Horsebox Module', () => {
  const testIndexDir = path.join(__dirname, 'fixtures', 'test-index');
  const testSourceDir = path.join(__dirname, 'fixtures', 'test-source');

  beforeEach(() => {
    if (fs.existsSync(testIndexDir)) {
      fs.rmSync(testIndexDir, { recursive: true, force: true });
    }
    if (fs.existsSync(testSourceDir)) {
      fs.rmSync(testSourceDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testSourceDir, { recursive: true });
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (fs.existsSync(testIndexDir)) {
      fs.rmSync(testIndexDir, { recursive: true, force: true });
    }
    if (fs.existsSync(testSourceDir)) {
      fs.rmSync(testSourceDir, { recursive: true, force: true });
    }
    jest.restoreAllMocks();
    jest.resetModules();
  });

  describe('ensureHorsebox', () => {
    it('should throw error if horsebox is not installed', () => {
      jest.spyOn(require('child_process'), 'execFileSync').mockImplementation(() => {
        throw new Error('Command not found');
      });

      const { ensureHorsebox } = require('../src/lib/horsebox');
      expect(() => ensureHorsebox()).toThrow('Horsebox not found');
    });

    it('should not throw if horsebox is available', () => {
      if (!horseboxAvailable) {
        console.log('Skipping test - Horsebox not installed');
        return;
      }

      const { ensureHorsebox } = require('../src/lib/horsebox');
      expect(() => ensureHorsebox()).not.toThrow();
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

      const { buildFileContentIndex } = require('../src/lib/horsebox');
      expect(() => {
        buildFileContentIndex(sourceDir, testIndexDir);
      }).not.toThrow();

      expect(fs.existsSync(testIndexDir)).toBe(true);
    });

    it('should call hb with correct arguments for filecontent index', () => {
      const mockExecFileSync = jest.spyOn(require('child_process'), 'execFileSync');
      mockExecFileSync.mockReturnValue('');

      const { buildFileContentIndex } = require('../src/lib/horsebox');
      const fromDir = '/test/from';
      const indexDir = '/test/index';

      buildFileContentIndex(fromDir, indexDir);

      expect(mockExecFileSync).toHaveBeenCalledWith('hb', [
        'build',
        '--from', fromDir,
        '--index', indexDir,
        '--using', 'filecontent'
      ], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe']
      });
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

      const { buildFileLineIndex } = require('../src/lib/horsebox');
      expect(() => {
        buildFileLineIndex(sourceDir, testIndexDir);
      }).not.toThrow();

      expect(fs.existsSync(testIndexDir)).toBe(true);
    });

    it('should call hb with correct arguments for fileline index', () => {
      const mockExecFileSync = jest.spyOn(require('child_process'), 'execFileSync');
      mockExecFileSync.mockReturnValue('');

      const { buildFileLineIndex } = require('../src/lib/horsebox');
      const fromDir = '/test/from';
      const indexDir = '/test/index';

      buildFileLineIndex(fromDir, indexDir);

      expect(mockExecFileSync).toHaveBeenCalledWith('hb', [
        'build',
        '--from', fromDir,
        '--index', indexDir,
        '--using', 'fileline'
      ], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe']
      });
    });
  });

  describe('searchIndex', () => {
    it('should return empty array for empty query', () => {
      const { searchIndex } = require('../src/lib/horsebox');
      const results = searchIndex(testIndexDir, '', 10);
      expect(results).toEqual([]);
    });

    it('should return empty array for whitespace-only query', () => {
      const { searchIndex } = require('../src/lib/horsebox');
      const results = searchIndex(testIndexDir, '   ', 10);
      expect(results).toEqual([]);
    });

    it('should return empty array for null query', () => {
      const { searchIndex } = require('../src/lib/horsebox');
      const results = searchIndex(testIndexDir, null, 10);
      expect(results).toEqual([]);
    });

    it('should search index and return results as array', () => {
      if (!horseboxAvailable) {
        console.log('Skipping test - Horsebox not installed');
        return;
      }

      const sourceDir = path.join(__dirname, 'fixtures');

      if (!fs.existsSync(sourceDir)) {
        console.log('Skipping test - fixtures directory not found');
        return;
      }

      const { buildFileContentIndex, searchIndex } = require('../src/lib/horsebox');

      try {
        buildFileContentIndex(sourceDir, testIndexDir);
        const results = searchIndex(testIndexDir, 'test', 10);
        expect(Array.isArray(results)).toBe(true);
      } catch (error) {
        if (error.message.includes('No such file') || error.message.includes('PermissionError')) {
          console.log('Skipping test - Horsebox index creation failed due to environment limitations');
          return;
        }
        throw error;
      }
    });

    it('should parse results when hb returns array format', () => {
      const mockExecFileSync = jest.spyOn(require('child_process'), 'execFileSync');
      const mockResults = [{ file: 'test.js', line: 1, content: 'test code' }];
      mockExecFileSync.mockReturnValue(JSON.stringify(mockResults));

      const { searchIndex } = require('../src/lib/horsebox');
      const results = searchIndex(testIndexDir, 'query', 10);

      expect(results).toEqual(mockResults);
    });

    it('should parse results when hb returns hits format', () => {
      const mockExecFileSync = jest.spyOn(require('child_process'), 'execFileSync');
      const mockHits = [{ file: 'test.js', line: 1, content: 'test code' }];
      mockExecFileSync.mockReturnValue(JSON.stringify({ hits: mockHits }));

      const { searchIndex } = require('../src/lib/horsebox');
      const results = searchIndex(testIndexDir, 'query', 10);

      expect(results).toEqual(mockHits);
    });

    it('should call hb with correct arguments', () => {
      const mockExecFileSync = jest.spyOn(require('child_process'), 'execFileSync');
      mockExecFileSync.mockReturnValue('[]');

      const { searchIndex } = require('../src/lib/horsebox');
      searchIndex(testIndexDir, 'myQuery', 25);

      expect(mockExecFileSync).toHaveBeenCalledWith('hb', [
        'search',
        '--index', testIndexDir,
        '--query', 'myQuery',
        '--json',
        '--limit', '25'
      ], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe']
      });
    });

    it('should use default limit of 30 when not specified', () => {
      const mockExecFileSync = jest.spyOn(require('child_process'), 'execFileSync');
      mockExecFileSync.mockReturnValue('[]');

      const { searchIndex } = require('../src/lib/horsebox');
      searchIndex(testIndexDir, 'query');

      expect(mockExecFileSync).toHaveBeenCalledWith('hb', [
        'search',
        '--index', testIndexDir,
        '--query', 'query',
        '--json',
        '--limit', '30'
      ], expect.any(Object));
    });

    describe('caching', () => {
      it('should cache search results', () => {
        const mockExecFileSync = jest.spyOn(require('child_process'), 'execFileSync');
        const mockResults = [{ file: 'test.js', line: 1 }];
        mockExecFileSync.mockReturnValue(JSON.stringify(mockResults));

        const { searchIndex } = require('../src/lib/horsebox');
        const results1 = searchIndex(testIndexDir, 'cachedQuery', 10);
        const results2 = searchIndex(testIndexDir, 'cachedQuery', 10);

        expect(mockExecFileSync).toHaveBeenCalledTimes(1);
        expect(results1).toEqual(results2);
      });

      it('should not cache different queries', () => {
        const mockExecFileSync = jest.spyOn(require('child_process'), 'execFileSync');
        mockExecFileSync.mockReturnValue('[]');

        const { searchIndex } = require('../src/lib/horsebox');
        searchIndex(testIndexDir, 'query1', 10);
        searchIndex(testIndexDir, 'query2', 10);

        expect(mockExecFileSync).toHaveBeenCalledTimes(2);
      });

      it('should not cache different limits', () => {
        const mockExecFileSync = jest.spyOn(require('child_process'), 'execFileSync');
        mockExecFileSync.mockReturnValue('[]');

        const { searchIndex } = require('../src/lib/horsebox');
        searchIndex(testIndexDir, 'query', 10);
        searchIndex(testIndexDir, 'query', 20);

        expect(mockExecFileSync).toHaveBeenCalledTimes(2);
      });

      it('should not cache different index directories', () => {
        const mockExecFileSync = jest.spyOn(require('child_process'), 'execFileSync');
        mockExecFileSync.mockReturnValue('[]');

        const { searchIndex } = require('../src/lib/horsebox');
        searchIndex('/index1', 'query', 10);
        searchIndex('/index2', 'query', 10);

        expect(mockExecFileSync).toHaveBeenCalledTimes(2);
      });
    });

    it('should throw when hb returns invalid JSON', () => {
      const mockExecFileSync = jest.spyOn(require('child_process'), 'execFileSync');
      mockExecFileSync.mockReturnValue('not valid json {{{');

      const { searchIndex } = require('../src/lib/horsebox');

      expect(() => {
        searchIndex('/test/index', 'query', 10);
      }).toThrow();
    });
  });
});
