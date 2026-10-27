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
const merge=script.slice(script.indexOf('async function mergeDevelopmentReleases(){'),script.indexOf('async function loadServerWorkLedger(){'));
const manual={...releases.tasks[0],status:'보류',note:'관리자 검토 중',history:[{detail:'수동 수정'}]};
const context=createContext({state:{tasks:[manual,{id:'old-market',category:'공유플레이스',status:'구현'}],events:[]},categories:[...new Set(releases.tasks.map(t=>t.category))],STAGE_WEIGHT:{'미검증':0,'설계':20,'구현':55,'테스트':80,'운영확인':100,'보류':0},clone:o=>JSON.parse(JSON.stringify(o)),fetch:async()=>({ok:true,json:async()=>releases})});
runInContext(merge,context);
assert.equal(await runInContext('mergeDevelopmentReleases()',context),true);
assert.equal(context.state.tasks[0].status,'보류');assert.equal(context.state.tasks[0].note,'관리자 검토 중');
assert.equal(context.state.tasks[1].category,'공유 마켓');
assert.equal(context.state.tasks.length,releases.tasks.length+1);
assert.equal(await runInContext('mergeDevelopmentReleases()',context),false);
assert.equal(context.state.events.length,releases.events.length);
assert.ok(script.indexOf('const releaseChanged=await mergeDevelopmentReleases()')>script.indexOf('state=d.state;'));
assert.ok(script.includes('const pct=allMetrics.progress;'));
console.log('PASS development progress: server-first merge, manual edits retained, repeat-safe releases and progress bar');

const startRetire=script.indexOf('const retiredIds='),endRetire=script.indexOf('const commonCategories=',startRetire);
assert.ok(startRetire>=0&&endRetire>startRetire);
const retireContext=createContext({routeKey:path=>'TLV5-PAGE-'+Array.from(path).map(c=>c.codePointAt(0).toString(16)).join('-'),STAGE_WEIGHT:{'미검증':0,'설계':20,'구현':55,'테스트':80,'운영확인':100,'보류':0}});
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
assert.equal(calculated.total,3);assert.equal(calculated.progress,52);assert.equal(calculated.done,0);
assert.ok(runInContext("isRetired({id:routeKey('/dj-center.html'),category:'내 프로필',title:'페이지 검증',status:'미검증'})",retireContext));
assert.ok(script.includes("const active=activeTasks(state.tasks)"));
assert.ok(script.includes("$('showRetired').checked ? isRetired(t) : !isRetired(t)"));
console.log('PASS retired tasks excluded from all metrics; TILO and store retained');
