# External Tests for database.js

Testes de dependências externas usadas neste arquivo.

**Arquivo:** `/workspaces/ctest/src/lib/database.js`

## Sumário

- **Total de componentes:** 25
- **Total de arquivos de teste:** 74

---

## adapter-libsql@7.4.2

**Funções usados neste arquivo:** PrismaClient, component, upsert, findMany, functionHit, $disconnect, PrismaLibSql, createClient

### get-options.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/3f4bb586f0-fs/test/common/get-options.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `findMany`
- `functionHit`
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

**Caminho original:** `/tmp/ctest-repos-lYpctN/3f4bb586f0-fs/test/common/node.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `findMany`
- `functionHit`
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

**Caminho original:** `/tmp/ctest-repos-lYpctN/3f4bb586f0-fs/test/cp/errors.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `findMany`
- `functionHit`
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

**Caminho original:** `/tmp/ctest-repos-lYpctN/3f4bb586f0-fs/test/cp/index.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `findMany`
- `functionHit`
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

**Caminho original:** `/tmp/ctest-repos-lYpctN/3f4bb586f0-fs/test/cp/polyfill.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `findMany`
- `functionHit`
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

**Caminho original:** `/tmp/ctest-repos-lYpctN/3f4bb586f0-fs/test/move-file.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `findMany`
- `functionHit`
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

**Caminho original:** `/tmp/ctest-repos-lYpctN/3f4bb586f0-fs/test/readdir-scoped.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `findMany`
- `functionHit`
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

**Caminho original:** `/tmp/ctest-repos-lYpctN/3f4bb586f0-fs/test/with-temp-dir.js`

**Funções testadas:**

- `PrismaClient`
- `component`
- `upsert`
- `findMany`
- `functionHit`
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


## client@7.4.2

**Funções usados neste arquivo:** PrismaClient, component, upsert, findMany, functionHit, $disconnect, PrismaLibSql, createClient

### default.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/helpers/test/presets/default.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
'use strict'

module.exports = {
  transform: {
    '^.+\\.(m?j|t)s$': '@swc/jest',
  },
  transformIgnorePatterns: [],
  testEnvironment: 'node',
  testMatch: ['**/src/**/*.test.ts'],
  collectCoverage: process.env.CI ? true : false,
  coverageReporters: ['clover'],
  coverageDirectory: 'src/__tests__/coverage',
  collectCoverageFrom: ['src/**/*.ts', '!**/__tests__/**/*', '!src/**/*.test.ts'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        addFileAttribute: 'true',
        ancestorSeparator: ' › ',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
      },
    ],
  ],
}

```

---

### withSnapshotSerializer.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/helpers/test/presets/withSnapshotSerializer.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
'use strict'
module.exports = {
  ...require('./default'),
  snapshotSerializers: ['@prisma/get-platform/src/test-utils/jestSnapshotSerializer'],
}

```

---

### generator.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/cli/src/__tests__/fixtures/dependent-generator/generator.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
#!/usr/bin/node

const { generatorHandler } = require('@prisma/generator-helper')

generatorHandler({
  onManifest() {
    return {
      defaultOutput: 'my-generator-output', // the value here doesn't matter, as it's resolved in https://github.com/prisma/prisma/blob/88fe98a09092d8e53e51f11b730c7672c19d1bd4/packages/sdk/src/get-generators/getGenerators.ts
      prettyName: 'I depend on the client',
      requiresEngines: [],
      requiresGenerators: ['prisma-client-js'],
    }
  },
  async onGenerate(options) {
    //
  },
})

```

---

### jest.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/adapter-d1-itx-error/jest.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
module.exports = require('../jest.config')

```

---

### jest.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/connection-limit-reached/jest.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
module.exports = require('../jest.config')

```

---

### jest.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/driver-adapters-custom-db-schema/adapter-neon/jest.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const defaultConfig = require('../jest.config')

module.exports = {
  ...defaultConfig,
  setupFiles: './jestSetup.js',
}

```

---

### jest.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/driver-adapters-custom-db-schema/adapter-pg/jest.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
module.exports = require('../jest.config')

```

---

### jest.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/jest.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
'use strict'

module.exports = () => {
  const configCommon = {
    rootDir: process.cwd(),
    testMatch: ['<rootDir>/tests/*.ts'],
    testPathIgnorePatterns: ['.*\\.d\\.ts'],
    transformIgnorePatterns: [],
    testTimeout: 60_000,
  }

  return {
    ...configCommon,
    transform: {
      '^.+\\.(m?j|t)s$': '@swc/jest',
    },
  }
}

```

