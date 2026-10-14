# TimeLink 통합 리뉴얼 작업 기록

## 2026-10-14 — 통합 아키텍처 기준선 및 첫 화면 착수

### 설계 문서 저장
저장소: `Taolee-crypto/timelink-frontend`
문서 브랜치: `docs/master-architecture-audit-20261014`

- `docs/00_MASTER/TIMELINK_INTEGRATED_ARCHITECTURE_V1.md`
- `docs/00_MASTER/EXISTING_IMPLEMENTATION_INVENTORY.md`
- `docs/00_MASTER/DOMAIN_DATA_MODEL.md`
- `docs/00_MASTER/ROUTES_AND_NAVIGATION.md`
- `docs/00_MASTER/ADR_STORAGE_AND_DELIVERY.md`
- `docs/00_MASTER/IMPLEMENTATION_PLAN.md`

### 첫 개발 작업
개발 브랜치: `feature/renewal-shell-20261014`
기준 커밋: `245d60aff24efce33d7ad9fad8ba682f2ed84ac5`

신규 경로에 별도 Renewal Shell을 추가했다.
- `public/renewal/index.html`
- `public/renewal/renewal.css`
- `public/renewal/renewal.js`

화면 기능:
- 비로그인 상태: TimeLink 소개, 로그인/회원가입 진입
- 기존 `tl_token` 및 `tl_user` 세션이 감지되는 경우: 개인 작업 공간 shell 표시
- My Dashboard, My Files, My Music, SharePlace, Creator, TL방송국, DJ, Cafe, InCar, TL Economics 진입 메뉴
- 데스크톱 사이드바와 모바일 드로어
- 기존 운영 페이지로 연결되는 호환 링크
- 임의의 잔액·활동 수치를 만들지 않으며, 기존 운영 API나 경제 로직을 변경하지 않는다.

### 검증 상태
- GitHub에서 신규 HTML/CSS/JS 파일과 아키텍처 문서의 저장 여부를 다시 읽어 확인했다.
- 운영 URL 전환, Cloudflare 배포, 기존 파일 수정, DB migration은 수행하지 않았다.
- 브라우저 실제 렌더링 및 end-to-end 테스트는 아직 수행하지 않았다.

### 조사 중 확인된 주의사항
1. 백엔드 공개 저장소의 `wrangler.toml`에 외부 서비스 API 자격증명으로 보이는 값이 하드코딩되어 있다. 유효 여부는 확인되지 않았으므로 노출된 것으로 간주해 제공자 측 폐기·재발급 및 Worker Secret 이전이 필요하다.
2. Track UI의 좋아요/팔로우/플레이리스트 API 중 일부는 백엔드 스텁이다. 댓글만 현재 DB 저장 경로가 관찰된다.
3. React 소스는 있으나 루트 빌드 설정이 확인되지 않고, 데모 데이터와 import 경로 불일치가 관찰된다. 운영 UI 기반으로 바로 채택하지 않는다.
4. Local Agent, Google Drive/OneDrive, D1 Object Storage 및 TL3 v2/v3 저장 경로가 공존한다. 저장소 변경은 ADR과 E2E 검증 후에만 한다.
5. 무료 MP3 공개 경로는 기존 화면과 API에 남아 있으나 신규 제품 정책과 충돌한다. 데이터는 보존하고 신규 공개 흐름에서 격리한다.

### 다음 작업
1. 자격증명 교체 여부 확인 및 비밀값 제거
2. backend API/DB/권한 전체 인벤토리
3. 신규 shell 브라우저 렌더링 확인
4. 개인 대시보드의 My Files/My Music 실제 API 매핑
5. Track Page 소셜 백엔드 기능 설계
6. Creator/TimeLink Label 발행 흐름의 기존 API 계약 검증
7. 첫 신규 페이지(My Dashboard)를 별도 경로에서 실제 데이터 연결


## 2026-10-14 — 백엔드 API 실사 및 My Files 1차 구현

