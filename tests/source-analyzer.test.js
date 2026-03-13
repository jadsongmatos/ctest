const path = require('path');
const fs = require('fs');
const {
  analyzeSourceFile,
  scanSourceFiles,
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
  });
});
