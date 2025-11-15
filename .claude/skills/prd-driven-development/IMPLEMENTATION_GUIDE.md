# Implementation Guide: PRD Lifecycle Management & Status Tracking

**Status:** Partially Complete - Templates created, Phase 5 restored, need to add Phase 2b & Phase 6

**Created:** 2025-01-15

---

## ✅ What's Already Done

### 1. Test Audit Auto-Append Feature (RESTORED)
- ✅ **SKILL.md** - Phase 5 updated with two-phase workflow (lines 800-910)
- ❌ **commands-guide.md** - Needs test audit auto-append section restored
- ❌ **quick-start-tutorial.md** - Needs Step 5b restored
- ❌ **troubleshooting.md** - Needs test audit scenarios restored

### 2. PRD Status Tracking Templates (CREATED)
- ✅ **references/prd-index-template.md** - Template for `prds/_index.md`
- ✅ **references/status-report-template.md** - Template for `STATUS_REPORT.md`

---

## 📋 What Needs To Be Added

### Phase 2b: Extend Existing PRD

**Add to SKILL.md after Phase 2 (around line 400)**

```markdown
### Phase 2b: Extend Existing PRD

**Workflow Phase:** Extend an existing PRD with new requirements

**How to invoke:** "Extend PRD-0001 with OAuth authentication" or "Add social login to PRD-0001"

**Use when:**
- Adding new capabilities to a completed PRD
- Enhancing existing features without breaking changes
- Versioning up an existing feature (v1.0 → v2.0)

**Smart Detection:**

The workflow automatically determines if your request is:
- ✅ **Extension** (backward compatible) → Updates existing PRD, appends tasks
- ❌ **Breaking change** (incompatible) → Suggests creating new PRD instead

**Extension Criteria (automatic approval):**
- Adds new FRs/NFRs with incremented IDs (FR-6, FR-7, etc.)
- Doesn't modify existing FR acceptance criteria
- Backward compatible architecture changes
- Can be implemented without rewriting existing code

**Breaking Change Criteria (suggests new PRD):**
- Modifies existing FR definitions
- Requires existing code rewrites
- Incompatible architecture changes
- Changes existing API contracts

**Process:**

1. **Read existing PRD file**
   - Load `prds/0001-prd-feature.md`
   - Parse current version, FRs, NFRs
   - Check completion status in `prds/_index.md`

2. **Analyze extension requirements**
   - Ask clarifying questions about new capabilities
   - Detect if extension or breaking change
   - If breaking change → prompt: "This looks like a breaking change. Create new PRD instead? (yes/no)"

3. **Update PRD file** (if extension approved)
   - Increment version (1.0 → 2.0)
   - Add new FRs/NFRs with next sequential IDs
   - Update architecture/design sections
   - Add to "Version History" section
   - Update "Last Updated" timestamp

4. **Generate incremental tasks**
   - Append new parent tasks to existing task file
   - Generate sub-tasks for new FRs/NFRs
   - Preserve all existing tasks (don't modify completed ones)
   - Update task numbering (if task 3.0 was last, new tasks start at 4.0)

5. **Update status tracking**
   - Update `prds/_index.md`:
     - Change status from "✅ Complete" → "🔄 In Progress"
     - Increment version number
     - Add version history entry
     - Recalculate completion % based on new tasks
   - Update `tasks/_index.md` if cross-PRD dependencies changed

**Example:**

**Before (PRD-0001 v1.0 - Complete):**
```markdown
## Metadata
- **PRD ID:** PRD-0001
- **Version:** 1.0
- **Status:** ✅ Complete
- **Last Updated:** 2025-01-10

## Functional Requirements
### PRD-0001-FR-1: Accept registration request
### PRD-0001-FR-2: Validate email/password
### PRD-0001-FR-3: Check duplicate email
### PRD-0001-FR-4: Create user record
### PRD-0001-FR-5: Return success response
```

**After Extension (PRD-0001 v2.0 - In Progress):**
```markdown
## Metadata
- **PRD ID:** PRD-0001
- **Version:** 2.0
- **Status:** 🔄 In Progress (60% - 3/5 new tasks complete)
- **Last Updated:** 2025-01-15

