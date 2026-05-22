---
title: Design System
type: doc
tags: [design-system, tokens, components, styling]
updated: 2026-05-22
---

# 🎨 Design System — TrackSmart Mobile

> [!abstract] Purpose
> The single reference for all design tokens, components and conventions used in the app. **Never hard-code a colour or spacing value** — always use a token from this system.

---

## Colour Tokens

All colours are defined in `tailwind.config.ts` under `theme.extend.colors`.

### Brand

| Token | Value | Usage |
|-------|-------|-------|
| `brand` / `brand-600` | `#1d4ed8` | Primary actions, active nav, accents |
| `brand-50` | `#eff6ff` | Brand tint backgrounds |
| `brand-100` | `#dbeafe` | Light brand fills |
| `brand-700` | `#1e40af` | Pressed / darker brand |

### Surfaces

| Token | Value | Usage |
|-------|-------|-------|
| `surface` | `#ffffff` | Card backgrounds |
| `surface-muted` | `#f8fafc` | Page / screen background |
| `border` | `#e2e8f0` | Dividers, card borders |

### Semantic

| Token | Colour | Usage |
|-------|--------|-------|
| `success` | green | Completed states, clocked-in timer, all-clear |
| `warning` | amber | Upcoming / in-progress, expiry warnings |
| `danger` | red | Error states, destructive actions, logout |
| `muted-fg` | slate-400 | Placeholder text, secondary labels |

> [!caution] No hard-coded hex values
> Never write `#1d4ed8` in a component. Always use `text-brand`, `bg-brand`, `border-brand`, etc.

---

## Typography

| Role | Class | Weight | Size |
|------|-------|--------|------|
| Screen title (TopBar) | `text-base font-semibold` | 600 | 16px |
| Section heading | `text-lg font-bold` | 700 | 18px |
| Card title | `text-base font-semibold` | 600 | 16px |
| Body text | `text-sm` | 400 | 14px |
| Caption / meta | `text-xs text-muted-fg` | 400 | 12px |
| Status badge | `text-xs font-medium` | 500 | 12px |

Font stack: system-ui, -apple-system, sans-serif.

---

## Spacing & Layout

| Token | Value | Usage |
|-------|-------|-------|
| `max-w-shell` | 440px | Phone frame width (iPhone 16 Pro Max) |
| Screen padding | `px-4` (16px) | Horizontal page padding |
| Card gap | `space-y-3` (12px) | Vertical spacing between cards |
| Card padding | `p-4` (16px) | Internal card padding |

### Safe Area Classes

| Class | Description |
|-------|-------------|
| `pt-safe-top` | Clears the TopBar (status bar + bar height) |
| `pb-nav-bottom` | Clears the BottomNav pill |

---

## Border Radius

| Token | Value | Used on |
|-------|-------|---------|
| `rounded-xl` | 12px | Cards |
| `rounded-2xl` | 16px | Bottom sheets |
| `rounded-full` | 9999px | Pills, badges, avatars |
| `rounded-lg` | 8px | Buttons, inputs |

---

## Shadows

| Token | Usage |
|-------|-------|
| `shadow-sm` | Cards (subtle lift) |
| `shadow-md` | Bottom sheet |
| `shadow-lg` | TopBar / BottomNav (translucent overlay) |

---

## Shell Components

### AppShell (`components/shell/AppShell.tsx`)

The phone frame. Wraps all `(app)/` route group screens.

```
┌─────────────────────────┐  max-w-shell (440px), centered
│ TopBar   (translucent)  │  absolute overlay, bg-surface/80 + blur
│─────────────────────────│
│ <main>   scrollable     │  overflow-y-auto, h-dvh, pad top+bottom
│   screen content        │
│─────────────────────────│
│ BottomNav (floating)    │  absolute, bg-surface/80 + blur, pill
└─────────────────────────┘
```

### TopBar (`components/shell/TopBar.tsx`)

Two modes, derived from the current route:

| Route type | Content |
|------------|---------|
| Tab route | Section title (left) + 🔔 bell + 👤 account icon (right) |
| Detail route | ← back button (left) + centred title |

### BottomNav (`components/shell/BottomNav.tsx`)

Five tabs from `NAV_ITEMS` in `lib/constants.ts`:

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
| `Icon` | `Icon.tsx` | Unified icon renderer (SVG inline icons) |
| `BottomSheet` | `BottomSheet.tsx` | Slide-up modal — width-matched to phone frame |
| `StatusBadge` | `StatusBadge.tsx` | Coloured pill for trip/load states |
| `ScreenPlaceholder` | `ScreenPlaceholder.tsx` | Scaffold placeholder with "Planned for this screen" list |
| Form fields | `form/` | Input, Select, Textarea with consistent styling |

---

## Status Badge Colours

| Status | Badge colour | Text |
|--------|-------------|------|
| `in-progress` | brand blue | In Progress |
| `upcoming` | amber | IN Xd Xhr |
| `completed` | muted | Completed |
| `pending` | amber | Pending |
| `approved` | green | Approved |
| `rejected` | red | Rejected |

---

## Account Drawer

- Slides in from the **right** of the phone frame (not a full-screen route)
- `z-50`, full-height, `w-[85%]` max
- Contains: avatar monogram · name · role · organisation · menu rows · Log Out

---

## Dark Mode

Theme toggle is in Settings (`/account/settings`). Options:
- **System** — follows OS preference
- **Light** — always light
- **Dark** — always dark (planned; tokens support it)

---

## 🔗 Related

[[00-home]] · [[01-design]] · [[04-architecture]]
