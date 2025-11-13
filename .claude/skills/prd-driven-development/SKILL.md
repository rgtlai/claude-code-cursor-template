---
name: prd-driven-development
description: "Systematic PRD-driven software development workflow for Claude Code. Use when the user wants to (1) Import/parse feature bundles into draft PRDs with dependency analysis, (2) Create comprehensive Product Requirements Documents from feature descriptions, (3) Break down PRDs into structured task lists with dependencies and test plans, (4) Systematically execute task lists with quality gates and verification protocols, (5) Audit test coverage and correctness against specifications, or (6) Build complete applications from requirements through to tested implementation following enterprise-grade practices."
---

# PRD-Driven Development Workflow

This skill provides a complete workflow for building software applications from Product Requirements Documents (PRDs) through structured task execution and test auditing, following enterprise-grade development practices with built-in quality gates, dependency management, and traceability.

## Prerequisites

### CLAUDE.md Architecture Baseline (REQUIRED)

All commands require a `CLAUDE.md` file at the repository root containing or linking to:
- System architecture and service boundaries
- Tech stack (languages, frameworks, versions)
- Data stores, migrations, and messaging
- Testing strategy and quality gates
- CI/CD and environments
- Feature flags and rollout practices

**If `CLAUDE.md` is missing or incomplete, STOP and create it using the template in `references/claude-md-template.md`.**

### Global Standards

Define in `CLAUDE.md` or linked docs:
- Performance SLO/SLIs, availability targets
- Accessibility level requirements
- Security/privacy/tenancy model
- Test environment standards (Testcontainers, docker-compose)
- ADR (Architecture Decision Records) workflow

## Core Workflow

### Phase 1: Import Feature Bundle (Optional)

**Command:** `@import-prds <PATH_TO_FEATURES_FILE>`

Use when you have a single spec file containing multiple features.

**Process:**
1. Validate `CLAUDE.md` exists with architecture baseline
2. Parse bundle to identify distinct features
3. Extract draft PRD skeletons with preliminary dependencies and sizing
4. Build `/prd-bundle/index.md` with dependency graph and critical path
5. Detect cross-feature conflicts

**Deliverables:**
- `/prd-bundle/index.md` - Global summary and dependency graph
- `/prd-bundle/[nn]-draft-prd-[feature-name].md` - Draft PRD skeletons

**Next Steps:** Run `@create-prd` on each draft to finalize into `/prds/`

### Phase 2: Create Comprehensive PRD

**Command:** `@create-prd <FEATURE_DESCRIPTION|PATH> [--prd-complexity simple|standard|complex]`

**Complexity Profiles:**
- `simple` - Omits optional sections (use for simple UI features)
- `standard` - Includes common sections (default)
- `complex` - All sections (multi-service, data-heavy features)

**Process:**
1. Validate `CLAUDE.md` architecture baseline
2. Analyze feature description
3. Ask tiered clarifying questions (Critical → Important → Nice-to-have)
4. Generate PRD with PRD-scoped IDs (`PRD-####-FR-n`, `PRD-####-NFR-n`)
5. Save to `/prds/[nnnn]-prd-[feature-name].md`

**Key PRD Sections:**
- Introduction, Goals, User Stories
- Functional Requirements (with PRD-scoped IDs)
- Acceptance Criteria (testable, linked to FR IDs)
- Non-Functional Requirements (measurable targets)
- API Contract, Dependencies & Predecessors
- Test Strategy, Feature Flags & Rollout
- Database Change Verification Checklist
- Operational Readiness, Definition of Done
- Traceability Matrix

**Next Step:** Run `@generate-tasks` on the finalized PRD

### Phase 3: Generate Task List

**Command:** `@generate-tasks <PATH_TO_PRD_FILE>`

**Two-Phase Process:**

**Phase 3.1 - Parent Tasks:**
1. Analyze PRD and existing codebase
2. Extract FR/NFR IDs for traceability
3. Derive dependencies and generate topologically ordered parent tasks
4. Create `tasks/tasks-[prd-name].md` with parent tasks only
5. Present to user and wait for "Go" confirmation

**Phase 3.2 - Sub-Tasks (Test-First):**
After user confirms "Go":
1. Break down each parent into sub-tasks with test-first pattern
2. For database changes, add verification sub-tasks:
   - Generate migration files
   - VERIFY: Execute migrations against database
   - VERIFY: Inspect schema
   - VERIFY: Test seed/population script
   - VERIFY: Test rollback and re-apply
   - Run integration tests against real database
3. Include PRD FR/NFR tokens in test names
4. Update or create `tasks/_index.md` for global dependency tracking

**Deliverables:**
- Relevant Files section with FR/NFR mappings
- Test Plan Summary
- Deferred/Skipped Tests section
- Blocked/Prerequisites Table
- Task Dependencies section
- Tasks with parent and sub-task hierarchy

**Next Step:** Run `@process-task-list` to execute tasks

### Phase 4: Execute Task List

**Command:** `@process-task-list <PATH_TO_TASK_LIST_FILE>`

