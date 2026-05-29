# Asana Project Structure — GCA GTM CE Practice

## Guiding Principles

1. **No project overhead for unqualified engagements** — tasks until there's a buying signal
2. **One project per customer** once qualified — full lifecycle in one place
3. **Stage = Section**, not separate projects — customers travel through stages within their project
4. **Everything visible in two dashboards** — daily scrum (operational) + portfolio (strategic)
5. **Opstree architects** have access only to projects they're assigned to

---

## Overall Workspace Layout

```
GCA GTM Team Workspace
│
├── 📋 "CE Pipeline"                    ← Tier 1: All pre-project opportunities
│   Sections:
│   ├── 🎤 Awareness Sessions
│   ├── 🔍 Pre-Sales
│   └── 🗄️  Closed (Won → Promoted / Lost / No Interest)
│
├── 📋 "CE Ops — Daily Scrum"           ← Operational scrum board
│
├── 📁 Portfolio: "CE Accounts"         ← Tier 2: All active customer projects
│   ├── 📋 "Acme Corp"    [Hyper-Care]
│   ├── 📋 "TechCo"       [Steady-State]
│   └── 📋 "GlobalBank"   [Steady-State]
│
└── 📁 Portfolio: "CE Pipeline View"    ← Leader dashboard (CE Pipeline + Accounts combined)
```

---

## Custom Fields (Organisation-Level — Applied to All Projects)

| Field | Type | Values / Notes |
|---|---|---|
| `Stage` | Single-select | Awareness · Pre-Sales · POC · Hyper-Care · Steady-State |
| `Customer Health` | Single-select | 🟢 Green · 🟡 Yellow · 🔴 Red · ⚪ Not Started |
| `Outcome` | Single-select | Active · Promoted · Closed-Won · Closed-Lost · No Interest |
| `ARR Potential` | Currency (USD) | Estimated deal size |
| `Field Service Rep` | Text | Name of the Seller / Account Executive owning the deal |
| `Platform CE` | Text | Name of the Tech Sales Engineer supporting the deal |
| `Technical Account Manager` | Text | TAM assigned for post-sales. Populated from Hyper-Care stage onwards. |
| `Sales Motion` | Single-select | GCA Standalone · Gemini Enterprise |
| `Opstree Lead` | People | Assigned Opstree architect |
| `CE Owner` | People | Always you for now; supports future CE team growth |
| `Next Key Date` | Date | Next milestone (session date, decision date, QBR, renewal) |
| `Risk Flag` | Single-select | None · At Risk · Blocked · Escalated · Going Cold |
| `Vector Expert Request` | Text (URL) | Link to Vector ER. Required within 7 days for Pre-Sales and POC stages. |
| `Vector Opportunity / Workload` | Text (URL) | Link to the CRM opportunity record in Vector. Apply from Pre-Sales onwards. |
| `WAU Adoption %` | Number (0–100) | Latest weekly active user adoption %. Tier 2 only. Updated monthly. |

### Org-Level Fields Summary (17 total)

```
[Ownership & People]
├── CE Owner                         [Always required]
├── Opstree Lead                     [Assigned architect]
├── Field Service Rep                [The Seller / AE]
├── Platform CE                      [Tech Sales Engineer]
└── Technical Account Manager        [Post-sales only: Hyper-Care & Steady-State]

[Deal Metadata]
├── Stage                            [All 5 values]
├── Sales Motion                     [GCA Standalone · Gemini Enterprise]
├── ARR Potential ($K)
├── Vector Expert Request            [URL — Rule flags if missing after 7 days]
├── Vector Opportunity / Workload    [CRM opportunity URL — Pre-Sales onwards]
├── Contract Start Date              [Tier 2 only]
└── Renewal Date                     [Tier 2 only]

[Status & Tracking]
├── Customer Health
├── Outcome
├── Risk Flag                        [None · At Risk · Blocked · Escalated · Going Cold]
├── Next Key Date
└── WAU Adoption %                   [Number 0–100. Tier 2 only. Drives Goal 3.]
```

---

## Asana Automation Rules

> **Plan requirement:** Time-based triggers require **Asana Business** plan or higher.
> **API note:** Rules cannot be created via the Asana API — must be configured in Asana UI.
> **Setup strategy:** Rules are defined once in a **Project Template**, then inherited automatically by every new customer project created from that template.