### 백엔드 실사 결과 저장
- `docs/00_MASTER/BACKEND_API_AND_SECURITY_AUDIT.md`
- 확인한 백엔드 기준 커밋: `d13350d8c1b64c927c3cd3c4d189240eb2c7c756`
- 데이터 모델이 `tl_files`, `tl_shares`, `storage_objects`, TL3 release 테이블로 나뉘어 있음을 확인했다.
- 지갑도 `tl_balance`, `tl`, `tl_p`, `tl_a`, `tl_b`, `tlc_balance` 등 복수 필드가 사용된다. 통합 원장/API 확정 전에는 프런트엔드에서 임의 합산하지 않는다.
- Track Page 좋아요·팔로우·플레이리스트는 현재 스텁이고 댓글 읽기/쓰기는 DB 경로가 있음을 확인했다.
- 원본 파일 접근, 인증 없는 업로드, 파일 동기화 사용자 귀속, 관리자 승인 권한 관련 P0/P1 검토 항목을 별도 기록했다.

### 백엔드 개발 브랜치
- 저장소: `Taolee-crypto/timelink-backend`
- 브랜치: `feature/renewal-private-library-api`
- 변경: `src/index.ts`
- 신규 `GET /api/shares/my`: 인증된 사용자의 `tl_shares`와 구형 `tl_files`를 읽기 전용으로 조회한다. 원본/스트림 주소 및 증빙 경로는 반환하지 않는다.
- 신규 `GET /api/storage/objects`: 인증된 사용자의 외부 저장소 객체 메타데이터만 반환한다. OAuth 토큰과 제공자 다운로드 URL은 반환하지 않는다.
- 두 API 모두 개발 브랜치에만 존재하며 운영 배포되지 않았다.

### 프런트엔드 개발 브랜치
- 저장소: `Taolee-crypto/timelink-frontend`
- 브랜치: `feature/renewal-shell-20261014`
- 신규 `public/renewal/files.html`, `files.css`, `files.js`
- 내 TL 공유 자산, 기존 Creator 파일, 개인 클라우드 원본을 한 화면에서 구분한다.
- Google Drive/OneDrive 연결 상태와 OAuth 연결 진입을 연결했다.
- 로그인 세션은 `GET /api/v1/auth/me`로 확인한다.
- 홈 화면도 단순 localStorage 존재 여부가 아니라 서버 세션 검증 후 회원 화면을 보여주도록 변경했다.
- 홈 메뉴의 내 파일 링크를 신규 My Files 화면으로 연결했다.

### 검증
- 신규 프런트엔드 JS 2개 파일은 V8 Function 파싱으로 문법 검사를 통과했다.
- CSS 중괄호 균형을 확인했다.
- 백엔드 신규 API 경로와 사용자 ID 조건 SQL이 저장된 것을 재조회했다.
- TypeScript strict 빌드, 브라우저 렌더링, D1 소유자 교차 접근 테스트, OAuth 실제 연결은 아직 미실행이다.
- 운영 배포, DB migration, 기존 운영 페이지 수정은 하지 않았다.

### 다음 개발 단위
1. 신규 API의 TypeScript strict 검사와 D1 스테이징 권한 테스트
2. My Files 페이지의 실제 브라우저 통합 테스트
3. My Music와 TimeLink Label의 음원·권리·발매 이력 모델 연결
4. Track Page 좋아요·팔로우·플레이리스트를 실제 DB 기능으로 구현
5. 원본 파일 접근 권한을 기존 재생·TL3 흐름을 깨지 않고 단계적으로 강화


## 2026-10-14 — My Music 및 Track Page 소셜 기능 연결 착수

### 프런트엔드
- 신규 `public/renewal/music.html`, `music.css`, `music.js`
- `GET /api/shares/my`를 통해 본인 소유의 SharePlace 음원만 조회
- TL3와 MP3 유형 필터, 곡/아티스트 검색, 곡별 Track Page 이동, 홍보 링크 복사
- 구형 `tl_files` 음원은 별도 영역으로 분리하고 Track Page 연결을 확인해야 한다고 표시
- 홈 및 My Files에서 My Music로 이동하도록 연결

