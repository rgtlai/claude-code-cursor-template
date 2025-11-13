# AI Assistant Commands Reference

This repository contains custom commands for AI coding assistants (Claude Code and Codex CLI). Each command is available in both `.claude/commands/` and `.codex/commands/` directories with equivalent functionality adapted for each platform.

Note on Template vs. Application Docs
- This repo is a command template. It does not include an application-level `CLAUDE.md`.
- Many commands look for the project's own `CLAUDE.md` (in the target application repository) and optional docs under `docs/` (e.g., `docs/architecture.md`, `docs/stack.md`).
- If those docs are missing or ambiguous, commands will ask clarifying questions and will not assume architecture or introduce tools without explicit approval.
- Usage, behavior, and expectations for these commands are documented here in `COMMANDS.md` and within each command file.

## CLAUDE.md Architecture Baseline (Required)
- Before running planning or execution commands against an application repo, ensure a `CLAUDE.md` exists at that repo’s root describing or linking to the system architecture and stack baseline.
- Copy `CLAUDE.md.template` from this repository into your application repo as `CLAUDE.md` and fill it in (or link to existing docs) before proceeding.
- Commands that require the baseline will STOP if `CLAUDE.md` is missing or lacks an Architecture/Stack section or links.
- When operating across repos/monorepos, pass `--repo-root /path/to/app-repo` to commands that support it so `CLAUDE.md` is resolved in the correct root.

## Baseline & Governance (Strongly Recommended)
- Global NFR budgets: Define performance SLO/SLIs, availability targets, accessibility level, and security/privacy requirements in `CLAUDE.md` or linked docs
- ADR workflow: Capture new architectural decisions in ADRs and link them from PRDs and tasks; keep status up to date
- Definition of Ready (DoR): Before finalizing a PRD, confirm architecture/data ownership, UX states (or explicit deferral), security/tenancy strategy, and success metrics alignment to global SLOs
- Definition of Done (DoD): At parent task closure, enforce tests green, quality gates, feature flags configured, and operational readiness (logging/metrics/tracing, dashboards/alerts, runbooks)
- Test environments: Standardize ephemeral integration/DB environments (e.g., Testcontainers or docker‑compose) and document quick commands in `CLAUDE.md`
 - Templates: see `docs/adr/0000-adr-template.md` and `docs/governance/dor-dod.md`

## Getting Started (Minimal Steps)
- Copy baseline: `cp CLAUDE.md.template CLAUDE.md` and fill ONLY these minimum fields:
  - Architecture link(s) and service boundaries
  - Tech stack: languages/runtimes + FE/BE frameworks (with versions)
  - Primary database + migration tool; testing frameworks + coverage threshold
  - Quality gates to enforce (lint/type/format/security); environments (Dev/Staging/Prod)
- Import bundle with conflicts + sizing: `@import-prds.md specs/all_features.md [--repo-root PATH]`
- Finalize a PRD with right complexity:
  - Simple UI: `@create-prd.md prd-bundle/0001-draft-prd-foo.md --prd-complexity simple`
  - Standard: `@create-prd.md prd-bundle/0002-draft-prd-bar.md --prd-complexity standard`
  - Complex (multi-service/data-heavy): `@create-prd.md prd-bundle/0003-draft-prd-baz.md --prd-complexity complex`
- Generate tasks with integration plan: `@generate-tasks.md prds/0001-prd-foo.md [--repo-root PATH]`
- Execute efficiently with batch + frequent commits:
  - `@process-task-list.md tasks/tasks-0001-prd-foo.md --batch parent=1.0 --commit-per-subtask --yes`
  - Batch mode skips prompts only; it does NOT skip tests or quality gates.
- Keep `tasks/_index.md` current: after generating each tasks file, merge global dependencies and recompute ordering; update readiness as parents complete
- Auto-update global index: `node scripts/update-global-index.mjs` (add `--dry-run` to preview changes)
- Use the standard Blocked/Prereqs table scaffold in tasks files: `scaffolding/templates/blocked-prereqs-table.md`
 - Enforce PRD tokens in tests: `npm run check:prd-tokens` (fails when tests lack `PRD-####-FR-n` or `PRD-####-NFR-n`)

## Available Commands

### Architecture & Planning

#### `@ask`
Provides senior-level architectural guidance by synthesizing insights from multiple specialist perspectives including systems design, technology strategy, scalability, and risk analysis. Use this when you need high-level architectural decisions, design recommendations, or guidance on complex technical questions without writing code.

