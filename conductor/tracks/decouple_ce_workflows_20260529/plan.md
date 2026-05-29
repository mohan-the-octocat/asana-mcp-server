# Implementation Plan: Decouple CE Workflows and Make Plain-Vanilla MCP Server

## Phase 1: CE File Cleanup
- [ ] Task: Delete CE/PM-specific command and definition files
    - [ ] Delete `commands/admin-setup-fields.toml`
    - [ ] Delete `commands/admin-setup-template.toml`
    - [ ] Verify that no other custom CE-specific command or manifest files exist in this repository
- [ ] Task: Conductor - User Manual Verification 'CE File Cleanup' (Protocol in workflow.md)

## Phase 2: Decouple and Generalize `src/index.ts`
- [ ] Task: Remove hardcoded GCA team scoping
    - [ ] Delete `GCA_GTM_TEAM_GID` constant and fallback logic on line 19
- [ ] Task: Generalize tool parameter schemas (ListToolsRequestSchema)
    - [ ] Refactor `get_teams`: Remove GCA_GTM_TEAM_GID notes from description
    - [ ] Refactor `get_projects`: Remove default fallback references; make `team_gid` and `workspace_gid` optional but require at least one at execution
    - [ ] Refactor `get_goals`: Remove defaults and update description
    - [ ] Refactor `create_task`, `create_subtask`, `update_task`: Remove PM/CE pipeline-specific language from descriptions
    - [ ] Refactor `create_project`: Remove GCA default team fallback description; make `team_gid` a required parameter in inputSchema
    - [ ] Refactor `get_custom_fields`: Change default `name_prefix` to `""` to scan all fields generics-style
    - [ ] Refactor `create_custom_field`: Remove CE schema references from description; update schema property descriptions
    - [ ] Refactor `get_project_templates`: Update description; add `team_gid` as a required parameter in inputSchema
    - [ ] Refactor `create_project_from_template`: Make `team_gid` a required parameter in inputSchema
    - [ ] Refactor `scaffold_project_from_definition`: Make `team_gid` a required parameter in inputSchema
- [ ] Task: Generalize tool execution handlers (CallToolRequestSchema)
    - [ ] Update `get_projects` handler to throw error if both `team_gid` and `workspace_gid` are missing (no default fallback)
    - [ ] Update `get_goals` handler to throw error if both `team_gid` and `workspace_gid` are missing (no default fallback)
    - [ ] Update `create_project` handler to throw error if `team_gid` is missing (no default fallback)
    - [ ] Update `get_custom_fields` handler to use empty string `""` as default name prefix instead of `"gca_gtm_"`
    - [ ] Update `create_custom_field` handler: remove prefix-based searching optimization; check all fields generically
    - [ ] Update `get_project_templates` handler to use required `team_gid` argument (no fallback)
    - [ ] Update `create_project_from_template` handler to use required `team_gid` argument (no fallback)
    - [ ] Update `scaffold_project_from_definition` handler to use required `team_gid` argument (no fallback)
- [ ] Task: Conductor - User Manual Verification 'Decouple and Generalize src/index.ts' (Protocol in workflow.md)

## Phase 3: Test Suite Refactoring & Compilation
- [ ] Task: Refactor existing Vitest tests (`tests/asana-mcp.test.ts`)
    - [ ] Remove `process.env.GCA_GTM_TEAM_GID` mock-setup assignment
    - [ ] Update `get_projects` test to pass an explicit `team_gid` or `workspace_gid` and expect the correct API call
    - [ ] Update `get_goals` test to pass explicit `team_gid` or `workspace_gid` and expect the correct API call
    - [ ] Update `create_project` test to pass explicit `team_gid` and expect the correct API call
    - [ ] Update `get_custom_fields` test to match generic `name_prefix` defaults
    - [ ] Update `create_custom_field` test to match generic/un-prefixed lookup behavior
    - [ ] Update `get_project_templates` test to pass explicit `team_gid` and expect the correct API call
    - [ ] Update `create_project_from_template` test to pass explicit `team_gid` and expect the correct API call
    - [ ] Update `scaffold_project_from_definition` test to pass explicit `team_gid` and expect the correct API call
- [ ] Task: Verify compilation and tests
    - [ ] Run `npm run build` and ensure no compilation errors
    - [ ] Run `npm test` and ensure all unit tests pass successfully
- [ ] Task: Conductor - User Manual Verification 'Test Suite Refactoring & Compilation' (Protocol in workflow.md)

## Phase 4: Self-Improving Skill Integration
- [ ] Task: Redefine `skills/asana-admin/SKILL.md`
    - [ ] Write a detailed blueprint instructing the AI developer to query Asana's API specs, implement TypeScript schemas and execution handlers in `src/index.ts`, generate Vitest mock unit tests in `tests/asana-mcp.test.ts`, and run automated build & test checks to verify correctness.
- [ ] Task: Conductor - User Manual Verification 'Self-Improving Skill Integration' (Protocol in workflow.md)
