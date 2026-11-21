# TASTE.md: Mike's product taste

What makes a good website, little game, simulation or tool, for Mike. Creative direction (what the
thing is) is his. Whether it's nice to use (polished, convenient, not awkward) is yours to get right
without being told. These principles come from the projects he likes and from about 1,000 of his
corrections across past sessions. The detailed, low-level rules behind them live in
`UX-CHECKLIST.md`, which the UX reviewer uses. How to work with him is in `WORKING.md`.

All of these are judgment calls. Each one says what to aim for. When to apply it is up to you.

## Principles

**1. The thing is the star.** People come for the puzzle, the simulation or the picture, so it
gets the screen and the first second. Everything else is small, tucked to the edges, and quiet
until needed. In Cutwist, the puzzle fills the window and every control is a small label in a
corner. Even Tetris's start screen keeps the live board visible, blurred behind the menu.

**2. You work on the thing itself.** Where possible, you change something by grabbing it, not by
editing numbers in a panel about it. Cutwist's editor started as a parameter panel and ended as
dots and cuts you drag on the puzzle, with a small tool rail. Its puzzle picker is a gallery of
pictures of the puzzles. When controls are needed, they're in the concepts a user thinks in (size,
shape). Implementation knobs (repulsion radius, smoothing, debug stats) make it feel like a dev
tool.

**3. It's good the moment it loads.** No setup, no blank canvas, no reading first. It opens on
something worth looking at, and the first touch does something satisfying. A sim invites you to
push it to the extremes, so it lets you. The exception is when making the starting thing is the
experience: differential growth opens on an empty "draw a curve" screen on purpose.

**4. It explains itself.** You can tell what's happening and what you can do without instructions:
short hint lines that change with the mode, tooltips on everything, a solved card that shows the
goal, interactive things that look interactive. Attention goes to the right thing at the right
moment. Pulsing, color and motion are good for pointing at what matters, and slow motion can be
part of the look (an aurora), but lots of things competing for attention is distracting.

**5. It's true to the real thing.** The visuals come from the real math, geometry, rules or
algorithm, and the user gets to play with the real idea: Cutwist's real cuts and real
puzzle-community color schemes, and Tetris running his actual 2020 AI. Real-world things look like
the real thing. Faked stand-ins break the trust.

**6. Identity fits the kind of thing, and knows when to stop.** A game should feel like a game:
Tetris has a chunky logo, candy blocks, a score pill and big pressable buttons. A tool or sim
borrows its character from its subject: Cutwist is a dark backdrop, a wordmark, and the puzzles'
own colors doing the work. Theme by hinting. Going on-the-nose (flavor text, invented chrome,
everything themed) turns cheesy. When unsure, do less.

**7. It's one finished, cared-for object.** It works and looks right on a phone, a laptop and a 4K
monitor. Effects like glow or bloom are done properly or left out. Differential growth's core is
good, but its bloom and its scaling to big and small screens were never right, and that's what
keeps it from feeling finished. It has one visual language, its variants feel like a family with
feature parity (what one variant does well, every variant does), and
nothing pops, jumps or jars. Everything in a row is the same height, and each section of like
things is a grid ("vertical alignment, same height stuff in a row. Makes everything nice and
neat"). A row of mismatched heights reads as disgusting even when each piece is fine.

## Reference projects

Open these to calibrate. They're on Pages, and the source is in `~/GitHub`.

- **Feels right: Cutwist** (`cutwist/`, quasarbright.github.io/cutwist). It took a lot of iteration.
  Its git history shows a panel-and-toolbar UI turning into the subject plus corner controls, with
  editing moved onto the puzzle itself.
- **Pretty good: Tetris** (`tetris/`, quasarbright.github.io/tetris). The reference for game feel.
- **Core UX fine, not finished: Differential growth** (`sketches/differential-growth/`). Bloom and
  big and small screens were never right, and its controls are physics constants. Its empty
  opening screen and its growth filling the whole window are on purpose.

## Confirmed defaults

Concrete choices he has confirmed. They are defaults, not laws.

- Speed controls are halve and double buttons (plus skip-to-end where it fits), not a slider.
- Icons are real SVG icons (Lucide style), never unicode glyphs.
- Undo comes with redo and covers every change.
- Glow means fading heat over a still-visible structure. No neon or bloom blobs.
- Simple toys skip the about modal. Ideas worth explaining get one, scaled to the idea.
- Copy is first person ("my", never "Mike's"), and a game's bot is "the AI".
