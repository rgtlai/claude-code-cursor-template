# PRD-Driven Development Workflow - Visual Guide

## Complete Workflow Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Prerequisites                                 │
│  • CLAUDE.md architecture baseline at repo root                     │
│  • Global NFR budgets defined (performance, security, etc.)         │
│  • Test environment standards configured                             │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Phase 1: Import Feature Bundle (Optional)                          │
│  Command: @import-prds <PATH_TO_FEATURES_FILE>                      │
│                                                                       │
│  Input:  Single spec file with multiple features                    │
│  Output: /prd-bundle/index.md + draft PRD skeletons                 │
│          • Dependency graph                                          │
│          • Conflict detection                                        │
│          • T-shirt sizing (S/M/L/XL)                                 │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Phase 2: Create Comprehensive PRD                                  │
│  Command: @create-prd <DESC|PATH> [--prd-complexity simple|std|cpx] │
│                                                                       │
│  Process:                                                            │
│  1. Validate CLAUDE.md baseline                                      │
│  2. Analyze feature description                                      │
│  3. Ask tiered clarifying questions                                  │
│     • Critical blockers (must answer)                                │
│     • Important (affect scope)                                       │
│     • Nice-to-haves (can defer)                                      │
│  4. Generate PRD with scoped IDs                                     │
│     • PRD-####-FR-n  (Functional Requirements)                       │
│     • PRD-####-NFR-n (Non-Functional Requirements)                   │
│                                                                       │
│  Output: /prds/[nnnn]-prd-[feature-name].md                         │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Phase 3: Generate Task List (Two-Phase)                            │
│  Command: @generate-tasks <PATH_TO_PRD_FILE>                        │
│                                                                       │
│  Phase 3.1 - Parent Tasks:                                          │
│  • Analyze PRD + codebase                                            │
│  • Extract FR/NFR IDs                                                │
│  • Derive dependencies                                               │
│  • Generate 4-6 parent tasks (topologically ordered)                 │
│  • Present to user → WAIT FOR "Go"                                   │
│                                                                       │
│  Phase 3.2 - Sub-Tasks (Test-First):                                │
│  • Break down each parent:                                           │
│    ├─ Write tests for FR-n                                           │
│    ├─ Implement functionality                                        │
│    ├─ For DB: Add verification sub-tasks                             │
│    ├─ Run targeted tests                                             │
│    └─ Skip blocked tests (BLOCKED_BY_TASK x.y)                       │
│  • Include PRD tokens in test names                                  │
│  • Update tasks/_index.md                                            │
│                                                                       │
│  Output: tasks/tasks-[prd-name].md + tasks/_index.md                │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Phase 4: Execute Task List                                         │
│  Command: @process-task-list <PATH_TO_TASK_LIST_FILE>               │
│                                                                       │
│  Sub-Task Level:                                                     │
│  1. Check prerequisites                                              │
│  2. Work on ONE sub-task                                             │
│  3. Test-first approach                                              │
│  4. Run targeted tests                                               │
│  5. Skip if blocked → Add to Deferred/Skipped                        │
│  6. Mark complete [x]                                                │
│  7. WAIT for user approval                                           │
│                                                                       │
│  Parent Task Completion:                                             │
│  When all sub-tasks [x]:                                             │
│  ┌───────────────────────────────────────┐                          │
│  │ 1. Run full test suite                │                          │
│  │ 2. Quality Gates:                     │                          │
│  │    • Lint, type-check, format         │                          │
│  │    • Security/static analysis         │                          │
│  │    • Coverage threshold               │                          │
│  │    • DB Migration Verification ───────┼──► Execute migrations   │
│  │      (REQUIRED for DB changes)        │    Verify schema         │
│  │                                       │    Test seed/population  │
│  │                                       │    Test rollback         │
│  │                                       │    Test re-apply         │
│  │                                       │    Integration tests     │
│  │    • E2E/smoke tests                  │                          │
│  │    • Feature flags                    │                          │
│  │    • Operational readiness            │                          │
│  │ 3. If gates pass → Stage changes      │                          │
│  │ 4. Clean up temp files                │                          │
│  │ 5. Commit with PRD tokens             │                          │
│  │ 6. Mark parent complete [x]           │                          │
│  │ 7. Update tasks/_index.md             │                          │
│  └───────────────────────────────────────┘                          │
└─────────────────────────────────────────────────────────────────────┘
```

## Database Verification Mindset Shift

```
╔═══════════════════════════════════════════════════════════════════╗
║  CRITICAL: Database Changes Are NOT Complete Until Verified       ║
╚═══════════════════════════════════════════════════════════════════╝

OLD Mindset:
┌────────────────────────────┐
│ Migration files created ✓  │ → Task complete ✗
└────────────────────────────┘

NEW Mindset:
┌────────────────────────────┐
│ Migration files created ✓  │
│ Executed against real DB ✓ │
│ Schema verified ✓          │
│ Seed script tested ✓       │
│ Rollback tested ✓          │
│ Re-apply tested ✓          │
│ Integration tests pass ✓   │ → Task complete ✓
└────────────────────────────┘
```

## Traceability Flow

```
                    PRD
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
    PRD-0007-FR-1  FR-2      FR-3
         │           │           │
         ▼           ▼           ▼
    Parent Task 1.0  2.0       3.0
         │           │           │
    ┌────┼────┐      │           │
    ▼    ▼    ▼      ▼           ▼
   1.1  1.2  1.3    2.1         3.1
    │    │    │      │           │
    ▼    ▼    ▼      ▼           ▼
  Tests Tests Tests Tests      Tests
    │    │    │      │           │
    └────┴────┴──────┴───────────┘
               │
               ▼
          Commits with PRD tokens
               │
               ▼
        Traceability Matrix
   (FR/NFR → Tasks → Tests → Code)
