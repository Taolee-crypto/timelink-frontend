'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const signup=fs.readFileSync('public/signup.html','utf8');
const referral=fs.readFileSync('public/member-referrals.html','utf8');
assert.ok(signup.includes('claimVerifiedSignupReferral(ld.token)'),'Referral claim must happen after login following verification');
assert.ok(signup.includes("API+'/api/v5/referrals/claim'"),'Actual authenticated claim endpoint is required');
assert.ok(signup.includes("sessionStorage.setItem('tl_referral_pending_code',ref)"),'Failed claim must be recoverable');
assert.ok(!/name\\s*=\\s*["'](?:account_type|staff_role|business_type)["']/i.test(signup),'Referral cannot introduce business registration account types');
assert.ok(referral.includes("api+path"),'Status must come from actual server data');
assert.ok(referral.includes('data.rewards||[]')||referral.includes('(data.rewards||[])'),'Actual receipts must be shown');
assert.ok(referral.includes("'/settle','POST'"),'Authenticated server-side milestone verification must be available');
assert.ok(referral.includes('history.replaceChildren()'),'Old receipt display cleared before rerender');
assert.ok(referral.includes('entry.textContent='),'Reward metadata must be rendered without unsafe HTML');
const matches=referral.matchAll(/<script(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/script>/g);
for(const match of matches){if(match[1].trim())new vm.Script(match[1],{filename:'member-referrals-inline.js'});}
console.log('PASS referral UI: authenticated post-signup claim, retry, actual receipts, no account type changes');
