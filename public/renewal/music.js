(function(){
  'use strict';
  var API='https://api.timelink.digital',token=localStorage.getItem('tl_token')||'',allTracks=[],legacy=[];
  var filter='all',user=null,$=function(id){return document.getElementById(id);};
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function date(v){if(!v)return '등록일 정보 없음';var d=new Date(v);return isNaN(d.getTime())?'등록일 정보 없음':d.toLocaleDateString('ko-KR',{year:'numeric',month:'short',day:'numeric'});}
  function kind(t){var s=String(t.release_mode||'').toLowerCase(),f=String(t.file_type||'').toLowerCase(),c=String(t.content_kind||'').toLowerCase();return s.indexOf('tl3')>=0||f.indexOf('tl3')>=0||c==='tl3'?'tl3':'mp3';}
  function render(){
    var q=$('searchInput').value.trim().toLowerCase();
    var list=allTracks.filter(function(t){return (filter==='all'||kind(t)===filter)&&(!q||(String(t.title||'')+' '+String(t.artist||'')).toLowerCase().includes(q));});
    $('trackGrid').innerHTML=list.map(function(t){
      var id=String(t.id),k=kind(t),cover=t.cover_url?'<img src="'+esc(t.cover_url)+'" alt="">':'♫';
      var page='/track.html?id='+encodeURIComponent(id);
      return '<article class="my-track-card"><div class="my-track-art">'+cover+'</div><div class="my-track-main"><div class="my-track-top"><div class="my-track-title">'+esc(t.title||'제목 없는 곡')+'</div></div><div class="my-track-artist">'+esc(t.artist||'아티스트 미입력')+(t.album?' · '+esc(t.album):'')+'</div><div class="track-badges"><span class="track-badge '+k+'">'+(k==='tl3'?'TL3 음원':'MP3 원본 등록')+'</span><span class="track-badge">곡별 페이지</span></div><div class="track-date">'+esc(date(t.created_at))+'</div><div class="track-actions"><a class="track-action primary" href="'+page+'">Track Page 열기 ↗</a><button class="track-action" data-share="'+esc(id)+'">홍보 링크 복사</button></div></div></article>';
    }).join('');
    $('emptyState').hidden=list.length!==0;
    $('trackGrid').hidden=list.length===0;
  }
  async function load(){
    if(!token){location.replace('/login.html');return;}
    var me=await fetch(API+'/api/v1/auth/me',{headers:{Authorization:'Bearer '+token}});
    if(!me.ok){if(me.status===401||me.status===403){localStorage.removeItem('tl_token');localStorage.removeItem('tl_user');location.replace('/login.html');return;}throw new Error('로그인 상태를 확인하지 못했습니다.');}
    var md=await me.json();user=md.user||md;
    var name=String(user.username||user.email||'회원'),initial=name.charAt(0).toUpperCase()||'T';
    $('sideName').textContent=name;$('sideAvatar').textContent=initial;if($('topAvatar'))$('topAvatar').textContent=initial;
    var r=await fetch(API+'/api/shares/my?limit=200',{headers:{Authorization:'Bearer '+token}});
    if(!r.ok)throw new Error('내 음원 목록을 불러오지 못했습니다. ('+r.status+')');
    var d=await r.json();
    allTracks=(d.shares||[]).filter(function(t){return String(t.category_type||'').toLowerCase()==='audio'||String(t.file_type||'').toLowerCase().indexOf('audio/')===0||String(t.category||'').toLowerCase()==='music';});
    legacy=(d.files||[]).filter(function(t){return String(t.file_type||'').toLowerCase().indexOf('audio')>=0||String(t.genre||'').length>0;});
    $('legacyPanel').hidden=legacy.length===0;
    $('legacyList').innerHTML=legacy.map(function(t){return '<div class="legacy-row"><span>♫</span><div><b>'+esc(t.title)+'</b><small>'+esc(t.artist||t.genre||'기존 파일')+' · Track Page 연결 확인 필요</small></div></div>';}).join('');
    render();
  }
  $('searchInput').addEventListener('input',render);
  document.querySelectorAll('[data-filter]').forEach(function(b){b.addEventListener('click',function(){filter=b.getAttribute('data-filter');document.querySelectorAll('[data-filter]').forEach(function(x){x.classList.toggle('active',x===b);x.setAttribute('aria-selected',x===b?'true':'false');});render();});});
  $('trackGrid').addEventListener('click',async function(e){var b=e.target.closest('[data-share]');if(!b)return;var url=location.origin+'/track.html?id='+encodeURIComponent(b.getAttribute('data-share'));try{await navigator.clipboard.writeText(url);b.textContent='복사 완료 ✓';setTimeout(function(){b.textContent='홍보 링크 복사';},1800);}catch(err){window.prompt('곡 홍보 링크를 복사하세요.',url);}});
  $('logoutButton').addEventListener('click',function(){if(!confirm('로그아웃하시겠습니까?'))return;localStorage.removeItem('tl_token');localStorage.removeItem('tl_user');location.href='/login.html';});
  if($('mobileMenu'))$('mobileMenu').addEventListener('click',function(){$('sidebar').classList.toggle('open');});
  document.addEventListener('click',function(e){var menu=$('mobileMenu');if(menu&&innerWidth<=760&&$('sidebar').classList.contains('open')&&!$('sidebar').contains(e.target)&&!menu.contains(e.target))$('sidebar').classList.remove('open');});
  load().catch(function(e){$('trackGrid').innerHTML='<div class="loading-state">'+esc(e.message||'불러오기 실패')+'</div>';});
})();
