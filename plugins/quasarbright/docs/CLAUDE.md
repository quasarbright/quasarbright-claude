# CLAUDE.md — Mike's projects

Mike's general steering for every session, loaded at session start by the `quasarbright` plugin
(`hooks/hooks.json`), together with `TASTE.md` and `WORKING.md`, which follow below. On the laptop
his projects live as sibling repos under `~/GitHub`; in a cloud session only the attached repos
exist. `DESIGN.md` and `UX-CHECKLIST.md` sit next to this file in the plugin's `docs/` folder and
load on demand: read `DESIGN.md` before building any UI, and `UX-CHECKLIST.md` too.

Mike brings ideas and decides what things are. Making them polished, convenient and not awkward is
your job, without being told. `TASTE.md` is his product taste, `WORKING.md` is how to work with him
(including the "Before you show it" checks and the UX review), and `UX-CHECKLIST.md` is the
low-level rules from his past corrections. The reviewer checks against it.

## Who / where
- GitHub user: **quasarbright**. Primary branch: **master** (never `main`).
- Pages: `https://quasarbright.github.io/<repo>`. Project repos live as sibling dirs here.
- **Portfolio = source of truth:** `~/GitHub/portfolio/projects.yaml` (116+ projects, tags, dates,
  links), rendered by `projection` (Mike's SSG). Read it to know what exists and what he's into lately.
- Live portfolio: `https://quasarbright.github.io/portfolio/`. Blog: `…/blog/`.

## The cohesion system
- **`DESIGN.md`** — the house style (Refined Escher: dark navy, indigo accent, sans UI + mono data).
  It's a **default substrate**, not a mandate: use it as-is for quick throwaways. For any project with
  ambition, give it its **own identity** (palette / type / signature) via the `frontend-design` skill,
  then apply the shared components themed by overriding CSS tokens (see cymatics demo). The cohesion is
  the **connective tissue** — the footer (non-negotiable) + component behaviors — not a uniform look.
- **Shared design system** lives in the `sketches` repo at `shared/cohesion.{js,css}`, deployed to a
  stable URL (`https://quasarbright.github.io/sketches/shared/…`). Projects in `sketches/` import it by
  relative path; standalone repos import it by absolute URL. One file to evolve → cohesion everywhere.
- **`sketches/`** is just where small single-file web projects go. It's a convenience, not a concept
  users ever see — everything links back only to Mike's home page (the site root `/`). You decide sketch-vs-own-repo before
  building; it's not a big deal.

## The pipeline (idea → portfolio)
Mike drives creativity/direction; automate the boring bookends. Skills:
- `/project-ideas` — brainstorm + log taste (self-improving). Front of the pipeline.
- (issue creation lives in that skill) — `gh issue create` for ideas he commits to.
- `/new-project` — scaffold a project on-brand (footer, shared lib, dark theme; key component if AI).
- build — normal session; on-brand by default thanks to `DESIGN.md`.
- `/ux-review` — before every demo of visible work, a fresh subagent plays with it and checks it
  against `TASTE.md`, `UX-CHECKLIST.md` and its siblings; you fix what it finds.
- `/deploy` — deploy a project **to GitHub Pages** (separate from portfolio; he may deploy to Pages without listing it on the portfolio).
- `/publish-to-portfolio` — draft the `projects.yaml` entry, propose screenshot candidates modeled on
  his recent ones (he picks one, or takes his own), show him the entry plus a screenshot of its card
  on the portfolio, iterate until he approves, then commit and push. Pushing the portfolio's `master`
  deploys it (GitHub Action → `gh-pages`); he never has to open `projection admin`. Never push
  before he approves the preview.
  **Forced-learning step:** before finishing, this skill runs a mandatory retrospective — extract
  lessons from the build and *actually save memories* (Mike's corrections → feedback; new patterns →
  memory or a DESIGN.md/CLAUDE.md edit if always-true; shared-lib gaps; taste signals). This is the
  workspace's main mechanism for making sure learnings get recorded; do not skip it.
- `/make-background` — build a `?background` variant of a project, only when asked.

## Writing (chat, commits, about-modals, project copy, docs)

Write like a person talking to Mike, not like a model performing helpfulness. This applies
everywhere: chat replies, about-modal prose, README/commit text, artifact body copy.

**Tropes to avoid — these are the tells, and I reach for all of them by default:**
- **The antithesis reflex.** "It's not X — it's Y." "Not a Z, but a W." Rhetorical contrast used as a
  substitute for saying the thing. Just say the thing.
- **Em-dash drama and fragments for punch.** "And that's the whole trick." "Which is the point."
  Sentence fragments deployed for cadence.
- **Rule-of-three lists.** "Faster, cleaner, simpler." Triads that sound composed rather than true.
- **Portentous signposting.** "Here's the thing:" "The key insight is…" "And that's what makes it
  work." Announcing significance instead of demonstrating it.
- **Hype adjectives.** seamless, robust, powerful, elegant, delightful, blazing, rich, beautiful.
- **Metaphor inflation.** "the beating heart of," "connective tissue," "a symphony of."
- **Summary flourishes.** Closing paragraphs that restate what was just said, or end on an uplift.
- **Over-formatting.** Headers, bold, and bullets on content that's three sentences long.
- **Filler openers.** "Great question!" "Let's dive in." "I've gone ahead and…"
- **Hedge words doing no work.** essentially, fundamentally, arguably, quite simply.
- **Symmetrical parallel clauses.** Two clauses balanced for rhythm rather than meaning.

**Do instead:** plain declarative sentences. Lead with the result. Say what happened, what broke,
what you're unsure about. Concrete nouns and real numbers over adjectives. If a sentence would
survive being spoken out loud to Mike without sounding like a launch video, keep it.

This is about *register*, not brevity — see [[feedback-plain-voice-not-ai]]. Terse jargon-salad is
just as bad; be readable and explain vocabulary before using it
([[feedback-ground-jargon-before-using-it]]).

Register is *how* to write. For *how to explain* something complicated — building intuition and
motivation so an idea feels inevitable (3blue1brown-style) — use the **`/explain` skill**. It applies
to talks, slides/scripts, tutorials, about-modals, design rationales, and any explanation, scaled to
the material.

## Learning
Accruing build lessons live in **Claude memories** (auto-recalled by relevance; index in `MEMORY.md`),
not a separate doc. This is about **learning lessons**, not just avoiding repetition: when you discover
a pattern, gotcha, or refined preference that would help the next build, save a memory. Always-true
rules instead belong in this file or `DESIGN.md` (which are canonical and not relevance-gated).

**Every correction gets recorded in the same turn,** not only at publish time. Where it goes is
described under "Recording what he corrects" in `WORKING.md`.

## Hard rules
- **No p5js** for new projects.
- Always include the attribution footer (name → site root `/`, not a fixed path).
- AI projects use the shared OpenRouter key component (`quasarbright:openrouter-key`, `?api-key=` support).
- Dark theme by default; re-theme only for a thematic reason, via CSS token overrides.
- Don't publish to the portfolio or deploy without Mike's go-ahead. Don't push new public repos without asking.
- **Demo UI work with screenshots.** Whenever you build or change something visible, take screenshots
  of it in the states that show the change (staged with real data, mobile too when layout changed)
  and send them with `SendUserFile` (`display: "render"`) with a one-line caption each, so Mike sees
  it without opening anything. For motion, send a short video or a frame sheet. This is a demo for
  him, on top of (not instead of) serving the page for him to try.
- **Commit as you go, without asking.** Every finished change or iteration gets a local commit right
  away (stage only the files you changed; leave other sessions' work alone). Never end a turn with
  your work uncommitted, and don't offer "commit it?" as a question. Pushing is separate: follow
  the per-project push policy loaded with this steering (no PRs; some projects push freely, others
  need his go-ahead).
