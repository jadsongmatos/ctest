# External tests for sbom.js

**Arquivo:** `/workspaces/ctest/src/lib/sbom.js`

## child_process

**Consultas usadas no Horsebox:** `execSync`, `child_process execSync`

**Arquivos de teste encontrados:** 92

### /tmp/ctest-repos-nXQIAb/95324de690-parser/test/runtime-integration/node.cjs

#### ESM

```ts
test("ESM", "./src/main-esm.mjs", expectedEsm);
  // TODO: This never worked in any Babel version
  // test("ESM - absoluteRuntime", "--experimental-modules ./src/absolute/main-esm.mjs", "expected-esm-absolute.txt");
}

const expectedCjs =
  major === 10 || (major === 12 && minor < 12)
    ? "expected-cjs-10.txt"
    : (major === 13 && minor <= 1) || (major === 12 && minor < 16)
      ? "expected-cjs-13.0.txt"
      : major === 13 && minor <= 3
        ? "expected-cjs-13.2.txt"
        : major < 16 || (major === 16 && minor <= 5)
          ? "expected-cjs-16.0.txt"
          : major < 22 || (major === 22 && minor <= 11)
            ? "expected-cjs-22.11.txt"
            : major < 24
              ? "expected-cjs-23.10.txt"
              : "expected-cjs.txt";

test("CJS", "./src/main-cjs.cjs", expectedCjs);

const expectedCjsAbsolute =
  major === 10 || (major === 12 && minor < 12)
    ? "expected-cjs-absolute-10.txt"
    : (major === 13 && minor <= 1) || (major === 12 && minor < 16)
      ? "expected-cjs-absolute-13.0.txt"
      : major === 13 && minor <= 3
        ? "expected-cjs-absolute-13.2.txt"
        : major < 16 || (major === 16 && minor <= 5)
          ? "expected-cjs-absolute-16.0.txt"
          : major < 22 || (major === 22 && minor <= 11)
            ? "expected-cjs-absolute-22.11.txt"
            : major < 24
              ? "expected-cjs-absolute-23.10.txt"
              : "expected-cjs-absolute.txt";

test(
  "CJS - absoluteRuntime",
  "./src/absolute/main-cjs.cjs",
  expectedCjsAbsolute
);

function test(title, command, expectedName) {
  const expectedPath = path.join(__dirname, expectedName);
  const expected = fs.readFileSync(expectedPath, "utf8");

  console.log(`Testing with Node.js ${process.version} - ${title}`);
  const out = normalize(
    cp.execSync(
      `node ${
        major === 23 || (major === 22 && minor >= 12)
          ? "--disable-warning=ExperimentalWarning "
          : ""
      }${command}`,
      {
        cwd: __dirname,
        encoding: "utf8",
      }
    )
  );

  if (expected === out) {
    console.log("OK");
  } else if (process.env.OVERWRITE) {
    fs.writeFileSync(expectedPath, out);
    console.log("UPDATED");
  } else {
    console.error("FAILED\n\n");
    console.error(out);
    process.exitCode = 1;
  }
  console.log("\n");
}
```

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

## https

**Consultas usadas no Horsebox:** `get`, `https get`

**Arquivos de teste encontrados:** 147

Horsebox encontrou arquivos candidatos, mas nenhum bloco `test()` / `it()` relevante foi extraído.

## path

**Consultas usadas no Horsebox:** `resolve`, `path resolve`, `join`, `path join`

**Arquivos de teste encontrados:** 301

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/resolve/__tests__/resolve.test.js

#### should explicitly resolve filename.<platform>.js

```ts
test('should explicitly resolve filename.<platform>.js', () => {
  expect(testRequire('../test1.android.js')).not.toThrow();
  expect(platform.extension).toBe('android.js');
}
```

#### should explicitly resolve filename.native.js

```ts
test('should explicitly resolve filename.native.js', () => {
  expect(testRequire('../test1.native.js')).not.toThrow();
  expect(platform.extension).toBe('native.js');
}
```

#### should explicitly resolve filename.js

```ts
test('should explicitly resolve filename.js', () => {
  expect(testRequire('../test1.js')).not.toThrow();
  expect(platform.extension).toBe('js');
}
```

#### should explicitly resolve filename.json

```ts
test('should explicitly resolve filename.json', () => {
  expect(testRequire('../test1.json')).not.toThrow();
  expect(platform.extension).toBe('json');
}
```

#### should resolve filename.<platform>.js

```ts
test('should resolve filename.<platform>.js', () => {
  expect(testRequire('../test1')).not.toThrow();
  expect(platform.extension).toBe('android.js');
}
```

#### should resolve filename.<platform>.js from haste package

```ts
test('should resolve filename.<platform>.js from haste package', () => {
  expect(testRequire('custom-resolve/test1')).not.toThrow();
  expect(platform.extension).toBe('android.js');
}
```

#### should resolve filename.native.js

```ts
test('should resolve filename.native.js', () => {
  expect(testRequire('../test2')).not.toThrow();
  expect(platform.extension).toBe('native.js');
}
```

#### should resolve filename.native.js with moduleNameMapper

```ts
test('should resolve filename.native.js with moduleNameMapper', () => {
  expect(testRequire('test2mapper')).not.toThrow();
  expect(platform.extension).toBe('native.js');
}
```

#### should resolve filename.js

```ts
test('should resolve filename.js', () => {
  expect(testRequire('../test3')).not.toThrow();
  expect(platform.extension).toBe('js');
}
```

#### should resolve filename.json

```ts
test('should resolve filename.json', () => {
  expect(testRequire('../test4')).not.toThrow();
  expect(platform.extension).toBe('json');
}
```

#### should preserve identity for symlinks

```ts
test('should preserve identity for symlinks', () => {
  expect(require('../../../packages/jest-resolve')).toBe(
    require('jest-resolve'),
  );
}
```

#### should require resolve haste files correctly

```ts
test('should require resolve haste files correctly', () => {
  // We unmock Test5 (they should already be, but to be sure).
  jest.unmock('Test5');

  // Test5 is a standard module, that has a mock (but it is unmocked here).
  expect(require.resolve('Test5')).toBe(require.resolve('../Test5'));

  expect(require('Test5').key).toBe('real');

  // Test6 only exits as a mock; so even when unmocked, we resolve to the mock.
  expect(require.resolve('Test6')).toBe(require.resolve('../__mocks__/Test6'));

  expect(require('Test6').key).toBe('mock');
}
```

#### should require resolve haste mocks correctly

```ts
test('should require resolve haste mocks correctly', () => {
  // Now we mock Test5 and Test6.
  jest.mock('Test5');
  jest.mock('Test6');

  // The resolution still points to the real one, but requires the mock.
  expect(require.resolve('Test5')).toBe(require.resolve('../Test5'));

  expect(require('Test5').key).toBe('mock');

  // And Test6 points to the mock, because Test6 does not exist as a module.
  expect(require.resolve('Test6')).toBe(require.resolve('../__mocks__/Test6'));

  expect(require('Test6').key).toBe('mock');
}
```

#### should throw module not found error if the module has dependencies that cannot be found

```ts
test('should throw module not found error if the module has dependencies that cannot be found', () => {
  expect(() => require('Test7')).toThrow(
    expect.objectContaining({
      code: 'MODULE_NOT_FOUND',
      message: dedent`
        Cannot find module 'nope' from 'requiresUnexistingModule.js'

        Require stack:
          requiresUnexistingModule.js
          Test7.js
          __tests__/resolve.test.js\n
      `,
    }),
  );
}
```

#### should throw module not found error if the module cannot be found

