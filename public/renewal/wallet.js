/* Wallet presentation uses existing authenticated V5 read APIs only. */
(()=>{
 'use strict';
 const API='https://api.timelink.digital',token=localStorage.getItem('tl_token');
 if(!token){location.replace('/login.html?redirect=%2Fwallet.html');return;}
 const $=id=>document.getElementById(id),refresh=$('walletRefresh'),more=$('walletHistoryMore');
 let generation=0,offset=0,entries=[],historyBusy=false;
 const numeric=value=>value!==null&&value!==undefined&&value!==''&&typeof value!=='boolean'&&Number.isFinite(Number(value));
 const format=(value,digits=4)=>Number(value).toLocaleString('ko-KR',{maximumFractionDigits:digits});
 function amount(value){if(!numeric(value)||Number(value)<0)throw Error('INVALID_BALANCE');return Number(value);}
 function clearBalances(){for(const id of ['walletTl','walletTlc','walletPaid','walletAd','walletBonus'])$(id).textContent='—';}
 async function read(path){const r=await fetch(API+path,{headers:{Authorization:'Bearer '+token,Accept:'application/json'},cache:'no-store',signal:AbortSignal.timeout(12000)});const d=await r.json();if(!r.ok||d.ok===false)throw Error(r.status===401?'AUTH_REQUIRED':'READ_FAILED');return d;}
 function wallet(data){
  const w=data.wallet;if(!w)throw Error('MISSING_WALLET');
  const values={total:amount(w.tl_total),paid:amount(w.tl_p),ad:amount(w.tl_a),bonus:amount(w.tl_b),tlc:amount(w.tlc)};
  if(Math.abs(values.total-values.paid-values.ad-values.bonus)>.00011)throw Error('BALANCE_MISMATCH');
  $('walletTl').textContent=format(values.total);$('walletTlc').textContent=format(values.tlc,9);
  $('walletPaid').textContent=format(values.paid)+' TL';$('walletAd').textContent=format(values.ad)+' TL';$('walletBonus').textContent=format(values.bonus)+' TL';
  window.dispatchEvent(new CustomEvent('tl-balance-updated',{detail:{tl:values.total}}));
 }
 function timeFree(data){const ms=amount(data.time_free_remaining_ms);if(!Number.isSafeInteger(ms))throw Error('INVALID_TIME');const seconds=Math.floor(ms/1000);$('walletTimeFree').textContent=Math.floor(seconds/3600)+'시간 '+Math.floor(seconds%3600/60)+'분 '+seconds%60+'초';}
 function date(raw){const value=String(raw||'');const d=new Date(value.includes('T')?value:value.replace(' ','T')+'Z');return Number.isFinite(d.getTime())?new Intl.DateTimeFormat('ko-KR',{dateStyle:'medium',timeStyle:'short'}).format(d):'일시 확인 필요';}
 function renderHistory(){
  const list=$('walletHistory');if(!entries.length){list.replaceChildren(Object.assign(document.createElement('p'),{className:'module-status',textContent:'아직 원장 이용 기록이 없습니다.'}));$('walletHistoryCount').textContent='0건';return;}
  const fragment=document.createDocumentFragment();
  for(const row of entries){
   const item=document.createElement('article');item.className='wallet-history-row';const copy=document.createElement('div'),title=document.createElement('strong'),meta=document.createElement('span'),value=document.createElement('span');
   title.textContent=String(row.description||'플랫폼 이용 기록');meta.textContent=date(row.created_at);copy.append(title,meta);
   const unit=String(row.asset_code||''),scale=unit==='TL'?10000:unit==='TLC'?1e9:null;
   if(scale&&numeric(row.amount_atoms)&&Number.isSafeInteger(Number(row.amount_atoms))){const n=Number(row.amount_atoms)/scale;value.textContent=(n>0?'+':'')+format(n,unit==='TLC'?9:4)+' '+unit;value.className='wallet-entry-value '+(n>0?'positive':'negative');}
   else{value.textContent='금액 확인 필요';value.className='wallet-entry-value';}
   item.append(copy,value);fragment.append(item);
  }list.replaceChildren(fragment);$('walletHistoryCount').textContent=entries.length+'건';
 }
 async function loadHistory(run,reset){
  if(historyBusy&&!reset)return;historyBusy=true;more.disabled=true;
  const start=reset?0:offset;
  try{
   const data=await read('/api/v3/economy/history?limit=50&offset='+start);if(run!==generation||localStorage.getItem('tl_token')!==token)return;
   if(!Array.isArray(data.entries))throw Error('INVALID_HISTORY');
   if(reset)entries=[];const seen=new Set(entries.map(e=>String(e.entry_id)));for(const row of data.entries)if(!seen.has(String(row.entry_id))){entries.push(row);seen.add(String(row.entry_id));}
   offset=start+data.entries.length;renderHistory();more.hidden=data.entries.length<50;
  }catch(_){if(run!==generation)return;if(reset){entries=[];$('walletHistory').replaceChildren(Object.assign(document.createElement('p'),{className:'module-status',textContent:'이용 기록을 불러오지 못했습니다. 새로고침으로 다시 확인해 주세요.'}));$('walletHistoryCount').textContent='';}else $('walletHistoryCount').textContent='이전 기록을 불러오지 못했습니다. 다시 시도해 주세요.';}
  finally{if(run===generation){historyBusy=false;more.disabled=false;}}
 }
 async function load(){
  const run=++generation;refresh.disabled=true;refresh.setAttribute('aria-busy','true');$('walletStatus').textContent='지갑을 불러오는 중입니다.';clearBalances();$('walletTimeFree').textContent='—';$('walletHistory').replaceChildren(Object.assign(document.createElement('p'),{className:'module-status',textContent:'이용 기록을 불러오는 중입니다.'}));more.hidden=true;
  await Promise.allSettled([
   read('/api/eco/wallet').then(data=>{if(run!==generation||localStorage.getItem('tl_token')!==token)return;wallet(data);$('walletStatus').textContent='현재 계정의 지갑 잔액입니다.';}).catch(()=>{if(run!==generation)return;clearBalances();$('walletStatus').textContent='지갑을 불러오지 못했습니다. 로그인 상태를 확인하고 다시 조회해 주세요.';}),
   read('/api/payment/v5/shareplace-time/status').then(data=>{if(run===generation&&localStorage.getItem('tl_token')===token)timeFree(data);}).catch(()=>{if(run===generation)$('walletTimeFree').textContent='조회 필요';}),
   loadHistory(run,true),
  ]);if(run===generation){refresh.disabled=false;refresh.removeAttribute('aria-busy');}
 }
 refresh.onclick=load;more.onclick=()=>loadHistory(generation,false);load();
})();
