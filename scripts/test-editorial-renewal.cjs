const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.TL_PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve('public');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
async function main(){
 const server=http.createServer((req,res)=>{let name=decodeURIComponent(new URL(req.url,'http://local').pathname);if(name==='/')name='/index.html';if(!path.extname(name))name+='.html';const file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end('Not found');return;}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({headless:true,...(process.env.TL_CHROMIUM_EXECUTABLE?{executablePath:process.env.TL_CHROMIUM_EXECUTABLE}:{})});
  const page=await browser.newPage({locale:'ko-KR',viewport:{width:1440,height:1000}});page.setDefaultTimeout(15000);
  let failedCatalog=false;
  await page.route('https://api.timelink.digital/**',route=>{
   const url=new URL(route.request().url());
   if(url.pathname==='/api/shares'){if(failedCatalog)return route.fulfill({status:503,contentType:'application/json',body:'{}'});return route.fulfill({contentType:'application/json',body:JSON.stringify({shares:[{id:10,share_id:'tl3_fixture',content_kind:'tl3',title:'공개 음악 검사',artist:'검사 창작자',cover_url:'/images/renewal/vinyl-collection-card.jpg'},{id:11,content_kind:'mp3',title:'공유 제외 원본'}]})});}
   if(url.pathname.includes('member-profile'))return route.fulfill({contentType:'application/json',body:JSON.stringify({ok:true,profile:{display_name:'검사 계정',email:'fixture@example.test',bio:'브라우저 검사'}})});
   return route.fulfill({status:403,contentType:'application/json',body:JSON.stringify({ok:false})});
  });
  const origin='http://127.0.0.1:'+server.address().port;
  await page.goto(origin+'/');const frame=()=>page.frameLocator('#tl-content');
  await frame().getByRole('heading',{name:'창작활동이 경제활동이 되는 곳.'}).waitFor();
  const entrances=page.locator('.tl-global-links>.tl-global-link');assert.equal(await entrances.count(),4);assert.deepEqual(await entrances.evaluateAll(links=>links.map(a=>new URL(a.href).pathname)),['/timelink.html','/new-asset.html','/radio.html','/world-network.html']);
  await frame().getByRole('link',{name:'플레이어 다운로드 ↗'}).waitFor();await page.waitForLoadState('networkidle');assert.equal(await frame().getByRole('link',{name:'24개 상품 살펴보기 →'}).getAttribute('href'),'/music-subscriptions.html');
  fs.mkdirSync('test-results',{recursive:true});await page.screenshot({path:'test-results/editorial-home-desktop.png',fullPage:true});
  await entrances.nth(1).click();await frame().locator('#gateCatalog .gate-work').first().waitFor();assert.equal(await frame().locator('#gateCatalog .gate-work').count(),1);assert.equal(await frame().locator('#gateCatalog .gate-work').getAttribute('href'),'/track.html?id=tl3_fixture');
  failedCatalog=true;await page.goto(origin+'/?view='+encodeURIComponent('/new-asset.html'));await frame().getByRole('button',{name:'다시 불러오기'}).waitFor();failedCatalog=false;await frame().getByRole('button',{name:'다시 불러오기'}).click();await frame().locator('#gateCatalog .gate-work').waitFor();
  await page.locator('.tl-global-links>.tl-global-link').nth(3).click();await frame().getByRole('heading',{name:'나의 매장에서, 우리의 일상으로.'}).waitFor();assert.equal(await frame().getByRole('link',{name:'스토어월드 둘러보기 ↗'}).getAttribute('href'),'/cafe-world.html');assert.equal(await frame().getByRole('link',{name:'나의 차 →',exact:true}).getAttribute('href'),'/my-car.html');
  await page.screenshot({path:'test-results/editorial-world-desktop.png',fullPage:true});
  await page.goto(origin+'/?view='+encodeURIComponent('/shareplace.html'));await frame().locator('.file-card[role="link"]').first().waitFor();await frame().locator('#vt-list').click();const row=frame().locator('.fl-item[role="link"]').first();await row.focus();await Promise.all([page.waitForEvent('framenavigated',{predicate:f=>/\/(track|login)(?:\.html)?(?:[?#]|$)/.test(f.url())}),row.press('Enter')]);
  await page.evaluate(()=>localStorage.setItem('tl_token','isolated-ui-fixture'));await page.goto(origin+'/?view='+encodeURIComponent('/my-profile.html'));await frame().getByRole('heading',{name:'내 정보',exact:true}).waitFor();assert.equal(await frame().locator('.gate-account-links a').count(),10);await frame().locator('#name').fill('수정 이름');await frame().getByRole('button',{name:'프로필 저장'}).click();await frame().getByText('저장되었습니다.',{exact:true}).waitFor();
  // Check every new entrance/story at phone width; ensure the content frame
  // itself never needs horizontal scrolling and its images actually load.
  await page.setViewportSize({width:390,height:844});
  for(const route of ['/timelink.html','/new-asset.html','/world-network.html','/timelink-story.html','/timelink-economy.html','/my-profile.html']){
   await page.goto(origin+'/?view='+encodeURIComponent(route));await frame().locator('h1').waitFor();await frame().locator('#tl-editorial-style').waitFor({state:'attached'});
   const content=page.frames().find(f=>new URL(f.url()).pathname===route);assert.ok(content,route);
   await content.evaluate(()=>document.fonts.ready);await content.waitForFunction(()=>[...document.images].every(i=>i.complete));
   const state=await content.evaluate(()=>({overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1,broken:[...document.images].filter(i=>i.naturalWidth===0).length}));assert.equal(state.overflow,false,route+' overflows');assert.equal(state.broken,0,route+' has broken images');
   if(route==='/timelink.html')await page.screenshot({path:'test-results/editorial-home-mobile.png',fullPage:true});
   if(route==='/new-asset.html')await page.screenshot({path:'test-results/editorial-assets-mobile.png',fullPage:true});
  }
  assert.equal(await page.locator('.tl-bottom-nav a').count(),4);
  console.log('PASS browser renewal: four entrances, download/products/owner routes, real catalogue contract and retry, profile save, six phone layouts with loaded images. Payment and audio remain covered by existing regression tests.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
}
main().catch(e=>{console.error(e);process.exitCode=1});
