---
title: Flutter mirror spec
type: prompt
agent: flutter
status: living-document
tags: [prompt, flutter, transition]
---

# Flutter mirror spec — TrackSmart Mobile

> [!abstract] What this file is
> A **living document**. It is the build plan for the Stage-2 **Flutter**
> app. Every time a screen is implemented in Next.js, its Flutter equivalent
> is described here in the same change (the **dual-output rule** —
> [[shared-context]] §3). When Stage 2 begins, this file is already a
> complete, screen-by-screen Flutter spec.

> [!important] How to use this file
> - **Implementing in Next.js?** After the screen works, add/update its
>   section under *Screen mirrors* below.
> - **Building the Flutter app?** Implement screens top to bottom from the
>   *Screen mirrors* sections; this file plus [[data-model]] and
>   [[design-system]] is all you need.

---

## 1. Recommended Flutter stack

| Concern | Choice | Mirrors (Next.js) |
|---------|--------|-------------------|
| Framework | Flutter 3.x / Dart 3.x | Next.js 15 |
| Routing | `go_router` | App Router |
| State / data | `flutter_riverpod` | Server Components + `lib/` |
| HTTP | `dio` or `http` | `fetch` in `lib/api/*` |
| Theming | `ThemeData` + `ColorScheme` | `tailwind.config.ts` |
| Icons | `Icons.*` (Material) | `components/ui/Icon.tsx` |

> The stack is a recommendation; if changed, change it here so all agents
> stay aligned.

## 2. Suggested Flutter folder layout

```
lib/
  main.dart            App entry, ProviderScope, MaterialApp.router
  app/
    router.dart        go_router config — mirrors app/ routes
    theme.dart         ThemeData built from the design tokens
  shell/
    app_shell.dart     Scaffold + BottomNavigationBar — mirrors AppShell
    top_bar.dart       AppBar — mirrors TopBar
  screens/
    home_screen.dart
    trips_screen.dart
    bulletin_screen.dart
    calendar_screen.dart
    chats_screen.dart
    account_screen.dart
  widgets/             Reusable widgets — mirrors components/ui/*
  models/              Dart classes — mirrors docs/data-model.md
  data/                Repositories — mirrors lib/api/*
```

## 3. Concept mapping (Next.js → Flutter)

| Next.js | Flutter |
|---------|---------|
| App Router route folder | `GoRoute` in `router.dart` |
| `app/layout.tsx` | `MaterialApp.router` + `app_shell.dart` |
| `AppShell` | `Scaffold` with `bottomNavigationBar` |
| `TopBar` | `AppBar` |
| `BottomNav` | `BottomNavigationBar` / `NavigationBar` |
| React Server Component (data fetch) | `ConsumerWidget` + `FutureProvider` / `Repository` |
| `"use client"` interactive component | `StatefulWidget` / `ConsumerStatefulWidget` |
| `components/ui/*` | widgets in `lib/widgets/` |
| `BottomSheet` (modal) | `showModalBottomSheet` (isScrollControlled) |
| Tailwind utility classes | `ThemeData` + explicit `EdgeInsets` / `TextStyle` |
| `next/link` `<Link>` | `context.go()` / `context.push()` |
| `usePathname()` | `GoRouterState.of(context).uri` |
| TS types (`lib/types.ts`) | Dart model classes (`lib/models/`) |
| `loading.tsx` / loading state | `AsyncValue.loading` → spinner |
| `not-found.tsx` | `errorBuilder` in `go_router` |

## 4. Design-token mapping

Tokens from `tailwind.config.ts` ([[design-system]]) become `theme.dart`:

```dart
// lib/app/theme.dart  — keep values identical to tailwind.config.ts
const brand       = Color(0xFF1D4ED8);
const brandDark   = Color(0xFF1E3A8A);
const brandLight  = Color(0xFFDBEAFE);
const success     = Color(0xFF15803D);
const warning     = Color(0xFFB45309);
const danger      = Color(0xFFB91C1C);
const surface     = Color(0xFFFFFFFF);
const surfaceMuted= Color(0xFFF4F5F7);
const ink         = Color(0xFF0F172A);
const inkMuted    = Color(0xFF64748B);

// Sizing
const shellMaxWidth = 440.0;   // max-w-shell — iPhone 16 Pro Max width
const topBarHeight  = 56.0;    // h-topbar
const bottomNavH    = 64.0;    // h-bottomnav
const cardRadius    = 14.0;    // rounded-card
```

