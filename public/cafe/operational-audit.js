(function(){'use strict';
const btn=document.getElementById('cafeAuditCopy'),label=document.getElementById('cafeAuditStatus');if(!btn||!label)return;
const api=window.TL3_API_BASE||'https://api.timelink.digital';
async function check(path){const token=localStorage.getItem('tl_token');if(!token)return {state:'not_logged_in'};try{const r=await fetch(api+path,{headers:{Authorization:'Bearer '+token},cache:'no-store'});const d=await r.json().catch(()=>({}));return !r.ok||d.ok===false?{state:'api_error',http:r.status}:{state:'ok',data:d};}catch{return {state:'network_error'};}}
btn.addEventListener('click',async()=>{btn.disabled=true;label.textContent='확인 중…';try{
const [stores,time]=await Promise.all([check('/api/cafe/my-channels'),check('/api/payment/v5/shareplace-time/status')]);
const channels=stores.state==='ok'&&Array.isArray(stores.data.channels)?stores.data.channels:[];
const active=channels.filter(x=>x.status==='active');
const ms=time.state==='ok'?Number(time.data.time_free_remaining_ms):NaN;
const audio=document.getElementById('cafeAudio'),central=document.getElementById('centralPanel'),manual=document.getElementById('manualPanel');
const result={type:'TILO_CAFE_OPERATIONAL_AUDIT',version:1,checked_at:new Date().toISOString(),authentication:localStorage.getItem('tl_token')?'token_present':'not_logged_in',stores_api:stores.state,stores_http:stores.http||null,store_count:stores.state==='ok'?channels.length:null,active_store_count:stores.state==='ok'?active.length:null,selected_store_active:active.some(x=>String(x.channel_id)===String(document.getElementById('storePicker')?.value)),time_api:time.state,time_http:time.http||null,time_free_remaining_seconds:Number.isFinite(ms)?Math.max(0,Math.floor(ms/1000)):null,central_panel_visible:!!central&&!central.hidden,manual_panel_visible:!!manual&&!manual.hidden,audio_playing:!!audio&&!audio.paused&&!audio.ended&&audio.readyState>=2,audio_ended:!!audio&&audio.ended,audio_error_code:audio?.error?.code||null,note:'Snapshot only; compare before and after each user action.'};
const out=JSON.stringify(result,null,2);let pre=document.getElementById('cafeAuditOutput');if(!pre){pre=document.createElement('pre');pre.id='cafeAuditOutput';pre.style.cssText='white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px';label.after(pre);}pre.textContent=out;
try{await navigator.clipboard.writeText(out);label.textContent='검증 자료가 복사됐습니다. 채팅에 붙여넣어 주세요.';}catch{label.textContent='아래 검증 자료를 직접 복사해 주세요.';}
}catch{label.textContent='자료 생성 실패. 새로고침 후 재시도해 주세요.';}finally{btn.disabled=false;}});
})();
