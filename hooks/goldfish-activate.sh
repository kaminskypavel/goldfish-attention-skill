#!/bin/sh
# goldfish — SessionStart activation.
# Emits the ruleset, then the persisted cap level. No dependencies beyond POSIX sh.
set -u

root="${CLAUDE_PLUGIN_ROOT:-$(dirname "$0")/..}"
config="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"

level=""
[ -f "$config/.goldfish-level" ] &&
  level=$(tr -d ' \011\015\012' < "$config/.goldfish-level" 2>/dev/null)

# The level file is user-writable, and its contents reach the agent's context.
# Anything not an expected token or a bare integer falls back to the default.
case "$level" in
  lite|full|ultra|off) ;;
  ''|*[!0-9]*) level=full ;;
esac

[ "$level" = "off" ] && exit 0

cat "$root/skills/goldfish-attention-span/SKILL.md" 2>/dev/null || exit 0
printf '\nACTIVE LEVEL: %s\n' "$level"
