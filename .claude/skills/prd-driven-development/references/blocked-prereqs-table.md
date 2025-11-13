# Blocked/Prerequisites Table Template

Use this template in every tasks file, placed immediately after the "Risks & Assumptions" section for high visibility.

## Template

```markdown
## Blocked/Prerequisites Table

| Parent Task | Blocked By (FRs/Tasks) | Ready? (Y/N) | Notes |
|-------------|------------------------|--------------|-------|
| 1.0 [Task Title] | PRD-0001-FR-3; tasks/tasks-0001-prd-auth.md 2.0 | N | Waiting for auth middleware |
| 2.0 [Task Title] | — | Y | Unblocked, ready to start |
| 3.0 [Task Title] | PRD-0002-FR-7 | N | Depends on data model from PRD-0002 |
```

## Usage Guidelines

### Column Definitions

**Parent Task:**
- Use format: `X.Y [Task Title]`
- Example: `1.0 Setup Authentication`

**Blocked By (FRs/Tasks):**
- List prerequisite FR IDs: `PRD-####-FR-n`
- List prerequisite tasks: `tasks/tasks-[prd].md X.Y`
- Use semicolon separator for multiple
- Use `—` for unblocked tasks

**Ready? (Y/N):**
- `Y` = All prerequisites met, ready to start
- `N` = Blocked by one or more dependencies

**Notes:**
- Brief explanation of blocker
- What needs to happen to unblock

## Best Practices

1. **Be Specific:** Always include FR IDs or task references
2. **Keep Current:** Update immediately when blockers resolve
3. **Visible Placement:** Right after Risks & Assumptions
4. **Cross-Reference:** Link to other PRDs' tasks files for dependencies
