# Test Report — Iteration 6: AI Fair-Price Recommendation

Covers FR-17 (price suggestion on job posting) and FR-18 (fair-rate guidance for
providers). First cross-service integration: Express API → Python FastAPI/scikit-learn.

## 1. Model sanity (apps/ai)
Linear regression trained on a seed dataset (category + complexity → hourly rate).

| Input | Expected ≈ | Predicted | Result |
|---|---|---|---|
| PLUMBING, complexity 3 | ~800 | 799 | ✅ |
| ELECTRICAL, complexity 5 | ~1140 | 1138 | ✅ |
| CLEANING, complexity 1 | ~260 | 256 | ✅ |

## 2. Integration tests (live: AI service + API)

| # | Step | Expected | Actual | Result |
|---|---|---|---|---|
| 1 | AI `POST /predict-price` (PLUMBING, 2h) | rate + total bands | `{679,799,919}` / `{1359,1598,1838}` | ✅ |
| 2 | AI unknown category | 400 | 400 | ✅ |
| 3 | **Full chain** `POST /api/pricing` (Express→AI) | recommendation with bands | ELECTRICAL `{764,899,1034}`, total `{2292,2696,3101}` | ✅ |
| 4 | `/api/pricing` without token | 401 | 401 | ✅ |
| 5 | `/api/pricing` invalid category | 400 | 400 | ✅ |
| 6 | **Graceful fallback** (AI stopped) | 200, `recommendation: null` | 200, null | ✅ |

**Result: all passed.** Test 6 is the key resilience check: price recommendations
are advisory, so an AI outage degrades to "no hint" rather than an error.

## 3. Type checks
| Check | Result |
|---|---|
| `apps/api` `tsc --noEmit` | ✅ |
| `apps/web` `tsc --noEmit` | ✅ |
| `apps/api` `npm test` | ✅ 9/9 (no regressions) |

## 4. Notes
- Python 3.14 required latest wheels: `scikit-learn 1.9.0`, `numpy 2.5.0`,
  `fastapi 0.138.1`, `uvicorn 0.49.0` (pinned in requirements.txt).
- The model uses a reproducible seed dataset (documented in model.py) — a
  defensible, lightweight choice for an undergraduate FYP.
- Complexity is derived from the description length when posting a job.
