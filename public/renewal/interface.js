(()=>{
'use strict';
function apply(){
  document.querySelectorAll('.tl-sponsors,#tl-sponsors-script,#tl-sponsors-style').forEach(el=>el.remove());
  document.body.classList.remove('tl-ad-layout');
  if(!document.getElementById('tl-interface-style')){
    const link=document.createElement('link');link.id='tl-interface-style';link.rel='stylesheet';link.href='/renewal/interface.css?v=20261026noads2';document.head.append(link);
  }
  if(!document.getElementById('tl-editorial-font')){
    const font=document.createElement('link');font.id='tl-editorial-font';font.rel='stylesheet';font.href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css';document.head.append(font);
  }
  if(!document.getElementById('tl-editorial-style')){
    const link=document.createElement('link');link.id='tl-editorial-style';link.rel='stylesheet';link.href='/renewal/editorial.css?v=20261027a';document.head.append(link);
  }
  const route=window.TLUI?.canonicalPath(location.pathname)||location.pathname;
  if(/^\/(shareplace|track|radio|creator|wallet)\.html$/.test(route)&&new URLSearchParams(location.search).get('tl_player')!=='1'){
    if(!document.getElementById('tl-module-style')){const link=document.createElement('link');link.id='tl-module-style';link.rel='stylesheet';link.href='/renewal/modules.css?v=20261027a';document.head.append(link);}
    if(!document.getElementById('tl-module-script')){const script=document.createElement('script');script.id='tl-module-script';script.src='/renewal/modules.js?v=20261027a';document.head.append(script);}
  }
  const host=document.body.hasAttribute('data-tl-app-host');
  if(host){const frame=document.getElementById('tl-content');if(frame){frame.style.setProperty('width','100%','important');frame.style.setProperty('max-width','none','important');frame.style.setProperty('margin-right','0','important');}}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
window.addEventListener('tl:route',apply);
if(!window.__TL_EDITORIAL_KEYBOARD__){window.__TL_EDITORIAL_KEYBOARD__=true;document.addEventListener('keydown',event=>{if(event.key!=='Enter'||event.target.closest('a,button,input,textarea,select'))return;const card=event.target.closest('.file-card[role="link"],.fl-item[role="link"]');if(card){event.preventDefault();card.click();}});}

})();

