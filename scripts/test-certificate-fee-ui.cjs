const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const h=fs.readFileSync('public/track.html','utf8');
const src=h.slice(h.indexOf('async function goCertify'),h.indexOf('function closeCertModal'));
const nodes={};const node=id=>nodes[id]??={style:{},classList:{add(){}},value:'',textContent:''};
let status=200,quote={ok:true,ledger_version:'V5',wallet:{tl_total:1150214.2345},balance_after_tl:1145214.2345,can_afford:true};
const c={getTok:()=> 'token',_share:{artist:'Artist'},API:'',document:{getElementById:node},fetch:async url=>{assert.ok(url.endsWith('/certification/quote'));return{ok:status===200,json:async()=>quote};},AbortSignal,alert:()=>{},location:{}};
vm.createContext(c);vm.runInContext(src,c);
(async()=>{
await c.goCertify();
assert.equal(node('cmBalance').textContent,'1,150,214.2345 TL');assert.equal(node('cmAfterBalance').textContent,'1,145,214.2345 TL');assert.equal(node('cmSubmitBtn').disabled,false);
quote={...quote,wallet:{tl_total:4000},balance_after_tl:-1000,can_afford:false};await c.goCertify();assert.equal(node('cmSubmitBtn').disabled,true);assert.equal(node('cmError').style.display,'block');
status=503;quote={error:'unavailable'};await c.goCertify();assert.equal(node('cmSubmitBtn').disabled,true);assert.equal(node('cmBalance').textContent,'조회 실패');
assert.ok(h.includes('cd.already ? 0 : (cd.fee_paid ?? 5000)'));
console.log('PASS: certificate modal exact V5 quote, insufficient/error block, replay zero fee');
})().catch(e=>{console.error(e);process.exitCode=1;});
