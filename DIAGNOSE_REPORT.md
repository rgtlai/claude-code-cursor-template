# Diagnose Report Log (Template)

Template Note
- This is a template log for application repositories. Copy it into your app and keep it at the repo root.
- Prepend each new diagnose entry at the top, separated by `---`.
- Do not include raw secrets or PII. Redact tokens, keys, and user data in snippets.

---

# Diagnose Report
**Date**: YYYY-MM-DD HH:MM TZ
**Run ID**: 2025-01-01T12-34-56
**Scope**: [service/module/API]
**Category**: [static-analysis | local-repro | external-api-probe]
**Investigator**: [name/agent]

## 1. Issue Summary
- Error type/classification: [e.g., 5xx upstream, timeout, logic bug]
- Severity & impact: [e.g., high; blocks checkout]
- Affected areas: [file:line, endpoint, job]

## 2. Root Cause Analysis
- Why it failed: [concise narrative]
- Execution path: [call chain or flow]
- Contributing factors: [config/flag/dependency/version]

## 3. Evidence
- Code excerpts: [file:line] brief explanation
- Logs/traces/metrics: [sanitized snippets, timestamps, correlation IDs]
- Local experiments: location under `diagnose/<run-id>/` describing scripts and outputs

Investigation Log (Hypothesis — Test — Evidence — Result — Next)
- Hypothesis: [e.g., cache mismatch causes 404]
- Test: [e.g., bypass cache header]
- Evidence: [e.g., 200 OK on bypass; 404 otherwise]
- Result: [Pass/Fail/Inconclusive]
- Next: [e.g., audit cache keys]

## 4. Recommended Solutions
1. Approach A — steps, risks, prevention
2. Approach B — steps, risks, prevention
3. Approach C — steps, risks, prevention

## 5. Confidence & Timeline
- Confidence: [High/Medium/Low]
- Unknowns: [list]
- Timeline (UTC):
  - 12:34:56 — ran `scripts/probe.ts` (timeout=10s) → 504
  - 12:41:08 — forced cache-bypass → 200 OK

## 6. Alignment with FR/NFR and Tasks/Tests
- Impacted: FR-[ids], NFR-[ids]
- Regression tests to add (mapped to FR/NFR): [list]
- Deferred tests (BLOCKED_BY_TASK x.y): [list and reasons]
- Update tasks file: add to Test Plan Summary and Deferred/Skipped Tests

## 7. Next Steps
- Implement chosen solution or create/update tasks; confirm environment rollout plan if relevant

