# DESIGN.md — Mike's house style

Steering for building Mike's web projects. The goal is **cohesion without uniformity**: every
project should feel like it belongs to the same person, while leaving room for deliberate one-offs
(e.g. Clanker Court's warm brass courtroom theme). When in doubt, follow this doc; override it only
when a project has a *thematic reason* to look different — and even then, keep the attribution footer.

Identity chosen: **Refined Escher** — dark navy, clean sans UI, indigo/periwinkle accent, mono for
data. Polished, modern, "designed tool." Derived from the best of escher-warp / droste / particle-life.

---

## The one constant

The **attribution footer** appears on every project (see component below). It is the single element
that must not be dropped. Everything else can flex per project.

---

## Color tokens

Default dark theme. Expose every value as a CSS custom property so a project can override the accent
(or any token) in one line without touching components.

```css
:root {
  /* surfaces */
  --bg:        #0e0f16;  /* page background — near-black navy */
  --panel:     #171a24;  /* cards, control panels, modals */
  --panel-2:   #1f2330;  /* nested/raised surfaces, inputs */
  --border:    #2a2f3d;  /* subtle 1px borders */

  /* text */
  --text:      #e6e8ef;  /* primary */
  --muted:     #8a8fa3;  /* secondary, captions, helper text */
  --faint:     #5b6072;  /* disabled, hints */

  /* accent (the one knob most projects re-theme) */
  --accent:    #7c8cf8;  /* periwinkle/indigo */
  --accent-hi: #9aa6ff;  /* hover */
  --on-accent: #0e0f16;  /* text on accent fills */

  /* status */
  --danger:    #e0556b;
  --success:   #5fd08a;

  /* shape */
  --radius:    10px;
  --radius-sm: 6px;
  --gap:       12px;
}
```

Per-project override example (this is all Clanker-style theming should take):
```css
:root { --bg:#1a140c; --panel:#221a10; --accent:#b89243; --on-accent:#1a140c; } /* brass */
```

---

## Typography

- `--font-ui`: system sans stack — `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
  Default for all UI, prose, controls.
- `--font-mono`: `ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace`.
  Use for **data readouts, live stats, gene/parameter names, numeric slider values**, and the body of
  "technical sketch" about-modals.
- **Serif** is opt-in only, for a themed project (Clanker). Not part of the default.

Scale: title ~1.5rem 600, section-label ~0.8rem 600 uppercase letter-spaced `--muted`, body ~0.95rem,
helper ~0.8rem `--muted`.

---

## Component patterns

These are the recurring pieces across Mike's best work. Standardize them in the shared lib; document
intent here.

### One renderer per kind  *(feature parity by construction)*
- Every kind of thing (a card, a count, a row, a stat, a button group) is drawn by one function or
  component, and every instance goes through it. Special cases are inputs to it (`disabled`,
  `fixed`, `readOnly`, `empty`), never a separate branch with its own markup.
- A control that can't be used on one instance is shown disabled, in the same place, not removed.
  Removing it shifts the layout and makes that instance look like a different kind of thing.
- Each such component gets a test that renders a normal instance and each special case and checks
  they have the same parts (same buttons, same classes), differing only in the disabled flags.

### One way to do each thing  *(consistency within an app)*
Mike, 2026-11-22: "If there's a way to do something in one place, it should be the same way to do
it in the other place. We don't want to have a bunch of different interfaces for the same objects
in different places."
- An app has one visual language. Each object (a player, a card, a setting) and each action on it
  (rename, show info, list, remove) gets one control, one look and one wording, and every screen
  that offers it reuses that same component. A game that renamed players with a text field in one
  place and a pencil button in another, explained a card with a "What does this card do?" link in
  one place and an ⓘ button in another, and listed the cards differently behind its rules button
  had three of these misses.
- Before adding a control, search the app for where that object or action already appears and
  reuse it. When you change one, change all of them (`WORKING.md`, "One place, every place, a
  test").
- This is feature parity inside one app, alongside parity across variants (`TASTE.md` principle 7).

### UI copy
- Hint verbs match the input device: "click" and "hover" with a mouse, "tap" and "press" on touch.
  Pick the word from `matchMedia('(pointer: coarse)')` (or `(hover: none)`) at render time, never a
  fixed string. "Tap to flip" on a desktop is wrong.
- Labels, buttons, hints and toasts use standard, short, neutral app and game wording: "Enter your
  name", "Start Game", "Main Menu", "Ready". Never chatty or explanatory ("What should people call
  you?", "Back to the start"). Buttons are Title Case. Hints are one short sentence or none.
- Details and examples are in `WRITING.md`, "Copy".

### Attribution footer  *(the constant)*
- Text: `Made with ♥ by Mike Delmonaco` — the **name links to the site root** (`https://quasarbright.github.io/`), not a fixed path, so it survives repointing what root serves.
- **Normal pages:** a real footer at the bottom of content, centered, `--muted`, small.
- **Fullscreen / canvas pages:** pinned to the **bottom** as a subtle non-interactive overlay
  (low opacity, `pointer-events:none` except the link), so it never disturbs the content.
- **The "Mike Delmonaco" link itself is always colored with the project's highlight/accent
  color** (`--accent` / `--accent-hi`), never `--muted` or `--text` — this holds even when a
  fullscreen-overlay footer needs a stronger text-shadow or different container color for
  legibility over a busy canvas. If you copy the overlay-footer CSS pattern from another sketch,
  give the footer container and the `<a>` inside it separate rules so the container color
  override doesn't also flatten the link to plain text.
- **Hidden entirely when `?background` is present.**

### Control panel  (`<control-panel title="…">`)
- Rounded `--panel` card with a header (title + collapse caret) and a body of labeled controls.
- **Collapsible:** clicking the header toggles it (caret rotates). Add `collapsed` to start closed.
- **`floating`** → fixed top-right, **semitransparent + backdrop-blurred** for over a canvas.
  Without it, the panel is static (sits beside the result on tool pages).
- Hidden automatically under `?background`.

### Slider + live readout
- Label row: name on the left (`--muted`), **right-aligned current value** (mono).
- Track + accent thumb. Value updates live as dragged. (See escher-warp: `view zoom … 0.03`.)

### Step-based sims (CA, particle/growth systems, anything with a discrete update rule)
- Speed is **steps per second**, set with the halve/double buttons of the bottom control bar below
  (value shown as `NN/s`), never a "1×–5×" multiplier on steps-per-frame: a multiplier ties the
  sim's rate to the display's refresh rate. Decouple stepping from rendering with a
  frame-independent accumulator, same pattern as `sandpile`'s `relaxAccumulator`:
  ```js
  acc += stepsPerSec * dt;               // dt in seconds, capped at ~0.1 for throttled tabs
  if (acc > CAP) acc = CAP;              // clamp the catch-up burst
  while (acc >= 1) { acc -= 1; step(); }
  ```
  On the GPU, also drop a `gl.fenceSync` after each frame's steps and queue no new steps while the
  last fence hasn't signaled (forgive the missed ones). Otherwise a heavy rule queues more work
  than the GPU finishes and the page gets slower and slower (rock paper scissors' big rule did).
- Every duration/rate *inside* the sim (decay windows, cooldowns, growth thresholds, event periods)
  must be a plain **step-count**, never seconds scaled by `dt` — that's the only way sim speed can
  change without silently changing the automaton's behavior. The steps-per-second control above is
  the sole place real time is allowed to enter.
- When the useful range spans more than about one order of magnitude, make the slider **log-scale**
  (map a linear 0–100 slider position through `min * (max/min)**(pos/100)`) so both the slow, legible
  end and the fast end are reachable in one drag.

### Buttons
- Default: `--panel-2` fill, `--border`, `--text`, `--radius-sm`. Hover lightens.
- Primary/active: `--accent` fill, `--on-accent` text.
- Group related buttons in a row (Zoom in / Zoom out; Reset / Save PNG).

### Tooltips  *(every interactive control)*
- Every button, slider, select, and other interactive control gets a native `title="…"` attribute —
  the browser's built-in hover tooltip, zero extra markup or CSS needed (see sandpile's
  `id="pause" title="pause / resume"`).
- Write it as a plain-English gloss of what the control does or controls, using the same grounded,
  jargon-free language as [[feedback-ground-jargon-before-using-it]] — not a restatement of the
  visible label (a slider already labeled "nutrient diffusion" needs a tooltip explaining what that
  means/does, e.g. "how fast food spreads through the agar," not "sets nutrient diffusion").
- Sliders/selects inside a `<div class="control">` block: put the **same** `title` text on both the
  `.control-head .name` label span *and* the `<input>`/`<select>` itself — hovering either the label
  or the control should surface the explanation, not just one of them.
- **Icon-only controls (tool rails, editor chrome) use the instant tooltip instead of `title`:**
  `data-tooltip="Name (key): what it does"`. cohesion.js shows a styled tip with no delay: the name
  in bold, each key as a `<kbd>` chip (`([ and ])` gives two), the description under it. It sits to
  the right of `.tool-rail` buttons and above other controls, and shows on keyboard focus too.
  Change the attribute and an open tip updates itself. Don't also set `title` (you'd get both); give
  icon buttons an `aria-label`. See sketches/sand.

