# Ctest

Ctest is a command-line tool that analyzes npm projects.

## Overview

Ctest relies on a dedicated tool to generate CycloneDX SBOM (Software Bill of Materials) for npm projects, with a focus on completeness.

## Installation

```bash
npm install
```

## Usage

### Analyze an npm project

```bash
node index.js <project-path>
```

Or use the CLI command:

```bash
npx ctest <project-path>
```

If no project path is provided, it defaults to the current directory.

### Example

```bash
# Analyze current directory
node index.js

# Analyze a specific project
node index.js /path/to/npm/project

# With function mapping (maps test files to source functions using Jest coverage)
node index.js /path/to/npm/project --map-functions

# With function mapping and dependency download (downloads source from repo_url)
node index.js /path/to/npm/project --map-functions --download-dependencies

# With function mapping and dependency scanning (extracts functions from node_modules)
node index.js /path/to/npm/project --map-functions --scan-dependencies

# With function mapping, dependency download and scanning
node index.js /path/to/npm/project --map-functions --download-dependencies --scan-dependencies
```

## How It Works

1. **Generate SBOM**: Ctest uses `@cyclonedx/cyclonedx-npm` to generate a CycloneDX SBOM for the target npm project
2. **Parse SBOM**: The SBOM is parsed to extract component information
3. **Import to SQLite**: Components are imported into a SQLite database (`db/ctest.db`)
4. **Map Functions** (optional): When `--map-functions` is used, Jest coverage is run to map test files to source functions
5. **Download Dependencies** (optional): When `--download-dependencies` is used, source code is cloned from `repo_url` for each component before running coverage
6. **Scan Dependencies** (optional): When `--scan-dependencies` is used, the source code of dependencies in `node_modules` is parsed to extract all function definitions

## Generating SBOM Manually

To generate an SBOM for an npm project manually:

```bash
npx @cyclonedx/cyclonedx-npm --output-format JSON --output-file sbom.cdx.json
```

## Database Schema

Ctest imports the SBOM into SQLite to maintain a list with the following fields:

| Column     | Type      | Description              |
|------------|-----------|--------------------------|
| id         | INTEGER   | Primary key (auto-increment) |
| name       | TEXT      | Package name             |
| version    | TEXT      | Package version          |
| repo_url   | TEXT      | Repository URL (if any)  |
| created_at | DATETIME  | Import timestamp         |

## Querying the Database

```bash
# Using Node.js
node -e "
const Database = require('better-sqlite3');
const db = new Database('db/ctest.db');
const count = db.prepare('SELECT COUNT(*) as c FROM components').get();
console.log('Total:', count.c);
const sample = db.prepare('SELECT name, version FROM components LIMIT 5').all();
console.log('Sample:', sample);
db.close();
"

# Count components
node -e "
const Database = require('better-sqlite3');
const db = new Database('db/ctest.db');
console.log(db.prepare('SELECT COUNT(*) as c FROM components').get().c);
db.close();
"

# Search by name
node -e "
const Database = require('better-sqlite3');
const db = new Database('db/ctest.db');
const results = db.prepare('SELECT name, version FROM components WHERE name LIKE ?').all('%express%');
console.log(results);
db.close();
"
```

## API

### Programmatic Usage

```javascript
const { analyze } = require('./index');

const result = analyze('/path/to/npm/project', {
  dbPath: 'db/ctest.db',              // SQLite database path
  sbomPath: 'sbom.cdx.json',          // SBOM file path
  generateSBOM: true,                 // Whether to generate SBOM
  mapFunctions: false,                // Whether to map test functions
  downloadDependencies: false,        // Whether to download dependencies with repo_url
  scanDependencies: false             // Whether to scan dependencies for functions
});

console.log(result);
// {
//   sbomPath: '/path/to/sbom.cdx.json',
//   componentCount: 42,
//   components: [...],
//   functionMapping: { testFiles, sourceFiles, functions, functionHits } // if mapFunctions is true
// }
```

### Module Functions

#### SBOM Module (`src/lib/sbom.js`)

- `generateSBOM(projectPath, outputFile)` - Generate CycloneDX SBOM
- `readSBOM(sbomPath)` - Read and parse SBOM file
- `extractComponents(sbom)` - Extract components from SBOM
- `createSBOMFromPackageLock(packageLock)` - Create minimal SBOM from package-lock.json

#### Database Module (`src/lib/database.js`)

- `openDatabase(dbPath)` - Open/create SQLite database
- `importComponents(db, components)` - Import components to database
- `getAllComponents(db)` - Get all components from database
- `searchComponentsByName(db, name)` - Search components by name
- `getComponentsWithRepoUrl(db)` - Get all components that have a repo_url
- `findTestsByFunctionName(db, functionName)` - Find tests that executed a function by name
- `findTestsByFunctionLocation(db, sourcePathPattern, startLine, endLine)` - Find tests by function location
- `getFunctionsByTest(db, testPathPattern)` - Get all functions executed by a test file
- `closeDatabase(db)` - Close database connection

#### Functions Module (`src/lib/functions.js`)

- `mapFunctions(prisma, projectPath, options)` - Map test functions to source functions using Jest coverage
  - `options.downloadDependencies` - Whether to download dependencies with repo_url before mapping
  - `options.scanDependencies` - Whether to scan dependencies for functions

#### Source Parser Module (`src/lib/source-parser.js`)

- `parseFile(filePath)` - Parse a JavaScript file and extract function definitions
- `scanDirectory(dir, options)` - Scan a directory recursively for JavaScript files
- `extractFunctionsFromDirectory(dir, options)` - Extract functions from all JavaScript files in a directory

#### Dependency Scanner Module (`src/lib/dependency-scanner.js`)

- `scanDependency(prisma, depName, depPath)` - Scan a dependency directory and extract all functions
- `scanAllDependencies(prisma, projectPath)` - Scan all dependencies in node_modules and extract functions
- `scanDownloadedDependencies(prisma, downloadInfo)` - Scan downloaded dependencies (from repo_url) and extract functions

#### Repo Downloader Module (`src/lib/repo-downloader.js`)

- `downloadRepos(components, baseDir)` - Download source code for components with repo_url
- `installDependencies(repoPath)` - Install dependencies for a downloaded repository
- `cleanupRepos(downloadRoot)` - Clean up downloaded repositories
- `parseRepoUrl(repoUrl, version)` - Parse repo URL to extract git clone URL
- `cloneRepo(gitUrl, ref, destDir)` - Clone a git repository

## Running Tests

```bash
npm test
```

## Test Projects

The `ref` folder contains test project repositories for testing purposes.

## License

ISC
