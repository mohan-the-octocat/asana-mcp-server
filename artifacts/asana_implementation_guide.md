# Asana Implementation Guide — GCA GTM CE Practice

> **Reference:** See `asana_dashboard_design.md` for the full structural design, templates,
> custom field definitions, and goal-tracking logic that this guide implements.

---

## Overview

| Phase | Method | Who | Estimated Time |
|---|---|---|---|
| Initial setup (Steps 1–7) | Asana UI | CE | ~2–3 hours |
| Ongoing operations | Gemini CLI Extension | Automated | — |

**Setup dependency order:** Custom Fields → CE Pipeline → Customer Template → Rules → Scrum Board → Portfolio → Goals

---

## Phase 1 — Initial Setup (Asana UI)

### Step 1: Create Organisation-Level Custom Fields

> **Where:** Asana → Avatar (top-right) → Settings → Custom Fields → + New Field
> **Important:** Set scope to **"Organisation"** on every field so they're available across all projects and visible in Portfolio views.

Create all 17 fields in this order:

**Dropdowns (Single-select)**

| Field Name | Options |
|---|---|
| `Stage` | Awareness · Pre-Sales · POC · Hyper-Care · Steady-State |
| `Customer Health` | 🟢 Green · 🟡 Yellow · 🔴 Red · ⚪ Not Started |
| `Outcome` | Active · Promoted · Closed-Won · Closed-Lost · No Interest |
| `Risk Flag` | None · At Risk · Blocked · Escalated · Going Cold |
| `Sales Motion` | GCA Standalone · Gemini Enterprise |

**Currency / Number / Date**

| Field Name | Type |
|---|---|
| `ARR Potential` | Currency (USD) |
| `WAU Adoption %` | Number (0–100) |
| `Next Key Date` | Date |
| `Contract Start Date` | Date |
| `Renewal Date` | Date |

**Text (URL)**

| Field Name | Notes |
|---|---|
| `Vector Expert Request` | Link to Vector ER |
| `Vector Opportunity / Workload` | Link to CRM opportunity |

**Text (Plain)**

| Field Name | Notes |
|---|---|
| `Field Service Rep` | Seller / Account Executive name |
| `Platform CE` | Tech Sales Engineer name |
| `Technical Account Manager` | TAM name (post-sales only) |

**People**

| Field Name | Notes |
|---|---|
| `CE Owner` | CE managing the account |
| `Opstree Lead` | Assigned Opstree architect |

---

### Step 2: Create the "CE Pipeline" Project (Tier 1)

> **Where:** GCA GTM Team sidebar → + New Project → Blank Project

**Project settings:**
- Name: `CE Pipeline`
- Team: `GCA GTM Team`
- Default view: **Board**
- Privacy: Team members

**Add sections (Board columns — in this order):**
1. `🎤 Awareness Sessions`
2. `🔍 Pre-Sales`
3. `🗄️ Closed`

**Add custom fields to project** (Customize → Fields → Add Field):
Apply all fields from Step 1 **except** these four (Tier 2 only):
- `WAU Adoption %`
- `Contract Start Date`
- `Renewal Date`
- `Technical Account Manager`

---

### Step 3: Create the Customer Project Template (Tier 2)

> **Where:** GCA GTM Team sidebar → + New Project → Blank Project → (after setup) Save as Template

**Project settings:**
- Name: `Customer Project Template`
- Team: `GCA GTM Team`
- Default view: **List**
- Apply all 17 custom fields

**Add sections (in this order):**
1. `🧪 POC`
2. `🚀 Hyper-Care`
3. `📈 Steady-State`
4. `🗄️ Archive`

**Populate tasks in each section** (copy from design doc):

#### 🧪 POC Section *(4–6 week target)*
- ◆ **[Milestone]** POC Kickoff `[Day 1]`
- ☐ POC environment provisioned (licenses/access) `[CE + IT] [Day 1-2]`
- ☐ Opstree architect assigned & briefed `[CE] [Day 1]`
- ☐ POC kickoff meeting with customer engineering `[CE+Opstree] [Day 2-3]`
- ☐ POC success criteria sign-off doc shared & agreed `[CE+Customer] [Day 3-5]`
  - *Attach signed doc; capture: success metrics, pilot group size, exit criteria, decision timeline*
- ☐ GCA plugin deployed to pilot group (10–20 devs) `[Opstree+IT] [Day 5-7]`
- ☐ Mid-POC check-in (blockers, feedback) `[CE] [Week 2]`
- ☐ Adoption metrics from POC collected `[CE] [Week 3]`
- ☐ POC results documented `[CE+Opstree] [Week 3-4]`
- ☐ Executive readout / go-forward recommendation `[CE] [Week 4-5]`
- ☐ Commercial proposal submitted `[AE] [Week 5]`
- ☐ Decision: Closed-Won / Closed-Lost `[CE] [Week 5-6]`
- ◆ **[Milestone]** POC Completion `[Week 4-6]`

