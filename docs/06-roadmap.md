---
title: Roadmap
type: doc
tags: [roadmap, milestones, planning]
updated: 2026-05-22
---

# 🗓️ Roadmap — TrackSmart Mobile

> [!abstract] Purpose
> Milestone-level view of what is done and what remains. For the screen-level detail, see [[02-screens]]. For the Flutter transition plan, see [[agents/05-flutter-mirror]].

---

## ✅ Completed Milestones

### M0 — Project Scaffold
- [x] Next.js 15 + TypeScript + Tailwind CSS config
- [x] Mobile shell — `AppShell`, `TopBar`, `BottomNav` (translucent, floating)
- [x] Five-tab bottom nav (Home / Trips / Bulletin / Schedule / Chats)
- [x] Design tokens in `tailwind.config.ts`
- [x] Obsidian documentation vault
- [x] Agent prompts (Claude / Codex / Gemini / Flutter)

---

### M1 — Auth & Data Layer
- [x] `lib/data/` mock backend (14 typed seed modules)
- [x] `lib/api/` service layer (one module per resource)
- [x] Sign In `/auth/sign-in` — demo quick-login + manual mock auth
- [x] Shared UI — `Icon`, `BottomSheet`, `StatusBadge`, `ScreenPlaceholder`, form fields

---

### M2 — Driver Core Screens
- [x] Home `/home` — company card, compliance, expenses, maintenance, trip sheets, payroll, time tracking
- [x] My Compliance `/compliance` — license, passport, emergency contact, documents, certifications
- [x] Expenses `/expenses` + `/expenses/new` — 5-step submit wizard + status list
- [x] Trip Sheets `/trip-sheets` + `/trip-sheets/new` — upload form + status list

---

### M3 — Communication & Schedule
- [x] Bulletin `/bulletin` — searchable load-tender feed with accept/decline
- [x] Chats `/chats` + `/chat/[id]` — conversation list, threads, New-Chat contact picker
- [x] Schedule `/calendar` — month grid (events/shifts/timesheet) + date-grouped agenda list
- [x] Notifications `/notifications` — top-bar bell feed

---

### M4 — Account
- [x] Account side drawer — profile block, menu (Trip History / Settings / About), Log Out
- [x] Settings `/account/settings` — notification toggles + appearance (font size, theme)
- [x] Trip History `/account/trip-history` — completed trip cards
- [x] About `/account/about` — app identity, version, provider, legal links

---

### M5 — Trips & Maps
- [x] Trips `/trips` — current / upcoming / previous summary cards with count badges
- [x] Trip Detail `/trips/[id]` — map, progress strip, dispatch note, details, stop timeline
- [x] Rich stop kinds — Acquire / Hook / Docking / Loading / Unloading / Pick Up / Deliver / Drop Off / Check Call
- [x] Freight stops — odometer reading + document upload (Add Document sheet)
- [x] Mark as Completed per stop
- [x] `TripMap` — Leaflet + OpenStreetMap, brand polyline, numbered pins
- [x] Tap-to-open full-screen interactive map

---

## ⏳ Remaining Work

### M6 — Detail Screens
- [ ] Load Detail `/trips/[id]/loads/[loadId]` — pickup/dropoff, cargo, accept/decline, doc upload
- [ ] Dedicated full-screen route map `/trips/[id]/route`
- [ ] Bulletin notice detail `/bulletin/[id]`
- [ ] Maintenance Requests full flow (currently a Home placeholder)

---

### M7 — Role-Aware UI
- [ ] Business role screens — create trip, watch progress, see ETAs
- [ ] Carrier role screens — fleet/vehicle management, assigned driver monitoring
- [ ] Role-aware Home quick stats and shortcuts

---

### M8 — Polish & Real API
- [ ] Replace `lib/data/` mock with real TrackSmart API calls (service layer interface stays the same)
- [ ] Offline read cache + write queue
- [ ] Audit loading / empty / error states on every screen
- [ ] Full dark mode implementation
- [ ] Accessibility pass (ARIA, focus management)

---

## Stage 2 — Flutter Native App

> [!important] Flutter Spec is Ready
> Because the dual-output rule was followed throughout Stages M0–M5, [[agents/05-flutter-mirror]] is already a **complete, screen-by-screen Flutter build plan**.

When the Next.js build is stable (M8), begin the Flutter app:

1. Use `go_router` routes matching the Next.js route table
2. Use `ThemeData` mapping the Tailwind design tokens
3. Use `Repository` + `FutureProvider` matching `lib/api/`
4. Build widgets screen-by-screen using the mirror specs in [[agents/05-flutter-mirror]]

### Flutter → Next.js Mapping Reference

| Next.js | Flutter |
|---------|---------|
| App Router route | `go_router` route |
| `AppShell` + bottom tabs | `Scaffold` + `NavigationBar` |
| Tailwind token | `ThemeData` / `ColorScheme` entry |
| Server Component + `lib/api` | `Repository` + `FutureProvider` (Riverpod) |
| `components/ui/*` | Reusable `Widget` classes |
| `BottomSheet` | `showModalBottomSheet` |
| `StatusBadge` | Custom `Chip` widget |

---

## 🔗 Related

[[00-home]] · [[01-design]] · [[02-screens]] · [[agents/05-flutter-mirror]]
