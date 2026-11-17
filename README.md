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

## Updating

1. Edit the files here, commit and push.
2. Bump `version` in `plugins/quasarbright/.claude-plugin/plugin.json`.
3. Run `/plugin marketplace update quasarbright-claude`, or let auto-update pick it up.

The installed plugin is a cached copy. Edits to it get overwritten on update, so make changes in
this repo. `project-ideas` appends to `liked-ideas.md` and `rejected-ideas.md`, and the
retrospective in `publish-to-portfolio` can edit the docs; the skills point those writes at
`~/GitHub/quasarbright-claude` when it exists. Commit and push after they change.

## Cloud sessions

Add this to the environment's setup script:

```bash
claude plugin marketplace add quasarbright/quasarbright-claude
claude plugin install quasarbright@quasarbright-claude
claude plugin marketplace add anthropics/claude-plugins-official
claude plugin install frontend-design@claude-plugins-official
```

A fresh container doesn't know the official marketplace, so it has to be added before
`frontend-design` will install. These commands were tested in a fresh container on 2026-11-17. That
plugins installed by the setup script carry into the session is assumed, not yet confirmed.

Several skills expect my other repos to sit next to each other under `~/GitHub` (portfolio,
sketches, cutwist). In a cloud session those paths won't exist unless the environment clones them.

## Old local copies

These skills also exist as loose copies in `~/.claude/skills` and `~/GitHub/.claude/skills`. Once
the plugin is installed, each shows up twice (`/deploy` and `/quasarbright:deploy`). Remove the
loose copies after switching over.
