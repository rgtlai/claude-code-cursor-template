---
description: Migrate an existing repo to the new PRD → Tasks workflow with a global index (planning + file edits only)
argument-hint: [dry-run|apply]
---

## Usage
`@migrate-project-structure.md [dry-run|apply]`

## Context
- Old structure: PRDs and tasks may have lived only under `/tasks/`
- New structure: finalized PRDs under `/prds/`, tasks remain under `/tasks/`, drafts under `/prd-bundle/`
- This migration standardizes files, adds dependency visibility, and prevents out-of-order execution

## Your Role
You are the Migration Coordinator. You will plan, preview, and then update PRD and tasks files and the global index (no code changes) so the repo follows the new workflow.

## Process
1. Plan & Inventory (read-only)
   - Scan `/prds/` for finalized PRDs; list any PRDs missing the “Dependencies & Predecessors” section
   - Scan `/tasks/` for `tasks-[prd].md` and map each to a PRD; list any ambiguous mappings
   - If PRDs exist outside `/prds/` or drafts under `/prd-bundle/`, ask how to proceed

2. Normalize PRDs (no implementation)
   - For each PRD in `/prds/`, ensure required sections exist; if “Dependencies & Predecessors” is missing, add a clearly marked `TBD` block with questions
   - Add “Reference Implementations” when applicable (point to gold-standard modules/APIs)

3. Normalize tasks files (per PRD)
   - Ensure “Task Dependencies” is present (parent tasks with `Blocked By` notes)
   - Add a “Blocked/Prereqs” table immediately after “Risks & Assumptions” with columns:
     - Parent Task | Blocked By (FRs/Tasks) | Ready? (Y/N) | Notes
   - Add “Architecture/Stack Baseline” notes in the “Notes” subsection if absent; pause to confirm stack if unclear
   - If API-related, add “API Implementation Checklist” covering:
     - Auth context injection (no sensitive fields in request body)
     - Multi-tenancy filtering
     - RBAC/permissions checks
     - Datetime/JSON serialization config
     - 404 vs 422 path behavior
     - Integration tests for happy path + auth/tenancy
   - Ensure “Test Plan Summary” and “Deferred/Skipped Tests” exist and map to FR/NFR IDs

4. Create/Update Global Index
   - Create or update `tasks/_index.md`
   - Add a top “Blocked/Prereqs Table (Global)” aggregating all parent tasks with readiness
   - Add “Global Task Dependencies” (topological order) and “Conflicts and Overlaps” (endpoints/schemas/events)
   - Note update time and set Maintainer TBD if needed

5. FR/NFR Traceability
   - Verify FR/NFR references are consistent; if labels are local (e.g., FR-1), propose PRD-scoped labels (e.g., PRD-0007-FR-1) for approval before changing

6. Baseline Audit (optional run)
   - Run `@test-audit.md [completed-only] [with-run]` (read-only mode is acceptable for analysis)
   - For failures that require unimplemented features/APIs, recommend converting tests to `skip` with `BLOCKED_BY_TASK x.y` and FR/NFR refs; add to “Deferred/Skipped Tests”
   - For existing skipped tests that appear implementable, recommend un-skipping and implementing

7. Preview & Apply
   - Prepare a short plan and diff preview per batch (PRDs, tasks files, index)
   - Wait for approval before applying changes; use `apply` option only after approval

## Deliverables
- Updated `tasks-[prd].md` files with Task Dependencies and Blocked/Prereqs table placed after “Risks & Assumptions”
- Created/updated `tasks/_index.md` with a global Blocked/Prereqs table, global ordering, and conflicts list
- TEST_AUDIT.md updates (if run mode used) with failures converted to tracked skips or marked for implementation
- A summary of:
  - Files changed
  - Outstanding TBDs/questions (esp. missing dependencies)
  - Conflicts/overlaps detected
  - Proposed FR/NFR label normalization (if any)

## Operational Notes
- Do not modify application code unless explicitly approved
- Ask clarifying questions when dependencies/stack are missing
- Always show a plan and diff preview before writing
