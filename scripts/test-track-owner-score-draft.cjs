'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../public/track-score-worker-v5.js'),'utf8');
const output=[];
const sandbox={self:{postMessage:x=>output.push(x)},Float32Array,Array,Math,Number,Error,console};
vm.runInNewContext(source,sandbox);
const sr=8000,values=[];
for(const midi of [60,62,64,67]){
 const freq=440*2**((midi-69)/12),n=Math.floor(sr*.68);
 for(let i=0;i<n;i++){
   const fade=Math.max(0,Math.min(1,i/240,(n-i-1)/240));
   values.push(.24*fade*Math.sin(2*Math.PI*freq*i/sr));
 }
 for(let i=0;i<sr*.16;i++)values.push(0);
}
const sourceAudio=Float32Array.from(values);
sandbox.self.onmessage({data:{samples:sourceAudio.buffer,sampleRate:sr,bpm:92}});
assert.equal(output.length,1);
assert.equal(output[0].ok,true,JSON.stringify(output[0]));
const notes=output[0].score.melody;
console.log(JSON.stringify({pitches:notes.map(x=>x.m),length:notes.length,duration:output[0].score.analysis.seconds}));
for(const m of [60,62,64,67])assert.ok(notes.some(x=>x.m===m),'missing note '+m);
assert.ok(notes.length<=12,'too many spurious notes for simple monophonic audio');
assert.equal(output[0].score.analysis.source,'v5_owner_authorized_playback');
assert.equal(output[0].score.bpm,92);
assert.equal(output[0].score.chords.length,0);
const html=fs.readFileSync(path.join(__dirname,'../public/track.html'),'utf8');
const player=fs.readFileSync(path.join(__dirname,'../public/tl3-v5-player.js'),'utf8');
assert.ok(html.includes("id=\"generateV5ScoreDraftBtn\""));
assert.ok(html.includes("id=\"v5ScoreDerivativesRights\""));
assert.ok(html.includes("result.can_generate===true"));
assert.ok(html.includes("onVerifiedScoreAudio:_v5ScoreOwnerAllowed&&_v5ScoreAnalysisPending"));
assert.ok(html.includes("track-score-worker-v5.js"));
assert.ok(html.includes("/api/v1/scores/v5/'+encodeURIComponent(SHARE_ID)+'/draft"));
assert.ok(html.includes("rights_confirmed:true,source_sha256:hash,score_data:result"));
assert.ok(html.includes("analysis:'")===false); // no raw MP3 submission on API
assert.ok(player.includes("if(typeof opts.onVerifiedScoreAudio==='function')"));
assert.ok(player.indexOf("opts.onVerifiedScoreAudio(decoded.mp3")>player.indexOf("await audio.play()"));
console.log('PASS TRACK V5 licensed playback owner-only draft worker, actual pitched audio -> notes, no extra MP3 upload');
