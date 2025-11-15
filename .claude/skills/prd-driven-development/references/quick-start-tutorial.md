# Quick Start Tutorial - PRD-Driven Development

This tutorial walks you through the complete PRD-driven development workflow using a realistic example: **Building a User Registration API**.

## Prerequisites

- Claude Code installed
- Basic project structure (Node.js example, but principles apply to any stack)
- 15-20 minutes to complete

---

## Step 0: Initial Setup

### Your Project Structure (Before)

```
my-app/
├── package.json
├── src/
│   ├── index.js
│   └── routes/
└── tests/
```

### Invoke the Skill

```
skill: prd-driven-development
```

Claude loads the PRD-driven development workflow into context.

---

## Step 1: Create CLAUDE.md (One-Time Setup)

### You Say:

```
"Create CLAUDE.md from template and help me fill required sections"
```

### Claude Responds:

"I'll create `CLAUDE.md` from the template. I've detected:
- **Tech Stack:** Node.js 18 (from package.json)
- **Dependencies:** Express 4.18

Let me ask a few questions to fill the minimum sections:"

**Q1:** "What testing frameworks do you use?"
**You:** "Jest for unit tests, Supertest for integration tests"

**Q2:** "Do you have a database?"
**You:** "Yes, PostgreSQL with Prisma ORM"

**Q3:** "Do you have a migration tool?"
**You:** "Prisma Migrate"

**Q4:** "What's your test database setup?"
**You:** "Testcontainers with PostgreSQL"

**Q5:** "What coverage threshold do you target?"
**You:** "85% lines"

### Output:

**File Created:** `CLAUDE.md`

```markdown
## 2. Tech Stack
- Languages/runtimes (versions): Node.js 18
- Backend framework (version): Express 4.18
- Package manager/build tools: npm

## 3. Data Stores & Messaging
- Primary DB: PostgreSQL 15, ORM/tooling: Prisma 5
- Migrations: Prisma Migrate — commands: npx prisma migrate dev, npx prisma migrate deploy

## 6. Testing Strategy
- Unit: Jest (REQUIRED for all business logic)
- Integration: Supertest + Testcontainers with PostgreSQL (REQUIRED for all API endpoints)
- E2E: Playwright (REQUIRED for user-facing flows)
- Coverage targets: >=85% lines
- Test environments: Testcontainers for integration tests

## 7. Quality Gates
- Lint/type/format: ESLint, TypeScript (tsc --noEmit), Prettier
- Security/static analysis: npm audit
```

---

## Step 2: Create PRD (Phase 2)

### You Say:

```
"Create a PRD for: User registration API that accepts email, password, and name. Users should be able to register, and duplicate emails should be rejected."
```

### Claude Asks Clarifying Questions:

**Q1:** "Should email addresses be verified before account activation?"
**You:** "Not in this phase, just accept and store for now"

**Q2:** "What password requirements (length, complexity)?"
**You:** "Minimum 8 characters, at least one number and one special character"

**Q3:** "What response should be returned on successful registration?"
**You:** "201 status with user object (id, email, name, createdAt), but exclude password from response"

**Q4:** "What error should be returned for duplicate emails?"
**You:** "409 Conflict with message 'Email already registered'"

**Q5:** "Any rate limiting for registration endpoint?"
**You:** "Not in this phase, we can add later"

### Claude Generates PRD:

**File Created:** `prds/0001-prd-user-registration.md`

**Key Sections:**

