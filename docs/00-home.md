---
title: TrackSmart Mobile — Home
type: moc
status: active
platform: Next.js (mobile-only) → Flutter (planned)
created: 2026-05-21
updated: 2026-05-22
tags: [moc, tracksmart, mobile, nextjs, flutter]
---

# 🚛 TrackSmart Mobile

> [!abstract] What is this vault?
> This Obsidian vault is the **single source of truth** for the TrackSmart Mobile project — a phone-first logistics companion app for **businesses, drivers and carriers**. It covers design decisions, architecture, screen specs, data models, agent prompts and the Flutter transition roadmap.

---

## 🗺️ Map of Content

### 📐 Design & Product
| Note | Purpose |
|------|---------|
| [[01-design]] | Design source-of-truth — principles, IA, visual language |
| [[02-screens]] | Screen catalogue — every route, status, and spec |
| [[03-design-system]] | Tokens, colours, typography, components |

### 🏗️ Engineering
| Note | Purpose |
|------|---------|
| [[04-architecture]] | Next.js app structure, data flow, rendering rules |
| [[05-data-model]] | Entities, types, relationships |

### 🗓️ Planning
| Note | Purpose |
|------|---------|
| [[06-roadmap]] | Milestones — done and remaining |

### 🤖 AI Agents
| Note | Purpose |
|------|---------|
| [[agents/00-agents-home]] | Agent workflow overview |
| [[agents/01-shared-context]] | Rules every agent must follow |
| [[agents/02-claude]] | Claude Code tuned prompt |
| [[agents/03-codex]] | OpenAI Codex tuned prompt |
| [[agents/04-gemini]] | Gemini tuned prompt |
| [[agents/05-flutter-mirror]] | Flutter build spec (living document) |

---

## 📱 App at a Glance

```
┌──────────────────────────────┐
│  TrackSmart Mobile           │
│  Fleet Operations Platform   │
├──────────────────────────────┤
│  Roles: Business · Driver    │
│         · Carrier            │
│  Build 1: Next.js 15 (now)   │
│  Build 2: Flutter (planned)  │
└──────────────────────────────┘
```

### Implemented Screens (✅ Done)
- **Auth** — Sign in (demo + manual)
- **Home** — Company card, compliance, expenses, time tracking
- **Trips** — Current / upcoming / previous + interactive route maps
- **Trip Detail** — Map, progress, stop timeline (8 stop types)
- **Bulletin** — Load tender feed (accept / decline)
- **Schedule** — Month grid + agenda list
- **Chats** — Conversation list + threads + new chat
- **Notifications** — Top-bar bell feed
- **Compliance** — Licence, passport, documents, certifications
- **Expenses** — Submit wizard (5 steps) + status list
- **Trip Sheets** — Upload form + status list
- **Account** — Side drawer + Settings + Trip History + About

---

## 🔗 External Links

- [GitHub Repository](https://github.com/KenanGain/tracksmart-mobile)
- [Local Dev Server](http://localhost:3001)

---

> [!note] Navigation tip
> Open this file first in **Obsidian**. All links use wikilinks — click any `[[note]]` to jump to it. Use the Graph View to see how everything connects.
