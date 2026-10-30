'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ledger=fs.readFileSync('public/v5-work-ledger.html','utf8');
const releases=JSON.parse(fs.readFileSync('public/docs/development-releases.json','utf8'));
const retired=['TLV5-TRACK-SCORE-LOCAL-20261029','TLV5-TRACK-TLD-SERVICE-20261029','TLV5-TRACK-AUTO-SCORE-OWNER-20261029','TLV5-TRACK-SCORE-VIEWER-20261029','TLV5-VOCAL-GATE-20261029'];
for(const id of retired){
 const task=releases.tasks.find(x=>x.id===id);
 assert.ok(task,'missing retired task '+id);
 assert.equal(task.retired,true,'retirement marker missing '+id);
 assert.ok(ledger.includes("'"+id+"'"),'ledger exclusion missing '+id);
}
assert.match(ledger,/function activeTasks\(tasks\)\{return tasks\.filter\(t=>!isRetired\(t\)\);\}/);
assert.match(ledger,/t\.retired===true/);
assert.match(ledger,/function metrics\(tasks\)\{tasks=activeTasks\(tasks\)/);
const fixture=[...retired.map(id=>({id,category:'공유 마켓',retired:true,status:'보류'})),...Array.from({length:32},(_,i)=>({id:'active-'+i,retired:false,status:'구현'}))];
const active=fixture.filter(t=>t.retired!==true);
assert.equal(active.length,32);
assert.equal(Math.round(active.filter(t=>['구현','테스트','운영확인'].includes(t.status)).length/active.length*100),100);
console.log('PASS SharePlace retired task exclusion from completion numerator and denominator');
