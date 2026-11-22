# WRITING.md: lessons for in-product copy and humor

General lessons from Mike's verdicts on words that ship in a project: labels, popups, character
lines, jokes, headlines. Loaded on demand: read it before writing copy or jokes. The register for
chat, commits and docs is in `CLAUDE.md` ("Writing"); low-level copy rules are in
`UX-CHECKLIST.md` ("Copy and explanations"). How lessons get here is in `WORKING.md`, "Lessons from
his verdicts". A project's own terms and gold-standard jokes stay in that project.

## Humor

- **The punchline is the project's own mechanic,** said in a dry, official voice. Never a generic
  business or office joke that could be in any game. (Clanker Tycoon's gold standard: "Ships Its
  Last Box (It Was Empty)", "Robots Finally Given Clear Instructions: 'Leave'". Rejected: an angry
  quoted client, the lender's snacks, a forklift.)
- **Naming a mechanic isn't a joke.** The mechanic is the setup; the punchline is a turn on it
  (the box was empty, the machine outlives the company). Lines that only describe something that
  happened read as a game log ("most of those aren't even headlines").
- **A parody form has to be the real form.** A headline reads like a real newspaper headline
  (subject, active verb, newspaper phrasing); a certificate reads like a real certificate.
  "Official-sounding but ridiculous" is the tone.
- **Fewer jokes, better ones.** One clever line beats a batch of near misses, and flavor lines
  that only add theme ("Numbers must go up") turn cheesy. When unsure, leave it out.

## Copy

- **UI text uses the standard terms games and apps use: short, neutral, direct.** This is the
  default for every label, button, placeholder, prompt, heading, status line and error. Before
  writing one, ask what a typical shipped app or game says there, and say that. No chatty or
  conversational phrasing, no second-person musing, no cute rewording of a stock term. Prose
  is for explanations (about modals, rules text), not controls. Recurring complaint, 2026-11-22:
  - "What should people call you?" → "Enter your name"
  - "Back to the start" → "Main Menu"
  Buttons are a verb or the standard noun in Title Case, as in games ("Join", "Create Room",
  "Play Again", "Settings"); toggles use the stock pair ("Ready" / "Not Ready").
  Status lines state the fact ("Waiting for Ana"), never narrate ("Hang tight while...").
- **His wording wins.** When Mike rewrites a line, use his words verbatim, and keep them through
  later edits.
- **Say it once.** A popup has no subtitle restating its title, and no sentence that repeats what
  its buttons already say ("Borrow $100 · pay back $110" makes a fee sentence redundant).
- **Remove only what he named.** Cleaning up copy around a requested change doesn't delete other
  sentences ("I didn't say get rid of the 10% per contract sentence"). If another line looks
  redundant too, list it up front as a proposal and keep it until he agrees. Before sending,
  diff the copy against the last version he saw and account for every line that's gone.
- **Pick the plain word for the state** ("In storage", not "To place"), and once a term is chosen,
  use it everywhere and ban the old one with a test (`WORKING.md`, "One place, every place, a test").
- **Descriptions only use words the screen shows or a newcomer already knows.** A control's
  tooltip or readout never leans on terms from the code or an explanation elsewhere ("reach 2",
  "threshold", "beating neighbor") or on history the user never saw ("the first version"). Say
  what it looks like and what happens in everyday words: rock paper scissors' rule buttons went
  from "A circle of reach 5" to "A few big, smooth spirals", and the readout to "A cell turns into
  the color that beats it when at least 3 of the 8 cells touching it have that color." Mike:
  "Use plain clear terminology that doesn't require context. Be considerate of the user."
