---
title: Screen catalogue
type: doc
tags: [screens, routes]
---

# Screen catalogue

> The full list of screens/routes. Status reflects the **scaffold** stage.
> Implement screens in the order given by [[roadmap]].

## Legend

- `scaffold` — route exists, renders a placeholder
- `planned` — not yet created
- `done` — implemented

## Top-level routes (bottom-nav tabs)

| Route | Screen | Status | Purpose |
|-------|--------|--------|---------|
| `/home` | Home | scaffold | Today's overview, role-aware |
| `/trips` | Trips | done | Current / Upcoming / Previous + stop timeline |
| `/bulletin` | Bulletin | done | Load Tender feed (accept / decline) |
| `/calendar` | Schedule | done | Month grid (events, shifts, timesheet) + agenda list |
| `/chats` | Chats | done | Conversation list (messaging) |

> **Account** is not a route — the account icon in the top bar opens a
> **side drawer** ("My Account") with links to its sub-screens.

> The bare route `/` redirects to `/auth/sign-in` (entry point). After
> signing in, the user lands on `/home`.

## Nested routes (to be added)

| Route | Screen | Status | Purpose |
|-------|--------|--------|---------|
| `/trips/[id]` | Trip detail | done | Map, progress, details, stop timeline |
| `/trips/[id]/route` | Route / map | planned | Dedicated full-screen route map |
| `/trips/[id]/loads/[loadId]` | Load detail | planned | Pickup, drop-off, references, documents |
| `/trips/new` | Create trip | planned | Business creates a trip |
| `/bulletin/[id]` | Notice detail | planned | Full announcement |
| `/chat/[id]` | Chat thread | done | Conversation messages (no shell) |
| `/account/settings` | Settings | done | Notification toggles + appearance |
| `/account/trip-history` | Trip History | done | Completed trips |
| `/account/about` | About | done | App version, provider, legal links |
| `/compliance` | My Compliance | done | Licence, passport, contact, documents |
| `/notifications` | Notifications | done | Trip/itinerary change feed (top-bar bell) |
| `/expenses` | Expense Status | done | Submitted expenses + approval status |
| `/expenses/new` | Submit Expense | done | 5-step expense wizard (no shell) |
| `/trip-sheets` | Trip Sheet Status | done | Submitted trip sheets + status |
| `/trip-sheets/new` | Submit Trip Sheet | done | Trip-sheet upload form (no shell) |
| `/auth/sign-in` | Sign in | done | Demo + manual sign-in (no shell) |

> **Loads** are not a top-level tab — a load always belongs to a trip, so
> loads are reached from a trip's detail screen. The `Load` entity still
> lives in [[data-model]].

## Per-screen specs

### Home `/home`
- ✅ **Company card** — carrier/business name + logo (monogram placeholder).
- ✅ **My Compliance card** — summary; taps through to `/compliance`.
- ✅ **Expenses / Maintenance Requests / Trip Sheets** — action cards.
  Expenses (`/expenses/new`, `/expenses`) and Trip Sheets
  (`/trip-sheets/new`, `/trip-sheets`) are wired; Maintenance Requests
  tiles are placeholders.
- ✅ **Payroll** — summary card with an empty state.
- ✅ **Time Tracking** — CLOCK IN / CLOCK OUT toggle with a live elapsed
  timer (green) while clocked in.
- ✅ **Refresh + Help** (side by side) + **Logout** (red outline, confirm
  dialog). Refresh reloads the page; Logout → sign-in.
- Active-trip card, quick stats, role-aware shortcuts. *(planned)*

### Trips `/trips`  ✅ done
- Three collapsible sections: **Current Trip**, **Upcoming Trips**,
  **Previous Trips** (each with a count badge).
- Every trip is a **`TripCard`** — id + a status pill (In Progress /
  countdown / Completed), the route (origin → destination), the
  date/time window, a meta row (stop count, power unit, equipment +
  trailer), a **route map** (`TripMap`) and a "View trip" footer.
- **`TripMap`** — a real map: **Leaflet + OpenStreetMap** tiles (no API
  key), a brand route polyline through the stop coordinates and numbered
  red pins. Loaded client-only via `next/dynamic` (`ssr: false`). The
  embedded map is a preview — **tapping it opens a full-screen
  interactive map** (pan / zoom, numbered-pin popups).
- Tapping any TripCard opens the trip detail page `/trips/[id]`.

### Trip detail `/trips/[id]`  ✅ done
- Detail route (TopBar back button + "Trip &lt;id&gt;").
- **`TripDetailView`** — the full trip: the summary card with the route
  map, a **Trip Progress** strip (done/total + bar), a **Dispatch Note**
  card, a **Trip Details** card (equipment, power unit, trailer, drivers,
  dispatcher, issued-on) and the stop **timeline**.
