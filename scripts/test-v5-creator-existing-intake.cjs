'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('public/creator.html','utf8');
const js=fs.readFileSync('public/creator-existing-registration.js','utf8');
const css=fs.readFileSync('public/creator-existing-registration.css','utf8');
for(const k of ['existingRecordingReview','existingRecordingFiles','existingRecordingRole','existingRecordingEvidence','existingRecordingConsent','existingRecordingSubmit','existingRecordingHistory'])
 assert.ok(html.includes('id="'+k+'"'),k+' Creator field required');
assert.ok(html.includes('/creator-existing-registration.js'));
assert.ok(html.includes('/creator-existing-registration.css'));
assert.ok(css.includes('@media(max-width:700px)'),'mobile layout required');
assert.ok(js.includes('/api/v5/music-discovery/'),'call actual mounted private intake endpoint');
assert.ok(!js.includes('/api/v5/music/discovery/'),'do not call a non-existent route');
assert.ok(js.includes("status:'pending_rights'")||js.includes('pending_manual_verification'),'never treat intake as rights approval');
assert.ok(!js.includes('/api/v1/tl3/v5/publish'),'intake cannot auto publish a TL3');
const elements={},create=()=>({textContent:'',value:'',disabled:false,checked:false,handlers:{},children:[],addEventListener(n,fn){this.handlers[n]=fn},append(...els){this.children.push(...els)},replaceChildren(){this.children=[]}});
for(const id of ['existingRecordingReview','existingRecordingFiles','existingRecordingRole','existingRecordingArtist','existingRecordingIsrc','existingRecordingEvidence','existingRecordingConsent','existingRecordingSubmit','existingRecordingRefresh','existingRecordingStatus','existingRecordingHistory'])
 elements[id]=create();
let access='userA',posts=[],history=0;
const files=[{name:'Song A.mp3',size:5000},{name:'Song B.flac',size:9000}];
elements.existingRecordingFiles.files=files;
elements.existingRecordingRole.value='recording_owner';
elements.existingRecordingArtist.value='창작자';
elements.existingRecordingConsent.checked=true;
const ctx=vm.createContext({
 document:{getElementById:id=>elements[id],createElement:()=>create()},
 localStorage:{getItem:key=>key==='tl_token'?access:null},
 crypto:{randomUUID:()=> '11111111-2222-3333-4444-555555555555'},
 FormData:class {constructor(){this.fields={}}append(k,v){this.fields[k]=v}},
 console:{warn(){}},
 fetch:async (url,opt={})=>{
  if(!url.endsWith('/api/v5/music-discovery/'))throw Error('incorrect route '+url);
  if(opt.method==='POST'){posts.push(opt);return {ok:true,json:async()=>({ok:true,replayed:false,registration:{status:'pending_rights'}})};}
  history++;return {ok:true,json:async()=>({ok:true,registrations:[]})};
 }
});
vm.runInContext(js,ctx);
(async()=>{
 await elements.existingRecordingSubmit.handlers.click();
 assert.equal(posts.length,2,'two selected songs should make exactly two private submissions');
 const batch=posts[0].body.fields.batch_id;
 assert.equal(batch,posts[1].body.fields.batch_id,'all tracks must use one review batch');
 assert.match(batch,/^[A-Za-z0-9_-]{8,80}$/);
 assert.equal(posts[0].body.fields.file.name,'Song A.mp3');
 assert.equal(posts[1].body.fields.file.name,'Song B.flac');
 assert.equal(JSON.parse(posts[0].body.fields.metadata).rights_role,'recording_owner');
 assert.equal(JSON.parse(posts[0].body.fields.metadata).acknowledgement,'pending_manual_verification');
 assert.ok(history>=2,'history must refresh after successful submissions');
 assert.equal(elements.existingRecordingFiles.value,'');
 assert.match(elements.existingRecordingStatus.textContent,/신규 2곡 신청 완료/);
 assert.match(elements.existingRecordingStatus.textContent,/공개·재생·정산 승인이 아닙니다/);

 elements.existingRecordingFiles.files=Array.from({length:11},(_,i)=>({name:'x'+i+'.mp3',size:3000}));
 await elements.existingRecordingSubmit.handlers.click();
 assert.equal(posts.length,2,'over ten must fail before uploading');
 assert.match(elements.existingRecordingStatus.textContent,/1~10곡/);
 elements.existingRecordingFiles.files=[{name:'over.mp3',size:20*1024*1024+1}];
 await elements.existingRecordingSubmit.handlers.click();
 assert.equal(posts.length,2);
 assert.match(elements.existingRecordingStatus.textContent,/20MB/);
 elements.existingRecordingFiles.files=[{name:'doc.txt',size:50}];
 await elements.existingRecordingSubmit.handlers.click();
 assert.equal(posts.length,2);
 elements.existingRecordingConsent.checked=false;
 elements.existingRecordingFiles.files=files;
 await elements.existingRecordingSubmit.handlers.click();
 assert.equal(posts.length,2,'must require rights-review declaration');
 elements.existingRecordingConsent.checked=true;
 elements.existingRecordingEvidence.value='http://unsafe.example';
 await elements.existingRecordingSubmit.handlers.click();
 assert.equal(posts.length,2,'only HTTPS evidence accepted');
 access='';
 elements.existingRecordingEvidence.value='';
 await elements.existingRecordingSubmit.handlers.click();
 assert.equal(posts.length,2,'unauthenticated submit must fail closed');
 console.log('PASS Creator existing release 10-file cap, HTTPS rights evidence, owner declaration, private encrypted review POST and history');
})().catch(e=>{console.error(e);process.exitCode=1;});
