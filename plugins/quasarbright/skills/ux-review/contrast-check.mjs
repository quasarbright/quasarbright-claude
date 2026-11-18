#!/usr/bin/env node
// Measures text contrast against what is really drawn behind each piece of text: images, iframes,
// gradients and animated backgrounds included. It screenshots the page with every glyph made
// transparent (text shadows and outlines stay, since they protect the text), samples the pixels
// under each text box over a few frames, and reports text whose contrast falls below WCAG AA
// (4.5:1, or 3:1 for large text) against the worst tenth of what sits behind it.
//
// Run it from a folder where `playwright` resolves (any project with it in node_modules):
//   node contrast-check.mjs <url> [--width 375 --height 812 --mobile] [--frames 3]
//        [--wait 1500] [--scroll] [--setup "<js run in the page before measuring>"] [--show "142 proj"]
// Prints one line per failing text element, worst first, and exits 1 when any fail. --show also
// prints every element whose text contains that string, passing or not.

import { createRequire } from 'node:module';

const args = process.argv.slice(2);
const url = args.find(a => !a.startsWith('--') && !isValue(a));
function isValue(a) { const i = args.indexOf(a); return i > 0 && args[i - 1].startsWith('--') && !['--mobile', '--scroll'].includes(args[i - 1]); }
const opt = (name, def) => { const i = args.indexOf('--' + name); return i < 0 ? def : args[i + 1]; };
const flag = name => args.includes('--' + name);
if (!url) { console.error('usage: node contrast-check.mjs <url> [--width W --height H --mobile --frames N --wait MS --scroll --setup JS]'); process.exit(2); }

let playwright;
for (const base of [process.cwd() + '/', import.meta.url]) {
  try { playwright = createRequire(base)('playwright'); break; } catch {}
}
if (!playwright) { console.error('playwright not found: run this from a project that has it in node_modules'); process.exit(2); }

const width = +opt('width', 1440), height = +opt('height', 900), mobile = flag('mobile');
const frames = +opt('frames', 3), wait = +opt('wait', 1500);

const browser = await playwright.chromium.launch({ args: ['--mute-audio'] });
const page = await browser.newPage({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(wait);
if (opt('setup')) { await page.evaluate(opt('setup')); await page.waitForTimeout(wait); }

const failures = new Map();
const scrollSteps = flag('scroll') ? await page.evaluate(() => Math.ceil(document.documentElement.scrollHeight / innerHeight)) : 1;

for (let step = 0; step < scrollSteps; step++) {
  await page.evaluate(y => window.scrollTo(0, y), step * height);
  await page.waitForTimeout(300);

  // Every visible element that directly holds text, with its text color and size.
  const items = await page.evaluate(() => {
    const out = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const el = n.parentElement;
      if (!el || seen.has(el) || !n.textContent.trim()) continue;
      seen.add(el);
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
      const range = document.createRange(); range.selectNodeContents(n);
      const r = range.getBoundingClientRect();
      if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
      let alpha = 1;
      for (let e = el; e; e = e.parentElement) alpha *= +getComputedStyle(e).opacity;
      const size = parseFloat(cs.fontSize), weight = parseInt(cs.fontWeight) || 400;
      out.push({
        text: n.textContent.trim().replace(/\s+/g, ' ').slice(0, 40),
        tag: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : ''),
        color: cs.color, alpha,
        large: size >= 24 || (size >= 18.66 && weight >= 700),
        box: { x: Math.max(0, r.left), y: Math.max(0, r.top), w: Math.min(r.width, innerWidth - Math.max(0, r.left)), h: Math.min(r.height, innerHeight - Math.max(0, r.top)) },
        size,
      });
    }
    return out;
  });

  // Screenshots of the page with the glyphs hidden: what the text actually sits on.
  const hide = await page.addStyleTag({ content: '* { color: transparent !important; caret-color: transparent !important; }' });
  const shots = [];
  for (let f = 0; f < frames; f++) {
    shots.push((await page.screenshot()).toString('base64'));
    if (f < frames - 1) await page.waitForTimeout(700);
  }
  await hide.evaluate(el => el.remove());

  const results = await page.evaluate(async ({ items, shots }) => {
    const parse = c => { const m = c.match(/[\d.]+/g).map(Number); return { r: m[0], g: m[1], b: m[2], a: m[3] ?? 1 }; };
    const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const datas = [];
    for (const s of shots) {
      const img = await createImageBitmap(await (await fetch('data:image/png;base64,' + s)).blob());
      const c = new OffscreenCanvas(img.width, img.height); const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
      datas.push(ctx.getImageData(0, 0, img.width, img.height));
    }
    return items.map(it => {
      const fg = parse(it.color); const a = fg.a * it.alpha;
      const ratios = [];
      for (const d of datas) {
        const step = Math.max(1, Math.floor(Math.sqrt(it.box.w * it.box.h / 400)));
        for (let y = Math.floor(it.box.y); y < it.box.y + it.box.h; y += step)
          for (let x = Math.floor(it.box.x); x < it.box.x + it.box.w; x += step) {
            const i = (y * d.width + x) * 4; const br = d.data[i], bg = d.data[i + 1], bb = d.data[i + 2];
            // Blend translucent text over this pixel, then compare.
            const tr = fg.r * a + br * (1 - a), tg = fg.g * a + bg * (1 - a), tb = fg.b * a + bb * (1 - a);
            ratios.push(ratio(lum(tr, tg, tb), lum(br, bg, bb)));
          }
      }
      ratios.sort((x, y) => x - y);
      return { ...it, worst: ratios[Math.floor(ratios.length * 0.1)] ?? 21, median: ratios[Math.floor(ratios.length / 2)] ?? 21 };
    });
  }, { items, shots });

  for (const r of results) {
    const need = r.large ? 3 : 4.5;
    if (opt('show') && r.text.includes(opt('show')))
      console.log(`show: ${r.worst.toFixed(2)}:1 (needs ${need}, median ${r.median.toFixed(2)}) ${r.size}px ${r.tag} "${r.text}" at scrollY ${step * height}`);
    if (r.worst >= need) continue;
    const key = r.tag + '|' + r.text;
    const prev = failures.get(key);
    if (!prev || r.worst < prev.worst) failures.set(key, { ...r, need, scrollY: step * height });
  }
}

await browser.close();
const list = [...failures.values()].sort((a, b) => a.worst / a.need - b.worst / b.need);
console.log(`${list.length} text element(s) below WCAG AA at ${width}x${height}${mobile ? ' (mobile)' : ''}`);
for (const f of list)
  console.log(`${f.worst.toFixed(2)}:1 (needs ${f.need}, median ${f.median.toFixed(2)}) ${f.size}px ${f.tag} "${f.text}" at scrollY ${f.scrollY}`);
process.exit(list.length ? 1 : 0);
