# CE Signal Taxonomy — Gemini Code Assist GTM

This reference defines how to classify signals from Gmail and GChat communications
for a Customer Engineer supporting Gemini Code Assist pre-sales and post-sales.

---

## Pre-Sales Signals

These appear in early customer conversations, POC phases, and technical evaluations.

| Signal | Example Phrases | Asana Tag | Priority |
|---|---|---|---|
| Technical requirement / ask | "Does it support X?", "We need Y to work with Z", "Can it integrate with..." | `[ASK]` | High |
| POC / eval milestone | "We're ready to start the POC", "Can we evaluate by end of month?" | `[MILESTONE]` | High |
| Technical blocker | "We're blocked on X", "This doesn't work with our setup", "Waiting on a fix" | `[BLOCKER]` | Critical |
| Competitive concern | "We're also looking at GitHub Copilot / Codeium / Cursor", "Why Gemini over X?" | `[COMPETITIVE]` | High |
| Commitment from CE | "I'll send you the doc by Friday", "Let me set up that demo", "I'll check with the PM team" | `[ACTION]` | High |
| Follow-up needed | CE is last in a thread with no customer reply, or customer asked a question and is waiting | `[FOLLOW-UP]` | High |
| Meeting / call request | "Can we set up a call?", "Are you free Thursday?" | `[MEETING]` | Medium |
| Security / compliance ask | "We need SOC2", "What's the data residency story?", "GDPR implications?" | `[ASK]` | High |
| Pricing / procurement | "Can you share pricing?", "Our procurement team needs..." | `[ASK]` | Medium |

---

## Post-Sales Signals

These appear in onboarding, adoption, and ongoing customer health conversations.

| Signal | Example Phrases | Asana Tag | Priority |
|---|---|---|---|
| Adoption blocker | "Developers aren't using it", "IT hasn't approved the plugin", "People are going back to..." | `[BLOCKER]` | Critical |
| Expansion ask | "Can we add more seats?", "Can we extend to another team?", "What about Duet AI for Workspace?" | `[ASK]` | High |
| Renewal risk | "We're evaluating whether to renew", "Budget is tight", "Leadership is questioning the ROI" | `[RISK]` | Critical |
| Success milestone | "We've hit X% adoption", "The team loves it", "We've integrated it into CI" | `[WIN]` | Medium |
| QBR / review prep | "Our QBR is in 3 weeks", "Can you prepare usage stats?" | `[ACTION]` | High |
| Support escalation | "This is urgent", "The customer is frustrated", "P0 issue" | `[BLOCKER]` | Critical |
| Training ask | "Can you run a workshop?", "We need enablement material for X" | `[ASK]` | Medium |
| Feature feedback | "The team wishes it could do X", "One thing that's missing is Y" | `[FEEDBACK]` | Low |
| Champion engagement | CE checking in, sharing roadmap, relationship-building messages | `[ACTION]` | Medium |

---

## Signals to SKIP (Do Not Create Tasks)

- Pure FYI / informational emails with no action required
- Internal Google emails not related to a customer
- Newsletter / marketing / automated notifications
- Emails the CE has already replied to with a resolution
- Social messages / non-work GChat messages
- Duplicate or forward of an existing tracked item

---

## Confidence Thresholds

When classifying signals:
- **High confidence** (clear action, clear owner): Create task immediately
- **Medium confidence** (implied action, ambiguous owner): Create task, note ambiguity in task notes
- **Low confidence** (might be an action, might be FYI): Skip and mention in summary as "needs review"

Use the principle: **when in doubt, leave it out** — a shorter, accurate task list beats a noisy one.
