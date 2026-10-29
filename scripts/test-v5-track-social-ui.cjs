'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('public/track.html','utf8');
function part(a,b){const i=html.indexOf(a),j=html.indexOf(b,i+a.length);assert.ok(i>=0&&j>i,'missing '+a);return html.slice(i,j);}
const init=part('const RAW_SHARE_ID = new URLSearchParams','let _share = null,');
for(const input of ['?id=tl3_178','?id=178','?id=sh_abc123']){
 const cx=vm.createContext({location:{search:input},URLSearchParams,window:{}});
 vm.runInContext(init,cx);
 assert.equal(vm.runInContext('_VALID_SHARE_ID',cx),true,input+' should enable social');
 assert.equal(vm.runInContext('SOCIAL_SHARE_ID',cx),new URLSearchParams(input).get('id'));
}
{
 const cx=vm.createContext({location:{search:'?id=bad%2Funsafe'},URLSearchParams,window:{}});
 vm.runInContext(init,cx);
 assert.equal(vm.runInContext('_VALID_SHARE_ID',cx),false);
}
const target=part('async function loadComments(){','async function reportComment(id){');
const elems={commentList:{innerHTML:'',textContent:'',contains:()=>true},commentInput:{value:'열 글자 이상의 테스트 댓글입니다.'},statComments:{textContent:'3'}};
let commentReads=0,commentWrites=0,likeCalls=0,alerts=[];
let listResult={ok:true,json:async()=>({comments:[{id:17,username:'<img src=x onerror=bad()>',content:'안녕하세요 <b>반갑습니다</b>',created_at:'2026-10-30'}]})};
const ctx=vm.createContext({
 API:'https://api.example.test',SHARE_ID:'178',SOCIAL_SHARE_ID:'tl3_178',_VALID_SHARE_ID:true,
 _myLiked:false,
 document:{getElementById:id=>elems[id]},
 getTok:()=> 'account',
 escH:value=>String(value||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'),
 console:{warn(){}},alert:value=>alerts.push(value),
 reportComment:()=>{},
 fetch:async(url,opt={})=>{
  if(url.includes('/social/comments/')){commentReads++;return listResult;}
  if(url.includes('/social/comment/')){commentWrites++;return {ok:true,json:async()=>({ok:true,comment:{id:18}})};}
  if(url.includes('/social/stats/'))return {ok:true,json:async()=>({comments:4})};
  throw Error('unexpected API '+url);
 }
});
vm.runInContext(target,ctx);
(async()=>{
 await ctx.loadComments();
 assert.equal(commentReads,1);
 assert.ok(elems.commentList.innerHTML.includes('&lt;img'));
 assert.ok(!elems.commentList.innerHTML.includes('username:<img'));
 assert.ok(!elems.commentList.innerHTML.includes('onclick="reportComment('));
 assert.ok(elems.commentList.innerHTML.includes('data-report-id="17"'));
 await ctx.submitComment();
 assert.equal(commentWrites,1);
 assert.equal(commentReads,2);
 assert.equal(elems.commentInput.value,'');
 assert.equal(elems.statComments.textContent,'4','comment count must be server confirmed, never local +1');
 assert.ok(alerts.length===0);
 listResult={ok:false,json:async()=>({error:'권한 없음'})};
 await ctx.loadComments();
 assert.match(elems.commentList.textContent,/댓글을 불러오지 못했습니다/,'failed request must not masquerade as zero comments');
 assert.ok(!elems.commentList.textContent.includes('첫 댓글'));
 assert.match(html,/if\(_likeRequestBusy\)return;/,'disable double-click LIKE mutation');
 assert.ok(!html.includes('app_key=KAKAO_APP_KEY'),'do not emit broken Kakao share link');
 assert.ok(html.includes('await navigator.share('),'native mobile sharing must work');
 assert.ok(html.includes('window.prompt('),'clipboard failure must have fallback');
 console.log('PASS TRACK V5 numeric/sh_ social routing, escaped comments, server comment totals, failure state and Kakao sharing fallback');
})().catch(e=>{console.error(e);process.exitCode=1;});