---

### Tier 1 Rules — "CE Pipeline" project *(task-level)*

#### Rule 1a — Flag Missing Vector ER

```
Trigger:    7 days after task is created

Conditions: "Vector Expert Request" field is empty
            AND "Stage" is one of [Pre-Sales, POC]

Actions:
  1. Set "Risk Flag" → "At Risk"
  2. Add comment: "⚠️ Vector Expert Request not submitted.
                   An ER is required for Pre-Sales and POC engagements
                   within 7 days. Please add the Vector ER URL."
  3. Notify CE Owner
```

#### Rule 1b — Clear Risk Flag When ER Submitted

```
Trigger:    "Vector Expert Request" field changes (empty → any value)

Condition:  "Risk Flag" is "At Risk"

Actions:
  1. Set "Risk Flag" → "None"
  2. Add comment: "✅ Vector ER received. Risk flag cleared."
```

---

### Tier 2 Rules — Customer Project Template *(project-level)*

These rules are configured **once on the Project Template**, then inherited by every new customer project automatically.

#### Rule 2a — Flag Missing Vector ER

```
Trigger:    7 days after project is created

Conditions: "Vector Expert Request" field is empty
            AND "Stage" is "POC"

Actions:
  1. Set "Risk Flag" → "At Risk"
  2. Add comment to POC Kickoff task: "⚠️ Vector Expert Request not submitted.
                                        An ER is required within 7 days of POC start.
                                        Please add the Vector ER URL to this project."
  3. Notify CE Owner
```

#### Rule 2b — Clear Risk Flag When ER Submitted

```
Trigger:    "Vector Expert Request" field changes (empty → any value)

Condition:  "Risk Flag" is "At Risk"

Actions:
  1. Set "Risk Flag" → "None"
  2. Add comment: "✅ Vector ER received. Risk flag cleared."
```

---

### Rule Coverage Summary

| Rule | Applies To | Trigger | Stage Scope |
|---|---|---|---|
| Flag missing ER | CE Pipeline | Task ≥ 7 days old | Pre-Sales, POC |
| Clear on ER filed | CE Pipeline | Task field change | Any |
| Flag missing ER | Customer projects (template) | Project ≥ 7 days old | POC |
| Clear on ER filed | Customer projects (template) | Project field change | Any |
| Awareness going cold | CE Pipeline | Task ≥ 10 days old | Awareness |
| Auto-create project | CE Pipeline | Stage field → POC | Pre-Sales → POC |

---

### Tier 1 Rule — Awareness Going Cold *(CE Pipeline, task-level)*

#### Rule 3 — Flag Stale Awareness Tasks

```
Trigger:    10 days after task is created

Conditions: "Stage" is "Awareness"
            AND task is not complete

Actions:
  1. Set "Risk Flag" → "Going Cold"
  2. Add comment: "🧊 This awareness opportunity has had no stage progression in 10 days.
                   Consider following up with the field rep or closing the opportunity."
  3. Notify CE Owner
```

---

### Tier 1 Rule — Auto-Create Customer Project on POC Confirmation *(CE Pipeline, task-level)*

#### Rule 4 — Scaffold Tier 2 Project When Stage → POC

> **Plan requirement:** Asana Business/Enterprise. The "Create a project" action is available in Asana’s rule builder.

```
Trigger:    "Stage" field changes to "POC"
            (i.e. CE updates the pipeline task stage from Pre-Sales → POC)

Conditions: "Outcome" is "Active"

Actions:
  1. Create a new project from the Customer Project Template
     — Project name: <task name> (auto-populated from the pipeline task)
  2. Set project custom fields from pipeline task:
     — Stage → POC
     — ARR Potential → copy from task
     — Field Service Rep → copy from task
     — Platform CE → copy from task
     — Sales Motion → copy from task
     — Vector Opportunity / Workload → copy from task
  3. Add project to "CE Accounts" portfolio
  4. Assign CE Owner to the new project
  5. Add comment to pipeline task: "🟢 Tier 2 project created: [link]. Task moved to Closed."
  6. Set pipeline task Outcome → "Promoted"
  7. Move pipeline task to 🗄️ Closed section
```

