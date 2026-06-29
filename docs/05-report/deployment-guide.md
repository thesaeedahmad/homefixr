# Deployment Guide — HomeFixr
*Iteration 14. Deploying the three services on free tiers.*

HomeFixr deploys as three independent services:
- **web** (Next.js) → **Vercel**
- **api** (Express + Socket.io) → **Render**
- **ai** (FastAPI) → **Render**

with **Supabase** (PostgreSQL) and **Cloudinary** (media) already configured.

> ⚠️ **Before deploying:** in Supabase, **rotate the database password** (it was
> shared during development) and update `DATABASE_URL`/`DIRECT_URL`. Also choose a
> strong `ADMIN_PASSWORD`. Remember to **percent-encode** any special characters
> in the DB password (`@` → `%40`, `/` → `%2F`).

---

## Step 1 — Deploy the AI service (Render)
1. Push the repo to GitHub.
2. In Render → **New → Blueprint**, select the repo. Render reads `render.yaml`
   and proposes `homefixr-api` and `homefixr-ai`. (You can also create each as a
   **Web Service** manually.)
3. For **homefixr-ai**: runtime Python, root `apps/ai`,
   build `pip install -r requirements.txt`,
   start `uvicorn main:app --host 0.0.0.0 --port $PORT`.
4. Deploy, then note its URL, e.g. `https://homefixr-ai.onrender.com`.
   Check `GET /health` returns `{"status":"ok"}`.

## Step 2 — Deploy the API (Render)
1. Service **homefixr-api**: runtime Node, root `apps/api`,
   build `npm install && npm run build && npm run migrate:deploy`,
   start `npm run start`, health check `/api/health`.
2. Set the environment variables (Render dashboard → Environment):

| Variable | Value |
|---|---|
| `DATABASE_URL` | Supabase pooled URL (6543, `pgbouncer=true`), password encoded |
| `DIRECT_URL` | Supabase direct URL (5432), password encoded |
| `JWT_SECRET` | a long random string |
| `JWT_EXPIRES_IN` | `7d` |
| `WEB_ORIGIN` | the Vercel web URL (Step 3) |
| `AI_SERVICE_URL` | the AI URL from Step 1 |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | from Cloudinary |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | admin seed |
| `NODE_ENV` | `production` |

3. Deploy. The build runs `prisma migrate deploy` (creates/updates tables).
4. Check `GET /api/health`.

## Step 3 — Deploy the web app (Vercel)
1. Vercel → **New Project** → import the repo.
2. Set **Root Directory** to `apps/web` (framework auto-detected as Next.js).
3. Environment variable: `NEXT_PUBLIC_API_URL = https://homefixr-api.onrender.com/api`.
4. Deploy, then copy the resulting URL (e.g. `https://homefixr.vercel.app`).
5. Go back to Render → homefixr-api → set `WEB_ORIGIN` to that URL and redeploy
   (this enables CORS and Socket.io from the real frontend).

## Step 4 — Seed the admin account
Run once against the production database (locally, with the production
`DATABASE_URL`/`DIRECT_URL` in your `.env`):
```bash
cd apps/api && npm run seed
```
(or use Render's Shell). Then **log in and change the admin password** if needed.

## Step 5 — Smoke test the deployment
- Register a customer and a provider on the live site.
- Post a job → see the AI price hint → place a bid (provider) → accept (customer).
- Pay into escrow → mark done → release. Send a chat message. Leave a review.
- Confirm notifications appear and the admin dashboard loads.

## Notes & gotchas
- **Free tiers sleep:** Render free services spin down when idle; the first
  request after idle is slow. Acceptable for a demo.
- **CORS/Socket.io origin** must equal the exact Vercel URL (`WEB_ORIGIN`).
- **Migrations** use `DIRECT_URL`; runtime queries use the pooled `DATABASE_URL`.
- **Secrets** live only in host env vars / local `.env` (git-ignored) — never commit them.
