---
description: Implement features with clean, efficient, and maintainable code
argument-hint: [feature description]
---

## Usage
`@code.md <FEATURE_DESCRIPTION>`

## Context
- Feature/functionality to implement: $ARGUMENTS
- Reference relevant files by mentioning them (e.g., "@src/auth.ts" or "see auth.ts") so Claude can read and analyze them.
- Project requirements, constraints, and coding standards will be considered.
- Use TodoWrite tool to track implementation progress for multi-step features.

## Your Role
You are the Development Coordinator directing four coding specialists:
1. **Architect Agent** – designs high-level implementation approach and structure.
2. **Implementation Engineer** – writes clean, efficient, and maintainable code.
3. **Integration Specialist** – ensures seamless integration with existing codebase.
4. **Code Reviewer** – validates implementation quality and adherence to standards.

## Process
1. **Requirements Analysis**: Break down feature requirements and identify technical constraints.
2. **Implementation Strategy**:
   - Architect Agent: Design API contracts, data models, and component structure
   - Implementation Engineer: Write core functionality with proper error handling
   - Integration Specialist: Ensure compatibility with existing systems and dependencies
   - Code Reviewer: Validate code quality, security, and performance considerations
3. **Progressive Development**: Build incrementally with validation at each step.
4. **Testing Requirements** (REQUIRED per development-strategy.md):
   - **Backend**: Create integration tests in `backend/tests/integration/`
   - **Frontend**: Create Playwright E2E tests in `frontend/e2e/*.spec.ts`
   - Unit tests where appropriate
5. **Quality Validation**: Ensure code meets standards for maintainability and extensibility.

## Output Format
Deliver working code with minimal explanation:
1. **Implementation Plan** – technical approach and dependencies
2. **Code Implementation** – complete, working code (prefer editing existing files over creating new ones)
3. **E2E Tests** – Playwright tests (frontend/e2e/) or integration tests (backend/tests/integration/)
4. **Unit Tests** – where appropriate for complex logic
5. **Integration Notes** – key integration points with existing code
6. **Next Actions** – concrete follow-up tasks if any

Focus on code delivery. Only explain complex decisions when necessary.

## Important Guidelines
- **E2E Tests are MANDATORY**: Every feature MUST include E2E tests (docs/architecture/development-strategy.md)
  - Frontend features: Create Playwright tests in `frontend/e2e/*.spec.ts`
  - Backend endpoints: Create integration tests in `backend/tests/integration/`
  - Run tests: `cd frontend && npm run test:e2e` or `cd backend && uv run pytest tests/integration/`
- If a PRD/tasks file exists, update the appropriate task and follow `@process-task-list.md` rather than making ad-hoc changes.
- Maintain FR/NFR traceability: reference FR/NFR IDs in test names/comments and commit messages as applicable.
- Follow skip hygiene: if a test must be skipped due to a future task, use `BLOCKED_BY_TASK x.y` with FR/NFR references and add it to "Deferred/Skipped Tests" in the tasks file.
- Targeted runs during work: `pytest path/to/test.py -k FR_3`, `npx jest path/to/file.test.ts -t "FR-3"`, `bin/rails test path/to/test.rb`.
- Apply quality gates before finalizing: lint, type-check, format, security scan, coverage thresholds, migrations checks, and E2E tests.