Status → colour mapping is identical to the table in [[design-system]].

## 5. Shell mirror  ✅ (Next.js scaffold done)

**Next.js:** `components/shell/AppShell.tsx`, `TopBar.tsx`, `BottomNav.tsx`.
The shell is applied via the `app/(app)/` route group; `app/auth/*` routes
render outside it (no TopBar / BottomNav).

**Flutter:**

- `app_shell.dart` — a `Scaffold`:
  - `appBar`: a **translucent** bar (≈80%-opacity surface + blur) that
    overlays the scrolling body — same treatment as the bottom bubble. On
    a tab route it shows the section title + a notification `IconButton`
    (`Icons.notifications_outlined`) with a small red unread dot plus an
    account `IconButton` (`Icons.person_outline`) that opens the **My
    Account** end drawer (`Scaffold.endDrawer`, see the Account mirror);
    on a detail route (e.g. `/compliance`) a back button
    (`Icons.chevron_left` → `context.pop()`) + a centered title.
  - `body`: a `Center` → `ConstrainedBox(maxWidth: 440)` → the screen, so
    the phone-frame look matches on large screens.
  - **Bottom nav**: a translucent floating **bubble** that overlays the
    body — NOT the stock `NavigationBar`. Put it in a `Stack` above the
    scrolling content, `Positioned` at the bottom; the pill is a
    `Container` (`BorderRadius.circular(999)`, soft shadow) over a
    `BackdropFilter` blur, filled with a ~80%-opacity surface colour so
    content shows through as it scrolls under. Tabs from `NAV_ITEMS`.
- Nav items (keep in sync with `NAV_ITEMS`):
  | href | label | Flutter icon |
  |------|-------|--------------|
  | `/home` | Home | `Icons.home_outlined` |
  | `/trips` | Trips | `Icons.alt_route` |
  | `/bulletin` | Bulletin | `Icons.campaign_outlined` |
  | `/calendar` | Calendar | `Icons.calendar_today_outlined` |
  | `/chats` | Chats | `Icons.chat_bubble_outline` |

  (Account is reached from the top bar, not a bottom-nav tab.)
- Active tab: the icon sits in a circular `Container` tinted `brandLight`
  with a `brand` icon + label; inactive tabs use `inkMuted`.
- Respect safe areas with `SafeArea`.
- In `router.dart`, the four tabs live inside a
  `StatefulShellRoute.indexedStack` (or `ShellRoute`). Routes that must NOT
  show the shell — e.g. `/auth/sign-in` — are declared as top-level routes
  outside that shell route. The root path `/` is a top-level `GoRoute` with
  a `redirect` to `/auth/sign-in` (mirrors `app/page.tsx`).

## 6. Screen mirrors

> Each section is filled when the matching Next.js screen is implemented.
> Status mirrors [[screens]].

### Sign in — `/auth/sign-in` → `GoRoute('/auth/sign-in')`  · done
- **Next.js:** `app/auth/sign-in/page.tsx` (brand block + footer),
  `components/auth/SignInForm.tsx` (`"use client"` card),
  `app/auth/layout.tsx` (no-shell layout).
- **Backend mock:** `lib/data/users.ts` — demo users + `DEMO_PASSWORD`.
- **Service layer:** `lib/api/auth.ts` — `signIn(email, password)` and
  `listDemoUsers()`. The screen never touches `lib/data` directly.
- **Flutter widget:** `screens/sign_in_screen.dart`, a
  `ConsumerStatefulWidget` (holds form state). Declared OUTSIDE the
  `StatefulShellRoute` so it has no bottom nav.
- **Widget tree:** `Scaffold` → `SafeArea` → `Center` →
  `ConstrainedBox(maxWidth: 440)` → `SingleChildScrollView` → `Column`:
  - brand: dark `Container` (`borderRadius: 16`) with
    `Icon(Icons.local_shipping, color: white)` → `Text(APP_NAME)` →
    `Text(tagline)`.
  - `Card` (radius 16, border): header `Text`s, then body `Column`:
    - quick demo: `DropdownButtonFormField<DemoUser>`.
    - "OR": `Row` of two `Divider`s + `Text`.
    - email: `TextFormField` (`prefixIcon: Icons.mail_outline`).
    - password: `TextFormField` (`prefixIcon: Icons.lock_outline`,
      `suffixIcon` toggles `obscureText`).
    - demo-password hint `Text` with a monospace chip.
    - `FilledButton` (dark `ink`) with `Icons.login`.
  - footer `Text`.
