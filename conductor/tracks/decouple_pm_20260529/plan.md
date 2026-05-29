# Implementation Plan: Decouple PM Skill and Generalize Asana MCP Server

## Phase 1: Create standalone PM Extension
- [ ] Task: Create directory and package structure for decoupled PM extension at `/Users/mohansridharan/repos/the-wandered`
    - [ ] Create `/Users/mohansridharan/repos/the-wandered` folder and its `skills/pm`, `commands`, and `asana-templates` subdirectories
- [ ] Task: Move PM skill directory (`skills/pm`) and references from current workspace
    - [ ] Copy `skills/pm/` files to `/Users/mohansridharan/repos/the-wandered/skills/pm/`
- [ ] Task: Move PM commands and templates from current workspace
    - [ ] Copy `commands/pm-sync.toml`, `commands/pm-brief.toml`, `commands/pm-new-opportunity.toml` to `/Users/mohansridharan/repos/the-wandered/commands/`
    - [ ] Copy `asana-templates/` to `/Users/mohansridharan/repos/the-wandered/asana-templates/`
- [ ] Task: Create project manifest, npm configuration, and README for new extension
    - [ ] Create `/Users/mohansridharan/repos/the-wandered/gemini-extension.json` with only PM-specific skills, commands, and google-workspace MCP dependencies
    - [ ] Create `/Users/mohansridharan/repos/the-wandered/package.json`
    - [ ] Create `/Users/mohansridharan/repos/the-wandered/README.md`
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Create standalone PM Extension' (Protocol in workflow.md)

## Phase 2: Generalize and Refactor Core Asana MCP Server
- [ ] Task: Delete PM files from the core `asana-mcp-server`
    - [ ] Remove `skills/pm/` recursively
    - [ ] Remove `commands/pm-sync.toml`, `commands/pm-brief.toml`, `commands/pm-new-opportunity.toml`
    - [ ] Remove `asana-templates/` recursively
- [ ] Task: Refactor `src/index.ts` to remove GCA GTM/CE hardcoded opinions
    - [ ] Remove hardcoded `GCA_GTM_TEAM_GID = "1213807836434813"` constant and fallback logic
    - [ ] Change `get_projects` and other tools to require team_gid or workspace_gid, or read from optional ASANA_TEAM_GID environment variable with no hardcoded fallback
    - [ ] Remove `gca_gtm_` prefix default from `get_custom_fields` name search (default to `""` to scan all fields)
    - [ ] Generalize all tool descriptions to remove references to "GCA GTM Team" or "CE Pipeline"
- [ ] Task: Update manifests, documentation, and metadata in `asana-mcp-server`
    - [ ] Update `gemini-extension.json` to remove the PM skill, PM commands, and GCA env defaults
    - [ ] Update `GEMINI.md` to remove PM GTM CE-specific roles, rules, and scope assumptions
    - [ ] Update `README.md` to remove PM skill references and explain generic Asana CLI extension usage
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Generalize and Refactor Core Asana MCP Server' (Protocol in workflow.md)

## Phase 3: Update Tests and Build Verification
- [ ] Task: Refactor test suite in `tests/asana-mcp.test.ts` (TDD - Red Phase)
    - [ ] Update mocked environment variables and expected values to reflect the removal of `GCA_GTM_TEAM_GID` and generalized tool responses
- [ ] Task: Run automated tests and confirm success (TDD - Green Phase)
    - [ ] Run `npm test` and ensure all tests pass cleanly
- [ ] Task: Build project and verify compilation
    - [ ] Run `npm run build` and ensure TypeScript compiles successfully to `dist/index.js`
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Update Tests and Build Verification' (Protocol in workflow.md)
