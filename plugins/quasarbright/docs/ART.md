# ART.md: lessons for game and illustration art

General lessons from Mike's verdicts on art (characters, objects, icons, illustrations). Loaded on
demand: read it before drawing or mocking art. Screens and controls are in `TASTE.md` and
`UX-CHECKLIST.md`; how lessons get here is in `WORKING.md`, "Lessons from his verdicts". Write
each line as a general default. A choice made for one project stays in that project.

## Medium

- **Hand-made SVG first; AI images only when Mike asks,** as a final polish pass with the
  `quasarbright:image-gen` skill (`steering/rules/art-svg-first.md`). The skill has the lessons on
  generated art: style, keeping a set consistent, and showing it inside the real game.

## Drawing things

- **Different things never read alike.** Check every new object next to its neighbors at the size
  it really appears. (Clanker Tycoon, 2026-11-19: a crate drawn as a slightly bigger box was "too
  similar to box". The fix gave it a different material, shape and markings, not a different size.)
- **Readable at real size.** Judge art at the size and on the background it'll be used on, at
  laptop and big-monitor sizes, not zoomed in a mock. Color that carries meaning in the game (team,
  item type, money) stays clear; decoration never competes with it.
- **One drawing per thing,** shared by every place it shows (the world, lists, chat, tickets, the
  shop). A thing that looks different in two places reads as two things.
- **You can see what something can do by looking at it.** Abilities show as things a character
  carries or wears (a brush for painting, glasses for smart, wheels for fast), so a glance tells
  you what it's for. Every new ability gets a look.
- **Simple, clean shapes over texture.** A stylized redraw has to read as the intended thing at a
  glance; when it reads as something else (a face that "looks like bacteria"), simplify the shapes
  rather than adding detail.

## Style

- **Charm comes from real objects carrying real results** (a stamp on an actual miss, the newspaper
  about your actual run), never from decorative borders, backgrounds or invented props. Art goes on
  things the player uses. When unsure, do less (`TASTE.md` 6).
- **Variations of a character keep the character.** Expressions or poses change the face and
  pose, and keep the same head, proportions and lighting, so it's clearly the same one.
- **Reference photos are for calibrating, not copying.** Mike may reject a whole set of references
  ("I don't like any of those"); then the current drawing stands. Don't keep pushing references.

## From mock to build

- **What he picked is what gets built, literally:** same proportions, colors, parts and size
  relative to its neighbors. Hand the build the picked mock's image and source, not a prose
  summary, and put the built screenshot beside the mock before he sees it (`WORKING.md`, "Before
  you show it"). (Clanker Tycoon, 2026-11-19: the picked crate shipped smaller, with a plain dot
  for its color tag and no corner plates: "wtf is this? we just agreed on the crate art and it was
  something else". The second try still missed: "Still not the version you showed me that I liked".)
