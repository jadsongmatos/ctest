const { safeReadFile } = require('./utils');

function findMatchingBrace(code, openIndex) {
  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let i = openIndex; i < code.length; i++) {
    const ch = code[i];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }

    if (ch === '{') depth++;
    if (ch === '}') depth--;

    if (depth === 0) return i;
  }

  return -1;
}

function extractTestBlocks(content) {
  const blocks = [];
  const re = /\b(?:test|it)\s*\(\s*(['"`])([\s\S]*?)\1\s*,[\s\S]*?\{/g;

  let match;
  while ((match = re.exec(content))) {
    const title = (match[2] || '').trim();
    const start = match.index;
    const braceStart = content.indexOf('{', re.lastIndex - 1);

    if (braceStart === -1) continue;

    const braceEnd = findMatchingBrace(content, braceStart);
    if (braceEnd === -1) continue;

    const code = content.slice(start, braceEnd + 1);

    blocks.push({
      title,
      code,
    });

    re.lastIndex = braceEnd + 1;
  }

  return blocks;
}

function blockMatchesTerms(blockCode, terms) {
  const lower = blockCode.toLowerCase();
  return terms.some(term => lower.includes(term.toLowerCase()));
}

function extractRelevantBlocksFromFile(filePath, terms) {
  const content = safeReadFile(filePath);
  if (!content) return [];

  const blocks = extractTestBlocks(content);
  return blocks.filter(block => blockMatchesTerms(block.code, terms));
}

module.exports = {
  extractTestBlocks,
  extractRelevantBlocksFromFile,
};
