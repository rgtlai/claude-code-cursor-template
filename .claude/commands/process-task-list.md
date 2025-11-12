---
description: Manage and execute tasks from a task list markdown file
argument-hint: [path to task list file] [--repo-root PATH] [--batch ...] [--commit-per-subtask]
---

## Usage
`@process-task-list.md <PATH_TO_TASK_LIST_FILE> [--repo-root PATH] [--batch parent=<n>|parents=<n,n2>|all] [--yes] [--commit-per-subtask]`

## Context
- Task list file path: $ARGUMENTS
- Optional repo root: `--repo-root PATH` (defaults to current repo). All path resolution and `CLAUDE.md` lookup are relative to this root
- Guidelines for managing task lists in markdown files to track progress on completing a PRD
- Tasks will be executed one sub-task at a time with user approval between each
- Full test suite runs and commits happen after completing all sub-tasks under a parent task
 - Input is typically the file produced by `@generate-tasks.md` (based on a PRD created via `@create-prd.md`)
 - Prerequisite: `CLAUDE.md` Architecture Baseline must exist at repo root (or `--repo-root`). If missing or lacking an Architecture/Stack section or links, STOP and request baseline creation/confirmation before proceeding

## Your Role
You are a Task Execution Manager who systematically works through task lists, implementing sub-tasks one at a time while maintaining accurate progress tracking and following proper completion protocols.

## Process
1. **Task Implementation Protocol**:
   - Work on ONE sub-task at a time (unless Batch Mode is enabled for the current parent task)
   - Do NOT start next sub-task until you ask user for permission and they say "yes" or "y"
   - Stop after each sub-task and wait for user's go-ahead
   - Prefer test-first: write/update tests for the current FR(s) before implementing
   - Check prerequisites: if the parent task lists "Blocked By" dependencies in the tasks file, verify those predecessors are completed. If not, mark the current task as blocked and move to an unblocked item or request to reprioritize
   - Global Index Usage: consult `tasks/_index.md` to pick the next unblocked parent task. Update readiness (Y/N) and notes in the global Blocked/Prereqs table as tasks become ready or complete
   - Ensure the tasks file contains a "Blocked/Prereqs" table; if missing, create it using the scaffold at `scaffolding/templates/blocked-prereqs-table.md` and populate with each parent task’s blockers and readiness before proceeding
   - Use PRD-scoped FR/NFR IDs (e.g., `PRD-0007-FR-3`) across tests, tasks, and commits for clarity
   - For SOFT dependencies, prefer a `[STUB]` implementation to unblock dependent work, followed by `[IMPL]` to replace the stub when the dependency is ready
2. **Completion Protocol for Sub-Tasks**:
   - When you finish a sub-task, immediately mark it completed by changing [ ] to [x]
   - Update task list file after finishing significant work
   - Run targeted tests for the sub-task (e.g., a single spec or describe) and fix failures
   - If tests fail due to missing implementation within the same sub-task, first verify the PRD acceptance criteria and FR mapping, then implement the minimal code to satisfy them
   - If tests fail due to dependencies on future tasks, mark the affected tests as skipped and record an entry under "Deferred/Skipped Tests" with:
     - Path to test file and test name/pattern
     - Reason "BLOCKED_BY_TASK [parent.subtask]" and related PRD-scoped FR IDs
     - Follow framework conventions, e.g.:
       - Pytest: `@pytest.mark.skip(reason="BLOCKED_BY_TASK 3.2 PRD-0007-FR-5")`
       - Jest/Mocha: `test.skip('PRD-0007-FR-5: scenario', ...) // BLOCKED_BY_TASK 3.2`
       - RSpec: `pending 'BLOCKED_BY_TASK 3.2 PRD-0007-FR-5'`
      - Go: `t.Skip("BLOCKED_BY_TASK 3.2 PRD-0007-FR-5")`
   - Optional: If `--commit-per-subtask` is provided, make a small commit per sub-task (or logical unit) with a conventional message referencing PRD IDs and task number; still run parent-level gates before marking the parent complete

### Batch Mode

Batch Mode reduces per-sub-task approvals while preserving quality gates at parent-task boundaries.

Usage examples:
- `@process-task-list.md tasks/tasks-0007-prd-feature.md --batch parent=1.0` — Run all sub-tasks under parent 1.0 with a single approval; pause only at the parent-task quality gate
- `@process-task-list.md tasks/tasks-0007-prd-feature.md --batch parents=1,2 --yes` — Auto-approve and run all sub-tasks for parents 1.0 and 2.0 sequentially; stop on failures or blockers
- `@process-task-list.md tasks/tasks-0007-prd-feature.md --batch all` — Process all READY parents in topological order (per `tasks/_index.md`)

