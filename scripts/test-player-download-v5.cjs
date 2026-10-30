'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('public/download.html','utf8');
const a=html.indexOf("var REPO = 'Taolee-crypto/timelink-app';");
const b=html.indexOf('var ua = navigator.userAgent',a);
assert.ok(a>0&&b>a,'release loader exists');
const code=html.slice(a,b);
new vm.Script(code);
for(const retired of ['XOR 암호화','TL 잔액 확인 후 재생합니다','음악·영상·이미지·문서<br>모두','불법 캡처 시 누가·언제','씨엠피 주식회사'])
 assert.ok(!html.includes(retired),'retired claim: '+retired);
for(const supported of ['TL3 V5','AES-256-GCM','공식 온라인','서버 원장','로컬','(주)틸로코리아'])
 assert.ok(html.includes(supported),'missing V5 policy: '+supported);
const base='https://github.com/Taolee-crypto/timelink-app/releases/download/';
const oldNames=['TimeLink-Player-Setup-1.1.3.exe','TimeLink-Player-1.1.3-arm64.dmg','TimeLink-Player-1.1.3.AppImage'];
const newNames=['TimeLink-Player-Setup-1.1.4.exe','TimeLink-Player-1.1.4-arm64.dmg','TimeLink-Player-1.1.4.AppImage'];
for(const n of oldNames)assert.ok(html.includes(base+'v1.1.3/'+n),'server-side fallback href missing: '+n);
function nodes(){
 return Object.fromEntries(['dlWin','dlMac','dlLinux','dlWinSize','dlMacSize','dlLinuxSize','verNum','verDate','guideWinFile','guideMacFile'].map(x=>[x,{href:'',style:{},textContent:''}]));
}
async function check(tag,assets,expectVersions,fetchMode='ok'){
 const e=nodes();
 const context=vm.createContext({
   document:{getElementById:key=>e[key]},
   fetch:async()=>{
     if(fetchMode==='throw')throw Error('network unavailable');
     if(fetchMode==='forbidden')return {ok:false,status:403};
     return {ok:true,json:async()=>({tag_name:tag,draft:false,prerelease:false,assets:assets.map(name=>({name,state:'uploaded',browser_download_url:base+tag+'/'+encodeURIComponent(name)}))})};
   }
 });
 vm.runInContext(code+'\nthis.load=loadLatest;',context);
 await context.load();
 const links=[e.dlWin.href,e.dlMac.href,e.dlLinux.href];
 expectVersions.forEach((v,i)=>{
   const name=v==='1.1.4'?newNames[i]:oldNames[i];
   assert.equal(links[i],base+'v'+v+'/'+name,'OS '+i+' must link to a real matching version');
   assert.equal([e.dlWinSize,e.dlMacSize,e.dlLinuxSize][i].textContent.includes('v'+v),true,'OS '+i+' label should match file');
   assert.notEqual([e.dlWin,e.dlMac,e.dlLinux][i].ariaDisabled,'true');
 });
 assert.ok(e.verNum.textContent.includes('v'+expectVersions[0]));
}
(async()=>{
 await check('v1.1.3',oldNames,['1.1.3','1.1.3','1.1.3']);
 await check('v1.1.3',[],['1.1.3','1.1.3','1.1.3'],'throw');
 await check('v1.1.3',[],['1.1.3','1.1.3','1.1.3'],'forbidden');
 await check('v1.1.4',newNames.slice(0,2),['1.1.4','1.1.4','1.1.3']);
 await check('v1.1.4',newNames,['1.1.4','1.1.4','1.1.4']);
 await check('v1.1.4',[],['1.1.3','1.1.3','1.1.3']);
 console.log('PASS Windows macOS Linux direct downloads remain usable; v1.1.4 replaces each platform only after real asset publication');
})().catch(error=>{console.error(error);process.exitCode=1});
