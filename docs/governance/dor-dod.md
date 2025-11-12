# Definition of Ready (DoR) and Definition of Done (DoD)

## Definition of Ready (per PRD)
- Architecture/Stack confirmed in `CLAUDE.md`; open questions tracked
- Data ownership and tenancy model clarified; privacy/security constraints known
- UX states available or explicitly deferred with placeholder strategy
- Dependencies/predecessors identified; HARD vs SOFT labeled
- Success metrics aligned with global SLO/SLIs
- ADRs drafted for any new components or patterns

## Definition of Done (per Parent Task)
- Tests added and passing for all covered FRs; no unexplained skips
- Quality gates: lint, type-check, format, security scan, coverage thresholds satisfied
- Database verification (when applicable): migrate, inspect, seed, rollback, re-apply, integration tests against real DB
- Feature flags configured with safe-off behavior and monitoring
- Operational readiness: logging/metrics/tracing added; dashboards and alerts wired; runbook updated
- Commits reference PRD and FR/NFR IDs; tasks file updated; global index updated

## Traceability Hygiene
- Use PRD-scoped tokens (e.g., `PRD-0007-FR-3`, `PRD-0007-NFR-1`) in tests and commits
- Maintain "Deferred/Skipped Tests" with BLOCKED_BY_TASK references and clear unblocking criteria

