---
title: Architecture
type: doc
tags: [architecture, nextjs]
---

# Architecture

> Companion to [[design]]. Describes how the Next.js mobile view is wired.

## Stack

| Concern | Choice | Notes |
|---------|--------|-------|
| Framework | Next.js 15 (App Router) | Mobile-only; no desktop layout |
| Language | TypeScript (strict) | No `any` |
| Styling | Tailwind CSS 3 | Tokens in `tailwind.config.ts` |
| Rendering | React Server Components | `"use client"` only when needed |
| Data | `lib/api` service layer over a `lib/data` mock backend | Real API wired later |
| Maps | Leaflet + OpenStreetMap (`react-leaflet`) | No API key; loaded client-only |

## Folder layout

```
app/                   Routes (App Router)
  layout.tsx           Root layout — document shell, viewport
  globals.css          Tailwind + base styles + .app-shell
  page.tsx             /            → redirects to /auth/sign-in
  not-found.tsx        404
  (app)/               Route group WITH the phone shell (TopBar + BottomNav)
    layout.tsx         Wraps screens in AppShell
    home/page.tsx      /home        (landing after sign-in)
    trips/page.tsx     /trips
    trips/[id]/page.tsx           /trips/[id]        (trip detail route)
    bulletin/page.tsx  /bulletin
    calendar/page.tsx  /calendar    (the "Schedule" tab)
    chats/page.tsx     /chats
    compliance/page.tsx           /compliance        (detail route)
    account/settings/page.tsx     /account/settings  (detail route)
    account/trip-history/page.tsx /account/trip-history
    account/about/page.tsx        /account/about
  auth/                Pre-login routes — NO shell
    layout.tsx
    sign-in/page.tsx   /auth/sign-in
  expenses/            Full-screen flow — NO shell
    layout.tsx
    page.tsx           /expenses        (status list)
    new/page.tsx       /expenses/new    (submit wizard)
  trip-sheets/         Full-screen flow — NO shell
    layout.tsx
    page.tsx           /trip-sheets
    new/page.tsx       /trip-sheets/new
  notifications/       Full-screen — NO shell
    layout.tsx
    page.tsx           /notifications
  chat/                Full-screen chat thread — NO shell
    layout.tsx
    [id]/page.tsx      /chat/[id]
components/
  shell/      AppShell, TopBar, BottomNav — the phone frame
  account/    AccountDrawer, SettingsScreen
  auth/       SignInForm
  bulletin/   BulletinList, BulletinCard
  calendar/   CalendarScreen, CalendarView, CalendarEventsList
  chats/      ChatsList, ChatThread, NewChatSheet
  compliance/ compliance screen + sheet forms
  expenses/   SubmitExpenseWizard + status list
  home/       Home cards (company, compliance, action, time tracking…)
  notifications/ NotificationsList
  trip-sheets/   submit form + status list
  trips/      TripsView, TripCard, TripDetailView, TripStopRow,
              TripMap, TripMapLeaflet
  ui/         Icon, BottomSheet, StatusBadge, ScreenPlaceholder, form
lib/
  constants.ts  App-wide constants (APP_NAME, NAV_ITEMS, DETAIL_TITLES…)
  format.ts     Date formatting helpers
  data/         Mock backend — the "backend" side of the mockup
  api/          Service layer screens call (wraps lib/data or real API)
docs/           Documentation (this folder)
prompts/        Per-agent implementation prompts
```

## The mobile shell

Screens in the `(app)/` route group render inside `AppShell`
(`components/shell/AppShell.tsx`):

```
┌─────────────────────────┐  ← max-w-shell (440px), centered
│ TopBar   (translucent)  │  ← absolute overlay, blurred
│·························│
│ <main> scrollable       │  ← content scrolls under the bars
│   screen content        │
│·························│
│ BottomNav (translucent) │  ← absolute floating pill, blurred
└─────────────────────────┘
```

- `.app-shell` is `h-dvh` with a `min-h-0 flex-1 overflow-y-auto`
  `<main>`, so the page never body-scrolls — only `<main>` scrolls.
- The TopBar and BottomNav are `absolute` translucent overlays
  (`bg-surface/80` + `backdrop-blur-md`); `<main>` has top/bottom padding
  so content clears them.
- Screens **only** provide the `<main>` content — never their own
  TopBar/BottomNav. Titles are derived from the route (`DETAIL_TITLES`).
- The TopBar has two modes: a **tab route** shows the section title + a
  notification bell + the account icon (which opens the account drawer);
  a **detail route** shows a back button + centred title.

Routes that must NOT show the shell (`/auth/*`, `/expenses/*`,
`/trip-sheets/*`, `/notifications`, `/chat/*`) live **outside** the
`(app)` group and provide their own full-screen layout. The chat thread
uses the singular `chat/[id]` segment to avoid colliding with the `(app)`
group.

Modal dialogs use the shared `BottomSheet` (`components/ui/BottomSheet.tsx`)
— a sheet that slides up from the bottom, width-matched to the phone
frame.

## Rendering rules

- **Server Component by default.** Data fetching happens server-side in
  `page.tsx` files.
- Add `"use client"` only for: navigation hooks (`usePathname`,
  `useRouter`), forms, stateful widgets (toggles, expanders, sheets) and
  the Leaflet map (loaded via `next/dynamic`, `ssr: false`).
- Keep client components small and leaf-level.

## Data layer

Screens must **not** call `fetch` directly. Data flows through two `lib/`
folders that keep the mockup's frontend and backend separate:

- **`lib/data/`** — the mock *backend*: plain `.ts` files holding typed
  seed data (`trips.ts`, `bulletin.ts`, `chats.ts`, `contacts.ts`,
  `schedule.ts`, `calendar-events.ts`, `profile.ts`, `compliance.ts`,
  `expenses.ts`, `trip-sheets.ts`, `notifications.ts`, `users.ts`,
  `company.ts`, `home.ts`). Replaced by the real API later.
- **`lib/api/`** — the *service layer* screens call (one module per
  resource, mirroring `lib/data`). Functions are `async` and return typed
  models, so screen code does not change when the real backend is wired.

Rules:

1. One module per resource on each side (`lib/data/trips.ts` ⇄
   `lib/api/trips.ts`).
2. Each `lib/api` module returns typed data from [[data-model]].
3. A screen imports only from `lib/api` (and `lib/constants` /
   `lib/format`) — never from `lib/data`.

This indirection is deliberate: the Flutter app ([[prompts/flutter]]) has
an identical `Repository` layer, so screen logic stays portable.

## Data flow

```
Screen (Server Component, page.tsx)
  → lib/api/<resource>.ts        (typed, async)
    → lib/data/<resource>.ts     (mock fixture)   OR   real API later
  ← typed model (docs/data-model.md)
  → passed as props to a client component for interactivity
```

## Environment

See `.env.example`. Copy it to `.env.local`. The mock data layer needs no
configuration; environment variables matter only once the real API is
connected.

## Related

[[design]] · [[screens]] · [[design-system]] · [[data-model]] · [[roadmap]]
