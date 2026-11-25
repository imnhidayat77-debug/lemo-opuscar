# Pencil Test — Style Prompt

> An animator's rough pencil drawings shot straight off the light table: graphite on punched paper, blue construction lines underneath, the frame number circled in the corner, every drawing a new drawing. The film is the animation before ink and paint: all performance, no polish.
> References (grammar only): the pencil tests and rough reels of hand-drawn feature studios (1930s–1990s), animators' published action-analysis drawings, and modern "rough animation" reels. Take the paper, the line, the stepping and the honesty of the acting. Never copy a studio's characters, model sheets or scenes, and never name them in the film.

## 1. Essence, and what it is not

- **The frame is one sheet of animation paper** on a light table: warm off-white bond, three peg holes along one edge, a faint field guide in places, nothing else around it.
- **Two pencils**: a light blue (or red) pencil for the construction (circles, centre lines, the line of action, the path of action) and dark graphite for the drawing over it. The blue is never erased.
- **Every drawing is new**, so the line **boils**: no stroke sits still between drawings, the paper shifts a hair on the pegs, the exposure flickers.
- **Acting carries everything.** There is no colour, no background painting, no shading beyond a few tone strokes. If a pose doesn't read in line, it doesn't read at all.
- **The animator's notes stay on the page**: the frame number circled, the scene number, a timing chart on the key drawings, an arrow and "ease in" written beside a hand.

Not Marker on Paper (one thick marker, red/blue semantics, a sheet per step: explanations, not character animation). Not Whiteboard or Sketchnote (drawn stroke by stroke in front of you; here the drawing is already complete in every frame and *changes* frame to frame). Not 1930s Rubber Hose (inked, painted, film-damaged and bouncing to jazz). Not a storyboard (Story-Sketch Board): those are held still pictures on a board; this is full animation.

## 2. Materials & rendering

- **Paper**: warm off-white (about `#f1ece0`) with a slight tooth (fine noise, ±3 %), a soft light-table glow from behind (centre a few % brighter), and **three punched peg holes** (round–slot–round, as on standard animation paper) near the bottom or top edge, dark where the table shows through. A margin at the paper edge may show in wide frames; in close framing the sheet fills the frame.
- **Graphite line**: drawn as many short, overlapping, slightly wobbly strokes along each path (2–4 passes, each with its own noise offset), width 1.5–3.5 px at 1080p with pressure (thicker in the middle of a stroke and on the underside of forms, thinner at the ends), colour a warm dark grey `#2c2a28` at 70–95 % opacity, multiplied onto the paper. Search lines (a second, lighter stroke a few px off) appear on about a third of the contours.
- **Construction**: the blue pencil (`#6f9fd8` at 35–55 %) draws the shapes the drawing is built on: head circle and cross-lines, body bean, the **line of action** through the pose, joint circles, and on key drawings the **path of action** as a dotted arc. Drawn under the graphite, lighter, looser, with longer strokes.
- **Tone**: at most a few patches of side-of-the-pencil shading (hatched, 20–35 %) for a dark shape (an eye, a cap); no fills, no gradients.
- **Onion skin (optional, a native move)**: the previous drawing or two, lighter (15–25 %), as if seen through the paper on the light table.
- **Paper marks**: an eraser smudge or two, a faint ghost of an erased line; stay put on the sheet (anchored to the paper, not the screen) and move with it.
- **Camera artefacts**, a screen-space pass: exposure flicker ±3 % per drawing; a register jitter of ±0.6 px (and ±0.05°) per drawing, because the sheet is a new sheet; slight vignette; grain in ffmpeg (`mux.sh` grain 2), never in the page.
- **Everything is drawn per drawing**: stroke noise is seeded by the drawing number, not by time, so a held drawing holds and a new drawing changes.

## 3. Colour logic

