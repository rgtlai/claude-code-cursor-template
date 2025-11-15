# Commands Guide - PRD-Driven Development

This reference provides detailed documentation for the core PRD-driven development workflow commands.

## Core Workflow Commands

The PRD-driven development workflow consists of 5 phases with corresponding commands:

1. **@import-prds** (optional) - Parse feature bundles into draft PRDs
2. **@create-prd** - Create comprehensive Product Requirements Documents
3. **@generate-tasks** - Break down PRDs into actionable task lists
4. **@process-task-list** - Execute tasks systematically with quality gates
5. **@test-audit** (optional) - Verify test coverage and correctness

---

## @import-prds

**Purpose:** Parse a single spec/bundle file containing multiple features, split into draft PRDs, and derive dependency map.

**Usage:**
```bash
@import-prds <PATH_TO_FEATURES_FILE>
```

**Prerequisites:**
- `CLAUDE.md` exists with Architecture/Stack section or links
- Global NFR budgets documented (performance, availability, accessibility, security)

**Process:**
1. Validate architecture baseline
2. Parse bundle to identify distinct features
3. Extract draft PRD skeletons with:
   - Draft FRs and acceptance criteria placeholders
   - Technical/design consideration notes
   - Preliminary dependencies list
   - T-shirt sizing (S/M/L/XL) with rationale
4. Build `/prd-bundle/index.md` with dependency graph
5. Detect cross-feature conflicts (do not resolve)
6. Stop and ask for confirmation before creating final PRDs

**Deliverables:**
- `/prd-bundle/index.md` - Global summary and dependency graph
- `/prd-bundle/[nn]-draft-prd-[feature-name].md` - Draft PRD skeletons

**Next Steps:**
- Run `@create-prd` on each draft to finalize into `/prds/`
- Carry ordering from index into `tasks/_index.md` after generating tasks

**Notes:**
- Does NOT generate code or tasks
- Never assumes architecture - proposes options if missing
- Records suggested architectural choices as pending ADRs

---

## @create-prd

**Purpose:** Generate comprehensive Product Requirements Document for a new feature through structured questioning.

**Usage:**
```bash
@create-prd <FEATURE_DESCRIPTION|PATH> [--prd-complexity simple|standard|complex]
```

**Complexity Profiles:**
- `simple` - Omits optional sections (Design/Technical Considerations, Flags/Rollout, Migration Strategy, Operational Readiness) unless feature involves backend/API or data changes
- `standard` - Default, includes common sections
- `complex` - All sections for multi-service, data-heavy features

**Prerequisites:**
- `CLAUDE.md` exists with complete Architecture/Stack section

**Process:**
1. Validate architecture baseline
2. Analyze feature description (reads from file if PATH provided)
3. Ask tiered clarifying questions:
   - **Critical blockers (must answer):** scope, goal, target user, must-have FRs, constraints, data model, security/tenancy
   - **Important (affect scope/solution):** UX flows, integrations, measurable NFR targets
   - **Nice-to-haves (can defer):** UI polish, stretch goals
4. Generate PRD with PRD-scoped IDs
5. Save to `/prds/[nnnn]-prd-[feature-name].md`

**PRD Structure:**
- Introduction/Overview
- Goals (specific, measurable)
- User Stories (detailed narratives)
- Functional Requirements with PRD-scoped IDs: `PRD-####-FR-n`
- Acceptance Criteria: `PRD-####-FR-n.A`, `PRD-####-FR-n.B`
- Non-Functional Requirements with PRD-scoped IDs: `PRD-####-NFR-n`
- Non-Goals (Out of Scope)
- API Contract (if applicable)
- Error Scenarios & Handling
- Design Considerations (optional)
- Technical Considerations (optional)
- Dependencies & Predecessors
- Test Strategy
- Feature Flags & Rollout
- Data Migration Strategy
- Database Change Verification Checklist (required for schema changes)
- Operational Readiness
- Traceability Matrix
- Definition of Done
- Success Metrics
- Open Questions
- Change Control

**Next Steps:**
- Run `@generate-tasks <PATH_TO_THIS_PRD>` to produce tasks file

**Notes:**
- Target audience: junior developers
- Never assumes architecture - presents options with trade-offs
- Documents dependencies for each FR/NFR
- For APIs, includes Implementation Checklist
- Ensures Definition of Ready (DoR) before finalizing

---

## @generate-tasks

**Purpose:** Break down PRD into structured, actionable task list with relevant files, dependencies, and detailed sub-tasks.

