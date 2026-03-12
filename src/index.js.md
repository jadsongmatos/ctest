# External Tests for index.js

Testes de dependências externas usadas neste arquivo.

**Arquivo:** `/workspaces/ctest/src/index.js`

## Sumário

- **Total de componentes:** 6
- **Total de arquivos de teste:** 14

---

## path-scurry@

**Funções usados neste arquivo:** resolve

### index.ts.test.cjs

**Caminho original:** `/tmp/ctest-repos-z91GLV/afdea7bc35-path-scurry/tap-snapshots/test/index.ts.test.cjs`

**Funções testadas:**

- `resolve`

**Conteúdo do arquivo de teste:**

```javascript
/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/index.ts > TAP > eloop > async > must match snapshot 1`] = `
Object {
  "a/bb/c/dd/e/ff/g": "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e/f/g",
  "aa/b/cc/d/ee/f/gg": "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e/f/g",
  "bigloop": undefined,
  "dest": "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e/f/g/dest",
  "enoent": undefined,
  "pivot": undefined,
  "roundtrip": "{CWD}/.tap/fixtures/test-index.ts-eloop/home",
}
`

exports[`test/index.ts > TAP > eloop > sync > must match snapshot 1`] = `
Object {
  "a/bb/c/dd/e/ff/g": "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e/f/g",
  "aa/b/cc/d/ee/f/gg": "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e/f/g",
  "bigloop": undefined,
  "dest": "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e/f/g/dest",
  "enoent": undefined,
  "pivot": undefined,
  "roundtrip": "{CWD}/.tap/fixtures/test-index.ts-eloop/home",
}
`

exports[`test/index.ts > TAP > eloop > walk this beast > must match snapshot 1`] = `
Array [
  "{CWD}/.tap/fixtures/test-index.ts-eloop",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/down",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e/down",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e/f",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e/f/down",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e/f/g",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e/f/g/bounce",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e/f/g/dest",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e/f/g/down",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e/f/g/round",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e/f/g/up",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e/f/gg",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e/f/round",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e/f/travel",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e/f/up",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e/ff",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e/round",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e/travel",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/e/up",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/ee",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/round",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/travel",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/d/up",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/dd",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/down",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/round",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/travel",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/c/up",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/cc",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/down",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/round",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/travel",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/b/up",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/bb",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/down",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/peak",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/round",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/travel",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/a/up",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/aa",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/bigloop",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/dest",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/enoent",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/home",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/pivot",
  "{CWD}/.tap/fixtures/test-index.ts-eloop/roundtrip",
]
`

exports[`test/index.ts > TAP > walking > follow=false, filter=false, walkFilter=false > initial walk, sync > must match snapshot 1`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
}
`

exports[`test/index.ts > TAP > walking > follow=false, filter=false, walkFilter=false > initial walk, sync > must match snapshot 2`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
}
`

exports[`test/index.ts > TAP > walking > follow=false, filter=false, walkFilter=false > initial walk, sync > must match snapshot 3`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
}
`

exports[`test/index.ts > TAP > walking > follow=false, filter=false, walkFilter=false > initial walk, sync > must match snapshot 4`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
}
`

exports[`test/index.ts > TAP > walking > follow=false, filter=false, walkFilter=true > initial walk, sync > must match snapshot 1`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
}
`

exports[`test/index.ts > TAP > walking > follow=false, filter=false, walkFilter=true > initial walk, sync > must match snapshot 2`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
}
`

exports[`test/index.ts > TAP > walking > follow=false, filter=false, walkFilter=true > initial walk, sync > must match snapshot 3`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
}
`

exports[`test/index.ts > TAP > walking > follow=false, filter=false, walkFilter=true > initial walk, sync > must match snapshot 4`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
}
`

exports[`test/index.ts > TAP > walking > follow=false, filter=true, walkFilter=false > initial walk, sync > must match snapshot 1`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
}
`

exports[`test/index.ts > TAP > walking > follow=false, filter=true, walkFilter=false > initial walk, sync > must match snapshot 2`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
}
`

exports[`test/index.ts > TAP > walking > follow=false, filter=true, walkFilter=false > initial walk, sync > must match snapshot 3`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
}
`

exports[`test/index.ts > TAP > walking > follow=false, filter=true, walkFilter=false > initial walk, sync > must match snapshot 4`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
}
`

exports[`test/index.ts > TAP > walking > follow=false, filter=true, walkFilter=true > initial walk, sync > must match snapshot 1`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
}
`

exports[`test/index.ts > TAP > walking > follow=false, filter=true, walkFilter=true > initial walk, sync > must match snapshot 2`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
}
`

exports[`test/index.ts > TAP > walking > follow=false, filter=true, walkFilter=true > initial walk, sync > must match snapshot 3`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
}
`

exports[`test/index.ts > TAP > walking > follow=false, filter=true, walkFilter=true > initial walk, sync > must match snapshot 4`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
}
`

exports[`test/index.ts > TAP > walking > follow=true, filter=false, walkFilter=false > initial walk, sync > must match snapshot 1`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/x/outside",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
}
`

exports[`test/index.ts > TAP > walking > follow=true, filter=false, walkFilter=false > initial walk, sync > must match snapshot 2`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/x/outside",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
}
`

exports[`test/index.ts > TAP > walking > follow=true, filter=false, walkFilter=false > initial walk, sync > must match snapshot 3`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/x/outside",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
}
`

exports[`test/index.ts > TAP > walking > follow=true, filter=false, walkFilter=false > initial walk, sync > must match snapshot 4`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/x/outside",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
}
`

exports[`test/index.ts > TAP > walking > follow=true, filter=false, walkFilter=true > initial walk, sync > must match snapshot 1`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/x/outside",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
}
`

exports[`test/index.ts > TAP > walking > follow=true, filter=false, walkFilter=true > initial walk, sync > must match snapshot 2`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/x/outside",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
}
`

exports[`test/index.ts > TAP > walking > follow=true, filter=false, walkFilter=true > initial walk, sync > must match snapshot 3`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/x/outside",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
}
`

exports[`test/index.ts > TAP > walking > follow=true, filter=false, walkFilter=true > initial walk, sync > must match snapshot 4`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/x/outside",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
}
`

