/* TimeLink Global Application Shell — shared navigation */
(function () {
  'use strict';
  if (window.__TL_GLOBAL_SHELL_V2__) return;
  window.__TL_GLOBAL_SHELL_V2__ = true;

  var API = (typeof window.TL3_API_BASE !== 'undefined' && window.TL3_API_BASE) || 'https://api.timelink.digital';
  var sections = [
    ['HOME', [['/index.html','⌂','Overview']]],
    ['DIGITAL ASSETS', [['/shareplace.html','◈','Shareplace']]],
    ['CREATOR', [['/creator-studio.html','✧','Creator Center']]],
    ['TL BROADCAST', [
      ['/cafe-channel.html','▣','Cafe Channel'],
      ['/incar-channel.html','◇','In-car Channel'],
      ['/dj-center.html','♫','DJ Center']
    ]],
    ['ADVERTISING', [
      ['/advertiser.html','▱','Sponsor Center'],
      ['/ads.html','▣','Ad Watching']
    ]],
    ['TL ECONOMICS', [['/wallet.html','◉','Wallet']]],
    ['MY', [
      ['/dashboard.html?tab=content','▤','My Library',true],
      ['/dashboard.html?tab=mining','⛏','TLC Mining',true],
      ['/dashboard.html?tab=mission','◎','Mission',true],
      ['/dashboard.html?tab=cafe','☕','Cafe Channel',true]
    ]]
  ];

  var pathName=(location.pathname||'/').replace(/\\/+$/,'')||'/';
  // These pages have their own dedicated navigation shell.
  if(pathName==='/admin.html'||pathName==='/incar.html') return;

  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];});}
  function isActive(h){
    var parts=h.split('?'),p=parts[0],targetTab='';
    if(parts[1]){var m=parts[1].match(/(?:^|&)tab=([^&]*)/);if(m)targetTab=decodeURIComponent(m[1]);}
    var same=pathName===p||(p==='/index.html'&&pathName==='/')||(p==='/dashboard.html'&&pathName==='/dashboard');
    if(!same)return false;
    if(p==='/dashboard.html'){
      var currentTab=new URLSearchParams(location.search).get('tab')||'home';
      return targetTab?currentTab===targetTab:currentTab==='home';
    }
    return true;
  }

  function renderSections(){
    var html='<style id="tl-global-sidebar-hierarchy">.tl-global-link.tl-global-link-child{margin-left:18px;padding-left:14px;width:calc(100% - 18px);font-size:12px;opacity:.86;position:relative}.tl-global-link.tl-global-link-child:before{content:"";position:absolute;left:3px;top:0;bottom:0;width:1px;background:rgba(255,255,255,.14)}.tl-global-link.tl-global-link-child .tl-global-icon{font-size:12px;width:18px}</style><aside class="tl-global-sidebar" aria-label="TimeLink navigation"><a class="tl-global-brand" href="/index.html"><span class="tl-global-mark">T</span><span>TimeLink</span></a><nav class="tl-global-links">';
    sections.forEach(function(section){
      html+='<div class="tl-global-section">'+esc(section[0])+'</div>';
      section[1].forEach(function(item){
        var active=isActive(item[0]);
        html+='<a class="tl-global-link'+(item[3]?' tl-global-link-child':'')+(active?' is-active':'')+'" href="'+esc(item[0])+'"'+(active?' aria-current="page"':'')+'><span class="tl-global-icon">'+esc(item[1])+'</span><span>'+esc(item[2])+'</span></a>';
      });
    });
    html+='</nav><div class="tl-global-balance"><small>MY TL BALANCE</small><strong id="tlGlobalBalance">— TL</strong><a href="/wallet.html#charge">＋ Charge TL</a></div></aside>';
    document.body.insertAdjacentHTML('afterbegin',html);
  }

  var old=document.querySelector('.app > .sidebar, .app > .tl-sidebar, .layout > .sidebar, .body > .sidebar');
  if(old) old.remove();
  var app=document.querySelector('.app');
  if(app){app.style.gridTemplateColumns='minmax(0,1fr)';app.style.minWidth='0';}
  var legacyLayout=document.querySelector('.layout');
  if(legacyLayout){var legacyMain=legacyLayout.querySelector('.main');if(legacyMain)legacyMain.style.marginLeft='0';}

  renderSections();
  document.body.classList.add('tl-global-shell');

  var user={};
  try{user=JSON.parse(localStorage.getItem('tl_user')||'{}');}catch(e){}
  var bal=document.getElementById('tlGlobalBalance');
  var amount=user.tl_balance!=null?user.tl_balance:(user.tl!=null?user.tl:user.tl_balance);
  if(bal&&amount!=null)bal.textContent=Number(amount).toLocaleString()+' TL';

  // Admin navigation is revealed only after the backend confirms the user's role.
  // Never trust a role value stored in browser localStorage.
  var token='';
  try{token=localStorage.getItem('tl_token')||'';}catch(e){}
  if(token){
    fetch(API+'/api/admin/settings/__sidebar_access__',{
      method:'GET',
      headers:{'Authorization':'Bearer '+token,'Accept':'application/json'}
    }).then(function(response){
      if(!response.ok)return null;
      return response.json();
    }).then(function(result){
      if(!result)return;
      var nav=document.querySelector('.tl-global-links');
      if(!nav)return;
      var section=document.createElement('div');
      section.className='tl-global-section';
      section.textContent='ADMIN';
      var link=document.createElement('a');
      link.className='tl-global-link'+(pathName==='/admin.html'?' is-active':'');
      link.href='/admin.html';
      if(pathName==='/admin.html')link.setAttribute('aria-current','page');
      link.innerHTML='<span class="tl-global-icon">⚙</span><span>Admin Console</span>';
      nav.appendChild(section);
      nav.appendChild(link);
    }).catch(function(){});
  }

  var toggle=document.createElement('button');
  toggle.type='button';toggle.className='tl-global-toggle';toggle.setAttribute('aria-label','Open navigation');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰';
  var scrim=document.createElement('button');
  scrim.type='button';scrim.className='tl-global-scrim';scrim.setAttribute('aria-label','Close navigation');
  document.body.appendChild(scrim);document.body.appendChild(toggle);
  function close(){document.body.classList.remove('tl-global-nav-open');toggle.setAttribute('aria-expanded','false');}
  toggle.addEventListener('click',function(){var open=document.body.classList.toggle('tl-global-nav-open');toggle.setAttribute('aria-expanded',open?'true':'false');});
  scrim.addEventListener('click',close);
  document.querySelector('.tl-global-sidebar').addEventListener('click',function(e){if(e.target.closest('a'))close();});
})();
