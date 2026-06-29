# Test Report — Iteration 3: Identity Verification

Covers FR-5 (document upload), FR-6 (admin approval), FR-7 (trust badge /
isVerified), plus the avatar-upload retrofit. Integration tests run against the
**live Supabase database and live Cloudinary** account.

## 1. Integration tests (live API + Supabase + Cloudinary)

| # | Step | Expected | Actual | Result |
|---|---|---|---|---|
| 1 | Register a provider | 201 + token | 201 | ✅ |
| 2 | Provider uploads ID + license | 201, status PENDING, Cloudinary URLs | PENDING, 2 docs uploaded | ✅ |
| 3 | `GET /verification/me` | PENDING, 2 documents | correct | ✅ |
| 4 | Admin login (seeded account) | 200 + token | 200 | ✅ |
| 5 | **RBAC:** provider calls admin-only `/pending` | 403 Access denied | 403 | ✅ |
| 6 | Admin `GET /verification/pending` | provider listed | listed | ✅ |
| 7 | Admin approves | 200, status APPROVED | APPROVED | ✅ |
| 8 | Provider status + `user.isVerified` | APPROVED + isVerified true | true | ✅ |
| 9 | Provider uploads avatar | 200, `avatarUrl` set (Cloudinary) | set | ✅ |

**Result: 9/9 passed.** Test provider + all 3 Cloudinary assets deleted afterward;
only the seeded admin remains.

Test 5 is the milestone: the RBAC `authorize('ADMIN')` guard built in Iteration 1
now blocks a real cross-role action.

## 2. Unit tests & type checks
| Check | Result |
|---|---|
| `apps/api` `npm test` | ✅ 9/9 (no regressions) |
| `apps/api` `tsc --noEmit` | ✅ |
| `apps/web` `tsc --noEmit` | ✅ |

## 3. Notes
- No schema change this iteration (entities already existed) → no new migration.
- Admin account is created by `npm run seed` (credentials from `.env`).
- Avatar image upload (deferred from Iteration 2) is now implemented.
