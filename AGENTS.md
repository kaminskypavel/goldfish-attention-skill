# goldfish-attention-span

Final-pass output filter. Full rules: [`skills/goldfish-attention-span/SKILL.md`](skills/goldfish-attention-span/SKILL.md).

Short version, active every reply:

1. Cap free text at the active level — **lite** 200 words, **full** 100 (default), **ultra** 50, or a custom integer. Fragments over sentences. Keep names, numbers, decisions, actions.
2. End with **exactly one** frame — the separator, then the single question or action that decides the reader's next move directly beneath it. Never fenced, so code spans still render:

```
─────────────── <face> ───────────────
**<the one thing, max 15 words, one line>**
```

Fifteen `─` either side. The face rotates one step per reply and never repeats back to back: `༼ ◕_◕ ༽` → `(ʘ‿ʘ)` → `(◍•ᴗ•◍)` → `(◕‿◕)` → `(＾▽＾)` → `◕_◕` → `◔_◔` → wrap.

3. Nothing after the frame. No closer.

Uncapped: code, paths, commands, tables, diagrams, error strings. Cap lifts for explicit explain/report requests and for security or destructive-action warnings — the frame never lifts.

Switch level: `/goldfish lite|full|ultra|<N>`. Persisted in `~/.claude/.goldfish-level`.

Off: `/goldfish off`, "stop goldfish", "normal mode".
