---
title: Architecture
type: doc
tags: [architecture, nextjs, engineering]
updated: 2026-05-22
---

# 🏗️ Architecture — TrackSmart Mobile

> [!abstract] Purpose
> How the Next.js mobile view is wired. Read [[01-design]] for product context first.

---

## Tech Stack

| Concern | Choice | Notes |
|---------|--------|-------|
| Framework | **Next.js 15** (App Router) | Mobile-only |
| Language | **TypeScript** (strict) | No `any` |
| Styling | **Tailwind CSS 3** | CSS-variable tokens supporting light & dark modes |
| Rendering | React Server Components | `"use client"` only when needed |
| Maps | **Leaflet + OpenStreetMap** | `react-leaflet`, no API key, `next/dynamic` |
| Data | `lib/api` over `lib/data` mock | Typed async service layer |

---

## Folder Layout

```
c:\Users\kenan\Mobile app\
│
├── app/
│   ├── layout.tsx                Root layout
│   ├── globals.css               Tailwind base + .app-shell
│   ├── page.tsx                  / → redirects to /auth/sign-in
│   ├── not-found.tsx
│   │
│   ├── (app)/                    ← Shell group (TopBar + BottomNav)
│   │   ├── layout.tsx            → <AppShell>
│   │   ├── home/page.tsx
│   │   ├── trips/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── bulletin/page.tsx
│   │   ├── calendar/page.tsx
│   │   ├── chats/page.tsx
│   │   ├── compliance/page.tsx
│   │   └── account/
│   │       ├── settings/page.tsx
│   │       ├── trip-history/page.tsx
│   │       └── about/page.tsx
│   │
│   ├── auth/sign-in/page.tsx     ← Pre-login (NO shell)
│   ├── expenses/                 ← Full-screen flow (NO shell)
│   │   ├── page.tsx
│   │   └── new/page.tsx
│   ├── trip-sheets/              ← Full-screen flow (NO shell)
│   │   ├── page.tsx
│   │   └── new/page.tsx
│   ├── notifications/page.tsx    ← Full-screen (NO shell)
│   └── chat/[id]/page.tsx        ← Full-screen (NO shell)
│
├── components/
│   ├── shell/          AppShell · TopBar · BottomNav · ThemeToggle
│   ├── account/        AccountDrawer · SettingsScreen
│   ├── auth/           SignInForm
│   ├── bulletin/       BulletinList · BulletinCard
│   ├── calendar/       CalendarScreen · CalendarView · CalendarEventsList
│   ├── chats/          ChatsList · ChatThread · NewChatSheet
│   ├── compliance/     ComplianceScreen · AddDocumentSheet · AddCertificationSheet
│   ├── expenses/       SubmitExpenseWizard · ExpenseStatusList
│   ├── home/           HomeCards (company, compliance, time-tracking…)
│   ├── notifications/  NotificationsList
│   ├── trip-sheets/    TripSheetStatus · SubmitTripSheetForm
│   ├── trips/          TripsView · TripCard · TripDetailView · TripStopRow
│   │                   TripMap · TripMapLeaflet · StopActions
│   └── ui/             Icon · BottomSheet · StatusBadge · PillTabs
│                       ScreenPlaceholder · form/
│
├── lib/
│   ├── constants.ts    APP_NAME, NAV_ITEMS, DETAIL_TITLES
│   ├── format.ts       formatDate(), formatNow()
│   ├── data/           Mock backend (typed seed data)
│   └── api/            Service layer (screens call only this)
│
├── docs/               Obsidian vault (this folder)
├── prompts/            Per-agent prompts (mirrored from docs/agents/)
└── scripts/
    └── mobile-preview.mjs   Playwright screenshot automation
```

---

## Mobile Shell

```
┌──────────────────────────────┐  max-w-shell (440px), centered
│ TopBar  (bg-surface/80 blur) │  position:absolute
├──────────────────────────────┤
│ <main>   h-dvh overflow-auto │  padded: pt-safe-top + pb-nav-bottom
│   screen content             │  never body-scroll
├──────────────────────────────┤
│ BottomNav (floating pill)    │  position:absolute, bg-surface/80 blur
└──────────────────────────────┘
```

Routes **outside** `(app)/` have no shell:  
`/auth/*` · `/expenses/*` · `/trip-sheets/*` · `/notifications` · `/chat/*`

---

## Rendering Rules

```
Server Component (default, page.tsx)
  → lib/api/<resource>.ts     (typed, async)
    → lib/data/<resource>.ts  (mock fixture)
  ← typed model → props → Client Component
```

**Add `"use client"` only for:**
- `usePathname`, `useRouter`, `useSearchParams`
- `useState`, `useEffect`, `useRef`
- Event handlers (onClick, onChange, onSubmit)
- Canvas / pointer events (`StopActions` → `SignaturePad`)
- `next/dynamic` (Leaflet map, `ssr: false`)

---

