# goldfish — SessionStart activation (Windows).
# Mirror of goldfish-activate.sh. Keep both in step.

$root = $env:CLAUDE_PLUGIN_ROOT
if (-not $root) { $root = Join-Path $PSScriptRoot '..' }

$config = $env:CLAUDE_CONFIG_DIR
if (-not $config) { $config = Join-Path $env:USERPROFILE '.claude' }

$level = ''
try {
  $raw = Get-Content (Join-Path $config '.goldfish-level') -Raw -ErrorAction Stop
  $level = ($raw -replace '\s', '')
} catch { $level = '' }

# The level file is user-writable, and its contents reach the agent's context.
# Anything not an expected token or a bare integer falls back to the default.
if ($level -notmatch '^(lite|full|ultra|off|[0-9]+)$') { $level = 'full' }

if ($level -eq 'off') { exit 0 }

$skill = Join-Path $root 'skills/goldfish-attention-span/SKILL.md'
if (-not (Test-Path $skill)) { exit 0 }
Get-Content $skill -Raw
"`nACTIVE LEVEL: $level"
