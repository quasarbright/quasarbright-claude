---
name: ux-review
description: Fresh-eyes UX review of something you built for Mike (quasarbright) before he sees it. Spins up a subagent that has none of your reasoning, plays with the page in a real browser, and judges it against his product taste, the low-level UX checklist and sibling variants or projects. Use before every demo of new or changed UI (a new project, a feature, a new variant, a redesign), and whenever WORKING.md's "Before you show it" says to. Skip it for changes nobody can see.
---

# UX review

Mike brings ideas and decides what things are. Making them polished, convenient and not awkward is
your job, without being told. You can't judge your own work well: you know what you meant, you
remember which states you tested, and you rebuild the list of siblings from memory. A reviewer
without that context finds what he would.

Run this after your own "Before you show it" checks in the plugin's `docs/WORKING.md` (`../../docs/WORKING.md` relative to this skill's folder) and before you send
him screenshots. You stay in charge: the subagent reports, and you decide what to fix.

## 1. Gather the brief

The subagent only knows what you give it. Collect:

- **How to open it:** a local URL from a running dev server (start one detached if needed, see
  [[feedback-no-background-services]]), plus any URL params or test hooks (`window.<app>`) that
  reach particular states.
- **What it is:** one or two sentences in Mike's terms, and who it's for.
- **What changed:** the feature or variant, and the files touched (`git diff --stat`). Leave out
  why you built it that way.
- **Siblings:** the nearest existing variants in the same project (other puzzle kinds, other object
  types, other modes), with the file that implements the oldest or most complete one, and any
  sibling projects with the same kind of UI (chips → card-table, 2048 → tetris). Name them from the
  code (a registry, a gallery list, a switch over kinds), not from memory.
- **States worth reaching:** for example mid-drag, mid-animation, zoomed far in and out, at the
  biggest size a stepper allows, loaded from a share link, scrambled, game over, empty.

## 2. Spawn the reviewer

Use the Agent tool (general-purpose). Don't tell it what you think is wrong or right. In a cloud session, add the headless-browser
notes from the plugin's `steering/rules/cloud.md` (WebGL flags, one browser at a time, no pointer
lock) to the brief, or it will stall on a blank canvas. Give it the
brief and this task, with `<plugin docs>` replaced by the absolute path of this plugin's `docs/`
folder (`../../docs` from this skill's folder):

> You are reviewing a web page for Mike before he sees it. He should never have to point out
> anything awkward, unpolished, inconvenient, distracting, cheesy, inconsistent or broken. Your job
> is to find those things first.
>
> Read `<plugin docs>/TASTE.md` (his product taste) and `<plugin docs>/UX-CHECKLIST.md` (concrete rules from
> his past corrections). Then use the page like a real user, with headless Playwright (from any
> project's node_modules, e.g. `~/GitHub/cutwist`; launch with `--mute-audio`, see the memories on
> headless Chromium flags). Use real clicks, drags and keys through the visible controls. Do this at
> 1440×900, at 375×812 (isMobile, hasTouch) and, if layout matters, at 2560×1440. Screenshot every
> state you reach, and capture frames over time for anything that moves (mid-drag, mid-animation,
> zoom). Look at every screenshot.
>
> **Taste pass.** Go through each TASTE.md principle and ask whether this meets it. Does the subject
> get the screen? Is it good the moment it loads? Does it explain itself? Is anything distracting,
> cheesy, dev-tool-like, unfinished on some screen size, or janky in motion? Check the
> UX-CHECKLIST.md rules that apply.
>
> **Parity pass.** Open the siblings named in the brief, read their code, and put each one in the
> same states as the new thing, comparing behavior over time as well as stills. List what the
> siblings do here that this doesn't, and where styling or behavior drifted: palettes, snaps,
> labels scaling with pieces, hover outlines, actions that exist in one place but not the other.
> For a new feature, list which existing variants lack it.
>
> **Report** a list of findings, most important first. Each finding gives: what's wrong, where (a
> screenshot path and the state that shows it), which principle, rule or sibling it violates, and a
> suggested fix. Mark each one **must-fix** (Mike would notice and correct it) or **consider**.
> Don't pad the list: if something is fine, say nothing about it. Don't edit any files.

## 3. Act on it

The reviewer's labels are suggestions. You decide what gets fixed. It saw the page without context,
so some findings will be misunderstandings: it took a deliberate choice of Mike's for a mistake, it
missed a control that was there, it applied a rule outside the situation the rule is for, or a
parity gap doesn't fit this variant. Sort every finding, must-fix or consider, into one of three
groups:

- **Fix it** when it's clearly a real problem by `TASTE.md` and `UX-CHECKLIST.md`.
- **Drop it** when it's clearly a misunderstanding. Check before dropping: reproduce what it saw,
  or find where Mike asked for it. If you can't confirm it's a misunderstanding, it isn't clearly
  one.
- **Ask Mike** when you're unsure: it might be a real problem, the fix would change what the thing
  is (creative direction is his), or the taste files don't settle it. Don't guess. Raise it as a
  question with the screenshot when you demo, and batch these into one list.

When you demo, mention what you dropped in one line each with the reason, so he can overrule you.
If the fixes were substantial (layout, interaction model), run the review once more on the result.
Don't loop more than twice.
- If the review found a kind of problem that `TASTE.md` or `UX-CHECKLIST.md` doesn't cover, add the
  lesson there (see "Recording what he corrects" in `WORKING.md`). Edit the copies in the plugin
  repo, `~/GitHub/quasarbright-claude/plugins/quasarbright/docs/`, not the installed cache, since he would have had to
  correct it.

Then demo as usual: screenshots in the states that show the change, sent with `SendUserFile`.
