# TimeLink 안전 수정 기록 및 검증 계획

- 기준일: 2026-10-14
- 작업 브랜치: `docs/master-architecture-audit-20261014`
- 범위: 발견된 호출 불일치와 인증/중복 차감 위험에 대한 제한적 수정
- 배포 상태: **미배포**. 운영 브랜치, PR 병합, Cloudflare Worker 배포는 하지 않았다.
- 검증 수준: GitHub 소스 재조회로 변경 내용 확인. 실제 브라우저·D1·실계정 재생·채굴 런타임 검증은 아직 하지 않았다.

## 1. 적용한 변경

### 1.1 TL3 중복 소비 차단 — frontend

파일: `public/shareplace.html`, `public/track.html`, `public/tl3.js`

- SharePlace 타이머에서 세그먼트 라이선스/confirm 경로를 사용하는 TL3 오디오를 전용 판별 함수 `isSegmentBilledTL3()`로 구분한다.
- TL3에는 레거시 `POST /api/shares/:id/consume`을 호출하지 않는다.
- TL3 잔액을 타이머가 초당 임의 차감하지 않는다.
- TL3 잔액 표시는 세그먼트 라이선스 응답과 confirm 응답의 `remaining_tl`을 반영한다.
- `track.html`에도 동일한 중복 소비 위험이 확인되어, TL3일 때 1초 로컬 잔액 차감과 5초 레거시 `/api/shares/:id/consume` 호출을 건너뛰도록 수정했다.
- Track TL3 플레이어는 `onSegment` 콜백으로 서버 잔액을 표시한다.
- MP3/레거시 파일에 대한 기존 타이머 소비 분기는 보존했다.
- TL3 서버 측 `code → confirm` 정산 로직은 수정하지 않았다.

중요한 제한:
- 이는 조사 브랜치의 SharePlace 플레이어 경로에 적용한 수정이다.
- 다른 플레이어 페이지나 별도 클라이언트가 레거시 소비 API를 호출하는지는 추가 추적이 필요하다.
- 실제 운영에서 중복 차감이 발생했는지, 수정으로 해소됐는지는 격리된 테스트 계정과 D1 로그로 확인해야 한다.

### 1.2 파일 동기화 소유권 인증 — backend + frontend

파일: backend `src/index.ts`; frontend `public/creator.html`

- `POST /api/files/sync`는 이제 Bearer JWT를 검증하고 JWT의 `sub`를 소유자 ID로 사용한다.
- 해당 사용자 ID가 users 테이블에 존재하는지 확인한다.
- 요청 본문의 `user_email`, `username`은 소유권 결정에 사용하지 않는다.
- 인증이 없거나 유효하지 않으면 401을 반환한다.
- 예전의 기본 소유자 `userId=1` 및 `local_sync` 자동 사용자 생성 동작을 제거했다.
- creator.html에서 해당 요청에 Authorization 헤더를 전달한다.
- creator-studio 및 SunoConverter의 기존 호출은 Authorization 헤더를 포함하는 구조임을 소스에서 확인했다. SunoConverter는 동기화 오류를 무시하는 기존 동작을 유지한다.

호환성 영향:
- 로그인 토큰 없이 이 API를 호출하던 외부/구형 클라이언트는 이제 401을 받는다.
- 요청 본문의 이메일로 소유권을 추정하던 레거시 흐름은 더 이상 허용하지 않는다.
- 과거에 user_id=1 또는 local_sync 사용자로 잘못 연결된 기존 행을 자동 이동하지 않는다. 별도 데이터 정합성 조사 후 처리해야 한다.

### 1.3 TLC 채굴 대시보드 계약 정렬 — frontend + backend

파일: frontend `public/dashboard.html`; backend `src/economics.ts`

- 대시보드의 존재하지 않는 `POST /api/eco/calc-poc` 대신 현재 구현된 `POST /api/eco/activity`에 빈 JSON을 전달해 현재 누적 POC를 재계산한다.
- `poc_components`를 기존 네 개의 POC 표시 영역에 연결한다.
- `tlc_mining.daily_max`를 채굴 요청량으로 사용한다.
- 기존에 존재하지 않던 `POST /api/eco/mine` 대신 `POST /api/eco/mine-tlc`를 호출하며 `{tlc_amount}`를 전송한다.
- 백엔드에 인증된 읽기 전용 `GET /api/eco/mining-history`를 추가해 `tlc_mining_v2` 최근 20건을 반환한다.
- 기존 `/activity`의 POC 산식과 `/mine-tlc`의 실제 지급·일일 한도·월 하드캡 계산은 변경하지 않았다.