```markdown
## Functional Requirements

### PRD-0001-FR-1: Accept Registration Request
**Description:** API accepts POST requests to /api/register with email, password, and name fields.

**Acceptance Criteria:**
- PRD-0001-FR-1.A: Endpoint accessible at POST /api/register
- PRD-0001-FR-1.B: Request body must include email (string), password (string), name (string)
- PRD-0001-FR-1.C: Content-Type must be application/json

### PRD-0001-FR-2: Validate Input
**Description:** System validates all input fields before processing.

**Acceptance Criteria:**
- PRD-0001-FR-2.A: Email must be valid format (RFC 5322)
- PRD-0001-FR-2.B: Password must be at least 8 characters
- PRD-0001-FR-2.C: Password must contain at least one number and one special character
- PRD-0001-FR-2.D: Name must be non-empty string (1-100 characters)
- PRD-0001-FR-2.E: Return 400 Bad Request with validation error details for invalid input

### PRD-0001-FR-3: Check Duplicate Email
**Description:** System prevents duplicate email registrations.

**Acceptance Criteria:**
- PRD-0001-FR-3.A: Query database for existing user with same email (case-insensitive)
- PRD-0001-FR-3.B: Return 409 Conflict with "Email already registered" if duplicate found

### PRD-0001-FR-4: Create User Record
**Description:** System creates user record with hashed password.

**Acceptance Criteria:**
- PRD-0001-FR-4.A: Hash password using bcrypt with salt rounds = 10
- PRD-0001-FR-4.B: Store user with email, hashedPassword, name, createdAt, updatedAt
- PRD-0001-FR-4.C: Generate unique UUID for user ID

### PRD-0001-FR-5: Return Success Response
**Description:** System returns user data on successful registration.

**Acceptance Criteria:**
- PRD-0001-FR-5.A: Return 201 Created status
- PRD-0001-FR-5.B: Response body includes {id, email, name, createdAt}
- PRD-0001-FR-5.C: Password/hashedPassword must NOT be included in response

## Non-Functional Requirements

### PRD-0001-NFR-1: Response Time
**Target:** Registration endpoint responds within 500ms (p95)

### PRD-0001-NFR-2: Password Security
**Target:** Passwords hashed with bcrypt, minimum 10 salt rounds
```

---

## Step 3: Generate Tasks (Phase 3)

### You Say:

```
"Generate tasks from prds/0001-prd-user-registration.md"
```

### Claude Generates Parent Tasks (Phase 3.1):

**File Created:** `tasks/tasks-0001-prd-user-registration.md`

```markdown
## Tasks

### 1.0 [  ] Create database schema and migrations (PRD-0001-FR-4)

### 2.0 [  ] Implement registration endpoint (PRD-0001-FR-1, PRD-0001-FR-2, PRD-0001-FR-3, PRD-0001-FR-4, PRD-0001-FR-5)

### 3.0 [  ] Verify performance requirements (PRD-0001-NFR-1, PRD-0001-NFR-2)
```

### Claude Stops and Waits:

**"I've generated 3 parent tasks for this PRD. Please review them above to ensure they match your expectations."**

**"These parent tasks will be broken down into detailed sub-tasks (including test sub-tasks based on CLAUDE.md requirements)."**

**"Reply 'Go' when ready to proceed with sub-task generation, or ask for changes if needed."**

### You Say:

```
"Go"
```

### Claude Generates Sub-Tasks (Phase 3.2):

```markdown
### 1.0 [  ] Create database schema and migrations (PRD-0001-FR-4)

  - [ ] 1.1 Define Prisma schema for User model (id, email, hashedPassword, name, createdAt, updatedAt)
  - [ ] 1.2 Generate migration files (npx prisma migrate dev)
  - [ ] 1.3 VERIFY: Execute migrations against database
  - [ ] 1.4 VERIFY: Inspect schema (tables, columns, types, indexes, constraints)
  - [ ] 1.5 VERIFY: Test seed/population script
  - [ ] 1.6 VERIFY: Test rollback and re-apply
  - [ ] 1.7 Run integration tests against real database

### 2.0 [  ] Implement registration endpoint (PRD-0001-FR-1, PRD-0001-FR-2, PRD-0001-FR-3, PRD-0001-FR-4, PRD-0001-FR-5)

  - [ ] 2.1 Write unit tests for input validation (PRD-0001-FR-2)
  - [ ] 2.2 Write unit tests for password hashing (PRD-0001-FR-4)
  - [ ] 2.3 Write unit tests for duplicate email check logic (PRD-0001-FR-3)
  - [ ] 2.4 Write integration tests for POST /api/register endpoint (PRD-0001-FR-1, PRD-0001-FR-5)
  - [ ] 2.5 Run unit tests and fix ALL failures
  - [ ] 2.6 Implement input validation middleware (email, password, name)
  - [ ] 2.7 Implement password hashing service (bcrypt, salt rounds = 10)
  - [ ] 2.8 Implement duplicate email check
  - [ ] 2.9 Implement user creation in database
  - [ ] 2.10 Implement registration route handler
  - [ ] 2.11 Run integration tests and fix ALL failures

### 3.0 [  ] Verify performance requirements (PRD-0001-NFR-1, PRD-0001-NFR-2)

  - [ ] 3.1 Add performance test harness (measure p95 response time)
  - [ ] 3.2 Verify registration endpoint responds < 500ms (p95)
  - [ ] 3.3 Verify bcrypt salt rounds = 10
```

