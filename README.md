# AI Assistant Commands (Codex + Claude)

This repo provides a production‑minded workflow to take complex features from specs → PRDs → tasks → execution with quality gates and traceability. Use alongside either Codex CLI or Claude Code.

- Command reference: see `COMMANDS.md`
- Architecture baseline template: `CLAUDE.md.template`
- Governance templates: `docs/adr/0000-adr-template.md`, `docs/governance/dor-dod.md`

## Core Workflow
- Import bundle → drafts: `@import-prds.md specs/all_features.md`
- Finalize PRD: `@create-prd.md prd-bundle/0001-draft-prd-foo.md --prd-complexity standard`
- Generate tasks: `@generate-tasks.md prds/0001-prd-foo.md`
- Execute tasks: `@process-task-list.md tasks/tasks-0001-prd-foo.md --batch parent=1.0 --yes`
- Keep global index current: `node scripts/update-global-index.mjs`

See “Getting Started” in `COMMANDS.md` for details and options.

## Scripts

- `node scripts/update-global-index.mjs` (or `npm run update:tasks-index`)
  - Aggregates per‑PRD Blocked/Prereqs tables into `tasks/_index.md`
  - Computes a recommended topological order
  - Options:
    - `--tasks-dir tasks` — override tasks dir
    - `--index-file tasks/_index.md` — override index path
    - `--dry-run` — preview changes without writing

- `node scripts/check-prd-tokens.mjs` (or `npm run check:prd-tokens`)
  - Scans common test files (Jest/Mocha/Pytest/RSpec/Go) for PRD tokens like `PRD-0007-FR-3`
  - Fails in `--strict` mode if any tests are missing tokens
  - Options:
    - `--root .` — set scan root
    - `--include-ext js,ts,tsx,jsx,py,rb,go` — limit file types
    - `--print` — print success summary

Convenience npm scripts are defined in `package.json`:
- `npm run update:tasks-index`
- `npm run update:tasks-index:dry`
- `npm run check:prd-tokens`
- `npm run check:prd-tokens:print`
- `npm run ci:verify` — token check + index dry‑run

## Task Index
- Global index lives at `tasks/_index.md`
- Auto‑generated sections are marked between:
  - `<!-- BEGIN AUTO-GENERATED: BLOCKED_TABLE --> ... <!-- END AUTO-GENERATED: BLOCKED_TABLE -->`
  - `<!-- BEGIN AUTO-GENERATED: TOPO_ORDER --> ... <!-- END AUTO-GENERATED: TOPO_ORDER -->`

## Scaffolds
- Blocked/Prereqs table scaffold to include in each tasks file:
  - `scaffolding/templates/blocked-prereqs-table.md`

## CI Integration (Example: GitHub Actions)

```yaml
name: verify
on:
  pull_request:
  push:
    branches: [ main ]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci || true # no deps required; keep for future
      - run: npm run ci:verify
```

This CI job enforces test naming with PRD tokens and ensures the global tasks index can be updated cleanly.

An example workflow is included at `.github/workflows/verify.yml` and runs on push/PR:
- Sets up Node 20
- Runs `npm run ci:verify` (PRD token check + index dry-run)

## Onboarding Existing Apps

Two supported scenarios. This workflow works in both.

### Case A — App Has Never Used This Workflow (no `prds/`, no `tasks/`)
- 1. Create Architecture Baseline in the app repo
  - Copy this repo’s `CLAUDE.md.template` to your app as `CLAUDE.md`
  - Fill the minimums: architecture links, stack + versions, primary DB + migration tool, testing + coverage, quality gates, environments
  - Add global NFR budgets (performance SLO/SLIs, availability, a11y level, security/privacy) and test env standard (Testcontainers or docker‑compose) with quick commands
- 2. Seed directories in the app repo
  - Create `prds/` and `tasks/`
  - Create `tasks/_index.md` (copy this repo’s template at `tasks/_index.md`), or seed later with the index script
- 3. Import features (optional, if you have a bundle)
  - `@import-prds.md specs/all_features.md --repo-root /path/to/app`
  - Review `/prd-bundle/index.md` and draft PRDs
- 4. Finalize PRDs
  - `@create-prd.md prd-bundle/0001-draft-prd-foo.md --prd-complexity standard --repo-root /path/to/app`
  - Ensure DoR is met; record ADRs for new technical choices
- 5. Generate tasks per PRD
  - `@generate-tasks.md /path/to/app/prds/0001-prd-foo.md --repo-root /path/to/app`
  - Insert the Blocked/Prereqs table scaffold (see `scaffolding/templates/blocked-prereqs-table.md`)
  - Update global index:
    - From this repo: `node scripts/update-global-index.mjs --tasks-dir /path/to/app/tasks --index-file /path/to/app/tasks/_index.md`
    - Or copy `scripts/` into the app and run `npm run update:tasks-index` from the app root
- 6. Execute tasks
  - `@process-task-list.md /path/to/app/tasks/tasks-0001-prd-foo.md --batch parent=1.0 --yes --repo-root /path/to/app`
  - Use batch mode to reduce prompts; keep the global index updated
- 7. Optional: audit tests
  - `@test-audit.md all --repo-root /path/to/app`

### Case B — App Already Has `prds/` and `tasks/` (older workflow)
- 1. Update Architecture Baseline
  - Ensure `CLAUDE.md` includes global NFR budgets and test env standards
  - Add ADRs for any unresolved technical decisions
- 2. Normalize with migration tool
  - Dry‑run: `@migrate-project-structure --repo-root /path/to/app`
  - Review the plan (PRD naming, add Blocked/Prereqs tables, create/update `tasks/_index.md`)
  - Apply: `@migrate-project-structure apply --repo-root /path/to/app`
- 3. Enforce traceability and index
  - Update global index:
    - `node scripts/update-global-index.mjs --tasks-dir /path/to/app/tasks --index-file /path/to/app/tasks/_index.md`
  - Enforce PRD tokens in tests:
    - `node scripts/check-prd-tokens.mjs --root /path/to/app --strict`
- 4. Adopt the new gates on ongoing work
  - Ensure DoR/DoD are followed; use batch execution with quality gates and DB verification

### Monorepo / Multi‑Repo Tips
- Use `--repo-root` with commands when the commands run outside the app repo
- You can vendor `scripts/` into the app or run from this repo by passing explicit `--tasks-dir` and `--index-file` paths
- The token checker can target any repo: `node scripts/check-prd-tokens.mjs --root /path/to/repo --strict`

## Governance & Quality
- Architecture baseline and global NFR budgets live in `CLAUDE.md` (create from `CLAUDE.md.template`)
- ADRs for new technical decisions: `docs/adr/0000-adr-template.md`
- DoR/DoD checklists: `docs/governance/dor-dod.md`
- Quality gates (lint/type/format/security/coverage/migrations) are applied at parent task boundaries per commands’ guidance

## Useful Links
- Commands overview and usage: `COMMANDS.md`
- Claude commands: `.claude/commands/`
- Codex commands: `.codex/commands/`
