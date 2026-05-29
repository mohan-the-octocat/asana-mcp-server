# Specification: Fix input validation and error handling for missing arguments in all tools

## 1. Goal
Ensure all MCP tools in the Asana MCP Server validate required parameters correctly. When a required parameter is missing, the tool must throw a validation error (e.g., `"workspace_gid is required"`).

## 2. Problem Description
Currently, tool argument extraction uses `String(args?.param_name)`. If a parameter is missing from the request arguments, `args?.param_name` is `undefined`, and `String(undefined)` evaluates to the string `"undefined"`. 
This results in:
- Validation checks like `if (!workspace_gid)` evaluating to `false` (since `"undefined"` is truthy).
- Bypassing the intended missing parameter error.
- Making incorrect API calls to Asana (e.g., sending `"undefined"` as a GID) or encountering runtime TypeErrors (e.g. `Cannot read properties of undefined (reading 'data')`).

## 3. Solution
Replace direct `String(args?.param_name)` conversion for required parameters with safe extraction:
```typescript
const param = args?.param_name ? String(args.param_name) : "";
```
This ensures that if the parameter is missing, it evaluates to `""` (falsy), triggering validation checks:
```typescript
if (!param) throw new Error("param_name is required");
```

## 4. Affected Tools and Required Arguments
1. **get_teams**: `workspace_gid`
2. **get_tasks**: `project_gid`
3. **get_task_details**: `task_gid`
4. **get_goal_details**: `goal_gid`
5. **get_sections**: `project_gid`
6. **get_custom_fields**: `workspace_gid`
7. **create_task**: `workspace_gid`, `name`
8. **create_subtask**: `parent_task_gid`, `name`
9. **update_task**: `task_gid`
10. **create_section**: `project_gid`, `name`
11. **create_custom_field**: `workspace_gid`, `name`, `field_type`
12. **create_project_from_template**: `template_gid`, `name`
13. **scaffold_project_from_definition**: `workspace_gid`, `definition`
