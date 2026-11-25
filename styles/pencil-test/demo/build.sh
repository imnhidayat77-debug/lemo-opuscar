#!/bin/sh
# Rebuild the style frame from scratch: sh styles/pencil-test/demo/build.sh   (runs from any directory; needs the core tier)
# There is no demo film yet; this renders the style frame and a strip of stills across the shot.
set -e
cd "$(dirname "$0")/../../.."
D=styles/pencil-test/demo
sh $D/tools/fonts.sh                                                     # fonts: not in git (CREDITS names them)
node core/render/still.mjs $D 0.6 --out $D/out --prefix sf_ && cp $D/out/sf_0.6.jpg $D/stills/styleframe.jpg
node core/render/still.mjs $D --range 0:3:0.5 --out $D/out --prefix strip_
.venv/bin/python core/render/sheet.py $D/out/strip.jpg $D/out/strip_*.jpg --cols 4 --w 480
