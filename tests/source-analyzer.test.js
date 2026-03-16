const fs = require('fs');
const path = require('path');

jest.mock('fs');
jest.mock('@babel/parser');

const parser = require('@babel/parser');
const {
  analyzeSourceFile,
  scanSourceFiles,
  parseGitIgnore,
  patternToRegex,
  shouldIgnore,
} = require('../src/lib/source-analyzer');

describe('Source Analyzer Module', () => {
  const testFile = '/test/project/src/app.js';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('parseGitIgnore', () => {
    it('should parse gitignore patterns', () => {
      const gitIgnoreContent = `
# Comment
node_modules
*.log
dist/
`;
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(gitIgnoreContent);

      const patterns = parseGitIgnore('/test/project');

      expect(patterns).toEqual(['node_modules', '*.log', 'dist/']);
    });

    it('should skip empty lines and comments', () => {
      const gitIgnoreContent = `
# This is a comment
node_modules

# Another comment
*.log
`;
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(gitIgnoreContent);

      const patterns = parseGitIgnore('/test/project');

      expect(patterns).toEqual(['node_modules', '*.log']);
    });

    it('should return empty array if gitignore does not exist', () => {
      fs.existsSync.mockReturnValue(false);

      const patterns = parseGitIgnore('/test/project');

      expect(patterns).toEqual([]);
    });

    it('should handle read errors gracefully', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockImplementation(() => {
        throw new Error('Read error');
      });

      const patterns = parseGitIgnore('/test/project');

      expect(patterns).toEqual([]);
    });
  });

  describe('patternToRegex', () => {
    it('should convert simple pattern to regex', () => {
      const regex = patternToRegex('node_modules');
      expect(regex.test('node_modules')).toBe(true);
      expect(regex.test('src/node_modules')).toBe(true);
    });

    it('should handle wildcard patterns', () => {
      const regex = patternToRegex('*.log');
      expect(regex.test('error.log')).toBe(true);
      expect(regex.test('debug.log')).toBe(true);
    });

    it('should handle anchored patterns', () => {
      const regex = patternToRegex('/dist');
      expect(regex.test('dist')).toBe(true);
    });

    it('should handle directory patterns', () => {
      const regex = patternToRegex('dist/');
      expect(regex.test('dist/file.js')).toBe(true);
    });

    it('should handle patterns with slash', () => {
      const regex = patternToRegex('src/utils');
      expect(regex.test('src/utils')).toBe(true);
    });

    it('should escape special regex characters', () => {
      const regex = patternToRegex('file.txt');
      expect(regex.test('filetxt')).toBe(false);
      expect(regex.test('file.txt')).toBe(true);
    });
  });

  describe('shouldIgnore', () => {
    it('should match patterns', () => {
      const patterns = ['node_modules'];
      const result = shouldIgnore('/project/node_modules/pkg/index.js', patterns, '/project');
      expect(result).toBe(true);
    });

    it('should not match non-matching patterns', () => {
      const patterns = ['dist'];
      const result = shouldIgnore('/project/src/index.js', patterns, '/project');
      expect(result).toBe(false);
    });

    it('should handle empty patterns', () => {
      const patterns = [];
      const result = shouldIgnore('/project/src/index.js', patterns, '/project');
      expect(result).toBe(false);
    });
  });

  describe('analyzeSourceFile', () => {
    it('should return empty object if file does not exist', () => {
      fs.existsSync.mockReturnValue(false);

      const result = analyzeSourceFile(testFile);

      expect(result).toEqual({});
    });

    it('should handle parse errors gracefully', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('invalid code {{{');
      parser.parse.mockImplementation(() => {
        throw new Error('Parse error');
      });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const result = analyzeSourceFile(testFile);

      expect(result).toEqual({});
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('scanSourceFiles', () => {
    it('should scan directory for source files', () => {
      const rootEntries = [
        { name: 'src', isDirectory: () => true, isFile: () => false },
        { name: 'index.js', isDirectory: () => false, isFile: () => true },
      ];
      const srcEntries = [
        { name: 'app.ts', isDirectory: () => false, isFile: () => true },
      ];

      fs.readdirSync
        .mockReturnValueOnce(rootEntries)
        .mockReturnValueOnce(srcEntries);
      fs.existsSync.mockReturnValue(false);

      const files = scanSourceFiles('/test/project');

      expect(files).toContain('/test/project/index.js');
      expect(files).toContain('/test/project/src/app.ts');
    });

    it('should ignore node_modules', () => {
      const mockEntries = [
        { name: 'node_modules', isDirectory: () => true, isFile: () => false },
        { name: 'index.js', isDirectory: () => false, isFile: () => true },
      ];

      fs.readdirSync.mockReturnValue(mockEntries);
      fs.existsSync.mockReturnValue(false);

      const files = scanSourceFiles('/test/project');

      expect(files).not.toContain('/test/project/node_modules');
    });

    it('should respect gitignore patterns', () => {
      const mockEntries = [
        { name: 'dist', isDirectory: () => true, isFile: () => false },
        { name: 'index.js', isDirectory: () => false, isFile: () => true },
      ];

      fs.readdirSync.mockReturnValue(mockEntries);
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('dist/');

      const files = scanSourceFiles('/test/project');

      expect(files).toContain('/test/project/index.js');
    });

    it('should handle excludeDirs option', () => {
      const mockEntries = [
        { name: 'custom-ignore', isDirectory: () => true, isFile: () => false },
        { name: 'index.js', isDirectory: () => false, isFile: () => true },
      ];

      fs.readdirSync.mockReturnValue(mockEntries);
      fs.existsSync.mockReturnValue(false);

      const files = scanSourceFiles('/test/project', { excludeDirs: ['custom-ignore'] });

      expect(files).toContain('/test/project/index.js');
    });

    it('should disable gitignore when respectGitIgnore is false', () => {
      const mockEntries = [
        { name: 'dist', isDirectory: () => true, isFile: () => false },
        { name: 'index.js', isDirectory: () => false, isFile: () => true },
      ];

      fs.readdirSync.mockReturnValue(mockEntries);
      fs.existsSync.mockReturnValue(true);

      const files = scanSourceFiles('/test/project', { respectGitIgnore: false });

      expect(fs.existsSync).not.toHaveBeenCalled();
    });

    it('should handle various source file extensions', () => {
      const mockEntries = [
        { name: 'file.js', isDirectory: () => false, isFile: () => true },
        { name: 'file.jsx', isDirectory: () => false, isFile: () => true },
        { name: 'file.mjs', isDirectory: () => false, isFile: () => true },
        { name: 'file.cjs', isDirectory: () => false, isFile: () => true },
        { name: 'file.ts', isDirectory: () => false, isFile: () => true },
        { name: 'file.tsx', isDirectory: () => false, isFile: () => true },
        { name: 'file.txt', isDirectory: () => false, isFile: () => true },
      ];

      fs.readdirSync.mockReturnValue(mockEntries);
      fs.existsSync.mockReturnValue(false);

      const files = scanSourceFiles('/test/project');

      expect(files).toHaveLength(6);
      expect(files).not.toContain('/test/project/file.txt');
    });
  });
});
