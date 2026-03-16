const path = require('path');
const fs = require('fs');
const {
  analyzeSourceFile,
  scanSourceFiles,
  parseGitIgnore,
  patternToRegex,
  shouldIgnore,
} = require('../src/lib/source-analyzer');

describe('Source Analyzer Module', () => {
  describe('analyzeSourceFile', () => {
    it('should detect require imports', () => {
      const testFile = path.join(__dirname, 'fixtures', 'test-require.js');
      
      const content = `
        const lodash = require('lodash');
        const { map } = require('lodash');
      `;

      fs.mkdirSync(path.dirname(testFile), { recursive: true });
      fs.writeFileSync(testFile, content);

      const result = analyzeSourceFile(testFile);

      expect(result['lodash']).toBeDefined();
      expect(result['lodash'].functions).toContain('map');

      fs.unlinkSync(testFile);
    });

    it('should detect ES6 imports', () => {
      const testFile = path.join(__dirname, 'fixtures', 'test-import.js');
      
      const content = `
        import lodash from 'lodash';
        import { map, filter } from 'lodash';
      `;

      fs.mkdirSync(path.dirname(testFile), { recursive: true });
      fs.writeFileSync(testFile, content);

      const result = analyzeSourceFile(testFile);

      expect(result['lodash']).toBeDefined();
      expect(result['lodash'].functions).toContain('map');
      expect(result['lodash'].functions).toContain('filter');

      fs.unlinkSync(testFile);
    });

    it('should detect member expressions', () => {
      const testFile = path.join(__dirname, 'fixtures', 'test-member.js');
      
      const content = `
        const _ = require('lodash');
        _.map([1, 2, 3], x => x * 2);
      `;

      fs.mkdirSync(path.dirname(testFile), { recursive: true });
      fs.writeFileSync(testFile, content);

      const result = analyzeSourceFile(testFile);

      expect(result['lodash']).toBeDefined();
      expect(result['lodash'].members['_']).toContain('map');

      fs.unlinkSync(testFile);
    });

    it('should detect chained member expressions', () => {
      const testFile = path.join(__dirname, 'fixtures', 'test-chain.js');
      
      const content = `
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        await prisma.component.upsert({});
      `;

      fs.mkdirSync(path.dirname(testFile), { recursive: true });
      fs.writeFileSync(testFile, content);

      const result = analyzeSourceFile(testFile);

      expect(result['@prisma/client']).toBeDefined();
      expect(result['@prisma/client'].chains).toContain('component.upsert');

      fs.unlinkSync(testFile);
    });

    it('should detect class instantiation', () => {
      const testFile = path.join(__dirname, 'fixtures', 'test-class.js');
      
      const content = `
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
      `;

      fs.mkdirSync(path.dirname(testFile), { recursive: true });
      fs.writeFileSync(testFile, content);

      const result = analyzeSourceFile(testFile);

      expect(result['@prisma/client']).toBeDefined();

      fs.unlinkSync(testFile);
    });

    it('should return empty object for non-existent file', () => {
      const result = analyzeSourceFile('/non-existent/file.js');
      expect(result).toEqual({});
    });

    it('should return empty object for file without imports', () => {
      const testFile = path.join(__dirname, 'fixtures', 'test-no-imports.js');

      const content = `
        function add(a, b) {
          return a + b;
        }
      `;

      fs.mkdirSync(path.dirname(testFile), { recursive: true });
      fs.writeFileSync(testFile, content);

      const result = analyzeSourceFile(testFile);
      expect(result).toEqual({});

      fs.unlinkSync(testFile);
    });

    it('should return empty object for files with parse errors', () => {
      const testFile = path.join(__dirname, 'fixtures', 'test-parse-error.js');

      // Code with duplicate identifier declaration (like the reported error)
      const content = `
        const rqFetcher = require('fetch');
        const rqFetcher = require('fetch2');
      `;

      fs.mkdirSync(path.dirname(testFile), { recursive: true });
      fs.writeFileSync(testFile, content);

      const result = analyzeSourceFile(testFile);
      
      // Should return empty object instead of throwing
      expect(result).toEqual({});

      fs.unlinkSync(testFile);
    });

    it('should handle TypeScript with type errors gracefully', () => {
      const testFile = path.join(__dirname, 'fixtures', 'test-ts-error.ts');

      const content = `
        const x: number = "string";
        const rqFetcher = fetch();
        const rqFetcher = fetch2();
      `;

      fs.mkdirSync(path.dirname(testFile), { recursive: true });
      fs.writeFileSync(testFile, content);

      const result = analyzeSourceFile(testFile);
      
      // Should handle gracefully even with type issues
      expect(result).toBeDefined();

      fs.unlinkSync(testFile);
    });

    it('should handle files with syntax errors gracefully', () => {
      const testFile = path.join(__dirname, 'fixtures', 'test-syntax-error.js');

      // Incomplete syntax
      const content = `
        function incomplete(
      `;

      fs.mkdirSync(path.dirname(testFile), { recursive: true });
      fs.writeFileSync(testFile, content);

      const result = analyzeSourceFile(testFile);
      
      // Should return empty object for unparseable files
      expect(result).toEqual({});

      fs.unlinkSync(testFile);
    });
  });

  describe('scanSourceFiles', () => {
    it('should scan directory for source files', () => {
      const testDir = path.join(__dirname, 'fixtures', 'scan-test');
      
      fs.mkdirSync(testDir, { recursive: true });
      fs.writeFileSync(path.join(testDir, 'file1.js'), 'console.log(1);');
      fs.writeFileSync(path.join(testDir, 'file2.ts'), 'console.log(2);');
      fs.mkdirSync(path.join(testDir, 'node_modules'), { recursive: true });
      fs.writeFileSync(path.join(testDir, 'node_modules', 'dep.js'), 'console.log(3);');

      const files = scanSourceFiles(testDir);

      expect(files.length).toBe(2);
      expect(files.some(f => f.endsWith('file1.js'))).toBe(true);
      expect(files.some(f => f.endsWith('file2.ts'))).toBe(true);

      fs.rmSync(testDir, { recursive: true, force: true });
    });

    it('should exclude test directories', () => {
      const testDir = path.join(__dirname, 'fixtures', 'scan-test2');

      fs.mkdirSync(testDir, { recursive: true });
      fs.writeFileSync(path.join(testDir, 'file.js'), 'console.log(1);');
      fs.mkdirSync(path.join(testDir, 'tests'), { recursive: true });
      fs.writeFileSync(path.join(testDir, 'tests', 'test.js'), 'test();');
      fs.mkdirSync(path.join(testDir, '__tests__'), { recursive: true });
      fs.writeFileSync(path.join(testDir, '__tests__', 'test.js'), 'test();');

      const files = scanSourceFiles(testDir);

      expect(files.length).toBe(1);
      expect(files[0]).toContain('file.js');

      fs.rmSync(testDir, { recursive: true, force: true });
    });

    it('should exclude custom directories via excludeDirs', () => {
      const testDir = path.join(__dirname, 'fixtures', 'scan-test-exclude');
      
      fs.mkdirSync(testDir, { recursive: true });
      fs.writeFileSync(path.join(testDir, 'src.js'), 'console.log(1);');
      const customDir = path.join(testDir, 'custom_modules');
      fs.mkdirSync(customDir, { recursive: true });
      fs.writeFileSync(path.join(customDir, 'dep.js'), 'console.log(2);');

      const files = scanSourceFiles(testDir, { excludeDirs: ['custom_modules'] });

      expect(files.length).toBe(1);
      expect(files[0]).toContain('src.js');
      expect(files.some(f => f.includes('custom_modules'))).toBe(false);

      fs.rmSync(testDir, { recursive: true, force: true });
    });
  });

  describe('parseGitIgnore', () => {
    it('should parse .gitignore file', () => {
      const testDir = fs.mkdtempSync(path.join(__dirname, 'fixtures', 'gitignore-test-'));
      const gitIgnoreContent = `
# Comment
node_modules/
*.log
dist/
.env
      `.trim();
      fs.writeFileSync(path.join(testDir, '.gitignore'), gitIgnoreContent);

      const patterns = parseGitIgnore(testDir);

      expect(patterns).toEqual(['node_modules/', '*.log', 'dist/', '.env']);

      fs.rmSync(testDir, { recursive: true, force: true });
    });

    it('should return empty array if .gitignore does not exist', () => {
      const testDir = fs.mkdtempSync(path.join(__dirname, 'fixtures', 'gitignore-test-'));
      const patterns = parseGitIgnore(testDir);
      expect(patterns).toEqual([]);
      fs.rmSync(testDir, { recursive: true, force: true });
    });

    it('should skip empty lines and comments', () => {
      const testDir = fs.mkdtempSync(path.join(__dirname, 'fixtures', 'gitignore-test-'));
      const gitIgnoreContent = `
# This is a comment
node_modules/

# Another comment
*.log

      `;
      fs.writeFileSync(path.join(testDir, '.gitignore'), gitIgnoreContent);

      const patterns = parseGitIgnore(testDir);

      expect(patterns).toEqual(['node_modules/', '*.log']);

      fs.rmSync(testDir, { recursive: true, force: true });
    });
  });

  describe('patternToRegex', () => {
    it('should convert simple pattern to regex', () => {
      const regex = patternToRegex('node_modules');
      expect(regex.test('node_modules')).toBe(true);
      expect(regex.test('src/node_modules')).toBe(true);
    });

    it('should convert wildcard pattern to regex', () => {
      const regex = patternToRegex('*.log');
      expect(regex.test('error.log')).toBe(true);
      expect(regex.test('debug.log')).toBe(true);
      expect(regex.test('file.txt')).toBe(false);
    });

    it('should convert directory pattern to regex', () => {
      const regex = patternToRegex('dist/');
      expect(regex.test('dist/')).toBe(true);
      expect(regex.test('dist/file.js')).toBe(true);
    });

    it('should handle anchored patterns (leading slash)', () => {
      const regex = patternToRegex('/root.txt');
      expect(regex.test('root.txt')).toBe(true);
      expect(regex.test('src/root.txt')).toBe(false);
    });

    it('should handle patterns with slashes', () => {
      const regex = patternToRegex('build/output.js');
      expect(regex.test('build/output.js')).toBe(true);
      // Patterns with slashes match from root, but also match nested in simplified implementation
      expect(regex.test('src/build/output.js')).toBe(true);
    });
  });

  describe('shouldIgnore', () => {
    it('should return true for matching patterns', () => {
      const patterns = ['node_modules/', '*.log'];
      expect(shouldIgnore('/project/node_modules/pkg/index.js', patterns, '/project')).toBe(true);
      expect(shouldIgnore('/project/error.log', patterns, '/project')).toBe(true);
    });

    it('should return false for non-matching patterns', () => {
      const patterns = ['node_modules/', '*.log'];
      expect(shouldIgnore('/project/src/index.js', patterns, '/project')).toBe(false);
      expect(shouldIgnore('/project/src/file.txt', patterns, '/project')).toBe(false);
    });
  });

  describe('scanSourceFiles with gitignore', () => {
    it('should respect .gitignore by default', () => {
      const testDir = fs.mkdtempSync(path.join(__dirname, 'fixtures', 'scan-gitignore-'));
      
      // Create .gitignore
      fs.writeFileSync(path.join(testDir, '.gitignore'), '*.ignore.js\n');
      
      // Create files
      fs.writeFileSync(path.join(testDir, 'normal.js'), 'console.log(1);');
      fs.writeFileSync(path.join(testDir, 'file.ignore.js'), 'console.log(2);');
      
      const files = scanSourceFiles(testDir);
      
      expect(files.length).toBe(1);
      expect(files[0]).toContain('normal.js');
      
      fs.rmSync(testDir, { recursive: true, force: true });
    });

    it('should ignore .gitignore when respectGitIgnore is false', () => {
      const testDir = fs.mkdtempSync(path.join(__dirname, 'fixtures', 'scan-no-gitignore-'));
      
      // Create .gitignore
      fs.writeFileSync(path.join(testDir, '.gitignore'), '*.ignore.js\n');
      
      // Create files
      fs.writeFileSync(path.join(testDir, 'normal.js'), 'console.log(1);');
      fs.writeFileSync(path.join(testDir, 'file.ignore.js'), 'console.log(2);');
      
      const files = scanSourceFiles(testDir, { respectGitIgnore: false });
      
      // Both files should be included
      expect(files.length).toBe(2);
      
      fs.rmSync(testDir, { recursive: true, force: true });
    });

    it('should handle directory patterns in .gitignore', () => {
      const testDir = fs.mkdtempSync(path.join(__dirname, 'fixtures', 'scan-gitignore-dir-'));
      
      // Create .gitignore
      fs.writeFileSync(path.join(testDir, '.gitignore'), 'generated/\n');
      
      // Create directories and files
      fs.mkdirSync(path.join(testDir, 'generated'), { recursive: true });
      fs.mkdirSync(path.join(testDir, 'src'), { recursive: true });
      fs.writeFileSync(path.join(testDir, 'generated', 'file.js'), 'console.log(1);');
      fs.writeFileSync(path.join(testDir, 'src', 'file.js'), 'console.log(2);');
      
      const files = scanSourceFiles(testDir);
      
      expect(files.length).toBe(1);
      expect(files[0]).toContain('src');
      
      fs.rmSync(testDir, { recursive: true, force: true });
    });
  });
});
