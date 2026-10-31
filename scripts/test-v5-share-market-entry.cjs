'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const asset=fs.readFileSync('public/new-asset.html','utf8');
const market=fs.readFileSync('public/shareplace.html','utf8');
const sidebar=fs.readFileSync('public/sidebar.js','utf8');
const releases=JSON.parse(fs.readFileSync('public/docs/development-releases.json','utf8'));

assert.equal((asset.match(/href="\/renewal\/files\.html"/g)||[]).length,3,
  'specialized video/document/image entry points remain available outside the account menu');
assert.ok(asset.includes('href="/shareplace.html"'),'music entry must open SharePlace');
assert.ok(asset.includes('id="gateCatalog"'),'New Asset must expose recent public music catalogue');
assert.ok(asset.includes('/renewal/portals.js'),'catalogue loader must remain connected');
assert.ok(!sidebar.includes("['/renewal/files.html','내 파일 관리']"),
  'retired duplicate My Files must stay out of Account & Activity menu');

assert.match(market,/endpoint='\/api\/shares'/);
assert.match(market,/batchSize=100/);
assert.match(market,/_perPage\s*=\s*20|var _perPage\s*=\s*20/);
assert.match(market,/location\.href='track\.html\?id='/);
assert.match(market,/function isPublishedTLAsset\(s\)/);
assert.match(market,/return contentKind\(s\)==='tl3'/);
for(const id of [
 'TLV5-NAV-SP',
 'TLV5-PAGE-2f-6e-65-77-2d-61-73-73-65-74-2e-68-74-6d-6c',
 'TLV5-PAGE-2f-73-68-61-72-65-70-6c-61-63-65-2e-68-74-6d-6c'
]){
 const task=releases.tasks.find(t=>t.id===id);assert.ok(task,id+' ledger evidence missing');
 assert.equal(task.status,'테스트');assert.equal(task.release_evidence,true);
}
console.log('PASS SharePlace/New Asset: specialized asset entry points retained, TL3-only catalogue, 20-card paging and track entry');