- **Backend mirror (Dart):** `lib/data/demo_users.dart` (list +
  `kDemoPassword`) and `lib/data/auth_repository.dart`
  (`Future<SignInResult> signIn(...)`, `List<DemoUser> listDemoUsers()`).
  Keep the same frontend ⇄ service ⇄ data split.
- **State handling:** loading → button spinner + disabled fields;
  error → red helper text in the card; success → `context.go('/')`.
- **Behaviour to replicate:** picking a demo user autofills email +
  password; editing email/password manually clears the demo-user dropdown
  (the form must never show a demo user whose credentials no longer match);
  eye icon toggles password visibility; no real auth.
- **Tokens:** dark logo/button use `ink` (#0F172A); the "Quick demo login"
  label uses `brand`.

### Home — `/home` → `GoRoute('/home')`  · in progress
- **Next.js:** `app/(app)/home/page.tsx` — an async Server Component that
  awaits `getCompany()` + `getCompliance()` and renders two cards.
- **Note:** after sign-in, `SignInForm` routes here (`context.go('/home')`).
- **Backend mock:** `lib/data/company.ts`, `lib/data/compliance.ts`.
- **Service layer:** `lib/api/home.ts` — `getCompany()`, `getCompliance()`.
- **Flutter widget:** `home_screen.dart`, a `ConsumerWidget`. Data via a
  `homeProvider` (`FutureProvider`) over a `HomeRepository` mirroring
  `lib/api/home.ts`.
- **Models (Dart):** `Company`, `Compliance` in `lib/models/` — same field
  names as `lib/data/company.ts` / `compliance.ts`.
- **Components done — mirror as widgets in `lib/widgets/`:**
  - `CompanyCard` → `company_card.dart`: a `Card` (radius 14) → centered
    `Column`: `Text(company.name, bold)` + a rounded monogram tile
    (`Container`, `brandLight` bg, `Text(monogram)`). Placeholder for a
    real logo `Image`.
  - `ComplianceCard` → `compliance_card.dart`: a `Card` wrapped in an
    `InkWell` → `context.push('/compliance')`:
    - header `Row`: `Text("My Compliance")` + `Icon(Icons.chevron_right)`.
    - body `Row`: square initials avatar (`Container`, `surfaceMuted`) +
      a `Column` of labelled fields — Name; a `Row` of License No + Items;
      Expiry. Field = tiny uppercase `inkMuted` label over a bold value.
    - `Divider`, then a status line: `Icon(Icons.check)` + "All documents
      valid" in `success`, else a `warning` message.
- **Behaviour:** `expiryDate` is stored ISO (`YYYY-MM-DD`) and formatted
  for display as `NOV 17, 2026`.
- **Dashboard cards (done) — mirror as widgets:**
  - `ActionCard` → `action_card.dart`: title + two buttons — a primary
    `FilledButton.icon` (blue `brand`) and a secondary
    `OutlinedButton.icon`. Used for Expenses, Maintenance Requests and
    Trip Sheets. Placeholders until their form / list screens exist.
  - `LinkCard` → `link_card.dart`: title + `Icons.chevron_right` + a
    one-line summary. Used for Payroll and Schedule; lists come from
    `getPayrolls()` / `getShifts()` (`lib/api/home.ts`, mock
    `lib/data/home.ts`).
  - `TimeTrackingCard` → `time_tracking_card.dart`: a `StatefulWidget` —
    a compact, fixed-height card: title + status line on the left, a
    `Switch` on the right. While clocked in a small elapsed timer
    (HH:MM:SS, `success` green, `Timer.periodic`) appears inline beside
    the switch and the status line shows the clock-in time.
  - `HomeMenu` → `home_menu.dart`: Refresh + Help as two side-by-side
    buttons, then a full-width Logout button with a **red outline**.
    Refresh reloads the page; Logout shows a confirm dialog ("Do you
    want to log out?") then `context.go('/auth/sign-in')`.
- **Still scaffold (planned):** active-trip card, quick stats, bulletin
  highlights, role-aware shortcuts.

### My Compliance — `/compliance` → `GoRoute('/compliance')`  · done
- **Opened from:** the Home `ComplianceCard` (tap).
- **Next.js:** `app/(app)/compliance/page.tsx` — async Server Component
  that awaits `getCompliance()`. Not a tab → the TopBar shows the back
  button + "My Compliance".
- **Service:** `lib/api/compliance.ts` `getCompliance()` (full profile);
  backend mock `lib/data/compliance.ts`.
- **Flutter widget:** `compliance_screen.dart`, a `ConsumerWidget`. A
  top-level pushed `GoRoute` (keeps the shell, AppBar in detail mode).
- **Layout:** three labelled sections — "Basic", "Documents",
  "Certifications".
  - Basic → three `ComplianceItemCard` (`compliance_item_card.dart`):
    Driver's License, Passport, Emergency Contact. Each = a `Card` with a
    title, label→value rows, an "Update" button, and an optional status
    line (`Icons.check` + `success` text, e.g. "181 days until expiry").
  - Documents → header `Row` with a blue "Add" button, then the list or
    a "No documents" empty card.
  - Certifications → same pattern, "No certifications" empty card.
- **Bottom sheets** (mirror with `showModalBottomSheet` — see §5):
  - **Update &lt;item&gt;** — opened by a card's "Update" button. Header
    (`Update Driver's License` + close) → item name in `brand` → a form
    prefilled with current values → "Submit for Review". Fields differ
    per item; the Next.js side is config-driven (`SheetFieldConfig[]`).
  - **Add Document** — opened by Documents "Add". Centered title + two
    square tiles (Scan Document / Take Photo) + two rows (Upload from
    Files / Select from Gallery) + Cancel. Capture actions are
    placeholders — in Flutter use `image_picker` / `file_picker`.
  - **Add New Certification** — opened by Certifications "Add". Form:
    name, Category toggle (Drug Test / Road Test), Result toggle
    (Pass / Fail), Expiry Date, a "+ Upload Document" field, Note,
    "Submit for Review".
- **Form fields** mirror `components/ui/form.tsx`: text / select / date /
  textarea / two-option toggle / submit. Primary buttons are **blue**
  (`brand`), not green.
- **Models (Dart):** `Compliance` with `LicenseInfo`, `PassportInfo`,
  `EmergencyContact`, `ComplianceDocument`, `Certification` — same fields
  as `lib/data/compliance.ts`.
- **Behaviour:** empty values render as "N/A" ("Not set" for the contact
  name); expiry status is computed from the ISO date (`daysUntil`).
  "Submit for Review" is a mock — it just closes the sheet (no backend).

### Submit Expense — `/expenses/new` → `GoRoute('/expenses/new')`  · done
- **Opened from:** Home → Expenses → "Submit New".
- **Next.js:** `app/expenses/new/page.tsx` + `app/expenses/layout.tsx`
  (no app shell); the wizard is `components/expenses/SubmitExpenseWizard`.
- **Flutter widget:** `submit_expense_screen.dart` — a `StatefulWidget`
  holding one `ExpenseDraft` and a step index. A top-level full-screen
  `GoRoute` (no shell).
- **Layout:** custom header (back `Icons.chevron_left` + "Submit Expense"
  + "step/5"), a scrollable step body, and a **translucent floating
  footer** (same blur treatment as the bottom nav) with a step-dependent
  pill button.
- **Steps (5):**
  1. `StepExpenseType` — two cards (Payroll Addition / Company Paid);
     both run the same flow.
  2. `StepAddReceipt` — a blue "AI" hint banner + four capture rows
     (Scan / Photo / Gallery / Files) + a "Skip" footer button. Capture
     is a placeholder — use `image_picker` / `file_picker` natively.
  3. `StepExpenseDetails` — controlled form grouped into two `Card`s
     (details + vendor info): amount + USD/CAD segmented toggle,
     description + quick chips, notes, optional vendor info (name,
     invoice #, date, address, city, state, USA/Canada/Mexico toggle).
     Inputs are filled grey (`surface-muted`).
  4. `StepExpenseCategory` — pick a category (Truck / Trailer / General
     expense) + an optional "Select Truck" search field.
  5. `StepReview` — a read-only recap of everything entered, grouped into
     cards (Expense / Vendor Info) like the form; the footer button is
     "Submit for Review".
- **State:** the wizard owns one `ExpenseDraft` (mirror it from
  `lib/api/expenses.ts`); steps read it and patch via an `update` callback.
- **Submit:** mock `submitExpense()` then `context.go('/home')`. Both
  expense types use this flow. Buttons are blue (`brand`).

### Expense Status — `/expenses` → `GoRoute('/expenses')`  · done
- **Opened from:** Home → Expenses → "Status".
- **Next.js:** `app/expenses/page.tsx` → `ExpenseStatusList`. Full-screen,
  no app shell; own header (back + "Expense Status").
- **Service:** `getExpenses()` in `lib/api/expenses.ts`; mock records in
  `lib/data/expenses.ts`.
- **Flutter widget:** `expense_status_screen.dart`, a `ConsumerWidget`.
- **Layout:** header + a `ListView` of expense cards — each shows the
  description, a status badge (Pending = `warning`, Approved = `success`,
  Rejected = `danger`), amount + submitted date. Empty state when none.

### Submit Trip Sheet — `/trip-sheets/new` → `GoRoute('/trip-sheets/new')`  · done
- **Opened from:** Home → Trip Sheets → "Submit New".
- **Next.js:** `app/trip-sheets/new/page.tsx` → `SubmitTripSheetForm`.
  Full-screen, no app shell.
- **Flutter widget:** `submit_trip_sheet_screen.dart`, a `StatefulWidget`.
- **Layout:** header (back + "Submit Trip Sheet"), scrollable body — a
  decorative trip-sheet preview card, an "Upload Trip Sheet" 4-tile grid
  (Scan / Camera / Gallery / Files — capture is a placeholder), a Period
  (start/end date) row, an optional Note — and a translucent floating
  footer with "Submit Trip Sheet" (disabled until a sheet is attached).
- **Submit:** mock `submitTripSheet()` then `context.go('/trip-sheets')`.

### Trip Sheet Status — `/trip-sheets` → `GoRoute('/trip-sheets')`  · done
- **Opened from:** Home → Trip Sheets → "Status".
- **Next.js:** `app/trip-sheets/page.tsx` → `TripSheetStatusList`.
- **Service:** `getTripSheets()` (`lib/api/trip-sheets.ts`, mock
  `lib/data/trip-sheets.ts`).
- **Flutter widget:** `trip_sheet_status_screen.dart` — a `ListView` of
  cards: period range, a `StatusBadge`, submitted date. `StatusBadge`
  (`components/ui/StatusBadge.tsx`) is shared with the expense list.

### Trips — `/trips` → `GoRoute('/trips')`  · done
- **Next.js:** `app/(app)/trips/page.tsx` → `TripsView`.
- **Service:** `getTrips()` (`lib/api/trips.ts`, mock `lib/data/trips.ts`).
- **Flutter widget:** `trips_screen.dart` — three collapsible sections
  (Current / Upcoming / Previous), each an `ExpansionTile`-style block
  with a blue-accent title.
- **`TripItineraryCard`** — trip summary card; `current` is solid
  `brand`, `previous` is `brandLight`. The header carries a status pill
  ("In Progress" / "Completed").
- **Trip Progress strip** — under the current itinerary card: a `Card`
  with "Trip Progress", an `done of total stops` count and a
  `LinearProgressIndicator` (`success` fill).
- **`TripStopRow`** — a timeline row with three states driven by the
  first not-yet-completed stop:
  - **done** — green check node, white card, "Done" badge.
  - **next** — hollow brand node, `brandLight` card with a `brand` ring
    and a "Next" badge.
  - **upcoming** — hollow grey node, muted card.
  The rail connector is `success` for completed segments, `backdrop`
  otherwise. The card shows an icon chip + stacked label/location.
  Expands to: stop detail (power unit / probill, address, email,
  directions), an **Arrival** card ("I'm here" / "Complete Event") and a
  **POD Document** card (take-photo + submit). All actions are mocks.
- Loads are nested under a trip, not a top-level screen.

### Bulletin — `/bulletin` → `GoRoute('/bulletin')`  · done
- **Next.js:** `app/(app)/bulletin/page.tsx` → `BulletinList`.
- **Service:** `getLoadTenders()` (`lib/api/bulletin.ts`, mock
  `lib/data/bulletin.ts`).
- **Flutter widget:** `bulletin_screen.dart` — a search `TextField` + a
  `ListView` of `BulletinCard`s.
- **`BulletinCard`** (`bulletin_card.dart`, `StatefulWidget`): a
  light-blue card — sender row (avatar, name, time, unread dot), "Load
  Tender" + route summary, and **Accept / Decline** buttons.
  Accepting/declining collapses it to a status badge + an expand
  chevron; expanding shows the full load detail (from, to, date,
  pickup, delivery). Local state (mock).

### Calendar — `/calendar` → `GoRoute('/calendar')`  · done
- **Next.js:** `app/(app)/calendar/page.tsx` → `CalendarScreen`.
- **Service:** `getUpcomingEvents()` (`lib/api/bulletin.ts`);
  `getWorkingDates()`, `getShifts()`, `getClockRecords()`
  (`lib/api/schedule.ts`, mock `lib/data/schedule.ts`); `getCalendarEvents()`
  (`lib/api/calendar.ts`, mock `lib/data/calendar-events.ts`).
- **Models (Dart):** `Shift`, `ClockRecord` (`lib/models/schedule.dart`)
  and `CalendarEvent` with a `CalendarEventKind` enum (delivery / pickup /
  meeting / maintenance / reminder) — same fields as the data files.
- **Flutter widget:** `calendar_screen.dart` — a Calendar / List
  segmented toggle:
  - **Calendar** (`CalendarView`, a `StatefulWidget`): a header `Row` with
    prev/next `IconButton`s + the month label, then a month `GridView`
    (7 columns). Each day cell shows the date and up to three dots —
    working day (`success`), scheduled event(s) (`brand`), a clock record
    (`warning`). Today is ringed `brand`, the selected day ringed `ink`.
    A three-item legend sits under the grid.
  - Below the grid, the selected day shows three labelled blocks —
    **Events** (coloured-accent cards per `CalendarEventKind`), **Shifts**
    (label, time range, location) and **Timesheet** (clock in / clock out
    / hours; "On the clock" + "In progress" while the record is open) —
    each with an empty-state card.
  - A **Schedule** pill button opens a `showModalBottomSheet` form (title,
    date, time, type) → on submit a new `CalendarEvent` is appended to the
    widget's state (prototype: not persisted).
  - **List** (`CalendarEventsList`): load-tender event cards with a date
    chip.

### Chats — `/chats` → `GoRoute('/chats')`  · done
- **Next.js:** `app/(app)/chats/page.tsx` → `ChatsList`.
- **Service:** `getConversations()` / `getConversation(id)`
  (`lib/api/chats.ts`, mock `lib/data/chats.ts`); `getContacts()`
  (`lib/api/contacts.ts`, mock `lib/data/contacts.ts`).
- **Model (Dart):** `Contact` (`lib/models/contact.dart`) — id, name,
  role, initials.
- **Flutter widget:** `chats_screen.dart` — search + a `ListView` of
  conversation rows (avatar, name, last message, time, unread dot) + a
  "New chat" button.
- Tapping a row pushes the thread.
- **New chat** → `NewChatSheet` (`showModalBottomSheet`): a "New Chat"
  title, a search field and a contact `ListView` (monogram avatar, name,
  role). Picking a contact closes the sheet then `context.push` →
  `/chat/<id>`. `getConversation` falls back to the contact so the
  thread opens even with no prior messages.

### Chat thread — `/chat/[id]` → `GoRoute('/chat/:id')`  · done
- A separate full-screen route (no app shell). `app/chat/[id]/page.tsx`
  → `ChatThread`.
- **Flutter widget:** `chat_thread_screen.dart` — header (back + name),
  a `ListView` of message bubbles (incoming grey left, outgoing `brand`
  right, with times / sender labels and day dividers), and a message
  input bar (attach + send). Sending is a mock.
- When the conversation has no messages (a chat just started from the
  contact list) show a centered empty-state ("Start the conversation").

### Account — side drawer (no route)  · done
- **Next.js:** `components/account/AccountDrawer.tsx` (`"use client"`),
  opened by the TopBar account icon. Account is a **drawer**, not a route.
- **Service:** `getProfile()` (`lib/api/profile.ts`, mock
  `lib/data/profile.ts`).
- **Model (Dart):** `DriverProfile` (`lib/models/profile.dart`) — name,
  role, organization, email, phone, employeeId, vehicle, initials.
- **Flutter widget:** mirror as a `Scaffold.endDrawer` (`Drawer`) on the
  app shell — the TopBar account `IconButton` calls
  `Scaffold.of(context).openEndDrawer()`.
- **Widget tree:** `Drawer` → `Column`:
  - header `Row`: "My Account" + a close `IconButton`.
  - profile block: a circular `brand` avatar with the monogram, then
    name (bold), role, organisation.
  - menu `ListTile`s — Trip History (`Icons.alt_route`), Settings
    (`Icons.settings_outlined`), About (`Icons.info_outline`) — each
    closes the drawer then `context.push(...)`.
  - a bottom **Log Out** tile (`danger`) → an `AlertDialog` confirm →
    `context.go('/auth/sign-in')`.

### Settings — `/account/settings` → `GoRoute('/account/settings')`  · done
- **Opened from:** the account drawer. Detail route — AppBar back +
  "Settings".
- **Next.js:** `app/(app)/account/settings/page.tsx` →
  `components/account/SettingsScreen.tsx` (`"use client"`).
- **Flutter widget:** `settings_screen.dart`, a `StatefulWidget`.
- **Layout:** two labelled control groups in `Card`s —
  - **Notifications** — four rows (Trip off, Message, Bulletin, Calendar
    on), each a label + a `Switch` (`brand` when on).
  - **Appearance** — Font Size (Default / Small / Large) and Theme (Use
    system setting / Light / Dark) rows; tapping a row cycles its value,
    shown trailing with a `chevron_right`.
- **State:** all local to the prototype (a real backend would persist it).

### Trip History — `/account/trip-history` → `GoRoute('/account/trip-history')`  · done
- **Opened from:** the account drawer. Detail route.
- **Next.js:** `app/(app)/account/trip-history/page.tsx` — async Server
  Component awaiting `getTrips()`.
- **Flutter widget:** `trip_history_screen.dart`, a `ConsumerWidget`.
- **Layout:** a completed-trip count line + a `ListView` of
  `TripItineraryCard`s (`previous` variant — `brandLight`); empty state
  when there are none.

### About — `/account/about` → `GoRoute('/account/about')`  · done
- **Opened from:** the account drawer. Detail route.
- **Next.js:** `app/(app)/account/about/page.tsx` — static.
- **Flutter widget:** `about_screen.dart`, a `StatelessWidget`.
- **Layout:** an app-identity block (rounded `brand` logo tile with
  `Icons.local_shipping`, name, tagline, version), a description `Card`,
  an info-rows `Card` (version, provider, support) and a legal-links
  `Card` (Terms / Privacy / Licenses as `ListTile`s).

### Notifications — `/notifications` → `GoRoute('/notifications')`  · done
- **Opened from:** the top-bar notification bell.
- **Next.js:** `app/notifications/page.tsx` → `NotificationsList`.
  Full-screen, no app shell.
- **Service:** `getNotifications()` (`lib/api/notifications.ts`, mock
  `lib/data/notifications.ts`).
- **Flutter widget:** `notifications_screen.dart` — header (back +
  "Notifications") + a search field + a "Today" `ListView` of rows: an
  icon chip, title + time, message, and an unread dot.

### 404 — `not-found.tsx`  · done (scaffold)
- **Flutter:** `go_router` `errorBuilder` → a simple "screen not found"
  page with a "Back to Home" button.

---

## 7. Template — copy this for each new screen

```md
### <Screen name> — `<next-route>` → `GoRoute('<path>')`  · <status>
- **Next.js:** <files implemented>
- **Flutter widget:** <widget file + StatefulWidget/ConsumerWidget>
- **Widget tree:** <sketch of the main widgets>
- **Data:** <provider / repository it consumes>
- **State handling:** loading → <…>, empty → <…>, error → <…>
- **Tokens/styling:** <notable token usage>
- **Behaviour to replicate:** <interactions, navigation, actions>
```

## Related

[[shared-context]] · [[codex]] · [[claude]] · [[gemini]] · [[design]] ·
[[screens]] · [[design-system]] · [[data-model]]
