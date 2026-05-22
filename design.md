---
title: TrackSmart — Mobile View
type: design-doc
status: in-development
platform: Next.js (mobile-only) → Flutter (planned)
audience: [business, driver, carrier]
created: 2026-05-21
tags: [trip-planner, tracksmart, mobile, nextjs, flutter, design]
---

# TrackSmart — Mobile View · Design

> [!abstract] What this is
> The design source-of-truth for the **mobile-only** frontend of the
> TrackSmart fleet-operations platform. The first build target is
> **Next.js**; the same screens are later mirrored in **Flutter**. This
> file is written for Obsidian — wikilinks resolve to notes in
> [[docs/architecture]], [[docs/screens]], [[docs/design-system]] and
> [[docs/data-model]].

> [!info] Status — in development
> The mobile shell and the core driver screens are built and working
> against a mock backend (`lib/data` + `lib/api`). Remaining work and the
> real-API cut-over are tracked in [[docs/roadmap]]. Every implemented
> screen has a Flutter mirror in [[prompts/flutter]].

---

## 1. Product summary

TrackSmart is a logistics / fleet-operations platform. The web app is the
operations console; this **mobile view** is the companion app, designed
phone-first for people in the field. It serves three audiences:

| Role | Primary jobs on mobile |
|------|------------------------|
| **Business** | Create trips, assign loads, watch progress, see ETAs |
| **Driver** | See assigned trips, follow the route, update trip status, upload trip documents, log expenses & trip sheets, clock in/out |
| **Carrier** | Manage fleet/vehicles, accept load tenders, monitor assigned drivers |

The current build is **driver-focused** (the first audience implemented).
It is a **companion frontend** to the existing web application and is
designed to talk to the same backend API (see [[docs/architecture]]). It
is **not** a desktop layout shrunk down — it is phone-first.

`APP_NAME` (`lib/constants.ts`) is **"TrackSmart"**; the demo data uses
the carrier "Transplus Systems Corp.".

## 2. Design principles

1. **Phone-first, single column.** All UI lives inside a `max-w-shell`
   (440px, iPhone 16 Pro Max) frame — see `.app-shell` in
   `app/globals.css`.
2. **One primary action per screen.** Thumb-reachable, bottom-anchored.
3. **Persistent bottom navigation.** Five tabs, never more — see
   `NAV_ITEMS` in `lib/constants.ts`.
4. **Translucent floating chrome.** The TopBar and the BottomNav are
   blurred, semi-transparent overlays; content scrolls underneath them.
5. **Status is always visible.** Trips and loads are state machines; the
   current state is the most important thing on screen.
6. **Blue is the brand.** Primary actions, active nav and accents are
   `brand` blue — never green.
7. **Platform-portable.** Every choice is expressed so it maps cleanly to
   Flutter — see [[prompts/flutter]].

## 3. Information architecture

```
/                Redirects to /auth/sign-in   (entry point)
/auth/sign-in    Sign in                      (no shell)

App Shell (TopBar + content + BottomNav)
├── /home        Home        — today's overview & action cards
├── /trips       Trips       — current / upcoming / previous summary cards
├── /bulletin    Bulletin    — load tenders (accept / decline)
├── /calendar    Schedule    — month grid (events / shifts / timesheet) + agenda
└── /chats       Chats       — messaging: drivers, carriers, dispatch

Detail routes inside the shell (back-button TopBar):
  /trips/[id]              — trip detail: map, progress, stop timeline
  /compliance              — licence, passport, documents, certifications
  /account/settings        — notifications + appearance
  /account/trip-history    — completed trips
  /account/about           — app info

Full-screen routes outside the shell (own header, no nav):
  /notifications           — notification feed (top-bar bell)
  /expenses · /expenses/new
  /trip-sheets · /trip-sheets/new
  /chat/[id]               — a chat thread
```

> **Account** is a **side drawer** opened from the top-bar account icon —
> not a route. Its menu links to the `/account/*` sub-screens.
>
> **Loads** are not a tab — a load belongs to a trip and is reached from
> trip detail.

Full route catalogue, with statuses, lives in [[docs/screens]].

## 4. Navigation model

- **Bottom tabs** = the five top-level destinations.
- **TopBar** has two modes, both derived from the route: a **tab route**
  shows the section title + a notification bell + the account icon; a
  **detail route** shows a back button + centred title. Screens never set
  the title themselves.
- **Account drawer** slides in from the right of the phone frame.
- **Full-screen flows** (expenses, trip sheets, notifications, a chat
  thread) render outside the `(app)` route group — they have their own
  header and no bottom nav.