**Usage:**
```bash
@generate-tasks <PATH_TO_PRD_FILE>
```

**Prerequisites:**
- `CLAUDE.md` exists with Architecture/Stack section
- Test environment standards confirmed

**Two-Phase Process:**

**Phase 1 - Parent Tasks:**
1. Read and analyze PRD
2. Review existing codebase for patterns and conventions
3. Extract FR/NFR IDs for traceability
4. Derive dependencies from PRD "Dependencies & Predecessors"
5. Generate topologically ordered parent tasks (typically 4-6)
6. Create `tasks/tasks-[prd-name].md` with structure
7. Present parent tasks to user
8. Wait for user to respond with "Go" to proceed

**Phase 2 - Sub-Tasks (Test-First):**
After user confirmation:
1. Break down each parent into sub-tasks following pattern:
   - Write tests for FR-n (unit/integration)
   - Implement functionality for FR-n
   - For database changes: add verification sub-tasks
   - Run targeted tests and fix failures
   - Mark blocked tests as skipped with `BLOCKED_BY_TASK x.y`
2. Include PRD FR/NFR tokens in test names/describes
3. For APIs, include Implementation Checklist
4. For NFR tasks, include measurable checks/harnesses
5. Update or create `tasks/_index.md` for global dependencies

**Database Verification Pattern:**
```markdown
- [ ] 2.3 Generate migration files
- [ ] 2.4 VERIFY: Execute migrations against database
- [ ] 2.5 VERIFY: Inspect schema (tables, columns, types, indexes, constraints)
- [ ] 2.6 VERIFY: Test seed/population script
- [ ] 2.7 VERIFY: Test rollback (downgrade)
- [ ] 2.8 VERIFY: Re-apply (upgrade after rollback)
- [ ] 2.9 Run integration tests against real database
- [ ] 2.10 Fix any test failures
```

**Deliverables:**
- Relevant Files section with FR/NFR ID mappings
- Test Plan Summary (FR-n → test locations)
- Deferred/Skipped Tests section
- Risks & Assumptions
- Blocked/Prerequisites Table (near top for visibility)
- Task Dependencies section
- Tasks with parent and sub-task hierarchy

**Next Steps:**
- Run `@process-task-list` to execute tasks
- Update `tasks/_index.md` as tasks complete

**Notes:**
- Aligns with documented architecture/stack
- Never introduces new frameworks without confirmation
- Respects dependencies - marks blocked tasks
- Enforces traceability in CI

---

## @process-task-list

**Purpose:** Systematically work through task list, implementing sub-tasks one at a time with proper completion protocols.

**Usage:**
```bash
@process-task-list <PATH_TO_TASK_LIST_FILE>
```

**Options:**
- `--batch parent=X.Y` - Process all sub-tasks under parent X.Y without prompts (still runs tests/gates)
- `--commit-per-subtask` - Commit after each sub-task instead of at parent completion
- `--yes` - Auto-approve proceeding to next sub-task

**Sub-Task Implementation Protocol:**
1. Check prerequisites - verify parent not blocked
2. Work on ONE sub-task at a time
3. Prefer test-first: write/update tests before implementing
4. Run targeted tests for current FR(s)
5. If failures depend on future tasks:
   - Skip affected tests with framework-specific syntax
   - Add to "Deferred/Skipped Tests" with `BLOCKED_BY_TASK x.y` and FR IDs
6. Mark sub-task complete `[x]` immediately after finishing
7. Include PRD FR/NFR tokens in code and commits
8. STOP and wait for user approval before next sub-task

**Parent Task Completion Protocol:**
When all sub-tasks under parent are `[x]`:
1. Run full test suite
2. Apply Quality Gates:
   - Lint, type-check, format validation
   - Security/static analysis
   - Coverage threshold check
   - **Database Migration Verification (REQUIRED for DB changes):**
     - Execute migrations against real database
     - Verify schema matches expectations
     - Test data population/seed script
     - Test rollback (downgrade)
     - Re-apply (upgrade after rollback)
     - Run integration tests against REAL database (not mocked)
   - E2E/smoke tests
   - Feature flag defaults
   - Operational readiness (logging, metrics, runbooks)
3. ONLY if all gates pass: Stage changes (`git add .`)
4. Clean up temporary files/code
5. Commit with conventional format including PRD tokens
6. Mark parent task complete `[x]`
7. Update `tasks/_index.md` readiness flags

