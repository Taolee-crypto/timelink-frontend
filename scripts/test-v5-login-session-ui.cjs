'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const loginHtml=fs.readFileSync('public/login.html','utf8');
const loginCode=loginHtml.match(/<script data-cfasync="false">([\s\S]*?)<\/script>/)?.[1];
assert.ok(loginCode);
new vm.Script(loginCode,{filename:'public/login.html'});
assert.match(loginCode,/if\(!succeeded\)return false/);
assert.match(loginCode,/onTonConnected\(localStorage.getItem\('tl_ton_address'\),true\)/);
const calls=[],stored={tl_token:'previous-user-token',tl_ton_address:'UQ'+'x'.repeat(46)},responses=[];
const nodes=new Map();for(const id of ['email','pw','login-btn','ton-btn','ton-btn-text','toast-box'])nodes.set(id,{value:id==='email'?'member@example.test':id==='pw'?'secret':'',disabled:false,textContent:'',innerHTML:'',
 classList:{add(){},remove(){}},prepend(){},remove(){}});
const document={getElementById:id=>nodes.get(id),createElement:()=>({className:'',textContent:'',remove(){}}),addEventListener(){}};
let scheduled=[];
const ctx=vm.createContext({
 document,window:{},API:'https://api.timelink.digital',
 tr:x=>x,location:{search:'',origin:'https://www.timelink.digital',href:''},
 URL,URLSearchParams,
 localStorage:{getItem:k=>stored[k]||null,setItem:(k,v)=>{stored[k]=v},removeItem:k=>delete stored[k]},
 fetch:async(url,opts)=>{calls.push({url,opts});const r=responses.shift();assert.ok(r,'unexpected fetch '+url);
 return {ok:r.ok,status:r.status||200,async json(){return r.data||{}}};},
 setTimeout(fn){scheduled.push(fn)},console:{warn(){}}
});
(async()=>{vm.runInContext(loginCode,ctx);
assert.equal(calls.length,0,'displaying stored TON wallet never sends mutation');
responses.push({ok:false,status:401,data:{error:'invalid'}});let r=await ctx.doLogin();
assert.equal(r,false);
assert.equal(calls.length,1,'failed login must not call TON link endpoint');
assert.equal(stored.tl_token,'previous-user-token','never mutate a previous token on failed login');
responses.push({ok:true,status:200,data:{token:'new-member-token',user:{id:5}}},{ok:true,status:200,data:{ok:true}});
r=await ctx.doLogin();
assert.equal(r,true);
assert.equal(stored.tl_token,'new-member-token');
assert.equal(calls.length,3,'successful login may associate stored TON address once');
assert.match(calls[2].url,/\/api\/ton\/connect$/);
assert.equal(calls[2].opts.headers.Authorization,'Bearer new-member-token');
console.log('PASS email login: invalid credentials do not bind old wallet, stored wallet read only, successful session binds new token once');
})().catch(e=>{console.error(e);process.exitCode=1});
