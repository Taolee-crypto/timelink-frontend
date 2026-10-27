# Frontend 호출부 대조 결과 — 핵심 불일치 및 보존 메모

조사 기준: 2026-10-14, 브랜치 `docs/master-architecture-audit-20261014`.
이 문서는 저장소 소스 대조 기록이며, 운영 배포본이나 실제 계정에서 실행 검증한 결과가 아니다. 기존 API·경제 정책 변경을 승인하는 문서가 아니다.

## 1. TL3 SharePlace 재생에서 이중 소비 가능성이 확인됨

프런트엔드 `public/shareplace.html`의 재생 진입부(약 757행)는 `TL3.resolveUrl(shareId)`를 호출한다. `public/tl3.js`의 `resolveUrl`(약 358~459행)은 각 세그먼트마다 다음을 실행한다.

1. `GET /api/v1/tl3/segment/:id?segment=N`
2. `GET /api/v1/tl3/code/:id?segment=N&session_id=S` — 라이선스 발급 및 TL 선차감
3. 복호화 후 `POST /api/v1/tl3/segment/confirm/:id` — 실제 재생시간 정산

그런데 SharePlace 화면의 별도 타이머(`shareplace.html` 약 786~799행)는 재생 중인 비무료 콘텐츠에 대해 5초마다 `POST /api/shares/:id/consume`도 호출한다.

따라서 TL3 콘텐츠 재생 시 세그먼트 기반 선차감과 레거시 Share 소비가 동시에 실행될 수 있는 구조다. 이는 소스 수준에서 확인된 중복 과금 위험이다. 실제 운영에서 발생하는지는 배포본 및 실제 호출 로그를 확인해야 한다.

**보존/조치 원칙:** 사용자 승인 전에는 어느 경로도 삭제하지 않는다. 먼저 무료 MP3와 유료 TL3를 분리해 재생 경로를 표로 확정하고, TL3에 대해 하나의 승인된 정산 경로만 연결하는 테스트 계획을 만든다. 기존 MP3 무료 재생과 레거시 데이터는 보존한다.

## 2. TL3 플레이어 내부의 중복 구현

`public/tl3.js`에는 `resolveUrl`, `playStream`, `streamSegmented`, `playFile` 등 여러 진입점과 세그먼트 처리 코드가 공존한다. SharePlace는 현재 `resolveUrl`을 호출한다. 새 UI에서 임의로 다른 진입점을 선택하거나 재생기를 하나로 합치지 않는다. 각 페이지의 실제 호출 관계와 중단/정리 동작을 확인한 뒤 표준 진입점을 결정한다.

## 3. 크리에이터 업로드 순서와 인증 누락

`public/creator.html` 약 964~1077행의 순서는 다음과 같다.

1. Local Agent `GET http://127.0.0.1:8787/health`
2. Local Agent `POST /upload?kind=mp3&name=...`, body는 MP3 Blob, Content-Type `audio/mpeg`
3. `POST /api/shares` — Bearer JWT. 요청에는 제목/아티스트/앨범, audio 분류, stream_url, file_type, origin_hash, storage_mode, release_mode, rights_confirmed 등 포함.
4. TL3 모드일 때 `POST /api/files/sync` — JSON `title, artist, genre, stream_url, cover_image, user_email, username, shared_to_shareplace`; 현재 호출은 Authorization 헤더가 없다.
5. `POST /api/v1/tl3/releases` — Bearer JWT, `file_id, share_id, title, artist, price_tl`.
6. 후속으로 `POST /api/v1/assets`, 선택적으로 `POST /api/v1/assets/:asset_id/certify`.

백엔드 `src/index.ts`의 `/api/files/sync`는 인증 주체를 검증하지 않고 요청 본문 이메일을 사용하며 기본 userId=1을 둔다. 프런트엔드에 사용자 이메일을 더 보내는 방식으로 우회하지 않는다. 소유권 결정은 검증된 서버 인증 주체를 사용하도록 별도 수정·테스트해야 한다.

등록은 여러 독립 요청으로 이루어져 중간 실패 시 Local Agent 파일, SharePlace 레코드, tl_files, TL3 release, asset/certificate가 서로 다른 상태로 남을 수 있다. 재시도 멱등성 및 단계별 복구가 필요하다.

