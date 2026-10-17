# -*- coding: utf-8 -*-
"""tl3-lp-flac.js — FLAC → Opus 인코딩"""
import io, sys

PATH = r"public\tl3-lp-flac.js"
with io.open(PATH, "r", encoding="utf-8", newline="") as f:
    c = f.read()

# codec 'flac' → 'opus' (모든 곳)
c = c.replace("codec: 'flac'", "codec: 'opus'")
c = c.replace("'FLAC 인코딩 미지원", "'Opus 인코딩 미지원")
c = c.replace("FLAC 인코딩", "Opus 인코딩")
c = c.replace("LP FLAC", "LP Opus")
c = c.replace("flac_bytes", "opus_bytes")
c = c.replace("lp-flac-v1", "lp-opus-v1")

# isSupported 함수 수정
OLD_SUPPORT = """  async function isSupported(){
    if(!global.AudioEncoder) return false;
    try {
      var cfg = { codec: 'opus', sampleRate: 44100, numberOfChannels: 2, bitrate: 700000 };
      var r = await AudioEncoder.isConfigSupported(cfg);
      return !!(r && r.supported);
    } catch(e){ return false; }
  }"""

NEW_SUPPORT = """  async function isSupported(){
    if(!global.AudioEncoder) return false;
    try {
      var cfg = { codec: 'opus', sampleRate: 44100, numberOfChannels: 2, bitrate: 128000 };
      var r = await AudioEncoder.isConfigSupported(cfg);
      return !!(r && r.supported);
    } catch(e){ return false; }
  }"""

if OLD_SUPPORT in c:
    c = c.replace(OLD_SUPPORT, NEW_SUPPORT, 1)
    print("OK: isSupported → opus")

# encode cfg 수정
c = c.replace("bitrate: opts.bitrate || 700000", "bitrate: opts.bitrate || 128000")

with io.open(PATH, "w", encoding="utf-8", newline="") as f:
    f.write(c)

print("DONE: tl3-lp-flac.js → Opus")