---

### jest.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/mongodb-notablescan/jest.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
module.exports = require('../jest.config')

```

---

### next.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/10_monorepo-serverComponents-customOutput-noReExport/packages/service/next.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
}

```

---

### index.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/11_monorepo-noServerComponents-noCustomOutput-reExportIndirect/packages/db/index.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient } = require('@prisma/client')

const adapter = new PrismaPg({
  connectionString: process.env['TEST_E2E_POSTGRES_URI'],
})
const db = new PrismaClient({ adapter })

module.exports = { db }

```

---

### next.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/11_monorepo-noServerComponents-noCustomOutput-reExportIndirect/packages/service/next.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (isServer && process.env.WORKAROUND === 'true') {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  },
}

```

---

### test.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/11_monorepo-noServerComponents-noCustomOutput-reExportIndirect/packages/service/pages/api/test.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const { db } = require('db')

async function doPrismaQuery() {
  await db.user.deleteMany()
  const user = await db.user.create({
    data: {
      email: 'test',
    },
  })

  return user
}

export default async function handle(req, res) {
  res.json({ user: await doPrismaQuery() })
}

```

---

### index.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/12_monorepo-serverComponents-noCustomOutput-reExportIndirect/packages/db/index.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient } = require('@prisma/client')

const adapter = new PrismaPg({
  connectionString: process.env['TEST_E2E_POSTGRES_URI'],
})
const db = new PrismaClient({ adapter })

module.exports = { db }

```

---

### next.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/12_monorepo-serverComponents-noCustomOutput-reExportIndirect/packages/service/next.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (isServer && process.env.WORKAROUND === 'true') {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  },
}

```

---

### next.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/13_monorepo-noServerComponents-customOutput-reExportDirect/packages/service/next.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (isServer && process.env.WORKAROUND === 'true') {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  },
}

```

---

### test.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/13_monorepo-noServerComponents-customOutput-reExportDirect/packages/service/pages/api/test.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient } = require('db')

async function doPrismaQuery() {
  const adapter = new PrismaPg({
    connectionString: process.env['TEST_E2E_POSTGRES_URI'],
  })
  const prisma = new PrismaClient({ adapter })

  await prisma.user.deleteMany()
  const user = await prisma.user.create({
    data: {
      email: 'test',
    },
  })

  return user
}

export default async function handle(req, res) {
  res.json({ user: await doPrismaQuery() })
}

```

---

### next.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/14_monorepo-serverComponents-customOutput-reExportDirect/packages/service/next.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (isServer && process.env.WORKAROUND === 'true') {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  },
}

```

---

### index.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/15_monorepo-noServerComponents-customOutput-reExportIndirect/packages/db/index.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient } = require('./prisma/client')

const adapter = new PrismaPg({
  connectionString: process.env['TEST_E2E_POSTGRES_URI'],
})
const db = new PrismaClient({ adapter })

module.exports = { db }

```

---

### next.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/15_monorepo-noServerComponents-customOutput-reExportIndirect/packages/service/next.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (isServer && process.env.WORKAROUND === 'true') {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  },
}

```

---

### test.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/15_monorepo-noServerComponents-customOutput-reExportIndirect/packages/service/pages/api/test.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const { db } = require('db')

async function doPrismaQuery() {
  await db.user.deleteMany()
  const user = await db.user.create({
    data: {
      email: 'test',
    },
  })

  return user
}

export default async function handle(req, res) {
  res.json({ user: await doPrismaQuery() })
}

```

---

### index.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/16_monorepo-serverComponents-customOutput-reExportIndirect/packages/db/index.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient } = require('./prisma/client')

const adapter = new PrismaPg({
  connectionString: process.env['TEST_E2E_POSTGRES_URI'],
})
const db = new PrismaClient({ adapter })

module.exports = { db }

```

---

### next.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/16_monorepo-serverComponents-customOutput-reExportIndirect/packages/service/next.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (isServer && process.env.WORKAROUND === 'true') {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  },
}

```

---

### next.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/17_monorepo-noServerComponents-customOutput-reExportIndirect-ts/packages/service/next.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (isServer && process.env.WORKAROUND === 'true') {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  },
}

```

