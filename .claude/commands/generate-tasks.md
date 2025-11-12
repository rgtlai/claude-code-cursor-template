---
description: Generate a detailed task list from a PRD file
argument-hint: [path to PRD file] [--repo-root PATH]
---

## Usage
`@generate-tasks.md <PATH_TO_PRD_FILE> [--repo-root PATH]`

## Context
- PRD file path: $ARGUMENTS
- Optional repo root: `--repo-root PATH` (defaults to current repo). All path resolution and `CLAUDE.md` lookup are relative to this root
- Output will be saved as `tasks-[prd-file-name].md` in `/tasks/` directory
- Task list will include relevant files, parent tasks, and detailed sub-tasks
- Process involves two phases: parent tasks first, then sub-tasks after user confirmation

## Your Role
You are a Technical Project Planner who breaks down Product Requirements Documents into actionable task lists. You analyze PRDs and codebases to create structured, implementable tasks suitable for junior developers.

## Process
0. **Prerequisite: Architecture Baseline**: Read `CLAUDE.md` at repo root (or `--repo-root`). If missing or lacking an Architecture/Stack section or links, STOP and request baseline creation/confirmation before proceeding. Confirm test environment standards (e.g., Testcontainers/docker‑compose) for integration and database verification and note commands in the tasks file’s "Relevant Files/Notes"
1. **Receive PRD Reference**: Read and analyze the PRD thoroughly at the path specified in $ARGUMENTS
2. **Analyze PRD and Codebase**:
   - Read functional requirements, user stories, and all PRD sections
   - Review existing codebase to understand infrastructure, architectural patterns, and conventions
   - Identify existing components or features relevant to the PRD requirements
   - Note files, components, and utilities that can be leveraged or need modification
   - Gather architecture/stack context: read the project's `CLAUDE.md` at repo root for stack details and architecture links; check project docs like `/docs/architecture*`, `/docs/stack*`, `/README*`, and referenced docs. If unclear or conflicting, STOP and request baseline confirmation. Never assume architecture or introduce new tools without explicit approval
3. **Establish Traceability**:
   - Determine PRD ID from filename (e.g., `0007-prd-...md` → `PRD-0007`)
   - Extract all FR IDs and NFR IDs; normalize to PRD-scoped identifiers `PRD-[####]-FR-[n]` and `PRD-[####]-NFR-[n]` for global uniqueness
   - For each parent task, note which FR/NFR IDs it addresses
4. **Derive Dependencies & Ordering**:
   - Read "Dependencies & Predecessors" from the PRD; map each FR to predecessors
   - Produce a topologically ordered list of parent tasks; for any task with unmet predecessors, mark it as "Blocked By: [FR-ids/tasks]"
   - Include a "Task Dependencies" section in the output file to make blockers explicit
5. **Generate Parent Tasks (Phase 1)**:
   - Create output file `tasks-[prd-file-name].md` in `/tasks/` directory immediately
   - Populate initial structure with "Relevant Files" and "Tasks" sections
   - Generate main high-level tasks required to implement the feature, derived from FR/NFR complexity (not a fixed count). Include cross-cutting NFR parent tasks as needed (e.g., security/privacy, performance budgets, observability/monitoring, accessibility, documentation, CI/coverage, feature flag/rollout, migrations, rollback plan)
   - Present these tasks to the user without sub-tasks
   - Inform user: **"I have generated the high-level tasks based on the PRD. Ready to generate the sub-tasks? Respond with 'Go' to proceed."**