#### `@create-prd.md`
Generates comprehensive Product Requirements Documents for new features through structured questioning. The command walks you through gathering requirements about goals, user stories, acceptance criteria, and scope, then produces a detailed PRD saved in `/prds/` with sequential numbering. Use this at the start of any new feature to document requirements before implementation.

#### `@generate-tasks.md`
Breaks down a PRD into actionable task lists with relevant files and sub-tasks suitable for junior developers. It analyzes both the PRD and existing codebase to create structured tasks in two phases: first generating parent tasks for approval, then detailed sub-tasks. Use this after creating a PRD to plan the implementation work. After generating a tasks file, it updates a global index at `tasks/_index.md` to track cross‑PRD dependencies and readiness.

#### `@import-prds.md`
Imports a single spec/bundle file containing multiple features and splits it into draft PRDs under `/prd-bundle/`, deriving a preliminary dependency graph and index. Drafts are then finalized via `@create-prd.md` into `/prds/` before generating tasks.

#### `@migrate-project-structure`
Migrates an existing repository to the new PRD → Tasks workflow. Normalizes PRDs in `/prds/`, ensures each `tasks-[prd].md` includes Task Dependencies and a “Blocked/Prereqs” table (placed after “Risks & Assumptions”), and creates/updates `tasks/_index.md` to consolidate global dependencies and readiness. Supports dry-run and apply modes with plan/diff previews.

#### `@process-task-list.md`
Systematically executes tasks from a task list file one sub-task at a time with user approval between each step. It maintains progress tracking, runs tests after completing parent tasks, and creates properly formatted commits. Use this to work through generated task lists in a controlled, methodical manner.

### Code Development

#### `@code`
Implements requested features or fixes by coordinating end-to-end changes across the codebase. It handles architecture planning, implementation, integration with existing code, and validation. Use this for implementing new features, bug fixes, or enhancements when you want comprehensive code changes with minimal ceremony.

#### `@debug`
Diagnoses and resolves concrete runtime or build failures by coordinating targeted fixes. It reproduces failures, analyzes errors, traces code flow, validates environment, and implements minimal fixes. Use this when you have a specific error or failure that needs immediate resolution.

#### `@diagnose`
Performs deep-dive investigation into defects to identify root causes and propose fixes without modifying production code. It conducts static analysis and can create temporary diagnostic scripts in a `diagnose/` directory. Use this when you want to understand a problem thoroughly before making changes.

#### `@refactor`
Restructures code while preserving behavior to improve maintainability. It assesses existing implementation, creates a staged refactor plan, and applies incremental transformations with validation. Use this to improve code quality, modularity, or readability without changing functionality.

#### `@optimize`
Improves performance characteristics of components or workflows with measurable results. It establishes baselines, identifies bottlenecks, implements targeted optimizations, and re-measures performance. Use this when you need to improve speed, reduce resource usage, or enhance scalability.

### Quality & Testing

#### `@test`
Designs and implements comprehensive automated tests for specified components or features. It reviews implementation gaps, drafts test strategies, and creates unit, integration, or e2e tests. Use this to add test coverage for new features, existing code, or bug fixes.

#### `@review-code`
Conducts thorough multi-perspective code review covering quality, security, performance, and architecture. It provides prioritized feedback with blocking issues highlighted separately from improvements. Use this before merging changes to catch defects, risks, and improvement opportunities.

### Project Scaffolding

#### `@create-scaffold-template`
Guides you through defining reusable scaffolding templates through interactive questioning. It captures project type, stack preferences, features, and structure, then saves a complete template specification in `./scaffolding/`. Use this to create templates for commonly used project architectures.

#### `@generate-scaffold`
Instantiates a full project scaffold from templates stored in `./scaffolding/`. It creates every directory, file, and configuration described in the template, sets up dependencies, and provides quick-start instructions. Use this to bootstrap new projects from predefined templates.

### Documentation

#### `@flow-chart-diagram`
Generates Mermaid flowchart documentation showing system architecture, data flow, and key interactions. It analyzes the codebase and writes properly formatted flowchart files to `./diagrams/` with color-coded components and clear visual representation. Use this to document or understand complex system workflows.

