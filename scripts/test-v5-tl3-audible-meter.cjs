'use strict';
// V5 playback accounting: seeking to the tail cannot bill unplayed time.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('public/tl3-v5-player.js','utf8');
const start=source.indexOf('    function finishMeterForEnded(){');
const end=source.indexOf('    const onEnded=()=>finishMeterForEnded();',start);
assert.ok(start>=0&&end>start,'meter completion guard must exist');
const finish=source.slice(start,end);
assert.match(source,/const onEnded=\(\)=>finishMeterForEnded\(\);/);
assert.match(source,/audio\._tl3End=async function\(\)\{\s*finishMeterForEnded\(\);/);
assert.match(source,/completedByAudibleTime&&pre\.billing_mode!=='time_free'/);
assert.match(source,/const onSeeking=\(\)=>\{lastTime=null;\}/);
assert.match(source,/const onSeeked=\(\)=>\{lastTime=Number\(audio\.currentTime\)\|\|0;\}/);
assert.match(source,/const onPause=\(\)=>\{sample\(true\);lastTime=null;\}/);
function finishScenario({playedMs,totalMs=180000,mode='track',callTwice=true}){
  const results=[];let samples=0;
  const ctx={
    billableMs:playedMs,totalMs,pre:{billing_mode:mode},
    sample(force){assert.equal(force,true);samples++;},
    publishProgress(complete){results.push({kind:'progress',complete});},
    queueMeter(seconds,complete){results.push({kind:'meter',seconds,complete});}
  };
  const state=vm.runInNewContext(
    'let endMeterFinalized=false,completedByAudibleTime=false;\n'+finish+
    '\nfinishMeterForEnded();'+(callTwice?'finishMeterForEnded();':'')+
    '\n({endMeterFinalized,completedByAudibleTime,billableMs})',ctx
  );
  assert.equal(samples,1,'native + synthetic ended must meter only once');
  assert.equal(results.filter(x=>x.kind==='meter').length,1);
  return {events:results,state};
}
const skipped=finishScenario({playedMs:7350,totalMs:180000});
assert.equal(skipped.events[1].seconds,7.35,'seek-to-end must not charge 180 seconds');
assert.equal(skipped.events[1].complete,false);
assert.equal(skipped.state.completedByAudibleTime,false);
const early=finishScenario({playedMs:140000,totalMs:180000});
assert.equal(early.events[1].seconds,140,'early finish must bill only listened time');
assert.equal(early.events[1].complete,false);
const reallyFinished=finishScenario({playedMs:179920,totalMs:180000});
assert.equal(reallyFinished.events[1].seconds,180,'genuine natural finish settles full track');
assert.equal(reallyFinished.events[1].complete,true);
assert.equal(reallyFinished.state.completedByAudibleTime,true);
const almostEndedAfterSeek=finishScenario({playedMs:179500,totalMs:180000});
assert.equal(almostEndedAfterSeek.events[1].seconds,179.5);
assert.equal(almostEndedAfterSeek.events[1].complete,false);
const free=finishScenario({playedMs:10000,totalMs:180000,mode:'time_free'});
assert.equal(free.events[1].seconds,10,'TIME FREE metering preserves actual listened time');
assert.equal(free.events[1].complete,false);
const zero=finishScenario({playedMs:0,totalMs:180000});
assert.equal(zero.events[1].seconds,0);
assert.equal(zero.events[1].complete,false);
console.log('PASS V5 audible-only end metering, seeks, pause/seek guards, idempotent finalizer and TIME FREE');
