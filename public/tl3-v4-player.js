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
    const lpControl=document.getElementById('lpEnhancedControl');
    let lpController=null;
    if(lpToggle){lpToggle.checked=false;lpToggle.disabled=true;}
    // LP is opt-in and only available for assets carrying an enabled LP profile.
    // Keep the native audio route untouched when the asset has no LP licence.
    global.setTL3LpEnhanced=async function(enabled){
      if(!lpToggle||!lpController||!lpController.available())return false;
      const ok=await lpController.setEnabled(!!enabled);
      lpToggle.checked=!!ok&&!!enabled&&lpController.enabled();
      if(lpControl)lpControl.title=lpToggle.checked
        ? 'LP Enhanced 실시간 처리가 적용 중입니다'
        : 'LP Enhanced 실시간 처리가 꺼져 있습니다';
      console.info('[LP-CHAIN] toggle', {requested:!!enabled,applied:lpToggle.checked,mode:lpController.mode()});
      return lpToggle.checked===!!enabled;
    };
    if(lpMeta&&lpMeta.enabled===true&&global.TL3LPChain&&typeof global.TL3LPChain.create==='function'){
      try{
        lpController=await global.TL3LPChain.create(audio,lpMeta,Number(h.duration_ms||0));
        const available=!!(lpController&&lpController.available&&lpController.available());
        if(lpToggle){
          lpToggle.checked=false;
          lpToggle.disabled=!available;
          if(lpControl)lpControl.title=available
            ? '체크하면 이 곡에 LP Enhanced 실시간 음질 처리를 적용합니다'
            : '이 브라우저에서 LP Enhanced 오디오 처리를 사용할 수 없습니다';
        }
        console.info('[LP-CHAIN] asset profile', {licensed:true,available,mode:lpController&&lpController.mode&&lpController.mode()});
      }catch(error){
        lpController=null;
        if(lpToggle){lpToggle.checked=false;lpToggle.disabled=true;}
        console.warn('[LP-CHAIN] initialization failed; native audio remains active',error);
      }
    }else{
      if(lpToggle){lpToggle.checked=false;lpToggle.disabled=true;}
      if(lpControl)lpControl.title='이 TL3 자산에는 LP Enhanced 라이선스가 없습니다';
    }
    const ms=new MediaSource(),url=URL.createObjectURL(ms);
    let sb=null,stopped=false,next=0,appendBusy=false;
    const cache=new Map();
    let licensePromise=null;
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
    const START_BUFFER_MS=1000;
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
        for(let first=1;first<=N;){
          if(stopped)return;
          // Start as soon as the first complete segment is appended; thereafter
          // fetch in larger groups so the buffer stays ahead of playback.
          const batchSize=first===1?1:4;
          const count=Math.min(batchSize,N-first+1);
          const batch=await Promise.all(Array.from({length:count},(_,i)=>fetchSegment(first+i)));
          if(stopped)return;
          for(let i=0;i<batch.length;i++){
            if(stopped)return;
            const segmentNumber=first+i;
            await appendSegment(segmentNumber,batch[i]);
            bufferedDurationMs+=Number(batch[i].duration)||Number(durations[segmentNumber-1])||1000;
          }
          if(!playbackStarted&&(first===1||bufferedDurationMs>=START_BUFFER_MS)){
            await startAudiblePlayback();
          }
          first+=count;
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
    // Bill only audible media-time progress. Pauses, buffering and seeks do not accrue TL.
    let billableMs=0,lastAudibleTime=null,lastMeteredSeconds=0,meterQueuedSeconds=0;
    let meterTimer=null,meterQueue=Promise.resolve(),meterFailed=false;
    function sampleAudiblePlayback(forceEnd){
      if(stopped||meterFailed)return;
      const active=(!audio.paused||!!forceEnd)&&!audio.seeking&&(!audio.ended||!!forceEnd)&&!audio.muted&&audio.volume>0&&audio.readyState>=2;
      if(!active){lastAudibleTime=null;return;}
      const now=Number(audio.currentTime);
      if(!Number.isFinite(now)){lastAudibleTime=null;return;}
      if(lastAudibleTime!==null){
        const delta=(now-lastAudibleTime)*1000;
        // Media currentTime advances only while the audio timeline plays.
        // Seeking/stalling events reset the sample baseline; do not discard valid
        // playback merely because a throttled browser timer ran late.
        if(delta>0)billableMs+=delta;
      }
      lastAudibleTime=now;
      const completed=Math.floor(billableMs/1000);
      if(completed>meterQueuedSeconds)queuePlaybackMeter(completed);
    }
    function queuePlaybackMeter(targetSeconds){
      if(targetSeconds<=meterQueuedSeconds||meterFailed)return;
      meterQueuedSeconds=targetSeconds;
      const playedMsForRequest=Math.floor(billableMs);
      meterQueue=meterQueue.then(async()=>{
        if(meterFailed)return;
        const response=await fetchRetry(API+'/api/v1/tl3/play/meter/'+encodeURIComponent(data.file_id),{
          method:'POST',headers:Object.assign({'Content-Type':'application/json'},auth()),
          body:JSON.stringify({session_id:sessionId,played_ms:playedMsForRequest})
        },'TL3 playback-time meter');
        const d=await response.json().catch(()=>({}));
        if(response.status===402&&d.stop){
          if(typeof opts.onMeter==='function')opts.onMeter(d);
          meterFailed=true;
          try{audio.pause();}catch(_){}
          const error=new Error(d.error||'보유 TL이 부족하여 재생을 중지합니다.');
          if(typeof opts.onInsufficient==='function')opts.onInsufficient(d);
          else onError(error);
          return;
        }
        if(!response.ok||!d.ok)throw new Error(d.error||('TL3 playback meter HTTP '+response.status));
        lastMeteredSeconds=Number(d.billed_seconds||0);
        if(typeof opts.onMeter==='function')opts.onMeter(d);
        console.info('[TL3v4] playback-time charge',d);
        if(d.stop){
          meterFailed=true;
          try{audio.pause();}catch(_){}
          const error=new Error('보유 TL이 부족하여 재생을 중지합니다.');
          if(typeof opts.onInsufficient==='function')opts.onInsufficient(d);
          else onError(error);
        }
      }).catch(error=>{
        meterFailed=true;
        console.error('[TL3v4] playback-time settlement failed',error);
        haltChargeFailure(error);
      });
    }
    function startMeterSampling(){
      lastAudibleTime=Number(audio.currentTime)||0;
      if(meterTimer===null)meterTimer=setInterval(sampleAudiblePlayback,100);
    }
    audio.addEventListener('playing',startMeterSampling);
    for(const ev of ['pause','waiting','stalled','seeking','seeked']){
      audio.addEventListener(ev,()=>{lastAudibleTime=null;});
    }
    function haltChargeFailure(error){
      stopped=true;
      if(meterTimer!==null){clearInterval(meterTimer);meterTimer=null;}
      try{audio.pause();}catch(_){}
      if(lpController&&lpController.stop)lpController.stop().catch(()=>{});
      onError(error);
    }
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
      audio._tl3End=async function(){
        sampleAudiblePlayback(true);
        const totalMs=Number(h.duration_ms)||durations.reduce((sum,value)=>sum+(Number(value)||0),0);
        // The ended event is authoritative: a completed track consumes exactly
        // ceil(duration seconds) TL, including its final partial second.
        if(totalMs>0&&audio.ended){
          billableMs=totalMs;
          queuePlaybackMeter(Math.ceil(totalMs/1000));
        }
        await meterQueue;
        return lastMeteredSeconds;
      };
      audio._tl3Stop=function(){if(stopped)return;sampleAudiblePlayback();if(meterTimer!==null){clearInterval(meterTimer);meterTimer=null;}stopped=true;try{audio.pause();}catch(_){};if(lpController&&lpController.stop)lpController.stop().catch(()=>{});try{if(ms.readyState==='open')ms.endOfStream();}catch(_){}};
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