## Data Layer

> [!important] The Two-Layer Rule
> Screens import from `lib/api/*` only. Never `lib/data/*` in screens or components.

```
screens/page.tsx
  ↓
lib/api/<resource>.ts    ← typed async service layer
  ↓
lib/data/<resource>.ts   ← mock seed data (→ real API later)
```

### Mock Data Modules

| Module | Exports |
|--------|---------|
| `lib/data/trips.ts` | `Trip`, `TripStop`, fixtures |
| `lib/data/bulletin.ts` | `LoadTender` fixtures |
| `lib/data/chats.ts` | `Conversation`, `Message` |
| `lib/data/contacts.ts` | `Contact` |
| `lib/data/schedule.ts` | `Shift`, `ClockRecord` |
| `lib/data/calendar-events.ts` | `CalendarEvent` |
| `lib/data/profile.ts` | `DriverProfile` |
| `lib/data/compliance.ts` | `ComplianceData` |
| `lib/data/expenses.ts` | `ExpenseRecord`, `ExpenseType` |
| `lib/data/trip-sheets.ts` | `TripSheet` |
| `lib/data/notifications.ts` | `Notification` |
| `lib/data/users.ts` | Demo login users |
| `lib/data/company.ts` | Carrier info |
| `lib/data/home.ts` | Home aggregate |

---

## Key Components Deep-Dive

### `PillTabs` (`components/ui/PillTabs.tsx`)
Shared rounded-bubble tab bar. Used by `TripsView` and `ExpenseStatusList`.
- Track: `bg-surface-muted rounded-full shadow-inner p-1`
- Active: `bg-brand text-white shadow-nav rounded-full`
- Inactive: `text-ink-muted`
- Props: `tabs: PillTab[]`, `active: string`, `onChange: (key) => void`

### `TripsView` (`components/trips/TripsView.tsx`)
Client component — holds `tab` state (`current | upcoming | previous`).  
Renders `<PillTabs>` + conditionally renders `<TripCard>` lists per tab.

### `ExpenseStatusList` (`components/expenses/ExpenseStatusList.tsx`)
Client component — holds `tab` (`payroll | company`) + `query` state.  
Renders `<PillTabs>` + search input + filtered `ExpenseRecord` list.

### `StopActions` (`components/trips/StopActions.tsx`)
Client component — full stop workflow state machine.
- `dialog` state: `null | "trailer" | "temp" | "odometer" | "signature" | "document"`
- `history` state: completed action entries with timestamp
- `pending` state: label being confirmed through dialog chain
- Dialog chain per stop kind (see [[02-screens]] §Trip Detail)

### `SignaturePad` (inside `StopActions.tsx`)
Canvas draw-to-sign. Uses `useRef` for canvas + `onPointerDown/Move/Up/Leave`. `clearRef` exposed to parent dialog so the Clear button works without lifting state.

### `TripMapLeaflet` (`components/trips/TripMapLeaflet.tsx`)
Loaded via `next/dynamic({ ssr: false })`. `react-leaflet` + OpenStreetMap tiles. Brand polyline + numbered red pins. Non-interactive thumbnail in `TripCard`; full interactive map in `TripDetailView`.

### `ThemeToggle` (`components/shell/ThemeToggle.tsx`)
Client component — icon button placed in the TopBar. Reads current theme from HTML class or localStorage and updates it. Animates icon state smoothly.

---

## Light & Dark Theme System

The app implements a full, responsive light/dark theme system using Tailwind CSS v3 and CSS variables:

### 1. The No-Flash Injection Script
To prevent the client from flickering or rendering in light mode before custom settings are parsed, a small, inline blocking script is injected directly into `app/layout.tsx` inside the `<head>` tag:
```javascript
(function() {
  const t = localStorage.getItem('theme');
  const d = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (t === 'dark' || (!t && d)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();
```

### 2. State & Styling Integration
- **State Store**: Theme preferences are persisted in local storage (`theme = 'light' | 'dark'`).
- **Tailwind Tokens**: CSS variable bindings (e.g. `--bg-surface`, `--text-ink`) adapt instantly to the presence of the `.dark` class.
- **Leaflet Dark Map Filter**:
  ```css
  .dark .leaflet-tile {
    filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
  }
  ```
  This CSS filter adapts the standard OpenStreetMap tile layers dynamically, saving bandwidth and keeping the dark aesthetics premium.

---

## Map Integration Chain

```
TripCard / TripDetailView
  → TripMap (client, "use client")
    → next/dynamic(() => TripMapLeaflet, { ssr: false })
      → FlutterMap (react-leaflet)
        → TileLayer (OpenStreetMap, no API key)
        → PolylineLayer (brand blue)
        → MarkerLayer (numbered pins)
```

---

## 🔗 Related

[[00-home]] · [[01-design]] · [[02-screens]] · [[03-design-system]] · [[05-data-model]] · [[06-roadmap]]
