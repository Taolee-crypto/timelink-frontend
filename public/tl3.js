/*! tl3.js — TimeLink TL3 v4 Player (MP3 + LP Opus 통합 재생) */
(function (global) {
  'use strict';
  const API = (window.TL3_API_BASE) || 'https://api.timelink.digital';
  const MAGIC = [0x54, 0x4c, 0x4e, 0x4b]; // TLNK

  // ── 유틸리티 ──
  function hex(b) { return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join(''); }
  function unhex(h) { const a = new Uint8Array(h.length / 2); for (let i = 0; i < a.length; i++) a[i] = parseInt(h.substr(i * 2, 2), 16); return a; }
  function enc(s) { return new TextEncoder().encode(s); }
  function ivFor(n) { const iv = new Uint8Array(12); new DataView(iv.buffer).setBigUint64(4, BigInt(n), false); return iv; }
  function genSid() { return 'tl3_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10); }
  async function sha256(...parts) {
    let total = 0; for (const p of parts) total += p.length;
    const buf = new Uint8Array(total); let o = 0;
    for (const p of parts) { buf.set(p, o); o += p.length; }
    return new Uint8Array(await crypto.subtle.digest('SHA-256', buf));
  }
  function getTok() { return localStorage.getItem('tl_token') || ''; }
  function authHeaders() { return { 'Authorization': 'Bearer ' + getTok() }; }

  // ── V4 Player ──
  async function playStream(fileId, audioEl, opts) {
    opts = opts || {};
    const onSegment = opts.onSegment || function(){};
    const onError = opts.onError || function(){};
    const onReady = opts.onReady || function(){};
    const sessionId = String(opts.sessionId || genSid());
    console.log('[TL3v4] START fileId=', fileId, 'sessionId=', sessionId);

    // 1. 헤더 로드 (V4)
    const fileUrlStr = String(fileId);
    const fidStr = fileUrlStr.split('/').pop().split('?')[0];
    
    let header;
    try {
      const r = await fetch(API + '/api/v1/tl3/header/' + fidStr, { headers: authHeaders() });
      if (!r.ok) throw new Error('header 로드 실패 (' + r.status + ')');
      header = await r.json();
    } catch (e) {
      onError(e);
      throw e;
    }
    
    console.log('[TL3v4] header loaded', { N: header.mp3.N, lp_opus: header.lp_opus });

    // 2. 미디어소스 설정
    const ms = new MediaSource();
    const msUrl = URL.createObjectURL(ms);
    let sb = null, n = 1;
    let stopped = false;
    let lpController = null;
    let segmentTimer = null, pendingMediaStart = -1, pendingDurationMs = 0, confirmBusy = false;
    let segmentIndexPending = -1;

    const prefetchedPayloads = new Map();

    // Ciphertext는 현재 구간 처리와 겹쳐 최대 세 구간 앞까지 미리 받는다.
    // 암호문 선행 수신은 TL 예약을 하지 않으며, 다음 라이선스는 confirm 요청에서 원자적으로 예약한다.
    async function fetchSegmentPayload(segmentNo) {
      const segUrl = API + '/api/v1/tl3/segment/' + fidStr + '?segment=' + (segmentNo-1) + '&session_id=' + encodeURIComponent(sessionId);
      const startedAt = performance.now();
      const response = await fetch(segUrl, { headers: authHeaders() });
      const headersMs = Math.round(performance.now() - startedAt);
      console.log('[TL3v4] segment response', segmentNo, response.status, {
        headersMs: headersMs,
        durationMs: response.headers.get('X-TL3-Segment-Duration-Ms')
      });
      if (response.status === 416) return { status:416 };
      if (!response.ok) throw new Error('segment ' + response.status);
      const ciphertext = new Uint8Array(await response.arrayBuffer());
      const elapsedMs = Math.round(performance.now() - startedAt);
      console.log('[TL3v4] segment payload ready', segmentNo, {
        elapsedMs: elapsedMs,
        bodyMs: Math.max(0, elapsedMs - headersMs),
        bytes: ciphertext.byteLength
      });
      return {
        status:response.status,
        ciphertext:ciphertext,
        durationMs:Number(response.headers.get('X-TL3-Segment-Duration-Ms') || 1000)
      };
    }

    function schedulePayloadPrefetch(segmentNo) {
      if (segmentNo < 1 || segmentNo > Number(header.mp3.N || 0) || prefetchedPayloads.has(segmentNo)) return;
      const promise = fetchSegmentPayload(segmentNo).catch(function(error) {
        console.warn('[TL3v4] ciphertext prefetch failed; demand retry will follow', segmentNo, error);
        return { retry:true };
      });
      prefetchedPayloads.set(segmentNo, promise);
      console.log('[TL3v4] ciphertext prefetch queued', segmentNo);
    }

    async function takeSegmentPayload(segmentNo) {
      const pending = prefetchedPayloads.get(segmentNo);
      let payload = pending ? await pending : await fetchSegmentPayload(segmentNo);
      if (pending) prefetchedPayloads.delete(segmentNo);
      if (payload && payload.retry) payload = await fetchSegmentPayload(segmentNo);
      // Fetch a rolling three-segment ciphertext window while the current
      // segment is being licensed, decrypted and appended. Ciphertext fetches
      // do not reserve a TL license or deduct TL.
      for (let ahead = 1; ahead <= 3; ahead++) schedulePayloadPrefetch(segmentNo + ahead);
      return payload;
    }

    async function confirmPending(playedSeconds, nextSegment) {
      if (confirmBusy || segmentIndexPending < 0) return null;
      confirmBusy = true;
      const index = segmentIndexPending;
      const played = Math.max(0, Math.min(pendingDurationMs / 1000, Number(playedSeconds) || 0));
      try {
        const body = {session_id:sessionId, played_seconds:played};
        if (Number.isInteger(nextSegment)) body.next_segment = nextSegment;
        const response = await fetch(API + '/api/v1/tl3/segment/confirm/' + encodeURIComponent(fidStr), {
          method: 'POST',
          headers: Object.assign({'Content-Type':'application/json'}, authHeaders()),
          body: JSON.stringify(body)
        });
        const data = await response.json().catch(function(){ return {}; });
        if (!response.ok || !data.ok) throw new Error(data.error || ('confirm ' + response.status));
        if (index === segmentIndexPending) segmentIndexPending = -1;
        if (data.wallet_tl !== undefined) onSegment({index:index, seconds:played, remaining:data.wallet_tl, wallet_tl:data.wallet_tl, asset_remaining_tl:data.asset_remaining_tl});
        return data;
      } catch (error) {
        console.warn('[TL3v4] segment confirm failed; server expiry refund remains available:', error);
        return null;
      } finally { confirmBusy = false; }
    }

    async function attachLpRealtime(meta, durationMs) {
      // The player's AudioWorklet runs the same stateful LP stages as the
      // creator-side reference renderer. DSP state persists across TL3 chunks.
      try {
        if (lpController && lpController.enabled) {
          await lpController.resume();
          return;
        }
        if (global.TL3Audio && typeof global.TL3Audio.attach === 'function') {
          const base = global.TL3Audio.defaultProfile || { enabled:true, g:{} };
          const profile = Object.assign({}, base, meta && meta.enabled === true ? meta : {});
          profile.g = Object.assign({}, base.g || {}, meta && meta.enabled === true && meta.g || {});
          profile.enabled = true;
          profile.duration_ms = Number(durationMs || profile.duration_ms || 0);
          lpController = await global.TL3Audio.attach(audioEl, profile);
          if (lpController && lpController.enabled) {
            console.log('[TL3-AUDIO] player reference LP engine active.', {
              version: global.TL3Audio.version || 'reference-lp',
              mode: lpController.mode || 'unknown',
              profile: profile.version || 'player-reference',
              state: lpController.state()
            });
            return;
          }
        }
      } catch (error) {
        console.warn('[TL3-AUDIO] LP initialization failed; native output retained.', error);
      }
      lpController = null;
      console.info('[TL3-AUDIO] native audio passthrough active.');
    }
    audioEl._tl3Confirm = function() {
      if (segmentTimer) { clearInterval(segmentTimer); segmentTimer = null; }
      const played = pendingMediaStart >= 0 ? Math.max(0, audioEl.currentTime - pendingMediaStart) : 0;
      pendingMediaStart = -1;
      return confirmPending(played);
    };
    audioEl._tl3Stop = function() {
      if (stopped) return;
      stopped = true;
      if (segmentTimer) { clearInterval(segmentTimer); segmentTimer = null; }
      const played = pendingMediaStart >= 0 ? Math.max(0, audioEl.currentTime - pendingMediaStart) : 0;
      pendingMediaStart = -1;
      try { audioEl.pause(); } catch (_) {}
      // Stop the LP AudioContext as well as the media element. Suspending the
      // context silences the AudioWorklet/fallback DSP immediately, while
      // preserving the single MediaElementAudioSourceNode for replay.
      if (lpController && typeof lpController.stop === 'function') {
        lpController.stop().catch(function (error) {
          console.warn('[TL3-AUDIO] stop/suspend failed:', error);
        });
      }
      confirmPending(played);
    };
    audioEl._tl3SegmentStop = audioEl._tl3Stop;

    return new Promise(async (resolve, reject) => {
      try {
        ms.addEventListener('sourceopen', async function() {
          console.log('[TL3v4] MediaSource sourceopen');
          try {
            sb = ms.addSourceBuffer('audio/mpeg');
            console.log('[TL3v4] SourceBuffer ready:', sb.type);
          } catch (e) {
            onError(e); reject(e); return;
          }
          await attachLpRealtime(header.lp_meta || null, header.duration_ms);
          onReady({ ms, msUrl, header:header, sessionId:sessionId });
          resolve({ sessionId:sessionId, header:header, mediaSource:ms });
          // 세그먼트 루프 시작
          _next();
        });

        // audio src 설정
        audioEl.src = msUrl;
        audioEl.load();
        
        // 오디오 출력 상태를 추적한다.
        ['playing','pause','waiting','stalled','canplay','error','ended'].forEach(function(eventName) {
          audioEl.addEventListener(eventName, function() {
            console.log('[TL3v4] audio event:', eventName, {
              currentTime:audioEl.currentTime, paused:audioEl.paused,
              readyState:audioEl.readyState, networkState:audioEl.networkState,
              audioContextState:lpController ? lpController.state() : 'bypass',
              mediaError:audioEl.error && {code:audioEl.error.code,message:audioEl.error.message}
            });
          });
        });
        // 첫 재생 트리거
        const playOnce = () => {
          audioEl.play().then(()=>console.log('[TL3v4] initial play accepted')).catch(err => console.warn('[TL3v4] play 차단:', err.name, err.message));
        };
        if (audioEl.readyState >= 3) playOnce();
        else audioEl.addEventListener('canplay', playOnce, { once: true });

        async function _next(prelicensedCode) {
          if (stopped || !sb || ms.readyState === 'closed') {
            console.warn('[TL3v4] segment loop not started:', {stopped, sourceBuffer:!!sb, mediaSourceState:ms.readyState});
            return;
          }
          console.log('[TL3v4] requesting segment', n, '/', header.mp3.N);
          
          // MP3 세그먼트가 끝났으면? 아직 LP Opus 처리 안 했다면 LP로 넘어감?
          // 지금은 MP3만 재생하는 로직으로 우선 테스트
          
          if (n > header.mp3.N) {
            // MP3 끝, endOfStream
            try { if (ms.readyState === 'open') ms.endOfStream(); } catch(e){}
            return;
          }

          try {
            // 3. 세그먼트 암호문은 이전 구간 재생 중 미리 받아 둔 값을 우선 사용한다.
            const payload = await takeSegmentPayload(n);
            if (payload.status === 416) {
              try { if (ms.readyState === 'open') ms.endOfStream(); } catch(e){}
              return;
            }
            const ciphertext = payload.ciphertext;
            const durationMs = payload.durationMs;

            // 4. 스파인 검증 (T_n)
            let Tprev;
            if (n === 1) {
              Tprev = unhex(header.mp3_tokens[0]);
            } else {
              Tprev = unhex(header.mp3_tokens[n-1]);
            }
            
            const h_n = await sha256(ciphertext);
            const Tnc = await sha256(Tprev, unhex(header.fid), enc(String(n)), h_n);
            if (header.mp3_tokens[n] && hex(Tnc) !== header.mp3_tokens[n]) {
              onError(new Error('스파인 검증 실패: T_' + n));
              return;
            }

            // 5. 라이센스 키 요청
            let codeData = prelicensedCode || null;
            if (!codeData) {
              const codeUrl = API + '/api/v1/tl3/code/' + fidStr + '?segment=' + (n-1) + '&session_id=' + encodeURIComponent(sessionId);
              let cr = null;
              for (let attempt = 0; attempt < 40; attempt++) {
                cr = await fetch(codeUrl, { headers: authHeaders() });
                if (cr.status !== 409 || attempt === 39) break;
                console.log('[TL3v4] waiting for previous segment settlement', {
                  nextSegment:n, attempt:attempt + 1
                });
                await new Promise(resolve => setTimeout(resolve, 75));
              }
              console.log('[TL3v4] code response', n, cr.status);
              if (!cr.ok) { onError(new Error('code ' + cr.status)); return; }
              codeData = await cr.json();
            } else {
              console.log('[TL3v4] next license reserved atomically with settlement', n);
            }
            const lic = unhex(codeData.lic_n || '');

            // 6. 복호화
            const k_n = await sha256(Tprev, lic, enc(String(n) + 'K'));
            const key = await crypto.subtle.importKey('raw', k_n, { name: 'AES-GCM' }, false, ['decrypt']);
            const plain = new Uint8Array(await crypto.subtle.decrypt(
              { name: 'AES-GCM', iv: ivFor(n), tagLength: 128 }, key, ciphertext
            ));
            console.log('[TL3v4] segment decrypted', n, 'bytes=', plain.length);

            // 7. 재생 구간의 시작 시각은 appendBuffer 전에 기록한다.
            // appendBuffer 완료 후 기록하면 첫 구간이 이미 재생된 뒤일 수 있어
            // currentTime이 멈춘 상태에서 다음 세그먼트 전환을 기다리게 된다.
            if (stopped || !sb) return;
            pendingMediaStart = audioEl.currentTime;
            pendingDurationMs = durationMs;
            segmentIndexPending = n - 1;

            // 버퍼 추가 및 재생
            await new Promise((res, rej) => {
              const cleanup = () => {
                sb.removeEventListener('updateend', onEnd);
                sb.removeEventListener('error', onError);
                sb.removeEventListener('abort', onAbort);
              };
              const onEnd = () => { cleanup(); res(); };
              const onError = () => { cleanup(); rej(new Error('SourceBuffer append error at segment ' + n)); };
              const onAbort = () => { cleanup(); rej(new Error('SourceBuffer append aborted at segment ' + n)); };
              sb.addEventListener('updateend', onEnd, { once: true });
              sb.addEventListener('error', onError, { once: true });
              sb.addEventListener('abort', onAbort, { once: true });
              try {
                if (sb.updating) throw new Error('SourceBuffer is already updating at segment ' + n);
                sb.appendBuffer(plain);
              } catch(e) {
                cleanup();
                rej(e);
              }
            });

            console.log('[TL3v4] append complete', n, {
              durationMs, currentTime:audioEl.currentTime, paused:audioEl.paused,
              readyState:audioEl.readyState, networkState:audioEl.networkState,
              buffered:Array.from({length:sb.buffered.length},(_,i)=>[sb.buffered.start(i),sb.buffered.end(i)]),
              audioContextState:lpController ? lpController.state() : 'bypass'
            });
            // MSE에 첫 구간이 추가된 뒤에도 오디오가 정지 상태라면 재생을 다시 요청한다.
            if (audioEl.paused) {
              if (lpController) lpController.resume().catch(e=>console.warn('[TL3-AUDIO] resume failed:',e));
              audioEl.play().then(()=>console.log('[TL3v4] playback started after append', {currentTime:audioEl.currentTime, audioContextState:lpController ? lpController.state() : 'bypass'}))
                .catch(e=>console.warn('[TL3v4] playback request after append failed:',e.name,e.message));
            }
            onSegment({ index: n - 1, seconds: durationMs / 1000, remaining: codeData.wallet_tl ?? codeData.remaining_tl, wallet_tl:codeData.wallet_tl ?? codeData.remaining_tl, asset_remaining_tl:codeData.asset_remaining_tl });
            // 실제 재생시간을 서버에 확정하고 미사용 예약분은 환급한다.
            segmentTimer = setInterval(async function() {
              const playedSeconds = Math.max(0, audioEl.currentTime - pendingMediaStart);
              // Prepare the next licensed segment while this segment is still
              // playing. The MSE stream can become unbuffered slightly before
              // its nominal 1-second boundary, so a late handoff always clicks.
              const segmentSeconds = durationMs / 1000;
              // 1초 세그먼트는 재생 0.15초 후 다음 구간 준비를 시작한다.
              // 즉, 세그먼트 종료 약 0.85초 전에 정산·다음 라이선스를 준비한다.
              const advanceLeadSeconds = 0.85;
              const advanceAt = Math.max(0.05, segmentSeconds - advanceLeadSeconds);
              if (playedSeconds < advanceAt) return;
              clearInterval(segmentTimer);
              segmentTimer = null;
              pendingMediaStart = -1;
              console.log('[TL3v4] segment playback threshold reached', {
                segment:n, playedSeconds, segmentSeconds, advanceAt,
                currentTime:audioEl.currentTime, paused:audioEl.paused
              });
              // 확정·환급과 다음 구간 TL 예약/라이선스 발급을 한 요청으로 묶는다.
              // 마지막 구간에는 다음 라이선스를 요청하지 않는다.
              const nextSegment = n < header.mp3.N ? n : undefined;
              const settled = await confirmPending(playedSeconds, nextSegment);
              if (stopped) return;
              if (!settled) {
                onError(new Error('TL3 segment settlement failed; playback stopped to protect TL balance.'));
                return;
              }
              n++;
              if (settled.next_error) {
                onError(new Error(settled.next_error));
                return;
              }
              await _next(settled.next_license || null);
            }, 50);
            
          } catch (e) {
            console.error('[TL3v4] _next error at segment', n, e);
            onError(e);
          }
        }
      } catch (e) { reject(e); }
    });
  }

  // ── Export ──
  global.TL3 = {
    playStream: playStream,
    loadHeader: async function(id) {
      const r = await fetch(API + '/api/v1/tl3/header/' + id, { headers: authHeaders() });
      return await r.json();
    },
    version: 'v4-spine'
  };

})(window);