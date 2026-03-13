# External tests for markdown-generator.js

**Arquivo:** `/workspaces/ctest/src/lib/markdown-generator.js`

## ./horsebox

Nenhum arquivo de teste encontrado pelo Horsebox para esta lib.

## ./test-extractor

Nenhum arquivo de teste encontrado pelo Horsebox para esta lib.

## ./utils

**Consultas usadas no Horsebox:** `uniq`, `./utils uniq`, `utils uniq`, `normalizeLibraryNames`, `./utils normalizeLibraryNames`, `utils normalizeLibraryNames`, `isTestFile`, `./utils isTestFile`, `utils isTestFile`

**Arquivos de teste encontrados:** 33

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/examples/automatic-mocks/__tests__/automock.test.js

#### if utils are mocked

```ts
test('if utils are mocked', () => {
  expect(utils.authorize.mock).toBeTruthy();
  expect(utils.isAuthorized.mock).toBeTruthy();
}
```

#### mocked implementation

```ts
test('mocked implementation', () => {
  utils.authorize.mockReturnValue('mocked_token');
  utils.isAuthorized.mockReturnValue(true);

  expect(utils.authorize()).toBe('mocked_token');
  expect(utils.isAuthorized('not_wizard')).toBeTruthy();
}
```

## fs

**Consultas usadas no Horsebox:** `existsSync`, `fs existsSync`, `writeFileSync`, `fs writeFileSync`

**Arquivos de teste encontrados:** 171

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

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/test-retries/__tests__/e2e.test.js

#### retries

