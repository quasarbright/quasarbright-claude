---
name: review-page
description: Run a project's review canvas, the one Design canvas (a claude.ai artifact made from the Design type) that holds everything waiting on Mike - choices, pictures to look over, questions - laid out as artboards he comments on. Use in every project whenever something needs Mike's review, choice or answer, when setting up a new project, and when moving a project off the old review page artifact.
---

# Review canvas

Each project has **one** review canvas: a private claude.ai artifact made from the **Design** type
(artboards on a canvas). Everything waiting on Mike is a row on it: the question as a title, one
artboard per option, built from real screens. He answers by commenting on the artboard or part he
means. Settled rows move to a Done page.

History: the first review page (2026-11-18) was a custom HTML artifact with pick buttons and note
boxes; on 2026-11-23 it became comments plus one Reviewed button. On 2026-11-26 werewolf's UI/UX
persona framed a real pick on a Design canvas (options as phone-width mocks side by side, the pick
marked). Mike: "oh shit this actually looks pretty promising", picked within a minute, and then:
"let's update the plugin so the review is done on canvas rather than the artifact." So the canvas
is the review surface everywhere, and the old page is retired (below). The skill keeps its old name
so links to it still work.

**This skill is the source of truth.** When Mike asks for a change to how reviews work, or a project
finds a better layout, change this skill in the same turn and publish with `quasarbright:update-plugin`.

## Owner

- **A dedicated "Review desk" thread owns the canvas** (Mike, 2026-11-19). Only the desk publishes
  to it, so two sessions never overwrite each other's rows or handle the same comment twice. Personas and build threads never write the canvas: they put their
  material (PNGs at 2x, captions, Gets/Costs lines, their pick and why) in
  `/mnt/project-files/review/<item id>/` and send the desk a note with full background, through the
  coordinator. Outside a project, or in a project without a desk, the coordinator (or the one
  session doing the work) owns it the same way.
- Save the canvas `url` and its owner in project memory.
- The desk does no design or build work. It lays out items, reads and routes comments, and moves
  rows to Done.

## The rules

- **Every open question for Mike goes on the canvas**: picks, pictures to look over, plain text
  questions, persona questions. A question that needs an answer within minutes can be asked in chat,
  and goes on the canvas too if it's still open an hour later.
- **Full background on every row.** He may never have seen the thread it came from. The row's title
  is the question in plain words; a sticky note at the left end of the row says what it is, why it
  came up, what's in use now, and how to read the pictures.
- **Keep the canvas and the chat in sync.** When he answers in chat, move the row to Done right away
  with his answer in its title.
- **Link the row**, not just the canvas, whenever you tell Mike something needs him:
  `<canvas url>#artboard-<board path without .dc.html>`.
- **Move rows to Done when settled**, and drop them from Done once their work ships.
- **Embed images as assets.** Upload every picture to the canvas (`Artifact`, `asset: true`, the
  canvas `url`) and use its `/_blob/<id>` URL. Assets already on another artifact are copied with
  `from_url` and `asset_ids`, no download.
- **Every verdict teaches something** (Mike, 2026-11-19). The routed note for each answer names the
  lesson you see and its domain, plus each picture's asset id and title, his comment word for word,
  and what a persona said about it before he saw it, so the owner can record the verdict and lesson
  in the taste store in the same turn (`persona` skill, "When Mike gives a verdict"). Process
  lessons go in `WORKING.md` and this skill.
- **Nothing he writes is lost.** Comments live in the artifact service and survive republishes.
  Never rely on memory of what he said; read the threads.

## Layout

Follow the Design type's own instructions (they come back when you create or read the canvas) for
file shapes: `project/canvas.json` plus one `project/<name>.dc.html` per artboard.

- **Two pages**: `open` ("Waiting on you", the launch page) and `done` ("Done").
- **A how-to sticky** at the top left of the open page, always there: "Comment on the option you
  want, or on anything you have thoughts about. Then say \"left comments\" in the project chat and
  I'll read them right away. If you forget, I still check a few times a day."
- **One row per item**, blocking items first. Above the row a `title1` note worded as the question
  ("2. Log the wakes where people only see who's who?"), `maxW` the row's width. 80 px between
  artboards in a row, 120 px between rows, at least 223 px of clear space above each title.
- **One artboard per option**, the same size across the row, so options line up. Each artboard is
  dark (`#0e1018`, light text), and holds: the option's letter and name; a "Recommended" pill on the
  recommended one (or "<persona>'s pick"); the real screenshot or mock at its true width (phone
  screens at 375 px); and one line, "Gets: … Costs: …". Title the board in `canvas.json` the same
  way ("A. Face up, crossed-out eye"), since its name strip is what comments anchor to.
- **Today's screen is always on the row**, as an option ("B. Keep today's") or a reference board,
  so he compares against what exists.
- **Supporting shots** for an option (every event, every state) go in a continuation row under it,
  with its own title ("1, continued: every kind of event").
- **A look-over** (one direction, many shots) is one row of shots, each titled and captioned. No
  pill: there's nothing to choose.
- **A text question** is a row of small cards, one per option, each with its name and Gets/Costs.
- **Motion** (an animation, a demo, a transition) is never judged from stills: put a short GIF on
  the artboard (canvas uploads take png, jpg, gif, webp and svg) with a link to the live page, or
  skip the canvas and send the live link in chat.