---

### next.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/18_monorepo-serverComponents-customOutput-reExportIndirect-ts/packages/service/next.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (isServer && process.env.WORKAROUND === 'true') {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  },
}

```

---

### next.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/3_simplerepo-noServerComponents-noCustomOutput-noReExport/next.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
}

```

---

### test.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/3_simplerepo-noServerComponents-noCustomOutput-noReExport/pages/api/test.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient } = require('@prisma/client')

async function doPrismaQuery() {
  const adapter = new PrismaPg({
    connectionString: process.env['TEST_E2E_POSTGRES_URI'],
  })
  const prisma = new PrismaClient({ adapter })

  await prisma.user.deleteMany()
  const user = await prisma.user.create({
    data: {
      email: 'test',
    },
  })

  return user
}

export default async function handle(req, res) {
  res.json({ user: await doPrismaQuery() })
}

```

---

### next.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/4_simplerepo-serverComponents-noCustomOutput-noReExport/next.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  experimental: {
    appDir: true,
  },
}

```

---

### next.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/5_simplerepo-noServerComponents-customOutput-noReExport/next.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
}

```

---

### test.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/5_simplerepo-noServerComponents-customOutput-noReExport/pages/api/test.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const { PrismaClient } = require('../../prisma/client')

async function doPrismaQuery() {
  const prisma = new PrismaClient()

  await prisma.user.deleteMany()
  const user = await prisma.user.create({
    data: {
      email: 'test',
    },
  })

  return user
}

export default async function handle(req, res) {
  res.json({ user: await doPrismaQuery() })
}

```

---

### next.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/6_simplerepo-serverComponents-customOutput-noReExport/next.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  experimental: {
    appDir: true,
  },
}

```

---

### next.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/7_monorepo-noServerComponents-noCustomOutput-noReExport/packages/service/next.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
}

```

---

### test.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/7_monorepo-noServerComponents-noCustomOutput-noReExport/packages/service/pages/api/test.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient } = require('@prisma/client')

async function doPrismaQuery() {
  const adapter = new PrismaPg({
    connectionString: process.env['TEST_E2E_POSTGRES_URI'],
  })
  const prisma = new PrismaClient({ adapter })

  await prisma.user.deleteMany()
  const user = await prisma.user.create({
    data: {
      email: 'test',
    },
  })

  return user
}

export default async function handle(req, res) {
  res.json({ user: await doPrismaQuery() })
}

```

---

### next.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/8_monorepo-serverComponents-noCustomOutput-noReExport/packages/service/next.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  experimental: {
    appDir: true,
  },
}

```

---

### next.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/9_monorepo-noServerComponents-customOutput-noReExport/packages/service/next.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
}

```

---

### test.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/nextjs-schema-not-found/9_monorepo-noServerComponents-customOutput-noReExport/packages/service/pages/api/test.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient } = require('../../prisma/client')

async function doPrismaQuery() {
  const adapter = new PrismaPg({
    connectionString: process.env['TEST_E2E_POSTGRES_URI'],
  })
  const prisma = new PrismaClient({ adapter })

  await prisma.user.deleteMany()
  const user = await prisma.user.create({
    data: {
      email: 'test',
    },
  })

  return user
}

export default async function handle(req, res) {
  res.json({ user: await doPrismaQuery() })
}

```

---

### jest.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/pg-global-type-parsers/jest.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
module.exports = require('../jest.config')

```

---

### jest.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/pg-self-signed-cert-error/jest.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
module.exports = require('../jest.config')

```

---

### jest.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/prisma-client-imports-mysql/jest.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
module.exports = require('../jest.config')

```

---

### jest.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/prisma-client-imports-postgres/jest.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
module.exports = require('../jest.config')

```

---

### jest.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/prisma-client-imports-sqlite/jest.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
module.exports = require('../jest.config')

```

---

### jest.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/prisma-client-mutually-exclusive-options/jest.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
module.exports = require('../jest.config')

```

---

### esm-import.mjs

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/e2e/typed-sql/src/esm-import.mjs`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { getEmail } from '@prisma/client/sql'

const adapter = new PrismaPg({
  connectionString: process.env['TEST_E2E_POSTGRES_URI'],
})
const prisma = new PrismaClient({ adapter })

const { id } = await prisma.user.create({
  data: { email: 'john-esm@doe.io' },
})

const userRaw = await prisma.$queryRawTyped(getEmail(id))

console.log(userRaw)

```

