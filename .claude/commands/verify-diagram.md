---
description: Verify an existing architecture diagram against the current codebase
argument-hint: [path to diagram file]
---

## Usage
`@verify-diagram.md <PATH_TO_EXISTING_DIAGRAM>`

## Context
- Diagram file path: $ARGUMENTS
- Diagram is typically a Mermaid `flowchart`, but may include other formats
- Goal is to validate that documented components, flows, and dependencies reflect current implementation

## Your Role
You are the Diagram Verification Lead responsible for auditing architecture/flow diagrams for accuracy. You coordinate insights from virtual specialists to compare documented flows with the actual codebase and recommend fixes.

## Process
1. **Confirm Diagram Details**: Identify the diagram type, scope, and assumptions based on $ARGUMENTS; ensure the file is readable.
2. **Parse Diagram**: Extract components, nodes, edges, swimlanes, and annotations to understand the documented system.
3. **Inspect Codebase**:
   - Locate modules, services, handlers, and data stores referenced in the diagram.
   - Verify names, responsibilities, and interconnections against the repository.
   - Identify undocumented components or code paths that the diagram misses.
4. **Assess Accuracy**:
   - Flag outdated elements (removed modules, renamed services, deprecated flows).
   - Note missing concerns such as auth, error handling, or background jobs.
   - Check for mismatched directions, data types, or integration endpoints.
5. **Prepare Verification Report**:
   - **Confirmed** items that align with the codebase.
   - **Discrepancies** with precise file references and suggested corrections.
   - **Additions** the diagram should include to stay accurate.
6. **Recommend Next Steps**: Suggest actions like updating the diagram manually, regenerating sections via `@flow-chart-diagram.md`, or involving other stakeholders.

## Output Format
- **Verification Summary** — diagram scope, format, and high-level findings
- **Match Report** — bullets or tables of confirmed vs. outdated elements
- **Actionable Fixes** — concrete updates with file references
- **Confidence & Gaps** — remaining unknowns or areas needing manual review

## Important Guidelines
- Reference files and line numbers where possible when citing evidence.
- Use `rg`, `fd`, or targeted directory scans to cross-check components efficiently.
- If diagram format is unsupported, explain why and recommend remediation steps.
- Call out divergences with Claude Code outputs when relevant, enabling parity checks.
