# Specification: Decouple CE Workflows and Make Plain-Vanilla MCP Server

## Overview
The goal of this track is to completely remove all Customer Engineering (CE) specific workflows, logic, defaults, commands, and configurations from the `asana-mcp-server` codebase. This project will become a clean, plain-vanilla, highly reusable Asana MCP Server that acts as a generic bridge between any client harness and the Asana API. 

The only specialized skill left in the project will be `asana-admin` inside `skills/asana-admin/SKILL.md`. This skill will be re-implemented as a self-improving developer skill that automatically parses missing tools/APIs from Asana documentation, writes TypeScript implementations into `src/index.ts`, and adds appropriate Vitest mock tests into `tests/asana-mcp.test.ts`.

## Functional Requirements
1. **Remove CE-Specific Commands and Code**:
   - Delete setup command files: `commands/admin-setup-fields.toml` and `commands/admin-setup-template.toml`.
   - Remove any other PM-specific/CE-specific command files or files under other folders if found.
2. **De-CE Source Code (`src/index.ts`)**:
   - Strip hardcoded GID defaults such as `GCA_GTM_TEAM_GID = "1213807836434813"`.
   - Ensure tools like `get_projects()`, `get_goals()`, `create_project()`, `create_project_from_template()`, `scaffold_project_from_definition()` are fully parameterized and do not use CE-specific default values.
   - For tools that formerly filtered on `gca_gtm_` prefix by default (like `get_custom_fields`), ensure they default to an empty string `""` to scan all fields generically.
3. **Self-Improving Skill (`skills/asana-admin/SKILL.md`)**:
   - Redefine `skills/asana-admin/SKILL.md` to guide an agent to:
     1. Analyze what tool or API endpoint is missing.
     2. Lookup the correct Asana API schema and required/optional request fields.
     3. Inject the TypeScript schema and API handler function into `src/index.ts`.
     4. Generate/append corresponding Vitest mock tests in `tests/asana-mcp.test.ts`.
     5. Run `npm run build` and `npm test` to verify correctness.
4. **Generalize Test Suite (`tests/asana-mcp.test.ts`)**:
   - Update tests to use and expect generic parameters rather than hardcoded `GCA_GTM_TEAM_GID` fallbacks.
   - Ensure the server compiles and all tests pass perfectly.

## Non-Functional Requirements
- Maintain standard TypeScript type safety.
- Keep the MCP server lightweight and performant.

## Acceptance Criteria
- [ ] No mention of `GCA_GTM_TEAM_GID` or `gca_gtm_` in `src/index.ts`.
- [ ] No custom CE-specific files or commands remain in the workspace.
- [ ] `skills/asana-admin/SKILL.md` exists and defines the self-improving tool-adder blueprint.
- [ ] Code compiles (`npm run build`) without errors.
- [ ] All unit tests (`npm test`) compile and pass.

## Out of Scope
- Implementation of the actual "the-wanderer" extension.
- Maintaining any backwards-compatibility with CE-specific environment variables for scoping.
