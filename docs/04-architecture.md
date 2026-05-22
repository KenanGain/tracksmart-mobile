---
title: Architecture
type: doc
tags: [architecture, nextjs, engineering]
updated: 2026-05-22
---

# 🏗️ Architecture — TrackSmart Mobile

> [!abstract] Purpose
> How the Next.js mobile view is wired. Read [[01-design]] first for the product context, then this note for the engineering decisions.

---

## Tech Stack

| Concern | Choice | Notes |
|---------|--------|-------|
| Framework | **Next.js 15** (App Router) | Mobile-only; no desktop layout |
| Language | **TypeScript** (strict) | `noImplicitAny`, no `any` |
| Styling | **Tailwind CSS 3** | Tokens in `tailwind.config.ts` |
| Rendering | React Server Components | `"use client"` only when needed |
| Maps | **Leaflet + OpenStreetMap** | No API key; loaded client-only via `next/dynamic` |
| Data (now) | `lib/api` over `lib/data` mock | Typed, async; real API drop-in later |
| Data (later) | Real TrackSmart backend API | Same service layer interface |

---

## Folder Layout

```
c:\Users\kenan\Mobile app\
│
├── app/                          ← Next.js App Router routes
│   ├── layout.tsx                Root layout — document, viewport
│   ├── globals.css               Tailwind base + .app-shell
│   ├── page.tsx                  /  → redirects to /auth/sign-in
│   ├── not-found.tsx             404
│   │
│   ├── (app)/                    ← Route group WITH phone shell
│   │   ├── layout.tsx            Wraps screens in <AppShell>
│   │   ├── home/page.tsx         /home
│   │   ├── trips/page.tsx        /trips
│   │   ├── trips/[id]/page.tsx   /trips/[id]
│   │   ├── bulletin/page.tsx     /bulletin
│   │   ├── calendar/page.tsx     /calendar
│   │   ├── chats/page.tsx        /chats
│   │   ├── compliance/page.tsx   /compliance
│   │   └── account/
│   │       ├── settings/
│   │       ├── trip-history/
│   │       └── about/
│   │
│   ├── auth/                     ← Pre-login (NO shell)
│   │   └── sign-in/page.tsx
│   │
│   ├── expenses/                 ← Full-screen flow (NO shell)
│   │   ├── page.tsx              /expenses (status list)
│   │   └── new/page.tsx          /expenses/new (wizard)
│   │
│   ├── trip-sheets/              ← Full-screen flow (NO shell)
│   ├── notifications/            ← Full-screen (NO shell)
│   └── chat/[id]/                ← Full-screen chat thread (NO shell)
│
├── components/
│   ├── shell/    AppShell · TopBar · BottomNav
│   ├── account/  AccountDrawer · SettingsScreen
│   ├── auth/     SignInForm
│   ├── bulletin/ BulletinList · BulletinCard
│   ├── calendar/ CalendarScreen · CalendarView · CalendarEventsList
│   ├── chats/    ChatsList · ChatThread · NewChatSheet
│   ├── compliance/
│   ├── expenses/ SubmitExpenseWizard + status list
│   ├── home/     HomeCards (company, compliance, action, time-tracking…)
│   ├── notifications/
│   ├── trip-sheets/
│   ├── trips/    TripsView · TripCard · TripDetailView · TripStopRow
│   │             TripMap · TripMapLeaflet
│   └── ui/       Icon · BottomSheet · StatusBadge · ScreenPlaceholder · form/
│
├── lib/
│   ├── constants.ts    APP_NAME, NAV_ITEMS, DETAIL_TITLES
│   ├── format.ts       Date formatting helpers
│   ├── data/           Mock backend (seed data TS files)
│   └── api/            Service layer (screens call this only)
│
├── docs/               This Obsidian vault
└── prompts/            Agent prompts
```

---

## The Mobile Shell

Screens in the `(app)/` route group render inside `AppShell`:

```
┌─────────────────────────┐  ← max-w-shell (440px), centered on page
│ TopBar   (translucent)  │  ← position:absolute, bg-surface/80, blur
│·························│
│ <main>   scrollable     │  ← h-dvh, overflow-y-auto, padded top+bottom
│   screen content here   │
│·························│
│ BottomNav (translucent) │  ← position:absolute, floating pill, blur
└─────────────────────────┘
```

**Key facts:**
- `.app-shell` is `h-dvh` — the page never body-scrolls, only `<main>` scrolls
- TopBar and BottomNav are `absolute` overlays — content scrolls *under* them
- `<main>` has `pt-safe-top` + `pb-nav-bottom` padding so content clears them
- Screens **only** provide `<main>` content — never their own TopBar/BottomNav

**Routes WITHOUT the shell:**  
`/auth/*` · `/expenses/*` · `/trip-sheets/*` · `/notifications` · `/chat/*`  
These live outside `(app)/` and provide their own full-screen layout.

---

## Rendering Rules

```
Server Component (default)
  → lib/api/<resource>.ts      (typed, async)
    → lib/data/<resource>.ts   (mock fixture) OR real API
  ← typed model (docs/05-data-model.md)
  → props passed to client component for interactivity
```

Add `"use client"` **only** for:
- Navigation hooks (`usePathname`, `useRouter`)
- Forms and controlled inputs
- Stateful widgets (toggles, expanders, bottom sheets)
- The Leaflet map (`next/dynamic`, `ssr: false`)

---

## Data Layer Architecture

> [!important] The Two-Layer Rule
> Screens import from `lib/api/*` only. Never from `lib/data/*`.

```
screens/page.tsx
  ↓ calls
lib/api/trips.ts         ← service layer (typed, async functions)
  ↓ reads from
lib/data/trips.ts        ← mock backend (static seed data)
  ↓ (later replaced by)
Real TrackSmart API      ← same lib/api interface, no screen changes
```

**Why this indirection?**  
The Flutter app has an identical `Repository` layer. Screen logic stays portable because neither the Next.js pages nor the Flutter widgets depend on the data source.

### Mock data modules

| Module | Purpose |
|--------|---------|
| `lib/data/trips.ts` | Trip, stop, load fixtures |
| `lib/data/bulletin.ts` | Load tender feed |
| `lib/data/chats.ts` | Conversations + messages |
| `lib/data/contacts.ts` | Driver/carrier contacts |
| `lib/data/schedule.ts` | Shifts + clock records |
| `lib/data/calendar-events.ts` | Calendar events |
| `lib/data/profile.ts` | Driver profile |
| `lib/data/compliance.ts` | Compliance documents |
| `lib/data/expenses.ts` | Submitted expenses |
| `lib/data/trip-sheets.ts` | Trip sheets |
| `lib/data/notifications.ts` | Notification feed |
| `lib/data/users.ts` | Demo login users |
| `lib/data/company.ts` | Carrier/company info |

---

## Map Integration

```
TripCard / TripDetailView
  → TripMap (client component, "use client")
    → next/dynamic(() => TripMapLeaflet, { ssr: false })
      → react-leaflet
        → Leaflet + OpenStreetMap tiles (no API key)
```

- Preview map embedded in trip cards (non-interactive thumbnail)
- Tapping preview opens full-screen interactive map
- Brand-coloured polyline through stop coordinates
- Numbered red pins at each stop

---

## Environment Variables

See `.env.example` — copy to `.env.local`.

The mock data layer needs no configuration. Variables matter only when connecting the real API.

---

## 🔗 Related

[[00-home]] · [[01-design]] · [[02-screens]] · [[05-data-model]] · [[06-roadmap]]
