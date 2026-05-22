---
title: Screen Catalogue
type: doc
tags: [screens, routes, status]
updated: 2026-05-22
---

# 📱 Screen Catalogue

> [!abstract] Purpose
> The definitive list of every screen/route in TrackSmart Mobile, with its status and spec. Implement screens in the order given by [[06-roadmap]].

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Fully implemented |
| 🔲 | Planned — not yet built |
| 🔧 | Scaffold — route exists, renders placeholder |

---

## Navigation Tabs (Bottom Nav)

| Route | Screen | Status |
|-------|--------|--------|
| `/home` | Home | ✅ Done |
| `/trips` | Trips | ✅ Done |
| `/bulletin` | Bulletin | ✅ Done |
| `/calendar` | Schedule | ✅ Done |
| `/chats` | Chats | ✅ Done |

---

## Auth Routes (No Shell)

| Route | Screen | Status |
|-------|--------|--------|
| `/auth/sign-in` | Sign In | ✅ Done |

---

## Detail Routes (Inside Shell — Back Button)

| Route | Screen | Status |
|-------|--------|--------|
| `/trips/[id]` | Trip Detail | ✅ Done |
| `/compliance` | My Compliance | ✅ Done |
| `/account/settings` | Settings | ✅ Done |
| `/account/trip-history` | Trip History | ✅ Done |
| `/account/about` | About | ✅ Done |

---

## Full-Screen Routes (Own Header — No Nav)

| Route | Screen | Status |
|-------|--------|--------|
| `/notifications` | Notifications | ✅ Done |
| `/expenses` | Expense Status | ✅ Done |
| `/expenses/new` | Submit Expense | ✅ Done |
| `/trip-sheets` | Trip Sheet Status | ✅ Done |
| `/trip-sheets/new` | Submit Trip Sheet | ✅ Done |
| `/chat/[id]` | Chat Thread | ✅ Done |

---

## Planned Routes

| Route | Screen | Status |
|-------|--------|--------|
| `/trips/[id]/loads/[loadId]` | Load Detail | 🔲 Planned |
| `/trips/[id]/route` | Full-Screen Route Map | 🔲 Planned |
| `/bulletin/[id]` | Bulletin Notice Detail | 🔲 Planned |
| `/trips/new` | Create Trip | 🔲 Planned |

---

## Per-Screen Specifications

### 🔐 Sign In `/auth/sign-in`

Renders **outside** the app shell — no TopBar/BottomNav.

- **Brand block** — dark logo tile, app name "TrackSmart", tagline
- **Quick demo login** — dropdown of demo users; picking one autofills the form
- **Email + password fields** — password has show/hide toggle
- **Sign In button** — mock auth via `lib/api/auth.ts` → `lib/data/users.ts`
- **Prototype disclaimer** — "No real authentication is performed"
- On success → redirects to `/home`

---

### 🏠 Home `/home`

Tab screen — today's driver overview.

- **Company card** — carrier name + monogram logo (Transformer Logistics)
- **My Compliance card** — driver name, license, expiry, doc count → taps to `/compliance`
- **Expenses card** — "Submit New" → `/expenses/new` | "Status" → `/expenses`
- **Maintenance Requests card** — "New Request" + "History" (placeholder)
- **Trip Sheets card** — "Submit New" → `/trip-sheets/new` | "Status" → `/trip-sheets`
- **Payroll card** — summary + empty state
- **Time Tracking card** — CLOCK IN / CLOCK OUT toggle with live elapsed timer
- **Refresh + Help** buttons (side by side)
- **Log Out** — red outline button → confirmation dialog → sign-in

---

### 🛣️ Trips `/trips`

Tab screen — all trips grouped by status.

Three collapsible sections with count badges:
1. **Current Trip** — active, "In Progress" pill
2. **Upcoming Trips** — countdown badge (e.g. "IN 3d 6hr")
3. **Previous Trips** — completed

**`TripCard`** for each trip:
- Trip ID + status pill
- Route: origin → destination
- Date/time window
- Meta row: stop count · power unit · equipment + trailer
- **`TripMap`** — real interactive Leaflet + OpenStreetMap map with brand polyline and numbered pins
- "View trip →" footer link → `/trips/[id]`

> [!tip] Map behaviour
> Embedded map is a preview. Tapping it opens a **full-screen interactive map** with pan/zoom and pin popups.

---

### 📋 Trip Detail `/trips/[id]`

Detail route — back button + "Trip \<id\>" title.

- **Summary card** — route map, origin/destination, dates
- **Trip Progress strip** — done/total stops + progress bar
- **Dispatch Note card**
- **Trip Details card** — equipment, power unit, trailer, drivers, dispatcher, issued-on
- **Stop Timeline** — ordered list of all stops

