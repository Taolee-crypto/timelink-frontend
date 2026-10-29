'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('public/admin-tlp-maturity.html','utf8');
assert.match(html,/기존 구매 이력 검증·안전 이관/);
assert.match(html,/id="legacyImportBtn" type="button" disabled/);
assert.match(html,/원장과 영수증이 일치한 거래만 선택/);
const js=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];assert.ok(js);
new vm.Script(js,{filename:'admin-tlp-maturity.html'});
assert.doesNotMatch(js,/innerHTML\s*=/,'receipt text must never render as raw HTML');
const nodes=new Map(),calls=[],responses=[];
function createNode(){
 let contents='';
 const node={value:'',className:'',style:{display:'none'},disabled:false,
  checked:false,children:[],callbacks:{},
  appendChild(child){this.children.push(child);return child;},
  addEventListener(event,callback){this.callbacks[event]=callback}};
 // Setting element.textContent clears existing child nodes in real browsers.
 Object.defineProperty(node,'textContent',{
  get(){return contents;},
  set(value){contents=String(value);this.children=[];}
 });
 return node;
}
function el(id){if(!nodes.has(id))nodes.set(id,createNode());return nodes.get(id);}
const ctx=vm.createContext({
 document:{getElementById:el,createElement:createNode},
 localStorage:{getItem(){return 'fixture-admin-token'}},
 fetch:async(url,options)=>{calls.push({url,options});const next=responses.shift();
  assert.ok(next,'unexpected network request: '+url);
  return {ok:next.code>=200&&next.code<300,status:next.code,async json(){return next.data}}}
});
vm.runInContext(js,ctx);
async function click(id){const fn=el(id).callbacks.click;assert.ok(fn,id+' missing');await fn();}
(async()=>{
 const key='v5-payment:toss:receipt-a';
 responses.push({code:200,data:{ok:true,candidates:[
  {paymentKey:key,eligible:true,paymentMode:'unknown',paidAtoms:1000000,bonusAtoms:150000,
   evidenceSha256:'a'.repeat(64)},
  {paymentKey:'<script>danger</script>',eligible:false,reason:'LEGACY_PURCHASE_RECEIPT_MISMATCH'}
 ]}});
 assert.equal(el('legacyImportBtn').disabled,true,'import is disabled until verified proof selection');
 await click('loadLegacyBtn');
 assert.match(calls[0].url,/legacy-candidates\?limit=20/);
 assert.equal(el('legacyRows').children.length,2);
 assert.match(el('legacyRows').children[1].children[0].textContent,/script/);
 assert.equal(el('legacyRows').children[1].children.length,1,'unverified record has no import button');
 const picker=el('legacyRows').children[0].children[1];
 picker.callbacks.click();
 assert.equal(el('legacyKey').value,key);
 assert.equal(el('legacyEvidence').value,'a'.repeat(64));
 assert.equal(el('legacyImportBtn').disabled,true,'must require explicit confirmation and note');
 el('legacyNote').value='실제 영수증과 TL_P/TL_B 지급 원장의 금액을 대조하였으며 실거래 유형은 미확인';
 el('legacyConfirm').checked=true;
 el('legacyConfirm').callbacks.change();
 assert.equal(el('legacyImportBtn').disabled,false);
 responses.push({code:200,data:{ok:true,imported:true,paymentKey:key,paymentMode:'unknown',
  conversionEligible:false,ledgerBalancesChanged:false}});
 await click('legacyImportBtn');
 assert.equal(calls[1].options.method,'POST');
 assert.match(calls[1].url,/legacy-import\/v5-payment%3Atoss%3Areceipt-a/);
 const sent=JSON.parse(calls[1].options.body);
 assert.equal(sent.confirmation,'IMPORT_UNVERIFIED_PURCHASE_LOT');
 assert.equal(sent.evidence_sha256,'a'.repeat(64));
 assert.ok(sent.review_note.length>=20);
 assert.match(el('legacyStatus').textContent,/고객 TL 잔액 변경 없음/);
 assert.match(el('legacyStatus').textContent,/법정 만기 자동 전환 금지/);
 assert.equal(el('legacyImportBtn').disabled,true,'never leave a completed import button active');
 assert.equal(el('legacyKey').value,'');
 responses.push({code:200,data:{ok:true,candidates:[{paymentKey:'v5-payment:toss:test-mode',
   eligible:true,paymentMode:'test',paidAtoms:10000,bonusAtoms:0,evidenceSha256:'b'.repeat(64)}]}});
 await click('loadLegacyBtn');
 assert.match(el('legacyRows').children[0].children[0].textContent,/test/);
 console.log('PASS historical receipt admin screen: no raw HTML, candidate verification, explicit note+consent, unknown/test quarantined, no monetary changes');
})().catch(e=>{console.error(e);process.exitCode=1});
