---
description: Audit test coverage AND correctness against specs, features, and design
argument-hint: [[unit|integration|e2e|all] [path]]
---

## Usage
`@test-audit.md [[unit|integration|e2e|all] [path]]`

## Examples
- `@test-audit.md` - Prompts for test type, audits entire codebase
- `@test-audit.md unit` - Audits all unit tests in codebase
- `@test-audit.md src/features/auth` - Prompts for type, audits only tests in that folder
- `@test-audit.md unit src/features/auth` - Audits unit tests only in that folder
- `@test-audit.md src/features/auth unit` - Same as above (argument order flexible)
- `@test-audit.md all tests/integration` - Audits all test types in that folder

## Context
- Test category to audit: Parsed from $ARGUMENTS (unit/integration/e2e/all)
- Optional path restriction: Parsed from $ARGUMENTS (if provided, only audit tests in that folder)
- **Dual-purpose audit**: Verifies BOTH test coverage AND test correctness
- Compares existing tests against current specification sheets, feature documentation, and design requirements
- Identifies missing tests, incorrect test assertions, and discrepancies with specs/features/design
- Generates or appends to `TEST_AUDIT.md` report in root directory
- Use TodoWrite tool to track audit progress across multiple test categories

## Your Role
You are the Test Audit Specialist responsible for comprehensive test analysis against project specifications, features, and design. You systematically review:
1. **Test Coverage**: Are all specs, features, and design requirements tested?
2. **Test Correctness**: Do tests validate the RIGHT behavior as defined in specs/features/design?
3. **Test Accuracy**: Do test assertions match expected outcomes from specifications?
4. **Alignment**: Are tests in sync with current specs, features, and design decisions?

## Process
1. **Argument Parsing**:
   - Parse $ARGUMENTS to extract test category and optional path
   - **Identify test category**: Look for keywords: unit, integration, e2e, or all
   - **Identify path**: Look for directory/file path patterns (contains `/` or looks like a folder structure)
   - **Handle flexible order**: Arguments can be in any order (e.g., "unit src/auth" or "src/auth unit")
   - **Disambiguate unclear input**:
     - If no clear category or path found, ask: "Could you clarify? Are you specifying a test type (unit/integration/e2e/all) or a path?"
     - If only path provided, prompt: "Which test category would you like to audit in `[path]`? (unit/integration/e2e/all)"
     - If neither provided, prompt: "Which test category would you like to audit? (unit/integration/e2e/all)" (assumes entire codebase)
   - **Validate parsed values**:
     - Category must be one of: unit, integration, e2e, or all
     - If path provided, verify it exists; if not, warn user and ask for confirmation
   - For "all", audit each category (unit, integration, e2e) separately

2. **Locate Specifications, Features, and Design Documents**:
   - Check for CLAUDE.md file in root directory for spec and feature references
   - Look for common spec file locations:
     - `/docs/specifications/`, `/specs/`, `/requirements/`
     - Files like: `SPECS.md`, `REQUIREMENTS.md`, `FEATURES.md`, `CHANGELOG.md`
   - Search for feature documentation in:
     - `/docs/features/`, `/docs/`, `/features/`
     - PRD files in `/tasks/` directory
   - Look for design documentation:
     - `/docs/design/`, `/design/`, `/docs/architecture/`
     - Files like: `DESIGN.md`, `UI_SPEC.md`, `API_DESIGN.md`, `ARCHITECTURE.md`
     - Figma links, mockups, wireframes, or design system documentation
   - If multiple spec sources exist, identify the most current version:
     - Check for dates, version numbers, or changelog references
     - Look for "CURRENT", "LATEST", or similar indicators
     - Note any contradictions between documents
   - If specs/design cannot be located or are ambiguous, ask user: "I found [X, Y, Z]. Which file(s) contain the current specs, features, and design requirements?"

