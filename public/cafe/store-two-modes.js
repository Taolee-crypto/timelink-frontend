(function(){
'use strict';
const $=id=>document.getElementById(id),gate=window.TiloCafeTimeFree;
const API=window.TL3_API_BASE||'https://api.timelink.digital';
const picker=$('storePicker'),status=$('accessState'),remaining=$('timeRemaining'),panel=$('manualPanel');
const centralPanel=$('centralPanel'),centralHost=$('centralHost');
const currentTitle=$('nowPlayingTitle'),currentArtist=$('nowPlayingArtist'),currentMode=$('nowPlayingMode');
let radioFrame=null,mode='idle';
const search=$('songSearch'),genre=$('genreFilter'),list=$('songList'),audio=$('cafeAudio'),now=$('nowPlaying'),stop=$('stopSong');
let stores=[],tracks=[],selected=-1,requestId=0,stopping=null,playing=false,loading=false;
let queue=[],queuePosition=-1,queueActive=false,transitioning=false;
const chosen=new Set();
const queueKey=()=> 'tilo_cafe_playlist_v1_'+picker.value;
const trackKey=x=>String(x.file_id);
function saveSelection(){try{localStorage.setItem(queueKey(),JSON.stringify([...chosen]));}catch{}}
function restoreSelection(){chosen.clear();try{const saved=JSON.parse(localStorage.getItem(queueKey())||'[]');if(Array.isArray(saved))for(const id of saved)chosen.add(String(id));}catch{} }
function updateCount(){const el=$('selectionCount');if(el)el.textContent=chosen.size+'곡 선택';}
function selectedQueue(){return tracks.map((x,i)=>({x,i})).filter(({x})=>chosen.has(trackKey(x))).map(({i})=>i);}
const text=(v,max=130)=>typeof v==='string'?v.slice(0,max):String(v??'').slice(0,max);
function report(msg){status.textContent=msg;}
function showSong(title,artist,kind){
 currentTitle.textContent=text(title||'재생 대기 중',180);
 currentArtist.textContent=text(artist||'가수 정보 대기',180);
 currentMode.textContent=text(kind||'음악 재생 대기',120);
}
function stopCentral(){
 if(!radioFrame)return;
 // Removing a same-origin radio receiver stops the audio, TIME FREE meter
 // and song messages. The main TILO radio window/service is unaffected.
 radioFrame.remove();
 radioFrame=null;
 centralPanel.hidden=true;
 if(mode==='central'){mode='idle';showSong('재생 대기 중','가수 정보 대기','중앙방송 중지')}
}
window.addEventListener('message',event=>{
 if(event.origin!==location.origin||!radioFrame||event.source!==radioFrame.contentWindow)return;
 const d=event.data;
 if(!d||d.type!=='tilo:cafe-now-playing'||mode!=='central')return;
 const id=Number(d.file_id);
 if(d.playing&&Number.isSafeInteger(id)&&id>0)
  showSong(d.title,d.artist,'TILO 중앙방송 · 홍보곡 우선 편성');
 else if(Number.isSafeInteger(id)&&id>0)
  showSong(d.title,d.artist,'TILO 중앙방송 · 연결 중 / 일시정지');
 else showSong('방송 대기 중','—','중앙방송을 연결해 주세요.');
});
function selectedStore(){const id=picker.value;const store=stores.find(x=>x.channel_id===id);if(!store)throw Error('개설된 내 매장을 선택해 주세요.');return store;}
async function refreshAccess(){
 try{
  const d=await gate.timeFree();
  remaining.textContent='TIME FREE 잔여 '+Math.floor(d.seconds/3600)+'시간 '+Math.floor(d.seconds%3600/60)+'분 '+d.seconds%60+'초';
  report(d.seconds>0?'TIME FREE 확인 완료 · 중앙방송과 직접 선택 모두 이용할 수 있습니다.':'TIME FREE 구매 후 두 가지 음악 재생 방법을 이용할 수 있습니다.');
  return d.seconds;
 }catch(e){remaining.textContent='TIME FREE 확인 실패';report(e.message);return 0}
}
async function listStores(){
 try{
  const token=localStorage.getItem('tl_token')||'';
  if(!token)throw Error('로그인 후 내 카페에서 음악을 이용할 수 있습니다.');
  const r=await fetch(API+'/api/cafe/my-channels',{headers:{Authorization:'Bearer '+token},cache:'no-store'});
  const d=await r.json();
  if(!r.ok||!d.ok)throw Error(d.error||'매장 목록 조회 실패');
  stores=(Array.isArray(d.channels)?d.channels:[]).filter(x=>x.channel_id&&x.status==='active');
  picker.replaceChildren();
  for(const item of stores)picker.add(new Option(text(item.name||item.channel_id,80),item.channel_id));
  const requested=new URLSearchParams(location.search).get('channel_id');
  const recent=localStorage.getItem('tilo_store_channel');
  const chosen=[requested,recent].find(id=>stores.some(s=>s.channel_id===id));
  if(chosen)picker.value=chosen;
  if(!stores.length){report('사업자번호로 개설한 활성 매장이 없습니다. 나의 카페에서 먼저 매장을 개설해 주세요.');remaining.textContent='매장 없음';picker.replaceChildren(new Option('개설된 매장 없음',''));return}
  localStorage.setItem('tilo_store_channel',picker.value);
  await refreshAccess();
  const requestedMode=new URLSearchParams(location.search).get('mode');
  if(requestedMode==='manual')await openManual();
  if(requestedMode==='central')await openCentral();
 }catch(e){picker.replaceChildren(new Option('매장 확인 실패',''));report(e.message);remaining.textContent='사용 불가'}
}
async function authorize(){
 const store=selectedStore();
 const d=await gate.requireTime(store.channel_id);
 localStorage.setItem('tilo_store_channel',store.channel_id);
 return store;
}
async function openCentral(){
 try{
  const store=await authorize();
  if(!['KR','JP','US','CN','TH','VN'].includes(String(store.country||'KR').toUpperCase()))
   throw Error('아직 이 매장 국가의 TILO 중앙방송이 준비되지 않았습니다.');
  queueActive=false;await closeAudio();
  panel.hidden=true;
  stopCentral();
  mode='central';
  showSong('방송 연결 중','가수 정보 확인 중','TILO 중앙방송 · 홍보곡 우선');
  centralPanel.hidden=false;
  const frame=document.createElement('iframe');
  frame.id='centralIframe';
  frame.title='TILO 중앙방송 플레이어 및 메신저';
  frame.allow='autoplay';
  frame.loading='eager';
  const country=String(store.country||'KR').toUpperCase();
  frame.src='/radio.html?autojoin=1&cafe_channel='+encodeURIComponent(store.channel_id)+'&country='+country;
  centralHost.replaceChildren(frame);
  radioFrame=frame;
  centralPanel.scrollIntoView({block:'start',behavior:'smooth'});
  report('중앙방송 연결 중 · 재생 중인 곡명과 가수명을 상단에 표시합니다.');
 }catch(e){report(e.message);showSong('재생 대기 중','—',e.message)}
}
function renderSongs(){
 const q=search.value.toLocaleLowerCase().trim(),g=genre.value;
 const show=tracks.map((x,i)=>({...x,i})).filter(x=>(!g||String(x.genre||'').toLowerCase()===g)&&(!q||(String(x.title||'')+' '+String(x.artist||'')).toLocaleLowerCase().includes(q)));
 list.replaceChildren();
 let toolbar=$('playlistToolbar');if(!toolbar){toolbar=document.createElement('div');toolbar.id='playlistToolbar';toolbar.style.cssText='display:flex;flex-wrap:wrap;align-items:center;gap:9px;margin:12px 0';toolbar.innerHTML='<button type="button" id="selectAllSongs" class="secondary">전체 선택</button><button type="button" id="clearAllSongs" class="secondary">전체 해제</button><strong id="selectionCount" aria-live="polite"></strong><button type="button" id="playSelectedSongs">▶ 선택곡 전체 재생</button>';list.before(toolbar);$('selectAllSongs').onclick=()=>{for(const x of show)chosen.add(trackKey(x));saveSelection();renderSongs()};$('clearAllSongs').onclick=()=>{chosen.clear();saveSelection();renderSongs()};$('playSelectedSongs').onclick=()=>{const next=selectedQueue();if(!next.length){report('재생할 음악을 체크해 주세요.');return;}queue=next;queuePosition=0;queueActive=true;void playIndex(queue[0]).catch(e=>{queueActive=false;report(e.message)})};}
 updateCount();
 if(!show.length){const p=document.createElement('p');p.textContent=tracks.length?'검색 조건에 맞는 음악이 없습니다.':'현재 선택 국가에서 편성 가능한 기존 타임링크 음악이 없습니다.';list.append(p);return}
 for(const x of show){
  const row=document.createElement('div');row.className='song';
  const desc=document.createElement('div'),title=document.createElement('strong'),meta=document.createElement('small');
  title.textContent=text(x.title||'이름 없는 음악',160);
  meta.textContent=text(x.artist||'아티스트 미등록',90)+' · '+text(x.genre||'기타',55)+(x.is_promoted?' · 홍보 신청곡':'');
  desc.append(title,meta);
  const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=chosen.has(trackKey(x));checkbox.setAttribute('aria-label',text(x.title||'음악',100)+' 선택');checkbox.onchange=()=>{if(checkbox.checked)chosen.add(trackKey(x));else chosen.delete(trackKey(x));saveSelection();updateCount()};
  row.style.gridTemplateColumns='auto 1fr';row.append(checkbox,desc);list.append(row);
 }
}
async function loadSongs(){
 const store=selectedStore(),country=String(store.country||'KR').toUpperCase();
 if(!/^[A-Z]{2}$/.test(country))throw Error('매장 국가 코드가 올바르지 않습니다.');
 const response=await fetch(API+'/api/v5/central-broadcast/stations/'+encodeURIComponent(country),{cache:'no-store'});
 const data=await response.json().catch(()=>({}));
 if(!response.ok||!data.ok)throw Error('이 국가의 음악 편성/권리를 확인할 수 없습니다. 지역별 권리 확인 후 이용해 주세요.');
 tracks=(Array.isArray(data.tracks)?data.tracks:[]).filter(x=>Number.isSafeInteger(x.file_id)&&x.file_id>0);
 const all=[...new Set(tracks.map(x=>String(x.genre||'').trim().toLowerCase()).filter(Boolean))].sort();
 genre.replaceChildren(new Option('전체 장르',''));
 for(const g of all)genre.add(new Option(g,g));
 restoreSelection();renderSongs();
 report('매장 국가 '+country+' · 기존 TILO 방송 편성곡 '+tracks.length+'개 중 직접 선택할 수 있습니다. TIME FREE로만 재생합니다.');
}
async function openManual(){
 try{
  await authorize();
  stopCentral();
  mode='manual';
  showSong('직접 선택 대기 중','—','사장님이 곡을 선택하세요.');
  panel.hidden=false;
  panel.scrollIntoView({block:'start',behavior:'smooth'});
  await loadSongs();
 }catch(e){report(e.message)}
}
async function closeAudio(){
 if(stopping)return stopping;
 stopping=(async()=>{
  playing=false;
  audio._tl3CancelStartup?.();
  if(typeof audio._tl3Stop==='function')await audio._tl3Stop();
  else audio.pause();
  now.textContent='재생 중지 · 실제 청취시간만 정산됩니다.';
  if(mode==='manual')showSong('재생 대기 중','—','직접 선택 재생 중지');
  stop.disabled=true;
 })();
 try{await stopping}finally{stopping=null}
}
async function playIndex(i){
 if(loading)return;
 loading=true;
 try{
  await authorize();
  const x=tracks[i];if(!x)throw Error('선택한 곡을 찾을 수 없습니다.');
  await closeAudio();
  selected=i;playing=true;
  mode='manual';
  stop.disabled=false;
  showSong(x.title,x.artist,'직접 선택 · TIME FREE 재생권 확인 중');
  now.textContent='TIME FREE 재생권 확인 중 · '+text(x.title,95)+' · '+text(x.artist||'가수 정보 없음',95);
  // Never unlock personal wallet billing or private broadcaster free mode.
  await window.TL3V5Player.playStream('tl3_'+x.file_id,audio,{
    requireTimeFree:true,
    onReady:()=>{showSong(x.title,x.artist,'직접 선택 · TIME FREE 재생 중');now.textContent='TIME FREE 재생 중 · '+text(x.title||'곡',95)+' · '+text(x.artist||'가수 정보 없음',95);},
    onError:err=>{now.textContent='재생 오류 · '+text(err?.message||err,140);currentMode.textContent='음악 재생 오류';},
    onInsufficient:()=>{now.textContent='TIME FREE 시간이 모두 사용되었습니다. 추가 구매 후 계속할 수 있습니다.';currentMode.textContent='TIME FREE 시간 소진';void closeAudio();},
    onBillingMode:pre=>{if(pre.billing_mode!=='time_free')throw Error('TIME FREE 외의 과금 방식은 사용할 수 없습니다.');}
  });
 }catch(e){playing=false;stop.disabled=true;now.textContent=e.message;report(e.message);throw e}
 finally{loading=false;void refreshAccess()}
}
audio.addEventListener('playing',()=>{
 if(mode==='manual'&&playing&&tracks[selected]){
  const x=tracks[selected];showSong(x.title,x.artist,'직접 선택 · TIME FREE 재생 중');
 }
});
audio.addEventListener('pause',()=>{
 if(mode==='manual'&&playing&&tracks[selected]&&!audio.ended){
  const x=tracks[selected];showSong(x.title,x.artist,'직접 선택 · 일시정지');
 }
});
audio.addEventListener('ended',()=>{
 if(!playing||!queueActive||transitioning)return;
 transitioning=true;
 void (async()=>{try{const next=selectedQueue();if(!next.length){queueActive=false;await closeAudio();return;}const pos=next.indexOf(selected);queue=next;queuePosition=pos<0?0:(pos+1)%next.length;await playIndex(queue[queuePosition]);}catch(e){queueActive=false;report('연속 재생 중지 · '+e.message);await closeAudio();}finally{transitioning=false}})();
});
stop.addEventListener('click',()=>{queueActive=false;void closeAudio().catch(e=>report(e.message))});
$('centralMode').addEventListener('click',()=>{void openCentral()});
$('manualMode').addEventListener('click',()=>{void openManual()});
$('closeCentral').addEventListener('click',()=>{stopCentral();report('TILO 중앙방송이 중지되었습니다.');});
picker.addEventListener('change',async()=>{try{queueActive=false;chosen.clear();stopCentral();await closeAudio();tracks=[];selected=-1;panel.hidden=true;mode='idle';showSong('재생 대기 중','—','새 매장을 선택했습니다.');localStorage.setItem('tilo_store_channel',picker.value);await refreshAccess()}catch(e){report(e.message)}});
search.addEventListener('input',renderSongs);
genre.addEventListener('change',renderSongs);
window.addEventListener('focus',()=>{if(!playing)void refreshAccess()});
window.addEventListener('pagehide',()=>{stopCentral();audio._tl3CancelStartup?.();if(typeof audio._tl3Stop==='function')void audio._tl3Stop()});
void listStores();
})();