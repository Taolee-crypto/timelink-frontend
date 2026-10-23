#!/usr/bin/env node
// Public, read-only live smoke checks. No login, no mutations, no TL charging.
import fs from 'node:fs';
const base=(process.env.V5_FRONTEND_URL||'https://www.timelink.digital').replace(/\/$/,'');
const api=(process.env.V5_API_URL||'https://api.timelink.digital').replace(/\/$/,'');
const shell=fs.readFileSync('public/sidebar.js','utf8');
const block=shell.match(/var sections = \[([\s\S]*?)\n  \];/);
if(!block)throw Error('Sidebar menu block missing');
const routes=[...new Set([...block[1].matchAll(/\[\s*['"]([^'"]+\.html(?:\?[^'"]*)?)['"]\s*,/g)].map(x=>x[1].split('?')[0]))];
const extra=['/track.html','/login.html','/signup.html'];
const failures=[];
async function check(label,url,expectHtml){
 try{
  const response=await fetch(url,{redirect:'follow',signal:AbortSignal.timeout(12000),headers:{'Accept':expectHtml?'text/html':'application/json'}});
  const type=response.headers.get('content-type')||'';
  const body=await response.text();
  const ok=response.ok&&(!expectHtml||(/text\/html/i.test(type)&&/<html/i.test(body)));
  console.log((ok?'PASS':'FAIL')+' '+label+' HTTP '+response.status+' '+type);
  if(!ok)failures.push(label+' returned '+response.status+' '+type);
 }catch(e){console.log('FAIL '+label+' '+e.message);failures.push(label+' '+e.message);}
}
for(const route of [...routes,...extra])await check(route,base+route,true);
await check('public API wallet auth boundary',api+'/api/eco/wallet',false).catch(()=>{});
// The wallet request is intentionally unauthenticated; 401/403 is expected.
// It is not a pass/fail signal for the authenticated V5 ledger.
const relevant=failures.filter(x=>!x.startsWith('public API wallet auth boundary'));
console.log(JSON.stringify({pageCount:routes.length+extra.length,failures:relevant},null,2));
if(relevant.length)process.exitCode=1;
