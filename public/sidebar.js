/* TimeLink shared navigation. Existing destination filenames are intentional. */
(function(){
'use strict';if(window.__TL_GLOBAL_SHELL_V4__)return;window.__TL_GLOBAL_SHELL_V4__=true;
if(window.parent!==window&&!document.body.hasAttribute('data-tl-app-host'))return;
var UI=window.TLUI;if(!UI)return;
var API=window.TL3_API_BASE||'https://api.timelink.digital',token=localStorage.getItem('tl_token')||'';
var t=UI.t,esc=UI.esc;
var icons={home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',explore:'<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5Z"/>',radio:'<rect x="3" y="8" width="18" height="13" rx="3"/><path d="m5 8 12-6M6 12h6"/><circle cx="16" cy="15" r="2"/>',space:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',store:'<path d="M3 10h18l-2-6H5l-2 6Zm2 0v11h14V10M9 21v-7h6v7"/>',car:'<path d="m5 7 2-4h10l2 4 2 3v9h-3v-3H6v3H3v-9l2-3Zm0 0h14M3 11h18M7 13h1m8 0h1"/>',manager:'<rect x="3" y="7" width="18" height="14" rx="3"/><path d="M8 7V4h8v3M3 12c6 4 12 4 18 0M12 12v4"/>',globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',generic:'<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 12h8m-4-4v8"/>'};
function icon(k){return '<span class="tl-global-icon" aria-hidden="true"><svg viewBox="0 0 24 24">'+(icons[k]||icons.generic)+'</svg></span>'}
var sections = [
 ['MAIN','main',[
  ['/timelink.html','home','TimeLink','TimeLink'],
  ['/new-asset.html','explore','New Asset','New Asset'],
  ['/radio.html','radio','Broadcast','Broadcast'],
  ['/world-network.html','globe','World Network','World Network']
 ]],
 ['CREATE','create',[
  ['/creator.html','generic','create']
 ]],
 ['ACTIVITY','activity',[
  ['/my-cafe.html','store','My Cafe','나의 카페'],
  ['/my-car.html','car','My Car','나의 차']
 ]],
 ['WORLD','world',[
  ['/cafe-world.html','store','Store World','스토어월드'],
  ['/my-car-world.html','car','Car World','카월드']
 ]],
 ['TOOLS','tools',[
  ['/dashboard.html','home','My Activity','내 활동 요약'],
  ['/shareplace.html','explore','explore'],
  ['/dashboard.html?tab=content','space','history'],
  ['/wallet.html','generic','wallet'],
  ['/my-profile.html','space','My Info','내 정보'],
  ['/renewal/music.html','generic','music'],
  ['/dashboard.html?tab=settlement','generic','settlement'],
  ['/dashboard.html?tab=mining','generic','mining'],
  ['/dashboard.html?tab=mission','generic','missions'],
  ['/tl-tlc-pool.html','generic','pool']
 ]]
  ];
var groupNames={world:['월드','World','ワールド','世界','โลก','Thế giới']};
function groupName(key){return groupNames[key]?groupNames[key][['ko','en','ja','zh','th','vi'].indexOf(UI.lang)]||groupNames[key][1]:t(key)}
function name(item){return item[3]?(UI.lang==='ko'?item[3]:item[2]):t(item[2])}
function link(item){return '<a class="tl-global-link" href="'+esc(item[0])+'">'+icon(item[1])+'<span>'+esc(name(item))+'</span></a>'}
function activityLink(item){
  if(!item[4])return link(item);
  return '<details class="tl-global-subdetails" open><summary>'+icon(item[1])+'<span>'+esc(name(item))+'</span></summary><div class="tl-global-sublinks">'+item[4].map(link).join('')+'</div></details>';
}
var html='<a class="tl-skip" href="#tl-content">'+esc(t('skip'))+'</a><aside class="tl-global-sidebar" aria-label="TimeLink"><a class="tl-global-brand" href="/timelink.html"><span class="tl-global-mark">t</span>TimeLink</a><nav class="tl-global-links">';
html+=sections[0][2].map(link).join('');html+='<a class="tl-global-create" href="/creator.html">＋ '+esc(t('create'))+'</a>';
sections.slice(2).forEach(function(group){html+='<details class="tl-global-details"'+(group[1]==='activity'||group[1]==='world'?' open':'')+'><summary>'+esc(groupName(group[1]))+'</summary>'+(group[1]==='activity'?group[2].map(activityLink):group[2].map(link)).join('')+'</details>'});
html+='</nav><a class="tl-global-link tl-global-account" href="/my-profile.html">'+icon('space')+'<span>'+esc(t('myInfo'))+'</span></a><div class="tl-global-balance"><small>'+esc(t('balance'))+'</small><strong id="tlGlobalBalance">'+(token?'…':'— TL')+'</strong><a href="/wallet.html#charge">'+esc(t('charge'))+' ↗</a><button type="button" class="tl-global-logout" data-tl-logout hidden>로그아웃</button></div></aside><nav class="tl-bottom-nav" aria-label="Mobile navigation">'+sections[0][2].map(function(item){return '<a href="'+esc(item[0])+'">'+icon(item[1])+'<span>'+esc(name(item))+'</span></a>'}).join('')+'</nav>';
document.body.insertAdjacentHTML('afterbegin',html);document.body.classList.add('tl-global-shell');
function entrance(path){if(['/timelink.html','/timelink-story.html','/timelink-economy.html','/b2b.html','/download.html'].includes(path))return '/timelink.html';if(['/new-asset.html','/shareplace.html','/track.html','/creator.html'].includes(path))return '/new-asset.html';if(path==='/radio.html')return path;if(['/world-network.html','/cafe-world.html','/my-car-world.html'].includes(path))return '/world-network.html';return null;}
function active(href){var u=new URL(href,location.origin),query=u.searchParams;var page=document.body.dataset.currentRoute||href;var v=new URL(page,location.origin);document.querySelectorAll('.tl-global-link,.tl-bottom-nav a').forEach(function(a){var w=new URL(a.href),same=w.pathname===v.pathname&&w.search===v.search;a.classList.toggle('is-active',same);a.classList.toggle('is-current-section',!same&&w.pathname===entrance(v.pathname));if(same){a.setAttribute('aria-current','page');var parent=a.parentElement;while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement}}else a.removeAttribute('aria-current')})}
window.addEventListener('tl:route',function(e){document.body.dataset.currentRoute=e.detail.href;active(e.detail.href)});active(location.pathname+location.search);
var toggle=document.getElementById('tlMenuToggle');var scrim=document.createElement('button');scrim.className='tl-global-scrim';scrim.type='button';scrim.setAttribute('aria-label','Close navigation');document.body.appendChild(scrim);
function close(){document.body.classList.remove('tl-global-nav-open');if(toggle)toggle.setAttribute('aria-expanded','false')}
if(toggle)toggle.onclick=function(){var opened=document.body.classList.toggle('tl-global-nav-open');toggle.setAttribute('aria-expanded',String(opened))};scrim.onclick=close;document.querySelector('.tl-global-sidebar').addEventListener('click',function(e){if(e.target.closest('a'))close()});document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
function apply(value){var n=Number(value);if(!Number.isFinite(n)||n<0)return;window.__tlV5WalletBalance=n;document.getElementById('tlGlobalBalance').textContent=n.toLocaleString()+' TL'}
async function refresh(){token=localStorage.getItem('tl_token')||'';if(!token){document.getElementById('tlGlobalBalance').textContent='— TL';return}try{var r=await fetch(API+'/api/eco/wallet',{headers:{Authorization:'Bearer '+token,Accept:'application/json'},cache:'no-store'});if(!r.ok)throw Error('Wallet');var data=await r.json();if(!data.wallet||data.wallet.tl_total==null)throw Error('Missing V5 wallet');apply(data.wallet.tl_total)}catch(e){document.getElementById('tlGlobalBalance').textContent=UI.lang==='ko'?'잔액 확인 필요':'Balance unavailable'}}
window.addEventListener('tl-balance-updated',function(e){if(e.detail&&e.detail.tl!=null)apply(e.detail.tl)});window.addEventListener('pageshow',refresh);window.addEventListener('focus',refresh);window.addEventListener('tl:route',refresh);document.addEventListener('visibilitychange',function(){if(!document.hidden)refresh()});refresh();
var checkedAdminToken='';
function refreshAdminAccess(){var nextToken=localStorage.getItem('tl_token')||'';if(nextToken===checkedAdminToken)return;checkedAdminToken=nextToken;var old=document.querySelector('[data-tl-admin-menu]');if(old)old.remove();if(!nextToken)return;fetch(API+'/api/admin/settings/__sidebar_access__',{headers:{Authorization:'Bearer '+nextToken,Accept:'application/json'}}).then(function(r){return r.ok?r.json():null}).then(function(result){if(!result||result.ok===false||localStorage.getItem('tl_token')!==nextToken)return;var nav=document.querySelector('.tl-global-links');var d=document.createElement('details');d.className='tl-global-details';d.setAttribute('data-tl-admin-menu','');d.innerHTML='<summary>'+t('operations')+'</summary>'+[
 ['/admin.html','generic','operations'],['/tilo-admin.html','radio','broadcastOps'],['/reward-policy.html','generic','rewardPolicy'],['/v5-work-ledger.html','generic','workLedger'],['/community-admin.html','generic','moderation']].map(link).join('');nav.appendChild(d)}).catch(function(){});}
window.addEventListener('tl:route',refreshAdminAccess);window.addEventListener('focus',refreshAdminAccess);refreshAdminAccess();
})();