## 4. TLC 채굴 API 계약 — 과거 불일치 기록 (2026-10-28 재확인)

**현재 코드 재확인:** `public/dashboard.html`은 POC 관련 `/api/eco/activity`, TLC 채굴 `POST /api/eco/mine-tlc` (`tlc_amount` 포함), 이력 `GET /api/eco/mining-history`를 사용한다. 백엔드 `src/economics.ts`에 해당 라우트가 정의되어 있고 `src/index.ts`가 `/api/eco`를 등록한다. 아래의 `/calc-poc`·`/mine` 호출 지적은 **과거 감사 시점의 기록이며 현재 호출 계약의 결함으로 취급하지 않는다.** 실제 배포 환경에서의 채굴·지갑 잔액·이력 일치 및 중복 방지 검증은 별도 필요하다.

### 이전 감사 기록 (이력 보존)

`public/dashboard.html`은 `POST /api/eco/calc-poc`를 호출한 뒤 `POST /api/eco/mine`을 body 없이 호출한다. 그러나 조사한 백엔드 `src/economics.ts`는 `POST /mine-tlc`를 정의하고, 요청 JSON `tlc_amount`를 필수로 읽는다. `/calc-poc`, `/mine`, `/mining-history` 정의는 이 router 파일에서 확인되지 않았다.

`src/index.ts`는 `ecoRouter`를 `/api/eco`에 마운트한다. 따라서 현재 조사 브랜치의 해당 파일 조합만 보면 프런트엔드 호출과 백엔드 라우트 계약이 일치하지 않는다. 별도 배포 버전/라우트가 존재할 가능성은 남겨 두며, TLC 채굴 기능 자체가 없다고 결론 내리지 않는다. 대표자가 확인한 채굴 시험 결과와도 혼동하지 않는다.

## 5. TL 지갑 계약은 여러 모델로 나뉨

- `/api/eco/wallet`: TL_P/TL_A/TL_B/TLC 및 POC 필드.
- `/api/v1/users/me/wallet`: 별도 응답 구조와 잔액 필드.
- `/api/shares/:id/my-tl`: 특정 Share별 `tl_user_files.tl_balance`.
- TL3 `/code`: `users.tl_balance`를 세그먼트 단위로 예약 차감.
- 레거시 Share `/consume`: 파일별 잔액 및 지갑 자동충전 로직.

화면의 TL 숫자만 같다고 동일한 원장으로 간주하지 않는다. 새 지갑 UI를 연결하기 전에 각 잔액의 의미와 실제 운영 정책을 확정한다.

## 6. 조사 소스 SHA

| 저장소 파일 | Blob SHA |
|---|---|
| frontend `public/creator.html` | `34ce35b1176e33c165abe025ff498eb670b3fe5e` |
| frontend `public/tl3.js` | `8084cac364897994ae4783da4eafbcaa564e96e0` |
| frontend `public/shareplace.html` | `14dfb038111372bcd921ac5eb5dc67744f276388` |
| frontend `public/dashboard.html` | `6b566d4a6415b79cdc21143e6ffabfe7f8ee21e1` |
| backend `src/index.ts` | `7710bd86e3de68dd1be314fdb1507a08d1258ac4` |
| backend `src/economics.ts` | `c404705eeec366fb2e4225435eb48b9b8a90e8db` |

## 7. 다음 검증 순서

1. 배포된 Worker가 이 브랜치 소스와 같은 버전인지 확인.
2. 테스트 계정/격리 DB에서 TL3 SharePlace 재생 시 `code`, `confirm`, legacy `consume` 각각의 호출 횟수와 잔액 변화를 관찰.
3. 무료 MP3가 어떤 URL과 타이머 경로를 사용하는지 별도 확인.
4. 대시보드의 POC/TLC API가 실제 운영 환경에서 어떤 라우트로 처리되는지 확인.
5. 인증된 파일 소유권, 업로드 재시도, TL 예약/환급/정산을 테스트한 뒤에만 구현 변경을 제안.

운영 코드 수정, PR 병합, 배포는 수행하지 않았다.
