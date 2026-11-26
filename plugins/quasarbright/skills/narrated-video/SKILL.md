---
name: narrated-video
description: Build a narrated manim video in Mike's manim-videos repo, where animation timing is derived from the voiceover rather than hand-synced. Use when starting or continuing any video that has a spoken script — drafting with a synthetic voice and placeholder art, then swapping in a real recording and real images without touching scene code. Covers the three-file layout (script.md / script.py / main.py), the `narration` services, and the manim behaviors that silently break this setup.
---

# Building a narrated video

The point of this setup is that **nothing is timed by hand**. Animation cues
come from the narration, so the draft voice can be replaced by Mike's real
recording and the placeholder art by real images, and no scene code changes.

Reference implementation: `2026/hector-salamanca/`. Shared machinery:
`narration/`. Read both before starting a new one.

Review the script with the `video-review` skill before building, and each draft
render after, running only the reviewers that apply at that stage.

## The three files

| file | |
|---|---|
| `script.md` | Mike writes it. Prose, plus `> manim:` / `> visual:` / `> meme:` notes and `when I say "..."` timing notes. **Nothing parses it.** |
| `script.py` | The narration transcribed as a dict of blocks with `<bookmark mark='...'/>` cues, plus `ORDER` |
| `main.py` | One `VoiceoverScene` per block, plus an `Everything` scene calling each `construct(self)` in order |

A parsed markdown format was built once and rejected — see
[[feedback-scripts-stay-free-form]]. The `.md` is read, not executed. Keeping
every line of narration in one dict, in script order, is what makes the manual
sync cheap: diffing `script.py` against `script.md` should be a glance.

Transcribe as *spoken*, not as typed — if the script says "wouldn't no", write
"know", because the alignment matches against words Mike will actually say.

## Starting one

