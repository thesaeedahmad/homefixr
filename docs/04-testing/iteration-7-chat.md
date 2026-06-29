# Test Report — Iteration 7: Chat (Socket.io)

Covers FR-20 (real-time one-to-one messaging between a customer and the assigned
provider). Integration tests run against the **live Supabase database** with a
running Socket.io server.

## 1. Real-time delivery (two Socket.io clients)

| # | Step | Expected | Actual | Result |
|---|---|---|---|---|
| 1 | Two clients connect with JWT auth | both connect | both connected | ✅ |
| 2 | Both `chat:join` the job room | joined (participant check passes) | joined | ✅ |
| 3 | Customer POSTs a message | 201, persisted | 201 | ✅ |
| 4 | Provider receives it over Socket.io | `chat:message` with same body | received "realtime hello" | ✅ |

## 2. REST participant gating

| # | Step | Expected | Actual | Result |
|---|---|---|---|---|
| 5 | Customer GET messages (after hire) | available true, otherParty = provider | true, p7a | ✅ |
| 6 | Non-participant provider GET messages | 403 | 403 | ✅ |
| 7 | Customer GET on a job with no hire | available false | false | ✅ |
| 8 | Send empty message | 400 "Message cannot be empty" | 400 | ✅ |
| 9 | Message persisted (GET after send) | ≥ 1 message | 1, body matches | ✅ |

**Result: all passed.**

## 3. Unit tests & type checks
| Check | Result |
|---|---|
| `apps/api` `npm test` | ✅ 9/9 (no regressions) |
| `apps/api` `tsc --noEmit` | ✅ |
| `apps/web` `tsc --noEmit` | ✅ |

## 4. Notes
- Socket connections are authenticated with the same JWT as the REST API.
- Messages are persisted via REST, then pushed to the job room — so the socket
  layer stays thin and history survives reconnects.
- Initial socket test failures were environmental (wrong working directory for
  the test runner) and a join/emit timing race in the test client — not app
  defects; resolved by running from the correct dir and widening the join window.
