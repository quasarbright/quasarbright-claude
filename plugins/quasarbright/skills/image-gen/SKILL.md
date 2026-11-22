---
name: image-gen
description: The AI art polish pass for one of Mike's (quasarbright) projects - replace its hand-made SVG art with images from OpenRouter's gpt-image-2 (quality low), keep the set consistent, and show the results as finished in-game assets. Use only when Mike asks for image generation or the final art pass; art starts as SVG by default.
---

# Image generation: the art polish pass

Projects start with hand-made SVG art (`steering/rules/art-svg-first.md`). Near the end, when Mike
asks, this pass redraws that art with an image model. The SVG art stays in the repo: it's the
subject and pose reference for every generated image, and for cards added later.

Lessons below come from the onuw (werewolf) card test, 2026-11-22. Its files are in the Misc
project's shared folder, `/mnt/project-files/image-gen-test/` (README.md, scripts/, costs.jsonl),
when you're in that project.

## The API

- `POST https://openrouter.ai/api/v1/images`, header `Authorization: Bearer $OPENROUTER_IMAGE_API_KEY`.
  Body: `model`, `prompt`, `aspect_ratio` (`"1:1"`, `"3:4"`, ...), `quality`, optional
  `input_references: [{type: "image_url", image_url: {url: "data:image/png;base64,..."}}]`.
  The response has `data[0].b64_json` and `usage.cost` (matches real billing).
- Model: **`openai/gpt-image-2`, `quality: "low"`.** Medium costs 8x and looked the same. High is ~$0.21.
- The key is `claude-image-gen`, capped at **$5 a month**. It's a cloud environment secret, so only
  sessions started after it was added (2026-11-22) see it. If it's missing, say so; don't hunt for
  another key. No transparent backgrounds on this model; if a sprite needs one, ask first
  (`openai/gpt-image-1-mini`, ~$0.03, takes `background: "transparent"`).
- `gen.py` next to this file does one call, saves the PNG and logs the cost to `costs.jsonl`
  beside it: `python3 gen.py out.png "prompt" --ref svg.png --ref style.png`, or import `gen`.
  `python3 gen.py --spend` shows real usage on the key.

Cost per image (1024px): about **$0.006** with no references, **$0.013** with one, **$0.023** with
two. A 14-card set with two references is about $0.35. Check `--spend` before and after a batch
and report the total.

## Rate and spend

- **At most 2 or 3 requests in flight.** With 6 at once OpenRouter returned 403 "Key limit
  exceeded, $5.04 of $5.00 used" while real usage was ~$1.05: it holds a worst-case amount per
  open request against the cap. If you see that error, wait, check `--spend` (it lags about a
  minute), and continue with fewer in flight.
- Refused requests cost nothing.
- Generate one or two first, look at them, fix the prompt, then do the batch.

## Getting the style Mike wants

- GPT's default look is **too maximalist** for him. For onuw he liked minimalist, two-tone,
  medieval: a flat background color edge to edge, one solid silhouette in a dark ink of that
  color, detail only as thin cut lines, no gradients, shading, texture, outlines or third color.
  Ask what look this project wants if it isn't obviously the same; the SVG art usually shows it.
- Put exact hex colors from the project's code in the prompt. The model follows them.
- Say "square composition, full figure centered with a generous margin" so nothing gets cropped
  by the card frame. "No text, no lettering, no border, no frame" every time.
- The prompt that worked: subject line + the style paragraph + a sentence per reference saying
  what it's for. See `image-gen-test/scripts/prompts2.py`.

## Keeping a set consistent

Pass two `input_references`, in this order, and say in the prompt what each one is for:

1. **This item's current SVG**, rendered to PNG: "keep its subject and pose idea and its two-tone
   look, but draw it much better".
2. **The first approved generated image** of the set: "match its drawing style, line weight and
   level of detail exactly, but use this card's colors".

Make the first image alone, get Mike's OK on it, then use it as the style reference for the rest.

**Watch for motifs leaking from the style reference.** The werewolf's moon and stars showed up on
every card. Pick a style reference with little scenery, say in each prompt which elements this
item has ("No moon and no stars anywhere"), or use two style references with different scenery.
Look at every result for borrowed props before showing them.

## Edits

To change one image, send it as the only reference with an instruction ("same figure, colors and
cloak; lower the bow to his side"). gpt-image-2 keeps everything else intact. ~$0.013.

**Use neutral wording.** OpenAI's filter refused "arrow ... aimed" on a hunter card; describing
the pose plainly passed. If a request is refused, reword the pose or action, don't retry as-is.

## Showing the results

Mike judges art as it'll look in the game, never as raw pictures.

- Put the generated images into the real project (a skin or asset swap in a scratch copy or
  branch), and screenshot them with the project's own components and CSS: each card in its real
  frame, at its real size. The onuw version is `image-gen-test/scripts/cards.js`, which calls the
  game's `card()` and screenshots each card and a sheet.
- Send each item as its own 2x PNG plus **one labeled sheet** of the whole set (labels under each
  item, including any real-world reference name the project tracks). Side by side with the SVG
  version when he's deciding whether it's better.
- Note the cost of the batch and the month's spend in the same reply.
- After he approves, wire the images into the project for real (keep the SVGs), compress them to
  a sensible size for the web (the raw PNGs are ~1MB; a 512px WebP or PNG is plenty for a card),
  and test like any visible change (`WORKING.md`, "Before you show it").

Record his verdicts on the art in `docs/ART.md`, as with any art lesson.
