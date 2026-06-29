# API Documentation — HomeFixr

REST API reference. Base URL: `http://localhost:4000/api` (local). All request
and response bodies are JSON. Errors share one shape:

```json
{ "error": { "message": "human-readable message" } }
```

Authenticated routes expect an `Authorization: Bearer <JWT>` header.

---

## Authentication (Iteration 1)

### POST /api/auth/register
Create a Customer or Provider account. (Admins are seeded, not self-registered.)

**Body**
| Field | Type | Rules |
|---|---|---|
| name | string | 2–80 chars |
| email | string | valid email, unique |
| password | string | 8–100 chars |
| role | string | `CUSTOMER` or `PROVIDER` |

**201 Created**
```json
{
  "token": "<jwt>",
  "user": { "id": "...", "name": "...", "email": "...", "role": "CUSTOMER" }
}
```
**Errors:** `400` validation · `409` email already exists

### POST /api/auth/login
Exchange credentials for a JWT.

**Body:** `{ "email": string, "password": string }`

**200 OK** — same shape as register.
**Errors:** `400` validation · `401` invalid email or password *(same message for both, by design)*

### GET /api/auth/me
Return the currently authenticated user.

**Headers:** `Authorization: Bearer <jwt>`

**200 OK**
```json
{ "user": { "id": "...", "name": "...", "email": "...", "role": "CUSTOMER" } }
```
**Errors:** `401` missing/invalid token

---

## Profile & Settings (Iteration 2) — all require `Authorization: Bearer <jwt>`

### GET /api/users/me
Return the current user's full profile.
**200 OK** → `{ "user": { id, name, email, role, phone, location, avatarUrl, isVerified } }`
**401** if no/invalid token.

### PATCH /api/users/me
Update one or more profile fields. Partial update — send only changed fields.

**Body (all optional, ≥ 1 required):** `name`, `phone`, `location`, `avatarUrl` (valid URL)
**200 OK** → updated `{ user }`
**Errors:** `400` validation (incl. empty body) · `401` no token

### PATCH /api/users/me/password
Change the password (requires the correct current password).

**Body:** `{ "currentPassword": string, "newPassword": string (≥ 8) }`
**200 OK** → `{ "success": true }`
**Errors:** `400` validation · `401` no token **or** current password incorrect

### POST /api/users/me/avatar
Upload a profile image (multipart). **Field:** `avatar` (image, ≤ 5 MB).
**200 OK** → updated `{ user }` with `avatarUrl`. **Errors:** `400` no/invalid file · `401`.

---

## Identity Verification (Iteration 3)

### POST /api/verification — *Provider only*
Upload ID + license images (multipart). **Fields:** `idDocument`, `licenseDocument`
(images, ≤ 5 MB each). Stores them in Cloudinary, sets status `PENDING`.
**201 Created** → `{ verification }`. **Errors:** `400` missing files · `401` · `403` not a provider.

### GET /api/verification/me — *Provider only*
**200 OK** → `{ verification }` (or `null` if never submitted), including `verificationStatus` and `documents`.

### GET /api/verification/pending — *Admin only*
**200 OK** → `{ pending: [ { id, user, documents, verificationStatus } ] }`.
**Errors:** `403` if not an admin.

### PATCH /api/verification/:id/review — *Admin only*
`:id` = provider profile id. **Body:** `{ "status": "APPROVED" | "REJECTED" }`.
Updates the profile, stamps the documents, and syncs the provider's `isVerified`.
**200 OK** → `{ verification }`. **Errors:** `400` · `403` · `404`.

---

## Jobs (Iteration 4) — all require `Authorization: Bearer <jwt>`

Categories (fixed): `PLUMBING, ELECTRICAL, APPLIANCES, HANDYMAN, CLEANING`.
Job status: `OPEN → IN_PROGRESS → COMPLETED → CLOSED`.

### POST /api/jobs — *Customer only*
Post a job (multipart, so photos can be attached).
**Fields:** `category`, `title` (≥3), `description` (≥10), `location`, `budgetHint` (optional number), `photos` (0–5 images, ≤5 MB each).
**201 Created** → `{ job }`. **Errors:** `400` validation · `401` · `403` not a customer.

### GET /api/jobs
Browse **OPEN** jobs. **Query (optional):** `category`, `location` (case-insensitive contains).
**200 OK** → `{ jobs: [ ... ] }` (newest first).

### GET /api/jobs/mine — *Customer only*
**200 OK** → `{ jobs }` — the caller's own jobs (any status).

### GET /api/jobs/:id
**200 OK** → `{ job }` (includes `customer`). **404** if not found.

### PATCH /api/jobs/:id — *Customer only (owner)*
Edit an OPEN job. **Body (≥1):** `title`, `description`, `location`, `budgetHint`.
**200 OK** → `{ job }`. **Errors:** `400` · `403` not owner · `404` · `409` not OPEN.

### PATCH /api/jobs/:id/cancel — *Customer only (owner)*
Cancels an OPEN job (→ CLOSED). **200 OK** → `{ job }`. **Errors:** `403` · `404` · `409` not OPEN.

---

## Bids / Offers (Iteration 5) — all require `Authorization: Bearer <jwt>`

Bid status: `PENDING → ACCEPTED | REJECTED`. The total is computed by the server
as `hourlyRate × estimatedHours + equipmentCost` (never trusted from the client).

### POST /api/jobs/:jobId/bids — *Provider only*
Place a bid on an OPEN job (one per provider per job).
**Body:** `hourlyRate` (>0), `estimatedHours` (>0), `equipmentCost` (≥0, default 0), `message` (optional).
**201 Created** → `{ bid }`. **Errors:** `400` · `403` not a provider · `404` job · `409` job not open / already bid.

### GET /api/jobs/:jobId/bids — *Customer only (owner)*
All bids on the caller's job, cheapest first, with each provider's `isVerified`
flag and rating. **200 OK** → `{ bids }`. **Errors:** `403` not owner · `404`.

### GET /api/bids/mine — *Provider only*
**200 OK** → `{ bids }` — the caller's bids (with their job's title + status).

### PATCH /api/bids/:id/accept — *Customer only (owner)*
Accepts a bid: that bid → ACCEPTED, all others on the job → REJECTED, job →
IN_PROGRESS (atomic). **200 OK** → `{ bid }`. **Errors:** `403` · `404` · `409` job not open / bid not pending.

---

## Health
### GET /api/health
Liveness probe. **200 OK** → `{ "status": "ok", "service": "homefixr-api", "timestamp": "..." }`

---

## Conventions
- **Verbs/status codes:** `POST` create → `201`; reads → `200`; validation → `400`;
  unauthenticated → `401`; forbidden role → `403`; not found → `404`.
- **Auth:** stateless JWT in the `Authorization` header (no server sessions).
- **RBAC:** `authenticate` then `authorize(...roles)` guard protected routes.
