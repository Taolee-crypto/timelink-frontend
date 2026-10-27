/* Presentation only: existing discovery and owner-management routes are reused. */
(()=>{
 'use strict';
 const path=window.TLUI?.canonicalPath(location.pathname)||location.pathname;
 document.querySelectorAll('.gate-local-nav a').forEach(link=>{
  const target=new URL(link.href).pathname;
  if(target===path||(target==='/timelink.html'&&['/timelink-story.html','/timelink-economy.html'].includes(path)))link.setAttribute('aria-current',target===path?'page':'true');
 });
 const catalog=document.getElementById('gateCatalog');if(!catalog)return;
 let generation=0;
 function state(message,retry=false){
  const box=document.createElement('div');box.className='gate-catalog-state';const text=document.createElement('p');text.className='gate-note';text.textContent=message;box.append(text);
  if(retry){const button=document.createElement('button');button.type='button';button.textContent='다시 불러오기';button.onclick=load;box.append(button);}
  catalog.replaceChildren(box);
 }
 function coverURL(raw){try{const url=new URL(raw,location.origin);return /^https?:$/.test(url.protocol)?url.href:''}catch(_){return '';}}
 async function load(){
  const run=++generation;catalog.setAttribute('aria-busy','true');state('공개 음악을 불러오는 중입니다.');
  try{
   const response=await fetch('https://api.timelink.digital/api/shares',{cache:'no-store',signal:AbortSignal.timeout(12000)});if(!response.ok)throw Error('CATALOG_UNAVAILABLE');
   const data=await response.json();let rows=Array.isArray(data)?data:data.shares||data.items||data.data;if(!Array.isArray(rows))throw Error('INVALID_CATALOG');
   rows=rows.filter(row=>row&&(row.id||row.share_id)&&[row.content_kind,row.file_type,row.release_mode].some(kind=>['tl3','audio/tl3'].includes(String(kind||'').toLowerCase()))).sort((a,b)=>(Date.parse(b.created_at)||0)-(Date.parse(a.created_at)||0)).slice(0,8);
   if(run!==generation)return;if(!rows.length){state('아직 공개된 음악이 없습니다. 공유플레이스에서 목록을 확인하거나 나의 음악을 등록해 보세요.');return;}
   const cards=rows.map(row=>{
    const card=document.createElement('a');card.className='gate-work';card.href='/track.html?id='+encodeURIComponent(String(row.share_id||row.id));
    const image=document.createElement('img'),fallback='/images/renewal/vinyl-collection-card.jpg';const cover=coverURL(row.cover_url||row.artwork_url||row.cover_image||'');image.src=cover||fallback;image.alt=String(row.title||'음악')+(cover?' 앨범 커버':' 대표 이미지');image.loading='lazy';image.decoding='async';image.width=320;image.height=320;image.onerror=()=>{image.onerror=null;image.src=fallback;image.alt='앨범 커버 대신 표시하는 대표 이미지';};
    const title=document.createElement('strong');title.textContent=String(row.title||'제목 없음');const artist=document.createElement('span');artist.textContent=String(row.artist||row.creator_name||'아티스트 미등록');card.append(image,title,artist);return card;
   });catalog.replaceChildren(...cards);
  }catch(_){if(run===generation)state('음악을 불러오지 못했습니다. 다시 시도하거나 공유플레이스로 이동해 주세요.',true);}
  finally{if(run===generation)catalog.setAttribute('aria-busy','false');}
 }
 load();
})();
