/**
 * TimeLink Cloudflare Worker
 * 모든 API 엔드포인트 + CORS 처리
 *
 * 배포: wrangler publish
 * URL: https://api.timelink.digital
 */

export interface Env {
  // KV Namespaces (Cloudflare 대시보드에서 생성 후 연결)
  TL_USERS: KVNamespace;
  TL_TRACKS: KVNamespace;
  TL_SESSIONS: KVNamespace;
  TL_BALANCES: KVNamespace;

  // Secrets (wrangler secret put JWT_SECRET)
  JWT_SECRET: string;
}

// ============================================================
// CORS 헤더 — 핵심 수정 포인트
// ============================================================
const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',           // 또는 'https://timelink.digital'
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

function corsResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

function okRes(data: unknown) {
  return corsResponse(data, 200);
}

function errRes(message: string, status = 400) {
  return corsResponse({ ok: false, message }, status);
}

// OPTIONS preflight 처리
function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

// ============================================================
// 간단 JWT (KV 기반 토큰)
// 실제 운영시 jose 라이브러리로 교체 권장
// ============================================================
function genToken(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyToken(token: string, env: Env): Promise<string | null> {
  const userId = await env.TL_SESSIONS.get(`token:${token}`);
  return userId;
}

async function getUserFromRequest(req: Request, env: Env): Promise<string | null> {
  const auth = req.headers.get('Authorization') || '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token) return null;
  return verifyToken(token, env);
}

// ============================================================
// ID 생성
// ============================================================
function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ============================================================
// 라우터
// ============================================================
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();
    const path = url.pathname;

    // Preflight
    if (method === 'OPTIONS') return handleOptions();

    // Health check
    if (path === '/' || path === '/health') {
      return okRes({ status: 'ok', name: 'TimeLink API', version: '1.0.0' });
    }

    // ── Auth ──────────────────────────────────────────────
    if (path === '/auth/signup' && method === 'POST') return handleSignup(request, env);
    if (path === '/auth/login'  && method === 'POST') return handleLogin(request, env);
    if (path === '/auth/me'     && method === 'GET')  return handleMe(request, env);

    // ── Balance ───────────────────────────────────────────
    if (path === '/balance'          && method === 'GET')  return handleGetBalance(request, env);
    if (path === '/balance/recharge' && method === 'POST') return handleRecharge(request, env);
    if (path === '/balance/history'  && method === 'GET')  return handleBalanceHistory(request, env);

    // ── Tracks ────────────────────────────────────────────
    if (path === '/tracks/hot'    && method === 'GET')  return handleHotTracks(request, env, url);
    if (path === '/tracks/mine'   && method === 'GET')  return handleMyTracks(request, env);
    if (path === '/tracks/upload' && method === 'POST') return handleUploadTrack(request, env);
    if (path.match(/^\/tracks\/[\w-]+$/) && method === 'GET')    return handleGetTrack(request, env, path);
    if (path.match(/^\/tracks\/[\w-]+$/) && method === 'DELETE') return handleDeleteTrack(request, env, path);

    // ── Pulse ─────────────────────────────────────────────
    if (path === '/pulse/live'      && method === 'GET')  return handlePulseLive(request, env);
    if (path === '/pulse/start'     && method === 'POST') return handlePulseStart(request, env);
    if (path === '/pulse/heartbeat' && method === 'POST') return handlePulseHeartbeat(request, env);
    if (path === '/pulse/end'       && method === 'POST') return handlePulseEnd(request, env);

    // ── Mining ────────────────────────────────────────────
    if (path === '/mine/status' && method === 'GET')  return handleMineStatus(request, env);
    if (path === '/mine/claim'  && method === 'POST') return handleMineClaim(request, env);

    return errRes('Not Found', 404);
  },
};

