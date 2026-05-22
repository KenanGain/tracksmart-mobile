# TrackSmart Mobile 🚛

<div align="center">

**A phone-first fleet-operations companion app for drivers, businesses and carriers.**

Built with **Next.js 15** · TypeScript · Tailwind CSS · Leaflet Maps

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Status](https://img.shields.io/badge/Status-In_Development-f59e0b)](docs/06-roadmap.md)

[📱 Live Demo](#getting-started) · [📖 Docs](docs/00-home.md) · [🗺️ Roadmap](docs/06-roadmap.md) · [🤖 Agent Prompts](docs/agents/)

</div>

---

## What Is This?

TrackSmart Mobile is the **companion mobile app** for the TrackSmart fleet-operations platform. While the main web app is the operations console, this app is designed **phone-first** — built for people in the field.

It serves three roles:

| Role | Primary Jobs |
|------|-------------|
| 🚛 **Driver** | View trips, follow the route, update stop status, upload documents, log expenses, clock in/out |
| 🏢 **Business** | Create trips, assign loads, watch progress, see ETAs |
| 🏭 **Carrier** | Manage fleet/vehicles, accept load tenders, monitor drivers |

> The current build is **driver-focused** (Milestone 1–5 complete). Business and carrier roles are planned in M7.

---

## Screenshots

### Core Screens

<div align="center">
<table>
<tr>
<th colspan="2" align="center">Sign In</th>
<th colspan="2" align="center">Home</th>
</tr>
<tr>
<td align="center"><strong>Light</strong></td>
<td align="center"><strong>Dark</strong></td>
<td align="center"><strong>Light</strong></td>
<td align="center"><strong>Dark</strong></td>
</tr>
<tr>
<td><img src="screenshots/light/01-sign-in.png" width="180" alt="Sign In Light"/></td>
<td><img src="screenshots/dark/01-sign-in.png" width="180" alt="Sign In Dark"/></td>
<td><img src="screenshots/light/03-home.png" width="180" alt="Home Light"/></td>
<td><img src="screenshots/dark/03-home.png" width="180" alt="Home Dark"/></td>
</tr>
<tr>
<th colspan="2" align="center">Trips</th>
<th colspan="2" align="center">Trip Detail</th>
</tr>
<tr>
<td align="center"><strong>Light</strong></td>
<td align="center"><strong>Dark</strong></td>
<td align="center"><strong>Light</strong></td>
<td align="center"><strong>Dark</strong></td>
</tr>
<tr>
<td><img src="screenshots/light/04-trips.png" width="180" alt="Trips Light"/></td>
<td><img src="screenshots/dark/04-trips.png" width="180" alt="Trips Dark"/></td>
<td><img src="screenshots/light/08-trip-detail.png" width="180" alt="Trip Detail Light"/></td>
<td><img src="screenshots/dark/08-trip-detail.png" width="180" alt="Trip Detail Dark"/></td>
</tr>
</table>
</div>

### Communication & Schedule

<div align="center">
<table>
<tr>
<th colspan="2" align="center">Bulletin</th>
<th colspan="2" align="center">Schedule</th>
</tr>
<tr>
<td align="center"><strong>Light</strong></td>
<td align="center"><strong>Dark</strong></td>
<td align="center"><strong>Light</strong></td>
<td align="center"><strong>Dark</strong></td>
</tr>
<tr>
<td><img src="screenshots/light/05-bulletin.png" width="180" alt="Bulletin Light"/></td>
<td><img src="screenshots/dark/05-bulletin.png" width="180" alt="Bulletin Dark"/></td>
<td><img src="screenshots/light/06-schedule.png" width="180" alt="Schedule Light"/></td>
<td><img src="screenshots/dark/06-schedule.png" width="180" alt="Schedule Dark"/></td>
</tr>
<tr>
<th colspan="2" align="center">Chats</th>
<th colspan="2" align="center">Notifications</th>
</tr>
<tr>
<td align="center"><strong>Light</strong></td>
<td align="center"><strong>Dark</strong></td>
<td align="center"><strong>Light</strong></td>
<td align="center"><strong>Dark</strong></td>
</tr>
<tr>
<td><img src="screenshots/light/07-chats.png" width="180" alt="Chats Light"/></td>
<td><img src="screenshots/dark/07-chats.png" width="180" alt="Chats Dark"/></td>
<td><img src="screenshots/light/09-notifications.png" width="180" alt="Notifications Light"/></td>
<td><img src="screenshots/dark/09-notifications.png" width="180" alt="Notifications Dark"/></td>
</tr>
</table>
</div>

### Driver Workflows

<div align="center">
<table>
<tr>
<th colspan="2" align="center">Expenses</th>
<th colspan="2" align="center">Submit Expense</th>
</tr>
<tr>
<td align="center"><strong>Light</strong></td>
<td align="center"><strong>Dark</strong></td>
<td align="center"><strong>Light</strong></td>
<td align="center"><strong>Dark</strong></td>
</tr>
<tr>
<td><img src="screenshots/light/10-expenses.png" width="180" alt="Expenses Light"/></td>
<td><img src="screenshots/dark/10-expenses.png" width="180" alt="Expenses Dark"/></td>
<td><img src="screenshots/light/11-expense-new.png" width="180" alt="Submit Expense Light"/></td>
<td><img src="screenshots/dark/11-expense-new.png" width="180" alt="Submit Expense Dark"/></td>
</tr>
<tr>
<th colspan="2" align="center">Compliance</th>
<th colspan="2" align="center">Settings</th>
</tr>
<tr>
<td align="center"><strong>Light</strong></td>
<td align="center"><strong>Dark</strong></td>
<td align="center"><strong>Light</strong></td>
<td align="center"><strong>Dark</strong></td>
</tr>
<tr>
<td><img src="screenshots/light/14-compliance.png" width="180" alt="Compliance Light"/></td>
<td><img src="screenshots/dark/14-compliance.png" width="180" alt="Compliance Dark"/></td>
<td><img src="screenshots/light/15-settings.png" width="180" alt="Settings Light"/></td>
<td><img src="screenshots/dark/15-settings.png" width="180" alt="Settings Dark"/></td>
</tr>
</table>
</div>

---

## How It Works

### Architecture

```
┌──────────────────── Phone Frame (440px) ─────────────────────┐
│  TopBar (translucent, blurred)                               │
│──────────────────────────────────────────────────────────────│
│  <main>  scrollable content                                  │
│    ↑ provided by each screen                                 │
│    ↑ never its own TopBar or BottomNav                       │
│──────────────────────────────────────────────────────────────│
│  BottomNav (5 tabs, floating pill, translucent, blurred)     │
└──────────────────────────────────────────────────────────────┘
```

### Data Flow

```
Screen (Server Component)
  → lib/api/<resource>.ts     ← typed service layer
    → lib/data/<resource>.ts  ← mock backend (replaced by real API later)
  ← typed model (docs/05-data-model.md)
  → props → Client Component (for interactive parts only)
```

### Key Design Decisions

- **Server Components by default** — `"use client"` only for forms, state, maps and navigation hooks
- **No `fetch` in screens** — all data via `lib/api/*`; the service layer is the only seam between screens and data
- **Two-stage build** — Next.js now, Flutter later. Every screen has a Flutter mirror spec in [`docs/agents/05-flutter-mirror.md`](docs/agents/05-flutter-mirror.md)
- **Maps: Leaflet + OpenStreetMap** — no API key required; loaded client-only via `next/dynamic`

---

## Features Built

| Milestone | Features | Status |
|-----------|---------|--------|
| **M0** | Project scaffold, mobile shell, bottom nav, design tokens | ✅ |
| **M1** | Auth (sign in), mock data layer, shared UI components | ✅ |
| **M2** | Home, Compliance, Expenses (5-step wizard), Trip Sheets | ✅ |
| **M3** | Bulletin (load tenders), Chats + threads, Schedule (calendar + agenda), Notifications | ✅ |
| **M4** | Account drawer, Settings, Trip History, About | ✅ |
| **M5** | Trips list + detail, interactive route maps (Leaflet), stop timeline (8 stop types) | ✅ |
| **M6** | Load detail, full-screen route map, maintenance requests | 🔲 |
| **M7** | Business + carrier role-aware UI | 🔲 |
| **M8** | Real API connection, offline cache, dark mode | 🔲 |

---

## Tech Stack

| | Technology |
|-|-----------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS 3 |
| **Maps** | [Leaflet](https://leafletjs.com/) + [react-leaflet](https://react-leaflet.js.org/) + OpenStreetMap |
| **Viewport** | 440px — iPhone 16 Pro Max (mobile-only, no desktop layout) |
| **Future** | Flutter (native app, screen-for-screen — see [`docs/agents/05-flutter-mirror.md`](docs/agents/05-flutter-mirror.md)) |

---

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/KenanGain/tracksmart-mobile.git
cd tracksmart-mobile

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local

# 4. Start the dev server
npm run dev
# → http://localhost:3000
```

### Demo Login

Open http://localhost:3000 and use the **"Quick demo login"** dropdown to select a demo user, then click **Sign In**. Demo password: `demo1234`.

### Available Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript strict check |
| `npm run preview:mobile` | Take Playwright screenshots of all screens |

---

## Project Structure

```
tracksmart-mobile/
├── app/                    # Next.js App Router
│   ├── (app)/              # Shell routes (TopBar + BottomNav)
│   │   ├── home/
│   │   ├── trips/[id]/
│   │   ├── bulletin/
│   │   ├── calendar/
│   │   ├── chats/
│   │   ├── compliance/
│   │   └── account/settings|trip-history|about
│   ├── auth/               # Pre-login (no shell)
│   ├── expenses/           # Full-screen flow (no shell)
│   ├── trip-sheets/        # Full-screen flow (no shell)
│   ├── notifications/      # Full-screen (no shell)
│   └── chat/[id]/          # Full-screen chat thread
│
├── components/
│   ├── shell/              # AppShell · TopBar · BottomNav
│   ├── trips/              # TripCard · TripDetailView · TripMap
│   ├── home/               # Home section cards
│   └── ui/                 # Icon · BottomSheet · StatusBadge · form/
│
├── lib/
│   ├── api/                # Service layer (screens call this)
│   ├── data/               # Mock backend (seed data)
│   ├── constants.ts        # APP_NAME, NAV_ITEMS, DETAIL_TITLES
│   └── format.ts           # Date formatting helpers
│
├── docs/                   # 📖 Obsidian vault (open as vault in Obsidian)
│   ├── 00-home.md          # Vault home / Map of Content
│   ├── 01-design.md        # Design source-of-truth
│   ├── 02-screens.md       # Screen catalogue & specs
│   ├── 03-design-system.md # Tokens, colours, components
│   ├── 04-architecture.md  # Engineering architecture
│   ├── 05-data-model.md    # TypeScript entities & types
│   ├── 06-roadmap.md       # Milestones — done & remaining
│   └── agents/             # AI agent prompts
│       ├── 00-agents-home.md
│       ├── 01-shared-context.md  # Rules every agent must follow
│       ├── 02-claude.md          # Claude Code prompt
│       ├── 03-codex.md           # Codex / GPT prompt
│       ├── 04-gemini.md          # Gemini prompt
│       └── 05-flutter-mirror.md  # Flutter build spec (living doc)
│
├── screenshots/            # Mobile screenshots (generated by preview:mobile)
└── scripts/
    └── mobile-preview.mjs  # Playwright screenshot script
```

---

## Documentation (Obsidian Vault)

Open the repository root as an **Obsidian vault** — all docs use wikilinks and cross-reference each other.

| Doc | Purpose |
|-----|---------|
| [`docs/00-home.md`](docs/00-home.md) | 🏠 Vault home — start here |
| [`docs/01-design.md`](docs/01-design.md) | 📐 Design source-of-truth |
| [`docs/02-screens.md`](docs/02-screens.md) | 📱 Screen catalogue + per-screen specs |
| [`docs/03-design-system.md`](docs/03-design-system.md) | 🎨 Tokens, colours, components |
| [`docs/04-architecture.md`](docs/04-architecture.md) | 🏗️ Engineering decisions |
| [`docs/05-data-model.md`](docs/05-data-model.md) | 🗄️ TypeScript entity types |
| [`docs/06-roadmap.md`](docs/06-roadmap.md) | 🗓️ Milestones |

---

## Building with AI Agents

This project is designed to be built incrementally with AI coding agents. Each agent gets a tailored prompt:

| Agent | Prompt File |
|-------|------------|
| **Claude Code** | [`docs/agents/02-claude.md`](docs/agents/02-claude.md) |
| **OpenAI Codex / GPT** | [`docs/agents/03-codex.md`](docs/agents/03-codex.md) |
| **Google Gemini** | [`docs/agents/04-gemini.md`](docs/agents/04-gemini.md) |

### The Dual-Output Rule

> Every screen built in Next.js **must** also be described in [`docs/agents/05-flutter-mirror.md`](docs/agents/05-flutter-mirror.md) in the same change.

This keeps the eventual Flutter migration cheap — the Flutter spec is always up-to-date.

### Example Agent Command

```
"Implement the load detail screen at /trips/[id]/loads/[loadId].
 Follow the spec in docs/02-screens.md and mirror to docs/agents/05-flutter-mirror.md."
```

---

## Contributing

1. Read [`docs/agents/01-shared-context.md`](docs/agents/01-shared-context.md) — the golden rules
2. Find your screen in [`docs/02-screens.md`](docs/02-screens.md)
3. Check the milestone in [`docs/06-roadmap.md`](docs/06-roadmap.md)
4. Implement the Next.js screen + Flutter mirror + verify (`lint` + `typecheck` + `build`)

---

## License

MIT — see [LICENSE](LICENSE)

---

<div align="center">
  <sub>TrackSmart Mobile · Built by <a href="https://github.com/KenanGain">Kenan Gain</a></sub>
</div>
