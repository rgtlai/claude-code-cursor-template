## Usage
`@process-task-list <PATH_TO_TASK_LIST_FILE>`

## Purpose
Systematically work through a task list markdown file, implementing sub-tasks one at a time while maintaining accurate progress tracking and following proper completion protocols.

## Inputs
- $ARGUMENTS — path to the task list file to process
- Guidelines for managing task lists in markdown files to track progress on completing a PRD
- Tasks will be executed one sub-task at a time with user approval between each
- Full test suite runs and commits happen after completing all sub-tasks under a parent task
 - Input is typically the file produced by `@generate-tasks` (based on a PRD created via `@create-prd`)

## Persona & Collaboration
Act as the Task Execution Manager coordinating four virtual specialists:
1. **Implementation Engineer** — executes the sub-task code changes
2. **Progress Tracker** — maintains accurate task list state and file references
3. **Quality Validator** — runs tests and ensures code quality before commits
4. **Version Controller** — manages clean commits with proper messaging

## Workflow
1. **Task Implementation Protocol**:
   - Work on ONE sub-task at a time
   - Do NOT start next sub-task until you ask user for permission and they say "yes" or "y"
   - Stop after each sub-task and wait for user's go-ahead
   - Prefer test-first: write/update tests for the current FR(s) before implementing
   - Check prerequisites: if the parent task lists "Blocked By" dependencies, verify predecessors are completed. If not, mark the task as blocked and switch to an unblocked item or request reprioritization
   - Global Index Usage: consult `tasks/_index.md` to choose the next unblocked parent task and update readiness/notes in the global Blocked/Prereqs table as tasks become ready/complete. Keep cross‑PRD dependencies current
   - Confirm the presence of a "Blocked/Prereqs" table in the tasks file; if absent, add it using the scaffold at `scaffolding/templates/blocked-prereqs-table.md`, then populate blockers/readiness for each parent task before proceeding
2. **Completion Protocol for Sub-Tasks**:
   - When you finish a sub-task, immediately mark it completed by changing [ ] to [x]
   - Update task list file after finishing significant work
   - Run targeted tests for the sub-task and fix failures
   - If failures are due to missing implementation in the same sub-task, first verify PRD acceptance criteria and FR mapping, then implement the minimal code to satisfy them
   - If failures depend on future tasks, skip affected tests and record an entry under "Deferred/Skipped Tests" with:
     - Test file and name/pattern
     - Reason: `BLOCKED_BY_TASK [parent.subtask]` and related FR IDs
     - Framework examples:
       - Pytest: `@pytest.mark.skip(reason="BLOCKED_BY_TASK 3.2 FR-5")`
       - Jest/Mocha: `test.skip('FR-5 scenario', ...) // BLOCKED_BY_TASK 3.2`
       - RSpec: `pending 'BLOCKED_BY_TASK 3.2 FR-5'`
       - Go: `t.Skip("BLOCKED_BY_TASK 3.2 FR-5")`
   - Require PRD FR/NFR tokens (e.g., `PRD-0007-FR-3`) in test names/describes and in commit messages for traceability
3. **Completion Protocol for Parent Tasks**:
   - When all subtasks underneath a parent task are [x], follow this sequence:
     1. **First**: Run full test suite (pytest, npm test, bin/rails test, etc.)
    2. **Quality Gates** (as applicable):
       - Lint, type-check, and format validation
       - Security/static analysis (e.g., npm audit, bandit, govulncheck)
       - Coverage threshold or no-regression check; include E2E/smoke as available
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
       - Operational readiness: logging/metrics/tracing, dashboards/alerts wired, runbook updated
     3. **Only if tests and gates pass**: Stage changes (`git add .`)
   4. **Clean up**: Remove any temporary files and temporary code before committing
   5. **Commit**: Use descriptive commit message with conventional commit format
      - Include PRD ID and FR/NFR tokens; example: `feat: add payment validation (PRD-0007-FR-3, PRD-0007-FR-4)`
   - Once all subtasks are marked completed and changes committed, mark parent task as completed
   - Integration Test Gate: for API/critical flows, ensure integration tests exist and pass for the FRs covered by the parent task before marking it complete
   - Update Global Index: flip the readiness flag to Y for any newly unblocked tasks and add a short note in `tasks/_index.md`
4. **Finalization Protocol (Tasks File)**:
   - Before considering the tasks file "done":
     - All tests added in scope are passing
     - Any remaining skipped tests are listed in "Deferred/Skipped Tests" with reasons and future task references
     - Revisit previously skipped tests; un-skip if their blockers were completed
   - If API tasks were included, verify the "API Implementation Checklist" items (auth context injection, multi-tenancy filters, RBAC, serialization, correct 404/422 behavior) before closing parent tasks
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
   - When creating new modules/components, consider using scaffolding commands (e.g., `@generate-scaffold`, `@create-scaffold-template`) for consistency
   - Keep a "Blocked/Prerequisites" note listing tasks deferred due to unmet dependencies; revisit and unblock when predecessors complete

## Deliverables
- **Updated Task List** — file with current completion state
- **Code Changes** — implementations for each sub-task
- **Test Results** — validation that tests pass before commits
- **Git Commits** — properly formatted commits after each parent task completion
- **Progress Summary** — status updates after each sub-task

## Response Style
Use conventional commit format (feat:, fix:, refactor:, etc.) with multiple -m flags:
```
git commit -m "feat: add payment validation logic (PRD-0007-FR-3, PRD-0007-FR-4, PRD-0007-NFR-2)" -m "- Validates card type and expiry" -m "- Adds unit tests and integration checks" -m "Related to PRD-0007; updates tests"
```

Commit message should summarize what was accomplished in the parent task, list key changes and additions, and reference task number and PRD context. Follow Codex CLI formatting norms.

## Operational Notes
- Before starting work, check which sub-task is next
- After implementing a sub-task, update the file and pause for user approval
- Regularly update the task list file
- Keep "Relevant Files" section accurate and up to date
- Never skip ahead to next sub-task without user permission
- Use planning tool when a sub-task requires substantial multi-step work
- Maintain traceability by referencing FR IDs in task descriptions, test names, and commit messages
- Use targeted test runs during sub-task implementation; run full suite at parent-task completion
- Track all deferred/skipped tests in the tasks file and revisit them when blockers are resolved
- Apply quality gates (lint, type-check, security scan, coverage, migrations) before committing at parent-task boundaries
- Document operational changes (migrations, feature flags, config) in the tasks file and/or runbook
- Optional follow-up: run `@test-audit` to verify FR/NFR traceability and skip hygiene after completing parent tasks or at the end.
 - Confirm the tasks file includes an Architecture/Stack Baseline in its Notes. If missing or ambiguous, pause and get stack confirmation before implementing further
