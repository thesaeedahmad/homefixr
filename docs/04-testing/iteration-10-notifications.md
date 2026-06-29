# Test Report — Iteration 10: Notifications

Covers FR-26 (in-app notifications for key events). Integration tests run
against the **live Supabase database**.

## Events that create a notification
| Event (source service) | Recipient | Type |
|---|---|---|
| New bid placed (bid.service) | job's customer | `BID_RECEIVED` |
| Bid accepted (bid.service) | provider | `BID_ACCEPTED` |
| Escrow funded (payment.service) | provider | `PAYMENT_FUNDED` |
| Payment released (payment.service) | provider | `PAYMENT_RELEASED` |
| New chat message (chat.service) | the other party | `NEW_MESSAGE` |
| Verification reviewed (verification.service) | provider | `VERIFICATION` |

## Integration tests (live API)

| # | Step | Expected | Result |
|---|---|---|---|
| 1 | Customer receives bid notification | `BID_RECEIVED` present | ✅ |
| 2 | Customer unread ≥ 1 | yes | ✅ |
| 3 | Payload has message + jobId | yes | ✅ |
| 4 | Provider receives `BID_ACCEPTED` | present | ✅ |
| 5 | Provider receives `PAYMENT_FUNDED` | present | ✅ |
| 6 | Provider receives `PAYMENT_RELEASED` | present | ✅ |
| 7 | Provider unread = 3 | yes | ✅ |
| 8 | Customer marking a provider's notification read | blocked (still 3 unread) | ✅ |
| 9 | Customer mark-all-read | unread → 0 | ✅ |
| 10 | Provider mark-one-read | unread → 2 | ✅ |

**Result: 10/10 passed.** Test data removed afterward.

## Unit tests & type checks
| Check | Result |
|---|---|
| `apps/api` `npm test` | ✅ 9/9 |
| `apps/api` / `apps/web` `tsc --noEmit` | ✅ |

## Notes
- `notify()` never throws to its caller — a failed notification can't break the
  main action (it is logged and swallowed).
- Mark-read uses an `updateMany` guarded by `userId`, so a user can never mark
  another user's notification read (verified by test #8).
- A global, role-aware NavBar was added as the surface for the unread count and
  app navigation (also benefits later iterations).
