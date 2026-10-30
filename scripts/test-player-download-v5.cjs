'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('public/download.html','utf8');
const base='https://github.com/Taolee-crypto/timelink-app/releases/download/v1.1.4/';
const files={
  dlWin:'TimeLink-Player-Setup-1.1.4.exe',
  dlMac:'TimeLink-Player-1.1.4-arm64.dmg',
  dlLinux:'TimeLink-Player-1.1.4.AppImage',
  dlDeb:'TimeLink-Player-1.1.4.deb'
};
for(const [id,name] of Object.entries(files)){
  assert.match(html,new RegExp('id="'+id+'"'),'missing OS button '+id);
  assert.ok(html.includes(base+name),'server rendered link must work with JS disabled: '+name);
}
assert.ok(!html.includes('https://api.github.com/repos/'),'release API failures must not break downloads');
assert.ok(!html.includes('/v1.1.3/'),'retired version must not override v1.1.4');
for(const forbidden of ['XOR 암호화','TL 잔액 확인 후 재생합니다','씨엠피 주식회사'])assert.ok(!html.includes(forbidden));
for(const supported of ['TL3 V5','AES-256-GCM','공식 온라인','서버 원장','오프라인','(주)틸로코리아'])
  assert.ok(html.includes(supported),'missing truthfully described policy: '+supported);
const a=html.indexOf("var REPO = 'Taolee-crypto/timelink-app';");
const b=html.indexOf('var ua = navigator.userAgent',a);
assert.ok(a>0&&b>a);
const nodes=Object.fromEntries([...Object.keys(files),'dlWinSize','dlMacSize','dlLinuxSize','dlDebSize','verNum','verDate','guideWinFile','guideMacFile']
 .map(id=>[id,{href:'',textContent:'',removeAttribute(k){this.removed=k}}]));
const context=vm.createContext({document:{getElementById:id=>nodes[id]}});
vm.runInContext(html.slice(a,b)+'\nloadLatest();',context);
for(const [id,name] of Object.entries(files)){
  assert.equal(nodes[id].href,base+name,'JS-enhanced link differs from HTML '+id);
  assert.ok(nodes[id.replace('dl','dl')+'Size'].textContent.includes('v1.1.4'));
}
assert.equal(nodes.verNum.textContent,'v1.1.4');
assert.equal(nodes.guideWinFile.textContent,files.dlWin);
assert.equal(nodes.guideMacFile.textContent,files.dlMac);
console.log('PASS: v1.1.4 Windows/macOS/Linux AppImage/Debian direct links independent of GitHub API');
