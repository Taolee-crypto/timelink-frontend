const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('public/admin.html','utf8');
const start=html.indexOf('async function loadRevenue'),end=html.indexOf('// ─ Session Restore:',start);
assert.ok(start>=0&&end>start,'Revenue script boundaries not found');
const source=html.slice(start,end);
const nodes={};const g=id=>nodes[id]??={textContent:'',innerHTML:''};
let ok=true;const data={ok:true,ledger_version:'V5',note:'환불 확인 필요',revenue:{total_krw:300000,today_krw:300000,month_krw:300000,week_krw:300000,pay_count:3,total_tl_sold:300000,bonus_tl:45000,platform_revenue_tl:700,confirmed_live_krw:0,unclassified_krw:300000,refund_krw:null,net_cash_krw:null},excluded:{test:{krw:0},virtual:{krw:0}},refund_status_records:0,recent_payments:[{created_at:'2026-10-25 06:00:00',user_id:'33',method:'toss',amount_krw:100000,tl_granted:115000,bonus_tl:15000,payment_mode:'unknown'}],daily_revenue:[{day:'2026-10-25',krw:300000}]};
const ctx={API:'',getAdminToken:()=> 'token',g,esc:x=>String(x).replaceAll('<','&lt;'),fetch:async()=>({ok,json:async()=>ok?data:{error:'unavailable'}})};vm.createContext(ctx);vm.runInContext(source,ctx);
(async()=>{
await ctx.loadRevenue();assert.equal(g('rv-total-krw').textContent,'300,000원');assert.equal(g('rv-tl-sold').textContent,'300,000 TL');assert.equal(g('rv-bonus-tl').textContent,'보너스 TL_B 45,000 TL');assert.ok(g('revSummaryBody').innerHTML.includes('확인 필요'));assert.ok(g('revPayBody').innerHTML.includes('100,000 TL / 15,000 TL'));
ok=false;await ctx.loadRevenue();assert.equal(g('rv-total-krw').textContent,'확인 불가');assert.ok(!g('revPayBody').innerHTML.includes('100,000'));console.log('PASS: cash/TL/bonus separation, unknown refunds, stale-data clearing');
})().catch(e=>{console.error(e);process.exitCode=1});