> **Note:** Asana’s rule builder does not support copying field values between tasks and projects natively in all plan tiers. Steps 2–4 may need to be done manually after project creation. The extension’s future `create_project` tool can automate this fully via API.


## Tier 1 — "CE Pipeline" Project

**Purpose:** Lightweight tracking of all engagements that don't yet warrant their own project.
One task per engagement. Board view with sections as columns.

### Sections & Task Lifecycle

```
🎤 Awareness Sessions → 🔍 Pre-Sales → 🗄️ Closed
                                ↓
                    (POC confirmed → graduate to Tier 2)
```

### Awareness Session Task Template

```
Task name: [AWARENESS] <Company> — <Brief topic> (Field: <Rep name>)

Subtasks:
  ☐ Confirm session date & logistics with field rep       [CE]         [ASAP]
  ☐ Assign Opstree architect                              [CE]         [Day 1]
  ☐ Align on demo scope / key messages                   [CE+Opstree] [2 days before]

Top-level task (for Goal tracking — Asana Goals counts this):
  ☐ ✅ SESSION DELIVERED — <Company> awareness session   [CE+Opstree] [Session date]

Subtasks (continued):
  ☐ Capture interest signals & attendee list              [CE]         [Day after]
  ☐ Follow-up email to field rep with next steps          [CE]         [Day after]
  ☐ Decision: Promote to Pre-Sales / No Interest / TBD   [CE]         [Within 1 week]

Custom fields:
  Stage: Awareness
  Field Service Rep: <Seller name>
  Opstree Lead: <architect>
  Next Key Date: <session date>
  Customer Health: ⚪ Not Started
  Risk Flag: None → auto-set to "Going Cold" after 10 days if no progression
```

### Pre-Sales Task Template

```
Task name: [PRE-SALES] <Company> — <Use case / team>

Subtasks:
  ☐ ARR Potential confirmed & entered in Asana field      [CE]         [Day 1]  ← Goal 1
  ☐ Vector Opportunity / Workload URL added               [CE]         [Day 1]
  ☐ Initial technical discovery call                     [CE]         [Week 1]
  ☐ Document requirements & current stack                [CE]         [Week 1]
  ☐ Map requirements to GCA capabilities                 [CE]         [Week 2]
  ☐ Identify stakeholders (sponsor, IT, security)        [CE]         [Week 2]
  ☐ Competitive landscape noted                          [CE]         [Week 2]
  ☐ Assess security/compliance requirements              [CE]         [Week 3]
  ☐ POC scope & success criteria agreed                  [CE+Customer][Week 3-4]
  ☐ Decision: Start POC / No Interest / Stalled          [CE]         [Week 4]

Custom fields:
  Stage: Pre-Sales → update to POC to auto-trigger project creation (Rule 4)
  ARR Potential: $___
  Field Service Rep: <Seller name>
  Vector Opportunity / Workload: <CRM URL>
  Next Key Date: <decision date>
  Customer Health: ⚪ / 🟢 / 🟡
```

### Graduation / Closure Rules

| Outcome | Action |
|---|---|
| Awareness → customer interested | Move task to Pre-Sales section, update Stage field |
| Awareness → no interest | Move task to Closed, set Outcome = No Interest |
| Pre-Sales → POC confirmed | Create Tier 2 project, move task to Closed (Outcome = Promoted) |
| Pre-Sales → lost / stalled | Move task to Closed, set Outcome = Closed-Lost |

---

## Tier 2 — Customer Projects (One Per Qualified Opportunity)

**Created when:** POC is confirmed OR deal is signed (whichever comes first).  
**Template:** Based on entry stage — Hyper-Care if signed, POC if still evaluating.  
**View:** List view (primary) + Timeline view for key dates.

### Sections Within Every Customer Project

```
📋 <Customer Name>
├── Section: 🧪 POC              ← Only if project starts at POC stage
├── Section: 🚀 Hyper-Care       ← First 90 days post-signature
├── Section: 📈 Steady-State     ← Ongoing adoption
└── Section: 🗄️  Archive         ← Completed/closed tasks
```

The project opens with the relevant section active. Future sections are created but left empty until the customer graduates to that stage.

---

### POC Template (Section)

> Created when: Pre-Sales opportunity reaches POC confirmation.

