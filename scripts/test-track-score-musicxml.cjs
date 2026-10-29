'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../public/track.html'),'utf8');
const start=html.indexOf('function scoreVocalNotationProfile(');
const end=html.indexOf('// ── OSMD 렌더링',start);
assert.ok(start>0&&end>start,'MusicXML routines present');
const context={Date,result:null};
const data={bpm:120,time_signature:'4/4',key:{tonic:'C',mode:'major'},melody:[{s:0,d:3,m:60},{s:3.2,d:.5,m:62},{s:3.8,d:1.1,m:64}],chords:[]};
context.input=data;
vm.runInNewContext(html.slice(start,end)+';result=scoreDataToMusicXml(input,0,{title:"Track test",artist:"test"});',context);
const xml=context.result;
assert.ok(xml.startsWith('<?xml'));
assert.match(xml,/<score-partwise version="4.0">/);
assert.match(xml,/<tie type="start"\/>/);
assert.match(xml,/<tie type="stop"\/>/);
const measures=[...xml.matchAll(/<measure number="\d+">([\s\S]*?)<\/measure>/g)];
assert.ok(measures.length>=2,'long notes split into measures');
for(const measure of measures){
 const durations=[...measure[1].matchAll(/<duration>(\d+)<\/duration>/g)].map(m=>Number(m[1]));
 const total=durations.reduce((a,b)=>a+b,0);
 assert.ok(total<=16&&total>0,'4/4 measure must never overrun: '+total);
 assert.ok(durations.every(x=>[1,2,4,8,16].includes(x)),'only standard note lengths');
}
assert.ok(measures[0][1].includes('<duration>16</duration>'));
assert.ok(xml.includes('<step>C</step>')&&xml.includes('<step>D</step>'));
console.log('PASS TRACK MusicXML: proper 4/4 measures, note durations and long-note ties');


// Low-register male vocal: use a standard G8vb tenor clef, not hundreds
// of ledger lines. Keep the REAL MIDI pitch in the source and MusicXML.
const tenor={melody:[{s:0,d:.5,m:55,lyric:'그대'},{s:.5,d:.5,m:58,lyric:'에게'},{s:1,d:1,m:60}],
  chords:[{s:0,e:2,sym:'G'},{s:2,e:4,sym:'D7'}]};
const another={result:null,input:tenor,Date};
vm.runInNewContext(html.slice(start,end)+';result=scoreDataToMusicXml(input,0,{title:"길 끝에서"});',another);
assert.match(another.result,/<clef-octave-change>-1<\/clef-octave-change>/,
  'real tenor should be engraved with down-octave treble clef');
assert.match(another.result,/<step>G<\/step>[\s\S]*?<octave>3<\/octave>/,
  'engraving must never invent or change actual pitch/octave');
assert.doesNotMatch(another.result,/<metronome>/,
  'unverified tempo must not be advertised as real 120 BPM');
assert.match(another.result,/<lyric number="1">/,'creator syllables must appear under notes');
assert.match(another.result,/<harmony>/,'known guitar chords should be on staff');
const bass={result:null,input:{bpm:90,melody:[{s:0,d:1,m:43},{s:1,d:1,m:46},{s:2,d:1,m:47}]},Date};
vm.runInNewContext(html.slice(start,end)+';result=scoreDataToMusicXml(input,0,{title:"Bass"});',bass);
assert.match(bass.result,/<clef><sign>F<\/sign><line>4<\/line><\/clef>/,
  'actual low register should choose bass clef');
assert.match(bass.result,/<per-minute>90<\/per-minute>/,'known tempo is retained');
const grouped={result:null,input:{bpm:120,melody:[
  {s:0,d:.21,m:60,lyric:'나'}, {s:.21,d:.20,m:60}, {s:.5,d:.45,m:62,lyric:'너'},
  {s:1,d:.75,m:64,lyric:'우리'}
]},Date};
vm.runInNewContext(html.slice(start,end)+';result=scoreDataToMusicXml(input,0,{title:"Rhythm"});',grouped);
assert.equal((grouped.result.match(/<lyric number="1">/g)||[]).length,3,
  'split repeated-pitch sound should not cause extra syllables or notes');
const groupedNotes=[...grouped.result.matchAll(/<pitch>[\s\S]*?<\/pitch>[\s\S]*?<duration>(\d+)<\/duration>/g)];
assert.ok(groupedNotes.length<=6,'adjacent short segments should be readable, not a stream of jitter');
assert.match(grouped.result,/<dot\/>/,'dotted note durations require MusicXML dot notation');
assert.equal(grouped.input.melody[0].d,.21,'source event duration must not be mutated');
console.log('PASS TLD-compatible human-readable notation: tenor/bass clef, 8th grid, lyric, chord, no false BPM');
