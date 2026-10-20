#!/usr/bin/env python3
"""Validate the V5-only Creator -> Track TL3 pipeline."""
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
legacy_player = ROOT / "public/tl3.js"
v5_player = ROOT / "public/tl3-v5-player.js"
lp_chain = ROOT / "public/tl3-lp-chain.js"
worklet = ROOT / "public/tl3-lp-worklet.js"
manufacture = ROOT / "public/tl3-manufacture.js"

for required in (creator, track, legacy_player, v5_player, lp_chain, worklet, manufacture):
    if not required.is_file():
        raise FileNotFoundError(f"Required TimeLink file is missing: {required.relative_to(ROOT)}")

for page in (creator, track):
    check_inline(page)

for source in (legacy_player, v5_player, lp_chain, worklet, manufacture):
    check_js(source.read_text(encoding="utf-8"), str(source.relative_to(ROOT)))

creator_text = creator.read_text(encoding="utf-8")
track_text = track.read_text(encoding="utf-8")
manufacture_text = manufacture.read_text(encoding="utf-8")
v5_text = v5_player.read_text(encoding="utf-8")
lp_chain_text = lp_chain.read_text(encoding="utf-8")

assert "tl3-manufacture.js" in creator_text
assert "api/v1/tl3/v5/manufacture" in manufacture_text
assert "api/v1/tl3/v5/verify/" in manufacture_text
assert "api/v1/tl3/v5/resolve/" in manufacture_text
assert "TL3V5Player.canPlay" in track_text and "TL3V5Player.playStream" in track_text
assert "TL3V4Player" not in track_text
assert "tl3-v4-player.js" not in track_text
assert "api/v1/tl3/play/preflight/" not in track_text
assert "api/v1/tl3/spine/" not in track_text
assert "TL3-V5" in v5_text and "decryptContainer" in v5_text
assert "api/v1/tl3/v5/session-license/" in v5_text
assert "api/v1/tl3/v5/container/" in v5_text
assert "play/meter/" in v5_text and "played_ms" in v5_text
assert "audio._tl3End=async function()" in v5_text
assert "createMediaElementSource" in lp_chain_text and "AudioWorkletNode" in lp_chain_text
assert "restoring native audio" in lp_chain_text and "processor.disconnect()" in lp_chain_text

print("Creator -> Track TL3 V5-only validation passed.")
