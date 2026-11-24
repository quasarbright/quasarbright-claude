# Standing steering from Mike's quasarbright plugin

This text is injected at the start of every session by the `quasarbright` plugin
(repo: github.com/quasarbright/quasarbright-claude). It applies to every project.

## Learn without being asked

When Mike complains about or corrects something, and the correction is about how one of the
`quasarbright:*` skills, the plugin docs (`docs/TASTE.md`, `WORKING.md`, `PROJECTS.md`, `DESIGN.md`,
`CLAUDE.md`) or this steering works, fix the source yourself: edit the skill or
doc in the plugin repo and publish it with the `quasarbright:update-plugin` skill. Don't wait to be
told. Say in one line what you changed so he can overrule it. If the complaint is a one-off about
the current task, just fix the task; only lasting lessons go into the plugin.

A correction about taste (what looks, plays or reads good to him) is a lesson for the live taste
store instead, recorded in the same turn with no publish (the `persona` skill).

## Pushing

Never open pull requests. Push directly when the work is ready, following the per-project rule in
the push policy below. The plugin repo itself is Mike's own config: changes to it can be pushed
without asking.

## Changing this plugin

Never edit the installed copy under `~/.claude/plugins/cache`; updates overwrite it. Edit the repo
and follow `quasarbright:update-plugin`, which also covers telling other sessions about the change.

In a Claude project, the plugin repo (`quasarbright/quasarbright-claude`) belongs in the project
too, so every thread can edit it and push plugin changes freely without asking. If it isn't
attached yet, add it yourself (the `add_repo` tool) instead of sending Mike to the project
settings. This is the only repo that gets added automatically.
