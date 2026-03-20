const fs = require('fs');
const os = require('os');
const path = require('path');

jest.mock('fs');
jest.mock('os');

const {
  uniq,
  normalizeLibraryNames,
  isTestFile,
  safeReadFile,
  getCacheDir,
} = require('../src/lib/utils');

describe('Utils Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('uniq', () => {
    it('should remove duplicates from array', () => {
      const result = uniq([1, 2, 2, 3, 3, 3]);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should preserve order', () => {
      const result = uniq([3, 1, 2, 1, 3]);
      expect(result).toEqual([3, 1, 2]);
    });

    it('should filter out null and undefined', () => {
      const result = uniq([1, null, 2, undefined, 3, null]);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should filter out empty strings', () => {
      const result = uniq(['a', '', 'b', '', 'c']);
      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should handle empty array', () => {
      const result = uniq([]);
      expect(result).toEqual([]);
    });

    it('should handle array with all duplicates', () => {
      const result = uniq([5, 5, 5, 5]);
      expect(result).toEqual([5]);
    });
  });

  describe('normalizeLibraryNames', () => {
    it('should return original name', () => {
      const result = normalizeLibraryNames('express');
      expect(result).toContain('express');
    });

    it('should handle scoped packages', () => {
      const result = normalizeLibraryNames('@scope/package');
      expect(result).toContain('@scope/package');
      expect(result).toContain('scope/package');
      expect(result).toContain('package');
    });

    it('should handle packages with slashes', () => {
      const result = normalizeLibraryNames('lodash/fp');
      expect(result).toContain('lodash/fp');
      expect(result).toContain('fp');
    });

    it('should handle scoped packages with slashes', () => {
      const result = normalizeLibraryNames('@babel/core');
      expect(result).toContain('@babel/core');
      expect(result).toContain('babel/core');
      expect(result).toContain('core');
    });

    it('should filter out empty strings', () => {
      const result = normalizeLibraryNames('');
      expect(result).not.toContain('');
    });

    it('should return array', () => {
      const result = normalizeLibraryNames('express');
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('isTestFile', () => {
    it('should identify test files by extension pattern', () => {
      expect(isTestFile('app.test.js')).toBe(true);
      expect(isTestFile('app.spec.js')).toBe(true);
      expect(isTestFile('app.test.ts')).toBe(true);
      expect(isTestFile('app.spec.ts')).toBe(true);
      expect(isTestFile('app.test.jsx')).toBe(true);
      expect(isTestFile('app.test.tsx')).toBe(true);
      expect(isTestFile('app.test.mjs')).toBe(true);
      expect(isTestFile('app.test.cjs')).toBe(true);
    });

    it('should identify test files by name pattern', () => {
      expect(isTestFile('app.test.js')).toBe(true);
      expect(isTestFile('app.spec.js')).toBe(true);
      expect(isTestFile('app.test.ts')).toBe(true);
      expect(isTestFile('app.spec.ts')).toBe(true);
    });

    it('should identify files in test directories', () => {
      expect(isTestFile('tests/test.js')).toBe(true);
      expect(isTestFile('test/test.js')).toBe(true);
      expect(isTestFile('__tests__/test.js')).toBe(true);
      expect(isTestFile('specs/test.js')).toBe(true);
      expect(isTestFile('spec/test.js')).toBe(true);
    });

    it('should handle Windows paths', () => {
      expect(isTestFile('tests\\test.js')).toBe(true);
      expect(isTestFile('__tests__\\test.js')).toBe(true);
    });

    it('should reject non-test files', () => {
      expect(isTestFile('app.js')).toBe(false);
      expect(isTestFile('utils.ts')).toBe(false);
      expect(isTestFile('index.jsx')).toBe(false);
    });

    it('should reject files in non-test directories', () => {
      expect(isTestFile('src/app.js')).toBe(false);
      expect(isTestFile('lib/utils.js')).toBe(false);
    });

    it('should be case insensitive for extensions', () => {
      expect(isTestFile('app.TEST.js')).toBe(true);
      expect(isTestFile('app.SPEC.ts')).toBe(true);
    });
  });

  describe('safeReadFile', () => {
    it('should read file content', () => {
      fs.readFileSync.mockReturnValue('file content');

      const result = safeReadFile('/test/file.js');

      expect(result).toBe('file content');
      expect(fs.readFileSync).toHaveBeenCalledWith('/test/file.js', 'utf8');
    });

    it('should return null if file does not exist', () => {
      fs.readFileSync.mockImplementation(() => {
        throw new Error('ENOENT');
      });

      const result = safeReadFile('/test/nonexistent.js');

      expect(result).toBeNull();
    });

    it('should return null on read error', () => {
      fs.readFileSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });

      const result = safeReadFile('/test/protected.js');

      expect(result).toBeNull();
    });

    it('should handle empty file', () => {
      fs.readFileSync.mockReturnValue('');

      const result = safeReadFile('/test/empty.js');

      expect(result).toBe('');
    });
  });

  describe('getCacheDir', () => {
    it('should return cache directory path', () => {
      os.homedir.mockReturnValue('/home/user');
      fs.existsSync.mockReturnValue(true);

      const result = getCacheDir();

      expect(result).toBe('/home/user/.ctest/repos');
    });

    it('should create cache directory if it does not exist', () => {
      os.homedir.mockReturnValue('/home/user');
      fs.existsSync.mockReturnValue(false);

      getCacheDir();

      // Should use restrictive permissions (mode 0o700) for security
      expect(fs.mkdirSync).toHaveBeenCalledWith('/home/user/.ctest/repos', { recursive: true, mode: 0o700 });
    });

    it('should use correct default cache path', () => {
      os.homedir.mockReturnValue('/Users/testuser');
      fs.existsSync.mockReturnValue(true);

      const result = getCacheDir();

      expect(result).toBe('/Users/testuser/.ctest/repos');
    });

    it('should handle Windows home directory', () => {
      os.homedir.mockReturnValue('C:\\Users\\testuser');
      fs.existsSync.mockReturnValue(true);

      const result = getCacheDir();

      expect(result).toContain('.ctest');
      expect(result).toContain('repos');
    });
  });
});