```

## Dependency Management

```
┌─────────────────────────────────────────────────────────────┐
│                    tasks/_index.md                          │
│              (Global Dependency Tracker)                    │
│                                                             │
│  ┌─────────────────────────────────────────────┐           │
│  │  Consolidated Blocked/Prerequisites Table   │           │
│  ├─────────────────────────────────────────────┤           │
│  │ PRD-0001 Task 1.0 │ —        │ Y │ Ready   │           │
│  │ PRD-0001 Task 2.0 │ 1.0      │ N │ Blocked │           │
│  │ PRD-0007 Task 1.0 │ —        │ Y │ Ready   │           │
│  │ PRD-0007 Task 2.0 │ 0001:2.0 │ N │ X-PRD   │           │
│  └─────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ PRD-0001    │     │ PRD-0007    │     │ PRD-0003    │
│ tasks file  │     │ tasks file  │     │ tasks file  │
│             │     │             │     │             │
│ Local       │     │ Local       │     │ Local       │
│ Blocked/    │     │ Blocked/    │     │ Blocked/    │
│ Prereqs     │     │ Prereqs     │     │ Prereqs     │
│ Table       │     │ Table       │     │ Table       │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Skip Hygiene Pattern

```
┌──────────────────────────────────────────────────────────────┐
│  When Test Depends on Future Task                           │
└──────────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
      Skip Test    Add to Section   Include Info
           │               │               │
           ▼               ▼               ▼
  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐
  │ Framework:  │  │ Deferred/   │  │ • Task ref   │
  │ Pytest:     │  │ Skipped     │  │   BLOCKED_BY │
  │ @skip(...)  │  │ Tests       │  │   _TASK x.y  │
  │             │  │ section in  │  │ • FR/NFR IDs │
  │ Jest:       │  │ tasks file  │  │   PRD-####-  │
  │ test.skip() │  │             │  │   FR-n       │
  │             │  │             │  │ • Reason     │
  │ RSpec:      │  │             │  │              │
  │ pending     │  │             │  │              │
  └─────────────┘  └─────────────┘  └──────────────┘
```

## Quality Gates Flow

```
Parent Task Complete → Quality Gates → Commit
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   ┌────────┐         ┌────────┐         ┌────────┐
   │  Code  │         │  Tests │         │   DB   │
   │ Quality│         │        │         │ Verify │
   └────────┘         └────────┘         └────────┘
        │                   │                   │
   ┌────┴────┐         ┌────┴────┐         ┌────┴────┐
   │ Lint    │         │ Full    │         │ Execute │
   │ Type    │         │ Suite   │         │ Verify  │
   │ Format  │         │ Coverage│         │ Seed    │
   │ Security│         │ E2E     │         │ Rollback│
   └─────────┘         └─────────┘         └─────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
                    All Gates Pass?
                      │         │
                  Yes │         │ No
                      ▼         ▼
                   Commit    Fix Issues
```

## Batch Execution Options

```
Standard Mode:
@process-task-list tasks/tasks-0001.md
    │
    ├─► Sub-task 1.1 → Prompt → User confirms
    ├─► Sub-task 1.2 → Prompt → User confirms
    └─► Parent 1.0 complete → Prompt → User confirms

Batch Mode:
@process-task-list tasks/tasks-0001.md --batch parent=1.0
    │
    ├─► Sub-task 1.1 → (no prompt)
    ├─► Sub-task 1.2 → (no prompt)
    └─► Parent 1.0 complete → Prompt → User confirms

Auto-Approve Mode:
@process-task-list tasks/tasks-0001.md --batch parent=1.0 --yes
    │
    ├─► Sub-task 1.1 → (no prompt)
    ├─► Sub-task 1.2 → (no prompt)
    └─► Parent 1.0 complete → (no prompt)

Note: All modes enforce quality gates and tests!
```

## Typical Timeline

```
Day 1-2:  Setup
          ├─ Copy CLAUDE.md template
          ├─ Fill architecture baseline
          └─ Define global standards

Day 2-3:  Requirements
          ├─ @import-prds (if bundle)
          └─ @create-prd for each feature

Day 3-4:  Planning
          ├─ @generate-tasks for each PRD
          └─ Review tasks/_index.md for dependencies

Day 4-N:  Execution
          ├─ @process-task-list on unblocked items
          ├─ Quality gates at each parent completion
          ├─ Update global index as tasks complete
          └─ Iterate until all PRDs implemented

Ongoing:  Maintenance
          ├─ Update PRDs as requirements change
          ├─ Regenerate delta tasks
          └─ Keep traceability current
```

## Key Success Factors

```
✓ CLAUDE.md baseline complete before starting
✓ PRD tokens in ALL tests and commits
✓ Database verification never skipped
✓ Quality gates enforced at parent boundaries
✓ Dependencies tracked in global index
✓ Test-first approach maintained
✓ Skipped tests properly documented
✓ Integration tests against real DB
✓ Feature flags configured
✓ Operational readiness verified
```
