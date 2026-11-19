---
name: review-page
description: Set up and run a project's review page, the one artifact that holds everything waiting on Mike (picks, approvals, text questions) with comments, an enlarged view and push answers to Claude. Use in every project whenever something needs Mike's review, choice or answer, and when setting up a new project.
---

# Review page

Each project has **one** review page: a private claude.ai artifact listing everything that needs Mike.
He picks, approves, answers and comments there, and finished items fold away under Done. Clanker
Tycoon's page (https://claude.ai/artifact/WKT7Pv5pRchGM8w82RiGBT) is where this was worked out with
him on 2026-11-18. `review.html` in this folder is the template.

**This skill is the source of truth.** Whenever a project's page improves (Mike asks for a change, or
you fix something), copy the change into `review.html` and these instructions in the same turn, and
publish with `quasarbright:update-plugin`. Pages already published pick up a change when you
republish them from the new template.

## The rules

- **Every open question for Mike goes on the page.** That includes choices between mocks, approvals of
  a sequence of shots, plain text questions, and questions from personas (Mark, Pam). Give each item its
  full background in `context`. He may never have seen the thread it came from.
- **Keep the page and the chat in sync.** When Mike answers something in chat or a thread, mark that
  item answered or done on the page right away, with his answer in `answer.note`. When he answers on
  the page, route it to whoever owns the work right away (see the Review desk below): item, choice
  and notes.
- **Link the page** whenever you tell Mike something needs his review.
- **Mark items Done when their work ships**, or as soon as a decision is settled and nothing is left to
  wait on. Don't leave settled items "waiting on Claude".
- **Embed images.** Artifacts block outside images (a news site's URL renders as nothing), so upload
  every picture as an asset and use its `/_blob/<id>` URL. Keep the source link in the option's `link`.
- **A dedicated "Review desk" thread owns the page** (Mike, 2026-11-19). In a project, the page gets
  its own thread whose only job is running it, rather than a designer persona or the build thread.
  The Review desk publishes the artifact (so its watch, and every Send to Claude from the page, lands
  there), adds and clears items, and writes every status. Other threads and the coordinator never
  write items: they send the desk their new items and any answers Mike gave in chat, with full
  background. Outside a project, the one session doing the work owns it the same way.
- **The Review desk routes each answer to its owner.** For every send from Mike, write a short routed
  note naming the owner and what to do: game design or balance to the design persona (who also owns
  the decision log), screens and flows to the UI/UX persona, art assets to the art persona, code to
  the build thread. A thread can't message threads it doesn't depend on, so the desk sends routed
  notes to the coordinator with full context, and the coordinator relays them. The desk does no
  design or build work itself.
- **Every verdict teaches something** (Mike, 2026-11-19). A pick, a rejection, a thumbs-down or a
  note often carries a lesson beyond the item ("the button coloring makes the big loan look like a
  cancel button"). Lessons belong to a topic, not a persona: UI/UX in `TASTE.md` and
  `UX-CHECKLIST.md`, art in `ART.md`, game design in `GAME-DESIGN.md`, copy and humor in
  `WRITING.md`, reviews and mocks in `WORKING.md` and this skill. Each routed note names the lesson
  you see and the doc it belongs in. The owner records it in the same turn and publishes it with
  `quasarbright:update-plugin`: the area's persona where the project has one (it also keeps that doc
  tidy), otherwise the build thread or the coordinator. Only general lessons go to the plugin; a
  choice for this project stays in the project's docs. Outside a project, the session handling the
  answer records it. See `WORKING.md`, "Lessons from his verdicts".
- **No polling.** Answers reach Claude only by push (below). The page says so when nobody is listening.

## Setting one up

1. Copy `review.html`, replace `__PROJECT__` in the `<title>`, and publish it with the Artifact tool,
   with capabilities `{"db":{},"user":{},"comments":{},"assets":{}}`. Don't declare `mcp`: the Claude
   Code Remote connector doesn't load inside artifacts (retested 2026-11-19 on Mike's phone: "Couldn't
   load this connector"), so a page can't `send_message` into a thread to wake it.
2. Write `meta/page` = `{project: "<name>"}` with ArtifactData.
3. Save the page's URL to project memory, along with the thread that owns it (the Review desk, in a
   project). To move the page to a new owner, read the artifact and republish the same HTML to its
   `url` from the new owner's session: that registers its watch, and items in the db carry over.
4. Tell Mike the link once.

## Items

Each item is a doc in the collection `items`, written with ArtifactData. No republish is needed.

