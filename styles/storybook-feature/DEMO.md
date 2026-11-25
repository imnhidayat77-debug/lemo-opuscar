# Golden-Age Storybook — our style frame

One example among many. Don't reuse its story, arc, shots, props or timings.

**There is no demo film yet.** This style ships with a style frame only: `demo/stills/styleframe.jpg`, rendered from the real drawing code in [`demo/`](demo/). It proves the look and the engine; the first film made in the style should be judged against [`STYLE.md`](STYLE.md), and becomes the demo once it's good.

Style frame: *The Lantern Path* · `demo/stills/styleframe.jpg` (t = 3 s) · source in [`demo/`](demo/)

## Story & structure

At dusk a small mole in a green scarf walks a forest path with a lantern; fireflies rise from the grass. The narrator's line sets the tale.

## Shots

A slow multiplane push (zoom +5 %, drift left) over five levels: sky (parallax 0.2, blur 2.2), far trees (0.45, 1.4), the glade (0.8), the acting level (1.0), dark foreground ferns and branches (1.45, blur 7). Style frame at t = 3 s.

## Score structure

None yet (no film). The sound palette is in STYLE.md §7.

## Palette & props

Sky `#56628c` → `#e2b394` → `#f3d6ad`; far trees `#4d6274`; banks `#4f6447`; path `#d2ad7c`; trunks `#4e4040`; foreground `#141826`. The mole: fur `#8a7a86`, belly `#c8b3a9`, paws and nose `#e9a39a`, scarf `#6f9a6a`; lantern glow `#ffd27a`.

## End card

None (no film).

## Build notes

`sh styles/storybook-feature/demo/build.sh` fetches the fonts, renders the style frame to `demo/stills/styleframe.jpg` and a strip of stills across the shot to `demo/out/strip.jpg`. Needs only the core tier.

Files: `paint.js` (`wash` with wet-in-wet blotches, pooled edge and granulation; `wobble`; `gouache`; `dryBrush`; `bloomSpot`; `level`), `cel.js` (`cel` fills with self-coloured lines and a blend shade away from the light; `shade`), `light.js` (`glow`, `shaft`, `haze`), `frame.js` (the levels, the mole, the composite), `index.html`.

Pitfalls met while building it: Washes built from few polygon points read as low-poly shapes: `wobble` resamples every 8 px with two octaves of noise, and tree blobs use 48 points. Levels are painted once in `build()` (about a second); never repaint them per frame.
