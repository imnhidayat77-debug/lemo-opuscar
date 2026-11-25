# Golden-Age Storybook — Style Prompt

> A painted fairy-tale world in depth: soft watercolour and gouache backgrounds on separate glass levels, a camera that drifts through them, and hand-inked, hand-painted characters with gentle coloured lines who act with real weight. The look of the late-1930s and 1940s hand-drawn feature at its most crafted.
> References (grammar only): European picture-book illustration of the early 20th century (soft watercolour, warm lamplight, storybook architecture); the multiplane camera features of the late 1930s–40s for depth, light and full character animation; the effects animation of that era for rain, mist, sparkles and fire. Take the materials, the lighting, the depth and the acting. Never copy a studio's characters, designs, settings or music, and never name them in the film.

## 1. Essence, and what it is not

- **Painted depth**: every shot is built from 3–6 painted levels (a dark, soft-focused foreground; the acting level; one or two middle levels; a misty far background), moving at different rates when the camera moves. Light comes *through* the levels: shafts, glows, haze.
- **The backgrounds are illustrations**: watercolour and gouache with soft edges, granulation, dry-brush accents, warm-cool light, and detail placed away from where the characters act.
- **Characters are cels**: flat-painted shapes with **self-coloured lines** (each line a darker shade of the colour it borders, black only for small dark features), a soft rubbed shade on turning edges, never a hard cel shadow band.
- **Full animation with weight and feeling**: on ones and twos, every principle in [`ANIMATION.md`](../../ANIMATION.md); characters think, breathe, and touch.
- **Effects are part of the painting**: sparkles, fireflies, mist, rain, candle glow, ripples, drawn and painted in the film's style and kept behind the acting.

Not 80s Cel Anime (hard-edged cel shading, airbrushed sci-fi, videotape): here the shading is soft and the world is a storybook. Not Watercolor Brush (a brush engine painting strokes in front of you; here the paintings are finished and the camera moves through them). Not 1930s Rubber Hose (black and white, round, jazz). Not Paper Pop-up Book (3D folded paper; here painted glass levels).

## 2. Materials & rendering

