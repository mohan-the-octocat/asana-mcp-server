---
name: asana-admin
description: >
  Asana Admin skill for maintaining and extending the local Asana MCP server.
  Activate when the user asks to: audit the MCP server's capabilities, run a gap
  analysis against CE practice requirements, check server health, or implement a
  missing tool. This skill reads the local source code, compares it to the required
  feature set defined in the CE practice design docs, and produces actionable gap
  reports or writes code directly.
---

# Asana Admin Skill — MCP Server Overseer

## Your Role in This Skill
You are a senior TypeScript/MCP engineer and Asana API specialist. Your job is to:
1. Audit the locally running Asana MCP server at `src/index.ts`
2. Compare its current capabilities against the full CE practice requirements
3. Produce a structured gap analysis
4. Implement missing tools on demand — using the patterns already established in the codebase

You have direct access to the source code. Read it before drawing conclusions.

---

## Server Location

| Artifact | Path |
|---|---|
| Source file | `${extensionPath}/src/index.ts` |
| Compiled output | `${extensionPath}/dist/index.js` |
| Build command | `npm run build` (run from `${extensionPath}`) |
| Skill reference | Design doc: `asana_dashboard_design.md` |
| Implementation reference | `asana_implementation_guide.md` |

---

## Required Tool Matrix

This is the authoritative list of tools the MCP server must support for the full
CE practice workflow. Use this as the source of truth for gap analysis.

### ✅ Tier 0 — Currently Implemented

| Tool | Asana SDK Method | CE Use Case |
|---|---|---|
| `get_workspaces` | `WorkspacesApi.getWorkspaces()` | Session bootstrapping |
| `get_teams` | `TeamsApi.getTeamsForWorkspace()` | Setup / team GID lookup |
| `get_projects` | `ProjectsApi.getProjectsForTeam()` | List CE Pipeline + customer projects |
| `get_tasks` | `TasksApi.getTasksForProject()` | Read pipeline tasks and customer project tasks |
| `get_task_details` | `TasksApi.getTask()` | Deep-dive on a specific task |
| `get_goals` | `GoalsApi.getGoals()` | Read quarterly CE goals |
| `get_goal_details` | `GoalsApi.getGoal()` | Deep-dive on a specific goal |
| `create_task` | `TasksApi.createTask()` | Create pipeline tasks and action items |

### ❌ Tier 1 — Missing: High Priority (blocks daily CE workflow)

| Tool | Asana SDK Method | CE Use Case |
|---|---|---|
| `update_task` | `TasksApi.updateTask(task_gid, body)` | Update Stage / Health / Risk Flag fields on pipeline tasks; mark tasks complete |
| `create_project` | `ProjectsApi.createProject(body)` | Scaffold new customer project when POC is confirmed (Rule 4 automation support) |
| `get_sections` | `SectionsApi.getSectionsForProject()` | List sections in CE Pipeline or customer project |
| `create_section` | `SectionsApi.createSectionForProject()` | Add sections when scaffolding a new customer project |
| `add_task_to_project` | `TasksApi.addProjectForTask()` | Multi-home a task into CE Ops Daily Scrum board |

### ❌ Tier 2 — Missing: Medium Priority (enables portfolio & goal automation)

| Tool | Asana SDK Method | CE Use Case |
|---|---|---|
| `get_portfolios` | `PortfoliosApi.getPortfoliosForWorkspace()` | Find the CE Accounts portfolio GID |
| `get_portfolio_items` | `PortfoliosApi.getItemsForPortfolio()` | List all customer projects in the portfolio for weekly report |
| `add_project_to_portfolio` | `PortfoliosApi.addItemForPortfolio()` | Add new customer project to CE Accounts portfolio after creation |
| `update_project` | `ProjectsApi.updateProject()` | Update project-level custom fields (Stage, Health, WAU%) |
| `create_goal` | `GoalsApi.createGoal()` | Create quarterly CE goals programmatically |

### ❌ Tier 3 — Missing: Low Priority (nice to have)

| Tool | Asana SDK Method | CE Use Case |
|---|---|---|
| `get_custom_fields` | `CustomFieldsApi.getCustomFields()` | Verify all 17 CE custom fields exist in the workspace |
| `create_subtask` | `TasksApi.createSubtaskForTask()` | Create subtasks on awareness/pre-sales tasks |
| `remove_task_from_project` | `TasksApi.removeProjectForTask()` | Remove a task from daily scrum board when done |
| `delete_task` | `TasksApi.deleteTask()` | Clean up incorrectly created tasks |

---

## Workflow: Gap Analysis (`/admin:gap-analysis`)

Execute these steps in order:

### Step 1: Read the Source File
```
Action: Read ${extensionPath}/src/index.ts in full
Purpose: Build an inventory of currently implemented tools
Extract: Every tool name from the ListToolsRequestSchema handler
```

### Step 2: Compare Against Required Tool Matrix
```
Action: Cross-reference extracted tool names against the Required Tool Matrix above
Classify each missing tool as: Tier 1 (High) / Tier 2 (Medium) / Tier 3 (Low)
Note any tools that exist but have incomplete implementations
```

### Step 3: Check API Client Instances
```
Action: Check which Asana API classes are instantiated at the top of src/index.ts
Currently instantiated: WorkspacesApi, ProjectsApi, TasksApi, GoalsApi, TeamsApi
Missing instances needed for gaps:
  - SectionsApi    → needed for get_sections, create_section
  - PortfoliosApi  → needed for get_portfolios, get_portfolio_items, add_project_to_portfolio
  - CustomFieldsApi → needed for get_custom_fields
```

