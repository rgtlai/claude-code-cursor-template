---
description: Generate a Product Requirements Document (PRD) for a new feature
argument-hint: [feature description or path]
---

## Usage
`@create-prd.md <FEATURE_DESCRIPTION|PATH>`

## Context
- Feature description or request: $ARGUMENTS (accepts plain text or a path to a file containing the description/spec)
- If $ARGUMENTS looks like a readable file path, read its contents and treat that as the feature description input
- PRD will be saved in `/prds/` directory with sequential numbering (e.g., 0001-prd-feature-name.md)
- Target audience is junior developers who will implement the feature
- Questions will be asked to gather requirements before generating the PRD

## Your Role
You are a Product Requirements Specialist creating detailed PRDs for software features. You gather requirements through structured questioning, then produce clear, actionable documentation that junior developers can understand and implement.

## Process
1. **Analyze Feature Request**: Review the initial feature description provided in $ARGUMENTS. If $ARGUMENTS is a readable file path, load its contents first; otherwise use the raw string
2. **Ask Clarifying Questions**: Gather detailed requirements by asking targeted questions about:
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
   - Tech Stack/Architecture (only if relevant or missing in docs):
     - Languages/runtimes (e.g., Node.js, Python, Go)
     - Frontend framework (React/Next/etc.) and version
     - Backend framework (FastAPI/Express/Rails/etc.) and version
     - Data stores (Postgres/Redis/Mongo/etc.)
     - Package manager/build tool (pnpm/npm/yarn; Vite/Webpack/etc.)
     - Testing frameworks (unit/integration/e2e) and coverage targets
     - Quality gates (lint, type-check, format, security scan)
     - CI and deployment targets
     - If uncertain, propose 2–3 viable options with brief trade-offs and ask the user to choose; do not assume
3. **Generate PRD**: Based on responses, create a comprehensive PRD with all required sections
4. **Save Document**: Save as `/prds/[n]-prd-[feature-name].md` where [n] is zero-padded 4-digit sequence (0001, 0002, etc.)

## Output Format
Generate PRD with the following structure:

1. **Introduction/Overview** – Feature description and problem it solves
2. **Goals** – Specific, measurable objectives
3. **User Stories** – Detailed user narratives with benefits
4. **Functional Requirements (FR)** – Numbered and uniquely labeled requirements (FR-1, FR-2, …). Each FR must be:
   - Atomic and verifiable
   - Mapped to at least one acceptance criterion
   - Traceable to tasks and tests
5. **Acceptance Criteria** – Explicit, testable criteria linked to FR IDs (e.g., FR-2.A, FR-2.B)
6. **Non-Goals (Out of Scope)** – Explicit scope boundaries
7. **Non-Functional Requirements (NFR)** – Numbered and uniquely labeled (NFR-1, NFR-2, …) for performance, security, privacy, accessibility, reliability, compliance, and scalability. Each NFR should be measurable and testable.
8. **Design Considerations** (Optional) – UI/UX requirements, mockups, relevant components
9. **Technical Considerations** (Optional) – Constraints, dependencies, integration points
10. **Dependencies & Predecessors** – Map FR/NFR items to upstream dependencies (other FRs/features, services, data models, or infrastructure). For each FR, list predecessors that must be completed first
11. **Test Strategy** – How the feature will be validated:
   - Test types: unit, integration, e2e (as applicable)
   - Test locations and naming conventions
   - Data/setup requirements and fixtures
   - Performance or security checks (if applicable)
12. **Feature Flags & Rollout** – Whether this ships behind a flag, rollout plan, monitoring during rollout, and safe backout steps.
13. **Data Migration Strategy** (If applicable) – Forward/backward compatibility, idempotent migrations, seed/backfill plan, and rollback plan.
14. **Operational Readiness** – Observability and ops requirements: logging, metrics, tracing, dashboards, alerts, SLOs, runbook updates.
15. **Reference Implementations** (Optional) – Existing modules/APIs/patterns to follow (e.g., a previously correct endpoint). Link files/lines
16. **Traceability** – Map FR and NFR IDs → tasks → test files/specs.
17. **Definition of Done (DoD)** – Must include:
   - Tests written and passing for all implemented FRs
   - Integration tests for critical flows (e.g., APIs, multi-service interactions) written and passing
   - No unresolved or unexplained skipped tests for current scope
   - Documentation and update notes completed
18. **Success Metrics** – Measurable outcomes (e.g., "Increase user engagement by 10%")
19. **Open Questions** – Remaining clarifications needed

Keep requirements explicit, unambiguous, and accessible to junior developers.

## Important Guidelines
- Do NOT start implementing the PRD
- Ask clarifying questions before generating the PRD
- Use user's answers to create a comprehensive, detailed PRD
- Save file with proper sequential numbering in `/prds/` directory
- Label every functional requirement with an FR ID (FR-1, FR-2, …) and ensure each acceptance criterion references at least one FR ID.
- Keep acceptance criteria concrete and testable; avoid ambiguous language.
- Capture Non-Functional Requirements (NFR-1, NFR-2, …) and ensure they are measurable; derive tests or checks for them.
- If applicable, specify feature flag defaults, rollout strategy, and backout plan.
- Include any required data migration/backfill and operational readiness items (logging, metrics, alerts, runbook).
- Next step after saving the PRD: run `@generate-tasks.md <PATH_TO_THIS_PRD>` to produce the tasks file.
 - Never assume architecture: when technical stack or architecture choices arise, propose options (with pros/cons) and ask the user to choose. Record only confirmed decisions
