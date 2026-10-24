#!/usr/bin/env node
// Static, dependency-free navigation contract audit. Run: node scripts/audit-v5-navigation.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve('public');
const shell=fs.readFileSync(path.join(root,'sidebar.js'),'utf8');
const section=shell.match(/var sections = \[([\s\S]*?)\n  \];/);
if(!section) throw new Error('Sidebar section declaration missing');
const routes=[...section[1].matchAll(/\[\s*['"]([^'"]+\.html(?:\?[^'"]*)?)['"]\s*,/g)].map(m=>m[1]);
const failures=[];
for(const route of routes){
 const [pathname,query]=route.split('?');
 const filename=path.join(root,pathname.replace(/^\//,''));
 if(!fs.existsSync(filename)){failures.push('MISSING PAGE '+route);continue;}
 const page=fs.readFileSync(filename,'utf8');
 if(!page.includes('/sidebar.js')) failures.push('MISSING GLOBAL SIDEBAR '+route);
 if(query){
  const tab=new URLSearchParams(query).get('tab');
  if(tab && !page.includes(tab)) failures.push('DASHBOARD TAB NOT REFERENCED '+route);
 }
}
const expected=['/dashboard.html','/shareplace.html','/creator.html','/radio.html','/dj-center.html','/cafe-channel.html','/incar-channel.html','/cafe-world.html','/my-car-world.html','/advertiser.html','/ads.html','/wallet.html','/my-profile.html'];
for(const route of expected)if(!routes.includes(route))failures.push('REQUIRED MENU MISSING '+route);
const creator=fs.readFileSync(path.join(root,'creator.html'),'utf8');
for(const val of ['new_work','new_recording','same_recording','work_identity_type'])if(!creator.includes(val))failures.push('CREATOR WORK IDENTITY MISSING '+val);
const track=fs.readFileSync(path.join(root,'track.html'),'utf8');
if(!track.includes('tl3-v5-player'))failures.push('V5 TRACK PLAYER REFERENCE MISSING');
const wallet=fs.readFileSync(path.join(root,'sidebar.js'),'utf8');
if(!wallet.includes('/api/eco/wallet'))failures.push('V5 SIDEBAR WALLET API MISSING');
// Execute the radio's cached-shell repair: a static sidebar check alone misses
// scripts that rewrite correct menu destinations after page load.
const radio=fs.readFileSync(path.join(root,'radio.html'),'utf8');
const repair=[...radio.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
 .map(m=>m[1]).find(s=>s.includes('function isStationLink('));
if(!repair)failures.push('RADIO CACHED NAVIGATION REPAIR MISSING');
else {
 const link=(href,label)=>({href,textContent:label,closest:()=>true,
   getAttribute(){return this.href},setAttribute(_,value){this.href=value},
   get pathname(){return new URL(this.href,'https://timelink.digital').pathname}});
 const links=[link('/tl-broadcast.html','중앙방송'),link('/tilo.html?cached=1','Central Broadcast'),
   link('/radio.html','중앙방송'),link('/tilo-admin.html','TILO 운영센터'),link('/tilo.html','TILO DJ')];
 const handlers={};
 try {
   vm.runInNewContext(repair,{document:{querySelectorAll:()=>links,
     addEventListener:(name,fn)=>{handlers[name]=fn}},location:{assign:()=>{throw Error('Unexpected navigation')}}},
     {timeout:1000});
   handlers.DOMContentLoaded?.();
   for(const a of links)handlers.click?.({target:{closest:()=>a},preventDefault(){}});
   const expected=['/radio.html','/radio.html','/radio.html','/tilo-admin.html','/tilo.html'];
   links.forEach((a,i)=>{if(a.href!==expected[i])failures.push('RADIO RUNTIME NAVIGATION '+a.href)});
 }catch(e){failures.push('RADIO NAVIGATION REPAIR FAILED '+e.message)}
}
console.log(JSON.stringify({routes:routes.length,checked:[...new Set(routes)].length,failures},null,2));
if(failures.length)process.exitCode=1;
