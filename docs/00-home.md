---
title: TrackSmart Mobile — Home
type: moc
status: active
platform: Next.js 15 (mobile-only) → Flutter (planned)
created: 2026-05-21
updated: 2026-05-22
tags: [moc, tracksmart, mobile, nextjs, flutter]
---

# 🚛 TrackSmart Mobile

> [!abstract] What is this vault?
> The **single source of truth** for the TrackSmart Mobile project — a phone-first logistics companion app for **businesses, drivers and carriers**. Covers design, architecture, screen specs, data models, agent prompts and the Flutter transition roadmap.

---

## 🗺️ Map of Content

### 📐 Design & Product
| Note | Purpose |
|------|---------|
| [[01-design]] | Design source-of-truth — principles, IA, visual language |
| [[02-screens]] | Screen catalogue — every route, status, spec |
| [[03-design-system]] | Tokens, colours, typography, all components |

### 🏗️ Engineering
| Note | Purpose |
|------|---------|
| [[04-architecture]] | Folder layout, rendering rules, data flow, key components |
| [[05-data-model]] | All TypeScript entities and types |

### 🗓️ Planning
| Note | Purpose |
|------|---------|
| [[06-roadmap]] | Milestones M0–M5 done · M6–M8 + Flutter remaining |

### 🤖 AI Agents
| Note | Purpose |
|------|---------|
| [[agents/00-agents-home]] | Agent workflow overview |
| [[agents/01-shared-context]] | Rules every agent must follow |
| [[agents/02-claude]] | Claude Code tuned prompt |
| [[agents/03-codex]] | Codex / GPT tuned prompt |
| [[agents/04-gemini]] | Gemini tuned prompt |
| [[agents/05-flutter-mirror]] | Flutter build spec (living doc) |

---

## 📱 App at a Glance

```
┌──────────────────────────────┐
│  TrackSmart Mobile           │
│  Fleet Operations Companion  │
├──────────────────────────────┤
│  Roles: Business · Driver    │
│         · Carrier            │
│  Frame:  440 px (iPhone 16)  │
│  Build 1: Next.js 15 (now)   │
│  Build 2: Flutter (planned)  │
└──────────────────────────────┘
```

---

## ✅ What's Built (M0–M5 Complete + Light/Dark Theme)

| Feature | Highlights |
|---------|-----------|
| **Light & Dark Themes** | App-wide adaptive styling using CSS variables + Theme Toggle |
| **Mobile shell** | AppShell · TopBar · BottomNav (translucent floating, blurred) |
| **Auth** | Sign in with demo user picker or manual credentials |
| **Home** | Company card · compliance · expenses · trip sheets · time-tracking clock |
| **Trips** | **PillTab switcher** (Current / Upcoming / Previous) + TripCard with embedded Leaflet map |
| **Trip Detail** | Interactive route map · progress strip · dispatch note · **full stop workflow** |
| **Stop Workflow** | Arrived → odometer · Picked Up → trailer → temp → doc · Delivered → e-signature → doc |
| **Bulletin** | Load tender feed with Accept / Decline |
| **Schedule** | Month calendar + agenda list |
| **Chats** | Conversation list + threads + new chat |
| **Notifications** | Bell feed |
| **Compliance** | License · passport · docs · certifications |
| **Expenses** | 5-step wizard + **PillTab status list** (Payroll / Company) |
| **Trip Sheets** | Upload form + status list |
| **Account** | Drawer · Settings · Trip History · About |

### New in Latest Commit
- **Light/Dark Theme** — ThemeToggle in the Shell with persistent localStorage state and adaptive Leaflet map tiles.
- **`PillTabs`** — shared rounded-bubble tab switcher (used by Trips + Expense Status)
- **`TripsView`** refactored to PillTab navigation
- **`ExpenseStatusList`** — Payroll Addition / Company Paid tab split + search
- **`StopActions`** — full state machine: odometer · trailer confirm · temperature · e-signature canvas · doc upload

---

## 🔲 What's Next (M6+)

| Milestone | Work |
|-----------|------|
| M6 | Load Detail · full-screen route map · maintenance requests |
| M7 | Business + carrier role-aware UI |
| M8 | Real API · offline cache |
| Stage 2 | Flutter native app (spec in [[agents/05-flutter-mirror]]) |

---

## 🔗 External Links

- [GitHub Repository](https://github.com/KenanGain/tracksmart-mobile)
- [Local Dev](http://localhost:3001)

---

> [!note] Open in Obsidian
> Open the **repository root** as a vault in Obsidian. All links are wikilinks — click any `[[note]]` to jump. Use Graph View to explore connections.
