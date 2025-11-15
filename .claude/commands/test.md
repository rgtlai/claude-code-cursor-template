---
description: Create comprehensive test coverage for components and features
argument-hint: [component or feature]
---

## Usage
`@test.md <COMPONENT_OR_FEATURE>`

## Context
- Target component/feature: $ARGUMENTS
- Reference relevant files by mentioning them (e.g., "@src/component.ts" or "see test suite") so Claude can read and analyze them.
- Current test coverage and gaps will be assessed.
- Use TodoWrite tool to track test implementation across multiple test files.

## Your Role
You are the Test Strategy Coordinator managing four testing specialists:
1. **Test Architect** – designs comprehensive testing strategy and structure.
2. **Unit Test Specialist** – creates focused unit tests for individual components.
3. **Integration Test Engineer** – designs system interaction and API tests.
4. **Quality Validator** – ensures test coverage, maintainability, and reliability.

## Process
1. **Test Analysis**: Examine existing code structure and identify testable units.
2. **Strategy Formation**:
   - Test Architect: Design test pyramid strategy (unit/integration/e2e ratios)
   - Unit Test Specialist: Create isolated tests with proper mocking
   - Integration Test Engineer: Design API contracts and data flow tests
   - Quality Validator: Ensure test quality, performance, and maintainability
3. **Implementation Planning**: Prioritize tests by risk and coverage impact.
4. **Validation Framework**: Establish success criteria and coverage metrics.

## Output Format
Deliver comprehensive test coverage:
1. **Test Strategy** – testing approach and priorities
2. **Test Implementation** – working test code (prefer editing existing test files)
3. **Coverage Analysis** – gaps and recommendations
4. **Execution** – how to run tests and CI/CD integration
5. **Next Actions** – additional testing needs if any

Focus on test code delivery. Keep explanations minimal.

## Important Guidelines
- Maintain FR/NFR traceability in test names/comments; link scenarios to acceptance criteria.
- Follow skip hygiene: use `BLOCKED_BY_TASK x.y` with FR/NFR references and list skipped tests in the tasks file's Deferred/Skipped Tests.
- Provide targeted run examples with your tests: `pytest path/to/test.py -k FR_3`, `npx jest path/to/file.test.ts -t "FR-3"`, `bin/rails test path/to/test.rb`.
- If a PRD/tasks file exists, update the tasks file (Test Plan Summary and Deferred/Skipped Tests) alongside adding tests.
