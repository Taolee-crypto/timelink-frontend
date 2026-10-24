/* One announcement surface owned by the persistent host, never one per frame. */
(function(){
'use strict';if(window.parent!==window||window.__TL_NOTICE_LOADED__)return;window.__TL_NOTICE_LOADED__=true;
var lang=(window.TLUI&&TLUI.lang)||'ko',langs=['ko','en','ja','zh','th','vi'],idx=Math.max(0,langs.indexOf(lang));
var labels={title:['공지사항','Announcements','お知らせ','公告','ประกาศ','Thông báo'],close:['닫기','Close','閉じる','关闭','ปิด','Đóng'],until:['안내 기간','Notice until','案内期限','公告期限','ประกาศถึง','Thông báo đến']};
function t(k){return labels[k][idx]||labels[k][1]}
function get(k){try{return localStorage.getItem(k)}catch(e){return null}}function set(k){try{localStorage.setItem(k,'1')}catch(e){}}
var day=new Date().toISOString().slice(0,10);
fetch('https://api.timelink.digital/api/notice/active',{signal:AbortSignal.timeout(8000)}).then(function(r){return r.ok?r.json():null}).then(function(data){
 if(!data||!data.active||!data.message)return;var message=String(data.message).slice(0,20000),hash=0;for(var i=0;i<message.length;i++)hash=((hash<<5)-hash+message.charCodeAt(i))|0;var seenKey='tl_notice_seen_'+day+'_'+hash;
 var header=document.querySelector('.tl-header-right');if(!header)return;
 var button=document.createElement('button');button.type='button';button.className='tl-notice-button';button.setAttribute('aria-label',t('title'));button.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>';button.dataset.unread=String(!get(seenKey));header.prepend(button);
 var dialog=document.createElement('dialog');dialog.className='tl-notice-dialog';dialog.setAttribute('aria-labelledby','tlNoticeTitle');
 var title=document.createElement('h2');title.id='tlNoticeTitle';title.textContent=t('title');var body=document.createElement('p');body.className='tl-notice-message';body.textContent=message;var close=document.createElement('button');close.type='button';close.className='tl-btn primary';close.textContent=t('close');dialog.append(title,body);
 if(data.until){var until=document.createElement('p');until.className='tl-notice-until';until.textContent=t('until')+' · '+String(data.until);dialog.append(until)}dialog.append(close);document.body.append(dialog);
 button.onclick=function(){dialog.showModal()};function dismiss(){set(seenKey);button.dataset.unread='false';dialog.close();button.focus()}close.onclick=dismiss;dialog.addEventListener('cancel',function(e){e.preventDefault();dismiss()});
 // Operational warnings remain prominent; ordinary announcements can be opened from the header.
 if(['warning','urgent'].includes(data.style)&&!get(seenKey))dialog.showModal();
}).catch(function(){});
})();
