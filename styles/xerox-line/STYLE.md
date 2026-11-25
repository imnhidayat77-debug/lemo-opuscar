# Xerox Line '60s — Style Prompt

> The animator's own pencil line, photocopied straight onto the cel: scratchy, broken, doubled where the pencil searched, black and alive. Behind it, backgrounds drawn in the same rough black line over loose patches of flat colour that don't stay inside the lines. A crisp, graphic, early-1960s look built on full, weighty animation.
> References (grammar only): feature and short animation of the late 1950s–60s that used electrostatic copying to transfer drawings to cels, and the illustrators of that decade who drew in loose ink over offset colour (book jackets, children's picture books, magazine spreads). Take the line, the colour placement and the design sense. Never copy a film's characters, layouts or settings, and never name them in the film.

## 1. Essence, and what it is not

- **The line is the drawing.** Characters are outlined in a black (or very dark grey) pencil line with the roughness left in: doubled strokes, gaps, a little construction showing, heavier at the bottom of forms. The line weight varies like a pencil, not like a pen.
- **Characters are painted inside their lines**: flat opaque colour, cleanly filled, two to five colours per character, no shading, no gradients.
- **Backgrounds are a different world**: a black line drawing (buildings, furniture, trees, in a loose, angular, perspective-cheating 60s design) laid over **flat colour shapes that are offset from the line**, larger or smaller than what they belong to, as if painted on a separate layer by someone who looked at the drawing once.
- **Full animation with weight**: characters move with real anatomy and timing (anticipation, overlap, arcs), not the limited "held body, moving arms" of 1950s TV.
- **Texture is graphic**: dry-brush and crayon textures on the colour patches, stipple or cross-hatch in the line on backgrounds; the frame reads like a printed illustration that moves.

Not Mid-century Cartoon (geometric characters, a thin breathing line that never closes, fills offset on the *characters*, limited animation, rooms as bare colour planes): here the character fills sit inside a rough heavy line, the motion is full, and the rooms are drawn in full with line. Not 1930s Rubber Hose (black-and-white, round, bouncing to jazz). Not Pencil Test (graphite on paper, no colour, no backgrounds).

## 2. Materials & rendering

- **Xerox line** (`xline`): every contour drawn as 2–3 overlapping rough passes of a dark line (`#151312`), width 2–4.5 px at 1080p with pressure, broken where a noise mask drops below a threshold (2–6 % of the length missing in short gaps), small overshoots at corners, a ghost search line on some contours. Toner texture: the line's edge is slightly ragged (alpha modulated by fine noise). Per drawing, the stroke noise is reseeded (the line boils on twos).
- **Grey-line variant**: for gentler films, the same line in a warm mid-grey (`#5a524c`) with softer edges; colour lines (the line tinted toward the fill) only on faces. Choose black or grey per film and keep it.
- **Character paint**: flat fills drawn first, clipped to the closed outline (fill paths are the clean versions of the line paths, so paint never leaks); then the rough line over them.
- **Background colour**: flat shapes with softly irregular edges (a few px of wobble), offset 6–30 px from the line drawing they belong to, sometimes overlapping two objects, some drybrush (streaked texture), some crayon (paper-tooth texture). Then the background line drawing over them: rougher and finer than the character line (1–2.5 px), with hatching for shadow areas and stipple for texture.
- **Layers**: background colour → background line → character paint → character line. An optional overlay level (a foreground railing, a lamp post) in line + colour.
- **Paper and print feel**: a warm paper texture under everything (`#f2ead8`), very slight colour misregistration of the background colour layer (1–2 px per colour), grain in ffmpeg (`mux.sh` grain 2–3).
- Contact shadows: a flat transparent shape (multiply, 35–50 %), no blur.

## 3. Colour logic

- **A limited, designed palette per sequence**: 4–6 flat colours for backgrounds plus paper; a muted, slightly dirty mid-century range (mustard, teal, brick, olive, dusty pink, slate) rather than primaries.
- **Characters are the most saturated or the most contrasting thing in the frame**, but built from few colours. Large areas of a character are never pure black (black is a hole: use a deep warm grey or a coloured dark), and a dark character gets a lighter background behind it.
- **Background colour shapes do the lighting**: a pale yellow patch for a window's light, a blue patch for shade, not gradients.
- Example palette (example only): paper `#f2ead8`, mustard `#d4a43a`, teal `#3d7f7a`, brick `#b4553b`, olive `#8c8a4b`, slate `#5d6a78`, line `#151312`.

## 4. Type & subtitles

- **Titles** in hand-drawn 60s lettering: irregular brush or pencil capitals, letters of varied size and baseline, drawn with the xerox line over a flat colour block (e.g. **Love Ya Like A Sister** or a hand-traced display face, OFL). Credits-style captions in a condensed grotesque (**Oswald**, OFL) for contrast.
- **Subtitles**: in a hand-printed face (**Patrick Hand**, OFL), dark line colour on a loose flat colour patch (paper-coloured or the sequence's pale colour) offset under the text like the background colour; 40–46 px. Hold ≥ max(1.8 s, speech + 0.6 s).
- **Signs and labels in the world** are hand-lettered in the background line style.

## 5. Motion quality

- **Characters on twos** for most acting, **on ones** for fast action, accents and whenever the camera moves (ANIMATION.md §2.9). The rough line boils per drawing: each new drawing reseeds the strokes; holds hold the seed, and holds longer than about 1.5 s get a moving hold or a blink.
- **Full acting**: weight, squash and stretch with constant volume, overlap on ears, tails, coats; arcs; expressive walks (ANIMATION.md §2, §7). Animals are drawn with real anatomy, caricatured.
- **Repetition is a tool**: a walk cycle copied and scaled to recede into the distance (the copying process made this cheap), crowds of identical-but-offset figures, patterned movement. Check cycles over many steps (ANIMATION.md §7).
- **Backgrounds don't boil**: they are one drawing per shot; their colour shapes never move against their line.

## 6. Camera grammar

The camera of a multiplane-less studio: pans and trucks over long flat backgrounds, cuts on action.

| Move | What it expresses | Can serve |
|---|---|---|
| Long lateral pan over a wide background, characters walking with it | Daily life moving on | a city morning; a commute; a chase across town |
| Graphic flat composition, locked | A designed tableau; wit | a punchline; an introduction; a comparison |
| Truck in on a character, background held | Attention | a decision; a reaction; a realisation |
| Overlay pass (a foreground railing or crowd sliding past faster) | Depth without 3D | a street; a station; a crowd |
| Repeated receding figure (copies shrinking toward the horizon) | Distance, many, endless | a long road; a queue; "and they kept coming" |
| Cut on action between strongly different angles | Energy, comedy | a gag; a fight; a dance |

Framing: characters fill at least a third of the frame height at key moments; backgrounds stage the action (keep the area behind a face simple, ANIMATION.md §8). Transitions: a cut on action, a pan into a flat colour field that becomes the next scene's colour, an iris drawn in the xerox line; no soft dissolves.

## 7. Sound palette

- **Small jazz combo, 1960s**: upright bass (walking), brushed drums, vibraphone, piano, a cool trumpet or a bari sax, finger snaps, flute; a harpsichord for a comic or sinister turn. One short original theme with variations. No synths, no string pads.
- **Foley that's a little stylised**: crisp footsteps (different per character), a typewriter, doors, car horns, a dog's claws on linoleum; slide whistle and woodblock sparingly for comedy.
- **Ambience**: city hum, distant traffic, a radio in another room; silence (room tone) before a punchline.
- **Voices**: natural, characterful, unforced; a narrator, if any, wry and conversational.
- **Mix**: warm, mid-forward, a little room; duck music ~8 dB under voice; −14 LUFS.

## 8. Native moves

- **The line comes first.** A scene starts as the bare xerox line drawing; the flat colour patches drop in behind it, off-register. *Fits content like:* a plan becoming real; a memory filling in; a neighbourhood waking up.
- **Colour that doesn't fit.** A colour patch slides away from its object or spreads across the scene to carry a feeling (a red patch spreading = anger; a yellow window patch growing = hope). *Fits content like:* a mood change; a warning; an idea catching on.
- **Copies.** One drawing multiplied: a crowd, a row of identical houses, a walk receding into the distance, each copy smaller. *Fits content like:* scale; a production line; how many people a thing reaches.
- **The flat tableau.** A scene composed like a 60s book illustration, held, with one small movement in it. *Fits content like:* a title card; a summary; a quiet moment.
- **The pan that becomes a pattern.** A long pan where the buildings' windows, fence posts or tree trunks become a rhythmic pattern on the beat. *Fits content like:* a commute; time passing; a montage.

## 9. Pitfalls of the medium

- **Clean vector outlines** read as modern flat design: always rough, multi-pass, broken, with pressure.
- **Fills leaking or offset on the characters** turns it into Mid-century Cartoon: character paint stays inside the line.
- **Boiling backgrounds** are noisy and tiring: backgrounds are drawn once per shot.
- **Too much black**: large black areas go dead and swallow lines; use dark coloured greys, keep backgrounds lighter behind dark characters.
- **Colour patches that look like mistakes**: offsets must be deliberate (consistent direction and size per scene), not random per object.
- **Line weight too uniform** looks mechanical; too varied looks messy. Pressure follows form: heavier on the underside and in the dark shapes.
- **Copied cycles amplify flaws**: a small limp becomes a disaster over twenty copies.

## 10. Engine

In `demo/`: `xline.js` (`xline(ctx, pts, {seed, w, closed, grey})` the rough line; `fillClean(ctx, pts, colour)`; `patch(ctx, pts, colour, {dx, dy, wobble, texture})` the offset background colour; `hatch(ctx, poly, angle, gap)`; `paper(ctx, w, h)`), `frame.js` (the style frame: a long-eared hound and its owner on a 60s street at morning, background in line over offset colour). Animate with `core/anim.js` (`walk`, `follow` for the ears, `poses`, `onTwos`). Minimal use, something not in the frame: `patch()` a teal rectangle, then `xline()` a bus outline over it with a 14 px offset; a bus that drives past on ones.

## 11. Variation space

The film decides: black or grey line, the palette per sequence, the city or countryside, the cast, how much repetition, the combo's line-up.

- Structures: **a day in a neighbourhood** (dawn to night, one street, many characters' small stories); **the chase** (one pursuit across a whole drawn city in long pans); **the list that becomes a crowd** (one person, then copies, then a whole city doing the thing).
- Openings: **line before colour** (an empty street drawn in line; the colour patches drop in one by one with the bass); **the receding walker** (a figure walking toward us from a vanishing point of copies); **the tableau** (a held book-illustration composition, then the first blink).
- Endings: **colour drains away** (patches slide off, leaving the line drawing, then paper); **the copies go home** (the crowd disperses into the houses, lights going off); **the title tableau** (the last shot composes into the film's title lettering).

---

How our style frame was made: [DEMO.md](DEMO.md). There is no demo film yet.
