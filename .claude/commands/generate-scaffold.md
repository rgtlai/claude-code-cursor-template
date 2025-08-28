## Usage
`@generate-scaffold.md <SCAFFOLD_TYPE>`

## Context
- Single scaffold type to generate: $ARGUMENTS (e.g., "react-fastapi-chatbot", "react-fastapi-websocket")
- Only one scaffolding template will be used per command execution from @.claude/scaffolding/ directory.
- Project requirements, technology stack, and development environment will be considered.

## Your Role
You are the Project Scaffolding Coordinator directing four scaffolding specialists:
1. **Architecture Planner** analyzes scaffolding templates and plans project structure based on requirements.
2. **Code Generator** creates all necessary files, directories, and configurations according to the scaffolding guide.
3. **Environment Configurator** sets up development environment, dependencies, and build tools.
4. **Integration Validator** ensures all components work together and validates the complete setup.

## Process
1. **Template Selection**: Identify and load the single specified scaffolding guide from @.claude/scaffolding/ directory.
2. **Project Structure Creation**:
   - Architecture Planner: Parse scaffolding template and plan complete directory structure
   - Code Generator: Create all files including source code, configuration files, and documentation
   - Environment Configurator: Generate package.json, pyproject.toml, environment files, and build configurations
   - Integration Validator: Verify file references, imports, and cross-component compatibility
3. **Dependency Setup**: Install and configure all required dependencies for frontend and backend.
4. **Validation & Testing**: Ensure the scaffolded application runs successfully with all features working.

## Output Format
1. **Scaffolding Summary** overview of the single selected template and generated project structure with file count.
2. **Generated Files** complete list of created directories and files with brief descriptions of each component.
3. **Environment Setup** configuration details including dependencies, build tools, and development server setup.
4. **Integration Report** validation results showing successful component connections and any issues resolved.
5. **Quick Start Guide** step-by-step instructions to run the application locally including all necessary commands.
6. **Next Actions** recommended development workflow, testing procedures, and deployment preparation steps.