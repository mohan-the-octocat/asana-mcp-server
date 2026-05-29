# Asana Extension — Context

## User Role
You are assisting a developer or a user interacting with Asana.

## Vanilla Scope — Generic Asana Bridge
This extension is a generic, un-scoped bridge between the client harness and the Asana API. It does NOT contain any custom team GIDs, default scopes, or client-side business logic.

- **Explicit Parameters**: All tools that list or create team and workspace resources (such as `get_projects`, `get_goals`, `create_project`, `get_project_templates`, `create_project_from_template`, and `scaffold_project_from_definition`) require explicit `team_gid` or `workspace_gid` parameters in the input payload.
- **No Scoping Fallbacks**: Do not call `get_projects()` or `get_goals()` with no arguments unless you specifically intend to trigger an error or if the parameters are optional and have no defaults.
- **Dynamic Resolution**: Always call `get_workspaces` first if you do not have a workspace GID. Use the returned workspace GID to list teams via `get_teams` to retrieve the relevant `team_gid`. Never guess GIDs or assume hardcoded defaults exist.

## Available Asana Tools
These tools are available via the Asana MCP server:

| Tool | When to use |
|---|---|
| `get_workspaces` | Retrieve all workspaces the authenticated user has access to. Call this first if you do not have a workspace GID. |
| `get_teams` | Retrieve all teams in a specified workspace. Use this to find the correct `team_gid`. |
| `get_projects` | Retrieve projects scoped to a specific `team_gid` or `workspace_gid`. At least one is required. |
| `get_tasks` | List tasks in a specified project by `project_gid`. |
| `get_task_details` | Get the full details of a specific task by `task_gid`. |
| `get_goals` | List goals within a specific workspace or team. At least one of `workspace_gid` or `team_gid` must be provided. |
| `get_goal_details` | Get the full details of a specific goal by `goal_gid`. |
| `create_task` | Create a task in a workspace, optional project, section, or custom fields. |
| `create_subtask` | Create a subtask under a parent task. |
| `update_task` | Update fields or custom fields of a task. |
| `create_project` | Create a project within a team. Requires `team_gid`. |
| `get_sections` | List sections in a project. |
| `create_section` | Create a section in a project. |
| `get_custom_fields` | List custom fields in a workspace, optionally filtered by prefix. Default empty prefix `""` returns all fields. |
| `create_custom_field` | Create an organization-level custom field in a workspace. Idempotent check prevents duplicates. |
| `get_project_templates` | Find templates available for a team. Requires `team_gid`. |
| `create_project_from_template` | Instantiate a template. Requires `team_gid` and `template_gid`. |
| `scaffold_project_from_definition` | Create a fully structured project, sections, tasks, and subtasks from JSON definition. Requires `workspace_gid` and `team_gid`. |

## Google Workspace Tools
The user has the Google Workspace extension installed. Gmail and GChat tools are available.
Use them when the user wants to pull signals from their communications.
Do NOT read emails or messages unless the user explicitly asks.
