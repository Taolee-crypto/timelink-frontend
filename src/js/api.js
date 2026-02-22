/**
 * TimeLink — API Configuration
 * 모든 API 호출은 이 파일을 통해 관리됩니다.
 * Cloudflare Worker URL: https://api.timelink.digital
 */

const API_BASE = 'https://api.timelink.digital';

// ============================================================
// 공통 fetch 헬퍼
// ============================================================
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('tl_token');

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      }
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || `HTTP ${res.status}`);
    }

    return { ok: true, data };
  } catch (err) {
    console.error(`[API] ${path}:`, err);
    return { ok: false, error: err.message };
  }
}

// multipart/form-data 전송 (파일 업로드)
async function apiFetchForm(path, formData) {
  const token = localStorage.getItem('tl_token');
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// ============================================================
// Auth API
// ============================================================
const AuthAPI = {
  async signup(username, email, password) {
    return apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password })
    });
  },

  async login(email, password) {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async logout() {
    localStorage.removeItem('tl_token');
    localStorage.removeItem('tl_user');
    window.location.href = '/login.html';
  },

  async getProfile() {
    return apiFetch('/auth/me');
  }
};

// ============================================================
// Balance API
// ============================================================
const BalanceAPI = {
  async get() {
    return apiFetch('/balance');
  },

  async rechargeTL(amount) {
    return apiFetch('/balance/recharge', {
      method: 'POST',
      body: JSON.stringify({ amount: Number(amount) })
    });
  },

  async getHistory() {
    return apiFetch('/balance/history');
  }
};

// ============================================================
// Tracks API
// ============================================================
const TracksAPI = {
  async getHotPulse(limit = 20) {
    return apiFetch(`/tracks/hot?limit=${limit}`);
  },

  async getMyTracks() {
    return apiFetch('/tracks/mine');
  },

  async getTrack(id) {
    return apiFetch(`/tracks/${id}`);
  },

  async uploadTrack(formData) {
    return apiFetchForm('/tracks/upload', formData);
  },

  async deleteTrack(id) {
    return apiFetch(`/tracks/${id}`, { method: 'DELETE' });
  }
};

// ============================================================
// Pulse API  (재생 중 실시간 정산)
// ============================================================
const PulseAPI = {
  // 재생 시작 (서버에 세션 생성)
  async startPlay(trackId) {
    return apiFetch('/pulse/start', {
      method: 'POST',
      body: JSON.stringify({ trackId })
    });
  },

  // 주기적 pulse 전송 (매 10초)
  async heartbeat(sessionId, seconds) {
    return apiFetch('/pulse/heartbeat', {
      method: 'POST',
      body: JSON.stringify({ sessionId, seconds })
    });
  },

  // 재생 종료
  async endPlay(sessionId) {
    return apiFetch('/pulse/end', {
      method: 'POST',
      body: JSON.stringify({ sessionId })
    });
  },

  // 플랫폼 전체 실시간 현황
  async getLive() {
    return apiFetch('/pulse/live');
  }
};

// ============================================================
// Mining API
// ============================================================
const MiningAPI = {
  async getStatus() {
    return apiFetch('/mine/status');
  },

  async claim() {
    return apiFetch('/mine/claim', { method: 'POST' });
  }
};

// ============================================================
// 유틸 — Toast 알림
// ============================================================
function toast(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

// ============================================================
// 유틸 — 로그인 확인 (인증 필요 페이지에서 호출)
// ============================================================
function requireAuth() {
  const token = localStorage.getItem('tl_token');
  if (!token) {
    window.location.href = '/login.html';
    return null;
  }
  return JSON.parse(localStorage.getItem('tl_user') || '{}');
}

// ============================================================
// 유틸 — 숫자 포맷
// ============================================================
function fmtNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n || 0);
}

function fmtTime(sec) {
  const m = Math.floor(sec / 60);
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}
