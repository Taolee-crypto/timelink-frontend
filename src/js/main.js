/**
 * TimeLink — Player Engine v2
 * GameState 연동: TL 소비, Locked TL, Pulse, Car Mode
 */

// ============================================================
// 플레이어 상태
// ============================================================
const PlayerState = {
  trackId:        null,
  sessionId:      null,
  isPlaying:      false,
  elapsed:        0,
  heartbeatTimer: null,
  uiTimer:        null,
  audio:          new Audio()
};

// ============================================================
// 플레이어 바 초기화
// ============================================================
function initPlayerBar() {
  PlayerState.audio.addEventListener('timeupdate', onTimeUpdate);
  PlayerState.audio.addEventListener('ended', onTrackEnded);
  PlayerState.audio.addEventListener('error', () => toast('오디오 로드 실패', 'error'));
}

// ============================================================
// 트랙 로드 & 재생
// ============================================================
async function loadTrack(trackId, audioUrl, title, artist) {
  // 기존 세션 종료
  if (PlayerState.sessionId) {
    await PulseAPI.endPlay(PlayerState.sessionId);
    clearInterval(PlayerState.heartbeatTimer);
    clearInterval(PlayerState.uiTimer);
  }

  PlayerState.trackId = trackId;
  PlayerState.elapsed = 0;

  // UI 업데이트 — Now Playing Card & Player Bar
  _setNowPlayingUI(title, artist);

  // 오디오 로드
  if (audioUrl) {
    PlayerState.audio.src = audioUrl;
    PlayerState.audio.load();
  }

  // Pulse 세션 시작 (로그인 시)
  const token = localStorage.getItem('tl_token');
  if (token) {
    const { ok, data } = await PulseAPI.startPlay(trackId);
    if (ok) PlayerState.sessionId = data.sessionId;
  }

  // 재생
  try {
    await PlayerState.audio.play();
  } catch(e) {
    console.warn('[Player] autoplay blocked:', e.message);
  }
  PlayerState.isPlaying = true;
  _updatePlayIcon(true);

  // 플레이어 바 표시
  const bar = document.getElementById('player-bar');
  if (bar) bar.classList.remove('hidden');

  // 1초마다 — TL 소비 + Pulse + UI
  PlayerState.uiTimer = setInterval(async () => {
    if (!PlayerState.isPlaying) return;
    PlayerState.elapsed++;

    // TL 소비 (1초 = 1 TL 기본)
    const canContinue = GameState.consumeTL(1);
    if (!canContinue) {
      stopPlay();
      toast('⚠️ TL 잔액 부족 — 재생 중단', 'error');
      return;
    }

    updateBalanceUI?.();
    _updateProgressUI();

  }, 1000);

  // 10초마다 서버 heartbeat
  PlayerState.heartbeatTimer = setInterval(async () => {
    if (PlayerState.sessionId && PlayerState.isPlaying) {
      await PulseAPI.heartbeat(PlayerState.sessionId, 10);
    }
  }, 10000);
}

// ============================================================
// 재생 / 일시정지 토글
// ============================================================
function togglePlay() {
  if (!PlayerState.trackId) {
    toast('트랙을 먼저 선택하세요', 'info');
    return;
  }
  if (PlayerState.isPlaying) {
    PlayerState.audio.pause();
    PlayerState.isPlaying = false;
    _updatePlayIcon(false);
  } else {
    PlayerState.audio.play().catch(e => toast('재생 실패: ' + e.message, 'error'));
    PlayerState.isPlaying = true;
    _updatePlayIcon(true);
  }
}

// ============================================================
// 정지
// ============================================================
async function stopPlay() {
  clearInterval(PlayerState.uiTimer);
  clearInterval(PlayerState.heartbeatTimer);
  PlayerState.audio.pause();
  PlayerState.audio.currentTime = 0;
  PlayerState.isPlaying = false;
  _updatePlayIcon(false);

  if (PlayerState.sessionId) {
    await PulseAPI.endPlay(PlayerState.sessionId);
    PlayerState.sessionId = null;
  }
  PlayerState.trackId = null;
}

// ============================================================
// 트랙 종료 (자연 완료)
// ============================================================
async function onTrackEnded() {
  clearInterval(PlayerState.uiTimer);
  clearInterval(PlayerState.heartbeatTimer);
  PlayerState.isPlaying = false;
  _updatePlayIcon(false);

  if (PlayerState.sessionId) {
    await PulseAPI.endPlay(PlayerState.sessionId);
    PlayerState.sessionId = null;
  }
  toast('🎵 재생 완료 — Pulse 적립!', 'success');
}

