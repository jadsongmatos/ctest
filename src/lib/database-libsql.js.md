# External Tests for database-libsql.js

Testes de dependências externas usadas neste arquivo.

**Arquivo:** `/workspaces/ctest/src/lib/database-libsql.js`

## Sumário

- **Total de componentes:** 27
- **Total de arquivos de teste:** 193

---

## adapter-libsql@7.4.2

**Funções usados neste arquivo:** PrismaClient, component, upsert, externalComponent, externalTestFile, findMany, $disconnect, PrismaLibSql, createClient

### get-options.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/3f4bb586f0-fs/test/common/get-options.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

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

**Caminho original:** `/tmp/ctest-repos-3nLWsr/3f4bb586f0-fs/test/common/node.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

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

**Caminho original:** `/tmp/ctest-repos-3nLWsr/3f4bb586f0-fs/test/cp/errors.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

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

**Caminho original:** `/tmp/ctest-repos-3nLWsr/3f4bb586f0-fs/test/cp/index.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

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

**Caminho original:** `/tmp/ctest-repos-3nLWsr/3f4bb586f0-fs/test/cp/polyfill.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

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

**Caminho original:** `/tmp/ctest-repos-3nLWsr/3f4bb586f0-fs/test/move-file.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

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

**Caminho original:** `/tmp/ctest-repos-3nLWsr/3f4bb586f0-fs/test/readdir-scoped.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

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

**Caminho original:** `/tmp/ctest-repos-3nLWsr/3f4bb586f0-fs/test/with-temp-dir.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

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

### get-options.js

**Caminho original:** `/tmp/ctest-repos-XwoGto/3f4bb586f0-fs/test/common/get-options.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

*Arquivo de teste não disponível*

---

### node.js

**Caminho original:** `/tmp/ctest-repos-XwoGto/3f4bb586f0-fs/test/common/node.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

*Arquivo de teste não disponível*

---

### errors.js

**Caminho original:** `/tmp/ctest-repos-XwoGto/3f4bb586f0-fs/test/cp/errors.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

*Arquivo de teste não disponível*

---

### index.js

**Caminho original:** `/tmp/ctest-repos-XwoGto/3f4bb586f0-fs/test/cp/index.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

*Arquivo de teste não disponível*

---

### polyfill.js

**Caminho original:** `/tmp/ctest-repos-XwoGto/3f4bb586f0-fs/test/cp/polyfill.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

*Arquivo de teste não disponível*

---

### move-file.js

**Caminho original:** `/tmp/ctest-repos-XwoGto/3f4bb586f0-fs/test/move-file.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

*Arquivo de teste não disponível*

---

### readdir-scoped.js

**Caminho original:** `/tmp/ctest-repos-XwoGto/3f4bb586f0-fs/test/readdir-scoped.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

*Arquivo de teste não disponível*

---

### with-temp-dir.js

**Caminho original:** `/tmp/ctest-repos-XwoGto/3f4bb586f0-fs/test/with-temp-dir.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

*Arquivo de teste não disponível*

---


## client@7.4.2

**Funções usados neste arquivo:** PrismaClient, component, upsert, externalComponent, externalTestFile, findMany, $disconnect, PrismaLibSql, createClient

### cleanup.mjs

**Caminho original:** `/tmp/ctest-repos-3nLWsr/14937caf7b-cyclonedx-npm/tests/_data/npm-ls_demo-results/_duplicates-cleaner/cleanup.mjs`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX generator for NPM projects.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

'use strict'

import { createHash } from 'node:crypto'
import { createReadStream, existsSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dirDemoRes = dirname(__dirname)

const fnamePattern = /^npm-ls(?<args>.*?)_npm(?<npm>\d+)_node(?<node>\d+)_(?<os>.+)\.json$/

/** @type {Object<string, Object<string, string[]>>} */
const files = {}

for (const dirDemoResE of readdirSync(dirDemoRes)) {
  const dirResults = join(dirDemoRes, dirDemoResE, 'CI_results')
  if (!existsSync(dirResults) || !statSync(dirResults).isDirectory()) {
    continue
  }
  for (const dirResultsE of readdirSync(dirResults)) {
    const fnameMatch = fnamePattern.exec(dirResultsE)
    if (!fnameMatch) {
      continue
    }
    let _t = files
    if (!Object.hasOwn(_t, fnameMatch.groups.args)) {
      _t[fnameMatch.groups.args] = {}
    }
    _t = _t[fnameMatch.groups.args]
    if (!Object.hasOwn(_t, fnameMatch.groups.npm)) {
      _t[fnameMatch.groups.npm] = {}
    }
    _t = _t[fnameMatch.groups.npm]
    if (!Object.hasOwn(_t, fnameMatch.groups.os)) {
      _t[fnameMatch.groups.os] = []
    }
    _t = _t[fnameMatch.groups.os]
    _t.push(join(dirResults, dirResultsE))
  }
}

for (const filesByAs of Object.values(files)) {
  for (const filesByOs of Object.values(filesByAs)) {
    for (const filePaths of Object.values(filesByOs)) {
      const fileHashes = new Set()
      for (const filePath of filePaths) {
        const fileHash = await hashFile(filePath)
        if (fileHashes.has(fileHash)) {
          console.info('DELETE:', fileHash, filePath)
          unlinkSync(filePath)
          continue
        }
        fileHashes.add(fileHash)
        console.info('KEEP:', fileHash, filePath)
        await fixupPaths(filePath)
      }
    }
  }
}

/**
 * @param {string} fp
 * @return {Promise<string>}
 */
function hashFile (fp) {
  return new Promise((resolve, reject) => {
    const hash = createHash('md5')
    createReadStream(fp)
      .once('error', reject)
      .once('end', () => {
        resolve(hash.end().read().toString('hex'))
      })
      .pipe(hash)
  })
}

/**
 * @param {string} fp
 * @return {Promise<void>}
 */
async function fixupPaths (fp) {
  const fc = await readFileSync(fp, 'utf8')
  await writeFileSync(fp, fc
    .replaceAll(':\\\\a\\\\cyclonedx-node-npm\\\\', ':\\\\...\\\\') // windows
    .replaceAll('/Users/runner/work/cyclonedx-node-npm/', '/.../') // macos
    .replaceAll('/home/runner/work/cyclonedx-node-npm/', '/.../') // linux
  )
}

```

---

### index.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/14937caf7b-cyclonedx-npm/tests/_data/npm-ls_demo-results/index.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX generator for NPM projects.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const { sync: glob } = require('fast-glob')

const fileGlob = '*/CI_results/*.json'

const filePattern = /\/(?<subject>[^/]+?)\/CI_results\/npm-ls(?<args>.*?)_npm(?<npm>.+?)_node(?<node>.+?)_(?<os>.+?).json$/i

/**
 * @typedef fileMatch
 * @prop {string} path
 * @prop {string} subject
 * @prop {string} args
 * @prop {string} npm
 * @prop {string} node
 * @prop {string} os
 */

/* eslint-disable-next-line jsdoc/valid-types -- ack */
/** @type {import('fast-glob').OptionsInternal} */
const globOptions = { absolute: true, caseSensitiveMatch: false, cwd: __dirname, deep: 3, onlyFiles: true, unique: true }

let cached

/**
 * @return {Array<fileMatch>}
 */
function index () {
  if (cached === undefined) {
    cached = Object.freeze(
      glob(fileGlob, globOptions).sort().map(
        file => Object.freeze({
          ...(filePattern.exec(file)?.groups ?? {}),
          path: file
        })
      )
    )
  }
  return cached
}

module.exports = {
  index
}

```

---

### broken-json.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/14937caf7b-cyclonedx-npm/tests/_data/npm-ls_replacement/broken-json.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
#!/usr/bin/env node

/*!
This file is part of CycloneDX generator for NPM projects.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

if (process.argv[2] === '--version') {
  process.stdout.write(`${process.env.CT_VERSION}\n`)
  process.exit(0)
}

process.exitCode = Number(process.env.CT_EXIT_CODE || 0)

process.stdout.write('{"broken-json"')

```

---

### check-args.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/14937caf7b-cyclonedx-npm/tests/_data/npm-ls_replacement/check-args.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
#!/usr/bin/env node

/*!
This file is part of CycloneDX generator for NPM projects.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')
const { resolve } = require('node:path')

if (process.argv[2] === '--version') {
  process.stdout.write(`${process.env.CT_VERSION}\n`)
  process.exit(0)
}

process.exitCode = Number(process.env.CT_EXIT_CODE || 0)

const expectedArgs = ['ls', ...process.env.CT_EXPECTED_ARGS.split(' ')]
assert.deepStrictEqual(process.argv.slice(2), expectedArgs, 'unexpected args')

const packagePath = resolve(__dirname, '..', 'dummy_projects', 'no-lockfile')
process.stdout.write(`{
  "name": "dummy",
  "private": true,
  "extraneous": false,
  "path": ${JSON.stringify(packagePath)},
  "_dependencies": {},
  "devDependencies": {},
  "peerDependencies": {}
}`)

```

---

### demo-results.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/14937caf7b-cyclonedx-npm/tests/_data/npm-ls_replacement/demo-results.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
#!/usr/bin/env node

/*!
This file is part of CycloneDX generator for NPM projects.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')
const { createReadStream } = require('node:fs')

if (process.argv[2] === '--version') {
  process.stdout.write(`${process.env.CT_VERSION}\n`)
  process.exit(0)
}

process.exitCode = Number(process.env.CT_EXIT_CODE || 0)

const index = require('../npm-ls_demo-results').index()

const { CT_SUBJECT: subject, CT_ARGS: args = '', CT_NPM: npm, CT_NODE: node, CT_OS: os } = process.env
const matches = index.filter(i =>
  i.subject === subject &&
  i.args === args &&
  i.npm === npm &&
  i.node === node &&
  i.os === os)
assert.strictEqual(matches.length, 1, `did not find exactly 1 match: ${JSON.stringify(matches)}`)

const { path } = matches[0]

const rs = createReadStream(path)
rs.once('error', e => { throw e })
rs.once('open', () => { rs.pipe(process.stdout) })
rs.once('end', () => { rs.unpipe(); rs.close() })

```

---

### just-exit.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/14937caf7b-cyclonedx-npm/tests/_data/npm-ls_replacement/just-exit.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
#!/usr/bin/env node

/*!
This file is part of CycloneDX generator for NPM projects.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

if (process.argv[2] === '--version') {
  process.stdout.write(`${process.env.CT_VERSION}\n`)
  process.exit(0)
}

process.exitCode = Number(process.env.CT_EXIT_CODE || 0)

```

---

### index.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/14937caf7b-cyclonedx-npm/tests/_helper/index.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX generator for NPM projects.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const { spawnSync } = require('node:child_process')
const { createReadStream } = require('node:fs')

const MurmurHash3 = require('imurmurhash')

const { version: thisVersion } = require('../../package.json')

/**
 * @type {Map<string, Promise<string>>}
 */
const hfCache = new Map()

/**
 * @param {string} filePath
 * @return {Promise<string>}
 */
function hashFile (filePath) {
  let p = hfCache.get(filePath)
  if (p === undefined) {
    p = new Promise((resolve, reject) => {
      const hs = new MurmurHash3('')
      const rs = createReadStream(filePath, 'utf8')
      rs.on('data', c => hs.hash(c))
      rs.once('end', () => resolve(hs.result()))
      rs.once('error', e => reject(e))
    })
    hfCache.set(filePath, p)
  }
  return p
}

/**
 * @param {string} format
 * @param {*} data
 * @returns {string}
 * @throws {RangeError} if format is unsupported
 */
function makeReproducible (format, data) {
  switch (format.toLowerCase()) {
    case 'xml':
      return makeXmlReproducible(data)
    case 'json':
      return makeJsonReproducible(data)
    default:
      throw new RangeError(`unexpected format: ${format}`)
  }
}

/**
 * @param {string} json
 * @returns {string}
 */
function makeJsonReproducible (json) {
  return json
    .replace(
      // replace metadata.tools[].version
      new RegExp(
        '        {\n' +
        '          "type": "application",\n' +
        '          "name": "npm",\n' +
        '          "version": ".+?"\n' +
        '        }'),
      '        {\n' +
      '          "type": "application",\n' +
      '          "name": "npm",\n' +
      '          "version": "npmVersion-testing"\n' +
      '        }'
    )
    .replace(
      // replace self metadata.tools[].version
      '        "vendor": "@cyclonedx",\n' +
      '        "name": "cyclonedx-npm",\n' +
      `        "version": ${JSON.stringify(thisVersion)}`,
      '        "vendor": "@cyclonedx",\n' +
      '        "name": "cyclonedx-npm",\n' +
      '        "version": "thisVersion-testing"'
    ).replace(
      // replace self metadata.tools.components[].version
      '          "name": "cyclonedx-npm",\n' +
      '          "group": "@cyclonedx",\n' +
      `          "version": ${JSON.stringify(thisVersion)}`,
      '          "name": "cyclonedx-npm",\n' +
      '          "group": "@cyclonedx",\n' +
      '          "version": "thisVersion-testing"'
    ).replace(
      // replace cdx-lib metadata.tools[].version
      new RegExp(
        '        "vendor": "@cyclonedx",\n' +
        '        "name": "cyclonedx-library",\n' +
        '        "version": ".+?"'
      ),
      '        "vendor": "@cyclonedx",\n' +
      '        "name": "cyclonedx-library",\n' +
      '        "version": "libVersion-testing"'
    ).replace(
      // replace cdx-lib metadata.tools.components[].version
      new RegExp(
        '          "name": "cyclonedx-library",\n' +
        '          "group": "@cyclonedx",\n' +
        '          "version": ".+?"'
      ),
      '          "name": "cyclonedx-library",\n' +
      '          "group": "@cyclonedx",\n' +
      '          "version": "libVersion-testing"'
    )
}

/**
 * @param {string} xml
 * @returns {string}
 *
 * eslint-disable-next-line no-unused-vars
 */
function makeXmlReproducible (xml) {
  return xml
    .replace(
      // replace webpack metadata.tools[].version
      new RegExp(
        '        <component type="application">\n' +
        '          <name>npm</name>\n' +
        '          <version>.+?</version>\n' +
        '        </component>'),
      '        <component type="application">\n' +
      '          <name>npm</name>\n' +
      '          <version>npmVersion-testing</version>\n' +
      '        </component>'
    )
    .replace(
      // replace self metadata.tools[].version
      '        <vendor>@cyclonedx</vendor>\n' +
      '        <name>cyclonedx-npm</name>\n' +
      `        <version>${thisVersion}</version>`,
      '        <vendor>@cyclonedx</vendor>\n' +
      '        <name>cyclonedx-npm</name>\n' +
      '        <version>thisVersion-testing</version>'
    ).replace(
      // replace self metadata.tools.components[].version
      '          <group>@cyclonedx</group>\n' +
      '          <name>cyclonedx-npm</name>\n' +
      `          <version>${thisVersion}</version>`,
      '          <group>@cyclonedx</group>\n' +
      '          <name>cyclonedx-npm</name>\n' +
      '          <version>thisVersion-testing</version>'
    ).replace(
      // replace cdx-lib metadata.tools[].version
      new RegExp(
        '        <vendor>@cyclonedx</vendor>\n' +
        '        <name>cyclonedx-library</name>\n' +
        '        <version>.+?</version>'
      ),
      '        <vendor>@cyclonedx</vendor>\n' +
      '        <name>cyclonedx-library</name>\n' +
      '        <version>libVersion-testing</version>'
    ).replace(
      // replace cdx-lib metadata.tools.components[].version
      new RegExp(
        '          <group>@cyclonedx</group>\n' +
        '          <name>cyclonedx-library</name>\n' +
        '          <version>.+?</version>'),
      '          <group>@cyclonedx</group>\n' +
      '          <name>cyclonedx-library</name>\n' +
      '          <version>libVersion-testing</version>'
    )
}

/**
 * @return {number[]}
 */
function getNpmVersion () {
  const v = spawnSync('npm', ['--version'], {
    stdio: ['ignore', 'pipe', 'ignore'],
    encoding: 'utf8',
    shell: process.platform.startsWith('win')
  }).stdout.split('.').map(Number)
  process.stderr.write(`\ndetected npm version: ${JSON.stringify(v)}\n`)
  return v
}

/**
 * @param {string} s
 * @return {string}
 */
function regexEscape (s) {
  return s.replace(/[\^$(){}[\]+*?.|\\-]/g, '\\$&')
}

module.exports = {
  getNpmVersion,
  hashFile,
  makeReproducible,
  regexEscape
}

```

---

### cli.args-pass-through.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/14937caf7b-cyclonedx-npm/tests/integration/cli.args-pass-through.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX generator for NPM projects.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const { mkdirSync, readFileSync } = require('node:fs')
const { join } = require('node:path')

const { describe, expect, test } = require('@jest/globals')

const { dummyProjectsRoot, mkTemp, npmLsReplacement, runCLI } = require('./')

describe('integration.cli.args-pass-through', () => {
  const cliRunTestTimeout = 15000

  const tmpRoot = mkTemp('cli.args-pass-through')

  describe('npm-version depending npm-args', () => {
    const tmpRootRun = join(tmpRoot, 'npmVersion-depending-npmArgs')
    mkdirSync(tmpRootRun)

    const rMinor = Math.round(99 * Math.random())
    const rPatch = Math.round(99 * Math.random())

    const npmArgsGeneral = ['--json', '--long']
    const npm9ArgsGeneral = [...npmArgsGeneral, '--all']
    const npm10ArgsGeneral = [...npmArgsGeneral, '--all']
    const npm11ArgsGeneral = [...npmArgsGeneral, '--all']

    test.each([
      // region basic
      ['basic npm 9', `9.${rMinor}.${rPatch}`, [], npm9ArgsGeneral],
      ['basic npm 10', `10.${rMinor}.${rPatch}`, [], npm10ArgsGeneral],
      ['basic npm 11', `11.${rMinor}.${rPatch}`, [], npm11ArgsGeneral],
      // endregion basic
      // region omit
      ['omit everything npm 9', `9.${rMinor}.${rPatch}`, ['--omit', 'dev', 'optional', 'peer'], [...npm9ArgsGeneral, '--omit=dev', '--omit=optional', '--omit=peer']],
      ['omit everything npm 10', `10.${rMinor}.${rPatch}`, ['--omit', 'dev', 'optional', 'peer'], [...npm10ArgsGeneral, '--omit=dev', '--omit=optional', '--omit=peer']],
      ['omit everything npm 11', `11.${rMinor}.${rPatch}`, ['--omit', 'dev', 'optional', 'peer'], [...npm11ArgsGeneral, '--omit=dev', '--omit=optional', '--omit=peer']],
      // endregion omit
      // region package-lock-only
      ['package-lock-only npm 9', `9.${rMinor}.${rPatch}`, ['--package-lock-only'], [...npm9ArgsGeneral, '--package-lock-only']],
      ['package-lock-only npm 10', `10.${rMinor}.${rPatch}`, ['--package-lock-only'], [...npm10ArgsGeneral, '--package-lock-only']],
      ['package-lock-only npm 11', `11.${rMinor}.${rPatch}`, ['--package-lock-only'], [...npm11ArgsGeneral, '--package-lock-only']],
      // endregion package-lock-only
      // region workspace
      ['workspace npm 9', `9.${rMinor}.${rPatch}`, ['--workspace', 'my-wsA', '-w', 'my-wsB'], [...npm9ArgsGeneral, '--workspace=my-wsA', '--workspace=my-wsB']],
      ['workspace npm 10', `10.${rMinor}.${rPatch}`, ['--workspace', 'my-wsA', '-w', 'my-wsB'], [...npm10ArgsGeneral, '--workspace=my-wsA', '--workspace=my-wsB']],
      ['workspace npm 11', `11.${rMinor}.${rPatch}`, ['--workspace', 'my-wsA', '-w', 'my-wsB'], [...npm11ArgsGeneral, '--workspace=my-wsA', '--workspace=my-wsB']],
      // endregion workspace
      // region include-workspace-root
      ['workspace root npm 9', `9.${rMinor}.${rPatch}`, ['--workspace', 'my-wsA', '-w', 'my-wsB', '--include-workspace-root'], [...npm9ArgsGeneral, '--workspace=my-wsA', '--workspace=my-wsB', '--include-workspace-root=true']],
      ['workspace root npm 10', `10.${rMinor}.${rPatch}`, ['--workspace', 'my-wsA', '-w', 'my-wsB', '--include-workspace-root'], [...npm10ArgsGeneral, '--workspace=my-wsA', '--workspace=my-wsB', '--include-workspace-root=true']],
      ['workspace root npm 11', `11.${rMinor}.${rPatch}`, ['--workspace', 'my-wsA', '-w', 'my-wsB', '--include-workspace-root'], [...npm11ArgsGeneral, '--workspace=my-wsA', '--workspace=my-wsB', '--include-workspace-root=true']],
      // endregion include-workspace-root
      // region no-include-workspace-root
      ['no workspace root npm 9', `9.${rMinor}.${rPatch}`, ['--no-include-workspace-root'], [...npm9ArgsGeneral, '--include-workspace-root=false']],
      ['no workspace root npm 10', `10.${rMinor}.${rPatch}`, ['--no-include-workspace-root'], [...npm10ArgsGeneral, '--include-workspace-root=false']],
      ['no workspace root npm 11', `11.${rMinor}.${rPatch}`, ['--no-include-workspace-root'], [...npm11ArgsGeneral, '--include-workspace-root=false']],
      // endregion no-include-workspace-root
      // region no-workspaces
      ['workspaces npm 9', `9.${rMinor}.${rPatch}`, ['--no-workspaces'], [...npm9ArgsGeneral, '--workspaces=false']],
      ['workspaces npm 10', `10.${rMinor}.${rPatch}`, ['--no-workspaces'], [...npm10ArgsGeneral, '--workspaces=false']],
      ['workspaces npm 11', `11.${rMinor}.${rPatch}`, ['--no-workspaces'], [...npm11ArgsGeneral, '--workspaces=false']]
      // endregion no-workspaces
    ])('%s', async (purpose, npmVersion, cdxArgs, expectedArgs) => {
      const logFileBase = join(tmpRootRun, purpose.replace(/\W/g, '_'))
      const cwd = dummyProjectsRoot

      const { res, errFile } = runCLI([
        ...cdxArgs,
        '--',
        join('with-lockfile', 'package.json')
      ], logFileBase, cwd, {
        CT_VERSION: npmVersion,
        CT_EXPECTED_ARGS: expectedArgs.join(' '),
        npm_execpath: npmLsReplacement.checkArgs
      })

      try {
        await expect(res).resolves.toBe(0)
      } catch (err) {
        process.stderr.write(readFileSync(errFile))
        throw err
      }
    }, cliRunTestTimeout)
  })
})

```

---

### cli.dogfooding.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/14937caf7b-cyclonedx-npm/tests/integration/cli.dogfooding.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX generator for NPM projects.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const { spawnSync } = require('node:child_process')

const { describe, expect, test } = require('@jest/globals')

const { cliWrapperPath, projectRootPath } = require('./')

describe('integration.cli.dogfooding', () => {
  const cliRunTestTimeout = 15000

  test.each(['JSON', 'XML'])('dogfooding %s', (format) => {
    const res = spawnSync(
      process.execPath,
      ['--', cliWrapperPath, '--output-format', format, '--ignore-npm-errors'],
      {
        cwd: projectRootPath,
        stdio: ['ignore', 'inherit', 'pipe'],
        encoding: 'utf8'
      }
    )
    try {
      expect(res.error).toBeUndefined()
      expect(res.status).toBe(0)
    } catch (err) {
      process.stderr.write('\n')
      process.stderr.write(res.stderr)
      process.stderr.write('\n')
      throw err
    }
  }, cliRunTestTimeout)
})

```

---

### cli.edge-cases.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/14937caf7b-cyclonedx-npm/tests/integration/cli.edge-cases.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX generator for NPM projects.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const { spawnSync } = require('node:child_process')
const { mkdirSync, readFileSync, writeFileSync } = require('node:fs')
const { dirname, join } = require('node:path')

const { describe, expect, test } = require('@jest/globals')

const { makeReproducible } = require('../_helper')
const {
  NPM_LOWEST_SUPPORTED,
  UPDATE_SNAPSHOTS,
  cliWrapperPath,
  demoResultsRoot,
  dummyProjectsRoot,
  latestCdxSpecVersion,
  mkTemp,
  npmLsReplacement,
  runCLI
} = require('./')

describe('integration.cli.edge-cases', () => {
  const cliRunTestTimeout = 15000

  const tmpRoot = mkTemp('cli.edge_cases')

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
  })

  describe('broken project', () => {
    const tmpRootRun = join(tmpRoot, 'broken-project')
    mkdirSync(tmpRootRun)

    test.each([
      ['no-lockfile', /missing evidence/i],
      ['no-manifest', /missing .*manifest file/i]
    ])('%s', async (folderName, expectedError) => {
      const logFileBase = join(tmpRootRun, folderName)
      const cwd = join(dummyProjectsRoot, folderName)

      const { res, errFile } = runCLI([], logFileBase, cwd, { npm_execpath: undefined })

      try {
        await expect(res).rejects.toThrow(expectedError)
      } catch (err) {
        process.stderr.write(readFileSync(errFile))
        throw err
      }
    }, cliRunTestTimeout)
  })

  describe('with broken npm-ls', () => {
    const tmpRootRun = join(tmpRoot, 'with-broken')
    mkdirSync(tmpRootRun)

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
    }, cliRunTestTimeout)

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
    }, cliRunTestTimeout)

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
    }, cliRunTestTimeout)
  })

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
  }, cliRunTestTimeout)

  describe('workspace-specifics', () => {
    test.each([
      ['exclusive mutual options: workspace no-workspaces', ['--workspace', 'foo', '--no-workspaces'], "error: option '--no-workspaces' cannot be used with option '-w, --workspace <workspace...>'"],
      ['include-workspace-root w/o workspace', ['--include-workspace-root'], "error: option '--include-workspace-root' cannot be used without option '-w, --workspace <workspace...>'"],
      ['include-workspace-root no-workspaces', ['--include-workspace-root', '--no-workspaces'], "error: option '--include-workspace-root' cannot be used without option '-w, --workspace <workspace...>'"]
    ])('%s', async (purpose, cdxArgs, expectedError) => {
      const res = spawnSync(
        process.execPath,
        ['--', cliWrapperPath, ...cdxArgs],
        {
          cwd: join(dummyProjectsRoot, 'with-lockfile'),
          stdio: ['ignore', 'ignore', 'pipe'],
          encoding: 'utf8',
          env: {
            CT_VERSION: NPM_LOWEST_SUPPORTED.join('.'),
            npm_execpath: npmLsReplacement.justExit
          }
        }
      )
      expect(res.status).not.toBe(0)
      expect(res.stderr.toLowerCase()).toContain(expectedError)
    }, cliRunTestTimeout)
  })
})

```

---

### cli.from-collected.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/14937caf7b-cyclonedx-npm/tests/integration/cli.from-collected.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX generator for NPM projects.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const { mkdirSync, readFileSync, writeFileSync } = require('node:fs')
const { dirname, join } = require('node:path')

const { describe, expect, test } = require('@jest/globals')

const { index: indexNpmLsDemoData } = require('../_data/npm-ls_demo-results')
const { makeReproducible } = require('../_helper')
const { NPM_LOWEST_SUPPORTED, UPDATE_SNAPSHOTS, demoResultsRoot, dummyProjectsRoot, latestCdxSpecVersion, mkTemp, npmLsReplacement, runCLI } = require('./')

describe('integration.cli.from-collected', () => {
  const cliRunTestTimeout = 15000

  const tmpRoot = mkTemp('cli.from-collected')

  describe('with prepared npm-ls', () => {
    const tmpRootRun = join(tmpRoot, 'with-prepared')
    mkdirSync(tmpRootRun)

    const _allDemoCases = indexNpmLsDemoData()
    const useCases = [
      {
        subject: 'bare',
        args: [],
        demoCases: _allDemoCases
      },
      {
        subject: 'flatten-components',
        args: ['--flatten-components'],
        demoCases: _allDemoCases.filter((c) => {
          if (c.npm !== `${NPM_LOWEST_SUPPORTED[0]}`) { return false }
          if (c.subject === 'juice-shop') { return true }
          if (c.subject === 'bundled-dependencies') { return true }
          return false
        })
      }
    ]

    describe.each(useCases)('$subject', (ud) => {
      mkdirSync(join(tmpRootRun, ud.subject))

      test.each(ud.demoCases)('$subject $args npm$npm node$node $os', async (dd) => {
        const expectedOutSnap = join(demoResultsRoot, ud.subject, `${dd.subject}${dd.args}_npm${dd.npm}_node${dd.node}_${dd.os}.snap.json`)
        const logFileBase = join(tmpRootRun, ud.subject, `${dd.subject}${dd.args}_npm${dd.npm}_node${dd.node}_${dd.os}`)
        const cwd = dummyProjectsRoot

        const { res, outFile, errFile } = runCLI([
          '-vvv',
          '--output-reproducible',
          '--validate',
          // no intention to test all the spec-versions nor all the output-formats - this would be not our scope.
          '--spec-version', `${latestCdxSpecVersion}`,
          // just use json with the latest most feature-rich version.
          '--output-format', 'JSON',
          // prevent file interaction in this synthetic scenario - they would not exist anyway
          '--package-lock-only',
          // case-specific args
          ...ud.args,
          // explicit args
          ...(dd.args === '' ? [] : dd.args.split(' ')),
          '--',
          // just some dummy project
          join('with-lockfile', 'package.json')
        ], logFileBase, cwd, {
          CT_VERSION: `${dd.npm}.99.0`,
          CT_SUBJECT: dd.subject,
          CT_ARGS: dd.args,
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
      }, cliRunTestTimeout)
    })
  })
})

```

---

### cli.from-setups.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/14937caf7b-cyclonedx-npm/tests/integration/cli.from-setups.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX generator for NPM projects.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const { spawnSync } = require('node:child_process')
const { existsSync, mkdirSync, readFileSync, writeFileSync } = require('node:fs')
const { dirname, join } = require('node:path')

const { describe, expect, test } = require('@jest/globals')

const { getNpmVersion, makeReproducible, regexEscape } = require('../_helper')
const { NPM_LOWEST_SUPPORTED, UPDATE_SNAPSHOTS, cliWrapperPath, demoResultsRoot, dummyProjectsRoot, dummyResultsRoot, latestCdxSpecVersion, mkTemp, projectDemoRootPath } = require('./')

describe('integration.cli.from-setups', () => {
  // some test beds might be skipped
  const skipAllTests = getNpmVersion()[0] < NPM_LOWEST_SUPPORTED[0]

  const cliRunTestTimeout = 15000

  const tmpRoot = mkTemp('cli.from-setups')

  const formats = ['json', 'xml']

  describe('dummy_projects', () => {
    const useCases = [
      {
        subject: 'bare',
        args: [],
        dummyProject: ['with-prepared']
      },
      {
        subject: 'flat',
        args: ['--flatten-components'],
        dummyProject: ['with-prepared']
      },
      {
        subject: 'package-lock-only',
        args: ['--package-lock-only'],
        dummyProject: ['with-prepared']
      },
      {
        subject: 'with-licenses',
        args: ['--gather-license-texts'],
        dummyProject: ['with-prepared']
      },
      // region omit
      {
        subject: 'omit-dev',
        args: ['--omit=dev'],
        dummyProject: ['with-prepared']
      },
      {
        subject: 'omit-optional',
        args: ['--omit=optional'],
        dummyProject: ['with-prepared']
      },
      {
        subject: 'omit-peer',
        args: ['--omit=peer'],
        dummyProject: ['with-prepared']
      },
      {
        subject: 'omit-dev-optional',
        args: ['--omit=dev', '--omit=optional'],
        dummyProject: ['with-prepared']
      },
      {
        subject: 'omit-dev-peer',
        args: ['--omit=dev', '--omit=peer'],
        dummyProject: ['with-prepared']
      },
      {
        subject: 'omit-optional-peer',
        args: ['--omit=optional', '--omit=peer'],
        dummyProject: ['with-prepared']
      },
      {
        subject: 'omit-dev-optional-peer',
        args: ['--omit=dev', '--omit=optional', '--omit=peer'],
        dummyProject: ['with-prepared']
      },
      // endregion omit
    ]

    function runTest (subject, project, format, additionalCliArgs = []) {
      const expectedOutSnap = join(dummyResultsRoot, subject, `${project}.snap.${format}`)
      const outFile = join(tmpRoot, subject, `${project}.${format}`)
      const outDirExisted = existsSync(dirname(outFile))
      // no need to create that outFile dir first - the tool is expected to do that for us
      const res = spawnSync(
        process.execPath,
        ['--', cliWrapperPath,
          ...additionalCliArgs,
          '--spec-version', latestCdxSpecVersion,
          '--output-format', format,
          '--output-reproducible',
          '--output-file', outFile,
          '--validate',
          '-vvv'
        ], {
          cwd: join(dummyProjectsRoot, project),
          stdio: ['ignore', 'ignore', 'pipe'],
          encoding: 'utf8'
        }
      )
      try {
        expect(res.status).toBe(0)
      } catch (err) {
        process.stderr.write('\n')
        process.stderr.write(res.stderr)
        process.stderr.write('\n')
        throw err
      }

      const expectStdErr = expect(res.stderr);
      (outDirExisted ? expectStdErr.not : expectStdErr).toContain(`creating directory ${dirname(outFile)}`)
      expectStdErr.toMatch(new RegExp(`wrote \\d+ bytes to ${regexEscape(outFile)}`))

      const actualOutput = makeReproducible(format, readFileSync(outFile, 'utf8'))

      if (UPDATE_SNAPSHOTS) {
        mkdirSync(dirname(expectedOutSnap), { recursive: true })
        writeFileSync(expectedOutSnap, actualOutput, 'utf8')
      }

      expect(actualOutput).toEqual(
        readFileSync(expectedOutSnap, 'utf8'),
        `${outFile} should equal ${expectedOutSnap}`
      )
    }

    describe.each(useCases)('subject: $subject', (ud) => {
      describe.each(ud.dummyProject)('dummyProject: %s', (dummyProject) => {
        describe.each(formats)('format: %s', (format) => {
          (skipAllTests
            ? test.skip
            : test
          )('run', () => {
            runTest(ud.subject, dummyProject, format, ud.args)
          }, cliRunTestTimeout)
        })
      })
    })
  })

  // skipped for now
  describe.skip('demos', () => {
    const demos = [
      'alternative-package-registry',
      'bundled-dependencies',
      // 'deps-from-git',
      'dev-dependencies',
      // 'juice-shop',
      'local-dependencies',
      'local-workspaces',
      'package-integrity',
      'package-with-build-id'
    ]

    /**
     * @param {string} demo
     * @param {string} oType
     * @param {'json'|'xml'} format
     * @param {string[]} [additionalCliArgs]
     * @throws {*} forwarded from `expect()...`
     */
    function runTest (demo, oType, format, additionalCliArgs = []) {
      const expectedOutSnap = join(demoResultsRoot, oType, `${demo}_from-setup.snap.${format}`)
      const outFile = join(tmpRoot, `${demo}_${oType}.${format}`)
      const res = spawnSync(
        process.execPath,
        ['--', cliWrapperPath,
          ...additionalCliArgs,
          '--spec-version', latestCdxSpecVersion,
          '--output-format', format,
          '--output-reproducible',
          '--output-file', outFile,
          '--validate'
        ], {
          cwd: join(projectDemoRootPath, demo, 'project'),
          stdio: ['ignore', 'inherit', 'pipe'],
          encoding: 'utf8'
        }
      )
      try {
        expect(res.status).toBe(0)
      } catch (err) {
        process.stderr.write('\n')
        process.stderr.write(res.stderr)
        process.stderr.write('\n')
        throw err
      }
      const actualOutput = makeReproducible(format, readFileSync(outFile, 'utf8'))

      if (UPDATE_SNAPSHOTS) {
        mkdirSync(dirname(expectedOutSnap), { recursive: true })
        writeFileSync(expectedOutSnap, actualOutput, 'utf8')
      }

      expect(actualOutput).toEqual(
        readFileSync(expectedOutSnap, 'utf8'),
      `${outFile} should equal ${expectedOutSnap}`
      )
    }

    for (const demo of demos) {
      describe(`demo: ${demo}`, () => {
        for (const format of formats) {
          describe(`format: ${format}`, () => {
            (skipAllTests
              ? test.skip
              : test
            )('bare', () => {
              runTest(demo, 'bare', format)
            }, cliRunTestTimeout);

            (skipAllTests
              ? test.skip
              : test
            )('flat', () => {
              runTest(demo, 'flatten-components', format, ['--flatten-components'])
            }, cliRunTestTimeout)
          })
        }
      })
    }
  })
})

```

---

### index.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/14937caf7b-cyclonedx-npm/tests/integration/index.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX generator for NPM projects.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const { createWriteStream, openSync } = require('node:fs')
const { mkdtempSync } = require('node:fs')
const { join, resolve } = require('node:path')

const { Spec } = require('@cyclonedx/cyclonedx-library')

const cli = require('../../dist/cli')

const projectRootPath = resolve(__dirname, '..', '..')
const projectTestRootPath = resolve(__dirname, '..')

const projectDemoRootPath = join(projectRootPath, 'demo')
const projectTestDataPath = join(projectTestRootPath, '_data')

const dummyProjectsRoot = join(projectTestDataPath, 'dummy_projects')
const demoResultsRoot = join(projectTestDataPath, 'sbom_demo-results')
const dummyResultsRoot = join(projectTestDataPath, 'sbom_dummy-results')
const npmLsReplacementPath = join(projectTestDataPath, 'npm-ls_replacement')

const npmLsReplacement = {
  brokenJson: join(npmLsReplacementPath, 'broken-json.js'),
  checkArgs: join(npmLsReplacementPath, 'check-args.js'),
  demoResults: join(npmLsReplacementPath, 'demo-results.js'),
  justExit: join(npmLsReplacementPath, 'just-exit.js'),
  nonExistingBinary: join(npmLsReplacementPath, 'aNonExistingBinary')
}

/* we might run only the latest most advanced */
const latestCdxSpecVersion = Spec.Version.v1dot6

const UPDATE_SNAPSHOTS = !!process.env.CNPM_TEST_UPDATE_SNAPSHOTS

const NPM_LATETS = 11
const NPM_LOWEST_SUPPORTED = [9, 0, 0]

/**
 * @param {string[]} args
 * @param {string} logFileBase
 * @param {string} cwd
 * @param {Object<string, string>} env
 * @return {{res: Promise.<number>, outFile:string, errFile:string}}
 */
function runCLI (args, logFileBase, cwd, env) {
  const outFile = `${logFileBase}.out`
  const outFD = openSync(outFile, 'w')
  const stdout = createWriteStream(null, { fd: outFD })

  const errFile = `${logFileBase}.err`
  const errFD = openSync(errFile, 'w')
  const stderr = createWriteStream(null, { fd: errFD })

  /**
   * Partial Process
   * @see {NodeJS.Process}
   */
  const mockProcess = {
    stdout,
    stderr,
    cwd: () => cwd,
    execPath: process.execPath,
    argv0: process.argv0,
    argv: [
      process.argv[0],
      'dummy_process',
      ...args
    ],
    env: {
      ...process.env,
      CT_VERSION: NPM_LOWEST_SUPPORTED.join('.'),
      ...env
    }
  }

  /**
   * @type {Promise<number>}
   */
  const res = cli.run(mockProcess)

  return { res, outFile, errFile }
}

const cliWrapperPath = join(projectRootPath, 'bin', 'cyclonedx-npm-cli.js')

/**
 * @param {string} caseName
 * @return {string}
 */
function mkTemp (caseName) {
  return mkdtempSync(join(projectTestRootPath, '_tmp', `CDX-IT-${caseName}.`))
}

module.exports = {
  NPM_LATETS,
  NPM_LOWEST_SUPPORTED,
  UPDATE_SNAPSHOTS,
  cliWrapperPath,
  demoResultsRoot,
  dummyProjectsRoot,
  dummyResultsRoot,
  latestCdxSpecVersion,
  mkTemp,
  npmLsReplacement,
  npmLsReplacementPath,
  projectDemoRootPath,
  projectRootPath,
  projectTestDataPath,
  runCLI
}

```

---

### setup.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/14937caf7b-cyclonedx-npm/tests/integration/setup.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX generator for NPM projects.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const { spawnSync } = require('node:child_process')
const { join } = require('node:path')

const { getNpmVersion } = require('../_helper')
const { projectDemoRootPath } = require('./');

(function () {
  // skipped for now
  return
  /* eslint-disable no-unreachable */

  const REQUIRES_INSTALL = []

  const npmVersion = getNpmVersion()

  /* region demos */

  // !! due to inconsistencies between npm6,7,8 -
  // some test beds might be skipped
  if (npmVersion[0] >= 8) {
    REQUIRES_INSTALL.push(
      join(projectDemoRootPath, 'alternative-package-registry', 'project'),
      join(projectDemoRootPath, 'bundled-dependencies', 'project'),
      // join(projectDemoRootPath, 'deps-from-git', 'project'),
      join(projectDemoRootPath, 'dev-dependencies', 'project'),
      // join(projectDemoRootPath, 'juice-shop', 'project'),
      join(projectDemoRootPath, 'local-dependencies', 'project'),
      join(projectDemoRootPath, 'local-workspaces', 'project'),
      join(projectDemoRootPath, 'package-integrity', 'project'),
      join(projectDemoRootPath, 'package-with-build-id', 'project')
    )
  }
  /* endregion demos */

  console.warn(`
  WILL SETUP TEST BEDS
  THAT MIGHT CONTAIN OUTDATED VULNERABLE PACKAGES
  FOR SHOWCASING AND TESTING PURPOSES ONLY.
  `)

  process.exitCode = 0

  for (const DIR of REQUIRES_INSTALL) {
    console.log('>>> setup with npm:', DIR)
    const done = spawnSync(
      'npm', ['ci', '--ignore-scripts'], {
        cwd: DIR,
        stdio: 'inherit',
        shell: true
      }
    )
    if (done.status !== 0) {
      ++process.exitCode
      console.error(done)
    }
  }
})()

```

---

### builders.TreeBuilder.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/14937caf7b-cyclonedx-npm/tests/unit/builders.TreeBuilder.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX generator for NPM projects.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const { describe, expect, test } = require('@jest/globals')

const { TreeBuilder } = require('../../dist/builders')

describe('builders.TreeBuilder', () => {
  describe('fromPaths', () => {
    test.each([
      ['distinct dos-like paths', '\\',
        'C:\\foo\\baz',
        [
          'C:\\foo\\bar',
          'C:\\foo\\bar\\bar',
          'D:\\foo\\baz',
          'D:\\foo\\baz\\bar',
          'E:\\foo\\baz',
        ],
        new Map([
          ['C:\\foo\\bar', new Map([
            ['C:\\foo\\bar\\bar', new Map()]
          ])],
          ['D:\\foo\\baz', new Map([
            ['D:\\foo\\baz\\bar', new Map()]
          ])],
          ['E:\\foo\\baz', new Map()]
        ])
      ],
      ['transitive dos-like paths', '\\',
        'C:\\a',
        [
          'C:\\a',
          'C:\\a\\b',
          'C:\\a\\c\\d',
          'C:\\a\\c\\e',
          'C:\\a\\c\\e\\f\\g'
        ],
        new Map([
          ['C:\\a', new Map([
            ['C:\\a\\b', new Map()],
            ['C:\\a\\c\\d', new Map()],
            ['C:\\a\\c\\e', new Map([
              ['C:\\a\\c\\e\\f\\g', new Map()]
            ])]
          ])]
        ])
      ],
      ['distinct paths', '/',
        '/foo/baz',
        [
          '/foo/baz',
          '/foo/baz/bar',
          '/bar/baz',
          '/bar/baz/bar',
          '/baz'
        ],
        new Map([
          ['/foo/baz', new Map([
            ['/foo/baz/bar', new Map()]
          ])],
          ['/bar/baz', new Map([
            ['/bar/baz/bar', new Map()]
          ])],
          ['/baz', new Map()]
        ])
      ],
      ['transitive paths', '/',
        '/a',
        [
          '/a',
          '/a/b',
          '/a/c/d',
          '/a/c/e',
          '/a/c/e/f/g'
        ],
        new Map([
          ['/a', new Map([
            ['/a/b', new Map()],
            ['/a/c/d', new Map()],
            ['/a/c/e', new Map([
              ['/a/c/e/f/g', new Map()]
            ])]
          ])]
        ])
      ]
    ])('%s', (purpose, pathSeparator, root, paths, expected) => {
      const treeBuilder = new TreeBuilder()
      const actual = treeBuilder.fromPaths(root, paths, pathSeparator)
      expect(actual).toMatchObject(expected)
    })
  })
})

```

---

### versionCompare.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/14937caf7b-cyclonedx-npm/tests/unit/versionCompare.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX generator for NPM projects.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const { describe, expect, test } = require('@jest/globals')

const { versionCompare } = require('../../dist/_helpers')

describe('versionCompare', () => {
  test.each([
    // region equal
    [[1], [1], 0],
    [[1, 0, 0], [1, 0, 0], 0],
    [[1, 0, 0], [1], 0],
    [[1], [1, 0, 0], 0],
    // endregion
    // region greater
    [[2], [1], +1],
    [[1, 0, 1], [1, 0, 0], +1],
    [[1, 0, 1], [1], +1],
    [[2], [1, 0, 0], +1],
    // endregion
    // region lower
    [[1], [2], -1],
    [[1, 0, 0], [1, 0, 1], -1],
    [[1, 0, 0], [2], -1],
    [[1], [1, 0, 1], -1]
    // endregion
  ])('%j VS %j => %j', (versionA, versionB, expected) => {
    const actual = versionCompare(versionA, versionB)
    expect(actual).toBe(expected)
  })
})

```

---


## prisma@7.4.2

**Funções usados neste arquivo:** PrismaClient, component, upsert, externalComponent, externalTestFile, findMany, $disconnect, PrismaLibSql

### models.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/_data/models.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const { Enums, Models, Types } = require('../../')

/* eslint-disable jsdoc/no-undefined-types -- something is odd with type detection */

/**
 * @returns {Models.Bom}
 */
function createComplexStructure () {
  const bomSerialNumberRaw = 'ac35b126-ef3a-11ed-a05b-0242ac120003'
  const bom = new Models.Bom({
    version: 7,
    serialNumber: `urn:uuid:${bomSerialNumberRaw}`,
    metadata: new Models.Metadata({
      timestamp: new Date('2032-05-23T13:37:42Z'),
      lifecycles: new Models.LifecycleRepository([
        Enums.LifecyclePhase.Design,
        new Models.NamedLifecycle('testing', { description: 'my testing stage' })
      ]),
      tools: new Models.Tools({
        components: new Models.ComponentRepository([
          new Models.Component(
            Enums.ComponentType.Application,
            'tool name', {
              group: 'tool group',
              version: '0.8.15',
              hashes: new Models.HashDictionary([
                [Enums.HashAlgorithm.MD5, '974e5cc07da6e4536bffd935fd4ddc61'],
                [Enums.HashAlgorithm['SHA-1'], '2aae6c35c94fcfb415dbe95f408b9ce91ee846ed']
              ])
            }),
          new Models.Component(
            Enums.ComponentType.Library,
            'other tool', {
              group: 'tool group',
              version: '', // empty string, not undefined
              externalReferences: new Models.ExternalReferenceRepository([
                new Models.ExternalReference(
                  'https://cyclonedx.org/tool-center/',
                  Enums.ExternalReferenceType.Website,
                  { comment: 'the tools that made this' }
                )
              ])
            })
        ]),
        services: new Models.ServiceRepository([
          new Models.Service('sbom-generator-service', {
            group: 'Service service group',
            version: '1',
            externalReferences: new Models.ExternalReferenceRepository([
              new Models.ExternalReference(
                'https://example.com/sbom-generator-service/',
                Enums.ExternalReferenceType.Website,
                { comment: 'the service that made this' }
              )
            ])
          })
        ])
      }),
      authors: new Models.OrganizationalContactRepository([
        new Models.OrganizationalContact({ name: 'John "the-co-author" Doe' }),
        new Models.OrganizationalContact({
          name: 'Jane "the-author" Doe',
          email: 'cdx-authors@mailinator.com',
          phone: '555-1234567890'
        })
      ]),
      component: new Models.Component(Enums.ComponentType.Library, 'Root Component', {
        bomRef: 'dummy.metadata.component',
        version: '1.33.7'
      }),
      manufacture: new Models.OrganizationalEntity({
        name: 'meta manufacture',
        url: new Set([new URL('https://meta-manufacture.xmpl')])
      }),
      supplier: new Models.OrganizationalEntity({
        name: 'meta supplier',
        url: new Set([new URL('https://meta-supplier.xmpl')]),
        contact: new Models.OrganizationalContactRepository([
          new Models.OrganizationalContact({
            name: 'John "the-supplier" Doe',
            email: 'cdx-suppliers@mailinator.com',
            phone: '555-0123456789'
          }),
          new Models.OrganizationalContact({
            name: 'Jane "the-other-supplier" Doe'
          })
        ])
      }),
      licenses: new Models.LicenseRepository([
        new Models.SpdxLicense('0BSD'),
        new Models.NamedLicense('Some license name')
      ]),
      properties: new Models.PropertyRepository([
        new Models.Property('a', 'b'),
        new Models.Property('cdx:reproducible', 'true')
      ])
    })
  })

  bom.components.add((function (component) {
    component.bomRef.value = 'dummy-component'
    component.author = 'component\'s author'
    component.cpe = 'cpe:2.3:a:microsoft:internet_explorer:8.0.6001:beta:*:*:*:*:*:*'
    component.copyright = 'ACME corp'
    component.description = 'this is a test component'
    component.externalReferences.add(
      new Models.ExternalReference(new URL('https://localhost/acme'), Enums.ExternalReferenceType.Website, { comment: 'testing' }))
    component.externalReferences.add(new Models.ExternalReference(
      new URL('https://localhost/acme/support'),
      Enums.ExternalReferenceType.Support
    ))
    component.externalReferences.add(new Models.ExternalReference(
      'https://localhost/download/acme.tar.gz',
      Enums.ExternalReferenceType.Distribution,
      {
        hashes: new Models.HashDictionary([
          [Enums.HashAlgorithm.MD5, '327b6f07435811239bc47e1544353273'],
          [Enums.HashAlgorithm['SHA-1'], 'd53a205a336e07cf9eac45471b3870f9489288ec'],
          [Enums.HashAlgorithm['SHA-256'], '1f2ec52b774368781bed1d1fb140a92e0eb6348090619c9291f9a5a3c8e8d151']
        ])
      }
    ))
    component.externalReferences.add(new Models.ExternalReference(
      'git+https://localhost/acme.git',
      Enums.ExternalReferenceType.VCS
    ))
    component.externalReferences.add(new Models.ExternalReference(
      './other/file',
      Enums.ExternalReferenceType.ReleaseNotes // available since spec 1.4
    ))
    component.group = 'acme'
    component.hashes.set(Enums.HashAlgorithm['SHA-1'], 'e6f36746ccba42c288acf906e636bb278eaeb7e8')
    component.hashes.set(Enums.HashAlgorithm.MD5, '6bd3ac6fb35bb07c3f74d7f72451af57')
    component.hashes.set(Enums.HashAlgorithm['SHA-256'], 'something-invalid-according-to-spec')
    component.licenses.add(new Models.NamedLicense('some other', {
      text: new Models.Attachment('U29tZQpsaWNlbnNlCnRleHQu', {
        contentType: 'text/plain',
        encoding: Enums.AttachmentEncoding.Base64
      }),
      url: 'https://localhost/license',
      properties: new Models.PropertyRepository([
        new Models.Property('a', 'b'),
        new Models.Property('primaryLicense', 'true')
      ])
    }))
    component.licenses.add((function (license) {
      license.text = new Models.Attachment('TUlUIExpY2Vuc2UKLi4uClRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCAiQVMgSVMiLi4u')
      license.text.contentType = 'text/plain'
      license.text.encoding = Enums.AttachmentEncoding.Base64
      license.url = new URL('https://spdx.org/licenses/MIT.html')
      license.acknowledgement = Enums.LicenseAcknowledgement.Declared
      return license
    })(new Models.SpdxLicense('MIT', {
      properties: new Models.PropertyRepository([
        new Models.Property('c', 'd'),
        new Models.Property('primaryLicense', 'false')
      ])
    })))
    component.publisher = 'the publisher'
    component.purl = 'pkg:npm/acme/dummy-component@1337-beta'
    component.scope = Enums.ComponentScope.Required
    component.supplier = new Models.OrganizationalEntity({ name: 'Component Supplier' })
    component.supplier.url.add(new URL('https://localhost/componentSupplier-B'))
    component.supplier.url.add('https://localhost/componentSupplier-A')
    component.supplier.contact.add(new Models.OrganizationalContact({ name: 'The quick brown fox' }))
    component.supplier.contact.add((function (contact) {
      contact.name = 'Franz'
      contact.email = 'franz-aus-bayern@komplett.verwahrlostes.taxi'
      contact.phone = '555-732378879'
      return contact
    })(new Models.OrganizationalContact()))
    component.swid = new Models.SWID('some-tag', 'dummy-component', {
      version: '1337-beta',
      patch: true,
      text: new Models.Attachment('some context')
    })
    component.swid.text.contentType = 'some context type'
    component.swid.text.encoding = Enums.AttachmentEncoding.Base64
    component.swid.url = new URL('https://localhost/swid')

    bom.metadata.component.dependencies.add(component.bomRef)

    component.evidence = new Models.ComponentEvidence()
    component.evidence.licenses.add((function (license) {
      license.text = new Models.Attachment(
        'VEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIOKAnEFTIElT4oCdLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS4='
      )
      license.text.contentType = 'text/plain'
      license.text.encoding = Enums.AttachmentEncoding.Base64
      return license
    })(new Models.NamedLicense('License.txt')))
    component.evidence.copyright.add('Copyright © 2023 ACME corp')

    return component
  })(new Models.Component(Enums.ComponentType.Library, 'dummy-component', { version: '1337-beta' })))

  bom.components.add((function (component) {
    // interlink everywhere
    bom.metadata.component.dependencies.add(component.bomRef)
    bom.components.forEach(c => c.dependencies.add(component.bomRef))
    return component
  })(new Models.Component(Enums.ComponentType.Library, 'a-component', {
    bomRef: 'a-component',
    version: '', // empty string - not undefined
    dependencies: new Models.BomRefRepository([
      new Models.BomRef('unknown foreign ref that should not be rendered')
    ])
  })))

  bom.components.add((function (component) {
    // scenario:
    // * `subComponentA` is a bundled dependency, that itself depends on `subComponentB`.
    // * `subComponentB` is a transitive bundled dependency.
    const subComponentA = new Models.Component(Enums.ComponentType.Library, 'SubComponentA', {
      bomRef: `${component.bomRef.value}#SubComponentA`
    })
    component.dependencies.add(subComponentA.bomRef)
    component.components.add(subComponentA)
    const subComponentB = new Models.Component(Enums.ComponentType.Library, 'SubComponentB', {
      bomRef: `${component.bomRef.value}#SubComponentB`
    })
    subComponentA.dependencies.add(subComponentB.bomRef)
    component.components.add(subComponentB)

    bom.metadata.component.dependencies.add(component.bomRef)

    return component
  })(new Models.Component(
    Enums.ComponentType.Framework, 'SomeFrameworkBundle', {
      bomRef: 'SomeFrameworkBundle'
    })))

  bom.components.add(new Models.Component(
    Enums.ComponentType.Library, 'component-with-properties', {
      bomRef: 'ComponentWithProperties',
      properties: new Models.PropertyRepository([
        new Models.Property('internal:testing:prop-Z', 'value Z'),
        new Models.Property('internal:testing:prop-Z', 'value B'),
        new Models.Property('internal:testing:prop-A', 'value A')
      ])
    }))

  bom.components.add(
    new Models.Component(
      Enums.ComponentType.Library, 'component-with-licenses', {
        bomRef: 'component-with-licenses',
        licenses: new Models.LicenseRepository([
          new Models.NamedLicense('something'),
          new Models.SpdxLicense('MIT'),
          new Models.SpdxLicense('Apache-2.0'),
          new Models.SpdxLicense('unknown SPDX license', { url: 'https://acme.com/license' })
          // no expression
        ])
      }
    )
  )
  bom.components.add(
    new Models.Component(
      Enums.ComponentType.Library, 'component-with-licenseExpression', {
        bomRef: 'component-with-licenseExpression',
        licenses: new Models.LicenseRepository([
          new Models.LicenseExpression('(MIT OR Apache-2.0)')
          // no named nor SPDX
        ])
      }
    )
  )
  bom.components.add(
    /* scenario: prefer any expression over other licenses */
    new Models.Component(
      Enums.ComponentType.Library, 'component-with-licenses-and-expression', {
        bomRef: 'component-with-licenses-and-expression',
        licenses: new Models.LicenseRepository([
          new Models.NamedLicense('something'),
          new Models.SpdxLicense('MIT'),
          new Models.SpdxLicense('Apache-2.0'),
          new Models.LicenseExpression('(MIT OR Apache-2.0)')
        ])
      }
    )
  )

  bom.components.add(
    new Models.Component(
      Enums.ComponentType.Library, 'component-with-unescaped-urls', {
        bomRef: 'component-with-unescaped-urls',
        externalReferences: new Models.ExternalReferenceRepository(
          [
            ['encode anyUri: urn', 'urn:example:org'],
            ['encode anyUri: https', 'https://example.org/p?k=v#f'],
            ['encode anyUri: mailto', 'mailto:info@example.org'],
            ['encode anyUri: relative path', '../foo/bar'],
            ['encode anyUri: space', 'https://example.org/foo bar bazz%20again+again'],
            ['encode anyUri: quotation', 'https://example.org/this"test"isa\'test\''],
            ['encode anyUri: []', 'https://example.org/?bar[test]=baz[again]'],
            ['encode anyUri: <>', 'https://example.org/#<test><again>'],
            ['encode anyUri: {}', 'https://example.org/#{test}{again}'],
            ['encode anyUri: non-ASCII', 'https://example.org/édition'],
            ['encode anyUri: partially encoded', 'https://example.org/?bar[test%5D=baz%5bagain]']
          ].map(
            ([desc, uri]) => new Models.ExternalReference(
              uri, Enums.ExternalReferenceType.Other, {
                comment: desc
              }
            )
          )
        )
      }
    )
  )

  bom.services.add((function (service) {
    service.bomRef.value = 'some-service'
    service.provider = new Models.OrganizationalEntity({ name: 'Service Provider' })
    service.group = 'acme'
    service.description = 'this is a test service'
    service.externalReferences.add(new Models.ExternalReference(
      'https://localhost/service/docs',
      Enums.ExternalReferenceType.Documentation
    ))
    service.licenses.add(new Models.NamedLicense('some license', {
      text: new Models.Attachment('U29tZQpsaWNlbnNlCnRleHQu', {
        contentType: 'text/plain',
        encoding: Enums.AttachmentEncoding.Base64
      }),
      url: 'https://localhost/service/license'
    }))
    service.properties.add(new Models.Property('foo', 'bar'))

    bom.metadata.component.dependencies.add(service.bomRef)

    return service
  })(new Models.Service('dummy-service', { version: '1.0+service-version' })))

  bom.services.add((function (service) {
    service.bomRef.value = 'my-service'

    const s2 = new Models.Service('sub-service')
    s2.bomRef.value = 'my-service/sub-service'
    service.services.add(s2)

    const s3 = new Models.Service('nested-service')
    s3.bomRef.value = 'my-service/nested-service'
    service.services.add(s3)

    bom.metadata.component.dependencies.add(service.bomRef)

    return service
  })(new Models.Service('dummy-service-2')))

  const someVulnerableComponent = new Models.Component(
    Enums.ComponentType.Library,
    'component-with-vulnerabilities',
    {
      bomRef: 'component-with-vulnerabilities',
      version: '1.0'
    }
  )
  bom.components.add(someVulnerableComponent)

  bom.vulnerabilities.add(
    /* scenario: https://cyclonedx.org/use-cases/#known-vulnerabilities */
    new Models.Vulnerability.Vulnerability({
      bomRef: 'vulnerability-1',
      id: 'CVE-2018-7489',
      source: new Models.Vulnerability.Source({
        name: 'NVD',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2019-9997'
      }),
      ratings: new Models.Vulnerability.RatingRepository([
        new Models.Vulnerability.Rating({
          source: new Models.Vulnerability.Source({
            name: 'NVD',
            url: 'https://nvd.nist.gov/vuln-metrics/cvss/v3-calculator?vector=AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H&version=3.0'
          }),
          score: 9.8,
          severity: Enums.Vulnerability.Severity.Critical,
          method: 'CVSSv3',
          vector: 'AN/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'
        })
      ]),
      cwes: new Types.CweRepository([
        502,
        184
      ]),
      description: 'FasterXML jackson-databind before 2.7.9.3, 2.8.x before 2.8.11.1 and 2.9.x before 2.9.5 allows unauthenticated remote code execution because of an incomplete fix for the CVE-2017-7525 deserialization flaw. This is exploitable by sending maliciously crafted JSON input to the readValue method of the ObjectMapper, bypassing a blacklist that is ineffective if the c3p0 libraries are available in the classpath.',
      recommendation: 'Upgrade com.fasterxml.jackson.core:jackson-databind to version 2.6.7.5, 2.8.11.1, 2.9.5 or higher.',
      advisories: new Models.Vulnerability.AdvisoryRepository([
        new Models.Vulnerability.Advisory(
          'https://github.com/FasterXML/jackson-databind/commit/6799f8f10cc78e9af6d443ed6982d00a13f2e7d2',
          { title: 'GitHub Commit' }
        ),
        new Models.Vulnerability.Advisory(
          new URL('https://github.com/FasterXML/jackson-databind/issues/1931'),
          { title: 'GitHub Issue' }
        )
      ]),
      created: new Date('2021-08-15T23:42:00Z'),
      published: new Date('2022-01-01T00:00:00Z'),
      updated: new Date('2023-01-01T00:00:00Z'),
      analysis: new Models.Vulnerability.Analysis({
        state: Enums.Vulnerability.AnalysisState.NotAffected,
        justification: Enums.Vulnerability.AnalysisJustification.CodeNotReachable,
        response: new Enums.Vulnerability.AnalysisResponseRepository([
          Enums.Vulnerability.AnalysisResponse.WillNotFix,
          Enums.Vulnerability.AnalysisResponse.Update
        ]),
        detail: 'An optional explanation of why the application is not affected by the vulnerable component.'
      }),
      affects: new Models.Vulnerability.AffectRepository([
        new Models.Vulnerability.Affect(
          new Models.BomRef('urn:cdx:3e671687-395b-41f5-a30f-a58921a69b79/1#jackson-databind-2.8.0')
        )
      ])
    })
  )

  bom.vulnerabilities.add(
    /* scenario: complete model affecting some component */
    new Models.Vulnerability.Vulnerability({
      bomRef: 'dummy.vulnerability.1',
      id: '1',
      source: new Models.Vulnerability.Source({ name: 'manual' }),
      references: new Models.Vulnerability.ReferenceRepository([
        new Models.Vulnerability.Reference(
          'CVE-2042-42421',
          new Models.Vulnerability.Source({ url: 'https://nvd.nist.gov/vuln/detail/CVE-2022-42421' })),
        new Models.Vulnerability.Reference(
          'CVE-2042-42420',
          new Models.Vulnerability.Source({ url: 'https://nvd.nist.gov/vuln/detail/CVE-2022-42420' }))
      ]),
      ratings: new Models.Vulnerability.RatingRepository([
        new Models.Vulnerability.Rating({
          score: 10,
          method: Enums.Vulnerability.RatingMethod.Other,
          severity: Enums.Vulnerability.Severity.Critical,
          justification: 'this is crazy'
        })
      ]),
      cwes: new Types.CweRepository([142, 42]),
      advisories: new Models.Vulnerability.AdvisoryRepository([
        new Models.Vulnerability.Advisory('https://www.advisories.com/', { title: 'vulnerability 1 discovered' })
      ]),
      description: 'description of 1',
      detail: 'detail of 1',
      recommendation: 'recommendation of 1',
      created: new Date('2023-03-03T00:00:40.000Z'),
      published: new Date('2023-03-03T00:00:41.000Z'),
      updated: new Date('2023-03-03T00:00:42.000Z'),
      credits: new Models.Vulnerability.Credits({
        organizations: new Models.OrganizationalEntityRepository([
          new Models.OrganizationalEntity({
            name: 'vulnerability researchers inc.',
            url: new Set([new URL('https://vulnerabilities-researchers.com')])
          })
        ]),
        individuals: new Models.OrganizationalContactRepository([
          new Models.OrganizationalContact({ name: 'John "pentester" Doe' })
        ])
      }),
      tools: new Models.Tools({
        tools: new Models.ToolRepository([
          new Models.Tool({
            vendor: 'v the vendor',
            name: 'tool name'
          })
        ])
      }),
      analysis: new Models.Vulnerability.Analysis({
        state: Enums.Vulnerability.AnalysisState.FalsePositive,
        justification: Enums.Vulnerability.AnalysisJustification.ProtectedAtRuntime,
        response: new Enums.Vulnerability.AnalysisResponseRepository([
          Enums.Vulnerability.AnalysisResponse.CanNotFix,
          Enums.Vulnerability.AnalysisResponse.WillNotFix
        ]),
        detail: 'analysis details'
      }),
      affects: new Models.Vulnerability.AffectRepository([
        new Models.Vulnerability.Affect(
          new Models.BomRef(`urn:cdx:${bomSerialNumberRaw}/${bom.version}#${someVulnerableComponent.bomRef.value}`),
          {
            versions: new Models.Vulnerability.AffectedVersionRepository([
              new Models.Vulnerability.AffectedSingleVersion('1.0.0', {
                status: Enums.Vulnerability.AffectStatus.Affected
              }),
              new Models.Vulnerability.AffectedVersionRange('> 1.0', {
                status: Enums.Vulnerability.AffectStatus.Unknown
              })
            ])
          }),
        new Models.Vulnerability.Affect(
          someVulnerableComponent.bomRef,
          {
            versions: new Models.Vulnerability.AffectedVersionRepository([
              new Models.Vulnerability.AffectedSingleVersion('1.0.0', {
                status: Enums.Vulnerability.AffectStatus.Affected
              })
            ])
          })
      ]),
      properties: new Models.PropertyRepository([
        new Models.Property('a name', 'a value')
      ])
    }))
  bom.vulnerabilities.add(
    /* scenario: complete model affecting own rootComponent */
    new Models.Vulnerability.Vulnerability({
      bomRef: 'dummy.vulnerability.2',
      id: '2',
      source: new Models.Vulnerability.Source({ name: 'manual' }),
      references: new Models.Vulnerability.ReferenceRepository([
        new Models.Vulnerability.Reference(
          'CVE-2042-42422',
          new Models.Vulnerability.Source({
            url: 'https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-42422'
          }))
      ]),
      ratings: new Models.Vulnerability.RatingRepository([
        new Models.Vulnerability.Rating({
          score: 10,
          method: Enums.Vulnerability.RatingMethod.Other,
          severity: Enums.Vulnerability.Severity.Critical,
          justification: 'this is crazy'
        })
      ]),
      cwes: new Types.CweRepository([242]),
      advisories: new Models.Vulnerability.AdvisoryRepository([
        new Models.Vulnerability.Advisory('https://www.advisories.com/', { title: 'vulnerability 2 discovered' })
      ]),
      description: 'description of 2',
      detail: 'detail of 2',
      recommendation: 'recommendation of 2',
      created: new Date('2023-03-03T00:00:40.000Z'),
      published: new Date('2023-03-03T00:00:41.000Z'),
      updated: new Date('2023-03-03T00:00:42.000Z'),
      credits: new Models.Vulnerability.Credits({
        organizations: new Models.OrganizationalEntityRepository([
          new Models.OrganizationalEntity({
            name: 'vulnerability researchers inc.',
            url: new Set([new URL('https://vulnerabilities-researchers.com')])
          })
        ]),
        individuals: new Models.OrganizationalContactRepository([
          new Models.OrganizationalContact({ name: 'John "pentester" Doe' })
        ])
      }),
      tools: new Models.Tools({
        tools: new Models.ToolRepository([
          new Models.Tool({
            vendor: 'v the vendor',
            name: 'tool name'
          })
        ]),
        components: new Models.ComponentRepository([
          new Models.Component(
            Enums.ComponentType.Application,
            'other tool name', {
              group: 'g the group'
            })
        ])
      }),
      analysis: new Models.Vulnerability.Analysis({
        state: Enums.Vulnerability.AnalysisState.FalsePositive,
        justification: Enums.Vulnerability.AnalysisJustification.ProtectedAtRuntime,
        response: new Enums.Vulnerability.AnalysisResponseRepository([
          Enums.Vulnerability.AnalysisResponse.CanNotFix,
          Enums.Vulnerability.AnalysisResponse.WillNotFix
        ]),
        detail: 'analysis details'
      }),
      affects: new Models.Vulnerability.AffectRepository([
        new Models.Vulnerability.Affect(
          new Models.BomRef(`urn:cdx:${bomSerialNumberRaw}/${bom.version}#${bom.metadata.component.bomRef.value}`),
          {
            versions: new Models.Vulnerability.AffectedVersionRepository([
              new Models.Vulnerability.AffectedSingleVersion('1.0.0', {
                status: Enums.Vulnerability.AffectStatus.Affected
              }),
              new Models.Vulnerability.AffectedVersionRange('> 1.0', {
                status: Enums.Vulnerability.AffectStatus.Unknown
              })
            ])
          }),
        new Models.Vulnerability.Affect(
          bom.metadata.component.bomRef,
          {
            versions: new Models.Vulnerability.AffectedVersionRepository([
              new Models.Vulnerability.AffectedSingleVersion('1.0.0', {
                status: Enums.Vulnerability.AffectStatus.Affected
              })
            ])
          })
      ]),
      properties: new Models.PropertyRepository([
        new Models.Property('a name', 'a value')
      ])
    }))

  return bom
}

/**
 * @returns {Models.Bom}
 */
function createAllTools () {
  const bomSerialNumberRaw = '8fd9e244-73b6-4cd3-ab3a-a0fefdee5c9e'
  const bom = new Models.Bom({
    version: 7,
    serialNumber: `urn:uuid:${bomSerialNumberRaw}`,
  })
  bom.metadata.tools.components.add(
    new Models.Component(
      Enums.ComponentType.Application,
      'Component tool name', {
        group: 'Component tool group',
        version: '0.8.15',
        hashes: new Models.HashDictionary([
          [Enums.HashAlgorithm.MD5, '974e5cc07da6e4536bffd935fd4ddc61'],
          [Enums.HashAlgorithm['SHA-1'], '2aae6c35c94fcfb415dbe95f408b9ce91ee846ed']
        ])
      }))
  bom.metadata.tools.services.add(
    new Models.Service('sbom-generator-service', {
      group: 'Service tool group',
      version: '1',
      externalReferences: new Models.ExternalReferenceRepository([
        new Models.ExternalReference(
          'https://example.com/sbom-generator-service/',
          Enums.ExternalReferenceType.Website,
          { comment: 'the service that made this' }
        )
      ])
    })
  )
  bom.metadata.tools.tools.add(
    new Models.Tool({
      vendor: 'Tool tool vendor',
      name: 'Tool tool name',
      version: '0.8.15',
      hashes: new Models.HashDictionary([
        [Enums.HashAlgorithm.MD5, 'f32a26e2a3a8aa338cd77b6e1263c535'],
        [Enums.HashAlgorithm['SHA-1'], '829c3804401b0727f70f73d4415e162400cbe57b']
      ])
    })
  )
  bom.metadata.tools.tools.add(
    new Models.Tool({
      vendor: 'Tool tool vendor',
      name: 'Tool other tool',
      version: '', // empty string, not undefined
      externalReferences: new Models.ExternalReferenceRepository([
        new Models.ExternalReference(
          'https://cyclonedx.org/tool-center/',
          Enums.ExternalReferenceType.Website,
          { comment: 'the tools that made this' }
        )
      ])
    })
  )
  return bom
}

module.exports = {
  createAllTools,
  createComplexStructure
}

```

---

### normalize.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/_data/normalize.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const fs = require('node:fs')
const path = require('node:path')

/* eslint-disable jsdoc/valid-types */

/**
 * @typedef {import('../../src/spec').Version} Version
 */

/**
 * @typedef {import('@types/node').BufferEncoding} BufferEncoding
 */

/* eslint-enable jsdoc/valid-types */

/**
 * @param {string} purpose
 * @param {Version} spec
 * @param {string} format
 * @param {BufferEncoding} [encoding]
 * @returns {string}
 */
module.exports.loadNormalizeResult = function (purpose, spec, format, encoding = 'utf-8') {
  return fs.readFileSync(
    path.resolve(__dirname, 'normalizeResults', `${purpose}_spec${spec}.${format}`)
  ).toString(encoding)
}

/**
 * @param {string} data
 * @param {string} purpose
 * @param {Version} spec
 * @param {string} format
 */
module.exports.writeNormalizeResult = function (data, purpose, spec, format) {
  return fs.writeFileSync(
    path.resolve(__dirname, 'normalizeResults', `${purpose}_spec${spec}.${format}`),
    data
  )
}

```

---

### serialize.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/_data/serialize.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const fs = require('node:fs')
const path = require('node:path')

/* eslint-disable jsdoc/valid-types */

/**
 * @typedef {import('../../src/spec').Version} Version
 */

/**
 * @typedef {import('@types/node').BufferEncoding} BufferEncoding
 */

/* eslint-enable jsdoc/valid-types */

/**
 * @param {string} purpose
 * @param {Version} spec
 * @param {string} format
 * @param {BufferEncoding} [encoding]
 * @returns {string}
 */
module.exports.loadSerializeResult = function (purpose, spec, format, encoding = 'utf-8') {
  return fs.readFileSync(
    path.resolve(__dirname, 'serializeResults', `${purpose}_spec${spec}.${format}.bin`)
  ).toString(encoding)
}

/**
 * @param {string} data
 * @param {string} purpose
 * @param {Version} spec
 * @param {string} format
 */
module.exports.writeSerializeResult = function (data, purpose, spec, format) {
  return fs.writeFileSync(
    path.resolve(__dirname, 'serializeResults', `${purpose}_spec${spec}.${format}.bin`),
    data
  )
}

```

---

### spdx.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/_data/spdx.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')
const fs = require('node:fs')

const { _Resources: { FILES: { SPDX: { JSON_SCHEMA: SPDX_JSON_SCHEMA } } } } = require('../../')

const spdxSpecEnum = JSON.parse(fs.readFileSync(
  SPDX_JSON_SCHEMA
)).enum

assert.ok(spdxSpecEnum instanceof Array)
assert.notEqual(spdxSpecEnum.length, 0)
spdxSpecEnum.forEach(value => assert.strictEqual(typeof value, 'string'))

exports.spdxSpecEnum = spdxSpecEnum

```

---

### specLoader.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/_data/specLoader.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const fs = require('node:fs')
const path = require('node:path')

const resPath = path.resolve(__dirname, '..', '..', 'res', 'schema')

/**
 * @param {string} resourceFile
 * @returns {*}
 * @throws {Error} if parsing the `resourceFile` failed somehow
 */
function loadSpec (resourceFile) {
  return JSON.parse(
    fs.readFileSync(
      path.resolve(resPath, resourceFile)
    )
  )
}

/**
 * @param {string} resourceFile
 * @param {string|number} path
 * @returns {*}
 * @throws {TypeError} if resolving the `path` failed
 * @throws {Error} if parsing the `resourceFile` failed somehow
 */
function getSpecElement (resourceFile, ...path) {
  let element = loadSpec(resourceFile)
  for (const segment of path) {
    element = element[segment]
    if (undefined === element) {
      throw TypeError(`undefined element: ${resourceFile}#${path.join('.')}`)
    }
  }
  return element
}

/**
 * @param {string} resourceFile
 * @param {string|number} path
 * @returns {Array<number|string>}
 * @throws {TypeError} if resolved `path` is not non-empty-list
 * @throws {TypeError} if resolving the `path` failed
 * @throws {Error} if parsing the `resourceFile` failed somehow
 */
function getSpecEnum (resourceFile, ...path) {
  const element = getSpecElement(
    resourceFile,
    'definitions', ...path, 'enum')
  if (!Array.isArray(element) || element.length === 0) {
    throw TypeError(`did not resolve non-empty-list for: ${resourceFile}#${path.join('.')}`)
  }
  return element
}

module.exports = {
  getSpecElement,
  getSpecEnum,
  loadSpec
}

```

---

### specLoader.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/_data/specLoader.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const { getSpecElement, getSpecEnum, loadSpec } = require('./specLoader')

suite('test helpers: specLoader', () => {
  const expectedDefinitionsAffectedStatusEnum = [
    'affected',
    'unaffected',
    'unknown'
  ]

  suite('loadSpec()', () => {
    test('unknown file', () => {
      assert.throws(
        () => { loadSpec('DOES-NOT-EXIST.schema.json') },
        Error,
        'missing expected error'
      )
    })
    test('happy path', () => {
      const loaded = loadSpec('bom-1.4.SNAPSHOT.schema.json')
      // dummy test to see if loading worked somehow ...
      assert.deepStrictEqual(loaded.definitions.affectedStatus.enum, expectedDefinitionsAffectedStatusEnum)
    })
  })

  suite('getSpecElement()', () => {
    test('unknown path', () => {
      assert.throws(
        () => { getSpecElement('bom-1.4.SNAPSHOT.schema.json', 'properties', 'UNKNOWN_PROP') },
        TypeError('undefined element: bom-1.4.SNAPSHOT.schema.json#properties.UNKNOWN_PROP'),
        'missing expected error'
      )
    })
    test('happy path', () => {
      const loaded = getSpecElement(
        'bom-1.4.SNAPSHOT.schema.json',
        'definitions', 'affectedStatus', 'enum')
      // dummy test to see if loading worked somehow ...
      assert.deepStrictEqual(loaded, expectedDefinitionsAffectedStatusEnum)
    })
  })

  suite('getSpecEnum()', () => {
    test('happy path', () => {
      const loaded = getSpecEnum(
        'bom-1.4.SNAPSHOT.schema.json',
        'affectedStatus')
      // dummy test to see if loading worked somehow ...
      assert.deepStrictEqual(loaded, expectedDefinitionsAffectedStatusEnum)
    })
  })
})

```

---

### stringFunctions.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/_helpers/stringFunctions.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

module.exports = {

  /**
   * Capitalise the first letter of a string
   * @param {string} s
   * @returns {string}
   */
  capitaliseFirstLetter: s => s.charAt(0).toUpperCase() + s.slice(1),

  /**
   * UpperCamelCase a string
   * @param {string} s
   * @returns {string}
   */
  upperCamelCase: s => s.replace(
    /_/g,
    ' '
  ).replace(
    /\b\w/g,
    f => f.slice(-1).toUpperCase()
  ).replace(/\W/g, ''),

  /**
   * Generate a random string of length.
   * @param {number} length
   * @returns {string}
   */
  randomString: length => Math.random().toString(32).substring(2, 2 + length).padEnd(length, 'x'),

  /**
   * source: https://stackoverflow.com/a/6969486
   * @param {string} s
   * @return {string}
   */
  escapeRegExp: s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

```

---

### stringFunctions.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/_helpers/stringFunctions.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const stringFunctions = require('./stringFunctions')

suite('test helpers: stringFunctions', () => {
  suite('capitaliseFirstLetter()', () => {
    [
      ['foo', 'Foo'],
      ['Bar', 'Bar'],
      ['foo bar', 'Foo bar'],
      ['', '']
    ].forEach(([value, expected]) =>
      test(`for value: ${value}`, () =>
        assert.strictEqual(stringFunctions.capitaliseFirstLetter(value), expected)
      )
    )
  })

  suite('upperCamelCase()', () => {
    [
      ['foo', 'Foo'],
      ['Bar', 'Bar'],
      ['FooBar', 'FooBar'],
      // region space delimiter
      ['foo bar', 'FooBar'],
      ['Foo bar', 'FooBar'],
      ['foo Bar', 'FooBar'],
      ['Foo bar', 'FooBar'],
      // endregion space delimiter
      // region dot delimiter
      ['foo.bar', 'FooBar'],
      ['Foo.bar', 'FooBar'],
      ['foo.Bar', 'FooBar'],
      ['Foo.bar', 'FooBar'],
      // endregion dot delimiter
      // region hyphen delimiter
      ['foo-bar', 'FooBar'],
      ['Foo-bar', 'FooBar'],
      ['foo-Bar', 'FooBar'],
      ['Foo-bar', 'FooBar'],
      // endregion hyphen delimiter
      // region underscore delimiter
      ['foo_bar', 'FooBar'],
      ['Foo_bar', 'FooBar'],
      ['foo_Bar', 'FooBar'],
      ['Foo_bar', 'FooBar'],
      // endregion underscore delimiter
      ['', '']
    ].forEach(([value, expected]) =>
      test(`for value: ${value}`, () =>
        assert.strictEqual(stringFunctions.upperCamelCase(value), expected)
      )
    )
  })

  suite('randomString()', () => {
    [10, 5, 1, 0].forEach(length =>
      test(`for length: ${length}`, () => {
        const value = stringFunctions.randomString(length)
        assert.strictEqual(length, value.length)
      })
    )
  })

  suite('escapeRegExp()', () => {
    test('escapes only reserved', () => {
      assert.strictEqual(
        stringFunctions.escapeRegExp('^a([sd]*f? f+o{3}o.|ba\\r)$'),
        '\\^a\\(\\[sd\\]\\*f\\? f\\+o\\{3\\}o\\.\\|ba\\\\r\\)\\$'
      )
    })
  })
})

```

---

### helpers.mime.node.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/contrib/license/unit/internals/helpers.mime.node.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  guessMimeTypeForLicenseFile
} = require('../../../../../dist.node/contrib/license/_helpers/mime.node')

suite('unit: internals: helpers.mime.getMimeForLicenseFile', () => {
  for (const [fileName, expected] of [
    ['LICENCE', 'text/plain'],
    ['site.html', 'text/html'],
    ['license.md', 'text/markdown'],
    ['info.xml', 'text/xml'],
    ['UNKNOWN', 'text/plain'],
    ['LICENCE.MIT', 'text/plain'],
    ['mit.license', 'text/plain']
  ]) {
    test(fileName, () => {
      const value = guessMimeTypeForLicenseFile(fileName)
      assert.strictEqual(value, expected)
    })
  }
})

```

---

### Enums.ComponentScope.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/Enums.ComponentScope.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Enums: { ComponentScope },
  Spec: { Version },
  _Resources: { FILES: { CDX: { JSON_SCHEMA: CDX_JSON_SCHEMA } } }
} = require('../../')
const { getSpecEnum } = require('../_data/specLoader')
const { upperCamelCase } = require('../_helpers/stringFunctions')

suite('functional: ComponentScope enum', () => {
  const specVersions = new Set([
    Version.v1dot7,
    Version.v1dot6,
    Version.v1dot5,
    Version.v1dot4,
    Version.v1dot3,
    Version.v1dot2,
  ])

  specVersions.forEach(specVersion =>
    suite(`from spec ${specVersion}`, () => {
      const enumValues = getSpecEnum(
        CDX_JSON_SCHEMA[specVersion],
        'component', 'properties', 'scope')
      enumValues.forEach(enumValue => {
        const expectedName = upperCamelCase(enumValue)
        test(`is known: ${expectedName} -> ${enumValue}`, () =>
          assert.strictEqual(ComponentScope[expectedName], enumValue)
        )
      })
    })
  )
})

```

---

### Enums.ComponentType.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/Enums.ComponentType.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Enums: { ComponentType },
  Spec: { Version, SpecVersionDict },
  _Resources: { FILES: { CDX: { JSON_SCHEMA: CDX_JSON_SCHEMA } } }
} = require('../../')
const { getSpecEnum } = require('../_data/specLoader')
const { upperCamelCase } = require('../_helpers/stringFunctions')

suite('functional: ComponentType enum', () => {
  const specVersions = new Set([
    Version.v1dot7,
    Version.v1dot6,
    Version.v1dot5,
    Version.v1dot4,
    Version.v1dot3,
    Version.v1dot2,
  ])

  specVersions.forEach(specVersion =>
    suite(`from spec ${specVersion}`, () => {
      const knownValues = getSpecEnum(
        CDX_JSON_SCHEMA[specVersion],
        'component', 'properties', 'type')
      knownValues.forEach(enumValue => {
        const expectedName = upperCamelCase(enumValue)
        test(`is known: ${expectedName} -> ${enumValue}`, () =>
          assert.strictEqual(ComponentType[expectedName], enumValue)
        )
        test(`is supported: ${enumValue}`, () =>
          assert.strictEqual(SpecVersionDict[specVersion]?.supportsComponentType(enumValue), true)
        )
      })
      const unknownValues = Object.values(ComponentType).filter(enumValue => !knownValues.includes(enumValue))
      unknownValues.forEach(enumValue =>
        test(`not supported: ${enumValue}`, () =>
          assert.strictEqual(SpecVersionDict[specVersion]?.supportsHashAlgorithm(enumValue), false)
        )
      )
    })
  )
})

```

---

### Enums.ExternalReferenceType.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/Enums.ExternalReferenceType.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Enums: { ExternalReferenceType },
  Spec: { Version, SpecVersionDict },
  _Resources: { FILES: { CDX: { JSON_SCHEMA: CDX_JSON_SCHEMA } } }
} = require('../../')
const { getSpecEnum } = require('../_data/specLoader')
const { upperCamelCase } = require('../_helpers/stringFunctions')

suite('functional: ExternalReferenceType enum', () => {
  const specVersions = new Set([
    Version.v1dot7,
    Version.v1dot6,
    Version.v1dot5,
    Version.v1dot4,
    Version.v1dot3,
    Version.v1dot2,
  ])

  specVersions.forEach(specVersion =>
    suite(`from spec ${specVersion}`, () => {
      const knownValues = getSpecEnum(
        CDX_JSON_SCHEMA[specVersion],
        'externalReference', 'properties', 'type')
      knownValues.forEach(enumValue => {
        let expectedName = upperCamelCase(enumValue)
        switch (enumValue) {
          case 'vcs':
          case 'bom':
          case 'poam':
          case 'rfc-9116':
            expectedName = expectedName.toUpperCase()
            break
        }
        test(`is known: ${expectedName} -> ${enumValue}`, () =>
          assert.strictEqual(ExternalReferenceType[expectedName], enumValue)
        )
        test(`is supported: ${enumValue}`, () =>
          assert.strictEqual(SpecVersionDict[specVersion]?.supportsExternalReferenceType(enumValue), true)
        )
      })
      const unknownValues = Object.values(ExternalReferenceType).filter(enumValue => !knownValues.includes(enumValue))
      unknownValues.forEach(enumValue =>
        test(`not supported: ${enumValue}`, () =>
          assert.strictEqual(SpecVersionDict[specVersion]?.supportsHashAlgorithm(enumValue), false)
        )
      )
    })
  )
})

```

---

### Enums.HashAlogorithms.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/Enums.HashAlogorithms.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Enums: { HashAlgorithm },
  Spec: { Version, SpecVersionDict },
  _Resources: { FILES: { CDX: { JSON_SCHEMA: CDX_JSON_SCHEMA } } }
} = require('../../')
const { getSpecEnum } = require('../_data/specLoader')
const { capitaliseFirstLetter } = require('../_helpers/stringFunctions')

suite('functional: HashAlgorithm enum', () => {
  const specVersions = new Set([
    Version.v1dot7,
    Version.v1dot6,
    Version.v1dot4,
    Version.v1dot3,
    Version.v1dot2,
  ])

  specVersions.forEach(specVersion =>
    suite(`from spec ${specVersion}`, () => {
      const knownValues = getSpecEnum(
        CDX_JSON_SCHEMA[specVersion],
        'hash-alg')
      knownValues.forEach(enumValue => {
        const expectedName = capitaliseFirstLetter(enumValue)
        test(`is known: ${expectedName} -> ${enumValue}`, () =>
          assert.strictEqual(HashAlgorithm[expectedName], enumValue)
        )
        test(`is supported: ${enumValue}`, () =>
          assert.strictEqual(SpecVersionDict[specVersion]?.supportsHashAlgorithm(enumValue), true)
        )
      })
      const unknownValues = Object.values(HashAlgorithm).filter(enumValue => !knownValues.includes(enumValue))
      unknownValues.forEach(enumValue =>
        test(`not supported: ${enumValue}`, () =>
          assert.strictEqual(SpecVersionDict[specVersion]?.supportsHashAlgorithm(enumValue), false)
        )
      )
    })
  )
})

```

---

### Enums.LicenseAcknowledgement.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/Enums.LicenseAcknowledgement.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Enums: { LicenseAcknowledgement },
  Spec: { Version },
  _Resources: { FILES: { CDX: { JSON_SCHEMA: CDX_JSON_SCHEMA } } }
} = require('../../')
const { getSpecEnum } = require('../_data/specLoader')
const { upperCamelCase } = require('../_helpers/stringFunctions')

suite('functional: LicenseAcknowledgement enum', () => {
  const specVersions = new Set([
    Version.v1dot7,
    Version.v1dot6,
  ])

  specVersions.forEach(specVersion =>
    suite(`from spec ${specVersion}`, () => {
      const knownValues = getSpecEnum(
        CDX_JSON_SCHEMA[specVersion],
        'licenseAcknowledgementEnumeration')
      knownValues.forEach(enumValue => {
        const expectedName = upperCamelCase(enumValue)
        test(`is known: ${expectedName} -> ${enumValue}`, () =>
          assert.strictEqual(LicenseAcknowledgement[expectedName], enumValue)
        )
        // test(`is supported: ${enumValue}`, () =>
        //  assert.strictEqual(SpecVersionDict[specVersion]?.supportsLicenseAcknowledgement(enumValue), true)
        // )
      })
      // const unknownValues = Object.values(LicenseAcknowledgement).filter(enumValue => !knownValues.includes(enumValue))
      // unknownValues.forEach(enumValue =>
      //  test(`not supported: ${enumValue}`, () =>
      //    assert.strictEqual(SpecVersionDict[specVersion]?.supportsLicenseAcknowledgement(enumValue), false)
      //  )
      // )
    })
  )
})

```

---

### Enums.LifecyclePhase.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/Enums.LifecyclePhase.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Enums: { LifecyclePhase },
  Spec: { Version },
  _Resources: { FILES: { CDX: { JSON_SCHEMA: CDX_JSON_SCHEMA } } }
} = require('../../')
const { getSpecEnum } = require('../_data/specLoader')
const { upperCamelCase } = require('../_helpers/stringFunctions')

suite('functional: LifecyclePhase enum', () => {
  const specVersions = new Set([
    Version.v1dot7,
    Version.v1dot6,
    Version.v1dot5,
  ])

  specVersions.forEach(specVersion =>
    suite(`from spec ${specVersion}`, () => {
      const knownValues = getSpecEnum(
        CDX_JSON_SCHEMA[specVersion],
        'metadata', 'properties', 'lifecycles', 'items', 'oneOf', 0, 'properties', 'phase')
      knownValues.forEach(enumValue => {
        const expectedName = upperCamelCase(enumValue)
        test(`is known: ${expectedName} -> ${enumValue}`, () =>
          assert.strictEqual(LifecyclePhase[expectedName], enumValue)
        )
        // test(`is supported: ${enumValue}`, () =>
        //  assert.strictEqual(SpecVersionDict[specVersion]?.supportsLifecyclePhase(enumValue), true)
        // )
      })
      // const unknownValues = Object.values(LifecyclePhase).filter(enumValue => !knownValues.includes(enumValue))
      // unknownValues.forEach(enumValue =>
      //  test(`not supported: ${enumValue}`, () =>
      //    assert.strictEqual(SpecVersionDict[specVersion]?.supportsLifecyclePhase(enumValue), false)
      //  )
      // )
    })
  )
})

```

---

### Enums.Vulnerability.AffectStatus.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/Enums.Vulnerability.AffectStatus.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Enums: { Vulnerability: { AffectStatus } },
  Spec: { Version },
  _Resources: { FILES: { CDX: { JSON_SCHEMA: CDX_JSON_SCHEMA } } }
} = require('../../')
const { getSpecEnum } = require('../_data/specLoader')
const { upperCamelCase } = require('../_helpers/stringFunctions')

suite('functional: Vulnerability.AffectStatus enum', () => {
  const specVersions = new Set([
    Version.v1dot7,
    Version.v1dot6,
    Version.v1dot5,
    Version.v1dot4,
  ])

  specVersions.forEach(specVersion =>
    suite(`from spec ${specVersion}`, () => {
      const specValues = getSpecEnum(CDX_JSON_SCHEMA[specVersion], 'affectedStatus')
      specValues.forEach(enumValue => {
        const expectedName = upperCamelCase(enumValue)
        test(`is known: ${expectedName} -> ${enumValue}`, () =>
          assert.strictEqual(AffectStatus[expectedName], enumValue)
        )
      })
    })
  )
})

```

---

### Enums.Vulnerability.AnalysisJustification.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/Enums.Vulnerability.AnalysisJustification.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Enums: { Vulnerability: { AnalysisJustification } },
  Spec: { Version },
  _Resources: { FILES: { CDX: { JSON_SCHEMA: CDX_JSON_SCHEMA } } }
} = require('../../')
const { getSpecEnum } = require('../_data/specLoader')
const { upperCamelCase } = require('../_helpers/stringFunctions')

suite('functional: Vulnerability.AnalysisJustification enum', () => {
  const specVersions = new Set([
    Version.v1dot7,
    Version.v1dot6,
    Version.v1dot5,
    Version.v1dot4,
  ])

  specVersions.forEach(specVersion =>
    suite(`from spec ${specVersion}`, () => {
      const specValues = getSpecEnum(CDX_JSON_SCHEMA[specVersion], 'impactAnalysisJustification')
      specValues.forEach(enumValue => {
        const expectedName = upperCamelCase(enumValue)
        test(`is known: ${expectedName} -> ${enumValue}`, () =>
          assert.strictEqual(AnalysisJustification[expectedName], enumValue)
        )
      })
    })
  )
})

```

---

### Enums.Vulnerability.AnalysisResponse.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/Enums.Vulnerability.AnalysisResponse.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Enums: { Vulnerability: { AnalysisResponse } },
  Spec: { Version },
  _Resources: { FILES: { CDX: { JSON_SCHEMA: CDX_JSON_SCHEMA } } }
} = require('../../')
const { getSpecEnum } = require('../_data/specLoader')
const { upperCamelCase } = require('../_helpers/stringFunctions')

suite('functional: Vulnerability.AnalysisResponse enum', () => {
  const specVersions = new Set([
    Version.v1dot7,
    Version.v1dot6,
    Version.v1dot5,
    Version.v1dot4,
  ])

  specVersions.forEach(specVersion =>
    suite(`from spec ${specVersion}`, () => {
      const specValues = getSpecEnum(
        CDX_JSON_SCHEMA[specVersion],
        'vulnerability', 'properties', 'analysis', 'properties', 'response', 'items')
      specValues.forEach(enumValue => {
        const expectedName = upperCamelCase(enumValue)
        test(`is known: ${expectedName} -> ${enumValue}`, () =>
          assert.strictEqual(AnalysisResponse[expectedName], enumValue)
        )
      })
    })
  )
})

```

---

### Enums.Vulnerability.AnalysisState.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/Enums.Vulnerability.AnalysisState.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Enums: { Vulnerability: { AnalysisState } },
  Spec: { Version },
  _Resources: { FILES: { CDX: { JSON_SCHEMA: CDX_JSON_SCHEMA } } }
} = require('../../')
const { getSpecEnum } = require('../_data/specLoader')
const { upperCamelCase } = require('../_helpers/stringFunctions')

suite('functional: Vulnerability.AnalysisState enum', () => {
  const specVersions = new Set([
    Version.v1dot7,
    Version.v1dot6,
    Version.v1dot5,
    Version.v1dot4,
  ])

  specVersions.forEach(specVersion =>
    suite(`from spec ${specVersion}`, () => {
      const specValues = getSpecEnum(CDX_JSON_SCHEMA[specVersion], 'impactAnalysisState')
      specValues.forEach(enumValue => {
        const expectedName = upperCamelCase(enumValue)
        test(`is known: ${expectedName} -> ${enumValue}`, () =>
          assert.strictEqual(AnalysisState[expectedName], enumValue)
        )
      })
    })
  )
})

```

---

### Enums.Vulnerability.RatingMethod.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/Enums.Vulnerability.RatingMethod.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Enums: { Vulnerability: { RatingMethod } },
  Spec: { Version, SpecVersionDict },
  _Resources: { FILES: { CDX: { JSON_SCHEMA: CDX_JSON_SCHEMA } } }
} = require('../../')
const { getSpecEnum } = require('../_data/specLoader')
const { upperCamelCase } = require('../_helpers/stringFunctions')

suite('functional: Vulnerability.RatingMethod enum', () => {
  const specVersions = new Set([
    Version.v1dot7,
    Version.v1dot6,
    Version.v1dot5,
    Version.v1dot4,
  ])

  specVersions.forEach(specVersion =>
    suite(`from spec ${specVersion}`, () => {
      const knownValues = getSpecEnum(CDX_JSON_SCHEMA[specVersion], 'scoreMethod')
      knownValues.forEach(enumValue => {
        const expectedName = upperCamelCase(enumValue)
        test(`is known: ${expectedName} -> ${enumValue}`, () =>
          assert.strictEqual(RatingMethod[expectedName], enumValue)
        )
        test(`is supported: ${enumValue}`, () =>
          assert.strictEqual(SpecVersionDict[specVersion]?.supportsVulnerabilityRatingMethod(enumValue), true)
        )
      })
      const unknownValues = Object.values(RatingMethod).filter(enumValue => !knownValues.includes(enumValue))
      unknownValues.forEach(enumValue =>
        test(`not supported: ${enumValue}`, () =>
          assert.strictEqual(SpecVersionDict[specVersion]?.supportsVulnerabilityRatingMethod(enumValue), false)
        )
      )
    })
  )
})

```

---

### Enums.Vulnerability.Severity.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/Enums.Vulnerability.Severity.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Enums: { Vulnerability: { Severity } },
  Spec: { Version },
  _Resources: { FILES: { CDX: { JSON_SCHEMA: CDX_JSON_SCHEMA } } }
} = require('../../')
const { getSpecEnum } = require('../_data/specLoader')
const { upperCamelCase } = require('../_helpers/stringFunctions')

suite('functional: Vulnerability.Severity enum', () => {
  const specVersions = new Set([
    Version.v1dot7,
    Version.v1dot6,
    Version.v1dot5,
    Version.v1dot4,
  ])

  specVersions.forEach(specVersion =>
    suite(`from spec ${specVersion}`, () => {
      const specValues = getSpecEnum(CDX_JSON_SCHEMA[specVersion], 'severity')
      specValues.forEach(enumValue => {
        const expectedName = upperCamelCase(enumValue)
        test(`is known: ${expectedName} -> ${enumValue}`, () =>
          assert.strictEqual(Severity[expectedName], enumValue)
        )
      })
    })
  )
})

```

---

### Resources.node.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/Resources.node.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')
const fs = require('node:fs')

const { suite, test } = require('mocha')

const {
  _Resources: Resources,
  Spec: { Version }
} = require('../../')

suite('functional: Resources', () => {
  suite('expected dirs', () => {
    [
      Resources.ROOT
    ].forEach(expectedDir =>
      test(`${expectedDir}`, () =>
        assert.ok(fs.lstatSync(expectedDir).isDirectory())
      )
    )
  })

  suite('expected files', () => {
    [
      Resources.FILES.CDX.JSON_SCHEMA[Version.v1dot2],
      Resources.FILES.CDX.JSON_SCHEMA[Version.v1dot3],
      Resources.FILES.CDX.JSON_SCHEMA[Version.v1dot4],
      Resources.FILES.CDX.JSON_SCHEMA[Version.v1dot5],
      Resources.FILES.CDX.JSON_SCHEMA[Version.v1dot6],
      Resources.FILES.CDX.JSON_SCHEMA[Version.v1dot7],
      Resources.FILES.CDX.JSON_STRICT_SCHEMA[Version.v1dot2],
      Resources.FILES.CDX.JSON_STRICT_SCHEMA[Version.v1dot3],
      Resources.FILES.CDX.XML_SCHEMA[Version.v1dot0],
      Resources.FILES.CDX.XML_SCHEMA[Version.v1dot1],
      Resources.FILES.CDX.XML_SCHEMA[Version.v1dot2],
      Resources.FILES.CDX.XML_SCHEMA[Version.v1dot3],
      Resources.FILES.CDX.XML_SCHEMA[Version.v1dot4],
      Resources.FILES.CDX.XML_SCHEMA[Version.v1dot5],
      Resources.FILES.CDX.XML_SCHEMA[Version.v1dot6],
      Resources.FILES.CDX.XML_SCHEMA[Version.v1dot7],
      Resources.FILES.SPDX.JSON_SCHEMA,
      Resources.FILES.SPDX.XML_SCHEMA,
      Resources.FILES.JSF.JSON_SCHEMA
    ].forEach(expectedFile =>
      test(`${expectedFile}`, () =>
        assert.ok(fs.lstatSync(expectedFile).isFile())
      )
    )
  })
})

```

---

### SPDX.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/SPDX.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const { SPDX } = require('../../')
const { spdxSpecEnum } = require('../_data/spdx')

suite('functional: SPDX.isSupportedSpdxId()', () => {
  /** @type {string[]} knownSpdxIds */
  const knownSpdxIds = Object.freeze([
    ...spdxSpecEnum
  ])

  suite('knows', () => {
    knownSpdxIds.forEach(value =>
      test(`${value}`, () =>
        assert.strictEqual(SPDX.isSupportedSpdxId(value), true)
      )
    )
  })
})

suite('functional: SPDX.fixupSpdxId()', () => {
  const expectedFixed = new Map([
    ...spdxSpecEnum.map(v => [v, v]),
    ...spdxSpecEnum.map(v => [v.toLowerCase(), v]),
    ...spdxSpecEnum.map(v => [v.toUpperCase(), v])
  ])

  suite('transform', () => {
    expectedFixed.forEach((expected, value) =>
      test(`${value} -> ${expected}`, () =>
        assert.strictEqual(SPDX.fixupSpdxId(value), expected)
      )
    )
  })
})

```

---

### Spec.SpecVersionDict.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/Spec.SpecVersionDict.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Spec: { SpecVersionDict, Version }
} = require('../../')

suite('functional: Spec.SpecVersionDict', () => {
  Object.entries(SpecVersionDict).forEach(([key, spec]) =>
    suite(`key: ${key}`, () => {
      test('key is well-known version', () =>
        assert.strictEqual(Object.values(Version).includes(key), true)
      )
      test('spec version equals key', () =>
        assert.strictEqual(spec.version, key)
      )
    })
  )
})

```

---

### Validation.JsonValidator.node.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/Validation.JsonValidator.node.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')

const { globSync } = require('fast-glob')
const { before, suite, test } = require('mocha')

const {
  Validation: { JsonValidator, JsonStrictValidator },
  Spec: { Version }
} = require('../../')

before(function () {
  const { default: jsonValidator } = require('../../dist.node/_optPlug.node/jsonValidator')
  if (jsonValidator.fails) {
    this.skip()
  }
})

suite('functional: Validation.JsonValidator functional', function () {
  this.timeout(60000);

  [
    Version.v1dot7,
    Version.v1dot6,
    Version.v1dot5,
    Version.v1dot4,
    Version.v1dot3,
    Version.v1dot2
  ].forEach(version => {
    suite(version, () => {
      const validator = new JsonValidator(version)

      for (const file of globSync(path.resolve(__dirname, '..', '_data', 'schemaTestData', version, 'valid-*.json'))) {
        test(path.basename(file, '.json'), async () => {
          const error = await validator.validate(fs.readFileSync(file))
          assert.strictEqual(error, null)
        })
      }

      for (const file of globSync(path.resolve(__dirname, '..', '_data', 'schemaTestData', version, 'invalid-*.json'))) {
        test(path.basename(file, '.json'), async () => {
          const error = await validator.validate(fs.readFileSync(file))
          assert.notEqual(error, null)
        })
      }
    })
  })
})

suite('functional: Validation.JsonStrictValidator functional', function () {
  this.timeout(60000);

  [
    Version.v1dot7,
    Version.v1dot6,
    Version.v1dot5,
    Version.v1dot4,
    Version.v1dot3,
    Version.v1dot2
  ].forEach(version => {
    suite(version, () => {
      const validator = new JsonStrictValidator(version)

      for (const file of globSync(path.resolve(__dirname, '..', '_data', 'schemaTestData', version, 'valid-*.json'))) {
        test(path.basename(file, '.json'), async () => {
          const error = await validator.validate(fs.readFileSync(file))
          assert.strictEqual(error, null)
        })
      }

      for (const file of globSync(path.resolve(__dirname, '..', '_data', 'schemaTestData', version, 'invalid-*.json'))) {
        test(path.basename(file, '.json'), async () => {
          const error = await validator.validate(fs.readFileSync(file))
          assert.notEqual(error, null)
        })
      }
    })
  })
})

```

---

### Validation.XmlValidator.node.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/Validation.XmlValidator.node.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')

const { globSync } = require('fast-glob')
const { before, suite, test } = require('mocha')

const {
  Validation: { XmlValidator },
  Spec: { Version }
} = require('../../')

before(function () {
  const { default: xmlValidator } = require('../../dist.node/_optPlug.node/xmlValidator')
  if (xmlValidator.fails) {
    this.skip()
  }
})

suite('functional: Validation.XmlValidator functional', function () {
  this.timeout(60000);

  [
    Version.v1dot7,
    Version.v1dot6,
    Version.v1dot5,
    Version.v1dot4,
    Version.v1dot3,
    Version.v1dot2,
    Version.v1dot1,
    Version.v1dot0
  ].forEach(version => {
    suite(version, () => {
      const validator = new XmlValidator(version)

      for (const file of globSync(path.resolve(__dirname, '..', '_data', 'schemaTestData', version, 'valid-*.xml'))) {
        test(path.basename(file, '.xml'), async () => {
          const error = await validator.validate(fs.readFileSync(file))
          assert.strictEqual(error, null)
        })
      }

      for (const file of globSync(path.resolve(__dirname, '..', '_data', 'schemaTestData', version, 'invalid-*.xml'))) {
        test(path.basename(file, '.xml'), async () => {
          const error = await validator.validate(fs.readFileSync(file))
          assert.notEqual(error, null)
        })
      }
    })
  })
})

```

---

### helpers.sortable.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/helpers.sortable.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const { SortableComparables, SortableNumbers, SortableStringables } = require('../../dist.node/_helpers/sortable')

suite('functional: helpers.sortable', () => {
  suite('SortableStringables', () => {
    test('sorted()', () => {
      const obj = { toString: () => 'bar' }
      const sortable = new SortableStringables(['foo', obj, 'fo', 'fo'])
      const expected = [obj, 'fo', 'foo']

      const actual = sortable.sorted()
      assert.deepStrictEqual(actual, expected)
    })

    suite('compare()', () => {
      [
        [['foo'], [], 1],
        [[], ['foo'], -1]
      ].forEach(([sortedA, sortedB, expected]) => {
        test('different length', () => {
          const sortableA = new SortableStringables()
          sortableA.sorted = () => sortedA
          const sortableB = new SortableStringables()
          sortableB.sorted = () => sortedB

          const actual = sortableA.compare(sortableB)
          assert.deepStrictEqual(actual, expected)
        })
      })

      test('same length, different content', () => {
        const sortableA = new SortableStringables()
        sortableA.sorted = () => ['foo']
        const sortableB = new SortableStringables()
        sortableB.sorted = () => ['bar']

        const actual = sortableA.compare(sortableB)
        assert.deepStrictEqual(actual, 1)
      })

      test('same length, same content', () => {
        const sortableA = new SortableStringables()
        sortableA.sorted = () => ['foo']
        const sortableB = new SortableStringables()
        sortableB.sorted = () => ['foo']

        const actual = sortableA.compare(sortableB)
        assert.deepStrictEqual(actual, 0)
      })
    })
  })

  suite('SortableNumbers', () => {
    test('sorted()', () => {
      const sortable = new SortableNumbers([1, 7, 3, 42, 23, 3, -1337])
      const expected = [-1337, 1, 3, 7, 23, 42]

      const actual = sortable.sorted()
      assert.deepStrictEqual(actual, expected)
    })

    suite('compare()', () => {
      [
        [[1], [], 1],
        [[], [1], -1]
      ].forEach(([sortedA, sortedB, expected]) => {
        test('different length', () => {
          const sortableA = new SortableNumbers()
          sortableA.sorted = () => sortedA
          const sortableB = new SortableNumbers()
          sortableB.sorted = () => sortedB

          const actual = sortableA.compare(sortableB)
          assert.deepStrictEqual(actual, expected)
        })
      })

      test('same length, different content', () => {
        const sortableA = new SortableNumbers()
        sortableA.sorted = () => [23]
        const sortableB = new SortableNumbers()
        sortableB.sorted = () => [0]

        const actual = sortableA.compare(sortableB)
        assert.deepStrictEqual(actual, 23)
      })

      test('same length, same content', () => {
        const sortableA = new SortableNumbers()
        sortableA.sorted = () => [23]
        const sortableB = new SortableNumbers()
        sortableB.sorted = () => [23]

        const actual = sortableA.compare(sortableB)
        assert.deepStrictEqual(actual, 0)
      })
    })
  })

  suite('SortableComparables', () => {
    test('sorted()', () => {
      const left = { compare: () => -1, tag: 'left' }
      const stay = { compare: () => +0, tag: 'stay' }
      const right = { compare: () => +1, tag: 'right' }
      const sortable = new SortableComparables([right, left, stay, stay])
      const expected = [left, right, stay]

      const actual = sortable.sorted()
      assert.deepStrictEqual(actual, expected)
    })

    suite('compare()', () => {
      [
        [[{ compare: () => 0 }], [], 1],
        [[], [{ compare: () => 0 }], -1]
      ].forEach(([sortedA, sortedB, expected]) => {
        test('different length', () => {
          const sortableA = new SortableComparables()
          sortableA.sorted = () => sortedA
          const sortableB = new SortableComparables()
          sortableB.sorted = () => sortedB

          const actual = sortableA.compare(sortableB)
          assert.deepStrictEqual(actual, expected)
        })
      })

      test('same length, different content', () => {
        const sortableA = new SortableComparables()
        sortableA.sorted = () => [{ compare: () => 23 }]
        const sortableB = new SortableComparables()
        sortableB.sorted = () => [{ compare: () => 23 }]

        const actual = sortableA.compare(sortableB)
        assert.deepStrictEqual(actual, 23)
      })

      test('same length, same content', () => {
        const sortableA = new SortableComparables()
        sortableA.sorted = () => [{ compare: () => 0 }]
        const sortableB = new SortableComparables()
        sortableB.sorted = () => [{ compare: () => 0 }]

        const actual = sortableA.compare(sortableB)
        assert.deepStrictEqual(actual, 0)
      })
    })
  })
})

```

---

### OpPlug.node.jsonValidator.implementation.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/internals/OpPlug.node.jsonValidator.implementation.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { before, suite, test } = require('mocha')

const {
  _Resources: Resources,
  Spec: { Version }
} = require('../../../')

suite('functional: internals: OpPlug.node.jsonValidator implementation', () => {
  for (const impl of ['ajv']) {
    suite(impl, () => {
      let makeValidator
      try {
        makeValidator = require(`../../../dist.node/_optPlug.node/__jsonValidators/${impl}`).default
      } catch {
        makeValidator = undefined
      }

      before(function () {
        if (typeof makeValidator !== 'function') {
          this.skip()
        }
      })

      const schemaPath = Resources.FILES.CDX.JSON_SCHEMA[Version.v1dot7]
      const schemaMap = {
        'http://cyclonedx.org/schema/spdx.SNAPSHOT.schema.json': Resources.FILES.SPDX.JSON_SCHEMA,
        'http://cyclonedx.org/schema/cryptography-defs.SNAPSHOT.schema.json': Resources.FILES.CryptoDefs.JSON_SCHEMA,
        'http://cyclonedx.org/schema/jsf-0.82.SNAPSHOT.schema.json': Resources.FILES.JSF.JSON_SCHEMA
      }
      const validJson = '{"bomFormat": "CycloneDX", "specVersion": "1.7"}'
      const invalidJson = '{"bomFormat": "unexpected", "specVersion": "1.7"}'
      const brokenJson = '{"bomFormat": "CycloneDX", "specVersion": "1.7"' // not closed

      test('valid causes no validationError', async () => {
        const validationError = (await makeValidator(schemaPath, schemaMap))(validJson)
        assert.strictEqual(validationError, null)
      })

      test('invalid causes validationError', async () => {
        const validationError = (await makeValidator(schemaPath, schemaMap))(invalidJson)
        assert.notEqual(validationError, null)
      })

      test('broken causes validationError', async () => {
        const validator = await makeValidator(schemaPath, schemaMap)
        assert.throws(() => { validator(brokenJson) })
      })
    })
  }
})

```

---

### OpPlug.node.jsonValidator.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/internals/OpPlug.node.jsonValidator.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  _Resources: Resources,
  Spec: { Version }
} = require('../../../')
const { OptPlugError } = require('../../../dist.node/_optPlug.node/errors')
const { default: makeValidator } = require('../../../dist.node/_optPlug.node/jsonValidator')

suite('functional: internals: OpPlug.node.jsonValidator auto', () => {
  if (makeValidator.fails) {
    test('call should fail/throw', () => {
      assert.throws(
        () => { makeValidator() },
        (err) => {
          assert.ok(err instanceof OptPlugError)
          assert.match(err.message, /no JsonValidator available/i)
          return true
        }
      )
    })
    return
  }

  const schemaPath = Resources.FILES.CDX.JSON_SCHEMA[Version.v1dot7]
  const schemaMap = {
    'http://cyclonedx.org/schema/spdx.SNAPSHOT.schema.json': Resources.FILES.SPDX.JSON_SCHEMA,
    'http://cyclonedx.org/schema/cryptography-defs.SNAPSHOT.schema.json': Resources.FILES.CryptoDefs.JSON_SCHEMA,
    'http://cyclonedx.org/schema/jsf-0.82.SNAPSHOT.schema.json': Resources.FILES.JSF.JSON_SCHEMA
  }
  const validJson = '{"bomFormat": "CycloneDX", "specVersion": "1.7"}'
  const invalidJson = '{"bomFormat": "unexpected", "specVersion": "1.7"}'
  const brokenJson = '{"bomFormat": "CycloneDX", "specVersion": "1.7"' // not closed

  test('valid causes no validationError', async () => {
    const validationError = (await makeValidator(schemaPath, schemaMap))(validJson)
    assert.strictEqual(validationError, null)
  })

  test('invalid causes validationError', async () => {
    const validationError = (await makeValidator(schemaPath, schemaMap))(invalidJson)
    assert.notEqual(validationError, null)
  })

  test('broken causes validationError', async () => {
    const validator = await makeValidator(schemaPath, schemaMap)
    assert.throws(() => { validator(brokenJson) })
  })
})

```

---

### OpPlug.node.xmlStringify.implementation.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/internals/OpPlug.node.xmlStringify.implementation.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { before, suite, test } = require('mocha')

suite('functional: internals: OpPlug.node.xmlStringify implementation', () => {
  for (const impl of ['xmlbuilder2']) {
    suite(impl, () => {
      let xmlStringify
      try {
        xmlStringify = require(`../../../dist.node/_optPlug.node/__xmlStringifiers/${impl}`).default
      } catch {
        xmlStringify = undefined
      }

      before(function () {
        if (typeof xmlStringify !== 'function') {
          this.skip()
        }
      })

      const data = {
        type: 'element',
        name: 'some-children',
        children: [
          {
            type: 'element',
            name: 'some-attributes',
            attributes: {
              string: 'some-value',
              number: 1,
              'quote-encode': 'foo " bar'
            }
          },
          {
            type: 'element',
            name: 'some-text',
            children: 'testing... \n' +
            'amp-encode? & \n' +
            'tag-encode? <b>foo<b> \n'
          },
          {
            type: 'element',
            namespace: 'https://example.com/ns1',
            name: 'some-namespaced',
            children: [
              {
                type: 'element',
                name: 'empty'
              }
            ]
          },
          {
            type: 'not-an-element',
            namespace: 'https://example.com/ns1',
            name: 'not-element',
            children: 'omit this thing, it is not an element.'
          }
        ]
      }

      test('data w/o spacing', () => {
        const stringified = xmlStringify(data)
        assert.strictEqual(stringified,
          '<?xml version="1.0" encoding="UTF-8"?>' +
          '<some-children>' +
          '<some-attributes string="some-value" number="1" quote-encode="foo &quot; bar"/>' +
          '<some-text>testing... \n' +
          'amp-encode? &amp; \n' +
          'tag-encode? &lt;b&gt;foo&lt;b&gt; \n' +
          '</some-text>' +
          '<some-namespaced xmlns="https://example.com/ns1">' +
          '<empty/>' +
          '</some-namespaced>' +
          '</some-children>'
        )
      })

      test('data with space=4', () => {
        const stringified = xmlStringify(data, { space: 4 })
        assert.strictEqual(stringified,
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<some-children>\n' +
          '    <some-attributes string="some-value" number="1" quote-encode="foo &quot; bar"/>\n' +
          '    <some-text>testing... \n' +
          'amp-encode? &amp; \n' +
          'tag-encode? &lt;b&gt;foo&lt;b&gt; \n' +
          '</some-text>\n' +
          '    <some-namespaced xmlns="https://example.com/ns1">\n' +
          '        <empty/>\n' +
          '    </some-namespaced>\n' +
          '</some-children>'
        )
      })

      test('data with space=TAB', () => {
        const stringified = xmlStringify(data, { space: '\t' })
        assert.strictEqual(stringified,
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<some-children>\n' +
          '\t<some-attributes string="some-value" number="1" quote-encode="foo &quot; bar"/>\n' +
          '\t<some-text>testing... \n' +
          'amp-encode? &amp; \n' +
          'tag-encode? &lt;b&gt;foo&lt;b&gt; \n' +
          '</some-text>\n' +
          '\t<some-namespaced xmlns="https://example.com/ns1">\n' +
          '\t\t<empty/>\n' +
          '\t</some-namespaced>\n' +
          '</some-children>'
        )
      })
    })
  }
})

```

---

### OpPlug.node.xmlStringify.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/internals/OpPlug.node.xmlStringify.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const { OptPlugError } = require('../../../dist.node/_optPlug.node/errors')
const { default: xmlStringify } = require('../../../dist.node/_optPlug.node/xmlStringify')

suite('functional: internals: OpPlug.node.xmlStringify auto', () => {
  if (xmlStringify.fails) {
    test('call should fail/throw', () => {
      assert.throws(
        () => { xmlStringify() },
        (err) => {
          assert.ok(err instanceof OptPlugError)
          assert.match(err.message, /no XmlStringifier available/i)
          return true
        }
      )
    })
    return
  }

  const dummyElem = Object.freeze({
    type: 'element',
    name: 'foo'
  })
  const dummyElemStringifiedRE = /<foo(:?\/>|><\/foo>)/

  test('call should pass', () => {
    const stringified = xmlStringify(dummyElem)
    assert.match(stringified, dummyElemStringifiedRE)
  })
})

```

---

### OpPlug.node.xmlValidator.implementation.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/internals/OpPlug.node.xmlValidator.implementation.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')
const { realpathSync } = require('node:fs')
const { join } = require('node:path')
const { pathToFileURL } = require('node:url')

const { before, suite, test } = require('mocha')

const {
  _Resources: Resources,
  Spec: { Version }
} = require('../../../')

suite('functional: internals: OpPlug.node.xmlValidator implementation', () => {
  for (const impl of ['libxmljs2']) {
    suite(impl, () => {
      let makeValidator
      try {
        makeValidator = require(`../../../dist.node/_optPlug.node/__xmlValidators/${impl}`).default
      } catch {
        makeValidator = undefined
      }

      before(function () {
        if (typeof makeValidator !== 'function') {
          this.skip()
        }
      })

      const schemaPath = Resources.FILES.CDX.XML_SCHEMA[Version.v1dot7]
      const validXML = `<?xml version="1.0" encoding="UTF-8"?>
        <bom xmlns="http://cyclonedx.org/schema/bom/1.7"></bom>`
      const invalidXML = `<?xml version="1.0" encoding="UTF-8"?>
        <bom xmlns="http://cyclonedx.org/schema/bom/1.7"><unexpected/></bom>`
      const brokenXML = `<?xml version="1.0" encoding="UTF-8"?>
        <bom xmlns="http://cyclonedx.org/schema/bom/1.7">` // not closed

      test('valid causes no validationError', async () => {
        const validationError = (await makeValidator(schemaPath))(validXML)
        assert.strictEqual(validationError, null)
      })

      test('invalid causes validationError', async () => {
        const validationError = (await makeValidator(schemaPath))(invalidXML)
        assert.notEqual(validationError, null)
      })

      test('broken causes validationError', async () => {
        const validator = await makeValidator(schemaPath)
        assert.throws(() => { validator(brokenXML) })
      })

      test('is not affected by XXE injection', async () => {
        // see https://github.com/CycloneDX/cyclonedx-javascript-library/issues/1061
        const xxeFile = join(__dirname, '..', '..', '_data', 'xxe_flag.txt')
        const input = `<?xml version="1.0" encoding="UTF-8"?>
          <!DOCTYPE poc [
            <!ENTITY flag SYSTEM "${pathToFileURL(realpathSync(xxeFile))}">
          ]>
          <bom xmlns="http://cyclonedx.org/schema/bom/1.6">
            <components>
              <component type="library">
                <name>bar</name>
                <version>1.337</version>
                <licenses>
                  <license>
                    <id>&flag;</id>
                  </license>
                </licenses>
              </component>
            </components>
          </bom>`
        const validationError = (await makeValidator(schemaPath))(input)
        assert.doesNotMatch(
          JSON.stringify(validationError),
          /vaiquia2zoo3Im8ro9zahNg5mohwipouka2xieweed6ahChei3doox2fek3ise0lmohju3loh5oDu7eigh3jaeR2aiph2Voo/,
          'must not leak secrets')
      })
    })
  }
})

```

---

### OpPlug.node.xmlValidator.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/internals/OpPlug.node.xmlValidator.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  _Resources: Resources,
  Spec: { Version }
} = require('../../../')
const { OptPlugError } = require('../../../dist.node/_optPlug.node/errors')
const { default: makeValidator } = require('../../../dist.node/_optPlug.node/xmlValidator')

suite('functional: internals: OpPlug.node.xmlValidator auto', () => {
  if (makeValidator.fails) {
    test('call should fail/throw', () => {
      assert.throws(
        () => { makeValidator() },
        (err) => {
          assert.ok(err instanceof OptPlugError)
          assert.match(err.message, /no XmlValidator available/i)
          return true
        }
      )
    })
    return
  }

  const schemaPath = Resources.FILES.CDX.XML_SCHEMA[Version.v1dot7]
  const validXML = `<?xml version="1.0" encoding="UTF-8"?>
    <bom xmlns="http://cyclonedx.org/schema/bom/1.7"></bom>`
  const invalidXML = `<?xml version="1.0" encoding="UTF-8"?>
    <bom xmlns="http://cyclonedx.org/schema/bom/1.7"><unexpected/></bom>`
  const brokenXML = `<?xml version="1.0" encoding="UTF-8"?>
    <bom xmlns="http://cyclonedx.org/schema/bom/1.7">` // not closed

  test('valid causes no validationError', async () => {
    const validationError = (await makeValidator(schemaPath))(validXML)
    assert.strictEqual(validationError, null)
  })

  test('invalid causes validationError', async () => {
    const validationError = (await makeValidator(schemaPath))(invalidXML)
    assert.notEqual(validationError, null)
  })

  test('broken causes validationError', async () => {
    const validator = await makeValidator(schemaPath)
    assert.throws(() => { validator(brokenXML) })
  })
})

```

---

### packageManifestExports.node.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/functional/packageManifestExports.node.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')
const { readFileSync } = require('node:fs')
const { dirname, join } = require('node:path')

const { suite, test } = require('mocha')

const CDX = require('../../')

suite('functional: packageManifest:exports', () => {
  const pjPath = join(__dirname, '..', '..', 'package.json')
  const { exports: pjExports } = JSON.parse(readFileSync(pjPath))

  suite('subpaths', () => {
    /** @type {Set<string>} */
    const pjRelExported = new Set(
      Object.keys(pjExports)
        .filter(e => e.startsWith('./'))
        .map(e => e.substring(2))
    )

    suite('can load defined', () => {
      for (const pjExport of pjRelExported) {
        test(pjExport, () => {
          const resolved = require.resolve(
            `@cyclonedx/cyclonedx-library/${pjExport}`,
            { paths: [dirname(pjPath)] })
          assert.ok(resolved)
        })
      }
    })

    suite('load submodule as expected', () => {
      for (const [cdxModName, cdxMod] of Object.entries(CDX)) {
        if (cdxModName.startsWith('_')) {
          continue // skip internal
        }
        test(cdxModName, () => {
          assert.ok(pjRelExported.has(cdxModName))
          const resolved = require(`@cyclonedx/cyclonedx-library/${cdxModName}`)
          assert.strictEqual(cdxMod, resolved)
        })
      }
    })

    suite('does not export internal sobmodules', () => {
      for (const [cdxModName, cdxMod] of Object.entries(CDX)) {
        if (!cdxModName.startsWith('_')) {
          continue // skip non-internal
        }
        test(cdxModName, () => {
          for (const pjExp of pjRelExported) {
            const resolved = require(`@cyclonedx/cyclonedx-library/${pjExp}`)
            assert.notStrictEqual(cdxMod, resolved, `exported as "${pjExp}"`)
          }
        })
      }
    })
  })
})

```

---

### Contrib.FromNodePackageJson.Builders.ComponentBuilder.node.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/integration/Contrib.FromNodePackageJson.Builders.ComponentBuilder.node.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Contrib,
  Enums,
  Models,
} = require('../../')

suite('integration: Contrib.FromNodePackageJson.Builders.ComponentBuilder', () => {
  const salt = Math.random()

  const extRefFactory = new Contrib.FromNodePackageJson.Factories.ExternalReferenceFactory()
  const licenseFactory = new Contrib.License.Factories.LicenseFactory()

  const sut = new Contrib.FromNodePackageJson.Builders.ComponentBuilder(extRefFactory, licenseFactory);

  [
    [
      'minimal',
      { name: 'foo_bar' },
      new Models.Component(Enums.ComponentType.Library, 'foo_bar')
    ],
    [
      'full',
      {
        name: '@foo/bar',
        version: `1.33.7-alpha.23.${salt}`,
        description: `dummy lib ${salt}`,
        author: {
          name: 'Jane Doe',
          url: 'https://example.com/~jd'
        },
        license: `dummy license ${salt}`,
        licenses: [
          {
            type: `some license ${salt}`,
            url: `https://example.com/license/${salt}`
          }
        ],
        repository: {
          type: 'git',
          url: 'https://github.com/foo/bar.git'
        }
        // to be continued
      },
      new Models.Component(
        Enums.ComponentType.Library,
        'bar',
        {
          author: 'Jane Doe',
          description: `dummy lib ${salt}`,
          externalReferences: new Models.ExternalReferenceRepository([
            new Models.ExternalReference(
              'https://github.com/foo/bar.git',
              Enums.ExternalReferenceType.VCS,
              {
                comment: 'as detected from PackageJson property "repository.url"'
              }
            )
          ]),
          group: '@foo',
          licenses: new Models.LicenseRepository([
            new Models.NamedLicense(`dummy license ${salt}`),
            new Models.NamedLicense(`some license ${salt}`),
          ]),
          version: `1.33.7-alpha.23.${salt}`
        }
      )
    ],
    [
      // Even though https://npmjs.org does not allow it,
      // there is nothing wrong with a package name that contains more than one slash(/).
      // It is completely compliant to NodeJS rules and will be properly resolved.
      'name with slashes',
      { name: '@foo/bar/baz' },
      new Models.Component(
        Enums.ComponentType.Library,
        'bar/baz',
        { group: '@foo' }
      )
    ]
  ].forEach(([purpose, data, expected]) => {
    test(`makeComponent: ${purpose}`, () => {
      const actual = sut.makeComponent(data)
      assert.deepStrictEqual(actual, expected)
    })
  })
})

```

---

### Contrib.FromNodePackageJson.Builders.ToolBuilder.node.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/integration/Contrib.FromNodePackageJson.Builders.ToolBuilder.node.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Contrib,
  Models,
} = require('../../')

suite('integration: Contrib.FromNodePackageJson.Builders.ToolBuilder', () => {
  const salt = Math.random()

  const extRefFactory = new Contrib.FromNodePackageJson.Factories.ExternalReferenceFactory()
  extRefFactory.makeExternalReferences = () => [`FAKE REFERENCES ${salt}`]

  const sut = new Contrib.FromNodePackageJson.Builders.ToolBuilder(extRefFactory)

  const data = {
    name: '@foo/bar',
    version: `1.33.7-alpha.23.${salt}`
    // to be continued
  }
  const expected = new Models.Tool({
    vendor: '@foo',
    name: 'bar',
    version: `1.33.7-alpha.23.${salt}`,
    externalReferences: new Models.ExternalReferenceRepository([`FAKE REFERENCES ${salt}`])
  })

  test('makeTool', () => {
    const actual = sut.makeTool(data)
    assert.deepStrictEqual(actual, expected)
  })
})

```

---

### Contrib.FromNodePackageJson.Factories.ExternalReferenceFactory.node.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/integration/Contrib.FromNodePackageJson.Factories.ExternalReferenceFactory.node.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Enums: { ExternalReferenceType, HashAlgorithm },
  Models: { ExternalReference, HashDictionary },
  Contrib,
} = require('../../')

suite('integration: Contrib.FromNodePackageJson.Factories.ExternalReferenceFactory', () => {
  const sut = new Contrib.FromNodePackageJson.Factories.ExternalReferenceFactory()

  suite('from "homepage"', () => {
    test('is non-empty string', () => {
      const expected = [new ExternalReference(
        'https://example.com',
        ExternalReferenceType.Website,
        { comment: 'as detected from PackageJson property "homepage"' }
      )]
      const data = { homepage: 'https://example.com' }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('is empty string', () => {
      const data = { homepage: '' }
      const actual = sut.makeExternalReferences(data)
      assert.strictEqual(actual.length, 0)
    })
    test('is undefined', () => {
      const data = { homepage: undefined }
      const actual = sut.makeExternalReferences(data)
      assert.strictEqual(actual.length, 0)
    })
  })

  suite('from "bugs"', () => {
    test('is non-empty string', () => {
      const expected = [new ExternalReference(
        'https://example.com',
        ExternalReferenceType.IssueTracker,
        { comment: 'as detected from PackageJson property "bugs"' }
      )]
      const data = { bugs: 'https://example.com' }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('is empty string', () => {
      const data = { bugs: '' }
      const actual = sut.makeExternalReferences(data)
      assert.strictEqual(actual.length, 0)
    })
    test('is undefined', () => {
      const data = { bugs: undefined }
      const actual = sut.makeExternalReferences(data)
      assert.strictEqual(actual.length, 0)
    })
  })
  suite('from "bugs.url"', () => {
    test('is non-empty string', () => {
      const expected = [new ExternalReference(
        'https://example.com',
        ExternalReferenceType.IssueTracker,
        { comment: 'as detected from PackageJson property "bugs.url"' }
      )]
      const data = { bugs: { url: 'https://example.com' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('is empty string', () => {
      const data = { bugs: { url: '' } }
      const actual = sut.makeExternalReferences(data)
      assert.strictEqual(actual.length, 0)
    })
    test('is undefined', () => {
      const data = { bugs: { url: undefined } }
      const actual = sut.makeExternalReferences(data)
      assert.strictEqual(actual.length, 0)
    })
  })

  suite('from "repository"', () => {
    test('non-empty string', () => {
      const expected = [new ExternalReference(
        '../foo/bar',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository"' }
      )]
      const data = { repository: '../foo/bar' }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('implicit-git-url', () => {
      const expected = [new ExternalReference(
        'git+ssh://git@example.com/foo/bar',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository"' }
      )]
      const data = { repository: 'git@example.com:foo/bar' }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('explicit-git-url', () => {
      const expected = [new ExternalReference(
        'git+https://example.com/dings.git',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository"' }
      )]
      const data = { repository: 'git+https://example.com/dings.git' }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('implicit-svn-url', () => {
      const expected = [new ExternalReference(
        'svn://example.com/foo/trunk',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository"' }
      )]
      const data = { repository: 'svn://example.com/foo/trunk' }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('empty string', () => {
      const expected = []
      const data = { repository: '' }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('undefined', () => {
      const expected = []
      const data = { }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
  })
  suite('from "repository.url"', () => {
    test('non-empty string', () => {
      const expected = [new ExternalReference(
        '../foo/bar',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url"' }
      )]
      const data = { repository: { url: '../foo/bar' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('implicit-git-url', () => {
      const expected = [new ExternalReference(
        'git+ssh://git@example.com/foo/bar',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url"' }
      )]
      const data = { repository: { url: 'git@example.com:foo/bar' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('explicit-git-url', () => {
      const expected = [new ExternalReference(
        'git+https://example.com/dings.git',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url"' }
      )]
      const data = { repository: { url: 'git+https://example.com/dings.git' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('implicit-svn-url', () => {
      const expected = [new ExternalReference(
        'svn://example.com/foo/trunk',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url"' }
      )]
      const data = { repository: { url: 'svn://example.com/foo/trunk' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('empty string', () => {
      const expected = []
      const data = { repository: { url: '' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('undefined', () => {
      const expected = []
      const data = { repository: { } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
  })
  suite('from "repository.directory"', () => {
    test('non-empty string', () => {
      const expected = [new ExternalReference(
        '../foo/bar',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url"' }
      )]
      const data = { repository: { url: '../foo/bar', directory: 'some/other#23/dir#42' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('implicit-git-url', () => {
      const expected = [new ExternalReference(
        'git+ssh://git@example.com/foo/bar#some/other%2323/dir%2342',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url" and "repository.directory"' }
      )]
      const data = { repository: { url: 'git@example.com:foo/bar', directory: 'some/other#23/dir#42' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('explicit-git-url', () => {
      const expected = [new ExternalReference(
        'git+https://example.com/dings.git#some/other%2323/dir%2342',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url" and "repository.directory"' }
      )]
      const data = { repository: { url: 'git+https://example.com/dings.git', directory: 'some/other#23/dir#42' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('implicit-svn-url', () => {
      const expected = [new ExternalReference(
        'svn://example.com/foo/trunk#some/other%2323/dir%2342',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url" and "repository.directory"' }
      )]
      const data = { repository: { url: 'svn://example.com/foo/trunk', directory: 'some/other#23/dir#42' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('empty string', () => {
      const expected = [new ExternalReference(
        'http://example.com/foo',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url" and "repository.directory"' }
      )]
      const data = { repository: { url: 'http://example.com/foo', directory: '' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('undefined', () => {
      const expected = [new ExternalReference(
        'http://example.com/foo',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url"' }
      )]
      const data = { repository: { url: 'http://example.com/foo' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
  })

  suite('from "dist"', () => {
    test('with tarball', () => {
      const expected = [new ExternalReference(
        'https://example.com/foo.tgz',
        ExternalReferenceType.Distribution,
        { comment: 'as detected from PackageJson property "dist.tarball"' }
      )]
      const data = { dist: { tarball: 'https://example.com/foo.tgz' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('with tarball and integrity', () => {
      const expected = [new ExternalReference(
        'https://registry.npmjs.org/light-cycle/-/light-cycle-1.4.3.tgz',
        ExternalReferenceType.Distribution,
        {
          hashes: new HashDictionary([[HashAlgorithm['SHA-512'], 'b0572e8afb0367df5f6344dbbee442e820d707caffca569f8c900c9db485d32e0430cd7fd43b50a38d06d962b3d6b05bca2cf848b01cdd66bac99c82e1748639']]),
          comment: 'as detected from PackageJson property "dist.tarball" and property "dist.integrity"'
        }
      )]
      const data = { dist: { tarball: 'https://registry.npmjs.org/light-cycle/-/light-cycle-1.4.3.tgz', integrity: 'sha512-sFcuivsDZ99fY0TbvuRC6CDXB8r/ylafjJAMnbSF0y4EMM1/1DtQo40G2WKz1rBbyiz4SLAc3Wa6yZyC4XSGOQ==' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('with tarball and shasum', () => {
      const expected = [new ExternalReference(
        'https://registry.npmjs.org/light-cycle/-/light-cycle-1.4.3.tgz',
        ExternalReferenceType.Distribution,
        {
          hashes: new HashDictionary([[HashAlgorithm['SHA-1'], 'c305f0113d81d880f846d84f80c7f3237f197bab']]),
          comment: 'as detected from PackageJson property "dist.tarball" and property "dist.shasum"'
        }
      )]
      const data = { dist: { tarball: 'https://registry.npmjs.org/light-cycle/-/light-cycle-1.4.3.tgz', shasum: 'c305f0113d81d880f846d84f80c7f3237f197bab' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('with tarball and integrity and shasum', () => {
      const expected = [new ExternalReference(
        'https://registry.npmjs.org/light-cycle/-/light-cycle-1.4.3.tgz',
        ExternalReferenceType.Distribution,
        {
          hashes: new HashDictionary([[HashAlgorithm['SHA-1'], 'c305f0113d81d880f846d84f80c7f3237f197bab'], [HashAlgorithm['SHA-512'], 'b0572e8afb0367df5f6344dbbee442e820d707caffca569f8c900c9db485d32e0430cd7fd43b50a38d06d962b3d6b05bca2cf848b01cdd66bac99c82e1748639']]),
          comment: 'as detected from PackageJson property "dist.tarball" and property "dist.integrity" and property "dist.shasum"'
        }
      )]
      const data = { dist: { tarball: 'https://registry.npmjs.org/light-cycle/-/light-cycle-1.4.3.tgz', integrity: 'sha512-sFcuivsDZ99fY0TbvuRC6CDXB8r/ylafjJAMnbSF0y4EMM1/1DtQo40G2WKz1rBbyiz4SLAc3Wa6yZyC4XSGOQ==', shasum: 'c305f0113d81d880f846d84f80c7f3237f197bab' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
  })
})

```

---

### Contrib.License.Factories.LicenseFactory.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/integration/Contrib.License.Factories.LicenseFactory.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')
const spdxExpressionValidate = require('spdx-expression-parse')

const {
  Contrib,
  Models: { LicenseExpression, NamedLicense, SpdxLicense }
} = require('../../')

suite('integration: Contrib.License.Factories.LicenseFactory', () => {
  test('makeFromString() -> LicenseExpression', () => {
    const sut = new Contrib.License.Factories.LicenseFactory(
      spdxExpressionValidate
    )
    const expression = '(MIT OR Apache-2.0)'

    const license = sut.makeFromString(expression)

    assert.ok(license instanceof LicenseExpression, license.constructor.name)
    assert.strictEqual(license.expression, expression)
  })

  test('makeFromString() -> NamedLicense', () => {
    const sut = new Contrib.License.Factories.LicenseFactory()

    const license = sut.makeFromString('(c) foo bar')

    assert.ok(license instanceof NamedLicense, license.constructor.name)
    assert.strictEqual(license.name, '(c) foo bar')
    assert.strictEqual(license.text, undefined)
    assert.strictEqual(license.url, undefined)
  })

  test('makeFromString() -> SpdxLicense', () => {
    const sut = new Contrib.License.Factories.LicenseFactory()

    const license = sut.makeFromString('MIT')

    assert.ok(license instanceof SpdxLicense, license.constructor.name)
    assert.strictEqual(license.id, 'MIT')
    assert.strictEqual(license.text, undefined)
    assert.strictEqual(license.url, undefined)
  })
})

```

---

### Contrib.License.Utils.LicenseEvidenceGatherer(.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/integration/Contrib.License.Utils.LicenseEvidenceGatherer(.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')
const { sep } = require('node:path')

const { memfs } = require('memfs')
const { suite, test } = require('mocha')

const {
  Models: { Attachment },
  Enums: { AttachmentEncoding },
  Contrib,
} = require('../../')

suite('integration: Contrib.License.Utils.LicenseEvidenceGatherer(', () => {
  test('no path -> throws', () => {
    const { fs } = memfs({ '/': {} })
    const leg = new Contrib.License.Utils.LicenseEvidenceGatherer({ fs })
    assert.throws(
      () => {
        Array.from(
          leg.getFileAttachments('/foo'))
      },
      {
        code: 'ENOENT',
        message: "ENOENT: no such file or directory, scandir '/foo'",
        path: '/foo',
      }
    )
  })

  test('no files', () => {
    const { fs } = memfs({ '/': {} })
    const leg = new Contrib.License.Utils.LicenseEvidenceGatherer({ fs })
    const errors = []
    const found = Array.from(
      leg.getFileAttachments(
        '/',
        (e) => { errors.push(e) }
      ))
    assert.deepEqual(found, [])
    assert.deepEqual(errors, [])
  })

  test('ignore LICENSE folder', () => {
    const { fs } = memfs({
      LICENSE: {
        'MIT.txt': 'MIT License text here...',
        'GPL-3.0-or-later.txt': 'GPL-3.0-or-later License text here...'
      }
    })
    const leg = new Contrib.License.Utils.LicenseEvidenceGatherer({ fs })
    const found = Array.from(
      leg.getFileAttachments('/'))
    assert.deepEqual(found, [])
  })

  test('ignore LICENSES folder', () => {
    // see https://reuse-standard.org/
    const { fs } = memfs({
      LICENSES: {
        'MIT.txt': 'MIT License text here...',
        'GPL-3.0-or-later.txt': 'GPL-3.0-or-later License text here...'
      }
    })
    const leg = new Contrib.License.Utils.LicenseEvidenceGatherer({ fs })
    const found = Array.from(
      leg.getFileAttachments('/'))
    assert.deepEqual(found, [])
  })

  test('reports unreadable files', () => {
    // see https://reuse-standard.org/
    const { fs } = memfs({ '/LICENSE': 'license text here...' })
    const expectedError = new Error(
      `skipped license file ${sep}LICENSE`,
      { cause: new Error('Custom read error: Access denied!') })
    fs.readFileSync = function () { throw expectedError.cause }
    const leg = new Contrib.License.Utils.LicenseEvidenceGatherer({ fs })
    const errors = []
    const found = Array.from(
      leg.getFileAttachments(
        '/',
        (e) => { errors.push(e) }
      ))
    assert.deepEqual(found, [])
    assert.deepEqual(errors, [expectedError])
  })

  const mockedLicenses = Object.freeze({
    LICENSE: 'LICENSE file expected',
    LICENCE: 'LICENCE file expected',
    UNLICENSE: 'UNLICENSE file expected',
    NOTICE: 'NOTICE file expected',
    '---some-.licenses-below': 'unexpected file',
    'MIT.license': 'MIT.license file expected',
    'MIT.licence': 'MIT.licence file expected',
    '---some-licenses.-below': 'unexpected file',
    'license.mit': 'license.mit file expected',
    'license.txt': 'license.txt file expected',
    'license.js': 'license.js file unexpected',
    'license.foo': 'license.foo file unexpected',
  })

  /* eslint-disable jsdoc/valid-types -- eslint/jsdoc does not jet known import syntax */
  /**
   * @param {import('../../').Utils.LicenseUtility.FileAttachment} a
   * @param {import('../../').Utils.LicenseUtility.FileAttachment} b
   * @return {number}
   */
  function orderByFilePath (a, b) {
    return a.filePath.localeCompare(b.filePath)
  }
  /* eslint-enable jsdoc/valid-types */

  test('finds licenses as expected', () => {
    const { fs } = memfs({ '/': mockedLicenses })
    const leg = new Contrib.License.Utils.LicenseEvidenceGatherer({ fs })
    const errors = []
    const found = Array.from(
      leg.getFileAttachments(
        '/',
        (e) => { errors.push(e) }
      ))
    assert.deepEqual(found.sort(orderByFilePath), [
      {
        filePath: `${sep}LICENSE`,
        file: 'LICENSE',
        text: new Attachment(
          'TElDRU5TRSBmaWxlIGV4cGVjdGVk', {
            contentType: 'text/plain',
            encoding: AttachmentEncoding.Base64
          })
      },
      {
        filePath: `${sep}LICENCE`,
        file: 'LICENCE',
        text: new Attachment(
          'TElDRU5DRSBmaWxlIGV4cGVjdGVk', {
            contentType: 'text/plain',
            encoding: AttachmentEncoding.Base64
          })
      },
      {
        filePath: `${sep}UNLICENSE`,
        file: 'UNLICENSE',
        text: new Attachment(
          'VU5MSUNFTlNFIGZpbGUgZXhwZWN0ZWQ=', {
            contentType: 'text/plain',
            encoding: AttachmentEncoding.Base64
          })
      },
      {
        filePath: `${sep}NOTICE`,
        file: 'NOTICE',
        text: new Attachment(
          'Tk9USUNFIGZpbGUgZXhwZWN0ZWQ=', {
            contentType: 'text/plain',
            encoding: AttachmentEncoding.Base64
          })
      },
      {
        filePath: `${sep}MIT.license`,
        file: 'MIT.license',
        text: new Attachment(
          'TUlULmxpY2Vuc2UgZmlsZSBleHBlY3RlZA==', {
            contentType: 'text/plain',
            encoding: AttachmentEncoding.Base64
          })
      },
      {
        filePath: `${sep}MIT.licence`,
        file: 'MIT.licence',
        text: new Attachment(
          'TUlULmxpY2VuY2UgZmlsZSBleHBlY3RlZA==', {
            contentType: 'text/plain',
            encoding: AttachmentEncoding.Base64
          })
      },
      {
        filePath: `${sep}license.mit`,
        file: 'license.mit',
        text: new Attachment(
          'bGljZW5zZS5taXQgZmlsZSBleHBlY3RlZA==', {
            contentType: 'text/plain',
            encoding: AttachmentEncoding.Base64
          })
      },
      {
        filePath: `${sep}license.txt`,
        file: 'license.txt',
        text: new Attachment(
          'bGljZW5zZS50eHQgZmlsZSBleHBlY3RlZA==', {
            contentType: 'text/plain',
            encoding: AttachmentEncoding.Base64
          })
      }
    ].sort(orderByFilePath))
    assert.deepEqual(errors, [])
  })

  test('does not find licenses in subfolder', () => {
    const { fs } = memfs({ '/foo': mockedLicenses })
    const leg = new Contrib.License.Utils.LicenseEvidenceGatherer({ fs })
    const found = Array.from(
      leg.getFileAttachments('/'))
    assert.deepEqual(found, [])
  })
})

```

---

### Serialize.JsonNormalize.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/integration/Serialize.JsonNormalize.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { afterEach, beforeEach, describe, it } = require('mocha')

const {
  Serialize: {
    JSON: { Normalize: { Factory: JsonNormalizeFactory } }
  },
  Spec
} = require('../../')
const { createComplexStructure } = require('../_data/models')
const { loadNormalizeResult, writeNormalizeResult } = require('../_data/normalize')

describe('integration.Serialize.JsonNormalize', function () {
  this.timeout(60000);

  [
    Spec.Spec1dot7,
    Spec.Spec1dot6,
    Spec.Spec1dot5,
    Spec.Spec1dot4,
    Spec.Spec1dot3,
    Spec.Spec1dot2
  ].forEach(spec => describe(`complex with spec v${spec.version}`, () => {
    const normalizerFactory = new JsonNormalizeFactory(spec)

    beforeEach(function () {
      this.bom = createComplexStructure()
    })

    afterEach(function () {
      delete this.bom
    })

    it('can normalize', function () {
      normalizerFactory.makeForBom().normalize(this.bom, {})
      // this test does not produce reproducible results,
      // do its just fair enough it did not crash
    })

    it('can normalize with sorted lists', function () {
      const normalized = normalizerFactory.makeForBom()
        .normalize(this.bom, { sortLists: true })

      const json = JSON.stringify(normalized, null, 2)
      if (process.env.CJL_TEST_UPDATE_SNAPSHOTS) {
        writeNormalizeResult(json, 'json_sortedLists', spec.version, 'json')
      }
      assert.deepStrictEqual(
        JSON.parse(json),
        JSON.parse(loadNormalizeResult('json_sortedLists', spec.version, 'json'))
      )
    })

    // TODO add more tests
  }))
})

```

---

### Serialize.JsonSerialize.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/integration/Serialize.JsonSerialize.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { afterEach, beforeEach, describe, it } = require('mocha')

const {
  Models, Enums,
  Serialize: {
    JSON: { Normalize: { Factory: JsonNormalizeFactory } },
    JsonSerializer
  },
  Spec,
  Validation: {
    MissingOptionalDependencyError,
    JsonStrictValidator
  }
} = require('../../')
const { createAllTools, createComplexStructure } = require('../_data/models')
const { loadSerializeResult, writeSerializeResult } = require('../_data/serialize')

describe('integration.Serialize.JsonSerialize', function () {
  this.timeout(60000)

  Object.entries({
    complex: createComplexStructure,
    allTools: createAllTools
  }).forEach(([fixtureName, bomFixture]) => describe(`from fixture ${fixtureName}`, () => {
    [
      Spec.Spec1dot7,
      Spec.Spec1dot6,
      Spec.Spec1dot5,
      Spec.Spec1dot4,
      Spec.Spec1dot3,
      Spec.Spec1dot2
    ].forEach(spec => describe(`with spec v${spec.version}`, () => {
      const normalizerFactory = new JsonNormalizeFactory(spec)

      beforeEach(function () {
        this.bom = bomFixture()
      })

      afterEach(function () {
        delete this.bom
      })

      it('serialize', async function () {
        const serializer = new JsonSerializer(normalizerFactory)

        const serialized = serializer.serialize(
          this.bom, {
            sortLists: true,
            space: 4
          })

        const validator = new JsonStrictValidator(spec.version)
        try {
          const validationError = await validator.validate(serialized)
          assert.strictEqual(validationError, null)
        } catch (err) {
          if (!(err instanceof MissingOptionalDependencyError)) {
            // unexpected error
            assert.fail(err)
          }
        }

        if (process.env.CJL_TEST_UPDATE_SNAPSHOTS) {
          writeSerializeResult(serialized, `json_${fixtureName}`, spec.version, 'json')
        }
        assert.strictEqual(
          serialized,
          loadSerializeResult(`json_${fixtureName}`, spec.version, 'json'))
      })

      // TODO add more tests
    }))
  }))

  describe('make bom-refs unique', () => {
    it('as expected', () => {
      const bom = new Models.Bom({
        metadata: new Models.Metadata({
          component: new Models.Component(Enums.ComponentType.Library, 'root', {
            bomRef: 'testing',
            components: new Models.ComponentRepository([
              new Models.Component(Enums.ComponentType.Library, 'c2', {
                bomRef: 'testing'
              })
            ])
          })
        }),
        components: new Models.ComponentRepository([
          new Models.Component(Enums.ComponentType.Library, 'c1', {
            bomRef: 'testing',
            components: new Models.ComponentRepository([
              new Models.Component(Enums.ComponentType.Library, 'c2', {
                bomRef: 'testing'
              })
            ])
          })
        ])
      })
      const knownBomRefs = [
        bom.metadata.component.bomRef,
        [...bom.metadata.component.components][0].bomRef,
        [...bom.components.values()][0].bomRef,
        [...[...bom.components][0].components][0].bomRef
      ]
      const normalizedBomRefs = new Set(/* will be filled on call */)
      const bomNormalizer = {
        normalize: (bom) => {
          normalizedBomRefs.add(bom.metadata.component.bomRef.value)
          normalizedBomRefs.add([...bom.metadata.component.components][0].bomRef.value)
          normalizedBomRefs.add([...bom.components.values()][0].bomRef.value)
          normalizedBomRefs.add([...[...bom.components][0].components][0].bomRef.value)
          return {}
        }
      }
      const normalizerFactory = { makeForBom: () => bomNormalizer, spec: Spec.Spec1dot4 }
      const serializer = new JsonSerializer(normalizerFactory)

      serializer.serialize(bom)

      assert.strictEqual(normalizedBomRefs.has('testing'), true)
      assert.strictEqual(normalizedBomRefs.size, 4, 'not every value was unique')
      // everything back to before - all have
      knownBomRefs.forEach(({ value }) => assert.strictEqual(value, 'testing'))
    })
  })
})

```

---

### Serialize.XmlNormalize.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/integration/Serialize.XmlNormalize.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { afterEach, beforeEach, describe, it } = require('mocha')

const {
  Models, Enums,
  Serialize: {
    XML: { Normalize: { Factory: XmlNormalizeFactory } }
  },
  Spec
} = require('../../')
const { createComplexStructure } = require('../_data/models')
const { loadNormalizeResult, writeNormalizeResult } = require('../_data/normalize')

describe('integration.Serialize.XmlNormalize', function () {
  this.timeout(60000);

  [
    Spec.Spec1dot7,
    Spec.Spec1dot6,
    Spec.Spec1dot5,
    Spec.Spec1dot4,
    Spec.Spec1dot3,
    Spec.Spec1dot2
  ].forEach(spec => describe(`complex with spec v${spec.version}`, () => {
    const normalizerFactory = new XmlNormalizeFactory(spec)

    beforeEach(function () {
      this.bom = createComplexStructure()
    })

    afterEach(function () {
      delete this.bom
    })

    it('can normalize', function () {
      normalizerFactory.makeForBom().normalize(this.bom, {})
      // this test does not produce reproducible results,
      // do its just fair enough it did not crash
    })

    it('can normalize with sorted lists', function () {
      const normalized = normalizerFactory.makeForBom()
        .normalize(this.bom, { sortLists: true })

      const json = JSON.stringify(normalized, null, 2)

      if (process.env.CJL_TEST_UPDATE_SNAPSHOTS) {
        writeNormalizeResult(json, 'xml_sortedLists', spec.version, 'json')
      }
      assert.deepStrictEqual(
        JSON.parse(json),
        JSON.parse(loadNormalizeResult('xml_sortedLists', spec.version, 'json'))
      )
    })

    // TODO add more tests
  }))

  describe('ExternalReference\'s `anyURI`', () => {
    const normalizer = new XmlNormalizeFactory(Spec.Spec1dot4).makeForExternalReference()

    describe('omit invalid', () => {
      [
        // only one fragment allowed
        'foo#bar#baz',
        // scheme must follow the RFC
        'git@github.com:peterolson/BigInteger.js.git',
        'git%40github.com:peterolson/BigInteger.js.git',
        ':foo-bar'
      ].forEach(uri => it(`${uri}`, () => {
        const ref = new Models.ExternalReference(uri, Enums.ExternalReferenceType.Other)
        const normalized = normalizer.normalize(ref, {}, 'ref')
        assert.strictEqual(normalized, undefined)
      }))
    })
    describe('render valid', () => {
      [
        'https://github.com/peterolson/BigInteger.js.git',
        'git+ssh:git@github.com:peterolson/BigInteger.js.git',
        'example.com:8080/foo/bar',
        'foo#bar',
        'foo@bar.com',
        'g#it@github.com:peterolson/BigInteger.js.git'
      ].forEach(uri => it(`${uri}`, () => {
        const ref = new Models.ExternalReference(uri, Enums.ExternalReferenceType.Other)
        const normalized = normalizer.normalize(ref, {}, 'ref')
        assert.deepStrictEqual(normalized, {
          type: 'element',
          name: 'ref',
          attributes: { type: 'other' },
          children: [{
            type: 'element',
            name: 'url',
            children: uri
          }]
        })
      }))
    })
  })
})

```

---

### Serialize.XmlSerialize.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/integration/Serialize.XmlSerialize.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { afterEach, beforeEach, describe, it } = require('mocha')

const {
  Models, Enums,
  Serialize: {
    XML: { Normalize: { Factory: XmlNormalizeFactory } },
    XmlSerializer, MissingOptionalDependencyError
  },
  Spec,
  Validation
} = require('../../')
const { default: xmlStringify } = require('../../dist.node/_optPlug.node/xmlStringify')
const { createAllTools, createComplexStructure } = require('../_data/models')
const { loadSerializeResult, writeSerializeResult } = require('../_data/serialize')

describe('integration.Serialize.XmlSerialize', function () {
  const expectMissingDepError = xmlStringify.fails ?? false

  this.timeout(60000)

  Object.entries({
    complex: createComplexStructure,
    allTools: createAllTools
  }).forEach(([fixtureName, bomFixture]) => describe(`from fixture ${fixtureName}`, () => {
    [
      Spec.Spec1dot7,
      Spec.Spec1dot6,
      Spec.Spec1dot5,
      Spec.Spec1dot4,
      Spec.Spec1dot3,
      Spec.Spec1dot2
    ].forEach(spec => describe(`with spec v${spec.version}`, () => {
      const normalizerFactory = new XmlNormalizeFactory(spec)

      beforeEach(function () {
        this.bom = bomFixture()
      })

      afterEach(function () {
        delete this.bom
      })

      if (expectMissingDepError) {
        it('throws MissingOptionalDependencyError', function () {
          const serializer = new XmlSerializer(normalizerFactory)
          assert.throws(
            () => { serializer.serialize(this.bom, {}) },
            (err) => err instanceof MissingOptionalDependencyError
          )
        })
        return // skip other tests
      }

      it('serialize', async function () {
        const serializer = new XmlSerializer(normalizerFactory)
        const serialized = await serializer.serialize(
          this.bom, {
            sortLists: true,
            space: 4
          })

        const validator = new Validation.XmlValidator(spec.version)
        try {
          const validationError = await validator.validate(serialized)
          assert.strictEqual(validationError, null)
        } catch (err) {
          if (!(err instanceof Validation.MissingOptionalDependencyError)) {
            // unexpected error
            throw err
          }
        }

        if (process.env.CJL_TEST_UPDATE_SNAPSHOTS) {
          writeSerializeResult(serialized, `xml_${fixtureName}`, spec.version, 'xml')
        }
        assert.strictEqual(
          serialized,
          loadSerializeResult(`xml_${fixtureName}`, spec.version, 'xml'))
      })

      // TODO add more tests
    }))
  }))

  describe('make bom-refs unique', () => {
    it('as expected', () => {
      const bom = new Models.Bom({
        metadata: new Models.Metadata({
          component: new Models.Component(Enums.ComponentType.Library, 'root', {
            bomRef: 'testing',
            components: new Models.ComponentRepository([
              new Models.Component(Enums.ComponentType.Library, 'c2', {
                bomRef: 'testing'
              })
            ])
          })
        }),
        components: new Models.ComponentRepository([
          new Models.Component(Enums.ComponentType.Library, 'c1', {
            bomRef: 'testing',
            components: new Models.ComponentRepository([
              new Models.Component(Enums.ComponentType.Library, 'c2', {
                bomRef: 'testing'
              })
            ])
          })
        ])
      })
      const knownBomRefs = [
        bom.metadata.component.bomRef,
        [...bom.metadata.component.components][0].bomRef,
        [...bom.components.values()][0].bomRef,
        [...[...bom.components][0].components][0].bomRef
      ]
      const normalizedBomRefs = new Set(/* will be filled on call */)
      const bomNormalizer = {
        normalize: (bom) => {
          normalizedBomRefs.add(bom.metadata.component.bomRef.value)
          normalizedBomRefs.add([...bom.metadata.component.components][0].bomRef.value)
          normalizedBomRefs.add([...bom.components.values()][0].bomRef.value)
          normalizedBomRefs.add([...[...bom.components][0].components][0].bomRef.value)
          return { type: 'element', name: 'dummy' }
        }
      }
      const normalizerFactory = { makeForBom: () => bomNormalizer, spec: Spec.Spec1dot4 }
      const serializer = new XmlSerializer(normalizerFactory)

      try {
        serializer.serialize(bom)
      } catch (err) {
        assert.ok(err instanceof Error)
        assert.match(err.message, /no XmlStringifier available./i)
      }

      assert.strictEqual(normalizedBomRefs.has('testing'), true)
      assert.strictEqual(normalizedBomRefs.size, 4, 'not every value was unique')
      // everything back to before - all have
      knownBomRefs.forEach(({ value }) => assert.strictEqual(value, 'testing'))
    })
  })
})

```

---

### Validation.JsonStrictValidator.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/integration/Validation.JsonStrictValidator.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { describe, it } = require('mocha')

const {
  Spec: { Version },
  Validation: {
    NotImplementedError, MissingOptionalDependencyError,
    JsonStrictValidator
  }
} = require('../../')
const { default: jsonValidator } = require('../../dist.node/_optPlug.node/jsonValidator')

describe('integration.Validation.JsonStrictValidator', () => {
  const expectMissingDepError = jsonValidator.fails ?? false;

  [
    Version.v1dot0,
    Version.v1dot1
  ].forEach((version) => describe(version, () => {
    it('throws not implemented', async () => {
      const validator = new JsonStrictValidator(version)
      await assert.rejects(
        validator.validate('{}'),
        (err) => err instanceof NotImplementedError
      )
    })
  }));

  [
    Version.v1dot7,
    Version.v1dot6,
    Version.v1dot5,
    Version.v1dot4,
    Version.v1dot3,
    Version.v1dot2
  ].forEach((version) => describe(version, () => {
    if (expectMissingDepError) {
      it('throws MissingOptionalDependencyError', async () => {
        const validator = new JsonStrictValidator(version)
        await assert.rejects(
          validator.validate('{}'),
          (err) => err instanceof MissingOptionalDependencyError
        )
      })
      return // skip other tests
    }

    it('invalid throws', async () => {
      const validator = new JsonStrictValidator(version)
      const input = JSON.stringify({
        bomFormat: 'CycloneDX',
        specVersion: version,
        components: [{
          type: 'library',
          name: 'bar',
          unknown: 'undefined' // << undefined/additional property
        }]
      })
      const validationError = await validator.validate(input)
      assert.notStrictEqual(validationError, null)
    })

    it('valid passes', async () => {
      const validator = new JsonStrictValidator(version)
      const input = JSON.stringify({
        $schema: `http://cyclonedx.org/schema/bom-${version}.schema.json`,
        bomFormat: 'CycloneDX',
        specVersion: version,
        components: [{
          type: 'library',
          name: 'foo',
          version: '1.337'
        }]
      })
      const validationError = await validator.validate(input)
      assert.strictEqual(validationError, null)
    })
  }))
})

```

---

### Validation.JsonValidator.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/integration/Validation.JsonValidator.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { describe, it } = require('mocha')

const {
  Spec: { Version },
  Validation: {
    NotImplementedError, MissingOptionalDependencyError,
    JsonValidator
  }
} = require('../../')
const { default: jsonValidator } = require('../../dist.node/_optPlug.node/jsonValidator')

describe('integration.Validation.JsonValidator', () => {
  const expectMissingDepError = jsonValidator.fails ?? false;

  [
    'somthing-unexpected',
    Version.v1dot0,
    Version.v1dot1
  ].forEach((version) => describe(version, () => {
    it('throws not implemented', async () => {
      const validator = new JsonValidator(version)
      await assert.rejects(
        validator.validate('{}'),
        (err) => err instanceof NotImplementedError
      )
    })
  }));

  [
    Version.v1dot7,
    Version.v1dot6,
    Version.v1dot5,
    Version.v1dot4,
    Version.v1dot3,
    Version.v1dot2
  ].forEach((version) => describe(version, () => {
    if (expectMissingDepError) {
      it('throws MissingOptionalDependencyError', async () => {
        const validator = new JsonValidator(version)
        await assert.rejects(
          validator.validate('{}'),
          (err) => err instanceof MissingOptionalDependencyError
        )
      })
      return // skip other tests
    }

    it('invalid throws', async () => {
      const validator = new JsonValidator(version)
      const input = JSON.stringify({
        bomFormat: 'CycloneDX',
        specVersion: version,
        components: [{
          type: 'library',
          name: 'bar',
          unknown: 'undefined' // << undefined/additional property
        }]
      })
      const validationError = await validator.validate(input)
      assert.notStrictEqual(validationError, null)
    })

    it('valid passes', async () => {
      const validator = new JsonValidator(version)
      const input = JSON.stringify({
        $schema: `http://cyclonedx.org/schema/bom-${version}.schema.json`,
        bomFormat: 'CycloneDX',
        specVersion: version,
        components: [{
          type: 'library',
          name: 'foo',
          version: '1.337'
        }]
      })
      const validationError = await validator.validate(input)
      assert.strictEqual(validationError, null)
    })
  }))
})

```

---

### Validation.XmlValidator.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/integration/Validation.XmlValidator.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { describe, it } = require('mocha')

const {
  Spec: { Version },
  Validation: {
    NotImplementedError, MissingOptionalDependencyError,
    XmlValidator
  }
} = require('../../')
const { default: xmlValidator } = require('../../dist.node/_optPlug.node/xmlValidator')

describe('integration.Validation.XmlValidator', () => {
  const expectMissingDepError = xmlValidator.fails ?? false;

  [
    'somthing-unexpected'
  ].forEach((version) => describe(version, () => {
    it('throws not implemented', async () => {
      const validator = new XmlValidator(version)
      await assert.rejects(
        validator.validate('<bom/>'),
        (err) => err instanceof NotImplementedError
      )
    })
  }));

  [
    Version.v1dot7,
    Version.v1dot6,
    Version.v1dot5,
    Version.v1dot4,
    Version.v1dot3,
    Version.v1dot2,
    Version.v1dot1,
    Version.v1dot0
  ].forEach((version) => describe(version, () => {
    if (expectMissingDepError) {
      it('throws MissingOptionalDependencyError', async () => {
        const validator = new XmlValidator(version)
        await assert.rejects(
          validator.validate('<bom/>'),
          (err) => err instanceof MissingOptionalDependencyError
        )
      })
      return // skip other tests
    }

    it('invalid throws', async () => {
      const validator = new XmlValidator(version)
      const input = `<?xml version="1.0" encoding="UTF-8"?>
        <bom xmlns="http://cyclonedx.org/schema/bom/${version}">
          <components>
            <component type="library">
              <name>bar</name>
              <version>1.337</version>
              <unknown>undefined</unknown><!-- << undefined/additional property -->
            </component>
          </components>
        </bom>`
      const validationError = await validator.validate(input)
      assert.notStrictEqual(validationError, null)
    })

    it('valid passes', async () => {
      const validator = new XmlValidator(version)
      const input = `<?xml version="1.0" encoding="UTF-8"?>
        <bom xmlns="http://cyclonedx.org/schema/bom/${version}">
          <components>
            <component type="library">
              <name>bar</name>
              <version>1.337</version>
              ${version === '1.0' ? '<modified>false</modified>' : ''}
            </component>
          </components>
        </bom>`
      const validationError = await validator.validate(input)
      assert.strictEqual(validationError, null)
    })
  }))
})

```

---

### Contrib.Bom.Utils.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/unit/Contrib.Bom.Utils.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Contrib,
} = require('../../')

suite('unit: Contrib.Bom.Utils', () => {
  suite('randomSerialNumber()', () => {
    test('has correct format according to XSD', () => {
      const value = Contrib.Bom.Utils.randomSerialNumber()
      assert.match(value, /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$|^\\{[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\}$/)
    })
    test('has correct format according to JSON schema', () => {
      const value = Contrib.Bom.Utils.randomSerialNumber()
      assert.match(value, /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
    })
  })
})

```

---

### Contrib.FromNodePackageJson.Builders.ComponentBuilder.node.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/unit/Contrib.FromNodePackageJson.Builders.ComponentBuilder.node.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Contrib,
} = require('../../')

suite('unit: Contrib.FromNodePackageJson.Builders.ComponentBuilder', () => {
  test('construct', () => {
    const extRefFactory = new Contrib.FromNodePackageJson.Factories.ExternalReferenceFactory()
    const licenseFactory = new Contrib.License.Factories.LicenseFactory()

    const actual = new Contrib.FromNodePackageJson.Builders.ComponentBuilder(extRefFactory, licenseFactory)

    assert.strictEqual(actual.extRefFactory, extRefFactory)
    assert.strictEqual(actual.licenseFactory, licenseFactory)
  })
})

```

---

### Contrib.FromNodePackageJson.Builders.ToolBuilder.node.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/unit/Contrib.FromNodePackageJson.Builders.ToolBuilder.node.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Contrib,
} = require('../../')

suite('unit: Contrib.FromNodePackageJson.Builders.ToolBuilder', () => {
  test('construct', () => {
    const extRefFactory = new Contrib.FromNodePackageJson.Factories.ExternalReferenceFactory()

    const actual = new Contrib.FromNodePackageJson.Builders.ToolBuilder(extRefFactory)

    assert.strictEqual(actual.extRefFactory, extRefFactory)
  })
})

```

---

### Contrib.FromNodePackageJson.Utils.node.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/unit/Contrib.FromNodePackageJson.Utils.node.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Enums: {
    HashAlgorithm
  },
  Contrib,
} = require('../../')

suite('unit: Contrib.FromNodePackageJson.Utils', () => {
  suite('defaultRegistryMatcher', () => {
    test('matches pure domain', () => {
      const actual = Contrib.FromNodePackageJson.Utils.defaultRegistryMatcher.test('https://registry.npmjs.org')
      assert.strictEqual(actual, true)
    })
    test('matches with path', () => {
      const actual = Contrib.FromNodePackageJson.Utils.defaultRegistryMatcher.test('https://registry.npmjs.org/foo/bar')
      assert.strictEqual(actual, true)
    })
    suite('not match unexpected', () => {
      for (const c of [
        'https://my-own=registry.local',
        'https://registry.npmjs.org.uk',
        'https://registry.npmjs.org.uk/foo/bar'
      ]) {
        test(c, () => {
          const actual = Contrib.FromNodePackageJson.Utils.defaultRegistryMatcher.test(c)
          assert.strictEqual(actual, false)
        })
      }
    })
  })

  suite('unit: parsePackageIntegrity', () => {
    suite('as expected', () => {
      for (const [c, ...expected] of [
        ['sha512-zvj65TkFeIt3i6aj5bIvJDzjjQQGs4o/sNoezg1F1kYap9Nu2jcUdpwzRSJTHMMzG0H7bZkn4rNQpImhuxWX2A==',
          HashAlgorithm['SHA-512'],
          'cef8fae53905788b778ba6a3e5b22f243ce38d0406b38a3fb0da1ece0d45d6461aa7d36eda3714769c334522531cc3331b41fb6d9927e2b350a489a1bb1597d8'
        ],
        ['sha1-Kq5sNclPz7QV2+lfQIuc6R7oRu0=',
          HashAlgorithm['SHA-1'],
          '2aae6c35c94fcfb415dbe95f408b9ce91ee846ed'
        ],
        ['sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
          HashAlgorithm['SHA-256'],
          'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        ],
        ['sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC',
          HashAlgorithm['SHA-384'],
          'a2a56e01f5d129aa7b7dd81c098e6eca433af91f46a90f0afeec72f6bc7b1cd42519897590fcd0868d70c7827063cc02'
        ],
      ]) {
        test(c, () => {
          const actual = Contrib.FromNodePackageJson.Utils.parsePackageIntegrity(c)
          assert.deepStrictEqual(actual, expected)
        })
      }
    })
    suite('fails', () => {
      for (const c of [
        'sha1-Kq5sNclPz7QV2+lfQIuc6R7oRu0', // missing character
        'sha1-Kq5sNclPz7QV2+lfQIuc6R7oRu0==', // additional character
        'sha512-Kq5sNclPz7QV2+lfQIuc6R7oRu0=', // alg and hash dont match
      ]) {
        test(c, () => {
          assert.throws(() => {
            Contrib.FromNodePackageJson.Utils.parsePackageIntegrity(c)
          })
        })
      }
    })
  })
})

```

---

### Models.Bom.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/unit/Models.Bom.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Models: {
    Bom, ComponentRepository, Metadata,
    Vulnerability: { VulnerabilityRepository }
  }
} = require('../../')

suite('unit: Models.Bom', () => {
  test('construct with empty properties', () => {
    const bom = new Bom()

    assert.ok(bom.metadata instanceof Metadata)
    assert.deepStrictEqual(bom.metadata, new Metadata())
    assert.ok(bom.components instanceof ComponentRepository)
    assert.strictEqual(bom.components.size, 0)
    assert.ok(bom.vulnerabilities instanceof VulnerabilityRepository)
    assert.strictEqual(bom.vulnerabilities.size, 0)
    assert.strictEqual(bom.version, 1)
    assert.strictEqual(bom.serialNumber, undefined)
  })

  test('construct with preset properties', () => {
    const version = Math.max(1, Math.round(Math.random() * Number.MAX_SAFE_INTEGER))
    const serialNumber = 'urn:uuid:12345678-4321-0987-6547-abcdef123456'
    const metadata = new Metadata()
    const components = new ComponentRepository()
    const vulnerabilities = new VulnerabilityRepository()

    const bom = new Bom({
      version,
      serialNumber,
      metadata,
      components,
      vulnerabilities
    })

    assert.strictEqual(bom.version, version)
    assert.strictEqual(bom.serialNumber, serialNumber)
    assert.strictEqual(bom.metadata, metadata)
    assert.strictEqual(bom.components, components)
    assert.strictEqual(bom.vulnerabilities, vulnerabilities)
  })

  suite('can set version', () =>
    [3, 6.0].forEach(newVersion =>
      test(`for: ${newVersion}`, () => {
        const bom = new Bom()
        assert.notStrictEqual(bom.version, newVersion)

        bom.version = newVersion

        assert.strictEqual(bom.version, newVersion)
      })
    )
  )

  suite('cannot set version', () =>
    [
      0, -1, 3.5, -3.5,
      'foo', '3',
      true, false,
      null, undefined,
      [], {}
    ].forEach(newVersion =>
      test(`for: ${newVersion}`, () => {
        const bom = new Bom()
        assert.notStrictEqual(bom.version, newVersion)
        assert.throws(
          () => { bom.version = newVersion },
          /not PositiveInteger/i
        )
      })
    )
  )

  suite('can set serialNumber', () => {
    test('empty string', () => {
      const bom = new Bom()
      bom.serialNumber = ''
      assert.strictEqual(bom.serialNumber, undefined)
    })
    test('something', () => {
      const bom = new Bom()
      bom.serialNumber = 'something'
      assert.strictEqual(bom.serialNumber, 'something')
    })
  })
})

```

---

### Models.Component.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/unit/Models.Component.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Models: {
    Component, ComponentRepository,
    BomRef, BomRefRepository,
    ExternalReferenceRepository, ExternalReference,
    HashDictionary,
    LicenseRepository, NamedLicense,
    OrganizationalEntity,
    SWID
  }
} = require('../../')

suite('unit: Models.Component', () => {
  test('constructor', () => {
    const component = new Component('application', 'foobar')

    assert.strictEqual(component.type, 'application')
    assert.strictEqual(component.name, 'foobar')
    assert.strictEqual(component.author, undefined)
    assert.strictEqual(component.bomRef.value, undefined)
    assert.strictEqual(component.copyright, undefined)
    assert.strictEqual(component.cpe, undefined)
    assert.strictEqual(component.dependencies.size, 0)
    assert.strictEqual(component.description, undefined)
    assert.strictEqual(component.externalReferences.size, 0)
    assert.strictEqual(component.group, undefined)
    assert.strictEqual(component.hashes.size, 0)
    assert.strictEqual(component.licenses.size, 0)
    assert.strictEqual(component.purl, undefined)
    assert.strictEqual(component.scope, undefined)
    assert.strictEqual(component.supplier, undefined)
    assert.strictEqual(component.swid, undefined)
    assert.strictEqual(component.version, undefined)
    assert.strictEqual(component.components.size, 0)
  })

  test('constructor with OptionalProperties', () => {
    const dummyBomRef = new BomRef('testing')
    const dummyExtRef = new ExternalReference('../', 'other')
    const dummyLicense = new NamedLicense('mine')
    const dummyPurl = 'pkg:npm/ns/app@1.33.7'
    const dummySupplier = new OrganizationalEntity({ name: 'dummySupplier' })
    const dummySWID = new SWID('my-fake-swid', 'foo-bar')
    const subComponent = new Component('library', 'MySubComponent')

    const component = new Component('application', 'foobar', {
      author: 'my author',
      bomRef: 'my-bomref',
      copyright: 'my copyright',
      cpe: 'cpe:2.3:a:microsoft:internet_explorer:8.0.6001:beta:*:*:*:*:*:*',
      dependencies: new BomRefRepository([dummyBomRef]),
      description: 'this is a test',
      externalReferences: new ExternalReferenceRepository([dummyExtRef]),
      group: 'the-crew',
      hashes: new HashDictionary([['MD5', '59bcc3ad6775562f845953cf01624225']]),
      licenses: new LicenseRepository([dummyLicense]),
      purl: dummyPurl,
      scope: 'optional',
      supplier: dummySupplier,
      swid: dummySWID,
      version: '1.33.7',
      components: new ComponentRepository([subComponent])
    })

    assert.strictEqual(component.type, 'application')
    assert.strictEqual(component.name, 'foobar')
    assert.strictEqual(component.author, 'my author')
    assert.strictEqual(component.bomRef.value, 'my-bomref')
    assert.strictEqual(component.copyright, 'my copyright')
    assert.strictEqual(component.cpe, 'cpe:2.3:a:microsoft:internet_explorer:8.0.6001:beta:*:*:*:*:*:*')
    assert.strictEqual(component.dependencies.size, 1)
    assert.strictEqual(Array.from(component.dependencies)[0], dummyBomRef)
    assert.strictEqual(component.description, 'this is a test')
    assert.strictEqual(component.externalReferences.size, 1)
    assert.strictEqual(Array.from(component.externalReferences)[0], dummyExtRef)
    assert.strictEqual(component.group, 'the-crew')
    assert.strictEqual(component.hashes.size, 1)
    assert.strictEqual(component.hashes.get('MD5'), '59bcc3ad6775562f845953cf01624225')
    assert.strictEqual(component.licenses.size, 1)
    assert.strictEqual(Array.from(component.licenses)[0], dummyLicense)
    assert.strictEqual(component.purl, dummyPurl)
    assert.strictEqual(component.scope, 'optional')
    assert.strictEqual(component.supplier, dummySupplier)
    assert.strictEqual(component.swid, dummySWID)
    assert.strictEqual(component.version, '1.33.7')
    assert.strictEqual(component.components.size, 1)
    assert.strictEqual(Array.from(component.components)[0], subComponent)
  })
})

```

---

### Models.Vulnerability.Vulnerability.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/unit/Models.Vulnerability.Vulnerability.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Models: {
    PropertyRepository, Tools,
    Vulnerability: {
      AdvisoryRepository, AffectRepository, Analysis, Credits, RatingRepository, ReferenceRepository, Source,
      Vulnerability
    }
  },
  Types: { CweRepository }
} = require('../../')

suite('unit: Models.Vulnerability.Vulnerability', () => {
  test('construct with empty properties', () => {
    const vulnerability = new Vulnerability()

    assert.strictEqual(vulnerability.bomRef.value, undefined)
    assert.strictEqual(vulnerability.id, undefined)
    assert.strictEqual(vulnerability.source, undefined)
    assert.ok(vulnerability.references instanceof ReferenceRepository)
    assert.strictEqual(vulnerability.references.size, 0)
    assert.ok(vulnerability.ratings instanceof RatingRepository)
    assert.strictEqual(vulnerability.ratings.size, 0)
    assert.ok(vulnerability.cwes instanceof CweRepository)
    assert.strictEqual(vulnerability.cwes.size, 0)
    assert.strictEqual(vulnerability.description, undefined)
    assert.strictEqual(vulnerability.detail, undefined)
    assert.strictEqual(vulnerability.recommendation, undefined)
    assert.ok(vulnerability.advisories instanceof AdvisoryRepository)
    assert.strictEqual(vulnerability.advisories.size, 0)
    assert.strictEqual(vulnerability.created, undefined)
    assert.strictEqual(vulnerability.published, undefined)
    assert.strictEqual(vulnerability.updated, undefined)
    assert.strictEqual(vulnerability.credits, undefined)
    assert.ok(vulnerability.tools instanceof Tools)
    assert.strictEqual(vulnerability.tools.size, 0)
    assert.strictEqual(vulnerability.analysis, undefined)
    assert.ok(vulnerability.affects instanceof AffectRepository)
    assert.strictEqual(vulnerability.affects.size, 0)
    assert.ok(vulnerability.properties instanceof PropertyRepository)
    assert.strictEqual(vulnerability.properties.size, 0)
  })

  test('construct with preset properties', () => {
    const dummySource = new Source()
    const dummyReferences = new ReferenceRepository()
    const dummyRatings = new RatingRepository()
    const dummyCwes = new CweRepository()
    const dummyAdvisories = new AdvisoryRepository()
    const dummyCreated = new Date()
    const dummyPublished = new Date()
    const dummyUpdated = new Date()
    const dummyCredits = new Credits()
    const dummyTools = new Tools()
    const dummyAnalysis = new Analysis()
    const dummyAffects = new AffectRepository()
    const dummyProperties = new PropertyRepository()

    const vulnerability = new Vulnerability({
      bomRef: 'my-bomref',
      id: 'CVE-2022-0001',
      source: dummySource,
      references: dummyReferences,
      ratings: dummyRatings,
      cwes: dummyCwes,
      description: 'my description',
      detail: 'my detail',
      recommendation: 'delete everything',
      advisories: dummyAdvisories,
      created: dummyCreated,
      published: dummyPublished,
      updated: dummyUpdated,
      credits: dummyCredits,
      tools: dummyTools,
      analysis: dummyAnalysis,
      affects: dummyAffects,
      properties: dummyProperties
    })

    assert.strictEqual(vulnerability.bomRef.value, 'my-bomref')
    assert.strictEqual(vulnerability.id, 'CVE-2022-0001')
    assert.strictEqual(vulnerability.source, dummySource)
    assert.strictEqual(vulnerability.references, dummyReferences)
    assert.strictEqual(vulnerability.ratings, dummyRatings)
    assert.strictEqual(vulnerability.cwes, dummyCwes)
    assert.strictEqual(vulnerability.description, 'my description')
    assert.strictEqual(vulnerability.detail, 'my detail')
    assert.strictEqual(vulnerability.recommendation, 'delete everything')
    assert.strictEqual(vulnerability.advisories, dummyAdvisories)
    assert.strictEqual(vulnerability.created, dummyCreated)
    assert.strictEqual(vulnerability.published, dummyPublished)
    assert.strictEqual(vulnerability.updated, dummyUpdated)
    assert.strictEqual(vulnerability.credits, dummyCredits)
    assert.strictEqual(vulnerability.tools, dummyTools)
    assert.strictEqual(vulnerability.analysis, dummyAnalysis)
    assert.strictEqual(vulnerability.affects, dummyAffects)
    assert.strictEqual(vulnerability.properties, dummyProperties)
  })
})

```

---

### Models.bomLink.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/unit/Models.bomLink.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Models: { BomLinkDocument, BomLinkElement }
} = require('../../')

suite('unit: Models.BomLinkDocument', () => {
  suite('isValid()', () => {
    test('pass', () => {
      // taken from examples in https://cyclonedx.org/capabilities/bomlink/
      const value = 'urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7/1'
      assert.strictEqual(BomLinkDocument.isValid(value), true)
      assert.doesNotThrow(() => new BomLinkDocument(value))
    })
    test('fail: is element', () => {
      const value = 'urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7/1#componentA'
      assert.strictEqual(BomLinkDocument.isValid(value), false)
      assert.throws(() => new BomLinkDocument(value))
    })
    test('fail: missing version', () => {
      const value = 'urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7/'
      assert.strictEqual(BomLinkDocument.isValid(value), false)
      assert.throws(() => new BomLinkDocument(value))
    })
    test('fail: prefixed', () => {
      const value = 'see urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7/1'
      assert.strictEqual(BomLinkDocument.isValid(value), false)
      assert.throws(() => new BomLinkDocument(value))
    })
    test('fail: missing leadin', () => {
      const value = 'f08a6ccd-4dce-4759-bd84-c626675d60a7/1'
      assert.strictEqual(BomLinkDocument.isValid(value), false)
      assert.throws(() => new BomLinkDocument(value))
    })
  })

  suite('BomLinkElement()', () => {
    test('pass', () => {
      // taken from examples in https://cyclonedx.org/capabilities/bomlink/
      const value = 'urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7/1#componentA'
      assert.strictEqual(BomLinkElement.isValid(value), true)
      assert.doesNotThrow(() => new BomLinkElement(value))
    })
    test('fail: is document', () => {
      const value = 'urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7/1'
      assert.strictEqual(BomLinkElement.isValid(value), false)
      assert.throws(() => new BomLinkElement(value))
    })
    test('fail: missing element', () => {
      const value = 'urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7#'
      assert.strictEqual(BomLinkElement.isValid(value), false)
      assert.throws(() => new BomLinkElement(value))
    })
    test('fail: prefixed', () => {
      const value = 'see urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7/1#componentA'
      assert.strictEqual(BomLinkElement.isValid(value), false)
      assert.throws(() => new BomLinkElement(value))
    })
    test('fail: missing leadin', () => {
      const value = 'f08a6ccd-4dce-4759-bd84-c626675d60a7/1#componentA'
      assert.strictEqual(BomLinkElement.isValid(value), false)
      assert.throws(() => new BomLinkElement(value))
    })
  })
})

```

---

### SPDX.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/unit/SPDX.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  SPDX: { fixupSpdxId, isSupportedSpdxId }
} = require('../../')

suite('unit: SPDX.isSupportedSpdxId()', () => {
  const knownSpdxIds = Object.freeze(['MIT', 'Apache-2.0'])

  suite('is true', () =>
    knownSpdxIds.forEach(value =>
      test(`for: ${value}`, () =>
        assert.strictEqual(isSupportedSpdxId(value), true)
      )
    )
  )

  suite('is false', () =>
    [null, undefined, 'fooBarbaz', 'mit'].forEach(value =>
      test(`for: ${value}`, () =>
        assert.strictEqual(isSupportedSpdxId(value), false)
      )
    )
  )
})

suite('unit: SPDX.fixupSpdxId()', () => {
  const expectedFixed = new Map([
    ['MIT', 'MIT'],
    ['mit', 'MIT'],
    ['Apache-2.0', 'Apache-2.0'],
    ['ApAcHe-2.0', 'Apache-2.0'],
    ['apache-2.0', 'Apache-2.0']
  ])

  suite('transform', () =>
    expectedFixed.forEach((expected, value) =>
      test(`${value} => ${expected}`, () =>
        assert.strictEqual(fixupSpdxId(value), expected)
      )
    )
  )

  suite('miss', () =>
    [undefined, null, 'fooBarbaz'].forEach((value) =>
      test(`${value}`, () =>
        assert.strictEqual(fixupSpdxId(value), undefined)
      )
    )
  )
})

```

---

### Serialize.BomRefDiscriminator.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/unit/Serialize.BomRefDiscriminator.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Models: { BomRef },
  Serialize: { BomRefDiscriminator }
} = require('../../')
const { randomString } = require('../_helpers/stringFunctions')

suite('unit: Serialize.BomRefDiscriminator', () => {
  test('constructor', () => {
    const bomRef1 = new BomRef()
    const bomRef2 = new BomRef('foo')
    const prefix = randomString(10)

    const actual = new BomRefDiscriminator([bomRef1, bomRef2], prefix)

    assert.strictEqual(actual.prefix, prefix)

    const actualBomRefs = Array.from(actual) // convert the iterator to a list
    assert.strictEqual(actualBomRefs.length, 2)
    assert.strictEqual(actualBomRefs.includes(bomRef1), true)
    assert.strictEqual(actualBomRefs.includes(bomRef2), true)
  })

  test('does not alter BomRef.value unintended', () => {
    const bomRef1 = new BomRef()
    const bomRef2 = new BomRef('foo')

    assert.strictEqual(bomRef1.value, undefined)
    assert.strictEqual(bomRef2.value, 'foo')

    /* eslint-disable-next-line no-unused-vars */
    const discriminator = new BomRefDiscriminator([bomRef1, bomRef2])

    assert.strictEqual(bomRef1.value, undefined)
    assert.strictEqual(bomRef2.value, 'foo')
  })

  test('does not alter BomRef.value unnecessary', () => {
    const bomRef1 = new BomRef('foo')
    const bomRef2 = new BomRef('foo')

    assert.strictEqual(bomRef1.value, 'foo')
    assert.strictEqual(bomRef2.value, 'foo')

    const discriminator = new BomRefDiscriminator([bomRef1, bomRef2])
    discriminator.discriminate()

    assert.notStrictEqual(bomRef1.value, bomRef2.value)
    assert.ok(bomRef1.value === 'foo' || bomRef2.value === 'foo')
  })

  test('does discriminate BomRef.value', () => {
    const bomRef1 = new BomRef()
    const bomRef2 = new BomRef('foo')
    const bomRef3 = new BomRef()
    const bomRef4 = new BomRef('foo')

    const discriminatedPrefix = 'TESTING'
    const expectedFormat = new RegExp(`^${discriminatedPrefix}\\.[0-9a-z]+\\.[0-9a-z]+$`)

    const discriminator = new BomRefDiscriminator(
      [bomRef1, bomRef2, bomRef3, bomRef4],
      discriminatedPrefix
    )
    assert.strictEqual(bomRef1.value, undefined)
    assert.strictEqual(bomRef2.value, 'foo')
    assert.strictEqual(bomRef3.value, undefined)
    assert.strictEqual(bomRef4.value, 'foo')

    discriminator.discriminate()

    assert.ok(typeof bomRef1.value === 'string')
    assert.ok(typeof bomRef2.value === 'string')
    assert.ok(typeof bomRef3.value === 'string')
    assert.ok(typeof bomRef4.value === 'string')

    assert.match(bomRef1.value, expectedFormat)
    assert.match(bomRef3.value, expectedFormat)

    assert.ok(expectedFormat.test(bomRef2.value) ^ expectedFormat.test(bomRef4.value))

    assert.notStrictEqual(bomRef2.value, bomRef1.value)
    assert.notStrictEqual(bomRef3.value, bomRef1.value)
    assert.notStrictEqual(bomRef4.value, bomRef1.value)

    assert.notStrictEqual(bomRef1.value, bomRef2.value)
    assert.notStrictEqual(bomRef3.value, bomRef2.value)
    assert.notStrictEqual(bomRef4.value, bomRef2.value)

    assert.notStrictEqual(bomRef1.value, bomRef3.value)
    assert.notStrictEqual(bomRef2.value, bomRef3.value)
    assert.notStrictEqual(bomRef4.value, bomRef3.value)

    assert.notStrictEqual(bomRef1.value, bomRef4.value)
    assert.notStrictEqual(bomRef2.value, bomRef4.value)
    assert.notStrictEqual(bomRef3.value, bomRef4.value)
  })

  test('does reset BomRef.value', () => {
    const bomRef1 = new BomRef()
    const bomRef2 = new BomRef('foo')
    const bomRef3 = new BomRef()
    const bomRef4 = new BomRef('bar')

    const discriminator = new BomRefDiscriminator([bomRef1, bomRef2, bomRef3, bomRef4])
    assert.strictEqual(bomRef1.value, undefined)
    assert.strictEqual(bomRef2.value, 'foo')
    assert.strictEqual(bomRef3.value, undefined)
    assert.strictEqual(bomRef4.value, 'bar')

    // intentional modification
    bomRef1.value = bomRef2.value = bomRef3.value = bomRef4.value = 'bar'
    assert.strictEqual(bomRef1.value, 'bar')
    assert.strictEqual(bomRef2.value, 'bar')
    assert.strictEqual(bomRef3.value, 'bar')
    assert.strictEqual(bomRef4.value, 'bar')

    discriminator.reset()

    assert.strictEqual(bomRef1.value, undefined)
    assert.strictEqual(bomRef2.value, 'foo')
    assert.strictEqual(bomRef3.value, undefined)
    assert.strictEqual(bomRef4.value, 'bar')
  })

  test('Array from iterator', () => {
    const bomRef1 = new BomRef('foo')
    const bomRef2 = new BomRef('bar')
    const discriminator = new BomRefDiscriminator([bomRef1, bomRef2])

    const arr = Array.from(discriminator)

    assert.strictEqual(arr.length, 2)
    assert.ok(arr.includes(bomRef1))
    assert.ok(arr.includes(bomRef2))
  })

  test('loop of iterator', () => {
    const bomRef1 = new BomRef('foo')
    const bomRef2 = new BomRef('bar')
    const discriminator = new BomRefDiscriminator([bomRef1, bomRef2])

    const arr = []
    for (const bomRef of discriminator) {
      arr.push(bomRef)
    }

    assert.strictEqual(arr.length, 2)
    assert.ok(arr.includes(bomRef1))
    assert.ok(arr.includes(bomRef2))
  })
})

```

---

### Serialize.JsonSerializer.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/unit/Serialize.JsonSerializer.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Serialize: {
    JsonSerializer,
    JSON: { Normalize: { Factory } }
  },
  Spec: { Format, Spec1dot4, UnsupportedFormatError }
} = require('../../')

suite('unit: Serialize.JsonSerializer', () => {
  suite('constructor', () => {
    test('happy path', () => {
      const normalizerFactory = new Factory(Spec1dot4)
      const actual = new JsonSerializer(normalizerFactory)
      assert.strictEqual(actual.normalizerFactory, normalizerFactory)
    })
    test('throws if JSON unsupported by spec', () => {
      const normalizerFactoryDummy = { spec: { supportsFormat: f => f !== Format.JSON } }
      assert.throws(
        () => {
          /* eslint-disable-next-line no-new -- needed to test constructor */
          new JsonSerializer(normalizerFactoryDummy)
        },
        UnsupportedFormatError,
        'missing expected error'
      )
    })
  })
})

```

---

### Serialize.XML._xsd.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/unit/Serialize.XML._xsd.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  normalizedString,
  token
} = require('../../dist.node/serialize/xml/_xsd.js')

suite('unit: Serialize.XML._xsd', () => {
  const normalizedStringCases = {
    '': '',
    123: '123',
    ' 0 1\r\n2\t3\n4\t': ' 0 1 2 3 4 ',
    ' 0  1\r\n 2 \t3 \n 4 \t': ' 0  1  2  3   4  ',
  }

  const tokenCases = {
    '': '',
    123: '123',
    ' 0  1 \r\n2\t 3 \n4\n ': '0 1 2 3 4',
    ' 0  1\r\n 2 \t3 \n 4 \t ': '0 1 2 3 4',
  }

  /**
   * @param {string} s
   * @return {string}
   */
  function escapeTNR (s) {
    return s
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
  }

  suite('normalizedString()', () => {
    for (const [input, expected] of Object.entries(normalizedStringCases)) {
      test(`i: "${escapeTNR(input)}"`, () => {
        assert.strictEqual(normalizedString(input), expected)
      })
    }
  })
  suite('token()', () => {
    for (const [input, expected] of Object.entries(tokenCases)) {
      test(`i: "${escapeTNR(input)}"`, () => {
        assert.strictEqual(token(input), expected)
      })
    }
  })
})

```

---

### Serialize.XmlBaseSerializer.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/unit/Serialize.XmlBaseSerializer.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Serialize: {
    XmlBaseSerializer,
    XML: { Normalize: { Factory } }
  },
  Spec: { Format, Spec1dot4, UnsupportedFormatError }
} = require('../../')

suite('unit: Serialize.XmlBaseSerializer', () => {
  suite('constructor', () => {
    class MySerializer extends XmlBaseSerializer {}
    test('happy path', () => {
      const normalizerFactory = new Factory(Spec1dot4)
      const actual = new MySerializer(normalizerFactory)
      assert.strictEqual(actual.normalizerFactory, normalizerFactory)
    })
    test('throws if XML unsupported by spec', () => {
      const normalizerFactoryDummy = { spec: { supportsFormat: f => f !== Format.XML } }
      assert.throws(
        () => {
          /* eslint-disable-next-line no-new -- needed to test constructor */
          new MySerializer(normalizerFactoryDummy)
        },
        UnsupportedFormatError,
        'missing expected error'
      )
    })
  })
})

```

---

### Serialize.XmlSerializer.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/unit/Serialize.XmlSerializer.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Serialize: {
    XmlSerializer,
    XML: { Normalize: { Factory } }
  },
  Spec: { Format, Spec1dot4, UnsupportedFormatError }
} = require('../../')

suite('unit: Serialize.XmlSerializer', () => {
  suite('constructor', () => {
    test('happy path', () => {
      const normalizerFactory = new Factory(Spec1dot4)
      const actual = new XmlSerializer(normalizerFactory)
      assert.strictEqual(actual.normalizerFactory, normalizerFactory)
    })
    test('throws if XML unsupported by spec', () => {
      const normalizerFactoryDummy = { spec: { supportsFormat: f => f !== Format.XML } }
      assert.throws(
        () => {
          /* eslint-disable-next-line no-new -- needed to test constructor */
          new XmlSerializer(normalizerFactoryDummy)
        },
        UnsupportedFormatError,
        'missing expected error'
      )
    })
  })
})

```

---

### Types.cpe.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/93f4bf14d5-cyclonedx-library/tests/unit/Types.cpe.spec.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Types: { isCPE }
} = require('../../')

suite('unit: Types.cpe', () => {
  suite('isCPE()', () => {
    test('2.2', () => {
      const actual = isCPE('cpe:/a:microsoft:internet_explorer:11:-')
      assert.strictEqual(actual, true)
    })
    test('2.3', () => {
      const actual = isCPE('cpe:2.3:a:adobe:flash_player:19.0.0.245:*:*:*:*:internet_explorer:*:*')
      assert.strictEqual(actual, true)
    })
    test('reverted XML special-chars', () => {
      // pattern is taken from XML.
      // XML encodes some chars - like '"` -> `&quot;` or `&` -> `&amp;`.
      // this encoding must have been reverted for the RegularExpression.
      // use case: test if the CPE-escaped(`\`) chars are working as expected
      const actual = isCPE('cpe:2.3:a:acme:foobarbaz:1.3.3.7:*:*:*:\\":\\&:\\>:\\<')
      assert.strictEqual(actual, true)
    })
  })
})

```

---


## driver-adapter-utils@7.4.2

**Funções usados neste arquivo:** PrismaClient, component, upsert, externalComponent, externalTestFile, findMany, $disconnect, PrismaLibSql


## client-runtime-utils@7.4.2

**Funções usados neste arquivo:** PrismaClient, component, upsert, externalComponent, externalTestFile, findMany, $disconnect, PrismaLibSql

### test.config.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e7b1fff700-types/packages/chevrotain/test/test.config.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/* eslint-disable no-undef -- config file */
if (typeof global === "object") {
  global.expect = require("chai").expect
  require("chai").use(require("sinon-chai"))
  global.sinon = require("sinon")
} else if (typeof window === "object") {
  window.expect = chai.expect
}
/* eslint-enable no-undef -- config file */

```

---


## config@7.4.2

**Funções usados neste arquivo:** PrismaClient, component, upsert, externalComponent, externalTestFile, findMany, $disconnect, PrismaLibSql

### test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/afc848c316-postgres/cf/test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
// Add your database url and run this file with the below two commands to test pages and workers
// npx wrangler@latest pages dev ./cf --script-path test.js  --compatibility-date=2023-06-20 --log-level=debug --compatibility-flag=nodejs_compat
// npx wrangler@latest dev ./cf/test.js --compatibility-date=2023-06-20 --log-level=debug --compatibility-flag=nodejs_compat

import postgres from './src/index.js'
const DATABASE_URL = ''

export default {
  async fetch() {
    const sql = postgres(DATABASE_URL)
    const rows = await sql`SELECT table_name FROM information_schema.columns`
    return new Response(rows.map((e) => e.table_name).join('\n'))
  }
}

```

---

### bootstrap.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/afc848c316-postgres/cjs/tests/bootstrap.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
const { spawnSync } = require('child_process')

exec('dropdb', ['postgres_js_test'])

exec('psql', ['-c', 'alter system set ssl=on'])
exec('psql', ['-c', 'drop user postgres_js_test'])
exec('psql', ['-c', 'create user postgres_js_test'])
exec('psql', ['-c', 'alter system set password_encryption=md5'])
exec('psql', ['-c', 'select pg_reload_conf()'])
exec('psql', ['-c', 'drop user if exists postgres_js_test_md5'])
exec('psql', ['-c', 'create user postgres_js_test_md5 with password \'postgres_js_test_md5\''])
exec('psql', ['-c', 'alter system set password_encryption=\'scram-sha-256\''])
exec('psql', ['-c', 'select pg_reload_conf()'])
exec('psql', ['-c', 'drop user if exists postgres_js_test_scram'])
exec('psql', ['-c', 'create user postgres_js_test_scram with password \'postgres_js_test_scram\''])

exec('createdb', ['postgres_js_test'])
exec('psql', ['-c', 'grant all on database postgres_js_test to postgres_js_test'])
exec('psql', ['-c', 'alter database postgres_js_test owner to postgres_js_test'])

module.exports.exec = exec;function exec(cmd, args) {
  const { stderr } = spawnSync(cmd, args, { stdio: 'pipe', encoding: 'utf8' })
  if (stderr && !stderr.includes('already exists') && !stderr.includes('does not exist'))
    throw stderr
}

async function execAsync(cmd, args) { // eslint-disable-line
  let stderr = ''
  const cp = await spawn(cmd, args, { stdio: 'pipe', encoding: 'utf8' }) // eslint-disable-line
  cp.stderr.on('data', x => stderr += x)
  await new Promise(x => cp.on('exit', x))
  if (stderr && !stderr.includes('already exists') && !stderr.includes('does not exist'))
    throw new Error(stderr)
}

```

---

### index.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/afc848c316-postgres/cjs/tests/index.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
const { exec } = require('./bootstrap.js')

const { t, nt, ot } = require('./test.js') // eslint-disable-line
const net = require('net')
const fs = require('fs')
const crypto = require('crypto')

const postgres = require('../src/index.js')
const delay = ms => new Promise(r => setTimeout(r, ms))

const rel = x => require("path").join(__dirname, x)
const idle_timeout = 1

const login = {
  user: 'postgres_js_test'
}

const login_md5 = {
  user: 'postgres_js_test_md5',
  pass: 'postgres_js_test_md5'
}

const login_scram = {
  user: 'postgres_js_test_scram',
  pass: 'postgres_js_test_scram'
}

const options = {
  db: 'postgres_js_test',
  user: login.user,
  pass: login.pass,
  idle_timeout,
  connect_timeout: 1,
  max: 1
}

const sql = postgres(options)

t('Connects with no options', async() => {
  const sql = postgres({ max: 1 })

  const result = (await sql`select 1 as x`)[0].x
  await sql.end()

  return [1, result]
})

t('Uses default database without slash', async() => {
  const sql = postgres('postgres://localhost')
  return [sql.options.user, sql.options.database]
})

t('Uses default database with slash', async() => {
  const sql = postgres('postgres://localhost/')
  return [sql.options.user, sql.options.database]
})

t('Result is array', async() =>
  [true, Array.isArray(await sql`select 1`)]
)

t('Result has count', async() =>
  [1, (await sql`select 1`).count]
)

t('Result has command', async() =>
  ['SELECT', (await sql`select 1`).command]
)

t('Create table', async() =>
  ['CREATE TABLE', (await sql`create table test(int int)`).command, await sql`drop table test`]
)

t('Drop table', { timeout: 2 }, async() => {
  await sql`create table test(int int)`
  return ['DROP TABLE', (await sql`drop table test`).command]
})

t('null', async() =>
  [null, (await sql`select ${ null } as x`)[0].x]
)

t('Integer', async() =>
  ['1', (await sql`select ${ 1 } as x`)[0].x]
)

t('String', async() =>
  ['hello', (await sql`select ${ 'hello' } as x`)[0].x]
)

t('Boolean false', async() =>
  [false, (await sql`select ${ false } as x`)[0].x]
)

t('Boolean true', async() =>
  [true, (await sql`select ${ true } as x`)[0].x]
)

t('Date', async() => {
  const now = new Date()
  return [0, now - (await sql`select ${ now } as x`)[0].x]
})

t('Json', async() => {
  const x = (await sql`select ${ sql.json({ a: 'hello', b: 42 }) } as x`)[0].x
  return ['hello,42', [x.a, x.b].join()]
})

t('implicit json', async() => {
  const x = (await sql`select ${ { a: 'hello', b: 42 } }::json as x`)[0].x
  return ['hello,42', [x.a, x.b].join()]
})

t('implicit jsonb', async() => {
  const x = (await sql`select ${ { a: 'hello', b: 42 } }::jsonb as x`)[0].x
  return ['hello,42', [x.a, x.b].join()]
})

t('Empty array', async() =>
  [true, Array.isArray((await sql`select ${ sql.array([], 1009) } as x`)[0].x)]
)

t('String array', async() =>
  ['123', (await sql`select ${ '{1,2,3}' }::int[] as x`)[0].x.join('')]
)

t('Array of Integer', async() =>
  ['3', (await sql`select ${ sql.array([1, 2, 3]) } as x`)[0].x[2]]
)

t('Array of String', async() =>
  ['c', (await sql`select ${ sql.array(['a', 'b', 'c']) } as x`)[0].x[2]]
)

t('Array of Date', async() => {
  const now = new Date()
  return [now.getTime(), (await sql`select ${ sql.array([now, now, now]) } as x`)[0].x[2].getTime()]
})

t('Array of Box', async() => [
  '(3,4),(1,2);(6,7),(4,5)',
  (await sql`select ${ '{(1,2),(3,4);(4,5),(6,7)}' }::box[] as x`)[0].x.join(';')
])

t('Nested array n2', async() =>
  ['4', (await sql`select ${ sql.array([[1, 2], [3, 4]]) } as x`)[0].x[1][1]]
)

t('Nested array n3', async() =>
  ['6', (await sql`select ${ sql.array([[[1, 2]], [[3, 4]], [[5, 6]]]) } as x`)[0].x[2][0][1]]
)

t('Escape in arrays', async() =>
  ['Hello "you",c:\\windows', (await sql`select ${ sql.array(['Hello "you"', 'c:\\windows']) } as x`)[0].x.join(',')]
)

t('Escapes', async() => {
  return ['hej"hej', Object.keys((await sql`select 1 as ${ sql('hej"hej') }`)[0])[0]]
})

t('null for int', async() => {
  await sql`create table test (x int)`
  return [1, (await sql`insert into test values(${ null })`).count, await sql`drop table test`]
})

t('Throws on illegal transactions', async() => {
  const sql = postgres({ ...options, max: 2, fetch_types: false })
  const error = await sql`begin`.catch(e => e)
  return [
    error.code,
    'UNSAFE_TRANSACTION'
  ]
})

t('Transaction throws', async() => {
  await sql`create table test (a int)`
  return ['22P02', await sql.begin(async sql => {
    await sql`insert into test values(1)`
    await sql`insert into test values('hej')`
  }).catch(x => x.code), await sql`drop table test`]
})

t('Transaction rolls back', async() => {
  await sql`create table test (a int)`
  await sql.begin(async sql => {
    await sql`insert into test values(1)`
    await sql`insert into test values('hej')`
  }).catch(() => { /* ignore */ })
  return [0, (await sql`select a from test`).count, await sql`drop table test`]
})

t('Transaction throws on uncaught savepoint', async() => {
  await sql`create table test (a int)`

  return ['fail', (await sql.begin(async sql => {
    await sql`insert into test values(1)`
    await sql.savepoint(async sql => {
      await sql`insert into test values(2)`
      throw new Error('fail')
    })
  }).catch((err) => err.message)), await sql`drop table test`]
})

t('Transaction throws on uncaught named savepoint', async() => {
  await sql`create table test (a int)`

  return ['fail', (await sql.begin(async sql => {
    await sql`insert into test values(1)`
    await sql.savepoit('watpoint', async sql => {
      await sql`insert into test values(2)`
      throw new Error('fail')
    })
  }).catch(() => 'fail')), await sql`drop table test`]
})

t('Transaction succeeds on caught savepoint', async() => {
  await sql`create table test (a int)`
  await sql.begin(async sql => {
    await sql`insert into test values(1)`
    await sql.savepoint(async sql => {
      await sql`insert into test values(2)`
      throw new Error('please rollback')
    }).catch(() => { /* ignore */ })
    await sql`insert into test values(3)`
  })

  return ['2', (await sql`select count(1) from test`)[0].count, await sql`drop table test`]
})

t('Savepoint returns Result', async() => {
  let result
  await sql.begin(async sql => {
    result = await sql.savepoint(sql =>
      sql`select 1 as x`
    )
  })

  return [1, result[0].x]
})

t('Prepared transaction', async() => {
  await sql`create table test (a int)`

  await sql.begin(async sql => {
    await sql`insert into test values(1)`
    await sql.prepare('tx1')
  })

  await sql`commit prepared 'tx1'`

  return ['1', (await sql`select count(1) from test`)[0].count, await sql`drop table test`]
})

t('Transaction requests are executed implicitly', async() => {
  const sql = postgres({ debug: true, idle_timeout: 1, fetch_types: false })
  return [
    'testing',
    (await sql.begin(sql => [
      sql`select set_config('postgres_js.test', 'testing', true)`,
      sql`select current_setting('postgres_js.test') as x`
    ]))[1][0].x
  ]
})

t('Uncaught transaction request errors bubbles to transaction', async() => [
  '42703',
  (await sql.begin(sql => [
    sql`select wat`,
    sql`select current_setting('postgres_js.test') as x, ${ 1 } as a`
  ]).catch(e => e.code))
])

t('Fragments in transactions', async() => [
  true,
  (await sql.begin(sql => sql`select true as x where ${ sql`1=1` }`))[0].x
])

t('Transaction rejects with rethrown error', async() => [
  'WAT',
  await sql.begin(async sql => {
    try {
      await sql`select exception`
    } catch (ex) {
      throw new Error('WAT')
    }
  }).catch(e => e.message)
])

t('Parallel transactions', async() => {
  await sql`create table test (a int)`
  return ['11', (await Promise.all([
    sql.begin(sql => sql`select 1`),
    sql.begin(sql => sql`select 1`)
  ])).map(x => x.count).join(''), await sql`drop table test`]
})

t('Many transactions at beginning of connection', async() => {
  const sql = postgres(options)
  const xs = await Promise.all(Array.from({ length: 100 }, () => sql.begin(sql => sql`select 1`)))
  return [100, xs.length]
})

t('Transactions array', async() => {
  await sql`create table test (a int)`

  return ['11', (await sql.begin(sql => [
    sql`select 1`.then(x => x),
    sql`select 1`
  ])).map(x => x.count).join(''), await sql`drop table test`]
})

t('Transaction waits', async() => {
  await sql`create table test (a int)`
  await sql.begin(async sql => {
    await sql`insert into test values(1)`
    await sql.savepoint(async sql => {
      await sql`insert into test values(2)`
      throw new Error('please rollback')
    }).catch(() => { /* ignore */ })
    await sql`insert into test values(3)`
  })

  return ['11', (await Promise.all([
    sql.begin(sql => sql`select 1`),
    sql.begin(sql => sql`select 1`)
  ])).map(x => x.count).join(''), await sql`drop table test`]
})

t('Helpers in Transaction', async() => {
  return ['1', (await sql.begin(async sql =>
    await sql`select ${ sql({ x: 1 }) }`
  ))[0].x]
})

t('Undefined values throws', async() => {
  let error

  await sql`
    select ${ undefined } as x
  `.catch(x => error = x.code)

  return ['UNDEFINED_VALUE', error]
})

t('Transform undefined', async() => {
  const sql = postgres({ ...options, transform: { undefined: null } })
  return [null, (await sql`select ${ undefined } as x`)[0].x]
})

t('Transform undefined in array', async() => {
  const sql = postgres({ ...options, transform: { undefined: null } })
  return [null, (await sql`select * from (values ${ sql([undefined, undefined]) }) as x(x, y)`)[0].y]
})

t('Null sets to null', async() =>
  [null, (await sql`select ${ null } as x`)[0].x]
)

t('Throw syntax error', async() =>
  ['42601', (await sql`wat 1`.catch(x => x)).code]
)

t('Connect using uri', async() =>
  [true, await new Promise((resolve, reject) => {
    const sql = postgres('postgres://' + login.user + ':' + (login.pass || '') + '@localhost:5432/' + options.db, {
      idle_timeout
    })
    sql`select 1`.then(() => resolve(true), reject)
  })]
)

t('Options from uri with special characters in user and pass', async() => {
  const opt = postgres({ user: 'öla', pass: 'pass^word' }).options
  return [[opt.user, opt.pass].toString(), 'öla,pass^word']
})

t('Fail with proper error on no host', async() =>
  ['ECONNREFUSED', (await new Promise((resolve, reject) => {
    const sql = postgres('postgres://localhost:33333/' + options.db, {
      idle_timeout
    })
    sql`select 1`.then(reject, resolve)
  })).code]
)

t('Connect using SSL', async() =>
  [true, (await new Promise((resolve, reject) => {
    postgres({
      ssl: { rejectUnauthorized: false },
      idle_timeout
    })`select 1`.then(() => resolve(true), reject)
  }))]
)

t('Connect using SSL require', async() =>
  [true, (await new Promise((resolve, reject) => {
    postgres({
      ssl: 'require',
      idle_timeout
    })`select 1`.then(() => resolve(true), reject)
  }))]
)

t('Connect using SSL prefer', async() => {
  await exec('psql', ['-c', 'alter system set ssl=off'])
  await exec('psql', ['-c', 'select pg_reload_conf()'])

  const sql = postgres({
    ssl: 'prefer',
    idle_timeout
  })

  return [
    1, (await sql`select 1 as x`)[0].x,
    await exec('psql', ['-c', 'alter system set ssl=on']),
    await exec('psql', ['-c', 'select pg_reload_conf()'])
  ]
})

t('Reconnect using SSL', { timeout: 2 }, async() => {
  const sql = postgres({
    ssl: 'require',
    idle_timeout: 0.1
  })

  await sql`select 1`
  await delay(200)

  return [1, (await sql`select 1 as x`)[0].x]
})

t('Proper handling of non object Errors', async() => {
  const sql = postgres({ socket: () => { throw 'wat' } }) // eslint-disable-line

  return [
    'wat', await sql`select 1 as x`.catch(e => e.message)
  ]
})

t('Proper handling of null Errors', async() => {
  const sql = postgres({ socket: () => { throw null } }) // eslint-disable-line

  return [
    'null', await sql`select 1 as x`.catch(e => e.message)
  ]
})

t('Ensure reserve on connection throws proper error', async() => {
  const sql = postgres({ socket: () => { throw 'wat' }, idle_timeout }) // eslint-disable-line

  return [
    'wat', await sql.reserve().catch(e => e)
  ]
})

t('Login without password', async() => {
  return [true, (await postgres({ ...options, ...login })`select true as x`)[0].x]
})

t('Login using MD5', async() => {
  return [true, (await postgres({ ...options, ...login_md5 })`select true as x`)[0].x]
})

t('Login using scram-sha-256', async() => {
  return [true, (await postgres({ ...options, ...login_scram })`select true as x`)[0].x]
})

t('Parallel connections using scram-sha-256', {
  timeout: 2
}, async() => {
  const sql = postgres({ ...options, ...login_scram })
  return [true, (await Promise.all([
    sql`select true as x, pg_sleep(0.01)`,
    sql`select true as x, pg_sleep(0.01)`,
    sql`select true as x, pg_sleep(0.01)`
  ]))[0][0].x]
})

t('Support dynamic password function', async() => {
  return [true, (await postgres({
    ...options,
    ...login_scram,
    pass: () => 'postgres_js_test_scram'
  })`select true as x`)[0].x]
})

t('Support dynamic async password function', async() => {
  return [true, (await postgres({
    ...options,
    ...login_scram,
    pass: () => Promise.resolve('postgres_js_test_scram')
  })`select true as x`)[0].x]
})

t('Point type', async() => {
  const sql = postgres({
    ...options,
    types: {
      point: {
        to: 600,
        from: [600],
        serialize: ([x, y]) => '(' + x + ',' + y + ')',
        parse: (x) => x.slice(1, -1).split(',').map(x => +x)
      }
    }
  })

  await sql`create table test (x point)`
  await sql`insert into test (x) values (${ sql.types.point([10, 20]) })`
  return [20, (await sql`select x from test`)[0].x[1], await sql`drop table test`]
})

t('Point type array', async() => {
  const sql = postgres({
    ...options,
    types: {
      point: {
        to: 600,
        from: [600],
        serialize: ([x, y]) => '(' + x + ',' + y + ')',
        parse: (x) => x.slice(1, -1).split(',').map(x => +x)
      }
    }
  })

  await sql`create table test (x point[])`
  await sql`insert into test (x) values (${ sql.array([sql.types.point([10, 20]), sql.types.point([20, 30])]) })`
  return [30, (await sql`select x from test`)[0].x[1][1], await sql`drop table test`]
})

t('sql file', async() =>
  [1, (await sql.file(rel('select.sql')))[0].x]
)

t('sql file has forEach', async() => {
  let result
  await sql
    .file(rel('select.sql'), { cache: false })
    .forEach(({ x }) => result = x)

  return [1, result]
})

t('sql file throws', async() =>
  ['ENOENT', (await sql.file(rel('selectomondo.sql')).catch(x => x.code))]
)

t('sql file cached', async() => {
  await sql.file(rel('select.sql'))
  await delay(20)

  return [1, (await sql.file(rel('select.sql')))[0].x]
})

t('Parameters in file', async() => {
  const result = await sql.file(
    rel('select-param.sql'),
    ['hello']
  )
  return ['hello', result[0].x]
})

t('Connection ended promise', async() => {
  const sql = postgres(options)

  await sql.end()

  return [undefined, await sql.end()]
})

t('Connection ended timeout', async() => {
  const sql = postgres(options)

  await sql.end({ timeout: 10 })

  return [undefined, await sql.end()]
})

t('Connection ended error', async() => {
  const sql = postgres(options)
  await sql.end()
  return ['CONNECTION_ENDED', (await sql``.catch(x => x.code))]
})

t('Connection end does not cancel query', async() => {
  const sql = postgres(options)

  const promise = sql`select 1 as x`.execute()

  await sql.end()

  return [1, (await promise)[0].x]
})

t('Connection destroyed', async() => {
  const sql = postgres(options)
  process.nextTick(() => sql.end({ timeout: 0 }))
  return ['CONNECTION_DESTROYED', await sql``.catch(x => x.code)]
})

t('Connection destroyed with query before', async() => {
  const sql = postgres(options)
      , error = sql`select pg_sleep(0.2)`.catch(err => err.code)

  sql.end({ timeout: 0 })
  return ['CONNECTION_DESTROYED', await error]
})

t('transform column', async() => {
  const sql = postgres({
    ...options,
    transform: { column: x => x.split('').reverse().join('') }
  })

  await sql`create table test (hello_world int)`
  await sql`insert into test values (1)`
  return ['dlrow_olleh', Object.keys((await sql`select * from test`)[0])[0], await sql`drop table test`]
})

t('column toPascal', async() => {
  const sql = postgres({
    ...options,
    transform: { column: postgres.toPascal }
  })

  await sql`create table test (hello_world int)`
  await sql`insert into test values (1)`
  return ['HelloWorld', Object.keys((await sql`select * from test`)[0])[0], await sql`drop table test`]
})

t('column toCamel', async() => {
  const sql = postgres({
    ...options,
    transform: { column: postgres.toCamel }
  })

  await sql`create table test (hello_world int)`
  await sql`insert into test values (1)`
  return ['helloWorld', Object.keys((await sql`select * from test`)[0])[0], await sql`drop table test`]
})

t('column toKebab', async() => {
  const sql = postgres({
    ...options,
    transform: { column: postgres.toKebab }
  })

  await sql`create table test (hello_world int)`
  await sql`insert into test values (1)`
  return ['hello-world', Object.keys((await sql`select * from test`)[0])[0], await sql`drop table test`]
})

t('Transform nested json in arrays', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.camel
  })
  return ['aBcD', (await sql`select '[{"a_b":1},{"c_d":2}]'::jsonb as x`)[0].x.map(Object.keys).join('')]
})

t('Transform deeply nested json object in arrays', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.camel
  })
  return [
    'childObj_deeplyNestedObj_grandchildObj',
    (await sql`
      select '[{"nested_obj": {"child_obj": 2, "deeply_nested_obj": {"grandchild_obj": 3}}}]'::jsonb as x
    `)[0].x.map(x => {
      let result
      for (const key in x)
        result = [...Object.keys(x[key]), ...Object.keys(x[key].deeplyNestedObj)]
      return result
    })[0]
    .join('_')
  ]
})

t('Transform deeply nested json array in arrays', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.camel
  })
  return [
    'childArray_deeplyNestedArray_grandchildArray',
    (await sql`
      select '[{"nested_array": [{"child_array": 2, "deeply_nested_array": [{"grandchild_array":3}]}]}]'::jsonb AS x
    `)[0].x.map((x) => {
      let result
      for (const key in x)
        result = [...Object.keys(x[key][0]), ...Object.keys(x[key][0].deeplyNestedArray[0])]
      return result
    })[0]
    .join('_')
  ]
})

t('Bypass transform for json primitive', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.camel
  })

  const x = (
    await sql`select 'null'::json as a, 'false'::json as b, '"a"'::json as c, '1'::json as d`
  )[0]

  return [
    JSON.stringify({ a: null, b: false, c: 'a', d: 1 }),
    JSON.stringify(x)
  ]
})

t('Bypass transform for jsonb primitive', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.camel
  })

  const x = (
    await sql`select 'null'::jsonb as a, 'false'::jsonb as b, '"a"'::jsonb as c, '1'::jsonb as d`
  )[0]

  return [
    JSON.stringify({ a: null, b: false, c: 'a', d: 1 }),
    JSON.stringify(x)
  ]
})

t('unsafe', async() => {
  await sql`create table test (x int)`
  return [1, (await sql.unsafe('insert into test values ($1) returning *', [1]))[0].x, await sql`drop table test`]
})

t('unsafe simple', async() => {
  return [1, (await sql.unsafe('select 1 as x'))[0].x]
})

t('unsafe simple includes columns', async() => {
  return ['x', (await sql.unsafe('select 1 as x').values()).columns[0].name]
})

t('unsafe describe', async() => {
  const q = 'insert into test values (1)'
  await sql`create table test(a int unique)`
  await sql.unsafe(q).describe()
  const x = await sql.unsafe(q).describe()
  return [
    q,
    x.string,
    await sql`drop table test`
  ]
})

t('simple query using unsafe with multiple statements', async() => {
  return [
    '1,2',
    (await sql.unsafe('select 1 as x;select 2 as x')).map(x => x[0].x).join()
  ]
})

t('simple query using simple() with multiple statements', async() => {
  return [
    '1,2',
    (await sql`select 1 as x;select 2 as x`.simple()).map(x => x[0].x).join()
  ]
})

t('listen and notify', async() => {
  const sql = postgres(options)
  const channel = 'hello'
  const result = await new Promise(async r => {
    await sql.listen(channel, r)
    sql.notify(channel, 'works')
  })

  return [
    'works',
    result,
    sql.end()
  ]
})

t('double listen', async() => {
  const sql = postgres(options)
      , channel = 'hello'

  let count = 0

  await new Promise((resolve, reject) =>
    sql.listen(channel, resolve)
    .then(() => sql.notify(channel, 'world'))
    .catch(reject)
  ).then(() => count++)

  await new Promise((resolve, reject) =>
    sql.listen(channel, resolve)
    .then(() => sql.notify(channel, 'world'))
    .catch(reject)
  ).then(() => count++)

  // for coverage
  sql.listen('weee', () => { /* noop */ }).then(sql.end)

  return [2, count]
})

t('multiple listeners work after a reconnect', async() => {
  const sql = postgres(options)
      , xs = []

  const s1 = await sql.listen('test', x => xs.push('1', x))
  await sql.listen('test', x => xs.push('2', x))
  await sql.notify('test', 'a')
  await delay(50)
  await sql`select pg_terminate_backend(${ s1.state.pid })`
  await delay(200)
  await sql.notify('test', 'b')
  await delay(50)
  sql.end()

  return ['1a2a1b2b', xs.join('')]
})

t('listen and notify with weird name', async() => {
  const sql = postgres(options)
  const channel = 'wat-;.ø.§'
  const result = await new Promise(async r => {
    const { unlisten } = await sql.listen(channel, r)
    sql.notify(channel, 'works')
    await delay(50)
    await unlisten()
  })

  return [
    'works',
    result,
    sql.end()
  ]
})

t('listen and notify with upper case', async() => {
  const sql = postgres(options)
  const channel = 'withUpperChar'
  const result = await new Promise(async r => {
    await sql.listen(channel, r)
    sql.notify(channel, 'works')
  })

  return [
    'works',
    result,
    sql.end()
  ]
})

t('listen reconnects', { timeout: 2 }, async() => {
  const sql = postgres(options)
      , resolvers = {}
      , a = new Promise(r => resolvers.a = r)
      , b = new Promise(r => resolvers.b = r)

  let connects = 0

  const { state: { pid } } = await sql.listen(
    'test',
    x => x in resolvers && resolvers[x](),
    () => connects++
  )
  await sql.notify('test', 'a')
  await a
  await sql`select pg_terminate_backend(${ pid })`
  await delay(100)
  await sql.notify('test', 'b')
  await b
  sql.end()
  return [connects, 2]
})

t('listen result reports correct connection state after reconnection', async() => {
  const sql = postgres(options)
      , xs = []

  const result = await sql.listen('test', x => xs.push(x))
  const initialPid = result.state.pid
  await sql.notify('test', 'a')
  await sql`select pg_terminate_backend(${ initialPid })`
  await delay(50)
  sql.end()

  return [result.state.pid !== initialPid, true]
})

t('unlisten removes subscription', async() => {
  const sql = postgres(options)
      , xs = []

  const { unlisten } = await sql.listen('test', x => xs.push(x))
  await sql.notify('test', 'a')
  await delay(50)
  await unlisten()
  await sql.notify('test', 'b')
  await delay(50)
  sql.end()

  return ['a', xs.join('')]
})

t('listen after unlisten', async() => {
  const sql = postgres(options)
      , xs = []

  const { unlisten } = await sql.listen('test', x => xs.push(x))
  await sql.notify('test', 'a')
  await delay(50)
  await unlisten()
  await sql.notify('test', 'b')
  await delay(50)
  await sql.listen('test', x => xs.push(x))
  await sql.notify('test', 'c')
  await delay(50)
  sql.end()

  return ['ac', xs.join('')]
})

t('multiple listeners and unlisten one', async() => {
  const sql = postgres(options)
      , xs = []

  await sql.listen('test', x => xs.push('1', x))
  const s2 = await sql.listen('test', x => xs.push('2', x))
  await sql.notify('test', 'a')
  await delay(50)
  await s2.unlisten()
  await sql.notify('test', 'b')
  await delay(50)
  sql.end()

  return ['1a2a1b', xs.join('')]
})

t('responds with server parameters (application_name)', async() =>
  ['postgres.js', await new Promise((resolve, reject) => postgres({
    ...options,
    onparameter: (k, v) => k === 'application_name' && resolve(v)
  })`select 1`.catch(reject))]
)

t('has server parameters', async() => {
  return ['postgres.js', (await sql`select 1`.then(() => sql.parameters.application_name))]
})

t('big query body', { timeout: 2 }, async() => {
  await sql`create table test (x int)`
  return [50000, (await sql`insert into test ${
    sql([...Array(50000).keys()].map(x => ({ x })))
  }`).count, await sql`drop table test`]
})

t('Throws if more than 65534 parameters', async() => {
  await sql`create table test (x int)`
  return ['MAX_PARAMETERS_EXCEEDED', (await sql`insert into test ${
    sql([...Array(65535).keys()].map(x => ({ x })))
  }`.catch(e => e.code)), await sql`drop table test`]
})

t('let postgres do implicit cast of unknown types', async() => {
  await sql`create table test (x timestamp with time zone)`
  const [{ x }] = await sql`insert into test values (${ new Date().toISOString() }) returning *`
  return [true, x instanceof Date, await sql`drop table test`]
})

t('only allows one statement', async() =>
  ['42601', await sql`select 1; select 2`.catch(e => e.code)]
)

t('await sql() throws not tagged error', async() => {
  let error
  try {
    await sql('select 1')
  } catch (e) {
    error = e.code
  }
  return ['NOT_TAGGED_CALL', error]
})

t('sql().then throws not tagged error', async() => {
  let error
  try {
    sql('select 1').then(() => { /* noop */ })
  } catch (e) {
    error = e.code
  }
  return ['NOT_TAGGED_CALL', error]
})

t('sql().catch throws not tagged error', async() => {
  let error
  try {
    await sql('select 1')
  } catch (e) {
    error = e.code
  }
  return ['NOT_TAGGED_CALL', error]
})

t('sql().finally throws not tagged error', async() => {
  let error
  try {
    sql('select 1').finally(() => { /* noop */ })
  } catch (e) {
    error = e.code
  }
  return ['NOT_TAGGED_CALL', error]
})

t('little bobby tables', async() => {
  const name = 'Robert\'); DROP TABLE students;--'

  await sql`create table students (name text, age int)`
  await sql`insert into students (name) values (${ name })`

  return [
    name, (await sql`select name from students`)[0].name,
    await sql`drop table students`
  ]
})

t('Connection errors are caught using begin()', {
  timeout: 2
}, async() => {
  let error
  try {
    const sql = postgres({ host: 'localhost', port: 1 })

    await sql.begin(async(sql) => {
      await sql`insert into test (label, value) values (${1}, ${2})`
    })
  } catch (err) {
    error = err
  }

  return [
    true,
    error.code === 'ECONNREFUSED' ||
    error.message === 'Connection refused (os error 61)'
  ]
})

t('dynamic table name', async() => {
  await sql`create table test(a int)`
  return [
    0, (await sql`select * from ${ sql('test') }`).count,
    await sql`drop table test`
  ]
})

t('dynamic schema name', async() => {
  await sql`create table test(a int)`
  return [
    0, (await sql`select * from ${ sql('public') }.test`).count,
    await sql`drop table test`
  ]
})

t('dynamic schema and table name', async() => {
  await sql`create table test(a int)`
  return [
    0, (await sql`select * from ${ sql('public.test') }`).count,
    await sql`drop table test`
  ]
})

t('dynamic column name', async() => {
  return ['!not_valid', Object.keys((await sql`select 1 as ${ sql('!not_valid') }`)[0])[0]]
})

t('dynamic select as', async() => {
  return ['2', (await sql`select ${ sql({ a: 1, b: 2 }) }`)[0].b]
})

t('dynamic select as pluck', async() => {
  return [undefined, (await sql`select ${ sql({ a: 1, b: 2 }, 'a') }`)[0].b]
})

t('dynamic insert', async() => {
  await sql`create table test (a int, b text)`
  const x = { a: 42, b: 'the answer' }

  return ['the answer', (await sql`insert into test ${ sql(x) } returning *`)[0].b, await sql`drop table test`]
})

t('dynamic insert pluck', async() => {
  await sql`create table test (a int, b text)`
  const x = { a: 42, b: 'the answer' }

  return [null, (await sql`insert into test ${ sql(x, 'a') } returning *`)[0].b, await sql`drop table test`]
})

t('dynamic in with empty array', async() => {
  await sql`create table test (a int)`
  await sql`insert into test values (1)`
  return [
    (await sql`select * from test where null in ${ sql([]) }`).count,
    0,
    await sql`drop table test`
  ]
})

t('dynamic in after insert', async() => {
  await sql`create table test (a int, b text)`
  const [{ x }] = await sql`
    with x as (
      insert into test values (1, 'hej')
      returning *
    )
    select 1 in ${ sql([1, 2, 3]) } as x from x
  `
  return [
    true, x,
    await sql`drop table test`
  ]
})

t('array insert', async() => {
  await sql`create table test (a int, b int)`
  return [2, (await sql`insert into test (a, b) values ${ sql([1, 2]) } returning *`)[0].b, await sql`drop table test`]
})

t('where parameters in()', async() => {
  await sql`create table test (x text)`
  await sql`insert into test values ('a')`
  return [
    (await sql`select * from test where x in ${ sql(['a', 'b', 'c']) }`)[0].x,
    'a',
    await sql`drop table test`
  ]
})

t('where parameters in() values before', async() => {
  return [2, (await sql`
    with rows as (
      select * from (values (1), (2), (3), (4)) as x(a)
    )
    select * from rows where a in ${ sql([3, 4]) }
  `).count]
})

t('dynamic multi row insert', async() => {
  await sql`create table test (a int, b text)`
  const x = { a: 42, b: 'the answer' }

  return [
    'the answer',
    (await sql`insert into test ${ sql([x, x]) } returning *`)[1].b, await sql`drop table test`
  ]
})

t('dynamic update', async() => {
  await sql`create table test (a int, b text)`
  await sql`insert into test (a, b) values (17, 'wrong')`

  return [
    'the answer',
    (await sql`update test set ${ sql({ a: 42, b: 'the answer' }) } returning *`)[0].b, await sql`drop table test`
  ]
})

t('dynamic update pluck', async() => {
  await sql`create table test (a int, b text)`
  await sql`insert into test (a, b) values (17, 'wrong')`

  return [
    'wrong',
    (await sql`update test set ${ sql({ a: 42, b: 'the answer' }, 'a') } returning *`)[0].b, await sql`drop table test`
  ]
})

t('dynamic select array', async() => {
  await sql`create table test (a int, b text)`
  await sql`insert into test (a, b) values (42, 'yay')`
  return ['yay', (await sql`select ${ sql(['a', 'b']) } from test`)[0].b, await sql`drop table test`]
})

t('dynamic returning array', async() => {
  await sql`create table test (a int, b text)`
  return [
    'yay',
    (await sql`insert into test (a, b) values (42, 'yay') returning ${ sql(['a', 'b']) }`)[0].b,
    await sql`drop table test`
  ]
})

t('dynamic select args', async() => {
  await sql`create table test (a int, b text)`
  await sql`insert into test (a, b) values (42, 'yay')`
  return ['yay', (await sql`select ${ sql('a', 'b') } from test`)[0].b, await sql`drop table test`]
})

t('dynamic values single row', async() => {
  const [{ b }] = await sql`
    select * from (values ${ sql(['a', 'b', 'c']) }) as x(a, b, c)
  `

  return ['b', b]
})

t('dynamic values multi row', async() => {
  const [, { b }] = await sql`
    select * from (values ${ sql([['a', 'b', 'c'], ['a', 'b', 'c']]) }) as x(a, b, c)
  `

  return ['b', b]
})

t('connection parameters', async() => {
  const sql = postgres({
    ...options,
    connection: {
      'some.var': 'yay'
    }
  })

  return ['yay', (await sql`select current_setting('some.var') as x`)[0].x]
})

t('Multiple queries', async() => {
  const sql = postgres(options)

  return [4, (await Promise.all([
    sql`select 1`,
    sql`select 2`,
    sql`select 3`,
    sql`select 4`
  ])).length]
})

t('Multiple statements', async() =>
  [2, await sql.unsafe(`
    select 1 as x;
    select 2 as a;
  `).then(([, [x]]) => x.a)]
)

t('throws correct error when authentication fails', async() => {
  const sql = postgres({
    ...options,
    ...login_md5,
    pass: 'wrong'
  })
  return ['28P01', await sql`select 1`.catch(e => e.code)]
})

t('notice', async() => {
  let notice
  const log = console.log // eslint-disable-line
  console.log = function(x) { // eslint-disable-line
    notice = x
  }

  const sql = postgres(options)

  await sql`create table if not exists users()`
  await sql`create table if not exists users()`

  console.log = log // eslint-disable-line

  return ['NOTICE', notice.severity]
})

t('notice hook', async() => {
  let notice
  const sql = postgres({
    ...options,
    onnotice: x => notice = x
  })

  await sql`create table if not exists users()`
  await sql`create table if not exists users()`

  return ['NOTICE', notice.severity]
})

t('bytea serializes and parses', async() => {
  const buf = Buffer.from('wat')

  await sql`create table test (x bytea)`
  await sql`insert into test values (${ buf })`

  return [
    buf.toString(),
    (await sql`select x from test`)[0].x.toString(),
    await sql`drop table test`
  ]
})

t('forEach', async() => {
  let result
  await sql`select 1 as x`.forEach(({ x }) => result = x)
  return [1, result]
})

t('forEach returns empty array', async() => {
  return [0, (await sql`select 1 as x`.forEach(() => { /* noop */ })).length]
})

t('Cursor', async() => {
  const order = []
  await sql`select 1 as x union select 2 as x`.cursor(async([x]) => {
    order.push(x.x + 'a')
    await delay(100)
    order.push(x.x + 'b')
  })
  return ['1a1b2a2b', order.join('')]
})

t('Unsafe cursor', async() => {
  const order = []
  await sql.unsafe('select 1 as x union select 2 as x').cursor(async([x]) => {
    order.push(x.x + 'a')
    await delay(100)
    order.push(x.x + 'b')
  })
  return ['1a1b2a2b', order.join('')]
})

t('Cursor custom n', async() => {
  const order = []
  await sql`select * from generate_series(1,20)`.cursor(10, async(x) => {
    order.push(x.length)
  })
  return ['10,10', order.join(',')]
})

t('Cursor custom with rest n', async() => {
  const order = []
  await sql`select * from generate_series(1,20)`.cursor(11, async(x) => {
    order.push(x.length)
  })
  return ['11,9', order.join(',')]
})

t('Cursor custom with less results than batch size', async() => {
  const order = []
  await sql`select * from generate_series(1,20)`.cursor(21, async(x) => {
    order.push(x.length)
  })
  return ['20', order.join(',')]
})

t('Cursor cancel', async() => {
  let result
  await sql`select * from generate_series(1,10) as x`.cursor(async([{ x }]) => {
    result = x
    return sql.CLOSE
  })
  return [1, result]
})

t('Cursor throw', async() => {
  const order = []
  await sql`select 1 as x union select 2 as x`.cursor(async([x]) => {
    order.push(x.x + 'a')
    await delay(100)
    throw new Error('watty')
  }).catch(() => order.push('err'))
  return ['1aerr', order.join('')]
})

t('Cursor error', async() => [
  '42601',
  await sql`wat`.cursor(() => { /* noop */ }).catch((err) => err.code)
])

t('Multiple Cursors', { timeout: 2 }, async() => {
  const result = []
  await sql.begin(async sql => [
    await sql`select 1 as cursor, x from generate_series(1,4) as x`.cursor(async([row]) => {
      result.push(row.x)
      await new Promise(r => setTimeout(r, 20))
    }),
    await sql`select 2 as cursor, x from generate_series(101,104) as x`.cursor(async([row]) => {
      result.push(row.x)
      await new Promise(r => setTimeout(r, 10))
    })
  ])

  return ['1,2,3,4,101,102,103,104', result.join(',')]
})

t('Cursor as async iterator', async() => {
  const order = []
  for await (const [x] of sql`select generate_series(1,2) as x;`.cursor()) {
    order.push(x.x + 'a')
    await delay(10)
    order.push(x.x + 'b')
  }

  return ['1a1b2a2b', order.join('')]
})

t('Cursor as async iterator with break', async() => {
  const order = []
  for await (const xs of sql`select generate_series(1,2) as x;`.cursor()) {
    order.push(xs[0].x + 'a')
    await delay(10)
    order.push(xs[0].x + 'b')
    break
  }

  return ['1a1b', order.join('')]
})

t('Async Iterator Unsafe cursor', async() => {
  const order = []
  for await (const [x] of sql.unsafe('select 1 as x union select 2 as x').cursor()) {
    order.push(x.x + 'a')
    await delay(10)
    order.push(x.x + 'b')
  }
  return ['1a1b2a2b', order.join('')]
})

t('Async Iterator Cursor custom n', async() => {
  const order = []
  for await (const x of sql`select * from generate_series(1,20)`.cursor(10))
    order.push(x.length)

  return ['10,10', order.join(',')]
})

t('Async Iterator Cursor custom with rest n', async() => {
  const order = []
  for await (const x of sql`select * from generate_series(1,20)`.cursor(11))
    order.push(x.length)

  return ['11,9', order.join(',')]
})

t('Async Iterator Cursor custom with less results than batch size', async() => {
  const order = []
  for await (const x of sql`select * from generate_series(1,20)`.cursor(21))
    order.push(x.length)
  return ['20', order.join(',')]
})

t('Transform row', async() => {
  const sql = postgres({
    ...options,
    transform: { row: () => 1 }
  })

  return [1, (await sql`select 'wat'`)[0]]
})

t('Transform row forEach', async() => {
  let result
  const sql = postgres({
    ...options,
    transform: { row: () => 1 }
  })

  await sql`select 1`.forEach(x => result = x)

  return [1, result]
})

t('Transform value', async() => {
  const sql = postgres({
    ...options,
    transform: { value: () => 1 }
  })

  return [1, (await sql`select 'wat' as x`)[0].x]
})

t('Transform columns from', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.fromCamel
  })
  await sql`create table test (a_test int, b_test text)`
  await sql`insert into test ${ sql([{ aTest: 1, bTest: 1 }]) }`
  await sql`update test set ${ sql({ aTest: 2, bTest: 2 }) }`
  return [
    2,
    (await sql`select ${ sql('aTest', 'bTest') } from test`)[0].a_test,
    await sql`drop table test`
  ]
})

t('Transform columns to', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.toCamel
  })
  await sql`create table test (a_test int, b_test text)`
  await sql`insert into test ${ sql([{ a_test: 1, b_test: 1 }]) }`
  await sql`update test set ${ sql({ a_test: 2, b_test: 2 }) }`
  return [
    2,
    (await sql`select a_test, b_test from test`)[0].aTest,
    await sql`drop table test`
  ]
})

t('Transform columns from and to', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.camel
  })
  await sql`create table test (a_test int, b_test text)`
  await sql`insert into test ${ sql([{ aTest: 1, bTest: 1 }]) }`
  await sql`update test set ${ sql({ aTest: 2, bTest: 2 }) }`
  return [
    2,
    (await sql`select ${ sql('aTest', 'bTest') } from test`)[0].aTest,
    await sql`drop table test`
  ]
})

t('Transform columns from and to (legacy)', async() => {
  const sql = postgres({
    ...options,
    transform: {
      column: {
        to: postgres.fromCamel,
        from: postgres.toCamel
      }
    }
  })
  await sql`create table test (a_test int, b_test text)`
  await sql`insert into test ${ sql([{ aTest: 1, bTest: 1 }]) }`
  await sql`update test set ${ sql({ aTest: 2, bTest: 2 }) }`
  return [
    2,
    (await sql`select ${ sql('aTest', 'bTest') } from test`)[0].aTest,
    await sql`drop table test`
  ]
})

t('Unix socket', async() => {
  const sql = postgres({
    ...options,
    host: process.env.PGSOCKET || '/tmp' // eslint-disable-line
  })

  return [1, (await sql`select 1 as x`)[0].x]
})

t('Big result', async() => {
  return [100000, (await sql`select * from generate_series(1, 100000)`).count]
})

t('Debug', async() => {
  let result
  const sql = postgres({
    ...options,
    debug: (connection_id, str) => result = str
  })

  await sql`select 1`

  return ['select 1', result]
})

t('bigint is returned as String', async() => [
  'string',
  typeof (await sql`select 9223372036854777 as x`)[0].x
])

t('int is returned as Number', async() => [
  'number',
  typeof (await sql`select 123 as x`)[0].x
])

t('numeric is returned as string', async() => [
  'string',
  typeof (await sql`select 1.2 as x`)[0].x
])

t('Async stack trace', async() => {
  const sql = postgres({ ...options, debug: false })
  return [
    parseInt(new Error().stack.split('\n')[1].match(':([0-9]+):')[1]) + 1,
    parseInt(await sql`error`.catch(x => x.stack.split('\n').pop().match(':([0-9]+):')[1]))
  ]
})

t('Debug has long async stack trace', async() => {
  const sql = postgres({ ...options, debug: true })

  return [
    'watyo',
    await yo().catch(x => x.stack.match(/wat|yo/g).join(''))
  ]

  function yo() {
    return wat()
  }

  function wat() {
    return sql`error`
  }
})

t('Error contains query string', async() => [
  'selec 1',
  (await sql`selec 1`.catch(err => err.query))
])

t('Error contains query serialized parameters', async() => [
  1,
  (await sql`selec ${ 1 }`.catch(err => err.parameters[0]))
])

t('Error contains query raw parameters', async() => [
  1,
  (await sql`selec ${ 1 }`.catch(err => err.args[0]))
])

t('Query and parameters on errorare not enumerable if debug is not set', async() => {
  const sql = postgres({ ...options, debug: false })

  return [
    false,
    (await sql`selec ${ 1 }`.catch(err => err.propertyIsEnumerable('parameters') || err.propertyIsEnumerable('query')))
  ]
})

t('Query and parameters are enumerable if debug is set', async() => {
  const sql = postgres({ ...options, debug: true })

  return [
    true,
    (await sql`selec ${ 1 }`.catch(err => err.propertyIsEnumerable('parameters') && err.propertyIsEnumerable('query')))
  ]
})

t('connect_timeout', { timeout: 20 }, async() => {
  const connect_timeout = 0.2
  const server = net.createServer()
  server.listen()
  const sql = postgres({ port: server.address().port, host: '127.0.0.1', connect_timeout })
  const start = Date.now()
  let end
  await sql`select 1`.catch((e) => {
    if (e.code !== 'CONNECT_TIMEOUT')
      throw e
    end = Date.now()
  })
  server.close()
  return [connect_timeout, Math.floor((end - start) / 100) / 10]
})

t('connect_timeout throws proper error', async() => [
  'CONNECT_TIMEOUT',
  await postgres({
    ...options,
    ...login_scram,
    connect_timeout: 0.001
  })`select 1`.catch(e => e.code)
])

t('connect_timeout error message includes host:port', { timeout: 20 }, async() => {
  const connect_timeout = 0.2
  const server = net.createServer()
  server.listen()
  const sql = postgres({ port: server.address().port, host: '127.0.0.1', connect_timeout })
  const port = server.address().port
  let err
  await sql`select 1`.catch((e) => {
    if (e.code !== 'CONNECT_TIMEOUT')
      throw e
    err = e.message
  })
  server.close()
  return [['write CONNECT_TIMEOUT 127.0.0.1:', port].join(''), err]
})

t('requests works after single connect_timeout', async() => {
  let first = true

  const sql = postgres({
    ...options,
    ...login_scram,
    connect_timeout: { valueOf() { return first ? (first = false, 0.0001) : 1 } }
  })

  return [
    'CONNECT_TIMEOUT,,1',
    [
      await sql`select 1 as x`.then(() => 'success', x => x.code),
      await delay(10),
      (await sql`select 1 as x`)[0].x
    ].join(',')
  ]
})

t('Postgres errors are of type PostgresError', async() =>
  [true, (await sql`bad keyword`.catch(e => e)) instanceof sql.PostgresError]
)

t('Result has columns spec', async() =>
  ['x', (await sql`select 1 as x`).columns[0].name]
)

t('forEach has result as second argument', async() => {
  let x
  await sql`select 1 as x`.forEach((_, result) => x = result)
  return ['x', x.columns[0].name]
})

t('Result as arrays', async() => {
  const sql = postgres({
    ...options,
    transform: {
      row: x => Object.values(x)
    }
  })

  return ['1,2', (await sql`select 1 as a, 2 as b`)[0].join(',')]
})

t('Insert empty array', async() => {
  await sql`create table tester (ints int[])`
  return [
    Array.isArray((await sql`insert into tester (ints) values (${ sql.array([]) }) returning *`)[0].ints),
    true,
    await sql`drop table tester`
  ]
})

t('Insert array in sql()', async() => {
  await sql`create table tester (ints int[])`
  return [
    Array.isArray((await sql`insert into tester ${ sql({ ints: sql.array([]) }) } returning *`)[0].ints),
    true,
    await sql`drop table tester`
  ]
})

t('Automatically creates prepared statements', async() => {
  const sql = postgres(options)
  const result = await sql`select * from pg_prepared_statements`
  return [true, result.some(x => x.name = result.statement.name)]
})

t('no_prepare: true disables prepared statements (deprecated)', async() => {
  const sql = postgres({ ...options, no_prepare: true })
  const result = await sql`select * from pg_prepared_statements`
  return [false, result.some(x => x.name = result.statement.name)]
})

t('prepare: false disables prepared statements', async() => {
  const sql = postgres({ ...options, prepare: false })
  const result = await sql`select * from pg_prepared_statements`
  return [false, result.some(x => x.name = result.statement.name)]
})

t('prepare: true enables prepared statements', async() => {
  const sql = postgres({ ...options, prepare: true })
  const result = await sql`select * from pg_prepared_statements`
  return [true, result.some(x => x.name = result.statement.name)]
})

t('prepares unsafe query when "prepare" option is true', async() => {
  const sql = postgres({ ...options, prepare: true })
  const result = await sql.unsafe('select * from pg_prepared_statements where name <> $1', ['bla'], { prepare: true })
  return [true, result.some(x => x.name = result.statement.name)]
})

t('does not prepare unsafe query by default', async() => {
  const sql = postgres({ ...options, prepare: true })
  const result = await sql.unsafe('select * from pg_prepared_statements where name <> $1', ['bla'])
  return [false, result.some(x => x.name = result.statement.name)]
})

t('Recreate prepared statements on transformAssignedExpr error', { timeout: 1 }, async() => {
  const insert = () => sql`insert into test (name) values (${ '1' }) returning name`
  await sql`create table test (name text)`
  await insert()
  await sql`alter table test alter column name type int using name::integer`
  return [
    1,
    (await insert())[0].name,
    await sql`drop table test`
  ]
})

t('Throws correct error when retrying in transactions', async() => {
  await sql`create table test(x int)`
  const error = await sql.begin(sql => sql`insert into test (x) values (${ false })`).catch(e => e)
  return [
    error.code,
    '42804',
    sql`drop table test`
  ]
})

t('Recreate prepared statements on RevalidateCachedQuery error', async() => {
  const select = () => sql`select name from test`
  await sql`create table test (name text)`
  await sql`insert into test values ('1')`
  await select()
  await sql`alter table test alter column name type int using name::integer`
  return [
    1,
    (await select())[0].name,
    await sql`drop table test`
  ]
})

t('Properly throws routine error on not prepared statements', async() => {
  await sql`create table x (x text[])`
  const { routine } = await sql.unsafe(`
    insert into x(x) values (('a', 'b'))
  `).catch(e => e)

  return ['transformAssignedExpr', routine, await sql`drop table x`]
})

t('Properly throws routine error on not prepared statements in transaction', async() => {
  const { routine } = await sql.begin(sql => [
    sql`create table x (x text[])`,
    sql`insert into x(x) values (('a', 'b'))`
  ]).catch(e => e)

  return ['transformAssignedExpr', routine]
})

t('Properly throws routine error on not prepared statements using file', async() => {
  const { routine } = await sql.unsafe(`
    create table x (x text[]);
    insert into x(x) values (('a', 'b'));
  `, { prepare: true }).catch(e => e)

  return ['transformAssignedExpr', routine]
})

t('Catches connection config errors', async() => {
  const sql = postgres({ ...options, user: { toString: () => { throw new Error('wat') } }, database: 'prut' })

  return [
    'wat',
    await sql`select 1`.catch((e) => e.message)
  ]
})

t('Catches connection config errors with end', async() => {
  const sql = postgres({ ...options, user: { toString: () => { throw new Error('wat') } }, database: 'prut' })

  return [
    'wat',
    await sql`select 1`.catch((e) => e.message),
    await sql.end()
  ]
})

t('Catches query format errors', async() => [
  'wat',
  await sql.unsafe({ toString: () => { throw new Error('wat') } }).catch((e) => e.message)
])

t('Multiple hosts', {
  timeout: 1
}, async() => {
  const s1 = postgres({ idle_timeout })
      , s2 = postgres({ idle_timeout, port: 5433 })
      , sql = postgres('postgres://localhost:5432,localhost:5433', { idle_timeout, max: 1 })
      , result = []

  const id1 = (await s1`select system_identifier as x from pg_control_system()`)[0].x
  const id2 = (await s2`select system_identifier as x from pg_control_system()`)[0].x

  const x1 = await sql`select 1`
  result.push((await sql`select system_identifier as x from pg_control_system()`)[0].x)
  await s1`select pg_terminate_backend(${ x1.state.pid }::int)`
  await delay(50)

  const x2 = await sql`select 1`
  result.push((await sql`select system_identifier as x from pg_control_system()`)[0].x)
  await s2`select pg_terminate_backend(${ x2.state.pid }::int)`
  await delay(50)

  result.push((await sql`select system_identifier as x from pg_control_system()`)[0].x)

  return [[id1, id2, id1].join(','), result.join(',')]
})

t('Escaping supports schemas and tables', async() => {
  await sql`create schema a`
  await sql`create table a.b (c int)`
  await sql`insert into a.b (c) values (1)`
  return [
    1,
    (await sql`select ${ sql('a.b.c') } from a.b`)[0].c,
    await sql`drop table a.b`,
    await sql`drop schema a`
  ]
})

t('Raw method returns rows as arrays', async() => {
  const [x] = await sql`select 1`.raw()
  return [
    Array.isArray(x),
    true
  ]
})

t('Raw method returns values unparsed as Buffer', async() => {
  const [[x]] = await sql`select 1`.raw()
  return [
    x instanceof Uint8Array,
    true
  ]
})

t('Array returns rows as arrays of columns', async() => {
  return [(await sql`select 1`.values())[0][0], 1]
})

t('Copy read', async() => {
  const result = []

  await sql`create table test (x int)`
  await sql`insert into test select * from generate_series(1,10)`
  const readable = await sql`copy test to stdout`.readable()
  readable.on('data', x => result.push(x))
  await new Promise(r => readable.on('end', r))

  return [
    result.length,
    10,
    await sql`drop table test`
  ]
})

t('Copy write', { timeout: 2 }, async() => {
  await sql`create table test (x int)`
  const writable = await sql`copy test from stdin`.writable()

  writable.write('1\n')
  writable.write('1\n')
  writable.end()

  await new Promise(r => writable.on('finish', r))

  return [
    (await sql`select 1 from test`).length,
    2,
    await sql`drop table test`
  ]
})

t('Copy write as first', async() => {
  await sql`create table test (x int)`
  const first = postgres(options)
  const writable = await first`COPY test FROM STDIN WITH(FORMAT csv, HEADER false, DELIMITER ',')`.writable()
  writable.write('1\n')
  writable.write('1\n')
  writable.end()

  await new Promise(r => writable.on('finish', r))

  return [
    (await sql`select 1 from test`).length,
    2,
    await sql`drop table test`
  ]
})

t('Copy from file', async() => {
  await sql`create table test (x int, y int, z int)`
  await new Promise(async r => fs
    .createReadStream(rel('copy.csv'))
    .pipe(await sql`copy test from stdin`.writable())
    .on('finish', r)
  )

  return [
    JSON.stringify(await sql`select * from test`),
    '[{"x":1,"y":2,"z":3},{"x":4,"y":5,"z":6}]',
    await sql`drop table test`
  ]
})

t('Copy from works in transaction', async() => {
  await sql`create table test(x int)`
  const xs = await sql.begin(async sql => {
    (await sql`copy test from stdin`.writable()).end('1\n2')
    await delay(20)
    return sql`select 1 from test`
  })

  return [
    xs.length,
    2,
    await sql`drop table test`
  ]
})

t('Copy from abort', async() => {
  const sql = postgres(options)
  const readable = fs.createReadStream(rel('copy.csv'))

  await sql`create table test (x int, y int, z int)`
  await sql`TRUNCATE TABLE test`

  const writable = await sql`COPY test FROM STDIN`.writable()

  let aborted

  readable
    .pipe(writable)
    .on('error', (err) => aborted = err)

  writable.destroy(new Error('abort'))
  await sql.end()

  return [
    'abort',
    aborted.message,
    await postgres(options)`drop table test`
  ]
})

t('multiple queries before connect', async() => {
  const sql = postgres({ ...options, max: 2 })
  const xs = await Promise.all([
    sql`select 1 as x`,
    sql`select 2 as x`,
    sql`select 3 as x`,
    sql`select 4 as x`
  ])

  return [
    '1,2,3,4',
    xs.map(x => x[0].x).join()
  ]
})

t('subscribe', { timeout: 2 }, async() => {
  const sql = postgres({
    database: 'postgres_js_test',
    publications: 'alltables'
  })

  await sql.unsafe('create publication alltables for all tables')

  const result = []

  const { unsubscribe } = await sql.subscribe('*', (row, { command, old }) => {
    result.push(command, row.name, row.id, old && old.name, old && old.id)
  })

  await sql`
    create table test (
      id serial primary key,
      name text
    )
  `

  await sql`alter table test replica identity default`
  await sql`insert into test (name) values ('Murray')`
  await sql`update test set name = 'Rothbard'`
  await sql`update test set id = 2`
  await sql`delete from test`
  await sql`alter table test replica identity full`
  await sql`insert into test (name) values ('Murray')`
  await sql`update test set name = 'Rothbard'`
  await sql`delete from test`
  await delay(10)
  await unsubscribe()
  await sql`insert into test (name) values ('Oh noes')`
  await delay(10)
  return [
    'insert,Murray,1,,,update,Rothbard,1,,,update,Rothbard,2,,1,delete,,2,,,insert,Murray,2,,,update,Rothbard,2,Murray,2,delete,Rothbard,2,,', // eslint-disable-line
    result.join(','),
    await sql`drop table test`,
    await sql`drop publication alltables`,
    await sql.end()
  ]
})

t('subscribe with transform', { timeout: 2 }, async() => {
  const sql = postgres({
    transform: {
      column: {
        from: postgres.toCamel,
        to: postgres.fromCamel
      }
    },
    database: 'postgres_js_test',
    publications: 'alltables'
  })

  await sql.unsafe('create publication alltables for all tables')

  const result = []

  const { unsubscribe } = await sql.subscribe('*', (row, { command, old }) =>
    result.push(command, row.nameInCamel || row.id, old && old.nameInCamel)
  )

  await sql`
    create table test (
      id serial primary key,
      name_in_camel text
    )
  `

  await sql`insert into test (name_in_camel) values ('Murray')`
  await sql`update test set name_in_camel = 'Rothbard'`
  await sql`delete from test`
  await sql`alter table test replica identity full`
  await sql`insert into test (name_in_camel) values ('Murray')`
  await sql`update test set name_in_camel = 'Rothbard'`
  await sql`delete from test`
  await delay(10)
  await unsubscribe()
  await sql`insert into test (name_in_camel) values ('Oh noes')`
  await delay(10)
  return [
    'insert,Murray,,update,Rothbard,,delete,1,,insert,Murray,,update,Rothbard,Murray,delete,Rothbard,',
    result.join(','),
    await sql`drop table test`,
    await sql`drop publication alltables`,
    await sql.end()
  ]
})

t('subscribe reconnects and calls onsubscribe', { timeout: 4 }, async() => {
  const sql = postgres({
    database: 'postgres_js_test',
    publications: 'alltables',
    fetch_types: false
  })

  await sql.unsafe('create publication alltables for all tables')

  const result = []
  let onsubscribes = 0

  const { unsubscribe, sql: subscribeSql } = await sql.subscribe(
    '*',
    (row, { command, old }) => result.push(command, row.name || row.id, old && old.name),
    () => onsubscribes++
  )

  await sql`
    create table test (
      id serial primary key,
      name text
    )
  `

  await sql`insert into test (name) values ('Murray')`
  await delay(10)
  await subscribeSql.close()
  await delay(500)
  await sql`delete from test`
  await delay(100)
  await unsubscribe()
  return [
    '2insert,Murray,,delete,1,',
    onsubscribes + result.join(','),
    await sql`drop table test`,
    await sql`drop publication alltables`,
    await sql.end()
  ]
})

t('Execute', async() => {
  const result = await new Promise((resolve) => {
    const sql = postgres({ ...options, fetch_types: false, debug:(id, query) => resolve(query) })
    sql`select 1`.execute()
  })

  return [result, 'select 1']
})

t('Cancel running query', async() => {
  const query = sql`select pg_sleep(2)`
  setTimeout(() => query.cancel(), 500)
  const error = await query.catch(x => x)
  return ['57014', error.code]
})

t('Cancel piped query', { timeout: 5 }, async() => {
  await sql`select 1`
  const last = sql`select pg_sleep(1)`.execute()
  const query = sql`select pg_sleep(2) as dig`
  setTimeout(() => query.cancel(), 500)
  const error = await query.catch(x => x)
  await last
  return ['57014', error.code]
})

t('Cancel queued query', async() => {
  const query = sql`select pg_sleep(2) as nej`
  const tx = sql.begin(sql => (
    query.cancel(),
    sql`select pg_sleep(0.5) as hej, 'hejsa'`
  ))
  const error = await query.catch(x => x)
  await tx
  return ['57014', error.code]
})

t('Fragments', async() => [
  1,
  (await sql`
    ${ sql`select` } 1 as x
  `)[0].x
])

t('Result becomes array', async() => [
  true,
  (await sql`select 1`).slice() instanceof Array
])

t('Describe', async() => {
  const type = (await sql`select ${ 1 }::int as x`.describe()).types[0]
  return [23, type]
})

t('Describe a statement', async() => {
  await sql`create table tester (name text, age int)`
  const r = await sql`select name, age from tester where name like $1 and age > $2`.describe()
  return [
    '25,23/name:25,age:23',
    `${ r.types.join(',') }/${ r.columns.map(c => `${c.name}:${c.type}`).join(',') }`,
    await sql`drop table tester`
  ]
})

t('Include table oid and column number in column details', async() => {
  await sql`create table tester (name text, age int)`
  const r = await sql`select name, age from tester where name like $1 and age > $2`.describe()
  const [{ oid }] = await sql`select oid from pg_class where relname = 'tester'`

  return [
    `table:${oid},number:1|table:${oid},number:2`,
    `${ r.columns.map(c => `table:${c.table},number:${c.number}`).join('|') }`,
    await sql`drop table tester`
  ]
})

t('Describe a statement without parameters', async() => {
  await sql`create table tester (name text, age int)`
  const r = await sql`select name, age from tester`.describe()
  return [
    '0,2',
    `${ r.types.length },${ r.columns.length }`,
    await sql`drop table tester`
  ]
})

t('Describe a statement without columns', async() => {
  await sql`create table tester (name text, age int)`
  const r = await sql`insert into tester (name, age) values ($1, $2)`.describe()
  return [
    '2,0',
    `${ r.types.length },${ r.columns.length }`,
    await sql`drop table tester`
  ]
})

t('Large object', async() => {
  const file = rel('index.js')
      , md5 = crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex')

  const lo = await sql.largeObject()
  await new Promise(async r => fs.createReadStream(file).pipe(await lo.writable()).on('finish', r))
  await lo.seek(0)

  const out = crypto.createHash('md5')
  await new Promise(r => lo.readable().then(x => x.on('data', x => out.update(x)).on('end', r)))

  return [
    md5,
    out.digest('hex'),
    await lo.close()
  ]
})

t('Catches type serialize errors', async() => {
  const sql = postgres({
    idle_timeout,
    types: {
      text: {
        from: 25,
        to: 25,
        parse: x => x,
        serialize: () => { throw new Error('watSerialize') }
      }
    }
  })

  return [
    'watSerialize',
    (await sql`select ${ 'wat' }`.catch(e => e.message))
  ]
})

t('Catches type parse errors', async() => {
  const sql = postgres({
    idle_timeout,
    types: {
      text: {
        from: 25,
        to: 25,
        parse: () => { throw new Error('watParse') },
        serialize: x => x
      }
    }
  })

  return [
    'watParse',
    (await sql`select 'wat'`.catch(e => e.message))
  ]
})

t('Catches type serialize errors in transactions', async() => {
  const sql = postgres({
    idle_timeout,
    types: {
      text: {
        from: 25,
        to: 25,
        parse: x => x,
        serialize: () => { throw new Error('watSerialize') }
      }
    }
  })

  return [
    'watSerialize',
    (await sql.begin(sql => (
      sql`select 1`,
      sql`select ${ 'wat' }`
    )).catch(e => e.message))
  ]
})

t('Catches type parse errors in transactions', async() => {
  const sql = postgres({
    idle_timeout,
    types: {
      text: {
        from: 25,
        to: 25,
        parse: () => { throw new Error('watParse') },
        serialize: x => x
      }
    }
  })

  return [
    'watParse',
    (await sql.begin(sql => (
      sql`select 1`,
      sql`select 'wat'`
    )).catch(e => e.message))
  ]
})

t('Prevent premature end of connection in transaction', async() => {
  const sql = postgres({ max_lifetime: 0.01, idle_timeout })
  const result = await sql.begin(async sql => {
    await sql`select 1`
    await delay(20)
    await sql`select 1`
    return 'yay'
  })


  return [
    'yay',
    result
  ]
})

t('Ensure reconnect after max_lifetime with transactions', { timeout: 5 }, async() => {
  const sql = postgres({
    max_lifetime: 0.01,
    idle_timeout,
    max: 1
  })

  let x = 0
  while (x++ < 10) await sql.begin(sql => sql`select 1 as x`)

  return [true, true]
})


t('Ensure transactions throw if connection is closed dwhile there is no query', async() => {
  const sql = postgres(options)
  const x = await sql.begin(async() => {
    setTimeout(() => sql.end({ timeout: 0 }), 10)
    await new Promise(r => setTimeout(r, 200))
    return sql`select 1`
  }).catch(x => x)
  return ['CONNECTION_CLOSED', x.code]
})

t('Custom socket', {}, async() => {
  let result
  const sql = postgres({
    socket: () => new Promise((resolve, reject) => {
      const socket = new net.Socket()
      socket.connect(5432)
      socket.once('data', x => result = x[0])
      socket.on('error', reject)
      socket.on('connect', () => resolve(socket))
    }),
    idle_timeout
  })

  await sql`select 1`

  return [
    result,
    82
  ]
})

t('Ensure drain only dequeues if ready', async() => {
  const sql = postgres(options)

  const res = await Promise.all([
    sql.unsafe('SELECT 0+$1 --' + '.'.repeat(100000), [1]),
    sql.unsafe('SELECT 0+$1+$2+$3', [1, 2, 3])
  ])

  return [res.length, 2]
})

t('Supports fragments as dynamic parameters', async() => {
  await sql`create table test (a int, b bool)`
  await sql`insert into test values(1, true)`
  await sql`insert into test ${
    sql({
      a: 2,
      b: sql`exists(select 1 from test where b = ${ true })`
    })
  }`

  return [
    '1,t2,t',
    (await sql`select * from test`.raw()).join(''),
    await sql`drop table test`
  ]
})

t('Supports nested fragments with parameters', async() => {
  await sql`create table test ${
    sql`(${ sql('a') } ${ sql`int` })`
  }`
  await sql`insert into test values(1)`
  return [
    1,
    (await sql`select a from test`)[0].a,
    await sql`drop table test`
  ]
})

t('Supports multiple nested fragments with parameters', async() => {
  const [{ b }] = await sql`select * ${
    sql`from ${
      sql`(values (2, ${ 1 }::int)) as x(${ sql(['a', 'b']) })`
    }`
  }`
  return [
    1,
    b
  ]
})

t('Supports arrays of fragments', async() => {
  const [{ x }] = await sql`
    ${ [sql`select`, sql`1`, sql`as`, sql`x`] }
  `

  return [
    1,
    x
  ]
})

t('Does not try rollback when commit errors', async() => {
  let notice = null
  const sql = postgres({ ...options, onnotice: x => notice = x })
  await sql`create table test(x int constraint test_constraint unique deferrable initially deferred)`

  await sql.begin('isolation level serializable', async sql => {
    await sql`insert into test values(1)`
    await sql`insert into test values(1)`
  }).catch(e => e)

  return [
    notice,
    null,
    await sql`drop table test`
  ]
})

t('Last keyword used even with duplicate keywords', async() => {
  await sql`create table test (x int)`
  await sql`insert into test values(1)`
  const [{ x }] = await sql`
    select
      1 in (1) as x
    from test
    where x in ${ sql([1, 2]) }
  `

  return [x, true, await sql`drop table test`]
})

t('Insert array with null', async() => {
  await sql`create table test (x int[])`
  await sql`insert into test ${ sql({ x: [1, null, 3] }) }`
  return [
    1,
    (await sql`select x from test`)[0].x[0],
    await sql`drop table test`
  ]
})

t('Insert array with undefined throws', async() => {
  await sql`create table test (x int[])`
  return [
    'UNDEFINED_VALUE',
    await sql`insert into test ${ sql({ x: [1, undefined, 3] }) }`.catch(e => e.code),
    await sql`drop table test`
  ]
})

t('Insert array with undefined transform', async() => {
  const sql = postgres({ ...options, transform: { undefined: null } })
  await sql`create table test (x int[])`
  await sql`insert into test ${ sql({ x: [1, undefined, 3] }) }`
  return [
    1,
    (await sql`select x from test`)[0].x[0],
    await sql`drop table test`
  ]
})

t('concurrent cursors', async() => {
  const xs = []

  await Promise.all([...Array(7)].map((x, i) => [
    sql`select ${ i }::int as a, generate_series(1, 2) as x`.cursor(([x]) => xs.push(x.a + x.x))
  ]).flat())

  return ['12233445566778', xs.join('')]
})

t('concurrent cursors multiple connections', async() => {
  const sql = postgres({ ...options, max: 2 })
  const xs = []

  await Promise.all([...Array(7)].map((x, i) => [
    sql`select ${ i }::int as a, generate_series(1, 2) as x`.cursor(([x]) => xs.push(x.a + x.x))
  ]).flat())

  return ['12233445566778', xs.sort().join('')]
})

t('reserve connection', async() => {
  const reserved = await sql.reserve()

  setTimeout(() => reserved.release(), 510)

  const xs = await Promise.all([
    reserved`select 1 as x`.then(([{ x }]) => ({ time: Date.now(), x })),
    sql`select 2 as x`.then(([{ x }]) => ({ time: Date.now(), x })),
    reserved`select 3 as x`.then(([{ x }]) => ({ time: Date.now(), x }))
  ])

  if (xs[1].time - xs[2].time < 500)
    throw new Error('Wrong time')

  return [
    '123',
    xs.map(x => x.x).join('')
  ]
})

t('arrays in reserved connection', async() => {
  const reserved = await sql.reserve()
  const [{ x }] = await reserved`select array[1, 2, 3] as x`
  reserved.release()

  return [
    '123',
    x.join('')
  ]
})

t('Ensure reserve on query throws proper error', async() => {
  const sql = postgres({ idle_timeout }) // eslint-disable-line
  const reserved = await sql.reserve()
  const [{ x }] = await reserved`select 'wat' as x`

  return [
    'wat', x, reserved.release()
  ]
})

```

---

### test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/afc848c316-postgres/cjs/tests/test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/* eslint no-console: 0 */

const util = require('util')

let done = 0
let only = false
let ignored = 0
let failed = false
let promise = Promise.resolve()
const tests = {}
    , ignore = {}

const nt = module.exports.nt = () => ignored++
const ot = module.exports.ot = (...rest) => (only = true, test(true, ...rest))
const t = module.exports.t = (...rest) => test(false, ...rest)
t.timeout = 5

async function test(o, name, options, fn) {
  typeof options !== 'object' && (fn = options, options = {})
  const line = new Error().stack.split('\n')[3].match(':([0-9]+):')[1]

  await 1

  if (only && !o)
    return

  tests[line] = { fn, line, name }
  promise = promise.then(() => Promise.race([
    new Promise((resolve, reject) =>
      fn.timer = setTimeout(() => reject('Timed out'), (options.timeout || t.timeout) * 1000)
    ),
    failed
      ? (ignored++, ignore)
      : fn()
  ]))
    .then(async x => {
      clearTimeout(fn.timer)
      if (x === ignore)
        return

      if (!Array.isArray(x))
        throw new Error('Test should return result array')

      const [expected, got] = await Promise.all(x)
      if (expected !== got) {
        failed = true
        throw new Error(util.inspect(expected) + ' != ' + util.inspect(got))
      }

      tests[line].succeeded = true
      process.stdout.write('✅')
    })
    .catch(err => {
      tests[line].failed = failed = true
      tests[line].error = err instanceof Error ? err : new Error(util.inspect(err))
    })
    .then(() => {
      ++done === Object.keys(tests).length && exit()
    })
}

function exit() {
  let success = true
  Object.values(tests).every((x) => {
    if (x.succeeded)
      return true

    success = false
    x.cleanup
      ? console.error('⛔️', x.name + ' at line', x.line, 'cleanup failed', '\n', util.inspect(x.cleanup))
      : console.error('⛔️', x.name + ' at line', x.line, x.failed
        ? 'failed'
        : 'never finished', x.error ? '\n' + util.inspect(x.error) : ''
      )
  })

  only
    ? console.error('⚠️', 'Not all tests were run')
    : ignored
      ? console.error('⚠️', ignored, 'ignored test' + (ignored === 1 ? '' : 's', '\n'))
      : success
        ? console.log('🎉')
        : console.error('⚠️', 'Not good')

  !process.exitCode && (!success || only || ignored) && (process.exitCode = 1)
}


```

---

### bootstrap.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/afc848c316-postgres/deno/tests/bootstrap.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
import { spawn } from 'https://deno.land/std@0.132.0/node/child_process.ts'

await exec('dropdb', ['postgres_js_test'])

await exec('psql', ['-c', 'alter system set ssl=on'])
await exec('psql', ['-c', 'drop user postgres_js_test'])
await exec('psql', ['-c', 'create user postgres_js_test'])
await exec('psql', ['-c', 'alter system set password_encryption=md5'])
await exec('psql', ['-c', 'select pg_reload_conf()'])
await exec('psql', ['-c', 'drop user if exists postgres_js_test_md5'])
await exec('psql', ['-c', 'create user postgres_js_test_md5 with password \'postgres_js_test_md5\''])
await exec('psql', ['-c', 'alter system set password_encryption=\'scram-sha-256\''])
await exec('psql', ['-c', 'select pg_reload_conf()'])
await exec('psql', ['-c', 'drop user if exists postgres_js_test_scram'])
await exec('psql', ['-c', 'create user postgres_js_test_scram with password \'postgres_js_test_scram\''])

await exec('createdb', ['postgres_js_test'])
await exec('psql', ['-c', 'grant all on database postgres_js_test to postgres_js_test'])
await exec('psql', ['-c', 'alter database postgres_js_test owner to postgres_js_test'])

function ignore(cmd, args) {
  const { stderr } = spawnSync(cmd, args, { stdio: 'pipe', encoding: 'utf8' })
  if (stderr && !stderr.includes('already exists') && !stderr.includes('does not exist'))
    throw stderr
}

export async function exec(cmd, args) { // eslint-disable-line
  let stderr = ''
  const cp = await spawn(cmd, args, { stdio: 'pipe', encoding: 'utf8' }) // eslint-disable-line
  cp.stderr.on('data', x => stderr += x)
  await new Promise(x => cp.on('exit', x))
  if (stderr && !stderr.includes('already exists') && !stderr.includes('does not exist'))
    throw new Error(stderr)
}

```

---

### index.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/afc848c316-postgres/deno/tests/index.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
import { Buffer } from 'https://deno.land/std@0.132.0/node/buffer.ts'
import process from 'https://deno.land/std@0.132.0/node/process.ts'
import { exec } from './bootstrap.js'

import { t, nt, ot } from './test.js' // eslint-disable-line
import { net } from '../polyfills.js'
import fs from 'https://deno.land/std@0.132.0/node/fs.ts'
import crypto from 'https://deno.land/std@0.132.0/node/crypto.ts'

import postgres from '../src/index.js'
const delay = ms => new Promise(r => setTimeout(r, ms))

const rel = x => new URL(x, import.meta.url)
const idle_timeout = 1

const login = {
  user: 'postgres_js_test'
}

const login_md5 = {
  user: 'postgres_js_test_md5',
  pass: 'postgres_js_test_md5'
}

const login_scram = {
  user: 'postgres_js_test_scram',
  pass: 'postgres_js_test_scram'
}

const options = {
  db: 'postgres_js_test',
  user: login.user,
  pass: login.pass,
  idle_timeout,
  connect_timeout: 1,
  max: 1
}

const sql = postgres(options)

t('Connects with no options', async() => {
  const sql = postgres({ max: 1 })

  const result = (await sql`select 1 as x`)[0].x
  await sql.end()

  return [1, result]
})

t('Uses default database without slash', async() => {
  const sql = postgres('postgres://localhost')
  return [sql.options.user, sql.options.database]
})

t('Uses default database with slash', async() => {
  const sql = postgres('postgres://localhost/')
  return [sql.options.user, sql.options.database]
})

t('Result is array', async() =>
  [true, Array.isArray(await sql`select 1`)]
)

t('Result has count', async() =>
  [1, (await sql`select 1`).count]
)

t('Result has command', async() =>
  ['SELECT', (await sql`select 1`).command]
)

t('Create table', async() =>
  ['CREATE TABLE', (await sql`create table test(int int)`).command, await sql`drop table test`]
)

t('Drop table', { timeout: 2 }, async() => {
  await sql`create table test(int int)`
  return ['DROP TABLE', (await sql`drop table test`).command]
})

t('null', async() =>
  [null, (await sql`select ${ null } as x`)[0].x]
)

t('Integer', async() =>
  ['1', (await sql`select ${ 1 } as x`)[0].x]
)

t('String', async() =>
  ['hello', (await sql`select ${ 'hello' } as x`)[0].x]
)

t('Boolean false', async() =>
  [false, (await sql`select ${ false } as x`)[0].x]
)

t('Boolean true', async() =>
  [true, (await sql`select ${ true } as x`)[0].x]
)

t('Date', async() => {
  const now = new Date()
  return [0, now - (await sql`select ${ now } as x`)[0].x]
})

t('Json', async() => {
  const x = (await sql`select ${ sql.json({ a: 'hello', b: 42 }) } as x`)[0].x
  return ['hello,42', [x.a, x.b].join()]
})

t('implicit json', async() => {
  const x = (await sql`select ${ { a: 'hello', b: 42 } }::json as x`)[0].x
  return ['hello,42', [x.a, x.b].join()]
})

t('implicit jsonb', async() => {
  const x = (await sql`select ${ { a: 'hello', b: 42 } }::jsonb as x`)[0].x
  return ['hello,42', [x.a, x.b].join()]
})

t('Empty array', async() =>
  [true, Array.isArray((await sql`select ${ sql.array([], 1009) } as x`)[0].x)]
)

t('String array', async() =>
  ['123', (await sql`select ${ '{1,2,3}' }::int[] as x`)[0].x.join('')]
)

t('Array of Integer', async() =>
  ['3', (await sql`select ${ sql.array([1, 2, 3]) } as x`)[0].x[2]]
)

t('Array of String', async() =>
  ['c', (await sql`select ${ sql.array(['a', 'b', 'c']) } as x`)[0].x[2]]
)

t('Array of Date', async() => {
  const now = new Date()
  return [now.getTime(), (await sql`select ${ sql.array([now, now, now]) } as x`)[0].x[2].getTime()]
})

t('Array of Box', async() => [
  '(3,4),(1,2);(6,7),(4,5)',
  (await sql`select ${ '{(1,2),(3,4);(4,5),(6,7)}' }::box[] as x`)[0].x.join(';')
])

t('Nested array n2', async() =>
  ['4', (await sql`select ${ sql.array([[1, 2], [3, 4]]) } as x`)[0].x[1][1]]
)

t('Nested array n3', async() =>
  ['6', (await sql`select ${ sql.array([[[1, 2]], [[3, 4]], [[5, 6]]]) } as x`)[0].x[2][0][1]]
)

t('Escape in arrays', async() =>
  ['Hello "you",c:\\windows', (await sql`select ${ sql.array(['Hello "you"', 'c:\\windows']) } as x`)[0].x.join(',')]
)

t('Escapes', async() => {
  return ['hej"hej', Object.keys((await sql`select 1 as ${ sql('hej"hej') }`)[0])[0]]
})

t('null for int', async() => {
  await sql`create table test (x int)`
  return [1, (await sql`insert into test values(${ null })`).count, await sql`drop table test`]
})

t('Throws on illegal transactions', async() => {
  const sql = postgres({ ...options, max: 2, fetch_types: false })
  const error = await sql`begin`.catch(e => e)
  return [
    error.code,
    'UNSAFE_TRANSACTION'
  ]
})

t('Transaction throws', async() => {
  await sql`create table test (a int)`
  return ['22P02', await sql.begin(async sql => {
    await sql`insert into test values(1)`
    await sql`insert into test values('hej')`
  }).catch(x => x.code), await sql`drop table test`]
})

t('Transaction rolls back', async() => {
  await sql`create table test (a int)`
  await sql.begin(async sql => {
    await sql`insert into test values(1)`
    await sql`insert into test values('hej')`
  }).catch(() => { /* ignore */ })
  return [0, (await sql`select a from test`).count, await sql`drop table test`]
})

t('Transaction throws on uncaught savepoint', async() => {
  await sql`create table test (a int)`

  return ['fail', (await sql.begin(async sql => {
    await sql`insert into test values(1)`
    await sql.savepoint(async sql => {
      await sql`insert into test values(2)`
      throw new Error('fail')
    })
  }).catch((err) => err.message)), await sql`drop table test`]
})

t('Transaction throws on uncaught named savepoint', async() => {
  await sql`create table test (a int)`

  return ['fail', (await sql.begin(async sql => {
    await sql`insert into test values(1)`
    await sql.savepoit('watpoint', async sql => {
      await sql`insert into test values(2)`
      throw new Error('fail')
    })
  }).catch(() => 'fail')), await sql`drop table test`]
})

t('Transaction succeeds on caught savepoint', async() => {
  await sql`create table test (a int)`
  await sql.begin(async sql => {
    await sql`insert into test values(1)`
    await sql.savepoint(async sql => {
      await sql`insert into test values(2)`
      throw new Error('please rollback')
    }).catch(() => { /* ignore */ })
    await sql`insert into test values(3)`
  })

  return ['2', (await sql`select count(1) from test`)[0].count, await sql`drop table test`]
})

t('Savepoint returns Result', async() => {
  let result
  await sql.begin(async sql => {
    result = await sql.savepoint(sql =>
      sql`select 1 as x`
    )
  })

  return [1, result[0].x]
})

t('Prepared transaction', async() => {
  await sql`create table test (a int)`

  await sql.begin(async sql => {
    await sql`insert into test values(1)`
    await sql.prepare('tx1')
  })

  await sql`commit prepared 'tx1'`

  return ['1', (await sql`select count(1) from test`)[0].count, await sql`drop table test`]
})

t('Transaction requests are executed implicitly', async() => {
  const sql = postgres({ debug: true, idle_timeout: 1, fetch_types: false })
  return [
    'testing',
    (await sql.begin(sql => [
      sql`select set_config('postgres_js.test', 'testing', true)`,
      sql`select current_setting('postgres_js.test') as x`
    ]))[1][0].x
  ]
})

t('Uncaught transaction request errors bubbles to transaction', async() => [
  '42703',
  (await sql.begin(sql => [
    sql`select wat`,
    sql`select current_setting('postgres_js.test') as x, ${ 1 } as a`
  ]).catch(e => e.code))
])

t('Fragments in transactions', async() => [
  true,
  (await sql.begin(sql => sql`select true as x where ${ sql`1=1` }`))[0].x
])

t('Transaction rejects with rethrown error', async() => [
  'WAT',
  await sql.begin(async sql => {
    try {
      await sql`select exception`
    } catch (ex) {
      throw new Error('WAT')
    }
  }).catch(e => e.message)
])

t('Parallel transactions', async() => {
  await sql`create table test (a int)`
  return ['11', (await Promise.all([
    sql.begin(sql => sql`select 1`),
    sql.begin(sql => sql`select 1`)
  ])).map(x => x.count).join(''), await sql`drop table test`]
})

t('Many transactions at beginning of connection', async() => {
  const sql = postgres(options)
  const xs = await Promise.all(Array.from({ length: 100 }, () => sql.begin(sql => sql`select 1`)))
  return [100, xs.length]
})

t('Transactions array', async() => {
  await sql`create table test (a int)`

  return ['11', (await sql.begin(sql => [
    sql`select 1`.then(x => x),
    sql`select 1`
  ])).map(x => x.count).join(''), await sql`drop table test`]
})

t('Transaction waits', async() => {
  await sql`create table test (a int)`
  await sql.begin(async sql => {
    await sql`insert into test values(1)`
    await sql.savepoint(async sql => {
      await sql`insert into test values(2)`
      throw new Error('please rollback')
    }).catch(() => { /* ignore */ })
    await sql`insert into test values(3)`
  })

  return ['11', (await Promise.all([
    sql.begin(sql => sql`select 1`),
    sql.begin(sql => sql`select 1`)
  ])).map(x => x.count).join(''), await sql`drop table test`]
})

t('Helpers in Transaction', async() => {
  return ['1', (await sql.begin(async sql =>
    await sql`select ${ sql({ x: 1 }) }`
  ))[0].x]
})

t('Undefined values throws', async() => {
  let error

  await sql`
    select ${ undefined } as x
  `.catch(x => error = x.code)

  return ['UNDEFINED_VALUE', error]
})

t('Transform undefined', async() => {
  const sql = postgres({ ...options, transform: { undefined: null } })
  return [null, (await sql`select ${ undefined } as x`)[0].x]
})

t('Transform undefined in array', async() => {
  const sql = postgres({ ...options, transform: { undefined: null } })
  return [null, (await sql`select * from (values ${ sql([undefined, undefined]) }) as x(x, y)`)[0].y]
})

t('Null sets to null', async() =>
  [null, (await sql`select ${ null } as x`)[0].x]
)

t('Throw syntax error', async() =>
  ['42601', (await sql`wat 1`.catch(x => x)).code]
)

t('Connect using uri', async() =>
  [true, await new Promise((resolve, reject) => {
    const sql = postgres('postgres://' + login.user + ':' + (login.pass || '') + '@localhost:5432/' + options.db, {
      idle_timeout
    })
    sql`select 1`.then(() => resolve(true), reject)
  })]
)

t('Options from uri with special characters in user and pass', async() => {
  const opt = postgres({ user: 'öla', pass: 'pass^word' }).options
  return [[opt.user, opt.pass].toString(), 'öla,pass^word']
})

t('Fail with proper error on no host', async() =>
  ['ECONNREFUSED', (await new Promise((resolve, reject) => {
    const sql = postgres('postgres://localhost:33333/' + options.db, {
      idle_timeout
    })
    sql`select 1`.then(reject, resolve)
  })).code]
)

t('Connect using SSL', async() =>
  [true, (await new Promise((resolve, reject) => {
    postgres({
      ssl: { rejectUnauthorized: false },
      idle_timeout
    })`select 1`.then(() => resolve(true), reject)
  }))]
)

t('Connect using SSL require', async() =>
  [true, (await new Promise((resolve, reject) => {
    postgres({
      ssl: 'require',
      idle_timeout
    })`select 1`.then(() => resolve(true), reject)
  }))]
)

t('Connect using SSL prefer', async() => {
  await exec('psql', ['-c', 'alter system set ssl=off'])
  await exec('psql', ['-c', 'select pg_reload_conf()'])

  const sql = postgres({
    ssl: 'prefer',
    idle_timeout
  })

  return [
    1, (await sql`select 1 as x`)[0].x,
    await exec('psql', ['-c', 'alter system set ssl=on']),
    await exec('psql', ['-c', 'select pg_reload_conf()'])
  ]
})

t('Reconnect using SSL', { timeout: 2 }, async() => {
  const sql = postgres({
    ssl: 'require',
    idle_timeout: 0.1
  })

  await sql`select 1`
  await delay(200)

  return [1, (await sql`select 1 as x`)[0].x]
})

t('Proper handling of non object Errors', async() => {
  const sql = postgres({ socket: () => { throw 'wat' } }) // eslint-disable-line

  return [
    'wat', await sql`select 1 as x`.catch(e => e.message)
  ]
})

t('Proper handling of null Errors', async() => {
  const sql = postgres({ socket: () => { throw null } }) // eslint-disable-line

  return [
    'null', await sql`select 1 as x`.catch(e => e.message)
  ]
})

t('Ensure reserve on connection throws proper error', async() => {
  const sql = postgres({ socket: () => { throw 'wat' }, idle_timeout }) // eslint-disable-line

  return [
    'wat', await sql.reserve().catch(e => e)
  ]
})

t('Login without password', async() => {
  return [true, (await postgres({ ...options, ...login })`select true as x`)[0].x]
})

t('Login using MD5', async() => {
  return [true, (await postgres({ ...options, ...login_md5 })`select true as x`)[0].x]
})

t('Login using scram-sha-256', async() => {
  return [true, (await postgres({ ...options, ...login_scram })`select true as x`)[0].x]
})

t('Parallel connections using scram-sha-256', {
  timeout: 2
}, async() => {
  const sql = postgres({ ...options, ...login_scram })
  return [true, (await Promise.all([
    sql`select true as x, pg_sleep(0.01)`,
    sql`select true as x, pg_sleep(0.01)`,
    sql`select true as x, pg_sleep(0.01)`
  ]))[0][0].x]
})

t('Support dynamic password function', async() => {
  return [true, (await postgres({
    ...options,
    ...login_scram,
    pass: () => 'postgres_js_test_scram'
  })`select true as x`)[0].x]
})

t('Support dynamic async password function', async() => {
  return [true, (await postgres({
    ...options,
    ...login_scram,
    pass: () => Promise.resolve('postgres_js_test_scram')
  })`select true as x`)[0].x]
})

t('Point type', async() => {
  const sql = postgres({
    ...options,
    types: {
      point: {
        to: 600,
        from: [600],
        serialize: ([x, y]) => '(' + x + ',' + y + ')',
        parse: (x) => x.slice(1, -1).split(',').map(x => +x)
      }
    }
  })

  await sql`create table test (x point)`
  await sql`insert into test (x) values (${ sql.types.point([10, 20]) })`
  return [20, (await sql`select x from test`)[0].x[1], await sql`drop table test`]
})

t('Point type array', async() => {
  const sql = postgres({
    ...options,
    types: {
      point: {
        to: 600,
        from: [600],
        serialize: ([x, y]) => '(' + x + ',' + y + ')',
        parse: (x) => x.slice(1, -1).split(',').map(x => +x)
      }
    }
  })

  await sql`create table test (x point[])`
  await sql`insert into test (x) values (${ sql.array([sql.types.point([10, 20]), sql.types.point([20, 30])]) })`
  return [30, (await sql`select x from test`)[0].x[1][1], await sql`drop table test`]
})

t('sql file', async() =>
  [1, (await sql.file(rel('select.sql')))[0].x]
)

t('sql file has forEach', async() => {
  let result
  await sql
    .file(rel('select.sql'), { cache: false })
    .forEach(({ x }) => result = x)

  return [1, result]
})

t('sql file throws', async() =>
  ['ENOENT', (await sql.file(rel('selectomondo.sql')).catch(x => x.code))]
)

t('sql file cached', async() => {
  await sql.file(rel('select.sql'))
  await delay(20)

  return [1, (await sql.file(rel('select.sql')))[0].x]
})

t('Parameters in file', async() => {
  const result = await sql.file(
    rel('select-param.sql'),
    ['hello']
  )
  return ['hello', result[0].x]
})

t('Connection ended promise', async() => {
  const sql = postgres(options)

  await sql.end()

  return [undefined, await sql.end()]
})

t('Connection ended timeout', async() => {
  const sql = postgres(options)

  await sql.end({ timeout: 10 })

  return [undefined, await sql.end()]
})

t('Connection ended error', async() => {
  const sql = postgres(options)
  await sql.end()
  return ['CONNECTION_ENDED', (await sql``.catch(x => x.code))]
})

t('Connection end does not cancel query', async() => {
  const sql = postgres(options)

  const promise = sql`select 1 as x`.execute()

  await sql.end()

  return [1, (await promise)[0].x]
})

t('Connection destroyed', async() => {
  const sql = postgres(options)
  process.nextTick(() => sql.end({ timeout: 0 }))
  return ['CONNECTION_DESTROYED', await sql``.catch(x => x.code)]
})

t('Connection destroyed with query before', async() => {
  const sql = postgres(options)
      , error = sql`select pg_sleep(0.2)`.catch(err => err.code)

  sql.end({ timeout: 0 })
  return ['CONNECTION_DESTROYED', await error]
})

t('transform column', async() => {
  const sql = postgres({
    ...options,
    transform: { column: x => x.split('').reverse().join('') }
  })

  await sql`create table test (hello_world int)`
  await sql`insert into test values (1)`
  return ['dlrow_olleh', Object.keys((await sql`select * from test`)[0])[0], await sql`drop table test`]
})

t('column toPascal', async() => {
  const sql = postgres({
    ...options,
    transform: { column: postgres.toPascal }
  })

  await sql`create table test (hello_world int)`
  await sql`insert into test values (1)`
  return ['HelloWorld', Object.keys((await sql`select * from test`)[0])[0], await sql`drop table test`]
})

t('column toCamel', async() => {
  const sql = postgres({
    ...options,
    transform: { column: postgres.toCamel }
  })

  await sql`create table test (hello_world int)`
  await sql`insert into test values (1)`
  return ['helloWorld', Object.keys((await sql`select * from test`)[0])[0], await sql`drop table test`]
})

t('column toKebab', async() => {
  const sql = postgres({
    ...options,
    transform: { column: postgres.toKebab }
  })

  await sql`create table test (hello_world int)`
  await sql`insert into test values (1)`
  return ['hello-world', Object.keys((await sql`select * from test`)[0])[0], await sql`drop table test`]
})

t('Transform nested json in arrays', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.camel
  })
  return ['aBcD', (await sql`select '[{"a_b":1},{"c_d":2}]'::jsonb as x`)[0].x.map(Object.keys).join('')]
})

t('Transform deeply nested json object in arrays', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.camel
  })
  return [
    'childObj_deeplyNestedObj_grandchildObj',
    (await sql`
      select '[{"nested_obj": {"child_obj": 2, "deeply_nested_obj": {"grandchild_obj": 3}}}]'::jsonb as x
    `)[0].x.map(x => {
      let result
      for (const key in x)
        result = [...Object.keys(x[key]), ...Object.keys(x[key].deeplyNestedObj)]
      return result
    })[0]
    .join('_')
  ]
})

t('Transform deeply nested json array in arrays', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.camel
  })
  return [
    'childArray_deeplyNestedArray_grandchildArray',
    (await sql`
      select '[{"nested_array": [{"child_array": 2, "deeply_nested_array": [{"grandchild_array":3}]}]}]'::jsonb AS x
    `)[0].x.map((x) => {
      let result
      for (const key in x)
        result = [...Object.keys(x[key][0]), ...Object.keys(x[key][0].deeplyNestedArray[0])]
      return result
    })[0]
    .join('_')
  ]
})

t('Bypass transform for json primitive', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.camel
  })

  const x = (
    await sql`select 'null'::json as a, 'false'::json as b, '"a"'::json as c, '1'::json as d`
  )[0]

  return [
    JSON.stringify({ a: null, b: false, c: 'a', d: 1 }),
    JSON.stringify(x)
  ]
})

t('Bypass transform for jsonb primitive', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.camel
  })

  const x = (
    await sql`select 'null'::jsonb as a, 'false'::jsonb as b, '"a"'::jsonb as c, '1'::jsonb as d`
  )[0]

  return [
    JSON.stringify({ a: null, b: false, c: 'a', d: 1 }),
    JSON.stringify(x)
  ]
})

t('unsafe', async() => {
  await sql`create table test (x int)`
  return [1, (await sql.unsafe('insert into test values ($1) returning *', [1]))[0].x, await sql`drop table test`]
})

t('unsafe simple', async() => {
  return [1, (await sql.unsafe('select 1 as x'))[0].x]
})

t('unsafe simple includes columns', async() => {
  return ['x', (await sql.unsafe('select 1 as x').values()).columns[0].name]
})

t('unsafe describe', async() => {
  const q = 'insert into test values (1)'
  await sql`create table test(a int unique)`
  await sql.unsafe(q).describe()
  const x = await sql.unsafe(q).describe()
  return [
    q,
    x.string,
    await sql`drop table test`
  ]
})

t('simple query using unsafe with multiple statements', async() => {
  return [
    '1,2',
    (await sql.unsafe('select 1 as x;select 2 as x')).map(x => x[0].x).join()
  ]
})

t('simple query using simple() with multiple statements', async() => {
  return [
    '1,2',
    (await sql`select 1 as x;select 2 as x`.simple()).map(x => x[0].x).join()
  ]
})

t('listen and notify', async() => {
  const sql = postgres(options)
  const channel = 'hello'
  const result = await new Promise(async r => {
    await sql.listen(channel, r)
    sql.notify(channel, 'works')
  })

  return [
    'works',
    result,
    sql.end()
  ]
})

t('double listen', async() => {
  const sql = postgres(options)
      , channel = 'hello'

  let count = 0

  await new Promise((resolve, reject) =>
    sql.listen(channel, resolve)
    .then(() => sql.notify(channel, 'world'))
    .catch(reject)
  ).then(() => count++)

  await new Promise((resolve, reject) =>
    sql.listen(channel, resolve)
    .then(() => sql.notify(channel, 'world'))
    .catch(reject)
  ).then(() => count++)

  // for coverage
  sql.listen('weee', () => { /* noop */ }).then(sql.end)

  return [2, count]
})

t('multiple listeners work after a reconnect', async() => {
  const sql = postgres(options)
      , xs = []

  const s1 = await sql.listen('test', x => xs.push('1', x))
  await sql.listen('test', x => xs.push('2', x))
  await sql.notify('test', 'a')
  await delay(50)
  await sql`select pg_terminate_backend(${ s1.state.pid })`
  await delay(200)
  await sql.notify('test', 'b')
  await delay(50)
  sql.end()

  return ['1a2a1b2b', xs.join('')]
})

t('listen and notify with weird name', async() => {
  const sql = postgres(options)
  const channel = 'wat-;.ø.§'
  const result = await new Promise(async r => {
    const { unlisten } = await sql.listen(channel, r)
    sql.notify(channel, 'works')
    await delay(50)
    await unlisten()
  })

  return [
    'works',
    result,
    sql.end()
  ]
})

t('listen and notify with upper case', async() => {
  const sql = postgres(options)
  const channel = 'withUpperChar'
  const result = await new Promise(async r => {
    await sql.listen(channel, r)
    sql.notify(channel, 'works')
  })

  return [
    'works',
    result,
    sql.end()
  ]
})

t('listen reconnects', { timeout: 2 }, async() => {
  const sql = postgres(options)
      , resolvers = {}
      , a = new Promise(r => resolvers.a = r)
      , b = new Promise(r => resolvers.b = r)

  let connects = 0

  const { state: { pid } } = await sql.listen(
    'test',
    x => x in resolvers && resolvers[x](),
    () => connects++
  )
  await sql.notify('test', 'a')
  await a
  await sql`select pg_terminate_backend(${ pid })`
  await delay(100)
  await sql.notify('test', 'b')
  await b
  sql.end()
  return [connects, 2]
})

t('listen result reports correct connection state after reconnection', async() => {
  const sql = postgres(options)
      , xs = []

  const result = await sql.listen('test', x => xs.push(x))
  const initialPid = result.state.pid
  await sql.notify('test', 'a')
  await sql`select pg_terminate_backend(${ initialPid })`
  await delay(50)
  sql.end()

  return [result.state.pid !== initialPid, true]
})

t('unlisten removes subscription', async() => {
  const sql = postgres(options)
      , xs = []

  const { unlisten } = await sql.listen('test', x => xs.push(x))
  await sql.notify('test', 'a')
  await delay(50)
  await unlisten()
  await sql.notify('test', 'b')
  await delay(50)
  sql.end()

  return ['a', xs.join('')]
})

t('listen after unlisten', async() => {
  const sql = postgres(options)
      , xs = []

  const { unlisten } = await sql.listen('test', x => xs.push(x))
  await sql.notify('test', 'a')
  await delay(50)
  await unlisten()
  await sql.notify('test', 'b')
  await delay(50)
  await sql.listen('test', x => xs.push(x))
  await sql.notify('test', 'c')
  await delay(50)
  sql.end()

  return ['ac', xs.join('')]
})

t('multiple listeners and unlisten one', async() => {
  const sql = postgres(options)
      , xs = []

  await sql.listen('test', x => xs.push('1', x))
  const s2 = await sql.listen('test', x => xs.push('2', x))
  await sql.notify('test', 'a')
  await delay(50)
  await s2.unlisten()
  await sql.notify('test', 'b')
  await delay(50)
  sql.end()

  return ['1a2a1b', xs.join('')]
})

t('responds with server parameters (application_name)', async() =>
  ['postgres.js', await new Promise((resolve, reject) => postgres({
    ...options,
    onparameter: (k, v) => k === 'application_name' && resolve(v)
  })`select 1`.catch(reject))]
)

t('has server parameters', async() => {
  return ['postgres.js', (await sql`select 1`.then(() => sql.parameters.application_name))]
})

t('big query body', { timeout: 2 }, async() => {
  await sql`create table test (x int)`
  return [50000, (await sql`insert into test ${
    sql([...Array(50000).keys()].map(x => ({ x })))
  }`).count, await sql`drop table test`]
})

t('Throws if more than 65534 parameters', async() => {
  await sql`create table test (x int)`
  return ['MAX_PARAMETERS_EXCEEDED', (await sql`insert into test ${
    sql([...Array(65535).keys()].map(x => ({ x })))
  }`.catch(e => e.code)), await sql`drop table test`]
})

t('let postgres do implicit cast of unknown types', async() => {
  await sql`create table test (x timestamp with time zone)`
  const [{ x }] = await sql`insert into test values (${ new Date().toISOString() }) returning *`
  return [true, x instanceof Date, await sql`drop table test`]
})

t('only allows one statement', async() =>
  ['42601', await sql`select 1; select 2`.catch(e => e.code)]
)

t('await sql() throws not tagged error', async() => {
  let error
  try {
    await sql('select 1')
  } catch (e) {
    error = e.code
  }
  return ['NOT_TAGGED_CALL', error]
})

t('sql().then throws not tagged error', async() => {
  let error
  try {
    sql('select 1').then(() => { /* noop */ })
  } catch (e) {
    error = e.code
  }
  return ['NOT_TAGGED_CALL', error]
})

t('sql().catch throws not tagged error', async() => {
  let error
  try {
    await sql('select 1')
  } catch (e) {
    error = e.code
  }
  return ['NOT_TAGGED_CALL', error]
})

t('sql().finally throws not tagged error', async() => {
  let error
  try {
    sql('select 1').finally(() => { /* noop */ })
  } catch (e) {
    error = e.code
  }
  return ['NOT_TAGGED_CALL', error]
})

t('little bobby tables', async() => {
  const name = 'Robert\'); DROP TABLE students;--'

  await sql`create table students (name text, age int)`
  await sql`insert into students (name) values (${ name })`

  return [
    name, (await sql`select name from students`)[0].name,
    await sql`drop table students`
  ]
})

t('Connection errors are caught using begin()', {
  timeout: 2
}, async() => {
  let error
  try {
    const sql = postgres({ host: 'localhost', port: 1 })

    await sql.begin(async(sql) => {
      await sql`insert into test (label, value) values (${1}, ${2})`
    })
  } catch (err) {
    error = err
  }

  return [
    true,
    error.code === 'ECONNREFUSED' ||
    error.message === 'Connection refused (os error 61)'
  ]
})

t('dynamic table name', async() => {
  await sql`create table test(a int)`
  return [
    0, (await sql`select * from ${ sql('test') }`).count,
    await sql`drop table test`
  ]
})

t('dynamic schema name', async() => {
  await sql`create table test(a int)`
  return [
    0, (await sql`select * from ${ sql('public') }.test`).count,
    await sql`drop table test`
  ]
})

t('dynamic schema and table name', async() => {
  await sql`create table test(a int)`
  return [
    0, (await sql`select * from ${ sql('public.test') }`).count,
    await sql`drop table test`
  ]
})

t('dynamic column name', async() => {
  return ['!not_valid', Object.keys((await sql`select 1 as ${ sql('!not_valid') }`)[0])[0]]
})

t('dynamic select as', async() => {
  return ['2', (await sql`select ${ sql({ a: 1, b: 2 }) }`)[0].b]
})

t('dynamic select as pluck', async() => {
  return [undefined, (await sql`select ${ sql({ a: 1, b: 2 }, 'a') }`)[0].b]
})

t('dynamic insert', async() => {
  await sql`create table test (a int, b text)`
  const x = { a: 42, b: 'the answer' }

  return ['the answer', (await sql`insert into test ${ sql(x) } returning *`)[0].b, await sql`drop table test`]
})

t('dynamic insert pluck', async() => {
  await sql`create table test (a int, b text)`
  const x = { a: 42, b: 'the answer' }

  return [null, (await sql`insert into test ${ sql(x, 'a') } returning *`)[0].b, await sql`drop table test`]
})

t('dynamic in with empty array', async() => {
  await sql`create table test (a int)`
  await sql`insert into test values (1)`
  return [
    (await sql`select * from test where null in ${ sql([]) }`).count,
    0,
    await sql`drop table test`
  ]
})

t('dynamic in after insert', async() => {
  await sql`create table test (a int, b text)`
  const [{ x }] = await sql`
    with x as (
      insert into test values (1, 'hej')
      returning *
    )
    select 1 in ${ sql([1, 2, 3]) } as x from x
  `
  return [
    true, x,
    await sql`drop table test`
  ]
})

t('array insert', async() => {
  await sql`create table test (a int, b int)`
  return [2, (await sql`insert into test (a, b) values ${ sql([1, 2]) } returning *`)[0].b, await sql`drop table test`]
})

t('where parameters in()', async() => {
  await sql`create table test (x text)`
  await sql`insert into test values ('a')`
  return [
    (await sql`select * from test where x in ${ sql(['a', 'b', 'c']) }`)[0].x,
    'a',
    await sql`drop table test`
  ]
})

t('where parameters in() values before', async() => {
  return [2, (await sql`
    with rows as (
      select * from (values (1), (2), (3), (4)) as x(a)
    )
    select * from rows where a in ${ sql([3, 4]) }
  `).count]
})

t('dynamic multi row insert', async() => {
  await sql`create table test (a int, b text)`
  const x = { a: 42, b: 'the answer' }

  return [
    'the answer',
    (await sql`insert into test ${ sql([x, x]) } returning *`)[1].b, await sql`drop table test`
  ]
})

t('dynamic update', async() => {
  await sql`create table test (a int, b text)`
  await sql`insert into test (a, b) values (17, 'wrong')`

  return [
    'the answer',
    (await sql`update test set ${ sql({ a: 42, b: 'the answer' }) } returning *`)[0].b, await sql`drop table test`
  ]
})

t('dynamic update pluck', async() => {
  await sql`create table test (a int, b text)`
  await sql`insert into test (a, b) values (17, 'wrong')`

  return [
    'wrong',
    (await sql`update test set ${ sql({ a: 42, b: 'the answer' }, 'a') } returning *`)[0].b, await sql`drop table test`
  ]
})

t('dynamic select array', async() => {
  await sql`create table test (a int, b text)`
  await sql`insert into test (a, b) values (42, 'yay')`
  return ['yay', (await sql`select ${ sql(['a', 'b']) } from test`)[0].b, await sql`drop table test`]
})

t('dynamic returning array', async() => {
  await sql`create table test (a int, b text)`
  return [
    'yay',
    (await sql`insert into test (a, b) values (42, 'yay') returning ${ sql(['a', 'b']) }`)[0].b,
    await sql`drop table test`
  ]
})

t('dynamic select args', async() => {
  await sql`create table test (a int, b text)`
  await sql`insert into test (a, b) values (42, 'yay')`
  return ['yay', (await sql`select ${ sql('a', 'b') } from test`)[0].b, await sql`drop table test`]
})

t('dynamic values single row', async() => {
  const [{ b }] = await sql`
    select * from (values ${ sql(['a', 'b', 'c']) }) as x(a, b, c)
  `

  return ['b', b]
})

t('dynamic values multi row', async() => {
  const [, { b }] = await sql`
    select * from (values ${ sql([['a', 'b', 'c'], ['a', 'b', 'c']]) }) as x(a, b, c)
  `

  return ['b', b]
})

t('connection parameters', async() => {
  const sql = postgres({
    ...options,
    connection: {
      'some.var': 'yay'
    }
  })

  return ['yay', (await sql`select current_setting('some.var') as x`)[0].x]
})

t('Multiple queries', async() => {
  const sql = postgres(options)

  return [4, (await Promise.all([
    sql`select 1`,
    sql`select 2`,
    sql`select 3`,
    sql`select 4`
  ])).length]
})

t('Multiple statements', async() =>
  [2, await sql.unsafe(`
    select 1 as x;
    select 2 as a;
  `).then(([, [x]]) => x.a)]
)

t('throws correct error when authentication fails', async() => {
  const sql = postgres({
    ...options,
    ...login_md5,
    pass: 'wrong'
  })
  return ['28P01', await sql`select 1`.catch(e => e.code)]
})

t('notice', async() => {
  let notice
  const log = console.log // eslint-disable-line
  console.log = function(x) { // eslint-disable-line
    notice = x
  }

  const sql = postgres(options)

  await sql`create table if not exists users()`
  await sql`create table if not exists users()`

  console.log = log // eslint-disable-line

  return ['NOTICE', notice.severity]
})

t('notice hook', async() => {
  let notice
  const sql = postgres({
    ...options,
    onnotice: x => notice = x
  })

  await sql`create table if not exists users()`
  await sql`create table if not exists users()`

  return ['NOTICE', notice.severity]
})

t('bytea serializes and parses', async() => {
  const buf = Buffer.from('wat')

  await sql`create table test (x bytea)`
  await sql`insert into test values (${ buf })`

  return [
    buf.toString(),
    (await sql`select x from test`)[0].x.toString(),
    await sql`drop table test`
  ]
})

t('forEach', async() => {
  let result
  await sql`select 1 as x`.forEach(({ x }) => result = x)
  return [1, result]
})

t('forEach returns empty array', async() => {
  return [0, (await sql`select 1 as x`.forEach(() => { /* noop */ })).length]
})

t('Cursor', async() => {
  const order = []
  await sql`select 1 as x union select 2 as x`.cursor(async([x]) => {
    order.push(x.x + 'a')
    await delay(100)
    order.push(x.x + 'b')
  })
  return ['1a1b2a2b', order.join('')]
})

t('Unsafe cursor', async() => {
  const order = []
  await sql.unsafe('select 1 as x union select 2 as x').cursor(async([x]) => {
    order.push(x.x + 'a')
    await delay(100)
    order.push(x.x + 'b')
  })
  return ['1a1b2a2b', order.join('')]
})

t('Cursor custom n', async() => {
  const order = []
  await sql`select * from generate_series(1,20)`.cursor(10, async(x) => {
    order.push(x.length)
  })
  return ['10,10', order.join(',')]
})

t('Cursor custom with rest n', async() => {
  const order = []
  await sql`select * from generate_series(1,20)`.cursor(11, async(x) => {
    order.push(x.length)
  })
  return ['11,9', order.join(',')]
})

t('Cursor custom with less results than batch size', async() => {
  const order = []
  await sql`select * from generate_series(1,20)`.cursor(21, async(x) => {
    order.push(x.length)
  })
  return ['20', order.join(',')]
})

t('Cursor cancel', async() => {
  let result
  await sql`select * from generate_series(1,10) as x`.cursor(async([{ x }]) => {
    result = x
    return sql.CLOSE
  })
  return [1, result]
})

t('Cursor throw', async() => {
  const order = []
  await sql`select 1 as x union select 2 as x`.cursor(async([x]) => {
    order.push(x.x + 'a')
    await delay(100)
    throw new Error('watty')
  }).catch(() => order.push('err'))
  return ['1aerr', order.join('')]
})

t('Cursor error', async() => [
  '42601',
  await sql`wat`.cursor(() => { /* noop */ }).catch((err) => err.code)
])

t('Multiple Cursors', { timeout: 2 }, async() => {
  const result = []
  await sql.begin(async sql => [
    await sql`select 1 as cursor, x from generate_series(1,4) as x`.cursor(async([row]) => {
      result.push(row.x)
      await new Promise(r => setTimeout(r, 20))
    }),
    await sql`select 2 as cursor, x from generate_series(101,104) as x`.cursor(async([row]) => {
      result.push(row.x)
      await new Promise(r => setTimeout(r, 10))
    })
  ])

  return ['1,2,3,4,101,102,103,104', result.join(',')]
})

t('Cursor as async iterator', async() => {
  const order = []
  for await (const [x] of sql`select generate_series(1,2) as x;`.cursor()) {
    order.push(x.x + 'a')
    await delay(10)
    order.push(x.x + 'b')
  }

  return ['1a1b2a2b', order.join('')]
})

t('Cursor as async iterator with break', async() => {
  const order = []
  for await (const xs of sql`select generate_series(1,2) as x;`.cursor()) {
    order.push(xs[0].x + 'a')
    await delay(10)
    order.push(xs[0].x + 'b')
    break
  }

  return ['1a1b', order.join('')]
})

t('Async Iterator Unsafe cursor', async() => {
  const order = []
  for await (const [x] of sql.unsafe('select 1 as x union select 2 as x').cursor()) {
    order.push(x.x + 'a')
    await delay(10)
    order.push(x.x + 'b')
  }
  return ['1a1b2a2b', order.join('')]
})

t('Async Iterator Cursor custom n', async() => {
  const order = []
  for await (const x of sql`select * from generate_series(1,20)`.cursor(10))
    order.push(x.length)

  return ['10,10', order.join(',')]
})

t('Async Iterator Cursor custom with rest n', async() => {
  const order = []
  for await (const x of sql`select * from generate_series(1,20)`.cursor(11))
    order.push(x.length)

  return ['11,9', order.join(',')]
})

t('Async Iterator Cursor custom with less results than batch size', async() => {
  const order = []
  for await (const x of sql`select * from generate_series(1,20)`.cursor(21))
    order.push(x.length)
  return ['20', order.join(',')]
})

t('Transform row', async() => {
  const sql = postgres({
    ...options,
    transform: { row: () => 1 }
  })

  return [1, (await sql`select 'wat'`)[0]]
})

t('Transform row forEach', async() => {
  let result
  const sql = postgres({
    ...options,
    transform: { row: () => 1 }
  })

  await sql`select 1`.forEach(x => result = x)

  return [1, result]
})

t('Transform value', async() => {
  const sql = postgres({
    ...options,
    transform: { value: () => 1 }
  })

  return [1, (await sql`select 'wat' as x`)[0].x]
})

t('Transform columns from', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.fromCamel
  })
  await sql`create table test (a_test int, b_test text)`
  await sql`insert into test ${ sql([{ aTest: 1, bTest: 1 }]) }`
  await sql`update test set ${ sql({ aTest: 2, bTest: 2 }) }`
  return [
    2,
    (await sql`select ${ sql('aTest', 'bTest') } from test`)[0].a_test,
    await sql`drop table test`
  ]
})

t('Transform columns to', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.toCamel
  })
  await sql`create table test (a_test int, b_test text)`
  await sql`insert into test ${ sql([{ a_test: 1, b_test: 1 }]) }`
  await sql`update test set ${ sql({ a_test: 2, b_test: 2 }) }`
  return [
    2,
    (await sql`select a_test, b_test from test`)[0].aTest,
    await sql`drop table test`
  ]
})

t('Transform columns from and to', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.camel
  })
  await sql`create table test (a_test int, b_test text)`
  await sql`insert into test ${ sql([{ aTest: 1, bTest: 1 }]) }`
  await sql`update test set ${ sql({ aTest: 2, bTest: 2 }) }`
  return [
    2,
    (await sql`select ${ sql('aTest', 'bTest') } from test`)[0].aTest,
    await sql`drop table test`
  ]
})

t('Transform columns from and to (legacy)', async() => {
  const sql = postgres({
    ...options,
    transform: {
      column: {
        to: postgres.fromCamel,
        from: postgres.toCamel
      }
    }
  })
  await sql`create table test (a_test int, b_test text)`
  await sql`insert into test ${ sql([{ aTest: 1, bTest: 1 }]) }`
  await sql`update test set ${ sql({ aTest: 2, bTest: 2 }) }`
  return [
    2,
    (await sql`select ${ sql('aTest', 'bTest') } from test`)[0].aTest,
    await sql`drop table test`
  ]
})

t('Unix socket', async() => {
  const sql = postgres({
    ...options,
    host: process.env.PGSOCKET || '/tmp' // eslint-disable-line
  })

  return [1, (await sql`select 1 as x`)[0].x]
})

t('Big result', async() => {
  return [100000, (await sql`select * from generate_series(1, 100000)`).count]
})

t('Debug', async() => {
  let result
  const sql = postgres({
    ...options,
    debug: (connection_id, str) => result = str
  })

  await sql`select 1`

  return ['select 1', result]
})

t('bigint is returned as String', async() => [
  'string',
  typeof (await sql`select 9223372036854777 as x`)[0].x
])

t('int is returned as Number', async() => [
  'number',
  typeof (await sql`select 123 as x`)[0].x
])

t('numeric is returned as string', async() => [
  'string',
  typeof (await sql`select 1.2 as x`)[0].x
])

t('Async stack trace', async() => {
  const sql = postgres({ ...options, debug: false })
  return [
    parseInt(new Error().stack.split('\n')[1].match(':([0-9]+):')[1]) + 1,
    parseInt(await sql`error`.catch(x => x.stack.split('\n').pop().match(':([0-9]+):')[1]))
  ]
})

t('Debug has long async stack trace', async() => {
  const sql = postgres({ ...options, debug: true })

  return [
    'watyo',
    await yo().catch(x => x.stack.match(/wat|yo/g).join(''))
  ]

  function yo() {
    return wat()
  }

  function wat() {
    return sql`error`
  }
})

t('Error contains query string', async() => [
  'selec 1',
  (await sql`selec 1`.catch(err => err.query))
])

t('Error contains query serialized parameters', async() => [
  1,
  (await sql`selec ${ 1 }`.catch(err => err.parameters[0]))
])

t('Error contains query raw parameters', async() => [
  1,
  (await sql`selec ${ 1 }`.catch(err => err.args[0]))
])

t('Query and parameters on errorare not enumerable if debug is not set', async() => {
  const sql = postgres({ ...options, debug: false })

  return [
    false,
    (await sql`selec ${ 1 }`.catch(err => err.propertyIsEnumerable('parameters') || err.propertyIsEnumerable('query')))
  ]
})

t('Query and parameters are enumerable if debug is set', async() => {
  const sql = postgres({ ...options, debug: true })

  return [
    true,
    (await sql`selec ${ 1 }`.catch(err => err.propertyIsEnumerable('parameters') && err.propertyIsEnumerable('query')))
  ]
})

t('connect_timeout', { timeout: 20 }, async() => {
  const connect_timeout = 0.2
  const server = net.createServer()
  server.listen()
  const sql = postgres({ port: server.address().port, host: '127.0.0.1', connect_timeout })
  const start = Date.now()
  let end
  await sql`select 1`.catch((e) => {
    if (e.code !== 'CONNECT_TIMEOUT')
      throw e
    end = Date.now()
  })
  server.close()
  return [connect_timeout, Math.floor((end - start) / 100) / 10]
})

t('connect_timeout throws proper error', async() => [
  'CONNECT_TIMEOUT',
  await postgres({
    ...options,
    ...login_scram,
    connect_timeout: 0.001
  })`select 1`.catch(e => e.code)
])

t('connect_timeout error message includes host:port', { timeout: 20 }, async() => {
  const connect_timeout = 0.2
  const server = net.createServer()
  server.listen()
  const sql = postgres({ port: server.address().port, host: '127.0.0.1', connect_timeout })
  const port = server.address().port
  let err
  await sql`select 1`.catch((e) => {
    if (e.code !== 'CONNECT_TIMEOUT')
      throw e
    err = e.message
  })
  server.close()
  return [['write CONNECT_TIMEOUT 127.0.0.1:', port].join(''), err]
})

t('requests works after single connect_timeout', async() => {
  let first = true

  const sql = postgres({
    ...options,
    ...login_scram,
    connect_timeout: { valueOf() { return first ? (first = false, 0.0001) : 1 } }
  })

  return [
    'CONNECT_TIMEOUT,,1',
    [
      await sql`select 1 as x`.then(() => 'success', x => x.code),
      await delay(10),
      (await sql`select 1 as x`)[0].x
    ].join(',')
  ]
})

t('Postgres errors are of type PostgresError', async() =>
  [true, (await sql`bad keyword`.catch(e => e)) instanceof sql.PostgresError]
)

t('Result has columns spec', async() =>
  ['x', (await sql`select 1 as x`).columns[0].name]
)

t('forEach has result as second argument', async() => {
  let x
  await sql`select 1 as x`.forEach((_, result) => x = result)
  return ['x', x.columns[0].name]
})

t('Result as arrays', async() => {
  const sql = postgres({
    ...options,
    transform: {
      row: x => Object.values(x)
    }
  })

  return ['1,2', (await sql`select 1 as a, 2 as b`)[0].join(',')]
})

t('Insert empty array', async() => {
  await sql`create table tester (ints int[])`
  return [
    Array.isArray((await sql`insert into tester (ints) values (${ sql.array([]) }) returning *`)[0].ints),
    true,
    await sql`drop table tester`
  ]
})

t('Insert array in sql()', async() => {
  await sql`create table tester (ints int[])`
  return [
    Array.isArray((await sql`insert into tester ${ sql({ ints: sql.array([]) }) } returning *`)[0].ints),
    true,
    await sql`drop table tester`
  ]
})

t('Automatically creates prepared statements', async() => {
  const sql = postgres(options)
  const result = await sql`select * from pg_prepared_statements`
  return [true, result.some(x => x.name = result.statement.name)]
})

t('no_prepare: true disables prepared statements (deprecated)', async() => {
  const sql = postgres({ ...options, no_prepare: true })
  const result = await sql`select * from pg_prepared_statements`
  return [false, result.some(x => x.name = result.statement.name)]
})

t('prepare: false disables prepared statements', async() => {
  const sql = postgres({ ...options, prepare: false })
  const result = await sql`select * from pg_prepared_statements`
  return [false, result.some(x => x.name = result.statement.name)]
})

t('prepare: true enables prepared statements', async() => {
  const sql = postgres({ ...options, prepare: true })
  const result = await sql`select * from pg_prepared_statements`
  return [true, result.some(x => x.name = result.statement.name)]
})

t('prepares unsafe query when "prepare" option is true', async() => {
  const sql = postgres({ ...options, prepare: true })
  const result = await sql.unsafe('select * from pg_prepared_statements where name <> $1', ['bla'], { prepare: true })
  return [true, result.some(x => x.name = result.statement.name)]
})

t('does not prepare unsafe query by default', async() => {
  const sql = postgres({ ...options, prepare: true })
  const result = await sql.unsafe('select * from pg_prepared_statements where name <> $1', ['bla'])
  return [false, result.some(x => x.name = result.statement.name)]
})

t('Recreate prepared statements on transformAssignedExpr error', { timeout: 1 }, async() => {
  const insert = () => sql`insert into test (name) values (${ '1' }) returning name`
  await sql`create table test (name text)`
  await insert()
  await sql`alter table test alter column name type int using name::integer`
  return [
    1,
    (await insert())[0].name,
    await sql`drop table test`
  ]
})

t('Throws correct error when retrying in transactions', async() => {
  await sql`create table test(x int)`
  const error = await sql.begin(sql => sql`insert into test (x) values (${ false })`).catch(e => e)
  return [
    error.code,
    '42804',
    sql`drop table test`
  ]
})

t('Recreate prepared statements on RevalidateCachedQuery error', async() => {
  const select = () => sql`select name from test`
  await sql`create table test (name text)`
  await sql`insert into test values ('1')`
  await select()
  await sql`alter table test alter column name type int using name::integer`
  return [
    1,
    (await select())[0].name,
    await sql`drop table test`
  ]
})

t('Properly throws routine error on not prepared statements', async() => {
  await sql`create table x (x text[])`
  const { routine } = await sql.unsafe(`
    insert into x(x) values (('a', 'b'))
  `).catch(e => e)

  return ['transformAssignedExpr', routine, await sql`drop table x`]
})

t('Properly throws routine error on not prepared statements in transaction', async() => {
  const { routine } = await sql.begin(sql => [
    sql`create table x (x text[])`,
    sql`insert into x(x) values (('a', 'b'))`
  ]).catch(e => e)

  return ['transformAssignedExpr', routine]
})

t('Properly throws routine error on not prepared statements using file', async() => {
  const { routine } = await sql.unsafe(`
    create table x (x text[]);
    insert into x(x) values (('a', 'b'));
  `, { prepare: true }).catch(e => e)

  return ['transformAssignedExpr', routine]
})

t('Catches connection config errors', async() => {
  const sql = postgres({ ...options, user: { toString: () => { throw new Error('wat') } }, database: 'prut' })

  return [
    'wat',
    await sql`select 1`.catch((e) => e.message)
  ]
})

t('Catches connection config errors with end', async() => {
  const sql = postgres({ ...options, user: { toString: () => { throw new Error('wat') } }, database: 'prut' })

  return [
    'wat',
    await sql`select 1`.catch((e) => e.message),
    await sql.end()
  ]
})

t('Catches query format errors', async() => [
  'wat',
  await sql.unsafe({ toString: () => { throw new Error('wat') } }).catch((e) => e.message)
])

t('Multiple hosts', {
  timeout: 1
}, async() => {
  const s1 = postgres({ idle_timeout })
      , s2 = postgres({ idle_timeout, port: 5433 })
      , sql = postgres('postgres://localhost:5432,localhost:5433', { idle_timeout, max: 1 })
      , result = []

  const id1 = (await s1`select system_identifier as x from pg_control_system()`)[0].x
  const id2 = (await s2`select system_identifier as x from pg_control_system()`)[0].x

  const x1 = await sql`select 1`
  result.push((await sql`select system_identifier as x from pg_control_system()`)[0].x)
  await s1`select pg_terminate_backend(${ x1.state.pid }::int)`
  await delay(50)

  const x2 = await sql`select 1`
  result.push((await sql`select system_identifier as x from pg_control_system()`)[0].x)
  await s2`select pg_terminate_backend(${ x2.state.pid }::int)`
  await delay(50)

  result.push((await sql`select system_identifier as x from pg_control_system()`)[0].x)

  return [[id1, id2, id1].join(','), result.join(',')]
})

t('Escaping supports schemas and tables', async() => {
  await sql`create schema a`
  await sql`create table a.b (c int)`
  await sql`insert into a.b (c) values (1)`
  return [
    1,
    (await sql`select ${ sql('a.b.c') } from a.b`)[0].c,
    await sql`drop table a.b`,
    await sql`drop schema a`
  ]
})

t('Raw method returns rows as arrays', async() => {
  const [x] = await sql`select 1`.raw()
  return [
    Array.isArray(x),
    true
  ]
})

t('Raw method returns values unparsed as Buffer', async() => {
  const [[x]] = await sql`select 1`.raw()
  return [
    x instanceof Uint8Array,
    true
  ]
})

t('Array returns rows as arrays of columns', async() => {
  return [(await sql`select 1`.values())[0][0], 1]
})

t('Copy read', async() => {
  const result = []

  await sql`create table test (x int)`
  await sql`insert into test select * from generate_series(1,10)`
  const readable = await sql`copy test to stdout`.readable()
  readable.on('data', x => result.push(x))
  await new Promise(r => readable.on('end', r))

  return [
    result.length,
    10,
    await sql`drop table test`
  ]
})

t('Copy write', { timeout: 2 }, async() => {
  await sql`create table test (x int)`
  const writable = await sql`copy test from stdin`.writable()

  writable.write('1\n')
  writable.write('1\n')
  writable.end()

  await new Promise(r => writable.on('finish', r))

  return [
    (await sql`select 1 from test`).length,
    2,
    await sql`drop table test`
  ]
})

t('Copy write as first', async() => {
  await sql`create table test (x int)`
  const first = postgres(options)
  const writable = await first`COPY test FROM STDIN WITH(FORMAT csv, HEADER false, DELIMITER ',')`.writable()
  writable.write('1\n')
  writable.write('1\n')
  writable.end()

  await new Promise(r => writable.on('finish', r))

  return [
    (await sql`select 1 from test`).length,
    2,
    await sql`drop table test`
  ]
})

t('Copy from file', async() => {
  await sql`create table test (x int, y int, z int)`
  await new Promise(async r => fs
    .createReadStream(rel('copy.csv'))
    .pipe(await sql`copy test from stdin`.writable())
    .on('finish', r)
  )

  return [
    JSON.stringify(await sql`select * from test`),
    '[{"x":1,"y":2,"z":3},{"x":4,"y":5,"z":6}]',
    await sql`drop table test`
  ]
})

t('Copy from works in transaction', async() => {
  await sql`create table test(x int)`
  const xs = await sql.begin(async sql => {
    (await sql`copy test from stdin`.writable()).end('1\n2')
    await delay(20)
    return sql`select 1 from test`
  })

  return [
    xs.length,
    2,
    await sql`drop table test`
  ]
})

t('Copy from abort', async() => {
  const sql = postgres(options)
  const readable = fs.createReadStream(rel('copy.csv'))

  await sql`create table test (x int, y int, z int)`
  await sql`TRUNCATE TABLE test`

  const writable = await sql`COPY test FROM STDIN`.writable()

  let aborted

  readable
    .pipe(writable)
    .on('error', (err) => aborted = err)

  writable.destroy(new Error('abort'))
  await sql.end()

  return [
    'abort',
    aborted.message,
    await postgres(options)`drop table test`
  ]
})

t('multiple queries before connect', async() => {
  const sql = postgres({ ...options, max: 2 })
  const xs = await Promise.all([
    sql`select 1 as x`,
    sql`select 2 as x`,
    sql`select 3 as x`,
    sql`select 4 as x`
  ])

  return [
    '1,2,3,4',
    xs.map(x => x[0].x).join()
  ]
})

t('subscribe', { timeout: 2 }, async() => {
  const sql = postgres({
    database: 'postgres_js_test',
    publications: 'alltables'
  })

  await sql.unsafe('create publication alltables for all tables')

  const result = []

  const { unsubscribe } = await sql.subscribe('*', (row, { command, old }) => {
    result.push(command, row.name, row.id, old && old.name, old && old.id)
  })

  await sql`
    create table test (
      id serial primary key,
      name text
    )
  `

  await sql`alter table test replica identity default`
  await sql`insert into test (name) values ('Murray')`
  await sql`update test set name = 'Rothbard'`
  await sql`update test set id = 2`
  await sql`delete from test`
  await sql`alter table test replica identity full`
  await sql`insert into test (name) values ('Murray')`
  await sql`update test set name = 'Rothbard'`
  await sql`delete from test`
  await delay(10)
  await unsubscribe()
  await sql`insert into test (name) values ('Oh noes')`
  await delay(10)
  return [
    'insert,Murray,1,,,update,Rothbard,1,,,update,Rothbard,2,,1,delete,,2,,,insert,Murray,2,,,update,Rothbard,2,Murray,2,delete,Rothbard,2,,', // eslint-disable-line
    result.join(','),
    await sql`drop table test`,
    await sql`drop publication alltables`,
    await sql.end()
  ]
})

t('subscribe with transform', { timeout: 2 }, async() => {
  const sql = postgres({
    transform: {
      column: {
        from: postgres.toCamel,
        to: postgres.fromCamel
      }
    },
    database: 'postgres_js_test',
    publications: 'alltables'
  })

  await sql.unsafe('create publication alltables for all tables')

  const result = []

  const { unsubscribe } = await sql.subscribe('*', (row, { command, old }) =>
    result.push(command, row.nameInCamel || row.id, old && old.nameInCamel)
  )

  await sql`
    create table test (
      id serial primary key,
      name_in_camel text
    )
  `

  await sql`insert into test (name_in_camel) values ('Murray')`
  await sql`update test set name_in_camel = 'Rothbard'`
  await sql`delete from test`
  await sql`alter table test replica identity full`
  await sql`insert into test (name_in_camel) values ('Murray')`
  await sql`update test set name_in_camel = 'Rothbard'`
  await sql`delete from test`
  await delay(10)
  await unsubscribe()
  await sql`insert into test (name_in_camel) values ('Oh noes')`
  await delay(10)
  return [
    'insert,Murray,,update,Rothbard,,delete,1,,insert,Murray,,update,Rothbard,Murray,delete,Rothbard,',
    result.join(','),
    await sql`drop table test`,
    await sql`drop publication alltables`,
    await sql.end()
  ]
})

t('subscribe reconnects and calls onsubscribe', { timeout: 4 }, async() => {
  const sql = postgres({
    database: 'postgres_js_test',
    publications: 'alltables',
    fetch_types: false
  })

  await sql.unsafe('create publication alltables for all tables')

  const result = []
  let onsubscribes = 0

  const { unsubscribe, sql: subscribeSql } = await sql.subscribe(
    '*',
    (row, { command, old }) => result.push(command, row.name || row.id, old && old.name),
    () => onsubscribes++
  )

  await sql`
    create table test (
      id serial primary key,
      name text
    )
  `

  await sql`insert into test (name) values ('Murray')`
  await delay(10)
  await subscribeSql.close()
  await delay(500)
  await sql`delete from test`
  await delay(100)
  await unsubscribe()
  return [
    '2insert,Murray,,delete,1,',
    onsubscribes + result.join(','),
    await sql`drop table test`,
    await sql`drop publication alltables`,
    await sql.end()
  ]
})

t('Execute', async() => {
  const result = await new Promise((resolve) => {
    const sql = postgres({ ...options, fetch_types: false, debug:(id, query) => resolve(query) })
    sql`select 1`.execute()
  })

  return [result, 'select 1']
})

t('Cancel running query', async() => {
  const query = sql`select pg_sleep(2)`
  setTimeout(() => query.cancel(), 500)
  const error = await query.catch(x => x)
  return ['57014', error.code]
})

t('Cancel piped query', { timeout: 5 }, async() => {
  await sql`select 1`
  const last = sql`select pg_sleep(1)`.execute()
  const query = sql`select pg_sleep(2) as dig`
  setTimeout(() => query.cancel(), 500)
  const error = await query.catch(x => x)
  await last
  return ['57014', error.code]
})

t('Cancel queued query', async() => {
  const query = sql`select pg_sleep(2) as nej`
  const tx = sql.begin(sql => (
    query.cancel(),
    sql`select pg_sleep(0.5) as hej, 'hejsa'`
  ))
  const error = await query.catch(x => x)
  await tx
  return ['57014', error.code]
})

t('Fragments', async() => [
  1,
  (await sql`
    ${ sql`select` } 1 as x
  `)[0].x
])

t('Result becomes array', async() => [
  true,
  (await sql`select 1`).slice() instanceof Array
])

t('Describe', async() => {
  const type = (await sql`select ${ 1 }::int as x`.describe()).types[0]
  return [23, type]
})

t('Describe a statement', async() => {
  await sql`create table tester (name text, age int)`
  const r = await sql`select name, age from tester where name like $1 and age > $2`.describe()
  return [
    '25,23/name:25,age:23',
    `${ r.types.join(',') }/${ r.columns.map(c => `${c.name}:${c.type}`).join(',') }`,
    await sql`drop table tester`
  ]
})

t('Include table oid and column number in column details', async() => {
  await sql`create table tester (name text, age int)`
  const r = await sql`select name, age from tester where name like $1 and age > $2`.describe()
  const [{ oid }] = await sql`select oid from pg_class where relname = 'tester'`

  return [
    `table:${oid},number:1|table:${oid},number:2`,
    `${ r.columns.map(c => `table:${c.table},number:${c.number}`).join('|') }`,
    await sql`drop table tester`
  ]
})

t('Describe a statement without parameters', async() => {
  await sql`create table tester (name text, age int)`
  const r = await sql`select name, age from tester`.describe()
  return [
    '0,2',
    `${ r.types.length },${ r.columns.length }`,
    await sql`drop table tester`
  ]
})

t('Describe a statement without columns', async() => {
  await sql`create table tester (name text, age int)`
  const r = await sql`insert into tester (name, age) values ($1, $2)`.describe()
  return [
    '2,0',
    `${ r.types.length },${ r.columns.length }`,
    await sql`drop table tester`
  ]
})

t('Large object', async() => {
  const file = rel('index.js')
      , md5 = crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex')

  const lo = await sql.largeObject()
  await new Promise(async r => fs.createReadStream(file).pipe(await lo.writable()).on('finish', r))
  await lo.seek(0)

  const out = crypto.createHash('md5')
  await new Promise(r => lo.readable().then(x => x.on('data', x => out.update(x)).on('end', r)))

  return [
    md5,
    out.digest('hex'),
    await lo.close()
  ]
})

t('Catches type serialize errors', async() => {
  const sql = postgres({
    idle_timeout,
    types: {
      text: {
        from: 25,
        to: 25,
        parse: x => x,
        serialize: () => { throw new Error('watSerialize') }
      }
    }
  })

  return [
    'watSerialize',
    (await sql`select ${ 'wat' }`.catch(e => e.message))
  ]
})

t('Catches type parse errors', async() => {
  const sql = postgres({
    idle_timeout,
    types: {
      text: {
        from: 25,
        to: 25,
        parse: () => { throw new Error('watParse') },
        serialize: x => x
      }
    }
  })

  return [
    'watParse',
    (await sql`select 'wat'`.catch(e => e.message))
  ]
})

t('Catches type serialize errors in transactions', async() => {
  const sql = postgres({
    idle_timeout,
    types: {
      text: {
        from: 25,
        to: 25,
        parse: x => x,
        serialize: () => { throw new Error('watSerialize') }
      }
    }
  })

  return [
    'watSerialize',
    (await sql.begin(sql => (
      sql`select 1`,
      sql`select ${ 'wat' }`
    )).catch(e => e.message))
  ]
})

t('Catches type parse errors in transactions', async() => {
  const sql = postgres({
    idle_timeout,
    types: {
      text: {
        from: 25,
        to: 25,
        parse: () => { throw new Error('watParse') },
        serialize: x => x
      }
    }
  })

  return [
    'watParse',
    (await sql.begin(sql => (
      sql`select 1`,
      sql`select 'wat'`
    )).catch(e => e.message))
  ]
})

t('Prevent premature end of connection in transaction', async() => {
  const sql = postgres({ max_lifetime: 0.01, idle_timeout })
  const result = await sql.begin(async sql => {
    await sql`select 1`
    await delay(20)
    await sql`select 1`
    return 'yay'
  })


  return [
    'yay',
    result
  ]
})

t('Ensure reconnect after max_lifetime with transactions', { timeout: 5 }, async() => {
  const sql = postgres({
    max_lifetime: 0.01,
    idle_timeout,
    max: 1
  })

  let x = 0
  while (x++ < 10) await sql.begin(sql => sql`select 1 as x`)

  return [true, true]
})


t('Ensure transactions throw if connection is closed dwhile there is no query', async() => {
  const sql = postgres(options)
  const x = await sql.begin(async() => {
    setTimeout(() => sql.end({ timeout: 0 }), 10)
    await new Promise(r => setTimeout(r, 200))
    return sql`select 1`
  }).catch(x => x)
  return ['CONNECTION_CLOSED', x.code]
})

t('Custom socket', {}, async() => {
  let result
  const sql = postgres({
    socket: () => new Promise((resolve, reject) => {
      const socket = new net.Socket()
      socket.connect(5432)
      socket.once('data', x => result = x[0])
      socket.on('error', reject)
      socket.on('connect', () => resolve(socket))
    }),
    idle_timeout
  })

  await sql`select 1`

  return [
    result,
    82
  ]
})

t('Ensure drain only dequeues if ready', async() => {
  const sql = postgres(options)

  const res = await Promise.all([
    sql.unsafe('SELECT 0+$1 --' + '.'.repeat(100000), [1]),
    sql.unsafe('SELECT 0+$1+$2+$3', [1, 2, 3])
  ])

  return [res.length, 2]
})

t('Supports fragments as dynamic parameters', async() => {
  await sql`create table test (a int, b bool)`
  await sql`insert into test values(1, true)`
  await sql`insert into test ${
    sql({
      a: 2,
      b: sql`exists(select 1 from test where b = ${ true })`
    })
  }`

  return [
    '1,t2,t',
    (await sql`select * from test`.raw()).join(''),
    await sql`drop table test`
  ]
})

t('Supports nested fragments with parameters', async() => {
  await sql`create table test ${
    sql`(${ sql('a') } ${ sql`int` })`
  }`
  await sql`insert into test values(1)`
  return [
    1,
    (await sql`select a from test`)[0].a,
    await sql`drop table test`
  ]
})

t('Supports multiple nested fragments with parameters', async() => {
  const [{ b }] = await sql`select * ${
    sql`from ${
      sql`(values (2, ${ 1 }::int)) as x(${ sql(['a', 'b']) })`
    }`
  }`
  return [
    1,
    b
  ]
})

t('Supports arrays of fragments', async() => {
  const [{ x }] = await sql`
    ${ [sql`select`, sql`1`, sql`as`, sql`x`] }
  `

  return [
    1,
    x
  ]
})

t('Does not try rollback when commit errors', async() => {
  let notice = null
  const sql = postgres({ ...options, onnotice: x => notice = x })
  await sql`create table test(x int constraint test_constraint unique deferrable initially deferred)`

  await sql.begin('isolation level serializable', async sql => {
    await sql`insert into test values(1)`
    await sql`insert into test values(1)`
  }).catch(e => e)

  return [
    notice,
    null,
    await sql`drop table test`
  ]
})

t('Last keyword used even with duplicate keywords', async() => {
  await sql`create table test (x int)`
  await sql`insert into test values(1)`
  const [{ x }] = await sql`
    select
      1 in (1) as x
    from test
    where x in ${ sql([1, 2]) }
  `

  return [x, true, await sql`drop table test`]
})

t('Insert array with null', async() => {
  await sql`create table test (x int[])`
  await sql`insert into test ${ sql({ x: [1, null, 3] }) }`
  return [
    1,
    (await sql`select x from test`)[0].x[0],
    await sql`drop table test`
  ]
})

t('Insert array with undefined throws', async() => {
  await sql`create table test (x int[])`
  return [
    'UNDEFINED_VALUE',
    await sql`insert into test ${ sql({ x: [1, undefined, 3] }) }`.catch(e => e.code),
    await sql`drop table test`
  ]
})

t('Insert array with undefined transform', async() => {
  const sql = postgres({ ...options, transform: { undefined: null } })
  await sql`create table test (x int[])`
  await sql`insert into test ${ sql({ x: [1, undefined, 3] }) }`
  return [
    1,
    (await sql`select x from test`)[0].x[0],
    await sql`drop table test`
  ]
})

t('concurrent cursors', async() => {
  const xs = []

  await Promise.all([...Array(7)].map((x, i) => [
    sql`select ${ i }::int as a, generate_series(1, 2) as x`.cursor(([x]) => xs.push(x.a + x.x))
  ]).flat())

  return ['12233445566778', xs.join('')]
})

t('concurrent cursors multiple connections', async() => {
  const sql = postgres({ ...options, max: 2 })
  const xs = []

  await Promise.all([...Array(7)].map((x, i) => [
    sql`select ${ i }::int as a, generate_series(1, 2) as x`.cursor(([x]) => xs.push(x.a + x.x))
  ]).flat())

  return ['12233445566778', xs.sort().join('')]
})

t('reserve connection', async() => {
  const reserved = await sql.reserve()

  setTimeout(() => reserved.release(), 510)

  const xs = await Promise.all([
    reserved`select 1 as x`.then(([{ x }]) => ({ time: Date.now(), x })),
    sql`select 2 as x`.then(([{ x }]) => ({ time: Date.now(), x })),
    reserved`select 3 as x`.then(([{ x }]) => ({ time: Date.now(), x }))
  ])

  if (xs[1].time - xs[2].time < 500)
    throw new Error('Wrong time')

  return [
    '123',
    xs.map(x => x.x).join('')
  ]
})

t('arrays in reserved connection', async() => {
  const reserved = await sql.reserve()
  const [{ x }] = await reserved`select array[1, 2, 3] as x`
  reserved.release()

  return [
    '123',
    x.join('')
  ]
})

t('Ensure reserve on query throws proper error', async() => {
  const sql = postgres({ idle_timeout }) // eslint-disable-line
  const reserved = await sql.reserve()
  const [{ x }] = await reserved`select 'wat' as x`

  return [
    'wat', x, reserved.release()
  ]
})

;globalThis.addEventListener("unload", () => Deno.exit(process.exitCode))
```

---

### test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/afc848c316-postgres/deno/tests/test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
import process from 'https://deno.land/std@0.132.0/node/process.ts'
/* eslint no-console: 0 */

import util from 'https://deno.land/std@0.132.0/node/util.ts'

let done = 0
let only = false
let ignored = 0
let failed = false
let promise = Promise.resolve()
const tests = {}
    , ignore = {}

export const nt = () => ignored++
export const ot = (...rest) => (only = true, test(true, ...rest))
export const t = (...rest) => test(false, ...rest)
t.timeout = 5

async function test(o, name, options, fn) {
  typeof options !== 'object' && (fn = options, options = {})
  const line = new Error().stack.split('\n')[3].match(':([0-9]+):')[1]

  await 1

  if (only && !o)
    return

  tests[line] = { fn, line, name }
  promise = promise.then(() => Promise.race([
    new Promise((resolve, reject) =>
      fn.timer = setTimeout(() => reject('Timed out'), (options.timeout || t.timeout) * 1000)
    ),
    failed
      ? (ignored++, ignore)
      : fn()
  ]))
    .then(async x => {
      clearTimeout(fn.timer)
      if (x === ignore)
        return

      if (!Array.isArray(x))
        throw new Error('Test should return result array')

      const [expected, got] = await Promise.all(x)
      if (expected !== got) {
        failed = true
        throw new Error(util.inspect(expected) + ' != ' + util.inspect(got))
      }

      tests[line].succeeded = true
      process.stdout.write('✅')
    })
    .catch(err => {
      tests[line].failed = failed = true
      tests[line].error = err instanceof Error ? err : new Error(util.inspect(err))
    })
    .then(() => {
      ++done === Object.keys(tests).length && exit()
    })
}

function exit() {
  let success = true
  Object.values(tests).every((x) => {
    if (x.succeeded)
      return true

    success = false
    x.cleanup
      ? console.error('⛔️', x.name + ' at line', x.line, 'cleanup failed', '\n', util.inspect(x.cleanup))
      : console.error('⛔️', x.name + ' at line', x.line, x.failed
        ? 'failed'
        : 'never finished', x.error ? '\n' + util.inspect(x.error) : ''
      )
  })

  only
    ? console.error('⚠️', 'Not all tests were run')
    : ignored
      ? console.error('⚠️', ignored, 'ignored test' + (ignored === 1 ? '' : 's', '\n'))
      : success
        ? console.log('🎉')
        : console.error('⚠️', 'Not good')

  !process.exitCode && (!success || only || ignored) && (process.exitCode = 1)
}


```

---

### bootstrap.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/afc848c316-postgres/tests/bootstrap.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
import { spawnSync } from 'child_process'

exec('dropdb', ['postgres_js_test'])

exec('psql', ['-c', 'alter system set ssl=on'])
exec('psql', ['-c', 'drop user postgres_js_test'])
exec('psql', ['-c', 'create user postgres_js_test'])
exec('psql', ['-c', 'alter system set password_encryption=md5'])
exec('psql', ['-c', 'select pg_reload_conf()'])
exec('psql', ['-c', 'drop user if exists postgres_js_test_md5'])
exec('psql', ['-c', 'create user postgres_js_test_md5 with password \'postgres_js_test_md5\''])
exec('psql', ['-c', 'alter system set password_encryption=\'scram-sha-256\''])
exec('psql', ['-c', 'select pg_reload_conf()'])
exec('psql', ['-c', 'drop user if exists postgres_js_test_scram'])
exec('psql', ['-c', 'create user postgres_js_test_scram with password \'postgres_js_test_scram\''])

exec('createdb', ['postgres_js_test'])
exec('psql', ['-c', 'grant all on database postgres_js_test to postgres_js_test'])
exec('psql', ['-c', 'alter database postgres_js_test owner to postgres_js_test'])

export function exec(cmd, args) {
  const { stderr } = spawnSync(cmd, args, { stdio: 'pipe', encoding: 'utf8' })
  if (stderr && !stderr.includes('already exists') && !stderr.includes('does not exist'))
    throw stderr
}

async function execAsync(cmd, args) { // eslint-disable-line
  let stderr = ''
  const cp = await spawn(cmd, args, { stdio: 'pipe', encoding: 'utf8' }) // eslint-disable-line
  cp.stderr.on('data', x => stderr += x)
  await new Promise(x => cp.on('exit', x))
  if (stderr && !stderr.includes('already exists') && !stderr.includes('does not exist'))
    throw new Error(stderr)
}

```

---

### index.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/afc848c316-postgres/tests/index.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
import { exec } from './bootstrap.js'

import { t, nt, ot } from './test.js' // eslint-disable-line
import net from 'net'
import fs from 'fs'
import crypto from 'crypto'

import postgres from '../src/index.js'
const delay = ms => new Promise(r => setTimeout(r, ms))

const rel = x => new URL(x, import.meta.url)
const idle_timeout = 1

const login = {
  user: 'postgres_js_test'
}

const login_md5 = {
  user: 'postgres_js_test_md5',
  pass: 'postgres_js_test_md5'
}

const login_scram = {
  user: 'postgres_js_test_scram',
  pass: 'postgres_js_test_scram'
}

const options = {
  db: 'postgres_js_test',
  user: login.user,
  pass: login.pass,
  idle_timeout,
  connect_timeout: 1,
  max: 1
}

const sql = postgres(options)

t('Connects with no options', async() => {
  const sql = postgres({ max: 1 })

  const result = (await sql`select 1 as x`)[0].x
  await sql.end()

  return [1, result]
})

t('Uses default database without slash', async() => {
  const sql = postgres('postgres://localhost')
  return [sql.options.user, sql.options.database]
})

t('Uses default database with slash', async() => {
  const sql = postgres('postgres://localhost/')
  return [sql.options.user, sql.options.database]
})

t('Result is array', async() =>
  [true, Array.isArray(await sql`select 1`)]
)

t('Result has count', async() =>
  [1, (await sql`select 1`).count]
)

t('Result has command', async() =>
  ['SELECT', (await sql`select 1`).command]
)

t('Create table', async() =>
  ['CREATE TABLE', (await sql`create table test(int int)`).command, await sql`drop table test`]
)

t('Drop table', { timeout: 2 }, async() => {
  await sql`create table test(int int)`
  return ['DROP TABLE', (await sql`drop table test`).command]
})

t('null', async() =>
  [null, (await sql`select ${ null } as x`)[0].x]
)

t('Integer', async() =>
  ['1', (await sql`select ${ 1 } as x`)[0].x]
)

t('String', async() =>
  ['hello', (await sql`select ${ 'hello' } as x`)[0].x]
)

t('Boolean false', async() =>
  [false, (await sql`select ${ false } as x`)[0].x]
)

t('Boolean true', async() =>
  [true, (await sql`select ${ true } as x`)[0].x]
)

t('Date', async() => {
  const now = new Date()
  return [0, now - (await sql`select ${ now } as x`)[0].x]
})

t('Json', async() => {
  const x = (await sql`select ${ sql.json({ a: 'hello', b: 42 }) } as x`)[0].x
  return ['hello,42', [x.a, x.b].join()]
})

t('implicit json', async() => {
  const x = (await sql`select ${ { a: 'hello', b: 42 } }::json as x`)[0].x
  return ['hello,42', [x.a, x.b].join()]
})

t('implicit jsonb', async() => {
  const x = (await sql`select ${ { a: 'hello', b: 42 } }::jsonb as x`)[0].x
  return ['hello,42', [x.a, x.b].join()]
})

t('Empty array', async() =>
  [true, Array.isArray((await sql`select ${ sql.array([], 1009) } as x`)[0].x)]
)

t('String array', async() =>
  ['123', (await sql`select ${ '{1,2,3}' }::int[] as x`)[0].x.join('')]
)

t('Array of Integer', async() =>
  ['3', (await sql`select ${ sql.array([1, 2, 3]) } as x`)[0].x[2]]
)

t('Array of String', async() =>
  ['c', (await sql`select ${ sql.array(['a', 'b', 'c']) } as x`)[0].x[2]]
)

t('Array of Date', async() => {
  const now = new Date()
  return [now.getTime(), (await sql`select ${ sql.array([now, now, now]) } as x`)[0].x[2].getTime()]
})

t('Array of Box', async() => [
  '(3,4),(1,2);(6,7),(4,5)',
  (await sql`select ${ '{(1,2),(3,4);(4,5),(6,7)}' }::box[] as x`)[0].x.join(';')
])

t('Nested array n2', async() =>
  ['4', (await sql`select ${ sql.array([[1, 2], [3, 4]]) } as x`)[0].x[1][1]]
)

t('Nested array n3', async() =>
  ['6', (await sql`select ${ sql.array([[[1, 2]], [[3, 4]], [[5, 6]]]) } as x`)[0].x[2][0][1]]
)

t('Escape in arrays', async() =>
  ['Hello "you",c:\\windows', (await sql`select ${ sql.array(['Hello "you"', 'c:\\windows']) } as x`)[0].x.join(',')]
)

t('Escapes', async() => {
  return ['hej"hej', Object.keys((await sql`select 1 as ${ sql('hej"hej') }`)[0])[0]]
})

t('null for int', async() => {
  await sql`create table test (x int)`
  return [1, (await sql`insert into test values(${ null })`).count, await sql`drop table test`]
})

t('Throws on illegal transactions', async() => {
  const sql = postgres({ ...options, max: 2, fetch_types: false })
  const error = await sql`begin`.catch(e => e)
  return [
    error.code,
    'UNSAFE_TRANSACTION'
  ]
})

t('Transaction throws', async() => {
  await sql`create table test (a int)`
  return ['22P02', await sql.begin(async sql => {
    await sql`insert into test values(1)`
    await sql`insert into test values('hej')`
  }).catch(x => x.code), await sql`drop table test`]
})

t('Transaction rolls back', async() => {
  await sql`create table test (a int)`
  await sql.begin(async sql => {
    await sql`insert into test values(1)`
    await sql`insert into test values('hej')`
  }).catch(() => { /* ignore */ })
  return [0, (await sql`select a from test`).count, await sql`drop table test`]
})

t('Transaction throws on uncaught savepoint', async() => {
  await sql`create table test (a int)`

  return ['fail', (await sql.begin(async sql => {
    await sql`insert into test values(1)`
    await sql.savepoint(async sql => {
      await sql`insert into test values(2)`
      throw new Error('fail')
    })
  }).catch((err) => err.message)), await sql`drop table test`]
})

t('Transaction throws on uncaught named savepoint', async() => {
  await sql`create table test (a int)`

  return ['fail', (await sql.begin(async sql => {
    await sql`insert into test values(1)`
    await sql.savepoit('watpoint', async sql => {
      await sql`insert into test values(2)`
      throw new Error('fail')
    })
  }).catch(() => 'fail')), await sql`drop table test`]
})

t('Transaction succeeds on caught savepoint', async() => {
  await sql`create table test (a int)`
  await sql.begin(async sql => {
    await sql`insert into test values(1)`
    await sql.savepoint(async sql => {
      await sql`insert into test values(2)`
      throw new Error('please rollback')
    }).catch(() => { /* ignore */ })
    await sql`insert into test values(3)`
  })

  return ['2', (await sql`select count(1) from test`)[0].count, await sql`drop table test`]
})

t('Savepoint returns Result', async() => {
  let result
  await sql.begin(async sql => {
    result = await sql.savepoint(sql =>
      sql`select 1 as x`
    )
  })

  return [1, result[0].x]
})

t('Prepared transaction', async() => {
  await sql`create table test (a int)`

  await sql.begin(async sql => {
    await sql`insert into test values(1)`
    await sql.prepare('tx1')
  })

  await sql`commit prepared 'tx1'`

  return ['1', (await sql`select count(1) from test`)[0].count, await sql`drop table test`]
})

t('Transaction requests are executed implicitly', async() => {
  const sql = postgres({ debug: true, idle_timeout: 1, fetch_types: false })
  return [
    'testing',
    (await sql.begin(sql => [
      sql`select set_config('postgres_js.test', 'testing', true)`,
      sql`select current_setting('postgres_js.test') as x`
    ]))[1][0].x
  ]
})

t('Uncaught transaction request errors bubbles to transaction', async() => [
  '42703',
  (await sql.begin(sql => [
    sql`select wat`,
    sql`select current_setting('postgres_js.test') as x, ${ 1 } as a`
  ]).catch(e => e.code))
])

t('Fragments in transactions', async() => [
  true,
  (await sql.begin(sql => sql`select true as x where ${ sql`1=1` }`))[0].x
])

t('Transaction rejects with rethrown error', async() => [
  'WAT',
  await sql.begin(async sql => {
    try {
      await sql`select exception`
    } catch (ex) {
      throw new Error('WAT')
    }
  }).catch(e => e.message)
])

t('Parallel transactions', async() => {
  await sql`create table test (a int)`
  return ['11', (await Promise.all([
    sql.begin(sql => sql`select 1`),
    sql.begin(sql => sql`select 1`)
  ])).map(x => x.count).join(''), await sql`drop table test`]
})

t('Many transactions at beginning of connection', async() => {
  const sql = postgres(options)
  const xs = await Promise.all(Array.from({ length: 100 }, () => sql.begin(sql => sql`select 1`)))
  return [100, xs.length]
})

t('Transactions array', async() => {
  await sql`create table test (a int)`

  return ['11', (await sql.begin(sql => [
    sql`select 1`.then(x => x),
    sql`select 1`
  ])).map(x => x.count).join(''), await sql`drop table test`]
})

t('Transaction waits', async() => {
  await sql`create table test (a int)`
  await sql.begin(async sql => {
    await sql`insert into test values(1)`
    await sql.savepoint(async sql => {
      await sql`insert into test values(2)`
      throw new Error('please rollback')
    }).catch(() => { /* ignore */ })
    await sql`insert into test values(3)`
  })

  return ['11', (await Promise.all([
    sql.begin(sql => sql`select 1`),
    sql.begin(sql => sql`select 1`)
  ])).map(x => x.count).join(''), await sql`drop table test`]
})

t('Helpers in Transaction', async() => {
  return ['1', (await sql.begin(async sql =>
    await sql`select ${ sql({ x: 1 }) }`
  ))[0].x]
})

t('Undefined values throws', async() => {
  let error

  await sql`
    select ${ undefined } as x
  `.catch(x => error = x.code)

  return ['UNDEFINED_VALUE', error]
})

t('Transform undefined', async() => {
  const sql = postgres({ ...options, transform: { undefined: null } })
  return [null, (await sql`select ${ undefined } as x`)[0].x]
})

t('Transform undefined in array', async() => {
  const sql = postgres({ ...options, transform: { undefined: null } })
  return [null, (await sql`select * from (values ${ sql([undefined, undefined]) }) as x(x, y)`)[0].y]
})

t('Null sets to null', async() =>
  [null, (await sql`select ${ null } as x`)[0].x]
)

t('Throw syntax error', async() =>
  ['42601', (await sql`wat 1`.catch(x => x)).code]
)

t('Connect using uri', async() =>
  [true, await new Promise((resolve, reject) => {
    const sql = postgres('postgres://' + login.user + ':' + (login.pass || '') + '@localhost:5432/' + options.db, {
      idle_timeout
    })
    sql`select 1`.then(() => resolve(true), reject)
  })]
)

t('Options from uri with special characters in user and pass', async() => {
  const opt = postgres({ user: 'öla', pass: 'pass^word' }).options
  return [[opt.user, opt.pass].toString(), 'öla,pass^word']
})

t('Fail with proper error on no host', async() =>
  ['ECONNREFUSED', (await new Promise((resolve, reject) => {
    const sql = postgres('postgres://localhost:33333/' + options.db, {
      idle_timeout
    })
    sql`select 1`.then(reject, resolve)
  })).code]
)

t('Connect using SSL', async() =>
  [true, (await new Promise((resolve, reject) => {
    postgres({
      ssl: { rejectUnauthorized: false },
      idle_timeout
    })`select 1`.then(() => resolve(true), reject)
  }))]
)

t('Connect using SSL require', async() =>
  [true, (await new Promise((resolve, reject) => {
    postgres({
      ssl: 'require',
      idle_timeout
    })`select 1`.then(() => resolve(true), reject)
  }))]
)

t('Connect using SSL prefer', async() => {
  await exec('psql', ['-c', 'alter system set ssl=off'])
  await exec('psql', ['-c', 'select pg_reload_conf()'])

  const sql = postgres({
    ssl: 'prefer',
    idle_timeout
  })

  return [
    1, (await sql`select 1 as x`)[0].x,
    await exec('psql', ['-c', 'alter system set ssl=on']),
    await exec('psql', ['-c', 'select pg_reload_conf()'])
  ]
})

t('Reconnect using SSL', { timeout: 2 }, async() => {
  const sql = postgres({
    ssl: 'require',
    idle_timeout: 0.1
  })

  await sql`select 1`
  await delay(200)

  return [1, (await sql`select 1 as x`)[0].x]
})

t('Proper handling of non object Errors', async() => {
  const sql = postgres({ socket: () => { throw 'wat' } }) // eslint-disable-line

  return [
    'wat', await sql`select 1 as x`.catch(e => e.message)
  ]
})

t('Proper handling of null Errors', async() => {
  const sql = postgres({ socket: () => { throw null } }) // eslint-disable-line

  return [
    'null', await sql`select 1 as x`.catch(e => e.message)
  ]
})

t('Ensure reserve on connection throws proper error', async() => {
  const sql = postgres({ socket: () => { throw 'wat' }, idle_timeout }) // eslint-disable-line

  return [
    'wat', await sql.reserve().catch(e => e)
  ]
})

t('Login without password', async() => {
  return [true, (await postgres({ ...options, ...login })`select true as x`)[0].x]
})

t('Login using MD5', async() => {
  return [true, (await postgres({ ...options, ...login_md5 })`select true as x`)[0].x]
})

t('Login using scram-sha-256', async() => {
  return [true, (await postgres({ ...options, ...login_scram })`select true as x`)[0].x]
})

t('Parallel connections using scram-sha-256', {
  timeout: 2
}, async() => {
  const sql = postgres({ ...options, ...login_scram })
  return [true, (await Promise.all([
    sql`select true as x, pg_sleep(0.01)`,
    sql`select true as x, pg_sleep(0.01)`,
    sql`select true as x, pg_sleep(0.01)`
  ]))[0][0].x]
})

t('Support dynamic password function', async() => {
  return [true, (await postgres({
    ...options,
    ...login_scram,
    pass: () => 'postgres_js_test_scram'
  })`select true as x`)[0].x]
})

t('Support dynamic async password function', async() => {
  return [true, (await postgres({
    ...options,
    ...login_scram,
    pass: () => Promise.resolve('postgres_js_test_scram')
  })`select true as x`)[0].x]
})

t('Point type', async() => {
  const sql = postgres({
    ...options,
    types: {
      point: {
        to: 600,
        from: [600],
        serialize: ([x, y]) => '(' + x + ',' + y + ')',
        parse: (x) => x.slice(1, -1).split(',').map(x => +x)
      }
    }
  })

  await sql`create table test (x point)`
  await sql`insert into test (x) values (${ sql.types.point([10, 20]) })`
  return [20, (await sql`select x from test`)[0].x[1], await sql`drop table test`]
})

t('Point type array', async() => {
  const sql = postgres({
    ...options,
    types: {
      point: {
        to: 600,
        from: [600],
        serialize: ([x, y]) => '(' + x + ',' + y + ')',
        parse: (x) => x.slice(1, -1).split(',').map(x => +x)
      }
    }
  })

  await sql`create table test (x point[])`
  await sql`insert into test (x) values (${ sql.array([sql.types.point([10, 20]), sql.types.point([20, 30])]) })`
  return [30, (await sql`select x from test`)[0].x[1][1], await sql`drop table test`]
})

t('sql file', async() =>
  [1, (await sql.file(rel('select.sql')))[0].x]
)

t('sql file has forEach', async() => {
  let result
  await sql
    .file(rel('select.sql'), { cache: false })
    .forEach(({ x }) => result = x)

  return [1, result]
})

t('sql file throws', async() =>
  ['ENOENT', (await sql.file(rel('selectomondo.sql')).catch(x => x.code))]
)

t('sql file cached', async() => {
  await sql.file(rel('select.sql'))
  await delay(20)

  return [1, (await sql.file(rel('select.sql')))[0].x]
})

t('Parameters in file', async() => {
  const result = await sql.file(
    rel('select-param.sql'),
    ['hello']
  )
  return ['hello', result[0].x]
})

t('Connection ended promise', async() => {
  const sql = postgres(options)

  await sql.end()

  return [undefined, await sql.end()]
})

t('Connection ended timeout', async() => {
  const sql = postgres(options)

  await sql.end({ timeout: 10 })

  return [undefined, await sql.end()]
})

t('Connection ended error', async() => {
  const sql = postgres(options)
  await sql.end()
  return ['CONNECTION_ENDED', (await sql``.catch(x => x.code))]
})

t('Connection end does not cancel query', async() => {
  const sql = postgres(options)

  const promise = sql`select 1 as x`.execute()

  await sql.end()

  return [1, (await promise)[0].x]
})

t('Connection destroyed', async() => {
  const sql = postgres(options)
  process.nextTick(() => sql.end({ timeout: 0 }))
  return ['CONNECTION_DESTROYED', await sql``.catch(x => x.code)]
})

t('Connection destroyed with query before', async() => {
  const sql = postgres(options)
      , error = sql`select pg_sleep(0.2)`.catch(err => err.code)

  sql.end({ timeout: 0 })
  return ['CONNECTION_DESTROYED', await error]
})

t('transform column', async() => {
  const sql = postgres({
    ...options,
    transform: { column: x => x.split('').reverse().join('') }
  })

  await sql`create table test (hello_world int)`
  await sql`insert into test values (1)`
  return ['dlrow_olleh', Object.keys((await sql`select * from test`)[0])[0], await sql`drop table test`]
})

t('column toPascal', async() => {
  const sql = postgres({
    ...options,
    transform: { column: postgres.toPascal }
  })

  await sql`create table test (hello_world int)`
  await sql`insert into test values (1)`
  return ['HelloWorld', Object.keys((await sql`select * from test`)[0])[0], await sql`drop table test`]
})

t('column toCamel', async() => {
  const sql = postgres({
    ...options,
    transform: { column: postgres.toCamel }
  })

  await sql`create table test (hello_world int)`
  await sql`insert into test values (1)`
  return ['helloWorld', Object.keys((await sql`select * from test`)[0])[0], await sql`drop table test`]
})

t('column toKebab', async() => {
  const sql = postgres({
    ...options,
    transform: { column: postgres.toKebab }
  })

  await sql`create table test (hello_world int)`
  await sql`insert into test values (1)`
  return ['hello-world', Object.keys((await sql`select * from test`)[0])[0], await sql`drop table test`]
})

t('Transform nested json in arrays', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.camel
  })
  return ['aBcD', (await sql`select '[{"a_b":1},{"c_d":2}]'::jsonb as x`)[0].x.map(Object.keys).join('')]
})

t('Transform deeply nested json object in arrays', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.camel
  })
  return [
    'childObj_deeplyNestedObj_grandchildObj',
    (await sql`
      select '[{"nested_obj": {"child_obj": 2, "deeply_nested_obj": {"grandchild_obj": 3}}}]'::jsonb as x
    `)[0].x.map(x => {
      let result
      for (const key in x)
        result = [...Object.keys(x[key]), ...Object.keys(x[key].deeplyNestedObj)]
      return result
    })[0]
    .join('_')
  ]
})

t('Transform deeply nested json array in arrays', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.camel
  })
  return [
    'childArray_deeplyNestedArray_grandchildArray',
    (await sql`
      select '[{"nested_array": [{"child_array": 2, "deeply_nested_array": [{"grandchild_array":3}]}]}]'::jsonb AS x
    `)[0].x.map((x) => {
      let result
      for (const key in x)
        result = [...Object.keys(x[key][0]), ...Object.keys(x[key][0].deeplyNestedArray[0])]
      return result
    })[0]
    .join('_')
  ]
})

t('Bypass transform for json primitive', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.camel
  })

  const x = (
    await sql`select 'null'::json as a, 'false'::json as b, '"a"'::json as c, '1'::json as d`
  )[0]

  return [
    JSON.stringify({ a: null, b: false, c: 'a', d: 1 }),
    JSON.stringify(x)
  ]
})

t('Bypass transform for jsonb primitive', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.camel
  })

  const x = (
    await sql`select 'null'::jsonb as a, 'false'::jsonb as b, '"a"'::jsonb as c, '1'::jsonb as d`
  )[0]

  return [
    JSON.stringify({ a: null, b: false, c: 'a', d: 1 }),
    JSON.stringify(x)
  ]
})

t('unsafe', async() => {
  await sql`create table test (x int)`
  return [1, (await sql.unsafe('insert into test values ($1) returning *', [1]))[0].x, await sql`drop table test`]
})

t('unsafe simple', async() => {
  return [1, (await sql.unsafe('select 1 as x'))[0].x]
})

t('unsafe simple includes columns', async() => {
  return ['x', (await sql.unsafe('select 1 as x').values()).columns[0].name]
})

t('unsafe describe', async() => {
  const q = 'insert into test values (1)'
  await sql`create table test(a int unique)`
  await sql.unsafe(q).describe()
  const x = await sql.unsafe(q).describe()
  return [
    q,
    x.string,
    await sql`drop table test`
  ]
})

t('simple query using unsafe with multiple statements', async() => {
  return [
    '1,2',
    (await sql.unsafe('select 1 as x;select 2 as x')).map(x => x[0].x).join()
  ]
})

t('simple query using simple() with multiple statements', async() => {
  return [
    '1,2',
    (await sql`select 1 as x;select 2 as x`.simple()).map(x => x[0].x).join()
  ]
})

t('listen and notify', async() => {
  const sql = postgres(options)
  const channel = 'hello'
  const result = await new Promise(async r => {
    await sql.listen(channel, r)
    sql.notify(channel, 'works')
  })

  return [
    'works',
    result,
    sql.end()
  ]
})

t('double listen', async() => {
  const sql = postgres(options)
      , channel = 'hello'

  let count = 0

  await new Promise((resolve, reject) =>
    sql.listen(channel, resolve)
    .then(() => sql.notify(channel, 'world'))
    .catch(reject)
  ).then(() => count++)

  await new Promise((resolve, reject) =>
    sql.listen(channel, resolve)
    .then(() => sql.notify(channel, 'world'))
    .catch(reject)
  ).then(() => count++)

  // for coverage
  sql.listen('weee', () => { /* noop */ }).then(sql.end)

  return [2, count]
})

t('multiple listeners work after a reconnect', async() => {
  const sql = postgres(options)
      , xs = []

  const s1 = await sql.listen('test', x => xs.push('1', x))
  await sql.listen('test', x => xs.push('2', x))
  await sql.notify('test', 'a')
  await delay(50)
  await sql`select pg_terminate_backend(${ s1.state.pid })`
  await delay(200)
  await sql.notify('test', 'b')
  await delay(50)
  sql.end()

  return ['1a2a1b2b', xs.join('')]
})

t('listen and notify with weird name', async() => {
  const sql = postgres(options)
  const channel = 'wat-;.ø.§'
  const result = await new Promise(async r => {
    const { unlisten } = await sql.listen(channel, r)
    sql.notify(channel, 'works')
    await delay(50)
    await unlisten()
  })

  return [
    'works',
    result,
    sql.end()
  ]
})

t('listen and notify with upper case', async() => {
  const sql = postgres(options)
  const channel = 'withUpperChar'
  const result = await new Promise(async r => {
    await sql.listen(channel, r)
    sql.notify(channel, 'works')
  })

  return [
    'works',
    result,
    sql.end()
  ]
})

t('listen reconnects', { timeout: 2 }, async() => {
  const sql = postgres(options)
      , resolvers = {}
      , a = new Promise(r => resolvers.a = r)
      , b = new Promise(r => resolvers.b = r)

  let connects = 0

  const { state: { pid } } = await sql.listen(
    'test',
    x => x in resolvers && resolvers[x](),
    () => connects++
  )
  await sql.notify('test', 'a')
  await a
  await sql`select pg_terminate_backend(${ pid })`
  await delay(100)
  await sql.notify('test', 'b')
  await b
  sql.end()
  return [connects, 2]
})

t('listen result reports correct connection state after reconnection', async() => {
  const sql = postgres(options)
      , xs = []

  const result = await sql.listen('test', x => xs.push(x))
  const initialPid = result.state.pid
  await sql.notify('test', 'a')
  await sql`select pg_terminate_backend(${ initialPid })`
  await delay(50)
  sql.end()

  return [result.state.pid !== initialPid, true]
})

t('unlisten removes subscription', async() => {
  const sql = postgres(options)
      , xs = []

  const { unlisten } = await sql.listen('test', x => xs.push(x))
  await sql.notify('test', 'a')
  await delay(50)
  await unlisten()
  await sql.notify('test', 'b')
  await delay(50)
  sql.end()

  return ['a', xs.join('')]
})

t('listen after unlisten', async() => {
  const sql = postgres(options)
      , xs = []

  const { unlisten } = await sql.listen('test', x => xs.push(x))
  await sql.notify('test', 'a')
  await delay(50)
  await unlisten()
  await sql.notify('test', 'b')
  await delay(50)
  await sql.listen('test', x => xs.push(x))
  await sql.notify('test', 'c')
  await delay(50)
  sql.end()

  return ['ac', xs.join('')]
})

t('multiple listeners and unlisten one', async() => {
  const sql = postgres(options)
      , xs = []

  await sql.listen('test', x => xs.push('1', x))
  const s2 = await sql.listen('test', x => xs.push('2', x))
  await sql.notify('test', 'a')
  await delay(50)
  await s2.unlisten()
  await sql.notify('test', 'b')
  await delay(50)
  sql.end()

  return ['1a2a1b', xs.join('')]
})

t('responds with server parameters (application_name)', async() =>
  ['postgres.js', await new Promise((resolve, reject) => postgres({
    ...options,
    onparameter: (k, v) => k === 'application_name' && resolve(v)
  })`select 1`.catch(reject))]
)

t('has server parameters', async() => {
  return ['postgres.js', (await sql`select 1`.then(() => sql.parameters.application_name))]
})

t('big query body', { timeout: 2 }, async() => {
  await sql`create table test (x int)`
  return [50000, (await sql`insert into test ${
    sql([...Array(50000).keys()].map(x => ({ x })))
  }`).count, await sql`drop table test`]
})

t('Throws if more than 65534 parameters', async() => {
  await sql`create table test (x int)`
  return ['MAX_PARAMETERS_EXCEEDED', (await sql`insert into test ${
    sql([...Array(65535).keys()].map(x => ({ x })))
  }`.catch(e => e.code)), await sql`drop table test`]
})

t('let postgres do implicit cast of unknown types', async() => {
  await sql`create table test (x timestamp with time zone)`
  const [{ x }] = await sql`insert into test values (${ new Date().toISOString() }) returning *`
  return [true, x instanceof Date, await sql`drop table test`]
})

t('only allows one statement', async() =>
  ['42601', await sql`select 1; select 2`.catch(e => e.code)]
)

t('await sql() throws not tagged error', async() => {
  let error
  try {
    await sql('select 1')
  } catch (e) {
    error = e.code
  }
  return ['NOT_TAGGED_CALL', error]
})

t('sql().then throws not tagged error', async() => {
  let error
  try {
    sql('select 1').then(() => { /* noop */ })
  } catch (e) {
    error = e.code
  }
  return ['NOT_TAGGED_CALL', error]
})

t('sql().catch throws not tagged error', async() => {
  let error
  try {
    await sql('select 1')
  } catch (e) {
    error = e.code
  }
  return ['NOT_TAGGED_CALL', error]
})

t('sql().finally throws not tagged error', async() => {
  let error
  try {
    sql('select 1').finally(() => { /* noop */ })
  } catch (e) {
    error = e.code
  }
  return ['NOT_TAGGED_CALL', error]
})

t('little bobby tables', async() => {
  const name = 'Robert\'); DROP TABLE students;--'

  await sql`create table students (name text, age int)`
  await sql`insert into students (name) values (${ name })`

  return [
    name, (await sql`select name from students`)[0].name,
    await sql`drop table students`
  ]
})

t('Connection errors are caught using begin()', {
  timeout: 2
}, async() => {
  let error
  try {
    const sql = postgres({ host: 'localhost', port: 1 })

    await sql.begin(async(sql) => {
      await sql`insert into test (label, value) values (${1}, ${2})`
    })
  } catch (err) {
    error = err
  }

  return [
    true,
    error.code === 'ECONNREFUSED' ||
    error.message === 'Connection refused (os error 61)'
  ]
})

t('dynamic table name', async() => {
  await sql`create table test(a int)`
  return [
    0, (await sql`select * from ${ sql('test') }`).count,
    await sql`drop table test`
  ]
})

t('dynamic schema name', async() => {
  await sql`create table test(a int)`
  return [
    0, (await sql`select * from ${ sql('public') }.test`).count,
    await sql`drop table test`
  ]
})

t('dynamic schema and table name', async() => {
  await sql`create table test(a int)`
  return [
    0, (await sql`select * from ${ sql('public.test') }`).count,
    await sql`drop table test`
  ]
})

t('dynamic column name', async() => {
  return ['!not_valid', Object.keys((await sql`select 1 as ${ sql('!not_valid') }`)[0])[0]]
})

t('dynamic select as', async() => {
  return ['2', (await sql`select ${ sql({ a: 1, b: 2 }) }`)[0].b]
})

t('dynamic select as pluck', async() => {
  return [undefined, (await sql`select ${ sql({ a: 1, b: 2 }, 'a') }`)[0].b]
})

t('dynamic insert', async() => {
  await sql`create table test (a int, b text)`
  const x = { a: 42, b: 'the answer' }

  return ['the answer', (await sql`insert into test ${ sql(x) } returning *`)[0].b, await sql`drop table test`]
})

t('dynamic insert pluck', async() => {
  await sql`create table test (a int, b text)`
  const x = { a: 42, b: 'the answer' }

  return [null, (await sql`insert into test ${ sql(x, 'a') } returning *`)[0].b, await sql`drop table test`]
})

t('dynamic in with empty array', async() => {
  await sql`create table test (a int)`
  await sql`insert into test values (1)`
  return [
    (await sql`select * from test where null in ${ sql([]) }`).count,
    0,
    await sql`drop table test`
  ]
})

t('dynamic in after insert', async() => {
  await sql`create table test (a int, b text)`
  const [{ x }] = await sql`
    with x as (
      insert into test values (1, 'hej')
      returning *
    )
    select 1 in ${ sql([1, 2, 3]) } as x from x
  `
  return [
    true, x,
    await sql`drop table test`
  ]
})

t('array insert', async() => {
  await sql`create table test (a int, b int)`
  return [2, (await sql`insert into test (a, b) values ${ sql([1, 2]) } returning *`)[0].b, await sql`drop table test`]
})

t('where parameters in()', async() => {
  await sql`create table test (x text)`
  await sql`insert into test values ('a')`
  return [
    (await sql`select * from test where x in ${ sql(['a', 'b', 'c']) }`)[0].x,
    'a',
    await sql`drop table test`
  ]
})

t('where parameters in() values before', async() => {
  return [2, (await sql`
    with rows as (
      select * from (values (1), (2), (3), (4)) as x(a)
    )
    select * from rows where a in ${ sql([3, 4]) }
  `).count]
})

t('dynamic multi row insert', async() => {
  await sql`create table test (a int, b text)`
  const x = { a: 42, b: 'the answer' }

  return [
    'the answer',
    (await sql`insert into test ${ sql([x, x]) } returning *`)[1].b, await sql`drop table test`
  ]
})

t('dynamic update', async() => {
  await sql`create table test (a int, b text)`
  await sql`insert into test (a, b) values (17, 'wrong')`

  return [
    'the answer',
    (await sql`update test set ${ sql({ a: 42, b: 'the answer' }) } returning *`)[0].b, await sql`drop table test`
  ]
})

t('dynamic update pluck', async() => {
  await sql`create table test (a int, b text)`
  await sql`insert into test (a, b) values (17, 'wrong')`

  return [
    'wrong',
    (await sql`update test set ${ sql({ a: 42, b: 'the answer' }, 'a') } returning *`)[0].b, await sql`drop table test`
  ]
})

t('dynamic select array', async() => {
  await sql`create table test (a int, b text)`
  await sql`insert into test (a, b) values (42, 'yay')`
  return ['yay', (await sql`select ${ sql(['a', 'b']) } from test`)[0].b, await sql`drop table test`]
})

t('dynamic returning array', async() => {
  await sql`create table test (a int, b text)`
  return [
    'yay',
    (await sql`insert into test (a, b) values (42, 'yay') returning ${ sql(['a', 'b']) }`)[0].b,
    await sql`drop table test`
  ]
})

t('dynamic select args', async() => {
  await sql`create table test (a int, b text)`
  await sql`insert into test (a, b) values (42, 'yay')`
  return ['yay', (await sql`select ${ sql('a', 'b') } from test`)[0].b, await sql`drop table test`]
})

t('dynamic values single row', async() => {
  const [{ b }] = await sql`
    select * from (values ${ sql(['a', 'b', 'c']) }) as x(a, b, c)
  `

  return ['b', b]
})

t('dynamic values multi row', async() => {
  const [, { b }] = await sql`
    select * from (values ${ sql([['a', 'b', 'c'], ['a', 'b', 'c']]) }) as x(a, b, c)
  `

  return ['b', b]
})

t('connection parameters', async() => {
  const sql = postgres({
    ...options,
    connection: {
      'some.var': 'yay'
    }
  })

  return ['yay', (await sql`select current_setting('some.var') as x`)[0].x]
})

t('Multiple queries', async() => {
  const sql = postgres(options)

  return [4, (await Promise.all([
    sql`select 1`,
    sql`select 2`,
    sql`select 3`,
    sql`select 4`
  ])).length]
})

t('Multiple statements', async() =>
  [2, await sql.unsafe(`
    select 1 as x;
    select 2 as a;
  `).then(([, [x]]) => x.a)]
)

t('throws correct error when authentication fails', async() => {
  const sql = postgres({
    ...options,
    ...login_md5,
    pass: 'wrong'
  })
  return ['28P01', await sql`select 1`.catch(e => e.code)]
})

t('notice', async() => {
  let notice
  const log = console.log // eslint-disable-line
  console.log = function(x) { // eslint-disable-line
    notice = x
  }

  const sql = postgres(options)

  await sql`create table if not exists users()`
  await sql`create table if not exists users()`

  console.log = log // eslint-disable-line

  return ['NOTICE', notice.severity]
})

t('notice hook', async() => {
  let notice
  const sql = postgres({
    ...options,
    onnotice: x => notice = x
  })

  await sql`create table if not exists users()`
  await sql`create table if not exists users()`

  return ['NOTICE', notice.severity]
})

t('bytea serializes and parses', async() => {
  const buf = Buffer.from('wat')

  await sql`create table test (x bytea)`
  await sql`insert into test values (${ buf })`

  return [
    buf.toString(),
    (await sql`select x from test`)[0].x.toString(),
    await sql`drop table test`
  ]
})

t('forEach', async() => {
  let result
  await sql`select 1 as x`.forEach(({ x }) => result = x)
  return [1, result]
})

t('forEach returns empty array', async() => {
  return [0, (await sql`select 1 as x`.forEach(() => { /* noop */ })).length]
})

t('Cursor', async() => {
  const order = []
  await sql`select 1 as x union select 2 as x`.cursor(async([x]) => {
    order.push(x.x + 'a')
    await delay(100)
    order.push(x.x + 'b')
  })
  return ['1a1b2a2b', order.join('')]
})

t('Unsafe cursor', async() => {
  const order = []
  await sql.unsafe('select 1 as x union select 2 as x').cursor(async([x]) => {
    order.push(x.x + 'a')
    await delay(100)
    order.push(x.x + 'b')
  })
  return ['1a1b2a2b', order.join('')]
})

t('Cursor custom n', async() => {
  const order = []
  await sql`select * from generate_series(1,20)`.cursor(10, async(x) => {
    order.push(x.length)
  })
  return ['10,10', order.join(',')]
})

t('Cursor custom with rest n', async() => {
  const order = []
  await sql`select * from generate_series(1,20)`.cursor(11, async(x) => {
    order.push(x.length)
  })
  return ['11,9', order.join(',')]
})

t('Cursor custom with less results than batch size', async() => {
  const order = []
  await sql`select * from generate_series(1,20)`.cursor(21, async(x) => {
    order.push(x.length)
  })
  return ['20', order.join(',')]
})

t('Cursor cancel', async() => {
  let result
  await sql`select * from generate_series(1,10) as x`.cursor(async([{ x }]) => {
    result = x
    return sql.CLOSE
  })
  return [1, result]
})

t('Cursor throw', async() => {
  const order = []
  await sql`select 1 as x union select 2 as x`.cursor(async([x]) => {
    order.push(x.x + 'a')
    await delay(100)
    throw new Error('watty')
  }).catch(() => order.push('err'))
  return ['1aerr', order.join('')]
})

t('Cursor error', async() => [
  '42601',
  await sql`wat`.cursor(() => { /* noop */ }).catch((err) => err.code)
])

t('Multiple Cursors', { timeout: 2 }, async() => {
  const result = []
  await sql.begin(async sql => [
    await sql`select 1 as cursor, x from generate_series(1,4) as x`.cursor(async([row]) => {
      result.push(row.x)
      await new Promise(r => setTimeout(r, 20))
    }),
    await sql`select 2 as cursor, x from generate_series(101,104) as x`.cursor(async([row]) => {
      result.push(row.x)
      await new Promise(r => setTimeout(r, 10))
    })
  ])

  return ['1,2,3,4,101,102,103,104', result.join(',')]
})

t('Cursor as async iterator', async() => {
  const order = []
  for await (const [x] of sql`select generate_series(1,2) as x;`.cursor()) {
    order.push(x.x + 'a')
    await delay(10)
    order.push(x.x + 'b')
  }

  return ['1a1b2a2b', order.join('')]
})

t('Cursor as async iterator with break', async() => {
  const order = []
  for await (const xs of sql`select generate_series(1,2) as x;`.cursor()) {
    order.push(xs[0].x + 'a')
    await delay(10)
    order.push(xs[0].x + 'b')
    break
  }

  return ['1a1b', order.join('')]
})

t('Async Iterator Unsafe cursor', async() => {
  const order = []
  for await (const [x] of sql.unsafe('select 1 as x union select 2 as x').cursor()) {
    order.push(x.x + 'a')
    await delay(10)
    order.push(x.x + 'b')
  }
  return ['1a1b2a2b', order.join('')]
})

t('Async Iterator Cursor custom n', async() => {
  const order = []
  for await (const x of sql`select * from generate_series(1,20)`.cursor(10))
    order.push(x.length)

  return ['10,10', order.join(',')]
})

t('Async Iterator Cursor custom with rest n', async() => {
  const order = []
  for await (const x of sql`select * from generate_series(1,20)`.cursor(11))
    order.push(x.length)

  return ['11,9', order.join(',')]
})

t('Async Iterator Cursor custom with less results than batch size', async() => {
  const order = []
  for await (const x of sql`select * from generate_series(1,20)`.cursor(21))
    order.push(x.length)
  return ['20', order.join(',')]
})

t('Transform row', async() => {
  const sql = postgres({
    ...options,
    transform: { row: () => 1 }
  })

  return [1, (await sql`select 'wat'`)[0]]
})

t('Transform row forEach', async() => {
  let result
  const sql = postgres({
    ...options,
    transform: { row: () => 1 }
  })

  await sql`select 1`.forEach(x => result = x)

  return [1, result]
})

t('Transform value', async() => {
  const sql = postgres({
    ...options,
    transform: { value: () => 1 }
  })

  return [1, (await sql`select 'wat' as x`)[0].x]
})

t('Transform columns from', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.fromCamel
  })
  await sql`create table test (a_test int, b_test text)`
  await sql`insert into test ${ sql([{ aTest: 1, bTest: 1 }]) }`
  await sql`update test set ${ sql({ aTest: 2, bTest: 2 }) }`
  return [
    2,
    (await sql`select ${ sql('aTest', 'bTest') } from test`)[0].a_test,
    await sql`drop table test`
  ]
})

t('Transform columns to', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.toCamel
  })
  await sql`create table test (a_test int, b_test text)`
  await sql`insert into test ${ sql([{ a_test: 1, b_test: 1 }]) }`
  await sql`update test set ${ sql({ a_test: 2, b_test: 2 }) }`
  return [
    2,
    (await sql`select a_test, b_test from test`)[0].aTest,
    await sql`drop table test`
  ]
})

t('Transform columns from and to', async() => {
  const sql = postgres({
    ...options,
    transform: postgres.camel
  })
  await sql`create table test (a_test int, b_test text)`
  await sql`insert into test ${ sql([{ aTest: 1, bTest: 1 }]) }`
  await sql`update test set ${ sql({ aTest: 2, bTest: 2 }) }`
  return [
    2,
    (await sql`select ${ sql('aTest', 'bTest') } from test`)[0].aTest,
    await sql`drop table test`
  ]
})

t('Transform columns from and to (legacy)', async() => {
  const sql = postgres({
    ...options,
    transform: {
      column: {
        to: postgres.fromCamel,
        from: postgres.toCamel
      }
    }
  })
  await sql`create table test (a_test int, b_test text)`
  await sql`insert into test ${ sql([{ aTest: 1, bTest: 1 }]) }`
  await sql`update test set ${ sql({ aTest: 2, bTest: 2 }) }`
  return [
    2,
    (await sql`select ${ sql('aTest', 'bTest') } from test`)[0].aTest,
    await sql`drop table test`
  ]
})

t('Unix socket', async() => {
  const sql = postgres({
    ...options,
    host: process.env.PGSOCKET || '/tmp' // eslint-disable-line
  })

  return [1, (await sql`select 1 as x`)[0].x]
})

t('Big result', async() => {
  return [100000, (await sql`select * from generate_series(1, 100000)`).count]
})

t('Debug', async() => {
  let result
  const sql = postgres({
    ...options,
    debug: (connection_id, str) => result = str
  })

  await sql`select 1`

  return ['select 1', result]
})

t('bigint is returned as String', async() => [
  'string',
  typeof (await sql`select 9223372036854777 as x`)[0].x
])

t('int is returned as Number', async() => [
  'number',
  typeof (await sql`select 123 as x`)[0].x
])

t('numeric is returned as string', async() => [
  'string',
  typeof (await sql`select 1.2 as x`)[0].x
])

t('Async stack trace', async() => {
  const sql = postgres({ ...options, debug: false })
  return [
    parseInt(new Error().stack.split('\n')[1].match(':([0-9]+):')[1]) + 1,
    parseInt(await sql`error`.catch(x => x.stack.split('\n').pop().match(':([0-9]+):')[1]))
  ]
})

t('Debug has long async stack trace', async() => {
  const sql = postgres({ ...options, debug: true })

  return [
    'watyo',
    await yo().catch(x => x.stack.match(/wat|yo/g).join(''))
  ]

  function yo() {
    return wat()
  }

  function wat() {
    return sql`error`
  }
})

t('Error contains query string', async() => [
  'selec 1',
  (await sql`selec 1`.catch(err => err.query))
])

t('Error contains query serialized parameters', async() => [
  1,
  (await sql`selec ${ 1 }`.catch(err => err.parameters[0]))
])

t('Error contains query raw parameters', async() => [
  1,
  (await sql`selec ${ 1 }`.catch(err => err.args[0]))
])

t('Query and parameters on errorare not enumerable if debug is not set', async() => {
  const sql = postgres({ ...options, debug: false })

  return [
    false,
    (await sql`selec ${ 1 }`.catch(err => err.propertyIsEnumerable('parameters') || err.propertyIsEnumerable('query')))
  ]
})

t('Query and parameters are enumerable if debug is set', async() => {
  const sql = postgres({ ...options, debug: true })

  return [
    true,
    (await sql`selec ${ 1 }`.catch(err => err.propertyIsEnumerable('parameters') && err.propertyIsEnumerable('query')))
  ]
})

t('connect_timeout', { timeout: 20 }, async() => {
  const connect_timeout = 0.2
  const server = net.createServer()
  server.listen()
  const sql = postgres({ port: server.address().port, host: '127.0.0.1', connect_timeout })
  const start = Date.now()
  let end
  await sql`select 1`.catch((e) => {
    if (e.code !== 'CONNECT_TIMEOUT')
      throw e
    end = Date.now()
  })
  server.close()
  return [connect_timeout, Math.floor((end - start) / 100) / 10]
})

t('connect_timeout throws proper error', async() => [
  'CONNECT_TIMEOUT',
  await postgres({
    ...options,
    ...login_scram,
    connect_timeout: 0.001
  })`select 1`.catch(e => e.code)
])

t('connect_timeout error message includes host:port', { timeout: 20 }, async() => {
  const connect_timeout = 0.2
  const server = net.createServer()
  server.listen()
  const sql = postgres({ port: server.address().port, host: '127.0.0.1', connect_timeout })
  const port = server.address().port
  let err
  await sql`select 1`.catch((e) => {
    if (e.code !== 'CONNECT_TIMEOUT')
      throw e
    err = e.message
  })
  server.close()
  return [['write CONNECT_TIMEOUT 127.0.0.1:', port].join(''), err]
})

t('requests works after single connect_timeout', async() => {
  let first = true

  const sql = postgres({
    ...options,
    ...login_scram,
    connect_timeout: { valueOf() { return first ? (first = false, 0.0001) : 1 } }
  })

  return [
    'CONNECT_TIMEOUT,,1',
    [
      await sql`select 1 as x`.then(() => 'success', x => x.code),
      await delay(10),
      (await sql`select 1 as x`)[0].x
    ].join(',')
  ]
})

t('Postgres errors are of type PostgresError', async() =>
  [true, (await sql`bad keyword`.catch(e => e)) instanceof sql.PostgresError]
)

t('Result has columns spec', async() =>
  ['x', (await sql`select 1 as x`).columns[0].name]
)

t('forEach has result as second argument', async() => {
  let x
  await sql`select 1 as x`.forEach((_, result) => x = result)
  return ['x', x.columns[0].name]
})

t('Result as arrays', async() => {
  const sql = postgres({
    ...options,
    transform: {
      row: x => Object.values(x)
    }
  })

  return ['1,2', (await sql`select 1 as a, 2 as b`)[0].join(',')]
})

t('Insert empty array', async() => {
  await sql`create table tester (ints int[])`
  return [
    Array.isArray((await sql`insert into tester (ints) values (${ sql.array([]) }) returning *`)[0].ints),
    true,
    await sql`drop table tester`
  ]
})

t('Insert array in sql()', async() => {
  await sql`create table tester (ints int[])`
  return [
    Array.isArray((await sql`insert into tester ${ sql({ ints: sql.array([]) }) } returning *`)[0].ints),
    true,
    await sql`drop table tester`
  ]
})

t('Automatically creates prepared statements', async() => {
  const sql = postgres(options)
  const result = await sql`select * from pg_prepared_statements`
  return [true, result.some(x => x.name = result.statement.name)]
})

t('no_prepare: true disables prepared statements (deprecated)', async() => {
  const sql = postgres({ ...options, no_prepare: true })
  const result = await sql`select * from pg_prepared_statements`
  return [false, result.some(x => x.name = result.statement.name)]
})

t('prepare: false disables prepared statements', async() => {
  const sql = postgres({ ...options, prepare: false })
  const result = await sql`select * from pg_prepared_statements`
  return [false, result.some(x => x.name = result.statement.name)]
})

t('prepare: true enables prepared statements', async() => {
  const sql = postgres({ ...options, prepare: true })
  const result = await sql`select * from pg_prepared_statements`
  return [true, result.some(x => x.name = result.statement.name)]
})

t('prepares unsafe query when "prepare" option is true', async() => {
  const sql = postgres({ ...options, prepare: true })
  const result = await sql.unsafe('select * from pg_prepared_statements where name <> $1', ['bla'], { prepare: true })
  return [true, result.some(x => x.name = result.statement.name)]
})

t('does not prepare unsafe query by default', async() => {
  const sql = postgres({ ...options, prepare: true })
  const result = await sql.unsafe('select * from pg_prepared_statements where name <> $1', ['bla'])
  return [false, result.some(x => x.name = result.statement.name)]
})

t('Recreate prepared statements on transformAssignedExpr error', { timeout: 1 }, async() => {
  const insert = () => sql`insert into test (name) values (${ '1' }) returning name`
  await sql`create table test (name text)`
  await insert()
  await sql`alter table test alter column name type int using name::integer`
  return [
    1,
    (await insert())[0].name,
    await sql`drop table test`
  ]
})

t('Throws correct error when retrying in transactions', async() => {
  await sql`create table test(x int)`
  const error = await sql.begin(sql => sql`insert into test (x) values (${ false })`).catch(e => e)
  return [
    error.code,
    '42804',
    sql`drop table test`
  ]
})

t('Recreate prepared statements on RevalidateCachedQuery error', async() => {
  const select = () => sql`select name from test`
  await sql`create table test (name text)`
  await sql`insert into test values ('1')`
  await select()
  await sql`alter table test alter column name type int using name::integer`
  return [
    1,
    (await select())[0].name,
    await sql`drop table test`
  ]
})

t('Properly throws routine error on not prepared statements', async() => {
  await sql`create table x (x text[])`
  const { routine } = await sql.unsafe(`
    insert into x(x) values (('a', 'b'))
  `).catch(e => e)

  return ['transformAssignedExpr', routine, await sql`drop table x`]
})

t('Properly throws routine error on not prepared statements in transaction', async() => {
  const { routine } = await sql.begin(sql => [
    sql`create table x (x text[])`,
    sql`insert into x(x) values (('a', 'b'))`
  ]).catch(e => e)

  return ['transformAssignedExpr', routine]
})

t('Properly throws routine error on not prepared statements using file', async() => {
  const { routine } = await sql.unsafe(`
    create table x (x text[]);
    insert into x(x) values (('a', 'b'));
  `, { prepare: true }).catch(e => e)

  return ['transformAssignedExpr', routine]
})

t('Catches connection config errors', async() => {
  const sql = postgres({ ...options, user: { toString: () => { throw new Error('wat') } }, database: 'prut' })

  return [
    'wat',
    await sql`select 1`.catch((e) => e.message)
  ]
})

t('Catches connection config errors with end', async() => {
  const sql = postgres({ ...options, user: { toString: () => { throw new Error('wat') } }, database: 'prut' })

  return [
    'wat',
    await sql`select 1`.catch((e) => e.message),
    await sql.end()
  ]
})

t('Catches query format errors', async() => [
  'wat',
  await sql.unsafe({ toString: () => { throw new Error('wat') } }).catch((e) => e.message)
])

t('Multiple hosts', {
  timeout: 1
}, async() => {
  const s1 = postgres({ idle_timeout })
      , s2 = postgres({ idle_timeout, port: 5433 })
      , sql = postgres('postgres://localhost:5432,localhost:5433', { idle_timeout, max: 1 })
      , result = []

  const id1 = (await s1`select system_identifier as x from pg_control_system()`)[0].x
  const id2 = (await s2`select system_identifier as x from pg_control_system()`)[0].x

  const x1 = await sql`select 1`
  result.push((await sql`select system_identifier as x from pg_control_system()`)[0].x)
  await s1`select pg_terminate_backend(${ x1.state.pid }::int)`
  await delay(50)

  const x2 = await sql`select 1`
  result.push((await sql`select system_identifier as x from pg_control_system()`)[0].x)
  await s2`select pg_terminate_backend(${ x2.state.pid }::int)`
  await delay(50)

  result.push((await sql`select system_identifier as x from pg_control_system()`)[0].x)

  return [[id1, id2, id1].join(','), result.join(',')]
})

t('Escaping supports schemas and tables', async() => {
  await sql`create schema a`
  await sql`create table a.b (c int)`
  await sql`insert into a.b (c) values (1)`
  return [
    1,
    (await sql`select ${ sql('a.b.c') } from a.b`)[0].c,
    await sql`drop table a.b`,
    await sql`drop schema a`
  ]
})

t('Raw method returns rows as arrays', async() => {
  const [x] = await sql`select 1`.raw()
  return [
    Array.isArray(x),
    true
  ]
})

t('Raw method returns values unparsed as Buffer', async() => {
  const [[x]] = await sql`select 1`.raw()
  return [
    x instanceof Uint8Array,
    true
  ]
})

t('Array returns rows as arrays of columns', async() => {
  return [(await sql`select 1`.values())[0][0], 1]
})

t('Copy read', async() => {
  const result = []

  await sql`create table test (x int)`
  await sql`insert into test select * from generate_series(1,10)`
  const readable = await sql`copy test to stdout`.readable()
  readable.on('data', x => result.push(x))
  await new Promise(r => readable.on('end', r))

  return [
    result.length,
    10,
    await sql`drop table test`
  ]
})

t('Copy write', { timeout: 2 }, async() => {
  await sql`create table test (x int)`
  const writable = await sql`copy test from stdin`.writable()

  writable.write('1\n')
  writable.write('1\n')
  writable.end()

  await new Promise(r => writable.on('finish', r))

  return [
    (await sql`select 1 from test`).length,
    2,
    await sql`drop table test`
  ]
})

t('Copy write as first', async() => {
  await sql`create table test (x int)`
  const first = postgres(options)
  const writable = await first`COPY test FROM STDIN WITH(FORMAT csv, HEADER false, DELIMITER ',')`.writable()
  writable.write('1\n')
  writable.write('1\n')
  writable.end()

  await new Promise(r => writable.on('finish', r))

  return [
    (await sql`select 1 from test`).length,
    2,
    await sql`drop table test`
  ]
})

t('Copy from file', async() => {
  await sql`create table test (x int, y int, z int)`
  await new Promise(async r => fs
    .createReadStream(rel('copy.csv'))
    .pipe(await sql`copy test from stdin`.writable())
    .on('finish', r)
  )

  return [
    JSON.stringify(await sql`select * from test`),
    '[{"x":1,"y":2,"z":3},{"x":4,"y":5,"z":6}]',
    await sql`drop table test`
  ]
})

t('Copy from works in transaction', async() => {
  await sql`create table test(x int)`
  const xs = await sql.begin(async sql => {
    (await sql`copy test from stdin`.writable()).end('1\n2')
    await delay(20)
    return sql`select 1 from test`
  })

  return [
    xs.length,
    2,
    await sql`drop table test`
  ]
})

t('Copy from abort', async() => {
  const sql = postgres(options)
  const readable = fs.createReadStream(rel('copy.csv'))

  await sql`create table test (x int, y int, z int)`
  await sql`TRUNCATE TABLE test`

  const writable = await sql`COPY test FROM STDIN`.writable()

  let aborted

  readable
    .pipe(writable)
    .on('error', (err) => aborted = err)

  writable.destroy(new Error('abort'))
  await sql.end()

  return [
    'abort',
    aborted.message,
    await postgres(options)`drop table test`
  ]
})

t('multiple queries before connect', async() => {
  const sql = postgres({ ...options, max: 2 })
  const xs = await Promise.all([
    sql`select 1 as x`,
    sql`select 2 as x`,
    sql`select 3 as x`,
    sql`select 4 as x`
  ])

  return [
    '1,2,3,4',
    xs.map(x => x[0].x).join()
  ]
})

t('subscribe', { timeout: 2 }, async() => {
  const sql = postgres({
    database: 'postgres_js_test',
    publications: 'alltables'
  })

  await sql.unsafe('create publication alltables for all tables')

  const result = []

  const { unsubscribe } = await sql.subscribe('*', (row, { command, old }) => {
    result.push(command, row.name, row.id, old && old.name, old && old.id)
  })

  await sql`
    create table test (
      id serial primary key,
      name text
    )
  `

  await sql`alter table test replica identity default`
  await sql`insert into test (name) values ('Murray')`
  await sql`update test set name = 'Rothbard'`
  await sql`update test set id = 2`
  await sql`delete from test`
  await sql`alter table test replica identity full`
  await sql`insert into test (name) values ('Murray')`
  await sql`update test set name = 'Rothbard'`
  await sql`delete from test`
  await delay(10)
  await unsubscribe()
  await sql`insert into test (name) values ('Oh noes')`
  await delay(10)
  return [
    'insert,Murray,1,,,update,Rothbard,1,,,update,Rothbard,2,,1,delete,,2,,,insert,Murray,2,,,update,Rothbard,2,Murray,2,delete,Rothbard,2,,', // eslint-disable-line
    result.join(','),
    await sql`drop table test`,
    await sql`drop publication alltables`,
    await sql.end()
  ]
})

t('subscribe with transform', { timeout: 2 }, async() => {
  const sql = postgres({
    transform: {
      column: {
        from: postgres.toCamel,
        to: postgres.fromCamel
      }
    },
    database: 'postgres_js_test',
    publications: 'alltables'
  })

  await sql.unsafe('create publication alltables for all tables')

  const result = []

  const { unsubscribe } = await sql.subscribe('*', (row, { command, old }) =>
    result.push(command, row.nameInCamel || row.id, old && old.nameInCamel)
  )

  await sql`
    create table test (
      id serial primary key,
      name_in_camel text
    )
  `

  await sql`insert into test (name_in_camel) values ('Murray')`
  await sql`update test set name_in_camel = 'Rothbard'`
  await sql`delete from test`
  await sql`alter table test replica identity full`
  await sql`insert into test (name_in_camel) values ('Murray')`
  await sql`update test set name_in_camel = 'Rothbard'`
  await sql`delete from test`
  await delay(10)
  await unsubscribe()
  await sql`insert into test (name_in_camel) values ('Oh noes')`
  await delay(10)
  return [
    'insert,Murray,,update,Rothbard,,delete,1,,insert,Murray,,update,Rothbard,Murray,delete,Rothbard,',
    result.join(','),
    await sql`drop table test`,
    await sql`drop publication alltables`,
    await sql.end()
  ]
})

t('subscribe reconnects and calls onsubscribe', { timeout: 4 }, async() => {
  const sql = postgres({
    database: 'postgres_js_test',
    publications: 'alltables',
    fetch_types: false
  })

  await sql.unsafe('create publication alltables for all tables')

  const result = []
  let onsubscribes = 0

  const { unsubscribe, sql: subscribeSql } = await sql.subscribe(
    '*',
    (row, { command, old }) => result.push(command, row.name || row.id, old && old.name),
    () => onsubscribes++
  )

  await sql`
    create table test (
      id serial primary key,
      name text
    )
  `

  await sql`insert into test (name) values ('Murray')`
  await delay(10)
  await subscribeSql.close()
  await delay(500)
  await sql`delete from test`
  await delay(100)
  await unsubscribe()
  return [
    '2insert,Murray,,delete,1,',
    onsubscribes + result.join(','),
    await sql`drop table test`,
    await sql`drop publication alltables`,
    await sql.end()
  ]
})

t('Execute', async() => {
  const result = await new Promise((resolve) => {
    const sql = postgres({ ...options, fetch_types: false, debug:(id, query) => resolve(query) })
    sql`select 1`.execute()
  })

  return [result, 'select 1']
})

t('Cancel running query', async() => {
  const query = sql`select pg_sleep(2)`
  setTimeout(() => query.cancel(), 500)
  const error = await query.catch(x => x)
  return ['57014', error.code]
})

t('Cancel piped query', { timeout: 5 }, async() => {
  await sql`select 1`
  const last = sql`select pg_sleep(1)`.execute()
  const query = sql`select pg_sleep(2) as dig`
  setTimeout(() => query.cancel(), 500)
  const error = await query.catch(x => x)
  await last
  return ['57014', error.code]
})

t('Cancel queued query', async() => {
  const query = sql`select pg_sleep(2) as nej`
  const tx = sql.begin(sql => (
    query.cancel(),
    sql`select pg_sleep(0.5) as hej, 'hejsa'`
  ))
  const error = await query.catch(x => x)
  await tx
  return ['57014', error.code]
})

t('Fragments', async() => [
  1,
  (await sql`
    ${ sql`select` } 1 as x
  `)[0].x
])

t('Result becomes array', async() => [
  true,
  (await sql`select 1`).slice() instanceof Array
])

t('Describe', async() => {
  const type = (await sql`select ${ 1 }::int as x`.describe()).types[0]
  return [23, type]
})

t('Describe a statement', async() => {
  await sql`create table tester (name text, age int)`
  const r = await sql`select name, age from tester where name like $1 and age > $2`.describe()
  return [
    '25,23/name:25,age:23',
    `${ r.types.join(',') }/${ r.columns.map(c => `${c.name}:${c.type}`).join(',') }`,
    await sql`drop table tester`
  ]
})

t('Include table oid and column number in column details', async() => {
  await sql`create table tester (name text, age int)`
  const r = await sql`select name, age from tester where name like $1 and age > $2`.describe()
  const [{ oid }] = await sql`select oid from pg_class where relname = 'tester'`

  return [
    `table:${oid},number:1|table:${oid},number:2`,
    `${ r.columns.map(c => `table:${c.table},number:${c.number}`).join('|') }`,
    await sql`drop table tester`
  ]
})

t('Describe a statement without parameters', async() => {
  await sql`create table tester (name text, age int)`
  const r = await sql`select name, age from tester`.describe()
  return [
    '0,2',
    `${ r.types.length },${ r.columns.length }`,
    await sql`drop table tester`
  ]
})

t('Describe a statement without columns', async() => {
  await sql`create table tester (name text, age int)`
  const r = await sql`insert into tester (name, age) values ($1, $2)`.describe()
  return [
    '2,0',
    `${ r.types.length },${ r.columns.length }`,
    await sql`drop table tester`
  ]
})

t('Large object', async() => {
  const file = rel('index.js')
      , md5 = crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex')

  const lo = await sql.largeObject()
  await new Promise(async r => fs.createReadStream(file).pipe(await lo.writable()).on('finish', r))
  await lo.seek(0)

  const out = crypto.createHash('md5')
  await new Promise(r => lo.readable().then(x => x.on('data', x => out.update(x)).on('end', r)))

  return [
    md5,
    out.digest('hex'),
    await lo.close()
  ]
})

t('Catches type serialize errors', async() => {
  const sql = postgres({
    idle_timeout,
    types: {
      text: {
        from: 25,
        to: 25,
        parse: x => x,
        serialize: () => { throw new Error('watSerialize') }
      }
    }
  })

  return [
    'watSerialize',
    (await sql`select ${ 'wat' }`.catch(e => e.message))
  ]
})

t('Catches type parse errors', async() => {
  const sql = postgres({
    idle_timeout,
    types: {
      text: {
        from: 25,
        to: 25,
        parse: () => { throw new Error('watParse') },
        serialize: x => x
      }
    }
  })

  return [
    'watParse',
    (await sql`select 'wat'`.catch(e => e.message))
  ]
})

t('Catches type serialize errors in transactions', async() => {
  const sql = postgres({
    idle_timeout,
    types: {
      text: {
        from: 25,
        to: 25,
        parse: x => x,
        serialize: () => { throw new Error('watSerialize') }
      }
    }
  })

  return [
    'watSerialize',
    (await sql.begin(sql => (
      sql`select 1`,
      sql`select ${ 'wat' }`
    )).catch(e => e.message))
  ]
})

t('Catches type parse errors in transactions', async() => {
  const sql = postgres({
    idle_timeout,
    types: {
      text: {
        from: 25,
        to: 25,
        parse: () => { throw new Error('watParse') },
        serialize: x => x
      }
    }
  })

  return [
    'watParse',
    (await sql.begin(sql => (
      sql`select 1`,
      sql`select 'wat'`
    )).catch(e => e.message))
  ]
})

t('Prevent premature end of connection in transaction', async() => {
  const sql = postgres({ max_lifetime: 0.01, idle_timeout })
  const result = await sql.begin(async sql => {
    await sql`select 1`
    await delay(20)
    await sql`select 1`
    return 'yay'
  })


  return [
    'yay',
    result
  ]
})

t('Ensure reconnect after max_lifetime with transactions', { timeout: 5 }, async() => {
  const sql = postgres({
    max_lifetime: 0.01,
    idle_timeout,
    max: 1
  })

  let x = 0
  while (x++ < 10) await sql.begin(sql => sql`select 1 as x`)

  return [true, true]
})


t('Ensure transactions throw if connection is closed dwhile there is no query', async() => {
  const sql = postgres(options)
  const x = await sql.begin(async() => {
    setTimeout(() => sql.end({ timeout: 0 }), 10)
    await new Promise(r => setTimeout(r, 200))
    return sql`select 1`
  }).catch(x => x)
  return ['CONNECTION_CLOSED', x.code]
})

t('Custom socket', {}, async() => {
  let result
  const sql = postgres({
    socket: () => new Promise((resolve, reject) => {
      const socket = new net.Socket()
      socket.connect(5432)
      socket.once('data', x => result = x[0])
      socket.on('error', reject)
      socket.on('connect', () => resolve(socket))
    }),
    idle_timeout
  })

  await sql`select 1`

  return [
    result,
    82
  ]
})

t('Ensure drain only dequeues if ready', async() => {
  const sql = postgres(options)

  const res = await Promise.all([
    sql.unsafe('SELECT 0+$1 --' + '.'.repeat(100000), [1]),
    sql.unsafe('SELECT 0+$1+$2+$3', [1, 2, 3])
  ])

  return [res.length, 2]
})

t('Supports fragments as dynamic parameters', async() => {
  await sql`create table test (a int, b bool)`
  await sql`insert into test values(1, true)`
  await sql`insert into test ${
    sql({
      a: 2,
      b: sql`exists(select 1 from test where b = ${ true })`
    })
  }`

  return [
    '1,t2,t',
    (await sql`select * from test`.raw()).join(''),
    await sql`drop table test`
  ]
})

t('Supports nested fragments with parameters', async() => {
  await sql`create table test ${
    sql`(${ sql('a') } ${ sql`int` })`
  }`
  await sql`insert into test values(1)`
  return [
    1,
    (await sql`select a from test`)[0].a,
    await sql`drop table test`
  ]
})

t('Supports multiple nested fragments with parameters', async() => {
  const [{ b }] = await sql`select * ${
    sql`from ${
      sql`(values (2, ${ 1 }::int)) as x(${ sql(['a', 'b']) })`
    }`
  }`
  return [
    1,
    b
  ]
})

t('Supports arrays of fragments', async() => {
  const [{ x }] = await sql`
    ${ [sql`select`, sql`1`, sql`as`, sql`x`] }
  `

  return [
    1,
    x
  ]
})

t('Does not try rollback when commit errors', async() => {
  let notice = null
  const sql = postgres({ ...options, onnotice: x => notice = x })
  await sql`create table test(x int constraint test_constraint unique deferrable initially deferred)`

  await sql.begin('isolation level serializable', async sql => {
    await sql`insert into test values(1)`
    await sql`insert into test values(1)`
  }).catch(e => e)

  return [
    notice,
    null,
    await sql`drop table test`
  ]
})

t('Last keyword used even with duplicate keywords', async() => {
  await sql`create table test (x int)`
  await sql`insert into test values(1)`
  const [{ x }] = await sql`
    select
      1 in (1) as x
    from test
    where x in ${ sql([1, 2]) }
  `

  return [x, true, await sql`drop table test`]
})

t('Insert array with null', async() => {
  await sql`create table test (x int[])`
  await sql`insert into test ${ sql({ x: [1, null, 3] }) }`
  return [
    1,
    (await sql`select x from test`)[0].x[0],
    await sql`drop table test`
  ]
})

t('Insert array with undefined throws', async() => {
  await sql`create table test (x int[])`
  return [
    'UNDEFINED_VALUE',
    await sql`insert into test ${ sql({ x: [1, undefined, 3] }) }`.catch(e => e.code),
    await sql`drop table test`
  ]
})

t('Insert array with undefined transform', async() => {
  const sql = postgres({ ...options, transform: { undefined: null } })
  await sql`create table test (x int[])`
  await sql`insert into test ${ sql({ x: [1, undefined, 3] }) }`
  return [
    1,
    (await sql`select x from test`)[0].x[0],
    await sql`drop table test`
  ]
})

t('concurrent cursors', async() => {
  const xs = []

  await Promise.all([...Array(7)].map((x, i) => [
    sql`select ${ i }::int as a, generate_series(1, 2) as x`.cursor(([x]) => xs.push(x.a + x.x))
  ]).flat())

  return ['12233445566778', xs.join('')]
})

t('concurrent cursors multiple connections', async() => {
  const sql = postgres({ ...options, max: 2 })
  const xs = []

  await Promise.all([...Array(7)].map((x, i) => [
    sql`select ${ i }::int as a, generate_series(1, 2) as x`.cursor(([x]) => xs.push(x.a + x.x))
  ]).flat())

  return ['12233445566778', xs.sort().join('')]
})

t('reserve connection', async() => {
  const reserved = await sql.reserve()

  setTimeout(() => reserved.release(), 510)

  const xs = await Promise.all([
    reserved`select 1 as x`.then(([{ x }]) => ({ time: Date.now(), x })),
    sql`select 2 as x`.then(([{ x }]) => ({ time: Date.now(), x })),
    reserved`select 3 as x`.then(([{ x }]) => ({ time: Date.now(), x }))
  ])

  if (xs[1].time - xs[2].time < 500)
    throw new Error('Wrong time')

  return [
    '123',
    xs.map(x => x.x).join('')
  ]
})

t('arrays in reserved connection', async() => {
  const reserved = await sql.reserve()
  const [{ x }] = await reserved`select array[1, 2, 3] as x`
  reserved.release()

  return [
    '123',
    x.join('')
  ]
})

t('Ensure reserve on query throws proper error', async() => {
  const sql = postgres({ idle_timeout }) // eslint-disable-line
  const reserved = await sql.reserve()
  const [{ x }] = await reserved`select 'wat' as x`

  return [
    'wat', x, reserved.release()
  ]
})

```

---

### test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/afc848c316-postgres/tests/test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/* eslint no-console: 0 */

import util from 'util'

let done = 0
let only = false
let ignored = 0
let failed = false
let promise = Promise.resolve()
const tests = {}
    , ignore = {}

export const nt = () => ignored++
export const ot = (...rest) => (only = true, test(true, ...rest))
export const t = (...rest) => test(false, ...rest)
t.timeout = 5

async function test(o, name, options, fn) {
  typeof options !== 'object' && (fn = options, options = {})
  const line = new Error().stack.split('\n')[3].match(':([0-9]+):')[1]

  await 1

  if (only && !o)
    return

  tests[line] = { fn, line, name }
  promise = promise.then(() => Promise.race([
    new Promise((resolve, reject) =>
      fn.timer = setTimeout(() => reject('Timed out'), (options.timeout || t.timeout) * 1000)
    ),
    failed
      ? (ignored++, ignore)
      : fn()
  ]))
    .then(async x => {
      clearTimeout(fn.timer)
      if (x === ignore)
        return

      if (!Array.isArray(x))
        throw new Error('Test should return result array')

      const [expected, got] = await Promise.all(x)
      if (expected !== got) {
        failed = true
        throw new Error(util.inspect(expected) + ' != ' + util.inspect(got))
      }

      tests[line].succeeded = true
      process.stdout.write('✅')
    })
    .catch(err => {
      tests[line].failed = failed = true
      tests[line].error = err instanceof Error ? err : new Error(util.inspect(err))
    })
    .then(() => {
      ++done === Object.keys(tests).length && exit()
    })
}

function exit() {
  let success = true
  Object.values(tests).every((x) => {
    if (x.succeeded)
      return true

    success = false
    x.cleanup
      ? console.error('⛔️', x.name + ' at line', x.line, 'cleanup failed', '\n', util.inspect(x.cleanup))
      : console.error('⛔️', x.name + ' at line', x.line, x.failed
        ? 'failed'
        : 'never finished', x.error ? '\n' + util.inspect(x.error) : ''
      )
  })

  only
    ? console.error('⚠️', 'Not all tests were run')
    : ignored
      ? console.error('⚠️', ignored, 'ignored test' + (ignored === 1 ? '' : 's', '\n'))
      : success
        ? console.log('🎉')
        : console.error('⚠️', 'Not good')

  !process.exitCode && (!success || only || ignored) && (process.exitCode = 1)
}


```

---


## engines@7.4.2

**Funções usados neste arquivo:** PrismaClient, component, upsert, externalComponent, externalTestFile, findMany, $disconnect, PrismaLibSql


## debug@7.4.2

**Funções usados neste arquivo:** PrismaClient, component, upsert, externalComponent, externalTestFile, findMany, $disconnect, PrismaLibSql

### test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/121d38193b-graceful-fs/test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
var fs = require('fs')
var tap = require('tap')
var dir = __dirname + '/test'
var node = process.execPath
var path = require('path')

var files = fs.readdirSync(dir)
var env = Object.keys(process.env).reduce(function (env, k) {
  env[k] = process.env[k]
  return env
}, {
  TEST_GRACEFUL_FS_GLOBAL_PATCH: 1
})

tap.jobs = require('os').cpus().length
var testFiles = files.filter(function (f) {
  return (/\.js$/.test(f) && fs.statSync(dir + '/' + f).isFile())
})

tap.plan(testFiles.length)
testFiles.forEach(function(f) {
  tap.test(f, function(t) {
    t.spawn(node, ['--expose-gc', 'test/' + f])
    if (path.basename(f) !== 'monkeypatch-by-accident.js') {
      t.spawn(node, ['--expose-gc', 'test/' + f], {
        env: env
      }, '🐵  test/' + f)
    }
    t.end()
  })
})

```

---

### chown-er-ok.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/121d38193b-graceful-fs/test/chown-er-ok.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
var realFs = require('fs')

var methods = ['chown', 'chownSync', 'chmod', 'chmodSync']
methods.forEach(function (method) {
  causeErr(method, realFs[method])
})

function causeErr (method, original) {
  realFs[method] = function (path) {
    var err = makeErr(path, method)
    if (!/Sync$/.test(method)) {
      var cb = arguments[arguments.length - 1]
      process.nextTick(cb.bind(null, err))
    } else {
      throw err
    }
  }
}

function makeErr (path, method) {
  var err = new Error('this is fine')
  err.syscall = method.replace(/Sync$/, '')
  err.code = path.toUpperCase()
  return err
}

var fs = require('../')
var t = require('tap')

var errs = ['ENOSYS', 'EINVAL', 'EPERM']
t.plan(errs.length * methods.length)

errs.forEach(function (err) {
  methods.forEach(function (method) {
    var args = [err]
    if (/chmod/.test(method)) {
      args.push('some mode')
    } else {
      args.push('some uid', 'some gid')
    }

    if (method.match(/Sync$/)) {
      t.doesNotThrow(function () {
        fs[method].apply(fs, args)
      })
    } else {
      args.push(function (err) {
        t.notOk(err)
      })
      fs[method].apply(fs, args)
    }
  })
})

```

---

### close.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/121d38193b-graceful-fs/test/close.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
var fs = require('fs')
var path = require('path')
var gfsPath = path.resolve(__dirname, '..', 'graceful-fs.js')
var gfs = require(gfsPath)
var importFresh = require('import-fresh')
var fs$close = fs.close
var fs$closeSync = fs.closeSync
var test = require('tap').test

test('`close` is patched correctly', function(t) {
  t.match(fs$close.toString(), /graceful-fs shared queue/, 'patch fs.close');
  t.match(fs$closeSync.toString(), /graceful-fs shared queue/, 'patch fs.closeSync');
  t.match(gfs.close.toString(), /graceful-fs shared queue/, 'patch gfs.close');
  t.match(gfs.closeSync.toString(), /graceful-fs shared queue/, 'patch gfs.closeSync');

  var newGFS = importFresh(gfsPath)
  t.equal(fs.close, fs$close)
  t.equal(fs.closeSync, fs$closeSync)
  t.equal(newGFS.close, fs$close)
  t.equal(newGFS.closeSync, fs$closeSync)
  t.end();
})

```

---

### do-not-break-if-chdir-is-missing.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/121d38193b-graceful-fs/test/do-not-break-if-chdir-is-missing.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
process.chdir = 'i am not a function so dont call me maybe'
const t = require('tap')
require('../')
t.equal(process.chdir, 'i am not a function so dont call me maybe')

```

---

### enoent.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/121d38193b-graceful-fs/test/enoent.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
// this test makes sure that various things get enoent, instead of
// some other kind of throw.

var g = require('../')

var NODE_VERSION_MAJOR_WITH_BIGINT = 10
var NODE_VERSION_MINOR_WITH_BIGINT = 5
var NODE_VERSION_PATCH_WITH_BIGINT = 0
var nodeVersion = process.versions.node.split('.')
var nodeVersionMajor = Number.parseInt(nodeVersion[0], 10)
var nodeVersionMinor = Number.parseInt(nodeVersion[1], 10)
var nodeVersionPatch = Number.parseInt(nodeVersion[2], 10)

function nodeSupportsBigInt () {
  if (nodeVersionMajor > NODE_VERSION_MAJOR_WITH_BIGINT) {
    return true
  } else if (nodeVersionMajor === NODE_VERSION_MAJOR_WITH_BIGINT) {
    if (nodeVersionMinor > NODE_VERSION_MINOR_WITH_BIGINT) {
      return true
    } else if (nodeVersionMinor === NODE_VERSION_MINOR_WITH_BIGINT) {
      if (nodeVersionPatch >= NODE_VERSION_PATCH_WITH_BIGINT) {
        return true
      }
    }
  }
  return false
}

var t = require('tap')
var file = 'this file does not exist even a little bit'
var methods = [
  ['open', 'r'],
  ['readFile'],
  ['stat'],
  ['lstat'],
  ['utimes', new Date(), new Date()],
  ['readdir']
]

// any version > v6 can do readdir(path, options, cb)
if (process.version.match(/^v([6-9]|[1-9][0-9])\./)) {
  methods.push(['readdir', {}])
}

// any version > v10.5 can do stat(path, options, cb)
if (nodeSupportsBigInt()) {
  methods.push(['stat', {}])
  methods.push(['lstat', {}])
}


t.plan(methods.length)
methods.forEach(function (method) {
  t.test(method[0], runTest(method))
})

function runTest (args) { return function (t) {
  var method = args.shift()
  args.unshift(file)
  var methodSync = method + 'Sync'
  t.type(g[methodSync], 'function')
  t.throws(function () {
    g[methodSync].apply(g, args)
  }, { code: 'ENOENT' })
  // add the callback
  args.push(verify(t))
  t.type(g[method], 'function')
  t.doesNotThrow(function () {
    g[method].apply(g, args)
  })
}}

function verify (t) { return function (er) {
  t.type(er, Error)
  t.equal(er.code, 'ENOENT')
  t.end()
}}

```

---

### max-open.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/121d38193b-graceful-fs/test/max-open.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
var fs = require('../')
var test = require('tap').test

test('open lots of stuff', function (t) {
  // Get around EBADF from libuv by making sure that stderr is opened
  // Otherwise Darwin will refuse to give us a FD for stderr!
  process.stderr.write('')

  // How many parallel open()'s to do
  var n = 1024
  var opens = 0
  var fds = []
  var going = true
  var closing = false
  var doneCalled = 0

  for (var i = 0; i < n; i++) {
    go()
  }

  function go() {
    opens++
    fs.open(__filename, 'r', function (er, fd) {
      if (er) throw er
      fds.push(fd)
      if (going) go()
    })
  }

  // should hit ulimit pretty fast
  setTimeout(function () {
    going = false
    t.equal(opens - fds.length, n)
    done()
  }, 100)


  function done () {
    if (closing) return
    doneCalled++

    if (fds.length === 0) {
      // First because of the timeout
      // Then to close the fd's opened afterwards
      // Then this time, to complete.
      // Might take multiple passes, depending on CPU speed
      // and ulimit, but at least 3 in every case.
      t.ok(doneCalled >= 2)
      return t.end()
    }

    closing = true
    setTimeout(function () {
      // console.error('do closing again')
      closing = false
      done()
    }, 100)

    // console.error('closing time')
    var closes = fds.slice(0)
    fds.length = 0
    closes.forEach(function (fd) {
      fs.close(fd, function (er) {
        if (er) throw er
      })
    })
  }
})

```

---

### monkeypatch-by-accident.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/121d38193b-graceful-fs/test/monkeypatch-by-accident.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH) {
  require('tap').plan(0, 'obviously not relevant when monkeypatching fs')
  process.exit(0)
}

const fs = require('fs')

// Save originals before loading graceful-fs
const names = [
  'ReadStream',
  'WriteStream',
  'FileReadStream',
  'FileWriteStream'
]
const orig = {}
names.forEach(name => orig[name] = fs[name])

const t = require('tap')
const gfs = require('../')

if (names.some(name => gfs[name] === orig[name])) {
  t.plan(0, 'graceful-fs was loaded before this test was run')
  process.exit(0)
}

t.plan(names.length)
names.forEach(name => {
  t.ok(fs[name] === orig[name], `fs.${name} unchanged`)
})

```

---

### open.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/121d38193b-graceful-fs/test/open.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
var fs = require('../')
var test = require('tap').test

test('open an existing file works', function (t) {
  var fd = fs.openSync(__filename, 'r')
  fs.closeSync(fd)
  fs.open(__filename, 'r', function (er, fd) {
    if (er) throw er
    fs.close(fd, function (er) {
      if (er) throw er
      t.pass('works')
      t.end()
    })
  })
})

test('open a non-existing file throws', function (t) {
  var er
  try {
    var fd = fs.openSync('this file does not exist', 'r')
  } catch (x) {
    er = x
  }
  t.ok(er, 'should throw')
  t.notOk(fd, 'should not get an fd')
  t.equal(er.code, 'ENOENT')

  fs.open('neither does this file', 'r', function (er, fd) {
    t.ok(er, 'should throw')
    t.notOk(fd, 'should not get an fd')
    t.equal(er.code, 'ENOENT')
    t.end()
  })
})

```

---

### read-write-stream.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/121d38193b-graceful-fs/test/read-write-stream.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict'

var fs = require('../')
var rimraf = require('rimraf')
var mkdirp = require('mkdirp')
var t = require('tap')

var td = t.testdir({
  files: {}
})
var p = require('path').resolve(td, 'files')

process.chdir(td)

// Make sure to reserve the stderr fd
process.stderr.write('')

var num = 4097
var paths = new Array(num)

t.test('write files', function (t) {
  rimraf.sync(p)
  mkdirp.sync(p)

  t.plan(num)
  for (var i = 0; i < num; ++i) {
    paths[i] = 'files/file-' + i
    var stream = fs.createWriteStream(paths[i])
    stream.on('finish', function () {
      t.pass('success')
    })
    stream.write('content')
    stream.end()
  }
})

t.test('read files', function (t) {
  // now read them
  t.plan(num)
  for (var i = 0; i < num; ++i) (function (i) {
    var stream = fs.createReadStream(paths[i])
    var data = ''
    stream.on('data', function (c) {
      data += c
    })
    stream.on('end', function () {
      t.equal(data, 'content')
    })
  })(i)
})

```

---

### readdir-options.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/121d38193b-graceful-fs/test/readdir-options.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
var fs = require("fs")
var t = require("tap")

var currentTest

var strings = ['b', 'z', 'a']
var buffs = strings.map(function (s) { return Buffer.from(s) })
var hexes = buffs.map(function (b) { return b.toString('hex') })

function getRet (encoding) {
  switch (encoding) {
    case 'hex':
      return hexes
    case 'buffer':
      return buffs
    default:
      return strings
  }
}

var readdir = fs.readdir
var failed = false
fs.readdir = function(path, options, cb) {
  if (!failed) {
    // simulate an EMFILE and then open and close a thing to retry
    failed = true
    process.nextTick(function () {
      var er = new Error('synthetic emfile')
      er.code = 'EMFILE'
      cb(er)
      process.nextTick(function () {
        g.closeSync(fs.openSync(__filename, 'r'))
      })
    })
    return
  }

  failed = false
  currentTest.type(cb, 'function')
  currentTest.type(options, 'object')
  currentTest.ok(options)
  process.nextTick(function() {
    var ret = getRet(options.encoding)
    cb(null, ret)
  })
}

var g = require("../")

var encodings = ['buffer', 'hex', 'utf8', null]
encodings.forEach(function (enc) {
  t.test('encoding=' + enc, function (t) {
    currentTest = t
    g.readdir("whatevers", { encoding: enc }, function (er, files) {
      if (er)
        throw er
      t.same(files, getRet(enc).sort())
      t.end()
    })
  })
})

```

---

### readdir-sort.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/121d38193b-graceful-fs/test/readdir-sort.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
var fs = require("fs")

var readdir = fs.readdir
fs.readdir = function(path, options, cb) {
  process.nextTick(function() {
    cb(null, ["b", "z", "a"])
  })
}

var g = require("../")
var test = require("tap").test

test("readdir reorder", function (t) {
  g.readdir("whatevers", function (er, files) {
    if (er)
      throw er
    t.same(files, [ "a", "b", "z" ])
    t.end()
  })
})

```

---

### readfile.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/121d38193b-graceful-fs/test/readfile.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict'

var fs = require('../')
var rimraf = require('rimraf')
var mkdirp = require('mkdirp')
var t = require('tap')

var td = t.testdir({
  files: {}
})
var p = require('path').resolve(td, 'files')

process.chdir(td)

// Make sure to reserve the stderr fd
process.stderr.write('')

var num = 4097
var paths = new Array(num)

t.test('write files', function (t) {
  rimraf.sync(p)
  mkdirp.sync(p)

  t.plan(num)
  for (var i = 0; i < num; ++i) {
    paths[i] = 'files/file-' + i
    fs.writeFile(paths[i], 'content', 'ascii', function (er) {
      if (er)
        throw er
      t.pass('written')
    })
  }
})

t.test('read files', function (t) {
  // now read them
  t.plan(num)
  for (var i = 0; i < num; ++i) {
    fs.readFile(paths[i], 'ascii', function (er, data) {
      if (er)
        throw er
      t.equal(data, 'content')
    })
  }
})

```

---

### retry.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/121d38193b-graceful-fs/test/retry.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict'

var importFresh = require('import-fresh')
var path = require('path')
var realFs = require('fs')
var test = require('tap').test

var EMFILE = Object.assign(new Error('FAKE EMFILE'), { code: 'EMFILE' })

test('eventually times out and returns error', function (t) {
  var readFile = realFs.readFile
  var realNow = Date.now

  t.teardown(function () {
    realFs.readFile = readFile
    Date.now = realNow
  })

  realFs.readFile = function (path, options, cb) {
    process.nextTick(function () {
      cb(EMFILE)
      // hijack Date.now _after_ we call the callback, the callback will
      // call it when adding the job to the queue, we want to capture it
      // any time after that first call so we can pretend it's been 60s
      Date.now = function () {
        return realNow() + 60000
      }
    })
  }

  var fs = importFresh(path.dirname(__dirname))
  fs.readFile('literally anything', function (err) {
    t.equal(err.code, 'EMFILE', 'eventually got the EMFILE')
    t.end()
  })
})

```

---

### separate-old-stream-names.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/121d38193b-graceful-fs/test/separate-old-stream-names.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
const t = require('tap')
const gfs = require('../')
t.equal(gfs.ReadStream, gfs.FileReadStream)
t.equal(gfs.WriteStream, gfs.FileWriteStream)
const frs = {}
const fws = {}
gfs.FileReadStream = frs
gfs.FileWriteStream = fws
t.equal(gfs.FileReadStream, frs)
t.equal(gfs.FileWriteStream, fws)
t.not(gfs.ReadStream, frs)
t.not(gfs.WriteStream, fws)
t.not(gfs.ReadStream, gfs.FileReadStream)
t.not(gfs.WriteStream, gfs.FileWriteStream)

```

---

### stats-uid-gid.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/121d38193b-graceful-fs/test/stats-uid-gid.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var util = require('util')
var fs = require('fs')
var test = require('tap').test

// mock fs.statSync to return signed uids/gids
var realStatSync = fs.statSync
fs.statSync = function(path) {
  var stats = realStatSync.call(fs, path)
  stats.uid = -2
  stats.gid = -2
  return stats
}

var gfs = require('../graceful-fs.js')

test('graceful fs uses same stats constructor as fs', function (t) {
  t.equal(gfs.Stats, fs.Stats, 'should reference the same constructor')

  if (!process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH) {
    t.equal(fs.statSync(__filename).uid, -2)
    t.equal(fs.statSync(__filename).gid, -2)
  }

  t.equal(gfs.statSync(__filename).uid, 0xfffffffe)
  t.equal(gfs.statSync(__filename).gid, 0xfffffffe)

  t.end()
})

test('does not throw when async stat fails', function (t) {
  gfs.stat(__filename + ' this does not exist', function (er, stats) {
    t.ok(er)
    t.notOk(stats)
    t.end()
  })
})

test('throws ENOENT when sync stat fails', function (t) {
  t.throws(function() {
    gfs.statSync(__filename + ' this does not exist')
  }, /ENOENT/)
  t.end()
})

```

---

### stats.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/121d38193b-graceful-fs/test/stats.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
var fs = require('fs')
var gfs = require('../graceful-fs.js')
var test = require('tap').test

test('graceful fs uses same stats constructor as fs', function (t) {
  t.equal(gfs.Stats, fs.Stats, 'should reference the same constructor')
  t.ok(fs.statSync(__filename) instanceof fs.Stats,
    'should be instance of fs.Stats')
  t.ok(gfs.statSync(__filename) instanceof fs.Stats,
    'should be instance of fs.Stats')
  t.end()
})

```

---

### windows-rename-polyfill.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/121d38193b-graceful-fs/test/windows-rename-polyfill.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
process.env.GRACEFUL_FS_PLATFORM = 'win32'
var t = require('tap')

var fs = require('fs')

var ers = ['EPERM', 'EBUSY', 'EACCES']
t.plan(ers.length)
ers.forEach(function(code) {
  t.test(code, function(t) {
    fs.rename = function (a, b, cb) {
      setTimeout(function () {
        var er = new Error(code + ' blerg')
        er.code = code
        cb(er)
      })
    }

    var gfs = require('../')
    var a = __dirname + '/a'
    var b = __dirname + '/b'

    t.test('setup', function (t) {
      try { fs.mkdirSync(a) } catch (e) {}
      try { fs.mkdirSync(b) } catch (e) {}
      t.end()
    })

    t.test('rename', { timeout: 100 }, function (t) {
      t.plan(1)

      gfs.rename(a, b, function (er) {
        t.ok(er)
      })
    })

    t.test('cleanup', function (t) {
      try { fs.rmdirSync(a) } catch (e) {}
      try { fs.rmdirSync(b) } catch (e) {}
      t.end()
    })

    t.end()
  })
})

```

---

### write-then-read.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/121d38193b-graceful-fs/test/write-then-read.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
var fs = require('../')
var rimraf = require('rimraf')
var mkdirp = require('mkdirp')
var t = require('tap')

var td = t.testdir({ files: {} })
var p = require('path').resolve(td, 'files')

process.chdir(td)

// Make sure to reserve the stderr fd
process.stderr.write('')

var num = 4097
var paths = new Array(num)

t.test('make files', function (t) {
  rimraf(p, function (err) {
    if (err) {
      throw err
    }
    mkdirp(p, function (err) {
      if (err) {
        throw err
      }
      for (var i = 0; i < num; ++i) {
        paths[i] = 'files/file-' + i
        fs.writeFileSync(paths[i], 'content')
      }

      t.end()
    })
  })
})

t.test('copy files', function (t) {
  var rem = num
  for (var i = 0; i < num; ++i) {
    paths[i] = 'files/file-' + i
    fs.copyFile(paths[i], paths[i] + '.copy', function(err) {
      if (err)
        throw err
      if (--rem === 0) {
        t.end()
      }
    })
  }
})

t.test('copy files with flags', function (t) {
  var rem = num
  for (var i = 0; i < num; ++i) {
    paths[i] = 'files/file-' + i
    fs.copyFile(paths[i], paths[i] + '.copy', 2, function(err) {
      if (err)
        throw err
      if (--rem === 0) {
        t.end()
      }
    })
  }
})

t.test('read files', function (t) {
  function expectContent(err, data) {
    if (err)
      throw err

    t.equal(data, 'content')
  }

  // now read them
  t.plan(num * 2)
  for (var i = 0; i < num; ++i) {
    fs.readFile(paths[i], 'ascii', expectContent)
    fs.readFile(paths[i] + '.copy', 'ascii', expectContent)
  }
})

```

---

### zzz-avoid-memory-leak.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/121d38193b-graceful-fs/test/zzz-avoid-memory-leak.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
var importFresh = require('import-fresh');
var t = require('tap')
var v8
try {
  v8 = require('v8')
} catch (er) {}

if (!v8 || !v8.getHeapStatistics || typeof v8.getHeapStatistics().number_of_detached_contexts !== 'number') {
  t.plan(0, 'no reliable context tracking available')
  process.exit(0)
}

if (typeof global.gc !== 'function') {
  t.plan(0, '--expose_gc not enabled')
  process.exit(0)
}

function checkHeap (t) {
  var v8stats = v8.getHeapStatistics()
  t.equal(v8stats.number_of_detached_contexts, 0, 'no detached contexts')
}

t.test('no memory leak when loading multiple times', function(t) {
  t.plan(1);
  importFresh(process.cwd() + '/graceful-fs.js') // node 0.10-5 were getting: Cannot find module '../'
  // simulate project with 4000 tests
  var i = 0;
  function importFreshGracefulFs() {
    importFresh(process.cwd() + '/graceful-fs.js');
    if (i < 4000) {
      i++;
      process.nextTick(importFreshGracefulFs)
    } else {
      global.gc()
      checkHeap(t);
      t.end();
    }
  }
  importFreshGracefulFs();
})

```

---


## prisma-ast@0.13.1

**Funções usados neste arquivo:** PrismaClient, component, upsert, externalComponent, externalTestFile, findMany, $disconnect, PrismaLibSql

### test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/3f87067902-expand-template/test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
var test = require('tape')
var Expand = require('./')

test('default expands {} placeholders', function (t) {
  var expand = Expand()
  t.equal(typeof expand, 'function', 'is a function')
  t.equal(expand('{foo}/{bar}', {
    foo: 'BAR', bar: 'FOO'
  }), 'BAR/FOO')
  t.equal(expand('{foo}{foo}{foo}', {
    foo: 'FOO'
  }), 'FOOFOOFOO', 'expands one placeholder many times')
  t.end()
})

test('support for custom separators', function (t) {
  var expand = Expand({ sep: '[]' })
  t.equal(expand('[foo]/[bar]', {
    foo: 'BAR', bar: 'FOO'
  }), 'BAR/FOO')
  t.equal(expand('[foo][foo][foo]', {
    foo: 'FOO'
  }), 'FOOFOOFOO', 'expands one placeholder many times')
  t.end()
})

test('support for longer custom separators', function (t) {
  var expand = Expand({ sep: '[[]]' })
  t.equal(expand('[[foo]]/[[bar]]', {
    foo: 'BAR', bar: 'FOO'
  }), 'BAR/FOO')
  t.equal(expand('[[foo]][[foo]][[foo]]', {
    foo: 'FOO'
  }), 'FOOFOOFOO', 'expands one placeholder many times')
  t.end()
})

test('whitespace-insensitive', function (t) {
  var expand = Expand({ sep: '[]' })
  t.equal(expand('[ foo ]/[ bar ]', {
    foo: 'BAR', bar: 'FOO'
  }), 'BAR/FOO')
  t.equal(expand('[ foo ][ foo  ][ foo]', {
    foo: 'FOO'
  }), 'FOOFOOFOO', 'expands one placeholder many times')
  t.end()
})

test('dollar escape', function (t) {
  var expand = Expand()
  t.equal(expand('before {foo} after', {
    foo: '$'
  }), 'before $ after')
  t.equal(expand('before {foo} after', {
    foo: '$&'
  }), 'before $& after')
  t.equal(expand('before {foo} after', {
    foo: '$`'
  }), 'before $` after')
  t.equal(expand('before {foo} after', {
    foo: '$\''
  }), 'before $\' after')
  t.equal(expand('before {foo} after', {
    foo: '$0'
  }), 'before $0 after')
  t.end()
})

```

---


## get-platform@7.2.0

**Funções usados neste arquivo:** PrismaClient, component, upsert, externalComponent, externalTestFile, findMany, $disconnect, PrismaLibSql

### all_bool.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/25b0395e9a-minimist/test/all_bool.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

var parse = require('../');
var test = require('tape');

test('flag boolean true (default all --args to boolean)', function (t) {
	var argv = parse(['moo', '--honk', 'cow'], {
		boolean: true,
	});

	t.deepEqual(argv, {
		honk: true,
		_: ['moo', 'cow'],
	});

	t.deepEqual(typeof argv.honk, 'boolean');
	t.end();
});

test('flag boolean true only affects double hyphen arguments without equals signs', function (t) {
	var argv = parse(['moo', '--honk', 'cow', '-p', '55', '--tacos=good'], {
		boolean: true,
	});

	t.deepEqual(argv, {
		honk: true,
		tacos: 'good',
		p: 55,
		_: ['moo', 'cow'],
	});

	t.deepEqual(typeof argv.honk, 'boolean');
	t.end();
});

```

---

### bool.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/25b0395e9a-minimist/test/bool.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

var parse = require('../');
var test = require('tape');

test('flag boolean default false', function (t) {
	var argv = parse(['moo'], {
		boolean: ['t', 'verbose'],
		default: { verbose: false, t: false },
	});

	t.deepEqual(argv, {
		verbose: false,
		t: false,
		_: ['moo'],
	});

	t.deepEqual(typeof argv.verbose, 'boolean');
	t.deepEqual(typeof argv.t, 'boolean');
	t.end();

});

test('boolean groups', function (t) {
	var argv = parse(['-x', '-z', 'one', 'two', 'three'], {
		boolean: ['x', 'y', 'z'],
	});

	t.deepEqual(argv, {
		x: true,
		y: false,
		z: true,
		_: ['one', 'two', 'three'],
	});

	t.deepEqual(typeof argv.x, 'boolean');
	t.deepEqual(typeof argv.y, 'boolean');
	t.deepEqual(typeof argv.z, 'boolean');
	t.end();
});
test('boolean and alias with chainable api', function (t) {
	var aliased = ['-h', 'derp'];
	var regular = ['--herp', 'derp'];
	var aliasedArgv = parse(aliased, {
		boolean: 'herp',
		alias: { h: 'herp' },
	});
	var propertyArgv = parse(regular, {
		boolean: 'herp',
		alias: { h: 'herp' },
	});
	var expected = {
		herp: true,
		h: true,
		_: ['derp'],
	};

	t.same(aliasedArgv, expected);
	t.same(propertyArgv, expected);
	t.end();
});

test('boolean and alias with options hash', function (t) {
	var aliased = ['-h', 'derp'];
	var regular = ['--herp', 'derp'];
	var opts = {
		alias: { h: 'herp' },
		boolean: 'herp',
	};
	var aliasedArgv = parse(aliased, opts);
	var propertyArgv = parse(regular, opts);
	var expected = {
		herp: true,
		h: true,
		_: ['derp'],
	};
	t.same(aliasedArgv, expected);
	t.same(propertyArgv, expected);
	t.end();
});

test('boolean and alias array with options hash', function (t) {
	var aliased = ['-h', 'derp'];
	var regular = ['--herp', 'derp'];
	var alt = ['--harp', 'derp'];
	var opts = {
		alias: { h: ['herp', 'harp'] },
		boolean: 'h',
	};
	var aliasedArgv = parse(aliased, opts);
	var propertyArgv = parse(regular, opts);
	var altPropertyArgv = parse(alt, opts);
	var expected = {
		harp: true,
		herp: true,
		h: true,
		_: ['derp'],
	};
	t.same(aliasedArgv, expected);
	t.same(propertyArgv, expected);
	t.same(altPropertyArgv, expected);
	t.end();
});

test('boolean and alias using explicit true', function (t) {
	var aliased = ['-h', 'true'];
	var regular = ['--herp', 'true'];
	var opts = {
		alias: { h: 'herp' },
		boolean: 'h',
	};
	var aliasedArgv = parse(aliased, opts);
	var propertyArgv = parse(regular, opts);
	var expected = {
		herp: true,
		h: true,
		_: [],
	};

	t.same(aliasedArgv, expected);
	t.same(propertyArgv, expected);
	t.end();
});

// regression, see https://github.com/substack/node-optimist/issues/71
test('boolean and --x=true', function (t) {
	var parsed = parse(['--boool', '--other=true'], {
		boolean: 'boool',
	});

	t.same(parsed.boool, true);
	t.same(parsed.other, 'true');

	parsed = parse(['--boool', '--other=false'], {
		boolean: 'boool',
	});

	t.same(parsed.boool, true);
	t.same(parsed.other, 'false');
	t.end();
});

test('boolean --boool=true', function (t) {
	var parsed = parse(['--boool=true'], {
		default: {
			boool: false,
		},
		boolean: ['boool'],
	});

	t.same(parsed.boool, true);
	t.end();
});

test('boolean --boool=false', function (t) {
	var parsed = parse(['--boool=false'], {
		default: {
			boool: true,
		},
		boolean: ['boool'],
	});

	t.same(parsed.boool, false);
	t.end();
});

test('boolean using something similar to true', function (t) {
	var opts = { boolean: 'h' };
	var result = parse(['-h', 'true.txt'], opts);
	var expected = {
		h: true,
		_: ['true.txt'],
	};

	t.same(result, expected);
	t.end();
});

```

---

### dash.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/25b0395e9a-minimist/test/dash.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

var parse = require('../');
var test = require('tape');

test('-', function (t) {
	t.plan(6);
	t.deepEqual(parse(['-n', '-']), { n: '-', _: [] });
	t.deepEqual(parse(['--nnn', '-']), { nnn: '-', _: [] });
	t.deepEqual(parse(['-']), { _: ['-'] });
	t.deepEqual(parse(['-f-']), { f: '-', _: [] });
	t.deepEqual(
		parse(['-b', '-'], { boolean: 'b' }),
		{ b: true, _: ['-'] }
	);
	t.deepEqual(
		parse(['-s', '-'], { string: 's' }),
		{ s: '-', _: [] }
	);
});

test('-a -- b', function (t) {
	t.plan(2);
	t.deepEqual(parse(['-a', '--', 'b']), { a: true, _: ['b'] });
	t.deepEqual(parse(['--a', '--', 'b']), { a: true, _: ['b'] });
});

test('move arguments after the -- into their own `--` array', function (t) {
	t.plan(1);
	t.deepEqual(
		parse(['--name', 'John', 'before', '--', 'after'], { '--': true }),
		{ name: 'John', _: ['before'], '--': ['after'] }
	);
});

test('--- option value', function (t) {
	// A multi-dash value is largely an edge case, but check the behaviour is as expected,
	// and in particular the same for short option and long option (as made consistent in Jan 2023).
	t.plan(2);
	t.deepEqual(parse(['-n', '---']), { n: '---', _: [] });
	t.deepEqual(parse(['--nnn', '---']), { nnn: '---', _: [] });
});


```

---

### default_bool.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/25b0395e9a-minimist/test/default_bool.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

var test = require('tape');
var parse = require('../');

test('boolean default true', function (t) {
	var argv = parse([], {
		boolean: 'sometrue',
		default: { sometrue: true },
	});
	t.equal(argv.sometrue, true);
	t.end();
});

test('boolean default false', function (t) {
	var argv = parse([], {
		boolean: 'somefalse',
		default: { somefalse: false },
	});
	t.equal(argv.somefalse, false);
	t.end();
});

test('boolean default to null', function (t) {
	var argv = parse([], {
		boolean: 'maybe',
		default: { maybe: null },
	});
	t.equal(argv.maybe, null);

	var argvLong = parse(['--maybe'], {
		boolean: 'maybe',
		default: { maybe: null },
	});
	t.equal(argvLong.maybe, true);
	t.end();
});

```

---

### dotted.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/25b0395e9a-minimist/test/dotted.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

var parse = require('../');
var test = require('tape');

test('dotted alias', function (t) {
	var argv = parse(['--a.b', '22'], { default: { 'a.b': 11 }, alias: { 'a.b': 'aa.bb' } });
	t.equal(argv.a.b, 22);
	t.equal(argv.aa.bb, 22);
	t.end();
});

test('dotted default', function (t) {
	var argv = parse('', { default: { 'a.b': 11 }, alias: { 'a.b': 'aa.bb' } });
	t.equal(argv.a.b, 11);
	t.equal(argv.aa.bb, 11);
	t.end();
});

test('dotted default with no alias', function (t) {
	var argv = parse('', { default: { 'a.b': 11 } });
	t.equal(argv.a.b, 11);
	t.end();
});

```

---

### kv_short.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/25b0395e9a-minimist/test/kv_short.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

var parse = require('../');
var test = require('tape');

test('short -k=v', function (t) {
	t.plan(1);

	var argv = parse(['-b=123']);
	t.deepEqual(argv, { b: 123, _: [] });
});

test('multi short -k=v', function (t) {
	t.plan(1);

	var argv = parse(['-a=whatever', '-b=robots']);
	t.deepEqual(argv, { a: 'whatever', b: 'robots', _: [] });
});

test('short with embedded equals -k=a=b', function (t) {
	t.plan(1);

	var argv = parse(['-k=a=b']);
	t.deepEqual(argv, { k: 'a=b', _: [] });
});

test('short with later equals like -ab=c', function (t) {
	t.plan(1);

	var argv = parse(['-ab=c']);
	t.deepEqual(argv, { a: true, b: 'c', _: [] });
});

```

---

### long.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/25b0395e9a-minimist/test/long.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

var test = require('tape');
var parse = require('../');

test('long opts', function (t) {
	t.deepEqual(
		parse(['--bool']),
		{ bool: true, _: [] },
		'long boolean'
	);
	t.deepEqual(
		parse(['--pow', 'xixxle']),
		{ pow: 'xixxle', _: [] },
		'long capture sp'
	);
	t.deepEqual(
		parse(['--pow=xixxle']),
		{ pow: 'xixxle', _: [] },
		'long capture eq'
	);
	t.deepEqual(
		parse(['--host', 'localhost', '--port', '555']),
		{ host: 'localhost', port: 555, _: [] },
		'long captures sp'
	);
	t.deepEqual(
		parse(['--host=localhost', '--port=555']),
		{ host: 'localhost', port: 555, _: [] },
		'long captures eq'
	);
	t.end();
});

```

---

### num.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/25b0395e9a-minimist/test/num.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

var parse = require('../');
var test = require('tape');

test('nums', function (t) {
	var argv = parse([
		'-x', '1234',
		'-y', '5.67',
		'-z', '1e7',
		'-w', '10f',
		'--hex', '0xdeadbeef',
		'789',
	]);
	t.deepEqual(argv, {
		x: 1234,
		y: 5.67,
		z: 1e7,
		w: '10f',
		hex: 0xdeadbeef,
		_: [789],
	});
	t.deepEqual(typeof argv.x, 'number');
	t.deepEqual(typeof argv.y, 'number');
	t.deepEqual(typeof argv.z, 'number');
	t.deepEqual(typeof argv.w, 'string');
	t.deepEqual(typeof argv.hex, 'number');
	t.deepEqual(typeof argv._[0], 'number');
	t.end();
});

test('already a number', function (t) {
	var argv = parse(['-x', 1234, 789]);
	t.deepEqual(argv, { x: 1234, _: [789] });
	t.deepEqual(typeof argv.x, 'number');
	t.deepEqual(typeof argv._[0], 'number');
	t.end();
});

```

---

### parse.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/25b0395e9a-minimist/test/parse.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

var parse = require('../');
var test = require('tape');

test('parse args', function (t) {
	t.deepEqual(
		parse(['--no-moo']),
		{ moo: false, _: [] },
		'no'
	);
	t.deepEqual(
		parse(['-v', 'a', '-v', 'b', '-v', 'c']),
		{ v: ['a', 'b', 'c'], _: [] },
		'multi'
	);
	t.end();
});

test('comprehensive', function (t) {
	t.deepEqual(
		parse([
			'--name=meowmers', 'bare', '-cats', 'woo',
			'-h', 'awesome', '--multi=quux',
			'--key', 'value',
			'-b', '--bool', '--no-meep', '--multi=baz',
			'--', '--not-a-flag', 'eek',
		]),
		{
			c: true,
			a: true,
			t: true,
			s: 'woo',
			h: 'awesome',
			b: true,
			bool: true,
			key: 'value',
			multi: ['quux', 'baz'],
			meep: false,
			name: 'meowmers',
			_: ['bare', '--not-a-flag', 'eek'],
		}
	);
	t.end();
});

test('flag boolean', function (t) {
	var argv = parse(['-t', 'moo'], { boolean: 't' });
	t.deepEqual(argv, { t: true, _: ['moo'] });
	t.deepEqual(typeof argv.t, 'boolean');
	t.end();
});

test('flag boolean value', function (t) {
	var argv = parse(['--verbose', 'false', 'moo', '-t', 'true'], {
		boolean: ['t', 'verbose'],
		default: { verbose: true },
	});

	t.deepEqual(argv, {
		verbose: false,
		t: true,
		_: ['moo'],
	});

	t.deepEqual(typeof argv.verbose, 'boolean');
	t.deepEqual(typeof argv.t, 'boolean');
	t.end();
});

test('newlines in params', function (t) {
	var args = parse(['-s', 'X\nX']);
	t.deepEqual(args, { _: [], s: 'X\nX' });

	// reproduce in bash:
	// VALUE="new
	// line"
	// node program.js --s="$VALUE"
	args = parse(['--s=X\nX']);
	t.deepEqual(args, { _: [], s: 'X\nX' });
	t.end();
});

test('strings', function (t) {
	var s = parse(['-s', '0001234'], { string: 's' }).s;
	t.equal(s, '0001234');
	t.equal(typeof s, 'string');

	var x = parse(['-x', '56'], { string: 'x' }).x;
	t.equal(x, '56');
	t.equal(typeof x, 'string');
	t.end();
});

test('stringArgs', function (t) {
	var s = parse(['  ', '  '], { string: '_' })._;
	t.same(s.length, 2);
	t.same(typeof s[0], 'string');
	t.same(s[0], '  ');
	t.same(typeof s[1], 'string');
	t.same(s[1], '  ');
	t.end();
});

test('empty strings', function (t) {
	var s = parse(['-s'], { string: 's' }).s;
	t.equal(s, '');
	t.equal(typeof s, 'string');

	var str = parse(['--str'], { string: 'str' }).str;
	t.equal(str, '');
	t.equal(typeof str, 'string');

	var letters = parse(['-art'], {
		string: ['a', 't'],
	});

	t.equal(letters.a, '');
	t.equal(letters.r, true);
	t.equal(letters.t, '');

	t.end();
});

test('string and alias', function (t) {
	var x = parse(['--str', '000123'], {
		string: 's',
		alias: { s: 'str' },
	});

	t.equal(x.str, '000123');
	t.equal(typeof x.str, 'string');
	t.equal(x.s, '000123');
	t.equal(typeof x.s, 'string');

	var y = parse(['-s', '000123'], {
		string: 'str',
		alias: { str: 's' },
	});

	t.equal(y.str, '000123');
	t.equal(typeof y.str, 'string');
	t.equal(y.s, '000123');
	t.equal(typeof y.s, 'string');

	var z = parse(['-s123'], {
		alias: { str: ['s', 'S'] },
		string: ['str'],
	});

	t.deepEqual(
		z,
		{ _: [], s: '123', S: '123', str: '123' },
		'opt.string works with multiple aliases'
	);
	t.end();
});

test('slashBreak', function (t) {
	t.same(
		parse(['-I/foo/bar/baz']),
		{ I: '/foo/bar/baz', _: [] }
	);
	t.same(
		parse(['-xyz/foo/bar/baz']),
		{ x: true, y: true, z: '/foo/bar/baz', _: [] }
	);
	t.end();
});

test('alias', function (t) {
	var argv = parse(['-f', '11', '--zoom', '55'], {
		alias: { z: 'zoom' },
	});
	t.equal(argv.zoom, 55);
	t.equal(argv.z, argv.zoom);
	t.equal(argv.f, 11);
	t.end();
});

test('multiAlias', function (t) {
	var argv = parse(['-f', '11', '--zoom', '55'], {
		alias: { z: ['zm', 'zoom'] },
	});
	t.equal(argv.zoom, 55);
	t.equal(argv.z, argv.zoom);
	t.equal(argv.z, argv.zm);
	t.equal(argv.f, 11);
	t.end();
});

test('nested dotted objects', function (t) {
	var argv = parse([
		'--foo.bar', '3', '--foo.baz', '4',
		'--foo.quux.quibble', '5', '--foo.quux.o_O',
		'--beep.boop',
	]);

	t.same(argv.foo, {
		bar: 3,
		baz: 4,
		quux: {
			quibble: 5,
			o_O: true,
		},
	});
	t.same(argv.beep, { boop: true });
	t.end();
});

```

---

### parse_modified.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/25b0395e9a-minimist/test/parse_modified.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

var parse = require('../');
var test = require('tape');

test('parse with modifier functions', function (t) {
	t.plan(1);

	var argv = parse(['-b', '123'], { boolean: 'b' });
	t.deepEqual(argv, { b: true, _: [123] });
});

```

---

### proto.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/25b0395e9a-minimist/test/proto.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

/* eslint no-proto: 0 */

var parse = require('../');
var test = require('tape');

test('proto pollution', function (t) {
	var argv = parse(['--__proto__.x', '123']);
	t.equal({}.x, undefined);
	t.equal(argv.__proto__.x, undefined);
	t.equal(argv.x, undefined);
	t.end();
});

test('proto pollution (array)', function (t) {
	var argv = parse(['--x', '4', '--x', '5', '--x.__proto__.z', '789']);
	t.equal({}.z, undefined);
	t.deepEqual(argv.x, [4, 5]);
	t.equal(argv.x.z, undefined);
	t.equal(argv.x.__proto__.z, undefined);
	t.end();
});

test('proto pollution (number)', function (t) {
	var argv = parse(['--x', '5', '--x.__proto__.z', '100']);
	t.equal({}.z, undefined);
	t.equal((4).z, undefined);
	t.equal(argv.x, 5);
	t.equal(argv.x.z, undefined);
	t.end();
});

test('proto pollution (string)', function (t) {
	var argv = parse(['--x', 'abc', '--x.__proto__.z', 'def']);
	t.equal({}.z, undefined);
	t.equal('...'.z, undefined);
	t.equal(argv.x, 'abc');
	t.equal(argv.x.z, undefined);
	t.end();
});

test('proto pollution (constructor)', function (t) {
	var argv = parse(['--constructor.prototype.y', '123']);
	t.equal({}.y, undefined);
	t.equal(argv.y, undefined);
	t.end();
});

test('proto pollution (constructor function)', function (t) {
	var argv = parse(['--_.concat.constructor.prototype.y', '123']);
	function fnToBeTested() {}
	t.equal(fnToBeTested.y, undefined);
	t.equal(argv.y, undefined);
	t.end();
});

// powered by snyk - https://github.com/backstage/backstage/issues/10343
test('proto pollution (constructor function) snyk', function (t) {
	var argv = parse('--_.constructor.constructor.prototype.foo bar'.split(' '));
	t.equal(function () {}.foo, undefined);
	t.equal(argv.y, undefined);
	t.end();
});

```

---

### short.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/25b0395e9a-minimist/test/short.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

var parse = require('../');
var test = require('tape');

test('numeric short args', function (t) {
	t.plan(2);
	t.deepEqual(parse(['-n123']), { n: 123, _: [] });
	t.deepEqual(
		parse(['-123', '456']),
		{ 1: true, 2: true, 3: 456, _: [] }
	);
});

test('short', function (t) {
	t.deepEqual(
		parse(['-b']),
		{ b: true, _: [] },
		'short boolean'
	);
	t.deepEqual(
		parse(['foo', 'bar', 'baz']),
		{ _: ['foo', 'bar', 'baz'] },
		'bare'
	);
	t.deepEqual(
		parse(['-cats']),
		{ c: true, a: true, t: true, s: true, _: [] },
		'group'
	);
	t.deepEqual(
		parse(['-cats', 'meow']),
		{ c: true, a: true, t: true, s: 'meow', _: [] },
		'short group next'
	);
	t.deepEqual(
		parse(['-h', 'localhost']),
		{ h: 'localhost', _: [] },
		'short capture'
	);
	t.deepEqual(
		parse(['-h', 'localhost', '-p', '555']),
		{ h: 'localhost', p: 555, _: [] },
		'short captures'
	);
	t.end();
});

test('mixed short bool and capture', function (t) {
	t.same(
		parse(['-h', 'localhost', '-fp', '555', 'script.js']),
		{
			f: true, p: 555, h: 'localhost',
			_: ['script.js'],
		}
	);
	t.end();
});

test('short and long', function (t) {
	t.deepEqual(
		parse(['-h', 'localhost', '-fp', '555', 'script.js']),
		{
			f: true, p: 555, h: 'localhost',
			_: ['script.js'],
		}
	);
	t.end();
});

```

---

### stop_early.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/25b0395e9a-minimist/test/stop_early.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

var parse = require('../');
var test = require('tape');

test('stops parsing on the first non-option when stopEarly is set', function (t) {
	var argv = parse(['--aaa', 'bbb', 'ccc', '--ddd'], {
		stopEarly: true,
	});

	t.deepEqual(argv, {
		aaa: 'bbb',
		_: ['ccc', '--ddd'],
	});

	t.end();
});

```

---

### unknown.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/25b0395e9a-minimist/test/unknown.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

var parse = require('../');
var test = require('tape');

test('boolean and alias is not unknown', function (t) {
	var unknown = [];
	function unknownFn(arg) {
		unknown.push(arg);
		return false;
	}
	var aliased = ['-h', 'true', '--derp', 'true'];
	var regular = ['--herp', 'true', '-d', 'true'];
	var opts = {
		alias: { h: 'herp' },
		boolean: 'h',
		unknown: unknownFn,
	};
	parse(aliased, opts);
	parse(regular, opts);

	t.same(unknown, ['--derp', '-d']);
	t.end();
});

test('flag boolean true any double hyphen argument is not unknown', function (t) {
	var unknown = [];
	function unknownFn(arg) {
		unknown.push(arg);
		return false;
	}
	var argv = parse(['--honk', '--tacos=good', 'cow', '-p', '55'], {
		boolean: true,
		unknown: unknownFn,
	});
	t.same(unknown, ['--tacos=good', 'cow', '-p']);
	t.same(argv, {
		honk: true,
		_: [],
	});
	t.end();
});

test('string and alias is not unknown', function (t) {
	var unknown = [];
	function unknownFn(arg) {
		unknown.push(arg);
		return false;
	}
	var aliased = ['-h', 'hello', '--derp', 'goodbye'];
	var regular = ['--herp', 'hello', '-d', 'moon'];
	var opts = {
		alias: { h: 'herp' },
		string: 'h',
		unknown: unknownFn,
	};
	parse(aliased, opts);
	parse(regular, opts);

	t.same(unknown, ['--derp', '-d']);
	t.end();
});

test('default and alias is not unknown', function (t) {
	var unknown = [];
	function unknownFn(arg) {
		unknown.push(arg);
		return false;
	}
	var aliased = ['-h', 'hello'];
	var regular = ['--herp', 'hello'];
	var opts = {
		default: { h: 'bar' },
		alias: { h: 'herp' },
		unknown: unknownFn,
	};
	parse(aliased, opts);
	parse(regular, opts);

	t.same(unknown, []);
	t.end();
	unknownFn(); // exercise fn for 100% coverage
});

test('value following -- is not unknown', function (t) {
	var unknown = [];
	function unknownFn(arg) {
		unknown.push(arg);
		return false;
	}
	var aliased = ['--bad', '--', 'good', 'arg'];
	var opts = {
		'--': true,
		unknown: unknownFn,
	};
	var argv = parse(aliased, opts);

	t.same(unknown, ['--bad']);
	t.same(argv, {
		'--': ['good', 'arg'],
		_: [],
	});
	t.end();
});

```

---

### whitespace.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/25b0395e9a-minimist/test/whitespace.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

var parse = require('../');
var test = require('tape');

test('whitespace should be whitespace', function (t) {
	t.plan(1);
	var x = parse(['-x', '\t']).x;
	t.equal(x, '\t');
});

```

---


## query-plan-executor@7.2.0

**Funções usados neste arquivo:** PrismaClient, component, upsert, externalComponent, externalTestFile, findMany, $disconnect, PrismaLibSql


## engines-version@7.5.0-10.94a226be1cf2967af2541cca5529f0f7ba866919

**Funções usados neste arquivo:** PrismaClient, component, upsert, externalComponent, externalTestFile, findMany, $disconnect, PrismaLibSql

### autobahn-server.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/1457b75dc8-ws/test/autobahn-server.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

const WebSocket = require('../');

const port = process.argv.length > 2 ? parseInt(process.argv[2]) : 9001;
const wss = new WebSocket.Server({ port }, () => {
  console.log(
    `Listening to port ${port}. Use extra argument to define the port`
  );
});

wss.on('connection', (ws) => {
  ws.on('message', (data, isBinary) => {
    ws.send(data, { binary: isBinary });
  });
  ws.on('error', (e) => console.error(e));
});

```

---

### autobahn.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/1457b75dc8-ws/test/autobahn.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

const WebSocket = require('../');

let currentTest = 1;
let testCount;

function nextTest() {
  let ws;

  if (currentTest > testCount) {
    ws = new WebSocket('ws://localhost:9001/updateReports?agent=ws');
    return;
  }

  console.log(`Running test case ${currentTest}/${testCount}`);

  ws = new WebSocket(
    `ws://localhost:9001/runCase?case=${currentTest}&agent=ws`
  );
  ws.on('message', (data, isBinary) => {
    ws.send(data, { binary: isBinary });
  });
  ws.on('close', () => {
    currentTest++;
    process.nextTick(nextTest);
  });
  ws.on('error', (e) => console.error(e));
}

const ws = new WebSocket('ws://localhost:9001/getCaseCount');
ws.on('message', (data) => {
  testCount = parseInt(data);
});
ws.on('close', () => {
  if (testCount > 0) {
    nextTest();
  }
});

```

---

### buffer-util.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/1457b75dc8-ws/test/buffer-util.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

const assert = require('assert');

const { concat } = require('../lib/buffer-util');

describe('bufferUtil', () => {
  describe('concat', () => {
    it('never returns uninitialized data', () => {
      const buf = concat([Buffer.from([1, 2]), Buffer.from([3, 4])], 6);

      assert.ok(buf.equals(Buffer.from([1, 2, 3, 4])));
    });
  });
});

```

---

### create-websocket-stream.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/1457b75dc8-ws/test/create-websocket-stream.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

const assert = require('assert');
const EventEmitter = require('events');
const { createServer } = require('http');
const { Duplex, getDefaultHighWaterMark } = require('stream');
const { randomBytes } = require('crypto');

const createWebSocketStream = require('../lib/stream');
const Sender = require('../lib/sender');
const WebSocket = require('..');
const { EMPTY_BUFFER } = require('../lib/constants');

const highWaterMark = getDefaultHighWaterMark
  ? getDefaultHighWaterMark(false)
  : 16 * 1024;

describe('createWebSocketStream', () => {
  it('is exposed as a property of the `WebSocket` class', () => {
    assert.strictEqual(WebSocket.createWebSocketStream, createWebSocketStream);
  });

  it('returns a `Duplex` stream', () => {
    const duplex = createWebSocketStream(new EventEmitter());

    assert.ok(duplex instanceof Duplex);
  });

  it('passes the options object to the `Duplex` constructor', (done) => {
    const wss = new WebSocket.Server({ port: 0 }, () => {
      const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
      const duplex = createWebSocketStream(ws, {
        allowHalfOpen: false,
        encoding: 'utf8'
      });

      duplex.on('data', (chunk) => {
        assert.strictEqual(chunk, 'hi');

        duplex.on('close', () => {
          wss.close(done);
        });
      });
    });

    wss.on('connection', (ws) => {
      ws.send(Buffer.from('hi'));
      ws.close();
    });
  });

  describe('The returned stream', () => {
    it('buffers writes if `readyState` is `CONNECTING`', (done) => {
      const chunk = randomBytes(1024);
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        assert.strictEqual(ws.readyState, WebSocket.CONNECTING);

        const duplex = createWebSocketStream(ws);

        duplex.write(chunk);
      });

      wss.on('connection', (ws) => {
        ws.on('message', (message, isBinary) => {
          ws.on('close', (code, reason) => {
            assert.deepStrictEqual(message, chunk);
            assert.ok(isBinary);
            assert.strictEqual(code, 1005);
            assert.strictEqual(reason, EMPTY_BUFFER);
            wss.close(done);
          });
        });

        ws.close();
      });
    });

    it('errors if a write occurs when `readyState` is `CLOSING`', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
        const duplex = createWebSocketStream(ws);

        duplex.on('error', (err) => {
          assert.ok(duplex.destroyed);
          assert.ok(err instanceof Error);
          assert.strictEqual(
            err.message,
            'WebSocket is not open: readyState 2 (CLOSING)'
          );

          duplex.on('close', () => {
            wss.close(done);
          });
        });

        ws.on('open', () => {
          ws._receiver.on('conclude', () => {
            duplex.write('hi');
          });
        });
      });

      wss.on('connection', (ws) => {
        ws.close();
      });
    });

    it('errors if a write occurs when `readyState` is `CLOSED`', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
        const duplex = createWebSocketStream(ws);

        duplex.on('error', (err) => {
          assert.ok(duplex.destroyed);
          assert.ok(err instanceof Error);
          assert.strictEqual(
            err.message,
            'WebSocket is not open: readyState 3 (CLOSED)'
          );

          duplex.on('close', () => {
            wss.close(done);
          });
        });

        ws.on('close', () => {
          duplex.write('hi');
        });
      });

      wss.on('connection', (ws) => {
        ws.close();
      });
    });

    it('does not error if `_final()` is called while connecting', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        assert.strictEqual(ws.readyState, WebSocket.CONNECTING);

        const duplex = createWebSocketStream(ws);

        duplex.on('close', () => {
          wss.close(done);
        });

        duplex.resume();
        duplex.end();
      });
    });

    it('makes `_final()` a noop if no socket is assigned', (done) => {
      const server = createServer();

      server.on('upgrade', (request, socket) => {
        socket.on('end', socket.end);

        const headers = [
          'HTTP/1.1 101 Switching Protocols',
          'Upgrade: websocket',
          'Connection: Upgrade',
          'Sec-WebSocket-Accept: foo'
        ];

        socket.write(headers.concat('\r\n').join('\r\n'));
      });

      server.listen(() => {
        const called = [];
        const ws = new WebSocket(`ws://localhost:${server.address().port}`);
        const duplex = WebSocket.createWebSocketStream(ws);
        const final = duplex._final;

        duplex._final = (callback) => {
          called.push('final');
          assert.strictEqual(ws.readyState, WebSocket.CLOSING);
          assert.strictEqual(ws._socket, null);

          final(callback);
        };

        duplex.on('error', (err) => {
          called.push('error');
          assert.ok(err instanceof Error);
          assert.strictEqual(
            err.message,
            'Invalid Sec-WebSocket-Accept header'
          );
        });

        duplex.on('finish', () => {
          called.push('finish');
        });

        duplex.on('close', () => {
          assert.deepStrictEqual(called, ['final', 'error']);
          server.close(done);
        });

        ws.on('upgrade', () => {
          process.nextTick(() => {
            duplex.end();
          });
        });
      });
    });

    it('reemits errors', (done) => {
      let duplexCloseEventEmitted = false;
      let serverClientCloseEventEmitted = false;

      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
        const duplex = createWebSocketStream(ws);

        duplex.on('error', (err) => {
          assert.ok(err instanceof RangeError);
          assert.strictEqual(err.code, 'WS_ERR_INVALID_OPCODE');
          assert.strictEqual(
            err.message,
            'Invalid WebSocket frame: invalid opcode 5'
          );

          duplex.on('close', () => {
            duplexCloseEventEmitted = true;
            if (serverClientCloseEventEmitted) wss.close(done);
          });
        });
      });

      wss.on('connection', (ws) => {
        ws._socket.write(Buffer.from([0x85, 0x00]));
        ws.on('close', (code, reason) => {
          assert.strictEqual(code, 1002);
          assert.deepStrictEqual(reason, EMPTY_BUFFER);

          serverClientCloseEventEmitted = true;
          if (duplexCloseEventEmitted) wss.close(done);
        });
      });
    });

    it('does not swallow errors that may occur while destroying', (done) => {
      const frame = Buffer.concat(
        Sender.frame(Buffer.from([0x22, 0xfa, 0xec, 0x78]), {
          fin: true,
          rsv1: true,
          opcode: 0x02,
          mask: false,
          readOnly: false
        })
      );

      const wss = new WebSocket.Server(
        {
          perMessageDeflate: true,
          port: 0
        },
        () => {
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
          const duplex = createWebSocketStream(ws);

          duplex.on('error', (err) => {
            assert.ok(err instanceof Error);
            assert.strictEqual(err.code, 'Z_DATA_ERROR');
            assert.strictEqual(err.errno, -3);

            duplex.on('close', () => {
              wss.close(done);
            });
          });

          let bytesRead = 0;

          ws.on('open', () => {
            ws._socket.on('data', (chunk) => {
              bytesRead += chunk.length;
              if (bytesRead === frame.length) duplex.destroy();
            });
          });
        }
      );

      wss.on('connection', (ws) => {
        ws._socket.write(frame);
      });
    });

    it("does not suppress the throwing behavior of 'error' events", (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
        createWebSocketStream(ws);
      });

      wss.on('connection', (ws) => {
        ws._socket.write(Buffer.from([0x85, 0x00]));
      });

      assert.strictEqual(
        process.listenerCount('uncaughtException'),
        EventEmitter.usingDomains ? 2 : 1
      );

      const listener = process.listeners('uncaughtException').pop();

      process.removeListener('uncaughtException', listener);
      process.once('uncaughtException', (err) => {
        assert.ok(err instanceof Error);
        assert.strictEqual(
          err.message,
          'Invalid WebSocket frame: invalid opcode 5'
        );

        process.on('uncaughtException', listener);
        wss.close(done);
      });
    });

    it("is destroyed after 'end' and 'finish' are emitted (1/2)", (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const events = [];
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
        const duplex = createWebSocketStream(ws);

        duplex.on('end', () => {
          events.push('end');
          assert.ok(duplex.destroyed);
        });

        duplex.on('close', () => {
          assert.deepStrictEqual(events, ['finish', 'end']);
          wss.close(done);
        });

        duplex.on('finish', () => {
          events.push('finish');
          assert.ok(!duplex.destroyed);
          assert.ok(duplex.readable);

          duplex.resume();
        });

        ws.on('close', () => {
          duplex.end();
        });
      });

      wss.on('connection', (ws) => {
        ws.send('foo');
        ws.close();
      });
    });

    it("is destroyed after 'end' and 'finish' are emitted (2/2)", (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const events = [];
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
        const duplex = createWebSocketStream(ws);

        duplex.on('end', () => {
          events.push('end');
          assert.ok(!duplex.destroyed);
          assert.ok(duplex.writable);

          duplex.end();
        });

        duplex.on('close', () => {
          assert.deepStrictEqual(events, ['end', 'finish']);
          wss.close(done);
        });

        duplex.on('finish', () => {
          events.push('finish');
        });

        duplex.resume();
      });

      wss.on('connection', (ws) => {
        ws.close();
      });
    });

    it('handles backpressure (1/3)', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        // eslint-disable-next-line no-unused-vars
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
      });

      wss.on('connection', (ws) => {
        const duplex = createWebSocketStream(ws);

        duplex.resume();

        duplex.on('drain', () => {
          duplex.on('close', () => {
            wss.close(done);
          });

          duplex.end();
        });

        const chunk = randomBytes(1024);
        let ret;

        do {
          ret = duplex.write(chunk);
        } while (ret !== false);
      });
    });

    it('handles backpressure (2/3)', (done) => {
      const wss = new WebSocket.Server(
        { port: 0, perMessageDeflate: true },
        () => {
          const called = [];
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
          const duplex = createWebSocketStream(ws);
          const read = duplex._read;

          duplex._read = () => {
            duplex._read = read;
            called.push('read');
            assert.ok(ws._receiver._writableState.needDrain);
            read();
            assert.ok(ws._socket.isPaused());
          };

          ws.on('open', () => {
            ws._socket.on('pause', () => {
              duplex.resume();
            });

            ws._receiver.on('drain', () => {
              called.push('drain');
              assert.ok(!ws._socket.isPaused());
              duplex.end();
            });

            const opts = {
              fin: true,
              opcode: 0x02,
              mask: false,
              readOnly: false
            };

            const list = [
              ...Sender.frame(randomBytes(highWaterMark), {
                rsv1: false,
                ...opts
              }),
              ...Sender.frame(Buffer.alloc(1), { rsv1: true, ...opts })
            ];

            // This hack is used because there is no guarantee that more than
            // `highWaterMark` bytes will be sent as a single TCP packet.
            ws._socket.push(Buffer.concat(list));
          });

          duplex.on('close', () => {
            assert.deepStrictEqual(called, ['read', 'drain']);
            wss.close(done);
          });
        }
      );
    });

    it('handles backpressure (3/3)', (done) => {
      const wss = new WebSocket.Server(
        { port: 0, perMessageDeflate: true },
        () => {
          const called = [];
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
          const duplex = createWebSocketStream(ws);
          const read = duplex._read;

          duplex._read = () => {
            called.push('read');
            assert.ok(!ws._receiver._writableState.needDrain);
            read();
            assert.ok(!ws._socket.isPaused());
            duplex.end();
          };

          ws.on('open', () => {
            ws._receiver.on('drain', () => {
              called.push('drain');
              assert.ok(ws._socket.isPaused());
              duplex.resume();
            });

            const opts = {
              fin: true,
              opcode: 0x02,
              mask: false,
              readOnly: false
            };

            const list = [
              ...Sender.frame(randomBytes(highWaterMark), {
                rsv1: false,
                ...opts
              }),
              ...Sender.frame(Buffer.alloc(1), { rsv1: true, ...opts })
            ];

            ws._socket.push(Buffer.concat(list));
          });

          duplex.on('close', () => {
            assert.deepStrictEqual(called, ['drain', 'read']);
            wss.close(done);
          });
        }
      );
    });

    it('can be destroyed (1/2)', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const error = new Error('Oops');
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
        const duplex = createWebSocketStream(ws);

        duplex.on('error', (err) => {
          assert.strictEqual(err, error);

          duplex.on('close', () => {
            wss.close(done);
          });
        });

        ws.on('open', () => {
          duplex.destroy(error);
        });
      });
    });

    it('can be destroyed (2/2)', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
        const duplex = createWebSocketStream(ws);

        duplex.on('close', () => {
          wss.close(done);
        });

        ws.on('open', () => {
          duplex.destroy();
        });
      });
    });

    it('converts text messages to strings in readable object mode', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const events = [];
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
        const duplex = createWebSocketStream(ws, { readableObjectMode: true });

        duplex.on('data', (data) => {
          events.push('data');
          assert.strictEqual(data, 'foo');
        });

        duplex.on('end', () => {
          events.push('end');
          duplex.end();
        });

        duplex.on('close', () => {
          assert.deepStrictEqual(events, ['data', 'end']);
          wss.close(done);
        });
      });

      wss.on('connection', (ws) => {
        ws.send('foo');
        ws.close();
      });
    });

    it('resumes the socket if `readyState` is `CLOSING`', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
        const duplex = createWebSocketStream(ws);

        ws.on('message', () => {
          assert.ok(ws._socket.isPaused());

          duplex.on('close', () => {
            wss.close(done);
          });

          duplex.end();

          process.nextTick(() => {
            assert.strictEqual(ws.readyState, WebSocket.CLOSING);
            duplex.resume();
          });
        });
      });

      wss.on('connection', (ws) => {
        ws.send(randomBytes(highWaterMark));
      });
    });
  });
});

```

---

### duplex-pair.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/1457b75dc8-ws/test/duplex-pair.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
//
// This code was copied from
// https://github.com/nodejs/node/blob/c506660f3267/test/common/duplexpair.js
//
// Copyright Node.js contributors. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.
//
'use strict';

const assert = require('assert');
const { Duplex } = require('stream');

const kCallback = Symbol('Callback');
const kOtherSide = Symbol('Other');

class DuplexSocket extends Duplex {
  constructor() {
    super();
    this[kCallback] = null;
    this[kOtherSide] = null;
  }

  _read() {
    const callback = this[kCallback];
    if (callback) {
      this[kCallback] = null;
      callback();
    }
  }

  _write(chunk, encoding, callback) {
    assert.notStrictEqual(this[kOtherSide], null);
    assert.strictEqual(this[kOtherSide][kCallback], null);
    if (chunk.length === 0) {
      process.nextTick(callback);
    } else {
      this[kOtherSide].push(chunk);
      this[kOtherSide][kCallback] = callback;
    }
  }

  _final(callback) {
    this[kOtherSide].on('end', callback);
    this[kOtherSide].push(null);
  }
}

function makeDuplexPair() {
  const clientSide = new DuplexSocket();
  const serverSide = new DuplexSocket();
  clientSide[kOtherSide] = serverSide;
  serverSide[kOtherSide] = clientSide;
  return { clientSide, serverSide };
}

module.exports = makeDuplexPair;

```

---

### event-target.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/1457b75dc8-ws/test/event-target.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

const assert = require('assert');

const {
  CloseEvent,
  ErrorEvent,
  Event,
  MessageEvent
} = require('../lib/event-target');

describe('Event', () => {
  describe('#ctor', () => {
    it('takes a `type` argument', () => {
      const event = new Event('foo');

      assert.strictEqual(event.type, 'foo');
    });
  });

  describe('Properties', () => {
    describe('`target`', () => {
      it('is enumerable and configurable', () => {
        const descriptor = Object.getOwnPropertyDescriptor(
          Event.prototype,
          'target'
        );

        assert.strictEqual(descriptor.configurable, true);
        assert.strictEqual(descriptor.enumerable, true);
        assert.ok(descriptor.get !== undefined);
        assert.ok(descriptor.set === undefined);
      });

      it('defaults to `null`', () => {
        const event = new Event('foo');

        assert.strictEqual(event.target, null);
      });
    });

    describe('`type`', () => {
      it('is enumerable and configurable', () => {
        const descriptor = Object.getOwnPropertyDescriptor(
          Event.prototype,
          'type'
        );

        assert.strictEqual(descriptor.configurable, true);
        assert.strictEqual(descriptor.enumerable, true);
        assert.ok(descriptor.get !== undefined);
        assert.ok(descriptor.set === undefined);
      });
    });
  });
});

describe('CloseEvent', () => {
  it('inherits from `Event`', () => {
    assert.ok(CloseEvent.prototype instanceof Event);
  });

  describe('#ctor', () => {
    it('takes a `type` argument', () => {
      const event = new CloseEvent('foo');

      assert.strictEqual(event.type, 'foo');
    });

    it('takes an optional `options` argument', () => {
      const event = new CloseEvent('close', {
        code: 1000,
        reason: 'foo',
        wasClean: true
      });

      assert.strictEqual(event.type, 'close');
      assert.strictEqual(event.code, 1000);
      assert.strictEqual(event.reason, 'foo');
      assert.strictEqual(event.wasClean, true);
    });
  });

  describe('Properties', () => {
    describe('`code`', () => {
      it('is enumerable and configurable', () => {
        const descriptor = Object.getOwnPropertyDescriptor(
          CloseEvent.prototype,
          'code'
        );

        assert.strictEqual(descriptor.configurable, true);
        assert.strictEqual(descriptor.enumerable, true);
        assert.ok(descriptor.get !== undefined);
        assert.ok(descriptor.set === undefined);
      });

      it('defaults to 0', () => {
        const event = new CloseEvent('close');

        assert.strictEqual(event.code, 0);
      });
    });

    describe('`reason`', () => {
      it('is enumerable and configurable', () => {
        const descriptor = Object.getOwnPropertyDescriptor(
          CloseEvent.prototype,
          'reason'
        );

        assert.strictEqual(descriptor.configurable, true);
        assert.strictEqual(descriptor.enumerable, true);
        assert.ok(descriptor.get !== undefined);
        assert.ok(descriptor.set === undefined);
      });

      it('defaults to an empty string', () => {
        const event = new CloseEvent('close');

        assert.strictEqual(event.reason, '');
      });
    });

    describe('`wasClean`', () => {
      it('is enumerable and configurable', () => {
        const descriptor = Object.getOwnPropertyDescriptor(
          CloseEvent.prototype,
          'wasClean'
        );

        assert.strictEqual(descriptor.configurable, true);
        assert.strictEqual(descriptor.enumerable, true);
        assert.ok(descriptor.get !== undefined);
        assert.ok(descriptor.set === undefined);
      });

      it('defaults to false', () => {
        const event = new CloseEvent('close');

        assert.strictEqual(event.wasClean, false);
      });
    });
  });
});

describe('ErrorEvent', () => {
  it('inherits from `Event`', () => {
    assert.ok(ErrorEvent.prototype instanceof Event);
  });

  describe('#ctor', () => {
    it('takes a `type` argument', () => {
      const event = new ErrorEvent('foo');

      assert.strictEqual(event.type, 'foo');
    });

    it('takes an optional `options` argument', () => {
      const error = new Error('Oops');
      const event = new ErrorEvent('error', { error, message: error.message });

      assert.strictEqual(event.type, 'error');
      assert.strictEqual(event.error, error);
      assert.strictEqual(event.message, error.message);
    });
  });

  describe('Properties', () => {
    describe('`error`', () => {
      it('is enumerable and configurable', () => {
        const descriptor = Object.getOwnPropertyDescriptor(
          ErrorEvent.prototype,
          'error'
        );

        assert.strictEqual(descriptor.configurable, true);
        assert.strictEqual(descriptor.enumerable, true);
        assert.ok(descriptor.get !== undefined);
        assert.ok(descriptor.set === undefined);
      });

      it('defaults to `null`', () => {
        const event = new ErrorEvent('error');

        assert.strictEqual(event.error, null);
      });
    });

    describe('`message`', () => {
      it('is enumerable and configurable', () => {
        const descriptor = Object.getOwnPropertyDescriptor(
          ErrorEvent.prototype,
          'message'
        );

        assert.strictEqual(descriptor.configurable, true);
        assert.strictEqual(descriptor.enumerable, true);
        assert.ok(descriptor.get !== undefined);
        assert.ok(descriptor.set === undefined);
      });

      it('defaults to an empty string', () => {
        const event = new ErrorEvent('error');

        assert.strictEqual(event.message, '');
      });
    });
  });
});

describe('MessageEvent', () => {
  it('inherits from `Event`', () => {
    assert.ok(MessageEvent.prototype instanceof Event);
  });

  describe('#ctor', () => {
    it('takes a `type` argument', () => {
      const event = new MessageEvent('foo');

      assert.strictEqual(event.type, 'foo');
    });

    it('takes an optional `options` argument', () => {
      const event = new MessageEvent('message', { data: 'bar' });

      assert.strictEqual(event.type, 'message');
      assert.strictEqual(event.data, 'bar');
    });
  });

  describe('Properties', () => {
    describe('`data`', () => {
      it('is enumerable and configurable', () => {
        const descriptor = Object.getOwnPropertyDescriptor(
          MessageEvent.prototype,
          'data'
        );

        assert.strictEqual(descriptor.configurable, true);
        assert.strictEqual(descriptor.enumerable, true);
        assert.ok(descriptor.get !== undefined);
        assert.ok(descriptor.set === undefined);
      });

      it('defaults to `null`', () => {
        const event = new MessageEvent('message');

        assert.strictEqual(event.data, null);
      });
    });
  });
});

```

---

### extension.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/1457b75dc8-ws/test/extension.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

const assert = require('assert');

const { format, parse } = require('../lib/extension');

describe('extension', () => {
  describe('parse', () => {
    it('parses a single extension', () => {
      assert.deepStrictEqual(parse('foo'), {
        foo: [{ __proto__: null }],
        __proto__: null
      });
    });

    it('parses params', () => {
      assert.deepStrictEqual(parse('foo;bar;baz=1;bar=2'), {
        foo: [{ bar: [true, '2'], baz: ['1'], __proto__: null }],
        __proto__: null
      });
    });

    it('parses multiple extensions', () => {
      assert.deepStrictEqual(parse('foo,bar;baz,foo;baz'), {
        foo: [{ __proto__: null }, { baz: [true], __proto__: null }],
        bar: [{ baz: [true], __proto__: null }],
        __proto__: null
      });
    });

    it('parses quoted params', () => {
      assert.deepStrictEqual(parse('foo;bar="hi"'), {
        foo: [{ bar: ['hi'], __proto__: null }],
        __proto__: null
      });
      assert.deepStrictEqual(parse('foo;bar="\\0"'), {
        foo: [{ bar: ['0'], __proto__: null }],
        __proto__: null
      });
      assert.deepStrictEqual(parse('foo;bar="b\\a\\z"'), {
        foo: [{ bar: ['baz'], __proto__: null }],
        __proto__: null
      });
      assert.deepStrictEqual(parse('foo;bar="b\\az";bar'), {
        foo: [{ bar: ['baz', true], __proto__: null }],
        __proto__: null
      });
      assert.throws(
        () => parse('foo;bar="baz"qux'),
        /^SyntaxError: Unexpected character at index 13$/
      );
      assert.throws(
        () => parse('foo;bar="baz" qux'),
        /^SyntaxError: Unexpected character at index 14$/
      );
    });

    it('works with names that match `Object.prototype` property names', () => {
      assert.deepStrictEqual(parse('hasOwnProperty, toString'), {
        hasOwnProperty: [{ __proto__: null }],
        toString: [{ __proto__: null }],
        __proto__: null
      });
      assert.deepStrictEqual(parse('foo;constructor'), {
        foo: [{ constructor: [true], __proto__: null }],
        __proto__: null
      });
    });

    it('ignores the optional white spaces', () => {
      const header = 'foo; bar\t; \tbaz=1\t ;  bar="1"\t\t, \tqux\t ;norf';

      assert.deepStrictEqual(parse(header), {
        foo: [{ bar: [true, '1'], baz: ['1'], __proto__: null }],
        qux: [{ norf: [true], __proto__: null }],
        __proto__: null
      });
    });

    it('throws an error if a name is empty', () => {
      [
        [',', 0],
        ['foo,,', 4],
        ['foo,  ,', 6],
        ['foo;=', 4],
        ['foo; =', 5],
        ['foo;;', 4],
        ['foo; ;', 5],
        ['foo;bar=,', 8],
        ['foo;bar=""', 9]
      ].forEach((element) => {
        assert.throws(
          () => parse(element[0]),
          new RegExp(
            `^SyntaxError: Unexpected character at index ${element[1]}$`
          )
        );
      });
    });

    it('throws an error if a white space is misplaced', () => {
      [
        [' foo', 0],
        ['f oo', 2],
        ['foo;ba r', 7],
        ['foo;bar =', 8],
        ['foo;bar= ', 8],
        ['foo;bar=ba z', 11]
      ].forEach((element) => {
        assert.throws(
          () => parse(element[0]),
          new RegExp(
            `^SyntaxError: Unexpected character at index ${element[1]}$`
          )
        );
      });
    });

    it('throws an error if a token contains invalid characters', () => {
      [
        ['f@o', 1],
        ['f\\oo', 1],
        ['"foo"', 0],
        ['f"oo"', 1],
        ['foo;b@r', 5],
        ['foo;b\\ar', 5],
        ['foo;"bar"', 4],
        ['foo;b"ar"', 5],
        ['foo;bar=b@z', 9],
        ['foo;bar=b\\az ', 9],
        ['foo;bar="b@z"', 10],
        ['foo;bar="baz;"', 12],
        ['foo;bar=b"az"', 9],
        ['foo;bar="\\\\"', 10]
      ].forEach((element) => {
        assert.throws(
          () => parse(element[0]),
          new RegExp(
            `^SyntaxError: Unexpected character at index ${element[1]}$`
          )
        );
      });
    });

    it('throws an error if the header value ends prematurely', () => {
      [
        '',
        'foo ',
        'foo\t',
        'foo, ',
        'foo;',
        'foo;bar ',
        'foo;bar,',
        'foo;bar; ',
        'foo;bar=',
        'foo;bar="baz',
        'foo;bar="1\\',
        'foo;bar="baz" '
      ].forEach((header) => {
        assert.throws(
          () => parse(header),
          /^SyntaxError: Unexpected end of input$/
        );
      });
    });
  });

  describe('format', () => {
    it('formats a single extension', () => {
      const extensions = format({ foo: {} });

      assert.strictEqual(extensions, 'foo');
    });

    it('formats params', () => {
      const extensions = format({ foo: { bar: [true, 2], baz: 1 } });

      assert.strictEqual(extensions, 'foo; bar; bar=2; baz=1');
    });

    it('formats multiple extensions', () => {
      const extensions = format({
        foo: [{}, { baz: true }],
        bar: { baz: true }
      });

      assert.strictEqual(extensions, 'foo, foo; baz, bar; baz');
    });
  });
});

```

---

### limiter.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/1457b75dc8-ws/test/limiter.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

const assert = require('assert');

const Limiter = require('../lib/limiter');

describe('Limiter', () => {
  describe('#ctor', () => {
    it('takes a `concurrency` argument', () => {
      const limiter = new Limiter(0);

      assert.strictEqual(limiter.concurrency, Infinity);
    });
  });

  describe('#kRun', () => {
    it('limits the number of jobs allowed to run concurrently', (done) => {
      const limiter = new Limiter(1);

      limiter.add((callback) => {
        setImmediate(() => {
          callback();

          assert.strictEqual(limiter.jobs.length, 0);
          assert.strictEqual(limiter.pending, 1);
        });
      });

      limiter.add((callback) => {
        setImmediate(() => {
          callback();

          assert.strictEqual(limiter.pending, 0);
          done();
        });
      });

      assert.strictEqual(limiter.jobs.length, 1);
    });
  });
});

```

---

### permessage-deflate.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/1457b75dc8-ws/test/permessage-deflate.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

const assert = require('assert');

const PerMessageDeflate = require('../lib/permessage-deflate');
const extension = require('../lib/extension');

describe('PerMessageDeflate', () => {
  describe('#offer', () => {
    it('creates an offer', () => {
      const perMessageDeflate = new PerMessageDeflate();

      assert.deepStrictEqual(perMessageDeflate.offer(), {
        client_max_window_bits: true
      });
    });

    it('uses the configuration options', () => {
      const perMessageDeflate = new PerMessageDeflate({
        serverNoContextTakeover: true,
        clientNoContextTakeover: true,
        serverMaxWindowBits: 10,
        clientMaxWindowBits: 11
      });

      assert.deepStrictEqual(perMessageDeflate.offer(), {
        server_no_context_takeover: true,
        client_no_context_takeover: true,
        server_max_window_bits: 10,
        client_max_window_bits: 11
      });
    });
  });

  describe('#accept', () => {
    it('throws an error if a parameter has multiple values', () => {
      const perMessageDeflate = new PerMessageDeflate();
      const extensions = extension.parse(
        'permessage-deflate; server_no_context_takeover; server_no_context_takeover'
      );

      assert.throws(
        () => perMessageDeflate.accept(extensions['permessage-deflate']),
        /^Error: Parameter "server_no_context_takeover" must have only a single value$/
      );
    });

    it('throws an error if a parameter has an invalid name', () => {
      const perMessageDeflate = new PerMessageDeflate();
      const extensions = extension.parse('permessage-deflate;foo');

      assert.throws(
        () => perMessageDeflate.accept(extensions['permessage-deflate']),
        /^Error: Unknown parameter "foo"$/
      );
    });

    it('throws an error if client_no_context_takeover has a value', () => {
      const perMessageDeflate = new PerMessageDeflate();
      const extensions = extension.parse(
        'permessage-deflate; client_no_context_takeover=10'
      );

      assert.throws(
        () => perMessageDeflate.accept(extensions['permessage-deflate']),
        /^TypeError: Invalid value for parameter "client_no_context_takeover": 10$/
      );
    });

    it('throws an error if server_no_context_takeover has a value', () => {
      const perMessageDeflate = new PerMessageDeflate();
      const extensions = extension.parse(
        'permessage-deflate; server_no_context_takeover=10'
      );

      assert.throws(
        () => perMessageDeflate.accept(extensions['permessage-deflate']),
        /^TypeError: Invalid value for parameter "server_no_context_takeover": 10$/
      );
    });

    it('throws an error if server_max_window_bits has an invalid value', () => {
      const perMessageDeflate = new PerMessageDeflate();

      let extensions = extension.parse(
        'permessage-deflate; server_max_window_bits=7'
      );
      assert.throws(
        () => perMessageDeflate.accept(extensions['permessage-deflate']),
        /^TypeError: Invalid value for parameter "server_max_window_bits": 7$/
      );

      extensions = extension.parse(
        'permessage-deflate; server_max_window_bits'
      );
      assert.throws(
        () => perMessageDeflate.accept(extensions['permessage-deflate']),
        /^TypeError: Invalid value for parameter "server_max_window_bits": true$/
      );
    });

    describe('As server', () => {
      it('accepts an offer with no parameters', () => {
        const perMessageDeflate = new PerMessageDeflate({}, true);

        assert.deepStrictEqual(perMessageDeflate.accept([{}]), {});
      });

      it('accepts an offer with parameters', () => {
        const perMessageDeflate = new PerMessageDeflate({}, true);
        const extensions = extension.parse(
          'permessage-deflate; server_no_context_takeover; ' +
            'client_no_context_takeover; server_max_window_bits=10; ' +
            'client_max_window_bits=11'
        );

        assert.deepStrictEqual(
          perMessageDeflate.accept(extensions['permessage-deflate']),
          {
            server_no_context_takeover: true,
            client_no_context_takeover: true,
            server_max_window_bits: 10,
            client_max_window_bits: 11,
            __proto__: null
          }
        );
      });

      it('prefers the configuration options', () => {
        const perMessageDeflate = new PerMessageDeflate(
          {
            serverNoContextTakeover: true,
            clientNoContextTakeover: true,
            serverMaxWindowBits: 12,
            clientMaxWindowBits: 11
          },
          true
        );
        const extensions = extension.parse(
          'permessage-deflate; server_max_window_bits=14; client_max_window_bits=13'
        );

        assert.deepStrictEqual(
          perMessageDeflate.accept(extensions['permessage-deflate']),
          {
            server_no_context_takeover: true,
            client_no_context_takeover: true,
            server_max_window_bits: 12,
            client_max_window_bits: 11,
            __proto__: null
          }
        );
      });

      it('accepts the first supported offer', () => {
        const perMessageDeflate = new PerMessageDeflate(
          { serverMaxWindowBits: 11 },
          true
        );
        const extensions = extension.parse(
          'permessage-deflate; server_max_window_bits=10, permessage-deflate'
        );

        assert.deepStrictEqual(
          perMessageDeflate.accept(extensions['permessage-deflate']),
          {
            server_max_window_bits: 11,
            __proto__: null
          }
        );
      });

      it('throws an error if server_no_context_takeover is unsupported', () => {
        const perMessageDeflate = new PerMessageDeflate(
          { serverNoContextTakeover: false },
          true
        );
        const extensions = extension.parse(
          'permessage-deflate; server_no_context_takeover'
        );

        assert.throws(
          () => perMessageDeflate.accept(extensions['permessage-deflate']),
          /^Error: None of the extension offers can be accepted$/
        );
      });

      it('throws an error if server_max_window_bits is unsupported', () => {
        const perMessageDeflate = new PerMessageDeflate(
          { serverMaxWindowBits: false },
          true
        );
        const extensions = extension.parse(
          'permessage-deflate; server_max_window_bits=10'
        );

        assert.throws(
          () => perMessageDeflate.accept(extensions['permessage-deflate']),
          /^Error: None of the extension offers can be accepted$/
        );
      });

      it('throws an error if server_max_window_bits is less than configuration', () => {
        const perMessageDeflate = new PerMessageDeflate(
          { serverMaxWindowBits: 11 },
          true
        );
        const extensions = extension.parse(
          'permessage-deflate; server_max_window_bits=10'
        );

        assert.throws(
          () => perMessageDeflate.accept(extensions['permessage-deflate']),
          /^Error: None of the extension offers can be accepted$/
        );
      });

      it('throws an error if client_max_window_bits is unsupported on client', () => {
        const perMessageDeflate = new PerMessageDeflate(
          { clientMaxWindowBits: 10 },
          true
        );
        const extensions = extension.parse('permessage-deflate');

        assert.throws(
          () => perMessageDeflate.accept(extensions['permessage-deflate']),
          /^Error: None of the extension offers can be accepted$/
        );
      });

      it('throws an error if client_max_window_bits has an invalid value', () => {
        const perMessageDeflate = new PerMessageDeflate({}, true);

        const extensions = extension.parse(
          'permessage-deflate; client_max_window_bits=16'
        );
        assert.throws(
          () => perMessageDeflate.accept(extensions['permessage-deflate']),
          /^TypeError: Invalid value for parameter "client_max_window_bits": 16$/
        );
      });
    });

    describe('As client', () => {
      it('accepts a response with no parameters', () => {
        const perMessageDeflate = new PerMessageDeflate({});

        assert.deepStrictEqual(perMessageDeflate.accept([{}]), {});
      });

      it('accepts a response with parameters', () => {
        const perMessageDeflate = new PerMessageDeflate({});
        const extensions = extension.parse(
          'permessage-deflate; server_no_context_takeover; ' +
            'client_no_context_takeover; server_max_window_bits=10; ' +
            'client_max_window_bits=11'
        );

        assert.deepStrictEqual(
          perMessageDeflate.accept(extensions['permessage-deflate']),
          {
            server_no_context_takeover: true,
            client_no_context_takeover: true,
            server_max_window_bits: 10,
            client_max_window_bits: 11,
            __proto__: null
          }
        );
      });

      it('throws an error if client_no_context_takeover is unsupported', () => {
        const perMessageDeflate = new PerMessageDeflate({
          clientNoContextTakeover: false
        });
        const extensions = extension.parse(
          'permessage-deflate; client_no_context_takeover'
        );

        assert.throws(
          () => perMessageDeflate.accept(extensions['permessage-deflate']),
          /^Error: Unexpected parameter "client_no_context_takeover"$/
        );
      });

      it('throws an error if client_max_window_bits is unsupported', () => {
        const perMessageDeflate = new PerMessageDeflate({
          clientMaxWindowBits: false
        });
        const extensions = extension.parse(
          'permessage-deflate; client_max_window_bits=10'
        );

        assert.throws(
          () => perMessageDeflate.accept(extensions['permessage-deflate']),
          /^Error: Unexpected or invalid parameter "client_max_window_bits"$/
        );
      });

      it('throws an error if client_max_window_bits is greater than configuration', () => {
        const perMessageDeflate = new PerMessageDeflate({
          clientMaxWindowBits: 10
        });
        const extensions = extension.parse(
          'permessage-deflate; client_max_window_bits=11'
        );

        assert.throws(
          () => perMessageDeflate.accept(extensions['permessage-deflate']),
          /^Error: Unexpected or invalid parameter "client_max_window_bits"$/
        );
      });

      it('throws an error if client_max_window_bits has an invalid value', () => {
        const perMessageDeflate = new PerMessageDeflate();

        let extensions = extension.parse(
          'permessage-deflate; client_max_window_bits=16'
        );
        assert.throws(
          () => perMessageDeflate.accept(extensions['permessage-deflate']),
          /^TypeError: Invalid value for parameter "client_max_window_bits": 16$/
        );

        extensions = extension.parse(
          'permessage-deflate; client_max_window_bits'
        );
        assert.throws(
          () => perMessageDeflate.accept(extensions['permessage-deflate']),
          /^TypeError: Invalid value for parameter "client_max_window_bits": true$/
        );
      });

      it('uses the config value if client_max_window_bits is not specified', () => {
        const perMessageDeflate = new PerMessageDeflate({
          clientMaxWindowBits: 10
        });

        assert.deepStrictEqual(perMessageDeflate.accept([{}]), {
          client_max_window_bits: 10
        });
      });
    });
  });

  describe('#compress and #decompress', () => {
    it('works with unfragmented messages', (done) => {
      const perMessageDeflate = new PerMessageDeflate();
      const buf = Buffer.from([1, 2, 3]);

      perMessageDeflate.accept([{}]);
      perMessageDeflate.compress(buf, true, (err, data) => {
        if (err) return done(err);

        perMessageDeflate.decompress(data, true, (err, data) => {
          if (err) return done(err);

          assert.ok(data.equals(buf));
          done();
        });
      });
    });

    it('works with fragmented messages', (done) => {
      const perMessageDeflate = new PerMessageDeflate();
      const buf = Buffer.from([1, 2, 3, 4]);

      perMessageDeflate.accept([{}]);

      perMessageDeflate.compress(buf.slice(0, 2), false, (err, compressed1) => {
        if (err) return done(err);

        perMessageDeflate.compress(buf.slice(2), true, (err, compressed2) => {
          if (err) return done(err);

          perMessageDeflate.decompress(compressed1, false, (err, data1) => {
            if (err) return done(err);

            perMessageDeflate.decompress(compressed2, true, (err, data2) => {
              if (err) return done(err);

              assert.ok(Buffer.concat([data1, data2]).equals(buf));
              done();
            });
          });
        });
      });
    });

    it('works with the negotiated parameters', (done) => {
      const perMessageDeflate = new PerMessageDeflate({
        memLevel: 5,
        level: 9
      });
      const extensions = extension.parse(
        'permessage-deflate; server_no_context_takeover; ' +
          'client_no_context_takeover; server_max_window_bits=10; ' +
          'client_max_window_bits=11'
      );
      const buf = Buffer.from("Some compressible data, it's compressible.");

      perMessageDeflate.accept(extensions['permessage-deflate']);

      perMessageDeflate.compress(buf, true, (err, data) => {
        if (err) return done(err);

        perMessageDeflate.decompress(data, true, (err, data) => {
          if (err) return done(err);

          assert.ok(data.equals(buf));
          done();
        });
      });
    });

    it('honors the `level` option', (done) => {
      const lev0 = new PerMessageDeflate({
        zlibDeflateOptions: { level: 0 }
      });
      const lev9 = new PerMessageDeflate({
        zlibDeflateOptions: { level: 9 }
      });
      const extensionStr =
        'permessage-deflate; server_no_context_takeover; ' +
        'client_no_context_takeover; server_max_window_bits=10; ' +
        'client_max_window_bits=11';
      const buf = Buffer.from("Some compressible data, it's compressible.");

      lev0.accept(extension.parse(extensionStr)['permessage-deflate']);
      lev9.accept(extension.parse(extensionStr)['permessage-deflate']);

      lev0.compress(buf, true, (err, compressed1) => {
        if (err) return done(err);

        lev0.decompress(compressed1, true, (err, decompressed1) => {
          if (err) return done(err);

          lev9.compress(buf, true, (err, compressed2) => {
            if (err) return done(err);

            lev9.decompress(compressed2, true, (err, decompressed2) => {
              if (err) return done(err);

              // Level 0 compression actually adds a few bytes due to headers.
              assert.ok(compressed1.length > buf.length);
              // Level 9 should not, of course.
              assert.ok(compressed2.length < buf.length);
              // Ensure they both decompress back properly.
              assert.ok(decompressed1.equals(buf));
              assert.ok(decompressed2.equals(buf));
              done();
            });
          });
        });
      });
    });

    it('honors the `zlib{Deflate,Inflate}Options` option', (done) => {
      const lev0 = new PerMessageDeflate({
        zlibDeflateOptions: {
          level: 0,
          chunkSize: 256
        },
        zlibInflateOptions: {
          chunkSize: 2048
        }
      });
      const lev9 = new PerMessageDeflate({
        zlibDeflateOptions: {
          level: 9,
          chunkSize: 128
        },
        zlibInflateOptions: {
          chunkSize: 1024
        }
      });

      // Note no context takeover so we can get a hold of the raw streams after
      // we do the dance.
      const extensionStr =
        'permessage-deflate; server_max_window_bits=10; ' +
        'client_max_window_bits=11';
      const buf = Buffer.from("Some compressible data, it's compressible.");

      lev0.accept(extension.parse(extensionStr)['permessage-deflate']);
      lev9.accept(extension.parse(extensionStr)['permessage-deflate']);

      lev0.compress(buf, true, (err, compressed1) => {
        if (err) return done(err);

        lev0.decompress(compressed1, true, (err, decompressed1) => {
          if (err) return done(err);

          lev9.compress(buf, true, (err, compressed2) => {
            if (err) return done(err);

            lev9.decompress(compressed2, true, (err, decompressed2) => {
              if (err) return done(err);
              // Level 0 compression actually adds a few bytes due to headers.
              assert.ok(compressed1.length > buf.length);
              // Level 9 should not, of course.
              assert.ok(compressed2.length < buf.length);
              // Ensure they both decompress back properly.
              assert.ok(decompressed1.equals(buf));
              assert.ok(decompressed2.equals(buf));

              // Assert options were set.
              assert.ok(lev0._deflate._level === 0);
              assert.ok(lev9._deflate._level === 9);
              assert.ok(lev0._deflate._chunkSize === 256);
              assert.ok(lev9._deflate._chunkSize === 128);
              assert.ok(lev0._inflate._chunkSize === 2048);
              assert.ok(lev9._inflate._chunkSize === 1024);
              done();
            });
          });
        });
      });
    });

    it("doesn't use contex takeover if not allowed", (done) => {
      const perMessageDeflate = new PerMessageDeflate({}, true);
      const extensions = extension.parse(
        'permessage-deflate;server_no_context_takeover'
      );
      const buf = Buffer.from('foofoo');

      perMessageDeflate.accept(extensions['permessage-deflate']);

      perMessageDeflate.compress(buf, true, (err, compressed1) => {
        if (err) return done(err);

        perMessageDeflate.decompress(compressed1, true, (err, data) => {
          if (err) return done(err);

          assert.ok(data.equals(buf));
          perMessageDeflate.compress(data, true, (err, compressed2) => {
            if (err) return done(err);

            assert.strictEqual(compressed2.length, compressed1.length);
            perMessageDeflate.decompress(compressed2, true, (err, data) => {
              if (err) return done(err);

              assert.ok(data.equals(buf));
              done();
            });
          });
        });
      });
    });

    it('uses contex takeover if allowed', (done) => {
      const perMessageDeflate = new PerMessageDeflate({}, true);
      const extensions = extension.parse('permessage-deflate');
      const buf = Buffer.from('foofoo');

      perMessageDeflate.accept(extensions['permessage-deflate']);

      perMessageDeflate.compress(buf, true, (err, compressed1) => {
        if (err) return done(err);

        perMessageDeflate.decompress(compressed1, true, (err, data) => {
          if (err) return done(err);

          assert.ok(data.equals(buf));
          perMessageDeflate.compress(data, true, (err, compressed2) => {
            if (err) return done(err);

            assert.ok(compressed2.length < compressed1.length);
            perMessageDeflate.decompress(compressed2, true, (err, data) => {
              if (err) return done(err);

              assert.ok(data.equals(buf));
              done();
            });
          });
        });
      });
    });

    it('calls the callback when an error occurs (inflate)', (done) => {
      const perMessageDeflate = new PerMessageDeflate();
      const data = Buffer.from('something invalid');

      perMessageDeflate.accept([{}]);
      perMessageDeflate.decompress(data, true, (err) => {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.code, 'Z_DATA_ERROR');
        assert.strictEqual(err.errno, -3);
        done();
      });
    });

    it('calls the callback when `maxPayload` is exceeded (1/2)', (done) => {
      const perMessageDeflate = new PerMessageDeflate({}, false, 25);
      const buf = Buffer.alloc(50, 'A');

      perMessageDeflate.accept([{}]);
      perMessageDeflate.compress(buf, true, (err, data) => {
        if (err) return done(err);

        perMessageDeflate.decompress(data, true, (err) => {
          assert.ok(err instanceof RangeError);
          assert.strictEqual(err.message, 'Max payload size exceeded');
          done();
        });
      });
    });

    it('calls the callback when `maxPayload` is exceeded (2/2)', (done) => {
      // A copy of the previous test but with a larger input. See
      // https://github.com/websockets/ws/pull/2285.
      const perMessageDeflate = new PerMessageDeflate({}, false, 25);
      const buf = Buffer.alloc(1024 * 1024, 'A');

      perMessageDeflate.accept([{}]);
      perMessageDeflate.compress(buf, true, (err, data) => {
        if (err) return done(err);

        perMessageDeflate.decompress(data, true, (err) => {
          assert.ok(err instanceof RangeError);
          assert.strictEqual(err.message, 'Max payload size exceeded');
          done();
        });
      });
    });

    it('calls the callback if the deflate stream is closed prematurely', (done) => {
      const perMessageDeflate = new PerMessageDeflate();
      const buf = Buffer.from('A'.repeat(50));

      perMessageDeflate.accept([{}]);
      perMessageDeflate.compress(buf, true, (err) => {
        assert.ok(err instanceof Error);
        assert.strictEqual(
          err.message,
          'The deflate stream was closed while data was being processed'
        );
        done();
      });

      process.nextTick(() => perMessageDeflate.cleanup());
    });

    it('recreates the inflate stream if it ends', (done) => {
      const perMessageDeflate = new PerMessageDeflate();
      const extensions = extension.parse(
        'permessage-deflate; client_no_context_takeover; ' +
          'server_no_context_takeover'
      );
      const buf = Buffer.from('33343236313533b7000000', 'hex');
      const expected = Buffer.from('12345678');

      perMessageDeflate.accept(extensions['permessage-deflate']);

      perMessageDeflate.decompress(buf, true, (err, data) => {
        assert.ok(data.equals(expected));

        perMessageDeflate.decompress(buf, true, (err, data) => {
          assert.ok(data.equals(expected));
          done();
        });
      });
    });
  });
});

```

---

### receiver.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/1457b75dc8-ws/test/receiver.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

const assert = require('assert');
const crypto = require('crypto');
const EventEmitter = require('events');

const PerMessageDeflate = require('../lib/permessage-deflate');
const Receiver = require('../lib/receiver');
const Sender = require('../lib/sender');
const { EMPTY_BUFFER, hasBlob, kStatusCode } = require('../lib/constants');

describe('Receiver', () => {
  it('parses an unmasked text message', (done) => {
    const receiver = new Receiver();

    receiver.on('message', (data, isBinary) => {
      assert.deepStrictEqual(data, Buffer.from('Hello'));
      assert.ok(!isBinary);
      done();
    });

    receiver.write(Buffer.from('810548656c6c6f', 'hex'));
  });

  it('parses a close message', (done) => {
    const receiver = new Receiver();

    receiver.on('conclude', (code, data) => {
      assert.strictEqual(code, 1005);
      assert.strictEqual(data, EMPTY_BUFFER);
      done();
    });

    receiver.write(Buffer.from('8800', 'hex'));
  });

  it('parses a close message spanning multiple writes', (done) => {
    const receiver = new Receiver();

    receiver.on('conclude', (code, data) => {
      assert.strictEqual(code, 1000);
      assert.deepStrictEqual(data, Buffer.from('DONE'));
      done();
    });

    receiver.write(Buffer.from('8806', 'hex'));
    receiver.write(Buffer.from('03e8444F4E45', 'hex'));
  });

  it('parses a masked text message', (done) => {
    const receiver = new Receiver({ isServer: true });

    receiver.on('message', (data, isBinary) => {
      assert.deepStrictEqual(data, Buffer.from('5:::{"name":"echo"}'));
      assert.ok(!isBinary);
      done();
    });

    receiver.write(
      Buffer.from('81933483a86801b992524fa1c60959e68a5216e6cb005ba1d5', 'hex')
    );
  });

  it('parses a masked text message longer than 125 B', (done) => {
    const receiver = new Receiver({ isServer: true });
    const msg = Buffer.from('A'.repeat(200));

    const list = Sender.frame(msg, {
      fin: true,
      rsv1: false,
      opcode: 0x01,
      mask: true,
      readOnly: true
    });

    const frame = Buffer.concat(list);

    receiver.on('message', (data, isBinary) => {
      assert.deepStrictEqual(data, msg);
      assert.ok(!isBinary);
      done();
    });

    receiver.write(frame.slice(0, 2));
    setImmediate(() => receiver.write(frame.slice(2)));
  });

  it('parses a really long masked text message', (done) => {
    const receiver = new Receiver({ isServer: true });
    const msg = Buffer.from('A'.repeat(64 * 1024));

    const list = Sender.frame(msg, {
      fin: true,
      rsv1: false,
      opcode: 0x01,
      mask: true,
      readOnly: true
    });

    const frame = Buffer.concat(list);

    receiver.on('message', (data, isBinary) => {
      assert.deepStrictEqual(data, msg);
      assert.ok(!isBinary);
      done();
    });

    receiver.write(frame);
  });

  it('parses a 300 B fragmented masked text message', (done) => {
    const receiver = new Receiver({ isServer: true });
    const msg = Buffer.from('A'.repeat(300));

    const fragment1 = msg.slice(0, 150);
    const fragment2 = msg.slice(150);

    const options = { rsv1: false, mask: true, readOnly: true };

    const frame1 = Buffer.concat(
      Sender.frame(fragment1, {
        fin: false,
        opcode: 0x01,
        ...options
      })
    );
    const frame2 = Buffer.concat(
      Sender.frame(fragment2, {
        fin: true,
        opcode: 0x00,
        ...options
      })
    );

    receiver.on('message', (data, isBinary) => {
      assert.deepStrictEqual(data, msg);
      assert.ok(!isBinary);
      done();
    });

    receiver.write(frame1);
    receiver.write(frame2);
  });

  it('parses a ping message', (done) => {
    const receiver = new Receiver({ isServer: true });
    const msg = Buffer.from('Hello');

    const list = Sender.frame(msg, {
      fin: true,
      rsv1: false,
      opcode: 0x09,
      mask: true,
      readOnly: true
    });

    const frame = Buffer.concat(list);

    receiver.on('ping', (data) => {
      assert.deepStrictEqual(data, msg);
      done();
    });

    receiver.write(frame);
  });

  it('parses a ping message with no data', (done) => {
    const receiver = new Receiver();

    receiver.on('ping', (data) => {
      assert.strictEqual(data, EMPTY_BUFFER);
      done();
    });

    receiver.write(Buffer.from('8900', 'hex'));
  });

  it('parses a 300 B fragmented masked text message with a ping in the middle (1/2)', (done) => {
    const receiver = new Receiver({ isServer: true });
    const msg = Buffer.from('A'.repeat(300));
    const pingMessage = Buffer.from('Hello');

    const fragment1 = msg.slice(0, 150);
    const fragment2 = msg.slice(150);

    const options = { rsv1: false, mask: true, readOnly: true };

    const frame1 = Buffer.concat(
      Sender.frame(fragment1, {
        fin: false,
        opcode: 0x01,
        ...options
      })
    );
    const frame2 = Buffer.concat(
      Sender.frame(pingMessage, {
        fin: true,
        opcode: 0x09,
        ...options
      })
    );
    const frame3 = Buffer.concat(
      Sender.frame(fragment2, {
        fin: true,
        opcode: 0x00,
        ...options
      })
    );

    let gotPing = false;

    receiver.on('message', (data, isBinary) => {
      assert.deepStrictEqual(data, msg);
      assert.ok(!isBinary);
      assert.ok(gotPing);
      done();
    });
    receiver.on('ping', (data) => {
      gotPing = true;
      assert.ok(data.equals(pingMessage));
    });

    receiver.write(frame1);
    receiver.write(frame2);
    receiver.write(frame3);
  });

  it('parses a 300 B fragmented masked text message with a ping in the middle (2/2)', (done) => {
    const receiver = new Receiver({ isServer: true });
    const msg = Buffer.from('A'.repeat(300));
    const pingMessage = Buffer.from('Hello');

    const fragment1 = msg.slice(0, 150);
    const fragment2 = msg.slice(150);

    const options = { rsv1: false, mask: true, readOnly: false };

    const frame1 = Buffer.concat(
      Sender.frame(Buffer.from(fragment1), {
        fin: false,
        opcode: 0x01,
        ...options
      })
    );
    const frame2 = Buffer.concat(
      Sender.frame(Buffer.from(pingMessage), {
        fin: true,
        opcode: 0x09,
        ...options
      })
    );
    const frame3 = Buffer.concat(
      Sender.frame(Buffer.from(fragment2), {
        fin: true,
        opcode: 0x00,
        ...options
      })
    );

    let chunks = [];
    const splitBuffer = (buf) => {
      const i = Math.floor(buf.length / 2);
      return [buf.slice(0, i), buf.slice(i)];
    };

    chunks = chunks.concat(splitBuffer(frame1));
    chunks = chunks.concat(splitBuffer(frame2));
    chunks = chunks.concat(splitBuffer(frame3));

    let gotPing = false;

    receiver.on('message', (data, isBinary) => {
      assert.deepStrictEqual(data, msg);
      assert.ok(!isBinary);
      assert.ok(gotPing);
      done();
    });
    receiver.on('ping', (data) => {
      gotPing = true;
      assert.ok(data.equals(pingMessage));
    });

    for (let i = 0; i < chunks.length; ++i) {
      receiver.write(chunks[i]);
    }
  });

  it('parses a 100 B masked binary message', (done) => {
    const receiver = new Receiver({ isServer: true });
    const msg = crypto.randomBytes(100);

    const list = Sender.frame(msg, {
      fin: true,
      rsv1: false,
      opcode: 0x02,
      mask: true,
      readOnly: true
    });

    const frame = Buffer.concat(list);

    receiver.on('message', (data, isBinary) => {
      assert.deepStrictEqual(data, msg);
      assert.ok(isBinary);
      done();
    });

    receiver.write(frame);
  });

  it('parses a 256 B masked binary message', (done) => {
    const receiver = new Receiver({ isServer: true });
    const msg = crypto.randomBytes(256);

    const list = Sender.frame(msg, {
      fin: true,
      rsv1: false,
      opcode: 0x02,
      mask: true,
      readOnly: true
    });

    const frame = Buffer.concat(list);

    receiver.on('message', (data, isBinary) => {
      assert.deepStrictEqual(data, msg);
      assert.ok(isBinary);
      done();
    });

    receiver.write(frame);
  });

  it('parses a 200 KiB masked binary message', (done) => {
    const receiver = new Receiver({ isServer: true });
    const msg = crypto.randomBytes(200 * 1024);

    const list = Sender.frame(msg, {
      fin: true,
      rsv1: false,
      opcode: 0x02,
      mask: true,
      readOnly: true
    });

    const frame = Buffer.concat(list);

    receiver.on('message', (data, isBinary) => {
      assert.deepStrictEqual(data, msg);
      assert.ok(isBinary);
      done();
    });

    receiver.write(frame);
  });

  it('parses a 200 KiB unmasked binary message', (done) => {
    const receiver = new Receiver();
    const msg = crypto.randomBytes(200 * 1024);

    const list = Sender.frame(msg, {
      fin: true,
      rsv1: false,
      opcode: 0x02,
      mask: false,
      readOnly: true
    });

    const frame = Buffer.concat(list);

    receiver.on('message', (data, isBinary) => {
      assert.deepStrictEqual(data, msg);
      assert.ok(isBinary);
      done();
    });

    receiver.write(frame);
  });

  it('parses a compressed message', (done) => {
    const perMessageDeflate = new PerMessageDeflate();
    perMessageDeflate.accept([{}]);

    const receiver = new Receiver({
      extensions: {
        'permessage-deflate': perMessageDeflate
      }
    });
    const buf = Buffer.from('Hello');

    receiver.on('message', (data, isBinary) => {
      assert.deepStrictEqual(data, buf);
      assert.ok(!isBinary);
      done();
    });

    perMessageDeflate.compress(buf, true, (err, data) => {
      if (err) return done(err);

      receiver.write(Buffer.from([0xc1, data.length]));
      receiver.write(data);
    });
  });

  it('parses a compressed and fragmented message', (done) => {
    const perMessageDeflate = new PerMessageDeflate();
    perMessageDeflate.accept([{}]);

    const receiver = new Receiver({
      extensions: {
        'permessage-deflate': perMessageDeflate
      }
    });
    const buf1 = Buffer.from('foo');
    const buf2 = Buffer.from('bar');

    receiver.on('message', (data, isBinary) => {
      assert.deepStrictEqual(data, Buffer.concat([buf1, buf2]));
      assert.ok(!isBinary);
      done();
    });

    perMessageDeflate.compress(buf1, false, (err, fragment1) => {
      if (err) return done(err);

      receiver.write(Buffer.from([0x41, fragment1.length]));
      receiver.write(fragment1);

      perMessageDeflate.compress(buf2, true, (err, fragment2) => {
        if (err) return done(err);

        receiver.write(Buffer.from([0x80, fragment2.length]));
        receiver.write(fragment2);
      });
    });
  });

  it('parses a buffer with thousands of frames', (done) => {
    const buf = Buffer.allocUnsafe(40000);

    for (let i = 0; i < buf.length; i += 2) {
      buf[i] = 0x81;
      buf[i + 1] = 0x00;
    }

    const receiver = new Receiver();
    let counter = 0;

    receiver.on('message', (data, isBinary) => {
      assert.strictEqual(data, EMPTY_BUFFER);
      assert.ok(!isBinary);
      if (++counter === 20000) done();
    });

    receiver.write(buf);
  });

  it('resets `totalPayloadLength` only on final frame (unfragmented)', (done) => {
    const receiver = new Receiver({ maxPayload: 10 });

    receiver.on('message', (data, isBinary) => {
      assert.strictEqual(receiver._totalPayloadLength, 0);
      assert.deepStrictEqual(data, Buffer.from('Hello'));
      assert.ok(!isBinary);
      done();
    });

    assert.strictEqual(receiver._totalPayloadLength, 0);
    receiver.write(Buffer.from('810548656c6c6f', 'hex'));
  });

  it('resets `totalPayloadLength` only on final frame (fragmented)', (done) => {
    const receiver = new Receiver({ maxPayload: 10 });

    receiver.on('message', (data, isBinary) => {
      assert.strictEqual(receiver._totalPayloadLength, 0);
      assert.deepStrictEqual(data, Buffer.from('Hello'));
      assert.ok(!isBinary);
      done();
    });

    assert.strictEqual(receiver._totalPayloadLength, 0);
    receiver.write(Buffer.from('01024865', 'hex'));
    assert.strictEqual(receiver._totalPayloadLength, 2);
    receiver.write(Buffer.from('80036c6c6f', 'hex'));
  });

  it('resets `totalPayloadLength` only on final frame (fragmented + ping)', (done) => {
    const receiver = new Receiver({ maxPayload: 10 });
    let data;

    receiver.on('ping', (buf) => {
      assert.strictEqual(receiver._totalPayloadLength, 2);
      data = buf;
    });
    receiver.on('message', (buf, isBinary) => {
      assert.strictEqual(receiver._totalPayloadLength, 0);
      assert.deepStrictEqual(data, EMPTY_BUFFER);
      assert.deepStrictEqual(buf, Buffer.from('Hello'));
      assert.ok(isBinary);
      done();
    });

    assert.strictEqual(receiver._totalPayloadLength, 0);
    receiver.write(Buffer.from('02024865', 'hex'));
    receiver.write(Buffer.from('8900', 'hex'));
    receiver.write(Buffer.from('80036c6c6f', 'hex'));
  });

  it('ignores any data after a close frame', (done) => {
    const perMessageDeflate = new PerMessageDeflate();
    perMessageDeflate.accept([{}]);

    const receiver = new Receiver({
      extensions: {
        'permessage-deflate': perMessageDeflate
      }
    });
    const results = [];
    const push = results.push.bind(results);

    receiver.on('conclude', push).on('message', push);
    receiver.on('finish', () => {
      assert.deepStrictEqual(results, [
        EMPTY_BUFFER,
        false,
        1005,
        EMPTY_BUFFER
      ]);
      done();
    });

    receiver.write(Buffer.from([0xc1, 0x01, 0x00]));
    receiver.write(Buffer.from([0x88, 0x00]));
    receiver.write(Buffer.from([0x81, 0x00]));
  });

  it('emits an error if RSV1 is on and permessage-deflate is disabled', (done) => {
    const receiver = new Receiver();

    receiver.on('error', (err) => {
      assert.ok(err instanceof RangeError);
      assert.strictEqual(err.code, 'WS_ERR_UNEXPECTED_RSV_1');
      assert.strictEqual(
        err.message,
        'Invalid WebSocket frame: RSV1 must be clear'
      );
      assert.strictEqual(err[kStatusCode], 1002);
      done();
    });

    receiver.write(Buffer.from([0xc2, 0x80, 0x00, 0x00, 0x00, 0x00]));
  });

  it('emits an error if RSV1 is on and opcode is 0', (done) => {
    const perMessageDeflate = new PerMessageDeflate();
    perMessageDeflate.accept([{}]);

    const receiver = new Receiver({
      extensions: {
        'permessage-deflate': perMessageDeflate
      }
    });

    receiver.on('error', (err) => {
      assert.ok(err instanceof RangeError);
      assert.strictEqual(err.code, 'WS_ERR_UNEXPECTED_RSV_1');
      assert.strictEqual(
        err.message,
        'Invalid WebSocket frame: RSV1 must be clear'
      );
      assert.strictEqual(err[kStatusCode], 1002);
      done();
    });

    receiver.write(Buffer.from([0x40, 0x00]));
  });

  it('emits an error if RSV2 is on', (done) => {
    const receiver = new Receiver();

    receiver.on('error', (err) => {
      assert.ok(err instanceof RangeError);
      assert.strictEqual(err.code, 'WS_ERR_UNEXPECTED_RSV_2_3');
      assert.strictEqual(
        err.message,
        'Invalid WebSocket frame: RSV2 and RSV3 must be clear'
      );
      assert.strictEqual(err[kStatusCode], 1002);
      done();
    });

    receiver.write(Buffer.from([0xa2, 0x00]));
  });

  it('emits an error if RSV3 is on', (done) => {
    const receiver = new Receiver();

    receiver.on('error', (err) => {
      assert.ok(err instanceof RangeError);
      assert.strictEqual(err.code, 'WS_ERR_UNEXPECTED_RSV_2_3');
      assert.strictEqual(
        err.message,
        'Invalid WebSocket frame: RSV2 and RSV3 must be clear'
      );
      assert.strictEqual(err[kStatusCode], 1002);
      done();
    });

    receiver.write(Buffer.from([0x92, 0x00]));
  });

  it('emits an error if the first frame in a fragmented message has opcode 0', (done) => {
    const receiver = new Receiver();

    receiver.on('error', (err) => {
      assert.ok(err instanceof RangeError);
      assert.strictEqual(err.code, 'WS_ERR_INVALID_OPCODE');
      assert.strictEqual(
        err.message,
        'Invalid WebSocket frame: invalid opcode 0'
      );
      assert.strictEqual(err[kStatusCode], 1002);
      done();
    });

    receiver.write(Buffer.from([0x00, 0x00]));
  });

  it('emits an error if a frame has opcode 1 in the middle of a fragmented message', (done) => {
    const receiver = new Receiver();

    receiver.on('error', (err) => {
      assert.ok(err instanceof RangeError);
      assert.strictEqual(err.code, 'WS_ERR_INVALID_OPCODE');
      assert.strictEqual(
        err.message,
        'Invalid WebSocket frame: invalid opcode 1'
      );
      assert.strictEqual(err[kStatusCode], 1002);
      done();
    });

    receiver.write(Buffer.from([0x01, 0x00]));
    receiver.write(Buffer.from([0x01, 0x00]));
  });

  it('emits an error if a frame has opcode 2 in the middle of a fragmented message', (done) => {
    const receiver = new Receiver();

    receiver.on('error', (err) => {
      assert.ok(err instanceof RangeError);
      assert.strictEqual(err.code, 'WS_ERR_INVALID_OPCODE');
      assert.strictEqual(
        err.message,
        'Invalid WebSocket frame: invalid opcode 2'
      );
      assert.strictEqual(err[kStatusCode], 1002);
      done();
    });

    receiver.write(Buffer.from([0x01, 0x00]));
    receiver.write(Buffer.from([0x02, 0x00]));
  });

  it('emits an error if a control frame has the FIN bit off', (done) => {
    const receiver = new Receiver();

    receiver.on('error', (err) => {
      assert.ok(err instanceof RangeError);
      assert.strictEqual(err.code, 'WS_ERR_EXPECTED_FIN');
      assert.strictEqual(
        err.message,
        'Invalid WebSocket frame: FIN must be set'
      );
      assert.strictEqual(err[kStatusCode], 1002);
      done();
    });

    receiver.write(Buffer.from([0x09, 0x00]));
  });

  it('emits an error if a control frame has the RSV1 bit on', (done) => {
    const perMessageDeflate = new PerMessageDeflate();
    perMessageDeflate.accept([{}]);

    const receiver = new Receiver({
      extensions: {
        'permessage-deflate': perMessageDeflate
      }
    });

    receiver.on('error', (err) => {
      assert.ok(err instanceof RangeError);
      assert.strictEqual(err.code, 'WS_ERR_UNEXPECTED_RSV_1');
      assert.strictEqual(
        err.message,
        'Invalid WebSocket frame: RSV1 must be clear'
      );
      assert.strictEqual(err[kStatusCode], 1002);
      done();
    });

    receiver.write(Buffer.from([0xc9, 0x00]));
  });

  it('emits an error if a control frame has the FIN bit off', (done) => {
    const receiver = new Receiver();

    receiver.on('error', (err) => {
      assert.ok(err instanceof RangeError);
      assert.strictEqual(err.code, 'WS_ERR_EXPECTED_FIN');
      assert.strictEqual(
        err.message,
        'Invalid WebSocket frame: FIN must be set'
      );
      assert.strictEqual(err[kStatusCode], 1002);
      done();
    });

    receiver.write(Buffer.from([0x09, 0x00]));
  });

  it('emits an error if a frame has the MASK bit off (server mode)', (done) => {
    const receiver = new Receiver({ isServer: true });

    receiver.on('error', (err) => {
      assert.ok(err instanceof RangeError);
      assert.strictEqual(err.code, 'WS_ERR_EXPECTED_MASK');
      assert.strictEqual(
        err.message,
        'Invalid WebSocket frame: MASK must be set'
      );
      assert.strictEqual(err[kStatusCode], 1002);
      done();
    });

    receiver.write(Buffer.from([0x81, 0x02, 0x68, 0x69]));
  });

  it('emits an error if a frame has the MASK bit on (client mode)', (done) => {
    const receiver = new Receiver();

    receiver.on('error', (err) => {
      assert.ok(err instanceof RangeError);
      assert.strictEqual(err.code, 'WS_ERR_UNEXPECTED_MASK');
      assert.strictEqual(
        err.message,
        'Invalid WebSocket frame: MASK must be clear'
      );
      assert.strictEqual(err[kStatusCode], 1002);
      done();
    });

    receiver.write(
      Buffer.from([0x81, 0x82, 0x56, 0x3a, 0xac, 0x80, 0x3e, 0x53])
    );
  });

  it('emits an error if a control frame has a payload bigger than 125 B', (done) => {
    const receiver = new Receiver();

    receiver.on('error', (err) => {
      assert.ok(err instanceof RangeError);
      assert.strictEqual(err.code, 'WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH');
      assert.strictEqual(
        err.message,
        'Invalid WebSocket frame: invalid payload length 126'
      );
      assert.strictEqual(err[kStatusCode], 1002);
      done();
    });

    receiver.write(Buffer.from([0x89, 0x7e]));
  });

  it('emits an error if a data frame has a payload bigger than 2^53 - 1 B', (done) => {
    const receiver = new Receiver();

    receiver.on('error', (err) => {
      assert.ok(err instanceof RangeError);
      assert.strictEqual(err.code, 'WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH');
      assert.strictEqual(
        err.message,
        'Unsupported WebSocket frame: payload length > 2^53 - 1'
      );
      assert.strictEqual(err[kStatusCode], 1009);
      done();
    });

    receiver.write(Buffer.from([0x82, 0x7f]));
    setImmediate(() =>
      receiver.write(
        Buffer.from([0x00, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
      )
    );
  });

  it('emits an error if a text frame contains invalid UTF-8 data (1/2)', (done) => {
    const receiver = new Receiver();

    receiver.on('error', (err) => {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.code, 'WS_ERR_INVALID_UTF8');
      assert.strictEqual(
        err.message,
        'Invalid WebSocket frame: invalid UTF-8 sequence'
      );
      assert.strictEqual(err[kStatusCode], 1007);
      done();
    });

    receiver.write(Buffer.from([0x81, 0x04, 0xce, 0xba, 0xe1, 0xbd]));
  });

  it('emits an error if a text frame contains invalid UTF-8 data (2/2)', (done) => {
    const perMessageDeflate = new PerMessageDeflate();
    perMessageDeflate.accept([{}]);

    const receiver = new Receiver({
      extensions: {
        'permessage-deflate': perMessageDeflate
      }
    });
    const buf = Buffer.from([0xce, 0xba, 0xe1, 0xbd]);

    receiver.on('error', (err) => {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.code, 'WS_ERR_INVALID_UTF8');
      assert.strictEqual(
        err.message,
        'Invalid WebSocket frame: invalid UTF-8 sequence'
      );
      assert.strictEqual(err[kStatusCode], 1007);
      done();
    });

    perMessageDeflate.compress(buf, true, (err, data) => {
      if (err) return done(err);

      receiver.write(Buffer.from([0xc1, data.length]));
      receiver.write(data);
    });
  });

  it('emits an error if a close frame has a payload of 1 B', (done) => {
    const receiver = new Receiver();

    receiver.on('error', (err) => {
      assert.ok(err instanceof RangeError);
      assert.strictEqual(err.code, 'WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH');
      assert.strictEqual(
        err.message,
        'Invalid WebSocket frame: invalid payload length 1'
      );
      assert.strictEqual(err[kStatusCode], 1002);
      done();
    });

    receiver.write(Buffer.from([0x88, 0x01]));
  });

  it('emits an error if a close frame contains an invalid close code', (done) => {
    const receiver = new Receiver();

    receiver.on('error', (err) => {
      assert.ok(err instanceof RangeError);
      assert.strictEqual(err.code, 'WS_ERR_INVALID_CLOSE_CODE');
      assert.strictEqual(
        err.message,
        'Invalid WebSocket frame: invalid status code 0'
      );
      assert.strictEqual(err[kStatusCode], 1002);
      done();
    });

    receiver.write(Buffer.from([0x88, 0x02, 0x00, 0x00]));
  });

  it('emits an error if a close frame contains invalid UTF-8 data', (done) => {
    const receiver = new Receiver();

    receiver.on('error', (err) => {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.code, 'WS_ERR_INVALID_UTF8');
      assert.strictEqual(
        err.message,
        'Invalid WebSocket frame: invalid UTF-8 sequence'
      );
      assert.strictEqual(err[kStatusCode], 1007);
      done();
    });

    receiver.write(
      Buffer.from([0x88, 0x06, 0x03, 0xef, 0xce, 0xba, 0xe1, 0xbd])
    );
  });

  it('emits an error if a frame payload length is bigger than `maxPayload`', (done) => {
    const receiver = new Receiver({ isServer: true, maxPayload: 20 * 1024 });
    const msg = crypto.randomBytes(200 * 1024);

    const list = Sender.frame(msg, {
      fin: true,
      rsv1: false,
      opcode: 0x02,
      mask: true,
      readOnly: true
    });

    const frame = Buffer.concat(list);

    receiver.on('error', (err) => {
      assert.ok(err instanceof RangeError);
      assert.strictEqual(err.code, 'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH');
      assert.strictEqual(err.message, 'Max payload size exceeded');
      assert.strictEqual(err[kStatusCode], 1009);
      done();
    });

    receiver.write(frame);
  });

  it('emits an error if the message length exceeds `maxPayload`', (done) => {
    const perMessageDeflate = new PerMessageDeflate({}, false, 25);
    perMessageDeflate.accept([{}]);

    const receiver = new Receiver({
      extensions: { 'permessage-deflate': perMessageDeflate },
      isServer: false,
      maxPayload: 25
    });
    const buf = Buffer.from('A'.repeat(50));

    receiver.on('error', (err) => {
      assert.ok(err instanceof RangeError);
      assert.strictEqual(err.code, 'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH');
      assert.strictEqual(err.message, 'Max payload size exceeded');
      assert.strictEqual(err[kStatusCode], 1009);
      done();
    });

    perMessageDeflate.compress(buf, true, (err, data) => {
      if (err) return done(err);

      receiver.write(Buffer.from([0xc1, data.length]));
      receiver.write(data);
    });
  });

  it('emits an error if the sum of fragment lengths exceeds `maxPayload`', (done) => {
    const perMessageDeflate = new PerMessageDeflate({}, false, 25);
    perMessageDeflate.accept([{}]);

    const receiver = new Receiver({
      extensions: { 'permessage-deflate': perMessageDeflate },
      isServer: false,
      maxPayload: 25
    });
    const buf = Buffer.from('A'.repeat(15));

    receiver.on('error', (err) => {
      assert.ok(err instanceof RangeError);
      assert.strictEqual(err.code, 'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH');
      assert.strictEqual(err.message, 'Max payload size exceeded');
      assert.strictEqual(err[kStatusCode], 1009);
      done();
    });

    perMessageDeflate.compress(buf, false, (err, fragment1) => {
      if (err) return done(err);

      receiver.write(Buffer.from([0x41, fragment1.length]));
      receiver.write(fragment1);

      perMessageDeflate.compress(buf, true, (err, fragment2) => {
        if (err) return done(err);

        receiver.write(Buffer.from([0x80, fragment2.length]));
        receiver.write(fragment2);
      });
    });
  });

  it("honors the 'nodebuffer' binary type", (done) => {
    const receiver = new Receiver();
    const frags = [
      crypto.randomBytes(7321),
      crypto.randomBytes(137),
      crypto.randomBytes(285787),
      crypto.randomBytes(3)
    ];

    receiver.on('message', (data, isBinary) => {
      assert.deepStrictEqual(data, Buffer.concat(frags));
      assert.ok(isBinary);
      done();
    });

    frags.forEach((frag, i) => {
      Sender.frame(frag, {
        fin: i === frags.length - 1,
        opcode: i === 0 ? 2 : 0,
        readOnly: true,
        mask: false,
        rsv1: false
      }).forEach((buf) => receiver.write(buf));
    });
  });

  it("honors the 'arraybuffer' binary type", (done) => {
    const receiver = new Receiver({ binaryType: 'arraybuffer' });
    const frags = [
      crypto.randomBytes(19221),
      crypto.randomBytes(954),
      crypto.randomBytes(623987)
    ];

    receiver.on('message', (data, isBinary) => {
      assert.ok(data instanceof ArrayBuffer);
      assert.deepStrictEqual(Buffer.from(data), Buffer.concat(frags));
      assert.ok(isBinary);
      done();
    });

    frags.forEach((frag, i) => {
      Sender.frame(frag, {
        fin: i === frags.length - 1,
        opcode: i === 0 ? 2 : 0,
        readOnly: true,
        mask: false,
        rsv1: false
      }).forEach((buf) => receiver.write(buf));
    });
  });

  it("honors the 'fragments' binary type", (done) => {
    const receiver = new Receiver({ binaryType: 'fragments' });
    const frags = [
      crypto.randomBytes(17),
      crypto.randomBytes(419872),
      crypto.randomBytes(83),
      crypto.randomBytes(9928),
      crypto.randomBytes(1)
    ];

    receiver.on('message', (data, isBinary) => {
      assert.deepStrictEqual(data, frags);
      assert.ok(isBinary);
      done();
    });

    frags.forEach((frag, i) => {
      Sender.frame(frag, {
        fin: i === frags.length - 1,
        opcode: i === 0 ? 2 : 0,
        readOnly: true,
        mask: false,
        rsv1: false
      }).forEach((buf) => receiver.write(buf));
    });
  });

  it("honors the 'blob' binary type", function (done) {
    if (!hasBlob) return this.skip();

    const receiver = new Receiver({ binaryType: 'blob' });
    const frags = [
      crypto.randomBytes(75688),
      crypto.randomBytes(2688),
      crypto.randomBytes(46753)
    ];

    receiver.on('message', (data, isBinary) => {
      assert.ok(data instanceof Blob);
      assert.ok(isBinary);

      data
        .arrayBuffer()
        .then((arrayBuffer) => {
          assert.deepStrictEqual(
            Buffer.from(arrayBuffer),
            Buffer.concat(frags)
          );

          done();
        })
        .catch(done);
    });

    frags.forEach((frag, i) => {
      Sender.frame(frag, {
        fin: i === frags.length - 1,
        opcode: i === 0 ? 2 : 0,
        readOnly: true,
        mask: false,
        rsv1: false
      }).forEach((buf) => receiver.write(buf));
    });
  });

  it('honors the `skipUTF8Validation` option (1/2)', (done) => {
    const receiver = new Receiver({ skipUTF8Validation: true });

    receiver.on('message', (data, isBinary) => {
      assert.deepStrictEqual(data, Buffer.from([0xf8]));
      assert.ok(!isBinary);
      done();
    });

    receiver.write(Buffer.from([0x81, 0x01, 0xf8]));
  });

  it('honors the `skipUTF8Validation` option (2/2)', (done) => {
    const receiver = new Receiver({ skipUTF8Validation: true });

    receiver.on('conclude', (code, data) => {
      assert.strictEqual(code, 1000);
      assert.deepStrictEqual(data, Buffer.from([0xf8]));
      done();
    });

    receiver.write(Buffer.from([0x88, 0x03, 0x03, 0xe8, 0xf8]));
  });

  it('honors the `allowSynchronousEvents` option', (done) => {
    const actual = [];
    const expected = [
      '1',
      '- 1',
      '-- 1',
      '2',
      '- 2',
      '-- 2',
      '3',
      '- 3',
      '-- 3',
      '4',
      '- 4',
      '-- 4'
    ];

    function listener(data) {
      const message = data.toString();
      actual.push(message);

      // `queueMicrotask()` is not available in Node.js < 11.
      Promise.resolve().then(() => {
        actual.push(`- ${message}`);

        Promise.resolve().then(() => {
          actual.push(`-- ${message}`);

          if (actual.length === 12) {
            assert.deepStrictEqual(actual, expected);
            done();
          }
        });
      });
    }

    const receiver = new Receiver({ allowSynchronousEvents: false });

    receiver.on('message', listener);
    receiver.on('ping', listener);
    receiver.on('pong', listener);

    receiver.write(Buffer.from('8101318901328a0133820134', 'hex'));
  });

  it('does not swallow errors thrown from event handlers', (done) => {
    const receiver = new Receiver();
    let count = 0;

    receiver.on('message', () => {
      if (++count === 2) {
        throw new Error('Oops');
      }
    });

    assert.strictEqual(
      process.listenerCount('uncaughtException'),
      EventEmitter.usingDomains ? 2 : 1
    );

    const listener = process.listeners('uncaughtException').pop();

    process.removeListener('uncaughtException', listener);
    process.once('uncaughtException', (err) => {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.message, 'Oops');

      process.on('uncaughtException', listener);
      done();
    });

    setImmediate(() => {
      receiver.write(Buffer.from('82008200', 'hex'));
    });
  });
});

```

---

### sender.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/1457b75dc8-ws/test/sender.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

const assert = require('assert');

const extension = require('../lib/extension');
const PerMessageDeflate = require('../lib/permessage-deflate');
const Sender = require('../lib/sender');
const { EMPTY_BUFFER, hasBlob } = require('../lib/constants');

class MockSocket {
  constructor({ write } = {}) {
    this.readable = true;
    this.writable = true;

    if (write) this.write = write;
  }

  cork() {}
  write() {}
  uncork() {}
}

describe('Sender', () => {
  describe('.frame', () => {
    it('does not mutate the input buffer if data is `readOnly`', () => {
      const buf = Buffer.from([1, 2, 3, 4, 5]);

      Sender.frame(buf, {
        readOnly: true,
        rsv1: false,
        mask: true,
        opcode: 2,
        fin: true
      });

      assert.ok(buf.equals(Buffer.from([1, 2, 3, 4, 5])));
    });

    it('honors the `rsv1` option', () => {
      const list = Sender.frame(EMPTY_BUFFER, {
        readOnly: false,
        mask: false,
        rsv1: true,
        opcode: 1,
        fin: true
      });

      assert.strictEqual(list[0][0] & 0x40, 0x40);
    });

    it('accepts a string as first argument', () => {
      const list = Sender.frame('€', {
        readOnly: false,
        rsv1: false,
        mask: false,
        opcode: 1,
        fin: true
      });

      assert.deepStrictEqual(list[0], Buffer.from('8103', 'hex'));
      assert.deepStrictEqual(list[1], Buffer.from('e282ac', 'hex'));
    });
  });

  describe('#send', () => {
    it('compresses data if compress option is enabled', (done) => {
      const chunks = [];
      const perMessageDeflate = new PerMessageDeflate();
      const mockSocket = new MockSocket({
        write: (chunk) => {
          chunks.push(chunk);
          if (chunks.length !== 6) return;

          assert.strictEqual(chunks[0].length, 2);
          assert.strictEqual(chunks[0][0] & 0x40, 0x40);

          assert.strictEqual(chunks[2].length, 2);
          assert.strictEqual(chunks[2][0] & 0x40, 0x40);

          assert.strictEqual(chunks[4].length, 2);
          assert.strictEqual(chunks[4][0] & 0x40, 0x40);
          done();
        }
      });
      const sender = new Sender(mockSocket, {
        'permessage-deflate': perMessageDeflate
      });

      perMessageDeflate.accept([{}]);

      const options = { compress: true, fin: true };
      const array = new Uint8Array([0x68, 0x69]);

      sender.send(array.buffer, options);
      sender.send(array, options);
      sender.send('hi', options);
    });

    describe('when context takeover is disabled', () => {
      it('honors the compression threshold', (done) => {
        const chunks = [];
        const perMessageDeflate = new PerMessageDeflate();
        const mockSocket = new MockSocket({
          write: (chunk) => {
            chunks.push(chunk);
            if (chunks.length !== 2) return;

            assert.strictEqual(chunks[0].length, 2);
            assert.notStrictEqual(chunk[0][0] & 0x40, 0x40);
            assert.strictEqual(chunks[1], 'hi');
            done();
          }
        });
        const sender = new Sender(mockSocket, {
          'permessage-deflate': perMessageDeflate
        });
        const extensions = extension.parse(
          'permessage-deflate; client_no_context_takeover'
        );

        perMessageDeflate.accept(extensions['permessage-deflate']);

        sender.send('hi', { compress: true, fin: true });
      });

      it('compresses all fragments of a fragmented message', (done) => {
        const chunks = [];
        const perMessageDeflate = new PerMessageDeflate({ threshold: 3 });
        const mockSocket = new MockSocket({
          write: (chunk) => {
            chunks.push(chunk);
            if (chunks.length !== 4) return;

            assert.strictEqual(chunks[0].length, 2);
            assert.strictEqual(chunks[0][0] & 0x40, 0x40);
            assert.strictEqual(chunks[1].length, 9);

            assert.strictEqual(chunks[2].length, 2);
            assert.strictEqual(chunks[2][0] & 0x40, 0x00);
            assert.strictEqual(chunks[3].length, 4);
            done();
          }
        });
        const sender = new Sender(mockSocket, {
          'permessage-deflate': perMessageDeflate
        });
        const extensions = extension.parse(
          'permessage-deflate; client_no_context_takeover'
        );

        perMessageDeflate.accept(extensions['permessage-deflate']);

        sender.send('123', { compress: true, fin: false });
        sender.send('12', { compress: true, fin: true });
      });

      it('does not compress any fragments of a fragmented message', (done) => {
        const chunks = [];
        const perMessageDeflate = new PerMessageDeflate({ threshold: 3 });
        const mockSocket = new MockSocket({
          write: (chunk) => {
            chunks.push(chunk);
            if (chunks.length !== 4) return;

            assert.strictEqual(chunks[0].length, 2);
            assert.strictEqual(chunks[0][0] & 0x40, 0x00);
            assert.strictEqual(chunks[1].length, 2);

            assert.strictEqual(chunks[2].length, 2);
            assert.strictEqual(chunks[2][0] & 0x40, 0x00);
            assert.strictEqual(chunks[3].length, 3);
            done();
          }
        });
        const sender = new Sender(mockSocket, {
          'permessage-deflate': perMessageDeflate
        });
        const extensions = extension.parse(
          'permessage-deflate; client_no_context_takeover'
        );

        perMessageDeflate.accept(extensions['permessage-deflate']);

        sender.send('12', { compress: true, fin: false });
        sender.send('123', { compress: true, fin: true });
      });

      it('compresses empty buffer as first fragment', (done) => {
        const chunks = [];
        const perMessageDeflate = new PerMessageDeflate({ threshold: 0 });
        const mockSocket = new MockSocket({
          write: (chunk) => {
            chunks.push(chunk);
            if (chunks.length !== 4) return;

            assert.strictEqual(chunks[0].length, 2);
            assert.strictEqual(chunks[0][0] & 0x40, 0x40);
            assert.strictEqual(chunks[1].length, 5);

            assert.strictEqual(chunks[2].length, 2);
            assert.strictEqual(chunks[2][0] & 0x40, 0x00);
            assert.strictEqual(chunks[3].length, 6);
            done();
          }
        });
        const sender = new Sender(mockSocket, {
          'permessage-deflate': perMessageDeflate
        });
        const extensions = extension.parse(
          'permessage-deflate; client_no_context_takeover'
        );

        perMessageDeflate.accept(extensions['permessage-deflate']);

        sender.send(Buffer.alloc(0), { compress: true, fin: false });
        sender.send('data', { compress: true, fin: true });
      });

      it('compresses empty buffer as last fragment', (done) => {
        const chunks = [];
        const perMessageDeflate = new PerMessageDeflate({ threshold: 0 });
        const mockSocket = new MockSocket({
          write: (chunk) => {
            chunks.push(chunk);
            if (chunks.length !== 4) return;

            assert.strictEqual(chunks[0].length, 2);
            assert.strictEqual(chunks[0][0] & 0x40, 0x40);
            assert.strictEqual(chunks[1].length, 10);

            assert.strictEqual(chunks[2].length, 2);
            assert.strictEqual(chunks[2][0] & 0x40, 0x00);
            assert.strictEqual(chunks[3].length, 1);
            done();
          }
        });
        const sender = new Sender(mockSocket, {
          'permessage-deflate': perMessageDeflate
        });
        const extensions = extension.parse(
          'permessage-deflate; client_no_context_takeover'
        );

        perMessageDeflate.accept(extensions['permessage-deflate']);

        sender.send('data', { compress: true, fin: false });
        sender.send(Buffer.alloc(0), { compress: true, fin: true });
      });
    });
  });

  describe('#ping', () => {
    it('can send a string as ping payload', (done) => {
      const perMessageDeflate = new PerMessageDeflate();
      let count = 0;
      const mockSocket = new MockSocket({
        write: (data) => {
          if (++count < 3) return;

          if (count === 3) {
            assert.deepStrictEqual(data, Buffer.from([0x89, 0x02]));
          } else {
            assert.strictEqual(data, 'hi');
            done();
          }
        }
      });
      const sender = new Sender(mockSocket, {
        'permessage-deflate': perMessageDeflate
      });

      perMessageDeflate.accept([{}]);

      sender.send('foo', { compress: true, fin: true });
      sender.ping('hi', false);
    });

    it('can send a `TypedArray` as ping payload', (done) => {
      let count = 0;
      const mockSocket = new MockSocket({
        write: (data) => {
          if (++count === 1) {
            assert.deepStrictEqual(data, Buffer.from([0x89, 0x02]));
          } else {
            assert.deepStrictEqual(data, Buffer.from([0x68, 0x69]));
            done();
          }
        }
      });

      const sender = new Sender(mockSocket);
      const array = new Uint8Array([0x68, 0x69]);

      sender.ping(array, false);
    });

    it('can send an `ArrayBuffer` as ping payload', (done) => {
      let count = 0;
      const mockSocket = new MockSocket({
        write: (data) => {
          if (++count === 1) {
            assert.deepStrictEqual(data, Buffer.from([0x89, 0x02]));
          } else {
            assert.deepStrictEqual(data, Buffer.from([0x68, 0x69]));
            done();
          }
        }
      });

      const sender = new Sender(mockSocket);
      const array = new Uint8Array([0x68, 0x69]);

      sender.ping(array.buffer, false);
    });

    it('can send a `Blob` as ping payload', function (done) {
      if (!hasBlob) return this.skip();

      let count = 0;
      const mockSocket = new MockSocket({
        write: (data) => {
          if (++count % 2) {
            assert.deepStrictEqual(data, Buffer.from([0x89, 0x02]));
          } else {
            assert.deepStrictEqual(data, Buffer.from([0x68, 0x69]));
            if (count === 4) done();
          }
        }
      });

      const sender = new Sender(mockSocket);
      const blob = new Blob(['hi']);

      sender.ping(blob, false);
      sender.ping(blob, false);
    });
  });

  describe('#pong', () => {
    it('can send a string as ping payload', (done) => {
      const perMessageDeflate = new PerMessageDeflate();
      let count = 0;
      const mockSocket = new MockSocket({
        write: (data) => {
          if (++count < 3) return;

          if (count === 3) {
            assert.deepStrictEqual(data, Buffer.from([0x8a, 0x02]));
          } else {
            assert.strictEqual(data, 'hi');
            done();
          }
        }
      });
      const sender = new Sender(mockSocket, {
        'permessage-deflate': perMessageDeflate
      });

      perMessageDeflate.accept([{}]);

      sender.send('foo', { compress: true, fin: true });
      sender.pong('hi', false);
    });

    it('can send a `TypedArray` as ping payload', (done) => {
      let count = 0;
      const mockSocket = new MockSocket({
        write: (data) => {
          if (++count === 1) {
            assert.deepStrictEqual(data, Buffer.from([0x8a, 0x02]));
          } else {
            assert.deepStrictEqual(data, Buffer.from([0x68, 0x69]));
            done();
          }
        }
      });

      const sender = new Sender(mockSocket);
      const array = new Uint8Array([0x68, 0x69]);

      sender.pong(array, false);
    });

    it('can send an `ArrayBuffer` as ping payload', (done) => {
      let count = 0;
      const mockSocket = new MockSocket({
        write: (data) => {
          if (++count === 1) {
            assert.deepStrictEqual(data, Buffer.from([0x8a, 0x02]));
          } else {
            assert.deepStrictEqual(data, Buffer.from([0x68, 0x69]));
            done();
          }
        }
      });

      const sender = new Sender(mockSocket);
      const array = new Uint8Array([0x68, 0x69]);

      sender.pong(array.buffer, false);
    });

    it('can send a `Blob` as ping payload', function (done) {
      if (!hasBlob) return this.skip();

      let count = 0;
      const mockSocket = new MockSocket({
        write: (data) => {
          if (++count % 2) {
            assert.deepStrictEqual(data, Buffer.from([0x8a, 0x02]));
          } else {
            assert.deepStrictEqual(data, Buffer.from([0x68, 0x69]));
            if (count === 4) done();
          }
        }
      });

      const sender = new Sender(mockSocket);
      const blob = new Blob(['hi']);

      sender.pong(blob, false);
      sender.pong(blob, false);
    });
  });

  describe('#close', () => {
    it('throws an error if the first argument is invalid', () => {
      const mockSocket = new MockSocket();
      const sender = new Sender(mockSocket);

      assert.throws(
        () => sender.close('error'),
        /^TypeError: First argument must be a valid error code number$/
      );

      assert.throws(
        () => sender.close(1004),
        /^TypeError: First argument must be a valid error code number$/
      );
    });

    it('throws an error if the message is greater than 123 bytes', () => {
      const mockSocket = new MockSocket();
      const sender = new Sender(mockSocket);

      assert.throws(
        () => sender.close(1000, 'a'.repeat(124)),
        /^RangeError: The message must not be greater than 123 bytes$/
      );
    });

    it('should consume all data before closing', (done) => {
      const perMessageDeflate = new PerMessageDeflate();

      let count = 0;
      const mockSocket = new MockSocket({
        write: (data, cb) => {
          count++;
          if (cb) cb();
        }
      });
      const sender = new Sender(mockSocket, {
        'permessage-deflate': perMessageDeflate
      });

      perMessageDeflate.accept([{}]);

      sender.send('foo', { compress: true, fin: true });
      sender.send('bar', { compress: true, fin: true });
      sender.send('baz', { compress: true, fin: true });

      sender.close(1000, undefined, false, () => {
        assert.strictEqual(count, 8);
        done();
      });
    });
  });
});

```

---

### subprotocol.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/1457b75dc8-ws/test/subprotocol.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

const assert = require('assert');

const { parse } = require('../lib/subprotocol');

describe('subprotocol', () => {
  describe('parse', () => {
    it('parses a single subprotocol', () => {
      assert.deepStrictEqual(parse('foo'), new Set(['foo']));
    });

    it('parses multiple subprotocols', () => {
      assert.deepStrictEqual(
        parse('foo,bar,baz'),
        new Set(['foo', 'bar', 'baz'])
      );
    });

    it('ignores the optional white spaces', () => {
      const header = 'foo , bar\t, \tbaz\t ,  qux\t\t,norf';

      assert.deepStrictEqual(
        parse(header),
        new Set(['foo', 'bar', 'baz', 'qux', 'norf'])
      );
    });

    it('throws an error if a subprotocol is empty', () => {
      [
        [',', 0],
        ['foo,,', 4],
        ['foo,  ,', 6]
      ].forEach((element) => {
        assert.throws(
          () => parse(element[0]),
          new RegExp(
            `^SyntaxError: Unexpected character at index ${element[1]}$`
          )
        );
      });
    });

    it('throws an error if a subprotocol is duplicated', () => {
      ['foo,foo,bar', 'foo,bar,foo'].forEach((header) => {
        assert.throws(
          () => parse(header),
          /^SyntaxError: The "foo" subprotocol is duplicated$/
        );
      });
    });

    it('throws an error if a white space is misplaced', () => {
      [
        ['f oo', 2],
        [' foo', 0]
      ].forEach((element) => {
        assert.throws(
          () => parse(element[0]),
          new RegExp(
            `^SyntaxError: Unexpected character at index ${element[1]}$`
          )
        );
      });
    });

    it('throws an error if a subprotocol contains invalid characters', () => {
      [
        ['f@o', 1],
        ['f\\oo', 1],
        ['foo,b@r', 5]
      ].forEach((element) => {
        assert.throws(
          () => parse(element[0]),
          new RegExp(
            `^SyntaxError: Unexpected character at index ${element[1]}$`
          )
        );
      });
    });

    it('throws an error if the header value ends prematurely', () => {
      ['foo ', 'foo, ', 'foo,bar ', 'foo,bar,'].forEach((header) => {
        assert.throws(
          () => parse(header),
          /^SyntaxError: Unexpected end of input$/
        );
      });
    });
  });
});

```

---

### validation.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/1457b75dc8-ws/test/validation.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

const assert = require('assert');

const { isValidUTF8 } = require('../lib/validation');

describe('extension', () => {
  describe('isValidUTF8', () => {
    it('returns false if it finds invalid bytes', () => {
      assert.strictEqual(isValidUTF8(Buffer.from([0xf8])), false);
    });

    it('returns false for overlong encodings', () => {
      assert.strictEqual(isValidUTF8(Buffer.from([0xc0, 0xa0])), false);
      assert.strictEqual(isValidUTF8(Buffer.from([0xe0, 0x80, 0xa0])), false);
      assert.strictEqual(
        isValidUTF8(Buffer.from([0xf0, 0x80, 0x80, 0xa0])),
        false
      );
    });

    it('returns false for code points in the range U+D800 - U+DFFF', () => {
      for (let i = 0xa0; i < 0xc0; i++) {
        for (let j = 0x80; j < 0xc0; j++) {
          assert.strictEqual(isValidUTF8(Buffer.from([0xed, i, j])), false);
        }
      }
    });

    it('returns false for code points greater than U+10FFFF', () => {
      assert.strictEqual(
        isValidUTF8(Buffer.from([0xf4, 0x90, 0x80, 0x80])),
        false
      );
      assert.strictEqual(
        isValidUTF8(Buffer.from([0xf5, 0x80, 0x80, 0x80])),
        false
      );
    });

    it('returns true for a well-formed UTF-8 byte sequence', () => {
      // prettier-ignore
      const buf = Buffer.from([
        0xe2, 0x82, 0xAC, // €
        0xf0, 0x90, 0x8c, 0x88, // 𐍈
        0x24 // $
      ]);

      assert.strictEqual(isValidUTF8(buf), true);
    });
  });
});

```

---

### websocket-server.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/1457b75dc8-ws/test/websocket-server.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^ws$" }] */

'use strict';

const assert = require('assert');
const crypto = require('crypto');
const https = require('https');
const http = require('http');
const path = require('path');
const net = require('net');
const fs = require('fs');
const os = require('os');

const makeDuplexPair = require('./duplex-pair');
const Sender = require('../lib/sender');
const WebSocket = require('..');
const { NOOP } = require('../lib/constants');

describe('WebSocketServer', () => {
  describe('#ctor', () => {
    it('throws an error if no option object is passed', () => {
      assert.throws(
        () => new WebSocket.Server(),
        new RegExp(
          '^TypeError: One and only one of the "port", "server", or ' +
            '"noServer" options must be specified$'
        )
      );
    });

    describe('options', () => {
      it('throws an error if required options are not specified', () => {
        assert.throws(
          () => new WebSocket.Server({}),
          new RegExp(
            '^TypeError: One and only one of the "port", "server", or ' +
              '"noServer" options must be specified$'
          )
        );
      });

      it('throws an error if mutually exclusive options are specified', () => {
        const server = http.createServer();
        const variants = [
          { port: 0, noServer: true, server },
          { port: 0, noServer: true },
          { port: 0, server },
          { noServer: true, server }
        ];

        for (const options of variants) {
          assert.throws(
            () => new WebSocket.Server(options),
            new RegExp(
              '^TypeError: One and only one of the "port", "server", or ' +
                '"noServer" options must be specified$'
            )
          );
        }
      });

      it('exposes options passed to constructor', (done) => {
        const wss = new WebSocket.Server({ port: 0 }, () => {
          assert.strictEqual(wss.options.port, 0);
          wss.close(done);
        });
      });

      it('accepts the `maxPayload` option', (done) => {
        const maxPayload = 20480;
        const wss = new WebSocket.Server(
          {
            perMessageDeflate: true,
            maxPayload,
            port: 0
          },
          () => {
            const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

            ws.on('open', ws.close);
          }
        );

        wss.on('connection', (ws) => {
          assert.strictEqual(ws._receiver._maxPayload, maxPayload);
          assert.strictEqual(
            ws._receiver._extensions['permessage-deflate']._maxPayload,
            maxPayload
          );
          wss.close(done);
        });
      });

      it('honors the `WebSocket` option', (done) => {
        class CustomWebSocket extends WebSocket.WebSocket {
          get foo() {
            return 'foo';
          }
        }

        const wss = new WebSocket.Server(
          {
            port: 0,
            WebSocket: CustomWebSocket
          },
          () => {
            const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

            ws.on('open', ws.close);
          }
        );

        wss.on('connection', (ws) => {
          assert.ok(ws instanceof CustomWebSocket);
          assert.strictEqual(ws.foo, 'foo');
          wss.close(done);
        });
      });

      it('honors the `autoPong` option', (done) => {
        const wss = new WebSocket.Server({ autoPong: false, port: 0 }, () => {
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

          ws.on('open', () => {
            ws.ping();
          });

          ws.on('pong', () => {
            done(new Error("Unexpected 'pong' event"));
          });
        });

        wss.on('connection', (ws) => {
          ws.on('ping', () => {
            ws.close();
          });

          ws.on('close', () => {
            wss.close(done);
          });
        });
      });

      it('honors the `closeTimeout` option', (done) => {
        const closeTimeout = 1000;
        const wss = new WebSocket.Server({ closeTimeout, port: 0 }, () => {
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
        });

        wss.on('connection', (ws) => {
          ws.on('close', () => {
            wss.close(done);
          });

          ws.close();
          assert.strictEqual(ws._closeTimer._idleTimeout, closeTimeout);
        });
      });
    });

    it('emits an error if http server bind fails', (done) => {
      const wss1 = new WebSocket.Server({ port: 0 }, () => {
        const wss2 = new WebSocket.Server({
          port: wss1.address().port
        });

        wss2.on('error', () => wss1.close(done));
      });
    });

    it('starts a server on a given port', (done) => {
      const port = 1337;
      const wss = new WebSocket.Server({ port }, () => {
        const ws = new WebSocket(`ws://localhost:${port}`);

        ws.on('open', ws.close);
      });

      wss.on('connection', () => wss.close(done));
    });

    it('binds the server on any IPv6 address when available', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        assert.strictEqual(wss._server.address().address, '::');
        wss.close(done);
      });
    });

    it('uses a precreated http server', (done) => {
      const server = http.createServer();

      server.listen(0, () => {
        const wss = new WebSocket.Server({ server });

        wss.on('connection', () => {
          server.close(done);
        });

        const ws = new WebSocket(`ws://localhost:${server.address().port}`);

        ws.on('open', ws.close);
      });
    });

    it('426s for non-Upgrade requests', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        http.get(`http://localhost:${wss.address().port}`, (res) => {
          let body = '';

          assert.strictEqual(res.statusCode, 426);
          res.on('data', (chunk) => {
            body += chunk;
          });
          res.on('end', () => {
            assert.strictEqual(body, http.STATUS_CODES[426]);
            wss.close(done);
          });
        });
      });
    });

    it('uses a precreated http server listening on IPC', (done) => {
      const randomString = crypto.randomBytes(4).toString('hex');
      const ipcPath =
        process.platform === 'win32'
          ? `\\\\.\\pipe\\ws-pipe-${randomString}`
          : path.join(os.tmpdir(), `ws-${randomString}.sock`);

      const server = http.createServer();

      server.listen(ipcPath, () => {
        const wss = new WebSocket.Server({ server });

        wss.on('connection', (ws, req) => {
          if (wss.clients.size === 1) {
            assert.strictEqual(req.url, '/foo?bar=bar');
          } else {
            assert.strictEqual(req.url, '/');

            for (const client of wss.clients) {
              client.close();
            }

            server.close(done);
          }
        });

        const ws = new WebSocket(`ws+unix:${ipcPath}:/foo?bar=bar`);
        ws.on('open', () => new WebSocket(`ws+unix:${ipcPath}`));
      });
    });
  });

  describe('#address', () => {
    it('returns the address of the server', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const addr = wss.address();

        assert.deepStrictEqual(addr, wss._server.address());
        wss.close(done);
      });
    });

    it('throws an error when operating in "noServer" mode', () => {
      const wss = new WebSocket.Server({ noServer: true });

      assert.throws(() => {
        wss.address();
      }, /^Error: The server is operating in "noServer" mode$/);
    });

    it('returns `null` if called after close', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        wss.close(() => {
          assert.strictEqual(wss.address(), null);
          done();
        });
      });
    });
  });

  describe('#close', () => {
    it('does not throw if called multiple times', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        wss.on('close', done);

        wss.close();
        wss.close();
        wss.close();
      });
    });

    it("doesn't close a precreated server", (done) => {
      const server = http.createServer();
      const realClose = server.close;

      server.close = () => {
        done(new Error('Must not close pre-created server'));
      };

      const wss = new WebSocket.Server({ server });

      wss.on('connection', () => {
        wss.close();
        server.close = realClose;
        server.close(done);
      });

      server.listen(0, () => {
        const ws = new WebSocket(`ws://localhost:${server.address().port}`);

        ws.on('open', ws.close);
      });
    });

    it('invokes the callback in noServer mode', (done) => {
      const wss = new WebSocket.Server({ noServer: true });

      wss.close(done);
    });

    it('cleans event handlers on precreated server', (done) => {
      const server = http.createServer();
      const listeningListenerCount = server.listenerCount('listening');
      const wss = new WebSocket.Server({ server });

      server.listen(0, () => {
        wss.close(() => {
          assert.strictEqual(
            server.listenerCount('listening'),
            listeningListenerCount
          );
          assert.strictEqual(server.listenerCount('upgrade'), 0);
          assert.strictEqual(server.listenerCount('error'), 0);

          server.close(done);
        });
      });
    });

    it("emits the 'close' event after the server closes", (done) => {
      let serverCloseEventEmitted = false;

      const wss = new WebSocket.Server({ port: 0 }, () => {
        net.createConnection({ port: wss.address().port });
      });

      wss._server.on('connection', (socket) => {
        wss.close();

        //
        // The server is closing. Ensure this does not emit a `'close'`
        // event before the server is actually closed.
        //
        wss.close();

        process.nextTick(() => {
          socket.end();
        });
      });

      wss._server.on('close', () => {
        serverCloseEventEmitted = true;
      });

      wss.on('close', () => {
        assert.ok(serverCloseEventEmitted);
        done();
      });
    });

    it("emits the 'close' event if client tracking is disabled", (done) => {
      const wss = new WebSocket.Server({
        noServer: true,
        clientTracking: false
      });

      wss.on('close', done);
      wss.close();
    });

    it('calls the callback if the server is already closed', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        wss.close(() => {
          assert.strictEqual(wss._state, 2);

          wss.close((err) => {
            assert.ok(err instanceof Error);
            assert.strictEqual(err.message, 'The server is not running');
            done();
          });
        });
      });
    });

    it("emits the 'close' event if the server is already closed", (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        wss.close(() => {
          assert.strictEqual(wss._state, 2);

          wss.on('close', done);
          wss.close();
        });
      });
    });
  });

  describe('#clients', () => {
    it('returns a list of connected clients', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        assert.strictEqual(wss.clients.size, 0);

        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', ws.close);
      });

      wss.on('connection', () => {
        assert.strictEqual(wss.clients.size, 1);
        wss.close(done);
      });
    });

    it('can be disabled', (done) => {
      const wss = new WebSocket.Server(
        { port: 0, clientTracking: false },
        () => {
          assert.strictEqual(wss.clients, undefined);
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

          ws.on('open', () => ws.close());
        }
      );

      wss.on('connection', (ws) => {
        assert.strictEqual(wss.clients, undefined);
        ws.on('close', () => wss.close(done));
      });
    });

    it('is updated when client terminates the connection', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => ws.terminate());
      });

      wss.on('connection', (ws) => {
        ws.on('close', () => {
          assert.strictEqual(wss.clients.size, 0);
          wss.close(done);
        });
      });
    });

    it('is updated when client closes the connection', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => ws.close());
      });

      wss.on('connection', (ws) => {
        ws.on('close', () => {
          assert.strictEqual(wss.clients.size, 0);
          wss.close(done);
        });
      });
    });
  });

  describe('#shouldHandle', () => {
    it('returns true when the path matches', () => {
      const wss = new WebSocket.Server({ noServer: true, path: '/foo' });

      assert.strictEqual(wss.shouldHandle({ url: '/foo' }), true);
      assert.strictEqual(wss.shouldHandle({ url: '/foo?bar=baz' }), true);
    });

    it("returns false when the path doesn't match", () => {
      const wss = new WebSocket.Server({ noServer: true, path: '/foo' });

      assert.strictEqual(wss.shouldHandle({ url: '/bar' }), false);
    });
  });

  describe('#handleUpgrade', () => {
    it('can be used for a pre-existing server', (done) => {
      const server = http.createServer();

      server.listen(0, () => {
        const wss = new WebSocket.Server({ noServer: true });

        server.on('upgrade', (req, socket, head) => {
          wss.handleUpgrade(req, socket, head, (ws) => {
            ws.send('hello');
            ws.close();
          });
        });

        const ws = new WebSocket(`ws://localhost:${server.address().port}`);

        ws.on('message', (message, isBinary) => {
          assert.deepStrictEqual(message, Buffer.from('hello'));
          assert.ok(!isBinary);
          server.close(done);
        });
      });
    });

    it("closes the connection when path doesn't match", (done) => {
      const wss = new WebSocket.Server({ port: 0, path: '/ws' }, () => {
        const req = http.get({
          port: wss.address().port,
          headers: {
            Connection: 'Upgrade',
            Upgrade: 'websocket',
            'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==',
            'Sec-WebSocket-Version': 13
          }
        });

        req.on('response', (res) => {
          assert.strictEqual(res.statusCode, 400);
          wss.close(done);
        });
      });
    });

    it('closes the connection when protocol version is Hixie-76', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const req = http.get({
          port: wss.address().port,
          headers: {
            Connection: 'Upgrade',
            Upgrade: 'WebSocket',
            'Sec-WebSocket-Key1': '4 @1  46546xW%0l 1 5',
            'Sec-WebSocket-Key2': '12998 5 Y3 1  .P00',
            'Sec-WebSocket-Protocol': 'sample'
          }
        });

        req.on('response', (res) => {
          assert.strictEqual(res.statusCode, 400);

          const chunks = [];

          res.on('data', (chunk) => {
            chunks.push(chunk);
          });

          res.on('end', () => {
            assert.strictEqual(
              Buffer.concat(chunks).toString(),
              'Missing or invalid Sec-WebSocket-Key header'
            );
            wss.close(done);
          });
        });
      });
    });

    it('completes a WebSocket upgrade over any duplex stream', (done) => {
      const server = http.createServer();

      server.listen(0, () => {
        const wss = new WebSocket.Server({ noServer: true });

        server.on('upgrade', (req, socket, head) => {
          //
          // Put a stream between the raw socket and our websocket processing.
          //
          const { clientSide, serverSide } = makeDuplexPair();

          socket.pipe(clientSide);
          clientSide.pipe(socket);

          //
          // Pass the other side of the stream as the socket to upgrade.
          //
          wss.handleUpgrade(req, serverSide, head, (ws) => {
            ws.send('hello');
            ws.close();
          });
        });

        const ws = new WebSocket(`ws://localhost:${server.address().port}`);

        ws.on('message', (message, isBinary) => {
          assert.deepStrictEqual(message, Buffer.from('hello'));
          assert.ok(!isBinary);
          server.close(done);
        });
      });
    });
  });

  describe('#completeUpgrade', () => {
    it('throws an error if called twice with the same socket', (done) => {
      const server = http.createServer();

      server.listen(0, () => {
        const wss = new WebSocket.Server({ noServer: true });

        server.on('upgrade', (req, socket, head) => {
          wss.handleUpgrade(req, socket, head, (ws) => {
            ws.close();
          });
          assert.throws(
            () => wss.handleUpgrade(req, socket, head, NOOP),
            (err) => {
              assert.ok(err instanceof Error);
              assert.strictEqual(
                err.message,
                'server.handleUpgrade() was called more than once with the ' +
                  'same socket, possibly due to a misconfiguration'
              );
              return true;
            }
          );
        });

        const ws = new WebSocket(`ws://localhost:${server.address().port}`);

        ws.on('open', () => {
          ws.on('close', () => {
            server.close(done);
          });
        });
      });
    });
  });

  describe('Connection establishing', () => {
    it('fails if the HTTP method is not GET', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const req = http.request({
          method: 'POST',
          port: wss.address().port,
          headers: {
            Connection: 'Upgrade',
            Upgrade: 'websocket'
          }
        });

        req.on('response', (res) => {
          assert.strictEqual(res.statusCode, 405);

          const chunks = [];

          res.on('data', (chunk) => {
            chunks.push(chunk);
          });

          res.on('end', () => {
            assert.strictEqual(
              Buffer.concat(chunks).toString(),
              'Invalid HTTP method'
            );
            wss.close(done);
          });
        });

        req.end();
      });

      wss.on('connection', () => {
        done(new Error("Unexpected 'connection' event"));
      });
    });

    it('fails if the Upgrade header field value cannot be read', (done) => {
      const server = http.createServer();
      const wss = new WebSocket.Server({ noServer: true });

      server.maxHeadersCount = 1;

      server.on('upgrade', (req, socket, head) => {
        assert.deepStrictEqual(req.headers, { foo: 'bar' });
        wss.handleUpgrade(req, socket, head, () => {
          done(new Error('Unexpected callback invocation'));
        });
      });

      server.listen(() => {
        const req = http.get({
          port: server.address().port,
          headers: {
            foo: 'bar',
            bar: 'baz',
            Connection: 'Upgrade',
            Upgrade: 'websocket'
          }
        });

        req.on('response', (res) => {
          assert.strictEqual(res.statusCode, 400);

          const chunks = [];

          res.on('data', (chunk) => {
            chunks.push(chunk);
          });

          res.on('end', () => {
            assert.strictEqual(
              Buffer.concat(chunks).toString(),
              'Invalid Upgrade header'
            );
            server.close(done);
          });
        });
      });
    });

    it('fails if the Upgrade header field value is not "websocket"', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const req = http.get({
          port: wss.address().port,
          headers: {
            Connection: 'Upgrade',
            Upgrade: 'foo'
          }
        });

        req.on('response', (res) => {
          assert.strictEqual(res.statusCode, 400);

          const chunks = [];

          res.on('data', (chunk) => {
            chunks.push(chunk);
          });

          res.on('end', () => {
            assert.strictEqual(
              Buffer.concat(chunks).toString(),
              'Invalid Upgrade header'
            );
            wss.close(done);
          });
        });
      });

      wss.on('connection', () => {
        done(new Error("Unexpected 'connection' event"));
      });
    });

    it('fails if the Sec-WebSocket-Key header is invalid (1/2)', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const req = http.get({
          port: wss.address().port,
          headers: {
            Connection: 'Upgrade',
            Upgrade: 'websocket'
          }
        });

        req.on('response', (res) => {
          assert.strictEqual(res.statusCode, 400);

          const chunks = [];

          res.on('data', (chunk) => {
            chunks.push(chunk);
          });

          res.on('end', () => {
            assert.strictEqual(
              Buffer.concat(chunks).toString(),
              'Missing or invalid Sec-WebSocket-Key header'
            );
            wss.close(done);
          });
        });
      });

      wss.on('connection', () => {
        done(new Error("Unexpected 'connection' event"));
      });
    });

    it('fails if the Sec-WebSocket-Key header is invalid (2/2)', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const req = http.get({
          port: wss.address().port,
          headers: {
            Connection: 'Upgrade',
            Upgrade: 'websocket',
            'Sec-WebSocket-Key': 'P5l8BJcZwRc='
          }
        });

        req.on('response', (res) => {
          assert.strictEqual(res.statusCode, 400);

          const chunks = [];

          res.on('data', (chunk) => {
            chunks.push(chunk);
          });

          res.on('end', () => {
            assert.strictEqual(
              Buffer.concat(chunks).toString(),
              'Missing or invalid Sec-WebSocket-Key header'
            );
            wss.close(done);
          });
        });
      });

      wss.on('connection', () => {
        done(new Error("Unexpected 'connection' event"));
      });
    });

    it('fails if the Sec-WebSocket-Version header is invalid (1/2)', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const req = http.get({
          port: wss.address().port,
          headers: {
            Connection: 'Upgrade',
            Upgrade: 'websocket',
            'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ=='
          }
        });

        req.on('response', (res) => {
          assert.strictEqual(res.statusCode, 400);
          assert.strictEqual(res.headers['sec-websocket-version'], '13, 8');

          const chunks = [];

          res.on('data', (chunk) => {
            chunks.push(chunk);
          });

          res.on('end', () => {
            assert.strictEqual(
              Buffer.concat(chunks).toString(),
              'Missing or invalid Sec-WebSocket-Version header'
            );
            wss.close(done);
          });
        });
      });

      wss.on('connection', () => {
        done(new Error("Unexpected 'connection' event"));
      });
    });

    it('fails if the Sec-WebSocket-Version header is invalid (2/2)', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const req = http.get({
          port: wss.address().port,
          headers: {
            Connection: 'Upgrade',
            Upgrade: 'websocket',
            'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==',
            'Sec-WebSocket-Version': 12
          }
        });

        req.on('response', (res) => {
          assert.strictEqual(res.statusCode, 400);
          assert.strictEqual(res.headers['sec-websocket-version'], '13, 8');

          const chunks = [];

          res.on('data', (chunk) => {
            chunks.push(chunk);
          });

          res.on('end', () => {
            assert.strictEqual(
              Buffer.concat(chunks).toString(),
              'Missing or invalid Sec-WebSocket-Version header'
            );
            wss.close(done);
          });
        });
      });

      wss.on('connection', () => {
        done(new Error("Unexpected 'connection' event"));
      });
    });

    it('fails is the Sec-WebSocket-Protocol header is invalid', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const req = http.get({
          port: wss.address().port,
          headers: {
            Connection: 'Upgrade',
            Upgrade: 'websocket',
            'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==',
            'Sec-WebSocket-Version': 13,
            'Sec-WebSocket-Protocol': 'foo;bar'
          }
        });

        req.on('response', (res) => {
          assert.strictEqual(res.statusCode, 400);

          const chunks = [];

          res.on('data', (chunk) => {
            chunks.push(chunk);
          });

          res.on('end', () => {
            assert.strictEqual(
              Buffer.concat(chunks).toString(),
              'Invalid Sec-WebSocket-Protocol header'
            );
            wss.close(done);
          });
        });
      });

      wss.on('connection', () => {
        done(new Error("Unexpected 'connection' event"));
      });
    });

    it('fails if the Sec-WebSocket-Extensions header is invalid', (done) => {
      const wss = new WebSocket.Server(
        {
          perMessageDeflate: true,
          port: 0
        },
        () => {
          const req = http.get({
            port: wss.address().port,
            headers: {
              Connection: 'Upgrade',
              Upgrade: 'websocket',
              'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==',
              'Sec-WebSocket-Version': 13,
              'Sec-WebSocket-Extensions':
                'permessage-deflate; server_max_window_bits=foo'
            }
          });

          req.on('response', (res) => {
            assert.strictEqual(res.statusCode, 400);

            const chunks = [];

            res.on('data', (chunk) => {
              chunks.push(chunk);
            });

            res.on('end', () => {
              assert.strictEqual(
                Buffer.concat(chunks).toString(),
                'Invalid or unacceptable Sec-WebSocket-Extensions header'
              );
              wss.close(done);
            });
          });
        }
      );

      wss.on('connection', () => {
        done(new Error("Unexpected 'connection' event"));
      });
    });

    it("emits the 'wsClientError' event", (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const req = http.request({
          method: 'POST',
          port: wss.address().port,
          headers: {
            Connection: 'Upgrade',
            Upgrade: 'websocket'
          }
        });

        req.on('response', (res) => {
          assert.strictEqual(res.statusCode, 400);
          wss.close(done);
        });

        req.end();
      });

      wss.on('wsClientError', (err, socket, request) => {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message, 'Invalid HTTP method');

        assert.ok(request instanceof http.IncomingMessage);
        assert.strictEqual(request.method, 'POST');

        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
      });

      wss.on('connection', () => {
        done(new Error("Unexpected 'connection' event"));
      });
    });

    it('fails if the WebSocket server is closing or closed', (done) => {
      const server = http.createServer();
      const wss = new WebSocket.Server({ noServer: true });

      server.on('upgrade', (req, socket, head) => {
        wss.close();
        wss.handleUpgrade(req, socket, head, () => {
          done(new Error('Unexpected callback invocation'));
        });
      });

      server.listen(0, () => {
        const ws = new WebSocket(`ws://localhost:${server.address().port}`);

        ws.on('unexpected-response', (req, res) => {
          assert.strictEqual(res.statusCode, 503);
          res.resume();
          server.close(done);
        });
      });
    });

    it('handles unsupported extensions', (done) => {
      const wss = new WebSocket.Server(
        {
          perMessageDeflate: true,
          port: 0
        },
        () => {
          const req = http.get({
            port: wss.address().port,
            headers: {
              Connection: 'Upgrade',
              Upgrade: 'websocket',
              'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==',
              'Sec-WebSocket-Version': 13,
              'Sec-WebSocket-Extensions': 'foo; bar'
            }
          });

          req.on('upgrade', (res, socket, head) => {
            if (head.length) socket.unshift(head);

            socket.once('data', (chunk) => {
              assert.strictEqual(chunk[0], 0x88);
              socket.destroy();
              wss.close(done);
            });
          });
        }
      );

      wss.on('connection', (ws) => {
        assert.strictEqual(ws.extensions, '');
        ws.close();
      });
    });

    describe('`verifyClient`', () => {
      it('can reject client synchronously', (done) => {
        const wss = new WebSocket.Server(
          {
            verifyClient: () => false,
            port: 0
          },
          () => {
            const req = http.get({
              port: wss.address().port,
              headers: {
                Connection: 'Upgrade',
                Upgrade: 'websocket',
                'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==',
                'Sec-WebSocket-Version': 8
              }
            });

            req.on('response', (res) => {
              assert.strictEqual(res.statusCode, 401);
              wss.close(done);
            });
          }
        );

        wss.on('connection', () => {
          done(new Error("Unexpected 'connection' event"));
        });
      });

      it('can accept client synchronously', (done) => {
        const server = https.createServer({
          cert: fs.readFileSync('test/fixtures/certificate.pem'),
          key: fs.readFileSync('test/fixtures/key.pem')
        });

        const wss = new WebSocket.Server({
          verifyClient: (info) => {
            assert.strictEqual(info.origin, 'https://example.com');
            assert.strictEqual(info.req.headers.foo, 'bar');
            assert.ok(info.secure, true);
            return true;
          },
          server
        });

        wss.on('connection', () => {
          server.close(done);
        });

        server.listen(0, () => {
          const ws = new WebSocket(`wss://localhost:${server.address().port}`, {
            headers: { Origin: 'https://example.com', foo: 'bar' },
            rejectUnauthorized: false
          });

          ws.on('open', ws.close);
        });
      });

      it('can accept client asynchronously', (done) => {
        const wss = new WebSocket.Server(
          {
            verifyClient: (o, cb) => process.nextTick(cb, true),
            port: 0
          },
          () => {
            const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

            ws.on('open', ws.close);
          }
        );

        wss.on('connection', () => wss.close(done));
      });

      it('can reject client asynchronously', (done) => {
        const wss = new WebSocket.Server(
          {
            verifyClient: (info, cb) => process.nextTick(cb, false),
            port: 0
          },
          () => {
            const req = http.get({
              port: wss.address().port,
              headers: {
                Connection: 'Upgrade',
                Upgrade: 'websocket',
                'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==',
                'Sec-WebSocket-Version': 8
              }
            });

            req.on('response', (res) => {
              assert.strictEqual(res.statusCode, 401);
              wss.close(done);
            });
          }
        );

        wss.on('connection', () => {
          done(new Error("Unexpected 'connection' event"));
        });
      });

      it('can reject client asynchronously w/ status code', (done) => {
        const wss = new WebSocket.Server(
          {
            verifyClient: (info, cb) => process.nextTick(cb, false, 404),
            port: 0
          },
          () => {
            const req = http.get({
              port: wss.address().port,
              headers: {
                Connection: 'Upgrade',
                Upgrade: 'websocket',
                'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==',
                'Sec-WebSocket-Version': 8
              }
            });

            req.on('response', (res) => {
              assert.strictEqual(res.statusCode, 404);
              wss.close(done);
            });
          }
        );

        wss.on('connection', () => {
          done(new Error("Unexpected 'connection' event"));
        });
      });

      it('can reject client asynchronously w/ custom headers', (done) => {
        const wss = new WebSocket.Server(
          {
            verifyClient: (info, cb) => {
              process.nextTick(cb, false, 503, '', { 'Retry-After': 120 });
            },
            port: 0
          },
          () => {
            const req = http.get({
              port: wss.address().port,
              headers: {
                Connection: 'Upgrade',
                Upgrade: 'websocket',
                'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==',
                'Sec-WebSocket-Version': 8
              }
            });

            req.on('response', (res) => {
              assert.strictEqual(res.statusCode, 503);
              assert.strictEqual(res.headers['retry-after'], '120');
              wss.close(done);
            });
          }
        );

        wss.on('connection', () => {
          done(new Error("Unexpected 'connection' event"));
        });
      });
    });

    it("doesn't emit the 'connection' event if socket is closed prematurely", (done) => {
      const server = http.createServer();

      server.listen(0, () => {
        const wss = new WebSocket.Server({
          verifyClient: ({ req: { socket } }, cb) => {
            assert.strictEqual(socket.readable, true);
            assert.strictEqual(socket.writable, true);

            socket.on('end', () => {
              assert.strictEqual(socket.readable, false);
              assert.strictEqual(socket.writable, true);
              cb(true);
            });
          },
          server
        });

        wss.on('connection', () => {
          done(new Error("Unexpected 'connection' event"));
        });

        const socket = net.connect(
          {
            port: server.address().port,
            allowHalfOpen: true
          },
          () => {
            socket.end(
              [
                'GET / HTTP/1.1',
                'Host: localhost',
                'Upgrade: websocket',
                'Connection: Upgrade',
                'Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==',
                'Sec-WebSocket-Version: 13',
                '\r\n'
              ].join('\r\n')
            );
          }
        );

        socket.on('end', () => {
          wss.close();
          server.close(done);
        });
      });
    });

    it('handles data passed along with the upgrade request', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const req = http.request({
          port: wss.address().port,
          headers: {
            Connection: 'Upgrade',
            Upgrade: 'websocket',
            'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==',
            'Sec-WebSocket-Version': 13
          }
        });

        const list = Sender.frame(Buffer.from('Hello'), {
          fin: true,
          rsv1: false,
          opcode: 0x01,
          mask: true,
          readOnly: false
        });

        req.write(Buffer.concat(list));
        req.end();
      });

      wss.on('connection', (ws) => {
        ws.on('message', (data, isBinary) => {
          assert.deepStrictEqual(data, Buffer.from('Hello'));
          assert.ok(!isBinary);
          wss.close(done);
        });
      });
    });

    describe('`handleProtocols`', () => {
      it('allows to select a subprotocol', (done) => {
        const handleProtocols = (protocols, request) => {
          assert.ok(request instanceof http.IncomingMessage);
          assert.strictEqual(request.url, '/');
          return Array.from(protocols).pop();
        };
        const wss = new WebSocket.Server({ handleProtocols, port: 0 }, () => {
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`, [
            'foo',
            'bar'
          ]);

          ws.on('open', () => {
            assert.strictEqual(ws.protocol, 'bar');
            wss.close(done);
          });
        });

        wss.on('connection', (ws) => {
          ws.close();
        });
      });
    });

    it("emits the 'headers' event", (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(
          `ws://localhost:${wss.address().port}?foo=bar`
        );

        ws.on('open', ws.close);
      });

      wss.on('headers', (headers, request) => {
        assert.deepStrictEqual(headers.slice(0, 3), [
          'HTTP/1.1 101 Switching Protocols',
          'Upgrade: websocket',
          'Connection: Upgrade'
        ]);
        assert.ok(request instanceof http.IncomingMessage);
        assert.strictEqual(request.url, '/?foo=bar');

        wss.on('connection', () => wss.close(done));
      });
    });
  });

  describe('permessage-deflate', () => {
    it('is disabled by default', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', ws.close);
      });

      wss.on('connection', (ws, req) => {
        assert.strictEqual(
          req.headers['sec-websocket-extensions'],
          'permessage-deflate; client_max_window_bits'
        );
        assert.strictEqual(ws.extensions, '');
        wss.close(done);
      });
    });

    it('uses configuration options', (done) => {
      const wss = new WebSocket.Server(
        {
          perMessageDeflate: { clientMaxWindowBits: 8 },
          port: 0
        },
        () => {
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

          ws.on('upgrade', (res) => {
            assert.strictEqual(
              res.headers['sec-websocket-extensions'],
              'permessage-deflate; client_max_window_bits=8'
            );

            wss.close(done);
          });
        }
      );

      wss.on('connection', (ws) => {
        ws.close();
      });
    });
  });
});

```

---

### websocket.integration.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/1457b75dc8-ws/test/websocket.integration.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

const assert = require('assert');

const WebSocket = require('..');

describe('WebSocket', () => {
  it('communicates successfully with echo service (ws)', (done) => {
    const ws = new WebSocket('ws://websocket-echo.com/', {
      protocolVersion: 13
    });

    let dataReceived = false;

    ws.on('open', () => {
      ws.send('hello');
    });

    ws.on('close', () => {
      assert.ok(dataReceived);
      done();
    });

    ws.on('message', (message, isBinary) => {
      dataReceived = true;
      assert.ok(!isBinary);
      assert.strictEqual(message.toString(), 'hello');
      ws.close();
    });
  });

  it('communicates successfully with echo service (wss)', (done) => {
    const ws = new WebSocket('wss://websocket-echo.com/', {
      protocolVersion: 13
    });

    let dataReceived = false;

    ws.on('open', () => {
      ws.send('hello');
    });

    ws.on('close', () => {
      assert.ok(dataReceived);
      done();
    });

    ws.on('message', (message, isBinary) => {
      dataReceived = true;
      assert.ok(!isBinary);
      assert.strictEqual(message.toString(), 'hello');
      ws.close();
    });
  });
});

```

---

### websocket.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/1457b75dc8-ws/test/websocket.test.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `externalComponent`
- `externalTestFile`
- `findMany`
- `$disconnect`

**Conteúdo do arquivo de teste:**

```javascript
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^ws$" }] */

'use strict';

const assert = require('assert');
const crypto = require('crypto');
const https = require('https');
const http = require('http');
const path = require('path');
const net = require('net');
const tls = require('tls');
const os = require('os');
const fs = require('fs');
const { getDefaultHighWaterMark } = require('stream');
const { URL } = require('url');

const Sender = require('../lib/sender');
const WebSocket = require('..');
const {
  CloseEvent,
  ErrorEvent,
  Event,
  MessageEvent
} = require('../lib/event-target');
const {
  EMPTY_BUFFER,
  GUID,
  hasBlob,
  kListener,
  NOOP
} = require('../lib/constants');

const highWaterMark = getDefaultHighWaterMark
  ? getDefaultHighWaterMark(false)
  : 16 * 1024;

class CustomAgent extends http.Agent {
  addRequest() {}
}

describe('WebSocket', () => {
  describe('#ctor', () => {
    it('throws an error when using an invalid url', () => {
      assert.throws(
        () => new WebSocket('foo'),
        /^SyntaxError: Invalid URL: foo$/
      );

      assert.throws(
        () => new WebSocket('bad-scheme://websocket-echo.com'),
        (err) => {
          assert.strictEqual(
            err.message,
            'The URL\'s protocol must be one of "ws:", "wss:", ' +
              '"http:", "https:", or "ws+unix:"'
          );

          return true;
        }
      );

      assert.throws(
        () => new WebSocket('ws+unix:'),
        /^SyntaxError: The URL's pathname is empty$/
      );

      assert.throws(
        () => new WebSocket('wss://websocket-echo.com#foo'),
        /^SyntaxError: The URL contains a fragment identifier$/
      );
    });

    it('throws an error if a subprotocol is invalid or duplicated', () => {
      for (const subprotocol of [null, '', 'a,b', ['a', 'a']]) {
        assert.throws(
          () => new WebSocket('ws://localhost', subprotocol),
          /^SyntaxError: An invalid or duplicated subprotocol was specified$/
        );
      }
    });

    it('accepts `url.URL` objects as url', (done) => {
      const agent = new http.Agent();

      agent.addRequest = (req, opts) => {
        assert.strictEqual(opts.host, '::1');
        assert.strictEqual(req.path, '/');
        done();
      };

      const ws = new WebSocket(new URL('ws://[::1]'), { agent });
    });

    it('allows the http scheme', (done) => {
      const agent = new CustomAgent();

      agent.addRequest = (req, opts) => {
        assert.strictEqual(opts.host, 'localhost');
        assert.strictEqual(opts.port, 80);
        done();
      };

      const ws = new WebSocket('http://localhost', { agent });
    });

    it('allows the https scheme', (done) => {
      const agent = new https.Agent();

      agent.addRequest = (req, opts) => {
        assert.strictEqual(opts.host, 'localhost');
        assert.strictEqual(opts.port, 443);
        done();
      };

      const ws = new WebSocket('https://localhost', { agent });
    });

    describe('options', () => {
      it('accepts the `options` object as 3rd argument', () => {
        const agent = new http.Agent();
        let count = 0;
        let ws;

        agent.addRequest = (req) => {
          assert.strictEqual(
            req.getHeader('sec-websocket-protocol'),
            undefined
          );
          count++;
        };

        ws = new WebSocket('ws://localhost', undefined, { agent });
        ws = new WebSocket('ws://localhost', [], { agent });

        assert.strictEqual(count, 2);
      });

      it('accepts the `maxPayload` option', (done) => {
        const maxPayload = 20480;
        const wss = new WebSocket.Server(
          {
            perMessageDeflate: true,
            port: 0
          },
          () => {
            const ws = new WebSocket(`ws://localhost:${wss.address().port}`, {
              perMessageDeflate: true,
              maxPayload
            });

            ws.on('open', () => {
              assert.strictEqual(ws._receiver._maxPayload, maxPayload);
              assert.strictEqual(
                ws._receiver._extensions['permessage-deflate']._maxPayload,
                maxPayload
              );
              wss.close(done);
            });
          }
        );

        wss.on('connection', (ws) => {
          ws.close();
        });
      });

      it('throws an error when using an invalid `protocolVersion`', () => {
        assert.throws(
          () => new WebSocket('ws://localhost', { protocolVersion: 1000 }),
          /^RangeError: Unsupported protocol version: 1000 \(supported versions: 8, 13\)$/
        );
      });

      it('honors the `generateMask` option', (done) => {
        const data = Buffer.from('foo');
        const wss = new WebSocket.Server({ port: 0 }, () => {
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`, {
            generateMask() {}
          });

          ws.on('open', () => {
            ws.send(data);
          });

          ws.on('close', (code, reason) => {
            assert.strictEqual(code, 1005);
            assert.deepStrictEqual(reason, EMPTY_BUFFER);

            wss.close(done);
          });
        });

        wss.on('connection', (ws) => {
          const chunks = [];

          ws._socket.prependListener('data', (chunk) => {
            chunks.push(chunk);
          });

          ws.on('message', (message) => {
            assert.deepStrictEqual(message, data);
            assert.deepStrictEqual(
              Buffer.concat(chunks).slice(2, 6),
              Buffer.alloc(4)
            );

            ws.close();
          });
        });
      });

      it('honors the `autoPong` option', (done) => {
        const wss = new WebSocket.Server({ port: 0 }, () => {
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`, {
            autoPong: false
          });

          ws.on('ping', () => {
            ws.close();
          });

          ws.on('close', () => {
            wss.close(done);
          });
        });

        wss.on('connection', (ws) => {
          ws.on('pong', () => {
            done(new Error("Unexpected 'pong' event"));
          });

          ws.ping();
        });
      });

      it('honors the `closeTimeout` option', (done) => {
        const wss = new WebSocket.Server({ port: 0 }, () => {
          const closeTimeout = 1000;
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`, {
            closeTimeout
          });

          ws.on('open', () => {
            ws.close();
            assert.strictEqual(ws._closeTimer._idleTimeout, closeTimeout);
          });

          ws.on('close', () => {
            wss.close(done);
          });
        });
      });
    });
  });

  describe('Constants', () => {
    const readyStates = {
      CONNECTING: 0,
      OPEN: 1,
      CLOSING: 2,
      CLOSED: 3
    };

    Object.keys(readyStates).forEach((state) => {
      describe(`\`${state}\``, () => {
        it('is enumerable property of class', () => {
          const descriptor = Object.getOwnPropertyDescriptor(WebSocket, state);

          assert.deepStrictEqual(descriptor, {
            configurable: false,
            enumerable: true,
            value: readyStates[state],
            writable: false
          });
        });

        it('is enumerable property of prototype', () => {
          const descriptor = Object.getOwnPropertyDescriptor(
            WebSocket.prototype,
            state
          );

          assert.deepStrictEqual(descriptor, {
            configurable: false,
            enumerable: true,
            value: readyStates[state],
            writable: false
          });
        });
      });
    });
  });

  describe('Attributes', () => {
    describe('`binaryType`', () => {
      it('is enumerable and configurable', () => {
        const descriptor = Object.getOwnPropertyDescriptor(
          WebSocket.prototype,
          'binaryType'
        );

        assert.strictEqual(descriptor.configurable, true);
        assert.strictEqual(descriptor.enumerable, true);
        assert.ok(descriptor.get !== undefined);
        assert.ok(descriptor.set !== undefined);
      });

      it("defaults to 'nodebuffer'", () => {
        const ws = new WebSocket('ws://localhost', {
          agent: new CustomAgent()
        });

        assert.strictEqual(ws.binaryType, 'nodebuffer');
      });

      it("can be changed to 'arraybuffer' or 'fragments'", () => {
        const ws = new WebSocket('ws://localhost', {
          agent: new CustomAgent()
        });

        ws.binaryType = 'arraybuffer';
        assert.strictEqual(ws.binaryType, 'arraybuffer');

        ws.binaryType = 'foo';
        assert.strictEqual(ws.binaryType, 'arraybuffer');

        ws.binaryType = 'fragments';
        assert.strictEqual(ws.binaryType, 'fragments');

        ws.binaryType = '';
        assert.strictEqual(ws.binaryType, 'fragments');

        ws.binaryType = 'nodebuffer';
        assert.strictEqual(ws.binaryType, 'nodebuffer');
      });
    });

    describe('`bufferedAmount`', () => {
      it('is enumerable and configurable', () => {
        const descriptor = Object.getOwnPropertyDescriptor(
          WebSocket.prototype,
          'bufferedAmount'
        );

        assert.strictEqual(descriptor.configurable, true);
        assert.strictEqual(descriptor.enumerable, true);
        assert.ok(descriptor.get !== undefined);
        assert.ok(descriptor.set === undefined);
      });

      it('defaults to zero', () => {
        const ws = new WebSocket('ws://localhost', {
          agent: new CustomAgent()
        });

        assert.strictEqual(ws.bufferedAmount, 0);
      });

      it('defaults to zero upon "open"', (done) => {
        const wss = new WebSocket.Server({ port: 0 }, () => {
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

          ws.onopen = () => {
            assert.strictEqual(ws.bufferedAmount, 0);
            wss.close(done);
          };
        });

        wss.on('connection', (ws) => {
          ws.close();
        });
      });

      it('takes into account the data in the sender queue', (done) => {
        const wss = new WebSocket.Server(
          {
            perMessageDeflate: true,
            port: 0
          },
          () => {
            const ws = new WebSocket(`ws://localhost:${wss.address().port}`, {
              perMessageDeflate: { threshold: 0 }
            });

            ws.on('open', () => {
              ws.send('foo');

              assert.strictEqual(ws.bufferedAmount, 3);

              ws.send('bar', (err) => {
                assert.ifError(err);
                assert.strictEqual(ws.bufferedAmount, 0);
                wss.close(done);
              });

              assert.strictEqual(ws.bufferedAmount, 6);
            });
          }
        );

        wss.on('connection', (ws) => {
          ws.close();
        });
      });

      it('takes into account the data in the socket queue', (done) => {
        const wss = new WebSocket.Server({ port: 0 }, () => {
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
        });

        wss.on('connection', (ws) => {
          const data = Buffer.alloc(1024, 61);

          while (ws.bufferedAmount === 0) {
            ws.send(data);
          }

          assert.ok(ws.bufferedAmount > 0);
          assert.strictEqual(
            ws.bufferedAmount,
            ws._socket._writableState.length
          );

          ws.on('close', () => wss.close(done));
          ws.close();
        });
      });
    });

    describe('`extensions`', () => {
      it('is enumerable and configurable', () => {
        const descriptor = Object.getOwnPropertyDescriptor(
          WebSocket.prototype,
          'bufferedAmount'
        );

        assert.strictEqual(descriptor.configurable, true);
        assert.strictEqual(descriptor.enumerable, true);
        assert.ok(descriptor.get !== undefined);
        assert.ok(descriptor.set === undefined);
      });

      it('exposes the negotiated extensions names (1/2)', (done) => {
        const wss = new WebSocket.Server({ port: 0 }, () => {
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

          assert.strictEqual(ws.extensions, '');

          ws.on('open', () => {
            assert.strictEqual(ws.extensions, '');
            ws.on('close', () => wss.close(done));
          });
        });

        wss.on('connection', (ws) => {
          assert.strictEqual(ws.extensions, '');
          ws.close();
        });
      });

      it('exposes the negotiated extensions names (2/2)', (done) => {
        const wss = new WebSocket.Server(
          {
            perMessageDeflate: true,
            port: 0
          },
          () => {
            const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

            assert.strictEqual(ws.extensions, '');

            ws.on('open', () => {
              assert.strictEqual(ws.extensions, 'permessage-deflate');
              ws.on('close', () => wss.close(done));
            });
          }
        );

        wss.on('connection', (ws) => {
          assert.strictEqual(ws.extensions, 'permessage-deflate');
          ws.close();
        });
      });
    });

    describe('`isPaused`', () => {
      it('is enumerable and configurable', () => {
        const descriptor = Object.getOwnPropertyDescriptor(
          WebSocket.prototype,
          'isPaused'
        );

        assert.strictEqual(descriptor.configurable, true);
        assert.strictEqual(descriptor.enumerable, true);
        assert.ok(descriptor.get !== undefined);
        assert.ok(descriptor.set === undefined);
      });

      it('indicates whether the websocket is paused', (done) => {
        const wss = new WebSocket.Server({ port: 0 }, () => {
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

          ws.on('open', () => {
            ws.pause();
            assert.ok(ws.isPaused);

            ws.resume();
            assert.ok(!ws.isPaused);

            ws.close();
            wss.close(done);
          });

          assert.ok(!ws.isPaused);
        });
      });
    });

    describe('`protocol`', () => {
      it('is enumerable and configurable', () => {
        const descriptor = Object.getOwnPropertyDescriptor(
          WebSocket.prototype,
          'protocol'
        );

        assert.strictEqual(descriptor.configurable, true);
        assert.strictEqual(descriptor.enumerable, true);
        assert.ok(descriptor.get !== undefined);
        assert.ok(descriptor.set === undefined);
      });

      it('exposes the subprotocol selected by the server', (done) => {
        const wss = new WebSocket.Server({ port: 0 }, () => {
          const port = wss.address().port;
          const ws = new WebSocket(`ws://localhost:${port}`, 'foo');

          assert.strictEqual(ws.extensions, '');

          ws.on('open', () => {
            assert.strictEqual(ws.protocol, 'foo');
            ws.on('close', () => wss.close(done));
          });
        });

        wss.on('connection', (ws) => {
          assert.strictEqual(ws.protocol, 'foo');
          ws.close();
        });
      });
    });

    describe('`readyState`', () => {
      it('is enumerable and configurable', () => {
        const descriptor = Object.getOwnPropertyDescriptor(
          WebSocket.prototype,
          'readyState'
        );

        assert.strictEqual(descriptor.configurable, true);
        assert.strictEqual(descriptor.enumerable, true);
        assert.ok(descriptor.get !== undefined);
        assert.ok(descriptor.set === undefined);
      });

      it('defaults to `CONNECTING`', () => {
        const ws = new WebSocket('ws://localhost', {
          agent: new CustomAgent()
        });

        assert.strictEqual(ws.readyState, WebSocket.CONNECTING);
      });

      it('is set to `OPEN` once connection is established', (done) => {
        const wss = new WebSocket.Server({ port: 0 }, () => {
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

          ws.on('open', () => {
            assert.strictEqual(ws.readyState, WebSocket.OPEN);
            ws.close();
          });

          ws.on('close', () => wss.close(done));
        });
      });

      it('is set to `CLOSED` once connection is closed', (done) => {
        const wss = new WebSocket.Server({ port: 0 }, () => {
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

          ws.on('close', () => {
            assert.strictEqual(ws.readyState, WebSocket.CLOSED);
            wss.close(done);
          });

          ws.on('open', () => ws.close(1001));
        });
      });

      it('is set to `CLOSED` once connection is terminated', (done) => {
        const wss = new WebSocket.Server({ port: 0 }, () => {
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

          ws.on('close', () => {
            assert.strictEqual(ws.readyState, WebSocket.CLOSED);
            wss.close(done);
          });

          ws.on('open', () => ws.terminate());
        });
      });
    });

    describe('`url`', () => {
      it('is enumerable and configurable', () => {
        const descriptor = Object.getOwnPropertyDescriptor(
          WebSocket.prototype,
          'url'
        );

        assert.strictEqual(descriptor.configurable, true);
        assert.strictEqual(descriptor.enumerable, true);
        assert.ok(descriptor.get !== undefined);
        assert.ok(descriptor.set === undefined);
      });

      it('exposes the server url', () => {
        const schemes = new Map([
          ['ws', 'ws'],
          ['wss', 'wss'],
          ['http', 'ws'],
          ['https', 'wss']
        ]);

        for (const [key, value] of schemes) {
          const ws = new WebSocket(`${key}://localhost/`, { lookup() {} });

          assert.strictEqual(ws.url, `${value}://localhost/`);
        }
      });
    });
  });

  describe('Events', () => {
    it("emits an 'error' event if an error occurs (1/2)", (done) => {
      let clientCloseEventEmitted = false;
      let serverClientCloseEventEmitted = false;

      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('error', (err) => {
          assert.ok(err instanceof RangeError);
          assert.strictEqual(err.code, 'WS_ERR_INVALID_OPCODE');
          assert.strictEqual(
            err.message,
            'Invalid WebSocket frame: invalid opcode 5'
          );

          ws.on('close', (code, reason) => {
            assert.strictEqual(code, 1006);
            assert.strictEqual(reason, EMPTY_BUFFER);

            clientCloseEventEmitted = true;
            if (serverClientCloseEventEmitted) wss.close(done);
          });
        });
      });

      wss.on('connection', (ws) => {
        ws.on('close', (code, reason) => {
          assert.strictEqual(code, 1002);
          assert.deepStrictEqual(reason, EMPTY_BUFFER);

          serverClientCloseEventEmitted = true;
          if (clientCloseEventEmitted) wss.close(done);
        });

        ws._socket.write(Buffer.from([0x85, 0x00]));
      });
    });

    it("emits an 'error' event if an error occurs (2/2)", function (done) {
      if (!fs.openAsBlob) return this.skip();

      const randomString = crypto.randomBytes(4).toString('hex');
      const file = path.join(os.tmpdir(), `ws-${randomString}.txt`);

      fs.writeFileSync(file, 'x'.repeat(64));

      fs.openAsBlob(file)
        .then((blob) => {
          fs.writeFileSync(file, 'x'.repeat(32));
          runTest(blob);
        })
        .catch(done);

      function runTest(blob) {
        const wss = new WebSocket.Server({ port: 0 }, () => {
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
        });

        wss.on('connection', (ws) => {
          ws.send(blob);

          ws.on('error', (err) => {
            try {
              assert.ok(err instanceof DOMException);
              assert.strictEqual(err.name, 'NotReadableError');
              assert.strictEqual(err.message, 'The blob could not be read');
            } finally {
              fs.unlinkSync(file);
            }

            ws.on('close', () => {
              wss.close(done);
            });
          });
        });
      }
    });

    it("emits the 'error' event only once (1/2)", function (done) {
      if (!fs.openAsBlob) return this.skip();

      const randomString = crypto.randomBytes(4).toString('hex');
      const file = path.join(os.tmpdir(), `ws-${randomString}.txt`);

      fs.writeFileSync(file, 'x'.repeat(64));

      fs.openAsBlob(file)
        .then((blob) => {
          fs.writeFileSync(file, 'x'.repeat(32));
          runTest(blob);
        })
        .catch(done);

      function runTest(blob) {
        const wss = new WebSocket.Server(
          {
            perMessageDeflate: true,
            port: 0
          },
          () => {
            const ws = new WebSocket(`ws://localhost:${wss.address().port}`, {
              perMessageDeflate: { threshold: 0 }
            });

            ws.on('open', () => {
              ws.send('foo');
              ws.send(blob);
            });

            ws.on('error', (err) => {
              try {
                assert.ok(err instanceof RangeError);
                assert.strictEqual(err.code, 'WS_ERR_INVALID_OPCODE');
                assert.strictEqual(
                  err.message,
                  'Invalid WebSocket frame: invalid opcode 5'
                );
              } finally {
                fs.unlinkSync(file);
              }

              ws.on('close', () => {
                wss.close(done);
              });
            });
          }
        );

        wss.on('connection', (ws) => {
          ws._socket.write(Buffer.from([0x85, 0x00]));
        });
      }
    });

    it("emits the 'error' event only once (2/2)", function (done) {
      if (!fs.openAsBlob) return this.skip();

      const randomString = crypto.randomBytes(4).toString('hex');
      const file = path.join(os.tmpdir(), `ws-${randomString}.txt`);

      fs.writeFileSync(file, 'x'.repeat(64));

      fs.openAsBlob(file)
        .then((blob) => {
          fs.writeFileSync(file, 'x'.repeat(32));
          runTest(blob);
        })
        .catch(done);

      function runTest(blob) {
        const wss = new WebSocket.Server(
          {
            perMessageDeflate: true,
            port: 0
          },
          () => {
            const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

            ws.on('open', () => {
              ws.send(blob);
            });

            ws.on('error', (err) => {
              try {
                assert.ok(err instanceof DOMException);
                assert.strictEqual(err.name, 'NotReadableError');
                assert.strictEqual(err.message, 'The blob could not be read');
              } finally {
                fs.unlinkSync(file);
              }

              ws.on('close', () => {
                wss.close(done);
              });
            });
          }
        );

        wss.on('connection', (ws) => {
          const buf = Buffer.from('c10100'.repeat(5) + '8500', 'hex');

          ws._socket.write(buf);
        });
      }
    });

    it("does not emit 'error' after 'close'", function (done) {
      if (!fs.openAsBlob) return this.skip();

      const randomString = crypto.randomBytes(4).toString('hex');
      const file = path.join(os.tmpdir(), `ws-${randomString}.bin`);

      fs.writeFileSync(file, crypto.randomBytes(1024 * 1024));
      fs.openAsBlob(file).then(runTest).catch(done);

      function runTest(blob) {
        const wss = new WebSocket.Server({ port: 0 }, () => {
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

          ws.on('open', () => {
            ws.send(blob, (err) => {
              try {
                assert.ok(err instanceof DOMException);
                assert.strictEqual(err.name, 'NotReadableError');
                assert.strictEqual(err.message, 'The blob could not be read');
              } catch (e) {
                ws.removeListener(onClose);
                throw e;
              } finally {
                fs.unlinkSync(file);
              }

              wss.close(done);
            });
          });

          ws.on('error', () => {
            done(new Error("Unexpected 'error' event"));
          });
          ws.on('close', onClose);

          function onClose() {
            fs.writeFileSync(file, crypto.randomBytes(32));
          }
        });

        wss.on('connection', (ws) => {
          ws._socket.end();
        });
      }
    });

    it('does not re-emit `net.Socket` errors', function (done) {
      //
      // `socket.resetAndDestroy()` is not available in Node.js < 16.17.0.
      //
      if (process.versions.modules < 93) return this.skip();

      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => {
          ws._socket.on('error', (err) => {
            assert.ok(err instanceof Error);
            assert.strictEqual(err.code, 'ECONNRESET');
            ws.on('close', (code, message) => {
              assert.strictEqual(code, 1006);
              assert.strictEqual(message, EMPTY_BUFFER);
              wss.close(done);
            });
          });

          wss.clients.values().next().value._socket.resetAndDestroy();
        });
      });
    });

    it("emits an 'upgrade' event", (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
        ws.on('upgrade', (res) => {
          assert.ok(res instanceof http.IncomingMessage);
          wss.close(done);
        });
      });

      wss.on('connection', (ws) => {
        ws.close();
      });
    });

    it("emits a 'ping' event", (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
        ws.on('ping', () => wss.close(done));
      });

      wss.on('connection', (ws) => {
        ws.ping();
        ws.close();
      });
    });

    it("emits a 'pong' event", (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
        ws.on('pong', () => wss.close(done));
      });

      wss.on('connection', (ws) => {
        ws.pong();
        ws.close();
      });
    });

    it("emits a 'redirect' event", (done) => {
      const server = http.createServer();
      const wss = new WebSocket.Server({ noServer: true, path: '/foo' });

      server.once('upgrade', (req, socket) => {
        socket.end('HTTP/1.1 302 Found\r\nLocation: /foo\r\n\r\n');
        server.once('upgrade', (req, socket, head) => {
          wss.handleUpgrade(req, socket, head, (ws) => {
            ws.close();
          });
        });
      });

      server.listen(() => {
        const port = server.address().port;
        const ws = new WebSocket(`ws://localhost:${port}`, {
          followRedirects: true
        });

        ws.on('redirect', (url, req) => {
          assert.strictEqual(ws._redirects, 1);
          assert.strictEqual(url, `ws://localhost:${port}/foo`);
          assert.ok(req instanceof http.ClientRequest);

          ws.on('close', (code) => {
            assert.strictEqual(code, 1005);
            server.close(done);
          });
        });
      });
    });
  });

  describe('Connection establishing', () => {
    const server = http.createServer();

    beforeEach((done) => server.listen(0, done));
    afterEach((done) => server.close(done));

    it('fails if the Upgrade header field value cannot be read', (done) => {
      server.once('upgrade', (req, socket) => {
        socket.on('end', socket.end);
        socket.write(
          'HTTP/1.1 101 Switching Protocols\r\n' +
            'Connection: Upgrade\r\n' +
            'Upgrade: websocket\r\n' +
            '\r\n'
        );
      });

      const ws = new WebSocket(`ws://localhost:${server.address().port}`);

      ws._req.maxHeadersCount = 1;

      ws.on('upgrade', (res) => {
        assert.deepStrictEqual(res.headers, { connection: 'Upgrade' });

        ws.on('error', (err) => {
          assert.ok(err instanceof Error);
          assert.strictEqual(err.message, 'Invalid Upgrade header');
          done();
        });
      });
    });

    it('fails if the Upgrade header field value is not "websocket"', (done) => {
      server.once('upgrade', (req, socket) => {
        socket.on('end', socket.end);
        socket.write(
          'HTTP/1.1 101 Switching Protocols\r\n' +
            'Connection: Upgrade\r\n' +
            'Upgrade: foo\r\n' +
            '\r\n'
        );
      });

      const ws = new WebSocket(`ws://localhost:${server.address().port}`);

      ws.on('error', (err) => {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message, 'Invalid Upgrade header');
        done();
      });
    });

    it('fails if the Sec-WebSocket-Accept header is invalid', (done) => {
      server.once('upgrade', (req, socket) => {
        socket.on('end', socket.end);
        socket.write(
          'HTTP/1.1 101 Switching Protocols\r\n' +
            'Upgrade: websocket\r\n' +
            'Connection: Upgrade\r\n' +
            'Sec-WebSocket-Accept: CxYS6+NgJSBG74mdgLvGscRvpns=\r\n' +
            '\r\n'
        );
      });

      const ws = new WebSocket(`ws://localhost:${server.address().port}`);

      ws.on('error', (err) => {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message, 'Invalid Sec-WebSocket-Accept header');
        done();
      });
    });

    it('close event is raised when server closes connection', (done) => {
      server.once('upgrade', (req, socket) => {
        const key = crypto
          .createHash('sha1')
          .update(req.headers['sec-websocket-key'] + GUID)
          .digest('base64');

        socket.end(
          'HTTP/1.1 101 Switching Protocols\r\n' +
            'Upgrade: websocket\r\n' +
            'Connection: Upgrade\r\n' +
            `Sec-WebSocket-Accept: ${key}\r\n` +
            '\r\n'
        );
      });

      const ws = new WebSocket(`ws://localhost:${server.address().port}`);

      ws.on('close', (code, reason) => {
        assert.strictEqual(code, 1006);
        assert.strictEqual(reason, EMPTY_BUFFER);
        done();
      });
    });

    it('error is emitted if server aborts connection', (done) => {
      server.once('upgrade', (req, socket) => {
        socket.end(
          `HTTP/1.1 401 ${http.STATUS_CODES[401]}\r\n` +
            'Connection: close\r\n' +
            'Content-type: text/html\r\n' +
            `Content-Length: ${http.STATUS_CODES[401].length}\r\n` +
            '\r\n'
        );
      });

      const ws = new WebSocket(`ws://localhost:${server.address().port}`);

      ws.on('open', () => done(new Error("Unexpected 'open' event")));
      ws.on('error', (err) => {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message, 'Unexpected server response: 401');
        done();
      });
    });

    it('unexpected response can be read when sent by server', (done) => {
      server.once('upgrade', (req, socket) => {
        socket.end(
          `HTTP/1.1 401 ${http.STATUS_CODES[401]}\r\n` +
            'Connection: close\r\n' +
            'Content-type: text/html\r\n' +
            'Content-Length: 3\r\n' +
            '\r\n' +
            'foo'
        );
      });

      const ws = new WebSocket(`ws://localhost:${server.address().port}`);

      ws.on('open', () => done(new Error("Unexpected 'open' event")));
      ws.on('error', () => done(new Error("Unexpected 'error' event")));
      ws.on('unexpected-response', (req, res) => {
        assert.strictEqual(res.statusCode, 401);

        let data = '';

        res.on('data', (v) => {
          data += v;
        });

        res.on('end', () => {
          assert.strictEqual(data, 'foo');
          done();
        });
      });
    });

    it('request can be aborted when unexpected response is sent by server', (done) => {
      server.once('upgrade', (req, socket) => {
        socket.end(
          `HTTP/1.1 401 ${http.STATUS_CODES[401]}\r\n` +
            'Connection: close\r\n' +
            'Content-type: text/html\r\n' +
            'Content-Length: 3\r\n' +
            '\r\n' +
            'foo'
        );
      });

      const ws = new WebSocket(`ws://localhost:${server.address().port}`);

      ws.on('open', () => done(new Error("Unexpected 'open' event")));
      ws.on('error', () => done(new Error("Unexpected 'error' event")));
      ws.on('unexpected-response', (req, res) => {
        assert.strictEqual(res.statusCode, 401);

        res.on('end', done);
        req.abort();
      });
    });

    it('fails if the opening handshake timeout expires', (done) => {
      server.once('upgrade', (req, socket) => socket.on('end', socket.end));

      const port = server.address().port;
      const ws = new WebSocket(`ws://localhost:${port}`, {
        handshakeTimeout: 100
      });

      ws.on('open', () => done(new Error("Unexpected 'open' event")));
      ws.on('error', (err) => {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message, 'Opening handshake has timed out');
        done();
      });
    });

    it('fails if an unexpected Sec-WebSocket-Extensions header is received', (done) => {
      server.once('upgrade', (req, socket) => {
        const key = crypto
          .createHash('sha1')
          .update(req.headers['sec-websocket-key'] + GUID)
          .digest('base64');

        socket.end(
          'HTTP/1.1 101 Switching Protocols\r\n' +
            'Upgrade: websocket\r\n' +
            'Connection: Upgrade\r\n' +
            `Sec-WebSocket-Accept: ${key}\r\n` +
            'Sec-WebSocket-Extensions: foo\r\n' +
            '\r\n'
        );
      });

      const ws = new WebSocket(`ws://localhost:${server.address().port}`, {
        perMessageDeflate: false
      });

      ws.on('open', () => done(new Error("Unexpected 'open' event")));
      ws.on('error', (err) => {
        assert.ok(err instanceof Error);
        assert.strictEqual(
          err.message,
          'Server sent a Sec-WebSocket-Extensions header but no extension ' +
            'was requested'
        );
        ws.on('close', () => done());
      });
    });

    it('fails if the Sec-WebSocket-Extensions header is invalid (1/2)', (done) => {
      server.once('upgrade', (req, socket) => {
        const key = crypto
          .createHash('sha1')
          .update(req.headers['sec-websocket-key'] + GUID)
          .digest('base64');

        socket.end(
          'HTTP/1.1 101 Switching Protocols\r\n' +
            'Upgrade: websocket\r\n' +
            'Connection: Upgrade\r\n' +
            `Sec-WebSocket-Accept: ${key}\r\n` +
            'Sec-WebSocket-Extensions: foo;=\r\n' +
            '\r\n'
        );
      });

      const ws = new WebSocket(`ws://localhost:${server.address().port}`);

      ws.on('open', () => done(new Error("Unexpected 'open' event")));
      ws.on('error', (err) => {
        assert.ok(err instanceof Error);
        assert.strictEqual(
          err.message,
          'Invalid Sec-WebSocket-Extensions header'
        );
        ws.on('close', () => done());
      });
    });

    it('fails if the Sec-WebSocket-Extensions header is invalid (2/2)', (done) => {
      server.once('upgrade', (req, socket) => {
        const key = crypto
          .createHash('sha1')
          .update(req.headers['sec-websocket-key'] + GUID)
          .digest('base64');

        socket.end(
          'HTTP/1.1 101 Switching Protocols\r\n' +
            'Upgrade: websocket\r\n' +
            'Connection: Upgrade\r\n' +
            `Sec-WebSocket-Accept: ${key}\r\n` +
            'Sec-WebSocket-Extensions: ' +
            'permessage-deflate; client_max_window_bits=7\r\n' +
            '\r\n'
        );
      });

      const ws = new WebSocket(`ws://localhost:${server.address().port}`);

      ws.on('open', () => done(new Error("Unexpected 'open' event")));
      ws.on('error', (err) => {
        assert.ok(err instanceof Error);
        assert.strictEqual(
          err.message,
          'Invalid Sec-WebSocket-Extensions header'
        );
        ws.on('close', () => done());
      });
    });

    it('fails if an unexpected extension is received (1/2)', (done) => {
      server.once('upgrade', (req, socket) => {
        const key = crypto
          .createHash('sha1')
          .update(req.headers['sec-websocket-key'] + GUID)
          .digest('base64');

        socket.end(
          'HTTP/1.1 101 Switching Protocols\r\n' +
            'Upgrade: websocket\r\n' +
            'Connection: Upgrade\r\n' +
            `Sec-WebSocket-Accept: ${key}\r\n` +
            'Sec-WebSocket-Extensions: foo\r\n' +
            '\r\n'
        );
      });

      const ws = new WebSocket(`ws://localhost:${server.address().port}`);

      ws.on('open', () => done(new Error("Unexpected 'open' event")));
      ws.on('error', (err) => {
        assert.ok(err instanceof Error);
        assert.strictEqual(
          err.message,
          'Server indicated an extension that was not requested'
        );
        ws.on('close', () => done());
      });
    });

    it('fails if an unexpected extension is received (2/2)', (done) => {
      server.once('upgrade', (req, socket) => {
        const key = crypto
          .createHash('sha1')
          .update(req.headers['sec-websocket-key'] + GUID)
          .digest('base64');

        socket.end(
          'HTTP/1.1 101 Switching Protocols\r\n' +
            'Upgrade: websocket\r\n' +
            'Connection: Upgrade\r\n' +
            `Sec-WebSocket-Accept: ${key}\r\n` +
            'Sec-WebSocket-Extensions: permessage-deflate,foo\r\n' +
            '\r\n'
        );
      });

      const ws = new WebSocket(`ws://localhost:${server.address().port}`);

      ws.on('open', () => done(new Error("Unexpected 'open' event")));
      ws.on('error', (err) => {
        assert.ok(err instanceof Error);
        assert.strictEqual(
          err.message,
          'Server indicated an extension that was not requested'
        );
        ws.on('close', () => done());
      });
    });

    it('fails if server sends a subprotocol when none was requested', (done) => {
      const wss = new WebSocket.Server({ server });

      wss.on('headers', (headers) => {
        headers.push('Sec-WebSocket-Protocol: foo');
      });

      const ws = new WebSocket(`ws://localhost:${server.address().port}`);

      ws.on('open', () => done(new Error("Unexpected 'open' event")));
      ws.on('error', (err) => {
        assert.ok(err instanceof Error);
        assert.strictEqual(
          err.message,
          'Server sent a subprotocol but none was requested'
        );
        ws.on('close', () => wss.close(done));
      });
    });

    it('fails if server sends an invalid subprotocol (1/2)', (done) => {
      const wss = new WebSocket.Server({
        handleProtocols: () => 'baz',
        server
      });

      const ws = new WebSocket(`ws://localhost:${server.address().port}`, [
        'foo',
        'bar'
      ]);

      ws.on('open', () => done(new Error("Unexpected 'open' event")));
      ws.on('error', (err) => {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message, 'Server sent an invalid subprotocol');
        ws.on('close', () => wss.close(done));
      });
    });

    it('fails if server sends an invalid subprotocol (2/2)', (done) => {
      server.once('upgrade', (req, socket) => {
        const key = crypto
          .createHash('sha1')
          .update(req.headers['sec-websocket-key'] + GUID)
          .digest('base64');

        socket.end(
          'HTTP/1.1 101 Switching Protocols\r\n' +
            'Upgrade: websocket\r\n' +
            'Connection: Upgrade\r\n' +
            `Sec-WebSocket-Accept: ${key}\r\n` +
            'Sec-WebSocket-Protocol:\r\n' +
            '\r\n'
        );
      });

      const ws = new WebSocket(`ws://localhost:${server.address().port}`, [
        'foo',
        'bar'
      ]);

      ws.on('open', () => done(new Error("Unexpected 'open' event")));
      ws.on('error', (err) => {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message, 'Server sent an invalid subprotocol');
        ws.on('close', () => done());
      });
    });

    it('fails if server sends no subprotocol', (done) => {
      const wss = new WebSocket.Server({
        handleProtocols() {},
        server
      });

      const ws = new WebSocket(`ws://localhost:${server.address().port}`, [
        'foo',
        'bar'
      ]);

      ws.on('open', () => done(new Error("Unexpected 'open' event")));
      ws.on('error', (err) => {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message, 'Server sent no subprotocol');
        ws.on('close', () => wss.close(done));
      });
    });

    it('honors the `createConnection` option', (done) => {
      const wss = new WebSocket.Server({ noServer: true, path: '/foo' });

      server.once('upgrade', (req, socket, head) => {
        assert.strictEqual(req.headers.host, 'google.com:22');
        wss.handleUpgrade(req, socket, head, NOOP);
      });

      const ws = new WebSocket('ws://google.com:22/foo', {
        createConnection: (options) => {
          assert.strictEqual(options.host, 'google.com');
          assert.strictEqual(options.port, '22');

          // Ignore the `options` argument, and use the correct hostname and
          // port to connect to the server.
          return net.createConnection({
            host: 'localhost',
            port: server.address().port
          });
        }
      });

      ws.on('open', () => {
        assert.strictEqual(ws.url, 'ws://google.com:22/foo');
        ws.on('close', () => done());
        ws.close();
      });
    });

    it('does not follow redirects by default', (done) => {
      server.once('upgrade', (req, socket) => {
        socket.end(
          'HTTP/1.1 301 Moved Permanently\r\n' +
            'Location: ws://localhost:8080\r\n' +
            '\r\n'
        );
      });

      const ws = new WebSocket(`ws://localhost:${server.address().port}`);

      ws.on('open', () => done(new Error("Unexpected 'open' event")));
      ws.on('error', (err) => {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message, 'Unexpected server response: 301');
        assert.strictEqual(ws._redirects, 0);
        ws.on('close', () => done());
      });
    });

    it('honors the `followRedirects` option', (done) => {
      const wss = new WebSocket.Server({ noServer: true, path: '/foo' });

      server.once('upgrade', (req, socket) => {
        socket.end('HTTP/1.1 302 Found\r\nLocation: /foo\r\n\r\n');
        server.once('upgrade', (req, socket, head) => {
          wss.handleUpgrade(req, socket, head, NOOP);
        });
      });

      const port = server.address().port;
      const ws = new WebSocket(`ws://localhost:${port}`, {
        followRedirects: true
      });

      ws.on('open', () => {
        assert.strictEqual(ws.url, `ws://localhost:${port}/foo`);
        assert.strictEqual(ws._redirects, 1);
        ws.on('close', () => done());
        ws.close();
      });
    });

    it('honors the `maxRedirects` option', (done) => {
      const onUpgrade = (req, socket) => {
        socket.end('HTTP/1.1 302 Found\r\nLocation: /\r\n\r\n');
      };

      server.on('upgrade', onUpgrade);

      const ws = new WebSocket(`ws://localhost:${server.address().port}`, {
        followRedirects: true,
        maxRedirects: 1
      });

      ws.on('open', () => done(new Error("Unexpected 'open' event")));
      ws.on('error', (err) => {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message, 'Maximum redirects exceeded');
        assert.strictEqual(ws._redirects, 2);

        server.removeListener('upgrade', onUpgrade);
        ws.on('close', () => done());
      });
    });

    it('emits an error if the redirect URL is invalid (1/2)', (done) => {
      server.once('upgrade', (req, socket) => {
        socket.end('HTTP/1.1 302 Found\r\nLocation: ws://\r\n\r\n');
      });

      const ws = new WebSocket(`ws://localhost:${server.address().port}`, {
        followRedirects: true
      });

      ws.on('open', () => done(new Error("Unexpected 'open' event")));
      ws.on('error', (err) => {
        assert.ok(err instanceof SyntaxError);
        assert.strictEqual(err.message, 'Invalid URL: ws://');
        assert.strictEqual(ws._redirects, 1);

        ws.on('close', () => done());
      });
    });

    it('emits an error if the redirect URL is invalid (2/2)', (done) => {
      server.once('upgrade', (req, socket) => {
        socket.end(
          'HTTP/1.1 302 Found\r\nLocation: bad-scheme://localhost\r\n\r\n'
        );
      });

      const ws = new WebSocket(`ws://localhost:${server.address().port}`, {
        followRedirects: true
      });

      ws.on('open', () => done(new Error("Unexpected 'open' event")));
      ws.on('error', (err) => {
        assert.ok(err instanceof SyntaxError);
        assert.strictEqual(
          err.message,
          'The URL\'s protocol must be one of "ws:", "wss:", ' +
            '"http:", "https:", or "ws+unix:"'
        );
        assert.strictEqual(ws._redirects, 1);

        ws.on('close', () => done());
      });
    });

    it('uses the first url userinfo when following redirects', (done) => {
      const wss = new WebSocket.Server({ noServer: true, path: '/foo' });
      const authorization = 'Basic Zm9vOmJhcg==';

      server.once('upgrade', (req, socket) => {
        socket.end(
          'HTTP/1.1 302 Found\r\n' +
            `Location: ws://baz:qux@localhost:${port}/foo\r\n\r\n`
        );
        server.once('upgrade', (req, socket, head) => {
          wss.handleUpgrade(req, socket, head, (ws, req) => {
            assert.strictEqual(req.headers.authorization, authorization);
            ws.close();
          });
        });
      });

      const port = server.address().port;
      const ws = new WebSocket(`ws://foo:bar@localhost:${port}`, {
        followRedirects: true
      });

      assert.strictEqual(ws._req.getHeader('Authorization'), authorization);

      ws.on('close', (code) => {
        assert.strictEqual(code, 1005);
        assert.strictEqual(ws.url, `ws://baz:qux@localhost:${port}/foo`);
        assert.strictEqual(ws._redirects, 1);

        wss.close(done);
      });
    });

    describe('When moving away from a secure context', () => {
      function proxy(httpServer, httpsServer) {
        const server = net.createServer({ allowHalfOpen: true });

        server.on('connection', (socket) => {
          socket.on('readable', function read() {
            socket.removeListener('readable', read);

            const buf = socket.read(1);
            const target = buf[0] === 22 ? httpsServer : httpServer;

            socket.unshift(buf);
            target.emit('connection', socket);
          });
        });

        return server;
      }

      describe("If there is no 'redirect' event listener", () => {
        it('drops the `auth` option', (done) => {
          const httpServer = http.createServer();
          const httpsServer = https.createServer({
            cert: fs.readFileSync('test/fixtures/certificate.pem'),
            key: fs.readFileSync('test/fixtures/key.pem')
          });
          const server = proxy(httpServer, httpsServer);

          server.listen(() => {
            const port = server.address().port;

            httpsServer.on('upgrade', (req, socket) => {
              socket.on('error', NOOP);
              socket.end(
                'HTTP/1.1 302 Found\r\n' +
                  `Location: ws://localhost:${port}/\r\n\r\n`
              );
            });

            const wss = new WebSocket.Server({ server: httpServer });

            wss.on('connection', (ws, req) => {
              assert.strictEqual(req.headers.authorization, undefined);
              ws.close();
            });

            const ws = new WebSocket(`wss://localhost:${port}`, {
              auth: 'foo:bar',
              followRedirects: true,
              rejectUnauthorized: false
            });

            assert.strictEqual(
              ws._req.getHeader('Authorization'),
              'Basic Zm9vOmJhcg=='
            );

            ws.on('close', (code) => {
              assert.strictEqual(code, 1005);
              assert.strictEqual(ws.url, `ws://localhost:${port}/`);
              assert.strictEqual(ws._redirects, 1);

              server.close(done);
            });
          });
        });

        it('drops the Authorization and Cookie headers', (done) => {
          const httpServer = http.createServer();
          const httpsServer = https.createServer({
            cert: fs.readFileSync('test/fixtures/certificate.pem'),
            key: fs.readFileSync('test/fixtures/key.pem')
          });
          const server = proxy(httpServer, httpsServer);

          server.listen(() => {
            const port = server.address().port;

            httpsServer.on('upgrade', (req, socket) => {
              socket.on('error', NOOP);
              socket.end(
                'HTTP/1.1 302 Found\r\n' +
                  `Location: ws://localhost:${port}/\r\n\r\n`
              );
            });

            const headers = {
              authorization: 'Basic Zm9vOmJhcg==',
              cookie: 'foo=bar',
              host: 'foo'
            };

            const wss = new WebSocket.Server({ server: httpServer });

            wss.on('connection', (ws, req) => {
              assert.strictEqual(req.headers.authorization, undefined);
              assert.strictEqual(req.headers.cookie, undefined);
              assert.strictEqual(req.headers.host, headers.host);

              ws.close();
            });

            const ws = new WebSocket(`wss://localhost:${port}`, {
              followRedirects: true,
              headers,
              rejectUnauthorized: false
            });

            const firstRequest = ws._req;

            assert.strictEqual(
              firstRequest.getHeader('Authorization'),
              headers.authorization
            );
            assert.strictEqual(
              firstRequest.getHeader('Cookie'),
              headers.cookie
            );
            assert.strictEqual(firstRequest.getHeader('Host'), headers.host);

            ws.on('close', (code) => {
              assert.strictEqual(code, 1005);
              assert.strictEqual(ws.url, `ws://localhost:${port}/`);
              assert.strictEqual(ws._redirects, 1);

              server.close(done);
            });
          });
        });
      });

      describe("If there is at least one 'redirect' event listener", () => {
        it('does not drop any headers by default', (done) => {
          const httpServer = http.createServer();
          const httpsServer = https.createServer({
            cert: fs.readFileSync('test/fixtures/certificate.pem'),
            key: fs.readFileSync('test/fixtures/key.pem')
          });
          const server = proxy(httpServer, httpsServer);

          server.listen(() => {
            const port = server.address().port;

            httpsServer.on('upgrade', (req, socket) => {
              socket.on('error', NOOP);
              socket.end(
                'HTTP/1.1 302 Found\r\n' +
                  `Location: ws://localhost:${port}/\r\n\r\n`
              );
            });

            const headers = {
              authorization: 'Basic Zm9vOmJhcg==',
              cookie: 'foo=bar',
              host: 'foo'
            };

            const wss = new WebSocket.Server({ server: httpServer });

            wss.on('connection', (ws, req) => {
              assert.strictEqual(
                req.headers.authorization,
                headers.authorization
              );
              assert.strictEqual(req.headers.cookie, headers.cookie);
              assert.strictEqual(req.headers.host, headers.host);

              ws.close();
            });

            const ws = new WebSocket(`wss://localhost:${port}`, {
              followRedirects: true,
              headers,
              rejectUnauthorized: false
            });

            const firstRequest = ws._req;

            assert.strictEqual(
              firstRequest.getHeader('Authorization'),
              headers.authorization
            );
            assert.strictEqual(
              firstRequest.getHeader('Cookie'),
              headers.cookie
            );
            assert.strictEqual(firstRequest.getHeader('Host'), headers.host);

            ws.on('redirect', (url, req) => {
              assert.strictEqual(ws._redirects, 1);
              assert.strictEqual(url, `ws://localhost:${port}/`);
              assert.notStrictEqual(firstRequest, req);
              assert.strictEqual(
                req.getHeader('Authorization'),
                headers.authorization
              );
              assert.strictEqual(req.getHeader('Cookie'), headers.cookie);
              assert.strictEqual(req.getHeader('Host'), headers.host);

              ws.on('close', (code) => {
                assert.strictEqual(code, 1005);
                server.close(done);
              });
            });
          });
        });
      });
    });

    describe('When the redirect host is different', () => {
      describe("If there is no 'redirect' event listener", () => {
        it('drops the `auth` option', (done) => {
          const wss = new WebSocket.Server({ port: 0 }, () => {
            const port = wss.address().port;

            server.once('upgrade', (req, socket) => {
              socket.end(
                'HTTP/1.1 302 Found\r\n' +
                  `Location: ws://localhost:${port}/\r\n\r\n`
              );
            });

            const ws = new WebSocket(
              `ws://localhost:${server.address().port}`,
              {
                auth: 'foo:bar',
                followRedirects: true
              }
            );

            assert.strictEqual(
              ws._req.getHeader('Authorization'),
              'Basic Zm9vOmJhcg=='
            );

            ws.on('close', (code) => {
              assert.strictEqual(code, 1005);
              assert.strictEqual(ws.url, `ws://localhost:${port}/`);
              assert.strictEqual(ws._redirects, 1);

              wss.close(done);
            });
          });

          wss.on('connection', (ws, req) => {
            assert.strictEqual(req.headers.authorization, undefined);
            ws.close();
          });
        });

        it('drops the Authorization, Cookie and Host headers (1/4)', (done) => {
          // Test the `ws:` to `ws:` case.

          const wss = new WebSocket.Server({ port: 0 }, () => {
            const port = wss.address().port;

            server.once('upgrade', (req, socket) => {
              socket.end(
                'HTTP/1.1 302 Found\r\n' +
                  `Location: ws://localhost:${port}/\r\n\r\n`
              );
            });

            const headers = {
              authorization: 'Basic Zm9vOmJhcg==',
              cookie: 'foo=bar',
              host: 'foo'
            };

            const ws = new WebSocket(
              `ws://localhost:${server.address().port}`,
              { followRedirects: true, headers }
            );

            const firstRequest = ws._req;

            assert.strictEqual(
              firstRequest.getHeader('Authorization'),
              headers.authorization
            );
            assert.strictEqual(
              firstRequest.getHeader('Cookie'),
              headers.cookie
            );
            assert.strictEqual(firstRequest.getHeader('Host'), headers.host);

            ws.on('close', (code) => {
              assert.strictEqual(code, 1005);
              assert.strictEqual(ws.url, `ws://localhost:${port}/`);
              assert.strictEqual(ws._redirects, 1);

              wss.close(done);
            });
          });

          wss.on('connection', (ws, req) => {
            assert.strictEqual(req.headers.authorization, undefined);
            assert.strictEqual(req.headers.cookie, undefined);
            assert.strictEqual(
              req.headers.host,
              `localhost:${wss.address().port}`
            );

            ws.close();
          });
        });

        it('drops the Authorization, Cookie and Host headers (2/4)', (done) => {
          // Test the `ws:` to `ws+unix:` case.

          const randomString = crypto.randomBytes(4).toString('hex');
          const ipcPath =
            process.platform === 'win32'
              ? `\\\\.\\pipe\\ws-pipe-${randomString}`
              : path.join(os.tmpdir(), `ws-${randomString}.sock`);

          server.once('upgrade', (req, socket) => {
            socket.end(
              `HTTP/1.1 302 Found\r\nLocation: ws+unix:${ipcPath}\r\n\r\n`
            );
          });

          const redirectedServer = http.createServer();
          const wss = new WebSocket.Server({ server: redirectedServer });

          wss.on('connection', (ws, req) => {
            assert.strictEqual(req.headers.authorization, undefined);
            assert.strictEqual(req.headers.cookie, undefined);
            assert.strictEqual(req.headers.host, 'localhost');

            ws.close();
          });

          redirectedServer.listen(ipcPath, () => {
            const headers = {
              authorization: 'Basic Zm9vOmJhcg==',
              cookie: 'foo=bar',
              host: 'foo'
            };

            const ws = new WebSocket(
              `ws://localhost:${server.address().port}`,
              { followRedirects: true, headers }
            );

            const firstRequest = ws._req;

            assert.strictEqual(
              firstRequest.getHeader('Authorization'),
              headers.authorization
            );
            assert.strictEqual(
              firstRequest.getHeader('Cookie'),
              headers.cookie
            );
            assert.strictEqual(firstRequest.getHeader('Host'), headers.host);

            ws.on('close', (code) => {
              assert.strictEqual(code, 1005);
              assert.strictEqual(ws.url, `ws+unix:${ipcPath}`);
              assert.strictEqual(ws._redirects, 1);

              redirectedServer.close(done);
            });
          });
        });

        it('drops the Authorization, Cookie and Host headers (3/4)', (done) => {
          // Test the `ws+unix:` to `ws+unix:` case.

          const randomString1 = crypto.randomBytes(4).toString('hex');
          const randomString2 = crypto.randomBytes(4).toString('hex');
          let redirectingServerIpcPath;
          let redirectedServerIpcPath;

          if (process.platform === 'win32') {
            redirectingServerIpcPath = `\\\\.\\pipe\\ws-pipe-${randomString1}`;
            redirectedServerIpcPath = `\\\\.\\pipe\\ws-pipe-${randomString2}`;
          } else {
            redirectingServerIpcPath = path.join(
              os.tmpdir(),
              `ws-${randomString1}.sock`
            );
            redirectedServerIpcPath = path.join(
              os.tmpdir(),
              `ws-${randomString2}.sock`
            );
          }

          const redirectingServer = http.createServer();

          redirectingServer.on('upgrade', (req, socket) => {
            socket.end(
              'HTTP/1.1 302 Found\r\n' +
                `Location: ws+unix:${redirectedServerIpcPath}\r\n\r\n`
            );
          });

          const redirectedServer = http.createServer();
          const wss = new WebSocket.Server({ server: redirectedServer });

          wss.on('connection', (ws, req) => {
            assert.strictEqual(req.headers.authorization, undefined);
            assert.strictEqual(req.headers.cookie, undefined);
            assert.strictEqual(req.headers.host, 'localhost');

            ws.close();
          });

          redirectingServer.listen(redirectingServerIpcPath, listening);
          redirectedServer.listen(redirectedServerIpcPath, listening);

          let callCount = 0;

          function listening() {
            if (++callCount !== 2) return;

            const headers = {
              authorization: 'Basic Zm9vOmJhcg==',
              cookie: 'foo=bar',
              host: 'foo'
            };

            const ws = new WebSocket(`ws+unix:${redirectingServerIpcPath}`, {
              followRedirects: true,
              headers
            });

            const firstRequest = ws._req;

            assert.strictEqual(
              firstRequest.getHeader('Authorization'),
              headers.authorization
            );
            assert.strictEqual(
              firstRequest.getHeader('Cookie'),
              headers.cookie
            );
            assert.strictEqual(firstRequest.getHeader('Host'), headers.host);

            ws.on('close', (code) => {
              assert.strictEqual(code, 1005);
              assert.strictEqual(ws.url, `ws+unix:${redirectedServerIpcPath}`);
              assert.strictEqual(ws._redirects, 1);

              redirectingServer.close();
              redirectedServer.close(done);
            });
          }
        });

        it('drops the Authorization, Cookie and Host headers (4/4)', (done) => {
          // Test the `ws+unix:` to `ws:` case.

          const redirectingServer = http.createServer();
          const redirectedServer = http.createServer();
          const wss = new WebSocket.Server({ server: redirectedServer });

          wss.on('connection', (ws, req) => {
            assert.strictEqual(req.headers.authorization, undefined);
            assert.strictEqual(req.headers.cookie, undefined);
            assert.strictEqual(
              req.headers.host,
              `localhost:${redirectedServer.address().port}`
            );

            ws.close();
          });

          const randomString = crypto.randomBytes(4).toString('hex');
          const ipcPath =
            process.platform === 'win32'
              ? `\\\\.\\pipe\\ws-pipe-${randomString}`
              : path.join(os.tmpdir(), `ws-${randomString}.sock`);

          redirectingServer.listen(ipcPath, listening);
          redirectedServer.listen(0, listening);

          let callCount = 0;

          function listening() {
            if (++callCount !== 2) return;

            const port = redirectedServer.address().port;

            redirectingServer.on('upgrade', (req, socket) => {
              socket.end(
                `HTTP/1.1 302 Found\r\nLocation: ws://localhost:${port}\r\n\r\n`
              );
            });

            const headers = {
              authorization: 'Basic Zm9vOmJhcg==',
              cookie: 'foo=bar',
              host: 'foo'
            };

            const ws = new WebSocket(`ws+unix:${ipcPath}`, {
              followRedirects: true,
              headers
            });

            const firstRequest = ws._req;

            assert.strictEqual(
              firstRequest.getHeader('Authorization'),
              headers.authorization
            );
            assert.strictEqual(
              firstRequest.getHeader('Cookie'),
              headers.cookie
            );
            assert.strictEqual(firstRequest.getHeader('Host'), headers.host);

            ws.on('close', (code) => {
              assert.strictEqual(code, 1005);
              assert.strictEqual(ws.url, `ws://localhost:${port}/`);
              assert.strictEqual(ws._redirects, 1);

              redirectingServer.close();
              redirectedServer.close(done);
            });
          }
        });
      });

      describe("If there is at least one 'redirect' event listener", () => {
        it('does not drop any headers by default', (done) => {
          const headers = {
            authorization: 'Basic Zm9vOmJhcg==',
            cookie: 'foo=bar',
            host: 'foo'
          };

          const wss = new WebSocket.Server({ port: 0 }, () => {
            const port = wss.address().port;

            server.once('upgrade', (req, socket) => {
              socket.end(
                'HTTP/1.1 302 Found\r\n' +
                  `Location: ws://localhost:${port}/\r\n\r\n`
              );
            });

            const ws = new WebSocket(
              `ws://localhost:${server.address().port}`,
              { followRedirects: true, headers }
            );

            const firstRequest = ws._req;

            assert.strictEqual(
              firstRequest.getHeader('Authorization'),
              headers.authorization
            );
            assert.strictEqual(
              firstRequest.getHeader('Cookie'),
              headers.cookie
            );
            assert.strictEqual(firstRequest.getHeader('Host'), headers.host);

            ws.on('redirect', (url, req) => {
              assert.strictEqual(ws._redirects, 1);
              assert.strictEqual(url, `ws://localhost:${port}/`);
              assert.notStrictEqual(firstRequest, req);
              assert.strictEqual(
                req.getHeader('Authorization'),
                headers.authorization
              );
              assert.strictEqual(req.getHeader('Cookie'), headers.cookie);
              assert.strictEqual(req.getHeader('Host'), headers.host);

              ws.on('close', (code) => {
                assert.strictEqual(code, 1005);
                wss.close(done);
              });
            });
          });

          wss.on('connection', (ws, req) => {
            assert.strictEqual(
              req.headers.authorization,
              headers.authorization
            );
            assert.strictEqual(req.headers.cookie, headers.cookie);
            assert.strictEqual(req.headers.host, headers.host);
            ws.close();
          });
        });
      });
    });

    describe("In a listener of the 'redirect' event", () => {
      it('allows to abort the request without swallowing errors', (done) => {
        server.once('upgrade', (req, socket) => {
          socket.end('HTTP/1.1 302 Found\r\nLocation: /foo\r\n\r\n');
        });

        const port = server.address().port;
        const ws = new WebSocket(`ws://localhost:${port}`, {
          followRedirects: true
        });

        ws.on('redirect', (url, req) => {
          assert.strictEqual(ws._redirects, 1);
          assert.strictEqual(url, `ws://localhost:${port}/foo`);

          req.on('socket', () => {
            req.abort();
          });

          ws.on('error', (err) => {
            assert.ok(err instanceof Error);
            assert.strictEqual(err.message, 'socket hang up');

            ws.on('close', (code) => {
              assert.strictEqual(code, 1006);
              done();
            });
          });
        });
      });

      it('allows to remove headers', (done) => {
        const wss = new WebSocket.Server({ port: 0 }, () => {
          const port = wss.address().port;

          server.once('upgrade', (req, socket) => {
            socket.end(
              'HTTP/1.1 302 Found\r\n' +
                `Location: ws://localhost:${port}/\r\n\r\n`
            );
          });

          const headers = {
            authorization: 'Basic Zm9vOmJhcg==',
            cookie: 'foo=bar'
          };

          const ws = new WebSocket(`ws://localhost:${server.address().port}`, {
            followRedirects: true,
            headers
          });

          ws.on('redirect', (url, req) => {
            assert.strictEqual(ws._redirects, 1);
            assert.strictEqual(url, `ws://localhost:${port}/`);
            assert.strictEqual(
              req.getHeader('Authorization'),
              headers.authorization
            );
            assert.strictEqual(req.getHeader('Cookie'), headers.cookie);

            req.removeHeader('authorization');
            req.removeHeader('cookie');

            ws.on('close', (code) => {
              assert.strictEqual(code, 1005);
              wss.close(done);
            });
          });
        });

        wss.on('connection', (ws, req) => {
          assert.strictEqual(req.headers.authorization, undefined);
          assert.strictEqual(req.headers.cookie, undefined);
          ws.close();
        });
      });
    });
  });

  describe('#pause', () => {
    it('does nothing if `readyState` is `CONNECTING` or `CLOSED`', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        assert.strictEqual(ws.readyState, WebSocket.CONNECTING);
        assert.ok(!ws.isPaused);

        ws.pause();
        assert.ok(!ws.isPaused);

        ws.on('open', () => {
          ws.on('close', () => {
            assert.strictEqual(ws.readyState, WebSocket.CLOSED);

            ws.pause();
            assert.ok(!ws.isPaused);

            wss.close(done);
          });

          ws.close();
        });
      });
    });

    it('pauses the socket', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
      });

      wss.on('connection', (ws) => {
        assert.ok(!ws.isPaused);
        assert.ok(!ws._socket.isPaused());

        ws.pause();
        assert.ok(ws.isPaused);
        assert.ok(ws._socket.isPaused());

        ws.terminate();
        wss.close(done);
      });
    });
  });

  describe('#ping', () => {
    it('throws an error if `readyState` is `CONNECTING`', () => {
      const ws = new WebSocket('ws://localhost', {
        lookup() {}
      });

      assert.throws(
        () => ws.ping(),
        /^Error: WebSocket is not open: readyState 0 \(CONNECTING\)$/
      );

      assert.throws(
        () => ws.ping(NOOP),
        /^Error: WebSocket is not open: readyState 0 \(CONNECTING\)$/
      );
    });

    it('increases `bufferedAmount` if `readyState` is 2 or 3', (done) => {
      const ws = new WebSocket('ws://localhost', {
        lookup() {}
      });

      ws.on('error', (err) => {
        assert.ok(err instanceof Error);
        assert.strictEqual(
          err.message,
          'WebSocket was closed before the connection was established'
        );

        assert.strictEqual(ws.readyState, WebSocket.CLOSING);
        assert.strictEqual(ws.bufferedAmount, 0);

        ws.ping('hi');
        assert.strictEqual(ws.bufferedAmount, 2);

        ws.ping();
        assert.strictEqual(ws.bufferedAmount, 2);

        ws.on('close', () => {
          assert.strictEqual(ws.readyState, WebSocket.CLOSED);

          ws.ping('hi');
          assert.strictEqual(ws.bufferedAmount, 4);

          ws.ping();
          assert.strictEqual(ws.bufferedAmount, 4);

          if (hasBlob) {
            ws.ping(new Blob(['hi']));
            assert.strictEqual(ws.bufferedAmount, 6);
          }

          done();
        });
      });

      ws.close();
    });

    it('calls the callback w/ an error if `readyState` is 2 or 3', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
      });

      wss.on('connection', (ws) => {
        ws.close();

        assert.strictEqual(ws.bufferedAmount, 0);

        ws.ping('hi', (err) => {
          assert.ok(err instanceof Error);
          assert.strictEqual(
            err.message,
            'WebSocket is not open: readyState 2 (CLOSING)'
          );
          assert.strictEqual(ws.bufferedAmount, 2);

          ws.on('close', () => {
            ws.ping((err) => {
              assert.ok(err instanceof Error);
              assert.strictEqual(
                err.message,
                'WebSocket is not open: readyState 3 (CLOSED)'
              );
              assert.strictEqual(ws.bufferedAmount, 2);

              wss.close(done);
            });
          });
        });
      });
    });

    it('can send a ping with no data', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => {
          ws.ping(() => {
            ws.ping();
            ws.close();
          });
        });
      });

      wss.on('connection', (ws) => {
        let pings = 0;
        ws.on('ping', (data) => {
          assert.ok(Buffer.isBuffer(data));
          assert.strictEqual(data.length, 0);
          if (++pings === 2) wss.close(done);
        });
      });
    });

    it('can send a ping with data', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => {
          ws.ping('hi', () => {
            ws.ping('hi', true);
            ws.close();
          });
        });
      });

      wss.on('connection', (ws) => {
        let pings = 0;
        ws.on('ping', (message) => {
          assert.strictEqual(message.toString(), 'hi');
          if (++pings === 2) wss.close(done);
        });
      });
    });

    it('can send numbers as ping payload', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => {
          ws.ping(0);
          ws.close();
        });
      });

      wss.on('connection', (ws) => {
        ws.on('ping', (message) => {
          assert.strictEqual(message.toString(), '0');
          wss.close(done);
        });
      });
    });

    it('throws an error if the data size is greater than 125 bytes', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => {
          assert.throws(
            () => ws.ping(Buffer.alloc(126)),
            /^RangeError: The data size must not be greater than 125 bytes$/
          );

          wss.close(done);
        });
      });

      wss.on('connection', (ws) => {
        ws.close();
      });
    });
  });

  describe('#pong', () => {
    it('throws an error if `readyState` is `CONNECTING`', () => {
      const ws = new WebSocket('ws://localhost', {
        lookup() {}
      });

      assert.throws(
        () => ws.pong(),
        /^Error: WebSocket is not open: readyState 0 \(CONNECTING\)$/
      );

      assert.throws(
        () => ws.pong(NOOP),
        /^Error: WebSocket is not open: readyState 0 \(CONNECTING\)$/
      );
    });

    it('increases `bufferedAmount` if `readyState` is 2 or 3', (done) => {
      const ws = new WebSocket('ws://localhost', {
        lookup() {}
      });

      ws.on('error', (err) => {
        assert.ok(err instanceof Error);
        assert.strictEqual(
          err.message,
          'WebSocket was closed before the connection was established'
        );

        assert.strictEqual(ws.readyState, WebSocket.CLOSING);
        assert.strictEqual(ws.bufferedAmount, 0);

        ws.pong('hi');
        assert.strictEqual(ws.bufferedAmount, 2);

        ws.pong();
        assert.strictEqual(ws.bufferedAmount, 2);

        ws.on('close', () => {
          assert.strictEqual(ws.readyState, WebSocket.CLOSED);

          ws.pong('hi');
          assert.strictEqual(ws.bufferedAmount, 4);

          ws.pong();
          assert.strictEqual(ws.bufferedAmount, 4);

          if (hasBlob) {
            ws.pong(new Blob(['hi']));
            assert.strictEqual(ws.bufferedAmount, 6);
          }

          done();
        });
      });

      ws.close();
    });

    it('calls the callback w/ an error if `readyState` is 2 or 3', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
      });

      wss.on('connection', (ws) => {
        ws.close();

        assert.strictEqual(ws.bufferedAmount, 0);

        ws.pong('hi', (err) => {
          assert.ok(err instanceof Error);
          assert.strictEqual(
            err.message,
            'WebSocket is not open: readyState 2 (CLOSING)'
          );
          assert.strictEqual(ws.bufferedAmount, 2);

          ws.on('close', () => {
            ws.pong((err) => {
              assert.ok(err instanceof Error);
              assert.strictEqual(
                err.message,
                'WebSocket is not open: readyState 3 (CLOSED)'
              );
              assert.strictEqual(ws.bufferedAmount, 2);

              wss.close(done);
            });
          });
        });
      });
    });

    it('can send a pong with no data', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => {
          ws.pong(() => {
            ws.pong();
            ws.close();
          });
        });
      });

      wss.on('connection', (ws) => {
        let pongs = 0;
        ws.on('pong', (data) => {
          assert.ok(Buffer.isBuffer(data));
          assert.strictEqual(data.length, 0);
          if (++pongs === 2) wss.close(done);
        });
      });
    });

    it('can send a pong with data', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => {
          ws.pong('hi', () => {
            ws.pong('hi', true);
            ws.close();
          });
        });
      });

      wss.on('connection', (ws) => {
        let pongs = 0;
        ws.on('pong', (message) => {
          assert.strictEqual(message.toString(), 'hi');
          if (++pongs === 2) wss.close(done);
        });
      });
    });

    it('can send numbers as pong payload', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => {
          ws.pong(0);
          ws.close();
        });
      });

      wss.on('connection', (ws) => {
        ws.on('pong', (message) => {
          assert.strictEqual(message.toString(), '0');
          wss.close(done);
        });
      });
    });

    it('throws an error if the data size is greater than 125 bytes', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => {
          assert.throws(
            () => ws.pong(Buffer.alloc(126)),
            /^RangeError: The data size must not be greater than 125 bytes$/
          );

          wss.close(done);
        });
      });

      wss.on('connection', (ws) => {
        ws.close();
      });
    });

    it('is called automatically when a ping is received', (done) => {
      const buf = Buffer.from('hi');
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => {
          ws.ping(buf);
        });

        ws.on('pong', (data) => {
          assert.deepStrictEqual(data, buf);
          wss.close(done);
        });
      });

      wss.on('connection', (ws) => {
        ws.on('ping', (data) => {
          assert.deepStrictEqual(data, buf);
          ws.close();
        });
      });
    });
  });

  describe('#resume', () => {
    it('does nothing if `readyState` is `CONNECTING` or `CLOSED`', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        assert.strictEqual(ws.readyState, WebSocket.CONNECTING);
        assert.ok(!ws.isPaused);

        // Verify that no exception is thrown.
        ws.resume();

        ws.on('open', () => {
          ws.pause();
          assert.ok(ws.isPaused);

          ws.on('close', () => {
            assert.strictEqual(ws.readyState, WebSocket.CLOSED);

            ws.resume();
            assert.ok(ws.isPaused);

            wss.close(done);
          });

          ws.terminate();
        });
      });
    });

    it('resumes the socket', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
      });

      wss.on('connection', (ws) => {
        assert.ok(!ws.isPaused);
        assert.ok(!ws._socket.isPaused());

        ws.pause();
        assert.ok(ws.isPaused);
        assert.ok(ws._socket.isPaused());

        ws.resume();
        assert.ok(!ws.isPaused);
        assert.ok(!ws._socket.isPaused());

        ws.close();
        wss.close(done);
      });
    });
  });

  describe('#send', () => {
    it('throws an error if `readyState` is `CONNECTING`', () => {
      const ws = new WebSocket('ws://localhost', {
        lookup() {}
      });

      assert.throws(
        () => ws.send('hi'),
        /^Error: WebSocket is not open: readyState 0 \(CONNECTING\)$/
      );

      assert.throws(
        () => ws.send('hi', NOOP),
        /^Error: WebSocket is not open: readyState 0 \(CONNECTING\)$/
      );
    });

    it('increases `bufferedAmount` if `readyState` is 2 or 3', (done) => {
      const ws = new WebSocket('ws://localhost', {
        lookup() {}
      });

      ws.on('error', (err) => {
        assert.ok(err instanceof Error);
        assert.strictEqual(
          err.message,
          'WebSocket was closed before the connection was established'
        );

        assert.strictEqual(ws.readyState, WebSocket.CLOSING);
        assert.strictEqual(ws.bufferedAmount, 0);

        ws.send('hi');
        assert.strictEqual(ws.bufferedAmount, 2);

        ws.send();
        assert.strictEqual(ws.bufferedAmount, 2);

        ws.on('close', () => {
          assert.strictEqual(ws.readyState, WebSocket.CLOSED);

          ws.send('hi');
          assert.strictEqual(ws.bufferedAmount, 4);

          ws.send();
          assert.strictEqual(ws.bufferedAmount, 4);

          if (hasBlob) {
            ws.send(new Blob(['hi']));
            assert.strictEqual(ws.bufferedAmount, 6);
          }

          done();
        });
      });

      ws.close();
    });

    it('calls the callback w/ an error if `readyState` is 2 or 3', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
      });

      wss.on('connection', (ws) => {
        ws.close();

        assert.strictEqual(ws.bufferedAmount, 0);

        ws.send('hi', (err) => {
          assert.ok(err instanceof Error);
          assert.strictEqual(
            err.message,
            'WebSocket is not open: readyState 2 (CLOSING)'
          );
          assert.strictEqual(ws.bufferedAmount, 2);

          ws.on('close', () => {
            ws.send('hi', (err) => {
              assert.ok(err instanceof Error);
              assert.strictEqual(
                err.message,
                'WebSocket is not open: readyState 3 (CLOSED)'
              );
              assert.strictEqual(ws.bufferedAmount, 4);

              wss.close(done);
            });
          });
        });
      });
    });

    it('can send a big binary message', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const array = new Float32Array(1024 * 1024);

        for (let i = 0; i < array.length; i++) {
          array[i] = i / 5;
        }

        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => ws.send(array));
        ws.on('message', (msg, isBinary) => {
          assert.deepStrictEqual(msg, Buffer.from(array.buffer));
          assert.ok(isBinary);
          wss.close(done);
        });
      });

      wss.on('connection', (ws) => {
        ws.on('message', (msg, isBinary) => {
          assert.ok(isBinary);
          ws.send(msg);
          ws.close();
        });
      });
    });

    it('can send text data', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => ws.send('hi'));
        ws.on('message', (message, isBinary) => {
          assert.deepStrictEqual(message, Buffer.from('hi'));
          assert.ok(!isBinary);
          wss.close(done);
        });
      });

      wss.on('connection', (ws) => {
        ws.on('message', (msg, isBinary) => {
          ws.send(msg, { binary: isBinary });
          ws.close();
        });
      });
    });

    it('does not override the `fin` option', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => {
          ws.send('fragment', { fin: false });
          ws.send('fragment', { fin: true });
          ws.close();
        });
      });

      wss.on('connection', (ws) => {
        ws.on('message', (msg, isBinary) => {
          assert.deepStrictEqual(msg, Buffer.from('fragmentfragment'));
          assert.ok(!isBinary);
          wss.close(done);
        });
      });
    });

    it('sends numbers as strings', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => {
          ws.send(0);
          ws.close();
        });
      });

      wss.on('connection', (ws) => {
        ws.on('message', (msg, isBinary) => {
          assert.deepStrictEqual(msg, Buffer.from('0'));
          assert.ok(!isBinary);
          wss.close(done);
        });
      });
    });

    it('can send a `TypedArray`', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const array = new Float32Array(6);

        for (let i = 0; i < array.length; ++i) {
          array[i] = i / 2;
        }

        const partial = array.subarray(2, 5);
        const buf = Buffer.from(
          partial.buffer,
          partial.byteOffset,
          partial.byteLength
        );

        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => {
          ws.send(partial);
          ws.close();
        });

        ws.on('message', (message, isBinary) => {
          assert.deepStrictEqual(message, buf);
          assert.ok(isBinary);
          wss.close(done);
        });
      });

      wss.on('connection', (ws) => {
        ws.on('message', (msg, isBinary) => {
          assert.ok(isBinary);
          ws.send(msg);
        });
      });
    });

    it('can send an `ArrayBuffer`', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const array = new Float32Array(5);

        for (let i = 0; i < array.length; ++i) {
          array[i] = i / 2;
        }

        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => {
          ws.send(array.buffer);
          ws.close();
        });

        ws.onmessage = (event) => {
          assert.ok(event.data.equals(Buffer.from(array.buffer)));
          wss.close(done);
        };
      });

      wss.on('connection', (ws) => {
        ws.on('message', (msg, isBinary) => {
          assert.ok(isBinary);
          ws.send(msg);
        });
      });
    });

    it('can send a `Buffer`', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const buf = Buffer.from('foobar');
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => {
          ws.send(buf);
          ws.close();
        });

        ws.onmessage = (event) => {
          assert.deepStrictEqual(event.data, buf);
          wss.close(done);
        };
      });

      wss.on('connection', (ws) => {
        ws.on('message', (msg, isBinary) => {
          assert.ok(isBinary);
          ws.send(msg);
        });
      });
    });

    it('can send a `Blob`', function (done) {
      if (!hasBlob) return this.skip();

      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        const messages = [];

        ws.on('open', () => {
          ws.send(new Blob(['foo']));
          ws.send(new Blob(['bar']));
          ws.close();
        });

        ws.on('message', (message, isBinary) => {
          assert.ok(isBinary);
          messages.push(message.toString());

          if (messages.length === 2) {
            assert.deepStrictEqual(messages, ['foo', 'bar']);
            wss.close(done);
          }
        });
      });

      wss.on('connection', (ws) => {
        ws.on('message', (message, isBinary) => {
          assert.ok(isBinary);
          ws.send(message);
        });
      });
    });

    it('calls the callback when data is written out', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => {
          ws.send('hi', (err) => {
            assert.ifError(err);
            wss.close(done);
          });
        });
      });

      wss.on('connection', (ws) => {
        ws.close();
      });
    });

    it('calls the callback if the socket is forcibly closed', function (done) {
      if (!hasBlob) return this.skip();

      const called = [];
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => {
          ws.send(new Blob(['foo']), (err) => {
            called.push(1);

            assert.strictEqual(ws.readyState, WebSocket.CLOSING);
            assert.ok(err instanceof Error);
            assert.strictEqual(
              err.message,
              'The socket was closed while the blob was being read'
            );
          });
          ws.send('bar');
          ws.send('baz', (err) => {
            called.push(2);

            assert.strictEqual(ws.readyState, WebSocket.CLOSING);
            assert.ok(err instanceof Error);
            assert.strictEqual(
              err.message,
              'The socket was closed while the blob was being read'
            );
          });

          ws.terminate();
        });
      });

      wss.on('connection', (ws) => {
        ws.on('close', () => {
          assert.deepStrictEqual(called, [1, 2]);
          wss.close(done);
        });
      });
    });

    it('works when the `data` argument is falsy', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => {
          ws.send();
          ws.close();
        });
      });

      wss.on('connection', (ws) => {
        ws.on('message', (message, isBinary) => {
          assert.strictEqual(message, EMPTY_BUFFER);
          assert.ok(isBinary);
          wss.close(done);
        });
      });
    });

    it('honors the `mask` option', (done) => {
      let clientCloseEventEmitted = false;
      let serverClientCloseEventEmitted = false;

      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => ws.send('hi', { mask: false }));
        ws.on('close', (code, reason) => {
          assert.strictEqual(code, 1002);
          assert.deepStrictEqual(reason, EMPTY_BUFFER);

          clientCloseEventEmitted = true;
          if (serverClientCloseEventEmitted) wss.close(done);
        });
      });

      wss.on('connection', (ws) => {
        const chunks = [];

        ws._socket.prependListener('data', (chunk) => {
          chunks.push(chunk);
        });

        ws.on('error', (err) => {
          assert.ok(err instanceof RangeError);
          assert.strictEqual(
            err.message,
            'Invalid WebSocket frame: MASK must be set'
          );
          assert.ok(
            Buffer.concat(chunks).slice(0, 2).equals(Buffer.from('8102', 'hex'))
          );

          ws.on('close', (code, reason) => {
            assert.strictEqual(code, 1006);
            assert.strictEqual(reason, EMPTY_BUFFER);

            serverClientCloseEventEmitted = true;
            if (clientCloseEventEmitted) wss.close(done);
          });
        });
      });
    });
  });

  describe('#close', () => {
    it('closes the connection if called while connecting (1/3)', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => done(new Error("Unexpected 'open' event")));
        ws.on('error', (err) => {
          assert.ok(err instanceof Error);
          assert.strictEqual(
            err.message,
            'WebSocket was closed before the connection was established'
          );
          ws.on('close', () => wss.close(done));
        });
        ws.close(1001);
      });
    });

    it('closes the connection if called while connecting (2/3)', (done) => {
      const wss = new WebSocket.Server(
        {
          verifyClient: (info, cb) => setTimeout(cb, 300, true),
          port: 0
        },
        () => {
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

          ws.on('open', () => done(new Error("Unexpected 'open' event")));
          ws.on('error', (err) => {
            assert.ok(err instanceof Error);
            assert.strictEqual(
              err.message,
              'WebSocket was closed before the connection was established'
            );
            ws.on('close', () => wss.close(done));
          });
          setTimeout(() => ws.close(1001), 150);
        }
      );
    });

    it('closes the connection if called while connecting (3/3)', (done) => {
      const server = http.createServer();

      server.listen(0, () => {
        const ws = new WebSocket(`ws://localhost:${server.address().port}`);

        ws.on('open', () => done(new Error("Unexpected 'open' event")));
        ws.on('error', (err) => {
          assert.ok(err instanceof Error);
          assert.strictEqual(
            err.message,
            'WebSocket was closed before the connection was established'
          );
          ws.on('close', () => {
            server.close(done);
          });
        });

        ws.on('unexpected-response', (req, res) => {
          assert.strictEqual(res.statusCode, 502);

          const chunks = [];

          res.on('data', (chunk) => {
            chunks.push(chunk);
          });

          res.on('end', () => {
            assert.strictEqual(Buffer.concat(chunks).toString(), 'foo');
            ws.close();
          });
        });
      });

      server.on('upgrade', (req, socket) => {
        socket.on('end', socket.end);

        socket.write(
          `HTTP/1.1 502 ${http.STATUS_CODES[502]}\r\n` +
            'Connection: keep-alive\r\n' +
            'Content-type: text/html\r\n' +
            'Content-Length: 3\r\n' +
            '\r\n' +
            'foo'
        );
      });
    });

    it('can be called from an error listener while connecting', (done) => {
      const server = net.createServer();

      server.on('connection', (socket) => {
        socket.on('end', socket.end);
        socket.resume();
        socket.write(Buffer.from('foo\r\n'));
      });

      server.listen(0, () => {
        const ws = new WebSocket(`ws://localhost:${server.address().port}`);

        ws.on('open', () => done(new Error("Unexpected 'open' event")));
        ws.on('error', (err) => {
          assert.ok(err instanceof Error);
          assert.strictEqual(err.code, 'HPE_INVALID_CONSTANT');
          ws.close();
          ws.on('close', () => {
            server.close(done);
          });
        });
      });
    });

    it("can be called from a listener of the 'redirect' event", (done) => {
      const server = http.createServer();

      server.once('upgrade', (req, socket) => {
        socket.end('HTTP/1.1 302 Found\r\nLocation: /foo\r\n\r\n');
      });

      server.listen(() => {
        const port = server.address().port;
        const ws = new WebSocket(`ws://localhost:${port}`, {
          followRedirects: true
        });

        ws.on('open', () => {
          done(new Error("Unexpected 'open' event"));
        });

        ws.on('error', (err) => {
          assert.ok(err instanceof Error);
          assert.strictEqual(
            err.message,
            'WebSocket was closed before the connection was established'
          );

          ws.on('close', (code) => {
            assert.strictEqual(code, 1006);
            server.close(done);
          });
        });

        ws.on('redirect', () => {
          ws.close();
        });
      });
    });

    it("can be called from a listener of the 'upgrade' event", (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => done(new Error("Unexpected 'open' event")));
        ws.on('error', (err) => {
          assert.ok(err instanceof Error);
          assert.strictEqual(
            err.message,
            'WebSocket was closed before the connection was established'
          );
          ws.on('close', () => wss.close(done));
        });
        ws.on('upgrade', () => ws.close());
      });
    });

    it('sends the close status code only when necessary', (done) => {
      let sent;
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => {
          ws._socket.once('data', (data) => {
            sent = data;
          });
        });
      });

      wss.on('connection', (ws) => {
        ws._socket.once('data', (received) => {
          assert.deepStrictEqual(
            received.slice(0, 2),
            Buffer.from([0x88, 0x80])
          );
          assert.deepStrictEqual(sent, Buffer.from([0x88, 0x00]));

          ws.on('close', (code, reason) => {
            assert.strictEqual(code, 1005);
            assert.strictEqual(reason, EMPTY_BUFFER);
            wss.close(done);
          });
        });
        ws.close();
      });
    });

    it('works when close reason is not specified', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => ws.close(1000));
      });

      wss.on('connection', (ws) => {
        ws.on('close', (code, message) => {
          assert.strictEqual(code, 1000);
          assert.deepStrictEqual(message, EMPTY_BUFFER);
          wss.close(done);
        });
      });
    });

    it('works when close reason is specified', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => ws.close(1000, 'some reason'));
      });

      wss.on('connection', (ws) => {
        ws.on('close', (code, message) => {
          assert.strictEqual(code, 1000);
          assert.deepStrictEqual(message, Buffer.from('some reason'));
          wss.close(done);
        });
      });
    });

    it('permits all buffered data to be delivered', (done) => {
      const wss = new WebSocket.Server(
        {
          perMessageDeflate: { threshold: 0 },
          port: 0
        },
        () => {
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
          const messages = [];

          ws.on('message', (message, isBinary) => {
            assert.ok(!isBinary);
            messages.push(message.toString());
          });
          ws.on('close', (code) => {
            assert.strictEqual(code, 1005);
            assert.deepStrictEqual(messages, ['foo', 'bar', 'baz']);
            wss.close(done);
          });
        }
      );

      wss.on('connection', (ws) => {
        const callback = (err) => assert.ifError(err);

        ws.send('foo', callback);
        ws.send('bar', callback);
        ws.send('baz', callback);
        ws.close();
        ws.close();
      });
    });

    it('allows close code 1013', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('close', (code) => {
          assert.strictEqual(code, 1013);
          wss.close(done);
        });
      });

      wss.on('connection', (ws) => ws.close(1013));
    });

    it('allows close code 1014', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('close', (code) => {
          assert.strictEqual(code, 1014);
          wss.close(done);
        });
      });

      wss.on('connection', (ws) => ws.close(1014));
    });

    it('does nothing if `readyState` is `CLOSED`', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('close', (code) => {
          assert.strictEqual(code, 1005);
          assert.strictEqual(ws.readyState, WebSocket.CLOSED);
          ws.close();
          wss.close(done);
        });
      });

      wss.on('connection', (ws) => ws.close());
    });

    it('sets a timer for the closing handshake to complete', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('close', (code, reason) => {
          assert.strictEqual(code, 1000);
          assert.deepStrictEqual(reason, Buffer.from('some reason'));
          wss.close(done);
        });

        ws.on('open', () => {
          let callbackCalled = false;

          assert.strictEqual(ws._closeTimer, null);

          ws.send('foo', () => {
            callbackCalled = true;
          });

          ws.close(1000, 'some reason');

          //
          // Check that the close timer is set even if the `Sender.close()`
          // callback is not called.
          //
          assert.strictEqual(callbackCalled, false);
          assert.strictEqual(ws._closeTimer._idleTimeout, 30000);
        });
      });
    });
  });

  describe('#terminate', () => {
    it('closes the connection if called while connecting (1/2)', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => done(new Error("Unexpected 'open' event")));
        ws.on('error', (err) => {
          assert.ok(err instanceof Error);
          assert.strictEqual(
            err.message,
            'WebSocket was closed before the connection was established'
          );
          ws.on('close', () => wss.close(done));
        });
        ws.terminate();
      });
    });

    it('closes the connection if called while connecting (2/2)', (done) => {
      const wss = new WebSocket.Server(
        {
          verifyClient: (info, cb) => setTimeout(cb, 300, true),
          port: 0
        },
        () => {
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

          ws.on('open', () => done(new Error("Unexpected 'open' event")));
          ws.on('error', (err) => {
            assert.ok(err instanceof Error);
            assert.strictEqual(
              err.message,
              'WebSocket was closed before the connection was established'
            );
            ws.on('close', () => wss.close(done));
          });
          setTimeout(() => ws.terminate(), 150);
        }
      );
    });

    it('can be called from an error listener while connecting', (done) => {
      const server = net.createServer();

      server.on('connection', (socket) => {
        socket.on('end', socket.end);
        socket.resume();
        socket.write(Buffer.from('foo\r\n'));
      });

      server.listen(0, () => {
        const ws = new WebSocket(`ws://localhost:${server.address().port}`);

        ws.on('open', () => done(new Error("Unexpected 'open' event")));
        ws.on('error', (err) => {
          assert.ok(err instanceof Error);
          assert.strictEqual(err.code, 'HPE_INVALID_CONSTANT');
          ws.terminate();
          ws.on('close', () => {
            server.close(done);
          });
        });
      });
    });

    it("can be called from a listener of the 'redirect' event", (done) => {
      const server = http.createServer();

      server.once('upgrade', (req, socket) => {
        socket.end('HTTP/1.1 302 Found\r\nLocation: /foo\r\n\r\n');
      });

      server.listen(() => {
        const port = server.address().port;
        const ws = new WebSocket(`ws://localhost:${port}`, {
          followRedirects: true
        });

        ws.on('open', () => {
          done(new Error("Unexpected 'open' event"));
        });

        ws.on('error', (err) => {
          assert.ok(err instanceof Error);
          assert.strictEqual(
            err.message,
            'WebSocket was closed before the connection was established'
          );

          ws.on('close', (code) => {
            assert.strictEqual(code, 1006);
            server.close(done);
          });
        });

        ws.on('redirect', () => {
          ws.terminate();
        });
      });
    });

    it("can be called from a listener of the 'upgrade' event", (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('open', () => done(new Error("Unexpected 'open' event")));
        ws.on('error', (err) => {
          assert.ok(err instanceof Error);
          assert.strictEqual(
            err.message,
            'WebSocket was closed before the connection was established'
          );
          ws.on('close', () => wss.close(done));
        });
        ws.on('upgrade', () => ws.terminate());
      });
    });

    it('does nothing if `readyState` is `CLOSED`', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('close', (code) => {
          assert.strictEqual(code, 1006);
          assert.strictEqual(ws.readyState, WebSocket.CLOSED);
          ws.terminate();
          wss.close(done);
        });
      });

      wss.on('connection', (ws) => ws.terminate());
    });
  });

  describe('WHATWG API emulation', () => {
    it('supports the `on{close,error,message,open}` attributes', () => {
      for (const property of ['onclose', 'onerror', 'onmessage', 'onopen']) {
        const descriptor = Object.getOwnPropertyDescriptor(
          WebSocket.prototype,
          property
        );

        assert.strictEqual(descriptor.configurable, true);
        assert.strictEqual(descriptor.enumerable, true);
        assert.ok(descriptor.get !== undefined);
        assert.ok(descriptor.set !== undefined);
      }

      const ws = new WebSocket('ws://localhost', { agent: new CustomAgent() });

      assert.strictEqual(ws.onmessage, null);
      assert.strictEqual(ws.onclose, null);
      assert.strictEqual(ws.onerror, null);
      assert.strictEqual(ws.onopen, null);

      ws.onmessage = NOOP;
      ws.onerror = NOOP;
      ws.onclose = NOOP;
      ws.onopen = NOOP;

      assert.strictEqual(ws.onmessage, NOOP);
      assert.strictEqual(ws.onclose, NOOP);
      assert.strictEqual(ws.onerror, NOOP);
      assert.strictEqual(ws.onopen, NOOP);

      ws.onmessage = 'foo';

      assert.strictEqual(ws.onmessage, null);
      assert.strictEqual(ws.listenerCount('message'), 0);
    });

    it('works like the `EventEmitter` interface', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.onmessage = (messageEvent) => {
          assert.strictEqual(messageEvent.data, 'foo');
          ws.onclose = (closeEvent) => {
            assert.strictEqual(closeEvent.wasClean, true);
            assert.strictEqual(closeEvent.code, 1005);
            assert.strictEqual(closeEvent.reason, '');
            wss.close(done);
          };
          ws.close();
        };

        ws.onopen = () => ws.send('foo');
      });

      wss.on('connection', (ws) => {
        ws.on('message', (msg, isBinary) => {
          ws.send(msg, { binary: isBinary });
        });
      });
    });

    it("doesn't return listeners added with `on`", () => {
      const ws = new WebSocket('ws://localhost', { agent: new CustomAgent() });

      ws.on('open', NOOP);

      assert.deepStrictEqual(ws.listeners('open'), [NOOP]);
      assert.strictEqual(ws.onopen, null);
    });

    it("doesn't remove listeners added with `on`", () => {
      const ws = new WebSocket('ws://localhost', { agent: new CustomAgent() });

      ws.on('close', NOOP);
      ws.onclose = NOOP;

      let listeners = ws.listeners('close');

      assert.strictEqual(listeners.length, 2);
      assert.strictEqual(listeners[0], NOOP);
      assert.strictEqual(listeners[1][kListener], NOOP);

      ws.onclose = NOOP;

      listeners = ws.listeners('close');

      assert.strictEqual(listeners.length, 2);
      assert.strictEqual(listeners[0], NOOP);
      assert.strictEqual(listeners[1][kListener], NOOP);
    });

    it('supports the `addEventListener` method', () => {
      const events = [];
      const ws = new WebSocket('ws://localhost', { agent: new CustomAgent() });

      ws.addEventListener('foo', () => {});
      assert.strictEqual(ws.listenerCount('foo'), 0);

      function onOpen() {
        events.push('open');
        assert.strictEqual(ws.listenerCount('open'), 1);
      }

      ws.addEventListener('open', onOpen);
      ws.addEventListener('open', onOpen);

      assert.strictEqual(ws.listenerCount('open'), 1);

      const listener = {
        handleEvent() {
          events.push('message');
          assert.strictEqual(this, listener);
          assert.strictEqual(ws.listenerCount('message'), 0);
        }
      };

      ws.addEventListener('message', listener, { once: true });
      ws.addEventListener('message', listener);

      assert.strictEqual(ws.listenerCount('message'), 1);

      ws.addEventListener('close', NOOP);
      ws.onclose = NOOP;

      let listeners = ws.listeners('close');

      assert.strictEqual(listeners.length, 2);
      assert.strictEqual(listeners[0][kListener], NOOP);
      assert.strictEqual(listeners[1][kListener], NOOP);

      ws.onerror = NOOP;
      ws.addEventListener('error', NOOP);

      listeners = ws.listeners('error');

      assert.strictEqual(listeners.length, 2);
      assert.strictEqual(listeners[0][kListener], NOOP);
      assert.strictEqual(listeners[1][kListener], NOOP);

      ws.emit('open');
      ws.emit('message', EMPTY_BUFFER, false);

      assert.deepStrictEqual(events, ['open', 'message']);
    });

    it("doesn't return listeners added with `addEventListener`", () => {
      const ws = new WebSocket('ws://localhost', { agent: new CustomAgent() });

      ws.addEventListener('open', NOOP);

      const listeners = ws.listeners('open');

      assert.strictEqual(listeners.length, 1);
      assert.strictEqual(listeners[0][kListener], NOOP);

      assert.strictEqual(ws.onopen, null);
    });

    it("doesn't remove listeners added with `addEventListener`", () => {
      const ws = new WebSocket('ws://localhost', { agent: new CustomAgent() });

      ws.addEventListener('close', NOOP);
      ws.onclose = NOOP;

      let listeners = ws.listeners('close');

      assert.strictEqual(listeners.length, 2);
      assert.strictEqual(listeners[0][kListener], NOOP);
      assert.strictEqual(listeners[1][kListener], NOOP);

      ws.onclose = NOOP;

      listeners = ws.listeners('close');

      assert.strictEqual(listeners.length, 2);
      assert.strictEqual(listeners[0][kListener], NOOP);
      assert.strictEqual(listeners[1][kListener], NOOP);
    });

    it('supports the `removeEventListener` method', () => {
      const ws = new WebSocket('ws://localhost', { agent: new CustomAgent() });

      const listener = { handleEvent() {} };

      ws.addEventListener('message', listener);
      ws.addEventListener('open', NOOP);

      assert.strictEqual(ws.listeners('message')[0][kListener], listener);
      assert.strictEqual(ws.listeners('open')[0][kListener], NOOP);

      ws.removeEventListener('message', () => {});

      assert.strictEqual(ws.listeners('message')[0][kListener], listener);

      ws.removeEventListener('message', listener);
      ws.removeEventListener('open', NOOP);

      assert.strictEqual(ws.listenerCount('message'), 0);
      assert.strictEqual(ws.listenerCount('open'), 0);

      ws.addEventListener('message', NOOP, { once: true });
      ws.addEventListener('open', NOOP, { once: true });

      assert.strictEqual(ws.listeners('message')[0][kListener], NOOP);
      assert.strictEqual(ws.listeners('open')[0][kListener], NOOP);

      ws.removeEventListener('message', () => {});

      assert.strictEqual(ws.listeners('message')[0][kListener], NOOP);

      ws.removeEventListener('message', NOOP);
      ws.removeEventListener('open', NOOP);

      assert.strictEqual(ws.listenerCount('message'), 0);
      assert.strictEqual(ws.listenerCount('open'), 0);

      // Listeners not added with `websocket.addEventListener()`.
      ws.on('message', NOOP);

      assert.deepStrictEqual(ws.listeners('message'), [NOOP]);

      ws.removeEventListener('message', NOOP);

      assert.deepStrictEqual(ws.listeners('message'), [NOOP]);

      ws.onclose = NOOP;

      assert.strictEqual(ws.listeners('close')[0][kListener], NOOP);

      ws.removeEventListener('close', NOOP);

      assert.strictEqual(ws.listeners('close')[0][kListener], NOOP);
    });

    it('wraps text data in a `MessageEvent`', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.addEventListener('open', () => {
          ws.send('hi');
          ws.close();
        });

        ws.addEventListener('message', (event) => {
          assert.ok(event instanceof MessageEvent);
          assert.strictEqual(event.data, 'hi');
          wss.close(done);
        });
      });

      wss.on('connection', (ws) => {
        ws.on('message', (msg, isBinary) => {
          ws.send(msg, { binary: isBinary });
        });
      });
    });

    it('receives a `CloseEvent` when server closes (1000)', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.addEventListener('close', (event) => {
          assert.ok(event instanceof CloseEvent);
          assert.ok(event.wasClean);
          assert.strictEqual(event.reason, '');
          assert.strictEqual(event.code, 1000);
          wss.close(done);
        });
      });

      wss.on('connection', (ws) => ws.close(1000));
    });

    it('receives a `CloseEvent` when server closes (4000)', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.addEventListener('close', (event) => {
          assert.ok(event instanceof CloseEvent);
          assert.ok(event.wasClean);
          assert.strictEqual(event.reason, 'some daft reason');
          assert.strictEqual(event.code, 4000);
          wss.close(done);
        });
      });

      wss.on('connection', (ws) => ws.close(4000, 'some daft reason'));
    });

    it('sets `target` and `type` on events', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const err = new Error('forced');
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.addEventListener('open', (event) => {
          assert.ok(event instanceof Event);
          assert.strictEqual(event.type, 'open');
          assert.strictEqual(event.target, ws);
        });
        ws.addEventListener('message', (event) => {
          assert.ok(event instanceof MessageEvent);
          assert.strictEqual(event.type, 'message');
          assert.strictEqual(event.target, ws);
          ws.close();
        });
        ws.addEventListener('close', (event) => {
          assert.ok(event instanceof CloseEvent);
          assert.strictEqual(event.type, 'close');
          assert.strictEqual(event.target, ws);
          ws.emit('error', err);
        });
        ws.addEventListener('error', (event) => {
          assert.ok(event instanceof ErrorEvent);
          assert.strictEqual(event.message, 'forced');
          assert.strictEqual(event.type, 'error');
          assert.strictEqual(event.target, ws);
          assert.strictEqual(event.error, err);

          wss.close(done);
        });
      });

      wss.on('connection', (client) => client.send('hi'));
    });

    it('passes binary data as a Node.js `Buffer` by default', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.onmessage = (evt) => {
          assert.ok(Buffer.isBuffer(evt.data));
          wss.close(done);
        };
      });

      wss.on('connection', (ws) => {
        ws.send(new Uint8Array(4096));
        ws.close();
      });
    });

    it('ignores `binaryType` for text messages', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.binaryType = 'arraybuffer';

        ws.onmessage = (evt) => {
          assert.strictEqual(evt.data, 'foo');
          wss.close(done);
        };
      });

      wss.on('connection', (ws) => {
        ws.send('foo');
        ws.close();
      });
    });

    it('allows to update `binaryType` on the fly', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        function testType(binaryType, next) {
          const buf = Buffer.from(binaryType);
          ws.binaryType = binaryType;

          ws.onmessage = (evt) => {
            if (binaryType === 'nodebuffer') {
              assert.ok(Buffer.isBuffer(evt.data));
              assert.deepStrictEqual(evt.data, buf);
              next();
            } else if (binaryType === 'arraybuffer') {
              assert.ok(evt.data instanceof ArrayBuffer);
              assert.deepStrictEqual(Buffer.from(evt.data), buf);
              next();
            } else if (binaryType === 'fragments') {
              assert.deepStrictEqual(evt.data, [buf]);
              next();
            } else if (binaryType === 'blob') {
              assert.ok(evt.data instanceof Blob);
              evt.data
                .arrayBuffer()
                .then((arrayBuffer) => {
                  assert.deepStrictEqual(Buffer.from(arrayBuffer), buf);
                  next();
                })
                .catch(done);
            }
          };

          ws.send(buf);
        }

        function close() {
          ws.close();
          wss.close(done);
        }

        ws.onopen = () => {
          testType('nodebuffer', () => {
            testType('arraybuffer', () => {
              testType('fragments', () => {
                if (hasBlob) testType('blob', close);
                else close();
              });
            });
          });
        };
      });

      wss.on('connection', (ws) => {
        ws.on('message', (msg, isBinary) => {
          assert.ok(isBinary);
          ws.send(msg);
        });
      });
    });
  });

  describe('SSL', () => {
    it('connects to secure websocket server', (done) => {
      const server = https.createServer({
        cert: fs.readFileSync('test/fixtures/certificate.pem'),
        key: fs.readFileSync('test/fixtures/key.pem')
      });
      const wss = new WebSocket.Server({ server });

      wss.on('connection', () => {
        server.close(done);
      });

      server.listen(0, () => {
        const ws = new WebSocket(`wss://127.0.0.1:${server.address().port}`, {
          rejectUnauthorized: false
        });

        ws.on('open', ws.close);
      });
    });

    it('connects to secure websocket server with client side certificate', (done) => {
      const server = https.createServer({
        cert: fs.readFileSync('test/fixtures/certificate.pem'),
        ca: [fs.readFileSync('test/fixtures/ca-certificate.pem')],
        key: fs.readFileSync('test/fixtures/key.pem'),
        requestCert: true
      });

      const wss = new WebSocket.Server({ noServer: true });

      server.on('upgrade', (request, socket, head) => {
        assert.ok(socket.authorized);

        wss.handleUpgrade(request, socket, head, (ws) => {
          ws.on('close', (code) => {
            assert.strictEqual(code, 1005);
            server.close(done);
          });
        });
      });

      server.listen(0, () => {
        const ws = new WebSocket(`wss://localhost:${server.address().port}`, {
          cert: fs.readFileSync('test/fixtures/client-certificate.pem'),
          key: fs.readFileSync('test/fixtures/client-key.pem'),
          rejectUnauthorized: false
        });

        ws.on('open', ws.close);
      });
    });

    it('cannot connect to secure websocket server via ws://', (done) => {
      const server = https.createServer({
        cert: fs.readFileSync('test/fixtures/certificate.pem'),
        key: fs.readFileSync('test/fixtures/key.pem')
      });
      const wss = new WebSocket.Server({ server });

      server.listen(0, () => {
        const ws = new WebSocket(`ws://localhost:${server.address().port}`, {
          rejectUnauthorized: false
        });

        ws.on('error', () => {
          server.close(done);
          wss.close();
        });
      });
    });

    it('can send and receive text data', (done) => {
      const server = https.createServer({
        cert: fs.readFileSync('test/fixtures/certificate.pem'),
        key: fs.readFileSync('test/fixtures/key.pem')
      });
      const wss = new WebSocket.Server({ server });

      wss.on('connection', (ws) => {
        ws.on('message', (message, isBinary) => {
          assert.deepStrictEqual(message, Buffer.from('foobar'));
          assert.ok(!isBinary);
          server.close(done);
        });
      });

      server.listen(0, () => {
        const ws = new WebSocket(`wss://localhost:${server.address().port}`, {
          rejectUnauthorized: false
        });

        ws.on('open', () => {
          ws.send('foobar');
          ws.close();
        });
      });
    });

    it('can send a big binary message', (done) => {
      const buf = crypto.randomBytes(5 * 1024 * 1024);
      const server = https.createServer({
        cert: fs.readFileSync('test/fixtures/certificate.pem'),
        key: fs.readFileSync('test/fixtures/key.pem')
      });
      const wss = new WebSocket.Server({ server });

      wss.on('connection', (ws) => {
        ws.on('message', (message, isBinary) => {
          assert.ok(isBinary);
          ws.send(message);
          ws.close();
        });
      });

      server.listen(0, () => {
        const ws = new WebSocket(`wss://localhost:${server.address().port}`, {
          rejectUnauthorized: false
        });

        ws.on('open', () => ws.send(buf));
        ws.on('message', (message, isBinary) => {
          assert.deepStrictEqual(message, buf);
          assert.ok(isBinary);

          server.close(done);
        });
      });
    }).timeout(4000);

    it('allows to disable sending the SNI extension', (done) => {
      const original = tls.connect;

      tls.connect = (options) => {
        assert.strictEqual(options.servername, '');
        tls.connect = original;
        done();
      };

      const ws = new WebSocket('wss://127.0.0.1', { servername: '' });
    });

    it("works around a double 'error' event bug in Node.js", function (done) {
      //
      // The `minVersion` and `maxVersion` options are not supported in
      // Node.js < 10.16.0.
      //
      if (process.versions.modules < 64) return this.skip();

      //
      // The `'error'` event can be emitted multiple times by the
      // `http.ClientRequest` object in Node.js < 13. This test reproduces the
      // issue in Node.js 12.
      //
      const server = https.createServer({
        cert: fs.readFileSync('test/fixtures/certificate.pem'),
        key: fs.readFileSync('test/fixtures/key.pem'),
        minVersion: 'TLSv1.2'
      });
      const wss = new WebSocket.Server({ server });

      server.listen(0, () => {
        const ws = new WebSocket(`wss://localhost:${server.address().port}`, {
          maxVersion: 'TLSv1.1',
          rejectUnauthorized: false
        });

        ws.on('error', (err) => {
          assert.ok(err instanceof Error);
          server.close(done);
          wss.close();
        });
      });
    });
  });

  describe('Request headers', () => {
    it('adds the authorization header if the url has userinfo', (done) => {
      const agent = new http.Agent();
      const userinfo = 'test:testpass';

      agent.addRequest = (req) => {
        assert.strictEqual(
          req.getHeader('authorization'),
          `Basic ${Buffer.from(userinfo).toString('base64')}`
        );
        done();
      };

      const ws = new WebSocket(`ws://${userinfo}@localhost`, { agent });
    });

    it('honors the `auth` option', (done) => {
      const agent = new http.Agent();
      const auth = 'user:pass';

      agent.addRequest = (req) => {
        assert.strictEqual(
          req.getHeader('authorization'),
          `Basic ${Buffer.from(auth).toString('base64')}`
        );
        done();
      };

      const ws = new WebSocket('ws://localhost', { agent, auth });
    });

    it('favors the url userinfo over the `auth` option', (done) => {
      const agent = new http.Agent();
      const auth = 'foo:bar';
      const userinfo = 'baz:qux';

      agent.addRequest = (req) => {
        assert.strictEqual(
          req.getHeader('authorization'),
          `Basic ${Buffer.from(userinfo).toString('base64')}`
        );
        done();
      };

      const ws = new WebSocket(`ws://${userinfo}@localhost`, { agent, auth });
    });

    it('adds custom headers', (done) => {
      const agent = new http.Agent();

      agent.addRequest = (req) => {
        assert.strictEqual(req.getHeader('cookie'), 'foo=bar');
        done();
      };

      const ws = new WebSocket('ws://localhost', {
        headers: { Cookie: 'foo=bar' },
        agent
      });
    });

    it('excludes default ports from host header', () => {
      const options = { lookup() {} };
      const variants = [
        ['wss://localhost:8443', 'localhost:8443'],
        ['wss://localhost:443', 'localhost'],
        ['ws://localhost:88', 'localhost:88'],
        ['ws://localhost:80', 'localhost']
      ];

      for (const [url, host] of variants) {
        const ws = new WebSocket(url, options);
        assert.strictEqual(ws._req.getHeader('host'), host);
      }
    });

    it("doesn't add the origin header by default", (done) => {
      const agent = new http.Agent();

      agent.addRequest = (req) => {
        assert.strictEqual(req.getHeader('origin'), undefined);
        done();
      };

      const ws = new WebSocket('ws://localhost', { agent });
    });

    it('honors the `origin` option (1/2)', (done) => {
      const agent = new http.Agent();

      agent.addRequest = (req) => {
        assert.strictEqual(req.getHeader('origin'), 'https://example.com:8000');
        done();
      };

      const ws = new WebSocket('ws://localhost', {
        origin: 'https://example.com:8000',
        agent
      });
    });

    it('honors the `origin` option (2/2)', (done) => {
      const agent = new http.Agent();

      agent.addRequest = (req) => {
        assert.strictEqual(
          req.getHeader('sec-websocket-origin'),
          'https://example.com:8000'
        );
        done();
      };

      const ws = new WebSocket('ws://localhost', {
        origin: 'https://example.com:8000',
        protocolVersion: 8,
        agent
      });
    });

    it('honors the `finishRequest` option', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const host = `localhost:${wss.address().port}`;
        const ws = new WebSocket(`ws://${host}`, {
          finishRequest(req, ws) {
            assert.ok(req instanceof http.ClientRequest);
            assert.strictEqual(req.getHeader('host'), host);
            assert.ok(ws instanceof WebSocket);
            assert.strictEqual(req, ws._req);

            req.on('socket', (socket) => {
              socket.on('connect', () => {
                req.setHeader('Cookie', 'foo=bar');
                req.end();
              });
            });
          }
        });

        ws.on('close', (code) => {
          assert.strictEqual(code, 1005);
          wss.close(done);
        });
      });

      wss.on('connection', (ws, req) => {
        assert.strictEqual(req.headers.cookie, 'foo=bar');
        ws.close();
      });
    });
  });

  describe('permessage-deflate', () => {
    it('is enabled by default', (done) => {
      const agent = new http.Agent();

      agent.addRequest = (req) => {
        assert.strictEqual(
          req.getHeader('sec-websocket-extensions'),
          'permessage-deflate; client_max_window_bits'
        );
        done();
      };

      const ws = new WebSocket('ws://localhost', { agent });
    });

    it('can be disabled', (done) => {
      const agent = new http.Agent();

      agent.addRequest = (req) => {
        assert.strictEqual(
          req.getHeader('sec-websocket-extensions'),
          undefined
        );
        done();
      };

      const ws = new WebSocket('ws://localhost', {
        perMessageDeflate: false,
        agent
      });
    });

    it('can send extension parameters', (done) => {
      const agent = new http.Agent();

      const value =
        'permessage-deflate; server_no_context_takeover;' +
        ' client_no_context_takeover; server_max_window_bits=10;' +
        ' client_max_window_bits';

      agent.addRequest = (req) => {
        assert.strictEqual(req.getHeader('sec-websocket-extensions'), value);
        done();
      };

      const ws = new WebSocket('ws://localhost', {
        perMessageDeflate: {
          clientNoContextTakeover: true,
          serverNoContextTakeover: true,
          clientMaxWindowBits: true,
          serverMaxWindowBits: 10
        },
        agent
      });
    });

    it('consumes all received data when connection is closed (1/2)', (done) => {
      const wss = new WebSocket.Server(
        {
          perMessageDeflate: { threshold: 0 },
          port: 0
        },
        () => {
          const messages = [];
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

          ws.on('open', () => {
            ws._socket.on('close', () => {
              assert.strictEqual(ws._receiver._state, 5);
            });
          });

          ws.on('message', (message, isBinary) => {
            assert.ok(!isBinary);
            messages.push(message.toString());
          });

          ws.on('close', (code) => {
            assert.strictEqual(code, 1006);
            assert.deepStrictEqual(messages, ['foo', 'bar', 'baz', 'qux']);
            wss.close(done);
          });
        }
      );

      wss.on('connection', (ws) => {
        ws.send('foo');
        ws.send('bar');
        ws.send('baz');
        ws.send('qux', () => ws._socket.end());
      });
    });

    it('consumes all received data when connection is closed (2/2)', (done) => {
      const wss = new WebSocket.Server(
        {
          perMessageDeflate: true,
          port: 0
        },
        () => {
          const messageLengths = [];
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

          ws.on('open', () => {
            ws._socket.prependListener('close', () => {
              assert.strictEqual(ws._receiver._state, 5);
              assert.strictEqual(ws._socket._readableState.length, 3);
            });

            const push = ws._socket.push;

            // Override `ws._socket.push()` to know exactly when data is
            // received and call `ws.terminate()` immediately after that without
            // relying on a timer.
            ws._socket.push = (data) => {
              ws._socket.push = push;
              ws._socket.push(data);
              ws.terminate();
            };

            const payload1 = Buffer.alloc(highWaterMark - 1024);
            const payload2 = Buffer.alloc(1);

            const opts = {
              fin: true,
              opcode: 0x02,
              mask: false,
              readOnly: false
            };

            const list = [
              ...Sender.frame(payload1, { rsv1: false, ...opts }),
              ...Sender.frame(payload2, { rsv1: true, ...opts })
            ];

            for (let i = 0; i < 340; i++) {
              list.push(list[list.length - 2], list[list.length - 1]);
            }

            const data = Buffer.concat(list);

            assert.ok(data.length > highWaterMark);

            // This hack is used because there is no guarantee that more than
            // `highWaterMark` bytes will be sent as a single TCP packet.
            push.call(ws._socket, data);

            wss.clients
              .values()
              .next()
              .value.send(payload2, { compress: false });
          });

          ws.on('message', (message, isBinary) => {
            assert.ok(isBinary);
            messageLengths.push(message.length);
          });

          ws.on('close', (code) => {
            assert.strictEqual(code, 1006);
            assert.strictEqual(messageLengths.length, 343);
            assert.strictEqual(messageLengths[0], highWaterMark - 1024);
            assert.strictEqual(messageLengths[messageLengths.length - 1], 1);
            wss.close(done);
          });
        }
      );
    });

    it('handles a close frame received while compressing data', (done) => {
      const wss = new WebSocket.Server(
        {
          perMessageDeflate: true,
          port: 0
        },
        () => {
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`, {
            perMessageDeflate: { threshold: 0 }
          });

          ws.on('open', () => {
            ws._receiver.on('conclude', () => {
              assert.strictEqual(ws._sender._state, 1);
            });

            ws.send('foo');
            ws.send('bar');
            ws.send('baz');
            ws.send('qux');
          });
        }
      );

      wss.on('connection', (ws) => {
        const messages = [];

        ws.on('message', (message, isBinary) => {
          assert.ok(!isBinary);
          messages.push(message.toString());
        });

        ws.on('close', (code, reason) => {
          assert.deepStrictEqual(messages, ['foo', 'bar', 'baz', 'qux']);
          assert.strictEqual(code, 1000);
          assert.deepStrictEqual(reason, EMPTY_BUFFER);
          wss.close(done);
        });

        ws.close(1000);
      });
    });

    describe('#close', () => {
      it('can be used while data is being decompressed', (done) => {
        const wss = new WebSocket.Server(
          {
            perMessageDeflate: true,
            port: 0
          },
          () => {
            const messages = [];
            const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

            ws.on('message', (message, isBinary) => {
              assert.ok(!isBinary);

              if (messages.push(message.toString()) > 1) return;

              setImmediate(() => {
                process.nextTick(() => {
                  assert.strictEqual(ws._receiver._state, 5);
                  ws.close(1000);
                });
              });
            });

            ws.on('close', (code, reason) => {
              assert.deepStrictEqual(messages, ['', '', '', '']);
              assert.strictEqual(code, 1000);
              assert.deepStrictEqual(reason, EMPTY_BUFFER);
              wss.close(done);
            });
          }
        );

        wss.on('connection', (ws) => {
          const buf = Buffer.from('c10100c10100c10100c10100', 'hex');
          ws._socket.write(buf);
        });
      });
    });

    describe('#send', () => {
      it('can send text data', (done) => {
        const wss = new WebSocket.Server(
          {
            perMessageDeflate: { threshold: 0 },
            port: 0
          },
          () => {
            const ws = new WebSocket(`ws://localhost:${wss.address().port}`, {
              perMessageDeflate: { threshold: 0 }
            });

            ws.on('open', () => {
              ws.send('hi', { compress: true });
              ws.close();
            });

            ws.on('message', (message, isBinary) => {
              assert.deepStrictEqual(message, Buffer.from('hi'));
              assert.ok(!isBinary);
              wss.close(done);
            });
          }
        );

        wss.on('connection', (ws) => {
          ws.on('message', (message, isBinary) => {
            ws.send(message, { binary: isBinary, compress: true });
          });
        });
      });

      it('can send a `TypedArray`', (done) => {
        const array = new Float32Array(5);

        for (let i = 0; i < array.length; i++) {
          array[i] = i / 2;
        }

        const wss = new WebSocket.Server(
          {
            perMessageDeflate: { threshold: 0 },
            port: 0
          },
          () => {
            const ws = new WebSocket(`ws://localhost:${wss.address().port}`, {
              perMessageDeflate: { threshold: 0 }
            });

            ws.on('open', () => {
              ws.send(array, { compress: true });
              ws.close();
            });

            ws.on('message', (message, isBinary) => {
              assert.deepStrictEqual(message, Buffer.from(array.buffer));
              assert.ok(isBinary);
              wss.close(done);
            });
          }
        );

        wss.on('connection', (ws) => {
          ws.on('message', (message, isBinary) => {
            assert.ok(isBinary);
            ws.send(message, { compress: true });
          });
        });
      });

      it('can send an `ArrayBuffer`', (done) => {
        const array = new Float32Array(5);

        for (let i = 0; i < array.length; i++) {
          array[i] = i / 2;
        }

        const wss = new WebSocket.Server(
          {
            perMessageDeflate: { threshold: 0 },
            port: 0
          },
          () => {
            const ws = new WebSocket(`ws://localhost:${wss.address().port}`, {
              perMessageDeflate: { threshold: 0 }
            });

            ws.on('open', () => {
              ws.send(array.buffer, { compress: true });
              ws.close();
            });

            ws.on('message', (message, isBinary) => {
              assert.deepStrictEqual(message, Buffer.from(array.buffer));
              assert.ok(isBinary);
              wss.close(done);
            });
          }
        );

        wss.on('connection', (ws) => {
          ws.on('message', (message, isBinary) => {
            assert.ok(isBinary);
            ws.send(message, { compress: true });
          });
        });
      });

      it('can send a `Blob`', function (done) {
        if (!hasBlob) return this.skip();

        const wss = new WebSocket.Server(
          {
            perMessageDeflate: { threshold: 0 },
            port: 0
          },
          () => {
            const ws = new WebSocket(`ws://localhost:${wss.address().port}`, {
              perMessageDeflate: { threshold: 0 }
            });

            const messages = [];

            ws.on('open', () => {
              ws.send(new Blob(['foo']));
              ws.send(new Blob(['bar']));
              ws.close();
            });

            ws.on('message', (message, isBinary) => {
              assert.ok(isBinary);
              messages.push(message.toString());

              if (messages.length === 2) {
                assert.deepStrictEqual(messages, ['foo', 'bar']);
                wss.close(done);
              }
            });
          }
        );

        wss.on('connection', (ws) => {
          ws.on('message', (message, isBinary) => {
            assert.ok(isBinary);
            ws.send(message);
          });
        });
      });

      it('ignores the `compress` option if the extension is disabled', (done) => {
        const wss = new WebSocket.Server({ port: 0 }, () => {
          const ws = new WebSocket(`ws://localhost:${wss.address().port}`, {
            perMessageDeflate: false
          });

          ws.on('open', () => {
            ws.send('hi', { compress: true });
            ws.close();
          });

          ws.on('message', (message, isBinary) => {
            assert.deepStrictEqual(message, Buffer.from('hi'));
            assert.ok(!isBinary);
            wss.close(done);
          });
        });

        wss.on('connection', (ws) => {
          ws.on('message', (message, isBinary) => {
            ws.send(message, { binary: isBinary, compress: true });
          });
        });
      });

      it('calls the callback if the socket is closed prematurely', (done) => {
        const called = [];
        const wss = new WebSocket.Server(
          { perMessageDeflate: true, port: 0 },
          () => {
            const ws = new WebSocket(`ws://localhost:${wss.address().port}`, {
              perMessageDeflate: { threshold: 0 }
            });

            ws.on('open', () => {
              ws.send('foo');
              ws.send('bar', (err) => {
                called.push(1);

                assert.strictEqual(ws.readyState, WebSocket.CLOSING);
                assert.ok(err instanceof Error);
                assert.strictEqual(
                  err.message,
                  'The socket was closed while data was being compressed'
                );
              });
              ws.send('baz');
              ws.send('qux', (err) => {
                called.push(2);

                assert.strictEqual(ws.readyState, WebSocket.CLOSING);
                assert.ok(err instanceof Error);
                assert.strictEqual(
                  err.message,
                  'The socket was closed while data was being compressed'
                );
              });
              ws.close();
            });
          }
        );

        wss.on('connection', (ws) => {
          ws.on('close', () => {
            assert.deepStrictEqual(called, [1, 2]);
            wss.close(done);
          });

          ws._socket.end();
        });
      });
    });

    describe('#terminate', () => {
      it('can be used while data is being compressed', (done) => {
        const wss = new WebSocket.Server(
          {
            perMessageDeflate: { threshold: 0 },
            port: 0
          },
          () => {
            const ws = new WebSocket(`ws://localhost:${wss.address().port}`, {
              perMessageDeflate: { threshold: 0 }
            });

            ws.on('open', () => {
              ws.send('hi', (err) => {
                assert.strictEqual(ws.readyState, WebSocket.CLOSING);
                assert.ok(err instanceof Error);
                assert.strictEqual(
                  err.message,
                  'The socket was closed while data was being compressed'
                );

                ws.on('close', () => {
                  wss.close(done);
                });
              });
              ws.terminate();
            });
          }
        );
      });

      it('can be used while data is being decompressed', (done) => {
        const wss = new WebSocket.Server(
          {
            perMessageDeflate: true,
            port: 0
          },
          () => {
            const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
            const messages = [];

            ws.on('message', (message, isBinary) => {
              assert.ok(!isBinary);

              if (messages.push(message.toString()) > 1) return;

              setImmediate(() => {
                process.nextTick(() => {
                  assert.strictEqual(ws._receiver._state, 5);
                  ws.terminate();
                });
              });
            });

            ws.on('close', (code, reason) => {
              assert.deepStrictEqual(messages, ['', '', '', '']);
              assert.strictEqual(code, 1006);
              assert.strictEqual(reason, EMPTY_BUFFER);
              wss.close(done);
            });
          }
        );

        wss.on('connection', (ws) => {
          const buf = Buffer.from('c10100c10100c10100c10100', 'hex');
          ws._socket.write(buf);
        });
      });
    });
  });

  describe('Connection close', () => {
    it('closes cleanly after simultaneous errors (1/2)', (done) => {
      let clientCloseEventEmitted = false;
      let serverClientCloseEventEmitted = false;

      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('error', (err) => {
          assert.ok(err instanceof RangeError);
          assert.strictEqual(err.code, 'WS_ERR_INVALID_OPCODE');
          assert.strictEqual(
            err.message,
            'Invalid WebSocket frame: invalid opcode 5'
          );

          ws.on('close', (code, reason) => {
            assert.strictEqual(code, 1006);
            assert.strictEqual(reason, EMPTY_BUFFER);

            clientCloseEventEmitted = true;
            if (serverClientCloseEventEmitted) wss.close(done);
          });
        });

        ws.on('open', () => {
          // Write an invalid frame in both directions to trigger simultaneous
          // failure.
          const chunk = Buffer.from([0x85, 0x00]);

          wss.clients.values().next().value._socket.write(chunk);
          ws._socket.write(chunk);
        });
      });

      wss.on('connection', (ws) => {
        ws.on('error', (err) => {
          assert.ok(err instanceof RangeError);
          assert.strictEqual(err.code, 'WS_ERR_INVALID_OPCODE');
          assert.strictEqual(
            err.message,
            'Invalid WebSocket frame: invalid opcode 5'
          );

          ws.on('close', (code, reason) => {
            assert.strictEqual(code, 1006);
            assert.strictEqual(reason, EMPTY_BUFFER);

            serverClientCloseEventEmitted = true;
            if (clientCloseEventEmitted) wss.close(done);
          });
        });
      });
    });

    it('closes cleanly after simultaneous errors (2/2)', (done) => {
      let clientCloseEventEmitted = false;
      let serverClientCloseEventEmitted = false;

      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);

        ws.on('error', (err) => {
          assert.ok(err instanceof RangeError);
          assert.strictEqual(err.code, 'WS_ERR_INVALID_OPCODE');
          assert.strictEqual(
            err.message,
            'Invalid WebSocket frame: invalid opcode 5'
          );

          ws.on('close', (code, reason) => {
            assert.strictEqual(code, 1006);
            assert.strictEqual(reason, EMPTY_BUFFER);

            clientCloseEventEmitted = true;
            if (serverClientCloseEventEmitted) wss.close(done);
          });
        });

        ws.on('open', () => {
          // Write an invalid frame in both directions and change the
          // `readyState` to `WebSocket.CLOSING`.
          const chunk = Buffer.from([0x85, 0x00]);
          const serverWs = wss.clients.values().next().value;

          serverWs._socket.write(chunk);
          serverWs.close();

          ws._socket.write(chunk);
          ws.close();
        });
      });

      wss.on('connection', (ws) => {
        ws.on('error', (err) => {
          assert.ok(err instanceof RangeError);
          assert.strictEqual(err.code, 'WS_ERR_INVALID_OPCODE');
          assert.strictEqual(
            err.message,
            'Invalid WebSocket frame: invalid opcode 5'
          );

          ws.on('close', (code, reason) => {
            assert.strictEqual(code, 1006);
            assert.strictEqual(reason, EMPTY_BUFFER);

            serverClientCloseEventEmitted = true;
            if (clientCloseEventEmitted) wss.close(done);
          });
        });
      });
    });

    it('resumes the socket when an error occurs', (done) => {
      const maxPayload = 16 * 1024;
      const wss = new WebSocket.Server({ maxPayload, port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
      });

      wss.on('connection', (ws) => {
        const list = [
          ...Sender.frame(Buffer.alloc(maxPayload + 1), {
            fin: true,
            opcode: 0x02,
            mask: true,
            readOnly: false
          })
        ];

        ws.on('error', (err) => {
          assert.ok(err instanceof RangeError);
          assert.strictEqual(err.code, 'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH');
          assert.strictEqual(err.message, 'Max payload size exceeded');

          ws.on('close', (code, reason) => {
            assert.strictEqual(code, 1006);
            assert.strictEqual(reason, EMPTY_BUFFER);
            wss.close(done);
          });
        });

        ws._socket.push(Buffer.concat(list));
      });
    });

    it('resumes the socket when the close frame is received', (done) => {
      const wss = new WebSocket.Server({ port: 0 }, () => {
        const ws = new WebSocket(`ws://localhost:${wss.address().port}`);
      });

      wss.on('connection', (ws) => {
        const opts = { fin: true, mask: true, readOnly: false };
        const list = [
          ...Sender.frame(Buffer.alloc(16 * 1024), { opcode: 0x02, ...opts }),
          ...Sender.frame(EMPTY_BUFFER, { opcode: 0x08, ...opts })
        ];

        ws.on('close', (code, reason) => {
          assert.strictEqual(code, 1005);
          assert.strictEqual(reason, EMPTY_BUFFER);
          wss.close(done);
        });

        ws._socket.push(Buffer.concat(list));
      });
    });
  });
});

```

---


## fetch-engine@7.4.2

**Funções usados neste arquivo:** PrismaClient, component, upsert, externalComponent, externalTestFile, findMany, $disconnect, PrismaLibSql


## libsql@0.5.22

**Funções usados neste arquivo:** createClient


## core@0.17.0

**Funções usados neste arquivo:** createClient


## hrana-client@0.9.0

**Funções usados neste arquivo:** createClient

### atob.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/d54d5b63b2-js-base64/test/atob.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
var assert = assert || require("assert");
var Base64 = Base64 || require('../base64.js').Base64;
var is = function (a, e, m) {
    return function () {
        assert.equal(a, e, m)
    }
};

describe('atob', function () {

    describe('basic', function () {
        it('d',    is(Base64.btoa('d'),    'ZA=='));
        it('da',   is(Base64.btoa('da'),   'ZGE='));
        it('dan',  is(Base64.btoa('dan'),  'ZGFu'));
        it('ZA==', is(Base64.atob('ZA=='), 'd'   ));
        it('ZGE=', is(Base64.atob('ZGE='), 'da'  ));
        it('ZGFu', is(Base64.atob('ZGFu'), 'dan' ));
    });

    describe('whitespace', function () {
        it('Z A==', is(Base64.atob('ZA =='), 'd'   ));
        it('ZG E=', is(Base64.atob('ZG E='), 'da'  ));
        it('ZGF u', is(Base64.atob('ZGF u'), 'dan' ));
    });

    describe('null', function () {
        it('\\0',       is(Base64.btoa('\0'),     'AA=='));
        it('\\0\\0',    is(Base64.btoa('\0\0'),   'AAA='));
        it('\\0\\0\\0', is(Base64.btoa('\0\0\0'), 'AAAA'));
        it('AA==',      is(Base64.atob('AA=='), '\0'    ));
        it('AAA=',      is(Base64.atob('AAA='), '\0\0'  ));
        it('AAAA',      is(Base64.atob('AAAA'), '\0\0\0'));
    });

    describe('binary', function () {
        var pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
        var pngBinary = '\x89\x50\x4e\x47\x0d\x0a\x1a\x0a\x00\x00\x00\x0d\x49\x48\x44\x52\x00\x00\x00\x01\x00\x00\x00\x01\x08\x04\x00\x00\x00\xb5\x1c\x0c\x02\x00\x00\x00\x0b\x49\x44\x41\x54\x78\xda\x63\x64\x60\x00\x00\x00\x06\x00\x02\x30\x81\xd0\x2f\x00\x00\x00\x00\x49\x45\x4e\x44\xae\x42\x60\x82';
        it('.btoa', is(Base64.btoa(pngBinary), pngBase64));
        it('.atob', is(Base64.atob(pngBase64), pngBinary));
    });

});

```

---

### dankogai.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/d54d5b63b2-js-base64/test/dankogai.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
/*
 * $Id: dankogai.js,v 0.4 2012/08/24 05:23:18 dankogai Exp dankogai $
 *
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
var assert = assert || require("assert");
var Base64 = Base64 || require('../base64.js').Base64;
var is = function (a, e, m) {
    return function () {
        assert.equal(a, e, m)
    }
};

describe('basic', function () {
    it('d', is(Base64.encode('d'), 'ZA=='));
    it('da', is(Base64.encode('da'), 'ZGE='));
    it('dan', is(Base64.encode('dan'), 'ZGFu'));
    it('ZA==', is(Base64.decode('ZA=='), 'd'));
    it('ZGE=', is(Base64.decode('ZGE='), 'da'));
    it('ZGFu', is(Base64.decode('ZGFu'), 'dan'));
});

describe('whitespace', function () {
    it('Z A==', is(Base64.decode('Z A=='), 'd'));
    it('ZG E=', is(Base64.decode('ZG E='), 'da'));
    it('ZGF u', is(Base64.decode('ZGF u'), 'dan'));
});

describe('null', function () {
    it('\\0', is(Base64.encode('\0'), 'AA=='));
    it('\\0\\0', is(Base64.encode('\0\0'), 'AAA='));
    it('\\0\\0\\0', is(Base64.encode('\0\0\0'), 'AAAA'));
    it('AA==', is(Base64.decode('AA=='), '\0'));
    it('AAA=', is(Base64.decode('AAA='), '\0\0'));
    it('AAAA', is(Base64.decode('AAAA'), '\0\0\0'));
});

describe('Base64', function () {
    it('.encode', is(Base64.encode('小飼弾'), '5bCP6aO85by+'));
    it('.encodeURI', is(Base64.encodeURI('小飼弾'), '5bCP6aO85by-'));
    it('.decode', is(Base64.decode('5bCP6aO85by+'), '小飼弾'));
    it('.decode', is(Base64.decode('5bCP6aO85by-'), '小飼弾'));
});

describe('isValid', function () {
    it('', is(Base64.isValid(''), true));
    it('0', is(Base64.isValid(0), false));
    it('Z', is(Base64.isValid('Z'), true));
    it('ZA', is(Base64.isValid('ZA'), true));
    it('ZA=', is(Base64.isValid('ZA='), true));
    it('ZA==', is(Base64.isValid('ZA=='), true));
    it('++', is(Base64.isValid('++'), true));
    it('+-', is(Base64.isValid('+-'), false));
    it('--', is(Base64.isValid('--'), true));
    it('//', is(Base64.isValid('//'), true));
    it('__', is(Base64.isValid('__'), true));
    it('/_', is(Base64.isValid('/_'), false));
});

if (typeof Uint8Array === 'function') describe('fromUint8Array', function () {
    it('dankogai', is(Base64.fromUint8Array(new Uint8Array([100, 97, 110, 107, 111, 103, 97, 105])), Base64.encode('dankogai')));
    it('dankoga', is(Base64.fromUint8Array(new Uint8Array([100, 97, 110, 107, 111, 103, 97])), Base64.encode('dankoga')));
    it('dankog', is(Base64.fromUint8Array(new Uint8Array([100, 97, 110, 107, 111, 103])), Base64.encode('dankog')));
    it('danko', is(Base64.fromUint8Array(new Uint8Array([100, 97, 110, 107, 111])), Base64.encode('danko')));
    it('dank', is(Base64.fromUint8Array(new Uint8Array([100, 97, 110, 107])), Base64.encode('dank')));
    it('dan', is(Base64.fromUint8Array(new Uint8Array([100, 97, 110])), Base64.encode('dan')));
    it('da', is(Base64.fromUint8Array(new Uint8Array([100, 97])), Base64.encode('da')));
    it('d', is(Base64.fromUint8Array(new Uint8Array([100])), Base64.encode('d')));
    it('', is(Base64.fromUint8Array(new Uint8Array([])), Base64.encode('')));
});

if (typeof Uint8Array === 'function') describe('toUint8Array', function () {
    var _2str = function (a) {
        return Array.prototype.slice.call(a, 0).toString();
    }
    it('ZGFua29nYWk=', is(_2str(Base64.toUint8Array('ZGFua29nYWk=')), '100,97,110,107,111,103,97,105'));
    it('ZGFua29nYQ==', is(_2str(Base64.toUint8Array('ZGFua29nYQ==')), '100,97,110,107,111,103,97'));
    it('ZGFua29n', is(_2str(Base64.toUint8Array('ZGFua29n')), '100,97,110,107,111,103'));
    it('ZGFua28=', is(_2str(Base64.toUint8Array('ZGFua28=')), '100,97,110,107,111'));
    it('ZGFuaw==', is(_2str(Base64.toUint8Array('ZGFuaw==')), '100,97,110,107'));
    it('ZGFu', is(_2str(Base64.toUint8Array('ZGFu')), '100,97,110'));
    it('ZGE=', is(_2str(Base64.toUint8Array('ZGE=')), '100,97'));
    it('ZA==', is(_2str(Base64.toUint8Array('ZA==')), '100'));
    it('', is(_2str(Base64.toUint8Array('')), ''));
});

```

---

### es5.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/d54d5b63b2-js-base64/test/es5.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
/*
 * $Id: es5.js,v 0.1 2012/08/23 19:43:17 dankogai Exp dankogai $
 *
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
var assert = assert || require("assert");
var Base64 = Base64 || require('../base64.js').Base64;
var is = function (a, e, m) {
    return function () {
        assert.equal(a, e, m)
    }
};

if (typeof Base64.extendString == 'function'){
    delete String.prototype.fromBase64;
    delete String.prototype.toBase64;
    delete String.prototype.toBase64URI;
    delete String.prototype.toBase64URL;
    delete String.prototype.toUint8Array;
    Base64.extendString();
    describe('ES5 String', function () {
        it('.toBase64', is('小飼弾'.toBase64(), '5bCP6aO85by+'));
        it('.toBase64', is('小飼弾'.toBase64(true), '5bCP6aO85by-'));
        it('.toBase64URI', is('小飼弾'.toBase64URI(), '5bCP6aO85by-'));
        it('.fromBase64', is('5bCP6aO85by+'.fromBase64(), '小飼弾'));
        it('.fromBase64', is('5bCP6aO85by-'.fromBase64(), '小飼弾'));
    });
}

```

---

### es6.mjs

**Caminho original:** `/tmp/ctest-repos-3nLWsr/d54d5b63b2-js-base64/test/es6.mjs`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
/*
 * $Id: es6.js,v 0.1 2017/11/29 21:43:17 ufolux Exp ufolux $
 *
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */

import { extendString } from '../base64.mjs'
import assert from 'assert';

var is = function (a, e, m) {
    return function () {
        assert.equal(a, e, m)
    }
};

delete String.prototype.fromBase64;
delete String.prototype.toBase64;
delete String.prototype.toBase64URI;
delete String.prototype.toBase64URL;
delete String.prototype.toUint8Array;
extendString();

describe('ES6 String', function () {
    it('.toBase64', is('小飼弾'.toBase64(), '5bCP6aO85by+'));
    it('.toBase64', is('小飼弾'.toBase64(true), '5bCP6aO85by-'));
    it('.toBase64URI', is('小飼弾'.toBase64URI(), '5bCP6aO85by-'));
    it('.fromBase64', is('5bCP6aO85by+'.fromBase64(), '小飼弾'));
    it('.fromBase64', is('5bCP6aO85by-'.fromBase64(), '小飼弾'));
});

```

---

### large.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/d54d5b63b2-js-base64/test/large.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
/*
 * $Id: large.js,v 0.3 2012/08/23 19:14:37 dankogai Exp dankogai $
 *
 * use mocha to test me
 *   http://visionmedia.github.com/mocha/
 */
var assert = assert || require("assert");
var Base64 = Base64 || require('../base64.js').Base64;
var is = function (a, e, m) {
    return function () {
        assert.equal(a, e, m)
    }
};
var seed = function () {
    var a, i;
    for (a = [], i = 0; i < 256; i++) {
        a.push(String.fromCharCode(i));
    }
    return a.join('');
}();
describe('Large Base64', function () {
    for (var i = 0, str = seed; i < 16; str += str, i++) {
        it(''+str.length, is(Base64.decode(Base64.encode(str)), str));
    }
});

```

---

### umd.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/d54d5b63b2-js-base64/test/umd.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
var assert = assert || require("assert");
var Base64 = Base64 || require("../base64.js");

describe("umd module", function () {
    if (typeof global !== "undefined") {
        it("should not modify `global` variables", function () {
            assert.equal("Base64" in global, false);
        });
    } else if (typeof window !== "undefined") {
        it("should inject `window` namespace", function () {
            assert.equal("Base64" in window, true);
            assert.equal(typeof window.Base64, 'object');
            assert.equal("noConflict" in window.Base64, true);
        });
    }
    it("should work with namespace and non-namespace usage both", function () {
        assert.equal(!Base64.Base64, false);
        assert.notEqual(Base64.Base64, Base64);
        assert.equal(Base64.encode, Base64.Base64.encode);
    });
});

```

---

### yoshinoya.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/d54d5b63b2-js-base64/test/yoshinoya.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
var assert = assert || require("assert");
var Base64 = Base64 || require('../base64.js').Base64;
var is = function (a, e, m) {
    return function () {
        assert.equal(a, e, m)
    }
};

describe('Yoshinoya', function () {
    it('.encode', is(Base64.encode('𠮷野家'), '8KCut+mHjuWutg=='));
    it('.encodeURI', is(Base64.encodeURI('𠮷野家'), '8KCut-mHjuWutg'));
    it('.decode', is(Base64.decode('8KCut+mHjuWutg=='), '𠮷野家'));
    it('.decode', is(Base64.decode('8KCut-mHjuWutg'), '𠮷野家'));
    /* it('.decode', is(Base64.decode('7aGC7b636YeO5a62'), '𠮷野家')); */
});

```

---


## linux-x64-gnu@0.5.22

**Funções usados neste arquivo:** createClient


## linux-x64-musl@0.5.22

**Funções usados neste arquivo:** createClient


## isomorphic-ws@0.1.5

**Funções usados neste arquivo:** createClient

### _fixture.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/142f5b555a-chalk/test/_fixture.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
const chalk = require('../source');

console.log(`${chalk.hex('#ff6159')('testout')} ${chalk.stderr.hex('#ff6159')('testerr')}`);

```

---

### _supports-color.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/142f5b555a-chalk/test/_supports-color.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
const resolveFrom = require('resolve-from');

const DEFAULT = {
	stdout: {
		level: 3,
		hasBasic: true,
		has256: true,
		has16m: true
	},
	stderr: {
		level: 3,
		hasBasic: true,
		has256: true,
		has16m: true
	}
};

module.exports = (dir, override) => {
	require.cache[resolveFrom(dir, 'supports-color')] = {exports: override || DEFAULT};
};

```

---

### chalk.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/142f5b555a-chalk/test/chalk.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
import test from 'ava';

// Spoof supports-color
require('./_supports-color')(__dirname);

const chalk = require('../source');

console.log('TERM:', process.env.TERM || '[none]');
console.log('platform:', process.platform || '[unknown]');

test('don\'t add any styling when called as the base function', t => {
	t.is(chalk('foo'), 'foo');
});

test('support multiple arguments in base function', t => {
	t.is(chalk('hello', 'there'), 'hello there');
});

test('support automatic casting to string', t => {
	t.is(chalk(['hello', 'there']), 'hello,there');
	t.is(chalk(123), '123');

	t.is(chalk.bold(['foo', 'bar']), '\u001B[1mfoo,bar\u001B[22m');
	t.is(chalk.green(98765), '\u001B[32m98765\u001B[39m');
});

test('style string', t => {
	t.is(chalk.underline('foo'), '\u001B[4mfoo\u001B[24m');
	t.is(chalk.red('foo'), '\u001B[31mfoo\u001B[39m');
	t.is(chalk.bgRed('foo'), '\u001B[41mfoo\u001B[49m');
});

test('support applying multiple styles at once', t => {
	t.is(chalk.red.bgGreen.underline('foo'), '\u001B[31m\u001B[42m\u001B[4mfoo\u001B[24m\u001B[49m\u001B[39m');
	t.is(chalk.underline.red.bgGreen('foo'), '\u001B[4m\u001B[31m\u001B[42mfoo\u001B[49m\u001B[39m\u001B[24m');
});

test('support nesting styles', t => {
	t.is(
		chalk.red('foo' + chalk.underline.bgBlue('bar') + '!'),
		'\u001B[31mfoo\u001B[4m\u001B[44mbar\u001B[49m\u001B[24m!\u001B[39m'
	);
});

test('support nesting styles of the same type (color, underline, bg)', t => {
	t.is(
		chalk.red('a' + chalk.yellow('b' + chalk.green('c') + 'b') + 'c'),
		'\u001B[31ma\u001B[33mb\u001B[32mc\u001B[39m\u001B[31m\u001B[33mb\u001B[39m\u001B[31mc\u001B[39m'
	);
});

test('reset all styles with `.reset()`', t => {
	t.is(chalk.reset(chalk.red.bgGreen.underline('foo') + 'foo'), '\u001B[0m\u001B[31m\u001B[42m\u001B[4mfoo\u001B[24m\u001B[49m\u001B[39mfoo\u001B[0m');
});

test('support caching multiple styles', t => {
	const {red, green} = chalk.red;
	const redBold = red.bold;
	const greenBold = green.bold;

	t.not(red('foo'), green('foo'));
	t.not(redBold('bar'), greenBold('bar'));
	t.not(green('baz'), greenBold('baz'));
});

test('alias gray to grey', t => {
	t.is(chalk.grey('foo'), '\u001B[90mfoo\u001B[39m');
});

test('support variable number of arguments', t => {
	t.is(chalk.red('foo', 'bar'), '\u001B[31mfoo bar\u001B[39m');
});

test('support falsy values', t => {
	t.is(chalk.red(0), '\u001B[31m0\u001B[39m');
});

test('don\'t output escape codes if the input is empty', t => {
	t.is(chalk.red(), '');
	t.is(chalk.red.blue.black(), '');
});

test('keep Function.prototype methods', t => {
	t.is(Reflect.apply(chalk.grey, null, ['foo']), '\u001B[90mfoo\u001B[39m');
	t.is(chalk.reset(chalk.red.bgGreen.underline.bind(null)('foo') + 'foo'), '\u001B[0m\u001B[31m\u001B[42m\u001B[4mfoo\u001B[24m\u001B[49m\u001B[39mfoo\u001B[0m');
	t.is(chalk.red.blue.black.call(null), '');
});

test('line breaks should open and close colors', t => {
	t.is(chalk.grey('hello\nworld'), '\u001B[90mhello\u001B[39m\n\u001B[90mworld\u001B[39m');
});

test('line breaks should open and close colors with CRLF', t => {
	t.is(chalk.grey('hello\r\nworld'), '\u001B[90mhello\u001B[39m\r\n\u001B[90mworld\u001B[39m');
});

test('properly convert RGB to 16 colors on basic color terminals', t => {
	t.is(new chalk.Instance({level: 1}).hex('#FF0000')('hello'), '\u001B[91mhello\u001B[39m');
	t.is(new chalk.Instance({level: 1}).bgHex('#FF0000')('hello'), '\u001B[101mhello\u001B[49m');
});

test('properly convert RGB to 256 colors on basic color terminals', t => {
	t.is(new chalk.Instance({level: 2}).hex('#FF0000')('hello'), '\u001B[38;5;196mhello\u001B[39m');
	t.is(new chalk.Instance({level: 2}).bgHex('#FF0000')('hello'), '\u001B[48;5;196mhello\u001B[49m');
	t.is(new chalk.Instance({level: 3}).bgHex('#FF0000')('hello'), '\u001B[48;2;255;0;0mhello\u001B[49m');
});

test('don\'t emit RGB codes if level is 0', t => {
	t.is(new chalk.Instance({level: 0}).hex('#FF0000')('hello'), 'hello');
	t.is(new chalk.Instance({level: 0}).bgHex('#FF0000')('hello'), 'hello');
});

test('supports blackBright color', t => {
	t.is(chalk.blackBright('foo'), '\u001B[90mfoo\u001B[39m');
});

test('sets correct level for chalk.stderr and respects it', t => {
	t.is(chalk.stderr.level, 3);
	t.is(chalk.stderr.red.bold('foo'), '\u001B[31m\u001B[1mfoo\u001B[22m\u001B[39m');
});

```

---

### constructor.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/142f5b555a-chalk/test/constructor.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
import test from 'ava';

const chalk = require('../source');

test('Chalk.constructor should throw an expected error', t => {
	const expectedError = t.throws(() => {
		chalk.constructor();
	});

	t.is(expectedError.message, '`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.');

	t.throws(() => {
		new chalk.constructor(); // eslint-disable-line no-new
	});
});

```

---

### instance.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/142f5b555a-chalk/test/instance.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
import test from 'ava';

// Spoof supports-color
require('./_supports-color')(__dirname);

const chalk = require('../source');

test('create an isolated context where colors can be disabled (by level)', t => {
	const instance = new chalk.Instance({level: 0});
	t.is(instance.red('foo'), 'foo');
	t.is(chalk.red('foo'), '\u001B[31mfoo\u001B[39m');
	instance.level = 2;
	t.is(instance.red('foo'), '\u001B[31mfoo\u001B[39m');
});

test('the `level` option should be a number from 0 to 3', t => {
	/* eslint-disable no-new */
	t.throws(() => {
		new chalk.Instance({level: 10});
	}, /should be an integer from 0 to 3/);

	t.throws(() => {
		new chalk.Instance({level: -1});
	}, /should be an integer from 0 to 3/);
	/* eslint-enable no-new */
});

```

---

### level.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/142f5b555a-chalk/test/level.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
import path from 'path';
import test from 'ava';
import execa from 'execa';

// Spoof supports-color
require('./_supports-color')(__dirname);

const chalk = require('../source');

test('don\'t output colors when manually disabled', t => {
	const oldLevel = chalk.level;
	chalk.level = 0;
	t.is(chalk.red('foo'), 'foo');
	chalk.level = oldLevel;
});

test('enable/disable colors based on overall chalk .level property, not individual instances', t => {
	const oldLevel = chalk.level;
	chalk.level = 1;
	const {red} = chalk;
	t.is(red.level, 1);
	chalk.level = 0;
	t.is(red.level, chalk.level);
	chalk.level = oldLevel;
});

test('propagate enable/disable changes from child colors', t => {
	const oldLevel = chalk.level;
	chalk.level = 1;
	const {red} = chalk;
	t.is(red.level, 1);
	t.is(chalk.level, 1);
	red.level = 0;
	t.is(red.level, 0);
	t.is(chalk.level, 0);
	chalk.level = 1;
	t.is(red.level, 1);
	t.is(chalk.level, 1);
	chalk.level = oldLevel;
});

test('disable colors if they are not supported', async t => {
	const {stdout} = await execa.node(path.join(__dirname, '_fixture'));
	t.is(stdout, 'testout testerr');
});

```

---

### no-color-support.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/142f5b555a-chalk/test/no-color-support.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
import test from 'ava';

// Spoof supports-color
require('./_supports-color')(__dirname, {
	stdout: {
		level: 0,
		hasBasic: false,
		has256: false,
		has16m: false
	},
	stderr: {
		level: 0,
		hasBasic: false,
		has256: false,
		has16m: false
	}
});

const chalk = require('../source');

test('colors can be forced by using chalk.level', t => {
	chalk.level = 1;
	t.is(chalk.green('hello'), '\u001B[32mhello\u001B[39m');
});

```

---

### template-literal.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/142f5b555a-chalk/test/template-literal.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
/* eslint-disable unicorn/no-hex-escape */
import test from 'ava';

// Spoof supports-color
require('./_supports-color')(__dirname);

const chalk = require('../source');

test('return an empty string for an empty literal', t => {
	const instance = new chalk.Instance();
	t.is(instance``, '');
});

test('return a regular string for a literal with no templates', t => {
	const instance = new chalk.Instance({level: 0});
	t.is(instance`hello`, 'hello');
});

test('correctly perform template parsing', t => {
	const instance = new chalk.Instance({level: 0});
	t.is(instance`{bold Hello, {cyan World!} This is a} test. {green Woo!}`,
		instance.bold('Hello,', instance.cyan('World!'), 'This is a') + ' test. ' + instance.green('Woo!'));
});

test('correctly perform template substitutions', t => {
	const instance = new chalk.Instance({level: 0});
	const name = 'Sindre';
	const exclamation = 'Neat';
	t.is(instance`{bold Hello, {cyan.inverse ${name}!} This is a} test. {green ${exclamation}!}`,
		instance.bold('Hello,', instance.cyan.inverse(name + '!'), 'This is a') + ' test. ' + instance.green(exclamation + '!'));
});

test('correctly perform nested template substitutions', t => {
	const instance = new chalk.Instance({level: 0});
	const name = 'Sindre';
	const exclamation = 'Neat';
	t.is(instance.bold`Hello, {cyan.inverse ${name}!} This is a` + ' test. ' + instance.green`${exclamation}!`,
		instance.bold('Hello,', instance.cyan.inverse(name + '!'), 'This is a') + ' test. ' + instance.green(exclamation + '!'));

	t.is(instance.red.bgGreen.bold`Hello {italic.blue ${name}}`,
		instance.red.bgGreen.bold('Hello ' + instance.italic.blue(name)));

	t.is(instance.strikethrough.cyanBright.bgBlack`Works with {reset {bold numbers}} {bold.red ${1}}`,
		instance.strikethrough.cyanBright.bgBlack('Works with ' + instance.reset.bold('numbers') + ' ' + instance.bold.red(1)));

	t.is(chalk.bold`Also works on the shared {bgBlue chalk} object`,
		'\u001B[1mAlso works on the shared \u001B[1m' +
		'\u001B[44mchalk\u001B[49m\u001B[22m' +
		'\u001B[1m object\u001B[22m');
});

test('correctly parse and evaluate color-convert functions', t => {
	const instance = new chalk.Instance({level: 3});
	t.is(instance`{bold.rgb(144,10,178).inverse Hello, {~inverse there!}}`,
		'\u001B[1m\u001B[38;2;144;10;178m\u001B[7mHello, ' +
		'\u001B[27m\u001B[39m\u001B[22m\u001B[1m' +
		'\u001B[38;2;144;10;178mthere!\u001B[39m\u001B[22m');

	t.is(instance`{bold.bgRgb(144,10,178).inverse Hello, {~inverse there!}}`,
		'\u001B[1m\u001B[48;2;144;10;178m\u001B[7mHello, ' +
		'\u001B[27m\u001B[49m\u001B[22m\u001B[1m' +
		'\u001B[48;2;144;10;178mthere!\u001B[49m\u001B[22m');
});

test('properly handle escapes', t => {
	const instance = new chalk.Instance({level: 3});
	t.is(instance`{bold hello \{in brackets\}}`,
		'\u001B[1mhello {in brackets}\u001B[22m');
});

test('throw if there is an unclosed block', t => {
	const instance = new chalk.Instance({level: 3});
	try {
		console.log(instance`{bold this shouldn't appear ever\}`);
		t.fail();
	} catch (error) {
		t.is(error.message, 'Chalk template literal is missing 1 closing bracket (`}`)');
	}

	try {
		console.log(instance`{bold this shouldn't {inverse appear {underline ever\} :) \}`);
		t.fail();
	} catch (error) {
		t.is(error.message, 'Chalk template literal is missing 3 closing brackets (`}`)');
	}
});

test('throw if there is an invalid style', t => {
	const instance = new chalk.Instance({level: 3});
	try {
		console.log(instance`{abadstylethatdoesntexist this shouldn't appear ever}`);
		t.fail();
	} catch (error) {
		t.is(error.message, 'Unknown Chalk style: abadstylethatdoesntexist');
	}
});

test('properly style multiline color blocks', t => {
	const instance = new chalk.Instance({level: 3});
	t.is(
		instance`{bold
			Hello! This is a
			${'multiline'} block!
			:)
		} {underline
			I hope you enjoy
		}`,
		'\u001B[1m\u001B[22m\n' +
		'\u001B[1m\t\t\tHello! This is a\u001B[22m\n' +
		'\u001B[1m\t\t\tmultiline block!\u001B[22m\n' +
		'\u001B[1m\t\t\t:)\u001B[22m\n' +
		'\u001B[1m\t\t\u001B[22m \u001B[4m\u001B[24m\n' +
		'\u001B[4m\t\t\tI hope you enjoy\u001B[24m\n' +
		'\u001B[4m\t\t\u001B[24m'
	);
});

test('escape interpolated values', t => {
	const instance = new chalk.Instance({level: 0});
	t.is(instance`Hello {bold hi}`, 'Hello hi');
	t.is(instance`Hello ${'{bold hi}'}`, 'Hello {bold hi}');
});

test('allow custom colors (themes) on custom contexts', t => {
	const instance = new chalk.Instance({level: 3});
	instance.rose = instance.hex('#F6D9D9');
	t.is(instance`Hello, {rose Rose}.`, 'Hello, \u001B[38;2;246;217;217mRose\u001B[39m.');
});

test('correctly parse newline literals (bug #184)', t => {
	const instance = new chalk.Instance({level: 0});
	t.is(instance`Hello
{red there}`, 'Hello\nthere');
});

test('correctly parse newline escapes (bug #177)', t => {
	const instance = new chalk.Instance({level: 0});
	t.is(instance`Hello\nthere!`, 'Hello\nthere!');
});

test('correctly parse escape in parameters (bug #177 comment 318622809)', t => {
	const instance = new chalk.Instance({level: 0});
	const string = '\\';
	t.is(instance`{blue ${string}}`, '\\');
});

test('correctly parses unicode/hex escapes', t => {
	const instance = new chalk.Instance({level: 0});
	t.is(instance`\u0078ylophones are fo\x78y! {magenta.inverse \u0078ylophones are fo\x78y!}`,
		'xylophones are foxy! xylophones are foxy!');
});

test('correctly parses string arguments', t => {
	const instance = new chalk.Instance({level: 3});
	t.is(instance`{keyword('black').bold can haz cheezburger}`, '\u001B[38;2;0;0;0m\u001B[1mcan haz cheezburger\u001B[22m\u001B[39m');
	t.is(instance`{keyword('blac\x6B').bold can haz cheezburger}`, '\u001B[38;2;0;0;0m\u001B[1mcan haz cheezburger\u001B[22m\u001B[39m');
	t.is(instance`{keyword('blac\u006B').bold can haz cheezburger}`, '\u001B[38;2;0;0;0m\u001B[1mcan haz cheezburger\u001B[22m\u001B[39m');
});

test('throws if a bad argument is encountered', t => {
	const instance = new chalk.Instance({level: 3}); // Keep level at least 1 in case we optimize for disabled chalk instances
	try {
		console.log(instance`{keyword(????) hi}`);
		t.fail();
	} catch (error) {
		t.is(error.message, 'Invalid Chalk template style argument: ???? (in style \'keyword\')');
	}
});

test('throws if an extra unescaped } is found', t => {
	const instance = new chalk.Instance({level: 0});
	try {
		console.log(instance`{red hi!}}`);
		t.fail();
	} catch (error) {
		t.is(error.message, 'Found extraneous } in Chalk template literal');
	}
});

test('should not parse upper-case escapes', t => {
	const instance = new chalk.Instance({level: 0});
	t.is(instance`\N\n\T\t\X07\x07\U000A\u000A\U000a\u000a`, 'N\nT\tX07\x07U000A\u000AU000a\u000A');
});

test('should properly handle undefined template interpolated values', t => {
	const instance = new chalk.Instance({level: 0});
	t.is(instance`hello ${undefined}`, 'hello undefined');
	t.is(instance`hello ${null}`, 'hello null');
});

test('should allow bracketed Unicode escapes', t => {
	const instance = new chalk.Instance({level: 3});
	t.is(instance`\u{AB}`, '\u{AB}');
	t.is(instance`This is a {bold \u{AB681}} test`, 'This is a \u001B[1m\u{AB681}\u001B[22m test');
	t.is(instance`This is a {bold \u{10FFFF}} test`, 'This is a \u001B[1m\u{10FFFF}\u001B[22m test');
});

```

---

### visible.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/142f5b555a-chalk/test/visible.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
import test from 'ava';

// Spoof supports-color
require('./_supports-color')(__dirname);

const chalk = require('../source');

test('visible: normal output when level > 0', t => {
	const instance = new chalk.Instance({level: 3});
	t.is(instance.visible.red('foo'), '\u001B[31mfoo\u001B[39m');
	t.is(instance.red.visible('foo'), '\u001B[31mfoo\u001B[39m');
});

test('visible: no output when level is too low', t => {
	const instance = new chalk.Instance({level: 0});
	t.is(instance.visible.red('foo'), '');
	t.is(instance.red.visible('foo'), '');
});

test('test switching back and forth between level == 0 and level > 0', t => {
	const instance = new chalk.Instance({level: 3});
	t.is(instance.red('foo'), '\u001B[31mfoo\u001B[39m');
	t.is(instance.visible.red('foo'), '\u001B[31mfoo\u001B[39m');
	t.is(instance.red.visible('foo'), '\u001B[31mfoo\u001B[39m');
	t.is(instance.visible('foo'), 'foo');
	t.is(instance.red('foo'), '\u001B[31mfoo\u001B[39m');

	instance.level = 0;
	t.is(instance.red('foo'), 'foo');
	t.is(instance.visible('foo'), '');
	t.is(instance.visible.red('foo'), '');
	t.is(instance.red.visible('foo'), '');
	t.is(instance.red('foo'), 'foo');

	instance.level = 3;
	t.is(instance.red('foo'), '\u001B[31mfoo\u001B[39m');
	t.is(instance.visible.red('foo'), '\u001B[31mfoo\u001B[39m');
	t.is(instance.red.visible('foo'), '\u001B[31mfoo\u001B[39m');
	t.is(instance.visible('foo'), 'foo');
	t.is(instance.red('foo'), '\u001B[31mfoo\u001B[39m');
});

```

---


## pathe@

**Funções usados neste arquivo:** resolve, dirname


## path-scurry@

**Funções usados neste arquivo:** resolve, dirname

### index.ts.test.cjs

**Caminho original:** `/tmp/ctest-repos-3nLWsr/afdea7bc35-path-scurry/tap-snapshots/test/index.ts.test.cjs`

**Funções testadas:**

- `resolve`
- `dirname`

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

**Funções usados neste arquivo:** resolve, dirname

### test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/c7cde3e261-path-exists/test.js`

**Funções testadas:**

- `resolve`
- `dirname`

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

**Funções usados neste arquivo:** resolve, dirname

### test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/bfb4e2a9c2-path-key/test.js`

**Funções testadas:**

- `resolve`
- `dirname`

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

**Funções usados neste arquivo:** resolve, dirname

### test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/9adaed72d2-path-is-absolute/test.js`

**Funções testadas:**

- `resolve`
- `dirname`

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

**Funções usados neste arquivo:** existsSync, mkdirSync

### get-options.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/3f4bb586f0-fs/test/common/get-options.js`

**Funções testadas:**

- `existsSync`
- `mkdirSync`

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

**Caminho original:** `/tmp/ctest-repos-3nLWsr/3f4bb586f0-fs/test/common/node.js`

**Funções testadas:**

- `existsSync`
- `mkdirSync`

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

**Caminho original:** `/tmp/ctest-repos-3nLWsr/3f4bb586f0-fs/test/cp/errors.js`

**Funções testadas:**

- `existsSync`
- `mkdirSync`

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

**Caminho original:** `/tmp/ctest-repos-3nLWsr/3f4bb586f0-fs/test/cp/index.js`

**Funções testadas:**

- `existsSync`
- `mkdirSync`

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

**Caminho original:** `/tmp/ctest-repos-3nLWsr/3f4bb586f0-fs/test/cp/polyfill.js`

**Funções testadas:**

- `existsSync`
- `mkdirSync`

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

**Caminho original:** `/tmp/ctest-repos-3nLWsr/3f4bb586f0-fs/test/move-file.js`

**Funções testadas:**

- `existsSync`
- `mkdirSync`

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

**Caminho original:** `/tmp/ctest-repos-3nLWsr/3f4bb586f0-fs/test/readdir-scoped.js`

**Funções testadas:**

- `existsSync`
- `mkdirSync`

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

**Caminho original:** `/tmp/ctest-repos-3nLWsr/3f4bb586f0-fs/test/with-temp-dir.js`

**Funções testadas:**

- `existsSync`
- `mkdirSync`

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

### get-options.js

**Caminho original:** `/tmp/ctest-repos-XwoGto/3f4bb586f0-fs/test/common/get-options.js`

**Funções testadas:**

- `existsSync`
- `mkdirSync`

*Arquivo de teste não disponível*

---

### node.js

**Caminho original:** `/tmp/ctest-repos-XwoGto/3f4bb586f0-fs/test/common/node.js`

**Funções testadas:**

- `existsSync`
- `mkdirSync`

*Arquivo de teste não disponível*

---

### errors.js

**Caminho original:** `/tmp/ctest-repos-XwoGto/3f4bb586f0-fs/test/cp/errors.js`

**Funções testadas:**

- `existsSync`
- `mkdirSync`

*Arquivo de teste não disponível*

---

### index.js

**Caminho original:** `/tmp/ctest-repos-XwoGto/3f4bb586f0-fs/test/cp/index.js`

**Funções testadas:**

- `existsSync`
- `mkdirSync`

*Arquivo de teste não disponível*

---

### polyfill.js

**Caminho original:** `/tmp/ctest-repos-XwoGto/3f4bb586f0-fs/test/cp/polyfill.js`

**Funções testadas:**

- `existsSync`
- `mkdirSync`

*Arquivo de teste não disponível*

---

### move-file.js

**Caminho original:** `/tmp/ctest-repos-XwoGto/3f4bb586f0-fs/test/move-file.js`

**Funções testadas:**

- `existsSync`
- `mkdirSync`

*Arquivo de teste não disponível*

---

### readdir-scoped.js

**Caminho original:** `/tmp/ctest-repos-XwoGto/3f4bb586f0-fs/test/readdir-scoped.js`

**Funções testadas:**

- `existsSync`
- `mkdirSync`

*Arquivo de teste não disponível*

---

### with-temp-dir.js

**Caminho original:** `/tmp/ctest-repos-XwoGto/3f4bb586f0-fs/test/with-temp-dir.js`

**Funções testadas:**

- `existsSync`
- `mkdirSync`

*Arquivo de teste não disponível*

---


## fs-constants@

**Funções usados neste arquivo:** existsSync, mkdirSync


## fs.realpath@

**Funções usados neste arquivo:** existsSync, mkdirSync

### monkeypatching.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/76accba941-fs.realpath/test/monkeypatching.js`

**Funções testadas:**

- `existsSync`
- `mkdirSync`

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

**Caminho original:** `/tmp/ctest-repos-3nLWsr/76accba941-fs.realpath/test/symlinks.js`

**Funções testadas:**

- `existsSync`
- `mkdirSync`

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


