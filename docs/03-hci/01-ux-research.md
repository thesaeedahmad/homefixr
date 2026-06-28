# UX Research — HomeFixr
*HCI Deliverable (STEP 3). Feeds Report Chapter 5 (HCI/Usability Evaluation).*

This document applies **User-Centered Design**. It defines who we design for, what they need,
where they struggle, and how success is measured — before any screen is built.

---

## 1. Stakeholder Analysis

| Stakeholder | Interest | Influence | Needs from HomeFixr |
|---|---|---|---|
| Customer (Homeowner) | Get reliable repairs at a fair price | High | Trust, transparent pricing, easy hiring |
| Provider (Professional) | Win jobs, get paid fairly | High | Steady leads, fair bidding, fast payment |
| Administrator | Keep platform trustworthy | Medium | Efficient verification & fraud tools |
| Supervisor / Examiner | Academic quality | High (grading) | Clean SE, strong HCI, complete docs |
| Development team | Deliver within timeline | High | Simple, maintainable scope |

**Power/Interest takeaway:** Customers and Providers are *manage closely* (high power, high
interest) — the product is designed primarily around their goals; the Admin is a supporting,
efficiency-driven role.

---

## 2. User Personas

### Persona 1 — Ayesha, the Busy Homeowner (Customer)
- **Age / context:** 34, working professional, owns an apartment, low DIY skill.
- **Goals:** Fix a leaking tap quickly; not get overcharged; hire someone trustworthy.
- **Frustrations:** Doesn't know fair prices; afraid of scams; unverified workers.
- **Tech comfort:** Medium — uses apps daily, expects clean, simple interfaces.
- **Key quote:** *"I just want to know it's a fair price and the person is genuine."*
- **Design implication:** Surface trust badges, ratings, and AI fair-price guidance prominently; keep job posting to a short, guided form.

### Persona 2 — Bilal, the Skilled Electrician (Provider)
- **Age / context:** 29, certified electrician, works independently.
- **Goals:** Find steady local jobs; win bids without underpricing; get paid reliably.
- **Frustrations:** Competing blindly on price; payment delays; proving he's qualified.
- **Tech comfort:** Medium — mostly mobile; wants efficiency, not clutter.
- **Key quote:** *"Show me the right jobs and let me bid fast — and pay me when I'm done."*
- **Design implication:** Fast job browse + bid flow, transparent bid total, clear verification status and payment state.

### Persona 3 — Sana, the Platform Administrator
- **Age / context:** 27, operations role, reviews many documents per day.
- **Goals:** Approve genuine providers quickly; catch fraud; keep quality high.
- **Frustrations:** Slow manual review; unclear which accounts are risky.
- **Tech comfort:** High — wants dense, scannable queues and clear actions.
- **Key quote:** *"Give me a clean queue and let me approve or reject in two clicks."*
- **Design implication:** Table-based admin queues, clear status badges, AI fraud flags surfaced for triage.

---

## 3. Empathy Maps

### Customer (Ayesha)
- **Says:** "Is this price fair?" "Can I trust this person?"
- **Thinks:** "I don't want to overpay or get scammed."
- **Does:** Compares options, reads reviews, hesitates before paying.
- **Feels:** Anxious about trust, relieved when verification is visible.

### Provider (Bilal)
- **Says:** "Which jobs are worth my time?" "When do I get paid?"
- **Thinks:** "If I bid too low I lose money; too high I lose the job."
- **Does:** Scans new jobs, bids quickly, checks payment status.
- **Feels:** Competitive pressure; reassured by transparent totals and escrow.

---

## 4. User Stories (sprint-ready)

**Customer**
- As a customer, I want to post a job with photos and a category so providers understand the work.
- As a customer, I want a suggested fair price so I know what to expect.
- As a customer, I want to compare bids side by side so I can choose the best value.
- As a customer, I want to confirm completion so payment is released only when satisfied.
- As a customer, I want to rate a provider so others can trust the platform.

**Provider**
- As a provider, I want to verify my identity so customers trust me.
- As a provider, I want to filter jobs by category and location so I find relevant work.
- As a provider, I want to submit a bid with a transparent total so customers see the breakdown.
- As a provider, I want to see my payment status so I know when funds are released.

