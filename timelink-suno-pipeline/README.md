# TimeLink × Suno 전체 파이프라인

## 전체 흐름

```
회원 가입/로그인
    ↓
/creator (CreatorGate)
    ↓ [첫 방문 or 미인증]
Suno 플랜 인증 (스크린샷 업로드)
    ↓ Claude Vision 자동 분석
    ↓ Pro / Premier 확인 + 만료일 확인
    ↓ [인증 완료 → D1 저장]
크리에이터 스튜디오 진입
    ↓
Suno 열기 → 음악 생성
    ↓
파일 R2 업로드 + PC 다운로드
    ↓
DistroKid 메타데이터 export + 발행 가이드
    ↓
Spotify URL/ISRC 입력 → 자동 수집
    ↓
tl3 원재료 등록 + 창작자 배지 ★ + TL 보상
```

---

## 프론트엔드 연동

### 라우터 설정

```jsx
// App.jsx 또는 router.jsx
import CreatorGate from './pages/CreatorGate'

<Route path="/creator" element={<CreatorGate />} />
// /creator/studio는 CreatorGate 내부에서 처리
```

### 랜딩페이지 CTA 버튼

```jsx
// 크리에이터 진입 버튼 (인증 여부 자동 처리)
<a href="/creator">음악 만들기 시작 →</a>
```

---

## 백엔드 연동

### 1. 파일 추가

```
src/routes/suno-verify.ts  → timelink-backend/src/routes/
src/routes/music.ts        → timelink-backend/src/routes/
```

### 2. 메인 라우터 (src/index.ts)

```typescript
import sunoVerify from './routes/suno-verify'
import music      from './routes/music'

app.route('/v1/suno',  sunoVerify)
app.route('/v1/music', music)
```

### 3. Secret 등록

```bash
# Claude Vision (Suno 플랜 인증용)
wrangler secret put ANTHROPIC_API_KEY

# Spotify API (트랙 메타 수집용)
wrangler secret put SPOTIFY_CLIENT_ID
wrangler secret put SPOTIFY_CLIENT_SECRET
```

### 4. D1 마이그레이션

```bash
wrangler d1 execute timelink-db \
  --file=migrations/0003_music_pipeline.sql

wrangler d1 execute timelink-db \
  --file=migrations/0004_suno_verification.sql
```

---

## Claude Vision 인증 로직

스크린샷에서 추출하는 필드:

| 필드 | Suno 화면 위치 | 검증 조건 |
|------|--------------|-----------|
| `Current Plan` | 상단 바 | Pro Plan 또는 Premier Plan |
| `Plan End Date` | 상단 바 | 오늘 이후 날짜 |
| `Credits Remaining` | 상단 바 | 참고용 (조건 없음) |

허용 플랜: `Pro Plan`, `Premier Plan`
거부 플랜: `Free`, `Basic` 등

---

## TL 보상 구조

| 행동 | TL |
|------|----|
| 인증 완료 (최초) | +100 TL |
| 음악 업로드 | +200 TL |
| Spotify 연동 | +200 TL |
| tl3 원재료 등록 | +500 TL 최대 |
