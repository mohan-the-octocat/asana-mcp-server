# Implementation Plan: Decouple CE Workflows and Make Plain-Vanilla MCP Server

## Phase 1: CE File Cleanup [checkpoint: aad5e36]
- [x] Task: Delete CE/PM-specific command and definition files (0c22376)
    - [x] Delete `commands/admin-setup-fields.toml`
    - [x] Delete `commands/admin-setup-template.toml`
    - [x] Verify that no other custom CE-specific command or manifest files exist in this repository
- [x] Task: Conductor - User Manual Verification 'CE File Cleanup' (Protocol in workflow.md) (aad5e36)

## Phase 2: Decouple and Generalize `src/index.ts`
- [x] Task: Remove hardcoded GCA team scoping (completed)
    - [x] Delete `GCA_GTM_TEAM_GID` constant and fallback logic on line 19 (completed)
- [x] Task: Generalize tool parameter schemas (ListToolsRequestSchema) (completed)
    - [x] Refactor `get_teams`: Remove GCA_GTM_TEAM_GID notes from description (completed)
    - [x] Refactor `get_projects`: Remove default fallback references; make `team_gid` and `workspace_gid` optional but require at least one at execution (completed)
    - [x] Refactor `get_goals`: Remove defaults and update description (completed)
    - [x] Refactor `create_task`, `create_subtask`, `update_task`: Remove PM/CE pipeline-specific language from descriptions (completed)
    - [x] Refactor `create_project`: Remove GCA default team fallback description; make `team_gid` a required parameter in inputSchema (completed)
    - [x] Refactor `get_custom_fields`: Change default `name_prefix` to `""` to scan all fields generics-style (completed)
    - [x] Refactor `create_custom_field`: Remove CE schema references from description; update schema property descriptions (completed)
    - [x] Refactor `get_project_templates`: Update description; add `team_gid` as a required parameter in inputSchema (completed)
    - [x] Refactor `create_project_from_template`: Make `team_gid` a required parameter in inputSchema (completed)
    - [x] Refactor `scaffold_project_from_definition`: Make `team_gid` a required parameter in inputSchema (completed)
- [x] Task: Generalize tool execution handlers (CallToolRequestSchema) (completed)
    - [x] Update `get_projects` handler to throw error if both `team_gid` and `workspace_gid` are missing (no default fallback) (completed)
    - [x] Update `get_goals` handler to throw error if both `team_gid` and `workspace_gid` are missing (no default fallback) (completed)
    - [x] Update `create_project` handler to throw error if `team_gid` is missing (no default fallback) (completed)
    - [x] Update `get_custom_fields` handler to use empty string `""` as default name prefix instead of `"gca_gtm_"` (completed)
    - [x] Update `create_custom_field` handler: remove prefix-based searching optimization; check all fields generically (completed)
    - [x] Update `get_project_templates` handler to use required `team_gid` argument (no fallback) (completed)
    - [x] Update `create_project_from_template` handler to use required `team_gid` argument (no fallback) (completed)
    - [x] Update `scaffold_project_from_definition` handler to use required `team_gid` argument (no fallback) (completed)
- [x] Task: Conductor - User Manual Verification 'Decouple and Generalize src/index.ts' (completed)

## Phase 3: Test Suite Refactoring & Compilation
- [x] Task: Refactor existing Vitest tests (`tests/asana-mcp.test.ts`) (completed)
    - [x] Remove `process.env.GCA_GTM_TEAM_GID` mock-setup assignment (completed)
    - [x] Update `get_projects` test to pass an explicit `team_gid` or `workspace_gid` and expect the correct API call (completed)
    - [x] Update `get_goals` test to pass explicit `team_gid` or `workspace_gid` and expect the correct API call (completed)
    - [x] Update `create_project` test to pass explicit `team_gid` and expect the correct API call (completed)
    - [x] Update `get_custom_fields` test to match generic `name_prefix` defaults (completed)
    - [x] Update `create_custom_field` test to match generic/un-prefixed lookup behavior (completed)
    - [x] Update `get_project_templates` test to pass explicit `team_gid` and expect the correct API call (completed)
    - [x] Update `create_project_from_template` test to pass explicit `team_gid` and expect the correct API call (completed)
    - [x] Update `scaffold_project_from_definition` test to pass explicit `team_gid` and expect the correct API call (completed)
- [x] Task: Verify compilation and tests (completed)
    - [x] Run `npm run build` and ensure no compilation errors (completed)
    - [x] Run `npm test` and ensure all unit tests pass successfully (completed)
- [x] Task: Conductor - User Manual Verification 'Test Suite Refactoring & Compilation' (completed)

## Phase 4: Self-Improving Skill Integration
- [x] Task: Redefine `skills/asana-admin/SKILL.md` (completed)
    - [x] Write a detailed blueprint instructing the AI developer to query Asana's API specs, implement TypeScript schemas and execution handlers in `src/index.ts`, generate Vitest mock unit tests in `tests/asana-mcp.test.ts`, and run automated build & test checks to verify correctness (completed)
- [x] Task: Conductor - User Manual Verification 'Self-Improving Skill Integration' (completed)
