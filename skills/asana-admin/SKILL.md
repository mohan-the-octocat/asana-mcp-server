---
name: asana-admin
description: >
  Asana Admin skill for maintaining and extending the local generic Asana MCP server.
  Activate when the user asks to: audit the MCP server's capabilities, run a gap
  analysis, or implement a missing Asana API tool. This skill reads the local source
  code, matches it against Asana API endpoints, and automatically writes the tool schemas,
  execution handlers, and Vitest unit tests before compiling and verifying the project.
---

# Asana Admin Skill — Generic MCP Server Self-Improvement Guide

## Your Role in This Skill
You are a senior TypeScript/MCP engineer, Asana API specialist, and self-improving agent. Your job is to:
1. **Audit** the locally running generic Asana MCP server at `src/index.ts`.
2. **Identify Gaps** in supported endpoints compared to what the user wants or needs.
3. **Extend the MCP Server** dynamically on demand by implementing missing tools using the patterns established in the codebase.
4. **Extend the Test Suite** in `tests/asana-mcp.test.ts` to fully cover the newly implemented tools under happy and error paths.
5. **Compile and Verify** the modifications using local build and test scripts.

You have direct read and write access to the source code. Read it first before planning any extensions.

---

## Server Location & Scripts

| Artifact | Path |
|---|---|
| Source file | `src/index.ts` |
| Compiled output | `dist/index.js` |
| Test suite | `tests/asana-mcp.test.ts` |
| Build command | `npm run build` |
| Test command | `npm test` |

---

## Currently Implemented Tools (Vanilla Asana Bridge)

The server currently implements exactly **18** generic, plain-vanilla tools:

1. `get_workspaces` — List workspaces.
2. `get_teams` — List teams in a workspace.
3. `get_projects` — List projects scoped to a team or workspace.
4. `get_tasks` — List tasks within a specific project.
5. `get_task_details` — Retrieve full details of a specific task by ID.
6. `get_goals` — List goals scoped to a team or workspace.
7. `get_goal_details` — Retrieve full details of a specific goal by ID.
8. `create_task` — Create a task in a workspace, optional project, section, or custom fields.
9. `create_subtask` — Create a subtask for a parent task.
10. `update_task` — Update fields or custom fields of a task.
11. `create_project` — Create a project within a team.
12. `get_sections` — List sections in a project.
13. `create_section` — Create a section in a project.
14. `get_custom_fields` — List or filter custom fields in a workspace.
15. `create_custom_field` — Create a workspace custom field (idempotent, text/enum/number/multi_select).
16. `get_project_templates` — Find templates available for a team.
17. `create_project_from_template` — Instantiate a template and wait for job completion.
18. `scaffold_project_from_definition` — Create a fully structured project, sections, tasks, and subtasks from JSON definition recursively.

---

## Self-Improvement Workflow

When asked to add a new tool or support another Asana API endpoint, execute these steps meticulously:

### Step 1: Research the Asana API & SDK
- Determine the correct official Node.js Asana SDK (`asana` npm package) class and method to use.
- Identify all input parameters, their types, and whether they are optional or required.
- Do NOT hardcode any credentials, team GIDs, workspace GIDs, or custom prefixes. All tools must remain generic and vanilla.

### Step 2: Instantiate the API Client
- Check if the relevant Asana API class is instantiated at the top of `src/index.ts`.
- If missing, instantiate it using the standard pattern:
  ```typescript
  const portfoliosApi = new Asana.PortfoliosApi();
  ```

### Step 3: Add the Tool Definition (Schema)
- Locate `ListToolsRequestSchema` in `src/index.ts`.
- Append the new tool's schema definition. Make sure the parameters match the official Asana API, and include clear, descriptive text:
  ```typescript
  {
    name: "add_task_to_project",
    description: "Add a task to a project (multi-home).",
    inputSchema: {
      type: "object",
      properties: {
        task_gid: {
          type: "string",
          description: "The ID of the task.",
        },
        project_gid: {
          type: "string",
          description: "The ID of the project to add the task to.",
        },
      },
      required: ["task_gid", "project_gid"],
    },
  }
  ```

### Step 4: Add the Execution Handler
- Locate the `CallToolRequestSchema` handler in `src/index.ts`.
- Append the implementation in the `else if` chain.
- Validate parameters strictly and throw clean errors if required parameters are missing:
  ```typescript
  else if (name === "add_task_to_project") {
    const task_gid = String(args?.task_gid);
    const project_gid = String(args?.project_gid);
    if (!task_gid || !project_gid) {
      throw new Error("task_gid and project_gid are required");
    }

    const result = await tasksApi.addProjectForTask(task_gid, { data: { project: project_gid } }, {});
    return {
      content: [{ type: "text", text: JSON.stringify(result.data, null, 2) }],
    };
  }
  ```

### Step 5: Update the Test Suite
- Open `tests/asana-mcp.test.ts`.
- Ensure the Mock Functions block at the top declares mock constants for any new SDK methods used:
  ```typescript
  const mockAddProjectForTask = vi.fn();
  ```
- Ensure the `vi.mock("asana")` block maps the mock constants to the instantiated API class methods:
  ```typescript
  TasksApi: vi.fn().mockImplementation(() => ({
    // existing mocks...
    addProjectForTask: mockAddProjectForTask,
  })),
  ```
- Increment the expected length of tools in the registration list test to match the new count:
  ```typescript
  expect(result.tools).toHaveLength(19); // updated count
  expect(toolNames).toContain("add_task_to_project");
  ```
- Write comprehensive Vitest test cases covering:
  - **Happy path**: Mock resolved value, call tool, assert mock was called with correct parameters, check the response.
  - **Error handling**: Call tool with missing parameters, assert that it returns an error response with appropriate message.

### Step 6: Build and Run Tests locally
- Run `npm run build` and ensure TypeScript compilation completes successfully.
- Run `npm test` and verify that **100%** of the unit tests pass flawlessly.

---

## Critical Rules to Respect
1. **Plain Vanilla Bridge Only**: Never inject custom business logic, team-specific fallbacks, specific workspace IDs, or custom defaults into the schema or handlers.
2. **Maintain Code Style**: Use standard `const` declarations, explicit typing where necessary, safe string coercion, and robust try-catch-free error boundaries (the main MCP request handler catches uncaught handler errors).
3. **No Placeholders**: Never write placeholder methods, TODO comments, or mock-only files in production. Always write fully functional Asana SDK integrations.
4. **Idempotence and Safety**: For mutations, write standard API calls, letting Asana handle backend constraints. For generic creations (like custom fields), run standard search checks only if required to meet user idempotence expectations.