#### `@verify-diagram`
Audits an existing architecture or flow diagram—often Mermaid—against the current codebase. It parses the diagram, checks that components and integrations still match reality, and produces a discrepancy report with actionable fixes. Use this to keep externally supplied or Claude-generated diagrams trustworthy.

## Command Usage Patterns

### Feature Development Workflow
1. `@create-prd` - Document feature requirements
2. `@generate-tasks` - Break down into tasks
3. `@process-task-list` - Execute tasks systematically
4. `@test` - Add comprehensive tests
5. `@review-code` - Final quality check

### Debugging Workflow
1. `@diagnose` - Deep investigation (no code changes)
2. `@debug` - Implement targeted fix
3. `@test` - Add regression tests
4. `@review-code` - Validate the solution

### Optimization Workflow
1. `@diagnose` - Identify bottlenecks
2. `@optimize` - Implement improvements
3. `@test` - Verify performance gains
4. `@review-code` - Check for trade-offs

### Project Setup Workflow
1. `@ask` - Architectural guidance
2. `@create-scaffold-template` - Define template
3. `@generate-scaffold` - Create project structure
4. `@code` - Implement core features
5. `@flow-chart-diagram` - Document architecture

### Migration Quickstart
Use this when adopting the new PRD → Tasks workflow in an existing repo.
1. `@import-prds` (optional) - Split a single features/specs file into draft PRDs under `/prd-bundle/`
2. `@create-prd` - Finalize each PRD into `/prds/` via qualifying questions
3. `@generate-tasks` - Create `tasks-[prd].md`, add Task Dependencies + Blocked/Prereqs table, and update `tasks/_index.md`
4. `@migrate-project-structure` (dry-run) - Plan and preview normalization and global index updates
5. `@migrate-project-structure apply` - Apply approved changes; then proceed with `@process-task-list` on unblocked items

## Tips

- Commands work identically in both Claude Code and Codex CLI
- Most commands support planning mode for complex multi-step operations
- Commands preserve existing conventions and prefer minimal changes
- File paths should be workspace-relative for best results
- Commands coordinate virtual specialist teams for comprehensive analysis

## Targeted Test Runs and Skip Hygiene

Use these quick commands and patterns across languages and frameworks to run only what matters and keep skips traceable to tasks and requirements.

### Targeted Test Runs
- Pytest: `pytest path/to/test.py -k PRD_0007_FR_3`
- Jest: `npx jest path/to/file.test.ts -t "PRD-0007-FR-3"`
- Mocha: `npx mocha 'test/**/*.spec.ts' -g "PRD-0007-FR-3"`
- RSpec: `bundle exec rspec spec/path/to_spec.rb --example "PRD-0007-FR-3"`
- Rails test: `bin/rails test test/models/user_test.rb:42`
- Go: `go test ./... -run PRD_0007_FR_3`
- Playwright: `npx playwright test -g "PRD-0007-FR-3"`
- Cypress (with grep): `npx cypress run --spec "cypress/e2e/path.cy.ts" --env grep=PRD-0007-FR-3`

Tip: Use PRD-scoped FR/NFR tokens (e.g., `PRD-0007-FR-3`, `PRD-0007-NFR-1`) in test names or descriptions to make targeted filters easy and globally unique.

### Skip Hygiene (BLOCKED_BY_TASK)
- Pytest: `@pytest.mark.skip(reason="BLOCKED_BY_TASK 3.2 PRD-0007-FR-5")`
- Jest/Mocha: `test.skip('PRD-0007-FR-5 scenario', ...) // BLOCKED_BY_TASK 3.2`
- RSpec: `pending 'BLOCKED_BY_TASK 3.2 PRD-0007-FR-5'`
- Go: `t.Skip("BLOCKED_BY_TASK 3.2 PRD-0007-FR-5")`

Always add skipped tests to the tasks file under "Deferred/Skipped Tests" with the blocker task (e.g., 3.2) and the relevant PRD-scoped FR/NFR IDs.

### Quality Gates (quick commands)
- Lint: `npm run lint` (or `pnpm lint`, `ruff .`)
- Type-check: `tsc --noEmit` (or `mypy .`)
- Format: `npm run format:check` (or `prettier --check .`, `black --check .`)
- Security: `npm audit` (or `bandit -r .`, `govulncheck ./...`)
- Coverage: `jest --coverage` (or `pytest --cov`)
- Migrations: `bin/rails db:migrate:status` (or `alembic current heads`)
