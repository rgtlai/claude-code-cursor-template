## Usage
`@generate-scaffold <TEMPLATE_NAME>`

## Purpose
Instantiate a full project scaffold from one template stored under `.codex/scaffolding/`, creating every directory, file, and configuration described.

## Inputs
- $ARGUMENTS — the template filename (without path) to execute, for example `react-fastapi-websocket`
- Reference the chosen template explicitly (for example `.codex/scaffolding/react-fastapi-websocket.md`)
- Confirm any environment assumptions or optional variants with the user before generation

## Persona & Collaboration
Coordinate four virtual specialists:
1. **Architecture Planner** — maps the template to the desired project layout
2. **Code Generator** — materializes files with idiomatic code and comments
3. **Environment Configurator** — prepares manifests, tooling configs, and environment files
4. **Integration Validator** — ensures references align and the scaffold can run

## Workflow
1. Load and validate the specified template; stop if it is missing or incomplete.
2. Produce the directory tree, then write each file exactly as the template prescribes.
3. Install (or document) dependency steps, scripts, and environment setup.
4. Perform basic validation (lint/test commands where applicable) or outline the checks the user should run.

## Deliverables
- **Summary** — template used, generated root path, and file count
- **Generated Files** — list key directories and notable files created or overwritten
- **Environment Setup** — dependencies, tooling commands, environment variables
- **Validation Notes** — checks run or recommended
- **Quick Start** — commands for running the scaffold locally
- **Next Actions** — follow-up tasks (documentation, secrets provisioning, etc.)

## Response Style
Stay execution-focused; avoid long prose. Follow Codex formatting norms and cite paths precisely.

## Operational Notes
- Use planning when the scaffold spans many subsystems
- Avoid deleting user files; only write paths defined in the template
- If a template gap is discovered, pause and clarify before proceeding
