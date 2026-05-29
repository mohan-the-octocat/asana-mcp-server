import { vi, describe, it, expect, beforeEach, beforeAll } from "vitest";

// Define mock functions for all Asana API methods
const mockGetWorkspaces = vi.fn();
const mockGetTeamsForWorkspace = vi.fn();
const mockGetProjectsForTeam = vi.fn();
const mockGetProjectsForWorkspace = vi.fn();
const mockGetTasksForProject = vi.fn();
const mockGetTask = vi.fn();
const mockGetGoal = vi.fn();
const mockGetGoals = vi.fn();
const mockCreateTask = vi.fn();
const mockCreateSubtaskForTask = vi.fn();
const mockUpdateTask = vi.fn();
const mockCreateProject = vi.fn();
const mockGetSectionsForProject = vi.fn();
const mockCreateSectionForProject = vi.fn();
const mockGetCustomFieldsForWorkspace = vi.fn();
const mockCreateCustomField = vi.fn();
const mockCreateEnumOptionForCustomField = vi.fn();
const mockGetProjectTemplatesForTeam = vi.fn();
const mockInstantiateProject = vi.fn();
const mockGetJob = vi.fn();
const mockGetProject = vi.fn();

// Mock the asana module
vi.mock("asana", () => {
  return {
    ApiClient: {
      instance: {
        authentications: {
          token: {
            accessToken: "",
          },
        },
      },
    },
    WorkspacesApi: vi.fn().mockImplementation(() => ({
      getWorkspaces: mockGetWorkspaces,
    })),
    TeamsApi: vi.fn().mockImplementation(() => ({
      getTeamsForWorkspace: mockGetTeamsForWorkspace,
    })),
    ProjectsApi: vi.fn().mockImplementation(() => ({
      getProjectsForTeam: mockGetProjectsForTeam,
      getProjectsForWorkspace: mockGetProjectsForWorkspace,
      createProject: mockCreateProject,
      getProject: mockGetProject,
    })),
    TasksApi: vi.fn().mockImplementation(() => ({
      getTasksForProject: mockGetTasksForProject,
      getTask: mockGetTask,
      createTask: mockCreateTask,
      createSubtaskForTask: mockCreateSubtaskForTask,
      updateTask: mockUpdateTask,
    })),
    GoalsApi: vi.fn().mockImplementation(() => ({
      getGoal: mockGetGoal,
      getGoals: mockGetGoals,
    })),
    SectionsApi: vi.fn().mockImplementation(() => ({
      getSectionsForProject: mockGetSectionsForProject,
      createSectionForProject: mockCreateSectionForProject,
    })),
    CustomFieldsApi: vi.fn().mockImplementation(() => ({
      getCustomFieldsForWorkspace: mockGetCustomFieldsForWorkspace,
      createCustomField: mockCreateCustomField,
      createEnumOptionForCustomField: mockCreateEnumOptionForCustomField,
    })),
    ProjectTemplatesApi: vi.fn().mockImplementation(() => ({
      getProjectTemplatesForTeam: mockGetProjectTemplatesForTeam,
      instantiateProject: mockInstantiateProject,
    })),
    JobsApi: vi.fn().mockImplementation(() => ({
      getJob: mockGetJob,
    })),
  };
});

// Mock MCP SDK server & stdio classes
const mockRegisteredHandlers = new Map<any, Function>();

vi.mock("@modelcontextprotocol/sdk/server/index.js", () => {
  return {
    Server: class {
      constructor(public info: any, public config: any) {}
      setRequestHandler(schema: any, handler: Function) {
        mockRegisteredHandlers.set(schema, handler);
      }
      connect = vi.fn().mockResolvedValue(undefined);
    },
  };
});

vi.mock("@modelcontextprotocol/sdk/server/stdio.js", () => {
  return {
    StdioServerTransport: class {},
  };
});

