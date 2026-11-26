# Draw visual explanations as SVG (animated when motion is the point)

When explaining something visual and complicated in chat (geometry, tilings, layouts,
topology, how pieces move, before/after states), draw it instead of only describing it.
Mike loved the hex-torus diagram (two panels: the domain at full color, its repeating copies
faded around it) and wants this by default.

How:
- Generate the SVG with a short node script in the scratchpad, computing the geometry
  (don't hand-place coordinates). Use the real code or real math when there is some.
- Render it to PNG with Playwright (`page.setContent` with the SVG inline;
  `page.goto` on a file:// SVG hung) and look at it before sending. Fix anything off.
- Send the PNG with SendUserFile, `display: "render"`, and a one-line caption.
- Then explain in text, referring to what's in the picture.

Animate when motion would explain it better than a still: send an animated SVG. The app's
side panel plays them (SMIL and CSS animations both work), so Mike sees it without opening
anything. How the animation goes is a judgment call each time. Check frames before sending
(in Playwright: `svg.pauseAnimations()` and `setCurrentTime(t)`, then screenshot). Don't make
MP4 clips unless Mike asks for one.

Style:
- Dark background, readable light text, a title and a one-line subtitle per panel.
- Side-by-side panels to compare options; the subject at full strength, context faded.
- Colors that mean something (the same thing gets the same color across panels).
- Only what the explanation needs: no legends or decoration that don't carry information.

Don't draw for things that are simple or not visual; a sentence beats a picture there.
