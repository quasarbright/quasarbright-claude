#!/usr/bin/env node
// Build the portfolio from the working tree and screenshot how one entry's card looks on it.
//
//   node preview-card.cjs <entry-id> [out-dir]
//
// Writes <out-dir>/<id>-card.png (the card alone), <id>-context.png (the card among its
// neighbors on desktop) and <id>-mobile.png (a full phone screen with the card in the middle).
// Nothing is deployed.

const { execFileSync } = require('child_process');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');

const id = process.argv[2];
if (!id) {
  console.error('usage: node preview-card.cjs <entry-id> [out-dir]');
  process.exit(1);
}
const outDir = path.resolve(process.argv[3] || path.join(os.tmpdir(), 'portfolio-preview'));
const portfolio = path.join(os.homedir(), 'GitHub', 'portfolio');

// Playwright isn't installed in the portfolio; borrow a sibling project's copy (pinned 1.63.0,
// which matches the browsers on disk).
function loadPlaywright() {
  const github = path.join(os.homedir(), 'GitHub');
  for (const dir of fs.readdirSync(github)) {
    const pkg = path.join(github, dir, 'node_modules', 'playwright');
    try {
      if (require(path.join(pkg, 'package.json')).version === '1.63.0') return require(pkg);
    } catch {}
  }
  throw new Error('no playwright@1.63.0 found under ~/GitHub/*/node_modules');
}

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json',
  '.gif': 'image/gif', '.webp': 'image/webp' };

function serve(root) {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(root, p);
    if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

(async () => {
  const site = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-build-'));
  execFileSync('projection', ['build', '--output', site], { cwd: portfolio, stdio: 'ignore' });
  fs.mkdirSync(outDir, { recursive: true });

  const server = await serve(site);
  const url = `http://127.0.0.1:${server.address().port}/`;
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch({ args: ['--mute-audio'] });

  async function shoot(viewport, files, phone = false) {
    const page = await browser.newPage({
      viewport, deviceScaleFactor: phone ? 3 : 2, isMobile: phone, hasTouch: phone,
    });
    // Only load the site itself and fonts; the hero's background iframes are other sites.
    await page.route('**/*', (route) => {
      const u = route.request().url();
      if (u.startsWith(url) || u.includes('fonts.g')) return route.continue();
      return route.abort();
    });
    await page.goto(url, { waitUntil: 'networkidle' });
    // Featured entries also appear in the Featured strip; the last match is the card in the main grid.
    const card = page.locator(`.project-card[data-project-id="${id}"]`).last();
    if ((await card.count()) === 0) throw new Error(`no card with data-project-id="${id}" in the build`);
    if (!(await card.isVisible())) throw new Error(`card "${id}" is in the build but not visible on page 1`);
    await card.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(400); // thumbnails fade in
    // Pause hover effects and the cursor so the card is at rest.
    await page.mouse.move(0, 0);
    if (files.screen) await page.screenshot({ path: path.join(outDir, files.screen) });
    if (files.card) await card.screenshot({ path: path.join(outDir, files.card) });
    if (files.context) {
      const box = await card.boundingBox();
      const pad = 24;
      const width = viewport.width;
      const top = Math.max(0, box.y - box.height * 0.5);
      await page.screenshot({
        path: path.join(outDir, files.context),
        clip: { x: 0, y: top, width, height: Math.min(box.height * 2 + pad, viewport.height - top) },
      });
    }
    await page.close();
  }

  await shoot({ width: 1440, height: 1000 }, { card: `${id}-card.png`, context: `${id}-context.png` });
  // A whole phone screen with the card in the middle, as it looks scrolling the page on a phone.
  await shoot({ width: 390, height: 844 }, { screen: `${id}-mobile.png` }, true);

  await browser.close();
  server.close();
  fs.rmSync(site, { recursive: true, force: true });
  for (const f of [`${id}-card.png`, `${id}-context.png`, `${id}-mobile.png`]) console.log(path.join(outDir, f));
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
