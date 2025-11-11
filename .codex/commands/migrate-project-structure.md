## Usage
`@migrate-project-structure [dry-run|apply]`

## Purpose
Migrate an existing repository to the new PRD → Tasks workflow:
- Finalized PRDs live under `/prds/`
- Tasks remain under `/tasks/`
- Drafts go under `/prd-bundle/`
- A global index at `tasks/_index.md` consolidates dependencies and readiness

## Inputs
- $ARGUMENTS — optional: `dry-run` (default) or `apply`
- The command plans and previews changes; only writes when you approve (or when `apply` is specified per batch)

## Workflow
1. Plan & Inventory
   - List PRDs in `/prds/`; note missing “Dependencies & Predecessors”
   - Map `/tasks/` files to PRDs; surface ambiguous mappings for review
2. Normalize PRDs (planning only)
   - Ensure required sections exist; add clearly marked TBDs and questions
   - Add “Reference Implementations” where applicable
3. Normalize tasks files (per PRD)
   - Ensure “Task Dependencies” is present (parent tasks with `Blocked By`)
   - Add a “Blocked/Prereqs” table right after “Risks & Assumptions”:
     - Parent Task | Blocked By (FRs/Tasks) | Ready? (Y/N) | Notes
   - Add Architecture/Stack Baseline notes (confirm stack if unclear)
   - For API tasks, include an API checklist (auth context, multi-tenancy, RBAC, serialization, 404/422, integration tests)
   - Ensure “Test Plan Summary” and “Deferred/Skipped Tests” exist and map to FR/NFR
4. Create/Update Global Index (`tasks/_index.md`)
   - Add a top “Blocked/Prereqs Table (Global)” with readiness
   - Add “Global Task Dependencies” (topological order) and “Conflicts and Overlaps”
5. FR/NFR Traceability
   - Verify references; propose PRD-scoped labels if needed and wait for approval
6. Baseline Audit (optional)
   - Run `@test-audit [completed-only] [with-run]` to classify failures
   - Convert unimplementable failures to tracked skips (BLOCKED_BY_TASK + FR/NFR) and un-skip ready tests
7. Preview & Apply
   - Provide a short plan and diff preview per batch; write only after approval or when `apply` is specified

## Deliverables
- Updated tasks files (Task Dependencies + Blocked/Prereqs)
- `tasks/_index.md` with global readiness and ordering
- TEST_AUDIT.md additions for run-mode failures and actions
- Summary list of changed files, TBDs, conflicts, and proposed FR/NFR normalization

## Operational Notes
- No application code changes without approval
- Ask clarifying questions where dependencies or stack are missing
- Keep diffs small and logical; update the global index after each batch
