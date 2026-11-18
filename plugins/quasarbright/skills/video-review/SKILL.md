---
name: video-review
description: Review one of Mike's (quasarbright) YouTube videos with a panel of reviewers (fact check, clarity, entertainment, pacing, hook and packaging, script vs screen, visual polish) at the script stage or on a draft render. Each reviewer keeps a long-term file of what Mike wants, so they learn across videos. Use whenever Mike asks for a script or video review, before recording the real voiceover, and before final render.
---

# Video review

Mike writes his scripts himself and directs the animation. These reviewers find what a viewer or a
comment section would find, before the video is out. The hard calls (what the video is, what's
funny, what to cut) stay his. You run the panel, sort what comes back, and show him the result.

## The reviewers

Each one has a file in `reviewers/` with its job, what to look for, **Mike's preferences** learned so
far and a dated **log**. The file is the reviewer's long-term memory: it's in this plugin, so it
travels to every machine and every video.

| reviewer | file | sees | script stage | draft render |
|---|---|---|---|---|
| Fact check | `fact-check.md` | informed | yes | |
| Clarity | `clarity.md` | **blind** | yes | yes |
| Entertainment | `entertainment.md` | informed | yes | yes |
| Pacing | `pacing.md` | informed | yes | yes |
| Hook and packaging | `hook.md` | **blind** | yes | |
| Script vs screen | `script-screen.md` | informed | yes, once `>` notes exist | yes |
| Visual polish | `visual-polish.md` | informed | | yes |

**Blind** reviewers judge as a stranger would. They get the reviewer file and the material, and
nothing else: no notes on the video, no reflections, no project memory, none of your opinions.
Their file still grows (what to look for), but it never holds facts about a particular video.

**Informed** reviewers get the reviewer file plus the context a collaborator would have, listed
below. They're the ones who remember Mike.

## Material

- **Script stage:** the script, read fresh from where Mike keeps it right before the run. For Obsidian
  scripts, his Mac copy (`~/GitHub/learn-obsidian`) is newer than GitHub; read it through the device
  tools. Never edit his Obsidian files. If a video is split into parts, give only the part under
  review, and say in one line that it's a part.
- **Draft render:** the rendered mp4 (with the draft or real voice), `script.md`, `script.py` and
  `main.py` from `manim-videos/<year>/<topic>/`, frames sampled with ffmpeg (every 2s, plus every
  cue's frame and the frame 0.3s before it), and the word timings the narration service wrote.

Context for informed reviewers: the video's own notes (the Details list above the script),
Obsidian's `video reflections.md` and `video process.md`, and anything Mike has decided about this
video (project memory). Give paths, not summaries, so the reviewer reads the real thing.

## Running it

1. Run only the reviewers that apply to what changed (table above), or the ones Mike names. A
   reviewer with nothing to look at doesn't run: no visual polish on a script, no hook review of a
   middle scene. Script edits happen during the animation stage too: when lines change there, run
   the script-stage reviewers that apply on just those lines (with their surroundings for context),
   alongside the render reviewers.
2. Spawn one subagent per reviewer, in parallel (Agent tool, general-purpose). The prompt is: the
   reviewer file's full text, the material's paths, the context paths if informed, and this:

   > Review this as described in your file. Read all of it before writing anything. Report
   > findings most important first. Each finding gives: where (a line number or a quote, or a
   > timestamp), what's wrong as a viewer would experience it, and the smallest fix that solves
   > it, in Mike's voice if it's a wording change. Mark each **must-fix** (a viewer would notice or
   > a commenter would call it out) or **consider**. Don't report typos or spelling at the script
   > stage. Don't pad: if something works, say nothing about it, except for at most three lines
   > on what works best, so it doesn't get cut. Don't edit any files.

   Blind reviewers get only the file text, the material path and that paragraph.
3. Sort the findings yourself (below). Merge duplicates across reviewers and say which reviewers
   raised them.

## Sorting

The reviewers suggest; you decide. Check each finding against the reviewer files' preferences and
what Mike has decided for this video:

- **Keep** findings that are real by those standards.
- **Drop** ones that contradict something Mike decided or prefers. Name the preference.
- **Ask** when it would change what the video says or how it's built. Those are his.

Report to Mike in one message, grouped by reviewer, must-fix first, with line numbers. One line for
what you dropped and why, so he can overrule it. Keep it skimmable: he reads on his phone.

## Learning

This is what makes the panel get better. After Mike reacts to a review:

- **He rejects a finding** ("I do that on purpose", "no, the ending stays"): add the preference
  behind it to that reviewer's **Mike's preferences**, phrased as a general rule when it's general
  ("ends with downtime for the end card") and as a one-video note in project memory when it isn't.
- **He agrees, or catches something none of them did:** add what to look for to the right
  reviewer's checklist, so it's caught next time.
- **Add a log line** to each reviewer file you touched: date, video, what changed.

Then publish with `quasarbright:update-plugin`. Blind reviewers' files only ever get general
"look for" rules, never a video's facts.
