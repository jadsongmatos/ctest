# Ctest

Ctest is a command-line tool that analyzes npm projects and generates markdown files with external library tests for each source file.

## Overview

Ctest analyzes your npm project to identify which external library functions are used in each source file, then generates markdown files containing the relevant test cases from those external libraries.

## Features

- Generates CycloneDX SBOM for npm projects
- Imports SBOM into SQLite database using Prisma ORM
- Downloads source code from external dependencies using repo_url
- Extracts test files from external dependencies
- Analyzes source code to identify external library function usage
- Generates `.md` files for each source file with relevant external tests

## Prerequisites

- Node.js (v14 or higher)
- npm
- Git (for downloading dependency source code)

## Installation

```bash
npm install
```

## Quick Start

Analyze an npm project and generate markdown files with external tests:

```bash
node src/index.js /path/to/npm/project --download-dependencies
```

## Usage

### Command-Line Options

| Option | Description |
|--------|-------------|
| `<project-path>` | Path to the npm project to analyze (required) |
| `--download-dependencies` | Download source code from dependencies with repo_url |
| `--file=<filename>` | Generate markdown for a single source file only |

### Generate markdown files for all source files

```bash
node src/index.js <project-path> --download-dependencies
```

### Generate markdown file for a single source file

```bash
node src/index.js <project-path> --download-dependencies --file=index.js
```

### Examples

```bash
# Analyze current directory
node src/index.js . --download-dependencies

# Analyze a specific project
node src/index.js /path/to/npm/project --download-dependencies

# Generate markdown for a single file
node src/index.js /path/to/npm/project --download-dependencies --file=src/index.js
```

### Analyzing the Ctest Project Itself

```bash
# Analyze the ctest project
node src/index.js /workspaces/ctest --download-dependencies

# Analyze a specific file in ctest
node src/index.js /workspaces/ctest --download-dependencies --file=src/index.js
```

## How It Works

1. **Generate SBOM**: Ctest uses `@cyclonedx/cyclonedx-npm` to generate a CycloneDX SBOM for the target npm project
2. **Parse SBOM**: The SBOM is parsed to extract component information (name, version, repo_url)
3. **Import to SQLite**: Components are imported into a SQLite database (`ctest.db` at the project root)
4. **Download Dependencies**: When `--download-dependencies` is used, source code is cloned from `repo_url` for each component
5. **Extract External Tests**: Test files are extracted from downloaded dependencies (files in `test/`, `tests/`, `__tests__/` directories)
6. **Analyze Source Code**: Each source file is parsed to identify which external library functions are used
7. **Generate Markdown**: For each source file, a `.md` file is generated containing:
   - List of external libraries used
   - Functions from each library that are used
   - Relevant test files from those libraries
   - Complete content of each test file

## Generating SBOM Manually

> **Note:** Ctest automatically generates the SBOM when you run the analysis. Use this command only if you need the SBOM file separately.

```bash
npx @cyclonedx/cyclonedx-npm --output-format JSON --output-file sbom.cdx.json
```

## Database Schema

The SQLite database contains the following tables:

### `components`

| Column     | Type      | Description              |
|------------|-----------|--------------------------|
| `id`       | INTEGER   | Primary key (auto-increment) |
| `name`     | TEXT      | Package name             |
| `version`  | TEXT      | Package version          |
| `repo_url` | TEXT      | Repository URL (if any)  |
| `created_at` | DATETIME  | Import timestamp         |

### `external_components`

| Column         | Type      | Description              |
|----------------|-----------|--------------------------|
| `id`           | INTEGER   | Primary key (auto-increment) |
| `name`         | TEXT      | Package name             |
| `version`      | TEXT      | Package version          |
| `repo_url`     | TEXT      | Repository URL           |
| `downloadPath` | TEXT      | Local download path      |
| `createdAt`    | DATETIME  | Creation timestamp       |

### `external_test_files`

| Column              | Type      | Description              |
|---------------------|-----------|--------------------------|
| `id`                | INTEGER   | Primary key (auto-increment) |
| `externalComponentId` | INTEGER | Foreign key to `external_components` |
| `path`              | TEXT      | Test file path           |

## Output Format

For each source file (e.g., `index.js`), a markdown file is generated (`index.js.md`) with the following structure:

```markdown
# External Tests for index.js

Testes de dependências externas usadas neste arquivo.

**Arquivo:** `/path/to/index.js`

## Sumário

- **Total de componentes:** 1
- **Total de arquivos de teste:** 5

---

## lodash@4.17.21

**Funções usadas neste arquivo:** `capitalize`, `map`, `filter`

### test-string.js

**Caminho original:** `/tmp/.../lodash/test/test-string.js`

**Funções testadas:**
- `capitalize`
- `map`

**Conteúdo do arquivo de teste:**

```javascript
// ... complete test file content ...
```
```
## API