- Stop kinds: Acquire / Hook / Docking / Loading / Unloading / Pick Up /
  Deliver / Drop Off / Check Call. Each timeline stop has one of three
  states — **done** (green check), the **next** pending stop (brand ring
  + "Next" badge) or **upcoming** (muted). The rail node shows the stop
  number; the connector is green for completed segments.
- Each stop expands to its detail — equipment (unit / trailer), address,
  appointment date & time, pick-up / drop-off number, temperature,
  phone, email, directions and a per-stop note.
- **Pick Up**, **Deliver** and **Drop Off** stops (freight stops) get an
  **Odometer Reading** input (truck km) and an **Upload Document** action
  (opens the Add Document capture sheet). Every stop gets a **Mark as
  Completed** button.
- Data via `getTrips()` / `getTrip(id)` (`lib/api/trips.ts`, mock
  `lib/data/trips.ts`).

### Route / map (`/trips/[id]/route`)  *(planned)*
- The trip detail already embeds an interactive route map. A dedicated
  full-screen route / navigation view is still planned.

### Load detail `/trips/[id]/loads/[loadId]`
- Pickup & drop-off addresses + time windows.
- Cargo: weight, dimensions, references.
- Accept / Decline (carrier/driver).
- Document upload on pickup / delivery.

### Bulletin `/bulletin`  ✅ done
- A searchable feed of **Load Tender** cards from dispatch.
- Each card: sender + time + unread dot, "Load Tender", the route &
  pickup/delivery summary, and **Accept / Decline** actions.
- Accepting / declining collapses the card to a status badge; expanding
  it shows the full load detail (from, to, date, pickup, delivery).
- Data via `getLoadTenders()` (`lib/api/bulletin.ts`).

### Schedule `/calendar`  ✅ done
- The bottom-nav tab is labelled **Schedule** (route stays `/calendar`).
- A **Calendar / List** view toggle.
- **Calendar** — a month grid with **prev/next month navigation**. Each
  day block shows up to three dots: working day (green), scheduled
  event(s) (blue), a clock record (amber). Today is ringed brand, the
  selected day ringed dark. Below the grid the selected day shows its
  **Events**, **Shifts** and **Timesheet** (clock in / clock out /
  hours — "In progress" while the driver is still on the clock). The
  calendar is read-only.
- **List** — a date-grouped **agenda** combining shifts, scheduled events
  and load tenders. Each row has an icon chip, title, subtitle and a kind
  tag; the date header carries a "Today" badge.
- Data via `getUpcomingEvents()`, `getWorkingDates()`, `getShifts()`,
  `getClockRecords()` (`lib/api/schedule.ts`) and `getCalendarEvents()`
  (`lib/api/calendar.ts`).

### Chats `/chats`  ✅ done
- Searchable conversation list — avatar, name, last message, time,
  unread dot — plus a "New chat" button.
- Tapping a conversation → `/chat/[id]`.
- **New chat** opens the **contact list** in a bottom-sheet (searchable
  — avatar monogram, name, role). Picking a contact opens / starts the
  conversation at `/chat/[id]`.
- Data via `getConversations()` + `getContacts()`
  (`lib/api/contacts.ts`, mock `lib/data/contacts.ts`).

### Chat thread `/chat/[id]`  ✅ done
- Full-screen, no app shell. Header (back + name), message bubbles
  (incoming grey, outgoing blue) with times / sender labels and day
  dividers, and a message input bar (attach + send).
