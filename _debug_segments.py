# -*- coding: utf-8 -*-
"""tl3.js — 세그먼트 다운로드 상태 로깅 강화"""
import io, sys

PATH = r"public\tl3.js"
with io.open(PATH, "r", encoding="utf-8", newline="") as f:
    c = f.read()

OLD = """        console.log('[TL3.playStream] ✅ appended segment', n);"""
NEW = """        console.log('[TL3.playStream] ✅ appended segment', n);
            if (n === 5) {
              console.log('--- 5개 세그먼트 버퍼링 완료, 계속 진행 중 ---');
            }"""

if OLD in c:
    c = c.replace(OLD, NEW, 1)
    print("OK: 세그먼트 다운로드 로그 추가")

with io.open(PATH, "w", encoding="utf-8", newline="") as f:
    f.write(c)

print("DONE")