```
Section: 🧪 POC  (Target duration: 4–6 weeks)

Milestones:
  ◆ POC Kickoff                                          [CE]         [Day 1]
  ◆ POC Completion                                       [CE]         [Week 4-6]

Tasks:
  ☐ POC environment provisioned (licenses/access)        [CE + IT]    [Day 1-2]
  ☐ Opstree architect assigned & briefed                 [CE]         [Day 1]
  ☐ POC kickoff meeting with customer engineering        [CE+Opstree] [Day 2-3]
  ☐ POC success criteria sign-off doc shared & agreed   [CE+Customer][Day 3-5]
    → Attach signed doc to this task (PDF / Google Doc link)
    → Fields to capture: success metrics, pilot group size, exit criteria, decision timeline
  ☐ GCA plugin deployed to pilot group (10–20 devs)      [Opstree+IT] [Day 5-7]
  ☐ Mid-POC check-in (blockers, feedback)                [CE]         [Week 2]
  ☐ Adoption metrics from POC collected                  [CE]         [Week 3]
  ☐ POC results documented                               [CE+Opstree] [Week 3-4]
  ☐ Executive readout / go-forward recommendation        [CE]         [Week 4-5]
  ☐ Commercial proposal submitted                        [AE]         [Week 5]
  ☐ Decision: Closed-Won / Closed-Lost                   [CE]         [Week 5-6]
```

---

### Hyper-Care Template (Section)

> Created when: Deal signed. High-touch first 90 days.

```
Section: 🚀 Hyper-Care (Day 0 – Day 90)

Milestones:
  ◆ Kickoff Complete                                     [CE]         [Day 5]
  ◆ Plugin Deployed                                      [Opstree]    [Day 14]
  ◆ 30-Day Adoption Report                               [CE]         [Day 30]
  ◆ 60-Day Health Check                                  [CE]         [Day 60]
  ◆ Graduation to Steady-State                           [CE]         [Day 90]

Tasks:
  [Kickoff]
  ☐ Internal handoff (CE → Opstree → TAM)               [CE]         [Day 1]
  ☐ Customer kickoff call                                [CE+Opstree] [Day 3]
  ☐ Technical onboarding plan shared                     [Opstree]    [Day 5]
  ☐ Admin console setup & license provisioning           [Opstree]    [Day 7]
  ☐ Admin sessions delivered (IT/admin team training)    [Opstree]    [Day 7-14]
  ☐ Enablement sessions conducted (dev team onboarding)  [Opstree]    [Day 14-30]

  [Integration]
  ☐ IDE plugin deployment plan agreed with IT            [Opstree+IT] [Day 7-10]
  ☐ Pilot group rollout (10–20 devs)                     [Opstree+IT] [Day 14]
  ☐ VPC-SC / proxy configuration (if needed)             [Opstree]    [Day 10-14]
  ☐ Coding standards & prompt guidance shared            [Opstree]    [Day 14]

  [Adoption Activation]
  ☐ First adoption metrics collected                     [CE]         [Day 21]
  ☐ Developer feedback session                           [CE+Opstree] [Day 21]
  ☐ Enablement workshop delivered                        [Opstree]    [Day 28]
  ☐ 30-day adoption report                               [CE]         [Day 30]
  ☐ Broader rollout (full team)                          [Opstree]    [Day 35-45]
  ☐ 60-day health check                                  [CE]         [Day 60]
  ☐ Blockers resolved (policy, proxy, UX)                [Opstree]    [Ongoing]

  [Graduation Check]
  ☐ WAU adoption ≥ 60% confirmed                         [CE]         [Day 75]
  ☐ First QBR scheduled                                  [CE]         [Day 80]
  ☐ Opstree ongoing scope agreed                         [CE+Opstree] [Day 85]
  ☐ Mark project stage: Steady-State                     [CE]         [Day 90]
```

---

### Steady-State Template (Section)

> Created when: Customer graduates from Hyper-Care (Day 90+).

