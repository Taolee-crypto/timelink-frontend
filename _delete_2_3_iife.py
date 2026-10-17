# -*- coding: utf-8 -*-
"""tl3.js — 2nd, 3rd IIFE 삭제 (1st IIFE만 유지)"""
import io, sys, re

PATH = r"public\tl3.js"
with io.open(PATH, "r", encoding="utf-8", newline="") as f:
    c = f.read()

# 2nd IIFE 시작 찾기
m2_start = re.search(r'\n\(function \(global\) \{\n  [\'"]use strict[\'"];', c)
if not m2_start:
    print("ERROR: 2nd IIFE 시작 못 찾음")
    sys.exit(1)

# 3rd IIFE 끝 (마지막 })(window);)
idx_3rd_end = c.rfind('})(window);')
if idx_3rd_end == -1:
    print("ERROR: 3rd IIFE 끝 못 찾음")
    sys.exit(1)
idx_3rd_end += len('})(window);')

print(f"삭제 범위: {m2_start.start()} ~ {idx_3rd_end}")
print(f"삭제 문자 수: {idx_3rd_end - m2_start.start()}")

c = c[:m2_start.start()] + '\n/* DELETED: 2nd, 3rd IIFE (1st IIFE만 유지) */\n' + c[idx_3rd_end:]

with io.open(PATH, "w", encoding="utf-8", newline="") as f:
    f.write(c)

print("DONE")
