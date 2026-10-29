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
const share={id:10,user_id:7,lyrics:'이전 가사',title:'테스트 음악'};
const elements={lyricsWrap:{style:{display:'none'}},lyricsBox:{textContent:'',classList:{toggle(k,v){this.empty=!!v;}}},
 trackInfoModal:{classList:{remove(){}}},saveTrackInfoBtn:{disabled:false,textContent:'저장'},
 trackInfoEditError:{style:{display:'none'},textContent:''}};
for(const name of ['Artist','Album','Composer','Lyricist','Producer','Arranger','Category','Lyrics'])
 elements['editTrack'+name]={value:name==='Lyrics'?original:name==='Artist'?'가수':''};
let calls=0,saved=null;
const ctx=vm.createContext({
 _share:share,_currentUserId:7,SHARE_ID:'10',API:'https://api.example.test',
 getTok:()=> 'fixture',document:{getElementById:id=>elements[id]},
 alert:()=>{},console:{warn(){}},
 renderCopyright:()=>{},closeTrackInfoEditor:()=>{},
 fetch:async(url,options)=>{calls++;saved=JSON.parse(options.body);return {ok:true,json:async()=>({ok:true})};}
});
vm.runInContext(lyric+'\n'+save,ctx);
(async()=>{
 ctx.renderPlainLyrics(share);
 assert.equal(elements.lyricsBox.textContent,'이전 가사');
 await ctx.saveTrackInfo();
 assert.equal(calls,1);
 assert.equal(saved.lyrics,original);
 assert.equal(elements.lyricsBox.textContent,original,'lyrics must refresh immediately after successful save');
 assert.equal(elements.lyricsWrap.style.display,'block');
 assert.equal(elements.saveTrackInfoBtn.disabled,false);
 assert.equal(ctx._share.lyrics,original);
 ctx.fetch=async()=>({ok:false,json:async()=>({error:'권한 없음'})});
 elements.editTrackLyrics.value='실패한 변경';
 await ctx.saveTrackInfo();
 assert.equal(elements.lyricsBox.textContent,original,'failed save must not modify displayed lyrics');
 assert.equal(ctx._share.lyrics,original);
 console.log('PASS TRACK encrypted V5 no public URL + post-PATCH lyric rendering/failure preservation');
})().catch(e=>{console.error(e);process.exitCode=1;});
