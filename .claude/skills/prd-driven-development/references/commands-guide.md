# Commands Guide - PRD-Driven Development

This reference provides detailed documentation for the core PRD-driven development workflow phases.

## How to Use This Guide

**Workflow phases are built into the skill.** You don't need separate slash command files. Instead:

1. **Invoke the skill once:**
   ```
   skill: prd-driven-development
   ```

2. **Use natural language for phases:**
   ```
   "Import PRDs from specs/features.md"
   "Create a PRD for user authentication"
   "Generate tasks from prds/0001.md"
   ```

Throughout this guide, phrases like `@import-prds` are **workflow phase references**, not literal commands.

---

## Decision Trees

Use these flowcharts to determine which workflow phase to use.

### Decision Tree 1: When to Use @import-prds vs @create-prd

```
Do you have a SINGLE file with MULTIPLE features described?
  ├─ Yes → Use Phase 1: Import PRDs (@import-prds)
  │         - Parses bundle
  │         - Creates draft PRDs for each feature
  │         - Builds dependency graph
  │         - Then use @create-prd on each draft to finalize
  │
  └─ No → Do you have a SINGLE feature to implement?
            ├─ Yes → Use Phase 2: Create PRD (@create-prd)
            │         - Directly creates finalized PRD
            │         - Claude asks clarifying questions
            │         - Generates PRD-####-FR-n IDs
            │
            └─ No → Already have finalized PRDs?
                      └─ Use Phase 3: Generate Tasks (@generate-tasks)
```

### Decision Tree 2: When Do I Need CLAUDE.md?

```
Starting PRD-driven development workflow?
  ├─ CLAUDE.md exists and filled?
  │   ├─ Yes → Proceed with workflow phases
  │   │
  │   └─ No (has template text) → Claude will prompt:
  │                                "Apply defaults? (yes/customize)"
  │                                Defaults = unit + integration + E2E (auto)
  │
  └─ CLAUDE.md missing?
        ├─ CLAUDE.md.template exists?
        │   ├─ Yes → Claude copies to CLAUDE.md
        │   │         Guides you to fill minimum sections
        │   │         Then proceeds
        │   │
        │   └─ No → Claude generates basic CLAUDE.md
        │             Detects stack from package.json/requirements.txt
        │             Creates with placeholders
        │             Prompts to fill before continuing
        │
        └─ Continue? → Must have CLAUDE.md before proceeding
```

### Decision Tree 3: Which Test Types Should I Require?

```
What type of feature are you building?
  ├─ Backend API only (no frontend)?
  │   ├─ Set in CLAUDE.md:
  │   │   - Unit: REQUIRED (business logic)
  │   │   - Integration: REQUIRED (API endpoints, DB operations)
  │   │   - E2E: Not applicable (backend only)
  │   │
  │   └─ Workflow generates: unit + integration tests only
  │
  ├─ Frontend + Backend (full-stack)?
  │   ├─ Has user-facing UI flows? (login, registration, CRUD, forms)
  │   │   ├─ Yes → Set in CLAUDE.md:
  │   │   │          - Unit: REQUIRED
  │   │   │          - Integration: REQUIRED
  │   │   │          - E2E: REQUIRED (Playwright/Cypress)
  │   │   │          Workflow auto-detects E2E needs
  │   │   │
  │   │   └─ No (internal admin tool, simple UI) →
  │   │              - Unit: REQUIRED
  │   │              - Integration: REQUIRED
  │   │              - E2E: Optional (specify in CLAUDE.md)
  │   │
  │   └─ Workflow generates: unit + integration + E2E (if applicable)
  │
  ├─ Infrastructure/scripts/config?
  │   ├─ Set in CLAUDE.md:
  │   │   - Unit: For core logic only
  │   │   - Integration: Optional
  │   │   - E2E: None
  │   │   Use "simple" PRD complexity
  │   │
  │   └─ Workflow generates: minimal unit tests only
  │
  └─ Bug fix (no new functionality)?
        └─ Inherit existing test requirements
            Add tests for bug scenario only
```