```
Section: 📈 Steady-State

Recurring Tasks (set as repeating in Asana):
  ☐ Monthly adoption metrics pull                        [CE]         [1st of month]
  ☐ Champion check-in call                               [CE]         [Monthly]
  ☐ Update Customer Health field                         [CE]         [Monthly]
  ☐ Watch for WAU drop >10%                              [Opstree]    [Weekly]

QBR Cycle (Quarterly — clone for each QBR):
  ☐ Pull usage data from GCA admin console               [Opstree]    [2 weeks before]
  ☐ Draft QBR deck (usage, wins, roadmap, asks)          [CE+Opstree] [1 week before]
  ☐ QBR review call with sponsor/leadership              [CE]         [QBR date]
  ☐ Capture action items from QBR                        [CE]         [Day of QBR]
  ☐ Update Asana tasks for all action items              [CE]         [Day after]

Expansion:
  ☐ Expansion signal identified (new team/use case)      [CE]
  ☐ Expansion discovery call                             [CE]
  ☐ Commercial expansion discussion                      [AE+CE]

Renewal:
  ☐ Renewal date logged in Next Key Date field           [CE]         [Day of contract]
  ☐ 90-day pre-renewal health check                      [CE]
  ☐ Renewal risk assessment (update Health field)        [CE]
  ☐ Renewal confirmed / at-risk escalated                [CE+AE]
```

---

## Daily Scrum Dashboard — "CE Ops — Daily Scrum"

**Project type:** Board view  
**Purpose:** Visual standup — what's blocked, in flight, done

```
Columns:
┌──────────────────┬─────────────────────┬────────────────────┬──────────────┐
│ 🎤 This Week     │ 🟡 In Progress      │ 🔴 Blocked/At Risk │ ✅ Done      │
│ (Awareness +     │ (Active tasks from  │ (Flagged tasks     │ (Closed this │
│  upcoming calls) │  all accounts)      │  across accounts)  │  week)       │
└──────────────────┴─────────────────────┴────────────────────┴──────────────┘
```

Tasks here are **multi-homed** from individual customer projects — they live in both places simultaneously. No duplication of data.

**Daily scrum flow:**
1. Review 🔴 Blocked column — assign owner, set resolution date
2. Walk 🟡 In Progress by Opstree architect (each person calls out their items)
3. Review 🎤 upcoming awareness sessions for the week
4. Anything new from the previous day moves from Inbox → appropriate column

---

## Leader Dashboard — "CE Accounts" Portfolio

**Portfolio view:** List, grouped by Stage, sorted by Next Key Date

```
┌─────────────────┬─────────────┬─────────┬─────────────┬────────────┬──────────┬──────────┐
│ Account         │ Stage       │ Health  │ ARR ($K)    │ WAU %      │ Next Date│ Risk     │
├─────────────────┼─────────────┼─────────┼─────────────┼────────────┼──────────┼──────────┤
│ Acme Corp       │ POC         │ 🟢      │ $500        │ —          │ Readout  │ None     │
│ TechCo          │ Hyper-Care  │ 🟡      │ $250        │ 42%        │ 30-day   │ Blocked  │
│ GlobalBank      │ Steady-State│ 🟢      │ $1,200      │ 71%        │ QBR Jun  │ None     │
│ RetailCo        │ Steady-State│ 🔴      │ $750        │ 28%        │ Check-in │ At Risk  │
└─────────────────┴─────────────┴─────────┴─────────────┴────────────┴──────────┴──────────┘
```

**Sharing:** Share portfolio as a read-only link — no Asana login required for leaders.  
**Export:** PDF or CSV from portfolio menu for async weekly update emails.

---

## Team Ownership Model

| Role | Project Access | Asana Role |
|---|---|---|
| CE (you) | All projects + portfolio | Full Member |
| Opstree Architect A | Assigned customer projects only | Member |
| Opstree Architect B | Assigned customer projects only | Member |
| Field Sales Reps | None (update CE directly) | No access |
| Leaders | Portfolio read-only link | Guest / link viewer |

**Assignment rule:** When a customer project is created, add the relevant Opstree architect as a project member and set the `Opstree Lead` custom field. This is the only access gate needed.

---

## Stage Transition Summary

```
Field ping
    → Create [AWARENESS] task in CE Pipeline / Awareness section
          ↓ Customer interested
    → Move task to Pre-Sales section, update Stage field
          ↓ POC confirmed
    → Create dedicated Customer Project (POC template)
    → Close pipeline task (Outcome = Promoted)
          ↓ Deal signed
    → Add Hyper-Care section to customer project
          ↓ Day 90 / WAU ≥ 60%
    → Add Steady-State section to customer project
          ↓ Renewal / Expansion
    → Stays in same project, new tasks added
          ↓ Closed-Lost (at any stage)
    → Archive project, set Outcome = Closed-Lost
    → Portfolio filters it out; data preserved
```

