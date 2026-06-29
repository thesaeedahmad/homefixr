# Test Report — Iteration 9: Reviews & Ratings

Covers FR-24 (customer rates provider after completion) and FR-25 (aggregate
rating shown on the provider as a trust signal). Integration tests run against
the **live Supabase database**.

## Integration tests (live API)

| # | Step | Expected | Result |
|---|---|---|---|
| 1 | GET review before submitting | `null` | ✅ |
| 2 | Provider attempts to review | 403 (customer only) | ✅ |
| 3 | Submit rating = 6 | 400 (1–5 only) | ✅ |
| 4 | Customer reviews completed job (5★ + comment) | 201 | ✅ |
| 5 | Customer reviews again | 409 (one per job) | ✅ |
| 6 | GET provider reviews | 1 review | ✅ |
| 7 | Aggregate on a new bid (`ratingAvg`/`ratingCount`) | 5.0 / 1 | ✅ |
| 8 | Review a non-completed job | 409 | ✅ |

**Result: 8/8 passed.** Test data removed afterward (only the seeded admin remains).

## Unit tests & type checks
| Check | Result |
|---|---|
| `apps/api` `npm test` | ✅ 9/9 |
| `apps/api` `tsc --noEmit` | ✅ |
| `apps/web` `tsc --noEmit` | ✅ |

## Notes
- No schema change (Review/ProviderProfile already existed) → no migration.
- The review write recomputes the provider's average from all reviews inside a
  transaction and upserts the ProviderProfile, so the trust signal on bids stays
  consistent (verified by test #7).
