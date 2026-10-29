#!/usr/bin/env node
'use strict';
// Source-contract gate for V5 release. It proves menu/ledger/page consistency,
// NOT that a customer payment or authenticated production E2E has completed.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assert=require('node:assert/strict');
const root='public';
function read(p){return fs.readFileSync(p,'utf8')}
function scriptValue(src,start,end,expression){
  const a=src.indexOf(start),b=src.indexOf(end,a+start.length);
  assert.ok(a>=0&&b>a,'Missing audited declaration: '+start);
  return vm.runInNewContext(src.slice(a,b)+'\n'+expression, {},{timeout:1000});
}
const sidebar=read(path.join(root,'sidebar.js'));
const ledger=read(path.join(root,'v5-work-ledger.html'));
const sections=scriptValue(sidebar,'var sections = [','var groupNames=','sections');
const groups=scriptValue(ledger,'const sidebarPageGroups=','const routeKey=','sidebarPageGroups');
const pages=scriptValue(ledger,'const pageRoutes=','// Page overview','pageRoutes');
const group=(key)=>groups.find(g=>g[0]===key)?.[1]||[];
const section=(key)=>sections.find(g=>g[0]===key)?.[2]||[];
const paths=(rows)=>rows.map(entry=>entry[1]);
const menuPaths=(rows)=>rows.map(entry=>entry[0]);
const main=[...section('MAIN'),...section('CREATE')];
const expected=[
  ['기본 메뉴',main],
  ['활동 공간',section('ACTIVITY')],
  ['월드',section('WORLD')],
  ['계정과 활동',section('TOOLS')]
];
let tested=0;
for(const [title,source] of expected){
  const actual=paths(group(title));
  const fromSidebar=menuPaths(source);
  assert.equal(JSON.stringify(actual),JSON.stringify(fromSidebar),'sidebar/ledger route/order mismatch: '+title);
  tested+=actual.length;
}
// Protected operational links appear only after server-side admin access is granted.
// Check both presence and ordered equality without making an authorization claim.
const pos=sidebar.indexOf("d.innerHTML='<summary>'+t('operations')");
assert.ok(pos>0,'Admin menu must be gated by the authorized settings request');
const tail=sidebar.slice(pos,sidebar.indexOf(".map(link).join('');nav.appendChild(d)",pos));
const adminLinks=[...tail.matchAll(/\['(\/[^']+\.html(?:\?[^']*)?)','[^']+'/g)].map(x=>x[1]);
assert.equal(adminLinks.length,5,'Expected five protected operations links');
assert.equal(JSON.stringify(paths(group('운영센터'))),JSON.stringify(adminLinks),'Admin sidebar/ledger parity');
tested+=adminLinks.length;
const flat=groups.flatMap(g=>g[1].map(x=>({title:g[0],label:x[0],route:x[1]})));
assert.equal(tested,24,'Unexpected V5 menu surface change; review and update this gate');
assert.equal(new Set(flat.map(x=>x.route)).size,tested,'Duplicate menu destination');
const linked=new Set(Object.values(pages).flatMap(routes=>routes.map(x=>x[1])));
const retired=new Set(['/renewal/files.html','/dj-center.html','/dj-guide.html',
  '/advertiser.html','/ads.html','/cafe-radio.html']);
for(const item of flat){
  const file=path.join(root,item.route.split('?')[0].replace(/^\//,''));
  assert.ok(fs.existsSync(file),'Menu points to a missing page: '+item.route);
  assert.ok(linked.has(item.route),'Page ledger not linked: '+item.route);
  assert.ok(!retired.has(item.route),'Retired menu found: '+item.route);
  const html=read(file);
  assert.match(html,/<!doctype html>/i,'Page must be a real HTML document: '+item.route);
  if(item.route.includes('?tab=')){
    const tab=new URLSearchParams(item.route.split('?')[1]).get('tab');
    assert.ok(html.includes(tab),'Tab not present in page: '+item.route);
  }
}
const keyRoutes=['/timelink.html','/new-asset.html','/creator.html',
  '/shareplace.html','/radio.html','/dashboard.html','/my-cafe.html',
  '/my-car.html','/wallet.html','/my-profile.html','/tl-tlc-pool.html'];
for(const route of keyRoutes){
  const html=read(path.join(root,route.slice(1)));
  assert.ok(html.includes('/sidebar.js'),'Important route must load global navigation: '+route);
}
const track=read(path.join(root,'track.html'));
assert.ok(track.includes('tl3-v5-player'),'Main song route must retain TL3 V5 player');
assert.ok(!sidebar.includes("'/renewal/files.html'"),'Retired My Files link is not a sidebar item');
assert.ok(!sidebar.includes("'/dj-center.html'"),'Retired DJ role must not reappear');
const newer=read(path.join(root,'index.html'));
assert.ok(newer.includes('src="/sidebar.js?v=20261029-account-navigation-v2"'),
  'Current root shell must request the refreshed global menu');
console.log('PASS V5 final menu/ledger acceptance gate: '+tested+'/'+tested+
  ' links aligned, 4 groups + restricted operations, no missing/retired pages');
console.log('NOTE static route/contract checks are NOT production operational E2E or financial settlement evidence');
