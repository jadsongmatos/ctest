# External tests for index.js

**Arquivo:** `index.js`

## Checklist

- [ ] child_process
- [ ] ./lib/sbom
- [ ] ./lib/repo-downloader
- [ ] ./lib/source-analyzer
- [ ] ./lib/horsebox
- [ ] ./lib/markdown-generator
- [ ] path
- [ ] fs
- [ ] os

## child_process

**Consultas usadas no Horsebox:** `execSync`, `child_process execSync`

**Arquivos de teste encontrados:** 71

### src_modules/cc6b13a61c-@babel_parser/test/runtime-integration/node.cjs

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

## ./lib/sbom

**Consultas usadas no Horsebox:** `generateSBOM`, `./lib/sbom generateSBOM`, `sbom generateSBOM`, `readSBOM`, `./lib/sbom readSBOM`, `sbom readSBOM`, `extractComponents`, `./lib/sbom extractComponents`, `sbom extractComponents`

**Arquivos de teste encontrados:** 141

Horsebox encontrou arquivos candidatos, mas nenhum bloco `test()` / `it()` relevante foi extraído.

## ./lib/repo-downloader

Nenhum arquivo de teste encontrado pelo Horsebox para esta lib.

## ./lib/source-analyzer

Nenhum arquivo de teste encontrado pelo Horsebox para esta lib.

## ./lib/horsebox

Nenhum arquivo de teste encontrado pelo Horsebox para esta lib.

## ./lib/markdown-generator

Nenhum arquivo de teste encontrado pelo Horsebox para esta lib.

## path

**Consultas usadas no Horsebox:** `join`, `path join`, `resolve`, `path resolve`, `isAbsolute`, `path isAbsolute`, `relative`, `path relative`, `sep`, `path sep`

**Arquivos de teste encontrados:** 341

### src_modules/cc6b13a61c-@babel_parser/packages/babel-code-frame/test/index.js

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

### src_modules/9597e02587-@cyclonedx_cyclonedx-npm/tests/integration/cli.edge-cases.test.js

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

### src_modules/cc6b13a61c-@babel_parser/packages/babel-code-frame/test/color-detection.js

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

### src_modules/cc6b13a61c-@babel_parser/packages/babel-plugin-transform-regenerator/test/regenerator.js

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

### src_modules/cc6b13a61c-@babel_parser/packages/babel-core/test/targets.js

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

### src_modules/cc6b13a61c-@babel_parser/packages/babel-core/test/config-ts-integration-tsx.js

#### should work with tsx

```ts
it("should work with tsx", () => {
      require(
        path.join(
          __dirname,
          "fixtures/config-ts/simple-cts-with-tsx/babel.config.cts",
        ),
      );

      const config = loadPartialConfigSync({
        configFile: path.join(
          __dirname,
          "fixtures/config-ts/simple-cts-with-tsx/babel.config.cts",
        ),
      });

      expect(config.options.targets).toMatchInlineSnapshot(`
        Object {
          "node": "12.0.0",
        }
      `);

      expect(config.options.sourceRoot).toMatchInlineSnapshot(`"/a/b"`);
    }
```

### src_modules/cc6b13a61c-@babel_parser/packages/babel-core/test/path.js

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

### src_modules/cc6b13a61c-@babel_parser/packages/babel-traverse/test/path/index.js

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

### src_modules/cc6b13a61c-@babel_parser/packages/babel-standalone/test/transform-script-tags.test.js

#### should transform script element with type 'text/babel'

```ts
it("should transform script element with type 'text/babel'", () => {
    const dom = new JSDOM(
      `<!DOCTYPE html><head><script>${standaloneSource}</script><script type="text/babel">globalThis ?? window</script></head>`,
      { runScripts: "dangerously" },
    );
    return new Promise((resolve, reject) => {
      dom.window.addEventListener("DOMContentLoaded", () => {
        try {
          const transformedScriptElement =
            dom.window.document.head.children.item(2);
          expect(transformedScriptElement.getAttribute("type")).toBeNull();
          expect(transformedScriptElement.innerHTML).toContain(
            "globalThis !== null && globalThis !== void 0 ? globalThis : window",
          );
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  }
```

#### should pass through the nonce attribute to the transformed script element

```ts
it("should pass through the nonce attribute to the transformed script element", () => {
    const nonceAttribute = "nonce_example";

    const dom = new JSDOM(
      `<!DOCTYPE html><head><script>${standaloneSource}</script><script type="text/babel" nonce="${nonceAttribute}">globalThis ?? window</script></head>`,
      { runScripts: "dangerously" },
    );
    return new Promise((resolve, reject) => {
      dom.window.addEventListener("DOMContentLoaded", () => {
        try {
          const transformedScriptElement =
            dom.window.document.head.children.item(2);
          expect(transformedScriptElement.nonce).toBe(nonceAttribute);
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  }
```

#### should support data-targets attribute

```ts
it("should support data-targets attribute", () => {
    const input = `globalThis ?? window; /\\p{ASCII}/v`;
    const targets = "chrome 84"; // Chrome 84 supports nullish coalescing but not the `v` flag in regexps.
    const dom = new JSDOM(
      `<!DOCTYPE html><head><script>${standaloneSource}</script><script type="text/babel" data-targets="${targets}">${input}</script></head>`,
      { runScripts: "dangerously" },
    );
    return new Promise((resolve, reject) => {
      dom.window.addEventListener("DOMContentLoaded", () => {
        try {
          const transformedScriptElement =
            dom.window.document.head.children.item(2);
          expect(
            transformedScriptElement.getAttribute("data-targets"),
          ).toBeNull();
          expect(transformedScriptElement.innerHTML).toContain(
            `globalThis ?? window;
/\\p{ASCII}/u;`,
          );
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  }
```

### src_modules/cc6b13a61c-@babel_parser/packages/babel-register/test/index.js

#### does not mutate options

```ts
it("does not mutate options", () => {
        const proxyHandler = {
          defineProperty: jest.fn(Reflect.defineProperty),
          deleteProperty: jest.fn(Reflect.deleteProperty),
          set: jest.fn(Reflect.set),
        };

        setupRegister(
          new Proxy(
            {
              babelrc: true,
              sourceMaps: false,
              cwd: path.dirname(testFile),
              extensions: [".js"],
            },
            proxyHandler,
          ),
        );

        currentHook(testFileContent, testFile);

        expect(proxyHandler.defineProperty).not.toHaveBeenCalled();
        expect(proxyHandler.deleteProperty).not.toHaveBeenCalled();
        expect(proxyHandler.set).not.toHaveBeenCalled();
      }
```

#### works with mjs config files

```ts
it("works with mjs config files", () => {
      setupRegister({
        babelrc: true,
        sourceMaps: false,
        cwd: path.dirname(testFileMjs),
      });

      const result = currentHook(testFileMjsContent, testFileMjs);

      expect(result).toBe('"use strict";\n\nrequire("assert");');
    }
```

#### works with the -r flag

```ts
it("works with the -r flag", async () => {
        const output = await spawnNodeAsync(
          ["-r", registerFile, testFileLog],
          path.dirname(testFileLog),
        );

        expect(output.trim()).toMatchInlineSnapshot(
          `"It worked! function () {}"`,
        );
      }
```

#### works with the --require flag

```ts
it("works with the --require flag", async () => {
        const output = await spawnNodeAsync(
          ["--require", registerFile, testFileLog],
          path.dirname(testFileLog),
        );

        expect(output.trim()).toMatchInlineSnapshot(
          `"It worked! function () {}"`,
        );
      }
```

#### works with the -r flag in NODE_OPTIONS

```ts
it("works with the -r flag in NODE_OPTIONS", async () => {
        const output = await spawnNodeAsync(
          [testFileLog],
          path.dirname(testFileLog),
          {
            ...process.env,
            NODE_OPTIONS:
              `-r ${registerFile} ` + (process.env.NODE_OPTIONS || ""),
          },
        );

        expect(output.trim()).toMatchInlineSnapshot(
          `"It worked! function () {}"`,
        );
      }
```

#### works with the --require flag in NODE_OPTIONS

```ts
it("works with the --require flag in NODE_OPTIONS", async () => {
        const output = await spawnNodeAsync(
          [testFileLog],
          path.dirname(testFileLog),
          {
            ...process.env,
            NODE_OPTIONS:
              `--require ${registerFile} ` + (process.env.NODE_OPTIONS || ""),
          },
        );

        expect(output.trim()).toMatchInlineSnapshot(
          `"It worked! function () {}"`,
        );
      }
```

#### returns concatenatable sourceRoot and sources

```ts
it("returns concatenatable sourceRoot and sources", async () => {
      // The Source Maps R3 standard https://sourcemaps.info/spec.html states
      // that `sourceRoot` is “prepended to the individual entries in the
      // ‘source’ field.” If `sources` contains file names, and `sourceRoot`
      // is intended to refer to a directory but doesn’t end with a trailing
      // slash, any consumers of the source map are in for a bad day.
      //
      // The underlying problem seems to only get triggered if one file
      // requires() another with @babel/register active, and I couldn’t get
      // that working inside a test, possibly because of jest’s mocking
      // hooks, so we spawn a separate process.
      const output = await spawnNodeAsync([
        "-r",
        registerFile,
        require.resolve("./fixtures/source-map/index"),
      ]);
      const sourceMap = JSON.parse(output);
      expect(sourceMap.map.sourceRoot + sourceMap.map.sources[0]).toBe(
        require.resolve("./fixtures/source-map/foo/bar"),
      );
    }
```

#### transforms modules used within register

```ts
test("transforms modules used within register", async () => {
      // Need a clean environment without `convert-source-map`
      // already in the require cache, so we spawn a separate process

      const output = await spawnNodeAsync([
        require.resolve("./fixtures/internal-modules/index.js"),
      ]);
      const { convertSourceMap } = JSON.parse(output);
      expect(convertSourceMap).toMatch("/* transformed */");
    }
```

#### does not mutate options

```ts
test("does not mutate options", () => {
      const proxyHandler = {
        defineProperty: jest.fn(Reflect.defineProperty),
        deleteProperty: jest.fn(Reflect.deleteProperty),
        set: jest.fn(Reflect.set),
      };

      setupRegister(
        new Proxy(
          {
            babelrc: true,
            sourceMaps: false,
            cwd: path.dirname(testFileMjs),
            extensions: [".js"],
          },
          proxyHandler,
        ),
      );

      currentHook(testFileContent, testFile);

      expect(proxyHandler.defineProperty).not.toHaveBeenCalled();
      expect(proxyHandler.deleteProperty).not.toHaveBeenCalled();
      expect(proxyHandler.set).not.toHaveBeenCalled();
    }
```

