---
description: Diagnose issues with comprehensive analysis (no code changes)
argument-hint: [error description]
---

## Usage
`@diagnose.md <ERROR_DESCRIPTION>`

## Context
- Error description: $ARGUMENTS
- Reference relevant files by mentioning them (e.g., "@src/api.ts" or "see api.ts") so Claude can read and analyze them.
- Error logs and stack traces will be analyzed in context.
- Use TodoWrite tool to track diagnostic steps for complex issues.

## Your Role
You are the Diagnostic Specialist performing thorough analysis WITHOUT modifying any existing code. Your goal is to identify the issue and provide actionable insights for the user to fix.

## Process
1. **Initial Assessment**: Analyze the error description and gather all available context.
2. **Static Analysis**:
   - Examine relevant code sections and trace execution paths
   - Identify error patterns and potential root causes
   - Review configurations, dependencies, and environment setup
3. **Environment Snapshot (Read-Only)**:
   - Record OS, runtime versions (Node/Python/Go), and package manager versions
   - Note lockfile presence and hashes (e.g., package-lock/pnpm-lock, uv.lock, Cargo.lock)
   - Capture key configuration toggles and feature flags in effect
4. **Dynamic Testing** (if needed):
   - Create a `/diagnose` folder in the root directory for temporary test files
   - Write isolated test scripts to reproduce the issue
   - Run diagnostic commands or the app with specific inputs
   - Collect runtime information (logs, outputs, state)
5. **External API Probe (Optional, Only if Needed)**:
   - Prefer reusing existing source modules that call the API (import them in diagnose scripts)
   - If no suitable code exists, create a minimal client under `/diagnose` to exercise the API
   - Use the application's `.env*` files for credentials/config as needed; do not commit secrets
   - Add timeouts, retries, and simple rate limiting; record method, URL, headers (redact secrets), and status
   - Save reproducible commands/scripts (curl/httpie or small Node/Python/Rust programs) under `/diagnose/http` or `/diagnose/scripts`
6. **Root Cause Analysis**: Synthesize findings to pinpoint the exact issue.
7. **Solution Recommendations**: Provide clear fix options with pros/cons.

## Diagnose Folder Usage
When dynamic testing is needed:
- Create `/diagnose` at the repo root and organize artifacts by run-id, for example:
  - `/diagnose/2025-01-01T12-34-56/` with subfolders:
    - `scripts/` – repro code (prefer reusing src modules; otherwise add minimal clients)
    - `http/` – curl/httpie requests and sanitized responses (no secrets)
    - `logs/` – captured app logs or API responses (sanitized as needed)
    - `captures/` – input/output samples and environment snapshots
    - `README.md` – quick notes on how to re-run the experiments
- Maintain a root-level `DIAGNOSE_REPORT.md`; prepend each new entry (use `---` separators)
- Retention: keep artifacts until the user confirms deletion; never commit secrets or raw `.env*` files

### External API Client Scaffolds
- Reuse existing application code where possible (import src modules in `/diagnose/scripts`)
- If no client exists, scaffold minimal clients in `/diagnose` using the app’s languages:
  - Python: create `/diagnose/pyproject.toml` and `uv.lock`; use `uv` to install libs (e.g., `httpx`, `requests`)
  - JavaScript/TypeScript: create `/diagnose/package.json`; use `pnpm` to install libs (e.g., `axios`, `node-fetch`)
  - Rust: create `/diagnose/Cargo.toml` and `Cargo.lock`; depend on `reqwest`/`hyper`
  - Other languages: choose the standard local package manager/build tool for that ecosystem and scaffold a minimal client (examples: Java with Gradle/Maven, Go with `go mod`, Ruby with Bundler, PHP with Composer, .NET with `dotnet`)
- Load environment from the app’s `.env*` files; do not commit those files
- Example scripts should enforce timeouts, log status/headers, and redact tokens in output

## Observability & Logs
- Collect relevant logs, traces, and metrics from local runs or your APM (e.g., OpenTelemetry, Sentry, Datadog)
- Focus on narrow time windows around the failure; prefer correlation IDs for cross-system tracing
- Sanitize outputs where necessary before saving under `/diagnose/logs` (do not include raw secrets)

## Output Format
Deliver comprehensive diagnostic report:

### 1. Issue Summary
- Error type and classification
- Severity and impact scope
- Where the error occurs (file:line references)

### 2. Root Cause Analysis
- What went wrong and why
- Execution flow leading to the error
- Contributing factors (config, environment, dependencies)

### 3. Evidence
- Relevant code snippets with explanations
- Test results or runtime observations (if dynamic testing was performed)
- Stack traces or log analysis
- Investigation Log (Hypothesis — Test — Evidence — Result — Next):
  - Example row: "Cache mismatch causes 404" | "Bypass cache header" | "200 OK on bypass; 404 otherwise" | Pass | "Audit cache keys"

### 4. Recommended Solutions
For each solution option:
- **Approach**: What to change
- **Implementation**: Step-by-step fix instructions
- **Trade-offs**: Pros, cons, and risks
- **Prevention**: How to avoid this in the future

### 5. Confidence & Timeline
- Confidence level (High/Medium/Low) and remaining unknowns
- Short timeline of experiments with timestamps

### 6. Alignment with FR/NFR and Tasks/Tests
- Identify relevant FR/NFR IDs impacted or uncovered by this issue
- If a regression test is missing, propose the exact test to add mapped to FR/NFR
- If blocked by future tasks, specify the test with `BLOCKED_BY_TASK x.y` and add it to Deferred/Skipped Tests in the tasks file

### 7. Next Steps
Prompt the user: "Would you like me to implement [Solution 1/2/3] or would you prefer to fix it yourself?"

## Important Notes
- Read-only for application code: do not modify existing source outside `/diagnose`
- This command may access the application's `.env*` files for API access during diagnosis; do not commit secrets or these files
- Prefer static analysis; use dynamic testing (and external API probes) only when helpful and rate-limit responsibly
- Organize and retain artifacts under `/diagnose`; keep reports in `DIAGNOSE_REPORT.md`
- Be thorough but concise — focus on actionable insights; include precise file:line references