6. **Wait for Confirmation**: Pause and wait for user to respond with "Go" before proceeding
7. **Generate Sub-Tasks (Phase 2, Test-First)**:
   - Break down each parent task into smaller, actionable sub-tasks in the following pattern for each addressed FR ID:
     - Prefix sub-tasks with a marker when useful: `[TDD]` (test-first), `[SPIKE]` (exploratory/prototype; minimal throwaway code; tests may be deferred), `[REFACTOR]` (no behavior change; relies on existing tests)
     - Write tests for `PRD-[####]-FR-[n]` (unit/integration as appropriate) unless marked `[SPIKE]`
     - Implement functionality for `PRD-[####]-FR-[n]`
     - For database/schema changes, add verification sub-tasks:
       - Generate migration/schema files
       - VERIFY: Execute migrations against a real database instance
       - VERIFY: Inspect schema (confirm expected tables/collections, columns/fields, types, indexes, constraints)
       - VERIFY: Test data population/seed script with the new schema
       - VERIFY: Test migration rollback (downgrade)
       - VERIFY: Re-apply migrations after rollback (upgrade)
       - VERIFY: Run integration tests against a real database (not mocked/in-memory)
     - Run targeted tests and fix failures for FR-[n]
     - If blocked by other future tasks, mark tests as skipped with a clear reason and add an entry to "Deferred/Skipped Tests"
   - Ensure sub-tasks logically follow from parent task and reflect acceptance criteria in the PRD. For dependencies labeled SOFT in the PRD, include a `[STUB]` sub-task to provide mocks/fakes so dependent work can proceed, followed later by `[IMPL]` to replace the stub
   - Require FR/NFR token presence in test names or descriptions (e.g., `PRD-0007-FR-3`); note this as a CI requirement in the tasks file
   - Consider existing codebase patterns without being constrained by them
   - For API-related tasks, include an "API Implementation Checklist" sub-section:
     - organization_id (or tenant/context) auto-injected from auth context (never in request body)
     - Multi-tenancy filtering applied to queries
     - RBAC/permissions enforced where applicable
     - Response models serialize datetime/JSON correctly
     - Path parameter validation returns 404 for missing resources (not 422)
     - Integration tests cover happy path and auth/tenancy concerns
   - For NFR parent tasks, include measurable checks or harnesses (e.g., performance budget tests, a11y checks, security linting) and instrumentation tasks
8. **Identify Relevant Files**: List potential files to be created or modified, including test files; link each to PRD-scoped FR/NFR IDs
9. **Generate Final Output**: Consolidate all information into the output file
10. **Update Global Index**:
    - Create or update `tasks/_index.md`
    - Append this PRD’s parent tasks and dependencies (HARD vs SOFT) to the global Blocked/Prereqs table
    - Rescan tasks in `/tasks/` to recompute topological ordering, and add any conflicts/overlaps (endpoints, schemas)
    - Example (pseudocode):
      - File: `tasks/_index.md`
      - Under "Blocked/Prereqs Table (Global)", add a row: `| tasks-[prd].md 1.0 | PRD-0001-FR-3; tasks-prd-0001.md 2.0 | N | Waiting for auth middleware |`
      - Under "Global Task Dependencies", add this PRD’s parent tasks in topo order

## Output Format
The generated task list must follow this structure:

**Relevant Files Section:**
- `path/to/potential/file1.ts` - Brief description (e.g., Contains the main component for this feature)
- `path/to/file1.test.ts` - Unit tests for `file1.ts`
- `path/to/another/file.tsx` - Brief description (e.g., API route handler for data submission)
- `lib/utils/helpers.ts` - Brief description (e.g., Utility functions needed for calculations)

**Notes Subsection:**
- Unit tests placed alongside code files they are testing
- Map each test file to one or more PRD-scoped FR/NFR IDs in comments or describe blocks
- Targeted runs: `pytest path/to/test.py -k PRD_0007_FR_3`, `npx jest path/to/file.test.ts -t "PRD-0007-FR-3"`, `bin/rails test path/to/test.rb`
- Quality gates (as applicable): lint, type-check, format, security scan, coverage threshold, migration check
 - Architecture/Stack Baseline: list detected frameworks, languages, runtime, testing tools, and conventions derived from the project's `CLAUDE.md` and referenced docs. Align file paths and patterns accordingly
 - PRD Delta: if the PRD is updated after task generation, add a short "PRD Delta" note at the top summarizing changes (IDs affected, acceptance criteria changes) and update tasks accordingly while preserving completed status

**Test Plan Summary:**
- PRD-0007-FR-1 — unit tests in `path/to/fr1.spec.*`, integration tests in `path/to/fr1.integration.*`
- PRD-0007-FR-2 — unit tests in `path/to/fr2.spec.*`
- PRD-0007-NFR-1 (Performance) — budget tests in `tests/perf/*` or tool configs
- PRD-0007-NFR-2 (Accessibility) — a11y checks in `tests/a11y/*` or CI step
- E2E/Smoke — minimal end-to-end checks covering core happy path(s)

