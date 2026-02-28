// ============================================================
// tl-economy.js — TimeLink TL 경제 알고리즘 엔진 v1.0
// 1초 = 1 TL = 1원
// ============================================================

const TL = {

  // ── 소모율 테이블 ──
  RATES: {
    audio:  1.0,   // 음악 (오디오)
    video:  2.0,   // 영상
    lecture: 1.5,  // 강의
    cafe:   0.5,   // 카페방송 (사업자)
    moving: 0.8,   // Moving Radio
  },

  // ── 수익 분배 ──
  SPLIT: {
    A: { creator: 0.70, platform: 0.20, reserve: 0.10 }, // Plan A: 7:2:1
    B: { creator: 0.50, platform: 0.20, reserve: 0.10, tlc_pool: 0.20 }, // Plan B: 5:2:1:2
  },

  // ── POC 가중치 ──
  POC_WEIGHTS: {
    playtime:  0.40,
    replay:    0.30,
    share:     0.20,
    rating:    0.10,
  },

  // ── Pulse 가중치 (TL 소모 배수) ──
  PULSE_MULTIPLIER: (pulse) => {
    if (pulse <= 0)    return 1.0;
    if (pulse <= 100)  return 1.0;
    if (pulse <= 500)  return 2.0;
    if (pulse <= 2000) return 3.0;
    if (pulse <= 5000) return 5.0;
    return 10.0;
  },

  // ── 재생 비용 계산 ──
  calcCost(type, durationSec, pulse = 0) {
    const rate = this.RATES[type] || 1.0;
    const multiplier = this.PULSE_MULTIPLIER(pulse);
    return Math.ceil(rate * durationSec * multiplier);
  },

  // ── 수익 분배 계산 ──
  calcRevenue(totalTL, plan = 'A') {
    const s = this.SPLIT[plan];
    return {
      creator:   Math.floor(totalTL * s.creator),
      platform:  Math.floor(totalTL * s.platform),
      reserve:   Math.floor(totalTL * s.reserve),
      tlc_pool:  Math.floor(totalTL * (s.tlc_pool || 0)),
    };
  },

  // ── POC 점수 계산 ──
  calcPOC(stats) {
    const { playtimeSec = 0, replayCount = 0, shareCount = 0, avgRating = 0 } = stats;
    const normalizedPlaytime = Math.min(playtimeSec / 3600, 100); // 최대 100시간 기준
    const normalizedReplay   = Math.min(replayCount / 100, 100);
    const normalizedShare    = Math.min(shareCount / 50, 100);
    const normalizedRating   = (avgRating / 5) * 100;

    return Math.round(
      normalizedPlaytime * this.POC_WEIGHTS.playtime +
      normalizedReplay   * this.POC_WEIGHTS.replay   +
      normalizedShare    * this.POC_WEIGHTS.share     +
      normalizedRating   * this.POC_WEIGHTS.rating
    );
  },

  // ── TLC 채굴량 계산 ──
  calcTLC(pocScore, totalTLMined) {
    const MAX_DAILY = totalTLMined * 0.001; // 전체 TL의 0.1%
    const mined = pocScore * 0.01;          // POC 1점 = 0.01 TLC
    return Math.min(mined, MAX_DAILY * 0.5).toFixed(4);
  },

  // ── TL 잔액 차감 ──
  deduct(amount) {
    const user = TL.getUser();
    if (!user) return false;
    if ((user.tl || 0) < amount) return false;
    user.tl = (user.tl || 0) - amount;
    user.tl_spent = (user.tl_spent || 0) + amount;
    localStorage.setItem('tl_user', JSON.stringify(user));
    TL.updateNavUI(user);
    return true;
  },

  // ── 창작자 수익 적립 ──
  earn(creatorId, totalTL, plan = 'A') {
    const revenue = TL.calcRevenue(totalTL, plan);
    // 실제 환경: 서버 API 호출
    // 현재: localStorage 데모
    const earnings = JSON.parse(localStorage.getItem('tl_earnings') || '{}');
    earnings[creatorId] = (earnings[creatorId] || 0) + revenue.creator;
    localStorage.setItem('tl_earnings', JSON.stringify(earnings));
    return revenue;
  },

  // ── 유저 정보 ──
  getUser() {
    return JSON.parse(localStorage.getItem('tl_user') || 'null');
  },

  // ── 네비 잔액 UI 업데이트 ──
  updateNavUI(user) {
    const tl  = document.getElementById('balance-tl');
    const tlc = document.getElementById('balance-tlc');
    if (tl)  tl.textContent  = Number(user.tl  || 0).toLocaleString();
    if (tlc) tlc.textContent = Number(user.tlc || 0).toFixed(4);
  },

  // ── 카페방송 시간당 비용 ──
  cafeCostPerHour(listeners) {
    return Math.ceil(this.RATES.cafe * 3600 * listeners);
  },
};

