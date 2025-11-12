## Blocked/Prereqs Table (Global Context Ready)

Place this table immediately after the "Risks & Assumptions" section in each tasks file. Keep it up to date as predecessors complete.

| Parent Task | Blocked By (FRs/Tasks) | Ready? (Y/N) | Notes |
|---|---|---|---|
| 1.0 [Title] | PRD-0001-FR-3; tasks/tasks-0001-prd-auth.md 2.0 | N | Waiting for auth middleware |
| 2.0 [Title] | — | Y | Unblocked |

Tips
- Reference other parents using: `tasks/<file>.md <parent-id>` (e.g., `tasks/tasks-0001-prd-auth.md 2.0`)
- Use PRD‑scoped tokens (e.g., `PRD-0007-FR-3`) for FR/NFR blockers
- Flip Ready to Y only when all predecessors finish; add brief notes
