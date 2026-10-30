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
 assert.deepEqual([nodes.dlWin.href,nodes.dlMac.href,nodes.dlLinux.href],expected.map(n=>url+'/download/v1.1.3/'+n),'official v1.1.3 installers must remain available during older/partial release discovery');
 assert.equal(nodes.verNum.textContent,'v1.1.3');
 assert.match(nodes.guideWinFile.textContent,/1\.1\.3/);
 assert.equal(nodes.verDate.textContent,ready?'공식 최신 릴리스':'공식 검증 빌드 · 최신 확인 불가');
}
(async()=>{
 await verifyRelease('v1.1.2',expected.map(x=>x.replace('1.1.3','1.1.2')),false);
 await verifyRelease('v1.1.3',expected.slice(0,2),false);
 await verifyRelease('v1.1.3',expected,true);
 // GitHub API may be temporarily blocked, timed out, or rate-limited.
 for(const failure of [async()=>{throw Error('API unavailable');},async()=>({ok:false,status:403})]){
  const nodes=elements();
  const ctx=vm.createContext({document:{getElementById:k=>nodes[k]},fetch:failure});
  vm.runInContext(script+'\nthis.runRelease=loadLatest;',ctx);
  await ctx.runRelease();
  assert.equal(nodes.dlWin.href,'https://github.com/Taolee-crypto/timelink-app/releases/download/v1.1.3/'+expected[0]);
  assert.equal(nodes.verNum.textContent,'v1.1.3');
 }
 assert.ok(page.includes('구형 v1.1.0에서 ‘헤더 크기 오류’'),'visible upgrade notice required');
 assert.match(page,/href="https:\/\/github.com\/Taolee-crypto\/timelink-app\/releases\/download\/v1\.1\.3\/TimeLink-Player-Setup-1\.1\.3\.exe" id="dlWin"/,
  'Windows download must work before async network response');
 assert.ok(page.includes('포맷 <span>TLNK · TL3 V5'),'protected V5 format label required');
 console.log('PASS official TimeLink Player V5 download: legacy v1.1.0 upgrade path, official v1.1.3 complete assets and safe network fallback');
})().catch(error=>{console.error(error);process.exitCode=1});
