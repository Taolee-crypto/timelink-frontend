timelink/
├── public/                     # 정적 파일 (GitHub Pages가 여기를 읽음)
│   ├── index.html              # 메인 진입점 (기존 파일 대체)
│   ├── favicon.svg
│   ├── manifest.json           # PWA + TON Connect용
│   └── assets/                 # 이미지, 폰트, 아이콘 등
│       ├── images/
│       ├── fonts/
│       └── icons/
├── src/                        # 소스코드 (개발용)
│   ├── css/
│   │   ├── main.css            # 전체 스타일 (기존 스타일 대체/확장)
│   │   ├── hero.css            # 히어로 전용 스타일
│   │   ├── glassmorphism.css
│   │   └── animations.css
│   ├── js/
│   │   ├── main.js             # App, Auth 등 핵심 로직 (기존 스크립트 대부분 이동)
│   │   ├── auth.js
│   │   ├── tl3.js              # TL3/TL4 생성·파싱·검증
│   │   ├── player.js           # 재생 + 실시간 정산
│   │   ├── contribution.js
│   │   ├── mining.js
│   │   ├── gold.js
│   │   └── ui.js               # 모달, 토스트, 테마 전환 등 UI 헬퍼
│   └── components/             # 재사용 가능한 HTML 조각 (옵션)
│       ├── hero.html
│       ├── stats-card.html
│       └── recharge-modal.html
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages 자동 배포 (선택)
├── CNAME                       # 기존 파일 유지 (timelink.github.io → 커스텀 도메인)
├── .nojekyll                   # 기존 파일 유지
└── README.md                   # 새로 작성 (프로젝트 설명 + 설치 방법)
# TimeLink Front-End

TimeLink 플랫폼의 프론트엔드 (정적 웹사이트)

## 기술 스택
- HTML/CSS/JS
- Tailwind CSS 또는 Glassmorphism 스타일
- WebSocket 클라이언트 (auth.js, mining.js, player.js 등)

## 디렉토리 구조
├── public/         # 정적 파일 (favicon, manifest, assets)
├── src/
│   ├── css/        # 스타일 파일
│   ├── js/         # 기능별 스크립트 (auth, mining, player, ui 등)
│   └── components/ # 재사용 컴포넌트 (hero, stats-card 등)
├── templates/      # 서버사이드 템플릿 (필요 시)
└── tests/          # 테스트 코드

## 배포
GitHub Pages 또는 Vercel/Netlify에 연결됨

백엔드 API: https://api.timelink.digital (또는 별도 저장소)

## 현재 MVP 작동 화면 (로컬 테스트)

<image-card alt="MVP 잔고 확인 화면" src="https://user-images.githubusercontent.com/너의아이디/이미지링크.png" ></image-card>

- 버튼 클릭 시 백엔드 API 호출 → 잔고 실시간 표시 성공
- 백엔드: http://localhost:8000/tl/balance

## 현재 MVP 작동 화면 (2026.02.21 기준)

<image-card alt="MVP 잔고 확인 & 충전" <img width="620" height="243" alt="image" src="https://github.com/user-attachments/assets/2fe889df-cf2d-4511-b436-b2105885c36a" />
" ></image-card>

- TL 잔고 확인 버튼 → 실시간 잔고 표시
- 충전 입력 → 잔고 증가 & 자동 갱신
- 백엔드 API 연결 성공 (localhost:8000 → 공개 도메인 반영)
