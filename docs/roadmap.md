---
title: Roadmap
type: doc
tags: [roadmap, milestones]
---

# Roadmap

> Build order for the mobile view. Screens are tracked in [[screens]];
> this note is the milestone-level view of what is done and what remains.

## ✅ Done

### M0 — Scaffold
- [x] Next.js + TypeScript + Tailwind project config
- [x] Mobile shell: `AppShell`, `TopBar`, `BottomNav` (translucent,
      floating)
- [x] Five-tab bottom nav (Home / Trips / Bulletin / Calendar / Chats)
- [x] Design tokens in `tailwind.config.ts`
- [x] Documentation ([[design]], [[architecture]], [[screens]],
      [[design-system]], [[data-model]])
- [x] Agent prompts ([[prompts/codex]], [[prompts/claude]],
      [[prompts/gemini]], [[prompts/flutter]])

### M1 — Auth & data layer
- [x] `lib/data` mock backend + `lib/api` service layer (one module per
      resource)
- [x] Sign in `/auth/sign-in` — demo quick-login + manual mock auth
- [x] Shared UI: `Icon`, `BottomSheet`, `StatusBadge`, `form` fields,
      `ScreenPlaceholder`

### M2 — Driver core screens
- [x] Home `/home` — company & compliance cards, action cards, payroll,
      schedule, time-tracking clock in/out
- [x] Trips `/trips` — current / upcoming / previous, itinerary card,
      progress strip, stop timeline with Arrival + POD
- [x] Compliance `/compliance` — documents, uploads, certifications
- [x] Expenses `/expenses` + `/expenses/new` (5-step wizard)
- [x] Trip Sheets `/trip-sheets` + `/trip-sheets/new`

### M3 — Communication & schedule
- [x] Bulletin `/bulletin` — load-tender feed (accept / decline)
- [x] Chats `/chats` + `/chat/[id]` — conversation list, threads, and a
      New-Chat contact picker
- [x] Calendar `/calendar` — month grid with navigation, events / shifts
      / timesheet, event scheduling, list view
- [x] Notifications `/notifications` — top-bar bell feed

### M4 — Account
- [x] Account side drawer (profile + menu)
- [x] Settings `/account/settings` — notification toggles + appearance
- [x] Trip History `/account/trip-history`
- [x] About `/account/about`

## ⏳ Remaining

### M5 — Trip & load detail
- [ ] Trip detail `/trips/[id]` with attached loads
- [ ] Route / map view `/trips/[id]/route` (map provider integration)
- [ ] Load detail `/trips/[id]/loads/[loadId]` + proof-of-delivery
- [ ] Bulletin notice detail `/bulletin/[id]`
- [ ] Maintenance Requests flow (currently a Home placeholder)

### M6 — Roles
- [ ] Role-aware UI for **business** and **carrier** (current build is
      driver-focused)
- [ ] Vehicle / fleet screens

### M7 — Polish & real API
- [ ] Connect `lib/api` to the real TrackSmart API (drop mock data)
- [ ] Offline read cache + write queue
- [ ] Loading / empty / error states audited on every screen

## Stage 2 — Flutter

Once the Next.js build is stable, build the Flutter app screen-for-screen
using the mirror specs in [[prompts/flutter]]. Because the dual-output
rule was followed throughout, [[prompts/flutter]] is already a complete
build plan.

## Related

[[design]] · [[screens]] · [[prompts/flutter]]
