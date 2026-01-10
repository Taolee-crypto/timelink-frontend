src/
├─ core/                          # 공통 엔진 / 서비스 레이어
│  ├─ auth/
│  │   ├─ auth-manager.js         # JWT 관리, 세션
│  │   └─ auth-check.js           # 로그인 체크
│  ├─ wallet/
│  │   └─ wallet-store.js         # TL 잔액, 예약 TL 관리
│  ├─ ledger/
│  │   ├─ ledger-store.js         # Ledger fetch & filter
│  │   └─ ledger-subscriber.js    # WebSocket 실시간 업데이트
│  ├─ api/
│  │   ├─ api-client.js           # Axios / fetch wrapper
│  │   └─ endpoints.js            # API 엔드포인트 정의
│  └─ ws/
│      └─ ledger-ws.js            # WebSocket 연결
│
├─ shared/                        # 모든 역할 공통 UI
│  ├─ layout/
│  │   ├─ Header.jsx
│  │   ├─ Sidebar.jsx
│  │   └─ Footer.jsx
│  ├─ charts/
│  │   ├─ TLConsumptionChart.jsx
│  │   └─ ListenerChart.jsx
│  ├─ tables/
│  │   └─ LedgerTable.jsx
│  ├─ modals/
│  │   └─ ConfirmModal.jsx
│  └─ components/
│      ├─ WalletBadge.jsx
│      ├─ TLAmount.jsx
│      ├─ TimeProgress.jsx
│      └─ SessionStatus.jsx
│
├─ roles/                         # 역할별 대시보드
│  ├─ user/                       # Creator / Listener
│  │   ├─ dashboard/
│  │   │   ├─ Overview.jsx
│  │   │   ├─ Wallet.jsx
│  │   │   ├─ MyMusic.jsx
│  │   │   ├─ AIGenerator.jsx
│  │   │   ├─ AdRewards.jsx
│  │   │   └─ History.jsx
│  │   └─ pages/
│  │       └─ UserDashboard.jsx
│  │
│  ├─ cafe/                       # B2B Node
│  │   ├─ dashboard/
│  │   │   ├─ BroadcastConsole.jsx
│  │   │   ├─ NowPlaying.jsx
│  │   │   ├─ PlaylistManager.jsx
│  │   │   ├─ TimeBurnMeter.jsx
│  │   │   ├─ ListenerStats.jsx
│  │   │   ├─ QualityMonitor.jsx
│  │   │   └─ SubscriptionStatus.jsx
│  │   └─ pages/
│  │       └─ CafeDashboard.jsx
│  │
│  ├─ advertiser/                 # 광고주 (미래 확장)
│  │   ├─ dashboard/
│  │   │   ├─ Campaigns.jsx
│  │   │   ├─ CreativeUpload.jsx
│  │   │   ├─ Targeting.jsx
│  │   │   ├─ Metrics.jsx
│  │   │   └─ Billing.jsx
│  │   └─ pages/
│  │       └─ AdvertiserDashboard.jsx
│  │
│  └─ platform/                   # 운영자 / Admin
│      ├─ dashboard/
│      │   ├─ SystemOverview.jsx
│      │   ├─ LedgerExplorer.jsx
│      │   ├─ UserManagement.jsx
│      │   ├─ CafeManagement.jsx
│      │   ├─ AdEconomy.jsx
│      │   └─ RiskMonitor.jsx
│      └─ pages/
│          └─ PlatformDashboard.jsx
│
├─ pages/                         # 공용 라우팅 페이지
│  ├─ index.jsx                    # 랜딩 / 홈
│  ├─ login.jsx
│  ├─ signup.jsx
│  └─ verify.jsx
│
├─ styles/
│  ├─ globals.css
│  ├─ theme.js
│  └─ layout.css
│
├─ index.js                        # SPA entry
└─ routes.js                       # React Router / role redirect