### Decision Tree 4: What to Do When Tests Fail

```
Test failures during workflow execution?
  ├─ Are tests newly written (test-first)?
  │   ├─ Yes → Expected! Implementation not written yet
  │   │         Mark sub-task complete (failures expected at this stage)
  │   │         Proceed to implementation sub-task
  │   │         Then rerun tests
  │   │
  │   └─ No (tests should pass) → Debug failures
  │
  ├─ Debug approach:
  │   ├─ Infrastructure issue? (database not running, browser not installed)
  │   │   ├─ Fix infrastructure:
  │   │   │   - Start docker-compose services
  │   │   │   - Run `npx playwright install`
  │   │   │   - Verify Testcontainers working
  │   │   │
  │   │   └─ Rerun tests after fix
  │   │
  │   ├─ Code issue? (logic bug, wrong assertion)
  │   │   ├─ Fix code/test assertion
  │   │   │
  │   │   └─ Rerun tests after fix
  │   │
  │   └─ Dependency not ready? (blocked by another task)
  │         ├─ Properly mark test as skipped:
  │         │   test.skip('PRD-0007-FR-5', () => {
  │         │     // BLOCKED_BY_TASK 3.2: Payment API not deployed
  │         │     // Mitigation: Using mock payment service
  │         │     // ETA: 2025-01-20 | Owner: @jane | Safe: Yes (feature flag)
  │         │   });
  │         │
  │         ├─ Add to Deferred/Skipped Tests section
  │         │
  │         └─ Mark sub-task complete (test properly deferred)
  │
  └─ After 30 minutes of debugging with no progress?
        └─ Follow escalation path (see SKILL.md "Escalation Paths & Troubleshooting")
            - Document what you tried
            - Ask for help with specific questions
            - Get clarification or workaround
            - Update CLAUDE.md if infrastructure limitation discovered
```

### Decision Tree 5: When to Run Test Audit

```
When should I audit tests?
  ├─ After completing a parent task?
  │   ├─ Yes → Run targeted audit:
  │   │         "Audit tests for completed features"
  │   │         Scope: completed-only
  │   │         Identifies gaps in current work
  │   │
  │   └─ No → Continue implementation
  │
  ├─ Before marking PRD complete?
  │   ├─ Yes → Run comprehensive audit:
  │   │         "Audit all tests with test execution"
  │   │         Scope: all-tasks, with-run
  │   │         Validates entire PRD implementation
  │   │
  │   └─ No → Continue work
  │
  ├─ During code review?
  │   ├─ Yes → Run audit on specific area:
  │   │         "Audit unit tests in src/features/auth"
  │   │         Focuses on code under review
  │   │
  │   └─ No → Proceed with review
  │
  └─ Suspected test quality issues? (flaky tests, wrong assertions)
        └─ Run correctness audit:
            "Audit all tests for completed features"
            Reviews assertions match PRD requirements
```

### Decision Tree 6: When to Extend vs Create New PRD