// ============================================================
// 시간 업데이트 (오디오 진행바)
// ============================================================
function onTimeUpdate() {
  const { audio } = PlayerState;
  if (!audio.duration) return;

  const pct = (audio.currentTime / audio.duration) * 100;

  // Player Bar progress
  const pbFill = document.getElementById('pb-fill');
  if (pbFill) pbFill.style.width = pct + '%';

  // Now Playing Card progress
  const npFill = document.getElementById('np-progress-fill');
  if (npFill) npFill.style.width = pct + '%';

  const cur = fmtTime(Math.floor(audio.currentTime));
  const dur = fmtTime(Math.floor(audio.duration));

  const pbEl  = document.getElementById('pb-elapsed');
  const pbDur = document.getElementById('pb-duration');
  const npEl  = document.getElementById('np-elapsed');
  const npDur = document.getElementById('np-duration');

  if (pbEl) pbEl.textContent = cur;
  if (pbDur) pbDur.textContent = dur;
  if (npEl) npEl.textContent = cur;
  if (npDur) npDur.textContent = dur;
}

// ============================================================
// Pulse 카운터 UI
// ============================================================
function _updateProgressUI() {
  const e = PlayerState.elapsed;
  const els = ['np-pulse-count', 'pb-pulse'];
  els.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = fmtNum(e);
  });
}

// ============================================================
// Now Playing UI 설정
// ============================================================
function _setNowPlayingUI(title, artist) {
  ['pb-title', 'np-title'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = title;
  });
  ['pb-artist', 'np-sub'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = artist;
  });
}

// ============================================================
// 재생/일시정지 아이콘
// ============================================================
function _updatePlayIcon(playing) {
  ['np-play-btn', 'pb-play-btn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = playing ? '⏸' : '▶';
  });
}

// ============================================================
// Hot Pulse 목록 로드 (홈 화면용)
// ============================================================
async function loadHotPulse() {
  const container = document.getElementById('hot-pulse-list');
  if (!container) return;

  container.innerHTML = '<div class="flex-center" style="padding:32px"><div class="spinner"></div></div>';
  const { ok, data } = await TracksAPI.getHotPulse(20);

  const tracks = (ok && data?.tracks?.length) ? data.tracks : GameState.sampleTracks;

  if (!tracks.length) {
    container.innerHTML = '<p class="text-muted text-center" style="padding:32px">트랙이 없습니다.</p>';
    return;
  }

  container.innerHTML = tracks.map((t, i) => `
    <div class="track-item" onclick="loadTrack('${t.id}','${t.audioUrl||''}','${escHtml(t.title)}','${escHtml(t.artist||'')}')">
      <div class="track-thumb">${['🎵','🎶','🎸','🥁','🎹','🎺','🎻'][i % 7]}</div>
      <div class="track-info">
        <div class="track-title">${escHtml(t.title)}</div>
        <div class="track-meta">${escHtml(t.artist||'Unknown')} · ${fmtTime(t.duration||0)}</div>
      </div>
      <div class="track-pulse">⚡ ${fmtNum(t.pulseCount||0)}</div>
    </div>
  `).join('');
}

// ============================================================
// 실시간 Live Stats (5초 polling)
// ============================================================
function startLiveStats() {
  async function update() {
    const { ok, data } = await PulseAPI.getLive();
    const stats = ok ? data : {
      listeners: Math.floor(Math.random() * 500) + 100,
      totalPulse: Math.floor(Math.random() * 50000) + 10000,
      activeTracks: Math.floor(Math.random() * 200) + 50
    };
    ['live-listeners','live-pulse','live-tracks'].forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) el.textContent = fmtNum([stats.listeners, stats.totalPulse, stats.activeTracks][i]);
    });
  }
  update();
  setInterval(update, 5000);
}

// ============================================================
// Mining Panel
// ============================================================
function initMining() {
  // 로컬 TLC 값을 표시 (API 호출 병행)
  function updateMineUI() {
    const el = document.getElementById('mine-pending');
    if (el) el.textContent = GameState.wallet.tlc.toFixed(4);
  }
  updateMineUI();
  setInterval(updateMineUI, 3000);
}

async function mineClaim() {
  const btn = document.getElementById('mine-claim-btn');
  if (!btn) return;

  // 로컬 TLC 수령
  if (GameState.wallet.tlc >= 0.0001) {
    const claimed = GameState.wallet.tlc;
    GameState.wallet.tlc = 0;
    btn.disabled = false;
    toast(`TLC ${claimed.toFixed(4)} 수령 완료!`, 'success');
    updateBalanceUI?.();
    return;
  }

  // API 수령 시도
  if (btn) { btn.disabled = true; btn.innerHTML = '<div class="spinner"></div>'; }
  const { ok, data, error } = await MiningAPI.claim();
  if (btn) { btn.disabled = false; btn.textContent = '수령하기'; }

  if (ok) {
    toast(`TLC ${(data.claimed||0).toFixed(4)} 수령!`, 'success');
  } else {
    toast(error || '수령 가능한 TLC가 없습니다', 'info');
  }
}

// ============================================================
// HTML 이스케이프
// ============================================================
function escHtml(str) {
  return String(str || '').replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[m]);
}
