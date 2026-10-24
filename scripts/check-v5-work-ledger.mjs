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
