const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.TL_PLAYWRIGHT_MODULE||'playwright');
async function main(){
 const browser=await chromium.launch({headless:true,...(process.env.TL_CHROMIUM_EXECUTABLE?{executablePath:process.env.TL_CHROMIUM_EXECUTABLE}:{})});
 try{
  const page=await browser.newPage();let mode='subscription',seen=[];
  await page.route('**/*',async route=>{
   const u=new URL(route.request().url());
   if(u.pathname==='/')return route.fulfill({contentType:'text/html',body:'<html></html>'});
   let data={ok:true};
   if(u.pathname.includes('/resolve/'))data={version:5,file_id:10,share_id:'song'};
   else if(u.pathname.includes('/preflight/'))data={can_play:true,billing_mode:mode,remaining_included_ms:123000,wallet_tl:20};
   else if(u.pathname.includes('/session-license/')){seen.push(JSON.parse(route.request().postData()));return route.fulfill({status:409,contentType:'application/json',body:JSON.stringify({ok:false,error:'fixture-license-stop'})});}
   return route.fulfill({contentType:'application/json',body:JSON.stringify(data)});
  });
  await page.goto('http://localhost:8010/');await page.addScriptTag({content:fs.readFileSync('public/tl3-v5-player.js','utf8')});
  const play=async opts=>page.evaluate(async o=>{window.billing=null;try{await TL3V5Player.playStream('song',document.createElement('audio'),{...o,onBillingMode:i=>window.billing=i});}catch(e){return {error:e.message,billing:window.billing};}},opts);
  let result=await play({sessionId:'fixture_session_123'});assert.equal(result.error,'fixture-license-stop');assert.equal(seen.at(-1).session_id,'sub_fixture_session_123');assert.equal(result.billing.billing_mode,'subscription');
  mode='track_pool';await play({sessionId:'fixture_track_123'});assert.equal(seen.at(-1).session_id,'fixture_track_123');
  await play({sessionId:'fixture_dj_123',djStationId:7});assert.equal(seen.at(-1).session_id,'fixture_dj_123');assert.equal(seen.at(-1).dj_monitor,true);
  // Execute the actual page display function with a controlled state.
  const track=fs.readFileSync('public/track.html','utf8'),display=track.slice(track.indexOf('function updatePlayerTLDisplay(){'),track.indexOf('\nasync function playTrack(){'));
  await page.evaluate(()=>{document.body.innerHTML='<span>label</span><span id="playerTLVal"></span><span>label</span><span id="playerSpentTLVal"></span><span>label</span><span id="playerAssetTLVal"></span><span id="playerWalletVal"></span><div id="playerTLBar"></div>';});
  await page.addScriptTag({content:`let _tlSubscription={remainingMs:123000,chargedTL:2},_tlFree=false,_tlSessionSettledSeconds=600,_tlCurrentTL=0,_tlPlayCountReserved=false,_myFileTL=20;function songRequiredTL(){return 240}function formatTLInteger(n){return n+' TL'}${display}`});
  await page.evaluate(()=>updatePlayerTLDisplay());assert.equal(await page.locator('#playerSpentTLVal').textContent(),'2 TL');assert.equal(await page.locator('#playerAssetTLVal').textContent(),'2분 3초');
  await page.evaluate(()=>{_tlSubscription=null;_tlSessionSettledSeconds=5;_tlCurrentTL=480;updatePlayerTLDisplay()});assert.equal(await page.locator('#playerSpentTLVal').textContent(),'5 TL');assert.equal(await page.locator('#playerAssetTLVal').textContent(),'2회');
  console.log('PASS real browser: subscription session prefix before license, legacy/DJ isolation, billing callback, included time and actual overage display. Audio decryption/playback is outside this fixture.');
 }finally{await browser.close()}
}
main().catch(e=>{console.error(e);process.exitCode=1});