### 백엔드
- 브랜치: `Taolee-crypto/timelink-backend:feature/renewal-private-library-api`
- `src/index.ts`의 고정 응답 소셜/플레이리스트 스텁을 실제 DB 기반 코드로 교체
- 좋아요: 사용자별 중복 방지 및 곡별 집계
- 팔로우: 사용자 간 관계 저장, 자기 자신 팔로우 차단
- 댓글: 곡 존재 확인 후 등록, 기존 목록 응답 유지
- 댓글 신고: 신고자별 중복 방지 기록
- 플레이리스트: 사용자 소유 목록 생성, 곡 추가 및 목록 조회
- 조회수는 기존 데이터에서 신뢰 가능한 이벤트 모델을 확인하지 못했으므로 임의 수치를 만들지 않고 미집계 상태로 둔다.

### 검증 및 제한
- Renewal 홈, My Files, My Music JavaScript는 V8 Function 파싱 검사를 통과했다.
- 백엔드 소셜 경로의 고정 응답 스텁이 제거되고 DB 기반 핸들러가 존재하는 것을 소스에서 확인했다.
- TypeScript strict 빌드와 D1 통합 테스트는 아직 실행하지 못했다. 백엔드 package.json에는 test/build 스크립트가 선언되어 있지 않다.
- 브라우저 렌더링, 실제 사용자 A/B 교차 권한, 댓글 신고 운영 흐름은 미검증이다.
- 백엔드와 프런트엔드 모두 별도 개발 브랜치이며 운영에 배포하지 않았다.

### 다음 개발 단위
1. 백엔드 TypeScript strict 검사 환경 및 D1 스테이징 테스트 구성
2. 신규 My Files/My Music 페이지 브라우저 검증
3. 소셜 API 중복 요청·자기 팔로우·타 사용자 플레이리스트 접근 차단 테스트
4. 원본 파일 공개 접근 및 인증 없는 업로드 경로의 호환성 포함 보안 보강
5. My Music에서 기존 TL3 발행 레코드와 Creator 음원 원본의 관계를 연결


### 검토용 Draft PR
- Backend: https://github.com/Taolee-crypto/timelink-backend/pull/7
- Frontend: https://github.com/Taolee-crypto/timelink-frontend/pull/13
- 두 PR은 Draft 상태다. 병합 또는 운영 배포는 하지 않았다.


## 2026-10-14 — 개발 브랜치 보안 재점검

### 재점검 대상
- Backend branch: `feature/renewal-private-library-api`
- Commit: `e8e345a6999eb0c7ba437cfd1c20bd2f68f5835f`
- 대상: 외부 저장소 스트림, D1 업로드/다운로드, 레거시 파일 동기화, Track Page 소셜/플레이리스트

### 새로 확인한 차단 이슈
1. `/api/storage/object/:id/stream`은 객체가 `tl_shares`에 연결된 경우 요청자 권한을 확인하지 않는 분기가 있다. 공유 연결은 재생 권한과 동일하지 않으므로 P0 보안 수정이 필요하다.
2. `/api/upload/init`, `/api/upload/part`, `/api/upload/complete`, `/api/upload`은 사용자 인증 및 업로드 세션 소유권 검증이 부족한 코드 경로가 확인된다.
3. `/api/storage/:key`는 인증 없이 저장 객체를 읽을 수 있는 구조다. 기존 재생과 다운로드 호환성 확인 없이 일괄 차단하지 않는다.
4. `/api/files/sync`는 인증 없이 호출 가능하며 사용자 ID 1 기본값을 사용한다.
5. Local Agent 공급자 응답은 실제 연결 검증 없이 `configured:true`를 반환한다.
6. OAuth 콜백의 `postMessage` 대상 origin은 `*`이다. 허용 origin 및 프런트엔드 수신 측 검증이 필요하다.
7. Social / Playlist는 DB 기반으로 바뀌었으나 반복 DDL, 댓글 초과 길이 처리, 공개 플레이리스트 조회 정책, 비활성 사용자 확인을 보완해야 한다.

