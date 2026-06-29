# Chapter 6 — Conclusion and Future Work (Draft)

## 6.1 Conclusion
HomeFixr set out to make hiring home-service professionals more transparent and
trustworthy. The delivered system meets every approved proposal objective:
customers post jobs and receive transparent competitive bids; providers verify
their identity and get paid through an escrow workflow; lightweight AI offers
fair-price guidance and flags suspicious activity; and real-time chat, reviews, and
notifications support the end-to-end experience.

The project was built iteratively with clean, layered architecture, with tests and
documentation produced alongside the code. All functional requirements (FR-1…FR-31)
were implemented and verified against a live database, both applications type-check
and build cleanly, and the heuristic evaluation found no major usability problems.
The emphasis throughout was on **academic quality** — correctness, usability,
documentation, and maintainability — rather than unnecessary technical complexity.

## 6.2 Achievements
- A complete, working three-service application on free, mostly open-source tech.
- Strong HCI: a reusable design system, accessible components, and a heuristic +
  SUS evaluation.
- Clean software engineering: SOLID/DRY/KISS, REST, transactions, RBAC, and
  comprehensive per-iteration testing.
- Full documentation set: SRS, architecture, ER/use-case material, API reference,
  test reports, HCI artifacts, and report chapters.

## 6.3 Limitations
- The escrow payment is a **simulation** (by design).
- Facial-recognition verification is an **optional Phase 2** and was not enabled.
- Fraud detection is **rule-based** and catches obvious patterns only.
- Usability results rely on a small participant sample.

## 6.4 Future work
- **Phase 2 face match:** add a DeepFace ID-vs-selfie check to strengthen
  verification.
- **Richer AI pricing:** train on real historical job data for better estimates.
- **Real payments:** integrate a payment gateway (out of FYP scope).
- **Provider scheduling/calendar** and **map-based job discovery** (Leaflet).
- **Push/email notifications** in addition to the in-app feed.
- **More automated tests** (Supertest end-to-end, React Testing Library) and CI.
- **Accessibility polish** items from the heuristic evaluation (styled modals,
  Help/FAQ page, relative timestamps).

## 6.5 Closing remark
HomeFixr demonstrates that a focused, well-engineered, and usable product can
address a real problem within the scope of an undergraduate Final Year Project,
while leaving clear, well-understood paths for future enhancement.
