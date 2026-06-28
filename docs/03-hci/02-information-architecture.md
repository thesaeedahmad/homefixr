# Information Architecture — HomeFixr
*HCI Deliverable (STEP 3). Defines structure & navigation before wireframes.*

Applies **Hick's Law** (limit choices), **Miller's Law** (chunk into 5±2 groups), and
**Recognition over Recall** (persistent, role-based navigation).

---

## 1. Site Map (role-based)

```
HomeFixr
│
├─ Public
│   ├─ Landing / Value proposition
│   ├─ How it works
│   ├─ Login
│   └─ Register (choose role: Customer | Provider)
│
├─ Customer (authenticated)
│   ├─ Dashboard (my jobs, bids received, payments)
│   ├─ Post a Job
│   ├─ My Jobs → Job detail → Bids → Bid detail
│   ├─ Messages (chat)
│   ├─ Notifications
│   ├─ Reviews (leave/view)
│   └─ Settings (profile, password, notifications)
│
├─ Provider (authenticated)
│   ├─ Dashboard (available jobs, my bids, earnings, verification status)
│   ├─ Browse Jobs → Job detail → Submit Bid
│   ├─ My Bids
│   ├─ Verification (upload ID + license, status)
│   ├─ Messages (chat)
│   ├─ Notifications
│   └─ Settings
│
└─ Administrator (authenticated)
    ├─ Dashboard (overview)
    ├─ Verification Queue → Document review
    ├─ Fraud Flags → Account review
    ├─ Users
    └─ Jobs
```

**Chunking:** Each role sees ≤ 7 top-level items (Miller's Law) — no role is overloaded.

---

## 2. Navigation Structure

- **Primary nav:** persistent top bar (logo, role-specific links, notifications bell, profile menu). *Consistency & Recognition.*
- **Secondary nav:** contextual within a section (e.g., tabs on Job detail: Details / Bids / Chat).
- **Utility nav:** profile dropdown (Settings, Logout) — *User control & easy reversal.*
- **Mobile:** primary nav collapses to a bottom tab bar / hamburger; thumb-reachable primary actions (*Fitts' Law*).

Navigation is **role-aware**: the same component renders different links based on the
authenticated role, keeping the mental model consistent (*Jakob's Law*).

---

## 3. Core Task Flows

### Task Flow A — Customer posts a job and hires
```
Login → Dashboard → [Post a Job] → Fill form (category, desc, photos)
   → See AI fair-price hint → Submit → Job = OPEN
   → Receive bids (notification) → Compare bids → Accept bid
   → Job = IN_PROGRESS → Pay (sim) = HELD → Confirm completion = RELEASED → Review
```

### Task Flow B — Provider verifies and bids
```
Register (Provider) → Verification (upload ID + license) → status PENDING
   → (Admin approves) → status VERIFIED + badge
   → Browse Jobs → Filter (category, location) → Job detail → Submit Bid
   → (Accepted) → Do work → Mark done → (Customer confirms) → Payment RELEASED
```

### Task Flow C — Admin verifies a provider
```
Login → Verification Queue → Open document → Compare ID/license
   → Approve | Reject (with reason) → Provider notified
```

---

## 4. User Flow (decision view — accepting a bid)

```
Job detail (OPEN)
   │
   ├─ No bids yet ──► Empty state: "No bids yet — we'll notify you"
   │
   └─ Bids present
        │
        ├─ Compare (rate, hours, equipment, total, rating, badge)
        │
        ├─ Accept one ──► Confirm dialog ──► Yes ─► Others auto-REJECTED, job IN_PROGRESS
        │                                   └─ No  ─► Back to comparison (easy reversal)
        │
        └─ Cancel job ──► Confirm ──► Job CLOSED
```

---

## 5. Screen Hierarchy (visual priority per screen)

| Screen | Primary (most prominent) | Secondary | Tertiary |
|---|---|---|---|
| Customer Dashboard | Post a Job CTA | Active jobs list | Recent notifications |
| Post a Job | Category + description fields | AI price hint | Photo upload |
| Job Detail (Customer) | Bid comparison | Job info | Chat entry |
| Browse Jobs (Provider) | Job cards (category, budget) | Filters | Sort |
| Submit Bid | Total breakdown | Message field | Job summary |
| Verification | Upload areas + status | Guidance text | History |
| Admin Queue | Action buttons (approve/reject) | Document preview | Metadata |

Visual hierarchy is enforced through size, weight, color, and spacing (Gestalt grouping +
progressive disclosure: advanced details revealed only when needed).

---

## 6. Content Organization Principles

- **Card layout** for browseable collections (jobs, bids) — scannable, chunked.
- **Tables** for dense admin data — sortable, status-coded.
- **Detail pages** use a summary-then-detail order (progressive disclosure).
- **Status is always visible** (job status, payment status, verification status) — *Visibility of System Status*.
- **Consistent terminology** across all roles (Job, Bid, Payment Held/Released, Verified).
