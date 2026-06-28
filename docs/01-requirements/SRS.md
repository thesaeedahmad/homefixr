# Software Requirements Specification (SRS)
## HomeFixr — Connecting Homeowners with Trusted Professionals

**Project type:** BS Software Engineering Final Year Project
**Team:** Ahmad Abbas Khan (223202005), Arman Khan (223202403), Saeed Ahmad (223202921)
**Supervisor:** Dr. Muhammad Nawaz
**Document status:** Baseline (derived from approved proposal, 27-Oct-2025)

---

## 1. Introduction

### 1.1 Purpose
This document specifies the functional and non-functional requirements for HomeFixr, a
web-based platform that connects homeowners with verified service providers through a
competitive bidding system, supported by lightweight AI for fair pricing, fraud detection,
and identity verification, and an escrow **payment simulation**.

### 1.2 Scope
HomeFixr lets customers post home-maintenance jobs across five categories (Plumbing,
Electrical, Appliances, Handyman, Cleaning), receive competitive bids from verified
providers, communicate via real-time chat, transact through a simulated escrow workflow,
and exchange reviews. An administrator verifies providers and oversees fraud handling.

### 1.3 Definitions
| Term | Meaning |
|---|---|
| Customer | Homeowner who posts jobs and hires providers |
| Provider | Verified professional who bids on and completes jobs |
| Administrator | Platform operator who approves verifications and reviews fraud flags |
| Bid / Offer | A provider's priced proposal for a job |
| Escrow simulation | Simulated payment state machine (Held → Released); no real money |
| Trust badge | UI marker shown on a verified provider's profile |

---

## 2. Stakeholders & User Roles

| Role | Responsibilities |
|---|---|
| Customer (Homeowner) | Post/edit/cancel jobs, review & accept bids, pay into escrow, confirm completion, leave reviews |
| Provider (Professional) | Complete identity verification, browse jobs, submit bids, chat, complete work, receive released payment |
| Administrator | Approve/reject verification documents, review fraud flags, oversee users and jobs |

---

## 3. Functional Requirements

### Authentication & Accounts
- **FR-1** Users register as Customer or Provider with email and password.
- **FR-2** Passwords are stored hashed (bcrypt); sessions use JWT.
- **FR-3** Role-based access control (Customer / Provider / Admin).
- **FR-4** Users manage their profile (name, contact, location, avatar).

### Identity Verification *(Objective 2)*
- **FR-5** Providers upload ID and trade-license documents.
- **FR-6** Admin reviews and approves/rejects verification.
- **FR-7** Verified providers display a trust badge.
- **FR-8** *(Phase 2, optional)* Face-vs-ID photo match assist (DeepFace).

### Job Posting & Categories *(Scope)*
- **FR-9** Customer posts a job (category, title, description, location, photos, budget hint).
- **FR-10** Fixed categories: Plumbing, Electrical, Appliances, Handyman, Cleaning.
- **FR-11** Customer can edit or cancel an open job.
- **FR-12** Job lifecycle: Open → In Progress → Completed → Closed.

### Bidding / Offers *(Objective 3)*
- **FR-13** Provider submits a bid (hourly rate, estimated hours, equipment/material cost, message).
- **FR-14** Bid total is computed transparently: rate × hours + equipment cost.
- **FR-15** Customer views, compares, and accepts one bid; others are auto-rejected.
- **FR-16** Accepting a bid assigns the provider and moves the job to In Progress.

### AI — Fair Price Recommendation *(Objective 4)*
- **FR-17** On job posting, the system suggests a fair price range for the category/inputs.
- **FR-18** Providers see fair-rate guidance while bidding.

### AI — Fraud Detection *(Objective 4)*
- **FR-19** The system flags suspicious bids/accounts (rule-based + lightweight ML) for Admin review.

### Chat *(Scope)*
- **FR-20** Real-time one-to-one text messaging between matched customer and provider (Socket.io).

### Escrow Payment Simulation *(Objective 5)*
- **FR-21** Customer "pays" → status **Payment Held** (simulated; no real gateway).
- **FR-22** Provider marks work done → Customer confirms → status **Payment Released**.
- **FR-23** A minimal dispute/withhold path returns the case to Admin.

### Reviews & Ratings
- **FR-24** After completion, the customer rates the provider (1–5 + comment).
- **FR-25** Provider profiles show an aggregate rating (the trust mechanism).

### Notifications
- **FR-26** In-app notifications for key events (new bid, bid accepted, message, payment, verification result).

### Dashboards & Search
- **FR-27** Customer dashboard (my jobs, bids received, payments).
- **FR-28** Provider dashboard (available jobs, my bids, earnings, verification status).
- **FR-29** Admin dashboard (verification queue, fraud flags, users, jobs).
- **FR-30** Search/filter jobs by category and location.

### Settings
- **FR-31** Account settings, password change, notification preferences.

---

## 4. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-1 | Security | Hashed passwords, JWT auth, RBAC, input validation, SQLi & XSS prevention, basic CSRF protection |
| NFR-2 | Usability / HCI | Every screen follows Nielsen + Shneiderman + WCAG; all interaction states present |
| NFR-3 | Performance | Interactive in < 2s on free-tier hosting; immediate feedback on every action |
| NFR-4 | Reliability | Graceful error handling and logging; no unhandled crashes |
| NFR-5 | Maintainability | Clean Architecture, SOLID/DRY/KISS, TypeScript, consistent naming |
| NFR-6 | Responsiveness | Works across desktop and mobile breakpoints |
| NFR-7 | Deployability | Free-tier deploy: Vercel (web) + Render (api, ai) |
| NFR-8 | Accessibility | Keyboard nav, focus indicators, labels, contrast (WCAG) |

---

## 5. Assumptions & Constraints

1. Escrow is a **simulation** — no Stripe/PayPal integration.
2. Facial recognition is **Phase 2**; core verification is document upload + Admin approval.
3. Administrator is a required role though the proposal names only client/provider.
4. Categories are a fixed set (no dynamic category management).
5. Chat is text-only, one-to-one (no files/voice/video).
6. Single currency and locale; no tax engine.
7. "Equipment cost" is a bid line item, not an inventory system.
8. Maps use Leaflet + OpenStreetMap (no paid Maps API).

---

## 6. Requirement Traceability (Objective → FR → Course)

| Proposal Objective | Functional Requirements | Course demonstrated |
|---|---|---|
| Web app for clients/providers | FR-1…FR-4, FR-27…FR-31 | SE, HCI |
| Secure verification | FR-5…FR-8 | Information Security, AI |
| Dynamic bidding | FR-9…FR-16 | DBMS, Requirement Engineering |
| AI pricing + fraud | FR-17…FR-19 | Artificial Intelligence |
| Escrow payments | FR-21…FR-23 | SE, DBMS |
| Deployment deliverable | NFR-7 | Cloud Computing |