| field | meaning |
|---|---|
| `title` | the question, in Mike's words |
| `kind` | `pick` (image options), `approve` (a sequence of shots), `question` (text options) |
| `multi` | pick only: `true` lets him pick any number (answer `choice` is then an array) |
| `blocking` | `true` puts it under "Blocking work" at the top |
| `from` | who asks, e.g. "Pam · factory editor" |
| `created` | ISO time |
| `context` | full background: what it is, why it's asked, what's in use now |
| `recommended`, `recommendReason` | option id (or ids, for `multi`) and one line on why |
| `options` | `[{id, label, desc, img, tag, link, source}]` for pick and question |
| `images` | `[{img, title, desc}]` for approve |
| `status` | `open`, `answered`, `chat`, `done` |
| `answer` | `{choice, label, verdict, marks, note, at}`, written by the page. For a multi-shot approval, `marks` maps a picture index (from 0) to `good` or `changes`, and `verdict` is `good`, `changes` or `partial` |

Images: JPEG about 1600px wide, uploaded with the Artifact tool (`asset: true`, the page's `url`).
Every image gets a title and a one-line description, through the option's `label` and `desc` or the
shot's `title` and `desc`.

## What the page does

- A list grouped by Blocking work, Look when you can, Talking in chat, and Answered (waiting on Claude),
  plus a folded Done. Each item opens with previous and next arrows.
- **Round buttons on every picture** (Mike, 2026-11-19: the side panel made the image small, the
  buttons shifted with the description height, and comments went out eagerly). Each picture carries
  small circle buttons in its bottom-right corner, in the list and in the enlarged view:
  - Approve: thumbs up (Looks good), thumbs down (Needs changes), chat (a note).
  - Pick: a check (pick it; checkboxes when `multi`) and chat.
  - Chat opens a small text box on the picture. Its note waits and goes out with the answer, never
    on its own.
  - Every action stays on the picture: the button fills in and Mike moves on with the arrows himself
    (2026-11-19: "don't automatically advance to the next thing on good/bad"; auto-advance had hidden
    the filled button too).
- **Pick**: Send names the picks ("Send picks 1, 2 and 4").
- **Approve**: Send reports the marks and notes ("Send: 7 good, 1 needs changes, 1 unmarked") and
  appears only once at least one picture is marked or noted. There is no overall comment box.
  "Approve all N" ("Looks good" for one picture) is in the list view only, never in the enlarged
  view: Mike pressed Looks good on one enlarged picture and it approved the whole sequence
  (2026-11-18).
- **Question**: text options.
- **Note-only send** on picks and questions: with nothing picked, a note alone enables "Send note".
- **Talk in chat** hands the item back to the conversation (status `chat`).
- **Enlarged view**: tap a picture to see it large, filling the window with no side panel. The top
  bar holds the title, "n of N" with that picture's mark, Send (once there's something to send),
  Actual size and Close. The round buttons sit centered under the image, and the caption below has
  a fixed height so the buttons never move between pictures. Arrow buttons and the ← → keys move
  through the pictures, and Escape closes it (or the open note box first).

## Making a good item

- **Check a build against what he approved before it goes up.** When an item shows built work for
  something he already picked (a mock, an art choice), put the screenshot side by side with the
  approved picture and list every difference first. Fix the drift, or say in `context` what differs
  and why. Mike, 2026-11-19, rejecting the in-game crate twice: "we just agreed on the crate art and
  it was something else", then "Still not the version you showed me that I liked."
- **A pick is a real choice that differs in one thing.** Every option is the same screen with only
  the thing being decided changed, so Mike compares that one thing. Fixes and layout changes that
  apply to every option are not options: build them into all of them and say so in the context.
- **One direction is an approval, not a pick.** When there's only one sensible answer, show it as an
  approval sequence (one picture per state, each with a title and a line) and let him mark pictures.
  Mike, 2026-11-19, on a quarter-board pick: "it wasn't even really a choice, and there were
  unrelated differences between each thing."

- **What he picked is what gets built.** Hand the build the picked option's image and source, and
  put the built screenshot beside it before the result comes back as an approval item. An approval
  of a build that doesn't match its picked mock wastes his look ("Still not the version you showed
  me that I liked").

## How answers reach Claude

Every answer (with its picture notes), note and Talk in chat is saved in the page's db first. Then it goes out
as `comments.sendToClaude`, which wakes the session that watches the artifact and arrives as a comment
starting `[review <item id>]`. A plain comment wakes nobody, so the page never falls back to one.

Send to Claude only reaches a session that is awake and watching. The watch survives a container sleep
(it is restored when the session wakes), but a send made while the owner sleeps is refused
(`canSendToClaude()` is `no_session`) and never queued, so nothing wakes the owner. There is no other
push route today (2026-11-19). Container sleeps break that, so when
`canSendToClaude()` isn't "available" the page shows a calm gray line: "Your answers save here. When
you're done, let Claude know in the project chat." No red error, because nothing was lost. (A picture
comment isn't saved, so that one does show "Not sent".) When Mike says he answered, read the items whose
status is `answered` or `chat`.

The owning session: publishing registers the watch, and `ArtifactComments` with `action: "watch"`
re-registers it after a restart. On each comment wake, read the thread, relay the answer, reply in one
line on the thread, and resolve it once handled.
