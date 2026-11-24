#!/usr/bin/env python3
"""Turn an export of the taste store into text a reviewer can read.

Export first with ArtifactData (query or list with out_dir=<dir>), which writes
<dir>/<collection>/<id>.json. Then:

  python3 -I store.py lessons <dir> [--domain ID] [--persona ID]   active lessons as markdown
  python3 -I store.py persona <dir> PERSONA_ID                     a persona's file as markdown
  python3 -I store.py misses  <dir> [--persona ID]                 examples the persona got wrong

Active lessons are the ones no other record supersedes and that aren't retirements.
"""
import glob, json, os, sys


def load(d, coll):
    out = []
    for f in sorted(glob.glob(os.path.join(d, coll, '*.json'))):
        with open(f) as fh:
            out.append(json.load(fh))
    return out


def active(lessons):
    gone = set()
    for r in lessons:
        gone.update(r.get('supersedes') or [])
    return [r for r in lessons if r['id'] not in gone and not r.get('retired')]


def opt(args, name):
    return args[args.index(name) + 1] if name in args else None


def lessons_md(rows, h='##'):
    lines, topic = [], object()
    for r in sorted(rows, key=lambda r: (r.get('topic') or '', r.get('createdAt') or '')):
        if r.get('topic') != topic:
            topic = r.get('topic')
            lines.append(f"\n{h} {topic or 'General'}\n")
        text = r['text'].replace('\n', '\n  ')
        lines.append(f"- {text}  `[{r['id']}]`")
    return '\n'.join(lines).strip() + '\n'


def main(argv):
    if len(argv) < 2:
        sys.exit(__doc__)
    cmd, d, rest = argv[0], argv[1], argv[2:]
    if cmd == 'lessons':
        rows = active(load(d, 'lessons'))
        dom, per = opt(rest, '--domain'), opt(rest, '--persona')
        if dom:
            rows = [r for r in rows if r.get('domain') == dom]
        rows = [r for r in rows if r.get('persona') in (None, per)] if per else [r for r in rows if not r.get('persona')]
        print(lessons_md(rows), end='')
    elif cmd == 'persona':
        pid = rest[0]
        p = next((x for x in load(d, 'personas') if x['id'] == pid), None)
        if not p:
            sys.exit(f'no persona {pid} in {d}/personas')
        print(f"# {p['name']}\n\n{p.get('role', '').strip()}\n")
        if p.get('looksFor'):
            print(f"## What to look for\n\n{p['looksFor'].strip()}\n")
        mine = [r for r in active(load(d, 'lessons')) if r.get('persona') == pid]
        if mine:
            print("## What Mike wants (learned)\n")
            print(lessons_md(mine, '###'))
        log = sorted((x for x in load(d, 'log') if x.get('persona') == pid), key=lambda x: x.get('at', ''))
        if log:
            print("## Log\n")
            for x in log:
                print(f"- {x.get('at', '')}: {x['text']}")
    elif cmd == 'misses':
        per = opt(rest, '--persona')
        for e in load(d, 'examples'):
            if e.get('persona') == 'approved' and e.get('verdict') != 'approved' and (not per or e.get('personaId') == per):
                print(f"- {e.get('date')} {e['id']} [{e.get('kind')}] persona said: {e.get('personaSaid') or '-'} | Mike: {e.get('words')}")
    else:
        sys.exit(__doc__)


if __name__ == '__main__':
    main(sys.argv[1:])
