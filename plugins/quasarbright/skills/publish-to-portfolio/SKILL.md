---
name: publish-to-portfolio
description: Add one of Mike's (quasarbright) finished projects to his portfolio — draft the projects.yaml entry, propose screenshot candidates modeled on his recent ones (he picks), show him the entry and a screenshot of its card on the portfolio, iterate until he approves, then commit and push (pushing deploys). Separate from deployment. Includes a mandatory end-of-project learning retrospective. Use when Mike wants to put a project on his portfolio.
---

# Publish to portfolio

The portfolio (`~/GitHub/portfolio/`) is a `projection` site; `projects.yaml` is the source of truth.
Pushing `master` deploys it: a GitHub Action builds the site and publishes it to `gh-pages`.
This skill drafts the entry, shows Mike exactly what will go up (the entry and a screenshot of its
card), iterates with him until he approves, then pushes. Mike never has to open `projection admin`.
Nothing is pushed before he approves the preview in step 4.

## 1. Gather the entry

Ask/confirm what's missing:
- `id` (slug) — **check it isn't already taken** (`grep -n "id: <slug>$" projects.yaml`): an old
  project often has the obvious name (Command-Line Solitaire already owned `solitaire`; web versions
  use a `-web` suffix like `g2048-web`, `solitaire-web`). A duplicate id also makes the step-4.5 deploy
  watch fire on the old card.
- `title`, `description` — **end-user framing**, plain and specific (what it does / is),
  not how it's built. One or two sentences.
- `creationDate` — today (`YYYY-MM-DD`).
- `tags` — reuse Mike's existing vocabulary (survey current `projects.yaml`: e.g. `web game ai
  visualization physics generative image webcam llm utility mobile-friendly funny interactive`).
- `pageLink` — the deployed URL. `sourceLink` — the repo URL.
- `featured` — seed as `false`. Don't ask up front; the preview in step 4 mentions he can
  have it featured.

## 2. Draft the entry in projects.yaml (no screenshot)

Append the entry under `projects:` in `~/GitHub/portfolio/projects.yaml`. **Don't set `screenshot`
/ `thumbnailLink` yet**: that waits for Mike's pick in step 3.5. Keep YAML style consistent with
existing entries.

## 3. Background mode → dynamicBackgrounds (if applicable)

Check whether this project has a `?background` variant (made via the `make-background` skill, or
just ask Mike). If it does, add its `…/<project>/?background` URL to `dynamicBackgrounds` in
`~/GitHub/portfolio/projection.config.json` (and/or the project's `projects.yaml` entry under
`config.dynamicBackgrounds`, matching how existing entries like `evolving-particle-life` do it) so
it joins the hero's rotation. Don't skip this silently just because Mike didn't ask in the moment —
a background variant existing is itself the signal to check; if you're not sure it's wanted in the
rotation, ask rather than assuming either way. Never run `projection deploy`; pushing deploys.

## 3.5. Propose screenshot candidates

Give Mike a few candidate screenshots to pick from, modeled on his recent ones.
1. **Look at the references first.** Open the newest files in `~/GitHub/portfolio/screenshots/`
   (`ls -t`, look at 3–4). His recent ones are mostly the subject alone, roughly square, on the
   project's own dark background, with no app chrome (pancake-sort, cutwist); content-first tools
   are a crop of the content (plangdle). Match what they do.
2. **Make 4–6 candidates** with a headless Playwright script against the local or live page,
   `deviceScaleFactor: 2`. Hide the DOM chrome with an injected style, and crop from the page's
   own layout rects. Vary them: the subject at rest, its signature moment (an effect frozen
   mid-animation, via a test hook that triggers the event and then draws N ms), a close crop, and
   the full UI. Stage a good-looking state instead of hoping live play produces one: build it from
   the project's real code, build it once, and reuse it so every shot shows the same thing.
   Details: [[pattern-portfolio-screenshot-candidates]].
3. **Look at every one before sending** and drop the weak ones (empty space, overlapping effects,
   fake-looking data). Save them in a gitignored `screenshot-candidates/` in the project and send
   them with `SendUserFile` (`display: "render"`), one line each on what it shows.
4. **When Mike picks one**, copy it to `~/GitHub/portfolio/screenshots/<id>.png` and set
   `thumbnailLink: admin://<id>.png` on the entry, as the recent entries do. If he'd rather use
   his own, ask for the file and copy it the same way.

