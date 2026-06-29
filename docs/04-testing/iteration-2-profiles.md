# Test Report — Iteration 2: User Profiles & Settings

Covers FR-4 (profile management) and FR-31 (settings / password change).
All integration tests run against the **live Supabase database**.

## 1. Integration tests (live API + Supabase)

| # | Request | Expected | Actual | Result |
|---|---|---|---|---|
| 1 | Register a user | 201 + token | 201 | ✅ |
| 2 | `GET /api/users/me` | 200, profile with null phone/location | 200, correct | ✅ |
| 3 | `PATCH /api/users/me` name/phone/location | 200, fields updated | updated | ✅ |
| 4 | `PATCH /api/users/me/password` wrong current | 401, "Current password is incorrect" | 401 | ✅ |
| 5 | `PATCH /api/users/me/password` correct current | 200, `{ success: true }` | 200 | ✅ |
| 6 | Login with the **new** password | 200 + token | 200 | ✅ |
| 7 | `PATCH /api/users/me` without token | 401 | 401 | ✅ |
| 8 | `PATCH /api/users/me` empty body | 400, "Provide at least one field" | 400 | ✅ |

**Result: 8/8 passed.** Test data deleted afterward (DB left clean).

Test 6 is the key assertion: the new password works on a fresh login, proving
the change was hashed and persisted (not just accepted).

## 2. Type checks
| Check | Result |
|---|---|
| `apps/api` `tsc --noEmit` | ✅ |
| `apps/web` `tsc --noEmit` | ✅ |

## 3. Existing unit tests
`apps/api` `npm test` → 9/9 still passing (no regressions).

## 4. Notes / deferred
- Avatar **image upload** (Cloudinary) deferred to Iteration 3, where Cloudinary
  is first required (verification documents). `avatarUrl` is editable as a URL now.
- Provider professional fields (bio, hourly rate, categories) deferred to the
  bidding iteration that first uses them (KISS — no unused fields).
