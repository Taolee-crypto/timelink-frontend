const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const front=process.cwd(),temp=fs.mkdtempSync(path.join(os.tmpdir(),'sales-ui-')),ref='ae05c701b78dbd8f08dc5f7085bfbc46b2b3e931';
 const files=['scripts/test-sales-managers.cjs','migrations/0003_v3_economy_ledger.sql','migrations/20261026_sales_managers.sql','src/sales-managers.ts','src/routes/sales-managers.ts','src/routes/cafe.ts','src/economy-ledger.ts','src/auth.ts','src/types.ts','src/creator-split-policy.ts','src/economy-policy.ts'];
 for(const file of files){const r=await fetch('https://raw.githubusercontent.com/Taolee-crypto/timelink-backend/'+ref+'/'+file);if(!r.ok)throw Error('Download '+file);fs.mkdirSync(path.dirname(temp+'/'+file),{recursive:true});fs.writeFileSync(temp+'/'+file,await r.text());}
 fs.symlinkSync(front+'/node_modules',temp+'/node_modules','dir');process.chdir(temp);
 const {makeFixture,seedMember,makeHttp}=require(temp+'/scripts/test-sales-managers.cjs'),f=makeFixture(),http=await makeHttp(f);
 const paid=await f.core.ensureLedgerAccount(f.db,'user',1,'TL','wallet_paid');f.raw.prepare('UPDATE v3_economy_balances SET available_atoms=1000000000 WHERE account_id=?').run(paid);
 const html=fs.readFileSync(front+'/public/sales-manager.html','utf8').replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<link[^>]*>/gi,'');
 const js=fs.readFileSync(front+'/public/sales-manager.js','utf8'),css=fs.readFileSync(front+'/public/sales-manager.css','utf8');
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']}),page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('tl_token',location.pathname.includes('admin-sales')?'fixture-99':location.pathname.includes('owner')?'fixture-1':'fixture-2'));
 await page.route('**/*',async route=>{
  const req=route.request(),url=new URL(req.url());
  if(url.hostname==='fixture.test'){
   const admin=url.pathname.includes('admin-sales'),body=admin?'<section id="panel-sales" class="on"><div id="adminSalesRoot"></div></section>':html;
   await route.fulfill({status:200,contentType:'text/html; charset=utf-8',body:body+'<style>body{background:#0a0a0e;color:#fff;font-family:Arial}'+css+'</style><script>'+js+'</script>'});return;
  }
  if(url.hostname==='api.timelink.digital'){
   const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Authorization,Content-Type','Access-Control-Allow-Methods':'GET,POST,OPTIONS'};
   if(req.method()==='OPTIONS'){await route.fulfill({status:204,headers});return;}
   const uid=Number((req.headers().authorization||'').split('-').pop())||null,r=await http(uid,url.pathname+url.search,req.method()==='POST'?req.postDataJSON():undefined);
   await route.fulfill({status:r.status,contentType:'application/json',headers,body:JSON.stringify(r.data)});return;
  }
  await route.abort();
 });
 await page.goto('https://fixture.test/sales-manager.html');await page.getByRole('button',{name:'계약 서명·가입 신청'}).waitFor();assert.equal(await page.getByRole('button',{name:'계약 서명·가입 신청'}).isDisabled(),true);
 await page.goto('https://fixture.test/admin-sales');let form=page.locator('[data-sm-form="policy"]');await form.locator('[name="join_fee_krw"]').fill('100000');await form.locator('[name="reason"]').fill('테스트 정책 승인');await form.getByRole('button',{name:/정책 저장/}).click();await page.getByText('가입비와 배분 정책 저장 완료',{exact:true}).waitFor();
 await page.goto('https://fixture.test/sales-manager.html');form=page.locator('[data-sm-form="join"]');await form.locator('[name="display_name"]').fill('영업 매니저 테스트');
 await page.locator('canvas[data-signature]').scrollIntoViewIfNeeded();
 const box=await page.locator('canvas[data-signature]').boundingBox();await page.mouse.move(box.x+20,box.y+40);await page.mouse.down();await page.mouse.move(box.x+box.width*.7,box.y+110,{steps:15});await page.mouse.up();
 await form.locator('[name="accept"]').check();await form.getByRole('button',{name:'계약 서명·가입 신청'}).click();await page.getByRole('button',{name:'테스트 입금 표시'}).waitFor();await page.getByRole('button',{name:'테스트 입금 표시'}).click();await page.getByText(/테스트 입금 표시 완료/).waitFor();
 assert.equal(f.raw.prepare('SELECT COUNT(*) n FROM v5_sales_payments').get().n,0);
 await page.goto('https://fixture.test/admin-sales');form=page.locator('[data-sm-form="review"]').first();await form.locator('[name="reason"]').fill('서명 및 테스트 입금 확인');await form.getByRole('button',{name:'저장',exact:true}).click();await page.getByText(/가입 상태 저장 완료/).waitFor();
 await page.getByRole('button',{name:'서명 보기'}).first().click();await page.getByRole('heading',{name:'영업 매니저 가입계약서'}).waitFor();
 await seedMember(f,4);
 await page.goto('https://fixture.test/owner.html?tab=owner');form=page.locator('[data-sm-form="assignment"]').first();await form.locator('[name="manager_user_id"]').selectOption('2');await form.locator('[name="dj_id"]').selectOption('30');await form.locator('[name="kind"]').selectOption('store');await form.locator('[name="reason"]').fill('상점주의 담당 연결 요청');await form.locator('[name="owner_accept"]').check();await form.getByRole('button',{name:'상점주 요청 저장'}).click();await page.getByText(/상점주 요청으로 담당 매니저/).waitFor();
 await page.locator('[data-renew="store1"]').click();await page.getByText(/방송 서비스 연장 완료/).waitFor();assert.equal((await f.core.cafeWallet(f.db,2)).tl_p,12500);assert.equal((await f.core.cafeWallet(f.db,3)).tl_p,12500);
 const reg={name:'새 스토어',country:'KR',biz_reg_num:'1234567890',biz_type:'individual',addr:'서울 테스트',sales_manager_id:2,dj_id:30,store_kind:'store',sales_accept:true,request_id:'browserregistration0001'};
 const created=await http(1,'/api/cafe/channels',reg);assert.equal(created.status,200,JSON.stringify(created.data));const replay=await http(1,'/api/cafe/channels',reg);assert.equal(replay.data.channel_id,created.data.channel_id);
 assert.equal((await http(null,'/world?kind=all')).data.channels.length,2);
 await page.goto('https://fixture.test/owner.html?tab=owner');form=page.locator('[data-sm-form="assignment"]').filter({has:page.locator('[name="channel_id"][value="store1"]')});
 await form.locator('[name="manager_user_id"]').selectOption('4');await form.locator('[name="dj_id"]').selectOption('40');await form.locator('[name="reason"]').fill('상점주 담당 변경 요청');await form.locator('[name="owner_accept"]').check();await form.getByRole('button',{name:'상점주 요청 저장'}).click();await page.getByText(/상점주 요청으로 담당 매니저/).waitFor();
 const oldIncome=(await f.core.cafeWallet(f.db,2)).tl_p;f.raw.prepare('UPDATE v3_economy_balances SET available_atoms=500000000 WHERE account_id=?').run(paid);
 await page.locator('[data-renew="store1"]').click();await page.getByText(/방송 서비스 연장 완료/).waitFor();assert.equal((await f.core.cafeWallet(f.db,2)).tl_p,oldIncome);assert.equal((await f.core.cafeWallet(f.db,4)).tl_p,25000);
 const denied=await http(2,'/stores/store1/assignment',{manager_user_id:2,dj_id:30,kind:'store',expected_version:2,reason:'비소유자 변경 시도'});assert.equal(denied.status,403);
 fs.mkdirSync(front+'/test-results',{recursive:true});await page.screenshot({path:front+'/test-results/sales-owner-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});await page.screenshot({path:front+'/test-results/sales-owner-mobile.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1));
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS browser: real Hono API + SQLite onboarding, contract ink, simulated deposit not cash, admin review, owner assignment, store creation/replay/world, 25/25/50 cash provenance, manager replacement and mobile layout');
})().catch(e=>{console.error(e);process.exitCode=1});
