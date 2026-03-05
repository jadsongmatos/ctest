import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { execSync } from "node:child_process";
import Database from "better-sqlite3";

const isWin = process.platform === "win32";
const npx = isWin ? "npx.cmd" : "npx";

function sh(cmd, args, opts = {}) {
  return execSync(cmd + " " + args.join(" "), {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
    ...opts,
  });
}

function norm(p) {
  return p.split(path.sep).join("/");
}

function hash(s) {
  return crypto.createHash("sha1").update(s).digest("hex").slice(0, 10);
}

const dbPath = path.resolve("db/ctest.db");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("synchronous = NORMAL");

// --- function-test mapping schema
db.exec(`
CREATE TABLE IF NOT EXISTS test_files (
  id INTEGER PRIMARY KEY,
  path TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS source_files (
  id INTEGER PRIMARY KEY,
  path TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS functions (
  id INTEGER PRIMARY KEY,
  source_file_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  start_line INTEGER,
  start_col INTEGER,
  end_line INTEGER,
  end_col INTEGER,
  UNIQUE(source_file_id, name, start_line, start_col, end_line, end_col),
  FOREIGN KEY(source_file_id) REFERENCES source_files(id)
);

CREATE TABLE IF NOT EXISTS function_hits (
  test_file_id INTEGER NOT NULL,
  function_id INTEGER NOT NULL,
  hits INTEGER NOT NULL,
  PRIMARY KEY(test_file_id, function_id),
  FOREIGN KEY(test_file_id) REFERENCES test_files(id),
  FOREIGN KEY(function_id) REFERENCES functions(id)
);

CREATE INDEX IF NOT EXISTS idx_functions_name ON functions(name);
CREATE INDEX IF NOT EXISTS idx_source_files_path ON source_files(path);
CREATE INDEX IF NOT EXISTS idx_test_files_path ON test_files(path);
`);

// prepared statements (upserts)
const insTest = db.prepare(`INSERT INTO test_files(path) VALUES (?) ON CONFLICT(path) DO NOTHING`);
const getTest = db.prepare(`SELECT id FROM test_files WHERE path=?`);

const insSource = db.prepare(`INSERT INTO source_files(path) VALUES (?) ON CONFLICT(path) DO NOTHING`);
const getSource = db.prepare(`SELECT id FROM source_files WHERE path=?`);

const insFn = db.prepare(`
INSERT INTO functions(source_file_id, name, start_line, start_col, end_line, end_col)
VALUES (?, ?, ?, ?, ?, ?)
ON CONFLICT(source_file_id, name, start_line, start_col, end_line, end_col) DO NOTHING
`);
const getFn = db.prepare(`
SELECT id FROM functions
WHERE source_file_id=? AND name=? AND start_line IS ? AND start_col IS ? AND end_line IS ? AND end_col IS ?
`);

const upsertHit = db.prepare(`
INSERT INTO function_hits(test_file_id, function_id, hits)
VALUES (?, ?, ?)
ON CONFLICT(test_file_id, function_id)
DO UPDATE SET hits=excluded.hits
`);

const txn = db.transaction((testPath, calledFunctions) => {
  // test file
  insTest.run(testPath);
  const testId = getTest.get(testPath).id;

  for (const fn of calledFunctions) {
    // source file
    insSource.run(fn.sourcePath);
    const sourceId = getSource.get(fn.sourcePath).id;

    // function
    insFn.run(sourceId, fn.name, fn.startLine, fn.startCol, fn.endLine, fn.endCol);
    const fnId = getFn.get(sourceId, fn.name, fn.startLine, fn.startCol, fn.endLine, fn.endCol).id;

    // relation
    upsertHit.run(testId, fnId, fn.hits);
  }
});

// 1) list tests
console.log("Listing tests...");
const testsOut = sh(npx, ["jest", "--listTests"]);
const testFiles = testsOut.split(/\r?\n/).map(s => s.trim()).filter(Boolean);

if (!testFiles.length) {
  console.error("Nenhum teste encontrado via `jest --listTests`.");
  process.exit(1);
}

console.log(`Found ${testFiles.length} test files`);

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "jest-fn-sqlite-"));

// Optional: clear old relations (keep catalog of functions/files)
console.log("Clearing old function_hits...");
db.exec(`DELETE FROM function_hits;`);

let processed = 0;
for (const testFileAbs of testFiles) {
  const testPath = norm(testFileAbs);
  processed++;
  console.log(`[${processed}/${testFiles.length}] Processing ${path.basename(testPath)}...`);

  const covDir = path.join(tmpRoot, hash(testPath));
  fs.mkdirSync(covDir, { recursive: true });

  // 2) run only this test with coverage JSON
  sh(npx, [
    "jest",
    testFileAbs,
    "--runInBand",
    "--coverage",
    "--coverageReporters=json",
    "--coverageDirectory",
    covDir,
    "--silent",
  ]);

  const covPath = path.join(covDir, "coverage-final.json");
  if (!fs.existsSync(covPath)) {
    console.warn(`  Warning: No coverage file generated for ${testPath}`);
    continue;
  }

  const cov = JSON.parse(fs.readFileSync(covPath, "utf8"));

  // 3) extract executed functions (hits > 0)
  const called = [];

  for (const sourceFileAbs in cov) {
    const entry = cov[sourceFileAbs];
    if (!entry?.fnMap || !entry?.f) continue;

    const sourcePath = norm(sourceFileAbs);

    for (const fnId of Object.keys(entry.fnMap)) {
      const hits = entry.f[fnId];
      if (!hits) continue;

      const meta = entry.fnMap[fnId];
      const name = meta?.name || "(anonymous)";
      const loc = meta?.loc;

      called.push({
        sourcePath,
        name,
        startLine: loc?.start?.line ?? null,
        startCol: loc?.start?.column ?? null,
        endLine: loc?.end?.line ?? null,
        endCol: loc?.end?.column ?? null,
        hits: Number(hits) || 0,
      });
    }
  }

  txn(testPath, called);
  console.log(`  -> Recorded ${called.length} functions`);
}

// Cleanup temp
fs.rmSync(tmpRoot, { recursive: true, force: true });

console.log(`\nOK: gravado em ${dbPath}`);
console.log(`Dica: rode consultas SQL pra achar testes por função.`);

// Show summary
const testCount = db.prepare("SELECT COUNT(*) as c FROM test_files").get().c;
const sourceCount = db.prepare("SELECT COUNT(*) as c FROM source_files").get().c;
const fnCount = db.prepare("SELECT COUNT(*) as c FROM functions").get().c;
const hitsCount = db.prepare("SELECT COUNT(*) as c FROM function_hits").get().c;

console.log(`\nSummary:`);
console.log(`  Test files: ${testCount}`);
console.log(`  Source files: ${sourceCount}`);
console.log(`  Functions: ${fnCount}`);
console.log(`  Function hits: ${hitsCount}`);
