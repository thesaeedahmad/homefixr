# Test Report — Iteration 5: Bidding / Offers

Covers FR-13 (place bid), FR-14 (transparent total), FR-15 (compare/accept,
auto-reject others), FR-16 (accept → assign provider, job IN_PROGRESS).
Integration tests run against the **live Supabase database**.

## 1. Integration tests (live API)

| # | Step | Expected | Actual | Result |
|---|---|---|---|---|
| 1 | Provider 1 bids 1000×2 + 800 | 201, total **2800**, PENDING | 2800, PENDING | ✅ |
| 2 | Provider 1 bids again | 409 already bid | 409 | ✅ |
| 3 | Provider 2 bids 1500×2 + 0 | 201, total 3000 | 3000 | ✅ |
| 4 | **RBAC:** customer places a bid | 403 | 403 | ✅ |
| 5 | **RBAC:** provider views job bids | 403 | 403 | ✅ |
| 6 | Owner views bids | 2+ bids, cheapest first | ordered | ✅ |
| 7 | Owner accepts cheapest bid | 200, ACCEPTED | ACCEPTED | ✅ |
| 8 | Other bids + job after accept | others REJECTED, job IN_PROGRESS | `{500:ACCEPTED, 2800:REJECTED, 3000:REJECTED}`, IN_PROGRESS | ✅ |
| 9 | New bid after acceptance | 409 job not open | 409 | ✅ |

**Result: all checks passed.** Total is server-computed (FR-14); acceptance is a
single atomic transaction (FR-15/16). All test users + jobs/bids deleted afterward.

## 2. Unit tests & type checks
| Check | Result |
|---|---|
| `apps/api` `npm test` | ✅ 9/9 (no regressions) |
| `apps/api` `tsc --noEmit` | ✅ |
| `apps/web` `tsc --noEmit` | ✅ |

## 3. Notes
- No schema change (Bid/enums already existed) → no new migration.
- Trust signals (Verified badge, rating) are returned with each bid so customers
  can weigh trust alongside price.
- A test-script bug (shell variable capture) initially masked the accept step;
  re-run with a JSON-driven client confirmed the transaction works correctly.
