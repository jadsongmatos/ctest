# Ctest Agent Guidelines

## Build/Lint/Test Commands

### Primary Commands
- `npm test` - Runs all Jest tests with coverage (`jest --coverage --silent`)
- `npm run ctest` - Executes the main Ctest analysis (`node src/index.js`)

### Testing Specific Components
- Run a single test file: `npx jest tests/<test-file>.js`
- Run tests matching a pattern: `npx jest -t "test name pattern"`
- Run tests in watch mode: `npx jest --watch`
- Run tests with verbose output: `npx jest --verbose`
- Run specific test suite: `npx jest tests/lib/` (for library tests)

### Development Commands
- Install dependencies: `npm install`
- Update dependencies: `npm update`
- Generate SBOM: `node src/index.js . --download-dependencies --direct-only`
- Analyze specific file: `node src/index.js . --file=src/lib/utils.js --download-dependencies`
- Analyze with custom download directory: `node src/index.js . --download-dependencies --download-dir=./deps`
- Limit dependency downloads: `node src/index.js . --download-dependencies --max-downloads=5`
- Skip .gitignore filtering: `node src/index.js . --download-dependencies --respect-gitignore=false`
- Lint source code: `npm run lint`
- Fix lint issues: `npm run lint:fix`
- Generate lint report: `npm run lint:report`

## Code Style Guidelines

### File Organization
- Main entry point: `src/index.js`
- Library modules: `src/lib/` (sbom.js, repo-downloader.js, source-analyzer.js, horsebox.js, markdown-generator.js, test-extractor.js, utils.js)
- Test files: `tests/` (one test file per library module)
- Configuration: package.json, .gitignore, .eslintrc.js
- Documentation: README.md, QWEN.md, CTEST_CHECKLIST.md (generated)
- Reports: reports/ (for lint and test reports)
- Follow CommonJS module system (`require()`/`module.exports`)
- Use absolute paths for file operations when possible (path.resolve())
- Separate concerns: SBOM generation, repo downloading, source analysis, Horsebox indexing, markdown generation

### Import Conventions
- Group imports: built-in modules (fs, path, os, child_process, https) first, then local modules
- Destructure imports when using multiple exports from same module (const { generateSBOM, readSBOM } = require('./lib/sbom'))
- Use relative paths for local imports (`./lib/utils` for same-level, `../lib/utils` for parent-level)
- Sort imports alphabetically within groups (built-ins first, then local)
- Avoid wildcard imports; import only what's needed
- Place require statements at top of file, before function declarations

### Code Formatting
- Use 2-space indentation (standard JavaScript/Node.js convention)
- Maximum line length: 100 characters (flexible for complex paths or URLs)
- Use semicolons to terminate statements (consistent with standard JS practice)
- Prefer template literals for string interpolation (especially for file paths and messages)
- Use const for variables that won't be reassigned, let for those that will
- Arrow functions for short callbacks (array methods, promises), function declarations for named functions
- Use trailing commas in multi-line object/array definitions for easier diffs
- Blank lines to separate logical sections within functions
- No whitespace at end of lines

### Type Checking & Validation
- Validate input parameters in public functions (check for null/undefined/empty strings)
- Use JSDoc comments for complex functions (describe parameters, return values, exceptions)
- Check for null/undefined values before accessing properties (optional chaining where appropriate)
- Use early returns to handle error conditions (guard clauses)
- Validate file/directory existence before operations (fs.existsSync() or fs.promises.access())
- Validate numeric parameters are within expected ranges
- Use TypeScript-like JSDoc for complex objects when beneficial (@typedef, @property)

### Error Handling
- Use try/catch for asynchronous operations and file system operations
- Throw descriptive Error objects with meaningful messages (include context like file paths)
- Log warnings for non-fatal issues (console.warn) but continue execution when possible
- Exit with non-zero code for CLI errors (process.exit(1)) with clear error message
- Provide fallback mechanisms when primary approaches fail (e.g., rsync fallback to recursive copy)
- Don't expose internal error details to users; use appropriate error messages
- Handle specific error types differently when needed (ENOENT vs EACCES, etc.)
- Always clean up resources in finally blocks when necessary

### Naming Conventions
- camelCase for variables and functions (generateSBOM, copyDirectoryRecursive)
- PascalCase for constructors/classes (rarely used in this codebase, but would be used if present)
- UPPER_SNAKE_CASE for constants (MAX_DOWNLOADS, DEFAULT_TIMEOUT)
- Descriptive names that convey purpose (filteredProjectPath, downloadInfo, indexRoot)
- Boolean variables/functions prefixed with is/has/can/should (isTestFile, shouldSkipFile)
- Use verbs for functions that perform actions (generateSBOM, downloadRepos, analyzeSourceFile)
- Use nouns for functions that return values (getCacheDir, normalizeLibraryNames)
- Acronyms and initialisms should be all uppercase (SBOM, URL, JSON, AST)