### src_modules/cc6b13a61c-@babel_parser/eslint/babel-eslint-tests/test/integration/parser-override.js

#### works when parsing in the main thread

```ts
it("works when parsing in the main thread", () => {
    const { ast } = babelESLint.parseForESLint(`27`, {
      filename: "input.js",
      babelOptions: {
        configFile: path.resolve(
          path.dirname(fileURLToPath(import.meta.url)),
          "../fixtures/parser-override/babel.config.json",
        ),
      },
    });

    expect(ast).toMatchObject(expectedAST);
  }
```

### src_modules/cc6b13a61c-@babel_parser/packages/babel-register/test/cache.js

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

#### should be disabled when CACHE_PATH is not allowed to read

```ts
it("should be disabled when CACHE_PATH is not allowed to read", () => {
        writeCache({ foo: "bar" }, 0o266);
        load();

        expect(get()).toEqual({});
        expect(consoleWarnSpy.mock.calls[0][0]).toContain(
          "Babel could not read cache file",
        );
      }
```

#### should be disabled when CACHE_PATH is not allowed to write

```ts
it("should be disabled when CACHE_PATH is not allowed to write", () => {
      writeCache({ foo: "bar" }, 0o466);

      load();
      setDirty();

      expect(get()).toEqual({ foo: "bar" });
      return new Promise(resolve => {
        process.nextTick(() => {
          load();
          expect(get()).toEqual({});
          expect(consoleWarnSpy.mock.calls[0][0]).toContain(
            "Babel could not write cache to file",
          );
          resolve();
        });
      });
    }
```

### src_modules/cc6b13a61c-@babel_parser/packages/babel-traverse/test/replacement.js

#### replaces declaration in ExportDefaultDeclaration node

```ts
it("replaces declaration in ExportDefaultDeclaration node", function () {
      const ast = parse("export default function() {};", {
        sourceType: "module",
      });
      traverse(ast, {
        FunctionDeclaration(path) {
          path.replaceWith(
            t.arrayExpression([
              t.functionExpression(
                path.node.id,
                path.node.params,
                path.node.body,
                path.node.generator,
                path.node.async,
              ),
            ]),
          );
        },
      });

      expect(ast.program.body[0].declaration.type).toBe("ArrayExpression");
    }
```

#### throws error when trying to replace Program with a non-Program node

```ts
it("throws error when trying to replace Program with a non-Program node", function () {
      const ast = parse("var x = 3;");
      expect(function () {
        traverse(ast, {
          Program(path) {
            path.replaceWith(t.identifier("a"));
          },
        });
      }).toThrow(
        /You can only replace a Program root node with another Program node/,
      );
    }
```

#### throws error when used with an array of nodes

```ts
it("throws error when used with an array of nodes", function () {
      const ast = parse("function abc() {}; var test = 17;");
      expect(function () {
        traverse(ast, {
          NumericLiteral(path) {
            path.replaceWith([
              t.identifier("should"),
              t.identifier("never"),
              t.identifier("happen"),
            ]);
          },
        });
      }).toThrow(
        /Don't use `path\.replaceWith\(\)` with an array of nodes, use `path\.replaceWithMultiple\(\)`/,
      );
    });

    it("throws error when used with source string", function () {
      const ast = parse(
        "(function() { var x = 3; var y = 17; var c = x + y; })();",
      );
      expect(function () {
        traverse(ast, {
          BinaryExpression(path) {
            path.replaceWith("17 + 23");
          },
        });
      }).toThrow(
        /Don't use `path\.replaceWith\(\)` with a source string, use `path\.replaceWithSourceString\(\)`/,
      );
    }
```

#### throws error when trying to replace removed node

```ts
it("throws error when trying to replace removed node", function () {
      const ast = parse("var z = 'abc';");
      expect(function () {
        traverse(ast, {
          StringLiteral(path) {
            path.remove();
            path.replaceWith(t.identifier("p"));
          },
        });
      }).toThrow(/You can't replace this node, we've already removed it/);
    }
```

#### throws error when passed a falsy value

```ts
it("throws error when passed a falsy value", function () {
      const ast = parse("var z = 'abc';");
      expect(function () {
        traverse(ast, {
          StringLiteral(path) {
            path.replaceWith();
          },
        });
      }).toThrow(
        /You passed `path\.replaceWith\(\)` a falsy node, use `path\.remove\(\)` instead/,
      );
    }
```

#### does not revisit the replaced node if it is the node being replaced

```ts
it("does not revisit the replaced node if it is the node being replaced", () => {
      const ast = parse(`var x;`);
      let visitCounter = 0;
      traverse(ast, {
        VariableDeclaration(path) {
          visitCounter++;
          if (visitCounter > 1) {
            return true;
          }
          path.replaceWith(path.node);
        },
      });
      expect(visitCounter).toBe(1);
    }
```

#### updates pathCache with the replaced node

```ts
it("updates pathCache with the replaced node", () => {
      const ast = parse(`() => (a?.b)?.c`, {
        createParenthesizedExpressions: true,
      });
      traverse(ast, {
        OptionalMemberExpression(path) {
          path.node.type = "MemberExpression";
          // force `replaceWith` to replace `path.node`
          path.replaceWith(t.cloneNode(path.node));
          path.parentPath.ensureBlock();

          const aQuestionDotBNode = path.node.object.expression;
          // avoid traversing to a?.b
          aQuestionDotBNode.type = "MemberExpression";
        },
        ParenthesizedExpression(path) {
          path.replaceWith(path.node.expression);
        },
      });
      expect(generate(ast).code).toMatchInlineSnapshot(`
        "() => {
          return a.b.c;
        };"
      `);
    }
```

#### does not add extra parentheses for a JSXElement with a JSXElement parent

```ts
it("does not add extra parentheses for a JSXElement with a JSXElement parent", () => {
      const ast = parse(`<div><span><p></p><h></h></span></div>`, {
        plugins: ["jsx"],
      });
      traverse(ast, {
        JSXElement: path => {
          if (path.node.openingElement.name.name === "span") {
            path.replaceWithMultiple(path.node.children.filter(t.isJSXElement));
          }
        },
      });
      expect(generate(ast).code).toBe("<div><p></p><h></h></div>;");
    }
```

#### does not revisit one of new nodes if it is the node being replaced and is the head of nodes

```ts
it("does not revisit one of new nodes if it is the node being replaced and is the head of nodes", () => {
      // packages/babel-plugin-transform-block-scoping/src/index.js relies on this behaviour
      const ast = parse(`var x;`);
      let visitCounter = 0;
      traverse(ast, {
        VariableDeclaration(path) {
          visitCounter++;
          if (visitCounter > 1) {
            path.stop();
            return;
          }
          path.replaceWithMultiple([path.node, t.emptyStatement()]);
        },
      });
      expect(visitCounter).toBe(1);
    }
```

#### does not revisit one of new nodes if it is the node being replaced and is the tail of nodes

```ts
it("does not revisit one of new nodes if it is the node being replaced and is the tail of nodes", () => {
      // packages/babel-plugin-transform-block-scoping/src/index.js relies on this behaviour
      const ast = parse(`var x;`);
      let visitCounter = 0;
      traverse(ast, {
        VariableDeclaration(path) {
          visitCounter++;
          if (visitCounter > 1) {
            path.stop();
            return;
          }
          path.replaceWithMultiple([t.emptyStatement(), path.node]);
        },
      });
      expect(visitCounter).toBe(1);
    }
```

#### gathers nodes into sequence

```ts
it("gathers nodes into sequence", function () {
      const path = getExprPath();
      const node = t.identifier("a");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      t.assertSequenceExpression(path.node);
      expect(path.node.expressions[0]).toBe(undefinedNode.expression);
      expect(path.node.expressions[1]).toBe(node);
    }
```

#### avoids sequence for single node

```ts
it("avoids sequence for single node", function () {
      const path = getExprPath();

      const node = t.identifier("a");
      path.replaceExpressionWithStatements([node]);
      expect(path.node).toBe(node);

      const block = t.blockStatement([t.expressionStatement(node)]);
      path.replaceExpressionWithStatements([block]);
      expect(path.node).toBe(node);
    }
```

#### gathers expression

```ts
it("gathers expression", function () {
      const path = getExprPath();
      const node = t.identifier("a");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      expect(path.node.expressions[1]).toBe(node);
    }
```

#### gathers expression statement

```ts
it("gathers expression statement", function () {
      const path = getExprPath();
      const node = t.expressionStatement(t.identifier("a"));
      path.replaceExpressionWithStatements([undefinedNode, node]);
      expect(path.node.expressions[1]).toBe(node.expression);
    }
```

#### gathers var declarations

```ts
it("gathers var declarations", function () {
      const path = getExprPath();
      const node = parseStmt("var a, b = 1;");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      expect(path.scope.hasOwnBinding("a")).toBe(true);
      expect(path.scope.hasOwnBinding("b")).toBe(true);
      expect(path.get("expressions.0").toString()).toBe("undefined");
      expect(path.get("expressions.1").toString()).toBe("b = 1");
      expect(path.get("expressions.2").toString()).toBe("void 0");
    }
```

#### skips undefined if expression after var declaration

```ts
it("skips undefined if expression after var declaration", function () {
      const path = getExprPath();
      const node = parseStmt("{ var a, b = 1; true }");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      expect(path.get("expressions.1").toString()).toBe("b = 1, true");
    }
```

#### bails on let and const declarations

```ts
it("bails on let and const declarations", function () {
      let path = getExprPath();

      let node = parseStmt("let a, b = 1;");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      t.assertCallExpression(path.node);
      t.assertFunction(path.node.callee);

      path = getExprPath();
      node = parseStmt("const b = 1;");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      t.assertCallExpression(path.node);
      t.assertFunction(path.node.callee);
    }
```

#### gathers if statements

```ts
it("gathers if statements", function () {
      let path = getExprPath();
      let node = parseStmt("if (c) { true }");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      expect(path.get("expressions.1").toString()).toBe("c ? true : void 0");

      path = getExprPath();
      node = parseStmt("if (c) { true } else { b }");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      expect(path.get("expressions.1").toString()).toBe("c ? true : b");
    }
```

