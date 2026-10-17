# -*- coding: utf-8 -*-
"""tl3.js — canplay 이벤트 무시하고 즉시 강제 재생"""
import io, re, sys

PATH = r"public\tl3.js"
with io.open(PATH, "r", encoding="utf-8", newline="") as f:
    c = f.read()

# 1. appendBuffer 성공 직후 (n=0 일 때) 강제로 재생 시작
OLD_APPEND = """            console.log('[TL3.playStream] ✅ appended segment', n);
            if(window.addDebugLog) window.addDebugLog('✅ 버퍼링 완료 n=' + n);"""
            
NEW_APPEND = """            console.log('[TL3.playStream] ✅ appended segment', n);
            if(window.addDebugLog) window.addDebugLog('✅ 버퍼링 완료 n=' + n);

            // ★ 첫 세그먼트 버퍼링 후 즉시 강제 재생 (canplay 이벤트 무시)
            if (n === 0) {
              console.log('[TL3.playStream] 첫 세그먼트 준비 완료 -> 강제 재생 시도');
              audioEl.play().then(function() {
                console.log('[TL3.playStream] ✅ audio.play() 강제 성공');
              }).catch(function(err) {
                console.log('[TL3.playStream] ❌ 강제 play 실패:', err.name, err.message);
                onError(err);
              });
            }"""

if OLD_APPEND in c:
    c = c.replace(OLD_APPEND, NEW_APPEND, 1)
    print("OK: 첫 세그먼트 후 강제 재생 로직 추가")
else:
    print("WARN: appendBuffer 성공 패턴을 찾지 못했습니다.")

# 2. 기존 canplay 이벤트 로직 비활성화 (중복 재생 방지)
OLD_CANPLAY = """        var playOnce = function(){
          console.log('[TL3.playStream] canplay 도착, play 시작');
          audioEl.play()
            .then(function(){ console.log('[TL3.playStream] ✅ audio.play() 성공'); })
            .catch(function(playErr){
              console.log('[TL3.playStream] ❌ play 실패:', playErr.name, playErr.message);
              onError(playErr);
            });
        };
        if (audioEl.readyState >= 3) {
          playOnce();
        } else {
          audioEl.addEventListener('canplay', playOnce, { once: true });
        }"""

NEW_CANPLAY = """        // ★ canplay 이벤트는 무시하고 appendBuffer 성공 시 강제 재생하도록 변경
        // (기존 canplay 로직 주석 처리)
        /*
        var playOnce = function(){
          console.log('[TL3.playStream] canplay 도착, play 시작');
          audioEl.play()...
        };
        */"""

if OLD_CANPLAY in c:
    c = c.replace(OLD_CANPLAY, NEW_CANPLAY, 1)
    print("OK: 기존 canplay 이벤트 로직 비활성화")
else:
    print("WARN: canplay 로직 패턴을 찾지 못했습니다.")

with io.open(PATH, "w", encoding="utf-8", newline="") as f:
    f.write(c)

print("DONE")
