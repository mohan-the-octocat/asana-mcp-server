import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as Asana from "asana";
import process from "process";

// Get Asana Access Token
const ASANA_ACCESS_TOKEN = process.env.ASANA_ACCESS_TOKEN;
if (!ASANA_ACCESS_TOKEN) {
  console.error("ASANA_ACCESS_TOKEN environment variable is required.");
  process.exit(1);
}

// GCA GTM Team GID — baked into the extension manifest as an env var.
// Fallback constant ensures scoping works even if the env var is missing.
const GCA_GTM_TEAM_GID = process.env.GCA_GTM_TEAM_GID ?? "1213807836434813";

// Initialize Asana Client
const client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = ASANA_ACCESS_TOKEN;

const workspacesApi = new Asana.WorkspacesApi();
const projectsApi = new Asana.ProjectsApi();
const tasksApi = new Asana.TasksApi();
const goalsApi = new Asana.GoalsApi();
const teamsApi = new Asana.TeamsApi();
const sectionsApi = new Asana.SectionsApi();
const customFieldsApi = new Asana.CustomFieldsApi();
const projectTemplatesApi = new Asana.ProjectTemplatesApi();

// Initialize MCP Server
const server = new Server(
  {
    name: "asana-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_workspaces",
        description: "List all workspaces the authenticated user has access to.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_teams",
        description: "List all teams in a workspace. Only needed for initial setup to find the GCA GTM Team GID — which should already be stored in GCA_GTM_TEAM_GID env var after installation.",
        inputSchema: {
          type: "object",
          properties: {
            workspace_gid: {
              type: "string",
              description: "The ID (gid) of the workspace.",
            },
          },
          required: ["workspace_gid"],
        },
      },
      {
        name: "get_projects",
        description: "List projects scoped to a team or workspace. Defaults to the pre-configured GCA GTM Team (GCA_GTM_TEAM_GID env var) when no team_gid is provided — no extra API call needed. Pass workspace_gid to fall back to a full workspace scan.",
        inputSchema: {
          type: "object",
          properties: {
            workspace_gid: {
              type: "string",
              description: "The ID (gid) of the workspace. Only needed if querying all workspace projects.",
            },
            team_gid: {
              type: "string",
              description: "The ID (gid) of the team. Defaults to GCA GTM Team if omitted.",
            },
          },
        },
      },
      {
        name: "get_tasks",
        description: "List tasks within a specific project.",
        inputSchema: {
          type: "object",
          properties: {
            project_gid: {
              type: "string",
              description: "The ID (gid) of the project.",
            },
          },
          required: ["project_gid"],
        },
      },
      {
        name: "get_task_details",
        description: "Retrieve full details of a specific task by ID.",
        inputSchema: {
          type: "object",
          properties: {
            task_gid: {
              type: "string",
              description: "The ID (gid) of the task.",
            },
          },
          required: ["task_gid"],
        },
      },
      {
        name: "get_goal_details",
        description: "Retrieve full details of a specific goal by ID.",
        inputSchema: {
          type: "object",
          properties: {
            goal_gid: {
              type: "string",
              description: "The ID (gid) of the goal.",
            },
          },
          required: ["goal_gid"],
        },
      },
      {
        name: "get_goals",
        description: "List goals within a specific workspace or team.",
        inputSchema: {
          type: "object",
          properties: {
            workspace_gid: {
              type: "string",
              description: "The ID (gid) of the workspace. Optional if team is provided.",
            },
            team_gid: {
              type: "string",
              description: "The ID (gid) of the team. Optional if workspace is provided.",
            },
          },
        },
      },
      {
        name: "create_task",
        description: "Create a new task in a project. Supports placing the task in a specific section and setting custom field values. Use this for creating pipeline tasks (Awareness, Pre-Sales) in CE Pipeline.",
        inputSchema: {
          type: "object",
          properties: {
            workspace_gid: {
              type: "string",
              description: "The ID (gid) of the workspace.",
            },
            name: {
              type: "string",
              description: "The name of the task.",
            },
            notes: {
              type: "string",
              description: "The notes or description of the task.",
            },
            project_gid: {
              type: "string",
              description: "ID (gid) of the project to add the task to.",
            },
            section_gid: {
              type: "string",
              description: "Optional. ID (gid) of the section to place the task in. Use get_sections to find section GIDs.",
            },
            custom_fields: {
              type: "object",
              description: "Optional. Key-value pairs of custom field GIDs to values. E.g. {\"1234\": \"Pre-Sales\", \"5678\": \"500000\"}. Use get_custom_fields to find field GIDs.",
            },
            is_milestone: {
              type: "boolean",
              description: "Optional. Set to true to create the task as a Milestone in Asana (resource_subtype=milestone). Default: false.",
            },
            due_on: {
              type: "string",
              description: "Optional. Due date in YYYY-MM-DD format (e.g. '2025-06-15'). Compute from TODAY + due_date_offset_days defined in the task template JSON.",
            },
          },
          required: ["workspace_gid", "name"],
        },
      },
      {
        name: "create_subtask",
        description: "Create a subtask under an existing parent task. Use this to add checklist items (Awareness session steps, Pre-Sales workflow steps) under a parent opportunity task.",
        inputSchema: {
          type: "object",
          properties: {
            parent_task_gid: {
              type: "string",
              description: "The ID (gid) of the parent task.",
            },
            name: {
              type: "string",
              description: "The name of the subtask.",
            },
            notes: {
              type: "string",
              description: "Optional notes or description for the subtask.",
            },
            custom_fields: {
              type: "object",
              description: "Optional. Key-value pairs of custom field GIDs to values.",
            },
            due_on: {
              type: "string",
              description: "Optional. Due date in YYYY-MM-DD format. Compute from TODAY + due_date_offset_days defined in the task template JSON.",
            },
          },
          required: ["parent_task_gid", "name"],
        },
      },
      {
        name: "update_task",
        description: "Update an existing task's fields including name, notes, completion status, and custom field values. Use this to update Stage, Risk Flag, Customer Health, WAU Adoption % on pipeline tasks and customer project tasks.",
        inputSchema: {
          type: "object",
          properties: {
            task_gid: {
              type: "string",
              description: "The ID (gid) of the task to update.",
            },
            name: {
              type: "string",
              description: "Optional new name for the task.",
            },
            notes: {
              type: "string",
              description: "Optional new notes for the task.",
            },
            completed: {
              type: "boolean",
              description: "Optional. Set to true to mark the task complete.",
            },
            custom_fields: {
              type: "object",
              description: "Optional. Key-value pairs of custom field GIDs to their new values. E.g. {\"1234\": \"Hyper-Care\"}. Use get_custom_fields to find field GIDs.",
            },
          },
          required: ["task_gid"],
        },
      },
      {
        name: "create_project",
        description: "Create a new Asana project in the GCA GTM Team. Use this when a Pre-Sales opportunity is confirmed for POC — creates the Tier 2 customer project. Defaults to GCA GTM Team.",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "The name of the project (e.g. the customer name).",
            },
            notes: {
              type: "string",
              description: "Optional description of the project.",
            },
            team_gid: {
              type: "string",
              description: "Optional. Defaults to GCA GTM Team (GCA_GTM_TEAM_GID env var).",
            },
            color: {
              type: "string",
              description: "Optional project color (e.g. 'light-green', 'light-blue', 'light-red').",
            },
          },
          required: ["name"],
        },
      },
      {
        name: "get_sections",
        description: "List all sections in a project. Use this to find section GIDs needed for placing tasks in specific sections (e.g. Awareness Sessions, Pre-Sales, POC, Hyper-Care).",
        inputSchema: {
          type: "object",
          properties: {
            project_gid: {
              type: "string",
              description: "The ID (gid) of the project.",
            },
          },
          required: ["project_gid"],
        },
      },
      {
        name: "create_section",
        description: "Create a new section in a project. Use this when scaffolding a new customer project to add POC, Hyper-Care, Steady-State, and Archive sections.",
        inputSchema: {
          type: "object",
          properties: {
            project_gid: {
              type: "string",
              description: "The ID (gid) of the project to add the section to.",
            },
            name: {
              type: "string",
              description: "The name of the section (e.g. '🧪 POC', '🚀 Hyper-Care').",
            },
          },
          required: ["project_gid", "name"],
        },
      },
      {
        name: "get_custom_fields",
        description: "List custom fields in the workspace filtered by a name prefix. Defaults to prefix='GCA_GTM_' so only CE practice fields are returned — avoids timeouts in large workspaces with hundreds of org-wide fields. Returns GIDs, types, and enum option GIDs needed for custom_fields payloads.",
        inputSchema: {
          type: "object",
          properties: {
            workspace_gid: {
              type: "string",
              description: "The ID (gid) of the workspace.",
            },
            name_prefix: {
              type: "string",
              description: "Optional. Only return fields whose name starts with this prefix (case-insensitive). Defaults to 'GCA_GTM_'. Pass empty string '' to return all fields.",
            },
          },
          required: ["workspace_gid"],
        },
      },
      {
        name: "create_custom_field",
        description: "Create an organisation-level custom field in the Asana workspace. Supports text, number, currency, date, enum (single-select), and people types. For enum fields, pass enum_options as an array of option name strings — options are created in order. Set is_global_to_workspace=true (default) to make it available across all projects. Use this to set up the CE practice field schema (Stage, Risk Flag, ARR Potential, etc.).",
        inputSchema: {
          type: "object",
          properties: {
            workspace_gid: {
              type: "string",
              description: "The ID (gid) of the workspace.",
            },
            name: {
              type: "string",
              description: "Display name of the custom field (e.g. 'Stage', 'ARR Potential').",
            },
            field_type: {
              type: "string",
              enum: ["text", "number", "currency", "date", "enum", "people"],
              description: "Field type. Use 'enum' for single-select dropdowns. Use 'currency' for dollar values.",
            },
            description: {
              type: "string",
              description: "Optional description shown to users in Asana.",
            },
            enum_options: {
              type: "array",
              items: { type: "string" },
              description: "For enum fields only: ordered list of option names to create (e.g. ['Awareness', 'Pre-Sales', 'POC']).",
            },
            currency_code: {
              type: "string",
              description: "For currency fields only: ISO 4217 code (default: 'USD').",
            },
          },
          required: ["workspace_gid", "name", "field_type"],
        },
      },
      {
        name: "get_project_templates",
        description: "List all project templates in the GCA GTM Team. Use this to find the GID of the Customer Project Template before calling create_project_from_template.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "create_project_from_template",
        description: "Create a new Asana project by instantiating a saved project template. Preserves the full task structure, sections, and milestones from the template. Use this when a Pre-Sales opportunity confirms POC — instantiates the Customer Project Template with all sections and tasks in place. Polls until ready and returns the new project GID.",
        inputSchema: {
          type: "object",
          properties: {
            template_gid: {
              type: "string",
              description: "The GID of the project template to instantiate. Use get_project_templates to find it.",
            },
            name: {
              type: "string",
              description: "Name for the new project (e.g. the customer company name).",
            },
            team_gid: {
              type: "string",
              description: "Optional. Defaults to GCA GTM Team.",
            },
            public: {
              type: "boolean",
              description: "Optional. Whether the project is public within the team. Default: false.",
            },
          },
          required: ["template_gid", "name"],
        },
      },
      {
        name: "scaffold_project_from_definition",
        description: "Create a fully structured Asana project from a JSON definition object. Builds the project, all sections, tasks (including milestones), and subtasks in the correct order. Use this with the customer_project_template.json to scaffold a Tier 2 customer project via the Asana Admin skill. Returns the new project GID and a summary of everything created.",
        inputSchema: {
          type: "object",
          properties: {
            workspace_gid: {
              type: "string",
              description: "The ID (gid) of the workspace.",
            },
            definition: {
              type: "object",
              description: "The project definition JSON. Must have: name (string), sections (array of {name, tasks[]}). Each task can have: name, notes, is_milestone (bool), subtasks (array of {name, notes}).",
            },
            team_gid: {
              type: "string",
              description: "Optional. Defaults to GCA GTM Team.",
            },
          },
          required: ["workspace_gid", "definition"],
        },
      },
    ],
  };
});

