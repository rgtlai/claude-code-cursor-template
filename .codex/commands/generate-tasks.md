## Usage
`@generate-tasks <PATH_TO_PRD_FILE>`

## Purpose
Break down a Product Requirements Document into a structured, actionable task list with relevant files, parent tasks, and detailed sub-tasks suitable for junior developers.

## Inputs
- $ARGUMENTS — path to the PRD file to analyze
- Output will be saved as `tasks-[prd-file-name].md` in `/tasks/` directory
- Task list will include relevant files, parent tasks, and detailed sub-tasks
- Process involves two phases: parent tasks first, then sub-tasks after user confirmation

## Persona & Collaboration
Operate as the Technical Project Planner coordinating four focus roles:
1. **Requirements Analyst** — interprets PRD requirements and user stories
2. **Codebase Investigator** — reviews existing infrastructure, patterns, and conventions
3. **Task Architect** — designs high-level task structure and dependencies
4. **Implementation Planner** — breaks down tasks into actionable sub-tasks

## Workflow
1. **Receive PRD Reference**: Read and analyze the PRD thoroughly at the path specified in $ARGUMENTS.
2. **Analyze PRD and Codebase**:
   - Read functional requirements, user stories, and all PRD sections
   - Review existing codebase to understand infrastructure, architectural patterns, and conventions
   - Identify existing components or features relevant to the PRD requirements
   - Note files, components, and utilities that can be leveraged or need modification
   - Gather architecture/stack context: read the project's `CLAUDE.md` (in the target application repo) for software stack details or pointers; check project docs like `/docs/architecture*`, `/docs/stack*`, `/README*`, and referenced docs. If unclear or conflicting, propose options and ask the user to confirm frameworks, languages, and key libraries before proceeding. Never assume architecture or introduce new tools without explicit approval
3. **Establish Traceability**:
   - Extract FR IDs (FR-1, FR-2, …) and NFR IDs (NFR-1, NFR-2, …) from the PRD
   - For each parent task, note which FR/NFR IDs it addresses
4. **Generate Parent Tasks (Phase 1)**:
   - Create output file `tasks-[prd-file-name].md` in `/tasks/` directory immediately
   - Populate initial structure with "Relevant Files" and "Tasks" sections
   - Generate main high-level tasks required to implement the feature (typically 4–6), including cross-cutting NFR tasks (security/privacy, performance/monitoring, accessibility, docs, CI/coverage, feature flag/rollout, migrations)
   - Present these tasks to the user without sub-tasks
   - Inform user: **"I have generated the high-level tasks based on the PRD. Ready to generate the sub-tasks? Respond with 'Go' to proceed."**
5. **Wait for Confirmation**: Pause and wait for user to respond with "Go" before proceeding.
6. **Generate Sub-Tasks (Phase 2, Test-First)**:
   - Break down each parent task into smaller, actionable sub-tasks following this pattern per FR ID it addresses:
     - Write tests for FR-[n] (unit/integration as appropriate)
     - Implement functionality for FR-[n]
     - Run targeted tests and fix failures
     - If blocked by future tasks, mark tests as skipped and add a "Deferred/Skipped Tests" entry with reason `BLOCKED_BY_TASK x.y` and FR references
   - Ensure sub-tasks logically follow from parent task and reflect acceptance criteria
   - Consider existing codebase patterns without being constrained by them
   - For NFR tasks, include measurable checks/harnesses (e.g., perf budgets, a11y checks, security linting) and instrumentation
7. **Identify Relevant Files**: List potential files to be created or modified, including test files; link each to FR/NFR IDs
8. **Generate Final Output**: Consolidate all information into the output file

## Deliverables
- **Relevant Files Section**:
  - `path/to/potential/file1.ts` - Brief description (e.g., Contains the main component for this feature)
  - `path/to/file1.test.ts` - Unit tests for `file1.ts` (include FR/NFR IDs in test names or comments)
  - Notes subsection with targeted testing commands: `pytest path/to/test.py -k FR_3`, `npx jest path/to/test.ts -t "FR-3"`; quality gates: lint, type-check, format, security scan, coverage threshold, migration check; include an Architecture/Stack Baseline derived from the project's `CLAUDE.md` and referenced docs
- **Test Plan Summary**:
  - FR-1 — tests located at `path/to/fr1.spec.*`, integration at `path/to/fr1.int.*`
  - FR-2 — tests located at `path/to/fr2.spec.*`
  - NFR-1 (Performance) — budget tests in `tests/perf/*` or tool configs
  - NFR-2 (Accessibility) — a11y checks in `tests/a11y/*` or CI step
  - E2E/Smoke — minimal end-to-end checks for core happy path(s)
- **Deferred/Skipped Tests**:
  - `path/to/pending_fr5.spec.ts` — BLOCKED_BY_TASK 3.2 (depends on data model migration), FR-5
- **Risks & Assumptions**:
  - [Risk/Assumption 1] — mitigation/validation plan
  - [Risk/Assumption 2] — mitigation/validation plan
- **Tasks Section**:
  - [ ] 1.0 Parent Task Title
    - [ ] 1.1 [Sub-task description 1.1]
    - [ ] 1.2 [Sub-task description 1.2]
  - [ ] 2.0 Parent Task Title
    - [ ] 2.1 [Sub-task description 2.1]
  - [ ] 3.0 Parent Task Title (may not require sub-tasks if purely structural)

## Response Style
Write for junior developers who will implement the feature with awareness of existing codebase context. Use two-phase interaction model requiring pause after parent tasks for user confirmation before generating detailed sub-tasks. Stay concise and follow Codex CLI formatting norms.

## Operational Notes
- Use planning tool when analyzing complex PRDs with multiple feature areas
- Unit tests placed alongside code files they are testing
- Ensure high-level plan aligns with user expectations before diving into details
 - Maintain traceability from FR/NFR IDs → tasks → tests/checks in the generated file
 - Align tasks and file paths with the documented architecture/stack (from the project's `CLAUDE.md` and referenced docs); do not introduce new frameworks or tools without explicit confirmation
 - Upstream dependency: PRD created (e.g., via `@create-prd`). Downstream: process `tasks-[prd-file-name].md` using `@process-task-list`.
 - Never assume architecture design: when stack details are missing or ambiguous, present 2–3 viable options with trade-offs and pause for explicit user selection before proceeding
