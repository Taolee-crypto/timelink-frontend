const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.TL_PLAYWRIGHT_MODULE||'playwright');
const front=process.cwd(),backend=path.resolve(process.env.TL_CONTRIBUTION_BACKEND_ROOT||'../timelink-backend');
const {buildSync}=require(path.join(backend,'node_modules/esbuild'));
const temp=fs.mkdtempSync('/tmp/v5-contribution-ui-');
buildSync({stdin:{contents:"export * from './src/v5-contribution-policy';export * from './src/v5-daily-free-policy';",resolveDir:backend,loader:'ts'},bundle:true,platform:'node',format:'cjs',outfile:path.join(temp,'policy.cjs'),logLevel:'silent'});
const api=require(path.join(temp,'policy.cjs'));
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.TL_CHROMIUM_EXECUTABLE?{executablePath:process.env.TL_CHROMIUM_EXECUTABLE}:{})});
 try{
  const page=await browser.newPage({viewport:{width:1360,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  let policy=structuredClone(api.DEFAULT_CONTRIBUTION_POLICY),version=0,posts=0,offline=false,denied=false,history=[{version:0,updated_by:null,note:'초기 기준',updated_at:'2026-10-26 07:13:02'}];
  await page.route('https://api.timelink.digital/**',async route=>{
   const req=route.request(),u=new URL(req.url()),headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Authorization,Content-Type','Access-Control-Allow-Methods':'GET,POST,OPTIONS'};
   if(req.method()==='OPTIONS')return route.fulfill({status:204,headers});
   let out,status=200;
   if(denied){status=403;out={ok:false,error:'ADMIN_REQUIRED'};}
   else if(offline){status=503;out={ok:false,error:'연결 중단'};}
   else if(u.pathname.endsWith('/history'))out={ok:true,history};
   else if(u.pathname.includes('/contribution-members/'))out={ok:true,policyVersion:version,score:55,index:.55,grade:5,miningScore:50,miningIndex:.5,accepted:7,rejected:1,newMiningEnabled:false};
   else if(req.method()==='POST'){
    const body=req.postDataJSON();posts++;
    if(body.expected_version!==version){status=409;out={ok:false,error:'CONTRIBUTION_VERSION_CONFLICT'};}
    else{try{api.validateContributionPolicy(body.policy);assert.ok(body.note.trim());policy=body.policy;version++;history.unshift({version,updated_by:1,note:body.note,updated_at:'2026-10-26 08:00:00'});out={ok:true,version};}catch(e){status=400;out={ok:false,error:e.message};}}
   }else{const definitions=api.contributionTable(policy);definitions.find(d=>d.activity==='like').label='<img src=x onerror=alert(1)> 좋아요';out={ok:true,policy,version,definitions,products:api.dailyFreeCatalogue(),newMiningEnabled:false};}
   return route.fulfill({status,headers,contentType:'application/json',body:JSON.stringify(out)});
  });
  await page.route('https://fixture.test/**',route=>{
   const p=new URL(route.request().url()).pathname;
   if(p==='/apple-theme.css'||p==='/wallet-design-system.css')return route.fulfill({contentType:'text/css',body:'body{background:#0b0911;font-family:Arial,sans-serif}'});
   const file=path.join(front,'public',p==='/'?'contribution-policy.html':p);
   return route.fulfill({status:fs.existsSync(file)?200:404,contentType:p.endsWith('.js')?'application/javascript':p.endsWith('.css')?'text/css':'text/html; charset=utf-8',body:fs.existsSync(file)?fs.readFileSync(file):'not found'});
  });
  await page.goto('https://fixture.test/contribution-policy.html');
  await page.locator('#cp-form').waitFor({state:'visible'});
  assert.equal(await page.locator('#cp-activities tr').count(),24);assert.equal(await page.locator('#cp-products tr').count(),24);
  assert.equal(await page.locator('#cp-activities img').count(),0);
  const purchase=page.locator('[name="weightsBps.purchase"]'),content=page.locator('[name="weightsBps.content"]');
  await purchase.fill('45');assert.ok(await page.locator('#cp-save').isDisabled());
  await content.fill('15');assert.ok(await page.locator('#cp-save').isEnabled());
  await page.locator('[name="activities.like.pointsPerUnit"]').fill('0.02');
  await page.locator('#cp-note').fill('검증된 활동 반응에 따라 가중치 조정');await page.locator('#cp-save').click();
  await page.getByText('수동 승인·저장 완료 · 정책 버전 1',{exact:true}).waitFor();assert.equal(posts,1);assert.equal(policy.weightsBps.purchase,4500);assert.equal(policy.activities.like.pointsPerUnit,.02);
  await page.locator('#cp-category').selectOption('community');assert.equal(await page.locator('#cp-activities tr:visible').count(),13);
  await page.locator('#cp-search').fill('referral');assert.equal(await page.locator('#cp-activities tr:visible').count(),5);
  await page.locator('#cp-search').fill('');await page.locator('#cp-category').selectOption('');
  await page.locator('#cp-member-id').fill('2');await page.getByRole('button',{name:'기여도 조회',exact:true}).click();await page.getByText(/종합 55점/).waitFor();
  version++;await page.locator('#cp-note').fill('동시 변경 충돌 검사');await page.locator('#cp-save').click();await page.getByText(/다른 관리자가 먼저 수정했습니다/).waitFor();assert.ok(await page.locator('#cp-save').isDisabled());assert.equal(await page.locator('#cp-note').inputValue(),'동시 변경 충돌 검사');
  await page.locator('#cp-reload').click();await page.getByText('수동 관리 · 정책 버전 2 · 신규 채굴 비활성',{exact:true}).waitFor();assert.equal(await page.locator('#cp-note').inputValue(),'');
  fs.mkdirSync('test-results',{recursive:true});await page.screenshot({path:'test-results/contribution-policy-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:'test-results/contribution-policy-mobile.png',fullPage:true});
  offline=true;await page.locator('#cp-reload').click();await page.getByText('연결 중단',{exact:true}).waitFor();assert.ok(await page.locator('#cp-form').isHidden());assert.equal(await page.locator('#cp-activities tr').count(),0);assert.equal(await page.locator('#cp-history tr').count(),0);
  offline=false;denied=true;await page.locator('#cp-reload').click();await page.getByText('관리자 로그인이 필요합니다. 관리자 콘솔에서 다시 로그인하세요.',{exact:true}).waitFor();assert.ok(await page.locator('#cp-save').isDisabled());
  assert.deepEqual(errors,[]);console.log('PASS browser: 24 activities/products, safe rendering, weight validation, approved save, filter, member lookup, CAS conflict retention, history, mobile layout, network/auth failure clearing');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>fs.rmSync(temp,{recursive:true,force:true}));
