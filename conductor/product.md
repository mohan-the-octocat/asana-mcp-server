# Initial Concept
A Gemini CLI Extension that connects Asana to your Gmail, GChat, and other Workspace sources. Includes a PM Skill that acts as an AI project manager — reading your communications and keeping Asana up to date automatically.

# Product Definition: Asana MCP Server

## Vision
To provide a seamless, AI-powered bridge between communication channels (Gmail, GChat) and Asana, specifically tailored for Customer Engineers. The system automates the capture of action items and project signals, ensuring that Asana remains the single source of truth with minimal manual effort.

## Target Audience
- **Primary:** Customer Engineers (CE) supporting Gemini Code Assist.
- **Secondary:** Project Managers and Team Leads overseeing CE workstreams.

## Core Value Proposition
- **Automated Capture:** No more manual copying of "next steps" from emails or chats.
- **Contextual Intelligence:** Uses a CE-specific taxonomy to classify signals (e.g., POC blockers, renewal risks).
- **Consolidated Briefing:** Provides a high-level "morning brief" to prioritize the day.

## Key Features
1. **Workspace Sync:** Bidirectional-style awareness, pulling action items from Gmail/GChat into Asana.
2. **Signal Classification:** Automated tagging of tasks based on pre-sales and post-sales categories.
3. **Task Deduplication:** Intelligent checks to ensure duplicate tasks aren't created for the same email threads or chat topics.
4. **PM Skill:** A dedicated agentic skill that orchestrates complex workflows across tools.
5. **Standardized Task Naming:** Enforces naming conventions for consistency across large shared workspaces.

## Success Metrics
- Reduction in manual Asana entry time for CEs.
- Increase in task completion rates due to better visibility of captured signals.
- Improved accuracy of project status reports through automated updates.
