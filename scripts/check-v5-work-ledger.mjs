// Prevent accidental truncation of the V5 development ledger page.
// Run with: node scripts/check-v5-work-ledger.mjs
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const html=readFileSync(new URL('../public/v5-work-ledger.html',import.meta.url),'utf8');
const required=[
  '<script>', '</script></body></html>',
  "const KEY='timelink-v5-work-ledger-v1'",
  'localStorage.getItem(KEY)', 'localStorage.setItem(KEY',
  'function render()', 'function save()', 'function openEdit(',
  "$('exportBtn').onclick", "$('importFile').onchange",
  'migrateTrackRights20261024()', 'migrateDjLearning()',
  'TLV5-RIGHTS-01', 'TLV5-DJLEARN-12',
];
for(const marker of required) assert.ok(html.includes(marker), 'V5 ledger missing required marker: '+marker);
const script=html.split('<script>').at(-1).split('</script>')[0];
assert.ok(script.length>10000,'V5 ledger script unexpectedly truncated');
// Check JavaScript parse errors without executing the browser code.
const { Script }=await import('node:vm');
new Script(script,{filename:'v5-work-ledger.html'});
console.log('V5 ledger integrity and syntax checks passed');
// Run the real release merge against an existing server ledger, including manual edits.
const {createContext,runInContext}=await import('node:vm');
const releases=JSON.parse(readFileSync(new URL('../public/docs/development-releases.json',import.meta.url),'utf8'));
const merge=script.slice(script.indexOf('const RELEASE_CATEGORY_ALIASES='),script.indexOf('async function loadServerWorkLedger(){'));
const manual={...releases.tasks[0],status:'보류',note:'관리자 검토 중',history:[{detail:'수동 수정'}]};
const startRetire=script.indexOf('const retiredIds='),endRetire=script.indexOf('const commonCategories=',startRetire);
assert.ok(startRetire>=0&&endRetire>startRetire);
const routeKey=path=>'TLV5-PAGE-'+Array.from(path).map(c=>c.codePointAt(0).toString(16)).join('-');
const pageRoutes=runInContext(script.slice(script.indexOf('const pageRoutes='),script.indexOf('const routeKey='))+';pageRoutes',createContext({}));
const context=createContext({pageRoutes,state:{tasks:[manual,{id:'old-market',category:'공유플레이스',status:'구현'}],events:[]},categories:[...new Set(releases.tasks.map(t=>t.category))],STAGE_WEIGHT:{'미검증':0,'설계':20,'구현':55,'테스트':80,'운영확인':100,'보류':0},routeKey,clone:o=>JSON.parse(JSON.stringify(o)),fetch:async()=>({ok:true,json:async()=>releases})});
runInContext(script.slice(startRetire,endRetire),context);
runInContext(merge,context);
assert.equal(await runInContext('mergeDevelopmentReleases()',context),true);
assert.equal(context.state.tasks[0].status,'보류');assert.equal(context.state.tasks[0].note,'관리자 검토 중');
assert.equal(context.state.tasks[1].category,'공유 마켓');
context.releaseTasks=releases.tasks;
assert.equal(context.state.tasks.length,runInContext('releaseTasks.filter(t=>!isRetired(t)).length',context)+1);
assert.ok(!context.state.tasks.some(t=>t.id==='TLV5-WORK-20261027-POLICY'));
assert.equal(await runInContext('mergeDevelopmentReleases()',context),false);
assert.equal(context.state.events.length,releases.events.length);
assert.ok(script.indexOf('try{releaseChanged=await mergeDevelopmentReleases();}')>script.indexOf('state=d.state;'));
// Page and future-radio exclusions are applied in two composed functions.
assert.ok(script.includes("function currentScopeTasks(tasks){return activeTasks(tasks).filter(t=>!isFutureTilo(t)&&t.category!=='라디오 수신앱');}"));
assert.ok(script.includes("function platformTasks(tasks){return currentScopeTasks(tasks).filter(t=>!String(t.id||'').startsWith('TLV5-PAGE-'));}"));
assert.ok(script.includes("function isDevelopmentComplete(t){return ['구현','테스트','운영확인'].includes(t&&t.status)}"));
console.log('PASS development progress: server-first merge, manual edits retained, repeat-safe releases and progress bar');