**Sub-Task Level Protocol:**
1. Check prerequisites - verify parent not blocked
2. Work on ONE sub-task at a time
3. Prefer test-first approach
4. Run targeted tests for current FR(s)
5. Skip tests blocked by future tasks with `BLOCKED_BY_TASK x.y` notation
6. Mark sub-task complete `[x]` immediately after finishing
7. STOP and wait for user approval before next sub-task

**Parent Task Completion Protocol:**
When all sub-tasks under a parent are `[x]`:
1. Run full test suite
2. Apply Quality Gates (lint, type-check, security, coverage)
3. **Database Migration Verification (REQUIRED for DB changes):**
   - Execute migrations against real database
   - Verify schema matches expectations
   - Test data population/seed script
   - Test rollback and re-apply
   - Run integration tests against real DB (not mocked)
4. ONLY if all gates pass: Stage changes
5. Clean up temporary files/code
6. Commit with conventional format including PRD tokens
7. Mark parent task complete `[x]`
8. Update `tasks/_index.md` readiness flags

**Critical Database Verification Mindset:**
```
OLD: Files exist = Work complete
NEW: Files exist + Executed + Verified = Work complete
```

### Phase 5: Audit Test Coverage & Correctness (Optional)

**Command:** `@test-audit [unit|integration|e2e|all] [path] [completed-only|all-tasks] [with-run|full-run]`

**Purpose:** Dual-purpose audit that verifies BOTH test coverage AND test correctness against specifications.

**Examples:**
- `@test-audit` - Prompts for test type, audits entire codebase
- `@test-audit unit` - Audits all unit tests
- `@test-audit unit src/features/auth` - Audits unit tests in specific folder
- `@test-audit all completed-only with-run` - Audits all tests for completed FRs/NFRs and runs them

**Key Features:**
1. **Coverage Analysis:** Identifies missing tests for specifications
2. **Correctness Analysis:** Verifies test assertions match spec requirements
3. **Traceability Verification:** Maps tests to PRD FR/NFR IDs
4. **Skip Hygiene Check:** Validates `BLOCKED_BY_TASK` notation
5. **Quality Gates Review:** Checks lint, type, format, security, coverage
6. **Test Execution:** Optional targeted or full test runs

**Scope Options:**
- `completed-only` (default) - Audit only FRs/NFRs linked to completed tasks `[x]`
- `all-tasks` - Audit all FRs/NFRs in PRD (completed + pending)

**Run Modes:**
- Default: No execution, audit only
- `with-run` - Execute targeted tests for implemented FRs/NFRs
- `full-run` - Execute full test suite

**Deliverable:** `TEST_AUDIT.md` report with:
- Coverage gaps (missing tests)
- Correctness issues (wrong assertions)
- FR/NFR traceability matrix
- Deferred/skipped tests review
- Quality gates summary
- Recommendations (immediate, short-term, long-term)

**When to Use:**
- After completing parent tasks
- Before marking PRD implementation complete
- When verifying test suite quality
- During code review process
- To validate traceability compliance

**Next Step:** Address audit findings, update tests, re-run audit to verify

## Traceability Requirements

Throughout workflow, use PRD-scoped IDs:
- Functional Requirements: `PRD-####-FR-n`
- Non-Functional Requirements: `PRD-####-NFR-n`
- Include in test names, commit messages, and traceability matrix
- Enforce in CI: fail/warn when missing tokens

## Global Dependency Management

**File:** `tasks/_index.md`

Consolidates cross-PRD dependencies and task readiness. Update after each `@generate-tasks` run, when parent tasks complete, or when blockers are resolved.

## Best Practices

### Definition of Ready (DoR) - Before Finalizing PRD
- Architecture and data ownership confirmed
- UX states available or explicitly deferred
- Security/tenancy strategy clarified
- Success metrics aligned to global SLOs
- ADRs drafted and linked (status: Proposed)

### Definition of Done (DoD) - Before Marking Parent Complete
- All sub-tasks completed `[x]`
- Tests written and passing for all FRs
- Integration tests for critical flows passing
- Database verification complete (if applicable)
- Quality gates passed
- No unexplained skipped tests
- Documentation updated
- Feature flags configured
- Operational readiness verified
- Test audit findings addressed (if audit run)

## Quick Reference

### Minimal Getting Started
1. Copy and fill `CLAUDE.md` (see `references/claude-md-template.md`)
2. `@import-prds specs/all_features.md` (if bundle)
3. `@create-prd prd-bundle/0001-draft.md --prd-complexity standard`
4. `@generate-tasks prds/0001-prd-feature.md`
5. `@process-task-list tasks/tasks-0001-prd-feature.md`
6. `@test-audit all completed-only` (verify quality)

### Targeted Test Runs
- Pytest: `pytest path/to/test.py -k PRD_0007_FR_3`
- Jest: `npx jest path/to/test.ts -t "PRD-0007-FR-3"`
- Go: `go test ./... -run PRD_0007_FR_3`

See `references/commands-guide.md` for complete command documentation, all test frameworks, quality gates, and batch execution modes.
