timelink/
├── 📄 index.html                    # 랜딩 페이지
├── 📄 app.html                      # 메인 애플리케이션
├── 📄 auth.html                     # 인증 페이지
├── 📄 studio.html                   # TL Studio 고급 편집기
├── 📄 market.html                   # TL 마켓
├── 📄 tube.html                     # TL 튜브 (비디오 플랫폼)
├── 📄 library.html                  # 내 라이브러리
├── 📄 admin.html                    # 관리자 대시보드
├── 📄 manifest.json                 # PWA 매니페스트
├── 📄 service-worker.js             # 오프라인 지원
├── 📄 robots.txt                    # SEO 설정
├── 📄 sitemap.xml                   # 사이트맵
│
├── 📁 css/                          # 스타일시트
│   ├── main.css                     # 공통 스타일
│   ├── components.css               # 컴포넌트 스타일
│   ├── auth.css                     # 인증 페이지 스타일
│   ├── studio.css                   # 스튜디오 스타일
│   ├── market.css                   # 마켓 스타일
│   ├── tube.css                     # 튜브 스타일
│   ├── responsive.css               # 반응형 스타일
│   └── themes/                      # 테마 파일들
│       ├── dark.css
│       └── light.css
│
├── 📁 js/                           # 자바스크립트
│   ├── app.js                       # 메인 앱 로직
│   ├── auth.js                      # 인증 로직
│   ├── api.js                       # API 통신 모듈
│   ├── studio.js                    # TL Studio 편집기
│   ├── market.js                    # 마켓 기능
│   ├── tube.js                      # 비디오 플레이어
│   ├── player.js                    # 오디오/비디오 플레이어
│   ├── upload.js                    # 파일 업로드
│   ├── i18n.js                      # 다국어 지원
│   ├── pwa.js                       # PWA 기능
│   ├── offline.js                   # 오프라인 지원
│   ├── notifications.js             # 알림 시스템
│   ├── analytics.js                 # 분석 도구
│   └── vendors/                     # 외부 라이브러리
│       ├── waveform.js              # 웨이브폼 생성기
│       ├── ffmpeg.js                # 웹 FFmpeg
│       └── cropper.js               # 이미지 크롭퍼
│
├── 📁 assets/                       # 정적 리소스
│   ├── images/                      # 이미지 파일
│   │   ├── logo.png
│   │   ├── favicon.ico
│   │   ├── icons/
│   │   └── screenshots/
│   ├── audio/                       # 샘플 오디오
│   ├── video/                       # 샘플 비디오
│   └── fonts/                       # 웹 폰트
│
├── 📁 translations/                 # 다국어 파일
│   ├── ko.json                      # 한국어
│   ├── en.json                      # 영어
│   ├── ja.json                      # 일본어
│   ├── zh-cn.json                   # 중국어 간체
│   └── zh-tw.json                   # 중국어 번체
│
├── 📁 components/                   # 웹 컴포넌트
│   ├── file-uploader.html           # 파일 업로더 컴포넌트
│   ├── audio-player.html            # 오디오 플레이어
│   ├── video-player.html            # 비디오 플레이어
│   ├── market-item.html             # 마켓 아이템
│   └── studio-timeline.html         # 타임라인 컴포넌트
│
├── 📁 config/                       # 설정 파일
│   ├── api.config.js                # API 엔드포인트 설정
│   ├── app.config.js                # 앱 설정
│   └── constants.js                 # 상수 정의
│
└── 📁 .github/workflows/           # GitHub Actions
    └── deploy.yml                   # GitHub Pages 자동 배포