상세 내용과 수정 우선순위는 `BACKEND_API_AND_SECURITY_AUDIT.md`의 9~10절에 기록했다.

### 빌드/테스트 상태
- 개발 커밋에 연결된 GitHub Actions workflow run은 확인되지 않았다.
- `package.json`에는 `dev`, `deploy`만 있고 test/build script가 없다.
- `tsconfig.json`은 strict 검사를 켜고 있으나, 이 브랜치에서 strict typecheck가 실제 수행된 증거는 없다.
- D1 staging, 브라우저 E2E, 사용자 A/B 격리, OAuth 실제 연결 검증은 미수행이다.

### 조치 원칙
- 운영 브랜치·운영 DB·Cloudflare 배포는 변경하지 않았다.
- 권한 정책이 정의되지 않은 스트림 경로를 임의로 잠그지 않았다. 공개 MP3, 유료 TL3, 비공개 원본의 권한 규칙을 먼저 정리한 뒤 회귀 테스트와 함께 수정한다.
- 다음 구현은 인증된 업로드 세션과 원본 접근권한 경계를 먼저 확립하는 것으로 한다.


### 검증 자동화 준비
- Backend 개발 브랜치에 `.github/workflows/typecheck.yml` 추가
- Pull Request 및 해당 feature branch push 시 Node.js 22 환경에서 strict TypeScript 검사 실행
- workflow는 `npm ci` 후 검증 전용 TypeScript 및 Cloudflare Workers 타입을 설치하고 `tsc --noEmit`을 수행한다.
- 배포 단계나 Cloudflare 배포 자격증명은 포함하지 않는다.
- workflow 파일은 커밋되어 있으나, 현재 확인 시점에는 해당 커밋에 연결된 workflow 실행 결과가 아직 반환되지 않았다. 따라서 타입 검사 통과로 기록하지 않는다.


### 프런트엔드 PR 미리보기 배포 상태 재확인
- Frontend PR #13은 여전히 Draft / open이며 merge되지 않았다.
- Cloudflare Pages가 PR 브랜치의 Preview 배포 성공 이벤트를 남겼다.
- Branch Preview: https://feature-renewal-shell-202610.timelink-frontend.pages.dev
- 개별 Preview: https://fc7ac1a6.timelink-frontend.pages.dev
- 이는 PR 브랜치 미리보기 배포이며 운영 main 배포가 아니다. 브라우저에서 실제 페이지 렌더링 및 로그인/API 연동이 정상인지 확인했다는 의미도 아니다.
- Backend PR #7은 Draft / open 상태이며 merge되지 않았다.


## 2026-10-14 — 보안 접근 정책 및 릴리스 차단 기준 수립

### 새 문서
- `docs/00_MASTER/SECURITY_HARDENING_AND_TEST_PLAN.md`
- 공유 목록에 등록된 사실과 원본 파일 접근 권한을 분리하는 정책을 정의했다.
- 공개 MP3 홍보 재생, TL3/TL4/TLD/TLJ 보호 재생, 창작자 원본 보관을 서로 다른 권한으로 구분했다.
- 서버 발급 재생 세션, 서버 기준 TL 차감, 인증된 업로드 세션, 외부 저장소 소유자 검증을 목표 설계로 명시했다.
- 사용자 A/B 교차 접근, 무인증 업로드, 임의 key 변경, TL 과금 조작, OAuth origin 검증 등을 릴리스 차단 테스트로 지정했다.

