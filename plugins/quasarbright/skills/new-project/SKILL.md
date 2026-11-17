---
name: new-project
description: Scaffold a new on-brand web project for Mike (quasarbright) — wires the shared cohesion lib (footer, about-modal, control panels, OpenRouter runtime), the dark theme, and a distinctive per-project identity via the frontend-design skill. Use whenever Mike wants to start building a new web project/sketch/tool. Does NOT deploy or publish (separate skills).
---

# New project scaffold

Start a new web project the right way so Mike never has to re-explain the conventions. Read
the plugin's `docs/DESIGN.md` (`../../docs/DESIGN.md` relative to this skill's folder) first. The output of this skill is a working, on-brand starting point — not a
finished project, and never deployed/published here.

## 1. Decide the lane (ask if unclear)

- Every project gets its **own visual identity** — there's no "throwaway" tier that skips this.
  Single `index.html`, living either in the `sketches` monorepo (`~/GitHub/sketches/<slug>/index.html`)
  or its own repo `~/GitHub/<slug>/`. Default to `sketches/`; use its **own repo** only when the
  project needs more than raw vanilla HTML+JS+CSS — a framework (React, etc.), a build step, a
  package.json, anything that isn't a static page opened directly. Ask Mike if unsure.
- Also determine: **is it an AI project?** (uses OpenRouter / an LLM) → wire the shared key runtime.
- Also determine: **is it a fullscreen canvas sim?** → use the fullscreen kit (floating panel, control
  bar, readout, footer overlay) vs. a normal centered tool page.

## 2. Shared-lib import path

- Sketch in the monorepo: `../shared/cohesion.css` / `../shared/cohesion.js` (relative).
- Standalone repo: the absolute canonical URL
  `https://quasarbright.github.io/sketches/shared/cohesion.css` (+ `.js`).
  (Requires the `sketches` repo to be deployed — it is the single source of the design system.)

## 3. Identity

