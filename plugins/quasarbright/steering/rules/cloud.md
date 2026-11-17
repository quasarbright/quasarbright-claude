# In a cloud session (claude.ai project thread or Claude Code on the web)

The skills and docs are written for Mike's laptop. In a cloud container these parts work
differently. Found while building perspectivent in a project thread on 2026-11-17.

- **Paths.** `~/GitHub/<repo>` is `/home/user/<repo>`, and only the repos attached to the project
  exist. A skill that reads a sibling repo that isn't attached can't; say so and carry on.
- **Showing Mike things.** There's no `SendUserFile` and he can't open your `localhost`. Copy each
  screenshot or mock into `/mnt/project-files/<project>/` and attach it to `post_message` with
  `attached_outputs`, one PNG per file. In a project, keep demos short: he may be reading them
  through the coordinator in the project chat.
- **Local server.** Start it with the Bash tool's `run_in_background` (`python3 -m http.server
  <port>` from the served root). The detached `nohup … &` form in `new-project` is refused here,
  and `open` doesn't exist. `cutwist/.claude/serve.py` only exists if cutwist is attached.
- **Headless browser.** `require('playwright')` works from any folder. WebGL needs
  `args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']`, and
  rendering is software: a screenshot of a three.js page takes 10–20 s, so run one browser at a
  time, reuse one page for many steps and pass `timeout: 120000` to `screenshot`. Pointer lock
  doesn't work headless, so give pages a drag-to-look fallback and test with that. Tell any
  reviewer or playtest subagent all of this in its brief.
- **Skills that aren't installed.** `frontend-design` isn't available. Design the identity
  yourself, following `new-project`'s "Present the plan before building" outline.
- **GitHub.** Use the GitHub MCP tools; `gh` is only for search. You can't create repos, so a new
  standalone repo needs Mike to create it first. Pushes may be limited to the session's `claude/…`
  branch: if a push to `master` is refused, push the branch and tell Mike.
- **Pushing `sketches` deploys it.** Its `master` is what Pages serves, so pushing there is a
  deploy, and the `deploy` skill's favicon step comes first. Ask before the first push of a new
  sketch to `master`.
