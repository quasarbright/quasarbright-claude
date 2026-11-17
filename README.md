# quasarbright-claude

My personal Claude Code plugin, plus the marketplace that serves it. The plugin, `quasarbright`,
holds the skills I use across my projects and the steering docs they read (product taste, how to
work with me, house style, UX checklist).

## Layout

```
.claude-plugin/marketplace.json        the marketplace (one plugin)
plugins/quasarbright/
  .claude-plugin/plugin.json           plugin manifest; bump "version" on changes
  skills/
    deploy/                            deploy a project to GitHub Pages
    explain/                           how I explain complicated things
    make-background/                   ?background variant of a visual project
    narrated-video/                    manim videos timed to a voiceover
    new-project/                       scaffold an on-brand web project
    project-ideas/                     brainstorming, with liked/rejected idea logs
    publish-to-portfolio/              add a project to the portfolio
    ux-review/                         fresh-eyes UX review before a demo
    update-plugin/                     how to change, publish and announce this plugin
  hooks/hooks.json, session-start.sh   SessionStart hooks that inject the always-on steering
  steering/
    STEERING.md                        standing rules for every session (self-learning, pushing)
    push-policy.md                     per-project push rules
    rules/                             american.md, draw-it.md, github.md
  docs/
    CLAUDE.md TASTE.md WORKING.md DESIGN.md UX-CHECKLIST.md
```

Skills refer to the docs by paths relative to their own folder (`../../docs/TASTE.md`). Plugin docs
aren't loaded automatically the way a `CLAUDE.md` is; a skill reads them when it runs.

## Install

Inside Claude Code:

```
/plugin marketplace add quasarbright/quasarbright-claude
/plugin install quasarbright@quasarbright-claude
```

From a shell:

```bash
claude plugin marketplace add quasarbright/quasarbright-claude
```

```bash
claude plugin install quasarbright@quasarbright-claude
```

Third-party marketplaces don't auto-update by default. Turn it on in `/plugin` > Marketplaces >
quasarbright-claude.

Skills are namespaced: `/quasarbright:deploy`, `/quasarbright:project-ideas`, and so on.

## Steering

A plugin can't ship a `CLAUDE.md`, so `hooks/hooks.json` runs SessionStart hooks that print the
always-on files: `steering/*.md`, the rules in `steering/rules/` (American spelling, drawing
visual explanations, GitHub conventions), and `docs/CLAUDE.md`, `TASTE.md` and `WORKING.md`. Claude
Code adds that output to the session's context. `DESIGN.md` and `UX-CHECKLIST.md` load on demand.

Each hook's output has to stay under about 10,000 characters; past that, Claude Code shows a 2KB
preview and saves the rest to a file. That's why the files are split across five hooks. Everything
here costs tokens in every session (about 25,000 characters, roughly 6-7k tokens, as of v0.4.0), so keep it tight.

On the laptop, `~/GitHub/CLAUDE.md` would load the same docs a second time, so it should only point
here.

## Updating

The full procedure is the `quasarbright:update-plugin` skill, which Claude follows on its own when a
lesson belongs in the plugin. In short:

1. Edit the files here, bump `version` in `plugins/quasarbright/.claude-plugin/plugin.json`, run
   `claude plugin validate .`, commit and push to `master` (no PR).
2. Reinstall: `claude plugin marketplace update quasarbright-claude` then
   `claude plugin update quasarbright@quasarbright-claude`, or let auto-update pick it up.
3. Message the other running sessions and project threads about the change.

The installed plugin is a cached copy. Edits to it get overwritten on update, so make changes in
this repo. `project-ideas` appends to `liked-ideas.md` and `rejected-ideas.md`, and the
retrospective in `publish-to-portfolio` can edit the docs; the skills point those writes at
`~/GitHub/quasarbright-claude` when it exists. Commit and push after they change.

## Cloud sessions

The plugin is added to my claude.ai account (marketplace `quasarbright/quasarbright-claude`), and
account plugins sync into every cloud session on their own, hooks included. Confirmed 2026-11-17:
a cloud session loaded v0.4.0 with all skills and all five startup hooks. No setup script needed.

Fallback, if account sync ever isn't available: put this in the environment's setup script. A fresh
container doesn't know the official marketplace, so it has to be added before `frontend-design`.

```bash
claude plugin marketplace add quasarbright/quasarbright-claude
claude plugin install quasarbright@quasarbright-claude
claude plugin marketplace add anthropics/claude-plugins-official
claude plugin install frontend-design@claude-plugins-official
```

Account plugins also sync to the laptop at Claude Code startup, so don't install it there a
second time with `/plugin install`.

Several skills expect my other repos to sit next to each other under `~/GitHub` (portfolio,
sketches, cutwist). In a cloud session those paths won't exist unless the environment clones them.

## Old local copies

These skills also exist as loose copies in `~/.claude/skills` and `~/GitHub/.claude/skills`. Once
the plugin is installed, each shows up twice (`/deploy` and `/quasarbright:deploy`). Remove the
loose copies after switching over.
