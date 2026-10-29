'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('public/admin-tlp-maturity.html','utf8');
const admin=fs.readFileSync('public/admin.html','utf8');
assert.match(admin,/href="\/admin-tlp-maturity\.html"/,'admin economy navigation must include maturity review');
assert.match(html,/창작자 정산 TL_P는 전환 대상이 아닙니다/);
assert.match(html,/TL_A는 현재 광고 기능 미운영 상태로 유지/);
assert.match(html,/id="reviewBtn" type="button" disabled/);
assert.match(html,/id="convertBtn" type="button" class="danger" disabled/);
const js=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(js,'admin maturation script missing');
new vm.Script(js,{filename:'admin-tlp-maturity.html'});
assert.match(js,/expected_remaining_atoms:preview\.remainingPurchasedAtoms/);
assert.match(js,/confirmation:'I_VERIFIED_ALL_REFUND_RIGHTS'/);
assert.match(js,/confirmation:'CONVERT_REVIEWED_TL_P_TO_TL_B'/);
assert.match(js,/getItem\('tl_token'\)/);
assert.doesNotMatch(js,/localStorage\.setItem\(/,'never persist monetary review inputs');
const nodes=new Map();
function el(id){if(!nodes.has(id)){
 const callbacks={};
 nodes.set(id,{value:'',textContent:'',className:'',style:{display:'none'},checked:false,disabled:false,
  addEventListener(name,fn){callbacks[name]=fn},callbacks});
 }return nodes.get(id);}
let auth='',calls=[],responses=[];
const fakeFetch=async(url,options)=>{
 calls.push({url:String(url),options});
 const response=responses.shift()||{status:503,data:{ok:false,error:'fixture endpoint unavailable'}};
 return {ok:response.status>=200&&response.status<300,status:response.status,
  async json(){return response.data}};
};
const ctx=vm.createContext({document:{getElementById:el},fetch:fakeFetch,localStorage:{getItem:()=>auth}});
vm.runInContext(js,ctx);
assert.equal(el('convertBtn').disabled,true,'conversion must never start enabled');
assert.equal(el('reviewBtn').disabled,true,'review must never start enabled');
async function run(id,event='click'){const fn=el(id).callbacks[event];assert.equal(typeof fn,'function',id+' '+event);await fn();}
(async()=>{
 el('userId').value='11';el('paymentKey').value='v5-payment:toss:fixture';
 await run('previewBtn');
 assert.equal(calls.length,0,'no admin token -> no request');
 assert.match(el('previewStatus').textContent,/관리자 로그인/);
 auth='fixture-admin-token';
 responses.push({status:200,data:{ok:true,userId:'11',paymentKey:'v5-payment:toss:fixture',
  decision:'LEGAL_RIGHTS_REVIEW_REQUIRED',eligible:false,
  remainingPurchasedAtoms:250000,walletPurchasedAtoms:250000,
  ledgerRowsChecked:125,sourcePolicy:'PURCHASED_FIRST_FIFO'}});
 await run('previewBtn');
 assert.equal(calls.length,1);
 assert.equal(calls[0].options.method,'GET');
 assert.match(calls[0].url,/\/preview\/11\/v5-payment%3Atoss%3Afixture/);
 assert.equal(el('remainingDisplay').textContent,'25 TL');
 assert.equal(el('convertBtn').disabled,true,'unapproved conversion must remain disabled');
 assert.equal(el('reviewBtn').disabled,false,'admin legal review may be initiated');
 await run('reviewBtn');
 assert.equal(calls.length,1,'legal review requires explicit checkbox');
 assert.match(el('actionStatus').textContent,/법적 환급권 확인/);
 el('userId').value='12';await run('userId','input');
 assert.equal(el('convertBtn').disabled,true,'account switching invalidates the old quote');
 assert.equal(el('reviewBtn').disabled,true);
 el('userId').value='11';el('paymentKey').value='v5-payment:toss:fixture';
 responses.push({status:200,data:{ok:true,userId:'11',paymentKey:'v5-payment:toss:fixture',
  decision:'ELIGIBLE_FOR_CONTROLLED_CONVERSION',eligible:true,
  remainingPurchasedAtoms:250000,walletPurchasedAtoms:250000,
  ledgerRowsChecked:126,sourcePolicy:'PURCHASED_FIRST_FIFO'}});
 await run('previewBtn');
 assert.equal(el('convertBtn').disabled,true);
 el('conversionKeyConfirm').value='v5-payment:toss:fixture';
 el('convertConfirm').checked=true;
 await run('conversionKeyConfirm','input');
 assert.equal(el('convertBtn').disabled,false,'explicit confirmation and matching key allow request');
 responses.push({status:403,data:{ok:false,error:'PURCHASE_MATURITY_DISABLED'}});
 await run('convertBtn');
 assert.equal(calls.at(-1).options.method,'POST');
 assert.equal(JSON.parse(calls.at(-1).options.body).expected_remaining_atoms,250000);
 assert.match(el('actionStatus').textContent,/PURCHASE_MATURITY_DISABLED/,'server default-off must be shown clearly');
 console.log('PASS admin TL_P maturity navigation, JWT preview, legal review hold, account switch invalidation, explicit confirmation and default-off response');
})().catch(e=>{console.error(e);process.exitCode=1});
