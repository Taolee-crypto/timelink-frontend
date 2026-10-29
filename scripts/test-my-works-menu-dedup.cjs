'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const sidebar=fs.readFileSync('public/sidebar.js','utf8');
const ledger=fs.readFileSync('public/v5-work-ledger.html','utf8');
const dashboard=fs.readFileSync('public/dashboard.html','utf8');
const profile=fs.readFileSync('public/my-profile.html','utf8');
const newAsset=fs.readFileSync('public/new-asset.html','utf8');
const files=fs.readFileSync('public/renewal/files.html','utf8');
const sectionSrc=sidebar.slice(sidebar.indexOf('var sections = ['),sidebar.indexOf('var groupNames='));
const sidebarSections=vm.runInNewContext(sectionSrc+';sections', {});
const tools=sidebarSections.find(s=>s[0]==='TOOLS');
assert.ok(tools,'Account and Activity sidebar must exist');
assert.ok(tools[2].some(a=>a[0]==='/dashboard.html?tab=content'),'My Works must remain');
assert.ok(!tools[2].some(a=>a[0]==='/renewal/files.html'),'My Files duplicate must be removed from Account and Activity');
assert.ok(!dashboard.includes('<a href="/renewal/files.html">내 파일 관리</a>'),'Dashboard cannot reintroduce duplicate My Files shortcut');
assert.ok(!profile.includes('<a href="/renewal/files.html">나의 파일'),'Profile cannot reintroduce duplicate My Files shortcut');
const groups=vm.runInNewContext(ledger.slice(ledger.indexOf('const sidebarPageGroups='),ledger.indexOf('const routeKey='))+';sidebarPageGroups', {});
const account=groups.find(g=>g[0]==='계정과 활동')[1];
assert.ok(account.some(a=>a[1]==='/dashboard.html?tab=content'),'Ledger must retain My Works');
assert.ok(!account.some(a=>a[1]==='/renewal/files.html'),'Ledger must match sidebar');
assert.ok(ledger.includes("'/renewal/files.html']);"),'Legacy page must be excluded from progress metrics');
assert.ok(files.includes('<title>내 파일 관리 — TimeLink</title>'), 'Historical files page remains for direct non-menu use');
assert.ok(newAsset.includes('href="/renewal/files.html"'),'Specialized document/video/image entry points are intentionally preserved');
// A deployed bundle must not keep requesting an old sidebar URL after
// changing menu contents. Test every direct page, not just sidebar source.
const revision='20261029-account-navigation-v2';
function auditSidebarSources(dir){
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
    const filename=path.join(dir,ent.name);
    if(ent.isDirectory()){auditSidebarSources(filename);continue;}
    if(!filename.endsWith('.html'))continue;
    const source=fs.readFileSync(filename,'utf8');
    for(const match of source.matchAll(/src=["'](\\/sidebar\\.js(?:\\?[^"']*)?)["']/g)){
      assert.equal(match[1],'/sidebar.js?v='+revision,
        'Stale global sidebar URL in '+filename);
    }
  }
}
auditSidebarSources('public');
assert.match(fs.readFileSync('public/index.html','utf8'),
  /src="\\/sidebar\\.js\\?v=20261029-account-navigation-v2"/,
  'Main host must request the current sidebar revision');
assert.match(fs.readFileSync('public/_headers','utf8'),/\\/sidebar\\.js[\\s\\S]*?Cache-Control: no-cache/,
  'Sidebar caching must revalidate');

console.log('PASS duplicate My Files menu removed; My Works, source files, New Asset and ledger remain consistent');