#### gathers block statements

```ts
it("gathers block statements", function () {
      let path = getExprPath();
      let node = parseStmt("{ a }");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      expect(path.get("expressions.1").toString()).toBe("a");

      path = getExprPath();
      node = parseStmt("{ a; b; }");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      expect(path.get("expressions.1").toString()).toBe("a, b");
    }
```

#### gathers empty statements if first element

```ts
it("gathers empty statements if first element", function () {
      const path = getExprPath();
      const node = parseStmt(";");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      expect(path.toString()).toBe("undefined");
    }
```

#### skips empty statement if expression afterwards

```ts
it("skips empty statement if expression afterwards", function () {
      const path = getExprPath();
      const node = parseStmt("{ ; true }");
      path.replaceExpressionWithStatements([undefinedNode, node]);
      expect(path.get("expressions.1").toString()).toBe("true");
    }
```

#### bails in if statements if recurse bails

```ts
it("bails in if statements if recurse bails", function () {
        let path = getExprPath();
        let node = parseStmt("if (true) { return }");
        path.replaceExpressionWithStatements([undefinedNode, node]);
        expect(path.toString()).toMatchInlineSnapshot(`
          "function () {
            undefined;
            if (true) {
              return;
            }
          }()"
        `);

        path = getExprPath();
        node = parseStmt("if (true) { true } else { return }");
        path.replaceExpressionWithStatements([undefinedNode, node]);
        expect(path.toString()).toMatchInlineSnapshot(`
          "function () {
            undefined;
            if (true) {
              return true;
            } else {
              return;
            }
          }()"
        `);
      }
```

#### bails in block statements if recurse bails

```ts
it("bails in block statements if recurse bails", function () {
        const path = getExprPath();
        const node = parseStmt("{ return }");
        path.replaceExpressionWithStatements([undefinedNode, node]);
        expect(path.toString()).toMatchInlineSnapshot(`
          "function () {
            undefined;
            {
              return;
            }
          }()"
        `);
      }
```

### src_modules/cc6b13a61c-@babel_parser/packages/babel-traverse/test/inference.js

#### should work with null

```ts
it("should work with null", function () {
      const path = flowGetPath("var x = null; x === null")
        .get("body")[1]
        .get("expression");
      const left = path.get("left");
      const right = path.get("right");
      const strictMatch = left.baseTypeStrictlyMatches(right);

      expect(strictMatch).toBeTruthy();
    }
```

#### should work with numbers

```ts
it("should work with numbers", function () {
      const path = flowGetPath("var x = 1; x === 2")
        .get("body")[1]
        .get("expression");
      const left = path.get("left");
      const right = path.get("right");
      const strictMatch = left.baseTypeStrictlyMatches(right);

      expect(strictMatch).toBeTruthy();
    }
```

#### should bail when type changes

```ts
it("should bail when type changes", function () {
      const path = flowGetPath(
        "var x = 1; if (foo) x = null;else x = 3; x === 2",
      )
        .get("body")[2]
        .get("expression");
      const left = path.get("left");
      const right = path.get("right");

      const strictMatch = left.baseTypeStrictlyMatches(right);

      expect(strictMatch).toBeFalsy();
    }
```

#### should differentiate between null and undefined

```ts
it("should differentiate between null and undefined", function () {
      const path = flowGetPath("var x; x === null")
        .get("body")[1]
        .get("expression");
      const left = path.get("left");
      const right = path.get("right");
      const strictMatch = left.baseTypeStrictlyMatches(right);

      expect(strictMatch).toBeFalsy();
    }
```

#### should infer from type cast

```ts
it("should infer from type cast", function () {
      const path = flowGetPath("(x: number)").get("body")[0].get("expression");
      expect(t.isNumberTypeAnnotation(path.getTypeAnnotation())).toBeTruthy();
    }
```

#### should infer string from template literal

```ts
it("should infer string from template literal", function () {
      const path = flowGetPath("`hey`").get("body")[0].get("expression");
      expect(t.isStringTypeAnnotation(path.getTypeAnnotation())).toBeTruthy();
    }
```

#### should infer number from +x

```ts
it("should infer number from +x", function () {
      const path = flowGetPath("+x").get("body")[0].get("expression");
      expect(t.isNumberTypeAnnotation(path.getTypeAnnotation())).toBeTruthy();
    }
```

#### should infer T from new T

```ts
it("should infer T from new T", function () {
      const path = flowGetPath("new T").get("body")[0].get("expression");
      const type = path.getTypeAnnotation();
      expect(
        t.isGenericTypeAnnotation(type) && type.id.name === "T",
      ).toBeTruthy();
    }
```

#### should infer number from ++x

```ts
it("should infer number from ++x", function () {
      const path = flowGetPath("++x").get("body")[0].get("expression");
      expect(t.isNumberTypeAnnotation(path.getTypeAnnotation())).toBeTruthy();
    }
```

#### should infer number from --x

```ts
it("should infer number from --x", function () {
      const path = flowGetPath("--x").get("body")[0].get("expression");
      expect(t.isNumberTypeAnnotation(path.getTypeAnnotation())).toBeTruthy();
    }
```

#### should infer void from void x

```ts
it("should infer void from void x", function () {
      const path = flowGetPath("void x").get("body")[0].get("expression");
      expect(t.isVoidTypeAnnotation(path.getTypeAnnotation())).toBeTruthy();
    }
```

#### should infer string from typeof x

```ts
it("should infer string from typeof x", function () {
      const path = flowGetPath("typeof x").get("body")[0].get("expression");
      expect(t.isStringTypeAnnotation(path.getTypeAnnotation())).toBeTruthy();
    }
```

#### should infer boolean from !x

```ts
it("should infer boolean from !x", function () {
      const path = flowGetPath("!x").get("body")[0].get("expression");
      expect(t.isBooleanTypeAnnotation(path.getTypeAnnotation())).toBeTruthy();
    }
```

#### should infer type of sequence expression

```ts
it("should infer type of sequence expression", function () {
      const path = flowGetPath("a,1").get("body")[0].get("expression");
      expect(t.isNumberTypeAnnotation(path.getTypeAnnotation())).toBeTruthy();
    }
```

#### should infer type of logical expression

```ts
it("should infer type of logical expression", function () {
      const path = flowGetPath("'a' && 1").get("body")[0].get("expression");
      const type = path.getTypeAnnotation();
      expect(t.isUnionTypeAnnotation(type)).toBeTruthy();
      expect(t.isStringTypeAnnotation(type.types[0])).toBeTruthy();
      expect(t.isNumberTypeAnnotation(type.types[1])).toBeTruthy();
    }
```

#### should infer type of conditional expression

```ts
it("should infer type of conditional expression", function () {
      const path = flowGetPath("q ? true : 0").get("body")[0].get("expression");
      const type = path.getTypeAnnotation();
      expect(t.isUnionTypeAnnotation(type)).toBeTruthy();
      expect(t.isBooleanTypeAnnotation(type.types[0])).toBeTruthy();
      expect(t.isNumberTypeAnnotation(type.types[1])).toBeTruthy();
    }
```

#### should infer RegExp from RegExp literal

```ts
it("should infer RegExp from RegExp literal", function () {
      const path = flowGetPath("/.+/").get("body")[0].get("expression");
      const type = path.getTypeAnnotation();
      expect(
        t.isGenericTypeAnnotation(type) && type.id.name === "RegExp",
      ).toBeTruthy();
    }
```

#### should infer Object from object expression

```ts
it("should infer Object from object expression", function () {
      const path = flowGetPath("({ a: 5 })").get("body")[0].get("expression");
      const type = path.getTypeAnnotation();
      expect(
        t.isGenericTypeAnnotation(type) && type.id.name === "Object",
      ).toBeTruthy();
    }
```

#### should infer Array from array expression

```ts
it("should infer Array from array expression", function () {
      const path = flowGetPath("[ 5 ]").get("body")[0].get("expression");
      const type = path.getTypeAnnotation();
      expect(
        t.isGenericTypeAnnotation(type) && type.id.name === "Array",
      ).toBeTruthy();
    }
```

#### should infer Function from function

```ts
it("should infer Function from function", function () {
      const path = flowGetPath("(function (): string {})")
        .get("body")[0]
        .get("expression");
      const type = path.getTypeAnnotation();
      expect(
        t.isGenericTypeAnnotation(type) && type.id.name === "Function",
      ).toBeTruthy();
    }
```

#### should infer call return type using function

```ts
it("should infer call return type using function", function () {
      const path = flowGetPath("(function (): string {})()")
        .get("body")[0]
        .get("expression");
      const type = path.getTypeAnnotation();
      expect(t.isStringTypeAnnotation(type)).toBeTruthy();
    }
```

#### should infer call return type using async function

```ts
it("should infer call return type using async function", function () {
      const path = flowGetPath("(async function (): string {})()")
        .get("body")[0]
        .get("expression");
      const type = path.getTypeAnnotation();
      expect(
        t.isGenericTypeAnnotation(type) && type.id.name === "Promise",
      ).toBeTruthy();
    }
```

#### should infer call return type using async generator function

```ts
it("should infer call return type using async generator function", function () {
      const path = flowGetPath("(async function * (): string {})()")
        .get("body")[0]
        .get("expression");
      const type = path.getTypeAnnotation();
      expect(
        t.isGenericTypeAnnotation(type) && type.id.name === "AsyncIterator",
      ).toBeTruthy();
    }
```

#### should infer number from x/y

```ts
it("should infer number from x/y", function () {
      const path = flowGetPath("x/y").get("body")[0].get("expression");
      const type = path.getTypeAnnotation();
      expect(t.isNumberTypeAnnotation(type)).toBeTruthy();
    }
```

#### should infer boolean from x instanceof y

```ts
it("should infer boolean from x instanceof y", function () {
      const path = flowGetPath("x instanceof y")
        .get("body")[0]
        .get("expression");
      const type = path.getTypeAnnotation();
      expect(t.isBooleanTypeAnnotation(type)).toBeTruthy();
    }
```

#### should infer number from 1 + 2

```ts
it("should infer number from 1 + 2", function () {
      const path = flowGetPath("1 + 2").get("body")[0].get("expression");
      const type = path.getTypeAnnotation();
      expect(t.isNumberTypeAnnotation(type)).toBeTruthy();
    }
```

#### should infer string|number from x + y

