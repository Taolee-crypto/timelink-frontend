#!/usr/bin/env node
// Dependency-free regression tests execute the shipped host and bridge code.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const origin='https://www.timelink.digital';
class Element{
 constructor(tag='div'){this.tagName=tag;this.children=[];this.hidden=false;this.dataset={};this.attrs={};this.src='';this.value='';this.messages=[];this.contentWindow={postMessage:(data,target)=>this.messages.push({data,target}),dispatchEvent(){},CustomEvent:class{}};this.classList={values:new Set(),add:(s)=>this.classList.values.add(s),remove:(s)=>this.classList.values.delete(s),toggle:(s,on)=>{if(on)this.classList.values.add(s);else this.classList.values.delete(s)}};}
 appendChild(e){this.children.push(e);return e}replaceChildren(...es){this.children=es}setAttribute(k,v){this.attrs[k]=v}hasAttribute(k){return k==='data-tl-app-host'}getAttribute(k){return this.attrs[k]||''}
}
function harness(){
 const nodes={},events={},docEvents={},timeouts=new Map();let clock=0;const body=new Element();
 const document={body,head:new Element(),getElementById(id){if(!nodes[id])nodes[id]=new Element();return nodes[id]},createElement(tag){return new Element(tag)},querySelectorAll(selector){return selector==='[data-tl-logout]'?[this.getElementById('tlLogoutButton'),this.getElementById('tlSidebarLogout')]:[]},addEventListener(n,f){docEvents[n]=f},documentElement:{}};
 const location={origin,href:origin+'/index.html',pathname:'/index.html',search:'',hash:''};
 const store=new Map(),localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)};
 const context={console,URL,URLSearchParams,document,location,localStorage,history:{replaceState(){},pushState(){}},CustomEvent:class{constructor(type,o){this.type=type;this.detail=o?.detail}},Event:class{constructor(type){this.type=type}},setTimeout(fn){timeouts.set(++clock,fn);return clock},clearTimeout(id){timeouts.delete(id)},setInterval(){return 1},clearInterval(){},navigator:{language:'ko-KR'}};
 context.window=context;context.parent=context;context.addEventListener=(n,f)=>events[n]=f;context.dispatchEvent=()=>{};
 document.readyState='loading';
 vm.createContext(context);vm.runInContext(fs.readFileSync('public/renewal/renewal.js','utf8'),context);
 vm.runInContext(fs.readFileSync('public/main.js','utf8'),context);
 const content=nodes['tl-content'];
 function message(source,data,from=origin){events.message({source,data,origin:from})}
 function navigate(href){message(content.contentWindow,{type:'tl:navigate',href})}
 return {context,nodes,document,content,body,events,message,navigate,timeouts};
}
async function main(){
 assert.ok(fs.readFileSync('public/sidebar.js','utf8').includes('data-tl-logout'),'Account navigation must render a logout control');assert.ok(fs.readFileSync('public/index.html','utf8').includes('id="tlLogoutButton"'),'Header must render a logout control');
 const h=harness(),{context:c,nodes,content}=h;
 assert.equal(nodes.tlLogoutButton.hidden,true);c.localStorage.setItem('tl_token','isolated-fixture-token');c.localStorage.setItem('tl_user','{}');h.events.focus();assert.equal(nodes.tlLogoutButton.hidden,false);assert.equal(nodes.tlSidebarLogout.hidden,false);assert.equal(nodes.tlLoginLink.hidden,true);
 assert.equal(content.src,'/dashboard.html');h.navigate('/creator');assert.equal(content.src,'/creator.html');h.navigate('/cafes');assert.equal(content.src,'/cafe-world.html');
 assert.equal(c.TLUI.canonicalPath('/creator'),'/creator.html');assert.equal(c.TLUI.canonicalPath('/radio'),'/radio.html');assert.equal(c.TLUI.canonicalPath('/renewal/files'),'/renewal/files.html');assert.equal(c.TLUI.canonicalPath('/index'),'/index.html');assert.equal(c.TLUI.canonicalPath('/track.html'),'/track.html');assert.equal(c.TLUI.route('https://evil.example/track.html'),null);
 assert.equal(c.TLUI.route('javascript:alert(1)'),null);
 assert.equal(c.TLUI.route('/docs/plan.html'),null);
 assert.equal(c.TLUI.route('/track.html?id=tl3_145'),'/track.html?id=tl3_145');
 h.message(content.contentWindow,{type:'tl:play-track',href:'/track.html?id=145'},'https://evil.example');
 assert.equal(nodes.tlPlayerContainer.children.length,0);
 h.message({}, {type:'tl:play-track',href:'/track.html?id=145'});
 assert.equal(nodes.tlPlayerContainer.children.length,0);
 h.message(content.contentWindow,{type:'tl:play-track',href:'/track.html?id=145'});
 const player=nodes.tlPlayerContainer.children[0];assert.ok(player.src.includes('id=145'));assert.ok(player.src.includes('tl_player=1'));
 h.navigate('/shareplace.html?q=Jazz');assert.equal(content.src,'/shareplace.html?q=Jazz');assert.equal(nodes.tlPlayerContainer.children[0],player,'Navigation must preserve the player document');
 const closing=nodes.tlClosePlayer.onclick.call(nodes.tlClosePlayer);
 assert.equal(player.messages.at(-1).data.type,'tl:stop-player');assert.equal(nodes.tlPlayerContainer.children[0],player,'Do not destroy a player before stop acknowledgement');
 h.message(player.contentWindow,{type:'tl:player-stopped'});await closing;
 assert.equal(nodes.tlPlayerContainer.children.length,0);assert.equal(nodes.tlPlayerDock.hidden,true);
 h.navigate('/radio.html');const radio=h.body.children.find(e=>e.id==='tl-radio-content');assert.ok(radio);assert.equal(content.hidden,true);
 h.message(radio.contentWindow,{type:'tl:radio-state',active:true,country:'KR'});
 h.navigate('/cafe-world.html');assert.equal(content.src,'/cafe-world.html');assert.equal(radio.src,'/radio.html');assert.ok(radio.classList.values.has('tl-radio-background'),'Radio stays mounted when exploring another screen');
 h.message(radio.contentWindow,{type:'tl:radio-start-request'});await Promise.resolve();assert.equal(radio.messages.at(-1).data.type,'tl:radio-start-approved');
 console.log('PASS host: same-origin/source validation, legacy filenames, player continuity, acknowledged stop, persistent radio');
 const a=harness();a.context.localStorage.setItem('tl_token','isolated-fixture-token');a.context.localStorage.setItem('tl_user','{}');a.events.focus();a.message(a.content.contentWindow,{type:'tl:play-track',href:'/track.html?id=145'});const active=a.nodes.tlPlayerContainer.children[0];const cancelled=a.nodes.tlLogoutButton.onclick();assert.equal(a.nodes.tlLogoutButton.disabled,true);assert.equal(a.context.localStorage.getItem('tl_token'),'isolated-fixture-token');a.message(active.contentWindow,{type:'tl:player-stop-error'});assert.equal(await cancelled,false);assert.equal(a.context.localStorage.getItem('tl_token'),'isolated-fixture-token');assert.equal(a.nodes.tlLogoutButton.disabled,false);const success=a.nodes.tlLogoutButton.onclick();a.message(active.contentWindow,{type:'tl:player-stopped'});assert.equal(await success,true);assert.equal(a.context.localStorage.getItem('tl_token'),null);assert.equal(a.context.localStorage.getItem('tl_user'),null);assert.equal(a.context.location.href,'/login.html');assert.equal(a.nodes.tlLogoutButton.hidden,true);console.log('PASS logout: header and account controls, login-state updates, settlement acknowledgement, credentials retained on failure and cleared on success');
 // Execute the actual stop implementation with a deferred meter and simulated API.
 const source=fs.readFileSync('public/tl3-v5-player.js','utf8');const start=source.indexOf('audio._tl3Stop=function(){'),end=source.indexOf('audio._tl3Confirm=audio._tl3Stop;',start);
 assert.ok(start>0&&end>start);let release,fetches=0,errors=0,revokes=0;
 const meter=new Promise(r=>release=r),audio={ended:false,pause(){},removeEventListener(){},removeAttribute(){},load(){}};
 const engine={audio,stopped:false,sample(){},broadcastCountry:null,meterFailed:false,billableMs:0,queueMeter(){},meterQueue:meter,API:origin,fileId:145,auth:()=>({}),sessionId:'fixture-session',opts:{onStopSettlement(data){assert.equal(data.ok,true)}},fetch:async()=>{fetches++;return {ok:true,json:async()=>({ok:true})}},onError(){errors++},meterTimer:null,clearInterval(){},lpController:null,URL:{revokeObjectURL(){revokes++}},blobUrl:'blob:fixture',onPlaying(){},onPause(){},onBuffering(){},onSeeking(){},onSeeked(){},onTimeUpdate(){},onEnded(){}};
 vm.createContext(engine);vm.runInContext(source.slice(start,end),engine);
 const stop=audio._tl3Stop();assert.equal(typeof stop.then,'function');assert.equal(audio._tl3Stop(),stop);assert.equal(fetches,0);release();await stop;assert.equal(fetches,1);assert.equal(revokes,1);assert.equal(errors,0);
 console.log('PASS V5 player: stop awaits final meter, settlement exactly once, repeat returns same promise');
 const failedAudio={ended:false,pause(){},removeEventListener(){},removeAttribute(){},load(){}};engine.audio=failedAudio;engine.stopped=false;engine.meterQueue=Promise.resolve();engine.fetch=async()=>({ok:false,json:async()=>({error:'SETTLEMENT_UNAVAILABLE'})});let successCallbacks=0;engine.opts={onStopSettlement(){successCallbacks++}};vm.runInContext(source.slice(start,end),engine);await failedAudio._tl3Stop();assert.ok(failedAudio._tl3StopError);assert.equal(errors,1);assert.equal(successCallbacks,0);console.log('PASS V5 player: failed settlement remains observable and never fires a success callback');
}
main().catch(e=>{console.error(e);process.exitCode=1});
