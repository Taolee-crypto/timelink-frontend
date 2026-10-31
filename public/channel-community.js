(()=>{
'use strict';
const id=new URLSearchParams(location.search).get('id');if(!id)return;
const kind=location.pathname.includes('car-detail')?'incar':'cafe';
const api='https://api.timelink.digital/api/v5/community/'+kind+'/'+encodeURIComponent(id);
const translations={ko:['의견 나누기','좋아요','공유','댓글 작성','등록','삭제','신고','로그인이 필요합니다.','신고 사유','공유 링크를 복사했습니다.'],en:['Community','Like','Share','Write a comment','Post','Delete','Report','Please sign in.','Reason for report','Link copied.'],ja:['コメント','いいね','共有','コメントを書く','投稿','削除','報告','ログインしてください。','報告理由','リンクをコピーしました。'],zh:['社区','点赞','分享','写评论','发布','删除','举报','请登录。','举报原因','链接已复制。'],th:['ความคิดเห็น','ถูกใจ','แชร์','เขียนความคิดเห็น','ส่ง','ลบ','รายงาน','กรุณาเข้าสู่ระบบ','เหตุผล','คัดลอกลิงก์แล้ว'],vi:['Cộng đồng','Thích','Chia sẻ','Viết bình luận','Đăng','Xóa','Báo cáo','Vui lòng đăng nhập.','Lý do','Đã sao chép liên kết.']};
const lang=(localStorage.getItem('tl_lang')||navigator.language||'ko').split('-')[0],t=translations[lang]||translations.en;
const root=document.createElement('section');root.className='panel';root.style.cssText='padding:24px;margin-top:20px;border:1px solid #45404d;border-radius:16px';
const heading=document.createElement('h2');heading.textContent=t[0];
const actions=document.createElement('div'),like=document.createElement('button'),share=document.createElement('button');like.type=share.type='button';share.textContent=t[2];actions.append(like,share);
const status=document.createElement('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
const comments=document.createElement('div'),form=document.createElement('form'),input=document.createElement('textarea'),submit=document.createElement('button');
input.placeholder=t[3];input.maxLength=2000;input.required=true;input.style.cssText='display:block;width:100%;min-height:90px;margin:15px 0';submit.textContent=t[4];form.append(input,submit);root.append(heading,actions,status,comments,form);document.querySelector('main').append(root);
let currentLike=false,loading=false;
const headers=()=>({'Content-Type':'application/json',Authorization:'Bearer '+(localStorage.getItem('tl_token')||'')});
async function call(path,method='GET',body){const r=await fetch(api+path,{method,headers:headers(),...(body?{body:JSON.stringify(body)}:{})});const d=await r.json();if(!r.ok||!d.ok)throw Error(r.status===401?t[7]:d.error||'HTTP '+r.status);return d;}
async function load(){
 if(loading)return;loading=true;
 try{
  const d=await call('/thread');currentLike=!!d.my_like;status.textContent='';like.textContent=(currentLike?'♥ ':'♡ ')+t[1]+' '+d.likes;comments.replaceChildren();
  for(const c of (Array.isArray(d.comments)?d.comments:[])){
   const article=document.createElement('article'),author=document.createElement('strong'),text=document.createElement('p'),time=document.createElement('small');article.style.cssText='padding:16px 0;border-bottom:1px solid #45404d';author.textContent=c.username;time.textContent=' · '+c.created_at;text.textContent=c.body;text.style.whiteSpace='pre-wrap';article.append(author,time,text);
   if(d.viewer_id!=null&&Number(d.viewer_id)===Number(c.user_id)){const del=document.createElement('button');del.textContent=t[5];del.onclick=async()=>{try{await call('/comments/'+encodeURIComponent(c.id),'DELETE');await load();}catch(e){status.textContent=e.message;}};article.append(del);}
   else if(d.viewer_id){const report=document.createElement('button');report.textContent=t[6];report.onclick=async()=>{const reason=prompt(t[8]);if(!reason)return;try{await call('/comments/'+encodeURIComponent(c.id)+'/report','POST',{reason});status.textContent='✓';}catch(e){status.textContent=e.message;}};article.append(report);}
   comments.append(article);
  }
 }catch(e){status.textContent=e.message;}finally{loading=false;}
}
like.onclick=async()=>{like.disabled=true;try{await call('/like',currentLike?'DELETE':'PUT');await load();}catch(e){status.textContent=e.message;}finally{like.disabled=false;}};
share.onclick=async()=>{try{const url=new URL(location.pathname,location.origin);url.searchParams.set('id',id);if(navigator.share)await navigator.share({title:document.title,url:url.href});else{await navigator.clipboard.writeText(url.href);status.textContent=t[9];}}catch(e){if(e.name!=='AbortError')status.textContent=e.message;}};
form.onsubmit=async e=>{e.preventDefault();submit.disabled=true;try{await call('/comments','POST',{body:input.value});input.value='';status.textContent='';await load();}catch(err){status.textContent=err.message;}finally{submit.disabled=false;}};
load();
})();
