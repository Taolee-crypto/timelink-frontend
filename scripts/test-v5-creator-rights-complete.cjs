'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const html=fs.readFileSync('public/creator.html','utf8');
const existing=fs.readFileSync('public/creator-existing-registration.js','utf8');
const releases=JSON.parse(fs.readFileSync('public/docs/development-releases.json','utf8'));
for(const id of ['existingRecordingReview','existingRecordingFiles','existingRecordingRole','existingRecordingIsrc','existingRecordingEvidence','existingRecordingConsent','existingRecordingHistory'])
 assert.ok(html.includes('id="'+id+'"'),id+' Creator rights field missing');
assert.match(existing,/files\.length<1\|\|files\.length>10/);
assert.match(existing,/pending_manual_verification/);
assert.match(existing,/공개·재생·정산 승인이 아닙니다/);
assert.match(existing,/\/api\/v5\/music-discovery\//);
assert.ok(!existing.includes('/api/v1/tl3/v5/publish'),'existing-release intake must not auto publish');
for(const path of ['/creator-existing-registration.js','/creator-contributors.js'])
 assert.ok(html.includes(path),'Creator module missing '+path);
for(const id of [
 'TLV5-014','TLV5-RIGHTS-01','TLV5-RIGHTS-02','TLV5-RIGHTS-06','TLV5-NAV-CREATOR',
 'TLV5-PAGE-2f-63-72-65-61-74-6f-72-2e-68-74-6d-6c'
]){
 const task=releases.tasks.find(t=>t.id===id);assert.ok(task,id+' evidence missing');
 assert.equal(task.status,'테스트');assert.equal(task.release_evidence,true);
}
console.log('PASS Creator rights ledger evidence: separated intake, 10-file private review, explicit rights fields, no auto publish, tested ledger IDs');
