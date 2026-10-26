(()=>{
'use strict';
function apply(){for(const name of ['interface','sponsors']){if(document.getElementById('tl-'+name+'-style'))continue;const link=document.createElement('link');link.id='tl-'+name+'-style';link.rel='stylesheet';link.href='/renewal/'+name+'.css?v=20261026space1';document.head.append(link)}if(!document.getElementById('tl-sponsors-script')){const script=document.createElement('script');script.id='tl-sponsors-script';script.src='/renewal/sponsors.js?v=20261026space1';document.body.append(script)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
