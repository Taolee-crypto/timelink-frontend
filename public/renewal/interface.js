(()=>{
'use strict';
function apply(){
  document.querySelectorAll('.tl-sponsors,#tl-sponsors-script,#tl-sponsors-style').forEach(el=>el.remove());
  document.body.classList.remove('tl-ad-layout');
  if(!document.getElementById('tl-interface-style')){
    const link=document.createElement('link');link.id='tl-interface-style';link.rel='stylesheet';link.href='/renewal/interface.css?v=20261026noads2';document.head.append(link);
  }
  const host=document.body.hasAttribute('data-tl-app-host');
  if(host){const frame=document.getElementById('tl-content');if(frame){frame.style.setProperty('width','100%','important');frame.style.setProperty('max-width','none','important');frame.style.setProperty('margin-right','0','important');}}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
window.addEventListener('tl:route',apply);
})();
