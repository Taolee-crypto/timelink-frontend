/* TimeLink Global Application Shell — independent of legacy page classes */
(function () {
  'use strict';
  if (window.__TL_GLOBAL_SHELL_V2__) return;
  window.__TL_GLOBAL_SHELL_V2__ = true;

  var sections = [
    ['HOME', [['/index.html','⌂','Overview']]],
    ['DIGITAL ASSETS', [['/shareplace.html','◈','SharePlace'],['/dashboard.html?tab=content','▤','My Library'],['/tl3-player.html','♫','TL3 Player'],['/tlj-viewer.html','▧','TLJ Viewer']]],
    ['CREATOR', [['/creator.html','✧','Creator Center'],['/creator-studio.html','＋','Creator Studio']]],
    ['BROADCAST', [['/radio.html','◉','TL Broadcast'],['/dj-center.html','♫','DJ Center'],['/cafe-radio.html','▣','Cafe Broadcast'],['/cafe-owner.html','⌂','Cafe Management'],['/incar.html','◇','In-car']]],
    ['ADVERTISING', [['/advertiser.html','▱','Advertiser Center'],['/ads.html','▣','Campaigns']]],
    ['TL ECONOMICS', [['/wallet.html','◉','TL Wallet'],['/chart.html','⌁','POC & TLC']]],
    ['MY', [['/dashboard.html','◎','My Dashboard']]]
  ];
  var path=(location.pathname||'/').replace(/\/+$/,'')||'/';
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function isActive(h){var p=h.split('?')[0];return path===p || (p==='/dashboard.html'&&path==='/dashboard') || (p==='/shareplace.html'&&path==='/track.html');}
  var html='<aside class="tl-global-sidebar" aria-label="TimeLink navigation"><a class="tl-global-brand" href="/index.html"><span class="tl-global-mark">T</span><span>TimeLink</span></a><nav class="tl-global-links">';
  sections.forEach(function(section){
    html+='<div class="tl-global-section">'+esc(section[0])+'</div>';
    section[1].forEach(function(item){html+='<a class="tl-global-link'+(isActive(item[0])?' is-active':'')+'" href="'+esc(item[0])+'"'+(isActive(item[0])?' aria-current="page"':'')+'><span class="tl-global-icon">'+esc(item[1])+'</span><span>'+esc(item[2])+'</span></a>';});
  });
  html+='</nav><div class="tl-global-balance"><small>MY TL BALANCE</small><strong id="tlGlobalBalance">— TL</strong><a href="/shareplace.html#charge">＋ Charge TL</a></div></aside>';
  // Dashboard has its own essential in-page tabs (Home, Wallet, Mining, Library, Missions).
  // Keep that navigation intact instead of adding a second global sidebar.
  if (document.querySelector('.body > .sidebar')) return;

  var old=document.querySelector('.app > .sidebar, .app > .tl-sidebar');
  if(old) old.remove();
  var app=document.querySelector('.app');
  if(app){app.style.gridTemplateColumns='minmax(0,1fr)';app.style.minWidth='0';}
  document.body.insertAdjacentHTML('afterbegin',html);
  document.body.classList.add('tl-global-shell');
  var user={};try{user=JSON.parse(localStorage.getItem('tl_user')||'{}');}catch(e){}
  var bal=document.getElementById('tlGlobalBalance');
  var amount=user.tl_balance!=null?user.tl_balance:user.tl;
  if(bal&&amount!=null)bal.textContent=Number(amount).toLocaleString()+' TL';

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
