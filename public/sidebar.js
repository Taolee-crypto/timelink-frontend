/* TimeLink Global Navigation — shared shell for every service */
(function(){
  'use strict';
  if(window.__TL_GLOBAL_NAV__) return;
  window.__TL_GLOBAL_NAV__ = true;
  var groups = [
    {group:'HOME',items:[{href:'/index.html',icon:'⌂',label:'Home'}]},
    {group:'DIGITAL ASSETS',items:[
      {href:'/shareplace.html',icon:'◈',label:'SharePlace'},
      {href:'/dashboard.html?tab=content',icon:'▤',label:'My Library'},
      {href:'/tl3-player.html',icon:'♫',label:'TL3 Player'},
      {href:'/tlj-viewer.html',icon:'▧',label:'TLJ Viewer'},
      {href:'/track.html',icon:'♪',label:'Track'}
    ],note:'TL3  ·  TL4  ·  TLD  ·  TLJ'},
    {group:'CREATOR',items:[
      {href:'/creator.html',icon:'✧',label:'Creator Profile'},
      {href:'/creator-studio.html',icon:'＋',label:'Creator Studio'}
    ]},
    {group:'BROADCAST',items:[
      {href:'/radio.html',icon:'◉',label:'TL Broadcast'},
      {href:'/dj-center.html',icon:'♫',label:'DJ Center'},
      {href:'/cafe-radio.html',icon:'▣',label:'Cafe Broadcast'},
      {href:'/cafe-owner.html',icon:'⌂',label:'Cafe Management'},
      {href:'/incar.html',icon:'◇',label:'In-car'}
    ]},
    {group:'ADVERTISING',items:[
      {href:'/advertiser.html',icon:'▱',label:'Advertiser Center'},
      {href:'/ads.html',icon:'▣',label:'Campaign & Ads'}
    ]},
    {group:'TL ECONOMICS',items:[
      {href:'/wallet.html',icon:'◉',label:'TL Wallet'},
      {href:'/chart.html',icon:'⌁',label:'POC & TLC'}
    ]},
    {group:'MY',items:[{href:'/dashboard.html',icon:'◎',label:'My Dashboard'}]}
  ];
  var path=(location.pathname||'/').replace(/\.html$/i,'').replace(/\/+$/,'')||'/';
  function active(href){
    var target=href.split('?')[0].replace(/\.html$/i,'').replace(/\/+$/,'')||'/';
    return path===target||(target==='/dashboard'&&path==='/');
  }
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  var html='<aside class="sidebar tl-sidebar" aria-label="TimeLink global navigation">';
  html+='<a href="/index.html" class="sb-logo" aria-label="TimeLink home"><span class="sb-logo-icon">T</span><span class="sb-logo-text">TimeLink</span></a><nav class="sb-nav" aria-label="Global navigation">';
  groups.forEach(function(g){
    html+='<div class="sb-section">'+esc(g.group)+'</div>';
    g.items.forEach(function(it){
      var on=active(it.href);
      html+='<a href="'+esc(it.href)+'" class="sb-link'+(on?' active':'')+'"'+(on?' aria-current="page"':'')+'><span class="sb-icon" aria-hidden="true">'+esc(it.icon)+'</span><span>'+esc(it.label)+'</span></a>';
    });
    if(g.note) html+='<div class="tl-nav-note">'+esc(g.note)+'</div>';
  });
  html+='<div class="sb-section tl-admin-label">SYSTEM</div><a href="/admin.html" class="sb-link'+(active('/admin.html')?' active':'')+'"><span class="sb-icon">⚙</span><span>Admin Console</span></a></nav>';
  html+='<div class="tl-sidebar-balance"><div class="tl-sidebar-caption">MY TL BALANCE</div><div id="sbTLBal" class="tl-sidebar-amount">-- TL</div><button type="button" class="tl-sidebar-charge" onclick="if(window.openPayModal)window.openPayModal();else location.href=\'/wallet.html#charge\';">＋ Charge TL</button></div></aside>';
  var app=document.querySelector('.app');
  var existing=document.querySelector('.sidebar:not(.tl-sidebar)');
  if(existing){existing.outerHTML=html;}
  else if(app){app.insertAdjacentHTML('afterbegin',html);}
  else{
    document.body.insertAdjacentHTML('afterbegin',html);
    document.body.classList.add('tl-global-has-sidebar');
  }
  try{
    var user=JSON.parse(localStorage.getItem('tl_user')||'{}');
    var balance=document.getElementById('sbTLBal');
    if(balance&&(user.tl_balance!=null||user.tl!=null)) balance.textContent=Number(user.tl_balance!=null?user.tl_balance:user.tl).toLocaleString()+' TL';
  }catch(e){}
  if(!document.getElementById('tl-global-nav-style')){
    var style=document.createElement('style');style.id='tl-global-nav-style';
    style.textContent='.tl-nav-note{padding:4px 16px 10px 55px;color:rgba(245,245,247,.34);font:10px Inter,Pretendard,sans-serif;letter-spacing:.04em}.tl-admin-label{margin-top:18px;padding-top:14px;border-top:1px solid rgba(255,255,255,.07)}.tl-sidebar-balance{padding:14px 16px;border-top:1px solid rgba(255,255,255,.08)}.tl-sidebar-caption{font-size:10px;color:rgba(245,245,247,.4);letter-spacing:.1em;margin-bottom:7px}.tl-sidebar-amount{font-size:17px;font-weight:750;color:#F5A623;margin-bottom:11px}.tl-sidebar-charge{width:100%;padding:10px 12px;border-radius:9px;border:1px solid rgba(245,166,35,.28);background:rgba(245,166,35,.09);color:#F5A623;font-size:12px;font-weight:700;cursor:pointer}.tl-sidebar-charge:hover{background:rgba(245,166,35,.16)}.tl-sidebar .sb-nav{overflow-y:auto;flex:1}.tl-sidebar .sb-section{padding:17px 16px 6px;font-size:9px;font-weight:750;letter-spacing:.13em;color:rgba(245,245,247,.38)}.tl-sidebar .sb-link{padding:9px 16px;font-size:12px;gap:11px}.tl-sidebar .sb-icon{width:22px;height:22px;display:grid;place-items:center;border-radius:7px;background:rgba(255,255,255,.045);font-size:13px}.tl-global-has-sidebar{padding-left:236px!important}.tl-global-has-sidebar>.tl-sidebar{position:fixed!important;left:0;top:0;bottom:0;width:220px;height:100vh;z-index:900;overflow-y:auto}.tl-global-has-sidebar>.hdr,.tl-global-has-sidebar>header,.tl-global-has-sidebar>nav{margin-left:0}.tl-global-has-sidebar>.main,.tl-global-has-sidebar>main,.tl-global-has-sidebar>.wrap{min-width:0;max-width:none}.tl-global-has-sidebar>.wrap{width:auto;margin-left:0;margin-right:0}@media(max-width:900px){.tl-global-has-sidebar{padding-left:0!important}.tl-global-has-sidebar>.tl-sidebar{display:none!important}}';
    document.head.appendChild(style);
  }
})();