```ts
it("should infer string|number from x + y", function () {
      const path = flowGetPath("x + y").get("body")[0].get("expression");
      const type = path.getTypeAnnotation();
      expect(t.isUnionTypeAnnotation(type)).toBeTruthy();
      expect(t.isStringTypeAnnotation(type.types[0])).toBeTruthy();
      expect(t.isNumberTypeAnnotation(type.types[1])).toBeTruthy();
    }
```

#### should infer type of tagged template literal

```ts
it("should infer type of tagged template literal", function () {
      const path = flowGetPath("(function (): RegExp {}) `hey`")
        .get("body")[0]
        .get("expression");
      const type = path.getTypeAnnotation();
      expect(
        t.isGenericTypeAnnotation(type) && type.id.name === "RegExp",
      ).toBeTruthy();
    }
```

#### should infer constant identifier

```ts
it("should infer constant identifier", function () {
      const path = flowGetPath("const x = 0; x").get("body.1.expression");
      const type = path.getTypeAnnotation();
      expect(t.isNumberTypeAnnotation(type)).toBeTruthy();
    }
```

#### should infer indirect constant identifier

```ts
it("should infer indirect constant identifier", function () {
      const path = flowGetPath("const x = 0; const y = x; y").get(
        "body.2.expression",
      );
      const type = path.getTypeAnnotation();
      expect(t.isNumberTypeAnnotation(type)).toBeTruthy();
    }
```

#### should infer identifier type from if statement (===)

```ts
it("should infer identifier type from if statement (===)", function () {
      const path = flowGetPath(
        `function test(x) {
        if (x === true) x;
      }`,
      ).get("body.0.body.body.0.consequent.expression");
      const type = path.getTypeAnnotation();
      expect(t.isBooleanTypeAnnotation(type)).toBeTruthy();
    }
```

#### should infer identifier type from if statement (typeof)

```ts
it("should infer identifier type from if statement (typeof)", function () {
      let path = flowGetPath(
        `function test(x) {
        if (typeof x == 'string') x;
      }`,
      ).get("body.0.body.body.0.consequent.expression");
      let type = path.getTypeAnnotation();
      expect(t.isStringTypeAnnotation(type)).toBeTruthy();
      path = flowGetPath(
        `function test(x) {
        if (typeof x === 'number') x;
      }`,
      ).get("body.0.body.body.0.consequent.expression");
      type = path.getTypeAnnotation();
      expect(t.isNumberTypeAnnotation(type)).toBeTruthy();
    }
```

#### should infer identifier type from if statement (&&)

```ts
it("should infer identifier type from if statement (&&)", function () {
      let path = flowGetPath(
        `function test(x) {
        if (typeof x == 'string' && x === 3) x;
      }`,
      ).get("body.0.body.body.0.consequent.expression");
      let type = path.getTypeAnnotation();
      expect(t.isUnionTypeAnnotation(type)).toBeTruthy();
      expect(t.isStringTypeAnnotation(type.types[0])).toBeTruthy();
      expect(t.isNumberTypeAnnotation(type.types[1])).toBeTruthy();
      path = flowGetPath(
        `function test(x) {
        if (true && x === 3) x;
      }`,
      ).get("body.0.body.body.0.consequent.expression");
      type = path.getTypeAnnotation();
      expect(t.isNumberTypeAnnotation(type)).toBeTruthy();
      path = flowGetPath(
        `function test(x) {
        if (x === 'test' && true) x;
      }`,
      ).get("body.0.body.body.0.consequent.expression");
      type = path.getTypeAnnotation();
      expect(t.isStringTypeAnnotation(type)).toBeTruthy();
    }
```

#### should infer identifier type from if statement (||)

```ts
it("should infer identifier type from if statement (||)", function () {
      const path = flowGetPath(
        `function test(x) {
        if (typeof x == 'string' || x === 3) x;
      }`,
      ).get("body.0.body.body.0.consequent.expression");
      const type = path.getTypeAnnotation();
      expect(t.isAnyTypeAnnotation(type)).toBeTruthy();
    }
```

#### should not infer identifier type from incorrect binding

```ts
it("should not infer identifier type from incorrect binding", function () {
      const path = flowGetPath(
        `function outer(x) {
        if (x === 3) {
          function inner(x) {
            x;
          }
        }
      }`,
      ).get("body.0.body.body.0.consequent.body.0.body.body.0.expression");
      const type = path.getTypeAnnotation();
      expect(t.isAnyTypeAnnotation(type)).toBeTruthy();
    }
```

#### should not cause a stack overflow when two variable depend on each other

```ts
it("should not cause a stack overflow when two variable depend on each other", function () {
      const path = flowGetPath(`
        var b, c;
        while (0) {
          c = 1;
          b = c;
        }
        c = b;
      `).get("body.2.expression");

      expect(path.toString()).toBe("c = b");

      // Note: this could technically be "number | void", but the cycle detection
      // logic just bails out to "any" to avoid infinite loops.
      expect(path.getTypeAnnotation()).toEqual({ type: "AnyTypeAnnotation" });
    }
```

#### should work with null

```ts
it("should work with null", function () {
      const path = tsGetPath("var x = null; x === null")
        .get("body")[1]
        .get("expression");
      const left = path.get("left");
      const right = path.get("right");
      const strictMatch = left.baseTypeStrictlyMatches(right);

      expect(strictMatch).toBeTruthy();
    }
```

#### should work with numbers

```ts
it("should work with numbers", function () {
      const path = tsGetPath("var x = 1; x === 2")
        .get("body")[1]
        .get("expression");
      const left = path.get("left");
      const right = path.get("right");
      const strictMatch = left.baseTypeStrictlyMatches(right);

      expect(strictMatch).toBeTruthy();
    }
```

#### should bail when type changes

```ts
it("should bail when type changes", function () {
      const path = tsGetPath("var x = 1; if (foo) x = null;else x = 3; x === 2")
        .get("body")[2]
        .get("expression");
      const left = path.get("left");
      const right = path.get("right");

      const strictMatch = left.baseTypeStrictlyMatches(right);

      expect(strictMatch).toBeFalsy();
    }
```

#### should differentiate between null and undefined

```ts
it("should differentiate between null and undefined", function () {
      const path = tsGetPath("var x; x === null")
        .get("body")[1]
        .get("expression");
      const left = path.get("left");
      const right = path.get("right");
      const strictMatch = left.baseTypeStrictlyMatches(right);

      expect(strictMatch).toBeFalsy();
    }
```

#### should infer from type cast

```ts
it("should infer from type cast", function () {
      const path = tsGetPath("x as number").get("body")[0].get("expression");
      expect(t.isTSNumberKeyword(path.getTypeAnnotation())).toBeTruthy();
    }
```

#### should infer from non-null expression

```ts
it("should infer from non-null expression", function () {
      const path = tsGetPath("x as number").get("body")[0].get("expression");
      expect(t.isTSNumberKeyword(path.getTypeAnnotation())).toBeTruthy();
    }
```

#### should infer string from template literal

```ts
it("should infer string from template literal", function () {
      const path = tsGetPath("`hey`").get("body")[0].get("expression");
      expect(t.isStringTypeAnnotation(path.getTypeAnnotation())).toBeTruthy();
    }
```

#### should infer number from +x

```ts
it("should infer number from +x", function () {
      const path = tsGetPath("+x").get("body")[0].get("expression");
      expect(t.isNumberTypeAnnotation(path.getTypeAnnotation())).toBeTruthy();
    }
```

#### should infer T from new T

```ts
it("should infer T from new T", function () {
      const path = tsGetPath("new T").get("body")[0].get("expression");
      const type = path.getTypeAnnotation();
      expect(
        t.isGenericTypeAnnotation(type) && type.id.name === "T",
      ).toBeTruthy();
    }
```

#### should infer number from ++x

```ts
it("should infer number from ++x", function () {
      const path = tsGetPath("++x").get("body")[0].get("expression");
      expect(t.isNumberTypeAnnotation(path.getTypeAnnotation())).toBeTruthy();
    }
```

#### should infer number from --x

```ts
it("should infer number from --x", function () {
      const path = tsGetPath("--x").get("body")[0].get("expression");
      expect(t.isNumberTypeAnnotation(path.getTypeAnnotation())).toBeTruthy();
    }
```

#### should infer void from void x

```ts
it("should infer void from void x", function () {
      const path = tsGetPath("void x").get("body")[0].get("expression");
      expect(t.isVoidTypeAnnotation(path.getTypeAnnotation())).toBeTruthy();
    }
```

#### should infer string from typeof x

```ts
it("should infer string from typeof x", function () {
      const path = tsGetPath("typeof x").get("body")[0].get("expression");
      expect(t.isStringTypeAnnotation(path.getTypeAnnotation())).toBeTruthy();
    }
```

#### should infer boolean from !x

```ts
it("should infer boolean from !x", function () {
      const path = tsGetPath("!x").get("body")[0].get("expression");
      expect(t.isBooleanTypeAnnotation(path.getTypeAnnotation())).toBeTruthy();
    }
```

#### should infer type of sequence expression

```ts
it("should infer type of sequence expression", function () {
      const path = tsGetPath("a,1").get("body")[0].get("expression");
      expect(t.isNumberTypeAnnotation(path.getTypeAnnotation())).toBeTruthy();
    }
```

#### should infer type of logical expression

```ts
it("should infer type of logical expression", function () {
      const path = tsGetPath("'a' && 1").get("body")[0].get("expression");
      const type = path.getTypeAnnotation();
      expect(t.isUnionTypeAnnotation(type)).toBeTruthy();
      expect(t.isStringTypeAnnotation(type.types[0])).toBeTruthy();
      expect(t.isNumberTypeAnnotation(type.types[1])).toBeTruthy();
    }
```

#### should infer type of conditional expression

```ts
it("should infer type of conditional expression", function () {
      const path = tsGetPath("q ? true : 0").get("body")[0].get("expression");
      const type = path.getTypeAnnotation();
      expect(t.isUnionTypeAnnotation(type)).toBeTruthy();
      expect(t.isBooleanTypeAnnotation(type.types[0])).toBeTruthy();
      expect(t.isNumberTypeAnnotation(type.types[1])).toBeTruthy();
    }
```

#### should infer RegExp from RegExp literal

```ts
it("should infer RegExp from RegExp literal", function () {
      const path = tsGetPath("/.+/").get("body")[0].get("expression");
      const type = path.getTypeAnnotation();
      expect(
        t.isGenericTypeAnnotation(type) && type.id.name === "RegExp",
      ).toBeTruthy();
    }
```

