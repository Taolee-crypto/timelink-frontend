/*! offline-fetcher.js — TimeLink 온라인/오프라인 추상화
 *  tl3.js가 fetch 대신 이걸 호출하면 오프라인 재생 자동 지원
 *  - online: 서버 fetch (기존 동작)
 *  - offline: IndexedDB (TL3OfflineStore)
 *  - navigator.onLine + forceMode() 로 판정
 */
(function(global){
  'use strict';
  var API = (typeof window !== 'undefined' && window.TL3_API_BASE) || 'https://api.timelink.digital';

  function getTok(){
    try { return localStorage.getItem('tl_token') || ''; } catch(e){ return ''; }
  }
  function authHeaders(){
    return { 'Authorization': 'Bearer ' + getTok() };
  }

  // ─────────────────────────────
  // online
  // ─────────────────────────────
  var online = {
    async segment(fileId, n, sessionId){
      var url = API + '/api/v1/tl3/segment/' + fileId +
                '?segment=' + n + '&session_id=' + encodeURIComponent(sessionId);
      var r = await fetch(url, {headers: authHeaders()});
      if(r.status === 416) return { end: true };
      if(!r.ok) throw new Error('segment ' + r.status);
      var ciphertext = new Uint8Array(await r.arrayBuffer());
      var durationMs = Number(r.headers.get('X-TL3-Segment-Duration-Ms') || 5000);
      return { ciphertext: ciphertext, durationMs: durationMs };
    },

    async code(fileId, n, sessionId){
      var url = API + '/api/v1/tl3/code/' + fileId +
                '?segment=' + n + '&session_id=' + encodeURIComponent(sessionId);
      var r = await fetch(url, {headers: authHeaders()});
      if(!r.ok) throw new Error('code ' + r.status);
      return await r.json();
    },

    async confirm(fileId, sessionId, seconds){
      var url = API + '/api/v1/tl3/segment/confirm/' + fileId;
      fetch(url, {
        method: 'POST',
        headers: Object.assign({}, authHeaders(), {'Content-Type': 'application/json'}),
        body: JSON.stringify({ session_id: sessionId, played_seconds: seconds })
      }).catch(function(){});
    }
  };

  // ─────────────────────────────
  // offline
  // ─────────────────────────────
  var offline = {
    async segment(fileId, n, sessionId){
      if(!global.TL3OfflineStore) throw new Error('TL3OfflineStore not loaded');
      var seg = await global.TL3OfflineStore.getSegment(fileId, n);
      if(!seg) return { end: true };
      return { ciphertext: seg.ciphertext, durationMs: seg.durationMs || 5000 };
    },

    async code(fileId, n, sessionId){
      if(!global.TL3OfflineStore) throw new Error('TL3OfflineStore not loaded');
      var ledger = await global.TL3OfflineStore.getLedger(fileId);
      if(!ledger) throw new Error('ledger not found');
      await global.TL3OfflineStore.bumpLedger(fileId);
      var newLedger = await global.TL3OfflineStore.getLedger(fileId);
      // lic_n을 64자리 hex로 (기존 서버 포맷과 동일)
      var licHex = (newLedger.licN || 0).toString(16).padStart(64, '0');
      return { lic_n: licHex, remaining_tl: null, offline: true };
    },

    async confirm(fileId, sessionId, seconds){
      // 오프라인에서는 나중에 sync로 일괄 처리
      // 지금은 로컬 소비 카운트만 이미 bumpLedger에서 처리됨
    }
  };

  // ─────────────────────────────
  // 모드 판정
  // ─────────────────────────────
  var _forced = null;   // 'online' | 'offline' | null

  function isOffline(){
    if(_forced === 'offline') return true;
    if(_forced === 'online') return false;
    return typeof navigator !== 'undefined' && navigator.onLine === false;
  }

  function mode(){
    return isOffline() ? 'offline' : 'online';
  }

  function fetcher(){
    return isOffline() ? offline : online;
  }

  function forceMode(m){
    _forced = (m === 'online' || m === 'offline') ? m : null;
    if(typeof console !== 'undefined') console.log('[TL3Fetcher] mode =', mode());
  }

  global.TL3Fetcher = {
    online: online,
    offline: offline,
    fetcher: fetcher,
    mode: mode,
    forceMode: forceMode,
    isOffline: isOffline
  };

  if(typeof window !== 'undefined'){
    window.addEventListener('online', function(){
      if(typeof console !== 'undefined') console.log('[TL3Fetcher] network online');
    });
    window.addEventListener('offline', function(){
      if(typeof console !== 'undefined') console.log('[TL3Fetcher] network offline');
    });
  }
})(window);
