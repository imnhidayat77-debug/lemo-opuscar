# Story-Sketch Board — our style frame

One example among many. Don't reuse its story, arc, shots, props or timings.

**There is no demo film yet.** This style ships with a style frame only: `demo/stills/styleframe.jpg`, rendered from the real drawing code in [`demo/`](demo/). It proves the look and the engine; the first film made in the style should be judged against [`STYLE.md`](STYLE.md), and becomes the demo once it's good.

Style frame: *The Keeper's Storm* · `demo/stills/styleframe.jpg` (t = 2.5 s) · source in [`demo/`](demo/)

## Story & structure

A storyteller pitches sequence 3 of a lighthouse-keeper's tale: night falls, old Tam climbs the tower, a boat is caught too close to the rocks, he swings the lamp by hand. A second row (the boat turning away, dawn) waits below.

## Shots

A slow push along the first row (zoom 1.42 → 1.52, drifting right), the typed slip carrying the pitcher's line. The fourth sheet is the living sketch: three held poses of the lamp swing, cut, from t = 1.0 s.

## Score structure

None yet (no film). The sound palette is in STYLE.md §7.

## Palette & props

Fibreboard `#8f7f6c` with pin holes; sheets in grey `#a9a49b`, night `#8a93a3` and buff `#c4b393`; pastel yellow `#f2c55c` for the lamp and the beam (its meaning through the sequence), red `#c25a3e` for the boat's sail, blue `#7f97b8` for the storm.

## End card

None (no film).

## Build notes

`sh styles/story-sketch/demo/build.sh` fetches the fonts, renders the style frame to `demo/stills/styleframe.jpg` and a strip of stills across the shot to `demo/out/strip.jpg`. Needs only the core tier.

Files: `board.js` (`board`, `sheet`, `pinned`, `charcoal`, `chalk`, `smudge`, `pastel`), `frame.js` (the six sketches as functions, the layout `ROW1`/`ROW2`, the living sketch `windowSwing(x, pose)`, the camera), `index.html`.

Pitfalls met while building it: Charcoal drawn at sheet size and shown at 0.6× thins out: strokes are drawn 1.7× wider than their nominal width. The sketches in this frame are first-pass drawings; a demo film should push the draughtsmanship (stronger silhouettes, more chalk light) before anything else.
