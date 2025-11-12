# Global Tasks Index

Purpose
- Consolidate cross‑PRD parent tasks, dependencies, and readiness in one place
- Guide execution order (topological) and surface conflicts early to reduce rework

How to Maintain
- Add rows when generating new `tasks/tasks-*.md` files
- Keep blockers accurate using PRD‑scoped IDs (e.g., PRD-0007-FR-3) and parent IDs (e.g., 1.0, 2.0)
- Flip Ready to Y when all predecessors complete; add brief Notes
- On PRD revisions, generate delta tasks and update affected rows
- Drain "Deferred/Skipped Tests" by unblocking and un‑skipping as dependencies resolve

## Blocked/Prereqs Table (Global)
Keep near the top; update after each tasks generation and parent completion.

<!-- BEGIN AUTO-GENERATED: BLOCKED_TABLE -->
<!-- END AUTO-GENERATED: BLOCKED_TABLE -->

## Topological Order (Recommended Execution)
<!-- BEGIN AUTO-GENERATED: TOPO_ORDER -->
<!-- END AUTO-GENERATED: TOPO_ORDER -->

## Cross‑PRD Conflicts & Overlaps
| Area | Details | Involved PRDs/Tasks | Status |
|---|---|---|---|
| API Route | POST /v1/users conflicts with existing payload schema | PRD-0001, tasks-0001 1.0; PRD-0007, tasks-0007 2.0 | Open |
| DB Schema | orders.total type mismatch (int vs numeric) | PRD-0004, tasks-0004 2.0; PRD-0007, tasks-0007 1.2 | Open |

## Deferred/Skipped Tests (Global)
| Test File | Name/Pattern | Reason | FR/NFR IDs | Unblock Criteria |
|---|---|---|---|---|
| tests/integration/payments.int.test.ts | "PRD-0007-FR-3 refund path" | BLOCKED_BY_TASK 1.3 | PRD-0007-FR-3 | Auth middleware merged and feature flag enabled |

## Maintenance Protocol
- After running `@generate-tasks`: add new parents to the table; initialize Ready=N if any predecessors exist
- After completing a parent (via `@process-task-list`):
  - Flip Ready to Y for dependents now unblocked; add a short note
  - Move any unblocked skipped tests from global list back to active and un‑skip in code
- On PRD changes: re‑run `@generate-tasks` to produce delta tasks; update PRD IDs/rows and dependencies here
- CI hygiene: warn/fail when tests/commits are missing PRD tokens or when Ready=Y rows remain blocked

Updates
- Last updated: YYYY-MM-DD HH:MM
- Maintainer: TBD
