/* TILO V5: advertising discontinued. Remove any legacy shared advertising rail. */
(()=>{'use strict';function remove(){document.querySelectorAll('.tl-sponsors').forEach(el=>el.remove());document.body?.classList.remove('tl-ad-layout');}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',remove);else remove();window.addEventListener('tl:route',remove);})();
