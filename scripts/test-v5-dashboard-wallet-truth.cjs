'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('public/dashboard.html','utf8');
const portal=fs.readFileSync('public/timelink.html','utf8');
function part(from,to){
 const i=html.indexOf(from),j=html.indexOf(to,i+from.length);
 assert.ok(i>=0&&j>i,'could not find function '+from);
 return html.slice(i,j);
}
const fetchSource=part('async function fetchServerBalance(){','// Synchronize all dashboard TL views');
const applySource=part('function applyDashboardV5Wallet(wallet){','// Synchronize all dashboard TL views');
const updateSource=part('function applyDashboardV5Balance(value){',"window.addEventListener('tl-v5-wallet-loaded'");
const renderSource=part('function renderUser(){','function getTotalTL(){');
const exchangeSource=part('async function doExchangeTL(){','// ═══════════════════════════════════════════\n// 로그아웃');
assert.ok(fetchSource.includes('/api/eco/wallet'));
assert.ok(applySource.includes('wallet.poc_index'));
assert.ok(applySource.includes('wallet.tl_p'));
assert.ok(exchangeSource.includes('await fetchServerBalance()'));
assert.ok(!renderSource.includes('_user.tlc'));
assert.ok(!renderSource.includes('tl_poc_today'));
assert.ok(!exchangeSource.includes('_user.tl_p'));
assert.ok(!html.includes('href="ads.html"'));
assert.ok(!html.includes('href="cafe-radio.html"'));
assert.ok(!html.includes('/api/dj-cafe/'));
assert.ok(!html.includes('id="contentBroadcastBar"'));
assert.ok(!portal.includes('TILO 중앙방송과 DJ 방송'));
const nodes={};const g=id=>nodes[id]||=( {textContent:'',innerHTML:''} );
let token='member-token',requestCount=0;
const wallet={tl_total:2145.5,tl_p:1750.5,tl_a:20,tl_b:375,tlc:7.125,poc_index:2.75};
const localStorage={getItem:key=>key==='tl_token'?token:key==='tl_user'?'{"tlc":9900,"tl_p":9900}':key==='tl_poc_today'?'999':null};
const dispatched=[];
const window={dispatchEvent:e=>dispatched.push(e),__tlV5WalletBalance:null,__tlV5Wallet:null};
const mock={API:'https://api.timelink.digital',localStorage,g,window,console,
  CustomEvent:function(type,opts){this.type=type;this.detail=opts.detail},
  fmt:x=>Number(x).toLocaleString('en-US'),_user:{id:2,username:'My Profile',email:'test@example.com',tlc:9999,tl_p:9999},
  document:{getElementById:g},
  fetch:async(url,opts)=>{requestCount++;assert.ok(url.endsWith('/api/eco/wallet'));assert.equal(opts.headers.Authorization,'Bearer member-token');return{ok:true,json:async()=>({wallet})}}};
const context=vm.createContext(mock);
vm.runInContext(fetchSource+'\n'+applySource+'\n'+updateSource+'\n'+renderSource+'\nfunction getTotalTL(){return window.__tlV5WalletBalance}',context);
(async()=>{
 const ok=await context.fetchServerBalance();
 assert.equal(ok,true);assert.equal(requestCount,1);
 assert.equal(g('tbTl').textContent,'2,145');
 assert.equal(g('walletTl').textContent,'2,145');
 assert.equal(g('tbTlc').textContent,'7.1250');
 assert.equal(g('walletTlc').textContent,'7.1250');
 assert.equal(g('tbPoc').textContent,'2.75');
 assert.equal(context.window.__tlV5Wallet.tl_p,1750.5);
 context.renderUser();
 assert.equal(g('tbTlc').textContent,'7.1250','renderUser must not overwrite verified TLC with cached legacy TLC');
 assert.equal(g('homePoc').textContent,'2.75');
 assert.equal(dispatched.length,1);
 wallet.tlc=22.5;wallet.poc_index=3.125;wallet.tl_p=10;
 await context.fetchServerBalance();
 assert.equal(g('walletTlc').textContent,'22.5000');
 assert.equal(g('homePoc').textContent,'3.13');
 assert.equal(context.window.__tlV5Wallet.tl_p,10);
 token='other-user';
 mock.fetch=async()=>({ok:true,json:async()=>({wallet:{...wallet,tlc:123456}})});
 // When login switches between network send and resolution, never paint another account's balance.
 context.fetch=async()=>{token='other-user';return{ok:true,json:async()=>({wallet:{...wallet,tlc:123456}})}};
 token='member-token';
 assert.equal(await context.fetchServerBalance(),false);
 assert.equal(g('walletTlc').textContent,'22.5000');
 console.log('PASS dashboard: backend-authoritative TL/TLC/POC & TL_P, no cached values or cross-login leakage, no retired ads/DJ links');
})().catch(e=>{console.error(e);process.exitCode=1});
