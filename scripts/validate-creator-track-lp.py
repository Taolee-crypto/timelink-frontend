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
lp_chain_text = lp_chain.read_text(encoding="utf-8")

assert "tl3-manufacture.js" in creator_text, "Creator must load the shared TL3 manufacturing pipeline."
manufacture_text = manufacture.read_text(encoding="utf-8")
v4_player_text = v4_player.read_text(encoding="utf-8")
assert "api/v1/tl3/spine/releases" in manufacture_text, "Creator must manufacture the published TL3 Spine v4 container."
assert "const lpLicense = o.lpLicense || null;" in manufacture_text, "Manufacturer must bind the Creator LP profile before use."
assert "Creator의 LP 효과 분석이 완성되지 않았습니다." in manufacture_text, "Manufacturer must reject incomplete Creator-side LP profiles."
assert "lp: lpLicense && lpLicense.lp_enabled === true" in manufacture_text, "Manufacture result must use the scoped LP profile."
assert "api/v1/tl3/spine/header/" in manufacture_text, "Creator must verify the Track-playable v4 header before completion."
assert "api/v1/tl3/spine/" in manufacture_text and "/verify" in manufacture_text, "Creator must verify the v4 Spine integrity chain."
assert "api/v1/tl3/spine/header/" in v4_player_text, "Track v4 player must consume the published Spine header."
# Current billing policy: exactly 1 TL per audible second, proportionally
# settled by cumulative audible milliseconds. Partial playback is flushed at
# pause/buffering/seek/end/stop boundaries without rounding the final fraction up.
assert "play/meter/" in v4_player_text, "Track v4 player must use the audible-time meter."
assert "queuePlaybackMeter" in v4_player_text and "played_ms" in v4_player_text, "Track v4 player must send cumulative audible milliseconds."
assert "const completedMs=Math.floor(billableMs/1000)*1000;" in v4_player_text, "Track v4 player must meter each completed audible second."
assert "const flushMs=Math.floor(billableMs);" in v4_player_text, "Track v4 player must flush partial audible milliseconds at playback boundaries."
assert "audio._tl3End=async function()" in v4_player_text, "Track v4 player must await final full-track settlement."
# Track now uses a strict one-segment-at-a-time pump. This is a bounded
# prefetch window of 1 and avoids Promise.all batch failures dropping a good
# segment when its sibling request transiently fails.
assert "for(let first=1;first<=N;first++)" in v4_player_text, "Track v4 player must fetch and append segments in order with a bounded prefetch window."
assert "for(let attempt=0;attempt<3&&!segment;attempt++)" in v4_player_text, "Track v4 player must retry transient segment failures without unbounded parallel prefetch."
assert "let meterTimer=null,meterQueue=Promise.resolve(),meterFailed=false,audibleActive=false;" in v4_player_text, "Meter must track actual audible playback state."
assert "sampleAudiblePlayback();" in v4_player_text and "audio.addEventListener('waiting'" in v4_player_text, "Meter must capture elapsed media time before pause/buffering transitions."
assert "const finalMs=Math.floor(totalMs);" in v4_player_text, "Completed tracks must settle the exact authored duration in milliseconds."
assert "const finalSeconds=Math.ceil(totalMs/1000);" not in v4_player_text, "Completed tracks must not round unplayed fractional time up."
assert "segment/confirm/" not in v4_player_text, "Track v4 player must not use retired segment metering."
assert "play/preflight/" in track_text, "Track must check that at least 1 TL is available before playback."
assert "onMeter: function(info)" in track_text, "Track must update the wallet display after each one-second settlement."
assert "await playerAudio._tl3End()" in track_text, "Track must finish final meter settlement before stopping the player."
assert "lpEnhancedToggle" in track_text and "setTL3LpEnhanced" in v4_player_text, "Track LP Enhanced checkbox must control the active audio chain."
assert "segment/confirm/" not in player_text, "Legacy TL3 player must not use retired segment metering."
assert "createMediaElementSource" in lp_chain_text and "AudioWorkletNode" in lp_chain_text, "Love Connect WebAudio routing is incomplete."
assert "restoring native audio" in lp_chain_text and "processor.disconnect()" in lp_chain_text, "LP toggle must restore a single native route if DSP routing fails."

print("Creator → Track LP Enhanced validation passed.")
