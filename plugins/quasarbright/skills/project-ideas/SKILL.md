---
name: project-ideas
description: Brainstorm new coding/creative project ideas for Mike (quasarbright). Use whenever Mike asks for project ideas, "what should I build", new things to make, or wants to riff on directions for his portfolio. Captures his taste, where to survey his existing work, and a self-improving brainstorming process.
---

# Project Idea Brainstorming for Mike

Your job: generate a stream of project ideas Mike will actually want to build, recalibrating from his reactions. This is a conversation, not a one-shot list. The bar is high — he has 100+ projects and strong, specific taste.

## First, survey what he's already done

Before/while brainstorming, look at his existing work so you (a) don't suggest duplicates and (b) spot recent **trends** (what he's been into lately tells you where his head is):

- **Portfolio source of truth:** `~/GitHub/portfolio/projects.yaml` — every project with tags, dates, descriptions. Read this first. Sort by `creationDate` to see recent momentum.
- **Live site:** https://quasarbright.github.io/portfolio/ (and individual project pages / `sourceLink`s)
- **Blog:** https://quasarbright.github.io/blog/ — his PL/math writing, shows what he likes explaining
- **Code:** `~/GitHub/<repo>` for individual projects; `~/GitHub/learn-racket/` is a big grab-bag of his PL experiments (one `.rkt` file each)

You can fetch web contents or read source to get a closer look at any project.

## His project categories

- **Generative math/physics visuals:** fractals, cellular automata, physics sims, random walks, MST, light/wave/quantum sims, vector fields
- **Image/video effects:** upload-an-image transforms (droste, escher warp, golden spiral, seam carving, dithering), and lately **webcam effects** and video effects
- **Emergence / simulations:** Conway & many CA variants, boids, particle life, sand, evolution sims
- **Games:** often with a novel mechanic or an AI that plays/solves them
- **LLM-powered apps & games** (his "clanker" series)
- **Interactive math/education** explorables
- **AI/ML:** classic neural-net era (GANs, REINFORCE) → modern LLM apps
- **Programming languages / DSLs** (Racket/Haskell): macros, syntax-spec, continuations, algebraic effects, type systems, compilers, durable execution. **Do NOT pitch PL ideas unless he explicitly asks** — he's deep in niche PL and does his own ideation there. His PL world is advanced (he's done dependent types, CESK, scope-sets, sequent calculus, autodiff, etc.); generic PL suggestions land flat.
- **Avoid: sound projects.** He dipped into synths briefly but says sound is not a category he wants to grow. Don't suggest sound-centric ideas.

## What makes an idea land — the deep principles

These are the *why*s behind his taste. Optimize for these, not surface similarity.

1. **Emergence is the central thread.** Simple local rules → a surprising global phenomenon you watch happen. This ties his CA and evolution interests together. The phenomenon must be *genuinely emergent*, not hard-coded, contrived, or faked to "look like" the real thing.
2. **Interactivity that teaches/builds intuition AND lets you play or be creative.** The best interactivity is a knob that reveals a **critical threshold / phase transition**, or that meaningfully changes outcomes (e.g. a live flow-rate readout you try to beat). Tacked-on, contrived interactivity that doesn't change the experience is a turn-off.
3. **Demonstrates a real principle** — of nature, society, or math — not a superficial imitation.
4. **Simple to build AND simple to use.** Conceptual/mathematical depth is great; *implementation and UX complexity are bad*. He rejects heavy editors and complex sims (caustic/mirror editors, structure/bridge builders, morphology evolution = "too complicated to make or use"). Most of what he makes is quick to build and instantly usable.
5. **But not too simple.** A single-knob, one-dimensional toy is a 10-second experience. There must be enough to explore.
6. **Active agency, not spectating** (critical for games & LLM stuff). The player must DO something clever — persuade, optimize, outsmart — not watch AIs/agents do things. Every "watch the AIs go" idea he's rejected.
7. **Humor is a real plus** (note the `funny` tag, the clanker series, ginchology).
8. **Novelty / originality.** He most wants things *nobody has done*. He won't clone a done thing (e.g. plain Lenia). But an **original spin on a known thing is great** (Conway seeded by webcam edge detection). **Cross-pollination** — applying a technique from one domain to another — is a recurring win.
9. **Fusing two of his ideas/projects so they genuinely amplify each other is a big win** (he called swarmalators = firefly sync + boids "awesome"). Actively look for combinations where the two parts make each other *more* interesting — not just bolted together, but mutually enriching. This is distinct from plain cross-pollination: it's combining two things *he specifically likes/has built*.
10. **"Simplified physics sim → cool visual" is a strong standalone vein — and physics (especially fluids) producing a FRACTAL is a bullseye.** He's a self-described "sucker for fractals." Lichtenberg lightning, fluid fingering, erosion/river networks, mud-crack fracture all landed instantly. The pattern: a simple physical rule whose feedback generates branching/self-similar/emergent structure you watch form.

### For evolution ideas specifically
The meat is the **environment + the genes + the behavior**. Capability must **emerge from simple mechanics**, not be a contrived stat (he hated "good at eating seed size X" — wanted ability to emerge from physics). Best when you see **realtime visible improvement** (creatures get good at something) OR it **demonstrates a principle of nature** (e.g. evolving particle life showed the predator-prey see-saw). Interactive evolution can work if the player provides meaningful selection pressure (e.g. player-as-predator camouflage).