### 추가로 확인한 소스 위험
- `GET /api/stream/:shareId`는 소스상 TL 잔액 또는 서버 발급 재생 권한을 확인하기 전에 원본 스트림 바이트를 반환하는 구조다.
- 시간 차감 tick은 요청 본문에서 초 단위와 차감률을 받으므로 서버가 요금과 과금 구간을 확정하도록 재설계해야 한다.
- `wrangler.toml`에 외부 API credential로 보이는 하드코딩 값이 있으며, 구형 업로드 코드에는 기본 암호화 secret fallback이 남아 있다. 실제 유효성은 확인하지 않았으며, 노출된 값으로 간주해 공급자 측 회전 및 Worker Secret 이전이 필요하다.

### 검증 상태
- 위 항목은 개발 브랜치 소스 확인 결과이며 운영 환경에 대한 침투 테스트 결과가 아니다.
- 보안 정책 문서만 추가했으며 런타임 코드, 운영 DB, 운영 설정은 변경하지 않았다.
- backend strict TypeScript workflow는 존재하지만 해당 커밋의 실행 결과는 아직 확인되지 않았다.
- 원본 파일·재생 권한을 일괄 차단하면 기존 서비스가 중단될 수 있으므로, 공통 권한 계층과 호환 테스트를 먼저 구현한다.


### SharePlace 및 스트림 전달 경로 2차 점검
- `src/routes/shareplace.ts`의 현대형 SharePlace 목록 API가 `tl_shares`의 `s.*` 전체를 반환하고, 그 결과에 내부 `stream_url`이 포함되는 것을 확인했다.
- 현대형 SharePlace 목록 쿼리에 명시적인 공개 상태 필터가 없음을 확인했다.
- `GET /api/stream/:shareId`가 별도 재생 권한을 확인하지 않고 외부 URL, 외부 저장소 객체 또는 D1 객체의 바이트를 반환하는 구조를 확인했다.
- `/api/stream/:shareId/info`의 `can_play`는 실제 전달 권한을 보장하지 않으며, 익명 방문자에 대해 재생 가능으로 응답하는 분기가 있다.
- `/api/stream/:shareId/tick`은 요청 본문의 `seconds`, `deduct_rate`를 과금 계산에 사용한다. 요금과 과금 단위는 서버가 결정해야 한다.
- 이 추가 발견을 `SECURITY_HARDENING_AND_TEST_PLAN.md` 8절에 기록했다.

### 후속 조치
- SharePlace 응답은 공개 메타데이터 allowlist DTO로 전환하고 내부 스트림 주소를 노출하지 않아야 한다.
- 재생은 별도 세션 및 서버 발급 grant로 권한을 확인한 뒤 허용된 구간만 전달해야 한다.
- 기존 MP3/TL3 호환성을 유지하는 단계적 마이그레이션 전에는 스트림 경로를 단순 차단하지 않는다.


## 2026-10-14 — 업로드 경로 및 Share 조회 응답 3차 보안 점검

### 추가로 확인한 코드 경로
- `POST /api/upload/tl`: 인증 확인 없이 TLNK v1 스타일 컨테이너를 만들고 D1에 저장한다. `TL_SECRET` 미설정 시 하드코딩 기본 문자열을 사용한다.
- `POST /api/upload`: 인증 확인 없이 클라이언트 `trackId`를 저장 key로 사용해 객체를 기록한다.
- `POST /api/upload/init`, `/api/upload/part`, `/api/upload/complete`: 인증 사용자와 업로드 세션 소유권이 결합되어 있지 않다.
- `GET /api/shares/:id`: `SELECT *` 응답으로 내부 스트림 URL 및 저장소·권리 관련 필드를 노출할 수 있다.

### 다음 구현 원칙
- 단순히 각 핸들러에 Bearer 토큰 검사만 추가하지 않는다. 기존 Creator, TL3 발행, MP3 등록 클라이언트를 먼저 조사해 요청·응답 계약을 기록한다.
- 서버 발급 uploadSessionId, 소유자 ID, 서버 생성 object key, 예상 크기·형식, 만료 및 완료 상태를 하나의 세션으로 묶는다.
- 공개 Share/Track API는 명시적 allowlist DTO를 사용하고 내부 URL/저장소 ID/권리 증빙 경로를 반환하지 않는다.
- 기존 TLNK v1 업로드는 신규 발행 경로에서 제외하고, 호출자 확인과 마이그레이션 계획이 끝날 때까지 운영 동작을 임의로 변경하지 않는다.

