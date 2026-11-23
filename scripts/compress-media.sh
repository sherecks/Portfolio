#!/usr/bin/env bash
# Recomprime originals/*.mp4 -> public/media/<slug>.mp4 (+ poster .webp). Uso: bash scripts/compress-media.sh
set -u
SRC="originals"; OUT="public/media"; mkdir -p "$OUT"
# vídeos que mantêm áudio (videomaker); o resto vira loop mudo
KEEP_AUDIO="apresentacao-leonardo apresentacao-ronaldo expo ecatarina"
for f in "$SRC"/*.mp4; do
  name=$(basename "$f" .mp4); slug=$(echo "$name" | tr 'A-Z ' 'a-z-')
  w=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$f")
  h=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$f")
  if [ "$w" -gt "$h" ]; then scale="scale=1280:-2"; else scale="scale=-2:1280"; fi
  audio="-an"; case " $KEEP_AUDIO " in *" $name "*) audio="-c:a aac -b:a 96k";; esac
  ffmpeg -v error -y -err_detect ignore_err -i "$f" -vf "$scale,fps=30" -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart $audio "$OUT/$slug.mp4"
  ffmpeg -v error -y -ss 1 -i "$OUT/$slug.mp4" -frames:v 1 -vf "scale=640:-2" -c:v libwebp -quality 72 "$OUT/$slug.webp"
  echo "$slug $(du -h "$OUT/$slug.mp4" | cut -f1) $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/$slug.mp4")s"
done
cp "$SRC"/*.webp "$SRC"/favicon.png "$OUT"/ 2>/dev/null
for i in "$SRC"/*.webp; do n=$(basename "$i" | tr 'A-Z ' 'a-z-'); [ "$(basename "$i")" != "$n" ] && mv "$OUT/$(basename "$i")" "$OUT/$n"; done
echo DONE