1. `2026/<topic>/` with `script.md` (Mike's text verbatim), `script.py`,
   `main.py`, and an empty `content/`.
2. Copy the scene helpers from `2026/hector-salamanca/main.py` — `ui`,
   `content`, `full_frame`, `placeholder`, `ding`, `method_title`,
   `spelled_word`. These are **per-video**, not shared; only `narration/` is
   a package.
3. `voice()` returns `MasterRecordingService(MASTER, script.ordered_texts())`
   if `master.mp3` exists, else `draft_voice()` (Qwen3-TTS cloning Mike's
   voice on Apple Silicon, Piper elsewhere). That is the entire draft/real
   switch.
4. Add blocks to `script.py` as scenes get built. `ORDER` must match what Mike
   will read aloud, in order — the master recording is aligned against it.

## Timing rules

**Never write an absolute wait.** Every one encodes the draft voice's speed and
breaks when a slower real recording arrives.

```python
with self.voiceover(text=script.BLOCKS["name"]) as tracker:
    self.wait_until_bookmark("cue")      # fire on a word
    self.play(Something(), run_time=0.5)
    self.safe_wait(tracker.get_remaining_duration(buff=-0.6))   # hold to the end
    self.play(FadeOut(thing), run_time=0.6)
```

- `safe_wait`, never `wait`, for tracker-derived holds — the value is
  legitimately zero when an animation outran the narration, and manim raises on
  `wait(0)`.
- To arrive *on* a word, use the distance to it as the `run_time`. Don't
  shave frames off to land "just early": Mike has called cues early in two
  videos running, and every source of error already leans early (see
  **Cues fire early** below).
- Put the cue on the word the picture is about. An emphasis on the 8 in
  "degree eight" goes before "eight", not "degree". A *phrase* Mike names
  still fires on its first word.
- A block that cuts to a new picture cuts on its **first word**, not when its
  audio begins: put `<bookmark mark='start'/>` before that word and
  `wait_until_bookmark("start")` before the cut. With a real recording the
  slice opens with the pause before the word, so a cut at block start lands a
  few hundred ms early. The previous picture holds until then, so there's no
  blank. Mike asked for this everywhere.
- To run past the end of a line, `get_remaining_duration() + N`.
- For a long chain of short steps, aim each pause at an **absolute** clock
  position (`start + elapsed - self.renderer.time`), not at the previous one.
  manim rounds every wait up to a whole frame and the drift accumulates.

## Placeholders and content

Art arrives late. `content(filename, label, kind, width, height)` returns the
real file from `content/` if it exists and a labeled dashed box at the same
footprint if it doesn't, so the pacing rehearsed against the placeholder is the
pacing the finished shot inherits. Dropping a file in is the only step.

Ask Mike for the filenames, or tell him what names you're looking for.

**Sounds get a placeholder too.** A missing sound effect is invisible in a
render, so Mike forgets to supply it. The `sound(scene, path)` helper plays a
generated `placeholder-beep.wav` (two short 1.2 kHz blips, kept next to
`main.py`) whenever `path` isn't in `content/`, and prints the missing name.
Make it with pydub once per video:

```python
from pydub import AudioSegment
from pydub.generators import Sine
beep = Sine(1200).to_audio_segment(duration=120).apply_gain(-6).fade_in(5).fade_out(20)
(beep + AudioSegment.silent(duration=80) + beep).export("placeholder-beep.wav", format="wav")
```

Dropping the real file into `content/` replaces it, same as pictures.

**A real asset is an `ImageMobject`, which `VGroup` refuses to hold.** Use
`Group` anywhere a picture might end up in a group. This is the one way the
swap is not purely a data change, and it has bitten twice.

## Visual language

Color should carry meaning, one job each, named as constants at the top. In
the Hector video: yellow is the question and where we're pointing, green and
coral are the answer, orange is what the subject communicated plus titles. Set
this up early and stay in it — it lets a later scene cash in a convention the
viewer already has, rather than re-teaching it.

Pictures are **fullscreen and hard-cut** when they're the whole shot, including
picture-to-picture transitions. Fades are for drawn material — text, tables,
diagrams. A fade between two photographs reads as a dissolve, which is a
different edit than the one intended.

Title case titles, headers and labels. Leave data lowercase: alphabet strips,
code tables, the word being spelled.

## Storyboard before animating

A trial (Mike, 2026-11-26: "sure let's try it. might want to go back to scene
direct but we'll try storyboards for initial iteration speed"). If storyboards
stop paying for themselves, he may go back to building scenes directly, so
ask him after the first few scenes whether to keep them.

Before building a scene whose look isn't settled yet, make **2 or 3 still
frames** of its key moment, each a different approach: a different layout, a
different way of drawing the idea, or a different thing made big. A first
diagram of a new kind, a title card or a new representation needs this. A
scene that reuses a look Mike already approved skips it, and so does an exact
small ask.

- Make them as manim stills in the video's own theme and fonts
  (`manim main.py -s -ql Storyboard<Scene><A|B|C>`), not HTML mocks, so they
  look like the real render and the winner becomes the start of the scene.
  Keep the storyboard scenes in a `storyboard.py` next to `main.py`.
- A video's **first storyboard is its look**: palette, type and the visual
  language below, before any scene builds on it.
- Hand the frames to the `video-review` skill's storyboard stage (Grant and
  Annie pick one). Build on the pick and show Mike the picked frame with the
  one-line reason in the next update. Don't wait for his answer unless he asks.
- When Mike comments on a storyboard or a render, save it as a taste example
  (`video-review`, "Learning"), with the frame he saw.

## manim behaviors that will waste your day

**`add_sound` was silently dropped when manim reused a cached partial movie**
(it returns early if `skip_animations` is set). `narration`'s cache patch now
restores the flag after every hit; without it, restore the flag first:

```python
scene.renderer.skip_animations = scene.renderer._original_skipping_status
scene.add_sound(str(path), gain=...)
```

**A plain `wait` renders one frozen frame** unless something in the scene has a
*time-based* updater. `always_redraw` registers one that is not time-based, so
a counter driven that way never updates across waits. Either mutate the mobject
*before* the wait (the frozen frame picks it up) or rebuild it explicitly.
`always_redraw` also fights `FadeIn` by resetting opacity every frame — fade in
a static version, then attach the updater.

**Class attributes break in `Everything`**, which calls `Lalo.construct(self)`
with an `Everything` instance. Module-level constants only.

**manim's animation cache used to desynchronize a voiceover video; `narration`
now patches it, so leave caching on** (don't set `config.disable_caching`).
What the patch fixes, in case it ever regresses:

- A rendered `wait` writes `int(duration * fps)` frames and advances
  `renderer.time` by that many; a cache hit advanced it by the exact float
  `scene.duration`. Voiceover audio is placed at `renderer.time`, so every hit
  slid the voice up to a frame later: 1.5s over the uncomputable video. The
  patched `CairoRenderer.play` advances a hit by the frames in its cached file.
- A hit left `skip_animations` on until the next `play()`, so a sound added in
  between was silently dropped. The patch puts the flag back.
- The clock's float error differed between the rendered and cached paths in
  the last digit, and waits are timed off it and hashed (0.8900000000000001
  against 0.8899999999999999), so one hit made every later hash miss. The
  clock is snapped to a whole frame after every play.
- `max_files_cached` defaults to 100 against ~700 animations; raised.
- manim hashed an array over 1000 elements by its first 10000 values, which
  for an image is its top few rows: swapping a picture that differed only
  lower down kept the hash, and the cache served the old frames. Arrays now
  hash by their full bytes (also faster than the `repr` they replace). If a
  render shows content you already changed, suspect a stale hash first.

Check after any change near this: a fully cached render must match an uncached
one, line positions to the millisecond (cross-correlate the audio) and frames
pixel for pixel. Audio running long against video is the old drift:

```sh
ffprobe -v error -select_streams v:0 -show_entries stream=duration -of default=nw=1 out.mp4
ffprobe -v error -select_streams a:0 -show_entries stream=duration -of default=nw=1 out.mp4
```

The cache saves less than it looks like it should, about 10% of a render:
drawing frames is the minority of the cost. Manim JSON-encodes every mobject
on screen to hash each play (10.8s of 20s in one section), and every transform
and fade deep-copies its mobjects at `begin()`, cached or not.

### Render the sections in parallel

A full render runs on one core. `2026/polynomial-zeros/render_parallel.py`
renders each batch as its own `Part_<name>` scene in its own process, joins
them, and masters: 3m10s against 10m15s for a 12-minute video, with the same
output (every line within 1ms of a serial render, frames identical at the
joins). Copy it, and `part_scene()` from that video's main.py, into a new
video. What makes it correct:

- **Each part fast-forwards through the sections before it** with
  `renderer._original_skipping_status` and `skip_animations` set (`play()`
  resets the latter from the former every call), then resets
  `renderer.time = 0`, because voiceover audio is placed at the renderer's
  time and the part's file starts at zero. Sections carry state, and open by
  fading out what the last left, so a cold start would change them.
- **Each part's audio is padded or cut to its video's length before joining.**
  Manim's audio track ends at the last sound, not the last frame; joined end to
  end, later parts' audio started up to 1.3s early.
- **Each process gets its own TeX and text cache** (copied from the shared
  ones, merged back after): manim writes and deletes intermediate files there,
  and processes sharing them crash on each other's deletes.
- **`cache.json` appends are locked and deduplicated** in `narration`.
  manim-voiceover appends on every block, hit or miss, with a read-modify-write
  of the whole file.
- **Any scratch file a render writes needs a per-process name** (`os.getpid()`
  in it). The block-leveling scratch was one shared path and six of eight
  processes crashed deleting each other's the first time a block missed the
  cache. Grep for fixed scratch paths before trusting a parallel run.

**A `None` in a service's `input_data` disables the voiceover cache.** Entries
are written with `exclude_none=True` and compared against the unstripped dict,
so every render re-synthesizes while appearing to work. `cacheable()` strips
them.

**Scenes must clean up after themselves.** A scene that leaves mobjects on
screen is fine while it's last and wrong the moment another follows. The
exception is deliberate carry-over, where one block's visual holds through the
next block's opening — do that explicitly, with an `if not self.mobjects`
fallback so the scene still renders standalone.

## Footage cut to the narration

Any video footage longer than its stretch of narration (a screen recording, a
clip, a demo) is edited in the scene, not beforehand, so it stays fitted when
the take changes. The TI-84 demo in polynomial-zeros fit 8 minutes of footage
into 40 seconds of narration; see `Footage` and `footage_to` in its main.py.

- **Map it first.** Tile the footage at 1 fps, cropped to the part that
  matters, and write down what happens when: false starts, fiddling, each
  step. Keep the spans as named constants with comments.
- **Crop to the subject**, with nothing around it that isn't part of the shot
  (browser chrome, desktop, letterboxing). Measure the bounds from pixels, and
  check they hold across every span used: the framing can move mid-recording.
- **One cue per step, on the first word of its phrase**, and each span is
  fitted to the time until the next cue: sped up to fit, **never slowed
  down**; a span shorter than its line plays at normal speed and holds its
  last frame.
- **When a step needs to be seen, let the footage set the time.** Split the
  narration block there, play the span at a watchable speed (3x for placing
  calculator bounds), and start the next block when it's done. Mike asked for
  this: "allow pause in the voiceover while that plays a little slower."
- Frames are decoded per (span, length, resolution) and read from disk one at
  a time by the updater; holding them all in memory runs to gigabytes at 1080p.

## Big-word overlays

To land a word or term ("octic", the leading term 11x^8): a backdrop in the
background color at 0.85 opacity fades up while the word (or a copy lifted out
of the formula) grows to center, about 0.6s. If the line ends there, don't
fade it out on its own; leave it up and let the next scene's opening take the
screen, with the backdrop held until that's done so what's behind it never
shows through. Fading it out and then the next scene in read as "jumpy".

This is not a license for crossfades: between blocks the rule is still fade
fully out, then in.

## Verifying

Render `-ql` while iterating, `-qm` to send Mike. He asked for `qm` by default;
`qh` only when he says so. Send the file from `media/`, never a copy in the
video directory.

**A full video renders with `python render_parallel.py -qm`**, not `manim …
Everything` (see *Render the sections in parallel*): it renders, joins and
masters in one go, about 3x faster. For changes inside a section or two,
render only the scenes involved (a `NewStuff`/`REVIEW` list) and send that
clip; Mike asked for this to avoid waiting on full renders. Include **one scene
of buffer on each side** of the change so he sees it in context, and for
changes far apart send one clip each (a `REVIEW` list must be contiguous).

**Every change summary gives the timestamp of each change in the video being
sent** (`m:ss`, per file if several), so Mike can jump straight to it. Find
them in the render you're sending, never from an earlier one: cross-correlate a
snippet of the take against the render's audio to locate a line, or tile
frames with `drawtext` timestamps. Edits upstream shift everything after them.

**Measure, don't eyeball** — scan frames for ink position or color to prove an
animation reached where it should. But three traps, all of which have produced
a confident wrong conclusion here:

- **Piper is nondeterministic.** The same text synthesizes to different
  durations each run. Cue times must be read from `media/voiceovers/cache.json`
  — the audio the render actually used — never from a fresh synthesis. The
  default draft is now seeded Qwen, which repeats exactly, but read from the
  cache anyway: the fallback off Apple Silicon is still Piper.
- **Audio placement is checked against the scene clock**, not by correlating
  the bell against the mix. Speech underneath drags the correlation peak by
  hundreds of milliseconds.
- **File duration is not video duration.** A sound that rings past the last
  frame extends the audio track, so `ffprobe` format duration and `-sseof`
  both lie. Use the video stream's own duration.

## Real voice

Mike reads the whole script in one continuous take and drops the file into the
video's `content/`. Clean it first with the `voiceover-cleanup` skill (retakes,
his spoken notes, gate, breaths, clicks, plosives), then point `MASTER` at the
cleaned file; nothing else in the scenes changes.

Ask him to leave a beat between blocks. Those pauses become the transitions —
the slice boundaries land inside them — and a block he runs straight into the
next one has no pause to give.

The first render transcribes the take once, aligns it to the script with
`difflib`, and slices per block. Whisper is evidence, not truth: words it gets
right anchor the timeline, words it mangles simply stop being anchors and their
times are interpolated from the neighbours.

### Read the difference report

It lands next to the sliced audio and lists both directions — script words not
heard, and heard words not in the script. Most entries are noise (`there is` →
`there's`, a name misheard). Two patterns are not:

**A whole block unmatched, with a slice of a fraction of a second.** That line
was not recorded. It happened twice here, because GitHub's markdown renderer
swallows a line that sits directly under a `>` note with no blank line between,
and Mike was reading from the rendered page. Give him the exact missing lines
plus the sentence either side, since he needs to match the surrounding tone.

**A mismatch on a cue word.** That cue loses its anchor. Fix it by transcribing
what he *says*, not what the script types: "Stephen" not "Steven", "one
question per character" not "1", "three things" not "3". `script.md` keeps his
spelling; `script.py` is the spoken form.

### Splicing a re-recorded line

Have him record the missing lines in one file, in script order, same setup.
Then cut and insert — but treat every cut the way a slice boundary is treated
below, because the spliced file *becomes the source* everything downstream
trusts. A bad splice is invisible to per-block checks: they measure audio that
is already wrong.

1. Profile the audio at each intended cut and read where the speech actually
   stops. Both the point in his take and the point between the two new lines.
2. Cut only at points measured silent, and **do not trim**. A `dBFS`-relative
   trim shaves sibilants; if the cut is already in silence there is nothing to
   trim anyway.
3. Write to a new file. Never modify his originals.
4. Profile both seams afterwards and confirm the consonants either side survive.

This is where two "fixed" reports came from that were not fixed. The splice cut
through the "s" of "begins" and through the "s" of "pause"; the block slicing
had been correct for two rounds while the damage sat in the source.

### Boundaries land in silence, always

Cut where the audio is quiet, not where Whisper says a word ended — its word
times are frequently contiguous, one word "ending" exactly where the next begins
across an obvious pause, and its ends run early while its starts run late.

Two things make silence harder to find than it looks, and both produced a wrong
answer here:

**A sibilant is quiet.** The "s" of "begins" measures around a tenth of speech
level broadband while carrying all its energy at 3-8kHz. Anything that looks at
amplitude alone — a silence threshold, a trim, a verification — calls it silence
and cuts through it. Measure the 3-8kHz band as well as RMS.

**A dip inside a word can be as quiet as a pause.** The closure before a stop or
a sibilant reads as silence for a frame or two. A pause between sentences lasts
an order of magnitude longer, so require a run of real duration — about 90ms —
before treating it as the boundary. Without that the search picks whichever
quiet patch is nearest, and a dip 40ms closer than the real pause wins.

One boundary is computed per adjacent pair and shared, so slices tile the
recording exactly: no gap for a word to fall into, no overlap for one to be
heard twice.

The outer two boundaries, the start of the first block and the end of the
last, have no neighbor to split against. They are found in the audio too
(`speech_edge`); a fixed pad past Whisper's last word end cut 50ms off the
final "trees".

### Cues fire early

Mike's most repeated timing note, in the uncomputable video and again in
polynomial-zeros. Three causes stacked, all in the same direction:

1. **Cached waits** desync the audio (see the cache note above). Fixed by
   `config.disable_caching = True`.
2. **Whisper's word starts run early mid-phrase.** `onset_after` only fixes
   starts that drifted into a pause. Measured over 125 mid-phrase cues: a
   median 65ms early, a third more than 100ms; "degree" got the start of the
   "s" in "has". `snap_start` moves each start forward to where the level
   climbs out of the dip before the word.
3. **manim truncates waits to whole frames**, so a cue fired up to a frame
   before its word. `narration` patches `wait_until_bookmark` to round up.

When Mike says cues are early, measure before touching bookmarks: find the
frame where the animation starts and the onset of the word in the rendered
audio (cross-correlate a snippet of the take to locate it), and compare.

### Whisper loops; the transcript is cached once per take

Whisper is nondeterministic and sometimes loops: one run turned 112–134s into
"Now rig a rigging" and collapsed three blocks' cues onto one instant. The
usual cure, `condition_on_previous_text=False`, dropped four seconds of words
elsewhere instead. So the transcript is cached per recording
(`transcript-<hash>-<model>.json`), separately from the plan. Changing the
slicing code re-plans without re-rolling it. **Read the report after the first
transcription.** A long run of "in script, not heard" is a bad transcript, not
an unrecorded line, when the audio there is clearly speech. Delete the
transcript file and transcribe again.

### Version the plan cache

`PLAN_VERSION` goes into the fingerprint alongside the recording and the script.
A cache keyed on its inputs but not on the code that transforms them will serve
stale results after a fix, silently — the boundary fix here sat unused for a
render while the old spans were loaded from JSON, and the bug was reported fixed
because a direct call to `plan()` showed the new behavior. Bump it whenever the
slicing changes.

### Verify the audio the render used

Not the plan that produced it, and not a fresh call to the code. Read the block
wavs out of `media/voiceovers/` and measure the first and last 50ms of each,
both RMS *and* 3-8kHz energy. In a good take every block reads near zero on
both. Anything else is a cut through speech.

### Blocks are leveled to one loudness

A take's level wanders from line to line. The uncomputable Short's ran from -24
to -15 LUFS across nine blocks. Mastering can't fix that, since it applies one
gain to everything. So `MasterRecordingService` levels each block's slice to a
common loudness by default (`level="median"`): the median of the take's own
blocks, so the voice as a whole stays where it was recorded and effect gains
tuned against it still hold. It's one gain per block, applied in the silence
at the block edges, so the dynamics inside a line survive. The median is
cached as `master-<key>-median.json` beside the plan. Pass a number for an
explicit LUFS target, or `level=None` to leave the take as read. Mike wants it
on. Verify by measuring the block wavs the render used, the same way as the
edges above.

## Mix the effects against the voice before mastering

A sound effect arrives at whatever level it was uploaded at, which has nothing
to do with the recording. Two of the three in the uncomputable video measured
**10 dB louder than the voiceover**. Mike's words: "sounds effects are way
louder than my voice."

Mastering does not fix this and cannot. It measures the finished mix, works out
one gain, and applies it to everything — the balance inside is exactly as you
mixed it. A hot effect is worse than neutral: it raises the mix's integrated
loudness, so normalizing to -14 LUFS pulls the whole thing *down*, and the
voice ends up quieter than if the effect had been mixed right.

Measure before assuming. Compare each effect to the master recording:

```python
from narration import measure_loudness
measure_loudness(path)  # -> {"lufs": ..., "peak": ...}
```

Integrated LUFS is a rough read under ~3s, so sanity-check a short effect
against `ffmpeg -i x.mp3 -af volumedetect -f null -` too; if `mean_volume` and
LUFS disagree about the direction, trust neither and listen.

Aim each effect a few dB **under** the voice, and keep the numbers in one table
next to `sound()` rather than scattered at call sites, so the mix is
reviewable:

```python
EFFECT_GAIN = {"chop": -1.5, "correct": -14.0, "dial-up": 2.0}
```

with `sound()` looking the gain up by the file's stem when no gain is passed.
Effects that get trimmed or re-cut keep their own name in that lookup (strip
whatever suffix the trim adds), or they silently fall back to 0 dB.

Two signs the balance is wrong that don't require ears: the pre-master true
peak is above the ceiling (the effects are what's clipping), and the pre-master
LUFS is close to the voice's own LUFS despite the video being mostly speech.

## Mastering

Manim's output is quiet: uncompressed speech sits far below its own peaks, so a
render can measure -21 LUFS against a -1.5 dBTP peak. That loudness cannot be
reached by gain — it needs the handful of peaks shaved.

```sh
python -m narration media/videos/main/720p30/Everything.mp4
```

Writes `*-mastered.mp4` beside the render at -14 LUFS / -1 dBTP, the pair
YouTube and Spotify normalize to. Run it after every render you send.

The audio side takes about 25s on a 12-minute video; the BT.709 video
conversion (below) adds about 6 minutes at 4K, less at lower resolutions. It took 3.5 minutes until three
fixes: measuring with `ebur128` instead of `loudnorm` (same numbers, 6x
faster), searching for the gain on a WAV and encoding AAC once at the end
(the encode was nearly all the cost of each pass), and Apple's `aac_at`
encoder where ffmpeg has it (4s against 17s). If mastering is slow again,
time the pieces before guessing.

One fixed gain over the whole mix, then a brick wall — so the balance between
voice, bell and clips is exactly as mixed. Nothing is baked into the render,
and it can be re-run with other targets at any time.

Two things about it that are not obvious:

**Limiting costs loudness**, by an amount you cannot predict. Applying the
measured gain in one shot landed 1.2 dB short, because every caught peak pulls
gain down for its release window. So it measures the output and corrects.

**The limiter works on sample peak; the ceiling is a true peak**, and lossy
encoding puts true above sample. The wall starts a decibel under the stated
ceiling, and moves down by any measured overshoot: a real voice needing +9 dB
came out at -0.33 dBTP behind the fixed -2 dBFS wall.

**The mastered file is converted to BT.709 for YouTube.** canim's
`tag_color_space` declares BT.601 matrix and sRGB transfer, which is right
for local players, and YouTube mishandles both. It converts the sRGB curve to
BT.709's, which crushes shadows (the uncomputable Short's `#022C26`
background played as `#001B15`), and it ignores the BT.601 matrix label and
decodes as BT.709 (polynomial-zeros' `#2B0439` played as `#2D0C3A`, pinks
lighter, greens duller). CapCut exports are BT.709 throughout, which is why
edited uploads looked right. So mastering re-encodes the picture through
BT.709's matrix and tags all three 709 (`DELIVERY_VIDEO`), with libx264:
VideoToolbox caps near real time at 4K60, x264 does 12 minutes of 4K in
about six. Upload the `-mastered` file, never the raw render. To check what
YouTube did to an upload, pause it in the browser pane and read a background
pixel with canvas `drawImage` (yt-dlp gets 403s), and compare against the
theme hex.

## Silence in a real take

A real read leaves longer pauses than the draft voice, and a short line under
a long animation leaves dead air after it. **Mike's pauses in a take are mostly
not deliberate**, especially the long ones; don't pass them through. His
polynomial-zeros take had a median 0.6s at each block edge and pauses inside
blocks up to 2.2s. Set pause timing in the scenes instead:

- `edges=(0.2, 0.25)` and `max_pause=0.4` on `MasterRecordingService` cap the
  silence at every block's (start, end) and any pause inside a block. Inner
  pauses are cut from their middles and later cues shift with them. Set these
  from the start of every real-voice video.
- A deliberate pause is a block boundary plus a wait in the scene (`SHORT_HOLD`,
  or a named beat like `FORMULA_BEAT`). When Mike asks for "a slight pause on
  X", split the narration there.
- `tighten={block_text: (start_cap, end_cap)}` overrides `edges` for one block.
- Speed up animations that run past their line (factoring, the quadratic
  substitution). They were paced against the draft voice and are now
  silent filler.

If Mike asks for a peak target *and* a loudness target, they will usually
conflict — -6 dBFS peaks with -14 LUFS is an 8 dB crest, which for speech means
heavy compression. -6 dBFS is a tracking guideline, about leaving headroom while
recording. Delivery wants -14 LUFS with a -1 dBTP ceiling.
