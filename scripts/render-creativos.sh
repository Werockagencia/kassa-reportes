#!/usr/bin/env bash
# Renderiza los creativos HTML a PNG (Chrome headless) y arma el Reel con ffmpeg.
# Uso: bash scripts/render-creativos.sh   (desde la raíz del repo)
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/creativos/E2-nuevos/src/creativos.html"
OUT="$ROOT/creativos/E2-nuevos/png"
CHROME="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
mkdir -p "$OUT"
URL="file:///$(cygpath -m "$SRC" 2>/dev/null || echo "$SRC")"

shot () { # id ancho alto nombre
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
    --virtual-time-budget=6000 --window-size="$2,$3" \
    --screenshot="$(cygpath -w "$OUT/$4.png" 2>/dev/null || echo "$OUT/$4.png")" "$URL#$1" >/dev/null 2>&1
  echo "ok $4"
}

[ -n "$ONLY_REEL" ] || {
shot A1 1080 1350 E2-A-carrusel-01
shot A2 1080 1350 E2-A-carrusel-02
shot A3 1080 1350 E2-A-carrusel-03
shot A4 1080 1350 E2-A-carrusel-04
shot A5 1080 1350 E2-A-carrusel-05
shot B45 1080 1350 E2-B-tipologias-4x5
shot B916 1080 1920 E2-B-tipologias-9x16
shot C45 1080 1350 E2-C-familia-4x5
shot C916 1080 1920 E2-C-familia-9x16
}
for i in 1 2 3 4 5 6; do shot D$i 1080 1920 _reel-frame-$i; done

# Reel 9:16 · 6 escenas x 2.5s con zoom lento + crossfade
cd "$OUT"
args=(); filt=""; n=6; d=2.5
for i in $(seq 1 $n); do
  args+=(-i "_reel-frame-$i.png")
  filt+="[$((i-1)):v]scale=1188:2112,zoompan=z='min(zoom+0.0009,1.08)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=75:s=1080x1920:fps=30,setsar=1[v$i];"
done
prev="v1"; off=$d
for i in $(seq 2 $n); do
  filt+="[$prev][v$i]xfade=transition=fade:duration=0.4:offset=$off[x$i];"
  prev="x$i"; off=$(awk "BEGIN{print $off+$d}")
done
ffmpeg -v error -y "${args[@]}" -filter_complex "${filt%;}" -map "[$prev]" -c:v libx264 -pix_fmt yuv420p -r 30 -movflags +faststart E2-D-reel-9x16.mp4
echo "ok reel"
rm -f _reel-frame-*.png