exports[`test/index.ts > TAP > walking > follow=true, filter=true, walkFilter=false > initial walk, sync > must match snapshot 1`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/x/outside",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
}
`

exports[`test/index.ts > TAP > walking > follow=true, filter=true, walkFilter=false > initial walk, sync > must match snapshot 2`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/x/outside",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
}
`

exports[`test/index.ts > TAP > walking > follow=true, filter=true, walkFilter=false > initial walk, sync > must match snapshot 3`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/x/outside",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
}
`

exports[`test/index.ts > TAP > walking > follow=true, filter=true, walkFilter=false > initial walk, sync > must match snapshot 4`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/x/outside",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
}
`

exports[`test/index.ts > TAP > walking > follow=true, filter=true, walkFilter=true > initial walk, sync > must match snapshot 1`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/x/outside",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
}
`

exports[`test/index.ts > TAP > walking > follow=true, filter=true, walkFilter=true > initial walk, sync > must match snapshot 2`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/x/outside",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
}
`

exports[`test/index.ts > TAP > walking > follow=true, filter=true, walkFilter=true > initial walk, sync > must match snapshot 3`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/x/outside",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
}
`

exports[`test/index.ts > TAP > walking > follow=true, filter=true, walkFilter=true > initial walk, sync > must match snapshot 4`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/x/outside",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
}
`

exports[`test/index.ts > TAP > walking > follow=undefined, filter=false, walkFilter=false > initial walk, sync > must match snapshot 1`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
}
`

exports[`test/index.ts > TAP > walking > follow=undefined, filter=false, walkFilter=false > initial walk, sync > must match snapshot 2`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
}
`

exports[`test/index.ts > TAP > walking > follow=undefined, filter=false, walkFilter=false > initial walk, sync > must match snapshot 3`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
}
`

exports[`test/index.ts > TAP > walking > follow=undefined, filter=false, walkFilter=false > initial walk, sync > must match snapshot 4`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
}
`

exports[`test/index.ts > TAP > walking > follow=undefined, filter=false, walkFilter=true > initial walk, sync > must match snapshot 1`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
}
`

exports[`test/index.ts > TAP > walking > follow=undefined, filter=false, walkFilter=true > initial walk, sync > must match snapshot 2`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
}
`

exports[`test/index.ts > TAP > walking > follow=undefined, filter=false, walkFilter=true > initial walk, sync > must match snapshot 3`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
}
`

exports[`test/index.ts > TAP > walking > follow=undefined, filter=false, walkFilter=true > initial walk, sync > must match snapshot 4`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d",
}
`

exports[`test/index.ts > TAP > walking > follow=undefined, filter=true, walkFilter=false > initial walk, sync > must match snapshot 1`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
}
`

exports[`test/index.ts > TAP > walking > follow=undefined, filter=true, walkFilter=false > initial walk, sync > must match snapshot 2`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
}
`

exports[`test/index.ts > TAP > walking > follow=undefined, filter=true, walkFilter=false > initial walk, sync > must match snapshot 3`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
}
`

exports[`test/index.ts > TAP > walking > follow=undefined, filter=true, walkFilter=false > initial walk, sync > must match snapshot 4`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/d/cycle",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/g",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/f",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/e",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c/d/cycle",
}
`

exports[`test/index.ts > TAP > walking > follow=undefined, filter=true, walkFilter=true > initial walk, sync > must match snapshot 1`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
}
`

exports[`test/index.ts > TAP > walking > follow=undefined, filter=true, walkFilter=true > initial walk, sync > must match snapshot 2`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
}
`

exports[`test/index.ts > TAP > walking > follow=undefined, filter=true, walkFilter=true > initial walk, sync > must match snapshot 3`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
}
`

exports[`test/index.ts > TAP > walking > follow=undefined, filter=true, walkFilter=true > initial walk, sync > must match snapshot 4`] = `
Set {
  "{CWD}/.tap/fixtures/test-index.ts-walking/a",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/x",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/empty",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/deeplink",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b",
  "{CWD}/.tap/fixtures/test-index.ts-walking/a/b/c",
}
`

```

---


## path-exists@

**Funções usados neste arquivo:** resolve

### test.js

**Caminho original:** `/tmp/ctest-repos-z91GLV/c7cde3e261-path-exists/test.js`

**Funções testadas:**

- `resolve`

**Conteúdo do arquivo de teste:**

```javascript
import test from 'ava';
import pathExists from '.';

test('async', async t => {
	t.true(await pathExists('test.js'));
	t.false(await pathExists('fail'));
});

test('sync', t => {
	t.true(pathExists.sync('test.js'));
	t.false(pathExists.sync('fail'));
});

```

---


## path-key@

**Funções usados neste arquivo:** resolve

### test.js

**Caminho original:** `/tmp/ctest-repos-z91GLV/bfb4e2a9c2-path-key/test.js`

**Funções testadas:**

- `resolve`

**Conteúdo do arquivo de teste:**

```javascript
import test from 'ava';
import pathKey from '.';

test('main', t => {
	t.is(pathKey().toUpperCase(), 'PATH');
	t.is(pathKey({env: {PATH: ''}}), 'PATH');
	t.is(pathKey({env: {Path: ''}, platform: 'win32'}), 'Path');
	t.is(pathKey({env: {}, platform: 'darwin'}), 'PATH');
	t.is(pathKey({env: {}, platform: 'win32'}), 'Path');
	t.is(pathKey({env: {Path: '', PATH: ''}, platform: 'win32'}), 'PATH');
	t.is(pathKey({env: {PATH: '', Path: ''}, platform: 'win32'}), 'Path');
});

```

---


## path-is-absolute@

**Funções usados neste arquivo:** resolve

### test.js

**Caminho original:** `/tmp/ctest-repos-z91GLV/9adaed72d2-path-is-absolute/test.js`

**Funções testadas:**

- `resolve`

**Conteúdo do arquivo de teste:**

