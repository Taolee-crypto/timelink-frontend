const fs = require('fs');
const path = 'C:\\Users\\win11\\Desktop\\timelink-frontend\\public\\tl3.js';
let lines = fs.readFileSync(path, 'utf8').split(/\r?\n/);

// 1. playStream 내부의 _next (823줄 근처) 찾기
let targetNextIdx = -1;
for (let i = 700; i < lines.length; i++) {
    if (lines[i].includes('async function _next(){')) {
        // 이 함수가 playStream 내부인지 확인 (앞에 'playStream' 스코프가 있는지)
        targetNextIdx = i;
        // line 700 이후에 있는 첫 번째 _next가 823줄 근처임
        break;
    }
}

if (targetNextIdx === -1) {
    console.error('[X] playStream 내부의 _next를 찾을 수 없습니다.');
    process.exit(1);
}

console.log(`[i] 타겟 _next 위치: line ${targetNextIdx + 1}`);

// 이미 패치가 들어있는지 확인
let hasPatch = false;
for (let i = targetNextIdx; i < targetNextIdx + 5; i++) {
    if (lines[i] && lines[i].includes('TL3_PAUSE_FINAL_STOP')) {
        hasPatch = true; break;
    }
}

if (!hasPatch) {
    // _next 시작 다음 줄에 삽입
    let insertIdx = targetNextIdx + 1;
    if (lines[insertIdx] && lines[insertIdx].includes('if(stopped)')) {
        insertIdx++;
    }

    const inject = [
        '          // TL3_PAUSE_FINAL_STOP: 재생 루프 중단',
        '          if (window._tl3_force_stopped) { return; }',
        '          if (audioEl && audioEl.paused && !audioEl.ended && audioEl.currentTime > 0) {',
        '            console.log("[TL3] Paused - _next stop");',
        '            return;',
        '          }'
    ];
    lines.splice(insertIdx, 0, ...inject);
    console.log(`[O] line ${targetNextIdx + 1} _next 에 중단 로직 삽입 완료`);
} else {
    console.log('[!] 이미 패치가 들어있습니다.');
}

// 2. playStream 내부의 audioEl pause 래핑 (line 732 근처의 잘못된 _tlAudio 래핑 수정)
// 기존 _tlAudio 래핑 코드를 audioEl로 교체
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('_tlAudio.pause = function()')) {
        lines[i] = '            audioEl.pause = function() {';
        console.log(`[O] line ${i+1} _tlAudio.pause → audioEl.pause 로 수정`);
    }
    if (lines[i].includes('_tlAudio.play = function()')) {
        lines[i] = '            audioEl.play = function() {';
        console.log(`[O] line ${i+1} _tlAudio.play → audioEl.play 로 수정`);
    }
    if (lines[i].includes('var _origPause = _tlAudio.pause;')) {
        lines[i] = '            var _origPause = audioEl.pause;';
    }
    if (lines[i].includes('var _origPlay = _tlAudio.play;')) {
        lines[i] = '            var _origPlay = audioEl.play;';
    }
    if (lines[i].includes('if (typeof _tlAudio !== "undefined" && _tlAudio && !_tlAudio._tl_patched)')) {
        lines[i] = '        if (audioEl && !audioEl._tl_patched) {';
    }
    if (lines[i].includes('_tlAudio._tl_patched = true;')) {
        lines[i] = '            audioEl._tl_patched = true;';
    }
}

fs.writeFileSync(path, lines.join('\n'), 'utf8');
console.log('[O] 파일 저장 완료');
