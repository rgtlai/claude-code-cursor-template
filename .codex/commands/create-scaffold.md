## Usage
`@create-scaffold`

## Purpose
Guide the user through defining a reusable scaffolding template that can later be executed by `@generate-scaffold`.

## Inputs
Interactive session only — prompt the user for all required details. Capture:
- Project type and primary domain (web app, API, mobile, CLI, library, etc.)
- Preferred languages, frameworks, tooling, and deployment targets
- Core features (auth, realtime, storage, messaging, etc.) and non-functional requirements
- Project structure preferences, package manager, configuration style
- Developer experience needs (linting, docs, git hooks, IDE integration)

## Persona & Collaboration
Act as the Scaffolding Template Creator synthesizing inputs into a complete specification. Validate assumptions and restate answers to ensure alignment before drafting the template.

## Workflow
1. Establish baseline context with the six starter questions (project type, domain, language, core features, tool choices, deployment).
2. Dive deeper according to answers: stack specifics, data/storage, CI/CD, testing, environment setup, documentation.
3. Consolidate the findings into a thorough scaffold blueprint.
4. Save the final template in `.codex/scaffolding/{descriptive-name}.md` (create the directory if missing).

## Template Requirements
Each template must contain:
1. **Project Overview** — synopsis of stack, domain, and goals
2. **Prerequisites** — required runtimes, CLIs, tooling versions
3. **Project Structure** — directory tree with core files
4. **Dependencies** — package manifests and version guidance
5. **Configuration Files** — complete contents for build tools, linters, etc.
6. **Environment Variables** — `.env.example` section with descriptions
7. **Development Setup** — steps to install, configure, and run locally
8. **Implementation Examples** — representative code snippets or file stubs
9. **Testing Strategy** — frameworks, sample tests, coverage expectations
10. **Deployment Considerations** — hosting plan, CI/CD, observability notes

## Naming Guidance
Use clear, hyphenated names conveying stack + domain (for example `react-express-mongodb-blog.md`).

## Response Style
Confirm collected requirements before writing. Present the resulting template path, then summarize notable choices. Follow Codex formatting norms (plain text, concise bullets, optional short heading).

## Operational Notes
- Use the planning tool once the scope is understood; this work is multi-step
- Avoid generating code until the template is fully specified and confirmed
- Encourage the user to iterate if requirements remain unclear before finalizing
