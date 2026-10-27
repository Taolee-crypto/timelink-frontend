const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.TL_PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve('public'),types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png'};
async function main(){
 const server=http.createServer((req,res)=>{let name=decodeURIComponent(new URL(req.url,'http://local').pathname);if(name==='/')name='/index.html';if(!path.extname(name))name+='.html';const file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end('Missing');return;}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({headless:true,...(process.env.TL_CHROMIUM_EXECUTABLE?{executablePath:process.env.TL_CHROMIUM_EXECUTABLE}:{})});const page=await browser.newPage({locale:'ko-KR',viewport:{width:1440,height:1000}});page.setDefaultTimeout(15000);
  await page.addInitScript(()=>{localStorage.setItem('tl_token','isolated-module-fixture');localStorage.setItem('tl_user',JSON.stringify({id:7,email:'fixture@example.test',username:'검사 계정'}));localStorage.setItem('tl_lang','ko');});
  const track={id:10,file_id:10,share_id:'tl3_10',content_kind:'tl3',file_type:'audio/tl3',title:'화면 검수용 음악',artist:'검사 아티스트',user_id:7,duration:180,duration_sec:180,lyrics:'첫 번째 가사\n두 번째 가사',created_at:'2026-10-27T00:00:00Z',stream_url:'https://api.timelink.digital/api/stream/tl3_10',cover_url:'/images/renewal/live-vocal-card.jpg'};
  let walletFail=false,historyFail=false;const writes=[];
  await page.route('https://api.timelink.digital/**',route=>{
   const u=new URL(route.request().url()),method=route.request().method();let body={ok:true};let status=200;
   if(method!=='GET'&&!u.pathname.includes('/presence')){writes.push(u.pathname);status=403;body={ok:false};}
   else if(u.pathname==='/api/eco/wallet'){if(walletFail){status=503;body={error:'fixture-down'};}else body={wallet:{tl_total:333,tl_p:123,tl_a:10,tl_b:200,tlc:1.25,poc_index:0.7}};}
   else if(u.pathname==='/api/payment/v5/shareplace-time/status')body={ok:true,time_free_remaining_ms:3600000,can_play:true};
   else if(u.pathname==='/api/v3/economy/history'){if(historyFail){status=503;body={ok:false};}else{const offset=Number(u.searchParams.get('offset')||0);body={ok:true,entries:Array.from({length:offset===0?50:3},(_,i)=>({entry_id:53-offset-i,asset_code:i%2?'TLC':'TL',amount_atoms:i%2?-1000000000:20000,created_at:'2026-10-27 00:00:00',description:i===0?'<b>원장 기록 검사</b>':'플랫폼 이용 기록'}))};}}
   else if(u.pathname==='/api/shares')body={shares:[track]};
   else if(u.pathname==='/api/shares/10')body=track;
   else if(u.pathname.endsWith('/my-tl'))body={ok:true,tl_balance:0,total_charged:0,total_consumed:0};
   else if(u.pathname.includes('/resolve/'))body={ok:true,version:5,file_id:10,share_id:'tl3_10'};
   else if(u.pathname.includes('/file-meta/'))body={ok:true,duration_sec:180};
   else if(u.pathname.endsWith('/lounge'))body={ok:true,members:[],messages:[]};
   else if(u.pathname.endsWith('/inventory'))body={ok:true,tracks:[{file_id:10,title:track.title,artist:track.artist,duration_ms:180000}]};
   else if(u.pathname.includes('/comments/'))body={comments:[]};
   else if(u.pathname.includes('/follow-status/'))body={ok:true,following:false};
   else if(u.pathname.includes('/api/admin/')){status=403;body={ok:false};}
   return route.fulfill({status,contentType:'application/json',body:JSON.stringify(body)});
  });
  const origin='http://127.0.0.1:'+server.address().port,frame=()=>page.frameLocator('#tl-content');
  const open=async route=>{await page.goto(origin+'/?view='+encodeURIComponent(route));await page.frameLocator('#tl-content').locator('.module-context').waitFor();};
  fs.mkdirSync('test-results',{recursive:true});
  await open('/wallet.html');await frame().getByText('현재 계정의 지갑 잔액입니다.',{exact:true}).waitFor();assert.equal(await frame().locator('#walletTl').textContent(),'333');assert.equal(await frame().locator('#walletPaid').textContent(),'123 TL');assert.equal(await frame().locator('#walletTlc').textContent(),'1.25');assert.match(await frame().locator('#walletTimeFree').textContent(),/1시간 0분 0초/);assert.equal(await frame().locator('.wallet-history-row').count(),50);assert.equal(await frame().locator('.wallet-history-row b').count(),0);assert.equal(await frame().locator('.wallet-entry-value').first().textContent(),'+2 TL');
  await frame().getByRole('button',{name:'이전 기록 더 보기'}).click();await frame().getByText('53건',{exact:true}).waitFor();assert.equal(writes.length,0,'Wallet must not mutate financial state');await page.screenshot({path:'test-results/modules-wallet-desktop.png',fullPage:true});
  walletFail=true;historyFail=true;await frame().getByRole('button',{name:'새로고침',exact:true}).click();await frame().getByText('지갑을 불러오지 못했습니다. 로그인 상태를 확인하고 다시 조회해 주세요.',{exact:true}).waitFor();assert.equal(await frame().locator('#walletTl').textContent(),'—');assert.equal(await frame().locator('.wallet-history-row').count(),0);assert.equal(await frame().locator('#walletTlc').textContent(),'—');walletFail=false;historyFail=false;
  await open('/track.html?id=10');await frame().locator('#lyricsBox').waitFor();assert.match(await frame().locator('#lyricsBox').textContent(),/첫 번째 가사/);const share=frame().getByRole('button',{name:'곡 공유하기'});await share.click();await frame().locator('#shareModal[role=dialog]').waitFor();await page.keyboard.press('Shift+Tab');assert.equal(await frame().locator('#shareModal').evaluate(el=>el.contains(document.activeElement)),true);await page.keyboard.press('Tab');assert.equal(await frame().locator('#shareModal').evaluate(el=>el.contains(document.activeElement)),true);await page.keyboard.press('Escape');await frame().locator('#shareModal').waitFor({state:'hidden'});assert.equal(await share.evaluate(el=>document.activeElement===el),true);assert.equal(await frame().locator('.module-time-free').getAttribute('data-active'),'true');await page.screenshot({path:'test-results/modules-track-desktop.png',fullPage:true});
  await open('/creator.html');const drop=frame().locator('#panel1 #audioDrop');await drop.getByText('MP3 파일을 여기에 놓거나 클릭',{exact:false}).waitFor();assert.equal(await drop.getAttribute('role'),'button');const [chooser]=await Promise.all([page.waitForEvent('filechooser'),drop.press('Enter')]);await chooser.setFiles([]);assert.equal(await frame().locator('label[for=title]').count(),1);
  await open('/radio.html');assert.equal(await frame().locator('#country option').count(),6);await frame().locator('#country').selectOption('JP');assert.equal(await frame().locator('#country').inputValue(),'JP');await page.screenshot({path:'test-results/modules-radio-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
  for(const route of ['/wallet.html','/track.html?id=10','/creator.html','/radio.html','/shareplace.html']){
   await open(route);const content=page.frames().find(f=>f.url().includes(new URL(route,origin).pathname));await content.evaluate(()=>document.fonts.ready);if(route.includes('track'))await frame().locator('#lyricsBox').waitFor();if(route.includes('wallet'))await frame().getByText('현재 계정의 지갑 잔액입니다.',{exact:true}).waitFor();
   const overflow=await content.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1);assert.equal(overflow,false,route+' horizontal overflow');await page.screenshot({path:'test-results/modules-'+route.split('/').pop().split('.')[0]+'-mobile.png',fullPage:true});
  }
  console.log('PASS module screens: actual wallet balances and unit precision, paged history/text safety/failure clearing/read-only calls, track lyrics/dialog focus and Escape, creator keyboard file chooser/labels, country controls, five mobile layouts; no payment or audio initiated.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
}
main().catch(e=>{console.error(e);process.exitCode=1});
