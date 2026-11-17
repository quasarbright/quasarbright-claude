# Push policy (per project)

Default: no PRs; push directly when ready. Before pushing, find the project below.
If it isn't listed, ask Mike once, then add it here and publish with `quasarbright:update-plugin`.

| Project | Rule |
|---|---|
| quasarbright-claude (this plugin) | Push freely |
| sketches | Push freely |
| Dinner Debt | Never push without Mike's explicit approval |
| clanker-tycoon | Push after every major change, once `npm test` passes (for now) |

Push with a plain `git push` run on its own from the repo folder. A `git -C … push` chained after
a pull gets blocked by the permission check.

If a session can only push to a working branch (some cloud sessions are limited to `claude/...`
branches), push there and tell Mike, instead of opening a PR.
