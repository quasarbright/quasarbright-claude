# Cloud first, the Mac only when it has to be

Mike, 2026-11-19: "This is how I want all my projects to work. Cloud first when possible, if not
then let's try to close the gaps together."

- **Do the work in cloud sessions.** Building, testing, pushing, docs, screenshots, reviews and
  long-running threads (personas, a build thread) all run in the cloud by default.
- **Use the Mac (Remote Control or folder access) only for what really needs it:** pulling a branch
  so he can play it on localhost, a live playtest while the Mac is online, or something that only
  exists there (a signed-in app, a file that isn't in any repo). The Mac goes offline, so nothing
  should depend on it staying up.
- **When something blocks cloud work, flag it and close the gap with Mike.** Don't quietly move the
  work to the Mac. Say what failed (the command, the error), what would fix it, and who has to do
  it (a setting only he can change, or code you can write). Then fix the part you can. A workaround
  on the Mac is fine for one urgent step, but say you used it and keep the gap open until it's
  closed.
- **Record each gap you close** as a step in the checklist below, written generically, so the next
  project goes cloud-first faster.

How a cloud container differs from the laptop (paths, showing images, servers, GitHub) is in
`cloud.md`, next to this file.

## Checklist: making a project cloud-first

What it took for Clanker Tycoon on 2026-11-19. Not every project needs every step.

1. **Attach the repo to the project** (Project settings > resources), so cloud threads can clone
   and push it.
2. **Give the project's default cloud environment full network access.** The old environment's
   egress proxy refused `cdn.jsdelivr.net` and `quasarbright.github.io` (`connect_rejected`, 403),
   which broke CDN imports and the shared cohesion files. Threads already running keep the old
   environment until they restart.
3. **Model calls without `claude -p`.** The CLI isn't signed in on cloud machines, so a game that
   calls the model through it needs another path in the cloud. Clanker Tycoon has an opt-in file
   bridge (its `docs/cloud-playtest.md`, decision 91): `LLM_BRIDGE=<dir>` makes the server write
   each call to a file, and a background Haiku subagent answers them with `tools/llm-bridge.mjs`.
   Rule: playtest on the Mac when it's online, else use the bridge.
4. **Browser tests fall back to local copies** of CDN scripts, the shared footer and fonts when
   they can't be fetched (Clanker Tycoon decision 92: an e2e fixture that serves stand-ins, plus a
   vendored copy of `sketches/shared` in `tools/vendor`). Then `npm test` passes anywhere.
5. **Move long-running Mac threads to the cloud with handoff notes.** Each old thread (persona or
   build) writes `docs/personas/handoff/<name>.md` (where things stand, open work, what to read
   first), the new cloud thread reads it, and only then is the old one retired. Check every note
   landed.
6. **Plugin updates.** Cloud sessions get this plugin by account sync when they start.
   `claude plugin update` fails in the cloud and on the Mac desktop install, so a running session
   picks up a change by re-reading the changed doc from the repo.
7. **Artifacts can't wake a sleeping thread.** The Remote connector doesn't load inside artifacts,
   so a review page's sends only reach its thread while that thread's container is awake. After
   Mike sends answers from a page, he (or the coordinator, when he says "sent") messages the thread
   to pull them.
