const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');

/**
 * Parse .gitignore file and return array of patterns
 */
function parseGitIgnore(dir) {
  const gitIgnorePath = path.join(dir, '.gitignore');
  const patterns = [];

  if (!fs.existsSync(gitIgnorePath)) {
    return patterns;
  }

  try {
    const content = fs.readFileSync(gitIgnorePath, 'utf8');
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }
      patterns.push(trimmed);
    }
  } catch (error) {
    // Ignore errors reading .gitignore
  }

  return patterns;
}

/**
 * Convert a gitignore pattern to a regex
 */
function patternToRegex(pattern) {
  // Escape special regex characters except * and ?
  let regex = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');

  // Handle leading slash (anchored to root)
  const anchored = pattern.startsWith('/');
  if (anchored) {
    regex = regex.slice(1);
    return new RegExp('^' + regex);
  }

  // Handle trailing slash (directory only)
  const dirOnly = pattern.endsWith('/');
  if (dirOnly) {
    regex = regex.slice(0, -1) + '/.*';
  }

  // Pattern with slash in middle is relative to root
  if (pattern.includes('/') && !pattern.startsWith('**/')) {
    return new RegExp('(^|/)' + regex);
  }

  // Pattern without slash matches anywhere
  return new RegExp('(^|/)' + regex + '($|/)');
}

/**
 * Check if a file path should be ignored based on gitignore patterns
 */
function shouldIgnore(filePath, patterns, baseDir) {
  const relativePath = path.relative(baseDir, filePath);
  const normalizedPath = relativePath.replace(/\\/g, '/');

  for (const pattern of patterns) {
    // Handle negation patterns
    if (pattern.startsWith('!')) {
      continue; // Simplified: negations not fully supported
    }

    const regex = patternToRegex(pattern);
    if (regex.test(normalizedPath)) {
      return true;
    }
  }

  return false;
}

/**
 * Get all gitignore patterns from directory tree
 */
function getGitIgnorePatterns(dir) {
  const patterns = parseGitIgnore(dir);
  return patterns;
}

function getRootObjectName(node) {
  if (!node) return null;
  if (node.type === 'Identifier') return node.name;
  if (node.type === 'MemberExpression') return getRootObjectName(node.object);
  return null;
}

function getMemberProperties(node) {
  if (!node) return [];
  if (node.type === 'Identifier') return [];

  if (node.type === 'MemberExpression') {
    const props = [];
    let propName = null;

    if (node.property.type === 'Identifier') {
      propName = node.property.name;
    } else if (node.property.type === 'StringLiteral') {
      propName = node.property.value;
    }

    if (node.object.type === 'MemberExpression') {
      props.push(...getMemberProperties(node.object));
    }

    if (propName) props.push(propName);
    return props;
  }

  return [];
}

function traverse(node, callback, parent = null) {
  if (!node || typeof node !== 'object') return;

  callback(node, parent);

  for (const key in node) {
    if (['loc', 'start', 'end', 'range', 'parent'].includes(key)) continue;

    const value = node[key];
    if (Array.isArray(value)) {
      value.forEach(child => traverse(child, callback, node));
    } else if (value && typeof value === 'object') {
      traverse(value, callback, node);
    }
  }
}