### Programmatic Usage

```javascript
const { analyze } = require('./src/index');

async function main() {
  const result = await analyze('/path/to/npm/project', {
    dbPath: 'ctest.db',                 // SQLite database path (at project root)
    sbomPath: 'sbom.cdx.json',          // SBOM file path
    downloadDependencies: true,         // Whether to download dependencies with repo_url
    sourceFile: 'index.js'              // Optional: generate markdown for a single file only
  });

  console.log(result);
  // {
  //   sbomPath: '/path/to/sbom.cdx.json',
  //   componentCount: 42,
  //   sourceTestsMarkdown: {
  //     generated: 1,
  //     files: [...]
  //   }
  // }
}
```

### Module Functions

#### SBOM Module (`src/lib/sbom.js`)

| Function | Description |
|----------|-------------|
| `generateSBOM(projectPath, outputFile, fetchRepoUrls)` | Generate CycloneDX SBOM |
| `readSBOM(sbomPath)` | Read and parse SBOM file |
| `extractComponents(sbom)` | Extract components from SBOM |
| `createSBOMFromPackageLock(packageLock, fetchRepoUrls)` | Create SBOM from package-lock.json |
| `fetchNpmPackageInfo(packageName)` | Fetch package metadata from npm registry |

#### Database Module (`src/lib/database-libsql.js`)

| Function | Description |
|----------|-------------|
| `openDatabase(dbPath, projectPath)` | Open/create SQLite database at project root |
| `importComponents(db, components)` | Import components to database |
| `upsertExternalComponent(db, name, version, repoUrl, downloadPath)` | Insert/update external component |
| `upsertExternalTestFile(db, externalComponentId, testPath)` | Insert/update external test file |
| `closeDatabase(db)` | Close database connection |

#### Functions Module (`src/lib/functions.js`)

| Function | Description |
|----------|-------------|
| `generateSourceTestsMarkdown(db, projectPath, options)` | Generate markdown files with external tests |

Options:
- `options.downloadDependencies` — Whether to download dependencies with repo_url
- `options.sourceFile` — Optional: generate markdown for a single source file only

#### External Test Extractor Module (`src/lib/external-test-extractor.js`)

| Function | Description |
|----------|-------------|
| `scanExternalTestFiles(db, componentName, componentVersion, componentPath, repoUrl)` | Scan a dependency for test files |
| `scanAllExternalTests(db, downloadInfo)` | Scan all downloaded dependencies for test files |
| `generateSourceFileTestsMarkdown(db, sourceFilePath, outputFile)` | Generate markdown for a single source file |

#### Source Analyzer Module (`src/lib/source-analyzer.js`)

| Function | Description |
|----------|-------------|
| `analyzeSourceFile(filePath)` | Analyze a source file to identify external library function usage |
| `analyzeProject(projectPath)` | Analyze all source files in a project |
| `scanSourceFiles(dir)` | Scan a directory for JavaScript/TypeScript source files |

#### Source Parser Module (`src/lib/source-parser.js`)

| Function | Description |
|----------|-------------|
| `parseFile(filePath)` | Parse a JavaScript file and extract function definitions |
| `scanDirectory(dir, options)` | Scan a directory recursively for JavaScript files |

#### Repo Downloader Module (`src/lib/repo-downloader.js`)

| Function | Description |
|----------|-------------|
| `downloadRepos(components, baseDir)` | Download source code for components with repo_url |
| `installDependencies(repoPath)` | Install dependencies for a downloaded repository |
| `cleanupRepos(downloadRoot)` | Clean up downloaded repositories |
| `parseRepoUrl(repoUrl, version)` | Parse repo URL to extract git clone URL |
| `cloneRepo(gitUrl, ref, destDir)` | Clone a git repository |

## Running Tests

Run the test suite:

```bash
npm test
```

## Test Projects

The `ref/` folder contains test project repositories for testing and development purposes.

## Project Structure

```
ctest/
├── src/
│   ├── index.js                      # Main CLI entry point
│   └── lib/
│       ├── database-libsql.js        # Database operations (libsql)
│       ├── sbom.js                   # SBOM generation and parsing
│       ├── functions.js              # Markdown generation
│       ├── external-test-extractor.js # External test extraction
│       ├── source-analyzer.js        # Source code analysis
│       ├── source-parser.js          # JavaScript/TypeScript parser
│       ├── dependency-scanner.js     # Dependency scanning
│       └── repo-downloader.js        # Git repository downloader
├── prisma/
│   └── schema.prisma                 # Prisma schema definition
├── ctest.db                          # SQLite database (generated at analyzed project root)
├── ref/                              # Test projects
├── tests/                            # Test files
└── scripts/                          # Utility scripts
```

## License

ISC
