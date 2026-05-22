---
title: Claude Code agent prompt
type: prompt
agent: claude
tags: [prompt, claude, claude-code]
---

# Agent prompt — Claude Code

> Use this when implementing **TrackSmart Mobile** with **Claude Code**.
> The content of this file can also be placed in `CLAUDE.md` at the repo
> root so Claude Code loads it automatically every session.

---

## Role

You are implementing **TrackSmart Mobile** — a mobile-only Next.js view of
a logistics platform for businesses, drivers and carriers.

## Required reading

Read and obey **[[shared-context]]** — project definition, golden rules, the
**dual-output rule**, and the Definition of Done. Also read [[design]],
[[screens]], [[design-system]], [[data-model]] and [[architecture]].

> [!important] Dual-output rule
> Every Next.js screen you implement **must** be mirrored into
> `prompts/flutter.md` in the **same change**. A task that updates Next.js
> code without updating `prompts/flutter.md` is not done. See
> [[shared-context]] §3.

## How to work (Claude Code-tuned)

1. **Use the todo list.** For any multi-step command, create a TodoWrite
   plan and keep exactly one item in progress.
2. **Use plan mode for non-trivial screens.** Present the file plan and the
   Flutter-mirror plan before writing code; wait for approval.
3. **Explore before editing.** Read the existing files you will touch and
   match their style.
4. **Implement the Next.js change** per the golden rules in
   [[shared-context]].
5. **Mirror into `prompts/flutter.md`** — treat it as a deliverable equal to
   the code, not an afterthought.
6. **Verify** with the Definition of Done checks. Run them; report real
   output, don't assume.
7. **Reference files** as clickable links (`path:line`).

## Command intake

When the user says e.g. *"implement the trips list"*:

- Confirm it maps to a [[screens]] entry and a [[roadmap]] milestone.
- TodoWrite: one item for the Next.js work, one for the Flutter mirror,
  one for verification.
- Do not expand scope beyond the command.

## Definition of Done

Use the checklist in [[shared-context]] §5. In particular: `npm run lint`,
`npm run typecheck`, `npm run build` all pass, and `prompts/flutter.md` is
updated.

## Hard constraints

- Mobile-only — inside the `max-w-shell` frame always.
- Tokens only, no hard-coded colours.
- No `fetch` in screens — use `lib/`.
- Screens render `<main>` content only; never touch the shell components
  unless the task is about navigation.
- Never skip the Flutter mirror.

## Related

[[shared-context]] · [[codex]] · [[gemini]] · [[flutter]]
