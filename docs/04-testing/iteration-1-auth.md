# Test Report — Iteration 1: Authentication & RBAC

Covers FR-1 (registration/login), FR-2 (hashing + JWT), FR-3 (RBAC).

## 1. Unit tests (automated — Node built-in test runner)

Run: `cd apps/api && npm test`

| # | Test | Expected | Actual | Result |
|---|---|---|---|---|
| U1 | `hashPassword` output ≠ plain text | Hash differs, non-empty | Hash differs | ✅ Pass |
| U2 | `verifyPassword` correct password | `true` | `true` | ✅ Pass |
| U3 | `verifyPassword` wrong password | `false` | `false` | ✅ Pass |
| U4 | `signToken` → `verifyToken` round-trip | payload preserved | preserved | ✅ Pass |
| U5 | `verifyToken` tampered token | throws | throws | ✅ Pass |

**Result: 5/5 passed.**

## 2. Integration tests (manual — live API, no DB required)

Run a server and call the endpoints. These exercise routing, validation,
authentication, and error handling end-to-end.

| # | Request | Expected | Actual | Result |
|---|---|---|---|---|
| I1 | `GET /api/health` | 200, `status: ok` | 200 ok | ✅ Pass |
| I2 | `POST /api/auth/login` with invalid email | 400, "Enter a valid email address" | 400 + message | ✅ Pass |
| I3 | `POST /api/auth/register` missing fields | 400, "Required" | 400 + message | ✅ Pass |
| I4 | `GET /api/auth/me` without token | 401, "Authentication required" | 401 + message | ✅ Pass |
| I5 | `GET /api/nope` (unknown route) | 404, "Not Found" | 404 + message | ✅ Pass |

## 3. Pending (needs a real database — Supabase)

These require a connected Postgres and will be added as Supertest integration
tests once credentials are configured:

- Register a new user → 201 + token; duplicate email → 409.
- Login with correct/incorrect password → 200 / 401.
- `GET /api/auth/me` with a valid token → 200 + correct user.
- `authorize()` blocks a wrong-role token → 403.

## 4. Frontend verification (manual)

| Check | Result |
|---|---|
| `apps/web` type-checks (`tsc --noEmit`) | ✅ Pass |
| Register/login forms render with labels + focus rings | ✅ (design system) |
| Submit shows loading state; errors shown in an alert region | ✅ |
