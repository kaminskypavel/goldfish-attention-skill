---
description: Switch goldfish cap level (lite 200 / full 100 / ultra 50 / custom N / off)
argument-hint: "[lite|full|ultra|<N>|off]"
---

Set goldfish level to `$ARGUMENTS`. No argument means `full`.

Resolve the cap: `lite` = 200 words, `full` = 100, `ultra` = 50, a bare positive integer = that many words, `off` = goldfish inert until re-enabled. Anything else = `full`.

Persist it: write the bare token to `$CLAUDE_CONFIG_DIR/.goldfish-level` (default `~/.claude/.goldfish-level`), no newline needed, so the next session starts at this level.

Then confirm in one line, already obeying the new cap, and end with the ONE THING frame. Full rules: the `goldfish-attention-span` skill.
