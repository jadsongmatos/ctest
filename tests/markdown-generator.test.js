const fs = require('fs');
const path = require('path');
const {
  writeMarkdownForSource,
  buildQueriesForUsage,
  buildTermList,
  shortenPath,
} = require('../src/lib/markdown-generator');
const { searchIndex } = require('../src/lib/horsebox');
const { extractRelevantBlocksFromFile } = require('../src/lib/test-extractor');

jest.mock('fs');
jest.mock('../src/lib/horsebox');
jest.mock('../src/lib/test-extractor');

describe('markdown-generator.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('shortenPath', () => {
    const projectRoot = '/home/user/project';

    it('should remove projectRoot and src prefix', () => {
      const fullPath = '/home/user/project/src/lib/utils.js';
      const result = shortenPath(fullPath, projectRoot);
      expect(result).toBe('lib/utils.js');
    });

    it('should remove projectRoot and handle files not in src', () => {
      const fullPath = '/home/user/project/scripts/test.js';
      const result = shortenPath(fullPath, projectRoot);
      expect(result).toBe('scripts/test.js');
    });

    it('should return relative path if src is not at the start', () => {
      const fullPath = '/home/user/project/other/src/file.js';
      const result = shortenPath(fullPath, projectRoot);
      expect(result).toBe('other/src/file.js');
    });

    it('should handle missing projectRoot', () => {
      const fullPath = 'src/lib/utils.js';
      const result = shortenPath(fullPath, null);
      expect(result).toBe('lib/utils.js');
    });
  });

  describe('buildQueriesForUsage', () => {
    it('should generate queries for chains, functions and members', () => {
      const usage = {
        chains: ['path.join', 'fs.readFileSync'],
        functions: ['uniq'],
        members: {
          'db': ['exec', 'prepare']
        }
      };
      const queries = buildQueriesForUsage('my-lib', usage);

      expect(queries).toContain('path.join');
      expect(queries).toContain('join');
      expect(queries).toContain('my-lib join');
      expect(queries).toContain('fs.readFileSync');
      expect(queries).toContain('readFileSync');
      expect(queries).toContain('my-lib readFileSync');
      expect(queries).toContain('uniq');
      expect(queries).toContain('my-lib uniq');
      expect(queries).toContain('exec');
      expect(queries).toContain('my-lib exec');
    });

    it('should handle scoped library names', () => {
      const usage = { functions: ['parse'] };
      const queries = buildQueriesForUsage('@babel/parser', usage);
      
      expect(queries).toContain('parse');
      expect(queries).toContain('@babel/parser parse');
      expect(queries).toContain('babel/parser parse');
      expect(queries).toContain('parser parse');
    });
  });

  describe('buildTermList', () => {
    it('should include library aliases and all usage parts', () => {
      const usage = {
        chains: ['a.b.c'],
        functions: ['f1'],
        members: { 'm1': ['p1'] }
      };
      const terms = buildTermList('my-lib', usage);

      expect(terms).toContain('my-lib');
      expect(terms).toContain('a.b.c');
      expect(terms).toContain('a');
      expect(terms).toContain('b');
      expect(terms).toContain('c');
      expect(terms).toContain('f1');
      expect(terms).toContain('p1');
    });
  });

  describe('writeMarkdownForSource', () => {
    const sourceFile = '/project/src/index.js';
    const outputFile = '/project/index.js.md';
    const projectRoot = '/project';

    it('should generate markdown with checklist and sections', async () => {
      const usage = {
        'fs': { functions: ['readFileSync'] },
        'path': { functions: ['join'] }
      };

      fs.existsSync.mockReturnValue(true);
      // Path must be a test file to be picked up by collectTestFilesFromHorsebox
      searchIndex.mockReturnValue([{ path: '/repo/tests/test1.test.js' }]);
      extractRelevantBlocksFromFile.mockReturnValue([
        { title: 'test block', code: 'console.log("hello");' }
      ]);

      await writeMarkdownForSource({
        sourceFile,
        usage,
        outputFile,
        libsIndexDir: '/tmp/idx',
        libsLineIndexDir: '/tmp/line-idx',
        projectRoot
      });

      expect(fs.writeFileSync).toHaveBeenCalled();
      const md = fs.writeFileSync.mock.calls[0][1];

      expect(md).toContain('# External tests for index.js');
      expect(md).toContain('**Arquivo:** `index.js`');
      expect(md).toContain('## Checklist');
      expect(md).toContain('- [ ] fs');
      expect(md).toContain('- [ ] path');
      expect(md).toContain('## fs');
      expect(md).toContain('## path');
      // shortenPath result for /repo/tests/test1.test.js when projectRoot is /project
      // results in ../repo/tests/test1.test.js
      expect(md).toContain('### ../repo/tests/test1.test.js');
      expect(md).toContain('#### test block');
      expect(md).toContain('```ts\nconsole.log("hello");\n```');
    });

    it('should handle no usage detected', async () => {
      const usage = {};

      await writeMarkdownForSource({
        sourceFile,
        usage,
        outputFile,
        projectRoot
      });

      expect(fs.writeFileSync).toHaveBeenCalled();
      const md = fs.writeFileSync.mock.calls[0][1];
      expect(md).toContain('Nenhuma lib externa detectada neste arquivo.');
    });

    it('should handle no tests found by Horsebox', async () => {
      const usage = { 'lib': { functions: ['f'] } };
      fs.existsSync.mockReturnValue(true);
      searchIndex.mockReturnValue([]);

      await writeMarkdownForSource({
        sourceFile,
        usage,
        outputFile,
        libsIndexDir: '/tmp/idx',
        libsLineIndexDir: '/tmp/line-idx',
        projectRoot
      });

      const md = fs.writeFileSync.mock.calls[0][1];
      expect(md).toContain('Nenhum arquivo de teste encontrado pelo Horsebox para esta lib.');
    });

    it('should handle candidate files with no relevant blocks', async () => {
      const usage = { 'lib': { functions: ['f'] } };
      fs.existsSync.mockReturnValue(true);
      searchIndex.mockReturnValue([{ path: '/repo/test.test.js' }]);
      extractRelevantBlocksFromFile.mockReturnValue([]);

      await writeMarkdownForSource({
        sourceFile,
        usage,
        outputFile,
        libsIndexDir: '/tmp/idx',
        libsLineIndexDir: '/tmp/line-idx',
        projectRoot
      });

      const md = fs.writeFileSync.mock.calls[0][1];
      expect(md).toContain('Horsebox encontrou arquivos candidatos, mas nenhum bloco `test()` / `it()` relevante foi extraído.');
    });

    it('should deduplicate blocks', async () => {
      const usage = { 'lib': { functions: ['f'] } };
      fs.existsSync.mockReturnValue(true);
      searchIndex.mockReturnValue([{ path: '/repo/test.test.js' }]);
      // Return same block twice
      extractRelevantBlocksFromFile.mockReturnValue([
        { title: 'same', code: 'code' },
        { title: 'same', code: 'code' }
      ]);

      await writeMarkdownForSource({
        sourceFile,
        usage,
        outputFile,
        libsIndexDir: '/tmp/idx',
        libsLineIndexDir: '/tmp/line-idx',
        projectRoot
      });

      const md = fs.writeFileSync.mock.calls[0][1];
      const occurrences = (md.match(/#### same/g) || []).length;
      expect(occurrences).toBe(1);
    });
  });
});
