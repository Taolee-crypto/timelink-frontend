const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('public/dj-center.html','utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
for(const code of scripts)if(code.trim())new Function(code);
for(const panel of ['cafes','applications','contracts','onair'])assert.ok(!html.includes('id="tab-'+panel+'"'));
assert.ok(!html.includes('studioEditor'));assert.ok(!html.includes('TL3.resolveUrl'));
const code=scripts.find(s=>s.includes("var API = 'https://api.timelink.digital'"));
const nodes=new Map();
function node(id){if(!nodes.has(id)){const n={id,value:'',checked:false,disabled:false,hidden:false,textContent:'',style:{},classList:{add(){},remove(){}},scrollIntoView(){},appendChild(){},remove(){}};let inner='';Object.defineProperty(n,'innerHTML',{get(){return inner},set(v){inner=String(v);for(const m of inner.matchAll(/<(input|select)[^>]*id="([^"]+)"[^>]*>/g)){const e=node(m[2]),val=/value="([^"]*)"/.exec(m[0]);e.value=val?val[1]:m[1]==='select'?'all':'';}}});nodes.set(id,n);}return nodes.get(id);}
for(const m of html.matchAll(/id="([^"]+)"/g))node(m[1]);
let saved=null,isLive=false,plays=0,stops=0,reads=[],failLibrary=false;
const files=[{id:'song-a',file_id:1,user_id:2,title:'Alpha',artist:'A',category:'jazz',duration:180,is_promoted:false},
{id:'song-b',file_id:2,user_id:1,title:'Beta',artist:'B',category:'pop',duration:210,is_promoted:true}];
class Audio{constructor(){this.paused=true;this.src='';}async play(){this.paused=false}pause(){this.paused=true}}
const ctx={console,window:{TL3V5Player:{async playStream(id,audio,opts){assert.equal(opts.djStationId,7);assert.equal(id,'tl3_1');plays++;audio.src='blob:fixture';audio._tl3Stop=async()=>{audio.pause();stops++};await audio.play();}}},Audio,AbortSignal,Number,String,Array,Set,Math,Date,JSON,
 document:{getElementById:node,querySelectorAll:()=>[],createElement:()=>node('toast'),addEventListener(){}},
 localStorage:{getItem:k=>k==='tl_user'?JSON.stringify({id:1,email:'fixture@fixture'}):k==='tl_token'?'fixture':null,setItem(){}},
 location:{},setTimeout:()=>1,clearTimeout(){},setInterval:()=>1,clearInterval(){},confirm:()=>true,
 async fetch(url,init={}){
  reads.push(url);let d={ok:true};
  if(url.endsWith('/opening-agreement'))d={ok:true,agreed:true};
  else if(url.endsWith('/profile'))d={ok:true,profile:{id:7,user_id:1,dj_name:'DJ fixture',bio:'A station',genres:'[]',mood:'[]'}};
  else if(url.endsWith('/library'))return Response.json(failLibrary?{ok:false,error:'fixture library unavailable'}:{ok:true,files},{status:failLibrary?503:200});
  else if(url.endsWith('/broadcast-set')){if(init.method==='POST'){const body=JSON.parse(init.body);saved={...body,track_details:body.tracks.map(id=>files.find(f=>f.id===id))};}d={ok:true,set:saved};}
  else if(url.endsWith('/broadcast/status'))d={ok:true,live:{id:7,is_live:isLive?1:0,live_current_track_id:'song-a'}};
  else if(url.endsWith('/broadcast/start')){isLive=true;}
  else if(url.endsWith('/broadcast/stop')){isLive=false;}
  else if(url.endsWith('/live/7/now'))d={ok:true,current_track:{...files[0],started_at:1000,elapsed_ms:100}};
  else throw Error('Unexpected '+url);
  return Response.json(d);
 }};
vm.createContext(ctx);vm.runInContext(code,ctx);ctx.toast=()=>{};
async function main(){
 await ctx.loadProfile();await ctx.loadDjOpeningAgreement();await ctx.loadFiles();
 assert.ok(node('djTrackRows').innerHTML.includes('Alpha'));assert.ok(node('djTrackRows').innerHTML.includes('Beta'));
 ctx.toggleTrack('song-a');ctx.toggleTrack('song-b');assert.deepEqual(Array.from(ctx._selectedTrackIds),['song-a','song-b']);
 ctx.moveDjTrack(1,-1);assert.deepEqual(Array.from(ctx._selectedTrackIds),['song-b','song-a']);
 node('djSearch').value='alpha';ctx.renderDjRows();assert.ok(node('djTrackRows').innerHTML.includes('Alpha'));assert.ok(!node('djTrackRows').innerHTML.includes('Beta'));
 node('djSearch').value='';node('djLibrarySource').value='mine';ctx.renderDjRows();assert.ok(!node('djTrackRows').innerHTML.includes('Alpha'));
 ctx.clearAllFiles();node('djTargetCount').value='2';ctx.fillDjSet();assert.deepEqual(Array.from(ctx._selectedTrackIds),['song-b','song-a']);
 node('djSetName').value='Fixture set';await ctx.saveBroadcastSet();assert.deepEqual(saved.tracks,['song-b','song-a']);assert.equal(node('saveDjSet').disabled,false);
 await ctx.loadBroadcastSet();assert.ok(node('broadcastSetContent').innerHTML.includes('Alpha'));assert.ok(!node('broadcastSetContent').innerHTML.includes('(삭제된 곡)'));
 await ctx.startBroadcast();assert.equal(plays,1);assert.equal(ctx._isLive,true);assert.ok(!reads.some(u=>u.includes('/charge')));
 await ctx.toggleDjMonitor();assert.equal(ctx._djAudio.paused,true);await ctx.toggleDjMonitor();assert.equal(ctx._djAudio.paused,false);
 await ctx.stopBroadcast();assert.equal(ctx._isLive,false);assert.ok(stops>=1);
 failLibrary=true;await ctx.loadFiles();assert.ok(node('filesContent').innerHTML.includes('fixture library unavailable'));
 console.log('PASS actual DJ page functions: public library/search/source filter, ordered selection, promotion-first fill without quota, saved set display, V5 monitor start/pause/resume/stop, no legacy charge, visible API failure, removed sales/local-only screens');
}
main().catch(e=>{console.error(e);process.exitCode=1});
