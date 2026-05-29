# Asana Task Template — CE PM Skill

This reference defines the naming and notes conventions for tasks created by the PM skill.
Consistent naming makes tasks searchable, scannable, and easy to triage.

---

## Task Name Format

```
[TAG] <action verb phrase> — <Customer / Company Name>
```

### Examples by tag:

| Tag | Example Task Name |
|---|---|
| `[ACTION]` | [ACTION] Send architecture overview doc — Acme Corp |
| `[ASK]` | [ASK] VPC-SC support for Gemini Code Assist — TechCo |
| `[BLOCKER]` | [BLOCKER] IDE plugin blocked by IT policy — GlobalBank |
| `[FOLLOW-UP]` | [FOLLOW-UP] Reply to POC feedback email — StartupXYZ |
| `[RISK]` | [RISK] Customer evaluating alternatives at renewal — MegaRetail |
| `[WIN]` | [WIN] 80% developer adoption achieved — FinServCo |
| `[MEETING]` | [MEETING] Schedule QBR prep call — EnergyGiant |
| `[MILESTONE]` | [MILESTONE] POC kickoff confirmed — InsuranceCo |
| `[COMPETITIVE]` | [COMPETITIVE] Address GitHub Copilot comparison — BankCorp |
| `[FEEDBACK]` | [FEEDBACK] Inline chat UX feedback from devs — RetailBrand |

---

## Task Notes Format

Always populate the notes field with source context so the CE has full traceability:

```
Source: Gmail | Subject: <email subject line>
Date: <YYYY-MM-DD>
From: <sender name / email>
Context: <1–2 sentence excerpt or summary of the relevant part>
```

Or for GChat:

```
Source: GChat | Space/DM: <space name or contact>
Date: <YYYY-MM-DD>
Context: <1–2 sentence excerpt or summary>
```

### Example Notes:

```
Source: Gmail | Subject: Re: Gemini Code Assist POC — Week 2 Update
Date: 2025-05-18
From: jane.doe@acmecorp.com
Context: Jane mentioned the security team is blocking the IDE plugin deployment due to an
unreviewed extension policy. They need a security overview doc before they can proceed.
```

---

## Naming Rules

1. **Always include the customer name** at the end after the em-dash (`—`). This makes it filterable.
2. **Keep the action phrase short** (5–8 words max). Save detail for Notes.
3. **Use title case** for readability.
4. **One task per signal** — don't bundle multiple asks into one task.
5. **Never include internal GIDs, email addresses, or URLs** in the task name.

---

## Project Assignment Logic

When deciding which Asana project to assign a task to:

1. **Match by customer name** — search project names for the customer/company name
2. **Match by workstream** — e.g., "Pre-Sales Pipeline", "Post-Sales Accounts", "CE Backlog"
3. **Fallback** — if no match found, assign to the most generic CE-owned project (e.g., "CE Inbox")
   and note in the summary that manual reassignment may be needed
4. **Never create a new project** — only create tasks within existing projects