### Commenting Style
- Use JSDoc for public API functions (/** @description */)
- Inline comments for complex logic explanations (explain why, not what)
- TODO comments for future improvements (// TODO: implement caching for npm lookups)
- Avoid commenting obvious code; focus on why decisions were made
- Use // for single-line comments, /* */ for multi-line when needed
- Comment blocks of related functionality with descriptive headers
- Keep comments up-to-date when code changes

### Security Considerations
- Use restrictive file permissions (0o700) for created directories to avoid world-writable issues
- Avoid shell injection by using spawnSync instead of execSync (never pass user input to shell)
- Validate file paths to prevent directory traversal attacks (path.resolve(), path.isAbsolute())
- Sanitize user input before using in file operations or regex constructions
- Use proper timeout values for external commands (60s for rsync, 5s for npm registry)
- Validate URLs before making HTTP requests (SSRF prevention)
- Don't log sensitive information (tokens, passwords) even in error cases
- Check return codes of external processes and handle failures appropriately
- Use environment variables for configuration when appropriate, not hardcoded values

### Testing Practices
- Each library module has corresponding test file (src/lib/utils.js → tests/utils.test.js)
- Test both positive and negative cases (valid input, invalid input, edge cases)
- Mock external dependencies when appropriate (npm registry, file system, child processes)
- Use async/await for promise-based testing (async functions with await)
- Set appropriate timeouts for longer-running tests (120ms for index tests)
- Skip tests when required dependencies aren't available (Horsebox not installed)
- Test error conditions and error handling paths
- Use descriptive test names that explain what is being tested
- Keep tests focused on single units of behavior
- Use beforeEach/afterEach for test setup/teardown when needed

### Performance Considerations
- Cache expensive operations when possible (SBOM generation, Horsebox indexes)
- Use synchronous operations for startup/configuration (simpler, blocking is acceptable at start)
- Implement fallback mechanisms for performance-critical paths (rsync fallback to recursive copy)
- Consider memory usage when processing large files (stream when possible, avoid loading huge files)
- Use efficient data structures (Sets for uniqueness checks, Maps for lookups)
- Avoid redundant computations (store intermediate results)
- Use early exits in loops when possible
- Batch operations when beneficial (bulk file operations)
- Profile and optimize hot paths identified through testing

### Horsebox Integration Specifics
- Check for Horsebox availability before using (try { execSync('hb --help') } catch)
- Reuse existing indexes when available (check if index directory exists and has content)
- Build indexes incrementally when possible (check timestamp or use --incremental flag if supported)
- Handle Horsebox errors gracefully without breaking main flow (try/catch, warn and continue)
- Store indexes in persistent cache directories (configurable via --download-dir)
- Verify index compatibility before reuse (version checking if available)
- Clean up temporary indexes when appropriate (unless persistence is requested)
- Monitor Horsebox performance and adjust indexing strategies accordingly
- Handle Horsebox version compatibility issues gracefully

## Additional Notes

### SBOM Processing
- Normalize repository URLs (convert git+https:// and git+ssh:// to https://)
- Fetch missing repo URLs from npm registry when needed (with timeout and caching)
- Filter components based on direct/transitive dependencies (--direct-only flag)
- Handle various package lock formats (v1, v2, v3) and package.json structures
- Detect and handle workspaces and monorepo structures appropriately
- Validate SBOM structure before processing (required fields present)
- Deduplicate components by name and version to avoid redundant processing
- Handle scoped packages (@scope/name) correctly in all operations
- Provide fallback to package.json when lockfile is missing or incomplete

### Directory Structure
- `src/` - Source code (main entry point and library modules)
- `src/lib/` - Library modules (specialized functionality)
- `tests/` - Test files (unit tests for each library module)
- `coverage` - Istanbul coverage reports (generated by npm test)
- `src_modules/` - Dependency source code (downloaded during execution)
- `.horsebox/` - Horsebox indexes (created in cache/download directories)
- Temporary directories: created in OS temp directory with ctest prefix
- Cache directory: ~/.ctest/repos (for downloaded dependencies)
- Generated files: .md files alongside source files, CTEST_CHECKLIST.md in project root
- Reports: reports/ (for lint and test reports)

### Environment Requirements
- Node.js >= 14.x (for modern JavaScript features and API consistency)
- Horsebox installed globally (`hb` command available in PATH)
- Internet connection for downloading dependencies (unless using cache)
- Sufficient disk space for dependency repositories (varies based on project)
- rsync command available for efficient file copying (with fallback to native copy)
- Python and uv for Horsebox installation (documented in README)
- Reasonable file system permissions for creating directories and files

### CLI Interface
- Support for both positional (project path) and named arguments (--flag=value)
- Sensible defaults for all options (downloadDir defaults to ~/.ctest/repos)
- Clear error messages with actionable guidance (what went wrong and how to fix it)
- Progress indication for long-running operations (console logs for major steps)
- Non-zero exit codes for failure cases (distinct codes for different error types if beneficial)
- Help text available (could be enhanced with --help flag)
- Validate conflicting options (e.g., --file and directory scanning options)
- Provide usage examples in error messages when appropriate
- Color-coded output consideration (though not currently implemented)