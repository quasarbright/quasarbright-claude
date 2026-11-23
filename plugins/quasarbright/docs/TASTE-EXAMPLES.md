# TASTE-EXAMPLES.md: screenshots of Mike's past verdicts

Text rules (`TASTE.md`, `UX-CHECKLIST.md`, `ART.md`) say what he corrected. They can't show what
"good" looks like to him. The taste examples do: every time he approves, rejects or corrects
something visual, the picture is saved with his verdict and his words. A design persona, or a fresh
subagent where there's no persona, looks at the closest ones before judging new work and asks
"would Mike pick this?" (Mike, 2026-11-23: "I want it to know my taste... I describe something and
it produces something that I'm happy with and don't have to iterate on.")

## Where they live

One private claude.ai artifact, **Taste Examples**: https://claude.ai/artifact/YHKnAetx2RnNmVt8Gong51

It's private to Mike, so pictures from private and unreleased projects go in too. Its page is a
gallery he can browse, filter (area, kind, project, verdict, persona misses) and comment on. Every
example is one document in its database collection `examples`, and every picture is one of its
assets. Any session with the Artifact tools reaches it (project threads and the app; tested
2026-11-23 from a project thread). The examples stay out of the plugin repo, which is public.

Each document, with its id as `<date>-<project>-<short-slug>`:

| field | meaning |
|---|---|
| `id`, `date` | the id again, and the day of the verdict (`YYYY-MM-DD`) |
| `project`, `area` | the project's repo or name; `ui` or `art` |
| `kind` | what it is. Reuse an existing kind so lookups find it: start screen, screen layout, panel, control, button, slider, icon, logo, item art, character art, card, chart, palette, hint text, animation |
| `verdict` | `approved`, `rejected`, or `corrected` (approved with a change, or a detail fixed) |
| `persona`, `personaSaid` | what the persona said before he saw it: `approved`, `flagged` or `none`, and its one line |
| `shows` | what the picture shows, in one line |
| `words` | his exact words; when he only tapped (a thumbs up, a pick), say that |
| `lesson` | the line it produced in a lessons doc, if any |
| `image`, `after` | asset ids of the picture he judged and, once it's fixed, the fixed version |

## Saving a verdict

Whoever records the verdict's lesson (`WORKING.md`, "Lessons from his verdicts") also saves the
example, in the same turn: the area's persona where the project has one, otherwise the build thread,
coordinator or session. It covers anything visual: screens, controls, layouts, art, icons, mocks he
picked or passed over. A verdict on a sequence saves one example per picture he marked.

1. Take the picture he judged: the screenshot or mock file from the build, or the review page's
   asset (`Artifact` `read` with the asset id as `path`). Shrink it to a 512px webp (about 350
   tokens when a persona looks at it):
   `ffmpeg -v error -y -i in.png -vf "scale='if(gte(iw,ih),min(512,iw),-2)':'if(gte(iw,ih),-2,min(512,ih))'" -c:v libwebp -quality 82 -frames:v 1 out.webp`
2. Upload it: `Artifact` publish with the artifact's `url`, `asset: true` and the file (or
   `file_paths` for several). Keep the returned asset id.
3. Write the document: `ArtifactData` `set` on collection `examples` (a `batch` for several).
4. When the fix lands later, upload its picture and `update` the document's `after`.

Never republish the page from a session that didn't read it first (`Artifact` `read`), and never
delete examples or assets unless Mike asks.

## Judging against them

Before reviewing visual work, or picking among mocks:

1. `ArtifactData` `query` on `examples`, filtered by `kind` (and `area`) when there are many,
   otherwise `list` it all; it's text only, so it's cheap. Pick the 5 to 8 closest: same kind
   first, then same area, then the same project; prefer rejected-then-fixed pairs and recent ones.
2. Fetch only those pictures (`Artifact` `read` with each asset id as `path`) and look at them.
3. For each candidate, say which examples it resembles and how, then judge: would Mike pick this,
   approve it as is, or say what? Name the example ids behind the call. "No defects" isn't
   approval; the question is whether it looks like the things he chose.
4. Where the examples disagree with a text rule, say so. That's a lesson to sharpen.

A persona can keep the pictures it opened in its own thread; its brief stays the durable memory.

## Misses

A miss is an example where `persona` is `approved` and `verdict` isn't: the persona passed
something he then rejected or corrected. The gallery counts them ("persona approvals Mike agreed
with") and filters to them. On its periodic cleanup a persona queries its misses, and a run on one
kind means its brief or a lessons doc is missing something, and it fixes that. It also reads any
comments Mike left on the gallery (`ArtifactComments`).
