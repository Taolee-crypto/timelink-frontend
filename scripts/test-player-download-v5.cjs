'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const page=fs.readFileSync('public/download.html','utf8');
const begin=page.indexOf("var REPO = 'Taolee-crypto/timelink-app';");
const end=page.indexOf('var ua = navigator.userAgent',begin);
assert.ok(begin>0&&end>begin);
const script=page.slice(begin,end);
new vm.Script(script);
for(const retired of ['XOR 암호화','TL 잔액 확인 후 재생합니다','음악·영상·이미지·문서<br>모두','불법 캡처 시 누가·언제','씨엠피 주식회사'])
 assert.ok(!page.includes(retired),'retired claim: '+retired);
for(const supported of ['TL3 V5','AES-256-GCM','공식 온라인','서버 원장','로컬','(주)틸로코리아'])
 assert.ok(page.includes(supported),'missing V5 policy: '+supported);
function elements(){return Object.fromEntries(['dlWin','dlMac','dlLinux','dlWinSize','dlMacSize','dlLinuxSize','verNum','verDate','guideWinFile','guideMacFile'].map(x=>[x,{href:'',textContent:'',style:{}}]));}
const names=['TimeLink-Player-Setup-1.1.4.exe','TimeLink-Player-1.1.4-arm64.dmg','TimeLink-Player-1.1.4.AppImage'];
async function check(tag,files,expected){
 const nodes=elements();
 const assets=files.map(name=>({name,state:'uploaded',browser_download_url:'https://github.com/Taolee-crypto/timelink-app/releases/download/'+tag+'/'+name}));
 const context=vm.createContext({document:{getElementById:key=>nodes[key]},fetch:async()=>({ok:true,json:async()=>({tag_name:tag,draft:false,prerelease:false,assets})})});
 vm.runInContext(script+'\nthis.runRelease=loadLatest;',context);
 await context.runRelease();
 assert.equal(nodes.verNum.textContent,'v1.1.4');
 const urls=[nodes.dlWin.href,nodes.dlMac.href,nodes.dlLinux.href];
 expected.forEach((enabled,i)=>{
   assert.equal(!!urls[i],enabled,'platform '+i+' availability');
   if(enabled)assert.ok(urls[i].includes('/releases/download/v1.1.4/'));
   else assert.match([nodes.dlWinSize,nodes.dlMacSize,nodes.dlLinuxSize][i].textContent,/다운로드 불가/);
 });
}
(async()=>{
 await check('v1.1.3',names.map(n=>n.replace('1.1.4','1.1.3')),[false,false,false]);
 await check('v1.1.4',names.slice(0,2),[true,true,false]);
 await check('v1.1.4',names,[true,true,true]);
 await check('v1.1.4',[],[false,false,false]);
 console.log('PASS desktop download only links to genuinely uploaded v1.1.4 release assets');
})().catch(e=>{console.error(e);process.exitCode=1});
