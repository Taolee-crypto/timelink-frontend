const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('public/tl3-manufacture.js','utf8');
const id='11111111-1111-4111-8111-111111111111';
function setup(status='pending_analysis',failure){
 const calls=[];
 class Audio{
  constructor(){this.duration=2;this.listeners={};}
  addEventListener(n,f){this.listeners[n]=f} removeEventListener(n){delete this.listeners[n]}
  load(){if(this.src)queueMicrotask(()=>this.listeners.loadedmetadata?.())}
  pause(){} removeAttribute(n){delete this[n]}
 }
 const context={window:{},File,FormData,AbortSignal,URL:{createObjectURL:()=> 'blob:fixture',revokeObjectURL(){}},Audio,setTimeout,clearTimeout,
  async fetch(url,init={}){
   calls.push({url,init});
   if(failure)return new Response(JSON.stringify({ok:false,error:'AUTH_REQUIRED'}),{status:401});
   if(url.endsWith('/api/upload/mp3')){
    assert.equal(init.headers.Authorization,'Bearer fixture');assert.equal(init.body.get('registration_mode'),'original_creation');
    assert.equal(await init.body.get('file').text(),'fixture mp3');
    return Response.json({ok:true,review_id:id,review_status:status});
   }
   if(url.includes('/music-gate/reviews/'))return Response.json({ok:true,review_id:id,review_status:status});
   if(url.endsWith('/manufacture'))return Response.json({ok:true,file_id:1,version:5,status:'released',duration_ms:2000});
   if(url.includes('/verify/'))return Response.json({ok:true,valid:true,version:5});
   if(url.includes('/resolve/'))return Response.json({ok:true,file_id:1,version:5,duration_ms:2000});
   throw Error('Unexpected request '+url);
  }
 };
 vm.runInNewContext(source,context);
 return {api:context.window.TimeLinkTL3,calls};
}
async function main(){
 const options={api:'https://fixture.test',token:'fixture',fileId:1,file:new File(['fixture mp3'],'fixture.mp3',{type:'audio/mpeg'}),rightsConfirmed:true};
 for(const state of ['pending_analysis','analyzing','review_required','rejected','cancelled']){
  const {api,calls}=setup(state);
  await assert.rejects(api.manufacture({...options,gateApproved:true,reviewStatus:'approved'}),e=>e.code==='MUSIC_GATE_APPROVAL_REQUIRED'&&e.review.review_status===state);
  assert.equal(calls[0].url,'https://fixture.test/api/upload/mp3');
  assert.ok(calls[1].url.includes('/music-gate/reviews/'));
  assert.ok(!calls.some(c=>c.url.endsWith('/manufacture')));
 }
 console.log('PASS pending, analyzing, exception, rejected and cancelled reviews block manufacture; client flags cannot bypass');
 let {api,calls}=setup('approved');
 const result=await api.manufacture(options);assert.equal(result.ok,true);assert.equal(result.version,5);
 assert.equal(calls[0].url,'https://fixture.test/api/upload/mp3');assert.equal(calls[1].url,'https://fixture.test/api/v1/tl3/v5/manufacture');
 assert.ok(calls[2].url.includes('/verify/'));assert.ok(calls[3].url.includes('/resolve/'));
 console.log('PASS server-approved source follows existing V5 manufacture, integrity and playback verification');
 ({api,calls}=setup('pending_analysis',true));await assert.rejects(api.manufacture(options),/AUTH_REQUIRED/);assert.equal(calls.length,1);
 ({api,calls}=setup());await assert.rejects(api.getReview({...options,reviewId:'invalid'}),/올바르지/);assert.equal(calls.length,0);
 console.log('PASS intake errors and invalid review IDs fail closed');
 const creator=fs.readFileSync('public/creator.html','utf8');
 assert.ok(creator.includes('await submitCreatorMusicGate();'));
 assert.ok(creator.includes("gate.review_status!=='approved'"));
 assert.ok(creator.includes('musicGateSource===file'));
 assert.ok(creator.includes("addEventListener('pagehide'"));
 assert.ok(creator.includes('musicGatePolls>=18'));
 assert.ok(!creator.includes('원본 MP3는 브라우저 메모리에만 둔다'));
 assert.ok(creator.includes('/tl3-manufacture.js?v=music-gate-intake-20261025a'));
 console.log('PASS Creator intake, per-file review state, bounded polling and cache version');
}
main().catch(e=>{console.error(e);process.exitCode=1});