```ts
it('retries', () => {
  const tries = Number.parseInt(fs.readFileSync(countPath, 'utf8'), 10);
  fs.writeFileSync(countPath, `${tries + 1}`, 'utf8');
  expect(tries).toBe(3);
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

## path

**Consultas usadas no Horsebox:** `basename`, `path basename`

**Arquivos de teste encontrados:** 58

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/packages/jest-reporters/src/__tests__/utils.test.ts

#### trims dirname

```ts
it('trims dirname', () => {
    const pad = 5;
    const basename = '1234.js';
    const dirname = '1234567890/1234567890';
    const columns = 25;
    const result = trimAndFormatPath(
      pad,
      makeProjectConfig({cwd: '', rootDir: ''}),
      path.join(dirname, basename),
      columns,
    );

    expect(result).toMatchSnapshot();
    expect(stripAnsi(result)).toHaveLength(20);
  }
```

#### trims dirname (longer line width)

```ts
it('trims dirname (longer line width)', () => {
    const pad = 5;
    const basename = '1234.js';
    const dirname = '1234567890/1234567890';
    const columns = 30;
    const result = trimAndFormatPath(
      pad,
      makeProjectConfig({cwd: '', rootDir: ''}),
      path.join(dirname, basename),
      columns,
    );

    expect(result).toMatchSnapshot();
    expect(stripAnsi(result)).toHaveLength(25);
  }
```

#### trims dirname and basename

```ts
it('trims dirname and basename', () => {
    const pad = 5;
    const basename = '1234.js';
    const dirname = '1234567890/1234567890';
    const columns = 15;
    const result = trimAndFormatPath(
      pad,
      makeProjectConfig({cwd: '', rootDir: ''}),
      path.join(dirname, basename),
      columns,
    );

    expect(result).toMatchSnapshot();
    expect(stripAnsi(result)).toHaveLength(10);
  }
```

#### does not trim anything

```ts
it('does not trim anything', () => {
    const pad = 5;
    const basename = '1234.js';
    const dirname = '1234567890/1234567890';
    const columns = 50;
    const totalLength = basename.length + path.sep.length + dirname.length;
    const result = trimAndFormatPath(
      pad,
      makeProjectConfig({cwd: '', rootDir: ''}),
      path.join(dirname, basename),
      columns,
    );

    expect(result).toMatchSnapshot();
    expect(stripAnsi(result)).toHaveLength(totalLength);
  }
```

#### split at the path.sep index

```ts
test('split at the path.sep index', () => {
    const pad = 5;
    const basename = '1234.js';
    const dirname = '1234567890';
    const columns = 16;
    const result = trimAndFormatPath(
      pad,
      makeProjectConfig({cwd: '', rootDir: ''}),
      path.join(dirname, basename),
      columns,
    );

    expect(result).toMatchSnapshot();
    expect(stripAnsi(result)).toHaveLength(columns - pad);
  }
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/shard.test.ts

#### --shard=1/1

```ts
test('--shard=1/1', () => {
  const result = runJest('shard', ['--shard=1/1', '--listTests']);

  const paths = result.stdout
    .split('\n')
    .filter(Boolean)
    .map(file => path.basename(file))
    .sort();

  expect(paths).toEqual(['1.test.js', '2.test.js', '3.test.js']);
}
```

#### --shard=1/2

```ts
test('--shard=1/2', () => {
  const result = runJest('shard', ['--shard=1/2', '--listTests']);

  const paths = result.stdout
    .split('\n')
    .filter(Boolean)
    .map(file => path.basename(file))
    .sort();

  expect(paths).toEqual(['1.test.js', '3.test.js']);
}
```

#### --shard=2/2

```ts
test('--shard=2/2', () => {
  const result = runJest('shard', ['--shard=2/2', '--listTests']);

  const paths = result.stdout
    .split('\n')
    .filter(Boolean)
    .map(file => path.basename(file));

  expect(paths).toEqual(['2.test.js']);
}
```

#### --shard=4/4

```ts
test('--shard=4/4', () => {
  const result = runJest('shard', ['--shard=4/4', '--listTests']);

  const paths = result.stdout
    .split('\n')
    .filter(Boolean)
    .map(file => path.basename(file));

  // project only has 3 files
  // shards > 3 are empty
  expect(paths).toEqual([]);
}
```

#### --shard=1/2 custom sharding test sequencer

```ts
test('--shard=1/2 custom sharding test sequencer', () => {
  const result = runJest('shard', [
    '--shard=1/2',
    '--listTests',
    '--testSequencer=./sharding-test-sequencer.js',
  ]);

  const paths = result.stdout
    .split('\n')
    .filter(Boolean)
    .map(file => path.basename(file));

  expect(paths).toEqual(['3.test.js']);
}
```

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/jestChangedFiles.test.ts

#### gets git SCM roots and dedupes them

```ts
test('gets git SCM roots and dedupes them', async () => {
  writeFiles(DIR, {
    'first-repo/file1.txt': 'file1',
    'first-repo/nested-dir/file2.txt': 'file2',
    'first-repo/nested-dir/second-nested-dir/file3.txt': 'file3',
    'second-repo/file1.txt': 'file1',
    'second-repo/nested-dir/file2.txt': 'file2',
    'second-repo/nested-dir/second-nested-dir/file3.txt': 'file3',
  });

  gitInit(path.resolve(DIR, 'first-repo'));
  gitInit(path.resolve(DIR, 'second-repo'));

  const roots = [
    '',
    'first-repo/nested-dir',
    'first-repo/nested-dir/second-nested-dir',
    'second-repo/nested-dir',
    'second-repo/nested-dir/second-nested-dir',
  ].map(filename => path.resolve(DIR, filename));

  const repos = await findRepos(roots);
  expect(repos.hg.size).toBe(0);
  const gitRepos = [...repos.git];

  // it's not possible to match the exact path because it will resolve
  // differently on different platforms.
  // NOTE: This test can break if you have a .git repo initialized inside your
  // os tmp directory.
  expect(gitRepos).toHaveLength(2);
  expect(slash(gitRepos[0])).toMatch(
    /\/jest-changed-files-test-dir\/first-repo\/?$/,
  );
  expect(slash(gitRepos[1])).toMatch(
    /\/jest-changed-files-test-dir\/second-repo\/?$/,
  );
});

testIfSlAndHg(
  'gets mixed git, hg, and sl SCM roots and dedupes them',
  async () => {
    writeFiles(DIR, {
      'first-repo/file1.txt': 'file1',
      'first-repo/nested-dir/file2.txt': 'file2',
      'first-repo/nested-dir/second-nested-dir/file3.txt': 'file3',
      'second-repo/file1.txt': 'file1',
      'second-repo/nested-dir/file2.txt': 'file2',
      'second-repo/nested-dir/second-nested-dir/file3.txt': 'file3',
      'third-repo/file1.txt': 'file1',
      'third-repo/nested-dir/file2.txt': 'file2',
      'third-repo/nested-dir/second-nested-dir/file3.txt': 'file3',
    });

    gitInit(path.resolve(DIR, 'first-repo'));
    run(`${HG} init`, path.resolve(DIR, 'second-repo'));
    run(`${SL} init --git`, path.resolve(DIR, 'third-repo'));

    const roots = [
      '',
      'first-repo/nested-dir',
      'first-repo/nested-dir/second-nested-dir',
      'second-repo/nested-dir',
      'second-repo/nested-dir/second-nested-dir',
      'third-repo/nested-dir',
      'third-repo/nested-dir/second-nested-dir',
    ].map(filename => path.resolve(DIR, filename));

    const repos = await findRepos(roots);
    const hgRepos = [...repos.hg];
    const gitRepos = [...repos.git];
    const slRepos = [...repos.sl];

    // NOTE: This test can break if you have a .git  or .hg repo initialized
    // inside your os tmp directory.
    expect(gitRepos).toHaveLength(1);
    expect(hgRepos).toHaveLength(1);
    expect(slRepos).toHaveLength(1);
    expect(slash(gitRepos[0])).toMatch(
      /\/jest-changed-files-test-dir\/first-repo\/?$/,
    );
    expect(slash(hgRepos[0])).toMatch(
      /\/jest-changed-files-test-dir\/second-repo\/?$/,
    );
    expect(slash(slRepos[0])).toMatch(
      /\/jest-changed-files-test-dir\/third-repo\/?$/,
    );
  },
);

test('gets changed files for git', async () => {
  writeFiles(DIR, {
    'file1.txt': 'file1',
    'nested-dir/file2.txt': 'file2',
    'nested-dir/second-nested-dir/file3.txt': 'file3',
  });

  gitInit(DIR);

  const roots = [
    // same first root name with existing branch name makes pitfall that
    // causes "ambiguous argument" git error.
    'nested-dir',
    'nested-dir/second-nested-dir',
    '',
  ].map(filename => path.resolve(DIR, filename));

  let {changedFiles: files} = await getChangedFilesForRoots(roots, {});
  expect([...files].map(filePath => path.basename(filePath)).sort()).toEqual([
    'file1.txt',
    'file2.txt',
    'file3.txt',
  ]);

  run(`${GIT} add .`, DIR);

  // Uses multiple `-m` to make the commit message have multiple
  // paragraphs. This is done to ensure that `changedFiles` only
  // returns files and not parts of commit messages.
  run(`${GIT} commit --no-gpg-sign -m "test" -m "extra-line"`, DIR);

  gitCreateBranch('nested-dir', DIR);

  ({changedFiles: files} = await getChangedFilesForRoots(roots, {}));
  expect([...files]).toEqual([]);

  ({changedFiles: files} = await getChangedFilesForRoots(roots, {
    lastCommit: true,
  }));
  expect([...files].map(filePath => path.basename(filePath)).sort()).toEqual([
    'file1.txt',
    'file2.txt',
    'file3.txt',
  ]);

  writeFiles(DIR, {
    'file1.txt': 'modified file1',
  });

  ({changedFiles: files} = await getChangedFilesForRoots(roots, {}));
  expect([...files].map(filePath => path.basename(filePath)).sort()).toEqual([
    'file1.txt',
  ]);

  run(`${GIT} add -A`, DIR);

  // staged files should be included
  ({changedFiles: files} = await getChangedFilesForRoots(roots, {}));
  expect([...files].map(filePath => path.basename(filePath)).sort()).toEqual([
    'file1.txt',
  ]);

  run(`${GIT} commit --no-gpg-sign -am "test2"`, DIR);

  writeFiles(DIR, {
    'file4.txt': 'file4',
  });

  ({changedFiles: files} = await getChangedFilesForRoots(roots, {
    withAncestor: true,
  }));
  // Returns files from current uncommitted state + the last commit
  expect([...files].map(filePath => path.basename(filePath)).sort()).toEqual([
    'file1.txt',
    'file4.txt',
  ]);

  run(`${GIT} add file4.txt`, DIR);
  run(`${GIT} commit --no-gpg-sign -m "test3"`, DIR);

  ({changedFiles: files} = await getChangedFilesForRoots(roots, {
    changedSince: 'HEAD^^',
  }));
  // Returns files from the last 2 commits
  expect([...files].map(filePath => path.basename(filePath)).sort()).toEqual([
    'file1.txt',
    'file4.txt',
  ]);

  run(`${GIT} checkout HEAD^^ -b feature-branch`, DIR);

  writeFiles(DIR, {
    'file5.txt': 'file5',
  });
  run(`${GIT} add file5.txt`, DIR);
  run(`${GIT} commit --no-gpg-sign -m "test5"`, DIR);

  ({changedFiles: files} = await getChangedFilesForRoots(roots, {
    changedSince: mainBranchName,
  }));
  // Returns files from this branch but not ones that only exist on mainBranchName
  expect([...files].map(filePath => path.basename(filePath)).sort()).toEqual([
    'file5.txt',
  ]);
});

test('monitors only root paths for git', async () => {
  writeFiles(DIR, {
    'file1.txt': 'file1',
    'nested-dir/file2.txt': 'file2',
    'nested-dir/second-nested-dir/file3.txt': 'file3',
  });

  gitInit(DIR);

  const roots = [path.resolve(DIR, 'nested-dir')];

  const {changedFiles: files} = await getChangedFilesForRoots(roots, {});
  expect([...files].map(filePath => path.basename(filePath)).sort()).toEqual([
    'file2.txt',
    'file3.txt',
  ]);
});

it('does not find changes in files with no diff, for git', async () => {
  const roots = [path.resolve(DIR)];

  // create an empty file, commit it to "mainBranchName"
  writeFiles(DIR, {'file1.txt': ''});
  gitInit(DIR);
  run(`${GIT} add file1.txt`, DIR);
  run(`${GIT} commit --no-gpg-sign -m "initial"`, DIR);

  // check out a new branch, jestChangedFilesSpecBase, to use later in diff
  run(`${GIT} checkout -b jestChangedFilesSpecBase`, DIR);

  // check out second branch, jestChangedFilesSpecMod, modify file & commit
  run(`${GIT} checkout -b jestChangedFilesSpecMod`, DIR);
  writeFiles(DIR, {
    'file1.txt': 'modified file1',
  });
  run(`${GIT} add file1.txt`, DIR);
  run(`${GIT} commit --no-gpg-sign -m "modified"`, DIR);

  // still on jestChangedFilesSpecMod branch, "revert" back to empty file and commit
  writeFiles(DIR, {
    'file1.txt': '',
  });
  run(`${GIT} add file1.txt`, DIR);
  run(`${GIT} commit --no-gpg-sign -m "removemod"`, DIR);

  // check that passing in no changedSince arg doesn't return any unstaged / other changes
  const {changedFiles: files} = await getChangedFilesForRoots(roots, {});
  expect([...files]).toEqual([]);

  // check that in diff from `jestChangedFilesSpecBase` branch, no changed files are reported
  const {changedFiles: filesExplicitBaseBranch} = await getChangedFilesForRoots(
    roots,
    {
      changedSince: 'jestChangedFilesSpecBase',
    },
  );
  expect([...filesExplicitBaseBranch]).toEqual([]);
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

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/__tests__/testInRoot.test.ts

#### runs tests in only test.js and spec.js

```ts
it('runs tests in only test.js and spec.js', () => {
  const {json: result} = runWithJson('test-in-root');

  expect(result.success).toBe(true);
  expect(result.numTotalTests).toBe(2);

  const testNames = result.testResults
    .map(res => res.name)
    .map(name => path.basename(name))
    .sort();

  expect(testNames).toHaveLength(2);
  expect(testNames[0]).toBe('spec.js');
  expect(testNames[1]).toBe('test.js');
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

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/e2e/node-path/__tests__/nodePath.test.js

#### can require by absolute path

```ts
test('can require by absolute path', () => {
  expect(require('path/file.js')).toBe(42);
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

