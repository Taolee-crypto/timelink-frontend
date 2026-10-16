// TimeLink 공통 푸터 자동 주입 스크립트
// 모든 페이지에서 로드됨. 이미 tl-dynamic-footer가 있으면 skip.
(function () {
  'use strict';

  // ─── 제외 페이지 ───
  var path = location.pathname;
  if (/\/(login|signup|player-host)\.html$/.test(path)) return;

  // ─── 이미 footer 있으면 skip ───
  if (document.getElementById('tl-dynamic-footer')) return;

  // ─── footer HTML (creator.html 기준) ───
  var FOOTER_HTML = `<footer id="tl-dynamic-footer" style="border-top:1px solid rgba(255,255,255,.07);padding:40px 24px 32px;margin-top:auto;background:rgba(3,5,8,.8);position:relative;z-index:1">
  <div style="max-width:1200px;margin:0 auto">
    <div style="display:flex;flex-wrap:wrap;gap:40px;justify-content:space-between;margin-bottom:32px">
      <div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
          <div style="width:28px;height:28px;background:linear-gradient(135deg,#0071E3,#64D2FF);border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff">TL</div>
          <span style="font-size:13px;font-weight:700;letter-spacing:.08em">TIMELINK</span>
        </div>
        <p style="font-size:11px;color:rgba(255,255,255,.3);line-height:1.7;max-width:200px">디지털 자산 권리·공유 플랫폼 · 1 TL = 1원</p>
      </div>
      <div>
        <div style="font-size:10px;color:rgba(255,255,255,.3);letter-spacing:.1em;text-transform:uppercase;margin-bottom:12px">서비스</div>
        <a href="shareplace.html" style="font-size:12px;color:rgba(255,255,255,.5);text-decoration:none;display:block;margin-bottom:8px">SharePlace</a>
        <a href="chart.html" style="font-size:12px;color:rgba(255,255,255,.5);text-decoration:none;display:block;margin-bottom:8px">TL CHART</a>
        <a href="radio.html" style="font-size:12px;color:rgba(255,255,255,.5);text-decoration:none;display:block;margin-bottom:8px">TL방송국</a>
        <a href="ads.html" style="font-size:12px;color:rgba(255,255,255,.5);text-decoration:none;display:block;margin-bottom:8px">광고 센터</a>
      </div>
      <div>
        <div style="font-size:10px;color:rgba(255,255,255,.3);letter-spacing:.1em;text-transform:uppercase;margin-bottom:12px">크리에이터</div>
        <a href="creator.html" style="font-size:12px;color:rgba(255,255,255,.5);text-decoration:none;display:block;margin-bottom:8px">크리에이터 센터</a>
        <a href="creator-policy.html" style="font-size:12px;color:rgba(255,255,255,.5);text-decoration:none;display:block;margin-bottom:8px">크리에이터 정책</a>
        <a href="dj-guide.html" style="font-size:12px;color:rgba(255,255,255,.5);text-decoration:none;display:block;margin-bottom:8px">DJ 가이드</a>
        <a href="advertiser.html" style="font-size:12px;color:rgba(255,255,255,.5);text-decoration:none;display:block;margin-bottom:8px">광고주 센터</a>
      </div>
      <div>
        <div style="font-size:10px;color:rgba(255,255,255,.3);letter-spacing:.1em;text-transform:uppercase;margin-bottom:12px">법적 정보</div>
        <a href="terms.html" style="font-size:12px;color:rgba(255,255,255,.5);text-decoration:none;display:block;margin-bottom:8px">이용약관</a>
        <a href="privacy.html" style="font-size:12px;color:rgba(255,255,255,.5);text-decoration:none;display:block;margin-bottom:8px">개인정보처리방침</a>
        <a href="creator-policy.html" style="font-size:12px;color:rgba(255,255,255,.5);text-decoration:none;display:block;margin-bottom:8px">크리에이터 정책</a>
      </div>
    </div>
    <div style="padding-top:20px;border-top:1px solid rgba(255,255,255,.06)">
      <div style="font-size:11px;color:rgba(255,255,255,.25);line-height:1.8;margin-bottom:4px">씨엠피 주식회사 · 대표이사 이문웅 · 사업자등록번호 491-86-02547</div>
      <div style="font-size:11px;color:rgba(255,255,255,.2);margin-bottom:4px">서울특별시 영등포구 국제금융로8길 27-8, 4층</div>
      <div style="font-size:11px;color:rgba(255,255,255,.2)">ⓒ 2026 씨엠피 주식회사. All rights reserved.</div>
    </div>
  </div>
</footer>
`;

  function inject() {
    if (document.getElementById('tl-dynamic-footer')) return;

    var wrapper = document.createElement('div');
    wrapper.innerHTML = FOOTER_HTML.trim();
    var footerEl = wrapper.firstElementChild;
    if (!footerEl) return;

    // ─── 주입 위치: mainWrap 있으면 그 안, 없으면 body 끝 ───
    var mainWrap = document.getElementById('mainWrap');
    if (mainWrap) {
      mainWrap.appendChild(footerEl);
    } else {
      document.body.appendChild(footerEl);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