### 현재 상태
- 위 내용은 개발 브랜치 소스 검토 결과이며 운영 취약점 재현이나 운영 서버 변경을 의미하지 않는다.
- 문서만 갱신한다. 코드 병합, DB 변경, 운영 배포는 하지 않는다.


## 2026-10-14 — 프런트엔드 업로드 호출자 호환성 확인

### 현재 Creator 호출 계약
- `public/creator.html`은 `POST /api/files/sync` 요청에 `user_email`, `username`을 보내지만 Authorization 헤더를 보내지 않는다. 백엔드가 인증을 강제하기 전에 프런트엔드 수정이 선행되어야 한다.
- `public/creator-studio.html`은 `/api/files/sync` 호출 시 `auth()` 헤더를 보낸다.
- `src/components/suno/SunoConverter.tsx`도 토큰이 있을 때 Authorization 헤더를 포함한다.
- `public/creator.html`, `public/creator-studio.html`, `public/track.html`은 커버 이미지 업로드에 `POST /api/upload`을 사용하며 Bearer 토큰을 보내고, `trackId`에 cover 접두어를 사용한다. 현재 백엔드 해당 핸들러는 토큰을 검증하지 않는다.
- 따라서 `/api/upload`는 음악 원본 업로드와 별개로 커버/갤러리 미디어 전용 API로 분리할 필요가 있다. 공개 표시용 파생 이미지와 비공개 원본 파일을 같은 권한 정책으로 처리하지 않는다.

### 수정 선후 관계
1. 신규 Creator 작업 브랜치에서 `creator.html`의 실제 세션 토큰을 확인하고 `/api/files/sync`에 Authorization을 추가한다.
2. `/api/upload` 호출자를 커버·갤러리 미디어 업로드로 분류하고, 허용 MIME·크기·소유자별 서버 key 생성 계약을 정의한다.
3. 백엔드에서 `/api/files/sync`는 검증 JWT의 subject만 소유자 ID로 사용한다. 클라이언트 `user_email`/ `username`은 프로필 표시 데이터일 뿐 권한 근거로 사용하지 않는다.
4. Creator → Share 등록 → `tl_files` 동기화 → TL3 발행 → Track Page 렌더링을 회귀 테스트한다.

### 확인 한계
- 위 호출자 확인은 프런트엔드 기본 브랜치 소스 검색 결과를 기준으로 한다. 브라우저 네트워크 트래픽이나 실제 사용자 계정 테스트를 수행한 것은 아니다.
- `/api/upload`의 모든 호출 지점과 오래된 백업 파일은 현재 사용 여부가 다를 수 있으므로, 신규 코드 수정 전 활성 페이지의 호출 목록을 추가 대조한다.


## 2026-10-14 — 파일 승인 및 분쟁 종결 권한 보강

### Backend feature branch
- `src/routes/files.ts`: 승인 API의 관리자 역할 확인을 점검하고, 승인 값 boolean 검증을 추가했다.
- 이미 승인된 파일에 대해 재승인 요청이 반복되어도 POC +0.3이 중복 지급되지 않도록 했다.
- `src/routes/disputes.ts`: 분쟁 종결 API에 관리자 역할 검증을 추가했다.
- `upheld` 값의 boolean 검증, 이미 종결된 분쟁의 재처리 차단, 이미 분쟁 중인 파일에 대한 중복 접수 차단을 추가했다.
- 관련 커밋: `8846f3cde5191cd08401c858ab57097d7c178ae2`, `7104de5a3e81c5a77004fe8dc0d176c202bcd085`

