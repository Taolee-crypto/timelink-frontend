/* TimeLink Global Application Shell — light navigation system */
(function () {
  'use strict';
  if (window.__TL_GLOBAL_SHELL_V4__) return;
  window.__TL_GLOBAL_SHELL_V4__ = true;

  var API = window.TL3_API_BASE || 'https://api.timelink.digital';
  var token = '';
  try { token = localStorage.getItem('tl_token') || ''; } catch (e) {}

  var pathName = (location.pathname || '/').replace(/\/+$/, '') || '/';
  if (!token && (pathName === '/' || pathName === '/index.html')) return;
  if (pathName === '/admin.html') return;

  var currentLang = '';
  try { currentLang = localStorage.getItem('tl_lang') || ''; } catch (e) {}
  if (!currentLang) currentLang = (navigator.language || navigator.userLanguage || 'ko').toLowerCase();
  currentLang = String(currentLang).toLowerCase().indexOf('ko') === 0 ? 'ko' : 'en';
  function label(en, ko) { return currentLang === 'ko' ? ko : en; }

  // Approved information architecture: nine clear destinations.
  // Existing route targets are preserved; only their navigation grouping changes.
  var sections = [
    ['HOME', '홈', [
      ['/dashboard.html', '⌂', 'Overview', '대시보드', 'navy']
    ]],
    ['DIGITAL ASSETS', '디지털 자산', [
      ['/shareplace.html', '◈', 'SharePlace', '공유플레이스', 'purple']
    ]],
    ['CREATOR CENTER', '창작 센터', [
      ['/creator.html', '✧', 'Creator Studio', '크리에이터 스튜디오', 'purple']
    ]],
    ['TL BROADCAST', 'TL 방송국', [
      ['/cafe-channel.html', '▣', 'Cafe Channel', '카페 채널', 'orange'],
      ['/incar-channel.html', '◇', 'In-car Channel', '인카 채널', 'orange'],
      ['/dj-center.html', '♫', 'DJ Center', 'DJ 센터', 'orange']
    ]],
    ['COMMUNICATION', '커뮤니케이션', [
      ['/cafe-world.html', '▤', 'Cafe World', '카페 월드', 'teal'],
      ['/my-car-world.html', '⌁', 'My Car World', '마이카 월드', 'teal']
    ]],
    ['ADVERTISING', '광고', [
      ['/advertiser.html', '▱', 'Sponsor Center', '스폰서 센터', 'red'],
      ['/ads.html', '▣', 'Ad Watching', '광고 시청', 'red']
    ]],
    ['TL ECONOMICS', 'TL 경제', [
      ['/wallet.html', '◉', 'Wallet', '지갑', 'navy']
    ]],
    ['MY', '마이', [
      ['/dashboard.html?tab=content', '▤', 'My Library', '내 라이브러리', 'purple'],
      ['/dashboard.html?tab=mining', '⛏', 'TLC Mining', 'TLC 채굴', 'purple'],
      ['/dashboard.html?tab=mission', '◎', 'Missions', '미션', 'purple'],
      ['/dashboard.html?tab=cafe', '☕', 'My Cafe', '마이 카페', 'purple']
    ]]
  ];

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function active(href) {
    var parts = href.split('?');
    var target = parts[1] ? (parts[1].match(/(?:^|&)tab=([^&]*)/) || [])[1] : '';
    var same = pathName === parts[0] || (parts[0] === '/dashboard.html' && pathName === '/dashboard');
    if (!same) return false;
    if (parts[0] === '/dashboard.html') {
      return (new URLSearchParams(location.search).get('tab') || 'home') === (target || 'home');
    }
    return true;
  }

  var html = `<style id="tl-global-sidebar-css">
    body.tl-global-shell{box-sizing:border-box;width:100%;padding-left:256px!important;min-height:100vh;overflow-x:hidden;background-color:#F5F7FC!important;color:#1E293B!important}
    body.tl-global-shell .layout,body.tl-global-shell .app{box-sizing:border-box;width:100%;max-width:none;min-width:0}
    body.tl-global-shell .body{box-sizing:border-box;width:100%;min-width:0;flex:1 1 auto}
    body.tl-global-shell .main{box-sizing:border-box;width:auto!important;max-width:none;min-width:0;flex:1 1 auto;margin:0!important;transform:none!important;background:transparent!important;color:#1E293B!important}
    body.tl-global-shell .quick-bar{max-width:100%;box-sizing:border-box}
    body.tl-global-shell .quick-bar>*{min-width:0;max-width:100%}
    body.tl-global-shell .tl-global-sidebar{position:fixed!important;z-index:10000!important;inset:0 auto 0 0!important;width:256px!important;height:100vh;box-sizing:border-box;display:flex;flex-direction:column;margin:0!important;padding:20px 15px 15px!important;background:linear-gradient(180deg,rgba(255,255,255,.97) 0%,rgba(248,249,255,.94) 100%)!important;border:0!important;border-right:1px solid rgba(111,91,160,.13)!important;color:#25324B!important;font-family:Inter,Pretendard,sans-serif;box-shadow:10px 0 34px rgba(42,50,82,.035);overflow:hidden!important;transform:none}
    body.tl-global-shell .tl-global-sidebar *{box-sizing:border-box}
    body.tl-global-shell .tl-global-brand{display:flex;align-items:center;gap:11px;flex:0 0 auto;padding:4px 10px 19px!important;margin:0 0 7px!important;color:#263B70!important;font-size:21px;font-weight:800;letter-spacing:-.04em;text-decoration:none;border-bottom:1px solid #EDF0F5}
    body.tl-global-shell .tl-global-mark{width:35px;height:35px;display:grid;place-items:center;flex:0 0 35px;border-radius:11px;background:linear-gradient(140deg,#8B5CF6 0%,#7048D8 62%,#F59E0B 100%);color:#FFFFFF;font-weight:900;box-shadow:0 5px 13px rgba(139,92,246,.18)}
    body.tl-global-shell .tl-global-links{display:block!important;flex:1 1 auto;min-height:0;width:100%;margin:0!important;padding:8px 0 12px!important;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain}
    body.tl-global-shell .tl-global-section{display:block;padding:16px 11px 7px!important;margin:0!important;color:#9299AA!important;font-size:9px;font-weight:750;letter-spacing:.16em;line-height:1.5;text-transform:uppercase}
    body.tl-global-shell .tl-global-link{display:flex!important;align-items:center;gap:10px;min-height:38px;width:auto;margin:2px 0!important;padding:7px 10px!important;border:1px solid transparent;border-radius:11px;color:#536078!important;font-size:12.5px;font-weight:560;letter-spacing:-.012em;line-height:1.35;text-decoration:none!important;white-space:normal;position:relative;transition:background .22s ease,color .22s ease,border-color .22s ease,transform .22s ease}
    body.tl-global-shell .tl-global-link:hover{background:linear-gradient(100deg,rgba(139,92,246,.085),rgba(245,166,35,.045))!important;color:#263B70!important;border-color:rgba(139,92,246,.09);transform:translateX(2px)}
    body.tl-global-shell .tl-global-link.is-active{background:linear-gradient(105deg,rgba(139,92,246,.13),rgba(255,255,255,.68) 82%)!important;border-color:rgba(139,92,246,.17)!important;color:#6844C5!important;font-weight:700;box-shadow:inset 2px 0 0 #8B5CF6,0 3px 10px rgba(92,70,150,.045)}
    body.tl-global-shell .tl-global-icon{display:grid;place-items:center;width:22px;height:22px;flex:0 0 22px;padding:0!important;margin:0!important;background:transparent;font-size:16px;line-height:1;opacity:1}
    body.tl-global-shell .tl-global-link[data-tone="navy"] .tl-global-icon{color:#263B70}
    body.tl-global-shell .tl-global-link[data-tone="purple"] .tl-global-icon{color:#8B5CF6}
    body.tl-global-shell .tl-global-link[data-tone="orange"] .tl-global-icon{color:#E88A16}
    body.tl-global-shell .tl-global-link[data-tone="red"] .tl-global-icon{color:#E65361}
    body.tl-global-shell .tl-global-link[data-tone="teal"] .tl-global-icon{color:#159C96}
    body.tl-global-shell .tl-global-balance{flex:0 0 auto;margin:10px 0 0;padding:14px;border:1px solid #E9DFFF;border-radius:14px;background:linear-gradient(135deg,rgba(245,240,255,.92) 0%,rgba(255,249,239,.94) 100%)}
    body.tl-global-shell .tl-global-balance small{display:block;color:#7B6B99;font-size:9px;letter-spacing:.13em;font-weight:800}
    body.tl-global-shell .tl-global-balance strong{display:block;margin:7px 0;color:#263B70;font:750 20px Manrope,Inter,sans-serif}
    body.tl-global-shell .tl-global-balance a{display:inline-block;font-size:11px;color:#D97706;font-weight:700;text-decoration:none}
    body.tl-global-shell .tl-global-toggle,body.tl-global-shell .tl-global-scrim{display:none}
    @media(max-width:900px){
      body.tl-global-shell{padding-left:0!important}
      body.tl-global-shell .tl-global-sidebar{width:min(290px,84vw)!important;transform:translateX(-102%)!important;transition:transform .22s ease;box-shadow:18px 0 55px rgba(31,41,55,.16)}
      body.tl-global-nav-open .tl-global-sidebar{transform:translateX(0)!important}
      body.tl-global-shell .tl-global-toggle{display:grid;place-items:center;position:fixed;z-index:10001;left:14px;top:13px;width:40px;height:38px;border:1px solid #E2E7F0;border-radius:10px;background:#FFFFFF;color:#263B70;font-size:17px;box-shadow:0 3px 12px rgba(31,41,55,.08)}
      body.tl-global-shell .tl-global-scrim{display:block;position:fixed;z-index:9999;inset:0;border:0;background:rgba(25,35,55,.24);opacity:0;pointer-events:none}
      body.tl-global-nav-open .tl-global-scrim{opacity:1;pointer-events:auto}
      body.tl-global-shell .topbar,body.tl-global-shell .hdr{padding-left:62px!important}
    }
  </style>`;

  html += '<aside class="tl-global-sidebar" aria-label="' + esc(label('TimeLink navigation', 'TimeLink 메뉴')) + '"><a class="tl-global-brand" href="/dashboard.html"><span class="tl-global-mark">T</span><span>TimeLink</span></a><nav class="tl-global-links">';
  sections.forEach(function (section) {
    html += '<div class="tl-global-section">' + esc(label(section[0], section[1])) + '</div>';
    section[2].forEach(function (item) {
      var isActive = active(item[0]);
      html += '<a class="tl-global-link' + (isActive ? ' is-active' : '') + '" data-tone="' + esc(item[4]) + '" href="' + esc(item[0]) + '"' + (isActive ? ' aria-current="page"' : '') + '><span class="tl-global-icon" aria-hidden="true">' + esc(item[1]) + '</span><span>' + esc(label(item[2], item[3])) + '</span></a>';
    });
  });
  html += '</nav><div class="tl-global-balance"><small>' + esc(label('MY TL BALANCE', '내 TL 잔액')) + '</small><strong id="tlGlobalBalance">— TL</strong><a href="/wallet.html#charge">＋ ' + esc(label('Charge TL', 'TL 충전')) + '</a></div></aside>';

  document.body.insertAdjacentHTML('afterbegin', html);
  document.body.classList.add('tl-global-shell');

  var oldSidebar = document.querySelector('.body > .sidebar, .layout > .sidebar, .app > .sidebar, .app > .tl-sidebar');
  if (oldSidebar) oldSidebar.remove();

  var app = document.querySelector('.app');
  if (app) {
    app.style.display = 'block';
    app.style.width = '100%';
    app.style.maxWidth = 'none';
    app.style.minWidth = '0';
    app.style.boxSizing = 'border-box';
  }
  var main = document.querySelector('.body > .main, .layout > .main, .app > .main');
  if (main) {
    main.style.width = 'auto';
    main.style.flex = '1 1 auto';
    main.style.boxSizing = 'border-box';
    main.style.minWidth = '0';
    main.style.maxWidth = 'none';
    main.style.marginLeft = '0';
    main.style.transform = 'none';
  }

  function formatTLBalance(value) {
    var amount = Number(value);
    if (!Number.isFinite(amount)) amount = 0;
    return Math.floor(Math.max(0, amount)).toLocaleString('ko-KR') + ' TL';
  }

  var user = {};
  try { user = JSON.parse(localStorage.getItem('tl_user') || '{}'); } catch (e) {}
  var balance = document.getElementById('tlGlobalBalance');
  var amount = user.tl_balance != null ? user.tl_balance : user.tl;
  if (balance && amount != null) balance.textContent = formatTLBalance(amount);

  if (token) {
    fetch(API + '/api/admin/settings/__sidebar_access__', {
      headers: {'Authorization':'Bearer ' + token, 'Accept':'application/json'}
    }).then(function (response) {
      return response.ok ? response.json() : null;
    }).then(function (result) {
      if (!result) return;
      var nav = document.querySelector('.tl-global-links');
      if (!nav) return;
      var adminSection = document.createElement('div');
      adminSection.className = 'tl-global-section';
      adminSection.textContent = label('ADMIN', '관리자');
      var adminLink = document.createElement('a');
      adminLink.className = 'tl-global-link' + (pathName === '/admin.html' ? ' is-active' : '');
      adminLink.setAttribute('data-tone', 'navy');
      adminLink.href = '/admin.html';
      adminLink.innerHTML = '<span class="tl-global-icon" aria-hidden="true">⚙</span><span>' + esc(label('Admin Console', '관리자 콘솔')) + '</span>';
      nav.appendChild(adminSection);
      nav.appendChild(adminLink);
    }).catch(function () {});
  }

  var toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'tl-global-toggle';
  toggle.setAttribute('aria-label', label('Open navigation', '메뉴 열기'));
  toggle.setAttribute('aria-expanded', 'false');
  toggle.textContent = '☰';
  var scrim = document.createElement('button');
  scrim.type = 'button';
  scrim.className = 'tl-global-scrim';
  scrim.setAttribute('aria-label', label('Close navigation', '메뉴 닫기'));
  document.body.appendChild(scrim);
  document.body.appendChild(toggle);
  function closeNav() {
    document.body.classList.remove('tl-global-nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', function () {
    var open = document.body.classList.toggle('tl-global-nav-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  scrim.addEventListener('click', closeNav);
  document.querySelector('.tl-global-sidebar').addEventListener('click', function (event) {
    if (event.target.closest('a')) closeNav();
  });

  async function fetchServerBalance() {
    if (!token) return;
    try {
      var r = await fetch(API + '/api/v1/users/me/wallet', {
        headers: {'Authorization': 'Bearer ' + token}
      });
      var d = await r.json();
      var bal = Number(d.tl_balance);
      if (isFinite(bal)) {
        var el = document.getElementById('tlGlobalBalance');
        if (el) el.textContent = formatTLBalance(bal);
        try {
          var u = JSON.parse(localStorage.getItem('tl_user') || '{}');
          u.tl_balance = bal;
          localStorage.setItem('tl_user', JSON.stringify(u));
        } catch (e) {}
      }
    } catch (e) {}
  }
  window.addEventListener('tl-balance-updated', function (e) {
    if (e.detail && isFinite(e.detail.tl)) {
      var el = document.getElementById('tlGlobalBalance');
      if (el) el.textContent = formatTLBalance(e.detail.tl);
    }
  });
  fetchServerBalance();
})();
