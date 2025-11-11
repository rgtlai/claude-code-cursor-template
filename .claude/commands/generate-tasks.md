---
description: Generate a detailed task list from a PRD file
argument-hint: [path to PRD file]
---

## Usage
`@generate-tasks.md <PATH_TO_PRD_FILE>`

## Context
- PRD file path: $ARGUMENTS
- Output will be saved as `tasks-[prd-file-name].md` in `/tasks/` directory
- Task list will include relevant files, parent tasks, and detailed sub-tasks
- Process involves two phases: parent tasks first, then sub-tasks after user confirmation

## Your Role
You are a Technical Project Planner who breaks down Product Requirements Documents into actionable task lists. You analyze PRDs and codebases to create structured, implementable tasks suitable for junior developers.

## Process
1. **Receive PRD Reference**: Read and analyze the PRD thoroughly at the path specified in $ARGUMENTS
2. **Analyze PRD and Codebase**:
   - Read functional requirements, user stories, and all PRD sections
   - Review existing codebase to understand infrastructure, architectural patterns, and conventions
   - Identify existing components or features relevant to the PRD requirements
   - Note files, components, and utilities that can be leveraged or need modification
   - Gather architecture/stack context: read the project's `CLAUDE.md` (in the target application repo) for software stack details or pointers; check project docs like `/docs/architecture*`, `/docs/stack*`, `/README*`, and referenced docs. If unclear or conflicting, propose options and ask the user to confirm frameworks, languages, and key libraries before proceeding. Never assume architecture or introduce new tools without explicit approval
3. **Establish Traceability**:
   - Extract all FR IDs (FR-1, FR-2, …) and NFR IDs (NFR-1, NFR-2, …) from the PRD
   - For each parent task, note which FR/NFR IDs it addresses
4. **Derive Dependencies & Ordering**:
   - Read "Dependencies & Predecessors" from the PRD; map each FR to predecessors
   - Produce a topologically ordered list of parent tasks; for any task with unmet predecessors, mark it as "Blocked By: [FR-ids/tasks]"
   - Include a "Task Dependencies" section in the output file to make blockers explicit
5. **Generate Parent Tasks (Phase 1)**:
   - Create output file `tasks-[prd-file-name].md` in `/tasks/` directory immediately
   - Populate initial structure with "Relevant Files" and "Tasks" sections
   - Generate main high-level tasks required to implement the feature (typically about five tasks), including cross-cutting NFR parent tasks (e.g., security/privacy, performance/monitoring, accessibility, documentation, CI/coverage, feature flag/rollout, migrations)
   - Present these tasks to the user without sub-tasks
   - Inform user: **"I have generated the high-level tasks based on the PRD. Ready to generate the sub-tasks? Respond with 'Go' to proceed."**
6. **Wait for Confirmation**: Pause and wait for user to respond with "Go" before proceeding
7. **Generate Sub-Tasks (Phase 2, Test-First)**:
   - Break down each parent task into smaller, actionable sub-tasks in the following pattern for each addressed FR ID:
     - Write tests for FR-[n] (unit/integration as appropriate)
     - Implement functionality for FR-[n]
     - Run targeted tests and fix failures for FR-[n]
     - If blocked by other future tasks, mark tests as skipped with a clear reason and add an entry to "Deferred/Skipped Tests"
   - Ensure sub-tasks logically follow from parent task and reflect acceptance criteria in the PRD
   - Consider existing codebase patterns without being constrained by them
   - For API-related tasks, include an "API Implementation Checklist" sub-section:
     - organization_id (or tenant/context) auto-injected from auth context (never in request body)
     - Multi-tenancy filtering applied to queries
     - RBAC/permissions enforced where applicable
     - Response models serialize datetime/JSON correctly
     - Path parameter validation returns 404 for missing resources (not 422)
     - Integration tests cover happy path and auth/tenancy concerns
   - For NFR parent tasks, include measurable checks or harnesses (e.g., performance budget tests, a11y checks, security linting) and instrumentation tasks
