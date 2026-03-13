const path = require('path');
const fs = require('fs');

function uniq(items) {
  return [...new Set(items.filter(Boolean))];
}

function normalizeLibraryNames(libName) {
  const names = new Set();

  names.add(libName);
  names.add(libName.replace(/^@/, ''));
  names.add(libName.split('/').pop());
  names.add(libName.replace(/^@/, '').split('/').pop());

  return [...names].filter(Boolean);
}

function isTestFile(filePath) {
  return (
    /(^|[/\\])(__tests__|tests?|specs?)([/\\])/.test(filePath) ||
    /\.(test|spec)\.(js|jsx|ts|tsx|mjs|cjs)$/i.test(filePath)
  );
}

function safeReadFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

module.exports = {
  uniq,
  normalizeLibraryNames,
  isTestFile,
  safeReadFile,
};
