---
name: voiceover-cleanup
description: Clean Mike's (quasarbright) raw voiceover take automatically, the way he does it by hand in Audacity - keep the last good read of each line, obey spoken notes in the take ("use the first take"), noise-gate, spectrally delete leftover breaths and mouth clicks, fix plosives - and hand back a cleaned file, Audacity label tracks and a report. Use whenever Mike has recorded a voiceover and wants it edited or cleaned up.
---

# Cleaning a raw voiceover take

Mike records a whole script in one take. He re-reads any line he fumbles, and sometimes talks to
the editor in between ("let me redo that", "actually use the first take, that one was better").
By hand he then cut the retakes, ran Audacity's Noise Gate, spectrally deleted the breaths and
mouth clicks the gate let through, and pulled the lows off plosives. This skill does all of it and
leaves him a report to skim instead of an hour in a spectrogram.

The tool is `narration/cleanup.py` in the manim-videos repo. Its module docstring has the
measurements behind every default; read it before changing a number.

## Where it runs

On Mike's Mac. Whisper weights and the raw takes live there, and the repo's venv has
`mlx_whisper`. From a cloud thread use Remote Control in `~/GitHub/manim-videos`. Raw takes from
past videos are Audacity projects in OneDrive/Videos/<video>/<name>.aup3; the tracks are named
raw, cut, dry, wet, and wet (or the last row) is the final. A cloud session can read the audio
out of an .aup3 without Audacity: it is SQLite, see `sampleblocks` and the binary XML in
`project.doc`.

## Steps

1. **Run it.** `.venv/bin/python -m narration.cleanup <take> --script <video>/script.py`. The
   script can also be his Obsidian note (`.md`: code blocks, `>` notes and headings are skipped)
   or plain text. The first run transcribes the take verbatim, with false starts kept, into
   `<take>.whisper-small-verbatim.json` next to it, and reuses that file after.
2. **Read `<take>.cleanup/report.md`, all of it.** That is where your judgment goes:
   - **Everything cut** lists the earlier takes, false starts and anything said off script. Look
     for directions to the editor. "Use the first take", "that one was better" and "keep that" all
     name a take; "cut that" or "redo that" confirm the default. Also look for ad-libs worth
     keeping, and say so in your summary rather than deciding for him.
   - **Retakes** lists each block read more than once, numbered in recording order, with the kept
     take marked. By default the last read is kept; every cut Mike has made follows that rule.
   - **Off script but kept** are words glued to a kept line because they were said in the same
     breath. Check that none of them is a note to the editor.
   - **Script words never heard** are usually Whisper's misses, and their audio stays. A whole
     line missing means he didn't record it. Tell him which line.
3. **Obey the directions.** Put the take number for each block he asked about in
   `<take>.cleanup/choices.json`, then run again with `--choose <take>.cleanup/choices.json`. If a
   direction can't be expressed as a take choice, do the edit in code or tell him.
4. **Spot-check the fixes.** `labels-clean.txt` marks every deleted click or breath and every thump
   fix on the cleaned file, and `labels-raw.txt` marks every keep and cut on the raw take.
   He imports them in Audacity (File > Import > Labels). Before calling the clean finished, listen
   to a few plosive fixes on the real recording: plosives only show up on a real voice, never in
   the draft.
5. **Report to him.** Every listening test sends three clips of the same spot: his raw, his own edit
   when there is one, and yours (Mike, 2026-11-26: "you should include the raw for comparison").
   Then say in a few lines what you obeyed, any ad-lib you cut that he might want
   back, any line that was never recorded, and the counts of fixes. Attach `clean.wav` or a short
   excerpt, not the whole report.
6. **Hand it on.** `clean.wav` is the master recording that `narrated-video`'s
   `MasterRecordingService` aligns to. Mastering (loudness) happens later, on the finished render.

## What it does, and the defaults