**Also Created:** `tasks/_index.md` with global dependency tracking (no cross-PRD dependencies for this example)

---

## Step 4: Execute Tasks (Phase 4)

### You Say:

```
"Process task list tasks/tasks-0001-prd-user-registration.md"
```

### Claude Executes Parent 1.0 (Database Schema)

#### Sub-task 1.1: Define Prisma Schema

**Claude creates:** `prisma/schema.prisma`

```prisma
model User {
  id             String   @id @default(uuid())
  email          String   @unique
  hashedPassword String
  name           String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([email])
}
```

**Marks:** [x] 1.1 Complete

#### Sub-task 1.2: Generate Migration

**Claude runs:**
```bash
npx prisma migrate dev --name init_user_table
```

**Output:**
```
Migration created: 20250115000000_init_user_table.sql
```

**Marks:** [x] 1.2 Complete

#### Sub-tasks 1.3-1.6: Database Verification

**Claude runs:**
```bash
# 1.3: Execute migration
npx prisma migrate deploy

# 1.4: Inspect schema
npx prisma db pull
# Verifies User table exists with correct columns

# 1.5: Test seed
npx prisma db seed

# 1.6: Test rollback
npx prisma migrate reset --force
npx prisma migrate deploy
```

**All verifications pass.**

**Marks:** [x] 1.3, [x] 1.4, [x] 1.5, [x] 1.6 Complete

#### Sub-task 1.7: Integration Tests Against Real DB

**Claude creates:** `tests/integration/database.int.test.js`

```javascript
describe('PRD-0001-FR-4 User model database operations', () => {
  test('creates user with unique email', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        hashedPassword: 'hashed123',
        name: 'Test User'
      }
    });
    expect(user.id).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });

  test('enforces unique email constraint', async () => {
    await expect(
      prisma.user.create({
        data: {
          email: 'test@example.com', // duplicate
          hashedPassword: 'hashed456',
          name: 'Duplicate User'
        }
      })
    ).rejects.toThrow('Unique constraint failed');
  });
});
```

**Claude runs:**
```bash
npm test -- tests/integration/database.int.test.js
✓ All tests passing (2 integration)
```

**Marks:** [x] 1.7 Complete

### Parent 1.0 Complete - Quality Gates

**Claude runs:**
```bash
npm run lint         # ✓ Pass
tsc --noEmit          # ✓ Pass
npm audit            # ✓ No vulnerabilities
npm test -- --coverage # ✓ 100% coverage for new code
```

**All gates pass.**

**Claude commits:**
```bash
git add .
git commit -m "feat: add User database schema and migrations (PRD-0001-FR-4)

- Defines User model with email, password, name fields
- Adds unique constraint on email
- Includes database verification tests
- Prisma migration: 20250115000000_init_user_table

Related to PRD-0001"
```

**Marks:** [x] 1.0 Complete

---

### Claude Executes Parent 2.0 (Registration Endpoint)

#### Sub-tasks 2.1-2.3: Unit Tests (Test-First)

**Claude creates:** `tests/unit/validation.test.js`

