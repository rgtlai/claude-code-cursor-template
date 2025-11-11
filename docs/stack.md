# Stack Details (Authoritative)

Template Note
- This file is a template stub. Copy and adapt it into your application repository under `docs/stack.md`.

Purpose
- Provide authoritative stack details and commands for local development, testing, and quality gates.

Languages & Runtimes
- Node.js: TBD (e.g., 20.x)
- Python: TBD (e.g., 3.11)
- Go: TBD (e.g., 1.22)

Frameworks & Libraries
- Frontend: TBD (e.g., React, Next.js)
- Backend: TBD (e.g., FastAPI, Express, Rails)
- Data: TBD (e.g., Postgres, Redis)

Testing
- Unit: TBD (e.g., Jest, Pytest, RSpec)
- Integration: TBD
- E2E/Smoke: TBD (e.g., Playwright/Cypress)
- Coverage: TBD (threshold %, tools)

Local Commands (adjust to your stack)
- Install: TBD (e.g., `pnpm i`, `uv pip install -r requirements.txt`)
- Lint: TBD (e.g., `pnpm lint`)  
- Type-check: TBD (e.g., `pnpm typecheck`)  
- Format: TBD (e.g., `pnpm format:check`)  
- Unit tests: TBD (e.g., `pnpm test`)  
- Integration tests: TBD  
- E2E/Smoke: TBD  
- Coverage: TBD  
- Security scan: TBD  

Quality Gates
- Run lint, type-check, format, security scan, coverage, migrations (if any) before parent-task commits.
- Keep commands short and documented here.

Conventions
- Tests co-located with code or under tests/.
- Include FR/NFR IDs in test names where practical.
- Skips must include `BLOCKED_BY_TASK` reason and reference FR/NFR.

Ownership
- Stack owner(s): TBD
- Review cadence: TBD
