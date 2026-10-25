const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const widget=fs.readFileSync('public/creator-earnings.js','utf8');
async function widgetTest(){
 let token='fixture',count=0,fail=false,data={ok:true,ledger_version:'V5',summary:{earned_tl:1.2345,self_play_held_tl:5,pending_request_count:0},tracks:[{file_id:10,title:'<Unsafe title>',artist:'Fixture',earned_tl:1.2345,last_earned_at:'2026-10-25 10:00:00'}],requests:[],as_of:'2026-10-25T10:00:00Z'};
 const root={innerHTML:'',querySelector:()=>({onclick:null})},total={textContent:''};
 const context={window:{},document:{hidden:false,querySelectorAll:s=>s==='[data-creator-earnings]'?[root]:[total],addEventListener(){}},localStorage:{getItem:()=>token},AbortSignal,Date,Number,String,Array,Object,JSON,setInterval(){},fetch:async()=>{count++;return {ok:!fail,json:async()=>fail?{ok:false,error:'fixture failure'}:data}}};
 vm.createContext(context);vm.runInContext(widget,context);
 for(let i=0;i<8;i++)await Promise.resolve();
 assert.ok(root.innerHTML.includes('1.2345'));assert.ok(root.innerHTML.includes('&lt;Unsafe title&gt;'));assert.ok(!root.innerHTML.includes('<Unsafe title>'));
 assert.equal(total.textContent,'1.2345 TL');
 data={...data,summary:{...data.summary,earned_tl:2.5}};await context.window.TimeLinkCreatorEarnings.refresh();
 assert.ok(root.innerHTML.includes('새 수익 +1.2655 TL'));
 fail=true;await context.window.TimeLinkCreatorEarnings.refresh();assert.ok(root.innerHTML.includes('fixture failure'));assert.ok(!root.innerHTML.includes('누적 창작 수익'));
 token='';const before=count;await context.window.TimeLinkCreatorEarnings.refresh();assert.equal(count,before);assert.ok(root.innerHTML.includes('로그인'));
 fail=false;token='ownerA';let release;context.fetch=()=>new Promise(r=>release=r);const pending=context.window.TimeLinkCreatorEarnings.refresh();token='ownerB';release({ok:true,json:async()=>data});await pending;
 assert.ok(root.innerHTML.includes('계정이 변경'));assert.ok(!root.innerHTML.includes('2.5'));
 console.log('PASS creator widget: real amounts and delta, escaped song names, explicit API failure, logged-out no-fetch and account-switch isolation');
}
async function adminTest(){
 const html=fs.readFileSync('public/admin.html','utf8');
 assert.ok(!html.includes('class="main"'));assert.ok(!html.includes('/renewal/renewal.js'));assert.equal((html.match(/id="panel-payout"/g)||[]).length,1);
 for(const s of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(s[1].trim())new Function(s[1]);
 const code=html.slice(html.indexOf('var payoutCreatorRows=[]'),html.indexOf('function openPayoutModal('));
 const nodes=new Map(),g=id=>{if(!nodes.has(id))nodes.set(id,{value:'',textContent:'',innerHTML:'',classList:{contains:()=>false}});return nodes.get(id)};
 let reads=0,fail=false;
 const context={g,ADMIN_API:'https://fixture',getAdminToken:()=> 'fixture',esc:s=>String(s).replace(/</g,'&lt;'),document:{hidden:false},setInterval(){},Date,Number,String,Array,
 paginate:(id,rows,render)=>g(id).innerHTML=rows.map(render).join(''),fetch:async()=>({ok:!fail,status:fail?503:200,json:async()=>{reads++;return fail?{ok:false,error:'fixture unavailable'}:{ok:true,ledger_version:'V5',platform:{music_revenue_tl:90},summary:{earned_tl:140,personal_display_tl:210,self_play_held_tl:70,pending_request_count:0},creators:[{id:1,username:'Admin Creator',email:'admin@fixture',track_count:1,total_earned:35,personal_display_tl:105,self_play_held_tl:70,reported_paid_tl:0,payout_verified:true,tl_balance:1000,tracks:[{title:'Song',earned_tl:35}]}],requests:[],warnings:[],as_of:'2026-10-25T10:00:00Z'}}})};
 vm.createContext(context);vm.runInContext(code,context);await context.loadPayout();
 assert.equal(reads,1);assert.equal(g('po-company').textContent,'90 TL');assert.equal(g('po-total-earned').textContent,'210 TL');assert.ok(g('po-creators-tbody').innerHTML.includes('Admin Creator'));assert.ok(g('po-creators-tbody').innerHTML.includes('Song'));
 fail=true;await context.loadPayout();assert.equal(reads,2);assert.equal(g('po-total-earned').textContent,'확인 불가');
 assert.ok(g('po-status').textContent.includes('fixture unavailable'));
 console.log('PASS admin earnings: independent shell, one payout panel, company/creator/held separation, per-song detail and honest API failure');
}
(async()=>{await widgetTest();await adminTest()})().catch(e=>{console.error(e);process.exitCode=1});
