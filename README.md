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

Your agent answers in nine paragraphs. You read two. The thing you actually needed was in paragraph seven.

Goldfish is the last pass over every reply: **a word budget, then one framed line** — the single question or action that decides what you do next. Default budget is 100 words.

## Before / after

**Before:**

> I've gone ahead and updated the authentication middleware. The issue was that the token expiry check was using a strict less-than comparison, which meant tokens expiring exactly at the boundary were being rejected one second early. I changed it to less-than-or-equal. I also noticed the refresh logic could be cleaner, so let me know if you'd like me to look at that as well. The tests should pass now, but you may want to run them to confirm. Let me know if you need anything else!

**After:**

> Fixed `auth/middleware.ts:42` — expiry check used `<`, now `<=`. Refresh logic untouched.
>
> ```
>       /`·.¸
>      /¸...¸`:·
>  ¸.·´  ¸   `·.¸.·´)
> : © ):´;      ¸  {
>  `·.¸ `·  ¸.·´\`·¸)
>      `\\´´\¸.·´
> ```
>
> **Run `npm test -- auth` to confirm.**

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

## Levels

```bash
/goldfish lite     # 200 words — reviews, trade-offs, real reasoning
/goldfish          # 100 words — default
/goldfish ultra    #  50 words — verdict and next move only
/goldfish 250      # any positive integer
/goldfish off      # inert until you say goldfish again
```

Only the number moves — every other rule is identical at every level, and the frame never scales. The level persists in `~/.claude/.goldfish-level`, so it survives `/clear` and the next session.

## The two rules

**1. Cap.** The active level's word count of free text per reply. Fragments over sentences. Names, numbers, decisions and actions survive; explanation and repetition do not.

**2. Fish.** Exactly one, last thing in the reply, max 15 words under it:

````
```
      /`·.¸
     /¸...¸`:·
 ¸.·´  ¸   `·.¸.·´)
: © ):´;      ¸  {
 `·.¸ `·  ¸.·´\`·¸)
     `\\´´\¸.·´
```

**<the one thing>**
````

Picked by what changes your next move. A pending question beats a status. A blocker beats a win. Two fish is zero fish.

The art goes inside the fence so it stays aligned; the words go outside it so `code spans` and colour still render. Fish is copied character for character — never redrawn, resized or mirrored.

## What is never compressed

Code blocks, file paths, commands, tables, diagrams, error strings — written normally, in full.

The cap lifts when you ask for an explanation, walkthrough or report, and for security or destructive-action warnings. **The frame never lifts** — a long answer needs it more, not less.

Nothing written to disk is touched: files, commits, PRs, subagent prompts and tool arguments are all out of scope. This shapes chat only.

## Standalone, and stackable

Goldfish depends on nothing. Install it alone and it is the whole pipeline.

Run any other voice or structure mode alongside it and goldfish becomes the *last* pass: the other one drafts, goldfish caps the draft and frames it. Voice is inherited, never undone — a clipped, fragmented draft stays clipped, it just gets shorter. Where the rules disagree, goldfish wins: required sections get capped like anything else, and a next-action closer becomes the fish rather than sitting next to it.

Nothing to configure for this. There is no list of known modes and no ordering to declare — goldfish simply treats whatever reached it as the draft.

## Off

`/goldfish off`, `stop goldfish`, or `normal mode`.

## Tests

```bash
sh tests/activate.test.sh
```

Covers level resolution in the session-start hook: defaults, custom numbers, whitespace, junk rejection, `off`, and a broken install.

## License

MIT
