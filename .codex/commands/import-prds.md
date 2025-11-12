## Usage
`@import-prds <PATH_TO_FEATURES_FILE>`

## Purpose
Parse a single spec/bundle file that contains multiple features, split it into draft PRDs, and derive a preliminary dependency map. No implementation is performed.

## Inputs
- $ARGUMENTS — path to the bundle file with multiple features/specs
- Outputs drafts to `/prd-bundle/` (not `/prds/`); drafts are later finalized via `@create-prd`

## Prerequisite: Architecture Baseline (Required)
- A `CLAUDE.md` exists at the application repo root (or provided repo root) with an Architecture/Stack section or links
- Confirm global NFR budgets are documented or linked (performance SLO/SLIs, availability targets, accessibility level, security/privacy). If missing, record open questions and pause sizing where impacted

## Workflow
1. Validate and read the architecture baseline from `CLAUDE.md`. If missing or incomplete, STOP and request baseline creation/confirmation
2. Parse the bundle to identify distinct features and names
3. For each feature, extract a draft PRD skeleton with:
   - Draft FRs and acceptance criteria placeholders
   - Notes on technical/design considerations
   - Preliminary “Dependencies & Predecessors” list
   - T‑shirt sizing (S/M/L/XL) with 1–2 bullets rationale
4. Build a bundle overview `/prd-bundle/index.md` with:
   - Feature list and a dependency graph (topologically ordered)
   - A proposed “Critical Path” ordering for initial scheduling
   - Conflicts/overlaps to review (endpoints, schemas, entities)
   - Open questions for the next `@create-prd` pass
5. Detect cross‑feature conflicts (do not attempt to resolve). Suggest validation steps to reduce later rework:
   - APIs: OpenAPI/GraphQL schema diff and lint; confirm versioning strategy
   - DB: migration dry‑run and schema diff against a representative database
6. Stop and ask for confirmation before any final PRDs are created

## Deliverables
- `/prd-bundle/index.md` — global summary and dependency graph
- `/prd-bundle/[nn]-draft-prd-[feature-name].md` — draft PRD skeletons

## Next Steps
- For each draft, run `@create-prd` to finalize into `/prds/`
- Then run `@generate-tasks <PATH_TO_FINALIZED_PRD>` and proceed with `@process-task-list`
- Carry the ordering from `/prd-bundle/index.md` into `tasks/_index.md` after generating tasks. If `tasks/_index.md` already exists, reconcile and merge dependency data
- Ensure each finalized PRD meets a Definition of Ready (DoR): architecture and data ownership confirmed; UX states available or explicitly deferred; security/tenancy clarified; success metrics aligned to global SLOs

## Operational Notes
- Do not generate code or tasks in this command
- Never assume architecture; propose options if missing and pause for selection
- Save only under `/prd-bundle/` to distinguish drafts from finalized PRDs in `/prds/`
 - Record any suggested architectural choices as pending ADRs (Architecture Decision Records) and link them from draft PRDs; do not assume approval in drafts
