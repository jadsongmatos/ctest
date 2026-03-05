const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

/**
 * Creates or opens a Prisma client for the SQLite database
 * @param {string} dbPath - Path to the database file
 * @returns {Object} - Prisma client instance
 */
async function openDatabase(dbPath = 'db/ctest.db') {
  // Ensure db directory exists
  const resolvedPath = path.resolve(process.cwd(), dbPath);
  const dir = path.dirname(resolvedPath);
  if (dir && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Create Prisma client with custom database URL and increased timeout
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: `file:${resolvedPath}`
      }
    },
    log: ['error', 'warn'],
    errorFormat: 'pretty'
  });

  // Initialize database schema if tables don't exist
  await initializeSchema(prisma);

  return prisma;
}

/**
 * Initializes the database schema if tables don't exist
 * @param {Object} prisma - Prisma client instance
 */
async function initializeSchema(prisma) {
  try {
    // Check if components table exists
    await prisma.$queryRaw`SELECT 1 FROM components LIMIT 1`;
  } catch (e) {
    // Tables don't exist, create them
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS components (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        version TEXT NOT NULL,
        repo_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(name, version)
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS test_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT NOT NULL UNIQUE
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS source_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT NOT NULL UNIQUE
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS functions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sourceFileId INTEGER NOT NULL,
        name TEXT NOT NULL,
        startLine INTEGER,
        startCol INTEGER,
        endLine INTEGER,
        endCol INTEGER,
        UNIQUE(sourceFileId, name, startLine, startCol, endLine, endCol)
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS function_hits (
        testFileId INTEGER NOT NULL,
        functionId INTEGER NOT NULL,
        hits INTEGER NOT NULL,
        PRIMARY KEY(testFileId, functionId),
        FOREIGN KEY(testFileId) REFERENCES test_files(id),
        FOREIGN KEY(functionId) REFERENCES functions(id)
      )
    `);

    // Create indexes
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_functions_name ON functions(name)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_source_files_path ON source_files(path)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_test_files_path ON test_files(path)`);
  }
}

/**
 * Inserts or updates components in the database in batches
 * @param {Object} prisma - Prisma client instance
 * @param {Array} components - Array of component objects
 * @param {number} batchSize - Number of components to process per batch (default: 50)
 * @returns {number} - Number of components inserted/updated
 */
async function importComponents(prisma, components, batchSize = 50) {
  console.log(`Importing ${components.length} components in batches of ${batchSize}...`);
  
  for (let i = 0; i < components.length; i += batchSize) {
    const batch = components.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(components.length / batchSize);
    
    console.log(`  Batch ${batchNum}/${totalBatches} (${batch.length} components)...`);
    
    const promises = batch.map(component =>
      prisma.component.upsert({
        where: {
          name_version: {
            name: component.name,
            version: component.version
          }
        },
        update: {
          repo_url: component.repo_url
        },
        create: {
          name: component.name,
          version: component.version,
          repo_url: component.repo_url
        }
      })
    );

    await Promise.all(promises);
  }
  
  return components.length;
}

/**
 * Retrieves all components from the database
 * @param {Object} prisma - Prisma client instance
 * @returns {Array} - Array of component records
 */
async function getAllComponents(prisma) {
  return prisma.component.findMany({
    orderBy: { name: 'asc' }
  });
}

/**
 * Searches for components by name
 * @param {Object} prisma - Prisma client instance
 * @param {string} name - Component name to search for
 * @returns {Array} - Array of matching component records
 */
async function searchComponentsByName(prisma, name) {
  return prisma.component.findMany({
    where: {
      name: {
        contains: name
      }
    }
  });
}

/**
 * Finds tests that executed a function by name
 * @param {Object} prisma - Prisma client instance
 * @param {string} functionName - Function name to search for
 * @returns {Array} - Array of {test_path, source_path, function_name, hits}
 */
async function findTestsByFunctionName(prisma, functionName) {
  const results = await prisma.functionHit.findMany({
    where: {
      function: {
        name: functionName
      }
    },
    include: {
      testFile: true,
      function: {
        include: {
          sourceFile: true
        }
      }
    },
    orderBy: {
      hits: 'desc'
    }
  });

  return results.map(r => ({
    test_path: r.testFile.path,
    source_path: r.function.sourceFile.path,
    function_name: r.function.name,
    hits: r.hits
  }));
}

/**
 * Finds tests that executed a function by source file path and line range
 * @param {Object} prisma - Prisma client instance
 * @param {string} sourcePathPattern - Pattern to match source file path (LIKE)
 * @param {number} startLine - Start line of the function
 * @param {number} endLine - End line of the function
 * @returns {Array} - Array of {test_path, hits}
 */
async function findTestsByFunctionLocation(prisma, sourcePathPattern, startLine, endLine) {
  const results = await prisma.functionHit.findMany({
    where: {
      function: {
        sourceFile: {
          path: {
            contains: sourcePathPattern
          }
        },
        startLine: startLine,
        endLine: endLine
      }
    },
    include: {
      testFile: true
    },
    orderBy: {
      hits: 'desc'
    }
  });

  return results.map(r => ({
    test_path: r.testFile.path,
    hits: r.hits
  }));
}

/**
 * Gets all functions executed by a specific test file
 * @param {Object} prisma - Prisma client instance
 * @param {string} testPathPattern - Pattern to match test file path (LIKE)
 * @returns {Array} - Array of {source_path, function_name, start_line, end_line, hits}
 */
async function getFunctionsByTest(prisma, testPathPattern) {
  const results = await prisma.functionHit.findMany({
    where: {
      testFile: {
        path: {
          contains: testPathPattern
        }
      }
    },
    include: {
      function: {
        include: {
          sourceFile: true
        }
      }
    },
    orderBy: [
      {
        function: {
          sourceFile: {
            path: 'asc'
          }
        }
      },
      {
        function: {
          startLine: 'asc'
        }
      }
    ]
  });

  return results.map(r => ({
    source_path: r.function.sourceFile.path,
    function_name: r.function.name,
    start_line: r.function.startLine,
    end_line: r.function.endLine,
    hits: r.hits
  }));
}

/**
 * Gets all components that have a repo_url
 * @param {Object} prisma - Prisma client instance
 * @returns {Array} - Array of components with repo_url
 */
async function getComponentsWithRepoUrl(prisma) {
  return prisma.component.findMany({
    where: {
      repo_url: {
        not: null
      }
    },
    orderBy: { name: 'asc' }
  });
}

/**
 * Closes the Prisma client connection
 * @param {Object} prisma - Prisma client instance
 */
async function closeDatabase(prisma) {
  await prisma.$disconnect();
}

module.exports = {
  openDatabase,
  importComponents,
  getAllComponents,
  searchComponentsByName,
  findTestsByFunctionName,
  findTestsByFunctionLocation,
  getFunctionsByTest,
  getComponentsWithRepoUrl,
  closeDatabase
};
