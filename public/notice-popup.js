/* ══════════════════════════════════════
   TimeLink 공지 팝업 (모든 페이지, 하루 1번)
   - /api/notice/active에서 공지 조회
   - mode=on일 때만 표시
   - 5가지 스타일 지원
══════════════════════════════════════ */
(function(){
  var today = new Date().toISOString().slice(0,10);
  var seenKey = 'tl_notice_seen_' + today;
  if(localStorage.getItem(seenKey)) return;
  
  fetch('https://api.timelink.digital/api/notice/active')
    .then(function(r){ return r.json(); })
    .then(function(d){
      if(!d || !d.active || !d.message) return;
      renderNotice(d);
    })
    .catch(function(){});
  
  function renderNotice(d){
    var style = d.style || 'default';
    var msg = (d.message || '').replace(/</g,'&lt;');
    var until = d.until || '';
    
    var styles = {
      default: '<div style="background:#0D0D1C;border:1px solid rgba(0,255,148,.3);border-radius:14px;padding:24px;color:#F0F0FF">'+
        '<div style="font-size:16px;font-weight:700;margin-bottom:12px;color:#00FF94">📢 공지사항</div>'+
        '<div style="font-size:13px;line-height:1.8;white-space:pre-line;color:rgba(240,240,255,.85)">'+msg+'</div>'+
        (until?'<div style="margin-top:14px;font-size:11px;color:rgba(240,240,255,.5)">📅 '+until+'까지</div>':'')+
        '<button id="tl-notice-close" style="margin-top:20px;width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(135deg,#00FF94,#00CC78);color:#07070F;font-size:13px;font-weight:700;cursor:pointer">확인</button></div>',
      celebration: '<div style="background:linear-gradient(135deg,#0D1F18,#0D1C2C);border:2px solid #00FF94;border-radius:16px;padding:28px;color:#F0F0FF;position:relative;overflow:hidden">'+
        '<div style="position:absolute;top:-20px;right:-20px;font-size:80px;opacity:.15">🎉</div>'+
        '<div style="font-size:22px;font-weight:900;margin-bottom:8px;background:linear-gradient(135deg,#00FF94,#38BFFF);-webkit-background-clip:text;-webkit-text-fill-color:transparent">🎉 축하합니다!</div>'+
        '<div style="font-size:13px;line-height:1.8;white-space:pre-line;color:rgba(240,240,255,.9)">'+msg+'</div>'+
        (until?'<div style="margin-top:14px;font-size:11px;color:#00FF94">📅 '+until+'까지</div>':'')+
        '<button id="tl-notice-close" style="margin-top:20px;width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#00FF94,#38BFFF);color:#07070F;font-size:14px;font-weight:900;cursor:pointer">🎊 확인</button></div>',
      warning: '<div style="background:#1F0D10;border:2px solid #FF4D6A;border-radius:14px;padding:24px;color:#F0F0FF">'+
        '<div style="font-size:18px;font-weight:700;margin-bottom:12px;color:#FF4D6A">⚠️ 주의 안내</div>'+
        '<div style="font-size:13px;line-height:1.8;white-space:pre-line;color:rgba(240,240,255,.85)">'+msg+'</div>'+
        (until?'<div style="margin-top:14px;font-size:11px;color:#FF4D6A">📅 '+until+'까지</div>':'')+
        '<button id="tl-notice-close" style="margin-top:20px;width:100%;padding:12px;border-radius:10px;border:none;background:#FF4D6A;color:#fff;font-size:13px;font-weight:700;cursor:pointer">확인했습니다</button></div>',
      promo: '<div style="background:linear-gradient(135deg,#1A0D2C,#0D1C2C);border:2px solid #7C5CFF;border-radius:16px;padding:28px;color:#F0F0FF">'+
        '<div style="font-size:20px;font-weight:900;margin-bottom:10px;background:linear-gradient(135deg,#7C5CFF,#38BFFF);-webkit-background-clip:text;-webkit-text-fill-color:transparent">🎁 특별 혜택</div>'+
        '<div style="font-size:13px;line-height:1.8;white-space:pre-line;color:rgba(240,240,255,.9)">'+msg+'</div>'+
        (until?'<div style="margin-top:14px;font-size:11px;color:#7C5CFF;font-weight:700">⏰ '+until+'까지</div>':'')+
        '<button id="tl-notice-close" style="margin-top:20px;width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#7C5CFF,#38BFFF);color:#fff;font-size:14px;font-weight:800;cursor:pointer">지금 확인하기 →</button></div>',
      urgent: '<div style="background:#1F1700;border:2px solid #FFBE3D;border-radius:14px;padding:24px;color:#F0F0FF">'+
        '<div style="font-size:18px;font-weight:700;margin-bottom:12px;color:#FFBE3D">🚨 긴급 공지</div>'+
        '<div style="font-size:13px;line-height:1.8;white-space:pre-line;color:rgba(240,240,255,.9)">'+msg+'</div>'+
        (until?'<div style="margin-top:14px;font-size:11px;color:#FFBE3D;font-weight:700">📅 '+until+'까지</div>':'')+
        '<button id="tl-notice-close" style="margin-top:20px;width:100%;padding:12px;border-radius:10px;border:2px solid #FFBE3D;background:transparent;color:#FFBE3D;font-size:13px;font-weight:700;cursor:pointer">확인</button></div>'
    };
    
    var html = styles[style] || styles.default;
    var overlay = document.createElement('div');
    overlay.id = 'tl-notice-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);backdrop-filter:blur(12px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .3s';
    overlay.innerHTML = '<div style="max-width:440px;width:100%;font-family:\'Noto Sans KR\',Pretendard,sans-serif;transform:scale(.9);transition:transform .3s" id="tl-notice-content">'+html+'</div>';
    document.body.appendChild(overlay);
    
    requestAnimationFrame(function(){
      overlay.style.opacity = '1';
      document.getElementById('tl-notice-content').style.transform = 'scale(1)';
    });
    
    document.getElementById('tl-notice-close').onclick = function(){
      overlay.style.opacity = '0';
      setTimeout(function(){ overlay.remove(); }, 300);
      localStorage.setItem(seenKey, '1');
    };
  }
})();
