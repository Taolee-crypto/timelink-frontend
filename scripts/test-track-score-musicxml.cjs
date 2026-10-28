'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../public/track.html'),'utf8');
const start=html.indexOf('function scoreDataToMusicXml(');
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
