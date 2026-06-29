# Heuristic Evaluation — HomeFixr
*HCI Deliverable (Iteration 12). Expert evaluation against Nielsen's 10 usability heuristics.*

## Method
An expert (developer-evaluator) inspected the implemented application screen by
screen against Jakob Nielsen's 10 usability heuristics. Each issue is rated on
Nielsen's **severity scale**:

| Rating | Meaning |
|---|---|
| 0 | Not a usability problem |
| 1 | Cosmetic — fix if time permits |
| 2 | Minor — low priority |
| 3 | Major — high priority |
| 4 | Catastrophe — must fix |

Screens evaluated: Landing, Register, Login, Dashboard, Post-a-Job, Browse Jobs,
Job Detail (bids, payment, chat, review), Verification, Notifications, Admin
(overview, verification queue, fraud, users, jobs).

---

## 1. Findings per heuristic

### H1 — Visibility of system status — *Strong*
- Loading states ("Loading…"), button "Please wait…" while submitting, status
  badges everywhere (job status, bid status, payment HELD/RELEASED, verification),
  unread-notification count in the nav. **No issues ≥ 2.**

### H2 — Match between system and the real world
- Plain language used throughout ("Pay into escrow", "Mark work as done",
  "Verified"). Role choice uses real-world phrasing ("Hire a professional" /
  "Offer my services").
- **Finding (severity 1):** "PKR" currency is implicit in some inputs; a label or
  prefix inside money inputs would reinforce it. *Recommendation:* add a "PKR"
  affix to amount fields.

### H3 — User control and freedom
- Cancel buttons on forms; "Back to jobs" links; edit/cancel an open job; dispute
  path for payments; logout always available.
- **Finding (severity 2):** destructive actions confirm via `window.confirm`,
  which cannot be styled or fully keyboard-themed. *Recommendation:* replace with
  the design-system Modal in a future pass (tracked for polish).

### H4 — Consistency and standards — *Strong*
- One component library (Button, Input, Textarea, Badge, StarRating) reused on
  every screen; one nav; one error shape from the API. **No issues ≥ 2.**

### H5 — Error prevention — *Strong*
- Client constraints (`required`, `min`, number types) + server-side Zod
  validation; constrained category Select; confirm dialogs before
  accept-bid / release / dispute / cancel; one-bid-per-job and ordering guards
  in the escrow flow.

### H6 — Recognition rather than recall
- Persistent role-aware navigation; visible statuses; the provider's existing bid
  is shown instead of an empty form; the AI price hint reduces guesswork.
- **Finding (severity 1):** notifications show a message but not a relative
  timestamp. *Recommendation:* add "2h ago" style timestamps.

### H7 — Flexibility and efficiency of use
- Browse filters (category + location); role-based dashboards surface the most
  common next action; admin sub-tabs.
- **Finding (severity 2):** no keyboard shortcuts for power users (e.g. admin
  triage). *Recommendation:* optional; low priority for this audience.

### H8 — Aesthetic and minimalist design — *Strong*
- Restrained palette, generous spacing, one primary action per screen, progressive
  disclosure (AI hint, photos optional).

### H9 — Help users recognise, diagnose, and recover from errors
- Inline `role="alert"` messages in plain language; non-revealing login error;
  server messages surfaced verbatim for client errors.
- **Finding (severity 1):** a generic network failure shows a generic message;
  could suggest "check your connection and retry".

### H10 — Help and documentation
- Empty states act as inline help ("No bids yet — we'll notify you…",
  "Chat opens once a provider is hired"); a "How it works" concept exists on the
  landing page.
- **Finding (severity 2):** no dedicated Help/FAQ page. *Recommendation:* add a
  short FAQ before final submission.

---

## 2. Severity summary

| Severity | Count | Examples |
|---|---|---|
| 4 — Catastrophe | 0 | — |
| 3 — Major | 0 | — |
| 2 — Minor | 4 | window.confirm styling, no shortcuts, no Help page, (H3/H7/H10) |
| 1 — Cosmetic | 4 | PKR affix, timestamps, network-error copy |
| 0 | — | majority of checks pass |

**No major or catastrophic issues.** The remaining items are minor/cosmetic and
are listed as polish for final submission.

## 3. Prioritised recommendations
1. Add a short **Help/FAQ** page (H10).
2. Replace `window.confirm` with the styled **Modal** component (H3).
3. Add **PKR affixes** to money inputs and **relative timestamps** to
   notifications (H2, H6).
4. Friendlier **network-error** copy (H9).

These are tracked for the final polish pass and do not block the core tasks.

## 4. Heuristic coverage (design-system level)
The design system was built to satisfy these heuristics structurally — see the
[Design System heuristic map](03-design-system.md#9-heuristic-coverage-map),
which this evaluation confirms in the running product.
