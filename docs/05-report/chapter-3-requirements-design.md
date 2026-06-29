# Chapter 3 — System Requirements & Design (Draft)

*Full details live in the linked artifacts; this chapter summarises them.*

## 3.1 Software development plan
Scrum with **module = sprint**. Each iteration ran Planning → Requirements →
Design (incl. HCI reasoning) → Implementation → Testing → Documentation →
Reflection, ending in working code, a meaningful commit, and updated docs. See the
iteration backlog and per-iteration test reports in `docs/04-testing/`.

## 3.2 Requirements
- **Functional (FR-1…FR-31)** and **non-functional (NFR-1…NFR-8)** are specified in
  the [SRS](../01-requirements/SRS.md), with a traceability table mapping each
  proposal objective → requirement → course.
- Roles: **Customer, Provider, Administrator**.

## 3.3 Software architecture
Three independent, free-tier services (Next.js web, Express API, FastAPI AI) over
Supabase PostgreSQL and Cloudinary. The API uses layered **Clean Architecture**:
`routes → controllers → services → repositories` with cross-cutting middleware
(auth, RBAC, validation, error handling) and `lib` (config, logger, prisma, jwt,
socket, cloudinary, aiClient). See [architecture.md](../02-design/architecture.md).

## 3.4 Database design
Ten entities — User, ProviderProfile, VerificationDocument, Job, Bid, Payment,
Review, Message, Notification, FraudFlag — modelled with Prisma. Enums encode the
state machines (job status, bid status, payment status, verification status, fraud
status). Schema: `apps/api/prisma/schema.prisma`. The ER diagram is derived from
this schema.

## 3.5 Use cases (summary)
Primary use cases: Register/Login, Manage Profile, Verify Identity (provider),
Approve Verification (admin), Post Job, Browse/Filter Jobs, Place Bid, Accept Bid,
Pay/Release/Dispute (escrow), Chat, Review, View Notifications, Review Fraud Flags
(admin). Fully-dressed use cases and a use-case diagram accompany this chapter.

## 3.6 Key flows (sequence/state)
- **Bidding:** provider places bid → customer compares → accept runs a
  transaction (accept one, reject others, job → IN_PROGRESS).
- **Escrow state machine:** `pay → HELD → (provider) work done → (customer)
  release → RELEASED + COMPLETED` or `dispute → REFUNDED + CLOSED`.
- **Chat:** message persisted via REST, then pushed to the job's Socket.io room.
- **AI pricing:** API calls the FastAPI model; on any failure the hint is hidden
  (graceful degradation).

## 3.7 Security design
JWT auth, bcrypt hashing, RBAC middleware, Zod input validation, Prisma
parameterised queries (SQLi prevention), React auto-escaping (XSS), Bearer-token
(no cookies → CSRF not applicable), secrets via environment only, request logging,
non-revealing auth errors. (NFR-1.)

## 3.8 HCI design
User-centred design artifacts (personas, journeys, task analysis, IA, wireframes)
and a reusable design system are in `docs/03-hci/`. The design system encodes the
usability heuristics structurally; the heuristic evaluation confirms them.

## 3.9 Test plan
Each module ships unit tests (security utilities via Node's test runner) and live
integration tests against Supabase, with expected/actual results recorded per
iteration in `docs/04-testing/`. HCI evaluation uses heuristic evaluation + SUS.