중요한 제한:
- `/activity`는 현재 저장된 누적 실적을 다시 계산한다. UI가 보여주는 예상 daily_max와 실제 지급량은 /mine-tlc의 하드캡 적용으로 다를 수 있다.
- TLC 발행 공식, POC 가중치, 플랜 배율, 한도는 변경하지 않았다.
- 실제 채굴은 테스트 계정에서만 검증해야 하며 운영 TLC 잔액을 사용한 검증은 하지 않는다.

## 2. 변경된 파일과 최신 Blob SHA

| 저장소 | 파일 | 최신 Blob SHA |
|---|---|---|
| frontend | `public/shareplace.html` | `84e6e78c4e5bae4677f213b718e012306dde111d` |
| frontend | `public/tl3.js` | `e9857d176e8c62c0628d13322fd9f3f0f8921714` |
| frontend | `public/track.html` | `de8a13021f65a68312d52325548daa21e900b68d` |
| frontend | `public/creator.html` | `f1bac29c073a3243eb5596b789d0db07d79888ac` |
| frontend | `public/dashboard.html` | `9c4c266130a4b379296e0bc117b1e6b336fd4d84` |
| backend | `src/index.ts` | `8d5e5e5a6c8431c73055d37d4e9e834c02fa04de` |
| backend | `src/economics.ts` | `46b06311b908bca05360dcfee4780c2cfd371d51` |

## 3. 필수 검증 시나리오

### A. 파일 소유권

1. Authorization 헤더가 없는 `POST /api/files/sync`는 401이어야 한다.
2. 만료/변조 JWT는 401이어야 한다.
3. 사용자 A의 JWT와 사용자 B의 `user_email`을 함께 보내도 새 행의 owner는 A여야 한다.
4. 동일 제목의 사용자 A/B 파일은 서로의 행을 업데이트하지 않아야 한다.
5. 존재하지 않는 JWT subject는 401이어야 하며 사용자 자동 생성이 발생하지 않아야 한다.
6. 정상 creator.html 및 creator-studio 업로드는 로그인한 사용자 소유로 기록되어야 한다.

### B. TL3 재생 과금

1. TL3 SharePlace 재생 시 세그먼트별 `code`와 `confirm` 호출을 확인한다.
2. 동일 재생 세션에서 레거시 `/api/shares/:id/consume` 호출 횟수는 0이어야 한다.
3. MP3 및 레거시 콘텐츠의 기존 무료/소비 동작은 별도 테스트한다.
4. 서버의 `remaining_tl` 값이 라이선스 예약과 confirm 환급 후 UI에 반영되는지 확인한다.
5. 재생 중 일시정지, 곡 변경, 네트워크 끊김, confirm 실패, 세션 만료를 시험한다.
6. 격리 DB에서 재생 전/후 구매 TL, 파일별 잔액, 창작자 수익, 환급, 이벤트 로그를 대조한다.

### C. POC/TLC

1. `POST /api/eco/activity` 빈 JSON 요청이 현재 POC 구성요소를 반환하는지 확인한다.
2. 대시보드 네 요소 값/막대가 응답의 `poc_components`와 일치하는지 확인한다.
3. `POST /api/eco/mine-tlc`에 `tlc_amount`가 전달되는지 확인한다.
4. 실제 지급량이 일일 잔여 한도와 월 하드캡 이하인지 확인한다.
5. `GET /api/eco/mining-history`가 로그인 사용자 자신의 최근 기록만 반환하는지 확인한다.
6. 연속 클릭, 동시 요청, 일일 한도 경계, 소비 실적 0인 계정을 테스트한다.

## 4. 아직 수정하지 않은 위험

- TL3 confirm의 여러 D1 쓰기는 하나의 원자적 트랜잭션으로 묶이지 않은 것으로 관찰됐다.
- 예약 라이선스 응답 유실, 중복 confirm, 세그먼트 요청 경쟁, 재생 중단/환급 경계는 여전히 테스트 대상이다.
- 다른 플레이어 페이지에서 레거시 consume을 호출하는지 전체 호출자 추적이 끝나지 않았다.
- 파일 sync의 기존 잘못된 소유권 행은 자동 정정하지 않았다.
- POC/TLC와 TL_P/TL_A/TL_B 원장 구조를 통합하거나 정책을 바꾸지 않았다.
- Local Agent, Google Drive, OneDrive 업로드/저장 연결은 아직 수정하지 않았다.

## 5. 실행 경계

다음 단계는 격리된 테스트 환경에서 위 시나리오를 실행하고 결과를 기록하는 것이다. 실계정 잔액 또는 운영 데이터에 영향을 주는 테스트는 하지 않는다. 운영 배포 전에는 대표자 확인, PR 검토 및 명시적 배포 승인이 필요하다.
