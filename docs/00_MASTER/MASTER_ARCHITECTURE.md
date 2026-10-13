# TimeLink Master Architecture

- 문서 상태: 조사 초안 v0.1
- 조사 기준일: 2026-10-14
- 조사 대상: `Taolee-crypto/timelink-frontend`, `Taolee-crypto/timelink-backend`
- 원칙: 이 문서는 기존 구현을 설명하는 조사 결과이며, 기존 코드나 설계를 승인·변경하는 문서가 아니다.

## 1. 플랫폼의 목적

TimeLink는 디지털 콘텐츠 파일 자체를 단순 판매하는 서비스가 아니라, 콘텐츠에 대한 시간 기반 사용 권한을 TL로 관리하고 사용량에 따라 창작자에게 정산하는 플랫폼을 지향한다.

콘텐츠 유형의 목표 범위:
- TL3: 음악
- TL4: 영상
- TLD: 문서
- 이미지 등 기타 콘텐츠 유형은 실제 포맷과 권한 체계 확인 후 별도 확정

대표자 최신 방향(기존 문서와 충돌할 경우 결정 대기 항목으로 취급):
- TL 파일 중심으로 콘텐츠를 유통한다.
- 무료 콘텐츠 방식은 운영 정책에서 제외하는 방향이다.
- TL 가치 기준은 1 TL = 1원으로 취급한다.
- 이 방향을 코드에 반영하기 전에 무료 MP3·구형 파일·기존 회원 잔액의 전환 정책을 별도 결정해야 한다.

## 2. 시스템 전체 구성

### 2.1 사용자 접점: Frontend

저장소: `Taolee-crypto/timelink-frontend`

현재 확인된 주요 화면:
- `public/index.html`: 랜딩/홈
- `public/login.html`: 로그인
- `public/shareplace.html`: 콘텐츠 탐색 및 상세 진입
- `public/creator.html`, `public/creator-studio.html`: 창작자 등록·업로드 흐름
- `public/track.html`: 콘텐츠 상세·재생
- `public/wallet.html`, `public/dashboard.html`: 지갑 및 사용자 관리
- `public/radio.html`, `public/cafe-radio.html`, `public/incar.html`: 방송/공간 관련 화면
- `public/tl3.js`: TL3 온라인·오프라인 플레이어 로직
- `public/tl3-config.js`: TL3 API 기준 URL
- `public/sidebar.js`: 공통 사이드바
- `local-agent/server.js`: 창작자 PC의 파일 제공 에이전트

주의: 저장소에는 정적 HTML 기반 `public/`와 React/Vite 형태의 `src/`가 함께 있다. 실제 운영 진입점과 두 UI 구조의 역할 관계는 추가 확인이 필요하다.

### 2.2 API 및 업무 로직: Backend

저장소: `Taolee-crypto/timelink-backend`

런타임:
- Cloudflare Workers
- Hono 라우팅
- Cloudflare D1 데이터베이스
- 배포 설정: `wrangler.toml`
- 기본 API 도메인 문서 표기: `https://api.timelink.digital`

주요 모듈:
- 인증: `src/auth.ts`, `src/routes/auth.ts`
- 사용자: `src/routes/users.ts`
- 파일: `src/routes/files.ts`
- 재생/정산: `src/routes/playback.ts`, TL3 전용 경로는 `src/index.ts`
- SharePlace: `src/routes/shareplace.ts` 및 `src/index.ts`의 호환 경로
- 경제/지갑/POC/TLC: `src/economics.ts`, `src/jetton.ts`
- 결제: `src/payment.ts`
- 저장소 연동: `src/storage.ts`
- D1 객체 저장: `src/d1-storage.ts`
- TL3 암호화: `src/tl3v3.ts`, `src/tl3_crypto.ts`
- 구형 TL 파일: `src/tl_format.ts` 및 `src/index.ts`의 레거시 업로드 코드

### 2.3 데이터 계층

현재 확인된 데이터 계층은 단일 모델로 정리되어 있지 않다.

- D1 기본 마이그레이션: `migrations/0001_initial.sql`
- 오프라인 세션: `migrations/0002_offline_sessions.sql`
- Suno 관련 마이그레이션: `migrations/migration-suno.sql`
- 코드 실행 중 `CREATE TABLE IF NOT EXISTS` 및 `ALTER TABLE`을 수행하는 동적 스키마 생성도 다수 존재한다.
- `users`, `tl_files`, `transactions`, `play_events`, `poc_events`, `tl_shares`, `tl3_releases`, `tl3_segments`, `tl3_tokens`, `tl_d1_objects`, `storage_connections`, `storage_objects` 등이 코드에서 확인된다.

따라서 실제 운영 DB의 스키마는 마이그레이션 파일만으로 확정할 수 없다. 전체 SQL 및 런타임 생성 테이블을 모아 단일 데이터 사전을 만들어야 한다.

## 3. 핵심 업무 흐름

### 3.1 회원 및 인증
1. 사용자가 프런트엔드에서 가입 또는 로그인한다.
2. 백엔드가 사용자 정보를 확인하고 JWT를 발급한다.
3. 프런트엔드는 토큰을 API 요청에 전달한다.
4. 사용자·지갑·콘텐츠 권한은 백엔드에서 확인한다.

주의: 인증 경로가 `/api/auth/*`와 `/api/v1/auth/*` 등 복수로 존재한다. 어느 경로가 표준인지 정리해야 한다.

