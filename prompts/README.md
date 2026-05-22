---
title: Prompts index
type: doc
tags: [prompt, index]
---

# Prompts

Per-agent implementation prompts for **TrackSmart Mobile**. Give the file
that matches the agent you are using.

| File | Use with | Root-file equivalent |
|------|----------|----------------------|
| [[shared-context]] | All agents (included by reference) | — |
| [[codex]] | OpenAI Codex / GPT | `AGENTS.md` |
| [[claude]] | Claude Code | `CLAUDE.md` |
| [[gemini]] | Gemini / Gemini CLI | `GEMINI.md` |
| [[flutter]] | Flutter build (Stage 2) — **living doc** | — |

## The one rule that ties them together

All three coding agents obey the **dual-output rule**: implementing a screen
in Next.js also updates its **Flutter mirror** in [[flutter]], in the same
change. That is what makes the eventual Next.js → Flutter transition cheap.

## Usage

1. Pick the agent. Paste its prompt file as the system/instruction prompt
   (or copy it to the matching root file: `AGENTS.md` / `CLAUDE.md` /
   `GEMINI.md`).
2. Give the implementation command (e.g. *"implement the trips list"*).
3. The agent reads [[shared-context]], implements the Next.js screen, and
   updates [[flutter]].

## Related

[[design]] · [[../README]] · [[../docs/roadmap]]