// ============================================================
// AUTH
// ============================================================
async function handleSignup(req: Request, env: Env): Promise<Response> {
  const body = await req.json() as { username: string; email: string; password: string };
  const { username, email, password } = body;

  if (!username || !email || !password) return errRes('필수 항목을 입력하세요');
  if (password.length < 6) return errRes('비밀번호는 6자 이상이어야 합니다');

  // 이메일 중복 확인
  const existing = await env.TL_USERS.get(`email:${email}`);
  if (existing) return errRes('이미 사용 중인 이메일입니다', 409);

  const userId = genId();
  const user = { id: userId, username, email, role: 'listener', createdAt: Date.now() };

  // 저장 (비밀번호는 실제 운영 시 bcrypt 사용 권장)
  await env.TL_USERS.put(`user:${userId}`, JSON.stringify({ ...user, password }));
  await env.TL_USERS.put(`email:${email}`, userId);

  // 초기 잔고 (가입 보너스 1000 TL)
  await env.TL_BALANCES.put(`balance:${userId}`, JSON.stringify({ tl: 1000, tlc: 0, totalPulseEarned: 0 }));

  const token = genToken();
  await env.TL_SESSIONS.put(`token:${token}`, userId, { expirationTtl: 60 * 60 * 24 * 30 });

  return okRes({ token, user });
}

async function handleLogin(req: Request, env: Env): Promise<Response> {
  const body = await req.json() as { email: string; password: string };
  const { email, password } = body;

  const userId = await env.TL_USERS.get(`email:${email}`);
  if (!userId) return errRes('이메일 또는 비밀번호가 올바르지 않습니다', 401);

  const raw = await env.TL_USERS.get(`user:${userId}`);
  if (!raw) return errRes('계정을 찾을 수 없습니다', 401);

  const user = JSON.parse(raw);
  if (user.password !== password) return errRes('이메일 또는 비밀번호가 올바르지 않습니다', 401);

  const token = genToken();
  await env.TL_SESSIONS.put(`token:${token}`, userId, { expirationTtl: 60 * 60 * 24 * 30 });

  const { password: _, ...safeUser } = user;
  return okRes({ token, user: safeUser });
}

async function handleMe(req: Request, env: Env): Promise<Response> {
  const userId = await getUserFromRequest(req, env);
  if (!userId) return errRes('인증 필요', 401);

  const raw = await env.TL_USERS.get(`user:${userId}`);
  if (!raw) return errRes('사용자 없음', 404);

  const { password: _, ...user } = JSON.parse(raw);
  return okRes(user);
}

// ============================================================
// BALANCE
// ============================================================
async function handleGetBalance(req: Request, env: Env): Promise<Response> {
  const userId = await getUserFromRequest(req, env);
  if (!userId) return errRes('인증 필요', 401);

  const raw = await env.TL_BALANCES.get(`balance:${userId}`);
  const balance = raw ? JSON.parse(raw) : { tl: 0, tlc: 0, totalPulseEarned: 0 };
  return okRes(balance);
}

async function handleRecharge(req: Request, env: Env): Promise<Response> {
  const userId = await getUserFromRequest(req, env);
  if (!userId) return errRes('인증 필요', 401);

  const { amount } = await req.json() as { amount: number };
  if (!amount || amount <= 0) return errRes('유효하지 않은 금액');

  const raw = await env.TL_BALANCES.get(`balance:${userId}`);
  const balance = raw ? JSON.parse(raw) : { tl: 0, tlc: 0 };
  balance.tl += amount;

  await env.TL_BALANCES.put(`balance:${userId}`, JSON.stringify(balance));

  // 내역 기록
  const histKey = `history:${userId}:${genId()}`;
  await env.TL_BALANCES.put(histKey, JSON.stringify({
    desc: `TL 충전`, amount, currency: 'TL', createdAt: Date.now()
  }), { expirationTtl: 60 * 60 * 24 * 90 });

  return okRes(balance);
}

async function handleBalanceHistory(req: Request, env: Env): Promise<Response> {
  const userId = await getUserFromRequest(req, env);
  if (!userId) return errRes('인증 필요', 401);

  const list = await env.TL_BALANCES.list({ prefix: `history:${userId}:` });
  const history = await Promise.all(
    list.keys.slice(0, 20).map(async k => {
      const raw = await env.TL_BALANCES.get(k.name);
      return raw ? JSON.parse(raw) : null;
    })
  );

  return okRes({ history: history.filter(Boolean).sort((a, b) => b.createdAt - a.createdAt) });
}

