'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const page=fs.readFileSync('public/download.html','utf8');
const begin=page.indexOf("var REPO = 'Taolee-crypto/timelink-app';");
const end=page.indexOf('var ua = navigator.userAgent',begin);
assert.ok(begin>0&&end>begin,'official release reader must exist');
const script=page.slice(begin,end);
new vm.Script(script,{filename:'download.html:release-loader'});
for(const retired of ['XOR 암호화','TL 잔액 확인 후 재생합니다','음악·영상·이미지·문서<br>모두','불법 캡처 시 누가·언제','씨엠피 주식회사'])
 assert.ok(!page.includes(retired),'retired desktop claim: '+retired);
for(const supported of ['TL3 V5','AES-256-GCM','공식 온라인','서버 원장','로컬','(주)틸로코리아'])
 assert.ok(page.includes(supported),'missing truthful V5 policy '+supported);
function elements(){return Object.fromEntries(['dlWin','dlMac','dlLinux','dlWinSize','dlMacSize','dlLinuxSize','verNum','verDate','guideWinFile','guideMacFile'].map(x=>[x,{href:'',textContent:''}]));}
const expected=['TimeLink-Player-Setup-1.1.3.exe','TimeLink-Player-1.1.3-arm64.dmg','TimeLink-Player-1.1.3.AppImage'];
async function verifyRelease(tag,assets,ready){
 const nodes=elements();
 const context=vm.createContext({document:{getElementById:key=>nodes[key]},fetch:async()=>({ok:true,json:async()=>({tag_name:tag,assets:assets.map(name=>({name}))})})});
 vm.runInContext(script+'\nthis.runRelease=loadLatest;',context);
 await context.runRelease();
 const url='https://github.com/Taolee-crypto/timelink-app/releases';
 if(ready){
  assert.deepEqual([nodes.dlWin.href,nodes.dlMac.href,nodes.dlLinux.href],expected.map(n=>url+'/download/v1.1.3/'+n));
  assert.equal(nodes.verNum.textContent,'v1.1.3');
  assert.match(nodes.guideWinFile.textContent,/1\.1\.3/);
 }else{
  for(const n of ['dlWin','dlMac','dlLinux'])assert.equal(nodes[n].href,url,'no link to old or nonexistent binary');
  assert.match(nodes.verNum.textContent,/출시 확인 중/);
 }
}
(async()=>{
 await verifyRelease('v1.1.2',expected.map(x=>x.replace('1.1.3','1.1.2')),false);
 const partial=elements();
 {
  const context=vm.createContext({document:{getElementById:key=>partial[key]},fetch:async()=>({ok:true,json:async()=>({tag_name:'v1.1.3',assets:expected.slice(0,2).map(name=>({name}))})})});
  vm.runInContext(script+'\nthis.runRelease=loadLatest;',context);
  await context.runRelease();
  assert.equal(partial.dlWin.href,'https://github.com/Taolee-crypto/timelink-app/releases/download/v1.1.3/'+expected[0]);
  assert.equal(partial.dlMac.href,'https://github.com/Taolee-crypto/timelink-app/releases/download/v1.1.3/'+expected[1]);
  assert.equal(partial.dlLinux.href,'https://github.com/Taolee-crypto/timelink-app/releases');
  assert.match(partial.dlLinuxSize.textContent,/미게시/);
 }
 await verifyRelease('v1.1.3',expected,true);
 console.log('PASS official TimeLink Player V5 download: old claims removed, 1.1.3 independent verified platform assets, older releases safely blocked');
})().catch(error=>{console.error(error);process.exitCode=1});
