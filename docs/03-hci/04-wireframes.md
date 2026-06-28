# Wireframes — HomeFixr
*HCI Deliverable (STEP 3). Low → Mid → High fidelity, produced before coding each module.*

Wireframes progress through three fidelities:
- **Low** — structure/layout only (boxes), validates information hierarchy.
- **Mid** — real labels, components, and states; validates task flow.
- **High** — full design-system styling; rendered as an interactive visual mockup.

This file holds **low + mid fidelity** for the signature screens. High-fidelity mockups are
produced screen-by-screen as each module is built (a high-fidelity preview of the Post-a-Job
screen accompanies this deliverable).

---

## 1. Low-Fidelity — Customer Dashboard

```
┌─────────────────────────────────────────────┐
│ [logo]  Dashboard  Post Job  Messages  (🔔)(▾)│  ← persistent role nav
├─────────────────────────────────────────────┤
│  ┌───────────────────────────────────────┐  │
│  │   [ + Post a New Job ]   (primary CTA) │  │  ← top visual priority
│  └───────────────────────────────────────┘  │
│                                               │
│  My Active Jobs                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ job card │ │ job card │ │ job card │      │  ← chunked cards
│  └──────────┘ └──────────┘ └──────────┘      │
│                                               │
│  Recent Activity / Notifications              │
│  • ...                                        │
└─────────────────────────────────────────────┘
```

## 2. Mid-Fidelity — Post a Job

```
┌─────────────────────────────────────────────┐
│  Post a Job                          [ Save ] │
├─────────────────────────────────────────────┤
│  Category *   [ Plumbing ▾ ]                  │
│  Title *      [ Leaking kitchen tap        ]  │
│  Description* [                             ]  │
│               [  (multiline)               ]  │
│  Location *   [ Map pin / address          ]  │
│  Photos       [ + Upload ] [img][img]         │
│                                               │
│  ┌── AI Fair-Price Suggestion ─────────────┐  │
│  │  Estimated fair range: PKR 1,500–2,500  │  │  ← progressive disclosure
│  │  Based on category + description         │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  [ Cancel ]                 [ Post Job ▸ ]     │  ← easy reversal + primary
└─────────────────────────────────────────────┘
States: empty fields → inline validation; submitting → button spinner;
success → toast "Job posted" + redirect to job detail.
```

## 3. Mid-Fidelity — Job Detail with Bid Comparison (Customer)

```
┌─────────────────────────────────────────────┐
│  ‹ Back   Leaking kitchen tap   [OPEN] badge  │
│  [ Details ] [ Bids (3) ] [ Chat ]            │  ← tabs (secondary nav)
├─────────────────────────────────────────────┤
│  Bids (sorted: best value)                    │
│  ┌─────────────────────────────────────────┐ │
│  │ (avatar) Bilal  ✔Verified  4.8★          │ │
│  │ Rate 1,000 × 2h + Equip 800 = 2,800      │ │  ← transparent total
│  │ "I can come today."        [ Accept ▸ ]  │ │
│  └─────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────┐ │
│  │ (avatar) Other   4.2★    = 3,100  [Accept]│ │
│  └─────────────────────────────────────────┘ │
│                                               │
│  Empty state (if none): "No bids yet — we'll  │
│  notify you when providers respond."          │
└─────────────────────────────────────────────┘
Accept → confirm dialog → others auto-rejected → job IN_PROGRESS.
```

## 4. Mid-Fidelity — Provider Browse Jobs

```
┌─────────────────────────────────────────────┐
│  Browse Jobs        Filters: [Cat ▾][Loc ▾]   │
├─────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │Plumbing  │ │Electrical│ │Cleaning  │      │
│  │Leaking..│ │Wiring...│ │Deep clean│      │
│  │~PKR 2k   │ │~PKR 3k   │ │~PKR 1.5k │      │
│  │[ View ▸ ]│ │[ View ▸ ]│ │[ View ▸ ]│      │
│  └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────┘
```

## 5. Mid-Fidelity — Provider Verification

```
┌─────────────────────────────────────────────┐
│  Verification          Status: [ PENDING ]    │
├─────────────────────────────────────────────┤
│  Upload ID document *     [ + Upload ] ✓img   │
│  Upload Trade license *   [ + Upload ] ✓img   │
│                                               │
│  ⓘ An admin reviews documents within 24h.     │  ← help/expectation setting
│  [ Submit for review ]                        │
└─────────────────────────────────────────────┘
States: PENDING (warning) → VERIFIED (success badge) / REJECTED (danger + reason).
```

## 6. Mid-Fidelity — Admin Verification Queue

```
┌─────────────────────────────────────────────┐
│  Verification Queue                           │
├──────┬───────────┬──────────┬────────────────┤
│ User │ Documents │ Status   │ Actions        │
├──────┼───────────┼──────────┼────────────────┤
│ Bilal│ ID,License│ PENDING  │[Approve][Reject]│
│ Sara │ ID,License│ PENDING  │[Approve][Reject]│
└──────┴───────────┴──────────┴────────────────┘
Reject → reason dialog (help users recover / give context).
```

## 7. Escrow Payment — State Visibility

```
[ Pay (simulated) ]  →  ●─────●─────●
                       Held  (work) Released
Status chip always shown on job:  [Payment Held]  →  [Payment Released]
```

---

## 8. Fidelity Plan per Module

| Module | Low | Mid | High (rendered when built) |
|---|---|---|---|
| Dashboards | ✓ | ✓ | Iteration 12 |
| Post Job | ✓ | ✓ | This deliverable (preview) |
| Job Detail / Bids | ✓ | ✓ | Iteration 5 |
| Browse / Bid | ✓ | ✓ | Iteration 5 |
| Verification | ✓ | ✓ | Iteration 3 |
| Admin Queue | ✓ | ✓ | Iteration 11 |
| Chat | ✓ | ✓ | Iteration 7 |

High-fidelity screens are built directly as styled React components using the design system,
so the implemented UI *is* the high-fidelity prototype — avoiding throwaway mockup work (KISS).
