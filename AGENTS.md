# Ctest Agent Guidelines

> **CRITICAL:** This file establishes the logical and technical harness for all AI coding agents working in this repository. Every interaction, task, and code generation must obey these rules.

---

## 1. Simple Apprehension (Capturing the Quiddity)

Before writing any code or proposing solutions, you must apprehend the "quiddity" (the true essence) of the project's architecture.

- **Discover the Essence:** Use search tools (`grep`, `read`, `glob`) to capture the eidetic structure of the codebase before proceeding.
- **Concepts over Names:** Distinguish the "name" (the string or identifier) from the "concept" (the mental object and its behavior). Do not assume a function or module does what its name implies without reading its implementation.
- **No Guessing:** If a local API or domain rule is unknown, you must discover it before proceeding. Your pre-trained knowledge is secondary to the local codebase truth.
- **Read First:** Always explore `src/lib/` modules to understand the actual implementation before proposing changes.

---

## 2. Judgment (Architectural Conformity)

Every code change must be a "judgment of conformity" with the existing codebase.

- **The Syllogism of Task:** Treat the existing codebase patterns and rules as the Major Premise. Treat the user's prompt or issue as the Minor Premise. Your generated code (Conclusion) must derive necessarily from both without contradiction.
- **Style Invariance:** Replicate surrounding coding styles, error-handling paradigms, and naming conventions exactly. Match the 2-space indentation, semicolons, and template literals used in this project.
- **Local Patterns First:** Before implementing, observe how similar operations are handled in `src/lib/` (e.g., error handling in `sbom.js`, file operations in `repo-downloader.js`).

---

## 3. Reasoning (Progression of State)

When executing complex or multi-step tasks, you must progress logically from a known truth to a new truth.

- **Nexus of Necessity:** Maintain explicit logical progression. Do not jump from problem to solution without showing the intermediate steps.
- **Statefulness:** Track the current state of your task. If the task has multiple steps, verify each step is complete before proceeding to the next.
- **Apodictic vs. Hypothetical:** Distinguish whether your solution is a necessary proof (apodictic) or a probable guess. Always strive for the former—validate with tests or existing code patterns.

---

## 4. Extreme Programming (XP) & The Cybernetic Pair

You are operating within a rigorous Extreme Programming framework.

- **Pilot-Navigator Ontology:** You are the "Pilot" (executor of the *How*). The human user is the "Navigator" (architect of the *What* and *Why*). Do not usurp architectural intent—execute implementations with tactical precision.
- **Test-Driven Verification (TDD):** Never consider code "plausibly correct" without test coverage. Run `npm test` before concluding any task. If modifying logic, ensure tests pass.
- **Atomic, Production-Ready Increments:** Generate small, stable diffs. Every code emit must be capable of passing CI without breaking existing integrations.
- **Combating Entropy:** Within the strict boundary of your current task, extract local helper functions to maintain interface simplicity. Do not stack new code into monolithic functions.

---

## 5. Harness Operations & Technical Tooling

- **Surgical Edits:** Use native patching tools (`edit`, `write`) to modify files. NEVER use shell commands like `sed`, `awk`, or `echo >>` to mutate source code.
- **Token Awareness:** Avoid loading unnecessary external skills or tools that degrade context window. Use only relevant tools for the task.
- **Build/Lint/Test Commands:**

### Primary Commands
- `npm test` - Runs all Jest tests with coverage (`jest --coverage --silent`)
- `npm run ctest` - Executes the main Ctest analysis (`node src/index.js`)

### Testing Specific Components
- Run a single test file: `npx jest tests/<test-file>.js`
- Run tests matching a pattern: `npx jest -t "test name pattern"`
- Run tests in watch mode: `npx jest --watch`
- Run tests with verbose output: `npx jest --verbose`

### Development Commands
- Install dependencies: `npm install`
- Update dependencies: `npm update`
- Generate SBOM: `node src/index.js . --download-dependencies --direct-only`
- Analyze specific file: `node src/index.js . --file=src/lib/utils.js --download-dependencies`
- Analyze with custom download directory: `node src/index.js . --download-dependencies --download-dir=./deps`
- Limit dependency downloads: `node src/index.js . --download-dependencies --max-downloads=5`
- Lint source code: `npm run lint`
- Fix lint issues: `npm run lint:fix`
- Generate lint report: `npm run lint:report`

