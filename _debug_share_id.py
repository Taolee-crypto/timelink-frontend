# -*- coding: utf-8 -*-
"""track.html — SHARE_ID 확인용 로그 강제 삽입"""
import io, sys

PATH = r"public\track.html"
with io.open(PATH, "r", encoding="utf-8", newline="") as f:
    c = f.read()

# loadTrack 함수 시작 부분에 SHARE_ID 로그 삽입
OLD_FETCH = "const r = await fetch(API + '/api/shares/' + SHARE_ID"
NEW_FETCH = """console.log('🚨 [TRACK] 실제 요청 SHARE_ID:', SHARE_ID);
  const r = await fetch(API + '/api/shares/' + SHARE_ID"""

if OLD_FETCH in c:
    c = c.replace(OLD_FETCH, NEW_FETCH)
    print("OK: SHARE_ID 확인용 로그 추가")

# 충전 API 호출부에도 로그 추가
OLD_CHARGE = "fetch(API+'/api/shares/'+window.SHARE_ID+'/charge',{"
NEW_CHARGE = "console.log('🚨 [CHARGE] 충전 요청 SHARE_ID:', window.SHARE_ID); fetch(API+'/api/shares/'+window.SHARE_ID+'/charge',{"

if OLD_CHARGE in c:
    c = c.replace(OLD_CHARGE, NEW_CHARGE)
    print("OK: 충전 요청 SHARE_ID 확인용 로그 추가")

with io.open(PATH, "w", encoding="utf-8", newline="") as f:
    f.write(c)

print("DONE")
