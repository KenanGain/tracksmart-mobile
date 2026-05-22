---
title: Screen Catalogue
type: doc
tags: [screens, routes, status]
updated: 2026-05-22
---

# 📱 Screen Catalogue

> [!abstract] Purpose
> The definitive list of every screen in TrackSmart Mobile with status, route, and full spec. See [[06-roadmap]] for milestone ordering.

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ Done | Fully implemented |
| 🔲 Planned | Not yet built |

---

## Implemented Screens (✅ All Done — M0–M5)

| Route | Screen | Group |
|-------|--------|-------|
| `/auth/sign-in` | Sign In | Auth (no shell) |
| `/home` | Home | Tab |
| `/trips` | Trips | Tab |
| `/bulletin` | Bulletin | Tab |
| `/calendar` | Schedule | Tab |
| `/chats` | Chats | Tab |
| `/trips/[id]` | Trip Detail | Detail (shell) |
| `/compliance` | My Compliance | Detail (shell) |
| `/account/settings` | Settings | Detail (shell) |
| `/account/trip-history` | Trip History | Detail (shell) |
| `/account/about` | About | Detail (shell) |
| `/notifications` | Notifications | Full-screen |
| `/expenses` | Expense Status | Full-screen |
| `/expenses/new` | Submit Expense | Full-screen |
| `/trip-sheets` | Trip Sheet Status | Full-screen |
| `/trip-sheets/new` | Submit Trip Sheet | Full-screen |
| `/chat/[id]` | Chat Thread | Full-screen |

---

## Planned Screens (M6+)

| Route | Screen | Milestone |
|-------|--------|-----------|
| `/trips/[id]/loads/[loadId]` | Load Detail | M6 |
| `/trips/[id]/route` | Full-Screen Route Map | M6 |
| `/bulletin/[id]` | Bulletin Notice Detail | M6 |
| `/maintenance/new` | Maintenance Request | M6 |

---

## Per-Screen Specifications

---

### 🔐 Sign In `/auth/sign-in`

No shell. Entry point of the app.

- **Brand block** — dark tile (`bg-ink rounded-2xl`), app name, tagline
- **Quick demo login** — `#demo-user` select; picking a user autofills email + password
- **Email + password fields** — password has show/hide toggle
- **Sign In button** — mock auth via `lib/api/auth.ts` → `lib/data/users.ts`
- **Prototype disclaimer**
- On success → `/home`

---

### 🏠 Home `/home`

Tab screen. Driver's daily overview.

Cards (top to bottom):
1. **Company card** — carrier monogram + name ("Transformer Logistics")
2. **My Compliance card** → `/compliance`
3. **Expenses card** — "Submit New" → `/expenses/new` · "Status" → `/expenses`
4. **Maintenance Requests card** — New Request + History (placeholder)
5. **Trip Sheets card** — "Submit New" → `/trip-sheets/new` · "Status" → `/trip-sheets`
6. **Payroll card** — summary + empty state
7. **Time Tracking card** — CLOCK IN / CLOCK OUT toggle + live elapsed timer
8. **Refresh + Help row**
9. **Log Out** — red outline → confirmation dialog → sign-in

---

### 🛣️ Trips `/trips`

Tab screen. **Implemented as a PillTab switcher** (not collapsible sections).

**`PillTabs`** bar — three tabs:
- 🚛 **Current** — one trip card or empty note
- 📅 **Upcoming** — list or empty note
- 🕐 **Previous** — list or empty note

**`TripCard`** for each trip (variant: `current` | `upcoming` | `previous`):
- Trip ref + `StatusBadge`
- Route: origin → destination
- Date/time window
- Meta row: stops · power unit · equipment
- **`TripMap`** — interactive Leaflet/OSM map with brand polyline + numbered pins (current trip only)
- "View trip →" → `/trips/[id]`

---

### 📋 Trip Detail `/trips/[id]`

Detail route (back button + "Trip \<id\>" title).

- **Summary card** — embedded `TripMap`
- **Progress strip** — done/total + `LinearProgress`
- **Dispatch Note card**
- **Trip Details card** — equipment, power unit, trailer, drivers, dispatcher
- **Stop Timeline** — `TripStopRow` for each stop

**Stop kinds & workflows** (all via `StopActions.tsx`):

| Kind | Buttons | Dialog Flow |
|------|---------|------------|
| `pickup` | Arrived · Picked Up · Departed | Arrived → odometer · Picked Up → confirm trailer → confirm temp → doc upload |
| `drop-off` | Arrived · Delivered | Arrived → odometer · Delivered → e-signature → doc upload |
| `acquire` | Completed | → odometer reading |
| `hook` | Completed | → confirm trailer |
| `docking` `loading` `unloading` `check-call` | Completed | direct |

**Stop states:** done (green `bg-success/10`) · next (brand ring + "Next" badge) · upcoming (muted)

