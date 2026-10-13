(function(){
  'use strict';
  var API='https://api.timelink.digital';
  var token=localStorage.getItem('tl_token')||'';
  var user=null, allAssets=[], currentFilter='all';
  var $=function(id){return document.getElementById(id)};
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function authHeaders(){return {'Authorization':'Bearer '+token,'Content-Type':'application/json'};}
  function dateLabel(v){if(!v)return '날짜 정보 없음';var d=new Date(typeof v==='number'&&v<1e12?v*1000:v);return isNaN(d.getTime())?'날짜 정보 없음':d.toLocaleDateString('ko-KR',{year:'numeric',month:'short',day:'numeric'});}
  function isAudio(a){return /audio|mp3|tl3|music/i.test(String(a.file_type||a.category||a.content_kind||''));}
  function statusTag(a){
    if(a.kind==='cloud')return '<span class="asset-tag">개인 원본 · 비공개</span>';
    var s=String(a.auth_status||'').toLowerCase();
    if(s==='verified')return '<span class="asset-tag verified">권리 확인</span>';
    if(s==='pending'||s==='reviewing')return '<span class="asset-tag pending">확인 대기</span>';
    if(a.release_mode==='tl3'||a.content_kind==='tl3')return '<span class="asset-tag verified">TL3 발행</span>';
    return '<span class="asset-tag">개인 자산</span>';
  }
  function render(){
    var q=$('searchInput').value.trim().toLowerCase();
    var rows=allAssets.filter(function(a){
      if(currentFilter==='share'&&a.kind!=='share')return false;
      if(currentFilter==='legacy'&&a.kind!=='legacy')return false;
      if(currentFilter==='cloud'&&a.kind!=='cloud')return false;
      if(currentFilter==='audio'&&!isAudio(a))return false;
      var hay=(a.title+' '+(a.artist||'')).toLowerCase();
      return !q||hay.includes(q);
    });
    $('assetList').innerHTML=rows.map(function(a){
      var symbol=isAudio(a)?'♫':(/video|tl4/i.test(a.file_type||'')?'▣':(/image|tlj/i.test(a.file_type||'')?'▧':'▤'));
      var source=a.kind==='share'?'TL 공유 자산':(a.kind==='cloud'?'개인 클라우드 원본':'기존 Creator 파일');
      var type=String(a.file_type||a.category||'디지털 파일').toUpperCase();
      return '<article class="asset-row"><div class="asset-art">'+symbol+'</div><div class="asset-main"><div class="asset-title">'+esc(a.title||'이름 없는 파일')+'</div><div class="asset-subtitle">'+esc(a.artist||a.genre||'아티스트 정보 없음')+' · '+esc(source)+'</div><div class="asset-tags"><span class="asset-tag">'+esc(type)+'</span>'+statusTag(a)+'</div></div><div class="asset-date">'+esc(dateLabel(a.created_at))+'</div></article>';
    }).join('');
    $('emptyState').hidden=rows.length!==0;
    $('assetList').hidden=rows.length===0;
    $('listFooter').textContent=rows.length+'개 항목 표시 · 원본 파일의 직접 주소는 목록 API에서 노출하지 않습니다.';
  }
  function providerCard(id,name,icon,connected,configured,email){
    var status=connected?'연결됨':(configured?'연결 가능':'설정 필요');
    var action=connected?'연결 관리':(configured?'연결하기':'준비 중');
    return '<article class="provider-card"><div class="provider-top"><div class="provider-icon">'+icon+'</div><div><div class="provider-name">'+name+'</div><div class="provider-status">'+status+(email?' · '+esc(email):'')+'</div></div></div><button class="provider-action" data-provider="'+id+'" '+(!configured||connected?'disabled':'')+'>'+action+'</button></article>';
  }
  async function loadProviders(){
    var results=await Promise.all([
      fetch(API+'/api/storage/providers'),
      fetch(API+'/api/storage/connections',{headers:authHeaders()})
    ]);
    var pd=await results[0].json(),cd=results[1].ok?await results[1].json():{connections:[]};
    var connected=cd.connections||[],providers=pd.providers||[];
    var map={};connected.forEach(function(c){map[c.provider]=c;});
    $('providerCount').textContent=String(connected.length);
    var google=providers.find(function(p){return p.id==='google_drive';})||{};
    var one=providers.find(function(p){return p.id==='onedrive';})||{};
    $('providerGrid').innerHTML=
      providerCard('google_drive','Google Drive','G',!!map.google_drive,!!google.configured,map.google_drive&&map.google_drive.provider_email)+
      providerCard('onedrive','Microsoft OneDrive','O',!!map.onedrive,!!one.configured,map.onedrive&&map.onedrive.provider_email)+
      providerCard('local_agent','내 PC · Local Agent','PC',false,true,'별도 연결 단계');
    $('providerGrid').querySelectorAll('[data-provider]').forEach(function(btn){
      btn.addEventListener('click',connectProvider);
    });
  }
  async function connectProvider(e){
    var btn=e.currentTarget,id=btn.getAttribute('data-provider');
    if(id==='local_agent'){alert('PC Local Agent 연결은 다음 단계에서 기존 Creator의 연결 방식을 확인한 뒤 통합하겠습니다.');return;}
    btn.disabled=true;btn.textContent='연결 준비 중…';
    try{
      var r=await fetch(API+'/api/storage/connect',{method:'POST',headers:authHeaders(),body:JSON.stringify({provider:id})});
      var d=await r.json();if(!r.ok||!d.authorization_url)throw new Error(d.error||'저장소 연결을 시작하지 못했습니다.');
      window.location.assign(d.authorization_url);
    }catch(err){alert(err.message||'저장소 연결 실패');btn.disabled=false;btn.textContent='다시 시도';}
  }
  async function loadAssets(){
    var r=await fetch(API+'/api/shares/my?limit=200',{headers:authHeaders()});
    if(!r.ok)throw new Error('개인 자산 목록을 불러오지 못했습니다. ('+r.status+')');
    var d=await r.json();
    var shares=(d.shares||[]).map(function(x){return Object.assign({},x,{kind:'share'});});
    var files=(d.files||[]).map(function(x){return Object.assign({},x,{kind:'legacy'});});
    allAssets=shares.concat(files).sort(function(a,b){return new Date(b.created_at||0)-new Date(a.created_at||0);});
    $('shareCount').textContent=String(shares.length);
    $('legacyCount').textContent=String(files.length);
    render();
  }
  async function loadCloudObjects(){
    var r=await fetch(API+'/api/storage/objects?limit=200',{headers:authHeaders()});
    if(!r.ok){$('cloudCount').textContent='—';return;}
    var d=await r.json(),objects=d.objects||[];
    $('cloudCount').textContent=String(objects.length);
    var cloud=objects.map(function(x){return {kind:'cloud',id:'cloud_'+x.id,title:x.name,artist:x.provider==='google_drive'?'Google Drive':'OneDrive',file_type:x.mime_type,created_at:x.created_at,provider:x.provider,size:x.size};});
    allAssets=allAssets.filter(function(x){return x.kind!=='cloud';}).concat(cloud);
    render();
  }
  async function start(){
    if(!token){window.location.replace('/login.html');return;}
    try{
      var me=await fetch(API+'/api/v1/auth/me',{headers:authHeaders()});
      if(!me.ok)throw new Error('세션이 만료되었습니다. 다시 로그인해 주세요.');
      var md=await me.json();user=md.user||md;
      var name=String(user.username||user.email||'TimeLink 회원');
      var initial=name.trim().charAt(0).toUpperCase()||'T';
      $('sideName').textContent=name;$('sideAvatar').textContent=initial;$('topAvatar').textContent=initial;
      await loadAssets();
      await Promise.all([loadCloudObjects(),loadProviders()]);
    }catch(err){
      if(/세션이 만료/.test(err.message)){localStorage.removeItem('tl_token');localStorage.removeItem('tl_user');window.location.replace('/login.html');return;}
      $('assetList').innerHTML='<div class="loading-state">'+esc(err.message||'데이터를 불러오지 못했습니다.')+'</div>';
      $('providerGrid').innerHTML='<div class="loading-state">저장소 상태 조회 실패</div>';
    }
  }
  $('searchInput').addEventListener('input',render);
  document.querySelectorAll('[data-filter]').forEach(function(btn){btn.addEventListener('click',function(){
    currentFilter=btn.getAttribute('data-filter');
    document.querySelectorAll('[data-filter]').forEach(function(b){b.classList.toggle('active',b===btn);b.setAttribute('aria-selected',b===btn?'true':'false');});
    render();
  });});
  $('logoutButton').addEventListener('click',function(){if(!confirm('로그아웃하시겠습니까?'))return;localStorage.removeItem('tl_token');localStorage.removeItem('tl_user');location.href='/login.html';});
  $('mobileMenu').addEventListener('click',function(){$('sidebar').classList.toggle('open');});
  document.addEventListener('click',function(e){if(innerWidth<=760&&$('sidebar').classList.contains('open')&&!$('sidebar').contains(e.target)&&!$('mobileMenu').contains(e.target))$('sidebar').classList.remove('open');});
  start();
})();
