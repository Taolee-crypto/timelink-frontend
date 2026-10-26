const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const old=fs.readFileSync('public/contribution-policy.html','utf8');let target;
const scripts=[...old.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
for(const s of scripts)vm.runInNewContext(s[1],{location:{replace:value=>target=value}});
assert.equal(target,'/reward-policy.html');assert.ok(!old.includes('/contribution-policy.js'));
const legacy=fs.readFileSync('public/reward-policy.html','utf8');assert.ok(legacy.includes('/api/admin/reward-policy'));assert.ok(!legacy.includes('href="/contribution-policy.html"'));
const admin=fs.readFileSync('public/admin.html','utf8');assert.ok(admin.includes('href="/reward-policy.html"'));assert.ok(!admin.includes('href="/contribution-policy.html"'));
const products=fs.readFileSync('public/music-subscriptions.js','utf8');assert.ok(products.includes('data.products.length!==24'));assert.ok(products.includes('/prepare'));
console.log('PASS retired proposal redirects to original reward controls; no new editor load; time catalogue and checkout retained');
