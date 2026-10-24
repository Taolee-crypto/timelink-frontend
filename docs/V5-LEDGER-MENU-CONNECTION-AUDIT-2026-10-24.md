# TimeLink V5 개발 관리대장 × 메뉴 연결 감사 (2026-10-24)

기준: `main` 브랜치의 `public/v5-work-ledger.html`(107개 항목), `public/sidebar.js`, `public/radio.html`, `public/tl-broadcast.html`, `public/tilo-admin.html`, `public/admin.html`, `scripts/audit-v5-navigation.mjs` 및 백엔드 `src/index.ts`, `src/routes/{admin,dj,central-broadcast-v5}.ts`를 대조. **코드 존재와 실서비스 작동은 구분**한다.

## 연결 현황과 처리 판정

| 구분 | 현재 연결 | 관리대장 근거 | 판정 / 후속 조치 |
|---|---|---|---|
| 중앙방송 청취 | 사이드바 `/radio.html` | TLV5-025, 026 (테스트) | **오연결 조사**: 청취 페이지에서 관리자 전용 `/api/admin/central-broadcast/stations/:country` 호출. 공개 청취 API와 송출 권한 분리 전까지 정상 연결로 표시 금지 |
| 옛 방송 주소 | `/tl-broadcast.html` → `/radio.html` | 중앙방송 관련 | **호환용 보류**: 구주소 유입이 있으므로 즉시 삭제하지 말고 내부 링크 전수 조사 후 정리 |
| 중앙방송 운영 | `/admin.html`, `/tilo-admin.html`에 분산 | TLV5-033(미검증), 038(미검증) | **중복 관리 기능**: 관리자 접근·편성·송출·상태 기능의 책임 경계 재정의 후 중복 제거 |
| 국가별 방송 | `/api/dj/regional-profile/:country` | TLV5-028(구현), 034(설계) | 국가 설정과 실제 24시간 송출을 혼동하지 말 것 |
| 방송 정산 | `/api/v5/central-broadcast/inventory`, `/settlement-preview` | TLV5-029,030(구현) | 정산 **미리보기**와 실제 V5 원장 확정 기록을 별도로 대사해야 함 |
| AI DJ | `/radio.html`의 DJ 시연 UI와 방송 제어 공존 | TLV5-036(구현), DJLEARN 항목 설계/미검증 | 시연 요소와 실제 방송 엔진 분리; 검증 전 삭제 금지 |
| DJ 센터 | `/dj-center.html` | TLV5-DJC-01~10 대부분 미검증 | 메뉴는 유지, 송출/계약/청취 실연동 확인 |
| 카페 방송 | `/cafe-channel.html` | TLV5-050(구현, E2E 미검증) | 메뉴 유지, 직원 승인·방송 수신 검증 |
| 인카 방송 | `/incar-channel.html` | TLV5-052(구현, 실검증 미완료) | 메뉴 유지, 차량 수신 검증 |
| 글로벌 메뉴 감사 | `scripts/audit-v5-navigation.mjs` | 메뉴 전체 | 파일 존재·사이드바 포함만 검사. API 권한/송출/E2E는 검사하지 않음 |

## 삭제·병합 기준

1. **즉시 삭제 금지**: TL3 V5 파일, 재생 엔진, 지갑, 경제원장, 정산 이력, 기존 회원·음원·권리 데이터.
2. **삭제 후보**: 실제 방송과 중복된 시연 패널 및 기능 없는 장식 버튼. DOM 이벤트 참조·CSS·JS 의존성 확인 후 함께 제거.
3. **병합 후보**: `admin.html`의 TILO 운영 설정과 `tilo-admin.html`의 국가별 방송 관리. 관리자 API 인증을 유지하며 단일 운영 경로로 정리.
4. **호환 경로**: `tl-broadcast.html`은 내부 메뉴에서 제거됐더라도 외부 링크와 캐시가 남을 수 있으므로 전수 검색 후 삭제 여부 결정.
5. **관리대장 반영**: 확인된 연결 오류를 별도 이슈로 추적하고, 실서비스 E2E 증거가 없으면 상태를 '완료'로 올리지 않는다.

## 우선 실행 순서

1. **P0** 일반 청취 페이지의 관리자 API 의존을 공개 읽기 전용 API로 분리하고, 송출 변경은 관리자 인증으로 제한.
2. **P0** 실제 국가별 방송 세션·서버 지속성·곡 재생초 기록·V5 정산 확정의 호출 흐름을 추적.
3. **P1** 중복 방송 시연 화면의 이벤트/DOM 의존성 확인 후 제거.
4. **P1** 관리자 화면 중복을 하나의 운영센터로 정리.
5. **P1** 전체 메뉴 → 페이지 → API → 권한 → 관리대장 ID를 CI로 검증하는 계약 테스트 추가.

**감사 한계:** 이 문서는 소스 코드 기반 1차 대조다. 실제 운영 서버 호출, 사용자별 권한, 방송 지속성, D1 원장 정합성은 아직 검증하지 않았다.
