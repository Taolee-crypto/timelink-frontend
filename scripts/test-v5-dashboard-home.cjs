'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('public/dashboard.html','utf8');
const portal=fs.readFileSync('public/timelink.html','utf8');

function part(from,to){
  const i=html.indexOf(from),j=html.indexOf(to,i+from.length);
  assert.ok(i>=0&&j>i,'missing '+from);return html.slice(i,j);
}
const src=part('var _dashboardCatalogRun=0;','// ═══════════════════════════════════════════\n// 초기화');

class El{
  constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.textContent='';this.className='';this.href='';this.attributes={};}
  appendChild(x){this.children.push(x);return x}
  append(...xs){this.children.push(...xs)}
  replaceChildren(...xs){this.children=[...xs]}
  setAttribute(k,v){this.attributes[k]=String(v)}
  addEventListener(type,fn){this['on'+type]=fn}
}
const nodes={tlHomeMusic:new El('div')};
const document={createElement:tag=>new El(tag),getElementById:id=>nodes[id]||null};
let mode='success',calls=[];
const mock={
  document,location:{origin:'https://www.timelink.digital'},URL,encodeURIComponent,
  API:'https://api.timelink.digital',AbortController,setTimeout,clearTimeout,Date,
  g:id=>nodes[id]||null,console,
  fetch:async(url)=>{
    calls.push(url);
    if(mode==='error')return {ok:false,status:503,json:async()=>({})};
    return {ok:true,status:200,json:async()=>({shares:[
      {id:1,share_id:'tl3_new',content_kind:'tl3',title:'새 음악',artist:'창작자',created_at:'2026-10-31T00:00:00Z',cover_url:'/images/renewal/vinyl-collection-card.jpg'},
      {id:2,content_kind:'mp3',title:'제외 원본',created_at:'2026-10-31T01:00:00Z'}
    ]})};
  }
};
const context=vm.createContext(mock);
vm.runInContext(src,context);
(async()=>{
  assert.equal(await context.loadDashboardDiscovery(),true);
  assert.equal(calls[0],'https://api.timelink.digital/api/shares?limit=24&offset=0');
  assert.equal(nodes.tlHomeMusic.attributes['aria-busy'],'false');
  assert.equal(nodes.tlHomeMusic.children.length,1,'only public TL3 is shown');
  const card=nodes.tlHomeMusic.children[0];
  assert.equal(card.className,'tl-music-card');
  assert.equal(card.href,'/track.html?id=tl3_new');
  assert.equal(card.children[1].textContent,'새 음악');
  assert.equal(card.children[2].textContent,'창작자');
  mode='error';calls=[];assert.equal(await context.loadDashboardDiscovery(),false);
  const state=nodes.tlHomeMusic.children[0];
  assert.equal(state.className,'tl-message');
  assert.match(state.children[0].textContent,/불러오지 못했습니다/);
  assert.equal(state.children[1].textContent,'다시 불러오기');
  assert.equal(state.children[2].href,'/shareplace.html');

  for(const route of ['/shareplace.html','/creator.html','/radio.html','/cafe-world.html','/my-car-world.html'])
    assert.ok(html.includes('href="'+route+'"')||html.includes("href='"+route+"'"),'missing dashboard route '+route);
  assert.match(html,/fetchServerBalance\(\);loadDashboardDiscovery\(\)/);
  assert.match(html,/loadShares\(\)/);
  assert.match(portal,/창작활동이 경제활동이 되는 곳\./);
  for(const route of ['/new-asset.html','/radio.html','/world-network.html','/download.html'])
    assert.ok(portal.includes('href="'+route+'"')||portal.includes("href='"+route+"'"),'missing TimeLink portal route '+route);
  console.log('PASS dashboard home: real TL3 discovery, safe card route, retry state, wallet/content startup and major entry routes');
})().catch(e=>{console.error(e);process.exitCode=1});
