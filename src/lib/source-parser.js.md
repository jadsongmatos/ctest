# External Tests for source-parser.js

Testes de dependências externas usadas neste arquivo.

**Arquivo:** `/workspaces/ctest/src/lib/source-parser.js`

## Sumário

- **Total de componentes:** 51
- **Total de arquivos de teste:** 106

---

## fs@

**Funções usados neste arquivo:** readFileSync, readdirSync

### get-options.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/3f4bb586f0-fs/test/common/get-options.js`

**Funções testadas:**

- `readFileSync`
- `readdirSync`

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

- `readFileSync`
- `readdirSync`

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

- `readFileSync`
- `readdirSync`

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

- `readFileSync`
- `readdirSync`

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

- `readFileSync`
- `readdirSync`

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

- `readFileSync`
- `readdirSync`

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

- `readFileSync`
- `readdirSync`

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

- `readFileSync`
- `readdirSync`

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

- `readFileSync`
- `readdirSync`

*Arquivo de teste não disponível*

---

### node.js

**Caminho original:** `/tmp/ctest-repos-XwoGto/3f4bb586f0-fs/test/common/node.js`

**Funções testadas:**

- `readFileSync`
- `readdirSync`

*Arquivo de teste não disponível*

---

### errors.js

**Caminho original:** `/tmp/ctest-repos-XwoGto/3f4bb586f0-fs/test/cp/errors.js`

**Funções testadas:**

- `readFileSync`
- `readdirSync`

*Arquivo de teste não disponível*

---

### index.js

**Caminho original:** `/tmp/ctest-repos-XwoGto/3f4bb586f0-fs/test/cp/index.js`

**Funções testadas:**

- `readFileSync`
- `readdirSync`

*Arquivo de teste não disponível*

---

### polyfill.js

**Caminho original:** `/tmp/ctest-repos-XwoGto/3f4bb586f0-fs/test/cp/polyfill.js`

**Funções testadas:**

- `readFileSync`
- `readdirSync`

*Arquivo de teste não disponível*

---

### move-file.js

**Caminho original:** `/tmp/ctest-repos-XwoGto/3f4bb586f0-fs/test/move-file.js`

**Funções testadas:**

- `readFileSync`
- `readdirSync`

*Arquivo de teste não disponível*

---

### readdir-scoped.js

**Caminho original:** `/tmp/ctest-repos-XwoGto/3f4bb586f0-fs/test/readdir-scoped.js`

**Funções testadas:**

- `readFileSync`
- `readdirSync`

*Arquivo de teste não disponível*

---

### with-temp-dir.js

**Caminho original:** `/tmp/ctest-repos-XwoGto/3f4bb586f0-fs/test/with-temp-dir.js`

**Funções testadas:**

- `readFileSync`
- `readdirSync`

*Arquivo de teste não disponível*

---


## fs-constants@

**Funções usados neste arquivo:** readFileSync, readdirSync


## fs.realpath@

**Funções usados neste arquivo:** readFileSync, readdirSync

### monkeypatching.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/76accba941-fs.realpath/test/monkeypatching.js`

**Funções testadas:**

- `readFileSync`
- `readdirSync`

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

- `readFileSync`
- `readdirSync`

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


## core@7.29.0

**Funções usados neste arquivo:** parse


## babel-plugin-istanbul@7.0.1

**Funções usados neste arquivo:** parse


## babel-jest@30.2.0

**Funções usados neste arquivo:** parse


## code-frame@7.29.0

**Funções usados neste arquivo:** parse

### test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/ad20f0875a-promise-retry/test/test.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

var expect = require('expect.js');
var promiseRetry = require('../');
var promiseDelay = require('sleep-promise');

describe('promise-retry', function () {
    it('should call fn again if retry was called', function () {
        var count = 0;

        return promiseRetry(function (retry) {
            count += 1;

            return promiseDelay(10)
            .then(function () {
                if (count <= 2) {
                    retry(new Error('foo'));
                }

                return 'final';
            });
        }, { factor: 1 })
        .then(function (value) {
            expect(value).to.be('final');
            expect(count).to.be(3);
        }, function () {
            throw new Error('should not fail');
        });
    });

    it('should call fn with the attempt number', function () {
        var count = 0;

        return promiseRetry(function (retry, number) {
            count += 1;
            expect(count).to.equal(number);

            return promiseDelay(10)
            .then(function () {
                if (count <= 2) {
                    retry(new Error('foo'));
                }

                return 'final';
            });
        }, { factor: 1 })
        .then(function (value) {
            expect(value).to.be('final');
            expect(count).to.be(3);
        }, function () {
            throw new Error('should not fail');
        });
    });

    it('should not retry on fulfillment if retry was not called', function () {
        var count = 0;

        return promiseRetry(function () {
            count += 1;

            return promiseDelay(10)
            .then(function () {
                return 'final';
            });
        })
        .then(function (value) {
            expect(value).to.be('final');
            expect(count).to.be(1);
        }, function () {
            throw new Error('should not fail');
        });
    });

    it('should not retry on rejection if retry was not called', function () {
        var count = 0;

        return promiseRetry(function () {
            count += 1;

            return promiseDelay(10)
            .then(function () {
                throw new Error('foo');
            });
        })
        .then(function () {
            throw new Error('should not succeed');
        }, function (err) {
            expect(err.message).to.be('foo');
            expect(count).to.be(1);
        });
    });

    it('should not retry on rejection if nr of retries is 0', function () {
        var count = 0;

        return promiseRetry(function (retry) {
            count += 1;

            return promiseDelay(10)
            .then(function () {
                throw new Error('foo');
            })
            .catch(retry);
        }, { retries : 0 })
        .then(function () {
            throw new Error('should not succeed');
        }, function (err) {
            expect(err.message).to.be('foo');
            expect(count).to.be(1);
        });
    });

    it('should reject the promise if the retries were exceeded', function () {
        var count = 0;

        return promiseRetry(function (retry) {
            count += 1;

            return promiseDelay(10)
            .then(function () {
                throw new Error('foo');
            })
            .catch(retry);
        }, { retries: 2, factor: 1 })
        .then(function () {
            throw new Error('should not succeed');
        }, function (err) {
            expect(err.message).to.be('foo');
            expect(count).to.be(3);
        });
    });

    it('should pass options to the underlying retry module', function () {
        var count = 0;

        return promiseRetry(function (retry) {
            return promiseDelay(10)
            .then(function () {
                if (count < 2) {
                    count += 1;
                    retry(new Error('foo'));
                }

                return 'final';
            });
        }, { retries: 1, factor: 1 })
        .then(function () {
            throw new Error('should not succeed');
        }, function (err) {
            expect(err.message).to.be('foo');
        });
    });

    it('should convert direct fulfillments into promises', function () {
        return promiseRetry(function () {
            return 'final';
        }, { factor: 1 })
        .then(function (value) {
            expect(value).to.be('final');
        }, function () {
            throw new Error('should not fail');
        });
    });

    it('should convert direct rejections into promises', function () {
        promiseRetry(function () {
            throw new Error('foo');
        }, { retries: 1, factor: 1 })
        .then(function () {
            throw new Error('should not succeed');
        }, function (err) {
            expect(err.message).to.be('foo');
        });
    });

    it('should not crash on undefined rejections', function () {
        return promiseRetry(function () {
            throw undefined;
        }, { retries: 1, factor: 1 })
        .then(function () {
            throw new Error('should not succeed');
        }, function (err) {
            expect(err).to.be(undefined);
        })
        .then(function () {
            return promiseRetry(function (retry) {
                retry();
            }, { retries: 1, factor: 1 });
        })
        .then(function () {
            throw new Error('should not succeed');
        }, function (err) {
            expect(err).to.be(undefined);
        });
    });

    it('should retry if retry() was called with undefined', function () {
        var count = 0;

        return promiseRetry(function (retry) {
            count += 1;

            return promiseDelay(10)
            .then(function () {
                if (count <= 2) {
                    retry();
                }

                return 'final';
            });
        }, { factor: 1 })
        .then(function (value) {
            expect(value).to.be('final');
            expect(count).to.be(3);
        }, function () {
            throw new Error('should not fail');
        });
    });

    it('should work with several retries in the same chain', function () {
        var count = 0;

        return promiseRetry(function (retry) {
            count += 1;

            return promiseDelay(10)
            .then(function () {
                retry(new Error('foo'));
            })
            .catch(function (err) {
                retry(err);
            });
        }, { retries: 1, factor: 1 })
        .then(function () {
            throw new Error('should not succeed');
        }, function (err) {
            expect(err.message).to.be('foo');
            expect(count).to.be(2);
        });
    });

    it('should allow options to be passed first', function () {
        var count = 0;

        return promiseRetry({ factor: 1 }, function (retry) {
            count += 1;

            return promiseDelay(10)
                .then(function () {
                    if (count <= 2) {
                        retry(new Error('foo'));
                    }

                    return 'final';
                });
        }).then(function (value) {
            expect(value).to.be('final');
            expect(count).to.be(3);
        }, function () {
            throw new Error('should not fail');
        });
    });
});

```

---


## generator@7.29.1

**Funções usados neste arquivo:** parse

### basic.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/438235718b-simple-concat/test/basic.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
var concat = require('../')
var stream = require('stream')
var test = require('tape')

test('basic', function (t) {
  t.plan(2)
  var s = new stream.PassThrough()
  concat(s, function (err, buf) {
    t.error(err)
    t.deepEqual(buf, Buffer.from('abc123456789'))
  })
  s.write('abc')
  setTimeout(function () {
    s.write('123')
  }, 10)
  setTimeout(function () {
    s.write('456')
  }, 20)
  setTimeout(function () {
    s.end('789')
  }, 30)
})

test('error', function (t) {
  t.plan(2)
  var s = new stream.PassThrough()
  concat(s, function (err, buf) {
    t.ok(err, 'got expected error')
    t.ok(!buf)
  })
  s.write('abc')
  setTimeout(function () {
    s.write('123')
  }, 10)
  setTimeout(function () {
    s.write('456')
  }, 20)
  setTimeout(function () {
    s.emit('error', new Error('error'))
  }, 30)
})

```

---


## plugin-syntax-jsx@7.28.6

**Funções usados neste arquivo:** parse

### extract.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/f3932dd763-tar-stream/test/extract.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
var test = require('tape')
var tar = require('../index')
var fixtures = require('./fixtures')
var concat = require('concat-stream')
var fs = require('fs')

var clamp = function (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

test('one-file', function (t) {
  t.plan(3)

  var extract = tar.extract()
  var noEntries = false

  extract.on('entry', function (header, stream, callback) {
    t.deepEqual(header, {
      name: 'test.txt',
      mode: parseInt('644', 8),
      uid: 501,
      gid: 20,
      size: 12,
      mtime: new Date(1387580181000),
      type: 'file',
      linkname: null,
      uname: 'maf',
      gname: 'staff',
      devmajor: 0,
      devminor: 0
    })

    stream.pipe(concat(function (data) {
      noEntries = true
      t.same(data.toString(), 'hello world\n')
      callback()
    }))
  })

  extract.on('finish', function () {
    t.ok(noEntries)
  })

  extract.end(fs.readFileSync(fixtures.ONE_FILE_TAR))
})

test('chunked-one-file', function (t) {
  t.plan(3)

  var extract = tar.extract()
  var noEntries = false

  extract.on('entry', function (header, stream, callback) {
    t.deepEqual(header, {
      name: 'test.txt',
      mode: parseInt('644', 8),
      uid: 501,
      gid: 20,
      size: 12,
      mtime: new Date(1387580181000),
      type: 'file',
      linkname: null,
      uname: 'maf',
      gname: 'staff',
      devmajor: 0,
      devminor: 0
    })

    stream.pipe(concat(function (data) {
      noEntries = true
      t.same(data.toString(), 'hello world\n')
      callback()
    }))
  })

  extract.on('finish', function () {
    t.ok(noEntries)
  })

  var b = fs.readFileSync(fixtures.ONE_FILE_TAR)

  for (var i = 0; i < b.length; i += 321) {
    extract.write(b.slice(i, clamp(i + 321, b.length, b.length)))
  }
  extract.end()
})

test('multi-file', function (t) {
  t.plan(5)

  var extract = tar.extract()
  var noEntries = false

  var onfile1 = function (header, stream, callback) {
    t.deepEqual(header, {
      name: 'file-1.txt',
      mode: parseInt('644', 8),
      uid: 501,
      gid: 20,
      size: 12,
      mtime: new Date(1387580181000),
      type: 'file',
      linkname: null,
      uname: 'maf',
      gname: 'staff',
      devmajor: 0,
      devminor: 0
    })

    extract.on('entry', onfile2)
    stream.pipe(concat(function (data) {
      t.same(data.toString(), 'i am file-1\n')
      callback()
    }))
  }

  var onfile2 = function (header, stream, callback) {
    t.deepEqual(header, {
      name: 'file-2.txt',
      mode: parseInt('644', 8),
      uid: 501,
      gid: 20,
      size: 12,
      mtime: new Date(1387580181000),
      type: 'file',
      linkname: null,
      uname: 'maf',
      gname: 'staff',
      devmajor: 0,
      devminor: 0
    })

    stream.pipe(concat(function (data) {
      noEntries = true
      t.same(data.toString(), 'i am file-2\n')
      callback()
    }))
  }

  extract.once('entry', onfile1)

  extract.on('finish', function () {
    t.ok(noEntries)
  })

  extract.end(fs.readFileSync(fixtures.MULTI_FILE_TAR))
})

test('chunked-multi-file', function (t) {
  t.plan(5)

  var extract = tar.extract()
  var noEntries = false

  var onfile1 = function (header, stream, callback) {
    t.deepEqual(header, {
      name: 'file-1.txt',
      mode: parseInt('644', 8),
      uid: 501,
      gid: 20,
      size: 12,
      mtime: new Date(1387580181000),
      type: 'file',
      linkname: null,
      uname: 'maf',
      gname: 'staff',
      devmajor: 0,
      devminor: 0
    })

    extract.on('entry', onfile2)
    stream.pipe(concat(function (data) {
      t.same(data.toString(), 'i am file-1\n')
      callback()
    }))
  }

  var onfile2 = function (header, stream, callback) {
    t.deepEqual(header, {
      name: 'file-2.txt',
      mode: parseInt('644', 8),
      uid: 501,
      gid: 20,
      size: 12,
      mtime: new Date(1387580181000),
      type: 'file',
      linkname: null,
      uname: 'maf',
      gname: 'staff',
      devmajor: 0,
      devminor: 0
    })

    stream.pipe(concat(function (data) {
      noEntries = true
      t.same(data.toString(), 'i am file-2\n')
      callback()
    }))
  }

  extract.once('entry', onfile1)

  extract.on('finish', function () {
    t.ok(noEntries)
  })

  var b = fs.readFileSync(fixtures.MULTI_FILE_TAR)
  for (var i = 0; i < b.length; i += 321) {
    extract.write(b.slice(i, clamp(i + 321, b.length, b.length)))
  }
  extract.end()
})

test('pax', function (t) {
  t.plan(3)

  var extract = tar.extract()
  var noEntries = false

  extract.on('entry', function (header, stream, callback) {
    t.deepEqual(header, {
      name: 'pax.txt',
      mode: parseInt('644', 8),
      uid: 501,
      gid: 20,
      size: 12,
      mtime: new Date(1387580181000),
      type: 'file',
      linkname: null,
      uname: 'maf',
      gname: 'staff',
      devmajor: 0,
      devminor: 0,
      pax: { path: 'pax.txt', special: 'sauce' }
    })

    stream.pipe(concat(function (data) {
      noEntries = true
      t.same(data.toString(), 'hello world\n')
      callback()
    }))
  })

  extract.on('finish', function () {
    t.ok(noEntries)
  })

  extract.end(fs.readFileSync(fixtures.PAX_TAR))
})

test('types', function (t) {
  t.plan(3)

  var extract = tar.extract()
  var noEntries = false

  var ondir = function (header, stream, callback) {
    t.deepEqual(header, {
      name: 'directory',
      mode: parseInt('755', 8),
      uid: 501,
      gid: 20,
      size: 0,
      mtime: new Date(1387580181000),
      type: 'directory',
      linkname: null,
      uname: 'maf',
      gname: 'staff',
      devmajor: 0,
      devminor: 0
    })
    stream.on('data', function () {
      t.ok(false)
    })
    extract.once('entry', onlink)
    callback()
  }

  var onlink = function (header, stream, callback) {
    t.deepEqual(header, {
      name: 'directory-link',
      mode: parseInt('755', 8),
      uid: 501,
      gid: 20,
      size: 0,
      mtime: new Date(1387580181000),
      type: 'symlink',
      linkname: 'directory',
      uname: 'maf',
      gname: 'staff',
      devmajor: 0,
      devminor: 0
    })
    stream.on('data', function () {
      t.ok(false)
    })
    noEntries = true
    callback()
  }

  extract.once('entry', ondir)

  extract.on('finish', function () {
    t.ok(noEntries)
  })

  extract.end(fs.readFileSync(fixtures.TYPES_TAR))
})

test('long-name', function (t) {
  t.plan(3)

  var extract = tar.extract()
  var noEntries = false

  extract.on('entry', function (header, stream, callback) {
    t.deepEqual(header, {
      name: 'my/file/is/longer/than/100/characters/and/should/use/the/prefix/header/foobarbaz/foobarbaz/foobarbaz/foobarbaz/foobarbaz/foobarbaz/filename.txt',
      mode: parseInt('644', 8),
      uid: 501,
      gid: 20,
      size: 16,
      mtime: new Date(1387580181000),
      type: 'file',
      linkname: null,
      uname: 'maf',
      gname: 'staff',
      devmajor: 0,
      devminor: 0
    })

    stream.pipe(concat(function (data) {
      noEntries = true
      t.same(data.toString(), 'hello long name\n')
      callback()
    }))
  })

  extract.on('finish', function () {
    t.ok(noEntries)
  })

  extract.end(fs.readFileSync(fixtures.LONG_NAME_TAR))
})

test('unicode-bsd', function (t) { // can unpack a bsdtar unicoded tarball
  t.plan(3)

  var extract = tar.extract()
  var noEntries = false

  extract.on('entry', function (header, stream, callback) {
    t.deepEqual(header, {
      name: 'høllø.txt',
      mode: parseInt('644', 8),
      uid: 501,
      gid: 20,
      size: 4,
      mtime: new Date(1387588646000),
      pax: { 'SCHILY.dev': '16777217', 'SCHILY.ino': '3599143', 'SCHILY.nlink': '1', atime: '1387589077', ctime: '1387588646', path: 'høllø.txt' },
      type: 'file',
      linkname: null,
      uname: 'maf',
      gname: 'staff',
      devmajor: 0,
      devminor: 0
    })

    stream.pipe(concat(function (data) {
      noEntries = true
      t.same(data.toString(), 'hej\n')
      callback()
    }))
  })

  extract.on('finish', function () {
    t.ok(noEntries)
  })

  extract.end(fs.readFileSync(fixtures.UNICODE_BSD_TAR))
})

test('unicode', function (t) { // can unpack a bsdtar unicoded tarball
  t.plan(3)

  var extract = tar.extract()
  var noEntries = false

  extract.on('entry', function (header, stream, callback) {
    t.deepEqual(header, {
      name: 'høstål.txt',
      mode: parseInt('644', 8),
      uid: 501,
      gid: 20,
      size: 8,
      mtime: new Date(1387580181000),
      pax: { path: 'høstål.txt' },
      type: 'file',
      linkname: null,
      uname: 'maf',
      gname: 'staff',
      devmajor: 0,
      devminor: 0
    })

    stream.pipe(concat(function (data) {
      noEntries = true
      t.same(data.toString(), 'høllø\n')
      callback()
    }))
  })

  extract.on('finish', function () {
    t.ok(noEntries)
  })

  extract.end(fs.readFileSync(fixtures.UNICODE_TAR))
})

test('name-is-100', function (t) {
  t.plan(3)

  var extract = tar.extract()

  extract.on('entry', function (header, stream, callback) {
    t.same(header.name.length, 100)

    stream.pipe(concat(function (data) {
      t.same(data.toString(), 'hello\n')
      callback()
    }))
  })

  extract.on('finish', function () {
    t.ok(true)
  })

  extract.end(fs.readFileSync(fixtures.NAME_IS_100_TAR))
})

test('invalid-file', function (t) {
  t.plan(1)

  var extract = tar.extract()

  extract.on('error', function (err) {
    t.ok(!!err)
    extract.destroy()
  })

  extract.end(fs.readFileSync(fixtures.INVALID_TGZ))
})

test('space prefixed', function (t) {
  t.plan(5)

  var extract = tar.extract()

  extract.on('entry', function (header, stream, callback) {
    t.ok(true)
    callback()
  })

  extract.on('finish', function () {
    t.ok(true)
  })

  extract.end(fs.readFileSync(fixtures.SPACE_TAR_GZ))
})

test('gnu long path', function (t) {
  t.plan(2)

  var extract = tar.extract()

  extract.on('entry', function (header, stream, callback) {
    t.ok(header.name.length > 100)
    callback()
  })

  extract.on('finish', function () {
    t.ok(true)
  })

  extract.end(fs.readFileSync(fixtures.GNU_LONG_PATH))
})

test('base 256 uid and gid', function (t) {
  t.plan(2)
  var extract = tar.extract()

  extract.on('entry', function (header, stream, callback) {
    t.ok(header.uid === 116435139)
    t.ok(header.gid === 1876110778)
    callback()
  })

  extract.end(fs.readFileSync(fixtures.BASE_256_UID_GID))
})

test('base 256 size', function (t) {
  t.plan(2)

  var extract = tar.extract()

  extract.on('entry', function (header, stream, callback) {
    t.deepEqual(header, {
      name: 'test.txt',
      mode: parseInt('644', 8),
      uid: 501,
      gid: 20,
      size: 12,
      mtime: new Date(1387580181000),
      type: 'file',
      linkname: null,
      uname: 'maf',
      gname: 'staff',
      devmajor: 0,
      devminor: 0
    })
    callback()
  })

  extract.on('finish', function () {
    t.ok(true)
  })

  extract.end(fs.readFileSync(fixtures.BASE_256_SIZE))
})

test('latin-1', function (t) { // can unpack filenames encoded in latin-1
  t.plan(3)

  // This is the older name for the "latin1" encoding in Node
  var extract = tar.extract({ filenameEncoding: 'binary' })
  var noEntries = false

  extract.on('entry', function (header, stream, callback) {
    t.deepEqual(header, {
      name: 'En français, s\'il vous plaît?.txt',
      mode: parseInt('644', 8),
      uid: 0,
      gid: 0,
      size: 14,
      mtime: new Date(1495941034000),
      type: 'file',
      linkname: null,
      uname: 'root',
      gname: 'root',
      devmajor: 0,
      devminor: 0
    })

    stream.pipe(concat(function (data) {
      noEntries = true
      t.same(data.toString(), 'Hello, world!\n')
      callback()
    }))
  })

  extract.on('finish', function () {
    t.ok(noEntries)
  })

  extract.end(fs.readFileSync(fixtures.LATIN1_TAR))
})

test('incomplete', function (t) {
  t.plan(1)

  var extract = tar.extract()

  extract.on('entry', function (header, stream, callback) {
    callback()
  })

  extract.on('error', function (err) {
    t.same(err.message, 'Unexpected end of data')
  })

  extract.on('finish', function () {
    t.fail('should not finish')
  })

  extract.end(fs.readFileSync(fixtures.INCOMPLETE_TAR))
})

test('gnu', function (t) { // can correctly unpack gnu-tar format
  t.plan(3)

  var extract = tar.extract()
  var noEntries = false

  extract.on('entry', function (header, stream, callback) {
    t.deepEqual(header, {
      name: 'test.txt',
      mode: parseInt('644', 8),
      uid: 12345,
      gid: 67890,
      size: 14,
      mtime: new Date(1559239869000),
      type: 'file',
      linkname: null,
      uname: 'myuser',
      gname: 'mygroup',
      devmajor: 0,
      devminor: 0
    })

    stream.pipe(concat(function (data) {
      noEntries = true
      t.same(data.toString(), 'Hello, world!\n')
      callback()
    }))
  })

  extract.on('finish', function () {
    t.ok(noEntries)
  })

  extract.end(fs.readFileSync(fixtures.GNU_TAR))
})

test('gnu-incremental', function (t) {
  // can correctly unpack gnu-tar incremental format. In this situation,
  // the tarball will have additional ctime and atime values in the header,
  // and without awareness of the 'gnu' tar format, the atime (offset 345) is mistaken
  // for a directory prefix (also offset 345).
  t.plan(3)

  var extract = tar.extract()
  var noEntries = false

  extract.on('entry', function (header, stream, callback) {
    t.deepEqual(header, {
      name: 'test.txt',
      mode: parseInt('644', 8),
      uid: 12345,
      gid: 67890,
      size: 14,
      mtime: new Date(1559239869000),
      type: 'file',
      linkname: null,
      uname: 'myuser',
      gname: 'mygroup',
      devmajor: 0,
      devminor: 0
    })

    stream.pipe(concat(function (data) {
      noEntries = true
      t.same(data.toString(), 'Hello, world!\n')
      callback()
    }))
  })

  extract.on('finish', function () {
    t.ok(noEntries)
  })

  extract.end(fs.readFileSync(fixtures.GNU_INCREMENTAL_TAR))
})

test('v7 unsupported', function (t) { // correctly fails to parse v7 tarballs
  t.plan(1)

  var extract = tar.extract()

  extract.on('error', function (err) {
    t.ok(!!err)
    extract.destroy()
  })

  extract.end(fs.readFileSync(fixtures.V7_TAR))
})

test('unknown format doesn\'t extract by default', function (t) {
  t.plan(1)

  var extract = tar.extract()

  extract.on('error', function (err) {
    t.ok(!!err)
    extract.destroy()
  })

  extract.end(fs.readFileSync(fixtures.UNKNOWN_FORMAT))
})

test('unknown format attempts to extract if allowed', function (t) {
  t.plan(5)

  var extract = tar.extract({ allowUnknownFormat: true })
  var noEntries = false

  var onfile1 = function (header, stream, callback) {
    t.deepEqual(header, {
      name: 'file-1.txt',
      mode: parseInt('644', 8),
      uid: 501,
      gid: 20,
      size: 12,
      mtime: new Date(1387580181000),
      type: 'file',
      linkname: null,
      uname: 'maf',
      gname: 'staff',
      devmajor: 0,
      devminor: 0
    })

    extract.on('entry', onfile2)
    stream.pipe(concat(function (data) {
      t.same(data.toString(), 'i am file-1\n')
      callback()
    }))
  }

  var onfile2 = function (header, stream, callback) {
    t.deepEqual(header, {
      name: 'file-2.txt',
      mode: parseInt('644', 8),
      uid: 501,
      gid: 20,
      size: 12,
      mtime: new Date(1387580181000),
      type: 'file',
      linkname: null,
      uname: 'maf',
      gname: 'staff',
      devmajor: 0,
      devminor: 0
    })

    stream.pipe(concat(function (data) {
      noEntries = true
      t.same(data.toString(), 'i am file-2\n')
      callback()
    }))
  }

  extract.once('entry', onfile1)

  extract.on('finish', function () {
    t.ok(noEntries)
  })

  extract.end(fs.readFileSync(fixtures.UNKNOWN_FORMAT))
})

```

---

### index.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/f3932dd763-tar-stream/test/fixtures/index.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
var path = require('path')

exports.ONE_FILE_TAR = path.join(__dirname, 'one-file.tar')
exports.MULTI_FILE_TAR = path.join(__dirname, 'multi-file.tar')
exports.PAX_TAR = path.join(__dirname, 'pax.tar')
exports.TYPES_TAR = path.join(__dirname, 'types.tar')
exports.LONG_NAME_TAR = path.join(__dirname, 'long-name.tar')
exports.UNICODE_BSD_TAR = path.join(__dirname, 'unicode-bsd.tar')
exports.UNICODE_TAR = path.join(__dirname, 'unicode.tar')
exports.NAME_IS_100_TAR = path.join(__dirname, 'name-is-100.tar')
exports.INVALID_TGZ = path.join(__dirname, 'invalid.tgz')
exports.SPACE_TAR_GZ = path.join(__dirname, 'space.tar')
exports.GNU_LONG_PATH = path.join(__dirname, 'gnu-long-path.tar')
exports.BASE_256_UID_GID = path.join(__dirname, 'base-256-uid-gid.tar')
exports.LARGE_UID_GID = path.join(__dirname, 'large-uid-gid.tar')
exports.BASE_256_SIZE = path.join(__dirname, 'base-256-size.tar')
exports.HUGE = path.join(__dirname, 'huge.tar.gz')
exports.LATIN1_TAR = path.join(__dirname, 'latin1.tar')
exports.INCOMPLETE_TAR = path.join(__dirname, 'incomplete.tar')
// Created using gnu tar: tar cf gnu-incremental.tar --format gnu --owner=myuser:12345 --group=mygroup:67890 test.txt
exports.GNU_TAR = path.join(__dirname, 'gnu.tar')
// Created using gnu tar: tar cf gnu-incremental.tar -G --format gnu --owner=myuser:12345 --group=mygroup:67890 test.txt
exports.GNU_INCREMENTAL_TAR = path.join(__dirname, 'gnu-incremental.tar')
// Created from multi-file.tar, removing the magic and recomputing the checksum
exports.UNKNOWN_FORMAT = path.join(__dirname, 'unknown-format.tar')
// Created using gnu tar: tar cf v7.tar --format v7 test.txt
exports.V7_TAR = path.join(__dirname, 'v7.tar')

```

---

### pack.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/f3932dd763-tar-stream/test/pack.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
var test = require('tape')
var tar = require('../index')
var fixtures = require('./fixtures')
var concat = require('concat-stream')
var fs = require('fs')
var Writable = require('readable-stream').Writable

test('one-file', function (t) {
  t.plan(2)

  var pack = tar.pack()

  pack.entry({
    name: 'test.txt',
    mtime: new Date(1387580181000),
    mode: parseInt('644', 8),
    uname: 'maf',
    gname: 'staff',
    uid: 501,
    gid: 20
  }, 'hello world\n')

  pack.finalize()

  pack.pipe(concat(function (data) {
    t.same(data.length & 511, 0)
    t.deepEqual(data, fs.readFileSync(fixtures.ONE_FILE_TAR))
  }))
})

test('multi-file', function (t) {
  t.plan(2)

  var pack = tar.pack()

  pack.entry({
    name: 'file-1.txt',
    mtime: new Date(1387580181000),
    mode: parseInt('644', 8),
    uname: 'maf',
    gname: 'staff',
    uid: 501,
    gid: 20
  }, 'i am file-1\n')

  pack.entry({
    name: 'file-2.txt',
    mtime: new Date(1387580181000),
    mode: parseInt('644', 8),
    size: 12,
    uname: 'maf',
    gname: 'staff',
    uid: 501,
    gid: 20
  }).end('i am file-2\n')

  pack.finalize()

  pack.pipe(concat(function (data) {
    t.same(data.length & 511, 0)
    t.deepEqual(data, fs.readFileSync(fixtures.MULTI_FILE_TAR))
  }))
})

test('pax', function (t) {
  t.plan(2)

  var pack = tar.pack()

  pack.entry({
    name: 'pax.txt',
    mtime: new Date(1387580181000),
    mode: parseInt('644', 8),
    uname: 'maf',
    gname: 'staff',
    uid: 501,
    gid: 20,
    pax: { special: 'sauce' }
  }, 'hello world\n')

  pack.finalize()

  pack.pipe(concat(function (data) {
    // fs.writeFileSync('tmp.tar', data)
    t.same(data.length & 511, 0)
    t.deepEqual(data, fs.readFileSync(fixtures.PAX_TAR))
  }))
})

test('types', function (t) {
  t.plan(2)
  var pack = tar.pack()

  pack.entry({
    name: 'directory',
    mtime: new Date(1387580181000),
    type: 'directory',
    mode: parseInt('755', 8),
    uname: 'maf',
    gname: 'staff',
    uid: 501,
    gid: 20
  })

  pack.entry({
    name: 'directory-link',
    mtime: new Date(1387580181000),
    type: 'symlink',
    linkname: 'directory',
    mode: parseInt('755', 8),
    uname: 'maf',
    gname: 'staff',
    uid: 501,
    gid: 20,
    size: 9 // Should convert to zero
  })

  pack.finalize()

  pack.pipe(concat(function (data) {
    t.equal(data.length & 511, 0)
    t.deepEqual(data, fs.readFileSync(fixtures.TYPES_TAR))
  }))
})

test('long-name', function (t) {
  t.plan(2)
  var pack = tar.pack()

  pack.entry({
    name: 'my/file/is/longer/than/100/characters/and/should/use/the/prefix/header/foobarbaz/foobarbaz/foobarbaz/foobarbaz/foobarbaz/foobarbaz/filename.txt',
    mtime: new Date(1387580181000),
    type: 'file',
    mode: parseInt('644', 8),
    uname: 'maf',
    gname: 'staff',
    uid: 501,
    gid: 20
  }, 'hello long name\n')

  pack.finalize()

  pack.pipe(concat(function (data) {
    t.equal(data.length & 511, 0)
    t.deepEqual(data, fs.readFileSync(fixtures.LONG_NAME_TAR))
  }))
})

test('large-uid-gid', function (t) {
  t.plan(2)
  var pack = tar.pack()

  pack.entry({
    name: 'test.txt',
    mtime: new Date(1387580181000),
    mode: parseInt('644', 8),
    uname: 'maf',
    gname: 'staff',
    uid: 1000000001,
    gid: 1000000002
  }, 'hello world\n')

  pack.finalize()

  pack.pipe(concat(function (data) {
    t.same(data.length & 511, 0)
    t.deepEqual(data, fs.readFileSync(fixtures.LARGE_UID_GID))
    fs.writeFileSync('/tmp/foo', data)
  }))
})

test('unicode', function (t) {
  t.plan(2)
  var pack = tar.pack()

  pack.entry({
    name: 'høstål.txt',
    mtime: new Date(1387580181000),
    type: 'file',
    mode: parseInt('644', 8),
    uname: 'maf',
    gname: 'staff',
    uid: 501,
    gid: 20
  }, 'høllø\n')

  pack.finalize()

  pack.pipe(concat(function (data) {
    t.equal(data.length & 511, 0)
    t.deepEqual(data, fs.readFileSync(fixtures.UNICODE_TAR))
  }))
})

test('backpressure', function (t) {
  var slowWritable = new Writable({ highWaterMark: 1 })
  slowWritable._write = (chunk, enc, next) => {
    setImmediate(next)
  }

  var pack = tar.pack()
  var later = false

  setImmediate(() => {
    later = true
  })

  pack.pipe(slowWritable)

  slowWritable.on('finish', () => t.end())
  pack.on('end', () => t.ok(later))

  var i = 0
  var next = () => {
    if (++i < 25) {
      var header = {
        name: `file${i}.txt`,
        mtime: new Date(1387580181000),
        mode: parseInt('644', 8),
        uname: 'maf',
        gname: 'staff',
        uid: 501,
        gid: 20
      }

      var buffer = Buffer.alloc(1024)

      pack.entry(header, buffer, next)
    } else {
      pack.finalize()
    }
  }

  next()
})

```

---

### slow.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/f3932dd763-tar-stream/test/slow.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
var test = require('tape')
var stream = require('readable-stream')
var zlib = require('zlib')
var fs = require('fs')
var tar = require('../')
var fixtures = require('./fixtures')

test('huge', function (t) {
  t.plan(1)

  var extract = tar.extract()
  var noEntries = false
  var hugeFileSize = 8804630528 // ~8.2GB
  var dataLength = 0

  var countStream = new stream.Writable()
  countStream._write = function (chunk, encoding, done) {
    dataLength += chunk.length
    done()
  }

  // Make sure we read the correct pax size entry for a file larger than 8GB.
  extract.on('entry', function (header, stream, callback) {
    t.deepEqual(header, {
      devmajor: 0,
      devminor: 0,
      gid: 20,
      gname: 'staff',
      linkname: null,
      mode: 420,
      mtime: new Date(1521214967000),
      name: 'huge.txt',
      pax: {
        'LIBARCHIVE.creationtime': '1521214954',
        'SCHILY.dev': '16777218',
        'SCHILY.ino': '91584182',
        'SCHILY.nlink': '1',
        atime: '1521214969',
        ctime: '1521214967',
        size: hugeFileSize.toString()
      },
      size: hugeFileSize,
      type: 'file',
      uid: 502,
      uname: 'apd4n'
    })

    noEntries = true
    stream.pipe(countStream)
  })

  extract.on('finish', function () {
    t.ok(noEntries)
    t.equal(dataLength, hugeFileSize)
  })

  var gunzip = zlib.createGunzip()
  var reader = fs.createReadStream(fixtures.HUGE)
  reader.pipe(gunzip).pipe(extract)
})

```

---


## plugin-syntax-typescript@7.28.6

**Funções usados neste arquivo:** parse

### basic.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/b007a43365-safe-buffer/test/basic.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
/* eslint-disable node/no-deprecated-api */

var test = require('tape')
var SafeBuffer = require('../').Buffer

test('new SafeBuffer(value) works just like Buffer', function (t) {
  t.deepEqual(new SafeBuffer('hey'), new Buffer('hey'))
  t.deepEqual(new SafeBuffer('hey', 'utf8'), new Buffer('hey', 'utf8'))
  t.deepEqual(new SafeBuffer('686579', 'hex'), new Buffer('686579', 'hex'))
  t.deepEqual(new SafeBuffer([1, 2, 3]), new Buffer([1, 2, 3]))
  t.deepEqual(new SafeBuffer(new Uint8Array([1, 2, 3])), new Buffer(new Uint8Array([1, 2, 3])))

  t.equal(typeof SafeBuffer.isBuffer, 'function')
  t.equal(SafeBuffer.isBuffer(new SafeBuffer('hey')), true)
  t.equal(Buffer.isBuffer(new SafeBuffer('hey')), true)
  t.notOk(SafeBuffer.isBuffer({}))

  t.end()
})

test('SafeBuffer.from(value) converts to a Buffer', function (t) {
  t.deepEqual(SafeBuffer.from('hey'), new Buffer('hey'))
  t.deepEqual(SafeBuffer.from('hey', 'utf8'), new Buffer('hey', 'utf8'))
  t.deepEqual(SafeBuffer.from('686579', 'hex'), new Buffer('686579', 'hex'))
  t.deepEqual(SafeBuffer.from([1, 2, 3]), new Buffer([1, 2, 3]))
  t.deepEqual(SafeBuffer.from(new Uint8Array([1, 2, 3])), new Buffer(new Uint8Array([1, 2, 3])))

  t.end()
})

test('SafeBuffer.alloc(number) returns zeroed-out memory', function (t) {
  for (var i = 0; i < 10; i++) {
    var expected1 = new Buffer(1000)
    expected1.fill(0)
    t.deepEqual(SafeBuffer.alloc(1000), expected1)

    var expected2 = new Buffer(1000 * 1000)
    expected2.fill(0)
    t.deepEqual(SafeBuffer.alloc(1000 * 1000), expected2)
  }
  t.end()
})

test('SafeBuffer.allocUnsafe(number)', function (t) {
  var buf = SafeBuffer.allocUnsafe(100) // unitialized memory
  t.equal(buf.length, 100)
  t.equal(SafeBuffer.isBuffer(buf), true)
  t.equal(Buffer.isBuffer(buf), true)
  t.end()
})

test('SafeBuffer.from() throws with number types', function (t) {
  t.plan(5)
  t.throws(function () {
    SafeBuffer.from(0)
  })
  t.throws(function () {
    SafeBuffer.from(-1)
  })
  t.throws(function () {
    SafeBuffer.from(NaN)
  })
  t.throws(function () {
    SafeBuffer.from(Infinity)
  })
  t.throws(function () {
    SafeBuffer.from(99)
  })
})

test('SafeBuffer.allocUnsafe() throws with non-number types', function (t) {
  t.plan(4)
  t.throws(function () {
    SafeBuffer.allocUnsafe('hey')
  })
  t.throws(function () {
    SafeBuffer.allocUnsafe('hey', 'utf8')
  })
  t.throws(function () {
    SafeBuffer.allocUnsafe([1, 2, 3])
  })
  t.throws(function () {
    SafeBuffer.allocUnsafe({})
  })
})

test('SafeBuffer.alloc() throws with non-number types', function (t) {
  t.plan(4)
  t.throws(function () {
    SafeBuffer.alloc('hey')
  })
  t.throws(function () {
    SafeBuffer.alloc('hey', 'utf8')
  })
  t.throws(function () {
    SafeBuffer.alloc([1, 2, 3])
  })
  t.throws(function () {
    SafeBuffer.alloc({})
  })
})

```

---


## types@7.29.0

**Funções usados neste arquivo:** parse

### test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/14a9dc09e1-encoding/test/test.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

var encoding = require('../lib/encoding');

exports['General tests'] = {
    'From UTF-8 to Latin_1': function (test) {
        var input = 'ÕÄÖÜ',
            expected = Buffer.from([0xd5, 0xc4, 0xd6, 0xdc]);
        test.deepEqual(encoding.convert(input, 'latin1'), expected);
        test.done();
    },

    'From Latin_1 to UTF-8': function (test) {
        var input = Buffer.from([0xd5, 0xc4, 0xd6, 0xdc]),
            expected = 'ÕÄÖÜ';
        test.deepEqual(encoding.convert(input, 'utf-8', 'latin1').toString(), expected);
        test.done();
    },

    'From UTF-8 to UTF-8': function (test) {
        var input = 'ÕÄÖÜ',
            expected = Buffer.from('ÕÄÖÜ');
        test.deepEqual(encoding.convert(input, 'utf-8', 'utf-8'), expected);
        test.done();
    },

    'From Latin_13 to Latin_15': function (test) {
        var input = Buffer.from([0xd5, 0xc4, 0xd6, 0xdc, 0xd0]),
            expected = Buffer.from([0xd5, 0xc4, 0xd6, 0xdc, 0xa6]);
        test.deepEqual(encoding.convert(input, 'latin_15', 'latin13'), expected);
        test.done();
    }

    /*
    // ISO-2022-JP is not supported by iconv-lite
    "From ISO-2022-JP to UTF-8 with Iconv": function (test) {
        var input = Buffer.from(
            "GyRCM1g5OzU7PVEwdzgmPSQ4IUYkMnFKczlwGyhC",
            "base64"
        ),
        expected = Buffer.from(
            "5a2m5qCh5oqA6KGT5ZOh56CU5L+u5qSc6KiO5Lya5aCx5ZGK",
            "base64"
        );
        test.deepEqual(encoding.convert(input, "utf-8", "ISO-2022-JP"), expected);
        test.done();
    },
    */
};

```

---


## babel-preset-current-node-syntax@1.2.0

**Funções usados neste arquivo:** parse

### index.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/17e6c9ef7a-web-streams-polyfill/test/benchmark/index.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
const Benchmark = require('benchmark');
const polyfill = require('../../dist/polyfill.es6.js');
const stardazed = require('@stardazed/streams');
const suite = new Benchmark.Suite();

const implementations = [
  ['web-streams-polyfill', polyfill],
  ['@stardazed/streams', stardazed]
];

// https://github.com/MattiasBuelens/web-streams-polyfill/issues/15
function testCount(impl, count, deferred) {
  const rs = new impl.ReadableStream({
    start(controller) {
      for (let i = 0; i < count; ++i) {
        controller.enqueue(i);
      }
      controller.close();
    }
  });
  const reader = rs.getReader();
  return readLoop(count, reader)
    .then(() => deferred.resolve());
}

function readLoop(count, reader) {
  return reader.read().then(result => {
    if (result.done) {
      return undefined;
    }
    return readLoop(count, reader);
  });
}

for (const [name, impl] of implementations) {
  for (let count = 3545; count <= 113440; count *= 2) {
    suite.add(
      `${name} testCount(${count})`,
      deferred => testCount(impl, count, deferred),
      { defer: true }
    );
  }
}

suite
  .on('cycle', event => {
    // eslint-disable-next-line no-console
    const bench = event.target;
    console.log(`${String(bench)} (period: ${(bench.times.period * 1000).toFixed(2)}ms)`);
  })
  .on('complete', () => {
    // eslint-disable-next-line no-console
    console.log('Done');
  })
  .run({ async: true });

```

---

### basic.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/17e6c9ef7a-web-streams-polyfill/test/unit/readable-stream/basic.spec.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
const { ReadableStream, WritableStream } = require('../../../');
const { FakeAbortSignal } = require('../util/fake-abort-signal');

describe('ReadableStream', () => {
  describe('constructor', () => {
    it('constructs with no arguments', () => {
      const rs = new ReadableStream();
      expect(rs instanceof ReadableStream).toBe(true);
    });
  });

  describe('getReader', () => {
    it('reads chunks from underlying source', async () => {
      const rs = new ReadableStream({
        start(c) {
          c.enqueue('a');
          c.enqueue('b');
          c.close();
        }
      });
      const reader = rs.getReader();
      expect(await reader.read()).toEqual({ done: false, value: 'a' });
      expect(await reader.read()).toEqual({ done: false, value: 'b' });
      expect(await reader.read()).toEqual({ done: true, value: undefined });
    });
  });

  describe('pipeTo', () => {
    it('accepts an abort signal', async () => {
      const rs = new ReadableStream({
        start(c) {
          c.enqueue('a');
          c.close();
        }
      });
      const ws = new WritableStream();
      const signal = new FakeAbortSignal(false);
      await rs.pipeTo(ws, { signal });
    });
    it('rejects with an AbortError when aborted', async () => {
      const rs = new ReadableStream({
        start(c) {
          c.enqueue('a');
          c.close();
        }
      });
      const ws = new WritableStream();
      const signal = new FakeAbortSignal(true);
      try {
        await rs.pipeTo(ws, { signal });
        fail('should have rejected');
      } catch (e) {
        expect(e.name).toBe('AbortError');
      }
    });
  });
});

```

---

### from.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/17e6c9ef7a-web-streams-polyfill/test/unit/readable-stream/from.spec.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
const { ReadableStream } = require('../../../');
const { ReadableStream: NodeReadableStream } = require('node:stream/web');

describe('ReadableStream.from()', () => {
  it('supports a Node.js ReadableStream', async () => {
    const native = new NodeReadableStream({
      start(c) {
        c.enqueue('a');
        c.enqueue('b');
        c.close();
      }
    });
    const wrapped = ReadableStream.from(native);
    expect(wrapped instanceof ReadableStream).toBe(true);
    const reader = wrapped.getReader();
    await expectAsync(reader.read()).toBeResolvedTo({ done: false, value: 'a' });
    await expectAsync(reader.read()).toBeResolvedTo({ done: false, value: 'b' });
    await expectAsync(reader.read()).toBeResolvedTo({ done: true, value: undefined });
  });

  it('supports a ReadableStream-like object', async () => {
    let i = 0;
    const closedPromise = new Promise(() => {});
    const readerLike = {
      get closed() { return closedPromise; },
      async read() { return { done: false, value: ++i }; },
      async cancel() {},
      releaseLock() {}
    };
    const streamLike = {
      getReader() { return readerLike; }
    };
    const wrapped = ReadableStream.from(streamLike);
    expect(wrapped instanceof ReadableStream).toBe(true);
    const reader = wrapped.getReader();
    await expectAsync(reader.read()).toBeResolvedTo({ done: false, value: 1 });
    await expectAsync(reader.read()).toBeResolvedTo({ done: false, value: 2 });
  });
});

```

---

### regression.spec.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/17e6c9ef7a-web-streams-polyfill/test/unit/readable-stream/regression.spec.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
const { TransformStream } = require('../../../');

describe('ReadableStream regressions', () => {
  // https://github.com/MattiasBuelens/web-streams-polyfill/issues/66
  it('#66', async () => {
    const { readable, writable } = new TransformStream();

    const producer = (async () => {
      const writer = writable.getWriter();
      await writer.write('hello');
      // The async iterator releases its reader lock in the "close steps" of its pending read, which rejects the
      // reader's closed promise. However, ReadableStreamClose then tries to resolve that same closed promise.
      // This *should* be ignored (since the promise is already rejected), but instead would cause a TypeError.
      await writer.close();
    })();

    const consumer = (async () => {
      const results = [];
      for await (const chunk of readable) {
        results.push(chunk);
      }
      expect(results).toEqual(['hello']);
    })();

    await Promise.all([producer, consumer]);
  });

  // It is not sufficient for our brand checks to check if a (supposedly internal) field exists,
  // since a stream from a different version of the polyfill would also have such a field.
  // We must also check if the given stream was constructed with a class from *this* version of the polyfill.
  // https://github.com/MattiasBuelens/web-streams-polyfill/issues/75
  // TODO Consider using private symbols or #private fields for brand checks instead? (see #70)
  describe('issue #75', () => {
    it('ReadableStream', () => {
      const fakeReadable = {
        _readableStreamController: {}
      };
      const getReader = ReadableStream.prototype.getReader;
      expect(() => getReader.call(fakeReadable)).toThrow(jasmine.any(TypeError));
    });
    it('WritableStream', () => {
      const fakeWritable = {
        _writableStreamController: {}
      };
      const getWriter = WritableStream.prototype.getWriter;
      expect(() => getWriter.call(fakeWritable)).toThrow(jasmine.any(TypeError));
    });
    it('TransformStream', () => {
      const fakeTransformStream = {
        _transformStreamController: {}
      };
      const readableGetter = Object.getOwnPropertyDescriptor(TransformStream.prototype, 'readable');
      expect(() => readableGetter.call(fakeTransformStream)).toThrow(jasmine.any(TypeError));
    });
  });
});

```

---

### fake-abort-signal.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/17e6c9ef7a-web-streams-polyfill/test/unit/util/fake-abort-signal.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
class FakeAbortSignal {
  constructor(aborted) {
    this.aborted = aborted;
  }

  addEventListener(type, listener) {
    return;
  }

  removeEventListener(type, listener) {
    return;
  }
}

module.exports = {
  FakeAbortSignal
};

```

---

### run.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/17e6c9ef7a-web-streams-polyfill/test/wpt/browser/run.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
/* eslint-disable no-console */

const path = require('path');
const http = require('http');
const { promisify } = require('util');
const micromatch = require('micromatch');
const { chromium, firefox } = require('playwright');
const minimist = require('minimist');
const recursiveReadDir = require('recursive-readdir');
const { setupServer } = require('./server.js');
const consoleReporter = require('wpt-runner/lib/console-reporter.js');
const { SourceFile } = require('wpt-runner/lib/internal/sourcefile.js');
const { FilteringReporter } = require('../shared/filtering-reporter.js');
const {
  excludedTestsBase,
  mergeIgnoredFailures,
  ignoredFailuresBase,
  ignoredFailuresMinified,
  ignoredFailuresES5,
  ignoredFailuresES6
} = require('../shared/exclusions');

const serverCloseAsync = promisify(http.Server.prototype.close);
const recursiveReadDirAsync = promisify(recursiveReadDir);

const argv = minimist(process.argv.slice(2), {
  string: ['browser']
});

main().catch(e => {
  console.error(e.stack);
  process.exitCode = 1;
});

async function main() {
  const browserType = argv.browser || 'chromium';
  const includedTests = argv._.length > 0 ? argv._ : ['**/*.html'];
  const excludedTests = [...excludedTestsBase];

  const wptPath = path.resolve(__dirname, '../../web-platform-tests');
  const results = [];
  let server;
  let browser;
  try {
    server = setupServer(wptPath, { rootURL: '/' });
    const urlPrefix = `http://127.0.0.1:${server.address().port}`;
    console.log(`Server running at ${urlPrefix}`);

    browser = await browserTypeByName(browserType).launch();
    const testOptions = { includedTests, excludedTests, browser, wptPath, urlPrefix };
    results.push(await runTests({
      ...testOptions,
      entryFile: 'polyfill.es2018.min.js',
      ignoredFailures: mergeIgnoredFailures(ignoredFailuresBase, ignoredFailuresMinified)
    }));
    results.push(await runTests({
      ...testOptions,
      entryFile: 'polyfill.es6.min.js',
      ignoredFailures: mergeIgnoredFailures(ignoredFailuresES6, ignoredFailuresMinified)
    }));
    results.push(await runTests({
      ...testOptions,
      entryFile: 'polyfill.min.js',
      ignoredFailures: mergeIgnoredFailures(ignoredFailuresES5, ignoredFailuresMinified)
    }));
  } finally {
    if (browser) {
      await browser.close();
    }
    if (server) {
      await serverCloseAsync.call(server);
    }
  }

  const failures = results.reduce((sum, result) => sum + result.failures, 0);
  for (const { entryFile, testResults } of results) {
    console.log(`> ${entryFile}`);
    console.log(`  * ${testResults.passed} passed`);
    console.log(`  * ${testResults.failed} failed`);
    console.log(`  * ${testResults.ignored} ignored`);
  }

  process.exitCode = failures;
}

async function runTests({ entryFile, includedTests, excludedTests, ignoredFailures, browser, wptPath, urlPrefix }) {
  const entryPath = path.resolve(__dirname, `../../../dist/${entryFile}`);
  const testsBase = '/streams/';
  const testsPath = path.resolve(wptPath, 'streams');

  const includeMatcher = micromatch.matcher(includedTests);
  const excludeMatcher = micromatch.matcher(excludedTests);
  const workerTestPattern = /\.(?:dedicated|shared|service)worker(?:\.https)?\.html$/;
  const testPaths = (await readTestPaths(testsPath)).filter(testPath => {
    // Ignore the worker versions
    if (workerTestPattern.test(testPath)) {
      return false;
    }
    return includeMatcher(testPath) && !excludeMatcher(testPath);
  });

  const reporter = new FilteringReporter(consoleReporter, ignoredFailures);

  console.log(`>>> ${entryFile}`);

  let context;
  try {
    context = await browser.newContext();
    await context.addInitScript({ path: entryPath });
    await context.route(`${urlPrefix}/resources/testharnessreport.js`, route => {
      route.fulfill({
        body: `
            window.fetch_tests_from_worker = () => undefined;
            window.add_result_callback(({ name, status, message, stack }) => {
              window.__wptResultCallback({ name, status, message, stack });
            });
            window.add_completion_callback((tests, { status, message, stack }) => {
              window.__wptCompletionCallback({ status, message, stack });
            });
          `
      });
    });
    for (const testPath of testPaths) {
      reporter.startSuite(testPath);
      const page = await context.newPage();
      const testUrl = `${urlPrefix}${testsBase}${testPath}`;
      await runTest(page, testUrl, reporter);
      await page.close();
    }
  } finally {
    if (context) {
      await context.close();
    }
  }

  const wptFailures = 0;
  const testResults = reporter.getResults();
  const failures = Math.max(testResults.failed, wptFailures - testResults.ignored);

  console.log();

  return { entryFile, failures, testResults };
}

async function runTest(page, testUrl, reporter) {
  let hasFailed = false;
  let resolveDone;
  const donePromise = new Promise(resolve => {
    resolveDone = resolve;
  });

  await page.exposeFunction('__wptResultCallback', test => {
    if (test.status === 0) {
      reporter.pass(test.name);
    } else if (test.status === 1) {
      reporter.fail(`${test.name}\n`);
      reporter.reportStack(`${test.message}\n${test.stack}`);
      hasFailed = true;
    } else if (test.status === 2) {
      reporter.fail(`${test.name} (timeout)\n`);
      reporter.reportStack(`${test.message}\n${test.stack}`);
      hasFailed = true;
    } else if (test.status === 3) {
      reporter.fail(`${test.name} (incomplete)\n`);
      reporter.reportStack(`${test.message}\n${test.stack}`);
      hasFailed = true;
    } else if (test.status === 4) {
      reporter.fail(`${test.name} (precondition failed)\n`);
      reporter.reportStack(`${test.message}\n${test.stack}`);
      hasFailed = true;
    } else {
      reporter.fail(`unknown test status: ${test.status}`);
      hasFailed = true;
    }
  });

  await page.exposeFunction('__wptCompletionCallback', harnessStatus => {
    if (harnessStatus.status === 0) {
      resolveDone(!hasFailed);
    } else if (harnessStatus.status === 1) {
      reporter.fail('test harness threw unexpected error');
      reporter.reportStack(`${harnessStatus.message}\n${harnessStatus.stack}`);
      resolveDone(false);
    } else if (harnessStatus.status === 2) {
      reporter.fail('test harness should not timeout');
      resolveDone(false);
    } else if (harnessStatus.status === 4) {
      reporter.fail('test harness precondition failed');
      reporter.reportStack(`${harnessStatus.message}\n${harnessStatus.stack}`);
      resolveDone(false);
    } else {
      reporter.fail(`unknown test harness status: ${harnessStatus.status}`);
      resolveDone(false);
    }
  });

  await page.goto(testUrl);
  return await donePromise;
}

function browserTypeByName(name) {
  switch (name) {
    case 'firefox':
      return firefox;
    case 'chromium':
    default:
      return chromium;
  }
}

async function readTestPaths(testsPath) {
  const fileNames = await recursiveReadDirAsync(testsPath);
  const testFilePaths = [];
  for (const fileName of fileNames) {
    const sourceFile = new SourceFile(testsPath, path.relative(testsPath, fileName));
    testFilePaths.push(...sourceFile.testPaths());
  }
  return testFilePaths.sort();
}

```

---

### server.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/17e6c9ef7a-web-streams-polyfill/test/wpt/browser/server.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
const http = require('http');
const path = require('path');
const fs = require('fs');
const { URL } = require('url');
const st = require('st');
const { AnyHtmlHandler, WindowHandler } = require('wpt-runner/lib/internal/serve.js');

const testharnessPath = require.resolve('wpt-runner/testharness/testharness.js');
const idlharnessPath = require.resolve('wpt-runner/testharness/idlharness.js');
const webidl2jsPath = require.resolve('wpt-runner/testharness/webidl2/lib/webidl2.js');
const testdriverDummyPath = require.resolve('wpt-runner/lib/testdriver-dummy.js');

function setupServer(testsPath, {
  rootURL = '/'
}) {
  if (!rootURL.startsWith('/')) {
    rootURL = '/' + rootURL;
  }
  if (!rootURL.endsWith('/')) {
    rootURL += '/';
  }

  const staticFileServer = st({ path: testsPath, url: rootURL, passthrough: true });

  const routes = [
    ['.window.html', new WindowHandler(testsPath, rootURL)],
    ['.any.html', new AnyHtmlHandler(testsPath, rootURL)]
  ];

  return http.createServer((req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    for (const [pathNameSuffix, handler] of routes) {
      if (pathname.endsWith(pathNameSuffix)) {
        handler.handleRequest(req, res);
        return;
      }
    }

    switch (pathname) {
      case '/resources/testharness.js': {
        fs.createReadStream(testharnessPath).pipe(res);
        break;
      }

      case '/resources/idlharness.js': {
        fs.createReadStream(idlharnessPath).pipe(res);
        break;
      }

      case '/resources/WebIDLParser.js': {
        fs.createReadStream(webidl2jsPath).pipe(res);
        break;
      }

      case '/resources/testharnessreport.js': {
        res.end('');
        break;
      }

      case '/resources/testdriver.js': {
        fs.createReadStream(testdriverDummyPath).pipe(res);
        break;
      }

      case '/resources/testdriver-vendor.js': {
        res.end('');
        break;
      }

      case '/favicon.ico': {
        res.end('');
        break;
      }

      default: {
        staticFileServer(req, res, () => {
          throw new Error(`Unexpected URL: ${req.url}`);
        });
      }
    }
  }).listen();
}

exports.setupServer = setupServer;

```

---

### run.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/17e6c9ef7a-web-streams-polyfill/test/wpt/node/run.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
// This runs the web platform tests against the reference implementation, in Node.js using jsdom, for easier rapid
// development of the reference implementation and the web platform tests.
/* eslint-disable no-console */

const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const micromatch = require('micromatch');
const wptRunner = require('wpt-runner');
const consoleReporter = require('wpt-runner/lib/console-reporter.js');
const { FilteringReporter } = require('../shared/filtering-reporter.js');
const allSettled = require('@ungap/promise-all-settled');
const {
  excludedTestsNonES2018,
  excludedTestsBase,
  ignoredFailuresBase,
  ignoredFailuresMinified,
  ignoredFailuresES5,
  ignoredFailuresES6,
  mergeIgnoredFailures
} = require('../shared/exclusions');

const readFileAsync = promisify(fs.readFile);
const queueMicrotask = global.queueMicrotask || (fn => Promise.resolve().then(fn));
const structuredClone = global.structuredClone || (x => x);

// wpt-runner does not yet support unhandled rejection tracking a la
// https://github.com/w3c/testharness.js/commit/7716e2581a86dfd9405a9c00547a7504f0c7fe94
// So we emulate it with Node.js events
const rejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  rejections.set(promise, reason);
});

process.on('rejectionHandled', promise => {
  rejections.delete(promise);
});

main().catch(e => {
  console.error(e.stack);
  process.exitCode = 1;
});

async function main() {
  const supportsES2018 = runtimeSupportsAsyncGenerators();

  const includedTests = process.argv.length >= 3 ? process.argv.slice(2) : ['**/*.html'];
  const excludedTests = [
    ...excludedTestsBase,
    ...(runtimeSupportsAsyncGenerators() ? [] : excludedTestsNonES2018)
  ];

  const results = [];
  if (supportsES2018) {
    results.push(await runTests('polyfill.es2018.js', {
      includedTests,
      excludedTests,
      ignoredFailures: ignoredFailuresBase
    }));
    results.push(await runTests('polyfill.es2018.min.js', {
      includedTests,
      excludedTests,
      ignoredFailures: mergeIgnoredFailures(ignoredFailuresBase, ignoredFailuresMinified)
    }));
  }

  results.push(await runTests('polyfill.es6.js', {
    includedTests,
    excludedTests,
    ignoredFailures: ignoredFailuresES6
  }));
  results.push(await runTests('polyfill.es6.min.js', {
    includedTests,
    excludedTests,
    ignoredFailures: mergeIgnoredFailures(ignoredFailuresES6, ignoredFailuresMinified)
  }));

  results.push(await runTests('polyfill.js', {
    includedTests,
    excludedTests,
    ignoredFailures: ignoredFailuresES5
  }));
  results.push(await runTests('polyfill.min.js', {
    includedTests,
    excludedTests,
    ignoredFailures: mergeIgnoredFailures(ignoredFailuresES5, ignoredFailuresMinified)
  }));

  const failures = results.reduce((sum, result) => sum + result.failures, 0);
  for (const { entryFile, testResults, rejectionsCount } of results) {
    console.log(`> ${entryFile}`);
    console.log(`  * ${testResults.passed} passed`);
    console.log(`  * ${testResults.failed} failed`);
    console.log(`  * ${testResults.ignored} ignored`);
    if (rejectionsCount > 0) {
      console.log(`  * ${rejectionsCount} unhandled promise rejections`);
    }
  }

  process.exitCode = failures;
}

async function runTests(entryFile, { includedTests = ['**/*.html'], excludedTests = [], ignoredFailures = {} } = {}) {
  const entryPath = path.resolve(__dirname, `../../../dist/${entryFile}`);
  const wptPath = path.resolve(__dirname, '../../web-platform-tests');
  const testsPath = path.resolve(wptPath, 'streams');

  const includeMatcher = micromatch.matcher(includedTests);
  const excludeMatcher = micromatch.matcher(excludedTests);
  const workerTestPattern = /\.(?:dedicated|shared|service)worker(?:\.https)?\.html$/;

  const reporter = new FilteringReporter(consoleReporter, ignoredFailures);

  const bundledJS = await readFileAsync(entryPath, { encoding: 'utf8' });

  console.log(`>>> ${entryFile}`);

  const wptFailures = await wptRunner(testsPath, {
    rootURL: 'streams/',
    reporter,
    setup(window) {
      window.Promise.allSettled = allSettled;
      window.queueMicrotask = queueMicrotask;
      window.structuredClone = structuredClone;
      window.fetch = async function (url) {
        const filePath = path.join(wptPath, url);
        if (!filePath.startsWith(wptPath)) {
          throw new TypeError('Invalid URL');
        }
        return {
          ok: true,
          async text() {
            return await readFileAsync(filePath, { encoding: 'utf8' });
          }
        };
      };
      window.eval(bundledJS);
    },
    filter(testPath) {
      // Ignore the worker versions
      if (workerTestPattern.test(testPath)) {
        return false;
      }

      return includeMatcher(testPath) &&
          !excludeMatcher(testPath);
    }
  });

  const testResults = reporter.getResults();
  let failures = Math.max(testResults.failed, wptFailures - testResults.ignored);

  if (rejections.size > 0) {
    if (failures === 0) {
      failures = 1;
    }

    console.log();
    for (const reason of rejections.values()) {
      console.error('Unhandled promise rejection: ', reason.stack);
    }
    rejections.clear();
  }

  console.log();

  return { entryFile, failures, testResults, rejectionsCount: rejections.size };
}

function runtimeSupportsAsyncGenerators() {
  try {
    // eslint-disable-next-line no-new-func
    Function('(async function* f() {})')();
    return true;
  } catch (e) {
    return false;
  }
}

```

---

### exclusions.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/17e6c9ef7a-web-streams-polyfill/test/wpt/shared/exclusions.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
const excludedTestsBase = [
  // We cannot detect non-transferability, and Node's WebAssembly.Memory is also not marked as such.
  'readable-byte-streams/non-transferable-buffers.any.html',
  // Disable tests for different size functions per realm, since they need a working <iframe>
  'queuing-strategies-size-function-per-global.window.html',
  // We don't implement transferable streams yet
  'transferable/**',
  // The crash tests require creating and terminating workers and iframes.
  'piping/crashtests/**',
  'readable-streams/cross-realm-crash.window.html',
  'readable-streams/crashtests/**',
  // This test is blocked on an unresolved spec issue: https://github.com/whatwg/streams/issues/1243
  'piping/general-addition.any.html',
  // We don't support ShadowRealms.
  'idlharness-shadowrealm.window.html',
  // We don't patch globals inside other <iframe>s.
  'readable-streams/global.html',
  'transform-streams/invalid-realm.tentative.window.html',
  // We don't support MessagePort or VideoFrame.
  'readable-streams/owning-type-message-port.any.html',
  'readable-streams/owning-type-video-frame.any.html',
  'readable-streams/owning-type.any.html' // FIXME: reenable this test once owning type PR lands.
];

const excludedTestsNonES2018 = [
  // Skip tests that use async generators or for-await-of
  'readable-streams/async-iterator.any.html',
  'readable-streams/patched-global.any.html'
];

const ignoredFailuresBase = {
  // We cannot distinguish between a zero-length ArrayBuffer and a detached ArrayBuffer,
  // so we incorrectly throw a TypeError instead of a RangeError
  'readable-byte-streams/bad-buffers-and-views.any.html': [
    'ReadableStream with byte source: respondWithNewView() throws if the supplied view\'s buffer is zero-length ' +
    '(in the closed state)'
  ]
};

const ignoredFailuresMinified = {
  'idlharness.any.html': [
    // Terser turns `(a = undefined) => {}` into `(a) => {}`, changing the function's length property
    // Therefore we cannot correctly implement methods with optional arguments
    /interface: operation (abort|cancel|enqueue|error|getReader|read|write)/,
    // Same thing for ReadableStream.values(), which is tested as part of the async iterable declaration
    'ReadableStream interface: async iterable<any>'
  ]
};

const ignoredFailuresES6 = mergeIgnoredFailures(ignoredFailuresBase, {
  'readable-streams/async-iterator.any.html': [
    // ES6 build will not use correct %AsyncIteratorPrototype%
    'Async iterator instances should have the correct list of properties'
  ]
});

const ignoredFailuresES5 = mergeIgnoredFailures(ignoredFailuresES6, {
  'idlharness.any.html': [
    // ES5 build does not set correct length on constructors with optional arguments
    'ReadableStream interface object length',
    'WritableStream interface object length',
    'TransformStream interface object length',
    // ES5 build does not set correct length on methods with optional arguments
    /interface: operation \w+\(.*optional.*\)/,
    'ReadableStream interface: async iterable<any>',
    // ES5 build does not set correct function name on getters and setters
    /interface: attribute/,
    // ES5 build has { writable: true } on prototype objects
    /interface: existence and properties of interface prototype object/
  ],
  'queuing-strategies.any.html': [
    // ES5 build turns arrow functions into regular functions, which cannot be marked as non-constructable
    'ByteLengthQueuingStrategy: size should not have a prototype property',
    'CountQueuingStrategy: size should not have a prototype property',
    'ByteLengthQueuingStrategy: size should not be a constructor',
    'CountQueuingStrategy: size should not be a constructor'
  ]
});

function mergeIgnoredFailures(left, right) {
  const result = { ...left };
  for (const key of Object.keys(right)) {
    result[key] = [...(result[key] || []), ...right[key]];
  }
  return result;
}

module.exports = {
  excludedTestsBase,
  excludedTestsNonES2018,
  ignoredFailuresBase,
  ignoredFailuresMinified,
  ignoredFailuresES5,
  ignoredFailuresES6,
  mergeIgnoredFailures
};

```

---

### filtering-reporter.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/17e6c9ef7a-web-streams-polyfill/test/wpt/shared/filtering-reporter.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
class FilteringReporter {
  constructor(reporter, ignoredFailures = {}) {
    this._reporter = reporter;
    this._ignoredFailures = ignoredFailures;

    this._currentSuite = '';
    this._passed = 0;
    this._failed = 0;
    this._ignored = 0;
  }

  startSuite(name) {
    this._currentSuite = name;
    this._reporter.startSuite(name);
  }

  pass(message) {
    this._passed++;
    this._reporter.pass(message);
  }

  fail(message) {
    message = message.trim();
    const ignoredFailures = this._ignoredFailures[this._currentSuite];
    if (ignoredFailures) {
      for (const ignoredFailure of ignoredFailures) {
        if (matches(ignoredFailure, message)) {
          this._ignored++;
          this._reporter.fail(`${message} (ignored)\n`);
          return;
        }
      }
    }
    this._failed++;
    this._reporter.fail(`${message} (UNEXPECTED FAILURE)\n`);
  }

  reportStack(stack) {
    this._reporter.reportStack(stack);
  }

  getResults() {
    return {
      passed: this._passed,
      failed: this._failed,
      ignored: this._ignored
    };
  }
}

function matches(test, input) {
  if (typeof test === 'string') {
    return input.includes(test);
  }
  if (test instanceof RegExp) {
    return test.test(input);
  }
  return false;
}

module.exports = {
  FilteringReporter
};

```

---


## parser@7.29.0

**Funções usados neste arquivo:** parse


## helper-compilation-targets@7.28.6

**Funções usados neste arquivo:** parse

### tmpl-test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/8a6ed85d86-tmpl/test/tmpl-test.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
var tmpl = require('../lib/tmpl')
  , assert = require('assert')

exports['basic name substitution'] = function() {
  assert.equal(
    tmpl('the answer is {answer}', { answer: 42 }),
    'the answer is 42')
}

```

---


## helper-module-transforms@7.28.6

**Funções usados neste arquivo:** parse

### called-in-order.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e449cdf3e1-commons/lib/called-in-order.test.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
"use strict";

var assert = require("@sinonjs/referee-sinon").assert;
var calledInOrder = require("./called-in-order");
var sinon = require("@sinonjs/referee-sinon").sinon;

var testObject1 = {
    someFunction: function () {
        return;
    },
};
var testObject2 = {
    otherFunction: function () {
        return;
    },
};
var testObject3 = {
    thirdFunction: function () {
        return;
    },
};

function testMethod() {
    testObject1.someFunction();
    testObject2.otherFunction();
    testObject2.otherFunction();
    testObject2.otherFunction();
    testObject3.thirdFunction();
}

describe("calledInOrder", function () {
    beforeEach(function () {
        sinon.stub(testObject1, "someFunction");
        sinon.stub(testObject2, "otherFunction");
        sinon.stub(testObject3, "thirdFunction");
        testMethod();
    });
    afterEach(function () {
        testObject1.someFunction.restore();
        testObject2.otherFunction.restore();
        testObject3.thirdFunction.restore();
    });

    describe("given single array argument", function () {
        describe("when stubs were called in expected order", function () {
            it("returns true", function () {
                assert.isTrue(
                    calledInOrder([
                        testObject1.someFunction,
                        testObject2.otherFunction,
                    ])
                );
                assert.isTrue(
                    calledInOrder([
                        testObject1.someFunction,
                        testObject2.otherFunction,
                        testObject2.otherFunction,
                        testObject3.thirdFunction,
                    ])
                );
            });
        });

        describe("when stubs were called in unexpected order", function () {
            it("returns false", function () {
                assert.isFalse(
                    calledInOrder([
                        testObject2.otherFunction,
                        testObject1.someFunction,
                    ])
                );
                assert.isFalse(
                    calledInOrder([
                        testObject2.otherFunction,
                        testObject1.someFunction,
                        testObject1.someFunction,
                        testObject3.thirdFunction,
                    ])
                );
            });
        });
    });

    describe("given multiple arguments", function () {
        describe("when stubs were called in expected order", function () {
            it("returns true", function () {
                assert.isTrue(
                    calledInOrder(
                        testObject1.someFunction,
                        testObject2.otherFunction
                    )
                );
                assert.isTrue(
                    calledInOrder(
                        testObject1.someFunction,
                        testObject2.otherFunction,
                        testObject3.thirdFunction
                    )
                );
            });
        });

        describe("when stubs were called in unexpected order", function () {
            it("returns false", function () {
                assert.isFalse(
                    calledInOrder(
                        testObject2.otherFunction,
                        testObject1.someFunction
                    )
                );
                assert.isFalse(
                    calledInOrder(
                        testObject2.otherFunction,
                        testObject1.someFunction,
                        testObject3.thirdFunction
                    )
                );
            });
        });
    });
});

```

---

### class-name.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e449cdf3e1-commons/lib/class-name.test.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
"use strict";
/* eslint-disable no-empty-function */

var assert = require("@sinonjs/referee").assert;
var className = require("./class-name");

describe("className", function () {
    it("returns the class name of an instance", function () {
        // Because eslint-config-sinon disables es6, we can't
        // use a class definition here
        // https://github.com/sinonjs/eslint-config-sinon/blob/master/index.js
        // var instance = new (class TestClass {})();
        var instance = new (function TestClass() {})();
        var name = className(instance);
        assert.equals(name, "TestClass");
    });

    it("returns 'Object' for {}", function () {
        var name = className({});
        assert.equals(name, "Object");
    });

    it("returns null for an object that has no prototype", function () {
        var obj = Object.create(null);
        var name = className(obj);
        assert.equals(name, null);
    });

    it("returns null for an object whose prototype was mangled", function () {
        // This is what Node v6 and v7 do for objects returned by querystring.parse()
        function MangledObject() {}
        MangledObject.prototype = Object.create(null);
        var obj = new MangledObject();
        var name = className(obj);
        assert.equals(name, null);
    });
});

```

---

### deprecated.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e449cdf3e1-commons/lib/deprecated.test.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
/* eslint-disable no-console */
"use strict";

var assert = require("@sinonjs/referee-sinon").assert;
var sinon = require("@sinonjs/referee-sinon").sinon;

var deprecated = require("./deprecated");

var msg = "test";

describe("deprecated", function () {
    describe("defaultMsg", function () {
        it("should return a string", function () {
            assert.equals(
                deprecated.defaultMsg("sinon", "someFunc"),
                "sinon.someFunc is deprecated and will be removed from the public API in a future version of sinon."
            );
        });
    });

    describe("printWarning", function () {
        beforeEach(function () {
            sinon.replace(process, "emitWarning", sinon.fake());
        });

        afterEach(sinon.restore);

        describe("when `process.emitWarning` is defined", function () {
            it("should call process.emitWarning with a msg", function () {
                deprecated.printWarning(msg);
                assert.calledOnceWith(process.emitWarning, msg);
            });
        });

        describe("when `process.emitWarning` is undefined", function () {
            beforeEach(function () {
                sinon.replace(console, "info", sinon.fake());
                sinon.replace(console, "log", sinon.fake());
                process.emitWarning = undefined;
            });

            afterEach(sinon.restore);

            describe("when `console.info` is defined", function () {
                it("should call `console.info` with a message", function () {
                    deprecated.printWarning(msg);
                    assert.calledOnceWith(console.info, msg);
                });
            });

            describe("when `console.info` is undefined", function () {
                it("should call `console.log` with a message", function () {
                    console.info = undefined;
                    deprecated.printWarning(msg);
                    assert.calledOnceWith(console.log, msg);
                });
            });
        });
    });

    describe("wrap", function () {
        // eslint-disable-next-line mocha/no-setup-in-describe
        var method = sinon.fake();
        var wrapped;

        beforeEach(function () {
            wrapped = deprecated.wrap(method, msg);
        });

        it("should return a wrapper function", function () {
            assert.match(wrapped, sinon.match.func);
        });

        it("should assign the prototype of the passed method", function () {
            assert.equals(method.prototype, wrapped.prototype);
        });

        context("when the passed method has falsy prototype", function () {
            it("should not be assigned to the wrapped method", function () {
                method.prototype = null;
                wrapped = deprecated.wrap(method, msg);
                assert.match(wrapped.prototype, sinon.match.object);
            });
        });

        context("when invoking the wrapped function", function () {
            before(function () {
                sinon.replace(deprecated, "printWarning", sinon.fake());
                wrapped({});
            });

            it("should call `printWarning` before invoking", function () {
                assert.calledOnceWith(deprecated.printWarning, msg);
            });

            it("should invoke the passed method with the given arguments", function () {
                assert.calledOnceWith(method, {});
            });
        });
    });
});

```

---

### every.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e449cdf3e1-commons/lib/every.test.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
"use strict";

var assert = require("@sinonjs/referee-sinon").assert;
var sinon = require("@sinonjs/referee-sinon").sinon;
var every = require("./every");

describe("util/core/every", function () {
    it("returns true when the callback function returns true for every element in an iterable", function () {
        var obj = [true, true, true, true];
        var allTrue = every(obj, function (val) {
            return val;
        });

        assert(allTrue);
    });

    it("returns false when the callback function returns false for any element in an iterable", function () {
        var obj = [true, true, true, false];
        var result = every(obj, function (val) {
            return val;
        });

        assert.isFalse(result);
    });

    it("calls the given callback once for each item in an iterable until it returns false", function () {
        var iterableOne = [true, true, true, true];
        var iterableTwo = [true, true, false, true];
        var callback = sinon.spy(function (val) {
            return val;
        });

        every(iterableOne, callback);
        assert.equals(callback.callCount, 4);

        callback.resetHistory();

        every(iterableTwo, callback);
        assert.equals(callback.callCount, 3);
    });
});

```

---

### function-name.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e449cdf3e1-commons/lib/function-name.test.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
"use strict";

var jsc = require("jsverify");
var refute = require("@sinonjs/referee-sinon").refute;

var functionName = require("./function-name");

describe("function-name", function () {
    it("should return empty string if func is falsy", function () {
        jsc.assertForall("falsy", function (fn) {
            return functionName(fn) === "";
        });
    });

    it("should use displayName by default", function () {
        jsc.assertForall("nestring", function (displayName) {
            var fn = { displayName: displayName };

            return functionName(fn) === fn.displayName;
        });
    });

    it("should use name if displayName is not available", function () {
        jsc.assertForall("nestring", function (name) {
            var fn = { name: name };

            return functionName(fn) === fn.name;
        });
    });

    it("should fallback to string parsing", function () {
        jsc.assertForall("nat", function (naturalNumber) {
            var name = `fn${naturalNumber}`;
            var fn = {
                toString: function () {
                    return `\nfunction ${name}`;
                },
            };

            return functionName(fn) === name;
        });
    });

    it("should not fail when a name cannot be found", function () {
        refute.exception(function () {
            var fn = {
                toString: function () {
                    return "\nfunction (";
                },
            };

            functionName(fn);
        });
    });

    it("should not fail when toString is undefined", function () {
        refute.exception(function () {
            functionName(Object.create(null));
        });
    });

    it("should not fail when toString throws", function () {
        refute.exception(function () {
            var fn;
            try {
                // eslint-disable-next-line no-eval
                fn = eval("(function*() {})")().constructor;
            } catch (e) {
                // env doesn't support generators
                return;
            }

            functionName(fn);
        });
    });
});

```

---

### global.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e449cdf3e1-commons/lib/global.test.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
"use strict";

var assert = require("@sinonjs/referee-sinon").assert;
var globalObject = require("./global");

describe("global", function () {
    before(function () {
        if (typeof global === "undefined") {
            this.skip();
        }
    });

    it("is same as global", function () {
        assert.same(globalObject, global);
    });
});

```

---

### index.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e449cdf3e1-commons/lib/index.test.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
"use strict";

var assert = require("@sinonjs/referee-sinon").assert;
var index = require("./index");

var expectedMethods = [
    "calledInOrder",
    "className",
    "every",
    "functionName",
    "orderByFirstCall",
    "typeOf",
    "valueToString",
];
var expectedObjectProperties = ["deprecated", "prototypes"];

describe("package", function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    expectedMethods.forEach(function (name) {
        it(`should export a method named ${name}`, function () {
            assert.isFunction(index[name]);
        });
    });

    // eslint-disable-next-line mocha/no-setup-in-describe
    expectedObjectProperties.forEach(function (name) {
        it(`should export an object property named ${name}`, function () {
            assert.isObject(index[name]);
        });
    });
});

```

---

### order-by-first-call.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e449cdf3e1-commons/lib/order-by-first-call.test.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
"use strict";

var assert = require("@sinonjs/referee-sinon").assert;
var knuthShuffle = require("knuth-shuffle").knuthShuffle;
var sinon = require("@sinonjs/referee-sinon").sinon;
var orderByFirstCall = require("./order-by-first-call");

describe("orderByFirstCall", function () {
    it("should order an Array of spies by the callId of the first call, ascending", function () {
        // create an array of spies
        var spies = [
            sinon.spy(),
            sinon.spy(),
            sinon.spy(),
            sinon.spy(),
            sinon.spy(),
            sinon.spy(),
        ];

        // call all the spies
        spies.forEach(function (spy) {
            spy();
        });

        // add a few uncalled spies
        spies.push(sinon.spy());
        spies.push(sinon.spy());

        // randomise the order of the spies
        knuthShuffle(spies);

        var sortedSpies = orderByFirstCall(spies);

        assert.equals(sortedSpies.length, spies.length);

        var orderedByFirstCall = sortedSpies.every(function (spy, index) {
            if (index + 1 === sortedSpies.length) {
                return true;
            }
            var nextSpy = sortedSpies[index + 1];

            // uncalled spies should be ordered first
            if (!spy.called) {
                return true;
            }

            return spy.calledImmediatelyBefore(nextSpy);
        });

        assert.isTrue(orderedByFirstCall);
    });
});

```

---

### copy-prototype-methods.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e449cdf3e1-commons/lib/prototypes/copy-prototype-methods.test.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
"use strict";

var refute = require("@sinonjs/referee-sinon").refute;
var copyPrototypeMethods = require("./copy-prototype-methods");

describe("copyPrototypeMethods", function () {
    it("does not throw for Map", function () {
        refute.exception(function () {
            copyPrototypeMethods(Map.prototype);
        });
    });
});

```

---

### index.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e449cdf3e1-commons/lib/prototypes/index.test.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
"use strict";

var assert = require("@sinonjs/referee-sinon").assert;

var arrayProto = require("./index").array;
var functionProto = require("./index").function;
var mapProto = require("./index").map;
var objectProto = require("./index").object;
var setProto = require("./index").set;
var stringProto = require("./index").string;
var throwsOnProto = require("./throws-on-proto");

describe("prototypes", function () {
    describe(".array", function () {
        // eslint-disable-next-line mocha/no-setup-in-describe
        verifyProperties(arrayProto, Array);
    });
    describe(".function", function () {
        // eslint-disable-next-line mocha/no-setup-in-describe
        verifyProperties(functionProto, Function);
    });
    describe(".map", function () {
        // eslint-disable-next-line mocha/no-setup-in-describe
        verifyProperties(mapProto, Map);
    });
    describe(".object", function () {
        // eslint-disable-next-line mocha/no-setup-in-describe
        verifyProperties(objectProto, Object);
    });
    describe(".set", function () {
        // eslint-disable-next-line mocha/no-setup-in-describe
        verifyProperties(setProto, Set);
    });
    describe(".string", function () {
        // eslint-disable-next-line mocha/no-setup-in-describe
        verifyProperties(stringProto, String);
    });
});

function verifyProperties(p, origin) {
    var disallowedProperties = ["size", "caller", "callee", "arguments"];
    if (throwsOnProto) {
        disallowedProperties.push("__proto__");
    }

    it("should have all the methods of the origin prototype", function () {
        var methodNames = Object.getOwnPropertyNames(origin.prototype).filter(
            function (name) {
                if (disallowedProperties.includes(name)) {
                    return false;
                }

                return typeof origin.prototype[name] === "function";
            }
        );

        methodNames.forEach(function (name) {
            assert.isTrue(Object.prototype.hasOwnProperty.call(p, name), name);
        });
    });
}

```

---

### type-of.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e449cdf3e1-commons/lib/type-of.test.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
"use strict";

var assert = require("@sinonjs/referee-sinon").assert;
var typeOf = require("./type-of");

describe("typeOf", function () {
    it("returns boolean", function () {
        assert.equals(typeOf(false), "boolean");
    });

    it("returns string", function () {
        assert.equals(typeOf("Sinon.JS"), "string");
    });

    it("returns number", function () {
        assert.equals(typeOf(123), "number");
    });

    it("returns object", function () {
        assert.equals(typeOf({}), "object");
    });

    it("returns function", function () {
        assert.equals(
            typeOf(function () {
                return undefined;
            }),
            "function"
        );
    });

    it("returns undefined", function () {
        assert.equals(typeOf(undefined), "undefined");
    });

    it("returns null", function () {
        assert.equals(typeOf(null), "null");
    });

    it("returns array", function () {
        assert.equals(typeOf([]), "array");
    });

    it("returns regexp", function () {
        assert.equals(typeOf(/.*/), "regexp");
    });

    it("returns date", function () {
        assert.equals(typeOf(new Date()), "date");
    });
});

```

---

### value-to-string.test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e449cdf3e1-commons/lib/value-to-string.test.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
"use strict";

var assert = require("@sinonjs/referee-sinon").assert;
var valueToString = require("./value-to-string");

describe("util/core/valueToString", function () {
    it("returns string representation of an object", function () {
        var obj = {};

        assert.equals(valueToString(obj), obj.toString());
    });

    it("returns 'null' for literal null'", function () {
        assert.equals(valueToString(null), "null");
    });

    it("returns 'undefined' for literal undefined", function () {
        assert.equals(valueToString(undefined), "undefined");
    });
});

```

---


## helpers@7.28.6

**Funções usados neste arquivo:** parse

### test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/6d08b99861-to-regex-range/test/test.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';

require('mocha');
const assert = require('assert').strict;
const fill = require('fill-range');
const toRange = require('..');
let count = 0;

const inRange = (min, max, num) => min <= num && max >= num;
const toRegex = str => new RegExp(`^${str}$`);
const toRangeRegex = (min, max, options) => {
  return toRegex(toRange(min, max, { wrap: true, ...options }));
};

const matcher = (...args) => {
  const regex = toRangeRegex(...args);
  return num => regex.test(String(num));
};

const matchRange = (min, max, expected, match, notMatch) => {
  if (max - min >= 1000000) {
    throw new RangeError('range is too big');
  }

  let actual = toRange(min, max);
  let msg = actual + ' => ' + expected;

  // test expected string
  assert.equal(actual, expected, msg);

  let re = toRegex(actual);
  for (let i = 0; i < match.length; i++) {
    assert(re.test(match[i]), 'should match ' + msg);
    count++;
  }

  if (!Array.isArray(notMatch)) return;
  for (let j = 0; j < notMatch.length; j++) {
    assert(!re.test(notMatch[j]), 'should not match ' + msg);
    count++;
  }
}

const verifyRange = (min, max, from, to) => {
  let isMatch = matcher(min, max);
  let minNum = Math.min(min, max);
  let maxNum = Math.max(min, max);
  let num = from - 1;

  while (++num < to) {
    let n = Number(num);
    if (inRange(minNum, maxNum, n)) {
      assert(isMatch(num), `should match "${num}"`);
    } else {
      assert(!isMatch(num), `should not match "${num}"`);
    }
    count++;
  }
};

const verifyZeros = (min, max, from, to) => {
  let range = fill(from, to);
  let len = range.length;
  let idx = -1;

  let isMatch = matcher(min, max);
  let minNum = Math.min(min, max);
  let maxNum = Math.max(min, max);

  while (++idx < len) {
    let num = range[idx];
    let n = Number(num);
    if (inRange(minNum, maxNum, n)) {
      assert(isMatch(num), `should match "${num}"`);
    } else {
      assert(!isMatch(num), `should not match "${num}"`);
    }
    count++;
  }
};

describe('to-regex-range', () => {
  after(() => {
    console.log();
    console.log('   ', (+(+count.toFixed(2))).toLocaleString(), 'assertions');
  });

  describe('range', () => {
    it('should throw an error when the first arg is invalid:', () => {
      assert.throws(() => toRange(), /expected/);
    });

    it('should throw an error when the second arg is invalid:', () => {
      assert.throws(() => toRange(1, {}), /expected/);
    });

    it('should match the given numbers', () => {
      let oneFifty = toRegex(toRange(1, 150));
      assert(oneFifty.test('125'));
      assert(!oneFifty.test('0'));
      assert(oneFifty.test('1'));
      assert(oneFifty.test('126'));
      assert(oneFifty.test('150'));
      assert(!oneFifty.test('151'));

      let oneTwentyFive = toRegex(toRange(1, 125));
      assert(oneTwentyFive.test('125'));
      assert(!oneTwentyFive.test('0'));
      assert(oneTwentyFive.test('1'));
      assert(!oneTwentyFive.test('126'));
      assert(!oneTwentyFive.test('150'));
      assert(!oneTwentyFive.test('151'));
    });
  });

  describe('minimum / maximum', () => {
    it('should reverse `min/max` when the min is larger than the max:', () => {
      assert.equal(toRange(55, 10), '(?:1[0-9]|[2-4][0-9]|5[0-5])');
    });
  });

  describe('ranges', () => {
    it('should return the number when only one argument is passed:', () => {
      assert.equal(toRange(5), '5');
    });

    it('should return a single number when both numbers are equal', () => {
      assert.equal(toRange('1', '1'), '1');
      assert.equal(toRange('65443', '65443'), '65443');
      assert.equal(toRange('192', '192'), '192');
      verifyRange(1, 1, 0, 100);
      verifyRange(65443, 65443, 65000, 66000);
      verifyRange(192, 192, 0, 1000);
    });

    it('should not return a range when both numbers are the same:', () => {
      assert.equal(toRange(5, 5), '5');
    });

    it('should return regex character classes when both args are less than 10', () => {
      assert.equal(toRange(0, 9), '[0-9]');
      assert.equal(toRange(1, 5), '[1-5]');
      assert.equal(toRange(1, 7), '[1-7]');
      assert.equal(toRange(2, 6), '[2-6]');
    });

    it('should support string numbers', () => {
      assert.equal(toRange('1', '5'), '[1-5]');
      assert.equal(toRange('10', '50'), '(?:1[0-9]|[2-4][0-9]|50)');
    });

    it('should support padded ranges:', () => {
      assert.equal(toRange('001', '005'), '0{0,2}[1-5]');
      assert.equal(toRange('01', '05'), '0?[1-5]');
      assert.equal(toRange('001', '100'), '(?:0{0,2}[1-9]|0?[1-9][0-9]|100)');
      assert.equal(toRange('0001', '1000'), '(?:0{0,3}[1-9]|0{0,2}[1-9][0-9]|0?[1-9][0-9]{2}|1000)');
    });

    it('should work when padding is imbalanced:', () => {
      assert.equal(toRange('001', '105'), '(?:0{0,2}[1-9]|0?[1-9][0-9]|10[0-5])');
      assert.equal(toRange('01', '105'), '(?:0{0,2}[1-9]|0?[1-9][0-9]|10[0-5])');
      assert.equal(toRange('010', '105'), '(?:0?1[0-9]|0?[2-9][0-9]|10[0-5])');
      assert.equal(toRange('010', '1005'), '(?:0{0,2}1[0-9]|0{0,2}[2-9][0-9]|0?[1-9][0-9]{2}|100[0-5])');
      assert.equal(toRange('0001', '1000'), toRange('001', '1000'));
      assert.equal(toRange('0001', '1000'), toRange('01', '1000'));
    });

    it('should generate regex strings for negative patterns', () => {
      assert.equal(toRange(-1, 0), '(?:-1|0)');
      assert.equal(toRange(-1, 1), '(?:-1|[01])');
      assert.equal(toRange(-4, -2), '-[2-4]');
      assert.equal(toRange(-3, 1), '(?:-[1-3]|[01])');
      assert.equal(toRange(-2, 0), '(?:-[12]|0)');
      assert.equal(toRange(-1, 3), '(?:-1|[0-3])');
      matchRange(-1, -1, '-1', [-1], [-2, 0, 1]);
      matchRange(-1, -10, '(?:-[1-9]|-10)', [-1, -5, -10], [-11, 0]);
      matchRange(-1, 3, '(?:-1|[0-3])', [-1, 0, 1, 2, 3], [-2, 4]);
    });

    it('should wrap patterns when options.capture is true', () => {
      assert.equal(toRange(-1, 0, { capture: true }), '(-1|0)');
      assert.equal(toRange(-1, 1, { capture: true }), '(-1|[01])');
      assert.equal(toRange(-4, -2, { capture: true }), '(-[2-4])');
      assert.equal(toRange(-3, 1, { capture: true }), '(-[1-3]|[01])');
      assert.equal(toRange(-2, 0, { capture: true }), '(-[12]|0)');
      assert.equal(toRange(-1, 3, { capture: true }), '(-1|[0-3])');
    });

    it('should generate regex strings for positive patterns', () => {
      assert.equal(toRange(1, 1), '1');
      assert.equal(toRange(0, 1), '(?:0|1)');
      assert.equal(toRange(0, 2), '[0-2]');
      assert.equal(toRange(65666, 65667), '(?:65666|65667)');
      assert.equal(toRange(12, 3456), '(?:1[2-9]|[2-9][0-9]|[1-9][0-9]{2}|[12][0-9]{3}|3[0-3][0-9]{2}|34[0-4][0-9]|345[0-6])');
      assert.equal(toRange(1, 3456), '(?:[1-9]|[1-9][0-9]{1,2}|[12][0-9]{3}|3[0-3][0-9]{2}|34[0-4][0-9]|345[0-6])');
      assert.equal(toRange(1, 10), '(?:[1-9]|10)');
      assert.equal(toRange(1, 19), '(?:[1-9]|1[0-9])');
      assert.equal(toRange(1, 99), '(?:[1-9]|[1-9][0-9])');
      assert.equal(toRange(1, 100), '(?:[1-9]|[1-9][0-9]|100)');
      assert.equal(toRange(1, 1000), '(?:[1-9]|[1-9][0-9]{1,2}|1000)');
      assert.equal(toRange(1, 10000), '(?:[1-9]|[1-9][0-9]{1,3}|10000)');
      assert.equal(toRange(1, 100000), '(?:[1-9]|[1-9][0-9]{1,4}|100000)');
      assert.equal(toRange(1, 9999999), '(?:[1-9]|[1-9][0-9]{1,6})');
      assert.equal(toRange(99, 100000), '(?:99|[1-9][0-9]{2,4}|100000)');

      matchRange(99, 100000, '(?:99|[1-9][0-9]{2,4}|100000)', [99, 999, 989, 100, 9999, 9899, 10009, 10999, 100000], [0, 9, 100001, 100009]);
    });

    it('should optimize regexes', () => {
      assert.equal(toRange(-9, 9), '(?:-[1-9]|[0-9])');
      assert.equal(toRange(-19, 19), '(?:-[1-9]|-?1[0-9]|[0-9])');
      assert.equal(toRange(-29, 29), '(?:-[1-9]|-?[12][0-9]|[0-9])');
      assert.equal(toRange(-99, 99), '(?:-[1-9]|-?[1-9][0-9]|[0-9])');
      assert.equal(toRange(-999, 999), '(?:-[1-9]|-?[1-9][0-9]{1,2}|[0-9])');
      assert.equal(toRange(-9999, 9999), '(?:-[1-9]|-?[1-9][0-9]{1,3}|[0-9])');
      assert.equal(toRange(-99999, 99999), '(?:-[1-9]|-?[1-9][0-9]{1,4}|[0-9])');
    });
  });

  describe('validate ranges', () => {
    it('should match all numbers in the given range', () => {
      let isMatch = matcher(1, 59);
      for (let i = 0; i < 100; i++) {
        if (i >= 1 && i <= 59) {
          assert(isMatch(i));
        } else {
          assert(!isMatch(i));
        }
      }
    });

    it('should support negative ranges:', () => {
      verifyRange(-9, -1, -100, 100);
      verifyRange(-99, -1, -1000, 1000);
      verifyRange(-999, -1, -1000, 1000);
      verifyRange(-9999, -1, -10000, 10000);
      verifyRange(-99999, -1, -100999, 100999);
    });

    it('should support negative-to-positive ranges:', () => {
      verifyRange(-9, 9, -100, 100);
      verifyRange(-99, 99, -1000, 1000);
      verifyRange(-999, 999, -1000, 1000);
      verifyRange(-9999, 9999, -10000, 10000);
      verifyRange(-99999, 99999, -100999, 100999);
    });

    it('should support large numbers:', () => {
      verifyRange(100019999300000, 100020000300000, 1000199992999900, 100020000200000);
    });

    it('should support large ranges:', () => {
      verifyRange(1, 100000, 1, 1000);
      verifyRange(1, 100000, 10000, 11000);
      verifyRange(1, 100000, 99000, 100000);
      verifyRange(1, 100000, 1000, 2000);
      verifyRange(1, 100000, 10000, 12000);
      verifyRange(1, 100000, 50000, 60000);
      verifyRange(1, 100000, 99999, 101000);
      verifyRange(10331, 20381, 0, 99999);
    });

    it('should support repeated digits:', () => {
      verifyRange(111, 222, 0, 999);
      verifyRange(111, 333, 0, 999);
      verifyRange(111, 444, 0, 999);
      verifyRange(111, 555, 0, 999);
      verifyRange(111, 666, 0, 999);
      verifyRange(111, 777, 0, 999);
      verifyRange(111, 888, 0, 999);
      verifyRange(111, 999, 0, 999);
      verifyRange(0, 111, -99, 999);
      verifyRange(0, 222, -99, 999);
      verifyRange(0, 333, -99, 999);
      verifyRange(0, 444, -99, 999);
      verifyRange(0, 555, -99, 999);
      verifyRange(0, 666, -99, 999);
      verifyRange(0, 777, -99, 999);
      verifyRange(0, 888, -99, 999);
      verifyRange(0, 999, -99, 999);
    });

    it('should support repeated zeros:', () => {
      verifyRange(10031, 20081, 0, 59999);
      verifyRange(10000, 20000, 0, 59999);
    });

    it('should support zero one:', () => {
      verifyRange(10301, 20101, 0, 99999);
      verifyRange(101010, 101210, 101009, 101300);
    });

    it('should support repeated ones:', () => {
      verifyRange(1, 11111, 0, 1000);
      verifyRange(1, 1111, 0, 1000);
      verifyRange(1, 111, 0, 1000);
      verifyRange(1, 11, 0, 1000);
      verifyRange(1, 1, 0, 1000);
    });

    it('should support small diffs:', () => {
      verifyRange(102, 103, 0, 1000);
      verifyRange(102, 110, 0, 1000);
      verifyRange(102, 130, 0, 1000);
    });

    it('should support random ranges:', () => {
      verifyRange(4173, 7981, 0, 99999);
    });

    it('should support one digit numbers:', () => {
      verifyRange(3, 7, 0, 99);
    });

    it('should support one digit at bounds:', () => {
      verifyRange(1, 9, 0, 1000);
    });

    it('should support power of ten:', () => {
      verifyRange(1000, 8632, 0, 99999);
    });

    it('should not match the negative of the same number', () => {
      verifyRange(1, 1000, -1000, 1000);
      verifyRange(1, 1000, '-1000', '1000');
    });

    it('should work with numbers of varying lengths:', () => {
      verifyRange(1030, 20101, 0, 99999);
      verifyRange(13, 8632, 0, 10000);
    });

    it('should support small ranges:', () => {
      verifyRange(9, 11, 0, 100);
      verifyRange(19, 21, 0, 100);
    });

    it('should support big ranges:', () => {
      verifyRange(90, 98009, 0, 98999);
      verifyRange(999, 10000, 1, 20000);
    });

    it('should create valid regex ranges with zero-padding:', () => {
      verifyZeros('001', '100', '001', 100);
      verifyZeros('001', '100', '001', '100');
      verifyZeros('0001', '1000', '01', 1000);
      verifyZeros('0001', '1000', '-01', 1000);
      verifyZeros('0001', '1000', '-099', '1000');
      verifyZeros('0001', '1000', '-010', 1000);
      verifyZeros('0001', '1000', '-010', 1000);
      verifyZeros('0001', '1000', '0001', '1000');
      verifyZeros('01', '1000', '-01', '1000');
      verifyZeros('000000001', '1000', '-010', '1000');
      verifyZeros('00000001', '1000', '-010', '1000');
      verifyZeros('0000001', '1000', '-010', '1000');
      verifyZeros('000001', '1000', '-010', '1000');
      verifyZeros('00001', '1000', '-010', '1000');
      verifyZeros('0001', '1000', '-010', '1000');
      verifyZeros('001', '1000', '-010', '1000');
      verifyZeros('01', '1000', '-010', '1000');
      verifyZeros('0001', '1000', '-010', '1000');
    });

    it('should create valid regex ranges with negative padding:', () => {
      verifyZeros('-00001', '-1000', -1000, 1000);
      verifyZeros('-0001', '-1000', -1000, 1000);
      verifyZeros('-001', '-1000', -1000, 1000);
      verifyZeros('-01', '-1000', -1000, 1000);
    });

    it('should create valid ranges with neg && pos zero-padding:', () => {
      verifyZeros('-01', '10', '-1', '01');
      verifyZeros('-1000', '100', -1000, 1000);
      verifyZeros('-1000', '0100', '-010', '1000');
      verifyZeros('-0100', '100', '-01', '100');
      verifyZeros('-010', '100', '-01', '100');
      verifyZeros('-01', '100', '-01', '100');
      verifyZeros('-01000', '1000', '-010', '1000');
      verifyZeros('-0100', '1000', '-010', '1000');
      verifyZeros('-010', '1000', '-010', '1000');
      verifyZeros('-01', '1000', '-010', '1000');
    });
  });
});

```

---


## template@7.28.6

**Funções usados neste arquivo:** parse

### test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e942edea32-p-locate/test.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
import {serial as test} from 'ava';
import delay from 'delay';
import inRange from 'in-range';
import timeSpan from 'time-span';
import pLocate from '.';

const input = [
	[1, 300],
	[2, 400],
	[3, 200],
	Promise.resolve([4, 100]) // Ensures promises work in the input
];

const tester = async ([value, ms]) => {
	await delay(ms);
	return value === 2 || value === 3;
};

test('main', async t => {
	const end = timeSpan();
	t.is((await pLocate(input, tester))[0], 2);
	t.true(inRange(end(), 370, 450), 'should be time of item `2`');
});

test('option {preserveOrder:false}', async t => {
	const end = timeSpan();
	t.is((await pLocate(input, tester, {preserveOrder: false}))[0], 3);
	t.true(inRange(end(), 170, 250), 'should be time of item `3`');
});

test('option {concurrency:1}', async t => {
	const end = timeSpan();
	t.is((await pLocate(input, tester, {concurrency: 1}))[0], 2);
	t.true(inRange(end(), 670, 750), 'should be time of items `1` and `2`, since they run serially');
});

test('returns `undefined` when nothing could be found', async t => {
	t.is((await pLocate([1, 2, 3], () => false)), undefined);
});

test('rejected return value in `tester` rejects the promise', async t => {
	const fixtureError = new Error('fixture');
	await t.throwsAsync(pLocate([1, 2, 3], () => Promise.reject(fixtureError)), fixtureError.message);
});

```

---


## traverse@7.29.0

**Funções usados neste arquivo:** parse


## helper-plugin-utils@7.28.6

**Funções usados neste arquivo:** parse

### download-node-tests.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/bin/download-node-tests.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
#!/usr/bin/env node

var concat = require('concat-stream')
var cp = require('child_process')
var fs = require('fs')
var hyperquest = require('hyperquest')
var path = require('path')
var split = require('split')
var through = require('through2')

var url = 'https://api.github.com/repos/nodejs/node/contents'
var dirs = [
  '/test/parallel',
  '/test/pummel'
]

cp.execSync('rm -rf node/test-*.js', { cwd: path.join(__dirname, '../test') })

var httpOpts = {
  headers: {
    'User-Agent': null
    // auth if github rate-limits you...
    // 'Authorization': 'Basic ' + Buffer('username:password').toString('base64'),
  }
}

dirs.forEach(function (dir) {
  var req = hyperquest(url + dir, httpOpts)
  req.pipe(concat(function (data) {
    if (req.response.statusCode !== 200) {
      throw new Error(url + dir + ': ' + data.toString())
    }
    downloadBufferTests(dir, JSON.parse(data))
  }))
})

function downloadBufferTests (dir, files) {
  files.forEach(function (file) {
    if (!/test-buffer.*/.test(file.name)) return

    const skipFileNames = [
      // Only applies to node. Calls into C++ and needs to ensure the prototype can't
      // be faked, or else there will be a segfault.
      'test-buffer-fakes.js',
      // Tests SharedArrayBuffer support, which is obscure and now temporarily
      // disabled in all browsers due to the Spectre/Meltdown security issue.
      'test-buffer-sharedarraybuffer.js',
      // References Node.js internals, irrelevant to browser implementation
      'test-buffer-bindingobj-no-zerofill.js',
      // Destructive test, modifies buffer.INSPECT_MAX_BYTES and causes later tests
      // to fail.
      'test-buffer-inspect.js'
    ]

    // Skip test files with these names
    if (skipFileNames.includes(file.name)) return

    console.log(file.download_url)

    var out = path.join(__dirname, '../test/node', file.name)
    hyperquest(file.download_url, httpOpts)
      .pipe(split())
      .pipe(testfixer(file.name))
      .pipe(fs.createWriteStream(out))
      .on('finish', function () {
        console.log('wrote ' + file.name)
      })
  })
}

function testfixer (filename) {
  var firstline = true

  return through(function (line, enc, cb) {
    line = line.toString()

    if (firstline) {
      // require buffer explicitly
      var preamble = 'var Buffer = require(\'../../\').Buffer;'
      if (/use strict/.test(line)) line += '\n' + preamble
      else line += preamble + '\n' + line
      firstline = false
    }

    // make `require('../common')` work
    line = line.replace(/require\('\.\.\/common'\);/g, 'require(\'./common\');')

    // require browser buffer
    line = line.replace(/(.*)require\('buffer'\)(.*)/g, '$1require(\'../../\')$2')

    // comment out console logs
    line = line.replace(/(.*console\..*)/g, '// $1')

    // we can't reliably test typed array max-sizes in the browser
    if (filename === 'test-buffer-big.js') {
      line = line.replace(/(.*new Int8Array.*RangeError.*)/, '// $1')
      line = line.replace(/(.*new ArrayBuffer.*RangeError.*)/, '// $1')
      line = line.replace(/(.*new Float64Array.*RangeError.*)/, '// $1')
    }

    // https://github.com/nodejs/node/blob/v0.12/test/parallel/test-buffer.js#L1138
    // unfortunately we can't run this because crypto-browserify doesn't work in old
    // versions of ie
    if (filename === 'test-buffer.js') {
      line = line.replace(/^(\s*)(var crypto = require.*)/, '$1// $2')
      line = line.replace(/(crypto.createHash.*\))/, '1 /*$1*/')
    }

    cb(null, line + '\n')
  })
}

```

---

### test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/bin/test.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
#!/usr/bin/env node

var cp = require('child_process')
var fs = require('fs')
var path = require('path')

var node = cp.spawn('npm', ['run', 'test-node'], { stdio: 'inherit' })
node.on('close', function (code) {
  if (code !== 0) return process.exit(code)
  runBrowserTests()
})

function runBrowserTests () {
  var airtapYmlPath = path.join(__dirname, '..', '.airtap.yml')

  writeES5AirtapYml()
  cp.spawn('npm', ['run', 'test-browser-es5'], { stdio: 'inherit' })
    .on('close', function (code) {
      if (code !== 0) process.exit(code)
      writeES6AirtapYml()
      cp.spawn('npm', ['run', 'test-browser-es6'], { stdio: 'inherit' })
        .on('close', function (code) {
          process.exit(code)
        })
    })

  function writeES5AirtapYml () {
    fs.writeFileSync(airtapYmlPath, fs.readFileSync(path.join(__dirname, 'airtap-es5.yml')))
  }

  function writeES6AirtapYml () {
    fs.writeFileSync(airtapYmlPath, fs.readFileSync(path.join(__dirname, 'airtap-es6.yml')))
  }
}

```

---

### base64.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/base64.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
var B = require('../').Buffer
var test = require('tape')

test('base64: ignore whitespace', function (t) {
  var text = '\n   YW9ldQ==  '
  var buf = new B(text, 'base64')
  t.equal(buf.toString(), 'aoeu')
  t.end()
})

test('base64: strings without padding', function (t) {
  t.equal((new B('YW9ldQ', 'base64').toString()), 'aoeu')
  t.end()
})

test('base64: newline in utf8 -- should not be an issue', function (t) {
  t.equal(
    new B('LS0tCnRpdGxlOiBUaHJlZSBkYXNoZXMgbWFya3MgdGhlIHNwb3QKdGFnczoK', 'base64').toString('utf8'),
    '---\ntitle: Three dashes marks the spot\ntags:\n'
  )
  t.end()
})

test('base64: newline in base64 -- should get stripped', function (t) {
  t.equal(
    new B('LS0tCnRpdGxlOiBUaHJlZSBkYXNoZXMgbWFya3MgdGhlIHNwb3QKdGFnczoK\nICAtIHlhbWwKICAtIGZyb250LW1hdHRlcgogIC0gZGFzaGVzCmV4cGFuZWQt', 'base64').toString('utf8'),
    '---\ntitle: Three dashes marks the spot\ntags:\n  - yaml\n  - front-matter\n  - dashes\nexpaned-'
  )
  t.end()
})

test('base64: tab characters in base64 - should get stripped', function (t) {
  t.equal(
    new B('LS0tCnRpdGxlOiBUaHJlZSBkYXNoZXMgbWFya3MgdGhlIHNwb3QKdGFnczoK\t\t\t\tICAtIHlhbWwKICAtIGZyb250LW1hdHRlcgogIC0gZGFzaGVzCmV4cGFuZWQt', 'base64').toString('utf8'),
    '---\ntitle: Three dashes marks the spot\ntags:\n  - yaml\n  - front-matter\n  - dashes\nexpaned-'
  )
  t.end()
})

test('base64: invalid non-alphanumeric characters -- should be stripped', function (t) {
  t.equal(
    new B('!"#$%&\'()*,.:;<=>?@[\\]^`{|}~', 'base64').toString('utf8'),
    ''
  )
  t.end()
})

test('base64: high byte', function (t) {
  var highByte = B.from([128])
  t.deepEqual(
    B.alloc(1, highByte.toString('base64'), 'base64'),
    highByte
  )
  t.end()
})

```

---

### basic.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/basic.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
var B = require('../').Buffer
var test = require('tape')

test('instanceof Buffer', function (t) {
  var buf = new B([1, 2])
  t.ok(buf instanceof B)
  t.end()
})

test('convert to Uint8Array in modern browsers', function (t) {
  var buf = new B([1, 2])
  var uint8array = new Uint8Array(buf.buffer)
  t.ok(uint8array instanceof Uint8Array)
  t.equal(uint8array[0], 1)
  t.equal(uint8array[1], 2)
  t.end()
})

test('indexes from a string', function (t) {
  var buf = new B('abc')
  t.equal(buf[0], 97)
  t.equal(buf[1], 98)
  t.equal(buf[2], 99)
  t.end()
})

test('indexes from an array', function (t) {
  var buf = new B([97, 98, 99])
  t.equal(buf[0], 97)
  t.equal(buf[1], 98)
  t.equal(buf[2], 99)
  t.end()
})

test('setting index value should modify buffer contents', function (t) {
  var buf = new B([97, 98, 99])
  t.equal(buf[2], 99)
  t.equal(buf.toString(), 'abc')

  buf[2] += 10
  t.equal(buf[2], 109)
  t.equal(buf.toString(), 'abm')
  t.end()
})

test('storing negative number should cast to unsigned', function (t) {
  var buf = new B(1)

  buf[0] = -3
  t.equal(buf[0], 253)

  buf = new B(1)
  buf.writeInt8(-3, 0)
  t.equal(buf[0], 253)

  t.end()
})

test('test that memory is copied from array-like', function (t) {
  var u = new Uint8Array(4)
  var b = new B(u)
  b[0] = 1
  b[1] = 2
  b[2] = 3
  b[3] = 4

  t.equal(u[0], 0)
  t.equal(u[1], 0)
  t.equal(u[2], 0)
  t.equal(u[3], 0)

  t.end()
})

```

---

### compare.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/compare.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
var B = require('../').Buffer
var test = require('tape')

test('buffer.compare', function (t) {
  var b = new B(1).fill('a')
  var c = new B(1).fill('c')
  var d = new B(2).fill('aa')

  t.equal(b.compare(c), -1)
  t.equal(c.compare(d), 1)
  t.equal(d.compare(b), 1)
  t.equal(b.compare(d), -1)

  // static method
  t.equal(B.compare(b, c), -1)
  t.equal(B.compare(c, d), 1)
  t.equal(B.compare(d, b), 1)
  t.equal(B.compare(b, d), -1)
  t.end()
})

test('buffer.compare argument validation', function (t) {
  t.throws(function () {
    var b = new B(1)
    B.compare(b, 'abc')
  })

  t.throws(function () {
    var b = new B(1)
    B.compare('abc', b)
  })

  t.throws(function () {
    var b = new B(1)
    b.compare('abc')
  })
  t.end()
})

test('buffer.equals', function (t) {
  var b = new B(5).fill('abcdf')
  var c = new B(5).fill('abcdf')
  var d = new B(5).fill('abcde')
  var e = new B(6).fill('abcdef')

  t.ok(b.equals(c))
  t.ok(!c.equals(d))
  t.ok(!d.equals(e))
  t.end()
})

test('buffer.equals argument validation', function (t) {
  t.throws(function () {
    var b = new B(1)
    b.equals('abc')
  })
  t.end()
})

```

---

### constructor.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/constructor.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
var B = require('../').Buffer
var test = require('tape')

test('new buffer from array', function (t) {
  t.equal(
    new B([1, 2, 3]).toString(),
    '\u0001\u0002\u0003'
  )
  t.end()
})

test('new buffer from array w/ negatives', function (t) {
  t.equal(
    new B([-1, -2, -3]).toString('hex'),
    'fffefd'
  )
  t.end()
})

test('new buffer from array with mixed signed input', function (t) {
  t.equal(
    new B([-255, 255, -128, 128, 512, -512, 511, -511]).toString('hex'),
    '01ff80800000ff01'
  )
  t.end()
})

test('new buffer from string', function (t) {
  t.equal(
    new B('hey', 'utf8').toString(),
    'hey'
  )
  t.end()
})

test('new buffer from buffer', function (t) {
  var b1 = new B('asdf')
  var b2 = new B(b1)
  t.equal(b1.toString('hex'), b2.toString('hex'))
  t.end()
})

test('new buffer from ArrayBuffer', function (t) {
  if (typeof ArrayBuffer !== 'undefined') {
    var arraybuffer = new Uint8Array([0, 1, 2, 3]).buffer
    var b = new B(arraybuffer)
    t.equal(b.length, 4)
    t.equal(b[0], 0)
    t.equal(b[1], 1)
    t.equal(b[2], 2)
    t.equal(b[3], 3)
    t.equal(b[4], undefined)
  }
  t.end()
})

test('new buffer from ArrayBuffer, shares memory', function (t) {
  var u = new Uint8Array([0, 1, 2, 3])
  var arraybuffer = u.buffer
  var b = new B(arraybuffer)
  t.equal(b.length, 4)
  t.equal(b[0], 0)
  t.equal(b[1], 1)
  t.equal(b[2], 2)
  t.equal(b[3], 3)
  t.equal(b[4], undefined)

  // changing the Uint8Array (and thus the ArrayBuffer), changes the Buffer
  u[0] = 10
  t.equal(b[0], 10)
  u[1] = 11
  t.equal(b[1], 11)
  u[2] = 12
  t.equal(b[2], 12)
  u[3] = 13
  t.equal(b[3], 13)
  t.end()
})

test('new buffer from Uint8Array', function (t) {
  if (typeof Uint8Array !== 'undefined') {
    var b1 = new Uint8Array([0, 1, 2, 3])
    var b2 = new B(b1)
    t.equal(b1.length, b2.length)
    t.equal(b1[0], 0)
    t.equal(b1[1], 1)
    t.equal(b1[2], 2)
    t.equal(b1[3], 3)
    t.equal(b1[4], undefined)
  }
  t.end()
})

test('new buffer from Uint16Array', function (t) {
  if (typeof Uint16Array !== 'undefined') {
    var b1 = new Uint16Array([0, 1, 2, 3])
    var b2 = new B(b1)
    t.equal(b1.length, b2.length)
    t.equal(b1[0], 0)
    t.equal(b1[1], 1)
    t.equal(b1[2], 2)
    t.equal(b1[3], 3)
    t.equal(b1[4], undefined)
  }
  t.end()
})

test('new buffer from Uint32Array', function (t) {
  if (typeof Uint32Array !== 'undefined') {
    var b1 = new Uint32Array([0, 1, 2, 3])
    var b2 = new B(b1)
    t.equal(b1.length, b2.length)
    t.equal(b1[0], 0)
    t.equal(b1[1], 1)
    t.equal(b1[2], 2)
    t.equal(b1[3], 3)
    t.equal(b1[4], undefined)
  }
  t.end()
})

test('new buffer from Int16Array', function (t) {
  if (typeof Int16Array !== 'undefined') {
    var b1 = new Int16Array([0, 1, 2, 3])
    var b2 = new B(b1)
    t.equal(b1.length, b2.length)
    t.equal(b1[0], 0)
    t.equal(b1[1], 1)
    t.equal(b1[2], 2)
    t.equal(b1[3], 3)
    t.equal(b1[4], undefined)
  }
  t.end()
})

test('new buffer from Int32Array', function (t) {
  if (typeof Int32Array !== 'undefined') {
    var b1 = new Int32Array([0, 1, 2, 3])
    var b2 = new B(b1)
    t.equal(b1.length, b2.length)
    t.equal(b1[0], 0)
    t.equal(b1[1], 1)
    t.equal(b1[2], 2)
    t.equal(b1[3], 3)
    t.equal(b1[4], undefined)
  }
  t.end()
})

test('new buffer from Float32Array', function (t) {
  if (typeof Float32Array !== 'undefined') {
    var b1 = new Float32Array([0, 1, 2, 3])
    var b2 = new B(b1)
    t.equal(b1.length, b2.length)
    t.equal(b1[0], 0)
    t.equal(b1[1], 1)
    t.equal(b1[2], 2)
    t.equal(b1[3], 3)
    t.equal(b1[4], undefined)
  }
  t.end()
})

test('new buffer from Float64Array', function (t) {
  if (typeof Float64Array !== 'undefined') {
    var b1 = new Float64Array([0, 1, 2, 3])
    var b2 = new B(b1)
    t.equal(b1.length, b2.length)
    t.equal(b1[0], 0)
    t.equal(b1[1], 1)
    t.equal(b1[2], 2)
    t.equal(b1[3], 3)
    t.equal(b1[4], undefined)
  }
  t.end()
})

test('new buffer from buffer.toJSON() output', function (t) {
  if (typeof JSON === 'undefined') {
    // ie6, ie7 lack support
    t.end()
    return
  }
  var buf = new B('test')
  var json = JSON.stringify(buf)
  var obj = JSON.parse(json)
  var copy = new B(obj)
  t.ok(buf.equals(copy))
  t.end()
})

```

---

### from-string.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/from-string.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
var B = require('../').Buffer
var test = require('tape')

test('detect utf16 surrogate pairs', function (t) {
  var text = '\uD83D\uDE38' + '\uD83D\uDCAD' + '\uD83D\uDC4D'
  var buf = new B(text)
  t.equal(text, buf.toString())
  t.end()
})

test('detect utf16 surrogate pairs over U+20000 until U+10FFFF', function (t) {
  var text = '\uD842\uDFB7' + '\uD93D\uDCAD' + '\uDBFF\uDFFF'
  var buf = new B(text)
  t.equal(text, buf.toString())
  t.end()
})

test('replace orphaned utf16 surrogate lead code point', function (t) {
  var text = '\uD83D\uDE38' + '\uD83D' + '\uD83D\uDC4D'
  var buf = new B(text)
  t.deepEqual(buf, new B([0xf0, 0x9f, 0x98, 0xb8, 0xef, 0xbf, 0xbd, 0xf0, 0x9f, 0x91, 0x8d]))
  t.end()
})

test('replace orphaned utf16 surrogate trail code point', function (t) {
  var text = '\uD83D\uDE38' + '\uDCAD' + '\uD83D\uDC4D'
  var buf = new B(text)
  t.deepEqual(buf, new B([0xf0, 0x9f, 0x98, 0xb8, 0xef, 0xbf, 0xbd, 0xf0, 0x9f, 0x91, 0x8d]))
  t.end()
})

test('do not write partial utf16 code units', function (t) {
  var f = new B([0, 0, 0, 0, 0])
  t.equal(f.length, 5)
  var size = f.write('あいうえお', 'utf16le')
  t.equal(size, 4)
  t.deepEqual(f, new B([0x42, 0x30, 0x44, 0x30, 0x00]))
  t.end()
})

test('handle partial utf16 code points when encoding to utf8 the way node does', function (t) {
  var text = '\uD83D\uDE38' + '\uD83D\uDC4D'

  var buf = new B(8)
  buf.fill(0)
  buf.write(text)
  t.deepEqual(buf, new B([0xf0, 0x9f, 0x98, 0xb8, 0xf0, 0x9f, 0x91, 0x8d]))

  buf = new B(7)
  buf.fill(0)
  buf.write(text)
  t.deepEqual(buf, new B([0xf0, 0x9f, 0x98, 0xb8, 0x00, 0x00, 0x00]))

  buf = new B(6)
  buf.fill(0)
  buf.write(text)
  t.deepEqual(buf, new B([0xf0, 0x9f, 0x98, 0xb8, 0x00, 0x00]))

  buf = new B(5)
  buf.fill(0)
  buf.write(text)
  t.deepEqual(buf, new B([0xf0, 0x9f, 0x98, 0xb8, 0x00]))

  buf = new B(4)
  buf.fill(0)
  buf.write(text)
  t.deepEqual(buf, new B([0xf0, 0x9f, 0x98, 0xb8]))

  buf = new B(3)
  buf.fill(0)
  buf.write(text)
  t.deepEqual(buf, new B([0x00, 0x00, 0x00]))

  buf = new B(2)
  buf.fill(0)
  buf.write(text)
  t.deepEqual(buf, new B([0x00, 0x00]))

  buf = new B(1)
  buf.fill(0)
  buf.write(text)
  t.deepEqual(buf, new B([0x00]))

  t.end()
})

test('handle invalid utf16 code points when encoding to utf8 the way node does', function (t) {
  var text = 'a' + '\uDE38\uD83D' + 'b'

  var buf = new B(8)
  buf.fill(0)
  buf.write(text)
  t.deepEqual(buf, new B([0x61, 0xef, 0xbf, 0xbd, 0xef, 0xbf, 0xbd, 0x62]))

  buf = new B(7)
  buf.fill(0)
  buf.write(text)
  t.deepEqual(buf, new B([0x61, 0xef, 0xbf, 0xbd, 0xef, 0xbf, 0xbd]))

  buf = new B(6)
  buf.fill(0)
  buf.write(text)
  t.deepEqual(buf, new B([0x61, 0xef, 0xbf, 0xbd, 0x00, 0x00]))

  buf = new B(5)
  buf.fill(0)
  buf.write(text)
  t.deepEqual(buf, new B([0x61, 0xef, 0xbf, 0xbd, 0x00]))

  buf = new B(4)
  buf.fill(0)
  buf.write(text)
  t.deepEqual(buf, new B([0x61, 0xef, 0xbf, 0xbd]))

  buf = new B(3)
  buf.fill(0)
  buf.write(text)
  t.deepEqual(buf, new B([0x61, 0x00, 0x00]))

  buf = new B(2)
  buf.fill(0)
  buf.write(text)
  t.deepEqual(buf, new B([0x61, 0x00]))

  buf = new B(1)
  buf.fill(0)
  buf.write(text)
  t.deepEqual(buf, new B([0x61]))

  t.end()
})

```

---

### is-buffer.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/is-buffer.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
var B = require('../').Buffer
var isBuffer = require('is-buffer')
var test = require('tape')

test('is-buffer tests', function (t) {
  t.ok(isBuffer(new B(4)), 'new Buffer(4)')

  t.notOk(isBuffer(undefined), 'undefined')
  t.notOk(isBuffer(null), 'null')
  t.notOk(isBuffer(''), 'empty string')
  t.notOk(isBuffer(true), 'true')
  t.notOk(isBuffer(false), 'false')
  t.notOk(isBuffer(0), '0')
  t.notOk(isBuffer(1), '1')
  t.notOk(isBuffer(1.0), '1.0')
  t.notOk(isBuffer('string'), 'string')
  t.notOk(isBuffer({}), '{}')
  t.notOk(isBuffer(function foo () {}), 'function foo () {}')

  t.end()
})

```

---

### methods.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/methods.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
var B = require('../').Buffer
var test = require('tape')

test('buffer.toJSON', function (t) {
  var data = [1, 2, 3, 4]
  t.deepEqual(
    new B(data).toJSON(),
    { type: 'Buffer', data: [1, 2, 3, 4] }
  )
  t.end()
})

test('buffer.copy', function (t) {
  // copied from nodejs.org example
  var buf1 = new B(26)
  var buf2 = new B(26)

  for (var i = 0; i < 26; i++) {
    buf1[i] = i + 97 // 97 is ASCII a
    buf2[i] = 33 // ASCII !
  }

  buf1.copy(buf2, 8, 16, 20)

  t.equal(
    buf2.toString('ascii', 0, 25),
    '!!!!!!!!qrst!!!!!!!!!!!!!'
  )
  t.end()
})

test('test offset returns are correct', function (t) {
  var b = new B(16)
  t.equal(4, b.writeUInt32LE(0, 0))
  t.equal(6, b.writeUInt16LE(0, 4))
  t.equal(7, b.writeUInt8(0, 6))
  t.equal(8, b.writeInt8(0, 7))
  t.equal(16, b.writeDoubleLE(0, 8))
  t.end()
})

test('concat() a varying number of buffers', function (t) {
  var zero = []
  var one = [new B('asdf')]
  var long = []
  for (var i = 0; i < 10; i++) {
    long.push(new B('asdf'))
  }

  var flatZero = B.concat(zero)
  var flatOne = B.concat(one)
  var flatLong = B.concat(long)
  var flatLongLen = B.concat(long, 40)

  t.equal(flatZero.length, 0)
  t.equal(flatOne.toString(), 'asdf')
  t.deepEqual(flatOne, one[0])
  t.equal(flatLong.toString(), (new Array(10 + 1).join('asdf')))
  t.equal(flatLongLen.toString(), (new Array(10 + 1).join('asdf')))
  t.end()
})

test('concat() works on Uint8Array instances', function (t) {
  var result = B.concat([new Uint8Array([1, 2]), new Uint8Array([3, 4])])
  var expected = B.from([1, 2, 3, 4])
  t.deepEqual(result, expected)
  t.end()
})

test('concat() works on Uint8Array instances for smaller provided totalLength', function (t) {
  const result = B.concat([new Uint8Array([1, 2]), new Uint8Array([3, 4])], 3)
  const expected = B.from([1, 2, 3])
  t.deepEqual(result, expected)
  t.end()
})

test('fill', function (t) {
  var b = new B(10)
  b.fill(2)
  t.equal(b.toString('hex'), '02020202020202020202')
  t.end()
})

test('fill (string)', function (t) {
  var b = new B(10)
  b.fill('abc')
  t.equal(b.toString(), 'abcabcabca')
  b.fill('է')
  t.equal(b.toString(), 'էէէէէ')
  t.end()
})

test('copy() empty buffer with sourceEnd=0', function (t) {
  var source = new B([42])
  var destination = new B([43])
  source.copy(destination, 0, 0, 0)
  t.equal(destination.readUInt8(0), 43)
  t.end()
})

test('copy() after slice()', function (t) {
  var source = new B(200)
  var dest = new B(200)
  var expected = new B(200)
  for (var i = 0; i < 200; i++) {
    source[i] = i
    dest[i] = 0
  }

  source.slice(2).copy(dest)
  source.copy(expected, 0, 2)
  t.deepEqual(dest, expected)
  t.end()
})

test('copy() ascending', function (t) {
  var b = new B('abcdefghij')
  b.copy(b, 0, 3, 10)
  t.equal(b.toString(), 'defghijhij')
  t.end()
})

test('copy() descending', function (t) {
  var b = new B('abcdefghij')
  b.copy(b, 3, 0, 7)
  t.equal(b.toString(), 'abcabcdefg')
  t.end()
})

test('buffer.slice sets indexes', function (t) {
  t.equal((new B('hallo')).slice(0, 5).toString(), 'hallo')
  t.end()
})

test('buffer.slice out of range', function (t) {
  t.plan(2)
  t.equal((new B('hallo')).slice(0, 10).toString(), 'hallo')
  t.equal((new B('hallo')).slice(10, 2).toString(), '')
  t.end()
})

```

---

### common.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/common.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

/* eslint-disable required-modules, crypto-check */
'use strict';
const assert = require('assert');
const mustCallChecks = [];

function runCallChecks(exitCode) {
  if (exitCode !== 0) return;

  const failed = mustCallChecks.filter(function(context) {
    if ('minimum' in context) {
      context.messageSegment = `at least ${context.minimum}`;
      return context.actual < context.minimum;
    } else {
      context.messageSegment = `exactly ${context.exact}`;
      return context.actual !== context.exact;
    }
  });

  failed.forEach(function(context) {
    console.log('Mismatched %s function calls. Expected %s, actual %d.',
                context.name,
                context.messageSegment,
                context.actual);
    console.log(context.stack.split('\n').slice(2).join('\n'));
  });

  if (failed.length) process.exit(1);
}

exports.mustCall = function(fn, exact) {
  return _mustCallInner(fn, exact, 'exact');
};

function _mustCallInner(fn, criteria = 1, field) {
  if (process._exiting)
    throw new Error('Cannot use common.mustCall*() in process exit handler');
  if (typeof fn === 'number') {
    criteria = fn;
    fn = noop;
  } else if (fn === undefined) {
    fn = noop;
  }

  if (typeof criteria !== 'number')
    throw new TypeError(`Invalid ${field} value: ${criteria}`);

  const context = {
    [field]: criteria,
    actual: 0,
    stack: (new Error()).stack,
    name: fn.name || '<anonymous>'
  };

  // add the exit listener only once to avoid listener leak warnings
  if (mustCallChecks.length === 0) process.on('exit', runCallChecks);

  mustCallChecks.push(context);

  return function() {
    context.actual++;
    return fn.apply(this, arguments);
  };
}

exports.printSkipMessage = function(msg) {}

// Useful for testing expected internal/error objects
exports.expectsError = function expectsError(fn, settings, exact) {
  if (typeof fn !== 'function') {
    exact = settings;
    settings = fn;
    fn = undefined;
  }
  function innerFn(error) {
    if ('type' in settings) {
      const type = settings.type;
      if (type !== Error && !Error.isPrototypeOf(type)) {
        throw new TypeError('`settings.type` must inherit from `Error`');
      }
      assert(error instanceof type,
             `${error.name} is not instance of ${type.name}`);
      let typeName = error.constructor.name;
      if (typeName === 'NodeError' && type.name !== 'NodeError') {
        typeName = Object.getPrototypeOf(error.constructor).name;
      }
      assert.strictEqual(typeName, type.name);
    }
    if ('message' in settings) {
      const message = settings.message;
      if (typeof message === 'string') {
        assert.strictEqual(error.message, message);
      } else {
        assert(message.test(error.message),
               `${error.message} does not match ${message}`);
      }
    }
    if ('name' in settings) {
      assert.strictEqual(error.name, settings.name);
    }
    if (error.constructor.name === 'AssertionError') {
      ['generatedMessage', 'actual', 'expected', 'operator'].forEach((key) => {
        if (key in settings) {
          const actual = error[key];
          const expected = settings[key];
          assert.strictEqual(actual, expected,
                             `${key}: expected ${expected}, not ${actual}`);
        }
      });
    }
    return true;
  }
  if (fn) {
    assert.throws(fn, innerFn);
    return;
  }
  return exports.mustCall(innerFn, exact);
};

```

---

### test-buffer-alloc.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-alloc.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;
const common = require('./common');
const assert = require('assert');
const vm = require('vm');

const SlowBuffer = require('../../').SlowBuffer;


const b = Buffer.allocUnsafe(1024);
assert.strictEqual(1024, b.length);

b[0] = -1;
assert.strictEqual(b[0], 255);

for (let i = 0; i < 1024; i++) {
  b[i] = i % 256;
}

for (let i = 0; i < 1024; i++) {
  assert.strictEqual(i % 256, b[i]);
}

const c = Buffer.allocUnsafe(512);
assert.strictEqual(512, c.length);

const d = Buffer.from([]);
assert.strictEqual(0, d.length);

// Test offset properties
{
  const b = Buffer.alloc(128);
  assert.strictEqual(128, b.length);
  assert.strictEqual(0, b.byteOffset);
  assert.strictEqual(0, b.offset);
}

// Test creating a Buffer from a Uint32Array
{
  const ui32 = new Uint32Array(4).fill(42);
  const e = Buffer.from(ui32);
  for (const [index, value] of e.entries()) {
    assert.strictEqual(value, ui32[index]);
  }
}
// Test creating a Buffer from a Uint32Array (old constructor)
{
  const ui32 = new Uint32Array(4).fill(42);
  const e = Buffer(ui32);
  for (const [key, value] of e.entries()) {
    assert.deepStrictEqual(value, ui32[key]);
  }
}
{
  const sab = new SharedArrayBuffer(Uint8Array.BYTES_PER_ELEMENT * 4);
  const ui32 = new Uint8Array(sab).fill(42);
  const e = Buffer(sab);
  for (const [key, value] of e.entries()) {
    assert.deepStrictEqual(value, ui32[key]);
  }
}

// Test invalid encoding for Buffer.toString
assert.throws(() => b.toString('invalid'),
              /Unknown encoding: invalid/);
// invalid encoding for Buffer.write
assert.throws(() => b.write('test string', 0, 5, 'invalid'),
              /Unknown encoding: invalid/);
// unsupported arguments for Buffer.write
assert.throws(() => b.write('test', 'utf8', 0),
              /is no longer supported/);


// try to create 0-length buffers
assert.doesNotThrow(() => Buffer.from(''));
assert.doesNotThrow(() => Buffer.from('', 'ascii'));
assert.doesNotThrow(() => Buffer.from('', 'latin1'));
assert.doesNotThrow(() => Buffer.alloc(0));
assert.doesNotThrow(() => Buffer.allocUnsafe(0));
assert.doesNotThrow(() => new Buffer(''));
assert.doesNotThrow(() => new Buffer('', 'ascii'));
assert.doesNotThrow(() => new Buffer('', 'latin1'));
assert.doesNotThrow(() => new Buffer('', 'binary'));
assert.doesNotThrow(() => Buffer(0));
assert.doesNotThrow(() => Buffer.alloc(16, !!true));

// try to write a 0-length string beyond the end of b
assert.throws(() => b.write('', 2048), RangeError);

// throw when writing to negative offset
assert.throws(() => b.write('a', -1), RangeError);

// throw when writing past bounds from the pool
assert.throws(() => b.write('a', 2048), RangeError);

// throw when writing to negative offset
assert.throws(() => b.write('a', -1), RangeError);

// try to copy 0 bytes worth of data into an empty buffer
b.copy(Buffer.alloc(0), 0, 0, 0);

// try to copy 0 bytes past the end of the target buffer
b.copy(Buffer.alloc(0), 1, 1, 1);
b.copy(Buffer.alloc(1), 1, 1, 1);

// try to copy 0 bytes from past the end of the source buffer
b.copy(Buffer.alloc(1), 0, 2048, 2048);

// testing for smart defaults and ability to pass string values as offset
{
  const writeTest = Buffer.from('abcdes');
  writeTest.write('n', 'ascii');
  writeTest.write('o', '1', 'ascii');
  writeTest.write('d', '2', 'ascii');
  writeTest.write('e', 3, 'ascii');
  writeTest.write('j', 4, 'ascii');
  assert.strictEqual(writeTest.toString(), 'nodejs');
}

// Offset points to the end of the buffer
// (see https://github.com/nodejs/node/issues/8127).
assert.doesNotThrow(() => Buffer.alloc(1).write('', 1, 0));

// ASCII slice test
{
  const asciiString = 'hello world';

  for (let i = 0; i < asciiString.length; i++) {
    b[i] = asciiString.charCodeAt(i);
  }
  const asciiSlice = b.toString('ascii', 0, asciiString.length);
  assert.strictEqual(asciiString, asciiSlice);
}

{
  const asciiString = 'hello world';
  const offset = 100;

  assert.strictEqual(asciiString.length, b.write(asciiString, offset, 'ascii'));
  const asciiSlice = b.toString('ascii', offset, offset + asciiString.length);
  assert.strictEqual(asciiString, asciiSlice);
}

{
  const asciiString = 'hello world';
  const offset = 100;

  const sliceA = b.slice(offset, offset + asciiString.length);
  const sliceB = b.slice(offset, offset + asciiString.length);
  for (let i = 0; i < asciiString.length; i++) {
    assert.strictEqual(sliceA[i], sliceB[i]);
  }
}

// UTF-8 slice test
{
  const utf8String = '¡hέlló wôrld!';
  const offset = 100;

  b.write(utf8String, 0, Buffer.byteLength(utf8String), 'utf8');
  let utf8Slice = b.toString('utf8', 0, Buffer.byteLength(utf8String));
  assert.strictEqual(utf8String, utf8Slice);

  assert.strictEqual(Buffer.byteLength(utf8String),
                     b.write(utf8String, offset, 'utf8'));
  utf8Slice = b.toString('utf8', offset,
                         offset + Buffer.byteLength(utf8String));
  assert.strictEqual(utf8String, utf8Slice);

  const sliceA = b.slice(offset, offset + Buffer.byteLength(utf8String));
  const sliceB = b.slice(offset, offset + Buffer.byteLength(utf8String));
  for (let i = 0; i < Buffer.byteLength(utf8String); i++) {
    assert.strictEqual(sliceA[i], sliceB[i]);
  }
}

{
  const slice = b.slice(100, 150);
  assert.strictEqual(50, slice.length);
  for (let i = 0; i < 50; i++) {
    assert.strictEqual(b[100 + i], slice[i]);
  }
}

{
  // make sure only top level parent propagates from allocPool
  const b = Buffer.allocUnsafe(5);
  const c = b.slice(0, 4);
  const d = c.slice(0, 2);
  assert.strictEqual(b.parent, c.parent);
  assert.strictEqual(b.parent, d.parent);
}

{
  // also from a non-pooled instance
  const b = Buffer.allocUnsafeSlow(5);
  const c = b.slice(0, 4);
  const d = c.slice(0, 2);
  assert.strictEqual(c.parent, d.parent);
}

{
  // Bug regression test
  const testValue = '\u00F6\u65E5\u672C\u8A9E'; // ö日本語
  const buffer = Buffer.allocUnsafe(32);
  const size = buffer.write(testValue, 0, 'utf8');
  const slice = buffer.toString('utf8', 0, size);
  assert.strictEqual(slice, testValue);
}

{
  // Test triple  slice
  const a = Buffer.allocUnsafe(8);
  for (let i = 0; i < 8; i++) a[i] = i;
  const b = a.slice(4, 8);
  assert.strictEqual(4, b[0]);
  assert.strictEqual(5, b[1]);
  assert.strictEqual(6, b[2]);
  assert.strictEqual(7, b[3]);
  const c = b.slice(2, 4);
  assert.strictEqual(6, c[0]);
  assert.strictEqual(7, c[1]);
}

{
  const d = Buffer.from([23, 42, 255]);
  assert.strictEqual(d.length, 3);
  assert.strictEqual(d[0], 23);
  assert.strictEqual(d[1], 42);
  assert.strictEqual(d[2], 255);
  assert.deepStrictEqual(d, Buffer.from(d));
}

{
  // Test for proper UTF-8 Encoding
  const e = Buffer.from('über');
  assert.deepStrictEqual(e, Buffer.from([195, 188, 98, 101, 114]));
}

{
  // Test for proper ascii Encoding, length should be 4
  const f = Buffer.from('über', 'ascii');
  assert.deepStrictEqual(f, Buffer.from([252, 98, 101, 114]));
}

['ucs2', 'ucs-2', 'utf16le', 'utf-16le'].forEach((encoding) => {
  {
    // Test for proper UTF16LE encoding, length should be 8
    const f = Buffer.from('über', encoding);
    assert.deepStrictEqual(f, Buffer.from([252, 0, 98, 0, 101, 0, 114, 0]));
  }

  {
    // Length should be 12
    const f = Buffer.from('привет', encoding);
    assert.deepStrictEqual(
      f, Buffer.from([63, 4, 64, 4, 56, 4, 50, 4, 53, 4, 66, 4])
    );
    assert.strictEqual(f.toString(encoding), 'привет');
  }

  {
    const f = Buffer.from([0, 0, 0, 0, 0]);
    assert.strictEqual(f.length, 5);
    const size = f.write('あいうえお', encoding);
    assert.strictEqual(size, 4);
    assert.deepStrictEqual(f, Buffer.from([0x42, 0x30, 0x44, 0x30, 0x00]));
  }
});

{
  const f = Buffer.from('\uD83D\uDC4D', 'utf-16le'); // THUMBS UP SIGN (U+1F44D)
  assert.strictEqual(f.length, 4);
  assert.deepStrictEqual(f, Buffer.from('3DD84DDC', 'hex'));
}

// Test construction from arrayish object
{
  const arrayIsh = { 0: 0, 1: 1, 2: 2, 3: 3, length: 4 };
  let g = Buffer.from(arrayIsh);
  assert.deepStrictEqual(g, Buffer.from([0, 1, 2, 3]));
  const strArrayIsh = { 0: '0', 1: '1', 2: '2', 3: '3', length: 4 };
  g = Buffer.from(strArrayIsh);
  assert.deepStrictEqual(g, Buffer.from([0, 1, 2, 3]));
}

//
// Test toString('base64')
//
assert.strictEqual('TWFu', (Buffer.from('Man')).toString('base64'));

{
  // test that regular and URL-safe base64 both work
  const expected = [0xff, 0xff, 0xbe, 0xff, 0xef, 0xbf, 0xfb, 0xef, 0xff];
  assert.deepStrictEqual(Buffer.from('//++/++/++//', 'base64'),
                         Buffer.from(expected));
  assert.deepStrictEqual(Buffer.from('__--_--_--__', 'base64'),
                         Buffer.from(expected));
}

{
  // big example
  const quote = 'Man is distinguished, not only by his reason, but by this ' +
                'singular passion from other animals, which is a lust ' +
                'of the mind, that by a perseverance of delight in the ' +
                'continued and indefatigable generation of knowledge, ' +
                'exceeds the short vehemence of any carnal pleasure.';
  const expected = 'TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb' +
                   '24sIGJ1dCBieSB0aGlzIHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlci' +
                   'BhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQsIHRoYXQ' +
                   'gYnkgYSBwZXJzZXZlcmFuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGlu' +
                   'dWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYXRpb24gb2Yga25vd2xlZ' +
                   'GdlLCBleGNlZWRzIHRoZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm' +
                   '5hbCBwbGVhc3VyZS4=';
  assert.strictEqual(expected, (Buffer.from(quote)).toString('base64'));

  let b = Buffer.allocUnsafe(1024);
  let bytesWritten = b.write(expected, 0, 'base64');
  assert.strictEqual(quote.length, bytesWritten);
  assert.strictEqual(quote, b.toString('ascii', 0, quote.length));

  // check that the base64 decoder ignores whitespace
  const expectedWhite = `${expected.slice(0, 60)} \n` +
                        `${expected.slice(60, 120)} \n` +
                        `${expected.slice(120, 180)} \n` +
                        `${expected.slice(180, 240)} \n` +
                        `${expected.slice(240, 300)}\n` +
                        `${expected.slice(300, 360)}\n`;
  b = Buffer.allocUnsafe(1024);
  bytesWritten = b.write(expectedWhite, 0, 'base64');
  assert.strictEqual(quote.length, bytesWritten);
  assert.strictEqual(quote, b.toString('ascii', 0, quote.length));

  // check that the base64 decoder on the constructor works
  // even in the presence of whitespace.
  b = Buffer.from(expectedWhite, 'base64');
  assert.strictEqual(quote.length, b.length);
  assert.strictEqual(quote, b.toString('ascii', 0, quote.length));

  // check that the base64 decoder ignores illegal chars
  const expectedIllegal = expected.slice(0, 60) + ' \x80' +
                          expected.slice(60, 120) + ' \xff' +
                          expected.slice(120, 180) + ' \x00' +
                          expected.slice(180, 240) + ' \x98' +
                          expected.slice(240, 300) + '\x03' +
                          expected.slice(300, 360);
  b = Buffer.from(expectedIllegal, 'base64');
  assert.strictEqual(quote.length, b.length);
  assert.strictEqual(quote, b.toString('ascii', 0, quote.length));
}

assert.strictEqual(Buffer.from('', 'base64').toString(), '');
assert.strictEqual(Buffer.from('K', 'base64').toString(), '');

// multiple-of-4 with padding
assert.strictEqual(Buffer.from('Kg==', 'base64').toString(), '*');
assert.strictEqual(Buffer.from('Kio=', 'base64').toString(), '*'.repeat(2));
assert.strictEqual(Buffer.from('Kioq', 'base64').toString(), '*'.repeat(3));
assert.strictEqual(Buffer.from('KioqKg==', 'base64').toString(), '*'.repeat(4));
assert.strictEqual(Buffer.from('KioqKio=', 'base64').toString(), '*'.repeat(5));
assert.strictEqual(Buffer.from('KioqKioq', 'base64').toString(), '*'.repeat(6));
assert.strictEqual(Buffer.from('KioqKioqKg==', 'base64').toString(),
                   '*'.repeat(7));
assert.strictEqual(Buffer.from('KioqKioqKio=', 'base64').toString(),
                   '*'.repeat(8));
assert.strictEqual(Buffer.from('KioqKioqKioq', 'base64').toString(),
                   '*'.repeat(9));
assert.strictEqual(Buffer.from('KioqKioqKioqKg==', 'base64').toString(),
                   '*'.repeat(10));
assert.strictEqual(Buffer.from('KioqKioqKioqKio=', 'base64').toString(),
                   '*'.repeat(11));
assert.strictEqual(Buffer.from('KioqKioqKioqKioq', 'base64').toString(),
                   '*'.repeat(12));
assert.strictEqual(Buffer.from('KioqKioqKioqKioqKg==', 'base64').toString(),
                   '*'.repeat(13));
assert.strictEqual(Buffer.from('KioqKioqKioqKioqKio=', 'base64').toString(),
                   '*'.repeat(14));
assert.strictEqual(Buffer.from('KioqKioqKioqKioqKioq', 'base64').toString(),
                   '*'.repeat(15));
assert.strictEqual(Buffer.from('KioqKioqKioqKioqKioqKg==', 'base64').toString(),
                   '*'.repeat(16));
assert.strictEqual(Buffer.from('KioqKioqKioqKioqKioqKio=', 'base64').toString(),
                   '*'.repeat(17));
assert.strictEqual(Buffer.from('KioqKioqKioqKioqKioqKioq', 'base64').toString(),
                   '*'.repeat(18));
assert.strictEqual(Buffer.from('KioqKioqKioqKioqKioqKioqKg==',
                               'base64').toString(),
                   '*'.repeat(19));
assert.strictEqual(Buffer.from('KioqKioqKioqKioqKioqKioqKio=',
                               'base64').toString(),
                   '*'.repeat(20));

// no padding, not a multiple of 4
assert.strictEqual(Buffer.from('Kg', 'base64').toString(), '*');
assert.strictEqual(Buffer.from('Kio', 'base64').toString(), '*'.repeat(2));
assert.strictEqual(Buffer.from('KioqKg', 'base64').toString(), '*'.repeat(4));
assert.strictEqual(Buffer.from('KioqKio', 'base64').toString(), '*'.repeat(5));
assert.strictEqual(Buffer.from('KioqKioqKg', 'base64').toString(),
                   '*'.repeat(7));
assert.strictEqual(Buffer.from('KioqKioqKio', 'base64').toString(),
                   '*'.repeat(8));
assert.strictEqual(Buffer.from('KioqKioqKioqKg', 'base64').toString(),
                   '*'.repeat(10));
assert.strictEqual(Buffer.from('KioqKioqKioqKio', 'base64').toString(),
                   '*'.repeat(11));
assert.strictEqual(Buffer.from('KioqKioqKioqKioqKg', 'base64').toString(),
                   '*'.repeat(13));
assert.strictEqual(Buffer.from('KioqKioqKioqKioqKio', 'base64').toString(),
                   '*'.repeat(14));
assert.strictEqual(Buffer.from('KioqKioqKioqKioqKioqKg', 'base64').toString(),
                   '*'.repeat(16));
assert.strictEqual(Buffer.from('KioqKioqKioqKioqKioqKio', 'base64').toString(),
                   '*'.repeat(17));
assert.strictEqual(Buffer.from('KioqKioqKioqKioqKioqKioqKg',
                               'base64').toString(),
                   '*'.repeat(19));
assert.strictEqual(Buffer.from('KioqKioqKioqKioqKioqKioqKio',
                               'base64').toString(),
                   '*'.repeat(20));

// handle padding graciously, multiple-of-4 or not
assert.strictEqual(
  Buffer.from('72INjkR5fchcxk9+VgdGPFJDxUBFR5/rMFsghgxADiw==', 'base64').length,
  32
);
assert.strictEqual(
  Buffer.from('72INjkR5fchcxk9+VgdGPFJDxUBFR5/rMFsghgxADiw=', 'base64').length,
  32
);
assert.strictEqual(
  Buffer.from('72INjkR5fchcxk9+VgdGPFJDxUBFR5/rMFsghgxADiw', 'base64').length,
  32
);
assert.strictEqual(
  Buffer.from('w69jACy6BgZmaFvv96HG6MYksWytuZu3T1FvGnulPg==', 'base64').length,
  31
);
assert.strictEqual(
  Buffer.from('w69jACy6BgZmaFvv96HG6MYksWytuZu3T1FvGnulPg=', 'base64').length,
  31
);
assert.strictEqual(
  Buffer.from('w69jACy6BgZmaFvv96HG6MYksWytuZu3T1FvGnulPg', 'base64').length,
  31
);

{
// This string encodes single '.' character in UTF-16
  const dot = Buffer.from('//4uAA==', 'base64');
  assert.strictEqual(dot[0], 0xff);
  assert.strictEqual(dot[1], 0xfe);
  assert.strictEqual(dot[2], 0x2e);
  assert.strictEqual(dot[3], 0x00);
  assert.strictEqual(dot.toString('base64'), '//4uAA==');
}

{
  // Writing base64 at a position > 0 should not mangle the result.
  //
  // https://github.com/joyent/node/issues/402
  const segments = ['TWFkbmVzcz8h', 'IFRoaXM=', 'IGlz', 'IG5vZGUuanMh'];
  const b = Buffer.allocUnsafe(64);
  let pos = 0;

  for (let i = 0; i < segments.length; ++i) {
    pos += b.write(segments[i], pos, 'base64');
  }
  assert.strictEqual(b.toString('latin1', 0, pos),
                     'Madness?! This is node.js!');
}

// Regression test for https://github.com/nodejs/node/issues/3496.
assert.strictEqual(Buffer.from('=bad'.repeat(1e4), 'base64').length, 0);

// Regression test for https://github.com/nodejs/node/issues/11987.
assert.deepStrictEqual(Buffer.from('w0  ', 'base64'),
                       Buffer.from('w0', 'base64'));

// Regression test for https://github.com/nodejs/node/issues/13657.
assert.deepStrictEqual(Buffer.from(' YWJvcnVtLg', 'base64'),
                       Buffer.from('YWJvcnVtLg', 'base64'));

{
  // Creating buffers larger than pool size.
  const l = Buffer.poolSize + 5;
  const s = 'h'.repeat(l);
  const b = Buffer.from(s);

  for (let i = 0; i < l; i++) {
    assert.strictEqual('h'.charCodeAt(0), b[i]);
  }

  const sb = b.toString();
  assert.strictEqual(sb.length, s.length);
  assert.strictEqual(sb, s);
}

{
  // test hex toString
  const hexb = Buffer.allocUnsafe(256);
  for (let i = 0; i < 256; i++) {
    hexb[i] = i;
  }
  const hexStr = hexb.toString('hex');
  assert.strictEqual(hexStr,
                     '000102030405060708090a0b0c0d0e0f' +
                     '101112131415161718191a1b1c1d1e1f' +
                     '202122232425262728292a2b2c2d2e2f' +
                     '303132333435363738393a3b3c3d3e3f' +
                     '404142434445464748494a4b4c4d4e4f' +
                     '505152535455565758595a5b5c5d5e5f' +
                     '606162636465666768696a6b6c6d6e6f' +
                     '707172737475767778797a7b7c7d7e7f' +
                     '808182838485868788898a8b8c8d8e8f' +
                     '909192939495969798999a9b9c9d9e9f' +
                     'a0a1a2a3a4a5a6a7a8a9aaabacadaeaf' +
                     'b0b1b2b3b4b5b6b7b8b9babbbcbdbebf' +
                     'c0c1c2c3c4c5c6c7c8c9cacbcccdcecf' +
                     'd0d1d2d3d4d5d6d7d8d9dadbdcdddedf' +
                     'e0e1e2e3e4e5e6e7e8e9eaebecedeeef' +
                     'f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff');

  const hexb2 = Buffer.from(hexStr, 'hex');
  for (let i = 0; i < 256; i++) {
    assert.strictEqual(hexb2[i], hexb[i]);
  }
}

// Test single hex character is discarded.
assert.strictEqual(Buffer.from('A', 'hex').length, 0);

// Test that if a trailing character is discarded, rest of string is processed.
assert.deepStrictEqual(Buffer.from('Abx', 'hex'), Buffer.from('Ab', 'hex'));

// Test single base64 char encodes as 0.
assert.strictEqual(Buffer.from('A', 'base64').length, 0);


{
  // test an invalid slice end.
  const b = Buffer.from([1, 2, 3, 4, 5]);
  const b2 = b.toString('hex', 1, 10000);
  const b3 = b.toString('hex', 1, 5);
  const b4 = b.toString('hex', 1);
  assert.strictEqual(b2, b3);
  assert.strictEqual(b2, b4);
}

function buildBuffer(data) {
  if (Array.isArray(data)) {
    const buffer = Buffer.allocUnsafe(data.length);
    data.forEach((v, k) => buffer[k] = v);
    return buffer;
  }
  return null;
}

const x = buildBuffer([0x81, 0xa3, 0x66, 0x6f, 0x6f, 0xa3, 0x62, 0x61, 0x72]);

assert.strictEqual('<Buffer 81 a3 66 6f 6f a3 62 61 72>', x.inspect());

{
  const z = x.slice(4);
  assert.strictEqual(5, z.length);
  assert.strictEqual(0x6f, z[0]);
  assert.strictEqual(0xa3, z[1]);
  assert.strictEqual(0x62, z[2]);
  assert.strictEqual(0x61, z[3]);
  assert.strictEqual(0x72, z[4]);
}

{
  const z = x.slice(0);
  assert.strictEqual(z.length, x.length);
}

{
  const z = x.slice(0, 4);
  assert.strictEqual(4, z.length);
  assert.strictEqual(0x81, z[0]);
  assert.strictEqual(0xa3, z[1]);
}

{
  const z = x.slice(0, 9);
  assert.strictEqual(9, z.length);
}

{
  const z = x.slice(1, 4);
  assert.strictEqual(3, z.length);
  assert.strictEqual(0xa3, z[0]);
}

{
  const z = x.slice(2, 4);
  assert.strictEqual(2, z.length);
  assert.strictEqual(0x66, z[0]);
  assert.strictEqual(0x6f, z[1]);
}

['ucs2', 'ucs-2', 'utf16le', 'utf-16le'].forEach((encoding) => {
  const b = Buffer.allocUnsafe(10);
  b.write('あいうえお', encoding);
  assert.strictEqual(b.toString(encoding), 'あいうえお');
});

['ucs2', 'ucs-2', 'utf16le', 'utf-16le'].forEach((encoding) => {
  const b = Buffer.allocUnsafe(11);
  b.write('あいうえお', 1, encoding);
  assert.strictEqual(b.toString(encoding, 1), 'あいうえお');
});

{
  // latin1 encoding should write only one byte per character.
  const b = Buffer.from([0xde, 0xad, 0xbe, 0xef]);
  let s = String.fromCharCode(0xffff);
  b.write(s, 0, 'latin1');
  assert.strictEqual(0xff, b[0]);
  assert.strictEqual(0xad, b[1]);
  assert.strictEqual(0xbe, b[2]);
  assert.strictEqual(0xef, b[3]);
  s = String.fromCharCode(0xaaee);
  b.write(s, 0, 'latin1');
  assert.strictEqual(0xee, b[0]);
  assert.strictEqual(0xad, b[1]);
  assert.strictEqual(0xbe, b[2]);
  assert.strictEqual(0xef, b[3]);
}

{
  // Binary encoding should write only one byte per character.
  const b = Buffer.from([0xde, 0xad, 0xbe, 0xef]);
  let s = String.fromCharCode(0xffff);
  b.write(s, 0, 'latin1');
  assert.strictEqual(0xff, b[0]);
  assert.strictEqual(0xad, b[1]);
  assert.strictEqual(0xbe, b[2]);
  assert.strictEqual(0xef, b[3]);
  s = String.fromCharCode(0xaaee);
  b.write(s, 0, 'latin1');
  assert.strictEqual(0xee, b[0]);
  assert.strictEqual(0xad, b[1]);
  assert.strictEqual(0xbe, b[2]);
  assert.strictEqual(0xef, b[3]);
}

{
  // https://github.com/nodejs/node-v0.x-archive/pull/1210
  // Test UTF-8 string includes null character
  let buf = Buffer.from('\0');
  assert.strictEqual(buf.length, 1);
  buf = Buffer.from('\0\0');
  assert.strictEqual(buf.length, 2);
}

{
  const buf = Buffer.allocUnsafe(2);
  assert.strictEqual(buf.write(''), 0); //0bytes
  assert.strictEqual(buf.write('\0'), 1); // 1byte (v8 adds null terminator)
  assert.strictEqual(buf.write('a\0'), 2); // 1byte * 2
  assert.strictEqual(buf.write('あ'), 0); // 3bytes
  assert.strictEqual(buf.write('\0あ'), 1); // 1byte + 3bytes
  assert.strictEqual(buf.write('\0\0あ'), 2); // 1byte * 2 + 3bytes
}

{
  const buf = Buffer.allocUnsafe(10);
  assert.strictEqual(buf.write('あいう'), 9); // 3bytes * 3 (v8 adds null term.)
  assert.strictEqual(buf.write('あいう\0'), 10); // 3bytes * 3 + 1byte
}

{
  // https://github.com/nodejs/node-v0.x-archive/issues/243
  // Test write() with maxLength
  const buf = Buffer.allocUnsafe(4);
  buf.fill(0xFF);
  assert.strictEqual(buf.write('abcd', 1, 2, 'utf8'), 2);
  assert.strictEqual(buf[0], 0xFF);
  assert.strictEqual(buf[1], 0x61);
  assert.strictEqual(buf[2], 0x62);
  assert.strictEqual(buf[3], 0xFF);

  buf.fill(0xFF);
  assert.strictEqual(buf.write('abcd', 1, 4), 3);
  assert.strictEqual(buf[0], 0xFF);
  assert.strictEqual(buf[1], 0x61);
  assert.strictEqual(buf[2], 0x62);
  assert.strictEqual(buf[3], 0x63);

  buf.fill(0xFF);
  assert.strictEqual(buf.write('abcd', 1, 2, 'utf8'), 2);
  assert.strictEqual(buf[0], 0xFF);
  assert.strictEqual(buf[1], 0x61);
  assert.strictEqual(buf[2], 0x62);
  assert.strictEqual(buf[3], 0xFF);

  buf.fill(0xFF);
  assert.strictEqual(buf.write('abcdef', 1, 2, 'hex'), 2);
  assert.strictEqual(buf[0], 0xFF);
  assert.strictEqual(buf[1], 0xAB);
  assert.strictEqual(buf[2], 0xCD);
  assert.strictEqual(buf[3], 0xFF);

  ['ucs2', 'ucs-2', 'utf16le', 'utf-16le'].forEach((encoding) => {
    buf.fill(0xFF);
    assert.strictEqual(buf.write('abcd', 0, 2, encoding), 2);
    assert.strictEqual(buf[0], 0x61);
    assert.strictEqual(buf[1], 0x00);
    assert.strictEqual(buf[2], 0xFF);
    assert.strictEqual(buf[3], 0xFF);
  });
}

{
  // test offset returns are correct
  const b = Buffer.allocUnsafe(16);
  assert.strictEqual(4, b.writeUInt32LE(0, 0));
  assert.strictEqual(6, b.writeUInt16LE(0, 4));
  assert.strictEqual(7, b.writeUInt8(0, 6));
  assert.strictEqual(8, b.writeInt8(0, 7));
  assert.strictEqual(16, b.writeDoubleLE(0, 8));
}

{
  // test unmatched surrogates not producing invalid utf8 output
  // ef bf bd = utf-8 representation of unicode replacement character
  // see https://codereview.chromium.org/121173009/
  const buf = Buffer.from('ab\ud800cd', 'utf8');
  assert.strictEqual(buf[0], 0x61);
  assert.strictEqual(buf[1], 0x62);
  assert.strictEqual(buf[2], 0xef);
  assert.strictEqual(buf[3], 0xbf);
  assert.strictEqual(buf[4], 0xbd);
  assert.strictEqual(buf[5], 0x63);
  assert.strictEqual(buf[6], 0x64);
}

{
  // test for buffer overrun
  const buf = Buffer.from([0, 0, 0, 0, 0]); // length: 5
  const sub = buf.slice(0, 4);         // length: 4
  assert.strictEqual(sub.write('12345', 'latin1'), 4);
  assert.strictEqual(buf[4], 0);
  assert.strictEqual(sub.write('12345', 'binary'), 4);
  assert.strictEqual(buf[4], 0);
}

{
  // test alloc with fill option
  const buf = Buffer.alloc(5, '800A', 'hex');
  assert.strictEqual(buf[0], 128);
  assert.strictEqual(buf[1], 10);
  assert.strictEqual(buf[2], 128);
  assert.strictEqual(buf[3], 10);
  assert.strictEqual(buf[4], 128);
}


// Check for fractional length args, junk length args, etc.
// https://github.com/joyent/node/issues/1758

// Call .fill() first, stops valgrind warning about uninitialized memory reads.
Buffer.allocUnsafe(3.3).fill().toString();
// throws bad argument error in commit 43cb4ec
Buffer.alloc(3.3).fill().toString();
assert.strictEqual(Buffer.allocUnsafe(NaN).length, 0);
assert.strictEqual(Buffer.allocUnsafe(3.3).length, 3);
assert.strictEqual(Buffer.from({ length: 3.3 }).length, 3);
assert.strictEqual(Buffer.from({ length: 'BAM' }).length, 0);

// Make sure that strings are not coerced to numbers.
assert.strictEqual(Buffer.from('99').length, 2);
assert.strictEqual(Buffer.from('13.37').length, 5);

// Ensure that the length argument is respected.
['ascii', 'utf8', 'hex', 'base64', 'latin1', 'binary'].forEach((enc) => {
  assert.strictEqual(Buffer.allocUnsafe(1).write('aaaaaa', 0, 1, enc), 1);
});

{
  // Regression test, guard against buffer overrun in the base64 decoder.
  const a = Buffer.allocUnsafe(3);
  const b = Buffer.from('xxx');
  a.write('aaaaaaaa', 'base64');
  assert.strictEqual(b.toString(), 'xxx');
}

// issue GH-3416
Buffer.from(Buffer.allocUnsafe(0), 0, 0);

// issue GH-5587
assert.throws(() => Buffer.alloc(8).writeFloatLE(0, 5), RangeError);
assert.throws(() => Buffer.alloc(16).writeDoubleLE(0, 9), RangeError);

// attempt to overflow buffers, similar to previous bug in array buffers
assert.throws(() => Buffer.allocUnsafe(8).writeFloatLE(0.0, 0xffffffff),
              RangeError);
assert.throws(() => Buffer.allocUnsafe(8).writeFloatLE(0.0, 0xffffffff),
              RangeError);


// ensure negative values can't get past offset
assert.throws(() => Buffer.allocUnsafe(8).writeFloatLE(0.0, -1), RangeError);
assert.throws(() => Buffer.allocUnsafe(8).writeFloatLE(0.0, -1), RangeError);


// test for common write(U)IntLE/BE
{
  let buf = Buffer.allocUnsafe(3);
  buf.writeUIntLE(0x123456, 0, 3);
  assert.deepStrictEqual(buf.toJSON().data, [0x56, 0x34, 0x12]);
  assert.strictEqual(buf.readUIntLE(0, 3), 0x123456);

  buf.fill(0xFF);
  buf.writeUIntBE(0x123456, 0, 3);
  assert.deepStrictEqual(buf.toJSON().data, [0x12, 0x34, 0x56]);
  assert.strictEqual(buf.readUIntBE(0, 3), 0x123456);

  buf.fill(0xFF);
  buf.writeIntLE(0x123456, 0, 3);
  assert.deepStrictEqual(buf.toJSON().data, [0x56, 0x34, 0x12]);
  assert.strictEqual(buf.readIntLE(0, 3), 0x123456);

  buf.fill(0xFF);
  buf.writeIntBE(0x123456, 0, 3);
  assert.deepStrictEqual(buf.toJSON().data, [0x12, 0x34, 0x56]);
  assert.strictEqual(buf.readIntBE(0, 3), 0x123456);

  buf.fill(0xFF);
  buf.writeIntLE(-0x123456, 0, 3);
  assert.deepStrictEqual(buf.toJSON().data, [0xaa, 0xcb, 0xed]);
  assert.strictEqual(buf.readIntLE(0, 3), -0x123456);

  buf.fill(0xFF);
  buf.writeIntBE(-0x123456, 0, 3);
  assert.deepStrictEqual(buf.toJSON().data, [0xed, 0xcb, 0xaa]);
  assert.strictEqual(buf.readIntBE(0, 3), -0x123456);

  buf.fill(0xFF);
  buf.writeIntLE(-0x123400, 0, 3);
  assert.deepStrictEqual(buf.toJSON().data, [0x00, 0xcc, 0xed]);
  assert.strictEqual(buf.readIntLE(0, 3), -0x123400);

  buf.fill(0xFF);
  buf.writeIntBE(-0x123400, 0, 3);
  assert.deepStrictEqual(buf.toJSON().data, [0xed, 0xcc, 0x00]);
  assert.strictEqual(buf.readIntBE(0, 3), -0x123400);

  buf.fill(0xFF);
  buf.writeIntLE(-0x120000, 0, 3);
  assert.deepStrictEqual(buf.toJSON().data, [0x00, 0x00, 0xee]);
  assert.strictEqual(buf.readIntLE(0, 3), -0x120000);

  buf.fill(0xFF);
  buf.writeIntBE(-0x120000, 0, 3);
  assert.deepStrictEqual(buf.toJSON().data, [0xee, 0x00, 0x00]);
  assert.strictEqual(buf.readIntBE(0, 3), -0x120000);

  buf = Buffer.allocUnsafe(5);
  buf.writeUIntLE(0x1234567890, 0, 5);
  assert.deepStrictEqual(buf.toJSON().data, [0x90, 0x78, 0x56, 0x34, 0x12]);
  assert.strictEqual(buf.readUIntLE(0, 5), 0x1234567890);

  buf.fill(0xFF);
  buf.writeUIntBE(0x1234567890, 0, 5);
  assert.deepStrictEqual(buf.toJSON().data, [0x12, 0x34, 0x56, 0x78, 0x90]);
  assert.strictEqual(buf.readUIntBE(0, 5), 0x1234567890);

  buf.fill(0xFF);
  buf.writeIntLE(0x1234567890, 0, 5);
  assert.deepStrictEqual(buf.toJSON().data, [0x90, 0x78, 0x56, 0x34, 0x12]);
  assert.strictEqual(buf.readIntLE(0, 5), 0x1234567890);

  buf.fill(0xFF);
  buf.writeIntBE(0x1234567890, 0, 5);
  assert.deepStrictEqual(buf.toJSON().data, [0x12, 0x34, 0x56, 0x78, 0x90]);
  assert.strictEqual(buf.readIntBE(0, 5), 0x1234567890);

  buf.fill(0xFF);
  buf.writeIntLE(-0x1234567890, 0, 5);
  assert.deepStrictEqual(buf.toJSON().data, [0x70, 0x87, 0xa9, 0xcb, 0xed]);
  assert.strictEqual(buf.readIntLE(0, 5), -0x1234567890);

  buf.fill(0xFF);
  buf.writeIntBE(-0x1234567890, 0, 5);
  assert.deepStrictEqual(buf.toJSON().data, [0xed, 0xcb, 0xa9, 0x87, 0x70]);
  assert.strictEqual(buf.readIntBE(0, 5), -0x1234567890);

  buf.fill(0xFF);
  buf.writeIntLE(-0x0012000000, 0, 5);
  assert.deepStrictEqual(buf.toJSON().data, [0x00, 0x00, 0x00, 0xee, 0xff]);
  assert.strictEqual(buf.readIntLE(0, 5), -0x0012000000);

  buf.fill(0xFF);
  buf.writeIntBE(-0x0012000000, 0, 5);
  assert.deepStrictEqual(buf.toJSON().data, [0xff, 0xee, 0x00, 0x00, 0x00]);
  assert.strictEqual(buf.readIntBE(0, 5), -0x0012000000);
}

// Regression test for https://github.com/nodejs/node-v0.x-archive/issues/5482:
// should throw but not assert in C++ land.
common.expectsError(
  () => Buffer.from('', 'buffer'),
  {
    code: 'ERR_UNKNOWN_ENCODING',
    type: TypeError,
    message: 'Unknown encoding: buffer'
  }
);

// Regression test for https://github.com/nodejs/node-v0.x-archive/issues/6111.
// Constructing a buffer from another buffer should a) work, and b) not corrupt
// the source buffer.
{
  const a = [...Array(128).keys()]; // [0, 1, 2, 3, ... 126, 127]
  const b = Buffer.from(a);
  const c = Buffer.from(b);
  assert.strictEqual(b.length, a.length);
  assert.strictEqual(c.length, a.length);
  for (let i = 0, k = a.length; i < k; ++i) {
    assert.strictEqual(a[i], i);
    assert.strictEqual(b[i], i);
    assert.strictEqual(c[i], i);
  }
}

if (common.hasCrypto) { // eslint-disable-line crypto-check
  // Test truncation after decode
  const crypto = require('crypto');

  const b1 = Buffer.from('YW55=======', 'base64');
  const b2 = Buffer.from('YW55', 'base64');

  assert.strictEqual(
    crypto.createHash('sha1').update(b1).digest('hex'),
    crypto.createHash('sha1').update(b2).digest('hex')
  );
} else {
  common.printSkipMessage('missing crypto');
}

const ps = Buffer.poolSize;
Buffer.poolSize = 0;
assert(Buffer.allocUnsafe(1).parent instanceof ArrayBuffer);
Buffer.poolSize = ps;

// Test Buffer.copy() segfault
assert.throws(() => Buffer.allocUnsafe(10).copy(),
              /TypeError: argument should be a Buffer/);

const regErrorMsg =
  new RegExp('The first argument must be one of type string, Buffer, ' +
             'ArrayBuffer, Array, or Array-like Object\\.');

assert.throws(() => Buffer.from(), regErrorMsg);
assert.throws(() => Buffer.from(null), regErrorMsg);

// Test prototype getters don't throw
assert.strictEqual(Buffer.prototype.parent, undefined);
assert.strictEqual(Buffer.prototype.offset, undefined);
assert.strictEqual(SlowBuffer.prototype.parent, undefined);
assert.strictEqual(SlowBuffer.prototype.offset, undefined);


{
  // Test that large negative Buffer length inputs don't affect the pool offset.
  // Use the fromArrayLike() variant here because it's more lenient
  // about its input and passes the length directly to allocate().
  assert.deepStrictEqual(Buffer.from({ length: -Buffer.poolSize }),
                         Buffer.from(''));
  assert.deepStrictEqual(Buffer.from({ length: -100 }),
                         Buffer.from(''));

  // Check pool offset after that by trying to write string into the pool.
  assert.doesNotThrow(() => Buffer.from('abc'));
}


// Test that ParseArrayIndex handles full uint32
{
  const errMsg = common.expectsError({
    code: 'ERR_BUFFER_OUT_OF_BOUNDS',
    type: RangeError,
    message: '"offset" is outside of buffer bounds'
  });
  assert.throws(() => Buffer.from(new ArrayBuffer(0), -1 >>> 0), errMsg);
}

// ParseArrayIndex() should reject values that don't fit in a 32 bits size_t.
common.expectsError(() => {
  const a = Buffer.alloc(1);
  const b = Buffer.alloc(1);
  a.copy(b, 0, 0x100000000, 0x100000001);
}, { code: undefined, type: RangeError, message: 'Index out of range' });

// Unpooled buffer (replaces SlowBuffer)
{
  const ubuf = Buffer.allocUnsafeSlow(10);
  assert(ubuf);
  assert(ubuf.buffer);
  assert.strictEqual(ubuf.buffer.byteLength, 10);
}

// Regression test
assert.doesNotThrow(() => Buffer.from(new ArrayBuffer()));

// Test that ArrayBuffer from a different context is detected correctly
const arrayBuf = vm.runInNewContext('new ArrayBuffer()');
assert.doesNotThrow(() => Buffer.from(arrayBuf));
assert.doesNotThrow(() => Buffer.from({ buffer: arrayBuf }));

assert.throws(() => Buffer.alloc({ valueOf: () => 1 }),
              /"size" argument must be of type number/);
assert.throws(() => Buffer.alloc({ valueOf: () => -1 }),
              /"size" argument must be of type number/);

assert.strictEqual(Buffer.prototype.toLocaleString, Buffer.prototype.toString);
{
  const buf = Buffer.from('test');
  assert.strictEqual(buf.toLocaleString(), buf.toString());
}

common.expectsError(() => {
  Buffer.alloc(0x1000, 'This is not correctly encoded', 'hex');
}, {
  code: 'ERR_INVALID_ARG_VALUE',
  type: TypeError
});

common.expectsError(() => {
  Buffer.alloc(0x1000, 'c', 'hex');
}, {
  code: 'ERR_INVALID_ARG_VALUE',
  type: TypeError
});

common.expectsError(() => {
  Buffer.alloc(1, Buffer.alloc(0));
}, {
  code: 'ERR_INVALID_ARG_VALUE',
  type: TypeError
});


```

---

### test-buffer-arraybuffer.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-arraybuffer.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;

const common = require('./common');
const assert = require('assert');

const LENGTH = 16;

const ab = new ArrayBuffer(LENGTH);
const dv = new DataView(ab);
const ui = new Uint8Array(ab);
const buf = Buffer.from(ab);


assert.ok(buf instanceof Buffer);
assert.strictEqual(buf.parent, buf.buffer);
assert.strictEqual(buf.buffer, ab);
assert.strictEqual(buf.length, ab.byteLength);


buf.fill(0xC);
for (let i = 0; i < LENGTH; i++) {
  assert.strictEqual(ui[i], 0xC);
  ui[i] = 0xF;
  assert.strictEqual(buf[i], 0xF);
}

buf.writeUInt32LE(0xF00, 0);
buf.writeUInt32BE(0xB47, 4);
buf.writeDoubleLE(3.1415, 8);

assert.strictEqual(dv.getUint32(0, true), 0xF00);
assert.strictEqual(dv.getUint32(4), 0xB47);
assert.strictEqual(dv.getFloat64(8, true), 3.1415);


// Now test protecting users from doing stupid things

assert.throws(function() {
  function AB() { }
  Object.setPrototypeOf(AB, ArrayBuffer);
  Object.setPrototypeOf(AB.prototype, ArrayBuffer.prototype);
  Buffer.from(new AB());
}, TypeError);

// write{Double,Float}{LE,BE} with noAssert should not crash, cf. #3766
const b = Buffer.allocUnsafe(1);
b.writeFloatLE(11.11, 0, true);
b.writeFloatBE(11.11, 0, true);
b.writeDoubleLE(11.11, 0, true);
b.writeDoubleBE(11.11, 0, true);

// Test the byteOffset and length arguments
{
  const ab = new Uint8Array(5);
  ab[0] = 1;
  ab[1] = 2;
  ab[2] = 3;
  ab[3] = 4;
  ab[4] = 5;
  const buf = Buffer.from(ab.buffer, 1, 3);
  assert.strictEqual(buf.length, 3);
  assert.strictEqual(buf[0], 2);
  assert.strictEqual(buf[1], 3);
  assert.strictEqual(buf[2], 4);
  buf[0] = 9;
  assert.strictEqual(ab[1], 9);

  common.expectsError(() => Buffer.from(ab.buffer, 6), {
    code: 'ERR_BUFFER_OUT_OF_BOUNDS',
    type: RangeError,
    message: '"offset" is outside of buffer bounds'
  });
  common.expectsError(() => Buffer.from(ab.buffer, 3, 6), {
    code: 'ERR_BUFFER_OUT_OF_BOUNDS',
    type: RangeError,
    message: '"length" is outside of buffer bounds'
  });
}

// Test the deprecated Buffer() version also
{
  const ab = new Uint8Array(5);
  ab[0] = 1;
  ab[1] = 2;
  ab[2] = 3;
  ab[3] = 4;
  ab[4] = 5;
  const buf = Buffer(ab.buffer, 1, 3);
  assert.strictEqual(buf.length, 3);
  assert.strictEqual(buf[0], 2);
  assert.strictEqual(buf[1], 3);
  assert.strictEqual(buf[2], 4);
  buf[0] = 9;
  assert.strictEqual(ab[1], 9);

  common.expectsError(() => Buffer(ab.buffer, 6), {
    code: 'ERR_BUFFER_OUT_OF_BOUNDS',
    type: RangeError,
    message: '"offset" is outside of buffer bounds'
  });
  common.expectsError(() => Buffer(ab.buffer, 3, 6), {
    code: 'ERR_BUFFER_OUT_OF_BOUNDS',
    type: RangeError,
    message: '"length" is outside of buffer bounds'
  });
}

{
  // If byteOffset is not numeric, it defaults to 0.
  const ab = new ArrayBuffer(10);
  const expected = Buffer.from(ab, 0);
  assert.deepStrictEqual(Buffer.from(ab, 'fhqwhgads'), expected);
  assert.deepStrictEqual(Buffer.from(ab, NaN), expected);
  assert.deepStrictEqual(Buffer.from(ab, {}), expected);
  assert.deepStrictEqual(Buffer.from(ab, []), expected);

  // If byteOffset can be converted to a number, it will be.
  assert.deepStrictEqual(Buffer.from(ab, [1]), Buffer.from(ab, 1));

  // If byteOffset is Infinity, throw.
  common.expectsError(() => {
    Buffer.from(ab, Infinity);
  }, {
    code: 'ERR_BUFFER_OUT_OF_BOUNDS',
    type: RangeError,
    message: '"offset" is outside of buffer bounds'
  });
}

{
  // If length is not numeric, it defaults to 0.
  const ab = new ArrayBuffer(10);
  const expected = Buffer.from(ab, 0, 0);
  assert.deepStrictEqual(Buffer.from(ab, 0, 'fhqwhgads'), expected);
  assert.deepStrictEqual(Buffer.from(ab, 0, NaN), expected);
  assert.deepStrictEqual(Buffer.from(ab, 0, {}), expected);
  assert.deepStrictEqual(Buffer.from(ab, 0, []), expected);

  // If length can be converted to a number, it will be.
  assert.deepStrictEqual(Buffer.from(ab, 0, [1]), Buffer.from(ab, 0, 1));

  //If length is Infinity, throw.
  common.expectsError(() => {
    Buffer.from(ab, 0, Infinity);
  }, {
    code: 'ERR_BUFFER_OUT_OF_BOUNDS',
    type: RangeError,
    message: '"length" is outside of buffer bounds'
  });
}


```

---

### test-buffer-ascii.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-ascii.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
// Copyright Joyent, Inc. and other Node contributors.var Buffer = require('../../').Buffer;
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';
require('./common');
const assert = require('assert');

// ASCII conversion in node.js simply masks off the high bits,
// it doesn't do transliteration.
assert.strictEqual(Buffer.from('hérité').toString('ascii'), 'hC)ritC)');

// 71 characters, 78 bytes. The ’ character is a triple-byte sequence.
const input = 'C’est, graphiquement, la réunion d’un accent aigu ' +
              'et d’un accent grave.';

const expected = 'Cb\u0000\u0019est, graphiquement, la rC)union ' +
                 'db\u0000\u0019un accent aigu et db\u0000\u0019un ' +
                 'accent grave.';

const buf = Buffer.from(input);

for (let i = 0; i < expected.length; ++i) {
  assert.strictEqual(buf.slice(i).toString('ascii'), expected.slice(i));

  // Skip remainder of multi-byte sequence.
  if (input.charCodeAt(i) > 65535) ++i;
  if (input.charCodeAt(i) > 127) ++i;
}


```

---

### test-buffer-bad-overload.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-bad-overload.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;
const common = require('./common');
const assert = require('assert');

assert.doesNotThrow(function() {
  Buffer.allocUnsafe(10);
});

const err = common.expectsError({
  code: 'ERR_INVALID_ARG_TYPE',
  type: TypeError,
  message: 'The "value" argument must not be of type number. ' +
           'Received type number'
});
assert.throws(function() {
  Buffer.from(10, 'hex');
}, err);

assert.doesNotThrow(function() {
  Buffer.from('deadbeaf', 'hex');
});


```

---

### test-buffer-badhex.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-badhex.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;
require('./common');
const assert = require('assert');

// Test hex strings and bad hex strings
{
  const buf = Buffer.alloc(4);
  assert.strictEqual(buf.length, 4);
  assert.deepStrictEqual(buf, new Buffer([0, 0, 0, 0]));
  assert.strictEqual(buf.write('abcdxx', 0, 'hex'), 2);
  assert.deepStrictEqual(buf, new Buffer([0xab, 0xcd, 0x00, 0x00]));
  assert.strictEqual(buf.toString('hex'), 'abcd0000');
  assert.strictEqual(buf.write('abcdef01', 0, 'hex'), 4);
  assert.deepStrictEqual(buf, new Buffer([0xab, 0xcd, 0xef, 0x01]));
  assert.strictEqual(buf.toString('hex'), 'abcdef01');

  const copy = Buffer.from(buf.toString('hex'), 'hex');
  assert.strictEqual(buf.toString('hex'), copy.toString('hex'));
}

{
  const buf = Buffer.alloc(5);
  assert.strictEqual(buf.write('abcdxx', 1, 'hex'), 2);
  assert.strictEqual(buf.toString('hex'), '00abcd0000');
}

{
  const buf = Buffer.alloc(4);
  assert.deepStrictEqual(buf, new Buffer([0, 0, 0, 0]));
  assert.strictEqual(buf.write('xxabcd', 0, 'hex'), 0);
  assert.deepStrictEqual(buf, new Buffer([0, 0, 0, 0]));
  assert.strictEqual(buf.write('xxab', 1, 'hex'), 0);
  assert.deepStrictEqual(buf, new Buffer([0, 0, 0, 0]));
  assert.strictEqual(buf.write('cdxxab', 0, 'hex'), 1);
  assert.deepStrictEqual(buf, new Buffer([0xcd, 0, 0, 0]));
}

{
  const buf = Buffer.alloc(256);
  for (let i = 0; i < 256; i++)
    buf[i] = i;

  const hex = buf.toString('hex');
  assert.deepStrictEqual(Buffer.from(hex, 'hex'), buf);

  const badHex = `${hex.slice(0, 256)}xx${hex.slice(256, 510)}`;
  assert.deepStrictEqual(Buffer.from(badHex, 'hex'), buf.slice(0, 128));
}


```

---

### test-buffer-bytelength.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-bytelength.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;

const common = require('./common');
const assert = require('assert');
const SlowBuffer = require('../../').SlowBuffer;
const vm = require('vm');

[
  [32, 'latin1'],
  [NaN, 'utf8'],
  [{}, 'latin1'],
  []
].forEach((args) => {
  common.expectsError(
    () => Buffer.byteLength(...args),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      type: TypeError,
      message: 'The "string" argument must be one of type string, ' +
               `Buffer, or ArrayBuffer. Received type ${typeof args[0]}`
    }
  );
});

assert.strictEqual(Buffer.byteLength('', undefined, true), -1);

assert(ArrayBuffer.isView(new Buffer(10)));
assert(ArrayBuffer.isView(new SlowBuffer(10)));
assert(ArrayBuffer.isView(Buffer.alloc(10)));
assert(ArrayBuffer.isView(Buffer.allocUnsafe(10)));
assert(ArrayBuffer.isView(Buffer.allocUnsafeSlow(10)));
assert(ArrayBuffer.isView(Buffer.from('')));

// buffer
const incomplete = Buffer.from([0xe4, 0xb8, 0xad, 0xe6, 0x96]);
assert.strictEqual(Buffer.byteLength(incomplete), 5);
const ascii = Buffer.from('abc');
assert.strictEqual(Buffer.byteLength(ascii), 3);

// ArrayBuffer
const buffer = new ArrayBuffer(8);
assert.strictEqual(Buffer.byteLength(buffer), 8);

// TypedArray
const int8 = new Int8Array(8);
assert.strictEqual(Buffer.byteLength(int8), 8);
const uint8 = new Uint8Array(8);
assert.strictEqual(Buffer.byteLength(uint8), 8);
const uintc8 = new Uint8ClampedArray(2);
assert.strictEqual(Buffer.byteLength(uintc8), 2);
const int16 = new Int16Array(8);
assert.strictEqual(Buffer.byteLength(int16), 16);
const uint16 = new Uint16Array(8);
assert.strictEqual(Buffer.byteLength(uint16), 16);
const int32 = new Int32Array(8);
assert.strictEqual(Buffer.byteLength(int32), 32);
const uint32 = new Uint32Array(8);
assert.strictEqual(Buffer.byteLength(uint32), 32);
const float32 = new Float32Array(8);
assert.strictEqual(Buffer.byteLength(float32), 32);
const float64 = new Float64Array(8);
assert.strictEqual(Buffer.byteLength(float64), 64);

// DataView
const dv = new DataView(new ArrayBuffer(2));
assert.strictEqual(Buffer.byteLength(dv), 2);

// special case: zero length string
assert.strictEqual(Buffer.byteLength('', 'ascii'), 0);
assert.strictEqual(Buffer.byteLength('', 'HeX'), 0);

// utf8
assert.strictEqual(Buffer.byteLength('∑éllö wørl∂!', 'utf-8'), 19);
assert.strictEqual(Buffer.byteLength('κλμνξο', 'utf8'), 12);
assert.strictEqual(Buffer.byteLength('挵挶挷挸挹', 'utf-8'), 15);
assert.strictEqual(Buffer.byteLength('𠝹𠱓𠱸', 'UTF8'), 12);
// without an encoding, utf8 should be assumed
assert.strictEqual(Buffer.byteLength('hey there'), 9);
assert.strictEqual(Buffer.byteLength('𠱸挶νξ#xx :)'), 17);
assert.strictEqual(Buffer.byteLength('hello world', ''), 11);
// it should also be assumed with unrecognized encoding
assert.strictEqual(Buffer.byteLength('hello world', 'abc'), 11);
assert.strictEqual(Buffer.byteLength('ßœ∑≈', 'unkn0wn enc0ding'), 10);

// base64
assert.strictEqual(Buffer.byteLength('aGVsbG8gd29ybGQ=', 'base64'), 11);
assert.strictEqual(Buffer.byteLength('aGVsbG8gd29ybGQ=', 'BASE64'), 11);
assert.strictEqual(Buffer.byteLength('bm9kZS5qcyByb2NrcyE=', 'base64'), 14);
assert.strictEqual(Buffer.byteLength('aGkk', 'base64'), 3);
assert.strictEqual(
  Buffer.byteLength('bHNrZGZsa3NqZmtsc2xrZmFqc2RsZmtqcw==', 'base64'), 25
);
// special padding
assert.strictEqual(Buffer.byteLength('aaa=', 'base64'), 2);
assert.strictEqual(Buffer.byteLength('aaaa==', 'base64'), 3);

assert.strictEqual(Buffer.byteLength('Il était tué'), 14);
assert.strictEqual(Buffer.byteLength('Il était tué', 'utf8'), 14);

['ascii', 'latin1', 'binary']
  .reduce((es, e) => es.concat(e, e.toUpperCase()), [])
  .forEach((encoding) => {
    assert.strictEqual(Buffer.byteLength('Il était tué', encoding), 12);
  });

['ucs2', 'ucs-2', 'utf16le', 'utf-16le']
  .reduce((es, e) => es.concat(e, e.toUpperCase()), [])
  .forEach((encoding) => {
    assert.strictEqual(Buffer.byteLength('Il était tué', encoding), 24);
  });

// Test that ArrayBuffer from a different context is detected correctly
const arrayBuf = vm.runInNewContext('new ArrayBuffer()');
assert.strictEqual(Buffer.byteLength(arrayBuf), 0);

// Verify that invalid encodings are treated as utf8
for (let i = 1; i < 10; i++) {
  const encoding = String(i).repeat(i);

  assert.ok(!Buffer.isEncoding(encoding));
  assert.strictEqual(Buffer.byteLength('foo', encoding),
                     Buffer.byteLength('foo', 'utf8'));
}


```

---

### test-buffer-compare-offset.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-compare-offset.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;

const common = require('./common');
const assert = require('assert');

const a = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
const b = Buffer.from([5, 6, 7, 8, 9, 0, 1, 2, 3, 4]);

assert.strictEqual(-1, a.compare(b));

// Equivalent to a.compare(b).
assert.strictEqual(-1, a.compare(b, 0));
assert.strictEqual(-1, a.compare(b, '0'));
assert.strictEqual(-1, a.compare(b, undefined));

// Equivalent to a.compare(b).
assert.strictEqual(-1, a.compare(b, 0, undefined, 0));

// Zero-length target, return 1
assert.strictEqual(1, a.compare(b, 0, 0, 0));
assert.strictEqual(1, a.compare(b, '0', '0', '0'));

// Equivalent to Buffer.compare(a, b.slice(6, 10))
assert.strictEqual(1, a.compare(b, 6, 10));

// Zero-length source, return -1
assert.strictEqual(-1, a.compare(b, 6, 10, 0, 0));

// Zero-length source and target, return 0
assert.strictEqual(0, a.compare(b, 0, 0, 0, 0));
assert.strictEqual(0, a.compare(b, 1, 1, 2, 2));

// Equivalent to Buffer.compare(a.slice(4), b.slice(0, 5))
assert.strictEqual(1, a.compare(b, 0, 5, 4));

// Equivalent to Buffer.compare(a.slice(1), b.slice(5))
assert.strictEqual(1, a.compare(b, 5, undefined, 1));

// Equivalent to Buffer.compare(a.slice(2), b.slice(2, 4))
assert.strictEqual(-1, a.compare(b, 2, 4, 2));

// Equivalent to Buffer.compare(a.slice(4), b.slice(0, 7))
assert.strictEqual(-1, a.compare(b, 0, 7, 4));

// Equivalent to Buffer.compare(a.slice(4, 6), b.slice(0, 7));
assert.strictEqual(-1, a.compare(b, 0, 7, 4, 6));

// zero length target
assert.strictEqual(1, a.compare(b, 0, null));

// coerces to targetEnd == 5
assert.strictEqual(-1, a.compare(b, 0, { valueOf: () => 5 }));

// zero length target
assert.strictEqual(1, a.compare(b, Infinity, -Infinity));

// zero length target because default for targetEnd <= targetSource
assert.strictEqual(1, a.compare(b, '0xff'));

const oor = common.expectsError({ code: 'ERR_INDEX_OUT_OF_RANGE' }, 7);

assert.throws(() => a.compare(b, 0, 100, 0), oor);
assert.throws(() => a.compare(b, 0, 1, 0, 100), oor);
assert.throws(() => a.compare(b, -1), oor);
assert.throws(() => a.compare(b, 0, '0xff'), oor);
assert.throws(() => a.compare(b, 0, Infinity), oor);
assert.throws(() => a.compare(b, 0, 1, -1), oor);
assert.throws(() => a.compare(b, -Infinity, Infinity), oor);
common.expectsError(() => a.compare(), {
  code: 'ERR_INVALID_ARG_TYPE',
  type: TypeError,
  message: 'The "target" argument must be one of ' +
           'type Buffer or Uint8Array. Received type undefined'
});


```

---

### test-buffer-compare.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-compare.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;

const common = require('./common');
const assert = require('assert');

const b = Buffer.alloc(1, 'a');
const c = Buffer.alloc(1, 'c');
const d = Buffer.alloc(2, 'aa');
const e = new Uint8Array([ 0x61, 0x61 ]); // ASCII 'aa', same as d

assert.strictEqual(b.compare(c), -1);
assert.strictEqual(c.compare(d), 1);
assert.strictEqual(d.compare(b), 1);
assert.strictEqual(d.compare(e), 0);
assert.strictEqual(b.compare(d), -1);
assert.strictEqual(b.compare(b), 0);

assert.strictEqual(Buffer.compare(b, c), -1);
assert.strictEqual(Buffer.compare(c, d), 1);
assert.strictEqual(Buffer.compare(d, b), 1);
assert.strictEqual(Buffer.compare(b, d), -1);
assert.strictEqual(Buffer.compare(c, c), 0);
assert.strictEqual(Buffer.compare(e, e), 0);
assert.strictEqual(Buffer.compare(d, e), 0);
assert.strictEqual(Buffer.compare(d, b), 1);

assert.strictEqual(Buffer.compare(Buffer.alloc(0), Buffer.alloc(0)), 0);
assert.strictEqual(Buffer.compare(Buffer.alloc(0), Buffer.alloc(1)), -1);
assert.strictEqual(Buffer.compare(Buffer.alloc(1), Buffer.alloc(0)), 1);

const errMsg = common.expectsError({
  code: 'ERR_INVALID_ARG_TYPE',
  type: TypeError,
  message: 'The "buf1", "buf2" arguments must be one of ' +
             'type Buffer or Uint8Array'
}, 2);
assert.throws(() => Buffer.compare(Buffer.alloc(1), 'abc'), errMsg);

assert.throws(() => Buffer.compare('abc', Buffer.alloc(1)), errMsg);

common.expectsError(() => Buffer.alloc(1).compare('abc'), {
  code: 'ERR_INVALID_ARG_TYPE',
  type: TypeError,
  message: 'The "target" argument must be one of ' +
           'type Buffer or Uint8Array. Received type string'
});


```

---

### test-buffer-concat.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-concat.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;


var assert = require('assert');

var zero = [];
var one = [ Buffer.from('asdf') ];
var long = [];
for (var i = 0; i < 10; i++) long.push(Buffer.from('asdf'));

var flatZero = Buffer.concat(zero);
var flatOne = Buffer.concat(one);
var flatLong = Buffer.concat(long);
var flatLongLen = Buffer.concat(long, 40);

assert(flatZero.length === 0);
assert(flatOne.toString() === 'asdf');
// A special case where concat used to return the first item,
// if the length is one. This check is to make sure that we don't do that.
assert(flatOne !== one[0]);
assert(flatLong.toString() === (new Array(10 + 1).join('asdf')));
assert(flatLongLen.toString() === (new Array(10 + 1).join('asdf')));

assertWrongList();
assertWrongList(null);
assertWrongList(Buffer.from('hello'));
assertWrongList([42]);
assertWrongList(['hello', 'world']);
assertWrongList(['hello', Buffer.from('world')]);

function assertWrongList(value) {
  assert.throws(function() {
    Buffer.concat(value);
  }, function(err) {
    return err instanceof TypeError &&
           err.message === '"list" argument must be an Array of Buffers';
  });
}


```

---

### test-buffer-failed-alloc-typed-arrays.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-failed-alloc-typed-arrays.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;

require('./common');
const assert = require('assert');
const SlowBuffer = require('../../').SlowBuffer;

// Test failed or zero-sized Buffer allocations not affecting typed arrays.
// This test exists because of a regression that occurred. Because Buffer
// instances are allocated with the same underlying allocator as TypedArrays,
// but Buffer's can optional be non-zero filled, there was a regression that
// occurred when a Buffer allocated failed, the internal flag specifying
// whether or not to zero-fill was not being reset, causing TypedArrays to
// allocate incorrectly.
const zeroArray = new Uint32Array(10).fill(0);
const sizes = [1e10, 0, 0.1, -1, 'a', undefined, null, NaN];
const allocators = [
  Buffer,
  SlowBuffer,
  Buffer.alloc,
  Buffer.allocUnsafe,
  Buffer.allocUnsafeSlow
];
for (const allocator of allocators) {
  for (const size of sizes) {
    try {
      // These allocations are known to fail. If they do,
      // Uint32Array should still produce a zeroed out result.
      allocator(size);
    } catch (e) {
      assert.deepStrictEqual(new Uint32Array(10), zeroArray);
    }
  }
}


```

---

### test-buffer-fill.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-fill.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;
const common = require('./common');


var assert = require('assert');
var os = require('os');
var SIZE = 28;

var buf1 = Buffer.allocUnsafe(SIZE);
var buf2 = Buffer.allocUnsafe(SIZE);


// Default encoding
testBufs('abc');
testBufs('\u0222aa');
testBufs('a\u0234b\u0235c\u0236');
testBufs('abc', 4);
testBufs('abc', 5);
testBufs('abc', SIZE);
testBufs('\u0222aa', 2);
testBufs('\u0222aa', 8);
testBufs('a\u0234b\u0235c\u0236', 4);
testBufs('a\u0234b\u0235c\u0236', 12);
testBufs('abc', 4, -1);
testBufs('abc', 4, 1);
testBufs('abc', 5, 1);
testBufs('\u0222aa', 2, -1);
testBufs('\u0222aa', 8, 1);
testBufs('a\u0234b\u0235c\u0236', 4, -1);
testBufs('a\u0234b\u0235c\u0236', 4, 1);
testBufs('a\u0234b\u0235c\u0236', 12, 1);


// UTF8
testBufs('abc', 'utf8');
testBufs('\u0222aa', 'utf8');
testBufs('a\u0234b\u0235c\u0236', 'utf8');
testBufs('abc', 4, 'utf8');
testBufs('abc', 5, 'utf8');
testBufs('abc', SIZE, 'utf8');
testBufs('\u0222aa', 2, 'utf8');
testBufs('\u0222aa', 8, 'utf8');
testBufs('a\u0234b\u0235c\u0236', 4, 'utf8');
testBufs('a\u0234b\u0235c\u0236', 12, 'utf8');
testBufs('abc', 4, -1, 'utf8');
testBufs('abc', 4, 1, 'utf8');
testBufs('abc', 5, 1, 'utf8');
testBufs('\u0222aa', 2, -1, 'utf8');
testBufs('\u0222aa', 8, 1, 'utf8');
testBufs('a\u0234b\u0235c\u0236', 4, -1, 'utf8');
testBufs('a\u0234b\u0235c\u0236', 4, 1, 'utf8');
testBufs('a\u0234b\u0235c\u0236', 12, 1, 'utf8');
assert.equal(Buffer.allocUnsafe(1).fill(0).fill('\u0222')[0], 0xc8);


// BINARY
testBufs('abc', 'binary');
testBufs('\u0222aa', 'binary');
testBufs('a\u0234b\u0235c\u0236', 'binary');
testBufs('abc', 4, 'binary');
testBufs('abc', 5, 'binary');
testBufs('abc', SIZE, 'binary');
testBufs('\u0222aa', 2, 'binary');
testBufs('\u0222aa', 8, 'binary');
testBufs('a\u0234b\u0235c\u0236', 4, 'binary');
testBufs('a\u0234b\u0235c\u0236', 12, 'binary');
testBufs('abc', 4, -1, 'binary');
testBufs('abc', 4, 1, 'binary');
testBufs('abc', 5, 1, 'binary');
testBufs('\u0222aa', 2, -1, 'binary');
testBufs('\u0222aa', 8, 1, 'binary');
testBufs('a\u0234b\u0235c\u0236', 4, -1, 'binary');
testBufs('a\u0234b\u0235c\u0236', 4, 1, 'binary');
testBufs('a\u0234b\u0235c\u0236', 12, 1, 'binary');


// LATIN1
testBufs('abc', 'latin1');
testBufs('\u0222aa', 'latin1');
testBufs('a\u0234b\u0235c\u0236', 'latin1');
testBufs('abc', 4, 'latin1');
testBufs('abc', 5, 'latin1');
testBufs('abc', SIZE, 'latin1');
testBufs('\u0222aa', 2, 'latin1');
testBufs('\u0222aa', 8, 'latin1');
testBufs('a\u0234b\u0235c\u0236', 4, 'latin1');
testBufs('a\u0234b\u0235c\u0236', 12, 'latin1');
testBufs('abc', 4, -1, 'latin1');
testBufs('abc', 4, 1, 'latin1');
testBufs('abc', 5, 1, 'latin1');
testBufs('\u0222aa', 2, -1, 'latin1');
testBufs('\u0222aa', 8, 1, 'latin1');
testBufs('a\u0234b\u0235c\u0236', 4, -1, 'latin1');
testBufs('a\u0234b\u0235c\u0236', 4, 1, 'latin1');
testBufs('a\u0234b\u0235c\u0236', 12, 1, 'latin1');


// UCS2
testBufs('abc', 'ucs2');
testBufs('\u0222aa', 'ucs2');
testBufs('a\u0234b\u0235c\u0236', 'ucs2');
testBufs('abc', 4, 'ucs2');
testBufs('abc', SIZE, 'ucs2');
testBufs('\u0222aa', 2, 'ucs2');
testBufs('\u0222aa', 8, 'ucs2');
testBufs('a\u0234b\u0235c\u0236', 4, 'ucs2');
testBufs('a\u0234b\u0235c\u0236', 12, 'ucs2');
testBufs('abc', 4, -1, 'ucs2');
testBufs('abc', 4, 1, 'ucs2');
testBufs('abc', 5, 1, 'ucs2');
testBufs('\u0222aa', 2, -1, 'ucs2');
testBufs('\u0222aa', 8, 1, 'ucs2');
testBufs('a\u0234b\u0235c\u0236', 4, -1, 'ucs2');
testBufs('a\u0234b\u0235c\u0236', 4, 1, 'ucs2');
testBufs('a\u0234b\u0235c\u0236', 12, 1, 'ucs2');
assert.equal(Buffer.allocUnsafe(1).fill('\u0222', 'ucs2')[0],
             os.endianness() === 'LE' ? 0x22 : 0x02);


// HEX
testBufs('616263', 'hex');
testBufs('c8a26161', 'hex');
testBufs('61c8b462c8b563c8b6', 'hex');
testBufs('616263', 4, 'hex');
testBufs('616263', 5, 'hex');
testBufs('616263', SIZE, 'hex');
testBufs('c8a26161', 2, 'hex');
testBufs('c8a26161', 8, 'hex');
testBufs('61c8b462c8b563c8b6', 4, 'hex');
testBufs('61c8b462c8b563c8b6', 12, 'hex');
testBufs('616263', 4, -1, 'hex');
testBufs('616263', 4, 1, 'hex');
testBufs('616263', 5, 1, 'hex');
testBufs('c8a26161', 2, -1, 'hex');
testBufs('c8a26161', 8, 1, 'hex');
testBufs('61c8b462c8b563c8b6', 4, -1, 'hex');
testBufs('61c8b462c8b563c8b6', 4, 1, 'hex');
testBufs('61c8b462c8b563c8b6', 12, 1, 'hex');

common.expectsError(() => {
  const buf = Buffer.allocUnsafe(SIZE);

  buf.fill('yKJh', 'hex');
}, {
  code: 'ERR_INVALID_ARG_VALUE',
  type: TypeError
});

common.expectsError(() => {
  const buf = Buffer.allocUnsafe(SIZE);

  buf.fill('\u0222', 'hex');
}, {
  code: 'ERR_INVALID_ARG_VALUE',
  type: TypeError
});

// BASE64
testBufs('YWJj', 'ucs2');
testBufs('yKJhYQ==', 'ucs2');
testBufs('Yci0Ysi1Y8i2', 'ucs2');
testBufs('YWJj', 4, 'ucs2');
testBufs('YWJj', SIZE, 'ucs2');
testBufs('yKJhYQ==', 2, 'ucs2');
testBufs('yKJhYQ==', 8, 'ucs2');
testBufs('Yci0Ysi1Y8i2', 4, 'ucs2');
testBufs('Yci0Ysi1Y8i2', 12, 'ucs2');
testBufs('YWJj', 4, -1, 'ucs2');
testBufs('YWJj', 4, 1, 'ucs2');
testBufs('YWJj', 5, 1, 'ucs2');
testBufs('yKJhYQ==', 2, -1, 'ucs2');
testBufs('yKJhYQ==', 8, 1, 'ucs2');
testBufs('Yci0Ysi1Y8i2', 4, -1, 'ucs2');
testBufs('Yci0Ysi1Y8i2', 4, 1, 'ucs2');
testBufs('Yci0Ysi1Y8i2', 12, 1, 'ucs2');


// Buffer
function deepStrictEqualValues(buf, arr) {
  for (var [index, value] of buf.entries()) {
    assert.deepStrictEqual(value, arr[index]);
  }
}


var buf2Fill = Buffer.allocUnsafe(1).fill(2);
deepStrictEqualValues(genBuffer(4, [buf2Fill]), [2, 2, 2, 2]);
deepStrictEqualValues(genBuffer(4, [buf2Fill, 1]), [0, 2, 2, 2]);
deepStrictEqualValues(genBuffer(4, [buf2Fill, 1, 3]), [0, 2, 2, 0]);
deepStrictEqualValues(genBuffer(4, [buf2Fill, 1, 1]), [0, 0, 0, 0]);
deepStrictEqualValues(genBuffer(4, [buf2Fill, 1, -1]), [0, 0, 0, 0]);
var hexBufFill = Buffer.allocUnsafe(2).fill(0).fill('0102', 'hex');
deepStrictEqualValues(genBuffer(4, [hexBufFill]), [1, 2, 1, 2]);
deepStrictEqualValues(genBuffer(4, [hexBufFill, 1]), [0, 1, 2, 1]);
deepStrictEqualValues(genBuffer(4, [hexBufFill, 1, 3]), [0, 1, 2, 0]);
deepStrictEqualValues(genBuffer(4, [hexBufFill, 1, 1]), [0, 0, 0, 0]);
deepStrictEqualValues(genBuffer(4, [hexBufFill, 1, -1]), [0, 0, 0, 0]);


// Check exceptions
assert.throws(() => buf1.fill(0, -1));
assert.throws(() => buf1.fill(0, 0, buf1.length + 1));
assert.throws(() => buf1.fill('', -1));
assert.throws(() => buf1.fill('', 0, buf1.length + 1));
assert.throws(() => buf1.fill('a', 0, buf1.length, 'node rocks!'));
assert.throws(() => buf1.fill('a', 0, 0, NaN));
assert.throws(() => buf1.fill('a', 0, 0, null));
assert.throws(() => buf1.fill('a', 0, 0, 'foo'));


function genBuffer(size, args) {
  var b = Buffer.allocUnsafe(size);
  return b.fill(0).fill.apply(b, args);
}


function bufReset() {
  buf1.fill(0);
  buf2.fill(0);
}


// This is mostly accurate. Except write() won't write partial bytes to the
// string while fill() blindly copies bytes into memory. To account for that an
// error will be thrown if not all the data can be written, and the SIZE has
// been massaged to work with the input characters.
function writeToFill(string, offset, end, encoding) {
  if (typeof offset === 'string') {
    encoding = offset;
    offset = 0;
    end = buf2.length;
  } else if (typeof end === 'string') {
    encoding = end;
    end = buf2.length;
  } else if (end === undefined) {
    end = buf2.length;
  }

  if (offset < 0 || end > buf2.length)
    throw new RangeError('Out of range index');

  if (end <= offset)
    return buf2;

  offset >>>= 0;
  end >>>= 0;
  assert(offset <= buf2.length);

  // Convert "end" to "length" (which write understands).
  var length = end - offset < 0 ? 0 : end - offset;

  var wasZero = false;
  do {
    var written = buf2.write(string, offset, length, encoding);
    offset += written;
    // Safety check in case write falls into infinite loop.
    if (written === 0) {
      if (wasZero)
        throw new Error('Could not write all data to Buffer');
      else
        wasZero = true;
    }
  } while (offset < buf2.length);

  // Correction for UCS2 operations.
  if (os.endianness() === 'BE' && encoding === 'ucs2') {
    for (var i = 0; i < buf2.length; i += 2) {
      var tmp = buf2[i];
      buf2[i] = buf2[i + 1];
      buf2[i + 1] = tmp;
    }
  }

  return buf2;
}


function testBufs(string, offset, length, encoding) {
  bufReset();
  buf1.fill.apply(buf1, arguments);
  // Swap bytes on BE archs for ucs2 encoding.
  assert.deepStrictEqual(buf1.fill.apply(buf1, arguments),
                         writeToFill.apply(null, arguments));
}


```

---

### test-buffer-from.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-from.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;

const common = require('./common');
const { deepStrictEqual, throws } = require('assert');
const { runInNewContext } = require('vm');

const checkString = 'test';

const check = Buffer.from(checkString);

class MyString extends String {
  constructor() {
    super(checkString);
  }
}

class MyPrimitive {
  [Symbol.toPrimitive]() {
    return checkString;
  }
}

class MyBadPrimitive {
  [Symbol.toPrimitive]() {
    return 1;
  }
}

deepStrictEqual(Buffer.from(new String(checkString)), check);
deepStrictEqual(Buffer.from(new MyString()), check);
deepStrictEqual(Buffer.from(new MyPrimitive()), check);
deepStrictEqual(
  Buffer.from(runInNewContext('new String(checkString)', { checkString })),
  check
);

[
  [{}, 'object'],
  [new Boolean(true), 'boolean'],
  [{ valueOf() { return null; } }, 'object'],
  [{ valueOf() { return undefined; } }, 'object'],
  [{ valueOf: null }, 'object'],
  [Object.create(null), 'object']
].forEach(([input, actualType]) => {
  const err = common.expectsError({
    code: 'ERR_INVALID_ARG_TYPE',
    type: TypeError,
    message: 'The first argument must be one of type string, Buffer, ' +
             'ArrayBuffer, Array, or Array-like Object. Received ' +
             `type ${actualType}`
  });
  throws(() => Buffer.from(input), err);
});

[
  new Number(true),
  new MyBadPrimitive()
].forEach((input) => {
  const errMsg = common.expectsError({
    code: 'ERR_INVALID_ARG_TYPE',
    type: TypeError,
    message: 'The "value" argument must not be of type number. ' +
             'Received type number'
  });
  throws(() => Buffer.from(input), errMsg);
});


```

---

### test-buffer-includes.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-includes.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;


var assert = require('assert');

var Buffer = require('../../').Buffer;

var b = Buffer.from('abcdef');
var buf_a = Buffer.from('a');
var buf_bc = Buffer.from('bc');
var buf_f = Buffer.from('f');
var buf_z = Buffer.from('z');
var buf_empty = Buffer.from('');

assert(b.includes('a'));
assert(!b.includes('a', 1));
assert(!b.includes('a', -1));
assert(!b.includes('a', -4));
assert(b.includes('a', -b.length));
assert(b.includes('a', NaN));
assert(b.includes('a', -Infinity));
assert(!b.includes('a', Infinity));
assert(b.includes('bc'));
assert(!b.includes('bc', 2));
assert(!b.includes('bc', -1));
assert(!b.includes('bc', -3));
assert(b.includes('bc', -5));
assert(b.includes('bc', NaN));
assert(b.includes('bc', -Infinity));
assert(!b.includes('bc', Infinity));
assert(b.includes('f'), b.length - 1);
assert(!b.includes('z'));
assert(!b.includes(''));
assert(!b.includes('', 1));
assert(!b.includes('', b.length + 1));
assert(!b.includes('', Infinity));
assert(b.includes(buf_a));
assert(!b.includes(buf_a, 1));
assert(!b.includes(buf_a, -1));
assert(!b.includes(buf_a, -4));
assert(b.includes(buf_a, -b.length));
assert(b.includes(buf_a, NaN));
assert(b.includes(buf_a, -Infinity));
assert(!b.includes(buf_a, Infinity));
assert(b.includes(buf_bc));
assert(!b.includes(buf_bc, 2));
assert(!b.includes(buf_bc, -1));
assert(!b.includes(buf_bc, -3));
assert(b.includes(buf_bc, -5));
assert(b.includes(buf_bc, NaN));
assert(b.includes(buf_bc, -Infinity));
assert(!b.includes(buf_bc, Infinity));
assert(b.includes(buf_f), b.length - 1);
assert(!b.includes(buf_z));
assert(!b.includes(buf_empty));
assert(!b.includes(buf_empty, 1));
assert(!b.includes(buf_empty, b.length + 1));
assert(!b.includes(buf_empty, Infinity));
assert(b.includes(0x61));
assert(!b.includes(0x61, 1));
assert(!b.includes(0x61, -1));
assert(!b.includes(0x61, -4));
assert(b.includes(0x61, -b.length));
assert(b.includes(0x61, NaN));
assert(b.includes(0x61, -Infinity));
assert(!b.includes(0x61, Infinity));
assert(!b.includes(0x0));

// test offsets
assert(b.includes('d', 2));
assert(b.includes('f', 5));
assert(b.includes('f', -1));
assert(!b.includes('f', 6));

assert(b.includes(Buffer.from('d'), 2));
assert(b.includes(Buffer.from('f'), 5));
assert(b.includes(Buffer.from('f'), -1));
assert(!b.includes(Buffer.from('f'), 6));

assert(!Buffer.from('ff').includes(Buffer.from('f'), 1, 'ucs2'));

// test hex encoding
assert.strictEqual(
  Buffer.from(b.toString('hex'), 'hex')
    .includes('64', 0, 'hex'),
  true
);
assert.strictEqual(
  Buffer.from(b.toString('hex'), 'hex')
    .includes(Buffer.from('64', 'hex'), 0, 'hex'),
  true
);

// test base64 encoding
assert.strictEqual(
  Buffer.from(b.toString('base64'), 'base64')
    .includes('ZA==', 0, 'base64'),
  true
);
assert.strictEqual(
  Buffer.from(b.toString('base64'), 'base64')
    .includes(Buffer.from('ZA==', 'base64'), 0, 'base64'),
  true
);

// test ascii encoding
assert.strictEqual(
  Buffer.from(b.toString('ascii'), 'ascii')
    .includes('d', 0, 'ascii'),
  true
);
assert.strictEqual(
  Buffer.from(b.toString('ascii'), 'ascii')
    .includes(Buffer.from('d', 'ascii'), 0, 'ascii'),
  true
);

// test latin1 encoding
assert.strictEqual(
  Buffer.from(b.toString('latin1'), 'latin1')
    .includes('d', 0, 'latin1'),
  true
);
assert.strictEqual(
  Buffer.from(b.toString('latin1'), 'latin1')
    .includes(Buffer.from('d', 'latin1'), 0, 'latin1'),
  true
);

// test binary encoding
assert.strictEqual(
  Buffer.from(b.toString('binary'), 'binary')
    .includes('d', 0, 'binary'),
  true
);
assert.strictEqual(
  Buffer.from(b.toString('binary'), 'binary')
    .includes(Buffer.from('d', 'binary'), 0, 'binary'),
  true
);


// test usc2 encoding
var twoByteString = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'ucs2');

assert(twoByteString.includes('\u0395', 4, 'ucs2'));
assert(twoByteString.includes('\u03a3', -4, 'ucs2'));
assert(twoByteString.includes('\u03a3', -6, 'ucs2'));
assert(twoByteString.includes(
  Buffer.from('\u03a3', 'ucs2'), -6, 'ucs2'));
assert(!twoByteString.includes('\u03a3', -2, 'ucs2'));

var mixedByteStringUcs2 =
    Buffer.from('\u039a\u0391abc\u03a3\u03a3\u0395', 'ucs2');
assert(mixedByteStringUcs2.includes('bc', 0, 'ucs2'));
assert(mixedByteStringUcs2.includes('\u03a3', 0, 'ucs2'));
assert(!mixedByteStringUcs2.includes('\u0396', 0, 'ucs2'));

assert(
    6, mixedByteStringUcs2.includes(Buffer.from('bc', 'ucs2'), 0, 'ucs2'));
assert(
    10, mixedByteStringUcs2.includes(Buffer.from('\u03a3', 'ucs2'),
    0, 'ucs2'));
assert(
    -1, mixedByteStringUcs2.includes(Buffer.from('\u0396', 'ucs2'),
    0, 'ucs2'));

twoByteString = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'ucs2');

// Test single char pattern
assert(twoByteString.includes('\u039a', 0, 'ucs2'));
assert(twoByteString.includes('\u0391', 0, 'ucs2'), 'Alpha');
assert(twoByteString.includes('\u03a3', 0, 'ucs2'), 'First Sigma');
assert(twoByteString.includes('\u03a3', 6, 'ucs2'), 'Second Sigma');
assert(twoByteString.includes('\u0395', 0, 'ucs2'), 'Epsilon');
assert(!twoByteString.includes('\u0392', 0, 'ucs2'), 'Not beta');

// Test multi-char pattern
assert(twoByteString.includes('\u039a\u0391', 0, 'ucs2'), 'Lambda Alpha');
assert(twoByteString.includes('\u0391\u03a3', 0, 'ucs2'), 'Alpha Sigma');
assert(twoByteString.includes('\u03a3\u03a3', 0, 'ucs2'), 'Sigma Sigma');
assert(twoByteString.includes('\u03a3\u0395', 0, 'ucs2'), 'Sigma Epsilon');

var mixedByteStringUtf8 = Buffer.from('\u039a\u0391abc\u03a3\u03a3\u0395');
assert(mixedByteStringUtf8.includes('bc'));
assert(mixedByteStringUtf8.includes('bc', 5));
assert(mixedByteStringUtf8.includes('bc', -8));
assert(mixedByteStringUtf8.includes('\u03a3'));
assert(!mixedByteStringUtf8.includes('\u0396'));


// Test complex string includes algorithms. Only trigger for long strings.
// Long string that isn't a simple repeat of a shorter string.
var longString = 'A';
for (var i = 66; i < 76; i++) {  // from 'B' to 'K'
  longString = longString + String.fromCharCode(i) + longString;
}

var longBufferString = Buffer.from(longString);

// pattern of 15 chars, repeated every 16 chars in long
var pattern = 'ABACABADABACABA';
for (var i = 0; i < longBufferString.length - pattern.length; i += 7) {
  var includes = longBufferString.includes(pattern, i);
  assert(includes, 'Long ABACABA...-string at index ' + i);
}
assert(longBufferString.includes('AJABACA'), 'Long AJABACA, First J');
assert(longBufferString.includes('AJABACA', 511), 'Long AJABACA, Second J');

pattern = 'JABACABADABACABA';
assert(longBufferString.includes(pattern), 'Long JABACABA..., First J');
assert(longBufferString.includes(pattern, 512), 'Long JABACABA..., Second J');

// Search for a non-ASCII string in a pure ASCII string.
var asciiString = Buffer.from(
    'arglebargleglopglyfarglebargleglopglyfarglebargleglopglyf');
assert(!asciiString.includes('\x2061'));
assert(asciiString.includes('leb', 0));

// Search in string containing many non-ASCII chars.
var allCodePoints = [];
for (var i = 0; i < 65536; i++) allCodePoints[i] = i;
var allCharsString = String.fromCharCode.apply(String, allCodePoints);
var allCharsBufferUtf8 = Buffer.from(allCharsString);
var allCharsBufferUcs2 = Buffer.from(allCharsString, 'ucs2');

// Search for string long enough to trigger complex search with ASCII pattern
// and UC16 subject.
assert(!allCharsBufferUtf8.includes('notfound'));
assert(!allCharsBufferUcs2.includes('notfound'));

// Find substrings in Utf8.
var lengths = [1, 3, 15];  // Single char, simple and complex.
var indices = [0x5, 0x60, 0x400, 0x680, 0x7ee, 0xFF02, 0x16610, 0x2f77b];
for (var lengthIndex = 0; lengthIndex < lengths.length; lengthIndex++) {
  for (var i = 0; i < indices.length; i++) {
    var index = indices[i];
    var length = lengths[lengthIndex];

    if (index + length > 0x7F) {
      length = 2 * length;
    }

    if (index + length > 0x7FF) {
      length = 3 * length;
    }

    if (index + length > 0xFFFF) {
      length = 4 * length;
    }

    var patternBufferUtf8 = allCharsBufferUtf8.slice(index, index + length);
    assert(index, allCharsBufferUtf8.includes(patternBufferUtf8));

    var patternStringUtf8 = patternBufferUtf8.toString();
    assert(index, allCharsBufferUtf8.includes(patternStringUtf8));
  }
}

// Find substrings in Usc2.
lengths = [2, 4, 16];  // Single char, simple and complex.
indices = [0x5, 0x65, 0x105, 0x205, 0x285, 0x2005, 0x2085, 0xfff0];
for (var lengthIndex = 0; lengthIndex < lengths.length; lengthIndex++) {
  for (var i = 0; i < indices.length; i++) {
    var index = indices[i] * 2;
    var length = lengths[lengthIndex];

    var patternBufferUcs2 =
        allCharsBufferUcs2.slice(index, index + length);
    assert(
        index, allCharsBufferUcs2.includes(patternBufferUcs2, 0, 'ucs2'));

    var patternStringUcs2 = patternBufferUcs2.toString('ucs2');
    assert(
        index, allCharsBufferUcs2.includes(patternStringUcs2, 0, 'ucs2'));
  }
}

assert.throws(function() {
  b.includes(function() { });
});
assert.throws(function() {
  b.includes({});
});
assert.throws(function() {
  b.includes([]);
});

// test truncation of Number arguments to uint8
{
  var buf = Buffer.from('this is a test');
  assert.ok(buf.includes(0x6973));
  assert.ok(buf.includes(0x697320));
  assert.ok(buf.includes(0x69732069));
  assert.ok(buf.includes(0x697374657374));
  assert.ok(buf.includes(0x69737374));
  assert.ok(buf.includes(0x69737465));
  assert.ok(buf.includes(0x69737465));
  assert.ok(buf.includes(-140));
  assert.ok(buf.includes(-152));
  assert.ok(!buf.includes(0xff));
  assert.ok(!buf.includes(0xffff));
}


```

---

### test-buffer-indexof.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-indexof.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;


var assert = require('assert');

var Buffer = require('../../').Buffer;

var b = Buffer.from('abcdef');
var buf_a = Buffer.from('a');
var buf_bc = Buffer.from('bc');
var buf_f = Buffer.from('f');
var buf_z = Buffer.from('z');
var buf_empty = Buffer.from('');

assert.equal(b.indexOf('a'), 0);
assert.equal(b.indexOf('a', 1), -1);
assert.equal(b.indexOf('a', -1), -1);
assert.equal(b.indexOf('a', -4), -1);
assert.equal(b.indexOf('a', -b.length), 0);
assert.equal(b.indexOf('a', NaN), 0);
assert.equal(b.indexOf('a', -Infinity), 0);
assert.equal(b.indexOf('a', Infinity), -1);
assert.equal(b.indexOf('bc'), 1);
assert.equal(b.indexOf('bc', 2), -1);
assert.equal(b.indexOf('bc', -1), -1);
assert.equal(b.indexOf('bc', -3), -1);
assert.equal(b.indexOf('bc', -5), 1);
assert.equal(b.indexOf('bc', NaN), 1);
assert.equal(b.indexOf('bc', -Infinity), 1);
assert.equal(b.indexOf('bc', Infinity), -1);
assert.equal(b.indexOf('f'), b.length - 1);
assert.equal(b.indexOf('z'), -1);
assert.equal(b.indexOf(''), -1);
assert.equal(b.indexOf('', 1), -1);
assert.equal(b.indexOf('', b.length + 1), -1);
assert.equal(b.indexOf('', Infinity), -1);
assert.equal(b.indexOf(buf_a), 0);
assert.equal(b.indexOf(buf_a, 1), -1);
assert.equal(b.indexOf(buf_a, -1), -1);
assert.equal(b.indexOf(buf_a, -4), -1);
assert.equal(b.indexOf(buf_a, -b.length), 0);
assert.equal(b.indexOf(buf_a, NaN), 0);
assert.equal(b.indexOf(buf_a, -Infinity), 0);
assert.equal(b.indexOf(buf_a, Infinity), -1);
assert.equal(b.indexOf(buf_bc), 1);
assert.equal(b.indexOf(buf_bc, 2), -1);
assert.equal(b.indexOf(buf_bc, -1), -1);
assert.equal(b.indexOf(buf_bc, -3), -1);
assert.equal(b.indexOf(buf_bc, -5), 1);
assert.equal(b.indexOf(buf_bc, NaN), 1);
assert.equal(b.indexOf(buf_bc, -Infinity), 1);
assert.equal(b.indexOf(buf_bc, Infinity), -1);
assert.equal(b.indexOf(buf_f), b.length - 1);
assert.equal(b.indexOf(buf_z), -1);
assert.equal(b.indexOf(buf_empty), -1);
assert.equal(b.indexOf(buf_empty, 1), -1);
assert.equal(b.indexOf(buf_empty, b.length + 1), -1);
assert.equal(b.indexOf(buf_empty, Infinity), -1);
assert.equal(b.indexOf(0x61), 0);
assert.equal(b.indexOf(0x61, 1), -1);
assert.equal(b.indexOf(0x61, -1), -1);
assert.equal(b.indexOf(0x61, -4), -1);
assert.equal(b.indexOf(0x61, -b.length), 0);
assert.equal(b.indexOf(0x61, NaN), 0);
assert.equal(b.indexOf(0x61, -Infinity), 0);
assert.equal(b.indexOf(0x61, Infinity), -1);
assert.equal(b.indexOf(0x0), -1);

// test offsets
assert.equal(b.indexOf('d', 2), 3);
assert.equal(b.indexOf('f', 5), 5);
assert.equal(b.indexOf('f', -1), 5);
assert.equal(b.indexOf('f', 6), -1);

assert.equal(b.indexOf(Buffer.from('d'), 2), 3);
assert.equal(b.indexOf(Buffer.from('f'), 5), 5);
assert.equal(b.indexOf(Buffer.from('f'), -1), 5);
assert.equal(b.indexOf(Buffer.from('f'), 6), -1);

assert.equal(Buffer.from('ff').indexOf(Buffer.from('f'), 1, 'ucs2'), -1);

// test hex encoding
assert.strictEqual(
  Buffer.from(b.toString('hex'), 'hex')
    .indexOf('64', 0, 'hex'),
  3
);
assert.strictEqual(
  Buffer.from(b.toString('hex'), 'hex')
    .indexOf(Buffer.from('64', 'hex'), 0, 'hex'),
  3
);

// test base64 encoding
assert.strictEqual(
  Buffer.from(b.toString('base64'), 'base64')
    .indexOf('ZA==', 0, 'base64'),
  3
);
assert.strictEqual(
  Buffer.from(b.toString('base64'), 'base64')
    .indexOf(Buffer.from('ZA==', 'base64'), 0, 'base64'),
  3
);

// test ascii encoding
assert.strictEqual(
  Buffer.from(b.toString('ascii'), 'ascii')
    .indexOf('d', 0, 'ascii'),
  3
);
assert.strictEqual(
  Buffer.from(b.toString('ascii'), 'ascii')
    .indexOf(Buffer.from('d', 'ascii'), 0, 'ascii'),
  3
);

// test latin1 encoding
assert.strictEqual(
  Buffer.from(b.toString('latin1'), 'latin1')
    .indexOf('d', 0, 'latin1'),
  3
);
assert.strictEqual(
  Buffer.from(b.toString('latin1'), 'latin1')
    .indexOf(Buffer.from('d', 'latin1'), 0, 'latin1'),
  3
);
assert.strictEqual(
  Buffer.from('aa\u00e8aa', 'latin1')
    .indexOf('\u00e8', 'latin1'),
  2
);
assert.strictEqual(
  Buffer.from('\u00e8', 'latin1')
    .indexOf('\u00e8', 'latin1'),
  0
);
assert.strictEqual(
  Buffer.from('\u00e8', 'latin1')
    .indexOf(Buffer.from('\u00e8', 'latin1'), 'latin1'),
  0
);

// test binary encoding
assert.strictEqual(
  Buffer.from(b.toString('binary'), 'binary')
    .indexOf('d', 0, 'binary'),
  3
);
assert.strictEqual(
  Buffer.from(b.toString('binary'), 'binary')
    .indexOf(Buffer.from('d', 'binary'), 0, 'binary'),
  3
);
assert.strictEqual(
  Buffer.from('aa\u00e8aa', 'binary')
    .indexOf('\u00e8', 'binary'),
  2
);
assert.strictEqual(
  Buffer.from('\u00e8', 'binary')
    .indexOf('\u00e8', 'binary'),
  0
);
assert.strictEqual(
  Buffer.from('\u00e8', 'binary')
    .indexOf(Buffer.from('\u00e8', 'binary'), 'binary'),
  0
);


// test optional offset with passed encoding
assert.equal(Buffer.from('aaaa0').indexOf('30', 'hex'), 4);
assert.equal(Buffer.from('aaaa00a').indexOf('3030', 'hex'), 4);

{
  // test usc2 encoding
  var twoByteString = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'ucs2');

  assert.equal(8, twoByteString.indexOf('\u0395', 4, 'ucs2'));
  assert.equal(6, twoByteString.indexOf('\u03a3', -4, 'ucs2'));
  assert.equal(4, twoByteString.indexOf('\u03a3', -6, 'ucs2'));
  assert.equal(4, twoByteString.indexOf(
    Buffer.from('\u03a3', 'ucs2'), -6, 'ucs2'));
  assert.equal(-1, twoByteString.indexOf('\u03a3', -2, 'ucs2'));
}

var mixedByteStringUcs2 =
    Buffer.from('\u039a\u0391abc\u03a3\u03a3\u0395', 'ucs2');
assert.equal(6, mixedByteStringUcs2.indexOf('bc', 0, 'ucs2'));
assert.equal(10, mixedByteStringUcs2.indexOf('\u03a3', 0, 'ucs2'));
assert.equal(-1, mixedByteStringUcs2.indexOf('\u0396', 0, 'ucs2'));

assert.equal(
    6, mixedByteStringUcs2.indexOf(Buffer.from('bc', 'ucs2'), 0, 'ucs2'));
assert.equal(
    10, mixedByteStringUcs2.indexOf(Buffer.from('\u03a3', 'ucs2'), 0, 'ucs2'));
assert.equal(
    -1, mixedByteStringUcs2.indexOf(Buffer.from('\u0396', 'ucs2'), 0, 'ucs2'));

{
  var twoByteString = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'ucs2');

  // Test single char pattern
  assert.equal(0, twoByteString.indexOf('\u039a', 0, 'ucs2'));
  assert.equal(2, twoByteString.indexOf('\u0391', 0, 'ucs2'), 'Alpha');
  assert.equal(4, twoByteString.indexOf('\u03a3', 0, 'ucs2'), 'First Sigma');
  assert.equal(6, twoByteString.indexOf('\u03a3', 6, 'ucs2'), 'Second Sigma');
  assert.equal(8, twoByteString.indexOf('\u0395', 0, 'ucs2'), 'Epsilon');
  assert.equal(-1, twoByteString.indexOf('\u0392', 0, 'ucs2'), 'Not beta');

  // Test multi-char pattern
  assert.equal(
      0, twoByteString.indexOf('\u039a\u0391', 0, 'ucs2'), 'Lambda Alpha');
  assert.equal(
      2, twoByteString.indexOf('\u0391\u03a3', 0, 'ucs2'), 'Alpha Sigma');
  assert.equal(
      4, twoByteString.indexOf('\u03a3\u03a3', 0, 'ucs2'), 'Sigma Sigma');
  assert.equal(
      6, twoByteString.indexOf('\u03a3\u0395', 0, 'ucs2'), 'Sigma Epsilon');
}

var mixedByteStringUtf8 = Buffer.from('\u039a\u0391abc\u03a3\u03a3\u0395');
assert.equal(5, mixedByteStringUtf8.indexOf('bc'));
assert.equal(5, mixedByteStringUtf8.indexOf('bc', 5));
assert.equal(5, mixedByteStringUtf8.indexOf('bc', -8));
assert.equal(7, mixedByteStringUtf8.indexOf('\u03a3'));
assert.equal(-1, mixedByteStringUtf8.indexOf('\u0396'));


// Test complex string indexOf algorithms. Only trigger for long strings.
// Long string that isn't a simple repeat of a shorter string.
var longString = 'A';
for (var i = 66; i < 76; i++) {  // from 'B' to 'K'
  longString = longString + String.fromCharCode(i) + longString;
}

var longBufferString = Buffer.from(longString);

// pattern of 15 chars, repeated every 16 chars in long
var pattern = 'ABACABADABACABA';
for (var i = 0; i < longBufferString.length - pattern.length; i += 7) {
  var index = longBufferString.indexOf(pattern, i);
  assert.equal((i + 15) & ~0xf, index, 'Long ABACABA...-string at index ' + i);
}
assert.equal(510, longBufferString.indexOf('AJABACA'), 'Long AJABACA, First J');
assert.equal(
    1534, longBufferString.indexOf('AJABACA', 511), 'Long AJABACA, Second J');

pattern = 'JABACABADABACABA';
assert.equal(
    511, longBufferString.indexOf(pattern), 'Long JABACABA..., First J');
assert.equal(
    1535, longBufferString.indexOf(pattern, 512), 'Long JABACABA..., Second J');

// Search for a non-ASCII string in a pure ASCII string.
var asciiString = Buffer.from(
    'arglebargleglopglyfarglebargleglopglyfarglebargleglopglyf');
assert.equal(-1, asciiString.indexOf('\x2061'));
assert.equal(3, asciiString.indexOf('leb', 0));

// Search in string containing many non-ASCII chars.
var allCodePoints = [];
for (var i = 0; i < 65536; i++) allCodePoints[i] = i;
var allCharsString = String.fromCharCode.apply(String, allCodePoints);
var allCharsBufferUtf8 = Buffer.from(allCharsString);
var allCharsBufferUcs2 = Buffer.from(allCharsString, 'ucs2');

// Search for string long enough to trigger complex search with ASCII pattern
// and UC16 subject.
assert.equal(-1, allCharsBufferUtf8.indexOf('notfound'));
assert.equal(-1, allCharsBufferUcs2.indexOf('notfound'));

// Needle is longer than haystack, but only because it's encoded as UTF-16
assert.strictEqual(Buffer.from('aaaa').indexOf('a'.repeat(4), 'ucs2'), -1);

assert.strictEqual(Buffer.from('aaaa').indexOf('a'.repeat(4), 'utf8'), 0);
assert.strictEqual(Buffer.from('aaaa').indexOf('你好', 'ucs2'), -1);

// Haystack has odd length, but the needle is UCS2.
// assert.strictEqual(Buffer.from('aaaaa').indexOf('b', 'ucs2'), -1);

{
  // Find substrings in Utf8.
  var lengths = [1, 3, 15];  // Single char, simple and complex.
  var indices = [0x5, 0x60, 0x400, 0x680, 0x7ee, 0xFF02, 0x16610, 0x2f77b];
  for (var lengthIndex = 0; lengthIndex < lengths.length; lengthIndex++) {
    for (var i = 0; i < indices.length; i++) {
      var index = indices[i];
      var length = lengths[lengthIndex];

      if (index + length > 0x7F) {
        length = 2 * length;
      }

      if (index + length > 0x7FF) {
        length = 3 * length;
      }

      if (index + length > 0xFFFF) {
        length = 4 * length;
      }

      var patternBufferUtf8 = allCharsBufferUtf8.slice(index, index + length);
      assert.equal(index, allCharsBufferUtf8.indexOf(patternBufferUtf8));

      var patternStringUtf8 = patternBufferUtf8.toString();
      assert.equal(index, allCharsBufferUtf8.indexOf(patternStringUtf8));
    }
  }
}

{
  // Find substrings in Usc2.
  var lengths = [2, 4, 16];  // Single char, simple and complex.
  var indices = [0x5, 0x65, 0x105, 0x205, 0x285, 0x2005, 0x2085, 0xfff0];
  for (var lengthIndex = 0; lengthIndex < lengths.length; lengthIndex++) {
    for (var i = 0; i < indices.length; i++) {
      var index = indices[i] * 2;
      var length = lengths[lengthIndex];

      var patternBufferUcs2 =
          allCharsBufferUcs2.slice(index, index + length);
      assert.equal(
          index, allCharsBufferUcs2.indexOf(patternBufferUcs2, 0, 'ucs2'));

      var patternStringUcs2 = patternBufferUcs2.toString('ucs2');
      assert.equal(
          index, allCharsBufferUcs2.indexOf(patternStringUcs2, 0, 'ucs2'));
    }
  }
}

assert.throws(function() {
  b.indexOf(function() { });
});
assert.throws(function() {
  b.indexOf({});
});
assert.throws(function() {
  b.indexOf([]);
});

// All code for handling encodings is shared between Buffer.indexOf and
// Buffer.lastIndexOf, so only testing the separate lastIndexOf semantics.

// Test lastIndexOf basic functionality; Buffer b contains 'abcdef'.
// lastIndexOf string:
assert.equal(b.lastIndexOf('a'), 0);
assert.equal(b.lastIndexOf('a', 1), 0);
assert.equal(b.lastIndexOf('b', 1), 1);
assert.equal(b.lastIndexOf('c', 1), -1);
assert.equal(b.lastIndexOf('a', -1), 0);
assert.equal(b.lastIndexOf('a', -4), 0);
assert.equal(b.lastIndexOf('a', -b.length), 0);
assert.equal(b.lastIndexOf('a', -b.length - 1), -1);
assert.equal(b.lastIndexOf('a', NaN), 0);
assert.equal(b.lastIndexOf('a', -Infinity), -1);
assert.equal(b.lastIndexOf('a', Infinity), 0);
// lastIndexOf Buffer:
assert.equal(b.lastIndexOf(buf_a), 0);
assert.equal(b.lastIndexOf(buf_a, 1), 0);
assert.equal(b.lastIndexOf(buf_a, -1), 0);
assert.equal(b.lastIndexOf(buf_a, -4), 0);
assert.equal(b.lastIndexOf(buf_a, -b.length), 0);
assert.equal(b.lastIndexOf(buf_a, -b.length - 1), -1);
assert.equal(b.lastIndexOf(buf_a, NaN), 0);
assert.equal(b.lastIndexOf(buf_a, -Infinity), -1);
assert.equal(b.lastIndexOf(buf_a, Infinity), 0);
assert.equal(b.lastIndexOf(buf_bc), 1);
assert.equal(b.lastIndexOf(buf_bc, 2), 1);
assert.equal(b.lastIndexOf(buf_bc, -1), 1);
assert.equal(b.lastIndexOf(buf_bc, -3), 1);
assert.equal(b.lastIndexOf(buf_bc, -5), 1);
assert.equal(b.lastIndexOf(buf_bc, -6), -1);
assert.equal(b.lastIndexOf(buf_bc, NaN), 1);
assert.equal(b.lastIndexOf(buf_bc, -Infinity), -1);
assert.equal(b.lastIndexOf(buf_bc, Infinity), 1);
assert.equal(b.lastIndexOf(buf_f), b.length - 1);
assert.equal(b.lastIndexOf(buf_z), -1);
assert.equal(b.lastIndexOf(buf_empty), -1);
assert.equal(b.lastIndexOf(buf_empty, 1), -1);
assert.equal(b.lastIndexOf(buf_empty, b.length + 1), -1);
assert.equal(b.lastIndexOf(buf_empty, Infinity), -1);
// lastIndexOf number:
assert.equal(b.lastIndexOf(0x61), 0);
assert.equal(b.lastIndexOf(0x61, 1), 0);
assert.equal(b.lastIndexOf(0x61, -1), 0);
assert.equal(b.lastIndexOf(0x61, -4), 0);
assert.equal(b.lastIndexOf(0x61, -b.length), 0);
assert.equal(b.lastIndexOf(0x61, -b.length - 1), -1);
assert.equal(b.lastIndexOf(0x61, NaN), 0);
assert.equal(b.lastIndexOf(0x61, -Infinity), -1);
assert.equal(b.lastIndexOf(0x61, Infinity), 0);
assert.equal(b.lastIndexOf(0x0), -1);

// Test weird offset arguments.
// Behaviour should match String.lastIndexOf:
assert.equal(b.lastIndexOf('b', 0), -1);
assert.equal(b.lastIndexOf('b', undefined), 1);
assert.equal(b.lastIndexOf('b', null), -1);
assert.equal(b.lastIndexOf('b', {}), 1);
assert.equal(b.lastIndexOf('b', []), -1);
assert.equal(b.lastIndexOf('b', [2]), 1);

// Test needles longer than the haystack.
assert.strictEqual(b.lastIndexOf('aaaaaaaaaaaaaaa', 'ucs2'), -1);
assert.strictEqual(b.lastIndexOf('aaaaaaaaaaaaaaa', 'utf8'), -1);
assert.strictEqual(b.lastIndexOf('aaaaaaaaaaaaaaa', 'latin1'), -1);
assert.strictEqual(b.lastIndexOf('aaaaaaaaaaaaaaa', 'binary'), -1);
assert.strictEqual(b.lastIndexOf(Buffer.from('aaaaaaaaaaaaaaa')), -1);
assert.strictEqual(b.lastIndexOf('aaaaaaaaaaaaaaa', 2, 'ucs2'), -1);
assert.strictEqual(b.lastIndexOf('aaaaaaaaaaaaaaa', 3, 'utf8'), -1);
assert.strictEqual(b.lastIndexOf('aaaaaaaaaaaaaaa', 5, 'latin1'), -1);
assert.strictEqual(b.lastIndexOf('aaaaaaaaaaaaaaa', 5, 'binary'), -1);
assert.strictEqual(b.lastIndexOf(Buffer.from('aaaaaaaaaaaaaaa'), 7), -1);

// 你好 expands to a total of 6 bytes using UTF-8 and 4 bytes using UTF-16
assert.strictEqual(buf_bc.lastIndexOf('你好', 'ucs2'), -1);
assert.strictEqual(buf_bc.lastIndexOf('你好', 'utf8'), -1);
assert.strictEqual(buf_bc.lastIndexOf('你好', 'latin1'), -1);
assert.strictEqual(buf_bc.lastIndexOf('你好', 'binary'), -1);
assert.strictEqual(buf_bc.lastIndexOf(Buffer.from('你好')), -1);
assert.strictEqual(buf_bc.lastIndexOf('你好', 2, 'ucs2'), -1);
assert.strictEqual(buf_bc.lastIndexOf('你好', 3, 'utf8'), -1);
assert.strictEqual(buf_bc.lastIndexOf('你好', 5, 'latin1'), -1);
assert.strictEqual(buf_bc.lastIndexOf('你好', 5, 'binary'), -1);
assert.strictEqual(buf_bc.lastIndexOf(Buffer.from('你好'), 7), -1);

// Test lastIndexOf on a longer buffer:
var bufferString = new Buffer('a man a plan a canal panama');
assert.equal(15, bufferString.lastIndexOf('canal'));
assert.equal(21, bufferString.lastIndexOf('panama'));
assert.equal(0, bufferString.lastIndexOf('a man a plan a canal panama'));
assert.equal(-1, bufferString.lastIndexOf('a man a plan a canal mexico'));
assert.equal(-1, bufferString.lastIndexOf('a man a plan a canal mexico city'));
assert.equal(-1, bufferString.lastIndexOf(Buffer.from('a'.repeat(1000))));
assert.equal(0, bufferString.lastIndexOf('a man a plan', 4));
assert.equal(13, bufferString.lastIndexOf('a '));
assert.equal(13, bufferString.lastIndexOf('a ', 13));
assert.equal(6, bufferString.lastIndexOf('a ', 12));
assert.equal(0, bufferString.lastIndexOf('a ', 5));
assert.equal(13, bufferString.lastIndexOf('a ', -1));
assert.equal(0, bufferString.lastIndexOf('a ', -27));
assert.equal(-1, bufferString.lastIndexOf('a ', -28));

// Test lastIndexOf for the case that the first character can be found,
// but in a part of the buffer that does not make search to search
// due do length constraints.
var abInUCS2 = Buffer.from('ab', 'ucs2');
assert.strictEqual(-1, Buffer.from('µaaaa¶bbbb', 'latin1').lastIndexOf('µ'));
assert.strictEqual(-1, Buffer.from('µaaaa¶bbbb', 'binary').lastIndexOf('µ'));
assert.strictEqual(-1, Buffer.from('bc').lastIndexOf('ab'));
assert.strictEqual(-1, Buffer.from('abc').lastIndexOf('qa'));
assert.strictEqual(-1, Buffer.from('abcdef').lastIndexOf('qabc'));
assert.strictEqual(-1, Buffer.from('bc').lastIndexOf(Buffer.from('ab')));
assert.strictEqual(-1, Buffer.from('bc', 'ucs2').lastIndexOf('ab', 'ucs2'));
assert.strictEqual(-1, Buffer.from('bc', 'ucs2').lastIndexOf(abInUCS2));

assert.strictEqual(0, Buffer.from('abc').lastIndexOf('ab'));
assert.strictEqual(0, Buffer.from('abc').lastIndexOf('ab', 1));
assert.strictEqual(0, Buffer.from('abc').lastIndexOf('ab', 2));
assert.strictEqual(0, Buffer.from('abc').lastIndexOf('ab', 3));

// The above tests test the LINEAR and SINGLE-CHAR strategies.
// Now, we test the BOYER-MOORE-HORSPOOL strategy.
// Test lastIndexOf on a long buffer w multiple matches:
pattern = 'JABACABADABACABA';
assert.equal(1535, longBufferString.lastIndexOf(pattern));
assert.equal(1535, longBufferString.lastIndexOf(pattern, 1535));
assert.equal(511, longBufferString.lastIndexOf(pattern, 1534));

// Finally, give it a really long input to trigger fallback from BMH to
// regular BOYER-MOORE (which has better worst-case complexity).

// Generate a really long Thue-Morse sequence of 'yolo' and 'swag',
// "yolo swag swag yolo swag yolo yolo swag" ..., goes on for about 5MB.
// This is hard to search because it all looks similar, but never repeats.

// countBits returns the number of bits in the binary representation of n.
function countBits(n) {
  for (var count = 0; n > 0; count++) {
    n = n & (n - 1); // remove top bit
  }
  return count;
}
var parts = [];
for (var i = 0; i < 1000000; i++) {
  parts.push((countBits(i) % 2 === 0) ? 'yolo' : 'swag');
}
var reallyLong = new Buffer(parts.join(' '));
assert.equal('yolo swag swag yolo', reallyLong.slice(0, 19).toString());

// Expensive reverse searches. Stress test lastIndexOf:
pattern = reallyLong.slice(0, 100000);  // First 1/50th of the pattern.
assert.equal(4751360, reallyLong.lastIndexOf(pattern));
assert.equal(3932160, reallyLong.lastIndexOf(pattern, 4000000));
assert.equal(2949120, reallyLong.lastIndexOf(pattern, 3000000));
pattern = reallyLong.slice(100000, 200000);  // Second 1/50th.
assert.equal(4728480, reallyLong.lastIndexOf(pattern));
pattern = reallyLong.slice(0, 1000000);  // First 1/5th.
assert.equal(3932160, reallyLong.lastIndexOf(pattern));
pattern = reallyLong.slice(0, 2000000);  // first 2/5ths.
assert.equal(0, reallyLong.lastIndexOf(pattern));

// test truncation of Number arguments to uint8
{
  var buf = Buffer.from('this is a test');
  assert.strictEqual(buf.indexOf(0x6973), 3);
  assert.strictEqual(buf.indexOf(0x697320), 4);
  assert.strictEqual(buf.indexOf(0x69732069), 2);
  assert.strictEqual(buf.indexOf(0x697374657374), 0);
  assert.strictEqual(buf.indexOf(0x69737374), 0);
  assert.strictEqual(buf.indexOf(0x69737465), 11);
  assert.strictEqual(buf.indexOf(0x69737465), 11);
  assert.strictEqual(buf.indexOf(-140), 0);
  assert.strictEqual(buf.indexOf(-152), 1);
  assert.strictEqual(buf.indexOf(0xff), -1);
  assert.strictEqual(buf.indexOf(0xffff), -1);
}


```

---

### test-buffer-inheritance.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-inheritance.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;

require('./common');
const assert = require('assert');


function T(n) {
  const ui8 = new Uint8Array(n);
  Object.setPrototypeOf(ui8, T.prototype);
  return ui8;
}
Object.setPrototypeOf(T.prototype, Buffer.prototype);
Object.setPrototypeOf(T, Buffer);

T.prototype.sum = function sum() {
  let cntr = 0;
  for (let i = 0; i < this.length; i++)
    cntr += this[i];
  return cntr;
};


const vals = [new T(4), T(4)];

vals.forEach(function(t) {
  assert.strictEqual(t.constructor, T);
  assert.strictEqual(Object.getPrototypeOf(t), T.prototype);
  assert.strictEqual(Object.getPrototypeOf(Object.getPrototypeOf(t)),
                     Buffer.prototype);

  t.fill(5);
  let cntr = 0;
  for (let i = 0; i < t.length; i++)
    cntr += t[i];
  assert.strictEqual(t.length * 5, cntr);

  // Check this does not throw
  t.toString();
});


```

---

### test-buffer-inspect.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-inspect.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';
var Buffer = require('../../').Buffer;

require('./common');
const assert = require('assert');
const util = require('util');
const buffer = require('../../');

var defaultMaxBytes = buffer.INSPECT_MAX_BYTES;
buffer.INSPECT_MAX_BYTES = 2;

let b = Buffer.allocUnsafe(4);
b.fill('1234');

let s = buffer.SlowBuffer(4);
s.fill('1234');

let expected = '<Buffer 31 32 ... >';

assert.strictEqual(util.inspect(b), expected);
assert.strictEqual(util.inspect(s), expected);

b = Buffer.allocUnsafe(2);
b.fill('12');

s = buffer.SlowBuffer(2);
s.fill('12');

expected = '<Buffer 31 32>';

assert.strictEqual(util.inspect(b), expected);
assert.strictEqual(util.inspect(s), expected);

buffer.INSPECT_MAX_BYTES = Infinity;

assert.strictEqual(util.inspect(b), expected);
assert.strictEqual(util.inspect(s), expected);

b.inspect = undefined;
assert.strictEqual(util.inspect(b), expected);

buffer.INSPECT_MAX_BYTES = defaultMaxBytes;

```

---

### test-buffer-isencoding.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-isencoding.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;

require('./common');
const assert = require('assert');

[
  'hex',
  'utf8',
  'utf-8',
  'ascii',
  'latin1',
  'binary',
  'base64',
  'ucs2',
  'ucs-2',
  'utf16le',
  'utf-16le'
].forEach((enc) => {
  assert.strictEqual(Buffer.isEncoding(enc), true);
});

[
  'utf9',
  'utf-7',
  'Unicode-FTW',
  'new gnu gun',
  false,
  NaN,
  {},
  Infinity,
  [],
  1,
  0,
  -1
].forEach((enc) => {
  assert.strictEqual(Buffer.isEncoding(enc), false);
});


```

---

### test-buffer-iterator.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-iterator.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;
require('./common');
const assert = require('assert');

const buffer = Buffer.from([1, 2, 3, 4, 5]);
let arr;
let b;

// buffers should be iterable

arr = [];

for (b of buffer)
  arr.push(b);

assert.deepStrictEqual(arr, [1, 2, 3, 4, 5]);


// buffer iterators should be iterable

arr = [];

for (b of buffer[Symbol.iterator]())
  arr.push(b);

assert.deepStrictEqual(arr, [1, 2, 3, 4, 5]);


// buffer#values() should return iterator for values

arr = [];

for (b of buffer.values())
  arr.push(b);

assert.deepStrictEqual(arr, [1, 2, 3, 4, 5]);


// buffer#keys() should return iterator for keys

arr = [];

for (b of buffer.keys())
  arr.push(b);

assert.deepStrictEqual(arr, [0, 1, 2, 3, 4]);


// buffer#entries() should return iterator for entries

arr = [];

for (b of buffer.entries())
  arr.push(b);

assert.deepStrictEqual(arr, [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5]
]);


```

---

### test-buffer-new.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-new.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;

const common = require('./common');

common.expectsError(() => new Buffer(42, 'utf8'), {
  code: 'ERR_INVALID_ARG_TYPE',
  type: TypeError,
  message: 'The "string" argument must be of type string. Received type number'
});


```

---

### test-buffer-parent-property.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-parent-property.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;

/*
 * Fix for https://github.com/nodejs/node/issues/8266
 *
 * Zero length Buffer objects should expose the `buffer` property of the
 * TypedArrays, via the `parent` property.
 */
require('./common');
const assert = require('assert');

// If the length of the buffer object is zero
assert((new Buffer(0)).parent instanceof ArrayBuffer);

// If the length of the buffer object is equal to the underlying ArrayBuffer
assert((new Buffer(Buffer.poolSize)).parent instanceof ArrayBuffer);

// Same as the previous test, but with user created buffer
const arrayBuffer = new ArrayBuffer(0);
assert.strictEqual(new Buffer(arrayBuffer).parent, arrayBuffer);
assert.strictEqual(new Buffer(arrayBuffer).buffer, arrayBuffer);
assert.strictEqual(Buffer.from(arrayBuffer).parent, arrayBuffer);
assert.strictEqual(Buffer.from(arrayBuffer).buffer, arrayBuffer);


```

---

### test-buffer-prototype-inspect.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-prototype-inspect.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;
require('./common');

// lib/buffer.js defines Buffer.prototype.inspect() to override how buffers are
// presented by util.inspect().

const assert = require('assert');
const util = require('util');

{
  const buf = Buffer.from('fhqwhgads');
  assert.strictEqual(util.inspect(buf), '<Buffer 66 68 71 77 68 67 61 64 73>');
}

{
  const buf = Buffer.from('');
  assert.strictEqual(util.inspect(buf), '<Buffer >');
}

{
  const buf = Buffer.from('x'.repeat(51));
  assert.ok(/^<Buffer (?:78 ){50}\.\.\. >$/.test(util.inspect(buf)));
}


```

---

### test-buffer-safe-unsafe.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-safe-unsafe.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;

require('./common');
const assert = require('assert');

const safe = Buffer.alloc(10);

function isZeroFilled(buf) {
  for (let n = 0; n < buf.length; n++)
    if (buf[n] !== 0) return false;
  return true;
}

assert(isZeroFilled(safe));

// Test that unsafe allocations doesn't affect subsequent safe allocations
Buffer.allocUnsafe(10);
assert(isZeroFilled(new Float64Array(10)));

new Buffer(10);
assert(isZeroFilled(new Float64Array(10)));

Buffer.allocUnsafe(10);
assert(isZeroFilled(Buffer.alloc(10)));


```

---

### test-buffer-slice.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-slice.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
// Copyright Joyent, Inc. and other Node contributors.var Buffer = require('../../').Buffer;
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

require('./common');
const assert = require('assert');

assert.strictEqual(0, Buffer.from('hello', 'utf8').slice(0, 0).length);
assert.strictEqual(0, Buffer('hello', 'utf8').slice(0, 0).length);

const buf = Buffer.from('0123456789', 'utf8');
const expectedSameBufs = [
  [buf.slice(-10, 10), Buffer.from('0123456789', 'utf8')],
  [buf.slice(-20, 10), Buffer.from('0123456789', 'utf8')],
  [buf.slice(-20, -10), Buffer.from('', 'utf8')],
  [buf.slice(), Buffer.from('0123456789', 'utf8')],
  [buf.slice(0), Buffer.from('0123456789', 'utf8')],
  [buf.slice(0, 0), Buffer.from('', 'utf8')],
  [buf.slice(undefined), Buffer.from('0123456789', 'utf8')],
  [buf.slice('foobar'), Buffer.from('0123456789', 'utf8')],
  [buf.slice(undefined, undefined), Buffer.from('0123456789', 'utf8')],
  [buf.slice(2), Buffer.from('23456789', 'utf8')],
  [buf.slice(5), Buffer.from('56789', 'utf8')],
  [buf.slice(10), Buffer.from('', 'utf8')],
  [buf.slice(5, 8), Buffer.from('567', 'utf8')],
  [buf.slice(8, -1), Buffer.from('8', 'utf8')],
  [buf.slice(-10), Buffer.from('0123456789', 'utf8')],
  [buf.slice(0, -9), Buffer.from('0', 'utf8')],
  [buf.slice(0, -10), Buffer.from('', 'utf8')],
  [buf.slice(0, -1), Buffer.from('012345678', 'utf8')],
  [buf.slice(2, -2), Buffer.from('234567', 'utf8')],
  [buf.slice(0, 65536), Buffer.from('0123456789', 'utf8')],
  [buf.slice(65536, 0), Buffer.from('', 'utf8')],
  [buf.slice(-5, -8), Buffer.from('', 'utf8')],
  [buf.slice(-5, -3), Buffer.from('56', 'utf8')],
  [buf.slice(-10, 10), Buffer.from('0123456789', 'utf8')],
  [buf.slice('0', '1'), Buffer.from('0', 'utf8')],
  [buf.slice('-5', '10'), Buffer.from('56789', 'utf8')],
  [buf.slice('-10', '10'), Buffer.from('0123456789', 'utf8')],
  [buf.slice('-10', '-5'), Buffer.from('01234', 'utf8')],
  [buf.slice('-10', '-0'), Buffer.from('', 'utf8')],
  [buf.slice('111'), Buffer.from('', 'utf8')],
  [buf.slice('0', '-111'), Buffer.from('', 'utf8')]
];

for (let i = 0, s = buf.toString(); i < buf.length; ++i) {
  expectedSameBufs.push(
    [buf.slice(i), Buffer.from(s.slice(i))],
    [buf.slice(0, i), Buffer.from(s.slice(0, i))],
    [buf.slice(-i), Buffer.from(s.slice(-i))],
    [buf.slice(0, -i), Buffer.from(s.slice(0, -i))]
  );
}

expectedSameBufs.forEach(([buf1, buf2]) => {
  assert.strictEqual(0, Buffer.compare(buf1, buf2));
});

const utf16Buf = Buffer.from('0123456789', 'utf16le');
assert.deepStrictEqual(utf16Buf.slice(0, 6), Buffer.from('012', 'utf16le'));
// try to slice a zero length Buffer
// see https://github.com/joyent/node/issues/5881
assert.doesNotThrow(() => Buffer.alloc(0).slice(0, 1));
assert.strictEqual(Buffer.alloc(0).slice(0, 1).length, 0);

{
  // Single argument slice
  assert.strictEqual('bcde',
                     Buffer.from('abcde', 'utf8').slice(1).toString('utf8'));
}

// slice(0,0).length === 0
assert.strictEqual(0, Buffer.from('hello', 'utf8').slice(0, 0).length);

{
  // Regression tests for https://github.com/nodejs/node/issues/9096
  const buf = Buffer.from('abcd', 'utf8');
  assert.strictEqual(buf.slice(buf.length / 3).toString('utf8'), 'bcd');
  assert.strictEqual(
    buf.slice(buf.length / 3, buf.length).toString(),
    'bcd'
  );
}

{
  const buf = Buffer.from('abcdefg', 'utf8');
  assert.strictEqual(buf.slice(-(-1 >>> 0) - 1).toString('utf8'),
                     buf.toString('utf8'));
}

{
  const buf = Buffer.from('abc', 'utf8');
  assert.strictEqual(buf.slice(-0.5).toString('utf8'), buf.toString('utf8'));
}

{
  const buf = Buffer.from([
    1, 29, 0, 0, 1, 143, 216, 162, 92, 254, 248, 63, 0,
    0, 0, 18, 184, 6, 0, 175, 29, 0, 8, 11, 1, 0, 0
  ]);
  const chunk1 = Buffer.from([
    1, 29, 0, 0, 1, 143, 216, 162, 92, 254, 248, 63, 0
  ]);
  const chunk2 = Buffer.from([
    0, 0, 18, 184, 6, 0, 175, 29, 0, 8, 11, 1, 0, 0
  ]);
  const middle = buf.length / 2;

  assert.deepStrictEqual(buf.slice(0, middle), chunk1);
  assert.deepStrictEqual(buf.slice(middle), chunk2);
}


```

---

### test-buffer-slow.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-slow.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;

const common = require('./common');
const assert = require('assert');
const buffer = require('../../');
const SlowBuffer = buffer.SlowBuffer;

const ones = [1, 1, 1, 1];

// should create a Buffer
let sb = SlowBuffer(4);
assert(sb instanceof Buffer);
assert.strictEqual(sb.length, 4);
sb.fill(1);
for (const [key, value] of sb.entries()) {
  assert.deepStrictEqual(value, ones[key]);
}

// underlying ArrayBuffer should have the same length
assert.strictEqual(sb.buffer.byteLength, 4);

// should work without new
sb = SlowBuffer(4);
assert(sb instanceof Buffer);
assert.strictEqual(sb.length, 4);
sb.fill(1);
for (const [key, value] of sb.entries()) {
  assert.deepStrictEqual(value, ones[key]);
}

// should work with edge cases
assert.strictEqual(SlowBuffer(0).length, 0);
try {
  assert.strictEqual(
    SlowBuffer(buffer.kMaxLength).length, buffer.kMaxLength);
} catch (e) {
  // Don't match on message as it is from the JavaScript engine. V8 and
  // ChakraCore provide different messages.
  assert.strictEqual(e.name, 'RangeError');
}

// should work with number-coercible values
assert.strictEqual(SlowBuffer('6').length, 6);
assert.strictEqual(SlowBuffer(true).length, 1);

// should create zero-length buffer if parameter is not a number
assert.strictEqual(SlowBuffer().length, 0);
assert.strictEqual(SlowBuffer(NaN).length, 0);
assert.strictEqual(SlowBuffer({}).length, 0);
assert.strictEqual(SlowBuffer('string').length, 0);

// should throw with invalid length
const bufferMaxSizeMsg = common.expectsError({
  code: 'ERR_INVALID_OPT_VALUE',
  type: RangeError,
  message: /^The value "[^"]*" is invalid for option "size"$/
}, 2);
assert.throws(function() {
  SlowBuffer(Infinity);
}, bufferMaxSizeMsg);
common.expectsError(function() {
  SlowBuffer(-1);
}, {
  code: 'ERR_INVALID_OPT_VALUE',
  type: RangeError,
  message: 'The value "-1" is invalid for option "size"'
});

assert.throws(function() {
  SlowBuffer(buffer.kMaxLength + 1);
}, bufferMaxSizeMsg);


```

---

### test-buffer-swap.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-swap.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;

require('./common');
const assert = require('assert');

// Test buffers small enough to use the JS implementation
{
  const buf = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09,
                           0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10]);

  assert.strictEqual(buf, buf.swap16());
  assert.deepStrictEqual(buf, Buffer.from([0x02, 0x01, 0x04, 0x03, 0x06, 0x05,
                                           0x08, 0x07, 0x0a, 0x09, 0x0c, 0x0b,
                                           0x0e, 0x0d, 0x10, 0x0f]));
  buf.swap16(); // restore

  assert.strictEqual(buf, buf.swap32());
  assert.deepStrictEqual(buf, Buffer.from([0x04, 0x03, 0x02, 0x01, 0x08, 0x07,
                                           0x06, 0x05, 0x0c, 0x0b, 0x0a, 0x09,
                                           0x10, 0x0f, 0x0e, 0x0d]));
  buf.swap32(); // restore

  assert.strictEqual(buf, buf.swap64());
  assert.deepStrictEqual(buf, Buffer.from([0x08, 0x07, 0x06, 0x05, 0x04, 0x03,
                                           0x02, 0x01, 0x10, 0x0f, 0x0e, 0x0d,
                                           0x0c, 0x0b, 0x0a, 0x09]));
}

// Operates in-place
{
  const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7]);
  buf.slice(1, 5).swap32();
  assert.deepStrictEqual(buf, Buffer.from([0x1, 0x5, 0x4, 0x3, 0x2, 0x6, 0x7]));
  buf.slice(1, 5).swap16();
  assert.deepStrictEqual(buf, Buffer.from([0x1, 0x4, 0x5, 0x2, 0x3, 0x6, 0x7]));

  // Length assertions
  const re16 = /Buffer size must be a multiple of 16-bits/;
  const re32 = /Buffer size must be a multiple of 32-bits/;
  const re64 = /Buffer size must be a multiple of 64-bits/;

  assert.throws(() => Buffer.from(buf).swap16(), re16);
  assert.throws(() => Buffer.alloc(1025).swap16(), re16);
  assert.throws(() => Buffer.from(buf).swap32(), re32);
  assert.throws(() => buf.slice(1, 3).swap32(), re32);
  assert.throws(() => Buffer.alloc(1025).swap32(), re32);
  assert.throws(() => buf.slice(1, 3).swap64(), re64);
  assert.throws(() => Buffer.alloc(1025).swap64(), re64);
}

{
  const buf = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
                           0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10,
                           0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
                           0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10]);

  buf.slice(2, 18).swap64();

  assert.deepStrictEqual(buf, Buffer.from([0x01, 0x02, 0x0a, 0x09, 0x08, 0x07,
                                           0x06, 0x05, 0x04, 0x03, 0x02, 0x01,
                                           0x10, 0x0f, 0x0e, 0x0d, 0x0c, 0x0b,
                                           0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
                                           0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e,
                                           0x0f, 0x10]));
}

// Force use of native code (Buffer size above threshold limit for js impl)
{
  const bufData = new Uint32Array(256).fill(0x04030201);
  const buf = Buffer.from(bufData.buffer, bufData.byteOffset);
  const otherBufData = new Uint32Array(256).fill(0x03040102);
  const otherBuf = Buffer.from(otherBufData.buffer, otherBufData.byteOffset);
  buf.swap16();
  assert.deepStrictEqual(buf, otherBuf);
}

{
  const bufData = new Uint32Array(256).fill(0x04030201);
  const buf = Buffer.from(bufData.buffer);
  const otherBufData = new Uint32Array(256).fill(0x01020304);
  const otherBuf = Buffer.from(otherBufData.buffer, otherBufData.byteOffset);
  buf.swap32();
  assert.deepStrictEqual(buf, otherBuf);
}

{
  const bufData = new Uint8Array(256 * 8);
  const otherBufData = new Uint8Array(256 * 8);
  for (let i = 0; i < bufData.length; i++) {
    bufData[i] = i % 8;
    otherBufData[otherBufData.length - i - 1] = i % 8;
  }
  const buf = Buffer.from(bufData.buffer, bufData.byteOffset);
  const otherBuf = Buffer.from(otherBufData.buffer, otherBufData.byteOffset);
  buf.swap64();
  assert.deepStrictEqual(buf, otherBuf);
}

// Test native code with buffers that are not memory-aligned
{
  const bufData = new Uint8Array(256 * 8);
  const otherBufData = new Uint8Array(256 * 8 - 2);
  for (let i = 0; i < bufData.length; i++) {
    bufData[i] = i % 2;
  }
  for (let i = 1; i < otherBufData.length; i++) {
    otherBufData[otherBufData.length - i] = (i + 1) % 2;
  }
  const buf = Buffer.from(bufData.buffer, bufData.byteOffset);
  // 0|1 0|1 0|1...
  const otherBuf = Buffer.from(otherBufData.buffer, otherBufData.byteOffset);
  // 0|0 1|0 1|0...

  buf.slice(1, buf.length - 1).swap16();
  assert.deepStrictEqual(buf.slice(0, otherBuf.length), otherBuf);
}

{
  const bufData = new Uint8Array(256 * 8);
  const otherBufData = new Uint8Array(256 * 8 - 4);
  for (let i = 0; i < bufData.length; i++) {
    bufData[i] = i % 4;
  }
  for (let i = 1; i < otherBufData.length; i++) {
    otherBufData[otherBufData.length - i] = (i + 1) % 4;
  }
  const buf = Buffer.from(bufData.buffer, bufData.byteOffset);
  // 0|1 2 3 0|1 2 3...
  const otherBuf = Buffer.from(otherBufData.buffer, otherBufData.byteOffset);
  // 0|0 3 2 1|0 3 2...

  buf.slice(1, buf.length - 3).swap32();
  assert.deepStrictEqual(buf.slice(0, otherBuf.length), otherBuf);
}

{
  const bufData = new Uint8Array(256 * 8);
  const otherBufData = new Uint8Array(256 * 8 - 8);
  for (let i = 0; i < bufData.length; i++) {
    bufData[i] = i % 8;
  }
  for (let i = 1; i < otherBufData.length; i++) {
    otherBufData[otherBufData.length - i] = (i + 1) % 8;
  }
  const buf = Buffer.from(bufData.buffer, bufData.byteOffset);
  // 0|1 2 3 4 5 6 7 0|1 2 3 4...
  const otherBuf = Buffer.from(otherBufData.buffer, otherBufData.byteOffset);
  // 0|0 7 6 5 4 3 2 1|0 7 6 5...

  buf.slice(1, buf.length - 7).swap64();
  assert.deepStrictEqual(buf.slice(0, otherBuf.length), otherBuf);
}


```

---

### test-buffer-tojson.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-tojson.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;

require('./common');
const assert = require('assert');

{
  assert.strictEqual(JSON.stringify(Buffer.alloc(0)),
                     '{"type":"Buffer","data":[]}');
  assert.strictEqual(JSON.stringify(Buffer.from([1, 2, 3, 4])),
                     '{"type":"Buffer","data":[1,2,3,4]}');
}

// issue GH-7849
{
  const buf = Buffer.from('test');
  const json = JSON.stringify(buf);
  const obj = JSON.parse(json);
  const copy = Buffer.from(obj);

  assert.deepStrictEqual(buf, copy);
}

// GH-5110
{
  const buffer = Buffer.from('test');
  const string = JSON.stringify(buffer);

  assert.strictEqual(string, '{"type":"Buffer","data":[116,101,115,116]}');

  function receiver(key, value) {
    return value && value.type === 'Buffer' ? Buffer.from(value.data) : value;
  }

  assert.deepStrictEqual(buffer, JSON.parse(string, receiver));
}


```

---

### test-buffer-tostring.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-tostring.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;

const common = require('./common');
const assert = require('assert');

// utf8, ucs2, ascii, latin1, utf16le
const encodings = ['utf8', 'utf-8', 'ucs2', 'ucs-2', 'ascii', 'latin1',
                   'binary', 'utf16le', 'utf-16le'];

encodings
  .reduce((es, e) => es.concat(e, e.toUpperCase()), [])
  .forEach((encoding) => {
    assert.strictEqual(Buffer.from('foo', encoding).toString(encoding), 'foo');
  });

// base64
['base64', 'BASE64'].forEach((encoding) => {
  assert.strictEqual(Buffer.from('Zm9v', encoding).toString(encoding), 'Zm9v');
});

// hex
['hex', 'HEX'].forEach((encoding) => {
  assert.strictEqual(Buffer.from('666f6f', encoding).toString(encoding),
                     '666f6f');
});

// Invalid encodings
for (let i = 1; i < 10; i++) {
  const encoding = String(i).repeat(i);
  const error = common.expectsError({
    code: 'ERR_UNKNOWN_ENCODING',
    type: TypeError,
    message: `Unknown encoding: ${encoding}`
  });
  assert.ok(!Buffer.isEncoding(encoding));
  assert.throws(() => Buffer.from('foo').toString(encoding), error);
}


```

---

### test-buffer-write.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-write.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;

const common = require('./common');
const assert = require('assert');

const outsideBounds = common.expectsError({
  code: 'ERR_BUFFER_OUT_OF_BOUNDS',
  type: RangeError,
  message: 'Attempt to write outside buffer bounds'
}, 2);

assert.throws(() => Buffer.alloc(9).write('foo', -1), outsideBounds);
assert.throws(() => Buffer.alloc(9).write('foo', 10), outsideBounds);

const resultMap = new Map([
  ['utf8', Buffer.from([102, 111, 111, 0, 0, 0, 0, 0, 0])],
  ['ucs2', Buffer.from([102, 0, 111, 0, 111, 0, 0, 0, 0])],
  ['ascii', Buffer.from([102, 111, 111, 0, 0, 0, 0, 0, 0])],
  ['latin1', Buffer.from([102, 111, 111, 0, 0, 0, 0, 0, 0])],
  ['binary', Buffer.from([102, 111, 111, 0, 0, 0, 0, 0, 0])],
  ['utf16le', Buffer.from([102, 0, 111, 0, 111, 0, 0, 0, 0])],
  ['base64', Buffer.from([102, 111, 111, 0, 0, 0, 0, 0, 0])],
  ['hex', Buffer.from([102, 111, 111, 0, 0, 0, 0, 0, 0])]
]);

// utf8, ucs2, ascii, latin1, utf16le
const encodings = ['utf8', 'utf-8', 'ucs2', 'ucs-2', 'ascii', 'latin1',
                   'binary', 'utf16le', 'utf-16le'];

encodings
  .reduce((es, e) => es.concat(e, e.toUpperCase()), [])
  .forEach((encoding) => {
    const buf = Buffer.alloc(9);
    const len = Buffer.byteLength('foo', encoding);
    assert.strictEqual(buf.write('foo', 0, len, encoding), len);

    if (encoding.includes('-'))
      encoding = encoding.replace('-', '');

    assert.deepStrictEqual(buf, resultMap.get(encoding.toLowerCase()));
  });

// base64
['base64', 'BASE64'].forEach((encoding) => {
  const buf = Buffer.alloc(9);
  const len = Buffer.byteLength('Zm9v', encoding);

  assert.strictEqual(buf.write('Zm9v', 0, len, encoding), len);
  assert.deepStrictEqual(buf, resultMap.get(encoding.toLowerCase()));
});

// hex
['hex', 'HEX'].forEach((encoding) => {
  const buf = Buffer.alloc(9);
  const len = Buffer.byteLength('666f6f', encoding);

  assert.strictEqual(buf.write('666f6f', 0, len, encoding), len);
  assert.deepStrictEqual(buf, resultMap.get(encoding.toLowerCase()));
});

// Invalid encodings
for (let i = 1; i < 10; i++) {
  const encoding = String(i).repeat(i);
  const error = common.expectsError({
    code: 'ERR_UNKNOWN_ENCODING',
    type: TypeError,
    message: `Unknown encoding: ${encoding}`
  });

  assert.ok(!Buffer.isEncoding(encoding));
  assert.throws(() => Buffer.alloc(9).write('foo', encoding), error);
}


```

---

### test-buffer-zero-fill-cli.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-zero-fill-cli.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;
// Flags: --zero-fill-buffers

// when using --zero-fill-buffers, every Buffer and SlowBuffer
// instance must be zero filled upon creation

require('./common');
const SlowBuffer = require('../../').SlowBuffer;
const assert = require('assert');

function isZeroFilled(buf) {
  for (let n = 0; n < buf.length; n++)
    if (buf[n] > 0) return false;
  return true;
}

// This can be somewhat unreliable because the
// allocated memory might just already happen to
// contain all zeroes. The test is run multiple
// times to improve the reliability.
for (let i = 0; i < 50; i++) {
  const bufs = [
    Buffer.alloc(20),
    Buffer.allocUnsafe(20),
    SlowBuffer(20),
    Buffer(20),
    new SlowBuffer(20)
  ];
  for (const buf of bufs) {
    assert(isZeroFilled(buf));
  }
}


```

---

### test-buffer-zero-fill-reset.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-zero-fill-reset.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;

require('./common');
const assert = require('assert');


function testUint8Array(ui) {
  const length = ui.length;
  for (let i = 0; i < length; i++)
    if (ui[i] !== 0) return false;
  return true;
}


for (let i = 0; i < 100; i++) {
  Buffer.alloc(0);
  const ui = new Uint8Array(65);
  assert.ok(testUint8Array(ui), `Uint8Array is not zero-filled: ${ui}`);
}


```

---

### test-buffer-zero-fill.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer-zero-fill.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;

require('./common');
const assert = require('assert');

const buf1 = Buffer(100);
const buf2 = new Buffer(100);

for (let n = 0; n < buf1.length; n++)
  assert.strictEqual(buf1[n], 0);

for (let n = 0; n < buf2.length; n++)
  assert.strictEqual(buf2[n], 0);


```

---

### test-buffer.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/node/test-buffer.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
'use strict';
var Buffer = require('../../').Buffer;

var common = { skip: function () {} };
var assert = require('assert');

var Buffer = require('../../').Buffer;
var SlowBuffer = require('../../').SlowBuffer;

// counter to ensure unique value is always copied
var cntr = 0;

var b = Buffer(1024); // safe constructor

// console.log('b.length == %d', b.length);
assert.strictEqual(1024, b.length);

b[0] = -1;
assert.strictEqual(b[0], 255);

for (var i = 0; i < 1024; i++) {
  b[i] = i % 256;
}

for (var i = 0; i < 1024; i++) {
  assert.strictEqual(i % 256, b[i]);
}

var c = Buffer(512);
// console.log('c.length == %d', c.length);
assert.strictEqual(512, c.length);

var d = new Buffer([]);
assert.strictEqual(0, d.length);

var ui32 = new Uint32Array(4).fill(42);
var e = Buffer(ui32);
for (var [key, value] of e.entries()) {
  assert.deepStrictEqual(value, ui32[key]);
}

// First check Buffer#fill() works as expected.

assert.throws(function() {
  Buffer(8).fill('a', -1);
});

assert.throws(function() {
  Buffer(8).fill('a', 0, 9);
});

// Make sure this doesn't hang indefinitely.
Buffer(8).fill('');

{
  var buf = new Buffer(64);
  buf.fill(10);
  for (var i = 0; i < buf.length; i++)
    assert.equal(buf[i], 10);

  buf.fill(11, 0, buf.length >> 1);
  for (var i = 0; i < buf.length >> 1; i++)
    assert.equal(buf[i], 11);
  for (var i = (buf.length >> 1) + 1; i < buf.length; i++)
    assert.equal(buf[i], 10);

  buf.fill('h');
  for (var i = 0; i < buf.length; i++)
    assert.equal('h'.charCodeAt(0), buf[i]);

  buf.fill(0);
  for (var i = 0; i < buf.length; i++)
    assert.equal(0, buf[i]);

  buf.fill(null);
  for (var i = 0; i < buf.length; i++)
    assert.equal(0, buf[i]);

  buf.fill(1, 16, 32);
  for (var i = 0; i < 16; i++)
    assert.equal(0, buf[i]);
  for (var i = 16; i < 32; i++)
    assert.equal(1, buf[i]);
  for (var i = 32; i < buf.length; i++)
    assert.equal(0, buf[i]);
}

{
  var buf = new Buffer(10);
  buf.fill('abc');
  assert.equal(buf.toString(), 'abcabcabca');
  buf.fill('է');
  assert.equal(buf.toString(), 'էէէէէ');
}

{
  // copy 512 bytes, from 0 to 512.
  b.fill(++cntr);
  c.fill(++cntr);
  var copied = b.copy(c, 0, 0, 512);
//   console.log('copied %d bytes from b into c', copied);
  assert.strictEqual(512, copied);
  for (var i = 0; i < c.length; i++) {
    assert.strictEqual(b[i], c[i]);
  }
}

{
  // copy c into b, without specifying sourceEnd
  b.fill(++cntr);
  c.fill(++cntr);
  var copied = c.copy(b, 0, 0);
//   console.log('copied %d bytes from c into b w/o sourceEnd', copied);
  assert.strictEqual(c.length, copied);
  for (var i = 0; i < c.length; i++) {
    assert.strictEqual(c[i], b[i]);
  }
}

{
  // copy c into b, without specifying sourceStart
  b.fill(++cntr);
  c.fill(++cntr);
  var copied = c.copy(b, 0);
//   console.log('copied %d bytes from c into b w/o sourceStart', copied);
  assert.strictEqual(c.length, copied);
  for (var i = 0; i < c.length; i++) {
    assert.strictEqual(c[i], b[i]);
  }
}

{
  // copy longer buffer b to shorter c without targetStart
  b.fill(++cntr);
  c.fill(++cntr);
  var copied = b.copy(c);
//   console.log('copied %d bytes from b into c w/o targetStart', copied);
  assert.strictEqual(c.length, copied);
  for (var i = 0; i < c.length; i++) {
    assert.strictEqual(b[i], c[i]);
  }
}

{
  // copy starting near end of b to c
  b.fill(++cntr);
  c.fill(++cntr);
  var copied = b.copy(c, 0, b.length - Math.floor(c.length / 2));
//   console.log('copied %d bytes from end of b into beginning of c', copied);
  assert.strictEqual(Math.floor(c.length / 2), copied);
  for (var i = 0; i < Math.floor(c.length / 2); i++) {
    assert.strictEqual(b[b.length - Math.floor(c.length / 2) + i], c[i]);
  }
  for (var i = Math.floor(c.length / 2) + 1; i < c.length; i++) {
    assert.strictEqual(c[c.length - 1], c[i]);
  }
}

{
  // try to copy 513 bytes, and check we don't overrun c
  b.fill(++cntr);
  c.fill(++cntr);
  var copied = b.copy(c, 0, 0, 513);
//   console.log('copied %d bytes from b trying to overrun c', copied);
  assert.strictEqual(c.length, copied);
  for (var i = 0; i < c.length; i++) {
    assert.strictEqual(b[i], c[i]);
  }
}

{
  // copy 768 bytes from b into b
  b.fill(++cntr);
  b.fill(++cntr, 256);
  var copied = b.copy(b, 0, 256, 1024);
//   console.log('copied %d bytes from b into b', copied);
  assert.strictEqual(768, copied);
  for (var i = 0; i < b.length; i++) {
    assert.strictEqual(cntr, b[i]);
  }
}

// copy string longer than buffer length (failure will segfault)
var bb = Buffer(10);
bb.fill('hello crazy world');


// try to copy from before the beginning of b
assert.doesNotThrow(() => { b.copy(c, 0, 100, 10); });

// copy throws at negative sourceStart
assert.throws(function() {
  Buffer(5).copy(Buffer(5), 0, -1);
}, RangeError);

{
  // check sourceEnd resets to targetEnd if former is greater than the latter
  b.fill(++cntr);
  c.fill(++cntr);
  var copied = b.copy(c, 0, 0, 1025);
//   console.log('copied %d bytes from b into c', copied);
  for (var i = 0; i < c.length; i++) {
    assert.strictEqual(b[i], c[i]);
  }
}

// throw with negative sourceEnd
// console.log('test copy at negative sourceEnd');
assert.throws(function() {
  b.copy(c, 0, 0, -1);
}, RangeError);

// when sourceStart is greater than sourceEnd, zero copied
assert.equal(b.copy(c, 0, 100, 10), 0);

// when targetStart > targetLength, zero copied
assert.equal(b.copy(c, 512, 0, 10), 0);

var caught_error;

// invalid encoding for Buffer.toString
caught_error = null;
try {
  b.toString('invalid');
} catch (err) {
  caught_error = err;
}
assert.strictEqual('Unknown encoding: invalid', caught_error.message);

// invalid encoding for Buffer.write
caught_error = null;
try {
  b.write('test string', 0, 5, 'invalid');
} catch (err) {
  caught_error = err;
}
assert.strictEqual('Unknown encoding: invalid', caught_error.message);

// try to create 0-length buffers
new Buffer('');
new Buffer('', 'ascii');
new Buffer('', 'latin1');
new Buffer('', 'binary');
Buffer(0);

// try to write a 0-length string beyond the end of b
assert.throws(function() {
  b.write('', 2048);
}, RangeError);

// throw when writing to negative offset
assert.throws(function() {
  b.write('a', -1);
}, RangeError);

// throw when writing past bounds from the pool
assert.throws(function() {
  b.write('a', 2048);
}, RangeError);

// throw when writing to negative offset
assert.throws(function() {
  b.write('a', -1);
}, RangeError);

// try to copy 0 bytes worth of data into an empty buffer
b.copy(Buffer(0), 0, 0, 0);

// try to copy 0 bytes past the end of the target buffer
b.copy(Buffer(0), 1, 1, 1);
b.copy(Buffer(1), 1, 1, 1);

// try to copy 0 bytes from past the end of the source buffer
b.copy(Buffer(1), 0, 2048, 2048);

var rangeBuffer = new Buffer('abc');

// if start >= buffer's length, empty string will be returned
assert.equal(rangeBuffer.toString('ascii', 3), '');
assert.equal(rangeBuffer.toString('ascii', +Infinity), '');
assert.equal(rangeBuffer.toString('ascii', 3.14, 3), '');
assert.equal(rangeBuffer.toString('ascii', 'Infinity', 3), '');

// if end <= 0, empty string will be returned
assert.equal(rangeBuffer.toString('ascii', 1, 0), '');
assert.equal(rangeBuffer.toString('ascii', 1, -1.2), '');
assert.equal(rangeBuffer.toString('ascii', 1, -100), '');
assert.equal(rangeBuffer.toString('ascii', 1, -Infinity), '');

// if start < 0, start will be taken as zero
assert.equal(rangeBuffer.toString('ascii', -1, 3), 'abc');
assert.equal(rangeBuffer.toString('ascii', -1.99, 3), 'abc');
assert.equal(rangeBuffer.toString('ascii', -Infinity, 3), 'abc');
assert.equal(rangeBuffer.toString('ascii', '-1', 3), 'abc');
assert.equal(rangeBuffer.toString('ascii', '-1.99', 3), 'abc');
assert.equal(rangeBuffer.toString('ascii', '-Infinity', 3), 'abc');

// if start is an invalid integer, start will be taken as zero
assert.equal(rangeBuffer.toString('ascii', 'node.js', 3), 'abc');
assert.equal(rangeBuffer.toString('ascii', {}, 3), 'abc');
assert.equal(rangeBuffer.toString('ascii', [], 3), 'abc');
assert.equal(rangeBuffer.toString('ascii', NaN, 3), 'abc');
assert.equal(rangeBuffer.toString('ascii', null, 3), 'abc');
assert.equal(rangeBuffer.toString('ascii', undefined, 3), 'abc');
assert.equal(rangeBuffer.toString('ascii', false, 3), 'abc');
assert.equal(rangeBuffer.toString('ascii', '', 3), 'abc');

// but, if start is an integer when coerced, then it will be coerced and used.
assert.equal(rangeBuffer.toString('ascii', '-1', 3), 'abc');
assert.equal(rangeBuffer.toString('ascii', '1', 3), 'bc');
assert.equal(rangeBuffer.toString('ascii', '-Infinity', 3), 'abc');
assert.equal(rangeBuffer.toString('ascii', '3', 3), '');
assert.equal(rangeBuffer.toString('ascii', Number(3), 3), '');
assert.equal(rangeBuffer.toString('ascii', '3.14', 3), '');
assert.equal(rangeBuffer.toString('ascii', '1.99', 3), 'bc');
assert.equal(rangeBuffer.toString('ascii', '-1.99', 3), 'abc');
assert.equal(rangeBuffer.toString('ascii', 1.99, 3), 'bc');
assert.equal(rangeBuffer.toString('ascii', true, 3), 'bc');

// if end > buffer's length, end will be taken as buffer's length
assert.equal(rangeBuffer.toString('ascii', 0, 5), 'abc');
assert.equal(rangeBuffer.toString('ascii', 0, 6.99), 'abc');
assert.equal(rangeBuffer.toString('ascii', 0, Infinity), 'abc');
assert.equal(rangeBuffer.toString('ascii', 0, '5'), 'abc');
assert.equal(rangeBuffer.toString('ascii', 0, '6.99'), 'abc');
assert.equal(rangeBuffer.toString('ascii', 0, 'Infinity'), 'abc');

// if end is an invalid integer, end will be taken as buffer's length
assert.equal(rangeBuffer.toString('ascii', 0, 'node.js'), '');
assert.equal(rangeBuffer.toString('ascii', 0, {}), '');
assert.equal(rangeBuffer.toString('ascii', 0, NaN), '');
assert.equal(rangeBuffer.toString('ascii', 0, undefined), 'abc');
assert.equal(rangeBuffer.toString('ascii', 0), 'abc');
assert.equal(rangeBuffer.toString('ascii', 0, null), '');
assert.equal(rangeBuffer.toString('ascii', 0, []), '');
assert.equal(rangeBuffer.toString('ascii', 0, false), '');
assert.equal(rangeBuffer.toString('ascii', 0, ''), '');

// but, if end is an integer when coerced, then it will be coerced and used.
assert.equal(rangeBuffer.toString('ascii', 0, '-1'), '');
assert.equal(rangeBuffer.toString('ascii', 0, '1'), 'a');
assert.equal(rangeBuffer.toString('ascii', 0, '-Infinity'), '');
assert.equal(rangeBuffer.toString('ascii', 0, '3'), 'abc');
assert.equal(rangeBuffer.toString('ascii', 0, Number(3)), 'abc');
assert.equal(rangeBuffer.toString('ascii', 0, '3.14'), 'abc');
assert.equal(rangeBuffer.toString('ascii', 0, '1.99'), 'a');
assert.equal(rangeBuffer.toString('ascii', 0, '-1.99'), '');
assert.equal(rangeBuffer.toString('ascii', 0, 1.99), 'a');
assert.equal(rangeBuffer.toString('ascii', 0, true), 'a');

// try toString() with a object as a encoding
assert.equal(rangeBuffer.toString({toString: function() {
  return 'ascii';
}}), 'abc');

// testing for smart defaults and ability to pass string values as offset
var writeTest = new Buffer('abcdes');
writeTest.write('n', 'ascii');
writeTest.write('o', '1', 'ascii');
writeTest.write('d', '2', 'ascii');
writeTest.write('e', 3, 'ascii');
writeTest.write('j', 4, 'ascii');
assert.equal(writeTest.toString(), 'nodejs');

// ASCII slice test
{
  var asciiString = 'hello world';

  for (var i = 0; i < asciiString.length; i++) {
    b[i] = asciiString.charCodeAt(i);
  }
  var asciiSlice = b.toString('ascii', 0, asciiString.length);
  assert.equal(asciiString, asciiSlice);
}

{
  var asciiString = 'hello world';
  var offset = 100;

  var written = b.write(asciiString, offset, 'ascii');
  assert.equal(asciiString.length, written);
  var asciiSlice = b.toString('ascii', offset, offset + asciiString.length);
  assert.equal(asciiString, asciiSlice);
}

{
  var asciiString = 'hello world';
  var offset = 100;

  var sliceA = b.slice(offset, offset + asciiString.length);
  var sliceB = b.slice(offset, offset + asciiString.length);
  for (var i = 0; i < asciiString.length; i++) {
    assert.equal(sliceA[i], sliceB[i]);
  }
}

// UTF-8 slice test

var utf8String = '¡hέlló wôrld!';
var offset = 100;

b.write(utf8String, 0, Buffer.byteLength(utf8String), 'utf8');
var utf8Slice = b.toString('utf8', 0, Buffer.byteLength(utf8String));
assert.equal(utf8String, utf8Slice);

var written = b.write(utf8String, offset, 'utf8');
assert.equal(Buffer.byteLength(utf8String), written);
utf8Slice = b.toString('utf8', offset, offset + Buffer.byteLength(utf8String));
assert.equal(utf8String, utf8Slice);

var sliceA = b.slice(offset, offset + Buffer.byteLength(utf8String));
var sliceB = b.slice(offset, offset + Buffer.byteLength(utf8String));
for (var i = 0; i < Buffer.byteLength(utf8String); i++) {
  assert.equal(sliceA[i], sliceB[i]);
}

{
  var slice = b.slice(100, 150);
  assert.equal(50, slice.length);
  for (var i = 0; i < 50; i++) {
    assert.equal(b[100 + i], slice[i]);
  }
}

{
  // make sure only top level parent propagates from allocPool
  var b = new Buffer(5);
  var c = b.slice(0, 4);
  var d = c.slice(0, 2);
  assert.equal(b.parent, c.parent);
  assert.equal(b.parent, d.parent);
}

{
  // also from a non-pooled instance
  var b = new SlowBuffer(5);
  var c = b.slice(0, 4);
  var d = c.slice(0, 2);
  assert.equal(c.parent, d.parent);
}

{
  // Bug regression test
  var testValue = '\u00F6\u65E5\u672C\u8A9E'; // ö日本語
  var buffer = new Buffer(32);
  var size = buffer.write(testValue, 0, 'utf8');
//   console.log('bytes written to buffer: ' + size);
  var slice = buffer.toString('utf8', 0, size);
  assert.equal(slice, testValue);
}

{
  // Test triple  slice
  var a = new Buffer(8);
  for (var i = 0; i < 8; i++) a[i] = i;
  var b = a.slice(4, 8);
  assert.equal(4, b[0]);
  assert.equal(5, b[1]);
  assert.equal(6, b[2]);
  assert.equal(7, b[3]);
  var c = b.slice(2, 4);
  assert.equal(6, c[0]);
  assert.equal(7, c[1]);
}

{
  var d = new Buffer([23, 42, 255]);
  assert.equal(d.length, 3);
  assert.equal(d[0], 23);
  assert.equal(d[1], 42);
  assert.equal(d[2], 255);
  assert.deepStrictEqual(d, new Buffer(d));
}

{
  var e = new Buffer('über');
//   console.error('uber: \'%s\'', e.toString());
  assert.deepStrictEqual(e, new Buffer([195, 188, 98, 101, 114]));
}

{
  var f = new Buffer('über', 'ascii');
//   console.error('f.length: %d     (should be 4)', f.length);
  assert.deepStrictEqual(f, new Buffer([252, 98, 101, 114]));
}

['ucs2', 'ucs-2', 'utf16le', 'utf-16le'].forEach(function(encoding) {
  {
    var f = new Buffer('über', encoding);
//     console.error('f.length: %d     (should be 8)', f.length);
    assert.deepStrictEqual(f, new Buffer([252, 0, 98, 0, 101, 0, 114, 0]));
  }

  {
    var f = new Buffer('привет', encoding);
//     console.error('f.length: %d     (should be 12)', f.length);
    var expected = new Buffer([63, 4, 64, 4, 56, 4, 50, 4, 53, 4, 66, 4]);
    assert.deepStrictEqual(f, expected);
    assert.equal(f.toString(encoding), 'привет');
  }

  {
    var f = new Buffer([0, 0, 0, 0, 0]);
    assert.equal(f.length, 5);
    var size = f.write('あいうえお', encoding);
//     console.error('bytes written to buffer: %d     (should be 4)', size);
    assert.equal(size, 4);
    assert.deepStrictEqual(f, new Buffer([0x42, 0x30, 0x44, 0x30, 0x00]));
  }
});

{
  var f = new Buffer('\uD83D\uDC4D', 'utf-16le'); // THUMBS UP SIGN (U+1F44D)
  assert.equal(f.length, 4);
  assert.deepStrictEqual(f, new Buffer('3DD84DDC', 'hex'));
}


var arrayIsh = {0: 0, 1: 1, 2: 2, 3: 3, length: 4};
var g = new Buffer(arrayIsh);
assert.deepStrictEqual(g, new Buffer([0, 1, 2, 3]));
var strArrayIsh = {0: '0', 1: '1', 2: '2', 3: '3', length: 4};
g = new Buffer(strArrayIsh);
assert.deepStrictEqual(g, new Buffer([0, 1, 2, 3]));


//
// Test toString('base64')
//
assert.equal('TWFu', (new Buffer('Man')).toString('base64'));

{
  // test that regular and URL-safe base64 both work
  var expected = [0xff, 0xff, 0xbe, 0xff, 0xef, 0xbf, 0xfb, 0xef, 0xff];
  assert.deepStrictEqual(Buffer('//++/++/++//', 'base64'), Buffer(expected));
  assert.deepStrictEqual(Buffer('__--_--_--__', 'base64'), Buffer(expected));
}

{
  // big example
  var quote = 'Man is distinguished, not only by his reason, but by this ' +
                'singular passion from other animals, which is a lust ' +
                'of the mind, that by a perseverance of delight in the ' +
                'continued and indefatigable generation of knowledge, ' +
                'exceeds the short vehemence of any carnal pleasure.';
  var expected = 'TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb' +
                   '24sIGJ1dCBieSB0aGlzIHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlci' +
                   'BhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQsIHRoYXQ' +
                   'gYnkgYSBwZXJzZXZlcmFuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGlu' +
                   'dWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYXRpb24gb2Yga25vd2xlZ' +
                   'GdlLCBleGNlZWRzIHRoZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm' +
                   '5hbCBwbGVhc3VyZS4=';
  assert.equal(expected, (new Buffer(quote)).toString('base64'));

  var b = new Buffer(1024);
  var bytesWritten = b.write(expected, 0, 'base64');
  assert.equal(quote.length, bytesWritten);
  assert.equal(quote, b.toString('ascii', 0, quote.length));

  // check that the base64 decoder ignores whitespace
  var expectedWhite = expected.slice(0, 60) + ' \n' +
                        expected.slice(60, 120) + ' \n' +
                        expected.slice(120, 180) + ' \n' +
                        expected.slice(180, 240) + ' \n' +
                        expected.slice(240, 300) + '\n' +
                        expected.slice(300, 360) + '\n';
  b = new Buffer(1024);
  bytesWritten = b.write(expectedWhite, 0, 'base64');
  assert.equal(quote.length, bytesWritten);
  assert.equal(quote, b.toString('ascii', 0, quote.length));

  // check that the base64 decoder on the constructor works
  // even in the presence of whitespace.
  b = new Buffer(expectedWhite, 'base64');
  assert.equal(quote.length, b.length);
  assert.equal(quote, b.toString('ascii', 0, quote.length));

  // check that the base64 decoder ignores illegal chars
  var expectedIllegal = expected.slice(0, 60) + ' \x80' +
                          expected.slice(60, 120) + ' \xff' +
                          expected.slice(120, 180) + ' \x00' +
                          expected.slice(180, 240) + ' \x98' +
                          expected.slice(240, 300) + '\x03' +
                          expected.slice(300, 360);
  b = new Buffer(expectedIllegal, 'base64');
  assert.equal(quote.length, b.length);
  assert.equal(quote, b.toString('ascii', 0, quote.length));
}

assert.equal(new Buffer('', 'base64').toString(), '');
assert.equal(new Buffer('K', 'base64').toString(), '');

// multiple-of-4 with padding
assert.equal(new Buffer('Kg==', 'base64').toString(), '*');
assert.equal(new Buffer('Kio=', 'base64').toString(), '**');
assert.equal(new Buffer('Kioq', 'base64').toString(), '***');
assert.equal(new Buffer('KioqKg==', 'base64').toString(), '****');
assert.equal(new Buffer('KioqKio=', 'base64').toString(), '*****');
assert.equal(new Buffer('KioqKioq', 'base64').toString(), '******');
assert.equal(new Buffer('KioqKioqKg==', 'base64').toString(), '*******');
assert.equal(new Buffer('KioqKioqKio=', 'base64').toString(), '********');
assert.equal(new Buffer('KioqKioqKioq', 'base64').toString(), '*********');
assert.equal(new Buffer('KioqKioqKioqKg==', 'base64').toString(),
             '**********');
assert.equal(new Buffer('KioqKioqKioqKio=', 'base64').toString(),
             '***********');
assert.equal(new Buffer('KioqKioqKioqKioq', 'base64').toString(),
             '************');
assert.equal(new Buffer('KioqKioqKioqKioqKg==', 'base64').toString(),
             '*************');
assert.equal(new Buffer('KioqKioqKioqKioqKio=', 'base64').toString(),
             '**************');
assert.equal(new Buffer('KioqKioqKioqKioqKioq', 'base64').toString(),
             '***************');
assert.equal(new Buffer('KioqKioqKioqKioqKioqKg==', 'base64').toString(),
             '****************');
assert.equal(new Buffer('KioqKioqKioqKioqKioqKio=', 'base64').toString(),
             '*****************');
assert.equal(new Buffer('KioqKioqKioqKioqKioqKioq', 'base64').toString(),
             '******************');
assert.equal(new Buffer('KioqKioqKioqKioqKioqKioqKg==', 'base64').toString(),
             '*******************');
assert.equal(new Buffer('KioqKioqKioqKioqKioqKioqKio=', 'base64').toString(),
             '********************');

// no padding, not a multiple of 4
assert.equal(new Buffer('Kg', 'base64').toString(), '*');
assert.equal(new Buffer('Kio', 'base64').toString(), '**');
assert.equal(new Buffer('KioqKg', 'base64').toString(), '****');
assert.equal(new Buffer('KioqKio', 'base64').toString(), '*****');
assert.equal(new Buffer('KioqKioqKg', 'base64').toString(), '*******');
assert.equal(new Buffer('KioqKioqKio', 'base64').toString(), '********');
assert.equal(new Buffer('KioqKioqKioqKg', 'base64').toString(), '**********');
assert.equal(new Buffer('KioqKioqKioqKio', 'base64').toString(), '***********');
assert.equal(new Buffer('KioqKioqKioqKioqKg', 'base64').toString(),
             '*************');
assert.equal(new Buffer('KioqKioqKioqKioqKio', 'base64').toString(),
             '**************');
assert.equal(new Buffer('KioqKioqKioqKioqKioqKg', 'base64').toString(),
             '****************');
assert.equal(new Buffer('KioqKioqKioqKioqKioqKio', 'base64').toString(),
             '*****************');
assert.equal(new Buffer('KioqKioqKioqKioqKioqKioqKg', 'base64').toString(),
             '*******************');
assert.equal(new Buffer('KioqKioqKioqKioqKioqKioqKio', 'base64').toString(),
             '********************');

// handle padding graciously, multiple-of-4 or not
assert.equal(
  new Buffer('72INjkR5fchcxk9+VgdGPFJDxUBFR5/rMFsghgxADiw==', 'base64').length,
  32
);
assert.equal(
  new Buffer('72INjkR5fchcxk9+VgdGPFJDxUBFR5/rMFsghgxADiw=', 'base64').length,
  32
);
assert.equal(
  new Buffer('72INjkR5fchcxk9+VgdGPFJDxUBFR5/rMFsghgxADiw', 'base64').length,
  32
);
assert.equal(
  new Buffer('w69jACy6BgZmaFvv96HG6MYksWytuZu3T1FvGnulPg==', 'base64').length,
  31
);
assert.equal(
  new Buffer('w69jACy6BgZmaFvv96HG6MYksWytuZu3T1FvGnulPg=', 'base64').length,
  31
);
assert.equal(
  new Buffer('w69jACy6BgZmaFvv96HG6MYksWytuZu3T1FvGnulPg', 'base64').length,
  31
);

// This string encodes single '.' character in UTF-16
var dot = new Buffer('//4uAA==', 'base64');
assert.equal(dot[0], 0xff);
assert.equal(dot[1], 0xfe);
assert.equal(dot[2], 0x2e);
assert.equal(dot[3], 0x00);
assert.equal(dot.toString('base64'), '//4uAA==');

{
  // Writing base64 at a position > 0 should not mangle the result.
  //
  // https://github.com/joyent/node/issues/402
  var segments = ['TWFkbmVzcz8h', 'IFRoaXM=', 'IGlz', 'IG5vZGUuanMh'];
  var b = new Buffer(64);
  var pos = 0;

  for (var i = 0; i < segments.length; ++i) {
    pos += b.write(segments[i], pos, 'base64');
  }
  assert.equal(b.toString('latin1', 0, pos), 'Madness?! This is node.js!');
  assert.equal(b.toString('binary', 0, pos), 'Madness?! This is node.js!');
}

// Regression test for https://github.com/nodejs/node/issues/3496.
// assert.equal(Buffer('=bad'.repeat(1e4), 'base64').length, 0);

{
  // Creating buffers larger than pool size.
  var l = Buffer.poolSize + 5;
  var s = 'h'.repeat(l);

  var b = new Buffer(s);

  for (var i = 0; i < l; i++) {
    assert.equal('h'.charCodeAt(0), b[i]);
  }

  var sb = b.toString();
  assert.equal(sb.length, s.length);
  assert.equal(sb, s);
}

{
  // Single argument slice
  var b = new Buffer('abcde');
  assert.equal('bcde', b.slice(1).toString());
}

// slice(0,0).length === 0
assert.equal(0, Buffer('hello').slice(0, 0).length);

// test hex toString
// console.log('Create hex string from buffer');
var hexb = new Buffer(256);
for (var i = 0; i < 256; i++) {
  hexb[i] = i;
}
var hexStr = hexb.toString('hex');
assert.equal(hexStr,
             '000102030405060708090a0b0c0d0e0f' +
             '101112131415161718191a1b1c1d1e1f' +
             '202122232425262728292a2b2c2d2e2f' +
             '303132333435363738393a3b3c3d3e3f' +
             '404142434445464748494a4b4c4d4e4f' +
             '505152535455565758595a5b5c5d5e5f' +
             '606162636465666768696a6b6c6d6e6f' +
             '707172737475767778797a7b7c7d7e7f' +
             '808182838485868788898a8b8c8d8e8f' +
             '909192939495969798999a9b9c9d9e9f' +
             'a0a1a2a3a4a5a6a7a8a9aaabacadaeaf' +
             'b0b1b2b3b4b5b6b7b8b9babbbcbdbebf' +
             'c0c1c2c3c4c5c6c7c8c9cacbcccdcecf' +
             'd0d1d2d3d4d5d6d7d8d9dadbdcdddedf' +
             'e0e1e2e3e4e5e6e7e8e9eaebecedeeef' +
             'f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff');

// console.log('Create buffer from hex string');
var hexb2 = new Buffer(hexStr, 'hex');
for (var i = 0; i < 256; i++) {
  assert.equal(hexb2[i], hexb[i]);
}

// Test single base64 char encodes as 0
// assert.strictEqual(Buffer.from('A', 'base64').length, 0);

{
  // test an invalid slice end.
//   console.log('Try to slice off the end of the buffer');
  var b = new Buffer([1, 2, 3, 4, 5]);
  var b2 = b.toString('hex', 1, 10000);
  var b3 = b.toString('hex', 1, 5);
  var b4 = b.toString('hex', 1);
  assert.equal(b2, b3);
  assert.equal(b2, b4);
}

function buildBuffer(data) {
  if (Array.isArray(data)) {
    var buffer = Buffer(data.length);
    data.forEach(function(v, k) {
      buffer[k] = v;
    });
    return buffer;
  }
  return null;
}

var x = buildBuffer([0x81, 0xa3, 0x66, 0x6f, 0x6f, 0xa3, 0x62, 0x61, 0x72]);

// console.log(x.inspect());
assert.equal('<Buffer 81 a3 66 6f 6f a3 62 61 72>', x.inspect());

{
  var z = x.slice(4);
//   console.log(z.inspect());
//   console.log(z.length);
  assert.equal(5, z.length);
  assert.equal(0x6f, z[0]);
  assert.equal(0xa3, z[1]);
  assert.equal(0x62, z[2]);
  assert.equal(0x61, z[3]);
  assert.equal(0x72, z[4]);
}

{
  var z = x.slice(0);
//   console.log(z.inspect());
//   console.log(z.length);
  assert.equal(z.length, x.length);
}

{
  var z = x.slice(0, 4);
//   console.log(z.inspect());
//   console.log(z.length);
  assert.equal(4, z.length);
  assert.equal(0x81, z[0]);
  assert.equal(0xa3, z[1]);
}

{
  var z = x.slice(0, 9);
//   console.log(z.inspect());
//   console.log(z.length);
  assert.equal(9, z.length);
}

{
  var z = x.slice(1, 4);
//   console.log(z.inspect());
//   console.log(z.length);
  assert.equal(3, z.length);
  assert.equal(0xa3, z[0]);
}

{
  var z = x.slice(2, 4);
//   console.log(z.inspect());
//   console.log(z.length);
  assert.equal(2, z.length);
  assert.equal(0x66, z[0]);
  assert.equal(0x6f, z[1]);
}

assert.equal(0, Buffer('hello').slice(0, 0).length);

['ucs2', 'ucs-2', 'utf16le', 'utf-16le'].forEach(function(encoding) {
  var b = new Buffer(10);
  b.write('あいうえお', encoding);
  assert.equal(b.toString(encoding), 'あいうえお');
});

{
  // latin1 encoding should write only one byte per character.
  var b = Buffer([0xde, 0xad, 0xbe, 0xef]);
  var s = String.fromCharCode(0xffff);
  b.write(s, 0, 'latin1');
  assert.equal(0xff, b[0]);
  assert.equal(0xad, b[1]);
  assert.equal(0xbe, b[2]);
  assert.equal(0xef, b[3]);
  s = String.fromCharCode(0xaaee);
  b.write(s, 0, 'latin1');
  assert.equal(0xee, b[0]);
  assert.equal(0xad, b[1]);
  assert.equal(0xbe, b[2]);
  assert.equal(0xef, b[3]);
}

{
  // Binary encoding should write only one byte per character.
  var b = Buffer([0xde, 0xad, 0xbe, 0xef]);
  var s = String.fromCharCode(0xffff);
  b.write(s, 0, 'binary');
  assert.equal(0xff, b[0]);
  assert.equal(0xad, b[1]);
  assert.equal(0xbe, b[2]);
  assert.equal(0xef, b[3]);
  s = String.fromCharCode(0xaaee);
  b.write(s, 0, 'binary');
  assert.equal(0xee, b[0]);
  assert.equal(0xad, b[1]);
  assert.equal(0xbe, b[2]);
  assert.equal(0xef, b[3]);
}

{
  // #1210 Test UTF-8 string includes null character
  var buf = new Buffer('\0');
  assert.equal(buf.length, 1);
  buf = new Buffer('\0\0');
  assert.equal(buf.length, 2);
}

{
  var buf = new Buffer(2);
  var written = buf.write(''); // 0byte
  assert.equal(written, 0);
  written = buf.write('\0'); // 1byte (v8 adds null terminator)
  assert.equal(written, 1);
  written = buf.write('a\0'); // 1byte * 2
  assert.equal(written, 2);
  written = buf.write('あ'); // 3bytes
  assert.equal(written, 0);
  written = buf.write('\0あ'); // 1byte + 3bytes
  assert.equal(written, 1);
  written = buf.write('\0\0あ'); // 1byte * 2 + 3bytes
  assert.equal(written, 2);
}

{
  var buf = new Buffer(10);
  written = buf.write('あいう'); // 3bytes * 3 (v8 adds null terminator)
  assert.equal(written, 9);
  written = buf.write('あいう\0'); // 3bytes * 3 + 1byte
  assert.equal(written, 10);
}

{
  // #243 Test write() with maxLength
  var buf = new Buffer(4);
  buf.fill(0xFF);
  var written = buf.write('abcd', 1, 2, 'utf8');
//   console.log(buf);
  assert.equal(written, 2);
  assert.equal(buf[0], 0xFF);
  assert.equal(buf[1], 0x61);
  assert.equal(buf[2], 0x62);
  assert.equal(buf[3], 0xFF);

  buf.fill(0xFF);
  written = buf.write('abcd', 1, 4);
//   console.log(buf);
  assert.equal(written, 3);
  assert.equal(buf[0], 0xFF);
  assert.equal(buf[1], 0x61);
  assert.equal(buf[2], 0x62);
  assert.equal(buf[3], 0x63);

  buf.fill(0xFF);
  written = buf.write('abcd', 1, 2, 'utf8');
//   console.log(buf);
  assert.equal(written, 2);
  assert.equal(buf[0], 0xFF);
  assert.equal(buf[1], 0x61);
  assert.equal(buf[2], 0x62);
  assert.equal(buf[3], 0xFF);

  buf.fill(0xFF);
  written = buf.write('abcdef', 1, 2, 'hex');
//   console.log(buf);
  assert.equal(written, 2);
  assert.equal(buf[0], 0xFF);
  assert.equal(buf[1], 0xAB);
  assert.equal(buf[2], 0xCD);
  assert.equal(buf[3], 0xFF);

  ['ucs2', 'ucs-2', 'utf16le', 'utf-16le'].forEach(function(encoding) {
    buf.fill(0xFF);
    written = buf.write('abcd', 0, 2, encoding);
//     console.log(buf);
    assert.equal(written, 2);
    assert.equal(buf[0], 0x61);
    assert.equal(buf[1], 0x00);
    assert.equal(buf[2], 0xFF);
    assert.equal(buf[3], 0xFF);
  });
}

{
  // test offset returns are correct
  var b = new Buffer(16);
  assert.equal(4, b.writeUInt32LE(0, 0));
  assert.equal(6, b.writeUInt16LE(0, 4));
  assert.equal(7, b.writeUInt8(0, 6));
  assert.equal(8, b.writeInt8(0, 7));
  assert.equal(16, b.writeDoubleLE(0, 8));
}

{
  // test unmatched surrogates not producing invalid utf8 output
  // ef bf bd = utf-8 representation of unicode replacement character
  // see https://codereview.chromium.org/121173009/
  var buf = new Buffer('ab\ud800cd', 'utf8');
  assert.equal(buf[0], 0x61);
  assert.equal(buf[1], 0x62);
  assert.equal(buf[2], 0xef);
  assert.equal(buf[3], 0xbf);
  assert.equal(buf[4], 0xbd);
  assert.equal(buf[5], 0x63);
  assert.equal(buf[6], 0x64);
}

{
  // test for buffer overrun
  var buf = new Buffer([0, 0, 0, 0, 0]); // length: 5
  var sub = buf.slice(0, 4);         // length: 4
  written = sub.write('12345', 'latin1');
  assert.equal(written, 4);
  assert.equal(buf[4], 0);
  written = sub.write('12345', 'binary');
  assert.equal(written, 4);
  assert.equal(buf[4], 0);
}

// Check for fractional length args, junk length args, etc.
// https://github.com/joyent/node/issues/1758

// Call .fill() first, stops valgrind warning about uninitialized memory reads.
Buffer(3.3).fill().toString(); // throws bad argument error in commit 43cb4ec
assert.equal(Buffer(NaN).length, 0);
assert.equal(Buffer(3.3).length, 3);
assert.equal(Buffer({length: 3.3}).length, 3);
assert.equal(Buffer({length: 'BAM'}).length, 0);

// Make sure that strings are not coerced to numbers.
assert.equal(Buffer('99').length, 2);
assert.equal(Buffer('13.37').length, 5);

// Ensure that the length argument is respected.
'ascii utf8 hex base64 latin1 binary'.split(' ').forEach(function(enc) {
  assert.equal(Buffer(1).write('aaaaaa', 0, 1, enc), 1);
});

{
  // Regression test, guard against buffer overrun in the base64 decoder.
  var a = Buffer(3);
  var b = Buffer('xxx');
  a.write('aaaaaaaa', 'base64');
  assert.equal(b.toString(), 'xxx');
}

// issue GH-3416
Buffer(Buffer(0), 0, 0);

[ 'hex',
  'utf8',
  'utf-8',
  'ascii',
  'latin1',
  'binary',
  'base64',
  'ucs2',
  'ucs-2',
  'utf16le',
  'utf-16le' ].forEach(function(enc) {
    assert.equal(Buffer.isEncoding(enc), true);
  });

[ 'utf9',
  'utf-7',
  'Unicode-FTW',
  'new gnu gun' ].forEach(function(enc) {
    assert.equal(Buffer.isEncoding(enc), false);
  });


// GH-5110
{
  var buffer = new Buffer('test');
  var string = JSON.stringify(buffer);

  assert.strictEqual(string, '{"type":"Buffer","data":[116,101,115,116]}');

  assert.deepStrictEqual(buffer, JSON.parse(string, function(key, value) {
    return value && value.type === 'Buffer'
      ? new Buffer(value.data)
      : value;
  }));
}

// issue GH-7849
{
  var buf = new Buffer('test');
  var json = JSON.stringify(buf);
  var obj = JSON.parse(json);
  var copy = new Buffer(obj);

  assert(buf.equals(copy));
}

// issue GH-4331
assert.throws(function() {
  Buffer(0xFFFFFFFF);
}, RangeError);
assert.throws(function() {
  Buffer(0xFFFFFFFFF);
}, RangeError);

// issue GH-5587
assert.throws(function() {
  var buf = new Buffer(8);
  buf.writeFloatLE(0, 5);
}, RangeError);
assert.throws(function() {
  var buf = new Buffer(16);
  buf.writeDoubleLE(0, 9);
}, RangeError);


// attempt to overflow buffers, similar to previous bug in array buffers
assert.throws(function() {
  var buf = Buffer(8);
  buf.readFloatLE(0xffffffff);
}, RangeError);

assert.throws(function() {
  var buf = Buffer(8);
  buf.writeFloatLE(0.0, 0xffffffff);
}, RangeError);

assert.throws(function() {
  var buf = Buffer(8);
  buf.readFloatLE(0xffffffff);
}, RangeError);

assert.throws(function() {
  var buf = Buffer(8);
  buf.writeFloatLE(0.0, 0xffffffff);
}, RangeError);


// ensure negative values can't get past offset
assert.throws(function() {
  var buf = Buffer(8);
  buf.readFloatLE(-1);
}, RangeError);

assert.throws(function() {
  var buf = Buffer(8);
  buf.writeFloatLE(0.0, -1);
}, RangeError);

assert.throws(function() {
  var buf = Buffer(8);
  buf.readFloatLE(-1);
}, RangeError);

assert.throws(function() {
  var buf = Buffer(8);
  buf.writeFloatLE(0.0, -1);
}, RangeError);

// offset checks
{
  var buf = new Buffer(0);

  assert.throws(function() { buf.readUInt8(0); }, RangeError);
  assert.throws(function() { buf.readInt8(0); }, RangeError);
}

{
  var buf = new Buffer([0xFF]);

  assert.equal(buf.readUInt8(0), 255);
  assert.equal(buf.readInt8(0), -1);
}

[16, 32].forEach(function(bits) {
  var buf = new Buffer(bits / 8 - 1);

  assert.throws(function() { buf['readUInt' + bits + 'BE'](0); },
                RangeError,
                'readUInt' + bits + 'BE');

  assert.throws(function() { buf['readUInt' + bits + 'LE'](0); },
                RangeError,
                'readUInt' + bits + 'LE');

  assert.throws(function() { buf['readInt' + bits + 'BE'](0); },
                RangeError,
                'readInt' + bits + 'BE()');

  assert.throws(function() { buf['readInt' + bits + 'LE'](0); },
                RangeError,
                'readInt' + bits + 'LE()');
});

[16, 32].forEach(function(bits) {
  var buf = new Buffer([0xFF, 0xFF, 0xFF, 0xFF]);

  assert.equal(buf['readUInt' + bits + 'BE'](0),
                (0xFFFFFFFF >>> (32 - bits)));

  assert.equal(buf['readUInt' + bits + 'LE'](0),
                (0xFFFFFFFF >>> (32 - bits)));

  assert.equal(buf['readInt' + bits + 'BE'](0),
                (0xFFFFFFFF >> (32 - bits)));

  assert.equal(buf['readInt' + bits + 'LE'](0),
                (0xFFFFFFFF >> (32 - bits)));
});

// test for common read(U)IntLE/BE
{
  var buf = new Buffer([0x01, 0x02, 0x03, 0x04, 0x05, 0x06]);

  assert.strictEqual(buf.readUIntLE(0, 1), 0x01);
  assert.strictEqual(buf.readUIntBE(0, 1), 0x01);
  assert.strictEqual(buf.readUIntLE(0, 3), 0x030201);
  assert.strictEqual(buf.readUIntBE(0, 3), 0x010203);
  assert.strictEqual(buf.readUIntLE(0, 5), 0x0504030201);
  assert.strictEqual(buf.readUIntBE(0, 5), 0x0102030405);
  assert.strictEqual(buf.readUIntLE(0, 6), 0x060504030201);
  assert.strictEqual(buf.readUIntBE(0, 6), 0x010203040506);
  assert.strictEqual(buf.readIntLE(0, 1), 0x01);
  assert.strictEqual(buf.readIntBE(0, 1), 0x01);
  assert.strictEqual(buf.readIntLE(0, 3), 0x030201);
  assert.strictEqual(buf.readIntBE(0, 3), 0x010203);
  assert.strictEqual(buf.readIntLE(0, 5), 0x0504030201);
  assert.strictEqual(buf.readIntBE(0, 5), 0x0102030405);
  assert.strictEqual(buf.readIntLE(0, 6), 0x060504030201);
  assert.strictEqual(buf.readIntBE(0, 6), 0x010203040506);
}

// test for common write(U)IntLE/BE
{
  var buf = Buffer(3);
  buf.writeUIntLE(0x123456, 0, 3);
  assert.deepStrictEqual(buf.toJSON().data, [0x56, 0x34, 0x12]);
  assert.equal(buf.readUIntLE(0, 3), 0x123456);

  buf = Buffer(3);
  buf.writeUIntBE(0x123456, 0, 3);
  assert.deepStrictEqual(buf.toJSON().data, [0x12, 0x34, 0x56]);
  assert.equal(buf.readUIntBE(0, 3), 0x123456);

  buf = Buffer(3);
  buf.writeIntLE(0x123456, 0, 3);
  assert.deepStrictEqual(buf.toJSON().data, [0x56, 0x34, 0x12]);
  assert.equal(buf.readIntLE(0, 3), 0x123456);

  buf = Buffer(3);
  buf.writeIntBE(0x123456, 0, 3);
  assert.deepStrictEqual(buf.toJSON().data, [0x12, 0x34, 0x56]);
  assert.equal(buf.readIntBE(0, 3), 0x123456);

  buf = Buffer(3);
  buf.writeIntLE(-0x123456, 0, 3);
  assert.deepStrictEqual(buf.toJSON().data, [0xaa, 0xcb, 0xed]);
  assert.equal(buf.readIntLE(0, 3), -0x123456);

  buf = Buffer(3);
  buf.writeIntBE(-0x123456, 0, 3);
  assert.deepStrictEqual(buf.toJSON().data, [0xed, 0xcb, 0xaa]);
  assert.equal(buf.readIntBE(0, 3), -0x123456);

  buf = Buffer(3);
  buf.writeIntLE(-0x123400, 0, 3);
  assert.deepStrictEqual(buf.toJSON().data, [0x00, 0xcc, 0xed]);
  assert.equal(buf.readIntLE(0, 3), -0x123400);

  buf = Buffer(3);
  buf.writeIntBE(-0x123400, 0, 3);
  assert.deepStrictEqual(buf.toJSON().data, [0xed, 0xcc, 0x00]);
  assert.equal(buf.readIntBE(0, 3), -0x123400);

  buf = Buffer(3);
  buf.writeIntLE(-0x120000, 0, 3);
  assert.deepStrictEqual(buf.toJSON().data, [0x00, 0x00, 0xee]);
  assert.equal(buf.readIntLE(0, 3), -0x120000);

  buf = Buffer(3);
  buf.writeIntBE(-0x120000, 0, 3);
  assert.deepStrictEqual(buf.toJSON().data, [0xee, 0x00, 0x00]);
  assert.equal(buf.readIntBE(0, 3), -0x120000);

  buf = Buffer(5);
  buf.writeUIntLE(0x1234567890, 0, 5);
  assert.deepStrictEqual(buf.toJSON().data, [0x90, 0x78, 0x56, 0x34, 0x12]);
  assert.equal(buf.readUIntLE(0, 5), 0x1234567890);

  buf = Buffer(5);
  buf.writeUIntBE(0x1234567890, 0, 5);
  assert.deepStrictEqual(buf.toJSON().data, [0x12, 0x34, 0x56, 0x78, 0x90]);
  assert.equal(buf.readUIntBE(0, 5), 0x1234567890);

  buf = Buffer(5);
  buf.writeIntLE(0x1234567890, 0, 5);
  assert.deepStrictEqual(buf.toJSON().data, [0x90, 0x78, 0x56, 0x34, 0x12]);
  assert.equal(buf.readIntLE(0, 5), 0x1234567890);

  buf = Buffer(5);
  buf.writeIntBE(0x1234567890, 0, 5);
  assert.deepStrictEqual(buf.toJSON().data, [0x12, 0x34, 0x56, 0x78, 0x90]);
  assert.equal(buf.readIntBE(0, 5), 0x1234567890);

  buf = Buffer(5);
  buf.writeIntLE(-0x1234567890, 0, 5);
  assert.deepStrictEqual(buf.toJSON().data, [0x70, 0x87, 0xa9, 0xcb, 0xed]);
  assert.equal(buf.readIntLE(0, 5), -0x1234567890);

  buf = Buffer(5);
  buf.writeIntBE(-0x1234567890, 0, 5);
  assert.deepStrictEqual(buf.toJSON().data, [0xed, 0xcb, 0xa9, 0x87, 0x70]);
  assert.equal(buf.readIntBE(0, 5), -0x1234567890);

  buf = Buffer(5);
  buf.writeIntLE(-0x0012000000, 0, 5);
  assert.deepStrictEqual(buf.toJSON().data, [0x00, 0x00, 0x00, 0xee, 0xff]);
  assert.equal(buf.readIntLE(0, 5), -0x0012000000);

  buf = Buffer(5);
  buf.writeIntBE(-0x0012000000, 0, 5);
  assert.deepStrictEqual(buf.toJSON().data, [0xff, 0xee, 0x00, 0x00, 0x00]);
  assert.equal(buf.readIntBE(0, 5), -0x0012000000);
}

// test Buffer slice
{
  var buf = new Buffer('0123456789');
  assert.equal(buf.slice(-10, 10), '0123456789');
  assert.equal(buf.slice(-20, 10), '0123456789');
  assert.equal(buf.slice(-20, -10), '');
  assert.equal(buf.slice(), '0123456789');
  assert.equal(buf.slice(0), '0123456789');
  assert.equal(buf.slice(0, 0), '');
  assert.equal(buf.slice(undefined), '0123456789');
  assert.equal(buf.slice('foobar'), '0123456789');
  assert.equal(buf.slice(undefined, undefined), '0123456789');

  assert.equal(buf.slice(2), '23456789');
  assert.equal(buf.slice(5), '56789');
  assert.equal(buf.slice(10), '');
  assert.equal(buf.slice(5, 8), '567');
  assert.equal(buf.slice(8, -1), '8');
  assert.equal(buf.slice(-10), '0123456789');
  assert.equal(buf.slice(0, -9), '0');
  assert.equal(buf.slice(0, -10), '');
  assert.equal(buf.slice(0, -1), '012345678');
  assert.equal(buf.slice(2, -2), '234567');
  assert.equal(buf.slice(0, 65536), '0123456789');
  assert.equal(buf.slice(65536, 0), '');
  assert.equal(buf.slice(-5, -8), '');
  assert.equal(buf.slice(-5, -3), '56');
  assert.equal(buf.slice(-10, 10), '0123456789');
  for (var i = 0, s = buf.toString(); i < buf.length; ++i) {
    assert.equal(buf.slice(i), s.slice(i));
    assert.equal(buf.slice(0, i), s.slice(0, i));
    assert.equal(buf.slice(-i), s.slice(-i));
    assert.equal(buf.slice(0, -i), s.slice(0, -i));
  }

  var utf16Buf = new Buffer('0123456789', 'utf16le');
  assert.deepStrictEqual(utf16Buf.slice(0, 6), Buffer('012', 'utf16le'));

  assert.equal(buf.slice('0', '1'), '0');
  assert.equal(buf.slice('-5', '10'), '56789');
  assert.equal(buf.slice('-10', '10'), '0123456789');
  assert.equal(buf.slice('-10', '-5'), '01234');
  assert.equal(buf.slice('-10', '-0'), '');
  assert.equal(buf.slice('111'), '');
  assert.equal(buf.slice('0', '-111'), '');

  // try to slice a zero length Buffer
  // see https://github.com/joyent/node/issues/5881
  SlowBuffer(0).slice(0, 1);
}

// Regression test for #5482: should throw but not assert in C++ land.
assert.throws(function() {
  Buffer('', 'buffer');
}, TypeError);

// Regression test for #6111. Constructing a buffer from another buffer
// should a) work, and b) not corrupt the source buffer.
{
  var a = [0];
  for (var i = 0; i < 7; ++i) a = a.concat(a);
  a = a.map(function(_, i) { return i; });
  var b = Buffer(a);
  var c = Buffer(b);
  assert.strictEqual(b.length, a.length);
  assert.strictEqual(c.length, a.length);
  for (var i = 0, k = a.length; i < k; ++i) {
    assert.strictEqual(a[i], i);
    assert.strictEqual(b[i], i);
    assert.strictEqual(c[i], i);
  }
}


assert.throws(function() {
  new Buffer((-1 >>> 0) + 1);
}, RangeError);

assert.throws(function() {
  SlowBuffer((-1 >>> 0) + 1);
}, RangeError);

if (common.hasCrypto) {
  // Test truncation after decode
  // var crypto = require('crypto');

  var b1 = new Buffer('YW55=======', 'base64');
  var b2 = new Buffer('YW55', 'base64');

  assert.equal(
    1 /*crypto.createHash('sha1').update(b1).digest('hex')*/,
    1 /*crypto.createHash('sha1').update(b2).digest('hex')*/
  );
} else {
  common.skip('missing crypto');
}

// Test Compare
{
  var b = new Buffer(1).fill('a');
  var c = new Buffer(1).fill('c');
  var d = new Buffer(2).fill('aa');

  assert.equal(b.compare(c), -1);
  assert.equal(c.compare(d), 1);
  assert.equal(d.compare(b), 1);
  assert.equal(b.compare(d), -1);
  assert.equal(b.compare(b), 0);

  assert.equal(Buffer.compare(b, c), -1);
  assert.equal(Buffer.compare(c, d), 1);
  assert.equal(Buffer.compare(d, b), 1);
  assert.equal(Buffer.compare(b, d), -1);
  assert.equal(Buffer.compare(c, c), 0);

  assert.equal(Buffer.compare(Buffer(0), Buffer(0)), 0);
  assert.equal(Buffer.compare(Buffer(0), Buffer(1)), -1);
  assert.equal(Buffer.compare(Buffer(1), Buffer(0)), 1);
}

assert.throws(function() {
  var b = Buffer(1);
  Buffer.compare(b, 'abc');
});

assert.throws(function() {
  var b = Buffer(1);
  Buffer.compare('abc', b);
});

assert.throws(function() {
  var b = Buffer(1);
  b.compare('abc');
});

// Test Equals
{
  var b = new Buffer(5).fill('abcdf');
  var c = new Buffer(5).fill('abcdf');
  var d = new Buffer(5).fill('abcde');
  var e = new Buffer(6).fill('abcdef');

  assert.ok(b.equals(c));
  assert.ok(!c.equals(d));
  assert.ok(!d.equals(e));
  assert.ok(d.equals(d));
}

assert.throws(function() {
  var b = Buffer(1);
  b.equals('abc');
});

// Regression test for https://github.com/nodejs/node/issues/649.
assert.throws(function() { Buffer(1422561062959).toString('utf8'); });

{
  // Test that large negative Buffer length inputs don't affect the pool offset.
  // Use the fromArrayLike() variant here because it's more lenient
  // about its input and passes the length directly to allocate().
  assert.deepStrictEqual(Buffer({ length: -Buffer.poolSize }), Buffer.from(''));
  assert.deepStrictEqual(Buffer({ length: -100 }), Buffer.from(''));

  // Check pool offset after that by trying to write string into the pool.
  assert.doesNotThrow(() => Buffer.from('abc'));
}


// Test failed or zero-sized Buffer allocations not affecting typed arrays
{
  var zeroArray = new Uint32Array(10).fill(0);
  var sizes = [1e10, 0, 0.1, -1, 'a', undefined, null, NaN];
  var allocators = [
    Buffer,
    SlowBuffer,
    Buffer.alloc,
    Buffer.allocUnsafe,
    Buffer.allocUnsafeSlow
  ];
  for (var allocator of allocators) {
    for (var size of sizes) {
      try {
        allocator(size);
      } catch (e) {
        assert.deepStrictEqual(new Uint32Array(10), zeroArray);
      }
    }
  }
}

// Test that large negative Buffer length inputs throw errors.
assert.throws(() => Buffer(-Buffer.poolSize),
              '"size" argument must not be negative');
assert.throws(() => Buffer(-100),
              '"size" argument must not be negative');
assert.throws(() => Buffer(-1),
              '"size" argument must not be negative');


```

---

### slice.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/slice.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
var B = require('../').Buffer
var test = require('tape')

test('modifying buffer created by .slice() modifies original memory', function (t) {
  var buf1 = new B(26)
  for (var i = 0; i < 26; i++) {
    buf1[i] = i + 97 // 97 is ASCII a
  }

  var buf2 = buf1.slice(0, 3)
  t.equal(buf2.toString('ascii', 0, buf2.length), 'abc')

  buf2[0] = '!'.charCodeAt(0)
  t.equal(buf1.toString('ascii', 0, buf2.length), '!bc')

  t.end()
})

test('modifying parent buffer modifies .slice() buffer\'s memory', function (t) {
  var buf1 = new B(26)
  for (var i = 0; i < 26; i++) {
    buf1[i] = i + 97 // 97 is ASCII a
  }

  var buf2 = buf1.slice(0, 3)
  t.equal(buf2.toString('ascii', 0, buf2.length), 'abc')

  buf1[0] = '!'.charCodeAt(0)
  t.equal(buf2.toString('ascii', 0, buf2.length), '!bc')

  t.end()
})

```

---

### static.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/static.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
var B = require('../').Buffer
var test = require('tape')

test('Buffer.isEncoding', function (t) {
  t.equal(B.isEncoding('HEX'), true)
  t.equal(B.isEncoding('hex'), true)
  t.equal(B.isEncoding('bad'), false)
  t.end()
})

test('Buffer.isBuffer', function (t) {
  t.equal(B.isBuffer(new B('hey', 'utf8')), true)
  t.equal(B.isBuffer(new B([1, 2, 3], 'utf8')), true)
  t.equal(B.isBuffer('hey'), false)
  t.end()
})

```

---

### to-string.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/to-string.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
var B = require('../').Buffer
var test = require('tape')

test('utf8 buffer to base64', function (t) {
  t.equal(
    new B('Ձאab', 'utf8').toString('base64'),
    '1YHXkGFi'
  )
  t.end()
})

test('utf8 buffer to hex', function (t) {
  t.equal(
    new B('Ձאab', 'utf8').toString('hex'),
    'd581d7906162'
  )
  t.end()
})

test('utf8 to utf8', function (t) {
  t.equal(
    new B('öäüõÖÄÜÕ', 'utf8').toString('utf8'),
    'öäüõÖÄÜÕ'
  )
  t.end()
})

test('utf16le to utf16', function (t) {
  t.equal(
    new B(new B('abcd', 'utf8').toString('utf16le'), 'utf16le').toString('utf8'),
    'abcd'
  )
  t.end()
})

test('utf16le to utf16 with odd byte length input', function (t) {
  t.equal(
    new B(new B('abcde', 'utf8').toString('utf16le'), 'utf16le').toString('utf8'),
    'abcd'
  )
  t.end()
})

test('utf16le to hex', function (t) {
  t.equal(
    new B('abcd', 'utf16le').toString('hex'),
    '6100620063006400'
  )
  t.end()
})

test('ascii buffer to base64', function (t) {
  t.equal(
    new B('123456!@#$%^', 'ascii').toString('base64'),
    'MTIzNDU2IUAjJCVe'
  )
  t.end()
})

test('ascii buffer to hex', function (t) {
  t.equal(
    new B('123456!@#$%^', 'ascii').toString('hex'),
    '31323334353621402324255e'
  )
  t.end()
})

test('base64 buffer to utf8', function (t) {
  t.equal(
    new B('1YHXkGFi', 'base64').toString('utf8'),
    'Ձאab'
  )
  t.end()
})

test('hex buffer to utf8', function (t) {
  t.equal(
    new B('d581d7906162', 'hex').toString('utf8'),
    'Ձאab'
  )
  t.end()
})

test('base64 buffer to ascii', function (t) {
  t.equal(
    new B('MTIzNDU2IUAjJCVe', 'base64').toString('ascii'),
    '123456!@#$%^'
  )
  t.end()
})

test('hex buffer to ascii', function (t) {
  t.equal(
    new B('31323334353621402324255e', 'hex').toString('ascii'),
    '123456!@#$%^'
  )
  t.end()
})

test('base64 buffer to binary', function (t) {
  t.equal(
    new B('MTIzNDU2IUAjJCVe', 'base64').toString('binary'),
    '123456!@#$%^'
  )
  t.end()
})

test('hex buffer to binary', function (t) {
  t.equal(
    new B('31323334353621402324255e', 'hex').toString('binary'),
    '123456!@#$%^'
  )
  t.end()
})

test('utf8 to binary', function (t) {
  /* jshint -W100 */
  t.equal(
    new B('öäüõÖÄÜÕ', 'utf8').toString('binary'),
    'Ã¶Ã¤Ã¼ÃµÃÃÃÃ'
  )
  /* jshint +W100 */
  t.end()
})

test('utf8 replacement chars (1 byte sequence)', function (t) {
  t.equal(
    new B([0x80]).toString(),
    '\uFFFD'
  )
  t.equal(
    new B([0x7F]).toString(),
    '\u007F'
  )
  t.end()
})

test('utf8 replacement chars (2 byte sequences)', function (t) {
  t.equal(
    new B([0xC7]).toString(),
    '\uFFFD'
  )
  t.equal(
    new B([0xC7, 0xB1]).toString(),
    '\u01F1'
  )
  t.equal(
    new B([0xC0, 0xB1]).toString(),
    '\uFFFD\uFFFD'
  )
  t.equal(
    new B([0xC1, 0xB1]).toString(),
    '\uFFFD\uFFFD'
  )
  t.end()
})

test('utf8 replacement chars (3 byte sequences)', function (t) {
  t.equal(
    new B([0xE0]).toString(),
    '\uFFFD'
  )
  t.equal(
    new B([0xE0, 0xAC]).toString(),
    '\uFFFD\uFFFD'
  )
  t.equal(
    new B([0xE0, 0xAC, 0xB9]).toString(),
    '\u0B39'
  )
  t.end()
})

test('utf8 replacement chars (4 byte sequences)', function (t) {
  t.equal(
    new B([0xF4]).toString(),
    '\uFFFD'
  )
  t.equal(
    new B([0xF4, 0x8F]).toString(),
    '\uFFFD\uFFFD'
  )
  t.equal(
    new B([0xF4, 0x8F, 0x80]).toString(),
    '\uFFFD\uFFFD\uFFFD'
  )
  t.equal(
    new B([0xF4, 0x8F, 0x80, 0x84]).toString(),
    '\uDBFC\uDC04'
  )
  t.equal(
    new B([0xFF]).toString(),
    '\uFFFD'
  )
  t.equal(
    new B([0xFF, 0x8F, 0x80, 0x84]).toString(),
    '\uFFFD\uFFFD\uFFFD\uFFFD'
  )
  t.end()
})

test('utf8 replacement chars on 256 random bytes', function (t) {
  t.equal(
    new B([152, 130, 206, 23, 243, 238, 197, 44, 27, 86, 208, 36, 163, 184, 164, 21, 94, 242, 178, 46, 25, 26, 253, 178, 72, 147, 207, 112, 236, 68, 179, 190, 29, 83, 239, 147, 125, 55, 143, 19, 157, 68, 157, 58, 212, 224, 150, 39, 128, 24, 94, 225, 120, 121, 75, 192, 112, 19, 184, 142, 203, 36, 43, 85, 26, 147, 227, 139, 242, 186, 57, 78, 11, 102, 136, 117, 180, 210, 241, 92, 3, 215, 54, 167, 249, 1, 44, 225, 146, 86, 2, 42, 68, 21, 47, 238, 204, 153, 216, 252, 183, 66, 222, 255, 15, 202, 16, 51, 134, 1, 17, 19, 209, 76, 238, 38, 76, 19, 7, 103, 249, 5, 107, 137, 64, 62, 170, 57, 16, 85, 179, 193, 97, 86, 166, 196, 36, 148, 138, 193, 210, 69, 187, 38, 242, 97, 195, 219, 252, 244, 38, 1, 197, 18, 31, 246, 53, 47, 134, 52, 105, 72, 43, 239, 128, 203, 73, 93, 199, 75, 222, 220, 166, 34, 63, 236, 11, 212, 76, 243, 171, 110, 78, 39, 205, 204, 6, 177, 233, 212, 243, 0, 33, 41, 122, 118, 92, 252, 0, 157, 108, 120, 70, 137, 100, 223, 243, 171, 232, 66, 126, 111, 142, 33, 3, 39, 117, 27, 107, 54, 1, 217, 227, 132, 13, 166, 3, 73, 53, 127, 225, 236, 134, 219, 98, 214, 125, 148, 24, 64, 142, 111, 231, 194, 42, 150, 185, 10, 182, 163, 244, 19, 4, 59, 135, 16]).toString(),
    '\uFFFD\uFFFD\uFFFD\u0017\uFFFD\uFFFD\uFFFD\u002C\u001B\u0056\uFFFD\u0024\uFFFD\uFFFD\uFFFD\u0015\u005E\uFFFD\uFFFD\u002E\u0019\u001A\uFFFD\uFFFD\u0048\uFFFD\uFFFD\u0070\uFFFD\u0044\uFFFD\uFFFD\u001D\u0053\uFFFD\uFFFD\u007D\u0037\uFFFD\u0013\uFFFD\u0044\uFFFD\u003A\uFFFD\uFFFD\uFFFD\u0027\uFFFD\u0018\u005E\uFFFD\u0078\u0079\u004B\uFFFD\u0070\u0013\uFFFD\uFFFD\uFFFD\u0024\u002B\u0055\u001A\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\u0039\u004E\u000B\u0066\uFFFD\u0075\uFFFD\uFFFD\uFFFD\u005C\u0003\uFFFD\u0036\uFFFD\uFFFD\u0001\u002C\uFFFD\uFFFD\u0056\u0002\u002A\u0044\u0015\u002F\uFFFD\u0319\uFFFD\uFFFD\uFFFD\u0042\uFFFD\uFFFD\u000F\uFFFD\u0010\u0033\uFFFD\u0001\u0011\u0013\uFFFD\u004C\uFFFD\u0026\u004C\u0013\u0007\u0067\uFFFD\u0005\u006B\uFFFD\u0040\u003E\uFFFD\u0039\u0010\u0055\uFFFD\uFFFD\u0061\u0056\uFFFD\uFFFD\u0024\uFFFD\uFFFD\uFFFD\uFFFD\u0045\uFFFD\u0026\uFFFD\u0061\uFFFD\uFFFD\uFFFD\uFFFD\u0026\u0001\uFFFD\u0012\u001F\uFFFD\u0035\u002F\uFFFD\u0034\u0069\u0048\u002B\uFFFD\uFFFD\uFFFD\u0049\u005D\uFFFD\u004B\uFFFD\u0726\u0022\u003F\uFFFD\u000B\uFFFD\u004C\uFFFD\uFFFD\u006E\u004E\u0027\uFFFD\uFFFD\u0006\uFFFD\uFFFD\uFFFD\uFFFD\u0000\u0021\u0029\u007A\u0076\u005C\uFFFD\u0000\uFFFD\u006C\u0078\u0046\uFFFD\u0064\uFFFD\uFFFD\uFFFD\uFFFD\u0042\u007E\u006F\uFFFD\u0021\u0003\u0027\u0075\u001B\u006B\u0036\u0001\uFFFD\uFFFD\uFFFD\u000D\uFFFD\u0003\u0049\u0035\u007F\uFFFD\uFFFD\uFFFD\uFFFD\u0062\uFFFD\u007D\uFFFD\u0018\u0040\uFFFD\u006F\uFFFD\uFFFD\u002A\uFFFD\uFFFD\u000A\uFFFD\uFFFD\uFFFD\u0013\u0004\u003B\uFFFD\u0010'
  )
  t.end()
})

test('utf8 replacement chars for anything in the surrogate pair range', function (t) {
  t.equal(
    new B([0xED, 0x9F, 0xBF]).toString(),
    '\uD7FF'
  )
  t.equal(
    new B([0xED, 0xA0, 0x80]).toString(),
    '\uFFFD\uFFFD\uFFFD'
  )
  t.equal(
    new B([0xED, 0xBE, 0x8B]).toString(),
    '\uFFFD\uFFFD\uFFFD'
  )
  t.equal(
    new B([0xED, 0xBF, 0xBF]).toString(),
    '\uFFFD\uFFFD\uFFFD'
  )
  t.equal(
    new B([0xEE, 0x80, 0x80]).toString(),
    '\uE000'
  )
  t.end()
})

test('utf8 don\'t replace the replacement char', function (t) {
  t.equal(
    new B('\uFFFD').toString(),
    '\uFFFD'
  )
  t.end()
})

```

---

### write.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/write.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
var B = require('../').Buffer
var test = require('tape')
var isnan = require('is-nan')

test('buffer.write string should get parsed as number', function (t) {
  var b = new B(64)
  b.writeUInt16LE('1003', 0)
  t.equal(b.readUInt16LE(0), 1003)
  t.end()
})

test('buffer.writeUInt8 a fractional number will get Math.floored', function (t) {
  // Some extra work is necessary to make this test pass with the Object implementation

  var b = new B(1)
  b.writeInt8(5.5, 0)
  t.equal(b[0], 5)
  t.end()
})

test('writeUint8 with a negative number throws', function (t) {
  var buf = new B(1)

  t.throws(function () {
    buf.writeUInt8(-3, 0)
  })

  t.end()
})

test('hex of write{Uint,Int}{8,16,32}{LE,BE}', function (t) {
  t.plan(2 * ((2 * 2 * 2) + 2))
  var hex = [
    '03', '0300', '0003', '03000000', '00000003',
    'fd', 'fdff', 'fffd', 'fdffffff', 'fffffffd'
  ]
  var reads = [3, 3, 3, 3, 3, -3, -3, -3, -3, -3]
  var xs = ['UInt', 'Int']
  var ys = [8, 16, 32]
  for (var i = 0; i < xs.length; i++) {
    var x = xs[i]
    for (var j = 0; j < ys.length; j++) {
      var y = ys[j]
      var endianesses = (y === 8) ? [''] : ['LE', 'BE']
      for (var k = 0; k < endianesses.length; k++) {
        var z = endianesses[k]

        var v1 = new B(y / 8)
        var writefn = 'write' + x + y + z
        var val = (x === 'Int') ? -3 : 3
        v1[writefn](val, 0)
        t.equal(
          v1.toString('hex'),
          hex.shift()
        )
        var readfn = 'read' + x + y + z
        t.equal(
          v1[readfn](0),
          reads.shift()
        )
      }
    }
  }
  t.end()
})

test('hex of write{Uint,Int}{8,16,32}{LE,BE} with overflow', function (t) {
  t.plan(3 * ((2 * 2 * 2) + 2))
  var hex = [
    '', '03', '00', '030000', '000000',
    '', 'fd', 'ff', 'fdffff', 'ffffff'
  ]
  var reads = [
    undefined, 3, 0, NaN, 0,
    undefined, 253, -256, 16777213, -256
  ]
  var xs = ['UInt', 'Int']
  var ys = [8, 16, 32]
  for (var i = 0; i < xs.length; i++) {
    var x = xs[i]
    for (var j = 0; j < ys.length; j++) {
      var y = ys[j]
      var endianesses = (y === 8) ? [''] : ['LE', 'BE']
      for (var k = 0; k < endianesses.length; k++) {
        var z = endianesses[k]

        var v1 = new B((y / 8) - 1)
        var next = new B(4)
        next.writeUInt32BE(0, 0)
        var writefn = 'write' + x + y + z
        var val = (x === 'Int') ? -3 : 3
        v1[writefn](val, 0, true)
        t.equal(
          v1.toString('hex'),
          hex.shift()
        )
        // check that nothing leaked to next buffer.
        t.equal(next.readUInt32BE(0), 0)
        // check that no bytes are read from next buffer.
        next.writeInt32BE(~0, 0)
        var readfn = 'read' + x + y + z
        var r = reads.shift()
        if (isnan(r)) t.pass('equal')
        else t.equal(v1[readfn](0, true), r)
      }
    }
  }
  t.end()
})
test('large values do not improperly roll over (ref #80)', function (t) {
  var nums = [-25589992, -633756690, -898146932]
  var out = new B(12)
  out.fill(0)
  out.writeInt32BE(nums[0], 0)
  var newNum = out.readInt32BE(0)
  t.equal(nums[0], newNum)
  out.writeInt32BE(nums[1], 4)
  newNum = out.readInt32BE(4)
  t.equal(nums[1], newNum)
  out.writeInt32BE(nums[2], 8)
  newNum = out.readInt32BE(8)
  t.equal(nums[2], newNum)
  t.end()
})

```

---

### write_infinity.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/e53c2ea1fe-buffer/test/write_infinity.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
var B = require('../').Buffer
var test = require('tape')

test('write/read Infinity as a float', function (t) {
  var buf = new B(4)
  t.equal(buf.writeFloatBE(Infinity, 0), 4)
  t.equal(buf.readFloatBE(0), Infinity)
  t.end()
})

test('write/read -Infinity as a float', function (t) {
  var buf = new B(4)
  t.equal(buf.writeFloatBE(-Infinity, 0), 4)
  t.equal(buf.readFloatBE(0), -Infinity)
  t.end()
})

test('write/read Infinity as a double', function (t) {
  var buf = new B(8)
  t.equal(buf.writeDoubleBE(Infinity, 0), 8)
  t.equal(buf.readDoubleBE(0), Infinity)
  t.end()
})

test('write/read -Infinity as a double', function (t) {
  var buf = new B(8)
  t.equal(buf.writeDoubleBE(-Infinity, 0), 8)
  t.equal(buf.readDoubleBE(0), -Infinity)
  t.end()
})

test('write/read float greater than max', function (t) {
  var buf = new B(4)
  t.equal(buf.writeFloatBE(4e38, 0), 4)
  t.equal(buf.readFloatBE(0), Infinity)
  t.end()
})

test('write/read float less than min', function (t) {
  var buf = new B(4)
  t.equal(buf.writeFloatBE(-4e40, 0), 4)
  t.equal(buf.readFloatBE(0), -Infinity)
  t.end()
})

```

---


## babel__core@7.20.5

**Funções usados neste arquivo:** parse

### monkeypatching.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/76accba941-fs.realpath/test/monkeypatching.js`

**Funções testadas:**

- `parse`

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

- `parse`

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


## babel-preset-jest@30.2.0

**Funções usados neste arquivo:** parse

### test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/022e4340c2-inflight/test.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
var test = require('tap').test
var inf = require('./inflight.js')


function req (key, cb) {
  cb = inf(key, cb)
  if (cb) setTimeout(function () {
    cb(key)
    cb(key)
  })
  return cb
}

test('basic', function (t) {
  var calleda = false
  var a = req('key', function (k) {
    t.notOk(calleda)
    calleda = true
    t.equal(k, 'key')
    if (calledb) t.end()
  })
  t.ok(a, 'first returned cb function')

  var calledb = false
  var b = req('key', function (k) {
    t.notOk(calledb)
    calledb = true
    t.equal(k, 'key')
    if (calleda) t.end()
  })

  t.notOk(b, 'second should get falsey inflight response')
})

test('timing', function (t) {
  var expect = [
    'method one',
    'start one',
    'end one',
    'two',
    'tick',
    'three'
  ]
  var i = 0

  function log (m) {
    t.equal(m, expect[i], m + ' === ' + expect[i])
    ++i
    if (i === expect.length)
      t.end()
  }

  function method (name, cb) {
    log('method ' + name)
    process.nextTick(cb)
  }

  var one = inf('foo', function () {
    log('start one')
    var three = inf('foo', function () {
      log('three')
    })
    if (three) method('three', three)
    log('end one')
  })

  method('one', one)

  var two = inf('foo', function () {
    log('two')
  })
  if (two) method('one', two)

  process.nextTick(log.bind(null, 'tick'))
})

test('parameters', function (t) {
  t.plan(8)

  var a = inf('key', function (first, second, third) {
    t.equal(first, 1)
    t.equal(second, 2)
    t.equal(third, 3)
  })
  t.ok(a, 'first returned cb function')

  var b = inf('key', function (first, second, third) {
    t.equal(first, 1)
    t.equal(second, 2)
    t.equal(third, 3)
  })
  t.notOk(b, 'second should get falsey inflight response')

  setTimeout(function () {
    a(1, 2, 3)
  })
})

test('throw (a)', function (t) {
  var calleda = false
  var a = inf('throw', function () {
    t.notOk(calleda)
    calleda = true
    throw new Error('throw from a')
  })
  t.ok(a, 'first returned cb function')

  var calledb = false
  var b = inf('throw', function () {
    t.notOk(calledb)
    calledb = true
  })
  t.notOk(b, 'second should get falsey inflight response')

  setTimeout(function () {
    t.throws(a, { message: 'throw from a' })
    t.ok(calleda)
    t.notOk(calledb)
    var calledc = false
    var c = inf('throw', function () {
      calledc = true
    })
    t.ok(c, 'third returned cb function because it cleaned up')
    c()
    t.ok(calledc)
    t.end()
  })
})

test('throw (b)', function (t) {
  var calleda = false
  var a = inf('throw', function () {
    t.notOk(calleda)
    calleda = true
  })
  t.ok(a, 'first returned cb function')

  var calledb = false
  var b = inf('throw', function () {
    t.notOk(calledb)
    calledb = true
    throw new Error('throw from b')
  })
  t.notOk(b, 'second should get falsey inflight response')

  setTimeout(function () {
    t.throws(a, { message: 'throw from b' })
    t.ok(calleda)
    t.ok(calledb)
    var calledc = false
    var c = inf('throw', function () {
      calledc = true
    })
    t.ok(c, 'third returned cb function because it cleaned up')
    c()
    t.ok(calledc)
    t.end()
  })
})

test('throw (zalgo)', function (t) {
  var calleda = false
  var calledZalgo = false
  var a = inf('throw', function () {
    t.notOk(calleda)
    calleda = true

    var zalgo = inf('throw', function () {
      t.notOk(calledZalgo)
      calledZalgo = true
    })
    t.notOk(zalgo, 'zalgo should get falsey inflight response')
    throw new Error('throw from a')
  })
  t.ok(a, 'first returned cb function')

  var calledb = false
  var b = inf('throw', function () {
    t.notOk(calledb)
    calledb = true
  })
  t.notOk(b, 'second should get falsey inflight response')

  setTimeout(function () {
    t.throws(a, { message: 'throw from a' })
    t.ok(calleda)
    t.notOk(calledb)
    t.notOk(calledZalgo)
    process.nextTick(function () {
      t.ok(calledZalgo)
      var calledc = false
      var c = inf('throw', function () {
        calledc = true
      })
      t.ok(c, 'third returned cb function because it cleaned up')
      c()
      t.ok(calledc)
      t.end()
    })
  })
})

```

---


## helper-validator-identifier@7.28.5

**Funções usados neste arquivo:** parse

### test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/adf7ca1837-p-try/test.js`

**Funções testadas:**

- `parse`

**Conteúdo do arquivo de teste:**

```javascript
import test from 'ava';
import pTry from '.';

const fixture = Symbol('fixture');
const fixtureError = new Error('fixture');

test('main', async t => {
	t.is(await pTry(() => fixture), fixture);

	await t.throwsAsync(pTry(() => Promise.reject(fixtureError)), fixtureError.message);

	await t.throwsAsync(pTry(() => {
		throw fixtureError;
	}), fixtureError.message);
});

test('allows passing arguments through', async t => {
	t.is(await pTry(argument => argument, fixture), fixture);
});

```

---


## helper-string-parser@7.27.1

**Funções usados neste arquivo:** parse


## plugin-syntax-async-generators@7.8.4

**Funções usados neste arquivo:** parse


## plugin-syntax-bigint@7.8.3

**Funções usados neste arquivo:** parse


## plugin-syntax-class-properties@7.12.13

**Funções usados neste arquivo:** parse


## plugin-syntax-class-static-block@7.14.5

**Funções usados neste arquivo:** parse


## plugin-syntax-import-attributes@7.28.6

**Funções usados neste arquivo:** parse


## plugin-syntax-import-meta@7.10.4

**Funções usados neste arquivo:** parse


## plugin-syntax-json-strings@7.8.3

**Funções usados neste arquivo:** parse


## plugin-syntax-logical-assignment-operators@7.10.4

**Funções usados neste arquivo:** parse


## plugin-syntax-nullish-coalescing-operator@7.8.3

**Funções usados neste arquivo:** parse


## plugin-syntax-numeric-separator@7.10.4

**Funções usados neste arquivo:** parse


## plugin-syntax-object-rest-spread@7.8.3

**Funções usados neste arquivo:** parse


## plugin-syntax-optional-catch-binding@7.8.3

**Funções usados neste arquivo:** parse


## plugin-syntax-optional-chaining@7.8.3

**Funções usados neste arquivo:** parse


## plugin-syntax-private-property-in-object@7.14.5

**Funções usados neste arquivo:** parse


## plugin-syntax-top-level-await@7.14.5

**Funções usados neste arquivo:** parse


## compat-data@7.29.0

**Funções usados neste arquivo:** parse


## helper-validator-option@7.27.1

**Funções usados neste arquivo:** parse


## helper-module-imports@7.28.6

**Funções usados neste arquivo:** parse


## helper-globals@7.28.0

**Funções usados neste arquivo:** parse


## babel__generator@7.27.0

**Funções usados neste arquivo:** parse


## babel__template@7.4.4

**Funções usados neste arquivo:** parse


## babel__traverse@7.28.0

**Funções usados neste arquivo:** parse


## babel-plugin-jest-hoist@30.2.0

**Funções usados neste arquivo:** parse


## pathe@

**Funções usados neste arquivo:** join


## path-scurry@

**Funções usados neste arquivo:** join

### index.ts.test.cjs

**Caminho original:** `/tmp/ctest-repos-3nLWsr/afdea7bc35-path-scurry/tap-snapshots/test/index.ts.test.cjs`

**Funções testadas:**

- `join`

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

**Funções usados neste arquivo:** join

### test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/c7cde3e261-path-exists/test.js`

**Funções testadas:**

- `join`

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

**Funções usados neste arquivo:** join

### test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/bfb4e2a9c2-path-key/test.js`

**Funções testadas:**

- `join`

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

**Funções usados neste arquivo:** join

### test.js

**Caminho original:** `/tmp/ctest-repos-3nLWsr/9adaed72d2-path-is-absolute/test.js`

**Funções testadas:**

- `join`

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


