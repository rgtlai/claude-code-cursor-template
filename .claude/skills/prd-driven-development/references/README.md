# PRD-Driven Development Skill

## Overview

This skill provides a complete systematic workflow for building software applications from Product Requirements Documents (PRDs) through structured task execution, following enterprise-grade development practices with built-in quality gates, dependency management, and traceability.

## What's Included

### SKILL.md (Main File)
The core skill file containing:
- Prerequisites and CLAUDE.md architecture baseline requirements
- Complete 4-phase workflow (Import → Create PRD → Generate Tasks → Execute)
- Traceability requirements using PRD-scoped IDs
- Global dependency management
- Best practices for Definition of Ready (DoR) and Definition of Done (DoD)
- Quick reference guides

### references/claude-md-template.md
Template for creating the required `CLAUDE.md` architecture baseline file that all commands depend on. Includes sections for:
- Architecture overview and service boundaries
- Tech stack and dependencies
- Data stores, APIs, and contracts
- Security, testing, and quality gates
- CI/CD and observability
- Feature flags and documentation conventions

### references/commands-guide.md
Comprehensive command documentation including:
- Detailed syntax and options for all core commands:
  - `@import-prds` - Parse feature bundles
  - `@create-prd` - Generate comprehensive PRDs
  - `@generate-tasks` - Break down into actionable tasks
  - `@process-task-list` - Execute with quality gates
- Supplementary commands (`@ask`, `@code`, `@debug`, `@test`, etc.)
- Targeted test run patterns for all major frameworks
- Quality gate commands (lint, type-check, format, security, coverage)
- Skip hygiene best practices with `BLOCKED_BY_TASK` notation
- Batch execution modes
- Complete workflow examples
- Troubleshooting guide

### references/blocked-prereqs-table.md
Template and guidelines for the Blocked/Prerequisites table that ensures high visibility of task dependencies. Includes:
- Table template format
- Usage guidelines and column definitions
- Update patterns for different scenarios
- Integration with global index
- Best practices and common patterns

## Key Features

### 1. Enterprise-Grade Practices
- PRD-scoped requirement IDs: `PRD-####-FR-n`, `PRD-####-NFR-n`
- Traceability from requirements → tasks → tests → code
- Quality gates at every parent task boundary
- Architecture Decision Records (ADR) integration
- Definition of Ready and Definition of Done enforcement

### 2. Database-First Mindset
Critical verification protocol for database changes:
```
OLD: Files exist = Work complete
NEW: Files exist + Executed + Verified = Work complete
```

Includes mandatory verification steps:
- Execute migrations against real database
- Verify schema structure
- Test data population
- Test rollback and re-apply
- Run integration tests against real DB (not mocked)

### 3. Dependency Management
- Global `tasks/_index.md` tracks cross-PRD dependencies
- Blocked/Prerequisites tables in every tasks file
- Topological ordering of tasks
- Clear visibility of what's ready vs blocked

### 4. Test-First Approach
- Sub-tasks structured as: Write tests → Implement → Run tests → Fix
- Targeted test runs per FR/NFR
- Skip hygiene with `BLOCKED_BY_TASK x.y` notation
- Integration tests required for critical flows

### 5. Comprehensive Coverage
Supports all major test frameworks and languages:
- Python (Pytest)
- JavaScript/TypeScript (Jest, Mocha, Playwright, Cypress)
- Ruby (RSpec, Rails Test)
- Go
- Quality gates for linting, type-checking, formatting, security

## Workflow Summary

### Phase 1: Import Bundle (Optional)
Parse a multi-feature spec file into draft PRDs with dependency analysis.

### Phase 2: Create PRD
Generate comprehensive PRD through structured questioning with complexity profiles (simple/standard/complex).

### Phase 3: Generate Tasks
Two-phase generation:
1. Parent tasks with dependency mapping
2. Detailed sub-tasks with test-first pattern (after user confirmation)

### Phase 4: Execute Tasks
Systematic execution with:
- One sub-task at a time with user approval
- Quality gates at parent completion
- Database verification for schema changes
- Conventional commits with PRD tokens

## Quick Start

1. Copy and fill `CLAUDE.md` using the provided template
2. Create or import PRDs
3. Generate task lists
4. Execute with built-in quality gates

## Batch Execution

For faster execution while maintaining quality:
```bash
@process-task-list tasks/tasks-0001.md --batch parent=1.0 --commit-per-subtask --yes
```
Note: Batch mode skips prompts but does NOT skip tests or quality gates.

## Use Cases

- Building complete applications from requirements
- Managing multi-feature projects with dependencies
- Ensuring enterprise-grade quality and traceability
- Coordinating cross-team development
- Maintaining architectural consistency
- Database-heavy applications requiring verification
- Projects requiring compliance and audit trails

## Installation

Upload the `prd-driven-development.skill` file to your Claude Code skills library.

## Support

Refer to:
- `SKILL.md` for workflow overview
- `references/commands-guide.md` for detailed command documentation
- `references/claude-md-template.md` for architecture baseline setup
- `references/blocked-prereqs-table.md` for dependency management