function analyzeSourceFile(filePath) {
  if (!fs.existsSync(filePath)) return {};

  const content = fs.readFileSync(filePath, 'utf8');
  
  let ast;
  try {
    ast = parser.parse(content, {
      sourceType: 'unambiguous',
      plugins: [
        'jsx',
        'typescript',
        'classProperties',
        'optionalChaining',
        'nullishCoalescingOperator',
        'asyncGenerators',
        'bigInt',
        'importMeta',
        'logicalAssignment',
        'numericSeparator',
        'optionalCatchBinding',
        'throwExpressions',
      ],
      allowAwaitOutsideFunction: true,
      allowImportExportEverywhere: true,
      allowReturnOutsideFunction: true,
      allowSuperOutsideMethod: true,
      allowUndeclaredExports: true,
    });
  } catch (error) {
    // If parsing fails, return empty result instead of crashing
    console.warn(`Warning: Could not parse ${filePath}: ${error.message}`);
    return {};
  }

  const imports = {};
  const classInstances = {};
  const libraryUsage = {};

  traverse(ast, (node, parent) => {
    if (
      node.type === 'CallExpression' &&
      node.callee.type === 'Identifier' &&
      node.callee.name === 'require'
    ) {
      const arg = node.arguments[0];
      if (!arg || arg.type !== 'StringLiteral') return;
      const libName = arg.value;

      if (parent && parent.type === 'VariableDeclarator' && parent.id) {
        if (parent.id.type === 'ObjectPattern') {
          for (const prop of parent.id.properties) {
            if (prop.type === 'Property' || prop.type === 'ObjectProperty') {
              const importedName = prop.key.name || prop.key.value;
              const localName = prop.value.name;

              if (!libraryUsage[libName]) {
                libraryUsage[libName] = { functions: new Set(), members: {}, chains: new Set() };
              }

              libraryUsage[libName].functions.add(importedName);
              imports[localName] = libName;
            }
          }
        } else if (parent.id.type === 'Identifier') {
          imports[parent.id.name] = libName;
        }
      }
    }

    if (node.type === 'ImportDeclaration') {
      const libName = node.source.value;

      for (const specifier of node.specifiers) {
        if (specifier.type === 'ImportDefaultSpecifier') {
          imports[specifier.local.name] = libName;
        } else if (specifier.type === 'ImportSpecifier') {
          const importedName = specifier.imported.name;
          const localName = specifier.local.name;

          if (!libraryUsage[libName]) {
            libraryUsage[libName] = { functions: new Set(), members: {}, chains: new Set() };
          }

          libraryUsage[libName].functions.add(importedName);
          imports[localName] = libName;
        }
      }
    }

    if (node.type === 'NewExpression' && node.callee.type === 'Identifier') {
      const className = node.callee.name;
      if (imports[className] && parent && parent.type === 'VariableDeclarator' && parent.id.type === 'Identifier') {
        classInstances[parent.id.name] = imports[className];
      }
    }
  });

  traverse(ast, (node) => {
    if (node.type === 'CallExpression' && node.callee.type === 'Identifier') {
      const calleeName = node.callee.name;
      const libName = imports[calleeName];

      if (libName) {
        if (!libraryUsage[libName]) {
          libraryUsage[libName] = { functions: new Set(), members: {}, chains: new Set() };
        }
        libraryUsage[libName].functions.add(calleeName);
      }
    }

    if (node.type === 'MemberExpression') {
      const objName = getRootObjectName(node);
      const libName = imports[objName] || classInstances[objName];
      if (!libName) return;

      const props = getMemberProperties(node);
      if (props.length === 0) return;

      if (!libraryUsage[libName]) {
        libraryUsage[libName] = { functions: new Set(), members: {}, chains: new Set() };
      }

      if (!libraryUsage[libName].members[objName]) {
        libraryUsage[libName].members[objName] = new Set();
      }

      props.forEach(prop => libraryUsage[libName].members[objName].add(prop));
      libraryUsage[libName].chains.add(props.join('.'));
    }
  });

  const result = {};
  for (const [libName, data] of Object.entries(libraryUsage)) {
    result[libName] = {
      functions: Array.from(data.functions),
      members: {},
      chains: Array.from(data.chains),
    };

    for (const [memberName, funcs] of Object.entries(data.members)) {
      result[libName].members[memberName] = Array.from(funcs);
    }
  }

  return result;
}

function scanSourceFiles(dir, options = {}) {
  const { respectGitIgnore = true } = options;
  const sourceFiles = [];
  const gitIgnorePatterns = respectGitIgnore ? getGitIgnorePatterns(dir) : [];

  // Directories that are always ignored regardless of .gitignore
  const alwaysIgnoredDirs = ['node_modules', '.git', 'dist', 'build', 'coverage', 'test', 'tests', '__tests__'];

  function scan(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(dir, fullPath);

      // Always ignore specific directories
      if (entry.isDirectory() && alwaysIgnoredDirs.includes(entry.name)) {
        continue;
      }

      // Check .gitignore patterns if enabled
      if (respectGitIgnore && gitIgnorePatterns.length > 0) {
        if (shouldIgnore(fullPath, gitIgnorePatterns, dir)) {
          continue;
        }
      }

      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.isFile() && /\.(js|jsx|mjs|cjs|ts|tsx)$/.test(entry.name)) {
        sourceFiles.push(fullPath);
      }
    }
  }

  scan(dir);
  return sourceFiles;
}

module.exports = {
  analyzeSourceFile,
  scanSourceFiles,
  parseGitIgnore,
  patternToRegex,
  shouldIgnore,
};
