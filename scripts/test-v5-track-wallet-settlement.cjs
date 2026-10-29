'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('public/track.html','utf8');
function section(a,b){const i=html.indexOf(a),j=html.indexOf(b,i+a.length);assert.ok(i>=0&&j>i,'missing '+a);return html.slice(i,j);}
const walletSrc=section('function renderV5Wallet(wallet){','function updateUIAfterCharge(newBalance){');
const els={myTLDisplay:{textContent:''},myTLBreakdown:{textContent:''}};
let currentToken='accountA',walletCalls=0,trackCalls=0,updated=0;
let walletReply={ok:true,json:async()=>({wallet:{tl_total:15000,tl_p:14000,tl_a:1000,tl_b:0}})};
let trackReply={ok:true,json:async()=>({ok:true,tl_balance:7200})};
const ctx=vm.createContext({
 API:'https://api.example.test',_myFileTL:14000,_trackTL:3600,_tlCurrentTL:3600,
 window:{SHARE_ID:'sh_55',dispatchEvent:()=>{}},
 CustomEvent:function(){},
 document:{getElementById:id=>els[id]},
 formatTLInteger:n=>String(n),
 getTok:()=>currentToken,
 updateUIAfterCharge:n=>{updated++;ctx._myFileTL=n;},
 updatePlayerTLDisplay:()=>{},renderTrackChargeBalances:()=>{},
 console:{warn:()=>{}},
 fetch:async url=>url.includes('/eco/wallet')?(walletCalls++,walletReply):(trackCalls++,trackReply)
});
vm.runInContext(walletSrc,ctx);
(async()=>{
 assert.equal(await ctx.updateMyTLFromServer(),15000);
 assert.equal(ctx._myFileTL,15000);
 assert.equal(els.myTLDisplay.textContent,'💰 내 지갑 TL: 15000');
 assert.equal(await ctx.updateTrackTLFromServer(),7200);
 assert.equal(ctx._trackTL,7200);
 walletReply={ok:false,json:async()=>({error:'임시 오류'})};
 await assert.rejects(ctx.updateMyTLFromServer(),/임시 오류/);
 assert.equal(ctx._myFileTL,15000,'failed wallet must preserve prior verified amount');
 assert.equal(updated,1,'failed wallet must never unlock update UI');
 walletReply={ok:true,json:async()=>({wallet:{tl_total:undefined}})};
 await assert.rejects(ctx.updateMyTLFromServer(),/잔액 필드/);
 assert.equal(ctx._myFileTL,15000,'missing balance cannot become zero or NaN');
 walletReply={ok:true,json:async()=>({wallet:{tl_total:-1}})};
 await assert.rejects(ctx.updateMyTLFromServer(),/잔액 필드/);
 assert.equal(ctx._myFileTL,15000);
 let resolve;
 walletReply=()=>new Promise(r=>{resolve=r;});
 ctx.fetch=async url=>url.includes('eco/wallet')?walletReply():trackReply;
 const old=ctx.updateMyTLFromServer();
 currentToken='accountB';
 resolve({ok:true,json:async()=>({wallet:{tl_total:999999}})});
 await assert.rejects(old,/계정이 변경/);
 assert.equal(ctx._myFileTL,15000);
 ctx.fetch=async()=>({ok:true,json:async()=>({ok:true,tl_balance:'invalid'})});
 await assert.rejects(ctx.updateTrackTLFromServer(),/올바르지 않습니다/);
 assert.equal(ctx._trackTL,7200,'malformed track response cannot overwrite credited TL');

 const directSrc=section('async function doDirectCharge(){','function selectChargePkg(el){');
 let posted=0,close=0,alarms=[],syncs=0;
 const elements={trackChargeCount:{value:'1'},directChargeBtn:{disabled:false}};
 const charging=vm.createContext({
 API:'https://api.example.test',_myFileTL:12000,window:{SHARE_ID:'sh_55'},
 document:{getElementById:id=>elements[id]},getTok:()=> 'accountB',
 songRequiredTL:()=>3600,formatTLInteger:n=>String(n),
 updateMyTLFromServer:async()=>{syncs++;throw Error('server wallet unavailable');},
 updateTrackTLFromServer:async()=>7200,
 renderTrackChargeBalances:()=>{},closeChargeModal:()=>{close++;},
 alert:msg=>alarms.push(msg),console:{warn:()=>{}},
 fetch:async()=>{posted++;return {ok:true,json:async()=>({ok:true,amount:3600,tl_balance:7200,user_tl:8400})};}
 });
 vm.runInContext(directSrc,charging);
 await charging.doDirectCharge();
 assert.equal(posted,1,'charge must be submitted exactly once');
 assert.equal(close,1);
 assert.equal(syncs,1);
 assert.equal(charging._myFileTL,12000,'unverified response cannot be presented as canonical balance');
 assert.equal(elements.directChargeBtn.disabled,false);
 assert.match(alarms[0],/충전했습니다/);
 assert.match(alarms[0],/다시 충전하지 말고/,'readback failure after committed charge must not prompt duplicate purchase');
 assert.match(html,/if\(info\.wallet_tl!=null\)/,'only explicit reported meter balance may be used');
 assert.match(html,/Number\.isFinite\(reportedWallet\)&&reportedWallet>=0/);
 console.log('PASS TRACK canonical wallet, auth race, fail-closed ledger response, post-charge no duplicate retry and bounded meter values');
})().catch(e=>{console.error(e);process.exitCode=1;});
