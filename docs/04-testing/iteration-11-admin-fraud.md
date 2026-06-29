# Test Report — Iteration 11: Admin Dashboard & Fraud Detection

Covers FR-29 (admin dashboard) and FR-19 (rule-based fraud detection).
Integration tests run against the **live Supabase database**.

## Fraud rules (lightweight, rule-based)
| Rule | Trigger | Flags |
|---|---|---|
| Low-ball bid | hourly rate < 50 PKR, or total < 30% of budget hint | `BID` |
| Possible duplicate account | new account name matches an existing user | `USER` |

## Integration tests (live API)

| # | Step | Expected | Result |
|---|---|---|---|
| 1 | Admin login (seeded account) | 200 + token | ✅ |
| 2 | Non-admin hits `/admin/overview` | 403 | ✅ |
| 3 | Admin overview | counts incl. openFraud ≥ 2 | ✅ |
| 4 | Low-ball bid produced a `BID` flag | present | ✅ |
| 5 | Duplicate-name account produced a `USER` flag | present | ✅ |
| 6 | Admin confirms a flag | 200 | ✅ |
| 7 | Confirmed flag leaves the OPEN list | yes | ✅ |
| 8 | Invalid review status | 400 | ✅ |
| 9 | Admin users list | ≥ 4 | ✅ |
| 10 | Admin jobs list | ≥ 1 | ✅ |

**Result: 10/10 passed.** Test data (incl. fraud flags) removed afterward.

## Unit tests & type checks
| Check | Result |
|---|---|
| `apps/api` `npm test` | ✅ 9/9 |
| `apps/api` / `apps/web` `tsc --noEmit` | ✅ |

## Notes
- Fraud checks run inside `bid.service` (new bids) and `auth.service`
  (registration); flagging is non-blocking (never breaks the main action).
- Admin area: `/admin` overview + `/admin/users`, `/admin/jobs`, `/admin/fraud`,
  plus the existing `/admin/verification` queue, all guarded by `authorize('ADMIN')`.
- No schema change (FraudFlag already existed) → no migration.
