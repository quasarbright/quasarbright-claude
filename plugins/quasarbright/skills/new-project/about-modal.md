# About modals: explain how the whole thing works

The about modal is where someone who just played with the project finds out *why it does what it
does*. The bar: after reading it, they could explain the mechanism to a friend, and it feels like
something they could have come up with themselves.

**Gold standard: `sketches/draw-maze/` and `sketches/fireflies/`.** Open both about modals and read
their source before writing a new one. They cover both kinds of project: draw-maze has almost no
math, and its about modal is an algorithm built up step by step. Fireflies is mathy (phase,
coupling, the Kuramoto order parameter), with live diagrams of the real oscillators. Match their
depth, structure and diagram quality.

Load the `/explain` skill before writing one. This doc is the about-modal-specific part.

## Content

- **Intro (`<p class="intro">`):** one or two sentences: what the thing does, and the core move that
  makes it possible. Draw Maze: "Draw something, and you get a maze whose one route from entrance
  to exit traces your drawing. It works by choosing the route first and building the rest of the
  maze around it."
- **One section per idea, in the order you need them.** Each `section-label` names an idea in
  plain words ("one way through", "picking the route first", "from a drawing to a route"), not a
  field name or a topic heading. Each section builds on the last so the final one feels inevitable.
  Start from the most basic fact the rest depends on, even if it seems obvious (in Draw Maze, "a
  maze with no loops has exactly one route between any two cells" is what makes everything else
  work).
- **Ground before naming.** Describe the thing in everyday words first, then give it its name
  once: "corridors branch but never join back up, … is called a **tree**." Never lead with jargon.
- **Nothing is used before it's explained.** Not a parameter name in a formula, not "all four",
  not "the bars in the corner", not "the 30 starting snakes". Each term, number, group and piece
  of UI gets its plain-words description at or before its first mention, and a formula comes only
  after every name in it has been described. A diagram's legend (what each color, mark and box
  means) goes in the text before the diagram. Snake Pit's first full modal used `maturity` in the
  split formula before saying what it was, said "all four" of senses never grouped, and pointed at
  "the averages in the corner"; Mike: "you are referencing things before explaining them."
- **Say why, not just what.** Each step should come with the reason it's needed ("The route can't
  cross itself, and a drawing can be any shape, so the route can't just follow your strokes.").
- **Real sequences get numbered lists.** If the method is actually a series of steps, write it as
  an `<ol>`, and make the diagram step through the same stages with a caption naming each one.
- **Explain the visible quirks.** If the output has a behavior people will notice and wonder
  about, explain where it comes from (Draw Maze: why the path doesn't trace your strokes in order,
  and what happens where a letter forks).
- **Focus on the interesting part of "what's going on here".** This is not math vs.
  implementation. Sometimes the interesting part is the math (a rule, an equation). Sometimes it's
  the algorithm (Draw Maze has almost no math; the whole story is how the route gets built). When
  a project is mathy *and* the way it's simulated is clever, explain the math first, then give the
  implementation its own section after. What gets cut is the *uninteresting* part, whichever side
  it's on: boring plumbing (which framework, GPU vs CPU when nothing clever happens there, how the
  URL is encoded), tuning advice, and restating what a control's label already says. A one-line
  practical note at the end is fine (Draw Maze's "sharing": the link carries only the size, seed
  and strokes, and rebuilds the same maze).
- **Scale it to the idea.** The depth above is for ideas that need building up. When the idea fits
  in a sentence or two, say it in a sentence or two, with one picture if a picture shows it.
  The 2048 bot's modal is four short paragraphs and one board with the snake drawn on it: "the
  snake is the best position, so it's minimax with a score that rewards snakes." A first draft
  with five sections, four live diagrams and a section on the seeded RNG was too much ("way
  over-explaining"). Leave out side details that aren't the idea, even true and interesting ones.
- **Math where it helps.** KaTeX is available (`$…$`) for projects where a formula is the clearest
  statement. Don't add equations to look rigorous.

## Voice

Follow the writing rules in the plugin's `docs/CLAUDE.md` (`../../docs/CLAUDE.md` relative to this skill's folder): plain declarative sentences, no hype, no "Here's the thing:", no
antithesis reflex. The page is Mike's and speaks as him: first person ("my 2048 AI from 2020", "I
wrote this to…"), never "Mike's" or "Mike wrote". Short paragraphs (2–4 sentences). Use `<b>` only for a term being defined, and
color a word only when it matches a color in a diagram (e.g. `<span style="color:var(--accent)">
amber</span> is the route`).

## Live diagrams (one per idea that has a picture)

Every section whose idea can be shown gets a small animated diagram, and **the diagram runs the
project's real code**, not a reimplementation. That's what makes it trustworthy: the reader is
watching the actual mechanism.

- **Run the real functions on a small instance.** Draw Maze runs its real `build()` on a 16×10
  grid by temporarily swapping the grid globals (`withGrid(w, h, seed, strokes, fn)`), and the
  generator returns its intermediate stages (growth order, drawn blocks, the block route, the path
  before shuffling) so the diagram
  can replay them. If the real code doesn't expose a stage you need to show, make it return that
  data. Don't fork the logic.
- **Animate the idea, not decoration.** Each diagram should make one claim visible: routes between
  random pairs (there's always exactly one), corridors growing into dark unreached cells (the maze
  grows off the route), a staged walkthrough with captions (the method). Loop it, with a hold on
  the finished state before restarting.
- **Stage captions** go under the diagram (`<p class="…-caption">`) and name what is on screen
  right now; update the text from the animation loop.
- **Use the project's own colors** with the same meanings as in the main view, so the diagram
  teaches the reader how to read the real thing.
- **Size:** canvases at `width: 100%; max-width: ~440px; margin: auto`, height derived from the
  grid's aspect ratio. Size the backing store by devicePixelRatio. Don't let one diagram fill
  the whole modal.
- **Lifecycle:** modal content only exists while the modal is open (its HTML is copied in on
  open). Start and stop the loop with the shared events, and query canvases from the event's `el`:
  ```js
  document.addEventListener("cohesion-modal-open", (e) => {
    if (e.detail.className?.includes("cohesion-about")) startViz(e.detail.el);
  });
  document.addEventListener("cohesion-modal-close", (e) => {
    if (e.detail.className?.includes("cohesion-about")) cancelAnimationFrame(vizRAF);
  });
  ```
  (`cohesion.onAboutModalToggle(onOpen, onClose)` wraps the same thing.) Don't use `id`s that
  also exist on the page, since the content is a copy.

## Verify

Open the modal in the browser and screenshot each diagram at a couple of points in its loop (the
pane must be visible, or it lays out at zero width and rAF freezes). Check that each diagram
matches the sentence next to it: if the caption says "dark squares", the squares are visibly dark.
Then read the modal top to bottom as someone who's never seen the project, and actually list
every term, gene/parameter name, number with a meaning, group ("the four senses") and UI element
("the bars", "the tree button") with where it's first mentioned and where it's first explained.
Fix every one whose explanation comes later. Also check every step is motivated.

For animated diagrams, record every frame (toDataURL per rAF) or count changed pixels per frame,
and look for spikes: one-frame jumps don't show up in a few stills. A common cause is computing
tween progress before deciding to step that frame, which draws the new step at the old progress.