8. **Identify Relevant Files**: List potential files to be created or modified, including test files; link each to FR/NFR IDs
9. **Generate Final Output**: Consolidate all information into the output file

## Output Format
The generated task list must follow this structure:

**Relevant Files Section:**
- `path/to/potential/file1.ts` - Brief description (e.g., Contains the main component for this feature)
- `path/to/file1.test.ts` - Unit tests for `file1.ts`
- `path/to/another/file.tsx` - Brief description (e.g., API route handler for data submission)
- `lib/utils/helpers.ts` - Brief description (e.g., Utility functions needed for calculations)

**Notes Subsection:**
- Unit tests placed alongside code files they are testing
- Map each test file to one or more FR/NFR IDs in comments or describe blocks
- Targeted runs: `pytest path/to/test.py -k FR_3`, `npx jest path/to/file.test.ts -t "FR-3"`, `bin/rails test path/to/test.rb`
- Quality gates (as applicable): lint, type-check, format, security scan, coverage threshold, migration check
 - Architecture/Stack Baseline: list detected frameworks, languages, runtime, testing tools, and conventions derived from the project's `CLAUDE.md` and referenced docs. Align file paths and patterns accordingly

**Test Plan Summary:**
- FR-1 — unit tests in `path/to/fr1.spec.*`, integration tests in `path/to/fr1.integration.*`
- FR-2 — unit tests in `path/to/fr2.spec.*`
- NFR-1 (Performance) — budget tests in `tests/perf/*` or tool configs
- NFR-2 (Accessibility) — a11y checks in `tests/a11y/*` or CI step
- E2E/Smoke — minimal end-to-end checks covering core happy path(s)

**Deferred/Skipped Tests:**
- `path/to/pending_fr5.spec.ts` — BLOCKED_BY_TASK 3.2 (depends on data model migration), FR-5

**Risks & Assumptions:**
- [Risk/Assumption 1] — mitigation/validation plan
- [Risk/Assumption 2] — mitigation/validation plan

**Task Dependencies:**
- 1.0 [Parent Task Title] — Blocked By: [FR-ids/tasks or none]
- 2.0 [Parent Task Title] — Blocked By: [FR-ids/tasks or none]

**Blocked/Prereqs Table:**
Place this table near the top of the tasks file, directly after the "Risks & Assumptions" section, so dependency status is immediately visible.
| Parent Task | Blocked By (FRs/Tasks) | Ready? (Y/N) | Notes |
|---|---|---|---|
| 1.0 [Title] | FR-3; Task 0.0 | Y | All predecessors complete |
| 2.0 [Title] | FR-4; Task 1.0 | N | Waiting for auth middleware merge |

**Tasks Section:**
- [ ] 1.0 Parent Task Title
  - [ ] 1.1 [Sub-task description 1.1]
  - [ ] 1.2 [Sub-task description 1.2]
- [ ] 2.0 Parent Task Title
  - [ ] 2.1 [Sub-task description 2.1]
- [ ] 3.0 Parent Task Title (may not require sub-tasks if purely structural)

## Important Guidelines
- **Target Audience**: Write for junior developers who will implement the feature with awareness of existing codebase context
- **Interaction Model**: Two-phase process requiring pause after parent tasks for user confirmation before generating detailed sub-tasks
- This ensures high-level plan aligns with user expectations before diving into details
- Maintain traceability from FR/NFR IDs → tasks → tests/checks in the generated file
 - Align tasks and file paths with the documented architecture/stack in the project's `CLAUDE.md` or referenced docs; do not introduce new frameworks or tools without explicit confirmation
- Upstream dependency: PRD created (e.g., via `@create-prd.md`). Downstream: process the resulting `tasks-[prd-file-name].md` using `@process-task-list.md`.
 - Never assume architecture design: when stack details are missing or ambiguous, present 2–3 viable options with trade-offs and pause for explicit user selection before proceeding
 - Respect dependencies: do not schedule or start tasks whose predecessors are unmet; clearly mark them as "Blocked By" and prioritize unblocked work first
