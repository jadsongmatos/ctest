# External tests for markdown-generator.js

**Arquivo:** `lib/markdown-generator.js`

## Checklist

- [ ] ./horsebox
- [ ] ./test-extractor
- [ ] ./utils
- [ ] fs
- [ ] path

## ./horsebox

Nenhum arquivo de teste encontrado pelo Horsebox para esta lib.

## ./test-extractor

Nenhum arquivo de teste encontrado pelo Horsebox para esta lib.

## ./utils

**Consultas usadas no Horsebox:** `uniq`, `./utils uniq`, `utils uniq`, `normalizeLibraryNames`, `./utils normalizeLibraryNames`, `utils normalizeLibraryNames`, `isTestFile`, `./utils isTestFile`, `utils isTestFile`

**Arquivos de teste encontrados:** 11

Horsebox encontrou arquivos candidatos, mas nenhum bloco `test()` / `it()` relevante foi extraído.

## fs

**Consultas usadas no Horsebox:** `existsSync`, `fs existsSync`, `writeFileSync`, `fs writeFileSync`

**Arquivos de teste encontrados:** 123

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

## path

**Consultas usadas no Horsebox:** `relative`, `path relative`, `sep`, `path sep`, `basename`, `path basename`

**Arquivos de teste encontrados:** 139

### src_modules/cc6b13a61c-@babel_parser/packages/babel-core/test/targets.js

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

