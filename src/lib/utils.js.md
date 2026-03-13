# External tests for utils.js

**Arquivo:** `/workspaces/ctest/src/lib/utils.js`

## fs

**Consultas usadas no Horsebox:** `readFileSync`, `fs readFileSync`

**Arquivos de teste encontrados:** 137

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