- **Bottom sheets** (`components/ui/BottomSheet.tsx`) are used for modal
  forms and pickers.

## 5. Visual language

Tokens are defined once in `tailwind.config.ts` and documented in
[[docs/design-system]]. Summary:

- **Brand** `#1d4ed8` — primary actions, active nav, accents.
- **Surfaces** white cards on a muted grey background.
- **Semantic** success / warning / danger for trip & load states.
- **Translucent bars** — `bg-surface/80` + `backdrop-blur-md`.
- **Safe areas** respected top and bottom (`pt-safe-top`, `pb-nav-bottom`).

## 6. Implemented screens (high level)

See [[docs/screens]] for the per-screen specs. Built so far:

- **Sign in** — demo-user quick login + manual mock auth.
- **Home** — company & compliance cards, action cards (Expenses /
  Maintenance / Trip Sheets), Payroll, a Time-Tracking clock in/out card,
  and Refresh / Help / Logout.
- **Trips** — current / upcoming / previous summary cards, each with an
  interactive route map; tapping a card opens the **trip detail**
  (`/trips/[id]`) — map, progress strip, dispatch note, details and the
  stop timeline (Acquire / Hook / Loading / Docking / Unloading / Pick Up
  / Deliver / Drop Off / Check Call). Freight stops capture an odometer
  reading and a document. The map is Leaflet + OpenStreetMap and opens
  full-screen on tap.
- **Bulletin** — a load-tender feed with accept / decline.
- **Schedule** — a month grid (prev/next nav, working / event / clocked
  dots) with per-day events / shifts / timesheet, plus a date-grouped
  agenda list merging shifts, events and load tenders.
- **Chats** — conversation list + a New-Chat contact picker; full-screen
  chat threads.
- **Compliance** — basic documents, uploads and certifications.
- **Account drawer** — profile + Settings, Trip History, About.
- **Expenses** & **Trip Sheets** — submit flows + status lists.
- **Notifications** — the top-bar bell feed.

## 7. Architecture overview

- **Next.js App Router**, TypeScript (strict), Tailwind CSS.
- Server Components by default; `"use client"` only for interactivity
  (navigation, forms, stateful widgets, the map).
- Data layer is split in two: `lib/data/*` is the **mock backend**;
  `lib/api/*` is the **service layer** screens call. Screens never touch
  `lib/data` directly and never call `fetch` — this keeps the Flutter
  mirror honest.
- Maps use **Leaflet + OpenStreetMap** (`react-leaflet`) — no API key;
  the map widget is loaded client-only via `next/dynamic`.

Details and the data flow diagram: [[docs/architecture]].

## 8. Data model (high level)

`Trip`, `TripStop`, `Load`, `LoadTender`, `Conversation`, `Contact`,
`Shift`, `ClockRecord`, `CalendarEvent`, `DriverProfile`, `Compliance` —
fields and relationships are in [[docs/data-model]]. The model is
**shared** between Next.js and Flutter; both implementations use the same
field names and enum values.

## 9. Flutter transition strategy

This project is a **two-stage build**:

1. **Stage 1 — Next.js** mobile web (current repo).
2. **Stage 2 — Flutter** native app, screen-for-screen.

To make Stage 2 cheap, every Stage 1 deliverable is mirrored:

> [!important] Dual-output rule
> When a screen or feature is implemented in Next.js, the **Flutter mirror
> spec for that screen must be added/updated in [[prompts/flutter]] in the
> same change**. The agent prompts ([[prompts/codex]], [[prompts/claude]],
> [[prompts/gemini]]) all enforce this rule.

Mapping reference (full table in [[prompts/flutter]]):

| Next.js | Flutter |
|---------|---------|
| App Router route | `go_router` route |
| `AppShell` | `Scaffold` + `BottomNavigationBar` |
| Tailwind token | `ThemeData` / `ColorScheme` entry |
| Server Component fetch | `Repository` + `FutureProvider` |
| `components/ui/*` | reusable `Widget`s |

## 10. Agent workflow

Three coding agents may implement this project. Each has a tuned prompt:

- [[prompts/codex]] — GPT / Codex
- [[prompts/claude]] — Claude Code
- [[prompts/gemini]] — Gemini

All three share [[prompts/shared-context]] and obey the **dual-output
rule**.

## 11. Roadmap

Build order, what is done and what remains: [[docs/roadmap]].

---

> [!note] Related notes
> [[docs/architecture]] · [[docs/screens]] · [[docs/design-system]] ·
> [[docs/data-model]] · [[docs/roadmap]] · [[prompts/flutter]] · [[README]]
