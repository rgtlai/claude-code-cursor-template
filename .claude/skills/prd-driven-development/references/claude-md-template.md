# CLAUDE.md — Architecture & Stack Baseline (Template)

Purpose: Single source of truth for architecture, technology stack, and delivery conventions. Commands like `@import-prds.md`, `@create-prd.md`, `@generate-tasks.md`, `@process-task-list.md`, and `@test-audit.md` require this file (or linked docs) before proceeding.

Update this file per project. Link to deeper docs where appropriate.

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
- Migrations: [Tool name] — commands, paths, conventions

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
- Unit: [Framework(s), location patterns]
- Integration: [Real services/DB; fixtures; how to run]
- E2E/Smoke: [Tooling, critical paths]
- Coverage targets: [e.g., >=85% lines]
- Test naming/mapping: Use PRD-scoped IDs `PRD-####-FR-n`, `PRD-####-NFR-n` in test names/describes
 - Test environments: [Testcontainers/docker-compose]; quick commands to start/stop required services
 - CI policy: fail/warn when tests or commits are missing PRD FR/NFR tokens

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