## Version History
### v2.0 (2025-01-15) - OAuth Authentication Extension
- Added FR-6: OAuth login flow
- Added FR-7: Social provider integration (Google, GitHub)
- Status: 🔄 In Progress (60%)

### v1.0 (2025-01-10) - Email/Password Registration
- Initial implementation
- Status: ✅ Complete (deployed to production)

## Functional Requirements
### PRD-0001-FR-1: Accept registration request ✅
### PRD-0001-FR-2: Validate email/password ✅
### PRD-0001-FR-3: Check duplicate email ✅
### PRD-0001-FR-4: Create user record ✅
### PRD-0001-FR-5: Return success response ✅
### PRD-0001-FR-6: OAuth login flow (NEW v2.0)
### PRD-0001-FR-7: Social provider integration (NEW v2.0)
```

**Task File Update:**
```markdown
### 1.0 [✅] Input Validation (v1.0)
### 2.0 [✅] Database Operations (v1.0)
### 3.0 [✅] API Endpoints (v1.0)

### 4.0 [ ] OAuth Integration (v2.0 - NEW)
  - [ ] 4.1 Write unit tests for OAuth flow (PRD-0001-FR-6)
  - [ ] 4.2 Write integration tests for OAuth providers (PRD-0001-FR-6)
  - [ ] 4.3 Implement OAuth callback handler
  - [ ] 4.4 Run tests and verify

### 5.0 [ ] Social Provider Setup (v2.0 - NEW)
  - [ ] 5.1 Configure Google OAuth (PRD-0001-FR-7)
  - [ ] 5.2 Configure GitHub OAuth (PRD-0001-FR-7)
  - [ ] 5.3 Add provider selection UI
```

**Status Index Update:**
```markdown
| PRD ID | Title | Version | Status | Completion | Tasks | Last Updated | Notes |
|--------|-------|---------|--------|------------|-------|--------------|-------|
| PRD-0001 | User Registration | 2.0 | 🔄 In Progress | 60% (3/5) | 5 | 2025-01-15 | v1.0 complete ✅, v2.0 OAuth in progress |
```

**Deliverable:**
- Updated PRD file with version 2.0
- Appended tasks in existing task file
- Updated `prds/_index.md` with new version and status
- Ready to execute new tasks with Phase 4

**Next Step:** Use Phase 4 to process the extended task list

---
```

### Phase 6: Status Report

**Add to SKILL.md after Phase 5 (around line 920)**

```markdown
### Phase 6: Generate Status Report

**Workflow Phase:** Generate comprehensive PRD status report

**How to invoke:**
- "Generate status report" - Full report (all PRDs)
- "Show PRD status" - Full report
- "Status report for in-progress PRDs" - Filtered view
- "Status report for PRD-0001" - Single PRD detail

**Purpose:** Provides at-a-glance visibility into all PRD completion states, progress tracking, and project health.

**Process:**

1. **Read `prds/_index.md`**
   - Parse all PRD entries
   - Extract status, completion %, version history
   - Calculate summary statistics

2. **Generate report sections:**
   - Executive summary (total PRDs, completion stats, velocity)
   - In-progress PRDs (sorted by % completion, with ETA)
   - Recently completed PRDs (last 30 days)
   - Draft PRDs (not started)
   - Blocked PRDs (with blocker details)
   - Superseded PRDs (archived)
   - Dependency chain visualization
   - Quality metrics (test coverage, quality gates)
   - Recommendations (immediate, short-term, long-term)

3. **Apply filters (if specified):**
   - `in-progress` - Show only 🔄 In Progress PRDs
   - `blocked` - Show only 🚫 Blocked PRDs
   - `PRD-0001` - Show detailed status for single PRD
   - `summary` - Executive summary only

4. **Write `STATUS_REPORT.md`**

**Report Sections:**

**1. Executive Summary**
```markdown
## Executive Summary

**Project Health:** On Track | At Risk | Blocked

### Overall Progress
- **Total PRDs:** 5
- **✅ Complete:** 3 (60%)
- **🔄 In Progress:** 1 (20%)
- **📋 Draft:** 1 (20%)
- **🚫 Blocked:** 0 (0%)

