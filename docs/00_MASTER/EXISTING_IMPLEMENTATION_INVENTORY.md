# TimeLink 기존 구현 인벤토리 v1

- 조사일: 2026-10-14
- 기준 저장소: Taolee-crypto/timelink-frontend 기본 브랜치에서 읽은 파일
- 목적: 통합 아키텍처에 기존 구현을 안전하게 편입하기 위한 1차 소스 조사
- 주의: 이 문서는 저장소 코드의 정적 확인이다. 운영 서버의 실제 성공 여부, DB 스키마 전체, 계정별 권한, 브라우저 런타임 동작을 보증하지 않는다.

## 1. 확인한 핵심 프런트엔드 파일

| 파일 | 조사한 Blob SHA | 관찰된 기능 | 목표 아키텍처 분류 |
|---|---|---|---|
| public/track.html | 3e657eb784507e6a6bb6e282cd6e4df3b28ee244 | 개별 트랙, TL3 재생·충전, 좋아요, 댓글, 팔로우, 플레이리스트, 공유, 다운로드/열기, 악보 보기, 창작권 증명서 UI | INTEGRATE + ADAPT |
| public/dashboard.html | 6b566d4a6415b79cdc21143e6ffabfe7f8ee21e1 | 회원 대시보드, 잔액, 내 콘텐츠, 카페, 미션, 채굴/POC, DJ 방송 세트 관련 기능 | INTEGRATE + REBUILD UI ONLY |
| public/creator.html | 34ce35b1176e33c165abe025ff498eb670b3fe5e | MP3 업로드, ID3 메타, LP 분석, Local Agent, SharePlace 등록, TL3 release, 자산/증명서 요청 | KEEP FLOW + ADAPT |
| public/creator-studio.html | 84418a4ca8bdee59c7bfea6e87114fe12bbf75bc | 별도 단계형 업로드, 원본 업로드, 무료 MP3 공개, TL3 등록 | CONFLICTING LEGACY FLOW; 신규 경로에서는 비활성화·통합 필요 |
| public/shareplace.html | 14dfb038111372bcd921ac5eb5dc67744f276388 | 콘텐츠 탐색, 유형·장르·정렬·보기 필터, TL 잔액 확인, 재생, 인증 정보 | INTEGRATE + ADAPT |
| public/radio.html | ac16e0b4cad539e709e186f08773123ff09d8e71 | 방송 허브, 음악 재생, Cafe/InCar 채널 조회, TL 충전·결제 | KEEP + INTEGRATE |
| public/dj-center.html | b44db16e61171fb78159dd71b03d84a001af1d0c | DJ 프로필, 카페 신청, 파일 목록, 방송 세트, 라이브 방송, 계약, 라이브 DJ 탐색 | KEEP + INTEGRATE |
| public/wallet.html | 0c15a6d8ee7db34f2ea05e0021b00736ef981da8 | 별도 지갑·충전·전환·채굴 화면 | KEEP API; RECONCILE UI |
| public/ads.html | e71f160730da36351150c701704df1517d41fdcd | 광고 시청, Google IMA SDK 로더, 광고 보상 API 호출, 광고 목록 | KEEP/ADAPT + PROVIDER AUDIT |
| public/advertiser.html | b83278dde10be3aa5af4b706d9f9f8be4dfa6106 | 광고주 로그인/가입, 캠페인 생성, 광고 목록, 상태 전환, 통계, 예산/소재 | KEEP + INTEGRATE |
| public/sidebar.js | d2a03f6a78186c025e97e4ff0ab87282858520a4 | 공통 사이드바 메뉴 주입, 로컬 사용자 잔액 표시 | REBUILD AFTER PAGE INVENTORY |

## 2. Track Page — 이미 구현된 기능과 추가할 기능

### 확인된 구현
- `GET /api/shares/:id`로 트랙/자산 상세 조회
- `GET /api/social/stats/:id`로 소셜 통계 조회
- `GET /api/shares/:id/my-tl`로 개인 파일 TL 잔액 조회
- 좋아요 상태 및 좋아요 수 표시
- 댓글 목록 로드 및 댓글 등록 UI
- 아티스트/업로더 팔로우
- 플레이리스트 모달 및 생성
- 공유 모달과 외부 공유 채널(카카오톡, X, Facebook 등)
- TL 충전, 재생, TL3 다운로드/열기
- 저작권 정보 및 가사 영역
- 악보 보기 및 TLD 악보 다운로드 연동
- 소유자 커버 이미지 변경 UI
- 곡 소유자에 대한 일부 관리 동작