**Commit Message Format:**
```bash
git commit -m "feat: add payment validation (PRD-0007-FR-3, PRD-0007-FR-4)" \
           -m "- Validates card type and expiry" \
           -m "- Adds unit tests and integration checks" \
           -m "Related to PRD-0007"
```

**Database Verification Gate:**
Required verifications before marking DB tasks complete:
1. Migration/schema files exist and tracked in version control
2. Migrations executed successfully against database
3. Schema inspection confirms expected structure
4. Data population/seed script runs without errors
5. Integration tests pass against real database instance
6. Rollback works without data loss or errors
7. Re-apply succeeds after rollback

**Anti-Pattern to Avoid:**
```
OLD: Files exist = Work complete
NEW: Files exist + Executed + Verified = Work complete
```

**Notes:**
- Maintains traceability by referencing FR IDs
- Uses targeted test runs during implementation
- Runs full suite at parent completion
- Tracks deferred/skipped tests
- Applies quality gates before committing
- Documents operational changes

---

## @test-audit

**Purpose:** Dual-purpose audit that verifies BOTH test coverage (are tests missing?) AND test correctness (do tests validate the RIGHT behavior as defined in specs?).

**Usage:**
```bash
@test-audit [[unit|integration|e2e|all] [path]] [completed-only|all-tasks] [with-run|full-run]
```

**Examples:**
```bash
# Prompts for test type, audits entire codebase
@test-audit

# Audits all unit tests in codebase
@test-audit unit

# Audits unit tests only in specific folder
@test-audit unit src/features/auth

# Audits all test types in specific folder
@test-audit all tests/integration

# Audit completed FRs/NFRs only and run targeted tests
@test-audit all completed-only with-run

# Audit everything and run full test suite
@test-audit all all-tasks full-run
```

**Key Features:**

1. **Coverage Analysis**
   - Identifies missing tests for specifications
   - Maps features/specs to test files
   - Finds FR/NFR IDs without test coverage

