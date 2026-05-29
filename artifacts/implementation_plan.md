# PM Skill for Asana Gemini CLI Extension

## Background

You are a Customer Engineer on the GTM team for Gemini Code Assist, supporting pre- and post-sales motions. This plan builds a **Project Manager Skill** that acts as an AI-powered PM assistant — it reads your Gmail, GChat, and other connected Workspace sources, extracts actionable signals, and updates Asana automatically.

The skill is packaged as part of the existing Asana MCP server extension so everything ships as one installable unit.

---

## Architecture Overview

```
asana-mcp-server/                   ← repo root (the extension)
├── gemini-extension.json           ← [NEW] extension manifest
├── GEMINI.md                       ← [NEW] always-on model context
├── src/index.ts                    ← existing MCP server (unchanged)
├── dist/                           ← compiled output
│
├── skills/
│   └── pm/                         ← [NEW] PM Agent Skill
│       ├── SKILL.md                ← skill definition & agent instructions
│       └── references/
│           ├── signal-taxonomy.md  ← what signals map to what Asana actions
│           └── task-template.md    ← task naming / note conventions
│
└── commands/
    ├── pm-sync.toml                ← [NEW] /pm:sync  — full inbox → Asana sync
    └── pm-brief.toml               ← [NEW] /pm:brief — daily status digest
```

---

## How It Works

```
Gmail / GChat  ──► Google Workspace MCP ──┐
                                           ├──► PM Skill (orchestrator) ──► Asana MCP ──► Asana
Other Sources ──► (future MCP servers) ───┘
```

The **PM Skill** is the "brain." It knows:
1. **When to activate** — triggered by `/pm:sync`, `/pm:brief`, or naturally when the user says something like "sync my inbox to Asana"
2. **What to look for** — customer asks, follow-ups, commitments, blockers, deal signals (from SKILL.md instructions)
3. **What to do** — maps signals to specific Asana tool calls (create_task, get_projects, etc.)

The PM Skill does **not** directly call APIs — it orchestrates the MCP tools that are already connected.

---

## Prerequisites (One-Time User Setup)

The PM Skill depends on the **Google Workspace MCP servers** (official Google Developer Preview) being configured in `~/.gemini/settings.json` alongside this extension.

```json
{
  "mcpServers": {
    "gmail": {
      "command": "...",
      "env": {
        "GOOGLE_CLIENT_ID": "...",
        "GOOGLE_CLIENT_SECRET": "..."
      }
    },
    "gchat": {
      "command": "...",
      "env": {
        "GOOGLE_CLIENT_ID": "...",
        "GOOGLE_CLIENT_SECRET": "..."
      }
    }
  }
}
```

> [!IMPORTANT]
> The Workspace MCP servers are configured in the user's **global** `~/.gemini/settings.json`, NOT in the extension manifest. This is by design — the extension references them by tool name, not by owning them. The extension's `GEMINI.md` will document this dependency clearly.

---

## Proposed Changes

### Extension Root

#### [NEW] `gemini-extension.json`
The extension manifest. Declares the Asana MCP server, prompts the user for their token, and describes the extension.

```json
{
  "name": "asana",
  "version": "1.0.0",
  "description": "Asana + PM Skill — reads your Gmail & GChat, keeps Asana up to date.",
  "mcpServers": {
    "asana": {
      "command": "node",
      "args": ["${extensionPath}/dist/index.js"]
    }
  },
  "settings": [
    {
      "name": "Asana Personal Access Token",
      "description": "Create at: Asana → My Settings → Apps → Personal Access Tokens",
      "envVar": "ASANA_ACCESS_TOKEN",
      "sensitive": true
    }
  ]
}
```

#### [NEW] `GEMINI.md`
Always-on context loaded with the extension. Tells Gemini:
- What Asana tools are available and when to use them
- That the PM Skill exists and how to discover it
- That Gmail/GChat tools may also be available (from global Workspace MCP)
- Your role as a CE in GTM for Gemini Code Assist (so the model understands the domain)

---

### PM Skill

