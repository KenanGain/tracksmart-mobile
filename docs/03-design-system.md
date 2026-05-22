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

All colours live in `tailwind.config.ts` under `theme.extend.colors`. They consume CSS variables (RGB channels) defined in `app/globals.css` (`:root` for light mode, `.dark` for dark mode) via `rgb(var(--token) / <alpha-value>)`. Opacity utilities (such as `bg-brand/10` or `border-ink/15`) continue to work seamlessly.

### Light vs Dark Mappings

| Token | Tailwind Name | Light Mode Value | Dark Mode Value | Usage |
|-------|---------------|------------------|-----------------|-------|
| `brand` | `brand` | `29 78 216` (`#1d4ed8`) | `59 130 246` (`#3b82f6`) | Primary buttons, active nav indicators, accent icons |
| `brand-dark` | `brand-dark` | `30 58 138` (`#1e3a8a`) | `37 99 235` (`#2563eb`) | High-contrast brand headers/borders |
| `brand-light` | `brand-light` | `219 234 254` (`#dbeafe`) | `30 41 84` (`#1e2954`) | Tinted alert chips, trip-id badges, light brand backgrounds |
| `success` | `success` | `21 128 61` (`#15803d`) | `34 197 94` (`#22c55e`) | Completed states, clocked-in timer, success indicators |
| `warning` | `warning` | `180 83 9` (`#b45309`) | `245 158 11` (`#f59e0b`) | Upcoming / warning states, load tenders |
| `danger` | `danger` | `185 28 28` (`#b91c1c`) | `248 113 113` (`#f87171`) | Errors, destructive actions, logout buttons |
| `surface` | `surface` | `255 255 255` (`#ffffff`) | `24 24 27` (`#18181b`) | Card backgrounds, inputs, TopBar & BottomNav floating bars |
| `surface-muted`| `surface-muted`| `244 245 247` (`#f4f5f7`) | `9 9 11` (`#09090b`) | Main screen backgrounds, PillTab track backgrounds |
| `backdrop` | `backdrop` | `203 213 225` (`#cbd5e1`) | `63 63 70` (`#3f3f46`) | Desktop preview canvas surrounding the mobile shell |
| `ink` | `ink` | `15 23 42` (`#0f172a`) | `250 250 250` (`#fafafa`) | Primary text, active icons |
| `ink-muted` | `ink-muted` | `100 116 139` (`#64748b`)| `161 161 170` (`#a1a1aa`)| Secondary text, placeholder text, inactive nav icons |

### Border Tokens (Opacity Aliases)

Borders should always use opacity variants of `ink` to look balanced in both themes:
- `border-ink/5` for hairline separators
- `border-ink/10` for card outlines and subtle dividers
- `border-ink/15` for input borders and card dividers

> [!caution] No hardcoded hex/RGB values in components
> Use classes like `text-brand`, `bg-brand-light`, `text-ink-muted`, `bg-surface`, `bg-surface-muted`, etc. These will automatically toggle styling when dark mode is active.

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

### ThemeToggle (`components/shell/ThemeToggle.tsx`)

A sun/moon icon button rendered in the header or TopBar (specifically inside the `TopBar` for the tabs, and in the `SignInForm`). 
- **Behavior:** Toggles the `.dark` class on the `<html>` element.
- **Persistence:** Choices are saved in local storage under the `theme` key (`'light'` or `'dark'`).
- **No-Flash:** Reacts instantly on the client, synced with a blocking inline script in `RootLayout` (`app/layout.tsx`) that reads from local storage prior to first paint.

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