### Velocity
- **Completed this week:** 2 PRDs
- **Average time to complete:** 5 days
```

**2. In Progress PRDs** (Most important section)
```markdown
## 🔄 In Progress PRDs

### PRD-0001: User Registration (v2.0)
- **Status:** 🔄 In Progress
- **Completion:** 60% (3/5 tasks complete)
- **Started:** 2025-01-15
- **Est. Completion:** 2025-01-18 (based on current velocity)

**Current Work:**
- [✅] 1.0 Input Validation
- [✅] 2.0 Database Operations
- [✅] 3.0 API Endpoints
- [ ] 4.0 OAuth Integration (IN PROGRESS)
- [ ] 5.0 Security Hardening

**Version History:**
- v2.0 (current): OAuth authentication extension
- v1.0 (complete): Email/password registration

**Next Steps:**
1. Complete OAuth integration (task 4.0)
2. Run security hardening (task 5.0)
3. Run test audit to validate coverage
4. Deploy to staging
```

**3. Recently Completed PRDs**
```markdown
## ✅ Recently Completed (Last 30 Days)

### PRD-0002: Payment Processing (v1.0)
- **Completed:** 2025-01-10
- **Duration:** 7 days
- **Test Coverage:** 95%
```

**4. Dependency Chain**
```markdown
## Dependency Chain

PRD-0001 (In Progress) 🔄
  └─> PRD-0005 (Blocked - waiting on 0001)

PRD-0002 (Complete) ✅
PRD-0003 (Complete) ✅
PRD-0004 (Draft) 📋
```

**Command Variations:**

**Full Report:**
```
"Generate status report"
```
Generates complete STATUS_REPORT.md with all sections.

**In-Progress Only:**
```
"Status report for in-progress PRDs"
```
Shows only 🔄 In Progress section (useful for daily standup).

**Single PRD Detail:**
```
"Status report for PRD-0001"
```
Detailed breakdown of single PRD with all tasks, version history, metrics.

**Summary Only:**
```
"Status report summary"
```
Executive summary section only (quick health check).

**Deliverable:** `STATUS_REPORT.md` with requested scope

**When to Use:**
- Daily standups (in-progress view)
- Weekly planning (full report)
- Stakeholder updates (summary + in-progress)
- Before sprint planning (identify blocked PRDs)
- After completing PRDs (velocity tracking)

**Integration with Status Index:**

Status report reads from `prds/_index.md` (auto-maintained by workflow):
- Phase 2 (@create-prd) → Adds entry
- Phase 2b (@extend-prd) → Updates version
- Phase 3 (@generate-tasks) → Sets in-progress
- Phase 4 (@process-task-list) → Updates completion %
- Phase 5 (@test-audit) → Validates completion
- Phase 6 (@status-report) → Reads and formats

**Next Step:** Use insights from report to prioritize work, unblock dependencies, or generate new PRDs
```

---

## 🔧 Files That Need Updates

### 1. SKILL.md

**Current state:** Phase 5 (test audit) restored with auto-append

**Add:**
- Phase 2b (after line ~400): Extend Existing PRD section (content above)
- Phase 6 (after line ~920): Status Report section (content above)
- Update "Core Workflow" intro to mention 7 phases:
  ```
  1. Import PRDs (optional)
  2. Create PRD
  2b. Extend Existing PRD (NEW)
  3. Generate Tasks
  4. Process Tasks
  5. Test Audit (optional)
  6. Status Report (NEW - optional)
  ```
- Update "Quick Reference" section (line ~710) to include new phases

### 2. commands-guide.md

**Current state:** Missing test audit auto-append section (was lost in git checkout)

**Restore:**
- @test-audit section with auto-append (lines ~500-780)
  - Two-phase workflow
  - Update modes
  - Auto-append workflow steps
  - Examples

**Add new:**
- @extend-prd section (new)
- @status-report section (new)
- Decision Tree 6: When to Extend vs Create New PRD

**Content for new sections:**

