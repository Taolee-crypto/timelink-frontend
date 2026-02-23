#!/usr/bin/env node
/**
 * KV Namespace 자동 생성 스크립트
 * 실행: node scripts/setup-kv.js
 */
const { execSync } = require('child_process');

const namespaces = ['TL_USERS', 'TL_TRACKS', 'TL_SESSIONS', 'TL_BALANCES'];

console.log('⚡ TimeLink KV Namespace 생성 중...\n');

namespaces.forEach(ns => {
  try {
    const result = execSync(`npx wrangler kv:namespace create ${ns}`, { encoding: 'utf8' });
    console.log(`✅ ${ns}`);
    // ID 추출
    const match = result.match(/id = "([^"]+)"/);
    if (match) {
      console.log(`   id = "${match[1]}"`);
      console.log(`   → wrangler.toml의 YOUR_${ns}_KV_ID 를 이 값으로 교체하세요\n`);
    }
  } catch (e) {
    console.log(`⚠️  ${ns} 이미 존재하거나 오류 발생\n`);
  }
});

console.log('완료! wrangler.toml을 업데이트하고 npx wrangler deploy 를 실행하세요.');
