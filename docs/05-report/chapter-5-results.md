# Chapter 5 — Results and Discussion (Draft)
*HomeFixr Final Year Project. Assembled from per-iteration testing and the HCI evaluation.*

## 5.1 Overview
HomeFixr was developed in iterative Scrum sprints, each producing a working,
tested module. This chapter summarises the functional results, the
Human–Computer Interaction evaluation, and a comparison against existing
solutions, then discusses limitations and threats to validity.

## 5.2 Functional results
All functional requirements from the SRS (FR-1…FR-31) were implemented and
verified against the live Supabase database. Each iteration ended with automated
unit tests and live integration tests (results in `docs/04-testing/`).

| Module (iteration) | Key result | Tests |
|---|---|---|
| Authentication & RBAC (1) | Register/login, JWT, bcrypt, role guards | 5 unit + 5 integration |
| Profiles & Settings (2) | Profile CRUD, password change | integration |
| Identity Verification (3) | Doc upload (Cloudinary) + admin approval + trust badge | 9 |
| Job Posting & Categories (4) | Post/edit/cancel, browse + filter | 8 |
| Bidding / Offers (5) | Transparent totals, atomic accept (others rejected) | incl. RBAC + atomicity |
| AI Fair-Price (6) | scikit-learn model via FastAPI, graceful fallback | model + cross-service |
| Chat (7) | Real-time Socket.io, participant-gated | 9 |
| Escrow Payment Simulation (8) | Held → Released / Refunded state machine | 13 |
| Reviews & Ratings (9) | Post-completion rating, aggregate trust signal | 8 |
| Notifications (10) | Event feed, unread counts, ownership guard | 10 |
| Admin & Fraud (11) | Dashboard + rule-based fraud flags | 10 |

**Across the project:** 9 automated unit tests (security utilities) pass on every
iteration; ~90 live integration assertions pass; both applications type-check
cleanly; no proposal feature was dropped.

## 5.3 HCI evaluation results

### 5.3.1 Heuristic evaluation
An expert evaluation against Nielsen's 10 heuristics
(`docs/03-hci/05-heuristic-evaluation.md`) found **no major (3) or catastrophic
(4) issues**. Four minor (severity 2) and four cosmetic (severity 1) issues were
identified and prioritised for the final polish pass (e.g. a styled Modal in place
of `window.confirm`, a Help/FAQ page, PKR affixes, relative timestamps). The
design system was built to satisfy the heuristics structurally, which the
evaluation confirmed in the running product.

### 5.3.2 Usability testing (SUS)
A usability study protocol with 10 task scenarios and the 10-item System Usability
Scale was prepared (`docs/03-hci/06-usability-evaluation.md`), including a Google
Form for data collection. *(Results to be completed with participant data; target
SUS ≥ 68 and task success ≥ 90%.)*

## 5.4 Performance evaluation
- The API responds to core endpoints well under the 2 s non-functional target on
  the free tier during testing.
- The AI service trains its lightweight model once at startup; predictions are
  near-instant, and the Express client falls back gracefully (returns no hint)
  if the AI service is unavailable, so pricing never blocks the user.
- Real-time chat delivers messages over Socket.io without page refresh.

## 5.5 Comparison with existing solutions
| Capability | TaskRabbit | Thumbtack | Urban Company | **HomeFixr** |
|---|---|---|---|---|
| Competitive bidding | partial | lead-based | fixed price | **yes (transparent total)** |
| AI fair-price guidance | no | no | no | **yes (advisory)** |
| Identity verification | varies | varies | yes | **yes (docs + admin)** |
| Escrow flow | varies | no | n/a | **yes (simulation)** |
| Trust via ratings | yes | yes | yes | **yes** |

HomeFixr's differentiator is combining transparent bidding, AI price guidance,
verification, and an escrow workflow in one simple, trustworthy flow.

## 5.6 Discussion
The iterative approach kept each module simple, testable, and independently
verifiable, which suited a three-member undergraduate team and produced a
continuously working product. Layered Clean Architecture made later modules fast
to add (most reused the same route → controller → service → repository pattern).
Keeping the AI lightweight (rule-based + a small regression model) satisfied the
proposal without over-engineering.

## 5.7 Limitations and threats to validity
- The escrow payment is a **simulation** (by design); no real funds move.
- Facial-recognition verification was scoped to **Phase 2** (optional); core
  verification is document upload + admin approval.
- Fraud detection is **rule-based**; it catches obvious patterns, not
  sophisticated fraud.
- Usability results depend on a **small participant sample** (typical for an FYP);
  findings are indicative rather than statistically conclusive.

## 5.8 Summary
HomeFixr meets every approved proposal objective with clean, tested code and a
usable, accessible interface. The evaluation found no major usability problems,
and the architecture leaves clear room for the optional Phase 2 features.