### 통합 아키텍처에서 확장할 항목
- 트랙별 고유 공개 URL/ID를 안정적으로 보장
- 아티스트가 해당 곡에 직접 홍보 게시물·이미지·공지 등록
- 댓글 답글, 신고, 수정·삭제 및 알림 정책 점검
- 좋아요·댓글·공유·저장·팔로우의 중복 방지와 서버 검증
- 트랙 소유자/관리자 전용 통계 및 곡 관리 패널
- 일반 방문자 화면과 소유자 관리 화면의 권한 분리
- 앨범 페이지와 트랙 페이지 간 정식 관계 및 카탈로그 연결

현재 Track 페이지는 사용자의 최근 요구(좋아요·댓글·공유)가 처음부터 전혀 없던 화면이 아니다. 이미 일부 소셜 기능이 존재하므로 재작성보다 기존 기능과 API를 보존하고 곡별 홍보·운영 기능을 확장하는 방향이 적절하다.

## 3. 개인 대시보드 및 파일 관리

### Dashboard 현황
- 자체 상단바와 사이드바, 탭 패널을 포함한 독립 화면
- TL/TLC/POC 표시
- 내 콘텐츠 조회 및 삭제
- 콘텐츠를 DJ 방송 세트로 선택하는 기능
- Cafe 탭, 미션, 채굴 이력, POC 계산/채굴 및 TL 교환 관련 호출
- 비밀번호 변경 등 계정 기능

### 격차
- My Dashboard와 My Files가 아직 명확한 독립 업무 공간으로 분리되어 있지 않다.
- Dashboard의 내 콘텐츠 탭은 파일 라이브러리의 완전한 대체가 아니다.
- 현재 내 콘텐츠 로딩은 `/api/shares` 전체 목록을 가져온 뒤 클라이언트에서 user_id로 필터링한다. 소유자 전용 서버 API와 권한 검증을 확인해야 한다.
- 현재 목록은 TL3와 비-TL3를 구분하고 FREE 상태를 표시하는 레거시 구조다.
- 파일 삭제가 공유 자산, 원본 파일, TL 파일, 발행 기록에 어떤 영향을 주는지 백엔드 계약을 확인해야 한다.

### 목표
- My Dashboard: 통합 요약 및 빠른 작업
- My Files: 원본·TL 파일의 라이브러리, 상태·유형·버전·관계 관리
- My Assets: 창작·소유·위임 관리·저장 상태를 구분한 자산 관리
- My Music: 아티스트의 앨범·트랙 운영 전용 보기

## 4. Creator / Local Agent / TL3 흐름

### 확인된 경로
- `creator.html`은 로그인 토큰 및 사용자 정보를 localStorage에서 읽는다.
- 원본 MP3를 브라우저에서 읽고 SHA-256 해시를 계산한다.
- Local Agent 기본 주소 `http://127.0.0.1:8787`의 `/health`를 확인한다.
- Local Agent의 `/upload?kind=mp3&name=...`로 원본을 업로드한다.
- API의 `/api/upload`, `/api/shares`, `/api/files/sync`, `/api/v1/tl3/releases`, `/api/v1/assets`, `/api/v1/assets/:id/certify` 경로를 사용한다.
- 코드 주석은 TL3 v3를 서버에서 빌드한다고 설명한다.
- 업로드는 파일 등록, 동기화, TL3 발행, 자산 등록/인증 등 여러 단계로 구성된다.

### 중요한 확인 사항
- Creator는 단순 파일 입력 폼이 아니다. 로컬 에이전트와 API 간 순서가 있는 복합 워크플로다.
- 기존 UI를 바꾸더라도 이 순서, 실패 처리, 재시도 및 API 계약을 먼저 테스트해야 한다.
- 같은 파일의 업로드·동기화·TL3 release가 중복 생성되지 않도록 idempotency와 복구 전략을 확인해야 한다.
- 소스 코드 일부에 XOR/TLNK v2 관련 헬퍼가 남아 있고, 다른 경로는 서버 빌드 TL3 v3를 설명한다. 실제 활성 경로와 운영 TL3 규격을 대조하기 전에는 암호화 코드를 변경하지 않는다.
- Creator와 creator-studio.html이 중복·상충 흐름을 가진다. 목표 UX에서는 Creator 한 곳으로 통합하되 기존 API/작동 경로를 보존한다.

## 5. SharePlace 및 정책 충돌

확인된 기능:
- `/api/shares`, `/api/v1/shareplace` 조회
- 유형·장르·정렬·그리드/리스트·페이지네이션
- 개인 TL 잔액 로드
- 스트림 프록시 경로
- 트랙 상세 페이지 연결