```javascript
var assert = require('assert');
var pathIsAbsolute = require('./');

var path = {
	posix: {
		isAbsolute: pathIsAbsolute.posix
	},
	win32: {
		isAbsolute: pathIsAbsolute.win32
	}
};

// https://github.com/joyent/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/test/simple/test-path.js#L344
assert.equal(path.win32.isAbsolute('//server/file'), true);
assert.equal(path.win32.isAbsolute('\\\\server\\file'), true);
assert.equal(path.win32.isAbsolute('C:/Users/'), true);
assert.equal(path.win32.isAbsolute('C:\\Users\\'), true);
assert.equal(path.win32.isAbsolute('C:cwd/another'), false);
assert.equal(path.win32.isAbsolute('C:cwd\\another'), false);
assert.equal(path.win32.isAbsolute('directory/directory'), false);
assert.equal(path.win32.isAbsolute('directory\\directory'), false);

assert.equal(path.posix.isAbsolute('/home/foo'), true);
assert.equal(path.posix.isAbsolute('/home/foo/..'), true);
assert.equal(path.posix.isAbsolute('bar/'), false);
assert.equal(path.posix.isAbsolute('./baz'), false);

```

---


## fs@

**Funções usados neste arquivo:** existsSync

### get-options.js

**Caminho original:** `/tmp/ctest-repos-z91GLV/3f4bb586f0-fs/test/common/get-options.js`

**Funções testadas:**

- `existsSync`

**Conteúdo do arquivo de teste:**

```javascript
const t = require('tap')

const getOptions = require('../../lib/common/get-options.js')

t.test('copies named properties in an object', async (t) => {
  const input = {
    one: 'one',
    two: 'two',
    three: 'three',
  }

  const result = getOptions(input, {
    copy: ['one', 'two'],
  })
  t.same(result, { one: 'one', two: 'two' }, 'only copied named properties')
})

t.test('wraps non-object values in named property', async (t) => {
  const input = 'bar'

  const result = getOptions(input, {
    wrap: 'foo',
  })
  t.same(result, { foo: 'bar' }, 'wrapped non-object in object')
})

```

---

### node.js

**Caminho original:** `/tmp/ctest-repos-z91GLV/3f4bb586f0-fs/test/common/node.js`

**Funções testadas:**

- `existsSync`

**Conteúdo do arquivo de teste:**

```javascript
const t = require('tap')

const node = require('../../lib/common/node.js')

// strip off leading 'v'
const version = process.version.slice(1)
const major = Number(version.split('.')[0])

t.test('returns true if range matches', async (t) => {
  const range = `^${major}`
  t.equal(node.satisfies(range), true, 'range matches')
})

t.test('returns false if range does not match', async (t) => {
  const range = `^${major + 1}`
  t.equal(node.satisfies(range), false, 'range does not match')
})

```

---

### errors.js

**Caminho original:** `/tmp/ctest-repos-z91GLV/3f4bb586f0-fs/test/cp/errors.js`

**Funções testadas:**

- `existsSync`

**Conteúdo do arquivo de teste:**

```javascript
const t = require('tap')
const { ERR_FS_EISDIR } = require('../../lib/cp/errors')
const { constants: { errno: { EISDIR, EIO } } } = require('os')
const { inspect } = require('util')

t.test('message with path and dest', async t => {
  const err = new ERR_FS_EISDIR({
    path: 'path',
    dest: 'dest',
    syscall: 'cp',
    code: EISDIR,
    message: 'failed',
  })

  t.equal(err.message, `Path is a directory: cp returned ${EISDIR} (failed) path => dest`)
})

t.test('message without path or dest', async t => {
  const err = new ERR_FS_EISDIR({
    syscall: 'cp',
    code: EISDIR,
    message: 'failed',
  })

  t.equal(err.message, `Path is a directory: cp returned ${EISDIR} (failed)`)
})

t.test('errno is alias for info.errno', async t => {
  const err = new ERR_FS_EISDIR({ errno: EISDIR })
  t.equal(err.errno, EISDIR)
  t.equal(err.info.errno, EISDIR)
  err.errno = EIO
  t.equal(err.errno, EIO)
  t.equal(err.info.errno, EIO)
})

t.test('syscall is alias for info.syscall', async t => {
  const err = new ERR_FS_EISDIR({ syscall: 'cp' })
  t.equal(err.syscall, 'cp')
  t.equal(err.info.syscall, 'cp')
  err.syscall = 'readlink'
  t.equal(err.syscall, 'readlink')
  t.equal(err.info.syscall, 'readlink')
})

t.test('path is alias for info.path', async t => {
  const err = new ERR_FS_EISDIR({ path: 'first' })
  t.equal(err.path, 'first')
  t.equal(err.info.path, 'first')
  err.path = 'second'
  t.equal(err.path, 'second')
  t.equal(err.info.path, 'second')
})

t.test('dest is alias for info.dest', async t => {
  const err = new ERR_FS_EISDIR({ dest: 'first' })
  t.equal(err.dest, 'first')
  t.equal(err.info.dest, 'first')
  err.dest = 'second'
  t.equal(err.dest, 'second')
  t.equal(err.info.dest, 'second')
})

t.test('toString', async t => {
  const err = new ERR_FS_EISDIR({
    syscall: 'cp',
    code: EISDIR,
    message: 'failed',
  })
  t.equal(err.toString(),
    `SystemError [ERR_FS_EISDIR]: Path is a directory: cp returned ${EISDIR} (failed)`)
})

t.test('inspect', async t => {
  const err = new ERR_FS_EISDIR({
    syscall: 'cp',
    errno: EISDIR,
    message: 'failed',
  })
  t.ok(inspect(err))
})

```

---

### index.js

**Caminho original:** `/tmp/ctest-repos-z91GLV/3f4bb586f0-fs/test/cp/index.js`

**Funções testadas:**

- `existsSync`

**Conteúdo do arquivo de teste:**

