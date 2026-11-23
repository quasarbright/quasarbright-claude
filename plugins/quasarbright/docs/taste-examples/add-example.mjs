#!/usr/bin/env node
// Saves one taste example: downscales the screenshot(s) to webp, writes the record and adds a
// line to INDEX.md (and to MISSES.md when the persona approved something Mike then turned down).
// Needs ffmpeg with libwebp (it's installed wherever manim is).
//
// node add-example.mjs --image shot.png [--after fixed.png] --kind "start screen" --area ui \
//   --project cutwist --verdict rejected --persona approved --words "his exact words" \
//   --shows "what the picture shows" [--persona-said "what the persona said"] \
//   [--lesson "UX-CHECKLIST.md: rows are one height"] [--slug short-name] [--date 2026-11-23]
// --private yes: the project isn't public, so only the text is saved (this folder is public).
// Fixed later? node add-example.mjs --fixed <id> --after fixed.png adds the after picture.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const dir = path.dirname(new URL(import.meta.url).pathname);

const args = {};
for (let i = 2; i < process.argv.length; i += 2) args[process.argv[i].replace(/^--/, '')] = process.argv[i + 1];

// Long edge 512px: about 350 tokens when a persona looks at it.
function toWebp(src, out) {
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src, '-vf',
    "scale='if(gte(iw,ih),min(512,iw),-2)':'if(gte(iw,ih),-2,min(512,ih))':flags=lanczos",
    '-c:v', 'libwebp', '-quality', '82', '-frames:v', '1', path.join(dir, out)]);
}

if (args.fixed) {
  const recPath = path.join(dir, args.fixed + '.md');
  if (!fs.existsSync(recPath) || !args.after) { console.error('--fixed <existing id> --after <png>'); process.exit(1); }
  const rec = fs.readFileSync(recPath, 'utf8');
  if (rec.includes('image: not saved')) { console.log('private project: picture not saved'); process.exit(0); }
  toWebp(args.after, args.fixed + '-after.webp');
  if (!/^after:/m.test(rec)) fs.writeFileSync(recPath, rec.replace(/^(image: .*)$/m, `$1\nafter: ${args.fixed}-after.webp`));
  console.log(args.fixed);
  process.exit(0);
}
const need = ['image', 'kind', 'area', 'project', 'verdict', 'persona', 'words', 'shows'];
const missing = need.filter((k) => !args[k]);
if (missing.length) { console.error('missing: --' + missing.join(' --')); process.exit(1); }
if (!['approved', 'rejected', 'corrected'].includes(args.verdict)) { console.error('--verdict approved|rejected|corrected'); process.exit(1); }
if (!['approved', 'flagged', 'none'].includes(args.persona)) { console.error('--persona approved|flagged|none'); process.exit(1); }

const date = args.date || new Date().toISOString().slice(0, 10);
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
let id = `${date}-${slugify(args.project)}-${slugify(args.slug || args.kind)}`;
for (let n = 2; fs.existsSync(path.join(dir, id + '.md')); n++) id = id.replace(/-\d+$/, '') + '-' + n;

const priv = !!args.private;
if (!priv) {
  toWebp(args.image, id + '.webp');
  if (args.after) toWebp(args.after, id + '-after.webp');
}

const one = (s) => String(s).replace(/\s+/g, ' ').trim();
const rec = [
  '---', `id: ${id}`, `date: ${date}`, `project: ${args.project}`, `area: ${args.area}`, `kind: ${args.kind}`,
  `verdict: ${args.verdict}`, `persona: ${args.persona}`,
  ...(priv ? ['image: not saved (private project)'] : [`image: ${id}.webp`, ...(args.after ? [`after: ${id}-after.webp`] : [])]), ...(args.lesson ? [`lesson: ${one(args.lesson)}`] : []), '---',
  `Shows: ${one(args.shows)}`, `Mike: "${one(args.words)}"`,
  ...(args['persona-said'] ? [`Persona said: ${one(args['persona-said'])}`] : []), '',
].join('\n');
fs.writeFileSync(path.join(dir, id + '.md'), rec);

const short = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
fs.appendFileSync(path.join(dir, 'INDEX.md'),
  `| ${id}${priv ? ' (text only)' : ''} | ${args.area} | ${args.kind} | ${args.verdict} | ${args.persona} | ${short(one(args.shows), 70)} | ${short(one(args.words), 90)} |\n`);
if (args.persona === 'approved' && args.verdict !== 'approved') {
  fs.appendFileSync(path.join(dir, 'MISSES.md'),
    `- ${date} · ${args.project} · ${args.kind} · persona: ${short(one(args['persona-said'] || 'approved'), 80)} · Mike: "${short(one(args.words), 100)}" · [[${id}]]\n`);
}
console.log(id);
