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

  // MP3 files with a Xing/Info first frame may carry encoder delay metadata.
  // Browsers discard that non-audio frame and trim encoder delay from decoded
  // samples, while MSE sequence mode otherwise advances by every coded frame.
  // Offset the initial coded timeline so later TL3 chunks meet the audible
  // timeline instead of leaving a small decoder stall at the first boundary.
  function mp3InitialTimelineOffset(bytes) {
    try {
      let start = 0;
      if (bytes.length >= 10 && bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) {
        const size = ((bytes[6] & 0x7f) << 21) | ((bytes[7] & 0x7f) << 14) |
          ((bytes[8] & 0x7f) << 7) | (bytes[9] & 0x7f);
        start = 10 + size + ((bytes[5] & 0x10) ? 10 : 0);
      }
      for (let i = start; i + 4 <= bytes.length; i++) {
        if (bytes[i] !== 0xff || (bytes[i + 1] & 0xe0) !== 0xe0) continue;
        const version = (bytes[i + 1] >> 3) & 3;
        const layer = (bytes[i + 1] >> 1) & 3;
        const bitrateIndex = (bytes[i + 2] >> 4) & 15;
        const sampleIndex = (bytes[i + 2] >> 2) & 3;
        if (layer !== 1 || version === 1 || bitrateIndex === 0 || bitrateIndex === 15 || sampleIndex === 3) continue;
        const rates = [44100, 48000, 32000];
        const sampleRate = rates[sampleIndex] / (version === 3 ? 1 : version === 2 ? 2 : 4);
        const bitrate = (version === 3
          ? [0,32,40,48,56,64,80,96,112,128,160,192,224,256,320,0]
          : [0,8,16,24,32,40,48,56,64,80,96,112,128,144,160,0])[bitrateIndex];
        const frameLength = Math.floor((version === 3 ? 144000 : 72000) * bitrate / sampleRate) +
          ((bytes[i + 2] >> 1) & 1);
        const frameEnd = Math.min(bytes.length, i + frameLength);
        let marker = -1;
        for (let p = i + 4; p + 4 <= frameEnd; p++) {
          if ((bytes[p] === 0x58 && bytes[p+1] === 0x69 && bytes[p+2] === 0x6e && bytes[p+3] === 0x67) ||
              (bytes[p] === 0x49 && bytes[p+1] === 0x6e && bytes[p+2] === 0x66 && bytes[p+3] === 0x6f)) {
            marker = p; break;
          }
        }
        if (marker < 0 || marker + 8 > frameEnd) return 0;
        const flags = ((bytes[marker+4] << 24) | (bytes[marker+5] << 16) |
          (bytes[marker+6] << 8) | bytes[marker+7]) >>> 0;
        let tag = marker + 8;
        if (flags & 1) tag += 4;
        if (flags & 2) tag += 4;
        if (flags & 4) tag += 100;
        if (flags & 8) tag += 4;
        let delaySamples = 0;
        // LAME-compatible encoder tags (including Lavc) store 12-bit delay
        // in the first 12 bits of bytes 21..22 after the encoder identifier.
        if (tag + 24 <= frameEnd) {
          delaySamples = (bytes[tag+21] << 4) | (bytes[tag+22] >> 4);
        }
        const samplesPerFrame = version === 3 ? 1152 : 576;
        const offset = (samplesPerFrame + delaySamples) / sampleRate;
        return Number.isFinite(offset) && offset > 0 && offset < 0.1 ? offset : 0;
      }
    } catch (_) {}
    return 0;
  }

  // ── V4 Player ──
  async function playStream(fileId, audioEl, opts) {
    opts = opts || {};
    const onSegment = opts.onSegment || function(){};
    const onError = opts.onError || function(){};
    const onReady = opts.onReady || function(){};
    const sessionId = String(opts.sessionId || genSid());
    console.log('[TL3v4] START fileId=', fileId, 'sessionId=', sessionId);
    const lpToggleAtStart = document.getElementById('lpEnhancedToggle');
    if (lpToggleAtStart) { lpToggleAtStart.checked = false; lpToggleAtStart.disabled = true; }
    global.setTL3LpEnhanced = function(){ return false; };

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
    const prefetchedLicenses = new Map();

    // Reserve the next segment while the current segment remains pending.
    // The server keeps both reservations independently and promotes the next
    // reservation only after the current segment has been settled.
    function scheduleLicensePrefetch(segmentNo) {
      if (segmentNo < 1 || segmentNo > Number(header.mp3.N || 0) || prefetchedLicenses.has(segmentNo)) return;
      const url = API + '/api/v1/tl3/code/' + fidStr + '?segment=' + (segmentNo - 1) + '&session_id=' + encodeURIComponent(sessionId);
      const promise = fetch(url, {headers:authHeaders()}).then(async function(response) {
        const data = await response.json().catch(function(){ return {}; });
        if (!response.ok || !data.ok) throw new Error(data.error || ('prefetch license ' + response.status));
        console.log('[TL3v5] next segment TL reserved before handoff', {
          segment:segmentNo, cost:data.cost, wallet_tl:data.wallet_tl,
          prefetched:!!data.prefetched, duplicate:!!data.duplicate
        });
        return data;
      }).catch(function(error) {
        console.warn('[TL3v5] next-segment reservation will fall back to settlement handoff', segmentNo, error);
        return null;
      });
      prefetchedLicenses.set(segmentNo, promise);
    }

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
        console.log('[TL3v4] confirm response:', {
          ok: data.ok, next_license: !!data.next_license,
          next_error: data.next_error, segment: data.segment,
          wallet_tl: data.wallet_tl, asset_remaining_tl: data.asset_remaining_tl
        });
        if (index === segmentIndexPending) segmentIndexPending = -1;
        if (Number.isInteger(nextSegment)) prefetchedLicenses.delete(nextSegment + 1);
        if (data.wallet_tl !== undefined) onSegment({index:index, seconds:played, remaining:data.wallet_tl, wallet_tl:data.wallet_tl, asset_remaining_tl:data.asset_remaining_tl});
        return data;
      } catch (error) {
        console.warn('[TL3v4] segment confirm failed; server expiry refund remains available:', error);
        return null;
      } finally { confirmBusy = false; }
    }

    async function attachLpRealtime(meta, durationMs) {
      const toggle = document.getElementById('lpEnhancedToggle');
      const licensed = !!(meta && meta.enabled === true);
      if (toggle) { toggle.checked = false; toggle.disabled = !licensed; }
      // LP-CHAIN_PRIORITY: 플레이어 LP 체인 우선. 실패 시 아래 TL3Audio.attach로 폴백.
      if (licensed && global.TL3LPChain) {
        try {
          lpController = await global.TL3LPChain.create(audioEl, meta, durationMs);
          if (lpController && lpController.available()) {
            if (toggle) toggle.disabled = false;
            audioEl._tl3LpToggle = async function(enabled) {
              const ok = await lpController.setEnabled(!!enabled);
              if (!ok && toggle) toggle.checked = false;
              return ok;
            };
            global.setTL3LpEnhanced = function(enabled) {
              return audioEl._tl3LpToggle ? audioEl._tl3LpToggle(enabled) : false;
            };
            console.info('[LP-CHAIN] external chain attached; remote scheduler untouched', {
              mode: lpController.mode(), seed: meta.seed || 7
            });
            return;
          }
          console.warn('[LP-CHAIN] chain unavailable; falling back to legacy TL3Audio.attach');
        } catch (e) {
          console.warn('[LP-CHAIN] chain create failed; falling back:', e);
        }
      }
      audioEl._tl3LpToggle = async function(enabled) {
        if (!licensed || !lpController || typeof lpController.setEnabled !== 'function') {
          if (toggle) toggle.checked = false;
          return false;
        }
        const ok = await lpController.setEnabled(!!enabled);
        if (!ok && toggle) toggle.checked = false;
        return ok;
      };
      global.setTL3LpEnhanced = function(enabled) {
        return audioEl._tl3LpToggle ? audioEl._tl3LpToggle(enabled) : false;
      };
      if (!licensed) {
        if (lpController && typeof lpController.destroy === 'function') {
          try { await lpController.destroy(); } catch (_) {}
        }
        lpController = null;
        audioEl._tl3LpToggle = null;
        console.info('[TL3-AUDIO] no LP license; native playback only.');
        return;
      }
      try {
        if (global.TL3Audio && typeof global.TL3Audio.attach === 'function') {
          const base = global.TL3Audio.defaultProfile || { enabled:true, g:{} };
          const profile = Object.assign({}, base, meta);
          profile.g = Object.assign({}, base.g || {}, meta.g || {});
          profile.enabled = true;
          profile.seed = Number(meta.seed || 7);
          profile.duration_ms = Number(durationMs || profile.duration_ms || 0);
          lpController = await global.TL3Audio.attach(audioEl, profile);
          // Native passthrough is the intentional default. The toggle must
          // remain available whenever the licensed Worklet is ready.
          if (toggle) toggle.disabled = !lpController || !lpController.licensed ||
            lpController.available !== true;
          if (lpController && lpController.licensed) {
            console.log('[TL3-AUDIO] licensed connector ready; user toggle controls DSP.', {
              mode:lpController.mode,profile:profile.version||'licensed-lp',seed:profile.seed
            });
            return;
          }
        }
      } catch (error) {
        console.warn('[TL3-AUDIO] LP connector unavailable; native playback retained.', error);
      }
      if (toggle) { toggle.checked = false; toggle.disabled = true; }
      audioEl._tl3LpToggle = null;
      global.setTL3LpEnhanced = function(){return false;};
      lpController = null;
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
    // Pause/resume suspends only the LP graph; it does not terminate the TL3
    // session or its segment settlement state.
    audioEl._tl3Suspend = function() {
      if (lpController && typeof lpController.stop === 'function') return lpController.stop();
      return Promise.resolve();
    };
    audioEl._tl3Resume = function() {
      if (lpController && typeof lpController.resume === 'function') return lpController.resume();
      return Promise.resolve();
    };
    audioEl._tl3SegmentStop = audioEl._tl3Stop;

    return new Promise(async (resolve, reject) => {
      try {
        ms.addEventListener('sourceopen', async function() {
          console.log('[TL3v4] MediaSource sourceopen');
          try {
            sb = ms.addSourceBuffer('audio/mpeg');
            // MP3 is delivered as independently decrypted frame-aligned chunks.
            // Sequence mode makes MSE place each appended chunk directly after
            // the preceding chunk, avoiding timestamp gaps at chunk boundaries.
            try {
              sb.mode = 'sequence';
              console.log('[TL3v4] SourceBuffer ready:', sb.type, 'mode=', sb.mode);
            } catch (modeError) {
              console.warn('[TL3v4] sequence mode unavailable; using browser default:', modeError);
              console.log('[TL3v4] SourceBuffer ready:', sb.type, 'mode=', sb.mode);
            }
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

            // The first Xing/Info frame is metadata, not audible programme audio.
            // Account for it and the encoder delay once, before the first append.
            if (n === 1) {
              const initialOffset = mp3InitialTimelineOffset(plain);
              if (initialOffset > 0 && !sb.updating) {
                try {
                  // sb.timestampOffset = -initialOffset;  // 2026-10-18: sequence 모드에서 브라우저가 이미 처리
                  console.log('[TL3v4] MP3 encoder delay aligned:', {
                    offsetSeconds: initialOffset,
                    timestampOffset: sb.timestampOffset
                  });
                } catch (offsetError) {
                  console.warn('[TL3v4] MP3 initial timestamp alignment unavailable:', offsetError);
                }
              }
            }

            // 7. MSE sequence mode appends this segment after the end of the
            // existing buffered timeline. The append request time is NOT the
            // segment's playback start: using currentTime here settles a segment
            // while the previous segment is still playing and undercharges it.
            if (stopped || !sb) return;
            const bufferedEnd = sb.buffered.length
              ? sb.buffered.end(sb.buffered.length - 1)
              : Math.max(0, audioEl.currentTime || 0);
            pendingMediaStart = Math.max(0, bufferedEnd);
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

            // Settle against the timeline that MSE actually made playable.
            // The first Xing/Info frame and encoder-delay timestampOffset can
            // make the audible range shorter than the encoded-frame duration.
            // Waiting for the nominal duration then stalls forever at the
            // first buffer boundary (typically after about one second).
            const appendedEnd = sb.buffered.length
              ? sb.buffered.end(sb.buffered.length - 1)
              : pendingMediaStart;
            const actualPlayableMs = Math.max(0, Math.min(durationMs, (appendedEnd - pendingMediaStart) * 1000));
            if (actualPlayableMs > 0) pendingDurationMs = actualPlayableMs;

            const sbRanges = Array.from({length:sb.buffered.length},(_,i)=>[sb.buffered.start(i),sb.buffered.end(i)]);
            const audioRanges = Array.from({length:audioEl.buffered.length},(_,i)=>[audioEl.buffered.start(i),audioEl.buffered.end(i)]);
            const mp3Header = Array.from(plain.slice(0,16),b=>b.toString(16).padStart(2,'0')).join('');
            console.log('[TL3v4] append complete', n, {
              durationMs, currentTime:audioEl.currentTime, paused:audioEl.paused,
              readyState:audioEl.readyState, networkState:audioEl.networkState,
              sourceBufferRanges:sbRanges, audioElementRanges:audioRanges,
              appendedBytes:plain.length, mp3PrefixHex:mp3Header,
              mediaSourceState:ms.readyState,
              audioError:audioEl.error ? {code:audioEl.error.code,message:audioEl.error.message} : null,
              audioContextState:lpController ? lpController.state() : 'bypass'
            });
            console.log('[TL3v4][APPEND_RANGE]', JSON.stringify({
              segment:n, sourceBuffer:sbRanges, audio:audioRanges,
              currentTime:audioEl.currentTime, readyState:audioEl.readyState,
              bytes:plain.length, mp3PrefixHex:mp3Header
            }));
            // MSE에 첫 구간이 추가된 뒤에도 오디오가 정지 상태라면 재생을 다시 요청한다.
            if (audioEl.paused) {
              if (lpController) lpController.resume().catch(e=>console.warn('[TL3-AUDIO] resume failed:',e));
              audioEl.play().then(()=>console.log('[TL3v4] playback started after append', {currentTime:audioEl.currentTime, audioContextState:lpController ? lpController.state() : 'bypass'}))
                .catch(e=>console.warn('[TL3v4] playback request after append failed:',e.name,e.message));
            }
            onSegment({ index: n - 1, seconds: durationMs / 1000, remaining: codeData.wallet_tl ?? codeData.remaining_tl, wallet_tl:codeData.wallet_tl ?? codeData.remaining_tl, asset_remaining_tl:codeData.asset_remaining_tl });
            // Start the next TL reservation while this segment is audible.
            // Settlement of the current segment remains pending until its real end.
            if (n < Number(header.mp3.N || 0)) scheduleLicensePrefetch(n + 1);
            // 실제 재생시간을 서버에 확정하고 미사용 예약분은 환급한다.
            segmentTimer = setInterval(async function() {
              const playedSeconds = Math.max(0, audioEl.currentTime - pendingMediaStart);
              // Prepare the next licensed segment while this segment is still
              // playing. The MSE stream can become unbuffered slightly before
              // its nominal 1-second boundary, so a late handoff always clicks.
              const segmentSeconds = pendingDurationMs / 1000;
              // Settle only after the playhead has traversed this segment's
              // actual MSE timeline range. Early confirmation refunds the
              // unheard tail while the already-appended audio continues playing.
              const advanceAt = Math.max(0.15, segmentSeconds * 0.20);  // 2026-10-18: 20%에서 다음 세그먼트 준비 (confirm 지연 대응)
              if (playedSeconds + 0.001 < advanceAt) return;
              clearInterval(segmentTimer);
              segmentTimer = null;
              pendingMediaStart = -1;
              console.log('[TL3v4] segment playback threshold reached', {
                segment:n, playedSeconds, segmentSeconds, encodedDurationMs:durationMs,
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