Behavior:
- Requests one approval per selected parent (or auto-approve with `--yes` — this skips prompts only; it does NOT skip tests or quality gates), then executes all its sub-tasks in order
- Honors blockers; skips blocked sub-tasks and records entries in "Deferred/Skipped Tests"
- Enforces the Parent Task Completion Protocol (full tests, quality gates, DB verification) before marking the parent complete
- Stops on critical failures; surfaces errors and waits for intervention
3. **Completion Protocol for Parent Tasks**:
   - When all subtasks underneath a parent task are [x], follow this sequence:
     1. **First**: Run full test suite (pytest, npm test, bin/rails test, etc.)
    2. **Quality Gates** (as applicable):
       - Critical (must pass now): unit/integration/e2e tests for the scope; database verification gates; any configured coverage threshold (see `CLAUDE.md`)
       - Non-critical (may be deferred briefly): lint, format, type-check, basic security scan. If any non-critical gate fails, create a small fix follow-up sub-task and proceed; resolve before final feature completion
       - Database Migration/Schema Checks (REQUIRED for database changes — task NOT complete without these):
         - Execute: Run migration/schema update command
         - Verify: Inspect database to confirm schema matches expectations
           - Check tables/collections exist
           - Check columns/fields exist with correct types
           - Check indexes exist
           - Check constraints exist
         - Test: Run data population/seed script successfully
         - Rollback: Downgrade/undo migrations without errors
         - Re-apply: Re-run migrations successfully after rollback
         - Integration: Run integration tests against a real database (not mocked)
         - If ANY step fails: Task is NOT complete — investigate and fix
       - Feature flag defaults and safe-off behavior
     3. **Only if tests and gates pass**: Stage changes (`git add .`)
     4. **Clean up**: Remove any temporary files and temporary code before committing
      5. **Commit**: Use descriptive commit message with conventional commit format
    - Once all subtasks are marked completed and changes committed, mark parent task as completed
    - Integration Test Gate: for API/critical flows, ensure integration tests are present and passing for the FRs addressed by this parent task before marking complete
    - Update Global Index: flip readiness to Y for any tasks unblocked by this completion and add a brief note in `tasks/_index.md`
4. **Finalization Protocol for the Tasks File**:
   - Before declaring the tasks file "complete", ensure:
     - All tests added for the current tasks file pass
     - Any remaining skipped tests are documented in "Deferred/Skipped Tests" with clear reasons and references to future tasks
     - Revisit and un-skip tests that are no longer blocked
   - If API tasks were included, verify that the "API Implementation Checklist" items are satisfied (auth context injection, multi-tenancy filtering, RBAC, serialization, error handling) as part of the parent-task completion gate
5. **Database Change Verification Gate (Critical)**:
   - For parent tasks involving database schema changes, the following verification gate MUST pass before marking complete:
   
   **Required Verifications:**
   1. Migration/schema files exist and are tracked in version control
   2. Migrations executed successfully against the database
   3. Schema inspection confirms expected structure (tables, columns, types, constraints, indexes)
   4. Data population/seed script runs without errors
   5. Integration tests pass against a real database instance
   6. Rollback works without data loss or errors
   7. Re-apply succeeds after rollback

   **Anti-Pattern to Avoid:**
   - Marking database tasks "complete" when only migration files are created
   - Testing only against mocked/in-memory databases
   - Assuming schema is correct without verification

   **Required Mindset Shift:**
   ```
   OLD: Files exist = Work complete
   NEW: Files exist + Executed + Verified = Work complete
   ```

6. **Task List Maintenance**:
   - Mark tasks and subtasks as completed ([x]) per protocol above
   - Add new tasks as they emerge
   - Maintain "Relevant Files" section with every file created or modified
   - Give each file a one-line description of its purpose
   - When creating new modules/components, consider using scaffolding commands (e.g., `@generate-scaffold.md`) for consistency
   - Maintain a "Blocked/Prerequisites" note for any tasks deferred due to unmet dependencies and revisit when predecessors are completed

## Output Format
When completing tasks:

**Commit Message Format:**
Use conventional commit format (feat:, fix:, refactor:, etc.) with multiple -m flags:
```
git commit -m "feat: add payment validation logic (PRD-0007-FR-3, PRD-0007-FR-4)" -m "- Validates card type and expiry" -m "- Adds unit tests for edge cases" -m "Related to PRD-0007; updates tests"
```

**Commit Message Should:**
- Summarize what was accomplished in the parent task
- List key changes and additions
- Reference task number and PRD context
- Include relevant FR/NFR IDs

## Important Guidelines
- Before starting work, check which sub-task is next
- After implementing a sub-task, update the file and pause for user approval
- Regularly update the task list file
- Keep "Relevant Files" section accurate and up to date
- Never skip ahead to next sub-task without user permission
- Maintain traceability by referencing FR IDs in test names, code comments where appropriate, and commit messages
- Use targeted test runs during sub-task work; use full test runs only at parent-task completion or when risk dictates
- Track any deferred/skipped tests with reasons and unblock them as related tasks are completed
- Apply quality gates (lint, type-check, security scan, coverage, migrations) before committing at parent-task boundaries
- Document any operational changes (migrations, flags, configs) in the tasks file and/or runbook
- Optional follow-up: run `@test-audit.md` to verify FR/NFR traceability and skip hygiene after completing parent tasks or at the end.
- Do not introduce new architectural components or frameworks during sub-task work. If a sub-task implies a new architecture decision, pause and ask the user to confirm before proceeding
 - Confirm the tasks file includes an Architecture/Stack Baseline in its Notes. If missing or ambiguous, pause and confirm the stack before proceeding
