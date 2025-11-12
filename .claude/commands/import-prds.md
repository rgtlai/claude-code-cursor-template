---
description: Import a single spec file and split into draft PRDs with a dependency map (no implementation yet)
argument-hint: [path to features/specs bundle] [--repo-root PATH]
---

## Usage
`@import-prds.md <PATH_TO_FEATURES_FILE> [--repo-root PATH]`

## Context
- Input: a single file containing multiple features/specs
- Optional repo root: `--repo-root PATH` (defaults to current repo). All path resolution and `CLAUDE.md` lookup are relative to this root
- Output: draft PRDs saved under `/prd-bundle/` (do not write to `/prds/` yet)
- Purpose: segment features, infer preliminary dependencies, and prepare for focused `@create-prd.md` runs per feature
 - Also detects early cross-feature conflicts (schema/endpoint overlaps) and surfaces rough sizing to minimize rework and improve prioritization

## Prerequisite: CLAUDE.md Architecture Baseline (Required)
- Location: `CLAUDE.md` at the repository root (or provided `--repo-root`)
- Must include or link to the system architecture and stack baseline (languages, frameworks, data stores, service boundaries, testing/quality gates, CI/CD, deployment, docs)
- Do not proceed until this baseline exists. If missing, pause and offer to create a baseline skeleton with open questions extracted from the bundle; require confirmation before writing any drafts

## Your Role
You are the PRD Importer: you parse a bundle spec into individual feature drafts, derive a preliminary dependency graph, and generate a reviewable bundle plan without implementation.

## Process
1. Validate and read the Architecture Baseline in `CLAUDE.md`. If missing or incomplete, STOP and request baseline creation/confirmation. Confirm that global NFR budgets (performance, availability, a11y, security/privacy) are documented; if missing, record as open questions and pause feature sizing until budgets are set
2. Analyze the bundle file at $ARGUMENTS to identify distinct feature sections and titles
3. For each feature, extract:
   - Draft name and short description
   - Candidate FRs (FR-1, FR-2, …) and acceptance criteria stubs
   - Notes on likely technical considerations and data touchpoints
   - Rough sizing: t-shirt estimate (S/M/L/XL) and 1–2 bullet rationale
   - Dependency types: mark predecessors as HARD (cannot proceed) or SOFT (can proceed with stubs/mocks)
4. Build a preliminary dependency graph across features:
   - Identify shared entities/services; extract precedence hints
   - Produce a draft “Dependencies & Predecessors” list per feature with HARD vs SOFT labels
   - Generate a “Critical Path” ordering proposal for initial scheduling
5. Detect cross-feature conflicts (do not attempt to resolve):
   - Database schema overlaps: same tables/collections, columns/fields, differing types/indexes/constraints
   - API collisions: identical or overlapping routes/methods, versioning conflicts, payload/schema mismatches
   - Shared service boundary clashes: features redefining responsibilities of the same module/service
   - Output a “Conflicts” section describing each suspected conflict with involved features and suggested questions to resolve
   - Suggest contract validation steps to reduce later rework:
     - For APIs: OpenAPI/GraphQL schema comparison and linting; versioning strategy alignment
     - For DB: migration dry‑run + schema diff against a representative database
6. Generate outputs under `/prd-bundle/`:
   - `/prd-bundle/index.md` — overview of detected features, dependency graph (topological order), and open questions
   - Include “Conflicts” table, “Sizing” column, and a clearly marked “Critical Path” section to guide scheduling
   - `/prd-bundle/[nn]-draft-prd-[feature-name].md` — draft skeleton PRDs with placeholders (to be finalized via `@create-prd.md`)
7. Stop and ask for confirmation before any final PRD creation

## Output Format
Draft PRD files include the standard PRD sections, but with placeholders to be completed via `@create-prd.md`:
- Introduction/Overview, Goals, User Stories
- Functional Requirements (FR) with preliminary numbering
- Acceptance Criteria (placeholders)
- Design/Technical Considerations (drafted)
- Dependencies & Predecessors (preliminary)
 - Optional “Sizing” and “Assumptions & Risks” stubs

## Next Steps
- For each draft, run `@create-prd.md` to ask qualifying questions and finalize the PRD into `/prds/`
- Then run `@generate-tasks.md <PATH_TO_FINALIZED_PRD>` and proceed with `@process-task-list.md`
- The global ordering from `/prd-bundle/index.md` should be reviewed and carried into `tasks/_index.md` after tasks are generated. If `tasks/_index.md` exists, reconcile and merge dependency data
- Ensure each finalized PRD meets a Definition of Ready (DoR): architecture confirmed, data ownership clarified, UX states available or explicitly deferred, security/tenancy strategy defined, and success metrics aligned to global SLOs

## Important Guidelines
- Do not implement or generate code; this is planning only
- Never assume architecture/stack; propose options and pause for selection if missing
- Ensure drafts are clearly labeled as DRAFT and saved only under `/prd-bundle/`
 - Record any architectural choices or new components suggested during import as pending Architectural Decision Records (ADRs); link them from draft PRDs’ “Technical Considerations” and keep them unresolved until confirmed
