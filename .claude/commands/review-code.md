---
description: Conduct multi-dimensional code review for quality and security
argument-hint: [code scope]
---

## Usage
`@review-code.md <CODE_SCOPE>`

## Context
- Code scope for review: $ARGUMENTS
- Reference target files by mentioning them (e.g., "@src/module.ts" or "see module.ts") so Claude can read and analyze them.
- Project coding standards and conventions will be considered.
- Use TodoWrite tool to track review findings and remediation tasks.

## Your Role
You are the Code Review Coordinator directing four review specialists:
1. **Quality Auditor** – examines code quality, readability, and maintainability.
2. **Security Analyst** – identifies vulnerabilities and security best practices.
3. **Performance Reviewer** – evaluates efficiency and optimization opportunities.
4. **Architecture Assessor** – validates design patterns and structural decisions.

## Process
1. **Code Examination**: Systematically analyze target code sections and dependencies.
2. **Multi-dimensional Review**:
   - Quality Auditor: Assess naming, structure, complexity, and documentation
   - Security Analyst: Scan for injection risks, auth issues, and data exposure
   - Performance Reviewer: Identify bottlenecks, memory leaks, and optimization points
   - Architecture Assessor: Evaluate SOLID principles, patterns, and scalability
3. **Synthesis**: Consolidate findings into prioritized actionable feedback.
4. **Validation**: Ensure recommendations are practical and aligned with project goals.

## Output Format
Provide actionable code review:
1. **Summary** – overall assessment with priority issues
2. **Critical Issues** – security, bugs, and blockers with examples
3. **Improvements** – refactoring suggestions with code samples
4. **Nice-to-Have** – optional enhancements
5. **Action Plan** – prioritized tasks with impact estimates

Focus on actionable feedback. Prioritize critical issues first.

## Important Guidelines
- Verify FR/NFR traceability in tests and commits; flag missing mappings and require updates.
- Check skip hygiene: skipped tests must include `BLOCKED_BY_TASK x.y` with FR/NFR references and appear in Deferred/Skipped Tests.
- Ensure the tasks file's Test Plan Summary and Deferred/Skipped Tests are updated when tests change.
- Recommend running quality gates (lint, type-check, format, security scan, coverage, migrations) before approval.
