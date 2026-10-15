/* TimeLink Global Application Shell — canonical navigation + shared wallet */
(function () {
  'use strict';
  if (window.__TL_GLOBAL_SHELL_V3__) return;
  window.__TL_GLOBAL_SHELL_V3__ = true;

  var sections = [
    ['HOME', [['/index.html','⌂','Overview']]],
    ['DIGITAL ASSETS', [['/shareplace.html','◈','SharePlace'],['/dashboard.html?tab=content','▤','My Library']]],
    ['CREATOR', [['/creator.html','✧','Creator Center']]],
    ['BROADCAST', [['/radio.html','◉','TL Broadcast'],['/dj-center.html','♫','DJ Center'],['/cafe-owner.html','▣','Cafe Broadcast'],['/incar.html','◇','In-car']]],
    ['ADVERTISING', [['/advertiser.html','▱','Advertiser Center'],['/ads.html','▣','Campaigns']]],
    ['TL ECONOMICS', [['/wallet.html','◉','TL Wallet'],['/chart.html','⌁','TL-CHART']]],
    ['MY', [['/dashboard.html','◎','My Dashboard']]],
    ['ADMIN', [['/admin.html','⚙','Admin Console']]]
  ];
  var pathName=(location.pathname||'/').replace(/\\/+$/,'')||'/';
  if(pathName==='/admin.html'||pathName==='/incar.html') return;
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];});}
  function isActive(h){var p=h.split('?')[0];return pathName===p || (p==='/index.html'&&pathName==='/') || (p==='/dashboard.html'&&pathName==='/dashboard');}
  var html='<aside class="tl-global-sidebar" aria-label="TimeLink navigation"><a class="tl-global-brand" href="/index.html"><span class="tl-global-mark">T</span><span>TimeLink</span></a><nav class="tl-global-links">';
  sections.forEach(function(section){
    html+='<div class="tl-global-section">'+esc(section[0])+'</div>';
    section[1].forEach(function(item){html+='<a class="tl-global-link'+(isActive(item[0])?' is-active':'')+'" href="'+esc(item[0])+'"'+(isActive(item[0])?' aria-current="page"':'')+'><span class="tl-global-icon">'+esc(item[1])+'</span><span>'+esc(item[2])+'</span></a>';});
  });
  html+='</nav><div class="tl-global-balance"><small>MY TL BALANCE</small><strong id="tlGlobalBalance">— TL</strong><a href="/wallet.html#charge">＋ Charge TL</a></div></aside>';
  var old=document.querySelector('.app > .sidebar, .app > .tl-sidebar, .layout > .sidebar, .body > .sidebar');
  if(old) old.remove();
  var app=document.querySelector('.app');
  if(app){app.style.gridTemplateColumns='minmax(0,1fr)';app.style.minWidth='0';}
  var legacyLayout=document.querySelector('.layout');
  if(legacyLayout){var legacyMain=legacyLayout.querySelector('.main');if(legacyMain)legacyMain.style.marginLeft='0';}
  document.body.insertAdjacentHTML('afterbegin',html);
  document.body.classList.add('tl-global-shell');

  // One server-authoritative wallet value is reflected in every page header and sidebar.
  var API='https://api.timelink.digital';
  var lastWallet=null, walletRequest=null;
  function renderWallet(total){
    var value=Math.max(0,Number(total)||0);
    lastWallet=value;
    var formatted=Math.floor(value).toLocaleString();
    var sidebar=document.getElementById('tlGlobalBalance');
    if(sidebar) sidebar.textContent=formatted+' TL';
    ['tbTl','walletTl','tbTL','tlBalance','tlWalletBalance','globalTlBalance'].forEach(function(id){
      var el=document.getElementById(id);
      if(el) el.textContent=formatted;
    });
    document.querySelectorAll('[data-tl-wallet-balance]').forEach(function(el){el.textContent=formatted;});
    document.querySelectorAll('.tb-tl').forEach(function(el){el.textContent=formatted+' TL';});
    window.dispatchEvent(new CustomEvent('timelink:wallet-synced',{detail:{tl_total:value}}));
  }
  async function syncWallet(){
    if(walletRequest) return walletRequest;
    var token=localStorage.getItem('tl_token');
    if(!token){renderWallet(0);var b=document.getElementById('tlGlobalBalance');if(b)b.textContent='— TL';return;}
    walletRequest=fetch(API+'/api/eco/wallet',{headers:{'Authorization':'Bearer '+token,'Accept':'application/json'},cache:'no-store'})
      .then(function(r){if(!r.ok)throw new Error('wallet '+r.status);return r.json();})
      .then(function(data){
        var total=data&&data.wallet&&data.wallet.tl_total;
        if(total===undefined||total===null)throw new Error('wallet total missing');
        renderWallet(total);
      })
      .catch(function(err){console.warn('[TimeLink wallet sync]',err);})
      .finally(function(){walletRequest=null;});
    return walletRequest;
  }
  syncWallet();
  window.addEventListener('focus',syncWallet);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)syncWallet();});
  window.addEventListener('storage',function(e){if(e.key==='tl_token')syncWallet();});
  window.addEventListener('timelink:wallet-refresh',syncWallet);
  window.addEventListener('timelink:wallet-updated',syncWallet);
  window.setInterval(syncWallet,20000);

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