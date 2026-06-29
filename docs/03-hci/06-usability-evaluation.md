# Usability Evaluation Plan & Instruments — HomeFixr
*HCI Deliverable (Iteration 12). Usability testing + System Usability Scale (SUS).*

> **Note on data:** the test plan, tasks, and questionnaires below are complete
> and ready to run. The **results sections are templates** to be filled with real
> participant data (collected via the Google Form). An *illustrative* example is
> included and clearly labelled — replace it with your actual results.

---

## 1. Goals
Evaluate whether new users can complete HomeFixr's core tasks efficiently and
with satisfaction, and obtain a quantitative usability score (SUS) for the report.

## 2. Participants
- **Target:** 5–8 participants (Nielsen: ~5 users surface ~85% of usability
  issues). Mix of "homeowner" and "provider" mindsets.
- **Recruitment:** classmates / family acquaintances; no special expertise needed.
- **Ethics:** participation voluntary, data anonymised, used for academic purposes only.

## 3. Setup
- Three services running (web, api, ai) on a test machine, or the deployed URLs.
- Seed a few sample jobs so browsing isn't empty.
- Facilitator observes; records task success, time on task, and errors.

## 4. Task scenarios

**Customer tasks**
1. Register as a customer.
2. Post a plumbing job with a title, description, and location.
3. Read the AI fair-price suggestion.
4. After bids arrive (facilitator places test bids), compare them and accept one.
5. Pay into escrow, then release payment after marking the work done.
6. Leave a 5-star review.

**Provider tasks**
7. Register as a provider and submit verification documents.
8. Browse jobs and filter by category.
9. Place a bid and read the live total.
10. Open the chat and send a message.

## 5. Metrics
| Metric | How measured | Target |
|---|---|---|
| Task success rate | completed / attempted | ≥ 90% |
| Time on task (post a job) | stopwatch | < 2 min |
| Errors per task | observed mistakes | low |
| SUS score | questionnaire (below) | ≥ 68 (above average) |
| Satisfaction | post-task comment | positive |

---

## 6. System Usability Scale (SUS) questionnaire
Standard 10-item SUS. Responses on a 1–5 scale (1 = Strongly disagree, 5 = Strongly agree).

1. I think that I would like to use HomeFixr frequently.
2. I found HomeFixr unnecessarily complex.
3. I thought HomeFixr was easy to use.
4. I think that I would need the support of a technical person to use HomeFixr.
5. I found the various functions in HomeFixr were well integrated.
6. I thought there was too much inconsistency in HomeFixr.
7. I would imagine that most people would learn to use HomeFixr very quickly.
8. I found HomeFixr very cumbersome to use.
9. I felt very confident using HomeFixr.
10. I needed to learn a lot of things before I could get going with HomeFixr.

**Scoring:** odd items: (response − 1). Even items: (5 − response). Sum the 10
contributions and multiply by 2.5 → SUS score out of 100. (≥ 68 is above average.)

## 7. Google Forms questionnaire (questions to create)
Create a Google Form with:
- **Section 1 — Consent & role:** "I consent to participate" (Yes/No); "Which
  role did you test?" (Customer / Provider / Both).
- **Section 2 — Task feedback:** for each task: "Were you able to complete this
  task?" (Yes / No / With difficulty); optional comment.
- **Section 3 — SUS:** the 10 statements above as Linear scale (1–5).
- **Section 4 — Open feedback:** "What did you like most?", "What was confusing?",
  "Any suggestions?"

---

## 8. Results — task success (TEMPLATE — fill with real data)

| Task | Attempts | Successes | Success rate | Avg time | Notes |
|---|---|---|---|---|---|
| Register | — | — | — | — | — |
| Post a job | — | — | — | — | — |
| Compare & accept bid | — | — | — | — | — |
| Pay & release (escrow) | — | — | — | — | — |
| Leave a review | — | — | — | — | — |
| Submit verification | — | — | — | — | — |
| Filter & bid | — | — | — | — | — |
| Chat | — | — | — | — | — |

## 9. Results — SUS (TEMPLATE — fill with real data)

| Participant | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | SUS |
|---|---|---|---|---|---|---|---|---|---|---|---|
| P1 | | | | | | | | | | | |
| P2 | | | | | | | | | | | |
| … | | | | | | | | | | | |
| **Mean** | | | | | | | | | | | **—** |

## 10. Illustrative example (REPLACE with real results)
*For format only — not real data.* If five participants returned SUS scores of
82.5, 77.5, 90, 72.5, and 85, the **mean SUS = 81.5**, which falls in the
"Good / B" range (above the 68 average), indicating the interface is usable. Task
success in this illustrative run was 38/40 (95%), with the two failures being a
participant missing the "Mark work as done" step before release — addressed by the
sequencing guard and the panel's plain-language prompt.

## 11. Interpretation guide (Sauro & Lewis bands)
| SUS | Grade | Adjective |
|---|---|---|
| > 80.3 | A | Excellent |
| 68–80.3 | B/C | Good |
| 68 | C | Average |
| 51–68 | D | Poor |
| < 51 | F | Awful |
