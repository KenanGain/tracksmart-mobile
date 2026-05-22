---
title: Agents — Home
type: moc
tags: [agents, prompts, ai, moc]
updated: 2026-05-22
---

# 🤖 AI Agents — Overview

> [!abstract] Purpose
> TrackSmart Mobile is built with AI coding agents. This folder contains the prompts and rules each agent must follow to implement screens correctly.

---

## Agent Notes

| Note | Agent | Purpose |
|------|-------|---------|
| [[agents/01-shared-context]] | All agents | Rules, golden constraints, dual-output rule |
| [[agents/02-claude]] | Claude Code | Tuned prompt for Claude Code |
| [[agents/03-codex]] | OpenAI Codex/GPT | Tuned prompt for Codex |
| [[agents/04-gemini]] | Google Gemini | Tuned prompt for Gemini |
| [[agents/05-flutter-mirror]] | Flutter build | Living Flutter spec (dual-output) |

---

## How to Use an Agent

1. **Pick the right prompt** for your agent from the table above
2. **Read [[agents/01-shared-context]]** — it contains the rules every agent must obey
3. **Give the agent an implementation command** e.g. *"implement the load detail screen"*
4. **The agent must**: locate it in [[02-screens]], implement Next.js, mirror to [[agents/05-flutter-mirror]], verify

---

## The Dual-Output Rule

> [!important] Most Critical Rule
> Every time a screen is implemented in Next.js, its **Flutter mirror spec must be updated in [[agents/05-flutter-mirror]] in the same change**.
>
> A task that updates Next.js code without updating the Flutter mirror is **incomplete**.

---

## Agent Workflow

```
User command: "implement screen X"
        ↓
Agent reads: [[agents/01-shared-context]] + [[01-design]] + [[02-screens]]
        ↓
Agent plans: files to add/change (Next.js + Flutter mirror)
        ↓
Agent implements: Next.js screen following golden rules
        ↓
Agent mirrors: updates [[agents/05-flutter-mirror]] with Flutter spec
        ↓
Agent verifies: npm run lint ✓ · typecheck ✓ · build ✓
        ↓
Agent reports: what changed in code + flutter mirror
```

---

## 🔗 Related

[[00-home]] · [[01-design]] · [[02-screens]] · [[06-roadmap]]
