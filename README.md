timelink-front/
├── 📄 index.html                 # 메인 랜딩 페이지 (GET /)
├── 📄 app.html                   # 메인 앱 대시보드
├── 📄 auth.html                  # 로그인/회원가입 (POST /api/auth/login 등)
├── 📄 studio.html                # TL Studio 편집기
├── 📄 market.html                # 뮤직 마켓
├── 📄 tube.html                  # TL 튜브
├── 📄 library.html               # 내 라이브러리
├── 📄 admin.html                 # 관리자 페이지
├── 📄 404.html                   # 404 페이지
│
├── 📁 css/                       # 스타일시트
│   ├── base.css                  # 기본 리셋 및 변수
│   ├── layout.css                # 레이아웃
│   ├── components.css            # 컴포넌트 스타일
│   ├── auth.css                  # 인증 페이지
│   ├── studio.css                # 스튜디오
│   ├── market.css                # 마켓
│   ├── tube.css                  # 튜브
│   ├── library.css               # 라이브러리
│   ├── admin.css                 # 관리자
│   ├── responsive.css            # 반응형
│   └── themes/                   # 테마
│       ├── dark.css
│       └── light.css
│
├── 📁 js/                        # JavaScript 모듈
│   ├── config/                   # 설정 파일들
│   │   ├── endpoints.js          # API 엔드포인트 매핑
│   │   ├── constants.js          # 상수 정의
│   │   └── environment.js        # 환경 설정
│   │
│   ├── api/                      # API 통신 레이어
│   │   ├── index.js              # API 클라이언트 메인
│   │   ├── auth.api.js           # 인증 API (/api/auth/*)
│   │   ├── user.api.js           # 사용자 API (/api/user/*)
│   │   ├── content.api.js        # 콘텐츠 API (/api/content/*)
│   │   ├── studio.api.js         # 스튜디오 API (/api/studio/*)
│   │   ├── market.api.js         # 마켓 API (/api/market/*)
│   │   ├── tube.api.js           # 튜브 API (/api/tube/*)
│   │   ├── copyright.api.js      # 저작권 API (/api/copyright/*)
│   │   ├── payment.api.js        # 결제 API (/api/payment/*)
│   │   └── admin.api.js          # 관리자 API (/api/admin/*)
│   │
│   ├── modules/                  # 기능 모듈
│   │   ├── auth.js               # 인증 관리
│   │   ├── user.js               # 사용자 관리
│   │   ├── studio.js             # 스튜디오 기능
│   │   ├── market.js             # 마켓 기능
│   │   ├── tube.js               # 튜브 기능
│   │   ├── player.js             # 미디어 플레이어
│   │   ├── upload.js             # 파일 업로드
│   │   ├── payment.js            # 결제 처리
│   │   └── notifications.js      # 알림 시스템
│   │
│   ├── utils/                    # 유틸리티
│   │   ├── storage.js            # localStorage/IndexedDB
│   │   ├── formatters.js         # 날짜, 시간, 숫자 포맷팅
│   │   ├── validators.js         # 입력 검증
│   │   ├── file-utils.js         # 파일 처리
│   │   ├── media-utils.js        # 미디어 처리
│   │   ├── dom-utils.js          # DOM 조작
│   │   └── error-handler.js      # 에러 처리
│   │
│   ├── components/               # 재사용 가능한 컴포넌트
│   │   ├── AudioPlayer.js        # 오디오 플레이어 컴포넌트
│   │   ├── VideoPlayer.js        # 비디오 플레이어 컴포넌트
│   │   ├── FileUploader.js       # 파일 업로더
│   │   ├── TimelineEditor.js     # 타임라인 편집기
│   │   ├── MarketItem.js         # 마켓 아이템 카드
│   │   ├── ContentCard.js        # 콘텐츠 카드
│   │   ├── Modal.js              # 모달 컴포넌트
│   │   ├── Toast.js              # 토스트 알림
│   │   └── LoadingSpinner.js     # 로딩 스피너
│   │
│   ├── router/                   # 라우팅
│   │   ├── index.js              # 라우터 메인
│   │   ├── routes.js             # 라우트 정의
│   │   └── auth-guard.js         # 인증 가드
│   │
│   └── app.js                    # 애플리케이션 진입점
│
├── 📁 assets/                    # 정적 리소스
│   ├── images/
│   │   ├── logo.svg
│   │   ├── favicon.ico
│   │   ├── icons/                # 아이콘 세트
│   │   │   ├── home.svg
│   │   │   ├── studio.svg
│   │   │   ├── market.svg
│   │   │   ├── tube.svg
│   │   │   └── library.svg
│   │   └── backgrounds/          # 배경 이미지
│   │
│   ├── fonts/                    # 웹 폰트
│   │   ├── Inter.woff2
│   │   └── Inter.woff
│   │
│   ├── audio/                    # 샘플 오디오
│   │   └── samples/
│   │
│   └── video/                    # 샘플 비디오
│       └── samples/
│
├── 📁 templates/                 # HTML 템플릿 (SPA용)
│   ├── dashboard.html            # 대시보드 템플릿
│   ├── studio-editor.html        # 스튜디오 편집기
│   ├── market-place.html         # 마켓플레이스
│   └── video-player.html         # 비디오 플레이어
│
├── 📁 public/                    # 빌드 출력물 (배포용)
│   └── (빌드 시 생성)
│
├── 📄 package.json               # 프로젝트 설정
├── 📄 package-lock.json          # 의존성 잠금
├── 📄 vite.config.js             # Vite 빌드 설정 (권장)
├── 📄 .env.example               # 환경변수 예시
├── 📄 .gitignore                 # Git 무시 파일
├── 📄 README.md                  # 프로젝트 설명
└── 📄 LICENSE                    # 라이센스