### 검증 상태
- 두 수정 모두 `feature/renewal-private-library-api`에 저장했다.
- 커밋에 연결된 Backend TypeScript validation 및 Backend validation workflow가 실행 중인 것을 확인했다.
- workflow 완료 결과, D1 테스트, 관리자/일반 사용자 권한 테스트는 아직 확인되지 않았다.
- 운영 브랜치·운영 DB·Cloudflare 운영 배포는 변경하지 않았다.

### 다음 우선순위
1. 실행 중인 workflow 결과 확인 및 TypeScript 오류 수정
2. D1 테스트에서 관리자/일반 사용자 권한, 중복 승인·중복 분쟁 요청 확인
3. 외부 저장소 스트림이 SharePlace 연결 사실만으로 원본을 전달하는 문제를 공개 MP3·보호 TL3·비공개 원본의 정책에 맞게 해결
4. 인증 없는 업로드 경로와 `/api/files/sync` 사용자 귀속을 기존 Creator/TL3 호출 계약과 함께 보강


### CI 결과 추가 — Backend commit `7104de5a3e81c5a77004fe8dc0d176c202bcd085`
- Worker bundle 검증: 성공.
- Strict TypeScript 검사: 실패. Resend 타입 의존성, 누락 Env binding, Hono 타입 사용, 기존 auth/index/middleware 및 Cafe/DJ 라우터 등 저장소 전반에서 오류가 확인됐다.
- 수정한 `files.ts`와 `disputes.ts`는 로그에 직접 오류가 표시되지는 않았으나, 전체 strict check 실패 상태이므로 통과로 간주하지 않는다.
- npm install 단계에서 4개 취약점 경고(1 low, 3 high)가 확인됐다. 강제 패키지 업데이트는 하지 않았다.
- 판정: 번들 단계는 통과했지만 strict typecheck는 실패했다. PR은 Draft 상태로 유지한다.

**정정 및 정확한 변경 범위:** 파일 승인 API의 관리자 역할 검사는 현재 feature branch에 이미 존재했다. 이번 수정은 승인 입력 boolean 검증 및 재승인 시 POC 중복 지급 방지다. 분쟁 종결 API에는 관리자 역할 검사가 없어 이번에 새로 추가했다. 이 차이를 기준으로 변경 이력을 해석한다.


### 재생 과금 경로 4차 보안 확인
- `POST /api/stream/:shareId/tick`가 요청 본문의 `deduct_rate`를 사용해 TL 차감액을 계산하는 것을 확인했다. 클라이언트가 단가를 낮추거나 0으로 보내는 조작 가능성이 있다.
- 요청 비용보다 잔액이 부족해도 남은 차액을 검증해 거부하지 않고 성공 처리하는 흐름이 확인됐다.
- 스트림 바이트 전달과 tick이 서버 발급 재생 세션으로 결합되어 있지 않다.
- 상세 위험 및 목표 수정 방식은 보안 감사 문서 9.9절에 기록했다.
- 이번 단계에서는 기존 재생 경로를 변경하지 않았다. MP3 홍보 재생, TL3 시간 차감, InCar 청취자 0 TL 정책을 분리한 새 재생 grant/session을 설계하고 회귀 테스트한 후 교체해야 한다.


### 재생 권한·과금 세션 설계 문서 추가
- `docs/00_MASTER/PLAYBACK_AUTHORIZATION_DESIGN_V1.md` 작성
- 개인 원본, 공개 MP3 파생본, 보호 TL3/TL4/TLD/TLJ, InCar 홍보 재생의 접근 정책을 분리했다.
- 서버가 가격을 확정하고 잔액을 원자적으로 차감한 뒤 grant/session을 발급하는 신규 API 흐름을 설계했다.
- 세그먼트 전달, grant 만료, 사용자/자산/버전 결합, 멱등 과금, 분쟁·철회 시 중단 정책을 명시했다.
- 현재 문서는 설계 기준안이다. API 구현·DB migration·운영 재생 전환은 하지 않았다.
