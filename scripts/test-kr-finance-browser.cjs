const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
let browser;
const watchdog=setTimeout(()=>{console.error('KR finance browser test exceeded 120 seconds');process.exit(1)},120000);watchdog.unref();
(async()=>{
const temp=fs.mkdtempSync(require('node:path').join(require('node:os').tmpdir(),'kr-finance-browser-'));
const backendRef='174bec47fca0654c108e92b88b3c58efde91c00e';
for(const path of ['scripts/test-kr-finance.cjs','src/kr-finance.ts','migrations/20261026_kr_finance_accounting.sql']){
 const response=await fetch('https://raw.githubusercontent.com/Taolee-crypto/timelink-backend/'+backendRef+'/'+path,{signal:AbortSignal.timeout(15000)});
 if(!response.ok)throw Error('Backend fixture download failed: '+path);
 fs.mkdirSync(require('node:path').dirname(temp+'/'+path),{recursive:true});fs.writeFileSync(temp+'/'+path,await response.text());
}
let pre=fs.readFileSync(temp+'/scripts/test-kr-finance.cjs','utf8').split('(async()=>{')[0];
pre=pre.replaceAll("'migrations/20261026_kr_finance_accounting.sql'",JSON.stringify(temp+'/migrations/20261026_kr_finance_accounting.sql')).replaceAll("'src/kr-finance.ts'",JSON.stringify(temp+'/src/kr-finance.ts'));
const fixture={exports:{}};new Function('require','module',pre+'\nmodule.exports={ctx,db,raw};')(require,fixture);
const {ctx,db}=fixture.exports;
console.log('[KR browser] launching Chrome');
browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.TL_CHROMIUM_EXECUTABLE?{executablePath:process.env.TL_CHROMIUM_EXECUTABLE}:{})});const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];page.setDefaultTimeout(15000);page.setDefaultNavigationTimeout(15000);page.on('pageerror',e=>errors.push(e.message));
// Use a boundary-aware regex: embedded globstars differ across driver versions.
await page.route(/^https:\/\/api\.timelink\.digital\/api\/admin\/finance\/kr(?:[/?].*)?$/,async route=>{
 const req=route.request(),url=new URL(req.url());let out,status=200;
 try{
  if(req.method()==='OPTIONS'){await route.fulfill({status:204,headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Authorization,Content-Type','Access-Control-Allow-Methods':'GET,POST,OPTIONS'}});return;}
  const body=req.method()==='POST'?req.postDataJSON():null,path=url.pathname.split('/kr')[1];
  if(req.method()==='GET'){out={...await ctx.readKrFinance(db,url.searchParams.get('month')||new Date(Date.now()+9*3600000).toISOString().slice(0,7)),creator_economy:{lifetime_earned_tl:0,valuation_status:'평가 확인 필요'}};}
  else if(path==='/policy')out={ok:true,data:await ctx.saveKrPolicy(db,body,33)};
  else if(path==='/tax-profile')out={ok:true,data:await ctx.saveKrProfile(db,body,33)};
  else if(path==='/journal')out={ok:true,data:await ctx.postKrJournal(db,body,33)};
  else if(path==='/tax-preview')out={ok:true,data:body.kind==='vat'?ctx.krVat(body.gross_krw,body.vat_type):body.kind==='corporate'?ctx.krCorporate(body):ctx.krWithholding(body,await db.prepare('SELECT * FROM v5_kr_tax_profiles WHERE user_id=?').bind(body.user_id).first())};
  else throw Error('Unexpected '+path);
 }catch(e){status=400;out={ok:false,error:e.message};}
 await route.fulfill({status,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify(out)});
});
await page.setContent('<style>:root{--bg2:#101322;--bg3:#191d2c;--bd2:#34394a;--t1:#f1f3f8;--t2:#afb9cb;--g:#00ff94;--g3:#163c32;--sky:#38bfff;--rose:#ff4d6a}body{background:#090c16;color:white;font-family:Arial;margin:24px}'+fs.readFileSync('public/admin-kr-finance.css','utf8')+'</style><div id="panel-revenue" class="active"><div id="krFinanceRoot"></div></div><script>function getAdminToken(){return "fixture-token"}</script>');
await page.addScriptTag({content:fs.readFileSync('public/admin-kr-finance.js','utf8')});
console.log('[KR browser] waiting for finance module');
await page.getByRole('heading',{name:'대한민국 회계·세금',exact:true}).waitFor();await page.locator('[data-receipt="7"]').waitFor();
assert.ok((await page.locator('#krFinanceRoot').innerText()).includes('기초 잔액·은행 대사 전'));
console.log('[KR browser] tax preview');
await page.locator('[data-tab="tax"]').click();
let f=page.locator('[data-form="tax"]');await f.locator('[name="gross_krw"]').fill('300000');await f.getByRole('button',{name:'세금 계산',exact:true}).click();
await page.getByText('27,273원',{exact:true}).waitFor();
let p=page.locator('[data-form="profile"]');await p.locator('[name="user_id"]').fill('33');await p.locator('[name="income_type"]').selectOption('business_personal');await p.locator('[name="vat_type"]').selectOption('exempt');await p.locator('[name="reason"]').fill('개인 인적용역 확인');await p.locator('[name="evidence"]').fill('fixture:tax');await p.locator('[name="verified"]').check();await p.getByRole('button',{name:'세금 분류 저장'}).click();await page.getByText('회원 세금 분류 저장 완료',{exact:true}).waitFor();
f=page.locator('[data-form="tax"]');await f.locator('[name="kind"]').selectOption('withholding');await f.locator('[name="user_id"]').fill('33');await f.locator('[name="gross_krw"]').fill('70000');await f.locator('[name="tax_base_krw"]').fill('70000');await f.getByRole('button',{name:'세금 계산',exact:true}).click();await page.getByText('67,690원',{exact:true}).waitFor();
console.log('[KR browser] policy and journal');
await page.locator('[data-tab="policy"]').click();p=page.locator('[data-form="policy"]');await p.locator('[name="framework"]').selectOption('general');await p.locator('[name="role"]').selectOption('principal');await p.locator('[name="opening_confirmed"]').check();await p.locator('[name="reason"]').fill('기초 잔액 확인');await p.locator('[name="evidence"]').fill('fixture:policy');await p.getByRole('button',{name:/설정 저장/}).click();await page.getByText('회계 정책 저장 완료',{exact:true}).waitFor();
await page.locator('[data-tab="overview"]').click();await page.locator('[data-receipt="7"]').click();
f=page.locator('[data-form="journal"]');await f.locator('[name="description"]').fill('실결제 영수증 확인');await f.locator('[name="evidence"]').fill('fixture:receipt');await f.locator('[name="cash_verified"]').check();await f.getByRole('button',{name:'검토한 전표 기표'}).click();await page.getByText(/회계 전표 기표 완료/).waitFor();assert.equal((await ctx.readKrFinance(db,'2026-10')).summary.prepaid_liability_krw,100000);
async function post(kind,key,amount,extra){
 await page.locator('[data-tab="journals"]').click();const q=page.locator('[data-form="journal"]');await q.locator('[name="template"]').selectOption(kind);await q.locator('[name="source_key"]').fill(key);await q.locator('[name="amount_krw"]').fill(String(amount));await q.locator('[name="description"]').fill('실제 거래 증빙 확인');await q.locator('[name="evidence"]').fill('fixture:'+key);if(extra)await extra(q);await q.getByRole('button',{name:'검토한 전표 기표'}).click();await page.getByText(/회계 전표 기표 완료/).waitFor();
}
await post('deposit','bank:deposit1',100000,async q=>q.locator('[name="fee_krw"]').fill('3000'));
await post('service','music:1',100000,async q=>q.locator('[name="user_id"]').fill('33'));
await post('creator_accrual','rights:1',70000,async q=>{await q.locator('[name="user_id"]').fill('33');await q.locator('[name="krw_value_confirmed"]').check();});
await post('payout','payout:1',70000,async q=>{await q.locator('[name="user_id"]').fill('33');await q.locator('[name="tax_base_krw"]').fill('70000');});
const report=await ctx.readKrFinance(db,'2026-10');assert.equal(report.summary.operating_cash_krw,17909);assert.equal(report.summary.withholding_national_krw,2100);assert.equal(report.summary.bank_krw,29310);
await page.locator('[data-tab="overview"]').click();fs.mkdirSync('test-results',{recursive:true});await page.screenshot({path:'test-results/kr-finance-desktop.png',fullPage:true});
await page.setViewportSize({width:390,height:844});await page.screenshot({path:'test-results/kr-finance-mobile.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1));assert.deepEqual(errors,[]);
await browser.close();console.log('PASS browser desktop/mobile: actual KR module tax preview, tax profile save, policy CAS, receipt import, deposit, service, creator accrual, payout and operating cash');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{try{if(browser)await browser.close()}finally{clearTimeout(watchdog)}});