---

## Goals — GCA GTM CE Practice

### Goal Hierarchy

```
🎯 GCA GTM Team (Annual)
└── 🎯 CE Portfolio — Mohan (Quarterly)
    ├── 🎯 Goal 1: Generate $2.5M qualified pipeline
    ├── 🎯 Goal 2: Kick off 4 new POCs
    ├── 🎯 Goal 3: Achieve ≥65% avg WAU adoption
    ├── 🎯 Goal 4: Graduate 2 accounts from Hyper-Care
    └── 🎯 Goal 5: Deliver 6 awareness sessions with Opstree
```

---

### Goal Details & Tracking

#### Goal 1 — Generate $2.5M Qualified Pipeline

| Attribute | Value |
|---|---|
| Measurement type | Number (count of qualified opportunities) |
| Time period | Quarterly |
| Linked projects | CE Pipeline (Tier 1) |
| Data signal | `ARR Potential` field populated on active Pre-Sales + POC tasks |
| Tracking method | ⚠️ Manual — update Goal progress weekly (Asana cannot auto-sum currency fields) |
| Key template change | `☐ ARR Potential confirmed & entered` added as first subtask in Pre-Sales template |
| Helper | `/pm:weekly-report` will calculate and surface portfolio ARR total |

#### Goal 2 — Kick Off 4 New POCs

| Attribute | Value |
|---|---|
| Measurement type | Number (count of POC kickoffs) |
| Time period | Quarterly |
| Linked projects | All Tier 2 customer projects |
| Data signal | `◆ POC Kickoff` milestone marked complete in 🧪 POC section |
| Tracking method | ✅ Automatic — Asana Goal counts milestone completions across linked projects |
| Key template change | None — milestone already exists |

#### Goal 3 — Achieve ≥65% Average WAU Adoption

| Attribute | Value |
|---|---|
| Measurement type | Number (portfolio average %) |
| Time period | Quarterly (measured monthly) |
| Linked projects | All Tier 2 customer projects |
| Data signal | `WAU Adoption %` custom field, updated via monthly recurring task |
| Tracking method | ⚠️ Manual — CE updates Goal progress when completing monthly metrics task |
| Supporting signals | `Customer Health` field (Green = meeting target), `☐ WAU adoption ≥ 60% confirmed` task |
| Key template change | `WAU Adoption %` added as 16th custom field (Tier 2 only) |

#### Goal 4 — Graduate 2 Accounts from Hyper-Care to Steady-State

| Attribute | Value |
|---|---|
| Measurement type | Number (count of graduations) |
| Time period | Quarterly |
| Linked projects | All Tier 2 customer projects |
| Data signal | `◆ Graduation to Steady-State` milestone marked complete in 🚀 Hyper-Care section |
| Tracking method | ✅ Automatic — Asana Goal counts milestone completions across linked projects |
| Key template change | None — milestone already exists |

#### Goal 5 — Deliver 6 Awareness Sessions with Opstree

| Attribute | Value |
|---|---|
| Measurement type | Number (count of sessions delivered) |
| Time period | Quarterly |
| Linked projects | CE Pipeline (Tier 1) |
| Data signal | `☐ ✅ SESSION DELIVERED` top-level task marked complete per awareness engagement |
| Tracking method | ⚡ Semi-automatic — Asana Goal counts task completions in linked project |
| Key template change | Session delivery promoted from subtask to top-level task in Awareness template |

---

### Goal Automation Summary

| Goal | Method | Asana Feature Used | Template Change |
|---|---|---|---|
| 1 — Pipeline ARR | ⚠️ Manual weekly | Goal progress manually set | Add ARR subtask to Pre-Sales |
| 2 — POC Kickoffs | ✅ Automatic | Milestone completion count | None |
| 3 — WAU Adoption | ⚠️ Manual monthly | Goal progress + WAU % field | Add WAU Adoption % field |
| 4 — HC Graduation | ✅ Automatic | Milestone completion count | None |
| 5 — Awareness Sessions | ⚡ Semi-auto | Task completion count | Promote session task to top-level |
