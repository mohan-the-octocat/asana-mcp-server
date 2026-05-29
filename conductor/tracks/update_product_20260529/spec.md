# Specification: Update product.md to reflect current project capabilities

## 1. Overview
The goal of this track is to update `conductor/product.md` to capture all the currently implemented capabilities of the Asana MCP server and the PM Skill. The current product definition is outdated and misses key technical capabilities such as custom field management, section management, project templates, scaffolding from definitions, and the specific classification/deduplication workflows of the PM Skill.

## 2. Requirements

### 2.1 Update Vision and Success Metrics
- **Vision:** Update to encompass automated setup, project instantiation, and administrative workflows (e.g. workspace custom fields schema setup, project scaffolding).
- **Success Metrics:** Include metrics for automated setup, admin workflow efficiency, and reduced overhead for setting up new customer pipelines.

### 2.2 Comprehensive Feature Matrix
- Add/update the **Key Features** section to detail all implemented capabilities:
  - **Core Queries:** Workspaces, Teams, Projects, Tasks, and Goals.
  - **Task & Project Modification:** Subtask creation, task updates (name, notes, completion status, custom fields), and project creation.
  - **Section Management:** Listing and creating sections.
  - **Custom Fields Management:** Finding existing fields with name-prefix filtering (to avoid timeouts), creating organisation-level custom fields (text, number, currency, enum, etc.), and adding enum options.
  - **Project Templates:** Listing templates and instantiating projects from templates with asynchronous job polling.
  - **Declarative Scaffolding:** Creating complete project hierarchies (sections, tasks, milestones, subtasks) from a single JSON definition.

### 2.3 PM Skill & Signal Workflow
- Document the PM Skill's automated sync workflow:
  - Gmail and GChat search queries and extraction parameters.
  - Signal taxonomy classification (Action Items, Asks, Blockers, Follow-ups, Risks, Wins, Meetings).
  - Task deduplication logic to prevent duplicate tracking.
  - Standardized task naming conventions.

## 3. Acceptance Criteria
- `conductor/product.md` is updated with accurate descriptions of all 18 MCP tools and the PM Skill workflow.
- Format is clean, professional, and follows the existing document style.
- Changes are committed and tracked under the new Conductor track.