---

## 6. Catalog of Real-World Falsehoods

When generating code, guard against established software fallacies:

- **Time:** Never write custom date/time parsing. Use standard libraries. This project uses Node.js `Date` and built-in utilities.
- **Identity & Geography:** This project does not handle user data, but any future additions should use standard localization.
- **Distributed Computing:** Network operations in this project already handle timeouts and retries. Maintain this pattern when adding new HTTP/network code.
- **Authorization:** This CLI tool operates locally. If authorization is added in the future, consider relationship-based access control (ReBAC) principles.

---

## 7. Security & Defensive Code Generation

- **Hostile Input:** When processing user input (file paths, CLI arguments), implement bounds checking (max string length, path validation).
- **Sanitization:** When generating code that feeds text into databases, shell execution, or LLM contexts, enforce strict sanitization. Use parameterized queries for database operations.
- **SSRF Awareness:** HTTP fetchers must account for SSRF protections. Block loopback/private IPs when making requests to external URLs.
- **Tool Arguments are Untrusted:** Validate type, size, and shape of all arguments passed to functions. Use `path.resolve()` to prevent directory traversal.

---

## 8. Pre-Commit Dialectical Verification

Before concluding any task, silently execute this quality checklist:

- [ ] Did I respect the Pilot-Navigator dynamic without overriding the human's architectural intent?
- [ ] Is my code empirically proven by tests (`npm test` passes)?
- [ ] Did I fulfill the task without introducing new dependencies?
- [ ] Is my code styled exactly like the rest of the file (2-space indent, semicolons, template literals)?
- [ ] Did I remove all temporary debugging artifacts (e.g., `console.log`)?
- [ ] Did I strictly avoid unsolicited refactoring of unrelated lines?
- [ ] Is this solution apodictic (provably correct) rather than merely probable?
- [ ] Did I run `npm run lint` and fix any issues?

---

## Code Style Guidelines

### File Organization
- Main entry point: `src/index.js`
- Library modules: `src/lib/` (sbom.js, repo-downloader.js, source-analyzer.js, horsebox.js, markdown-generator.js, test-extractor.js, utils.js)
- Test files: `tests/` (one test file per library module)
- Follow CommonJS module system (`require()`/`module.exports`)
- Use absolute paths for file operations when possible (`path.resolve()`)
- Separate concerns: SBOM generation, repo downloading, source analysis, Horsebox indexing, markdown generation

### Import Conventions
- Group imports: built-in modules (fs, path, os, child_process, https) first, then local modules
- Destructure imports when using multiple exports from same module
- Use relative paths for local imports (`./lib/utils` for same-level)
- Sort imports alphabetically within groups
- Place require statements at top of file, before function declarations

### Code Formatting
- Use 2-space indentation
- Maximum line length: 100 characters
- Use semicolons to terminate statements
- Prefer template literals for string interpolation
- Use `const` for variables that won't be reassigned, `let` for those that will
- Use trailing commas in multi-line object/array definitions

### Type Checking & Validation
- Validate input parameters in public functions (check for null/undefined/empty strings)
- Use JSDoc comments for complex functions
- Check for null/undefined values before accessing properties (optional chaining)
- Use early returns to handle error conditions (guard clauses)
- Validate file/directory existence before operations (`fs.existsSync()` or `fs.promises.access()`)

### Error Handling
- Use try/catch for asynchronous operations and file system operations
- Throw descriptive Error objects with meaningful messages (include context like file paths)
- Log warnings for non-fatal issues (`console.warn`) but continue execution when possible
- Exit with non-zero code for CLI errors (`process.exit(1)`) with clear error message
- Provide fallback mechanisms when primary approaches fail
- Handle specific error types differently when needed (ENOENT vs EACCES)

### Naming Conventions
- camelCase for variables and functions (generateSBOM, copyDirectoryRecursive)
- UPPER_SNAKE_CASE for constants (MAX_DOWNLOADS, DEFAULT_TIMEOUT)
- Descriptive names that convey purpose (filteredProjectPath, downloadInfo)
- Boolean variables prefixed with is/has/can/should (isTestFile, shouldSkipFile)

### Commenting Style
- Use JSDoc for public API functions (`/** @description */`)
- Inline comments for complex logic explanations (explain why, not what)
- TODO comments for future improvements
- Avoid commenting obvious code

