# PROJECTS.md: working in a Claude project

Loaded with `WORKING.md` at every session start. Applies when the session is a coordinator or a
thread in a Claude project.

## Coordinator and threads

A Claude project has a project chat, where Mike talks to a coordinator, and threads that do the
work. Mike doesn't read threads.

- **Relay everything to the project chat.** Mike only comments on images inside a thread, and those
  comments go to the thread that made the image. Every thread result and every answer a thread gives
  gets relayed by the coordinator back to the project chat. Never assume he saw something because
  a thread posted it.
- **Images there follow step 4 of `WORKING.md`'s "Before you show it",** and a post holds at most 6 attachments, so split larger
  sets across posts and keep the numbering going.
- **Anything waiting on Mike carries its full background:** what it is, why it came up, and what
  each choice leads to, with any new term explained before the question uses it. Never assume he
  saw a thread's proposal.
- **Everything waiting on Mike goes on the project's review page** (the `review-page` skill): picks,
  approvals and text questions, persona questions included. Keep it in sync when he answers in
  chat, link it whenever something needs him, and mark items Done once their work ships.
- **Every verdict teaches something.** Whoever handles an answer from the page or chat records
  any general lesson in its area's doc in the same turn, through the area's persona when there is
  one (`WORKING.md`, "Lessons from his verdicts").

## Where threads run

Cloud first (`steering/rules/cloud-first.md`): coordinator, build, persona and review threads all
run in cloud sessions. A thread uses Mike's Mac through Remote Control only for what needs it, such
as pulling a branch for him to play on localhost or a live playtest while the Mac is online. When a
gap stops a thread working in the cloud, it tells the coordinator, who brings it to Mike with what
would fix it; then the fix goes into that rule's checklist.

## Design personas (Claude projects only)

In a Claude project, which can run long-lived threads, a project may keep design personas: for
example a game designer and a UI/UX designer, each its own persistent thread. Each has a brief at
`docs/personas/<name>.md` in the project's repo, or at `/mnt/project-files/personas/<name>.md` when
the project spans many repos: Mike's rules for its area, where things stand, its current take, open
calls waiting on him, and a dated log. Personas edit docs only and never build. Each persona also
owns its area's lessons doc in this plugin (`WORKING.md`, "Lessons from his verdicts"): it keeps it current and periodically cleans it
up, merging duplicates and sharpening lines that failed to prevent a repeat. Consult them in
design discussions and on proposals, and have them review every change in their area before Mike
sees it. They're the reviewers who remember the project. The blind playtester and the `ux-review`
subagent are the opposite on purpose: fresh every time, with no memory. A UI/UX persona's review
opens the live page (screenshots only show what the builder chose) and explores it like a
curious user, well beyond the change: every screen, mode and control, moving around the world,
trying to break it. It also reads every word and runs `ux-review`'s contrast check. Outside a project, skip
personas and rely on those two.
