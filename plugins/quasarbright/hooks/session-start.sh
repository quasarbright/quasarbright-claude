#!/usr/bin/env bash
# Prints the given plugin files (paths relative to the plugin root). Claude Code adds SessionStart
# output to the session context, but only up to about 10,000 characters per hook before it swaps
# the output for a short preview plus a file, so hooks.json splits the files across several hooks.
root="${CLAUDE_PLUGIN_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"
for rel in "$@"; do
  f="$root/$rel"
  [ -f "$f" ] || continue
  printf '\n<!-- quasarbright plugin: %s (full path %s) -->\n' "$rel" "$f"
  cat "$f"
done
