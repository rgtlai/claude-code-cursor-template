# CLAUDE.md — Architecture & Stack Baseline (Template)

**Purpose:** Single source of truth for architecture, technology stack, and delivery conventions.

**⚠️ REQUIRED:** PRD-driven development workflow commands require this file before proceeding.

**⚠️ IMPORTANT:** If you leave template placeholders like `[Tool name]` or `[Framework(s)]`:
- The workflow will apply defaults: **unit + integration + E2E tests (auto-detect) REQUIRED**
- You will be prompted to confirm or customize these defaults
- **To avoid surprises:** Fill this template completely before starting

**Update this file per project.** Link to deeper docs where appropriate.

## 1. Architecture Overview
- System diagram link(s): [Add diagrams/links]
- Service boundaries and responsibilities:
  - [Service A] — purpose, interfaces, data ownership
  - [Service B] — purpose, interfaces, data ownership
- Tenancy model: [Single-tenant | Multi-tenant | Hybrid]. How tenant context is derived and enforced

## 2. Tech Stack
- Languages/runtimes (versions): [Node 20, Python 3.11, Go 1.22, etc.]
- Frontend framework (version): [React 18 + Next 14, etc.]
- Backend framework (version): [FastAPI 0.x, Express 5, Rails 7, etc.]
- Package manager/build tools: [pnpm/npm/yarn; Vite/Webpack/Turbo]

## 3. Data Stores & Messaging
- Primary DB: [Postgres 15], ORM/tooling: [Prisma/SQLAlchemy/ActiveRecord]
- Secondary stores: [Redis for cache, S3 for files]
- Messaging/streaming: [Kafka/RabbitMQ/etc.] — topics/queues, producers/consumers
- Migrations: [Tool name: Alembic | Prisma | Flyway | Rails | Sequelize | migrate-mongo]
  - Generate: `[npm run migration:generate | alembic revision --autogenerate]`
  - Apply: `[npm run migrate | alembic upgrade head | rake db:migrate]`
  - Rollback: `[npm run migrate:rollback | alembic downgrade -1]`
  - Status: `[npm run migrate:status | alembic current]`
- Schema state tracking:
  - SQL: [schema.sql | prisma/schema.prisma | db/schema.rb | models in src/models/]
  - NoSQL: [model definitions in src/models/ | schemas/ directory | JSON schema files]
  - Migration tracking: [schema_migrations table | .migrate-mongo-status.json]
- Seed data: [db/seeds.sql | scripts/seed.js | db/seeds.rb | fixtures/]
- Test database setup: [Testcontainers | docker-compose test-db | in-memory SQLite/MongoDB]
  - Quick start: `[docker-compose up -d test-db && npm run migrate | pytest (auto-starts Testcontainers)]`

## 4. APIs & Contracts
- Public APIs: [REST/GraphQL/gRPC] — versioning strategy, auth
- Internal APIs: [Service-to-service patterns, timeouts, retries]
- API Guidelines: [Error model, 404 vs 422, pagination, idempotency]

## 5. Security & Privacy
- AuthN/Z: [OIDC/JWT, RBAC/ABAC]. Tenant context injection rules
- Data classification: [PII/PCI/PHI] and handling requirements
- Threat model link(s): [Add links]
- Secrets management: [Tool/process]

## 6. Testing Strategy

**IMPORTANT: This section is AUTHORITATIVE for all PRD-driven development commands.**
**Explicit requirements/exclusions here override skill defaults.**

**Required Test Types:**
- Unit: [Framework, location pattern] - e.g., "Jest, src/**/*.test.ts (REQUIRED)" or "None"
- Integration: [Real services/DB setup] - e.g., "Supertest + TestContainers (REQUIRED)" or "None - mocked in unit tests"
- E2E: [Tooling, environment] - e.g., "Playwright (REQUIRED for UI flows)" or "None (infrastructure unavailable)" or "Not applicable - backend API only"

**How to Specify:**
- **To REQUIRE a test type:** "[Framework] (REQUIRED)" or "[Framework] required for [scope]"
- **To EXCLUDE a test type:** "None", "Not applicable", "Deferred to Q2", or "Infrastructure unavailable"
- **If silent/template text:** Skill defaults to unit + integration required, E2E for UI-backend features

**Examples:**

✅ Clear Requirements:
```
- Unit: pytest (REQUIRED for all business logic)
- Integration: TestContainers with PostgreSQL (REQUIRED for DB operations)
- E2E: Playwright (REQUIRED for login, registration, checkout flows)
```

✅ Explicit Exclusion:
```
- Unit: Jest (REQUIRED)
- Integration: Supertest (REQUIRED)
- E2E: None - Infrastructure not available, planned for Sprint 5
```

✅ Mixed:
```
- Unit: Go testing package (REQUIRED)
- Integration: Testcontainers (REQUIRED)
- E2E: Not applicable - this is a backend API service with no UI
```

