# Specification: Decouple PM Skill and Generalize Asana MCP Server

## Overview
Decouple the Customer Engineer (CE) PM Skill, PM-specific slash commands, and templates from the core `asana-mcp-server` repository into a brand-new, standalone Gemini CLI Extension named "the-wandered" located at `/Users/mohansridharan/repos/the-wandered`. At the same time, refactor and generalize the core `asana-mcp-server` to serve as a generic, un-opinionated bridge between Gemini CLI/MCP clients and Asana.

## Functional Requirements
1. **Create standalone PM Extension ("the-wandered"):**
   - Create the directory `/Users/mohansridharan/repos/the-wandered`.
   - Setup `gemini-extension.json` for the new extension containing:
     - PM Skill (`skills/pm/SKILL.md` and `references/`)
     - PM-specific slash commands: `pm:sync`, `pm:brief`, `pm:new-opportunity`
     - Asana templates and CSV definitions moved from the core server
   - Setup proper README.md explaining how to install and configure it.
2. **Generalize Core Asana Extension (`asana-mcp-server`):**
   - Delete PM Skill directory (`skills/pm/`) and its reference documents.
   - Delete PM-specific slash command files (`commands/pm-sync.toml`, `commands/pm-brief.toml`, `commands/pm-new-opportunity.toml`).
   - Delete `asana-templates/` directory containing CE-specific templates.
   - Remove GCA/GTM/CE specific hardcoded defaults from `src/index.ts`:
     - Remove hardcoded default GID `1213807836434813` for `GCA_GTM_TEAM_GID`.
     - Make `team_gid` an environment variable parameter `ASANA_TEAM_GID` or parameter arg with no hardcoded default.
     - Update `get_custom_fields` default `name_prefix` from `"gca_gtm_"` to `""` (returning all fields).
     - Update tool descriptions in `ListToolsRequestSchema` to remove GCA GTM/CE specific references, keeping them purely generic.
   - Update `gemini-extension.json` and `GEMINI.md` to remove all PM-specific skills, commands, context rules, and GCA GTM assumptions.
   - Maintain the `asana-admin` skill for development and gaps analysis, but make it generic.

## Non-Functional Requirements
- Type safety: No TypeScript compilation errors after refactoring.
- Build completeness: The code compiled in `asana-mcp-server` builds successfully.
- Dependency isolation: The generic extension should not depend on Google Workspace/Gmail/GChat MCP servers or tools.

## Acceptance Criteria
- [ ] Directory `/Users/mohansridharan/repos/the-wandered` is created and populated with PM skill, templates, commands, and manifest.
- [ ] `asana-mcp-server` builds successfully (`npm run build`).
- [ ] `/skills list` in `asana-mcp-server` no longer contains `pm`.
- [ ] `/commands list` in `asana-mcp-server` no longer contains `pm:*`.
- [ ] All hardcoded GCA GTM Team GIDs and custom field prefix defaults are removed from `src/index.ts`.
- [ ] `gemini-extension.json`, `README.md`, and `GEMINI.md` in `asana-mcp-server` are clean of PM skill/GTM specific references.

## Out of Scope
- Actually implementing new features for the PM skill or the Asana MCP server.
- Modifying Asana API schemas.
