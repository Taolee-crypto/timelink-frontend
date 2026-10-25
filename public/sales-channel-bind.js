(async function(){
 const root=document.getElementById('salesChannelBinding');if(!root)return;
 const country=document.getElementById('storeCountry'),manager=document.getElementById('storeManager'),dj=document.getElementById('storeDj'),status=document.getElementById('storeSalesStatus'),invite=new URLSearchParams(location.search).get('sales_invite');
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 try{
  const r=await fetch('https://api.timelink.digital/api/sales/directory',{cache:'no-store'}),d=await r.json();if(!r.ok||!d.ok)throw Error(d.error||'매니저 조회 실패');
  function render(){const old=manager.value;manager.innerHTML='<option value="">직접 등록 · 담당 매니저 미배정</option>'+d.managers.filter(x=>x.country===country.value).map(x=>'<option value="'+x.user_id+'">'+esc(x.display_name)+'</option>').join('');if([...manager.options].some(x=>x.value===old))manager.value=old;}
  country.addEventListener('change',render);render();
  dj.innerHTML='<option value="">DJ 선택</option>'+d.djs.map(x=>'<option value="'+x.id+'">'+esc(x.dj_name)+'</option>').join('');
  if(invite){const response=await fetch('https://api.timelink.digital/api/sales/invites/'+encodeURIComponent(invite)),info=await response.json();if(!response.ok||!info.ok)throw Error(info.error||'초대 확인 실패');country.value=info.manager.country;render();manager.value=String(info.manager.user_id);}
  status.textContent='상점주가 동의하면 등록과 동시에 스토어 페이지와 담당 매니저 연결이 생성됩니다.';
 }catch(e){status.textContent=e.message;manager.disabled=true;}
})();