### Security Considerations
- Use restrictive file permissions (0o700) for created directories
- Avoid shell injection by using spawnSync instead of execSync
- Validate file paths to prevent directory traversal attacks (`path.resolve()`, `path.isAbsolute()`)
- Validate URLs before making HTTP requests (SSRF prevention)
- Don't log sensitive information even in error cases
- Use proper timeout values for external commands (60s for rsync, 5s for npm registry)

### Testing Practices
- Each library module has corresponding test file (src/lib/utils.js → tests/utils.test.js)
- Test both positive and negative cases
- Mock external dependencies when appropriate
- Use async/await for promise-based testing
- Skip tests when required dependencies aren't available (Horsebox not installed)
- Use descriptive test names that explain what is being tested
- Keep tests focused on single units of behavior

### Performance Considerations
- Cache expensive operations when possible (SBOM generation, Horsebox indexes)
- Use synchronous operations for startup/configuration
- Implement fallback mechanisms for performance-critical paths (rsync fallback to recursive copy)
- Consider memory usage when processing large files
- Use efficient data structures (Sets for uniqueness checks, Maps for lookups)

### Horsebox Integration Specifics
- Check for Horsebox availability before using
- Reuse existing indexes when available
- Handle Horsebox errors gracefully without breaking main flow
- Store indexes in persistent cache directories

---

## Additional Notes

### SBOM Processing
- Auto-detect package manager (pnpm, yarn, or npm) based on lock file presence
- Normalize repository URLs (convert git+https:// and git+ssh:// to https://)
- Fetch missing repo URLs from npm registry when needed
- Filter components based on direct/transitive dependencies (--direct-only flag)
- Handle scoped packages (@scope/name) correctly

### Directory Structure
- `src/` - Source code (main entry point and library modules)
- `src/lib/` - Library modules (specialized functionality)
- `tests/` - Test files (unit tests for each library module)
- `coverage` - Istanbul coverage reports
- `src_modules/` - Dependency source code (downloaded during execution)
- `.horsebox/` - Horsebox indexes
- Cache directory: ~/.ctest/repos (for downloaded dependencies)

### Environment Requirements
- Node.js >= 14.x
- Horsebox installed globally (`hb` command available in PATH)
- Internet connection for downloading dependencies
- rsync command available for efficient file copying (with fallback to native copy)
- Python and uv for Horsebox installation

### CLI Interface
- Support for both positional (project path) and named arguments (--flag=value)
- Sensible defaults for all options
- Clear error messages with actionable guidance
- Non-zero exit codes for failure cases

---

## Ctest Overview (Portuguese)

Ctest é uma ferramenta de linha de comando que analisa projetos npm e gera arquivos markdown com testes das dependências externas para cada arquivo de código-fonte, usando **Horsebox** como mecanismo de busca de código.

### Recursos

- Gera um SBOM CycloneDX para projetos npm
- Baixa código fonte de dependências usando `repo_url`
- Indexa todo o código do projeto e das dependências com Horsebox
- Suporte a índices filecontent e fileline para buscas flexíveis
- Analisa o código-fonte do projeto para identificar funções de libs externas usadas
- Detecta cadeias de member expressions (ex: `prisma.component.upsert`)
- Rastreia instâncias de classes importadas (ex: `new PrismaClient()`)
- Busca no índice Horsebox por ocorrências das funções nas dependências
- Filtra automaticamente para arquivos de teste
- Extrai blocos `test()` / `it()` relevantes
- Gera um arquivo `.md` para cada arquivo de código-fonte com os testes encontrados

### Fluxo de Processamento

1. **Gerar SBOM**: Usa `@cyclonedx/cyclonedx-npm` para criar SBOM CycloneDX
2. **Extrair componentes**: Filtra componentes com `repo_url`
3. **Baixar dependências** (opcional): Clona repositórios via Git
4. **Indexar com Horsebox**: Projeto (filecontent), Dependências (filecontent + fileline)
5. **Analisar arquivos fonte**: Parseia com `@babel/parser`
6. **Buscar testes**: Query Horsebox com termos relevantes
7. **Extrair blocos**: Extrai `test()` / `it()`
8. **Gerar markdown**: Escreve arquivo `.md`

---

## Regras de Criação de Arquivos

Não crie arquivos diretamente em **`/workspaces/ctest`**; crie-os **somente em subdiretórios** dentro desse diretório.