```javascript
const { validateRegistrationInput } = require('../../src/services/validation');

describe('PRD-0001-FR-2 input validation', () => {
  test('accepts valid email, password, name', () => {
    const result = validateRegistrationInput({
      email: 'user@example.com',
      password: 'SecureP@ss1',
      name: 'John Doe'
    });
    expect(result.valid).toBe(true);
  });

  test('rejects invalid email format', () => {
    const result = validateRegistrationInput({
      email: 'invalid-email',
      password: 'SecureP@ss1',
      name: 'John Doe'
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid email format');
  });

  test('rejects password shorter than 8 characters (PRD-0001-FR-2.B)', () => {
    const result = validateRegistrationInput({
      email: 'user@example.com',
      password: 'Short1!',
      name: 'John Doe'
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters');
  });

  test('rejects password without number (PRD-0001-FR-2.C)', () => {
    const result = validateRegistrationInput({
      email: 'user@example.com',
      password: 'NoNumber!',
      name: 'John Doe'
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one number');
  });

  test('rejects password without special character (PRD-0001-FR-2.C)', () => {
    const result = validateRegistrationInput({
      email: 'user@example.com',
      password: 'NoSpecial1',
      name: 'John Doe'
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one special character');
  });

  test('rejects empty name (PRD-0001-FR-2.D)', () => {
    const result = validateRegistrationInput({
      email: 'user@example.com',
      password: 'SecureP@ss1',
      name: ''
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Name must be non-empty');
  });
});
```

**Claude creates:** `tests/unit/password.test.js`

```javascript
const { hashPassword, comparePassword } = require('../../src/services/password');

describe('PRD-0001-FR-4 password hashing', () => {
  test('hashes password with bcrypt', async () => {
    const hashed = await hashPassword('MyPassword1!');
    expect(hashed).not.toBe('MyPassword1!');
    expect(hashed.startsWith('$2b$')).toBe(true); // bcrypt prefix
  });

  test('uses salt rounds = 10 (PRD-0001-NFR-2)', async () => {
    const hashed = await hashPassword('MyPassword1!');
    expect(hashed.startsWith('$2b$10$')).toBe(true); // 10 rounds
  });

  test('hashed password can be verified', async () => {
    const password = 'MyPassword1!';
    const hashed = await hashPassword(password);
    const matches = await comparePassword(password, hashed);
    expect(matches).toBe(true);
  });
});
```

**Claude creates:** `tests/unit/duplicateCheck.test.js`

```javascript
const { checkDuplicateEmail } = require('../../src/services/userService');

describe('PRD-0001-FR-3 duplicate email check', () => {
  test('returns true if email exists (case-insensitive)', async () => {
    // Mock setup
    prisma.user.findUnique = jest.fn().mockResolvedValue({ id: '123' });

    const isDuplicate = await checkDuplicateEmail('TEST@EXAMPLE.COM');
    expect(isDuplicate).toBe(true);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' } // lowercased
    });
  });

  test('returns false if email does not exist', async () => {
    prisma.user.findUnique = jest.fn().mockResolvedValue(null);

    const isDuplicate = await checkDuplicateEmail('new@example.com');
    expect(isDuplicate).toBe(false);
  });
});
```

**Marks:** [x] 2.1, [x] 2.2, [x] 2.3 Complete

#### Sub-task 2.4: Integration Tests

**Claude creates:** `tests/integration/register.int.test.js`

