const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('public/cafe/space.js','utf8');
function fixture({fail=false,token='member'}={}){
 const nodes=new Map(),writes=[];
 function element(){return {value:'',textContent:'',hidden:false,disabled:false,children:[],files:[],append(...n){this.children.push(...n)},replaceChildren(){this.children=[]},setAttribute(){},get selectedOptions(){return this.children.filter(n=>n.value===this.value)}}}
 const node=id=>{if(!nodes.has(id))nodes.set(id,element());return nodes.get(id)};
 const channel={channel_id:'c1',name:'온기 카페',addr:'서울',description:'오늘의 커피',images:JSON.stringify(['https://example.org/one.jpg','javascript:alert(1)','https://example.org/two.jpg'])};
 const ctx={document:{getElementById:node,createElement:element},window:{addEventListener(){}},location:{origin:'https://site.local',search:''},localStorage:{getItem:()=>token},URL,URLSearchParams,Image:class{},confirm:()=>true,fetch:async(url,options)=>{if(options.method==='PUT'){writes.push(JSON.parse(options.body));return {ok:!fail,json:async()=>({ok:!fail,error:fail?'서버 오류':undefined})}}return {ok:true,json:async()=>({ok:true,channels:[channel]})}},createImageBitmap:async()=>{throw Error('not used')}};
 node('editorFields').disabled=true;vm.runInNewContext(source,ctx);return {node,writes};
}
(async()=>{const f=fixture();await new Promise(setImmediate);assert.equal(f.node('nameInput').value,'온기 카페');assert.equal(f.node('cafeCover').src,'https://example.org/one.jpg');assert.equal(f.node('photoEditor').children.length,2);assert.equal(f.node('editorFields').disabled,false);
 f.node('nameInput').value='온기, 두 번째 이야기';f.node('nameInput').oninput();assert.equal(f.node('cafeName').textContent,'온기, 두 번째 이야기');
 f.node('photoEditor').children[1].children[1].onclick();assert.equal(f.node('cafeCover').src,'https://example.org/two.jpg');
 await f.node('cafeForm').onsubmit({preventDefault(){}});assert.equal(f.writes.length,1);assert.deepEqual(Object.keys(f.writes[0]).sort(),['description','images','name']);assert.equal(f.writes[0].images[0],'https://example.org/two.jpg');assert.match(f.node('cafeFeedback').textContent,/저장했습니다/);
 const bad=fixture({fail:true});await new Promise(setImmediate);await bad.node('cafeForm').onsubmit({preventDefault(){}});assert.match(bad.node('cafeFeedback').textContent,/저장하지 못했습니다/);assert.equal(bad.node('editorFields').disabled,false);
 const guest=fixture({token:''});await new Promise(setImmediate);assert.equal(guest.node('editorFields').disabled,true);assert.match(guest.node('setupLink').href,/login/); // No authenticated form enable path runs for guests; markup starts disabled.
 const html=fs.readFileSync('public/cafe-studio.html','utf8');assert.match(html,/<fieldset id="editorFields" disabled/);for(const removed of ['staffPanel','storeDjScheduler','cafeDjPanel'])assert.ok(!html.includes(removed));
 console.log('PASS cafe editor: persisted profile loading, safe images, live preview, representative reorder, real PUT payload, save failure recovery, guest login, removed operations clutter');
})().catch(e=>{console.error(e);process.exitCode=1});
