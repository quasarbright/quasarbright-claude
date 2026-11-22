---
name: image-gen
description: Generate or edit images for one of Mike's (quasarbright) projects with OpenRouter's gpt-image-2 (quality low) - the API, key, costs, rate limits, references, edits and how to show the results. Use only when Mike asks for image generation; project art starts as hand-made SVG by default.
---

# Image generation

Project art starts as hand-made SVG (`steering/rules/art-svg-first.md`). Use this skill only when
Mike asks for generated images, usually as a final polish pass on a project.

## The API

- `POST https://openrouter.ai/api/v1/images`, header `Authorization: Bearer $OPENROUTER_IMAGE_API_KEY`.
  Body: `model`, `prompt`, `aspect_ratio` (`"1:1"`, `"3:4"`, ...), `quality`, and optionally
  `input_references: [{type: "image_url", image_url: {url: "data:image/png;base64,..."}}]`.
  The response has `data[0].b64_json` and `usage.cost` (matches real billing).
- Model: **`openai/gpt-image-2`, `quality: "low"`.** Medium costs about 8x and looks about the
  same; high is about 0.21 USD an image. It can't make transparent backgrounds; if something needs
  one, ask first (`openai/gpt-image-1-mini`, about 0.03 USD, takes `background: "transparent"`).
- The key is `claude-image-gen`, capped at **10 USD a month**. It's a cloud environment secret, so only
  sessions started after it was added (2026-11-22) see it. If it's missing, say so; don't look for
  another key.
- `gen.py` next to this file makes one call, saves the PNG and logs the cost to `costs.jsonl`
  beside it: `python3 gen.py out.png "prompt" --ref a.png --ref b.png`, or import `gen`.
  `python3 gen.py --spend` shows the key's real usage.

## Cost, rate and spend

- About **0.006 USD** an image with no references, **0.013 USD** with one, **0.023 USD** with two
  (1024px).
- **At most 2 or 3 requests in flight.** More than that can return a false 403 "Key limit
  exceeded": OpenRouter holds a worst-case amount per open request against the cap. If you see
  it, wait, check `--spend` (it lags about a minute) and continue with fewer in flight.
- Refused requests cost nothing.
- Make one or two first, look at them, fix the prompt, then do the rest.
- Check `--spend` before and after a batch and report the batch cost and the month's total.

## Prompts

- GPT's default look is maximalist. Mike tends to prefer simpler, flatter art; describe the look
  you want explicitly (palette, how many colors, line style, what to leave out) instead of relying
  on the default. When the project's existing art already has a look, match it.
- Put exact hex colors from the project's code in the prompt; the model follows them.
- Ask for the framing the asset needs (for example "centered with a generous margin") so nothing
  gets cropped where it's used, and add "no text, no lettering, no border, no frame" unless you
  want them.
- **Use neutral wording.** OpenAI's filter refuses some action words (weapons aimed, violence) even
  in harmless contexts. Describe the pose or scene plainly, and if a request is refused, reword it
  rather than retrying as-is.

## References and consistency

`input_references` take up to 16 images. Say in the prompt what each reference is for: the
subject or layout to keep, or the style to match. For a set of related images, a good pattern is
the item's existing drawing (for subject and composition) plus one approved generated image (for
style). Get Mike's OK on the first image before using it as the style reference for the rest.

The old drawing pulls the drawing quality toward itself too. When the old version is crude, a
result can come out as a near-trace of it (onuw's Lookalike and first Villager redo did, and Mike
said they looked like the old SVG). Compare each result with the old version before showing it,
and when it's too close, regenerate from the subject in words plus approved generated images only.

A style reference can leak its content: props, background elements or scenery from it show up in
every result. Say in the prompt what this image should and shouldn't contain, and check each
result for borrowed elements before showing it.

## Edits

To change an image, send it as the only reference with an instruction ("same figure and colors,
change only X"). gpt-image-2 keeps everything else intact. About 0.013 USD.

## Showing the results

Mike judges art as it will actually look, not as raw pictures. Put the images into the real
project (a scratch copy or branch), and screenshot them in place, at their real size, using the
project's own components and CSS. Send each as its own 2x PNG, plus one labeled sheet when it's a
set, beside the current version when he's deciding whether it's better.

After he approves, wire them in for real (keep the originals they replaced), resize and compress
for the web (the raw PNGs are about 1MB), and test like any visible change (`WORKING.md`, "Before
you show it"). Record his verdicts in `docs/ART.md`.