3. **Identify Test Locations**:
   - **If path restriction provided**:
     - Scan ONLY within the specified path/folder for test files
     - Ignore all tests outside the specified path
     - If no tests found in path, inform user: "No [category] tests found in `[path]`"
   - **If no path restriction** (entire codebase):
     - Scan entire codebase for test files
   - **Scan patterns based on category**:
     - **Unit tests**: `*.test.{js,ts,jsx,tsx}`, `*.spec.{js,ts,jsx,tsx}`, `/tests/unit/`, `/__tests__/`
     - **Integration tests**: `/tests/integration/`, `*.integration.test.*`, `*.integration.spec.*`
     - **E2E tests**: `/tests/e2e/`, `/e2e/`, `/cypress/`, `/playwright/`, `*.e2e.test.*`
   - Note test framework in use (Jest, Mocha, Pytest, RSpec, Cypress, Playwright, etc.)
   - Log scan scope in report: "Scanned: [entire codebase | path/to/folder]"

4. **Analyze Test Coverage AND Correctness**:
   - Read all test files in the selected category
   - For each test:
     - Map test to corresponding feature/spec/design requirement
     - Verify test assertions match expected behavior from specs
     - Check if test validates correct acceptance criteria
     - Confirm test data and scenarios align with design
   - Identify:
     - **Missing Tests**: Features/specs/design requirements with no test coverage
     - **Incorrect Tests**: Tests with wrong assertions that don't match specs/features/design
     - **Conflicting Tests**: Tests that contradict current specs or validate wrong behavior
     - **Outdated Tests**: Tests for deprecated or removed features
     - **Incomplete Tests**: Tests that don't fully cover spec requirements or edge cases
     - **Ambiguous Tests**: Tests with unclear purpose or poor descriptions
     - **False Positives**: Tests that pass but don't actually validate correct behavior

5. **Source Code Verification** (Optional):
   - If test failures or source code issues are suspected:
     - Create `/diagnose` folder in root directory
     - Write minimal reproduction scripts to verify behavior
     - Run tests if needed to confirm actual behavior
     - Document any source code issues found
   - Include source code issues in TEST_AUDIT.md report

6. **Generate Audit Report**:
   - Check if `TEST_AUDIT.md` exists in root directory
   - If exists: Prepend new audit to top with clear separation
   - If not: Create new file with audit report
   - Include:
     - Audit date and timestamp
     - Category audited (unit/integration/e2e/all)
     - Scan scope (entire codebase or specific path)
     - Summary statistics (total tests, coverage %, issues found)
     - Detailed findings with file references
     - Recommendations prioritized by impact
     - Action items for remediation

## Output Format

### TEST_AUDIT.md Structure

Each audit entry should follow this format:

```markdown
---

# Test Audit Report
**Date**: YYYY-MM-DD HH:MM
**Category**: [unit|integration|e2e|all]
**Scope**: [Entire codebase | path/to/folder]
**Auditor**: Claude Code Test Audit

## Summary
- **Total Tests Analyzed**: [number]
- **Specs/Features/Design Docs Reviewed**: [number]
- **Tests with Correct Coverage**: [number]
- **Tests with Incorrect Assertions**: [number]
- **Missing Tests**: [number]
- **Total Issues Found**: [number]
- **Test Coverage**: [percentage]%
- **Test Correctness**: [percentage]%
- **Critical Issues**: [number]

## Findings

### 1. Missing Test Coverage
Features/specs/design requirements without corresponding tests:

- **[Feature Name]** (spec: [file:line], design: [file:line])
  - Description: [what's missing]
  - Expected behavior per spec: [description]
  - Priority: [Critical|High|Medium|Low]
  - Recommended test file: [path/to/test.spec.js]
  - Test scenarios needed: [list of test cases]

### 2. Incorrect Test Assertions
Tests that exist but validate WRONG behavior or have incorrect assertions:

- **[Test Name]** ([file:line])
  - Current test assertion: [what test checks]
  - Expected per spec/design: [what SHOULD be checked]
  - Discrepancy: [explanation of why test is wrong]
  - Impact: [False sense of security|Validates wrong behavior|etc.]
  - Action: Fix test assertions to match spec at [spec:file:line]

### 3. Conflicting Tests
Tests that contradict current specifications or design:

- **[Test Name]** ([file:line])
  - Current spec/design: [spec description and reference]
  - Test behavior: [what test actually validates]
  - Conflict: [explanation of discrepancy]
  - Root cause: [Outdated test|Wrong spec|Misunderstanding|etc.]
  - Action: [Update test|Update spec|Clarify with team]

### 4. Incomplete Tests
Tests that partially cover requirements but miss edge cases or acceptance criteria:

- **[Test Name]** ([file:line])
  - What's tested: [current coverage]
  - What's missing: [uncovered scenarios from spec]
  - Spec reference: [file:line]
  - Additional test cases needed: [list]

### 5. Outdated Tests
Tests for deprecated or removed features:

- **[Test Name]** ([file:line])
  - Reason: [why it's outdated]
  - Spec status: [Removed in spec version X|Feature deprecated|etc.]
  - Action: [Remove|Update|Archive]

### 6. Source Code Issues (if any)
Issues found in source code during audit:

- **[Issue Description]** ([file:line])
  - Impact: [how it affects tests]
  - Severity: [Critical|High|Medium|Low]
  - Relation to specs: [how it deviates from spec]
  - Recommended fix: [description]

## Recommendations

### Immediate Actions (Critical Priority)
1. [Action item with file references]
2. [Action item with file references]

### Short-term Improvements (High Priority)
1. [Action item with file references]
2. [Action item with file references]

### Long-term Enhancements (Medium/Low Priority)
1. [Action item with file references]
2. [Action item with file references]

## Spec/Feature Document Review

### Primary Specification Sources
- [file:line] - [description and date]

### Contradictions Found
- [Description of any contradictions between spec documents]
- [Recommendation for resolution]

## Test Execution Summary (if tests were run)
```
[Test output or summary]
```

## Next Steps
1. [Concrete action items]
2. [Files to update]
3. [People to consult if needed]

---

[Previous audit entries below...]
```