---

### globalSetup.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/functional/_utils/globalSetup.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
'use strict'
const glob = require('globby')
const fs = require('fs-extra')

// needed for jest to serialize BigInt: https://github.com/jestjs/jest/issues/11617
BigInt.prototype.toJSON = function () {
  return Number(this)
}

module.exports = (globalConfig) => {
  process.env['JEST_MAX_WORKERS'] = globalConfig.maxWorkers // expose info to test setup

  // we clear up all the files before we run the tests that are not type tests
  if (process.argv.join(' ').includes('--testPathIgnorePatterns typescript')) {
    glob
      // TODO: drop node_modules cleanup?
      .sync(['./tests/functional/**/.generated/', './tests/functional/**/node_modules/'], {
        onlyDirectories: true,
        dot: true,
      })
      .forEach((dir) => fs.removeSync(dir, { recursive: true }))
  }
}

```

---

### qpe-worker-entry.cjs

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/functional/_utils/qpe-worker-entry.cjs`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
// CommonJS wrapper to load qpe-worker.ts via tsx.
// This is needed because Node.js 20 doesn't recognize .ts/.mts extensions when spawning workers,
// even with --import tsx in execArgv. Using a .cjs entry point with tsx registration
// works reliably across Node.js versions.

'use strict'

require('tsx')
require('./qpe-worker.ts')

```

---

### esbuild-transformer.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/functional/esbuild-transformer.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const fs = require('fs')

const esbuild = require('esbuild')
const getCacheKeyFunction = require('@jest/create-cache-key-function').default

const nodeVersion = process.version.match(/v(\d+)/)[1] || '14'
const cacheKeyFunction = getCacheKeyFunction([], ['v1', nodeVersion])

function needsTranspilation(contents, filename) {
  if (filename.endsWith('.ts') === true) {
    return true
  }

  if (filename.endsWith('.mjs') === true) {
    return true
  }

  if (contents.includes('require(') === true) {
    return false
  }

  if (contents.includes('module.exports') === true) {
    return false
  }

  if (contents.includes('exports.') === true) {
    return false
  }

  return true
}

const transformer = {
  getCacheKey(contents, filename, ...rest) {
    return cacheKeyFunction(filename, fs.statSync(filename).mtimeMs.toString(), ...rest)
  },
  process(_content, filename, { transformerConfig }) {
    if (needsTranspilation(_content, filename) === true) {
      return esbuild.transformSync(_content, {
        sourcesContent: true,
        minify: false,
        sourcefile: filename,
        loader: 'ts',
        format: 'cjs',
        platform: 'node',
        target: `node${nodeVersion}`,
        keepNames: true,
        logLevel: 'error',
        sourcemap: true,
        ...transformerConfig,
      })
    }

    try {
      return {
        code: _content,
        map: fs.readFileSync(`${filename}.map`, 'utf8'),
      }
    } catch (e) {}

    return {
      code: _content,
    }
  },
}

module.exports = transformer

```

---

### jest.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/client/tests/functional/jest.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
'use strict'

const isMacOrWindowsCI = Boolean(process.env.CI) && ['darwin', 'win32'].includes(process.platform)

module.exports = () => {
  // Default
  let testTimeout = 30_000
  if (isMacOrWindowsCI) {
    testTimeout = 100_000
  }

  const configCommon = {
    testMatch: ['**/*.ts', '!(**/*.d.ts)', '!(**/_utils/**)', '!(**/_*.ts)', '!(**/.generated/**)'],
    transformIgnorePatterns: [],
    reporters: ['default'],
    globalSetup: './_utils/globalSetup.js',
    snapshotSerializers: ['@prisma/get-platform/src/test-utils/jestSnapshotSerializer'],
    setupFilesAfterEnv: ['./_utils/setupFilesAfterEnv.ts'],
    testTimeout,
    collectCoverage: process.env.CI ? true : false,
    prettierPath: '../../../../node_modules/prettier2',
  }

  if (process.env['JEST_JUNIT_DISABLE'] !== 'true') {
    configCommon.reporters.push([
      'jest-junit',
      {
        addFileAttribute: 'true',
        ancestorSeparator: ' › ',
        classNameTemplate: (vars) => {
          return vars.classname
            .replace(/(\(.*)provider=\w+,? ?(.*\))/, '$1$2')
            .replace(/(\(.*)providerFlavor=\w+,? ?(.*\))/, '$1$2')
            .replace(' ()', '')
        },
        titleTemplate: '{title}',
      },
    ])
  }

  return {
    ...configCommon,
    transform: {
      '^.+\\.(m?j|t)s$': ['./esbuild-transformer', {}],
    },
  }
}