| Step | Default | Why |
|---|---|---|
| Takes | last full read of each line; jumps of more than about 300 script words cost much more | every retake cut he made kept the last read; a common phrase repeated in a recap shouldn't look like a retake |
| Splices | butt splice at the quietest point of the pause, keeping up to 0.25 s lead-in and 0.3 s tail, 3 ms fades | his splices are butt splices; the fades stop a join from clicking |
| Noise Gate | threshold −40 dBFS (peak), reduction −35 dB, attack 10 ms, hold 50 ms, decay 100 ms | fitted to his polynomials wet track: 0.2 dB mean error per 10 ms frame, 0.5 dB on frames it turns down. This is his expander step and takes out the faint breaths between phrases |
| Clicks and breaths before a word | deleted (60 dB down, whole spectrum) when a burst of 30 ms or less over −65 dBFS sits alone in a pause, within 0.35 s before the word | the thin vertical strips left of a word; he deleted 11 in polynomials after the gate, this finds 7 plus 1 he left in. He never managed to fix clicks inside words by hand; the next two rows do |
| Clicks inside speech | over 2 kHz capped at the voice's own level around the strip, where 10 to 18 kHz jumps 15 dB over its 60 ms median for 40 ms or less while the voice carries on around it | the tall thin strips over a vowel; about 19 a minute on the macros raw, 2 on clean polynomials. A "t" or "k" has silence before it and is left alone |
| Faint clicks inside speech | the same cap, where 8 to 14 kHz on a 1 ms envelope (read every 0.25 ms) jumps 18 dB, lasts 4 ms or less, beats every other spike within 13 ms by 6 dB, and voice carries on around it | ticks too quiet for 5 ms blocks, hidden between the glottal pulses. The "the bits" click at 105.93 s on the macros raw; about 12 a minute there, 1 on polynomials |
| Plosives | lows under 150 Hz cut by their excess (up to 30 dB) where they jump 15 dB over the 200 Hz to 1 kHz band at −45 dBFS or louder, for the pop only | never a high-pass on the whole take: Mike found his own macros low cut took too much. Fires 0 times on the MV7+ polynomials take, about 14 a minute on macros |
| Thumps | under 60 Hz down 25 dB where the sub-40 Hz band jumps 15 dB over its 200 ms median, above −60 dBFS | all of his "plosive" fixes in polynomials were this; finds 7 of 8, and a false hit can't touch the voice |
| High-pass | off (`--highpass 80` to turn on) | the plosive fix is targeted instead. Mike thinks the MV7+ 75 Hz filter is on but isn't sure: ask him the next time a vocal take comes in |

`--no-cut` skips take picking and only gates and repairs, for a file that is already edited.

## Known gaps

Mike approved the results on 2026-11-26 ("you did better than me on some"), with these open:

- **Faint clicks right at a word onset.** He still hears one on "the bits" (macros raw, about
  105.9 s) after the faint-click pass. A click that lands on the first glottal pulse of a word is
  not separated from the voice by either click detector.
- **Loud breaths open the gate.** A breath that peaks over −40 dBFS (macros raw 8.6 to 9.5 s)
  crosses the threshold, so the gate opens partway through it with an abrupt start. It needs its
  own breath detector (broadband hiss, no harmonics, before a word), not a lower threshold, which
  would also eat quiet word endings.
- Some clicks before a word leave a small remnant right at the onset (polynomials 181 s in the
  clean), because the repair stops where the word begins.

Tell him about these when you hand over a clean, and fix them the way "Changing it" says.

## Changing it

Measure against his hand edit before showing him anything: run it on a project with raw and wet
tracks and compare the clean with wet in aligned 10 ms frames. Anything done in blocks must use the
real block length (220 samples at 44.1 kHz, not 220.5): the first version drifted 0.34 s by minute
2.5, gated out words, and the samples he heard were "terrible".

When Mike corrects the result ("you cut a good take", "that breath is still there"), find the
case in the report and labels, fix the rule in `cleanup.py`, add a test to
`narration/test_cleanup.py`, and say in the docstring which recording taught it. To re-calibrate
against a new hand-edited project, compare its tracks sample by sample: the cut track is exact
copies of raw spans, so matching 32-sample hashes recovers every splice, and the wet track lines
up with the cut track by cross-correlation of 0.5 s chunks.