```javascript
const { stat } = require('fs/promises')
const { join } = require('path')
const t = require('tap')

const cp = require('../../lib/cp/index.js')

t.test('can copy a file', async (t) => {
  const dir = t.testdir({
    file: 'some random file',
  })
  const src = join(dir, 'file')
  const dest = join(dir, 'dest')

  await cp(src, dest)

  const exists = await stat(dest).then(() => true).catch(() => false)
  t.equal(exists, true, 'dest exits')
})

t.test('can copy a directory', async (t) => {
  const dir = t.testdir({
    directory: {},
  })
  const src = join(dir, 'directory')
  const dest = join(dir, 'dest')

  await cp(src, dest, { recursive: true })

  const exists = await stat(dest).then(() => true).catch(() => false)
  t.equal(exists, true, 'dest exists')
})

```

---

### polyfill.js

**Caminho original:** `/tmp/ctest-repos-z91GLV/3f4bb586f0-fs/test/cp/polyfill.js`

**Funções testadas:**

- `existsSync`

**Conteúdo do arquivo de teste:**

```javascript
const fs = require('fs')
const {
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  symlinkSync,
  statSync,
  writeFileSync,
} = fs

const net = require('net')
const { join } = require('path')
const { pathToFileURL } = require('url')
const t = require('tap')

const cp = require('../../lib/cp/polyfill')

const isWindows = process.platform === 'win32'
const tmpdir = t.testdir({
  'kitchen-sink': {
    a: {
      b: {
        'index.js': 'module.exports = { purpose: "testing copy" };',
        'README2.md': '# Hello',
      },
      c: {
        d: {
          'index.js': 'module.exports = { purpose: "testing copy" };',
          'README3.md': '# Hello',
        },
      },
      'index.js': 'module.exports = { purpose: "testing copy" };',
      'README2.md': '# Hello',
    },
    'index.js': 'module.exports = { purpose: "testing copy" };',
    'README.md': '# Hello',
  },
})
const kitchenSink = join(tmpdir, 'kitchen-sink')

let dirc = 0
function nextdir () {
  return join(tmpdir, `copy_${++dirc}`)
}

t.test('It copies a nested folder structure with files and folders.', async t => {
  const src = kitchenSink
  const dest = nextdir()
  await cp(src, dest, { recursive: true })
  assertDirEquivalent(t, src, dest)
})

t.test('It does not throw errors when directory is copied over and force is false.', async t => {
  const src = nextdir()
  mkdirSync(join(src, 'a', 'b'), { recursive: true })
  writeFileSync(join(src, 'README.md'), 'hello world', 'utf8')
  const dest = nextdir()
  await cp(src, dest, { dereference: true, recursive: true })
  const initialStat = lstatSync(join(dest, 'README.md'))
  await cp(src, dest, {
    dereference: true,
    force: false,
    recursive: true,
  })

  // File should not have been copied over, so access times will be identical:
  const finalStat = lstatSync(join(dest, 'README.md'))
  t.equal(finalStat.ctime.getTime(), initialStat.ctime.getTime())
})

t.test('It overwrites existing files if force is true.', async t => {
  const src = kitchenSink
  const dest = nextdir()
  mkdirSync(dest, { recursive: true })
  writeFileSync(join(dest, 'README.md'), '# Goodbye', 'utf8')

  await cp(src, dest, { recursive: true })
  assertDirEquivalent(t, src, dest)
  const content = readFileSync(join(dest, 'README.md'), 'utf8')
  t.equal(content.trim(), '# Hello')
})

t.test('It can overwrite directory when dereference is true and force is false', async t => {
  const src = kitchenSink
  const dest = nextdir()
  const destFile = join(dest, 'a/b/README2.md')
  await cp(src, dest, { dereference: true, recursive: true })

  await cp(src, dest, {
    dereference: true,
    recursive: true,
  })
  const stat = lstatSync(destFile)
  t.ok(stat.isFile())
})

t.test('It copies file itself, rather than symlink, when dereference is true.', async t => {
  const src = nextdir()
  mkdirSync(src, { recursive: true })
  writeFileSync(join(src, 'foo.js'), 'foo', 'utf8')
  symlinkSync(join(src, 'foo.js'), join(src, 'bar.js'))

  const dest = nextdir()
  mkdirSync(dest, { recursive: true })
  const destFile = join(dest, 'foo.js')

  await cp(join(src, 'bar.js'), destFile, { dereference: true })
  const stat = lstatSync(destFile)
  t.ok(stat.isFile())
})

t.test('It copies relative symlinks', async t => {
  const src = nextdir()
  mkdirSync(src, { recursive: true })
  writeFileSync(join(src, 'foo.js'), 'foo', 'utf8')
  symlinkSync('./foo.js', join(src, 'bar.js'))

  const dest = nextdir()
  const destFile = join(dest, 'bar.js')
  mkdirSync(dest, { recursive: true })
  writeFileSync(join(dest, 'foo.js'), 'foo', 'utf8')
  symlinkSync('./foo.js', destFile)

  await cp(src, dest, { recursive: true })
  const stat = lstatSync(destFile)
  t.ok(stat.isSymbolicLink())
})

t.test('It returns error when src and dest are identical.', async t => {
  t.rejects(
    cp(kitchenSink, kitchenSink),
    { code: 'ERR_FS_CP_EINVAL' })
})

t.test('It returns error if symlink in src points to location in dest.', async t => {
  const src = nextdir()
  mkdirSync(src, { recursive: true })
  const dest = nextdir()
  mkdirSync(dest)
  symlinkSync(dest, join(src, 'link'))
  await cp(src, dest, { recursive: true })
  t.rejects(
    cp(src, dest, { recursive: true }),
    { code: 'ERR_FS_CP_EINVAL' })
})

t.test('It returns error if symlink in dest points to location in src.', async t => {
  const src = nextdir()
  mkdirSync(join(src, 'a', 'b'), { recursive: true })
  symlinkSync(join(src, 'a', 'b'), join(src, 'a', 'c'))

  const dest = nextdir()
  mkdirSync(join(dest, 'a'), { recursive: true })
  symlinkSync(src, join(dest, 'a', 'c'))
  t.rejects(
    cp(src, dest, { recursive: true }),
    { code: 'ERR_FS_CP_SYMLINK_TO_SUBDIRECTORY' })
})

t.test('It returns error if parent directory of symlink in dest points to src.', async t => {
  const src = nextdir()
  mkdirSync(join(src, 'a'), { recursive: true })
  const dest = nextdir()
  // Create symlink in dest pointing to src.
  const destLink = join(dest, 'b')
  mkdirSync(dest, { recursive: true })
  symlinkSync(src, destLink)
  t.rejects(
    cp(src, join(dest, 'b', 'c')),
    { code: 'ERR_FS_CP_EINVAL' })
})

t.test('It returns error if attempt is made to copy directory to file.', async t => {
  const src = nextdir()
  mkdirSync(src, { recursive: true })
  const dest = join(kitchenSink, 'README.md')
  t.rejects(
    cp(src, dest),
    { code: 'ERR_FS_CP_DIR_TO_NON_DIR' })
})

t.test('It allows file to be copied to a file path.', async t => {
  const srcFile = join(kitchenSink, 'README.md')
  const destFile = join(nextdir(), 'index.js')
  await cp(srcFile, destFile, { dereference: true })
  const stat = lstatSync(destFile)
  t.ok(stat.isFile())
})

t.test('It returns error if directory copied without recursive flag.', async t => {
  const src = kitchenSink
  const dest = nextdir()
  t.rejects(
    cp(src, dest),
    { code: 'ERR_FS_EISDIR' })
})

t.test('It returns error if attempt is made to copy file to directory.', async t => {
  const src = join(kitchenSink, 'README.md')
  const dest = nextdir()
  mkdirSync(dest, { recursive: true })
  t.rejects(
    cp(src, dest),
    { code: 'ERR_FS_CP_NON_DIR_TO_DIR' })
})

t.test('It returns error if attempt is made to copy to subdirectory of self.', async t => {
  const src = kitchenSink
  const dest = join(kitchenSink, 'a')
  t.rejects(
    cp(src, dest),
    { code: 'ERR_FS_CP_EINVAL' })
})

t.test('It returns an error if attempt is made to copy socket.', { skip: isWindows }, async t => {
  const dest = nextdir()
  const sock = `${process.pid}.sock`
  const server = net.createServer()
  server.listen(sock)
  t.teardown(() => server.close())
  t.rejects(
    cp(sock, dest),
    { code: 'ERR_FS_CP_SOCKET' })
})

t.test('It copies timestamps from src to dest if preserveTimestamps is true.', async t => {
  const src = kitchenSink
  const dest = nextdir()
  await cp(src, dest, {
    preserveTimestamps: true,
    recursive: true,
  })
  assertDirEquivalent(t, src, dest)
  const srcStat = lstatSync(join(src, 'index.js'))
  const destStat = lstatSync(join(dest, 'index.js'))
  t.equal(srcStat.mtime.getTime(), destStat.mtime.getTime())
})

t.test('It applies filter function.', async t => {
  const src = kitchenSink
  const dest = nextdir()
  await cp(src, dest, {
    filter: (path) => {
      const pathStat = statSync(path)
      return pathStat.isDirectory() || path.endsWith('.js')
    },
    dereference: true,
    recursive: true,
  })
  const destEntries = []
  collectEntries(dest, destEntries)
  for (const entry of destEntries) {
    t.equal(
      entry.isDirectory() || entry.name.endsWith('.js'),
      true
    )
  }
})

t.test('It supports async filter function.', async t => {
  const src = kitchenSink
  const dest = nextdir()
  await cp(src, dest, {
    filter: async (path) => {
      const pathStat = statSync(path)
      return pathStat.isDirectory() || path.endsWith('.js')
    },
    dereference: true,
    recursive: true,
  })
  const destEntries = []
  collectEntries(dest, destEntries)
  for (const entry of destEntries) {
    t.equal(
      entry.isDirectory() || entry.name.endsWith('.js'),
      true
    )
  }
})

t.test('It errors on overwrite if force is false and errorOnExist is true', async t => {
  const src = kitchenSink
  const dest = nextdir()
  await cp(src, dest, { recursive: true })
  t.rejects(
    cp(src, dest, {
      dereference: true,
      errorOnExist: true,
      force: false,
      recursive: true,
    }),
    { code: 'ERR_FS_CP_EEXIST' })
})

t.test('It returns EEXIST error if attempt is made to copy symlink over file.', async t => {
  const src = nextdir()
  mkdirSync(join(src, 'a', 'b'), { recursive: true })
  symlinkSync(join(src, 'a', 'b'), join(src, 'a', 'c'))

  const dest = nextdir()
  mkdirSync(join(dest, 'a'), { recursive: true })
  writeFileSync(join(dest, 'a', 'c'), 'hello', 'utf8')
  t.rejects(
    cp(src, dest, { recursive: true }),
    { code: 'EEXIST' })
})

t.test('It makes file writeable when updating timestamp, if not writeable.', async t => {
  const src = nextdir()
  mkdirSync(src, { recursive: true })
  const dest = nextdir()
  mkdirSync(dest, { recursive: true })
  writeFileSync(join(src, 'foo.txt'), 'foo', { mode: 0o444 })
  await cp(src, dest, {
    preserveTimestamps: true,
    recursive: true,
  })
  assertDirEquivalent(t, src, dest)
  const srcStat = lstatSync(join(src, 'foo.txt'))
  const destStat = lstatSync(join(dest, 'foo.txt'))
  t.equal(srcStat.mtime.getTime(), destStat.mtime.getTime())
})

t.test('It copies link if it does not point to folder in src.', async t => {
  const src = nextdir()
  mkdirSync(join(src, 'a', 'b'), { recursive: true })
  symlinkSync(src, join(src, 'a', 'c'))
  const dest = nextdir()
  mkdirSync(join(dest, 'a'), { recursive: true })
  symlinkSync(dest, join(dest, 'a', 'c'))
  await cp(src, dest, { recursive: true })
  const link = readlinkSync(join(dest, 'a', 'c'))
  t.equal(link, src)
})

t.test('It accepts file URL as src and dest.', async t => {
  const src = kitchenSink
  const dest = nextdir()
  await cp(pathToFileURL(src), pathToFileURL(dest), { recursive: true })
  assertDirEquivalent(t, src, dest)
})

t.test('It throws if options is not object.', async t => {
  t.rejects(
    () => cp('a', 'b', 'hello'),
    { code: 'ERR_INVALID_ARG_TYPE' })
})

function assertDirEquivalent (t, dir1, dir2) {
  const dir1Entries = []
  collectEntries(dir1, dir1Entries)
  const dir2Entries = []
  collectEntries(dir2, dir2Entries)
  t.equal(dir1Entries.length, dir2Entries.length)
  for (const entry1 of dir1Entries) {
    const entry2 = dir2Entries.find((entry) => {
      return entry.name === entry1.name
    })
    t.ok(entry2, `entry ${entry2.name} not copied`)
    if (entry1.isFile()) {
      t.ok(entry2.isFile(), `${entry2.name} was not file`)
    } else if (entry1.isDirectory()) {
      t.ok(entry2.isDirectory(), `${entry2.name} was not directory`)
    } else if (entry1.isSymbolicLink()) {
      t.ok(entry2.isSymbolicLink(), `${entry2.name} was not symlink`)
    }
  }
}

function collectEntries (dir, dirEntries) {
  const newEntries = readdirSync(dir, { withFileTypes: true })
  for (const entry of newEntries) {
    if (entry.isDirectory()) {
      collectEntries(join(dir, entry.name), dirEntries)
    }
  }
  dirEntries.push(...newEntries)
}

```

