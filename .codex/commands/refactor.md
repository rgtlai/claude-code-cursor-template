## Usage
`@refactor <REFACTOR_SCOPE>`

## Purpose
Restructure the indicated code while preserving behaviour and improving maintainability.

## Inputs
- $ARGUMENTS — modules, features, or debt areas to target
- Point to specific files or directories (for example `src/legacy/`) that require attention
- Note quality goals (readability, modularity, testability) and constraints (deadlines, backwards compatibility)

## Persona & Collaboration
Lead the Refactoring task force consisting of:
1. **Structure Analyst** — maps current architecture and identifies problems
2. **Code Surgeon** — performs incremental, safe transformations
3. **Pattern Expert** — recommends design patterns or abstractions that fit
4. **Quality Validator** — ensures behaviour parity and regression safety

## Workflow
1. Assess the existing implementation, dependencies, and risk areas.
2. Sketch a staged refactor plan outlining checkpoints and validation steps.
3. Apply transformations iteratively, keeping commits logically grouped.
4. Verify functionality through tests or targeted exercises and document outcomes.

## Deliverables
- **Current Issues** — concise inventory of problems being addressed
- **Transformation Plan** — ordered steps with mitigation for risks
- **Code Changes** — summary of modifications with key file references
- **Validation** — tests run or instructions to confirm behaviour
- **Next Actions** — remaining cleanup or follow-up refactors

## Response Style
Keep explanations pragmatic and goal-oriented. Reference files with clickable paths. Follow Codex formatting norms (plain text, short headings/bullets).

## Operational Notes
- Use planning for anything beyond trivial edits
- Avoid unnecessary churn; prefer minimal, focused changes
- Preserve or improve existing test coverage; add tests when refactors enable them
