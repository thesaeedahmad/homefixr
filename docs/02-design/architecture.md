# Software Architecture — HomeFixr (FROZEN)

*Design deliverable. This document is the authoritative record of the frozen
architecture (approved 2026-06-29). It supersedes earlier folder-structure notes
in the planning file.*

## 1. Architectural style

Layered / Clean Architecture, applied per service. Responsibilities are
separated so business logic is isolated from the web framework and the database,
keeping the system testable and maintainable (SOLID, Clean Architecture).

## 2. Services (three independent, free-tier-deployable units)

```
[ apps/web ]  --HTTPS / REST-->  [ apps/api ]  --Prisma-->  [ Supabase Postgres ]
 Next.js                          Express            |
 (Vercel)                         (Render)           +--HTTP--> [ apps/ai ]
                                                                FastAPI (Render)
 realtime chat + notifications via Socket.io (added Iteration 7) run on apps/api.
 media (job photos, documents, avatars) stored on Cloudinary (added Iteration 2/3).
```

The three apps are **self-contained** (each has its own dependencies and deploys
independently). There is no npm workspace and no shared package — the REST API
contract is the single source of truth between web and api. This was a
deliberate simplification (KISS) that also makes free-tier deployment robust.

## 3. API layering (apps/api)

```
HTTP request
   │
   ▼
routes/         thin endpoints (URL + verb)
   │
   ▼
controllers/    parse/validate request, shape response      (added from Iter. 1)
   │
   ▼
services/       business logic (the "use cases")            (added from Iter. 1)
   │
   ▼
repositories/   database access via Prisma                  (added from Iter. 1)
   │
   ▼
PostgreSQL (Supabase)

cross-cutting:  middleware/ (errors now; auth, RBAC, validation later)
                lib/        (env, logger, prisma client)
```

Iteration 0 contains only the outer shell (routes + middleware + lib + the app
factory). Controllers, services, and repositories are introduced per feature,
starting with Authentication in Iteration 1.

## 4. Data design

A single PostgreSQL database (Supabase) modelled with Prisma. Ten entities:
User, ProviderProfile, VerificationDocument, Job, Bid, Payment, Review, Message,
Notification, FraudFlag. See `apps/api/prisma/schema.prisma`. Enums encode all
fixed state machines (job status, bid status, payment status, verification
status, fraud status).

## 5. Technology rationale (summary)

| Technology | Why chosen |
|---|---|
| Next.js + React + TS | Modern, well-documented React framework; type safety |
| Tailwind CSS | Design tokens in one config = consistent, DRY UI |
| Express + TS | Minimal, explicit REST framework; easy to explain at viva |
| Prisma + PostgreSQL | Type-safe queries; parameterised SQL prevents injection |
| Socket.io | Simple realtime chat/notifications (Iteration 7) |
| FastAPI + scikit-learn | Lightweight, free Python AI service |
| Leaflet + OpenStreetMap | Free maps, no paid API key |
| Cloudinary (free) | Free media hosting |
| JWT + bcrypt | Standard, free auth primitives (Iteration 1) |

All technologies are free; the core libraries are open-source. Hosting/storage
(Supabase, Cloudinary, Vercel, Render) use zero-cost free tiers.

## 6. Quality principles mapping

- **KISS** — simplest implementation per module; AI rule-based first.
- **DRY** — one design system; one Prisma schema; one error handler; one config.
- **SOLID** — layered separation; single-responsibility files.
- **Clean Architecture** — business logic isolated from framework/DB.
- **REST** — resource-noun routes, correct verbs/status codes, stateless JWT.
