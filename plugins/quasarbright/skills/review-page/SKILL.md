---
name: review-page
description: Set up and run a project's review page, the one artifact that holds everything waiting on Mike (pictures to look over, choices, questions). He gives feedback with the artifact's own comments and presses Reviewed when he's said everything about an item. Use in every project whenever something needs Mike's review, choice or answer, when setting up a new project, and when switching an older review page to this design.
---

# Review page

Each project has **one** review page: a private claude.ai artifact listing everything that needs Mike.
He looks each item over, says what he thinks in the artifact's own comments (choosing Send to Claude
in the comment box), and presses **Reviewed** when he's said everything about it. Finished items fold
away under Done. `review.html` in this folder is the template.

History: the first page (worked out with Mike on Clanker Tycoon, 2026-11-18 to 21) had pick buttons,
thumbs, note boxes and a Send bar. On 2026-11-23 Mike asked to drop all of that and use the
artifact's built-in comments instead, with one Reviewed button per item. Clanker Tycoon's page
(https://claude.ai/artifact/WKT7Pv5pRchGM8w82RiGBT) was rebuilt that way, and on 2026-11-25 Mike
tested it: "Tested it out, looks good, let's get this everywhere." Don't bring the forms back.

**This skill is the source of truth.** Whenever a project's page improves (Mike asks for a change, or
you fix something), copy the change into `review.html` and these instructions in the same turn, and
publish with `quasarbright:update-plugin`. This includes feedback Mike leaves in a comment about the
page or the review flow itself (2026-11-21: "update the reference/skill as well whenever I suggest
improvements"). Fix it in the template, not only in the one project's page. Pages already published
pick up a change when you republish them from the new template.

## The rules

- **Every open question for Mike goes on the page.** Pictures to look over, choices between mocks,
  plain text questions, and questions from personas. Give each item its full background in
  `context`. He may never have seen the thread it came from.
- **Feedback is comments; the page has one control.** Mike comments on a picture, an option, the
  title or the context line, and sends each comment to Claude from the comment box. The only button
  on an item is Reviewed. Don't add pick buttons, thumbs, note boxes or text fields.
- **Keep the page and the chat in sync.** When Mike answers something in chat or a thread, set that
  item to `reviewed` or `done` on the page right away, and say what he answered in a reply on the
  item's title thread if there is one. When he comments or presses Reviewed on the page, route it
  to whoever owns the work right away (see the Review desk below).
- **Link the page** whenever you tell Mike something needs his review.
- **Mark items Done when their work ships**, or as soon as a decision is settled and nothing is left to
  wait on. Don't leave settled items under "Reviewed, waiting on Claude".
- **Embed images.** Artifacts block outside images (a news site's URL renders as nothing), so upload
  every picture as an asset and use its `/_blob/<id>` URL. Keep the source link in the option's `link`.
- **A dedicated "Review desk" thread owns the page** (Mike, 2026-11-19). In a project, the page gets
  its own thread whose only job is running it, rather than a designer persona or the build thread.
  The Review desk publishes the artifact (so its watch, and every comment sent to Claude from the
  page, lands there), adds and clears items, replies to and resolves comment threads, and writes
  every status. Other threads and the coordinator never write items: they send the desk their new
  items and any answers Mike gave in chat, with full background. Outside a project, the one session
  doing the work owns it the same way.
- **The Review desk routes each comment to its owner.** For every comment Mike sends, write a short
  routed note naming the owner and what to do: game design or balance to the design persona (who
  also owns the decision log), screens, flows and UI wording to the UI/UX persona, art assets to the
  art persona, code to the build thread. A thread can't message threads it doesn't depend on, so the
  desk sends routed notes to the coordinator with full context, and the coordinator relays them. The
  desk does no design or build work itself.
- **Every verdict teaches something** (Mike, 2026-11-19). A comment often carries a lesson beyond the
  item ("the button coloring makes the big loan look like a cancel button"). Taste lessons go in the
  live taste store, under their domain (UI and UX, art, game design, humor, writing, video); reviews
  and mocks are process and go in `WORKING.md` and this skill. Each routed note names the lesson you
  see and its domain. The owner records the verdict and lesson in the store in the same turn (the
  `persona` skill, "When Mike gives a verdict"): the area's persona where the project has one,
  otherwise the build thread or the coordinator. The routed note also gives each picture's asset id
  and title, Mike's comment on it word for word, and what a persona had said about it, so the owner
  can save the example and mark a miss. Only general lessons go to the plugin; a choice for this
  project stays in the project's docs. Outside a project, the session handling the comment records
  it. See `WORKING.md`, "Lessons from his verdicts".
- **Nothing Mike types is ever lost** (Mike, 2026-11-21: "any comments I write, even drafts, should
  be persisted as data"). Comments live in the artifact service, so they survive reloads and
  republishes; read them back with `ArtifactComments` rather than trusting memory. A comment he
  didn't send to Claude is still feedback: read it when he presses Reviewed. The page itself keeps
  no drafts.
- **No polling.** Feedback reaches Claude only by push (below). The page says so when nobody is
  listening.

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

## Switching an older page to this design

A page published from the template before 0.17.0 has pick buttons, thumbs and note boxes. Switch it
in place, so the link and the items stay:

1. Read the page's `drafts` collection. Anything Mike picked, marked or typed there but never sent is
   his feedback: route it like a comment (with the item and his words) and add it as a reply on the
   item, or tell him in chat what it said. Then delete the drafts. Nothing he typed may disappear.
2. Read the items. Items with status `answered` keep it: the new page shows them as reviewed, with
   his earlier answer read-only under "Your earlier answer". Make sure each one has been routed, and
   move settled ones to `done`.
3. Make sure he isn't mid-review (a republish reloads his open page), then read the artifact and
   republish the new template, with the project's title, to its `url` from the Review desk's
   session. Keep the same capabilities.
4. Open items stay open. Tell Mike in one line that the page now works by comments: comment on
   anything with Send to Claude, then press Reviewed.

## Items

Each item is a doc in the collection `items`, written with ArtifactData. No republish is needed.

| field | meaning |
|---|---|
| `title` | the question, in Mike's words |
| `kind` | `pick` (image options to choose between), `approve` (a sequence of shots to look over), `question` (text options) |
| `blocking` | `true` puts it under "Blocking work" at the top |
| `from` | who asks, e.g. "Pam · factory editor" |
| `created` | ISO time |
| `context` | full background: what it is, why it's asked, what's in use now |
| `recommended`, `recommendReason` | option id (or ids) and one line on why |
| `options` | `[{id, label, desc, img, tag, link, source}]` for pick and question |
| `images` | `[{img, title, desc}]` for approve |
| `persona` | optional: what a design persona said before Mike saw it (`approved` or `flagged`, plus a line why), so his verdict can be logged as a hit or a miss |
| `status` | `open`, `reviewed` (written by the page when he presses Reviewed), `chat` (being discussed in chat), `done` |
| `reviewedAt` | ISO time, written by the page with `reviewed` |
| `answer` | only on items answered with the old page; shown read-only |

`kind` only changes how the item is laid out and labeled ("Choice · 3", "Look over · 9 shots",
"Question"). Mike answers every kind the same way, in comments.

Images: JPEG about 1600px wide, uploaded with the Artifact tool (`asset: true`, the page's `url`).
Every image gets a title and a one-line description, through the option's `label` and `desc` or the
shot's `title` and `desc`.

## What the page does

- A list grouped by Blocking work, Look when you can, Talking in chat, and Reviewed (waiting on
  Claude), plus a folded Done. Open items carry a dot; each item opens with previous and next arrows
  through the open queue.
- **An item** shows its title, who asked, the context with the recommendation in bold, one line on
  how to answer ("Comment on any picture or line, and choose Send to Claude in the comment box.
  Press Reviewed when you've said everything."), then its pictures or options.
- **Everything is commentable in place.** The title, the context, every option card and every picture
  has a stable id (`c-<item id>-title`, `-context`, `-opt<n>`, `-pic<n>`), so a comment stays
  anchored to what Mike meant across republishes and re-renders.
- **A round comment button on every picture** opens the artifact's own comment box on that picture.
  Pictures in a choice sit in an even grid, each in the same 3:2 box, so a row of options lines up.
- **Enlarged view**: tap a picture to see it filling the window, with the title, "n of N", Comment,
  Actual size and Close in the top bar, arrow buttons and the ← → keys to move, Escape to close, and
  a caption of fixed height so nothing moves between pictures. Comment closes the enlarged view and
  opens the comment box on that picture in the list.
- **Reviewed**, in a sticky bar at the bottom, is the only control. It sets the item to `reviewed`
  and sends one message to Claude (below). Afterwards the bar shows "✓ Reviewed n min ago" and a
  "Not done reviewing" link that puts the item back to open.
- **Read-only viewers** see a line saying only the project owner can mark items reviewed.
- **Older answers**: an item answered with the old page shows "Your earlier answer" read-only.

## Making a good item

- **Open with what the thing is, in plain words, and how to read the pictures.** Mike didn't know what
  a favicon sheet was (2026-11-21). Say "Browser-tab icon (favicon) candidates: each shown large, then
  at real tab size", not a bare "favicon sheet", and say what each part of a composite picture shows.
- **Check a build against what he approved before it goes up.** When an item shows built work for
  something he already picked (a mock, an art choice), put the screenshot side by side with the
  approved picture and list every difference first. Fix the drift, or say in `context` what differs
  and why. Mike, 2026-11-19, rejecting the in-game crate twice: "we just agreed on the crate art and
  it was something else", then "Still not the version you showed me that I liked."
- **A pick is a real choice that differs in one thing.** Every option is the same screen with only
  the thing being decided changed, so Mike compares that one thing. Fixes and layout changes that
  apply to every option are not options: build them into all of them and say so in the context.
- **One direction is a look-over, not a pick.** When there's only one sensible answer, show it as an
  `approve` sequence (one picture per state, each with a title and a line). Mike, 2026-11-19, on a
  quarter-board pick: "it wasn't even really a choice, and there were unrelated differences between
  each thing."
- **What he picked is what gets built.** Hand the build the picked option's image and source, and
  put the built screenshot beside it before the result comes back as a new item.

## How feedback reaches Claude

Two things wake the session that watches the artifact:

- **A comment Mike sends to Claude** (Send to Claude in the comment box, or @claude in it). It
  arrives anchored to the element he commented on, so the anchor (`#c-<item id>-pic3`) says which
  item and which picture. A plain comment he didn't send wakes nobody but is still saved.
- **Reviewed.** The page saves `status: "reviewed"` and then sends, with `comments.sendToClaude`
  anchored on the item's title: `[review <item id>] Mike marked "<title>" reviewed. His feedback is
  in the comments on this item.`

Send to Claude only reaches a session that is awake and watching. The watch survives a container
sleep (it is restored when the session wakes), but a send made while the owner sleeps is refused
(`canSendToClaude()` is `no_session`) and never queued. So when `canSendToClaude()` isn't
"available" the page shows a calm gray line: "Claude isn't listening right now. Your comments and
Reviewed marks still save here; when you're done, let Claude know in the project chat." No red
error, because nothing was lost. When Mike says he's done, read every item whose status is
`reviewed` or `chat`, and every comment thread on the page.

The owning session: publishing registers the watch, and `ArtifactComments` with `action: "watch"`
re-registers it after a restart.

- **On a comment wake:** read the thread (`ArtifactComments`, `action: "read"`, its `thread_id`),
  route it, and reply on it in one or two plain lines saying what happens next ("Got it: one solo
  quarter. I'm passing it to Mark."). Resolve the thread once it's handled. Leave it open while a
  question is still going back and forth or the change hasn't landed yet, and reply again when it
  ships ("It's live: …").
- **On a Reviewed wake:** read every thread anchored to that item (`#c-<item id>-…`), including ones
  he didn't send to Claude. Route anything not yet routed, reply on the Reviewed thread with what
  happens next, and move the item to `done` once it's settled or its work ships. A thread he didn't
  send to Claude can't be replied to or resolved by Claude; mention it in your reply so he knows it
  was read, and leave it for him to resolve.
- **Reviewed with no comments on the item:** on a look-over, he's fine with it as shown, so treat
  it as approved and say so in the reply. On a pick or a question he hasn't chosen anything, so
  don't assume the recommendation: ask in the reply which one he wants.
- Replies are short and plain. They're the record of what happened to his feedback, and he reads
  them on his phone.
