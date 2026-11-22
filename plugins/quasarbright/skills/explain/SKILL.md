---
name: explain
description: How Mike (quasarbright) explains anything complicated — a 3blue1brown-style method for building intuition so an idea feels inevitable, like the audience could have arrived at it themselves. Use it for any explanation — a talk, talk script, slides, blog post, tutorial, teaching README, a project about-modal, a design rationale, a decision writeup, or just explaining a complicated thing in chat. NOT for reference docs, API listings, or content that only records facts.
---

# Explaining things the way Mike does

The goal, borrowed from 3blue1brown: **take the audience there with you.** Build the intuition and
the motivation so thoroughly that by the time the idea shows up, it feels inevitable — like they
could have arrived at it themselves. You are not presenting a result. You are re-creating the
conditions under which someone would discover it.

This works for anything complicated — an abstraction, a system, a design decision, a piece of history,
a plan, why some bug happened, an about-modal for a project. The examples below happen to be from a
Racket talk about lenses, but the moves are general.

Scale the method to the material (see "Scale it down" at the bottom) — but some of it always applies,
even for a quick explanation.

## The core engine: manufacture the need, then derive. Never declare.

Never introduce a construct cold. Find the pain it removes, **show that pain first with real,
annoying code**, and let the construct arrive as the resolution.

- Write the bad/verbose version and let it disappoint. In the lenses talk: two near-identical
  functions, then "let's circle the difference and make an abstraction." Later, the naive composed
  version gets "Doesn't look much better :(" on purpose — so the real fix lands.
- This is the *How to Design Programs* recipe used as the spine of the whole piece: spot the
  difference → abstract over it; define the data before you use it; show the failing case before the
  fix.

If you can't say what breaks without the abstraction, you haven't set it up yet. Back up.

## Prove impossibility with the smallest concrete failing case.

Don't say "it doesn't generalize." Show the one input that breaks it. Lenses can't do lists because
the getter would be `(Listof X) -> X`, "and if you have the empty list, you don't have anything to
return." The empty list *is* the argument. That single case motivates traversals.

Reach for the minimal counterexample every time. It's more convincing than any general claim, and
it's honest — you're showing the real boundary, not asserting one.

## Establish one mental model and plug everything into it.

Pick the load-bearing model early, make it visual/spatial if you can, and describe every later concept
as a *transformation of it*, not a new thing. Target/focus got established once; then composition,
traversals, and even isomorphisms ("feels very different, but watch") were all narrated as variations
on that one picture: "it's like we plopped the posn's diagram right into the orange part." Cognitive
load stays flat while the material gets harder.

## Voice the audience's next question, then try the obvious thing so it can fail.

Don't hand over the next abstraction. Reach for the obvious extension in front of everyone and let it
break — the failure is the motivation. "So can we do `list-rectangles-lens`? Here's what that would
look like… and it's weird." Pose the real design question out loud ("services on both subexpressions?
just the first?") and *then* answer it. The questions are genuine, not rhetorical filler.

## Control attention: mark the toys, name the real point.

Tell people where **not** to spend attention. "I don't know why you'd want to do that, but you can."
"You wouldn't use this alone — the real power is in composing." Separate cute-but-useless from
load-bearing so nobody over-invests in the wrong detail.

Then distill the payoff into **one true, memorable sentence**, stated plainly and repeated as a
refrain — but only *after* the derivation earns it. "Separate the where from the what." Never open
with it.

## Honesty is a technique, not just an ethic.

Credit sources in the flow ("Michael suggested that, I didn't come up with it"). Preempt criticism by
voicing it yourself. State limits flatly ("that's a limitation"). When you simplify, flag it — "this
is a crude oversimplification of how it really works" — which protects the experts in the room while
keeping it simple for everyone else. All of this makes the strong claims more trustworthy, because
you're clearly not hiding the ugly parts.

## Sentence-level mechanics that carry the voice.

- **"So" means *therefore*.** It's frequent because the explanation is a chain of derivation and "So"
  is the connective for "given that, this follows." It's load-bearing logic — don't strip it out.
- **Collaborative "we."** "We make an abstraction," "we get this." The audience derives it *with* you.
- **Two passes: intuitive, then precise.** Hand-wavy version first ("package the getter and modifier
  together — call it a lens"), then the exact definition with types. The informal version gives the
  precise one somewhere to land.
- **Enthusiasm points at a specific concrete relief**, never at adjectives. Not "lenses are elegant"
  but "when I saw I didn't have to write all that backtracking, I was so happy — that's honestly one
  of the reasons I'm giving this talk."

## Audience-aware jokes.

Small jokes aimed at people who'll get them, dropped without explanation and moved past. In a
Racket room: "no monads in this talk" and a jab about not using profunctors — both winks at the
Haskell crowd. Land it and keep going; don't explain the joke.

## Structure (optional, when there's enough to explain): plant and reveal.

For explanation-heavy pieces, you can teach a mechanism early as a self-contained pleasure, then
reveal it was the foundation all along — so when you need it, the audience already understands it
completely and the payoff slots in with no friction. The lenses talk teaches lenses "for fun," then:
"How could we possibly get immutable updates? Hint: it's what I've been talking about this whole
time." Only reach for this when the material has a clean gun to hang on the wall; don't manufacture
one.

## Scale it down — but don't throw it out.

The failure mode is dumping the whole toolkit on material that doesn't need it. A demo-driven talk, a
short post, an about-modal, or a piece where the pictures carry the argument does **not** want a long
derivation, a forced dead-end for every point, or a plant-and-reveal. Bloating something light with
manufactured motivation is worse than just showing the thing.

But scaling down is not the same as skipping it. Some of this always applies, no matter how short:

- **A little context and motivation before you talk about a thing.** Even one sentence on why this
  matters or what problem it's part of, before the details. Never open cold on mechanics.
- **Lead with intuition, keep it concrete**, and don't assert where you could motivate.
- **Never reference something before you've explained it.** A name, a symbol in a formula, a
  number, "the four X", a part of the screen: explain it in plain words at or before its first
  mention. Before finishing, list each term's first mention and first explanation and fix any
  where the explanation comes second.
- **Say what an operation acts on.** Never "divides by distance" or "each corner is divided by
  f": say what gets divided (a point's offset from the line of sight, divided by its distance).
  Mike, on the Perspectiven't About: "Don't just say something is getting divided without saying
  what." And when the simple story (rays per pixel) isn't how the thing really works (the GPU
  places corners), explain the real way too, with its own picture.

So read the material first and match the dose to it. For a heavy explanation, reach for the full
method. For a short one, you might use just the context-and-motivation opener and a concrete example.
When in doubt about how far to push, say what you'd change and why, and let Mike decide.