- **Done**: on the `done` page, each row's title becomes his answer ("Done: the Drunk's card. You
  picked A."). Moving a row = set `page: "done"` on its boards and notes and place them in free
  space there.

Build each artboard with markup only (no script-built UI) and keep the type's skeleton exactly; the
type's instructions say what fails silently. Send a whole row in one publish where you can (the
first canvas took about 10 publishes).

## How comments reach Claude

Comments on a Design canvas can't be sent to Claude: the canvas's comment box has no Send to Claude
option, so a comment wakes nobody (Mike, 2026-11-26: "comments don't get sent to Claude. I have to
tell it in the chat that I left comments"; he has sent product feedback). Don't tell him to use
Send to Claude or @claude there. But `ArtifactComments` `action: "read"` on the canvas returns
every thread with an anchor naming the artboard and element it sits on, so Claude pulls them:

1. **When he says so.** A line in the project chat ("left comments", "reviewed", "commented on the
   canvas", "picked") makes the coordinator read the canvas threads in that same turn, answer him
   in the chat, and pass each new comment to the desk. This is the fast path; the how-to sticky
   tells him about it.
2. **Whenever someone is awake anyway.** The desk reads all threads on every wake, whatever woke
   it. The coordinator reads them whenever Mike writes in the project chat and no read has happened
   in the last hour.
3. **A review sweep routine** in every project with an open row, every 3 hours from 9am to 9pm
   Eastern (his check-in hours), so a comment he forgot to mention waits at most a few hours. It
   reads the threads and the ledger and posts in the project chat only when it finds unhandled
   comments ("You left 2 comments on the review canvas: … Passing them on."), which wakes the
   coordinator to relay them to the desk. The coordinator creates it with the canvas and pauses it
   while the open page is empty.

**The ledger.** A session can't reply to or resolve a thread that wasn't sent to Claude, which is
every canvas thread, so "handled" is tracked on the canvas itself, in its database: `ArtifactData` collection `review_ledger`, one doc
per thread id: `{thread, item, board, comment, handledAt, routedTo}`. A thread is new when it has
a comment later than its ledger doc's `handledAt`, or no doc. Write the doc in the same turn you
route it.

**Handling a comment:**

- Work out the item from the anchor: the artboard's file names the row and option. A comment on a
  pick option ("This one", "this") is his pick. Anything else is feedback on that option or row.
- Route it to its owner with full context: game design to the design persona, screens, flows and
  UI wording to the UI/UX persona, art to the art persona, code to the build thread, through the
  coordinator.
- Answer in the project chat in one or two plain lines saying what happens next ("Got it, A on the
  Drunk's card. Passing it to Pam."). You can't reply on or resolve the thread; leave it for him.
  If a thread ever shows as sent to Claude, reply and resolve there as well.
- A settled pick moves its row to Done.
- Before routing an approval, check whether the work already shipped (the live site or the repo); if
  it did, move the row to Done. Mike, 2026-11-25: "You need to mark the portfolio thing as done",
  about a card that had been live for three days.

## Making a good item

- **Open with what the thing is, in plain words, and how to read the pictures.** Mike didn't know what
  a favicon sheet was (2026-11-21). Say "Browser-tab icon (favicon) candidates: each shown large,
  then at real tab size", not a bare "favicon sheet".
- **A pick is a real choice that differs in one thing.** Every option is the same screen with only
  the thing being decided changed. Fixes that apply to every option are built into all of them and
  mentioned in the sticky.
- **One direction is a look-over, not a pick.** Mike, 2026-11-19, on a quarter-board pick: "it
  wasn't even really a choice, and there were unrelated differences between each thing."
- **Each option's picture shows that option itself.** For "add X" versus "keep", the add side shows
  X working, never the closest thing that exists today. Mike, 2026-11-25, on a fisheye pick whose
  pictures were both today's mode at 170° and 179°: "neither of these show >180".
- **Check a build against what he approved before it goes up.** Put the build next to the picked
  option on the row and list every difference in the sticky, or fix the drift. Mike, 2026-11-19:
  "Still not the version you showed me that I liked."
- **What he picked is what gets built.** Hand the build the picked option's image and source.

## Setting one up

1. Create the canvas from the Design type: `Artifact` publish with the Design `type_url` (find it
   with `action: "list"`, `scope: "types"`), `title` "<project> review", `auto_open:
   "after_first_write"`. Its result carries the type's instructions; follow them.
2. Publish `project/canvas.json` (the two pages, the how-to sticky) and the first row from the
   desk's session.
3. Save the `url` and owner in project memory, and set up the review sweep routine.
4. Tell Mike the link once.

## Moving a project off the old review page

Projects that still have the HTML review page (comments plus a Reviewed button) move in one pass,
from the desk's session:

1. Read the old page's items (`ArtifactData` `items`) and every comment thread on it
   (`ArtifactComments` `read`). Route anything not yet routed; nothing he wrote may be dropped.
2. Put every open item on the canvas as a row, copying its pictures across with `from_url` and
   `asset_ids`.
3. Set each old item to `done` with `answer: {note: "Moved to the review canvas: <canvas url>"}`,
   and stop watching the old page (`ArtifactComments` `watch`, `on: false`). Leave the page up as a
   record; delete it only if Mike asks.
4. Point project memory at the canvas, and tell Mike in one line, with the canvas link.