**StopActions dialogs (all `BottomSheet`):**
- **ConfirmTrailerDialog** — current trailer display, Wrong / Correct / Skip
- **ValueDialog** — single value input (odometer km or temperature), Confirm button
- **SignatureDialog** — canvas draw-to-sign pad, Clear / Confirm / Skip signature
- **AddDocumentSheet** — Scan / Camera / Gallery / Files / Skip

After each action → **Action History** list (label + timestamp + detail, green check icon).

**Navigate button** (Pick Up / Drop Off only) → opens Google Maps directions.

---

### 📢 Bulletin `/bulletin`

Tab screen. Load tender feed.

- Search bar
- **LoadTender cards**: sender + time + unread dot · route + dates · **Accept** (brand) / **Decline** (outline) buttons
- After action: collapses to `StatusBadge`, expandable detail

---

### 📅 Schedule `/calendar`

Tab screen (labelled "Schedule").

Toggle: **Calendar** | **List**

**Calendar view:**
- Month grid, prev/next nav
- Day dots: 🟢 shift · 🔵 event · 🟡 clock record
- Today = brand ring; selected = dark ring
- Day detail: Events / Shifts / Timesheet tabs

**List view:**
- Date-grouped agenda (shifts + events + tenders)
- `_AgendaDateHeader` with "Today" badge
- `_AgendaRow`: icon chip · title · subtitle · kind tag

---

### 💬 Chats `/chats`

Tab screen.

- Search bar
- Conversation list: avatar monogram · name · last message · time · unread dot
- **"+ New chat"** pill → `NewChatSheet` (contact picker, searchable)
- Tap conversation → `/chat/[id]`

### 💬 Chat Thread `/chat/[id]`

Full-screen (own header, no shell).

- AppBar: back + contact name
- Message bubbles: incoming grey-left / outgoing brand-right · times · day dividers
- Message input bar: attach + send
- Empty state: "Start the conversation"

---

### 🔔 Notifications `/notifications`

Full-screen (own header, no shell). Opened from top-bar 🔔.

- Search bar
- "Today" feed: icon chip · title + time · message · unread dot
- Kinds: Trip Changed · Itinerary Changed

---

### 📄 My Compliance `/compliance`

Detail route (inside shell).

**Basic section:**
- Driver's License card — label/value rows, expiry, **Update**
- Passport card — same
- Emergency Contact card

**Documents section** — "Add" → `AddDocumentSheet`:
  - Scan / Take Photo / Upload from Files / Select from Gallery

**Certifications section** — "Add" → `AddCertificationSheet`:
  - name, category, result (pass/fail), expiry, document, note

---

### 💸 Submit Expense `/expenses/new`

Full-screen 5-step wizard (own header, no shell).

| Step | Content |
|------|---------|
| 1 | Select type: Payroll Addition / Company Paid |
| 2 | Add receipt: Scan / Photo / Gallery / Files + Skip |
| 3 | Details: amount + currency, description + quick chips, notes, vendor |
| 4 | Category: Truck / Trailer / General + optional truck search |
| 5 | Review & Submit → back to Home |

### 💸 Expense Status `/expenses`

Full-screen (own header, no shell).

**PillTabs** — **Payroll Addition** | **Company Paid**

- Search bar
- Filtered list: description · `StatusBadge` · trip chip (`brand-light` bg) · amount · date
- Empty state card

Data: `lib/data/expenses.ts` → `lib/api/expenses.ts`, typed `ExpenseRecord`.

---

### 📋 Submit Trip Sheet `/trip-sheets/new`

Full-screen (own header, no shell).

- Trip sheet preview
- Upload grid: Scan / Camera / Gallery / Files
- Period start/end date row
- Optional note
- Submit button (enabled once sheet is attached)

### 📋 Trip Sheet Status `/trip-sheets`

Full-screen — period range · `StatusBadge` · submitted date.

---

### ⚙️ Settings `/account/settings`

Detail route.

- **Notifications toggles:** Trip · Message · Bulletin · Calendar
- **Appearance:**
  - Font Size — Default / Small / Large (cycles)
  - Theme — System / Light / Dark (cycles)

---

### 🕐 Trip History `/account/trip-history`

Detail route — list of completed trip cards.

### ℹ️ About `/account/about`

Detail route — app identity, version, provider, support, legal links.

---

## Screen Conventions (All Screens Must Follow)

> [!important] Hard rules — never skip
> 1. Render `<main>` content only — shell owns chrome
> 2. Three states: **loading · empty · error**
> 3. One primary action, bottom-anchored, thumb-reachable
> 4. Use [[03-design-system]] tokens — no hex values
> 5. Data via `lib/api/*` only
> 6. After implementing → update [[agents/05-flutter-mirror]] (dual-output rule)

---

## 🔗 Related

[[00-home]] · [[01-design]] · [[03-design-system]] · [[04-architecture]] · [[06-roadmap]]
