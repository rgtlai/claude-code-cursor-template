## Usage
`@flow-chart-diagram [TARGET_PATH ...]`

## Purpose
Inspect the specified application areas and generate Markdown flowchart files (Mermaid syntax) that communicate the system’s architecture, data flow, and key interactions. The command must write the chart files to disk; do not only print them in chat.

## Inputs
- Zero arguments: analyze the current working directory
- One argument: analyze the supplied subdirectory
- Multiple arguments: produce a separate flowchart for each path
- Confirm directory structure up front so the user knows what you will inspect

## Workflow
1. Resolve the analysis scope, list its top-level structure, and note major components.
2. Examine entry points, routing/navigation, business logic, persistence models, external integrations, and asynchronous jobs.
3. Draft a Mermaid flowchart adhering to the standards below; split large systems into multiple focused charts when clarity requires it.
4. For each chart:
   - If no path is specified, save it to `./diagrams/{target-name}-flow.md` (create `./diagrams/` if it does not exist).
   - If a path is specified, save it to `{path}/diagrams/{target-name}-flow.md` (create `{path}/diagrams/` if it does not exist).
   - Summarize findings in the response.

## Mermaid Standards
- Shapes: `([Rounded])` entry/exit, `[Rectangle]` processes, `{Diamond}` decisions, `[(Database)]` data stores, `[[Subroutine]]` external services, `[/Parallelogram/]` I/O.
- Connectors: `-->` normal flow, `-.->` async/background, `==>` primary path, `--x` error path.
- Styling: use `style` directives — frontend `#e1f5ff`, backend `#fff4e1`, data `#e8f5e9`, external `#fce4ec`, auth/security `#f3e5f5`.
- Node labels must be plain English without `% { } # @ ^ & *` or code/regex syntax. Prefer short descriptive phrases.

## Chart Organization
Cover, at minimum:
1. User/System entry points
2. Authentication or access control (if applicable)
3. Core application workflow (happy path + key branches)
4. Data persistence and propagation
5. External services and background jobs
Include error handling where relevant and add a brief legend when helpful.

## Deliverables
- Create one Markdown file per analyzed target containing the Mermaid diagram and supporting notes
- In the chat response, state what was analyzed, list generated file paths, embed the Mermaid code, and mention notable architectural observations or improvement ideas

## Response Style
Open with a one-line summary (“Analyzed …”). Present diagrams and commentary using Codex formatting norms (plain text, short headings/bullets). Keep instructions actionable for a teammate reviewing the chart.

## Operational Notes
- Use planning to manage multi-target analyses
- When information is insufficient, ask follow-up questions before generating diagrams
- Ensure file writes stay within the workspace; never overwrite existing documentation without confirmation
