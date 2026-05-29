# Specification: Update GEMINI.md for Generic Asana MCP Server

## Overview
The goal of this track is to update the user context file `GEMINI.md` to reflect the newly refactored, plain-vanilla, and generic state of the Asana MCP server. All CE/PM-specific scoping assumptions, hardcoded GIDs, and default parameters must be removed, and the document must be updated to guide Gemini on how to interact with a completely generic Asana bridge.

## Functional Requirements
1. **Remove CE/GCA-Specific Scoping Instructions**:
   - Delete references to the hardcoded team name `GCA GTM Team` and the team GID `1213807836434813`.
   - Remove instructions saying `get_projects()` and `get_goals()` automatically scope to the GCA team when called with no arguments.
2. **Document Required Parameters**:
   - Instruct Gemini that tools like `get_projects()`, `get_goals()`, `create_project()`, and project instantiation tools require explicit GID parameters.
   - Mandate that Gemini must always call `get_workspaces` first to obtain a workspace GID, and then use `get_teams` to dynamically list and resolve team GIDs.
3. **Keep Contextually Relevant Sections**:
   - Retain the rule to not guess GIDs.
   - Retain the Google Workspace Tools usage guidelines.

## Acceptance Criteria
- [x] No mention of `GCA_GTM_TEAM_GID`, `1213807836434813`, or `gca_gtm_` in `GEMINI.md`.
- [x] `GEMINI.md` clearly states that the server is generic and requires explicit parameters (no defaults).
- [x] `GEMINI.md` correctly lists the available tools and their generic usage workflow.
- [x] The updated instructions are clear, concise, and aligned with the actual capabilities of the refactored server.
