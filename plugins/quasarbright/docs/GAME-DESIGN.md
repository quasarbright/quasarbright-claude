# GAME-DESIGN.md: lessons for game mechanics and balance

General lessons from Mike's verdicts on game design (rules, progression, economy, balance).
Loaded on demand: read it before proposing mechanics or tuning numbers. Game UI is in `TASTE.md`
and `UX-CHECKLIST.md` ("Games"); how lessons get here is in `WORKING.md`, "Lessons from his
verdicts". Each line is a default. A choice made for one game stays in that game's docs.

## Fairness and control

- **Agents the player directs do exactly what they're told, reliably.** Comedy comes from their
  voices and from orders that really are vague, never from them failing at basic things. Stacked
  handicaps (mishearing, dropping things) made a robot "completely useless": frustrating, not funny.
- **Success and failure trace back to the player's decisions.** No randomness that lands after
  you've decided. Things wear out predictably and visibly, so upkeep is planning, not bad luck.
  Disruptions, if any, come where you can plan around them.
- **Money is a planning problem, never a surprise.** The player can see what a period will cost
  before committing, and can't go broke halfway through something they already started.

## Choices and economy

- **Every option costs something.** If an option has no downside, it's always taken and stops
  being a choice. Check each new option for a dominant strategy before showing it. (Clanker
  Tycoon: missing an extra contract cost nothing, so extra contracts were free bets; interest-free
  loans made borrowing the maximum always right. Both got a cost: reputation, a flat fee.)
- **Prefer costs that fit on the button** ("Borrow $100 · pay back $110") over rates that grow
  over time.
- **Steps, not creep.** A cost that should feel significant jumps at a threshold rather than
  rising a little each time ("just after some threshold, not like a continuous thing").
- **No cheap downside traits** (annoying, not fun), and no traits the game can't really control or
  define cleanly ("notices problems").
- **Roguelike shops offer three of each,** not everything.
- **Escalate by combining what exists,** not by adding a new first-class concept per tier. There's
  room for only a few concepts; let one nest (a manager who manages managers) rather than adding
  ranks.

## Keeping it a game

- **Stay at the core verb as the game grows.** Growth makes the player's main activity bigger, it
  doesn't replace it with menus: "When it gets too managerial, it becomes a spreadsheet simulator."
- **Early on, no single unit can do everything** when the point is coordinating several.
- **Keep it simple:** fewer decisions, fewer options on screen. When unsure, do less.
- **Mechanics first;** story, personality and flavor wait for polish (`WORKING.md`).
- **Explain a new thing in plain words before asking about it.** A question that names a concept
  he hasn't seen yet ("what goes into a crate?") gets "I don't know what crates are".
