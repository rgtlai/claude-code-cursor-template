---
description: Generate a detailed task list from a PRD file
argument-hint: [path to PRD file]
---

Generate a detailed, step-by-step task list in Markdown format based on the Product Requirements Document (PRD) at: $ARGUMENTS

# Process to Follow

## Step 1: Receive PRD Reference
The user will provide a path to a PRD file as the argument. Read and analyze this PRD thoroughly.

## Step 2: Analyze PRD and Codebase
1. Read and analyze the functional requirements, user stories, and other sections of the specified PRD.
2. Review the existing codebase to understand:
   - Existing infrastructure, architectural patterns, and conventions
   - Existing components or features that could be relevant to the PRD requirements
   - Related files, components, and utilities that can be leveraged or need modification

## Step 3: Generate Parent Tasks (Phase 1)
1. **Create the output file**: `tasks-[prd-file-name].md` in the `/tasks/` directory immediately
   - Where `[prd-file-name]` matches the base name of the input PRD file (e.g., if the input was `0001-prd-user-profile-editing.md`, the output is `tasks-0001-prd-user-profile-editing.md`)
2. **Populate initial structure** with "Relevant Files" and "Tasks" sections
3. Based on the PRD analysis and current state assessment, generate the main, high-level tasks required to implement the feature. Use your judgment on how many high-level tasks to use (typically about five tasks).
4. Present these tasks to the user in the specified format (without sub-tasks yet) and inform the user:
   **"I have generated the high-level tasks based on the PRD. Ready to generate the sub-tasks? Respond with 'Go' to proceed."**

## Step 4: Wait for Confirmation
Pause and wait for the user to respond with "Go" before proceeding.

## Step 5: Generate Sub-Tasks (Phase 2)
Once the user confirms, break down each parent task into smaller, actionable sub-tasks necessary to complete the parent task. Ensure sub-tasks:
- Logically follow from the parent task
- Cover the implementation details implied by the PRD
- Consider existing codebase patterns where relevant without being constrained by them

## Step 6: Identify Relevant Files
Based on the tasks and PRD, identify potential files that will need to be created or modified. List these under the Relevant Files section, including corresponding test files if applicable.

## Step 7: Generate Final Output
Consolidate all information (relevant files, notes, parent tasks, and sub-tasks) into the output file created in Step 3, ensuring the format matches the structure specified below.

# Output Format

The generated task list must follow this structure:

## Relevant Files

- `path/to/potential/file1.ts` - Brief description of why this file is relevant (e.g., Contains the main component for this feature).
- `path/to/file1.test.ts` - Unit tests for `file1.ts`.
- `path/to/another/file.tsx` - Brief description (e.g., API route handler for data submission).
- `path/to/another/file.test.tsx` - Unit tests for `another/file.tsx`.
- `lib/utils/helpers.ts` - Brief description (e.g., Utility functions needed for calculations).
- `lib/utils/helpers.test.ts` - Unit tests for `helpers.ts`.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [ ] 1.0 Parent Task Title
  - [ ] 1.1 [Sub-task description 1.1]
  - [ ] 1.2 [Sub-task description 1.2]
- [ ] 2.0 Parent Task Title
  - [ ] 2.1 [Sub-task description 2.1]
- [ ] 3.0 Parent Task Title (may not require sub-tasks if purely structural or configuration)

# Important Guidelines

- **Target Audience**: Write for a junior developer who will implement the feature with awareness of the existing codebase context.
- **Interaction Model**: The process explicitly requires a pause after generating parent tasks to get user confirmation ("Go") before proceeding to generate the detailed sub-tasks. This ensures the high-level plan aligns with user expectations before diving into details.
