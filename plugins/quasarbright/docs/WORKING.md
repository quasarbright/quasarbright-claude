# WORKING.md: how to work with Mike

He brings ideas and decides what things are. He should never have to point out bad UX, unfinished
work or a bug that testing would have caught. Product taste is in `TASTE.md`. Working inside a
Claude project (coordinator, threads, review page, personas) is in `PROJECTS.md`.

## Before building

- **Check alignment when it matters.** When the idea is big or ambiguous, restate your
  understanding (or lay out options as light HTML mocks) and wait. When it's clear, just build.
  Say in one line which one you're doing, so he can ask for the restatement.
- **Give a few options with a recommendation, then record what he actually picks.** He decides by
  picking from short option lists, and often reshapes the pick: offered four ways to make a missed
  contract cost something, he took "strikes" and turned it into reputation (Clanker Tycoon decision
  78). Write down his reshaped version, not the option as you wrote it.
- **His rules are his current view, not law.** When one of his standing rules blocks what he's
  asking for, name the rule and let him choose. He reversed "no factory building" himself once the
  game needed it (Clanker Tycoon decision 85).
- **Brainstorm means options, then wait.** "Why does X happen?" and "anything missing?" get an
  explanation and suggestions, not edits.
- **Visual work starts as mocks a judge filters.** Before building a new screen, art or a restyle,
  make two to four quick mocks in different directions; the UI/UX persona (or a fresh subagent)
  picks one against his past verdicts (the `persona` skill, "A review"). He sees it next to the
  current screen as an approval, or a pick if two real directions are close. Exact small asks skip
  this. Before building in an area, read its lessons from the taste store (`persona` skill).
- **Games: mechanics first, flavor later.** Settle the mechanics (rules, progression, balance)
  before adding story, personality and flavor. Those come in a later polish phase, once the
  mechanics have stopped changing.

- **Keep the issue in the loop.** When work starts on a project that has a GitHub issue, comment
  on the issue that it's in progress. Once it's published anywhere (Pages, a branch, the
  portfolio), comment the link, even though the issue stays open. Don't close it unless asked.

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

**First, the sibling sweep. It's mandatory and it's the check he most often has to do for you.**
Before any other step, write down every instance of the kind of thing you changed: every card,
button, pill, row, mode or screen of that kind, including the special cases (a fixed count, a
locked item, an item with no options), the other viewers (host and guest, owner and visitor) and
the disabled, empty and maxed states. Find them from the code (the registry, the list, the switch
over kinds), not from memory. Then check each one has the change and looks and behaves like the
rest. A special case is a state of the same component (shown, with controls disabled), never left
out or given its own look. Put the list in your report to him and in the `ux-review` brief. (A
card game showed "×2" as a plain badge on the one card with a fixed pair while every other card
had a − ×N + pill, after a rule about feature parity was already in `TASTE.md`.)


1. Drive it like a user, through the visible controls. Test every way state can enter: fresh load,
   refresh, link load, live parameter changes, scrambled or mid-game states.
2. Test every variant at several sizes, including the biggest allowed. Test the second instance of
   a repeated thing as well as the first. Drag every handle, and click across the whole clickable
   range.
   Fill every row, tray and list that grows to its largest realistic count, and measure sibling
   edges in the browser (the UI lesson "Everything in a row is the same height").
3. Look at mid-animation frames, not only rest states.
4. Screenshot new controls in their hover, active and disabled states, at 375×812, at desktop, and
   on a wide screen when layout changed. Send each screenshot or mock as its own full-resolution
   PNG (2x), numbered in order for a sequence (1-…, 2-…). Never stitch them into one combined
   image, and don't make a gallery page or artifact just to show them: a big stitched image is hard
   to zoom on his phone and loses quality. Every mock, screenshot and clip carries a short title and a
   one-line description, in the image itself or in its filename plus caption.
   When the change involves motion or animation, also send a short MP4 clip (a few seconds) as its
   own file next to the screenshots. Clips are only for motion, never for static UI.
5. Read the console. Warnings are often the real bug.
6. For a reported bug, reproduce it in a failing test first. If he reports a class of bug twice,
   sweep for it everywhere.
7. **Built from a picked mock? Match it literally.** Put the built screenshot beside the picked mock
   and check every part, proportion, color and size against its neighbors before he sees it. (A
   picked crate shipped wrong twice in Clanker Tycoon, and he caught it both times.)
   Reproduce his exact scene before claiming a visual fix. If you can't, ask for his settings right
   away.
8. **Blind playtest** after a meaningful gameplay change (a game or anything played). Spawn a fresh
   subagent, called Darby (the persona skill's Names table), that gets only the URL and what a new player would know: no docs, no repo, no reasoning
   of yours, no memory of past playtests. It plays a real run through the visible controls and
   reports where it got confused, stuck, bored, or did something you didn't expect. It's a step in
   testing, not a persona: a new one every time, so it stays blind. Fix what it finds the same way
   as the review below. If the game calls a model and the session can't reach one (a cloud
   session: no `claude -p` login, no API key), check the project for a model bridge before
   faking it: clanker-tycoon has one (`docs/cloud-playtest.md`), where a background Haiku
   subagent answers the game's model calls through files. Playtest on Mike's Mac when it's
   online, and use a cloud bridge only when the Mac can't be reached. The playtester still gets only the URL
   and how to open the page.
9. Run the `ux-review` skill. A fresh subagent, without your reasoning, plays with it in a
   browser, judges it against `TASTE.md` and the UI lessons, and compares it with sibling
   variants and projects. You decide which findings are real: fix those, drop the ones that are
   clearly the reviewer misunderstanding, and ask him about anything you're unsure of. If the
   project has a UI/UX persona (below), it reviews the change and the screenshots too. Then demo.
   Mocks get this review too, every option, before they go out: a mock he picks becomes the build,
   so a flaw in it is a flaw he'd have to point out. (A portfolio header mock with a count he
   couldn't read over a bright background went out unreviewed.)

Tests pass before every push.

## Lessons from his verdicts

Every approval, rejection or comment (on a review page or in chat) and every correction is a chance
to learn. Taste lessons (UI and UX, art, game design, in-product copy, video) live in one live taste
store that every session and project shares, with his verdicts and their pictures: the `persona`
skill says how to read and add to it. Whoever handles a verdict records it there in the same turn,
through the area's persona where the project has one. No plugin publish is needed for that.

How to work with him, reviews and mocks are process, not taste: those lessons go in this file and
the skills, published with `quasarbright:update-plugin`. A choice made for one project, or a
rejection during a brainstorm, stays in that project's docs or memory. Technical gotchas go in
memories. If he corrects something a lesson already covers, the line wasn't strong enough to
prevent the miss, so sharpen it (a new lesson superseding the old one).
