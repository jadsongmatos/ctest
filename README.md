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
```

## How It Works

1. **Generate SBOM**: Ctest uses `@cyclonedx/cyclonedx-npm` to generate a CycloneDX SBOM for the target npm project
2. **Parse SBOM**: The SBOM is parsed to extract component information
3. **Import to SQLite**: Components are imported into a SQLite database (`db/ctest.db`)

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
  dbPath: 'db/ctest.db',      // SQLite database path
  sbomPath: 'sbom.cdx.json',  // SBOM file path
  generateSBOM: true          // Whether to generate SBOM
});

console.log(result);
// {
//   sbomPath: '/path/to/sbom.cdx.json',
//   componentCount: 42,
//   components: [...]
// }
```

### Module Functions

#### SBOM Module (`lib/sbom.js`)

- `generateSBOM(projectPath, outputFile)` - Generate CycloneDX SBOM
- `readSBOM(sbomPath)` - Read and parse SBOM file
- `extractComponents(sbom)` - Extract components from SBOM
- `createSBOMFromPackageLock(packageLock)` - Create minimal SBOM from package-lock.json

#### Database Module (`lib/database.js`)

- `openDatabase(dbPath)` - Open/create SQLite database
- `importComponents(db, components)` - Import components to database
- `getAllComponents(db)` - Get all components from database
- `searchComponentsByName(db, name)` - Search components by name
- `closeDatabase(db)` - Close database connection

## Running Tests

```bash
npm test
```

## Test Projects

The `ref` folder contains test project repositories for testing purposes.

## License

ISC
