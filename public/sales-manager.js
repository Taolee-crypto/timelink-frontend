(function(){
'use strict';
const API='https://api.timelink.digital/api/sales',qs=new URLSearchParams(location.search),invite=qs.get('invite')||'';
let state=null,directory=null,publicPolicy=null,adminState=null,points=[],breaks=[],drawing=false,activeTab=['join','stores','owner','income'].includes(qs.get('tab'))?qs.get('tab'):(invite?'owner':'join');
const e=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tl=v=>(Number(v||0)/10000).toLocaleString('ko-KR',{maximumFractionDigits:4})+' TL';
const krw=v=>v==null?'관리자 설정 대기':Number(v).toLocaleString('ko-KR')+'원';
const token=()=>typeof getAdminToken==='function'?getAdminToken():localStorage.getItem('tl_token')||'';
const input=(name,label,type='text',value='',extra='')=>'<label>'+e(label)+'<input name="'+name+'" type="'+type+'" value="'+e(value)+'" '+extra+'></label>';
const select=(name,label,items,value='')=>'<label>'+label+'<select name="'+name+'">'+items.map(x=>'<option value="'+e(x[0])+'" '+(String(x[0])===String(value)?'selected':'')+'>'+e(x[1])+'</option>').join('')+'</select></label>';
const check=(name,label)=>'<label class="sm-check"><input type="checkbox" name="'+name+'" required>'+label+'</label>';
async function api(path,body){const r=await fetch(API+path,{method:body?'POST':'GET',headers:{...(token()?{Authorization:'Bearer '+token()}:{}),...(body?{'Content-Type':'application/json'}:{})},cache:'no-store',...(body?{body:JSON.stringify(body)}:{})});const d=await r.json();if(!r.ok||!d.ok)throw Error(d.error||'요청 실패');return d;}
function status(s,error=false,admin=false){const el=document.querySelector(admin?'#adminSalesRoot [data-sm-status]':'#salesManagerRoot [data-sm-status]');if(el){el.textContent=s;el.className='sm-status'+(error?' error':'');}}
function formData(f){const b=Object.fromEntries(new FormData(f));f.querySelectorAll('input[type="number"]').forEach(x=>b[x.name]=x.value===''?null:Number(x.value));f.querySelectorAll('input[type="checkbox"]').forEach(x=>b[x.name]=x.checked);return b;}
function tab(value){activeTab=value;document.querySelectorAll('#salesManagerRoot [data-pane]').forEach(x=>x.hidden=x.dataset.pane!==value);document.querySelectorAll('#salesManagerRoot [data-tab]').forEach(x=>x.setAttribute('aria-selected',String(x.dataset.tab===value)));}
function stateName(v){return({pending_deposit:'서명 완료 · 테스트 입금 대기',simulated_paid:'테스트 입금 표시 · 관리자 확인 대기',active:'활동 중',suspended:'활동 중지'})[v]||v;}
function terms(t){return '<ol class="sm-terms">'+t.clauses.map(x=>'<li>'+e(x)+'</li>').join('')+'</ol>';}
function signatureInit(){
 const canvas=document.querySelector('#salesManagerRoot canvas[data-signature]');points=[];breaks=[];drawing=false;if(!canvas)return;
 const c=canvas.getContext('2d');c.strokeStyle='#e7dcff';c.lineWidth=2.5;c.lineCap='round';
 function point(ev){const r=canvas.getBoundingClientRect();return[Math.max(0,Math.min(700,(ev.clientX-r.left)/r.width*700)),Math.max(0,Math.min(200,(ev.clientY-r.top)/r.height*200))];}
 canvas.addEventListener('pointerdown',ev=>{drawing=true;canvas.setPointerCapture(ev.pointerId);breaks.push(points.length);const p=point(ev);points.push(p);c.beginPath();c.moveTo(...p);});
 canvas.addEventListener('pointermove',ev=>{if(!drawing||points.length>=3900)return;const p=point(ev);points.push(p);c.lineTo(...p);c.stroke();});
 ['pointerup','pointercancel','lostpointercapture'].forEach(type=>canvas.addEventListener(type,()=>drawing=false));
}
function renderPublic(){
 const root=document.getElementById('salesManagerRoot');if(!root||!publicPolicy)return;const p=publicPolicy.policy,t=publicPolicy.terms,m=state?.member,logged=!!token();
 const managerOptions=[['','선택하세요'],...directory.managers.map(x=>[x.user_id,x.display_name+' · '+x.country])],djOptions=[['','DJ를 선택하세요'],...directory.djs.map(x=>[x.id,x.dj_name])];
 const join=m?'<div class="sm-card"><h2>'+e(m.display_name)+' · '+e(m.country)+'</h2><p>'+e(stateName(m.state))+' · 테스트 가입</p><p>계약 가입비 '+krw(m.fee_krw)+'</p><p>가상 입금 참조번호 <strong>'+e(m.virtual_ref)+'</strong></p><p>실제 은행 계좌가 아닙니다. 실제 송금하지 마세요.</p>'+(m.state==='pending_deposit'?'<button data-action="simulate">테스트 입금 표시</button>':'')+' <button data-action="contract">서명 계약서 보기</button>'+(m.state==='active'?'<label>상점주 초대 링크<input readonly value="'+e(location.origin+'/sales-manager.html?invite='+m.invite_code)+'"></label><button data-action="copy">초대 링크 복사</button>':'')+'</div>':
 '<form data-sm-form="join" class="sm-form">'+input('display_name','계약자 실명','text','','required minlength="2" maxlength="80"')+select('country','가입 국가 · 국가 내 독점 구역 없음',[['KR','대한민국'],['JP','일본'],['US','미국'],['CN','중국'],['GB','영국'],['TH','태국'],['VN','베트남']],'KR')+'<div class="sm-wide"><h3>영업 매니저 가입계약서</h3><p>가입비 <strong>'+krw(p.join_fee_krw)+'</strong> · '+e(t.version)+'</p>'+terms(t)+'</div><div class="sm-wide"><label>직접 서명<canvas data-signature width="700" height="200" aria-label="가입 계약서 서명 영역"></canvas></label><button type="button" data-action="clear-signature">서명 지우기</button></div>'+check('accept','계약 내용과 전자서명 기록 방식에 동의합니다.')+'<button type="submit" '+(!logged||p.join_fee_krw==null?'disabled':'')+'>계약 서명·가입 신청</button>'+(p.join_fee_krw==null?'<p>가입비가 설정되면 금액을 확인한 뒤 서명할 수 있습니다.</p>':'')+'</form>';
 const stores=(state?.managed_stores||[]).map(c=>'<article class="sm-card"><h3>'+e(c.name)+'</h3><p>'+e(c.country)+' · '+e(c.addr)+'</p><p>담당 DJ '+e(c.dj_name||'미선택')+'</p><a href="/cafe-detail.html?id='+encodeURIComponent(c.channel_id)+'">스토어 페이지</a></article>').join('')||'<p>상점주가 연결을 승인하면 담당 스토어가 표시됩니다.</p>';
 const owned=(state?.owned_stores||[]).map(c=>'<article class="sm-card"><h3>'+e(c.name)+'</h3><p>'+e(c.country)+' · 담당 매니저 '+e(c.manager_name||'미배정')+' · DJ '+e(c.dj_name||'미선택')+'</p><p>이용 기간 '+(Number(c.expires_at)?new Date(Number(c.expires_at)).toLocaleDateString('ko-KR'):e(c.expires_at||'확인 필요'))+'</p><a href="/cafe-detail.html?id='+encodeURIComponent(c.channel_id)+'">공개 스토어 페이지</a> · <a href="/cafe-studio.html?channel_id='+encodeURIComponent(c.channel_id)+'">스토어 방송 관리</a><form data-sm-form="assignment" class="sm-form"><input type="hidden" name="channel_id" value="'+e(c.channel_id)+'"><input type="hidden" name="expected_version" value="'+c.version+'">'+select('manager_user_id','상점주가 요청할 담당 매니저',managerOptions.filter(x=>!x[0]||directory.managers.find(m=>String(m.user_id)===String(x[0]))?.country===c.country),c.manager_user_id||qs.get('manager')||'')+select('dj_id','방송 DJ',djOptions,c.dj_id||'')+select('kind','업종 분류',[['cafe','카페'],['store','기타 스토어']],c.kind)+input('reason','담당 연결·변경 요청 사유','text','','required minlength="2"')+check('owner_accept','상점주로서 담당 매니저와 DJ 연결·변경을 요청합니다.')+'<button type="submit">상점주 요청 저장</button></form><button type="button" data-renew="'+e(c.channel_id)+'">방송 서비스 30일 연장 · '+Number(p.monthly_fee_tl).toLocaleString('ko-KR')+' TL</button><p>서비스 비용: 매니저 '+p.manager_bps/100+'% · DJ '+p.dj_bps/100+'% · 플랫폼 50%. 창작자 몫은 이 비용에서 추가 차감하지 않습니다.</p></article>').join('')||'<p>등록된 스토어가 없습니다.</p>';
 const inc=state?.income||{},income='<div class="sm-grid"><article class="sm-card"><h3>영업 매니저 누적 배분</h3><strong>'+tl(inc.manager_atoms)+'</strong><p>현금 재원 '+tl(inc.manager_paid_atoms)+' / 내부 사용 전용 '+tl(Number(inc.manager_atoms||0)-Number(inc.manager_paid_atoms||0))+'</p></article><article class="sm-card"><h3>DJ 누적 배분</h3><strong>'+tl(inc.dj_atoms)+'</strong><p>현금 재원 '+tl(inc.dj_paid_atoms)+' / 내부 사용 전용 '+tl(Number(inc.dj_atoms||0)-Number(inc.dj_paid_atoms||0))+'</p></article></div><p>V5 원장에 배분한 누적 TL입니다. 현금 지급은 개인별 신원·세금·정산 확인을 거칩니다.</p>';
 root.innerHTML='<div data-sm-status class="sm-status" role="status">'+(!logged?'로그인 후 영업 매니저 가입·매장 연결을 진행할 수 있습니다.':'국가 내 독점 구역 없음 · 매니저 변경 권한은 상점주에게 있습니다.')+'</div>'+(!logged?'<p><a class="sm-button" href="/login.html?redirect='+encodeURIComponent('/sales-manager.html'+location.search)+'">로그인</a> <a href="/signup.html">개인회원 가입</a></p>':'')+'<nav class="sm-tabs">'+[['join','영업 매니저 가입'],['stores','담당 스토어'],['owner','상점주 연결·관리'],['income','매니저·DJ 수익']].map(([key,label])=>'<button type="button" data-tab="'+key+'">'+label+'</button>').join('')+'</nav><section data-pane="join">'+join+'</section><section data-pane="stores"><div class="sm-grid">'+stores+'</div></section><section data-pane="owner">'+(invite?'<p>초대 링크로 방문했습니다. 내 스토어를 연결하거나 신규 등록 시 매니저 연결에 동의하세요.</p>':'')+'<p><a class="sm-button" href="/cafe-channel.html'+(invite?'?sales_invite='+encodeURIComponent(invite):'')+'">새 스토어 등록</a></p><div class="sm-grid">'+owned+'</div></section><section data-pane="income">'+income+'</section><section id="salesContractView"></section>';
 tab(activeTab);signatureInit();
}
async function loadPublic(){
 if(!document.getElementById('salesManagerRoot'))return;
 try{
  [publicPolicy,directory]=await Promise.all([api('/policy'),api('/directory')]);
  state=token()?await api('/me'):null;
  if(invite){const info=await api('/invites/'+encodeURIComponent(invite));qs.set('manager',String(info.manager.user_id));}
  renderPublic();
 }catch(err){document.getElementById('salesManagerRoot').innerHTML='<div data-sm-status role="status" class="sm-status error">'+e(err.message)+'</div><button type="button" data-action="reload">다시 조회</button>';}
}
function contractView(member){
 const target=document.getElementById('salesContractView')||document.querySelector('#adminSalesRoot [data-contract]');if(!target)return;
 const t=JSON.parse(member.terms_json),sig=JSON.parse(member.signature_json);
 target.innerHTML='<article class="sm-card sm-contract-print"><h2>영업 매니저 가입계약서</h2><p>계약자 '+e(member.display_name)+' · '+e(member.country)+' · 가입비 '+krw(member.fee_krw)+'</p>'+terms(t)+'<p>서명일 '+e(member.signed_at)+'</p><canvas data-contract-sign width="700" height="200"></canvas><p class="sm-hash">서명 기록 해시 '+e(member.signature_hash)+'</p><button type="button" data-action="print">인쇄·PDF 저장</button></article>';
 const canvas=target.querySelector('canvas'),ctx=canvas.getContext('2d');ctx.strokeStyle='#222';ctx.lineWidth=2;ctx.beginPath();sig.points.forEach((p,i)=>{if(!i||(sig.breaks||[]).includes(i))ctx.moveTo(...p);else ctx.lineTo(...p);});ctx.stroke();target.scrollIntoView({block:'start'});
}
async function loadAdmin(){
 const root=document.getElementById('adminSalesRoot');if(!root)return;
 try{
  adminState=await api('/admin');const p=adminState.policy;
  root.innerHTML='<h2>가입 심사·영업 정책</h2><p>테스트 입금은 실제 현금 매출이 아닙니다. 담당 매니저 변경은 상점주가 직접 요청합니다.</p><div data-sm-status class="sm-status" role="status">가입비·배분율을 설정하고 서명·테스트 입금 상태를 확인하세요.</div><form class="sm-form" data-sm-form="policy">'+input('join_fee_krw','가입비 · KRW · 미정이면 공란','number',p.join_fee_krw??'','min="0"')+input('monthly_fee_tl','스토어 방송 서비스 30일 이용료 · TL','number',p.monthly_fee_tl,'min="1" required')+input('manager_percent','영업 매니저 배분 · %','number',p.manager_bps/100,'min="0" max="50" step=".01" required')+input('dj_percent','DJ 배분 · %','number',p.dj_bps/100,'min="0" max="50" step=".01" required')+input('reason','변경 사유','text','','required minlength="2"')+'<p>매니저 + DJ 합계는 50%, 플랫폼은 50%입니다. 창작자 배분은 0%이며 별도 음원 보상 정책과 구분합니다.</p><button type="submit">정책 저장 · 버전 '+p.version+'</button></form><h3>가입 신청</h3><div class="sm-table"><table><thead><tr><th>회원·국가</th><th>가입비</th><th>상태</th><th>계약</th><th>검토</th></tr></thead><tbody>'+adminState.applications.map(m=>'<tr><td>'+e(m.display_name)+' #'+m.user_id+' · '+e(m.country)+'</td><td>'+krw(m.fee_krw)+'</td><td>'+e(stateName(m.state))+'</td><td><button type="button" data-contract-user="'+m.user_id+'">서명 보기</button></td><td><form data-sm-form="review"><input type="hidden" name="user_id" value="'+m.user_id+'">'+select('state','처리',[['active','테스트 가입 승인'],['suspended','활동 중지']],m.state==='suspended'?'suspended':'active')+input('reason','검토 사유','text','','required minlength="2"')+'<button type="submit">저장</button></form></td></tr>').join('')+'</tbody></table></div><div data-contract></div><h3>최근 가입 처리 이력</h3><div class="sm-table"><table><thead><tr><th>시각</th><th>대상</th><th>처리</th><th>담당</th></tr></thead><tbody>'+adminState.events.map(x=>'<tr><td>'+e(x.created_at)+'</td><td>'+x.user_id+'</td><td>'+e(x.event_type)+'</td><td>'+x.actor_id+'</td></tr>').join('')+'</tbody></table></div>';
 }catch(err){root.innerHTML='<div data-sm-status class="sm-status error" role="status">'+e(err.message)+'</div><button data-action="reload-admin">다시 조회</button>';}
}
function init(root,admin=false){
 root.addEventListener('submit',async ev=>{
  const form=ev.target.closest('[data-sm-form]');if(!form)return;ev.preventDefault();const button=form.querySelector('[type="submit"]');if(button.disabled)return;button.disabled=true;
  const b=formData(form),kind=form.dataset.smForm;
  try{
   if(kind==='join'){if(points.length<5)throw Error('계약서에 직접 서명하세요.');await api('/join',{...b,expected_version:publicPolicy.policy.version,terms_version:publicPolicy.terms.version,signature:points,breaks});await loadPublic();status('계약 서명과 가입 신청이 저장되었습니다. 테스트 입금 안내를 확인하세요.');}
   if(kind==='assignment'){const id=b.channel_id;delete b.channel_id;b.expected_version=Number(b.expected_version);b.manager_user_id=Number(b.manager_user_id);b.dj_id=Number(b.dj_id);await api('/stores/'+encodeURIComponent(id)+'/assignment',b);await loadPublic();status('상점주 요청으로 담당 매니저·DJ 연결을 변경했습니다.');}
   if(kind==='policy'){await api('/admin/policy',{expected_version:adminState.policy.version,join_fee_krw:b.join_fee_krw,monthly_fee_tl:b.monthly_fee_tl,manager_bps:Math.round(b.manager_percent*100),dj_bps:Math.round(b.dj_percent*100),reason:b.reason});await loadAdmin();status('가입비와 배분 정책 저장 완료',false,true);}
   if(kind==='review'){await api('/admin/review',{...b,user_id:Number(b.user_id)});await loadAdmin();status('가입 상태 저장 완료 · 실제 현금 입금 기록은 생성하지 않았습니다.',false,true);}
  }catch(err){status(err.message,true,admin);}finally{button.disabled=false;}
 });
 root.addEventListener('click',async ev=>{
  const b=ev.target.closest('button');if(!b)return;if(b.dataset.tab){tab(b.dataset.tab);return;}
  try{
   const action=b.dataset.action;
   if(action==='reload')return loadPublic();if(action==='reload-admin')return loadAdmin();
   if(action==='clear-signature'){points=[];breaks=[];drawing=false;root.querySelector('canvas[data-signature]')?.getContext('2d').clearRect(0,0,700,200);return;}
   if(action==='simulate'){b.disabled=true;await api('/simulate-deposit',{});await loadPublic();status('테스트 입금 표시 완료 · 실제 현금 매출은 발생하지 않았습니다.');}
   if(action==='contract')contractView(state.member);
   if(action==='print')window.print();
   if(action==='copy'){await navigator.clipboard.writeText(location.origin+'/sales-manager.html?invite='+state.member.invite_code);status('초대 링크를 복사했습니다.');}
   if(b.dataset.contractUser){const d=await api('/admin/contracts/'+b.dataset.contractUser);contractView(d.contract);}
   if(b.dataset.renew){
    if(b.disabled)return;b.disabled=true;const id=b.dataset.renew,key=b.dataset.requestId||crypto.randomUUID();b.dataset.requestId=key;
    const d=await api('/stores/'+encodeURIComponent(id)+'/renew',{request_id:key});await loadPublic();status('방송 서비스 연장 완료 · '+Number(d.charged||0).toLocaleString('ko-KR')+' TL · 매니저 '+Number(d.manager_revenue||0).toLocaleString('ko-KR')+' / DJ '+Number(d.dj_revenue||0).toLocaleString('ko-KR'));
   }
  }catch(err){status(err.message,true,admin);b.disabled=false;}
 });
}
window.TimeLinkSales={loadAdmin,loadPublic};
function boot(){const pub=document.getElementById('salesManagerRoot'),adm=document.getElementById('adminSalesRoot');if(pub){init(pub);loadPublic();}if(adm){init(adm,true);if(document.getElementById('panel-sales')?.classList.contains('on'))loadAdmin();}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