```
Want to add new functionality to existing feature?
  ├─ Is the PRD completed (all tasks done)?
  │   ├─ Yes → Continue to compatibility check
  │   │
  │   └─ No (PRD in progress) → Don't extend yet
  │                              Complete current work first
  │                              Then extend if needed
  │
  ├─ Compatibility check: Is new functionality backward compatible?
  │   ├─ Does it ADD new FRs/NFRs without changing existing ones?
  │   │   ├─ Yes → Extension criteria met ✅
  │   │   │         Example: Add OAuth to existing email auth
  │   │   │
  │   │   └─ No → Does it MODIFY existing FR definitions?
  │   │             └─ Yes → Breaking change ❌
  │   │                       Create new PRD instead
  │   │
  │   ├─ Can it be implemented WITHOUT rewriting existing code?
  │   │   ├─ Yes → Extension criteria met ✅
  │   │   │         Example: Add new payment method alongside existing
  │   │   │
  │   │   └─ No → Requires existing code rewrites?
  │   │             └─ Yes → Breaking change ❌
  │   │                       Create new PRD instead
  │   │
  │   ├─ Are architecture changes backward compatible?
  │   │   ├─ Yes → Extension criteria met ✅
  │   │   │         Example: Add new optional microservice
  │   │   │
  │   │   └─ No → Incompatible architecture changes?
  │   │             └─ Yes → Breaking change ❌
  │   │                       Create new PRD instead
  │   │
  │   └─ Does it change existing API contracts?
  │         ├─ No (only adds new endpoints) → Extension criteria met ✅
  │         │
  │         └─ Yes (modifies existing endpoints) → Breaking change ❌
  │                   Create new PRD instead
  │
  ├─ Extension approved (all criteria met)?
  │   └─ Use Phase 2b: Extend PRD (@extend-prd)
  │       - Increments version (1.0 → 2.0)
  │       - Adds new FRs/NFRs with sequential IDs
  │       - Appends tasks to existing task file
  │       - Updates status to "In Progress"
  │       - Preserves v1.0 as complete
  │
  └─ Breaking change detected?
        └─ Use Phase 2: Create New PRD (@create-prd)
            - Starts fresh PRD with version 1.0
            - Independent task file
            - Can reference old PRD as predecessor
            - Old PRD marked as "Superseded" (optional)
```

**Quick Reference:**

| Scenario | Extension? | Action |
|----------|-----------|--------|
| Add OAuth to existing auth | ✅ Yes | @extend-prd PRD-0001 with OAuth |
| Add new payment method | ✅ Yes | @extend-prd PRD-0002 with Apple Pay |
| Change password validation rules | ❌ No | @create-prd for new auth system |
| Rewrite API from REST to GraphQL | ❌ No | @create-prd for GraphQL API |
| Add optional caching layer | ✅ Yes | @extend-prd PRD-0003 with Redis cache |
| Migrate database schema | ❌ No | @create-prd for migration |

---

## Core Workflow Commands

The PRD-driven development workflow consists of 6 phases:

1. **Phase 1: Import PRDs** (optional) - Parse feature bundles into draft PRDs
2. **Phase 2: Create PRD** - Create comprehensive Product Requirements Documents
3. **Phase 2b: Extend PRD** (optional) - Extend existing PRD with new requirements (version increment)
4. **Phase 3: Generate Tasks** - Break down PRDs into actionable task lists
5. **Phase 4: Process Task List** - Execute tasks systematically with quality gates
6. **Phase 5: Test Audit** (optional) - Verify test coverage and correctness
7. **Phase 6: Status Report** (optional) - Generate comprehensive PRD status report

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

## @extend-prd

**Purpose:** Extend an existing PRD with new requirements (version increment)

**Usage:**
```bash
@extend-prd PRD-#### [EXTENSION_DESCRIPTION]
```

**Examples:**
```bash
# Extend with OAuth
"Extend PRD-0001 with OAuth authentication (Google, GitHub)"

# Extend with new payment methods
"Extend PRD-0002 with Apple Pay and Google Pay support"
```

**Smart Detection:**
- **Extension (✅):** Backward compatible → Updates PRD, appends tasks
- **Breaking change (❌):** Incompatible → Suggests new PRD

**Process:**
1. Read existing PRD file
2. Analyze extension requirements (ask clarifying questions)
3. Detect extension vs breaking change
4. Update PRD file (increment version, add FRs/NFRs)
5. Append tasks to existing task file
6. Update `prds/_index.md` (change status to In Progress)

**Extension Criteria (Automatic Approval):**
- Adds new FRs/NFRs with incremented IDs (FR-6, FR-7, etc.)
- Doesn't modify existing FR acceptance criteria
- Backward compatible architecture changes
- Can be implemented without rewriting existing code

