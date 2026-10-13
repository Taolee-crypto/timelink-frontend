# TimeLink 기존 백엔드 API 및 데이터 구조 실사

기준일: 2026-10-14
대상 저장소: `Taolee-crypto/timelink-backend`
실사 기준: `main` commit `d13350d8c1b64c927c3cd3c4d189240eb2c7c756`
목적: Renewal UI가 기존 기능을 안전하게 재사용하도록 API, 데이터 소유권, 미완성 기능 및 보안 차단 항목을 구분한다.

> 이 문서는 저장소 소스 정적 조사 결과다. 실제 운영 DB의 데이터 상태, API 런타임 응답, 외부 OAuth 설정의 유효성은 별도 검증이 필요하다.

## 1. 현재 확인된 API 표면

| 영역 | 기존 경로 | 용도 및 상태 |
|---|---|---|
| 인증 | `POST /api/auth/login`, `POST /api/auth/signup`, `POST /api/auth/verify`, `POST /api/auth/resend` | 현재 정적 로그인/회원가입 화면이 사용하는 레거시 인증 경로 |
| 인증 검증 | `GET /api/v1/auth/me` | Bearer 토큰의 사용자 확인 |
| 개인 사용자 | `GET /api/v1/users/me` | 사용자 기본 정보 |
| 개인 지갑 | `GET /api/eco/wallet`, `GET /api/v1/users/me/wallet` | 서로 다른 잔액 컬럼 체계를 반환하므로 단일 지갑 기준 정리 필요 |
| 구형 파일 | `GET /api/v1/files/my` | 로그인 사용자의 `tl_files` 레코드 |
| SharePlace | `GET /api/shares`, `POST /api/shares`, `GET /api/shares/:id` | 현재 `tl_shares` 중심의 공유·조회 |
| TL3 | `POST /api/v1/tl3/releases`, `GET /api/v1/tl3/resolve/:shareId`, header/segment/code 경로 | TL3 발행 및 세그먼트 전달. v2 업로드 경로와 v3 발행 경로가 공존 |
| 사용자 저장소 | `GET /api/storage/providers`, `GET /api/storage/connections`, `POST /api/storage/connect`, upload-session/finalize/object/register | Google Drive 및 OneDrive 연결·업로드 |
| 파일 보관 | `POST /api/upload`, `POST /api/upload/mp3`, `POST /api/upload/tl3`, `/api/storage/:key` | D1 기반 저장 경로. 인증 및 공개 범위 재검토 필요 |
| 재생·정산 | `/api/shares/:id/charge`, `/api/shares/:id/consume`, `/api/v1/playback/tl3/consume` | TL 충전·시간 소비·창작자 정산의 레거시 경로 |
| 광고 | `/api/ads/*`, `/api/eco/ad-reward` | 직접 광고 캠페인·시청 보상 경로. 외부 광고 공급자 정산 허브는 별도 설계 필요 |
| Cafe / DJ / 방송 | `/api/cafe/*`, `/api/dj/*`, `/api/dj-cafe/*`, `/api/cafe-broadcast/*` | 기존 기능 라우터 존재 |

## 2. 데이터 구조의 핵심 문제

현재 디지털 자산이 하나의 테이블로 정리되어 있지 않다.

### A. `tl_files` — 구형 Creator/파일 모델
- 숫자형 ID
- 원본 파일 URL 및 파일 유형
- 권리 확인 상태, 공유 여부, 파일 TL, 재생 수치 등
- `/api/v1/files/my`에서 개인 소유 파일을 조회한다.

### B. `tl_shares` — SharePlace 중심 모델
- 문자열형 ID
- 곡명·아티스트·앨범·커버·가사·설명·발행 방식·저장 방식 등의 필드
- Spotify 관련 식별 필드 및 원본 해시/발매 확인 필드
- 기존 Track Page 및 SharePlace가 주로 이 모델을 사용한다.

### C. 개인 클라우드 메타데이터
- `storage_connections`: 사용자별 OAuth 연결 정보
- `storage_objects`: 사용자별 외부 파일 객체 메타데이터
- 액세스/리프레시 토큰은 암호화 저장하도록 구현되어 있다.
- 기존 API에는 개인이 소유한 객체 목록을 반환하는 전용 경로가 없었다.

### D. TL3 발행 데이터
- `tl3_releases`, `tl3_segments`, `tl3_tokens` 등으로 발행과 세그먼트 상태를 관리한다.
- TL3 v2 컨테이너 업로드와 v3 발행 경로가 코드에 함께 존재한다.
- Creator의 업로드 순서와 현재 발행 경로를 맞춰야 하며, 데이터 이동이나 삭제로 단순 통합해서는 안 된다.

