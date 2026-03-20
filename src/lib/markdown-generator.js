const fs = require('fs');
const path = require('path');

const { searchIndex } = require('./horsebox');
const { extractRelevantBlocksFromFile } = require('./test-extractor');
const {
  uniq,
  normalizeLibraryNames,
  isTestFile
} = require('./utils');

function buildQueriesForUsage (libName, usage) {
  const queries = [];
  const libNames = normalizeLibraryNames(libName);

  for (const chain of usage.chains || []) {
    queries.push(chain);

    const parts = chain.split('.');
    const last = parts[parts.length - 1];
    if (last && last !== chain) { queries.push(last); }

    for (const libAlias of libNames) {
      queries.push(`${libAlias} ${last}`);
    }
  }

  for (const fn of usage.functions || []) {
    queries.push(fn);
    for (const libAlias of libNames) {
      queries.push(`${libAlias} ${fn}`);
    }
  }

  for (const members of Object.values(usage.members || {})) {
    for (const member of members) {
      queries.push(member);
      for (const libAlias of libNames) {
        queries.push(`${libAlias} ${member}`);
      }
    }
  }

  return uniq(queries.filter(q => q && q.trim().length >= 2));
}

function buildTermList (libName, usage) {
  const terms = new Set();

  for (const alias of normalizeLibraryNames(libName)) {
    terms.add(alias);
  }

  for (const chain of usage.chains || []) {
    terms.add(chain);
    chain.split('.').forEach(p => terms.add(p));
  }

  for (const fn of usage.functions || []) {
    terms.add(fn);
  }

  for (const members of Object.values(usage.members || {})) {
    for (const member of members) {
      terms.add(member);
    }
  }

  return [...terms].filter(Boolean);
}

function collectTestFilesFromHorsebox (libsIndexDir, libsLineIndexDir, queries) {
  const paths = new Set();

  // Skip if index directories don't exist
  if (!libsIndexDir || !fs.existsSync(libsIndexDir)) { return []; }
  if (!libsLineIndexDir || !fs.existsSync(libsLineIndexDir)) { return []; }

  for (const query of queries) {
    try {
      const fileHits = searchIndex(libsIndexDir, query, 50);
      const lineHits = searchIndex(libsLineIndexDir, query, 100);

      for (const hit of [...fileHits, ...lineHits]) {
        const filePath = hit.path || hit.file || hit.source || hit.name;
        if (filePath && isTestFile(filePath)) {
          paths.add(filePath);
        }
      }
    } catch (err) {
      // Skip errors from missing index
    }
  }

  return [...paths];
}

function shortenPath (fullPath, projectRoot) {
  if (!fullPath) { return ''; }
  let rel = projectRoot ? path.relative(projectRoot, fullPath) : fullPath;
  // If the path starts with src/, optionally remove it or keep it depending on preference.
  // The instruction "remover src" likely means the user wants to see 'lib/horsebox.js' instead of 'src/lib/horsebox.js'.
  if (rel.startsWith(`src${path.sep}`)) {
    rel = rel.slice(4);
  }
  return rel;
}

async function writeMarkdownForSource ({
  sourceFile,
  usage,
  outputFile,
  libsIndexDir,
  libsLineIndexDir,
  projectRoot
}) {
  const shortSource = shortenPath(sourceFile, projectRoot);
  let md = `# External tests for ${path.basename(sourceFile)}\n\n`;
  md += `**Arquivo:** \`${shortSource}\`\n\n`;

  const libs = Object.entries(usage || {});

  if (libs.length === 0) {
    md += 'Nenhuma lib externa detectada neste arquivo.\n';
    fs.writeFileSync(outputFile, md, 'utf8');
    return;
  }

  // Task: Add checklist
  md += '## Checklist\n\n';
  for (const [libName] of libs) {
    md += `- [ ] ${libName}\n`;
  }
  md += '\n';

  for (const [libName, libUsage] of libs) {
    md += `## ${libName}\n\n`;

    const queries = buildQueriesForUsage(libName, libUsage);
    const terms = buildTermList(libName, libUsage);
    const candidateTestFiles = collectTestFilesFromHorsebox(libsIndexDir, libsLineIndexDir, queries);

    if (candidateTestFiles.length === 0) {
      md += 'Nenhum arquivo de teste encontrado pelo Horsebox para esta lib.\n\n';
      continue;
    }

    md += `**Consultas usadas no Horsebox:** ${queries.map(q => `\`${q}\``).join(', ')}\n\n`;
    md += `**Arquivos de teste encontrados:** ${candidateTestFiles.length}\n\n`;

    const seenBlocks = new Set();
    let copied = 0;

    for (const testFile of candidateTestFiles) {
      const blocks = extractRelevantBlocksFromFile(testFile, terms);
      if (blocks.length === 0) { continue; }

      // Use a shortened path for test files too if possible,
      // though they might be in a temporary download directory.
      const displayPath = testFile.includes('ctest-work-')
        ? testFile.split(path.sep).slice(-3).join(path.sep) // e.g., "lib-name/tests/test.js"
        : shortenPath(testFile, projectRoot);

      md += `### ${displayPath}\n\n`;

      for (const block of blocks) {
        const key = `${testFile}::${block.title}::${block.code.length}`;
        if (seenBlocks.has(key)) { continue; }
        seenBlocks.add(key);
        copied++;

        md += `#### ${block.title || 'test'}\n\n`;
        md += '```ts\n';
        md += block.code.trim();
        md += '\n```\n\n';
      }
    }

    if (copied === 0) {
      md += 'Horsebox encontrou arquivos candidatos, mas nenhum bloco `test()` / `it()` relevante foi extraído.\n\n';
    }
  }

  fs.writeFileSync(outputFile, md, 'utf8');
}

module.exports = {
  writeMarkdownForSource,
  buildQueriesForUsage,
  buildTermList,
  shortenPath
};
