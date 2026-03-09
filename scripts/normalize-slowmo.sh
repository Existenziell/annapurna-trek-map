#!/usr/bin/env bash
# Normalize iPhone slow-motion videos where only the middle segment is slow.
#
# Usage:
#   ./scripts/normalize-slowmo.sh [OPTIONS] INPUT [INPUT ...]
#
# Options:
#   --slow-start SEC   Start of slow segment in seconds (default: 5)
#   --slow-end SEC     End of slow segment in seconds (default: duration-5)
#   --slow-factor N    Speed-up factor for the slow segment (default: 5; use 4 for 120fps, 8 for 240fps)
#
# Output: each INPUT produces INPUT-normal.mp4 in the same directory. Audio resampled to 44.1kHz.
# Requires: ffmpeg, ffprobe, bc

set -e

SLOW_START=5
SLOW_END=
SLOW_FACTOR=5
INPUTS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --slow-start) SLOW_START="$2"; shift 2 ;;
    --slow-end)   SLOW_END="$2";   shift 2 ;;
    --slow-factor) SLOW_FACTOR="$2"; shift 2 ;;
    *) INPUTS+=("$1"); shift ;;
  esac
done

if [[ ${#INPUTS[@]} -eq 0 ]]; then
  echo "Usage: $0 [--slow-start SEC] [--slow-end SEC] [--slow-factor N] INPUT [INPUT ...]" >&2
  exit 1
fi

for INPUT in "${INPUTS[@]}"; do
  if [[ ! -f "$INPUT" ]]; then
    echo "File not found: $INPUT" >&2
    exit 1
  fi
  DIR=$(dirname "$INPUT")
  BASE=$(basename "$INPUT" .mp4)
  BASE=$(basename "$BASE" .mov)
  OUT="${DIR}/${BASE}-normal.mp4"

  DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$INPUT" 2>/dev/null)
  END=${SLOW_END:-$(echo "$DURATION - 5" | bc)}
  # Clamp slow-end to duration
  END=$(echo "if ($END > $DURATION) $DURATION else $END" | bc)
  if [[ $(echo "$SLOW_START >= $END" | bc) -eq 1 ]]; then
    echo "Skip $INPUT: slow segment would be empty (start=$SLOW_START end=$END)" >&2
    continue
  fi

  echo "Normalizing: $INPUT -> $OUT (slow segment ${SLOW_START}s - ${END}s, factor ${SLOW_FACTOR}x)"

  # Two-stage atempo (smoother than single atempo=4/5; avoids dull/artifact-prone output)
  ATEMPO1=$(echo "scale=4; sqrt(${SLOW_FACTOR})" | bc)
  ATEMPO2=$ATEMPO1
  ATEMPO_CHAIN="atempo=${ATEMPO1},atempo=${ATEMPO2}"

  # Video: trim into 3 parts, speed up middle with setpts. Audio: trim, two-stage atempo, aresample (soxr if available)
  ffmpeg -y -i "$INPUT" \
    -filter_complex "\
[0:v]split=3[v1][v2][v3];\
[v1]trim=start=0:end=${SLOW_START},setpts=PTS-STARTPTS[p1];\
[v2]trim=start=${SLOW_START}:end=${END},setpts=(PTS-STARTPTS)/${SLOW_FACTOR}[p2];\
[v3]trim=start=${END},setpts=PTS-STARTPTS[p3];\
[0:a]asplit=3[a1][a2][a3];\
[a1]atrim=start=0:end=${SLOW_START},asetpts=PTS-STARTPTS[oa1];\
[a2]atrim=start=${SLOW_START}:end=${END},${ATEMPO_CHAIN},asetpts=PTS-STARTPTS[oa2];\
[a3]atrim=start=${END},asetpts=PTS-STARTPTS[oa3];\
[p1][oa1][p2][oa2][p3][oa3]concat=n=3:v=1:a=1[outv][outa];\
[outa]aresample=44100:resampler=soxr[fa]" \
    -map "[outv]" -map "[fa]" -ar 44100 "$OUT"
done

echo "Done."
