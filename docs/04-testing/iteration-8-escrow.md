# Test Report — Iteration 8: Escrow Payment Simulation

Covers FR-21 (pay → held), FR-22 (provider completes → customer confirms →
released), FR-23 (minimal dispute/withhold). Integration tests run against the
**live Supabase database**. No real money is involved (simulation).

## State machine
```
(job IN_PROGRESS, bid accepted)
  customer pays ─────────────▶ HELD
  provider marks work done ──▶ HELD (+ workMarkedDoneAt)
  customer releases ─────────▶ RELEASED  + job COMPLETED
  customer disputes ─────────▶ REFUNDED  + job CLOSED
```

## Integration tests (live API)

| # | Step | Expected | Result |
|---|---|---|---|
| 1 | Provider attempts to pay | 403 (customer only) | ✅ |
| 2 | GET payment before paying | `null` | ✅ |
| 3 | Provider marks work done before funding | 409 | ✅ |
| 4 | Customer pays | 201, HELD, amount = bid total (1300) | ✅ |
| 5 | Customer pays again | 409 (already exists) | ✅ |
| 6 | Customer releases before work-done | 409 (out of order) | ✅ |
| 7 | Non-participant provider GETs payment | 403 | ✅ |
| 8 | Assigned provider marks work done | 200, `workMarkedDoneAt` set | ✅ |
| 9 | Provider marks done again | 409 | ✅ |
| 10 | Customer releases | 200, RELEASED | ✅ |
| 11 | Job after release | COMPLETED | ✅ |
| 12 | Dispute a held payment (2nd job) | 200, REFUNDED | ✅ |
| 13 | Job after dispute | CLOSED | ✅ |

**Result: 13/13 passed.** Test data removed afterward (only the seeded admin remains).

## Unit tests & type checks
| Check | Result |
|---|---|
| `apps/api` `npm test` | ✅ 9/9 |
| `apps/api` `tsc --noEmit` | ✅ |
| `apps/web` `tsc --noEmit` | ✅ |

## Notes
- Added one nullable column `Payment.workMarkedDoneAt` (migration
  `payment_work_done`) to record the provider's completion step.
- State + ordering rules live in the service layer; release/refund update the
  payment and the job atomically (transaction).
- The direct-connection migration hit a transient `P1001` once and succeeded on
  retry — network blip, not a code issue.
