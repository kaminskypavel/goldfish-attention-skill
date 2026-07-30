<h1 align="center">🐠 Goldfish Attention Span</h1>

<p align="center"><em>You read the first line. Then the frame. That was the whole reply.</em></p>

---

Your agent answers in nine paragraphs. You read two. The thing you actually needed was in paragraph seven.

Goldfish is the last pass over every reply: **100 words of free text, then one framed line** — the single question or action that decides what you do next.

## Before / after

**Before:**

> I've gone ahead and updated the authentication middleware. The issue was that the token expiry check was using a strict less-than comparison, which meant tokens expiring exactly at the boundary were being rejected one second early. I changed it to less-than-or-equal. I also noticed the refresh logic could be cleaner, so let me know if you'd like me to look at that as well. The tests should pass now, but you may want to run them to confirm. Let me know if you need anything else!

**After:**

> Fixed `auth/middleware.ts:42` — expiry check used `<`, now `<=`. Refresh logic untouched.
>
> ```
> ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
> ▶  Run `npm test -- auth` to confirm.
> ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
> ```

## Install

**Claude Code**

```bash
claude plugin marketplace add kaminskypavel/goldfish-attention-skill
claude plugin install goldfish-attention-span@goldfish-attention-span
```

**Codex**

```bash
codex plugin marketplace add kaminskypavel/goldfish-attention-skill --ref main
codex plugin add goldfish-attention-span@goldfish-attention-span
```

Active from the next session start. No config, no dependencies, no Node.

**Any other agent** — copy [`skills/goldfish-attention-span/SKILL.md`](skills/goldfish-attention-span/SKILL.md) into your rules file (`AGENTS.md`, `.cursor/rules/`, `.windsurf/rules/`, `CLAUDE.md`, …). It is one self-contained markdown file with no moving parts.

## The two rules

**1. Cap.** 100 words of free text per reply. Fragments over sentences. Names, numbers, decisions and actions survive; explanation and repetition do not.

**2. Frame.** Exactly one block, last thing in the reply, max 15 words:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
▶  <the one thing>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Picked by what changes your next move. A pending question beats a status. A blocker beats a win. Two frames is zero frames.

## What is never compressed

Code blocks, file paths, commands, tables, diagrams, error strings — written normally, in full.

The cap lifts when you ask for an explanation, walkthrough or report, and for security or destructive-action warnings. **The frame never lifts** — a long answer needs it more, not less.

Nothing written to disk is touched: files, commits, PRs, subagent prompts and tool arguments are all out of scope. This shapes chat only.

## Stacking

Goldfish is a *final* pass. It composes with voice/structure modes and wins every conflict with them:

1. [caveman](https://github.com/JuliusBrussee/caveman) — strips fluff, sets the voice
2. [i-have-adhd](https://github.com/ayghri/i-have-adhd) — action-first, numbered steps
3. **goldfish-attention-span** — compress to the cap, then frame the one thing

If an earlier mode wants a state line, an estimate and a closer, and they don't fit in 100 words, goldfish keeps the one that changes what you do next. Its next-action closer becomes the frame — never both.

Works fine alone.

## Off

Say `stop goldfish` or `normal mode`.

## License

MIT