#### should infer Object from object expression

```ts
it("should infer Object from object expression", function () {
      const path = tsGetPath("({ a: 5 })").get("body")[0].get("expression");
      const type = path.getTypeAnnotation();
      expect(
        t.isGenericTypeAnnotation(type) && type.id.name === "Object",
      ).toBeTruthy();
    }
```

#### should infer Array from array expression

```ts
it("should infer Array from array expression", function () {
      const path = tsGetPath("[ 5 ]").get("body")[0].get("expression");
      const type = path.getTypeAnnotation();
      expect(
        t.isGenericTypeAnnotation(type) && type.id.name === "Array",
      ).toBeTruthy();
    }
```

#### should infer Function from function

```ts
it("should infer Function from function", function () {
      const path = tsGetPath("(function (): string {})")
        .get("body")[0]
        .get("expression");
      const type = path.getTypeAnnotation();
      expect(
        t.isGenericTypeAnnotation(type) && type.id.name === "Function",
      ).toBeTruthy();
    }
```

#### should infer call return type using function

```ts
it("should infer call return type using function", function () {
      const path = tsGetPath("(function (): string {})()")
        .get("body")[0]
        .get("expression");
      const type = path.getTypeAnnotation();
      expect(type.type).toBe("TSStringKeyword");
    }
```

#### should infer call return type using async function

```ts
it("should infer call return type using async function", function () {
      const path = tsGetPath("(async function (): string {})()")
        .get("body")[0]
        .get("expression");
      const type = path.getTypeAnnotation();
      expect(
        t.isGenericTypeAnnotation(type) && type.id.name === "Promise",
      ).toBeTruthy();
    }
```

#### should infer call return type using async generator function

```ts
it("should infer call return type using async generator function", function () {
      const path = tsGetPath("(async function * (): string {})()")
        .get("body")[0]
        .get("expression");
      const type = path.getTypeAnnotation();
      expect(
        t.isGenericTypeAnnotation(type) && type.id.name === "AsyncIterator",
      ).toBeTruthy();
    }
```

#### should infer number from x/y

```ts
it("should infer number from x/y", function () {
      const path = tsGetPath("x/y").get("body")[0].get("expression");
      const type = path.getTypeAnnotation();
      expect(t.isNumberTypeAnnotation(type)).toBeTruthy();
    }
```

#### should infer boolean from x instanceof y

```ts
it("should infer boolean from x instanceof y", function () {
      const path = tsGetPath("x instanceof y").get("body")[0].get("expression");
      const type = path.getTypeAnnotation();
      expect(t.isBooleanTypeAnnotation(type)).toBeTruthy();
    }
```

#### should infer number from 1 + 2

```ts
it("should infer number from 1 + 2", function () {
      const path = tsGetPath("1 + 2").get("body")[0].get("expression");
      const type = path.getTypeAnnotation();
      expect(t.isNumberTypeAnnotation(type)).toBeTruthy();
    }
```

#### should infer string|number from x + y

```ts
it("should infer string|number from x + y", function () {
      const path = tsGetPath("x + y").get("body")[0].get("expression");
      const type = path.getTypeAnnotation();
      expect(t.isUnionTypeAnnotation(type)).toBeTruthy();
      expect(t.isStringTypeAnnotation(type.types[0])).toBeTruthy();
      expect(t.isNumberTypeAnnotation(type.types[1])).toBeTruthy();
    }
```

#### should infer type of tagged template literal

```ts
it("should infer type of tagged template literal", function () {
      const path = tsGetPath("(function (): RegExp {}) `hey`")
        .get("body")[0]
        .get("expression");
      const type = path.getTypeAnnotation();
      expect(type.type).toBe("TSTypeReference");
      expect(type.typeName.name).toBe("RegExp");
    }
```

#### should infer constant identifier

```ts
it("should infer constant identifier", function () {
      const path = tsGetPath("const x = 0; x").get("body.1.expression");
      const type = path.getTypeAnnotation();
      expect(t.isNumberTypeAnnotation(type)).toBeTruthy();
    }
```

#### should infer indirect constant identifier

```ts
it("should infer indirect constant identifier", function () {
      const path = tsGetPath("const x = 0; const y = x; y").get(
        "body.2.expression",
      );
      const type = path.getTypeAnnotation();
      expect(t.isNumberTypeAnnotation(type)).toBeTruthy();
    }
```

#### should infer identifier type from if statement (===)

```ts
it("should infer identifier type from if statement (===)", function () {
      const path = tsGetPath(
        `function test(x) {
        if (x === true) x;
      }`,
      ).get("body.0.body.body.0.consequent.expression");
      const type = path.getTypeAnnotation();
      expect(t.isBooleanTypeAnnotation(type)).toBeTruthy();
    }
```

#### should infer identifier type from if statement (typeof)

```ts
it("should infer identifier type from if statement (typeof)", function () {
      let path = tsGetPath(
        `function test(x) {
        if (typeof x == 'string') x;
      }`,
      ).get("body.0.body.body.0.consequent.expression");
      let type = path.getTypeAnnotation();
      expect(t.isStringTypeAnnotation(type)).toBeTruthy();
      path = tsGetPath(
        `function test(x) {
        if (typeof x === 'number') x;
      }`,
      ).get("body.0.body.body.0.consequent.expression");
      type = path.getTypeAnnotation();
      expect(t.isNumberTypeAnnotation(type)).toBeTruthy();
    }
```

#### should infer identifier type from if statement (&&)

```ts
it("should infer identifier type from if statement (&&)", function () {
      let path = tsGetPath(
        `function test(x) {
        if (typeof x == 'string' && x === 3) x;
      }`,
      ).get("body.0.body.body.0.consequent.expression");
      let type = path.getTypeAnnotation();
      expect(t.isUnionTypeAnnotation(type)).toBeTruthy();
      expect(t.isStringTypeAnnotation(type.types[0])).toBeTruthy();
      expect(t.isNumberTypeAnnotation(type.types[1])).toBeTruthy();
      path = tsGetPath(
        `function test(x) {
        if (true && x === 3) x;
      }`,
      ).get("body.0.body.body.0.consequent.expression");
      type = path.getTypeAnnotation();
      expect(t.isNumberTypeAnnotation(type)).toBeTruthy();
      path = tsGetPath(
        `function test(x) {
        if (x === 'test' && true) x;
      }`,
      ).get("body.0.body.body.0.consequent.expression");
      type = path.getTypeAnnotation();
      expect(t.isStringTypeAnnotation(type)).toBeTruthy();
    }
```

#### should infer identifier type from if statement (||)

```ts
it("should infer identifier type from if statement (||)", function () {
      const path = tsGetPath(
        `function test(x) {
        if (typeof x == 'string' || x === 3) x;
      }`,
      ).get("body.0.body.body.0.consequent.expression");
      const type = path.getTypeAnnotation();
      expect(t.isAnyTypeAnnotation(type)).toBeTruthy();
    }
```

#### should not infer identifier type from incorrect binding

```ts
it("should not infer identifier type from incorrect binding", function () {
      const path = tsGetPath(
        `function outer(x) {
        if (x === 3) {
          function inner(x) {
            x;
          }
        }
      }`,
      ).get("body.0.body.body.0.consequent.body.0.body.body.0.expression");
      const type = path.getTypeAnnotation();
      expect(t.isAnyTypeAnnotation(type)).toBeTruthy();
    }
```

#### should not cause a stack overflow when two variable depend on each other

```ts
it("should not cause a stack overflow when two variable depend on each other", function () {
      const path = tsGetPath(`
        var b, c;
        while (0) {
          c = 1;
          b = c;
        }
        c = b;
      `).get("body.2.expression");

      expect(path.toString()).toBe("c = b");

      // Note: this could technically be "number | void", but the cycle detection
      // logic just bails out to "any" to avoid infinite loops.
      expect(path.getTypeAnnotation()).toEqual({ type: "AnyTypeAnnotation" });
    }
```

#### should not throw both flow and ts types

```ts
it("should not throw both flow and ts types", () => {
      const path = tsGetPath(
        `const bar = 0 ? mkList() : [];function mkList(): any[] {return [];}`,
      ).get("body.0.declarations.0");
      // TODO: This should be true
      expect(path.isGenericType("Array")).toBe(false);
    }
```

### src_modules/cc6b13a61c-@babel_parser/packages/babel-traverse/test/traverse.js

#### traverse replace

```ts
it("traverse replace", function () {
    const replacement = {
      type: "StringLiteral",
      value: "foo",
    };
    const ast2 = JSON.parse(JSON.stringify(program));

    traverse(ast2, {
      enter: function (path) {
        if (path.node.type === "ThisExpression") path.replaceWith(replacement);
      },
    });

    expect(ast2.body[1].expression.left.object).toBe(replacement);
  }
```

#### traverse

```ts
it("traverse", function () {
    const expected = [
      body[0],
      body[0].declarations[0],
      body[0].declarations[0].id,
      body[0].declarations[0].init,
      body[1],
      body[1].expression,
      body[1].expression.left,
      body[1].expression.left.object,
      body[1].expression.left.property,
      body[1].expression.right,
    ];

    const actual = [];

    traverse(program, {
      enter: function (path) {
        actual.push(path.node);
      },
    });

    expect(actual).toEqual(expected);
  }
```

#### traverse denylistTypes

```ts
it("traverse denylistTypes", function () {
    const expected = [
      body[0],
      body[0].declarations[0],
      body[0].declarations[0].id,
      body[0].declarations[0].init,
      body[1],
      body[1].expression,
      body[1].expression.right,
    ];

    const actual = [];

    traverse(program, {
      denylist: ["MemberExpression"],
      enter: function (path) {
        actual.push(path.node);
      },
    });

    expect(actual).toEqual(expected);
  }
```

#### clearCache

```ts
it("clearCache", function () {
    const paths = [];
    const scopes = [];
    traverse(ast, {
      enter(path) {
        scopes.push(path.scope);
        paths.push(path);
        path.stop();
      },
    });

    traverse.cache.clear();

    const paths2 = [];
    const scopes2 = [];
    traverse(ast, {
      enter(path) {
        scopes2.push(path.scope);
        paths2.push(path);
        path.stop();
      },
    });

    scopes2.forEach(function (_, i) {
      expect(scopes[i]).not.toBe(scopes2[i]);
      expect(paths[i]).not.toBe(paths2[i]);
    });
  }
```