- **Paper, graphite and one construction colour.** Blue is the default; red pencil is the alternative (choose one per film).
- **One accent colour, rare**: a single colour pencil for one meaning (a correction note, the thing the story is about, the last line of the film). Used for less than 5 % of the film's frames. Example: a red pencil heart drawn on the final key; an orange note "hold!" circled.
- Values: paper light, construction mid-light, graphite dark. Nothing darker than graphite, nothing lighter than the paper glow.

## 4. Type & subtitles

- **Notes are handwriting**: a pencil hand (e.g. **Caveat** or **Reenie Beanie**, OFL) for the animator's notes and frame numbers, in graphite or the construction colour. Frame number top-right or bottom-right, circled, changing every drawing.
- **Production slates** (scene and sequence, an exposure-sheet header) in a typewriter face (**Courier Prime**, OFL), small, at the paper edge.
- **Subtitles** are written on a strip of masking tape stuck to the bottom of the sheet (pale tan, a torn end, slightly rotated), text in the pencil hand at 40–48 px. The tape is on the paper and jitters with it. Hold ≥ max(1.8 s, speech + 0.6 s); the words don't boil (they are one note held over many drawings).
- **Titles**: hand-lettered in graphite on the paper, outlined block capitals with construction lines visible under them, or typed on a slate card pegged on.

## 5. Motion quality

- **Drawings on twos** (12 drawings per second) for acting; **on ones** for fast scrambles, sharp accents, the payoff after a big anticipation, and whenever the camera moves (ANIMATION.md §2.9). Holds hold the same drawing (same noise seed); a hold longer than about 1.5 s gets a moving hold or a blink, drawn as new drawings.
- **Full character animation**: every principle in [`ANIMATION.md`](../../ANIMATION.md) is on show, because nothing else is. Squash and stretch with constant volume; anticipation on every move; overlap on loose parts; arcs (the path of action is often drawn on the key); a blink on every change of eye direction.
- **Pose test mode** is part of the style: a scene may start as held key poses (each 6–24 frames) and later in the film be seen fully inbetweened. Use the difference.
- **What never moves**: the peg holes relative to the paper; the timing chart on a key; the masking-tape subtitle relative to the paper.

## 6. Camera grammar

The camera is the animation stand: straight down at the paper. Moves are the stand's moves, smooth on ones.

