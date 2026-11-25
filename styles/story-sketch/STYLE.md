# Story-Sketch Board — Style Prompt

> A story told on a wall of pinned sketches: charcoal and pastel drawings on toned paper, a few inches across, in rows on a soft board, captions written underneath. The camera reads the board panel by panel the way a story meeting does, and now and then a sketch comes alive for a few poses.
> References (grammar only): the story departments of hand-drawn animation studios and the pinned "storyboards" they invented in the 1930s; story sketches by illustrators working in charcoal, conté and pastel; the rhythm of an animatic (a story reel) cut to a scratch voice. Take the materials, the staging and the pacing of a pitch. Never copy a studio's sketches, characters or films, and never name them in the film.

## 1. Essence, and what it is not

1. **A real board on a wall**: soft fibreboard or cork, pushpin holes everywhere from earlier pitches, warm room light falling from above.
2. **Sketches, not illustrations**: each panel is a quick charcoal or conté drawing on toned paper (grey, buff, blue-grey), with a few strokes of white and one or two pastel colours. They show feeling and staging: a character's attitude, a mood, where the camera is. Never a finished painting.
3. **Rows that read like a sentence**: left to right, top to bottom. A panel is a beat. Some panels sit slightly crooked; some overlap; an alternate idea is pinned beside the one it might replace.
4. **The pitch is the soundtrack**: a storyteller's voice acts every part over the boards, with mouth sounds, a hummed tune, a table slap for a crash.
5. **Sketches come alive, briefly**: a panel the camera settles on may move in 2–6 held poses (a limited, pose-test animation), then freeze back into a sketch.

Not Engineering Briefing Board (photographed evidence and measurements on enamel; here, drawn fiction on fibreboard). Not Sketchnote or Whiteboard (drawn in front of you on one page; here every panel is already drawn, the camera reads them). Not Manga Panels (printed, inked, panels laid out on a page with speech balloons; here loose pinned sheets, no balloons, the voice carries the words). Not Pencil Test (full animation on punched paper).

## 2. Materials & rendering

- **The board**: a large plane (3–5 frames wide) of fibreboard (warm grey-brown with fine fibre noise) or cork (granular, warmer), lit by a soft top light with a gentle falloff toward the bottom and the sides. Old pushpin holes (tiny dark dots with a lighter rim) scattered across it, more near the rows.
- **Sheets**: each sketch is a sheet of toned paper (aspect about 4:3 or 3:2, a few px of white border on some), pinned at the top corners with **pushpins** (coloured plastic heads, a small hard shadow) or one centre pin. Each sheet has a slight rotation (±1.5°), a soft drop shadow (offset down 4–8 px, blurred), a tiny curl lift at the free corners, and paper grain.
- **Drawing on the sheet**: charcoal or conté strokes (soft-edged, grainy, broken by the paper tooth: stroke alpha modulated by paper noise), smudged mid-tones (a blurred tone stamp, rubbed with the finger), **white chalk** for light and highlights, **one or two pastel colours** per sheet (a warm lamp, a red coat, a blue night), applied as broad grainy patches that don't fill the outlines exactly. The drawing is loose: search lines, overlaps, a strong silhouette.
- **Captions**: under (or on) each sheet, a line of handwritten text on the paper or on a separate pinned slip: the business or the line of dialogue.
- **Depth**: the sheets sit a few millimetres off the board. When the camera pans, the board, the sheets and the pins parallax slightly (sheets 1–2 % faster than the board). A light depth of field (board slightly soft at the frame edges in close shots).
- **Living panels**: when a sketch comes alive, the drawing on that sheet is redrawn per pose with a new stroke seed (the sketch boils for each pose), on the same sheet; the sheet itself stays pinned.
- Grain in ffmpeg (`mux.sh` grain 2).

## 3. Colour logic

- **The room is neutral and warm**: board brown-grey, light warm.
- **Each sheet has a toned ground** (mid value) so both dark charcoal and white chalk read. The film picks two or three paper tones and assigns them by meaning (example: grey for the everyday, blue-grey for night or worry, buff for memory).
- **Pastel colour is the storyteller's emphasis**: at most two hues per sheet, reserved for the thing that matters in that beat (the lamp, the letter, the villain's eye). A colour that carries a meaning keeps it through the film.
- Charcoal is never pure black, chalk never pure white; values sit between `#1e1b18` and `#f2ece0`.

## 4. Type & subtitles

- **Captions** in a quick marker or pencil hand (e.g. **Kalam** or **Patrick Hand**, OFL), dark grey, 24–34 px at full frame, one line per sheet; they are part of the board and are read as the camera passes.
- **Sequence cards**: typed index cards pinned at the start of a row (`SEQ. 3 · THE STORM`), in **Courier Prime** (OFL).
- **Subtitles** for the voice: a typed strip (like a typed dialogue slip) pinned near the bottom of the frame's view, or a plain paper slip in screen space in the same typewriter face, 38–44 px; hold ≥ max(1.8 s, speech + 0.6 s). Never a modern caption bar.
- **Titles**: a title card sketched in charcoal and chalk lettering on its own sheet, pinned first on the board.

## 5. Motion quality

- **The board never moves; the camera does**, smoothly on ones, with eased starts and stops (ANIMATION.md §2.6). Most panels are **held**: the reading time of a sketch (≥ 2 s, more for a busy one) is the rhythm.
- **Cuts land on the voice**: like a story reel, a new panel arrives on the beat of the line or the pitch's accent.
- **Living sketches**: 2–6 key poses, each held 6–16 frames, cut, not inbetweened (a pose test, ANIMATION.md §2.4); each new pose redrawn with fresh strokes. Keep the acting clear in silhouette: the poses must read at sketch quality.
- **The board is touched**: a hand-held pointer may tap a panel; a sheet may be pulled off and replaced, or flipped over to show an alternate on the back; a pin may pop. These are rare and meaningful.

