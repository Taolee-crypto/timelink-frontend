'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const html=fs.readFileSync('public/track.html','utf8');
const player=fs.readFileSync('public/tl3-v5-player.js','utf8');
assert.ok(!player.includes('onVerifiedScoreAudio'),'retired score hook must not receive licensed decoded MP3 bytes');
assert.ok(!player.includes('[V5 SCORE]'),'retired score analyzer cannot be invoked from playback');
const blocked=[
  'id="scoreBtn"','id="scoreModal"','id="generateV5ScoreDraftBtn"',
  'function loadScore(','function scoreDataToMusicXml(',
  'function generateV5ScoreDraft(','/api/v1/scores/v5/',
  'track-score-worker-v5.js','opensheetmusicdisplay@',
  'vexflow@','🎼 악보 보기','_v5Score','scoreDraftFromLicensedMp3',
  'onVerifiedScoreAudio:'
];
for(const target of blocked)assert.ok(!html.includes(target),'Retired score still present: '+target);
assert.ok(!fs.existsSync('public/track-score-worker-v5.js'));
assert.ok(html.includes('id="lyricsWrap"'),'Independent lyrics are retained');
assert.ok(html.includes('id="tlPlayerBar"'),'TL3 playback is retained');
assert.ok(html.includes('id="copyrightSection"'),'Rights information is retained');
const catalog=JSON.parse(fs.readFileSync('public/docs/development-releases.json','utf8'));
for(const task of catalog.tasks.filter(x=>/^(TLV5-TRACK-(SCORE|AUTO-SCORE|TLD-SERVICE)|TLV5-VOCAL-GATE)/.test(x.id))){
  assert.equal(task.status,'보류','retired catalog status: '+task.id);
  assert.match(task.note,/악보 서비스.*폐기/,'historical note missing: '+task.id);
}
const ledger=fs.readFileSync('public/v5-work-ledger.html','utf8');
for(const id of ['TLV5-FEATURE-TRACK-SCORE','TLV5-TRACK-SCORE-LOCAL-20261029',
  'TLV5-TRACK-TLD-SERVICE-20261029','TLV5-TRACK-AUTO-SCORE-OWNER-20261029',
  'TLV5-TRACK-SCORE-VIEWER-20261029','TLV5-VOCAL-GATE-20261029'])
  assert.ok(ledger.includes("'"+id+"'"), 'retired ledger ID missing '+id);
assert.ok(!ledger.includes("['SCORE','공유 마켓'"),'score feature must not auto-seed');
console.log('PASS: V5 score service absent; TL3/lyrics/rights unchanged; history excluded');
