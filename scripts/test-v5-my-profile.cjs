'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('public/my-profile.html','utf8');
const releases=JSON.parse(fs.readFileSync('public/docs/development-releases.json','utf8'));
const script=html.match(/<script>\s*const API='https:\/\/api\.timelink\.digital';[\s\S]*?<\/script>/)?.[0];
assert.ok(script,'profile controller missing');
const js=script.slice(8,-9);
new vm.Script(js);
for(const expected of [
 "function currentToken()","cache:'no-store'","loadSeq","token!==currentToken()","loadedUserId",
 "saveButton.disabled=true","window.addEventListener('storage'","location.replace('/login.html')"
]) assert.ok(js.includes(expected),'profile safety contract missing '+expected);
assert.match(html,/id="email" readonly/);
assert.match(html,/maxlength="80"/);
assert.match(html,/maxlength="1000"/);
assert.doesNotMatch(js,/const token=localStorage\.getItem/,'profile must not freeze login token at page load');
for(const id of ['TLV5-NAV-PROFILE','TLV5-PAGE-2f-6d-79-2d-70-72-6f-66-69-6c-65-2e-68-74-6d-6c']){
 const task=releases.tasks.find(t=>t.id===id);assert.ok(task,id+' ledger evidence missing');
 assert.equal(task.status,'테스트');assert.equal(task.release_evidence,true);
}
console.log('PASS my-profile: live auth token, account-switch race guard, no-store fetch, save lock, readonly email and bounded fields');
