# External tests for horsebox.js

**Arquivo:** `/workspaces/ctest/src/lib/horsebox.js`

## child_process

**Consultas usadas no Horsebox:** `execFileSync`, `child_process execFileSync`

**Arquivos de teste encontrados:** 92

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-worker/src/workers/__tests__/ChildProcessWorker.test.ts

#### passes fork options down to child_process.fork, adding the defaults

```ts
it('passes fork options down to child_process.fork, adding the defaults', () => {
  const child = require.resolve('../processChild');

  process.execArgv = ['--inspect', '-p'];

  // eslint-disable-next-line no-new
  new Worker({
    forkOptions: {
      cwd: '/tmp',
      execPath: 'hello',
    },
    maxRetries: 3,
    workerId: Number(process.env.JEST_WORKER_ID) - 1,
    workerPath: '/tmp/foo/bar/baz.js',
  } as WorkerOptions);

  expect(jest.mocked(childProcess.fork).mock.calls[0][0]).toBe(child);
  expect(jest.mocked(childProcess.fork).mock.calls[0][2]).toEqual({
    cwd: '/tmp', // Overridden default option.
    env: process.env, // Default option.
    execArgv: ['-p'], // Filtered option.
    execPath: 'hello', // Added option.
    serialization: 'advanced', // Default option.
    silent: true, // Default option.
  });
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-haste-map/src/crawlers/__tests__/node.test.js

#### crawls for files based on patterns

```ts
it('crawls for files based on patterns', async () => {
    childProcess = require('child_process');
    nodeCrawl = require('../node').nodeCrawl;

    mockResponse = [
      '/project/fruits/pear.js',
      '/project/fruits/strawberry.js',
      '/project/fruits/tomato.js',
      '/project/vegetables/melon.json',
    ].join('\n');

    const {hasteMap, removedFiles} = await nodeCrawl({
      data: {
        files: new Map(),
      },
      extensions: ['js', 'json'],
      ignore: pearMatcher,
      rootDir,
      roots: ['/project/fruits', '/project/vegetables'],
    });

    expect(childProcess.spawn).toHaveBeenLastCalledWith('find', [
      '/project/fruits',
      '/project/vegetables',
      '-type',
      'f',
      '(',
      '-iname',
      '*.js',
      '-o',
      '-iname',
      '*.json',
      ')',
    ]);

    expect(hasteMap.files).not.toBeNull();

    expect(hasteMap.files).toEqual(
      createMap({
        'fruits/strawberry.js': ['', 32, 42, 0, '', null],
        'fruits/tomato.js': ['', 33, 42, 0, '', null],
        'vegetables/melon.json': ['', 34, 42, 0, '', null],
      }),
    );

    expect(removedFiles).toEqual(new Map());
  }
```

#### uses node fs APIs with incompatible find binary

```ts
it('uses node fs APIs with incompatible find binary', async () => {
    mockResponse = '';
    mockSpawnExit = 1;
    childProcess = require('child_process');

    nodeCrawl = require('../node').nodeCrawl;

    const {hasteMap, removedFiles} = await nodeCrawl({
      data: {
        files: new Map(),
      },
      extensions: ['js'],
      ignore: pearMatcher,
      rootDir,
      roots: ['/project/fruits'],
    });

    expect(childProcess.spawn).toHaveBeenLastCalledWith(
      'find',
      ['.', '-type', 'f', '(', '-iname', '*.ts', '-o', '-iname', '*.js', ')'],
      {cwd: expect.any(String)},
    );
    expect(hasteMap.files).toEqual(
      createMap({
        'fruits/directory/strawberry.js': ['', 33, 42, 0, '', null],
        'fruits/tomato.js': ['', 32, 42, 0, '', null],
      }),
    );
    expect(removedFiles).toEqual(new Map());
  }
```

#### uses node fs APIs without find binary

```ts
it('uses node fs APIs without find binary', async () => {
    childProcess = require('child_process');
    childProcess.spawn.mockImplementationOnce(() => {
      throw new Error();
    });
    nodeCrawl = require('../node').nodeCrawl;

    const {hasteMap, removedFiles} = await nodeCrawl({
      data: {
        files: new Map(),
      },
      extensions: ['js'],
      ignore: pearMatcher,
      rootDir,
      roots: ['/project/fruits'],
    });

    expect(hasteMap.files).toEqual(
      createMap({
        'fruits/directory/strawberry.js': ['', 33, 42, 0, '', null],
        'fruits/tomato.js': ['', 32, 42, 0, '', null],
      }),
    );
    expect(removedFiles).toEqual(new Map());
  }
```

#### uses node fs APIs if "forceNodeFilesystemAPI" is set to true, regardless of platform

```ts
it('uses node fs APIs if "forceNodeFilesystemAPI" is set to true, regardless of platform', async () => {
    childProcess = require('child_process');
    nodeCrawl = require('../node').nodeCrawl;

    const files = new Map();
    const {hasteMap, removedFiles} = await nodeCrawl({
      data: {files},
      extensions: ['js'],
      forceNodeFilesystemAPI: true,
      ignore: pearMatcher,
      rootDir,
      roots: ['/project/fruits'],
    });

    expect(childProcess.spawn).toHaveBeenCalledTimes(0);
    expect(hasteMap.files).toEqual(
      createMap({
        'fruits/directory/strawberry.js': ['', 33, 42, 0, '', null],
        'fruits/tomato.js': ['', 32, 42, 0, '', null],
      }),
    );
    expect(removedFiles).toEqual(new Map());
  }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/detectOpenHandles.ts

#### does not report child_process using unref

```ts
it('does not report child_process using unref', () => {
  // The test here is basically that it exits cleanly without reporting anything (does not need `until`)
  const {stderr} = runJest('detect-open-handles', [
    'child_process',
    '--detectOpenHandles',
  ]);
  const textAfterTest = getTextAfterTest(stderr);

  expect(textAfterTest).toBe('');
}
```