```javascript
const request = require('supertest');
const app = require('../../src/app');

describe('PRD-0001-FR-1 POST /api/register endpoint', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany(); // Clean database
  });

  test('registers new user successfully (PRD-0001-FR-5)', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        email: 'newuser@example.com',
        password: 'SecurePass1!',
        name: 'New User'
      });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(String),
      email: 'newuser@example.com',
      name: 'New User',
      createdAt: expect.any(String)
    });
    expect(res.body.password).toBeUndefined(); // PRD-0001-FR-5.C
    expect(res.body.hashedPassword).toBeUndefined();
  });

  test('returns 400 for invalid email (PRD-0001-FR-2.E)', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        email: 'invalid-email',
        password: 'SecurePass1!',
        name: 'User'
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid email format');
  });

  test('returns 409 for duplicate email (PRD-0001-FR-3)', async () => {
    // Create first user
    await request(app)
      .post('/api/register')
      .send({
        email: 'duplicate@example.com',
        password: 'SecurePass1!',
        name: 'First User'
      });

    // Attempt duplicate registration
    const res = await request(app)
      .post('/api/register')
      .send({
        email: 'duplicate@example.com',
        password: 'AnotherPass2!',
        name: 'Second User'
      });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('Email already registered');
  });

  test('stores hashed password in database (PRD-0001-FR-4)', async () => {
    const password = 'SecurePass1!';
    const res = await request(app)
      .post('/api/register')
      .send({
        email: 'hashtest@example.com',
        password,
        name: 'Hash Test'
      });

    const user = await prisma.user.findUnique({
      where: { email: 'hashtest@example.com' }
    });

    expect(user.hashedPassword).not.toBe(password); // Not plain text
    expect(user.hashedPassword.startsWith('$2b$10$')).toBe(true); // Bcrypt with 10 rounds
  });
});
```

**Marks:** [x] 2.4 Complete

#### Sub-task 2.5: Run Unit Tests

**Claude runs:**
```bash
npm test -- tests/unit/
✗ All tests failing (implementation not written yet)
```

**Expected - tests written first (TDD).**

**Marks:** [x] 2.5 Complete (failures expected at this stage)

#### Sub-tasks 2.6-2.10: Implementation

**Claude implements all services and routes...**

*(Implementation code omitted for brevity - includes validation.js, password.js, userService.js, register route)*

**Marks:** [x] 2.6, [x] 2.7, [x] 2.8, [x] 2.9, [x] 2.10 Complete

#### Sub-task 2.11: Run Integration Tests

**Claude runs:**
```bash
npm test -- tests/integration/register.int.test.js
✓ All tests passing (4 integration)

npm test -- tests/unit/
✓ All tests passing (9 unit)
```

**Marks:** [x] 2.11 Complete

### Parent 2.0 Complete - Quality Gates

**Claude runs:**
```bash
npm run lint         # ✓ Pass
tsc --noEmit          # ✓ Pass
npm audit            # ✓ Pass
npm test -- --coverage # ✓ 92% coverage (exceeds 85% threshold)
```

**All gates pass.**

**Claude commits:**
```bash
git add .
git commit -m "feat: implement user registration endpoint (PRD-0001-FR-1, PRD-0001-FR-2, PRD-0001-FR-3, PRD-0001-FR-4, PRD-0001-FR-5)

- Adds POST /api/register endpoint
- Validates email, password (8+ chars, number, special char), name
- Prevents duplicate emails (409 Conflict)
- Hashes passwords with bcrypt (10 salt rounds)
- Returns user object (excludes password from response)
- Includes 9 unit tests and 4 integration tests

Related to PRD-0001"
```

**Marks:** [x] 2.0 Complete

---

### Claude Executes Parent 3.0 (Performance Verification)

#### Sub-task 3.1: Performance Test Harness

**Claude creates:** `tests/performance/register.perf.test.js`

```javascript
const request = require('supertest');
const app = require('../../src/app');

describe('PRD-0001-NFR-1 registration endpoint performance', () => {
  test('responds within 500ms (p95)', async () => {
    const responseTimes = [];

    // Run 100 requests
    for (let i = 0; i < 100; i++) {
      const start = Date.now();
      await request(app)
        .post('/api/register')
        .send({
          email: `user${i}@example.com`,
          password: 'SecurePass1!',
          name: `User ${i}`
        });
      const duration = Date.now() - start;
      responseTimes.push(duration);
    }

    // Calculate p95
    responseTimes.sort((a, b) => a - b);
    const p95Index = Math.floor(responseTimes.length * 0.95);
    const p95 = responseTimes[p95Index];

    console.log(`p95 response time: ${p95}ms`);
    expect(p95).toBeLessThan(500);
  });
});
```

