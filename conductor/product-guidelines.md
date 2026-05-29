# Product Guidelines: Asana MCP Server

## 1. UX & Interaction Principles
- **CE Focus:** The tool is optimized for Customer Engineers. Interactions must be fast, requiring minimal effort.
- **Actionability:** Information presented should highlight clear action items, owners, and deadlines.
- **Minimal Distraction:** Proactively deduplicate alerts. Do not flood Asana with noise.
- **Transparency:** The PM Skill must log all automated steps and provide clear, human-readable summaries of what it did.

## 2. Information Architecture & Task Structure
- **Strict Naming Convention:** All tasks created or updated by this tool must follow:
  `[TYPE] Description — Customer/Deal`
  - *Types:* `[POC]`, `[MEETING]`, `[BLOCKER]`, `[FOLLOW-UP]`, `[RISK]`, `[TASK]`
  - *Example:* `[BLOCKER] Resolve billing API access — Acme Corp/POC`
- **Metadata Enriched:** Tasks must contain links back to their sources (e.g., specific Gmail thread IDs, GChat space links) to preserve context.

## 3. Prose and Tone Guidelines
- **Clear and Professional:** Use direct, action-oriented, and objective language in briefs and summaries.
- **Scannable Layouts:** Use lists, bold text for key identifiers (Customer names, dates), and brief paragraphs.
- **No Jargon/Acronyms without Context:** Ensure that task descriptions are understandable to non-CE stakeholders (e.g. Product Managers, Account Executives).

## 4. Safety & Security
- **Data Protection:** Never retrieve or process emails or messages unless explicitly authorized.
- **Read-Only Defaults:** Tools accessing Workspace sources should read information, while Asana tools should handle modifications. Avoid unsolicited edits to communication histories.
