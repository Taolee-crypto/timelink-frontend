/* TimeLink 공통 상단바 */
(function(){
  var _user = null, _token = null;
  try {
    _user = JSON.parse(localStorage.getItem('tl_user') || 'null');
    _token = localStorage.getItem('tl_token');
  } catch(e){}

  if(!_user || !_token){
    if(location.pathname.indexOf('login.html') === -1 && location.pathname.indexOf('signup.html') === -1){
      document.documentElement.style.visibility = 'hidden';
      location.replace('/login.html?redirect=' + encodeURIComponent(location.pathname + location.search));
    }
    return;
  }

  window.doLogout = function(){
    localStorage.removeItem('tl_token');
    localStorage.removeItem('tl_user');
    location.href = '/login.html';
  };

  function totalTL(){
    var p = Number(_user.tl_p);
    if(!isFinite(p)) p = Number(_user.tl);
    if(!isFinite(p)) p = Number(_user.tl_balance);
    if(!isFinite(p)) p = 0;
    var a = Number(_user.tl_a); if(!isFinite(a)) a = 0;
    var b = Number(_user.tl_b); if(!isFinite(b)) b = 0;
    return p + a + b;
  }
  function tlcVal(){ var t = Number(_user.tlc); return isFinite(t) ? t : 0; }

  var CSS = ''
    + '.tl-topbar{display:flex;align-items:center;gap:14px;padding:0 24px;height:60px;border-bottom:1px solid rgba(255,255,255,.08);position:sticky;top:0;z-index:9000;background:rgba(8,8,15,.9);backdrop-filter:blur(22px);font-family:"Noto Sans KR","Pretendard",sans-serif;color:#fff}'
    + '.tl-topbar a{text-decoration:none;color:inherit}'
    + '.tl-topbar .tl-logo{font-weight:700;letter-spacing:.1em;font-size:14px;color:#fff}'
    + '.tl-topbar .tl-title{font-size:14px;font-weight:700;letter-spacing:.08em;color:#fff;opacity:.85}'
    + '.tl-topbar .tl-search{display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);border-radius:11px;padding:9px 14px;flex:1;max-width:520px;margin-left:auto}'
    + '.tl-topbar .tl-search input{background:none;border:none;outline:none;color:#fff;font-size:13px;width:100%;font-family:inherit}'
    + '.tl-topbar .tl-search input::placeholder{color:rgba(255,255,255,.35)}'
    + '.tl-topbar .tl-upload{padding:9px 18px;border-radius:9px;border:none;background:linear-gradient(135deg,#9B75FA 0%,#7042D8 72%,#F5A623 100%);color:#fff;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap}'
    + '.tl-topbar .tl-balance{display:flex;align-items:center;gap:8px;font-size:12px;font-family:"JetBrains Mono",monospace;white-space:nowrap}'
    + '.tl-topbar .tl-bal-tl{color:#64D2FF;font-weight:700}'
    + '.tl-topbar .tl-bal-tlc{color:#8B5CF6;font-weight:700}'
    + '.tl-topbar .tl-sep{width:1px;height:16px;background:rgba(255,255,255,.15)}'
    + '.tl-topbar .tl-logout{margin-left:8px;padding:5px 12px;border-radius:8px;border:1px solid rgba(255,255,255,.15);background:transparent;color:rgba(255,255,255,.6);font-size:11px;cursor:pointer}';

  function styleInject(){
    if(document.getElementById('tl-topbar-style')) return;
    var st = document.createElement('style');
    st.id = 'tl-topbar-style';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  function build(){
    var title = (document.title || 'TIMELINK').split('—')[0].split('|')[0].trim();
    var bar = document.createElement('div');
    bar.className = 'tl-topbar';
    bar.innerHTML =
      '<a href="/" class="tl-logo">TIMELINK</a>'
      + '<div class="tl-title">' + title.toUpperCase() + '</div>'
      + '<div class="tl-search"><span style="color:rgba(255,255,255,.35);font-size:14px">🔍</span>'
      + '<input type="text" placeholder="파일명, 아티스트, 태그 검색..." id="tl-topbar-search"></div>'
      + '<button class="tl-upload" onclick="location.href=\'/creator-studio.html\'">📤 내 파일 업로드</button>'
      + '<div class="tl-balance">'
      +   '<span style="color:rgba(255,255,255,.5)">⏱</span>'
      +   '<span class="tl-bal-tl">' + totalTL().toLocaleString() + ' TL</span>'
      +   '<span class="tl-sep"></span>'
      +   '<span class="tl-bal-tlc">' + tlcVal().toFixed(0) + ' TLC</span>'
      +   '<button class="tl-logout" onclick="doLogout()">↩ 로그아웃</button>'
      + '</div>';
    var search = bar.querySelector('#tl-topbar-search');
    search.addEventListener('keydown', function(e){
      if(e.key === 'Enter' && search.value.trim()){
        location.href = '/shareplace.html?q=' + encodeURIComponent(search.value.trim());
      }
    });
    return bar;
  }

  function inject(){
    styleInject();
    if(document.querySelector('.tl-topbar')) return;
    var bar = build();
    if(document.body.firstChild){
      document.body.insertBefore(bar, document.body.firstChild);
    } else {
      document.body.appendChild(bar);
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();