Invoke the **`frontend-design`** skill to design a distinctive identity *grounded in the subject's
own world* (palette 4–6 named hexes, a display+body+mono type pairing, a signature element, a hero
that's a thesis). Then apply it by **overriding CSS tokens on `:root`**
(`--bg --panel --panel-2 --border --text --muted --faint --accent --accent-hi --on-accent`,
`--font-ui --font-mono --font-display`) plus loading the chosen webfonts. The shared components
follow the tokens automatically (see `sketches/sandpile/` for a worked example).

## 3.5. Present the plan before building

Before writing any code, post a short design outline and wait for a go-ahead — don't build straight
from the frontend-design skill's internal plan. Do this every time, for every project, regardless of
size. Keep it tight (a paragraph or two, not the skill's full brainstorm):

- **Concept** — one line: what the thing is, and if there's a dual reading or hook, what makes it
  distinctive.
- **Mechanic** — how it actually works, briefly.
- **Palette** — the key hexes and what they're for.
- **Type** — the display/body/mono pairing, naming the actual typefaces and one line each on why:
  what mood or texture each face brings, and how it plays off the others (e.g. a feral high-contrast
  display serif against a plain utility sans reads as "wild thing, calmly instrumented").
- **Signature motif** — the one memorable element and *why* it's grounded in the subject, not
  decoration bolted on.
- **Where** — path, and lane/slug if still open. Optionally, one or more existing projects it takes
  structural or visual inspiration from (not required, but call it out when it's following one
  closely, e.g. "follows sandpile's GPU ping-pong structure and token-override approach") — naming
  several is fine if different aspects come from different places.

This doubles as the moment to confirm naming/slug/lane if still open.

## 4. Scaffold (starter template)

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>PROJECT TITLE</title>
  <link rel="stylesheet" href="RELATIVE_OR_ABSOLUTE/shared/cohesion.css" />
  <script type="module" src="RELATIVE_OR_ABSOLUTE/shared/cohesion.js"></script>
  <!-- webfont <link>s + a <style> block with :root token overrides -->
</head>
<body>
  <!-- content: a centered .page for tools, or a fullscreen <canvas> for sims -->

  <!-- explain how the whole thing works, with live diagrams running the real code (see about-modal.md) -->
  <about-modal label="about"><h2 class="title">…</h2><p class="intro">…</p>…</about-modal>

  <!-- sims: <control-panel floating title="…"> …controls… </control-panel> + <div class="control-bar">…</div> -->

  <mike-footer></mike-footer>            <!-- normal page: footer at bottom -->
  <!-- fullscreen canvas: <mike-footer overlay></mike-footer> (bottom-pinned overlay) -->
</body>
</html>
```

Component/CSS reference (all read the tokens): `<control-panel [floating] [collapsed] title>`,
`<about-modal label>`, `<mike-footer [overlay]>`, `<openrouter-key>`; classes `.page .panel .btn
.btn-primary .control .control-head .dropzone .control-bar .readout .section-label .title`, and the
editor tool rail `.tool-rail [.phone-split] > .tool-group > button.tool[.is-active]` (see `../../docs/DESIGN.md`
"Editor layout"). See the kitchen-sink at `sketches/index.html` and the fullscreen demo at
`sketches/sim.html`.

## 4.5. The about modal

Every project gets an about modal that makes a reader actually understand how the whole thing
works: ideas built up in order, plain words before names, and a small live diagram for each idea
that runs the project's real code. **The gold standard is `sketches/draw-maze/` and
`sketches/fireflies/`**: read both about modals before writing one. Follow
**[about-modal.md](about-modal.md)** (content, voice,
diagrams, lifecycle, verification), and load the `/explain` skill while writing it. Write it once
the mechanism has settled, not at scaffold time, since the explanation has to match what the
code actually does.

## 5. AI projects (OpenRouter)

- Put `<openrouter-key></openrouter-key>` in the project's settings modal, alongside a **per-project
  model selector** (model is per-project; the key is shared site-wide via localStorage).
- Make LLM calls with the shared wrapper: `openrouterChat({ model, messages, onToken })` — it injects
  auth + attribution headers, streams, and re-prompts on a bad key. Import from the module or use
  `window.cohesion`.
- `?api-key=…` auto-populates and self-strips (handled by the lib on load) — for pre-keyed friend links.

## 6. Serve & open when ready

The first time the scaffold is in a state Mike should look at, start a local server and open it for
him rather than asking him to open it or trying to self-verify with browser automation:

For a **sketch in the monorepo** (imports `../shared/cohesion.*` by relative path), the server
root must be `sketches/` itself, not the sketch's own directory — otherwise `../shared/...`
resolves above the server root and 404s/503s, breaking the page silently while it still loads (a
real bug hit building `contagion`: serving from the sketch dir left the page running with no CSS/
components, easy to misdiagnose as something else):

```bash
cd ~/GitHub/sketches && (nohup python3 ~/GitHub/cutwist/.claude/serve.py <port> ~/GitHub/sketches >/tmp/http_<slug>.log 2>&1 &)
open http://localhost:<port>/<slug>/index.html
```

For a **standalone repo** (absolute `https://quasarbright.github.io/sketches/shared/...` import),
serving from the project's own directory is correct as normal:

```bash
cd ~/GitHub/<slug> && (nohup python3 ~/GitHub/cutwist/.claude/serve.py <port> ~/GitHub/<slug> >/tmp/http_<slug>.log 2>&1 &)
open http://localhost:<port>/index.html
```

**Start it from Bash exactly like this, detached** (`nohup … &` inside a subshell). The process
outlives the session (it's re-parented to launchd), which is how cutwist's server has stayed up for
days. Don't start it with the Browser pane's `preview_start` — the pane owns that process and it
dies whenever the pane or session closes. Don't set up a launchd agent, cron job or login item
either; Mike doesn't want an OS service for this. A `launch.json` entry for the project is fine
(it lets the Browser pane attach), but the server itself comes from the command above.

`serve.py` is a plain static server that sends `Cache-Control: no-store`, so edited ES modules
never go stale on refresh (plain `python3 -m http.server` lets the browser cache them, which
crashes a new page against an old module).

- Pick a free-ish high port (e.g. 8930-8999) and vary it per project to avoid clashing with a
  server left running from an earlier session.
- Use a local server, not `file://` — relative `<script type="module">` imports and Chrome browser
  automation both misbehave against `file://` URLs.
- Browser automation (`mcp__claude-in-chrome__*`) is unreliable for verifying canvas/animation/timing
  behavior — tool round-trips introduce multi-second gaps that make it look like animations are
  broken when they aren't (screenshots land at unpredictable points in a loop). Prefer serving +
  opening for Mike to eyeball over trying to screenshot-verify a visual/timing-sensitive feature
  yourself. Static layout/DOM checks are fine to verify with browser tools; live animation behavior
  is not.

**Once that server is running for a project, leave it running.** Mike keeps using the same tab —
don't kill the server, start a second one on a different port, or re-run `open` after subsequent
edits. Static assets (HTML/CSS/JS) just need a page refresh, which is his to do. Only touch the
server again if it's actually died (check with `lsof -nP -iTCP:<port> -sTCP:LISTEN` before
assuming) or he asks you to restart it — and then restart it with the same detached command.

## Hard rules (from the plugin's docs/CLAUDE.md and docs/DESIGN.md, `../../docs/`)
- **No p5js.** Always include `<mike-footer>`. Dark theme by default.
- **Namespace your CSS classes** — don't reuse cohesion's reserved names (e.g. use `.plate-readout`,
  not `.readout`) or you'll inherit its styles.
- Do not deploy or add to the portfolio here — that's `/deploy` and `/publish-to-portfolio`.
- **Copy presented as Mike's speaks as him:** about modals, start screens, pitches, README text.
  Write "my" and "I" ("my 2048 AI from 2020"), never "Mike's" or "Mike wrote". The footer is the
  only place his name appears.
