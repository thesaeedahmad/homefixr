# Chapter 2 — Background Study (Draft)

## 2.1 Domain background
Home maintenance is a frequent need, but finding a trustworthy professional at a
fair price is hard. Word-of-mouth doesn't scale; classified listings lack
verification and accountability; and fixed-price apps remove the ability to
negotiate. The result is uncertainty for customers and unstable demand for
providers.

## 2.2 Related work
| Platform | Approach | Strength | Limitation |
|---|---|---|---|
| TaskRabbit | Marketplace of taskers | Large supply, scheduling | Pricing opacity; limited bidding transparency |
| Thumbtack | Lead generation | Connects pros to leads | Providers pay per lead; variable trust |
| Urban Company | Standardised services | Consistent quality, fixed price | Little negotiation; not a true marketplace |
| Local classifieds | Free listings | Simple, accessible | No verification, escrow, or ratings trust |

## 2.3 Limitations of existing solutions
- **Pricing transparency:** customers rarely see *why* a price is what it is.
- **Trust & verification:** identity/credential checks are inconsistent.
- **Payment safety:** few offer a clear "held until satisfied" workflow.
- **Negotiation:** fixed-price models exclude competitive bidding.

## 2.4 How HomeFixr addresses them
HomeFixr combines, in one simple flow: **transparent competitive bidding** (rate ×
hours + equipment), **AI fair-price guidance**, **document-based verification with
admin approval**, **ratings** as a trust signal, and an **escrow simulation** that
holds payment until the customer confirms completion.

## 2.5 Literature review (brief)
- **Usability (Nielsen):** ~5 evaluators/users surface the majority of usability
  problems; heuristic evaluation is a cost-effective discount-usability method.
  HomeFixr applies Nielsen's 10 heuristics and the System Usability Scale (SUS,
  Brooke 1996) for evaluation.
- **Trust in online marketplaces:** reputation systems (ratings/reviews) and
  identity verification materially increase user trust; HomeFixr implements both.
- **Lightweight ML for pricing:** simple regression models provide useful,
  explainable estimates without heavy infrastructure — appropriate for an
  advisory price hint rather than an authoritative quote.
- **Clean/layered architecture (SOLID):** separating routing, business logic, and
  data access improves testability and maintainability, which suited the
  iterative, multi-author development of this project.

## 2.6 Summary
The market gap is trust and transparency. HomeFixr's contribution is integrating
bidding, AI guidance, verification, ratings, and escrow into a single, simple,
usable product appropriate for an undergraduate Final Year Project.
