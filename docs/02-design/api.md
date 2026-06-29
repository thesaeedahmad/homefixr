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