- **Levels**: each level is a cached canvas painted once at 1.25–1.5× resolution (so push-ins stay crisp), with alpha, placed at a depth. The camera's x/y/zoom move each level by its parallax factor (foreground > 1, background < 1). Levels far from the acting plane get a **depth blur** (2–8 px foreground, 1–3 px far background), as with a shallow lens.
- **Watercolour engine for backgrounds**: shapes laid as several transparent washes (each a noisy-edged polygon, 10–30 % alpha, multiplied), **edge darkening** (pigment pooling at a wash's border), **granulation** (fine noise modulating alpha), **blooms** (soft lighter rings where water was dropped), **dry-brush** accents for bark, grass and stone. Gouache for opaque lights (windows, highlights, foreground leaves): flatter, slightly chalky.
- **Light**: one key light per scene (a window, a lantern, the moon), painted into the levels as warm glows, plus a **light pass** in screen space: soft additive glows around light sources, a few volumetric shafts (gradient polygons, additive, 5–15 %), and atmospheric haze between levels (each farther level lightened and cooled).
- **Cels**: character shapes as clean paths; fill flat; **self-coloured line** (the fill's colour darkened ~35–45 %, 1.5–2.5 px, slightly tapered); **blend shade**: a soft multiply gradient along the edge away from the key light (10–20 %), clipped to the shape; small highlights in gouache white on eyes and noses. Line and fill are aligned, never offset.
- **Shadows**: contact shadows as transparent shapes (multiply, 30–55 %), softened 2–4 px; one shadow density for a whole group. Larger cast shadows on walls for drama.
- **Film**: a gentle bloom on highlights, very slight warm halation, grain in ffmpeg (`mux.sh` grain 2). No scratches or damage: this is a well-kept print.

## 3. Colour logic

- **A colour key per sequence**, planned like a score: warm safety (amber, rose, honey), cool danger (blue-green, violet, slate), a turn marked by a change of key.
- **Characters are muted and harmonious** with their world; their few colours (3–6 each) are chosen against every setting they appear in. The audience's eye goes to them because of value and contrast, not saturation.
- **Value structure**: dark foreground frame, lighter acting area (a pool of light), atmospheric far background. The brightest value in the frame is the key light or a face.
- **No pure black on characters** (it reads as a hole): dark details in deep coloured browns, blues or plums; pure black only in small points (pupils).
- Example (example only): a dusk glade: foreground `#22263a`, trees `#4f6b5e`, path `#c9a86f`, sky `#e8c7a0`, lantern `#ffd98a`.

## 4. Type & subtitles

- **Titles**: a storybook serif with old-style figures (**Cormorant Garamond** or **IM Fell English**, OFL), cream with a soft warm glow, or set into a painted book page, an illuminated initial, a carved sign in the world.
- **Subtitles**: **Cormorant Garamond** SemiBold (or another warm book face that covers the film's language) at 44–52 px, cream (`#f6ecd6`) with a soft dark glow (not a box), lower third. Hold ≥ max(1.8 s, speech + 0.6 s).
- **Text in the world** (a sign, a letter, a book) is painted in the background's style.

## 5. Motion quality

- **Characters on ones for delicate acting** and whenever the camera moves; on twos for broad comic business when the camera is locked (ANIMATION.md §2.9).
- **Weight and feeling**: anticipation, overlap on hair, ears, cloth and tails (`follow`, `chain`), moving holds, blinks; expressions changed outside the big moves; the body agreeing with the face (ANIMATION.md §2–§5).
- **The camera drifts**: slow, eased moves on ones (trucks, pans, multiplane push-throughs) with each level parallaxing; never a stepped or jerky camera.
- **The world breathes, gently**: leaves, water, candle flames, mist and fireflies move continuously but softly and never in step (offset phases, varied speeds, ANIMATION.md §8).
- **Never move**: the painting inside a level (levels slide, they don't wobble), the colour of a lit area during a held shot.

## 6. Camera grammar

The multiplane camera's vocabulary. Opening and ending come from the topic.

| Move | What it expresses | Can serve |
|---|---|---|
| Push through the levels (foreground parts and slides off frame) | Entering the story, the world opening up | an arrival; "once upon a time"; discovering a hidden place |
| Slow lateral truck with strong parallax | Travel, a world with depth | a journey; a search; a procession |
| Crane down from sky to a window's glow | From the world to one life | introducing a home; night falling; a scale reveal |
| Locked medium shot, pool of light | Performance, intimacy | a conversation; a decision; a tender moment |
| Pull back up and away through branches | Leaving, an ending | farewell; time passing; a story closing |
| Rack (focus shifts from foreground level to the acting level) | Looking closer; a reveal behind something | a hidden watcher; a secret; a surprise |

Framing: characters at least a third of the frame height at key acting moments; wide pictorial shots now and then for scale (ANIMATION.md §8). The area behind a face stays simple and close in value. Transitions: a push through a foreground level, a dissolve through light (a glow that blooms and fades into the next scene), a page turn of a painted book for a chapter. Avoid hard digital wipes.

## 7. Sound palette

- **A small studio orchestra of the period**: strings (warm, with portamento in tender moments), woodwinds (flute, oboe, clarinet, bassoon for comedy), French horn, harp, celesta and glockenspiel for magic, a wordless choir ("ah") for wonder; pizzicato and woodwind runs for comic business (lightly Mickey-moused). Original themes only.
- **Foley in the world's materials**: footsteps on moss, wood and stone; a wooden door; cloth; a lantern's creak; wind in leaves; water; birds by time of day; a crackling hearth.
- **Effects sounds are musical**: sparkles and magic in celesta and harp glissandi rather than synth swooshes.
- **Silence**: the forest going quiet before a turn; a held breath.
- **Voices**: warm, natural, spontaneous; a storyteller narrator reads like a bedtime story, never like an announcer.
- **Mix**: spacious, a soft hall on the music, foley close; duck music ~8 dB under voice; −14 LUFS.

## 8. Native moves

- **Through the levels.** The camera pushes through the foreground branches (they blur and part) into the world. *Fits content like:* the start of any story; entering a building, a garden, a memory; zooming into a product's inner workings told as a tale.
- **The light comes on.** A window, a lantern or a candle is lit and the whole painting warms, level by level. *Fits content like:* an idea; a welcome; a family gathering; hope after loss.
- **Effects carry the feeling.** Snow begins to fall, rain turns from drizzle to downpour, fireflies gather, a mist hides a figure. *Fits content like:* a change of season or fortune; grief; magic; a secret.
- **Touch.** Two characters' hands, paws or heads meet, slowly, in a pool of light. *Fits content like:* a reunion; a promise; thanks to a supporter.
- **The storybook page.** The scene settles into a painted page with the text set beside it, and the page turns. *Fits content like:* a chapter break; a moral; an ending.
- **Shadow play.** A drama told by shadows on a lit wall while the camera stays on a watcher. *Fits content like:* a danger off screen; a memory; a fight that's better imagined.

## 9. Pitfalls of the medium

- **Flat cut-out look**: without depth blur, haze and parallax the levels read as paper cut-outs; give every level its depth.
- **Black outlines on soft characters** make them look like stickers on a painting: self-coloured lines, black only for small features.
- **Busy backgrounds behind the action**: detail goes to the edges and the top; behind the faces, quiet close values.
- **Hard cel shading** turns it into anime: soft edge shades only.
- **Over-saturation**: the period's colour is rich but soft; push value contrast, not chroma.
- **Effects that steal the scene**: tears like marbles, sparkles everywhere. Fewer, smaller, subordinate.
- **A wobbly painting**: levels must slide as rigid paintings; any boil belongs to the cels only.
- **Stepped camera**: camera and anything it carries on ones.

## 10. Engine

In `demo/`: `paint.js` (`wash(ctx, poly, colour, {alpha, edge, gran, seed})` the watercolour wash with edge darkening and granulation; `bloomSpot`; `dryBrush(ctx, from, to, colour)`; `gouache(ctx, poly, colour)`; `level(w, h, scale, paintFn)` caches a painted level), `cel.js` (`cel(ctx, shapes, light)` fills, self-coloured lines and blend shades for a character built from paths), `light.js` (`glow`, `shaft`, `haze` passes), `frame.js` (the style frame: a small mole with a lantern on a forest path at dusk, five levels and fireflies). Camera: one world → screen function per level with its parallax factor. Animate with `core/anim.js`. Minimal use, something not in the frame: two `level()`s (a dark window frame in front, a snowy village behind) and a slow push that blurs the window frame as it slides out.

## 11. Variation space

The film decides: the season and the light, the colour key per sequence, how many levels, the cast, the narrator, the orchestra's colour.

- Structures: **the bedtime story** (a narrator reads; the book's pages open into scenes and close again); **the journey through the seasons** (one character, one path, four lights); **the gathering** (one by one the lights of a village come on as characters arrive for one event).
- Openings: **through the branches** (a push through dark foreground into a glade); **the book opens** (a painted cover, then the first page becomes the world); **a single light** (darkness, one window lit, crane down).
- Endings: **pull up and away** (through the branches to the stars); **the lights go out** (one by one, the last one a candle blown out after a thank-you); **the page turns** (the scene settles into a painted page, the book closes).

---

How our style frame was made: [DEMO.md](DEMO.md). There is no demo film yet.