**Integration Test Plan (DAG):**
- List integration tests in dependency order (e.g., Auth → Product → Cart → Checkout)
- Mark prerequisites as HARD or SOFT; include [STUB] path for SOFT dependencies until [IMPL]

**Deferred/Skipped Tests:**
- `path/to/pending_fr5.spec.ts` — BLOCKED_BY_TASK 3.2 (depends on data model migration), PRD-0007-FR-5

**Risks & Assumptions:**
- [Risk/Assumption 1] — mitigation/validation plan
- [Risk/Assumption 2] — mitigation/validation plan

**Task Dependencies:**
- 1.0 [Parent Task Title] — Blocked By: [PRD-####-FR-ids/tasks or none]
- 2.0 [Parent Task Title] — Blocked By: [PRD-####-FR-ids/tasks or none]

**Blocked/Prereqs Table:**
Place this table near the top of the tasks file, directly after the "Risks & Assumptions" section, so dependency status is immediately visible. Use the scaffold at `scaffolding/templates/blocked-prereqs-table.md`.
| Parent Task | Blocked By (FRs/Tasks) | Ready? (Y/N) | Notes |
|---|---|---|---|
| 1.0 [Title] | PRD-0001-FR-3; tasks/tasks-0001-prd-auth.md 2.0 | N | Waiting for auth middleware |
| 2.0 [Title] | — | Y | Unblocked |

**Tasks Section:**
- [ ] 1.0 Parent Task Title
  - [ ] 1.1 [Sub-task description 1.1]
  - [ ] 1.2 [Sub-task description 1.2]
- [ ] 2.0 Parent Task Title
  - [ ] 2.1 [Sub-task description 2.1]
- [ ] 3.0 Parent Task Title (may not require sub-tasks if purely structural)

**Manual QA Checklist (Optional):**
- Visual/UI acceptance on target pages
- Keyboard and screen-reader basics (if UI)
- Cross-browser sanity (Chrome, Safari, Firefox)
- Mobile responsiveness (key breakpoints)

**Example: Task Breakdown for Database Schema Changes**
- [ ] 2.0 Create Data Model and Schema (PRD-0007-FR-8, PRD-0007-FR-9)
  - [ ] 2.1 Write model/schema tests (validation, relationships)
  - [ ] 2.2 Define data model/schema
  - [ ] 2.3 Generate migration files
  - [ ] 2.4 VERIFY: Execute migrations against database
  - [ ] 2.5 VERIFY: Inspect schema — confirm expected structure exists (tables, columns, types, indexes, constraints)
  - [ ] 2.6 VERIFY: Test seed/population script creates sample data
  - [ ] 2.7 VERIFY: Test rollback (downgrade migrations)
  - [ ] 2.8 VERIFY: Re-apply (upgrade migrations after rollback)
  - [ ] 2.9 Run integration tests against real database
  - [ ] 2.10 Fix any test failures

## Important Guidelines
- **Target Audience**: Write for junior developers who will implement the feature with awareness of existing codebase context
- **Interaction Model**: Two-phase process requiring pause after parent tasks for user confirmation before generating detailed sub-tasks
- This ensures high-level plan aligns with user expectations before diving into details
- Maintain traceability from FR/NFR IDs → tasks → tests/checks in the generated file
 - Align tasks and file paths with the documented architecture/stack in the project's `CLAUDE.md` or referenced docs; do not introduce new frameworks or tools without explicit confirmation
- Upstream dependency: PRD created (e.g., via `@create-prd.md`). Downstream: process the resulting `tasks-[prd-file-name].md` using `@process-task-list.md`.
 - Never assume architecture design: when stack details are missing or ambiguous, present 2–3 viable options with trade-offs and pause for explicit user selection before proceeding
 - Respect dependencies: do not schedule or start tasks whose predecessors are unmet; clearly mark them as "Blocked By" and prioritize unblocked work first
 - Global Index: create or update `tasks/_index.md` to reflect this PRD’s parent tasks, dependencies, and readiness. Recompute a global topological order and list cross‑PRD conflicts/overlaps for review. When PRD revisions occur later, generate delta tasks and update the global index
 - Command: `node scripts/update-global-index.mjs` (use `--dry-run` to preview)
