'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('public/dashboard.html','utf8');
const start=html.indexOf('async function loadShares(){');
const end=html.indexOf('\nfunction updatePremiumTotal(){',start);
assert.ok(start>0&&end>start);
const loadSharesSrc=html.slice(start,end);
assert.match(loadSharesSrc,/api\/shares\/my\?limit=/);
assert.match(loadSharesSrc,/Authorization:'Bearer '\+token/);
assert.doesNotMatch(loadSharesSrc,/fetch\(API\s*\+\s*'\/api\/shares'\)/);
assert.match(loadSharesSrc,/Array\.isArray\(d\.files\)/);
assert.match(loadSharesSrc,/fileInventory\.length/);
assert.match(loadSharesSrc,/data-file-id/);
assert.doesNotMatch(html,/reward:'\+10 TLC'|reward:'\+500 TL'|reward:'\+20 TLC'/);
assert.match(html,/현재 승인된 미션·지급 조건이 없습니다/);
const nodes={};
const g=id=>nodes[id]||(nodes[id]={textContent:'',innerHTML:''});
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const events=[];
const mock={
 API:'https://api.timelink.digital',_token:'token',_user:{id:2},g,esc,
 fmt:x=>String(x),localStorage:{getItem:key=>key==='tl_token'?'token':null},
 window:{TimeLinkCreatorEarnings:{refresh(){events.push('earnings')}}},
 console:{warn(){events.push('warn')}},
 fetch:async(url,opts)=>{
   events.push({url,headers:opts.headers});
   return {ok:true,status:200,json:async()=>({
    shares:[{id:'my-share',title:'내 작품',file_id:22,artist:'가수',content_kind:'tl3',pulse:7,created_at:Date.now()}],
    files:[{id:22,play_count:5},{id:23,play_count:0,shared:0}]
   })};
 }
};
const load=vm.runInNewContext('('+loadSharesSrc+')',mock);
(async()=>{
 await load();
 assert.equal(g('homeFiles').textContent,2,'includes private file');
 assert.equal(g('cntFiles').textContent,2);
 assert.equal(g('cntPulse').textContent,'7');
 assert.equal(g('cntPlays').textContent,'5');
 assert.equal(g('cntTl3').textContent,'1개');
 assert.match(g('myTl3List').innerHTML,/내 작품/);
 assert.match(g('myTl3List').innerHTML,/data-file-id="22"/);
 assert.ok(events.some(e=>e.url&&e.url.endsWith('/api/shares/my?limit=200&offset=0')));
 assert.ok(events.some(e=>e.headers&&e.headers.Authorization==='Bearer token'));
 assert.ok(events.includes('earnings'));
 const failure=vm.runInNewContext('('+loadSharesSrc+')',{...mock,
 fetch:async()=>({ok:false,status:401,json:async()=>({error:'인증 필요'})})});
 await failure();
 assert.match(g('myTl3List').innerHTML,/불러오지 못했습니다/);
 assert.equal(g('cntFiles').textContent,'조회 실패');
 console.log('PASS dashboard private inventory, source authorization, real count, file IDs, errors, no fictitious mission rewards');
})().catch(error=>{console.error(error);process.exitCode=1});
