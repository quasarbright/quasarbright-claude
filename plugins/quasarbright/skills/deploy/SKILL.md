---
name: deploy
description: Deploy one of Mike's (quasarbright) web projects to GitHub Pages. Proposes favicon candidates first if the page has none. Handles both a sketch inside the sketches monorepo (commit + push) and a standalone project (create repo, push, enable Pages, watch the build). Separate from the portfolio. Use when Mike wants to deploy/ship a project to Pages.
---

# Deploy to GitHub Pages

Deploys a project so it's live at a `quasarbright.github.io` URL. This is **separate from the
portfolio** — deploying does not list it on the portfolio (that's `/publish-to-portfolio`).

GitHub: user **quasarbright**, primary branch **master**, Pages base
`https://quasarbright.github.io/<repo>`. Keep sites **pure static** — include a `.nojekyll` file so
Pages skips the Jekyll build (fast deploys).

Creating a public repo / pushing is outward-facing: state the repo name + that it'll be public, then
proceed (Mike invoking `/deploy` is the go-ahead).

## Before deploying: a favicon

If the page has no `<link rel="icon">` (or only a template default, like CRA's React atom or
`vite.svg`), propose favicon candidates before the first deploy, the way `/publish-to-portfolio`
proposes screenshots:
1. **Look at recent ones.** Find favicons in recently changed projects
   (`grep -l 'rel="icon"' -r --include=index.html ~/GitHub`, newest first by git log) and look at
   them, blown up and at 16px. Cutwist's is the project's own object drawn in its own look, on a
   transparent background, filling the square. Home and art-gallery use the magnetic-pendulum
   fractal, which is the site's own icon, not a per-project pattern.
2. **Make 4–5 candidates** from the project's real drawing code (its own sprites, palette and
   shapes), as 512px PNGs. Vary them: the single most recognizable element, a busier composition,
   and a version on a solid tile of the project's background color for light tab bars.
3. **Show each one at real size**: a sheet with every candidate at 512px and at 16px inside a dark
   and a light mock tab. Drop the ones that turn to mush at 16px. Send the sheet with
   `SendUserFile` (`display: "render"`).
4. **When Mike picks one**, save it as `favicon.png` in the project folder (for a sketch, in its
   own folder) and add `<link rel="icon" type="image/png" href="favicon.png" />`, with a relative
   path so it works under `/<repo>/`. Add `<link rel="apple-touch-icon" href="favicon.png" />` with
   it (Mike wants the same image there).

Also set `<meta name="theme-color" content="…">` to the page's background color (its `--bg`)
without asking. It colors Discord embeds and the phone browser bar.

The rest of the link preview (description, `og:` tags, preview image) waits until the project is
on the portfolio: `/publish-to-portfolio` adds it from Mike's final entry. Skip Twitter tags.

## Case A — a sketch in the `sketches` monorepo

The sketch lives at `~/GitHub/sketches/<slug>/` and deploys as part of the `sketches` repo.
- Commit and push the `sketches` repo:
  ```bash
  cd ~/GitHub/sketches && git add <slug> shared && git commit -m "<slug>" && git push
  ```
- If the `sketches` repo doesn't exist on GitHub yet, create it first (see Case B, repo name
  `sketches`, ensure `.nojekyll` at root) — this also makes the shared-lib URL live.
- Live at `https://quasarbright.github.io/sketches/<slug>/`.

## Case B — a standalone project repo

For a project in its own dir `~/GitHub/<slug>/`:
```bash
cd ~/GitHub/<slug>
touch .nojekyll                      # pure static, fast deploys
git init && git add -A && git commit -m "Initial commit"
gh repo create quasarbright/<slug> --public --source=. --remote=origin --push
```
Enable Pages (branch-based, path `/`):
```bash
gh api repos/quasarbright/<slug>/pages --method POST \
  -f "source[branch]=master" -f "source[path]=/"
```
Watch until built (~30–60s):
```bash
until [ "$(gh api repos/quasarbright/<slug>/pages --jq '.status')" = "built" ]; do
  echo "Building…"; sleep 5; done && echo "Live at https://quasarbright.github.io/<slug>"
```
(If the repo already exists: just commit + push; Pages is already enabled.)

## After deploy: wait until the new version is live

Never tell Mike it's live (or "pushed, try it") until the live site serves the new version. A push
only starts a Pages build, and he has opened the link and seen the old version (2026-11-22: old
card art right after "it's pushed").

1. Wait for the Pages build of your commit to finish: the `pages-build-deployment` run for that
   commit (GitHub MCP actions tools in the cloud, `gh run watch` on the laptop) or the Pages
   `status` loop above. A failed build is a blocker to report, not a delay.
2. Check the live site itself. Fetch a file you changed from the live URL with a cache-busting query
   (`curl -s "https://quasarbright.github.io/<repo>/<path>?v=$(date +%s)"`) and compare it with the
   committed file (`git show HEAD:<path>`, byte-for-byte or by hash for images). Retry every 20–30s
   for up to about 10 minutes; if it still doesn't match, tell him what you saw instead of saying
   it's live.
3. Then load the page in a headless browser, read the console and screenshot the changed part.
4. Report the URL. Pages' CDN caches for about 10 minutes, so if he might have the old version
   open, tell him to hard-refresh.

- Report the URL. If Mike wants it on the portfolio, that's `/publish-to-portfolio` (which needs the
  live `pageLink`).