---

### move-file.js

**Caminho original:** `/tmp/ctest-repos-z91GLV/3f4bb586f0-fs/test/move-file.js`

**Funções testadas:**

- `existsSync`

**Conteúdo do arquivo de teste:**

```javascript
const fs = require('fs/promises')
const fsSync = require('fs')
const { join } = require('path')
const t = require('tap')
const moveFile = require('../lib/move-file.js')

const fixture = '🦄'

t.test('missing `source` or `destination` throws', t => t.rejects(moveFile()))

t.test('move a file', async t => {
  const dir = t.testdir({
    src: fixture,
  })
  const dest = `${dir}/dest`
  await moveFile(`${dir}/src`, dest)
  t.equal(fsSync.readFileSync(dest, 'utf8'), fixture)
})

t.test('move a directory', async t => {
  const dir = t.testdir({
    src: {
      one: fixture,
      two: fixture,
      sub: {
        three: fixture,
        four: fixture,
        five: t.fixture('symlink', './four'),
      },
      link: t.fixture('symlink', './sub'),
    },
  })
  const dest = `${dir}/dest`
  await moveFile(`${dir}/src`, dest)
  const destStat = fsSync.statSync(dest)
  t.ok(destStat.isDirectory(), 'created a directory')
  t.equal(fsSync.readFileSync(`${dest}/one`, 'utf8'), fixture, 'copied file one')
  t.equal(fsSync.readFileSync(`${dest}/two`, 'utf8'), fixture, 'copied file two')
  const subStat = fsSync.statSync(`${dest}/sub`)
  t.ok(subStat.isDirectory(), 'created the subdirectory')
  t.equal(fsSync.readFileSync(`${dest}/sub/three`, 'utf8'), fixture, 'copied file three')
  t.equal(fsSync.readFileSync(`${dest}/sub/four`, 'utf8'), fixture, 'copied file four')
  t.ok(fsSync.lstatSync(`${dest}/sub/five`).isSymbolicLink(), 'created a file symbolic link')
  t.equal(fsSync.realpathSync(`${dest}/sub/five`), join(dest, 'sub/four'), 'created file symlink')
  t.equal(fsSync.readFileSync(`${dest}/sub/five`, 'utf8'), fixture, 'copied file four')
  t.ok(fsSync.lstatSync(`${dest}/link`).isSymbolicLink(), 'created a directory symbolic link')
})

t.test('other types of errors fail', async t => {
  const randoError = new Error()
  randoError.code = 'ERANDO'
  const moveFileWithError = t.mock('../lib/move-file.js', {
    'fs/promises': {
      ...fs,
      rename: async () => {
        throw randoError
      },
    },
  })

  const dir = t.testdir({
    src: fixture,
  })
  const dest = `${dir}/dest`
  await t.rejects(() => moveFileWithError(`${dir}/src`, dest), randoError)
})

t.test('move a file across devices', async t => {
  const exdevError = new Error()
  exdevError.code = 'EXDEV'
  const moveFileWithError = t.mock('../lib/move-file.js', {
    'fs/promises': {
      ...fs,
      rename: async () => {
        throw exdevError
      },
    },
  })

  const dir = t.testdir({
    src: fixture,
  })
  const dest = `${dir}/dest`
  await moveFileWithError(`${dir}/src`, dest)
  t.equal(fsSync.readFileSync(dest, 'utf8'), fixture)
})

t.test('move a file across devices (EPERM)', async t => {
  const exdevError = new Error()
  exdevError.code = 'EPERM'
  const moveFileWithError = t.mock('../lib/move-file.js', {
    'fs/promises': {
      ...fs,
      rename: async () => {
        throw exdevError
      },
    },
  })

  const dir = t.testdir({
    src: fixture,
  })
  const dest = `${dir}/dest`
  await moveFileWithError(`${dir}/src`, dest)
  t.equal(fsSync.readFileSync(dest, 'utf8'), fixture)
})

t.test('move a directory across devices', async t => {
  const exdevError = new Error()
  exdevError.code = 'EXDEV'
  const moveFileWithError = t.mock('../lib/move-file.js', {
    'fs/promises': {
      ...fs,
      rename: async () => {
        throw exdevError
      },
    },
  })

  const dir = t.testdir({
    src: {
      one: fixture,
      two: fixture,
      sub: {
        three: fixture,
        four: fixture,
        five: t.fixture('symlink', './four'),
        reallysub: {
          six: t.fixture('symlink', '../one'),
        },
      },
      link: t.fixture('symlink', './sub'),
      abs: t.fixture('symlink', process.cwd()),
    },
  })
  const dest = `${dir}/dest`
  await moveFileWithError(`${dir}/src`, dest)
  t.ok(fsSync.statSync(dest).isDirectory(), 'created a directory')
  t.equal(fsSync.readFileSync(`${dest}/one`, 'utf8'), fixture, 'copied file one')
  t.equal(fsSync.readFileSync(`${dest}/two`, 'utf8'), fixture, 'copied file two')
  t.ok(fsSync.statSync(`${dest}/sub`).isDirectory(), 'created the subdirectory')
  t.equal(fsSync.readFileSync(`${dest}/sub/three`, 'utf8'), fixture, 'copied file three')
  t.equal(fsSync.readFileSync(`${dest}/sub/four`, 'utf8'), fixture, 'copied file four')
  t.ok(fsSync.lstatSync(`${dest}/sub/five`).isSymbolicLink(), 'created a file symbolic link')
  t.equal(fsSync.readlinkSync(`${dest}/sub/five`).replace(/\\/g, '/'),
    './four',
    'created file symlink')
  t.ok(fsSync.lstatSync(`${dest}/link`).isSymbolicLink(), 'created a directory symbolic link')
  // below assertion varies for windows because junctions are absolute paths
  t.equal(
    fsSync.readlinkSync(`${dest}/link`),
    process.platform === 'win32' ? join(dest, 'sub\\') : './sub',
    'created the directory symbolic link with the correct target'
  )
  t.ok(fsSync.lstatSync(`${dest}/sub/reallysub`).isDirectory(),
    'created the innermost subdirectory')
  t.ok(fsSync.lstatSync(`${dest}/sub/reallysub/six`).isSymbolicLink(),
    'created the innermost symlink')
  t.equal(
    fsSync.readlinkSync(`${dest}/sub/reallysub/six`).replace(/\\/g, '/'),
    '../one',
    'created the symlink with the appropriate target'
  )
  t.ok(fsSync.lstatSync(`${dest}/abs`).isSymbolicLink(), 'created the absolute path symlink')
  t.equal(
    fsSync.readlinkSync(`${dest}/abs`),
    process.platform === 'win32' ? `${process.cwd()}\\` : process.cwd(),
    'kept the correct absolute path'
  )
})

t.test('move a directory across devices (EPERM)', async t => {
  const exdevError = new Error()
  exdevError.code = 'EXDEV'
  const moveFileWithError = t.mock('../lib/move-file.js', {
    'fs/promises': {
      ...fs,
      rename: async () => {
        throw exdevError
      },
    },
  })

  const dir = t.testdir({
    src: {
      one: fixture,
      two: fixture,
      sub: {
        three: fixture,
        four: fixture,
        five: t.fixture('symlink', './four'),
        reallysub: {
          six: t.fixture('symlink', '../one'),
        },
      },
      link: t.fixture('symlink', './sub'),
      abs: t.fixture('symlink', process.cwd()),
    },
  })
  const dest = `${dir}/dest`
  await moveFileWithError(`${dir}/src`, dest)
  t.ok(fsSync.statSync(dest).isDirectory(), 'created a directory')
  t.equal(fsSync.readFileSync(`${dest}/one`, 'utf8'), fixture, 'copied file one')
  t.equal(fsSync.readFileSync(`${dest}/two`, 'utf8'), fixture, 'copied file two')
  t.ok(fsSync.statSync(`${dest}/sub`).isDirectory(), 'created the subdirectory')
  t.equal(fsSync.readFileSync(`${dest}/sub/three`, 'utf8'), fixture, 'copied file three')
  t.equal(fsSync.readFileSync(`${dest}/sub/four`, 'utf8'), fixture, 'copied file four')
  t.ok(fsSync.lstatSync(`${dest}/sub/five`).isSymbolicLink(), 'created a file symbolic link')
  t.equal(
    fsSync.readlinkSync(`${dest}/sub/five`).replace(/\\/g, '/'),
    './four',
    'created file symlink')
  t.ok(fsSync.lstatSync(`${dest}/link`).isSymbolicLink(), 'created a directory symbolic link')
  // below assertion varies for windows because junctions are absolute paths
  t.equal(
    fsSync.readlinkSync(`${dest}/link`),
    process.platform === 'win32' ? join(dest, 'sub\\') : './sub',
    'created the directory symbolic link with the correct target'
  )
  t.ok(
    fsSync.lstatSync(`${dest}/sub/reallysub`).isDirectory(),
    'created the innermost subdirectory')
  t.ok(
    fsSync.lstatSync(`${dest}/sub/reallysub/six`).isSymbolicLink(),
    'created the innermost symlink')
  t.equal(
    fsSync.readlinkSync(`${dest}/sub/reallysub/six`).replace(/\\/g, '/'),
    '../one',
    'created the symlink with the appropriate target'
  )
  t.ok(fsSync.lstatSync(`${dest}/abs`).isSymbolicLink(), 'created the absolute path symlink')
  t.equal(
    fsSync.readlinkSync(`${dest}/abs`),
    process.platform === 'win32' ? `${process.cwd()}\\` : process.cwd(),
    'kept the correct absolute path'
  )
})

t.test('overwrite option', async t => {
  const dir = t.testdir({
    src: 'x',
    dest: 'y',
  })
  await t.rejects(moveFile(`${dir}/src`, `${dir}/dest`, { overwrite: false }))
  t.equal(fsSync.readFileSync(`${dir}/dest`, 'utf8'), 'y')
  await moveFile(`${dir}/src`, `${dir}/dest`)
  t.equal(fsSync.readFileSync(`${dir}/dest`, 'utf8'), 'x')
})

t.test('overwrite option with non-ENOENT access error', async t => {
  const dir = t.testdir({
    src: 'x',
  })
  const er = Object.assign(new Error('its there, just bad'), {
    code: 'ETHEREBUTBAD',
  })
  const moveFileWithError = t.mock('../lib/move-file.js', {
    'fs/promises': {
      ...fs,
      access: async () => {
        throw er
      },
    },
  })
  await t.rejects(moveFileWithError(`${dir}/src`, `${dir}/dest`, { overwrite: false }))
  // it actually isn't there tho, so this fails, obviously
  t.throws(() => fsSync.readFileSync(`${dir}/dest`, 'utf8'), 'y')
  await moveFileWithError(`${dir}/src`, `${dir}/dest`)
  t.equal(fsSync.readFileSync(`${dir}/dest`, 'utf8'), 'x')
})

```

