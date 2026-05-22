---
title: Design
type: design-doc
status: in-development
platform: Next.js (mobile-only) → Flutter (planned)
audience: [business, driver, carrier]
created: 2026-05-21
updated: 2026-05-22
tags: [design, product, mobile, tracksmart]
---

# 📐 Design — TrackSmart Mobile

> [!abstract] Purpose
> This is the **design source-of-truth** for the mobile view. Read this before touching any code. The [[04-architecture]] note covers the engineering side; [[02-screens]] has per-screen specs.

---

## 1. Product Summary

TrackSmart is a **logistics / fleet-operations platform**. The web app is the operations console; this **mobile view** is the companion app — designed phone-first for people in the field.

### Three Audiences

| Role | Primary Jobs on Mobile |
|------|----------------------|
| 🏢 **Business** | Create trips, assign loads, watch progress, see ETAs |
| 🚛 **Driver** | See trips, follow route, update status, upload docs, log expenses, clock in/out |
| 🏭 **Carrier** | Manage fleet/vehicles, accept load tenders, monitor drivers |

> [!info] Current Build Focus
> The current build is **driver-focused** — the first audience implemented. Business and carrier role-aware UI is tracked in [[06-roadmap]] §M7.

---

## 2. Design Principles

> [!important] These principles override any individual design decision

1. **📱 Phone-first, single column** — All UI lives inside a `max-w-shell` (440 px, iPhone 16 Pro Max) frame. Never design a desktop layout.
2. **👆 One primary action per screen** — Thumb-reachable, bottom-anchored CTA.
3. **📍 Persistent bottom navigation** — Five tabs, never more. Labels: Home · Trips · Bulletin · Schedule · Chats.
4. **🌫️ Translucent floating chrome** — TopBar and BottomNav are blurred, semi-transparent overlays; content scrolls underneath.
5. **🔴 Status is always visible** — Trips and loads are state machines; current state is the most important thing on screen.
6. **🔵 Blue is the brand** — Primary actions, active nav, and accents use `brand` blue (`#1d4ed8`). Never green for primary.
7. **🔄 Platform-portable** — Every design choice maps cleanly to Flutter (see [[agents/05-flutter-mirror]]).

---

## 3. Information Architecture

```
/                      → redirects to /auth/sign-in (entry)
/auth/sign-in          Sign in              (no shell)

App Shell (TopBar + content + BottomNav)
├── /home              Home           today's overview & action cards
├── /trips             Trips          current / upcoming / previous
├── /bulletin          Bulletin       load tenders (accept / decline)
├── /calendar          Schedule       month grid + agenda
└── /chats             Chats          messaging

Detail routes (back-button TopBar, inside shell):
  /trips/[id]                  trip detail: map, progress, stop timeline
  /compliance                  driver compliance documents
  /account/settings            notification toggles + appearance
  /account/trip-history        completed trips
  /account/about               app info & legal

Full-screen routes (own header, no nav):
  /notifications               notification bell feed
  /expenses · /expenses/new    expense status + submit wizard
  /trip-sheets · /trip-sheets/new
  /chat/[id]                   chat thread
```

> [!note] Account is a **side drawer**, not a route
> The account icon in the TopBar opens the "My Account" drawer (slides in from the right). Its menu links to the `/account/*` sub-screens.

---

## 4. Navigation Model

```
┌──────────────────────────┐
│  TopBar  (translucent)   │  ← Tab route: title + 🔔 + 👤
│  OR: ← Back + Title      │  ← Detail route: back + centred title
├──────────────────────────┤
│  <main> scrollable       │  scrolls under both bars
│     screen content       │
│                          │
│  BottomNav (floating)    │  ← five tabs, pill shape
└──────────────────────────┘
```

- **Bottom tabs** = five top-level destinations.
- **Account drawer** slides in from the right of the phone frame.
- **Full-screen flows** render outside the `(app)` route group — they have their own header and no BottomNav.
- **Bottom sheets** (`BottomSheet.tsx`) for modal forms and pickers.

---

## 5. Visual Language

See [[03-design-system]] for the full token reference. Summary:

| Token | Value | Used for |
|-------|-------|---------|
| `brand` | `#1d4ed8` | Primary actions, active nav, accents |
| `surface` | white | Card backgrounds |
| `muted` | grey-50 | Page background |
| `success` | green | Completed states, clocked-in timer |
| `warning` | amber | Upcoming / in-progress states |
| `danger` | red | Error states, destructive actions |

- **Translucent bars** — `bg-surface/80` + `backdrop-blur-md`
- **Safe areas** — `pt-safe-top`, `pb-nav-bottom` respected
- **Typography** — system font stack; semibold labels, regular body
- **Cards** — white, `rounded-xl`, soft shadow

---

## 6. Screen Status Summary

| Screen | Route | Status |
|--------|-------|--------|
| Sign In | `/auth/sign-in` | ✅ Done |
| Home | `/home` | ✅ Done |
| Trips | `/trips` | ✅ Done |
| Trip Detail | `/trips/[id]` | ✅ Done |
| Bulletin | `/bulletin` | ✅ Done |
| Schedule | `/calendar` | ✅ Done |
| Chats | `/chats` | ✅ Done |
| Chat Thread | `/chat/[id]` | ✅ Done |
| Notifications | `/notifications` | ✅ Done |
| Compliance | `/compliance` | ✅ Done |
| Expenses | `/expenses` | ✅ Done |
| Submit Expense | `/expenses/new` | ✅ Done |
| Trip Sheets | `/trip-sheets` | ✅ Done |
| Submit Trip Sheet | `/trip-sheets/new` | ✅ Done |
| Settings | `/account/settings` | ✅ Done |
| Trip History | `/account/trip-history` | ✅ Done |
| About | `/account/about` | ✅ Done |
| Load Detail | `/trips/[id]/loads/[loadId]` | 🔲 Planned |
| Route Map | `/trips/[id]/route` | 🔲 Planned |

---

## 7. Flutter Transition Strategy

This project is a **two-stage build**:

1. **Stage 1 — Next.js** mobile web (current repo)
2. **Stage 2 — Flutter** native app, screen-for-screen

> [!important] Dual-Output Rule
> Every screen implemented in Next.js **must** be mirrored into [[agents/05-flutter-mirror]] in the **same change**. See [[agents/01-shared-context]] §3.

| Next.js | Flutter |
|---------|---------|
| App Router route | `go_router` route |
| `AppShell` | `Scaffold` + `BottomNavigationBar` |
| Tailwind token | `ThemeData` / `ColorScheme` |
| Server Component fetch | `Repository` + `FutureProvider` |
| `components/ui/*` | Reusable `Widget`s |

---

## 🔗 Related

[[00-home]] · [[02-screens]] · [[03-design-system]] · [[04-architecture]] · [[05-data-model]] · [[06-roadmap]] · [[agents/05-flutter-mirror]]
