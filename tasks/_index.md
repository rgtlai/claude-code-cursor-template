# Global Tasks Index (Template)

Purpose
- Consolidate cross‑PRD task dependencies, ordering, and readiness in one place.
- Prevent starting blocked tasks and surface conflicts early.

Sections

## Blocked/Prereqs Table (Global)
Place this near the top of the file and keep it up to date when generating new tasks or completing predecessors.

| Parent Task (File) | Blocked By (FRs/Tasks) | Ready? (Y/N) | Notes |
|---|---|---|---|
| tasks-prd-0007.md 1.0 | PRD-0001-FR-3; tasks-prd-0001.md 2.0 | N | Waiting for auth middleware |
| tasks-prd-0004.md 3.0 | — | Y | Unblocked |

## Global Task Dependencies
- Summarize per-PRD parent tasks with dependencies; prefer topological order.

## Conflicts and Overlaps
- Endpoint paths, schemas/tables, events/queues with potential clashes.

## Updates
- Last updated: YYYY-MM-DD HH:MM
- Maintainer: TBD
