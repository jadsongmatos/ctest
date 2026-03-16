const fs = require('fs');
const path = require('path');

// Mock external dependencies only
jest.mock('../src/lib/horsebox');
jest.mock('../src/lib/test-extractor');

const { searchIndex } = require('../src/lib/horsebox');
const { extractRelevantBlocksFromFile } = require('../src/lib/test-extractor');
// Use real utils for normalizeLibraryNames and uniq
const { isTestFile } = require('../src/lib/utils');

const {
  writeMarkdownForSource,
  buildQueriesForUsage,
  buildTermList,
  shortenPath,
} = require('../src/lib/markdown-generator');

describe('Markdown Generator Module', () => {
  const testOutputDir = path.join(__dirname, 'fixtures', 'test-output');

  beforeEach(() => {
    jest.clearAllMocks();
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testOutputDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true, force: true });
    }
    jest.restoreAllMocks();
  });

  describe('buildQueriesForUsage', () => {
    it('should build queries from chains', () => {
      const usage = {
        chains: ['prisma.component.upsert', 'db.find'],
      };

      const queries = buildQueriesForUsage('prisma', usage);
      expect(queries).toContain('prisma.component.upsert');
      expect(queries).toContain('upsert');
      expect(queries).toContain('prisma upsert');
    });

    it('should build queries from functions', () => {
      const usage = {
        functions: ['connect', 'disconnect'],
      };

      const queries = buildQueriesForUsage('pg', usage);
      expect(queries).toContain('connect');
      expect(queries).toContain('pg connect');
      expect(queries).toContain('disconnect');
      expect(queries).toContain('pg disconnect');
    });

    it('should build queries from members', () => {
      const usage = {
        members: {
          client: ['query', 'execute'],
        },
      };

      const queries = buildQueriesForUsage('pg', usage);
      expect(queries).toContain('query');
      expect(queries).toContain('pg query');
      expect(queries).toContain('execute');
      expect(queries).toContain('pg execute');
    });

    it('should deduplicate queries', () => {
      const usage = {
        chains: ['lib.fn', 'lib.fn'],
        functions: ['fn'],
      };

      const queries = buildQueriesForUsage('lib', usage);
      const uniqueQueries = new Set(queries);
      expect(queries.length).toBe(uniqueQueries.size);
    });

    it('should filter out short queries', () => {
      const usage = {
        functions: ['a', 'abc'],
      };

      const queries = buildQueriesForUsage('lib', usage);
      expect(queries).not.toContain('a');
      expect(queries).toContain('abc');
    });

    it('should handle empty usage', () => {
      const queries = buildQueriesForUsage('lib', {});
      expect(queries).toEqual([]);
    });
  });

  describe('buildTermList', () => {
    it('should build terms from library name', () => {
      const terms = buildTermList('@scope/package', {});
      expect(terms).toContain('@scope/package');
      expect(terms).toContain('scope/package');
      expect(terms).toContain('package');
    });

    it('should build terms from chains', () => {
      const usage = {
        chains: ['prisma.user.find'],
      };

      const terms = buildTermList('prisma', usage);
      expect(terms).toContain('prisma.user.find');
      expect(terms).toContain('prisma');
      expect(terms).toContain('user');
      expect(terms).toContain('find');
    });

    it('should build terms from functions', () => {
      const usage = {
        functions: ['connect', 'query'],
      };

      const terms = buildTermList('pg', usage);
      expect(terms).toContain('connect');
      expect(terms).toContain('query');
    });

    it('should build terms from members', () => {
      const usage = {
        members: {
          client: ['execute', 'release'],
        },
      };

      const terms = buildTermList('pg', usage);
      expect(terms).toContain('execute');
      expect(terms).toContain('release');
    });

    it('should handle empty usage', () => {
      const terms = buildTermList('lib', {});
      expect(terms).toContain('lib');
    });

    it('should filter out empty terms', () => {
      const terms = buildTermList('', {});
      expect(terms).not.toContain('');
    });
  });

  describe('shortenPath', () => {
    it('should remove src/ prefix', () => {
      const result = shortenPath('/project/src/lib/horsebox.js', '/project');
      expect(result).toBe('lib/horsebox.js');
    });

    it('should handle paths without src/', () => {
      const result = shortenPath('/project/tests/test.js', '/project');
      expect(result).toBe('tests/test.js');
    });

    it('should handle empty path', () => {
      const result = shortenPath('', '/project');
      expect(result).toBe('');
    });

    it('should handle null path', () => {
      const result = shortenPath(null, '/project');
      expect(result).toBe('');
    });
  });

  describe('writeMarkdownForSource', () => {
    beforeEach(() => {
      searchIndex.mockReturnValue([]);
      extractRelevantBlocksFromFile.mockReturnValue([]);
    });

    it('should write markdown with no external libraries', async () => {
      const outputFile = path.join(testOutputDir, 'empty.md');

      await writeMarkdownForSource({
        sourceFile: '/project/src/empty.js',
        usage: {},
        outputFile,
        libsIndexDir: '/index',
        libsLineIndexDir: '/index-line',
        projectRoot: '/project',
      });

      const content = fs.readFileSync(outputFile, 'utf8');
      expect(content).toContain('# External tests for empty.js');
      expect(content).toContain('Nenhuma lib externa detectada neste arquivo.');
    });

    it('should write markdown with library usage', async () => {
      const outputFile = path.join(testOutputDir, 'usage.md');
      searchIndex.mockReturnValue([{ path: '/test/test.test.js' }]);
      extractRelevantBlocksFromFile.mockReturnValue([
        { title: 'should work', code: 'test("should work", () => {})' },
      ]);

      await writeMarkdownForSource({
        sourceFile: '/project/src/app.js',
        usage: {
          prisma: {
            chains: ['prisma.user.find'],
            functions: ['connect'],
            members: {},
          },
        },
        outputFile,
        libsIndexDir: testOutputDir,
        libsLineIndexDir: testOutputDir,
        projectRoot: '/project',
      });

      const content = fs.readFileSync(outputFile, 'utf8');
      expect(content).toContain('# External tests for app.js');
      expect(content).toContain('## prisma');
    });

    it('should handle missing index directories', async () => {
      const outputFile = path.join(testOutputDir, 'noindex.md');

      await writeMarkdownForSource({
        sourceFile: '/project/src/app.js',
        usage: {
          lib: { chains: [], functions: [], members: {} },
        },
        outputFile,
        libsIndexDir: null,
        libsLineIndexDir: null,
        projectRoot: '/project',
      });

      const content = fs.readFileSync(outputFile, 'utf8');
      expect(content).toContain('Nenhum arquivo de teste encontrado');
    });

    it('should include checklist in markdown', async () => {
      const outputFile = path.join(testOutputDir, 'checklist.md');

      await writeMarkdownForSource({
        sourceFile: '/project/src/app.js',
        usage: {
          lib1: { chains: [], functions: [], members: {} },
          lib2: { chains: [], functions: [], members: {} },
        },
        outputFile,
        libsIndexDir: testOutputDir,
        libsLineIndexDir: testOutputDir,
        projectRoot: '/project',
      });

      const content = fs.readFileSync(outputFile, 'utf8');
      expect(content).toContain('## Checklist');
      expect(content).toContain('- [ ] lib1');
      expect(content).toContain('- [ ] lib2');
    });

    it('should deduplicate test blocks', async () => {
      const outputFile = path.join(testOutputDir, 'dedup.md');
      searchIndex.mockReturnValue([{ path: '/test/test.test.js' }]);
      extractRelevantBlocksFromFile.mockReturnValue([
        { title: 'same test', code: 'test("same", () => {})' },
        { title: 'same test', code: 'test("same", () => {})' },
      ]);

      await writeMarkdownForSource({
        sourceFile: '/project/src/app.js',
        usage: {
          lib: { chains: ['lib.fn'], functions: [], members: {} },
        },
        outputFile,
        libsIndexDir: testOutputDir,
        libsLineIndexDir: testOutputDir,
        projectRoot: '/project',
      });

      const content = fs.readFileSync(outputFile, 'utf8');
      const occurrences = (content.match(/#### same test/g) || []).length;
      expect(occurrences).toBe(1);
    });

    it('should handle test files with ctest-work prefix', async () => {
      const outputFile = path.join(testOutputDir, 'work.md');
      searchIndex.mockReturnValue([{ path: '/tmp/ctest-work-abc/lib-name/tests/test.test.js' }]);
      extractRelevantBlocksFromFile.mockReturnValue([
        { title: 'test', code: 'test("test", () => {})' },
      ]);

      await writeMarkdownForSource({
        sourceFile: '/project/src/app.js',
        usage: {
          lib: { chains: ['lib.fn'], functions: [], members: {} },
        },
        outputFile,
        libsIndexDir: testOutputDir,
        libsLineIndexDir: testOutputDir,
        projectRoot: '/project',
      });

      const content = fs.readFileSync(outputFile, 'utf8');
      expect(content).toContain('lib-name/tests/test.test.js');
    });
  });
});
