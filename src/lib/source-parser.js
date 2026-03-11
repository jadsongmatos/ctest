const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');

/**
 * Parses a JavaScript file and extracts function definitions
 * @param {string} filePath - Path to the JavaScript file
 * @returns {Array} - Array of function definitions
 */
function parseFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Try to detect the file type and use appropriate plugins
  const isTS = filePath.endsWith('.ts') || filePath.endsWith('.tsx');
  const isTSX = filePath.endsWith('.tsx');
  
  const plugins = [
    'jsx',
    'classProperties',
    'asyncGenerators',
    'bigInt',
    'optionalChaining',
    'nullishCoalescingOperator'
  ];
  
  // Add TypeScript or Flow, but not both
  if (isTS) {
    plugins.push('typescript');
    if (isTSX) {
      plugins.push('jsx');
    }
  } else {
    plugins.push('flow');
  }

  const ast = parser.parse(content, {
    sourceType: 'unambiguous',
    plugins
  });

  const functions = [];
  
  traverse(ast, (node, parent) => {
    const funcInfo = extractFunctionInfo(node, parent, content);
    if (funcInfo) {
      functions.push(funcInfo);
    }
  });

  return functions;
}

/**
 * Traverses an AST and calls the callback for each node
 * @param {Object} node - AST node
 * @param {Function} callback - Callback function
 * @param {Object} parent - Parent node
 */
function traverse(node, callback, parent = null) {
  if (!node || typeof node !== 'object') return;
  
  callback(node, parent);
  
  for (const key in node) {
    if (key === 'loc' || key === 'start' || key === 'end' || key === 'range') {
      continue;
    }
    
    const value = node[key];
    if (Array.isArray(value)) {
      value.forEach(child => traverse(child, callback, node));
    } else if (value && typeof value === 'object') {
      traverse(value, callback, node);
    }
  }
}

/**
 * Extracts function information from an AST node
 * @param {Object} node - AST node
 * @param {Object} parent - Parent node
 * @param {string} content - Source file content
 * @returns {Object|null} - Function info or null
 */
function extractFunctionInfo(node, parent, content) {
  const loc = node.loc;
  if (!loc) return null;

  // Function declarations: function foo() {}
  if (node.type === 'FunctionDeclaration' && node.id) {
    return {
      name: node.id.name,
      startLine: loc.start.line,
      startCol: loc.start.column + 1,
      endLine: loc.end.line,
      endCol: loc.end.column + 1
    };
  }

  // Function expressions assigned to variables: const foo = function() {}
  if (node.type === 'VariableDeclarator' && node.init && 
      (node.init.type === 'FunctionExpression' || node.init.type === 'ArrowFunctionExpression')) {
    return {
      name: node.id.name,
      startLine: loc.start.line,
      startCol: loc.start.column + 1,
      endLine: loc.end.line,
      endCol: loc.end.column + 1
    };
  }

  // Arrow functions in variable declarations with multiple declarators
  if (node.type === 'VariableDeclarator' && node.init && node.init.type === 'ArrowFunctionExpression') {
    return {
      name: node.id.name,
      startLine: loc.start.line,
      startCol: loc.start.column + 1,
      endLine: loc.end.line,
      endCol: loc.end.column + 1
    };
  }

  // Class methods
  if (node.type === 'ClassMethod' || node.type === 'MethodDefinition') {
    const methodName = node.key?.name || node.key?.value;
    if (methodName) {
      const className = parent?.id?.name || parent?.class?.name || 'anonymous';
      return {
        name: `${className}.${methodName}`,
        startLine: loc.start.line,
        startCol: loc.start.column + 1,
        endLine: loc.end.line,
        endCol: loc.end.column + 1
      };
    }
  }

  // Object methods: { foo() {} }
  if (node.type === 'ObjectMethod') {
    const methodName = node.key?.name || node.key?.value;
    if (methodName) {
      return {
        name: methodName,
        startLine: loc.start.line,
        startCol: loc.start.column + 1,
        endLine: loc.end.line,
        endCol: loc.end.column + 1
      };
    }
  }

  return null;
}

/**
 * Scans a directory recursively for JavaScript files
 * @param {string} dir - Directory to scan
 * @param {Object} options - Options object
 * @param {Array<string>} options.exclude - Patterns to exclude
 * @returns {Array<string>} - Array of JavaScript file paths
 */
function scanDirectory(dir, options = {}) {
  const { exclude = ['node_modules', '.git', 'dist', 'build', 'coverage'] } = options;
  const jsFiles = [];

  function scan(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      // Skip excluded directories
      if (entry.isDirectory() && exclude.some(pattern => entry.name.includes(pattern))) {
        continue;
      }

      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.isFile() && /\.(js|mjs|cjs)$/.test(entry.name)) {
        jsFiles.push(fullPath);
      }
    }
  }

  scan(dir);
  return jsFiles;
}

/**
 * Extracts functions from all JavaScript files in a directory
 * @param {string} dir - Directory to scan
 * @param {Object} options - Options object
 * @returns {Object} - Map of file paths to their functions
 */
function extractFunctionsFromDirectory(dir, options = {}) {
  const jsFiles = scanDirectory(dir, options);
  const result = {};

  for (const file of jsFiles) {
    try {
      const functions = parseFile(file);
      if (functions.length > 0) {
        result[file] = functions;
      }
    } catch (error) {
      console.warn(`Warning: Could not parse ${file}: ${error.message}`);
    }
  }

  return result;
}

module.exports = {
  parseFile,
  scanDirectory,
  extractFunctionsFromDirectory
};
