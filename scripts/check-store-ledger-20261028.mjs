import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const ledger=JSON.parse(readFileSync(new URL('../public/docs/development-releases.json',import.meta.url),'utf8'));
const required={
 'TLV5-WORK-20261028-STORE-PRICE':'구현',
 'TLV5-WORK-20261028-STORE-CHECKOUT':'설계',
 'TLV5-WORK-20261028-MEMBER-REFERRAL':'구현',
 'TLV5-WORK-20261028-REFERRAL-REWARD':'설계'
};
for(const [id,status] of Object.entries(required)){
 const matches=ledger.tasks.filter(t=>t.id===id);
 assert.equal(matches.length,1,'missing or duplicated ledger task: '+id);
 assert.equal(matches[0].status,status,'unverified completion status: '+id);
 assert.ok(matches[0].note.length>40,'missing implementation evidence: '+id);
}
assert.ok(ledger.events.some(e=>e.id==='release-store-ledger-20261028'));
console.log('PASS store pricing, checkout, referrals and rewards tracked separately in V5 ledger');