// ============================================================
// 공지 시스템 (Announcement System)
// ============================================================

const TLAnnouncement = {

  NOTICES: [
    {
      id: 'economy_v1',
      type: 'info',        // info | warning | success | update
      icon: '⚡',
      title: 'TL 경제 시스템 v1.0 적용',
      message: '1초 = 1 TL = 1원의 실시간 과금이 시작됩니다. 재생 시 초당 TL이 차감되며, 창작자에게 즉시 수익이 분배됩니다.',
      pages: ['index', 'library', 'shareplace'],
      dismissible: true,
      link: { text: '토큰 경제 자세히 보기', href: 'tokenomics.html' },
    },
    {
      id: 'poc_mining',
      type: 'success',
      icon: '🔥',
      title: 'POC 채굴 알고리즘 가동',
      message: 'Plan B 창작자는 재생시간·공유수·평점 기반 POC 점수로 TLC를 채굴합니다. 대시보드에서 실시간 확인하세요.',
      pages: ['dashboard', 'create'],
      dismissible: true,
      link: { text: '대시보드 확인', href: 'dashboard.html' },
    },
    {
      id: 'withdrawal_notice',
      type: 'warning',
      icon: '⚠️',
      title: '출금 정책 안내',
      message: '최소 출금액 10,000 TL (10,000원), 수수료 1% (최대 500원). 출금 시 본인인증(PASS)이 필요합니다.',
      pages: ['wallet'],
      dismissible: true,
      link: { text: '출금하기', href: 'wallet.html' },
    },
    {
      id: 'cafe_billing',
      type: 'info',
      icon: '☕',
      title: '카페방송 과금 기준',
      message: '동시 청취자 × 0.5 TL/초로 과금됩니다. 10명 × 1시간 = 18,000 TL. 월정액 요금제에서는 기본 TL이 제공됩니다.',
      pages: ['radio'],
      dismissible: true,
      link: { text: '요금제 확인', href: 'pricing.html' },
    },
    {
      id: 'reserve_notice',
      type: 'info',
      icon: '🏦',
      title: '금 준비금 제도 안내',
      message: '전체 TL 매출의 10%는 금 준비금으로 적립됩니다. TLC의 실물 가치를 담보하며 플랫폼 안정성을 보장합니다.',
      pages: ['tokenomics', 'index'],
      dismissible: true,
    },
  ],

  COLORS: {
    info:    { bg: '#ede9fe', border: '#8b5cf6', text: '#5b21b6', icon: '#8b5cf6' },
    success: { bg: '#d1fae5', border: '#10b981', text: '#065f46', icon: '#10b981' },
    warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', icon: '#f59e0b' },
    update:  { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af', icon: '#3b82f6' },
  },

  // 현재 페이지명 감지
  getCurrentPage() {
    const path = window.location.pathname;
    const file = path.split('/').pop().replace('.html', '');
    return file || 'index';
  },

  // 닫은 공지 목록
  getDismissed() {
    return JSON.parse(localStorage.getItem('tl_dismissed_notices') || '[]');
  },

  dismiss(id) {
    const dismissed = this.getDismissed();
    if (!dismissed.includes(id)) dismissed.push(id);
    localStorage.setItem('tl_dismissed_notices', JSON.stringify(dismissed));
    const el = document.getElementById('notice-' + id);
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(-8px)';
      setTimeout(() => el.remove(), 300);
    }
  },

  // 공지 HTML 생성
  renderNotice(notice) {
    const c = this.COLORS[notice.type] || this.COLORS.info;
    const linkHtml = notice.link
      ? `<a href="${notice.link.href}" style="font-size:12px;font-weight:700;color:${c.icon};text-decoration:none;margin-top:6px;display:inline-block;">${notice.link.text} →</a>`
      : '';
    return `
      <div id="notice-${notice.id}" style="
        background:${c.bg}; border-left:4px solid ${c.border};
        border-radius:12px; padding:14px 16px; margin-bottom:10px;
        display:flex; align-items:flex-start; gap:12px;
        transition: all 0.3s ease;
        animation: slideDown 0.3s ease;
      ">
        <span style="font-size:20px;flex-shrink:0;margin-top:1px;">${notice.icon}</span>
        <div style="flex:1;">
          <div style="font-size:14px;font-weight:700;color:${c.text};margin-bottom:3px;">${notice.title}</div>
          <div style="font-size:13px;color:${c.text};opacity:0.85;line-height:1.5;">${notice.message}</div>
          ${linkHtml}
        </div>
        ${notice.dismissible ? `
          <button onclick="TLAnnouncement.dismiss('${notice.id}')" style="
            background:none;border:none;cursor:pointer;font-size:16px;
            color:${c.text};opacity:0.5;padding:0;line-height:1;flex-shrink:0;
          ">✕</button>
        ` : ''}
      </div>
    `;
  },

  // 공지 컨테이너 삽입
  inject() {
    const page = this.getCurrentPage();
    const dismissed = this.getDismissed();
    const relevant = this.NOTICES.filter(n =>
      n.pages.includes(page) && !dismissed.includes(n.id)
    );
    if (relevant.length === 0) return;

    const container = document.createElement('div');
    container.id = 'tl-announcements';
    container.style.cssText = `
      max-width:1100px; margin:16px auto 0; padding:0 24px;
    `;
    container.innerHTML = `
      <style>
        @keyframes slideDown {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:translateY(0); }
        }
      </style>
      ${relevant.map(n => this.renderNotice(n)).join('')}
    `;

    // tabs 아래에 삽입
    const tabs = document.querySelector('.tabs');
    if (tabs && tabs.nextSibling) {
      tabs.parentNode.insertBefore(container, tabs.nextSibling);
    } else {
      const body = document.querySelector('body');
      const navbar = document.querySelector('.navbar');
      if (navbar) navbar.after(container);
      else body.prepend(container);
    }
  },
};

// 실시간 TL 차감 플레이어 (전역)
const TLPlayer = {
  interval: null,
  elapsed: 0,
  rate: 1.0,
  file: null,

  start(file, onTick, onEnd, onInsufficient) {
    this.stop();
    this.file = file;
    this.elapsed = 0;
    this.rate = TL.RATES[file.type] || 1.0;

    this.interval = setInterval(() => {
      const cost = Math.ceil(this.rate);
      const ok = TL.deduct(cost);
      if (!ok) {
        this.stop();
        if (onInsufficient) onInsufficient();
        return;
      }
      this.elapsed++;

      // POC + 창작자 수익
      if (file.creatorId) {
        TL.earn(file.creatorId, cost, file.plan || 'A');
      }

      if (onTick) onTick(this.elapsed, cost);
      if (file.durationSec && this.elapsed >= file.durationSec) {
        this.stop();
        if (onEnd) onEnd(this.elapsed);
      }
    }, 1000);
  },

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  },

  isPlaying() {
    return this.interval !== null;
  }
};

// DOM 준비 시 공지 자동 삽입
document.addEventListener('DOMContentLoaded', () => {
  TLAnnouncement.inject();
});