**Stop types:** Acquire · Hook · Docking · Loading · Unloading · Pick Up · Deliver · Drop Off · Check Call

Each stop has 3 states:
- ✅ **Done** — green check, completed segment
- 🔵 **Next** — brand ring + "Next" badge
- ⬜ **Upcoming** — muted

**Freight stops** (Pick Up / Deliver / Drop Off) additionally show:
- **Odometer Reading** input
- **Upload Document** action → "Add Document" capture sheet
- **Mark as Completed** button

---

### 📢 Bulletin `/bulletin`

Tab screen — load tender feed from dispatch.

- Searchable feed of **Load Tender** cards
- Each card: sender + time + unread dot, route summary, pickup/delivery info
- **Accept / Decline** action buttons
- After action: collapses to status badge, can expand for full detail

---

### 📅 Schedule `/calendar`

Tab screen — labelled "Schedule", route stays `/calendar`.

**Calendar / List toggle:**

**Calendar view:**
- Month grid with prev/next navigation
- Day dots: 🟢 working · 🔵 event · 🟡 clock record
- Today = brand ring; selected day = dark ring
- Selected day detail: Events · Shifts · Timesheet (clock in/out/hours)

**List view:**
- Date-grouped agenda combining shifts, events, load tenders
- Each row: icon chip · title · subtitle · kind tag
- Date headers carry "Today" badge

---

### 💬 Chats `/chats`

Tab screen — messaging hub.

- Searchable conversation list: avatar, name, last message, time, unread dot
- **"New chat" button** → opens contact picker bottom sheet (searchable, avatars)
- Tapping a conversation → `/chat/[id]`

### 💬 Chat Thread `/chat/[id]`

Full-screen, no shell.

- Header: back + contact name
- Message bubbles: incoming grey / outgoing blue · times · sender labels · day dividers
- **Message input bar** — attach + send
- Empty state for new conversations: "Start the conversation"

---

### 🔔 Notifications `/notifications`

Full-screen, no shell. Opened from top-bar bell icon.

- Search bar
- "Today" feed of notification rows: icon chip · title + time · message · unread dot
- Kinds: Trip Changed · Itinerary Changed

---

### 📄 My Compliance `/compliance`

Detail route — opened from Home compliance card.

**Basic section:**
- Driver's License card — label/value rows, expiry status, **Update** button
- Passport card — same structure
- Emergency Contact card

**Documents section:**
- "Add" → "Add Document" sheet: Scan / Take Photo / Upload from Files / Select from Gallery

**Certifications section:**
- "Add" → "Add New Certification" form: name, category, result, expiry, document, note

---

### 💸 Submit Expense `/expenses/new`

Full-screen 5-step wizard, no shell.

| Step | Content |
|------|---------|
| 1 | **Select Expense Type** — Payroll Addition / Company Paid |
| 2 | **Add Receipt** — AI hint banner + Scan / Photo / Gallery / Files + Skip |
| 3 | **Expense Details** — amount + currency, description + quick chips, notes, optional vendor info |
| 4 | **Expense Category** — Truck / Trailer / General + optional truck search |
| 5 | **Review & Submit** — summary → "Submit for Review" → back to Home |

### 💸 Expense Status `/expenses`

Full-screen list, no shell. Shows submitted expenses with status badges: **Pending · Approved · Rejected**.

---

### 📋 Submit Trip Sheet `/trip-sheets/new`

Full-screen, no shell.

- Trip sheet preview
- Upload grid: Scan / Camera / Gallery / Files
- Period start/end date row
- Optional note
- "Submit Trip Sheet" button (enabled once sheet is attached)

### 📋 Trip Sheet Status `/trip-sheets`

Full-screen list — period range · status badge · submitted date.

---

### ⚙️ Settings `/account/settings`

Detail route — opened from Account drawer.

**Notifications toggles:** Trip · Message · Bulletin · Calendar

**Appearance:**
- Font Size — Default / Small / Large (cycles on tap)
- Theme — System / Light / Dark (cycles on tap)

---

### 🕐 Trip History `/account/trip-history`

Detail route — list of completed trip cards.

### ℹ️ About `/account/about`

Detail route — app identity, version, provider, support info, legal links.

---

## Conventions for Every Screen

> [!important] All screens must follow these rules
> 1. Render `<main>` content only — the shell provides chrome
> 2. Provide **three states**: loading · empty · error
> 3. One primary action, bottom-anchored, thumb-reachable
> 4. Use tokens from [[03-design-system]] — no hard-coded colours
> 5. When implemented, **update [[agents/05-flutter-mirror]]** (dual-output rule)

---

## 🔗 Related

[[00-home]] · [[01-design]] · [[04-architecture]] · [[06-roadmap]]