#### 🚀 Hyper-Care Section *(Day 0 – Day 90)*
- ◆ **[Milestone]** Kickoff Complete `[Day 5]`
- ◆ **[Milestone]** Plugin Deployed `[Day 14]`
- ◆ **[Milestone]** 30-Day Adoption Report `[Day 30]`
- ◆ **[Milestone]** 60-Day Health Check `[Day 60]`
- ◆ **[Milestone]** Graduation to Steady-State `[Day 90]`

*[Kickoff]*
- ☐ Internal handoff (CE → Opstree → TAM) `[CE] [Day 1]`
- ☐ Customer kickoff call `[CE+Opstree] [Day 3]`
- ☐ Technical onboarding plan shared `[Opstree] [Day 5]`
- ☐ Admin console setup & license provisioning `[Opstree] [Day 7]`
- ☐ Admin sessions delivered (IT/admin team training) `[Opstree] [Day 7-14]`
- ☐ Enablement sessions conducted (dev team onboarding) `[Opstree] [Day 14-30]`

*[Integration]*
- ☐ IDE plugin deployment plan agreed with IT `[Opstree+IT] [Day 7-10]`
- ☐ Pilot group rollout (10–20 devs) `[Opstree+IT] [Day 14]`
- ☐ VPC-SC / proxy configuration (if needed) `[Opstree] [Day 10-14]`
- ☐ Coding standards & prompt guidance shared `[Opstree] [Day 14]`

*[Adoption Activation]*
- ☐ First adoption metrics collected `[CE] [Day 21]`
- ☐ Developer feedback session `[CE+Opstree] [Day 21]`
- ☐ Enablement workshop delivered `[Opstree] [Day 28]`
- ☐ 30-day adoption report `[CE] [Day 30]`
- ☐ Broader rollout (full team) `[Opstree] [Day 35-45]`
- ☐ 60-day health check `[CE] [Day 60]`
- ☐ Blockers resolved (policy, proxy, UX) `[Opstree] [Ongoing]`

*[Graduation Check]*
- ☐ WAU adoption ≥ 60% confirmed `[CE] [Day 75]`
- ☐ First QBR scheduled `[CE] [Day 80]`
- ☐ Opstree ongoing scope agreed `[CE+Opstree] [Day 85]`
- ☐ Mark project Stage field → Steady-State `[CE] [Day 90]`

#### 📈 Steady-State Section
*Recurring (set as repeating tasks):*
- ☐ Monthly adoption metrics pull `[CE] [1st of month]`
- ☐ Champion check-in call `[CE] [Monthly]`
- ☐ Update Customer Health & WAU Adoption % fields `[CE] [Monthly]`
- ☐ Watch for WAU drop >10% `[Opstree] [Weekly]`

*QBR Cycle (clone for each quarter):*
- ☐ Pull usage data from GCA admin console `[Opstree] [2 weeks before]`
- ☐ Draft QBR deck `[CE+Opstree] [1 week before]`
- ☐ QBR review call with sponsor/leadership `[CE] [QBR date]`
- ☐ Capture & enter QBR action items in Asana `[CE] [Day of QBR]`

*Expansion:*
- ☐ Expansion signal identified `[CE]`
- ☐ Expansion discovery call `[CE]`
- ☐ Commercial expansion discussion `[AE+CE]`

*Renewal:*
- ☐ Renewal date logged in Next Key Date field `[CE]`
- ☐ 90-day pre-renewal health check `[CE]`
- ☐ Renewal risk assessment — update Health field `[CE]`
- ☐ Renewal confirmed / escalated `[CE+AE]`

**Save as Template:**
> Project options (⋯) → Save as Template → Name it `Customer Project Template`

---

### Step 4: Add Automation Rules

> **Where:** Open each project → Customize (top-right) → Rules → + Add Rule

#### Rules for "CE Pipeline" project

**Rule 1a — Flag missing Vector ER**
```
Trigger:    Task is approaching deadline  → [Use: X days after task created: 7]
Conditions: "Vector Expert Request" is empty
            AND "Stage" is Pre-Sales or POC
Actions:    Set "Risk Flag" → At Risk
            Comment: "⚠️ Vector ER not submitted. Required within 7 days."
            Notify assignee
```

**Rule 1b — Clear flag when ER submitted**
```
Trigger:    "Vector Expert Request" field value changes
Conditions: "Risk Flag" is At Risk
Actions:    Set "Risk Flag" → None
            Comment: "✅ Vector ER received. Risk flag cleared."
```

**Rule 3 — Awareness going cold**
```
Trigger:    10 days after task created
Conditions: "Stage" is Awareness
            AND task is not complete
Actions:    Set "Risk Flag" → Going Cold
            Comment: "🧊 No stage progression in 10 days. Follow up or close."
            Notify assignee
```

