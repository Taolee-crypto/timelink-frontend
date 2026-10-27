/* Screen-level usability helpers; playback, validation and settlement stay in
 * their existing controllers. No interval or audio graph is created here. */
(()=>{
 'use strict';if(window.__TL_MODULE_UI__)return;window.__TL_MODULE_UI__=true;
 const path=window.TLUI?.canonicalPath(location.pathname)||location.pathname;
 if(new URLSearchParams(location.search).get('tl_player')==='1')return;
 const configs={
  '/shareplace.html':{kind:'discover',root:'.main',label:'NEW ASSET / SHAREPLACE',links:[['/new-asset.html','작품 둘러보기'],['/renewal/music.html','내 음악 관리']]},
  '/track.html':{kind:'track',root:'#mainWrap',label:'NEW ASSET / TRACK',links:[['/shareplace.html','공유플레이스'],['#lyricsWrap','가사'],['#commentInput','댓글']]},
  '/radio.html':{kind:'radio',root:'.radio-page',label:'BROADCAST / TILO',links:[['/dj-center.html','나의 방송'],['/world-network.html','월드 네트워크']]},
  '/creator.html':{kind:'creator',root:'main',label:'NEW ASSET / CREATOR',links:[['/renewal/music.html','내 음악 관리'],['/dashboard.html?tab=content','등록 내역'],['/my-profile.html','내 정보']]},
  '/wallet.html':{kind:'wallet',root:'.wallet-page',label:'MY INFORMATION / WALLET',links:[['/my-profile.html','내 정보'],['/dashboard.html?tab=settlement','정산 내역']]},
 };
 function ready(){
  const cfg=configs[path];if(!cfg)return;const root=document.querySelector(cfg.root);if(!root)return;document.body.dataset.tlModule=cfg.kind;
  const bar=document.createElement('nav');bar.className='module-context';bar.setAttribute('aria-label','현재 화면과 관련 기능');const label=document.createElement('span');label.textContent=cfg.label;bar.append(label);
  for(const [href,text] of cfg.links){const a=document.createElement('a');a.href=href;a.textContent=text;bar.append(a);}
  const labels={plBtn:'재생목록에 추가',shareBtn:'곡 공유하기',likeBtn:'좋아요',followBtn:'아티스트 팔로우',coverPlayBtn:'음악 재생',coverEditBtn:'앨범 커버 변경'};
  let queued=false;
  function refresh(){
   queued=false;if(!root.contains(bar))root.prepend(bar);
   for(const [id,label] of Object.entries(labels)){const el=document.getElementById(id);if(el&&!el.hasAttribute('aria-label'))el.setAttribute('aria-label',label);}
   if(cfg.kind==='track'){
    const rate=root.querySelector('.track-tl.required');if(rate?.firstChild?.nodeType===3)rate.firstChild.textContent='곡별 TL 이용 기준: ';
    const placeholder=root.querySelector('.cover-placeholder');if(placeholder){const image=document.createElement('img');image.src='/images/renewal/vinyl-collection-card.jpg';image.alt='앨범 커버 미등록 대표 이미지';placeholder.replaceWith(image);}
    const cover=root.querySelector('#coverWrap>img');if(cover&&!cover.dataset.moduleFallback){cover.dataset.moduleFallback='1';cover.removeAttribute('onerror');cover.addEventListener('error',()=>{cover.style.display='';cover.src='/images/renewal/vinyl-collection-card.jpg';cover.alt='앨범 커버 대신 표시하는 대표 이미지';},{once:true});}
   }
  }
  refresh();new MutationObserver(()=>{if(!queued){queued=true;queueMicrotask(refresh);}}).observe(root,{childList:true});
  if(cfg.kind==='creator'){
   root.querySelectorAll('.field').forEach(field=>{const label=field.querySelector('label:not([for])'),input=field.querySelector('input[id],select[id],textarea[id]');if(label&&input){if(document.querySelectorAll('[id="'+CSS.escape(input.id)+'"]').length===1)label.htmlFor=input.id;else{if(!label.id)label.id="module-field-label-"+[...root.querySelectorAll(".field")].indexOf(field);input.setAttribute("aria-labelledby",label.id);}}});
   root.querySelectorAll('.drop').forEach(drop=>{drop.tabIndex=0;drop.setAttribute('role','button');drop.setAttribute('aria-label',drop.querySelector('strong')?.textContent||'파일 선택');drop.addEventListener('keydown',e=>{if(!['Enter',' '].includes(e.key)||e.target!==drop||drop.querySelector('input')?.disabled)return;e.preventDefault();drop.click();});});
  }
  if(['discover','track'].includes(cfg.kind))setupTimeFree(bar);
  if(cfg.kind==='track')setupDialogs();
 }
 function setupTimeFree(bar){
  const box=document.createElement('section');box.className='module-time-free';box.setAttribute('aria-label','시간 자유 이용권');const copy=document.createElement('div'),tag=document.createElement('strong'),status=document.createElement('span'),action=document.createElement('a');tag.textContent='TIME FREE';status.textContent='나의 시간 이용권을 확인하세요.';copy.append(tag,status);action.href='/shareplace.html';action.textContent='시간 이용권';box.append(copy,action);bar.after(box);
  action.onclick=e=>{const buy=document.getElementById('tlTimeBuy');if(buy){e.preventDefault();buy.click();}};
  let generation=0;
  async function load(){const token=localStorage.getItem('tl_token'),run=++generation;if(!token){status.textContent='로그인 후 시간 이용권을 확인할 수 있습니다.';return;}
   try{const r=await fetch('https://api.timelink.digital/api/payment/v5/shareplace-time/status',{headers:{Authorization:'Bearer '+token},cache:'no-store',signal:AbortSignal.timeout(10000)});const d=await r.json();if(run!==generation||localStorage.getItem('tl_token')!==token)return;if(!r.ok||!d.ok||!Number.isSafeInteger(d.time_free_remaining_ms)||d.time_free_remaining_ms<0)throw Error();const seconds=Math.floor(d.time_free_remaining_ms/1000);status.textContent=seconds>0?'남은 시간 '+Math.floor(seconds/60)+'분 '+seconds%60+'초 · 이용권 청취는 TL 차감·보상 없음':'보유한 시간 이용권이 없습니다. 구매한 시간만큼 자유롭게 들으세요.';box.dataset.active=String(seconds>0);}
   catch(_){if(run===generation)status.textContent='이용권 상태를 불러오지 못했습니다. 시간 이용권에서 다시 확인해 주세요.';}
  }
  // Reattach after the track's asynchronous render replaces its children.
  const root=bar.parentElement;new MutationObserver(()=>{if(root.contains(bar)&&!root.contains(box))bar.after(box);}).observe(root,{childList:true});
  window.addEventListener('focus',load);load();
 }
 function setupDialogs(){
  const dialogs=[...document.querySelectorAll('.modal-overlay')],previous=new WeakMap();
  const visible=el=>el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden';
  const focusable=el=>[...el.querySelectorAll('a[href],button,input,textarea,select,[tabindex="0"]')].filter(node=>!node.disabled&&visible(node));
  for(const dialog of dialogs){new MutationObserver(()=>{const open=visible(dialog);if(open&&!previous.has(dialog)){previous.set(dialog,document.activeElement);dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');if(!dialog.hasAttribute('aria-label')&&!dialog.hasAttribute('aria-labelledby'))dialog.setAttribute('aria-label',dialog.querySelector('.modal-title')?.textContent||'상세 안내');focusable(dialog)[0]?.focus({preventScroll:true});}else if(!open&&previous.has(dialog)){const old=previous.get(dialog);previous.delete(dialog);if(old?.isConnected)old.focus({preventScroll:true});}}).observe(dialog,{attributes:true,attributeFilter:['class','style']});}
  document.addEventListener('keydown',e=>{if(e.defaultPrevented)return;const dialog=dialogs.filter(visible).at(-1);if(!dialog)return;
   if(e.key==='Escape'){const close=dialog.querySelector('.modal-close');if(close&&!close.disabled){e.preventDefault();e.stopPropagation();close.click();}return;}
   if(e.key!=='Tab')return;const items=focusable(dialog);if(!items.length){e.preventDefault();return;}const first=items[0],last=items.at(-1);if(e.shiftKey&&(document.activeElement===first||!dialog.contains(document.activeElement))){e.preventDefault();last.focus();}else if(!e.shiftKey&&(document.activeElement===last||!dialog.contains(document.activeElement))){e.preventDefault();first.focus();}
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
