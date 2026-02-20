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
