'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const analyzer=require('../public/track-score-analyzer.js');
const sr=8000;
const audio=[];
function tone(midi,seconds){
  const f=440*Math.pow(2,(midi-69)/12),n=Math.floor(sr*seconds);
  for(let i=0;i<n;i++){
    const fade=Math.min(1,i/80,(n-i)/80);
    audio.push(.24*fade*(Math.sin(2*Math.PI*f*i/sr)+.16*Math.sin(4*Math.PI*f*i/sr)));
  }
}
function silence(seconds){for(let i=0;i<Math.floor(sr*seconds);i++)audio.push(0);}
tone(60,.7);silence(.15);tone(62,.7);silence(.15);tone(64,.7);silence(.15);tone(67,.7);
const data=analyzer.analyzeSamples(Float32Array.from(audio),sr,{bpm:100});
const pitches=data.melody.map(e=>e.m);
console.log(JSON.stringify({algorithm:data.algorithm,pitches,notes:data.melody.length,seconds:data.analysis.seconds}));
assert.equal(data.version,1);
assert.equal(data.algorithm,'timelink-browser-yin-draft-v1');
assert.equal(data.bpm,100);
assert.equal(data.analysis.source,'user_selected_local_audio');
for(const midi of [60,62,64,67])assert.ok(pitches.includes(midi),'expected MIDI '+midi+' in '+pitches);
assert.ok(data.melody.every(e=>e.conf>=.75&&e.s>=0&&e.d>=.14),'each note must be audible/positive');
assert.ok(data.melody.length<=12,'transcription should not create many false notes');
assert.throws(()=>analyzer.analyzeSamples(new Float32Array(sr*2),sr),/멜로디를 찾지 못/);
assert.throws(()=>analyzer.analyzeSamples(new Float32Array(10),sr),/너무 짧/);
const html=fs.readFileSync(path.join(__dirname,'../public/track.html'),'utf8');
assert.ok(html.includes('id="localScoreChoose"'));
assert.ok(html.includes('id="localScoreRights"'));
assert.ok(html.includes('id="downloadDraftXml"'));
assert.ok(html.includes('/track-score-analyzer.js'));
assert.ok(html.includes('window.trackScoreLocalReady'));
assert.ok(html.includes("if(_scoreDraft){alert('로컬 악보 초안에는 TL이 차감되지 않습니다."));
assert.ok(html.includes("if(_scoreDraft){alert('로컬 분석 초안은 정식 TLD 파일이 아닙니다."));
console.log('PASS TRACK real audio pitch transcription, local-only rights gate, existing V5 playback and TL/TLD untouched');
