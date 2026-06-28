# Design System — HomeFixr
*HCI Deliverable (STEP 3). Built once, reused everywhere (DRY + Consistency).*

A single source of truth for visual and interaction design. Implemented as Tailwind theme
tokens + reusable React components in Iteration 0, then reused by every module.

---

## 1. Design Principles

1. **Trust-first** — verification, ratings, and payment status are always visible.
2. **Minimalist** — show only what the task needs (Aesthetic & Minimalist, Progressive Disclosure).
3. **Consistent** — one component, one behavior, everywhere (Jakob's Law, Standards).
4. **Accessible** — WCAG AA contrast, keyboard-operable, labeled (NFR-8).
5. **Responsive** — mobile-first, scales to desktop.

---

## 2. Color Palette (WCAG AA checked)

| Token | Hex | Use | Contrast note |
|---|---|---|---|
| `primary-600` | `#1D4ED8` | Primary buttons, links, active nav | 7.0:1 on white — AA/AAA text |
| `primary-700` | `#1E40AF` | Hover/pressed primary | Darker affordance |
| `primary-50` | `#EFF6FF` | Subtle primary backgrounds | Tints, selected rows |
| `success-600` | `#15803D` | Verified, Payment Released, success | 4.8:1 on white — AA |
| `warning-600` | `#B45309` | Pending, Payment Held, caution | 4.7:1 on white — AA |
| `danger-600` | `#B91C1C` | Errors, reject, destructive | 5.9:1 on white — AA |
| `neutral-900` | `#111827` | Primary text | 16:1 on white — AAA |
| `neutral-600` | `#4B5563` | Secondary text | 7.0:1 on white — AA |
| `neutral-200` | `#E5E7EB` | Borders, dividers | Non-text |
| `neutral-50` | `#F9FAFB` | Page background | Surface |
| `white` | `#FFFFFF` | Cards, inputs | Surface |

**Semantic mapping (status colors are meaning, not decoration):**
- Verified / Released / Completed → success
- Pending / Held / In Progress → warning
- Rejected / Error / Cancelled → danger
- Open / Neutral info → primary

> Color is never the *only* signal — status also carries a text label and/or icon
> (color-blind safe, WCAG 1.4.1).

---

## 3. Typography

- **Font:** Inter (system-ui fallback) — highly legible, free, web-safe.
- **Scale (modular, 1.25 ratio):**

| Token | Size / Line | Use |
|---|---|---|
| `text-xs` | 12 / 16 | Captions, metadata |
| `text-sm` | 14 / 20 | Secondary text, labels |
| `text-base` | 16 / 24 | Body (min for readability) |
| `text-lg` | 18 / 28 | Emphasis, card titles |
| `text-xl` | 20 / 28 | Section headings |
| `text-2xl` | 24 / 32 | Page titles |
| `text-3xl` | 30 / 36 | Hero / landing |

- **Weights:** 400 body, 500 labels, 600 headings/buttons.
- **Min body size 16px**; line length capped ~70ch for readability.

---

## 4. Spacing & Layout

- **4px base unit** scale: 4, 8, 12, 16, 24, 32, 48, 64.
- **Grid:** 12-column responsive; max content width 1200px.
- **Breakpoints:** `sm 640` · `md 768` · `lg 1024` · `xl 1280`.
- **Radius:** `sm 6px` (inputs), `md 8px` (buttons/cards), `lg 12px` (modals).
- **Elevation:** subtle shadows only on cards/modals/overlays (depth without clutter).

---

## 5. Components (catalogue)

Each component defines all required interaction states: **default, hover, focus, active,
disabled, loading**, and where relevant **empty / error / success**.

| Component | Variants | Key states / notes |
|---|---|---|
| **Button** | primary, secondary, ghost, danger | hover, focus-ring, disabled, loading spinner; min 44×44px hit area (Fitts) |
| **Input / Textarea** | text, email, password, number | label, placeholder, focus ring, error message + `aria-invalid` |
| **Select / Dropdown** | single | keyboard-navigable, clear selected state |
| **Card** | job card, bid card, profile card | hover elevation; entire card not falsely clickable unless it is |
| **Badge** | status (verified/pending/rejected), category | icon + text + semantic color |
| **Alert / Toast** | success, warning, danger, info | dismissible; announced via `aria-live` |
| **Modal / Dialog** | confirm, form | focus trap, ESC to close, explicit confirm/cancel (dialog closure) |
| **Table** | admin queues | sortable headers, status cells, row actions |
| **Avatar** | user/provider | initials fallback |
| **Rating** | display + input | 1–5 stars, keyboard accessible |
| **Tabs** | section nav | active indicator, arrow-key nav |
| **Navbar** | role-aware | persistent, active link highlight |
| **EmptyState** | no jobs/bids/messages | icon + message + primary action |
| **Spinner / Skeleton** | loading | visible system status feedback |

---

## 6. Interaction States (mandatory everywhere)

| State | Treatment |
|---|---|
| Hover | Slight color/elevation change — affordance |
| Focus | Visible 2px focus ring (`primary-600`) — keyboard users |
| Loading | Spinner/skeleton + disabled control — system status |
| Empty | Friendly message + clear next action |
| Success | Toast/badge confirmation — dialog closure |
| Error | Inline message + recovery guidance — help users recover |

---

## 7. Iconography

- **Set:** Lucide (open-source, consistent stroke). Icons always paired with text labels for
  primary actions (recognition over recall).

---

## 8. Accessibility Checklist (per component)

- [ ] Keyboard operable (tab order, Enter/Space, ESC)
- [ ] Visible focus indicator
- [ ] Labels/`aria-*` on all inputs
- [ ] Color contrast ≥ AA (4.5:1 text)
- [ ] Status conveyed by text + icon, not color alone
- [ ] Error messages programmatically associated with fields
- [ ] Touch targets ≥ 44×44px

---

## 9. Heuristic Coverage Map (how the system satisfies the rules)

| Principle | Where it lives in the design system |
|---|---|
| Visibility of system status | Spinners, skeletons, status badges, toasts |
| Match real world | Plain labels (Job, Bid, Verified, Paid) |
| User control & freedom | Cancel buttons, ESC-to-close, easy reversal |
| Consistency & standards | Single component library, role-aware navbar |
| Error prevention | Validation, confirm dialogs for destructive actions |
| Recognition over recall | Persistent nav, visible status, labeled icons |
| Flexibility & efficiency | Filters, sort, shortcuts on dashboards |
| Aesthetic & minimalist | Restrained palette, progressive disclosure |
| Help users recover | Inline errors + recovery guidance |
| Help & documentation | Empty-state hints, "How it works" page |
