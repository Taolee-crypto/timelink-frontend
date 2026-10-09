/*! tl3.js — TimeLink TL3 v3 스파인 클라이언트
 *  서버 API:
 *    /api/v1/tl3/header/:id       — 헤더 (T_0~T_N 스파인)
 *    /api/v1/tl3/segment/:id      — ciphertext (복호화 X)
 *    /api/v1/tl3/code/:id         — lic_n (TL 차감)
 *    /api/v1/tl3/segment/confirm/:id — 확정
 *
 *  클라이언트:
 *    - 스파인 검증 (T_n 체인)
 *    - K_n = SHA256(T_{n-1}, lic_n, "K"+n) 계산
 *    - AES-GCM 복호화
 *    - MediaSource 스트리밍
 */
(function(global){
  'use strict';
  var API = (typeof window !== 'undefined' && window.TL3_API_BASE) || 'https://api.timelink.digital';

  // ─────────────────────────────
  // 유틸
  // ─────────────────────────────
  function genSid(){ return 'tl3_' + Date.now() + '_' + Math.random().toString(36).slice(2,10); }
  function unhex(h){ var a = new Uint8Array(h.length/2); for(var i=0;i<a.length;i++) a[i] = parseInt(h.substr(i*2,2),16); return a; }
  function hex(b){ return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join(''); }
  function enc(s){ return new TextEncoder().encode(s); }

  async function sha256(){
    var parts = Array.prototype.slice.call(arguments);
    var total = parts.reduce(function(n,p){ return n + p.length; }, 0);
    var buf = new Uint8Array(total);
    var o = 0;
    for(var i=0;i<parts.length;i++){ buf.set(parts[i], o); o += parts[i].length; }
    return new Uint8Array(await crypto.subtle.digest('SHA-256', buf));
  }

  function ivFor(n){
    var v = new Uint8Array(12);
    new DataView(v.buffer).setBigUint64(4, BigInt(n), false);
    return v;
  }

  function getTok(){
    try { return localStorage.getItem('tl_token') || ''; } catch(e){ return ''; }
  }

  function authHeaders(){
    return { 'Authorization': 'Bearer ' + getTok() };
  }

  // ─────────────────────────────
  // 헤더 로드
  // ─────────────────────────────
  async function loadHeader(fileId){
    var r = await fetch(API + '/api/v1/tl3/header/' + fileId, {headers: authHeaders()});
    if(!r.ok) throw new Error('header 로드 실패 (' + r.status + ')');
    return await r.json();
  }

  // ─────────────────────────────
  // 세션 관리 (MediaSource)
  // ─────────────────────────────
  var _sessions = new WeakMap();  // audio → {stop, sessionId}

  function _startSession(audio, opts){
    var fileId = opts.fileId;
    var header = opts.header;
    var sessionId = opts.sessionId || genSid();
    var tokens = header.mp3_tokens || [];        // T_0 ~ T_N
    var hashMp3 = unhex(header.hash_mp3 || '');
    var fid = unhex(header.fid || '');
    var salt = unhex(header.salt || '');
    var onSegment = opts.onSegment || function(){};
    var onError = opts.onError || function(){};

    var ms = new MediaSource();
    var msUrl = URL.createObjectURL(ms);
    var sb = null;
    var n = 0;
    var stopped = false;
    var pendingConfirmTimers = [];

    ms.addEventListener('sourceopen', async function(){
      try { sb = ms.addSourceBuffer('audio/mpeg'); }
      catch(e){ console.error('[TL3] addSourceBuffer 실패:', e); onError(e); return; }
      _nextSegment();
    });

    async function _nextSegment(){
      if(stopped) return;
      try {
        // 1. ciphertext 요청
        var segUrl = API + '/api/v1/tl3/segment/' + fileId + '?segment=' + n + '&session_id=' + encodeURIComponent(sessionId);
        var sr = await fetch(segUrl, {headers: authHeaders()});
        if(sr.status === 416){
          try { if(ms.readyState === 'open') ms.endOfStream(); } catch(e){}
          return;
        }
        if(!sr.ok){
          var err = await sr.json().catch(function(){ return {}; });
          onError(new Error(err.error || ('segment ' + sr.status)));
          return;
        }
        var ciphertext = new Uint8Array(await sr.arrayBuffer());
        var durationMs = Number(sr.headers.get('X-TL3-Segment-Duration-Ms') || 5000);

        // 2. 스파인 검증: T_n 로드 + T_{n+1} 재계산
        var Tprev;
        if(n === 0){
          var T0_calc = await sha256(fid, hashMp3, salt);
          var T0_file = tokens[0] ? unhex(tokens[0]) : null;
          if(T0_file && hex(T0_calc) !== hex(T0_file)){
            onError(new Error('[스파인] T_0 검증 실패'));
            return;
          }
          Tprev = T0_calc;
        } else {
          var prevTok = tokens[n];
          if(!prevTok) throw new Error('[스파인] 토큰 체인 없음 (index=' + n + ')');
          Tprev = unhex(prevTok);
        }

        // 2-b. T_{n+1} 재계산 + 파일과 비교
        var h_n = await sha256(ciphertext);
        var Tnext_calc = await sha256(Tprev, fid, enc(String(n + 1)), h_n);
        var Tnext_file = tokens[n + 1] ? unhex(tokens[n + 1]) : null;
        if(Tnext_file && hex(Tnext_calc) !== hex(Tnext_file)){
          onError(new Error('[스파인] T_' + (n+1) + ' 검증 실패 (변조 의심)'));
          return;
        }

        // 3. lic_n 요청 (TL 차감)
        var codeUrl = API + '/api/v1/tl3/code/' + fileId + '?segment=' + n + '&session_id=' + encodeURIComponent(sessionId);
        var cr = await fetch(codeUrl, {headers: authHeaders()});
        if(!cr.ok){
          var cErr = await cr.json().catch(function(){ return {}; });
          onError(new Error(cErr.error || ('code ' + cr.status)));
          return;
        }
        var codeData = await cr.json();
        var lic = unhex(codeData.lic_n || '');

        // 4. K_n = SHA256(T_{n-1}, lic, "K"+n)
        // 주의: 빌드 시 n은 1-based. 현재 n은 0-based.
        var segNumber = n + 1;
        var K_n = await sha256(Tprev, lic, enc('K' + segNumber));
        var key = await crypto.subtle.importKey('raw', K_n, {name:'AES-GCM'}, false, ['decrypt']);

        // 5. 복호화
        var plain;
        try {
          plain = new Uint8Array(await crypto.subtle.decrypt(
            {name:'AES-GCM', iv: ivFor(segNumber), tagLength: 128},
            key,
            ciphertext
          ));
        } catch(e){
          onError(new Error('복호화 실패 seg=' + n + ' : ' + e.message));
          return;
        }

        // 6. MediaSource append
        await new Promise(function(res, rej){
          var h = function(){ sb.removeEventListener('updateend', h); res(); };
          sb.addEventListener('updateend', h);
          try { sb.appendBuffer(plain); } catch(e){ rej(e); }
        });

        onSegment({
          index: n,
          seconds: durationMs / 1000,
          remaining: codeData.remaining_tl
        });

        // 7. confirm (재생 시간 후)
        var timer = setTimeout(function(){
          fetch(API + '/api/v1/tl3/segment/confirm/' + fileId, {
            method: 'POST',
            headers: Object.assign({}, authHeaders(), {'Content-Type':'application/json'}),
            body: JSON.stringify({session_id: sessionId, played_seconds: durationMs/1000})
          }).catch(function(){});
        }, durationMs);
        pendingConfirmTimers.push(timer);

        n++;
        _nextSegment();
      } catch(e){
        console.error('[TL3] _nextSegment 오류:', e);
        onError(e);
      }
    }

    function stop(){
      stopped = true;
      pendingConfirmTimers.forEach(function(t){ clearTimeout(t); });
      pendingConfirmTimers = [];
    }

    audio._tl3Stop = stop;
    audio._tl3SessionId = sessionId;

    var session = {msUrl: msUrl, sessionId: sessionId, stop: stop};
    _sessions.set(audio, session);
    return session;
  }

  // ─────────────────────────────
  // resolveUrl (shareplace용)
  // ─────────────────────────────
  function resolveUrl(fileUrl, opts){
    opts = opts || {};
    return new Promise(async function(resolve, reject){
      try {
        var fileId = String(fileUrl).split('/').pop().split('?')[0];
        var header = await loadHeader(fileId);

        // MediaSource 시작 (audio는 나중에 붙음)
        var ms = new MediaSource();
        var msUrl = URL.createObjectURL(ms);
        var sessionId = opts.sessionId || genSid();
        var tokens = header.mp3_tokens || [];
        var hashMp3 = unhex(header.hash_mp3 || '');
        var fid = unhex(header.fid || '');
        var salt = unhex(header.salt || '');
        var onSegment = opts.onSegment || function(){};
        var onError = opts.onError || function(){};

        var sb = null;
        var n = 0;
        var stopped = false;

        ms.addEventListener('sourceopen', function(){
          try { sb = ms.addSourceBuffer('audio/mpeg'); }
          catch(e){ reject(e); return; }
          _next();
        });

        async function _next(){
          if(stopped) return;
          try {
            var sr = await fetch(API + '/api/v1/tl3/segment/' + fileId + '?segment=' + n + '&session_id=' + encodeURIComponent(sessionId), {headers: authHeaders()});
            if(sr.status === 416){
              try { if(ms.readyState === 'open') ms.endOfStream(); } catch(e){}
              return;
            }
            if(!sr.ok){ onError(new Error('segment ' + sr.status)); return; }
            var ciphertext = new Uint8Array(await sr.arrayBuffer());
            var durationMs = Number(sr.headers.get('X-TL3-Segment-Duration-Ms') || 5000);

            var Tprev;
            if(n === 0){
              var T0c = await sha256(fid, hashMp3, salt);
              var T0f = tokens[0] ? unhex(tokens[0]) : null;
              if(T0f && hex(T0c) !== hex(T0f)){ onError(new Error('[스파인] T_0 검증 실패')); return; }
              Tprev = T0c;
            } else {
              var t = tokens[n];
              if(!t) throw new Error('[스파인] 토큰 없음 n=' + n);
              Tprev = unhex(t);
            }
            var h_n = await sha256(ciphertext);
            var Tnc = await sha256(Tprev, fid, enc(String(n + 1)), h_n);
            var Tnf = tokens[n + 1] ? unhex(tokens[n + 1]) : null;
            if(Tnf && hex(Tnc) !== hex(Tnf)){ onError(new Error('[스파인] T_' + (n+1) + ' 검증 실패')); return; }

            var cr = await fetch(API + '/api/v1/tl3/code/' + fileId + '?segment=' + n + '&session_id=' + encodeURIComponent(sessionId), {headers: authHeaders()});
            if(!cr.ok){ onError(new Error('code ' + cr.status)); return; }
            var codeData = await cr.json();
            var lic = unhex(codeData.lic_n || '');

            var segNumber = n + 1;
            var K_n = await sha256(Tprev, lic, enc('K' + segNumber));
            var key = await crypto.subtle.importKey('raw', K_n, {name:'AES-GCM'}, false, ['decrypt']);
            var plain = new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM', iv: ivFor(segNumber), tagLength: 128}, key, ciphertext));

            await new Promise(function(res){
              var h = function(){ sb.removeEventListener('updateend', h); res(); };
              sb.addEventListener('updateend', h);
              sb.appendBuffer(plain);
            });

            onSegment({index: n, seconds: durationMs/1000, remaining: codeData.remaining_tl});

            setTimeout(async function(){
              try {
                await fetch(API + '/api/v1/tl3/segment/confirm/' + fileId, {
                  method: 'POST',
                  headers: Object.assign({}, authHeaders(), {'Content-Type':'application/json'}),
                  body: JSON.stringify({session_id: sessionId, played_seconds: durationMs/1000})
                });
              } catch(e){}
              n++;
              _next();
            }, durationMs);
          } catch(e){ onError(e); }
        }

        resolve(msUrl);
      } catch(e){ reject(e); }
    });
  }

  // ─────────────────────────────
  // streamSegmented (tl3-player용)
  // ─────────────────────────────
  function streamSegmented(audio, segUrl, opts){
    opts = opts || {};
    return new Promise(async function(resolve, reject){
      try {
        var fileId = String(segUrl).split('/').pop().split('?')[0];
        var header = await loadHeader(fileId);
        var ctx = _startSession(audio, {
          fileId: fileId,
          header: header,
          sessionId: opts.sessionId,
          onSegment: opts.onSegment,
          onError: opts.onError
        });
        resolve({ decoded: true, sessionId: ctx.sessionId });
      } catch(e){ reject(e); }
    });
  }

  function stop(audio){
    if(audio && audio._tl3Stop) audio._tl3Stop();
    try { audio.pause(); audio.src = ''; } catch(e){}
  }

  global.TL3 = {
    resolveUrl: resolveUrl,
    streamSegmented: streamSegmented,
    stop: stop,
    loadHeader: loadHeader,
    version: 'v3-spine'
  };
})(window);