**결정:** 기존 테이블을 당장 합치거나 마이그레이션하지 않는다. Renewal의 개인 보관함은 두 자산 모델을 읽기 전용으로 함께 보여주고, 이후 공통 Asset ID/Asset Registry를 추가하는 점진적 방식으로 간다.

## 3. Track Page API 상태

| 기능 | 현재 코드 상태 |
|---|---|
| 곡 상세 | `GET /api/shares/:id` 구현 |
| 재생 | 기존 재생·시간 차감 경로 존재 |
| 댓글 목록/등록 | `social_comments` DB 읽기·쓰기 경로 존재 |
| 좋아요 | 기준 main에서는 고정 응답 스텁. 개발 브랜치에서 DB 저장·중복 방지 구현 |
| 팔로우 | 기준 main에서는 고정 응답 스텁. 개발 브랜치에서 사용자 간 관계 DB 구현 |
| 소셜 통계 | 기준 main에서는 0 반환. 개발 브랜치에서 좋아요/댓글 집계 구현. 조회수는 별도 이벤트 모델 전까지 미집계 |
| 플레이리스트 목록/생성/추가 | 기준 main에서는 고정 응답 스텁. 개발 브랜치에서 사용자 소유 플레이리스트와 곡 연결 구현 |
| 댓글 목록/등록 | DB 읽기/쓰기 경로 존재. 개발 브랜치에서 테이블 보장 및 곡 존재 확인 보강 |
| 댓글 신고 | 기준 main에서는 성공 고정 응답. 개발 브랜치에서 사용자별 중복 방지 신고 기록 구현 |

백엔드 개발 브랜치 `feature/renewal-private-library-api`에서 위 기능을 실제 DB 경로로 교체했다. 다만 아직 TypeScript strict 검사, D1 스테이징 테스트, 악성 요청/중복 요청 테스트를 통과한 것으로 간주하지 않으며 운영에 배포하지 않았다. Track Page 프런트엔드 버튼도 API가 운영에 배포되기 전까지는 완성된 운영 기능이 아니다.

## 4. 보안 및 데이터 무결성 차단 항목

아래는 소스에서 관찰한 사항이며, 실제 악용이나 운영 장애가 발생했다고 단정하는 것은 아니다.

### P0 — 원본 파일 보호
- `GET /api/storage/:key`는 저장 객체를 읽어 응답하는 경로이며, 코드상 인증 확인이 보이지 않는다.
- 일반 업로드 `POST /api/upload`와 `POST /api/upload/tl`도 인증 확인 없이 D1 저장을 수행하는 경로가 존재한다.
- 특히 `/api/upload/tl`은 클라이언트가 보낸 메타데이터를 이용해 TL 파일을 만들고 기본값 형태의 서버 비밀 문자열을 사용하는 코드가 관찰된다.
- **조치:** 원본 파일과 비공개 TL 자산은 비공개가 기본이어야 한다. 소유자·발행 상태·사용권한·유효한 재생 세션을 서버에서 확인한 뒤 제한적으로 전달하도록 해야 한다. 기존 URL을 무작정 차단하면 현재 재생 기능이 깨질 수 있으므로 접근 로그/호환 경로/회귀 테스트를 먼저 마련한다.

### P0 — 사용자 귀속 및 업로드 인증
- `POST /api/files/sync`는 소스상 인증 미들웨어 없이 호출되며, 사용자 이메일이 없을 때 사용자 ID 1을 기본값으로 설정하는 경로가 관찰된다.
- **조치:** 인증된 토큰의 사용자 ID만 사용하고 클라이언트가 보낸 이메일/ID를 소유권 기준으로 신뢰하지 않는다. 기존 잘못 귀속된 레코드 여부를 확인하기 전에는 일괄 수정하지 않는다.

### P1 — 파일 API 권한
- `/api/v1/files` 라우터 전체에는 인증 미들웨어가 적용되어 있지만, `GET /:id`는 조회 시 소유자 또는 공개 여부 검사가 보이지 않는다.
- `POST /:id/approve`는 주석상 관리자 기능이나 해당 핸들러 안에 관리자 역할 확인이 보이지 않는다.
- **조치:** 개인 파일 상세 조회는 소유자/관리자/공개 권한으로 제한하고, 승인 작업은 관리자 역할을 반드시 검증한다.

