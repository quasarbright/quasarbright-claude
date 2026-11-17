---
name: make-background
description: Produce a ?background variant of one of Mike's (quasarbright) visual projects so it can be used as a cycling hero background on the portfolio. Use only when Mike asks to make a background version of a specific project. Makes the visual auto-run with all UI/chrome hidden under ?background.
---

# Make a background variant

Mike's portfolio hero cycles through live project iframes (see `dynamicBackgrounds` in
`~/GitHub/portfolio/projection.config.json`, e.g. `…/evolving-particle-life/?background`). This skill
makes a given project look good as one of those — a silent, auto-running visual with no UI.

Only do this **when Mike asks**, for a **specific project**. Don't background everything.

## Steps

1. **Confirm the project** and open its source. Check whether it already imports the shared
   `cohesion.js`.
2. **Chrome hides automatically** if it uses the shared lib: under `?background`, `<mike-footer>`,
   `<about-modal>`'s button, and `<control-panel>` remove themselves. If the project does NOT use the
   shared lib, add manual handling: `if (new URLSearchParams(location.search).has("background")) { …hide
   controls/footer/UI… }`.
3. **Make it self-run and fullscreen** under `?background`:
   - **Fullscreen is required.** The visual must fill the entire viewport — the canvas goes
     `position:fixed; inset:0; width:100vw; height:100vh`, the normal framing/layout chrome (titles,
     panels, cards, borders) is hidden, and it handles resize. A unit-square sim should map to a
     centered square that *covers* the viewport (crop overflow) so it isn't distorted on wide screens.
   - Auto-start any animation/simulation (no click-to-start, no upload required).
   - Pick pleasing default parameters that look good immediately and **evolve** over time (e.g. slowly
     cycle through states/modes on a timer) so the background isn't static.
   - Remove/skip anything needing user input (file upload, key entry, prompts). If the visual can't run
     without input, pick a baked-in default asset/seed for background mode.
4. **Test** at `…/<project>/?background` in the browser — confirm zero UI, good motion, fills frame.
5. **Offer** to add the `…/<project>/?background` URL to `dynamicBackgrounds` in
   `portfolio/projection.config.json` (and/or `projects.yaml` `config.dynamicBackgrounds`). Don't deploy
   the portfolio — leave that to Mike / `/publish-to-portfolio`.

## Notes
- The background should be calm enough to sit behind hero text — avoid harsh full-frame flashing.
- Keep it cheap: a background may run for a while; don't peg the CPU.
