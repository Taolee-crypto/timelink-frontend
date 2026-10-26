const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../public/tl-time-luck.js'),'utf8');
function setup(quote){
 const nodes=new Map(),calls=[],alerts=[];let release;
 class Element{
  constructor(){this.classList={contains:()=>false,add(){},remove(){}};this.value='';this.disabled=false;this.textContent='';}
  appendChild(){} prepend(){} insertAdjacentElement(){} addEventListener(){}
  set innerHTML(html){this.html=html;for(const m of html.matchAll(/id="([^"]+)"/g))nodes.set(m[1],new Element());
   if(html.includes('tlHours'))nodes.get('tlHours').value='1';
   if(html.includes('name="tlPayType"')){nodes.set('tl',Object.assign(new Element(),{value:'tl'}));nodes.set('cash',Object.assign(new Element(),{value:'cash'}));}
  }
  querySelector(sel){if(sel==='video')return {addEventListener(){},play:()=>Promise.resolve()};if(sel==='.close')return close;
   if(sel==='input[value="cash"]')return nodes.get('cash');if(sel.includes(':checked'))return nodes.get(selected);return nodes.get(sel.replace('#',''));}
  querySelectorAll(){return [nodes.get('tl'),nodes.get('cash')];}
 }
 const close=new Element();let selected='tl';const root=new Element();
 const document={head:root,body:root,createElement:()=>new Element(),querySelector:()=>root,addEventListener(){}};
 const context={document,localStorage:{getItem:()=> 'token'},sessionStorage:{setItem(){}},alert:x=>alerts.push(x),window:{},location:{origin:'https://example.test'},fetch:async(url,options)=>{
  if(url.endsWith('/status'))return {ok:true,json:async()=>({ok:true,time_free_remaining_ms:3600000})};
  calls.push({url,body:JSON.parse(options.body)});
  if(url.endsWith('/quote')){await new Promise(resolve=>release=resolve);return {ok:true,json:async()=>quote};}
  return {ok:true,json:async()=>({ok:true,seconds:quote.seconds,discountedTl:quote.discountedTl,method:JSON.parse(options.body).method})};
 }};
 let buy;document.createElement=()=>{const el=new Element();Object.defineProperty(el,'id',{set(v){nodes.set(v,el);if(v==='tlTimeBuy')buy=el;}});return el;};
 vm.runInNewContext(source,context);buy.onclick();
 return {nodes,calls,alerts,close,buy,select:v=>selected=v,release:()=>release()};
}
async function draw(quote){const env=setup(quote);const pending=env.nodes.get('tlFirst').onclick();assert.equal(env.nodes.get('tlHours').disabled,true);await env.nodes.get('tlFirst').onclick();assert.equal(env.calls.length,1);env.buy.onclick();env.release();await pending;return env;}
const quote={ok:true,quoteId:'server-quote',seconds:3600,firstDiscountPercent:5,doubleDiscountPercent:15,discountedTl:2908};
(async()=>{
 let env=await draw(quote);env.nodes.get('tlNext').onclick();env.nodes.get('tlNext').onclick();
 // A server amount which differs from client arithmetic must be displayed unchanged.
 assert.match(env.nodes.get('tlTimeBody').html,/2,908 TL 상당/);
 const pay=env.nodes.get('tlTestCheckout');await Promise.all([pay.onclick(),pay.onclick()]);assert.equal(env.calls.length,2);assert.equal(env.calls[1].body.quoteId,'server-quote');assert.match(env.nodes.get('tlTimeBody').html,/TIME FREE 3,600초 적용/);assert.doesNotMatch(env.nodes.get('tlTimeBody').html,/TL_B/);
 env=await draw({...quote,discountedTl:0,firstDiscountPercent:100});env.nodes.get('tlNext').onclick();env.nodes.get('tlNext').onclick();env.select('cash');await env.nodes.get('tlTestCheckout').onclick();assert.match(env.calls[1].url,/test-checkout$/);assert.equal(env.calls[1].body.method,'cash');
 env=await draw({...quote,discountedTl:999});env.nodes.get('tlNext').onclick();env.nodes.get('tlNext').onclick();assert.equal(env.nodes.get('cash').disabled,true);
 env=await draw({...quote,discountedTl:-1});assert.equal(env.alerts.length,1);assert.equal(env.nodes.get('tlHours').disabled,false);
 console.log('Time purchase: server amount, quote lock, duplicate checkout, free cash, minimum amount, invalid quote checks passed');
})().catch(error=>{console.error(error);process.exitCode=1;});