#### clearPath

```ts
it("clearPath", function () {
    const paths = [];
    traverse(ast, {
      enter(path) {
        paths.push(path);
      },
    });

    traverse.cache.clearPath();

    const paths2 = [];
    traverse(ast, {
      enter(path) {
        paths2.push(path);
      },
    });

    paths2.forEach(function (p, i) {
      expect(p).not.toBe(paths[i]);
    });
  }
```

#### clearScope

```ts
it("clearScope", function () {
    const scopes = [];
    traverse(ast, {
      enter(path) {
        scopes.push(path.scope);
        path.stop();
      },
    });

    traverse.cache.clearScope();

    const scopes2 = [];
    traverse(ast, {
      enter(path) {
        scopes2.push(path.scope);
        path.stop();
      },
    });

    scopes2.forEach(function (p, i) {
      expect(p).not.toBe(scopes[i]);
    });
  }
```

#### replaced paths can be skipped

```ts
it("replaced paths can be skipped", function () {
      const ast = parse("id");

      let skipped;
      traverse(ast, {
        noScope: true,
        Identifier(path) {
          path.replaceWith(t.numericLiteral(0));
          path.skip();
          skipped = true;
        },
        NumericLiteral() {
          skipped = false;
        },
      });

      expect(skipped).toBe(true);
    }
```

#### should preserve traversal context after enter hook is executed

```ts
it("should preserve traversal context after enter hook is executed", () => {
      const ast = parse("{;}");
      // The test initiates a sub-traverse from program. When the `enter` hook of BlockStatement
      // is called, the unshiftContainer will change the traversal context of the BlockStatement
      // to the one of Program which has an EmptyStatement visitor. If the traversal context
      // is not restored after the `enter` hook is executed, the `EmptyStatement` visitor will
      // be run twice: one in the sub-traverse and the other in the top level traverse.
      let emptyStatementVisitedCounter = 0;
      traverse(ast, {
        noScope: true,
        Program(path) {
          path.traverse({
            noScope: true,
            BlockStatement: {
              enter(path) {
                path.parentPath.unshiftContainer("body", [t.numericLiteral(0)]);
              },
            },
          });
        },
        EmptyStatement() {
          ++emptyStatementVisitedCounter;
        },
      });
      expect(emptyStatementVisitedCounter).toBe(1);
    }
```

#### should preserve traversal context after visitor is executed

```ts
it("should preserve traversal context after visitor is executed", () => {
      const ast = parse("{;}");
      // The test initiates a sub-traverse from program. During the BlockStatement is traversed,
      // the EmptyStatement visitor will be called and the unshiftContainer will change the
      // traversal context of the BlockStatement to that of Program which has an EmptyStatement
      // visitor. If the traversal context is not restored after `enter` hook is executed,
      // the `BlockStatement:exit` visitor will be run twice: one in the sub-traverse and the other
      // in the top level traverse.
      let blockStatementVisitedCounter = 0;
      traverse(ast, {
        noScope: true,
        Program(path) {
          path.traverse({
            noScope: true,
            EmptyStatement: {
              enter(path) {
                path.parentPath.parentPath.unshiftContainer("body", [
                  t.numericLiteral(0),
                ]);
              },
            },
          });
        },
        BlockStatement: {
          exit() {
            ++blockStatementVisitedCounter;
          },
        },
      });
      expect(blockStatementVisitedCounter).toBe(1);
    }
```

#### regression - #12570

```ts
it("regression - #12570", () => {
      const logs = [];

      const ast = parse(
        `
          import { Foo } from './Foo'
          import { Bar } from './Bar'
        `,
        { sourceType: "module" },
      );
      traverse(ast, {
        Program(path) {
          path.traverse({
            ImportDeclaration: {
              enter(path) {
                logs.push(["ENTER", path.node.source.value]);
                if (path.node.source.value === "./Bar") {
                  path.parentPath.get(path.listKey);
                }
              },
              exit(path) {
                logs.push(["EXIT", path.node.source.value]);
              },
            },
          });
        },
      });

      expect(logs).toEqual([
        ["ENTER", "./Foo"],
        ["EXIT", "./Foo"],
        ["ENTER", "./Bar"],
        ["EXIT", "./Bar"],
      ]);
    }
```

#### should preserve the context for those nodes that are not visited in sub-traversal

```ts
it("should preserve the context for those nodes that are not visited in sub-traversal", () => {
      const code = `{ var first; function second() {} }`;
      const ast = parse(code);
      let contextLevel;
      traverse(
        ast,
        {
          enter(path) {
            if (path.isFunctionDeclaration()) {
              path.parentPath.traverse(
                {
                  enter(path) {
                    if (path.isFunctionDeclaration()) {
                      path.parentPath.traverse(
                        {
                          enter(path) {
                            if (path.isVariableDeclaration()) path.stop();
                          },
                        },
                        { level: 3 },
                      );
                      // the function declaration path should have state.level as 2
                      // as it is defined within level 2 traversal and the node is
                      // not visited in the next sub-traversal
                      contextLevel = path.state.level;
                    }
                  },
                },
                { level: 2 },
              );
            }
          },
        },
        undefined,
        { level: 1 },
      );
      expect(contextLevel).toBe(2);
    }
```

#### regression - #17563

```ts
it("regression - #17563", () => {
      const ast = parse("const a = 1;");
      traverse(ast, {
        noScope: true,
        Identifier() {},
      });

      let result;

      traverse(ast, {
        Identifier(path) {
          result = path.scope.hasOwnBinding("a");
        },
      });

      expect(result).toBe(true);
    }
```

#### #11350: this.hub should not be undefined while traversing a program or file

```ts
it("#11350: this.hub should not be undefined while traversing a program or file", function () {
      const ast = parse("try {} catch (e) {}");
      traverse(ast, {
        enter(path) {
          expect(
            path.hub.buildError(path.node, "This should work"),
          ).toStrictEqual(TypeError("This should work"));
          // otherwise, this throws '"Cannot read properties of undefined (reading 'buildError')"'
          expect(path.getPathLocation()).toBe("program");
          path.stop();
        },
      });
    }
```

#### traverse no parent path

```ts
it("traverse no parent path", function () {
      const code = `
        var foo = {
            "files": []
        }
      `;
      const ast = parse(code);
      let result;
      traverse(ast, {
        ObjectProperty(path) {
          traverse(path.node, {
            noScope: true,
            ArrayExpression(path) {
              result = path.node;
            },
          });
        },
      });

      expect(ast.program.body[0].declarations[0].init.properties[0].value).toBe(
        result,
      );
    }
```

#### should stop the traversal when a grand child is stopped

```ts
it("should stop the traversal when a grand child is stopped", () => {
      const ast = parse("f;g;");

      let visitedCounter = 0;
      traverse(ast, {
        noScope: true,
        Identifier(path) {
          visitedCounter += 1;
          path.stop();
        },
      });

      expect(visitedCounter).toBe(1);
    }
```

#### can be reverted in the exit listener of the parent whose child is stopped

```ts
it("can be reverted in the exit listener of the parent whose child is stopped", () => {
      const ast = parse("f;g;");

      let visitedCounter = 0;
      traverse(ast, {
        noScope: true,
        Identifier(path) {
          visitedCounter += 1;
          path.stop();
        },
        ExpressionStatement: {
          exit(path) {
            path.shouldStop = false;
            path.shouldSkip = false;
          },
        },
      });

      expect(visitedCounter).toBe(2);
    }
```

#### should not affect root traversal

```ts
it("should not affect root traversal", () => {
      const ast = parse("f;g;");

      let visitedCounter = 0;
      let programShouldStop;
      traverse(ast, {
        noScope: true,
        Program(path) {
          path.traverse({
            noScope: true,
            Identifier(path) {
              visitedCounter += 1;
              path.stop();
            },
          });
          programShouldStop = path.shouldStop;
        },
      });

      expect(visitedCounter).toBe(1);
      expect(programShouldStop).toBe(false);
    }
```

### src_modules/cc6b13a61c-@babel_parser/packages/babel-core/test/resolution.js

#### should find module: presets

```ts
it("should find module: presets", function () {
    process.chdir("module-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      presets: ["module:preset"],
    });
  }
```

#### should find module: plugins

```ts
it("should find module: plugins", function () {
    process.chdir("module-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      plugins: ["module:plugin"],
    });
  }
```

#### should find standard presets

```ts
it("should find standard presets", function () {
    process.chdir("standard-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      presets: ["mod"],
    });
  }
```

#### should find standard plugins

```ts
it("should find standard plugins", function () {
    process.chdir("standard-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      plugins: ["mod"],
    });
  }
```

#### should find standard presets with an existing prefix

```ts
it("should find standard presets with an existing prefix", function () {
    process.chdir("standard-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      presets: ["babel-preset-mod"],
    });
  }
```

#### should find standard plugins with an existing prefix

```ts
it("should find standard plugins with an existing prefix", function () {
    process.chdir("standard-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      plugins: ["babel-plugin-mod"],
    });
  }
```

#### should find @babel scoped presets

```ts
it("should find @babel scoped presets", function () {
    process.chdir("babel-org-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      presets: ["@babel/foo"],
    });
  }
```

#### should find @babel scoped plugins

```ts
it("should find @babel scoped plugins", function () {
    process.chdir("babel-org-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      plugins: ["@babel/foo"],
    });
  }
```

#### should find @babel scoped presets with an existing prefix

```ts
it("should find @babel scoped presets with an existing prefix", function () {
    process.chdir("babel-org-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      presets: ["@babel/preset-foo"],
    });
  }
```

#### should find @babel scoped plugins with an existing prefix

```ts
it("should find @babel scoped plugins with an existing prefix", function () {
    process.chdir("babel-org-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      plugins: ["@babel/plugin-foo"],
    });
  }
```

#### should find @foo scoped presets

```ts
it("should find @foo scoped presets", function () {
    process.chdir("foo-org-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      presets: ["@foo/mod"],
    });
  }
```

#### should find @foo scoped plugins

```ts
it("should find @foo scoped plugins", function () {
    process.chdir("foo-org-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      plugins: ["@foo/mod"],
    });
  }
```

#### should find @foo scoped presets with an inner babel-preset

```ts
it("should find @foo scoped presets with an inner babel-preset", function () {
    process.chdir("foo-org-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      presets: ["@foo/thing.babel-preset-convert"],
    });
  }
```