### For LLM / "clanker" ideas specifically
- **No realtime LLM swarms** — LLMs are too slow for realtime NPCs (e.g. a live heist with agents walking around). Works for **async/turn-based** (tycoon, factory/business) or **1v1 / low-tempo** (persuasion, customer service).
- Winners lean on **persuasion** (talk AIs into something, ideally absurd/funny) or **management depth** (build/optimize a system) or **exploiting hidden rules** (prompt injection).
- He wants real gameplay depth — not idle "watch the slop" experiences.

## How to run the brainstorm (the style that's working)

- **Don't flesh ideas out unless asked.** Give the idea + a crisp line on *why it fits him*, concisely. He does his own fleshing-out and finds over-elaboration unwanted. Exception: if he asks you to explain one, go deep and clear.
- **Always include the key MECHANISM that produces the effect** — the conceptual crux of how the simple rules generate the cool phenomenon (e.g. for excitable media: a resting cell fires only when enough neighbors are excited, and the refractory wake is what makes spirals; for a Hilbert-shading idea: *how exactly the curve encodes brightness*). This is the deciding detail for him — vague "and then magic happens" pitches get rejected as "skeptical it'd work" or "not interesting." Do NOT explain implementation/how-to-build or buildability — he doesn't want that. Just enough of the core idea to convince him the effect would actually emerge and that it's interesting.
- **Batch + recommend.** Offer several diverse ideas, then name the one or two you'd bet on and why.
- **Span his whole portfolio**, not just the last topic discussed. Pull from different categories.
- **When he reacts, extract the deeper principle and recalibrate.** The #1 failure mode is **tunnel vision**: he says he likes X, and you suggest near-duplicates of X. Instead, ask yourself *why* he likes X at a high level, then suggest across domains. He explicitly called this out.
- **Reason about why** out loud (briefly) when recalibrating — it shows you're tracking his taste, and he likes it.
- For evolution pitches, always specify the concrete **env / genes / principle** triplet.

## The idea log (separate files — keep them current)

Two companion files in this skill's folder (`./liked-ideas.md` and `./rejected-ideas.md`) hold the running idea history. Read them from this folder. When writing, edit the copies in the plugin repo (`~/GitHub/quasarbright-claude/plugins/quasarbright/skills/project-ideas/`) if it exists, since the installed plugin is a cached copy that updates overwrite; commit there, and push when Mike says to. **Read both at the start of every brainstorm** so you never re-pitch a reject or a duplicate, and so you can mine patterns:

- `liked-ideas.md` — ideas he reacted positively to
- `rejected-ideas.md` — ideas he turned down

**Update these files EVERY TURN based on his feedback** (this is automatic — don't ask permission for the log itself). When he reacts to ideas:
- Append each newly-liked idea to `liked-ideas.md` and each newly-rejected idea to `rejected-ideas.md`.
- **Always record WHY** — his stated reason if he gave one (quote or close paraphrase), plus the generalizable lesson. The *why* matters more than the idea: it's what lets you avoid the same flaw and find the next hit. Both files describe their own format at the top.
- If an idea moves (e.g. a tentative "could be cool" becomes a firm yes/no), update its entry.

## Self-improvement: conceptual learnings

Separately from the per-turn idea log, watch for deeper **preference learnings** — new principles, refined taste, new categories or trends in his recent projects.

- **Offer to update this SKILL.md whenever you learn something meaningfully new** at the conceptual level (a new principle, a refined rule, a new category/trend). Don't wait for the "end" of brainstorming — you don't know when it'll end. Ask before editing the conceptual guidance.
- Don't offer for trivial restatements or things already captured — only for real, new insight. (The idea-log files, by contrast, you just keep current every turn without asking.)

## Creating GitHub issues for ideas he wants to build

When Mike settles on an idea he likes enough to actually build, capture it as a GitHub issue so it's not lost. Most of his small web projects live in **`quasarbright/quasarbright.github.io`** — open issues there via the `gh` CLI (his GitHub username is `quasarbright`; primary branch `master`).

- **Confirm first** which ideas he wants tracked — don't spam an issue for every tentative "that's cool." Batch-create once he's committed.
- Create with:
  ```bash
  gh issue create --repo quasarbright/quasarbright.github.io \
    --title "<project name>" \
    --body "<body>"
  ```
- The body should contain enough to (a) remind him later what the project is and why it excited him, and (b) let an agent start building. Include:
  - **What it is** — 1–2 sentences.
  - **Why it's cool / why it fits** — the emergent phenomenon / principle / the "aha", and what made him like it (pull from `liked-ideas.md`).
  - **Core mechanics / how to build** — the rules or algorithm in enough detail to start (e.g. the CA states + update rule, or the greedy step). Name the known method/reference if there is one (e.g. Greenberg–Hastings, Nagel–Schreckenberg, Vrellis thread art).
  - **Interactivity** — the meaningful knobs/controls (a slider that reveals a threshold, a live readout, draw/seed tools).
- **Do NOT specify a tech stack / framework in issues.** He decides the stack per project; leave it out entirely.