**@extend-prd:**
```markdown
## @extend-prd

**Purpose:** Extend an existing PRD with new requirements (version increment)

**Usage:**
```bash
@extend-prd PRD-0001 [EXTENSION_DESCRIPTION]
```

**Examples:**
```bash
# Extend with OAuth
"Extend PRD-0001 with OAuth authentication (Google, GitHub)"

# Extend with new payment methods
"Extend PRD-0002 with Apple Pay and Google Pay support"
```

**Smart Detection:**
- Extension (✅): Backward compatible → Updates PRD, appends tasks
- Breaking change (❌): Incompatible → Suggests new PRD

**Process:**
1. Read existing PRD
2. Analyze extension requirements
3. Detect extension vs breaking change
4. Update PRD file (increment version, add FRs/NFRs)
5. Append tasks to existing task file
6. Update prds/_index.md (change status to In Progress)

**Deliverable:**
- Updated PRD file (v2.0)
- Appended tasks in task file
- Updated status index

**When NOT to use:**
- Breaking changes (modify existing FRs)
- Complete rewrites
- Architectural incompatibilities
→ Use @create-prd for new PRD instead
```

**@status-report:**
```markdown
## @status-report

**Purpose:** Generate comprehensive PRD status report

**Usage:**
```bash
@status-report [[all|in-progress|blocked|summary|PRD-####]]
```

**Examples:**
```bash
# Full report
@status-report

# In-progress only (daily standup)
@status-report in-progress

# Single PRD detail
@status-report PRD-0001

# Executive summary
@status-report summary
```

**Report Sections:**
- Executive Summary (project health, velocity)
- In Progress PRDs (sorted by %)
- Recently Completed (last 30 days)
- Draft PRDs
- Blocked PRDs (with blocker details)
- Dependency Chain
- Quality Metrics
- Recommendations

**Source:** Reads from `prds/_index.md` (auto-maintained)

**Deliverable:** `STATUS_REPORT.md`

**When to Use:**
- Daily standups
- Weekly planning
- Stakeholder updates
- Before sprint planning
```

### 3. quick-start-tutorial.md

**Current state:** Missing Step 5b (test audit auto-append example)

**Restore:**
- Step 5b: Test Audit with Auto-Append (alternative scenario)

**Add new:**
- Step 6: Extend Existing PRD (OAuth example)
- Step 7: Generate Status Report

### 4. troubleshooting.md

**Current state:** Missing test audit auto-append troubleshooting

**Restore:**
- Test audit auto-append scenarios (5 scenarios)

**Add new:**
- "Extended PRD not showing as In Progress"
- "Extension created new PRD instead of updating"
- "Status report shows wrong completion %"
- "How to mark PRD as superseded"

---

## 🎯 Completion Checklist

Use this checklist in next session:

### Test Audit Auto-Append (RESTORE)
- [ ] Restore auto-append section in commands-guide.md (~280 lines)
- [ ] Restore Step 5b in quick-start-tutorial.md (~150 lines)
- [ ] Restore 5 troubleshooting scenarios in troubleshooting.md (~170 lines)

### PRD Lifecycle Management (NEW)
- [ ] Add Phase 2b to SKILL.md (~150 lines)
- [ ] Add Phase 6 to SKILL.md (~120 lines)
- [ ] Add @extend-prd to commands-guide.md (~100 lines)
- [ ] Add @status-report to commands-guide.md (~150 lines)
- [ ] Add Decision Tree 6 to commands-guide.md (~50 lines)
- [ ] Add Step 6 (extend) to quick-start-tutorial.md (~100 lines)
- [ ] Add Step 7 (status) to quick-start-tutorial.md (~80 lines)
- [ ] Add 4 troubleshooting scenarios (~100 lines)

**Total estimated additions:** ~1,400 lines across 4 files

---

## 📝 Notes for Next Session

1. **Context:** This guide contains all the content needed to complete implementation
2. **Priority:** Restore test audit sections FIRST (users expect this from previous work)
3. **Then:** Add PRD lifecycle features (Phase 2b, Phase 6)
4. **Templates:** Already created in `references/` directory
5. **Verification:** Check that all `@` references work as natural language triggers

---

**End of Implementation Guide**
