// ============================================================
// currency.js — TimeLink 다중 통화 엔진 v1.0
// 1 TL = 1 KRW 기준 실시간 환율 변환
// ============================================================
const CURRENCY = {
  current: null,

  LIST: {
    KRW: { label:'원', symbol:'₩', flag:'🇰🇷', rate:1,        format: v => '₩' + Math.round(v).toLocaleString() },
    USD: { label:'USD', symbol:'$', flag:'🇺🇸', rate:0.00073,  format: v => '$' + v.toFixed(2) },
    JPY: { label:'JPY', symbol:'¥', flag:'🇯🇵', rate:0.11,     format: v => '¥' + Math.round(v).toLocaleString() },
    EUR: { label:'EUR', symbol:'€', flag:'🇪🇺', rate:0.00068,  format: v => '€' + v.toFixed(2) },
    GBP: { label:'GBP', symbol:'£', flag:'🇬🇧', rate:0.00058,  format: v => '£' + v.toFixed(2) },
    SGD: { label:'SGD', symbol:'S$', flag:'🇸🇬', rate:0.00099, format: v => 'S$' + v.toFixed(2) },
    BRL: { label:'BRL', symbol:'R$', flag:'🇧🇷', rate:0.0038,  format: v => 'R$' + v.toFixed(2) },
    AED: { label:'AED', symbol:'د.إ', flag:'🇦🇪', rate:0.0027, format: v => 'د.إ' + v.toFixed(2) },
    INR: { label:'INR', symbol:'₹', flag:'🇮🇳', rate:0.061,    format: v => '₹' + Math.round(v).toLocaleString() },
  },

  // IP 기반 통화 감지 (브라우저 언어 기준 폴백)
  detect() {
    const saved = localStorage.getItem('tl_currency');
    if (saved && this.LIST[saved]) return saved;
    const lang = navigator.language || 'en';
    const map = {
      'ko':'KRW','ja':'JPY','zh':'CNY',
      'en-US':'USD','en-GB':'GBP','en-SG':'SGD',
      'es':'USD','pt':'BRL','pt-BR':'BRL',
      'ar':'AED','hi':'INR',
    };
    return map[lang] || map[lang.slice(0,2)] || 'USD';
  },

  // KRW → 현재 통화로 변환
  convert(krwAmount) {
    const c = this.LIST[this.current];
    return c ? c.format(krwAmount * c.rate) : '₩' + krwAmount.toLocaleString();
  },

  // TL → 현재 통화 (1 TL = 1 KRW)
  fromTL(tlAmount) {
    return this.convert(tlAmount);
  },

  // data-currency 속성 전체 적용
  applyAll() {
    document.querySelectorAll('[data-currency]').forEach(el => {
      const krw = parseFloat(el.getAttribute('data-currency'));
      if (!isNaN(krw)) el.textContent = this.convert(krw);
    });
    document.querySelectorAll('[data-tl]').forEach(el => {
      const tl = parseFloat(el.getAttribute('data-tl'));
      if (!isNaN(tl)) {
        el.textContent = tl.toLocaleString() + ' TL ≈ ' + this.fromTL(tl);
      }
    });
    // 환율 표시 업데이트
    const rateEl = document.getElementById('exchange-rate-display');
    if (rateEl) {
      const c = this.LIST[this.current];
      rateEl.textContent = `1 TL = 1 KRW ≈ ${c.format(c.rate)}`;
    }
    // 선택기 버튼 업데이트
    const btn = document.getElementById('currency-selector-btn');
    if (btn) {
      const c = this.LIST[this.current];
      btn.textContent = c.flag + ' ' + c.label + ' ▾';
    }
  },

  // 통화 변경
  setCurrency(code) {
    if (!this.LIST[code]) return;
    this.current = code;
    localStorage.setItem('tl_currency', code);
    this.applyAll();
  },

  // 통화 선택기 렌더링
  renderSelector(containerId) {
    const c = document.getElementById(containerId);
    if (!c) return;
    const cur = this.LIST[this.current];
    c.innerHTML = `
      <div style="position:relative;display:inline-block;">
        <button id="currency-selector-btn" onclick="CURRENCY.toggleDropdown()" style="
          display:flex;align-items:center;gap:6px;padding:6px 12px;
          background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);
          border-radius:20px;color:inherit;font-size:13px;font-weight:600;cursor:pointer;
          font-family:inherit;backdrop-filter:blur(4px);
        ">${cur.flag} ${cur.label} ▾</button>
        <div id="currency-dropdown" style="
          display:none;position:absolute;top:calc(100% + 8px);right:0;
          background:white;border:1px solid #e5e7eb;border-radius:12px;
          box-shadow:0 8px 32px rgba(0,0,0,0.12);overflow:hidden;z-index:9999;min-width:160px;
        ">
          ${Object.entries(this.LIST).map(([code, info]) => `
            <button onclick="CURRENCY.setCurrency('${code}');CURRENCY.closeDropdown()" style="
              display:flex;align-items:center;justify-content:space-between;
              width:100%;padding:10px 16px;
              background:${code === this.current ? '#ede9fe' : 'white'};border:none;
              font-size:13px;font-weight:${code === this.current ? '700' : '500'};
              color:${code === this.current ? '#7c3aed' : '#374151'};cursor:pointer;
              font-family:inherit;text-align:left;gap:8px;
            ">
              <span>${info.flag} ${info.label}</span>
              <span style="font-size:11px;color:#9ca3af;">${info.symbol}</span>
            </button>
          `).join('')}
        </div>
      </div>`;
  },

  toggleDropdown() {
    const d = document.getElementById('currency-dropdown');
    if (d) d.style.display = d.style.display === 'none' ? 'block' : 'none';
  },

  closeDropdown() {
    const d = document.getElementById('currency-dropdown');
    if (d) d.style.display = 'none';
  },

  init() {
    this.current = this.detect();
    document.addEventListener('click', e => {
      if (!e.target.closest('#currency-selector-btn')) this.closeDropdown();
    });
    this.applyAll();
  }
};

document.addEventListener('DOMContentLoaded', () => CURRENCY.init());
