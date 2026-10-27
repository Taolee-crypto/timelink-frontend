/* TimeLink TL3 V5 Player — whole-container decrypt + audible-time TL settlement. */
(function(global){
  'use strict';
  const API=(global.TL3_API_BASE)||'https://api.timelink.digital';
  const enc=s=>new TextEncoder().encode(String(s));
  const token=()=>localStorage.getItem('tl_token')||'';
  const auth=()=>({'Authorization':'Bearer '+token()});
  const b64=s=>{const n=String(s||'').replace(/-/g,'+').replace(/_/g,'/');const r=atob(n+'='.repeat((4-n.length%4)%4));return Uint8Array.from(r,c=>c.charCodeAt(0));};
  const b64u=b=>{let s='';for(let i=0;i<b.length;i+=0x8000)s+=String.fromCharCode(...b.subarray(i,i+0x8000));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/g,'');};
  const sid=()=> 'tl3v5_'+Array.from(crypto.getRandomValues(new Uint8Array(24))).map(x=>x.toString(16).padStart(2,'0')).join('');
  function bytes(v){return v.buffer.slice(v.byteOffset,v.byteOffset+v.byteLength);}
  function u32(v,o){return (((v[o]<<24)|(v[o+1]<<16)|(v[o+2]<<8)|v[o+3])>>>0);}
  async function request(url,opts){
    const r=await fetch(url,opts||{headers:auth()});
    const d=await r.json().catch(()=>({}));
    if(!r.ok||d.ok===false){const e=new Error(d.error||('HTTP '+r.status));e.status=r.status;e.data=d;throw e;}
    return d;
  }
  async function playerDb(){
    return new Promise((resolve,reject)=>{
      const req=indexedDB.open('timelink-player-keys-v1',1);
      req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('credentials'))req.result.createObjectStore('credentials');};
      req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||new Error('Player 키 저장소를 열 수 없습니다.'));
    });
  }
  async function playerCredential(){
    const db=await playerDb();
    const existing=await new Promise((resolve,reject)=>{
      const req=db.transaction('credentials','readonly').objectStore('credentials').get('primary');
      req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);
    });
    if(existing&&existing.privateKey&&existing.playerId&&existing.publicKey){db.close();return existing;}
    const pair=await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},false,['deriveBits']);
    const pub=await crypto.subtle.exportKey('jwk',pair.publicKey);
    const playerId=Array.from(crypto.getRandomValues(new Uint8Array(24))).map(x=>x.toString(16).padStart(2,'0')).join('');
    const credential={playerId,privateKey:pair.privateKey,publicKey:{kty:'EC',crv:'P-256',x:pub.x,y:pub.y}};
    await new Promise((resolve,reject)=>{
      const tx=db.transaction('credentials','readwrite');tx.objectStore('credentials').put(credential,'primary');
      tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);
    });
    db.close();return credential;
  }
  let registeredKey='',registerPromise=null;
  async function unwrapAssetKey(fileId,shareId,sessionId,broadcastCountry,djStationId){
    const credential=await playerCredential();
    const cacheKey=token()+'|'+credential.playerId;
    if(registeredKey!==cacheKey||!registerPromise){
      registeredKey=cacheKey;
      registerPromise=request(API+'/api/v1/tl3/v5/player/register',{
        method:'POST',headers:Object.assign({'Content-Type':'application/json'},auth()),
        body:JSON.stringify({player_id:credential.playerId,public_key:credential.publicKey})
      }).catch(e=>{registerPromise=null;throw e;});
    }
    await registerPromise;
    const envelope=await request(API+'/api/v1/tl3/v5/session-license/'+encodeURIComponent(fileId),{
      method:'POST',headers:Object.assign({'Content-Type':'application/json'},auth()),
      body:JSON.stringify({player_id:credential.playerId,session_id:sessionId,...(broadcastCountry?{broadcast_country:broadcastCountry}:{}),...(djStationId?{dj_monitor:true,dj_station_id:djStationId}:{})})
    });
    if(djStationId&&(envelope.dj_monitor!==true||Number(envelope.dj_station_id)!==djStationId))throw new Error('DJ 모니터 재생 권한이 확인되지 않았습니다.');
    if(envelope.version!==1||envelope.algorithm!=='ECDH-P256/HKDF-SHA256/AES-256-GCM'||
       Number(envelope.file_id)!==Number(fileId)||String(envelope.session_id)!==sessionId||
       envelope.player_id!==credential.playerId||Number(envelope.expires_at)<=Math.floor(Date.now()/1000)){
      throw new Error('TL3 V5 Player 세션 라이선스의 기기·자산·세션 검증에 실패했습니다.');
    }
    const serverPublic=await crypto.subtle.importKey('jwk',envelope.ephemeral_public_key,{name:'ECDH',namedCurve:'P-256'},false,[]);
    const shared=new Uint8Array(await crypto.subtle.deriveBits({name:'ECDH',public:serverPublic},credential.privateKey,256));
    const infoText=['timelink:tl3:v5:player-session:v1',envelope.user_id,credential.playerId,fileId,String(shareId),sessionId,envelope.expires_at].join(':');
    const material=await crypto.subtle.importKey('raw',bytes(shared),'HKDF',false,['deriveKey']);
    const wrapKey=await crypto.subtle.deriveKey(
      {name:'HKDF',hash:'SHA-256',salt:bytes(b64(envelope.salt)),info:enc(infoText)},
      material,{name:'AES-GCM',length:256},false,['decrypt']
    );
    const key=await crypto.subtle.decrypt({
      name:'AES-GCM',iv:bytes(b64(envelope.nonce)),
      additionalData:enc(infoText+':'+envelope.aad_thumbprint),tagLength:128
    },wrapKey,bytes(b64(envelope.wrapped_license)));
    if(key.byteLength!==32)throw new Error('V5 콘텐츠 키 길이가 올바르지 않습니다.');
    return new Uint8Array(key);
  }
  async function resolve(id){
    const raw=String(id).split('/').pop().split('?')[0];
    // Creator links use tl3_<file_id>. Resolve the canonical file_id first,
    // then retry the exact persisted share_id for releases created by builds
    // that stored the prefixed identifier as their primary lookup key.
    const legacyFileId=/^tl3_(\d+)$/.exec(raw);
    if(legacyFileId){
      try{
        return await request(API+'/api/v1/tl3/v5/resolve/'+encodeURIComponent(legacyFileId[1])+'?by=file_id',{headers:auth()});
      }catch(fileLookupError){
        if(!fileLookupError||fileLookupError.status!==404)throw fileLookupError;
        return request(API+'/api/v1/tl3/v5/resolve/'+encodeURIComponent(raw)+'?by=share_id',{headers:auth()});
      }
    }
    return request(API+'/api/v1/tl3/v5/resolve/'+encodeURIComponent(raw)+'?by=share_id',{headers:auth()});
  }
  async function canPlay(id){
    try{const r=await resolve(id);return Number(r.version)===5;}
    catch(e){
      // A tl3_<file_id> URL is an explicit Creator/V5 link. Never silently
      // downgrade it to the legacy V4 player when its V5 release is missing.
      if(e&&e.status===404&&!/^tl3_(\d+)$/.test(String(id).split('/').pop().split('?')[0]))return false;
      throw e;
    }
  }
  async function decryptContainer(container,contentKey,fileId,shareId){
    if(container.byteLength<32||container[0]!==0x54||container[1]!==0x4c||container[2]!==0x4e||container[3]!==0x4b||container[4]!==5)
      throw new Error('TL3 V5 컨테이너 헤더가 올바르지 않습니다.');
    const headerLength=u32(container,5);
    if(headerLength<2||headerLength>65536||9+headerLength+16>container.byteLength)
      throw new Error('TL3 V5 공개 부트스트랩 길이가 올바르지 않습니다.');
    const headerBytes=container.subarray(9,9+headerLength);
    let header;try{header=JSON.parse(new TextDecoder().decode(headerBytes));}catch(_){throw new Error('TL3 V5 부트스트랩 정보가 손상되었습니다.');}
    if(header.profile!=='TL3-V5'||header.algorithm!=='AES-256-GCM')throw new Error('지원하지 않는 TL3 V5 암호화 규격입니다.');
    const nonce=b64(header.nonce),cipher=container.subarray(9+headerLength);
    if(Number(header.ciphertext_bytes)!==cipher.byteLength)throw new Error('TL3 V5 암호문 길이가 일치하지 않습니다.');
    const key=await crypto.subtle.importKey('raw',bytes(contentKey),{name:'AES-GCM'},false,['decrypt']);
    const aad=container.subarray(0,9+headerLength);
    const plain=new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(nonce),additionalData:bytes(aad),tagLength:128},key,bytes(cipher)));
    if(plain.byteLength<4)throw new Error('TL3 V5 내부 매니페스트가 없습니다.');
    const manifestLength=u32(plain,0);
    if(manifestLength<=0||4+manifestLength>=plain.byteLength)throw new Error('TL3 V5 내부 매니페스트 길이가 올바르지 않습니다.');
    let manifest;try{manifest=JSON.parse(new TextDecoder().decode(plain.subarray(4,4+manifestLength)));}catch(_){throw new Error('TL3 V5 내부 매니페스트 인증 후 파싱에 실패했습니다.');}
    if(manifest.profile!=='TL3-V5'||Number(manifest.version)!==5||
       Number(manifest.file_id)!==Number(fileId)||String(manifest.share_id)!==String(shareId)||
       manifest.rights_confirmed!==true||!Number.isFinite(Number(manifest.duration_ms))||Number(manifest.duration_ms)<=0){
      throw new Error('TL3 V5 내부 권리정보 또는 자산 식별정보가 일치하지 않습니다.');
    }
    const mp3=plain.slice(4+manifestLength);
    const digest=new Uint8Array(await crypto.subtle.digest('SHA-256',bytes(mp3)));
    const hash=Array.from(digest).map(v=>v.toString(16).padStart(2,'0')).join('');
    if(hash!==String(manifest.source_sha256))throw new Error('복호화된 MP3 원본 무결성 검증에 실패했습니다.');
    if(mp3.byteLength<128)throw new Error('복호화된 MP3 데이터가 비어 있거나 손상되었습니다.');
    return {manifest,mp3};
  }
  async function playStream(id,audio,opts){
    opts=opts||{};
    const onError=opts.onError||function(){},onReady=opts.onReady||function(){};
    const data=await resolve(id);
    if(Number(data.version)!==5)throw new Error('TL3 V5 자산이 아닙니다.');
    const fileId=Number(data.file_id),shareId=String(data.share_id);
    let sessionId=String(opts.sessionId||sid());
    const broadcastCountry=String(opts.broadcastCountry||'').toUpperCase();
    const djStationId=Number(opts.djStationId||0);
    if(djStationId&&(!Number.isSafeInteger(djStationId)||djStationId<=0))throw new Error('Invalid DJ station');
    const nonBillable=!!broadcastCountry||djStationId>0;
    if(broadcastCountry && !['KR','JP','US','CN','TH','VN'].includes(broadcastCountry))throw new Error('Invalid broadcast country');
    const pre=nonBillable?{can_play:true}:await request(API+'/api/v1/tl3/play/preflight/'+encodeURIComponent(fileId),{
      method:'POST',headers:auth()
    });
    if(!pre.can_play)throw new Error('TL이 부족하여 TL3 V5를 재생할 수 없습니다.');
    if(pre.billing_mode==='time_free'){sessionId='tf_'+sessionId.replace(/^(tf_|sub_)/,'');if(sessionId.length>100)throw new Error('TIME FREE 재생 세션이 너무 깁니다.');}
    if(pre.billing_mode==='subscription'){sessionId='sub_'+sessionId.replace(/^sub_/,'');if(sessionId.length>100)throw new Error('구독 재생 세션이 너무 깁니다.');}
    if(opts.onBillingMode)opts.onBillingMode(pre);
    const contentKey=await unwrapAssetKey(fileId,shareId,sessionId,broadcastCountry,djStationId);
    const response=await fetch(API+'/api/v1/tl3/v5/container/'+encodeURIComponent(fileId)+'?session_id='+encodeURIComponent(sessionId),{headers:auth(),cache:'no-store'});
    if(!response.ok)throw new Error('TL3 V5 컨테이너 다운로드 실패 (HTTP '+response.status+')');
    const container=new Uint8Array(await response.arrayBuffer());
    // Bind the downloaded file container to the immutable server-side V5 release
    // manifest before handing it to the existing authenticated decryptor.
    const expectedContainerHash=String(data.container_sha256||'').toLowerCase();
    if(!/^[a-f0-9]{64}$/.test(expectedContainerHash)){
      contentKey.fill(0);
      throw new Error('TL3 V5 파일 컨테이너의 인증 지문이 없습니다.');
    }
    const actualContainerHash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes(container))))
      .map(v=>v.toString(16).padStart(2,'0')).join('');
    if(actualContainerHash!==expectedContainerHash){
      contentKey.fill(0);
      throw new Error('TL3 V5 파일 컨테이너의 서버 인증 지문이 일치하지 않습니다.');
    }
    const decoded=await decryptContainer(container,contentKey,fileId,shareId);
    contentKey.fill(0);
    const manifest=decoded.manifest,totalMs=Number(manifest.duration_ms);
    let lpController=null;
    // Creator LP license is automatic; legacy V5 assets used lp_* field names.
    const rawLp=manifest.lp_meta;
    const lpMeta=rawLp&&typeof rawLp==='object'?{
      ...rawLp,
      enabled:rawLp.enabled===true||rawLp.lp_enabled===true,
      seed:rawLp.seed??rawLp.lp_seed,
      g:rawLp.g??rawLp.lp_g,
      fs:rawLp.fs??rawLp.lp_fs,
      n:rawLp.n??rawLp.lp_n,
      version:rawLp.version??rawLp.lp_version
    }:null;
    if(lpMeta&&lpMeta.enabled===true){
      if(global.TL3LPChain&&typeof global.TL3LPChain.create==='function'){
        try{
          lpController=await global.TL3LPChain.create(audio,lpMeta,totalMs);
          if(lpController&&lpController.available&&lpController.available()){
            const applied=await lpController.setEnabled(true);
            if(!applied)console.warn('[TL3V5][LP] automatic LP processing could not be enabled');
          }else console.warn('[TL3V5][LP] LP processing unavailable');
        }catch(e){console.warn('[TL3V5][LP] automatic initialization failed; native audio retained',e);}
      }else console.warn('[TL3V5][LP] LP processing engine missing');
    }
    const blobUrl=URL.createObjectURL(new Blob([decoded.mp3],{type:'audio/mpeg'}));
    let stopped=false,meterTimer=null,billableMs=0,lastTime=null,meterQueued=0,lastBilled=0,meterQueue=Promise.resolve(),meterFailed=false,buffering=false;
    // The media clock is the billing source. Sample it both on a short
    // interval and on timeupdate so throttled browser timers cannot suppress
    // whole-second settlements. Pause/buffering boundaries flush only the
    // media time elapsed before the boundary; seeking never bills a time jump.
    let lastProgressSeconds=-1;
    function publishProgress(complete){
      const elapsedMs=Math.min(totalMs,Math.max(0,billableMs));
      const seconds=complete?Math.ceil(totalMs/1000):Math.floor((elapsedMs+1e-6)/1000);
      if(seconds===lastProgressSeconds)return;
      lastProgressSeconds=seconds;
      if(opts.onProgress)opts.onProgress({played_ms:elapsedMs,billed_seconds:seconds,complete:!!complete});
    }
    function sample(force){
      if(stopped||meterFailed||buffering||audio.seeking||audio.ended&&!force||audio.muted||audio.volume<=0||audio.paused&&!force){lastTime=null;return;}
      const now=Number(audio.currentTime);
      if(!Number.isFinite(now)){lastTime=null;return;}
      if(lastTime!==null){
        const delta=(now-lastTime)*1000;
        if(delta>0)billableMs=Math.min(totalMs,billableMs+delta);
      }
      lastTime=now;
      if(pre.billing_mode==='time_free')billableMs=Math.min(billableMs,Number(pre.time_free_remaining_ms)||0);
      publishProgress(false);
      const target=Math.floor((billableMs+1e-6)/1000);
      if(!nonBillable && target>meterQueued)queueMeter(target,false);
      if(pre.billing_mode==='time_free'&&billableMs>=pre.time_free_remaining_ms){queueMeter(billableMs/1000,false);audio.pause();}
    }
    function queueMeter(target,complete){
      if(nonBillable||target<=meterQueued||meterFailed)return;
      meterQueued=target;
      const playedMs=complete?totalMs:Math.min(totalMs,Math.floor(billableMs));
      meterQueue=meterQueue.then(async()=>{
        if(meterFailed)return;
        const r=await fetch(API+'/api/v1/tl3/play/meter/'+encodeURIComponent(fileId),{
          method:'POST',headers:Object.assign({'Content-Type':'application/json'},auth()),
          body:JSON.stringify({session_id:sessionId,played_ms:playedMs})
        });
        const d=await r.json().catch(()=>({}));
        if(r.status===402&&d.stop){meterFailed=true;try{audio.pause();}catch(_){};if(opts.onInsufficient)opts.onInsufficient(d);else onError(new Error(d.error||'TL이 부족합니다.'));return;}
        if(!r.ok||!d.ok)throw new Error(d.error||('TL3 V5 정산 HTTP '+r.status));
        lastBilled=Number(d.billed_seconds||0);
        if(opts.onMeter)opts.onMeter(d);
        if(d.stop){meterFailed=true;try{audio.pause();}catch(_){};if(opts.onInsufficient)opts.onInsufficient(d);}
      }).catch(e=>{meterFailed=true;try{audio.pause();}catch(_){};onError(e);});
    }
    const onPlaying=()=>{buffering=false;lastTime=Number(audio.currentTime)||0;if(meterTimer===null)meterTimer=setInterval(sample,100);};
    const onBuffering=()=>{sample(true);buffering=true;lastTime=null;};
    const onPause=()=>{sample(true);lastTime=null;};
    const onSeeking=()=>{lastTime=null;};
    const onSeeked=()=>{lastTime=Number(audio.currentTime)||0;};
    const onTimeUpdate=()=>sample(false);
    const onEnded=()=>{sample(true);if(pre.billing_mode==='time_free'){publishProgress(false);queueMeter(billableMs/1000,false);}else{billableMs=totalMs;publishProgress(true);queueMeter(Math.ceil(totalMs/1000),true);}};
    audio.addEventListener('playing',onPlaying);
    audio.addEventListener('pause',onPause);
    audio.addEventListener('waiting',onBuffering);
    audio.addEventListener('stalled',onBuffering);
    audio.addEventListener('seeking',onSeeking);
    audio.addEventListener('seeked',onSeeked);
    audio.addEventListener('timeupdate',onTimeUpdate);
    audio.addEventListener('ended',onEnded);
    audio.preload='auto';
    audio.src=blobUrl;
    audio.load();
    const canplay=await new Promise((resolve,reject)=>{
      const ok=()=>{cleanup();resolve(true);},fail=()=>{cleanup();reject(new Error('복호화된 MP3를 브라우저가 읽지 못했습니다.'));};
      const cleanup=()=>{audio.removeEventListener('canplay',ok);audio.removeEventListener('error',fail);};
      audio.addEventListener('canplay',ok,{once:true});audio.addEventListener('error',fail,{once:true});
      if(audio.readyState>=2)ok();
    });
    if(broadcastCountry&&opts.broadcastStartAt){
      const started=Date.parse(opts.broadcastStartAt);
      if(Number.isFinite(started))audio.currentTime=Math.max(0,Math.min((totalMs-1000)/1000,(Date.now()-started)/1000));
    }
    if(djStationId&&Number.isFinite(Number(opts.startOffsetSeconds)))audio.currentTime=Math.max(0,Math.min(totalMs/1000-.1,Number(opts.startOffsetSeconds)));
    try{await audio.play();}catch(e){throw new Error('음원 재생을 시작하지 못했습니다: '+(e&&e.message||e));}
    audio._tl3End=async function(){
      sample(true);
      if(audio.ended){if(pre.billing_mode==='time_free'){publishProgress(false);queueMeter(billableMs/1000,false);}else{billableMs=totalMs;publishProgress(true);queueMeter(Math.ceil(totalMs/1000),true);}}
      if(meterTimer!==null){clearInterval(meterTimer);meterTimer=null;}
      await meterQueue;
      return lastBilled;
    };
    audio._tl3Stop=function(){
      if(stopped)return audio._tl3StopPromise;
      // Flush accrued audible time before closing the session. The server
      // returns unused TL to the original wallet buckets atomically and rejects future meters.
      sample(true);
      if(!nonBillable&&!meterFailed&&billableMs>0)queueMeter(Number((billableMs/1000).toFixed(3)),false);
      const closingMeter=meterQueue;
      audio._tl3StopPromise=closingMeter.then(async()=>{
        if(nonBillable||meterFailed||(audio.ended&&pre.billing_mode!=='time_free'))return;
        const response=await fetch(API+'/api/v1/tl3/play/stop/'+encodeURIComponent(fileId),{
          method:'POST',headers:Object.assign({'Content-Type':'application/json'},auth()),
          body:JSON.stringify({session_id:sessionId})
        });
        const data=await response.json().catch(()=>({}));
        if(!response.ok||!data.ok)throw new Error(data.error||'중도 종료 정산 실패');
        if(opts.onStopSettlement)opts.onStopSettlement(data);
      }).catch(function(error){audio._tl3StopError=error;onError(error);});
      if(stopped)return audio._tl3StopPromise;stopped=true;
      if(meterTimer!==null){clearInterval(meterTimer);meterTimer=null;}
      try{audio.pause();}catch(_){}
      if(lpController&&lpController.stop)lpController.stop().catch(()=>{});
      try{audio.removeEventListener('playing',onPlaying);audio.removeEventListener('pause',onPause);audio.removeEventListener('waiting',onBuffering);audio.removeEventListener('stalled',onBuffering);audio.removeEventListener('seeking',onSeeking);audio.removeEventListener('seeked',onSeeked);audio.removeEventListener('timeupdate',onTimeUpdate);audio.removeEventListener('ended',onEnded);}catch(_){}
      try{audio.removeAttribute('src');audio.load();}catch(_){}
      URL.revokeObjectURL(blobUrl);
      return audio._tl3StopPromise;
    };
    audio._tl3Confirm=audio._tl3Stop;
    audio._tl3Suspend=()=>lpController&&lpController.suspend?lpController.suspend():Promise.resolve();
    audio._tl3Resume=()=>lpController&&lpController.resume?lpController.resume():Promise.resolve();
    onReady({header:manifest,sessionId,version:5});
    return {sessionId,header:manifest,version:5};
  }
  global.TL3V5Player=Object.freeze({version:'TL3-V5',canPlay:canPlay,playStream:playStream});
})(window);


