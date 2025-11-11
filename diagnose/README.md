# Diagnose Artifacts (Template)

Template Note
- This folder layout is a template stub. Copy/adapt it in your application repository when running `@diagnose`.
- Do not commit secrets or raw `.env*` files. This folder may read `.env*` to exercise APIs, but secrets must not be stored here.

## Folder Structure

```
diagnose/
  YYYY-MM-DDThh-mm-ss/           # run-id (UTC timestamp)
    scripts/                     # repro code (prefer importing app src modules)
    http/                        # curl/httpie scripts and sanitized responses
    logs/                        # captured logs (sanitized), traces, metrics snapshots
    captures/                    # input/output samples, environment snapshots
    README.md                    # how to re-run this specific run-id
```

Keep a root-level DIAGNOSE_REPORT.md (see repository root template). Prepend new entries with `---`.

## External API Clients

Prefer reusing existing app code for API calls (import app modules in `scripts/`). If none exists, scaffold minimal clients under the run-id:

- Python (uv)
  - Add `pyproject.toml` and `uv.lock` under `diagnose/<run-id>/`
  - Install libs with uv (example): `uv add httpx`
  - Example usage: read env from app `.env*`, enforce timeouts, log status + selected headers, redact tokens

- JavaScript/TypeScript (pnpm)
  - Add `package.json` under `diagnose/<run-id>/`
  - Install libs with pnpm (example): `pnpm add axios`
  - Implement a small script (TS/JS) with timeouts and basic retries; redact secrets in output

- Rust (cargo)
  - Add `Cargo.toml` and `Cargo.lock` under `diagnose/<run-id>/`
  - Depend on `reqwest`/`hyper`; log status and selected headers; redact secrets

- Other languages
  - Choose the ecosystem’s standard package manager/build tool and scaffold a minimal client
  - Examples: Java (Gradle/Maven), Go (`go mod`), Ruby (Bundler), PHP (Composer), .NET (`dotnet`)
  - Enforce timeouts/retries and basic logging; redact tokens in output

Environment: Load required credentials/config from the app’s `.env*` files during runtime; never commit those files here.

## Observability & Logs

- Narrow time windows around the incident; prefer correlation IDs
- Capture sanitized logs/traces/metrics under `logs/`
- Include references back to application files and lines where relevant

## Investigation Log

Use this lightweight log within DIAGNOSE_REPORT.md or the run-id README:

Hypothesis | Test/Experiment | Evidence | Result | Next
:--|:--|:--|:--|:--
Cache mismatch causes 404 | Bypass cache header | 200 OK on bypass; 404 otherwise | Pass | Audit cache keys

## Confidence & Timeline

- Declare confidence (High/Medium/Low) and list unknowns
- Include a short timeline for key experiments with timestamps (UTC)

## Cleanup

- Retention: keep artifacts until you confirm deletion
- Never commit raw secrets or `.env*`; sanitize outputs prior to committing
