#!/bin/sh
# Only check in the repo: the level resolution in hooks/goldfish-activate.sh.
# Run: sh tests/activate.test.sh
set -eu

root=$(cd "$(dirname "$0")/.." && pwd)
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

run() { CLAUDE_PLUGIN_ROOT="$root" CLAUDE_CONFIG_DIR="$tmp" sh "$root/hooks/goldfish-activate.sh"; }
level() { run | sed -n 's/^ACTIVE LEVEL: //p'; }
set_level() { printf '%s' "$1" > "$tmp/.goldfish-level"; }
fail() { echo "FAIL: $1" >&2; exit 1; }

# no level file -> full, and no noise on stderr
[ "$(level)" = "full" ] || fail "missing file should default to full"
[ -z "$(run 2>&1 >/dev/null)" ] || fail "missing level file wrote to stderr"

for l in lite full ultra 50 250; do
  set_level "$l"
  [ "$(level)" = "$l" ] || fail "level '$l' not passed through"
done

# whitespace is trimmed
set_level "  ultra
"
[ "$(level)" = "ultra" ] || fail "whitespace not trimmed"

# junk falls back to full, never reaches the agent verbatim
for l in "" "sudo rm -rf /" "ULTRA" "12abc" "-5"; do
  set_level "$l"
  [ "$(level)" = "full" ] || fail "junk '$l' should fall back to full"
done

# off emits nothing at all
set_level off
[ -z "$(run)" ] || fail "off should emit nothing"

# the ruleset itself is emitted, not just the level line
set_level full
run | grep -q "ONE THING" || fail "ruleset missing from output"

# broken install exits 0 and stays quiet
[ -z "$(CLAUDE_PLUGIN_ROOT=/nope CLAUDE_CONFIG_DIR="$tmp" sh "$root/hooks/goldfish-activate.sh")" ] \
  || fail "missing SKILL.md should emit nothing"

# the two manifests are the plugin cache key — they must never drift apart
python3 - "$root" <<'PY' || fail "manifest versions drifted"
import json, pathlib, sys
root = pathlib.Path(sys.argv[1])
vers = {p: json.loads((root / p / "plugin.json").read_text())["version"]
        for p in (".claude-plugin", ".codex-plugin")}
assert len(set(vers.values())) == 1, vers
PY

echo "ok  $(basename "$0")"
