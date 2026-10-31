'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const asset=fs.readFileSync('public/new-asset.html','utf8');
const market=fs.readFileSync('public/shareplace.html','utf8');

assert.equal((asset.match(/href="\/renewal\/files\.html"/g)||[]).length,0,'retired My Files route must not return');
assert.equal((asset.match(/href="\/dashboard\.html\?tab=content"/g)||[]).length,3,'video/document/image entries use active My Works manager');
assert.ok(asset.includes('href="/shareplace.html"'),'music entry must open SharePlace');
assert.ok(asset.includes('id="gateCatalog"'),'New Asset must expose recent public music catalogue');
assert.ok(asset.includes('/renewal/portals.js'),'catalogue loader must remain connected');

assert.match(market,/endpoint='\/api\/shares'/);
assert.match(market,/batchSize=100/);
assert.match(market,/_perPage\s*=\s*20|var _perPage\s*=\s*20/);
assert.match(market,/location\.href='track\.html\?id='/);
assert.match(market,/function isPublishedTLAsset\(s\)/);
assert.match(market,/return contentKind\(s\)==='tl3'/);
assert.doesNotMatch(market,/href=["']\/renewal\/files\.html/);
console.log('PASS SharePlace/New Asset: specialized asset entry points retained, TL3-only catalogue, 20-card paging and track entry');
