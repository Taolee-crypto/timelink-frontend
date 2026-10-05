/* TimeLink 공통 사이드바 */
(function(){
  'use strict';
  
  var _MENU = [
    {group:'방송', items:[
      {href:'/radio', icon:'📻', label:'TL방송국'}
    ]},
    {group:'내 방송', items:[
      {href:'/dj-center', icon:'🎧', label:'DJ 센터'},
      {href:'/cafe-channel', icon:'+', label:'채널 개설'},
      {href:'/cafe-owner', icon:'☕', label:'마이카페'},
      {href:'/creator', icon:'🎨', label:'크리에이터 센터'}
    ]},
    {group:'플랫폼', items:[
      {href:'/dashboard', icon:'📊', label:'대시보드'},
      {href:'/shareplace', icon:'📁', label:'SharePlace'},
      {href:'/chart', icon:'🏆', label:'TL CHART'},
      {href:'/wallet', icon:'💰', label:'지갑 & 채굴'}
    ]},
    {group:'기타', items:[
      {href:'/ads', icon:'📺', label:'광고 시청'},
      {href:'/advertiser', icon:'📢', label:'광고주 센터'},
      {href:'/download', icon:'⬇', label:'앱 다운로드'}
    ]}
  ];
  
  var path = location.pathname.replace(/\.html$/, '').replace(/\/+$/,'') || '/';
  if(path === '') path = '/';
  
  function isActive(href){
    if(href === path) return true;
    if(href === '/radio' && path === '/radio') return true;
    return false;
  }
  
  var html = '<aside class="sidebar tl-sidebar">';
  html += '<a href="/radio" class="sb-logo"><div class="sb-logo-icon">📻</div><span class="sb-logo-text">TL방송국</span></a>';
  html += '<nav class="sb-nav">';
  _MENU.forEach(function(g){
    html += '<div class="sb-section">' + g.group + '</div>';
    g.items.forEach(function(it){
      html += '<a href="' + it.href + '" class="sb-link' + (isActive(it.href) ? ' active' : '') + '">';
      html += '<span class="sb-icon">' + it.icon + '</span><span>' + it.label + '</span>';
      html += '</a>';
    });
  });
  html += '</nav>';
  html += '<div style="padding:12px 16px;border-top:1px solid var(--bd)">';
  html += '<div style="font-size:10px;color:var(--t3);font-family:var(--fm);margin-bottom:6px">내 TL 잔액</div>';
  html += '<div id="sbTLBal" style="font-size:16px;font-weight:700;color:var(--amber);font-family:var(--fm);margin-bottom:10px">-- TL</div>';
  html += '<button onclick="if(window.openPayModal)openPayModal()" style="width:100%;padding:9px;border-radius:10px;border:1px solid rgba(245,166,35,.3);background:rgba(245,166,35,.08);color:var(--amber);font-size:12px;font-weight:700;cursor:pointer;font-family:var(--fn)">⚡ TL 충전</button>';
  html += '</div></aside>';
  
  // 기존 .sidebar 있으면 대체, 없으면 .app 안 or body 첫 자식으로 삽입
  var existing = document.querySelector('aside.sidebar:not(.tl-sidebar)');
  if(existing){
    existing.outerHTML = html;
  } else {
    var app = document.querySelector('.app');
    if(app){
      app.insertAdjacentHTML('afterbegin', html);
    } else {
      document.body.insertAdjacentHTML('afterbegin', html);
    }
  }
  
  // TL 잔액 로드
  try {
    var u = JSON.parse(localStorage.getItem('tl_user') || '{}');
    var el = document.getElementById('sbTLBal');
    if(el && (u.tl_balance != null || u.tl != null)){
      el.textContent = Number(u.tl_balance ?? u.tl ?? 0).toLocaleString() + ' TL';
    }
  } catch(e){}
})();
