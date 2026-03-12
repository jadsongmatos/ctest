const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');

/**
 * Analyzes a source file to identify external library function usage
 * @param {string} filePath - Path to the source file
 * @returns {Object} - Map of library names to arrays of used functions
 */
function analyzeSourceFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: Source file not found: ${filePath}`);
    return {};
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  try {
    const ast = parser.parse(content, {
      sourceType: 'unambiguous',
      plugins: ['jsx', 'typescript', 'classProperties', 'asyncGenerators', 'bigInt', 'optionalChaining']
    });

    const libraryUsage = {};
    const imports = {};

    // First pass: extract all imports/requires and build parent relationships
    traverse(ast, (node, parent) => {
      // Handle require() calls: const _ = require('lodash') or const { createClient } = require('@libsql/client')
      if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'require') {
        const arg = node.arguments[0];
        if (arg && arg.type === 'StringLiteral') {
          const libName = arg.value;
          // Get the variable name from the parent VariableDeclarator
          if (parent && parent.type === 'VariableDeclarator' && parent.id) {
            // Handle destructured require: const { createClient } = require('@libsql/client')
            if (parent.id.type === 'ObjectPattern') {
              for (const prop of parent.id.properties) {
                if (prop.type === 'Property' || prop.type === 'ObjectProperty') {
                  const importedName = prop.key.name || prop.key.value;
                  const localName = prop.value.name;
                  if (importedName && localName) {
                    if (!libraryUsage[libName]) {
                      libraryUsage[libName] = { functions: new Set(), members: {} };
                    }
                    libraryUsage[libName].functions.add(importedName);
                    imports[localName] = libName;
                  }
                }
              }
            } else if (parent.id.type === 'Identifier') {
              // Handle simple require: const _ = require('lodash')
              const varName = parent.id.name;
              imports[varName] = libName;
            }
          }
        }
      }

      // Handle ES6 imports: import _ from 'lodash'
      if (node.type === 'ImportDeclaration') {
        const libName = node.source.value;
        for (const specifier of node.specifiers) {
          if (specifier.type === 'ImportDefaultSpecifier') {
            imports[specifier.local.name] = libName;
          } else if (specifier.type === 'ImportSpecifier') {
            // import { map } from 'lodash'
            const importedName = specifier.imported.name;
            const localName = specifier.local.name;
            if (!libraryUsage[libName]) {
              libraryUsage[libName] = { functions: new Set(), members: {} };
            }
            libraryUsage[libName].functions.add(importedName);
            imports[localName] = libName;
          }
        }
      }
    });

    // Second pass: find member expressions and function calls
    traverse(ast, (node, parent) => {
      if (node.type === 'MemberExpression') {
        let objName = null;

        // Get object name
        if (node.object.type === 'Identifier') {
          objName = node.object.name;
        }

        if (objName && imports[objName]) {
          const libName = imports[objName];

          // Get property name
          let propName = null;
          if (node.property.type === 'Identifier') {
            propName = node.property.name;
          } else if (node.property.type === 'StringLiteral') {
            propName = node.property.value;
          }

          if (propName) {
            if (!libraryUsage[libName]) {
              libraryUsage[libName] = { functions: new Set(), members: {} };
            }
            if (!libraryUsage[libName].members[objName]) {
              libraryUsage[libName].members[objName] = new Set();
            }
            libraryUsage[libName].members[objName].add(propName);
          }
        }
      }

      // Also handle direct function calls: _.map(arr, fn)
      if (node.type === 'CallExpression') {
        let calleeName = null;
        
        if (node.callee.type === 'Identifier') {
          // Direct call: map(arr)
          calleeName = node.callee.name;
        } else if (node.callee.type === 'MemberExpression' && node.callee.property.type === 'Identifier') {
          // Member call: _.map(arr)
          const objName = node.callee.object.name;
          if (objName && imports[objName]) {
            const libName = imports[objName];
            const propName = node.callee.property.name;
            
            if (!libraryUsage[libName]) {
              libraryUsage[libName] = { functions: new Set(), members: {} };
            }
            if (!libraryUsage[libName].members[objName]) {
              libraryUsage[libName].members[objName] = new Set();
            }
            libraryUsage[libName].members[objName].add(propName);
          }
        }
      }
    });

    // Convert Sets to Arrays for JSON serialization
    const result = {};
    for (const [libName, data] of Object.entries(libraryUsage)) {
      result[libName] = {
        functions: Array.from(data.functions),
        members: {}
      };
      for (const [memberName, funcs] of Object.entries(data.members)) {
        result[libName].members[memberName] = Array.from(funcs);
      }
    }

    return result;
  } catch (error) {
    console.warn(`Warning: Could not parse ${filePath}: ${error.message}`);
    return {};
  }
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
    if (key === 'loc' || key === 'start' || key === 'end' || key === 'range' || key === 'parent') {
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
 * Scans a directory for JavaScript/TypeScript source files
 * @param {string} dir - Directory to scan
 * @returns {Array<string>} - Array of source file paths
 */
function scanSourceFiles(dir) {
  const sourceFiles = [];
  
  function scan(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      // Skip excluded directories
      if (entry.isDirectory() && ['node_modules', '.git', 'dist', 'build', 'coverage', 'test', 'tests', '__tests__'].includes(entry.name)) {
        continue;
      }
      
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.isFile() && /\.(js|mjs|cjs|ts|tsx|jsx)$/.test(entry.name)) {
        sourceFiles.push(fullPath);
      }
    }
  }
  
  scan(dir);
  return sourceFiles;
}

/**
 * Analyzes all source files in a project
 * @param {string} projectPath - Path to the project
 * @returns {Object} - Map of file paths to their library usage
 */
function analyzeProject(projectPath) {
  const sourceFiles = scanSourceFiles(projectPath);
  const result = {};
  
  for (const file of sourceFiles) {
    const usage = analyzeSourceFile(file);
    if (Object.keys(usage).length > 0) {
      result[file] = usage;
    }
  }
  
  return result;
}

module.exports = {
  analyzeSourceFile,
  analyzeProject,
  scanSourceFiles,
  traverse
};
