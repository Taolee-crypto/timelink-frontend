#!/usr/bin/env python3
"""Validate the current Creator -> TL3 Track LP Enhanced source files."""
from html.parser import HTMLParser
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]

class InlineScripts(HTMLParser):
    def __init__(self):
        super().__init__()
        self.items = []
        self.active = False
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag == "script" and not any(k.lower() == "src" for k, _ in attrs):
            self.active = True
            self.parts = []

    def handle_data(self, data):
        if self.active:
            self.parts.append(data)

    def handle_endtag(self, tag):
        if tag == "script" and self.active:
            self.items.append("".join(self.parts))
            self.active = False

def check_js(source, label):
    with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8") as f:
        f.write(source)
        f.flush()
        subprocess.run(["node", "--check", f.name], check=True)
    print(f"OK JavaScript: {label}")

def check_inline(path):
    parser = InlineScripts()
    parser.feed(path.read_text(encoding="utf-8"))
    for index, source in enumerate(parser.items, 1):
        if source.strip():
            check_js(source, f"{path.relative_to(ROOT)} inline #{index}")

creator = ROOT / "public/creator.html"
track = ROOT / "public/track.html"
player = ROOT / "public/tl3.js"
audio = ROOT / "public/tl3-audio-lp-enhanced.js"
worklet = ROOT / "public/tl3-lp-worklet.js"
manufacture = ROOT / "public/tl3-manufacture.js"

for required in (creator, track, player, audio, worklet, manufacture):
    if not required.is_file():
        raise FileNotFoundError(f"Required current TimeLink file is missing: {required.relative_to(ROOT)}")

for page in (creator, track):
    check_inline(page)

for source in (player, audio, worklet, manufacture):
    check_js(source.read_text(encoding="utf-8"), str(source.relative_to(ROOT)))

creator_text = creator.read_text(encoding="utf-8")
track_text = track.read_text(encoding="utf-8")
player_text = player.read_text(encoding="utf-8")
audio_text = audio.read_text(encoding="utf-8")

assert "tl3-manufacture.js" in creator_text, "Creator must load the shared TL3 manufacturing pipeline."
assert "api/v1/tl3/header/" in manufacture.read_text(encoding="utf-8"), "Creator must verify the Track-playable public header before completion."
assert "api/v1/tl3/spine/releases" not in manufacture.read_text(encoding="utf-8"), "Unpublished Spine archive must not block the production v3 Creator-to-Track path."
assert "lp-v1" in creator_text, "Creator must preserve LP license metadata."
assert "LP Enhanced" in track_text and "setTL3LpEnhanced" in track_text, "Track LP Enhanced toggle is missing."
assert "tl3-audio-lp-enhanced.js" in track_text, "Track must load the independent LP Enhanced connector."
assert "TL3Audio.attach" in player_text and "setTL3LpEnhanced" in player_text, "TL3 player/controller bridge is missing."
assert "segment/confirm/" in player_text, "Existing TL3 segment confirmation path must remain present."
assert "createMediaElementSource" in audio_text and "AudioWorkletNode" in audio_text, "LP Enhanced WebAudio routing is incomplete."

print("Creator → Track LP Enhanced validation passed.")
