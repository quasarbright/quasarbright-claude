---
name: video-review
description: Review one of Mike's (quasarbright) YouTube videos with a panel of reviewers (fact check, clarity, entertainment, pacing, hook and packaging, script vs screen, visual polish) at the script stage or on a draft render. Each reviewer keeps a long-term file of what Mike wants in his live taste store, so they learn across videos. Use whenever Mike asks for a script or video review, before recording the real voiceover, and before final render.
---

# Video review

Mike writes his scripts himself and directs the animation. These reviewers find what a viewer or a
comment section would find, before the video is out. The hard calls (what the video is, what's
funny, what to cut) stay his. You run the panel, sort what comes back, and show him the result.

## The reviewers

Each one is a persona in Mike's live taste store (domain `video`; the `persona` skill): its job,
what to look for, **what Mike wants** learned so far and a dated **log**. That's the reviewer's
long-term memory, shared live by every session and machine.

| reviewer | name | persona id | sees | script stage | storyboard | draft render |
|---|---|---|---|---|---|---|
| Fact check | Clippy | `video-fact-check` | informed | yes |  |  |
| Clarity | Ben | `video-clarity` | **blind** | yes |  | yes |
| Entertainment | Quentin | `video-entertainment` | informed | yes |  | yes |
| Pacing | Fletcher | `video-pacing` | informed | yes |  | yes |
| Hook and packaging | Hooky | `video-hook` | **blind** | yes |  |  |
| Script vs screen | Annie | `video-script-screen` | informed | yes, once `>` notes exist | yes | yes |
| Visual polish | Grant | `video-visual-polish` | informed |  | yes | yes |

Refer to each reviewer by its name (the persona skill's Names table), in the report too.

Before a run, build each reviewer's file from the store: export `personas`, `log`, and `lessons`
where `domain == video` with `ArtifactData` `query` and `out_dir`, then
`python3 -I ../persona/store.py persona <dir> <persona id> > <scratch>/<id>.md`.

**Blind** reviewers judge as a stranger would. They get their file and the material, and nothing
else: no notes on the video, no reflections, no project memory, none of your opinions, and never
the store itself (you build their file for them). Their file still grows (what to look for), but
it never holds facts about a particular video.

**Informed** reviewers get the reviewer file plus the context a collaborator would have, listed
below. They're the ones who remember Mike.

## Material

- **Planned visuals:** when a passage's visuals are already known (an about modal, an earlier video's
  scene, a `>` note pointing at something that exists), give the reviewer that material too, so it
  judges the passage with its pictures. Mike explains with visuals and expects them to carry part of
  the load.
- **Script stage:** the script, read fresh from where Mike keeps it right before the run. For Obsidian
  scripts, his Mac copy (`~/GitHub/learn-obsidian`) is newer than GitHub; read it through the device
  tools. Never edit his Obsidian files. If a video is split into parts, give only the part under
  review, and say in one line that it's a part.
- **Storyboard:** the 2 or 3 still frames (PNG) for one scene, that block's lines from `script.py`
  with Mike's `>` notes for it from the script, and the video's theme. Give the frames of scenes
  already built too, so they can judge whether the new one fits.
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
   reviewer's file (built above, full text), the material's paths, the context paths if informed, and this:

   > Review this as described in your file. Read all of it before writing anything. Report
   > findings most important first. Each finding gives: where (a line number or a quote, or a
   > timestamp), what's wrong as a viewer would experience it, and the smallest fix that solves
   > it, in Mike's voice if it's a wording change. Mark each **must-fix** (a viewer would notice or
   > a commenter would call it out) or **consider**. Don't report typos or spelling at the script
   > stage. Don't pad: if something works, say nothing about it, except for at most three lines
   > on what works best, so it doesn't get cut. Don't edit any files.

   Blind reviewers get only their file text, the material path and that paragraph.
3. **A storyboard run** (the `narrated-video` skill, "Storyboard before animating") is Grant and
   Annie only. Before judging, each reads the 5 to 8 closest `video` examples with pictures (the
   `persona` skill, "A review"). Their prompt replaces the paragraph above with:

   > These are 2 or 3 candidate frames for one scene. Pick the one Mike would pick, judged against
   > his past verdicts and your file, and name the example ids behind the call. Say in one line
   > why, as he'd read it. If none would pass, send them all back with what's wrong with each. Don't
   > edit any files.

   When they agree, that's the pick. When they split, you choose and say so. All rejected sends
   the frames back for one more round; after two rounds, show Mike the best one with the open
   question. Record the pick on each persona's example when he answers (`persona` `approved`).
4. Sort the findings yourself (below). Merge duplicates across reviewers and say which reviewers
   raised them.

## Sorting

The reviewers suggest; you decide. Check each finding against the reviewers' learned preferences and
what Mike has decided for this video:

- **Keep** findings that are real by those standards.
- **Drop** ones that contradict something Mike decided or prefers. Name the preference.
- **Ask** when it would change what the video says or how it's built. Those are his.

Report to Mike in one message, must-fix first, with line numbers. **Every finding names the
reviewer(s) who raised it and gives a brief reason** (what a viewer would experience, or the source
for a fact), so he can weigh it (Mike, 2026-11-18). One line for
what you dropped and why, so he can overrule it. Keep it skimmable: he reads on his phone.

## Learning

This is what makes the panel get better. After Mike reacts to a review:

- **He rejects a finding** ("I do that on purpose", "no, the ending stays"): add the preference
  behind it as a lesson for that reviewer (`persona` set to its id, `kind` `preference`), phrased
  as a general rule when it's general ("ends with downtime for the end card") and as a one-video
  note in project memory when it isn't.
- **He agrees, or catches something none of them did:** add what to look for as a lesson for the
  right reviewer (`kind` `rule`), so it's caught next time.
- **Save the verdict** as an example (`area` `video`, kind `script line`, `title`, `joke`...) with
  his words, and mark what the reviewer had said, so misses get counted.
- **A visual verdict saves its picture.** On a storyboard, the frame he judged; on a render, the
  frame at the moment he means (`ffmpeg -ss <t> -i render.mp4 -frames:v 1 frame.png`, then the
  persona skill's 512px webp step). Kinds: `palette`, `title card`, `diagram`, `code animation`,
  `transition`, `scene layout`, `storyboard`. A storyboard pick he later rejects or corrects is a
  miss for Grant and Annie.
- **Add a log line** for each reviewer you touched: date, video, what changed.

All of this goes in the store, live, with no plugin publish (the `persona` skill, "When Mike gives
a verdict"). Blind reviewers only ever get general "look for" lessons, never a video's facts.