// Reviewed member evidence may advance only a pristine unverified historical row.
// A human-edited status or note must never be overwritten by release import.
const createMemberContext=(staff)=> {
 const ctx=createContext({
  pageRoutes,state:{tasks:[staff],events:[]},
  categories:[...new Set(releases.tasks.map(t=>t.category))],
  STAGE_WEIGHT:{'미검증':0,'설계':20,'구현':55,'테스트':80,'운영확인':100,'보류':0},
  routeKey,clone:o=>JSON.parse(JSON.stringify(o)),
  fetch:async()=>({ok:true,json:async()=>releases})
 });
 runInContext(script.slice(startRetire,endRetire),ctx);
 runInContext(merge,ctx);
 return ctx;
};
const freshMember=createMemberContext({id:'TLV5-004',category:'회원·인증',title:'직원 계정과 대표 승인',status:'미검증',note:'',history:[]});
await runInContext('mergeDevelopmentReleases()',freshMember);
assert.equal(freshMember.state.tasks.find(t=>t.id==='TLV5-004').status,'테스트');
assert.ok(freshMember.state.tasks.find(t=>t.id==='TLV5-004').note.includes('/pull/468'));
assert.equal(await runInContext('mergeDevelopmentReleases()',freshMember),false);
const manualMember=createMemberContext({id:'TLV5-004',category:'회원·인증',title:'직원 계정과 대표 승인',status:'미검증',note:'관리자 확인 대기',history:[]});
await runInContext('mergeDevelopmentReleases()',manualMember);
assert.equal(manualMember.state.tasks.find(t=>t.id==='TLV5-004').status,'미검증');
assert.equal(manualMember.state.tasks.find(t=>t.id==='TLV5-004').note,'관리자 확인 대기');
console.log('PASS TLV5-004 evidence imports only to untouched seed, never overrides manual verification');

// Reviewed release evidence may advance untouched generated navigation/page rows,
// but a manual note, hold or updated timestamp must remain authoritative.
const makeGeneratedEvidenceContext=tasks=>{
 const ctx=createContext({
  pageRoutes,state:{tasks,events:[]},
  categories:[...new Set(releases.tasks.map(t=>t.category))],
  STAGE_WEIGHT:{'미검증':0,'설계':20,'구현':55,'테스트':80,'운영확인':100,'보류':0},
  routeKey,clone:o=>JSON.parse(JSON.stringify(o)),
  fetch:async()=>({ok:true,json:async()=>releases})
 });
 runInContext(script.slice(startRetire,endRetire),ctx);runInContext(merge,ctx);return ctx;
};
const generatedNavNote='플랫폼 sidebar.js 실제 메뉴 기준 신규 검증 항목. 기능 완료 여부는 별도 확인 필요.';
const generatedPageNote='연결 페이지의 화면·API·권한·데이터·모바일·실서비스 E2E 검증 후 운영확인으로 변경. 코드 존재만으로 완료 처리 금지.';
const dashPageId=routeKey('/dashboard.html');
const dashboardEvidence=makeGeneratedEvidenceContext([
 {id:'TLV5-NAV-DASH',category:'대시보드',title:'대시보드 주요 지표·진입 동선 검증',status:'미검증',note:generatedNavNote,history:[]},
 {id:dashPageId,category:'대시보드',title:'페이지 검증',status:'미검증',note:generatedPageNote,history:[]}
]);
await runInContext('mergeDevelopmentReleases()',dashboardEvidence);
assert.equal(dashboardEvidence.state.tasks.find(t=>t.id==='TLV5-NAV-DASH').status,'테스트');
assert.equal(dashboardEvidence.state.tasks.find(t=>t.id===dashPageId).status,'테스트');
const heldEvidence=makeGeneratedEvidenceContext([
 {id:'TLV5-NAV-DASH',category:'대시보드',title:'대시보드 주요 지표·진입 동선 검증',status:'보류',note:generatedNavNote,history:[{detail:'관리자 보류'}]}
]);
await runInContext('mergeDevelopmentReleases()',heldEvidence);
assert.equal(heldEvidence.state.tasks.find(t=>t.id==='TLV5-NAV-DASH').status,'보류');
const manualEvidence=makeGeneratedEvidenceContext([
 {id:dashPageId,category:'대시보드',title:'페이지 검증',status:'미검증',note:'운영 점검 대기',history:[]}
]);
await runInContext('mergeDevelopmentReleases()',manualEvidence);
assert.equal(manualEvidence.state.tasks.find(t=>t.id===dashPageId).status,'미검증');
console.log('PASS reviewed release evidence advances only untouched generated nav/page rows');


