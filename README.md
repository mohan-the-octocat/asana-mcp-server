# Asana — Gemini CLI Extension

A Gemini CLI Extension that connects Asana to your Gmail, GChat, and other Workspace sources.
Includes a **PM Skill** that acts as an AI project manager — reading your communications and
keeping Asana up to date automatically.

---

## Extension Structure

```
asana-mcp-server/
├── gemini-extension.json          ← Extension manifest
├── GEMINI.md                      ← Always-on model context
├── src/index.ts                   ← Asana MCP server
│
├── skills/pm/
│   ├── SKILL.md                   ← PM Agent Skill
│   └── references/
│       ├── signal-taxonomy.md     ← CE signal classification guide
│       └── task-template.md       ← Asana task naming conventions
│
└── commands/
    ├── pm-sync.toml               ← /pm:sync slash command
    └── pm-brief.toml              ← /pm:brief slash command
```

---

## Asana Tools

| Tool | Description |
|---|---|
| `get_workspaces` | List all your Asana workspaces |
| `get_projects` | List all projects in a given workspace |
| `get_tasks` | List tasks in a specific project |
| `get_task_details` | Retrieve full details of a specific task |
| `create_task` | Create a new task in your workspace/project |
| `get_goals` | List goals within a workspace or team |
| `get_goal_details` | Retrieve full details of a specific goal |

---

## PM Skill

The PM Skill orchestrates Gmail, GChat, and Asana tools to act as your project manager.

### Slash Commands

| Command | Description |
|---|---|
| `/pm:sync [days]` | Scan last N days of Gmail & GChat, create Asana tasks for action items |
| `/pm:brief` | Read-only morning digest — Asana tasks + inbox highlights |

### How It Works

1. Reads Gmail and GChat via the Google Workspace MCP (must be installed separately)
2. Classifies signals using a CE-specific taxonomy (pre-sales: POCs, blockers, competitive; post-sales: adoption, renewal risk, expansion)
3. Deduplicates against existing Asana tasks
4. Creates tasks with consistent naming: `[TAG] Description — Customer`
5. Outputs a structured summary of everything it did

---

## Setup

### Prerequisites
- Node.js 18+
- An Asana Personal Access Token (Asana → My Settings → Apps → Personal Access Tokens)
- Gemini CLI installed
- Google Workspace MCP extension installed and authenticated (for the PM Skill)

### Install as Gemini CLI Extension

```bash
# Build the server
npm install
npm run build

# Link locally for development
gemini extensions link .

# OR install from GitHub
gemini extensions install https://github.com/<your-username>/asana-mcp-server
```

On first use, Gemini CLI will prompt for your `ASANA_ACCESS_TOKEN`.

### Verify
```bash
/skills list     # should show: pm
/commands list   # should show: pm:sync, pm:brief
```

---

## Testing with MCP Inspector

```bash
ASANA_ACCESS_TOKEN=<your-token> npx @modelcontextprotocol/inspector node dist/index.js
```

## Features

- **get_workspaces**: List all your Asana workspaces.
- **get_projects**: List all projects in a given workspace.
- **get_tasks**: List tasks in a specific project.
- **get_task_details**: Retrieve comprehensive details of a specific task.
- **create_task**: Create a new task in your workspace/project.
- **get_goals**: List goals within a specific workspace or team.
- **get_goal_details**: Retrieve comprehensive details of a specific goal.

## Setup

1. **Clone and Install:**
   ```bash
   git clone <repository-url>
   cd asana-mcp-server
   npm install
   npm run build
   ```

2. **Get an Asana Personal Access Token:**
   - Go to Asana -> My Settings -> Apps -> Manage Developer Apps -> Personal Access Tokens
   - Create a new token and save it.

## Configuration (Claude Desktop)

To use this with Claude Desktop, you must configure your `claude_desktop_config.json` file.

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Add the following to the `mcpServers` object, replacing `<ABSOLUTE_PATH_TO_ASANA_MCP_SERVER>` with the actual path to this repository, and `<YOUR_ASANA_PAT>` with your token:

```json
{
  "mcpServers": {
    "asana": {
      "command": "node",
      "args": ["<ABSOLUTE_PATH_TO_ASANA_MCP_SERVER>/dist/index.js"],
      "env": {
        "ASANA_ACCESS_TOKEN": "<YOUR_ASANA_PAT>"
      }
    }
  }
}
```

Restart Claude Desktop to load the new server.

## Testing with MCP Inspector

You can test the server locally using the official MCP inspector:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

*(Ensure you pass your `ASANA_ACCESS_TOKEN` environment variable when running the inspector).*