(function(){
'use strict';
// Existing releases are PRIVATE registrations for rights review, not TL3
// issuance, a catalog match, royalty entitlement or public distribution.
const API='https://api.timelink.digital';
const $=id=>document.getElementById(id);
const token=()=>localStorage.getItem('tl_token')||'';
const supported=/\.(?:mp3|wav|flac|m4a|aac)$/i;
let submitting=false;
function validateCreatorExistingFiles(selected){
 const files=Array.from(selected||[]);
 if(files.length<1||files.length>10)return {ok:false,error:'한 번에 1~10곡을 선택해 주세요.'};
 const invalid=files.find(f=>!supported.test(String(f.name||''))||!Number.isFinite(Number(f.size))||f.size<=0||f.size>20*1024*1024);
 if(invalid)return {ok:false,error:'지원되지 않거나 20MB를 초과한 파일: '+String(invalid.name||'이름 없음')};
 return {ok:true,files};
}
function status(message){const node=$('existingRecordingStatus');if(node)node.textContent=message;}
function showHistory(registrations){
 const holder=$('existingRecordingHistory');
 if(!holder)return;
 holder.replaceChildren();
 const entries=Array.isArray(registrations)?registrations.slice(0,20):[];
 if(!entries.length){holder.textContent='아직 기존 발매 음원의 권리 검토 신청 내역이 없습니다.';return;}
 for(const entry of entries){
  const item=document.createElement('div');item.className='existing-review-entry';
  const info=document.createElement('div'),name=document.createElement('strong'),details=document.createElement('small'),state=document.createElement('span');
  name.textContent=String(entry.title||entry.file_name||'제목 미입력');
  details.textContent=[entry.artist,entry.file_name,entry.created_at].filter(Boolean).map(String).join(' · ');
  const names={pending_rights:'권리 검토 대기',rights_review:'권리 검토 중',approved:'승인됨',rejected:'반려',disputed:'분쟁 검토'};
  state.textContent=names[entry.status]||'상태 확인: '+String(entry.status||'접수');
  info.append(name,details);item.append(info,state);holder.append(item);
 }
}
async function refreshHistory(){
 const t=token();
 if(!t){status('기존 발매 음원 신청과 내역 확인은 회원 로그인 후 사용할 수 있습니다.');return;}
 try{
  const response=await fetch(API+'/api/v5/music-discovery/',{headers:{Authorization:'Bearer '+t},cache:'no-store'});
  const data=await response.json().catch(()=>({}));
  if(!response.ok||data.ok!==true||!Array.isArray(data.registrations))throw Error(data.error||'신청 목록 조회 실패');
  if(token()!==t)throw Error('조회 중 로그인 계정이 변경됐습니다.');
  showHistory(data.registrations);
 }catch(error){
  status('신청 내역을 불러오지 못했습니다: '+(error.message||error));
 }
}
async function submitExistingReview(){
 if(submitting)return;
 const t=token();
 if(!t){status('신청하려면 먼저 로그인해 주세요.');return;}
 const checked=validateCreatorExistingFiles($('existingRecordingFiles')?.files);
 if(!checked.ok){status(checked.error);return;}
 const role=$('existingRecordingRole')?.value;
 if(!['recording_owner','composition_owner','authorized_agent'].includes(role)){
  status('신청인의 권리 관계를 선택해 주세요.');return;
 }
 if(!$('existingRecordingConsent')?.checked){
  status('권리 확인 및 비공개 검토 절차에 동의해 주세요.');return;
 }
 const evidence=String($('existingRecordingEvidence')?.value||'').trim();
 if(evidence&&!/^https:\/\//i.test(evidence)){status('권리 증빙 주소는 HTTPS 링크만 입력할 수 있습니다.');return;}
 const isrc=String($('existingRecordingIsrc')?.value||'').trim();
 const artist=String($('existingRecordingArtist')?.value||'').trim().slice(0,200);
 const batch='creator_'+crypto.randomUUID().replace(/-/g,'');
 const button=$('existingRecordingSubmit');submitting=true;if(button)button.disabled=true;
 let accepted=0,replayed=0;
 try{
  for(const [i,file] of checked.files.entries()){
   if(token()!==t)throw Error('신청 중 계정이 변경됐습니다. 제출을 중단합니다.');
   status((i+1)+' / '+checked.files.length+'곡을 암호화하여 비공개 신청 중입니다.');
   const form=new FormData();
   form.append('batch_id',batch);
   form.append('file',file,file.name);
   form.append('title',file.name.replace(/\.[^.]+$/,''));
   form.append('artist',artist);
   form.append('metadata',JSON.stringify({
    source:'creator-existing-recording-review',
    rights_role:role,isrc:isrc||null,evidence_url:evidence||null,
    acknowledgement:'pending_manual_verification'
   }));
   const response=await fetch(API+'/api/v5/music-discovery/',{
    method:'POST',headers:{Authorization:'Bearer '+t},body:form
   });
   const data=await response.json().catch(()=>({}));
   if(!response.ok||data.ok!==true)throw Error(data.error||'신청 실패 (HTTP '+response.status+')');
   if(data.replayed)replayed++;else accepted++;
  }
  status('신규 '+accepted+'곡 신청 완료 · 기존 중복 '+replayed+'곡. 모든 신청은 비공개 권리 검토 대기이며 공개·재생·정산 승인이 아닙니다.');
  $('existingRecordingFiles').value='';
  await refreshHistory();
 }catch(error){
  status('신규 '+accepted+'곡 신청됨 · 기존 중복 '+replayed+'곡. 남은 신청은 중단했습니다: '+(error.message||error)+'. 이미 제출된 곡은 다시 신청하기 전에 신청 내역을 확인하세요.');
 }finally{
  submitting=false;if(button)button.disabled=false;
 }
}
const submit=$('existingRecordingSubmit'),refresh=$('existingRecordingRefresh');
if(submit)submit.addEventListener('click',submitExistingReview);
if(refresh)refresh.addEventListener('click',refreshHistory);
if($('existingRecordingReview'))refreshHistory();
})();