// The ordinary registration form does not define business, owner or staff account types.
// Ownership and staff approval are tasks under My Cafe instead of member registration.
const signupHtml=readFileSync(new URL('../public/signup.html',import.meta.url),'utf8');
const storeSetup=readFileSync(new URL('../public/cafe-channel.html',import.meta.url),'utf8');
const staffPage=readFileSync(new URL('../public/cafe-staff.html',import.meta.url),'utf8');
assert.ok(signupHtml.includes("body: JSON.stringify({email: email, password: pw, username: username, marketing: agree3, consent_terms: agree1, consent_privacy: agree2, age_14_confirmed: agree1})"),
 'Signup must stay account-type neutral while sending mandatory consent evidence');
assert.ok(!/name\\s*=\\s*["'](?:role|account_type|business_type|staff_role)["']/i.test(signupHtml),
 'Owner/staff selection must never be part of member signup');
assert.ok(storeSetup.includes('aria-label="매장 개설 진행 단계"'));
assert.ok(staffPage.includes('일반 TimeLink 회원으로 로그인한 후'));

const scopeFixture=[
 {id:'TLV5-001',category:'회원·인증',title:'필수 약관',status:'운영확인'},
 {id:'TLV5-002',category:'회원·인증',title:'이메일 인증',status:'운영확인'},
 {id:'TLV5-003',category:'회원·인증',title:'개인·사업자 계정 전환',status:'구현',note:'수동 정책 메모',history:[{detail:'기존 검증'}]},
 {id:'TLV5-004',category:'회원·인증',title:'직원 계정과 대표 승인',status:'미검증',note:'관리자 검증 대기',history:[{detail:'수동 보류'}]},
 {id:'TLV5-005',category:'회원·인증',title:'다국어 번역',status:'구현'},
 {id:'TLV5-RENEWAL-20261024-LOGOUT',category:'회원·인증',title:'로그아웃',status:'테스트'}
];
const scopeContext=createContext({state:{tasks:scopeFixture,events:[]}});
const scopeSource=script.slice(script.indexOf('function alignStoreRoleTasks(){'),script.indexOf('const RELEASE_CATEGORY_ALIASES='));
assert.ok(scopeSource.includes('function alignStoreRoleTasks()'));
runInContext(scopeSource,scopeContext);
assert.equal(runInContext('alignStoreRoleTasks()',scopeContext),true);
const memberOnly=scopeFixture.filter(t=>t.category==='회원·인증');
assert.equal(memberOnly.length,4,'Member scope must contain only universal registration and authentication');
assert.equal(memberOnly.filter(t=>['구현','테스트','운영확인'].includes(t.status)).length,4,'All 4 existing universal member tasks are implemented');
assert.equal(scopeFixture.find(t=>t.id==='TLV5-003').category,'카페방송');
assert.equal(scopeFixture.find(t=>t.id==='TLV5-004').category,'카페방송');
assert.equal(scopeFixture.find(t=>t.id==='TLV5-003').note,'수동 정책 메모');
assert.equal(scopeFixture.find(t=>t.id==='TLV5-004').status,'미검증');
assert.equal(scopeFixture.find(t=>t.id==='TLV5-004').history[0].detail,'수동 보류');
assert.equal(runInContext('alignStoreRoleTasks()',scopeContext),false,'Scope migration must be idempotent');
assert.ok(script.slice(script.indexOf('state=d.state;'),script.indexOf('migrateLinkedPages20261024();',script.indexOf('state=d.state;'))).includes('alignStoreRoleTasks();'),
 'Reloading authoritative D1 ledger must reassign store-only tasks before calculating progress');
assert.ok(script.slice(script.lastIndexOf('migrateSidebarCategories20261024();'),script.lastIndexOf('migrateLinkedPages20261024();')).includes('alignStoreRoleTasks();'),
 'Initial local ledger must match the same store-only scope');
console.log('PASS common member 4/4 after account-type-neutral scope fix; store roles stay in My Cafe with all manual evidence');



const retireContext=createContext({pageRoutes,routeKey:path=>'TLV5-PAGE-'+Array.from(path).map(c=>c.codePointAt(0).toString(16)).join('-'),STAGE_WEIGHT:{'미검증':0,'설계':20,'구현':55,'테스트':80,'운영확인':100,'보류':0}});
runInContext(script.slice(startRetire,endRetire),retireContext);
const sample=[
 {id:'TLV5-DJC-01',category:'DJ센터',title:'DJ 회원',status:'운영확인'},
 {id:'TLV5-055',category:'광고 시청',title:'광고 수익',status:'미검증'},
 {id:'TLV5-NEW',category:'공통 인프라·운영',title:'폐기 항목',status:'폐기'},
 {id:'TLV5-056',category:'카페 월드',title:'사업자 통계',status:'구현'},
 {id:'TLV5-DJLEARN-01',category:'TL 중앙방송센터',title:'TILO 학습',status:'테스트'},
 {id:'TLV5-050',category:'카페방송',title:'카페 방송',status:'설계'}
];
retireContext.sample=sample;
const calculated=runInContext('metrics(sample)',retireContext);
assert.equal(calculated.total,3);assert.equal(calculated.progress,67);assert.equal(calculated.done,2);assert.equal(calculated.verified,0);
assert.ok(runInContext("isRetired({id:routeKey('/dj-center.html'),category:'내 프로필',title:'페이지 검증',status:'미검증'})",retireContext));
assert.ok(script.includes("const active=activeTasks(state.tasks)"));
assert.ok(script.includes("$('showRetired').checked ? isRetired(t) : !isRetired(t)"));
console.log('PASS retired tasks excluded from all metrics; TILO and store retained');

assert.ok(!script.includes("['SPONSOR','스폰서 센터'"));
assert.ok(!script.includes("['ADS','광고 시청'"));
assert.ok(!script.includes("\nmigrateDjCenter20261024();"));
assert.ok(script.includes("['나의 카페','/my-cafe.html']"));
assert.ok(script.includes("['나의 차','/my-car.html']"));
assert.ok(script.includes('migrateLinkedPages20261024();\n  const pagesChanged='));
console.log('PASS current menu names, route mapping, and server ledger sync');

// Both the overview and the category selectors must use one retired filter.
// A second rendering/option loop previously overwrote the filtered result.
assert.equal((script.match(/if\(detail\)/g)||[]).length,1);
const optionLines=script.split('\n').filter(line=>line.includes("$('category').add(new Option"));
assert.equal(optionLines.length,1);
assert.ok(optionLines[0].includes('!retiredCategories.has(c)'));
assert.ok(optionLines[0].includes('categoryLabel(c)'));
console.log('PASS retired categories stay excluded from overview and selectors');


assert.ok(runInContext("isRetired({id:routeKey('/cafe-radio.html'),category:'대시보드',title:'페이지 검증',status:'운영확인'})",retireContext));
assert.ok(!readFileSync(new URL('../public/my-car.html',import.meta.url),'utf8').includes('cafe-radio.html'));
assert.ok(!readFileSync(new URL('../public/incar-studio.html',import.meta.url),'utf8').includes('cafe-radio.html'));
console.log('PASS retired DJ listening excluded; central radio and personal spaces retained');

assert.ok(runInContext("isRetired({id:routeKey('/cafe-access.html'),status:'미검증'})",retireContext));
assert.ok(!runInContext("isRetired({id:routeKey('/my-cafe.html'),status:'미검증'})",retireContext));
assert.ok(runInContext("isRetired({id:'TLV5-WORK-20261027-CONTRIBUTION',status:'구현'})",retireContext));
console.log('PASS removed page records and retired proposed policy are excluded without deleting history');

assert.ok(!pageRoutes['TL 중앙방송센터'].some(([,p])=>p==='/tl-broadcast.html'));
assert.ok(!pageRoutes['카페방송'].some(([,p])=>p==='/cafe-channel.html'));
assert.ok(!pageRoutes['인카방송'].some(([,p])=>p==='/incar-studio.html'));
assert.ok(!pageRoutes['라디오 수신앱']);
assert.ok(script.includes('sidebarPageGroups.map')); 
console.log('PASS obsolete, redirected and future-only pages omitted from page overview');

// Compare the actual sidebar menu entries with the overview, including admin-only links.
const sidebar=readFileSync(new URL('../public/sidebar.js',import.meta.url),'utf8');
const sections=runInContext(sidebar.slice(sidebar.indexOf('var sections = ['),sidebar.indexOf('var groupNames='))+';sections',createContext({}));
const adminBlock=sidebar.slice(sidebar.indexOf("d.innerHTML='<summary>'+t('operations')"),sidebar.indexOf('].map(link)',sidebar.indexOf("d.innerHTML='<summary>'+t('operations')")));
const adminRoutes=[...adminBlock.matchAll(/\['(\/[^']+)'/g)].map(m=>m[1]);
const actual=new Set([...sections.flatMap(section=>section[2].map(item=>item[0])),...adminRoutes]);
const listed=Object.values(pageRoutes).flat().map(([,path])=>path);
assert.equal(listed.length,new Set(listed).size,'sidebar route displayed more than once');
assert.deepEqual([...listed].sort(),[...actual].sort(),'page overview must match current sidebar routes');
console.log('PASS page overview exactly matches current sidebar and admin menu routes');

const sidebarGroups=runInContext(script.slice(script.indexOf('const sidebarPageGroups='),script.indexOf('const routeKey='))+';sidebarPageGroups',createContext({}));
assert.deepEqual(Array.from(sidebarGroups,g=>g[0]),['기본 메뉴','활동 공간','월드','계정과 활동','운영센터']);
assert.deepEqual(Array.from(sidebarGroups.flatMap(g=>g[1].map(i=>i[1]))).sort(),[...actual].sort());
console.log('PASS page overview groups and ordering match visible sidebar');


const adminLedgerHtml=readFileSync(new URL('../public/admin.html',import.meta.url),'utf8');
assert.ok(adminLedgerHtml.includes("['구현','테스트','운영확인'].includes(t.status)"),'admin ledger summary must count implemented and tested tasks');
console.log('PASS admin ledger summary uses implementation completion');


// Actual release manifest must match canonical sidebar categories.
const canonicalCategories=runInContext(script.slice(script.indexOf('const sidebarGroups='),script.indexOf('const categoryLabels='))+';categories',createContext({}));
for(const item of releases.tasks){
 assert.ok(Array.from(canonicalCategories).includes(item.category),item.id+' unknown category '+item.category);
 assert.ok(['미검증','설계','구현','테스트','운영확인','보류'].includes(item.status),item.id+' unknown stage');
}
assert.ok(script.includes("RELEASE_CATEGORY_ALIASES"));
assert.ok(script.includes("releaseImportWarnings.push("));
assert.ok(script.includes("try{releaseChanged=await mergeDevelopmentReleases();}"));
assert.ok(script.includes("catch(error){releaseError=error?.message||String(error);}"));
assert.ok(script.includes("document.querySelector('.workspace')?.setAttribute('hidden','')"));
assert.ok(!script.includes("document.querySelectorAll('main,dialog').forEach(el=>el.hidden=true)"));
console.log('PASS release categories normalized; optional release sync errors cannot blank authorized ledger');


// Removed duplicate My Channels route; historical entries retire automatically.
assert.ok(!sidebar.includes("['/dashboard.html?tab=cafe','generic','channels']"));
assert.ok(!script.includes("['CHANNELS','내 채널'"));
assert.ok(!script.includes("'내 채널':[['내 채널','/dashboard.html?tab=cafe']]"));
assert.ok(!script.includes("['내 채널','/dashboard.html?tab=cafe']"));
assert.ok(runInContext("isRetired({id:'TLV5-NAV-CHANNELS',category:'내 채널',status:'구현'})",retireContext));
assert.ok(runInContext("isRetired({id:routeKey('/dashboard.html?tab=cafe'),category:'내 채널',status:'운영확인'})",retireContext));
assert.ok(!runInContext("isRetired({id:routeKey('/my-cafe.html'),category:'카페방송',status:'운영확인'})",retireContext));
assert.ok(!runInContext("isRetired({id:routeKey('/my-car.html'),category:'인카방송',status:'운영확인'})",retireContext));
const dashboard=readFileSync(new URL('../public/dashboard.html',import.meta.url),'utf8');
assert.ok(!dashboard.includes('id="tab-cafe"'));
assert.ok(!dashboard.includes("onclick=\"switchTab('cafe')\""));
assert.ok(!dashboard.includes("loadCafeTab()"));
assert.ok(dashboard.includes("if(name==='cafe'){location.replace('/my-cafe.html');return;}"));
console.log('PASS My Channels removed from navigation, dashboard and active progress; history preserved');

// Execute the admin summary with the same historical tasks as the full ledger.
// Menu equality alone does not prove that their completion denominators agree.
const summaryCases=[...releases.tasks,...sample,
 {id:'TLV5-NAV-CHANNELS',category:'내 채널',status:'구현'},
 {id:'legacy-channels',category:'내 채널',status:'미검증'},
 {id:'TLV5-056',category:'DJ센터',title:'사업자 통계',status:'구현'},
 {id:'future-app',category:'라디오 수신앱',status:'설계'},
 {id:routeKey('/my-cafe.html'),category:'카페방송',status:'운영확인'}];
retireContext.summaryCases=summaryCases;
const summaryCurrent=runInContext("activeTasks(summaryCases).filter(t=>!String(t.id||'').startsWith('TLV5-PAGE-')&&t.category!=='라디오 수신앱')",retireContext);
const expectedDone=summaryCurrent.filter(t=>['구현','테스트','운영확인'].includes(t.status)).length;
const expectedVerified=summaryCurrent.filter(t=>t.status==='운영확인').length;
const summaryElement={textContent:''};
const summarySource=adminLedgerHtml.slice(adminLedgerHtml.indexOf('/* V5 관리대장 요약'),adminLedgerHtml.indexOf('</script>',adminLedgerHtml.indexOf('/* V5 관리대장 요약')));
await runInContext(summarySource,createContext({document:{getElementById:()=>summaryElement},ADMIN_API:'https://fixture.invalid',getAdminToken:()=> 'fixture',fetch:async()=>({ok:true,json:async()=>({ok:true,version:1,state:{tasks:summaryCases}})})}));
assert.equal(summaryElement.textContent,'서버 개발 완료 '+expectedDone+'/'+summaryCurrent.length+' ('+Math.round(expectedDone/summaryCurrent.length*100)+'%) · 운영확인 '+expectedVerified+'/'+summaryCurrent.length+' · 버전 1','admin summary and full ledger must exclude the same retired tasks');
console.log('PASS actual admin summary/full-ledger completion parity including retired scores and My Channels');

// Run the actual summary DOM rendering, not only its filter helpers.
const renderStart=script.indexOf('function render(){');
const summaryEnd=script.indexOf(' renderNavigation();',renderStart);
assert.ok(renderStart>=0&&summaryEnd>renderStart);
function assertSummaryCards(tasks,expected){
 const elements=new Map();
 const element=id=>{if(!elements.has(id))elements.set(id,{value:'',textContent:'',style:{},querySelector:()=>({textContent:''})});return elements.get(id)};
 const ctx=createContext({$:element,state:{tasks},STAGE_WEIGHT:{'미검증':0,'설계':20,'구현':55,'테스트':80,'운영확인':100,'보류':0},metrics:ts=>{const current=ts.filter(t=>t.retired!==true&&t.category!=='라디오 수신앱'&&!(t.category==='TL 중앙방송센터'&&t.delivery_phase==='future')&&!String(t.id||'').startsWith('TLV5-PAGE-'));return {total:current.length,done:current.filter(t=>['구현','테스트','운영확인'].includes(t.status)).length}},activeTasks:ts=>ts.filter(t=>t.retired!==true),currentScopeTasks:ts=>ts.filter(t=>t.retired!==true&&!(t.category==='TL 중앙방송센터'&&t.delivery_phase==='future')&&t.category!=='라디오 수신앱'),platformTasks:ts=>ts.filter(t=>t.retired!==true&&!(t.category==='TL 중앙방송센터'&&t.delivery_phase==='future')&&t.category!=='라디오 수신앱'&&!String(t.id||'').startsWith('TLV5-PAGE-')),isFutureTilo:t=>t.category==='TL 중앙방송센터'&&t.delivery_phase==='future',isDevelopmentComplete:t=>!!t&&['구현','테스트','운영확인'].includes(t.status),categoryLabel:x=>x,escapeHtml:x=>String(x)});
 runInContext(script.slice(renderStart,summaryEnd)+'}\nrender();',ctx);
 const total=Number(element('total').textContent),done=Number(element('done').textContent),pending=Number(element('active').textContent);
 assert.equal(total,expected.total,'cards must count current functional tasks only');
 assert.equal(done,expected.done,'completion card must use the percentage numerator');
 assert.equal(pending,total-done,'remaining tasks must complement completed tasks');
 assert.equal(element('percent').textContent,(total?Math.round(done/total*100):0)+'%');
 assert.equal(element('progressFill').style.width,element('percent').textContent);
 assert.ok(element('developmentSummary').textContent.includes('개발 완료 '+done+'/'+total+'건'));
 assert.ok(element('developmentSummary').textContent.includes('미완료 '+pending+'건'));
}
const screenshotTasks=[
 ...Array.from({length:132},(_,i)=>({id:'feature-'+i,category:'공통 인프라·운영',status:i<4?'운영확인':i<68?'구현':i<118?'미검증':'설계'})),
 ...Array.from({length:24},(_,i)=>({id:'TLV5-PAGE-'+i,category:'공통 인프라·운영',status:'미검증'})),
 ...Array.from({length:10},(_,i)=>({id:'future-'+i,category:'라디오 수신앱',status:'설계'}))];
assertSummaryCards(screenshotTasks,{total:132,done:68});
assertSummaryCards([{id:'a',status:'구현'},{id:'b',status:'설계'},{id:'c',status:'보류'},{id:'TLV5-PAGE-d',status:'운영확인'},{id:'future',category:'라디오 수신앱',status:'구현'},{id:'retired',retired:true,status:'테스트'}],{total:3,done:1});
assertSummaryCards([],{total:0,done:0});
console.log('PASS actual summary cards: same denominator, completed + remaining = total, screenshot 68/132 = 52%, empty state');
