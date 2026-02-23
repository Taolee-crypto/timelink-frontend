# TimeLink Backend — Cloudflare Worker

## 빠른 배포 가이드

### 1. 의존성 설치
```bash
npm install
```

### 2. KV Namespace 생성
```bash
npx wrangler kv:namespace create TL_USERS
npx wrangler kv:namespace create TL_TRACKS
npx wrangler kv:namespace create TL_SESSIONS
npx wrangler kv:namespace create TL_BALANCES
```

각 명령어 실행 후 출력된 `id = "..."` 값을 **wrangler.toml**에서 교체하세요.

### 3. wrangler.toml 수정
```toml
[[kv_namespaces]]
binding = "TL_USERS"
id = "abc123..."  # ← 실제 ID로 교체
```

### 4. 로컬 테스트
```bash
npx wrangler dev
# → http://localhost:8787
```

### 5. 배포
```bash
npx wrangler deploy
# → https://timelink-api.YOUR_SUBDOMAIN.workers.dev
```

### 6. 커스텀 도메인 연결
Cloudflare 대시보드 → Workers & Pages → timelink-api → Settings → Triggers → Custom Domains
→ `api.timelink.digital` 추가

---

## API 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| GET | `/health` | 상태 확인 |
| POST | `/auth/signup` | 회원가입 |
| POST | `/auth/login` | 로그인 |
| GET | `/auth/me` | 내 정보 |
| GET | `/balance` | 잔고 조회 |
| POST | `/balance/recharge` | TL 충전 |
| GET | `/balance/history` | 내역 |
| GET | `/tracks/hot` | 인기 트랙 |
| GET | `/tracks/mine` | 내 트랙 |
| POST | `/tracks/upload` | 업로드 |
| GET | `/tracks/:id` | 트랙 조회 |
| DELETE | `/tracks/:id` | 트랙 삭제 |
| GET | `/pulse/live` | 실시간 현황 |
| POST | `/pulse/start` | 재생 시작 |
| POST | `/pulse/heartbeat` | Pulse 전송 |
| POST | `/pulse/end` | 재생 종료 |
| GET | `/mine/status` | 마이닝 현황 |
| POST | `/mine/claim` | TLC 수령 |

## Cloudflare 연결 문제 해결

### 프론트엔드 (index.html)가 API를 못 찾는 경우

1. `src/js/api.js` 의 `API_BASE` 확인:
   ```js
   const API_BASE = 'https://api.timelink.digital';
   ```

2. Worker가 배포되어 있는지 확인:
   ```bash
   curl https://api.timelink.digital/health
   # → {"status":"ok","name":"TimeLink API","version":"1.0.0"}
   ```

3. CORS 문제 시: Worker의 `CORS_HEADERS` 에서 `Access-Control-Allow-Origin` 을 프론트 도메인으로 변경

4. DNS 확인: Cloudflare 대시보드 → DNS → `api` CNAME이 Worker를 가리키는지 확인