#### [NEW] `skills/pm/SKILL.md`
The heart of the feature. Structured as:
- **Frontmatter**: name, description (used by Gemini for auto-activation)
- **Role & Context**: you are a CE supporting pre/post-sales for Gemini Code Assist
- **Signal Taxonomy**: what kinds of messages map to Asana actions
  - Customer ask / feature request → `create_task` in relevant project
  - Follow-up commitment → `create_task` with due-date note
  - Deal blocker → `create_task` tagged as blocker
  - Status update from customer → note on existing task (if found)
- **Workflow Steps**: exact sequence of tool calls the agent must perform
  1. Call Gmail/GChat search tools with relevant filters
  2. Parse and classify each message
  3. De-duplicate against existing Asana tasks (via `get_tasks`)
  4. Create or annotate tasks
  5. Summarize what was done

#### [NEW] `skills/pm/references/signal-taxonomy.md`
A lookup reference the skill can read to classify signals:
- Pre-sales signals: discovery questions, POC requests, technical blockers, competitive questions
- Post-sales signals: expansion asks, support escalations, success milestones, renewal risks

#### [NEW] `skills/pm/references/task-template.md`
Standardized naming and note conventions for tasks created by the PM skill:
```
Name: [SIGNAL_TYPE] <short description> — <customer/deal name>
Notes: Source: <gmail/gchat>, Date: <date>, Context: <excerpt>
```

---

### Slash Commands

#### [NEW] `commands/pm-sync.toml`
`/pm:sync` — Full sync of recent communications → Asana

```toml
description = "Scan recent Gmail & GChat for customer signals and sync action items to Asana."
prompt = """
Activate the PM skill. 

Scan my Gmail and GChat for messages from the last {{args}} days (default: 3 days if not specified).
Look for:
- Action items I've committed to
- Customer asks or feature requests
- Technical blockers or escalations
- Follow-ups I haven't responded to

For each signal found, check if a corresponding Asana task already exists. 
If not, create one. Summarize everything you did at the end.
"""
```

#### [NEW] `commands/pm-brief.toml`
`/pm:brief` — Morning digest without mutating Asana

```toml
description = "Generate a PM status brief from recent Gmail, GChat, and open Asana tasks."
prompt = """
You are my project manager. Generate a concise morning brief for me as a Customer Engineer 
supporting Gemini Code Assist pre & post-sales.

1. Scan Gmail and GChat for new messages since yesterday.
2. List my open Asana tasks (across all relevant projects).
3. Highlight: what needs my attention today, upcoming deadlines, and any unactioned customer asks.

Format as a clean, prioritized daily brief. Do NOT create any new tasks — read only.
"""
```

---

## Verification Plan

### Local Dev Workflow
```bash
# 1. Build the server
npm run build

# 2. Link the extension locally
gemini extensions link .

# 3. Verify skill discovery
/skills list   # should show "pm" skill

# 4. Verify commands
/commands list  # should show pm:sync and pm:brief

# 5. Test pm:brief (read-only, safe to run without full Workspace MCP)
/pm:brief
```

### With Google Workspace MCP Connected
- Run `/pm:sync 1` and verify it reads Gmail/GChat and creates tasks in Asana
- Check that de-duplication works (run twice, no duplicate tasks)

---

## Open Questions

> [!IMPORTANT]
> **Q1: Google Workspace MCP setup** — Have you already configured Gmail and GChat MCP servers in your `~/.gemini/settings.json`? If not, would you like instructions for setting those up as part of this plan? (Requires a GCP project + OAuth client ID)

> [!IMPORTANT]
> **Q2: Asana workspace structure** — Should the PM skill always create tasks in a specific workspace/project, or should it infer the right project from context (e.g., customer name → project name)? Knowing this affects the logic in `SKILL.md`.

> [!NOTE]
> **Q3: Automation vs. confirmation** — Should `/pm:sync` create tasks silently and then show a summary, or should it show you a preview of tasks it *would* create and ask for confirmation first? A "dry-run" mode would be safer to start with.

> [!NOTE]
> **Q4: Other sources** — Beyond Gmail and GChat, are there other sources connected to your Gemini CLI instance (e.g., Google Drive docs, Calendar, Jira) that the PM skill should also scan?
