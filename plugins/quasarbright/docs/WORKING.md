# WORKING.md: how to work with Mike

He brings ideas and decides what things are. He should never have to point out bad UX, unfinished
work or a bug that testing would have caught. Product taste is in `TASTE.md`.

## Before building

- **Check alignment when it matters.** When the idea is big or ambiguous, restate your
  understanding (or lay out options as light HTML mocks) and wait. When it's clear, just build.
  Say in one line which one you're doing, so he can ask for the restatement.
- **Brainstorm means options, then wait.** "Why does X happen?" and "anything missing?" get an
  explanation and suggestions, not edits. For a big new feature, show mocks and wait.

## While building

- **Do the literal ask.** When he specifies an algorithm, build that one, not a cheaper substitute.
  "Nudge X" changes only X. "Reuse X" changes how something is built, not what it is. A restyle
  changes no behavior; if any slips in, list it up front. Re-read his exact words before claiming
  something already matches.
- **Rethink after two failed patches.** When successive fixes make things worse, go back to the last
  good version and fix the structure. Prefer one general method over special cases. Show a quick
  prototype before committing to a big new direction.
- **Cheap check before expensive runs.** Try a small sample with early rejection, check the input
  is sane, confirm a timeout really kills the job, and warn before long memory-heavy jobs. Video
  previews render at low quality while iterating. 4K is only for the final render.
- **When he questions a number, test it** against an equivalent case instead of explaining it away.
  When one fact or instance is wrong, audit all of them. Apply fixes to every analogous place,
  including sibling variants and sibling projects.
- **Fix what you notice.** Mentioning a flaw doesn't count as handling it.
- **One place, every place, a test.** Keep each concept in one abstraction (a terms module, one
  renderer, one component) so a change is one edit. When he asks for a change, search the whole
  project for every place it touches, change all of them, list them in the report, and add a test
  that fails if it comes back. (He had to ask twice for "hire" to become "Schedule" because it was
  changed in one level only.)
- **Licenses and legal text** come from the authoritative source. Don't add copyright headers or his
  name to files.
- **When he'll be away,** keep going with placeholders and batch the questions. When a name is
  ambiguous between existing items, ask before deleting or replacing.

## Before you show it

He sees it finished. For anything visible:

1. Drive it like a user, through the visible controls. Test every way state can enter: fresh load,
   refresh, link load, live parameter changes, scrambled or mid-game states.
2. Test every variant at several sizes, including the biggest allowed. Test the second instance of
   a repeated thing as well as the first. Drag every handle, and click across the whole clickable
   range.
3. Look at mid-animation frames, not only rest states.
4. Screenshot new controls in their hover, active and disabled states, at 375×812, at desktop, and
   on a wide screen when layout changed. Send each screenshot or mock as its own full-resolution
   PNG (2x), numbered in order for a sequence (1-…, 2-…). Never stitch them into one combined
   image, and don't make a gallery page or artifact just to show them: a big stitched image is hard
   to zoom on his phone and loses quality. Every mock and screenshot carries a title and a one-line
   description, in the image itself or in its filename plus caption.
5. Read the console. Warnings are often the real bug.
6. For a reported bug, reproduce it in a failing test first. If he reports a class of bug twice,
   sweep for it everywhere.
7. Reproduce his exact scene before claiming a visual fix. If you can't, ask for his settings right
   away.
8. **Blind playtest** after a meaningful gameplay change (a game or anything played). Spawn a fresh
   subagent that gets only the URL and what a new player would know: no docs, no repo, no reasoning
   of yours, no memory of past playtests. It plays a real run through the visible controls and
   reports where it got confused, stuck, bored, or did something you didn't expect. It's a step in
   testing, not a persona: a new one every time, so it stays blind. Fix what it finds the same way
   as the review below.
9. Run the `ux-review` skill. A fresh subagent, without your reasoning, plays with it in a
   browser, judges it against `TASTE.md` and `UX-CHECKLIST.md`, and compares it with sibling
   variants and projects. You decide which findings are real: fix those, drop the ones that are
   clearly the reviewer misunderstanding, and ask him about anything you're unsure of. Then demo.

## Recording what he corrects

Record every correction in the same turn. Product taste goes in `TASTE.md`, written as a principle,
and only when it's really general. A low-level UX rule goes in `UX-CHECKLIST.md`. Process goes here.
Project-specific details and technical gotchas go in memories. If he corrects something these files
already cover, the line wasn't strong enough to prevent the miss, so sharpen it. Write each lesson at
the level it applies to. A choice made for one project, or a rejection during a brainstorm, is not
a standing rule.