확인된 정책 충돌:
- UI에 '무료 MP3' 유형 필터와 FREE 가격 표시가 남아 있다.
- 코드상 무료 MP3 콘텐츠는 재생을 막는 안내 분기도 있으나 화면에 무료 유형으로 노출되는 로직이 존재한다.
- 이는 TL 보호 자산만 공유·유통한다는 최신 제품 원칙과 충돌한다.

조치 원칙:
- 기존 데이터 및 레코드는 감사·이관 대상으로 보존한다.
- 신규 SharePlace UX에서는 원본 MP3를 공개 자산 유형으로 제공하지 않는다.
- 신규 공개·재생은 보호된 TL 자산만 허용한다.
- 기존 레거시 데이터 정리와 API 변경은 별도 마이그레이션·회귀 테스트 후 수행한다.

## 6. TL방송국 / DJ / Cafe / InCar

- radio.html은 SharePlace 음악과 Cafe/InCar 채널을 조회하고 TL 결제/충전 UI를 가진다.
- dj-center.html은 프로필, 카페 신청, 내 파일, 방송 세트, 라이브 방송, 계약, 라이브 DJ 조회 기능과 `/api/dj-cafe/*` 계열 API를 사용한다.
- dashboard.html에도 DJ 방송 세트에 콘텐츠를 선택·전달하는 기능이 존재한다.
- 이들은 단절된 메뉴가 아니라 공통 자산·계정·시간 이용·경제 기반을 공유하는 활동 영역으로 통합한다.
- 기존 방송·계약·채널의 동작을 조사하지 않고 TL방송국을 단순 플레이어 페이지로 축소하지 않는다.

## 7. 광고 구현 현황 및 위험 확인

### 광고 시청 화면
- ads.html은 Google IMA SDK 스크립트 로더를 포함한다.
- IMA 광고 요청 및 완료 핸들러가 존재한다.
- `/api/ads/available`, `/api/eco/ad-reward` 호출이 존재한다.
- 일부 보상 처리 코드에 API 실패 시 클라이언트 localStorage 잔액을 증가시키는 fallback이 관찰된다. 이는 실제 서버 원장과 불일치할 수 있으므로 우선 위험 검토 대상이다. 클라이언트 표시 잔액을 서버 권위형 잔액으로 취급해서는 안 된다.

### 광고주 센터
- 별도 biz_user/biz_token 세션 사용
- `/api/ads/my`, `/api/ads/create`, `/api/ads/:id/toggle`, `/api/ads/:id` 호출
- 광고 생성, 예산, 소재, 통계, 상태 변경 및 삭제 기능 존재
- 광고주 화면은 별도 업무 공간으로 보존하고 공통 Ad Engine 및 경제 원장에 연결한다.

### 연동 관련 한계
- IMA SDK 로더 존재는 Google 광고 계정/인벤토리/실제 광고 호출/정산 연동을 입증하지 않는다.
- 광고 네트워크 API 연결은 공급자별 승인·정책·계약·서버 자격증명·콜백 검증을 별도 확인한다.
- 직접 광고, 외부 공급 광고, 제휴 광고의 이벤트 및 정산을 분리한다.
- 광고 완료 이벤트만으로 POC/TLC를 지급하지 않는다.

## 8. 공통 내비게이션 및 디자인 셸

- sidebar.js는 현재 방송, 내 방송, 플랫폼, 기타 그룹을 구성한다.
- 사이드바 로고는 TimeLink 홈이 아닌 TL방송국으로 연결된다.
- sidebar.js는 기존 aside.sidebar를 교체하거나 .app/body에 삽입하는 방식이다.
- dashboard, creator, wallet, ads, advertiser는 자체 레이아웃/사이드바 스타일을 가진다.
- 모든 페이지가 동일한 사이드바 로더를 쓰는 것은 아니며, 전역 주입 시 기존 페이지 구조를 손상시킬 수 있다.

따라서 통합 셸은 별도 신규 경로에서 검증하고, 페이지별로 점진 적용한다. 기존 sidebar.js를 즉시 전면 교체하지 않는다.

## 9. 다음에 조사해야 할 백엔드 항목

이 인벤토리는 프런트엔드 정적 조사다. 개발 착수 전 다음을 확인한다.

