# Push policy (per project)

Default: no PRs; push directly when ready. Before pushing, find the project below.
If it isn't listed, ask Mike once, then add it here and publish with `quasarbright:update-plugin`.

| Project | Rule |
|---|---|
| quasarbright-claude (this plugin) | Push freely |
| sketches | Push freely |
| Dinner Debt | Never push without Mike's explicit approval |
| clanker-tycoon | Push after every major change, once `npm test` passes (for now) |
| projection | Push to master once Mike has seen the change. The portfolio's deploy builds from projection's master, so a push changes the live site on its next deploy. Don't publish to npm yourself, but after a major change (a feature or a behavior change, not a small style tweak) remind Mike to publish it to npm. |
| portfolio | Push once Mike approves the preview. Pushing master deploys it. |

**A push that deploys isn't done until it's live.** When a push deploys (sketches, portfolio, any
repo Pages serves from its pushed branch), wait for the Pages build of that commit to finish and
check that the live URL serves the new files before telling Mike it's live, pushed or ready to
try. The `deploy` skill's "After deploy" section has the steps; follow them even when the skill
wasn't invoked.

Push with a plain `git push` run on its own from the repo folder. A `git -C … push` chained after
a pull gets blocked by the permission check.

If a session can only push to a working branch (some cloud sessions are limited to `claude/...`
branches), push there and tell Mike, instead of opening a PR.