**Breaking Change Criteria (Suggests New PRD):**
- Modifies existing FR definitions
- Requires existing code rewrites
- Incompatible architecture changes
- Changes existing API contracts

**Deliverable:**
- Updated PRD file (v2.0)
- Appended tasks in task file
- Updated status index

**When NOT to use:**
- Breaking changes (modify existing FRs)
- Complete rewrites
- Architectural incompatibilities
→ Use @create-prd for new PRD instead

---

## @generate-tasks

**Purpose:** Break down PRD into structured, actionable task list with relevant files, dependencies, and detailed sub-tasks.

**Usage:**
```bash
@generate-tasks <PATH_TO_PRD_FILE>
```

**Prerequisites:**
- `CLAUDE.md` exists with Architecture/Stack section
- **READ Testing Strategy section to determine which test types are required/excluded**
- Test environment standards confirmed for required test types

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

**Phase 2 - Sub-Tasks (CLAUDE.md-Driven Test Coverage):**
After user confirmation:

**1. Parse CLAUDE.md Testing Strategy First**

Determine which test types apply:
- Explicitly REQUIRED → Generate with mandatory enforcement
- Explicitly EXCLUDED → Do NOT generate, add exclusion note
- Silent/unclear → Default to unit + integration required, E2E for UI-backend features

**2. Generate Test Sub-Tasks Per CLAUDE.md Requirements**

For EACH parent task, break down into sub-tasks following pattern:

**If CLAUDE.md requires unit tests (or is silent):**
- [ ] Write unit tests for FR-n (business logic, validation, utilities)
- [ ] Run unit tests and fix ALL failures (invest effort, do not skip easily)

**If CLAUDE.md requires integration tests (or is silent):**
- [ ] Write integration tests for FR-n (API contracts, DB operations, service integration)
- [ ] Run integration tests and fix ALL failures (invest effort, do not skip easily)

**If CLAUDE.md requires E2E tests AND FR involves frontend-backend (or is silent + frontend-backend):**
Auto-detect: login, registration, CRUD operations, chatbots, SSE, forms, etc.
- [ ] Write E2E tests for FR-n (user flows, UI-to-API integration)
- [ ] Run E2E tests and fix ALL failures (invest effort, do not skip easily)

**If CLAUDE.md explicitly excludes a test type:**
- [ ] DO NOT generate test sub-tasks for excluded type
- [ ] Add note: "X tests excluded per CLAUDE.md Testing Strategy"

**Implementation sub-task (always included):**
- [ ] Implement functionality for FR-n

**Only skip tests when:**
- CLAUDE.md explicitly excludes that test type
- Dependencies truly not available (mark with BLOCKED_BY_TASK x.y)
- Infrastructure not ready (document in Deferred/Skipped Tests section)
- NEVER skip due to difficulty - invest significant effort to make tests work

