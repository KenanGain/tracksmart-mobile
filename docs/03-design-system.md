---
title: Design System
type: doc
tags: [design-system, tokens, components, styling]
updated: 2026-05-22
---

# 🎨 Design System — TrackSmart Mobile

> [!abstract] Purpose
> The single reference for all design tokens, components and conventions. **Never hard-code a colour or spacing value** — always use a token from this system.

---

## Colour Tokens

All colours live in `tailwind.config.ts` under `theme.extend.colors`.

### Brand

| Token | Value | Usage |
|-------|-------|-------|
| `brand` | `#1d4ed8` | Primary buttons, active nav, accents |
| `brand-light` | `#eff6ff` | Brand tint chips, trip-id badges |
| `brand/30` | opacity 30% | Focus ring: `focus:ring-brand/30` |

### Ink (Text)

| Token | Usage |
|-------|-------|
| `ink` | Primary text (`#0f172a`) |
| `ink-muted` | Secondary / placeholder text |
| `ink/5` | Hairline borders (`border-ink/5`) |
| `ink/10` | Subtle borders |
| `ink/15` | Card borders |

### Surfaces

| Token | Usage |
|-------|-------|
| `surface` | Card / input backgrounds (white) |
| `surface-muted` | Page background, pill-tab track |

### Semantic

| Token | Usage |
|-------|-------|
| `success` | Completed states, clocked-in, green check |
| `success/10` | Done-button tint background |
| `danger` | Errors, destructive actions, logout |
| `warning` | Upcoming / expiry warnings |

> [!caution] No hex values in components
> Use `text-brand`, `bg-brand`, `border-brand`, `text-ink`, `bg-surface-muted`, etc.

---

## Typography

| Role | Classes | Notes |
|------|---------|-------|
| Screen title (TopBar) | `text-base font-bold text-ink` | |
| Section heading | `text-lg font-bold text-ink` | |
| Card title | `text-sm font-bold text-ink` | |
| Body text | `text-sm text-ink` | |
| Meta / caption | `text-xs text-ink-muted` | |
| Badge label | `text-[11px] font-semibold` | |
| Stop action button | `text-xs font-bold uppercase tracking-wide` | |

---

## Spacing & Layout

| Token | Value | Usage |
|-------|-------|-------|
| `max-w-shell` | 440 px | Phone frame width — never exceed |
| Screen padding | `px-4` (16 px) | Horizontal page padding |
| Card gap | `space-y-3` or `space-y-4` | Between cards |
| Card inner | `p-4` | Card internal padding |
| `rounded-card` | alias for `rounded-xl` | All cards |

### Safe Area Utilities

| Class | Clears |
|-------|-------|
| `pt-safe-top` | TopBar (status bar height + bar height) |
| `pb-nav-bottom` | BottomNav pill |

---

## Shadow System

| Token | Usage |
|-------|-------|
| `shadow-card` | Cards (`shadow-sm`) |
| `shadow-nav` | Active pill-tab bubble |
| `shadow-inner` | PillTab track background |
| `shadow-md` | Bottom sheets |

---

## Shell Components

### AppShell (`components/shell/AppShell.tsx`)

```
┌──────────────────────────────┐  max-w-shell (440px), centered
│ TopBar  (translucent, blur)  │  position: absolute overlay
├──────────────────────────────┤
│ <main>  overflow-y-auto      │  h-dvh, padded with pt-safe-top + pb-nav-bottom
│   screen content             │
├──────────────────────────────┤
│ BottomNav (floating pill)    │  position: absolute, bg-surface/80 + blur
└──────────────────────────────┘
```

### TopBar (`components/shell/TopBar.tsx`)

| Route type | Layout |
|------------|--------|
| Tab route | Title left + 🔔 bell + 👤 account right |
| Detail route | ← back button left + centred title |

### BottomNav (`components/shell/BottomNav.tsx`)

Five tabs from `NAV_ITEMS` (`lib/constants.ts`):

| Tab | Icon | Route |
|-----|------|-------|
| Home | house | `/home` |
| Trips | route | `/trips` |
| Bulletin | megaphone | `/bulletin` |
| Schedule | calendar | `/calendar` |
| Chats | chat-bubble | `/chats` |

---

## Shared UI Components (`components/ui/`)

| Component | File | Purpose |
|-----------|------|---------|
| `Icon` | `Icon.tsx` | Unified SVG icon renderer |
| `BottomSheet` | `BottomSheet.tsx` | Slide-up modal, width-matched to shell |
| `StatusBadge` | `StatusBadge.tsx` | Coloured pill for trip/expense states |
| `PillTabs` | `PillTabs.tsx` | Rounded bubble tab bar (shared by Trips + Expenses) |
| `ScreenPlaceholder` | `ScreenPlaceholder.tsx` | Scaffold placeholder |
| Form fields | `form/` | Input, Select, Textarea |

### PillTabs (`components/ui/PillTabs.tsx`) — **New**

A rounded pill / bubble tab switcher. The active tab is a filled brand bubble with `shadow-nav`. Used by:
- **Trips** — Current / Upcoming / Previous
- **Expense Status** — Payroll Addition / Company Paid

```tsx
<PillTabs
  tabs={[
    { key: "current",  label: "Current",  icon: "truck" },
    { key: "upcoming", label: "Upcoming", icon: "calendar" },
    { key: "previous", label: "Previous", icon: "clock" },
  ]}
  active={tab}
  onChange={(key) => setTab(key as Tab)}
/>
```

Props:
```typescript
type PillTab = { key: string; label: string; icon?: string };
// tabs: PillTab[], active: string, onChange: (key: string) => void
```

Styling: `bg-surface-muted p-1 rounded-full shadow-inner` track; active = `bg-brand text-white shadow-nav`.

---

## Status Badge Colours

| Status | Colour | Text |
|--------|--------|------|
| `in-progress` / `active` | brand blue | In Progress |
| `upcoming` / `planned` | amber | Upcoming / IN Xd Xhr |
| `completed` | muted | Completed |
| `pending` | amber | Pending |
| `approved` | green | Approved |
| `rejected` | red | Rejected |

---

## Stop Action Buttons (`components/trips/StopActions.tsx`)

Status buttons for expanded stops — two states:

| State | Style |
|-------|-------|
| Active | `bg-brand text-white` — `text-xs font-bold uppercase tracking-wide` |
| Done | `bg-success/10 text-success` + check icon |

Stop workflow dialogs (all BottomSheets):
- **ConfirmTrailerDialog** — shows current trailer, Wrong / Correct / Skip
- **ValueDialog** — single input (odometer km, temperature)
- **SignatureDialog** — canvas draw-to-sign pad with Clear / Confirm / Skip
- **AddDocumentSheet** — Scan / Camera / Gallery / Files / Skip

---

## Account Drawer

- Slides from the **right** of the phone frame (not a route)
- `w-[85%]` max, `z-50`, full height
- Contains: avatar monogram · name · role · organisation · menu rows · Log Out

---

## 🔗 Related

[[00-home]] · [[01-design]] · [[04-architecture]] · [[02-screens]]
