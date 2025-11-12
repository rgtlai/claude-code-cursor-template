## Usage
`@create-prd.md <FEATURE_DESCRIPTION|PATH> [--prd-complexity simple|standard|complex]`

## Purpose
Generate a comprehensive Product Requirements Document (PRD) for a new feature by gathering requirements through structured questioning and producing clear, actionable documentation suitable for junior developers.

## Inputs
- $ARGUMENTS — initial feature description or a path to a file containing the description/spec
- If $ARGUMENTS is a readable path, read its contents and treat that as the feature description input
- PRD will be saved in `/prds/` directory with sequential numbering (e.g., 0001-prd-feature-name.md)
- Target audience is junior developers who will implement the feature

## Prerequisite: CLAUDE.md Architecture Baseline (Required)
- Location: `CLAUDE.md` at the repository root (or provided repo root)
- Must include or link to the system architecture and stack baseline:
  - Languages/runtimes and versions
  - Frontend and backend frameworks and versions
  - Data stores (primary/secondary), messaging, and tenancy model
  - Service boundaries and repo layout (monorepo/multi-repo pointers)
  - Testing stack, quality gates (lint, type, format, security, coverage)
  - CI/CD targets, environments, deployment strategy, and rollout practices
  - Documentation conventions and pointers to architecture/design docs
- Do not proceed until this baseline exists. If missing or incomplete, pause and create/update `CLAUDE.md` first. Confirm global NFR budgets (performance SLO/SLIs, availability, a11y target level, security/privacy) exist or are linked; if missing, record open questions and pause NFR scoping.

## Persona & Collaboration
Act as the Product Requirements Specialist coordinating insights from four virtual advisors:
1. **Business Analyst** — problem definition, goals, and success metrics
2. **User Experience Designer** — user stories, workflows, and UI/UX considerations
3. **Technical Architect** — technical constraints, dependencies, and integration points
4. **Quality Assurance Lead** — acceptance criteria, edge cases, and testing requirements

## Workflow
1. Validate and read `CLAUDE.md` architecture baseline. If missing or lacking an Architecture section or links, stop and request baseline creation/confirmation.
2. Analyze the initial feature description provided in $ARGUMENTS.
3. Ask targeted clarifying questions in three tiers and do not proceed until “Critical” items are answered:
   - Critical blockers (must answer to proceed): scope boundaries, core business goal, target user, must-have FRs, key constraints, data model/ownership, security/tenancy
   - Important clarifications (affect scope/solution): UX flows, integration points, rollout/flag needs, measurable NFR targets
   - Nice-to-haves (can defer): UI polish preferences, stretch goals
   - Problem/Goal: What problem does this solve? What's the main objective?
   - Target User: Who will use this feature?
   - Core Functionality: What key actions should users be able to perform?
   - User Stories: Specific use cases (As a [user], I want to [action] so that [benefit])
   - Acceptance Criteria: How will we measure successful implementation?
   - Scope/Boundaries: What should this feature NOT do (non-goals)?
   - Data Requirements: What data needs to be displayed or manipulated?
   - Design/UI: Any mockups, UI guidelines, or desired look and feel?
   - Edge Cases: Potential error conditions or edge cases to consider?
   - Provide options in letter/number lists for easy user selection
   - Tech Stack/Architecture (if relevant or not documented):
     - Languages/runtimes (Node.js, Python, Go) and versions
     - Frontend (React/Next/etc.) and Backend (FastAPI/Express/Rails/etc.) frameworks
     - Data stores and messaging
     - Package manager/build tool (pnpm/npm/yarn; Vite/Webpack/etc.)
     - Testing (unit/integration/e2e) and coverage targets
     - Quality gates (lint, type-check, format, security scan) and CI
     - Deployment targets and environments
     - If unclear, present 2–3 sensible options with trade-offs and ask the user to choose; never assume
   - Architectural Decisions: If the feature introduces a new component/pattern, draft an ADR (Architecture Decision Record) and link it from the PRD. Keep ADR status Proposed until approved; avoid recording assumptions as facts in the PRD
4. Based on responses, create a PRD using the selected complexity profile (`simple` omits optional sections; `standard` includes common sections; `complex` includes all sections).
5. Save the document as `/prds/[n]-prd-[feature-name].md` where [n] is zero-padded 4-digit sequence (0001, 0002, etc.).

## Deliverables
- **Introduction/Overview** — feature description and problem it solves
- **Goals** — specific, measurable objectives
- **User Stories** — detailed user narratives with benefits
- **Functional Requirements (FR)** — use PRD-scoped IDs so they’re globally unique: `PRD-[####]-FR-[n]` (e.g., `PRD-0007-FR-1`). Each FR is atomic, verifiable, and mapped to acceptance criteria.
- **Acceptance Criteria** — explicit, testable criteria linked to PRD-scoped FR IDs (e.g., `PRD-0007-FR-2.A`, `PRD-0007-FR-2.B`)
- **Non-Goals (Out of Scope)** — explicit scope boundaries
- **Non-Functional Requirements (NFR)** — use PRD-scoped IDs: `PRD-[####]-NFR-[n]` (e.g., `PRD-0007-NFR-1`) for performance, security, privacy, accessibility, reliability, compliance, scalability. Each is measurable and testable.
  - Provide numeric targets where possible (e.g., P95 latency <300ms; error rate <0.1%).
