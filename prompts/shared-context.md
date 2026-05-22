---
title: Shared agent context
type: prompt
tags: [prompt, shared]
---

# Shared agent context — TrackSmart Mobile

> **Every agent prompt** ([[codex]], [[claude]], [[gemini]]) includes this
> file by reference. It is the single source of truth for *what* to build.
> The per-agent files only tune *how* that agent should work.

## 1. Project

**TrackSmart Mobile** — the mobile-only frontend view of the TrackSmart
fleet-operations platform. It serves three roles: **business**, **driver**,
**carrier** (the current build is driver-focused). It is a companion to an
existing web application and is designed to talk to the same backend API.
`APP_NAME` in `lib/constants.ts` is "TrackSmart".

- Build target now: **Next.js 15** (App Router, TypeScript, Tailwind CSS).
- Build target later: **Flutter** (native), screen-for-screen.
- Read [[design]] first, then [[architecture]], [[screens]],
  [[design-system]], [[data-model]], [[roadmap]].

## 2. Golden rules

1. **Mobile-only.** All UI lives inside the `max-w-shell` (440px, iPhone
   16 Pro Max) frame.
   Never design a desktop/tablet layout.
2. **Don't touch the chrome from screens.** `AppShell` / `TopBar` /
   `BottomNav` own the frame. Screens render `<main>` content only.
3. **Use design tokens.** Colours, spacing, radii come from
   `tailwind.config.ts` mapping to adaptive CSS variables. **Never hard-code a hex value or use raw/absolute color classes (like `bg-white`, `text-black`, `bg-gray-100`) in components.** Instead, use semantic tokens (e.g., `bg-surface`, `bg-surface-muted`, `text-ink`, `text-ink-muted`, `border-border`) so that components automatically support both light and dark modes (see [[design-system]]).
4. **No direct `fetch` in screens.** Data goes through `lib/api/*` (the
   service layer) over `lib/data/*` (the mock backend) — typed against
   [[data-model]]. Screens never import from `lib/data` directly.
5. **Server Components by default.** Add `"use client"` only for real
   interactivity.
6. **Every screen has 3 states:** loading, empty, error.
7. **Stay on the roadmap.** Implement what [[roadmap]] / the user's command
   asks for — nothing more.

## 3. ⚑ The dual-output rule (most important)

> When you implement or change a screen/feature in Next.js, you **must**, in
> the **same change**, add or update its **Flutter mirror spec** in
> [[flutter]].

For each screen you implement, append/update a section in `prompts/flutter.md`
containing:

- Route mapping (Next.js route → `go_router` path).
- Widget tree sketch (which Flutter widgets mirror the React components).
- State/data notes (which `Repository` + provider it needs).
- Token/styling notes (Tailwind classes → `ThemeData`).
- Any behaviour the Flutter build must replicate.

A change that updates Next.js code but not `prompts/flutter.md` is **incomplete**.

## 4. How to take a command from the user

When the user gives an implementation command (e.g. "build the trips list"):

1. **Locate it** in [[screens]] and [[roadmap]]. If it is not there, ask
   before inventing scope.
2. **Plan** the files you will add/change.
3. **Implement** the Next.js version following the golden rules.
4. **Mirror** it into [[flutter]] (dual-output rule).
5. **Verify** (see Definition of Done).
6. **Report** what changed in both the Next.js code and `prompts/flutter.md`.

## 5. Definition of Done

A task is done only when **all** of these hold:

- [ ] Code follows the golden rules above.
- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` succeeds.
- [ ] The screen renders inside the mobile shell with loading/empty/error
      states.
- [ ] `prompts/flutter.md` has a matching, up-to-date mirror section.
- [ ] [[screens]] / [[roadmap]] status updated if a milestone advanced.

## 6. Conventions

- TypeScript strict; no `any`.
- Components: `PascalCase` files in `components/`; one component per file.
- Routes: lower-case folders under `app/`.
- Keep client components small and leaf-level.
- Comments explain *why*, not *what*.
- Match the style of existing files.

## Related

[[design]] · [[architecture]] · [[screens]] · [[design-system]] ·
[[data-model]] · [[roadmap]] · [[flutter]]
