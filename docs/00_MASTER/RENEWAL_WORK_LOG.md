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