---

### readdir-scoped.js

**Caminho original:** `/tmp/ctest-repos-z91GLV/3f4bb586f0-fs/test/readdir-scoped.js`

**Funções testadas:**

- `existsSync`

**Conteúdo do arquivo de teste:**

```javascript
const t = require('tap')
const readdir = require('../lib/readdir-scoped.js')
const { join } = require('path')

t.test('readdir scoped', async (t) => {
  const dir = t.testdir({
    '@org': { x: {}, y: {} },
    '@scope': { x: {}, y: {} },
    a: { x: {}, y: {} },
    b: { x: {}, y: {} },
  })
  t.same(
    await readdir(dir),
    ['@org/x', '@org/y', '@scope/x', '@scope/y', 'a', 'b'].map((a) => join(a))
  )
})

```

---

### with-temp-dir.js

**Caminho original:** `/tmp/ctest-repos-z91GLV/3f4bb586f0-fs/test/with-temp-dir.js`

**Funções testadas:**

- `existsSync`

**Conteúdo do arquivo de teste:**

```javascript
const { lstat } = require('fs/promises')
const { normalize } = require('path')
const t = require('tap')

const withTempDir = require('../lib/with-temp-dir.js')

t.test('creates a temp directory and passes it to provided function', async (t) => {
  // normalize is necessary until https://github.com/tapjs/libtap/pull/40 is shipped
  const root = normalize(t.testdir())
  const rootStat = await lstat(root)
  let tempDir
  await withTempDir(root, async (dir) => {
    tempDir = dir
    t.type(dir, 'string')
    t.ok(dir.startsWith(root), 'dir is contained within the root')
    const stat = await lstat(dir)
    t.ok(stat.isDirectory(), 'dir is an actual directory')
    t.equal(stat.uid, rootStat.uid, 'temp directory has same owning user')
    t.equal(stat.gid, rootStat.gid, 'temp directory has same owning group')
  })
  await t.rejects(lstat(tempDir), { code: 'ENOENT' }, 'temp directory was removed')
})

t.test('result from provided function bubbles out', async (t) => {
  // normalize is necessary until https://github.com/tapjs/libtap/pull/40 is shipped
  const root = normalize(t.testdir())
  const rootStat = await lstat(root)
  let tempDir
  const result = await withTempDir(root, async (dir) => {
    tempDir = dir
    t.type(dir, 'string')
    t.ok(dir.startsWith(root), 'dir is contained within the root')
    const stat = await lstat(dir)
    t.ok(stat.isDirectory(), 'dir is an actual directory')
    t.equal(stat.uid, rootStat.uid, 'temp directory has same owning user')
    t.equal(stat.gid, rootStat.gid, 'temp directory has same owning group')
    return 'finished'
  })
  t.equal(result, 'finished', 'resolved value is returned')
  await t.rejects(lstat(tempDir), { code: 'ENOENT' }, 'temp directory was removed')
})

t.test('cleans up when provided function rejects', async (t) => {
  // normalize is necessary until https://github.com/tapjs/libtap/pull/40 is shipped
  const root = normalize(t.testdir())
  const rootStat = await lstat(root)
  let tempDir
  await t.rejects(withTempDir(root, async (dir) => {
    tempDir = dir
    t.type(dir, 'string')
    t.ok(dir.startsWith(root), 'dir is contained within the root')
    const stat = await lstat(dir)
    t.ok(stat.isDirectory(), 'dir is an actual directory')
    t.equal(stat.uid, rootStat.uid, 'temp directory has same owning user')
    t.equal(stat.gid, rootStat.gid, 'temp directory has same owning group')
    throw new Error('this is bad')
  }), { message: 'this is bad' })
  await t.rejects(lstat(tempDir), { code: 'ENOENT' }, 'temp directory was removed')
})

```

