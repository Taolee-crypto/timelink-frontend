# -*- coding: utf-8 -*-
"""track.html — 유효하지 않은 파일 ID 에러 유발하는 리다이렉트 로직 제거"""
import io, re, sys

PATH = r"public\track.html"
with io.open(PATH, "r", encoding="utf-8", newline="") as f:
    c = f.read()

# 1. SHARE_ID 선언 및 리다이렉트 로직을 찾아서 깔끔하게 제거
# (기존 initTrack 관련 로직 전체를 제거)
pattern = re.compile(r"// ★ SHARE_ID 선언 및 정석 리다이렉트 처리[\s\S]*?const _VALID_SHARE_ID = SHARE_ID && /\^sh_/\.test\(SHARE_ID\);", re.S)

NEW_INIT = """// ★ SHARE_ID 단순 선언 (리다이렉트 제거)
const SHARE_ID = new URLSearchParams(location.search).get('id');
window.SHARE_ID = SHARE_ID;
const _VALID_SHARE_ID = SHARE_ID && /^sh_/.test(SHARE_ID);"""

if pattern.search(c):
    c = pattern.sub(NEW_INIT, c, count=1)
    print("OK: 리다이렉트 로직 제거 및 SHARE_ID 단순화")
else:
    print("WARN: 기존 리다이렉트 패턴을 찾지 못했습니다. 수동 확인 필요.")

# 2. '유효하지 않은 파일 ID' 문자열 제거
c = c.replace("console.warn('[TRACK] 유효하지 않은 파일 ID:', SHARE_ID);", "")

with io.open(PATH, "w", encoding="utf-8", newline="") as f:
    f.write(c)

print("DONE")