3. Include PRD FR/NFR tokens in test names/describes
4. For APIs, include Implementation Checklist
5. For NFR tasks, include measurable checks/harnesses
6. Update or create `tasks/_index.md` for global dependencies

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
2. **Parses CLAUDE.md Testing Strategy to identify required/excluded test types**
3. Parses arguments for test category, path, scope, run mode
4. Locates specifications, PRDs, features, and design docs
5. Identifies test locations based on category and path
6. Analyzes test coverage AND correctness **against CLAUDE.md requirements:**
   - For REQUIRED test types: Flag missing tests as CRITICAL issues
   - For EXCLUDED test types: Flag unexpected tests as INFO (shouldn't exist)
   - For SILENT/unclear: Apply defaults (unit + integration + E2E for UI-backend)
   - Maps tests to specs/FRs/NFRs
   - Verifies assertions match expected behavior
   - Identifies missing, incorrect, conflicting, or incomplete tests
   - Builds FR/NFR traceability matrix
   - Audits deferred/skipped tests
7. Optionally runs tests (with-run or full-run)
8. Generates TEST_AUDIT.md report with CLAUDE.md compliance section

**Deliverable: TEST_AUDIT.md**

The audit report includes:

- **Executive Summary:** Category audited, scope, coverage %, critical findings
- **CLAUDE.md Compliance:** (NEW)
  - Required test types from CLAUDE.md
  - Excluded test types from CLAUDE.md
  - Compliance status for each test type
  - Violations (missing required tests, unexpected excluded tests)
- **Coverage Gaps:** Missing tests by FR/NFR ID with severity (CRITICAL if required by CLAUDE.md)
- **Correctness Issues:** Tests with wrong assertions, contradictions, false positives
- **Test Quality Issues:** Incomplete, ambiguous, outdated tests
- **FR/NFR Traceability Matrix:** Mapping with pass/fail/skip status
- **Deferred/Skipped Tests Review:** BLOCKED_BY_TASK validation, "too hard" anti-patterns
- **Quality Gates Summary:** Lint, type, security, coverage vs CLAUDE.md thresholds
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

## CLAUDE.md Authority & Override Examples

### Principle: CLAUDE.md is the Source of Truth

The skill MUST respect CLAUDE.md Testing Strategy as authoritative. Explicit requirements/exclusions override all defaults.

---

### Example 1: Full Test Coverage Required

**CLAUDE.md:**
```markdown
## 6. Testing Strategy
- Unit: Jest with React Testing Library (REQUIRED for all components and business logic)
- Integration: Supertest + TestContainers with PostgreSQL (REQUIRED for all API endpoints)
- E2E: Playwright (REQUIRED for critical user flows: auth, checkout, account management)
- Coverage targets: >=85% lines, >=80% branches
```

**Skill Behavior:**
✅ Generates unit + integration + E2E test sub-tasks
✅ Enforces "make effort" principle for all three types
✅ Flags missing tests as CRITICAL in audit
✅ Auto-detects E2E requirements for auth/checkout flows
✅ Validates coverage against 85%/80% thresholds

---

### Example 2: E2E Excluded (Infrastructure Unavailable)

**CLAUDE.md:**
```markdown
## 6. Testing Strategy
- Unit: pytest (REQUIRED)
- Integration: TestContainers with PostgreSQL (REQUIRED)
- E2E: None - Playwright infrastructure planned for Sprint 5, currently unavailable
- Coverage targets: >=90% for unit+integration combined
```

**Skill Behavior:**
✅ Generates unit + integration test sub-tasks ONLY
✅ Does NOT generate E2E tests (respects explicit exclusion)
✅ Adds note: "E2E tests excluded per CLAUDE.md: Infrastructure unavailable, planned Sprint 5"
✅ Does NOT flag missing E2E tests in audit (excluded is compliant)
✅ Validates coverage against 90% threshold

**Anti-Pattern (What NOT to do):**
❌ Generating E2E tests anyway because "it's best practice"
❌ Flagging missing E2E as critical issue in audit
❌ Ignoring CLAUDE.md exclusion

---

### Example 3: Backend API Only (E2E Not Applicable)

**CLAUDE.md:**
```markdown
## 6. Testing Strategy
- Unit: Go testing package (REQUIRED for all business logic)
- Integration: Testcontainers with PostgreSQL + Redis (REQUIRED for all API handlers)
- E2E: Not applicable - this is a backend API service with no frontend
- Coverage targets: >=80% lines
```

**Skill Behavior:**
✅ Generates unit + integration test sub-tasks
✅ Does NOT generate E2E tests (not applicable)
✅ Adds note: "E2E tests not applicable per CLAUDE.md: Backend API service only"
✅ Focuses effort on comprehensive unit + integration coverage
✅ Validates coverage against 80% threshold

---

### Example 4: Vague/Template CLAUDE.md (Apply Defaults)

**CLAUDE.md:**
```markdown
## 6. Testing Strategy
- Unit: [Framework(s), location patterns]
- Integration: [Real services/DB; fixtures; how to run]
- E2E/Smoke: [Tooling, critical paths]
- Coverage targets: [e.g., >=85% lines]
```

**Skill Behavior:**
✅ Treats as SILENT/unclear requirements
✅ Applies DEFAULT enforcement:
  - Unit: REQUIRED for all FRs
  - Integration: REQUIRED for all FRs
  - E2E: Auto-detect for frontend-backend features (login, CRUD, forms, real-time)
✅ Generates appropriate test sub-tasks based on feature type
✅ Prompts user to fill in CLAUDE.md Testing Strategy for clarity
⚠️ May ask clarifying questions during @create-prd or @generate-tasks

**Recommendation:**
Fill in CLAUDE.md Testing Strategy before running workflow to avoid ambiguity.

---

### Example 5: Mixed Requirements (Some Required, Some Excluded)

**CLAUDE.md:**
```markdown
## 6. Testing Strategy
- Unit: Jest (REQUIRED for all TypeScript code)
- Integration: None - External APIs mocked in unit tests, no real integration environment
- E2E: Cypress (REQUIRED for user-facing features only, not admin panels)
- Coverage targets: >=75% lines
```

**Skill Behavior:**
✅ Generates unit test sub-tasks for ALL FRs
✅ Does NOT generate integration test sub-tasks (explicit exclusion)
✅ Generates E2E test sub-tasks ONLY for user-facing features:
  - ✅ E2E for: login, registration, product browsing, checkout
  - ❌ NO E2E for: admin dashboards, internal tools
✅ Adds notes explaining exclusions and scoped E2E
✅ Validates coverage against 75% threshold

---

### Example 6: CLAUDE.md Says Required But Tests Failing

**CLAUDE.md:**
```markdown
- Integration: Testcontainers with PostgreSQL (REQUIRED)
```

**Scenario:** Integration tests keep failing due to container setup issues

**WRONG Behavior (Anti-Pattern):**
❌ "Integration tests are too hard, skipping for now"
❌ Commenting out failing tests
❌ Marking sub-task complete with tests skipped

**CORRECT Behavior ("Make Effort" Principle):**
✅ Invest significant time debugging Testcontainers setup
✅ Research Testcontainers documentation and examples
✅ Check Docker configuration, permissions, port conflicts
✅ Ask for help with container orchestration if needed
✅ Document setup steps for future developers
✅ Only mark BLOCKED_BY_TASK if dependency truly unavailable (e.g., DB migration not ready)
✅ Only mark sub-task complete when tests PASSING or validly blocked

**Acceptable Skip (with justification):**
```markdown
## Deferred/Skipped Tests
- `tests/integration/payment-processor.int.test.ts` - BLOCKED_BY_TASK 4.2 (payment gateway integration not complete), FR-12
```

**Unacceptable Skip:**
```markdown
❌ "Integration tests too hard to set up, will do later"
❌ "Testcontainers not working, skipping"
```

---

### Validation Checklist for @generate-tasks

Before generating sub-tasks:
- [ ] Read CLAUDE.md Testing Strategy section
- [ ] Identify REQUIRED test types (explicit or defaulted)
- [ ] Identify EXCLUDED test types (explicit only)
- [ ] Generate test sub-tasks for REQUIRED types only
- [ ] Add exclusion notes for EXCLUDED types
- [ ] Enforce "make effort" principle for REQUIRED types
- [ ] Do NOT generate tests for EXCLUDED types

---

### E2E Test Auto-Detection Criteria

The workflow automatically identifies when E2E tests are required based on FR descriptions.

**E2E Required - Frontend-Backend Interactions:**

✅ User authentication:
- "User can log in with email/password"
- "User can register a new account"
- "User can reset forgotten password"
- "User can log out and end session"

✅ Resource CRUD via UI:
- "Admin can create new products via form"
- "User can edit their profile information"
- "User can delete their saved items"
- "User can view list of orders with pagination"

✅ Form submissions:
- "User can submit contact form and receive confirmation"
- "User can upload files with progress indicator"
- "User can save draft and publish later"

✅ Real-time features:
- "User can chat with AI assistant and see responses stream"
- "User receives live notifications via SSE"
- "User sees real-time updates from other users"
- "Dashboard displays live metrics via WebSocket"

✅ Multi-step workflows:
- "User completes checkout process (cart → shipping → payment → confirmation)"
- "User onboarding wizard (profile → preferences → verification)"

**E2E NOT Required - Backend/Utility Only:**

❌ Pure backend logic:
- "System validates email format" → Unit test sufficient
- "API rate limits requests per IP" → Integration test sufficient
- "Database indexes improve query performance" → Integration test sufficient

❌ Utility functions:
- "Helper function formats currency" → Unit test sufficient
- "Logger redacts sensitive fields" → Unit test sufficient

❌ Internal services:
- "Background job processes queue" → Integration test sufficient
- "Cache invalidation on update" → Integration test sufficient

**When in Doubt:**
- If end-user interacts with UI that calls backend API → E2E required
- If internal system behavior or pure backend → Unit + Integration sufficient

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

---

## @status-report

**Purpose:** Generate comprehensive PRD status report

**Usage:**
```bash
@status-report [[all|in-progress|blocked|summary|PRD-####]]
```

**Examples:**
```bash
# Full report
@status-report

# In-progress only (daily standup)
@status-report in-progress

# Single PRD detail
@status-report PRD-0001

# Executive summary
@status-report summary
```

**Report Sections:**
- Executive Summary (project health, velocity)
- In Progress PRDs (sorted by %)
- Recently Completed (last 30 days)
- Draft PRDs
- Blocked PRDs (with blocker details)
- Dependency Chain
- Quality Metrics
- Recommendations

**Source:** Reads from `prds/_index.md` (auto-maintained)

**Deliverable:** `STATUS_REPORT.md`

**When to Use:**
- Daily standups
- Weekly planning
- Stakeholder updates
- Before sprint planning

**Report Example:**

```markdown
# PRD Status Report

**Generated:** 2025-01-15 10:00 AM

## Executive Summary

**Project Health:** On Track

### Overall Progress
- **Total PRDs:** 5
- **✅ Complete:** 3 (60%)
- **🔄 In Progress:** 1 (20%)
- **📋 Draft:** 1 (20%)

### Velocity
- **Completed this week:** 2 PRDs
- **Average time to complete:** 5 days

## 🔄 In Progress PRDs

### PRD-0001: User Registration (v2.0)
- **Status:** 🔄 In Progress
- **Completion:** 60% (3/5 tasks complete)
- **Started:** 2025-01-15
- **Est. Completion:** 2025-01-18

**Current Work:**
- [✅] 1.0 Input Validation
- [✅] 2.0 Database Operations
- [✅] 3.0 API Endpoints
- [ ] 4.0 OAuth Integration (IN PROGRESS)
- [ ] 5.0 Security Hardening

**Version History:**
- v2.0 (current): OAuth authentication extension
- v1.0 (complete): Email/password registration

## Dependency Chain

PRD-0001 (In Progress) 🔄
  └─> PRD-0005 (Blocked - waiting on 0001)

PRD-0002 (Complete) ✅
PRD-0003 (Complete) ✅
PRD-0004 (Draft) 📋
```

**Integration with Workflow:**

Status report reads from `prds/_index.md` which is auto-maintained by:
- Phase 2 (@create-prd) → Adds entry
- Phase 2b (@extend-prd) → Updates version
- Phase 3 (@generate-tasks) → Sets in-progress
- Phase 4 (@process-task-list) → Updates completion %
- Phase 5 (@test-audit) → Validates completion
- Phase 6 (@status-report) → Reads and formats