**Rule 4 — Auto-create customer project on POC confirmation**
```
Trigger:    "Stage" field changes to POC
Conditions: "Outcome" is Active
Actions:    Create project from "Customer Project Template"
            Set "Outcome" → Promoted
            Move task to 🗄️ Closed section
            Comment: "🟢 Tier 2 project created. Task closed."
```
> ⚠️ Manually set field values (ARR, Field Service Rep, Sales Motion, Vector Opportunity) on the new project after creation — Asana doesn't copy task fields to projects natively.

#### Rules for "Customer Project Template"

**Rule 2a — Flag missing Vector ER**
```
Trigger:    7 days after project created
Conditions: "Vector Expert Request" is empty
            AND "Stage" is POC
Actions:    Set "Risk Flag" → At Risk
            Comment on POC Kickoff task: "⚠️ Vector ER required within 7 days of POC start."
            Notify CE Owner
```

**Rule 2b — Clear flag when ER submitted**
```
Trigger:    "Vector Expert Request" field changes
Conditions: "Risk Flag" is At Risk
Actions:    Set "Risk Flag" → None
            Comment: "✅ Vector ER received. Risk flag cleared."
```

---

### Step 5: Create the "CE Ops — Daily Scrum" Project

> **Where:** GCA GTM Team sidebar → + New Project → Blank Project

**Settings:**
- Name: `CE Ops — Daily Scrum`
- Team: `GCA GTM Team`
- Default view: **Board**

**Add sections (columns):**
1. `🎤 This Week` — upcoming awareness sessions & key calls
2. `🟡 In Progress` — active tasks across all accounts
3. `🔴 Blocked / At Risk` — flagged tasks (auto-populated via multi-homing)
4. `✅ Done` — completed this week

**Multi-homing:** Add time-sensitive tasks from customer projects into this board using "Add to project" (tasks live in both places; no duplication).

---

### Step 6: Create the "CE Accounts" Portfolio

> **Where:** Sidebar → Portfolios → + New Portfolio

**Settings:**
- Name: `CE Accounts`
- Team: `GCA GTM Team`

**Add portfolio columns** (Edit columns → Add from org fields):
1. Stage
2. Customer Health
3. ARR Potential
4. WAU Adoption %
5. Next Key Date
6. Risk Flag

**Share with leaders:** Portfolio → Share → Copy link (read-only, no Asana login required)

---

### Step 7: Create Goals

> **Where:** Sidebar → Goals → + New Goal

Create the following 5 goals under a parent **"CE Portfolio — Q[X] 2025"** goal:

| Goal | Metric | Type | Linked To |
|---|---|---|---|
| Generate $2.5M qualified pipeline | Number (manual) | Quarterly | CE Pipeline project |
| Kick off 4 new POCs | Number (auto) | Quarterly | All customer projects |
| Achieve ≥65% avg WAU adoption | Number (manual) | Quarterly | All customer projects |
| Graduate 2 accounts from Hyper-Care | Number (auto) | Quarterly | All customer projects |
| Deliver 6 awareness sessions with Opstree | Number (semi-auto) | Quarterly | CE Pipeline project |

**For Goals 2 and 4 (auto-tracked):**
- Link to all Tier 2 customer projects
- Asana will count `◆ POC Kickoff` and `◆ Graduation to Steady-State` milestone completions automatically

---

## Phase 2 — Ongoing Operations (Gemini CLI Extension)

Once the initial setup is complete, day-to-day operations are handled through the extension.

### Currently Available (no changes needed)
| Command / Tool | What it does |
|---|---|
| `get_projects()` | List all GCA GTM Team projects |
| `get_tasks(project_gid)` | View tasks in any project |
| `create_task` | Create a new pipeline task or action item |
| `get_goals()` | Review current quarter goals |
| `/pm:sync` | Read Gmail/GChat and create Asana tasks from signals |
| `/pm:brief` | Generate daily CE brief from Asana + comms |

### Planned Additions (needed for full workflow automation)

| New Tool | Purpose | Priority |
|---|---|---|
| `create_project` | Scaffold new customer project from template with all fields pre-set | 🔴 High |
| `create_section` | Add sections to projects programmatically | 🔴 High |
| `update_task` | Update Stage, Health, Risk Flag fields on existing tasks/projects | 🔴 High |
| `get_portfolio_items` | List all projects in CE Accounts portfolio for weekly report | 🟡 Medium |
| `create_goal` | Create a new quarterly goal with linked projects | 🟡 Medium |

### Typical Daily Workflow Once Live
```
Morning:
  /pm:brief          → Read CE brief: urgent items, unactioned signals, Asana tasks

During day:
  "Create pre-sales task for RetailCo — $750K, Field: John Smith"
  → Extension: create_task in CE Pipeline / Pre-Sales section with fields set

  "Acme confirmed POC — kick off the project"
  → Extension: create_project from template, add to portfolio

  "Update TechCo health to Yellow — adoption dropped"
  → Extension: update_task fields on TechCo project

Evening:
  /pm:sync 3         → Scan last 3 days of Gmail/GChat, create action items
```
