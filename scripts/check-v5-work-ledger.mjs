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
assert.ok(script.includes("!String(t.id||'').startsWith('TLV5-PAGE-')&&t.category!=='라디오 수신앱'"));
assert.ok(script.includes("['구현','테스트','운영확인'].includes(t.status)"));
console.log('PASS development progress: server-first merge, manual edits retained, repeat-safe releases and progress bar');

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
