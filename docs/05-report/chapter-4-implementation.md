# Chapter 4 — Implementation (Draft)

## 4.1 Approach
The system was built in iterative Scrum sprints. Each iteration delivered one
working, tested module reusing the same layered pattern
(`route → controller → service → repository → Prisma`), which kept later modules
fast to add and easy to explain. Documentation and tests were produced alongside
the code, never postponed.

## 4.2 Iteration-wise development

| Iter | Module | What was built |
|---|---|---|
| 0 | Foundation | Monorepo (web/api/ai), Prisma schema (10 entities), Tailwind design tokens, base Express + Next apps, health endpoints |
| 1 | Auth & RBAC | Register/login, bcrypt, JWT, `authenticate`/`authorize` middleware, layered auth feature; unit tests |
| — | Live DB | Connected Supabase, fixed URL encoding, ran initial migration |
| 2 | Profiles & Settings | Profile CRUD, password change |
| 3 | Verification | Cloudinary upload (multer), provider document submission, admin approval queue, trust badge; avatar upload |
| 4 | Jobs & Categories | Post/edit/cancel jobs with photos, browse + category/location filter, ownership + OPEN-only rules |
| 5 | Bidding | Server-computed transparent totals, one bid per provider, atomic accept (reject others, job → IN_PROGRESS) |
| 6 | AI Fair-Price | FastAPI + scikit-learn regression (seed dataset), Express client with 3 s timeout and graceful fallback, UI price hints |
| 7 | Chat | Socket.io on the Express server, JWT-authenticated, per-job rooms, persist-then-push |
| 8 | Escrow | Held → Released / Refunded state machine (added `Payment.workMarkedDoneAt`), transactional updates |
| 9 | Reviews | Post-completion rating, transactional recompute of the provider's aggregate rating |
| 10 | Notifications | Non-blocking `notify()` wired into key events; feed + global nav bar with unread badge |
| 11 | Admin & Fraud | Rule-based fraud flags (low-ball bid, duplicate name), admin dashboard (overview, users, jobs, fraud) |
| 12 | Dashboards & HCI | Role-based dashboards; heuristic evaluation + SUS instruments + results chapter |
| 14 | Deployment | Render blueprint, Vercel config, production builds, deployment/installation/user guides |

## 4.3 Notable design decisions
- **Layered services** keep business logic free of HTTP and SQL concerns (SOLID),
  making the security-critical logic unit-testable without a database.
- **Transactions** guarantee multi-row invariants (accept-bid, escrow
  release/refund, rating recompute).
- **Graceful degradation** for AI: pricing is advisory; failures never block users.
- **Non-blocking side effects:** notifications and fraud flagging never break the
  triggering action (errors are logged and swallowed).
- **Lightweight, free AI:** a small regression model and rule-based fraud — simple
  to explain and run, satisfying the proposal without over-engineering.

## 4.4 Datasets
The AI price model trains at startup on a small **seed dataset** encoding
reasonable hourly rates per category and complexity. It is deliberately simple and
explainable rather than data-heavy.

## 4.5 Testing
- **Unit tests** (Node's built-in runner) cover password hashing and JWT.
- **Integration tests** exercise each module's endpoints live against Supabase,
  recording expected vs. actual results (`docs/04-testing/`).
- **Type checking** (`tsc --noEmit`) passes for both TypeScript apps; both
  produce clean production builds.

## 4.6 Evaluation
See Chapter 5 for functional results, the heuristic evaluation, the usability/SUS
plan, performance notes, and the competitor comparison.
