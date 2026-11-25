# Xerox Line '60s — our style frame

One example among many. Don't reuse its story, arc, shots, props or timings.

**There is no demo film yet.** This style ships with a style frame only: `demo/stills/styleframe.jpg`, rendered from the real drawing code in [`demo/`](demo/). It proves the look and the engine; the first film made in the style should be judged against [`STYLE.md`](STYLE.md), and becomes the demo once it's good.

Style frame: *Morning Walk* · `demo/stills/styleframe.jpg` (t = 1.2 s) · source in [`demo/`](demo/)

## Story & structure

Rufus, a long-eared hound, nose to the pavement, tows his owner down a 1960s street past a bakery. The owner leans back, arm pulled straight, brows up.

## Shots

One locked wide shot of the street (a tableau). The hound walks on twos with `walk()`; ears drag with `follow()`; the owner holds a braced pose with a breath. Style frame at t = 1.2 s.

## Score structure

None yet (no film). The sound palette is in STYLE.md §7.

## Palette & props

Paper `#f2ead8`; mustard `#d4a43a`, brick `#b4553b`, teal `#3d7f7a`, olive `#8c8a4b`, slate `#5d6a78`, pale window yellow `#f6d98a`; line `#151312`. The hound tan `#c98a4b` with a brown saddle `#6b4a35` (no black areas), the owner's coat brick.

## End card

None (no film).

## Build notes

`sh styles/xerox-line/demo/build.sh` fetches the fonts, renders the style frame to `demo/stills/styleframe.jpg` and a strip of stills across the shot to `demo/out/strip.jpg`. Needs only the core tier.

Files: `xline.js` (`xline`, `fillClean`, `patch`, `hatch`, `paper`, `resample`), `frame.js` (`background()` drawn once; `hound()` and `owner()` painted inside their lines and reseeded per drawing), `index.html`.

Pitfalls met while building it: The owner's hand is placed along the line from his shoulder to the dog's collar at arm's length; placing it relative to the dog stretched the arm across half the frame. The tree crown is a single scribble path: fewer, rounder loops read better than many.
