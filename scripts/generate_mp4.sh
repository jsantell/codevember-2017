#!/bin/sh
ffmpeg -i $1 \
  -preset veryslow \
  -s 300x300 \
  -movflags +faststart \
  -ss 00:00:01 -t 00:00:01 \
  -an \
  $1.mp4
