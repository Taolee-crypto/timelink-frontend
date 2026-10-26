const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.TL_PLAYWRIGHT_MODULE||'playwright');
const backend=path.resolve(process.env.TL_MUSIC_BACKEND_ROOT||'../timelink-backend'),temp=fs.mkdtempSync('/tmp/music-subscription-ui-');
require(path.join(backend,'node_modules/esbuild')).buildSync({entryPoints:[path.join(backend,'src/v5-daily-free-policy.ts')],bundle:true,platform:'node',format:'cjs',outfile:path.join(temp,'products.cjs'),logLevel:'silent'});
const products=require(path.join(temp,'products.cjs')).dailyFreeCatalogue();
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.TL_CHROMIUM_EXECUTABLE?{executablePath:process.env.TL_CHROMIUM_EXECUTABLE}:{})});
 try{
  const page=await browser.newPage({viewport:{width:1360,height:900}}),errors=[],requests=[],prepared=[];page.on('pageerror',e=>errors.push(e.message));
  let enabled=false,offline=false,wrongPrice=false,missingUid=false,uid=1;
  const orderId='v5music_'+'a'.repeat(32);
  await page.route('https://api.timelink.digital/**',async route=>{
   const req=route.request(),u=new URL(req.url()),headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Authorization,Content-Type','Access-Control-Allow-Methods':'GET,POST,OPTIONS'};
   if(req.method()==='OPTIONS')return route.fulfill({status:204,headers});requests.push(u.pathname);
   let out,status=200;
   if(offline){status=503;out={ok:false,error:'fixture-offline'};}
   else if(u.pathname.endsWith('/v5/music/products'))out={ok:true,products,checkoutMode:enabled?'test':'disabled',checkoutEnabled:false,testCheckoutEnabled:enabled,clientKey:enabled?'test_ck_fixture':null};
   else if(u.pathname.endsWith('/v5/music/status'))out={ok:true,...(missingUid?{}:{userId:uid}),active:false};
   else if(u.pathname.endsWith('/v5/music/prepare')){const b=req.postDataJSON();prepared.push(b);const p=products.find(p=>p.level===b.level);out={ok:true,purchasePurpose:'music_subscription',orderId,amount:p.monthlyPriceKrw+(wrongPrice?1:0),currency:'KRW',mode:'test',status:'prepared',expiresAtMs:Date.now()+900000,tlCredited:0,autoRenew:false};}
   else if(u.pathname.endsWith('/v5/music/confirm'))out={ok:true,product:'TL-12',testPayment:true,tlCredited:0,endsAtMs:Date.now()+30*86400000};
   else if(u.pathname==='/api/payment/toss/confirm')out={success:true,total_tl:10500,bonus_tl:500,tl_balance:2000,tl_p:1500};
   else{status=404;out={ok:false,error:'unexpected-path'};}
   await route.fulfill({status,headers,contentType:'application/json',body:JSON.stringify(out)});
  });
  await page.route('https://fixture.test/**',route=>{
   const p=new URL(route.request().url()).pathname;
   if(['/renewal/renewal.js','/sidebar.js','/i18n.js','/_shared/footer.js'].includes(p))return route.fulfill({contentType:'application/javascript',body:''});
   if(['/renewal/renewal.css','/apple-theme.css','/wallet-design-system.css','/dropdown-fix.css'].includes(p))return route.fulfill({contentType:'text/css',body:'body{background:#0b0911;font-family:Arial,sans-serif}'});
   const file=path.join(process.cwd(),'public',p.slice(1));return route.fulfill({status:fs.existsSync(file)?200:404,contentType:p.endsWith('.js')?'application/javascript':p.endsWith('.css')?'text/css':'text/html; charset=utf-8',body:fs.existsSync(file)?fs.readFileSync(file):'not found'});
  });
  await page.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({contentType:'text/css',body:''}));
  await page.addInitScript(()=>{if(!sessionStorage.getItem('fixture-init')){localStorage.setItem('tl_token','fixture-token');localStorage.setItem('tl_user',JSON.stringify({id:1,tl:1234,tl_p:1000}));sessionStorage.setItem('fixture-init','yes');}window.fixturePayments=[];window.TossPayments=key=>({requestPayment:async(method,details)=>{window.fixturePayments.push({key,method,details});throw Object.assign(Error('fixture cancel'),{code:'USER_CANCEL'});}});});
  await page.goto('https://fixture.test/music-subscriptions.html');await page.locator('.ms-product').last().waitFor();assert.equal(await page.locator('.ms-product').count(),24);assert.ok(await page.locator('#ms-buy').isDisabled());
  missingUid=true;await page.locator('#ms-reload').click();await page.getByText(/이용권 조회를 잠시 후/).waitFor();assert.equal(await page.locator('.ms-product').count(),24);assert.ok(await page.locator('#ms-buy').isDisabled());missingUid=false;
  enabled=true;await page.locator('#ms-reload').click();await page.getByText('상품을 선택하고 이용조건을 확인하세요.',{exact:true}).waitFor();
  await page.locator('.ms-product[data-level="12"]').click();await page.locator('#ms-terms').check();await page.locator('#ms-buy').click();await page.getByText('결제창을 닫았습니다. 같은 상품으로 다시 시도할 수 있습니다.',{exact:true}).waitFor();
  let payment=await page.evaluate(()=>window.fixturePayments[0]);assert.equal(payment.method,'카드');assert.equal(payment.details.amount,12900);assert.equal(payment.details.orderId,orderId);assert.ok(payment.details.orderName.includes('TL-12'));assert.equal(payment.details.successUrl,'https://fixture.test/payment-success.html');assert.ok(payment.details.failUrl.includes('purpose=music'));assert.equal(prepared[0].termsAccepted,true);assert.ok(!('amount' in prepared[0]));
  const requestKey=prepared[0].requestKey;await page.locator('#ms-buy').click();await page.getByText('결제창을 닫았습니다. 같은 상품으로 다시 시도할 수 있습니다.',{exact:true}).waitFor();assert.equal(prepared[1].requestKey,requestKey);
  await page.locator('.ms-product[data-level="4"]').click();await page.locator('#ms-terms').check();assert.ok(await page.locator('#ms-buy').isDisabled());
  await page.reload();await page.locator('.ms-product[aria-pressed=true][data-level="12"]').waitFor();
  fs.mkdirSync('test-results',{recursive:true});await page.screenshot({path:'test-results/music-subscriptions-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:'test-results/music-subscriptions-mobile.png',fullPage:true});
  const before=await page.evaluate(()=>localStorage.getItem('tl_user'));await page.goto('https://fixture.test/payment-success.html?paymentKey=music-pg&orderId='+orderId+'&amount=12900');await page.getByText('음악 구독 시험결제 확인',{exact:true}).waitFor();assert.equal(await page.evaluate(()=>localStorage.getItem('tl_user')),before);assert.equal(await page.evaluate(()=>sessionStorage.getItem('tl_music_pending_1')),null);assert.equal(requests.filter(x=>x==='/api/payment/toss/confirm').length,0);
  assert.equal(await page.locator('#homeBtn').getAttribute('href'),'/music-subscriptions.html');
  await page.evaluate(()=>localStorage.removeItem('tl_token'));const confirms=requests.filter(x=>x.endsWith('/v5/music/confirm')).length;
  await page.goto('https://fixture.test/payment-success.html?paymentKey=music-pg&orderId='+orderId+'&amount=12900');await page.getByText('로그인이 필요합니다.',{exact:true}).waitFor();assert.equal(requests.filter(x=>x.endsWith('/v5/music/confirm')).length,confirms);assert.equal(await page.locator('#homeBtn').getAttribute('href'),'/login.html');
  await page.evaluate(()=>localStorage.setItem('tl_token','fixture-token'));
  await page.goto('https://fixture.test/music-subscriptions.html');await page.locator('.ms-product').last().waitFor();wrongPrice=true;await page.locator('#ms-terms').check();await page.locator('#ms-buy').click();await page.getByText('구독 주문과 선택한 상품이 일치하지 않습니다. 결제를 진행하지 않았습니다.',{exact:true}).waitFor();assert.equal(await page.evaluate(()=>window.fixturePayments.length),0);wrongPrice=false;
  offline=true;await page.locator('#ms-reload').click();await page.getByText('요청을 처리하지 못했습니다. 다시 시도해 주세요.',{exact:true}).waitFor();assert.equal(await page.locator('.ms-product').count(),0);assert.ok(await page.locator('#ms-buy').isDisabled());offline=false;
  await page.goto('https://fixture.test/payment-fail.html?purpose=music&message=%25');assert.equal(await page.locator('#errMsg').textContent(),'%');assert.equal(await page.locator('.btn').getAttribute('href'),'/music-subscriptions.html');
  await page.goto('https://fixture.test/payment-success.html?paymentKey=topup-pg&orderId=TL_toss_fixture&amount=10000');await page.getByText('결제 완료!',{exact:true}).waitFor();assert.equal(requests.filter(x=>x==='/api/payment/toss/confirm').length,1);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('tl_user')).tl),2000);
  assert.deepEqual(errors,[]);console.log('PASS browser: 24 products, disabled storefront, server-bound quote, test SDK purpose, persistent retry key, wrong-price block, callback isolation/no TL credit, auth recovery, legacy top-up, cancellation routing, offline clearing and mobile layout');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>fs.rmSync(temp,{recursive:true,force:true}));
