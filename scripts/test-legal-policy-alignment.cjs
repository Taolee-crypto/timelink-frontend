'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const read=p=>fs.readFileSync('public/'+p,'utf8');
const terms=read('terms.html'),privacy=read('privacy.html'),
  creator=read('creator-policy.html'),economy=read('economy-policy.html'),
  footer=read('_shared/footer.js'),legalJs=read('legal-notice-config.js');
const config=JSON.parse(read('docs/legal-notice-config.json'));
assert.equal(config.group_name_ko,'틸로그룹');
assert.equal(config.group_name_en,'TILO Group');
assert.equal(config.country_company_naming,'틸로 + 국가명');
assert.equal(config.korean_entity,'(주)틸로코리아');
assert.equal(config.contracted_legal_entity,null,'Group name is not proof of contracting entity');
assert.equal(config.korean_legal.business_registration_number,null);
assert.equal(config.terms.effective_date,null);
assert.equal(config.privacy_notice.effective_date,null);
for(const [name,s] of Object.entries({terms,privacy,creator,economy})){
 for(const outdated of ['씨엠피 주식회사','Google IMA SDK','광고TL','영업 매니저','DJ 프로그램','광고 노출 기록']){
   assert.ok(!s.includes(outdated),name+' still has retired policy wording: '+outdated);
 }
 assert.ok(!s.includes('구매TL 소비의 <strong>62%</strong>'),name+' old 62% payout');
 assert.ok(!s.includes('구매TL 소비의 <strong>45%</strong>'),name+' old 45% payout');
 if(name!=='privacy')assert.ok(s.includes('70%'),name+' must preserve 70% rights policy');
}
for(const s of [terms,privacy,footer]){
 assert.ok(s.includes('틸로그룹'), 'Corporate naming must say TILO Group');
 assert.ok(s.includes('(주)틸로코리아'),'Korean company must be explicitly named');
 assert.ok(!s.includes('주식회사 틸로 ·'),'Former incorrect holding legal entity must be removed');
}
assert.ok(terms.includes('틸로 + 국가명'));
assert.ok(privacy.includes('틸로 + 국가명'));
assert.ok(terms.includes('법률 최종 확인 전'));
assert.ok(privacy.includes('법정 검토 완료로 표시하지 않습니다'));
for(const [name,s] of Object.entries({terms,privacy})){
 assert.ok(s.includes('legal-notice-config.js'),name+' must load editable legal fields');
 const keys=[...s.matchAll(/data-legal-key="([^"]+)"/g)].map(x=>x[1]);
 assert.ok(keys.length>=3,name+' should expose editable disclosure placeholders');
 for(const key of keys){const parts=key.split('.');let v=config;for(const part of parts)v=v?.[part];assert.ok(v!==undefined,name+' missing config field '+key);}
}
assert.ok(creator.includes('href="/creator.html" class="back"'),'Creator policy must return to creator studio');
assert.ok(creator.includes('창작자에게 현금성 정산으로 지급된 TL_P는 구매자의 환불기간에 따른 전환 대상이 아닙니다.'),'Purchased TL_P maturity must never convert creator royalty TL_P');
assert.ok(creator.includes('법적 환급권이 종료된 뒤'),'Purchaser TL_P maturity must not imply an arbitrary 7-day expiry');
assert.ok(read('creator.html').includes('href="/creator-policy.html"'),'Creator rights intake must link to rights/settlement policy');
assert.ok(!footer.includes("['/advertiser.html'"),'Retired advertiser link forbidden');
assert.ok(footer.includes("['/member-referrals.html'"),'Actual member invite route remains');
assert.ok(!footer.includes("['/sales-manager.html'"),'Retired sales manager link forbidden');
new vm.Script(footer,{filename:'footer.js'});
new vm.Script(legalJs,{filename:'legal-notice-config.js'});
assert.ok(legalJs.includes('node.textContent='),'Untrusted legal entries must be escaped by DOM');
assert.ok(!legalJs.includes('innerHTML'),'Legal entries must not be parsed as markup');
console.log('PASS TILO Group legal disclosure: corporate naming, no legacy ad/DJ/62%/45% policies, editable verified legal placeholders, safe footer and scripts');