// Handle Tool Execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    if (name === "get_workspaces") {
      const workspaces = await workspacesApi.getWorkspaces({ limit: 100 });
      return {
        content: [{ type: "text", text: JSON.stringify(workspaces.data, null, 2) }],
      };
    } 
    
    else if (name === "get_teams") {
      const workspace_gid = String(args?.workspace_gid);
      if (!workspace_gid) throw new Error("workspace_gid is required");

      const teams = await teamsApi.getTeamsForWorkspace(workspace_gid, { limit: 100 });
      return {
        content: [{ type: "text", text: JSON.stringify(teams.data, null, 2) }],
      };
    }

    else if (name === "get_projects") {
      // Resolve team_gid: explicit arg → installed default → workspace fallback
      const team_gid = args?.team_gid
        ? String(args.team_gid)
        : GCA_GTM_TEAM_GID;
      const workspace_gid = args?.workspace_gid ? String(args.workspace_gid) : undefined;

      if (!team_gid && !workspace_gid) {
        throw new Error("Either team_gid or workspace_gid is required (or set GCA_GTM_TEAM_GID at install time)");
      }

      // Request rich fields so callers can understand team membership and archive status
      const optFields = "gid,name,archived,created_at,modified_at,team,team.name,members,members.name,public";

      // Prefer team-scoped query (filtered) over full workspace scan
      const projects = team_gid
        ? await projectsApi.getProjectsForTeam(team_gid, { limit: 100, archived: false, opt_fields: optFields })
        : await projectsApi.getProjectsForWorkspace(workspace_gid!, { limit: 100, archived: false, opt_fields: optFields });

      return {
        content: [{ type: "text", text: JSON.stringify(projects.data, null, 2) }],
      };
    } 
    
    else if (name === "get_tasks") {
      const project_gid = String(args?.project_gid);
      if (!project_gid) throw new Error("project_gid is required");
      
      const tasks = await tasksApi.getTasksForProject(project_gid, { limit: 100 });
      return {
        content: [{ type: "text", text: JSON.stringify(tasks.data, null, 2) }],
      };
    } 
    
    else if (name === "get_task_details") {
      const task_gid = String(args?.task_gid);
      if (!task_gid) throw new Error("task_gid is required");
      
      const task = await tasksApi.getTask(task_gid, {});
      return {
        content: [{ type: "text", text: JSON.stringify(task.data, null, 2) }],
      };
    } 
    
    else if (name === "get_goal_details") {
      const goal_gid = String(args?.goal_gid);
      if (!goal_gid) throw new Error("goal_gid is required");
      
      const goal = await goalsApi.getGoal(goal_gid, {});
      return {
        content: [{ type: "text", text: JSON.stringify(goal.data, null, 2) }],
      };
    } 
    
    else if (name === "get_goals") {
      const workspace_gid = args?.workspace_gid ? String(args.workspace_gid) : undefined;
      // Resolve team_gid: explicit arg → installed default
      const team_gid = args?.team_gid
        ? String(args.team_gid)
        : GCA_GTM_TEAM_GID;

      if (!workspace_gid && !team_gid) {
        throw new Error("Either workspace_gid or team_gid must be provided (or set GCA_GTM_TEAM_GID at install time)");
      }

      const opts: any = { limit: 100 };
      if (workspace_gid) opts.workspace = workspace_gid;
      if (team_gid) opts.team = team_gid;

      const goals = await goalsApi.getGoals(opts);
      return {
        content: [{ type: "text", text: JSON.stringify(goals.data, null, 2) }],
      };
    } 
    
    else if (name === "create_task") {
      const workspace_gid = String(args?.workspace_gid);
      const taskName = String(args?.name);
      const notes = args?.notes ? String(args.notes) : undefined;
      const project_gid = args?.project_gid ? String(args.project_gid) : undefined;
      const section_gid = args?.section_gid ? String(args.section_gid) : undefined;
      const custom_fields = args?.custom_fields ?? undefined;
      const is_milestone = args?.is_milestone === true;
      const due_on = args?.due_on ? String(args.due_on) : undefined;

      if (!workspace_gid || !taskName) throw new Error("workspace_gid and name are required");

      const taskData: any = {
        workspace: workspace_gid,
        name: taskName,
      };
      if (notes) taskData.notes = notes;
      if (project_gid) taskData.projects = [project_gid];
      if (custom_fields) taskData.custom_fields = custom_fields;
      if (is_milestone) taskData.resource_subtype = "milestone";
      if (due_on) taskData.due_on = due_on;

      // Place task in a specific section via memberships
      if (section_gid && project_gid) {
        taskData.memberships = [{ project: project_gid, section: section_gid }];
        delete taskData.projects; // memberships already covers project placement
      }

      const newTask = await tasksApi.createTask({ data: taskData }, {});
      return {
        content: [{ type: "text", text: JSON.stringify(newTask.data, null, 2) }],
      };
    }

    else if (name === "create_subtask") {
      const parent_task_gid = String(args?.parent_task_gid);
      const subtaskName = String(args?.name);
      const notes = args?.notes ? String(args.notes) : undefined;
      const custom_fields = args?.custom_fields ?? undefined;
      const due_on = args?.due_on ? String(args.due_on) : undefined;

      if (!parent_task_gid || !subtaskName) throw new Error("parent_task_gid and name are required");

      const subtaskData: any = { name: subtaskName };
      if (notes) subtaskData.notes = notes;
      if (custom_fields) subtaskData.custom_fields = custom_fields;
      if (due_on) subtaskData.due_on = due_on;

      const newSubtask = await tasksApi.createSubtaskForTask(parent_task_gid, subtaskData, {});
      return {
        content: [{ type: "text", text: JSON.stringify(newSubtask.data, null, 2) }],
      };
    }

    else if (name === "update_task") {
      const task_gid = String(args?.task_gid);
      if (!task_gid) throw new Error("task_gid is required");

      const updateData: any = {};
      if (args?.name !== undefined) updateData.name = String(args.name);
      if (args?.notes !== undefined) updateData.notes = String(args.notes);
      if (args?.completed !== undefined) updateData.completed = Boolean(args.completed);
      if (args?.custom_fields !== undefined) updateData.custom_fields = args.custom_fields;

      if (Object.keys(updateData).length === 0) throw new Error("At least one field to update is required");

      const updatedTask = await tasksApi.updateTask(task_gid, updateData, {});
      return {
        content: [{ type: "text", text: JSON.stringify(updatedTask.data, null, 2) }],
      };
    }

    else if (name === "create_project") {
      const projectName = String(args?.name);
      if (!projectName) throw new Error("name is required");

      const team_gid = args?.team_gid ? String(args.team_gid) : GCA_GTM_TEAM_GID;
      const projectData: any = {
        name: projectName,
        team: team_gid,
      };
      if (args?.notes) projectData.notes = String(args.notes);
      if (args?.color) projectData.color = String(args.color);

      const newProject = await projectsApi.createProject({ data: projectData }, {});
      return {
        content: [{ type: "text", text: JSON.stringify(newProject.data, null, 2) }],
      };
    }

    else if (name === "get_sections") {
      const project_gid = String(args?.project_gid);
      if (!project_gid) throw new Error("project_gid is required");

      const sections = await sectionsApi.getSectionsForProject(project_gid, {});
      return {
        content: [{ type: "text", text: JSON.stringify(sections.data, null, 2) }],
      };
    }

    else if (name === "create_section") {
      const project_gid = String(args?.project_gid);
      const sectionName = String(args?.name);
      if (!project_gid || !sectionName) throw new Error("project_gid and name are required");

      const newSection = await sectionsApi.createSectionForProject(project_gid, { body: { data: { name: sectionName } } });
      return {
        content: [{ type: "text", text: JSON.stringify(newSection.data, null, 2) }],
      };
    }

    else if (name === "get_custom_fields") {
      const workspace_gid = String(args?.workspace_gid);
      if (!workspace_gid) throw new Error("workspace_gid is required");

      // Default to GCA_GTM_ prefix to avoid scanning the entire org's field list.
      // Pass name_prefix="" to return all fields.
      const namePrefix = args?.name_prefix !== undefined
        ? String(args.name_prefix).toLowerCase()
        : "gca_gtm_";

      const matchingFields: any[] = [];
      let offset: string | undefined = undefined;

      for (let page = 0; page < 100; page++) {
        const response: any = await customFieldsApi.getCustomFieldsForWorkspace(
          workspace_gid,
          { limit: 100, offset, opt_fields: "gid,name,type,resource_subtype,enum_options,precision,format,currency_code" }
        );
        const pageFields: any[] = response.data ?? [];

        // Filter client-side by prefix
        for (const f of pageFields) {
          if (!namePrefix || f.name.toLowerCase().startsWith(namePrefix)) {
            matchingFields.push(f);
          }
        }

        offset = response.next_page?.offset;
        if (!offset) break; // No more pages
      }

      return {
        content: [{ type: "text", text: JSON.stringify(matchingFields, null, 2) }],
      };
    }

    else if (name === "create_custom_field") {
      const workspace_gid = String(args?.workspace_gid);
      const fieldName = String(args?.name);
      const field_type = String(args?.field_type);
      if (!workspace_gid || !fieldName || !field_type) {
        throw new Error("workspace_gid, name, and field_type are required");
      }

      // ── Idempotent guard: search only within GCA_GTM_ prefix to avoid full workspace scan ──
      let existingField: any = null;
      let offset: string | undefined = undefined;
      const searchName = fieldName.toLowerCase();
      const prefix = searchName.startsWith("gca_gtm_") ? "gca_gtm_" : "";

      for (let page = 0; page < 100; page++) {
        const response: any = await customFieldsApi.getCustomFieldsForWorkspace(
          workspace_gid,
          { limit: 100, offset, opt_fields: "gid,name,type,resource_subtype" }
        );
        const pageFields: any[] = response.data ?? [];

        // Filter to prefix first — skip pages that contain no GCA_GTM_ fields
        const prefixMatches = prefix
          ? pageFields.filter((f: any) => f.name.toLowerCase().startsWith(prefix))
          : pageFields;

        existingField = prefixMatches.find(
          (f: any) => f.name.toLowerCase() === searchName
        );
        if (existingField) break;

        offset = response.next_page?.offset;
        if (!offset) break;
      }

      if (existingField) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              status: "already_exists",
              message: `Field "${fieldName}" already exists (GID: ${existingField.gid}).`,
              field: existingField,
            }, null, 2),
          }],
        };
      }

      // ── Build field payload ─────────
      const asanaSubtype = field_type === "currency" ? "number" : field_type;
      const fieldData: any = {
        name: fieldName,
        workspace: workspace_gid,
        is_global_to_workspace: true,
        resource_subtype: asanaSubtype,
      };

      if (args?.description) fieldData.description = String(args.description);

      if (field_type === "currency") {
        fieldData.precision = 2;
        fieldData.format = "currency";
        fieldData.currency_code = args?.currency_code ? String(args.currency_code) : "USD";
      } else if (field_type === "number") {
        fieldData.precision = 0;
      }

      // 1. Create the field
      const newField = await customFieldsApi.createCustomField({ data: fieldData }, {});
      const fieldGid = (newField.data as any).gid;

      // 2. If enum, add options sequentially
      const createdOptions: any[] = [];
      if (field_type === "enum") {
        const enum_options = args?.enum_options as string[] | undefined;
        if (enum_options && Array.isArray(enum_options)) {
          for (const optionName of enum_options) {
            const opt = await customFieldsApi.createEnumOptionForCustomField(
              fieldGid,
              { body: { data: { name: optionName, enabled: true } } }
            );
            createdOptions.push((opt as any).data);
          }
        }
      }

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            status: "created",
            field: newField.data,
            enum_options: createdOptions,
          }, null, 2),
        }],
      };
    }

    else if (name === "get_project_templates") {
      const templates = await projectTemplatesApi.getProjectTemplatesForTeam(GCA_GTM_TEAM_GID, { limit: 100 });
      return {
        content: [{ type: "text", text: JSON.stringify(templates.data, null, 2) }],
      };
    }

    else if (name === "create_project_from_template") {
      const template_gid = String(args?.template_gid);
      const projectName = String(args?.name);
      if (!template_gid || !projectName) throw new Error("template_gid and name are required");

      const team_gid = args?.team_gid ? String(args.team_gid) : GCA_GTM_TEAM_GID;
      const isPublic = args?.public === true;

      // Instantiate the template — returns a Job (async in Asana)
      const job = await projectTemplatesApi.instantiateProject(
        template_gid,
        { body: { data: { name: projectName, team: team_gid, public: isPublic } } }
      );
      const jobGid = (job.data as any).gid;

      // Poll job status until succeeded or timeout (~30s)
      const jobsApi = new Asana.JobsApi();
      const maxAttempts = 10;
      const pollIntervalMs = 3000;
      let newProjectGid: string | null = null;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
        const jobStatus = await jobsApi.getJob(jobGid, {});
        const jobData = (jobStatus as any).data;
        if (jobData.status === "succeeded") {
          newProjectGid = jobData.new_project?.gid ?? null;
          break;
        }
        if (jobData.status === "failed") {
          throw new Error(`Template instantiation failed. Job: ${jobGid}`);
        }
      }

      if (!newProjectGid) {
        return {
          content: [{ type: "text", text: `Project creation still in progress. Job GID: ${jobGid}. Check Asana for status.` }],
        };
      }

      const newProject = await projectsApi.getProject(newProjectGid, {});
      return {
        content: [{ type: "text", text: JSON.stringify(newProject.data, null, 2) }],
      };
    }

    else if (name === "scaffold_project_from_definition") {
      const workspace_gid = String(args?.workspace_gid);
      const definition = args?.definition as any;
      if (!workspace_gid || !definition) throw new Error("workspace_gid and definition are required");

      const team_gid = args?.team_gid ? String(args.team_gid) : GCA_GTM_TEAM_GID;
      const summary: any = { sections: [] };

      // Step 1: Create the project
      const projectData: any = {
        name: definition.name,
        team: team_gid,
      };
      if (definition.color) projectData.color = definition.color;
      if (definition.notes) projectData.notes = definition.notes;

      const newProject = await projectsApi.createProject({ data: projectData }, {});
      const projectGid = (newProject.data as any).gid;
      summary.project_gid = projectGid;
      summary.project_name = definition.name;

      // Step 2: Create sections + tasks + subtasks
      for (const section of (definition.sections ?? [])) {
        const sec = await sectionsApi.createSectionForProject(
          projectGid,
          { body: { data: { name: section.name } } }
        );
        const sectionGid = (sec as any).data?.gid ?? (sec as any).gid;
        const sectionSummary: any = { name: section.name, tasks_created: 0 };

        for (const task of (section.tasks ?? [])) {
          const taskData: any = {
            name: task.name,
            memberships: [{ project: projectGid, section: sectionGid }],
          };
          if (task.notes) taskData.notes = task.notes;
          if (task.is_milestone) taskData.resource_subtype = "milestone";

          const newTask = await tasksApi.createTask({ data: taskData }, {});
          const taskGid = (newTask.data as any).gid;
          sectionSummary.tasks_created++;

          // Step 3: Create subtasks if defined
          for (const subtask of (task.subtasks ?? [])) {
            const subtaskData: any = { name: subtask.name };
            if (subtask.notes) subtaskData.notes = subtask.notes;
            await tasksApi.createSubtaskForTask(taskGid, subtaskData, {});
          }
        }

        summary.sections.push(sectionSummary);
      }

      return {
        content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error: any) {
    const errorDetail: any = {
      message: error.message,
      name: error.name,
      status: error.status,
    };
    if (error.body) errorDetail.body = error.body;
    if (error.response) {
      errorDetail.response = {
        status: error.response.status,
        text: error.response.text,
      };
    }
    
    return {
      isError: true,
      content: [{ type: "text", text: JSON.stringify(errorDetail, null, 2) }],
    };
  }
});

// Start Server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Asana MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});