### Modals  (shared `openModal()`; `<about-modal>` is built on it)
- Every modal has an **X close button (top-right)**, plus Esc and backdrop-click to close.
- Dark `--panel` scrollable dialog over a **dimmed** page, generous padding, `--radius`.

### About modal
- Trigger: an `about` button (bottom control bar on sims, or near the title on tools).
- **The standard:** a reader should come away actually understanding how the whole thing works.
  Ideas built up in order, each with a small **live diagram that runs the project's real code**.
  Full guide: `.claude/skills/new-project/about-modal.md`. **Gold standard:**
  `sketches/draw-maze/` and `sketches/fireflies/`; read both before writing one. The only exception is a project that demos an
  existing explainer (e.g. fourier-epicycles → 3blue1brown's video), which can be one sentence
  plus a link out.
- Structure: title → intro paragraph → **uppercase section headers**, one per idea → prose,
  numbered lists for real sequences, diagrams with captions.
- Supports: inline `code` styling (parameter/gene names), colored keywords (match the viz's colors),
  and **KaTeX math** for equations.
- **Content focus:** the interesting part of "what's going on here". That's independent of math vs.
  implementation: sometimes it's the math (the rule, the equation, what the parameters mean),
  sometimes it's the algorithm (draw-maze has almost no math; the story is how the route gets
  built). If a project is mathy and its simulation is also clever, explain the math first and the
  implementation in a section after. Cut what's *uninteresting*, whichever side it's on: plumbing
  nobody asked about (framework, GPU vs. CPU when nothing clever happens there, ping-pong textures
  that are just the standard way to run a CA), tuning advice, and restating a control the panel
  already labels. The modal is for the idea, not a field guide to every knob. When trimming, don't invent a coy "it doesn't know
  which one it's simulating" framing for dual-reading projects either — just say plainly that the
  same rule has a second reading, and name it.
- **Ground before explaining, at any depth.** Open with the real-world phenomenon in plain language
  (no sim vocabulary yet) before naming any term. Explicitly flag and disambiguate overloaded words
  — e.g. a simulation "cell" meaning a grid square vs. a living cell — rather than assuming context
  disambiguates them. When listing state/parameters, gloss each in plain English, not just its
  variable name.

### Upload dropzone  *(image-effect projects)*
- Dashed `--border` box, centered icon, `Click to upload an image` + helper
  `or drag & drop · PNG, JPG, WEBP, GIF`. Click and drag-drop both work.

### Bottom control bar  *(fullscreen canvas sims)*
Gold standard (Mike, 2026-11-22: "This should be the gold standard for similar frame-based steppy
simulations"): the rock paper scissors automaton's bar, `quasarbright.github.io/p5js/
rock-paper-scissors-automaton/` (`index.html` `.control-bar`, `style.css` `.rps-icon`/`.rps-speed`,
`ui.js`). Copy it for any sim that advances in steps.
- One centered row at the bottom, above the attribution footer, in this order: **pause/play**,
  **slower**, the **speed readout**, **faster**, **scramble/restart**, then `about` (and `stats` if
  any). Add step-once or skip-to-end in the same style where they fit.
- Every button is a Lucide-style SVG icon (24 viewBox, `fill:none; stroke:currentColor;
  stroke-width:2`, round caps and joins, drawn at 18px) in a 38×34 button. Pause swaps to play
  and its `aria-label` swaps with it. Slower/faster are the double-triangle rewind and
  fast-forward icons; scramble is Lucide `shuffle`.
- Speed is a readout between the two buttons, `60/s`, in a pill the same 34px height as the
  buttons (min-width 56px so the bar doesn't shift). Slower halves and faster doubles, clamped
  (1 to 512 there). No slider.
- Over a busy canvas each button and the readout gets a translucent dark fill with a 6px backdrop
  blur, so the bar stays readable on bright colors without a scrim across the field.
- Every control has a tooltip naming what it does and its key (`pause / resume (space)`,
  `Start over from random colors (R)`). Keys: Space pauses, R scrambles, and they're ignored while
  typing or while a modal is open.
- On phones the buttons shrink to 34px wide with 4px gaps, and the row lifts clear of the footer.

### Editor layout: left tool rail  *(anything you draw or build on a canvas)*
Mike likes this one. Use it whenever the page is an editor: you pick a tool, then act on the
canvas with it (draw, place, grow, erase). It's in the shared lib: `.tool-rail` > `.tool-group` >
`button.tool` (see the comment in `cohesion.css`), with `.is-active` on the current tool. Add
`.phone-split` for the phone layout below. Examples: `sketches/draw-maze/` (restyles
`.tool.is-active` in its own ink color) and `sketches/snowflake-studio/` (uses `.phone-split`).
- **The canvas is the page.** Fullscreen, with the rest floating over it.
- **Left rail, vertically centered.** Fixed `left: 16px; top: 50%`. Square icon buttons (40px,
  36px on phones) in rounded `--panel` groups with a soft shadow. Group by kind: the tools in one
  group, history (undo / redo / clear) in another.
- **One tool active at a time,** shown by an `--accent` fill. Tools are modes, so switching tools
  is how the user changes what a click or drag does; don't add mode toggles elsewhere.
- **Every tool button gets a `title`** that names the tool, its keyboard shortcut in parentheses,
  and what it does on the canvas: `"Erase (E): click a branch to remove it…"`. Wire the shortcuts,
  plus ⌘Z / ⇧⌘Z for undo and redo.
- **A per-tool hint line under the title** is usual (draw-maze has one); drop it only when the tools
  are self-explanatory and the tooltips cover it.
- **Show what will happen before it happens.** Hover previews in the canvas: where a drag would
  grow, where a cap would land, what an erase would take (in `--danger`). The preview should be the
  real result, ideally computed by trying the action and undoing it.
- **Guide the empty state.** A pill or overlay saying what to do first, placed where to do it.
- **Simple one-shot actions can be rail buttons**, in their own group (download is an icon at the
  bottom of snowflake-studio's rail). A bottom bar suits actions tied to the project's flow (draw-
  maze's play / show solution / share).
- **Chrome follows what the project offers.** Normally an editor still gets its about modal and
  any settings that improve the experience. Snowflake-studio is the unusual case with none: it
  wasn't interesting under the hood, it was self-explanatory, and no controls made it better. Only
  strip a project that bare when all three are true.
- **On phones** the rail stays on the left, smaller. When nothing else needs the bottom of the
  screen, add `.phone-split`: the tools become one horizontal row centered at the bottom, and the
  other groups (history, download) a row top right, level with the title (shrink the title to
  fit beside them).
- **Center the drawing in the space the chrome leaves.** On desktop that's the page center, with
  the rail's width kept clear on both sides; on a phone, centered between the title and the tool
  row. Recompute on resize. If stroke widths are in world units, floor their on-screen thickness
  so a small screen doesn't make the drawing spindly. Check it at 375×812.

### Settings modal  *(AI projects)*
- See "OpenRouter convention" below. Key field is shared infrastructure; model is per-project.

---

## Theming restraint  *(don't be cheesy)*

A theme is a **palette, a type pairing, and at most one signature motif.** That is the whole budget.
It is not license to rename real things into flavor text or bolt props onto the UI. Recurring failure
mode — err hard toward under-theming:

- **Never rename a control to fit the theme.** Sliders, buttons, and readouts say what they literally
  are, in plain language: `branch chance`, not `humidity`; `parameters`, not `conditions`. Every
  slider must map to an actual parameter of the sim. If a label isn't the real thing, it's wrong.
- **Never invent chrome or data.** No fake plate numbers, serial numbers, timestamps, gauges, rivets,
  or instrument frames. Diegetic HUD elements are allowed *only* when every number in them is real
  and useful.
- **Don't be contrarian about the obvious color.** If the subject has a natural color — snow is
  blue-white, lava is orange — use it. Reaching past the obvious choice for a "surprising" one is its
  own kind of try-hard, and it's still the theme talking louder than the work.
- **Test:** strip the palette and fonts away. If what's left reads as a clean, honest tool with
  plainly-named controls, the theme was doing its job. If the labels suddenly look mislabeled or the
  decorations look absurd, it was overdone.

## Using the shared lib in a themed project
- **Theme by overriding tokens**, not by fighting components — set the CSS custom properties on
  `:root` (palette + `--font-ui`/`--font-mono`/`--font-display`) and the shared components follow.
- **Reserved class names** (owned by `cohesion.css` — do NOT reuse for your own elements, or you'll
  inherit its styles): `.page .panel .control-panel .control .control-head .btn .btn-row .dropzone
  .control-bar .readout .section-label .title .intro .muted .mono .check .tool-rail .tool-group
  .tool`. Namespace project classes
  (e.g. `.plate-readout`, not `.readout`). This class-collision is an easy, silent bug.

## Conventions

### `?background` mode
Some sims are embedded as cycling backgrounds on the portfolio hero. When the URL has `?background`:
- Hide all chrome: control panels, stats, buttons, **and the footer**.
- Render just the visual, ideally auto-running. The shared lib handles the hide; the project just
  needs its visual to look good without UI. Only build a background variant **when Mike asks** — the
  `/make-background` skill handles it.
- **`<control-panel>` removes itself from the DOM** under `?background` — and everything inside it
  goes with it: the sliders, the checkboxes, the seed box. Any top-level code that does
  `document.getElementById("…").addEventListener(…)` on a control then throws on `null`, which kills
  the *entire* module: no resize, no animation, no visual at all. It fails silently as a blank page,
  not as an obvious error. Put all control wiring behind a `if (!isBackground())` guard, and guard
  any control reads elsewhere (e.g. `if (seedEl) seedEl.value = …`).
- The background variant should **evolve** rather than sit still: if the visual has a natural end,
  cycle it (grow → hold → cross-fade → new seed). Fade between states; a hard cut flashes behind
  whatever hero text it sits under.

### OpenRouter / bring-your-own-key  *(AI projects)*
All projects share the origin `quasarbright.github.io`, so **localStorage is shared across all of
them**. Use that:
- Store the key under one namespaced key: `quasarbright:openrouter-key`. A user pastes it once and it
  works on every project automatically.
- Provide a standard API-key field (password input) + helper: "Stored only in your browser — never
  sent anywhere except OpenRouter," a link to `openrouter.ai/keys`, and a Remove button.
- Support `?api-key=…` in the URL: on load, save it to localStorage, then **strip it from the URL**
  via `history.replaceState` so it doesn't linger in the address bar / history. (Lets Mike send
  friends pre-keyed links.)
- **Model** selection stays **per-project** (different projects want different models). Only the key
  is shared.

### Canvas / responsiveness
- Canvas sims fill the viewport and handle resize.
- Keep tools usable on mobile where reasonable (the portfolio tags some projects `mobile-friendly`).
- **No vignettes/scrims over fullscreen canvas sims.** Don't darken the edges or add a
  gradient behind overlay chrome (title, footer) to make text legible — it reads as a dirty
  smudge on the visual and looks worse than the legibility problem it's solving. If overlay text
  is hard to read against a busy/bright canvas, fix the *text* instead: strong opaque color
  (e.g. `var(--text)`, not `var(--muted)`) plus a solid multi-layer `text-shadow` for contrast.
  Never let overlay chrome dim or tint the actual visual.

### Webcam projects
- **Cover-fit, never letterbox.** Size the canvas/output to the viewport's aspect ratio, then crop
  the camera feed to match (zoom to fill) — don't size the canvas to the camera's native aspect and
  letterbox it to fit the viewport. Mobile front cameras often report a narrow/tall native rect that
  looks tiny and bar-boxed if you letterbox instead of crop.
- Pattern (see `conway-webcam`, `blobify-webcam`): compute a crop rect from the camera's native
  `videoWidth`/`videoHeight` against the target aspect ratio (viewport, or sim resolution) —
  crop the wider dimension if `camAR > targetAR`, else crop the taller one — then sample/draw only
  that crop. WebGL projects do this in a shader (`toCam()` UV mapping); 2D canvas projects do it via
  `drawImage(video, sx, sy, sw, sh, 0, 0, dw, dh)` with a cropped source rect (see `time-displacement`).

---

## Hard rules
- **No p5js.** Going forward, no new p5js projects.
- Always include the attribution footer.
- AI projects always use the shared OpenRouter key component.
- Dark theme by default; deviate only for a thematic reason, via token overrides.
- One renderer per kind of thing; special cases are disabled states of it, never separate markup.
