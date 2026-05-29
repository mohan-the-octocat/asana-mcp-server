# Specification: Asana Admin Skill API Traceability Check

## Overview
Perform a comprehensive traceability check of the API tools implemented in the Asana MCP server (`src/index.ts`) against the required tool matrix in the Asana Admin Skill (`skills/asana-admin/SKILL.md`). Update the skill file to accurately reflect the current status of implementation, including marking newly added tools as implemented (Tier 0), re-prioritizing remaining missing tools, and aligning the instantiated API client instances.

## Scope & Functional Requirements

### 1. Source Audit & Mapping
- Audit the entirety of `src/index.ts` to build an exhaustive inventory of implemented Model Context Protocol (MCP) tools.
- Identify that 18 tools are currently fully implemented, including advanced scaffolding and template instantiations (e.g., `scaffold_project_from_definition`, `create_custom_field`, etc.).

### 2. Required Tool Matrix Update in `skills/asana-admin/SKILL.md`
- **Tier 0 (Currently Implemented):** Expand from 8 to 18 tools, including:
  - Already there: `get_workspaces`, `get_teams`, `get_projects`, `get_tasks`, `get_task_details`, `get_goals`, `get_goal_details`, `create_task`.
  - Implemented from Tier 1: `update_task`, `create_project`, `get_sections`, `create_section`.
  - Implemented from Tier 3: `create_subtask`, `get_custom_fields`.
  - Advanced/Scaffolding (New in code): `create_custom_field`, `get_project_templates`, `create_project_from_template`, `scaffold_project_from_definition`.
- **Tier 1 (High Priority Missing):**
  - Retain `add_task_to_project`.
  - Promote `update_project` from Tier 2 (as requested in Q2/Decisions made).
- **Tier 2 (Medium Priority Missing):**
  - Retain `get_portfolios`, `get_portfolio_items`, `add_project_to_portfolio`, and `create_goal`.
- **Tier 3 (Low Priority Missing):**
  - Retain `remove_task_from_project`, `delete_task`.

### 3. API Client Instances Alignment (Step 3 of Gap Analysis)
- Update Step 3 of the Gap Analysis workflow in `skills/asana-admin/SKILL.md` to reflect that `SectionsApi`, `CustomFieldsApi`, and `ProjectTemplatesApi` are now instantiated in `src/index.ts`.
- Retain only `PortfoliosApi` as the missing API instance needed for remaining gaps.

### 4. Implementation References Update
- Verify that implementation examples or instructions for missing tools match the updated required priority matrix.

## Acceptance Criteria
- `skills/asana-admin/SKILL.md` is updated and fully aligned with the active source code in `src/index.ts`.
- The Required Tool Matrix totals 26 tools (18 implemented in Tier 0, 2 missing in Tier 1, 4 missing in Tier 2, 2 missing in Tier 3).
- The gap analysis description in `SKILL.md` matches the updated instantiations.
- No functional behavior of `src/index.ts` is modified; this is a documentation/alignment chore.
- The build command `npm run build` compiles successfully after modifications.