1. 실제 API 라우트 전체와 인증 미들웨어
2. `shares`, `tl_files`, `tl_user_files`, TL3 releases, assets, rights/certification 관련 D1 테이블
3. /api/shares 목록이 공개/회원/소유자 권한별로 어떻게 필터링되는지
4. 댓글·좋아요·팔로우·플레이리스트 API 및 DB 제약조건
5. 원본 파일 및 TL3 파일의 실제 저장 위치와 Local Agent 통신 구조
6. TL3 v2/v3 활성 경로, 암호화 규격, 세그먼트 전달 및 TL 차감의 서버 권위성
7. 광고 완료 검증, 보상 원장, 일일 한도 및 외부 IMA/광고 공급자 연동 여부
8. 지갑 잔액 계산·캐시·거래 원장의 단일 진실 공급원
9. Cafe/InCar 계약 및 POC 정책의 서버 계산과 현재 실제값
10. 기존 운영 배포 브랜치·도메인 라우팅·롤백 경로

## 10. 권장 작업 우선순위

1. 백엔드 API·D1·Local Agent 및 저장소 실제 구조 인벤토리
2. 페이지별 사용자 행동·API 의존성·역할 접근 매핑
3. My Dashboard / My Files / My Assets 데이터 경계 확정
4. Track Page 기존 소셜 API 보존 및 곡별 홍보 기능 설계
5. Creator 단일 흐름 설계 및 중복 무료 MP3 경로 격리 계획
6. TimeLink Label/외부 발매 이력 연동 설계
7. SharePlace TL-only 공개 정책의 점진적 전환
8. 광고 이벤트·보상·정산의 서버 권위성 검증
9. 신규 셸과 화면을 별도 경로에 구현하고 E2E 회귀 테스트

## 11. 다음 산출물

- DOMAIN_DATA_MODEL.md
- ROUTES_AND_NAVIGATION.md
- ADR_STORAGE_AND_DELIVERY.md
- IMPLEMENTATION_PLAN.md


## 12. 추가 조사 — React 실험 앱과 실제 빌드 상태

### React 소스 존재
기본 브랜치의 `src/` 아래에 React/TSX 기반 실험 앱이 존재한다.
- `src/App.jsx`, `src/main.jsx`
- `src/pages/mainapp/*`
- `src/components/auth/LoginForm.tsx`
- `src/hooks/useTimeLinkSystem.ts`

### 현재 판단
- 저장소 루트 트리에 `package.json` 및 Vite/React 빌드 설정이 확인되지 않았다. Local Agent 하위의 package.json은 Local Agent 실행용이며 프런트엔드 빌드 설정이 아니다.
- React 컴포넌트 간 import 경로가 실제 파일명/대소문자와 맞지 않는 사례가 보인다. 예: Header/Tabs 디렉터리 대소문자, Dashboard/Createtab/Librarytab 파일명, SunoConverter 경로 등.
- App은 로그인 이후 userData를 전달하지만 MainApp에서 Header에 user={null}을 전달하는 등 상태 전달이 끊긴 부분이 있다.
- React Dashboard, SharePlaceTab, RadioTab, CarTab, CreateTab에는 하드코딩된 샘플/데모 동작이 존재한다. SharePlaceTab의 샘플 음악과 다운로드 버튼, RadioTab의 alert 재생, CreateTab의 alert 업로드는 운영 기능으로 간주하지 않는다.
- React Hook의 일부 데이터는 실제 API 연결·서버 원장과 대조되지 않은 초기/샘플 상태로 보인다.

### 결론
React 소스는 화면 아이디어 및 일부 컴포넌트 참고 자산으로 보존한다. 빌드·라우팅·인증·API·권한·실제 데이터 연동을 확인하기 전까지 운영 프런트엔드의 기반으로 채택하지 않는다. 신규 화면은 현행 Cloudflare Pages 정적 배포와 호환되는 별도 renewal 경로에서 먼저 구현·검증한다. 추후 React 앱을 정식 기반으로 채택하려면 빌드 설정과 전체 화면을 별도 이관 계획으로 확정한다.

## 13. 추가 조사 — 백엔드 API 및 데이터 현황

### 라우팅과 기존 API
- `src/index.ts`에서 Hono 앱으로 API를 구성한다.
- `/api/shares`는 `/api/v1/shareplace` 라우터의 레거시 호환 경로로 연결된다.
- 인증, 사용자, 파일, 재생, SharePlace, 관리자, Cafe, DJ, DJ-Cafe, 결제, 경제, 광고, 설정 등의 라우터가 연결되어 있다.
- `/api/storage/*`에서 Google Drive/OneDrive 연결, OAuth callback, 업로드 세션, 완료 및 객체 등록·스트리밍 경로가 구현되어 있다.
- 프런트엔드의 기존 Local Agent 업로드는 이 외부 클라우드 OAuth 경로와 별개의 로컬 파일 저장/전달 방식이다.