// ============================================================
// TRACKS
// ============================================================
async function handleHotTracks(req: Request, env: Env, url: URL): Promise<Response> {
  const limit = Number(url.searchParams.get('limit') || '20');

  const list = await env.TL_TRACKS.list({ prefix: 'track:' });
  const tracks = await Promise.all(
    list.keys.map(async k => {
      const raw = await env.TL_TRACKS.get(k.name);
      return raw ? JSON.parse(raw) : null;
    })
  );

  const sorted = tracks
    .filter(Boolean)
    .sort((a, b) => (b.pulseCount || 0) - (a.pulseCount || 0))
    .slice(0, limit);

  return okRes({ tracks: sorted });
}

async function handleMyTracks(req: Request, env: Env): Promise<Response> {
  const userId = await getUserFromRequest(req, env);
  if (!userId) return errRes('인증 필요', 401);

  const list = await env.TL_TRACKS.list({ prefix: `user-tracks:${userId}:` });
  const tracks = await Promise.all(
    list.keys.map(async k => {
      const trackId = await env.TL_TRACKS.get(k.name);
      if (!trackId) return null;
      const raw = await env.TL_TRACKS.get(`track:${trackId}`);
      return raw ? JSON.parse(raw) : null;
    })
  );

  return okRes({ tracks: tracks.filter(Boolean) });
}

async function handleUploadTrack(req: Request, env: Env): Promise<Response> {
  const userId = await getUserFromRequest(req, env);
  if (!userId) return errRes('인증 필요', 401);

  // multipart form 파싱
  const form = await req.formData();
  const title = form.get('title') as string;
  const genre = (form.get('genre') as string) || '';
  const lang = (form.get('lang') as string) || 'ko';
  const description = (form.get('description') as string) || '';
  const revenueModel = (form.get('revenueModel') as string) || '7-3';
  const file = form.get('file') as File | null;

  if (!title) return errRes('제목은 필수입니다');
  if (!file) return errRes('파일을 첨부하세요');

  const trackId = genId();

  // 실제 구현: R2 버킷에 파일 저장 (현재는 메타데이터만)
  // const audioUrl = await uploadToR2(env, trackId, file);
  const audioUrl = `https://api.timelink.digital/audio/${trackId}`; // placeholder

  const userRaw = await env.TL_USERS.get(`user:${userId}`);
  const user = userRaw ? JSON.parse(userRaw) : {};

  const track = {
    id: trackId,
    userId,
    artist: user.username || 'Unknown',
    title,
    genre,
    lang,
    description,
    revenueModel,
    audioUrl,
    pulseCount: 0,
    duration: 0,
    createdAt: Date.now(),
  };

  await env.TL_TRACKS.put(`track:${trackId}`, JSON.stringify(track));
  await env.TL_TRACKS.put(`user-tracks:${userId}:${trackId}`, trackId);

  return okRes({ track });
}

async function handleGetTrack(req: Request, env: Env, path: string): Promise<Response> {
  const trackId = path.split('/').pop()!;
  const raw = await env.TL_TRACKS.get(`track:${trackId}`);
  if (!raw) return errRes('트랙을 찾을 수 없습니다', 404);
  return okRes(JSON.parse(raw));
}

async function handleDeleteTrack(req: Request, env: Env, path: string): Promise<Response> {
  const userId = await getUserFromRequest(req, env);
  if (!userId) return errRes('인증 필요', 401);

  const trackId = path.split('/').pop()!;
  const raw = await env.TL_TRACKS.get(`track:${trackId}`);
  if (!raw) return errRes('트랙을 찾을 수 없습니다', 404);

  const track = JSON.parse(raw);
  if (track.userId !== userId) return errRes('권한 없음', 403);

  await env.TL_TRACKS.delete(`track:${trackId}`);
  await env.TL_TRACKS.delete(`user-tracks:${userId}:${trackId}`);

  return okRes({ deleted: true });
}

// ============================================================
// PULSE
// ============================================================
async function handlePulseLive(_req: Request, env: Env): Promise<Response> {
  // 실제: KV에서 집계. 여기서는 mock 데이터
  const raw = await env.TL_SESSIONS.get('live-stats');
  const stats = raw ? JSON.parse(raw) : { listeners: 0, totalPulse: 0, activeTracks: 0 };
  return okRes(stats);
}

async function handlePulseStart(req: Request, env: Env): Promise<Response> {
  const userId = await getUserFromRequest(req, env);
  if (!userId) return errRes('인증 필요', 401);

  const { trackId } = await req.json() as { trackId: string };
  if (!trackId) return errRes('trackId 필요');

  const sessionId = genId();
  const session = { sessionId, userId, trackId, startedAt: Date.now(), seconds: 0 };

  await env.TL_SESSIONS.put(`session:${sessionId}`, JSON.stringify(session), { expirationTtl: 3600 });

  return okRes({ sessionId });
}

