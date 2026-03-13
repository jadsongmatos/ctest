const fs = require('fs');
const path = require('path');
const os = require('os');

const {
  extractTestBlocks,
  extractRelevantBlocksFromFile,
} = require('../src/lib/test-extractor');

describe('test-extractor.js - Test Block Extraction', () => {
  describe('extractTestBlocks', () => {
    it('should extract test blocks with single quotes', () => {
      const content = `
        test('should do something', () => {
          expect(1).toBe(1);
        });
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks.length).toBe(1);
      expect(blocks[0].title).toBe('should do something');
      expect(blocks[0].code).toContain('test');
      expect(blocks[0].code).toContain('expect(1).toBe(1)');
    });

    it('should extract test blocks with double quotes', () => {
      const content = `
        test("should do something", () => {
          expect(1).toBe(1);
        });
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks.length).toBe(1);
      expect(blocks[0].title).toBe('should do something');
    });

    it('should extract test blocks with template literals', () => {
      const content = `
        test(\`should do something\`, () => {
          expect(1).toBe(1);
        });
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks.length).toBe(1);
      expect(blocks[0].title).toBe('should do something');
    });

    it('should extract it blocks', () => {
      const content = `
        it('should work', () => {
          expect(true).toBe(true);
        });
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks.length).toBe(1);
      expect(blocks[0].title).toBe('should work');
    });

    it('should extract multiple test blocks', () => {
      const content = `
        test('first test', () => {
          expect(1).toBe(1);
        });
        
        test('second test', () => {
          expect(2).toBe(2);
        });
        
        it('third test', () => {
          expect(3).toBe(3);
        });
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks.length).toBe(3);
      expect(blocks[0].title).toBe('first test');
      expect(blocks[1].title).toBe('second test');
      expect(blocks[2].title).toBe('third test');
    });

    it('should handle multi-line test titles', () => {
      const content = `
        test('should handle\\nmulti-line title', () => {
          expect(1).toBe(1);
        });
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks.length).toBe(1);
      expect(blocks[0].title).toContain('multi-line');
    });

    it('should handle nested test blocks', () => {
      const content = `
        describe('suite', () => {
          test('nested test', () => {
            expect(1).toBe(1);
          });
        });
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks.length).toBe(1);
      expect(blocks[0].title).toBe('nested test');
    });

    it('should handle test blocks with complex assertions', () => {
      const content = `
        test('complex test', () => {
          const obj = { a: 1, b: 2 };
          expect(obj.a).toBe(1);
          expect(obj.b).toBe(2);
          expect(obj).toHaveProperty('a');
        });
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks.length).toBe(1);
      expect(blocks[0].code).toContain('const obj');
      expect(blocks[0].code).toContain('expect(obj.a).toBe(1)');
    });

    it('should handle async test blocks', () => {
      const content = `
        test('async test', async () => {
          const result = await Promise.resolve(1);
          expect(result).toBe(1);
        });
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks.length).toBe(1);
      expect(blocks[0].title).toBe('async test');
      expect(blocks[0].code).toContain('async');
      expect(blocks[0].code).toContain('await');
    });

    it('should handle test blocks with done callback', () => {
      const content = `
        test('callback test', (done) => {
          setTimeout(() => {
            expect(1).toBe(1);
            done();
          }, 100);
        });
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks.length).toBe(1);
      expect(blocks[0].title).toBe('callback test');
      expect(blocks[0].code).toContain('done');
    });

    it('should handle empty test blocks', () => {
      const content = `
        test('empty test', () => {});
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks.length).toBe(1);
      expect(blocks[0].title).toBe('empty test');
      expect(blocks[0].code).toContain('{}');
    });

    it('should skip malformed test blocks without opening brace', () => {
      const content = `
        test('malformed test', someFunction);
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks.length).toBe(0);
    });

    it('should handle test blocks with template literals in body', () => {
      const content = `
        test('template test', () => {
          const str = \`hello \${name}\`;
          expect(str).toBe('hello world');
        });
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks.length).toBe(1);
      expect(blocks[0].code).toContain('template');
    });

    it('should handle test blocks with regex patterns', () => {
      const content = `
        test('regex test', () => {
          const pattern = /[0-9]+/;
          expect(pattern.test('123')).toBe(true);
        });
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks.length).toBe(1);
    });

    it('should trim test titles', () => {
      const content = `
        test('  trimmed title  ', () => {
          expect(1).toBe(1);
        });
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks.length).toBe(1);
      expect(blocks[0].title).toBe('trimmed title');
    });

    it('should handle skipped tests (test.skip, it.skip)', () => {
      const content = `
        test.skip('skipped test', () => {
          expect(1).toBe(1);
        });
        
        it.skip('also skipped', () => {
          expect(2).toBe(2);
        });
      `;
      const blocks = extractTestBlocks(content);
      // The regex uses \\b(?:test|it)\\s*\\( which doesn't match test.skip( or it.skip(
      // because there's a dot between test/it and the parenthesis
      expect(blocks.length).toBe(0);
    });

    it('should handle concurrent tests (test.concurrent)', () => {
      const content = `
        test.concurrent('concurrent test', () => {
          expect(1).toBe(1);
        });
      `;
      const blocks = extractTestBlocks(content);
      // The regex doesn't match test.concurrent due to the dot
      expect(blocks.length).toBe(0);
    });

    it('should handle test blocks with special characters in title', () => {
      const content = `
        test('should handle "quotes" and \'apostrophes\'', () => {
          expect(1).toBe(1);
        });
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks.length).toBe(1);
      expect(blocks[0].title).toContain('quotes');
    });

    it('should handle braces in strings within test blocks', () => {
      const content = `
        test('brace in string', () => {
          const str = '{not a brace}';
          expect(str).toBe('{not a brace}');
        });
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks.length).toBe(1);
      expect(blocks[0].code).toContain('{not a brace}');
    });

    it('should handle nested objects in test blocks', () => {
      const content = `
        test('nested object', () => {
          const obj = { a: { b: { c: 1 } } };
          expect(obj.a.b.c).toBe(1);
        });
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks.length).toBe(1);
      expect(blocks[0].code).toContain('const obj');
    });

    it('should handle functions within test blocks', () => {
      const content = `
        test('with function', () => {
          function helper() { return 1; }
          expect(helper()).toBe(1);
        });
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks.length).toBe(1);
    });

    it('should handle arrow functions within test blocks', () => {
      const content = `
        test('with arrow function', () => {
          const add = (a, b) => a + b;
          expect(add(1, 2)).toBe(3);
        });
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks.length).toBe(1);
    });

    it('should handle mixed quotes in test blocks', () => {
      const content = `
        test('mixed quotes', () => {
          const a = "double";
          const b = 'single';
          const c = \`template\`;
          expect(a + b + c).toBeDefined();
        });
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks.length).toBe(1);
    });

    it('should handle escaped quotes in test blocks', () => {
      const content = `
        test('escaped quotes', () => {
          const str = "escaped \\"quote\\"";
          expect(str).toContain('quote');
        });
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks.length).toBe(1);
    });

    it('should return empty array for content without tests', () => {
      const content = `
        function helper() {
          return 1;
        }
        module.exports = { helper };
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks).toEqual([]);
    });

    it('should return empty array for empty content', () => {
      const blocks = extractTestBlocks('');
      expect(blocks).toEqual([]);
    });

    it('should handle deeply nested structures in test blocks', () => {
      const content = `
        test('deep nesting', () => {
          const data = {
            level1: {
              level2: {
                level3: {
                  value: 'deep'
                }
              }
            }
          };
          expect(data.level1.level2.level3.value).toBe('deep');
        });
      `;
      const blocks = extractTestBlocks(content);
      expect(blocks.length).toBe(1);
    });
  });

  describe('extractRelevantBlocksFromFile', () => {
    let tempDir;
    let testFile;
    let nonExistentFile;

    beforeAll(() => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ctest-extractor-'));
      testFile = path.join(tempDir, 'test-file.test.js');
      nonExistentFile = path.join(tempDir, 'non-existent.test.js');
    });

    afterAll(() => {
      if (tempDir && fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('should extract relevant blocks from existing file', () => {
      const content = `
        test('should generate SBOM', () => {
          const result = generateSBOM('/path');
          expect(result).toBeDefined();
        });
        
        test('unrelated test', () => {
          expect(1).toBe(1);
        });
      `;
      fs.writeFileSync(testFile, content);

      const terms = ['generateSBOM', 'sbom'];
      const blocks = extractRelevantBlocksFromFile(testFile, terms);

      expect(blocks.length).toBe(1);
      expect(blocks[0].title).toBe('should generate SBOM');
      expect(blocks[0].code).toContain('generateSBOM');
    });

    it('should return empty array for non-existent file', () => {
      const terms = ['example'];
      const blocks = extractRelevantBlocksFromFile(nonExistentFile, terms);
      expect(blocks).toEqual([]);
    });

    it('should return empty array when no blocks match terms', () => {
      const content = `
        test('test one', () => {
          expect(1).toBe(1);
        });
        
        test('test two', () => {
          expect(2).toBe(2);
        });
      `;
      fs.writeFileSync(testFile, content);

      const terms = ['nonexistent', 'notfound'];
      const blocks = extractRelevantBlocksFromFile(testFile, terms);

      expect(blocks).toEqual([]);
    });

    it('should extract multiple matching blocks', () => {
      const content = `
        test('should generate SBOM', () => {
          const result = generateSBOM('/path');
          expect(result).toBeDefined();
        });
        
        test('should read SBOM', () => {
          const sbom = readSBOM('/path');
          expect(sbom).toBeDefined();
        });
        
        test('unrelated test', () => {
          expect(1).toBe(1);
        });
      `;
      fs.writeFileSync(testFile, content);

      const terms = ['SBOM'];
      const blocks = extractRelevantBlocksFromFile(testFile, terms);

      expect(blocks.length).toBe(2);
      expect(blocks[0].title).toContain('generate SBOM');
      expect(blocks[1].title).toContain('read SBOM');
    });

    it('should handle files with no test blocks', () => {
      const content = `
        function helper() {
          return 1;
        }
        module.exports = { helper };
      `;
      fs.writeFileSync(testFile, content);

      const terms = ['helper'];
      const blocks = extractRelevantBlocksFromFile(testFile, terms);

      expect(blocks).toEqual([]);
    });

    it('should handle empty files', () => {
      fs.writeFileSync(testFile, '');

      const terms = ['example'];
      const blocks = extractRelevantBlocksFromFile(testFile, terms);

      expect(blocks).toEqual([]);
    });

    it('should handle files with syntax errors gracefully', () => {
      const content = `
        test('incomplete test', () => {
          // missing closing brace
      `;
      fs.writeFileSync(testFile, content);

      const terms = ['incomplete'];
      const blocks = extractRelevantBlocksFromFile(testFile, terms);

      // Should return empty array since block can't be extracted
      expect(blocks).toEqual([]);
    });

    it('should handle TypeScript files', () => {
      const tsFile = path.join(tempDir, 'test-file.test.ts');
      const content = `
        test('typescript test', (): void => {
          const result: number = 1;
          expect(result).toBe(1);
        });
      `;
      fs.writeFileSync(tsFile, content);

      const terms = ['typescript'];
      const blocks = extractRelevantBlocksFromFile(tsFile, terms);

      expect(blocks.length).toBe(1);
      expect(blocks[0].title).toBe('typescript test');
    });

    it('should handle TSX files', () => {
      const tsxFile = path.join(tempDir, 'test-file.test.tsx');
      const content = `
        test('tsx test', () => {
          const element = <div>Hello</div>;
          expect(element).toBeDefined();
        });
      `;
      fs.writeFileSync(tsxFile, content);

      const terms = ['tsx'];
      const blocks = extractRelevantBlocksFromFile(tsxFile, terms);

      expect(blocks.length).toBe(1);
    });

    it('should handle files with mixed test frameworks', () => {
      const content = `
        test('jest test', () => {
          expect(1).toBe(1);
        });
        
        it('jasmine test', () => {
          expect(2).toBe(2);
        });
        
        describe('suite', () => {
          test('nested test', () => {
            expect(3).toBe(3);
          });
        });
      `;
      fs.writeFileSync(testFile, content);

      const terms = ['test'];
      const blocks = extractRelevantBlocksFromFile(testFile, terms);

      expect(blocks.length).toBe(3);
    });

    it('should be case insensitive when matching terms', () => {
      const content = `
        test('should Generate Sbom', () => {
          const result = generateSBOM('/path');
          expect(result).toBeDefined();
        });
      `;
      fs.writeFileSync(testFile, content);

      const terms = ['GENERATE'];
      const blocks = extractRelevantBlocksFromFile(testFile, terms);

      expect(blocks.length).toBe(1);
    });

    it('should match partial terms', () => {
      const content = `
        test('user authentication test', () => {
          expect(authenticate()).toBe(true);
        });
      `;
      fs.writeFileSync(testFile, content);

      const terms = ['auth'];
      const blocks = extractRelevantBlocksFromFile(testFile, terms);

      expect(blocks.length).toBe(1);
    });
  });

  describe('Integration Tests', () => {
    let tempDir;

    beforeAll(() => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ctest-integration-'));
    });

    afterAll(() => {
      if (tempDir && fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('should work end-to-end for library test extraction', () => {
      const testFile = path.join(tempDir, 'sbom.test.js');
      const content = `
        const { generateSBOM, readSBOM } = require('./lib/sbom');
        
        test('should generate SBOM for project', () => {
          const result = generateSBOM('/project/path');
          expect(result).toBeDefined();
        });
        
        test('should read SBOM file', () => {
          const sbom = readSBOM('/path/sbom.json');
          expect(sbom.components).toBeDefined();
        });
        
        test('unrelated utility test', () => {
          expect(1).toBe(1);
        });
      `;
      fs.writeFileSync(testFile, content);

      // Simulate searching for tests related to generateSBOM
      const terms = ['generateSBOM', 'sbom', './lib/sbom'];
      const blocks = extractRelevantBlocksFromFile(testFile, terms);

      expect(blocks.length).toBe(2);
      expect(blocks[0].title).toContain('generate SBOM');
      expect(blocks[1].title).toContain('read SBOM');
    });

    it('should extract path module tests', () => {
      const testFile = path.join(tempDir, 'path.test.js');
      const content = `
        const path = require('path');
        
        test('path resolve should work', () => {
          const resolved = path.resolve('/a', '/b');
          expect(resolved).toBe('/b');
        });
        
        test('path join should concatenate', () => {
          const joined = path.join('a', 'b', 'c');
          expect(joined).toContain('a');
        });
        
        test('path relative should calculate', () => {
          const relative = path.relative('/a/b', '/a/b/c');
          expect(relative).toBe('c');
        });
      `;
      fs.writeFileSync(testFile, content);

      const terms = ['resolve', 'join', 'relative', 'path'];
      const blocks = extractRelevantBlocksFromFile(testFile, terms);

      expect(blocks.length).toBe(3);
    });

    it('should extract fs module tests', () => {
      const testFile = path.join(tempDir, 'fs.test.js');
      const content = `
        const fs = require('fs');
        
        test('fs readFileSync should read file', () => {
          const content = fs.readFileSync('/path/file.txt', 'utf8');
          expect(content).toBeDefined();
        });
        
        test('fs writeFileSync should write file', () => {
          fs.writeFileSync('/path/file.txt', 'content');
          expect(true).toBe(true);
        });
      `;
      fs.writeFileSync(testFile, content);

      const terms = ['readFileSync', 'writeFileSync', 'fs'];
      const blocks = extractRelevantBlocksFromFile(testFile, terms);

      expect(blocks.length).toBe(2);
    });

    it('should extract utils module tests (from test-extractor.js.md)', () => {
      const testFile = path.join(tempDir, 'utils.test.js');
      const content = `
        const utils = require('./utils');
        
        test('if utils are mocked', () => {
          expect(utils.authorize.mock).toBeTruthy();
          expect(utils.isAuthorized.mock).toBeTruthy();
        });
        
        test('mocked implementation', () => {
          utils.authorize.mockReturnValue('mocked_token');
          utils.isAuthorized.mockReturnValue(true);
        
          expect(utils.authorize()).toBe('mocked_token');
          expect(utils.isAuthorized('not_wizard')).toBeTruthy();
        });
      `;
      fs.writeFileSync(testFile, content);

      const terms = ['utils', 'mocked', 'authorize'];
      const blocks = extractRelevantBlocksFromFile(testFile, terms);

      expect(blocks.length).toBe(2);
    });
  });

  describe('Edge Cases', () => {
    describe('extractTestBlocks edge cases', () => {
      it('should handle test function not at start of line', () => {
        const content = `
          if (condition) {
            test('conditional test', () => {
              expect(1).toBe(1);
            });
          }
        `;
        const blocks = extractTestBlocks(content);
        expect(blocks.length).toBe(1);
      });

      it('should handle test in IIFE', () => {
        const content = `
          (function() {
            test('iife test', () => {
              expect(1).toBe(1);
            });
          })();
        `;
        const blocks = extractTestBlocks(content);
        expect(blocks.length).toBe(1);
      });

      it('should handle very long test titles', () => {
        const longTitle = 'a'.repeat(500);
        const content = `test('${longTitle}', () => { expect(1).toBe(1); });`;
        const blocks = extractTestBlocks(content);
        expect(blocks.length).toBe(1);
        expect(blocks[0].title.length).toBe(500);
      });

      it('should handle test with only whitespace in body', () => {
        const content = `test('whitespace test', () => {   });`;
        const blocks = extractTestBlocks(content);
        expect(blocks.length).toBe(1);
      });

      it('should not match variables named test or it', () => {
        const content = `
          const test = 'not a test function';
          const it = 'not an it function';
          test('real test', () => {
            expect(1).toBe(1);
          });
        `;
        const blocks = extractTestBlocks(content);
        expect(blocks.length).toBe(1);
      });

      it('should handle test blocks with comments containing braces', () => {
        const content = `
          test('comment test', () => {
            // this is a {comment} with braces
            expect(1).toBe(1);
          });
        `;
        const blocks = extractTestBlocks(content);
        expect(blocks.length).toBe(1);
      });

      it('should handle test blocks with multi-line strings', () => {
        const content = `
          test('multiline string', () => {
            const str = \`line1
            line2
            line3\`;
            expect(str).toContain('line2');
          });
        `;
        const blocks = extractTestBlocks(content);
        expect(blocks.length).toBe(1);
      });
    });

    describe('extractRelevantBlocksFromFile edge cases', () => {
      it('should handle directory path instead of file', () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ctest-edge-'));
        const terms = ['test'];
        const blocks = extractRelevantBlocksFromFile(tempDir, terms);
        expect(blocks).toEqual([]);
        fs.rmSync(tempDir, { recursive: true, force: true });
      });

      it('should handle null/undefined file path', () => {
        const terms = ['test'];
        expect(extractRelevantBlocksFromFile(null, terms)).toEqual([]);
        expect(extractRelevantBlocksFromFile(undefined, terms)).toEqual([]);
      });

      it('should handle empty string file path', () => {
        const terms = ['test'];
        expect(extractRelevantBlocksFromFile('', terms)).toEqual([]);
      });

      it('should handle file with only comments', () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ctest-edge-'));
        const testFile = path.join(tempDir, 'comments.test.js');
        fs.writeFileSync(testFile, '// just a comment\n// no tests here');

        const terms = ['test'];
        const blocks = extractRelevantBlocksFromFile(testFile, terms);
        expect(blocks).toEqual([]);

        fs.rmSync(tempDir, { recursive: true, force: true });
      });

      it('should handle terms with special characters', () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ctest-edge-'));
        const testFile = path.join(tempDir, 'special.test.js');
        const content = `
          test('regex pattern [0-9]', () => {
            expect(/[0-9]+/.test('123')).toBe(true);
          });
        `;
        fs.writeFileSync(testFile, content);

        const terms = ['[0-9]'];
        const blocks = extractRelevantBlocksFromFile(testFile, terms);
        expect(blocks.length).toBe(1);

        fs.rmSync(tempDir, { recursive: true, force: true });
      });

      it('should handle empty terms array', () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ctest-edge-'));
        const testFile = path.join(tempDir, 'empty-terms.test.js');
        const content = `
          test('some test', () => {
            expect(1).toBe(1);
          });
        `;
        fs.writeFileSync(testFile, content);

        const terms = [];
        const blocks = extractRelevantBlocksFromFile(testFile, terms);
        expect(blocks).toEqual([]);

        fs.rmSync(tempDir, { recursive: true, force: true });
      });
    });
  });

  describe('safeReadFile usage (from test-extractor.js.md)', () => {
    let tempDir;

    beforeAll(() => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ctest-safe-'));
    });

    afterAll(() => {
      if (tempDir && fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('should use safeReadFile to read test files', () => {
      const testFile = path.join(tempDir, 'example.test.js');
      const content = `
        test('example', () => {
          expect(1).toBe(1);
        });
      `;
      fs.writeFileSync(testFile, content);

      const blocks = extractRelevantBlocksFromFile(testFile, ['example']);
      expect(blocks.length).toBe(1);
    });

    it('should handle file read errors via safeReadFile', () => {
      const blocks = extractRelevantBlocksFromFile('/non-existent/file.test.js', ['test']);
      expect(blocks).toEqual([]);
    });
  });
});
