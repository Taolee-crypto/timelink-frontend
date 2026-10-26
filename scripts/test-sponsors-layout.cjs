const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const code=fs.readFileSync('public/renewal/sponsors.js','utf8');
function fixture({wide=true,embedded=false,path='/index.html',view='/dashboard.html',ads}={}){
 const calls=[],events={},nodes=[];
 const el=tag=>({tag,children:[],hidden:false,className:'',textContent:'',setAttribute(k,v){this[k]=v},append(...values){for(const n of values)n.owner=this;this.children.push(...values)},after(n){nodes.push(n)},querySelector(sel){return this.children.find(n=>'.'+n.className===sel)||null},remove(){this.removed=true;if(this.owner)this.owner.children=this.owner.children.filter(n=>n!==this)}});
 const main=el('main'),body=el('body');body.hasAttribute=()=>!embedded;body.classList={toggle:(key,value)=>body[key]=value};
 const media={matches:wide,addEventListener(){}};const window={matchMedia:()=>media,addEventListener:(key,fn)=>events[key]=fn};
 const parent=embedded?{matchMedia:()=>media}:window;
 const ctx={document:{body,createElement:el,querySelector:()=>main},window,parent,location:{pathname:path,origin:'https://site.test',search:view?'?view='+encodeURIComponent(view):''},URL,URLSearchParams,localStorage:{getItem:()=>''},fetch:async(url,options)=>{calls.push({url,options});return {ok:true,json:async()=>ads||{ad:null}}}};
 vm.runInNewContext(code,ctx);return {calls,body,main,nodes,events,ctx};
}
(async()=>{
 const desktop=fixture({ads:{ad:{id:3,title:'실제 광고',business_name:'광고주',target_url:'https://brand.test',thumbnail_url:'https://brand.test/ad.jpg'}}});await new Promise(setImmediate);assert.equal(desktop.body['tl-ad-layout'],true);assert.equal(desktop.calls.length,1);const rail=desktop.body.children[0];assert.equal(rail.children[1].children[1].children[1].textContent,'실제 광고');rail.children[1].onclick();assert.match(desktop.calls[1].url,/sidebar\/3\/click$/);
 desktop.events['tl:route']({detail:{href:'/shareplace.html'}});assert.equal(desktop.calls.length,2);
 const child=fixture({embedded:true,path:'/shareplace.html',view:'',wide:true});await new Promise(setImmediate);assert.equal(child.calls.length,0);assert.equal(child.main.children.length,0);
 const mobile=fixture({embedded:true,path:'/shareplace.html',view:'',wide:false});await new Promise(setImmediate);assert.equal(mobile.calls.length,1);assert.equal(mobile.main.children[0]['data-inline'],'');
 const mobileHost=fixture({wide:false});await new Promise(setImmediate);assert.equal(mobileHost.calls.length,0);
 const privatePage=fixture({view:'/wallet.html'});await new Promise(setImmediate);assert.equal(privatePage.calls.length,0);assert.equal(privatePage.body['tl-ad-layout'],false);
 const unsafe=fixture({ads:{ad:{id:8,title:'unsafe',target_url:'javascript:alert(1)'}}});await new Promise(setImmediate);assert.ok(unsafe.body.children[0].children.at(-1).className.includes('tl-sponsor-house'));
 console.log('PASS sponsor layout: real banner and click API, one host request, no desktop iframe duplicate, mobile in-content placement, private-screen exclusion, safe URLs and labeled house fallback');
})().catch(e=>{console.error(e);process.exitCode=1});
