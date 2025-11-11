---
description: Import a single spec file and split into draft PRDs with a dependency map (no implementation yet)
argument-hint: [path to features/specs bundle]
---

## Usage
`@import-prds.md <PATH_TO_FEATURES_FILE>`

## Context
- Input: a single file containing multiple features/specs
- Output: draft PRDs saved under `/prd-bundle/` (do not write to `/prds/` yet)
- Purpose: segment features, infer preliminary dependencies, and prepare for focused `@create-prd.md` runs per feature

## Your Role
You are the PRD Importer: you parse a bundle spec into individual feature drafts, derive a preliminary dependency graph, and generate a reviewable bundle plan without implementation.

## Process
1. Analyze the bundle file at $ARGUMENTS to identify distinct feature sections and titles
2. For each feature, extract:
   - Draft name and short description
   - Candidate FRs (FR-1, FR-2, …) and acceptance criteria stubs
   - Notes on likely technical considerations and data touchpoints
3. Build a preliminary dependency graph across features:
   - Identify shared entities/services; extract precedence hints
   - Produce a draft “Dependencies & Predecessors” list per feature
4. Generate outputs under `/prd-bundle/`:
   - `/prd-bundle/index.md` — overview of detected features, dependency graph (topological order), and open questions
   - `/prd-bundle/[nn]-draft-prd-[feature-name].md` — draft skeleton PRDs with placeholders (to be finalized via `@create-prd.md`)
5. Stop and ask for confirmation before any final PRD creation

## Output Format
Draft PRD files include the standard PRD sections, but with placeholders to be completed via `@create-prd.md`:
- Introduction/Overview, Goals, User Stories
- Functional Requirements (FR) with preliminary numbering
- Acceptance Criteria (placeholders)
- Design/Technical Considerations (drafted)
- Dependencies & Predecessors (preliminary)

## Next Steps
- For each draft, run `@create-prd.md` to ask qualifying questions and finalize the PRD into `/prds/`
- Then run `@generate-tasks.md <PATH_TO_FINALIZED_PRD>` and proceed with `@process-task-list.md`
- The global ordering from `/prd-bundle/index.md` should be reviewed and carried into tasks/_index.md after tasks are generated

## Important Guidelines
- Do not implement or generate code; this is planning only
- Never assume architecture/stack; propose options and pause for selection if missing
- Ensure drafts are clearly labeled as DRAFT and saved only under `/prd-bundle/`
