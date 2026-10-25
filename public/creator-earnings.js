/* Actual creator earnings, refreshed from the authenticated V5 ledger. */
(function(global){
 'use strict';
 const roots=Array.from(document.querySelectorAll('[data-creator-earnings]'));
 if(!roots.length)return;
 const escape=value=>String(value==null?'':value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const amount=n=>Number(n||0).toLocaleString(undefined,{maximumFractionDigits:4});
 let busy=false,previous=null,previousToken='';
 function time(value){if(!value)return '아직 수익 발생 전';const iso=/Z$|[+-]\d\d:\d\d$/.test(value)?value:value.replace(' ','T')+'Z';const d=new Date(iso);return Number.isFinite(d.getTime())?d.toLocaleString():'수익 기록 있음';}
 function message(text){roots.forEach(root=>{root.innerHTML='<p class="ce-message" role="status">'+escape(text)+'</p>';});}
 function render(data){
  const total=Number(data.summary.earned_tl),delta=previous===null?0:total-previous;previous=total;
  const trackHTML=(data.tracks||[]).map(t=>'<div class="ce-track">'+
   (t.cover_url?'<img src="'+escape(t.cover_url)+'" alt="" loading="lazy" onerror="this.hidden=true">':'<span class="ce-art">♫</span>')+
   '<div class="ce-track-title">'+(t.file_id?'<a href="/track.html?id=tl3_'+Number(t.file_id)+'">'+escape(t.title)+'</a>':'<strong>'+escape(t.title)+'</strong>')+
   '<small>'+escape(t.artist||'')+'</small><small>최근 수익 · '+escape(time(t.last_earned_at))+'</small></div>'+
   '<strong class="ce-track-amount">'+amount(t.earned_tl)+' <small>TL</small></strong></div>').join('');
  roots.forEach(root=>{
   const history=(data.requests||[]).map(r=>'<div class="ce-track"><span class="ce-track-title">'+escape(time(r.created_at))+'<small>'+escape(r.status)+' · 지급 기록 대조 필요</small></span><strong>'+amount(r.amount_tl)+' TL</strong></div>').join('');
   root.innerHTML='<div class="ce-heading"><div><small>MY MUSIC EARNINGS</small><h2>내 음악이 만든 수익</h2><p>실제 음악 사용으로 내 계정에 기록된 창작자 보상입니다.</p></div><button type="button" class="ce-refresh">↻ 새로고침</button></div>'+
    '<div class="ce-summary"><div class="ce-total"><span>누적 창작 수익</span><strong>'+amount(total)+' <small>TL</small></strong>'+
    '<div class="ce-increase" role="status">'+(delta>0?'새 수익 +'+amount(delta)+' TL':total>0?'음악이 재생되며 쌓인 나의 보상':'첫 재생 수익을 기다리고 있습니다')+'</div></div>'+
    '<div class="ce-secondary"><span>본인 재생 보류</span><strong>'+amount(data.summary.self_play_held_tl)+' TL</strong><small>누적 창작 수익에서 제외</small></div>'+
    '<div class="ce-secondary"><span>정산 요청</span><strong>'+Number(data.summary.pending_request_count)+'건</strong><small>접수된 요청 기준</small></div></div>'+
    '<h3>곡별 창작 수익</h3><div class="ce-tracks">'+(trackHTML||'<p class="ce-message">등록한 곡이 없습니다. <a href="/creator.html">내 음악 올리기</a></p>')+'</div>'+
    '<details class="ce-history"><summary>정산 요청 · 지급 기록</summary>'+(history||'<p class="ce-message">등록된 정산 요청과 지급 기록이 없습니다.</p>')+'</details>'+
    '<p class="ce-note">창작 수익은 TL 보상이며 현금 환전액과 다릅니다. 환전액은 기여도와 정산 검토 후 확정합니다. 회사 수익과 충전금은 포함하지 않습니다.</p>'+
    '<p class="ce-updated" role="status">V5 경제원장 · '+escape(time(data.as_of))+' · 15초마다 갱신</p>';
   root.querySelector('.ce-refresh').onclick=()=>refresh();
  });
  document.querySelectorAll('[data-creator-earnings-total]').forEach(el=>{el.textContent=amount(total)+' TL';});
 }
 async function refresh(){
  if(busy)return;const token=localStorage.getItem('tl_token')||'';
  if(!token){previous=null;previousToken='';message('로그인 후 내 음악 수익을 확인할 수 있습니다.');return;}
  if(token!==previousToken){previous=null;previousToken=token;}
  busy=true;
  try{
   const r=await fetch('https://api.timelink.digital/api/creator/earnings',{headers:{Authorization:'Bearer '+token},cache:'no-store',signal:AbortSignal.timeout(15000)});
   const data=await r.json();if(token!==(localStorage.getItem('tl_token')||'')){previous=null;message('계정이 변경되었습니다. 다시 확인해 주세요.');return;}
   if(!r.ok||!data.ok||data.ledger_version!=='V5')throw Error(data.error||'음악 수익 조회 실패');
   if(!data.summary||data.summary.earned_tl==null||!Number.isFinite(Number(data.summary.earned_tl)))throw Error('수익 원장 응답이 불완전합니다.');
   render(data);
  }catch(error){message('음악 수익을 불러오지 못했습니다. '+error.message);}
  finally{busy=false;}
 }
 global.TimeLinkCreatorEarnings=Object.freeze({refresh:refresh});
 document.addEventListener('tl:creator-earnings-refresh',refresh);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
 setInterval(()=>{if(!document.hidden)refresh();},15000);
 refresh();
})(window);
