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
v4_player = ROOT / "public/tl3-v4-player.js"
lp_chain = ROOT / "public/tl3-lp-chain.js"
worklet = ROOT / "public/tl3-lp-worklet.js"
manufacture = ROOT / "public/tl3-manufacture.js"

for required in (creator, track, player, v4_player, lp_chain, worklet, manufacture):
    if not required.is_file():
        raise FileNotFoundError(f"Required current TimeLink file is missing: {required.relative_to(ROOT)}")

for page in (creator, track):
    check_inline(page)

for source in (player, v4_player, lp_chain, worklet, manufacture):
    check_js(source.read_text(encoding="utf-8"), str(source.relative_to(ROOT)))

creator_text = creator.read_text(encoding="utf-8")
track_text = track.read_text(encoding="utf-8")
player_text = player.read_text(encoding="utf-8")

assert "tl3-manufacture.js" in creator_text, "Creator must load the shared TL3 manufacturing pipeline."
manufacture_text = manufacture.read_text(encoding="utf-8")
v4_player_text = v4_player.read_text(encoding="utf-8")
assert "api/v1/tl3/spine/releases" in manufacture_text, "Creator must manufacture the published TL3 Spine v4 container."
assert "api/v1/tl3/spine/header/" in manufacture_text, "Creator must verify the Track-playable v4 header before completion."
assert "api/v1/tl3/spine/" in manufacture_text and "/verify" in manufacture_text, "Creator must verify the v4 Spine integrity chain."
assert "api/v1/tl3/spine/header/" in v4_player_text, "Track v4 player must consume the published Spine header."
assert "segment/confirm/" in v4_player_text, "Track v4 player must settle metered playback segments."
assert "lp-v1" in creator_text, "Creator must preserve LP license metadata."
assert "LP Enhanced" in track_text and "setTL3LpEnhanced" in track_text, "Track LP Enhanced toggle is missing."
lp_chain_text = lp_chain.read_text(encoding="utf-8")
assert "tl3-lp-chain.js" in track_text, "Track must load the shared Love Connect LP engine."
assert "TL3LPChain.create" in v4_player_text and "setTL3LpEnhanced" in v4_player_text, "TL3 v4 player must connect the Creator LP profile to the Track LP engine."
assert "segment/confirm/" in player_text, "Existing TL3 segment confirmation path must remain present."
assert "createMediaElementSource" in lp_chain_text and "AudioWorkletNode" in lp_chain_text, "Love Connect WebAudio routing is incomplete."

print("Creator → Track LP Enhanced validation passed.")