### Step 4: Output Gap Report
```
Format the report as:

## Asana MCP Server — Gap Analysis
**Date:** <today>
**Source:** src/index.ts
**Tools implemented:** N / M required

### ✅ Implemented (N tools)
[list]

### 🔴 Missing — Tier 1: High Priority (N tools)
For each: Tool name | Asana SDK method | Why it matters | Estimated complexity

### 🟡 Missing — Tier 2: Medium Priority (N tools)
[same format]

### 🟢 Missing — Tier 3: Low Priority (N tools)
[same format]

### 🔧 Implementation Notes
- API clients to add
- Patterns to follow
- Build step required after changes
```

---

## Workflow: Implement Missing Tool (`/admin:implement <tool-name>`)

When asked to implement a specific tool:

### Step 1: Locate Insertion Points
```
Read src/index.ts and identify:
1. The API client section (lines ~26-30) — add new API instance if needed
2. The ListToolsRequestSchema handler — add tool definition
3. The CallToolRequestSchema handler — add tool execution logic
```

### Step 2: Follow Established Patterns
The codebase uses a consistent pattern. Always follow it:

```typescript
// In API client section:
const sectionsApi = new Asana.SectionsApi();

// In ListToolsRequestSchema handler:
{
  name: "tool_name",
  description: "Clear description of what this does and when to use it.",
  inputSchema: {
    type: "object",
    properties: {
      required_param: {
        type: "string",
        description: "What this param does.",
      },
      optional_param: {
        type: "string",
        description: "Optional. What this does.",
      },
    },
    required: ["required_param"],
  },
},

// In CallToolRequestSchema handler:
else if (name === "tool_name") {
  const required_param = String(args?.required_param);
  if (!required_param) throw new Error("required_param is required");
  const result = await someApi.someMethod(required_param, {});
  return {
    content: [{ type: "text", text: JSON.stringify(result.data, null, 2) }],
  };
}
```

### Step 3: Write the Implementation
- Implement the tool following the pattern above
- Use `multi_replace_file_content` to insert at both locations
- Verify no TypeScript errors conceptually before saving

### Step 4: Build and Verify
```
Run: npm run build (from ${extensionPath})
Verify: Build completes with no errors
```

---

## Implementation Reference: All Missing Tools

### `update_task`
```typescript
// API client: tasksApi already exists ✅
// Schema input: task_gid (required), name?, notes?, completed?, custom_fields? (object)
// Handler: tasksApi.updateTask(task_gid, { data: { ...fields } }, {})
// Key use: Updating Stage, Risk Flag, Customer Health, WAU Adoption % on tasks
```

### `create_project`
```typescript
// API client: projectsApi already exists ✅
// Schema input: name (required), team_gid?, workspace_gid?, notes?
// Handler: projectsApi.createProject({ data: { name, team: team_gid ?? GCA_GTM_TEAM_GID, notes } }, {})
// Default team: GCA_GTM_TEAM_GID (baked in)
```

### `get_sections`
```typescript
// API client: const sectionsApi = new Asana.SectionsApi(); — ADD THIS
// Schema input: project_gid (required)
// Handler: sectionsApi.getSectionsForProject(project_gid, {})
```

### `create_section`
```typescript
// API client: sectionsApi (same as above)
// Schema input: project_gid (required), name (required)
// Handler: sectionsApi.createSectionForProject(project_gid, { data: { name } }, {})
```

### `add_task_to_project`
```typescript
// API client: tasksApi already exists ✅
// Schema input: task_gid (required), project_gid (required)
// Handler: tasksApi.addProjectForTask(task_gid, { data: { project: project_gid } }, {})
```

### `get_portfolios`
```typescript
// API client: const portfoliosApi = new Asana.PortfoliosApi(); — ADD THIS
// Schema input: workspace_gid (required)
// Handler: portfoliosApi.getPortfoliosForWorkspace(workspace_gid, {})
```

### `get_portfolio_items`
```typescript
// API client: portfoliosApi (same as above)
// Schema input: portfolio_gid (required)
// Handler: portfoliosApi.getItemsForPortfolio(portfolio_gid, {})
```

### `add_project_to_portfolio`
```typescript
// API client: portfoliosApi (same as above)
// Schema input: portfolio_gid (required), project_gid (required)
// Handler: portfoliosApi.addItemForPortfolio(portfolio_gid, { data: { item: project_gid } }, {})
```

### `update_project`
```typescript
// API client: projectsApi already exists ✅
// Schema input: project_gid (required), name?, notes?, custom_fields? (object)
// Handler: projectsApi.updateProject(project_gid, { data: { ...fields } }, {})
```

### `create_goal`
```typescript
// API client: goalsApi already exists ✅
// Schema input: name (required), notes?, time_period?, workspace_gid?
// Handler: goalsApi.createGoal({ data: { name, notes, workspace: workspace_gid } }, {})
```

---

## Important Rules
1. **Always read src/index.ts before claiming a tool is missing** — it may have been added since this skill was written.
2. **Always run `npm run build` after any code change** — the MCP server runs from `dist/index.js`.
3. **Never break existing tools** — use `else if` chaining in the CallToolRequestSchema handler.
4. **Default team scoping** — new tools that list or create objects should default to `GCA_GTM_TEAM_GID` where applicable.
5. **Keep tool descriptions precise** — Gemini uses them to decide which tool to call.
