---
title: Shared Agent Context
type: prompt
tags: [prompt, shared, rules, agents]
updated: 2026-05-22
---

# 📋 Shared Agent Context — TrackSmart Mobile

> [!important] Every agent reads this first
> This is the **single source of truth** for what to build and how to build it. Per-agent notes ([[agents/02-claude]], [[agents/03-codex]], [[agents/04-gemini]]) only tune *how* that agent works — not *what* it builds.

---

## 1. Project Definition

**TrackSmart Mobile** — the mobile-only frontend view of the TrackSmart fleet-operations platform.

- **Roles served:** business · driver · carrier (current build is driver-focused)
- **Companion to:** existing TrackSmart web application (same backend API)
- **Build 1:** Next.js 15 (App Router) · TypeScript · Tailwind CSS (this repo)
- **Build 2:** Flutter native app, screen-for-screen (planned)
- **`APP_NAME`** in `lib/constants.ts` = `"TrackSmart"`

**Required reading before writing code:**
→ [[01-design]] · [[04-architecture]] · [[02-screens]] · [[03-design-system]] · [[05-data-model]] · [[06-roadmap]]

---

## 2. The Seven Golden Rules

> [!caution] These rules are hard constraints — never break them

1. **📱 Mobile-only.** All UI lives inside the `max-w-shell` (440px) frame. Never design a desktop/tablet layout.

2. **🚫 Don't touch the chrome from screens.** `AppShell` / `TopBar` / `BottomNav` own the frame. Screens render `<main>` content **only**.

3. **🎨 Use design tokens.** Colours, spacing, radii come from `tailwind.config.ts` (see [[03-design-system]]). **Never hard-code a hex value.**

4. **🚫 No direct `fetch` in screens.** Data flows through `lib/api/*` over `lib/data/*`. Screens never import from `lib/data` directly.

5. **⚡ Server Components by default.** Add `"use client"` only for: navigation hooks, forms, stateful widgets (toggles, sheets), the Leaflet map.

6. **📊 Every screen has 3 states:** loading · empty · error.

7. **🗺️ Stay on the roadmap.** Implement what [[06-roadmap]] / the user's command asks for — nothing more.

---

## 3. ⚑ The Dual-Output Rule (Most Important)

> [!important] Non-negotiable
> When you implement or change a screen/feature in Next.js, you **must**, in the **same change**, add or update its **Flutter mirror spec** in [[agents/05-flutter-mirror]].

For each screen, add/update a section in `prompts/flutter.md` containing:
- Route mapping (Next.js route → `go_router` path)
- Widget tree sketch (which Flutter widgets mirror the React components)
- State/data notes (which `Repository` + provider it needs)
- Token/styling notes (Tailwind classes → `ThemeData`)
- Any behaviour the Flutter build must replicate

**A change that updates Next.js code but not `prompts/flutter.md` is incomplete.**

---

## 4. How to Take a Command

When the user gives an implementation command (e.g. *"build the trips list"*):

```
1. LOCATE  → Find it in [[02-screens]] and [[06-roadmap]]
             If not there, ask before inventing scope.

2. PLAN    → List the files you will add/change
             (Next.js files + flutter mirror section)

3. IMPLEMENT → Write the Next.js version following the 7 golden rules

4. MIRROR  → Update [[agents/05-flutter-mirror]] (dual-output rule)

5. VERIFY  → Run the Definition of Done checklist

6. REPORT  → What changed in Next.js code + what changed in flutter.md
```

---

## 5. Definition of Done

A task is done **only** when all of these hold:

- [ ] Code follows the 7 golden rules
- [ ] `npm run lint` passes (zero errors)
- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds
- [ ] Screen renders inside the mobile shell with loading/empty/error states
- [ ] `prompts/flutter.md` has a matching, up-to-date mirror section
- [ ] [[02-screens]] and [[06-roadmap]] status updated if a milestone advanced

---

## 6. Code Conventions

```typescript
// TypeScript: strict, no 'any'
// Components: PascalCase, one per file in components/
// Routes: lower-case folders under app/
// Imports: lib/api/* only (never lib/data/* in screens)
// Comments: explain WHY, not WHAT
// Style: match existing files (read them before editing)
```

### File-naming pattern
```
components/<feature>/ComponentName.tsx    ← client or server component
app/(app)/<route>/page.tsx               ← server component by default
lib/api/<resource>.ts                    ← service layer
lib/data/<resource>.ts                   ← mock backend
```

### "use client" checklist
Only add `"use client"` if the component uses:
- `usePathname`, `useRouter`, `useSearchParams`
- `useState`, `useEffect`, `useRef`
- Event handlers (onClick, onChange, onSubmit)
- `next/dynamic` (for the Leaflet map)

---

## 7. File Reference Quick-Map

| What you need | Where it is |
|---------------|-------------|
| App-wide constants | `lib/constants.ts` |
| Date helpers | `lib/format.ts` |
| Mock data | `lib/data/<resource>.ts` |
| Service calls | `lib/api/<resource>.ts` |
| Shell components | `components/shell/` |
| Shared UI | `components/ui/` |
| Design tokens | `tailwind.config.ts` |
| Global styles | `app/globals.css` |

---

## 🔗 Related

[[agents/00-agents-home]] · [[agents/02-claude]] · [[agents/03-codex]] · [[agents/04-gemini]] · [[agents/05-flutter-mirror]]