### 3.2 콘텐츠 등록
1. 창작자가 파일과 메타데이터를 준비한다.
2. TL 파일 생성 또는 TL3 변환을 수행한다.
3. 파일 바이트는 D1 또는 사용자 소유 저장소 등 복수 경로에 저장될 수 있다.
4. D1에는 콘텐츠 메타데이터·파일 식별자·저장소 참조·권리 정보가 등록된다.
5. SharePlace에서 콘텐츠를 조회한다.

현재 코드에는 구형 MP3 등록 경로도 남아 있어 대표자 최신 운영 방향과의 정책 정리가 필요하다.

### 3.3 TL3 재생 및 과금
1. 플레이어가 TL3 헤더를 요청한다.
2. 세그먼트 암호문을 요청한다.
3. 세션·권한·TL 잔액 검증을 거쳐 라이선스 관련 데이터를 요청한다.
4. 클라이언트가 세그먼트를 복호화하고 재생한다.
5. 재생 확정 요청을 통해 사용량과 정산을 반영한다.

주요 API 경로:
- `/api/v1/tl3/header/:id`
- `/api/v1/tl3/segment/:id`
- `/api/v1/tl3/code/:id`
- `/api/v1/tl3/segment/confirm/:id`
- 오프라인: `/api/v1/tl3/offline/*`

정확한 세션·토큰·차감 시점은 별도 프로토콜 명세에서 코드 라인 기준으로 확정해야 한다.

### 3.4 저장소
현재 구현 또는 문서에서 확인된 저장소 유형:
- 창작자 PC Local Agent
- Google Drive
- OneDrive
- Cloudflare D1 청크 저장

각 방식은 서로 대체 가능한 단일 저장소가 아니라 서로 다른 코드 경로다. 기본 저장소, 선택 저장소, 레거시 저장소, 운영 중단 여부를 결정해야 한다.

## 4. TL 파일 및 프로토콜 현황

현재 코드에서 최소 세 세대가 관찰된다.

| 세대 | 코드 근거 | 확인된 방식 | 상태 판단 |
|---|---|---|---|
| TLNK v1 | `src/tl_format.ts`, `/api/upload/tl` | XOR 기반 레거시 컨테이너 | 레거시·보안 재검토 |
| TLNK v2 | `src/index.ts`의 `/api/upload` 검사 | 7바이트 헤더 전제의 구형 포맷 | 호환 경로 존재 |
| TLNK v3 | `src/tl3v3.ts`, `public/tl3.js` | AES-256-GCM, HKDF-SHA-256, 토큰 체인 | TL3 핵심 구현 |

중요한 점:
- v1·v2·v3를 같은 포맷으로 간주하면 안 된다.
- `TL_PRINCIPLES.md`의 TLNK v3 설명과 실제 구형 업로드 경로가 공존한다.
- TL4/TLD 공통 컨테이너는 원칙 문서에 기술되어 있으나, 현재 확인한 구현은 TL3 중심이다. 영상·문서의 실구현 여부를 별도로 조사해야 한다.
- v3의 헤더 토큰 구성, 세그먼트 길이, 오프라인 라이선스 처리 등은 상세 코드 검증 후 별도 규격서로 고정해야 한다.

## 5. 문서상 주요 충돌

1. `docs/IA.md`는 무료 MP3와 TL3를 함께 표시하지만, 최신 대표자 방향은 TL 파일 중심·무료 콘텐츠 제외다.
2. `docs/PRINCIPLES.md`는 MP3 직접 재생 금지를 선언하지만, SharePlace 및 백엔드에는 MP3 콘텐츠 분기와 과거 스트림 경로가 남아 있다.
3. `TL_PRINCIPLES.md`는 창작자 소유 저장소를 중심으로 설명하지만, 백엔드에는 D1 청크 저장과 Google Drive·OneDrive 저장소 연동도 존재한다.
4. TLNK v1 XOR, v2 호환 처리, v3 AES-GCM이 공존한다.
5. 백엔드 README의 디렉터리 설명 일부가 실제 현재 경로와 맞지 않는다. 예: 문서에 설명된 `src/routes/tl3.ts`와 `src/ledger.ts`는 현재 트리에서 같은 경로로 확인되지 않는다.
6. 정적 HTML과 React/Vite 소스가 함께 존재하므로 실제 운영 UI의 기준점을 확정해야 한다.

## 6. 문서화 원칙

- 현재 동작을 설명하는 문서와 미래 목표를 설명하는 문서를 분리한다.
- 모든 기술 명세에는 근거 코드 경로와 버전/커밋을 기록한다.
- API·DB·파일 포맷은 구현과 테스트 결과를 근거로 작성한다.
- 미구현 기능을 구현 완료로 표현하지 않는다.
- 기존 문서는 조사 완료 및 대표자 승인 전까지 삭제하거나 덮어쓰지 않는다.
- 설계 충돌은 임의로 해소하지 않고 결정 기록으로 남긴다.

## 7. 다음 조사 단계

1. 전체 API 라우트와 프런트엔드 호출 관계를 매핑한다.
2. D1 테이블을 마이그레이션·동적 SQL·실제 운영 DB 기준으로 통합한다.
3. TL3 v3 온라인/오프라인 재생 및 정산을 코드 단위로 추적한다.
4. 저장소 공급자별 업로드·재생·삭제·권한 흐름을 정리한다.
5. 보안 위험 및 운영 정책 충돌을 우선순위화한다.
6. 대표자 결정 사항을 반영해 확정 아키텍처를 작성한다.
