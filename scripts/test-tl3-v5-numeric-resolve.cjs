'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('public/tl3-v5-player.js','utf8');
async function runScenario(id,replies,expectedUrls,expectedResult){
  const calls=[];
  const sandbox={console,URL,TextEncoder,Uint8Array,Array,crypto:{},localStorage:{getItem:()=> 'test-login-token'},fetch:async(url,options)=>{
    calls.push({url,headers:options?.headers});
    const reply=replies[calls.length-1];
    if(!reply)throw Error('Unexpected fetch '+url);
    return {ok:reply.status<400,status:reply.status,json:async()=>reply.data};
  }};
  sandbox.window=sandbox;
  vm.runInNewContext(source,sandbox,{filename:'tl3-v5-player.js'});
  let actual,thrown=null;
  try{actual=await sandbox.TL3V5Player.canPlay(id);}
  catch(e){thrown=e;}
  assert.deepEqual(calls.map(x=>x.url),expectedUrls,'V5 lookup order for '+id);
  assert.ok(calls.every(x=>x.headers?.Authorization==='Bearer test-login-token'));
  if(expectedResult==='throws401'){assert.equal(thrown?.status,401,'must preserve auth failure');}
  else{if(thrown)throw thrown;assert.equal(actual,expectedResult);}
}
const base='https://api.timelink.digital/api/v1/tl3/v5/resolve/';
const success={status:200,data:{ok:true,version:5,profile:'TL3-V5',file_id:178,share_id:'tl3_178'}};
const missing={status:404,data:{ok:false,error:'No release'}};
const unauthorized={status:401,data:{ok:false,error:'AUTH_REQUIRED'}};
(async()=>{
 // Exact production failure: TRACK?id=178 resolved as numeric share_id, but
 // real release has file_id=178 and share_id=tl3_178.
 await runScenario('178',[missing,success],[base+'178?by=share_id',base+'178?by=file_id'],true);
 // Preserve numeric share IDs if they legitimately exist; never choose an
 // unrelated numeric file when the share ID is already registered.
 await runScenario('178',[success],[base+'178?by=share_id'],true);
 // Explicit Creator IDs preserve existing file-first lookup.
 await runScenario('tl3_178',[success],[base+'178?by=file_id'],true);
 await runScenario('tl3_178',[missing,success],[base+'178?by=file_id',base+'tl3_178?by=share_id'],true);
 // No fallback for authentication/server errors or arbitrary string IDs.
 await runScenario('178',[unauthorized],[base+'178?by=share_id'],'throws401');
 await runScenario('sh_abcdef',[missing],[base+'sh_abcdef?by=share_id'],false);
 await runScenario('178',[missing,missing],[base+'178?by=share_id',base+'178?by=file_id'],false);
 const track=fs.readFileSync('public/track.html','utf8');
 assert.ok(track.includes('TL3V5Player.canPlay(RAW_SHARE_ID || SHARE_ID)'));
 assert.ok(!track.includes('onVerifiedScoreAudio:'), 'retired score must not intercept TL3 playback');
 assert.ok(!track.includes('_v5ScoreAnalysisPending'), 'retired score cannot crash stopPlay');
 assert.ok(track.includes('onBillingMode:function(info)'), 'subscription/time-free playback callback retained');
 console.log('PASS actual TRACK id=178 resolves sealed V5 file; preserves share IDs, auth and billing; retired score callbacks absent');
})().catch(err=>{console.error(err);process.exitCode=1;});