async function handlePulseHeartbeat(req: Request, env: Env): Promise<Response> {
  const userId = await getUserFromRequest(req, env);
  if (!userId) return errRes('인증 필요', 401);

  const { sessionId, seconds } = await req.json() as { sessionId: string; seconds: number };

  const raw = await env.TL_SESSIONS.get(`session:${sessionId}`);
  if (!raw) return errRes('세션을 찾을 수 없습니다', 404);

  const session = JSON.parse(raw);
  session.seconds += seconds;
  await env.TL_SESSIONS.put(`session:${sessionId}`, JSON.stringify(session), { expirationTtl: 3600 });

  // Pulse 적립 (1초 = 0.001 TL 청취자 보상)
  const reward = seconds * 0.001;
  const balRaw = await env.TL_BALANCES.get(`balance:${userId}`);
  const balance = balRaw ? JSON.parse(balRaw) : { tl: 0, tlc: 0, totalPulseEarned: 0 };
  balance.tl = parseFloat((balance.tl + reward).toFixed(6));
  balance.totalPulseEarned = (balance.totalPulseEarned || 0) + seconds;
  await env.TL_BALANCES.put(`balance:${userId}`, JSON.stringify(balance));

  return okRes({ ok: true, pulseAdded: seconds });
}

async function handlePulseEnd(req: Request, env: Env): Promise<Response> {
  const userId = await getUserFromRequest(req, env);
  if (!userId) return errRes('인증 필요', 401);

  const { sessionId } = await req.json() as { sessionId: string };

  const raw = await env.TL_SESSIONS.get(`session:${sessionId}`);
  if (!raw) return okRes({ ended: true }); // 이미 만료됨

  const session = JSON.parse(raw);

  // 창작자 수익 정산
  const trackRaw = await env.TL_TRACKS.get(`track:${session.trackId}`);
  if (trackRaw) {
    const track = JSON.parse(trackRaw);

    // Pulse 카운트 업데이트
    track.pulseCount = (track.pulseCount || 0) + session.seconds;
    await env.TL_TRACKS.put(`track:${track.id}`, JSON.stringify(track));

    // 창작자 TLC 마이닝 적립
    const creatorBalRaw = await env.TL_BALANCES.get(`balance:${track.userId}`);
    const creatorBal = creatorBalRaw ? JSON.parse(creatorBalRaw) : { tl: 0, tlc: 0 };
    const miningRate = track.revenueModel === '5-5' ? 0.002 : 0.001;
    creatorBal.tlc = parseFloat((creatorBal.tlc + session.seconds * miningRate).toFixed(6));
    await env.TL_BALANCES.put(`balance:${track.userId}`, JSON.stringify(creatorBal));
  }

  await env.TL_SESSIONS.delete(`session:${sessionId}`);

  return okRes({ ended: true, totalSeconds: session.seconds });
}

// ============================================================
// MINING
// ============================================================
async function handleMineStatus(req: Request, env: Env): Promise<Response> {
  const userId = await getUserFromRequest(req, env);
  if (!userId) return errRes('인증 필요', 401);

  const balRaw = await env.TL_BALANCES.get(`balance:${userId}`);
  const balance = balRaw ? JSON.parse(balRaw) : { tl: 0, tlc: 0 };

  return okRes({ pending: balance.tlc || 0, rate: '0.001 TLC/초', total: balance.tlc });
}

async function handleMineClaim(req: Request, env: Env): Promise<Response> {
  const userId = await getUserFromRequest(req, env);
  if (!userId) return errRes('인증 필요', 401);

  const balRaw = await env.TL_BALANCES.get(`balance:${userId}`);
  const balance = balRaw ? JSON.parse(balRaw) : { tl: 0, tlc: 0 };

  const claimed = balance.tlc || 0;
  if (claimed < 0.0001) return errRes('수령 가능한 TLC가 없습니다');

  balance.tlc = 0;
  await env.TL_BALANCES.put(`balance:${userId}`, JSON.stringify(balance));

  return okRes({ claimed, remaining: 0 });
}