```ts
test('should throw module not found error if the module cannot be found', () => {
  expect(() => require('Test8')).toThrow(
    expect.objectContaining({
      code: 'MODULE_NOT_FOUND',
      message: "Cannot find module 'Test8' from '__tests__/resolve.test.js'",
    }),
  );
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-resolve/src/__tests__/resolve.test.ts

#### returns false if `hasCoreModules` is false.

```ts
it('returns false if `hasCoreModules` is false.', () => {
    const moduleMap = ModuleMap.create('/');
    const resolver = new Resolver(moduleMap, {
      hasCoreModules: false,
    } as ResolverConfig);
    const isCore = resolver.isCoreModule('assert');
    expect(isCore).toBe(false);
  }
```

#### returns true if `hasCoreModules` is true and `moduleName` is a core module.

```ts
it('returns true if `hasCoreModules` is true and `moduleName` is a core module.', () => {
    const moduleMap = ModuleMap.create('/');
    const resolver = new Resolver(moduleMap, {} as ResolverConfig);
    const isCore = resolver.isCoreModule('assert');
    expect(isCore).toBe(true);
  }
```

#### returns false if `hasCoreModules` is true and `moduleName` is not a core module.

```ts
it('returns false if `hasCoreModules` is true and `moduleName` is not a core module.', () => {
    const moduleMap = ModuleMap.create('/');
    const resolver = new Resolver(moduleMap, {} as ResolverConfig);
    const isCore = resolver.isCoreModule('not-a-core-module');
    expect(isCore).toBe(false);
  }
```

#### returns false if `hasCoreModules` is true and `moduleNameMapper` alias a module same name with core module

```ts
it('returns false if `hasCoreModules` is true and `moduleNameMapper` alias a module same name with core module', () => {
    const moduleMap = ModuleMap.create('/');
    const resolver = new Resolver(moduleMap, {
      moduleNameMapper: [
        {
          moduleName: '$1',
          regex: /^constants$/,
        },
      ],
    } as ResolverConfig);
    const isCore = resolver.isCoreModule('constants');
    expect(isCore).toBe(false);
  }
```

#### returns true if using `node:` URLs and `moduleName` is a core module.

```ts
it('returns true if using `node:` URLs and `moduleName` is a core module.', () => {
    const moduleMap = ModuleMap.create('/');
    const resolver = new Resolver(moduleMap, {} as ResolverConfig);
    const isCore = resolver.isCoreModule('node:assert');
    expect(isCore).toBe(true);
  }
```

#### returns false if using `node:` URLs and `moduleName` is not a core module.

```ts
it('returns false if using `node:` URLs and `moduleName` is not a core module.', () => {
    const moduleMap = ModuleMap.create('/');
    const resolver = new Resolver(moduleMap, {} as ResolverConfig);
    const isCore = resolver.isCoreModule('node:not-a-core-module');
    expect(isCore).toBe(false);
  }
```

#### should resolve builtin modules as-is

```ts
it('should resolve builtin modules as-is', () => {
    expect(
      Resolver.findNodeModule('url', {
        basedir: __dirname,
      }),
    ).toBe('url');
    expect(
      Resolver.findNodeModule('node:url', {
        basedir: __dirname,
      }),
    ).toBe('node:url');
    expect(
      Resolver.findNodeModule('url/', {
        basedir: __dirname,
      }),
    ).toBe(path.resolve('node_modules/url/url.js'));
  }
```

#### is possible to override the default resolver

```ts
it('is possible to override the default resolver', () => {
    const cwd = process.cwd();
    const resolvedCwd = fs.realpathSync(cwd) || cwd;
    const nodePaths = process.env.NODE_PATH
      ? process.env.NODE_PATH.split(path.delimiter)
          .filter(Boolean)
          .map(p => path.resolve(resolvedCwd, p))
      : null;

    mockUserResolver.mockImplementation(() => 'module');

    const newPath = Resolver.findNodeModule('test', {
      basedir: '/',
      conditions: ['conditions, woooo'],
      extensions: ['js'],
      moduleDirectory: ['node_modules'],
      paths: ['/something'],
      resolver: require.resolve('../__mocks__/userResolver'),
    });

    expect(newPath).toBe('module');
    expect(mockUserResolver.mock.calls[0][0]).toBe('test');
    expect(mockUserResolver.mock.calls[0][1]).toStrictEqual({
      basedir: '/',
      conditions: ['conditions, woooo'],
      defaultAsyncResolver,
      defaultResolver,
      extensions: ['js'],
      moduleDirectory: ['node_modules'],
      paths: [...(nodePaths || []), '/something'],
      rootDir: undefined,
    });
  }
```

#### supports file URLs

```ts
it('supports file URLs', () => {
    const path = pathToFileURL(__filename).href;
    const newPath = Resolver.findNodeModule(path, {
      basedir: '/',
    });

    expect(newPath).toBe(__filename);
  }
```

#### resolves without exports, just main

```ts
test('resolves without exports, just main', () => {
      const result = Resolver.findNodeModule('main', {
        basedir: conditionsRoot,
        conditions: ['require'],
      });

      expect(result).toEqual(
        path.resolve(conditionsRoot, './node_modules/main/file.js'),
      );
    }
```

#### resolves with import

```ts
test('resolves with import', () => {
      const result = Resolver.findNodeModule('exports', {
        basedir: conditionsRoot,
        conditions: ['import'],
      });

      expect(result).toEqual(
        path.resolve(conditionsRoot, './node_modules/exports/import.js'),
      );
    }
```

#### resolves with require

```ts
test('resolves with require', () => {
      const result = Resolver.findNodeModule('exports', {
        basedir: conditionsRoot,
        conditions: ['require'],
      });

      expect(result).toEqual(
        path.resolve(conditionsRoot, './node_modules/exports/require.js'),
      );
    }
```

#### gets default when nothing is passed

```ts
test('gets default when nothing is passed', () => {
      const result = Resolver.findNodeModule('exports', {
        basedir: conditionsRoot,
        conditions: [],
      });

      expect(result).toEqual(
        path.resolve(conditionsRoot, './node_modules/exports/default.js'),
      );
    }
```

#### respects order in package.json, not conditions

```ts
test('respects order in package.json, not conditions', () => {
      const resultImport = Resolver.findNodeModule('exports', {
        basedir: conditionsRoot,
        conditions: ['import', 'require'],
      });
      const resultRequire = Resolver.findNodeModule('exports', {
        basedir: conditionsRoot,
        conditions: ['require', 'import'],
      });

      expect(resultImport).toEqual(resultRequire);
    }
```

#### supports nested paths

```ts
test('supports nested paths', () => {
      const result = Resolver.findNodeModule('exports/nested', {
        basedir: conditionsRoot,
        conditions: [],
      });

      expect(result).toEqual(
        path.resolve(conditionsRoot, './node_modules/exports/nestedDefault.js'),
      );
    }
```

#### supports nested paths with wildcard and no extension

```ts
test('supports nested paths with wildcard and no extension', () => {
      const result = Resolver.findNodeModule('exports/directory/file', {
        basedir: conditionsRoot,
        conditions: [],
      });

      expect(result).toEqual(
        path.resolve(
          conditionsRoot,
          './node_modules/exports/some-other-directory/file.js',
        ),
      );
    }
```

#### supports nested conditions

```ts
test('supports nested conditions', () => {
      const resultRequire = Resolver.findNodeModule('exports/deeplyNested', {
        basedir: conditionsRoot,
        conditions: ['require'],
      });
      const resultDefault = Resolver.findNodeModule('exports/deeplyNested', {
        basedir: conditionsRoot,
        conditions: [],
      });

      expect(resultRequire).toEqual(
        path.resolve(conditionsRoot, './node_modules/exports/nestedRequire.js'),
      );

      expect(resultDefault).toEqual(
        path.resolve(conditionsRoot, './node_modules/exports/nestedDefault.js'),
      );
    }
```

#### supports separate directory path

```ts
test('supports separate directory path', () => {
      const result = Resolver.findNodeModule('exports/directory/file.js', {
        basedir: conditionsRoot,
        conditions: [],
      });

      expect(result).toEqual(
        path.resolve(
          conditionsRoot,
          './node_modules/exports/some-other-directory/file.js',
        ),
      );
    }
```

#### supports self-reference

```ts
test('supports self-reference', () => {
      const result = Resolver.findNodeModule('foo', {
        basedir: path.resolve(selfRefRoot, './foo/index.js'),
        conditions: [],
      });

      expect(result).toEqual(path.resolve(selfRefRoot, './foo/file.js'));
    }
```

#### supports nested self-reference

```ts
test('supports nested self-reference', () => {
      const result = Resolver.findNodeModule('foo', {
        basedir: path.resolve(selfRefRoot, './foo/nested/index.js'),
        conditions: [],
      });

      expect(result).toEqual(path.resolve(selfRefRoot, './foo/file.js'));
    }
```

#### fails if own pkg.json with different name

```ts
test('fails if own pkg.json with different name', () => {
      const result = Resolver.findNodeModule('foo', {
        basedir: path.resolve(
          selfRefRoot,
          './foo/nested-with-own-pkg/index.js',
        ),
        conditions: [],
      });

      expect(result).toBeNull();
    }
```

#### fails if own pkg.json with no exports

```ts
test('fails if own pkg.json with no exports', () => {
      const result = Resolver.findNodeModule('foo-no-exports', {
        basedir: path.resolve(
          selfRefRoot,
          './foo/nested-with-no-exports/index.js',
        ),
        conditions: [],
      });

      expect(result).toBeNull();
    }
```

#### supports internal reference

```ts
test('supports internal reference', () => {
      const result = Resolver.findNodeModule('#nested', {
        basedir: path.resolve(importsRoot, './foo-import/index.cjs'),
        conditions: ['require'],
      });

      expect(result).toEqual(
        path.resolve(importsRoot, './foo-import/internal.cjs'),
      );
    }
```

#### supports external reference

```ts
test('supports external reference', () => {
      const result = Resolver.findNodeModule('#nested', {
        basedir: path.resolve(importsRoot, './foo-import/index.js'),
        conditions: [],
      });

      expect(result).toEqual(
        path.resolve(
          importsRoot,
          './foo-import/node_modules/external-foo/main.js',
        ),
      );
    }
```

#### supports nested pattern

```ts
test('supports nested pattern', () => {
      const result = Resolver.findNodeModule('#nested', {
        basedir: path.resolve(importsRoot, './nested-import/index.cjs'),
        conditions: ['node', 'require'],
      });

      expect(result).toEqual(
        path.resolve(importsRoot, './nested-import/node.cjs'),
      );
    }
```

#### resolve to first found

```ts
test('resolve to first found', () => {
        const result = Resolver.findNodeModule('#array-import', {
          basedir: path.resolve(importsRoot, './array-import/index.cjs'),
          conditions: ['import'],
        });

        expect(result).toEqual(
          path.resolve(importsRoot, './array-import/node.mjs'),
        );
      }
```

#### skip over not met nested condition

```ts
test('skip over not met nested condition', () => {
        const result = Resolver.findNodeModule('#array-import', {
          basedir: path.resolve(importsRoot, './array-import/index.cjs'),
          conditions: ['browser'],
        });

        expect(result).toEqual(
          path.resolve(importsRoot, './array-import/browser.cjs'),
        );
      }
```

#### match nested condition

```ts
test('match nested condition', () => {
        const result = Resolver.findNodeModule('#array-import', {
          basedir: path.resolve(importsRoot, './array-import/index.cjs'),
          conditions: ['chrome', 'browser'],
        });

        expect(result).toEqual(
          path.resolve(importsRoot, './array-import/chrome.cjs'),
        );
      }
```

#### fails for non-existent mapping

```ts
test('fails for non-existent mapping', () => {
      expect(() => {
        Resolver.findNodeModule('#something-else', {
          basedir: path.resolve(importsRoot, './foo-import/index.js'),
          conditions: [],
        });
      }).toThrow(
        `Package import specifier "#something-else" is not defined in package ${path.join(importsRoot, 'foo-import/package.json')}`,
      );
    }
```

#### is possible to override the default resolver

```ts
it('is possible to override the default resolver', async () => {
    const cwd = process.cwd();
    const resolvedCwd = fs.realpathSync(cwd) || cwd;
    const nodePaths = process.env.NODE_PATH
      ? process.env.NODE_PATH.split(path.delimiter)
          .filter(Boolean)
          .map(p => path.resolve(resolvedCwd, p))
      : null;

    mockUserResolverAsync.async.mockResolvedValue('module');

    const newPath = await Resolver.findNodeModuleAsync('test', {
      basedir: '/',
      conditions: ['conditions, woooo'],
      extensions: ['js'],
      moduleDirectory: ['node_modules'],
      paths: ['/something'],
      resolver: require.resolve('../__mocks__/userResolverAsync'),
    });

    expect(newPath).toBe('module');
    expect(mockUserResolverAsync.async.mock.calls[0][0]).toBe('test');
    expect(mockUserResolverAsync.async.mock.calls[0][1]).toStrictEqual({
      basedir: '/',
      conditions: ['conditions, woooo'],
      defaultAsyncResolver,
      defaultResolver,
      extensions: ['js'],
      moduleDirectory: ['node_modules'],
      paths: [...(nodePaths || []), '/something'],
      rootDir: undefined,
    });
  }
```

#### supports file URLs

```ts
it('supports file URLs', async () => {
    const path = pathToFileURL(__filename).href;
    const newPath = await Resolver.findNodeModuleAsync(path, {
      basedir: '/',
    });

    expect(newPath).toBe(__filename);
  }
```

#### is possible to resolve node modules

```ts
it('is possible to resolve node modules', () => {
    const resolver = new Resolver(moduleMap, {
      extensions: ['.js'],
    } as ResolverConfig);
    const src = require.resolve('../');
    const resolved = resolver.resolveModule(
      src,
      './__mocks__/mockJsDependency',
    );
    expect(resolved).toBe(require.resolve('../__mocks__/mockJsDependency.js'));
  }
```

#### is possible to resolve node modules with custom extensions

```ts
it('is possible to resolve node modules with custom extensions', () => {
    const resolver = new Resolver(moduleMap, {
      extensions: ['.js', '.jsx'],
    } as ResolverConfig);
    const src = require.resolve('../');
    const resolvedJsx = resolver.resolveModule(
      src,
      './__mocks__/mockJsxDependency',
    );
    expect(resolvedJsx).toBe(
      require.resolve('../__mocks__/mockJsxDependency.jsx'),
    );
  }
```

#### is possible to resolve node modules with custom extensions and platforms

```ts
it('is possible to resolve node modules with custom extensions and platforms', () => {
    const resolver = new Resolver(moduleMap, {
      extensions: ['.js', '.jsx'],
      platforms: ['native'],
    } as ResolverConfig);
    const src = require.resolve('../');
    const resolvedJsx = resolver.resolveModule(
      src,
      './__mocks__/mockJsxDependency',
    );
    expect(resolvedJsx).toBe(
      require.resolve('../__mocks__/mockJsxDependency.native.jsx'),
    );
  }
```

#### is possible to resolve node modules by resolving their realpath

```ts
it('is possible to resolve node modules by resolving their realpath', () => {
    const resolver = new Resolver(moduleMap, {
      extensions: ['.js'],
    } as ResolverConfig);
    const src = path.join(
      path.resolve(__dirname, '../../src/__mocks__/bar/node_modules/'),
      'foo/index.js',
    );
    const resolved = resolver.resolveModule(src, 'dep');
    expect(resolved).toBe(
      require.resolve('../../src/__mocks__/foo/node_modules/dep/index.js'),
    );
  }
```

#### is possible to specify custom resolve paths

```ts
it('is possible to specify custom resolve paths', () => {
    const resolver = new Resolver(moduleMap, {
      extensions: ['.js'],
    } as ResolverConfig);
    const src = require.resolve('../');
    const resolved = resolver.resolveModule(src, 'mockJsDependency', {
      paths: [
        path.resolve(__dirname, '../../src/__mocks__'),
        path.resolve(__dirname, '../../src/__tests__'),
      ],
    });
    expect(resolved).toBe(require.resolve('../__mocks__/mockJsDependency.js'));
  }
```

#### does not confuse directories with files

```ts
it('does not confuse directories with files', () => {
    const resolver = new Resolver(moduleMap, {
      extensions: ['.js'],
    } as ResolverConfig);
    const mocksDirectory = path.resolve(__dirname, '../__mocks__');
    const fooSlashFoo = path.join(mocksDirectory, 'foo/foo.js');
    const fooSlashIndex = path.join(mocksDirectory, 'foo/index.js');

    const resolvedWithSlash = resolver.resolveModule(fooSlashFoo, './');
    const resolvedWithDot = resolver.resolveModule(fooSlashFoo, '.');
    expect(resolvedWithSlash).toBe(fooSlashIndex);
    expect(resolvedWithSlash).toBe(resolvedWithDot);
  }
```

#### custom resolver can resolve node modules

```ts
it('custom resolver can resolve node modules', () => {
    mockUserResolver.mockImplementation(() => 'module');

    const moduleMap = ModuleMap.create('/');
    const resolver = new Resolver(moduleMap, {
      extensions: ['.js'],
      resolver: require.resolve('../__mocks__/userResolver'),
    } as ResolverConfig);
    const src = require.resolve('../');
    resolver.resolveModule(src, 'fs');

    expect(mockUserResolver).toHaveBeenCalled();
    expect(mockUserResolver.mock.calls[0][0]).toBe('fs');
  }
```

#### handles unmatched capture groups correctly

```ts
it('handles unmatched capture groups correctly', () => {
    const resolver = new Resolver(moduleMap, {
      extensions: ['.js'],
      moduleNameMapper: [
        {
          moduleName: './__mocks__/foo$1',
          regex: /^@Foo(\/.*)?$/,
        },
      ],
    } as ResolverConfig);
    const src = require.resolve('../');
    expect(resolver.resolveModule(src, '@Foo')).toBe(
      require.resolve('../__mocks__/foo.js'),
    );
    expect(resolver.resolveModule(src, '@Foo/bar')).toBe(
      require.resolve('../__mocks__/foo/bar/index.js'),
    );
  }
```

#### is possible to resolve node modules

```ts
it('is possible to resolve node modules', async () => {
    const resolver = new Resolver(moduleMap, {
      extensions: ['.js'],
    } as ResolverConfig);
    const src = require.resolve('../');
    const resolved = await resolver.resolveModuleAsync(
      src,
      './__mocks__/mockJsDependency',
    );
    expect(resolved).toBe(require.resolve('../__mocks__/mockJsDependency.js'));
  }
```

#### is possible to resolve node modules with custom extensions

```ts
it('is possible to resolve node modules with custom extensions', async () => {
    const resolver = new Resolver(moduleMap, {
      extensions: ['.js', '.jsx'],
    } as ResolverConfig);
    const src = require.resolve('../');
    const resolvedJsx = await resolver.resolveModuleAsync(
      src,
      './__mocks__/mockJsxDependency',
    );
    expect(resolvedJsx).toBe(
      require.resolve('../__mocks__/mockJsxDependency.jsx'),
    );
  }
```

#### is possible to resolve node modules with custom extensions and platforms

```ts
it('is possible to resolve node modules with custom extensions and platforms', async () => {
    const resolver = new Resolver(moduleMap, {
      extensions: ['.js', '.jsx'],
      platforms: ['native'],
    } as ResolverConfig);
    const src = require.resolve('../');
    const resolvedJsx = await resolver.resolveModuleAsync(
      src,
      './__mocks__/mockJsxDependency',
    );
    expect(resolvedJsx).toBe(
      require.resolve('../__mocks__/mockJsxDependency.native.jsx'),
    );
  }
```

#### is possible to resolve node modules by resolving their realpath

```ts
it('is possible to resolve node modules by resolving their realpath', async () => {
    const resolver = new Resolver(moduleMap, {
      extensions: ['.js'],
    } as ResolverConfig);
    const src = path.join(
      path.resolve(__dirname, '../../src/__mocks__/bar/node_modules/'),
      'foo/index.js',
    );
    const resolved = await resolver.resolveModuleAsync(src, 'dep');
    expect(resolved).toBe(
      require.resolve('../../src/__mocks__/foo/node_modules/dep/index.js'),
    );
  }
```

#### is possible to specify custom resolve paths

```ts
it('is possible to specify custom resolve paths', async () => {
    const resolver = new Resolver(moduleMap, {
      extensions: ['.js'],
    } as ResolverConfig);
    const src = require.resolve('../');
    const resolved = await resolver.resolveModuleAsync(
      src,
      'mockJsDependency',
      {
        paths: [
          path.resolve(__dirname, '../../src/__tests__'),
          path.resolve(__dirname, '../../src/__mocks__'),
        ],
      },
    );
    expect(resolved).toBe(require.resolve('../__mocks__/mockJsDependency.js'));
  }
```

#### does not confuse directories with files

```ts
it('does not confuse directories with files', async () => {
    const resolver = new Resolver(moduleMap, {
      extensions: ['.js'],
    } as ResolverConfig);
    const mocksDirectory = path.resolve(__dirname, '../__mocks__');
    const fooSlashFoo = path.join(mocksDirectory, 'foo/foo.js');
    const fooSlashIndex = path.join(mocksDirectory, 'foo/index.js');

    const resolvedWithSlash = await resolver.resolveModuleAsync(
      fooSlashFoo,
      './',
    );
    const resolvedWithDot = await resolver.resolveModuleAsync(fooSlashFoo, '.');
    expect(resolvedWithSlash).toBe(fooSlashIndex);
    expect(resolvedWithSlash).toBe(resolvedWithDot);
  }
```

#### is possible to use custom resolver to resolve deps inside mock modules with moduleNameMapper

```ts
it('is possible to use custom resolver to resolve deps inside mock modules with moduleNameMapper', () => {
    mockUserResolver.mockImplementation(() => 'module');

    const moduleMap = ModuleMap.create('/');
    const resolver = new Resolver(moduleMap, {
      extensions: ['.js'],
      moduleNameMapper: [
        {
          moduleName: '$1',
          regex: /(.*)/,
        },
      ],
      resolver: require.resolve('../__mocks__/userResolver'),
    } as ResolverConfig);
    const src = require.resolve('../');
    resolver.getMockModule(src, 'dependentModule');

    expect(mockUserResolver).toHaveBeenCalled();
    expect(mockUserResolver.mock.calls[0][0]).toBe('dependentModule');
    expect(mockUserResolver.mock.calls[0][1]).toHaveProperty(
      'basedir',
      path.dirname(src),
    );
  }
```

#### is possible to use custom resolver to resolve deps inside mock modules with moduleNameMapper

```ts
it('is possible to use custom resolver to resolve deps inside mock modules with moduleNameMapper', async () => {
    mockUserResolverAsync.async.mockResolvedValue('module');

    const moduleMap = ModuleMap.create('/');
    const resolver = new Resolver(moduleMap, {
      extensions: ['.js'],
      moduleNameMapper: [
        {
          moduleName: '$1',
          regex: /(.*)/,
        },
      ],
      resolver: require.resolve('../__mocks__/userResolverAsync'),
    } as ResolverConfig);
    const src = require.resolve('../');

    await resolver.resolveModuleAsync(src, 'dependentModule', {
      conditions: ['browser'],
    });

    expect(mockUserResolverAsync.async).toHaveBeenCalled();
    expect(mockUserResolverAsync.async.mock.calls[0][0]).toBe(
      'dependentModule',
    );
    expect(mockUserResolverAsync.async.mock.calls[0][1]).toHaveProperty(
      'basedir',
      path.dirname(src),
    );
    expect(mockUserResolverAsync.async.mock.calls[0][1]).toHaveProperty(
      'conditions',
      ['browser'],
    );
  }
```

#### provides custom module paths after node_modules

```ts
it('provides custom module paths after node_modules', () => {
    const src = require.resolve('../');
    const result = nodeModulesPaths(src, {paths: ['./customFolder']});
    expect(result.at(-1)).toBe('./customFolder');
  }
```

#### provides custom module multi paths after node_modules

```ts
it('provides custom module multi paths after node_modules', () => {
    const src = require.resolve('../');
    const result = nodeModulesPaths(src, {
      paths: ['./customFolder', './customFolder2', './customFolder3'],
    });
    expect(result.slice(-3)).toStrictEqual([
      './customFolder',
      './customFolder2',
      './customFolder3',
    ]);
  }
```

#### can resolve node modules relative to absolute paths in "moduleDirectories" on Windows platforms

```ts
it('can resolve node modules relative to absolute paths in "moduleDirectories" on Windows platforms', () => {
    jest.doMock('path', () => _path.win32);
    const path = require('path');
    const Resolver = require('../').default;

    const cwd = 'D:\\temp\\project';
    const src = 'C:\\path\\to\\node_modules';
    const resolver = new Resolver(moduleMap, {
      moduleDirectories: [src, 'node_modules'],
    });
    const dirs_expected = [
      src,
      `${cwd}\\node_modules`,
      `${path.dirname(cwd)}\\node_modules`,
      'D:\\node_modules',
    ];
    const dirs_actual = resolver.getModulePaths(cwd);
    expect(dirs_actual).toEqual(expect.arrayContaining(dirs_expected));
  }
```

#### can resolve node modules relative to absolute paths in "moduleDirectories" on Posix platforms

```ts
it('can resolve node modules relative to absolute paths in "moduleDirectories" on Posix platforms', () => {
    jest.doMock('path', () => _path.posix);
    const path = require('path');
    const Resolver = require('../').default;

    const cwd = '/temp/project';
    const src = '/path/to/node_modules';
    const resolver = new Resolver(moduleMap, {
      moduleDirectories: [src, 'node_modules'],
    });
    const dirs_expected = [
      src,
      `${cwd}/node_modules`,
      `${path.dirname(cwd)}/node_modules`,
      '/node_modules',
    ];
    const dirs_actual = resolver.getModulePaths(cwd);
    expect(dirs_actual).toEqual(expect.arrayContaining(dirs_expected));
  }
```

#### return global paths with npm package

```ts
it('return global paths with npm package', () => {
    jest.doMock('path', () => _path.posix);
    const resolver = new Resolver(moduleMap, {} as ResolverConfig);
    const globalPaths = resolver.getGlobalPaths('jest');
    for (const globalPath of globalPaths)
      expect(require.resolve.paths('jest')).toContain(globalPath);
  }
```

#### return empty array with builtin module

```ts
it('return empty array with builtin module', () => {
    jest.doMock('path', () => _path.posix);
    const resolver = new Resolver(moduleMap, {} as ResolverConfig);
    const globalPaths = resolver.getGlobalPaths('fs');
    expect(globalPaths).toStrictEqual([]);
  }
```

#### return global paths with absolute path

```ts
it('return global paths with absolute path', () => {
    jest.doMock('path', () => _path.posix);
    const resolver = new Resolver(moduleMap, {} as ResolverConfig);
    const globalPaths = resolver.getGlobalPaths('/');
    for (const globalPath of globalPaths)
      expect(require.resolve.paths('/')).toContain(globalPath);
  }
```

#### return empty array with relative path

```ts
it('return empty array with relative path', () => {
    jest.doMock('path', () => _path.posix);
    const resolver = new Resolver(moduleMap, {} as ResolverConfig);
    const globalPaths = resolver.getGlobalPaths('./');
    expect(globalPaths).toStrictEqual([]);
  }
```

#### return empty array without module name

```ts
it('return empty array without module name', () => {
    jest.doMock('path', () => _path.posix);
    const resolver = new Resolver(moduleMap, {} as ResolverConfig);
    const globalPaths = resolver.getGlobalPaths();
    expect(globalPaths).toStrictEqual([]);
  }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/resolve-node-module/__tests__/resolve-node-module.test.js

#### should resolve entry as index.js when package main is "."

```ts
it('should resolve entry as index.js when package main is "."', () => {
  const mockModule = require('mock-module');
  expect(mockModule).toBe('test');
}
```

#### should resolve entry as index.js when package main is "./"

```ts
it('should resolve entry as index.js when package main is "./"', () => {
  const mockModule = require('mock-module-alt');
  expect(mockModule).toBe('test');
}
```

#### should resolve entry as index with other configured module file extension when package main is "."

```ts
it('should resolve entry as index with other configured module file extension when package main is "."', () => {
  const mockJsxModule = require('mock-jsx-module');
  expect(mockJsxModule).toBe('test jsx');
}
```

#### should resolve entry as index without package.json

```ts
it('should resolve entry as index without package.json', () => {
  const mockModuleWithoutPkg = require('mock-module-without-pkg');
  expect(mockModuleWithoutPkg).toBe('test mock-module-without-pkg');
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/resolve-get-paths/__tests__/resolveGetPaths.test.js

#### returns the resolve path for a relative path

```ts
test('returns the resolve path for a relative path', () => {
  expect(require.resolve.paths('./mod.js')).toEqual([resolve(__dirname)]);
}
```

#### returns the resolve paths for a node_module

```ts
test('returns the resolve paths for a node_module', () => {
  expect(require.resolve.paths('mod').slice(0, 2)).toEqual([
    resolve(__dirname, 'node_modules'),
    resolve(__dirname, '..', 'node_modules'),
  ]);
}
```

#### returns null for a native node module

```ts
test('returns null for a native node module', () => {
  expect(require.resolve.paths('fs')).toBeNull();
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/resolve-with-paths/__tests__/resolveWithPaths.test.js

#### finds a module relative to one of the given paths

```ts
test('finds a module relative to one of the given paths', () => {
  expect(require.resolve('./mod.js', {paths: ['../dir']})).toBe(
    resolve(__dirname, '..', 'dir', 'mod.js'),
  );
}
```

#### finds a module without a leading "./" relative to one of the given paths

```ts
test('finds a module without a leading "./" relative to one of the given paths', () => {
  expect(require.resolve('mod.js', {paths: ['../dir']})).toBe(
    resolve(__dirname, '..', 'dir', 'mod.js'),
  );
}
```

#### finds a node_module above one of the given paths

```ts
test('finds a node_module above one of the given paths', () => {
  expect(require.resolve('mod', {paths: ['../dir']})).toBe(
    resolve(__dirname, '..', 'node_modules', 'mod', 'index.js'),
  );
}
```

#### finds a native node module when paths are given

```ts
test('finds a native node module when paths are given', () => {
  expect(require.resolve('fs', {paths: ['../dir']})).toBe('fs');
}
```

#### throws an error if the module cannot be found from given paths

```ts
test('throws an error if the module cannot be found from given paths', () => {
  expect(() => require.resolve('./mod.js', {paths: ['..']})).toThrow(
    "Cannot resolve module './mod.js' from paths ['..'] from ",
  );
}
```

#### throws module not found error if the module cannot be found from given paths

```ts
test('throws module not found error if the module cannot be found from given paths', () => {
  expect(() => require.resolve('./mod.js', {paths: ['..']})).toThrow(
    expect.objectContaining({code: 'MODULE_NOT_FOUND'}),
  );
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/resolve.test.ts

#### resolve platform modules

```ts
test('resolve platform modules', () => {
  const result = runJest('resolve');
  expect(result.exitCode).toBe(0);
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-runtime/src/__tests__/runtime_require_resolve.test.ts

#### resolves a module path

```ts
it('resolves a module path', async () => {
    const runtime = await createRuntime(__filename);
    const resolved = runtime.requireModule(
      runtime.__mockRootPath,
      './resolve_self.js',
    );
    expect(resolved).toEqual(require.resolve('./test_root/resolve_self.js'));
  }
```

#### resolves an absolute module path

```ts
it('resolves an absolute module path', async () => {
    const absoluteFilePath = path.join(await getTmpDir(), 'test.js');
    await fs.writeFile(
      absoluteFilePath,
      'module.exports = require.resolve(__filename);',
      'utf8',
    );

    const runtime = await createRuntime(__filename);
    const resolved = runtime.requireModule(
      runtime.__mockRootPath,
      absoluteFilePath,
    );

    expect(resolved).toEqual(require.resolve(absoluteFilePath));
  }
```

#### required modules can resolve absolute module paths with no paths entries passed

```ts
it('required modules can resolve absolute module paths with no paths entries passed', async () => {
    const tmpdir = await getTmpDir();
    const entrypoint = path.join(tmpdir, 'test.js');
    const target = path.join(tmpdir, 'target.js');

    // we want to test the require.resolve implementation within a
    // runtime-required module, so we need to create a module that then resolves
    // an absolute path, so we need two files: the entrypoint, and an absolute
    // target to require.
    await fs.writeFile(
      entrypoint,
      `module.exports = require.resolve(${JSON.stringify(
        target,
      )}, {paths: []});`,
      'utf8',
    );

    await fs.writeFile(target, 'module.exports = {}', 'utf8');

    const runtime = await createRuntime(__filename);
    const resolved = runtime.requireModule(runtime.__mockRootPath, entrypoint);
    expect(resolved).toEqual(require.resolve(target, {paths: []}));
  }
```

#### resolves a module path with moduleNameMapper

```ts
it('resolves a module path with moduleNameMapper', async () => {
    const runtime = await createRuntime(__filename, {
      moduleNameMapper: {
        '^testMapped/(.*)': '<rootDir>/mapped_dir/$1',
      },
    });
    const resolved = runtime.requireModule(
      runtime.__mockRootPath,
      './resolve_mapped.js',
    );
    expect(resolved).toEqual(
      require.resolve('./test_root/mapped_dir/moduleInMapped.js'),
    );
  }
```

#### forwards to the real Node require in an internal context

```ts
it('forwards to the real Node require in an internal context', async () => {
      const runtime = await createRuntime(__filename);
      const module = runtime.requireInternalModule(
        runtime.__mockRootPath,
        './resolve_and_require_outside.js',
      );
      expect(module.required).toBe(
        require('./test_root/create_require_module'),
      );
    }
```

#### ignores the option in an external context

```ts
it('ignores the option in an external context', async () => {
      const runtime = await createRuntime(__filename);
      const module = runtime.requireModule(
        runtime.__mockRootPath,
        './resolve_and_require_outside.js',
      );
      expect(module.required.foo).toBe('foo');
      expect(module.required).not.toBe(
        require('./test_root/create_require_module'),
      );
    }
```

#### does not understand a self-constructed outsideJestVmPath in an external context

```ts
it('does not understand a self-constructed outsideJestVmPath in an external context', async () => {
      const runtime = await createRuntime(__filename);
      expect(() =>
        runtime.requireModule(
          runtime.__mockRootPath,
          createOutsideJestVmPath(
            require.resolve('./test_root/create_require_module.js'),
          ),
        ),
      ).toThrow(/cannot find.+create_require_module/i);
    }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-resolve-dependencies/src/__tests__/dependency_resolver.test.ts

#### resolves no dependencies for non-existent path

```ts
test('resolves no dependencies for non-existent path', () => {
  const resolved = dependencyResolver.resolve('/non/existent/path');
  expect(resolved).toHaveLength(0);
}
```

#### resolves dependencies for existing path

```ts
test('resolves dependencies for existing path', () => {
  const resolved = dependencyResolver.resolve(
    path.resolve(__dirname, '__fixtures__', 'file.js'),
  );
  expect(resolved).toEqual([
    expect.stringContaining('jest-resolve-dependencies'),
    expect.stringContaining('jest-regex-util'),
  ]);
}
```

#### includes the mocks of dependencies as dependencies

```ts
test('includes the mocks of dependencies as dependencies', () => {
  const resolved = dependencyResolver.resolve(
    path.resolve(__dirname, '__fixtures__/hasMocked/file.test.js'),
  );

  expect(resolved).toEqual([
    expect.stringContaining(path.join('hasMocked', 'file.js')),
    expect.stringContaining(path.join('hasMocked', '__mocks__', 'file.js')),
    expect.stringContaining(path.join('__mocks__', 'fake-node-module.js')),
  ]);
}
```

#### resolves dependencies for scoped packages

```ts
test('resolves dependencies for scoped packages', () => {
  const resolved = dependencyResolver.resolve(
    path.resolve(__dirname, '__fixtures__', 'scoped.js'),
  );
  expect(resolved).toEqual([
    expect.stringContaining(path.join('@myorg', 'pkg')),
  ]);
}
```

#### resolves no inverse dependencies for empty paths set

```ts
test('resolves no inverse dependencies for empty paths set', () => {
  const paths = new Set<string>();
  const resolved = dependencyResolver.resolveInverse(paths, filter);
  expect(resolved).toHaveLength(0);
}
```

#### resolves no inverse dependencies for set of non-existent paths

```ts
test('resolves no inverse dependencies for set of non-existent paths', () => {
  const paths = new Set(['/non/existent/path', '/another/one']);
  const resolved = dependencyResolver.resolveInverse(paths, filter);
  expect(resolved).toHaveLength(0);
}
```

#### resolves inverse dependencies for existing path

```ts
test('resolves inverse dependencies for existing path', () => {
  const paths = new Set([path.resolve(__dirname, '__fixtures__/file.js')]);
  const resolved = dependencyResolver.resolveInverse(paths, filter);
  expect(resolved).toEqual([
    expect.stringContaining(
      path.join('__tests__', '__fixtures__', 'file.test.js'),
    ),
  ]);
}
```

#### resolves inverse dependencies of mock

```ts
test('resolves inverse dependencies of mock', () => {
  const paths = new Set([
    path.resolve(__dirname, '__fixtures__/hasMocked/__mocks__/file.js'),
  ]);
  const resolved = dependencyResolver.resolveInverse(paths, filter);

  expect(resolved).toEqual([
    expect.stringContaining(
      path.join('__tests__/__fixtures__/hasMocked/file.test.js'),
    ),
  ]);
}
```

#### resolves inverse dependencies from available snapshot

```ts
test('resolves inverse dependencies from available snapshot', () => {
  const paths = new Set([
    path.resolve(__dirname, '__fixtures__/file.js'),
    path.resolve(__dirname, '__fixtures__/__snapshots__/related.test.js.snap'),
  ]);
  const resolved = dependencyResolver.resolveInverse(paths, filter);
  expect(resolved).toEqual(
    expect.arrayContaining([
      expect.stringContaining(
        path.join('__tests__', '__fixtures__', 'file.test.js'),
      ),
      expect.stringContaining(
        path.join('__tests__', '__fixtures__', 'related.test.js'),
      ),
    ]),
  );
}
```

#### resolves dependencies correctly when dependency resolution fails

```ts
test('resolves dependencies correctly when dependency resolution fails', () => {
  jest.spyOn(runtimeContextResolver, 'resolveModule').mockImplementation(() => {
    throw new Error('resolveModule has failed');
  });
  jest.spyOn(runtimeContextResolver, 'getMockModule').mockImplementation(() => {
    throw new Error('getMockModule has failed');
  });

  const resolved = dependencyResolver.resolve(
    path.resolve(__dirname, '__fixtures__', 'file.test.js'),
  );

  expect(resolved).toEqual([]);
}
```

#### resolves dependencies correctly when mock dependency resolution fails

```ts
test('resolves dependencies correctly when mock dependency resolution fails', () => {
  jest.spyOn(runtimeContextResolver, 'getMockModule').mockImplementation(() => {
    throw new Error('getMockModule has failed');
  });

  const resolved = dependencyResolver.resolve(
    path.resolve(__dirname, '__fixtures__', 'file.test.js'),
  );

  expect(resolved).toEqual([
    expect.stringContaining(path.join('__tests__', '__fixtures__', 'file.js')),
  ]);
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/resolveWithPaths.test.ts

#### require.resolve with paths

```ts
test('require.resolve with paths', () => {
  const {exitCode} = runJest('resolve-with-paths');
  expect(exitCode).toBe(0);
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-core/src/lib/__tests__/isValidPath.test.ts

#### is valid when it is a file inside roots

```ts
it('is valid when it is a file inside roots', () => {
  expect(
    isValidPath(makeGlobalConfig(), path.resolve(rootDir, 'src', 'index.js')),
  ).toBe(true);
  expect(
    isValidPath(
      makeGlobalConfig(),
      path.resolve(rootDir, 'src', 'components', 'Link.js'),
    ),
  ).toBe(true);
  expect(
    isValidPath(
      makeGlobalConfig(),
      path.resolve(rootDir, 'src', 'lib', 'something.js'),
    ),
  ).toBe(true);
}
```

#### is not valid when it is a snapshot file

```ts
it('is not valid when it is a snapshot file', () => {
  expect(
    isValidPath(
      makeGlobalConfig(),
      path.resolve(rootDir, 'src', 'index.js.snap'),
    ),
  ).toBe(false);
  expect(
    isValidPath(
      makeGlobalConfig(),
      path.resolve(rootDir, 'src', 'components', 'Link.js.snap'),
    ),
  ).toBe(false);
  expect(
    isValidPath(
      makeGlobalConfig(),
      path.resolve(rootDir, 'src', 'lib', 'something.js.snap'),
    ),
  ).toBe(false);
}
```

#### is not valid when it is a file in the coverage dir

```ts
it('is not valid when it is a file in the coverage dir', () => {
  expect(
    isValidPath(
      makeGlobalConfig({rootDir}),
      path.resolve(rootDir, 'coverage', 'lib', 'index.js'),
    ),
  ).toBe(false);

  expect(
    isValidPath(
      makeGlobalConfig({coverageDirectory: 'cov-dir'}),
      path.resolve(rootDir, 'src', 'cov-dir', 'lib', 'index.js'),
    ),
  ).toBe(false);
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-core/src/lib/__tests__/logDebugMessages.test.ts

#### prints the jest version

```ts
it('prints the jest version', async () => {
  expect.assertions(1);
  const message = await new Promise<string>(resolve => {
    logDebugMessages(
      makeGlobalConfig({watch: true}),
      makeProjectConfig({testRunner: 'myRunner'}),
      getOutputStream(resolve),
    );
  });

  expect(JSON.parse(message).version).toBe(123);
}
```

#### prints the test framework name

```ts
it('prints the test framework name', async () => {
  expect.assertions(1);
  const message = await new Promise<string>(resolve => {
    logDebugMessages(
      makeGlobalConfig({watch: true}),
      makeProjectConfig({testRunner: 'myRunner'}),
      getOutputStream(resolve),
    );
  });

  expect(JSON.parse(message).configs.testRunner).toBe('myRunner');
}
```

#### prints the config object

```ts
it('prints the config object', async () => {
  expect.assertions(1);
  const globalConfig = makeGlobalConfig({
    watch: true,
  });
  const config = makeProjectConfig({
    automock: false,
    rootDir: '/path/to/dir',
    roots: ['path/to/dir/test'],
    testRunner: 'myRunner',
  });
  const message = await new Promise<string>(resolve => {
    logDebugMessages(globalConfig, config, getOutputStream(resolve));
  });
  expect(message).toMatchSnapshot();
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-haste-map/src/lib/__tests__/fast_path.test.js

#### should get relative paths inside the root

```ts
it('should get relative paths inside the root', () => {
    const root = path.join(__dirname, 'foo', 'bar');
    const filename = path.join(__dirname, 'foo', 'bar', 'baz', 'foobar');
    const relativeFilename = path.join('baz', 'foobar');
    expect(relative(root, filename)).toBe(relativeFilename);
  }
```

#### should get relative paths outside the root

```ts
it('should get relative paths outside the root', () => {
    const root = path.join(__dirname, 'foo', 'bar');
    const filename = path.join(__dirname, 'foo', 'baz', 'foobar');
    const relativeFilename = path.join('..', 'baz', 'foobar');
    expect(relative(root, filename)).toBe(relativeFilename);
  }
```

#### should get relative paths outside the root when start with same word

```ts
it('should get relative paths outside the root when start with same word', () => {
    const root = path.join(__dirname, 'foo', 'bar');
    const filename = path.join(__dirname, 'foo', 'barbaz', 'foobar');
    const relativeFilename = path.join('..', 'barbaz', 'foobar');
    expect(relative(root, filename)).toBe(relativeFilename);
  }
```

#### should get the absolute path for paths inside the root

```ts
it('should get the absolute path for paths inside the root', () => {
    const root = path.join(__dirname, 'foo', 'bar');
    const relativeFilename = path.join('baz', 'foobar');
    const filename = path.join(__dirname, 'foo', 'bar', 'baz', 'foobar');
    expect(resolve(root, relativeFilename)).toBe(filename);
  }
```

#### should get the absolute path for paths outside the root

```ts
it('should get the absolute path for paths outside the root', () => {
    const root = path.join(__dirname, 'foo', 'bar');
    const relativeFilename = path.join('..', 'baz', 'foobar');
    const filename = path.join(__dirname, 'foo', 'baz', 'foobar');
    expect(resolve(root, relativeFilename)).toBe(filename);
  }
```

### /tmp/ctest-repos-nXQIAb/95324de690-parser/packages/babel-traverse/test/path/index.js

#### can set default value

```ts
it("can set default value", () => {
      const path = new NodePath({}, {});

      expect(path.getData("foo", "test")).toBe("test");
    }
```

#### can set false

```ts
it("can set false", () => {
      const path = new NodePath({}, {});
      path.setData("foo", false);

      expect(path.getData("foo", true)).toBe(false);
    }
```

#### can set true

```ts
it("can set true", () => {
      const path = new NodePath({}, {});
      path.setData("foo", true);

      expect(path.getData("foo", false)).toBe(true);
    }
```

#### can set null

```ts
it("can set null", () => {
      const path = new NodePath({}, {});
      path.setData("foo", null);

      expect(path.getData("foo", true)).toBe(null);
    }
```

#### can use false as default

```ts
it("can use false as default", () => {
      const path = new NodePath({}, {});

      expect(path.getData("foo", false)).toBe(false);
    }
```

#### does not use object base properties

```ts
it("does not use object base properties", () => {
      const path = new NodePath({}, {});

      expect(path.getData("__proto__", "test")).toBe("test");
    }
```

#### can use symbols as keys

```ts
it("can use symbols as keys", () => {
      const path = new NodePath({}, {});
      const symbol = Symbol("foo");
      path.setData(symbol, 42);

      expect(path.getData(symbol)).toBe(42);
    }
```

#### returns false if node is null

```ts
it("returns false if node is null", () => {
        const path = new NodePath({}, {});

        expect(path.hasNode()).toBe(false);
      }
```

#### returns true if node is not null

```ts
it("returns true if node is not null", () => {
        const path = new NodePath({}, {});
        path.node = {};

        expect(path.hasNode()).toBe(true);
      }
```

### /tmp/ctest-repos-nXQIAb/95324de690-parser/packages/babel-core/test/path.js

#### replaceWithSourceString

```ts
it("replaceWithSourceString", function () {
    const expectCode = "function foo() {}";

    const actualCode = transformSync(expectCode, {
      cwd,
      plugins: [
        new Plugin({
          visitor: {
            FunctionDeclaration: function (path) {
              path.replaceWithSourceString("console.whatever()");
            },
          },
        }),
      ],
    }).code;

    expect(actualCode).toBe("console.whatever();");
  }
```

#### replaceWith (arrow expression body to block statement body)

```ts
it("replaceWith (arrow expression body to block statement body)", function () {
    const expectCode = "var fn = () => true;";

    const actualCode = transformSync(expectCode, {
      cwd,
      plugins: [
        new Plugin({
          visitor: {
            ArrowFunctionExpression: function (path) {
              path.get("body").replaceWith({
                type: "BlockStatement",
                body: [
                  {
                    type: "ReturnStatement",
                    argument: {
                      type: "BooleanLiteral",
                      value: true,
                    },
                  },
                ],
              });
            },
          },
        }),
      ],
    }).code;

    expect(actualCode).toBe("var fn = () => {\n  return true;\n};");
  }
```

#### replaceWith (arrow block statement body to expression body)

```ts
it("replaceWith (arrow block statement body to expression body)", function () {
    const expectCode = "var fn = () => { return true; }";

    const actualCode = transformSync(expectCode, {
      cwd,
      plugins: [
        new Plugin({
          visitor: {
            ArrowFunctionExpression: function (path) {
              path.get("body").replaceWith({
                type: "BooleanLiteral",
                value: true,
              });
            },
          },
        }),
      ],
    }).code;

    expect(actualCode).toBe("var fn = () => true;");
  }
```

#### replaceWith (for-in left expression to variable declaration)

```ts
it("replaceWith (for-in left expression to variable declaration)", function () {
    const expectCode = "for (KEY in right);";

    const actualCode = transformSync(expectCode, {
      cwd,
      plugins: [
        new Plugin({
          visitor: {
            ForInStatement: function (path) {
              path.get("left").replaceWith({
                type: "VariableDeclaration",
                kind: "var",
                declarations: [
                  {
                    type: "VariableDeclarator",
                    id: {
                      type: "Identifier",
                      name: "KEY",
                    },
                  },
                ],
              });
            },
          },
        }),
      ],
    }).code;

    expect(actualCode).toBe("for (var KEY in right);");
  }
```

#### replaceWith (for-in left variable declaration to expression)

```ts
it("replaceWith (for-in left variable declaration to expression)", function () {
    const expectCode = "for (var KEY in right);";

    const actualCode = transformSync(expectCode, {
      cwd,
      plugins: [
        new Plugin({
          visitor: {
            ForInStatement: function (path) {
              path.get("left").replaceWith({
                type: "Identifier",
                name: "KEY",
              });
            },
          },
        }),
      ],
    }).code;

    expect(actualCode).toBe("for (KEY in right);");
  }
```

#### replaceWith (for-loop left expression to variable declaration)

```ts
it("replaceWith (for-loop left expression to variable declaration)", function () {
    const expectCode = "for (KEY;;);";

    const actualCode = transformSync(expectCode, {
      cwd,
      plugins: [
        new Plugin({
          visitor: {
            ForStatement: function (path) {
              path.get("init").replaceWith({
                type: "VariableDeclaration",
                kind: "var",
                declarations: [
                  {
                    type: "VariableDeclarator",
                    id: {
                      type: "Identifier",
                      name: "KEY",
                    },
                  },
                ],
              });
            },
          },
        }),
      ],
    }).code;

    expect(actualCode).toBe("for (var KEY;;);");
  }
```

#### replaceWith (for-loop left variable declaration to expression)

```ts
it("replaceWith (for-loop left variable declaration to expression)", function () {
    const expectCode = "for (var KEY;;);";

    const actualCode = transformSync(expectCode, {
      cwd,
      plugins: [
        new Plugin({
          visitor: {
            ForStatement: function (path) {
              path.get("init").replaceWith({
                type: "Identifier",
                name: "KEY",
              });
            },
          },
        }),
      ],
    }).code;

    expect(actualCode).toBe("for (KEY;;);");
  }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-config/src/__tests__/readConfigFileAndSetRootDir.test.ts

#### reads config and sets `rootDir`

```ts
test('reads config and sets `rootDir`', async () => {
      jest.mocked(requireOrImportModule).mockResolvedValueOnce({notify: true});

      const rootDir = path.resolve('some', 'path', 'to');
      const config = await readConfigFileAndSetRootDir(
        path.join(rootDir, 'jest.config.js'),
      );

      expect(config).toEqual({notify: true, rootDir});
    }
```

#### handles exported function

```ts
test('handles exported function', async () => {
      jest
        .mocked(requireOrImportModule)
        .mockResolvedValueOnce(() => ({bail: 1}));

      const rootDir = path.resolve('some', 'path', 'to');
      const config = await readConfigFileAndSetRootDir(
        path.join(rootDir, 'jest.config.js'),
      );

      expect(config).toEqual({bail: 1, rootDir});
    }
```

#### handles exported async function

```ts
test('handles exported async function', async () => {
      jest
        .mocked(requireOrImportModule)
        .mockResolvedValueOnce(async () => ({testTimeout: 10_000}));

      const rootDir = path.resolve('some', 'path', 'to');
      const config = await readConfigFileAndSetRootDir(
        path.join(rootDir, 'jest.config.js'),
      );

      expect(config).toEqual({rootDir, testTimeout: 10_000});
    }
```

#### reads config and sets `rootDir`

```ts
test('reads config and sets `rootDir`', async () => {
      jest.mocked(fs.readFileSync).mockReturnValueOnce('{ "verbose": true }');

      const rootDir = path.resolve('some', 'path', 'to');
      const config = await readConfigFileAndSetRootDir(
        path.join(rootDir, 'jest.config.json'),
      );

      expect(config).toEqual({rootDir, verbose: true});
    }
```

#### supports comments in JSON

```ts
test('supports comments in JSON', async () => {
      jest
        .mocked(fs.readFileSync)
        .mockReturnValueOnce('{ // test comment\n "bail": true }');

      const rootDir = path.resolve('some', 'path', 'to');
      const config = await readConfigFileAndSetRootDir(
        path.join(rootDir, 'jest.config.json'),
      );

      expect(config).toEqual({bail: true, rootDir});
    }
```

#### reads config from "jest" key and sets `rootDir`

```ts
test('reads config from "jest" key and sets `rootDir`', async () => {
      jest
        .mocked(fs.readFileSync)
        .mockReturnValueOnce('{ "jest": { "coverage": true } }');

      const rootDir = path.resolve('some', 'path', 'to');
      const config = await readConfigFileAndSetRootDir(
        path.join(rootDir, 'package.json'),
      );

      expect(config).toEqual({coverage: true, rootDir});
    }
```

#### sets rootDir if "jest" is absent

```ts
test('sets rootDir if "jest" is absent', async () => {
      jest.mocked(fs.readFileSync).mockReturnValueOnce('{ "name": "test" }');

      const rootDir = path.resolve('some', 'path', 'to');
      const config = await readConfigFileAndSetRootDir(
        path.join(rootDir, 'package.json'),
      );

      expect(config).toEqual({rootDir});
    }
```

#### handles frozen config object

```ts
test('handles frozen config object', async () => {
      jest
        .mocked(requireOrImportModule)
        .mockResolvedValueOnce(Object.freeze({preset: 'some-preset'}));

      const rootDir = path.resolve('some', 'path', 'to');
      const config = await readConfigFileAndSetRootDir(
        path.join(rootDir, 'jest.config.js'),
      );

      expect(config).toEqual({preset: 'some-preset', rootDir});
    }
```

#### keeps the path if it is absolute

```ts
test('keeps the path if it is absolute', async () => {
      const rootDir = path.resolve('some', 'path', 'to');
      jest.mocked(requireOrImportModule).mockResolvedValueOnce({
        rootDir,
        testEnvironment: 'node',
      });

      const config = await readConfigFileAndSetRootDir(
        path.join(path.resolve('other', 'path', 'to'), 'jest.config.js'),
      );

      expect(config).toEqual({rootDir, testEnvironment: 'node'});
    }
```

#### resolves the path relative to dirname of the config file

```ts
test('resolves the path relative to dirname of the config file', async () => {
      jest.mocked(requireOrImportModule).mockResolvedValueOnce({
        restoreMocks: true,
        rootDir: path.join('path', 'to'),
      });

      const config = await readConfigFileAndSetRootDir(
        path.join(path.resolve('some'), 'jest.config.js'),
      );

      expect(config).toEqual({
        restoreMocks: true,
        rootDir: path.resolve('some', 'path', 'to'),
      });
    }
```

#### resolves relative path when the read config object if frozen

```ts
test('resolves relative path when the read config object if frozen', async () => {
      jest.mocked(requireOrImportModule).mockResolvedValueOnce(
        Object.freeze({
          resetModules: true,
          rootDir: path.join('path', 'to'),
        }),
      );

      const config = await readConfigFileAndSetRootDir(
        path.join(path.resolve('some'), 'jest.config.js'),
      );

      expect(config).toEqual({
        resetModules: true,
        rootDir: path.resolve('some', 'path', 'to'),
      });
    }
```

#### reaches into 2nd loadout by TS loader if specified in docblock

```ts
test('reaches into 2nd loadout by TS loader if specified in docblock', async () => {
      jest
        .mocked(requireOrImportModule)
        .mockRejectedValueOnce(new Error('Module not found'));
      jest.mocked(fs.readFileSync).mockReturnValue(`
        /** @jest-config-loader tsx */
        export { testTimeout: 1_000 }
      `);
      const rootDir = path.resolve('some', 'path', 'to');
      await expect(
        readConfigFileAndSetRootDir(path.join(rootDir, 'jest.config.ts')),
      ).rejects.toThrow(
        /Module not found\n.*'tsx' is not a valid TypeScript configuration loader./,
      );
    }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/toMatchInlineSnapshotCrlf.test.ts

#### prettier with crlf newlines

```ts
test('prettier with crlf newlines', () => {
  writeFiles(DIR, {
    'jest.config.js': `
        module.exports = {prettierPath: require.resolve('prettier')};
      `,
  });
  writeFiles(DIR, {
    '.prettierrc': '{"endOfLine": "crlf"}',
  });
  writeFiles(TESTS_DIR, {
    'test.ts': `test('snapshots', () => {
    expect({test: 1}).toMatchInlineSnapshot();

    expect({test: 2}).toMatchInlineSnapshot();
  });
`.replaceAll('\n', '\r\n'),
  });
  const {stderr, exitCode} = runJest(DIR, ['--ci=false']);
  expect(stderr).toContain('Snapshots:   2 written, 2 total');
  expect(exitCode).toBe(0);

  const fileAfter = readFile('test.ts');
  expect(fileAfter).toBe(
    `test("snapshots", () => {
  expect({ test: 1 }).toMatchInlineSnapshot(\`
    {
      "test": 1,
    }
  \`);

  expect({ test: 2 }).toMatchInlineSnapshot(\`
    {
      "test": 2,
    }
  \`);
});
`.replaceAll('\n', '\r\n'),
  );
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-runtime/src/__tests__/runtime_node_path.test.js

#### uses NODE_PATH to find modules

```ts
it('uses NODE_PATH to find modules', async () => {
    const nodePath = `${__dirname}/NODE_PATH_dir`;
    const runtime = await createLocalRuntime(nodePath);
    const exports = runtime.requireModuleOrMock(
      runtime.__mockRootPath,
      'regular_module_in_node_path',
    );
    expect(exports).toBeDefined();
  }
```

#### uses modulePaths to find modules

```ts
it('uses modulePaths to find modules', async () => {
    const nodePath = `${__dirname}/NODE_PATH_dir`;
    const runtime = await createLocalRuntime(null, {modulePaths: [nodePath]});
    const exports = runtime.requireModuleOrMock(
      runtime.__mockRootPath,
      'regular_module_in_node_path',
    );
    expect(exports).toBeDefined();
  }
```

#### finds modules in NODE_PATH containing multiple paths

```ts
it('finds modules in NODE_PATH containing multiple paths', async () => {
    const nodePath = `${cwd}/some/other/path${path.delimiter}${__dirname}/NODE_PATH_dir`;
    const runtime = await createLocalRuntime(nodePath);
    const exports = runtime.requireModuleOrMock(
      runtime.__mockRootPath,
      'regular_module_in_node_path',
    );
    expect(exports).toBeDefined();
  }
```

#### does not find modules if NODE_PATH is relative

```ts
it('does not find modules if NODE_PATH is relative', async () => {
    const nodePath = `${cwd.slice(
      path.sep.length,
    )}src/Runtime/__tests__/NODE_PATH_dir`;
    const runtime = await createLocalRuntime(nodePath);
    expect(() => {
      runtime.requireModuleOrMock(
        runtime.__mockRootPath,
        'regular_module_in_node_path',
      );
    }).toThrow(
      new Error(
        "Cannot find module 'regular_module_in_node_path' from 'root.js'",
      ),
    );
  }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-config/src/__tests__/resolveConfigPath.test.ts

#### file path with "${extension}"

```ts
test(`file path with "${extension}"`, () => {
      const relativeConfigPath = `a/b/c/my_config${extension}`;
      const absoluteConfigPath = path.resolve(DIR, relativeConfigPath);

      writeFiles(DIR, {[relativeConfigPath]: ''});

      // absolute
      expect(resolveConfigPath(absoluteConfigPath, DIR)).toBe(
        absoluteConfigPath,
      );
      expect(() => resolveConfigPath('/does_not_exist', DIR)).toThrow(
        NO_ROOT_DIR_ERROR_PATTERN,
      );

      // relative
      expect(resolveConfigPath(relativeConfigPath, DIR)).toBe(
        absoluteConfigPath,
      );
      expect(() => resolveConfigPath('does_not_exist', DIR)).toThrow(
        NO_ROOT_DIR_ERROR_PATTERN,
      );
    }
```

#### directory path with "${extension}"

```ts
test(`directory path with "${extension}"`, () => {
      const relativePackageJsonPath = 'a/b/c/package.json';
      const absolutePackageJsonPath = path.resolve(
        DIR,
        relativePackageJsonPath,
      );
      const relativeJestConfigPath = `a/b/c/jest.config${extension}`;
      const absoluteJestConfigPath = path.resolve(DIR, relativeJestConfigPath);

      // no configs yet. should throw
      writeFiles(DIR, {[`a/b/c/some_random_file${extension}`]: ''});

      expect(() =>
        // absolute
        resolveConfigPath(path.dirname(absoluteJestConfigPath), DIR),
      ).toThrow(ERROR_PATTERN);

      expect(() =>
        // relative
        resolveConfigPath(path.dirname(relativeJestConfigPath), DIR),
      ).toThrow(ERROR_PATTERN);

      writeFiles(DIR, {[relativePackageJsonPath]: ''});

      // absolute
      expect(
        resolveConfigPath(path.dirname(absolutePackageJsonPath), DIR),
      ).toBe(absolutePackageJsonPath);

      // relative
      expect(
        resolveConfigPath(path.dirname(relativePackageJsonPath), DIR),
      ).toBe(absolutePackageJsonPath);

      // jest.config.js takes precedence
      writeFiles(DIR, {[relativeJestConfigPath]: ''});

      // absolute
      expect(
        resolveConfigPath(path.dirname(absolutePackageJsonPath), DIR),
      ).toBe(absoluteJestConfigPath);

      // relative
      expect(
        resolveConfigPath(path.dirname(relativePackageJsonPath), DIR),
      ).toBe(absoluteJestConfigPath);

      // jest.config.js and package.json with 'jest' cannot be used together
      writeFiles(DIR, {[relativePackageJsonPath]: JSON.stringify({jest: {}})});

      // absolute
      expect(() =>
        resolveConfigPath(path.dirname(absolutePackageJsonPath), DIR),
      ).toThrow(MULTIPLE_CONFIGS_ERROR_PATTERN);

      // relative
      expect(() =>
        resolveConfigPath(path.dirname(relativePackageJsonPath), DIR),
      ).toThrow(MULTIPLE_CONFIGS_ERROR_PATTERN);

      expect(() => {
        resolveConfigPath(
          path.join(path.dirname(relativePackageJsonPath), 'j/x/b/m/'),
          DIR,
        );
      }).toThrow(NO_ROOT_DIR_ERROR_PATTERN);
    }
```

#### file path from "jest" key

```ts
test('file path from "jest" key', () => {
      const anyFileName = `anyJestConfigfile${extension}`;
      const relativePackageJsonPath = 'a/b/c/package.json';
      const relativeAnyFilePath = `a/b/c/conf/${anyFileName}`;
      const absolutePackageJsonPath = path.resolve(
        DIR,
        relativePackageJsonPath,
      );
      const absoluteAnyFilePath = path.resolve(DIR, relativeAnyFilePath);

      writeFiles(DIR, {
        'a/b/c/package.json': `{ "jest": "conf/${anyFileName}" }`,
      });
      writeFiles(DIR, {[relativeAnyFilePath]: ''});

      const result = resolveConfigPath(
        path.dirname(absolutePackageJsonPath),
        DIR,
      );

      expect(result).toBe(absoluteAnyFilePath);
    }
```

#### not a file path from "jest" key

```ts
test('not a file path from "jest" key', () => {
      const anyFileName = `anyJestConfigfile${extension}`;
      const relativePackageJsonPath = 'a/b/c/package.json';
      const relativeAnyFilePath = `a/b/c/conf/${anyFileName}`;
      const absolutePackageJsonPath = path.resolve(
        DIR,
        relativePackageJsonPath,
      );

      writeFiles(DIR, {
        'a/b/c/package.json': '{ "jest": {"verbose": true} }',
      });
      writeFiles(DIR, {[relativeAnyFilePath]: ''});

      const result = resolveConfigPath(
        path.dirname(absolutePackageJsonPath),
        DIR,
      );

      expect(result).toBe(absolutePackageJsonPath);
    }
```

#### not a valid file when "jest" key is a path

```ts
test('not a valid file when "jest" key is a path', () => {
      const anyFileName = `anyJestConfigfile${extension}`;
      const relativePackageJsonPath = 'a/b/c/package.json';
      const relativeAnyFilePath = `a/b/c/conf/${anyFileName}`;
      const absolutePackageJsonPath = path.resolve(
        DIR,
        relativePackageJsonPath,
      );

      writeFiles(DIR, {
        'a/b/c/package.json': '{ "jest": "conf/nonExistentConfigfile.json" }',
      });
      writeFiles(DIR, {[relativeAnyFilePath]: ''});

      expect(() =>
        resolveConfigPath(path.dirname(absolutePackageJsonPath), DIR),
      ).toThrow(
        /Jest expects the string configuration to point to a file, but .* not\./,
      );
    }
```

#### Using jest.config${extension1} and jest.config${extension2} shows error

```ts
test(`Using jest.config${extension1} and jest.config${extension2} shows error`, () => {
      const relativeJestConfigPaths = [
        `a/b/c/jest.config${extension1}`,
        `a/b/c/jest.config${extension2}`,
      ];

      writeFiles(DIR, {
        [relativeJestConfigPaths[0]]: '',
        [relativeJestConfigPaths[1]]: '',
      });

      expect(() =>
        resolveConfigPath(path.dirname(relativeJestConfigPaths[0]), DIR),
      ).toThrow(MULTIPLE_CONFIGS_ERROR_PATTERN);
    }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-runtime/src/__tests__/runtime_internal_module.test.js

#### loads modules and applies transforms

```ts
it('loads modules and applies transforms', async () => {
      const runtime = await createRuntime(__filename, {
        transform: {'\\.js$': './test_preprocessor'},
      });
      const modulePath = path.resolve(
        path.dirname(runtime.__mockRootPath),
        'internal-root.js',
      );
      expect(() => {
        runtime.requireModule(modulePath);
      }).toThrow(new Error('preprocessor must not run.'));
    }
```

#### loads internal modules without applying transforms

```ts
it('loads internal modules without applying transforms', async () => {
      const runtime = await createRuntime(__filename, {
        transform: {'\\.js$': './test_preprocessor'},
      });
      const modulePath = path.resolve(
        path.dirname(runtime.__mockRootPath),
        'internal-root.js',
      );
      const exports = runtime.requireInternalModule(modulePath);
      expect(exports()).toBe('internal-module-data');
    }
```

#### loads JSON modules and applies transforms

```ts
it('loads JSON modules and applies transforms', async () => {
      const runtime = await createRuntime(__filename, {
        transform: {'\\.json$': './test_json_preprocessor'},
      });
      const modulePath = path.resolve(
        path.dirname(runtime.__mockRootPath),
        'internal-root.json',
      );
      const exports = runtime.requireModule(modulePath);
      expect(exports).toEqual({foo: 'foo'});
    }
```

#### loads internal JSON modules without applying transforms

```ts
it('loads internal JSON modules without applying transforms', async () => {
      const runtime = await createRuntime(__filename, {
        transform: {'\\.json$': './test_json_preprocessor'},
      });
      const modulePath = path.resolve(
        path.dirname(runtime.__mockRootPath),
        'internal-root.json',
      );
      const exports = runtime.requireInternalModule(modulePath);
      expect(exports).toEqual({foo: 'bar'});
    }
```

#### loads modules normally even if on the optimization list

```ts
it('loads modules normally even if on the optimization list', () =>
      createRuntime(__filename).then(runtime => {
        const modulePath = path.resolve(
          path.dirname(runtime.__mockRootPath),
          'require-by-name.js',
        );
        const requireByName = runtime.requireModule(modulePath);
        expect(requireByName(OPTIMIZED_MODULE_EXAMPLE)).not.toBe(
          require(OPTIMIZED_MODULE_EXAMPLE),
        );
      }
```

#### loads internal modules from outside if on the optimization list

```ts
it('loads internal modules from outside if on the optimization list', () =>
      createRuntime(__filename).then(runtime => {
        const modulePath = path.resolve(
          path.dirname(runtime.__mockRootPath),
          'require-by-name.js',
        );
        const requireByName = runtime.requireInternalModule(modulePath);
        expect(requireByName(OPTIMIZED_MODULE_EXAMPLE)).toBe(
          require(OPTIMIZED_MODULE_EXAMPLE),
        );
      }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/transform.test.ts

#### should transform the snapshotResolver

```ts
it('should transform the snapshotResolver', () => {
    const result = runJest(dir, ['-w=1', '--no-cache', '--ci=false']);

    expect(result.stderr).toMatch('1 snapshot written from 1 test suite');

    const contents = require(snapshotFile);
    expect(contents).toHaveProperty(
      'snapshots are written to custom location 1',
    );
  }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/node-path/__tests__/nodePath.test.js

#### can require by absolute path

```ts
test('can require by absolute path', () => {
  expect(require('path/file.js')).toBe(42);
}
```

### /tmp/ctest-repos-nXQIAb/95324de690-parser/packages/babel-code-frame/test/index.js

#### basic usage

```ts
test("basic usage", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(codeFrame(rawLines, 2, 16)).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor()",
        "    |                ^",
        "  3 | };",
      ].join("\n"),
    );
  }
```

#### optional column number

```ts
test("optional column number", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(codeFrame(rawLines, 2, null)).toEqual(
      ["  1 | class Foo {", "> 2 |   constructor()", "  3 | };"].join("\n"),
    );
  }
```

#### maximum context lines and padding

```ts
test("maximum context lines and padding", function () {
    const rawLines = [
      "/**",
      " * Sums two numbers.",
      " *",
      " * @param a Number",
      " * @param b Number",
      " * @returns Number",
      " */",
      "",
      "function sum(a, b) {",
      "  return a + b",
      "}",
    ].join("\n");
    expect(codeFrame(rawLines, 7, 2)).toEqual(
      [
        "   5 |  * @param b Number",
        "   6 |  * @returns Number",
        ">  7 |  */",
        "     |  ^",
        "   8 |",
        "   9 | function sum(a, b) {",
        "  10 |   return a + b",
      ].join("\n"),
    );
  }
```

#### no unnecessary padding due to one-off errors

```ts
test("no unnecessary padding due to one-off errors", function () {
    const rawLines = [
      "/**",
      " * Sums two numbers.",
      " *",
      " * @param a Number",
      " * @param b Number",
      " * @returns Number",
      " */",
      "",
      "function sum(a, b) {",
      "  return a + b",
      "}",
    ].join("\n");
    expect(codeFrame(rawLines, 6, 2)).toEqual(
      [
        "  4 |  * @param a Number",
        "  5 |  * @param b Number",
        "> 6 |  * @returns Number",
        "    |  ^",
        "  7 |  */",
        "  8 |",
        "  9 | function sum(a, b) {",
      ].join("\n"),
    );
  }
```

#### tabs

```ts
test("tabs", function () {
    const rawLines = [
      "\tclass Foo {",
      "\t  \t\t    constructor\t(\t)",
      "\t};",
    ].join("\n");
    expect(codeFrame(rawLines, 2, 25)).toEqual(
      [
        "  1 | \tclass Foo {",
        "> 2 | \t  \t\t    constructor\t(\t)",
        "    | \t  \t\t               \t \t ^",
        "  3 | \t};",
      ].join("\n"),
    );
  }
```

#### opts.linesAbove

```ts
test("opts.linesAbove", function () {
    const rawLines = [
      "/**",
      " * Sums two numbers.",
      " *",
      " * @param a Number",
      " * @param b Number",
      " * @returns Number",
      " */",
      "",
      "function sum(a, b) {",
      "  return a + b",
      "}",
    ].join("\n");
    expect(codeFrame(rawLines, 7, 2, { linesAbove: 1 })).toEqual(
      [
        "   6 |  * @returns Number",
        ">  7 |  */",
        "     |  ^",
        "   8 |",
        "   9 | function sum(a, b) {",
        "  10 |   return a + b",
      ].join("\n"),
    );
  }
```

#### opts.linesBelow

```ts
test("opts.linesBelow", function () {
    const rawLines = [
      "/**",
      " * Sums two numbers.",
      " *",
      " * @param a Number",
      " * @param b Number",
      " * @returns Number",
      " */",
      "",
      "function sum(a, b) {",
      "  return a + b",
      "}",
    ].join("\n");
    expect(codeFrame(rawLines, 7, 2, { linesBelow: 1 })).toEqual(
      [
        "  5 |  * @param b Number",
        "  6 |  * @returns Number",
        "> 7 |  */",
        "    |  ^",
        "  8 |",
      ].join("\n"),
    );
  }
```

#### opts.linesAbove and opts.linesBelow

```ts
test("opts.linesAbove and opts.linesBelow", function () {
    const rawLines = [
      "/**",
      " * Sums two numbers.",
      " *",
      " * @param a Number",
      " * @param b Number",
      " * @returns Number",
      " */",
      "",
      "function sum(a, b) {",
      "  return a + b",
      "}",
    ].join("\n");
    expect(codeFrame(rawLines, 7, 2, { linesAbove: 1, linesBelow: 1 })).toEqual(
      ["  6 |  * @returns Number", "> 7 |  */", "    |  ^", "  8 |"].join("\n"),
    );
  }
```

#### opts.linesAbove no lines above

```ts
test("opts.linesAbove no lines above", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(rawLines, { start: { line: 2 } }, { linesAbove: 0 }),
    ).toEqual(
      [
        "> 2 |   constructor() {",
        "  3 |     console.log(arguments);",
        "  4 |   }",
        "  5 | };",
      ].join("\n"),
    );
  }
```

#### opts.linesBelow no lines below

```ts
test("opts.linesBelow no lines below", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(rawLines, { start: { line: 2 } }, { linesBelow: 0 }),
    ).toEqual(["  1 | class Foo {", "> 2 |   constructor() {"].join("\n"));
  }
```

#### opts.linesBelow single line

```ts
test("opts.linesBelow single line", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(
        rawLines,
        { start: { line: 2 } },
        { linesAbove: 0, linesBelow: 0 },
      ),
    ).toEqual(["> 2 |   constructor() {"].join("\n"));
  }
```

#### basic usage, new API

```ts
test("basic usage, new API", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(
      codeFrameColumns(rawLines, { start: { line: 2, column: 16 } }),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor()",
        "    |                ^",
        "  3 | };",
      ].join("\n"),
    );
  }
```

#### mark multiple columns

```ts
test("mark multiple columns", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(
      codeFrameColumns(rawLines, {
        start: { line: 2, column: 3 },
        end: { line: 2, column: 16 },
      }),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor()",
        "    |   ^^^^^^^^^^^^^",
        "  3 | };",
      ].join("\n"),
    );
  }
```

#### mark multiple columns across lines

```ts
test("mark multiple columns across lines", function () {
    const rawLines = ["class Foo {", "  constructor() {", "  }", "};"].join(
      "\n",
    );
    expect(
      codeFrameColumns(rawLines, {
        start: { line: 2, column: 17 },
        end: { line: 3, column: 3 },
      }),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor() {",
        "    |                 ^",
        "> 3 |   }",
        "    | ^^^",
        "  4 | };",
      ].join("\n"),
    );
  }
```

#### mark multiple columns across multiple lines

```ts
test("mark multiple columns across multiple lines", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(rawLines, {
        start: { line: 2, column: 17 },
        end: { line: 4, column: 3 },
      }),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor() {",
        "    |                 ^",
        "> 3 |     console.log(arguments);",
        "    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^",
        "> 4 |   }",
        "    | ^^^",
        "  5 | };",
      ].join("\n"),
    );
  }
```

#### mark across multiple lines without columns

```ts
test("mark across multiple lines without columns", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(rawLines, { start: { line: 2 }, end: { line: 4 } }),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor() {",
        "> 3 |     console.log(arguments);",
        "> 4 |   }",
        "  5 | };",
      ].join("\n"),
    );
  }
```

#### opts.message

```ts
test("opts.message", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(
      codeFrameColumns(
        rawLines,
        { start: { line: 2, column: 16 } },
        {
          message: "Missing {",
        },
      ),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor()",
        "    |                ^ Missing {",
        "  3 | };",
      ].join("\n"),
    );
  }
```

#### opts.message without column

```ts
test("opts.message without column", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(
      codeFrameColumns(
        rawLines,
        { start: { line: 2 } },
        {
          message: "Missing {",
        },
      ),
    ).toEqual(
      [
        "  Missing {",
        "  1 | class Foo {",
        "> 2 |   constructor()",
        "  3 | };",
      ].join("\n"),
    );
  }
```

#### opts.message with multiple lines

```ts
test("opts.message with multiple lines", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(
        rawLines,
        {
          start: { line: 2, column: 17 },
          end: { line: 4, column: 3 },
        },
        {
          message: "something about the constructor body",
        },
      ),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor() {",
        "    |                 ^",
        "> 3 |     console.log(arguments);",
        "    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^",
        "> 4 |   }",
        "    | ^^^ something about the constructor body",
        "  5 | };",
      ].join("\n"),
    );
  }
```

#### opts.message with multiple lines without columns

```ts
test("opts.message with multiple lines without columns", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(
        rawLines,
        { start: { line: 2 }, end: { line: 4 } },
        {
          message: "something about the constructor body",
        },
      ),
    ).toEqual(
      [
        "  something about the constructor body",
        "  1 | class Foo {",
        "> 2 |   constructor() {",
        "> 3 |     console.log(arguments);",
        "> 4 |   }",
        "  5 | };",
      ].join("\n"),
    );
  }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-haste-map/src/__tests__/index.test.js

#### creates valid cache file paths

```ts
it('creates valid cache file paths', () => {
    jest.resetModules();
    HasteMap = require('../').default;

    expect(
      HasteMap.getCacheFilePath('/', '@scoped/package', 'random-value'),
    ).toMatch(
      process.platform === 'win32'
        ? /^\\-scoped-package-(.*)$/
        : /^\/-scoped-package-(.*)$/,
    );
  }
```

#### creates different cache file paths for different roots

```ts
it('creates different cache file paths for different roots', async () => {
    jest.resetModules();
    const HasteMap = require('../').default;
    const hasteMap1 = await HasteMap.create({
      ...defaultConfig,
      rootDir: '/root1',
    });
    const hasteMap2 = await HasteMap.create({
      ...defaultConfig,
      rootDir: '/root2',
    });
    expect(hasteMap1.getCacheFilePath()).not.toBe(hasteMap2.getCacheFilePath());
  }
```

#### creates different cache file paths for different dependency extractor cache keys

```ts
it('creates different cache file paths for different dependency extractor cache keys', async () => {
    jest.resetModules();
    const HasteMap = require('../').default;
    const dependencyExtractor = require('./dependencyExtractor');
    const config = {
      ...defaultConfig,
      dependencyExtractor: require.resolve('./dependencyExtractor'),
    };
    dependencyExtractor.setCacheKey('foo');
    const hasteMap1 = await HasteMap.create(config);
    dependencyExtractor.setCacheKey('bar');
    const hasteMap2 = await HasteMap.create(config);
    expect(hasteMap1.getCacheFilePath()).not.toBe(hasteMap2.getCacheFilePath());
  }
```

#### creates different cache file paths for different values of computeDependencies

```ts
it('creates different cache file paths for different values of computeDependencies', async () => {
    jest.resetModules();
    const HasteMap = require('../').default;
    const hasteMap1 = await HasteMap.create({
      ...defaultConfig,
      computeDependencies: true,
    });
    const hasteMap2 = await HasteMap.create({
      ...defaultConfig,
      computeDependencies: false,
    });
    expect(hasteMap1.getCacheFilePath()).not.toBe(hasteMap2.getCacheFilePath());
  }
```

#### creates different cache file paths for different hasteImplModulePath cache keys

```ts
it('creates different cache file paths for different hasteImplModulePath cache keys', async () => {
    jest.resetModules();
    const HasteMap = require('../').default;
    const hasteImpl = require('./haste_impl');
    hasteImpl.setCacheKey('foo');
    const hasteMap1 = await HasteMap.create(defaultConfig);
    hasteImpl.setCacheKey('bar');
    const hasteMap2 = await HasteMap.create(defaultConfig);
    expect(hasteMap1.getCacheFilePath()).not.toBe(hasteMap2.getCacheFilePath());
  }
```

#### creates different cache file paths for different projects

```ts
it('creates different cache file paths for different projects', async () => {
    jest.resetModules();
    const HasteMap = require('../').default;
    const hasteMap1 = await HasteMap.create({
      ...defaultConfig,
      id: '@scoped/package',
    });
    const hasteMap2 = await HasteMap.create({
      ...defaultConfig,
      id: '-scoped-package',
    });
    expect(hasteMap1.getCacheFilePath()).not.toBe(hasteMap2.getCacheFilePath());
  }
```

#### matches files against a pattern

```ts
it('matches files against a pattern', async () => {
    const {hasteFS} = await (await HasteMap.create(defaultConfig)).build();
    expect(
      hasteFS.matchFiles(
        process.platform === 'win32' ? /project\\fruits/ : /project\/fruits/,
      ),
    ).toEqual([
      path.join('/', 'project', 'fruits', 'Banana.js'),
      path.join('/', 'project', 'fruits', 'Pear.js'),
      path.join('/', 'project', 'fruits', 'Strawberry.js'),
      path.join('/', 'project', 'fruits', '__mocks__', 'Pear.js'),
    ]);

    expect(hasteFS.matchFiles(/__mocks__/)).toEqual([
      path.join('/', 'project', 'fruits', '__mocks__', 'Pear.js'),
    ]);
  }
```

#### ignores files given a pattern

```ts
it('ignores files given a pattern', async () => {
    const config = {...defaultConfig, ignorePattern: /Kiwi/};
    mockFs[path.join('/', 'project', 'fruits', 'Kiwi.js')] = `
      // Kiwi!
    `;
    const {hasteFS} = await (await HasteMap.create(config)).build();
    expect(hasteFS.matchFiles(/Kiwi/)).toEqual([]);
  }
```

#### ignores vcs directories without ignore pattern

```ts
it('ignores vcs directories without ignore pattern', async () => {
    mockFs[path.join('/', 'project', 'fruits', '.git', 'fruit-history.js')] = `
      // test
    `;
    const {hasteFS} = await (await HasteMap.create(defaultConfig)).build();
    expect(hasteFS.matchFiles('.git')).toEqual([]);
  }
```

#### ignores sapling vcs directories without ignore pattern

```ts
it('ignores sapling vcs directories without ignore pattern', async () => {
    mockFs[path.join('/', 'project', 'fruits', '.sl', 'package.json')] = `
      invalid}{
    `;
    const {hasteFS} = await (await HasteMap.create(defaultConfig)).build();
    expect(hasteFS.matchFiles('.sl')).toEqual([]);
  }
```

#### ignores vcs directories with ignore pattern regex

```ts
it('ignores vcs directories with ignore pattern regex', async () => {
    const config = {...defaultConfig, ignorePattern: /Kiwi/};
    mockFs[path.join('/', 'project', 'fruits', 'Kiwi.js')] = `
      // Kiwi!
    `;

    mockFs[path.join('/', 'project', 'fruits', '.git', 'fruit-history.js')] = `
      // test
    `;
    const {hasteFS} = await (await HasteMap.create(config)).build();
    expect(hasteFS.matchFiles(/Kiwi/)).toEqual([]);
    expect(hasteFS.matchFiles('.git')).toEqual([]);
  }
```

#### builds a haste map on a fresh cache

```ts
it('builds a haste map on a fresh cache', async () => {
    // Include these files in the map
    mockFs[
      path.join('/', 'project', 'fruits', 'node_modules', 'react', 'React.js')
    ] = `
      const Component = require("Component");
    `;
    mockFs[
      path.join(
        '/',
        'project',
        'fruits',
        'node_modules',
        'fbjs',
        'lib',
        'flatMap.js',
      )
    ] = `
      // flatMap
    `;

    // Ignore these
    mockFs[
      path.join(
        '/',
        'project',
        'fruits',
        'node_modules',
        'react',
        'node_modules',
        'fbjs',
        'lib',
        'mapObject.js',
      )
    ] = `
      // mapObject
    `;
    mockFs[
      path.join(
        '/',
        'project',
        'fruits',
        'node_modules',
        'react',
        'node_modules',
        'dummy',
        'merge.js',
      )
    ] = `
      // merge
    `;
    mockFs[
      path.join(
        '/',
        'project',
        'fruits',
        'node_modules',
        'react',
        'node_modules',
        'merge',
        'package.json',
      )
    ] = `
      {
        "name": "merge"
      }
    `;
    mockFs[
      path.join('/', 'project', 'fruits', 'node_modules', 'jest', 'Jest.js')
    ] = `
      const Test = require("Test");
    `;
    mockFs[
      path.join('/', 'project', 'fruits', 'node_modules', 'fbjs2', 'fbjs2.js')
    ] = `
      // fbjs2
    `;

    const hasteMap = await HasteMap.create({
      ...defaultConfig,
      mocksPattern: '__mocks__',
    });

    const {__hasteMapForTest: data} = await hasteMap.build();

    expect(data.clocks).toEqual(mockClocks);

    expect(data.files).toEqual(
      createMap({
        [path.join('fruits', 'Banana.js')]: [
          'Banana',
          32,
          42,
          1,
          'Strawberry',
          null,
        ],
        [path.join('fruits', 'Pear.js')]: [
          'Pear',
          32,
          42,
          1,
          'Banana\0Strawberry',
          null,
        ],
        [path.join('fruits', 'Strawberry.js')]: [
          'Strawberry',
          32,
          42,
          1,
          '',
          null,
        ],
        [path.join('fruits', '__mocks__', 'Pear.js')]: [
          '',
          32,
          42,
          1,
          'Melon',
          null,
        ],
        [path.join('vegetables', 'Melon.js')]: ['Melon', 32, 42, 1, '', null],
      }),
    );

    expect(data.map).toEqual(
      createMap({
        Banana: {
          [H.GENERIC_PLATFORM]: [path.join('fruits', 'Banana.js'), H.MODULE],
        },
        Melon: {
          [H.GENERIC_PLATFORM]: [path.join('vegetables', 'Melon.js'), H.MODULE],
        },
        Pear: {
          [H.GENERIC_PLATFORM]: [path.join('fruits', 'Pear.js'), H.MODULE],
        },
        Strawberry: {
          [H.GENERIC_PLATFORM]: [
            path.join('fruits', 'Strawberry.js'),
            H.MODULE,
          ],
        },
      }),
    );

    expect(data.mocks).toEqual(
      createMap({
        Pear: path.join('fruits', '__mocks__', 'Pear.js'),
      }),
    );

    // The cache file must exactly mirror the data structure returned from a
    // build
    expect(useBuitinsInContext(hasteMap.read())).toEqual(data);
  }
```

#### throws if both symlinks and watchman is enabled

```ts
it('throws if both symlinks and watchman is enabled', async () => {
    await expect(
      HasteMap.create({...defaultConfig, enableSymlinks: true}),
    ).rejects.toThrow(
      'Set either `enableSymlinks` to false or `useWatchman` to false.',
    );
    await expect(
      HasteMap.create({
        ...defaultConfig,
        enableSymlinks: true,
        useWatchman: true,
      }),
    ).rejects.toThrow(
      'Set either `enableSymlinks` to false or `useWatchman` to false.',
    );

    await expect(
      HasteMap.create({
        ...defaultConfig,
        enableSymlinks: false,
        useWatchman: true,
      }),
    ).resolves.not.toThrow();

    await expect(
      HasteMap.create({
        ...defaultConfig,
        enableSymlinks: true,
        useWatchman: false,
      }),
    ).resolves.not.toThrow();
  }
```

#### does not crawl native files even if requested to do so

```ts
it('does not crawl native files even if requested to do so', async () => {
    mockFs[path.join('/', 'project', 'video', 'IRequireAVideo.js')] = `
      module.exports = require("./video.mp4");
    `;

    const hasteMap = await HasteMap.create({
      ...defaultConfig,
      extensions: [...defaultConfig.extensions],
      roots: [...defaultConfig.roots, path.join('/', 'project', 'video')],
    });

    const {__hasteMapForTest: data} = await hasteMap.build();

    expect(data.map.get('IRequireAVideo')).toBeDefined();
    expect(data.files.get(path.join('video', 'video.mp4'))).toBeDefined();
    expect(fs.readFileSync).not.toHaveBeenCalledWith(
      path.join('video', 'video.mp4'),
      'utf8',
    );
  }
```

#### retains all files if `retainAllFiles` is specified

```ts
it('retains all files if `retainAllFiles` is specified', async () => {
    mockFs[
      path.join('/', 'project', 'fruits', 'node_modules', 'fbjs', 'fbjs.js')
    ] = `
      // fbjs!
    `;

    const hasteMap = await HasteMap.create({
      ...defaultConfig,
      mocksPattern: '__mocks__',
      retainAllFiles: true,
    });

    const {__hasteMapForTest: data} = await hasteMap.build();
    // Expect the node module to be part of files but make sure it wasn't
    // read.
    expect(
      data.files.get(path.join('fruits', 'node_modules', 'fbjs', 'fbjs.js')),
    ).toEqual(['', 32, 42, 0, [], null]);

    expect(data.map.get('fbjs')).toBeUndefined();

    // cache file + 5 modules - the node_module
    expect(fs.readFileSync).toHaveBeenCalledTimes(6);
  });

  it('warns on duplicate mock files', async () => {
    expect.assertions(1);

    // Duplicate mock files for blueberry
    mockFs[
      path.join(
        '/',
        'project',
        'fruits1',
        '__mocks__',
        'subdir',
        'Blueberry.js',
      )
    ] = `
      // Blueberry
    `;
    mockFs[
      path.join(
        '/',
        'project',
        'fruits2',
        '__mocks__',
        'subdir',
        'Blueberry.js',
      )
    ] = `
      // Blueberry too!
    `;

    try {
      await (
        await HasteMap.create({
          mocksPattern: '__mocks__',
          throwOnModuleCollision: true,
          ...defaultConfig,
        })
      ).build();
    } catch {
      expect(
        console.error.mock.calls[0][0].replaceAll('\\', '/'),
      ).toMatchSnapshot();
    }
  });

  it('warns on duplicate module ids', async () => {
    mockFs[path.join('/', 'project', 'fruits', 'other', 'Strawberry.js')] = `
      const Banana = require("Banana");
    `;

    const {__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build();

    // Duplicate modules are removed so that it doesn't cause
    // non-determinism later on.
    expect(data.map.get('Strawberry')[H.GENERIC_PLATFORM]).toBeUndefined();

    expect(
      console.warn.mock.calls[0][0].replaceAll('\\', '/'),
    ).toMatchSnapshot();
  }
```

#### warns on duplicate module ids only once

```ts
it('warns on duplicate module ids only once', async () => {
    mockFs[path.join('/', 'project', 'fruits', 'other', 'Strawberry.js')] = `
      const Banana = require("Banana");
    `;

    await (await HasteMap.create(defaultConfig)).build();
    expect(console.warn).toHaveBeenCalledTimes(1);

    await (await HasteMap.create(defaultConfig)).build();
    expect(console.warn).toHaveBeenCalledTimes(1);
  }
```

#### throws on duplicate module ids if "throwOnModuleCollision" is set to true

```ts
it('throws on duplicate module ids if "throwOnModuleCollision" is set to true', async () => {
    expect.assertions(1);
    // Raspberry thinks it is a Strawberry
    mockFs[path.join('/', 'project', 'fruits', 'another', 'Strawberry.js')] = `
      const Banana = require("Banana");
    `;

    try {
      await (
        await HasteMap.create({
          throwOnModuleCollision: true,
          ...defaultConfig,
        })
      ).build();
    } catch (error) {
      expect(error.message).toBe(
        'Duplicated files or mocks. Please check the console for more info',
      );
    }
  }
```

#### splits up modules by platform

```ts
it('splits up modules by platform', async () => {
    mockFs = Object.create(null);
    mockFs[path.join('/', 'project', 'fruits', 'Strawberry.js')] = `
      const Banana = require("Banana");
    `;

    mockFs[path.join('/', 'project', 'fruits', 'Strawberry.ios.js')] = `
      const Raspberry = require("Raspberry");
    `;

    mockFs[path.join('/', 'project', 'fruits', 'Strawberry.android.js')] = `
      const Blackberry = require("Blackberry");
    `;

    const {__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build();

    expect(data.files).toEqual(
      createMap({
        [path.join('fruits', 'Strawberry.android.js')]: [
          'Strawberry',
          32,
          42,
          1,
          'Blackberry',
          null,
        ],
        [path.join('fruits', 'Strawberry.ios.js')]: [
          'Strawberry',
          32,
          42,
          1,
          'Raspberry',
          null,
        ],
        [path.join('fruits', 'Strawberry.js')]: [
          'Strawberry',
          32,
          42,
          1,
          'Banana',
          null,
        ],
      }),
    );

    expect(data.map).toEqual(
      createMap({
        Strawberry: {
          [H.GENERIC_PLATFORM]: [
            path.join('fruits', 'Strawberry.js'),
            H.MODULE,
          ],
          android: [path.join('fruits', 'Strawberry.android.js'), H.MODULE],
          ios: [path.join('fruits', 'Strawberry.ios.js'), H.MODULE],
        },
      }),
    );
  }
```

#### does not access the file system on a warm cache with no changes

```ts
it('does not access the file system on a warm cache with no changes', async () => {
    const {__hasteMapForTest: initialData} = await (
      await HasteMap.create(defaultConfig)
    ).build();

    // The first run should access the file system once for the (empty)
    // cache file and five times for the files in the system.
    expect(fs.readFileSync).toHaveBeenCalledTimes(6);

    fs.readFileSync.mockClear();

    // Explicitly mock that no files have changed.
    mockChangedFiles = Object.create(null);

    // Watchman would give us different clocks.
    mockClocks = createMap({
      fruits: 'c:fake-clock:3',
      vegetables: 'c:fake-clock:4',
    });

    const {__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build();
    expect(fs.readFileSync).toHaveBeenCalledTimes(1);
    if (require('v8').deserialize) {
      expect(fs.readFileSync).toHaveBeenCalledWith(cacheFilePath);
    } else {
      expect(fs.readFileSync).toHaveBeenCalledWith(cacheFilePath, 'utf8');
    }
    expect(useBuitinsInContext(data.clocks)).toEqual(mockClocks);
    expect(useBuitinsInContext(data.files)).toEqual(initialData.files);
    expect(useBuitinsInContext(data.map)).toEqual(initialData.map);
  }
```

#### only does minimal file system access when files change

```ts
it('only does minimal file system access when files change', async () => {
    const {__hasteMapForTest: initialData} = await (
      await HasteMap.create(defaultConfig)
    ).build();
    fs.readFileSync.mockClear();

    // Let's assume one JS file has changed.
    mockChangedFiles = object({
      [path.join('/', 'project', 'fruits', 'Banana.js')]: `
            const Kiwi = require("Kiwi");
          `,
    });

    // Watchman would give us different clocks for `/project/fruits`.
    mockClocks = createMap({
      fruits: 'c:fake-clock:3',
      vegetables: 'c:fake-clock:2',
    });

    const {__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build();

    expect(fs.readFileSync).toHaveBeenCalledTimes(2);

    if (require('v8').serialize) {
      expect(fs.readFileSync).toHaveBeenCalledWith(cacheFilePath);
    } else {
      expect(fs.readFileSync).toHaveBeenCalledWith(cacheFilePath, 'utf8');
    }
    expect(fs.readFileSync).toHaveBeenCalledWith(
      path.join('/', 'project', 'fruits', 'Banana.js'),
      'utf8',
    );

    expect(useBuitinsInContext(data.clocks)).toEqual(mockClocks);

    const files = new Map(initialData.files);
    files.set(path.join('fruits', 'Banana.js'), [
      'Banana',
      32,
      42,
      1,
      'Kiwi',
      null,
    ]);

    expect(useBuitinsInContext(data.files)).toEqual(files);

    const map = new Map(initialData.map);
    expect(useBuitinsInContext(data.map)).toEqual(map);
  });

  it('correctly handles file deletions', async () => {
    const {__hasteMapForTest: initialData} = await (
      await HasteMap.create(defaultConfig)
    ).build();
    fs.readFileSync.mockClear();

    // Let's assume one JS file was removed.
    delete mockFs[path.join('/', 'project', 'fruits', 'Banana.js')];
    mockChangedFiles = object({
      [path.join('/', 'project', 'fruits', 'Banana.js')]: null,
    });

    // Watchman would give us different clocks for `/project/fruits`.
    mockClocks = createMap({
      fruits: 'c:fake-clock:3',
      vegetables: 'c:fake-clock:2',
    });

    const {__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build();

    const files = new Map(initialData.files);
    files.delete(path.join('fruits', 'Banana.js'));
    expect(useBuitinsInContext(data.files)).toEqual(files);

    const map = new Map(initialData.map);
    map.delete('Banana');
    expect(useBuitinsInContext(data.map)).toEqual(map);
  }
```

#### correctly handles platform-specific file additions

```ts
it('correctly handles platform-specific file additions', async () => {
    mockFs = Object.create(null);
    mockFs[path.join('/', 'project', 'fruits', 'Strawberry.js')] = `
      const Banana = require("Banana");
    `;
    let data;
    ({__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build());
    expect(data.map.get('Strawberry')).toEqual({
      g: [path.join('fruits', 'Strawberry.js'), 0],
    });

    delete mockFs[path.join('/', 'project', 'fruits', 'Strawberry.ios.js')];
    mockChangedFiles = object({
      [path.join('/', 'project', 'fruits', 'Strawberry.ios.js')]: `
        const Raspberry = require("Raspberry");
      `,
    });
    mockClocks = createMap({fruits: 'c:fake-clock:3'});
    ({__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build());
    expect(data.map.get('Strawberry')).toEqual({
      g: [path.join('fruits', 'Strawberry.js'), 0],
      ios: [path.join('fruits', 'Strawberry.ios.js'), 0],
    });
  }
```

#### correctly handles platform-specific file deletions

```ts
it('correctly handles platform-specific file deletions', async () => {
    mockFs = Object.create(null);
    mockFs[path.join('/', 'project', 'fruits', 'Strawberry.js')] = `
      const Banana = require("Banana");
    `;
    mockFs[path.join('/', 'project', 'fruits', 'Strawberry.ios.js')] = `
      const Raspberry = require("Raspberry");
    `;
    let data;
    ({__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build());
    expect(data.map.get('Strawberry')).toEqual({
      g: [path.join('fruits', 'Strawberry.js'), 0],
      ios: [path.join('fruits', 'Strawberry.ios.js'), 0],
    });

    delete mockFs[path.join('/', 'project', 'fruits', 'Strawberry.ios.js')];
    mockChangedFiles = object({
      [path.join('/', 'project', 'fruits', 'Strawberry.ios.js')]: null,
    });
    mockClocks = createMap({fruits: 'c:fake-clock:3'});
    ({__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build());
    expect(data.map.get('Strawberry')).toEqual({
      g: [path.join('fruits', 'Strawberry.js'), 0],
    });
  }
```

#### correctly handles platform-specific file renames

```ts
it('correctly handles platform-specific file renames', async () => {
    mockFs = Object.create(null);
    mockFs[path.join('/', 'project', 'fruits', 'Strawberry.ios.js')] = `
      const Raspberry = require("Raspberry");
    `;
    let data;
    ({__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build());
    expect(data.map.get('Strawberry')).toEqual({
      ios: [path.join('fruits', 'Strawberry.ios.js'), 0],
    });

    delete mockFs[path.join('/', 'project', 'fruits', 'Strawberry.ios.js')];
    mockChangedFiles = object({
      [path.join('/', 'project', 'fruits', 'Strawberry.ios.js')]: null,
      [path.join('/', 'project', 'fruits', 'Strawberry.js')]: `
        const Banana = require("Banana");
      `,
    });
    mockClocks = createMap({fruits: 'c:fake-clock:3'});
    ({__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build());
    expect(data.map.get('Strawberry')).toEqual({
      g: [path.join('fruits', 'Strawberry.js'), 0],
    });
  }
```

#### recovers when a duplicate file is deleted

```ts
it('recovers when a duplicate file is deleted', async () => {
      delete mockFs[
        path.join('/', 'project', 'fruits', 'another', 'Strawberry.js')
      ];
      mockChangedFiles = object({
        [path.join('/', 'project', 'fruits', 'another', 'Strawberry.js')]: null,
      });
      mockClocks = createMap({
        fruits: 'c:fake-clock:3',
        vegetables: 'c:fake-clock:2',
      });

      const {__hasteMapForTest: data} = await (
        await HasteMap.create(defaultConfig)
      ).build();
      expect(useBuitinsInContext(data.duplicates)).toEqual(new Map());
      expect(data.map.get('Strawberry')).toEqual({
        g: [path.join('fruits', 'Strawberry.js'), H.MODULE],
      });
      // Make sure the other files are not affected.
      expect(data.map.get('Banana')).toEqual({
        g: [path.join('fruits', 'Banana.js'), H.MODULE],
      });
    }
```

#### recovers with the correct type when a duplicate file is deleted

```ts
it('recovers with the correct type when a duplicate file is deleted', async () => {
      mockFs[
        path.join('/', 'project', 'fruits', 'strawberryPackage', 'package.json')
      ] = `
        {"name": "Strawberry"}
      `;

      const {__hasteMapForTest: data} = await (
        await HasteMap.create(defaultConfig)
      ).build();

      expect(useBuitinsInContext(data.duplicates)).toEqual(
        createMap({
          Strawberry: createMap({
            g: createMap({
              [path.join('fruits', 'Strawberry.js')]: H.MODULE,
              [path.join('fruits', 'another', 'Strawberry.js')]: H.MODULE,
              [path.join('fruits', 'strawberryPackage', 'package.json')]:
                H.PACKAGE,
            }),
          }),
        }),
      );

      delete mockFs[
        path.join('/', 'project', 'fruits', 'another', 'Strawberry.js')
      ];
      delete mockFs[
        path.join('/', 'project', 'fruits', 'strawberryPackage', 'package.json')
      ];

      mockChangedFiles = object({
        [path.join('/', 'project', 'fruits', 'another', 'Strawberry.js')]: null,
        [path.join(
          '/',
          'project',
          'fruits',
          'strawberryPackage',
          'package.json',
        )]: null,
      });
      mockClocks = createMap({
        fruits: 'c:fake-clock:4',
      });

      const {__hasteMapForTest: correctData} = await (
        await HasteMap.create(defaultConfig)
      ).build();

      expect(useBuitinsInContext(correctData.duplicates)).toEqual(new Map());
      expect(correctData.map.get('Strawberry')).toEqual({
        g: [path.join('fruits', 'Strawberry.js'), H.MODULE],
      });
    }
```

#### recovers when a duplicate module is renamed

```ts
it('recovers when a duplicate module is renamed', async () => {
      mockChangedFiles = object({
        [path.join('/', 'project', 'fruits', 'another', 'Pineapple.js')]: `
          const Blackberry = require("Blackberry");
        `,
        [path.join('/', 'project', 'fruits', 'another', 'Strawberry.js')]: null,
      });
      mockClocks = createMap({
        fruits: 'c:fake-clock:3',
        vegetables: 'c:fake-clock:2',
      });

      const {__hasteMapForTest: data} = await (
        await HasteMap.create(defaultConfig)
      ).build();
      expect(useBuitinsInContext(data.duplicates)).toEqual(new Map());
      expect(data.map.get('Strawberry')).toEqual({
        g: [path.join('fruits', 'Strawberry.js'), H.MODULE],
      });
      expect(data.map.get('Pineapple')).toEqual({
        g: [path.join('fruits', 'another', 'Pineapple.js'), H.MODULE],
      });
      // Make sure the other files are not affected.
      expect(data.map.get('Banana')).toEqual({
        g: [path.join('fruits', 'Banana.js'), H.MODULE],
      });
    }
```

#### discards the cache when configuration changes

```ts
it('discards the cache when configuration changes', async () => {
    HasteMap.getCacheFilePath = getCacheFilePath;
    await (await HasteMap.create(defaultConfig)).build();
    fs.readFileSync.mockClear();

    // Explicitly mock that no files have changed.
    mockChangedFiles = Object.create(null);

    // Watchman would give us different clocks.
    mockClocks = createMap({
      fruits: 'c:fake-clock:3',
      vegetables: 'c:fake-clock:4',
    });

    const config = {...defaultConfig, ignorePattern: /Kiwi|Pear/};
    const {moduleMap} = await (await HasteMap.create(config)).build();
    expect(moduleMap.getModule('Pear')).toBeNull();
  }
```

#### ignores files that do not exist

```ts
it('ignores files that do not exist', async () => {
    const watchman = require('../crawlers/watchman').watchmanCrawl;
    const mockImpl = watchman.getMockImplementation();
    // Wrap the watchman mock and add an invalid file to the file list.
    watchman.mockImplementation(options =>
      mockImpl(options).then(() => {
        const {data} = options;
        data.files.set(path.join('fruits', 'invalid', 'file.js'), [
          '',
          34,
          44,
          0,
          [],
        ]);
        return {hasteMap: data, removedFiles: new Map()};
      }),
    );

    const {__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build();
    expect(data.files.size).toBe(5);

    // Ensure this file is not part of the file list.
    expect(
      data.files.get(path.join('fruits', 'invalid', 'file.js')),
    ).toBeUndefined();
  }
```

#### distributes work across workers

```ts
it('distributes work across workers', async () => {
    const jestWorker = require('jest-worker').Worker;
    const path = require('path');
    const dependencyExtractor = path.join(__dirname, 'dependencyExtractor.js');
    const {__hasteMapForTest: data} = await (
      await HasteMap.create({
        ...defaultConfig,
        dependencyExtractor,
        hasteImplModulePath: undefined,
        maxWorkers: 4,
      })
    ).build();

    expect(jestWorker).toHaveBeenCalledTimes(1);

    expect(mockWorker).toHaveBeenCalledTimes(5);

    expect(mockWorker.mock.calls).toEqual([
      [
        {
          computeDependencies: true,
          computeSha1: false,
          dependencyExtractor,
          filePath: path.join('/', 'project', 'fruits', 'Banana.js'),
          hasteImplModulePath: undefined,
          rootDir: path.join('/', 'project'),
        },
      ],
      [
        {
          computeDependencies: true,
          computeSha1: false,
          dependencyExtractor,
          filePath: path.join('/', 'project', 'fruits', 'Pear.js'),
          hasteImplModulePath: undefined,
          rootDir: path.join('/', 'project'),
        },
      ],
      [
        {
          computeDependencies: true,
          computeSha1: false,
          dependencyExtractor,
          filePath: path.join('/', 'project', 'fruits', 'Strawberry.js'),
          hasteImplModulePath: undefined,
          rootDir: path.join('/', 'project'),
        },
      ],
      [
        {
          computeDependencies: true,
          computeSha1: false,
          dependencyExtractor,
          filePath: path.join('/', 'project', 'fruits', '__mocks__', 'Pear.js'),
          hasteImplModulePath: undefined,
          rootDir: path.join('/', 'project'),
        },
      ],
      [
        {
          computeDependencies: true,
          computeSha1: false,
          dependencyExtractor,
          filePath: path.join('/', 'project', 'vegetables', 'Melon.js'),
          hasteImplModulePath: undefined,
          rootDir: path.join('/', 'project'),
        },
      ],
    ]);

    expect(mockEnd).toHaveBeenCalled();
  }
```

#### tries to crawl using node as a fallback

```ts
it('tries to crawl using node as a fallback', async () => {
    const watchman = require('../crawlers/watchman').watchmanCrawl;
    const node = require('../crawlers/node').nodeCrawl;

    watchman.mockImplementation(() => {
      throw new Error('watchman error');
    });
    node.mockImplementation(options => {
      const {data} = options;
      data.files = createMap({
        [path.join('fruits', 'Banana.js')]: ['', 32, 42, 0, '', null],
      });
      return Promise.resolve({
        hasteMap: data,
        removedFiles: new Map(),
      });
    });

    const {__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build();
    expect(watchman).toHaveBeenCalled();
    expect(node).toHaveBeenCalled();

    expect(data.files).toEqual(
      createMap({
        [path.join('fruits', 'Banana.js')]: [
          'Banana',
          32,
          42,
          1,
          'Strawberry',
          null,
        ],
      }),
    );

    expect(console.warn.mock.calls[0][0]).toMatchSnapshot();
  }
```

#### tries to crawl using node as a fallback when promise fails once

```ts
it('tries to crawl using node as a fallback when promise fails once', async () => {
    const watchman = require('../crawlers/watchman').watchmanCrawl;
    const node = require('../crawlers/node').nodeCrawl;

    watchman.mockImplementation(() =>
      Promise.reject(new Error('watchman error')),
    );
    node.mockImplementation(options => {
      const {data} = options;
      data.files = createMap({
        [path.join('fruits', 'Banana.js')]: ['', 32, 42, 0, '', null],
      });
      return Promise.resolve({
        hasteMap: data,
        removedFiles: new Map(),
      });
    });

    const {__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build();

    expect(watchman).toHaveBeenCalled();
    expect(node).toHaveBeenCalled();

    expect(data.files).toEqual(
      createMap({
        [path.join('fruits', 'Banana.js')]: [
          'Banana',
          32,
          42,
          1,
          'Strawberry',
          null,
        ],
      }),
    );
  }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-haste-map/src/__tests__/worker.test.js

#### parses JavaScript files and extracts module information

```ts
it('parses JavaScript files and extracts module information', async () => {
    expect(
      await worker({
        computeDependencies: true,
        filePath: path.join('/project', 'fruits', 'Pear.js'),
        rootDir,
      }),
    ).toEqual({
      dependencies: ['Banana', 'Strawberry'],
    });

    expect(
      await worker({
        computeDependencies: true,
        filePath: path.join('/project', 'fruits', 'Strawberry.js'),
        rootDir,
      }),
    ).toEqual({
      dependencies: [],
    });
  }
```

#### accepts a custom dependency extractor

```ts
it('accepts a custom dependency extractor', async () => {
    expect(
      await worker({
        computeDependencies: true,
        dependencyExtractor: path.join(__dirname, 'dependencyExtractor.js'),
        filePath: path.join('/project', 'fruits', 'Pear.js'),
        rootDir,
      }),
    ).toEqual({
      dependencies: ['Banana', 'Strawberry', 'Lime'],
    });
  }
```

#### delegates to hasteImplModulePath for getting the id

```ts
it('delegates to hasteImplModulePath for getting the id', async () => {
    expect(
      await worker({
        computeDependencies: true,
        filePath: path.join('/project', 'fruits', 'Pear.js'),
        hasteImplModulePath: require.resolve('./haste_impl.js'),
        rootDir,
      }),
    ).toEqual({
      dependencies: ['Banana', 'Strawberry'],
      id: 'Pear',
      module: [path.join('fruits', 'Pear.js'), H.MODULE],
    });

    expect(
      await worker({
        computeDependencies: true,
        filePath: path.join('/project', 'fruits', 'Strawberry.js'),
        hasteImplModulePath: require.resolve('./haste_impl.js'),
        rootDir,
      }),
    ).toEqual({
      dependencies: [],
      id: 'Strawberry',
      module: [path.join('fruits', 'Strawberry.js'), H.MODULE],
    });
  }
```

#### parses package.json files as haste packages

```ts
it('parses package.json files as haste packages', async () => {
    expect(
      await worker({
        computeDependencies: true,
        filePath: path.join('/project', 'package.json'),
        rootDir,
      }),
    ).toEqual({
      dependencies: undefined,
      id: 'haste-package',
      module: ['package.json', H.PACKAGE],
    });
  }
```

#### returns an error when a file cannot be accessed

```ts
it('returns an error when a file cannot be accessed', async () => {
    let error = null;

    try {
      await worker({computeDependencies: true, filePath: '/kiwi.js', rootDir});
    } catch (thrownError) {
      error = thrownError;
    }

    expect(error.message).toBe("Cannot read path '/kiwi.js'.");
  }
```

#### simply computes SHA-1s when requested (works well with binary data)

```ts
it('simply computes SHA-1s when requested (works well with binary data)', async () => {
    expect(
      await getSha1({
        computeSha1: true,
        filePath: path.join('/project', 'fruits', 'apple.png'),
        rootDir,
      }),
    ).toEqual({sha1: '4caece539b039b16e16206ea2478f8c5ffb2ca05'});

    expect(
      await getSha1({
        computeSha1: false,
        filePath: path.join('/project', 'fruits', 'Banana.js'),
        rootDir,
      }),
    ).toEqual({sha1: null});

    expect(
      await getSha1({
        computeSha1: true,
        filePath: path.join('/project', 'fruits', 'Banana.js'),
        rootDir,
      }),
    ).toEqual({sha1: '7772b628e422e8cf59c526be4bb9f44c0898e3d1'});

    expect(
      await getSha1({
        computeSha1: true,
        filePath: path.join('/project', 'fruits', 'Pear.js'),
        rootDir,
      }),
    ).toEqual({sha1: 'c7a7a68a1c8aaf452669dd2ca52ac4a434d25552'});

    await expect(
      getSha1({computeSha1: true, filePath: '/i/dont/exist.js', rootDir}),
    ).rejects.toThrow("Cannot read path '/i/dont/exist.js'.");
  }
```

#### avoids computing dependencies if not requested and Haste does not need it

```ts
it('avoids computing dependencies if not requested and Haste does not need it', async () => {
    expect(
      await worker({
        computeDependencies: false,
        filePath: path.join('/project', 'fruits', 'Pear.js'),
        hasteImplModulePath: path.resolve(__dirname, 'haste_impl.js'),
        rootDir,
      }),
    ).toEqual({
      dependencies: undefined,
      id: 'Pear',
      module: [path.join('fruits', 'Pear.js'), H.MODULE],
      sha1: undefined,
    });

    // Ensure not disk access happened.
    expect(fs.readFileSync).not.toHaveBeenCalled();
    expect(fs.readFile).not.toHaveBeenCalled();
  }
```

### /tmp/ctest-repos-nXQIAb/14937caf7b-cyclonedx-npm/tests/integration/cli.edge-cases.test.js

#### unsupported NPM version

```ts
test('unsupported NPM version', async () => {
    const logFileBase = join(tmpRoot, 'unsupported-npm-version')
    const cwd = join(dummyProjectsRoot, 'with-lockfile')

    const npmVersion = [
      Math.round((NPM_LOWEST_SUPPORTED[0] - 1) * Math.random()),
      Math.round(99 * Math.random()),
      Math.round(99 * Math.random())
    ]

    const { res, errFile } = runCLI([], logFileBase, cwd, {
      CT_VERSION: npmVersion.join('.'),
      npm_execpath: npmLsReplacement.justExit
    })

    try {
      await expect(res).rejects.toThrow(/Unsupported NPM version/i)
    } catch (err) {
      process.stderr.write(readFileSync(errFile))
      throw err
    }
  }
```

#### error on non-existing binary

```ts
test('error on non-existing binary', async () => {
      const logFileBase = join(tmpRootRun, 'non-existing')
      const cwd = join(dummyProjectsRoot, 'with-lockfile')

      const { res, errFile } = runCLI([], logFileBase, cwd, {
        npm_execpath: npmLsReplacement.nonExistingBinary
      })

      try {
        await expect(res).rejects.toThrow(/^unexpected npm execpath/i)
      } catch (err) {
        process.stderr.write(readFileSync(errFile))
        throw err
      }
    }
```

#### error on non-zero exit

```ts
test('error on non-zero exit', async () => {
      const logFileBase = join(tmpRootRun, 'error-exit-nonzero')
      const cwd = join(dummyProjectsRoot, 'with-lockfile')

      const expectedExitCode = 1 + Math.floor(254 * Math.random())

      const { res, errFile } = runCLI([], logFileBase, cwd, {
        // non-zero exit code
        CT_EXIT_CODE: `${expectedExitCode}`,
        npm_execpath: npmLsReplacement.justExit
      })

      try {
        await expect(res).rejects.toThrow(`npm-ls exited with errors: ${expectedExitCode} noSignal`)
      } catch (err) {
        process.stderr.write(readFileSync(errFile))
        throw err
      }
    }
```

#### error on broken json response

```ts
test('error on broken json response', async () => {
      const logFileBase = join(tmpRootRun, 'error-json-broken')
      const cwd = join(dummyProjectsRoot, 'with-lockfile')

      const { res, errFile } = runCLI([], logFileBase, cwd, {
        // abuse the npm-ls replacement, as it can be caused to crash under control.
        npm_execpath: npmLsReplacement.brokenJson
      })

      try {
        await expect(res).rejects.toThrow(/failed to parse npm-ls response/i)
      } catch (err) {
        process.stderr.write(readFileSync(errFile))
        throw err
      }
    }
```

#### suppressed error on non-zero exit

```ts
test('suppressed error on non-zero exit', async () => {
    const dd = {
      subject: 'dev-dependencies',
      npm: NPM_LOWEST_SUPPORTED[0],
      node: '20',
      os: 'ubuntu-latest'
    }

    mkdirSync(join(tmpRoot, 'suppressed-error-on-non-zero-exit'))
    const expectedOutSnap = join(demoResultsRoot, 'suppressed-error-on-non-zero-exit', `${dd.subject}_npm${dd.npm}_node${dd.node}_${dd.os}.snap.json`)
    const logFileBase = join(tmpRoot, 'suppressed-error-on-non-zero-exit', `${dd.subject}_npm${dd.npm}_node${dd.node}_${dd.os}`)
    const cwd = dummyProjectsRoot

    // non-zero exit code
    const expectedExitCode = 1 + Math.floor(254 * Math.random())

    const { res, outFile, errFile } = runCLI([
      '-vvv',
      '--ignore-npm-errors',
      '--output-reproducible',
      // no intention to test all the spec-versions nor all the output-formats - this would be not our scope.
      '--spec-version', `${latestCdxSpecVersion}`,
      '--output-format', 'JSON',
      // prevent file interaction in this synthetic scenario - they would not exist anyway
      '--package-lock-only',
      '--',
      join('with-lockfile', 'package.json')
    ], logFileBase, cwd, {
      CT_VERSION: `${dd.npm}.99.0`,
      CT_EXIT_CODE: expectedExitCode,
      CT_SUBJECT: dd.subject,
      CT_NPM: dd.npm,
      CT_NODE: dd.node,
      CT_OS: dd.os,
      npm_execpath: npmLsReplacement.demoResults
    })

    try {
      await expect(res).resolves.toBe(0)
    } catch (err) {
      process.stderr.write(readFileSync(errFile))
      throw err
    }

    const actualOutput = makeReproducible('json', readFileSync(outFile, 'utf8'))

    if (UPDATE_SNAPSHOTS) {
      mkdirSync(dirname(expectedOutSnap), { recursive: true })
      writeFileSync(expectedOutSnap, actualOutput, 'utf8')
    }

    expect(actualOutput).toEqual(
      readFileSync(expectedOutSnap, 'utf8'),
      `${outFile} should equal ${expectedOutSnap}`
    )
  }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/hasteMapSha1.test.ts

#### exits the process after test are done but before timers complete

```ts
test('exits the process after test are done but before timers complete', async () => {
  writeFiles(DIR, {
    'file.android.js': '"foo android"',
    'file.ios.js': '"foo ios"',
    'file.js': '"foo default"',
    'fileWithExtension.ignored': '"ignored file"',
    'node_modules/bar/fileWithExtension.ignored': '"ignored node modules"',
    'node_modules/bar/image.png': '"an image"',
    'node_modules/bar/index.js': '"node modules bar"',
  });

  const haste = await JestHasteMap.create({
    computeSha1: true,
    extensions: ['js', 'json', 'png'],
    forceNodeFilesystemAPI: true,
    id: 'tmp',
    ignorePattern: / ^/,
    maxWorkers: 2,
    mocksPattern: '',
    platforms: ['ios', 'android'],
    retainAllFiles: true,
    rootDir: DIR,
    roots: [DIR],
    useWatchman: false,
    watch: false,
  });

  const {hasteFS} = await haste.build();

  expect(hasteFS.getSha1(path.join(DIR, 'file.android.js'))).toBe(
    'e376f9fd9a96d000fa019020159f996a8855f8bc',
  );

  expect(hasteFS.getSha1(path.join(DIR, 'file.ios.js'))).toBe(
    '1271b4db2a5f47ae46cb01a1d0604a94d401e8f7',
  );

  expect(hasteFS.getSha1(path.join(DIR, 'file.js'))).toBe(
    'c26c852220977244418f17a9fdc4ae9c192b3188',
  );

  expect(hasteFS.getSha1(path.join(DIR, 'node_modules/bar/image.png'))).toBe(
    '8688f7e11f63d8a7eac7cb87af850337fabbd400',
  );

  expect(hasteFS.getSha1(path.join(DIR, 'node_modules/bar/index.js'))).toBe(
    'ee245b9fbd45e1f6ad300eb2f5484844f6b5a34c',
  );

  // Ignored files do not get the SHA-1 computed.

  expect(
    hasteFS.getSha1(path.join(DIR, 'fileWithExtension.ignored')),
  ).toBeNull();

  expect(
    hasteFS.getSha1(
      path.join(DIR, 'node_modules/bar/fileWithExtension.ignored'),
    ),
  ).toBeNull();
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-core/src/__tests__/SnapshotInteractiveMode.test.js

#### call to run process the first file

```ts
test('call to run process the first file', () => {
    const assertions = [
      {fullName: 'test one', path: 'first.js'},
      {fullName: 'test two', path: 'second.js'},
    ];
    instance.run(assertions, mockCallback);
    expect(instance.isActive()).toBeTruthy();
    expect(mockCallback).toHaveBeenCalledWith(assertions[0], false);
  }
```

#### call to abort

```ts
test('call to abort', () => {
    const assertions = [
      {fullName: 'test one', path: 'first.js'},
      {fullName: 'test two', path: 'second.js'},
    ];
    instance.run(assertions, mockCallback);
    expect(instance.isActive()).toBeTruthy();
    instance.abort();
    expect(instance.isActive()).toBeFalsy();
    expect(instance.getSkippedNum()).toBe(0);
    expect(mockCallback).toHaveBeenCalledWith(null, false);
  }
```

#### call to reset

```ts
test('call to reset', () => {
    const assertions = [
      {fullName: 'test one', path: 'first.js'},
      {fullName: 'test two', path: 'second.js'},
    ];
    instance.run(assertions, mockCallback);
    expect(instance.isActive()).toBeTruthy();
    instance.restart();
    expect(instance.isActive()).toBeTruthy();
    expect(instance.getSkippedNum()).toBe(0);
    expect(mockCallback).toHaveBeenCalledWith(assertions[0], false);
  }
```

#### press ENTER trigger a run

```ts
test('press ENTER trigger a run', () => {
    const assertions = [{fullName: 'test one', path: 'first.js'}];
    instance.run(assertions, mockCallback);
    instance.put(KEYS.ENTER);
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCallback).toHaveBeenCalledWith(assertions[0], false);
  }
```

#### skip 1 test, then restart

```ts
test('skip 1 test, then restart', () => {
    const assertions = [{fullName: 'test one', path: 'first.js'}];

    instance.run(assertions, mockCallback);
    expect(mockCallback).toHaveBeenNthCalledWith(1, assertions[0], false);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('s');
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('r');
    expect(instance.getSkippedNum()).toBe(0);
    expect(mockCallback).toHaveBeenNthCalledWith(2, assertions[0], false);
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
  }
```

#### skip 1 test, then quit

```ts
test('skip 1 test, then quit', () => {
    const assertions = [{fullName: 'test one', path: 'first.js'}];

    instance.run(assertions, mockCallback);
    expect(mockCallback).toHaveBeenNthCalledWith(1, assertions[0], false);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('s');
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('q');
    expect(instance.getSkippedNum()).toBe(0);
    expect(mockCallback).toHaveBeenNthCalledWith(2, null, false);
    expect(mockCallback).toHaveBeenCalledTimes(2);
  }
```

#### update 1 test, then finish and return

```ts
test('update 1 test, then finish and return', () => {
    const mockCallback = jest.fn();
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: false}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });

    const assertions = [{fullName: 'test one', path: 'first.js'}];

    instance.run(assertions, mockCallback);
    expect(mockCallback).toHaveBeenNthCalledWith(1, assertions[0], false);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('u');
    expect(mockCallback).toHaveBeenNthCalledWith(2, assertions[0], true);
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();

    instance.put(KEYS.ENTER);
    expect(instance.isActive()).toBe(false);
    expect(mockCallback).toHaveBeenNthCalledWith(3, null, false);
  }
```

#### skip 2 tests, then finish and restart

```ts
test('skip 2 tests, then finish and restart', () => {
    const assertions = [
      {fullName: 'test one', path: 'first.js'},
      {fullName: 'test two', path: 'first.js'},
    ];
    instance.run(assertions, mockCallback);
    expect(mockCallback).toHaveBeenNthCalledWith(1, assertions[0], false);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('s');
    expect(mockCallback).toHaveBeenNthCalledWith(2, assertions[1], false);
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('s');
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('r');
    expect(instance.getSkippedNum()).toBe(0);
    expect(mockCallback).toHaveBeenNthCalledWith(3, assertions[0], false);
    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
  }
```

#### update 2 tests, then finish and return

```ts
test('update 2 tests, then finish and return', () => {
    const mockCallback = jest.fn();
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: false}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: false}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });

    const assertions = [
      {fullName: 'test one', path: 'first.js'},
      {fullName: 'test two', path: 'first.js'},
    ];

    instance.run(assertions, mockCallback);
    expect(mockCallback).toHaveBeenNthCalledWith(1, assertions[0], false);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('u');
    expect(mockCallback).toHaveBeenNthCalledWith(2, assertions[0], true);
    expect(mockCallback).toHaveBeenNthCalledWith(3, assertions[1], false);
    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('u');
    expect(mockCallback).toHaveBeenNthCalledWith(4, assertions[1], true);
    expect(mockCallback).toHaveBeenCalledTimes(4);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put(KEYS.ENTER);
    expect(instance.isActive()).toBe(false);
    expect(mockCallback).toHaveBeenNthCalledWith(5, null, false);
    expect(mockCallback).toHaveBeenCalledTimes(5);
  }
```

#### update 1 test, skip 1 test, then finish and restart

```ts
test('update 1 test, skip 1 test, then finish and restart', () => {
    const mockCallback = jest.fn();
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: false}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });

    const assertions = [
      {fullName: 'test one', path: 'first.js'},
      {fullName: 'test two', path: 'first.js'},
    ];

    instance.run(assertions, mockCallback);
    expect(mockCallback).toHaveBeenNthCalledWith(1, assertions[0], false);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('u');
    expect(mockCallback).toHaveBeenNthCalledWith(2, assertions[0], true);
    expect(mockCallback).toHaveBeenNthCalledWith(3, assertions[1], false);
    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('s');
    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('r');
    expect(instance.getSkippedNum()).toBe(0);
    expect(mockCallback).toHaveBeenNthCalledWith(4, assertions[1], false);
    expect(mockCallback).toHaveBeenCalledTimes(4);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
  }
```

#### skip 1 test, update 1 test, then finish and restart

```ts
test('skip 1 test, update 1 test, then finish and restart', () => {
    const mockCallback = jest.fn();
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: false}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });

    const assertions = [
      {fullName: 'test one', path: 'first.js'},
      {fullName: 'test two', path: 'first.js'},
    ];

    instance.run(assertions, mockCallback);
    expect(mockCallback).toHaveBeenNthCalledWith(1, assertions[0], false);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('s');
    expect(mockCallback).toHaveBeenNthCalledWith(2, assertions[1], false);
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('u');
    expect(mockCallback).toHaveBeenNthCalledWith(3, assertions[1], true);
    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('r');
    expect(instance.getSkippedNum()).toBe(0);
    expect(mockCallback).toHaveBeenNthCalledWith(4, assertions[0], false);
    expect(mockCallback).toHaveBeenCalledTimes(4);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
  }
```

### /tmp/ctest-repos-nXQIAb/95324de690-parser/packages/babel-code-frame/test/color-detection.js

#### opts.highlightCode

```ts
test("opts.highlightCode", function () {
      const rawLines = "console.log('babel')";
      const result = codeFrame(rawLines, 1, 9, { highlightCode: true });
      const stripped = stripAnsi(result);
      expect(result.length).toBeGreaterThan(stripped.length);
      expect(stripped).toEqual(
        ["> 1 | console.log('babel')", "    |         ^"].join("\n"),
      );

      const codeResult = result.match(/console.*?babel/)[0];
      const codeStripped = stripAnsi(codeResult);
      expect(codeResult.length).toBeGreaterThan(codeStripped.length);
    }
```

#### opts.highlightCode with multiple columns and lines

```ts
test("opts.highlightCode with multiple columns and lines", function () {
      // prettier-ignore
      const rawLines = [
      "function a(b, c) {",
      "  return b + c;",
      "}"
    ].join("\n");

      const result = codeFrameColumns(
        rawLines,
        {
          start: {
            line: 1,
            column: 1,
          },
          end: {
            line: 3,
            column: 1,
          },
        },
        {
          highlightCode: true,
          message: "Message about things",
        },
      );
      const stripped = stripAnsi(result);
      expect(result.length).toBeGreaterThan(stripped.length);
      expect(stripped).toEqual(
        // prettier-ignore
        [
        "> 1 | function a(b, c) {",
        "    | ^^^^^^^^^^^^^^^^^^",
        "> 2 |   return b + c;",
        "    | ^^^^^^^^^^^^^^^",
        "> 3 | }",
        "    | ^ Message about things",
      ].join('\n'),
      );
    }
```

#### opts.forceColor

```ts
test("opts.forceColor", function () {
      const marker = compose(colors.red, colors.bold);
      const gutter = colors.gray;

      const rawLines = ["", "", "", ""].join("\n");
      expect(
        codeFrame(rawLines, 3, null, {
          linesAbove: 1,
          linesBelow: 1,
          forceColor: true,
        }),
      ).toEqual(
        colors.reset(
          [
            " " + gutter(" 2 |"),
            marker(">") + gutter(" 3 |"),
            " " + gutter(" 4 |"),
          ].join("\n"),
        ),
      );
    }
```

#### jsx

```ts
test("jsx", function () {
      const gutter = colors.gray;
      const yellow = colors.yellow;

      const rawLines = ["<div />"].join("\n");

      expect(
        JSON.stringify(
          codeFrame(rawLines, 0, null, {
            linesAbove: 1,
            linesBelow: 1,
            forceColor: true,
          }),
        ),
      ).toEqual(
        JSON.stringify(
          colors.reset(
            " " +
              gutter(" 1 |") +
              " " +
              yellow("<") +
              yellow("div") +
              " " +
              yellow("/") +
              yellow(">"),
          ),
        ),
      );
    }
```

#### opts.highlightCode

```ts
test("opts.highlightCode", function () {
      const rawLines = "console.log('babel')";
      const result = codeFrame(rawLines, 1, 9, { highlightCode: true });
      const stripped = stripAnsi(result);
      expect(result).toBe(stripped);
      expect(stripped).toEqual(
        ["> 1 | console.log('babel')", "    |         ^"].join("\n"),
      );
    }
```

### /tmp/ctest-repos-nXQIAb/95324de690-parser/packages/babel-plugin-transform-regenerator/test/regenerator.js

#### ${cmd.name} (${args.join(", ")})

```ts
it(`${cmd.name} (${args.join(", ")})`, () =>
        new Promise((resolve, reject) =>
          cmd(...args, err => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
```

#### ${args.join(" ")}

```ts
it(`${args.join(" ")}`, () =>
          new Promise((resolve, reject) => {
            let stdout = "";
            let stderr = "";
            const cp = spawn(
              process.execPath,
              [
                join(mochaDir, "bin", "mocha.js"),
                // https://github.com/nodejs/node/pull/58588#issuecomment-2961692890
                "--timeout",
                "10000",
                "--reporter",
                "spec",
                ...args,
              ],
              { cwd: __dirname },
            );
            cp.stdout.on("data", chunk => {
              stdout += chunk;
            });
            cp.stderr.on("data", chunk => {
              stderr += chunk;
            });
            cp.on("exit", async err => {
              if (err) {
                reject(new Error(`STDOUT:\n${stdout}\nSTDERR:\n${stderr}`));
              } else {
                resolve();
              }
            });
          }
```

#### ${cmd} ${args.join(" ")}

```ts
it(`${cmd} ${args.join(" ")}`, () =>
        new Promise((resolve, reject) => {
          const cp = spawn(cmd, args, { cwd: __dirname });
          let stderr = "";
          cp.stderr.on("data", chunk => {
            stderr += chunk;
          });
          cp.on("exit", async err => {
            if (err) {
              reject(new Error("Exited with " + err + "\n" + stderr));
            } else {
              resolve();
            }
          });
        }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/coverageProviderV8.test.ts

#### prints coverage with missing sourcemaps

```ts
test('prints coverage with missing sourcemaps', () => {
  const sourcemapDir = path.join(DIR, 'no-sourcemap');

  const {stdout, exitCode} = runJest(
    sourcemapDir,
    ['--coverage', '--coverage-provider', 'v8'],
    {stripAnsi: true},
  );

  expect(exitCode).toBe(0);
  expect(stdout).toMatchSnapshot();
}
```

#### prints coverage with empty sourcemaps

```ts
test('prints coverage with empty sourcemaps', () => {
  const sourcemapDir = path.join(DIR, 'empty-sourcemap');

  const {stdout, exitCode} = runJest(
    sourcemapDir,
    ['--coverage', '--coverage-provider', 'v8'],
    {stripAnsi: true},
  );

  expect(exitCode).toBe(0);
  expect(stdout).toMatchSnapshot();
}
```

#### reports coverage with `resetModules`

```ts
test('reports coverage with `resetModules`', () => {
  const sourcemapDir = path.join(DIR, 'with-resetModules');

  const {stdout, exitCode} = runJest(
    sourcemapDir,
    ['--coverage', '--coverage-provider', 'v8'],
    {stripAnsi: true},
  );

  expect(exitCode).toBe(0);
  expect(stdout).toMatchSnapshot();
}
```

#### prints correct coverage report, if a CJS module is put under test without transformation

```ts
test('prints correct coverage report, if a CJS module is put under test without transformation', () => {
  const sourcemapDir = path.join(DIR, 'cjs-native-without-sourcemap');

  const {stdout, exitCode} = runJest(
    sourcemapDir,
    ['--coverage', '--coverage-provider', 'v8', '--no-cache'],
    {stripAnsi: true},
  );

  expect(exitCode).toBe(0);
  expect(stdout).toMatchSnapshot();
}
```

#### prints correct coverage report, if a TS module is transpiled by Babel to CJS and put under test

```ts
test('prints correct coverage report, if a TS module is transpiled by Babel to CJS and put under test', () => {
  const sourcemapDir = path.join(DIR, 'cjs-with-babel-transformer');

  const {stdout, exitCode} = runJest(
    sourcemapDir,
    ['--coverage', '--coverage-provider', 'v8', '--no-cache'],
    {stripAnsi: true},
  );

  expect(exitCode).toBe(0);
  expect(stdout).toMatchSnapshot();
}
```

#### prints correct coverage report, if an ESM module is put under test without transformation

```ts
test('prints correct coverage report, if an ESM module is put under test without transformation', () => {
  const sourcemapDir = path.join(DIR, 'esm-native-without-sourcemap');

  const {stdout, exitCode} = runJest(
    sourcemapDir,
    ['--coverage', '--coverage-provider', 'v8', '--no-cache'],
    {
      nodeOptions: '--experimental-vm-modules --no-warnings',
      stripAnsi: true,
    },
  );

  expect(exitCode).toBe(0);
  expect(stdout).toMatchSnapshot();
}
```

#### prints correct coverage report, if a TS module is transpiled by custom transformer to ESM put under test

```ts
test('prints correct coverage report, if a TS module is transpiled by custom transformer to ESM put under test', () => {
  const sourcemapDir = path.join(DIR, 'esm-with-custom-transformer');

  const {stdout, exitCode} = runJest(
    sourcemapDir,
    ['--coverage', '--coverage-provider', 'v8', '--no-cache'],
    {
      nodeOptions: '--experimental-vm-modules --no-warnings',
      stripAnsi: true,
    },
  );

  expect(exitCode).toBe(0);
  expect(stdout).toMatchSnapshot();
}
```

#### vm script coverage generator

```ts
test('vm script coverage generator', () => {
  const dir = path.resolve(__dirname, '../vmscript-coverage');
  const {stdout, exitCode} = runJest(
    dir,
    ['--coverage', '--coverage-provider', 'v8'],
    {stripAnsi: true},
  );

  expect(exitCode).toBe(0);
  expect(stdout).toMatchSnapshot();
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-haste-map/src/__tests__/get_mock_name.test.js

#### extracts mock name from file path

```ts
it('extracts mock name from file path', () => {
    expect(getMockName(path.join('a', '__mocks__', 'c.js'))).toBe('c');

    expect(getMockName(path.join('a', '__mocks__', 'c', 'd.js'))).toBe(
      path.join('c', 'd').replaceAll('\\', '/'),
    );
  }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-snapshot/src/__tests__/InlineSnapshots.test.ts

#### saveInlineSnapshots() replaces empty function call with a template literal

```ts
test('saveInlineSnapshots() replaces empty function call with a template literal', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(filename, 'expect(1).toMatchInlineSnapshot();\n');

  saveInlineSnapshots(
    [
      {
        frame: {column: 11, file: filename, line: 1} as Frame,
        snapshot: '1',
      },
    ],
    dir,
    'prettier',
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    'expect(1).toMatchInlineSnapshot(`1`);\n',
  );
}
```

#### saveInlineSnapshots() without prettier leaves formatting outside of snapshots alone

```ts
test('saveInlineSnapshots() without prettier leaves formatting outside of snapshots alone', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    `${`
const a = [1,            2];
expect(a).toMatchInlineSnapshot(\`an out-of-date and also multi-line
snapshot\`);
expect(a).toMatchInlineSnapshot();
expect(a).toMatchInlineSnapshot(\`[1, 2]\`);
`.trim()}
```

#### saveInlineSnapshots() with bad prettier path leaves formatting outside of snapshots alone

```ts
test('saveInlineSnapshots() with bad prettier path leaves formatting outside of snapshots alone', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    `${`
const a = [1,            2];
expect(a).toMatchInlineSnapshot(\`an out-of-date and also multi-line
snapshot\`);
expect(a).toMatchInlineSnapshot();
expect(a).toMatchInlineSnapshot(\`[1, 2]\`);
`.trim()}
```

#### saveInlineSnapshots() can handle tsx without prettier

```ts
test('saveInlineSnapshots() can handle tsx without prettier', () => {
  const filename = path.join(dir, 'my.test.tsx');
  fs.writeFileSync(
    filename,
    `${`
it('foos', async () => {
  const Foo = (props: { foo: string }) => <div>{props.foo}</div>;
  const a = await Foo({ foo: "hello" });
  expect(a).toMatchInlineSnapshot();
})
`.trim()}\n`,
  );

  saveInlineSnapshots(
    [
      {
        frame: {column: 13, file: filename, line: 4} as Frame,
        snapshot: '<div>hello</div>',
      },
    ],
    dir,
    null,
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    `${`
it('foos', async () => {
  const Foo = (props: { foo: string }) => <div>{props.foo}</div>;
  const a = await Foo({ foo: "hello" });
  expect(a).toMatchInlineSnapshot(\`<div>hello</div>\`);
})
`.trim()}\n`,
  );
});

test('saveInlineSnapshots() can handle flow and jsx without prettier', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    `${`
const Foo = (props: { foo: string }) => <div>{props.foo}</div>;
const a = Foo({ foo: "hello" });
expect(a).toMatchInlineSnapshot();
`.trim()}\n`,
  );
  fs.writeFileSync(
    path.join(dir, '.babelrc'),
    JSON.stringify({
      presets: [
        require.resolve('@babel/preset-flow'),
        require.resolve('@babel/preset-react'),
      ],
    }),
  );

  saveInlineSnapshots(
    [
      {
        frame: {column: 11, file: filename, line: 3} as Frame,
        snapshot: '<div>hello</div>',
      },
    ],
    dir,
    null,
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    `${`
const Foo = (props: { foo: string }) => <div>{props.foo}</div>;
const a = Foo({ foo: "hello" });
expect(a).toMatchInlineSnapshot(\`<div>hello</div>\`);
`.trim()}\n`,
  );
});

test('saveInlineSnapshots() can use prettier to fix formatting for whole file', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    `${`
const a = [1,            2];
expect(a).toMatchInlineSnapshot(\`an out-of-date and also multi-line
snapshot\`);
expect(a).toMatchInlineSnapshot();
expect(a).toMatchInlineSnapshot(\`[1, 2]\`);
`.trim()}\n`,
  );

  saveInlineSnapshots(
    [2, 4, 5].map(line => ({
      frame: {column: 11, file: filename, line} as Frame,
      snapshot: '[1, 2]',
    })),
    dir,
    'prettier',
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    `const a = [1, 2];
expect(a).toMatchInlineSnapshot(\`[1, 2]\`);
expect(a).toMatchInlineSnapshot(\`[1, 2]\`);
expect(a).toMatchInlineSnapshot(\`[1, 2]\`);
`,
  );
}
```

#### saveInlineSnapshots() replaces existing template literal with property matchers

```ts
test('saveInlineSnapshots() replaces existing template literal with property matchers', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(filename, 'expect(1).toMatchInlineSnapshot({}, `2`);\n');

  saveInlineSnapshots(
    [
      {
        frame: {column: 11, file: filename, line: 1} as Frame,
        snapshot: '1',
      },
    ],
    dir,
    'prettier',
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    'expect(1).toMatchInlineSnapshot({}, `1`);\n',
  );
}
```

#### saveInlineSnapshots() throws if frame does not match

```ts
test('saveInlineSnapshots() throws if frame does not match', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(filename, 'expect(1).toMatchInlineSnapshot();\n');

  const save = () =>
    saveInlineSnapshots(
      [
        {
          frame: {
            column: 2 /* incorrect */,
            file: filename,
            line: 1,
          } as Frame,
          snapshot: '1',
        },
      ],
      dir,
      'prettier',
    );

  expect(save).toThrow(/Couldn't locate all inline snapshots./);
});

test('saveInlineSnapshots() throws if multiple calls to to the same location', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(filename, 'expect(1).toMatchInlineSnapshot();\n');

  const frame = {column: 11, file: filename, line: 1} as Frame;
  const save = () =>
    saveInlineSnapshots(
      [
        {frame, snapshot: '1'},
        {frame, snapshot: '2'},
      ],
      dir,
      'prettier',
    );

  expect(save).toThrow(
    /Multiple inline snapshots for the same call are not supported./,
  );
});

test('saveInlineSnapshots() uses escaped backticks', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(filename, 'expect("`").toMatchInlineSnapshot();\n');

  const frame = {column: 13, file: filename, line: 1} as Frame;
  saveInlineSnapshots([{frame, snapshot: '`'}], dir, 'prettier');

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    'expect("`").toMatchInlineSnapshot(`\\``);\n',
  );
});

test('saveInlineSnapshots() works with non-literals in expect call', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(filename, "expect({a: 'a'}).toMatchInlineSnapshot();\n");
  jest.mocked(prettier.resolveConfig.sync).mockReturnValue({
    bracketSpacing: false,
    singleQuote: true,
  });

  saveInlineSnapshots(
    [
      {
        frame: {column: 18, file: filename, line: 1} as Frame,
        snapshot: "{a: 'a'}",
      },
    ],
    dir,
    'prettier',
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    "expect({a: 'a'}).toMatchInlineSnapshot(`{a: 'a'}`);\n",
  );
});

test('saveInlineSnapshots() indents multi-line snapshots with spaces', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    "it('is a test', () => {\n" +
      "  expect({a: 'a'}).toMatchInlineSnapshot();\n" +
      '});\n',
  );
  jest.mocked(prettier.resolveConfig.sync).mockReturnValue({
    bracketSpacing: false,
    singleQuote: true,
  });

  saveInlineSnapshots(
    [
      {
        frame: {column: 20, file: filename, line: 2} as Frame,
        snapshot: "\nObject {\n  a: 'a'\n}\n",
      },
    ],
    dir,
    'prettier',
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    "it('is a test', () => {\n" +
      "  expect({a: 'a'}).toMatchInlineSnapshot(`\n" +
      '    Object {\n' +
      "      a: 'a'\n" +
      '    }\n' +
      '  `);\n' +
      '});\n',
  );
});

test('saveInlineSnapshots() does not re-indent error snapshots', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    "it('is an error test', () => {\n" +
      '  expect(() => {\n' +
      "    throw new Error(['a', 'b'].join('\\n'));\n" +
      '  }).toThrowErrorMatchingInlineSnapshot(`\n' +
      '    "a\n' +
      '    b"\n' +
      '  `);\n' +
      '});\n' +
      "it('is another test', () => {\n" +
      "  expect({a: 'a'}).toMatchInlineSnapshot();\n" +
      '}
```

#### is an error test

```ts
it('is an error test', () => {\n" +
      '  expect(() => {\n' +
      "    throw new Error(['a', 'b'].join('\\n'));\n" +
      '  }).toThrowErrorMatchingInlineSnapshot(`\n' +
      '    "a\n' +
      '    b"\n' +
      '  `);\n' +
      '});\n' +
      "it('is another test', () => {\n" +
      "  expect({a: 'a'}).toMatchInlineSnapshot(`\n" +
      '    Object {\n' +
      "      a: 'a'\n" +
      '    }\n' +
      '  `);\n' +
      '});\n',
  );
});

test('saveInlineSnapshots() does not re-indent already indented snapshots', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    "it('is a test', () => {\n" +
      "  expect({a: 'a'}).toMatchInlineSnapshot();\n" +
      '}
```

#### saveInlineSnapshots() indents multi-line snapshots with tabs

```ts
test('saveInlineSnapshots() indents multi-line snapshots with tabs', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    "it('is a test', () => {\n" +
      "  expect({a: 'a'}).toMatchInlineSnapshot();\n" +
      '});\n',
  );
  jest.mocked(prettier.resolveConfig.sync).mockReturnValue({
    bracketSpacing: false,
    singleQuote: true,
    useTabs: true,
  });

  saveInlineSnapshots(
    [
      {
        frame: {column: 20, file: filename, line: 2} as Frame,
        snapshot: "\nObject {\n  a: 'a'\n}\n",
      },
    ],
    dir,
    'prettier',
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    "it('is a test', () => {\n" +
      "\texpect({a: 'a'}).toMatchInlineSnapshot(`\n" +
      '\t\tObject {\n' +
      "\t\t  a: 'a'\n" +
      '\t\t}\n' +
      '\t`);\n' +
      '});\n',
  );
}
```

#### saveInlineSnapshots() indents snapshots after prettier reformats

```ts
test('saveInlineSnapshots() indents snapshots after prettier reformats', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    "it('is a test', () => expect({a: 'a'}).toMatchInlineSnapshot());\n",
  );
  jest.mocked(prettier.resolveConfig.sync).mockReturnValue({
    bracketSpacing: false,
    singleQuote: true,
  });

  saveInlineSnapshots(
    [
      {
        frame: {column: 40, file: filename, line: 1} as Frame,
        snapshot: "\nObject {\n  a: 'a'\n}\n",
      },
    ],
    dir,
    'prettier',
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    "it('is a test', () =>\n" +
      "  expect({a: 'a'}).toMatchInlineSnapshot(`\n" +
      '    Object {\n' +
      "      a: 'a'\n" +
      '    }\n' +
      '  `));\n',
  );
}
```

#### saveInlineSnapshots() does not indent empty lines

```ts
test('saveInlineSnapshots() does not indent empty lines', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    "it('is a test', () => expect(`hello\n\nworld`).toMatchInlineSnapshot());\n",
  );
  jest.mocked(prettier.resolveConfig.sync).mockReturnValue({
    bracketSpacing: false,
    singleQuote: true,
  });

  saveInlineSnapshots(
    [
      {
        frame: {column: 9, file: filename, line: 3} as Frame,
        snapshot: '\nhello\n\nworld\n',
      },
    ],
    dir,
    'prettier',
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    "it('is a test', () =>\n" +
      '  expect(`hello\n\nworld`).toMatchInlineSnapshot(`\n' +
      '    hello\n' +
      '\n' +
      '    world\n' +
      '  `));\n',
  );
}
```

#### saveInlineSnapshots() indents awaited snapshots with spaces

```ts
test('saveInlineSnapshots() indents awaited snapshots with spaces', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    "it('is a test', async () => {\n" +
      "  const a = Promise.resolve({a: 'a'});\n" +
      '  await expect(a).resolves.toMatchInlineSnapshot();\n' +
      '});\n',
  );
  jest.mocked(prettier.resolveConfig.sync).mockReturnValue({
    bracketSpacing: false,
    singleQuote: true,
  });

  saveInlineSnapshots(
    [
      {
        frame: {column: 28, file: filename, line: 3} as Frame,
        snapshot: "\nObject {\n  a: 'a'\n}\n",
      },
    ],
    dir,
    'prettier',
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    "it('is a test', async () => {\n" +
      "  const a = Promise.resolve({a: 'a'});\n" +
      '  await expect(a).resolves.toMatchInlineSnapshot(`\n' +
      '    Object {\n' +
      "      a: 'a'\n" +
      '    }\n' +
      '  `);\n' +
      '});\n',
  );
}
```

#### saveInlineSnapshots() prioritize parser from project/editor configuration

```ts
test('saveInlineSnapshots() prioritize parser from project/editor configuration', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    'const foo = {\n' +
      '  "1": "Some value",\n' +
      '};\n' +
      'test("something", () => {\n' +
      '  expect("a").toMatchInlineSnapshot();\n' +
      '});\n',
  );

  jest.mocked(prettier.resolveConfig.sync).mockReturnValue({
    parser: 'flow',
  });

  const prettierSpy = jest.spyOn(prettier.getFileInfo, 'sync');

  saveInlineSnapshots(
    [
      {
        frame: {column: 15, file: filename, line: 5} as Frame,
        snapshot: 'a',
      },
    ],
    dir,
    'prettier',
  );

  expect(prettierSpy).not.toHaveBeenCalled();
  expect(fs.readFileSync(filename, 'utf8')).toBe(
    'const foo = {\n' +
      '  "1": "Some value",\n' +
      '};\n' +
      'test("something", () => {\n' +
      '  expect("a").toMatchInlineSnapshot(`a`);\n' +
      '});\n',
  );
}
```

#### saveInlineSnapshots() replaces string literal, not just template literal

```ts
test('saveInlineSnapshots() replaces string literal, not just template literal', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(filename, 'expect("a").toMatchInlineSnapshot("b");\n');

  saveInlineSnapshots(
    [
      {
        frame: {column: 13, file: filename, line: 1} as Frame,
        snapshot: 'a',
      },
    ],
    dir,
    'prettier',
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    'expect("a").toMatchInlineSnapshot(`a`);\n',
  );
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/pretty-format/src/__tests__/DOMElement.test.ts

#### supports siblings

```ts
it('supports siblings', () => {
    const parent = document.createElement('div');
    parent.innerHTML = '<span>some </span><span>text</span>';

    expect(parent).toPrettyPrintTo(
      [
        '<div>',
        '  <span>',
        '    some ',
        '  </span>',
        '  <span>',
        '    text',
        '  </span>',
        '</div>',
      ].join('\n'),
    );
  }
```

#### supports multiline text node in pre

```ts
it('supports multiline text node in pre', () => {
    const parent = document.createElement('pre');
    parent.innerHTML = [
      // prettier-ignore
      'function sum(a, b) {',
      '  return a + b;',
      '}',
    ].join('\n');

    // Ouch. Two lines of text have same indentation for different reason:
    // First line of text node because it is at child level.
    // Second line of text node because they are in its content.
    expect(parent).toPrettyPrintTo(
      // prettier-ignore
      [
        '<pre>',
        '  function sum(a, b) {',
        '  return a + b;',
        '}',
        '</pre>'
      ].join('\n'),
    );
  }
```

#### supports multiline text node preceding span in pre

```ts
it('supports multiline text node preceding span in pre', () => {
    const parent = document.createElement('pre');
    parent.innerHTML = [
      '<span class="token keyword">function</span> sum(a, b) {',
      '  <span class="token keyword">return</span> a + b;',
      '}',
    ].join('\n');

    expect(parent).toPrettyPrintTo(
      [
        '<pre>',
        '  <span',
        '    class="token keyword"',
        '  >',
        '    function',
        '  </span>',
        '   sum(a, b) {',
        '  ',
        '  <span',
        '    class="token keyword"',
        '  >',
        '    return',
        '  </span>',
        '   a + b;',
        '}',
        '</pre>',
      ].join('\n'),
    );
  }
```

#### supports multiline text node in textarea

```ts
it('supports multiline text node in textarea', () => {
    const textarea = document.createElement('textarea');
    textarea.setAttribute('name', 'tagline');
    textarea.innerHTML = `Painless.
JavaScript.
Testing.`;

    expect(textarea).toPrettyPrintTo(
      [
        '<textarea',
        '  name="tagline"',
        '>',
        '  Painless.',
        'JavaScript.',
        'Testing.',
        '</textarea>',
      ].join('\n'),
    );
  }
```

#### supports empty text node

```ts
it('supports empty text node', () => {
    // React 16 does not render text in comments (see below)
    const parent = document.createElement('span');
    const text = document.createTextNode('');
    parent.append(text);
    const abbr = document.createElement('abbr');
    abbr.setAttribute('title', 'meter');
    abbr.innerHTML = 'm';
    parent.append(abbr);

    expect(parent).toPrettyPrintTo(
      [
        '<span>',
        '  ',
        '  <abbr',
        '    title="meter"',
        '  >',
        '    m',
        '  </abbr>',
        '</span>',
      ].join('\n'),
    );
  }
```

#### supports non-empty text node

```ts
it('supports non-empty text node', () => {
    // React 16 does not render text in comments (see below)
    const parent = document.createElement('p');
    parent.innerHTML = [
      '<strong>Jest</strong>',
      ' means ',
      '<em>painless</em>',
      ' Javascript testing',
    ].join('');

    expect(parent).toPrettyPrintTo(
      [
        '<p>',
        '  <strong>',
        '    Jest',
        '  </strong>',
        '   means ',
        '  <em>',
        '    painless',
        '  </em>',
        '   Javascript testing',
        '</p>',
      ].join('\n'),
    );
  }
```

#### supports comment node

```ts
it('supports comment node', () => {
    // React 15 does render text in comments
    const parent = document.createElement('p');
    parent.innerHTML = [
      '<strong>Jest</strong>',
      '<!-- react-text: 3 -->',
      ' means ',
      '<!-- /react-text -->',
      '<em>painless</em>',
      '<!-- react-text: 5 -->',
      ' Javascript testing',
      '<!-- /react-text -->',
    ].join('');

    expect(parent).toPrettyPrintTo(
      [
        '<p>',
        '  <strong>',
        '    Jest',
        '  </strong>',
        '  <!-- react-text: 3 -->',
        '   means ',
        '  <!-- /react-text -->',
        '  <em>',
        '    painless',
        '  </em>',
        '  <!-- react-text: 5 -->',
        '   Javascript testing',
        '  <!-- /react-text -->',
        '</p>',
      ].join('\n'),
    );
  }
```

#### supports fragment node

```ts
it('supports fragment node', () => {
    const fragment = document.createDocumentFragment();
    const browsers = [
      'Firefox',
      'Chrome',
      'Opera',
      'Safari',
      'Internet Explorer',
    ];

    for (const browser of browsers) {
      const li = document.createElement('li');
      li.textContent = browser;
      fragment.append(li);
    }

    expect(fragment).toPrettyPrintTo(
      [
        '<DocumentFragment>',
        '  <li>',
        '    Firefox',
        '  </li>',
        '  <li>',
        '    Chrome',
        '  </li>',
        '  <li>',
        '    Opera',
        '  </li>',
        '  <li>',
        '    Safari',
        '  </li>',
        '  <li>',
        '    Internet Explorer',
        '  </li>',
        '</DocumentFragment>',
      ].join('\n'),
    );
  }
```

#### supports custom elements

```ts
it('supports custom elements', () => {
    class CustomElement extends HTMLElement {}
    class CustomParagraphElement extends HTMLParagraphElement {}
    class CustomExtendedElement extends CustomElement {}

    customElements.define('custom-element', CustomElement);
    customElements.define('custom-extended-element', CustomExtendedElement);
    customElements.define('custom-paragraph', CustomParagraphElement, {
      extends: 'p',
    });
    customElements.define('anonymous-element', class extends HTMLElement {});

    const parent = document.createElement('div');
    parent.innerHTML = [
      '<custom-element></custom-element>',
      '<custom-extended-element></custom-extended-element>',
      '<p is="custom-paragraph"></p>',
      '<anonymous-element></anonymous-element>',
    ].join('');

    expect(parent).toPrettyPrintTo(
      [
        '<div>',
        '  <custom-element />',
        '  <custom-extended-element />',
        '  <p',
        '    is="custom-paragraph"',
        '  />',
        '  <anonymous-element />',
        '</div>',
      ].join('\n'),
    );
  }
```

#### supports SVG elements

```ts
it('supports SVG elements', () => {
    // In jsdom v9, this is NOT a regression test. See above.
    const namespace = 'http://www.w3.org/2000/svg';

    const title = document.createElementNS(namespace, 'title');
    title.append(document.createTextNode('JS community logo'));

    const rect = document.createElementNS(namespace, 'rect');
    // printProps sorts attributes in order by name
    rect.setAttribute('width', '1');
    rect.setAttribute('height', '1');
    rect.setAttribute('fill', '#f7df1e');

    const polyline = document.createElementNS(namespace, 'polyline');
    polyline.setAttribute('id', 'J');
    polyline.setAttribute('points', '0.5,0.460 0.5,0.875 0.25,0.875');
    const comment = document.createComment('polyline for S');

    const g = document.createElementNS(namespace, 'g');
    g.setAttribute('fill', 'none');
    g.setAttribute('stroke', '#000000');
    g.setAttribute('stroke-width', '0.095');
    g.append(polyline);
    g.append(comment);

    const svg = document.createElementNS(namespace, 'svg');
    svg.setAttribute('viewBox', '0 0 1 1');
    svg.append(title);
    svg.append(rect);
    svg.append(g);

    const parent = document.createElement('div');
    parent.setAttribute('id', 'JS');
    parent.append(svg);

    expect(parent).toPrettyPrintTo(
      [
        '<div',
        '  id="JS"',
        '>',
        '  <svg',
        '    viewBox="0 0 1 1"',
        '  >',
        '    <title>',
        '      JS community logo',
        '    </title>',
        '    <rect',
        '      fill="#f7df1e"',
        '      height="1"',
        '      width="1"',
        '    />',
        '    <g',
        '      fill="none"',
        '      stroke="#000000"',
        '      stroke-width="0.095"',
        '    >',
        '      <polyline',
        '        id="J"',
        '        points="0.5,0.460 0.5,0.875 0.25,0.875"',
        '      />',
        '      <!--polyline for S-->',
        '    </g>',
        '  </svg>',
        '</div>',
      ].join('\n'),
    );
  }
```

#### supports indentation for array of elements

```ts
it('supports indentation for array of elements', () => {
    // For example, Array.prototype.slice.call(document.getElementsByTagName(…))
    const dd1 = document.createElement('dd');
    dd1.innerHTML = 'to talk in a playful manner';

    const dd2 = document.createElement('dd');
    dd2.innerHTML = 'painless JavaScript testing';
    dd2.setAttribute('style', 'color: #99424F');

    expect([dd1, dd2]).toPrettyPrintTo(
      [
        'Array [',
        '  <dd>',
        '    to talk in a playful manner',
        '  </dd>,',
        '  <dd',
        '    style="color: #99424F"',
        '  >',
        '    painless JavaScript testing',
        '  </dd>,',
        ']',
      ].join('\n'),
    );
  }
```

#### supports maxDepth option

```ts
it('supports maxDepth option', () => {
    const dt = document.createElement('dt');
    dt.innerHTML = 'jest';

    const dd1 = document.createElement('dd');
    dd1.innerHTML = 'to talk in a <em>playful</em> manner';

    const dd2 = document.createElement('dd');
    dd2.innerHTML = '<em>painless</em> JavaScript testing';
    dd2.setAttribute('style', 'color: #99424F');

    const dl = document.createElement('dl');
    dl.append(dt);
    dl.append(dd1);
    dl.append(dd2);

    expect(dl).toPrettyPrintTo(
      [
        '<dl>',
        '  <dt>',
        '    jest',
        '  </dt>',
        '  <dd>',
        '    to talk in a ',
        '    <em … />',
        '     manner',
        '  </dd>',
        '  <dd',
        '    style="color: #99424F"',
        '  >',
        '    <em … />',
        '     JavaScript testing',
        '  </dd>',
        '</dl>',
      ].join('\n'),
      {maxDepth: 2},
    );
  }
```

#### handles `tagName` not being a string

```ts
it('handles `tagName` not being a string', () => {
    expect({
      name: 'value',
      tagName: {text: 'param'},
      type: 'string',
    }).toPrettyPrintTo(
      [
        'Object {',
        '  "name": "value",',
        '  "tagName": Object {',
        '    "text": "param",',
        '  },',
        '  "type": "string",',
        '}',
      ].join('\n'),
    );
  }
```

### /tmp/ctest-repos-nXQIAb/95324de690-parser/packages/babel-core/test/targets.js

#### loads .browserslistrc by default

```ts
it("loads .browserslistrc by default", () => {
    expect(
      loadOptionsSync({
        cwd: join(cwd, "fixtures", "targets"),
      }).targets,
    ).toEqual({ chrome: "80.0.0" });
  }
```

#### loads .browserslistrc relative to the root

```ts
it("loads .browserslistrc relative to the root", () => {
    expect(
      loadOptionsSync({
        cwd: join(cwd, "fixtures", "targets"),
        filename: "./node_modules/dep/test.js",
      }).targets,
    ).toEqual({ chrome: "80.0.0" });
  }
```

#### can disable config loading

```ts
it("can disable config loading", () => {
      expect(
        loadOptionsSync({
          cwd: join(cwd, "fixtures", "targets"),
          browserslistConfigFile: false,
        }).targets,
      ).toEqual({});
    }
```

#### can specify a custom file

```ts
it("can specify a custom file", () => {
      expect(
        loadOptionsSync({
          cwd: join(cwd, "fixtures", "targets"),
          browserslistConfigFile: "./.browserslistrc-firefox",
        }).targets,
      ).toEqual({ firefox: "74.0.0" });
    }
```

#### is relative to the cwd even if specifying 'root'

```ts
it("is relative to the cwd even if specifying 'root'", () => {
      expect(
        loadOptionsSync({
          cwd: join(cwd, "fixtures", "targets"),
          root: "..",
          filename: "./nested/test.js",
          browserslistConfigFile: "./.browserslistrc-firefox",
        }).targets,
      ).toEqual({ firefox: "74.0.0" });
    }
```

#### is relative to the config files that defines it

```ts
it("is relative to the config files that defines it", () => {
      expect(
        loadOptionsSync({
          cwd: join(cwd, "fixtures", "targets"),
          filename: "./node_modules/dep/test.js",
          babelrcRoots: ["./node_modules/dep/"],
        }).targets,
      ).toEqual({ edge: "14.0.0" });
    }
```

#### is forwarded to browserslist

```ts
it("is forwarded to browserslist", () => {
      expect(
        loadOptionsSync({
          cwd: join(cwd, "fixtures", "targets"),
          browserslistEnv: "browserslist-loading-test",
        }).targets,
      ).toEqual({ chrome: "70.0.0" });
    }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/globalSetup.test.ts

#### globalSetup is triggered once before all test suites

```ts
test('globalSetup is triggered once before all test suites', () => {
  const setupPath = path.join(e2eDir, 'setup.js');
  const result = runWithJson(e2eDir, [
    `--globalSetup=${setupPath}`,
    '--testPathPatterns=__tests__',
  ]);

  expect(result.exitCode).toBe(0);
  const files = fs.readdirSync(DIR);
  expect(files).toHaveLength(1);
  const setup = fs.readFileSync(path.join(DIR, files[0]), 'utf8');
  expect(setup).toBe('setup');
}
```

#### jest throws an error when globalSetup does not export a function

```ts
test('jest throws an error when globalSetup does not export a function', () => {
  const setupPath = path.resolve(__dirname, '../global-setup/invalidSetup.js');
  const {exitCode, stderr} = runJest(e2eDir, [
    `--globalSetup=${setupPath}`,
    '--testPathPatterns=__tests__',
  ]);

  expect(exitCode).toBe(1);
  expect(stderr).toContain('Jest: Got error running globalSetup');
  expect(stderr).toContain(
    `globalSetup file must export a function at ${setupPath}`,
  );
}
```

#### globalSetup function gets global config object and project config as parameters

```ts
test('globalSetup function gets global config object and project config as parameters', () => {
  const setupPath = path.resolve(e2eDir, 'setupWithConfig.js');

  const result = runJest(e2eDir, [
    `--globalSetup=${setupPath}`,
    '--testPathPatterns=pass',
    '--cache=true',
  ]);

  expect(result.stdout).toBe("[ 'pass' ]\ntrue");
}
```

#### should call globalSetup function of multiple projects

```ts
test('should call globalSetup function of multiple projects', () => {
  const configPath = path.resolve(e2eDir, 'projects.jest.config.js');

  const result = runWithJson(e2eDir, [`--config=${configPath}`]);

  expect(result.exitCode).toBe(0);

  expect(fs.existsSync(DIR)).toBe(true);
  expect(fs.existsSync(project1DIR)).toBe(true);
  expect(fs.existsSync(project2DIR)).toBe(true);
}
```

#### should not call a globalSetup of a project if there are no tests to run from this project

```ts
test('should not call a globalSetup of a project if there are no tests to run from this project', () => {
  const configPath = path.resolve(e2eDir, 'projects.jest.config.js');

  const result = runWithJson(e2eDir, [
    `--config=${configPath}`,
    '--testPathPatterns=setup1',
  ]);

  expect(result.exitCode).toBe(0);

  expect(fs.existsSync(DIR)).toBe(true);
  expect(fs.existsSync(project1DIR)).toBe(true);
  expect(fs.existsSync(project2DIR)).toBe(false);
}
```

#### should not call any globalSetup if there are no tests to run

```ts
test('should not call any globalSetup if there are no tests to run', () => {
  const configPath = path.resolve(e2eDir, 'projects.jest.config.js');

  const result = runWithJson(e2eDir, [
    `--config=${configPath}`,
    // onlyChanged ensures there are no tests to run
    '--onlyChanged',
  ]);

  expect(result.exitCode).toBe(0);

  expect(fs.existsSync(DIR)).toBe(false);
  expect(fs.existsSync(project1DIR)).toBe(false);
  expect(fs.existsSync(project2DIR)).toBe(false);
}
```

#### globalSetup works with default export

```ts
test('globalSetup works with default export', () => {
  const setupPath = path.resolve(e2eDir, 'setupWithDefaultExport.js');

  const result = runJest(e2eDir, [
    `--globalSetup=${setupPath}`,
    '--testPathPatterns=pass',
    '--cache=true',
  ]);

  expect(result.stdout).toBe("[ 'pass' ]\ntrue");
}
```

#### globalSetup throws with named export

```ts
test('globalSetup throws with named export', () => {
  const setupPath = path.resolve(e2eDir, 'invalidSetupWithNamedExport.js');

  const {exitCode, stderr} = runJest(e2eDir, [
    `--globalSetup=${setupPath}`,
    '--testPathPatterns=__tests__',
  ]);

  expect(exitCode).toBe(1);
  expect(stderr).toContain('Jest: Got error running globalSetup');
  expect(stderr).toContain(
    `globalSetup file must export a function at ${setupPath}`,
  );
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-worker/src/workers/__tests__/WorkerEdgeCases.test.ts

#### should get memory usage

```ts
test('should get memory usage', async () => {
    await closeWorkerAfter(
      new workerClass({
        childWorkerPath: workerPath,
        maxRetries: 0,
        workerPath: join(__dirname, '__fixtures__', 'EdgeCasesWorker'),
      } as WorkerOptions),
      async (worker: ChildProcessWorker | ThreadsWorker) => {
        const memoryUsagePromise = worker.getMemoryUsage();
        expect(memoryUsagePromise).toBeInstanceOf(Promise);

        expect(await memoryUsagePromise).toBeGreaterThan(0);
      },
    );
  }
```

#### should recycle on idle limit breach

```ts
test('should recycle on idle limit breach', async () => {
    await closeWorkerAfter(
      new workerClass({
        childWorkerPath: workerPath,
        // There is no way this is fitting into 1000 bytes, so it should restart
        // after requesting a memory usage update
        idleMemoryLimit: 1000,
        maxRetries: 0,
        workerPath: join(__dirname, '__fixtures__', 'EdgeCasesWorker'),
      } as WorkerOptions),
      async (worker: ChildProcessWorker | ThreadsWorker) => {
        const startSystemId = worker.getWorkerSystemId();
        expect(startSystemId).toBeGreaterThanOrEqual(0);

        worker.checkMemoryUsage();

        await waitForChange(() => worker.getWorkerSystemId());

        const systemId = worker.getWorkerSystemId();
        expect(systemId).toBeGreaterThanOrEqual(0);
        expect(systemId).not.toEqual(startSystemId);

        await new Promise(resolve => {
          setTimeout(resolve, SIGKILL_DELAY + 100);
        });

        expect(worker.isWorkerRunning()).toBeTruthy();
      },
    );
  }
```

#### worker continues to run after kill delay

```ts
test(
      'worker continues to run after kill delay',
      async () => {
        await new Promise(resolve => {
          setTimeout(resolve, SIGKILL_DELAY + 100);
        });

        expect(worker.state).toEqual(WorkerStates.OK);
        expect(worker.isWorkerRunning()).toBeTruthy();
      }
```

#### processes restart

```ts
test('processes restart', async () => {
      const onStart = jest.fn();
      const onEnd = jest.fn();
      const onCustom = jest.fn();

      worker.send(
        [CHILD_MESSAGE_CALL, true, 'fatalExitCode', []],
        onStart,
        onEnd,
        onCustom,
      );

      // Give it some time to restart some workers
      await new Promise(resolve => setTimeout(resolve, 4000));

      expect(startedWorkers).toBe(6);

      expect(worker.isWorkerRunning()).toBeTruthy();
      expect(worker.state).toEqual(WorkerStates.OK);
    }
```

#### onEnd callback is called

```ts
test('onEnd callback is called', async () => {
      let onEndPromiseResolve: () => void;
      let onEndPromiseReject: (err: Error) => void;
      const onEndPromise = new Promise<void>((resolve, reject) => {
        onEndPromiseResolve = resolve;
        onEndPromiseReject = reject;
      });

      const onStart = jest.fn();
      const onEnd = jest.fn((err: Error | null) => {
        if (err) {
          return onEndPromiseReject(err);
        }
        onEndPromiseResolve();
      });
      const onCustom = jest.fn();

      await worker.waitForWorkerReady();

      // The SelfKillWorker simulates an external process calling SIGTERM on it,
      // but just SIGTERMs itself underneath the hood to make this test easier.
      worker.send(
        [CHILD_MESSAGE_CALL, true, 'selfKill', []],
        onStart,
        onEnd,
        onCustom,
      );

      // The onEnd callback should be called when the child process exits.
      await expect(onEndPromise).rejects.toBeInstanceOf(Error);
      expect(onEnd).toHaveBeenCalled();
    }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-reporters/src/__tests__/getSnapshotSummary.test.js

#### creates a snapshot summary

```ts
test('creates a snapshot summary', () => {
  const snapshots = {
    added: 1,
    didUpdate: false,
    filesAdded: 1,
    filesRemoved: 1,
    filesRemovedList: [],
    filesUnmatched: 1,
    filesUpdated: 1,
    matched: 2,
    total: 2,
    unchecked: 1,
    uncheckedKeysByFile: [
      {
        filePath: 'path/to/suite_one',
        keys: ['unchecked snapshot 1'],
      },
    ],
    unmatched: 1,
    updated: 1,
  };

  expect(
    getSnapshotSummary(snapshots, globalConfig, UPDATE_COMMAND)
      .join('\n')
      .replaceAll('\\', '/'),
  ).toMatchSnapshot();
}
```

#### creates a snapshot summary after an update

```ts
test('creates a snapshot summary after an update', () => {
  const snapshots = {
    added: 1,
    didUpdate: true,
    filesAdded: 1,
    filesRemoved: 1,
    filesRemovedList: [],
    filesUnmatched: 1,
    filesUpdated: 1,
    unchecked: 1,
    uncheckedKeysByFile: [
      {
        filePath: 'path/to/suite_one',
        keys: ['unchecked snapshot 1'],
      },
    ],
    unmatched: 1,
    updated: 1,
  };

  expect(
    getSnapshotSummary(snapshots, globalConfig, UPDATE_COMMAND)
      .join('\n')
      .replaceAll('\\', '/'),
  ).toMatchSnapshot();
}
```

#### creates a snapshot summary with multiple snapshot being written/updated

```ts
it('creates a snapshot summary with multiple snapshot being written/updated', () => {
  const snapshots = {
    added: 2,
    didUpdate: false,
    filesAdded: 2,
    filesRemoved: 2,
    filesRemovedList: [],
    filesUnmatched: 2,
    filesUpdated: 2,
    unchecked: 2,
    uncheckedKeysByFile: [
      {
        filePath: 'path/to/suite_one',
        keys: ['unchecked snapshot 1'],
      },
      {
        filePath: 'path/to/suite_two',
        keys: ['unchecked snapshot 2'],
      },
    ],
    unmatched: 2,
    updated: 2,
  };

  expect(
    getSnapshotSummary(snapshots, globalConfig, UPDATE_COMMAND)
      .join('\n')
      .replaceAll('\\', '/'),
  ).toMatchSnapshot();
}
```

#### returns nothing if there are no updates

```ts
it('returns nothing if there are no updates', () => {
  const snapshots = {
    added: 0,
    didUpdate: false,
    filesAdded: 0,
    filesRemoved: 0,
    filesRemovedList: [],
    filesUnmatched: 0,
    filesUpdated: 0,
    unchecked: 0,
    uncheckedKeysByFile: [],
    unmatched: 0,
    updated: 0,
  };
  expect(
    getSnapshotSummary(snapshots, globalConfig, UPDATE_COMMAND).join('\n'),
  ).toMatchSnapshot();
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-reporters/src/__tests__/SummaryReporter.test.js

#### snapshots needs update with npm test

```ts
test('snapshots needs update with npm test', () => {
  const aggregatedResults = {
    numFailedTestSuites: 1,
    numFailedTests: 1,
    numPassedTestSuites: 0,
    numTotalTestSuites: 1,
    numTotalTests: 1,
    snapshot: {
      filesUnmatched: 1,
      total: 2,
      uncheckedKeysByFile: [],
      unmatched: 2,
    },
    startTime: 0,
    testResults: [],
  };

  process.env.npm_config_user_agent = 'npm';
  requireReporter();
  const testReporter = new SummaryReporter(globalConfig);
  testReporter.onRunComplete(new Set(), aggregatedResults);
  expect(results.join('')).toMatchSnapshot();
}
```

#### snapshots needs update with yarn test

```ts
test('snapshots needs update with yarn test', () => {
  const aggregatedResults = {
    numFailedTestSuites: 1,
    numFailedTests: 1,
    numPassedTestSuites: 0,
    numTotalTestSuites: 1,
    numTotalTests: 1,
    snapshot: {
      filesRemovedList: [],
      filesUnmatched: 1,
      total: 2,
      uncheckedKeysByFile: [],
      unmatched: 2,
    },
    startTime: 0,
    testResults: [],
  };

  process.env.npm_config_user_agent = 'yarn';
  requireReporter();
  const testReporter = new SummaryReporter(globalConfig);
  testReporter.onRunComplete(new Set(), aggregatedResults);
  expect(results.join('')).toMatchSnapshot();
}
```

#### snapshots all have results (no update)

```ts
test('snapshots all have results (no update)', () => {
  const aggregatedResults = {
    numFailedTestSuites: 1,
    numFailedTests: 1,
    numPassedTestSuites: 0,
    numTotalTestSuites: 1,
    numTotalTests: 1,
    snapshot: {
      added: 1,
      didUpdate: false,
      filesAdded: 1,
      filesRemoved: 1,
      filesRemovedList: [],
      filesUnmatched: 1,
      filesUpdated: 1,
      matched: 2,
      total: 2,
      unchecked: 1,
      uncheckedKeysByFile: [
        {
          filePath: 'path/to/suite_one',
          keys: ['unchecked snapshot 1'],
        },
      ],
      unmatched: 1,
      updated: 1,
    },
    startTime: 0,
    testResults: [],
  };

  requireReporter();
  const testReporter = new SummaryReporter(globalConfig);
  testReporter.onRunComplete(new Set(), aggregatedResults);
  expect(results.join('').replaceAll('\\', '/')).toMatchSnapshot();
}
```

#### snapshots all have results (after update)

```ts
test('snapshots all have results (after update)', () => {
  const aggregatedResults = {
    numFailedTestSuites: 1,
    numFailedTests: 1,
    numPassedTestSuites: 0,
    numTotalTestSuites: 1,
    numTotalTests: 1,
    snapshot: {
      added: 1,
      didUpdate: true,
      filesAdded: 1,
      filesRemoved: 1,
      filesRemovedList: [],
      filesUnmatched: 1,
      filesUpdated: 1,
      matched: 2,
      total: 2,
      unchecked: 1,
      uncheckedKeysByFile: [
        {
          filePath: 'path/to/suite_one',
          keys: ['unchecked snapshot 1'],
        },
      ],
      unmatched: 1,
      updated: 1,
    },
    startTime: 0,
    testResults: [],
  };

  requireReporter();
  const testReporter = new SummaryReporter(globalConfig);
  testReporter.onRunComplete(new Set(), aggregatedResults);
  expect(results.join('').replaceAll('\\', '/')).toMatchSnapshot();
}
```

#### Should print failure messages when number of test suites is over the threshold

```ts
it('Should print failure messages when number of test suites is over the threshold', () => {
    const options = {
      summaryThreshold: aggregatedResults.numTotalTestSuites - 1,
    };

    requireReporter();
    const testReporter = new SummaryReporter(globalConfig, options);
    testReporter.onRunComplete(new Set(), aggregatedResults);
    expect(results.join('').replaceAll('\\', '/')).toMatchSnapshot();
  }
```

#### Should not print failure messages when number of test suites is under the threshold

```ts
it('Should not print failure messages when number of test suites is under the threshold', () => {
    const options = {
      summaryThreshold: aggregatedResults.numTotalTestSuites + 1,
    };

    requireReporter();
    const testReporter = new SummaryReporter(globalConfig, options);
    testReporter.onRunComplete(new Set(), aggregatedResults);
    expect(results.join('').replaceAll('\\', '/')).toMatchSnapshot();
  }
```

#### Should not print failure messages when number of test suites is equal to the threshold

```ts
it('Should not print failure messages when number of test suites is equal to the threshold', () => {
    const options = {
      summaryThreshold: aggregatedResults.numTotalTestSuites,
    };

    requireReporter();
    const testReporter = new SummaryReporter(globalConfig, options);
    testReporter.onRunComplete(new Set(), aggregatedResults);
    expect(results.join('').replaceAll('\\', '/')).toMatchSnapshot();
  }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/existentRoots.test.ts

#### error when rootDir does not exist

```ts
test('error when rootDir does not exist', () => {
  const fakeRootDir = path.join(DIR, 'foobar');
  writeConfig(fakeRootDir);

  const {exitCode, stderr} = runJest(DIR);

  expect(exitCode).toBe(1);
  expect(stderr).toContain(
    `Directory ${fakeRootDir} in the rootDir option was not found.`,
  );
}
```

#### error when rootDir is a file

```ts
test('error when rootDir is a file', () => {
  // Replace tmpdir with its realpath as Windows uses the 8.3 path
  const fakeRootDir = path
    .join(DIR, 'jest.config.js')
    .replace(tmpdir(), tryRealpath(tmpdir()));

  writeConfig(fakeRootDir);

  const {exitCode, stderr} = runJest(DIR);

  expect(exitCode).toBe(1);
  expect(stderr).toContain(
    `${fakeRootDir} in the rootDir option is not a directory.`,
  );
}
```

#### error when roots directory does not exist

```ts
test('error when roots directory does not exist', () => {
  const fakeRootDir = path.join(DIR, 'foobar');
  writeConfig(DIR, ['<rootDir>', fakeRootDir]);

  const {exitCode, stderr} = runJest(DIR);

  expect(exitCode).toBe(1);
  expect(stderr).toContain(
    `Directory ${fakeRootDir} in the roots[1] option was not found.`,
  );
}
```

#### error when roots is a file

```ts
test('error when roots is a file', () => {
  const fakeRootDir = path.join(DIR, 'jest.config.js');
  writeConfig(DIR, ['<rootDir>', fakeRootDir]);

  const {exitCode, stderr} = runJest(DIR);

  expect(exitCode).toBe(1);
  expect(stderr).toContain(
    `${fakeRootDir} in the roots[1] option is not a directory.`,
  );
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-core/src/__tests__/SearchSource.test.ts

#### supports ../ paths and unix separators via testRegex

```ts
it('supports ../ paths and unix separators via testRegex', async () => {
      if (process.platform === 'win32') {
        return;
      }
      const {searchSource} = await initSearchSource({
        id,
        rootDir: '.',
        roots: [],
        testMatch: undefined,
        testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.jsx?$',
      });

      const path = '/path/to/__tests__/foo/bar/baz/../../../test.js';
      expect(searchSource.isTestFilePath(path)).toBe(true);
    }
```

#### supports unix separators

```ts
it('supports unix separators', () => {
      if (process.platform !== 'win32') {
        const path = '/path/to/__tests__/test.js';
        expect(searchSource.isTestFilePath(path)).toBe(true);
      }
    }
```

#### supports win32 separators

```ts
it('supports win32 separators', () => {
      if (process.platform === 'win32') {
        const path = '\\path\\to\\__tests__\\test.js';
        expect(searchSource.isTestFilePath(path)).toBe(true);
      }
    }
```

#### finds tests matching a pattern via testRegex

```ts
it('finds tests matching a pattern via testRegex', async () => {
      const paths = await getTestPaths({
        id,
        moduleFileExtensions: ['js', 'jsx', 'txt'],
        rootDir,
        testMatch: undefined,
        testRegex: 'not-really-a-test',
      });
      expect(paths).toEqual([
        path.normalize('.hiddenFolder/not-really-a-test.txt'),
        path.normalize('__testtests__/not-really-a-test.txt'),
      ]);
    }
```

#### finds tests matching a pattern via testMatch

```ts
it('finds tests matching a pattern via testMatch', async () => {
      const paths = await getTestPaths({
        id,
        moduleFileExtensions: ['js', 'jsx', 'txt'],
        rootDir,
        testMatch: ['**/not-really-a-test.txt', '!**/do-not-match-me.txt'],
        testRegex: '',
      });
      expect(paths).toEqual([
        path.normalize('.hiddenFolder/not-really-a-test.txt'),
        path.normalize('__testtests__/not-really-a-test.txt'),
      ]);
    }
```

#### finds tests matching a JS regex pattern

```ts
it('finds tests matching a JS regex pattern', async () => {
      const paths = await getTestPaths({
        id,
        moduleFileExtensions: ['js', 'jsx'],
        rootDir,
        testMatch: undefined,
        testRegex: 'test.jsx?',
      });
      expect(paths).toEqual([
        path.normalize('__testtests__/test.js'),
        path.normalize('__testtests__/test.jsx'),
      ]);
    }
```

#### finds tests matching a JS glob pattern

```ts
it('finds tests matching a JS glob pattern', async () => {
      const paths = await getTestPaths({
        id,
        moduleFileExtensions: ['js', 'jsx'],
        rootDir,
        testMatch: ['**/test.js?(x)'],
        testRegex: '',
      });
      expect(paths).toEqual([
        path.normalize('__testtests__/test.js'),
        path.normalize('__testtests__/test.jsx'),
      ]);
    }
```

#### finds tests matching a JS with overriding glob patterns

```ts
it('finds tests matching a JS with overriding glob patterns', async () => {
      const paths = await getTestPaths({
        id,
        moduleFileExtensions: ['js', 'jsx'],
        rootDir,
        testMatch: [
          '**/*.js?(x)',
          '!**/test.js?(x)',
          '**/test.js',
          '!**/test.js',
        ],
        testRegex: '',
      });
      expect(paths).toEqual([
        path.normalize('module.jsx'),
        path.normalize('noTests.js'),
      ]);
    }
```

#### finds tests with default file extensions using testRegex

```ts
it('finds tests with default file extensions using testRegex', async () => {
      const paths = await getTestPaths({
        id,
        rootDir,
        testMatch: undefined,
        testRegex,
      });
      expect(paths).toEqual([
        path.normalize('__testtests__/test.js'),
        path.normalize('__testtests__/test.jsx'),
      ]);
    }
```

#### finds tests with default file extensions using testMatch

```ts
it('finds tests with default file extensions using testMatch', async () => {
      const paths = await getTestPaths({
        id,
        rootDir,
        testMatch,
        testRegex: '',
      });
      expect(paths).toEqual([
        path.normalize('__testtests__/test.js'),
        path.normalize('__testtests__/test.jsx'),
      ]);
    }
```

#### finds tests with parentheses in their rootDir when using testMatch

```ts
it('finds tests with parentheses in their rootDir when using testMatch', async () => {
      const paths = await getTestPaths({
        id,
        rootDir: path.resolve(__dirname, 'test_root_with_(parentheses)'),
        testMatch: ['<rootDir>**/__testtests__/**/*'],
        testRegex: undefined,
      });
      expect(paths).toEqual([
        expect.stringContaining(path.normalize('__testtests__/test.js')),
      ]);
    }
```

#### finds tests with similar but custom file extensions

```ts
it('finds tests with similar but custom file extensions', async () => {
      const paths = await getTestPaths({
        id,
        moduleFileExtensions: ['js', 'jsx'],
        rootDir,
        testMatch,
      });
      expect(paths).toEqual([
        path.normalize('__testtests__/test.js'),
        path.normalize('__testtests__/test.jsx'),
      ]);
    }
```

#### finds tests with totally custom foobar file extensions

```ts
it('finds tests with totally custom foobar file extensions', async () => {
      const paths = await getTestPaths({
        id,
        moduleFileExtensions: ['js', 'foobar'],
        rootDir,
        testMatch,
      });
      expect(paths).toEqual([
        path.normalize('__testtests__/test.foobar'),
        path.normalize('__testtests__/test.js'),
      ]);
    }
```

#### finds tests with many kinds of file extensions

```ts
it('finds tests with many kinds of file extensions', async () => {
      const paths = await getTestPaths({
        id,
        moduleFileExtensions: ['js', 'jsx'],
        rootDir,
        testMatch,
      });
      expect(paths).toEqual([
        path.normalize('__testtests__/test.js'),
        path.normalize('__testtests__/test.jsx'),
      ]);
    }
```

#### finds tests using a regex only

```ts
it('finds tests using a regex only', async () => {
      const paths = await getTestPaths({
        id,
        rootDir,
        testMatch: undefined,
        testRegex,
      });
      expect(paths).toEqual([
        path.normalize('__testtests__/test.js'),
        path.normalize('__testtests__/test.jsx'),
      ]);
    }
```

#### finds tests using a glob only

```ts
it('finds tests using a glob only', async () => {
      const paths = await getTestPaths({
        id,
        rootDir,
        testMatch,
        testRegex: '',
      });
      expect(paths).toEqual([
        path.normalize('__testtests__/test.js'),
        path.normalize('__testtests__/test.jsx'),
      ]);
    }
```

#### filter tests based on an optional filter method

```ts
it('filter tests based on an optional filter method', async () => {
      const filterFunction = (testPaths: Array<string>) =>
        Promise.resolve({
          filtered: testPaths.filter(testPath => testPath.includes('test.jsx')),
        });
      const paths = await getTestPaths(
        {
          id,
          rootDir,
        },
        filterFunction,
      );

      expect(paths).toHaveLength(1);
      expect(paths[0]).toStrictEqual(path.normalize('__testtests__/test.jsx'));
    }
```

#### should allow a simple match

```ts
it('should allow a simple match', async () => {
      const result = searchSource.filterPathsWin32(['packages/lib/my-lib.ts']);
      expect(result).toEqual([path.resolve('packages/lib/my-lib.ts')]);
    }
```

#### should allow to match a file inside a hidden directory

```ts
it('should allow to match a file inside a hidden directory', async () => {
      const result = searchSource.filterPathsWin32([
        'packages/.hidden/my-app-hidden.ts',
      ]);
      expect(result).toEqual([
        path.resolve('packages/.hidden/my-app-hidden.ts'),
      ]);
    }
```

#### should allow to match a file inside a directory prefixed with a "@"

```ts
it('should allow to match a file inside a directory prefixed with a "@"', async () => {
      const result = searchSource.filterPathsWin32([
        'packages/@core/my-app.ts',
      ]);
      expect(result).toEqual([path.resolve('packages/@core/my-app.ts')]);
    }
```

#### should allow to match a file inside a directory prefixed with a "+"

```ts
it('should allow to match a file inside a directory prefixed with a "+"', async () => {
      const result = searchSource.filterPathsWin32(['packages/+cli/my-cli.ts']);
      expect(result).toEqual([path.resolve('packages/+cli/my-cli.ts')]);
    }
```

#### should allow an @(pattern)

```ts
it('should allow an @(pattern)', () => {
      const result = searchSource.filterPathsWin32([
        'packages/@(@core)/my-app.ts',
      ]);
      expect(result).toEqual([path.resolve('packages/@core/my-app.ts')]);
    }
```

#### should allow a +(pattern)

```ts
it('should allow a +(pattern)', () => {
      const result = searchSource.filterPathsWin32([
        'packages/+(@core)/my-app.ts',
      ]);
      expect(result).toEqual([path.resolve('packages/@core/my-app.ts')]);
    }
```

#### should allow for (pattern) in file path

```ts
it('should allow for (pattern) in file path', () => {
      const result = searchSource.filterPathsWin32([
        'packages/programs (x86)/my-program.ts',
      ]);
      expect(result).toEqual([
        path.resolve('packages/programs (x86)/my-program.ts'),
      ]);
    }
```

#### should allow no results found

```ts
it('should allow no results found', () => {
      const result = searchSource.filterPathsWin32(['not/exists']);
      expect(result).toHaveLength(0);
    }
```

#### makes sure a file is related to itself

```ts
it('makes sure a file is related to itself', async () => {
      const data = await searchSource.findRelatedTests(
        new Set([rootPath]),
        false,
      );
      expect(toPaths(data.tests)).toEqual([rootPath]);
    }
```

#### finds tests that depend directly on the path

```ts
it('finds tests that depend directly on the path', async () => {
      const filePath = path.join(rootDir, 'RegularModule.js');
      const file2Path = path.join(rootDir, 'RequireRegularModule.js');
      const parentDep = path.join(rootDir, 'ModuleWithSideEffects.js');
      const data = await searchSource.findRelatedTests(
        new Set([filePath]),
        false,
      );
      expect(toPaths(data.tests).sort()).toEqual([
        parentDep,
        filePath,
        file2Path,
        rootPath,
      ]);
    }
```

#### excludes untested files from coverage

```ts
it('excludes untested files from coverage', async () => {
      const unrelatedFile = path.join(rootDir, 'JSONFile.json');
      const regular = path.join(rootDir, 'RegularModule.js');
      const requireRegular = path.join(rootDir, 'RequireRegularMode.js');

      const data = await searchSource.findRelatedTests(
        new Set([regular, requireRegular, unrelatedFile]),
        true,
      );
      expect([...(data.collectCoverageFrom || [])]).toEqual([
        'RegularModule.js',
      ]);
    }
```

#### finds tests for a single file

```ts
it('finds tests for a single file', async () => {
      const input = ['packages/jest-core/src/__tests__/test_root/module.jsx'];
      const data = await searchSource.findRelatedTestsFromPattern(input, false);
      expect(toPaths(data.tests).sort()).toEqual([
        path.join(rootDir, '__testtests__', 'test.js'),
        path.join(rootDir, '__testtests__', 'test.jsx'),
      ]);
    }
```

#### finds tests for multiple files

```ts
it('finds tests for multiple files', async () => {
      const input = [
        'packages/jest-core/src/__tests__/test_root/module.jsx',
        'packages/jest-core/src/__tests__/test_root/module.foobar',
      ];
      const data = await searchSource.findRelatedTestsFromPattern(input, false);
      expect(toPaths(data.tests).sort()).toEqual([
        path.join(rootDir, '__testtests__', 'test.foobar'),
        path.join(rootDir, '__testtests__', 'test.js'),
        path.join(rootDir, '__testtests__', 'test.jsx'),
      ]);
    }
```

#### does not mistake roots folders with prefix names

```ts
it('does not mistake roots folders with prefix names', async () => {
      if (process.platform === 'win32') {
        return;
      }
      ({searchSource} = await initSearchSource({
        id,
        rootDir: '.',
        roots: ['/foo/bar/prefix'],
      }));

      const input = ['/foo/bar/prefix-suffix/__tests__/my-test.test.js'];
      const data = searchSource.findTestsByPaths(input);
      expect(data.tests).toEqual([]);
    }
```

#### return empty set if no SCM

```ts
it('return empty set if no SCM', async () => {
      const requireRegularModule = path.join(
        rootDir,
        'RequireRegularModule.js',
      );
      const sources =
        await searchSource.findRelatedSourcesFromTestsInChangedFiles({
          changedFiles: new Set([requireRegularModule]),
          repos: {
            git: new Set(),
            hg: new Set(),
          },
        });
      expect(sources).toEqual([]);
    }
```

#### return sources required by tests

```ts
it('return sources required by tests', async () => {
      const regularModule = path.join(rootDir, 'RegularModule.js');
      const requireRegularModule = path.join(
        rootDir,
        'RequireRegularModule.js',
      );
      const sources =
        await searchSource.findRelatedSourcesFromTestsInChangedFiles({
          changedFiles: new Set([requireRegularModule]),
          repos: {
            git: new Set('/path/to/git'),
            hg: new Set(),
          },
        });
      expect(sources).toEqual([regularModule]);
    }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/global-setup-node-modules/__tests__/test.js

#### should exist setup file

```ts
test('should exist setup file', () => {
  const files = fs.readdirSync(DIR);
  expect(files).toHaveLength(1);
  const setup = fs.readFileSync(path.join(DIR, files[0]), 'utf8');
  expect(setup).toBe('hello world!');
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/global-setup/project-2/setup2.test.js

#### should exist setup file

```ts
test('should exist setup file', () => {
  const files = fs.readdirSync(DIR);
  expect(files).toHaveLength(1);
  const setup = fs.readFileSync(path.join(DIR, files[0]), 'utf8');
  expect(setup).toBe('setup');
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/global-setup/project-1/setup1.test.js

#### should exist setup file

```ts
test('should exist setup file', () => {
  const files = fs.readdirSync(DIR);
  expect(files).toHaveLength(1);
  const setup = fs.readFileSync(path.join(DIR, files[0]), 'utf8');
  expect(setup).toBe('setup');
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/global-setup/__tests__/setup3.test.js

#### should exist setup file

```ts
test('should exist setup file', () => {
  const files = fs.readdirSync(DIR);
  expect(files).toHaveLength(1);
  const setup = fs.readFileSync(path.join(DIR, files[0]), 'utf8');
  expect(setup).toBe('setup');
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/global-setup/__tests__/setup1.test.js

#### should exist setup file

```ts
test('should exist setup file', () => {
  const files = fs.readdirSync(DIR);
  expect(files).toHaveLength(1);
  const setup = fs.readFileSync(path.join(DIR, files[0]), 'utf8');
  expect(setup).toBe('setup');
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/global-setup/__tests__/setup2.test.js

#### should exist setup file

```ts
test('should exist setup file', () => {
  const files = fs.readdirSync(DIR);
  expect(files).toHaveLength(1);
  const setup = fs.readFileSync(path.join(DIR, files[0]), 'utf8');
  expect(setup).toBe('setup');
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/globalTeardown.test.ts

#### globalTeardown is triggered once after all test suites

```ts
test('globalTeardown is triggered once after all test suites', () => {
  createDirectory(DIR);
  const teardownPath = path.resolve(e2eDir, 'teardown.js');
  const result = runWithJson('global-teardown', [
    `--globalTeardown=${teardownPath}`,
    '--testPathPatterns=__tests__',
  ]);

  expect(result.exitCode).toBe(0);
  const files = fs.readdirSync(DIR);
  expect(files).toHaveLength(1);
  const teardown = fs.readFileSync(path.join(DIR, files[0]), 'utf8');
  expect(teardown).toBe('teardown');
}
```

#### jest throws an error when globalTeardown does not export a function

```ts
test('jest throws an error when globalTeardown does not export a function', () => {
  const teardownPath = path.resolve(e2eDir, 'invalidTeardown.js');
  const {exitCode, stderr} = runJest(e2eDir, [
    `--globalTeardown=${teardownPath}`,
    '--testPathPatterns=__tests__',
  ]);

  expect(exitCode).toBe(1);
  expect(stderr).toContain('Jest: Got error running globalTeardown');
  expect(stderr).toContain(
    `globalTeardown file must export a function at ${teardownPath}`,
  );
}
```

#### globalSetup function gets global config object and project config as parameters

```ts
test('globalSetup function gets global config object and project config as parameters', () => {
  const teardownPath = path.resolve(e2eDir, 'teardownWithConfig.js');

  const result = runJest(e2eDir, [
    `--globalTeardown=${teardownPath}`,
    '--testPathPatterns=pass',
    '--cache=true',
  ]);

  expect(result.stdout).toBe("[ 'pass' ]\ntrue");
}
```

#### should call globalTeardown function of multiple projects

```ts
test('should call globalTeardown function of multiple projects', () => {
  const configPath = path.resolve(e2eDir, 'projects.jest.config.js');

  const result = runWithJson('global-teardown', [`--config=${configPath}`]);

  expect(result.exitCode).toBe(0);

  expect(fs.existsSync(DIR)).toBe(true);
  expect(fs.existsSync(project1DIR)).toBe(true);
  expect(fs.existsSync(project2DIR)).toBe(true);
}
```

#### should not call a globalTeardown of a project if there are no tests to run from this project

```ts
test('should not call a globalTeardown of a project if there are no tests to run from this project', () => {
  const configPath = path.resolve(e2eDir, 'projects.jest.config.js');

  const result = runWithJson('global-teardown', [
    `--config=${configPath}`,
    '--testPathPatterns=teardown1',
  ]);

  expect(result.exitCode).toBe(0);

  expect(fs.existsSync(DIR)).toBe(true);
  expect(fs.existsSync(project1DIR)).toBe(true);
  expect(fs.existsSync(project2DIR)).toBe(false);
}
```

#### globalTeardown works with default export

```ts
test('globalTeardown works with default export', () => {
  const teardownPath = path.resolve(e2eDir, 'teardownWithDefaultExport.js');

  const result = runJest(e2eDir, [
    `--globalTeardown=${teardownPath}`,
    '--testPathPatterns=pass',
    '--cache=true',
  ]);

  expect(result.stdout).toBe("[ 'pass' ]\ntrue");
}
```

#### globalTeardown throws with named export

```ts
test('globalTeardown throws with named export', () => {
  const teardownPath = path.resolve(
    e2eDir,
    'invalidTeardownWithNamedExport.js',
  );

  const {exitCode, stderr} = runJest(e2eDir, [
    `--globalTeardown=${teardownPath}`,
    '--testPathPatterns=__tests__',
  ]);

  expect(exitCode).toBe(1);
  expect(stderr).toContain('Jest: Got error running globalTeardown');
  expect(stderr).toContain(
    `globalTeardown file must export a function at ${teardownPath}`,
  );
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/global-setup-esm/__tests__/test.js

#### should exist setup file

```ts
test('should exist setup file', () => {
  const files = fs.readdirSync(DIR);
  expect(files).toHaveLength(1);
  const setup = fs.readFileSync(path.join(DIR, files[0]), 'utf8');
  expect(setup).toBe('setup');
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/coverageHandlebars.test.ts

#### code coverage for Handlebars

```ts
it('code coverage for Handlebars', () => {
  runYarnInstall(dir);
  const result = runJest(dir, ['--coverage', '--no-cache']);

  expect(result.exitCode).toBe(0);
  expect(result.stdout).toMatchSnapshot();

  const coverageMapFile = path.join(coverageDir, 'coverage-final.json');
  const coverageMap = JSON.parse(readFileSync(coverageMapFile, 'utf8'));

  expect(
    Object.keys(coverageMap).map(filename => path.basename(filename)),
  ).toEqual(['greet.hbs']);
}
```

## fs

**Consultas usadas no Horsebox:** `existsSync`, `fs existsSync`, `readFileSync`, `fs readFileSync`, `writeFileSync`, `fs writeFileSync`

**Arquivos de teste encontrados:** 278

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/globalSetup.test.ts

#### globalSetup is triggered once before all test suites

```ts
test('globalSetup is triggered once before all test suites', () => {
  const setupPath = path.join(e2eDir, 'setup.js');
  const result = runWithJson(e2eDir, [
    `--globalSetup=${setupPath}`,
    '--testPathPatterns=__tests__',
  ]);

  expect(result.exitCode).toBe(0);
  const files = fs.readdirSync(DIR);
  expect(files).toHaveLength(1);
  const setup = fs.readFileSync(path.join(DIR, files[0]), 'utf8');
  expect(setup).toBe('setup');
}
```

#### should call globalSetup function of multiple projects

```ts
test('should call globalSetup function of multiple projects', () => {
  const configPath = path.resolve(e2eDir, 'projects.jest.config.js');

  const result = runWithJson(e2eDir, [`--config=${configPath}`]);

  expect(result.exitCode).toBe(0);

  expect(fs.existsSync(DIR)).toBe(true);
  expect(fs.existsSync(project1DIR)).toBe(true);
  expect(fs.existsSync(project2DIR)).toBe(true);
}
```

#### should not call a globalSetup of a project if there are no tests to run from this project

```ts
test('should not call a globalSetup of a project if there are no tests to run from this project', () => {
  const configPath = path.resolve(e2eDir, 'projects.jest.config.js');

  const result = runWithJson(e2eDir, [
    `--config=${configPath}`,
    '--testPathPatterns=setup1',
  ]);

  expect(result.exitCode).toBe(0);

  expect(fs.existsSync(DIR)).toBe(true);
  expect(fs.existsSync(project1DIR)).toBe(true);
  expect(fs.existsSync(project2DIR)).toBe(false);
}
```

#### should not call any globalSetup if there are no tests to run

```ts
test('should not call any globalSetup if there are no tests to run', () => {
  const configPath = path.resolve(e2eDir, 'projects.jest.config.js');

  const result = runWithJson(e2eDir, [
    `--config=${configPath}`,
    // onlyChanged ensures there are no tests to run
    '--onlyChanged',
  ]);

  expect(result.exitCode).toBe(0);

  expect(fs.existsSync(DIR)).toBe(false);
  expect(fs.existsSync(project1DIR)).toBe(false);
  expect(fs.existsSync(project2DIR)).toBe(false);
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/clearCache.test.ts

#### normal run results in cache directory being written

```ts
test('normal run results in cache directory being written', () => {
    const {exitCode} = runJest('clear-cache', [`--cacheDirectory=${CACHE}`]);

    expect(fs.existsSync(CACHE)).toBe(true);
    expect(exitCode).toBe(0);
  }
```

#### clearCache results in deleted directory and exitCode 0

```ts
test('clearCache results in deleted directory and exitCode 0', () => {
    expect(fs.existsSync(CACHE)).toBe(true);

    const {exitCode, stdout, stderr} = runJest('clear-cache', [
      '--clearCache',
      `--cacheDirectory=${CACHE}`,
    ]);

    expect(fs.existsSync(CACHE)).toBe(false);
    expect(stdout).toBe(`Cleared ${CACHE}`);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/globalTeardown.test.ts

#### globalTeardown is triggered once after all test suites

```ts
test('globalTeardown is triggered once after all test suites', () => {
  createDirectory(DIR);
  const teardownPath = path.resolve(e2eDir, 'teardown.js');
  const result = runWithJson('global-teardown', [
    `--globalTeardown=${teardownPath}`,
    '--testPathPatterns=__tests__',
  ]);

  expect(result.exitCode).toBe(0);
  const files = fs.readdirSync(DIR);
  expect(files).toHaveLength(1);
  const teardown = fs.readFileSync(path.join(DIR, files[0]), 'utf8');
  expect(teardown).toBe('teardown');
}
```

#### should call globalTeardown function of multiple projects

```ts
test('should call globalTeardown function of multiple projects', () => {
  const configPath = path.resolve(e2eDir, 'projects.jest.config.js');

  const result = runWithJson('global-teardown', [`--config=${configPath}`]);

  expect(result.exitCode).toBe(0);

  expect(fs.existsSync(DIR)).toBe(true);
  expect(fs.existsSync(project1DIR)).toBe(true);
  expect(fs.existsSync(project2DIR)).toBe(true);
}
```

#### should not call a globalTeardown of a project if there are no tests to run from this project

```ts
test('should not call a globalTeardown of a project if there are no tests to run from this project', () => {
  const configPath = path.resolve(e2eDir, 'projects.jest.config.js');

  const result = runWithJson('global-teardown', [
    `--config=${configPath}`,
    '--testPathPatterns=teardown1',
  ]);

  expect(result.exitCode).toBe(0);

  expect(fs.existsSync(DIR)).toBe(true);
  expect(fs.existsSync(project1DIR)).toBe(true);
  expect(fs.existsSync(project2DIR)).toBe(false);
}
```

### /tmp/ctest-repos-nXQIAb/95324de690-parser/packages/babel-register/test/cache.js

#### should not create the cache if not dirty

```ts
it("should not create the cache if not dirty", () => {
      save();

      expect(fs.existsSync(testCacheFilename)).toBe(false);
      expect(get()).toEqual({});
    }
```

#### should create the cache on save if dirty

```ts
it("should create the cache on save if dirty", () => {
      setDirty();
      save();

      expect(fs.existsSync(testCacheFilename)).toBe(true);
      expect(get()).toEqual({});
    }
```

#### should create the cache after dirty

```ts
it("should create the cache after dirty", () => {
      load();
      setDirty();
      return new Promise(resolve => {
        process.nextTick(() => {
          expect(fs.existsSync(testCacheFilename)).toBe(true);
          expect(get()).toEqual({});
          resolve();
        });
      });
    }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/global-teardown/project-2/teardown2.test.js

#### teardown file should not exist

```ts
test('teardown file should not exist', () => {
  expect(fs.existsSync(DIR)).toBe(false);
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/global-teardown/project-1/teardown1.test.js

#### should not exist teardown file

```ts
test('should not exist teardown file', () => {
  expect(fs.existsSync(DIR)).toBe(false);
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/global-teardown-esm/__tests__/test.js

#### should not exist teardown file

```ts
test('should not exist teardown file', () => {
  expect(fs.existsSync(DIR)).toBe(false);
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/listTests.test.ts

#### causes tests to be saved in the file as JSON

```ts
it('causes tests to be saved in the file as JSON', () => {
      const {exitCode, stdout} = runJest('list-tests', [
        '--listTests',
        '--json',
        '--outputFile',
        outputFilePath,
      ]);

      expect(exitCode).toBe(0);
      expect(stdout).toBe('');

      const outputFileExists = fs.existsSync(outputFilePath);
      expect(outputFileExists).toBe(true);

      const outputFileContent = fs.readFileSync(outputFilePath, 'utf8');
      expect(() => JSON.parse(outputFileContent)).not.toThrow();
      expect(
        JSON.stringify(
          JSON.parse(outputFileContent).map(normalizePaths).sort(),
        ),
      ).toMatchSnapshot();
    }
```

#### causes tests to be saved in the file in different lines

```ts
it('causes tests to be saved in the file in different lines', () => {
      const {exitCode, stdout} = runJest('list-tests', [
        '--listTests',
        '--outputFile',
        outputFilePath,
      ]);

      expect(exitCode).toBe(0);
      expect(stdout).toBe('');

      const outputFileExists = fs.existsSync(outputFilePath);
      expect(outputFileExists).toBe(true);

      const outputFileContent = fs.readFileSync(outputFilePath, 'utf8');
      expect(
        normalizePaths(outputFileContent).split('\n').sort().join('\n'),
      ).toMatchSnapshot();
    }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/toMatchInlineSnapshot.test.ts

#### removes obsolete external snapshots

```ts
test('removes obsolete external snapshots', () => {
  const filename = 'removes-obsolete-external-snapshots.test.js';
  const snapshotPath = path.join(
    TESTS_DIR,
    '__snapshots__',
    `${filename}.snap`,
  );
  const template = makeTemplate(`
    test('removes obsolete external snapshots', () => {
      expect('1').$1();
    });
  `);

  {
    writeFiles(TESTS_DIR, {[filename]: template(['toMatchSnapshot'])});
    const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
    const fileAfter = readFile(filename);
    expect(stderr).toMatch('1 snapshot written from 1 test suite.');
    expect(exitCode).toBe(0);
    expect(fileAfter).toMatchSnapshot('initial write');
    expect(fs.existsSync(snapshotPath)).toBe(true);
  }

  {
    writeFiles(TESTS_DIR, {[filename]: template(['toMatchInlineSnapshot'])});
    const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
    const fileAfter = readFile(filename);
    expect(stderr).toMatch('Snapshots:   1 obsolete, 1 written, 1 total');
    expect(exitCode).toBe(1);
    expect(fileAfter).toMatchSnapshot('inline snapshot written');
    expect(fs.existsSync(snapshotPath)).toBe(true);
  }

  {
    const {stderr, exitCode} = runJest(DIR, [
      '-w=1',
      '--ci=false',
      filename,
      '-u',
    ]);
    const fileAfter = readFile(filename);
    expect(stderr).toMatch('Snapshots:   1 file removed, 1 passed, 1 total');
    expect(exitCode).toBe(0);
    expect(fileAfter).toMatchSnapshot('external snapshot cleaned');
    expect(fs.existsSync(snapshotPath)).toBe(false);
  }
}
```

#### handles mocking native modules prettier relies on

```ts
test('handles mocking native modules prettier relies on', () => {
  const filename = 'mockFail.test.js';
  const test = `
    jest.mock('path', () => ({}));
    jest.mock('fs', () => ({}));
    jest.mock('graceful-fs', () => ({}));
    test('inline snapshots', () => {
      expect({}).toMatchInlineSnapshot();
    });
  `;

  writeFiles(TESTS_DIR, {[filename]: test});
  const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
  expect(stderr).toMatch('1 snapshot written from 1 test suite.');
  expect(exitCode).toBe(0);
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-snapshot-utils/src/__tests__/utils.test.ts

#### saveSnapshotFile() works with \r\n

```ts
test('saveSnapshotFile() works with \r\n', () => {
  const filename = path.join(__dirname, 'remove-newlines.snap');
  const data = {
    myKey: '<div>\r\n</div>',
  };

  saveSnapshotFile(data, filename);
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    filename,
    `// Jest Snapshot v1, ${SNAPSHOT_GUIDE_LINK}\n\n` +
      'exports[`myKey`] = `<div>\n</div>`;\n',
  );
}
```

#### saveSnapshotFile() works with \r

```ts
test('saveSnapshotFile() works with \r', () => {
  const filename = path.join(__dirname, 'remove-newlines.snap');
  const data = {
    myKey: '<div>\r</div>',
  };

  saveSnapshotFile(data, filename);
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    filename,
    `// Jest Snapshot v1, ${SNAPSHOT_GUIDE_LINK}\n\n` +
      'exports[`myKey`] = `<div>\n</div>`;\n',
  );
}
```

#### getSnapshotData() throws when no snapshot version

```ts
test('getSnapshotData() throws when no snapshot version', () => {
  const filename = path.join(__dirname, 'old-snapshot.snap');
  jest
    .mocked(fs.readFileSync)
    .mockReturnValue('exports[`myKey`] = `<div>\n</div>`;\n');
  const update = 'none';

  expect(() => getSnapshotData(filename, update)).toThrow(
    chalk.red(
      `${chalk.bold('Outdated snapshot')}: No snapshot header found. ` +
        'Jest 19 introduced versioned snapshots to ensure all developers on ' +
        'a project are using the same version of Jest. ' +
        'Please update all snapshots during this upgrade of Jest.\n\n',
    ) + SNAPSHOT_VERSION_WARNING,
  );
}
```

#### getSnapshotData() throws for older snapshot version

```ts
test('getSnapshotData() throws for older snapshot version', () => {
  const filename = path.join(__dirname, 'old-snapshot.snap');
  jest
    .mocked(fs.readFileSync)
    .mockReturnValue(
      `// Jest Snapshot v0.99, ${SNAPSHOT_GUIDE_LINK}\n\n` +
        'exports[`myKey`] = `<div>\n</div>`;\n',
    );
  const update = 'none';

  expect(() => getSnapshotData(filename, update)).toThrow(
    `${chalk.red(
      `${chalk.red.bold('Outdated snapshot')}: The version of the snapshot ` +
        'file associated with this test is outdated. The snapshot file ' +
        'version ensures that all developers on a project are using ' +
        'the same version of Jest. ' +
        'Please update all snapshots during this upgrade of Jest.',
    )}\n\nExpected: v${SNAPSHOT_VERSION}\n` +
      `Received: v0.99\n\n${SNAPSHOT_VERSION_WARNING}`,
  );
}
```

#### getSnapshotData() throws for deprecated snapshot guide link

```ts
test('getSnapshotData() throws for deprecated snapshot guide link', () => {
  const deprecatedGuideLink = 'https://goo.gl/fbAQLP';
  const filename = path.join(__dirname, 'old-snapshot.snap');
  jest
    .mocked(fs.readFileSync)
    .mockReturnValue(
      `// Jest Snapshot v1, ${deprecatedGuideLink}\n\n` +
        'exports[`myKey`] = `<div>\n</div>`;\n',
    );
  const update = 'none';

  expect(() => getSnapshotData(filename, update)).toThrow(
    `${chalk.red(
      `${chalk.red.bold(
        'Outdated guide link',
      )}: The snapshot guide link at the top of this snapshot is outdated. ` +
        'Please update all snapshots during this upgrade of Jest.',
    )}\n\nExpected: ${SNAPSHOT_GUIDE_LINK}\n` +
      `Received: ${deprecatedGuideLink}`,
  );
}
```

#### getSnapshotData() does not throw for when updating

```ts
test('getSnapshotData() does not throw for when updating', () => {
  const filename = path.join(__dirname, 'old-snapshot.snap');
  jest
    .mocked(fs.readFileSync)
    .mockReturnValue('exports[`myKey`] = `<div>\n</div>`;\n');
  const update = 'all';

  expect(() => getSnapshotData(filename, update)).not.toThrow();
}
```

#### getSnapshotData() marks invalid snapshot dirty when updating

```ts
test('getSnapshotData() marks invalid snapshot dirty when updating', () => {
  const filename = path.join(__dirname, 'old-snapshot.snap');
  jest
    .mocked(fs.readFileSync)
    .mockReturnValue('exports[`myKey`] = `<div>\n</div>`;\n');
  const update = 'all';

  expect(getSnapshotData(filename, update)).toMatchObject({dirty: true});
}
```

#### getSnapshotData() marks valid snapshot not dirty when updating

```ts
test('getSnapshotData() marks valid snapshot not dirty when updating', () => {
  const filename = path.join(__dirname, 'old-snapshot.snap');
  jest
    .mocked(fs.readFileSync)
    .mockReturnValue(
      `// Jest Snapshot v${SNAPSHOT_VERSION}, ${SNAPSHOT_GUIDE_LINK}\n\n` +
        'exports[`myKey`] = `<div>\n</div>`;\n',
    );
  const update = 'all';

  expect(getSnapshotData(filename, update)).toMatchObject({dirty: false});
}
```

#### escaping

```ts
test('escaping', () => {
  const filename = path.join(__dirname, 'escaping.snap');
  const data = '"\'\\';
  const writeFileSync = jest.mocked(fs.writeFileSync);

  writeFileSync.mockReset();
  saveSnapshotFile({key: data}, filename);
  const writtenData = writeFileSync.mock.calls[0][1];
  expect(writtenData).toBe(
    `// Jest Snapshot v1, ${SNAPSHOT_GUIDE_LINK}\n\n` +
      'exports[`key`] = `"\'\\\\`;\n',
  );

  // eslint-disable-next-line no-eval
  const readData = eval(`var exports = {}; ${writtenData} exports`);
  expect(readData).toEqual({key: data});
  const snapshotData = readData.key;
  expect(data).toEqual(snapshotData);
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-source-map/src/__tests__/getCallsite.test.ts

#### without source map

```ts
test('without source map', () => {
    const site = getCallsite(0);

    expect(site.getFileName()).toEqual(__filename);
    expect(site.getColumnNumber()).toEqual(expect.any(Number));
    expect(site.getLineNumber()).toEqual(expect.any(Number));
    expect(fs.readFileSync).not.toHaveBeenCalled();
  }
```

#### ignores errors when fs throws

```ts
test('ignores errors when fs throws', () => {
    jest.mocked(fs.readFileSync).mockImplementation(() => {
      throw new Error('Mock error');
    });

    const site = getCallsite(0, new Map([[__filename, 'mockedSourceMapFile']]));

    expect(site.getFileName()).toEqual(__filename);
    expect(site.getColumnNumber()).toEqual(expect.any(Number));
    expect(site.getLineNumber()).toEqual(expect.any(Number));
    expect(fs.readFileSync).toHaveBeenCalledWith('mockedSourceMapFile', 'utf8');
  }
```

#### reads source map file to determine line and column

```ts
test('reads source map file to determine line and column', () => {
    jest.mocked(fs.readFileSync).mockImplementation(() =>
      JSON.stringify({
        file: 'file.js',
        mappings: 'AAAA,OAAO,MAAM,KAAK,GAAG,QAAd',
        names: [],
        sources: ['file.js'],
        sourcesContent: ["export const hello = 'foobar';\\n"],
        version: 3,
      }),
    );

    const sourceMapColumn = 1;
    const sourceMapLine = 2;

    jest.mocked(originalPositionFor).mockImplementation(() => ({
      column: sourceMapColumn,
      line: sourceMapLine,
    }));

    const site = getCallsite(0, new Map([[__filename, 'mockedSourceMapFile']]));

    expect(site.getFileName()).toEqual(__filename);
    expect(site.getColumnNumber()).toEqual(sourceMapColumn);
    expect(site.getLineNumber()).toEqual(sourceMapLine);
    expect(originalPositionFor).toHaveBeenCalledTimes(1);
    expect(originalPositionFor).toHaveBeenCalledWith(expect.anything(), {
      column: expect.any(Number),
      line: expect.any(Number),
    });
    expect(fs.readFileSync).toHaveBeenCalledWith('mockedSourceMapFile', 'utf8');
  }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-snapshot/src/__tests__/InlineSnapshots.test.ts

#### saveInlineSnapshots() replaces empty function call with a template literal

```ts
test('saveInlineSnapshots() replaces empty function call with a template literal', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(filename, 'expect(1).toMatchInlineSnapshot();\n');

  saveInlineSnapshots(
    [
      {
        frame: {column: 11, file: filename, line: 1} as Frame,
        snapshot: '1',
      },
    ],
    dir,
    'prettier',
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    'expect(1).toMatchInlineSnapshot(`1`);\n',
  );
}
```

#### saveInlineSnapshots() without prettier leaves formatting outside of snapshots alone

```ts
test('saveInlineSnapshots() without prettier leaves formatting outside of snapshots alone', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    `${`
const a = [1,            2];
expect(a).toMatchInlineSnapshot(\`an out-of-date and also multi-line
snapshot\`);
expect(a).toMatchInlineSnapshot();
expect(a).toMatchInlineSnapshot(\`[1, 2]\`);
`.trim()}
```

#### saveInlineSnapshots() with bad prettier path leaves formatting outside of snapshots alone

```ts
test('saveInlineSnapshots() with bad prettier path leaves formatting outside of snapshots alone', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    `${`
const a = [1,            2];
expect(a).toMatchInlineSnapshot(\`an out-of-date and also multi-line
snapshot\`);
expect(a).toMatchInlineSnapshot();
expect(a).toMatchInlineSnapshot(\`[1, 2]\`);
`.trim()}
```

#### saveInlineSnapshots() can handle tsx without prettier

```ts
test('saveInlineSnapshots() can handle tsx without prettier', () => {
  const filename = path.join(dir, 'my.test.tsx');
  fs.writeFileSync(
    filename,
    `${`
it('foos', async () => {
  const Foo = (props: { foo: string }) => <div>{props.foo}</div>;
  const a = await Foo({ foo: "hello" });
  expect(a).toMatchInlineSnapshot();
})
`.trim()}\n`,
  );

  saveInlineSnapshots(
    [
      {
        frame: {column: 13, file: filename, line: 4} as Frame,
        snapshot: '<div>hello</div>',
      },
    ],
    dir,
    null,
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    `${`
it('foos', async () => {
  const Foo = (props: { foo: string }) => <div>{props.foo}</div>;
  const a = await Foo({ foo: "hello" });
  expect(a).toMatchInlineSnapshot(\`<div>hello</div>\`);
})
`.trim()}\n`,
  );
});

test('saveInlineSnapshots() can handle flow and jsx without prettier', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    `${`
const Foo = (props: { foo: string }) => <div>{props.foo}</div>;
const a = Foo({ foo: "hello" });
expect(a).toMatchInlineSnapshot();
`.trim()}\n`,
  );
  fs.writeFileSync(
    path.join(dir, '.babelrc'),
    JSON.stringify({
      presets: [
        require.resolve('@babel/preset-flow'),
        require.resolve('@babel/preset-react'),
      ],
    }),
  );

  saveInlineSnapshots(
    [
      {
        frame: {column: 11, file: filename, line: 3} as Frame,
        snapshot: '<div>hello</div>',
      },
    ],
    dir,
    null,
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    `${`
const Foo = (props: { foo: string }) => <div>{props.foo}</div>;
const a = Foo({ foo: "hello" });
expect(a).toMatchInlineSnapshot(\`<div>hello</div>\`);
`.trim()}\n`,
  );
});

test('saveInlineSnapshots() can use prettier to fix formatting for whole file', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    `${`
const a = [1,            2];
expect(a).toMatchInlineSnapshot(\`an out-of-date and also multi-line
snapshot\`);
expect(a).toMatchInlineSnapshot();
expect(a).toMatchInlineSnapshot(\`[1, 2]\`);
`.trim()}\n`,
  );

  saveInlineSnapshots(
    [2, 4, 5].map(line => ({
      frame: {column: 11, file: filename, line} as Frame,
      snapshot: '[1, 2]',
    })),
    dir,
    'prettier',
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    `const a = [1, 2];
expect(a).toMatchInlineSnapshot(\`[1, 2]\`);
expect(a).toMatchInlineSnapshot(\`[1, 2]\`);
expect(a).toMatchInlineSnapshot(\`[1, 2]\`);
`,
  );
}
```

#### saveInlineSnapshots() replaces existing template literal with property matchers

```ts
test('saveInlineSnapshots() replaces existing template literal with property matchers', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(filename, 'expect(1).toMatchInlineSnapshot({}, `2`);\n');

  saveInlineSnapshots(
    [
      {
        frame: {column: 11, file: filename, line: 1} as Frame,
        snapshot: '1',
      },
    ],
    dir,
    'prettier',
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    'expect(1).toMatchInlineSnapshot({}, `1`);\n',
  );
}
```

#### saveInlineSnapshots() throws if frame does not match

```ts
test('saveInlineSnapshots() throws if frame does not match', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(filename, 'expect(1).toMatchInlineSnapshot();\n');

  const save = () =>
    saveInlineSnapshots(
      [
        {
          frame: {
            column: 2 /* incorrect */,
            file: filename,
            line: 1,
          } as Frame,
          snapshot: '1',
        },
      ],
      dir,
      'prettier',
    );

  expect(save).toThrow(/Couldn't locate all inline snapshots./);
});

test('saveInlineSnapshots() throws if multiple calls to to the same location', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(filename, 'expect(1).toMatchInlineSnapshot();\n');

  const frame = {column: 11, file: filename, line: 1} as Frame;
  const save = () =>
    saveInlineSnapshots(
      [
        {frame, snapshot: '1'},
        {frame, snapshot: '2'},
      ],
      dir,
      'prettier',
    );

  expect(save).toThrow(
    /Multiple inline snapshots for the same call are not supported./,
  );
});

test('saveInlineSnapshots() uses escaped backticks', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(filename, 'expect("`").toMatchInlineSnapshot();\n');

  const frame = {column: 13, file: filename, line: 1} as Frame;
  saveInlineSnapshots([{frame, snapshot: '`'}], dir, 'prettier');

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    'expect("`").toMatchInlineSnapshot(`\\``);\n',
  );
});

test('saveInlineSnapshots() works with non-literals in expect call', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(filename, "expect({a: 'a'}).toMatchInlineSnapshot();\n");
  jest.mocked(prettier.resolveConfig.sync).mockReturnValue({
    bracketSpacing: false,
    singleQuote: true,
  });

  saveInlineSnapshots(
    [
      {
        frame: {column: 18, file: filename, line: 1} as Frame,
        snapshot: "{a: 'a'}",
      },
    ],
    dir,
    'prettier',
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    "expect({a: 'a'}).toMatchInlineSnapshot(`{a: 'a'}`);\n",
  );
});

test('saveInlineSnapshots() indents multi-line snapshots with spaces', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    "it('is a test', () => {\n" +
      "  expect({a: 'a'}).toMatchInlineSnapshot();\n" +
      '});\n',
  );
  jest.mocked(prettier.resolveConfig.sync).mockReturnValue({
    bracketSpacing: false,
    singleQuote: true,
  });

  saveInlineSnapshots(
    [
      {
        frame: {column: 20, file: filename, line: 2} as Frame,
        snapshot: "\nObject {\n  a: 'a'\n}\n",
      },
    ],
    dir,
    'prettier',
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    "it('is a test', () => {\n" +
      "  expect({a: 'a'}).toMatchInlineSnapshot(`\n" +
      '    Object {\n' +
      "      a: 'a'\n" +
      '    }\n' +
      '  `);\n' +
      '});\n',
  );
});

test('saveInlineSnapshots() does not re-indent error snapshots', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    "it('is an error test', () => {\n" +
      '  expect(() => {\n' +
      "    throw new Error(['a', 'b'].join('\\n'));\n" +
      '  }).toThrowErrorMatchingInlineSnapshot(`\n' +
      '    "a\n' +
      '    b"\n' +
      '  `);\n' +
      '});\n' +
      "it('is another test', () => {\n" +
      "  expect({a: 'a'}).toMatchInlineSnapshot();\n" +
      '}
```

#### is an error test

```ts
it('is an error test', () => {\n" +
      '  expect(() => {\n' +
      "    throw new Error(['a', 'b'].join('\\n'));\n" +
      '  }).toThrowErrorMatchingInlineSnapshot(`\n' +
      '    "a\n' +
      '    b"\n' +
      '  `);\n' +
      '});\n' +
      "it('is another test', () => {\n" +
      "  expect({a: 'a'}).toMatchInlineSnapshot(`\n" +
      '    Object {\n' +
      "      a: 'a'\n" +
      '    }\n' +
      '  `);\n' +
      '});\n',
  );
});

test('saveInlineSnapshots() does not re-indent already indented snapshots', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    "it('is a test', () => {\n" +
      "  expect({a: 'a'}).toMatchInlineSnapshot();\n" +
      '}
```

#### saveInlineSnapshots() indents multi-line snapshots with tabs

```ts
test('saveInlineSnapshots() indents multi-line snapshots with tabs', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    "it('is a test', () => {\n" +
      "  expect({a: 'a'}).toMatchInlineSnapshot();\n" +
      '});\n',
  );
  jest.mocked(prettier.resolveConfig.sync).mockReturnValue({
    bracketSpacing: false,
    singleQuote: true,
    useTabs: true,
  });

  saveInlineSnapshots(
    [
      {
        frame: {column: 20, file: filename, line: 2} as Frame,
        snapshot: "\nObject {\n  a: 'a'\n}\n",
      },
    ],
    dir,
    'prettier',
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    "it('is a test', () => {\n" +
      "\texpect({a: 'a'}).toMatchInlineSnapshot(`\n" +
      '\t\tObject {\n' +
      "\t\t  a: 'a'\n" +
      '\t\t}\n' +
      '\t`);\n' +
      '});\n',
  );
}
```

#### saveInlineSnapshots() indents snapshots after prettier reformats

```ts
test('saveInlineSnapshots() indents snapshots after prettier reformats', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    "it('is a test', () => expect({a: 'a'}).toMatchInlineSnapshot());\n",
  );
  jest.mocked(prettier.resolveConfig.sync).mockReturnValue({
    bracketSpacing: false,
    singleQuote: true,
  });

  saveInlineSnapshots(
    [
      {
        frame: {column: 40, file: filename, line: 1} as Frame,
        snapshot: "\nObject {\n  a: 'a'\n}\n",
      },
    ],
    dir,
    'prettier',
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    "it('is a test', () =>\n" +
      "  expect({a: 'a'}).toMatchInlineSnapshot(`\n" +
      '    Object {\n' +
      "      a: 'a'\n" +
      '    }\n' +
      '  `));\n',
  );
}
```

#### saveInlineSnapshots() does not indent empty lines

```ts
test('saveInlineSnapshots() does not indent empty lines', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    "it('is a test', () => expect(`hello\n\nworld`).toMatchInlineSnapshot());\n",
  );
  jest.mocked(prettier.resolveConfig.sync).mockReturnValue({
    bracketSpacing: false,
    singleQuote: true,
  });

  saveInlineSnapshots(
    [
      {
        frame: {column: 9, file: filename, line: 3} as Frame,
        snapshot: '\nhello\n\nworld\n',
      },
    ],
    dir,
    'prettier',
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    "it('is a test', () =>\n" +
      '  expect(`hello\n\nworld`).toMatchInlineSnapshot(`\n' +
      '    hello\n' +
      '\n' +
      '    world\n' +
      '  `));\n',
  );
}
```

#### saveInlineSnapshots() indents awaited snapshots with spaces

```ts
test('saveInlineSnapshots() indents awaited snapshots with spaces', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    "it('is a test', async () => {\n" +
      "  const a = Promise.resolve({a: 'a'});\n" +
      '  await expect(a).resolves.toMatchInlineSnapshot();\n' +
      '});\n',
  );
  jest.mocked(prettier.resolveConfig.sync).mockReturnValue({
    bracketSpacing: false,
    singleQuote: true,
  });

  saveInlineSnapshots(
    [
      {
        frame: {column: 28, file: filename, line: 3} as Frame,
        snapshot: "\nObject {\n  a: 'a'\n}\n",
      },
    ],
    dir,
    'prettier',
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    "it('is a test', async () => {\n" +
      "  const a = Promise.resolve({a: 'a'});\n" +
      '  await expect(a).resolves.toMatchInlineSnapshot(`\n' +
      '    Object {\n' +
      "      a: 'a'\n" +
      '    }\n' +
      '  `);\n' +
      '});\n',
  );
}
```

#### saveInlineSnapshots() prioritize parser from project/editor configuration

```ts
test('saveInlineSnapshots() prioritize parser from project/editor configuration', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(
    filename,
    'const foo = {\n' +
      '  "1": "Some value",\n' +
      '};\n' +
      'test("something", () => {\n' +
      '  expect("a").toMatchInlineSnapshot();\n' +
      '});\n',
  );

  jest.mocked(prettier.resolveConfig.sync).mockReturnValue({
    parser: 'flow',
  });

  const prettierSpy = jest.spyOn(prettier.getFileInfo, 'sync');

  saveInlineSnapshots(
    [
      {
        frame: {column: 15, file: filename, line: 5} as Frame,
        snapshot: 'a',
      },
    ],
    dir,
    'prettier',
  );

  expect(prettierSpy).not.toHaveBeenCalled();
  expect(fs.readFileSync(filename, 'utf8')).toBe(
    'const foo = {\n' +
      '  "1": "Some value",\n' +
      '};\n' +
      'test("something", () => {\n' +
      '  expect("a").toMatchInlineSnapshot(`a`);\n' +
      '});\n',
  );
}
```

#### saveInlineSnapshots() replaces string literal, not just template literal

```ts
test('saveInlineSnapshots() replaces string literal, not just template literal', () => {
  const filename = path.join(dir, 'my.test.js');
  fs.writeFileSync(filename, 'expect("a").toMatchInlineSnapshot("b");\n');

  saveInlineSnapshots(
    [
      {
        frame: {column: 13, file: filename, line: 1} as Frame,
        snapshot: 'a',
      },
    ],
    dir,
    'prettier',
  );

  expect(fs.readFileSync(filename, 'utf8')).toBe(
    'expect("a").toMatchInlineSnapshot(`a`);\n',
  );
}
```

### /tmp/ctest-repos-nXQIAb/14937caf7b-cyclonedx-npm/tests/integration/cli.edge-cases.test.js

#### unsupported NPM version

```ts
test('unsupported NPM version', async () => {
    const logFileBase = join(tmpRoot, 'unsupported-npm-version')
    const cwd = join(dummyProjectsRoot, 'with-lockfile')

    const npmVersion = [
      Math.round((NPM_LOWEST_SUPPORTED[0] - 1) * Math.random()),
      Math.round(99 * Math.random()),
      Math.round(99 * Math.random())
    ]

    const { res, errFile } = runCLI([], logFileBase, cwd, {
      CT_VERSION: npmVersion.join('.'),
      npm_execpath: npmLsReplacement.justExit
    })

    try {
      await expect(res).rejects.toThrow(/Unsupported NPM version/i)
    } catch (err) {
      process.stderr.write(readFileSync(errFile))
      throw err
    }
  }
```

#### error on non-existing binary

```ts
test('error on non-existing binary', async () => {
      const logFileBase = join(tmpRootRun, 'non-existing')
      const cwd = join(dummyProjectsRoot, 'with-lockfile')

      const { res, errFile } = runCLI([], logFileBase, cwd, {
        npm_execpath: npmLsReplacement.nonExistingBinary
      })

      try {
        await expect(res).rejects.toThrow(/^unexpected npm execpath/i)
      } catch (err) {
        process.stderr.write(readFileSync(errFile))
        throw err
      }
    }
```

#### error on non-zero exit

```ts
test('error on non-zero exit', async () => {
      const logFileBase = join(tmpRootRun, 'error-exit-nonzero')
      const cwd = join(dummyProjectsRoot, 'with-lockfile')

      const expectedExitCode = 1 + Math.floor(254 * Math.random())

      const { res, errFile } = runCLI([], logFileBase, cwd, {
        // non-zero exit code
        CT_EXIT_CODE: `${expectedExitCode}`,
        npm_execpath: npmLsReplacement.justExit
      })

      try {
        await expect(res).rejects.toThrow(`npm-ls exited with errors: ${expectedExitCode} noSignal`)
      } catch (err) {
        process.stderr.write(readFileSync(errFile))
        throw err
      }
    }
```

#### error on broken json response

```ts
test('error on broken json response', async () => {
      const logFileBase = join(tmpRootRun, 'error-json-broken')
      const cwd = join(dummyProjectsRoot, 'with-lockfile')

      const { res, errFile } = runCLI([], logFileBase, cwd, {
        // abuse the npm-ls replacement, as it can be caused to crash under control.
        npm_execpath: npmLsReplacement.brokenJson
      })

      try {
        await expect(res).rejects.toThrow(/failed to parse npm-ls response/i)
      } catch (err) {
        process.stderr.write(readFileSync(errFile))
        throw err
      }
    }
```

#### suppressed error on non-zero exit

```ts
test('suppressed error on non-zero exit', async () => {
    const dd = {
      subject: 'dev-dependencies',
      npm: NPM_LOWEST_SUPPORTED[0],
      node: '20',
      os: 'ubuntu-latest'
    }

    mkdirSync(join(tmpRoot, 'suppressed-error-on-non-zero-exit'))
    const expectedOutSnap = join(demoResultsRoot, 'suppressed-error-on-non-zero-exit', `${dd.subject}_npm${dd.npm}_node${dd.node}_${dd.os}.snap.json`)
    const logFileBase = join(tmpRoot, 'suppressed-error-on-non-zero-exit', `${dd.subject}_npm${dd.npm}_node${dd.node}_${dd.os}`)
    const cwd = dummyProjectsRoot

    // non-zero exit code
    const expectedExitCode = 1 + Math.floor(254 * Math.random())

    const { res, outFile, errFile } = runCLI([
      '-vvv',
      '--ignore-npm-errors',
      '--output-reproducible',
      // no intention to test all the spec-versions nor all the output-formats - this would be not our scope.
      '--spec-version', `${latestCdxSpecVersion}`,
      '--output-format', 'JSON',
      // prevent file interaction in this synthetic scenario - they would not exist anyway
      '--package-lock-only',
      '--',
      join('with-lockfile', 'package.json')
    ], logFileBase, cwd, {
      CT_VERSION: `${dd.npm}.99.0`,
      CT_EXIT_CODE: expectedExitCode,
      CT_SUBJECT: dd.subject,
      CT_NPM: dd.npm,
      CT_NODE: dd.node,
      CT_OS: dd.os,
      npm_execpath: npmLsReplacement.demoResults
    })

    try {
      await expect(res).resolves.toBe(0)
    } catch (err) {
      process.stderr.write(readFileSync(errFile))
      throw err
    }

    const actualOutput = makeReproducible('json', readFileSync(outFile, 'utf8'))

    if (UPDATE_SNAPSHOTS) {
      mkdirSync(dirname(expectedOutSnap), { recursive: true })
      writeFileSync(expectedOutSnap, actualOutput, 'utf8')
    }

    expect(actualOutput).toEqual(
      readFileSync(expectedOutSnap, 'utf8'),
      `${outFile} should equal ${expectedOutSnap}`
    )
  }
```

### /tmp/ctest-repos-nXQIAb/95324de690-parser/packages/babel-plugin-transform-modules-systemjs/test/index.js

#### should requeue helpers

```ts
it("should requeue helpers", function () {
    const filename = path.join(
      __dirname,
      "fixtures/preset-env/requeue-helpers/output.js",
    );
    const content = readFileSync(filename, "utf8");

    let res;

    const context = createTestContext();
    context.System = {
      register: function (_, module) {
        res = module().execute();
      },
    };

    runCodeInTestContext(content, { filename }, context);

    expect(res).toBe("ok");
  }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-transform/src/__tests__/ScriptTransformer.test.ts

#### transforms a file properly

```ts
it('transforms a file properly', async () => {
    const scriptTransformer = await createScriptTransformer(config);
    const transformedBananaWithCoverage = scriptTransformer.transform(
      '/fruits/banana.js',
      getCoverageOptions({collectCoverage: true}),
    );

    expect(transformedBananaWithCoverage.code).toMatchSnapshot();

    // no-cache case
    expect(fs.readFileSync).toHaveBeenCalledTimes(1);
    expect(fs.readFileSync).toHaveBeenCalledWith('/fruits/banana.js', 'utf8');

    // in-memory cache
    const transformedBananaWithCoverageAgain = scriptTransformer.transform(
      '/fruits/banana.js',
      getCoverageOptions({collectCoverage: true}),
    );
    expect(transformedBananaWithCoverageAgain).toBe(
      transformedBananaWithCoverage,
    );

    const transformedKiwiWithCoverage = scriptTransformer.transform(
      '/fruits/kiwi.js',
      getCoverageOptions({collectCoverage: true}),
    );
    expect(transformedKiwiWithCoverage.code).toMatchSnapshot();

    expect(transformedBananaWithCoverage.code).not.toEqual(
      transformedKiwiWithCoverage.code,
    );
    expect(transformedBananaWithCoverage.code).not.toMatch(/instrumented kiwi/);

    // If we disable coverage, we get a different result.
    const transformedKiwiWithoutCoverage = scriptTransformer.transform(
      '/fruits/kiwi.js',
      getCoverageOptions({collectCoverage: false}),
    );

    expect(transformedKiwiWithoutCoverage.code).not.toEqual(
      transformedKiwiWithCoverage.code,
    );
  }
```

#### transforms a file async properly

```ts
it('transforms a file async properly', async () => {
    const scriptTransformer = await createScriptTransformer(config);
    const transformedBananaWithCoverage =
      await scriptTransformer.transformAsync(
        '/fruits/banana.js',
        getCoverageOptions({collectCoverage: true}),
      );

    expect(transformedBananaWithCoverage.code).toMatchSnapshot();

    // no-cache case
    expect(fs.readFileSync).toHaveBeenCalledTimes(1);
    expect(fs.readFileSync).toHaveBeenCalledWith('/fruits/banana.js', 'utf8');

    // in-memory cache
    const transformedBananaWithCoverageAgain =
      await scriptTransformer.transformAsync(
        '/fruits/banana.js',
        getCoverageOptions({collectCoverage: true}),
      );
    expect(transformedBananaWithCoverageAgain).toBe(
      transformedBananaWithCoverage,
    );

    const transformedKiwiWithCoverage = await scriptTransformer.transformAsync(
      '/fruits/kiwi.js',
      getCoverageOptions({collectCoverage: true}),
    );
    expect(transformedKiwiWithCoverage.code).toMatchSnapshot();

    expect(transformedBananaWithCoverage.code).not.toEqual(
      transformedKiwiWithCoverage.code,
    );
    expect(transformedBananaWithCoverage.code).not.toMatch(/instrumented kiwi/);

    // If we disable coverage, we get a different result.
    const transformedKiwiWithoutCoverage =
      await scriptTransformer.transformAsync(
        '/fruits/kiwi.js',
        getCoverageOptions({collectCoverage: false}),
      );

    expect(transformedKiwiWithoutCoverage.code).not.toEqual(
      transformedKiwiWithCoverage.code,
    );
  }
```

#### writes source map if preprocessor supplies it

```ts
it('writes source map if preprocessor supplies it', async () => {
    config = {
      ...config,
      transform: [['\\.js$', 'preprocessor-with-sourcemaps', {}]],
    };
    const scriptTransformer = await createScriptTransformer(config);

    const map = {
      mappings: ';AAAA',
      version: 3,
    };

    jest
      .mocked(
        (require('preprocessor-with-sourcemaps') as SyncTransformer).process,
      )
      .mockReturnValue({
        code: 'content',
        map,
      });

    const result = scriptTransformer.transform(
      '/fruits/banana.js',
      getCoverageOptions(),
    );
    expect(result.sourceMapPath).toEqual(expect.any(String));
    const mapStr = JSON.stringify(map);
    expect(writeFileAtomic.sync).toHaveBeenCalledTimes(2);
    expect(writeFileAtomic.sync).toHaveBeenCalledWith(
      result.sourceMapPath,
      mapStr,
      {
        encoding: 'utf8',
        fsync: false,
      },
    );
  }
```

#### in async mode, writes source map if preprocessor supplies it

```ts
it('in async mode, writes source map if preprocessor supplies it', async () => {
    config = {
      ...config,
      transform: [['\\.js$', 'preprocessor-with-sourcemaps', {}]],
    };
    const scriptTransformer = await createScriptTransformer(config);

    const map = {
      mappings: ';AAAA',
      version: 3,
    };

    jest
      .mocked(
        (require('preprocessor-with-sourcemaps') as SyncTransformer).process,
      )
      .mockReturnValue({
        code: 'content',
        map,
      });

    const result = await scriptTransformer.transformAsync(
      '/fruits/banana.js',
      getCoverageOptions(),
    );
    expect(result.sourceMapPath).toEqual(expect.any(String));
    const mapStr = JSON.stringify(map);
    expect(writeFileAtomic.sync).toHaveBeenCalledTimes(2);
    expect(writeFileAtomic.sync).toHaveBeenCalledWith(
      result.sourceMapPath,
      mapStr,
      {
        encoding: 'utf8',
        fsync: false,
      },
    );
  }
```

#### in async mode, writes source map if async preprocessor supplies it

```ts
it('in async mode, writes source map if async preprocessor supplies it', async () => {
    config = {
      ...config,
      transform: [['\\.js$', 'async-preprocessor-with-sourcemaps', {}]],
    };
    const scriptTransformer = await createScriptTransformer(config);

    const map = {
      mappings: ';AAAA',
      version: 3,
    };

    jest
      .mocked(
        (require('async-preprocessor-with-sourcemaps') as AsyncTransformer)
          .processAsync,
      )
      .mockResolvedValue({
        code: 'content',
        map,
      });

    const result = await scriptTransformer.transformAsync(
      '/fruits/banana.js',
      getCoverageOptions(),
    );
    expect(result.sourceMapPath).toEqual(expect.any(String));
    const mapStr = JSON.stringify(map);
    expect(writeFileAtomic.sync).toHaveBeenCalledTimes(2);
    expect(writeFileAtomic.sync).toHaveBeenCalledWith(
      result.sourceMapPath,
      mapStr,
      {
        encoding: 'utf8',
        fsync: false,
      },
    );
  }
```

#### writes source map if preprocessor inlines it

```ts
it('writes source map if preprocessor inlines it', async () => {
    config = {
      ...config,
      transform: [['\\.js$', 'preprocessor-with-sourcemaps', {}]],
    };
    const scriptTransformer = await createScriptTransformer(config);

    const sourceMap = JSON.stringify({
      mappings: 'AAAA,IAAM,CAAC,GAAW,CAAC,CAAC',
      version: 3,
    });

    const content =
      'var x = 1;\n' +
      `//# sourceMappingURL=data:application/json;base64,${Buffer.from(
        sourceMap,
      ).toString('base64')}`;

    jest
      .mocked(
        (require('preprocessor-with-sourcemaps') as SyncTransformer).process,
      )
      .mockReturnValue({
        code: content,
      });

    const result = scriptTransformer.transform(
      '/fruits/banana.js',
      getCoverageOptions(),
    );
    expect(result.sourceMapPath).toEqual(expect.any(String));
    expect(writeFileAtomic.sync).toHaveBeenCalledTimes(2);
    expect(writeFileAtomic.sync).toHaveBeenCalledWith(
      result.sourceMapPath,
      sourceMap,
      {encoding: 'utf8', fsync: false},
    );
  }
```

#### in async mode, writes source map if preprocessor inlines it

```ts
it('in async mode, writes source map if preprocessor inlines it', async () => {
    config = {
      ...config,
      transform: [['\\.js$', 'preprocessor-with-sourcemaps', {}]],
    };
    const scriptTransformer = await createScriptTransformer(config);

    const sourceMap = JSON.stringify({
      mappings: 'AAAA,IAAM,CAAC,GAAW,CAAC,CAAC',
      version: 3,
    });

    const content =
      'var x = 1;\n' +
      `//# sourceMappingURL=data:application/json;base64,${Buffer.from(
        sourceMap,
      ).toString('base64')}`;

    jest
      .mocked(
        (require('preprocessor-with-sourcemaps') as SyncTransformer).process,
      )
      .mockReturnValue({
        code: content,
      });

    const result = await scriptTransformer.transformAsync(
      '/fruits/banana.js',
      getCoverageOptions(),
    );
    expect(result.sourceMapPath).toEqual(expect.any(String));
    expect(writeFileAtomic.sync).toHaveBeenCalledTimes(2);
    expect(writeFileAtomic.sync).toHaveBeenCalledWith(
      result.sourceMapPath,
      sourceMap,
      {encoding: 'utf8', fsync: false},
    );
  }
```

#### writes source map if async preprocessor inlines it

```ts
it('writes source map if async preprocessor inlines it', async () => {
    config = {
      ...config,
      transform: [['\\.js$', 'async-preprocessor-with-sourcemaps', {}]],
    };
    const scriptTransformer = await createScriptTransformer(config);

    const sourceMap = JSON.stringify({
      mappings: 'AAAA,IAAM,CAAC,GAAW,CAAC,CAAC',
      version: 3,
    });

    const content =
      'var x = 1;\n' +
      `//# sourceMappingURL=data:application/json;base64,${Buffer.from(
        sourceMap,
      ).toString('base64')}`;

    jest
      .mocked(
        (require('async-preprocessor-with-sourcemaps') as AsyncTransformer)
          .processAsync,
      )
      .mockResolvedValue({code: content});

    const result = await scriptTransformer.transformAsync(
      '/fruits/banana.js',
      getCoverageOptions(),
    );
    expect(result.sourceMapPath).toEqual(expect.any(String));
    expect(writeFileAtomic.sync).toHaveBeenCalledTimes(2);
    expect(writeFileAtomic.sync).toHaveBeenCalledWith(
      result.sourceMapPath,
      sourceMap,
      {encoding: 'utf8', fsync: false},
    );
  }
```

#### writes source maps if given by the transformer

```ts
it('writes source maps if given by the transformer', async () => {
    config = {
      ...config,
      transform: [['\\.js$', 'preprocessor-with-sourcemaps', {}]],
    };
    const scriptTransformer = await createScriptTransformer(config);

    const map = {
      mappings: ';AAAA',
      version: 3,
    };

    jest
      .mocked(
        (require('preprocessor-with-sourcemaps') as SyncTransformer).process,
      )
      .mockReturnValue({
        code: 'content',
        map,
      });

    const result = scriptTransformer.transform(
      '/fruits/banana.js',
      getCoverageOptions(),
    );
    expect(result.sourceMapPath).toEqual(expect.any(String));
    expect(writeFileAtomic.sync).toHaveBeenCalledTimes(2);
    expect(writeFileAtomic.sync).toHaveBeenCalledWith(
      result.sourceMapPath,
      JSON.stringify(map),
      {
        encoding: 'utf8',
        fsync: false,
      },
    );
  }
```

#### reads values from the cache

```ts
it('reads values from the cache', async () => {
    const transformConfig: Config.ProjectConfig = {
      ...config,
      transform: [['\\.js$', 'test_preprocessor', {}]],
    };
    let scriptTransformer = await createScriptTransformer(transformConfig);
    scriptTransformer.transform('/fruits/banana.js', getCoverageOptions());

    const cachePath = getCachePath(mockFs, config);
    expect(writeFileAtomic.sync).toHaveBeenCalled();
    expect(jest.mocked(writeFileAtomic.sync).mock.calls[0][0]).toBe(cachePath);

    // Cache the state in `mockFsCopy`
    const mockFsCopy = mockFs;
    jest.resetModules();
    reset();

    // Restore the cached fs
    mockFs = mockFsCopy;
    scriptTransformer = await createScriptTransformer(transformConfig);
    scriptTransformer.transform('/fruits/banana.js', getCoverageOptions());

    expect(fs.readFileSync).toHaveBeenCalledTimes(2);
    expect(fs.readFileSync).toHaveBeenCalledWith('/fruits/banana.js', 'utf8');
    expect(fs.readFileSync).toHaveBeenCalledWith(cachePath, 'utf8');
    expect(writeFileAtomic.sync).not.toHaveBeenCalled();

    // Don't read from the cache when `config.cache` is false.
    jest.resetModules();
    reset();
    mockFs = mockFsCopy;
    transformConfig.cache = false;
    scriptTransformer = await createScriptTransformer(transformConfig);
    scriptTransformer.transform('/fruits/banana.js', getCoverageOptions());

    expect(fs.readFileSync).toHaveBeenCalledTimes(1);
    expect(fs.readFileSync).toHaveBeenCalledWith('/fruits/banana.js', 'utf8');
    expect(fs.readFileSync).not.toHaveBeenCalledWith(cachePath, 'utf8');
    expect(writeFileAtomic.sync).toHaveBeenCalled();
  });

  it('in async mode, reads values from the cache', async () => {
    const transformConfig: Config.ProjectConfig = {
      ...config,
      transform: [['\\.js$', 'test_preprocessor', {}]],
    };
    let scriptTransformer = await createScriptTransformer(transformConfig);
    await scriptTransformer.transformAsync(
      '/fruits/banana.js',
      getCoverageOptions(),
    );

    const cachePath = getCachePath(mockFs, config);
    expect(writeFileAtomic.sync).toHaveBeenCalled();
    expect(jest.mocked(writeFileAtomic.sync).mock.calls[0][0]).toBe(cachePath);

    // Cache the state in `mockFsCopy`
    const mockFsCopy = mockFs;
    jest.resetModules();
    reset();

    // Restore the cached fs
    mockFs = mockFsCopy;
    scriptTransformer = await createScriptTransformer(transformConfig);
    await scriptTransformer.transformAsync(
      '/fruits/banana.js',
      getCoverageOptions(),
    );

    expect(fs.readFileSync).toHaveBeenCalledTimes(2);
    expect(fs.readFileSync).toHaveBeenCalledWith('/fruits/banana.js', 'utf8');
    expect(fs.readFileSync).toHaveBeenCalledWith(cachePath, 'utf8');
    expect(writeFileAtomic.sync).not.toHaveBeenCalled();

    // Don't read from the cache when `config.cache` is false.
    jest.resetModules();
    reset();
    mockFs = mockFsCopy;
    transformConfig.cache = false;
    scriptTransformer = await createScriptTransformer(transformConfig);
    await scriptTransformer.transformAsync(
      '/fruits/banana.js',
      getCoverageOptions(),
    );

    expect(fs.readFileSync).toHaveBeenCalledTimes(1);
    expect(fs.readFileSync).toHaveBeenCalledWith('/fruits/banana.js', 'utf8');
    expect(fs.readFileSync).not.toHaveBeenCalledWith(cachePath, 'utf8');
    expect(writeFileAtomic.sync).toHaveBeenCalled();
  }
```

#### reads values from the cache when the file contains colons

```ts
it('reads values from the cache when the file contains colons', async () => {
    const transformConfig: Config.ProjectConfig = {
      ...config,
      transform: [['\\.js$', 'test_preprocessor', {}]],
    };
    let scriptTransformer = await createScriptTransformer(transformConfig);
    scriptTransformer.transform(
      '/fruits/banana:colon.js',
      getCoverageOptions(),
    );

    const cachePath = getCachePath(mockFs, config);
    expect(writeFileAtomic.sync).toHaveBeenCalled();
    expect(jest.mocked(writeFileAtomic.sync).mock.calls[0][0]).toBe(cachePath);

    // Cache the state in `mockFsCopy`
    const mockFsCopy = mockFs;
    jest.resetModules();
    reset();

    // Restore the cached fs
    mockFs = mockFsCopy;
    scriptTransformer = await createScriptTransformer(transformConfig);
    scriptTransformer.transform(
      '/fruits/banana:colon.js',
      getCoverageOptions(),
    );

    expect(fs.readFileSync).toHaveBeenCalledTimes(2);
    expect(fs.readFileSync).toHaveBeenCalledWith(
      '/fruits/banana:colon.js',
      'utf8',
    );
    expect(fs.readFileSync).toHaveBeenCalledWith(cachePath, 'utf8');
    expect(writeFileAtomic.sync).not.toHaveBeenCalled();
  }
```

#### in async mode, reads values from the cache when the file contains colons

```ts
it('in async mode, reads values from the cache when the file contains colons', async () => {
    const transformConfig: Config.ProjectConfig = {
      ...config,
      transform: [['\\.js$', 'test_preprocessor', {}]],
    };
    let scriptTransformer = await createScriptTransformer(transformConfig);
    await scriptTransformer.transformAsync(
      '/fruits/banana:colon.js',
      getCoverageOptions(),
    );

    const cachePath = getCachePath(mockFs, config);
    expect(writeFileAtomic.sync).toHaveBeenCalled();
    expect(jest.mocked(writeFileAtomic.sync).mock.calls[0][0]).toBe(cachePath);

    // Cache the state in `mockFsCopy`
    const mockFsCopy = mockFs;
    jest.resetModules();
    reset();

    // Restore the cached fs
    mockFs = mockFsCopy;
    scriptTransformer = await createScriptTransformer(transformConfig);
    await scriptTransformer.transformAsync(
      '/fruits/banana:colon.js',
      getCoverageOptions(),
    );

    expect(fs.readFileSync).toHaveBeenCalledTimes(2);
    expect(fs.readFileSync).toHaveBeenCalledWith(
      '/fruits/banana:colon.js',
      'utf8',
    );
    expect(fs.readFileSync).toHaveBeenCalledWith(cachePath, 'utf8');
    expect(writeFileAtomic.sync).not.toHaveBeenCalled();
  }
```

#### with async preprocessor, reads values from the cache when the file contains colons

```ts
it('with async preprocessor, reads values from the cache when the file contains colons', async () => {
    const transformConfig: Config.ProjectConfig = {
      ...config,
      transform: [['\\.js$', 'test_async_preprocessor', {}]],
    };
    let scriptTransformer = await createScriptTransformer(transformConfig);
    await scriptTransformer.transformAsync(
      '/fruits/banana:colon.js',
      getCoverageOptions(),
    );

    const cachePath = getCachePath(mockFs, config);
    expect(writeFileAtomic.sync).toHaveBeenCalled();
    expect(jest.mocked(writeFileAtomic.sync).mock.calls[0][0]).toBe(cachePath);

    // Cache the state in `mockFsCopy`
    const mockFsCopy = mockFs;
    jest.resetModules();
    reset();

    // Restore the cached fs
    mockFs = mockFsCopy;
    scriptTransformer = await createScriptTransformer(transformConfig);
    await scriptTransformer.transformAsync(
      '/fruits/banana:colon.js',
      getCoverageOptions(),
    );

    expect(fs.readFileSync).toHaveBeenCalledTimes(2);
    expect(fs.readFileSync).toHaveBeenCalledWith(
      '/fruits/banana:colon.js',
      'utf8',
    );
    expect(fs.readFileSync).toHaveBeenCalledWith(cachePath, 'utf8');
    expect(writeFileAtomic.sync).not.toHaveBeenCalled();
  }
```

#### should reuse the value from in-memory cache which is set by custom transformer

```ts
it('should reuse the value from in-memory cache which is set by custom transformer', async () => {
    const cacheFS = new Map<string, string>();
    const testPreprocessor =
      require('cache_fs_preprocessor') as SyncTransformer;
    const scriptTransformer = await createScriptTransformer(
      {
        ...config,
        transform: [['\\.js$', 'cache_fs_preprocessor', {}]],
      },
      cacheFS,
    );
    const fileName1 = '/fruits/banana.js';
    const fileName2 = '/fruits/kiwi.js';

    scriptTransformer.transform(fileName1, getCoverageOptions());

    cacheFS.set(fileName2, 'foo');

    scriptTransformer.transform(fileName2, getCoverageOptions());

    mockInvariant(testPreprocessor.getCacheKey != null);

    expect(
      jest.mocked(testPreprocessor.getCacheKey).mock.calls[0][2].cacheFS,
    ).toBeDefined();
    expect(
      jest.mocked(testPreprocessor.process).mock.calls[0][2].cacheFS,
    ).toBeDefined();
    expect(fs.readFileSync).toHaveBeenCalledTimes(1);
    expect(fs.readFileSync).toHaveBeenCalledWith(fileName1, 'utf8');
  }
```

#### in async mode, should reuse the value from in-memory cache which is set by custom preprocessor

```ts
it('in async mode, should reuse the value from in-memory cache which is set by custom preprocessor', async () => {
    const cacheFS = new Map<string, string>();
    const testPreprocessor =
      require('cache_fs_preprocessor') as SyncTransformer;
    const scriptTransformer = await createScriptTransformer(
      {
        ...config,
        transform: [['\\.js$', 'cache_fs_preprocessor', {}]],
      },
      cacheFS,
    );
    const fileName1 = '/fruits/banana.js';
    const fileName2 = '/fruits/kiwi.js';

    await scriptTransformer.transformAsync(fileName1, getCoverageOptions());

    cacheFS.set(fileName2, 'foo');

    await scriptTransformer.transformAsync(fileName2, getCoverageOptions());

    mockInvariant(testPreprocessor.getCacheKey != null);

    expect(
      jest.mocked(testPreprocessor.getCacheKey).mock.calls[0][2].cacheFS,
    ).toBeDefined();
    expect(
      jest.mocked(testPreprocessor.process).mock.calls[0][2].cacheFS,
    ).toBeDefined();
    expect(fs.readFileSync).toHaveBeenCalledTimes(1);
    expect(fs.readFileSync).toHaveBeenCalledWith(fileName1, 'utf8');
  }
```

#### should reuse the value from in-memory cache which is set by custom async preprocessor

```ts
it('should reuse the value from in-memory cache which is set by custom async preprocessor', async () => {
    const cacheFS = new Map<string, string>();
    const testPreprocessor =
      require('cache_fs_async_preprocessor') as AsyncTransformer;
    const scriptTransformer = await createScriptTransformer(
      {
        ...config,
        transform: [['\\.js$', 'cache_fs_async_preprocessor', {}]],
      },
      cacheFS,
    );
    const fileName1 = '/fruits/banana.js';
    const fileName2 = '/fruits/kiwi.js';

    await scriptTransformer.transformAsync(fileName1, getCoverageOptions());

    cacheFS.set(fileName2, 'foo');

    await scriptTransformer.transformAsync(fileName2, getCoverageOptions());

    mockInvariant(testPreprocessor.getCacheKeyAsync != null);

    expect(
      jest.mocked(testPreprocessor.getCacheKeyAsync).mock.calls[0][2].cacheFS,
    ).toBeDefined();
    expect(
      jest.mocked(testPreprocessor.processAsync).mock.calls[0][2].cacheFS,
    ).toBeDefined();
    expect(fs.readFileSync).toHaveBeenCalledTimes(1);
    expect(fs.readFileSync).toHaveBeenCalledWith(fileName1, 'utf8');
  }
```

#### does not reuse the in-memory cache between different projects

```ts
it('does not reuse the in-memory cache between different projects', async () => {
    const scriptTransformer = await createScriptTransformer({
      ...config,
      transform: [['\\.js$', 'test_preprocessor', {}]],
    });

    scriptTransformer.transform('/fruits/banana.js', getCoverageOptions());

    const anotherScriptTransformer = await createScriptTransformer({
      ...config,
      transform: [['\\.js$', 'css-preprocessor', {}]],
    });

    anotherScriptTransformer.transform(
      '/fruits/banana.js',
      getCoverageOptions(),
    );

    expect(fs.readFileSync).toHaveBeenCalledTimes(2);
    expect(fs.readFileSync).toHaveBeenCalledWith('/fruits/banana.js', 'utf8');
  }
```

#### async mode does not reuse the in-memory cache between different projects

```ts
it('async mode does not reuse the in-memory cache between different projects', async () => {
    const scriptTransformer = await createScriptTransformer({
      ...config,
      transform: [['\\.js$', 'test_preprocessor', {}]],
    });

    await scriptTransformer.transformAsync(
      '/fruits/banana.js',
      getCoverageOptions(),
    );

    const anotherScriptTransformer = await createScriptTransformer({
      ...config,
      transform: [['\\.js$', 'css-preprocessor', {}]],
    });

    await anotherScriptTransformer.transformAsync(
      '/fruits/banana.js',
      getCoverageOptions(),
    );

    expect(fs.readFileSync).toHaveBeenCalledTimes(2);
    expect(fs.readFileSync).toHaveBeenCalledWith('/fruits/banana.js', 'utf8');
  }
```

#### regardless of sync/async, does not reuse the in-memory cache between different projects

```ts
it('regardless of sync/async, does not reuse the in-memory cache between different projects', async () => {
    const scriptTransformer = await createScriptTransformer({
      ...config,
      transform: [['\\.js$', 'test_preprocessor', {}]],
    });

    scriptTransformer.transform('/fruits/banana.js', getCoverageOptions());

    const anotherScriptTransformer = await createScriptTransformer({
      ...config,
      transform: [['\\.js$', 'css-preprocessor', {}]],
    });

    await anotherScriptTransformer.transformAsync(
      '/fruits/banana.js',
      getCoverageOptions(),
    );

    const yetAnotherScriptTransformer = await createScriptTransformer({
      ...config,
      transform: [['\\.js$', 'test_preprocessor', {}]],
    });
    yetAnotherScriptTransformer.transform(
      '/fruits/banana.js',
      getCoverageOptions(),
    );

    const fruityScriptTransformer = await createScriptTransformer({
      ...config,
      transform: [['\\.js$', 'test_async_preprocessor', {}]],
    });
    await fruityScriptTransformer.transformAsync(
      '/fruits/banana.js',
      getCoverageOptions(),
    );

    expect(fs.readFileSync).toHaveBeenCalledTimes(4);
    expect(fs.readFileSync).toHaveBeenCalledWith('/fruits/banana.js', 'utf8');
  }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/coverageHandlebars.test.ts

#### code coverage for Handlebars

```ts
it('code coverage for Handlebars', () => {
  runYarnInstall(dir);
  const result = runJest(dir, ['--coverage', '--no-cache']);

  expect(result.exitCode).toBe(0);
  expect(result.stdout).toMatchSnapshot();

  const coverageMapFile = path.join(coverageDir, 'coverage-final.json');
  const coverageMap = JSON.parse(readFileSync(coverageMapFile, 'utf8'));

  expect(
    Object.keys(coverageMap).map(filename => path.basename(filename)),
  ).toEqual(['greet.hbs']);
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-config/src/__tests__/readConfigFileAndSetRootDir.test.ts

#### reads config and sets `rootDir`

```ts
test('reads config and sets `rootDir`', async () => {
      jest.mocked(fs.readFileSync).mockReturnValueOnce('{ "verbose": true }');

      const rootDir = path.resolve('some', 'path', 'to');
      const config = await readConfigFileAndSetRootDir(
        path.join(rootDir, 'jest.config.json'),
      );

      expect(config).toEqual({rootDir, verbose: true});
    }
```

#### supports comments in JSON

```ts
test('supports comments in JSON', async () => {
      jest
        .mocked(fs.readFileSync)
        .mockReturnValueOnce('{ // test comment\n "bail": true }');

      const rootDir = path.resolve('some', 'path', 'to');
      const config = await readConfigFileAndSetRootDir(
        path.join(rootDir, 'jest.config.json'),
      );

      expect(config).toEqual({bail: true, rootDir});
    }
```

#### reads config from "jest" key and sets `rootDir`

```ts
test('reads config from "jest" key and sets `rootDir`', async () => {
      jest
        .mocked(fs.readFileSync)
        .mockReturnValueOnce('{ "jest": { "coverage": true } }');

      const rootDir = path.resolve('some', 'path', 'to');
      const config = await readConfigFileAndSetRootDir(
        path.join(rootDir, 'package.json'),
      );

      expect(config).toEqual({coverage: true, rootDir});
    }
```

#### sets rootDir if "jest" is absent

```ts
test('sets rootDir if "jest" is absent', async () => {
      jest.mocked(fs.readFileSync).mockReturnValueOnce('{ "name": "test" }');

      const rootDir = path.resolve('some', 'path', 'to');
      const config = await readConfigFileAndSetRootDir(
        path.join(rootDir, 'package.json'),
      );

      expect(config).toEqual({rootDir});
    }
```

#### reaches into 2nd loadout by TS loader if specified in docblock

```ts
test('reaches into 2nd loadout by TS loader if specified in docblock', async () => {
      jest
        .mocked(requireOrImportModule)
        .mockRejectedValueOnce(new Error('Module not found'));
      jest.mocked(fs.readFileSync).mockReturnValue(`
        /** @jest-config-loader tsx */
        export { testTimeout: 1_000 }
      `);
      const rootDir = path.resolve('some', 'path', 'to');
      await expect(
        readConfigFileAndSetRootDir(path.join(rootDir, 'jest.config.ts')),
      ).rejects.toThrow(
        /Module not found\n.*'tsx' is not a valid TypeScript configuration loader./,
      );
    }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/coverageTransformInstrumented.test.ts

#### code coverage for transform instrumented code

```ts
it('code coverage for transform instrumented code', () => {
  runYarnInstall(dir);
  const result = runJest(dir, ['--coverage', '--no-cache']);

  expect(result.exitCode).toBe(0);

  const coverageMapFile = path.join(coverageDir, 'coverage-final.json');
  const coverageMap = JSON.parse(readFileSync(coverageMapFile, 'utf8'));

  // reduce absolute paths embedded in the coverage map to just filenames
  for (const filename of Object.keys(coverageMap)) {
    coverageMap[filename].path = path.basename(coverageMap[filename].path);
    delete coverageMap[filename].hash;
    coverageMap[path.basename(filename)] = coverageMap[filename];
    delete coverageMap[filename];
  }
  expect(coverageMap).toMatchSnapshot();
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/coverageRemapping.test.ts

#### maps code coverage against original source

```ts
it('maps code coverage against original source', () => {
  runYarnInstall(dir);
  const result = runJest(dir, ['--coverage', '--no-cache']);

  expect(result.exitCode).toBe(0);

  const coverageMapFile = path.join(coverageDir, 'coverage-final.json');
  const coverageMap = JSON.parse(readFileSync(coverageMapFile, 'utf8'));

  // reduce absolute paths embedded in the coverage map to just filenames
  for (const filename of Object.keys(coverageMap)) {
    coverageMap[filename].path = path.basename(coverageMap[filename].path);
    delete coverageMap[filename].hash;
    coverageMap[path.basename(filename)] = coverageMap[filename];
    delete coverageMap[filename];
  }
  expect(coverageMap).toMatchSnapshot();
}
```

### /tmp/ctest-repos-nXQIAb/95324de690-parser/packages/babel-core/test/parse.js

#### should parse using configuration from .babelrc when a filename is provided

```ts
it("should parse using configuration from .babelrc when a filename is provided", function () {
    const input = fs.readFileSync(fixture("input.js"), "utf8");
    const output = require(fixture("output"));

    const result = parseSync(input, {
      filename: fixture("input.js"),
      cwd: fixture(),
    });
    expect(JSON.parse(JSON.stringify(result))).toEqual(output);
  }
```

#### should parse using passed in configuration

```ts
it("should parse using passed in configuration", function () {
    const input = fs.readFileSync(fixture("input.js"), "utf8");
    const output = require(fixture("output.json"));

    const result = parseSync(input, {
      parserOpts: {
        plugins: [["decorators", { decoratorsBeforeExport: false }]],
      },
      cwd: fixture(),
    });
    expect(JSON.parse(JSON.stringify(result))).toEqual(output);
  }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-test-sequencer/src/__tests__/test_sequencer.test.ts

#### sorts based on timing information

```ts
test('sorts based on timing information', () => {
  fs.readFileSync.mockImplementationOnce(() =>
    JSON.stringify({
      '/test-a.js': [SUCCESS, 5],
      '/test-ab.js': [SUCCESS, 3],
    }),
  );
  expect(sequencer.sort(toTests(['/test-a.js', '/test-ab.js']))).toEqual([
    {context, duration: 5, path: '/test-a.js'},
    {context, duration: 3, path: '/test-ab.js'},
  ]);
}
```

#### sorts based on failures and timing information

```ts
test('sorts based on failures and timing information', () => {
  fs.readFileSync.mockImplementationOnce(() =>
    JSON.stringify({
      '/test-a.js': [SUCCESS, 5],
      '/test-ab.js': [FAIL, 0],
      '/test-c.js': [FAIL, 6],
      '/test-d.js': [SUCCESS, 2],
    }),
  );
  expect(
    sequencer.sort(
      toTests(['/test-a.js', '/test-ab.js', '/test-c.js', '/test-d.js']),
    ),
  ).toEqual([
    {context, duration: 6, path: '/test-c.js'},
    {context, duration: 0, path: '/test-ab.js'},
    {context, duration: 5, path: '/test-a.js'},
    {context, duration: 2, path: '/test-d.js'},
  ]);
}
```

#### sorts based on failures, timing information and file size

```ts
test('sorts based on failures, timing information and file size', () => {
  fs.readFileSync.mockImplementationOnce(() =>
    JSON.stringify({
      '/test-a.js': [SUCCESS, 5],
      '/test-ab.js': [FAIL, 1],
      '/test-c.js': [FAIL],
      '/test-d.js': [SUCCESS, 2],
      '/test-efg.js': [FAIL],
    }),
  );
  expect(
    sequencer.sort(
      toTests([
        '/test-a.js',
        '/test-ab.js',
        '/test-c.js',
        '/test-d.js',
        '/test-efg.js',
      ]),
    ),
  ).toEqual([
    {context, duration: undefined, path: '/test-efg.js'},
    {context, duration: undefined, path: '/test-c.js'},
    {context, duration: 1, path: '/test-ab.js'},
    {context, duration: 5, path: '/test-a.js'},
    {context, duration: 2, path: '/test-d.js'},
  ]);
}
```

#### writes the cache based on results without existing cache

```ts
test('writes the cache based on results without existing cache', async () => {
  fs.readFileSync.mockImplementationOnce(() => {
    throw new Error('File does not exist.');
  });

  const testPaths = ['/test-a.js', '/test-b.js', '/test-c.js'];
  const tests = await sequencer.sort(toTests(testPaths));
  sequencer.cacheResults(tests, {
    testResults: [
      {
        numFailingTests: 0,
        perfStats: {end: 2, runtime: 1, start: 1},
        testFilePath: '/test-a.js',
      },
      {
        numFailingTests: 0,
        perfStats: {end: 0, runtime: 0, start: 0},
        skipped: true,
        testFilePath: '/test-b.js',
      },
      {
        numFailingTests: 1,
        // this is missing `runtime` to test that it is calculated
        perfStats: {end: 4, start: 1},
        testFilePath: '/test-c.js',
      },
      {
        numFailingTests: 1,
        perfStats: {end: 2, runtime: 1, start: 1},
        testFilePath: '/test-x.js',
      },
    ],
  });
  const fileData = JSON.parse(
    fs.writeFileSync.mock.calls[0][1],
  ) as AggregatedResult;
  expect(fileData).toEqual({
    '/test-a.js': [SUCCESS, 1],
    '/test-c.js': [FAIL, 3],
  });
}
```

#### returns failed tests in sorted order

```ts
test('returns failed tests in sorted order', () => {
  fs.readFileSync.mockImplementationOnce(() =>
    JSON.stringify({
      '/test-a.js': [SUCCESS, 5],
      '/test-ab.js': [FAIL, 1],
      '/test-c.js': [FAIL],
    }),
  );
  const testPaths = ['/test-a.js', '/test-ab.js', '/test-c.js'];
  expect(sequencer.allFailedTests(toTests(testPaths))).toEqual([
    {context, duration: undefined, path: '/test-c.js'},
    {context, duration: 1, path: '/test-ab.js'},
  ]);
}
```

#### writes the cache based on the results

```ts
test('writes the cache based on the results', async () => {
  fs.readFileSync.mockImplementationOnce(() =>
    JSON.stringify({
      '/test-a.js': [SUCCESS, 5],
      '/test-b.js': [FAIL, 1],
      '/test-c.js': [FAIL],
    }),
  );

  const testPaths = ['/test-a.js', '/test-b.js', '/test-c.js'];
  const tests = await sequencer.sort(toTests(testPaths));
  sequencer.cacheResults(tests, {
    testResults: [
      {
        numFailingTests: 0,
        perfStats: {end: 2, runtime: 1, start: 1},
        testFilePath: '/test-a.js',
      },
      {
        numFailingTests: 0,
        perfStats: {end: 0, runtime: 0, start: 0},
        skipped: true,
        testFilePath: '/test-b.js',
      },
      {
        numFailingTests: 1,
        perfStats: {end: 4, runtime: 3, start: 1},
        testFilePath: '/test-c.js',
      },
      {
        numFailingTests: 1,
        perfStats: {end: 2, runtime: 1, start: 1},
        testFilePath: '/test-x.js',
      },
    ],
  });
  const fileData = JSON.parse(
    fs.writeFileSync.mock.calls[0][1],
  ) as AggregatedResult;
  expect(fileData).toEqual({
    '/test-a.js': [SUCCESS, 1],
    '/test-b.js': [FAIL, 1],
    '/test-c.js': [FAIL, 3],
  });
}
```

#### works with multiple contexts

```ts
test('works with multiple contexts', async () => {
  fs.readFileSync.mockImplementationOnce(cacheName => {
    if (typeof cacheName !== 'string') {
      throw new TypeError('Must be called with a string');
    }

    return cacheName.startsWith(`${path.sep}cache${path.sep}`)
      ? JSON.stringify({
          '/test-a.js': [SUCCESS, 5],
          '/test-b.js': [FAIL, 1],
        })
      : JSON.stringify({
          '/test-c.js': [FAIL],
        });
  });

  const testPaths = [
    {context, duration: null, path: '/test-a.js'},
    {context, duration: null, path: '/test-b.js'},
    {context: secondContext, duration: null, path: '/test-c.js'},
  ];
  const tests = await sequencer.sort(testPaths);
  sequencer.cacheResults(tests, {
    testResults: [
      {
        numFailingTests: 0,
        perfStats: {end: 2, runtime: 1, start: 1},
        testFilePath: '/test-a.js',
      },
      {
        numFailingTests: 0,
        perfStats: {end: 0, runtime: 1, start: 0},
        skipped: true,
        testFilePath: '/test-b.js',
      },
      {
        numFailingTests: 0,
        perfStats: {end: 4, runtime: 3, start: 1},
        testFilePath: '/test-c.js',
      },
      {
        numFailingTests: 1,
        perfStats: {end: 2, runtime: 1, start: 1},
        testFilePath: '/test-x.js',
      },
    ],
  });
  const fileDataA = JSON.parse(
    fs.writeFileSync.mock.calls[0][1],
  ) as AggregatedResult;
  expect(fileDataA).toEqual({
    '/test-a.js': [SUCCESS, 1],
    '/test-b.js': [FAIL, 1],
  });
  const fileDataB = JSON.parse(
    fs.writeFileSync.mock.calls[1][1],
  ) as AggregatedResult;
  expect(fileDataB).toEqual({
    '/test-c.js': [SUCCESS, 3],
  });
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/testFailingSnapshot.test.js

#### doesnt update or remove snapshots

```ts
it('doesnt update or remove snapshots', () => {
    const dir = path.resolve(__dirname, '../test-failing-snapshot');
    const result = runJest(dir, ['-u']);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).not.toMatch(/snapshots? (written|removed|obsolete)/);

    const snapshot = fs
      .readFileSync(
        path.resolve(dir, './__tests__/__snapshots__/snapshot.test.js.snap'),
      )
      .toString();
    expect(snapshot).toMatchSnapshot();

    const inlineSnapshot = fs
      .readFileSync(path.resolve(dir, './__tests__/inlineSnapshot.test.js'))
      .toString();
    expect(inlineSnapshot).toMatchSnapshot();
  }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/testRetries.test.ts

#### reporter shows more than 1 invocation if test is retried

```ts
it('reporter shows more than 1 invocation if test is retried', () => {
    let jsonResult;

    const reporterConfig = {
      reporters: [
        ['<rootDir>/reporters/RetryReporter.js', {output: outputFilePath}],
      ],
    };

    runJest('test-retries', [
      '--config',
      JSON.stringify(reporterConfig),
      '__tests__/retry.test.js',
    ]);

    const testOutput = fs.readFileSync(outputFilePath, 'utf8');

    try {
      jsonResult = JSON.parse(testOutput);
    } catch (error: any) {
      throw new Error(
        `Can't parse the JSON result from ${outputFileName}, ${error.toString()}`,
      );
    }

    expect(jsonResult.numPassedTests).toBe(0);
    expect(jsonResult.numFailedTests).toBe(1);
    expect(jsonResult.numPendingTests).toBe(0);
    expect(jsonResult.testResults[0].testResults[0].invocations).toBe(4);
  }
```

#### reporter shows 1 invocation if tests are not retried

```ts
it('reporter shows 1 invocation if tests are not retried', () => {
    let jsonResult;

    const reporterConfig = {
      reporters: [
        ['<rootDir>/reporters/RetryReporter.js', {output: outputFilePath}],
      ],
    };

    runJest('test-retries', [
      '--config',
      JSON.stringify(reporterConfig),
      'control.test.js',
    ]);

    const testOutput = fs.readFileSync(outputFilePath, 'utf8');

    try {
      jsonResult = JSON.parse(testOutput);
    } catch (error: any) {
      throw new Error(
        `Can't parse the JSON result from ${outputFileName}, ${error.toString()}`,
      );
    }

    expect(jsonResult.numPassedTests).toBe(0);
    expect(jsonResult.numFailedTests).toBe(1);
    expect(jsonResult.numPendingTests).toBe(0);
    expect(jsonResult.testResults[0].testResults[0].invocations).toBe(1);
  }
```

#### tests are not retried if beforeAll hook failure occurs

```ts
it('tests are not retried if beforeAll hook failure occurs', () => {
    let jsonResult;

    const reporterConfig = {
      reporters: [
        ['<rootDir>/reporters/RetryReporter.js', {output: outputFilePath}],
      ],
    };

    runJest('test-retries', [
      '--config',
      JSON.stringify(reporterConfig),
      'beforeAllFailure.test.js',
    ]);

    const testOutput = fs.readFileSync(outputFilePath, 'utf8');

    try {
      jsonResult = JSON.parse(testOutput);
    } catch (error: any) {
      throw new Error(
        `Can't parse the JSON result from ${outputFileName}, ${error.toString()}`,
      );
    }

    expect(jsonResult.numPassedTests).toBe(0);
    expect(jsonResult.numFailedTests).toBe(1);
    expect(jsonResult.numPendingTests).toBe(0);
    expect(jsonResult.testResults[0].testResults[0].invocations).toBe(1);
  }
```

#### reporter shows more than 1 invocation if test is retried

```ts
it('reporter shows more than 1 invocation if test is retried', () => {
    let jsonResult;

    const reporterConfig = {
      reporters: [
        ['<rootDir>/reporters/RetryReporter.js', {output: outputFilePath}],
      ],
    };

    runJest('test-retries', [
      '--config',
      JSON.stringify(reporterConfig),
      '__tests__/retryConcurrent.test.js',
    ]);

    const testOutput = fs.readFileSync(outputFilePath, 'utf8');

    try {
      jsonResult = JSON.parse(testOutput);
    } catch (error: any) {
      throw new Error(
        `Can't parse the JSON result from ${outputFileName}, ${error.toString()}`,
      );
    }

    expect(jsonResult.numPassedTests).toBe(1);
    expect(jsonResult.numFailedTests).toBe(1);
    expect(jsonResult.numPendingTests).toBe(0);
    expect(jsonResult.testResults[0].testResults[0].invocations).toBe(4);
    expect(jsonResult.testResults[0].testResults[1].invocations).toBe(1);
  }
```

#### reporter shows 1 invocation if tests are not retried

```ts
it('reporter shows 1 invocation if tests are not retried', () => {
    let jsonResult;

    const reporterConfig = {
      reporters: [
        ['<rootDir>/reporters/RetryReporter.js', {output: outputFilePath}],
      ],
    };

    runJest('test-retries', [
      '--config',
      JSON.stringify(reporterConfig),
      'controlConcurrent.test.js',
    ]);

    const testOutput = fs.readFileSync(outputFilePath, 'utf8');

    try {
      jsonResult = JSON.parse(testOutput);
    } catch (error: any) {
      throw new Error(
        `Can't parse the JSON result from ${outputFileName}, ${error.toString()}`,
      );
    }

    expect(jsonResult.numPassedTests).toBe(0);
    expect(jsonResult.numFailedTests).toBe(1);
    expect(jsonResult.numPendingTests).toBe(0);
    expect(jsonResult.testResults[0].testResults[0].invocations).toBe(1);
  }
```

#### tests are not retried if beforeAll hook failure occurs

```ts
it('tests are not retried if beforeAll hook failure occurs', () => {
    let jsonResult;

    const reporterConfig = {
      reporters: [
        ['<rootDir>/reporters/RetryReporter.js', {output: outputFilePath}],
      ],
    };

    runJest('test-retries', [
      '--config',
      JSON.stringify(reporterConfig),
      'beforeAllFailureConcurrent.test.js',
    ]);

    const testOutput = fs.readFileSync(outputFilePath, 'utf8');

    try {
      jsonResult = JSON.parse(testOutput);
    } catch (error: any) {
      throw new Error(
        `Can't parse the JSON result from ${outputFileName}, ${error.toString()}`,
      );
    }

    expect(jsonResult.numPassedTests).toBe(0);
    expect(jsonResult.numFailedTests).toBe(2);
    expect(jsonResult.numPendingTests).toBe(0);
    expect(jsonResult.testResults[0].testResults[0].invocations).toBe(1);
    expect(jsonResult.testResults[0].testResults[1].invocations).toBe(1);
  }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/test-retries/__tests__/e2e.test.js

#### retries

```ts
it('retries', () => {
  const tries = Number.parseInt(fs.readFileSync(countPath, 'utf8'), 10);
  fs.writeFileSync(countPath, `${tries + 1}`, 'utf8');
  expect(tries).toBe(3);
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/global-setup-node-modules/__tests__/test.js

#### should exist setup file

```ts
test('should exist setup file', () => {
  const files = fs.readdirSync(DIR);
  expect(files).toHaveLength(1);
  const setup = fs.readFileSync(path.join(DIR, files[0]), 'utf8');
  expect(setup).toBe('hello world!');
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/global-setup/project-2/setup2.test.js

#### should exist setup file

```ts
test('should exist setup file', () => {
  const files = fs.readdirSync(DIR);
  expect(files).toHaveLength(1);
  const setup = fs.readFileSync(path.join(DIR, files[0]), 'utf8');
  expect(setup).toBe('setup');
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/global-setup/project-1/setup1.test.js

#### should exist setup file

```ts
test('should exist setup file', () => {
  const files = fs.readdirSync(DIR);
  expect(files).toHaveLength(1);
  const setup = fs.readFileSync(path.join(DIR, files[0]), 'utf8');
  expect(setup).toBe('setup');
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/global-setup/__tests__/setup3.test.js

#### should exist setup file

```ts
test('should exist setup file', () => {
  const files = fs.readdirSync(DIR);
  expect(files).toHaveLength(1);
  const setup = fs.readFileSync(path.join(DIR, files[0]), 'utf8');
  expect(setup).toBe('setup');
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/global-setup/__tests__/setup1.test.js

#### should exist setup file

```ts
test('should exist setup file', () => {
  const files = fs.readdirSync(DIR);
  expect(files).toHaveLength(1);
  const setup = fs.readFileSync(path.join(DIR, files[0]), 'utf8');
  expect(setup).toBe('setup');
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/global-setup/__tests__/setup2.test.js

#### should exist setup file

```ts
test('should exist setup file', () => {
  const files = fs.readdirSync(DIR);
  expect(files).toHaveLength(1);
  const setup = fs.readFileSync(path.join(DIR, files[0]), 'utf8');
  expect(setup).toBe('setup');
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/global-setup-esm/__tests__/test.js

#### should exist setup file

```ts
test('should exist setup file', () => {
  const files = fs.readdirSync(DIR);
  expect(files).toHaveLength(1);
  const setup = fs.readFileSync(path.join(DIR, files[0]), 'utf8');
  expect(setup).toBe('setup');
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/global-setup-custom-transform/__tests__/test.js

#### should exist setup file

```ts
test('should exist setup file', () => {
  const files = fs.readdirSync(DIR);
  expect(files).toHaveLength(1);
  const setup = fs.readFileSync(path.join(DIR, files[0]), 'utf8');
  expect(setup).toBe('setup');
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/vmscript-coverage/__tests__/extract-coverage.test.js

#### extract coverage

```ts
test('extract coverage', () => {
  const content = fs.readFileSync(filePath, {encoding: 'utf8'});

  const case1 = vm.runInNewContext(
    content,
    {
      inputObject: {
        number: 0,
      },
    },
    {
      filename: filePath,
    },
  );

  const case2 = vm.runInNewContext(
    content,
    {
      inputObject: {
        number: 7,
      },
    },
    {
      filename: filePath,
    },
  );

  expect(case1).toBe(false);
  expect(case2).toBe(true);
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/create-jest/src/__tests__/init.test.ts

#### should return the default configuration (an empty config)

```ts
it('should return the default configuration (an empty config)', async () => {
        jest.mocked(prompts).mockResolvedValueOnce({});

        await runCreate(resolveFromFixture('only-package-json'));

        const writtenJestConfigFilename =
          jest.mocked(writeFileSync).mock.calls[0][0];
        const writtenJestConfig = jest.mocked(writeFileSync).mock.calls[0][1];

        expect(path.basename(writtenJestConfigFilename as string)).toBe(
          'jest.config.js',
        );
        expect(
          (writtenJestConfig as string).replace(
            /\/\/ cacheDirectory: .*,/,
            '// cacheDirectory: "/tmp/jest",',
          ),
        ).toMatchSnapshot();

        const evaluatedConfig = eval(writtenJestConfig as string) as Record<
          string,
          unknown
        >;

        expect(evaluatedConfig).toEqual({});
      }
```

#### should generate empty config with mjs extension

```ts
it('should generate empty config with mjs extension', async () => {
        jest.mocked(prompts).mockResolvedValueOnce({});

        await runCreate(resolveFromFixture('type-module'));

        const writtenJestConfigFilename =
          jest.mocked(writeFileSync).mock.calls[0][0];
        const writtenJestConfig = jest.mocked(writeFileSync).mock.calls[0][1];

        expect(path.basename(writtenJestConfigFilename as string)).toBe(
          'jest.config.mjs',
        );
        expect(
          (writtenJestConfig as string).replace(
            /\/\/ cacheDirectory: .*,/,
            '// cacheDirectory: "/tmp/jest",',
          ),
        ).toMatchSnapshot();
      }
```

#### should create configuration for {clearMocks: true}

```ts
it('should create configuration for {clearMocks: true}', async () => {
        jest.mocked(prompts).mockResolvedValueOnce({clearMocks: true});

        await runCreate(resolveFromFixture('only-package-json'));

        const writtenJestConfig = jest.mocked(writeFileSync).mock.calls[0][1];
        const evaluatedConfig = eval(writtenJestConfig as string) as Record<
          string,
          unknown
        >;

        expect(evaluatedConfig).toEqual({clearMocks: true});
      }
```

#### should create configuration for {coverage: true}

```ts
it('should create configuration for {coverage: true}', async () => {
        jest.mocked(prompts).mockResolvedValueOnce({coverage: true});

        await runCreate(resolveFromFixture('only-package-json'));

        const writtenJestConfig = jest.mocked(writeFileSync).mock.calls[0][1];
        const evaluatedConfig = eval(writtenJestConfig as string) as Record<
          string,
          unknown
        >;

        expect(evaluatedConfig).toEqual({
          collectCoverage: true,
          coverageDirectory: 'coverage',
        });
      }
```

#### should create configuration for {coverageProvider: "babel"}

```ts
it('should create configuration for {coverageProvider: "babel"}', async () => {
        jest.mocked(prompts).mockResolvedValueOnce({coverageProvider: 'babel'});

        await runCreate(resolveFromFixture('only-package-json'));

        const writtenJestConfig = jest.mocked(writeFileSync).mock.calls[0][1];
        const evaluatedConfig = eval(writtenJestConfig as string) as Record<
          string,
          unknown
        >;
        // should modify when the default coverageProvider will be changed to "v8"
        expect(evaluatedConfig).toEqual({});
      }
```

#### should create configuration for {coverageProvider: "v8"}

```ts
it('should create configuration for {coverageProvider: "v8"}', async () => {
        jest.mocked(prompts).mockResolvedValueOnce({coverageProvider: 'v8'});

        await runCreate(resolveFromFixture('only-package-json'));

        const writtenJestConfig = jest.mocked(writeFileSync).mock.calls[0][1];
        const evaluatedConfig = eval(writtenJestConfig as string) as Record<
          string,
          unknown
        >;
        // should modify when the default coverageProvider will be changed to "v8"
        expect(evaluatedConfig).toEqual({coverageProvider: 'v8'});
      }
```

#### should create configuration for {environment: "jsdom"}

```ts
it('should create configuration for {environment: "jsdom"}', async () => {
        jest.mocked(prompts).mockResolvedValueOnce({environment: 'jsdom'});

        await runCreate(resolveFromFixture('only-package-json'));

        const writtenJestConfig = jest.mocked(writeFileSync).mock.calls[0][1];
        const evaluatedConfig = eval(writtenJestConfig as string) as Record<
          string,
          unknown
        >;
        expect(evaluatedConfig).toEqual({testEnvironment: 'jsdom'});
      }
```

#### should create configuration for {environment: "node"}

```ts
it('should create configuration for {environment: "node"}', async () => {
        jest.mocked(prompts).mockResolvedValueOnce({environment: 'node'});

        await runCreate(resolveFromFixture('only-package-json'));

        const writtenJestConfig = jest.mocked(writeFileSync).mock.calls[0][1];
        const evaluatedConfig = eval(writtenJestConfig as string) as Record<
          string,
          unknown
        >;
        expect(evaluatedConfig).toEqual({});
      }
```

#### should create package.json with configured test command when {scripts: true}

```ts
it('should create package.json with configured test command when {scripts: true}', async () => {
        jest.mocked(prompts).mockResolvedValueOnce({scripts: true});

        await runCreate(resolveFromFixture('only-package-json'));

        const writtenPackageJson = jest.mocked(writeFileSync).mock.calls[0][1];
        const parsedPackageJson = JSON.parse(writtenPackageJson as string) as {
          scripts: {test: string};
        };

        expect(writtenPackageJson).toMatchSnapshot();
        expect(parsedPackageJson.scripts.test).toBe('jest');
      }
```

#### user answered with "Yes"

```ts
it('user answered with "Yes"', async () => {
          jest
            .mocked(prompts)
            .mockResolvedValueOnce({continue: true})
            .mockResolvedValueOnce({});

          await runCreate(
            resolveFromFixture(`has-jest-config-file-${extension}`),
          );

          expect(jest.mocked(prompts).mock.calls[0][0]).toMatchSnapshot();

          const jestConfigFileName =
            jest.mocked(writeFileSync).mock.calls[0][0];
          const writtenJestConfig = jest.mocked(writeFileSync).mock.calls[0][1];

          expect(jestConfigFileName).toBe(`jest.config.${extension}`);
          expect(writtenJestConfig).toBeDefined();
        }
```

#### user answered with "Yes"

```ts
it('user answered with "Yes"', async () => {
        jest.mocked(prompts).mockResolvedValueOnce({useTypescript: true});

        await runCreate(resolveFromFixture('test-generated-jest-config-ts'));

        expect(jest.mocked(prompts).mock.calls[0][0]).toMatchSnapshot();

        const jestConfigFileName = jest.mocked(writeFileSync).mock.calls[0][0];
        const writtenJestConfig = jest.mocked(writeFileSync).mock.calls[0][1];

        expect(path.basename(jestConfigFileName as string)).toBe(
          'jest.config.ts',
        );
        expect(
          (writtenJestConfig as string).replace(
            /\/\/ cacheDirectory: .*,/,
            '// cacheDirectory: "/tmp/jest",',
          ),
        ).toMatchSnapshot();
      }
```

#### user answered with "No"

```ts
it('user answered with "No"', async () => {
        jest.mocked(prompts).mockResolvedValueOnce({useTypescript: false});

        await runCreate(resolveFromFixture('test-generated-jest-config-ts'));

        const jestConfigFileName = jest.mocked(writeFileSync).mock.calls[0][0];

        expect(path.basename(jestConfigFileName as string)).not.toBe(
          'jest.config.ts',
        );
      }
```

#### should ask the user whether to override config or not

```ts
it('should ask the user whether to override config or not', async () => {
      jest
        .mocked(prompts)
        .mockResolvedValueOnce({continue: true})
        .mockResolvedValueOnce({});

      await runCreate(resolveFromFixture('has-jest-config-in-package-json'));

      expect(jest.mocked(prompts).mock.calls[0][0]).toMatchSnapshot();

      const writtenJestConfig = jest.mocked(writeFileSync).mock.calls[0][1];

      expect(writtenJestConfig).toBeDefined();
    }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/snapshot.test.ts

#### works with escaped characters

```ts
it('works with escaped characters', () => {
    // Write the first snapshot
    let result = runJest('snapshot-escape', [
      '-w=1',
      '--ci=false',
      'snapshot.test.js',
    ]);
    let stderr = result.stderr;

    expect(stderr).toMatch('1 snapshot written');
    expect(result.exitCode).toBe(0);
    expect(extractSummary(stderr).summary).toMatchSnapshot();

    // Write the second snapshot
    const testData =
      "test('escape strings two', () => expect('two: \\'\"')." +
      'toMatchSnapshot());';
    const newTestData = initialTestData + testData;
    fs.writeFileSync(snapshotEscapeTestFile, newTestData, 'utf8');

    result = runJest('snapshot-escape', [
      '-w=1',
      '--ci=false',
      '--updateSnapshot',
      'snapshot.test.js',
    ]);
    stderr = result.stderr;

    expect(stderr).toMatch('1 snapshot written');
    expect(extractSummary(stderr).summary).toMatchSnapshot();
    expect(result.exitCode).toBe(0);

    // Now let's check again if everything still passes.
    // If this test doesn't pass, some snapshot data was not properly escaped.
    result = runJest('snapshot-escape', [
      '-w=1',
      '--ci=false',
      'snapshot.test.js',
    ]);
    stderr = result.stderr;

    expect(stderr).not.toMatch('Snapshot Summary');
    expect(extractSummary(stderr).summary).toMatchSnapshot();
    expect(result.exitCode).toBe(0);
  }
```

#### deletes the snapshot if the test suite has been removed

```ts
it('deletes the snapshot if the test suite has been removed', () => {
      const firstRun = runWithJson('snapshot', ['-w=1', '--ci=false']);
      fs.unlinkSync(copyOfTestPath);

      const content = require(snapshotOfCopy);
      expect(content).toBeDefined();
      const secondRun = runWithJson('snapshot', ['-w=1', '--ci=false', '-u']);

      expect(firstRun.json.numTotalTests).toBe(9);
      expect(secondRun.json.numTotalTests).toBe(5);
      expect(fileExists(snapshotOfCopy)).toBe(false);

      expect(firstRun.stderr).toMatch('9 snapshots written from 3 test suites');
      expect(secondRun.stderr).toMatch(
        '1 snapshot file removed from 1 test suite',
      );
      expect(extractSummary(firstRun.stderr).summary).toMatchSnapshot();
      expect(extractSummary(secondRun.stderr).summary).toMatchSnapshot();
    }
```

#### deletes a snapshot when a test does removes all the snapshots

```ts
it('deletes a snapshot when a test does removes all the snapshots', () => {
      const firstRun = runWithJson('snapshot', ['-w=1', '--ci=false']);

      fs.writeFileSync(copyOfTestPath, emptyTest);
      const secondRun = runWithJson('snapshot', ['-w=1', '--ci=false', '-u']);
      fs.unlinkSync(copyOfTestPath);

      expect(firstRun.json.numTotalTests).toBe(9);
      expect(secondRun.json.numTotalTests).toBe(6);

      expect(fileExists(snapshotOfCopy)).toBe(false);
      expect(firstRun.stderr).toMatch('9 snapshots written from 3 test suites');
      expect(secondRun.stderr).toMatch(
        '1 snapshot file removed from 1 test suite',
      );
      expect(extractSummary(firstRun.stderr).summary).toMatchSnapshot();
      expect(extractSummary(secondRun.stderr).summary).toMatchSnapshot();
    }
```

#### updates the snapshot when a test removes some snapshots

```ts
it('updates the snapshot when a test removes some snapshots', () => {
      const firstRun = runWithJson('snapshot', ['-w=1', '--ci=false']);
      fs.unlinkSync(copyOfTestPath);
      const beforeRemovingSnapshot = getSnapshotOfCopy();

      fs.writeFileSync(
        copyOfTestPath,
        originalTestContent.replace(
          '.toMatchSnapshot()',
          '.not.toBe(undefined)',
        ),
      );
      const secondRun = runWithJson('snapshot', ['-w=1', '--ci=false', '-u']);
      fs.unlinkSync(copyOfTestPath);

      expect(firstRun.json.numTotalTests).toBe(9);
      expect(secondRun.json.numTotalTests).toBe(9);
      expect(fileExists(snapshotOfCopy)).toBe(true);
      const afterRemovingSnapshot = getSnapshotOfCopy();

      expect(Object.keys(beforeRemovingSnapshot).length - 1).toBe(
        Object.keys(afterRemovingSnapshot).length,
      );
      const keyToCheck =
        'snapshot works with plain objects and the ' +
        'title has `escape` characters 2';
      expect(beforeRemovingSnapshot[keyToCheck]).toBeDefined();
      expect(afterRemovingSnapshot[keyToCheck]).toBeUndefined();

      expect(extractSummary(firstRun.stderr).summary).toMatchSnapshot();
      expect(firstRun.stderr).toMatch('9 snapshots written from 3 test suites');

      expect(extractSummary(secondRun.stderr).summary).toMatchSnapshot();
      expect(secondRun.stderr).toMatch('1 snapshot updated from 1 test suite');
      expect(secondRun.stderr).toMatch('1 snapshot removed from 1 test suite');
    }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-core/src/__tests__/watchFileChanges.test.ts

#### should correct require new files without legacy cache

```ts
it('should correct require new files without legacy cache', async () => {
    fs.writeFileSync(
      fileTargetPath2,
      `
        require('./lost-file.js');
        describe('Fake test', () => {
            it('Hey', () => {

            });
        });
      `,
    );

    const config = (
      await normalize(
        {
          cache: false,
          cacheDirectory,
          coverageReporters: [],
          maxConcurrency: 1,
          maxWorkers: 1,
          moduleDirectories: ['node_modules'],
          onlyChanged: false,
          reporters: [],
          rootDir: testDirectory,
          silent: true,
          testRegex: ['watch-test-fake\\.test\\.js$'],
          watch: false,
          watchman: false,
        },
        {} as unknown,
      )
    ).options;

    hasteMapInstance = await Runtime.createHasteMap(config, {
      maxWorkers: 1,
      resetCache: true,
      watch: true,
      watchman: false,
    });

    const realContext = await hasteMapInstance.build().then(hasteMap => ({
      config,
      hasteFS: hasteMap.hasteFS,
      moduleMap: hasteMap.moduleMap,
      resolver: Runtime.createResolver(config, hasteMap.moduleMap),
    }));

    const hook = new JestHook();
    const firstErrorPromise = new Promise(resolve => {
      hook.getSubscriber().onTestRunComplete(resolve);
    });
    await watch(
      {
        ...config,
        watchPlugins: [],
      },
      [realContext],
      pipe,
      [hasteMapInstance],
      stdin,
      hook,
    );

    await firstErrorPromise;

    const successPromise = new Promise<AggregatedResult>(resolve => {
      hook.getSubscriber().onTestRunComplete(resolve);
    });

    // Create lost file
    fs.writeFileSync(
      fileTargetPath,
      `
        describe('Fake group', () => {
            it('Fake 1', () => {});
            it('Fake 2', () => {});
            it('Fake 3', () => {});
        });
      `,
    );

    const resultSuccessReport = await successPromise;

    expect(resultSuccessReport).toMatchObject({
      numFailedTestSuites: 0,
      numFailedTests: 0,
      numPassedTests: 4,
      numRuntimeErrorTestSuites: 0,
      success: true,
      wasInterrupted: false,
    });
    expect(resultSuccessReport.testResults[0]).toMatchObject({
      failureMessage: null,
    });

    const errorPromise = new Promise<AggregatedResult>(resolve => {
      hook.getSubscriber().onTestRunComplete(resolve);
    });

    // Remove again to ensure about no legacy cache
    fs.unlinkSync(fileTargetPath);

    const resultErrorReport = await errorPromise;

    // After remove file we have to fail tests
    expect(resultErrorReport).toMatchObject({
      numFailedTestSuites: 1,
      numPassedTests: 0,
      numRuntimeErrorTestSuites: 1,
      success: false,
      wasInterrupted: false,
    });
  }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/clearFSAndTransformCache.test.ts

#### value is 1 after file is changed

```ts
test('value is 1 after file is changed', () => {
  fs.writeFileSync(absoluteTestHelperFile, 'module.exports = 2;');
  const value = require('./testHelper');
  expect(value).toBe(1);
}
```

#### clear FS and transform cache

```ts
test('clear FS and transform cache', () => {
  writeFiles(dir, {
    'package.json': JSON.stringify({jest: {testEnvironment: 'node'}}),
    'test.js': testFileContent,
    'testHelper.js': 'module.exports = 1;',
  });
  const {exitCode} = runJest(dir);
  expect(exitCode).toBe(0);
}
```

