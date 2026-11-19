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
  the page, relay it to whoever owns the work (the coordinator, in a project) right away: item, choice
  and note.
- **Link the page** whenever you tell Mike something needs his review.
- **Mark items Done when their work ships**, or as soon as a decision is settled and nothing is left to
  wait on. Don't leave settled items "waiting on Claude".
- **Embed images.** Artifacts block outside images (a news site's URL renders as nothing), so upload
  every picture as an asset and use its `/_blob/<id>` URL. Keep the source link in the option's `link`.
- **One session owns the page:** it watches the artifact, replies to its comments, and writes item
  status. Other sessions send it their items instead of writing them, so two sessions don't answer the
  same comment.
- **No polling.** Answers reach Claude only by push (below). The page says so when nobody is listening.

## Setting one up

1. Copy `review.html`, replace `__PROJECT__` in the `<title>`, and publish it with the Artifact tool,
   with capabilities `{"db":{},"user":{},"comments":{},"assets":{}}`. Don't declare `mcp`: the Claude
   Code Remote connector doesn't load inside artifacts.
2. Write `meta/page` = `{project: "<name>"}` with ArtifactData.
3. Save the page's URL to project memory, along with which session owns it.
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
  - A picked or marked button fills in at once, and in the enlarged view the page moves to the next
    picture about half a second later (it stays on the last one), so the choice is seen first (Mike,
    2026-11-19: "the selected thing should get its circle filled in").
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

## How answers reach Claude

Every answer (with its picture notes), note and Talk in chat is saved in the page's db first. Then it goes out
as `comments.sendToClaude`, which wakes the session that watches the artifact and arrives as a comment
starting `[review <item id>]`. A plain comment wakes nobody, so the page never falls back to one.

Send to Claude only reaches a session that is awake and watching. Container sleeps break that, so when
`canSendToClaude()` isn't "available" the page shows a calm gray line: "Your answers save here. When
you're done, let Claude know in the project chat." No red error, because nothing was lost. (A picture
comment isn't saved, so that one does show "Not sent".) When Mike says he answered, read the items whose
status is `answered` or `chat`.

The owning session: publishing registers the watch, and `ArtifactComments` with `action: "watch"`
re-registers it after a restart. On each comment wake, read the thread, relay the answer, reply in one
line on the thread, and resolve it once handled.
