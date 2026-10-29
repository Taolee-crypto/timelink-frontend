'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const playerSource=fs.readFileSync('public/tl3-v5-player.js','utf8');
const trackSource=fs.readFileSync('public/track.html','utf8');
const begin=playerSource.indexOf('  async function playStream(id,audio,opts){');
const end=playerSource.indexOf('  global.TL3V5Player=Object.freeze(',begin);
assert.ok(begin>=0&&end>begin,'V5 player extraction');
const playerFunction=playerSource.slice(begin,end);
assert.match(playerFunction,/audio\._tl3CancelStartup=function\(\)/);
assert.match(playerFunction,/if\(startupCancelled\)cancel\(\)/);
assert.match(playerFunction,/contentKey\.fill\(0\)/,'aborted keys must be zeroed');
assert.match(trackSource,/if\(audio&&typeof audio\._tl3Stop!=='function'&&typeof audio\._tl3CancelStartup==='function'\)/);
assert.match(trackSource,/if\(_tlAudio!==playerAudio \|\| \(e&&e\.code==='V5_START_CANCELLED'\)\)return/);
function deferred(){let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};}
function makeAudio(){
  const listeners=new Map();
  const audio={readyState:0,currentTime:0,paused:true,ended:false,
    plays:0,pauses:0,loads:0,
    addEventListener(name,fn){listeners.set(name,fn);},
    removeEventListener(name,fn){if(listeners.get(name)===fn)listeners.delete(name);},
    load(){this.loads++;},
    pause(){this.pauses++;this.paused=true;},
    removeAttribute(name){if(name==='src')this.src='';},
    async play(){this.plays++;this.paused=false;},
    listeners
  };
  return audio;
}
function makeHarness({resolveWait=null,containerWait=null}={}){
  const audio=makeAudio(),stats={preflights:0,containers:0,unwrapped:0,decoded:0,revoked:0},key=new Uint8Array(32).fill(33);
  const ctx={
    API:'https://api.timelink.digital',global:{},Blob,URL:{
      createObjectURL(){return 'blob:fixture';},
      revokeObjectURL(){stats.revoked++;}
    },
    crypto:{subtle:{async digest(){return new Uint8Array(32).buffer;}}},
    console:{warn(){},error(){}},
    sid:()=> 'tl3v5_test_session_12345678',
    auth:()=>({Authorization:'Bearer test'}),
    bytes:v=>v.buffer.slice(v.byteOffset,v.byteOffset+v.byteLength),
    async resolve(){return resolveWait?resolveWait.promise:{version:5,file_id:42,share_id:'sh_fixture',container_sha256:'0'.repeat(64)};},
    async request(){stats.preflights++;return {can_play:true,billing_mode:'track'};},
    async unwrapAssetKey(){stats.unwrapped++;return key;},
    async fetch(){stats.containers++;return containerWait?containerWait.promise:{ok:true,arrayBuffer:async()=>new Uint8Array(20).buffer};},
    async decryptContainer(){stats.decoded++;return {manifest:{duration_ms:90000},mp3:new Uint8Array(200)};},
    setInterval(){return 4;},clearInterval(){}
  };
  vm.runInNewContext(playerFunction+'\nthis.run=playStream;',ctx);
  return {ctx,audio,stats,key};
}
async function flushUntil(condition,label){
  for(let i=0;i<80;i++){if(condition())return;await Promise.resolve();}
  assert.fail('timeout waiting for '+label);
}
(async()=>{
  const gate=deferred(),early=makeHarness({resolveWait:gate});
  const waiting=early.ctx.run('sh_fixture',early.audio);
  assert.equal(typeof early.audio._tl3CancelStartup,'function','cancel function installed synchronously');
  early.audio._tl3CancelStartup();
  gate.resolve({version:5,file_id:42,share_id:'sh_fixture'});
  await assert.rejects(waiting,e=>e.code==='V5_START_CANCELLED');
  assert.equal(early.stats.preflights,0,'stop during resolve must prevent preflight');
  assert.equal(early.audio.plays,0);

  const download=deferred(),mid=makeHarness({containerWait:download});
  const waitingDownload=mid.ctx.run('sh_fixture',mid.audio);
  await flushUntil(()=>mid.stats.containers===1,'container request');
  mid.audio._tl3CancelStartup();
  download.resolve({ok:true,arrayBuffer:async()=>new Uint8Array(20).buffer});
  await assert.rejects(waitingDownload,e=>e.code==='V5_START_CANCELLED');
  assert.equal(mid.stats.decoded,0,'stop during download prevents decrypt');
  assert.ok([...mid.key].every(x=>x===0),'abandoned license key zeroed');

  const late=makeHarness();
  const waitingCanplay=late.ctx.run('sh_fixture',late.audio);
  await flushUntil(()=>late.audio.listeners.has('canplay'),'canplay listener');
  assert.equal(late.audio.plays,0);
  late.audio._tl3CancelStartup();
  await assert.rejects(waitingCanplay,e=>e.code==='V5_START_CANCELLED');
  assert.equal(late.audio.plays,0,'stop during buffering must never issue play()');
  assert.equal(late.stats.revoked,1,'abandoned decrypted blob revoked');
  assert.ok(late.audio.pauses>=1,'cancelled audio must be paused');
  assert.equal(late.audio.listeners.size,0,'cancelled listeners released');
  assert.ok([...late.key].every(x=>x===0),'key wiped after successful decryption');

  // An in-flight canPlay lookup should not create an audio player after stop.
  const trackBegin=trackSource.indexOf('let _tlV5PlayRequestSequence=0;');
  const trackEnd=trackSource.indexOf('function startTLTimer(){',trackBegin);
  assert.ok(trackBegin>0&&trackEnd>trackBegin,'track playback guard');
  const lookup=deferred();let created=0;
  const V5={canPlay:()=>lookup.promise};
  const trackContext={window:{TL3V5Player:V5},TL3V5Player:V5,
    _share:{id:42,file_type:'audio/tl3'},_assetInitialTL:180,_tlPlaying:false,
    _tlPlayCountReserved:false,contentKind:()=> 'tl3',isFreeMp3:()=>false,
    RAW_SHARE_ID:'42',SHARE_ID:'42',updatePlayerTLDisplay(){},Audio:function(){created++;},
    alert(){assert.fail('cancelled preflight should not alert');},console:{warn(){},error(){}}
  };
  vm.runInNewContext(trackSource.slice(trackBegin,trackEnd)+'\nthis.start=playTrack;',trackContext);
  const waitingLookup=trackContext.start();
  vm.runInNewContext('++_tlV5PlayRequestSequence;',trackContext);
  lookup.resolve(true);
  await waitingLookup;
  assert.equal(created,0,'stopped track lookup must not start a late audio session');
  console.log('PASS V5 stop during resolve, encrypted download, canplay and TRACK lookup: zero phantom playback and key cleanup');
})().catch(error=>{console.error(error);process.exitCode=1;});
