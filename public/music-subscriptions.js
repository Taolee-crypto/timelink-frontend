(function(){
'use strict';
const $=id=>document.getElementById('ms-'+id),base='https://api.timelink.digital/api/payment/v5/music';
let config=null,userId=null,selected=4,products=[],pending=null,busy=false,seq=0;
const node=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
const token=()=>localStorage.getItem('tl_token')||'';
function status(message,error=false){$('status').textContent=message;$('status').classList.toggle('ms-error',error);}
async function api(path,body){
 const response=await fetch(base+path,{method:body?'POST':'GET',cache:'no-store',headers:{...(token()?{Authorization:'Bearer '+token()}:{}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
 const d=await response.json();if(!response.ok||!d.ok){const messages={AUTH_REQUIRED:'로그인이 필요합니다.',MUSIC_SUBSCRIPTION_CHECKOUT_DISABLED:'아직 구독 결제를 시작하지 않았습니다.',MUSIC_SUBSCRIPTION_ALREADY_ACTIVE:'이미 이용 중인 구독이 있습니다.',MUSIC_ORDER_ALREADY_PENDING_RECONCILE_FIRST:'이전 결제 준비 기록을 먼저 확인해야 합니다.',MUSIC_ORDER_REQUEST_CONFLICT:'기존 주문과 선택한 상품이 다릅니다.',TERMS_REQUIRED:'이용조건을 확인해 주세요.'};const e=Error(messages[d.error]||'요청을 처리하지 못했습니다. 다시 시도해 주세요.');e.status=response.status;e.code=d.error;throw e;}return d;
}
function pendingKey(){return 'tl_music_pending_'+userId;}
function readPending(){
 if(!userId)return null;try{const p=JSON.parse(sessionStorage.getItem(pendingKey())||'null');return p&&Number.isInteger(p.level)&&p.level>=1&&p.level<=24&&typeof p.requestKey==='string'&&/^[a-zA-Z0-9_-]{16,80}$/.test(p.requestKey)?p:null;}catch{return null;}
}
function ready(){return !!(config&&((config.testCheckoutEnabled===true&&config.checkoutMode==='test'&&typeof config.clientKey==='string'&&config.clientKey.startsWith('test_ck_'))||(config.checkoutEnabled===true&&config.checkoutMode==='live'&&typeof config.clientKey==='string'&&config.clientKey.startsWith('live_ck_'))));}
function selection(){
 const product=products.find(p=>p.level===selected);if(!product)return;
 $('selection').hidden=false;$('selected-title').textContent=product.code+' · 매일 '+product.level+'시간';$('selected-price').textContent='월 '+product.monthlyPriceKrw.toLocaleString('ko-KR')+'원 · 요금 초안';$('selected-price').className='ms-selected-price';
 $('selected-details').textContent='TILO 보상은 기존 V5 보상 기준을 따릅니다.';
 for(const button of $('products').children)button.setAttribute('aria-pressed',String(Number(button.dataset.level)===selected));
 $('login').hidden=!!userId;
 $('pending').textContent=pending?'TL-'+pending.level+'의 결제 준비 기록이 있습니다. 같은 상품은 다시 시도할 수 있으며 다른 상품으로 바꾸려면 기존 주문을 먼저 확인해야 합니다.':'';
 const allowed=ready()&&userId&&(!pending||pending.level===selected)&&$('terms').checked&&!busy;
 $('buy').disabled=!allowed;$('buy').textContent=busy?'결제창을 준비하고 있습니다.':!ready()?'구독 판매 준비 중':!userId?'로그인 후 선택하세요.':pending&&pending.level!==selected?'기존 주문 확인이 필요합니다.':config.checkoutMode==='test'?'시험 구독 결제하기':'음악 구독 결제하기';
 for(const button of $('products').children)button.disabled=busy;
 $('terms').disabled=busy;$('reload').disabled=busy;
}
async function load(){
 if(busy)return;const id=++seq;config=null;userId=null;products=[];pending=null;$('products').replaceChildren();$('selection').hidden=true;$('current').hidden=true;$('buy').disabled=true;status('상품과 이용권을 확인하고 있습니다.');
 try{
  const results=await Promise.allSettled([api('/products'),token()?api('/status'):Promise.resolve(null)]);if(id!==seq)return;
  if(results[0].status==='rejected')throw results[0].reason;
  const data=results[0].value;
  if(!Array.isArray(data.products)||data.products.length!==24||new Set(data.products.map(p=>p.level)).size!==24||data.products.some(p=>!Number.isInteger(p.level)||p.level<1||p.level>24||p.code!=='TL-'+p.level||p.dailyIncludedMs!==p.level*3600000||!Number.isSafeInteger(p.monthlyPriceKrw)||p.monthlyPriceKrw<1||!Number.isFinite(p.miningIndexTlcPerHour)))throw Error('상품 정보를 확인하지 못했습니다. 다시 불러오세요.');
  config=data;products=[...data.products].sort((a,b)=>a.level-b.level);
  let memberIssue=results[1].status==='rejected'?'이용권 조회를 잠시 후 다시 시도해 주세요.':'';
  if(results[1].status==='fulfilled'&&results[1].value){const d=results[1].value;if(!Number.isSafeInteger(d.userId)||d.userId<1)memberIssue='이용권 조회를 잠시 후 다시 시도해 주세요.';else userId=d.userId;
   if(userId&&d.active){$('current').hidden=false;$('current-text').textContent=d.product+' · 오늘 남은 포함시간 '+(d.remainingIncludedMs/3600000).toLocaleString('ko-KR',{maximumFractionDigits:2})+'시간 · 기준 '+d.timezone+' · 만료 '+new Date(d.expiresAtMs).toLocaleString('ko-KR');}
  }
  pending=readPending();$('products').replaceChildren();
  for(const p of products){const b=node('button');b.type='button';b.className='ms-product';b.dataset.level=p.level;b.append(node('strong',p.code),node('span','매일 '+p.level+'시간'),node('small','월 '+p.monthlyPriceKrw.toLocaleString('ko-KR')+'원'));b.addEventListener('click',()=>{if(busy)return;selected=p.level;$('terms').checked=false;selection();});$('products').append(b);}
  if(pending)selected=pending.level;
  $('availability').textContent=ready()&&config.checkoutMode==='test'?'시험결제 연결 상태입니다. 시험 승인은 실제 청취 자격·구매 기여·현금 지급에 적용되지 않습니다.':ready()?'선택한 상품의 이용조건을 확인하고 결제를 진행하세요.':'정식 판매 준비 중입니다. 현재 가격은 설계안이며 결제는 진행되지 않습니다.';
  selection();status(memberIssue?memberIssue+' 상품은 확인할 수 있으나 결제는 진행할 수 없습니다.':userId?'상품을 선택하고 이용조건을 확인하세요.':'상품을 확인한 뒤 로그인해 주세요.',!!memberIssue);
 }catch(error){if(id===seq){config=null;products=[];userId=null;$('products').replaceChildren();$('selection').hidden=true;$('current').hidden=true;$('availability').textContent='상품 연결 상태를 확인하지 못했습니다. 결제는 진행되지 않습니다.';status(error.message,true);}}
}
let sdkPromise=null;
function sdk(){
 if(window.TossPayments)return Promise.resolve();if(sdkPromise)return sdkPromise;
 sdkPromise=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://js.tosspayments.com/v1/payment';script.onload=()=>window.TossPayments?resolve():reject(Error('결제창을 불러오지 못했습니다.'));script.onerror=()=>reject(Error('결제창을 불러오지 못했습니다.'));document.head.append(script);}).catch(error=>{sdkPromise=null;throw error;});return sdkPromise;
}
$('buy').addEventListener('click',async()=>{
 if(!ready()||!userId||!$('terms').checked||busy||pending&&pending.level!==selected)return;
 const product=products.find(p=>p.level===selected);if(!product)return;
 busy=true;selection();status('구독 주문을 확인하고 있습니다.');
 try{
  if(!pending){pending={level:selected,requestKey:crypto.randomUUID()};sessionStorage.setItem(pendingKey(),JSON.stringify(pending));}
  const order=await api('/prepare',{level:selected,requestKey:pending.requestKey,termsAccepted:true});
  if(order.purchasePurpose!=='music_subscription'||order.mode!==config.checkoutMode||!/^v5music_[a-f0-9]{32}$/.test(order.orderId)||order.amount!==product.monthlyPriceKrw||order.tlCredited!==0)throw Error('구독 주문과 선택한 상품이 일치하지 않습니다. 결제를 진행하지 않았습니다.');
  pending={...pending,orderId:order.orderId};sessionStorage.setItem(pendingKey(),JSON.stringify(pending));
  if(order.status==='confirmed'){sessionStorage.removeItem(pendingKey());pending=null;status('이미 확인된 주문입니다. 이용권 상태를 다시 불러오세요.');return;}
  if(order.expiresAtMs<=Date.now())throw Error('준비한 주문의 유효기간이 지났습니다. 기존 결제 승인 여부를 확인한 뒤 다시 진행해야 합니다.');
  await sdk();const toss=window.TossPayments(config.clientKey);
  await toss.requestPayment('카드',{amount:order.amount,orderId:order.orderId,orderName:'TILO DAILY FREE '+product.code+' · 매일 '+product.level+'시간',successUrl:location.origin+'/payment-success.html',failUrl:location.origin+'/payment-fail.html?purpose=music'});
 }catch(error){if(pending&&!pending.orderId&&([400,401,403].includes(error.status)||error.code==='MUSIC_SUBSCRIPTION_CHECKOUT_DISABLED')){sessionStorage.removeItem(pendingKey());pending=null;}status(error.code==='USER_CANCEL'?'결제창을 닫았습니다. 같은 상품으로 다시 시도할 수 있습니다.':error.message,true);}
 finally{busy=false;selection();}
});
$('terms').addEventListener('change',selection);$('reload').addEventListener('click',load);load();
})();