#### should find @foo scoped plugins with an inner babel-plugin

```ts
it("should find @foo scoped plugins with an inner babel-plugin", function () {
    process.chdir("foo-org-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      plugins: ["@foo/thing.babel-plugin-convert"],
    });
  }
```

#### should find @foo scoped presets with an babel-preset suffix

```ts
it("should find @foo scoped presets with an babel-preset suffix", function () {
    process.chdir("foo-org-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      presets: ["@foo/thing-babel-preset"],
    });
  }
```

#### should find @foo scoped plugins with an babel-plugin suffix

```ts
it("should find @foo scoped plugins with an babel-plugin suffix", function () {
    process.chdir("foo-org-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      plugins: ["@foo/thing-babel-plugin"],
    });
  }
```

#### should find @foo scoped presets with an existing prefix

```ts
it("should find @foo scoped presets with an existing prefix", function () {
    process.chdir("foo-org-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      presets: ["@foo/babel-preset-mod"],
    });
  }
```

#### should find @foo scoped plugins with an existing prefix

```ts
it("should find @foo scoped plugins with an existing prefix", function () {
    process.chdir("foo-org-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      plugins: ["@foo/babel-plugin-mod"],
    });
  }
```

#### should find @foo/babel-plugin when specified

```ts
it("should find @foo/babel-plugin when specified", function () {
    process.chdir("foo-org-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      plugins: ["@foo/babel-plugin"],
    });
  }
```

#### should find @foo/babel-preset when specified

```ts
it("should find @foo/babel-preset when specified", function () {
    process.chdir("foo-org-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      presets: ["@foo/babel-preset"],
    });
  }
```

#### should find @foo/babel-plugin/index when specified

```ts
it("should find @foo/babel-plugin/index when specified", function () {
    process.chdir("foo-org-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      plugins: ["@foo/babel-plugin/index"],
    });
  }
```

#### should find @foo/babel-preset/index when specified

```ts
it("should find @foo/babel-preset/index when specified", function () {
    process.chdir("foo-org-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      presets: ["@foo/babel-preset/index"],
    });
  }
```

#### should find @foo/babel-plugin when just scope given

```ts
it("should find @foo/babel-plugin when just scope given", function () {
    process.chdir("foo-org-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      plugins: ["@foo"],
    });
  }
```

#### should find @foo/babel-preset when just scope given

```ts
it("should find @foo/babel-preset when just scope given", function () {
    process.chdir("foo-org-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      presets: ["@foo"],
    });
  }
```

#### should find relative path presets

```ts
it("should find relative path presets", function () {
    process.chdir("relative-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      presets: ["./dir/preset.js"],
    });
  }
```

#### should find relative path plugins

```ts
it("should find relative path plugins", function () {
    process.chdir("relative-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      plugins: ["./dir/plugin.js"],
    });
  }
```

#### should find module file presets

```ts
it("should find module file presets", function () {
    process.chdir("nested-module-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      presets: ["mod/preset"],
    });
  }
```

#### should find module file plugins

```ts
it("should find module file plugins", function () {
    process.chdir("nested-module-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      plugins: ["mod/plugin"],
    });
  }
```

#### should find @foo scoped module file presets

```ts
it("should find @foo scoped module file presets", function () {
    process.chdir("scoped-nested-module-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      presets: ["@foo/mod/preset"],
    });
  }
```

#### should find @foo scoped module file plugins

```ts
it("should find @foo scoped module file plugins", function () {
    process.chdir("scoped-nested-module-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      plugins: ["@foo/mod/plugin"],
    });
  }
```

#### should find @babel scoped module file presets

```ts
it("should find @babel scoped module file presets", function () {
    process.chdir("babel-scoped-nested-module-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      presets: ["@babel/mod/preset"],
    });
  }
```

#### should find @babel scoped module file plugins

```ts
it("should find @babel scoped module file plugins", function () {
    process.chdir("babel-scoped-nested-module-paths");

    babel.transformSync("", {
      filename: "filename.js",
      babelrc: false,
      plugins: ["@babel/mod/plugin"],
    });
  }
```

#### should throw about module: usage for presets

```ts
it("should throw about module: usage for presets", function () {
    process.chdir("throw-module-paths");

    expect(() => {
      babel.transformSync("", {
        filename: "filename.js",
        babelrc: false,
        presets: ["foo"],
      });
    }).toThrow(
      // Todo(Babel 8): remove node checks in this file. We cannot test the desired behaviour
      // because Jest 24 has an issue on setting the MODULE_NOT_FOUND error when the native
      // `require.resolve` is provided.
      // see https://github.com/babel/babel/pull/12439/files#r535996000
      parseInt(process.versions.node, 10) <= 10
        ? /Cannot (?:find|resolve) module 'babel-preset-foo'/
        : /Cannot (?:find|resolve) module 'babel-preset-foo'.*\n- If you want to resolve "foo", use "module:foo"/s,
    );
  }
```

#### should throw about module: usage for plugins

```ts
it("should throw about module: usage for plugins", function () {
    process.chdir("throw-module-paths");

    expect(() => {
      babel.transformSync("", {
        filename: "filename.js",
        babelrc: false,
        plugins: ["foo"],
      });
    }).toThrow(
      parseInt(process.versions.node, 10) <= 10
        ? /Cannot (?:find|resolve) module 'babel-plugin-foo'/
        : /Cannot (?:find|resolve) module 'babel-plugin-foo'.*\n- If you want to resolve "foo", use "module:foo"/s,
    );
  }
```

#### should throw about @babel usage for presets

```ts
it("should throw about @babel usage for presets", function () {
    process.chdir("throw-babel-paths");

    expect(() => {
      babel.transformSync("", {
        filename: "filename.js",
        babelrc: false,
        presets: ["foo"],
      });
    }).toThrow(
      parseInt(process.versions.node, 10) <= 10
        ? /Cannot (?:find|resolve) module 'babel-preset-foo'/
        : /Cannot (?:find|resolve) module 'babel-preset-foo'.*\n- Did you mean "@babel\/foo"\?/s,
    );
  }
```

#### should throw about @babel usage for plugins

```ts
it("should throw about @babel usage for plugins", function () {
    process.chdir("throw-babel-paths");

    expect(() => {
      babel.transformSync("", {
        filename: "filename.js",
        babelrc: false,
        plugins: ["foo"],
      });
    }).toThrow(
      parseInt(process.versions.node, 10) <= 10
        ? /Cannot (?:find|resolve) module 'babel-plugin-foo'/
        : /Cannot (?:find|resolve) module 'babel-plugin-foo'.*\n- Did you mean "@babel\/foo"\?/s,
    );
  }
```

#### should throw about passing a preset as a plugin

```ts
it("should throw about passing a preset as a plugin", function () {
    process.chdir("throw-opposite-paths");

    expect(() => {
      babel.transformSync("", {
        filename: "filename.js",
        babelrc: false,
        presets: ["testplugin"],
      });
    }).toThrow(
      parseInt(process.versions.node, 10) <= 10
        ? /Cannot (?:find|resolve) module 'babel-preset-testplugin'/
        : /Cannot (?:find|resolve) module 'babel-preset-testplugin'.*\n- Did you accidentally pass a plugin as a preset\?/s,
    );
  }
```

#### should throw about passing a plugin as a preset

```ts
it("should throw about passing a plugin as a preset", function () {
    process.chdir("throw-opposite-paths");

    expect(() => {
      babel.transformSync("", {
        filename: "filename.js",
        babelrc: false,
        plugins: ["testpreset"],
      });
    }).toThrow(
      parseInt(process.versions.node, 10) <= 10
        ? /Cannot (?:find|resolve) module 'babel-plugin-testpreset'/
        : /Cannot (?:find|resolve) module 'babel-plugin-testpreset'.*\n- Did you accidentally pass a preset as a plugin\?/s,
    );
  }
```

#### should throw about missing presets

```ts
it("should throw about missing presets", function () {
    process.chdir("throw-missing-paths");

    expect(() => {
      babel.transformSync("", {
        filename: "filename.js",
        babelrc: false,
        presets: ["foo"],
      });
    }).toThrow(/Cannot (?:find|resolve) module 'babel-preset-foo'/);
  }
```

#### should throw about missing plugins

```ts
it("should throw about missing plugins", function () {
    process.chdir("throw-missing-paths");

    expect(() => {
      babel.transformSync("", {
        filename: "filename.js",
        babelrc: false,
        plugins: ["foo"],
      });
    }).toThrow(/Cannot (?:find|resolve) module 'babel-plugin-foo'/);
  }
```

#### resolvePreset

```ts
it("resolvePreset", function () {
    expect(
      babel.resolvePreset("@babel/foo", path.join(base, "babel-org-paths")),
    ).toMatch(
      /babel-org-paths[\\/]node_modules[\\/]@babel[\\/]preset-foo[\\/]index.js/,
    );
  }
```

#### resolvePlugin

```ts
it("resolvePlugin", function () {
    expect(
      babel.resolvePlugin("@babel/foo", path.join(base, "babel-org-paths")),
    ).toMatch(
      /babel-org-paths[\\/]node_modules[\\/]@babel[\\/]plugin-foo[\\/]index.js/,
    );
  }
```

### src_modules/cc6b13a61c-@babel_parser/packages/babel-generator/test/preserve-format.js

#### identifier renaming

```ts
it("identifier renaming", () => {
      const input = `
        const foo = 3;
        const bar = 3;

        foo( x, y, z );
        bar( x, y, z );
      `;
      const expected = `
        const x   = 3;
        const longer=3;

        x  ( x, y, z );
        longer(x,y,z );
      `;

      const out = babel.transformSync(input, {
        configFile: false,
        plugins: [
          () => ({
            visitor: {
              Program(path) {
                path.scope.rename("foo", "x");
                path.scope.rename("bar", "longer");
              },
            },
          }),
        ],
        parserOpts: {
          createParenthesizedExpressions: true,
          tokens: true,
        },
        generatorOpts: {
          retainLines: true,
          experimental_preserveFormat: true,
        },
      });

      expect(out.code.trimEnd()).toBe(expected.trimEnd());
    }
```

#### node injection

