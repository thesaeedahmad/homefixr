# Test Report — Iteration 4: Job Posting & Categories

Covers FR-9 (post job), FR-10 (fixed categories), FR-11 (edit/cancel),
FR-12 (status lifecycle), FR-30 (search/filter). Integration tests run against
the **live Supabase database** (and Cloudinary for photos).

## 1. Integration tests (live API)

| # | Step | Expected | Actual | Result |
|---|---|---|---|---|
| 1 | Customer posts a job with a photo | 201, status OPEN, 1 photo | OPEN, 1 photo | ✅ |
| 2 | **RBAC:** provider posts a job | 403 Access denied | 403 | ✅ |
| 3 | Browse filter `category=PLUMBING&location=lahore` | job appears | 1 match | ✅ |
| 4 | Browse filter `category=ELECTRICAL` | job absent | absent | ✅ |
| 5 | `GET /jobs/mine` (customer) | 1 job | 1 | ✅ |
| 6 | Owner edits title (OPEN) | 200, title updated | updated | ✅ |
| 7 | Owner cancels job | 200, status CLOSED | CLOSED | ✅ |
| 8 | Browse after cancel | CLOSED job not listed | not listed | ✅ |

**Result: 8/8 passed.** Job, its Cloudinary photo, and the two test users were
deleted afterward (only the seeded admin remains).

## 2. Unit tests & type checks
| Check | Result |
|---|---|
| `apps/api` `npm test` | ✅ 9/9 (no regressions) |
| `apps/api` `tsc --noEmit` | ✅ |
| `apps/web` `tsc --noEmit` | ✅ |

## 3. Notes
- No schema change (Job/enums already existed) → no new migration.
- Ownership + OPEN-only rules for edit/cancel are enforced in the service layer
  and verified via RBAC test (#2) and lifecycle tests (#6–#8).
- `IN_PROGRESS`/`COMPLETED` transitions arrive with bidding (Iter 5) and escrow (Iter 8).