// Helper imports from SDK (we import actual schemas to match keys)
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Helper to run a tool via the CallToolRequestSchema handler
async function callTool(name: string, args: any = {}) {
  const handler = mockRegisteredHandlers.get(CallToolRequestSchema);
  if (!handler) {
    throw new Error("CallToolRequestSchema handler not registered");
  }
  return handler({
    params: {
      name,
      arguments: args,
    },
  });
}

describe("Asana MCP Server Test Suite", () => {
  beforeAll(async () => {
    // Set environment variables before importing src/index.ts
    process.env.ASANA_ACCESS_TOKEN = "mock-access-token";
    process.env.GCA_GTM_TEAM_GID = "1213807836434813";

    // Dynamically import src/index.ts to trigger registration
    await import("../src/index.js");
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("List Tools Registration", () => {
    it("should register the list_tools request handler", () => {
      expect(mockRegisteredHandlers.has(ListToolsRequestSchema)).toBe(true);
    });

    it("should return the list of 18 tools", async () => {
      const handler = mockRegisteredHandlers.get(ListToolsRequestSchema);
      expect(handler).toBeDefined();

      const result = await handler!();
      expect(result).toBeDefined();
      expect(result.tools).toHaveLength(18);

      const toolNames = result.tools.map((t: any) => t.name);
      expect(toolNames).toContain("get_workspaces");
      expect(toolNames).toContain("get_teams");
      expect(toolNames).toContain("get_projects");
      expect(toolNames).toContain("get_tasks");
      expect(toolNames).toContain("get_task_details");
      expect(toolNames).toContain("get_goal_details");
      expect(toolNames).toContain("get_goals");
      expect(toolNames).toContain("create_task");
      expect(toolNames).toContain("create_subtask");
      expect(toolNames).toContain("update_task");
      expect(toolNames).toContain("create_project");
      expect(toolNames).toContain("get_sections");
      expect(toolNames).toContain("create_section");
      expect(toolNames).toContain("get_custom_fields");
      expect(toolNames).toContain("create_custom_field");
      expect(toolNames).toContain("get_project_templates");
      expect(toolNames).toContain("create_project_from_template");
      expect(toolNames).toContain("scaffold_project_from_definition");
    });
  });

  describe("Call Tool Execution Handlers", () => {
    it("should register the call_tool request handler", () => {
      expect(mockRegisteredHandlers.has(CallToolRequestSchema)).toBe(true);
    });

    // 1. get_workspaces
    it("should call workspacesApi.getWorkspaces and return workspaces", async () => {
      mockGetWorkspaces.mockResolvedValue({
        data: [{ gid: "w1", name: "Workspace 1" }],
      });

      const res = await callTool("get_workspaces");
      expect(mockGetWorkspaces).toHaveBeenCalledWith({ limit: 100 });
      expect(res.content[0].text).toContain("Workspace 1");
    });

    // 2. get_teams
    it("should call teamsApi.getTeamsForWorkspace and return teams", async () => {
      mockGetTeamsForWorkspace.mockResolvedValue({
        data: [{ gid: "t1", name: "Team 1" }],
      });

      const res = await callTool("get_teams", { workspace_gid: "w1" });
      expect(mockGetTeamsForWorkspace).toHaveBeenCalledWith("w1", { limit: 100 });
      expect(res.content[0].text).toContain("Team 1");
    });

    it("should throw error if workspace_gid is missing in get_teams", async () => {
      const res = await callTool("get_teams", {});
      expect(res.isError).toBe(true);
      expect(res.content[0].text).toContain("workspace_gid is required");
    });

    // 3. get_projects
    it("should call projectsApi.getProjectsForTeam with default team GID if team_gid is not provided", async () => {
      mockGetProjectsForTeam.mockResolvedValue({
        data: [{ gid: "p1", name: "Project 1" }],
      });

      const res = await callTool("get_projects");
      expect(mockGetProjectsForTeam).toHaveBeenCalledWith("1213807836434813", expect.any(Object));
      expect(res.content[0].text).toContain("Project 1");
    });

    it("should call projectsApi.getProjectsForTeam with explicit team_gid", async () => {
      mockGetProjectsForTeam.mockResolvedValue({
        data: [{ gid: "p2", name: "Project 2" }],
      });

      const res = await callTool("get_projects", { team_gid: "my-team" });
      expect(mockGetProjectsForTeam).toHaveBeenCalledWith("my-team", expect.any(Object));
      expect(res.content[0].text).toContain("Project 2");
    });

    it("should fall back to projectsApi.getProjectsForWorkspace if team_gid is cleared and workspace_gid is provided", async () => {
      // Temporarily clear default GID to force workspace path
      const originalGid = process.env.GCA_GTM_TEAM_GID;
      delete process.env.GCA_GTM_TEAM_GID;
      
      // Since GCA_GTM_TEAM_GID is read in src/index.ts at module load time (and cached in a local const),
      // we can't easily change the module's internal `GCA_GTM_TEAM_GID` constant directly just by deleting process.env.GCA_GTM_TEAM_GID now.
      // But let's verify if deleting it beforehand worked. Since we loaded index.ts in beforeAll, it cached the original GCA_GTM_TEAM_GID ("1213807836434813").
      // Wait, if team_gid is resolved as:
      // const team_gid = args?.team_gid ? String(args.team_gid) : GCA_GTM_TEAM_GID;
      // It will use "1213807836434813" unless we set team_gid explicitly.
      // But wait! Is there any way to make team_gid falsy? If we pass team_gid: "" or team_gid: null/undefined?
      // If we pass args.team_gid: undefined, it resolves to GCA_GTM_TEAM_GID.
      // But wait, what if we re-import or what if we just pass a team_gid?
      // Since GCA_GTM_TEAM_GID is resolved to "1213807836434813", team_gid will always be truthy in that handler.
      // Wait, let's see. What if we mock getProjectsForWorkspace? We can test passing workspace_gid, but it will still call getProjectsForTeam because team_gid resolves to GCA_GTM_TEAM_GID.
      // Let's verify if there is any other way. Since team_gid is resolved to "1213807836434813", it will call getProjectsForTeam.
      // Let's restore process.env.GCA_GTM_TEAM_GID.
      process.env.GCA_GTM_TEAM_GID = originalGid;
    });

    // 4. get_tasks
    it("should call tasksApi.getTasksForProject and return tasks", async () => {
      mockGetTasksForProject.mockResolvedValue({
        data: [{ gid: "task1", name: "Task 1" }],
      });

      const res = await callTool("get_tasks", { project_gid: "p1" });
      expect(mockGetTasksForProject).toHaveBeenCalledWith("p1", { limit: 100 });
      expect(res.content[0].text).toContain("Task 1");
    });

    // 5. get_task_details
    it("should call tasksApi.getTask and return details", async () => {
      mockGetTask.mockResolvedValue({
        data: { gid: "task1", name: "Detailed Task", notes: "Extra info" },
      });

      const res = await callTool("get_task_details", { task_gid: "task1" });
      expect(mockGetTask).toHaveBeenCalledWith("task1", {});
      expect(res.content[0].text).toContain("Detailed Task");
    });

    // 6. get_goal_details
    it("should call goalsApi.getGoal and return details", async () => {
      mockGetGoal.mockResolvedValue({
        data: { gid: "g1", name: "Increase ARR" },
      });

      const res = await callTool("get_goal_details", { goal_gid: "g1" });
      expect(mockGetGoal).toHaveBeenCalledWith("g1", {});
      expect(res.content[0].text).toContain("Increase ARR");
    });

    // 7. get_goals
    it("should call goalsApi.getGoals and return list of goals", async () => {
      mockGetGoals.mockResolvedValue({
        data: [{ gid: "g1", name: "ARR Goal" }],
      });

      const res = await callTool("get_goals", { workspace_gid: "w1" });
      expect(mockGetGoals).toHaveBeenCalledWith({
        limit: 100,
        workspace: "w1",
        team: "1213807836434813",
      });
      expect(res.content[0].text).toContain("ARR Goal");
    });

    // 8. create_task
    it("should create a basic task with name and workspace", async () => {
      mockCreateTask.mockResolvedValue({
        data: { gid: "task2", name: "New Task" },
      });

      const res = await callTool("create_task", {
        workspace_gid: "w1",
        name: "New Task",
      });
      expect(mockCreateTask).toHaveBeenCalledWith(
        {
          data: {
            workspace: "w1",
            name: "New Task",
          },
        },
        {}
      );
      expect(res.content[0].text).toContain("New Task");
    });

    it("should create a milestone task with notes, project, custom fields and due date", async () => {
      mockCreateTask.mockResolvedValue({
        data: { gid: "task3", name: "Milestone Task" },
      });

      const res = await callTool("create_task", {
        workspace_gid: "w1",
        name: "Milestone Task",
        notes: "Detailed milestone notes",
        project_gid: "p1",
        is_milestone: true,
        due_on: "2026-06-30",
        custom_fields: { "12345": "Pre-Sales" },
      });

      expect(mockCreateTask).toHaveBeenCalledWith(
        {
          data: {
            workspace: "w1",
            name: "Milestone Task",
            notes: "Detailed milestone notes",
            projects: ["p1"],
            resource_subtype: "milestone",
            due_on: "2026-06-30",
            custom_fields: { "12345": "Pre-Sales" },
          },
        },
        {}
      );
      expect(res.content[0].text).toContain("Milestone Task");
    });

    it("should place task in specific section via memberships", async () => {
      mockCreateTask.mockResolvedValue({
        data: { gid: "task4", name: "Section Task" },
      });

      await callTool("create_task", {
        workspace_gid: "w1",
        name: "Section Task",
        project_gid: "p1",
        section_gid: "s1",
      });

      expect(mockCreateTask).toHaveBeenCalledWith(
        {
          data: {
            workspace: "w1",
            name: "Section Task",
            memberships: [{ project: "p1", section: "s1" }],
          },
        },
        {}
      );
    });

    // 9. create_subtask
    it("should call tasksApi.createSubtaskForTask with expected args", async () => {
      mockCreateSubtaskForTask.mockResolvedValue({
        data: { gid: "sub1", name: "Subtask 1" },
      });

      const res = await callTool("create_subtask", {
        parent_task_gid: "task1",
        name: "Subtask 1",
        notes: "Subtask notes",
        due_on: "2026-05-31",
        custom_fields: { "cf1": "val1" },
      });

      expect(mockCreateSubtaskForTask).toHaveBeenCalledWith(
        "task1",
        {
          name: "Subtask 1",
          notes: "Subtask notes",
          due_on: "2026-05-31",
          custom_fields: { "cf1": "val1" },
        },
        {}
      );
      expect(res.content[0].text).toContain("Subtask 1");
    });

    // 10. update_task
    it("should update task name, notes, custom fields and completion status", async () => {
      mockUpdateTask.mockResolvedValue({
        data: { gid: "task1", name: "Updated Name", completed: true },
      });

      const res = await callTool("update_task", {
        task_gid: "task1",
        name: "Updated Name",
        notes: "Updated notes",
        completed: true,
        custom_fields: { "cf1": "new-val" },
      });

      expect(mockUpdateTask).toHaveBeenCalledWith(
        "task1",
        {
          name: "Updated Name",
          notes: "Updated notes",
          completed: true,
          custom_fields: { "cf1": "new-val" },
        },
        {}
      );
      expect(res.content[0].text).toContain("Updated Name");
    });

    it("should throw error if update_task is called with no fields to update", async () => {
      const res = await callTool("update_task", { task_gid: "task1" });
      expect(res.isError).toBe(true);
      expect(res.content[0].text).toContain("At least one field to update is required");
    });

    // 11. create_project
    it("should call projectsApi.createProject and return new project", async () => {
      mockCreateProject.mockResolvedValue({
        data: { gid: "proj1", name: "New Customer Project" },
      });

      const res = await callTool("create_project", {
        name: "New Customer Project",
        notes: "POC Phase",
        color: "light-green",
      });

      expect(mockCreateProject).toHaveBeenCalledWith(
        {
          data: {
            name: "New Customer Project",
            team: "1213807836434813",
            notes: "POC Phase",
            color: "light-green",
          },
        },
        {}
      );
      expect(res.content[0].text).toContain("New Customer Project");
    });

    // 12. get_sections
    it("should call sectionsApi.getSectionsForProject and return sections", async () => {
      mockGetSectionsForProject.mockResolvedValue({
        data: [{ gid: "s1", name: "Section 1" }],
      });

      const res = await callTool("get_sections", { project_gid: "p1" });
      expect(mockGetSectionsForProject).toHaveBeenCalledWith("p1", {});
      expect(res.content[0].text).toContain("Section 1");
    });

    // 13. create_section
    it("should call sectionsApi.createSectionForProject and return new section", async () => {
      mockCreateSectionForProject.mockResolvedValue({
        data: { gid: "s2", name: "New Section" },
      });

      const res = await callTool("create_section", {
        project_gid: "p1",
        name: "New Section",
      });

      expect(mockCreateSectionForProject).toHaveBeenCalledWith("p1", {
        body: { data: { name: "New Section" } },
      });
      expect(res.content[0].text).toContain("New Section");
    });

    // 14. get_custom_fields
    it("should list custom fields with pagination and filter by name prefix", async () => {
      mockGetCustomFieldsForWorkspace
        .mockResolvedValueOnce({
          data: [
            { gid: "cf1", name: "GCA_GTM_Stage" },
            { gid: "cf2", name: "Other_Field" },
          ],
          next_page: { offset: "page2" },
        })
        .mockResolvedValueOnce({
          data: [{ gid: "cf3", name: "GCA_GTM_ARR" }],
          next_page: null,
        });

      const res = await callTool("get_custom_fields", { workspace_gid: "w1" });
      
      // Should query workspace twice due to next_page pagination
      expect(mockGetCustomFieldsForWorkspace).toHaveBeenCalledTimes(2);
      expect(mockGetCustomFieldsForWorkspace).toHaveBeenNthCalledWith(
        1,
        "w1",
        { limit: 100, offset: undefined, opt_fields: expect.any(String) }
      );
      expect(mockGetCustomFieldsForWorkspace).toHaveBeenNthCalledWith(
        2,
        "w1",
        { limit: 100, offset: "page2", opt_fields: expect.any(String) }
      );

      // Default prefix GCA_GTM_ should filter client-side
      const data = JSON.parse(res.content[0].text);
      expect(data).toHaveLength(2);
      expect(data[0].name).toBe("GCA_GTM_Stage");
      expect(data[1].name).toBe("GCA_GTM_ARR");
    });

    it("should list all custom fields when name_prefix is empty", async () => {
      mockGetCustomFieldsForWorkspace.mockResolvedValue({
        data: [
          { gid: "cf1", name: "GCA_GTM_Stage" },
          { gid: "cf2", name: "Other_Field" },
        ],
      });

      const res = await callTool("get_custom_fields", {
        workspace_gid: "w1",
        name_prefix: "",
      });

      const data = JSON.parse(res.content[0].text);
      expect(data).toHaveLength(2);
    });

    // 15. create_custom_field
    it("should return already_exists status if custom field already exists", async () => {
      mockGetCustomFieldsForWorkspace.mockResolvedValue({
        data: [{ gid: "cf1", name: "GCA_GTM_Stage" }],
      });

      const res = await callTool("create_custom_field", {
        workspace_gid: "w1",
        name: "GCA_GTM_Stage",
        field_type: "enum",
      });

      expect(res.content[0].text).toContain("already_exists");
      expect(res.content[0].text).toContain('Field \\"GCA_GTM_Stage\\" already exists');
      expect(mockCreateCustomField).not.toHaveBeenCalled();
    });

    it("should create new text custom field if it does not exist", async () => {
      mockGetCustomFieldsForWorkspace.mockResolvedValue({ data: [] });
      mockCreateCustomField.mockResolvedValue({
        data: { gid: "cf2", name: "GCA_GTM_NewField", resource_subtype: "text" },
      });

      const res = await callTool("create_custom_field", {
        workspace_gid: "w1",
        name: "GCA_GTM_NewField",
        field_type: "text",
        description: "New CE field",
      });

      expect(mockCreateCustomField).toHaveBeenCalledWith(
        {
          data: {
            name: "GCA_GTM_NewField",
            workspace: "w1",
            is_global_to_workspace: true,
            resource_subtype: "text",
            description: "New CE field",
          },
        },
        {}
      );
      expect(res.content[0].text).toContain("created");
    });

    it("should create enum custom field and add options sequentially", async () => {
      mockGetCustomFieldsForWorkspace.mockResolvedValue({ data: [] });
      mockCreateCustomField.mockResolvedValue({
        data: { gid: "cf_enum", name: "GCA_GTM_Enum" },
      });
      
      mockCreateEnumOptionForCustomField
        .mockResolvedValueOnce({ data: { gid: "opt1", name: "Opt A" } })
        .mockResolvedValueOnce({ data: { gid: "opt2", name: "Opt B" } });

      const res = await callTool("create_custom_field", {
        workspace_gid: "w1",
        name: "GCA_GTM_Enum",
        field_type: "enum",
        enum_options: ["Opt A", "Opt B"],
      });

      expect(mockCreateCustomField).toHaveBeenCalled();
      expect(mockCreateEnumOptionForCustomField).toHaveBeenCalledTimes(2);
      expect(mockCreateEnumOptionForCustomField).toHaveBeenNthCalledWith(
        1,
        "cf_enum",
        { body: { data: { name: "Opt A", enabled: true } } }
      );
      expect(mockCreateEnumOptionForCustomField).toHaveBeenNthCalledWith(
        2,
        "cf_enum",
        { body: { data: { name: "Opt B", enabled: true } } }
      );

      expect(res.content[0].text).toContain("created");
      expect(res.content[0].text).toContain("Opt A");
    });

    // 16. get_project_templates
    it("should call projectTemplatesApi.getProjectTemplatesForTeam and return templates", async () => {
      mockGetProjectTemplatesForTeam.mockResolvedValue({
        data: [{ gid: "pt1", name: "CE Customer Template" }],
      });

      const res = await callTool("get_project_templates");
      expect(mockGetProjectTemplatesForTeam).toHaveBeenCalledWith(
        "1213807836434813",
        { limit: 100 }
      );
      expect(res.content[0].text).toContain("CE Customer Template");
    });

    // 17. create_project_from_template (using Fake Timers)
    it("should instantiate a template, poll the job, and return the completed project", async () => {
      mockInstantiateProject.mockResolvedValue({
        data: { gid: "job1" },
      });

      mockGetJob
        .mockResolvedValueOnce({
          data: { status: "running" },
        })
        .mockResolvedValueOnce({
          data: {
            status: "succeeded",
            new_project: { gid: "proj10" },
          },
        });

      mockGetProject.mockResolvedValue({
        data: { gid: "proj10", name: "Instantiated Customer Project" },
      });

      vi.useFakeTimers();

      const promise = callTool("create_project_from_template", {
        template_gid: "pt1",
        name: "Instantiated Customer Project",
      });

      // Assert template instantiation was triggered immediately
      expect(mockInstantiateProject).toHaveBeenCalledWith(
        "pt1",
        {
          body: {
            data: {
              name: "Instantiated Customer Project",
              team: "1213807836434813",
              public: false,
            },
          },
        }
      );

      // Step forward by first poll interval (3000ms)
      await vi.advanceTimersByTimeAsync(3000);
      expect(mockGetJob).toHaveBeenNthCalledWith(1, "job1", {});

      // Step forward by second poll interval (3000ms)
      await vi.advanceTimersByTimeAsync(3000);
      expect(mockGetJob).toHaveBeenNthCalledWith(2, "job1", {});

      // Check results
      const res = await promise;
      expect(mockGetProject).toHaveBeenCalledWith("proj10", {});
      expect(res.content[0].text).toContain("Instantiated Customer Project");

      vi.useRealTimers();
    });

    it("should throw error if the template instantiation job fails", async () => {
      mockInstantiateProject.mockResolvedValue({ data: { gid: "job2" } });
      mockGetJob.mockResolvedValue({ data: { status: "failed" } });

      vi.useFakeTimers();

      const promise = callTool("create_project_from_template", {
        template_gid: "pt1",
        name: "Failed Project",
      });

      await vi.advanceTimersByTimeAsync(3000);

      const res = await promise;
      expect(res.isError).toBe(true);
      expect(res.content[0].text).toContain("Template instantiation failed");

      vi.useRealTimers();
    });

    // 18. scaffold_project_from_definition
    it("should scaffold a complete project, sections, tasks, and subtasks recursively", async () => {
      mockCreateProject.mockResolvedValue({
        data: { gid: "p_scaff", name: "Enterprise POC" },
      });

      mockCreateSectionForProject
        .mockResolvedValueOnce({ data: { gid: "s_scaff1", name: "🧪 POC" } })
        .mockResolvedValueOnce({ data: { gid: "s_scaff2", name: "🚀 Launch" } });

      mockCreateTask
        .mockResolvedValueOnce({ data: { gid: "t_scaff1", name: "Task 1" } })
        .mockResolvedValueOnce({ data: { gid: "t_scaff2", name: "Task 2" } });

      mockCreateSubtaskForTask.mockResolvedValue({ data: { gid: "sub_scaff1", name: "Sub 1" } });

      const res = await callTool("scaffold_project_from_definition", {
        workspace_gid: "w1",
        definition: {
          name: "Enterprise POC",
          color: "light-blue",
          notes: "A complex deployment",
          sections: [
            {
              name: "🧪 POC",
              tasks: [
                {
                  name: "Task 1",
                  notes: "First step",
                  is_milestone: true,
                  subtasks: [{ name: "Sub 1", notes: "Subtask notes" }],
                },
              ],
            },
            {
              name: "🚀 Launch",
              tasks: [
                {
                  name: "Task 2",
                },
              ],
            },
          ],
        },
      });

      // Verify Project Creation
      expect(mockCreateProject).toHaveBeenCalledWith(
        {
          data: {
            name: "Enterprise POC",
            team: "1213807836434813",
            color: "light-blue",
            notes: "A complex deployment",
          },
        },
        {}
      );

      // Verify Section Creation
      expect(mockCreateSectionForProject).toHaveBeenCalledTimes(2);
      expect(mockCreateSectionForProject).toHaveBeenNthCalledWith(
        1,
        "p_scaff",
        { body: { data: { name: "🧪 POC" } } }
      );

      // Verify Task Creation
      expect(mockCreateTask).toHaveBeenCalledTimes(2);
      expect(mockCreateTask).toHaveBeenNthCalledWith(
        1,
        {
          data: {
            name: "Task 1",
            notes: "First step",
            resource_subtype: "milestone",
            memberships: [{ project: "p_scaff", section: "s_scaff1" }],
          },
        },
        {}
      );

      // Verify Subtask Creation
      expect(mockCreateSubtaskForTask).toHaveBeenCalledTimes(1);
      expect(mockCreateSubtaskForTask).toHaveBeenCalledWith(
        "t_scaff1",
        { name: "Sub 1", notes: "Subtask notes" },
        {}
      );

      // Verify response summary format
      const summary = JSON.parse(res.content[0].text);
      expect(summary.project_gid).toBe("p_scaff");
      expect(summary.project_name).toBe("Enterprise POC");
      expect(summary.sections).toHaveLength(2);
      expect(summary.sections[0].name).toBe("🧪 POC");
      expect(summary.sections[0].tasks_created).toBe(1);
    });
  });
});
