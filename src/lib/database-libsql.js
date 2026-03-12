const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const path = require('path');
const fs = require('fs');

/**
 * Creates or opens a database connection and returns a Prisma client
 * @param {string} dbPath - Path to the database file
 * @param {string} projectPath - Project path for resolving dbPath
 * @returns {Object} - Prisma client instance
 */
async function openDatabase(dbPath, projectPath) {
  let resolvedPath;

  if (dbPath) {
    resolvedPath = path.resolve(projectPath || process.cwd(), dbPath);
  } else if (process.env.DATABASE_URL) {
    const urlPath = process.env.DATABASE_URL.replace('file:', '');
    resolvedPath = path.resolve(urlPath);
  } else {
    resolvedPath = path.resolve(projectPath || process.cwd(), 'ctest.db');
  }

  const dir = path.dirname(resolvedPath);
  if (dir && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Set DATABASE_URL for Prisma config
  process.env.DATABASE_URL = `file:${resolvedPath}`;

  // Create Prisma adapter with connection options
  const adapter = new PrismaLibSql({
    url: `file:${resolvedPath}`
  });

  // Create Prisma client with adapter
  const prisma = new PrismaClient({
    adapter
  });

  return prisma;
}

/**
 * Inserts or updates components in the database in batches using Prisma
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
 * Upserts an external component using Prisma and returns its id
 * @param {Object} prisma - Prisma client instance
 * @param {string} name - Component name
 * @param {string} version - Component version
 * @param {string} repoUrl - Repository URL
 * @param {string} downloadPath - Local download path
 * @returns {number} - External component id
 */
async function upsertExternalComponent(prisma, name, version, repoUrl, downloadPath) {
  const externalComponent = await prisma.externalComponent.upsert({
    where: {
      name_version: {
        name,
        version
      }
    },
    update: {
      repo_url: repoUrl,
      downloadPath
    },
    create: {
      name,
      version,
      repo_url: repoUrl,
      downloadPath
    }
  });
  return externalComponent.id;
}

/**
 * Upserts an external test file using Prisma and returns its id
 * @param {Object} prisma - Prisma client instance
 * @param {number} externalComponentId - External component id
 * @param {string} testPath - Test file path
 * @returns {number} - External test file id
 */
async function upsertExternalTestFile(prisma, externalComponentId, testPath) {
  const externalTestFile = await prisma.externalTestFile.upsert({
    where: {
      externalComponentId_path: {
        externalComponentId,
        path: testPath
      }
    },
    update: {},
    create: {
      externalComponentId,
      path: testPath
    }
  });
  return externalTestFile.id;
}

/**
 * Retrieves all components from the database using Prisma
 * @param {Object} prisma - Prisma client instance
 * @returns {Array} - Array of component records
 */
async function getAllComponents(prisma) {
  return prisma.component.findMany({
    orderBy: { name: 'asc' }
  });
}

/**
 * Searches for components by name using Prisma
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
  upsertExternalComponent,
  upsertExternalTestFile,
  closeDatabase
};
