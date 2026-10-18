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
  async function json(url,opts){
    const r=await fetch(url,opts||{headers:auth()});
    const d=await r.json().catch(()=>({}));
    if(!r.ok||d.ok===false)throw new Error(d.error||('HTTP '+r.status));
    return d;
  }
  function waitForPlayback(audio,target,stopped){
    return new Promise(resolve=>{
      if(stopped()||audio.currentTime>=target-0.04){resolve();return;}
      const done=()=>{audio.removeEventListener('timeupdate',check);audio.removeEventListener('ended',check);resolve();};
      const check=()=>{if(stopped()||audio.currentTime>=target-0.04||audio.ended)done();};
      audio.addEventListener('timeupdate',check);
      audio.addEventListener('ended',check);
      const timer=setInterval(()=>{check();if(stopped()||audio.currentTime>=target-0.04||audio.ended){clearInterval(timer);done();}},200);
    });
  }
  async function playStream(id,audio,opts){
    opts=opts||{};
    const onSegment=opts.onSegment||function(){};
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
    if(lpMeta&&lpMeta.enabled&&global.TL3LPChain){
      try{
        lpController=await global.TL3LPChain.create(audio,lpMeta,h.duration_ms);
        if(lpController&&lpController.available()&&lpToggle)lpToggle.disabled=false;
      }catch(e){console.warn('[TL3v4] LP Connect runtime unavailable',e);}
    }
    global.setTL3LpEnhanced=async function(enabled){
      if(!lpController||typeof lpController.setEnabled!=='function')return false;
      const ok=await lpController.setEnabled(!!enabled);
      if(lpToggle&&!ok)lpToggle.checked=false;
      return ok;
    };
    const ms=new MediaSource(),url=URL.createObjectURL(ms);
    let sb=null,stopped=false,next=0,appendBusy=false;
    const cache=new Map(),settled=new Set();
    const starts=[];
    let t=0;for(let i=0;i<N;i++){starts.push(t);t+=durations[i]||1000;}
    const fetchSegment=async n=>{
      if(cache.has(n))return cache.get(n);
      const p=(async()=>{
        const q='?segment='+(n-1)+'&session_id='+encodeURIComponent(sessionId);
        const [resp,license]=await Promise.all([
          fetch(API+'/api/v1/tl3/segment/'+encodeURIComponent(data.file_id)+q,{headers:auth()}),
          json(API+'/api/v1/tl3/code/'+encodeURIComponent(data.file_id)+q,{headers:auth()})
        ]);
        if(!resp.ok)throw new Error('TL3 v4 segment '+n+' HTTP '+resp.status);
        const cipher=new Uint8Array(await resp.arrayBuffer());
        const previous=unhex(tokens[n-1]);
        const lic=unhex(String(license.lic_n||''));
        if(previous.length!==32||lic.length!==32)throw new Error('TL3 v4 license/token 길이가 올바르지 않습니다.');
        const index=n,startMs=starts[n-1],endMs=startMs+(durations[n-1]||1000);
        const aad={profile:'TL3-SPINE-1',fid:h.fid,file_id:Number(h.file_id),share_id:String(h.share_id),index:index,start_ms:startMs,end_ms:endMs,previous:hex(previous),rights_digest:h.rights_digest};
        const key=await deriveKey(lic,previous,index);
        const plain=new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:ivFor(unhex(h.nonce_prefix),index),additionalData:enc(JSON.stringify(aad)),tagLength:128},key,cipher));
        return {plain,duration:durations[n-1]||1000,license};
      })();
      cache.set(n,p);return p;
    };
    const settle=async n=>{
      if(settled.has(n)||stopped)return;
      const seg=await cache.get(n);
      const end=(starts[n-1]+seg.duration)/1000;
      await waitForPlayback(audio,end,()=>stopped);
      if(stopped)return;
      const d=await json(API+'/api/v1/tl3/segment/confirm/'+encodeURIComponent(data.file_id),{
        method:'POST',headers:Object.assign({'Content-Type':'application/json'},auth()),
        body:JSON.stringify({session_id:sessionId,played_seconds:seg.duration/1000,next_segment:n<N?n:undefined})
      });
      settled.add(n);
      onSegment({index:n-1,seconds:seg.duration/1000,remaining:d.wallet_tl,wallet_tl:d.wallet_tl,asset_remaining_tl:d.asset_remaining_tl});
    };
    async function pump(){
      if(appendBusy||stopped)return;
      appendBusy=true;
      const settlements=new Map();
      try{
        while(next<N&&!stopped){
          const n=next+1;
          // Keep exactly one metered prefetch reservation ahead. The next
          // reservation is not requested until the previous segment settles.
          if(n>=3 && settlements.has(n-2)) await settlements.get(n-2);
          const seg=await fetchSegment(n);
          await new Promise((resolve,reject)=>{
            const cleanup=()=>{sb.removeEventListener('updateend',end);sb.removeEventListener('error',fail);};
            const end=()=>{cleanup();resolve();},fail=()=>{cleanup();reject(new Error('TL3 v4 appendBuffer failed @'+n));};
            sb.addEventListener('updateend',end,{once:true});sb.addEventListener('error',fail,{once:true});
            try{sb.appendBuffer(seg.plain);}catch(e){cleanup();reject(e);}
          });
          next++;
          if(audio.paused&&n===1){try{await audio.play();}catch(e){console.warn('[TL3v4] play request rejected',e);}}
          if(n>=2 && settlements.has(n-1)) await settlements.get(n-1);
          if(n<N) await fetchSegment(n+1);
          settlements.set(n,settle(n).catch(e=>{console.error('[TL3v4] settlement failed',n,e);onError(e);throw e;}));
        }
        if(next===N&&!stopped&&ms.readyState==='open'){try{ms.endOfStream();}catch(_){}}
        if(N>0&&settlements.has(N)) await settlements.get(N);
      }catch(e){onError(e);throw e;}
      finally{appendBusy=false;}
    }
    return new Promise((resolve,reject)=>{
      ms.addEventListener('sourceopen',async()=>{
        try{
          sb=ms.addSourceBuffer('audio/mpeg');
          try{sb.mode='sequence';}catch(_){}
          onReady({mediaSource:ms,header:h,sessionId});
          // The MediaSource URL is assigned once below; reloading here would reset
          // the SourceBuffer immediately after sourceopen.
          pump().catch(e=>{console.error('[TL3v4] pipeline failed',e);onError(e);});
          resolve({sessionId,header:h,mediaSource:ms,version:4});
        }catch(e){reject(e);}
      },{once:true});
      audio.src=url;audio.load();
    }).then(result=>{
      audio._tl3Stop=function(){if(stopped)return;stopped=true;try{audio.pause();}catch(_){};if(lpController&&lpController.stop)lpController.stop().catch(()=>{});try{if(ms.readyState==='open')ms.endOfStream();}catch(_){};};
      audio._tl3Confirm=audio._tl3Stop;
      audio._tl3Suspend=function(){return lpController&&lpController.suspend?lpController.suspend():Promise.resolve();};
      audio._tl3Resume=function(){return lpController&&lpController.resume?lpController.resume():Promise.resolve();};
      audio._tl3SegmentStop=audio._tl3Stop;
      return result;
    });
  }
  async function playStreamOrLegacy(id,audio,opts){
    const rawId=String(id).split('/').pop().split('?')[0];
    const probe=await fetch(API+'/api/v1/tl3/spine/header/'+encodeURIComponent(rawId),{headers:auth()});
    if(probe.status===404){
      if(global.TL3&&typeof global.TL3.playStream==='function')return global.TL3.playStream(id,audio,opts);
      throw new Error('TL3 v4 자산을 찾을 수 없고 기존 플레이어도 없습니다.');
    }
    if(!probe.ok){const d=await probe.json().catch(()=>({}));throw new Error(d.error||('TL3 v4 header HTTP '+probe.status));}
    return playStream(id,audio,opts);
  }
  global.TL3V4Player=Object.freeze({playStream:playStream,playStreamOrLegacy:playStreamOrLegacy,version:'TL3-SPINE-1'});
})(window);
