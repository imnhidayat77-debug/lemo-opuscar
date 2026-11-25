#!/bin/sh
# The fonts this page uses (SIL Open Font License 1.1, named in ../CREDITS) are not kept in git. This fetches each one into
# fonts/ from google/fonts pinned to one commit. Files already there are kept; FORCE=1 fetches them again.
set -e
D=$(cd "$(dirname "$0")/.." && pwd)/fonts; mkdir -p "$D"
GF=https://raw.githubusercontent.com/google/fonts/83c62e30d87daa70216dab6b984d00d20d96d585
get() {
  [ -s "$D/$1" ] && [ -z "$FORCE" ] && return 0
  curl -fsSL -g --retry 2 -o "$D/download.part" "$2" ||
    { rm -f "$D/download.part"; echo "✗ could not fetch fonts/$1 from $2 (offline, or behind a proxy? curl uses https_proxy)" >&2; exit 1; }
  mv "$D/download.part" "$D/$1"; echo "fonts/$1"
}
get Caveat.ttf "$GF/ofl/caveat/Caveat%5Bwght%5D.ttf"
get CourierPrime-Regular.ttf "$GF/ofl/courierprime/CourierPrime-Regular.ttf"
