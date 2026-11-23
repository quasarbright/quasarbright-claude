---
name: update-plugin
description: Change Mike's quasarbright plugin itself (its skills, docs, steering, push policy or hooks), publish the change, reinstall it locally and tell every other running session and project thread. Use whenever a quasarbright skill or doc needs editing, including on your own initiative after Mike corrects something a skill covers.
---

# Updating the quasarbright plugin

The plugin lives in **github.com/quasarbright/quasarbright-claude** (branch `master`). GitHub is
the single source of truth. Every installed copy (laptop, cloud sessions) is a cache of it.

## Where to edit

- On Mike's laptop: `~/GitHub/quasarbright-claude`. Run `git pull` before editing.
- In a cloud session: the repo is attached to the project; clone it if it isn't in the session.
- Never edit `~/.claude/plugins/cache/...`. An update overwrites it.

Layout: `plugins/quasarbright/` holds `skills/<name>/SKILL.md`, `docs/`, `steering/` and
`.claude-plugin/plugin.json`. `hooks/hooks.json` injects `steering/*` plus `docs/CLAUDE.md`,
`TASTE.md`, `WORKING.md` and `PROJECTS.md` at every session start; the other docs (`DESIGN.md`,
`UX-CHECKLIST.md`, `TASTE-EXAMPLES.md` and the area lessons docs `ART.md`, `GAME-DESIGN.md`,
`WRITING.md`) load on demand. The taste examples themselves (screenshots of his verdicts) live in a
private artifact, not this public repo, so saving one needs no publish (`TASTE-EXAMPLES.md`). Each hook's output must stay under about
10,000 characters, or Claude Code shows only a 2KB preview and saves the rest to a file. When a file
grows or a new always-on file is added, put it in its own hook entry and check with `wc -c`.

## Publish

1. Make the edit. Skills and docs are general: they apply to all of Mike's projects, so write
   the general process or lesson and leave out the project it came from (its names, assets and
   one-off problems). Project specifics go in memory. (Mike, 2026-11-22: the new image-gen skill
   was full of werewolf-game details.)
   Keep paths relative to the skill (`../../docs/TASTE.md`), never `/Users/...`.
   Never write a dollar sign directly followed by a digit in a SKILL.md, including this sentence's
   own examples. When a skill is invoked with arguments, dollar-digit is replaced by an argument
   word, so a price of five cents comes out as "an.05". Write amounts as `0.05 USD`.
2. Bump `version` in `plugins/quasarbright/.claude-plugin/plugin.json` (patch for wording, minor for
   a new skill). Installed copies are cached by version, so without a bump an update may not
   pick up the change.
3. `claude plugin validate .` from the repo root; fix any error.
4. Commit with a message naming what changed and why, and push to `master` directly. No PR.
   This repo is Mike's own config, so no approval is needed.

## Reinstall where you are

```bash
claude plugin marketplace update quasarbright-claude
claude plugin update quasarbright@quasarbright-claude
```

On Mike's laptop these commands do nothing: the plugin isn't installed through the CLI there. The
desktop app syncs it from his claude.ai account, which never re-reads GitHub by itself. After
pushing, tell Mike to refresh the quasarbright-claude marketplace in claude.ai's plugin settings,
then run `/reload-plugins`.

A running session keeps the skill list it started with. To use the new version right away, read
the changed SKILL.md from the repo; new skills and steering load fully in the next session.

## Tell the other sessions

So Mike doesn't have to reload plugins everywhere, tell every session that might use the changed
skill, using whatever messaging tools this session has:

- Other Claude sessions on the laptop or in the cloud (for example `ListAgents` + `SendMessage`, or
  the remote session tools' `list_sessions` + `send_message`).
- Other threads in the current project (`list_threads` + `message_thread`), when running in a project.

Skip sessions that are finished or clearly unrelated. The message says, in two or three lines:
which skill or doc changed, what's different, the new version, and to run the two commands above
and re-read the changed file before using that skill again. A recipient should not edit the plugin
in response unless it has its own lesson to add.

## Then

Tell Mike in one line what changed and which sessions you notified.
