(()=>{'use strict';
const API=window.TL3_API_BASE||'https://api.timelink.digital';
const $=id=>document.getElementById(id);
const audio=$('radioAudio'),state=$('radioState'),now=$('radioNow'),start=$('radioStart'),stop=$('radioStop');
const country=$('country'),language=$('language'),genre=$('genre'),channel=$('storeChannel'),results=$('results');
const ids=['country','language','business','daypart','weather','mood','genre'];
let tracks=[],index=0,live=null,timer=null,playing=false,objectUrl=null,meterPromise=Promise.resolve();
const token=()=>localStorage.getItem('tl_token')||localStorage.getItem('token')||localStorage.getItem('access_token')||'';
function message(v){state.textContent=v}
async function api(path,options={}){
 const authorization=token();if(!authorization)throw Error('로그인 후 매장 방송을 이용할 수 있습니다.');
 const response=await fetch(API+path,{...options,headers:{Authorization:'Bearer '+authorization,...(options.headers||{})},cache:'no-store'});
 const data=await response.json().catch(()=>({}));
 if(!response.ok||!data.ok){
  const errs={STORE_OWNER_REQUIRED:'선택한 매장의 사업자 소유자 계정으로 로그인해주세요.',STORE_TIME_INSUFFICIENT:'매장 방송 이용 시간이 부족합니다. 이용권을 충전해주세요.',STORE_PLAYER_ALREADY_ACTIVE:'이 매장에서 다른 방송이 진행 중입니다.',STORE_TRACK_NOT_READY:'음원이 변환·검증되지 않아 재생할 수 없습니다.',STORE_LICENSE_FAILED:'암호화된 음악 재생권을 불러오지 못했습니다.'};
  throw Error(errs[data.code||data.error]||data.code||data.error||'서버 연결 오류');
 }
 return data;
}
async function post(path,body){return api(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})}
const toBytes=s=>{const value=atob(s.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-s.length%4)%4));return Uint8Array.from(value,c=>c.charCodeAt(0))};
const textDecoder=new TextDecoder(),textEncoder=new TextEncoder();
async function decodeTL3(license,keys){
 const ephemeral=await crypto.subtle.importKey('jwk',license.ephemeral_public_key,{name:'ECDH',namedCurve:'P-256'},false,[]);
 const bits=await crypto.subtle.deriveBits({name:'ECDH',public:ephemeral},keys.privateKey,256);
 const hkdf=await crypto.subtle.importKey('raw',bits,'HKDF',false,['deriveKey']);
 const info=textEncoder.encode(license.info);
 const wrapping=await crypto.subtle.deriveKey({name:'HKDF',hash:'SHA-256',salt:toBytes(license.salt),info},hkdf,{name:'AES-GCM',length:256},false,['decrypt']);
 const rawKey=await crypto.subtle.decrypt({name:'AES-GCM',iv:toBytes(license.nonce),additionalData:info},wrapping,toBytes(license.wrapped_content_key));
 const key=await crypto.subtle.importKey('raw',rawKey,'AES-GCM',false,['decrypt']);
 const response=await fetch(API+license.container_url,{headers:{Authorization:'Bearer '+token()},cache:'no-store'});
 if(!response.ok)throw Error('암호화된 매장 음악 파일을 받을 수 없습니다.');
 const cipher=new Uint8Array(await response.arrayBuffer());
 if(cipher.length<64||cipher[0]!==84||cipher[1]!==76||cipher[2]!==78||cipher[3]!==75||cipher[4]!==5)throw Error('TL3 V5 컨테이너가 아닙니다.');
 const view=new DataView(cipher.buffer,cipher.byteOffset,cipher.byteLength);
 const bootSize=view.getUint32(5,false),end=9+bootSize;
 if(bootSize<20||bootSize>2048||end>=cipher.length)throw Error('TL3 헤더 손상');
 const boot=JSON.parse(textDecoder.decode(cipher.subarray(9,end)));
 if(boot.profile!=='TL3-V5'||boot.algorithm!=='AES-256-GCM')throw Error('TL3 암호화 규격 불일치');
 const plain=new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:toBytes(boot.nonce),additionalData:cipher.subarray(0,end)},key,cipher.subarray(end)));
 const pv=new DataView(plain.buffer,plain.byteOffset,plain.byteLength),manifestSize=pv.getUint32(0,false);
 if(manifestSize<40||manifestSize>65536||4+manifestSize>=plain.length)throw Error('TL3 음원 메타데이터 손상');
 const manifest=JSON.parse(textDecoder.decode(plain.subarray(4,4+manifestSize)));
 if(manifest.scope!=='commercial_broadcast_only'||manifest.track_key!==license.track_key||manifest.version!==5)throw Error('매장 전용 TL3 라이선스 불일치');
 return new Blob([plain.slice(4+manifestSize)],{type:'audio/mpeg'});
}
async function fetchOwnStores(){
 const list=await api('/api/cafe/my-channels');
 const rows=(Array.isArray(list.channels)?list.channels:[]).filter(x=>x.status==='active'&&x.channel_id);
 channel.replaceChildren();
 for(const x of rows){const opt=new Option(x.name||x.channel_id,x.channel_id);channel.add(opt)}
 const prev=localStorage.getItem('tilo_store_channel');
 if(prev&&rows.some(x=>x.channel_id===prev))channel.value=prev;
 if(!rows.length){message('사업자 등록된 내 매장을 먼저 개설해주세요.');start.disabled=true;return false}
 channel.addEventListener('change',()=>{localStorage.setItem('tilo_store_channel',channel.value);refreshMusic().catch(showError)});
 return true;
}
function showError(err){message(err?.message||String(err)||'오류가 발생했습니다.')}
async function refreshMusic(){
 if(!channel.value)return;
 const data=await api('/api/v5/store-music/queue?channel_id='+encodeURIComponent(channel.value)+'&genre=all');
 tracks=Array.isArray(data.tracks)?data.tracks:[];
 const active=genre.value;
 genre.replaceChildren(new Option('모든 매장 전용 음악','all'));
 for(const g of [...new Set(tracks.map(x=>x.genre).filter(Boolean))].sort())genre.add(new Option(g,g.toLowerCase()));
 if([...genre.options].some(o=>o.value===active))genre.value=active;
 renderTracks();
 now.textContent='매장 방송 이용 가능 시간 '+(Number(data.remaining_seconds||0)/3600).toLocaleString('ko-KR',{maximumFractionDigits:2})+'시간 · 매장 전용 TL3 '+tracks.length+'곡';
 start.disabled=tracks.length===0||!data.playback_enabled;
 if(!tracks.length)message('상업 방송 전용 음악 변환·등록을 확인하고 있습니다. 일반 공유 음원을 대체 재생하지 않습니다.');
 else if(!data.playback_enabled)message('이 매장의 방송 이용 시간이 없습니다. 이용권을 확인해주세요.');
 else message('방송 준비 완료 · 매장 전용 음악만 재생합니다.');
}
function selectedTracks(){return genre.value==='all'?tracks:tracks.filter(x=>String(x.genre).toLowerCase()===genre.value)}
function renderTracks(){
 const filtered=selectedTracks();
 results.replaceChildren();
 const heading=document.createElement('h3');heading.textContent='상업 방송 전용 TL3 · '+filtered.length+'곡';results.append(heading);
 if(!filtered.length){const p=document.createElement('p');p.textContent='현재 조건에 맞는 상업 방송 전용 음악이 준비되지 않았습니다.';results.append(p);return}
 for(const [i,x] of filtered.entries()){
  const row=document.createElement('div');row.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid #385477;padding:8px 0';
  const info=document.createElement('span');info.textContent=x.title+' — '+x.artist+' · '+x.genre+' · CC0';
  const btn=document.createElement('button');btn.type='button';btn.textContent='이 곡 듣기';btn.style.marginTop='0';
  btn.addEventListener('click',async()=>{if(playing)await endLive();playing=true;start.disabled=true;stop.disabled=false;index=i;await startTrack(filtered[index]).catch(async e=>{showError(e);await endLive()})});
  row.append(info,btn);results.append(row);
 }
}
function stopClock(){if(timer){clearInterval(timer);timer=null}}
function startClock(){
 stopClock();
 timer=setInterval(()=>{
  if(!live||!playing||audio.paused||audio.seeking||audio.readyState<3)return;
  live.playedSeconds=Math.min(live.reservedSeconds,live.playedSeconds+1);
  if(live.playedSeconds%3===0)sendMeter();
 },1000);
}
function sendMeter(){
 if(!live)return meterPromise;
 const sid=live.id,seconds=live.playedSeconds;
 meterPromise=meterPromise.catch(()=>{}).then(()=>post('/api/v5/store-music/meter',{session_id:sid,played_seconds:seconds}).catch(e=>{if(live&&live.id===sid)showError(e)}));
 return meterPromise;
}
async function endLive(){
 stopClock();audio.pause();
 if(live){await sendMeter();const id=live.id;try{const settled=await post('/api/v5/store-music/close',{session_id:id});message('방송 종료 · 실제 재생 '+settled.charged_seconds+'초 · 미사용 '+settled.refunded_seconds+'초 반환')}catch(e){showError(e)}live=null}
 audio.removeAttribute('src');audio.load();
 if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl=null}
 playing=false;start.disabled=tracks.length===0;stop.disabled=true;
}
async function startTrack(x){
 if(!x)throw Error('재생할 상업 방송 음원이 없습니다.');
 if(live)await endLive();
 const keys=await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},true,['deriveBits']);
 const publicKey=await crypto.subtle.exportKey('jwk',keys.publicKey);
 message('매장 방송 재생권 확인 및 TL3 암호 해제 중…');
 const license=await post('/api/v5/store-music/session',{channel_id:channel.value,track_key:x.track_key,player_public_key:publicKey});
 live={id:license.session_id,reservedSeconds:Number(license.reserved_seconds),playedSeconds:0};
 try{
  const data=await decodeTL3(license,keys);
  objectUrl=URL.createObjectURL(data);
  audio.src=objectUrl;audio.load();now.textContent='재생 준비 · '+x.title+' — '+x.artist;
  try{await audio.play();message('매장 방송 중 · 실제 재생 시간만 차감합니다.')}catch(e){message('아래 오디오 재생 버튼을 눌러 방송을 시작해 주세요.')}
  startClock();
 }catch(e){await endLive();throw e}
}
audio.addEventListener('ended',async()=>{
 const next=selectedTracks();const nextIdx=index+1;
 await endLive();
 if(next.length&&nextIdx<next.length){playing=true;stop.disabled=false;index=nextIdx;await startTrack(next[index]).catch(e=>{showError(e);endLive()})}
 else message('선택된 음악 편성이 종료되었습니다.');
});
start.addEventListener('click',async()=>{
 if(!channel.value||!tracks.length)return;
 playing=true;stop.disabled=false;start.disabled=true;index=0;
 await startTrack(selectedTracks()[index]).catch(async e=>{showError(e);await endLive()});
});
stop.addEventListener('click',()=>endLive());
genre.addEventListener('change',renderTracks);
$('search').addEventListener('click',()=>refreshMusic().catch(showError));
function localeHint(){$('localHint').textContent='CC0 음악은 국가와 무관하게 사용할 수 있지만 매장 이용권은 매장별로 확인합니다.'}
country.addEventListener('change',localeHint);
$('save').addEventListener('click',()=>{
 const pref={};for(const k of ids)pref[k]=$(k).value;
 localStorage.setItem('tilo_store_music_preferences_v1',JSON.stringify(pref));
 $('status').textContent='매장 음악 취향 설정이 이 기기에 저장되었습니다.';
});
try{
 const saved=JSON.parse(localStorage.getItem('tilo_store_music_preferences_v1')||'null');
 if(saved)for(const k of ids){if(k==='genre')continue;if(saved[k])$(k).value=saved[k]}
}catch{}
localeHint();
(async()=>{try{if(await fetchOwnStores())await refreshMusic()}catch(e){showError(e)}})();
})();