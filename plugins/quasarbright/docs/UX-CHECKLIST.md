# UX-CHECKLIST.md: low-level UX rules from Mike's corrections

The concrete rules behind `TASTE.md`, from a 2026-11-16 audit of 77 sessions (1,077 corrections and
preferences) plus the feedback memories. The UX reviewer checks work against this list, and it's
worth skimming before building UI. Each line is a default distilled from real corrections, so use
judgment. Raw findings: `.taste-audit/findings-2026-11-16.json`.

## Controls

- **Show only what applies.** Hide a control, menu or panel that is empty, blank, disabled or
  meaningless in the current mode. Graying it out isn't enough. Don't render a view dropdown with
  nothing in it, or stats that read 0.
- **A disabled control looks disabled:** gray, no fill, not-allowed cursor. A control looks like
  what it does. Don't style a full-screen gallery opener as a dropdown. Symmetric controls get
  symmetric styling. A disabled control says why, on or next to it ("$25 short", "Needs a paint
  machine"), not just gray.
- **Sliders go from none or least on the left to most on the right.** 0 means unchanged. They snap
  wherever the result's structure changes (piece count, a face becoming regular, a named shape).
  Find those snap values by measuring, and set snap thresholds in screen pixels. Two sizes that
  can match (a back plane and a screen) snap at 1:1, and the readout names that point.
- **A control's label says what its number means:** the unit, and whether it's absolute or a
  ratio of something ("× screen", "m"). If a newcomer would have to ask "the ratio or the size?",
  rename it. A control with no effect in the current mode says so next to it.
- **No arbitrary maximums.** Let numbers go as big as they want, and let degenerate values (0, 1)
  do their natural thing. If a limit is real, show it and say why. Once he says "no max" for one
  kind of input, apply it to every input of that kind.
- **Expose the parameter people think in** (size N), not raw internals that can produce broken
  states (cut depth, explode). Debug views and internal stats don't ship. Put them behind a URL
  flag or remove them.
- **Editing one parameter never silently changes another.** Clamp at the limit instead. A
  same-named parameter means the same thing on every sibling variant, and its name says exactly
  what it changes.
- **Cut toggles for things that should always be on**, and modes a gesture already covers
  (long-press or right-click instead of a flag-mode button). Don't gate an action behind a
  selection: give it a sensible default target. Don't gate a requested control behind a condition
  he didn't ask for.
- **Fewer controls, one smart button.** Fold buttons that serve the same goal into one stateful
  button. A button for state that's already set offers the inverse. Prefer a few direct action
  buttons over a configurable system.
- **Never auto-advance after a mark, pick or answer.** The control fills in and stays put; the
  user moves on with the arrows themselves. Auto-advance hides the confirmation and takes control
  away (a review page that jumped to the next picture on thumbs-up, 2026-11-19).
- **Color follows meaning.** Two versions of the same action (a small and a big loan) share one
  style; the muted or outlined style is only for Cancel. A big option that looks like a cancel
  button reads as one.
- **Toggles need visible controls.** No clickable readouts, and no core actions that only live in
  a right-click menu.
- **Speed controls** are halve and double buttons plus skip-to-end. Live controls update on every
  input event, not on release.
- **Icons** are real SVG icons (Lucide style), never unicode glyphs, which turn into emoji on iOS.
  The same concept uses the same icon everywhere. Undo always comes with redo.
- **Undo covers every state change**, including bulk generators, at the user's unit of progress
  (one cell of path, not one whole drag). Undo and redo replay the animation in reverse rather
  than jumping.
- **Repeating an action compounds on the current state.** Never bundle a hidden reset into it.
  Operations preserve unrelated state, like the view mode.

## Direct manipulation

- **The thing under the pointer is the thing that moves.** A drag stays bound to the object it
  started on. It never re-picks mid-gesture, jumps to a clone, or snaps to the nearest point.
  Dragged things move continuously along their constraint. A grabbed handle never jumps, including
  on state loaded from a link.
- **Toy-like direct control beats simulated physics.** No acceleration limits on drags. Basic game
  actions are instant unless the delay is the mechanic. When a target is blocked, move as far as
  allowed toward the pointer.
- **Before a click, show what it will do:** a hover affordance (cursor plus highlight), and
  highlights only on actionable targets, with a not-allowed cursor elsewhere. Every interactive
  thing looks interactive at rest. Mark it by restyling the thing itself, in the project's
  "interactive" color, not by laying a widget over it. Hover and click precedence match what's
  visibly on top.
- **Small specific targets win over large ones** where they overlap (a dot over a line). Hit areas
  are separate from game-rule distances, and tap targets are finger-sized (about 42px) on phones.
- **A carried item never hides where it will land.** It targets the nearest valid spot, and drop
  positions come from the same geometry that draws the row.
- **Choose things by clicking them in the world**, not in a separate picker. Show choices on the
  object, not behind a toggle.
- **The camera starts somewhere a person could stand.** No eye, lens or sensor inside the ground or
  an object on load or after a mode switch. When a view looks into something solid, fix where
  the camera is, not how the inside looks.
- **3D objects you hold** (puzzles, models) use arcball/trackball rotation with no poles. Orbit with
  an up axis is only for scenes with a ground. View operations (camera, zoom, pan) never change
  state. Test them in scrambled states.
- **Free flight:** Q/E roll with no auto-level, space for up and ctrl for down, speeds in units per
  second, and a hint when you're not flying.
- **Keyboard shortcuts on the hovered thing** keep working without a new pointer move. Every input
  path (tap, key, click without hover) plays the same animations as the mouse.

## UX and flow

- **The UI follows the project's flow:** phases rather than toggles, a left tool rail for editors,
  and a guided first state. Whether a game needs a start screen depends on the game: one with
  level select may want it, while something like 2048 just opens on the saved board.
- **Nothing waits without moving.** Anything that takes time shows progress. State changes show up
  immediately, with no stale objects that look usable. When several outcomes happen at once, show
  all of them. Say waiting in words ("thinking", "reading"): no filling meters for waits, no
  animated dots, and nothing shaped like a speech bubble, which reads as talking.
- **Constraints show up in the world** (things stop where the track ends), not as text messages.
  Cause and effect is visible: wire controls to what they control, and show the zone a rule depends
  on. Any state that restricts the user gets a persistent visible explanation.
- **Editors make invalid states impossible** rather than warning later. Guardrails warn without
  blocking and offer undo. Warnings sit inline next to the bad value.
- **Editor basics:** standard verbs (Open, Save, Save As), a beforeunload guard on unsaved work, a
  file picker rather than a typed path, never overwriting shipped assets, lists that refresh after
  writes, and no intermediate dialog when there's only one meaningful choice. "New" opens straight
  into an editable default. Personal authoring tools save to real repo files through a small dev
  server.
- **Don't ask for setup that can be inferred** (player count from who joins). Defaults show the
  project at its best on first load. Optional subsystems start off, heavy or experimental views
  default off, and new elements start small.
- **Games:** every ending gets an end card (won, lost, stuck) with next actions. Tell a newcomer the
  goal and the first action. The first level is the single simplest action. Tutorials teach one
  idea with the fewest pieces, and each mechanic gets a hands-on step before automated play.
  Puzzles are built around a trick that seems impossible until seen, with no precision or timing
  solutions, no busywork and no hidden extra win conditions. Check win state continuously,
  including the initial state. Scores the player earns exclude AI help. Games get game UI (see
  [[feedback-games-get-game-ui]]).
- **Show what's true, not projections that assume how the user works.** A mid-run card says the
  plain counts ("6 of 20 shipped, 2 shifts left"). A pace projection ("about 18 of 20 at this
  rate") assumes the work goes evenly, which it often doesn't, so Mike dropped it in Clanker Tycoon
  (2026-11-17, replacing this line's old advice). A card that closes a period shows the period's
  totals; per-step numbers say so ("this shift"). Copy never points at an action that doesn't
  exist.
- **Offer help where and when it's needed.** An option that only matters in one situation (a loan
  when something is unaffordable) shows up next to that thing at that moment ("need some money?"),
  rather than holding a fixed spot on the screen.
- **Actors never start on top of each other.** Anything placed on spawn (robots, pieces, labels)
  gets its own spot, so names and carried items don't cover a neighbor.
- **Hints show moves you missed** using plain rules. They point only at things the player can act
  on and don't narrate the obvious.
- **Share links** reproduce the exact state in one short parameter. Prefer readable URL params with
  the main choice first.
- **Popups close on any outside click**, mobile included. Overlays never hide content you can't
  scroll to. When a capability (WebGL, camera) fails, show a plain on-page message with the likely
  fix.
- **Simple toys don't get an about modal.** Add one only when there's an idea worth explaining.

## Layout

- **Corner-anchored UI shares one inset.** A side drawer shifts the whole layout over instead of
  overlapping it. The main play area stays fixed while side lists scroll. Split views stack
  vertically on portrait phones.
- **Group controls by role**, and give a new panel a real design pass (hierarchy, small secondary
  controls) before showing it, not a pile of equal buttons. When a new interaction replaces an
  old one, remove the old chrome. Visual weight follows the primary action, and only the one main
  action gets primary styling.
- **Content gets the space.** On phone game layouts the play area and the main move buttons win.
  Landing pages skip gratuitous stats. A single-screen page doesn't scroll at any size. Avoid
  scrolling wherever it can be avoided: only inner lists scroll, and on desktop use the width
  (columns side by side) rather than a tall stack. Content is fit and centered with generous padding.
- **Text never touches its container.** Text inside a band, badge, chip or button keeps visible
  padding from the edges and from any mark beside it (a card's team letter, an icon). Check the
  longest label at the smallest and the desktop size; shrink long labels rather than letting them
  crowd. "need a bit more padding. i should not have to tell you this" (onuw card name band,
  2026-11-21). Where a layout is generated, add a test that measures the gaps.
- **No tabs when it fits.** On a wide screen, sections that fit side by side show all at once in
  columns, not behind tabs ("No tabs. All at once in columns.").
- **Everything in a row is the same height.** His most repeated layout complaint, and the problem
  is big height differences, not pixels: "things have totally different heights ... when you have
  something in a row, all of the heights should be the same. Otherwise, it looks disgusting"
  (2026-11-21). Earlier: contracts "should all have the same height" and the contracts/Start row was
  "hideous" (2026-11-18 and 19), the review page's buttons moved with caption height (2026-11-19),
  and the Assembler row ("you keep fucking up vertical alignment", 2026-11-21).
  - **Every row:** all items the same height, always. Stretch them to the tallest, or give them one
    fixed height and fit the content inside.
  - **Within a section, a grid.** Items of one kind presented together (the contracts, the shop's
    cards, slots in a tray) share a cell size and line up in rows and columns.
  - **Sections don't need to share a grid with each other** (the contracts and the shop below them
    can differ). A one-off control beside a section (a Start button) may be the exception, but the
    section itself stays a grid.
  - Variable content never moves fixed parts: a caption gets a fixed slot (clamped lines), and each
    card's action sits in the same place in every card, so one long description doesn't push its
    button out of line. A primary action lines up with what it acts on.
  - Check it in the browser: read each row's `getBoundingClientRect()` heights and edges, in every
    frame of a sequence. Same-row heights that differ are a bug.
- **Show the full and overflowing state.** A row, tray or list that grows (items waiting, crew,
  contracts) gets screenshotted at its largest realistic count, not just the tidy example. Decide
  up front what happens when it runs out of room (a fixed number of cells plus "+3", a scroll, or
  smaller cells) and show that picture with the item; he will ask "what will it look like?"
- **A lone picture is fullscreen**, never a floating panel. The footer always floats and is never
  inside a panel.
- **Labels never sit on other marks.** After any change, sweep every label for collisions, not just
  the reported one. Hand-placed fixes are fine. Never shorten Mike's content to make it fit: change
  the layout, or ask. Short-lived effects (a "+points" popup, a burst of confetti) may pass over a
  label for a moment; that's fine, though placing them clear of it is a little better.
- **Check every size:** 375×812 phone, desktop, and wide screens up to 4K.

## Visual

- **Design before the first demo.** Never show unstyled default buttons. After a layout rebuild,
  critique the screenshot like a designer before reporting.
- **Don't over-theme:** a palette, a typeface and one motif. No flavor-text controls, invented
  "signature" chrome or in-joke messages. Keep themes simple and not on-the-nose. Diegetic HUD
  chrome is fine when it's real and proportionate.
- **Text over arbitrary colors needs protection:** white with a dark outline or shadow, drawn on
  top. Never encode state by fading text people need to read. Test against the brightest
  background. When the background varies (a random or live background, user images), screenshot
  every label over the brightest and busiest one, small and muted text included (counts, dates,
  links): muted gray with a light shadow vanishes over light gray. Protect text locally rather than
  dimming the whole background.
- **Contrast:** measure 4.5:1 on every label (3:1 for large text) with `ux-review`'s
  `contrast-check.mjs`, which reads the real pixels behind the text, and audit borders. Dark gray on black is the default
  failure. Judge each color against its neighbors in the palette as well as the background.
- **Palettes:** check every pair for confusability (white/beige, red/orange). Use real standard
  schemes for named objects (cube colors with their opposite pairs). Color ramps reach full
  vividness at one end, not muted everywhere. When colors could be confused, add per-color
  textures and use them everywhere that color appears.
- **No colored stripe down the left edge** of rows, cards, quotes or callouts, for selection,
  status or emphasis (he asked why it keeps showing up). Mark the selected row by lighting the
  whole row, and show status with a chip or the thing's own color.
- **Money is green, losses and costs red** (Mike, 2026-11-18: "Money amounts should generally be
  green ... Or red for losses"). Prices on buttons stay neutral.
- **One cue per distinction.** Don't stack a second channel that doesn't help, and don't propose a
  cue on a channel that already means something. Color picks one thing out of many or tells many
  apart. An entity's color carries to everything that represents it.
- **Real things look like the real thing:** curved rails, real planet colors, real logos, real icon
  sets, real puzzle cuts. When he sends a reference, match it detail for detail side by side, and
  use the real published formula. Visuals reflect actual state: no flame when the engine is off,
  and "fully cooked" looks fully cooked.
- **3D quality bar:** smooth analytic surfaces, analytic normals and crisp shader-drawn lines, not
  painted textures. Look up close and from every side. Check for slivers, seams, pop-in and
  textures blurry at real zoom. Render at device pixel ratio.
- **Cameras: the viewer's eye never moves when the lens or mode changes.** Swapping projection
  (perspective, orthographic, any lens) or morphing between them keeps the eye at the same point
  and the same height: anything above eye height stays above the middle of the screen. Never
  offset, raise or pull back the view to dodge geometry (it reads as third-person, and he had to
  say it twice). Solve clipping some other way, such as treating rays that start inside a solid as
  hitting it. Add an automated test of the invariant across every mode and mid-morph.
- **Glow means fading heat over a still-visible structure.** No neon, bloom or glow blobs.
  Pulsing is situational: good for drawing attention to the one thing that matters, or as a slow
  part of the look, and distracting when lots of things pulse. Prefer color pulses on existing
  parts, with no size change.
- **Asked for a small addition? Add only that.** Layer it onto the existing look. Don't restyle what
  was approved or redesign what works. A cleanup removes only what he named: deleting a nearby
  sentence or control he didn't mention is a regression ("I didn't say get rid of the 10% per
  contract sentence"). Color words in casual requests mean the nearest shade in
  the existing palette.
- **Several variants means genuinely different ones**, not one template with a single value
  swapped. Next to a big redesign, include a small-change option, since he often prefers tweaking.
- **In a redesign, keep what worked:** list every default and affordance of the old version and
  carry each over, or say which ones are dropped.
- **Highlight only what the point is about**, at the granularity of the meaningful unit (names, not
  regions). Recolor tokens rather than drawing boxes around them. Leave the surrounding text plain.
- **Feature parity: the best of every variant, everywhere.** Whenever there are several versions
  of a thing (sibling projects, variants, modes, or kinds of item on one page), list what each one
  does well and give every one all of it: styling, icons, controls, shortcuts, the dev server. He
  calls this a key principle and has had to repeat it ("I shouldn't really have to tell you this",
  2026-11-21: on the review page a note on a pick counted as an answer, but a note on an approval
  still needed a thumbs up or down). Check it before showing, in both directions: what this variant
  lacks from its siblings, and what the siblings lack from it.

## Motion

- **Nothing moves without a reason.** No idle motion on things the user manipulates, no
  auto-rotating demo cameras and no pulsing static markers. Camera moves need a reason. In a
  camera move, only the camera moves.
- **Nothing teleports.** Position changes animate. Sizes are computed the same way mid-motion and
  at rest. Decorations move with their object, and moving things draw above still ones.
- **Fade, don't pop or cut**, with timing tied to the motion it accompanies. No major cross-fades:
  fade fully out, then in. Things that persist across beats stay on screen instead of fading out
  and back in. Never leave a blank screen between blocks.
- **Snappy beats simulated.** Tweak a feel before rebuilding it. Pace by total time and derive the
  rate. Drawing animations run at constant speed. Visual decay runs on wall-clock time. Automatic
  finishes play one move at a time so each one is felt.
- **Animate only transform and opacity.** Measure CPU, not fps.

## Copy and explanations

- **Plain voice** (see CLAUDE.md). First person on his projects, never "Mike's". The bot is "the
  AI". Title case for titles and headers. Don't reference his other projects or internal lineage
  that visitors don't know about. Drop self-attribution on pages that are already about him.
- **Name things in the domain's words** (cubers say "algorithms"; it warps, so "Warp to"). Use plain
  words over jargon and the established real-world name for known objects. Keep one naming pattern
  across a family. Destructive actions name their scope ("Kick from table"). The same action gets
  the same label everywhere. When a term is renamed, rename it everywhere.
- **Explanations start from what the reader would naively assume**, show where that breaks, then
  show the real method. Never motivate with a question nobody asks. Use the most familiar example
  at the size where the effect is easiest to see. Use a static labeled table for a set the reader
  compares. Readability beats engine fidelity, so relabel freely.
- **Diagrams demonstrate their claim:** they show the real method and real math, never a faked
  stand-in, and build up as the text introduces each part. In a comparison, hold everything else
  constant. An animation shows why, not just that. If it can't, use math.
- **About-modal depth matches the idea.** A one-sentence idea gets a few lines and one picture. Cut
  the boring parts and lead with the interesting math.
- **Ground jargon before using it.** No name or symbol before its plain explanation.
- **Docs:** realistic examples in mainstream languages, every output preceded by the exact code that
  made it, and structure described in general terms rather than file lists that go stale.
- **In chat:** answer the question actually asked, on the exact code he gave. Give tabular data as
  a markdown table. Describe concepts in domain terms, not input mechanics ("don't say clicks").
  Show UI options as HTML mocks, not text or ASCII.

## Carried over from html-artifacts

- **Math is typeset with KaTeX**, never hand-rolled ASCII, `<sup>`/`<sub>` or unicode soup.
- **Nothing overflows its container.** Flex and grid children get `min-width: 0` (grid columns
  `minmax(0, 1fr)`), wide tables, `<pre>` and SVGs get `max-width: 100%` or their own
  `overflow-x: auto` scroller, and long unbroken strings get `overflow-wrap: anywhere`. Check at the
  narrowest column, including when a sidebar squeezes it.
- **Open a page for him only when it's first created.** On later edits, say it's updated and to
  refresh; don't open another tab.
- **Throwaway editors end with a copy-as-text export** written as a plain-language instruction
  someone could act on cold, listing only what changed from the defaults (numbers plus a short
  qualitative reading).