| Move | What it expresses | Can serve |
|---|---|---|
| Locked frame on the field, sheet filling it | The performance, nothing else | an acting scene; dialogue; a single gag |
| Slow truck in on a field guide rectangle | Attention narrowing to a detail | an expression change; the eyes; a hand deciding |
| Pull back to show the peg bar, the table edge, the stack of drawings | It's all drawings; the scale of the work | an ending; a "making of"; how much effort a thing took |
| Pan across a wide sheet (a long pan background drawn in pencil) | Travel, pursuit | a walk across town; a chase; a journey |
| Flip (pages riffled, drawings flashing by at speed) | Time compressing, energy | a montage; a scramble; a transformation |
| Roll (the animator's three-drawing roll: back and forth between keys) | Searching for the right move | deciding; hesitation; a character trying again |

Framing: the character fills at least a third of the frame height at key moments (DIRECTOR.md §8). Keep the peg holes in or near frame often enough to remember it's paper. Transitions: a new sheet laid over the old (a paper slide-in with its shadow), a flip, the light table switched off and on; no dissolves, no wipes that aren't paper.

## 7. Sound palette

- **Foley of the desk**: graphite on paper (a short scratch per new key in pose-test passages, never every drawing), an eraser rub, paper riffled, a sheet pulled off the pegs, the click of the peg bar, the hum of the light table, a pencil tapped.
- **The test projector or editing machine**: a soft motor whirr and sprocket chatter under the quiet scenes (the only sound allowed in a silence).
- **Music**: a rehearsal-room score, as if temp-tracked: solo piano (upright, a little out of tune), or piano with a clarinet or a muted trumpet, a brush snare; one short theme restated. A "scratch track" feel: close and dry. No orchestra, no synth pads.
- **Voices**: a scratch voice, recorded close in a small room: natural, unpolished, with breaths and little sounds (ANIMATION.md §4). A rough voice suits the rough picture.
- **Mix**: dry, intimate, little reverb; duck music ~8 dB under dialogue; −14 LUFS.

## 8. Native moves

- **Pose test to full animation.** A scene plays first as held key poses (crisp, staccato), then again, fully inbetweened and alive. *Fits content like:* before/after of a training course; a first attempt and a mastered one; a memory and the present.
- **The construction reveals the idea.** The blue skeleton (line of action, circles) holds still while the graphite comes and goes, or the camera finds a diagram hidden in the construction. *Fits content like:* how something is structured; the plan behind a decision; what's under the surface of a product.
- **Onion skin as time.** The previous drawings stay visible as ghosts, so one frame shows a whole movement. *Fits content like:* the path of a ball in sport; a habit repeated; growth over years.
- **The flip.** The stack is riffled; drawings flash by and the character lives for a second at speed. *Fits content like:* a montage of attempts; a year passing; an energetic intro.
- **The animator's correction.** A note in the accent pencil ("bigger!", an arrow), and the next drawing obeys it. *Fits content like:* feedback; a coach's tip; a product iteration.
- **Off the page.** The character steps onto the peg bar, peeks under the sheet, or pulls the next sheet in. *Fits content like:* a mascot breaking the frame; an ending; a call to action.

## 9. Pitfalls of the medium

- **Clean vector lines** read as digital: always multiple jittered passes with pressure, never one smooth stroke.
- **Boil on everything every frame** reads as noise: boil per drawing (twos), hold on holds, and keep the construction calmer than the graphite.
- **Construction too strong** turns the character into a diagram: blue stays light, under, and shows only the shapes that build the pose.
- **No acting**: without colour or setting, a weak pose is fatal. Thumbnails and a pose test before anything else (ANIMATION.md §10).
- **Twins**: stiff mirrored limbs are glaring in line; offset every pair.
- **Unreadable subtitles** if handwriting is small or light: keep them graphite-dark at ≥ 40 px on the tape.
- **Stepped camera**: the stand moves on ones, smoothly; characters go on ones while it moves.

## 10. Engine

In `demo/`: `pencil.js` (the pencil engine: `stroke(ctx, pts, opts)` draws a pressure path as seeded jittered passes; `ellipse`, `blueCircle`, `pathOfAction`; `paper(ctx, w, h, seed)` paints the sheet, tooth and peg holes; `drawingSeed(t)` gives the per-drawing seed on twos), `frame.js` (the style frame: a sparrow's hop drawn from construction to graphite with onion skin, frame number and timing chart). Animate with `core/anim.js` (`poses`, `action`, `follow`, `blink`, `onTwos`). Minimal use, something that isn't in the frame: `stroke(ctx, arcPoints, {seed: drawingSeed(t), w: 2.6})` along a ball's bounce, plus `blueCircle` at each key.

## 11. Variation space

The film decides: the cast (people, animals, objects), the story, how much of the paper and desk is seen, blue or red construction, whether there is an accent pencil and what it means, how much pose-test against finished movement, the pace.

- Structures: **attempt and mastery** (a skill shown first as stiff key poses, finally fully alive); **the note pass** (an animator's corrections steer a scene draft by draft); **one long walk** (a single walk cycle across a long pencil pan, the world drawn as it goes).
- Openings: **an empty sheet pegged on** (the light comes on, a blue circle, then a life); **the riffle** (a stack flipped and a character bursts out of it); **a timing chart** (the numbers on a key drawing count down and the action starts on the last).
- Endings: **the stack** (pull back to a pile of thousands of drawings); **the last key** (the final pose held, a frame number circled, the light switched off); **inked at last** (one drawing in the film is finished in ink and colour, and the character sees itself).

---

How our style frame was made: [DEMO.md](DEMO.md). There is no demo film yet.