**Marks:** [x] 3.1 Complete

#### Sub-task 3.2: Run Performance Tests

**Claude runs:**
```bash
npm test -- tests/performance/register.perf.test.js
✓ p95 response time: 287ms (under 500ms threshold)
```

**Marks:** [x] 3.2 Complete

#### Sub-task 3.3: Verify Bcrypt Salt Rounds

**Already verified in unit tests (2.2) and integration tests (2.11).**

**Marks:** [x] 3.3 Complete

### Parent 3.0 Complete - Quality Gates

**All gates already passing from Parent 2.0.**

**Claude commits:**
```bash
git add .
git commit -m "test: verify performance requirements (PRD-0001-NFR-1, PRD-0001-NFR-2)

- Adds performance test harness for registration endpoint
- Verifies p95 response time < 500ms (actual: 287ms)
- Confirms bcrypt salt rounds = 10

Related to PRD-0001"
```

**Marks:** [x] 3.0 Complete

---

## Step 5: Audit Tests (Phase 5 - Optional)

### You Say:

```
"Audit tests for completed features"
```

### Claude Generates Audit Report:

**File Created:** `TEST_AUDIT.md`

```markdown
# Test Audit Report

**PRD:** prds/0001-prd-user-registration.md
**Scope:** Completed tasks only
**Generated:** 2025-01-15

---

## Executive Summary

- ✅ **Coverage:** 100% (all 5 FRs have tests)
- ✅ **Correctness:** All tests validate right behavior per specs
- ✅ **Traceability:** All tests map to PRD-0001-FR-n IDs
- ✅ **Quality Gates:** Lint, type, security, coverage all passing
- ✅ **Total Tests:** 13 unit + 4 integration + 1 performance = 18 tests

---

## CLAUDE.md Compliance

**Required Test Types (from CLAUDE.md):**
- ✅ Unit tests: Jest (REQUIRED) — 13 tests written, all passing
- ✅ Integration tests: Supertest + Testcontainers (REQUIRED) — 4 tests written, all passing
- ⚠️ E2E tests: Playwright (REQUIRED for user-facing flows) — Not applicable (backend API only)

**Compliance Status:** ✅ Fully compliant (E2E not applicable for backend-only feature)

---

## FR/NFR Traceability Matrix

| ID | Description | Unit Tests | Integration Tests | E2E Tests | Status |
|----|-------------|-----------|-------------------|-----------|--------|
| PRD-0001-FR-1 | Accept registration request | N/A | 4 tests | N/A | ✅ Pass |
| PRD-0001-FR-2 | Validate input | 6 tests | 1 test | N/A | ✅ Pass |
| PRD-0001-FR-3 | Check duplicate email | 2 tests | 1 test | N/A | ✅ Pass |
| PRD-0001-FR-4 | Create user record | 3 tests | 1 test | N/A | ✅ Pass |
| PRD-0001-FR-5 | Return success response | N/A | 1 test | N/A | ✅ Pass |
| PRD-0001-NFR-1 | Response time < 500ms | N/A | N/A | 1 perf test | ✅ Pass |
| PRD-0001-NFR-2 | Password security (bcrypt 10 rounds) | 2 tests | 1 test | N/A | ✅ Pass |

---

## Coverage Gaps

**None identified.** All FRs/NFRs have comprehensive test coverage.

---

## Correctness Issues

**None identified.** All test assertions match PRD requirements.

---

## Quality Gates Summary

- ✅ **Lint:** ESLint passing (0 errors, 0 warnings)
- ✅ **Type Check:** TypeScript passing (0 errors)
- ✅ **Security:** npm audit clean (0 vulnerabilities)
- ✅ **Coverage:** 92% lines (exceeds 85% threshold)
- ✅ **Database Verification:** Migrations executed and verified

---

## Recommendations

**Immediate (Critical):** None

**Short-term (High):** None

**Long-term (Medium):**
- Consider adding E2E tests when user-facing UI is built (e.g., registration form → API → database)
- Add contract tests if other services will consume this registration API

---

**Status:** ✅ **All tests passing, PRD-0001 implementation complete and verified**
```

