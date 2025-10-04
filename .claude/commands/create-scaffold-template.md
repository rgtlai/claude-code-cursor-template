## Usage
`@create-scaffold-template`

## Context
This command helps you create a new custom scaffolding template that can be used with @generate-scaffold.md. The interactive process will gather your requirements and generate a comprehensive scaffolding guide in the `./scaffolding/` directory. Use TodoWrite tool to track the template creation process.

## Your Role
You are a Scaffolding Template Creator helping users design custom application scaffolds. You will guide users through defining their project requirements and generate a complete scaffolding template.

## Process
1. **Project Type Discovery**: Ask the user what type of application they want to scaffold:
   - Web application (frontend-only, full-stack, API-only)
   - Mobile application (React Native, Flutter, native)
   - Desktop application (Electron, Tauri, native)
   - Library/package (JavaScript, Python, Rust, etc.)
   - CLI tool
   - Other (specify)

2. **Technology Stack Selection**: Based on project type, ask about:
   - **Frontend**: React, Vue, Angular, Svelte, vanilla JS/HTML/CSS, etc.
   - **Backend**: Node.js, Python (FastAPI/Django/Flask), Go, Rust, Java, etc.
   - **Database**: PostgreSQL, MySQL, MongoDB, SQLite, Redis, etc.
   - **Styling**: CSS, Tailwind, Bootstrap, Material-UI, styled-components, etc.
   - **State Management**: Redux, Zustand, Pinia, MobX, etc.
   - **Build Tools**: Vite, Webpack, Rollup, Parcel, etc.

3. **Feature Requirements**: Ask about core features and functionality:
   - Authentication (JWT, OAuth, sessions)
   - Real-time features (WebSocket, SSE, polling)
   - File upload/storage
   - Email/notifications
   - Testing setup (unit, integration, e2e)
   - CI/CD preferences
   - Deployment targets (Docker, Vercel, AWS, etc.)

4. **Project Structure Preferences**: Ask about:
   - Monorepo vs separate repositories
   - Package manager preferences (npm, pnpm, yarn, uv, cargo, etc.)
   - Code organization patterns
   - Configuration file preferences

5. **Development Environment**: Ask about:
   - IDE/editor integrations
   - Linting and formatting tools
   - Git hooks and pre-commit setup
   - Documentation preferences

## Template Generation
After gathering all requirements, create a comprehensive scaffolding template file in `./scaffolding/` with the following structure:

1. **Project Overview** - Summary of the stack and features
2. **Prerequisites** - Required tools and versions
3. **Project Structure** - Complete directory/file layout
4. **Dependencies** - All package.json, pyproject.toml, Cargo.toml, etc.
5. **Configuration Files** - Complete configuration for all tools
6. **Environment Variables** - .env.example with all required variables
7. **Development Setup** - Step-by-step setup instructions
8. **Implementation Examples** - Key file contents and patterns
9. **Testing Strategy** - Test setup and examples
10. **Deployment Considerations** - Production setup guidance

## Questions to Ask
Start by asking these key questions in order:

1. "What type of application are you looking to scaffold?" (web app, mobile, library, CLI, etc.)
2. "What's the main purpose or domain of this application?" (e.g., e-commerce, blog, dashboard, API)
3. "Do you prefer a specific programming language or technology stack?"
4. "What are the core features this application should support?"
5. "Do you have preferences for specific tools, frameworks, or libraries?"
6. "What's your target deployment environment?" (local, cloud, containers, etc.)

## Output Format
After gathering requirements, create a comprehensive scaffolding template file:
- Filename: `{descriptive-name}.md` in `./scaffolding/` directory
- Content: Complete project specification for @generate-scaffold.md to execute
- Include: All file structures, configurations, dependencies, and setup instructions

Be thorough. The template should enable fully automated project generation.

## Template Naming Convention
Use descriptive names like:
- `react-express-mongodb-blog.md`
- `vue-fastapi-postgres-dashboard.md`
- `flutter-firebase-social-app.md`
- `rust-cli-tool.md`
- `python-data-science-library.md`

The template should include everything needed to generate a production-ready project structure with proper configuration, documentation, and development setup.