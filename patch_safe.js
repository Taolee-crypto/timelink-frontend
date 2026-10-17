const fs = require('fs');
const path = 'C:\\Users\\win11\\Desktop\\timelink-frontend\\public\\tl3.js';
let src = fs.readFileSync(path, 'utf8');

// 1. 기존 패치 잔재 제거 (혹시 남아있을 경우)
src = src.replace(/\/\/ TL3_PAUSE_FIX.*?\n/g, '');
src = src.replace(/if \(audioEl && audioEl\.paused.*?\{.*?return;.*?\}/gs, '');
src = src.replace(/if \(_tlAudio && _tlAudio\.paused.*?\{.*?return;.*?\}/gs, '');

// 2. _next 함수 찾기 (줄바꿈 호환성을 위해 정규식 사용)
const nextRegex = /(async function _next\(\)\s*\{\s*if\s*\(stopped\)\s*return;)/;
if (nextRegex.test(src)) {
    const injection = `
          // 안전한 중단 패치
          if (window._tl3_force_stopped) return;
          if (typeof _tlAudio !== 'undefined' && _tlAudio && _tlAudio.paused && !_tlAudio.ended && _tlAudio.currentTime > 0) {
            console.log('[TL3.playStream] Paused - _next stop');
            return;
          }`;
    src = src.replace(nextRegex, `$1${injection}`);
    console.log('[O] _next 함수에 안전한 중단 로직 삽입 완료');
} else {
    console.log('[X] _next 함수를 찾지 못했습니다.');
}

// 3. stopPlay / _tl3Stop 래핑
// playStream 함수 내에서 _tlAudio가 정의된 직후에 적용
// (간단하게 전역에 이벤트 리스너를 다는 방식으로 안전하게 처리)
const playStreamRegex = /(function playStream\(.*?\)\s*\{)/;
if (playStreamRegex.test(src) && !src.includes('_tl3_stop_fix_installed')) {
    const wrapper = `
    // _tl3_stop_fix_installed
    if (typeof _tlAudio !== 'undefined' && _tlAudio && !_tlAudio._originalPause) {
        _tlAudio._originalPause = _tlAudio.pause;
        _tlAudio.pause = function() {
            window._tl3_force_stopped = true;
            return _tlAudio._originalPause.apply(this, arguments);
        };
        _tlAudio._originalPlay = _tlAudio.play;
        _tlAudio.play = function() {
            window._tl3_force_stopped = false;
            return _tlAudio._originalPlay.apply(this, arguments);
        };
    }`;
    src = src.replace(playStreamRegex, `$1${wrapper}`);
    console.log('[O] playStream 시작 부분에 pause/play 래핑 완료');
}

fs.writeFileSync(path, src, 'utf8');
console.log('[O] tl3.js 패치 저장 완료');
