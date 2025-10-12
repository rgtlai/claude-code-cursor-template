# AI Assistant Commands Reference

This repository contains custom commands for AI coding assistants (Claude Code and Codex CLI). Each command is available in both `.claude/commands/` and `.codex/commands/` directories with equivalent functionality adapted for each platform.

## Available Commands

### Architecture & Planning

#### `@ask`
Provides senior-level architectural guidance by synthesizing insights from multiple specialist perspectives including systems design, technology strategy, scalability, and risk analysis. Use this when you need high-level architectural decisions, design recommendations, or guidance on complex technical questions without writing code.

#### `@create-prd`
Generates comprehensive Product Requirements Documents for new features through structured questioning. The command walks you through gathering requirements about goals, user stories, acceptance criteria, and scope, then produces a detailed PRD saved in `/tasks/` with sequential numbering. Use this at the start of any new feature to document requirements before implementation.

#### `@generate-tasks`
Breaks down a PRD into actionable task lists with relevant files and sub-tasks suitable for junior developers. It analyzes both the PRD and existing codebase to create structured tasks in two phases: first generating parent tasks for approval, then detailed sub-tasks. Use this after creating a PRD to plan the implementation work.

#### `@process-task-list`
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

## Tips

- Commands work identically in both Claude Code and Codex CLI
- Most commands support planning mode for complex multi-step operations
- Commands preserve existing conventions and prefer minimal changes
- File paths should be workspace-relative for best results
- Commands coordinate virtual specialist teams for comprehensive analysis
