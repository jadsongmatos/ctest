---
name: ctest-review
description: Generates automated Jest tests for a source file using ctest-generated .md as reference. Use when the user wants to generate, write, or create tests based on ctest analysis output.
argument-hint: [source-file-path]
allowed-tools: Read, Glob, Grep, Edit, Write, Bash
---

# Ctest — Generate Automated Tests

Your job is to **write automated Jest tests** for a source file, using the ctest-generated `.md` as a reference for how the external libraries are actually used and tested.

**CRITICAL**: Before writing any code, you must apprehend the "quiddity" (true essence) of this task by reading and understanding the existing codebase patterns. Your generated code must be a judgment of conformity with the existing architecture.

## 1. Determine the target file

**Discover the Essence**: First, understand what we're trying to accomplish by examining the Ctest workflow.

If `$ARGUMENTS` was provided, use it as the source file path.

Otherwise, open `CTEST_CHECKLIST.md` and pick the **first unchecked item** (`- [ ]`). The checklist entry is the path to the `.md` file — remove the `.md` suffix to get the source file path.

## 2. Read both files in parallel

**Concepts over Names**: Before proceeding, completely read both files to understand their true purpose, not just their filenames:

- **Source file**: the file itself (e.g. `src/lib/utils.js`)
- **Ctest markdown**: the same path with `.md` appended (e.g. `src/lib/utils.js.md`)

Read both before doing anything else. **Never guess** what these files contain - verify by reading.

## 3. Understand the source file

**Syllogism of Task**: Treat the existing codebase patterns as your major premise, the user's request as minor premise, and your solution as the necessary conclusion.

From the source file, identify with precision:
- What functions/classes this module **exports** (verify by reading implementation, not assuming from names)
- Which **external libraries** it imports and which methods/functions it calls on them
- What the module is responsible for (single-sentence summary based on actual code behavior)

**No Guessing**: If uncertain about any aspect, re-examine the source until its meaning is evident.

## 4. Mine the ctest markdown for patterns

**Nexus of Necessity**: Progress logically from known truths (the extracted test examples) to new truths (your generated tests).

The `.md` file contains real test blocks extracted from the dependency source code. For each external library section:
- Read the test block examples carefully, seeking to understand their underlying purpose
- Extract the **patterns** they demonstrate: how to set up the library, what inputs to pass, what to assert, how errors are handled
- These are your raw material — adapt them to test **your module's behavior**, not the library itself
- **Distinguish apodictic from hypothetical**: Ensure your adaptations are provably correct based on the patterns shown

## 5. Check for an existing test file

**Extreme Programming Discipline**: Follow the XP principle of test-driven verification.

Look for `tests/<module-name>.test.js` (e.g. `src/lib/utils.js` → `tests/utils.test.js`).

- If it **exists**: read it completely, then **add new `describe`/`it` blocks** for any functions not yet covered. Do not duplicate existing tests.
- If it **does not exist**: create it from scratch following the conventions below, treating each test as an incremental, production-ready change.

## 6. Write the tests

**Pilot-Navigator Ontology**: You are the Pilot (executor of How), the human/user is the Navigator (architect of What/Why). Execute with tactical precision.

Follow the project's Jest conventions with XP discipline:

```js
// CommonJS imports
const someModule = require('../src/lib/example');

// Mock external dependencies (fs, os, child_process, http, etc.) - Security: Mock all I/O to prevent hostile input
jest.mock('fs');
jest.mock('os');

describe('Module Name', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // State management for test isolation
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Clean up after each test
  });

  describe('functionName', () => {
    it('should <expected behavior> when <condition>', () => {
      // Arrange - Atomic, production-ready increment
      // Act 
      // Assert - Empirical safety net
    });

    it('should throw / return null / handle error when <bad input>', () => {
      // Defensive code generation: bounds checking, sanitization
      // Account for: timeouts, retries, SSRF protections where relevant
      // Tool arguments are untrusted: validate type, size, shape defensively
    });
  });
});
```

**Rules (Judgments of Conformity):**
- Test **this module's exported functions**, not the external libraries directly (conformity with module boundaries)
- Use the ctest `.md` test examples as inspiration for edge cases, error conditions, and setup patterns — adapt them to the module under test (reasoning by analogy, not copying)
- Mock all I/O: `fs`, `os`, `child_process`, `https`, `path` (when side-effectful) (security best practice)
- Cover: happy path, edge cases, and error/exception paths for every exported function (XP completeness)
- Use `jest.spyOn` for partial mocks when full mock is too broad (surgical precision)
- Use descriptive names: `should return X when Y` (clarity over cleverness)
- Follow 2-space indentation, semicolons, `const`/`let` (style invariance)
- **Atomic Increments**: Generate small, stable diffs capable of passing CI without breaking existing integrations
- **Combating Entropy**: Within your task boundary, extract local helper functions to prevent technical debt

## 7. Save the test file

**Surgical Edits**: Use native patching tools to modify files. **NEVER** use generic shell commands like `sed`, `awk`, or `echo >>` to mutate source code.

Write or update `tests/<module-name>.test.js` with the generated tests using exact string replacements.

## 8. Cleanup

After the test file is written, execute this dialectical verification internally (Pre-Commit Dialectical Verification):

### 8.1 Mark the checklist item as done

Edit `CTEST_CHECKLIST.md` and change the item from unchecked to checked:

```
- [ ] src/lib/example.js.md   →   - [x] src/lib/example.js.md
```

### 8.2 Delete the ctest-generated `.md` file

Remove the `.md` file that was used as reference (e.g. `src/lib/example.js.md`):

```bash
rm src/lib/example.js.md
```

Both steps are required. Do not skip either one.

**Pre-commit verification checklist (silently execute before reporting completion):**
- [ ] Did I respect the Pilot-Navigator dynamic without overriding the human's architectural intent?
- [ ] Is my code empirically proven by tests (TDD)?
- [ ] Did I fulfill the task without introducing new dependencies?
- [ ] Is my code styled exactly like the rest of the file?
- [ ] Did I remove all temporary debugging artifacts (e.g. `console.log`, `print()`)?
- [ ] Did I strictly avoid unsolicited refactoring of unrelated lines?
- [ ] Is this solution apodictic (provably correct) rather than merely probable?
