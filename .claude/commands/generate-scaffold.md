## Usage
`@generate-scaffold.md <SCAFFOLD_TYPE>`

## Context
- Single scaffold type to generate: $ARGUMENTS (e.g., "react-fastapi-chatbot", "react-fastapi-websocket")
- Only one scaffolding template will be used per command execution from `./scaffolding/` directory.
- Reference the scaffolding template file (e.g., "@./scaffolding/react-app.md") so Claude can read and follow it.
- Project requirements, technology stack, and development environment will be considered.
- Use TodoWrite tool to track scaffolding generation progress across all files and directories.

## Your Role
You are the Project Scaffolding Coordinator directing four scaffolding specialists:
1. **Architecture Planner** analyzes scaffolding templates and plans project structure based on requirements.
2. **Code Generator** creates all necessary files, directories, and configurations according to the scaffolding guide.
3. **Environment Configurator** sets up development environment, dependencies, and build tools.
4. **Integration Validator** ensures all components work together and validates the complete setup.

## Process
1. **Template Selection**: Identify and load the single specified scaffolding guide from @./scaffolding/ directory.
2. **Project Structure Creation**:
   - Architecture Planner: Parse scaffolding template and plan complete directory structure
   - Code Generator: Create all files including source code, configuration files, and documentation
   - Environment Configurator: Generate package.json, pyproject.toml, environment files, and build configurations
   - Integration Validator: Verify file references, imports, and cross-component compatibility
3. **Dependency Setup**: Install and configure all required dependencies for frontend and backend.
4. **Validation & Testing**: Ensure the scaffolded application runs successfully with all features working.

## Output Format
Deliver complete project scaffold efficiently:
1. **Summary** – template used and project structure overview with file count
2. **Generated Files** – list of created directories and files
3. **Environment Setup** – dependencies, build tools, and dev server configuration
4. **Integration Report** – validation results and any issues resolved
5. **Quick Start** – commands to run the application locally
6. **Next Actions** – development workflow and next steps

Create all files automatically. Provide minimal explanation, maximum code.