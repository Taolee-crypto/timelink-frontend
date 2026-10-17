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
  if (pathName === '/admin.html') return;

  var currentLang = '';
  try { currentLang = localStorage.getItem('tl_lang') || ''; } catch (e) {}
  if (!currentLang) currentLang = (navigator.language || navigator.userLanguage || 'ko').toLowerCase();
  currentLang = String(currentLang).toLowerCase().indexOf('ko') === 0 ? 'ko' : 'en';
  function label(en, ko) { return currentLang === 'ko' ? ko : en; }

  // ★ 지시하신 최종 구조 표 100% 반영
  var sections = [
    ['HOME', '홈', [
      ['/', '⌂', 'About TimeLink', '타임링크 소개'],
      ['/dashboard.html', '◎', 'Dashboard', '대시보드'],
      ['/dashboard.html?tab=content', '📁', 'My Content', '내 콘텐츠'],
      ['/wallet.html', '◉', 'Wallet', '지갑'],
      ['/chart.html', '📊', 'TL CHART', 'TL 차트']
    ]],
    ['DIGITAL ASSETS', '디지털자산', [
      ['/shareplace.html', '◈', 'SharePlace', '공유플레이스']
    ]],
    ['CREATOR', '창작', [
      ['/creator-studio.html', '✧', 'Creator Studio', '크리에이터 스튜디오'],
      ['/creator.html', '✎', 'Creator Center', '크리에이터 센터']
    ]],
    ['TL BROADCAST', 'TL 방송국', [
      ['/cafe-channel.html', '▣', 'Cafe Channel', '카페방송'],
      ['/incar-channel.html', '◇', 'In-car Channel', '인카방송'],
      ['/dj-center.html', '♫', 'DJ Center', '디제이센터'],
      ['/cafe-radio.html', '📻', 'Cafe Radio', '카페 라디오'],
      ['/dj-console.html', '🎛', 'DJ Console', 'DJ 콘솔']
    ]],
    ['ADVERTISING', '광고', [
      ['/advertiser.html', '▱', 'Sponsor Center', '광고주센터'],
      ['/ads.html', '▣', 'Ad Watching', '광고 시청'],
      ['/download.html', '⬇', 'Download App', '앱 다운로드']
    ]],
    ['MY', '내 정보', [
      ['/dashboard.html?tab=mining', '⛏', 'TLC Mining', 'TLC 채굴'],
      ['/dashboard.html?tab=mission', '◎', 'Missions', '미션'],
      ['/dashboard.html?tab=cafe', '☕', 'My Cafe', '나의 카페']
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
    body.tl-global-shell{box-sizing:border-box;width:100%;padding-left:252px!important;min-height:100vh;overflow-x:hidden}
    body.tl-global-shell .layout,body.tl-global-shell .app{box-sizing:border-box;width:100%;max-width:none;min-width:0}
    body.tl-global-shell .body{box-sizing:border-box;width:100%;min-width:0;flex:1 1 auto}
    body.tl-global-shell .main{box-sizing:border-box;width:auto!important;max-width:none;min-width:0;flex:1 1 auto;margin:0!important;transform:none!important}
    body.tl-global-shell .quick-bar{max-width:100%;box-sizing:border-box}
    body.tl-global-shell .quick-bar>*{min-width:0;max-width:100%}
    body.tl-global-shell .tl-global-sidebar{position:fixed!important;z-index:10000!important;inset:0 auto 0 0!important;width:252px!important;height:100vh;box-sizing:border-box;display:flex;flex-direction:column;margin:0!important;padding:20px 14px 14px!important;background:#0b0b0e!important;border:0!important;border-right:1px solid rgba(255,255,255,.09)!important;color:#f5f5f7!important;font-family:Inter,Pretendard,sans-serif;overflow:hidden!important;transform:none}
    body.tl-global-shell .tl-global-sidebar *{box-sizing:border-box}
    body.tl-global-shell .tl-global-brand{display:flex;align-items:center;gap:11px;flex:0 0 auto;padding:4px 10px 20px!important;margin:0 0 8px!important;color:#fff!important;font-size:21px;font-weight:800;letter-spacing:-.04em;text-decoration:none;border-bottom:1px solid rgba(255,255,255,.07)}
    body.tl-global-shell .tl-global-mark{width:34px;height:34px;display:grid;place-items:center;flex:0 0 34px;border-radius:10px;background:linear-gradient(140deg,#b69aff,#7655e8 68%,#f5b84b);color:#100d19;font-weight:900}
    body.tl-global-shell .tl-global-sidebar nav.tl-global-links{display:block!important;flex:1 1 auto;min-height:0;width:100%;margin:0!important;padding:8px 0 12px!important;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain}
    
    /* ★ 섹션(대분류) 굵은 글씨 */
    body.tl-global-shell .tl-global-section{display:block;padding:16px 11px 7px!important;margin:0!important;color:#777586!important;font-size:11px;font-weight:800;letter-spacing:.13em;line-height:1.4;text-transform:uppercase;}
    
    /* ★ 소메뉴(링크) - 들여쓰기, 작은 글씨, 앞에 단추(아이콘) */
    body.tl-global-shell .tl-global-link{display:flex!important;align-items:center;gap:8px;min-height:32px;width:auto;margin:1px 0 1px 12px!important;padding:5px 8px!important;border:1px solid transparent;border-radius:6px;color:#aaa8b6!important;font-size:12px;font-weight:500;line-height:1.3;text-decoration:none!important;white-space:normal;position:relative;}
    body.tl-global-shell .tl-global-link:before{content:"";position:absolute;left:-6px;top:50%;transform:translateY(-50%);width:3px;height:3px;border-radius:50%;background:rgba(255,255,255,.2);transition:all .2s;}
    body.tl-global-shell .tl-global-link:hover{background:rgba(255,255,255,.055)!important;color:#fff!important}
    body.tl-global-shell .tl-global-link:hover:before{background:#a78bfa;}
    body.tl-global-shell .tl-global-link.is-active{background:rgba(139,92,246,.15)!important;border-color:rgba(139,92,246,.25)!important;color:#cbbaff!important}
    body.tl-global-shell .tl-global-link.is-active:before{background:#8B5CF6;box-shadow:0 0 6px rgba(139,92,246,.8);}
    
    /* ★ 앞에 붙는 단추(아이콘) 스타일 */
    body.tl-global-shell .tl-global-icon{display:grid;place-items:center;width:18px;height:18px;flex:0 0 18px;padding:0!important;margin:0!important;background:transparent;color:#a78bfa;font-size:13px;line-height:1;opacity:.8;}
    body.tl-global-shell .tl-global-link:hover .tl-global-icon,body.tl-global-shell .tl-global-link.is-active .tl-global-icon{opacity:1;}
    
    body.tl-global-shell .tl-global-balance{flex:0 0 auto;margin:10px 0 0;padding:13px;border:1px solid rgba(139,92,246,.22);border-radius:13px;background:linear-gradient(140deg,rgba(139,92,246,.12),rgba(245,166,35,.035))}
    body.tl-global-shell .tl-global-balance small{display:block;color:#8d899b;font-size:9px;letter-spacing:.13em;font-weight:800}
    body.tl-global-shell .tl-global-balance strong{display:block;margin:7px 0;color:#e6dcff;font:700 20px Manrope,Inter,sans-serif}
    body.tl-global-shell .tl-global-balance a{display:inline-block;font-size:11px;color:#f5c16c;text-decoration:none}
    body.tl-global-shell .tl-global-toggle,body.tl-global-shell .tl-global-scrim{display:none}
    @media(max-width:900px){
      body.tl-global-shell{padding-left:0!important}
      body.tl-global-shell .tl-global-sidebar{width:min(290px,84vw)!important;transform:translateX(-102%)!important;transition:transform .22s ease;box-shadow:18px 0 55px rgba(0,0,0,.35)}
      body.tl-global-nav-open .tl-global-sidebar{transform:translateX(0)!important}
      body.tl-global-shell .tl-global-toggle{display:grid;place-items:center;position:fixed;z-index:10001;left:14px;top:13px;width:38px;height:36px;border:1px solid rgba(255,255,255,.13);border-radius:9px;background:#17171b;color:#fff;font-size:17px}
      body.tl-global-shell .tl-global-scrim{display:block;position:fixed;z-index:9999;inset:0;border:0;background:rgba(0,0,0,.55);opacity:0;pointer-events:none}
      body.tl-global-nav-open .tl-global-scrim{opacity:1;pointer-events:auto}
      body.tl-global-shell .topbar,body.tl-global-shell .hdr{padding-left:62px!important}
    }
  </style>`;

  html += '<aside class="tl-global-sidebar" aria-label="' + esc(label('TimeLink navigation', 'TimeLink 메뉴')) + '"><a class="tl-global-brand" href="/dashboard.html"><span class="tl-global-mark">T</span><span>TimeLink</span></a><nav class="tl-global-links">';
  sections.forEach(function (section) {
    // ★ 대분류(섹션) 타이틀
    html += '<div class="tl-global-section">' + esc(label(section[0], section[1])) + '</div>';
    // ★ 소메뉴(링크)
    section[2].forEach(function (item) {
      html += '<a class="tl-global-link' + (active(item[0]) ? ' is-active' : '') + '" href="' + esc(item[0]) + '"' + (active(item[0]) ? ' aria-current="page"' : '') + '><span class="tl-global-icon">' + esc(item[1]) + '</span><span>' + esc(label(item[2], item[3])) + '</span></a>';
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

  var user = {};
  try { user = JSON.parse(localStorage.getItem('tl_user') || '{}'); } catch (e) {}
  var balance = document.getElementById('tlGlobalBalance');
  var amount = user.tl_balance != null ? user.tl_balance : user.tl;
  if (balance && amount != null) balance.textContent = Number(amount).toLocaleString() + ' TL';

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
      label.textContent = label('ADMIN', '관리자');
      var link = document.createElement('a');
      link.className = 'tl-global-link' + (pathName === '/admin.html' ? ' is-active' : '');
      link.href = '/admin.html';
      link.innerHTML = '<span class="tl-global-icon">⚙</span><span>' + esc(label('Admin Console', '관리자 제어')) + '</span>';
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
  document.querySelector('.tl-global-sidebar').addEventListener('click', function (event) {
    if (event.target.closest('a')) closeNav();
  });

  async function fetchServerBalance(){
    try {
      var r = await fetch(API + '/api/v1/users/me/wallet', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      var d = await r.json();
      var bal = Number(d.tl_balance);
      if(isFinite(bal)){
        var el = document.getElementById('tlGlobalBalance');
        if(el) el.textContent = bal.toLocaleString() + ' TL';
        try {
          var u = JSON.parse(localStorage.getItem('tl_user') || '{}');
          u.tl_balance = bal;
          localStorage.setItem('tl_user', JSON.stringify(u));
        } catch(e){}
      }
    } catch(e){}
  }
  window.addEventListener('tl-balance-updated', function(e){
    if(e.detail && isFinite(e.detail.tl)){
      var el = document.getElementById('tlGlobalBalance');
      if(el) el.textContent = Number(e.detail.tl).toLocaleString() + ' TL';
    }
  });
  fetchServerBalance();
})();