---


## fs.realpath@

**Funções usados neste arquivo:** existsSync

### monkeypatching.js

**Caminho original:** `/tmp/ctest-repos-z91GLV/76accba941-fs.realpath/test/monkeypatching.js`

**Funções testadas:**

- `existsSync`

**Conteúdo do arquivo de teste:**

```javascript
var t = require('tap')
var rp = require('../')
var fs = require('fs')

rp.monkeypatch()
t.equal(rp.realpath, fs.realpath)
t.equal(rp.realpathSync, fs.realpathSync)

rp.unmonkeypatch()
t.notEqual(rp.realpath, fs.realpath)
t.notEqual(rp.realpathSync, fs.realpathSync)

```

---

### symlinks.js

**Caminho original:** `/tmp/ctest-repos-z91GLV/76accba941-fs.realpath/test/symlinks.js`

**Funções testadas:**

- `existsSync`

**Conteúdo do arquivo de teste:**

```javascript
var fs = require('fs')
var t = require('tap')
var path = require('path')

var rp = require('../')

var lengths = [ 1, 128, 256 ]

var root = __dirname + '/rptest'

function clean () {
  try { fs.unlinkSync(root + '/a/b') } catch (e) {}
  try { fs.rmdirSync(root + '/a') } catch (e) {}
  try { fs.rmdirSync(root) } catch (e) {}
}

t.test('setup', function (t) {
  clean()

  fs.mkdirSync(root)
  fs.mkdirSync(root + '/a')
  fs.symlinkSync('..', root + '/a/b')

  t.end()
})

var expect = path.resolve(__dirname + '/rptest/a')

lengths.forEach(function (len) {
  t.test('symlinks = ' + len, function (t) {
    var long = root + '/' + Array(len).join('a/b/') + 'a'

    t.plan(2)
    t.equal(rp.realpathSync(long), expect)
    rp.realpath(long, function (er, actual) {
      if (er) {
        throw er
      }
      t.equal(actual, expect)
    })
  })
})

t.test('cleanup', function (t) {
  clean()
  t.end()
})

```

---