- A chat started from the contact list opens with an empty-state ("Start
  the conversation") until the first message.
- Data via `getConversations()` / `getConversation(id)`
  (`lib/api/chats.ts`). `getConversation` falls back to a contact when
  there is no existing thread, so New Chat opens a fresh conversation.

### Account (side drawer)  ✅ done
- The account icon in the TopBar opens the **"My Account"** side drawer
  (slides in from the right of the phone frame). Account is a drawer, not
  a route.
- Profile block: avatar monogram, name, role, organisation.
- Menu rows → **Trip History**, **Settings**, **About**.
- **Log Out** (red) → confirmation dialog → `/auth/sign-in`.
- Data via `getProfile()` (`lib/api/profile.ts`).

### Settings `/account/settings`  ✅ done
- Detail route — TopBar back button + "Settings".
- **Notifications** — on/off switches for Trip, Message, Bulletin and
  Calendar.
- **Appearance** — Font Size (Default / Small / Large) and Theme (Use
  system setting / Light / Dark) rows that cycle on tap, each showing the
  current value + chevron.
- Preferences are local to the prototype.

### Trip History `/account/trip-history`  ✅ done
- Detail route — opened from the account drawer.
- Lists completed trips as light-blue itinerary cards (`getTrips()`
  `.previous`), with a count and an empty state.

### About `/account/about`  ✅ done
- Detail route — opened from the account drawer.
- App identity (logo tile, name, tagline, version), a description, info
  rows (version, provider, support) and legal links.

### My Compliance `/compliance`  ✅ done
- Opened from the Home compliance card. Detail route — the TopBar shows a
  back button + "My Compliance".
- **Basic** section — three cards: Driver's License, Passport, Emergency
  Contact. Each shows label→value rows, an expiry status line, and an
  **Update** button that opens an "Update &lt;item&gt;" bottom-sheet form
  (fields prefilled, "Submit for Review").
- **Documents** section — **Add** opens the "Add Document" sheet (Scan
  Document / Take Photo / Upload from Files / Select from Gallery).
- **Certifications** section — **Add** opens the "Add New Certification"
  form (name, category, result, expiry, document, note).
- Data via `lib/api/compliance.ts`. Submitting a sheet is currently a
  mock (it just closes); capture and real submit need a backend.

### Submit Expense `/expenses/new`  ✅ done
- Opened from Home → Expenses → "Submit New". Full-screen flow, no app
  shell — its own header (back + "Submit Expense" + step N/5).
- 5 steps:
  1. **Select Expense Type** — Payroll Addition / Company Paid; both run
     the same flow.
  2. **Add Receipt** — AI hint banner + capture options (Scan / Photo /
     Gallery / Files) + Skip. Capture is a placeholder.
  3. **Expense Details** — amount + USD/CAD, description + quick chips,
     notes, optional vendor info (name, invoice #, date, address,
     city/state, country).
  4. **Expense Category** — Truck / Trailer / General expense + optional
     "Select Truck" search.
  5. **Review & Submit** — summary, then "Submit for Review".
- Submit is a mock (`lib/api/expenses.ts` `submitExpense`) → returns to
  Home.

### Expense Status `/expenses`  ✅ done
- Opened from Home → Expenses → "Status". Full-screen, no app shell —
  own header (back + "Expense Status").
- A list of submitted expenses; each row shows the description, amount +
  submitted date, and a status badge (Pending / Approved / Rejected).
- Data via `getExpenses()` (`lib/api/expenses.ts`, mock
  `lib/data/expenses.ts`).

### Submit Trip Sheet `/trip-sheets/new`  ✅ done
- Opened from Home → Trip Sheets → "Submit New". Full-screen, no shell.
- A trip-sheet preview, an "Upload Trip Sheet" 4-option grid (Scan /
  Camera / Gallery / Files — capture is a placeholder), a Period
  (start/end) row, an optional Note, and a "Submit Trip Sheet" button
  (enabled once a sheet is attached).
- Submit is a mock (`lib/api/trip-sheets.ts`) → opens the Status list.

### Trip Sheet Status `/trip-sheets`  ✅ done
- Opened from Home → Trip Sheets → "Status".
- A list of submitted trip sheets — period range, status badge
  (Pending / Approved / Rejected), submitted date.
- Data via `getTripSheets()` (`lib/api/trip-sheets.ts`).

### Notifications `/notifications`  ✅ done
- Opened from the top-bar notification bell. Full-screen, no app shell.
- Search + a "Today" feed of notification rows — icon chip, title +
  time, message, unread dot. Trip Changed / Itinerary Changed kinds.
- Data via `getNotifications()` (`lib/api/notifications.ts`).

### Sign in `/auth/sign-in`  ✅ done
- Renders **outside** the app shell — no TopBar/BottomNav (route lives in
  `app/auth/`, not the `app/(app)/` group).
- Brand block: dark logo tile, app name, tagline.
- "Quick demo login" dropdown — picks a demo user and autofills the form.
- Email + password fields; password has a show/hide toggle.
- Mock auth only — `signIn()` in `lib/api/auth.ts` validates against
  `lib/data/users.ts`. On success → `/`.
- Prototype: no real authentication.

## Conventions for every screen

1. Render content only — the shell provides chrome.
2. Provide three states: **loading**, **empty**, **error**.
3. One primary action, bottom-anchored, thumb-reachable.
4. Use tokens from [[design-system]] — no hard-coded colours.
5. When implemented, **update [[prompts/flutter]]** with the Flutter mirror
   of the screen (dual-output rule from [[design]]).

## Related

[[design]] · [[architecture]] · [[design-system]] · [[data-model]]
