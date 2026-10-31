'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const html=fs.readFileSync('public/download.html','utf8');
const base='https://github.com/Taolee-crypto/timelink-app/releases/download/v1.1.8/';
const files={
  dlWin:'TimeLink-Player-Setup-1.1.8-integrated.exe',
  dlMac:'TimeLink-Player-1.1.8-integrated-arm64.dmg',
  dlLinux:'TimeLink-Player-1.1.8-integrated.AppImage',
  dlDeb:'TimeLink-Player-1.1.8-integrated.deb'
};
for(const [id,name] of Object.entries(files)){
  assert.match(html,new RegExp('id="'+id+'"'),'missing OS button '+id);
  assert.ok(html.includes(base+name),'server-rendered integrated link missing: '+name);
  assert.ok(html.includes("name:'"+name+"'"),'JS fallback must keep integrated asset: '+name);
}
assert.ok(html.includes("var RELEASE_TAG = 'v1.1.8';"));
assert.ok(html.includes('LOVE CODE 상호 인식'));
assert.ok(html.includes('파일 TL 실시간 차감'));
assert.ok(html.includes('Player 내부 재생'));
assert.ok(html.includes('실제 청취 1초당 1 TL'));
assert.ok(html.includes('다운로드된 휴대형 TL3의 Player 재생은 계정 로그인에 묶이지 않습니다.'));
for(const stale of [
  'TL3 독립 오프라인 청취권은 아직 제공되지 않습니다.',
  'TL3 V5 온라인 청취권 확인을 위해',
  'v1.1.7',
  'TimeLink-Player-Setup-1.1.8.exe\" id=\"dlWin\"',
  'TimeLink-Player-1.1.8-arm64.dmg\" id=\"dlMac\"'
]) assert.ok(!html.includes(stale),'stale download copy remains: '+stale);
console.log('PASS: v1.1.8 integrated Windows/macOS/Linux direct download page');