## 4. Preview, iterate, get approval

Show Mike exactly what will go live:
```bash
node <this skill's folder>/preview-card.cjs <id> <scratchpad>/preview
```
(`preview-card.cjs` sits next to this SKILL.md; use its absolute path.)
It builds the portfolio from the working tree (no deploy) and writes `<id>-context.png` (the card
among its neighbors at desktop width), `<id>-card.png` (the card alone) and `<id>-mobile.png` (a whole
phone screen, emulated iPhone width with touch, scrolled so the card is in the middle; the phone
grid drops the date and tags and clamps the description to two lines). Look at them first: check the description isn't cut off badly and the thumbnail crops well
in the card's frame.

Send `<id>-context.png` and `<id>-mobile.png` with `SendUserFile` (`display: "render"`), then the
entry as it sits in `projects.yaml` (a yaml block), plus any `dynamicBackgrounds` change. Say he
can change any field, pick another screenshot, or have it featured. Ask for approval with
`wrap_up` (a "Push it" button).

Each change he asks for: edit the entry, rerun the script, send the new screenshots. Repeat until he
approves. Do the issue check and the retrospective (steps 5–6) while waiting, not after.

## 4.5. Push, then link preview tags on the project

**On approval**, commit only the portfolio files this skill touched (`projects.yaml`,
`projection.config.json` if changed, `screenshots/<id>.png`) and push `master`. His approval is
the go-ahead for this push. Before pushing, check `git log origin/master..master` for other
commits and say if any go out with it. Then watch the deploy in the background and confirm the
card is live:
```bash
gh run watch $(gh run list --repo quasarbright/portfolio --limit 1 --json databaseId --jq '.[0].databaseId') \
  --repo quasarbright/portfolio --exit-status
until curl -s https://quasarbright.github.io/portfolio/ | grep -q 'data-project-id="<id>"'; do sleep 15; done
```
If the run fails, read its log (`gh run view --log-failed`) and fix it before moving on.

**Link preview tags.** Give the project's own page a link preview made from the approved entry.
Use the approved description and the picked screenshot, which the live portfolio serves at
`https://quasarbright.github.io/portfolio/images/<id>.png`:
- `<meta name="description">` and `og:description`: his description, word for word.
- `og:title` (the page's own title), `og:type` `website`, `og:site_name` `Mike Delmonaco`,
  `og:url` (the absolute `pageLink`).
- `og:image`: download the live image into the project as `preview.png`, point at its absolute
  URL, and give `og:image:width`/`og:image:height`.
- No Twitter tags. (Theme color and the touch icon came with the favicon in `/deploy`.)

Commit and push the project (sketches: the `sketches` repo). Then wait for the Pages build of that
commit (`gh api repos/quasarbright/<repo>/pages/builds/latest` until its `commit` matches and
`status` is `built`) and check that the live page serves the tags and `preview.png` returns 200.
Mike asked for this step, so the push needs no extra go-ahead.

## 5. Close the loop on the source issue (if any)

If this project started from a `gh issue` (check `project-ideas` logs / ask Mike if unsure), **ask
Mike** whether you should resolve that issue now with a comment linking to the new `pageLink`, then
closing it. Don't do this silently or skip it — always ask first, since he may want to leave it open
(e.g. still iterating) or close it himself.

## 6. MANDATORY learning retrospective (do not skip)

This is the workspace's main mechanism for actually recording learnings — run it **before finishing**,
every time. Review the build session and, for each item found, *actually write it down now* (don't just
say you could):

1. **Did Mike correct or redirect you?** → save a `feedback` memory (what + the why + how to apply).
2. **New build pattern or gotcha?** → save a memory; or if it's an always-true rule, edit
   `docs/DESIGN.md`/`docs/CLAUDE.md` in the plugin repo instead (`~/GitHub/quasarbright-claude/plugins/quasarbright/docs/`, not the installed copy; commit there and say you did).
3. **Did the shared lib lack something this project needed?** → note the cohesion-lib gap (memory), and
   offer to add it to `sketches/shared/cohesion.*`.
4. **Any taste signal** (liked/disliked a look or direction)? → memory; and if idea-related, update the
   `project-ideas` liked/rejected logs.

Then report: what went live, the link preview tags, and what memories/edits you recorded.

## Notes
- Deployment is separate — Mike may `/deploy` a project to Pages without ever putting it on the
  portfolio. This skill assumes the project is already deployed (has a live `pageLink`).
