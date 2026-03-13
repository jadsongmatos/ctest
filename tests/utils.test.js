const fs = require('fs');
const path = require('path');
const os = require('os');

const {
  uniq,
  normalizeLibraryNames,
  isTestFile,
  safeReadFile,
} = require('../src/lib/utils');

describe('utils.js - Utility Functions', () => {
  describe('uniq', () => {
    it('should remove duplicates from array', () => {
      const result = uniq([1, 2, 2, 3, 3, 3]);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle empty array', () => {
      const result = uniq([]);
      expect(result).toEqual([]);
    });

    it('should handle array with all identical items', () => {
      const result = uniq([5, 5, 5, 5]);
      expect(result).toEqual([5]);
    });

    it('should filter out falsy values (null, undefined)', () => {
      const result = uniq([1, null, 2, undefined, 3, null]);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should preserve order of first occurrence', () => {
      const result = uniq([3, 1, 2, 1, 3, 4]);
      expect(result).toEqual([3, 1, 2, 4]);
    });

    it('should handle strings', () => {
      const result = uniq(['a', 'b', 'a', 'c', 'b']);
      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should handle mixed types', () => {
      const result = uniq([1, '1', 2, '2', 1, '1']);
      expect(result).toEqual([1, '1', 2, '2']);
    });
  });

  describe('normalizeLibraryNames', () => {
    it('should return original name as first option', () => {
      const result = normalizeLibraryNames('lodash');
      expect(result).toContain('lodash');
    });

    it('should handle scoped packages', () => {
      const result = normalizeLibraryNames('@babel/parser');
      // Set deduplicates, so we get 3 unique values
      expect(result.length).toBe(3);
      expect(result).toContain('@babel/parser');
      expect(result).toContain('babel/parser');
      expect(result).toContain('parser');
    });

    it('should remove @ prefix from scoped packages', () => {
      const result = normalizeLibraryNames('@prisma/client');
      expect(result).toContain('prisma/client');
      expect(result).toContain('client');
    });

    it('should extract last part of path for regular packages', () => {
      const result = normalizeLibraryNames('express');
      expect(result).toContain('express');
    });

    it('should handle relative paths', () => {
      const result = normalizeLibraryNames('./lib/sbom');
      expect(result).toContain('./lib/sbom');
      expect(result).toContain('sbom');
    });

    it('should handle scoped package without path', () => {
      const result = normalizeLibraryNames('@types/node');
      // @types/node -> @types/node, types/node, node, node (deduped to 3)
      expect(result.length).toBe(3);
      expect(result).toContain('@types/node');
      expect(result).toContain('types/node');
      expect(result).toContain('node');
    });

    it('should filter out empty strings', () => {
      const result = normalizeLibraryNames('');
      expect(result).toEqual(['', '', '', ''].filter(Boolean));
      expect(result.length).toBe(0);
    });

    it('should return array with variations for scoped packages', () => {
      const result = normalizeLibraryNames('@scope/package');
      // @scope/package -> @scope/package, scope/package, package, package (deduped to 3)
      expect(result.length).toBe(3);
      expect(result).toContain('@scope/package');
      expect(result).toContain('scope/package');
      expect(result).toContain('package');
    });

    it('should handle packages with multiple slashes', () => {
      const result = normalizeLibraryNames('@scope/sub/package');
      expect(result).toContain('@scope/sub/package');
      expect(result).toContain('scope/sub/package');
      expect(result).toContain('package');
    });
  });

  describe('isTestFile', () => {
    it('should identify files with .test.js extension', () => {
      expect(isTestFile('/path/to/file.test.js')).toBe(true);
    });

    it('should identify files with .spec.js extension', () => {
      expect(isTestFile('/path/to/file.spec.js')).toBe(true);
    });

    it('should identify files with .test.ts extension', () => {
      expect(isTestFile('/path/to/file.test.ts')).toBe(true);
    });

    it('should identify files with .spec.ts extension', () => {
      expect(isTestFile('/path/to/file.spec.ts')).toBe(true);
    });

    it('should identify files with .test.tsx extension', () => {
      expect(isTestFile('/path/to/file.test.tsx')).toBe(true);
    });

    it('should identify files with .test.jsx extension', () => {
      expect(isTestFile('/path/to/file.test.jsx')).toBe(true);
    });

    it('should identify files with .test.mjs extension', () => {
      expect(isTestFile('/path/to/file.test.mjs')).toBe(true);
    });

    it('should identify files with .test.cjs extension', () => {
      expect(isTestFile('/path/to/file.test.cjs')).toBe(true);
    });

    it('should identify files in __tests__ directory', () => {
      expect(isTestFile('/path/to/__tests__/file.js')).toBe(true);
    });

    it('should identify files in tests directory', () => {
      expect(isTestFile('/path/to/tests/file.js')).toBe(true);
    });

    it('should identify files in test directory', () => {
      expect(isTestFile('/path/to/test/file.js')).toBe(true);
    });

    it('should identify files in specs directory', () => {
      expect(isTestFile('/path/to/specs/file.js')).toBe(true);
    });

    it('should identify files in spec directory', () => {
      expect(isTestFile('/path/to/spec/file.js')).toBe(true);
    });

    it('should handle Windows-style paths', () => {
      expect(isTestFile('C:\\path\\to\\file.test.js')).toBe(true);
      expect(isTestFile('C:\\path\\to\\__tests__\\file.js')).toBe(true);
    });

    it('should reject regular JS files', () => {
      expect(isTestFile('/path/to/file.js')).toBe(false);
    });

    it('should reject regular TS files', () => {
      expect(isTestFile('/path/to/file.ts')).toBe(false);
    });

    it('should reject files with test in name but not as pattern', () => {
      expect(isTestFile('/path/to/testing.js')).toBe(false);
      expect(isTestFile('/path/to/tester.js')).toBe(false);
    });

    it('should be case insensitive for extensions', () => {
      expect(isTestFile('/path/to/file.TEST.JS')).toBe(true);
      expect(isTestFile('/path/to/file.Spec.Js')).toBe(true);
    });
  });

  describe('safeReadFile', () => {
    let tempDir;
    let testFile;
    let nonExistentFile;

    beforeAll(() => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ctest-utils-'));
      testFile = path.join(tempDir, 'test.txt');
      nonExistentFile = path.join(tempDir, 'non-existent.txt');
      fs.writeFileSync(testFile, 'test content');
    });

    afterAll(() => {
      if (tempDir && fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('should read existing file successfully', () => {
      const content = safeReadFile(testFile);
      expect(content).toBe('test content');
    });

    it('should return null for non-existent file', () => {
      const content = safeReadFile(nonExistentFile);
      expect(content).toBeNull();
    });

    it('should return null for directory path', () => {
      const content = safeReadFile(tempDir);
      expect(content).toBeNull();
    });

    it('should handle permission errors gracefully', () => {
      const restrictedFile = path.join(tempDir, 'restricted.txt');
      fs.writeFileSync(restrictedFile, 'secret');
      fs.chmodSync(restrictedFile, '000');

      const content = safeReadFile(restrictedFile);
      expect(content).toBeNull();

      fs.chmodSync(restrictedFile, '644');
    });

    it('should read UTF-8 content correctly', () => {
      const utf8File = path.join(tempDir, 'utf8.txt');
      const utf8Content = 'Hello 世界 🌍';
      fs.writeFileSync(utf8File, utf8Content, 'utf8');

      const content = safeReadFile(utf8File);
      expect(content).toBe(utf8Content);
    });

    it('should handle empty files', () => {
      const emptyFile = path.join(tempDir, 'empty.txt');
      fs.writeFileSync(emptyFile, '');

      const content = safeReadFile(emptyFile);
      expect(content).toBe('');
    });

    it('should handle large files', () => {
      const largeFile = path.join(tempDir, 'large.txt');
      const largeContent = 'x'.repeat(1000000);
      fs.writeFileSync(largeFile, largeContent);

      const content = safeReadFile(largeFile);
      expect(content).toBe(largeContent);
    });

    it('should handle files with special characters', () => {
      const specialFile = path.join(tempDir, 'special.txt');
      const specialContent = 'Line 1\nLine 2\r\nLine 3\tTab';
      fs.writeFileSync(specialFile, specialContent);

      const content = safeReadFile(specialFile);
      expect(content).toBe(specialContent);
    });
  });

  describe('Integration Tests', () => {
    it('should work together for library analysis workflow', () => {
      const libName = '@babel/parser';
      const normalized = normalizeLibraryNames(libName);
      const unique = uniq(normalized);
      
      expect(unique).toContain('@babel/parser');
      expect(unique).toContain('parser');
    });

    it('should identify test files from normalized library names', () => {
      const testFiles = [
        '/path/to/lodash.test.js',
        '/path/to/__tests__/express.js',
        '/path/to/babel.spec.ts'
      ];

      testFiles.forEach(file => {
        expect(isTestFile(file)).toBe(true);
      });
    });

    it('should safely read test files identified by isTestFile', () => {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ctest-integration-'));
      const testFile = path.join(tempDir, 'example.test.js');
      const testContent = 'test("example", () => { expect(1).toBe(1); })';
      fs.writeFileSync(testFile, testContent);

      if (isTestFile(testFile)) {
        const content = safeReadFile(testFile);
        expect(content).toBe(testContent);
      }

      fs.rmSync(tempDir, { recursive: true, force: true });
    });
  });

  describe('Edge Cases', () => {
    describe('uniq edge cases', () => {
      it('should handle NaN values', () => {
        const result = uniq([NaN, NaN, 1, NaN]);
        // NaN is filtered out by filter(Boolean)
        expect(result).toEqual([1]);
      });

      it('should handle zero values', () => {
        const result = uniq([0, -0, 0, 1]);
        // 0 and -0 are filtered out by filter(Boolean)
        expect(result).toEqual([1]);
      });

      it('should handle boolean values', () => {
        const result = uniq([true, false, true, false]);
        // false is filtered out by filter(Boolean)
        expect(result).toEqual([true]);
      });

      it('should handle object references', () => {
        const obj = { a: 1 };
        const result = uniq([obj, obj, { a: 1 }]);
        expect(result).toEqual([obj, { a: 1 }]);
      });
    });

    describe('normalizeLibraryNames edge cases', () => {
      it('should handle already normalized names', () => {
        const result = normalizeLibraryNames('lodash');
        // For non-scoped packages, all 4 variations result in the same name
        // but Set deduplicates them
        expect(result).toEqual(['lodash']);
      });

      it('should handle names with leading/trailing spaces', () => {
        const result = normalizeLibraryNames(' lodash ');
        expect(result).toContain(' lodash ');
        // The split/pop will trim leading part but keep trailing space
        expect(result).toContain(' lodash ');
      });

      it('should handle empty string gracefully', () => {
        const result = normalizeLibraryNames('');
        const filtered = result.filter(Boolean);
        expect(filtered.length).toBe(0);
      });
    });

    describe('isTestFile edge cases', () => {
      it('should handle paths with multiple test patterns', () => {
        expect(isTestFile('/path/__tests__/file.test.js')).toBe(true);
      });

      it('should handle nested test directories', () => {
        expect(isTestFile('/src/components/__tests__/Button.test.tsx')).toBe(true);
      });

      it('should reject files that only contain test word', () => {
        expect(isTestFile('/path/to/testing/utils.js')).toBe(false);
        expect(isTestFile('/path/to/latest/file.js')).toBe(false);
      });

      it('should handle paths with special characters', () => {
        expect(isTestFile('/path/to/my-app.test.js')).toBe(true);
        expect(isTestFile('/path/to/@scope/pkg.test.js')).toBe(true);
      });
    });

    describe('safeReadFile edge cases', () => {
      it('should handle null/undefined paths gracefully', () => {
        expect(safeReadFile(null)).toBeNull();
        expect(safeReadFile(undefined)).toBeNull();
      });

      it('should handle empty string path', () => {
        expect(safeReadFile('')).toBeNull();
      });

      it('should handle very long paths', () => {
        const longPath = '/tmp/' + 'a/'.repeat(100) + 'file.txt';
        expect(safeReadFile(longPath)).toBeNull();
      });
    });
  });

  describe('fs.readFileSync usage (from utils.js.md)', () => {
    let tempDir;

    beforeAll(() => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ctest-fs-'));
    });

    afterAll(() => {
      if (tempDir && fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('should read file with utf8 encoding', () => {
      const testFile = path.join(tempDir, 'encoding.txt');
      const content = 'UTF-8 content with emojis 🎉';
      fs.writeFileSync(testFile, content, 'utf8');

      const result = safeReadFile(testFile);
      expect(result).toBe(content);
    });

    it('should handle file read errors gracefully', () => {
      const result = safeReadFile('/non-existent/path/file.txt');
      expect(result).toBeNull();
    });

    it('should work with Jest mocking of fs.readFileSync', () => {
      const mockContent = 'mocked content';
      jest.spyOn(fs, 'readFileSync').mockReturnValue(mockContent);

      const testFile = path.join(tempDir, 'mock-test.txt');
      const result = safeReadFile(testFile);

      expect(result).toBe(mockContent);
      expect(fs.readFileSync).toHaveBeenCalledWith(testFile, 'utf8');

      jest.restoreAllMocks();
    });
  });
});
