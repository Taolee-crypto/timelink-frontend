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
    console.log('[TL3_DIAG] loadHeader:', fileId);
    var r = await fetch(API + '/api/v1/tl3/header/' + fileId, {headers: authHeaders()});
    console.log('[TL3_DIAG] loadHeader status:', r.status);
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

    console.log('[TL3.playStream] sourceopen listener 등록');
        ms.addEventListener('sourceopen', async function(){
          console.log('[TL3.playStream] ✅ sourceopen 발생! msState=', ms.readyState);
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
  // playFile — .tl3 파일 직접 재생 (오프라인)
  // TL3_PLAYFILE_INJECTED
  // ─────────────────────────────
  async function playFile(file, audio, opts){
    opts = opts || {};
    var buf = file instanceof ArrayBuffer ? new Uint8Array(file)
            : new Uint8Array(await file.arrayBuffer());

    // 1. 매직/버전
    if(buf[0]!==0x54||buf[1]!==0x4C||buf[2]!==0x4E||buf[3]!==0x4B) throw new Error('Not TL3 (magic)');
    if(buf[4]!==0x03) throw new Error('Not TL3 v3 (version)');

    // 2. headerLen (uint32 BE)
    var hlen = ((buf[5]<<24)|(buf[6]<<16)|(buf[7]<<8)|buf[8])>>>0;
    var headerStart = 9;
    var headerEnd = 9 + hlen;
    if(headerEnd > buf.length) throw new Error('Header length OOB');

    var headerJson = new TextDecoder().decode(buf.subarray(headerStart, headerEnd));
    var header = JSON.parse(headerJson);

    // 3. 필수 필드
    if(!header.lic) throw new Error('header.lic 없음 (재빌드 필요)');
    var fid = unhex(header.fid);
    var salt = unhex(header.salt);
    var hashMp3 = unhex(header.hash_mp3);
    var lic = unhex(header.lic);
    var tokens = header.mp3_tokens || [];
    var mp3Info = header.mp3 || {};
    var N = Number(mp3Info.N || 0);
    var firstOffset = Number(mp3Info.first_offset || 0);
    var segBytes = Number(mp3Info.seg_bytes || 0);
    var lastBytes = Number(mp3Info.last_bytes || 0);

    var onSegment = opts.onSegment || function(){};
    var onError = opts.onError || function(){};

    // 4. 세그먼트 위치 계산 (mp3 프레임 그대로 저장된 경우 segBytes=0)
    //  buildTL3V3FromMp3: seg_bytes=0, last_bytes=마지막세그먼트 ctLen, first_offset만 있음
    //  → 각 세그먼트 ctLen은? mp3_tokens와 무관. 실제로는 segments 배열이 필요.
    //  대안: 파일 뒤쪽을 세그먼트 개수로 균등 분할할 수 없으므로,
    //       mp3Info에 seg_bytes가 없으면 last_bytes로 역산 불가.
    //  → 헤더에 mp3_seg_lens 배열이 있으면 사용.

    var segLens = header.mp3_seg_lens || null;

    // 5. MediaSource
    var ms = new MediaSource();
    var msUrl = URL.createObjectURL(ms);
    var sb = null;
    var n = 1;   // 1-based
    var stopped = false;
    var off = firstOffset;

    function stop(){ stopped = true; }
    audio._tl3Stop = stop;

    console.log('[TL3.playStream] sourceopen listener 등록');
        ms.addEventListener('sourceopen', async function(){
          console.log('[TL3.playStream] ✅ sourceopen 발생! msState=', ms.readyState);
      try { sb = ms.addSourceBuffer('audio/mpeg'); }
      catch(e){ onError(e); return; }
      _next();
    });

    async function _next(){
      if(stopped) return;
      if(n > N){
        try { if(ms.readyState === 'open') ms.endOfStream(); } catch(e){}
        return;
      }
      try {
        // ctLen 결정
        var ctLen;
        if(segLens && segLens.length >= n){
          ctLen = Number(segLens[n-1]);
        } else {
          // fallback: seg_bytes + tag, 마지막은 last_bytes
          if(segBytes > 0){
            ctLen = (n < N) ? (segBytes + 16) : (lastBytes || (segBytes + 16));
          } else {
            // 정보 없음 → 에러
            onError(new Error('segment length 정보 없음 (mp3_seg_lens 필요)'));
            return;
          }
        }
        var ct = buf.subarray(off, off + ctLen);
        off += ctLen;

        // Tprev
        var Tprev;
        if(n === 1){
          var T0c = await sha256(fid, hashMp3, salt);
          var T0f = tokens[0] ? unhex(tokens[0]) : null;
          if(T0f && hex(T0c) !== hex(T0f)){ onError(new Error('[스파인] T_0 검증 실패')); return; }
          Tprev = T0c;
        } else {
          var tp = tokens[n-1];
          if(!tp){ onError(new Error('[스파인] 토큰 없음 n='+n)); return; }
          Tprev = unhex(tp);
        }

        // T_n 검증
        var hct = await sha256(ct);
        var Tnc = await sha256(Tprev, fid, enc(String(n)), hct);
        var Tnf = tokens[n] ? unhex(tokens[n]) : null;
        if(Tnf && hex(Tnc) !== hex(Tnf)){
          onError(new Error('[스파인] T_'+n+' 검증 실패'));
          return;
        }

        // K_n 유도
        var K_n = await sha256(Tprev, lic, enc('K' + n));
        var key = await crypto.subtle.importKey('raw', K_n, {name:'AES-GCM'}, false, ['decrypt']);

        // 복호화
        var plain;
        try {
          plain = new Uint8Array(await crypto.subtle.decrypt(
            {name:'AES-GCM', iv: ivFor(n), tagLength: 128},
            key,
            ct
          ));
        } catch(e){
          onError(new Error('복호화 실패 n='+n+' : '+e.message));
          return;
        }

        // append
        await new Promise(function(res, rej){
          var h = function(){ sb.removeEventListener('updateend', h); res(); };
          sb.addEventListener('updateend', h);
          try { sb.appendBuffer(plain); } catch(e){ rej(e); }
        });

        onSegment({ index: n-1, total: N });

        n++;
        _next();
      } catch(e){
        onError(e);
      }
    }

    return { msUrl: msUrl, sessionId: 'offline_'+Date.now(), stop: stop, header: header };
  }

  // ─────────────────────────────
  // resolveUrl (shareplace용)
  // ─────────────────────────────
  function resolveUrl(fileUrl, opts){
    console.log('[TL3_DIAG] resolveUrl called:', fileUrl);
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
          console.log('[TL3.playStream] _next n=', n);
          try {
            var sr = await fetch(API + '/api/v1/tl3/segment/' + fileId + '?segment=' + n + '&session_id=' + encodeURIComponent(sessionId), {headers: authHeaders()});
            if(sr.status === 416){
              try { if(ms.readyState === 'open') ms.endOfStream(); } catch(e){}
              return;
            }
            console.log('[TL3.playStream] segment', n, 'status', sr.status);
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

            var codeData = null;
            for(var _try = 0; _try < 6; _try++){
              var cr = await fetch(API + '/api/v1/tl3/code/' + fileId + '?segment=' + n + '&session_id=' + encodeURIComponent(sessionId), {headers: authHeaders()});
              if(cr.ok){ codeData = await cr.json(); break; }
              if(cr.status === 409){ await new Promise(function(ok){ setTimeout(ok, 500); }); continue; }
              onError(new Error('code ' + cr.status)); return;
            }
            if(!codeData){ onError(new Error('code 재시도 실패')); return; }
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

            console.log('[TL3.playStream] ✅ appended segment', n);
            onSegment({index: n, seconds: durationMs/1000, remaining: codeData.remaining_tl});

            setTimeout(function(){
              fetch(API + '/api/v1/tl3/segment/confirm/' + fileId, {
                method: 'POST',
                headers: Object.assign({}, authHeaders(), {'Content-Type':'application/json'}),
                body: JSON.stringify({session_id: sessionId, played_seconds: durationMs/1000})
              }).catch(function(){});
            }, durationMs);

            n++;
            _next();
          } catch(e){ onError(e); }
        }

        resolve(msUrl);
      } catch(e){ console.error('[TL3_DIAG] resolveUrl error:', e); reject(e); }
    });
  }

  // ─────────────────────────────
  // playStream (온라인 MediaSource 재생, GC 방지 포함)
  //   TL3.playStream(fileId, audioEl, opts) → Promise
  //   opts: { onReady, onSegment, onError, sessionId }
  // ─────────────────────────────
  function playStream(fileId, audioEl, opts){
    console.log('[TL3.playStream] START fileId=', fileId);
    opts = opts || {};
    var onSegment = opts.onSegment || function(){};
    var onError   = opts.onError   || function(){};
    var onReady   = opts.onReady   || function(){};

    // 이전 MediaSource 정리 (⭐ 지금 넘어온 audioEl과 다른 것만)
    if (window._tlMsRefs && window._tlMsRefs.length) {
      window._tlMsRefs = window._tlMsRefs.filter(function(r){
        if (r.el === audioEl) return true; // 이 오디오의 것은 유지
        try { if (r.ms && r.ms.readyState === 'open') r.ms.endOfStream(); } catch(e){}
        return false;
      });
    }

    return new Promise(async function(resolve, reject){
      try {
        var fileUrlStr = String(fileId);
        var fidStr = fileUrlStr.split('/').pop().split('?')[0];
        var header = await loadHeader(fidStr);

        var ms = new MediaSource();
        var msUrl = URL.createObjectURL(ms);
        window._tlMsRefs = window._tlMsRefs || [];
        window._tlMsRefs.push({ ms: ms, url: msUrl, el: audioEl });

        var sessionId = opts.sessionId || genSid();
        var tokens = header.mp3_tokens || [];
        var hashMp3 = unhex(header.hash_mp3 || '');
        var fid = unhex(header.fid || '');
        var salt = unhex(header.salt || '');

        var sb = null, n = 0, stopped = false;

        console.log('[TL3.playStream] sourceopen listener 등록');
        ms.addEventListener('sourceopen', async function(){
          console.log('[TL3.playStream] ✅ sourceopen 발생! msState=', ms.readyState);
          try {
            sb = ms.addSourceBuffer('audio/mpeg');
            console.log('[TL3.playStream] ✅ SourceBuffer 생성');
          } catch(e) {
            onError(e); reject(e); return;
          }
          onReady({ ms: ms, msUrl: msUrl, sessionId: sessionId });
          _next();
        });

        // ⭐ 중요: audio.src를 sourceopen 리스너 밖에서 설정해야 sourceopen이 뜸
        console.log('[TL3.playStream] audio.src = msUrl (리스너 밖)');
        audioEl.src = msUrl;
        audioEl.load();
        try {
          await audioEl.play();
          console.log('[TL3.playStream] ✅ audio.play() 성공');
        } catch(playErr) {
          console.log('[TL3.playStream] ❌ play 실패:', playErr.name, playErr.message);
          try {
            audioEl.muted = true;
            await audioEl.play();
            audioEl.muted = false;
          } catch(e2) {
            onError(e2); reject(e2); return;
          }
        }

        async function _next(){
          if(stopped) return;
          console.log('[TL3.playStream] _next n=', n);
          try {
            var sr = await fetch(API + '/api/v1/tl3/segment/' + fidStr + '?segment=' + n + '&session_id=' + encodeURIComponent(sessionId), {headers: authHeaders()});
            if(sr.status === 416){
              try { if(ms.readyState === 'open') ms.endOfStream(); } catch(e){}
              return;
            }
            console.log('[TL3.playStream] segment', n, 'status', sr.status);
            if(!sr.ok){ onError(new Error('segment ' + sr.status)); return; }
            var ciphertext = new Uint8Array(await sr.arrayBuffer());
            var durationMs = Number(sr.headers.get('X-TL3-Segment-Duration-Ms') || 5000);

            var Tprev;
            if(n === 0){
              var T0c = await sha256(fid, hashMp3, salt);
              var T0f = tokens[0] ? unhex(tokens[0]) : null;
              if(T0f && hex(T0c) !== hex(T0f)){ onError(new Error('T_0 검증 실패')); return; }
              Tprev = T0c;
            } else {
              var t = tokens[n]; if(!t) throw new Error('토큰 없음 n=' + n);
              Tprev = unhex(t);
            }
            var h_n = await sha256(ciphertext);
            var Tnc = await sha256(Tprev, fid, enc(String(n + 1)), h_n);
            var Tnf = tokens[n + 1] ? unhex(tokens[n + 1]) : null;
            if(Tnf && hex(Tnc) !== hex(Tnf)){ onError(new Error('T_' + (n+1) + ' 검증 실패')); return; }

            var codeData = null;
            for(var _try = 0; _try < 6; _try++){
              var cr = await fetch(API + '/api/v1/tl3/code/' + fidStr + '?segment=' + n + '&session_id=' + encodeURIComponent(sessionId), {headers: authHeaders()});
              if(cr.ok){ codeData = await cr.json(); break; }
              if(cr.status === 409){ await new Promise(function(ok){ setTimeout(ok, 500); }); continue; }
              onError(new Error('code ' + cr.status)); return;
            }
            if(!codeData){ onError(new Error('code 재시도 실패')); return; }
            var lic = unhex(codeData.lic_n || '');
            var segNumber = n + 1;
            var K_n = await sha256(Tprev, lic, enc('K' + segNumber));
            var key = await crypto.subtle.importKey('raw', K_n, {name:'AES-GCM'}, false, ['decrypt']);
            var plain = new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM', iv: ivFor(segNumber), tagLength: 128}, key, ciphertext));

            await new Promise(function(res, rej){
              var h = function(){ sb.removeEventListener('updateend', h); res(); };
              sb.addEventListener('updateend', h);
              try { sb.appendBuffer(plain); }
              catch(e){ sb.removeEventListener('updateend', h); rej(e); }
            });

            console.log('[TL3.playStream] ✅ appended segment', n);
            onSegment({index: n, seconds: durationMs/1000, remaining: codeData.remaining_tl});

            setTimeout(function(){
              fetch(API + '/api/v1/tl3/segment/confirm/' + fidStr, {
                method: 'POST',
                headers: Object.assign({}, authHeaders(), {'Content-Type':'application/json'}),
                body: JSON.stringify({session_id: sessionId, played_seconds: durationMs/1000})
              }).catch(function(){});
            }, durationMs);

            n++;
            _next();
          } catch(e){ onError(e); }
        }

        resolve({ ms: ms, msUrl: msUrl, sessionId: sessionId });
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

    playStream: playStream,
    playFile: playFile,
    streamSegmented: streamSegmented,
    stop: stop,
    loadHeader: loadHeader,
    version: 'v3-spine'
  };
})(window);
