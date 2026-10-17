const fs = require('fs');
const path = 'C:\\Users\\win11\\Desktop\\timelink-frontend\\public\\tl3.js';
let src = fs.readFileSync(path, 'utf8');

// 1. canplay 이벤트 핸들러에서 재생 시작 전 버퍼 확인
// 현재 코드: canplay 도착하면 무조건 play()
// 수정: 버퍼에 최소 3개 세그먼트(약 15초)가 쌓였는지 확인 후 play()

const oldCanplay = `audioEl.addEventListener('canplay', playOnce, { once: true });`;
const newCanplay = `
        // TL3_PREBUFFER_FIX: 버퍼가 충분히 쌓일 때까지 재생 지연
        var _canplayHandler = function() {
            if (audioEl.buffered.length > 0) {
                var bufferedEnd = audioEl.buffered.end(audioEl.buffered.length - 1);
                // 현재 버퍼가 10초 이상이면 재생 시작
                if (bufferedEnd >= 10) {
                    playOnce();
                } else {
                    // 10초가 안 되면 1초 후 다시 확인
                    setTimeout(_canplayHandler, 1000);
                }
            } else {
                setTimeout(_canplayHandler, 1000);
            }
        };
        audioEl.addEventListener('canplay', _canplayHandler, { once: true });`;

if (src.includes(oldCanplay)) {
    src = src.replace(oldCanplay, newCanplay);
    console.log('[O] canplay 핸들러에 10초 Pre-buffering 로직 삽입 완료');
} else {
    console.log('[!] canplay 핸들러를 찾지 못했습니다. 다른 방식 적용');
}

// 2. _next 루프에 버퍼 제어 추가 (이미 있으면 스킵)
if (!src.includes('TL3_BUFFER_WAIT2')) {
    let lines = src.split(/\r?\n/);
    let nextIdx = -1;
    for (let i = 800; i < lines.length; i++) {
        if (lines[i].includes('async function _next(){')) {
            nextIdx = i;
            break;
        }
    }
    if (nextIdx !== -1) {
        const inject = [
            '          // TL3_BUFFER_WAIT2: 버퍼가 10초 이상 앞서면 대기',
            '          if (audioEl && !audioEl.paused) {',
            '            var _buf = audioEl.buffered;',
            '            if (_buf.length > 0) {',
            '              var _bufEnd = _buf.end(_buf.length - 1);',
            '              var _cur = audioEl.currentTime;',
            '              if (_bufEnd - _cur > 10) {',
            '                setTimeout(_next, 500);',
            '                return;',
            '              }',
            '            }',
            '          }'
        ];
        let insertIdx = nextIdx + 1;
        if (lines[insertIdx] && lines[insertIdx].includes('if(stopped)')) insertIdx++;
        lines.splice(insertIdx, 0, ...inject);
        src = lines.join('\n');
        console.log(`[O] line ${nextIdx + 1} _next 에 버퍼 대기(10초) 로직 삽입 완료`);
    }
}

fs.writeFileSync(path, src, 'utf8');
console.log('[O] 파일 저장 완료');
