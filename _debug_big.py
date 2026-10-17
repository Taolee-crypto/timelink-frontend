# -*- coding: utf-8 -*-
"""track.html & tl3.js — 화면 디버그 패널 강제 삽입"""
import io, sys

# ==========================================
# 1. track.html 에 디버그 패널 띄우기
# ==========================================
PATH1 = r"public\track.html"
with io.open(PATH1, "r", encoding="utf-8", newline="") as f:
    c1 = f.read()

DEBUG_PANEL = """
<!-- ★ 디버그 패널 강제 삽입 -->
<div id="debugPanel" style="position:fixed;top:10px;right:10px;z-index:9999;background:rgba(0,0,0,0.85);color:#0f0;font-family:monospace;font-size:12px;padding:10px;border-radius:8px;max-width:400px;max-height:80vh;overflow-y:auto;pointer-events:none;box-shadow:0 0 10px rgba(0,0,0,0.5)">
  <div style="font-weight:bold;margin-bottom:5px;color:#fff">🛠 오디오 디버그</div>
  <div id="debugLog">대기 중...</div>
</div>
<script>
window.addDebugLog = function(msg) {
  const el = document.getElementById('debugLog');
  if(el) {
    el.innerHTML += '<br>' + msg;
    el.scrollTop = el.scrollHeight;
  }
};
</script>
"""

if 'id="debugPanel"' not in c1:
    c1 = c1.replace("<body>", "<body>\n" + DEBUG_PANEL, 1)
    print("OK: track.html에 디버그 패널 삽입")

# ==========================================
# 2. tl3.js 의 _next 루프에 디버그 로그 삽입
# ==========================================
PATH2 = r"public\tl3.js"
with io.open(PATH2, "r", encoding="utf-8", newline="") as f:
    c2 = f.read()

# _next 루프 시작점에 디버그 로그
OLD_LOOP = """        async function _next(){
          // ★ 세션 중단 확인 (더 엄격하게)
          if(stopped || !ms || ms.readyState === 'closed' || !sb || !ms.sourceBuffers || ms.sourceBuffers.length === 0) {
            console.log('[TL3.playStream] 세션 중단됨 -> 루프 종료');
            return;
          }"""

NEW_LOOP = """        async function _next(){
          if(window.addDebugLog) window.addDebugLog('▶ _next 시작 n=' + n);
          // ★ 세션 중단 확인 (더 엄격하게)
          if(stopped || !ms || ms.readyState === 'closed' || !sb || !ms.sourceBuffers || ms.sourceBuffers.length === 0) {
            console.log('[TL3.playStream] 세션 중단됨 -> 루프 종료');
            if(window.addDebugLog) window.addDebugLog('❌ 세션 중단 감지 -> 루프 종료');
            return;
          }"""

if OLD_LOOP in c2:
    c2 = c2.replace(OLD_LOOP, NEW_LOOP, 1)
    print("OK: tl3.js _next 시작 부분 디버그 로그 추가")

# appendBuffer 성공 후 로그
OLD_APPEND = """            console.log('[TL3.playStream] ✅ appended segment', n);"""

NEW_APPEND = """            console.log('[TL3.playStream] ✅ appended segment', n);
            if(window.addDebugLog) window.addDebugLog('✅ 버퍼링 완료 n=' + n);"""

if OLD_APPEND in c2:
    c2 = c2.replace(OLD_APPEND, NEW_APPEND, 1)
    print("OK: tl3.js appendBuffer 성공 로그 추가")

# 에러 발생 시 디버그 로그
OLD_CATCH = """        } catch(e){
          console.error('[TL3.playStream] ❌ _next CATCH 에러:', e);"""

NEW_CATCH = """        } catch(e){
          console.error('[TL3.playStream] ❌ _next CATCH 에러:', e);
          if(window.addDebugLog) window.addDebugLog('❌ 에러: ' + e.message);"""

if OLD_CATCH in c2:
    c2 = c2.replace(OLD_CATCH, NEW_CATCH, 1)
    print("OK: tl3.js 에러 로그 추가")

with io.open(PATH1, "w", encoding="utf-8", newline="") as f:
    f.write(c1)
with io.open(PATH2, "w", encoding="utf-8", newline="") as f:
    f.write(c2)

print("DONE")
