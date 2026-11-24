---
name: persona
description: How every one of Mike's (quasarbright) review personas works, in any project - the UI/UX, art, game design, writing and video reviewers - and how any session reads or adds to his live taste store (lessons, past verdicts with pictures, persona files, misses). Use when you are a persona or are setting one up, before building UI, art, mechanics or copy (to read the lessons), whenever Mike gives a verdict worth learning from, and for the weekly tidy.
---

# Personas and the taste store

Mike wants agents that know his taste: "I describe something and it produces something that I'm
happy with and don't have to iterate on" (2026-11-23). He keeps many personas across projects that
can't talk to each other, and plugin updates are too slow and too unreliable for what they learn
day to day (2026-11-24). So this skill holds how personas work, and everything they learn lives in
one live store that every session reads and writes.

## The store

One private claude.ai artifact, **Taste Examples**: https://claude.ai/artifact/YHKnAetx2RnNmVt8Gong51

Its page is a gallery Mike browses and comments on. Its data is reached with `ArtifactData` (every
call takes that `url`), its pictures with the `Artifact` tool. It's private, so screenshots from
private projects go in; never copy them into this plugin, which is public. A change to the store is
live for every session at once, with no plugin publish.

| collection | one document per | fields |
|---|---|---|
| `domains` | area of taste | `id`, `name`, `covers`, `notCovered`, `store` (null, or another artifact's url once split), `createdAt`, `createdBy` |
| `personas` | persona | `id`, `name`, `domain`, `role` (its job and what it sees), `looksFor`, `blind`, `projects`, `createdAt`, `createdBy` |
| `lessons` | lesson | `id`, `domain`, `topic`, `title`, `text` (markdown, bold lead), `kind` (`rule` or `preference`), `persona` (only for one persona's own preferences), `supersedes` (ids), `retired`, `source`, `createdAt`, `createdBy` |
| `examples` | verdict of Mike's | `id`, `date`, `project`, `area` (the domain id), `kind`, `verdict` (`approved`, `rejected`, `corrected`), `persona` (what the persona said first: `approved`, `flagged`, `none`), `personaId`, `personaSaid`, `shows`, `words` (his exact words, or what he tapped), `lesson` (a lesson id), `image`, `after` (asset ids) |
| `log` | log line | `id`, `persona`, `at`, `text` |
| `perf` | lookup | `id`, `persona`, `domain`, `at`, `records`, `seconds`, `fit`, `note` |

`examples` holds every verdict, not only visual ones: a picture is optional. Reuse an existing
`kind` so lookups find it (screen layout, panel, control, button, icon, item art, character art,
mechanic, balance, copy, joke, script line, title, ...).

### Writing to it

- **Nothing is edited in place and nothing is deleted.** Many sessions write at once, and Mike
  wants history and undo. To change a lesson, write a new one with `supersedes: [old id]`; to drop
  one, write `{retired: true, supersedes: [id], text: why}`. A lesson is active when no other record
  supersedes it and it isn't a retirement. Persona documents and an example's `after` are the only
  updates, always with `if_version`. Never delete examples or assets unless Mike asks.
- **New ids are `<domain or persona>-<YYYYMMDD>-<slug>`**, examples `<date>-<project>-<slug>`.
  Write new documents with `set` and no `if_version`: if the id exists, the write fails and you
  pick another slug instead of overwriting someone's record.
- **Batch** several writes in one `ArtifactData` `batch` (up to 50).
- **Write lessons as defaults with the example that taught them**, in plain words, his words quoted
  where they carry the point. Only general lessons go here. A choice for one project stays in that
  project's docs or brief.
- Never republish the gallery page from a session that hasn't read it (`Artifact` `read`).

### Reading it

`skills/persona/store.py` (next to this file) turns an export into text:

1. Export: `ArtifactData` `query` with `out_dir` set to a scratch folder, for example
   `lessons` where `domain == ui` (limit 1000), or `personas`, `log`, `examples`. Files land in
   `<dir>/<collection>/<id>.json`.
2. `python3 -I store.py lessons <dir> --domain ui` prints the active lessons by topic.
   `persona <dir> <id>` prints a persona's file (role, what it looks for, its own learned
   preferences, log). `misses <dir> --persona <id>` lists its misses.

## Who reads what

- **Any session building in a domain** reads that domain's active lessons first: UI before building
  a screen (with `docs/DESIGN.md`), art before drawing, game design before proposing mechanics,
  writing before in-product copy or jokes. The `TASTE.md` principles load at every start anyway.
- **A persona** reads its own file, its domain's lessons, and the 5 to 8 closest examples at every
  review (below).
- **Blind reviewers never read the store**: the `ux-review` subagent, the blind playtester, and
  blind video reviewers. They judge as strangers. The session spawning one exports the text it may
  see into its brief or a file: the domain's lessons for `ux-review`, the persona's own file for a
  blind video reviewer, nothing for the playtester. No examples, no misses, no other persona.

## Setting up a persona

A persona is a reviewer with a memory: a long-lived thread in a Claude project (a game designer, a
UI/UX designer) or a reviewer that a skill spawns (the `video-review` panel).

1. **Map it onto a domain.** List `domains` and pick the one whose `covers` fits what it judges.
   If none fits, or two do, or you're unsure at all, ask Mike before going on: list every existing
   domain by name and what it covers, then your proposed new one (name, covers, not covered), and
   let him pick. Never create a domain without his yes (Mike, 2026-11-24).
2. **Write its `personas` document**: id, name, domain, role, what it looks for, whether it's blind,
   which projects it serves. Log "created".
3. **A long-lived project persona also keeps a project brief** (`docs/personas/<name>.md` in the
   repo, or `/mnt/project-files/personas/<name>.md` for a project across repos) for project state
   only: where things stand, its current take, open calls waiting on Mike, decisions for this
   project. Its general taste lives in the store, so other projects' personas in its domain learn
   from it.

## A review

1. **Read** your file, your domain's active lessons, and the examples: `query` `examples` where
   `area` is your domain (text only, so cheap); pick the 5 to 8 closest: same kind first, then
   the same project, preferring rejected-then-fixed pairs and recent ones. Fetch only those
   pictures (`Artifact` `read`, the asset id as `path`) and look at them. Note how long the reads
   took and how many records (see "Watching performance").
2. **New visual work starts as mocks.** Before anything new is built (a screen, art, a restyle),
   the builder sends you two to four quick mocks in different directions. Pick one against the
   examples, or send them all back with what's wrong (two rounds at most). Mike sees the pick next
   to the current screen with your one-line reason, and the build then matches it. Exact small
   asks skip this.
3. **Judge "would Mike pick this?"**, not only "any defects?". For each candidate say which
   examples it resembles and how, name the ids behind the call, and say where the examples and a
   lesson disagree (that's a lesson to sharpen). For a build from a mock you picked, check it
   against that mock part by part.
4. **Report** what to fix, most important first. A UI/UX persona opens the live page and explores
   it well beyond the change, reads every word and runs `ux-review`'s contrast check.

## When Mike gives a verdict

Whoever handles his answer (the persona for its domain, otherwise the build thread, coordinator or
session) records it in the same turn:

1. **An example.** One per picture or item he marked: his exact words, the verdict, what the
   persona said before he saw it and which persona (`persona`, `personaSaid`, `personaId`). For a
   picture, shrink it to a 512px webp (about 350 tokens to look at),
   `ffmpeg -v error -y -i in.png -vf "scale='if(gte(iw,ih),min(512,iw),-2)':'if(gte(iw,ih),-2,min(512,ih))'" -c:v libwebp -quality 82 -frames:v 1 out.webp`,
   upload it (`Artifact` publish with the store's `url`, `asset: true`, the file or `file_paths`)
   and put the asset id in `image`. When the fix lands, upload it and update `after`.
2. **A lesson, if there is one**, as a new record (superseding the line it sharpens, if a lesson
   already covered this and failed to prevent it). Put its id in the example's `lesson`. A
   preference about one persona's own job ("I do that on purpose", "ends with downtime for the end
   card") is a lesson with that `persona` set.
3. **A log line** for any persona whose file changed.

A **miss** is an example where `persona` is `approved` and `verdict` isn't: the persona passed or
picked something he then rejected or corrected. Nothing more to write; the gallery counts them.

Process lessons (how to review, run mocks, work with him) still go in the plugin's docs and skills
through `quasarbright:update-plugin`. Taste goes in the store.

## Watching performance

The store is one artifact read whole by domain. That stays fast for a few hundred records, and
Mike asked that agents watch it and act when it slows (2026-11-24). After each review's reads,
write a `perf` record: records read, seconds (`date +%s` around the reads), whether the examples
you picked actually fit (`fit`: how many of the 5 to 8 were useful), and a note if anything was
slow or noisy.

Act when a domain passes about 400 active lessons or 1,000 examples, a lookup takes over a minute,
or two reviews in a row found fewer than half their picked examples useful. Then split that domain
into its own artifact (same page and collections, its `store` set to the new url), move its records
there, and update this skill to say how reads find it, through `quasarbright:update-plugin`. Tell
Mike in one line what you split and why. If a split doesn't fix it, say so to Mike rather than
patching around it.

## The weekly tidy

A weekly run (a routine) keeps the store short enough to read: for each domain,

1. Export its lessons and examples, and read new comments Mike left on the gallery
   (`ArtifactComments`).
2. Merge duplicates: one new record carrying the best wording, superseding both.
3. List contradictions (two active lessons that disagree, or a lesson his recent verdicts go
   against) and ask Mike which holds, with the example ids. Don't pick for him.
4. Read each persona's misses since the last tidy. A run of misses on one kind means a lesson is
   missing or too weak: write or sharpen it.
5. Check `perf` against the thresholds above.
6. Log what changed on each persona's file and post Mike a short summary only if something needs
   him.
