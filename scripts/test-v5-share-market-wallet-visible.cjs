'use strict';
// SharePlace contracts: authenticated wallet balances and visible-card-only queries.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('public/shareplace.html','utf8');
function section(a,b){const i=html.indexOf(a),j=html.indexOf(b,i+a.length);assert.ok(i>=0&&j>i,'missing section '+a);return html.slice(i,j);}
assert.ok(html.includes("id=\"sp-tl-bal\""));
assert.ok(!html.includes("((_user.tl_p||0)+(_user.tl_a||0)+(_user.tl_b||0)).toLocaleString()"),'cached balance exposed in header');
assert.ok(html.includes("if(!await loadShareplaceWallet())"),'legacy charge must verify wallet before precheck');
assert.ok(html.includes('await loadShareplaceWallet();'),'payment must refresh from server');
assert.ok(html.includes('if(_token)void loadMyTL(paged,false);'),'only filtered page requests card balances');
assert.ok(html.includes('var paged=list.slice(start,end);'),'page boundary must precede balance query');
assert.ok(!html.includes('await loadMyTL();'),'unbounded whole-catalog balance fetching returned');

(async()=>{
 let token='memberA';
 const elements={};
 const el=id=>elements[id]||(elements[id]={textContent:''});
 const ctx=vm.createContext({
  API_BASE:'https://api.example.test',_token:token,
  localStorage:{getItem:k=>k==='tl_token'?token:''},
  document:{getElementById:el},
  window:{addEventListener(){}},
  fetch:async()=>({ok:true,json:async()=>({wallet:{tl_total:1987,tlc:3.125}})}),
  console:{warn(){}}
 });
 vm.runInContext(section('var _shareplaceWalletTL=null;','// ==================== API ===================='),ctx);
 assert.equal(await ctx.loadShareplaceWallet(),true);
 assert.equal(ctx.getTotalTL(),1987);
 assert.equal(el('sp-tl-bal').textContent,'1,987 TL');
 assert.equal(el('sp-tlc-bal').textContent,'3.1250 TLC');
 ctx.fetch=async()=>({ok:true,json:async()=>({wallet:{tl_total:undefined,tlc:2}})});
 assert.equal(await ctx.loadShareplaceWallet(),false,'incomplete server balances must fail closed');
 assert.equal(ctx.getTotalTL(),0);
 assert.equal(el('sp-tl-bal').textContent,'잔액 확인 실패');
 let release;
 ctx.fetch=()=>new Promise(resolve=>{release=resolve;});
 const pending=ctx.loadShareplaceWallet();
 token='memberB';
 release({ok:true,json:async()=>({wallet:{tl_total:999999,tlc:100}})});
 assert.equal(await pending,false,'response from previous member must be discarded');
 assert.equal(ctx.getTotalTL(),0);
 assert.notEqual(el('sp-tl-bal').textContent,'999,999 TL');

 let inflight=0,maxInflight=0,calls=0,updates=[];
 const cardCtx=vm.createContext({
  _token:'memberA',_perPage:20,_myFileTL:{},_allShares:[],
  localStorage:{getItem:k=>k==='tl_token'?'memberA':''},
  API_BASE:'https://api.example.test',
  contentKind:()=> 'tl3',
  updateShareCardTL:(key,tl)=>updates.push([key,tl]),
  console:{warn(){}},
  fetch:async()=>{calls++;inflight++;maxInflight=Math.max(maxInflight,inflight);
    await new Promise(r=>setTimeout(r,2));inflight--;
    return {ok:true,json:async()=>({ok:true,tl_balance:3600})};
  }
 });
 vm.runInContext(section('var _visibleShareCards=[];','// Track에서 돌아왔을 때'),cardCtx);
 const list=Array.from({length:100},(_,i)=>({id:'song'+i}));
 await cardCtx.loadMyTL(list,false);
 assert.equal(calls,20,'one page must issue at most 20 requests even for 100 input songs');
 assert.ok(maxInflight<=4&&maxInflight>0,'limit API concurrency to four');
 assert.equal(updates.length,20);
 await cardCtx.loadMyTL(list,false);
 assert.equal(calls,20,'cached balances must not be fetched again during render');
 await cardCtx.loadMyTL(list,true);
 assert.equal(calls,40,'forced bfcache refresh revalidates only visible page');
 console.log('PASS SharePlace server-wallet truth, auth race, fail-closed, max-20 cards / max-4 concurrency');
})().catch(e=>{console.error(e);process.exitCode=1;});