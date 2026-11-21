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
brief and this task, with `<plugin docs>` and `<plugin skills>` replaced by the absolute paths of
this plugin's `docs/` and `skills/` folders (`../../docs` and `..` from this skill's folder):

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
> **Explore first, like a curious new user, before any checklist.** Spend real time on it: at
> least a few minutes of actual use and dozens of interactions, not one screenshot per state. Go
> everywhere the page lets you: every screen, menu, mode, preset, panel and link. In anything
> spatial, walk, fly, look around and look down, and go to the edges of the world. Try each flow
> start to finish, then try it in an odd order. Poke at things beyond what changed, push every
> control to its extremes, combine settings, refresh mid-flow, and try to break it. Write down
> each moment you were confused, surprised or unsure what to do next. Those notes are findings.
> The brief's list of states is a minimum, not the scope.
>
> **Taste pass.** Go through each TASTE.md principle and ask whether this meets it. Does the subject
> get the screen? Is it good the moment it loads? Does it explain itself? Is anything distracting,
> cheesy, dev-tool-like, unfinished on some screen size, or janky in motion? Check the
> UX-CHECKLIST.md rules that apply.
>
> **Read pass.** Open every screenshot at full size and read every word on it: labels, counts,
> dates, captions, descriptions, links. Small muted text over a busy or changing background is the
> usual miss. If you have to squint, it fails. Then measure: run
> `node <plugin skills>/ux-review/contrast-check.mjs <url> --scroll` at 1440×900 and again with
> `--width 375 --height 812 --mobile`, from a folder where `playwright` resolves. It compares each
> text's color with the pixels really drawn behind it (images, iframes, animated backgrounds) and
> lists everything under 4.5:1 (3:1 for large text). When the background varies (a random or live
> background, user images), force the brightest and busiest one with `--setup "<js>"` and use
> `--show "<text>"` to see one label's number. Every failure is a finding.
>
> **Alignment pass.** Mike's most repeated complaint is ugly vertical alignment. For every row or
> grid of sibling items (cards, buttons, icons, slots in a tray), measure with
> `getBoundingClientRect()`: same-kind items should share height and/or width, and a row should share
> top and bottom edges. Any difference over 1px is a finding. Then add items until the row is at its
> largest realistic count and screenshot what happens when it runs out of room.
>
> **Controls pass.** For every slider, toggle, field and button: before touching it, write down
> what you think it does from its label alone, including the unit and whether the number is
> absolute or relative to something ("1 (screen size)" leaves open whether that's a ratio or a
> size). Then use it. If your guess was wrong or you couldn't make one, the label is a finding.
> Drag every slider from end to end and list the values where the result's structure changes: a
> 1:1 ratio, two things the same size, 0, a named shape or lens. Each one should snap, and its
> readout should name it. A missing snap is a finding. A control that does nothing in the current
> mode should say so.
>
> **Default-view pass.** On a fresh load, and after each mode or preset switch, ask whether the
> camera, eye, sensor or viewport is somewhere a person could stand: not inside the ground, a
> wall or an object, not looking at the inside of a surface. If it isn't, the finding is the
> setup, not how that view looks.
>
> **Use pass.** Looks are only part of it. In every state: can the user see what they need to
> decide (money, what's due, who's ready)? Is the next action obvious? Does each disabled control
> say why? Is anything said twice, or not at all? Does a flow take more clicks than it should, or
> make you scroll?
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
  lesson there (see "Lessons from his verdicts" in `WORKING.md`). Edit the copies in the plugin
  repo, `~/GitHub/quasarbright-claude/plugins/quasarbright/docs/`, not the installed cache, since he would have had to
  correct it.

Then demo as usual: screenshots in the states that show the change, sent with `SendUserFile`.

## iPhone apps

The steps above assume a web page. For an iOS app, swap the browser parts for the iOS Simulator
and keep the rest (taste, use and parity passes, the report, sorting the findings):

- **How to open it** is a booted simulator (device name and UDID), the bundle id, and
  `xcrun simctl launch`. The reviewer drives it with the simulator control tool (screenshot, tap,
  swipe, text) instead of Playwright, and checks light and dark mode
  (`xcrun simctl ui <udid> appearance dark`) and a large Dynamic Type size
  (`xcrun simctl ui <udid> content_size accessibility-large`), resetting both at the end.
- **Notification banners can't be tapped with that tool:** its touches pass through the banner to
  whatever is underneath. Give the reviewer an XCUITest that taps or presses and holds the banner
  through `XCUIApplication(bundleIdentifier: "com.apple.springboard")`, and a quick way to seed
  data that's due soon (write the app's data file, relaunch). Without that, the reviewer reports
  working notifications as broken.
- **Siblings** are usually the iPhone's own apps doing the same job (Messages, Reminders, Clock).
- Leave out simulator-only limits (no Messages, slow contact picker) when sorting findings.

## Periodic review

Every so often (after a run of changes, or when Mike asks), review the whole app instead of one
change. The brief's "what changed" becomes "everything": list every screen and the states worth
reaching, and ask for a real start-to-finish session. The reviewer stays blind, the same as above.
In a Claude project with a UI/UX persona (see "Design personas" in `PROJECTS.md`), the persona owns
this: it runs the review, sorts the findings with what it knows about the project, and folds the
real ones into its brief's current take, ordered by how much they get in the way. A finding that
is a general rule rather than a one-off goes into `UX-CHECKLIST.md`, which the persona keeps tidy.

## With a UI/UX persona

In a Claude project that keeps a UI/UX persona (see "Design personas" in `PROJECTS.md`), send it the
change, the live URL and the screenshots after this review, before Mike sees them. The persona
opens the live page and does the read, contrast, controls and default-view passes itself, so a miss here gets a second chance with someone who remembers
the project's rules. It sends back what to fix; you fix it, then demo.
