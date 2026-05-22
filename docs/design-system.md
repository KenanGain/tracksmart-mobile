---
title: Design system
type: doc
tags: [design-system, tokens, tailwind]
---

# Design system

> Tokens are defined in `tailwind.config.ts` and `app/globals.css`. This note
> is the human-readable reference. The Flutter mirror ([[prompts/flutter]])
> maps each token to `ThemeData`.

## Colour tokens

| Token | Value | Use |
|-------|-------|-----|
| `brand` | `#1d4ed8` | Primary buttons, active nav, links |
| `brand-dark` | `#1e3a8a` | Pressed / hover |
| `brand-light` | `#dbeafe` | Tints, selected backgrounds |
| `success` | `#15803d` | Completed trips, delivered loads |
| `warning` | `#b45309` | Delays, attention states |
| `danger` | `#b91c1c` | Errors, cancelled, declined |
| `surface` | `#ffffff` | Cards, bars |
| `surface-muted` | `#f4f5f7` | App background, inset blocks |
| `backdrop` | `#cbd5e1` | Desktop canvas behind the phone frame (never seen on a real phone) |
| `ink` | `#0f172a` | Primary text |
| `ink-muted` | `#64748b` | Secondary text, captions |

## Status → colour mapping

| Trip / load state | Colour |
|-------------------|--------|
| Planned / Available | `ink-muted` |
| Active / Assigned / In transit | `brand` |
| Completed / Delivered | `success` |
| Delayed | `warning` |
| Cancelled / Declined | `danger` |

## Spacing & sizing

| Token | Value | Use |
|-------|-------|-----|
| `max-w-shell` | 440px | Width of the phone frame — iPhone 16 Pro Max (440×956 @3×) |
| `h-topbar` | 56px | TopBar height |
| `pt-safe-top` | `env(safe-area-inset-top)` | Notch inset (TopBar) |
| `pb-nav-bottom` | `calc(1rem + safe-area)` | Floating pill nav: 16px gap + home-indicator inset |
| `rounded-card` | 14px | Card corner radius |
| `rounded-full` | — | Floating pill nav shape |

Base spacing follows the Tailwind 4px scale (`p-1` = 4px … `p-4` = 16px).
Default screen padding: `px-4 py-4`.

## Typography

- Font: system sans (`--font-sans`).
- Screen title: `text-lg font-semibold`.
- Section title: `text-base font-semibold`.
- Body: `text-sm`.
- Caption / nav label: `text-xs` / `text-[11px]`.

## Elevation

| Token | Use |
|-------|-----|
| `shadow-card` | Cards |
| `shadow-nav` | BottomNav |

## Component conventions

- **Buttons** — primary: `bg-brand text-white rounded-lg`; min height 44px
  (touch target). One filled button per screen; the rest are secondary.
- **Cards** — `bg-surface rounded-card shadow-card p-4`.
- **Chips / badges** — small rounded labels coloured by the status mapping
  above.
- **Lists** — full-width rows, `divide-ink/5` dividers, the whole row is
  the tap target.
- **Icons** — `components/ui/Icon.tsx`, 24×24, 2px stroke (Lucide
  geometry); icon names are strings so the Flutter mirror can map them.
- **Translucent bars** — the TopBar and BottomNav use `bg-surface/80` +
  `backdrop-blur-md` and float over the scrolling content.
- **Form inputs** — filled grey (`bg-surface-muted`), `rounded-lg`,
  `focus:ring-2 focus:ring-brand/30`.

## Shared components (`components/ui/`)

| Component | Purpose |
|-----------|---------|
| `Icon` | Inline-SVG icon set (zero dependency, Lucide geometry) |
| `BottomSheet` | Modal sheet sliding up from the bottom, width-matched to the phone frame |
| `StatusBadge` | Pending / Approved / Rejected pill (expenses, trip sheets) |
| `form` | Shared form fields — `TextField`, `SelectField`, `DateField`, `TextAreaField`, `ToggleGroup`, `UploadField`, `SubmitButton` |
| `ScreenPlaceholder` | Scaffold-only body for not-yet-built screens |

## Rules

1. Never hard-code a colour — use a token. (The one exception is the
   Leaflet map: route / pin colours are passed to Leaflet as literal hex
   values that mirror the `brand` / `danger` tokens.)
2. Touch targets ≥ 44×44px.
3. Always respect safe areas on full-bleed bars.
4. One primary (filled) button per screen; everything else is secondary.

## Related

[[design]] · [[architecture]] · [[screens]] · [[prompts/flutter]]
