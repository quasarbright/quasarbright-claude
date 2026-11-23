# Taste examples: screenshots of Mike's past verdicts

Text rules (`TASTE.md`, `UX-CHECKLIST.md`, `ART.md`) say what he corrected. They can't show what
"good" looks like to him. This folder does: every time he approves, rejects or corrects something
visual, the picture is saved here with his verdict and his words. A design persona, or a fresh
subagent where there's no persona, looks at the closest ones before judging new work and asks
"would Mike pick this?" (Mike, 2026-11-23: "I want it to know my taste... I describe something and
it produces something that I'm happy with and don't have to iterate on.")

Files:
- `INDEX.md`: one line per example. Read this first; it's cheap.
- `<id>.md`: the record (project, area, kind, verdict, what the persona had said, his words, the
  lesson it produced). `<id>.webp` is the picture, `<id>-after.webp` the fixed version if there is one.
- `MISSES.md`: one line each time a persona approved something he then rejected or corrected.
- `add-example.mjs`: writes all of the above for one verdict. Needs ffmpeg.

## Saving a verdict

Whoever records the verdict's lesson (`WORKING.md`, "Lessons from his verdicts") also saves the
example, in the same turn: the area's persona where the project has one, otherwise the build thread,
coordinator or session. It applies to anything visual: screens, controls, layouts, art, icons,
mocks he picked or passed over. A verdict on a sequence saves one example per picture he marked.

```bash
node <plugin>/docs/taste-examples/add-example.mjs --image shot.png [--after fixed.png] \
  --area ui --kind "start screen" --project cutwist --verdict rejected \
  --persona approved --persona-said "what it said" \
  --shows "what's in the picture, in one line" --words "his exact words" \
  [--lesson "UX-CHECKLIST.md: the line it produced"] [--slug short-name]
```

- `--verdict`: `approved`, `rejected`, or `corrected` (he approved with a change, or fixed a detail).
- `--persona`: what the persona said before he saw it: `approved`, `flagged`, or `none` (no persona
  reviewed it). An `approved` that he rejected or corrected is a miss and also goes in `MISSES.md`.
- `--kind`: reuse a kind from `INDEX.md` when one fits, so lookups find it: start screen, screen
  layout, panel, control, button, slider, icon, logo, item art, character art, card, chart, palette,
  hint text, animation.
- `--words`: copy what he said. When he only tapped (thumbs up, a pick), write that.
- When the fix lands later, add its picture: `add-example.mjs --fixed <id> --after fixed.png`.
- The picture is the one he judged: the screenshot or mock file from the build, or the review
  page's asset (`Artifact` read with the asset id as `path`). Routed notes from the Review desk
  name it.

**This folder is public** (the plugin repo is public). Save pictures only from projects that are
already public (a public repo or a live Pages site). For a private or unreleased project, add
`--private yes`: the record and index line keep his words, without the picture. Once a private
examples repo exists (below), those pictures go there.

Commit and push the new files with the plugin (`quasarbright:update-plugin`; a new example doesn't
need a version bump). Other sessions read the folder from the repo, not from their installed copy.

## Judging against them

Before reviewing visual work, or picking among mocks:

1. Read `INDEX.md`. Pick the 5 to 8 closest examples: same kind first, then same area, then the
   same project; prefer rejected-then-fixed pairs and recent ones. Don't open the rest.
2. Open those pictures and records (about 350 tokens each at 512px).
3. For each candidate, say which examples it resembles and how, then judge: would Mike pick this,
   approve it as is, or say what? Name the example ids behind the call. "No defects" isn't
   approval; the question is whether it looks like the things he chose.
4. Where the examples disagree with a text rule, say so. That's a lesson to sharpen.

A persona can keep the pictures it opened in its own thread; its brief stays the durable memory.
On its periodic cleanup it reads `MISSES.md`: a run of misses on one kind means its brief or the
lessons docs are missing something, and the fix goes there.

## Moving the pictures to their own repo

When the folder passes about 20 MB, or once Mike wants private projects' pictures kept: he creates
a private repo (for example `quasarbright/taste-examples`), the pictures and records move there
(`git mv` the `.webp` and `<id>.md` files; a public history can be scrubbed with `git filter-repo`
if he asks), and `INDEX.md`, `MISSES.md`, this README and the script stay here with the script's
output folder pointed at a clone of the new repo. Sessions then add that repo (`add_repo`) to open
pictures.
