const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.TL_PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--autoplay-policy=no-user-gesture-required'],...(process.env.TL_CHROMIUM_EXECUTABLE?{executablePath:process.env.TL_CHROMIUM_EXECUTABLE}:{})});
 try{
  const page=await browser.newPage();page.setDefaultTimeout(15000);
  await page.route('**/*',route=>{const path=new URL(route.request().url()).pathname;if(path==='/tl3-lp-worklet.js')return route.fulfill({contentType:'text/javascript',body:fs.readFileSync('public/tl3-lp-worklet.js','utf8')});return route.fulfill({contentType:'text/html',body:'<!doctype html><html><body></body></html>'});});
  await page.goto('http://localhost:8033/');await page.addScriptTag({content:fs.readFileSync('public/tl3-lp-chain.js','utf8')});
  await page.evaluate(async()=>{
   function makeAudio(){const frames=48000*5,buffer=new ArrayBuffer(44+frames*2),v=new DataView(buffer);const text=(at,s)=>{for(let i=0;i<s.length;i++)v.setUint8(at+i,s.charCodeAt(i))};text(0,'RIFF');v.setUint32(4,36+frames*2,true);text(8,'WAVEfmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,48000,true);v.setUint32(28,96000,true);v.setUint16(32,2,true);v.setUint16(34,16,true);text(36,'data');v.setUint32(40,frames*2,true);for(let i=0;i<frames;i++)v.setInt16(44+i*2,5000*Math.sin(2*Math.PI*440*i/48000),true);const audio=document.createElement('audio');audio.src=URL.createObjectURL(new Blob([buffer],{type:'audio/wav'}));document.body.appendChild(audio);return audio;}
   await TL3LPChain.unlock();window.firstAudio=makeAudio();window.activeAudio=makeAudio();window.first=await TL3LPChain.create(firstAudio,{enabled:true},5000);window.active=await TL3LPChain.create(activeAudio,{enabled:true},5000);if(!first.available()||!active.available())throw Error('Real AudioWorklet is unavailable');await first.setEnabled(true);await active.setEnabled(true);await firstAudio.play();await activeAudio.play();await first.suspend();await first.stop();firstAudio.pause();
  });
  assert.equal(await page.evaluate(()=>active.state()),'running');
  const before=await page.evaluate(()=>activeAudio.currentTime);
  await page.evaluate(()=>{const finish=performance.now()+300;while(performance.now()<finish){Math.sqrt(Math.random())}});
  await page.waitForFunction(()=>activeAudio._tl3LpLevels?.outputRms>0);
  const result=await page.evaluate(()=>({time:activeAudio.currentTime,paused:activeAudio.paused,state:active.state(),levels:activeAudio._tl3LpLevels,oldController:firstAudio._tl3LpChain}));
  assert.equal(result.paused,false);assert.equal(result.state,'running');assert.ok(result.time>before+.15);assert.equal(result.oldController,null);assert.ok(Number.isFinite(result.levels.outputRms));assert.ok(result.levels.outputRms>0);
  await page.evaluate(async()=>{await active.stop();activeAudio.pause();});
  console.log('PASS Chrome: real MediaElement/AudioWorklet keeps processing audio after another track stops and during main-thread work. This does not measure user-device acoustic glitches.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