```ts
it("node injection", () => {
      const input = `
        const    foo
            = 3;
                  const  bar          =
            3;
        bax
      `;
      const expected = `
        const    foo
            = 3;hello;
                  const  bar          =
            3;
        bax
      `;

      const out = babel.transformSync(input, {
        configFile: false,
        plugins: [
          ({ types: t }) => ({
            visitor: {
              Program(path) {
                path
                  .get("body.0")
                  .insertAfter(t.expressionStatement(t.identifier("hello")));
              },
            },
          }),
        ],
        parserOpts: {
          createParenthesizedExpressions: true,
          tokens: true,
        },
        generatorOpts: {
          retainLines: true,
          experimental_preserveFormat: true,
        },
      });

      expect(out.code.trimEnd()).toBe(expected.trimEnd());
    }
```

#### injects new semicolon when needed

```ts
it("injects new semicolon when needed", () => {
      const input = `
        const foo = 3
      `;
      const expected = `
        const foo = 3;hello;
      `;

      const out = babel.transformSync(input, {
        configFile: false,
        plugins: [
          ({ types: t }) => ({
            visitor: {
              Program(path) {
                path.pushContainer(
                  "body",
                  t.expressionStatement(t.identifier("hello")),
                );
              },
            },
          }),
        ],
        parserOpts: {
          createParenthesizedExpressions: true,
          tokens: true,
        },
        generatorOpts: {
          retainLines: true,
          experimental_preserveFormat: true,
        },
      });

      expect(out.code.trimEnd()).toBe(expected.trimEnd());
    }
```

#### injects new semicolon when needed, after a comment

```ts
it("injects new semicolon when needed, after a comment", () => {
      const input = `
        const foo = 3 /* comment */
      `;
      const expected = `
        const foo = 3 /* comment */;hello;
      `;

      const out = babel.transformSync(input, {
        configFile: false,
        plugins: [
          ({ types: t }) => ({
            visitor: {
              Program(path) {
                path.pushContainer(
                  "body",
                  t.expressionStatement(t.identifier("hello")),
                );
              },
            },
          }),
        ],
        parserOpts: {
          createParenthesizedExpressions: true,
          tokens: true,
        },
        generatorOpts: {
          retainLines: true,
          experimental_preserveFormat: true,
        },
      });

      expect(out.code.trimEnd()).toBe(expected.trimEnd());
    }
```

### src_modules/cc6b13a61c-@babel_parser/packages/babel-core/test/config-chain.js

#### should cache package.json files by mtime

```ts
it("should cache package.json files by mtime", () => {
        const filename = fixture(
          "complex-plugin-config",
          "config-identity",
          "pkg",
          "src.js",
        );
        const pkgJSON = fixture(
          "complex-plugin-config",
          "config-identity",
          "pkg",
          "package.json",
        );

        const opts1 = loadOptionsSync({
          filename,
          cwd: path.dirname(filename),
        });
        const opts2 = loadOptionsSync({
          filename,
          cwd: path.dirname(filename),
        });

        touch(pkgJSON);

        const opts3 = loadOptionsSync({
          filename,
          cwd: path.dirname(filename),
        });
        const opts4 = loadOptionsSync({
          filename,
          cwd: path.dirname(filename),
        });

        expect(opts1.plugins).toHaveLength(1);
        expect(opts2.plugins).toHaveLength(1);
        expect(opts1.plugins[0]).toBe(opts2.plugins[0]);

        expect(opts1.plugins).toHaveLength(1);
        expect(opts2.plugins).toHaveLength(1);
        expect(opts3.plugins[0]).toBe(opts4.plugins[0]);

        // Identity changed after touch().
        expect(opts1.plugins[0]).not.toBe(opts3.plugins[0]);
      }
```

#### should cache .babelrc files by mtime

```ts
it("should cache .babelrc files by mtime", () => {
        const filename = fixture(
          "complex-plugin-config",
          "config-identity",
          "babelrc",
          "src.js",
        );
        const babelrcFile = fixture(
          "complex-plugin-config",
          "config-identity",
          "babelrc",
          ".babelrc",
        );

        const opts1 = loadOptionsSync({
          filename,
          cwd: path.dirname(filename),
        });
        const opts2 = loadOptionsSync({
          filename,
          cwd: path.dirname(filename),
        });

        touch(babelrcFile);

        const opts3 = loadOptionsSync({
          filename,
          cwd: path.dirname(filename),
        });
        const opts4 = loadOptionsSync({
          filename,
          cwd: path.dirname(filename),
        });

        expect(opts1.plugins).toHaveLength(1);
        expect(opts2.plugins).toHaveLength(1);
        expect(opts1.plugins[0]).toBe(opts2.plugins[0]);

        expect(opts3.plugins).toHaveLength(1);
        expect(opts4.plugins).toHaveLength(1);
        expect(opts3.plugins[0]).toBe(opts4.plugins[0]);

        // Identity changed after touch().
        expect(opts1.plugins[0]).not.toBe(opts3.plugins[0]);
      }
```

#### should cache .babelrc.js files programmable behavior

```ts
it("should cache .babelrc.js files programmable behavior", () => {
        const filename = fixture(
          "complex-plugin-config",
          "config-identity",
          "babelrc-js",
          "src.js",
        );

        const opts1 = loadOptionsSync({
          filename,
          cwd: path.dirname(filename),
        });
        const opts2 = loadOptionsSync({
          filename,
          cwd: path.dirname(filename),
        });

        const opts3 = loadOptionsSync({
          filename,
          envName: "new-env",
          cwd: path.dirname(filename),
        });
        const opts4 = loadOptionsSync({
          filename,
          envName: "new-env",
          cwd: path.dirname(filename),
        });

        expect(opts1.plugins).toHaveLength(1);
        expect(opts2.plugins).toHaveLength(1);
        expect(opts1.plugins[0]).toBe(opts2.plugins[0]);

        expect(opts3.plugins).toHaveLength(1);
        expect(opts4.plugins).toHaveLength(1);
        expect(opts3.plugins[0]).toBe(opts4.plugins[0]);

        // Identity changed with different .env
        expect(opts1.plugins[0]).not.toBe(opts3.plugins[0]);
      }
```

#### should ignore package.json without a 'babel' property

```ts
it("should ignore package.json without a 'babel' property", () => {
        const filename = fixture("config-files", "pkg-ignored", "src.js");

        expect(
          loadOptionsSync({ filename, cwd: path.dirname(filename) }),
        ).toEqual({
          ...getDefaults(),
          filename: filename,
          cwd: path.dirname(filename),
          root: path.dirname(filename),
          comments: true,
        });
      }
```

#### loadPartialConfigSync should return a list of files that were extended

```ts
it("loadPartialConfigSync should return a list of files that were extended", () => {
        const filename = fixture("config-files", "babelrc-extended", "src.js");

        expect(
          babel.loadPartialConfigSync({
            filename,
            cwd: path.dirname(filename),
          }),
        ).toEqual({
          babelignore: fixture("config-files", ".babelignore"),
          babelrc: fixture("config-files", "babelrc-extended", ".babelrc"),
          config: undefined,
          fileHandling: "transpile",
          options: {
            ...getDefaults(),
            filename: filename,
            cwd: path.dirname(filename),
            root: path.dirname(filename),
            comments: true,
          },
          files: new Set([
            fixture("config-files", ".babelignore"),
            fixture("config-files", "babelrc-extended", ".babelrc-extended"),
            fixture("config-files", "babelrc-extended", ".babelrc"),
          ]),
        });
      }
```

#### loadPartialConfigSync should return null when ignored

```ts
it("loadPartialConfigSync should return null when ignored", () => {
        const filename = fixture("config-files", "babelignore", "src.js");

        expect(
          babel.loadPartialConfigSync({
            filename,
            cwd: path.dirname(filename),
          }),
        ).toBeNull();
      }
```

#### loadPartialConfigSync should return a list of files when ignored with showIgnoredFiles option

```ts
it("loadPartialConfigSync should return a list of files when ignored with showIgnoredFiles option", () => {
        const filename = fixture("config-files", "babelignore", "src.js");

        expect(
          babel.loadPartialConfigSync({
            filename,
            cwd: path.dirname(filename),
            showIgnoredFiles: true,
          }),
        ).toEqual({
          babelignore: fixture("config-files", "babelignore", ".babelignore"),
          babelrc: undefined,
          config: undefined,
          fileHandling: "ignored",
          options: {
            ...getDefaults(),
            filename: filename,
            cwd: path.dirname(filename),
            root: path.dirname(filename),
          },
          files: new Set([
            fixture("config-files", "babelignore", ".babelignore"),
          ]),
        });
      }
```

#### should not throw error on $schema property in json config files

```ts
it("should not throw error on $schema property in json config files", () => {
      const filename = fixture(
        "config-files",
        "babel-config-json-$schema-property",
        "babel.config.json",
      );
      expect(() => {
        babel.loadPartialConfigSync({
          filename,
          cwd: path.dirname(filename),
        });
      }).not.toThrow();
    }
```

## fs

**Consultas usadas no Horsebox:** `mkdirSync`, `fs mkdirSync`, `readdirSync`, `fs readdirSync`, `copyFileSync`, `fs copyFileSync`, `existsSync`, `fs existsSync`, `mkdtempSync`, `fs mkdtempSync`, `writeFileSync`, `fs writeFileSync`

**Arquivos de teste encontrados:** 195

### src_modules/9597e02587-@cyclonedx_cyclonedx-npm/tests/integration/cli.edge-cases.test.js

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

### src_modules/cc6b13a61c-@babel_parser/packages/babel-register/test/cache.js

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

### src_modules/cc6b13a61c-@babel_parser/packages/babel-core/test/parse.js

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

### src_modules/cc6b13a61c-@babel_parser/test/runtime-integration/node.cjs

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

### src_modules/cc6b13a61c-@babel_parser/packages/babel-generator/test/index.js

#### nested if statements needs block

```ts
it("nested if statements needs block", function () {
    const ifStatement = t.ifStatement(
      t.stringLiteral("top cond"),
      t.whileStatement(
        t.stringLiteral("while cond"),
        t.ifStatement(
          t.stringLiteral("nested"),
          t.expressionStatement(t.numericLiteral(1)),
        ),
      ),
      t.expressionStatement(t.stringLiteral("alt")),
    );

    const ast = parse(generate(ifStatement).code);
    expect(ast.program.body[0].consequent.type).toBe("BlockStatement");
  }
```

## os

**Consultas usadas no Horsebox:** `tmpdir`, `os tmpdir`

**Arquivos de teste encontrados:** 148

### src_modules/9597e02587-@cyclonedx_cyclonedx-npm/tests/integration/cli.edge-cases.test.js

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