### P1 — 외부 저장소 스트림
- `/api/storage/object/:id/stream`은 SharePlace 레코드에 연결된 객체인지 확인하는 분기가 있다. 연결 사실만으로 공개 재생을 허용하지 말고 해당 자산의 발행 상태, 접근 정책, TL3 세션 권한을 함께 검증해야 한다.

### P1 — 경제 장부 정합성
- 코드에는 `tl_balance`, `tl`, `tl_p`, `tl_a`, `tl_b`, `tlc_balance` 등 복수의 잔액 컬럼이 함께 쓰인다.
- `/api/eco/wallet`와 `/api/v1/users/me/wallet`의 반환 구조도 다르다.
- **조치:** 화면에서 임의 합산하지 않는다. TL Economics 원장과 잔액 원천을 먼저 확정하고 API 응답을 표준화한다. 기존 결제·소비 데이터는 보존한다.

## 5. 이번 개발 브랜치에서 추가한 개인 보관함 API

백엔드 개발 브랜치: `feature/renewal-private-library-api`

변경 파일: `src/index.ts`

### `GET /api/shares/my`
- Bearer 인증 필수
- 로그인 사용자의 `tl_shares` 및 구형 `tl_files` 레코드를 각각 반환
- 원본 파일 URL, 스트림 URL, 인증 증빙 경로는 반환하지 않음
- 읽기 전용, 최대 200개 페이지 단위

### `GET /api/storage/objects`
- Bearer 인증 필수
- 로그인 사용자의 외부 저장소 객체 메타데이터만 반환
- OAuth 토큰 및 제공자 다운로드 URL은 반환하지 않음
- 읽기 전용, 최대 200개 페이지 단위

두 API는 아직 개발 브랜치에만 있다. 운영 API에 반영되었다고 간주하지 않는다. 브라우저·통합 테스트 후 별도 검토 및 승인 절차를 거쳐야 한다.

## 6. Renewal My Files 연결 상태

프런트엔드 개발 브랜치: `feature/renewal-shell-20261014`

- `public/renewal/files.html`: 개인 파일 관리 화면
- `public/renewal/files.css`: 반응형 UI
- `public/renewal/files.js`: 인증 검증, 개인 TL 자산 조회, 구형 파일 조회, 클라우드 연결/객체 메타데이터 조회
- 개인 자산 목록은 인증 성공 후에만 요청한다.
- 클라우드 원본은 비공개 메타데이터로만 표시하며 직접 다운로드 URL을 UI에 만들지 않는다.
- Local Agent는 기존 구현 조사 후 연결할 수 있도록 UI만 구분해 두었다.

프런트엔드가 새 API를 호출하므로 백엔드 브랜치가 배포되기 전에는 이 화면의 개인 목록 일부가 실패한다. 이는 예상된 통합 순서이며, 기존 운영 페이지는 변경하지 않았다.

## 7. 검증 체크리스트

- [x] 프런트엔드 신규 JS 문법 컴파일 검사(`new Function` 파싱)
- [x] 백엔드 신규 경로 및 사용자 필터 SQL의 소스 저장 확인
- [ ] 백엔드 TypeScript strict 검사
- [ ] D1 스테이징 DB에서 소유자 A/B 교차 조회 차단 확인
- [ ] 무토큰/만료 토큰 요청이 401인지 확인
- [ ] Google Drive / OneDrive 연결·업로드·객체 목록 통합 테스트
- [ ] TL3 발행/재생 및 기존 Track Page 회귀 테스트
- [ ] 원본 파일 URL 비공개 접근 통제 테스트
- [ ] 운영 배포 전 보안 검토

## 8. 개발 순서

1. 원본 파일 공개 접근 경로 및 인증 없는 업로드 경로의 영향 범위 확인
2. 신규 개인 보관함 API의 소유권·인증 테스트
3. Renewal My Files 브라우저 통합 테스트
4. Asset Registry 설계: 기존 `tl_files`, `tl_shares`, `storage_objects`, TL3 release의 연결키
5. My Music 및 TimeLink Label의 음원 권리·발매 이력·업로더 책임·TL3 발행 흐름 연결
6. Track Page의 좋아요·팔로우·댓글·공유·플레이리스트 실제 구현
7. TL Economics 단일 원장/API 표준화
8. 광고 공급 어댑터 및 직접 캠페인 통합

**운영 원칙:** 개발 브랜치에서 구현·검증하고, 운영 배포·DB migration·기존 데이터 삭제는 별도 승인 없이는 수행하지 않는다.
