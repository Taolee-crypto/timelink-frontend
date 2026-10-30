'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('public/v5-work-ledger.html','utf8');
assert.ok(html.includes('페이지 구현률'), 'page metric must be labeled as implementation only');
assert.ok(html.includes('운영검증'), 'page E2E verification must be a separate count');
assert.ok(html.includes('작업 개발 완료율'), 'feature completion must stay independently visible');
assert.ok(!html.includes('페이지 개발 완료율'), 'ambiguous page completion wording must be removed');
console.log('PASS: feature, page implementation and E2E verification labels remain separate');
