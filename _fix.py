# -*- coding: utf-8 -*-
import io
PATH = r"public\creator-studio.html"
with io.open(PATH, "r", encoding="utf-8", newline="") as f:
    c = f.read()

c = c.replace("window.TL3_LP_Opus", "window.TL3_LP_FLAC")
c = c.replace("TL3_LP_Opus", "TL3_LP_FLAC")

with io.open(PATH, "w", encoding="utf-8", newline="") as f:
    f.write(c)
print("OK")
