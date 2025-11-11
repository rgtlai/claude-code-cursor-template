## Usage
`@import-prds <PATH_TO_FEATURES_FILE>`

## Purpose
Parse a single spec/bundle file that contains multiple features, split it into draft PRDs, and derive a preliminary dependency map. No implementation is performed.

## Inputs
- $ARGUMENTS — path to the bundle file with multiple features/specs
- Outputs drafts to `/prd-bundle/` (not `/prds/`); drafts are later finalized via `@create-prd`

## Workflow
1. Parse the bundle to identify distinct features and names
2. For each feature, extract a draft PRD skeleton with:
   - Draft FRs and acceptance criteria placeholders
   - Notes on technical/design considerations
   - Preliminary “Dependencies & Predecessors” list
3. Build a bundle overview `/prd-bundle/index.md` with:
   - Feature list and a dependency graph (topologically ordered)
   - Conflicts/overlaps to review (endpoints, schemas, entities)
   - Open questions for the next `@create-prd` pass
4. Stop and ask for confirmation before any final PRDs are created

## Deliverables
- `/prd-bundle/index.md` — global summary and dependency graph
- `/prd-bundle/[nn]-draft-prd-[feature-name].md` — draft PRD skeletons

## Next Steps
- For each draft, run `@create-prd` to finalize into `/prds/`
- Then run `@generate-tasks <PATH_TO_FINALIZED_PRD>` and proceed with `@process-task-list`
- Carry the ordering from `/prd-bundle/index.md` into tasks/_index.md after generating tasks

## Operational Notes
- Do not generate code or tasks in this command
- Never assume architecture; propose options if missing and pause for selection
- Save only under `/prd-bundle/` to distinguish drafts from finalized PRDs in `/prds/`