- **API Contract** (If applicable) — endpoints with methods and auth/tenancy, request/response schemas, status codes and error formats; link to OpenAPI/GraphQL schema when possible.
- **Error Scenarios & Handling** — expected error cases (validation, network, timeouts) and responses; retries/backoff; user-facing error messages.
- **Design Considerations** (Optional) — UI/UX requirements, mockups, relevant components
- **Technical Considerations** (Optional) — constraints, dependencies, integration points
- **Dependencies & Predecessors** — map FR/NFR items to upstream dependencies (other FRs/features, services, data models, infrastructure). For each FR, list predecessors that must be completed first
- **Test Strategy** — test types, locations, naming, fixtures/data setup, and any performance/security checks
- **Feature Flags & Rollout** — flag default, rollout plan, monitoring, and backout steps
- **Data Migration Strategy** — forward/backward compatibility, seed/backfill, rollback
- **Database Change Verification Checklist** (Required for PRDs involving data schema/migrations) — steps that MUST be completed before marking database work as "done":
  - [ ] Migration/schema files generated
  - [ ] Migrations executed successfully against a clean database instance
  - [ ] Schema verified to match model definitions (manual inspection or automated schema comparison)
  - [ ] Data population/seed scripts tested successfully
  - [ ] Rollback tested (downgrade/undo migrations)
  - [ ] Re-apply tested (re-run migrations after rollback)
  - [ ] Integration tests run against a real database instance (not mocked/in-memory)

  Verification Command Examples (framework-agnostic):
  ```bash
  # Apply migrations
  [migration-tool] upgrade

  # Verify schema (database-specific)
  [inspect schema command]

  # Test data population
  [run seed script]

  # Run integration tests
  [test-runner] [integration-tests] --database=real

  # Test rollback and re-apply
  [migration-tool] downgrade [previous-version]
  [migration-tool] upgrade [current-version]
  ```
  Critical Principle: Database changes are NOT complete until the schema exists in an actual database and works as expected.
- **Operational Readiness** — logging, metrics, tracing, dashboards, alerts, SLOs, runbooks
- **Reference Implementations** (Optional) — existing modules/APIs/patterns to follow (e.g., a previously correct endpoint). Link files/lines
- **Traceability** — matrix mapping FR and NFR IDs → tasks → test files/specs
- **Definition of Done (DoD)** — tests written and passing for all implemented FRs; integration tests for critical flows are written and passing; for database changes: all items in the "Database Change Verification Checklist" verified; no unexplained skips; docs updated
  - Link any ADRs affecting this feature and note their status
- **Success Metrics** — measurable outcomes (e.g., "Increase user engagement by 10%")
- **Open Questions** — remaining clarifications needed
 - **Change Control** — how PRD revisions are handled (e.g., re-run `@generate-tasks` to produce delta tasks; update traceability and affected tests)

## Response Style
Keep requirements explicit, unambiguous, and accessible to junior developers. Follow Codex CLI formatting norms. Lead with clarifying questions before generating the full PRD.

## Operational Notes
- Do NOT start implementing the PRD
- Ask clarifying questions before generating the PRD
- Use user's answers to create a comprehensive, detailed PRD
- Save file with proper sequential numbering in `/prds/` directory
- Label every functional requirement with a PRD-scoped FR ID (e.g., `PRD-0007-FR-1`) and ensure acceptance criteria reference those IDs.
- Keep acceptance criteria concrete and testable; avoid ambiguous wording.
- Capture Non-Functional Requirements (NFR-1, NFR-2, …) with measurable acceptance tests or checks.
- If applicable, specify feature flag defaults, rollout strategy, and backout plan.
- Include migration/backfill notes and operational readiness (observability and runbooks).
- Next step after saving the PRD: run `@generate-tasks.md <PATH_TO_THIS_PRD>` to produce the tasks file.
 - Complexity profiles: `--prd-complexity simple` omits optional sections (Design/Technical Considerations, Flags/Rollout, Migration Strategy, Operational Readiness) unless the feature involves backend/API or data changes. Use `standard` by default; use `complex` for multi-service, data-heavy features.
 - Never assume architecture: when stack or architecture choices are needed, present options with trade-offs and request explicit user confirmation before documenting
 - Document dependencies: for each FR/NFR, list predecessors (other FRs/features/services) and any external dependencies that must be ready first.
 - For PRDs defining APIs, include an API Implementation Checklist covering: auth context extraction (avoid sensitive fields in request body), multi-tenancy filtering, RBAC checks, JSON/datetime serialization, proper 404 vs 422 behavior, and integration tests.
 - Ensure Definition of Ready (DoR) is met before finalizing: architecture/data ownership confirmed; UX states available or explicitly deferred; security/tenancy clarified; success metrics aligned to global SLOs
