/* KR accounting administration. All mutations require an explicit form submission. */
(function(){
'use strict';
let state=null,tab='overview',seq=0;
const root=()=>document.getElementById('krFinanceRoot');
const e=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const won=v=>v==null?'확인 필요':Number(v).toLocaleString('ko-KR')+'원';
const today=()=>new Date(Date.now()+9*3600000).toISOString().slice(0,10);
const field=(name,label,type='text',value='',extra='')=>'<label>'+e(label)+'<input name="'+name+'" type="'+type+'" value="'+e(value)+'" '+extra+'></label>';
const select=(name,label,values,value)=>'<label>'+label+'<select name="'+name+'">'+Object.entries(values).map(([k,v])=>'<option value="'+k+'" '+(k===value?'selected':'')+'>'+e(v)+'</option>').join('')+'</select></label>';
const check=(name,label,yes=false)=>'<label class="kr-check"><input type="checkbox" name="'+name+'" '+(yes?'checked':'')+'>'+e(label)+'</label>';
const vatOpts={taxable10:'국내 과세 10% · 금액에 부가세 포함',exempt:'면세 · 근거 확인',outside:'과세대상 외 · 근거 확인'};
const incomeOpts={unclassified:'분류 전',business_personal:'개인 인적용역 사업소득 · 해당 여부 확인',other_author:'저작자 기타소득 · 필요경비 60% 해당',domestic_corporation:'국내 법인 권리자',nonresident:'비거주자·외국법인 · 검토 세율'};
const templates={payment:'충전 영수증 → PG 미수금·선불 의무',deposit:'PG 실제 입금·수수료',service:'서비스 사용 → 매출·부가세',creator_accrual:'창작자 원화 의무 발생',payout:'창작자 지급·원천세 기표',refund:'미사용 충전금 환급 기표',expense:'운영비·매입 부가세',vat_payment:'장부 부가세 미납잔액 납부 기표',corporate_accrual:'법인세·지방세 예상 의무 기표',tax_payment:'원천세·법인세 납부 기표',manual:'검토된 기초·조정 복식 전표'};
async function api(path='',body){
 const r=await fetch('https://api.timelink.digital/api/admin/finance/kr'+path,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+getAdminToken(),...(body?{'Content-Type':'application/json'}:{})},cache:'no-store',...(body?{body:JSON.stringify(body)}:{})});
 const d=await r.json();if(!r.ok||!d.ok)throw Error(d.error||'회계 조회 실패');return d;
}
function message(s,error=false){const el=root()?.querySelector('[data-status]');if(el){el.textContent=s;el.className=error?'kr-status kr-error':'kr-status';}}
function corporateFields(){return field('national_base_krw','국세 연간 과세표준','number',0,'min="0" required')+field('local_base_krw','지방세 연간 과세표준','number',0,'min="0" required')+field('national_credit_krw','검토한 국세 공제·감면','number',0,'min="0"')+field('local_credit_krw','검토한 지방세 공제·감면','number',0,'min="0"')+field('national_prepaid_krw','국세 기납부액','number',0,'min="0"')+field('local_prepaid_krw','지방세 기납부액','number',0,'min="0"')+'<p>2026년 일반 영리법인 기준입니다. 과세표준은 세무조정·결손금 등을 반영해 입력하세요. 다른 법인 유형·다른 연도는 별도 검토 대상입니다.</p>';}
function journalExtra(kind){
 const box=root().querySelector('[data-journal-extra]');if(!box)return;
 let h='';
 if(kind==='payment')h=field('payment_id','PG 영수증 번호','number','','min="1" required')+check('cash_verified','PG에서 실제 결제임을 확인했습니다. 테스트 결제가 아닙니다.');
 if(kind==='deposit')h=field('fee_krw','PG 공제 수수료 · 증빙 기준','number',0,'min="0"');
 if(['service','expense'].includes(kind))h+=select('vat_type','부가세 분류',vatOpts,'taxable10');
 if(kind==='service')h+=select('revenue_account','서비스 수익 종류',{service_revenue:'음악·서비스',certificate_revenue:'증명서',promotion_revenue:'홍보'},'service_revenue')+'<p>실제 서비스에 배분한 원화 장부가를 입력하세요. TL 수량을 원화로 그대로 복사하지 마세요.</p>';
 if(kind==='creator_accrual')h+=check('krw_value_confirmed','계약·기여도·환전율을 확인한 원화 의무입니다. TL 수량 그대로가 아닙니다.');
 if(kind==='payout')h+=field('tax_base_krw','원천징수 기준액 · 부가세 제외','number','','min="0" required')+check('single_case_confirmed','기타소득인 경우 건별 합산·필요경비 60% 적용을 확인했습니다.')+'<p>회원별 세금 분류를 먼저 저장하세요. 이 기능은 지급 사실의 회계 기록이며 은행 송금을 실행하지 않습니다.</p>';
 if(kind==='expense')h+=check('deductible','적격 증빙과 매입세액 공제요건을 확인했습니다.');
 if(kind==='tax_payment')h+=select('tax_account','납부 세금 계정',{withholding_national:'원천 소득세',withholding_local:'원천 지방소득세',corporate_national:'법인세',corporate_local:'법인지방소득세'},'withholding_national');
 if(kind==='corporate_accrual')h+=corporateFields();
 if(kind==='manual')h+='<p>기초 잔액·대리인 거래·과세 조정·환급·미지급금 등을 회계 검토 후 입력합니다. 차변은 양수, 대변은 음수이며 합계는 0원입니다.</p><label>차변·대변 목록(JSON)<textarea name="lines" rows="5" placeholder=\'[{"account":"bank","amount_krw":10000},{"account":"opening_equity","amount_krw":-10000}]\' required></textarea></label>'+check('accounting_reviewed','계정·금액·증빙·거래 실질을 회계 검토했습니다.');
 if(kind==='vat_payment')h+='<p>현재 기표된 매출 부가세에서 공제 확인 매입세액을 차감해 납부 사실을 기록합니다. 과세기간 대사와 납부 증빙을 확인하세요. 환급은 검토 전표를 사용합니다.</p>';
 box.innerHTML=h;
 const amount=root().querySelector('[name="amount_krw"]');if(amount){amount.closest('label').hidden=['payment','manual','vat_payment','corporate_accrual'].includes(kind);amount.required=!amount.closest('label').hidden;}
}
function taxExtra(kind){
 const box=root().querySelector('[data-tax-extra]');let h='';
 if(kind==='vat')h=field('gross_krw','부가세 포함 총 대가','number','','min="1" required')+select('vat_type','과세 구분',vatOpts,'taxable10');
 if(kind==='withholding')h=field('user_id','수취인 회원 번호','number','','min="1" required')+field('gross_krw','부가세 포함 총 지급대가','number','','min="1" required')+field('tax_base_krw','원천징수 기준액 · 부가세 제외','number','','min="0" required')+check('single_case_confirmed','기타소득은 건별 합산·필요경비 60% 적용을 확인했습니다.');
 if(kind==='corporate')h=corporateFields();
 box.innerHTML=h;
}
function render(){
 const r=root();if(!r||!state)return;const s=state.summary,p=state.policy;
 const cards=[['실제 사용 가능 현금 · 장부 기준',s.operating_cash_krw],['미사용 충전금 의무 · 기표분',s.prepaid_liability_krw],['창작자 미지급금 · 원화 평가 기표분',s.creator_payable_krw],['선택 월 회계 손익 · 기표분',s.booked_profit_krw]];
 r.innerHTML='<div class="kr-top"><div><h2>대한민국 회계·세금</h2><p>충전금·회계 매출·창작자 채무·세금을 분리합니다.</p></div><label>회계 조회 월<input type="month" data-month value="'+e(state.month)+'"></label><button type="button" data-action="reload">새로고침</button></div><div data-status class="kr-status" role="status">'+e(state.coverage)+'</div><p class="kr-notice">'+(p.opening_confirmed?'기초 잔액 확인됨 · ':'기초 잔액·은행 대사 전 · 실제 가용 현금 확인 필요 · ')+s.journal_count+'건 기표 / 미분류 충전 '+state.unbooked_receipts.length+'건 · '+e(state.note)+'</p><div class="kr-cards">'+cards.map(([name,v])=>'<article><span>'+name+'</span><strong>'+won(v)+'</strong></article>').join('')+'</div><nav class="kr-tabs">'+[['overview','재무·대사'],['journals','원화 전표'],['tax','세금·수취인'],['policy','회계 설정·마감']].map(([key,name])=>'<button type="button" data-tab="'+key+'">'+name+'</button>').join('')+'</nav>'+
 '<section data-pane="overview"><h3>장부 잔액</h3><div class="kr-table"><table><thead><tr><th>항목</th><th>금액</th></tr></thead><tbody>'+[
 ['보통예금',s.bank_krw],['제한성 예금·보호자금',s.restricted_cash_krw],['PG 미수금',s.pg_receivable_krw],['미사용 충전금 의무',s.prepaid_liability_krw],['창작자 미지급금',s.creator_payable_krw],['권리자 미확인 보류금',s.rights_held_krw],['매출 부가세 − 공제 확인 매입세액',s.vat_position_krw],['원천 소득세 예수금',s.withholding_national_krw],['원천 지방소득세 예수금',s.withholding_local_krw],['미지급 법인세',s.corporate_national_krw],['미지급 법인지방소득세',s.corporate_local_krw],['선택 월 공급가액 기준 매출',s.booked_revenue_krw],['선택 월 비용',s.booked_cost_krw]].map(([name,v])=>'<tr><td>'+name+'</td><td>'+won(v)+'</td></tr>').join('')+'</tbody></table></div><p>누적 창작 수익: '+Number(state.creator_economy?.lifetime_earned_tl||0).toLocaleString('ko-KR',{maximumFractionDigits:4})+' TL. '+e(state.creator_economy?.valuation_status)+'</p><h3>충전 영수증 분류 대기</h3><p>실결제 여부와 증빙을 확인한 건만 기표하세요. 은행 입금은 별도 거래입니다.</p><div class="kr-table"><table><thead><tr><th>영수증</th><th>회원</th><th>결제액</th><th>작업</th></tr></thead><tbody>'+state.unbooked_receipts.map(x=>'<tr><td>'+e(x.id)+' · '+e(x.method)+'</td><td>'+e(x.user_id)+'</td><td>'+won(x.amount_krw)+'</td><td><button type="button" data-receipt="'+e(x.id)+'" data-user="'+e(x.user_id)+'">증빙 연결·기표</button></td></tr>').join('')+'</tbody></table></div><p>표에 없는 TL 사용·창작자 보상·은행·환불 거래도 원거래 증빙과 대사해야 합니다. 미기표 거래는 회계 잔액에 포함되지 않습니다.</p></section>'+
 '<section data-pane="journals"><h3>원화 전표 입력</h3><p>기표는 회계 기록입니다. TL 지급·차감, 현금 송금, 세금 신고를 실행하지 않습니다. 확정 전표는 삭제·수정 대신 역분개합니다.</p><form data-form="journal" class="kr-form">'+select('template','거래 종류',templates,'payment')+field('business_date','회계일','date',today(),'required')+field('user_id','관련 회원 번호 · 해당 시','number','','min="1"')+field('source_key','원거래 고유 키 · 중복 방지','text','','required')+field('amount_krw','총 대가 또는 확정 원화 의무','number','','min="1"')+field('description','거래 내용·검토 사유','text','','required')+field('evidence','증빙 번호·내부 문서 경로','text','','required')+'<div data-journal-extra class="kr-subform"></div><button type="submit">검토한 전표 기표</button></form><h3>최근 확정 전표</h3><button type="button" data-action="export">CSV 내보내기 · 최근 100건</button><div class="kr-table"><table><thead><tr><th>회계일</th><th>내용</th><th>원거래 키</th><th>검토</th></tr></thead><tbody>'+state.journals.map(j=>'<tr><td>'+e(j.business_date)+'</td><td>'+e(j.description)+'</td><td>'+e(j.source_key)+'</td><td><button type="button" data-journal="'+e(j.id)+'">전표 보기</button> <button type="button" data-reverse="'+e(j.id)+'">역분개 양식</button></td></tr>').join('')+'</tbody></table></div><div data-journal-view></div></section>'+
 '<section data-pane="tax"><h3>세금 계산</h3><p>입력·분류 기준 예상액입니다. 미확정 세금은 0원으로 처리하지 않습니다.</p><form data-form="tax" class="kr-form">'+select('kind','계산 종류',{vat:'부가세 포함 대가 분리',withholding:'창작자 원천징수·실지급',corporate:'2026 법인세·법인지방소득세'},'vat')+'<div data-tax-extra class="kr-subform"></div><button type="submit">세금 계산</button></form><div data-tax-result role="status"></div><h3>회원별 세금 분류</h3><form data-form="profile" class="kr-form">'+field('user_id','회원 번호','number','','min="1" required')+select('income_type','소득 유형',incomeOpts,'unclassified')+select('vat_type','권리자 용역의 부가세',{unknown:'확인 필요',exempt:'면세 요건 확인',taxable10:'과세 10%',outside:'과세대상 외'},'unknown')+field('national_bps','비거주자 검토 국세율 · bps (100 = 1%)','number','','min="0" max="10000"')+field('local_bps','비거주자 검토 지방세율 · bps','number','','min="0" max="10000"')+field('reason','분류·조세조약 검토 내용','text','','required')+field('evidence','세무 검토·거주자·사업자 증빙','text','','required')+check('verified','수취인 소득·과세 구분과 지급시기 관련 근거를 확인했습니다.')+'<button type="submit">세금 분류 저장</button></form><div class="kr-table"><table><thead><tr><th>회원</th><th>분류</th><th>확인</th><th>작업</th></tr></thead><tbody>'+state.tax_profiles.map(x=>'<tr><td>'+e(x.user_id)+'</td><td>'+e(incomeOpts[x.income_type])+' / '+e(x.vat_type)+'</td><td>'+(x.verified?'확인':'미확정')+'</td><td><button type="button" data-profile="'+e(x.user_id)+'">수정</button></td></tr>').join('')+'</tbody></table></div><p>기타소득은 건별 합산·필요경비 요건을 확인하고, 외국 권리자는 조세조약을 확인하세요. TL 적립·재사용·TLC 전환의 과세시기를 현금 출금일로 일괄 미루지 않습니다.</p><h3>확인한 법령·국세청 근거</h3>'+state.sources.map(x=>'<p><a href="'+e(x.url)+'" target="_blank" rel="noopener noreferrer">'+e(x.name)+'</a></p>').join('')+'</section>'+
 '<section data-pane="policy"><h3>한국 법인 회계 설정</h3><p>음악 사용 TL의 70% 배분은 유지됩니다. 아래 환전율은 원화 의무 평가 참조 설정이며 실제 환전 서비스의 지급 정책을 자동 변경하지 않습니다.</p><form data-form="policy" class="kr-form">'+field('entity_name','한국 운영 법인','text',p.entity_name||'(주)틸로코리아','required')+select('framework','적용 회계기준',{unconfirmed:'확인 필요',general:'일반기업회계기준',sme:'중소기업회계기준',kifrs:'K-IFRS'},p.framework||'unconfirmed')+select('role','서비스 본인·대리인',{unconfirmed:'계약 확인 필요',principal:'본인 · 서비스 총액 매출',agent:'대리인 · 수수료 순액 검토'},p.role||'unconfirmed')+field('creator_rate_bps','창작자 원화 환전율 참조 · 미확정이면 공란','number',p.creator_rate_bps??'','min="0" max="10000"')+check('opening_confirmed','기초 잔액과 은행·PG·채무 대사를 확인했습니다.',p.opening_confirmed)+field('reason','설정 변경 사유','text','','required')+field('evidence','회계·계약 검토 문서','text','','required')+'<button type="submit">설정 저장 · 버전 '+p.version+'</button></form><h3>월 마감</h3><form data-form="close" class="kr-form">'+field('month','마감 월','month',state.month,'required')+field('reason','마감 검토·대사 근거','text','','required')+check('reconciled','은행·PG·TL·권리자·세금 거래를 모두 대사했습니다.')+'<button type="submit">종료된 월 마감</button></form><p>마감 월에는 신규·수정 기표가 차단됩니다. 정정은 열린 기간의 역분개를 사용하세요.</p><div class="kr-table"><table><thead><tr><th>마감 월</th><th>근거</th></tr></thead><tbody>'+state.closed_periods.map(x=>'<tr><td>'+e(x.month)+'</td><td>'+e(x.reason)+'</td></tr>').join('')+'</tbody></table></div><h3>설정 변경 이력</h3>'+state.policy_history.map(x=>'<p>버전 '+x.version+' · '+e(x.created_at)+' · '+e(x.reason)+'</p>').join('')+'</section>';
 journalExtra('payment');taxExtra('vat');showTab(tab);
}
function showTab(v){tab=v;root()?.querySelectorAll('[data-pane]').forEach(x=>{x.hidden=x.dataset.pane!==v;});root()?.querySelectorAll('[data-tab]').forEach(x=>x.setAttribute('aria-selected',String(x.dataset.tab===v)));}
async function load(){
 if(!root())return;const n=++seq,month=root().querySelector('[data-month]')?.value||new Date(Date.now()+9*3600000).toISOString().slice(0,7);
 if(!state)root().innerHTML='<h2>대한민국 회계·세금</h2><p data-status role="status">원화 회계 조회 중...</p>';
 try{const d=await api('?month='+encodeURIComponent(month));if(n!==seq)return;state=d;render();}
 catch(error){if(n!==seq)return;message(error.message,true);if(!state)root().insertAdjacentHTML('beforeend','<button type="button" data-action="reload">다시 조회</button>');}
}
function fill(form,data){for(const [k,v]of Object.entries(data)){const el=form.elements.namedItem(k);if(!el)continue;if(el.type==='checkbox')el.checked=!!v;else el.value=v??'';}}
function data(form){const obj=Object.fromEntries(new FormData(form));form.querySelectorAll('input[type="number"]').forEach(x=>obj[x.name]=x.value===''?null:Number(x.value));form.querySelectorAll('input[type="checkbox"]').forEach(x=>obj[x.name]=x.checked);return obj;}
function taxResult(d){
 const names={gross_krw:'총 대가',supply_krw:'공급가액',vat_krw:'부가세',tax_base_krw:'원천징수 기준액',national_krw:'소득세',local_krw:'지방소득세',net_krw:'실지급액',national_calculated_krw:'국세 산출세액',local_calculated_krw:'지방세 산출세액',national_due_krw:'국세 예상 납부액',local_due_krw:'지방세 예상 납부액'};
 return '<h4>계산 결과 · 예상액</h4><dl>'+Object.entries(names).filter(([k])=>d[k]!=null).map(([k,name])=>'<dt>'+name+'</dt><dd>'+won(d[k])+'</dd>').join('')+'</dl><p>'+e(d.method||'')+' '+e(d.note||d.rounding||'')+'</p>';
}
function init(){
 const r=root();if(!r)return;
 r.addEventListener('change',ev=>{
  if(ev.target.matches('[data-month]'))load();
  if(ev.target.name==='template')journalExtra(ev.target.value);
  if(ev.target.name==='kind')taxExtra(ev.target.value);
 });
 r.addEventListener('submit',async ev=>{
  const f=ev.target.closest('[data-form]');if(!f)return;ev.preventDefault();const button=f.querySelector('[type="submit"]');if(button.disabled)return;button.disabled=true;const body=data(f),kind=f.dataset.form;
  try{
   if(kind==='journal'){
    if(body.template==='payment')body.source_key='receipt:'+body.payment_id;
    if(body.template==='manual')body.lines=JSON.parse(body.lines);
    if(body.template==='corporate_accrual'){body.year=2026;body.entity_type='ordinary';body.source_key='corporate:2026';}
    await api('/journal',body);await load();message('회계 전표 기표 완료 · 실제 송금·신고는 실행하지 않았습니다.');
   }else if(kind==='policy'){await api('/policy',{...body,expected_version:state.policy.version});await load();message('회계 정책 저장 완료');}
   else if(kind==='profile'){const old=state.tax_profiles.find(x=>x.user_id===body.user_id);await api('/tax-profile',{...body,expected_version:old?.version||0});await load();message('회원 세금 분류 저장 완료');}
   else if(kind==='close'){await api('/close-period',body);await load();message('월 마감 완료');}
   else if(kind==='tax'){if(body.kind==='corporate'){body.year=2026;body.entity_type='ordinary';}const d=await api('/tax-preview',body);r.querySelector('[data-tax-result]').innerHTML=taxResult(d.data);message('세금 예상 계산 완료');}
  }catch(error){message(error.message,true);}
  finally{button.disabled=false;}
 });
 r.addEventListener('click',async ev=>{
  const b=ev.target.closest('button');if(!b)return;
  if(b.dataset.tab){showTab(b.dataset.tab);return;}
  if(b.dataset.action==='reload'){load();return;}
  if(b.dataset.receipt){showTab('journals');const f=r.querySelector('[data-form="journal"]');f.elements.template.value='payment';journalExtra('payment');fill(f,{payment_id:b.dataset.receipt,user_id:b.dataset.user,source_key:'receipt:'+b.dataset.receipt});f.scrollIntoView({block:'start',behavior:'smooth'});return;}
  if(b.dataset.profile){const f=r.querySelector('[data-form="profile"]');fill(f,state.tax_profiles.find(x=>x.user_id===Number(b.dataset.profile)));f.scrollIntoView({block:'start'});return;}
  if(b.dataset.reverse){const j=state.journals.find(x=>x.id===b.dataset.reverse);const f=r.querySelector('[data-form="journal"]');const sel=f.elements.template;if(!sel.querySelector('[value="reversal"]'))sel.add(new Option('열린 기간 역분개','reversal'));sel.value='reversal';journalExtra('reversal');r.querySelector('[data-journal-extra]').innerHTML='<input type="hidden" name="reverses" value="'+e(j.id)+'"><p>원전표 '+e(j.source_key)+'의 차변·대변을 반대로 기표합니다. 열린 회계일과 정정 사유·증빙을 입력하세요.</p>';fill(f,{user_id:j.user_id,business_date:today(),source_key:'reversal:'+j.id,description:'역분개: '+j.description});f.elements.amount_krw.closest('label').hidden=true;f.elements.amount_krw.required=false;f.scrollIntoView({block:'start'});return;}
  if(b.dataset.journal){try{const d=await api('/journals/'+encodeURIComponent(b.dataset.journal));r.querySelector('[data-journal-view]').innerHTML='<h4>'+e(d.journal.description)+'</h4><p>'+e(d.journal.evidence)+'</p><div class="kr-table"><table><thead><tr><th>계정</th><th>차변</th><th>대변</th></tr></thead><tbody>'+d.lines.map(x=>'<tr><td>'+e(x.name)+'</td><td>'+(x.amount_krw>0?won(x.amount_krw):'')+'</td><td>'+(x.amount_krw<0?won(-x.amount_krw):'')+'</td></tr>').join('')+'</tbody></table></div>';}catch(error){message(error.message,true);}return;}
  if(b.dataset.action==='export'){
   const csvCell=v=>{let x=String(v??'');if(/^[=+@-]/.test(x))x="'"+x;return '"'+x.replaceAll('"','""')+'"';};
   const rows=[['전표ID','회계일','원거래키','회원','내용','증빙','정책버전'],...state.journals.map(x=>[x.id,x.business_date,x.source_key,x.user_id,x.description,x.evidence,x.policy_version])];
   const blob=new Blob(['\ufeff'+rows.map(x=>x.map(csvCell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='TILO_KR_Journals_'+state.month+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
 });
 const panel=document.getElementById('panel-revenue');if(panel?.classList.contains('active'))load();
}
window.TimeLinkKrFinance={load};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();