---

## Final Project Structure

```
my-app/
├── CLAUDE.md                                   # Architecture baseline
├── prds/
│   └── 0001-prd-user-registration.md          # Finalized PRD
├── tasks/
│   ├── _index.md                               # Global dependency tracker
│   └── tasks-0001-prd-user-registration.md     # Task list (all [x] complete)
├── TEST_AUDIT.md                               # Audit report
├── prisma/
│   ├── schema.prisma                           # User model
│   └── migrations/
│       └── 20250115000000_init_user_table/
│           └── migration.sql                   # Database migration
├── src/
│   ├── routes/
│   │   └── register.js                         # POST /api/register
│   └── services/
│       ├── validation.js                       # Input validation
│       ├── password.js                         # Bcrypt hashing
│       └── userService.js                      # User creation, duplicate check
└── tests/
    ├── unit/
    │   ├── validation.test.js                  # 6 tests for PRD-0001-FR-2
    │   ├── password.test.js                    # 3 tests for PRD-0001-FR-4, NFR-2
    │   └── duplicateCheck.test.js              # 2 tests for PRD-0001-FR-3
    ├── integration/
    │   ├── database.int.test.js                # 2 tests for DB operations
    │   └── register.int.test.js                # 4 tests for endpoint behavior
    └── performance/
        └── register.perf.test.js               # 1 test for PRD-0001-NFR-1
```

---

## Key Takeaways

### What You Just Did:

1. ✅ **Set up architecture baseline** (CLAUDE.md) in ~2 minutes
2. ✅ **Created comprehensive PRD** with 5 FRs, 2 NFRs, testable acceptance criteria
3. ✅ **Generated structured task list** with 3 parent tasks, 21 sub-tasks
4. ✅ **Implemented test-first** (wrote 18 tests before implementation)
5. ✅ **Verified database changes** (executed migrations, inspected schema)
6. ✅ **Applied quality gates** (lint, type-check, security, coverage)
7. ✅ **Audited test quality** (coverage + correctness)
8. ✅ **Delivered production-ready feature** with full traceability

### Total Time:

- **Setup:** ~5 minutes (CLAUDE.md + PRD)
- **Task Generation:** ~2 minutes (parent + sub-tasks)
- **Implementation:** ~15-20 minutes (tests + code + verification)
- **Total:** **~25-30 minutes** for a production-ready feature with:
  - Database schema + migrations
  - 18 comprehensive tests
  - Full documentation and traceability
  - Quality gates passing

### Compare to Manual Approach:

| Aspect | Manual | PRD-Driven |
|--------|--------|------------|
| Requirements clarity | Ambiguous, scattered | Explicit FRs with acceptance criteria |
| Task planning | Ad-hoc | Structured, dependency-aware |
| Test coverage | Often incomplete | 100% (enforced by workflow) |
| Traceability | Manual tracking | Automated (PRD-FR tokens) |
| Quality gates | Sometimes forgotten | Always applied |
| Database verification | Often skipped | Mandatory verification protocol |

---

## Next Steps

### Continue with More Features:

1. **Create new PRD:** "Add user login endpoint with JWT authentication"
2. **Cross-PRD dependencies:** Login endpoint depends on User model from PRD-0001
3. **Global index tracks:** `tasks/_index.md` shows dependency chain

### Explore Advanced Features:

- **Multi-service PRDs** (API + frontend + background jobs)
- **Feature flags** for gradual rollout
- **Contract-first development** for blocked dependencies
- **Performance SLOs** and monitoring

### Customize for Your Stack:

- **Python/Django:** Similar workflow with pytest, Alembic migrations
- **Go:** Use Go testing package, goose/migrate for DB, chromedp for E2E
- **Ruby/Rails:** RSpec, ActiveRecord migrations, Capybara for E2E

---

**You're now ready to use PRD-driven development for real-world projects!**

For troubleshooting common issues, see: `references/troubleshooting.md`
