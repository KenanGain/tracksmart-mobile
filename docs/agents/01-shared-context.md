---
title: Shared Agent Context
type: prompt
tags: [prompt, shared, rules, agents]
updated: 2026-05-22
---

# 📋 Shared Agent Context — TrackSmart Mobile

> [!important] Every agent reads this first
> This is the **primary law** for all agents. Per-agent notes ([[agents/02-claude]], [[agents/03-codex]], [[agents/04-gemini]]) only tune *how* that agent works — not *what* it builds.

---

## 1. Project Definition

**TrackSmart Mobile** — mobile-only frontend for the TrackSmart fleet-operations platform.

- **Roles:** business · driver · carrier (current build = driver-focused)
- **Build 1:** Next.js 15 (App Router) · TypeScript · Tailwind CSS (this repo)
- **Build 2:** Flutter native app, screen-for-screen
- **`APP_NAME`** = `"TrackSmart"` (`lib/constants.ts`)

**Mandatory reading before writing any code:**
→ [[01-design]] · [[04-architecture]] · [[02-screens]] · [[03-design-system]] · [[05-data-model]] · [[06-roadmap]]

---

## 2. The Seven Golden Rules

> [!caution] Hard constraints — never break

1. **📱 Mobile-only.** All UI inside `max-w-shell` (440 px). No desktop layout.
2. **🚫 Don't touch shell from screens.** `AppShell` / `TopBar` / `BottomNav` own the chrome. Screens render `<main>` content **only**.
3. **🎨 Use design tokens.** Colors from `tailwind.config.ts`. **No hex values in components.**
4. **🚫 No `fetch` in screens.** Data via `lib/api/*` only. Never import `lib/data/*` in screens.
5. **⚡ Server Components by default.** Add `"use client"` only for hooks, forms, state, canvas, maps.
6. **📊 Three states per screen.** loading · empty · error — all implemented.
7. **🗺️ Stay on the roadmap.** Build what [[06-roadmap]] and the user's command specifies.

---

## 3. ⚑ The Dual-Output Rule

> [!important] Non-negotiable
> When implementing or changing any screen/feature in Next.js, **update [[agents/05-flutter-mirror]] (= `prompts/flutter.md`) in the same change**.

For each screen add/update in `prompts/flutter.md`:
- Route: `go_router` path
- Widget tree: Flutter widget sketch
- State/data: `Repository` + provider
- Styling: Tailwind → `ThemeData` mapping
- Behaviour: interactions to replicate
- New shared widgets if any (e.g. `PillTabs`, `SignaturePad`)

**A change that updates Next.js but not `prompts/flutter.md` is incomplete.**

---

## 4. Current Implemented Components

These components are already built — **reuse them, never recreate**:

### Shared UI (`components/ui/`)

| Component | `"use client"` | Purpose |
|-----------|---------------|---------|
| `Icon` | No | SVG icon renderer |
| `BottomSheet` | Yes | Slide-up modal |
| `StatusBadge` | No | Status pill |
| **`PillTabs`** | Yes | Rounded bubble tab switcher |
| `ScreenPlaceholder` | No | Scaffold placeholder |
| `form/` | Yes | Input, Select, Textarea |

#### `PillTabs` usage
```tsx
import { PillTabs } from "@/components/ui/PillTabs";
// type PillTab = { key: string; label: string; icon?: string }

<PillTabs
  tabs={[
    { key: "current",  label: "Current",  icon: "truck" },
    { key: "upcoming", label: "Upcoming", icon: "calendar" },
  ]}
  active={tab}
  onChange={(key) => setTab(key as Tab)}
/>
```

### Key Feature Components

| Component | File | New in latest commit |
|-----------|------|---------------------|
| `TripsView` | `components/trips/TripsView.tsx` | PillTab-based (replaces collapsible sections) |
| `StopActions` | `components/trips/StopActions.tsx` | Full workflow state machine |
| `ExpenseStatusList` | `components/expenses/ExpenseStatusList.tsx` | PillTab + search |
| `TripMapLeaflet` | `components/trips/TripMapLeaflet.tsx` | Leaflet/OSM map |

### `StopActions` Dialog Chain (already built)

| Stop Kind | Buttons | Dialog chain |
|-----------|---------|-------------|
| `pickup` | Arrived · Picked Up · Departed | odometer → trailer → temp → doc |
| `drop-off` | Arrived · Delivered | odometer → signature → doc |
| `acquire` | Completed | → odometer |
| `hook` | Completed | → trailer |
| others | Completed | direct |

Dialogs: `ConfirmTrailerDialog` · `ValueDialog` · `SignatureDialog` (draw-to-sign canvas) · `AddDocumentSheet`

---

## 5. How to Take a Command

```
1. LOCATE  → Find screen in [[02-screens]] and [[06-roadmap]]
2. PLAN    → List files to add/change (Next.js + flutter mirror)
3. CHECK   → Read existing files you will touch before writing
4. IMPLEMENT → Follow the 7 golden rules
5. MIRROR  → Update prompts/flutter.md (dual-output rule)
6. VERIFY  → npm run lint · typecheck · build
7. REPORT  → What changed in code + what changed in flutter.md
```

---

## 6. Definition of Done

A task is **done only** when:

- [ ] `npm run lint` — zero errors
- [ ] `npm run typecheck` — zero errors
- [ ] `npm run build` — succeeds
- [ ] Screen renders inside mobile shell (loading/empty/error)
- [ ] `prompts/flutter.md` updated for this screen/feature
- [ ] [[02-screens]] and [[06-roadmap]] status updated

---

## 7. Code Conventions

```typescript
// TypeScript: strict, no 'any'
// Components: PascalCase, one per file
// Routes: lowercase folders under app/
// Imports in screens: lib/api/* only
// Imports in components: lib/api/* or lib/constants, lib/format
// Never: import from lib/data/* in any component or page
```

### File-naming pattern
```
components/<feature>/ComponentName.tsx   ← client or server component
app/(app)/<route>/page.tsx              ← server component by default
lib/api/<resource>.ts                   ← service layer
lib/data/<resource>.ts                  ← mock backend (never imported by screens)
```

### "use client" — add only if component uses:
- `useState`, `useEffect`, `useRef`
- `usePathname`, `useRouter`, `useSearchParams`
- `onClick`, `onChange`, `onSubmit`, pointer events
- Canvas API
- `next/dynamic`

---

## 8. File Reference Quick-Map

| What you need | Where it is |
|---------------|-------------|
| App-wide constants | `lib/constants.ts` |
| Date helpers | `lib/format.ts` (formatDate, formatNow) |
| Mock data | `lib/data/<resource>.ts` |
| Service calls | `lib/api/<resource>.ts` |
| Shell components | `components/shell/` |
| **Shared UI (incl. PillTabs)** | `components/ui/` |
| Design tokens | `tailwind.config.ts` |
| Global styles | `app/globals.css` |
| Screenshots | `screenshots/` (Playwright, `npm run preview:mobile`) |

---

## 🔗 Related

[[agents/00-agents-home]] · [[agents/02-claude]] · [[agents/03-codex]] · [[agents/04-gemini]] · [[agents/05-flutter-mirror]]
