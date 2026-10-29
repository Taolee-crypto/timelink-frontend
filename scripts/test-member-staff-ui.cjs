'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('public/cafe-staff-manage.html','utf8');
const entry=fs.readFileSync('public/my-cafe.html','utf8');
const script=fs.readFileSync('public/cafe/staff-manager.js','utf8');

assert.match(html,/id="ownerWorkspace"/);
assert.match(html,/id="staffList"/);
assert.match(html,/id="issueInvite"/);
assert.match(html,/\/cafe\/staff-manager\.js/);
assert.match(entry,/<a[^>]*class="[^"]*hidden"[^>]*id="staffManage"/);
assert.match(entry,/getElementById\('staffManage'\)\.classList\.remove\('hidden'\)/);
new vm.Script(script,{filename:'staff-manager.js'});

function node(tag='div') {
  return {
    tag,children:[],handlers:{},style:{},value:'',textContent:'',hidden:true,disabled:false,href:'',
    classList:{toggle() {},add(){},remove(){}},
    appendChild(child){this.children.push(child);return child},
    replaceChildren(...children){this.children=children},
    addEventListener(event,handler){this.handlers[event]=handler}
  };
}
function setup({auth=true,empty=false,deny=false}={}) {
  const elements=new Map(),calls=[],members=[
    {id:51,user_id:2,username:'helper',email:'helper@example.invalid',status:'pending'},
    {id:52,user_id:3,username:'former',email:'former@example.invalid',status:'revoked'}
  ];
  const el=(id)=>{if(!elements.has(id))elements.set(id,node());return elements.get(id)};
  const ctx={
    localStorage:{getItem(key){return auth&&key==='tl_token'?'fixture-token':null}},
    document:{getElementById:el,createElement:node,createTextNode(text){return node('#text')}},
    window:{TL3_API_BASE:'https://api.fixture.invalid',confirm:()=>true},
    location:{search:'',href:'https://site.fixture.invalid/cafe-staff-manage.html'},
    navigator:{clipboard:{writeText:async()=>{}}},
    URLSearchParams,Number,String,Date,console,
    fetch:async (url,options={})=>{
      calls.push({url,method:options.method||'GET',headers:options.headers||{}});
      if(deny)return response(403,{ok:false,error:'권한이 없습니다'});
      if(url.endsWith('/api/cafe/my-channels'))return response(200,{ok:true,channels:empty?[]:[{channel_id:'cafe01',name:'테스트 카페'}]});
      if(url.endsWith('/api/cafe/channels/cafe01/staff')&&(!options.method||options.method==='GET'))return response(200,{ok:true,staff:members.map(x=>({...x}))});
      if(url.endsWith('/api/cafe/channels/cafe01/staff/invites'))return response(200,{ok:true,invite_code:'ABCD2345',expires_at:Date.now()+86400000,max_uses:10});
      if(url.endsWith('/api/cafe/channels/cafe01/staff/51/approve')){members[0].status='active';return response(200,{ok:true})}
      if(url.endsWith('/api/cafe/channels/cafe01/staff/51')&&options.method==='DELETE'){members[0].status='revoked';return response(200,{ok:true})}
      return response(404,{ok:false,error:'예상하지 않은 경로'});
    }
  };
  vm.runInNewContext(script,ctx,{filename:'staff-manager.js',timeout:1500});
  return {el,calls,members};
}
function response(status,body){return {ok:status>=200&&status<300,status,json:async()=>body}}
async function settle(){for(let i=0;i<6;i++)await new Promise(resolve=>setImmediate(resolve))}
function firstButton(parent,label){
  for(const row of parent.children||[])for(const actions of row.children||[])for(const control of actions.children||[])if(control.tag==='button'&&control.textContent===label)return control;
  return null;
}
(async()=>{
  const noAuth=setup({auth:false});await settle();
  assert.equal(noAuth.calls.length,0,'Unauthenticated owner UI must not call staff APIs');
  assert.ok(noAuth.el('pageStatus').textContent.includes('로그인'));
  const none=setup({empty:true});await settle();
  assert.equal(none.el('emptyWorkspace').hidden,false,'No-channel owners receive an opening route');
  const denied=setup({deny:true});await settle();
  assert.ok(denied.el('pageStatus').textContent.includes('권한'),'Backend refusal must not unlock owner controls');

  const app=setup();await settle();
  assert.equal(app.el('ownerWorkspace').hidden,false);
  assert.equal(app.el('channelSelect').value,'cafe01');
  assert.ok(app.calls.some(c=>c.url.endsWith('/api/cafe/channels/cafe01/staff')));
  assert.ok(app.calls.every(c=>c.headers.Authorization==='Bearer fixture-token'),'All API calls must use member authorization');
  assert.ok(firstButton(app.el('staffList'),'승인'),'Pending member must have an approve action');
  assert.equal(app.el('staffList').children.length,2);
  const issue=app.el('issueInvite');
  await issue.handlers.click();await settle();
  assert.equal(app.el('inviteCode').textContent,'ABCD2345');
  assert.equal(app.el('inviteResult').hidden,false);
  const approve=firstButton(app.el('staffList'),'승인');
  await approve.handlers.click();await settle();
  assert.equal(app.members[0].status,'active');
  assert.equal(firstButton(app.el('staffList'),'승인'),null,'Approved member cannot be approved twice');
  const revoke=firstButton(app.el('staffList'),'권한 회수');
  await revoke.handlers.click();await settle();
  assert.equal(app.members[0].status,'revoked');
  assert.equal(firstButton(app.el('staffList'),'권한 회수'),null,'Revoked member cannot still be revoked');
  assert.ok(app.calls.some(c=>c.method==='POST'&&c.url.endsWith('/51/approve')));
  assert.ok(app.calls.some(c=>c.method==='DELETE'&&c.url.endsWith('/51')));
  console.log('PASS TLV5-004 owner staff UI: unauthenticated, no-store, denied, invite, approve, revoke, API authorization');
})().catch(e=>{console.error(e);process.exitCode=1});
