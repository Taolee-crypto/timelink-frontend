/* Editable legal disclosures; text-only insertion, no executable HTML. */
(()=>{
 'use strict';
 const fallback='최종 고지 정보 확인 중';
 const keys={
  'korean_legal.business_registration_number':'business_registration_number',
  'korean_legal.representative_name':'representative_name',
  'korean_legal.registered_address':'registered_address',
  'korean_legal.ecommerce_registration_number':'ecommerce_registration_number',
  'korean_legal.public_phone':'public_phone',
  'privacy.controller_entity':'controller_entity',
  'privacy.protection_officer':'protection_officer',
  'terms.effective_date':'terms_effective_date',
  'terms.approved_version':'terms_version',
  'privacy_notice.effective_date':'privacy_effective_date',
  'privacy_notice.approved_version':'privacy_version'
 };
 function valid(v){return typeof v==='string'&&v.trim().length>0&&v.length<=250;}
 function valueOf(obj,path){
  let cur=obj;
  for(const key of path.split('.'))cur=cur&&typeof cur==='object'?cur[key]:undefined;
  return valid(cur)?cur.trim():fallback;
 }
 function render(obj){
  if(!obj||obj.schema_version!==1)return;
  document.querySelectorAll('[data-legal-key]').forEach(node=>{
   const key=node.getAttribute('data-legal-key');
   if(Object.prototype.hasOwnProperty.call(keys,key))
    node.textContent=valueOf(obj,key);
  });
 }
 async function load(){
  try{
   const response=await fetch('/docs/legal-notice-config.json',{cache:'no-store'});
   if(!response.ok)return;
   render(await response.json());
  }catch(_){ /* Keep checked-in placeholders for offline/unavailable documents. */ }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});
 else load();
})();
