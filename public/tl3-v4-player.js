/* TimeLink TL3 Spine v4 Track Player — Love Connect Code runtime */
(function(global){
  'use strict';
  const API=(global.TL3_API_BASE)||'https://api.timelink.digital';
  const enc=s=>new TextEncoder().encode(s);
  const unhex=h=>{const a=new Uint8Array(h.length/2);for(let i=0;i<a.length;i++)a[i]=parseInt(h.slice(i*2,i*2+2),16);return a;};
  const hex=b=>Array.from(b).map(x=>x.toString(16).padStart(2,'0')).join('');
  const token=()=>localStorage.getItem('tl_token')||'';
  const auth=()=>({'Authorization':'Bearer '+token()});
  const sid=()=>'tl3v4_'+Date.now()+'_'+Math.random().toString(36).slice(2,10);
  function ivFor(prefix,n){const iv=new Uint8Array(12);iv.set(prefix,0);new DataView(iv.buffer).setBigUint64(4,BigInt(n),false);return iv;}
  async function deriveKey(license,previous,n){
    const material=await crypto.subtle.importKey('raw',license,'HKDF',false,['deriveKey']);
    return crypto.subtle.deriveKey({name:'HKDF',hash:'SHA-256',salt:previous,info:enc('timelink:tl3:spine:v1:segment:'+n)},material,{name:'AES-GCM',length:256},false,['decrypt']);
  }
  async function fetchRetry(url,opts,label){
    let lastError;
    const retryable=[408,429,500,502,503,504];
    const maxAttempts=6;
    for(let attempt=0;attempt<maxAttempts;attempt++){
      try{
        const response=await fetch(url,opts||{headers:auth()});
        if(response.ok||!retryable.includes(response.status))return response;
        lastError=new Error((label||'TL3 request')+' HTTP '+response.status);
      }catch(error){lastError=error;}
      if(attempt<maxAttempts-1){
        const delay=Math.min(8000,500*Math.pow(2,attempt))+Math.floor(Math.random()*250);
        console.warn('[TL3v4] transient request failure; retrying',{label:label||'TL3 request',attempt:attempt+1,next_delay_ms:delay,error:String(lastError&&lastError.message||lastError)});
        await new Promise(resolve=>setTimeout(resolve,delay));
      }
    }
    throw lastError||new Error((label||'TL3 request')+' failed');
  }
  async function json(url,opts){
    const r=await fetchRetry(url,opts,'TL3 API');
    const d=await r.json().catch(()=>({}));
    if(!r.ok||d.ok===false)throw new Error(d.error||('HTTP '+r.status));
    return d;
  }
  async function playStream(id,audio,opts){
    opts=opts||{};
    const onError=opts.onError||function(){};
    const onReady=opts.onReady||function(){};
    const sessionId=String(opts.sessionId||sid());
    const rawId=String(id).split('/').pop().split('?')[0];
    const data=await json(API+'/api/v1/tl3/spine/header/'+encodeURIComponent(rawId),{headers:auth()});
    const h=data.header||{};
    if(h.profile!=='TL3-SPINE-1'||Number(h.v)!==4)throw new Error('지원하지 않는 TL3 Spine 규격입니다.');
    const N=Number(h.segment_count||0),tokens=data.spine_tokens||[];
    if(N<1||tokens.length!==N+1)throw new Error('Spine 세그먼트 또는 토큰 체인이 손상되었습니다.');
    const durations=(h.segment_durations_ms||[]).map(Number);
    const lpMeta=h.lp_meta||null;
    const lpToggle=document.getElementById('lpEnhancedToggle');
    let lpController=null;
    if(lpToggle){lpToggle.checked=false;lpToggle.disabled=true;}
    // 2026-10-19 AUDIO-SAFETY:
    // Do not insert MediaElementAudioSourceNode into the default TL3 playback path.
    // The previous implementation rerouted every track through WebAudio even when
    // LP enhancement was OFF; a suspended/broken context could produce silent playback.
    // Keep native HTMLAudioElement -> browser output until LP is explicitly reworked.
    if(lpToggle){lpToggle.checked=false;lpToggle.disabled=true;}
    global.setTL3LpEnhanced=async function(enabled){
      if(enabled && lpToggle) lpToggle.checked=false;
      return false;
    };
    const ms=new MediaSource(),url=URL.createObjectURL(ms);
    let sb=null,stopped=false,next=0,appendBusy=false;
    const cache=new Map();
    let licensePromise=null,chargePromise=null,charged=false;
    const starts=[];
    let t=0;for(let i=0;i<N;i++){starts.push(t);t+=durations[i]||1000;}
    const getSessionLicense=()=>{
      if(!licensePromise){
        const q='?segment=0&session_id='+encodeURIComponent(sessionId);
        licensePromise=json(API+'/api/v1/tl3/code/'+encodeURIComponent(data.file_id)+q,{headers:auth()});
      }
      return licensePromise;
    };
    const fetchSegment=async n=>{
      if(cache.has(n))return cache.get(n);
      const p=(async()=>{
        const traceStart=performance.now(),q='?segment='+(n-1)+'&session_id='+encodeURIComponent(sessionId);
        const segmentStart=performance.now();
        const segmentPromise=fetchRetry(API+'/api/v1/tl3/segment/'+encodeURIComponent(data.file_id)+q,{headers:auth()},'TL3 segment '+n).then(async resp=>{
          const headers={status:resp.status,bytes:Number(resp.headers.get('content-length')||0)};
          if(!resp.ok)throw new Error('TL3 v4 segment '+n+' HTTP '+resp.status);
          const cipher=new Uint8Array(await resp.arrayBuffer());headers.bytes=cipher.byteLength;
          headers.ms=Math.round(performance.now()-segmentStart);return {cipher,headers};
        });
        const codePromise=getSessionLicense().then(license=>{
          if(n===1)console.info('[TL3v4][TRACE] session-license',{segment:1,cost:license.cost});
          return license;
        });
        const [{cipher,headers:segment},license]=await Promise.all([segmentPromise,codePromise]);
        const decryptStart=performance.now();
        const previous=unhex(tokens[n-1]);
        const lic=unhex(String(license.lic_n||''));
        if(previous.length!==32||lic.length!==32)throw new Error('TL3 v4 license/token 길이가 올바르지 않습니다.');
        const index=n,startMs=starts[n-1],endMs=startMs+(durations[n-1]||1000);
        const aad={profile:'TL3-SPINE-1',fid:h.fid,file_id:Number(h.file_id),share_id:String(h.share_id),index:index,start_ms:startMs,end_ms:endMs,previous:hex(previous),rights_digest:h.rights_digest};
        const key=await deriveKey(lic,previous,index);
        const plain=new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:ivFor(unhex(h.nonce_prefix),index),additionalData:enc(JSON.stringify(aad)),tagLength:128},key,cipher));
        console.info('[TL3v4][TRACE] segment-ready',n,{segment,parallel_ms:Math.round(performance.now()-traceStart),decrypt_ms:Math.round(performance.now()-decryptStart),plain_bytes:plain.byteLength});
        return {plain,duration:durations[n-1]||1000,license};
      })();
      cache.set(n,p);return p;
    };
    async function appendSegment(n,seg){
      if(stopped)return;
      const appendStart=performance.now();
      await new Promise((resolve,reject)=>{
        const cleanup=()=>{sb.removeEventListener('updateend',end);sb.removeEventListener('error',fail);};
        const end=()=>{cleanup();const ranges=[];for(let i=0;i<sb.buffered.length;i++)ranges.push([Number(sb.buffered.start(i).toFixed(2)),Number(sb.buffered.end(i).toFixed(2))]);console.info('[TL3v4][TRACE] append',n,{ms:Math.round(performance.now()-appendStart),audio_time:Number(audio.currentTime.toFixed(2)),ready_state:audio.readyState,buffered:ranges});resolve();},fail=()=>{cleanup();reject(new Error('TL3 v4 appendBuffer failed @'+n));};
        sb.addEventListener('updateend',end,{once:true});sb.addEventListener('error',fail,{once:true});
        try{sb.appendBuffer(seg.plain);}catch(e){cleanup();reject(e);}
      });
      next=n;
      cache.delete(n);
    }
    let pipelineErrorReported=false;
    async function reportPipelineError(error){
      if(pipelineErrorReported)return;
      pipelineErrorReported=true;
      onError(error);
    }
    let playbackStarted=false;
    let bufferedDurationMs=0;
    const START_BUFFER_MS=8000;
    async function startAudiblePlayback(){
      if(playbackStarted||stopped)return;
      playbackStarted=true;
      try{
        await audio.play();
        console.info('[TL3v4] playback started with initial buffer',{
          buffered_ms:bufferedDurationMs,
          total_segments:N
        });
      }catch(e){
        playbackStarted=false;
        throw new Error('오디오 재생을 시작하지 못했습니다: '+(e&&e.message||e));
      }
    }
    async function pump(){
      if(appendBusy||stopped)return;
      appendBusy=true;
      try{
        // Start after a safe initial buffer; keep appending the remaining track
        // while audio is playing. Do not wait for all 100+ segments before sound.
        const batchSize=2;
        for(let first=1;first<=N;first+=batchSize){
          if(stopped)return;
          const count=Math.min(batchSize,N-first+1);
          const batch=await Promise.all(Array.from({length:count},(_,i)=>fetchSegment(first+i)));
          if(stopped)return;
          for(let i=0;i<batch.length;i++){
            if(stopped)return;
            const segmentNumber=first+i;
            await appendSegment(segmentNumber,batch[i]);
            bufferedDurationMs+=Number(batch[i].duration)||Number(durations[segmentNumber-1])||1000;
          }
          if(!playbackStarted&&bufferedDurationMs>=START_BUFFER_MS){
            await startAudiblePlayback();
          }
        }
        if(stopped)return;
        if(next!==N)throw new Error('TL3 전체 음원 버퍼 구성이 완료되지 않았습니다.');
        if(!playbackStarted)await startAudiblePlayback();
        if(ms.readyState==='open')ms.endOfStream();
      }catch(e){
        if(stopped)return;
        await reportPipelineError(e);
        throw e;
      }finally{appendBusy=false;}
    }
    async function chargeOnce(){
      if(charged)return;
      if(chargePromise)return chargePromise;
      chargePromise=(async()=>{
        const response=await fetchRetry(API+'/api/v1/tl3/play/charge/'+encodeURIComponent(data.file_id),{
          method:'POST',headers:Object.assign({'Content-Type':'application/json'},auth()),
          body:JSON.stringify({session_id:sessionId})
        },'TL3 full-track charge');
        const d=await response.json().catch(()=>({}));
        if(!response.ok||!d.ok)throw new Error(d.error||('TL3 full-track charge HTTP '+response.status));
        charged=true;
        console.info('[TL3v4] one-time full-track charge confirmed',d);
        if(typeof opts.onCharge==='function')opts.onCharge(d);
        return d;
      })();
      try{return await chargePromise;}
      catch(e){chargePromise=null;haltChargeFailure(e);throw e;}
    }
    function haltChargeFailure(error){
      stopped=true;
      try{audio.pause();}catch(_){}
      if(lpController&&lpController.stop)lpController.stop().catch(()=>{});
      onError(error);
    }
    const maybeChargeOnAudiblePlayback=()=>{
      if(charged||chargePromise||audio.paused||audio.muted||audio.volume<=0||audio.readyState<3||audio.currentTime<0.05)return;
      chargeOnce().catch(e=>console.error('[TL3v4] full-track charge failed',e));
    };
    audio.addEventListener('playing',maybeChargeOnAudiblePlayback);
    audio.addEventListener('timeupdate',maybeChargeOnAudiblePlayback);
    return new Promise((resolve,reject)=>{
      ms.addEventListener('sourceopen',async()=>{
        try{
          sb=ms.addSourceBuffer('audio/mpeg');
          try{sb.mode='sequence';}catch(_){}
          for(const ev of ['waiting','stalled','playing','pause','ended','error'])audio.addEventListener(ev,()=>{const ranges=[];for(let i=0;i<audio.buffered.length;i++)ranges.push([Number(audio.buffered.start(i).toFixed(2)),Number(audio.buffered.end(i).toFixed(2))]);console.info('[TL3v4][TRACE] audio-'+ev,{time:Number(audio.currentTime.toFixed(2)),ready_state:audio.readyState,network_state:audio.networkState,buffered:ranges});});
          onReady({mediaSource:ms,header:h,sessionId});
          // The MediaSource URL is assigned once below; reloading here would reset
          // the SourceBuffer immediately after sourceopen.
          pump().catch(e=>{if(!stopped)console.error('[TL3v4] pipeline failed',e);});
          resolve({sessionId,header:h,mediaSource:ms,version:4});
        }catch(e){reject(e);}
      },{once:true});
      audio.src=url;audio.load();
    }).then(result=>{
      audio._tl3Stop=function(){if(stopped)return;stopped=true;try{audio.pause();}catch(_){};if(lpController&&lpController.stop)lpController.stop().catch(()=>{});try{if(ms.readyState==='open')ms.endOfStream();}catch(_){}};
      audio._tl3Confirm=audio._tl3Stop;
      audio._tl3Suspend=function(){return lpController&&lpController.suspend?lpController.suspend():Promise.resolve();};
      audio._tl3Resume=function(){return lpController&&lpController.resume?lpController.resume():Promise.resolve();};
      audio._tl3SegmentStop=audio._tl3Stop;
      return result;
    });
  }
  // V4 is the only supported online track player. Never fall back to V6/V7 legacy code.
  global.TL3V4Player=Object.freeze({playStream:playStream,version:'TL3-SPINE-1'});
})(window);
