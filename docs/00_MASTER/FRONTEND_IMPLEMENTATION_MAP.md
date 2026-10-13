# TimeLink Frontend Implementation Map

- 상태: 코드 조사 초안 v0.1
- 기준일: 2026-10-14
- 저장소: `Taolee-crypto/timelink-frontend`
- 운영 반영이 아니라 현재 저장소 코드 관찰을 기록한다.

## 1. 프런트엔드 구조의 두 축

현재 저장소에는 두 UI 구조가 공존한다.

### 정적 HTML 기반 `public/`
실제 주요 업무 화면이 다수 위치한다.
- `index.html`: 랜딩/홈
- `login.html`: 로그인
- `shareplace.html`: 콘텐츠 목록·탐색
- `creator.html`: 창작자 업로드
- `creator-studio.html`: 창작자 스튜디오
- `track.html`: 콘텐츠 상세·재생
- `wallet.html`: 지갑
- `dashboard.html`: 사용자 대시보드
- `radio.html`, `cafe-radio.html`, `incar.html`: 방송 관련 화면
- `dj-center.html`, `cafe-owner.html`, `cafe-channel.html`: 운영자/공간 화면

공통 자산:
- `apple-theme.css`, `_track_new.css`, `dropdown-fix.css`
- `sidebar.js`
- `i18n.js`
- `tl3.js`, `tl3-config.js`, `tl3-lp.js`

### React 기반 `src/`
- `src/components/auth/LoginForm.tsx`
- `src/pages/CreatorGate.jsx`
- `src/pages/mainapp/dashboard.tsx`
- `src/pages/mainapp/radiotab.tsx`
- `src/pages/mainapp/shareplacetab.tsx`

현재 두 구조가 실제 사용자에게 어떤 비중으로 제공되는지, React 앱의 빌드·배포 진입점과 정적 HTML 간 관계를 추가 확인해야 한다.

## 2. 핵심 사용자 흐름

### 로그인
- 화면: `public/login.html` 및 React 인증 컴포넌트
- 토큰 저장 키로 `localStorage.tl_token` 사용 코드가 확인됨
- 사용자 정보 저장 키로 `localStorage.tl_user` 사용 코드가 확인됨
- API 경로가 구형 `/api/auth/*`와 버전 경로 `/api/v1/auth/*`로 나뉘므로 실제 화면별 연결 관계를 표준화해야 한다.

### 창작자 업로드
- 화면: `public/creator.html`
- 현재 파일 내 기본 업로드 모드는 `tl3`로 고정하는 코드가 확인됨.
- TL3 옵션과 LP 처리 로직이 포함되어 있음.
- 파일 등록 후 SharePlace metadata 및 저장 API로 연결되는 세부 흐름은 전체 함수 추적이 필요하다.
- 화면 내 과거 무료 MP3 문구·분기와 대표자 최신 방향이 충돌할 수 있으므로 정책 결정 전 UI 변경 금지.

### SharePlace
- 화면: `public/shareplace.html`
- 콘텐츠 목록은 `/api/shares`를 우선 호출하고, 실패 시 `/api/v1/shareplace` 경로를 시도한다.
- TL3/MP3 및 기타 콘텐츠 종류를 판별하는 분기가 존재한다.
- TL 충전/내 TL/장르·정렬·목록 표시 기능이 포함되어 있다.
- IA 문서의 메뉴 구성과 실제 현재 화면의 차이를 대조해야 한다.

### 콘텐츠 상세 및 재생
- 화면: `public/track.html`
- 상세정보·좋아요·팔로우·재생·TL 충전·다운로드 동작이 있다.
- TL3 재생은 `public/tl3.js`의 플레이어 기능과 연결된다.
- 코드에는 TL3 v3 분기와 구형 MP3/기존 TL 로직이 공존한다.
- 온라인 재생 및 오프라인 .tl3 파일 재생 코드가 존재한다.

### 지갑
- 화면: `public/wallet.html`
- 경제 API의 지갑 데이터와 연결되는 것으로 보이나, 전체 API 호출 및 결제 플로우는 추가 추적해야 한다.

## 3. TL3 클라이언트

파일: `public/tl3.js`

관찰된 역할:
- 온라인 TL3 header 요청
- 암호문 segment 요청
- code/lic 관련 요청
- segment confirm 요청
- Web Audio/MediaSource를 통한 재생
- 로컬 .tl3 파일 파싱 및 오프라인 재생
- `localStorage.tl_token` 기반 Authorization 헤더

파일: `public/tl3-config.js`
- `window.TL3_API_BASE`를 통한 API base 설정
- 기본값 및 fallback 설정
- track ID 기반 스트림 URL 생성

조사 메모:
- `tl3.js` 내부에 진단용 console 로그가 다수 남아 있다.
- 온라인 재생 경로가 여러 함수/구현으로 중복되어 보인다.
- 실제 페이지에서 어느 함수를 호출하는지, 구형 경로가 여전히 사용되는지 호출 관계를 추가 추적해야 한다.
- 로그 제거·플레이어 리팩터링은 별도 회귀 테스트 없이 진행하지 않는다.

## 4. Local Agent

파일: `local-agent/server.js`

관찰된 기능:
- 서버 바인딩 주소: `127.0.0.1`
- 업로드 및 파일 제공
- MP3와 TL3 파일명 구분
- 랜덤 파일 토큰
- HTTP Range 지원
- Cloudflare Tunnel 실행 코드

문서상 목적:
- 창작자 PC를 원본 파일 저장·제공 위치로 활용한다.
- 서버는 콘텐츠 메타데이터 및 권한 검증을 맡고, 원본 파일 저장소는 사용자 소유 위치에 둔다.

추가 검증:
- 업로드/다운로드 토큰의 수명과 접근권한
- 터널 URL 변경 시 백엔드 메타데이터 갱신
- 창작자 PC 오프라인 상태 처리
- TLS 및 CORS 허용 범위
- 파일 삭제·교체·복구 정책

## 5. 문서와 화면 구조의 차이

`docs/IA.md`에는 `cafes.html`, `cars.html`, `wallet.html` 등 향후 생성할 페이지가 포함되어 있다. 실제 저장소에는 일부 파일이 존재하지 않거나 IA 문서의 URL과 다른 이름을 사용하는 경우가 있다.

IA는 목표 화면 구조와 현재 구현 화면 구조를 분리해 관리해야 한다.

## 6. 보호해야 할 기존 자산

- `creator.html`, `shareplace.html`, `track.html`은 핵심 운영 화면이다.
- 여러 `.backup` 파일이 저장소에 남아 있다.
- 백업은 복구 후보이지 자동으로 최신 정상본이라고 판단할 수 없다.
- 기존 동작을 변경하기 전에 해당 페이지의 현재 호출 API, DOM ID, 이벤트 흐름을 기록해야 한다.

## 7. 다음 검증

1. 각 HTML 화면의 API 호출 전체 목록 생성
2. 화면별 인증 상태 및 localStorage 사용 관계 정리
3. 업로드→SharePlace 등록→상세→재생→정산의 실제 흐름 추적
4. TL3 온라인·오프라인 플레이어 함수 호출 관계 확인
5. 정적 HTML과 React 앱의 실제 배포 관계 확인
6. 사이드바 IA와 현재 페이지 파일 매핑
7. 핵심 화면별 회귀 테스트 체크리스트 작성
