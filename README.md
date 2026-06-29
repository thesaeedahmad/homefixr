# HomeFixr — Connecting Homeowners with Trusted Professionals

A web platform that connects homeowners with **verified** service providers through a
competitive **bidding** system, supported by lightweight **AI** (fair-price recommendation,
fraud detection, identity verification) and an **escrow payment simulation**.

> BS Software Engineering Final Year Project
> Team: Ahmad Abbas Khan, Arman Khan, Saeed Ahmad · Supervisor: Dr. Muhammad Nawaz

## Status

Design phase complete; implementation underway (Scrum, one module per iteration).

- [x] STEP 1 — Requirements analysis ([SRS](docs/01-requirements/SRS.md))
- [x] STEP 2 — Project plan & architecture
- [x] STEP 3 — UX research, information architecture, design system, wireframes
- [x] Iteration 0 — Foundation scaffold
- [x] Iteration 1 — Authentication & RBAC (register/login, JWT, bcrypt, RBAC)
- [x] Live Supabase PostgreSQL connected + initial migration
- [x] Iteration 2 — User Profiles & Settings (view/edit profile, change password)
- [x] Iteration 3 — Identity Verification (Cloudinary doc upload, admin approval queue, trust badge, avatars)
- [x] Iteration 4 — Job Posting & Categories (post/edit/cancel jobs, photos, browse + filter)
- [x] **Iteration 5 — Bidding / Offers** (place/compare/accept bids, transparent totals, auto-reject)
- [ ] Iteration 6 — AI Fair-Price Recommendation

## Architecture (frozen)

Three **independent** services, each deployable to a free tier. See
[docs/02-design/architecture.md](docs/02-design/architecture.md).

| Unit | Stack | Hosting |
|---|---|---|
| `apps/web` | Next.js + React + TypeScript + Tailwind CSS | Vercel (free) |
| `apps/api` | Node.js + Express + TypeScript + Prisma (+ Socket.io later) | Render (free) |
| `apps/ai`  | Python + FastAPI (+ scikit-learn later) | Render (free) |

Database: Supabase PostgreSQL (free) via Prisma. Media: Cloudinary (free). Maps: Leaflet + OpenStreetMap.

## Repository layout

```
homefixr/
├── apps/
│   ├── web/   # Next.js frontend + design system
│   ├── api/   # Express REST API + Prisma schema
│   └── ai/    # FastAPI AI microservice (skeleton)
├── docs/      # All FYP documentation (requirements, design, HCI, testing, report)
├── package.json   # convenience dev scripts only (not a workspace)
└── README.md
```

## Getting started (local development)

Each service is self-contained. Use **placeholder** env files for now — no real
credentials are required to run the scaffold.

```bash
# API (http://localhost:4000)
cd apps/api
cp .env.example .env
npm install
npm run prisma:generate     # generates the typed Prisma client from the schema
npm run seed                # creates the admin account (credentials from .env)
npm run dev

# Web (http://localhost:3000)
cd apps/web
cp .env.example .env.local
npm install
npm run dev

# AI service (http://localhost:8000)
cd apps/ai
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Health checks: `GET http://localhost:4000/api/health` and `GET http://localhost:8000/health`.

> Database migrations are run later, once a real Supabase `DATABASE_URL` is added.

## API

REST endpoints are documented in [docs/02-design/api.md](docs/02-design/api.md).
Iteration 1 adds authentication: `POST /api/auth/register`, `POST /api/auth/login`,
and `GET /api/auth/me` (JWT-protected). Run API tests with `cd apps/api && npm test`.

## Documentation

All project documentation lives in [`docs/`](docs/). See the [documentation index](docs/README.md).

## Roles

- **Customer** — posts jobs, compares bids, hires, pays (simulated), reviews.
- **Provider** — verifies identity, bids on jobs, completes work, gets paid.
- **Administrator** — approves verifications, reviews fraud flags, oversees the platform.
