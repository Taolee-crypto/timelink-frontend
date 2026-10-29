'use strict';
// Regression: public catalog does not expose TL3 V5 stream URLs.
// Owner lyric PATCH must render the saved text before a page reload.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('public/track.html','utf8');
function part(a,b){const i=html.indexOf(a),j=html.indexOf(b,i+a.length);assert.ok(i>=0&&j>i,a);return html.slice(i,j);}
const player=part('async function playTrack(){','function startTLTimer(){');
assert.ok(player.includes('TL3V5Player.canPlay(RAW_SHARE_ID || SHARE_ID)'));
assert.ok(player.includes('TL3V5Player.playStream(RAW_SHARE_ID || SHARE_ID'));
const guard=player.match(/if\((!_useTl3V5 && !fileUrl)\)\s*\{ alert\('재생 파일이 없습니다'\); return; \}/);
assert.ok(guard,'V5 protected playback must not require public stream_url');
const missingSourceBlocks=new Function('_useTl3V5','fileUrl','return '+guard[1]);
assert.equal(missingSourceBlocks(true,undefined),false,'licensed V5 with no public source may play');
assert.equal(missingSourceBlocks(false,undefined),true,'unlicensed legacy fallback must fail closed');
assert.equal(missingSourceBlocks(false,'https://example.test/stream'),false);

const lyric=part('function renderPlainLyrics(s){','function syncTrackEditGenre(){');
const save=part('async function saveTrackInfo(){','function typeEmoji(t){');
const original='새 가사 <script>alert(1)</script>\n두 번째 줄';
const share={id:10,user_id:7,lyrics:'이전 가사',title:'테스트 음악',artist:'예전 가수'};
const elements={lyricsWrap:{style:{display:'none'}},
 lyricsBox:{textContent:'',classList:{toggle(k,v){this.empty=!!v;}}},
 trackInfoModal:{classList:{remove(){}}},
 saveTrackInfoBtn:{disabled:false,textContent:'저장'},
 trackInfoEditError:{style:{display:'none'},textContent:''}};
for(const name of ['Artist','Album','Composer','Lyricist','Producer','Arranger','Category','Lyrics'])
 elements['editTrack'+name]={value:name==='Lyrics'?original:name==='Artist'?'새 가수':''};
let patches=0,reads=0,mode='all',stored={...share},alerts=[],closed=0;
const ctx=vm.createContext({
 _share:share,_currentUserId:7,SHARE_ID:'10',API:'https://api.example.test',
 getTok:()=> 'fixture',document:{
  getElementById:id=>elements[id],
  querySelector:selector=>({' .track-meta .track-category':null}[selector]||{textContent:''})
 },
 alert:msg=>alerts.push(msg),console:{warn(){}},
 renderCopyright:()=>{},closeTrackInfoEditor:()=>{closed++;},
 fetch:async(url,options)=>{
   if(options.method==='PATCH'){
     patches++;
     if(mode==='reject')return {ok:false,json:async()=>({error:'권한 없음'})};
     const body=JSON.parse(options.body);
     stored={...stored,lyrics:body.lyrics,category:body.category};
     if(mode==='all')stored={...stored,...body};
     return {ok:true,json:async()=>({ok:true,share:{id:'10',lyrics:body.lyrics}})};
   }
   reads++;
   return {ok:true,json:async()=>({...stored})};
 }
});
vm.runInContext(lyric+'\n'+save,ctx);
(async()=>{
 ctx.renderPlainLyrics(share);
 assert.equal(elements.lyricsBox.textContent,'이전 가사');
 await ctx.saveTrackInfo();
 assert.equal(patches,1);assert.equal(reads,1);
 assert.equal(elements.lyricsBox.textContent,original,'successful PATCH must refresh lyrics');
 assert.equal(ctx._share.lyrics,original);
 assert.equal(ctx._share.artist,'새 가수');
 assert.equal(closed,1,'fully confirmed metadata may close the editor');
 assert.equal(elements.saveTrackInfoBtn.disabled,false);

 mode='lyrics-only';elements.editTrackArtist.value='저장되지 않을 이름';elements.editTrackLyrics.value='변경된 가사';
 await ctx.saveTrackInfo();
 assert.equal(patches,2);assert.equal(reads,2);
 assert.equal(ctx._share.artist,'새 가수','unconfirmed artist must not be promoted');
 assert.equal(ctx._share.lyrics,'변경된 가사','confirmed lyrics should remain');
 assert.match(elements.trackInfoEditError.textContent,/가수/);
 assert.equal(elements.trackInfoEditError.style.display,'block');
 assert.equal(closed,1,'partial save must not claim complete success');
 assert.equal(elements.lyricsBox.textContent,'변경된 가사');

 mode='reject';elements.editTrackLyrics.value='실패한 변경';
 await ctx.saveTrackInfo();
 assert.equal(reads,2,'failed PATCH must not issue verification GET');
 assert.equal(ctx._share.lyrics,'변경된 가사');
 assert.equal(elements.lyricsBox.textContent,'변경된 가사');
 console.log('PASS TRACK licensed V5 no public URL, post-save canonical metadata readback, partial-save warning, lyric rendering and fail-closed');
})().catch(e=>{console.error(e);process.exitCode=1;});