**Administrator**
- As an admin, I want a verification queue so I can approve/reject documents efficiently.
- As an admin, I want fraud flags so I can review risky accounts first.

---

## 5. Task Analysis (Hierarchical — "Hire a provider")

```
Goal: Customer hires a provider and gets the job done
├─ 1. Post a job
│   ├─ 1.1 Choose category
│   ├─ 1.2 Describe work + add photos
│   ├─ 1.3 View AI fair-price suggestion
│   └─ 1.4 Submit job
├─ 2. Receive & compare bids
│   ├─ 2.1 View bid list (rate, hours, equipment, total)
│   └─ 2.2 Open provider profile (rating, trust badge)
├─ 3. Accept a bid
│   └─ 3.1 Confirm → job In Progress, others rejected
├─ 4. Pay into escrow (simulated) → Payment Held
├─ 5. Communicate via chat (if needed)
├─ 6. Confirm completion → Payment Released
└─ 7. Leave a review
```

---

## 6. Context of Use

| Dimension | Description |
|---|---|
| Users | Homeowners, professionals, one admin operator |
| Tasks | Posting jobs, bidding, hiring, chatting, paying (sim), reviewing |
| Environment | Home/office; mixed desktop and mobile; variable connectivity |
| Technology | Modern browser; responsive web app; free-tier hosting |

---

## 7. User Journey Map — Customer "First Hire"

| Stage | Action | Thoughts | Emotion | Opportunity (design) |
|---|---|---|---|---|
| Discover | Lands on site | "Can this help me?" | Curious | Clear value prop on landing |
| Onboard | Registers | "Is this quick?" | Slightly impatient | Short form, role choice up front |
| Post job | Fills job form | "Am I describing it right?" | Uncertain | Guided fields + AI price hint |
| Receive bids | Compares offers | "Which is best value?" | Evaluating | Side-by-side bids + trust badges |
| Hire | Accepts bid | "Did I choose well?" | Hopeful | Confirmation + clear next steps |
| Pay | Pays into escrow | "Is my money safe?" | Cautious | Visible "Payment Held" status |
| Complete | Confirms work | "Was it done well?" | Satisfied/critical | Easy confirm + release |
| Review | Rates provider | "I want to help others" | Fulfilled | Simple 1–5 + comment |

---

## 8. Scenarios

**Scenario A (Customer):** Ayesha's kitchen tap is leaking. She posts a "Plumbing" job with two
photos. The system suggests a fair range of PKR 1,500–2,500. Three providers bid; she compares
totals and picks Bilal's verified profile (4.8★). She pays into escrow, chats to confirm timing,
and releases payment after the fix — then leaves a 5★ review.

**Scenario B (Provider):** Bilal filters for Electrical jobs nearby, opens a wiring request, and
bids PKR 2,000 (rate × hours) + PKR 800 equipment = PKR 2,800 with a short message. He's notified
when accepted, completes the work, and sees "Payment Released" the same day.

**Scenario C (Admin):** Sana opens the verification queue, reviews Bilal's ID + license, and
approves in two clicks. A fraud flag highlights an account with three duplicate-looking
registrations; she reviews and dismisses one, confirms another.

---

## 9. Competitive Analysis

| Platform | Strength | Limitation HomeFixr addresses |
|---|---|---|
| TaskRabbit | Large provider base | Opaque pricing; limited bidding transparency |
| Thumbtack | Lead generation | Providers pay for leads; trust varies |
| Urban Company | Standardized services | Fixed pricing, little negotiation/bidding |
| Local classifieds | Free, simple | No verification, no escrow, no ratings trust |

**HomeFixr differentiator:** transparent *bidding* + *AI fair-price guidance* + *verification &
escrow simulation* combined in one simple, trustworthy flow.

---

## 10. Success Metrics (for Chapter 5 evaluation)

- **SUS score** ≥ 68 (above-average usability) from a usability study.
- **Task success rate** ≥ 90% on core tasks (post job, bid, hire, pay-sim).
- **Heuristic evaluation:** no unresolved severity-3+ issues at submission.
- **Time-on-task:** posting a job completed in under 2 minutes by new users.
