const path = require('path');
const fs = require('fs');
const {
  extractTestBlocks,
  extractRelevantBlocksFromFile,
} = require('../src/lib/test-extractor');

describe('Test Extractor Module', () => {
  describe('extractTestBlocks', () => {
    it('should extract test blocks from code', () => {
      const code = `
        test('should do something', () => {
          expect(true).toBe(true);
        });

        it('should also work', () => {
          const result = 1 + 1;
          expect(result).toBe(2);
        });
      `;

      const blocks = extractTestBlocks(code);

      expect(blocks.length).toBe(2);
      expect(blocks[0].title).toBe('should do something');
      expect(blocks[1].title).toBe('should also work');
    });

    it('should handle nested braces', () => {
      const code = `
        test('should handle nested braces', () => {
          if (true) {
            const obj = { a: 1 };
            expect(obj.a).toBe(1);
          }
        });
      `;

      const blocks = extractTestBlocks(code);

      expect(blocks.length).toBe(1);
      expect(blocks[0].code).toContain('if (true)');
      expect(blocks[0].code).toContain('{ a: 1 }');
    });

    it('should handle template literals in tests', () => {
      const code = `
        test('should handle template literals', () => {
          const str = \`hello \${'world'}\`;
          expect(str).toBe('hello world');
        });
      `;

      const blocks = extractTestBlocks(code);

      expect(blocks.length).toBe(1);
    });

    it('should return empty array for code without tests', () => {
      const code = `
        function add(a, b) {
          return a + b;
        }
      `;

      const blocks = extractTestBlocks(code);
      expect(blocks).toEqual([]);
    });
  });

  describe('extractRelevantBlocksFromFile', () => {
    it('should extract relevant blocks containing search terms', () => {
      const testFile = path.join(__dirname, 'fixtures', 'sample.test.js');
      
      const content = `
        test('should test prisma upsert', () => {
          await prisma.component.upsert({
            where: { id: 1 },
            create: { name: 'test' },
            update: { name: 'updated' }
          });
        });

        test('should test something else', () => {
          expect(1).toBe(1);
        });
      `;

      fs.mkdirSync(path.dirname(testFile), { recursive: true });
      fs.writeFileSync(testFile, content);

      const terms = ['prisma', 'upsert', 'component'];
      const blocks = extractRelevantBlocksFromFile(testFile, terms);

      expect(blocks.length).toBe(1);
      expect(blocks[0].title).toContain('prisma upsert');

      fs.unlinkSync(testFile);
    });

    it('should return empty array if file does not exist', () => {
      const blocks = extractRelevantBlocksFromFile('/non-existent/file.test.js', ['test']);
      expect(blocks).toEqual([]);
    });

    it('should return empty array if no blocks match terms', () => {
      const testFile = path.join(__dirname, 'fixtures', 'sample2.test.js');
      
      const content = `
        test('should test unrelated thing', () => {
          expect(1).toBe(1);
        });
      `;

      fs.mkdirSync(path.dirname(testFile), { recursive: true });
      fs.writeFileSync(testFile, content);

      const terms = ['prisma', 'upsert'];
      const blocks = extractRelevantBlocksFromFile(testFile, terms);

      expect(blocks).toEqual([]);

      fs.unlinkSync(testFile);
    });
  });
});
