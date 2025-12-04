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

TL Platform은 음원 및 영상 콘텐츠의 저작권 보호와 공정한 수익 분배를 위한 통합 경제 시스템 플랫폼입니다.

## 주요 기능

### 1. TL Studio
- 음원(TL3) 및 영상(TL4) 파일 변환
- 파일 업로드 및 TL 파일 생성
- 내장 플레이어로 콘텐츠 재생

### 2. TL 마켓
- TL3 음원 파일 구매/판매
- 다양한 음원 콘텐츠 제공
- 공정한 가격 정책

### 3. TL Tube
- TL4 영상 파일 스트리밍
- 영상 콘텐츠 구매/판매
- 고화질 영상 재생 지원

### 4. TL 충전 시스템
- 다양한 충전 옵션 제공
- 할인된 가격의 패키지 상품
- 빠른 충전 기능

### 5. 내 라이브러리
- 보유 콘텐츠 파일 관리
- 파일별 TL 충전
- 마켓/Tube 업로드 기능

### 6. 광고 보기
- 광고 시청으로 TL 충전
- 콘텐츠 저작권자와 플랫폼의 공정한 수익 분배

### 7. 통계
- 수익 통계 확인
- 수익 분배 내역 조회
- 업로드 파일 수 관리

## 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **스타일링**: CSS Grid, Flexbox, CSS Variables
- **반응형 디자인**: 모바일 퍼스트 접근 방식
- **데이터 관리**: Local Storage 기반 오프라인 지원

## 설치 및 실행

### 로컬 실행
1. 저장소를 클론합니다:
   ```bash
   git clone https://github.com/yourusername/tl-platform.git
   
