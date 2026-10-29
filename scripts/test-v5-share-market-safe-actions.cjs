'use strict';
// Catalog IDs and titles are untrusted data. No card HTML may interpolate
// them into executable attributes; actions are delegated through data-sid.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('public/shareplace.html','utf8');
const start=html.indexOf('function bindShareCardEvents(container){');
const end=html.indexOf('// ==================== TL PLAYER ====================',start);
assert.ok(start>0&&end>start,'sharecard renderer boundaries missing');
const source=html.slice(start,end);
const actions=[];
const asset={
  id:'sh_17\'" onmouseover="alert(1)',
  title:'Creator\'s "Song" <img src=x onerror=alert(2)>',
  artist:'Artist <b>Real</b>',
  cover_url:'https://example.test/cover.png',
  content_kind:'tl3',file_type:'audio/tl3',
  duration:60,file_tl:3600,created_at:'2026-10-29'
};
const ctx=vm.createContext({
  _allShares:[asset],_myFileTL:{},_tlShareId:null,_tlPlaying:false,_tlElapsed:0,
  detectType:()=> 'audio',hasTrackPlaybackRoute:()=>true,
  contentKind:()=> 'tl3',updateShareUploadVisibility:()=>{},
  escH:x=>String(x||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'),
  typeLabel:()=> '오디오',
  openShareAsset:id=>actions.push(['open',id]),
  tlPlayCard:btn=>actions.push(['play',btn.getAttribute('data-sid')]),
  chargeTL:(id,title)=>actions.push(['charge',id,title]),
  document:{},console:{warn:()=>{}}
});
vm.runInContext(source,ctx);
for (const [view,renderer] of [['grid','renderGridView'],['list','renderListView']]){
  const container={innerHTML:'',className:'',contains:()=>true};
  ctx[renderer]([asset],container);
  const markup=container.innerHTML;
  assert.ok(markup.includes('data-share-card="sh_17&amp;')===false,'unexpected entity encoding');
  assert.ok(markup.includes('data-share-card="sh_17\'&quot; onmouseover=&quot;alert(1)"'),'untrusted id must remain escaped inside attribute');
  assert.ok(markup.includes('Creator\'s &quot;Song&quot; &lt;img'),'untrusted title must remain text');
  assert.ok(!markup.includes('onclick="openShareAsset('),'card ID must not become inline JS');
  assert.ok(!markup.includes('onclick="tlPlayCard('),'play ID must not become inline JS');
  assert.ok(!markup.includes('onclick="event.stopPropagation();chargeTL('),'title must not become inline JS');
  assert.ok(markup.includes('곡 TL 잔액 조회 중 · TIME FREE 별도'),'unknown balance must remain unverified, not show zero plays');
  assert.ok(markup.includes('playable'),'TIME FREE route must stay playable before per-track TL lookup');
  assert.ok(!markup.includes('0회 가능'),'zero balance must not deny TIME FREE playback');
  ctx._myFileTL[asset.id]=0;
  ctx[renderer]([asset],container);
  assert.ok(container.innerHTML.includes('곡 TL 잔액 0 TL · TIME FREE 별도'),'verified zero balance must display as zero, not block TIME FREE');
  assert.ok(container.innerHTML.includes('playable'),'zero track TL cannot disable authorized TIME FREE navigation');
  ctx._myFileTL[asset.id]=7200;
  ctx[renderer]([asset],container);
  assert.ok(container.innerHTML.includes('곡 TL 잔액 7,200 TL'),'server-returned balance must appear without invented play counts');
  delete ctx._myFileTL[asset.id];

  const card={getAttribute:key=>key==='data-share-card'?asset.id:null,hasAttribute:key=>key==='data-share-card'};
  const play={getAttribute:key=>key==='data-share-action'?'play':key==='data-sid'?asset.id:null};
  const charge={getAttribute:key=>key==='data-share-action'?'charge':key==='data-sid'?asset.id:null};
  const target=(action,c)=>({closest:selector=>selector==='[data-share-action]'?action:c});
  container.onclick({target:target(null,card),stopPropagation(){}});
  container.onclick({target:target(play,card),stopPropagation(){}});
  if(view==='list')container.onclick({target:target(charge,card),stopPropagation(){}});
  container.onkeydown({key:'Enter',target:card,preventDefault(){}});
}
assert.equal(actions.filter(a=>a[0]==='open').length,4,'cards should support pointer and keyboard opens');
assert.equal(actions.filter(a=>a[0]==='play').length,2,'both views must support secure play');
assert.deepEqual(actions.find(a=>a[0]==='charge'),['charge',asset.id,asset.title],
  'list charge must pass original unmodified title via catalog lookup');
console.log('PASS SharePlace grid/list card: escaped IDs/titles, delegated open/play/charge, keyboard routes');
