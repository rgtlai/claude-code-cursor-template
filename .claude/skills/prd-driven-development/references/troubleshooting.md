# Troubleshooting Guide - PRD-Driven Development

This guide provides solutions to common issues encountered during the PRD-driven development workflow.

---

## Table of Contents

1. [Setup & Prerequisites Issues](#setup--prerequisites-issues)
2. [PRD Creation Issues](#prd-creation-issues)
3. [Task Generation Issues](#task-generation-issues)
4. [Task Execution Issues](#task-execution-issues)
5. [Test Failures](#test-failures)
6. [Database & Migration Issues](#database--migration-issues)
7. [Dependency & Blocker Issues](#dependency--blocker-issues)
8. [Quality Gate Failures](#quality-gate-failures)
9. [Test Audit Issues](#test-audit-issues)

---

## Setup & Prerequisites Issues

### Issue: "CLAUDE.md file not found"

**Symptom:** Workflow commands fail with "CLAUDE.md is required"

**Cause:** Missing architecture baseline file

**Solution:**

```
skill: prd-driven-development
"Create CLAUDE.md from template and help me fill required sections"
```

Follow the prompts to fill minimum sections. Alternatively, manually copy `CLAUDE.md.template` to `CLAUDE.md` and fill:
- Tech Stack
- Testing Strategy
- Data Stores (if applicable)

---

### Issue: "CLAUDE.md has template placeholders"

**Symptom:** Claude says "CLAUDE.md Testing Strategy has template text like `[Tool name]`"

**Cause:** Template not filled out

**Solution:**

Replace placeholders with actual values:

```markdown
## 6. Testing Strategy
- Unit: Jest (REQUIRED for all business logic)
- Integration: Supertest + Testcontainers (REQUIRED for all API endpoints)
- E2E: Playwright (REQUIRED for critical user flows)
- Coverage targets: >=85% lines
```

**Quick Fix:**

When Claude detects template text, it will prompt:
```
"Apply defaults (unit + integration + E2E auto-detect)? (yes/customize)"
```

Choose "yes" to proceed with defaults, then update CLAUDE.md later.

---

### Issue: "Skill doesn't recognize workflow phases"

**Symptom:** Saying "import PRDs from X" doesn't trigger workflow

**Cause:** Skill not invoked first

**Solution:**

Always invoke the skill before using workflow phases:

```
skill: prd-driven-development
```

Then use natural language:
```
"Import PRDs from specs/features.md"
"Create a PRD for user authentication"
```

---

## PRD Creation Issues

### Issue: "Claude asks too many questions"

**Symptom:** PRD creation process feels slow with many clarifying questions

**Cause:** PRD complexity level set to `complex`, or feature description is vague

**Solution:**

**Option 1:** Use simpler complexity level

```
"Create a PRD for [feature] with simple complexity"
```

**Option 2:** Provide detailed initial description

Instead of: "Add user login"

Use: "Add user login endpoint: POST /api/login accepts email and password, returns JWT token, rejects invalid credentials with 401, supports rate limiting (5 attempts per 15 min)"

**Option 3:** Defer nice-to-have questions

Claude groups questions by priority:
- Critical blockers (must answer)
- Important (affects scope)
- Nice-to-haves (can defer)

You can say: "Skip nice-to-have questions for now"

---

### Issue: "PRD has unclear acceptance criteria"

**Symptom:** Generated PRD acceptance criteria are vague (e.g., "System validates input")

**Cause:** Insufficient detail in feature description

**Solution:**

Request more specific criteria:

```
"Regenerate PRD-0001-FR-2 acceptance criteria with specific validation rules:
- Email must be RFC 5322 compliant
- Password minimum 8 characters
- Password must contain number and special character"
```

Or manually edit the PRD file and add specifics.

---

## Task Generation Issues

### Issue: "Parent tasks don't match my expectations"

**Symptom:** Phase 3.1 generates tasks that seem wrong or incomplete

**Cause:** PRD ambiguity or Claude misinterpreted scope

**Solution:**

**Don't say "Go" yet.** Instead:

```
"Task 2.0 should be split into two tasks: one for the API endpoint, one for the business logic. Regenerate."
```

Or:

```
"Add a task for setting up authentication middleware before task 3.0"
```

Claude will regenerate parent tasks. **Only say "Go" when satisfied.**

---

### Issue: "Too many sub-tasks generated"

**Symptom:** Phase 3.2 creates 30+ sub-tasks for a simple feature

**Cause:** PRD complexity too high, or CLAUDE.md requires all test types

**Solution:**

**Option 1:** Use simpler PRD complexity

Regenerate PRD with `--prd-complexity simple`

**Option 2:** Adjust CLAUDE.md Testing Strategy

If feature doesn't need E2E:

```markdown
## 6. Testing Strategy
- Unit: Jest (REQUIRED)
- Integration: Supertest (REQUIRED)
- E2E: None (backend API only, no UI)
```

**Option 3:** Batch related sub-tasks

Ask Claude to combine related sub-tasks:

```
"Combine sub-tasks 2.1, 2.2, 2.3 (all unit tests) into a single sub-task: 'Write all unit tests for FR-2'"
```

---

### Issue: "Sub-tasks missing test types I need"

**Symptom:** No E2E test sub-tasks generated, but you want them

**Cause:** CLAUDE.md excludes E2E, or feature not detected as frontend-backend

**Solution:**

**Check CLAUDE.md:**

If it says `E2E: None`, update it:

```markdown
- E2E: Playwright (REQUIRED for user-facing flows)
```

Then regenerate tasks.

**Or explicitly request:**

```
"Add E2E test sub-tasks for PRD-0001-FR-1 (user login flow)"
```

---

### Issue: "tasks/_index.md not created"

**Symptom:** Global dependency tracker doesn't exist

**Cause:** First PRD in project

**Solution:**

Claude creates `tasks/_index.md` automatically during Phase 3. If missing:

```
"Create tasks/_index.md for global dependency tracking"
```

Or manually create with template from `references/blocked-prereqs-table.md`

---

## Task Execution Issues

### Issue: "Claude stops after each sub-task"

**Symptom:** Workflow keeps asking "Continue to next sub-task?"

**Cause:** Default behavior is to wait for approval

**Solution:**

**Option 1:** Auto-approve mode (not yet implemented, but you can request)

```
"Process all sub-tasks under parent 1.0 without stopping"
```

**Option 2:** Quick approval

Just reply "yes" or "continue" each time.

**Option 3:** Batch execution

```
"Process parent task 1.0 entirely, then stop for review"
```

---

### Issue: "Sub-task marked complete but tests didn't pass"

**Symptom:** Claude marks `[x]` even though tests are failing

**Cause:** Bug or tests are properly marked as `BLOCKED_BY_TASK`

**Solution:**

**Check sub-task notes:**

If tests are skipped with `BLOCKED_BY_TASK x.y`, the sub-task should still be marked complete (tests deferred, not failed).

**If tests genuinely failed and sub-task wrongly marked complete:**

```
"Sub-task 2.4 should NOT be complete - integration tests are failing. Unmark and fix tests first."
```

---

### Issue: "Can't find file Claude created"

**Symptom:** Claude says "created src/services/auth.js" but file doesn't exist

**Cause:** Path mismatch or file written to wrong location

**Solution:**

**Check current working directory:**

```bash
pwd
ls -la src/services/
```

**Ask Claude to verify:**

```
"Show me the absolute path where you created auth.js"
```

**Or explicitly specify path:**

```
"Create auth.js at /Users/me/project/src/services/auth.js"
```

---

## Test Failures

### Issue: "Unit tests fail with module not found"

**Symptom:** `Error: Cannot find module '../src/services/auth'`

**Cause:** File not created yet, or path incorrect

**Solution:**

**Ensure implementation exists:**

Tests are written first (TDD), so failures are expected until implementation is complete.

**Check import paths:**

```javascript
// If using ES modules:
import { auth } from '../src/services/auth.js'; // .js extension required

// If using CommonJS:
const { auth } = require('../src/services/auth'); // no extension
```

**Run in correct order:**

1. Write tests (may fail)
2. Implement functionality
3. Run tests again (should pass)

---

### Issue: "Integration tests fail with database connection error"

**Symptom:** `Error: Connection refused - localhost:5432`

**Cause:** Test database not running

**Solution:**

**Start test database:**

```bash
# If using Testcontainers:
# No manual start needed - Testcontainers auto-starts

# If using docker-compose:
docker-compose up -d test-db

# If using local PostgreSQL:
pg_ctl start
```

**Check CLAUDE.md:**

Ensure test environment setup is documented:

```markdown
## 6. Testing Strategy
- Test environments: Testcontainers (auto-start), or run `docker-compose up -d test-db` before tests
- Quick start: `docker-compose up -d test-db && npm test`
```

**Add setup instructions to test file:**

```javascript
beforeAll(async () => {
  // Start Testcontainers
  container = await new PostgreSqlContainer().start();
  process.env.DATABASE_URL = container.getConnectionUri();
});

afterAll(async () => {
  await container.stop();
});
```

---

### Issue: "E2E tests fail with browser timeout"

**Symptom:** `Error: Timeout waiting for browser to start`

**Cause:** Playwright browsers not installed

**Solution:**

**Install browsers:**

```bash
npx playwright install
```

**Or use specific browser:**

```bash
npx playwright install chromium
```

**Check system resources:**

E2E tests are resource-intensive. Ensure:
- Sufficient RAM (4GB+ recommended)
- No other browsers running
- Dev server is running (for UI tests)

**Increase timeout:**

```javascript
test('login flow', async ({ page }) => {
  await page.goto('http://localhost:3000', { timeout: 60000 }); // 60s timeout
});
```

---

### Issue: "Tests pass locally but fail in CI"

**Symptom:** `npm test` succeeds locally, fails in GitHub Actions

**Cause:** Environment differences (Node version, database, dependencies)

**Solution:**

**Match CI environment locally:**

```yaml
# Check .github/workflows/test.yml
- uses: actions/setup-node@v4
  with:
    node-version: 20  # Ensure local matches this
```

**Run tests in CI mode:**

```bash
CI=true npm test
```

**Check for flaky tests:**

Run tests multiple times:

```bash
for i in {1..10}; do npm test || break; done
```

If failures are inconsistent, tests may have race conditions or rely on timing.

---

## Database & Migration Issues

### Issue: "Prisma migration fails with 'table already exists'"

**Symptom:** `Error: relation "User" already exists`

**Cause:** Database not clean, or migration already applied

**Solution:**

**Reset database:**

```bash
npx prisma migrate reset --force
npx prisma migrate deploy
```

**Or drop table manually:**

```sql
DROP TABLE "User" CASCADE;
```

Then rerun migration.

---

### Issue: "Database verification sub-tasks unclear"

**Symptom:** "What does 'VERIFY: Inspect schema' mean?"

**Cause:** Verification steps are abstract

**Solution:**

**Concrete verification steps:**

1. **1.3 Execute migrations:**
   ```bash
   npx prisma migrate deploy
   # OR: alembic upgrade head
   # OR: bundle exec rails db:migrate
   ```

2. **1.4 Inspect schema:**
   ```bash
   npx prisma db pull  # Validates schema matches expectations
   # OR: psql -d mydb -c "\d users"  # Shows table structure
   ```

3. **1.5 Test seed:**
   ```bash
   npx prisma db seed
   # OR: node scripts/seed.js
   ```

4. **1.6 Test rollback:**
   ```bash
   npx prisma migrate reset --force
   npx prisma migrate deploy
   ```

5. **1.7 Run integration tests:**
   ```bash
   npm test -- tests/integration/database.int.test.js
   ```

---

### Issue: "No migration tool specified in CLAUDE.md"

**Symptom:** PRD requires DB changes but CLAUDE.md doesn't list migration tool

**Cause:** First time doing DB migrations in this project

**Solution:**

**Claude will prompt:**

```
"This PRD requires database schema changes, but CLAUDE.md doesn't specify a migration tool.
Recommended for [detected stack]:
- Node.js: Prisma, Sequelize, Knex
- Python: Alembic, Django migrations

Should I:
A) Set up Prisma and add to CLAUDE.md
B) Create a separate parent task for migration infrastructure setup
C) Use raw SQL scripts for now"
```

Choose option A or B. If you choose B, infrastructure setup becomes task 0.0, blocking current tasks.

---

## Dependency & Blocker Issues

### Issue: "Task blocked but I don't know why"

**Symptom:** Task 2.0 shows `BLOCKED_BY_TASK 1.0` but task 1.0 is marked complete

**Cause:** Missing readiness proof

**Solution:**

**Check `tasks/_index.md`:**

Look for task 1.0 status:

```markdown
| 0001-1.0 | 0001 | Auth API | ✅ ready | - | ❌ Missing proof | 🔴 waiting | 2025-01-15 |
```

**Status shows `ready` but proof missing.**

**Provide readiness proof:**

```
"For task 1.0 (Auth API), readiness proof is:
- API contract: contracts/auth-v1.yaml
- Tests passing: link to CI run #123
- Deployed to staging: https://auth-staging.example.com/health"
```

Claude updates `tasks/_index.md` and unblocks task 2.0.

---

### Issue: "Dependency changed, now my code breaks"

**Symptom:** Task 2.0 was working, then task 1.0 was updated and now 2.0 fails

**Cause:** Dependency health degraded (contract changed)

**Solution:**

**Check `tasks/_index.md`:**

```markdown
| 0001-1.0 | 0001 | Auth API | ⚠️ at-risk | - | [contract](link) | 🟡 contract changed | 2025-01-16 |
```

**Health shows `🟡 contract changed`.**

**Sync with new contract:**

```bash
# Update contract file
curl https://auth-staging.example.com/openapi.yaml > contracts/auth-v1.1.yaml

# Regenerate client code
npm run generate:api-client

# Fix breaking changes in task 2.0 code
# Rerun tests
npm test
```

**Update tasks/_index.md:**

```
"Update task 0001-1.0 health to 🟢 healthy (contract synced)"
```

---

### Issue: "How do I unblock a task marked BLOCKED_BY_TASK?"

**Symptom:** Test skipped with `BLOCKED_BY_TASK 3.2` notation, now task 3.2 is complete

**Cause:** Blocking task resolved, but test still skipped

**Solution:**

1. **Find skipped test:**

Check "Deferred/Skipped Tests" section in task file:

```markdown
## Deferred/Skipped Tests
- `tests/integration/payment.int.test.ts` - BLOCKED_BY_TASK 3.2 (payment API unavailable)
```

2. **Remove skip:**

```javascript
// Before:
test.skip('payment processing', () => {...}); // BLOCKED_BY_TASK 3.2

// After:
test('PRD-0007-FR-5 payment processing', () => {...});
```

3. **Run test:**

```bash
npm test -- tests/integration/payment.int.test.ts
```

4. **Update task file:**

Remove from "Deferred/Skipped Tests" section.

---

## Quality Gate Failures

### Issue: "Lint errors prevent commit"

**Symptom:** `npm run lint` fails with 20 errors

**Cause:** Code doesn't match project style

**Solution:**

**Auto-fix:**

```bash
npm run lint -- --fix
```

**Or with ESLint:**

```bash
npx eslint . --fix
```

**Manual fix:**

Review errors and fix:

```bash
npm run lint
```

Common issues:
- Unused variables: Remove or prefix with `_`
- Missing semicolons: Add them
- Inconsistent quotes: Use double or single consistently

---

### Issue: "TypeScript type errors"

**Symptom:** `tsc --noEmit` fails with type mismatches

**Cause:** Incorrect types or missing type annotations

**Solution:**

**Read error messages:**

```
src/services/auth.ts:42:5 - error TS2322: Type 'string | undefined' is not assignable to type 'string'.
```

**Fix type issues:**

```typescript
// Before:
const email = user.email; // email might be undefined

// After:
const email = user.email!; // Non-null assertion
// OR:
if (!user.email) throw new Error('Email required');
const email = user.email;
```

**Generate types:**

If using external API, generate types from contract:

```bash
npx openapi-typescript contracts/auth-v1.yaml -o src/types/auth.ts
```

---

### Issue: "Coverage below threshold"

**Symptom:** `npm test -- --coverage` shows 78% but CLAUDE.md requires 85%

**Cause:** Missing tests or untested code paths

**Solution:**

**Identify uncovered lines:**

```bash
npm test -- --coverage
# Check coverage/lcov-report/index.html
```

**Add missing tests:**

Focus on:
- Uncovered branches (if/else)
- Error handling paths
- Edge cases

**Or adjust threshold (if justified):**

Update CLAUDE.md:

```markdown
- Coverage targets: >=78% lines (lowered due to generated code)
```

---

## Test Audit Issues

### Issue: "Test audit finds missing tests"

**Symptom:** `TEST_AUDIT.md` shows "PRD-0007-FR-3 has no tests"

**Cause:** FR implemented but tests not written

**Solution:**

**Add missing tests:**

```
"Write tests for PRD-0007-FR-3 (duplicate email check)"
```

**Or mark as deferred:**

If tests can't be written yet (blocked):

```markdown
## Deferred/Skipped Tests
- PRD-0007-FR-3: BLOCKED_BY_TASK 4.2 (database migration pending)
```

---

### Issue: "Test audit says tests have wrong assertions"

**Symptom:** `TEST_AUDIT.md` "Correctness Issues: Test for FR-3 validates wrong behavior"

**Cause:** Test assertions don't match PRD acceptance criteria

**Solution:**

**Review PRD:**

```markdown
### PRD-0007-FR-3: Check Duplicate Email
**Acceptance Criteria:**
- PRD-0007-FR-3.A: Return 409 Conflict if email exists
```

**Check test:**

```javascript
test('duplicate email', async () => {
  // Wrong:
  expect(res.status).toBe(400); // Should be 409!

  // Correct:
  expect(res.status).toBe(409);
});
```

**Fix assertion to match PRD.**

---

### Issue: "Test audit shows orphan tests (no FR mapping)"

**Symptom:** `TEST_AUDIT.md` lists tests with no PRD-FR tokens

**Cause:** Test names don't include FR IDs

**Solution:**

**Add FR tokens to test names:**

```javascript
// Before:
test('validates email format', () => {...});

// After:
test('PRD-0007-FR-2.A validates email format', () => {...});
```

**Or update traceability matrix manually:**

If tests cover FRs but names don't reflect it, add mapping in task file:

```markdown
## Test Plan Summary
- `tests/validation.test.js` → PRD-0007-FR-2 (all acceptance criteria)
```

---

## General Troubleshooting Tips

### Tip 1: Always Read Error Messages

Claude will provide detailed error messages. Read them carefully before asking for help.

### Tip 2: Check CLAUDE.md First

Many issues stem from incomplete or incorrect CLAUDE.md. Verify:
- Testing Strategy is filled
- Migration tool is specified (if using database)
- Tech stack matches project

### Tip 3: Review Recent Changes

If something was working and suddenly broke:
```bash
git log --oneline -5
git diff HEAD~1
```

Check what changed.

### Tip 4: Use Escalation Paths

Follow the escalation protocol from SKILL.md:
1. Research for 30 minutes
2. Document what you tried
3. Ask specific questions
4. Get clarification or workaround
5. Update CLAUDE.md if needed

### Tip 5: Keep Global Index Updated

Run regularly:

```bash
npm run update:tasks-index
```

Or:

```
"Update tasks/_index.md with current task statuses"
```

Keeps dependency tracking accurate.

---

## Still Stuck?

If none of these solutions work:

1. **Describe the issue precisely:**
   - What were you trying to do?
   - What command/phrase did you use?
   - What was the expected result?
   - What actually happened?
   - What have you tried so far?

2. **Provide context:**
   - Share relevant PRD section
   - Share task file section
   - Share error messages (full output)
   - Share CLAUDE.md Testing Strategy section

3. **Ask for help:**
   ```
   "I'm stuck on [specific issue]. Here's what I tried:
   - [Attempt 1]
   - [Attempt 2]

   Error message: [paste error]

   PRD section: [paste FR]

   How do I resolve this?"
   ```

Claude will provide targeted assistance based on full context.

---

**For workflow overview and phase details, see:** `SKILL.md`

**For complete command reference, see:** `references/commands-guide.md`

**For hands-on tutorial, see:** `references/quick-start-tutorial.md`
