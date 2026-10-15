/* TimeLink Global Application Shell — shared navigation */
(function () {
  'use strict';
  if (window.__TL_GLOBAL_SHELL_V4__) return;
  window.__TL_GLOBAL_SHELL_V4__ = true;

  var API = window.TL3_API_BASE || 'https://api.timelink.digital';
  var token = '';
  try { token = localStorage.getItem('tl_token') || ''; } catch (e) {}

  var pathName = (location.pathname || '/').replace(/\/+$/, '') || '/';
  if (!token && (pathName === '/' || pathName === '/index.html')) return;
  if (pathName === '/admin.html' || pathName === '/incar.html') return;

  // Navigation language follows the platform-wide tl_lang preference.
  // Korean mode renders Korean labels; English mode renders English labels.
  var currentLang = '';
  try { currentLang = localStorage.getItem('tl_lang') || ''; } catch (e) {}
  if (!currentLang) currentLang = (navigator.language || navigator.userLanguage || 'ko').toLowerCase();
  currentLang = String(currentLang).toLowerCase().indexOf('ko') === 0 ? 'ko' : 'en';
  function label(en, ko) { return currentLang === 'ko' ? ko : en; }
  function labelText(en, ko) { return label(en, ko); }

  var sections = [
    ['HOME', [['/index.html','⌂','Overview']]],
    ['DIGITAL ASSETS', [['/shareplace.html','◈','SharePlace']]],
    ['CREATOR', [['/creator-studio.html','＋','Creator Studio']]],
    ['BROADCAST', [['/radio.html','◉','TL Broadcast'],['/cafe-channel.html','▣','Cafe Broadcast',true],['/incar-channel.html','◇','In-car Broadcast',true],['/dj-center.html','♫','DJ Center']]],
    ['ADVERTISING', [['/advertiser.html','▱','Advertiser Center'],['/ads.html','▣','Ad Watching']]],
    ['TL ECONOMICS', [['/wallet.html','◉','Wallet']]],
    ['MY', [['/dashboard.html','◎','Dashboard'],['/dashboard.html?tab=mining','⛏','TLC Mining',true],['/dashboard.html?tab=mission','🎯','Missions',true],['/dashboard.html?tab=cafe','☕','Cafe Channels',true]]],
    ['ADMIN', [['/admin.html','⚙','Admin Console']]]
    ['HOME', '홈', [['/dashboard.html?tab=home', '⌂', 'Overview', '둘러보기']]],
    ['DIGITAL ASSETS', '디지털자산', [['/shareplace.html', '◈', 'SharePlace', '공유플레이스']]],
    ['CREATOR', '창작', [['/creator.html', '✧', 'Creator Center', '크리에이터센터']]],
    ['TL BROADCAST', 'TL 방송국', [
      ['/cafe-channel.html', '▣', 'Cafe Channel', '카페방송'],
      ['/incar-channel.html', '◇', 'In-car Channel', '인카방송'],
      ['/dj-center.html', '♫', 'DJ Center', '디제이센터']
    ]],
    ['COMMUNICATION', '커뮤니케이션', [
      ['/cafe-world.html', '☕', 'Cafe World', '카페월드'],
      ['/my-car-world.html', '🚘', 'My Car World', '마이카월드']
    ]],
    ['ADVERTISING', '광고', [
      ['/advertiser.html', '▱', 'Sponsor Center', '광고주센터'],
      ['/ads.html', '▣', 'Ad Watching', '광고 시청 및 TL 벌기']
    ]],
    ['TL ECONOMICS', 'TL 경제', [['/wallet.html', '◉', 'Wallet', '지갑']]],
    ['MY', '내 정보', [
      ['/dashboard.html?tab=content', '▤', 'My Library', '내 파일', true],
      ['/dashboard.html?tab=mining', '⛏', 'TLC Mining', 'TLC 채굴', true],
      ['/dashboard.html?tab=mission', '◎', 'Mission', '미션', true],
      ['/dashboard.html?tab=cafe', '☕', 'My Cafe', '나의 카페', true]
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
    body.tl-global-shell{padding-left:252px!important;min-height:100vh}
    .tl-global-sidebar{position:fixed;z-index:500;left:0;top:0;bottom:0;width:252px;display:flex;flex-direction:column;padding:22px 15px 16px;background:#0b0b0e;border-right:1px solid rgba(255,255,255,.09);color:#f5f5f7;font-family:Inter,Pretendard,sans-serif;overflow-y:auto}
    .tl-global-brand{display:flex;align-items:center;gap:11px;padding:4px 10px 25px;color:#fff;font-size:21px;font-weight:800;letter-spacing:-.04em}
    .tl-global-mark{width:34px;height:34px;display:grid;place-items:center;border-radius:10px;background:linear-gradient(140deg,#b69aff,#7655e8 68%,#f5b84b);color:#100d19;font-weight:900}
    .tl-global-links{flex:1;overflow-y:auto}
    .tl-global-section{padding:18px 11px 8px;color:#777586;font-size:10px;font-weight:800;letter-spacing:.15em}
    .tl-global-link{display:flex;align-items:center;gap:12px;min-height:41px;margin:2px 0;padding:9px 12px;border:1px solid transparent;border-radius:10px;color:#aaa8b6;font-size:13px;font-weight:550;text-decoration:none;transition:background .18s,color .18s,border-color .18s}
    .tl-global-link:hover{background:rgba(255,255,255,.055);color:#fff}
    .tl-global-link.is-active{background:rgba(139,92,246,.15);border-color:rgba(139,92,246,.25);color:#cbbaff}
    .tl-global-icon{display:grid;place-items:center;width:20px;flex:0 0 20px;color:#a78bfa;font-size:17px}
    .tl-global-link-child{margin-left:16px;padding-left:12px;width:calc(100% - 16px);font-size:12px;opacity:.9;position:relative}
    .tl-global-link-child:before{content:"";position:absolute;left:2px;top:0;bottom:0;width:1px;background:rgba(255,255,255,.13)}
    .tl-global-balance{margin-top:18px;padding:15px;border:1px solid rgba(139,92,246,.22);border-radius:13px;background:linear-gradient(140deg,rgba(139,92,246,.12),rgba(245,166,35,.035))}
    .tl-global-balance small{display:block;color:#8d899b;font-size:9px;letter-spacing:.13em;font-weight:800}
    .tl-global-balance strong{display:block;margin:7px 0;color:#e6dcff;font:700 20px Manrope,Inter,sans-serif}
    .tl-global-balance a{font-size:11px;color:#f5c16c;text-decoration:none}
    .tl-global-toggle,.tl-global-scrim{display:none}
    @media(max-width:900px){
      body.tl-global-shell{padding-left:0!important}
      .tl-global-sidebar{transform:translateX(-102%);transition:transform .22s ease;width:min(290px,84vw);box-shadow:18px 0 55px rgba(0,0,0,.35)}
      body.tl-global-nav-open .tl-global-sidebar{transform:translateX(0)}
      .tl-global-toggle{display:grid;place-items:center;position:fixed;z-index:520;left:14px;top:13px;width:38px;height:36px;border:1px solid rgba(255,255,255,.13);border-radius:9px;background:#17171b;color:#fff;font-size:17px}
      .tl-global-scrim{display:block;position:fixed;z-index:490;inset:0;border:0;background:rgba(0,0,0,.55);opacity:0;pointer-events:none}
      body.tl-global-nav-open .tl-global-scrim{opacity:1;pointer-events:auto}
      body.tl-global-shell .topbar{padding-left:62px!important}
    }
  </style>`;

  html += '<aside class="tl-global-sidebar" aria-label="' + esc(label('TimeLink navigation', 'TimeLink 메뉴')) + '"><a class="tl-global-brand" href="/dashboard.html?tab=home"><span class="tl-global-mark">T</span><span>TimeLink</span></a><nav class="tl-global-links">';
  sections.forEach(function (section) {
    html += '<div class="tl-global-section" data-tl-nav-en="' + esc(section[0]) + '" data-tl-nav-ko="' + esc(section[1]) + '">' + esc(label(section[0], section[1])) + '</div>';
    section[2].forEach(function (item) {
      html += '<a class="tl-global-link' + (item[4] ? ' tl-global-link-child' : '') + (active(item[0]) ? ' is-active' : '') + '" href="' + esc(item[0]) + '"' + (active(item[0]) ? ' aria-current="page"' : '') + '><span class="tl-global-icon">' + esc(item[1]) + '</span><span data-tl-nav-en="' + esc(item[2]) + '" data-tl-nav-ko="' + esc(item[3]) + '">' + esc(label(item[2], item[3])) + '</span></a>';
    });
  });
  html += '</nav><div class="tl-global-balance"><small>' + esc(label('MY TL BALANCE', '내 TL 잔액')) + '</small><strong id="tlGlobalBalance">— TL</strong><a href="/wallet.html#charge">＋ ' + esc(label('Charge TL', 'TL 충전')) + '</a></div></aside>';

  document.body.insertAdjacentHTML('afterbegin', html);
  document.body.classList.add('tl-global-shell');

  // Remove the legacy page sidebar without touching page content or feature logic.
  var oldSidebar = document.querySelector('.body > .sidebar, .layout > .sidebar, .app > .sidebar, .app > .tl-sidebar');
  if (oldSidebar) oldSidebar.remove();
  var app = document.querySelector('.app');
  if (app) {
    app.style.display = 'block';
    app.style.width = '100%';
    app.style.minWidth = '0';
  }
  var main = document.querySelector('.body > .main, .layout > .main, .app > .main');
  if (main) {
    main.style.width = '100%';
    main.style.minWidth = '0';
    main.style.maxWidth = 'none';
  }

  var user = {};
  try { user = JSON.parse(localStorage.getItem('tl_user') || '{}'); } catch (e) {}
  var balance = document.getElementById('tlGlobalBalance');
  var amount = user.tl_balance != null ? user.tl_balance : user.tl;
  if (balance && amount != null) balance.textContent = Number(amount).toLocaleString() + ' TL';

  // The backend confirms administrator access before the menu is displayed.
  if (token) {
    fetch(API + '/api/admin/settings/__sidebar_access__', {
      headers: {'Authorization':'Bearer ' + token, 'Accept':'application/json'}
    }).then(function (response) {
      return response.ok ? response.json() : null;
    }).then(function (result) {
      if (!result) return;
      var nav = document.querySelector('.tl-global-links');
      if (!nav) return;
      var label = document.createElement('div');
      label.className = 'tl-global-section';
      label.textContent = labelText('ADMIN', '관리자');
      var link = document.createElement('a');
      link.className = 'tl-global-link' + (pathName === '/admin.html' ? ' is-active' : '');
      link.href = '/admin.html';
      link.innerHTML = '<span class="tl-global-icon">⚙</span><span data-tl-nav-en="Admin Console" data-tl-nav-ko="관리자 제어">' + esc(label('Admin Console', '관리자 제어')) + '</span>';
      nav.appendChild(label);
      nav.appendChild(link);
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
  window.addEventListener('tl-language-changed', function (event) {
    var lang = String(event.detail && event.detail.lang || 'en').toLowerCase();
    document.querySelectorAll('[data-tl-nav-en][data-tl-nav-ko]').forEach(function (node) {
      node.textContent = lang.indexOf('ko') === 0 ? node.getAttribute('data-tl-nav-ko') : node.getAttribute('data-tl-nav-en');
    });
  });
  document.querySelector('.tl-global-sidebar').addEventListener('click', function (event) {
    if (event.target.closest('a')) closeNav();
  });
})();