**Coverage Targets:**
- Unit: [e.g., >=85% line coverage]
- Integration: [e.g., all API endpoints, DB operations]
- E2E: [e.g., all critical user flows OR "N/A"]

**Test Infrastructure:**
- Unit: [Setup instructions or "standard Jest setup"]
- Integration: [docker-compose services, Testcontainers config]
- E2E: [AUTOMATED browser automation setup, test environment URL OR "N/A"]

**E2E Testing = Automated End-to-End Testing (minimize manual involvement):**
- **JavaScript/TypeScript Frontend:** Playwright (recommended), Cypress, or Puppeteer
- **Python Web Apps:** Playwright for Python, Selenium
- **Go Web Apps:** chromedp, selenium-go, playwright-go
- **Mobile Apps:** Appium, Detox (React Native)
- **API-only services:** E2E may not be applicable (use integration tests instead)

**Stack-Specific E2E Recommendations:**
Automatically suggest the appropriate E2E framework based on detected tech stack:
- React/Vue/Angular → Playwright or Cypress
- Next.js/Svelte → Playwright
- Django/Flask → Playwright for Python
- Rails → Capybara or Playwright
- Express/Fastify API → E2E not applicable (integration tests sufficient)

**Test Naming/Mapping:**
- Use PRD-scoped IDs `PRD-####-FR-n`, `PRD-####-NFR-n` in test names/describes
- Test environments: [Testcontainers/docker-compose]; quick commands to start/stop required services
- CI policy: fail/warn when tests or commits are missing PRD FR/NFR tokens

**Enforcement Policy:**
- Skip tests ONLY when: BLOCKED_BY_TASK with valid dependency reference
- NEVER skip due to difficulty - invest effort in test setup
- All skips must be documented in Deferred/Skipped Tests section

---

**📋 DEFAULTS IF THIS SECTION IS INCOMPLETE:**

If Testing Strategy section contains template text (e.g., `[Framework(s)]`, `[Tool name]`), the workflow will apply these defaults:

**Standard Complexity PRD (default):**
- ✅ Unit tests: **REQUIRED** (all business logic, validation, utilities)
- ✅ Integration tests: **REQUIRED** (all API endpoints, database operations)
- ✅ E2E tests: **AUTOMATIC** (auto-detected for frontend-backend features like login, registration, CRUD, forms)

**Simple Complexity PRD:**
- ✅ Unit tests: For core logic only
- ⚠️ Integration tests: Optional (only if API or database involved)
- ⚠️ E2E tests: Optional (only if frontend-backend interaction)

**Complex Complexity PRD:**
- ✅ Unit tests: **REQUIRED** (all FRs)
- ✅ Integration tests: **REQUIRED** (all FRs)
- ✅ E2E tests: **REQUIRED** when applicable (all user-facing flows)

**To customize:** Fill the Testing Strategy section above with explicit requirements or exclusions.

---

## 7. Quality Gates
- Lint/type/format: [Tools, commands]
- Security/static analysis: [Tools, severity thresholds]
- Performance budgets: [Targets, measurement tools]
- Accessibility checks: [Scope, tools]
 - Enforcement: [Policies to enforce gates at parent-task boundaries]

## 8. CI/CD & Environments
- Pipelines: [CI tool, workflows]
- Environments: [Dev/Staging/Prod] — config differences, feature flags
- Deployment strategy: [Blue/green | Canary | Rolling]
- Rollback & backout: [Process]

## 9. Observability
- Logging: [Format, correlation IDs]
- Metrics: [Key SLI/SLOs]
- Tracing: [Propagation, sampling]
- Dashboards & alerts: [Links]

## 10. Feature Flags & Rollout
- Flag provider: [Tool]
- Defaults, safe-off behavior, monitoring during rollout

## 11. Documentation Conventions
- Directory: [docs/]
- Required docs: architecture.md, api_design.md, data_model.md, runbooks

## 12. Project Structure
- Repo layout: [Monorepo | Multi-repo]. If multi-repo, link to other repos
- Key paths: [src/, services/, apps/]

## 13. Versioning & Change Management
- PRD IDs: `PRD-####`
- Requirement IDs: `PRD-####-FR-n`, `PRD-####-NFR-n`
- PRD change protocol: how task files are updated on PRD revisions
 - ADRs: Location and format for Architecture Decision Records; approval workflow

## 14. Database Verification (Required for schema changes)
- Commands to: migrate, inspect, seed, rollback, re-apply, run integration tests against REAL DB
- Success criteria: No errors, schema as expected, tests pass
 - Tooling standard: [e.g., Alembic/Flyway/ActiveRecord Migrations]; local env via [Testcontainers/docker-compose]

## 15. Open Questions
- [List any decisions pending or assumptions to validate]
