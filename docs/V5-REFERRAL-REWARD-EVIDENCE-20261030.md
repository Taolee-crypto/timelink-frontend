# 추천 보상 개발관리대장 증거 대조 (2026-10-31)

- 현행 개발관리대장 ID: `TLV5-WORK-20261028-REFERRAL-REWARD`.
- 프론트 기존 PR #472: 가입 인증 이후 추천코드 귀속, `/me` 영수증 표시 및 `/settle` UI.
- 백엔드 기존 PR #311: 추천 가입과 조건 검증.
- 백엔드 PR #362: 기존 구현의 남은 수명주기 연결 완료.
  - 인증된 추천 회원만 귀속.
  - Toss sandbox에서 provider-confirmed 첫 매장 결제와 실제 airtime grant를 함께 검증.
  - 관리자 수동 보상 정책의 TL_B·POC 사용.
  - 동일 추천·동일 결제 재시도 멱등성 및 중복 지급 방지.
  - 환불 증빙을 정확한 매장 주문에 귀속.
  - 해당 추천 TL_B 역분개, 환불된 매장 POC 제외.
  - 동일 환불 재시도 멱등성, 다른 증빙 충돌 차단, 환불 뒤 재지급 차단.
- 자동 회귀: `scripts/test-member-referrals-v5.cjs`, `scripts/test-v5-referral-store-e2e.cjs`, `scripts/test-v5-store-payment-contract.cjs`.
- 개발관리대장 상태: **테스트**. 코드·HTTP·SQLite E2E는 완료했으나 운영 실결제·실환불 증빙까지 수행한 것은 아니므로 **운영확인으로 올리지 않음**.