### 소셜 백엔드의 실제 상태
- `GET /api/social/stats/:id`는 현재 0 통계의 임시 응답이다.
- 좋아요 POST/DELETE는 현재 실제 DB 상태를 관리하지 않는 스텁 응답이다.
- 팔로우 상태/추가/삭제도 스텁 응답이다.
- 댓글 조회/등록은 `social_comments` 테이블을 사용하는 실제 DB 경로가 있으나, 답글·편집·삭제·알림 등은 별도 확인이 필요하다.
- 댓글 신고 API는 임시 성공 응답이다.
- 플레이리스트 조회/생성/추가 API도 임시 스텁 응답이다.

따라서 Track Page의 UI에 좋아요·팔로우·플레이리스트 버튼이 있다는 사실과 해당 기능이 서버에서 영속적으로 동작한다는 사실을 구분해야 한다. 소셜 기능은 API 및 DB 제약조건을 정식 구현하고 통합 테스트해야 한다.

### 데이터 모델 및 정책 충돌
- 초기 마이그레이션에 `users`, `tl_files`, `transactions`, `auth_requests`, `play_events`, `disputes`, `poc_events` 등이 존재한다.
- SharePlace의 현재 구현은 `tl_shares`를 런타임에 생성·확장하는 코드 경로를 포함한다.
- SharePlace 등록 라우트에는 무료 MP3 경로와 해당 경로의 POC 기록이 남아 있어 TL-only 정책과 충돌한다.
- 파일/자산 모델이 `tl_files`, `tl_shares`, TL3 release, assets 및 외부 storage object로 나뉘어 있으므로, 새 My Files에서 이를 임의로 하나의 테이블로 합치지 않는다. 공통 Asset Registry 관점의 논리 모델을 먼저 만들고 기존 테이블과 매핑한다.

### 보상·정산 위험
- `ads.html`의 클라이언트 보상 fallback뿐 아니라, 광고 백엔드의 이벤트·보상 지급·예산 차감·무효 트래픽 처리 흐름을 함께 조사해야 한다.
- 현재 재생 백엔드의 일부 경로에 수익 배분과 Car Mode 배율이 상수로 정의되어 있다. 이는 최신 Cafe/InCar 정책 및 관리자 정책과 충돌할 수 있으므로 실제 운영 경로와 적용 범위를 확인하기 전에는 수정하지 않는다.
- TL 잔액·TLC·POC 및 창작자 정산은 각 화면의 localStorage 표시값이 아니라 서버 원장과 실제 API가 단일 권위 원천이어야 한다.

## 14. 보안 점검 즉시 조치 항목

백엔드 기본 브랜치의 `wrangler.toml`에서 외부 서비스용 API 자격증명으로 보이는 값이 일반 변수로 저장소에 직접 포함된 것을 확인했다. 유효 여부는 이 정적 조사만으로 판단할 수 없지만 공개 저장소이므로 노출된 것으로 간주한다.
- 제공자 대시보드에서 해당 자격증명을 폐기하고 재발급한다.
- Cloudflare Worker Secret 등 비밀 저장소로 이동한다.
- 코드에는 변수 이름만 남기고 실제 값은 커밋하지 않는다.
- Git history 및 배포 로그 노출 가능성도 검토한다.
- 동일 자격증명이 다른 저장소·환경·개발 PC에 복사되었는지 확인한다.
- 이 조치는 플랫폼 UI 개발과 별개로 우선 처리한다.

## 15. 수정된 우선 작업 순서

1. 공개 저장소에 포함된 자격증명 교체 및 비밀 저장소 이전
2. 백엔드 전체 라우트·인증·DB 테이블·실제 배포 상태 인벤토리 완성
3. Local Agent / Google Drive / OneDrive 저장 흐름 및 권한 모델 확인
4. TL3 v2/v3 실제 활성 경로와 저장 위치 결정
5. Social Core의 좋아요·팔로우·댓글·플레이리스트 영속 기능 구현 설계
6. My Dashboard / My Files / My Assets 논리 모델과 기존 DB 매핑
7. Track Page 곡별 홍보 및 관리 기능 설계
8. Creator 단일 워크플로 및 TimeLink Label 발행 경로 설계
9. SharePlace의 신규 TL-only 공개 정책 전환
10. Ads 이벤트·보상·정산의 서버 권위성 검증
11. 신규 renewal UI를 별도 경로로 구현하고 기존 API 회귀 테스트
