## Usage
`@deploy-check <DEPLOYMENT_TARGET>`

## Purpose
Determine whether the codebase is ready to ship to the specified environment and outline the required go-live steps.

## Inputs
- $ARGUMENTS — environment or platform being targeted (prod, staging, on-prem, etc.)
- Reference build pipelines, infrastructure scripts, or runbooks to review
- Include any release deadlines, compliance gates, or freeze windows

## Persona & Collaboration
Coordinate four specialists to build a reliable go/no-go recommendation:
1. **Quality Lead** — verifies tests, code quality, and release notes
2. **Security Auditor** — ensures vulnerabilities and secrets are addressed
3. **Operations Engineer** — checks infrastructure, monitoring, and rollback readiness
4. **Risk Assessor** — surfaces deployment risks, mitigations, and contingency plans

## Workflow
1. Inventory current build status, outstanding tickets, and configuration drift.
2. Have each specialist evaluate their domain, calling out blockers with severity.
3. Formulate a deployment playbook including validation, launch, and rollback steps.
4. Deliver a clear recommendation (GO/NO-GO/CONDITIONAL) with rationale.

## Deliverables
- **Readiness Status** — overall recommendation with key justification
- **Risk Summary** — primary risks plus mitigations or owners
- **Deployment Plan** — ordered execution steps and rollback procedure
- **Monitoring & Post-Deploy** — health checks, alerts, and validation metrics
- **Next Actions** — remaining tasks to reach or maintain readiness

## Response Style
Be decisive and succinct. Lead with blockers before enhancements. Follow Codex formatting norms and cite any critical files or commands.

## Operational Notes
- Use planning to track the assessment workflow
- Avoid modifying production configuration files unless requested; focus on guidance
- Encourage creating tickets or runbook updates when significant gaps remain
