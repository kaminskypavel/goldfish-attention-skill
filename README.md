<p align="center">
  <img src="assets/logo.png" width="260" alt="Goldfish Attention Span">
</p>

<p align="center"><em>You read the first line. Then the fish. That was the whole reply.</em></p>

<p align="center">
  <img src="https://img.shields.io/badge/works%20with-Claude%20Code%20%C2%B7%20Codex-FA6800?style=flat-square" alt="Works with Claude Code and Codex">
  <img src="https://img.shields.io/badge/dependencies-none-FA6800?style=flat-square" alt="No dependencies">
  <img src="https://img.shields.io/badge/license-MIT-FA6800?style=flat-square" alt="MIT license">
</p>

---

Nine paragraphs. You read two. What you needed was in paragraph seven.

Goldfish is the last pass over every reply: **a word budget, then one fish.** Under the fish, the single thing that decides your next move.

## Before / after

> I've gone ahead and updated the authentication middleware. The issue was that the token expiry check was using a strict less-than comparison, which meant tokens expiring exactly at the boundary were being rejected one second early. I changed it to less-than-or-equal. I also noticed the refresh logic could be cleaner, so let me know if you'd like me to look at that as well. The tests should pass now, but you may want to run them to confirm. Let me know if you need anything else!

> Fixed `auth/middleware.ts:42` — expiry check used `<`, now `<=`. Refresh logic untouched.
>
> ─────────────── ༼ ◕_◕ ༽ ───────────────
> **Run `npm test -- auth` to confirm.**

## Install

```bash
claude plugin marketplace add kaminskypavel/goldfish-attention-skill
claude plugin install goldfish-attention-span@goldfish-attention-span
```

```bash
codex plugin marketplace add kaminskypavel/goldfish-attention-skill --ref main
codex plugin add goldfish-attention-span@goldfish-attention-span
```

Active next session. No config, no dependencies, no Node. Any other agent: drop [`SKILL.md`](skills/goldfish-attention-span/SKILL.md) into its rules file — one file, no moving parts.

## Levels

```bash
/goldfish lite     # 200 words — reviews, trade-offs, real reasoning
/goldfish          # 100 words — default
/goldfish ultra    #  50 words — verdict and next move only
/goldfish 250      # any positive integer
/goldfish off
```

Only the number moves. Persists in `~/.claude/.goldfish-level`, so it survives `/clear`.

## Rules

**Cap** — free text only. Code, paths, commands, tables and error strings are never touched.

**Frame** — exactly one, last thing in the reply, max 15 words directly under the separator. The face rotates each reply and never repeats back to back:

```
─────────────── ༼ ◕_◕ ༽ ───────────────
─────────────── (ʘ‿ʘ) ───────────────
─────────────── (◍•ᴗ•◍) ───────────────
─────────────── (◕‿◕) ───────────────
─────────────── (＾▽＾) ───────────────
─────────────── ◕_◕ ───────────────
─────────────── ◔_◔ ───────────────
```

Never fenced in real output, so `code spans` and colour still render beneath it. Stays narrow so it survives a split pane.

Picked by what changes your next move: a pending question beats a status, a blocker beats a win. Two frames is zero frames.

The cap lifts when you ask for an explanation or a report, and for security and destructive-action warnings. The frame never lifts.

Chat only. Files, commits, PRs and tool arguments are untouched.

Stacks under any other voice or structure mode — that one drafts, goldfish caps and frames. Voice is inherited, never undone. Nothing to configure.

## Off

`/goldfish off`, `stop goldfish`, or `normal mode`.

---

`sh tests/activate.test.sh` · MIT
