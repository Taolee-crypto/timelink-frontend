'use strict';
// Verify the actual TRACK V5 callbacks against replaced/late playback sessions.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('public/track.html','utf8');
const begin=html.indexOf('    TL3V5Player.playStream(RAW_SHARE_ID || SHARE_ID, _tlAudio, {');
const end=html.indexOf('    }).then(function(result){',begin);
assert.ok(begin>0&&end>begin,'V5 playback callback object must be found');
const objectCode=html.slice(html.indexOf('{',begin),end+'    }'.length);
const currentAudio={id:'old'},status={textContent:'',style:{display:'none'}};
let alerts=[],stops=0,refreshes=0,updates=0,warnings=[],delayedRefresh=null;
const ctx=vm.createContext({
 playerAudio:currentAudio,_tlAudio:currentAudio,
 _share:{id:'42'},SHARE_ID:'42',RAW_SHARE_ID:'42',
 _tlSubscription:null,_tlSessionSettledSeconds:0,
 _tlCurrentTL:10,_trackTL:10,_myFileTL:100,
 updatePlayerTLDisplay(){updates++;},
 updateMyTLFromServer(){refreshes++;return delayedRefresh||Promise.resolve(100);},
 stopPlay(){stops++;},
 formatTLInteger:value=>String(value),
 document:{getElementById:()=>status},
 console:{log(){},warn(...x){warnings.push(x.join(' '));},error(){}},
 alert:message=>alerts.push(message),
 songRequiredTL:()=>250
});
vm.runInContext('this.callbacks=('+objectCode+');',ctx);
const callbacks=ctx.callbacks;
for(const name of ['onBillingMode','onProgress','onMeter','onStopSettlement','onInsufficient','onError'])
 assert.equal(typeof callbacks[name],'function',name+' callback missing');

callbacks.onMeter({billing_mode:'track',wallet_tl:90,asset_tl:8,billed_seconds:2,delta_tl:2});
assert.equal(ctx._myFileTL,90);
assert.equal(ctx._trackTL,8);
assert.equal(ctx._tlCurrentTL,8);
assert.equal(ctx._tlSessionSettledSeconds,2);
callbacks.onMeter({billing_mode:'track',asset_tl:'non-number',wallet_tl:'bad',billed_seconds:3});
assert.equal(ctx._myFileTL,90,'invalid wallet reply must not be displayed');
assert.equal(ctx._trackTL,8,'invalid asset value must not override server balance');
callbacks.onMeter({billing_mode:'track',billed_seconds:4});
assert.equal(ctx._trackTL,8,'missing server asset balance must never be guessed');
assert.equal(ctx._tlSessionSettledSeconds,4);

const newAudio={id:'new'};
ctx._tlAudio=newAudio;
const oldProgress=ctx._tlSessionSettledSeconds;
const oldUpdates=updates;
callbacks.onBillingMode({billing_mode:'time_free',remaining_included_ms:50000});
callbacks.onProgress({billed_seconds:60});
callbacks.onMeter({billing_mode:'track',wallet_tl:800,asset_tl:1000,billed_seconds:70});
callbacks.onInsufficient({billing_mode:'track',wallet_tl:999});
assert.equal(ctx._tlSubscription,null,'stale preflight must not replace subscription');
assert.equal(ctx._tlSessionSettledSeconds,oldProgress,'late progress must not override new song');
assert.equal(ctx._trackTL,8,'late meter cannot overwrite new song charged balance');
assert.equal(ctx._myFileTL,90,'late meter cannot overwrite shared wallet state');
assert.equal(updates,oldUpdates,'late callbacks must not redraw current player');
assert.equal(stops,0,'old session insufficient must not stop new track');
assert.equal(alerts.length,0,'old session insufficient must not pop an alert');

callbacks.onError(new Error('old session settlement failed'));
assert.equal(stops,0,'old session settlement error must not stop new track');
assert.equal(refreshes,1,'old session settlement error must reconcile canonical wallet');
const previousStatus=status.textContent;
callbacks.onStopSettlement({refunded_tl:10});
assert.equal(status.textContent,previousStatus,'old stop must not overwrite new song status');
assert.equal(refreshes,2,'old stop must reconcile actual server wallet');

ctx._tlAudio=currentAudio;
callbacks.onBillingMode({billing_mode:'time_free',remaining_included_ms:12000});
assert.equal(ctx._tlSubscription.mode,'time_free');
callbacks.onInsufficient({billing_mode:'time_free'});
assert.equal(stops,1,'active session insufficient must stop current audio');
assert.equal(alerts.length,1,'active session insufficient must inform user');
(async()=>{
  // Previous stop begins when no player is mounted; a new song starts while
  // the canonical wallet request is still pending. Late readback cannot
  // change the new song's completion banner.
  let releaseRefresh;
  delayedRefresh=new Promise(resolve=>{releaseRefresh=resolve;});
  ctx._tlAudio=null;
  status.textContent='';
  callbacks.onStopSettlement({refunded_tl:11});
  assert.match(status.textContent,/동기화 중/,'previous track stop posts an interim status');
  const oldStatus=status.textContent;
  ctx._tlAudio=newAudio;
  releaseRefresh();
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(status.textContent,oldStatus,'old refund readback must not replace the new track status');
  delayedRefresh=null;
  console.log('PASS TRACK V5 old session callback isolation, verified asset balance, late refund banner and real stop settlement');
})().catch(e=>{console.error(e);process.exitCode=1;});
