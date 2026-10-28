'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../public/track.html'),'utf8');
const ledger=fs.readFileSync(path.join(__dirname,'../public/v5-work-ledger.html'),'utf8');
const releases=JSON.parse(fs.readFileSync(path.join(__dirname,'../public/docs/development-releases.json'),'utf8'));
// TRACK must use its existing share ID; never ask listeners to pick/upload another audio file.
assert.ok(html.includes("const r = await fetch(API + \"/api/v1/tl3/score/\" + SHARE_ID);"));
assert.ok(html.includes('id="trackV5ScoreScope"'));
assert.ok(html.includes('음원을 다시 선택하거나 업로드하지 않습니다'));
assert.ok(!html.includes('id="localScoreAudio"'));
assert.ok(!html.includes('id="localScoreChoose"'));
assert.ok(!html.includes('track-score-analyzer.js'));
assert.ok(!html.includes('window.trackScoreLocalReady'));
assert.ok(!fs.existsSync(path.join(__dirname,'../public/track-score-analyzer.js')));
// Do not charge via unverified, non-atomic V3 score payment; not yet V5 TLD.
assert.ok(html.includes("alert('V5 TLD 악보 사용·과금은 준비 중입니다."));
assert.ok(html.includes("alert('정식 TLD 악보 발행·다운로드는 V5 음원"));
assert.ok(html.includes("if(button)button.hidden=true"));
assert.ok(ledger.includes("'TLV5-TRACK-SCORE-LOCAL-20261029'"));
const retired=releases.tasks.find(t=>t.id==='TLV5-TRACK-SCORE-LOCAL-20261029');
assert.ok(retired && retired.title.includes('폐기'));
assert.ok(releases.tasks.some(t=>t.id==='TLV5-TRACK-TLD-SERVICE-20261029'&&t.status==='설계'));
assert.ok(releases.events.some(e=>e.id==='retire-track-local-reupload-20261029'));
console.log('PASS TRACK removes wrong manual audio upload and blocks legacy TLD charges; song-linked V5 work remains pending');