## Important Guidelines

### Specification, Feature, and Design Analysis
- **Always verify spec currency**: Look for dates, versions, changelog entries
- **Document contradictions**: If specs/features/design conflict, list all versions and ask for clarification
- **Check multiple sources**: PRDs in `/tasks/`, docs in `/docs/`, CLAUDE.md, README.md, design files
- **Trace requirements**: Link each test (or missing test) to specific spec/feature/design requirement
- **Validate correctness**: Don't just check if tests exist—verify they test the RIGHT thing per specs
- **Cross-reference design**: Ensure test data, scenarios, and edge cases match design specifications
- **Check acceptance criteria**: Map test assertions to acceptance criteria from specs/PRDs

### Test Categorization Rules
- **Unit tests**: Test individual functions/methods in isolation with mocks
- **Integration tests**: Test component interactions, API endpoints, database operations
- **E2E tests**: Test complete user workflows through UI or full system paths
- If unsure about test category, note ambiguity in report

### Audit Execution
- **Be thorough**: Read every test file in selected category
- **Validate correctness, not just coverage**: For each test, verify assertions match specs/features/design
- **Check test logic**: Ensure test setup, execution, and assertions validate correct behavior
- **Identify false positives**: Flag tests that pass but don't actually validate what specs require
- **Provide file references**: Always include `file:line` for findings
- **Run tests only if needed**: Optional for verification, not required for audit
- **Use /diagnose for investigation**: Create folder only if source code verification needed
- **Prioritize findings**: Mark Critical/High/Medium/Low based on impact
  - Critical: Tests with incorrect assertions for critical features
  - High: Missing tests for core features or wrong test logic
  - Medium: Incomplete tests or ambiguous test coverage
  - Low: Minor improvements or edge case additions

### Report Formatting
- **Consistent structure**: Follow the output format exactly
- **Clear separation**: Use `---` dividers between audit entries
- **Actionable recommendations**: Provide specific file paths and line numbers
- **Date at top**: Most recent audit always at the top of file
- **Maintain history**: Never remove previous audits

### Communication
- Ask clarifying questions if:
  - Multiple spec versions exist with unclear priority
  - Test categorization is ambiguous
  - Source code behavior doesn't match any spec
  - User's intent for the audit is unclear

## Notes
- This command performs READ-ONLY analysis by default
- **Dual Focus**: Audit BOTH coverage (are tests missing?) AND correctness (are tests wrong?)
- **Critical Objective**: Ensure tests validate the RIGHT behavior as defined in specs, features, and design
- Source code is only run if explicitly needed for verification
- Any code issues discovered are documented but NOT fixed (use @debug.md or @code.md for fixes)
- Tests with incorrect assertions are just as critical as missing tests
- A passing test suite doesn't mean correctness—tests must validate spec requirements accurately
