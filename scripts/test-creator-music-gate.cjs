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
   if(url.endsWith('/music-gate/reviews'))return Response.json({ok:true,account_id:1,reviews:[{review_id:id,review_status:status,created_at:'fixture'}]});
   if(url.endsWith('/retry')){assert.equal(init.method,'POST');return Response.json({ok:true,review_id:id,review_status:'pending_analysis'});}
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
 for(const status of ['pending_analysis','analyzing','review_required','rejected','cancelled','approved']){
  const {api,calls}=setup(status);
  const result=await api.manufacture(options);
  assert.equal(result.ok,true);
  assert.ok(calls[0].url.endsWith('/manufacture'));
  assert.ok(!calls.some(c=>c.url.includes('music-gate')||c.url.endsWith('/upload/mp3')));
  assert.ok(calls[1].url.includes('/verify/'));assert.ok(calls[2].url.includes('/resolve/'));
 }
 console.log('PASS all advisory review states allow manufacture; integrity and playback verification remain');
 let {api,calls}=setup();
 await assert.rejects(api.manufacture({...options,rightsConfirmed:false}),/권한/);assert.equal(calls.length,0);
 ({api,calls}=setup('pending_analysis',true));
 await assert.rejects(api.manufacture(options),/AUTH_REQUIRED/);
 console.log('PASS rights confirmation and server authentication failures remain enforced');
 const details=setup().api;
 assert.ok(details.reviewDescription({analysis_status:'complete',risk_signals:['profanity']}).includes('욕설 감지'));
 assert.ok(details.reviewDescription({analysis_status:'failed'}).includes('등록할 수 있습니다'));
 const history=await details.listReviews({api:options.api,token:options.token});assert.equal(history.account_id,1);
 assert.equal((await details.retryReview({api:options.api,token:options.token,reviewId:id})).review_status,'pending_analysis');
 const creator=fs.readFileSync('public/creator.html','utf8');
 const handler=creator.slice(creator.indexOf("$('releaseBtn').onclick=async()=>{"),creator.indexOf('function finish(released,d)'));
 for(const status of ['pending_analysis','analyzing','review_required','rejected','cancelled']){
  const nodes=new Map(),$=id=>{if(!nodes.has(id))nodes.set(id,{value:'fixture',checked:true,disabled:false,hidden:true,textContent:''});return nodes.get(id)};
  let writes=0;
  const ctx={$,share:{file_id:1},clearErr(){},setFinalMusicGateMessage(msg){$('musicGateFinalStatus').textContent=msg},
   err(id,msg){$(id).textContent=msg},TLi18n:{t:k=>k},window:{},API:options.api,auth:()=>({}),AbortSignal,spotifyTrack:null,
   musicGateReview:{review_status:status},
   async refreshMusicGate(){throw Error('AI service unavailable')},
   async submitCreatorMusicGate(){throw Error('AI service unavailable')},
   async fetch(){writes++;return Response.json({ok:false,error:'fixture rights write failure'})}};
  vm.runInNewContext(handler,ctx);await $('releaseBtn').onclick();
  assert.equal(writes,1);assert.equal($('releaseBtn').disabled,false);
  assert.equal($('musicGateFinalStatus').textContent,'fixture rights write failure');
 }
 console.log('PASS actual Creator final button reaches rights save even with unavailable AI and any advisory status');
}
main().catch(e=>{console.error(e);process.exitCode=1});