```

---

### prisma.config.cjs

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/config/src/__tests__/fixtures/loadConfigFromFile/default-location/cjs/prisma.config.cjs`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const { defineConfig } = require('src/index')

module.exports = defineConfig({})

```

---

### prisma.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/config/src/__tests__/fixtures/loadConfigFromFile/default-location/js/prisma.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const { defineConfig } = require('src/index')

module.exports = defineConfig({})

```

---

### prisma.config.mjs

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/config/src/__tests__/fixtures/loadConfigFromFile/default-location/mjs/prisma.config.mjs`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
import { defineConfig } from 'src/index'

export default defineConfig({})

```

---

### prisma.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/config/src/__tests__/fixtures/loadConfigFromFile/precedence/.config/prisma.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
import { defineConfig } from 'src/index'

export default defineConfig({})

```

---

### prisma.config.cjs

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/config/src/__tests__/fixtures/loadConfigFromFile/precedence/prisma.config.cjs`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const { defineConfig } = require('src/index')

module.exports = defineConfig({})

```

---

### prisma.config.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/config/src/__tests__/fixtures/loadConfigFromFile/precedence/prisma.config.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
const { defineConfig } = require('src/index')

module.exports = defineConfig({})

```

---

### prisma.config.mjs

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/config/src/__tests__/fixtures/loadConfigFromFile/precedence/prisma.config.mjs`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
import { defineConfig } from 'src/index'

export default defineConfig({})

```

---

### seed.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/migrate/src/__tests__/fixtures/seed-from-prisma-config/seed-sqlite-js-extra-args/prisma/seed.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
// Using parseArgs would be better, but it's only available in v18.3.0, v16.17.0 and up
// https://nodejs.org/api/util.html#utilparseargsconfig
// import { parseArgs } from 'node:util';

async function main() {
  await new Promise((resolve) => setTimeout(resolve, 0))
  console.log('Hello from seed.js')

  // From package.json
  if (!process.argv.find((arg) => arg.startsWith('--my-custom-arg-from-config-1'))) {
    throw new Error(`Missing custom arg --my-custom-arg-from-config-1 (from package.json)`)
  }
  if (!process.argv.find((arg) => arg.startsWith('--my-custom-arg-from-config-2'))) {
    throw new Error(`Missing custom arg --my-custom-arg-from-config-2 (from package.json)`)
  }
  if (!process.argv.includes('-y')) {
    throw new Error(`Missing custom arg -y (from package.json)`)
  }

  // From CLI call
  if (!process.argv.find((arg) => arg.startsWith('--my-custom-arg-from-cli-1'))) {
    throw new Error(`Missing custom arg --my-custom-arg-from-cli (from CLI call)`)
  }
  if (!process.argv.find((arg) => arg.startsWith('--my-custom-arg-from-cli-2'))) {
    throw new Error(`Missing custom arg --my-custom-arg-from-cli (from CLI call)`)
  }
  if (!process.argv.includes('-z')) {
    throw new Error(`Missing custom arg -z (from CLI call)`)
  }
}

