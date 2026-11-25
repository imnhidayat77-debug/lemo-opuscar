# Pencil Test — our style frame

One example among many. Don't reuse its story, arc, shots, props or timings.

**There is no demo film yet.** This style ships with a style frame only: `demo/stills/styleframe.jpg`, rendered from the real drawing code in [`demo/`](demo/). It proves the look and the engine; the first film made in the style should be judged against [`STYLE.md`](STYLE.md), and becomes the demo once it's good.

Style frame: *Sparrow Hop* · `demo/stills/styleframe.jpg` (t = 0.6 s) · source in [`demo/`](demo/)

## Story & structure

A sparrow on the ground crouches, holds the crouch, springs into a stretched take-off, arcs through the air, lands in a squash, overshoots, settles, then looks back at where it was. One action, played as a demonstration of the principles: it is the reference move for this style's acting.

## Shots

One locked frame on the sheet (the animation stand looking straight down). The style frame is t = 0.6 s: the take-off stretch, with the two previous drawings (the held crouch) as onion skin.

## Score structure

None yet (no film). The sound palette is in STYLE.md §7.

## Palette & props

Paper `#efe9dc` with a light-table glow; graphite `#2c2a28`; construction blue `#5f8fcf`; one accent note in red pencil `#c84632` ("hold the crouch!"). Masking tape `rgba(214,196,150,.85)`.

## End card

None (no film).

## Build notes

`sh styles/pencil-test/demo/build.sh` fetches the fonts, renders the style frame to `demo/stills/styleframe.jpg` and a strip of stills across the shot to `demo/out/strip.jpg`. Needs only the core tier.

Files: `pencil.js` (the pencil engine: `stroke`, `blue`, `tone`, `paper`, `pegHoles`, `drawingSeed`, `resample`), `frame.js` (the sparrow rig and the sheet: key poses in `KEYS`, the hop path as an `arc`, tail follow-through with `follow`, `movingHold` on the settle, `blink` on the look back), `index.html`.

Pitfalls met while building it: Short two-point strokes vanish unless resampled (the stroke skips its first and last few % for pressure): `stroke` resamples every path to 5 px. Squash is applied point by point (not with `ctx.scale`) so the pencil width doesn't stretch with the body.