## 6. Camera grammar

A camera reading a wall. Opening and ending come from the topic.

| Move | What it expresses | Can serve |
|---|---|---|
| Lateral track along a row, reading left to right | The story moving forward, beat by beat | a sequence of events; a process; a journey |
| Push into one sheet until it fills the frame | This beat matters; entering the story | a turning point; a close-up of feeling; a joke's payoff |
| Pull out from a sheet to the whole board | Everything at once; the shape of the story | a summary; the reveal of how far it went; the ending |
| Down-and-back to the next row | A new chapter | a time jump; a change of place; act two |
| A rack across two sheets pinned side by side | A choice between versions | two options; then and now; a rejected idea and the chosen one |
| Hold on a sheet while the voice performs | The pitch carries it | a dialogue scene; a gag told out loud |

Framing: in a push-in, the sketch's subject fills at least a third of the frame. At least one sheet edge or pin stays in frame except in the deepest push-ins, so we remember it's the board. Transitions: travel along the board, a sheet pulled away to reveal the next one beneath it, a sheet flipped. No dissolves, no digital wipes.

## 7. Sound palette

- **The storyteller**: one voice (or two) performing the pitch: narration, all the characters' lines in different voices, sound effects done by mouth, a few bars of the tune hummed. Lively, close, a real room. This is the main instrument.
- **The room**: soft room tone, a chair creak, laughter or a murmur from listeners (sparingly: one or two moments), pushpins pressed in, paper rustle, a pointer tapping the board.
- **Music**: a temp-track feel: a solo piano or a small band playing under the pitch, starting and stopping with the sections, as if from a record player in the room (slightly band-limited). Optionally the pitcher's hummed theme becomes the real score at the end.
- **Silence**: the pitcher's pause before the punchline; only room tone.
- **Mix**: voice forward and dry-ish with a short room; music ducked 10 dB under the voice; −14 LUFS.

## 8. Native moves

- **The sketch comes alive.** The camera settles; the drawing on the sheet moves through a few poses, then freezes. *Fits content like:* the moment a customer decides; a child's first step in a family history; the turning point of a case study.
- **The swap.** A sheet is unpinned and replaced by another: the story changes before your eyes. *Fits content like:* a plan revised; a myth corrected by a fact; "what if" scenarios.
- **The board as map.** Pull back and the arrangement of the sheets is itself a shape (a timeline, a loop, two diverging rows). *Fits content like:* a product roadmap; two lives that meet; a cycle that repeats.
- **Alternates side by side.** Two versions of the same beat pinned together; the camera rests on each before one is taken down. *Fits content like:* comparing options; before and after; a decision.
- **The pitcher performs.** One sheet held still while the voice acts every character and mouths the sound effects. *Fits content like:* a funny anecdote; a customer story; an origin story.
- **The last sheet pinned.** A blank spot in the row is filled with the final sketch as the film ends. *Fits content like:* an invitation; the next chapter; "and that's where you come in".

## 9. Pitfalls of the medium

- **Finished illustrations** kill the style: keep sketches loose, grainy, with search lines and broad tone.
- **Too many panels per screen** and nothing can be read: in a wide shot, sheets are part of the texture; read them in close and medium shots.
- **Moving the board** instead of the camera, or a stepped camera: the board is fixed, the camera glides on ones.
- **Captions too small**: captions that carry the story must be readable at the framing where they're on screen, or the voice must carry them.
- **Living sketches with smooth inbetweens** read as a different film: keep them to held poses, cut.
- **Flat lighting**: without the top light falloff, pin shadows and sheet shadows, the board looks like a screen.
- **Colour everywhere**: pastel only for the emphasis of each beat.

## 10. Engine

In `demo/`: `board.js` (`board(ctx, cam)` paints the fibreboard and pin holes once to a cached canvas; `sheet(ctx, s, cam)` draws a pinned sheet with rotation, shadow, curl and pins; `charcoal(ctx, pts, opts)` and `chalk(...)` grainy strokes on the sheet's tone; `smudge(ctx, poly, tone)`; `pastel(ctx, poly, colour)`), `frame.js` (the style frame: a row of six sketches telling a lighthouse-keeper's storm night, one pushed into). Camera through one world → screen transform (TECHNIQUE.md §2). Minimal use, something not in the frame: `sheet()` with a sketch callback drawing a single charcoal silhouette of a runner, pinned beside an alternate where the runner falls.

## 11. Variation space

The film decides: the board material, paper tones and their meanings, how many rows and sheets, how often sketches come alive, one pitcher or two, whether listeners are heard, the music.

- Structures: **the pitch** (a storyteller presents a story to an unseen room, row by row); **the rewrite** (a first version told, then sheets swapped until the story works); **two rows** (two parallel lives told in two rows that converge into one sheet).
- Openings: **the empty board** (pins pressed in as the first sheets go up); **the title sheet** (the camera starts tight on a charcoal title and slides off it into the story); **the alternate** (two openings pinned side by side, one taken down).
- Endings: **the whole wall** (pull back to every sheet at once, the story's shape visible); **the living last panel** (the final sketch comes alive and keeps moving after the voice stops); **lights out** (the room light switched off, one sheet lit by a desk lamp).

---

How our style frame was made: [DEMO.md](DEMO.md). There is no demo film yet.