2. **Correctness Analysis**
   - Verifies test assertions match spec requirements
   - Identifies incorrect tests with wrong assertions
   - Finds tests that contradict current specs
   - Detects false positives (tests pass but don't validate correctly)

3. **Traceability Verification**
   - Maps tests to PRD FR/NFR IDs
   - Identifies orphan tests (no FR/NFR mapping)
   - Builds FR/NFR traceability matrix

4. **Skip Hygiene Check**
   - Validates `BLOCKED_BY_TASK x.y` notation in skipped tests
   - Ensures FR/NFR references present
   - Flags skipped tests missing reasons
   - Identifies blockers that are now resolved

5. **Quality Gates Review**
   - Lint, type-check, format validation
   - Security scan results
   - Coverage threshold comparison
   - Migration check status
   - E2E/smoke test status

6. **Test Execution (Optional)**
   - `with-run`: Execute targeted tests for implemented FRs/NFRs
   - `full-run`: Execute entire test suite
   - Captures failures and errors
   - Recommends fixes or skip conversions

**Scope Options:**

- `completed-only` (default)
  - Audits only FR/NFR IDs linked to completed tasks `[x]`
  - Focuses on what's been implemented
  - Ideal for incremental audits

- `all-tasks`
  - Audits all FR/NFR IDs in PRD (completed + pending)
  - Comprehensive coverage check
  - Shows full picture of test needs

**Run Modes:**

- Default (no execution)
  - Audit only, no tests run
  - Fast, read-only analysis
  - Good for quick checks

- `with-run`
  - Executes targeted tests for implemented FRs/NFRs or specified path
  - Validates tests actually pass
  - Focused execution

- `full-run`
  - Executes complete test suite
  - Full validation
  - Time-intensive

**Process:**

1. Validates CLAUDE.md architecture baseline exists
2. Parses arguments for test category, path, scope, run mode
3. Locates specifications, PRDs, features, and design docs
4. Identifies test locations based on category and path
5. Analyzes test coverage AND correctness:
   - Maps tests to specs/FRs/NFRs
   - Verifies assertions match expected behavior
   - Identifies missing, incorrect, conflicting, or incomplete tests
   - Builds FR/NFR traceability matrix
   - Audits deferred/skipped tests
6. Optionally runs tests (with-run or full-run)
7. Generates TEST_AUDIT.md report

**Deliverable: TEST_AUDIT.md**

The audit report includes:

- **Executive Summary:** Category audited, scope, coverage %, critical findings
- **Coverage Gaps:** Missing tests by FR/NFR ID with severity
- **Correctness Issues:** Tests with wrong assertions, contradictions, false positives
- **Test Quality Issues:** Incomplete, ambiguous, outdated tests
- **FR/NFR Traceability Matrix:** Mapping with pass/fail/skip status
- **Deferred/Skipped Tests Review:** BLOCKED_BY_TASK validation
- **Quality Gates Summary:** Lint, type, security, coverage, migrations, E2E
- **Test Failures (Run Mode):** Failing tests with recommended actions
- **Recommendations:** Immediate (Critical), Short-term (High), Long-term (Medium/Low)

**When to Use:**

- After completing parent tasks in `@process-task-list`
- Before marking PRD implementation complete
- During code review process
- When verifying test suite quality
- To validate traceability compliance
- After major refactoring
- Before release/deployment

**Best Practices:**

1. **Run incrementally**: Audit after each parent task completion
2. **Use completed-only**: Focus on implemented features first
3. **Address critical findings first**: Prioritize by severity
4. **Verify correctness, not just coverage**: Wrong tests are as bad as missing tests
5. **Maintain traceability**: Always map tests to FR/NFR IDs
6. **Keep skips clean**: Enforce BLOCKED_BY_TASK notation
7. **Run tests occasionally**: Use with-run to validate assertions actually work
8. **Update tasks file**: Add missing tests to appropriate tasks

**Integration with Workflow:**

```bash
# Typical workflow integration
@process-task-list tasks/tasks-0001.md  # Execute parent 1.0
@test-audit unit completed-only         # Verify tests for completed work
# Address findings
@process-task-list tasks/tasks-0001.md  # Continue with parent 2.0
@test-audit all completed-only with-run # Full audit with execution
# Final verification before PRD completion
```

**Notes:**
- Read-only analysis by default (no code changes)
- Dual focus: coverage AND correctness
- Critical objective: Ensure tests validate RIGHT behavior per specs
- Test execution is optional
- Discovered issues documented but NOT fixed automatically
- Traceability required (PRDs must have FR/NFR IDs)
- Aligned with process-task-list quality gates and DoD

---

## Targeted Test Runs by Framework

### Python - Pytest
```bash
# Run specific FR tests
pytest path/to/test.py -k PRD_0007_FR_3

# Run all tests for a PRD
pytest -k PRD_0007

# Skip syntax
@pytest.mark.skip(reason="BLOCKED_BY_TASK 3.2 PRD-0007-FR-5")
```

### JavaScript/TypeScript - Jest
```bash
# Run specific FR tests
npx jest path/to/file.test.ts -t "PRD-0007-FR-3"

# Run all tests for a PRD
npx jest -t "PRD-0007"

# Skip syntax
test.skip('PRD-0007-FR-5 scenario', () => {...}); // BLOCKED_BY_TASK 3.2
```

### JavaScript - Mocha
```bash
# Run specific FR tests
npx mocha 'test/**/*.spec.ts' -g "PRD-0007-FR-3"

# Skip syntax
it.skip('PRD-0007-FR-5 scenario', ...) // BLOCKED_BY_TASK 3.2
```

### Ruby - RSpec
```bash
# Run specific FR tests
bundle exec rspec spec/path/to_spec.rb --example "PRD-0007-FR-3"

# Skip syntax
pending 'BLOCKED_BY_TASK 3.2 PRD-0007-FR-5'
```

### Ruby - Rails Test
```bash
# Run specific test by line number
bin/rails test test/models/user_test.rb:42

# Run all tests in file
bin/rails test test/models/user_test.rb
```

### Go
```bash
# Run specific FR tests
go test ./... -run PRD_0007_FR_3

# Skip syntax
func TestFeature(t *testing.T) {
    t.Skip("BLOCKED_BY_TASK 3.2 PRD-0007-FR-5")
}
```

### Playwright
```bash
# Run specific FR tests
npx playwright test -g "PRD-0007-FR-3"
```

### Cypress (with grep plugin)
```bash
# Run specific FR tests
npx cypress run --spec "cypress/e2e/path.cy.ts" --env grep=PRD-0007-FR-3
```

---

## Quality Gates - Quick Commands

### Linting
```bash
# Node.js
npm run lint
pnpm lint

# Python
ruff .
flake8 .
pylint src/

# Ruby
rubocop

# Go
golangci-lint run
```

### Type Checking
```bash
# TypeScript
tsc --noEmit

# Python
mypy .
pyright

# Go (built-in)
go vet ./...
```

### Formatting
```bash
# Node.js
npm run format:check
prettier --check .

# Python
black --check .
ruff format --check .

# Ruby
rubocop -A --only Layout

# Go
gofmt -l .
```

### Security/Static Analysis
```bash
# Node.js
npm audit
npm audit fix

# Python
bandit -r .
safety check

# Ruby
bundle audit

# Go
govulncheck ./...
```

### Coverage
```bash
# Jest
jest --coverage

# Pytest
pytest --cov

# Go
go test -cover ./...

# RSpec
bundle exec rspec --format documentation
```

### Database Migrations
```bash
# Rails
bin/rails db:migrate:status
bin/rails db:migrate
bin/rails db:rollback

# Alembic (Python)
alembic current
alembic upgrade head
alembic downgrade -1

# Flyway
flyway info
flyway migrate
flyway undo

# Prisma
npx prisma migrate status
npx prisma migrate deploy
```

---

## Workflow Summary

**Complete PRD-Driven Development Flow:**

```bash
# 1. Setup (one-time)
cp CLAUDE.md.template CLAUDE.md
# Fill minimum sections

# 2. Import bundle (optional)
@import-prds specs/features.md

# 3. Create PRDs
@create-prd prd-bundle/0001-draft.md --prd-complexity standard
@create-prd prd-bundle/0002-draft.md --prd-complexity complex

# 4. Generate tasks
@generate-tasks prds/0001-prd-auth.md
@generate-tasks prds/0002-prd-api.md

# 5. Execute tasks (with incremental audits)
@process-task-list tasks/tasks-0001-prd-auth.md --batch parent=1.0 --yes
@test-audit unit completed-only

@process-task-list tasks/tasks-0001-prd-auth.md --batch parent=2.0 --yes
@test-audit integration completed-only with-run

# 6. Final verification
@test-audit all all-tasks full-run
# Address any findings

# 7. Mark PRD complete
```

---

## Skip Hygiene Best Practices

### Always Include in Skipped Tests:
1. `BLOCKED_BY_TASK x.y` notation
2. Relevant PRD FR/NFR IDs
3. Reason for skip

### Framework Examples:

**Pytest:**
```python
@pytest.mark.skip(reason="BLOCKED_BY_TASK 3.2 PRD-0007-FR-5")
def test_future_feature():
    pass
```

**Jest/Mocha:**
```javascript
test.skip('PRD-0007-FR-5 scenario', () => {
    // BLOCKED_BY_TASK 3.2
});
```

**RSpec:**
```ruby
pending 'BLOCKED_BY_TASK 3.2 PRD-0007-FR-5' do
    # test code
end
```

**Go:**
```go
func TestFeature(t *testing.T) {
    t.Skip("BLOCKED_BY_TASK 3.2 PRD-0007-FR-5")
}
```

### Tracking Skipped Tests

Always add skipped tests to "Deferred/Skipped Tests" section in tasks file:

```markdown
## Deferred/Skipped Tests
- `path/to/pending_fr5.spec.ts` - BLOCKED_BY_TASK 3.2 (depends on data model migration), FR-5
- `path/to/auth_test.py` - BLOCKED_BY_TASK 1.4 (auth middleware incomplete), FR-8, NFR-3
```

---

## Troubleshooting

### Missing CLAUDE.md
**Problem:** Commands stop and request CLAUDE.md
**Solution:** Copy template from `references/claude-md-template.md` and fill required sections

### Blocked Tasks
**Problem:** Tasks can't proceed due to dependencies
**Solution:** 
1. Check `tasks/_index.md` for global view
2. Complete prerequisite tasks first
3. Update Blocked/Prereqs table as items complete

### Database Verification Failures
**Problem:** Migrations created but tests fail
**Solution:**
1. Actually execute migrations against real DB
2. Inspect schema with DB tools
3. Run integration tests against real DB (not mocked)
4. Test rollback and re-apply
5. Only then mark complete

### Skipped Tests Pile Up
**Problem:** Many tests marked BLOCKED_BY_TASK
**Solution:**
1. Track in "Deferred/Skipped Tests" section
2. Revisit when blocking tasks complete
3. Remove skip and run tests
4. Update tasks file

### Test Audit Finds Incorrect Tests
**Problem:** Audit reveals tests with wrong assertions
**Solution:**
1. Review spec/PRD requirements
2. Fix test assertions to match specs
3. Re-run audit to verify
4. Update traceability matrix
