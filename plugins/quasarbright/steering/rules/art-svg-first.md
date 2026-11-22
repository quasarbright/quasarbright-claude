# Project art: hand-made SVG first, AI images only when asked

Art in Mike's projects (cards, characters, icons, illustrations, favicons) starts as hand-made SVG,
drawn in code. That's the default for every new project and every new piece of art, so the art can
change as fast as the design does.

AI image generation is a separate, later step: a final polish pass that replaces the SVG art with
generated art once the project has settled. Do it only when Mike asks for it ("do the image gen
pass", "make nice art with GPT"). Never reach for it on your own, even when SVG art is getting
hard. When he asks, use the `quasarbright:image-gen` skill (OpenRouter, `openai/gpt-image-2` at
quality `low`), which also covers keeping a set consistent and showing the results.

Keep the SVG versions after the pass: they are the subject and pose references for later edits
and for new cards added to the set.
