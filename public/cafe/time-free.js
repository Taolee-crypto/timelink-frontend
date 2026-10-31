/* Two and only two cafe listening methods share the existing paid TIME FREE.
   This module checks owner+TIME FREE; TL3 V5 server does the final licensed
   session/metering and cannot silently fall back to the member's TL wallet. */
(function(global){
 'use strict';
 const API=global.TL3_API_BASE||'https://api.timelink.digital';
 async function get(path){
  const token=localStorage.getItem('tl_token')||'';
  if(!token)throw Error('회원 로그인 후 나의 카페 음악을 이용해 주세요.');
  const r=await fetch(API+path,{headers:{Authorization:'Bearer '+token},cache:'no-store'});
  const d=await r.json().catch(()=>({}));
  if(!r.ok||d.ok===false)throw Error(d.error||'TIME FREE 또는 매장 권한을 확인할 수 없습니다.');
  return d;
 }
 async function owned(id){
  if(!/^cafe_[a-z0-9]{8,32}$/i.test(id))throw Error('올바른 매장을 선택해 주세요.');
  const d=await get('/api/cafe/my-channels');
  const store=(Array.isArray(d.channels)?d.channels:[]).find(c=>c.channel_id===id&&c.status==='active');
  if(!store)throw Error('본인이 개설한 활성 매장에서만 음악을 틀 수 있습니다.');
  return store;
 }
 async function timeFree(){
  const d=await get('/api/payment/v5/shareplace-time/status');
  return {seconds:Math.max(0,Math.floor(Number(d.time_free_remaining_ms||0)/1000)),mode:d.billing_mode};
 }
 async function requireTime(id){
  const store=await owned(id);
  const time=await timeFree();
  if(time.seconds<=0){const e=Error('TIME FREE 잔여시간이 없습니다. 음악을 틀기 전에 TIME FREE를 구매해 주세요.');e.code='CAFE_TIME_FREE_REQUIRED';throw e;}
  return {store,...time};
 }
 global.TiloCafeTimeFree=Object.freeze({owned,timeFree,requireTime,purchaseUrl:'/shareplace.html'});
})(window);
