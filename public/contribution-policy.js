/* Operator-controlled renewal policy. No balance, payout or mining mutations. */
(function(){
'use strict';
const $=id=>document.getElementById('cp-'+id),base='https://api.timelink.digital/api/admin';
const categories={purchase:'유료 구매',content:'콘텐츠 이용',listen:'본인 청취',creation:'창작·등록',score:'악보',community:'커뮤니티·기타'};
const units={KRW:'원',KRW_MARGIN:'확정 이익 원',SECOND:'초',COUNT:'건'};
let snapshot=null,sequence=0,memberSequence=0,busy=false,conflict=false;
const element=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
function status(text,error=false){$('status').textContent=text;$('status').classList.toggle('cp-error',error);}
function token(){return localStorage.getItem('tl_adm_token')||localStorage.getItem('tl_token')||'';}
async function api(path,body){
 const r=await fetch(base+path,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+token(),...(body?{'Content-Type':'application/json'}:{})},cache:'no-store',...(body?{body:JSON.stringify(body)}:{})});
 const d=await r.json();if(!r.ok||!d.ok){const error=Error(r.status===409?'다른 관리자가 먼저 수정했습니다. 입력값을 확인한 후 서버 값을 다시 불러오세요.':d.error||'조회 실패');error.status=r.status;throw error;}return d;
}
function input(path,value,min,max,step='any',type='number'){
 const n=element('input');n.type=type;n.name=path;n.dataset.policy=path;
 if(type==='checkbox')n.checked=value;else{n.value=value;n.min=min;n.max=max;n.step=step;n.required=true;}
 return n;
}
function field(title,path,value,min,max,step='any',hint=''){
 const label=element('label',title);label.append(input(path,value,min,max,step));if(hint)label.append(element('small',hint));return label;
}
function clear(){
 snapshot=null;$('form').hidden=true;$('member-section').hidden=true;$('products-section').hidden=true;$('save').disabled=true;
 for(const id of ['settings','weights','activities','groups','products','history'])$(id).replaceChildren();
 $('member-result').textContent='';$('history-status').textContent='';
}
function number(path){const n=$('form').querySelector('[data-policy="'+path+'"]');if(!n||n.value==='')throw Error('모든 숫자를 입력하세요.');const value=Number(n.value);if(!Number.isFinite(value)||!n.checkValidity())throw Error('입력 범위를 확인하세요: '+path);return value;}
function render(){
 const p=snapshot.policy;
 $('settings').replaceChildren(
  field('평가 기간 · 일','windowDays',p.windowDays,1,366,'1'),
  field('최소 인정 점수','minimumScore',p.minimumScore,.01,100),
  field('최소 기여지수','minimumIndex',p.minimumIndex,.001,.9),
  field('최대 기여지수','maximumIndex',p.maximumIndex,.001,.9)
 );
 $('weights').replaceChildren();
 for(const [key,label]of Object.entries(categories)){
  $('weights').append(field(label+' 비중 · %','weightsBps.'+key,p.weightsBps[key]/100,0,100,'.01'));
  $('weights').append(field(label+' 만점 기준 · 점','categoryTargets.'+key,p.categoryTargets[key],.001,1000000));
 }
 const options=[element('option','전체')];options[0].value='';
 for(const [key,label]of Object.entries(categories)){const o=element('option',label);o.value=key;options.push(o);}$('category').replaceChildren(...options);
 $('activities').replaceChildren();
 for(const d of snapshot.definitions){
  const row=element('tr');row.dataset.category=d.category;row.dataset.search=(d.activity+' '+d.label).toLowerCase();
  const name=element('td');name.append(element('strong',d.label),element('br'),element('code',d.activity),element('br'),element('span',categories[d.category]));row.append(name);
  let td=element('td');const active=input('activities.'+d.activity+'.enabled',d.enabled,null,null,null,'checkbox');active.setAttribute('aria-label',d.label+' 활성');td.append(active);row.append(td);
  for(const [key,min,max,step]of [['unitQuantity',1,1000000000,'1'],['pointsPerUnit',0,1000000,'any'],['periodCap',0,1000000,'any']]){
   td=element('td');const n=input('activities.'+d.activity+'.'+key,d[key],min,max,step);n.setAttribute('aria-label',d.label+' '+({unitQuantity:'기준 수량',pointsPerUnit:'단위당 점수',periodCap:'활동 상한'}[key]));td.append(n);if(key==='unitQuantity')td.append(element('small',units[d.unit]||d.unit));row.append(td);
  }
  row.append(element('td',d.group?({referral:'추천 합계',report:'채택 제보'}[d.group]||d.group):'없음'),element('td',d.evidence));$('activities').append(row);
 }
 $('groups').replaceChildren(...Object.entries(p.groupCaps).map(([key,value])=>field(({referral:'추천 성과 합계',report:'채택 제보 합계'}[key]||key)+' · 점','groupCaps.'+key,value,0,1000000)));
 $('products').replaceChildren();
 for(const product of snapshot.products){const tr=element('tr');for(const value of [product.code,product.level+'시간',product.monthlyPriceKrw.toLocaleString('ko-KR')+'원','개별',Number(product.miningIndexTlcPerHour).toFixed(3)])tr.append(element('td',value));$('products').append(tr);}
 $('form').hidden=false;$('member-section').hidden=false;$('products-section').hidden=false;$('note').value='';$('save').disabled=false;weightTotal();filter();
}
function weightTotal(){
 let sum=0;for(const key of Object.keys(categories)){const n=$('form').querySelector('[data-policy="weightsBps.'+key+'"]');sum+=Number(n?.value||0);}
 const valid=Math.abs(sum-100)<.000001;$('weight-total').textContent='가중치 합계 '+Number(sum.toFixed(2))+'%'+(valid?'':' · 합계를 100%로 맞추세요.');$('weight-total').classList.toggle('cp-error',!valid);
 $('save').disabled=!snapshot||busy||conflict||!valid;
}
function filter(){const category=$('category').value,q=$('search').value.trim().toLowerCase();for(const row of $('activities').children)row.hidden=!!((category&&row.dataset.category!==category)||(q&&!row.dataset.search.includes(q)));}
async function history(seq){
 try{const d=await api('/contribution-policy/history');if(seq!==sequence||!snapshot)return;$('history').replaceChildren();
  for(const h of d.history){const row=element('tr');for(const value of [h.version,h.updated_by??'초기값',h.updated_at,h.note])row.append(element('td',value));$('history').append(row);}$('history-status').textContent='';
 }catch(error){if(seq===sequence){$('history').replaceChildren();$('history-status').textContent='이력 조회 실패: '+error.message;}}
}
async function load(){
 if(busy)return;const seq=++sequence;clear();conflict=false;status('관리자 정책을 조회하고 있습니다.');
 try{const d=await api('/contribution-policy');if(seq!==sequence)return;snapshot=d;render();status('수동 관리 · 정책 버전 '+d.version+' · 신규 채굴 비활성');await history(seq);}
 catch(error){if(seq===sequence){clear();status(error.status===401||error.status===403?'관리자 로그인이 필요합니다. 관리자 콘솔에서 다시 로그인하세요.':error.message,true);}}
}
function collect(){
 const p=JSON.parse(JSON.stringify(snapshot.policy));
 for(const key of ['windowDays','minimumScore','minimumIndex','maximumIndex'])p[key]=number(key);
 for(const key of Object.keys(categories)){const bps=number('weightsBps.'+key)*100;if(Math.abs(bps-Math.round(bps))>.000001)throw Error('가중치는 소수 둘째 자리까지 입력하세요.');p.weightsBps[key]=Math.round(bps);p.categoryTargets[key]=number('categoryTargets.'+key);}
 if(Object.values(p.weightsBps).reduce((a,b)=>a+b,0)!==10000)throw Error('가중치 합계를 100%로 맞추세요.');
 if(p.minimumIndex>p.maximumIndex)throw Error('최소 기여지수가 최대값보다 큽니다.');
 for(const [activity,r]of Object.entries(p.activities)){r.enabled=$('form').querySelector('[data-policy="activities.'+activity+'.enabled"]').checked;for(const key of ['unitQuantity','pointsPerUnit','periodCap'])r[key]=number('activities.'+activity+'.'+key);}
 for(const key of Object.keys(p.groupCaps))p.groupCaps[key]=number('groupCaps.'+key);
 return p;
}
$('form').addEventListener('submit',async event=>{
 event.preventDefault();if(!snapshot||busy||conflict)return;
 try{const policy=collect(),note=$('note').value.trim();if(!note)throw Error('변경 사유를 입력하세요.');const version=snapshot.version;
  busy=true;$('save').disabled=true;$('reload').disabled=true;status('정책을 수동 승인·저장하고 있습니다.');
  const result=await api('/contribution-policy',{expected_version:version,policy,note});
  busy=false;$('reload').disabled=false;await load();if(snapshot)status('수동 승인·저장 완료 · 정책 버전 '+result.version);
 }catch(error){busy=false;$('reload').disabled=false;if(error.status===409)conflict=true;weightTotal();status(error.message,true);}
});
$('form').addEventListener('input',()=>{if(snapshot)weightTotal();});$('reload').addEventListener('click',load);$('category').addEventListener('change',filter);$('search').addEventListener('input',filter);
$('member-form').addEventListener('submit',async event=>{
 event.preventDefault();const id=Number($('member-id').value);if(!snapshot||!Number.isSafeInteger(id)||id<1)return;
 const seq=sequence,memberSeq=++memberSequence;$('member-result').textContent='회원 기여도를 조회하고 있습니다.';
 try{const d=await api('/contribution-members/'+id);if(seq!==sequence||memberSeq!==memberSequence||!snapshot)return;
 $('member-result').textContent='회원 #'+id+' · 정책 버전 '+d.policyVersion+'\n종합 '+d.score+'점 · '+(d.grade?d.grade+'등급':'미등급')+' · 기여지수 '+d.index+'\n채굴 평가 '+d.miningScore+'점 · 채굴 적용지수 '+d.miningIndex+'\n검증 인정 '+d.accepted+'건 · 제외 '+d.rejected+'건\n신규 TLC 지급은 아직 연결되지 않았습니다.';
 }catch(error){if(seq===sequence&&memberSeq===memberSequence)$('member-result').textContent='조회 실패: '+error.message;}
});
load();
})();