main()
  .then(() => console.log('Goodbye from seed.js'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

```

---

### seed.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/migrate/src/__tests__/fixtures/seed-from-prisma-config/seed-sqlite-js/prisma/seed.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
async function main() {
  await new Promise((resolve) => setTimeout(resolve, 0))
  console.log('Hello from seed.js')
}

main()
  .then(() => console.log('Goodbye from seed.js'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

```

---

### seed-deprecated.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/migrate/src/__tests__/fixtures/seed-from-prisma-config/seed-sqlite-skips-deprecated-package-json/prisma/seed-deprecated.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
async function main() {
  await new Promise((resolve) => setTimeout(resolve, 0))
  console.log('Hello from seed-deprecated.js')
}

main()
  .then(() => console.log('Goodbye from seed-deprecated.js'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

```

---

### seed.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/407a970512-adapter-libsql/packages/migrate/src/__tests__/fixtures/seed-from-prisma-config/seed-sqlite-skips-deprecated-package-json/prisma/seed.js`

**Funções testadas:**

- `createClient`

**Conteúdo do arquivo de teste:**

```javascript
async function main() {
  await new Promise((resolve) => setTimeout(resolve, 0))
  console.log('Hello from seed.js')
}

main()
  .then(() => console.log('Goodbye from seed.js'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

```

---


## prisma@7.4.2

**Funções usados neste arquivo:** PrismaClient, component, upsert, findMany, functionHit, $disconnect, PrismaLibSql


## driver-adapter-utils@7.4.2

**Funções usados neste arquivo:** PrismaClient, component, upsert, findMany, functionHit, $disconnect, PrismaLibSql


## client-runtime-utils@7.4.2

**Funções usados neste arquivo:** PrismaClient, component, upsert, findMany, functionHit, $disconnect, PrismaLibSql


## config@7.4.2

**Funções usados neste arquivo:** PrismaClient, component, upsert, findMany, functionHit, $disconnect, PrismaLibSql


## engines@7.4.2

**Funções usados neste arquivo:** PrismaClient, component, upsert, findMany, functionHit, $disconnect, PrismaLibSql


## debug@7.4.2

**Funções usados neste arquivo:** PrismaClient, component, upsert, findMany, functionHit, $disconnect, PrismaLibSql


## prisma-ast@0.13.1

**Funções usados neste arquivo:** PrismaClient, component, upsert, findMany, functionHit, $disconnect, PrismaLibSql


## get-platform@7.2.0

**Funções usados neste arquivo:** PrismaClient, component, upsert, findMany, functionHit, $disconnect, PrismaLibSql


## query-plan-executor@7.2.0

**Funções usados neste arquivo:** PrismaClient, component, upsert, findMany, functionHit, $disconnect, PrismaLibSql


## engines-version@7.5.0-10.94a226be1cf2967af2541cca5529f0f7ba866919

**Funções usados neste arquivo:** PrismaClient, component, upsert, findMany, functionHit, $disconnect, PrismaLibSql


## fetch-engine@7.4.2

**Funções usados neste arquivo:** PrismaClient, component, upsert, findMany, functionHit, $disconnect, PrismaLibSql


## libsql@0.5.22

**Funções usados neste arquivo:** createClient


## core@0.17.0

**Funções usados neste arquivo:** createClient


## hrana-client@0.9.0

**Funções usados neste arquivo:** createClient


## linux-x64-gnu@0.5.22

**Funções usados neste arquivo:** createClient


## linux-x64-musl@0.5.22

**Funções usados neste arquivo:** createClient


## isomorphic-ws@0.1.5

**Funções usados neste arquivo:** createClient


## pathe@2.0.3

**Funções usados neste arquivo:** resolve, dirname


## path-scurry@1.11.1

**Funções usados neste arquivo:** resolve, dirname


## path-exists@4.0.0

**Funções usados neste arquivo:** resolve, dirname


## path-key@3.1.1

**Funções usados neste arquivo:** resolve, dirname


## path-is-absolute@1.0.1

**Funções usados neste arquivo:** resolve, dirname


## fs@

**Funções usados neste arquivo:** existsSync, mkdirSync

### get-options.js

**Caminho original:** `/tmp/ctest-repos-lYpctN/3f4bb586f0-fs/test/common/get-options.js`

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

**Caminho original:** `/tmp/ctest-repos-lYpctN/3f4bb586f0-fs/test/common/node.js`

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

**Caminho original:** `/tmp/ctest-repos-lYpctN/3f4bb586f0-fs/test/cp/errors.js`

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

**Caminho original:** `/tmp/ctest-repos-lYpctN/3f4bb586f0-fs/test/cp/index.js`

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

**Caminho original:** `/tmp/ctest-repos-lYpctN/3f4bb586f0-fs/test/cp/polyfill.js`

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

**Caminho original:** `/tmp/ctest-repos-lYpctN/3f4bb586f0-fs/test/move-file.js`

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

**Caminho original:** `/tmp/ctest-repos-lYpctN/3f4bb586f0-fs/test/readdir-scoped.js`

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

**Caminho original:** `/tmp/ctest-repos-lYpctN/3f4bb586f0-fs/test/with-temp-dir.js`

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


