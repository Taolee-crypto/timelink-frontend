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
    let lpAudioCtx = null, lpMediaSource = null, lpNodes = [], lpOscillator = null, lpNoiseSource = null;
    let segmentTimer = null, pendingMediaStart = -1, pendingDurationMs = 0, confirmBusy = false;
    let segmentIndexPending = -1;

    async function confirmPending(playedSeconds) {
      if (confirmBusy || segmentIndexPending < 0) return;
      confirmBusy = true;
      const index = segmentIndexPending;
      const played = Math.max(0, Math.min(pendingDurationMs / 1000, Number(playedSeconds) || 0));
      try {
        const response = await fetch(API + '/api/v1/tl3/segment/confirm/' + encodeURIComponent(fidStr), {
          method: 'POST',
          headers: Object.assign({'Content-Type':'application/json'}, authHeaders()),
          body: JSON.stringify({session_id:sessionId, played_seconds:played})
        });
        const data = await response.json().catch(function(){ return {}; });
        if (!response.ok || !data.ok) throw new Error(data.error || ('confirm ' + response.status));
        if (index === segmentIndexPending) segmentIndexPending = -1;
        if (data.wallet_tl !== undefined) onSegment({index:index, seconds:played, remaining:data.wallet_tl, wallet_tl:data.wallet_tl, asset_remaining_tl:data.asset_remaining_tl});
      } catch (error) {
        console.warn('[TL3v4] segment confirm failed; server expiry refund remains available:', error);
      } finally { confirmBusy = false; }
    }

    function attachLpRealtime(meta) {
      if (!meta || meta.enabled !== true) return;
      const params = meta.g;
      if (!params || typeof params !== 'object') {
        console.warn('[TL3-LP] LP parameters missing; playing original audio.');
        return;
      }
      try {
        const AudioContextCtor = global.AudioContext || global.webkitAudioContext;
        if (!AudioContextCtor) return;
        lpAudioCtx = new AudioContextCtor();
        lpMediaSource = lpAudioCtx.createMediaElementSource(audioEl);

        // Stable Web Audio graph: filters, saturation, wow/flutter and seeded vinyl noise.
        const highpass = lpAudioCtx.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.value = 30 + 20 * Number(params.Gd || 0.5);
        highpass.Q.value = 0.707;

        const lowpass = lpAudioCtx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = Math.max(9000, Math.min(18000,
          16000 - 7000 * Number(params.Gw || 0.5) - 4000 * Number(params.Gi || 0.5)));
        lowpass.Q.value = 0.707;

        const shaper = lpAudioCtx.createWaveShaper();
        const amount = 1 + 2.5 * Number(params.Gt || 0.2);
        const curve = new Float32Array(2048);
        const norm = Math.tanh(amount) || 1;
        for (let i = 0; i < curve.length; i++) {
          const x = (i * 2 / (curve.length - 1)) - 1;
          curve[i] = Math.tanh(amount * x) / norm;
        }
        shaper.curve = curve;
        shaper.oversample = '2x';

        const wowDelay = lpAudioCtx.createDelay(0.05);
        wowDelay.delayTime.value = 0.012;
        lpOscillator = lpAudioCtx.createOscillator();
        lpOscillator.type = 'sine';
        lpOscillator.frequency.value = 0.55;
        const wowDepth = lpAudioCtx.createGain();
        wowDepth.gain.value = 0.00025 + 0.001 * Number(params.Gp || 0.2);
        lpOscillator.connect(wowDepth);
        wowDepth.connect(wowDelay.delayTime);

        const outputGain = lpAudioCtx.createGain();
        outputGain.gain.value = 0.96;
        lpMediaSource.connect(highpass);
        highpass.connect(lowpass);
        lowpass.connect(shaper);
        shaper.connect(wowDelay);
        wowDelay.connect(outputGain);
        outputGain.connect(lpAudioCtx.destination);
        lpNodes = [highpass, lowpass, shaper, wowDelay, wowDepth, outputGain];

        // Deterministic, very low-level surface noise from the licensed seed.
        const seed = Number(meta.seed || 7) | 0;
        let randomState = seed || 7;
        const noiseBuffer = lpAudioCtx.createBuffer(1, lpAudioCtx.sampleRate * 2, lpAudioCtx.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseData.length; i++) {
          randomState = (Math.imul(randomState ^ (randomState >>> 15), 1 | randomState) + 0x6D2B79F5) | 0;
          noiseData[i] = ((randomState >>> 0) / 2147483648) - 1;
        }
        lpNoiseSource = lpAudioCtx.createBufferSource();
        lpNoiseSource.buffer = noiseBuffer;
        lpNoiseSource.loop = true;
        const noiseFilter = lpAudioCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 7500;
        const noiseGain = lpAudioCtx.createGain();
        noiseGain.gain.value = Math.pow(10, Number(params.nz ?? -48) / 20) * 0.16;
        lpNoiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(lpAudioCtx.destination);
        lpNodes.push(noiseFilter, noiseGain);

        lpOscillator.start();
        lpNoiseSource.start();
        lpAudioCtx.resume().catch(function(){});
        audioEl.addEventListener('playing', function() {
          if (lpAudioCtx && lpAudioCtx.state === 'suspended') lpAudioCtx.resume().catch(function(){});
        });
        console.log('[TL3-LP] realtime vinyl DSP attached', {
          version:meta.version, sampleRate:meta.fs, seed:seed,
          highpass:highpass.frequency.value, lowpass:lowpass.frequency.value
        });
      } catch (error) {
        console.warn('[TL3-LP] realtime DSP setup failed; falling back to direct audio:', error);
        // createMediaElementSource disconnects the element's native audio path.
        // Always reconnect it directly if DSP setup fails, otherwise Track is silent.
        try {
          if (lpMediaSource) {
            lpMediaSource.disconnect();
            lpMediaSource.connect(lpAudioCtx.destination);
          }
        } catch(_) {}
        for (const node of lpNodes) { try { node.disconnect(); } catch(_){} }
        lpNodes = [];
        if (lpOscillator) { try { lpOscillator.stop(); } catch(_){} lpOscillator = null; }
        if (lpNoiseSource) { try { lpNoiseSource.stop(); } catch(_){} lpNoiseSource = null; }
        lpMediaSource = null;
        if (lpAudioCtx) { try { lpAudioCtx.close(); } catch(_){} lpAudioCtx = null; }
      }
    }

    audioEl._tl3Confirm = function() {
      if (segmentTimer) { clearInterval(segmentTimer); segmentTimer = null; }
      const played = pendingMediaStart >= 0 ? Math.max(0, audioEl.currentTime - pendingMediaStart) : 0;
      pendingMediaStart = -1;
      return confirmPending(played);
    };
    audioEl._tl3Stop = function() {
      stopped = true;
      if (segmentTimer) { clearInterval(segmentTimer); segmentTimer = null; }
      const played = pendingMediaStart >= 0 ? Math.max(0, audioEl.currentTime - pendingMediaStart) : 0;
      pendingMediaStart = -1;
      confirmPending(played);
      try { if (lpMediaSource) lpMediaSource.disconnect(); } catch(_){}
      for (const node of lpNodes) { try { node.disconnect(); } catch(_){} }
      lpNodes = [];
      if (lpOscillator) { try { lpOscillator.stop(); } catch(_){} lpOscillator = null; }
      if (lpNoiseSource) { try { lpNoiseSource.stop(); } catch(_){} lpNoiseSource = null; }
      if (lpAudioCtx) { try { lpAudioCtx.close(); } catch(_){} lpAudioCtx = null; }
    };
    audioEl._tl3SegmentStop = audioEl._tl3Stop;

    return new Promise(async (resolve, reject) => {
      try {
        ms.addEventListener('sourceopen', async function() {
          try {
            sb = ms.addSourceBuffer('audio/mpeg');
          } catch (e) {
            onError(e); reject(e); return;
          }
          attachLpRealtime(header.lp_meta || null);
          onReady({ ms, msUrl, header:header, sessionId:sessionId });
          resolve({ sessionId:sessionId, header:header, mediaSource:ms });
          // 세그먼트 루프 시작
          _next();
        });

        // audio src 설정
        audioEl.src = msUrl;
        audioEl.load();
        
        // 첫 재생 트리거
        const playOnce = () => {
          audioEl.play().catch(err => console.warn('[TL3v4] play 차단:', err.name));
        };
        if (audioEl.readyState >= 3) playOnce();
        else audioEl.addEventListener('canplay', playOnce, { once: true });

        async function _next() {
          if (stopped || !sb || ms.readyState === 'closed') return;
          
          // MP3 세그먼트가 끝났으면? 아직 LP Opus 처리 안 했다면 LP로 넘어감?
          // 지금은 MP3만 재생하는 로직으로 우선 테스트
          
          if (n > header.mp3.N) {
            // MP3 끝, endOfStream
            try { if (ms.readyState === 'open') ms.endOfStream(); } catch(e){}
            return;
          }

          try {
            // 3. 세그먼트 요청
            const segUrl = API + '/api/v1/tl3/segment/' + fidStr + '?segment=' + (n-1) + '&session_id=' + encodeURIComponent(sessionId);
            const sr = await fetch(segUrl, { headers: authHeaders() });
            if (sr.status === 416) {
              try { if (ms.readyState === 'open') ms.endOfStream(); } catch(e){}
              return;
            }
            if (!sr.ok) { onError(new Error('segment ' + sr.status)); return; }
            
            const ciphertext = new Uint8Array(await sr.arrayBuffer());
            const durationMs = Number(sr.headers.get('X-TL3-Segment-Duration-Ms') || 1000);

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
            const cr = await fetch(API + '/api/v1/tl3/code/' + fidStr + '?segment=' + (n-1) + '&session_id=' + encodeURIComponent(sessionId), { headers: authHeaders() });
            if (!cr.ok) { onError(new Error('code ' + cr.status)); return; }
            const codeData = await cr.json();
            const lic = unhex(codeData.lic_n || '');

            // 6. 복호화
            const k_n = await sha256(Tprev, lic, enc('K' + n));
            const key = await crypto.subtle.importKey('raw', k_n, { name: 'AES-GCM' }, false, ['decrypt']);
            const plain = new Uint8Array(await crypto.subtle.decrypt(
              { name: 'AES-GCM', iv: ivFor(n), tagLength: 128 }, key, ciphertext
            ));

            // 7. 버퍼 추가 및 재생
            if (stopped || !sb) return;
            await new Promise((res) => {
              const h = () => { sb.removeEventListener('updateend', h); res(); };
              sb.addEventListener('updateend', h);
              try { sb.appendBuffer(plain); } catch(e) { sb.removeEventListener('updateend', h); res(); }
            });

            onSegment({ index: n - 1, seconds: durationMs / 1000, remaining: codeData.wallet_tl ?? codeData.remaining_tl, wallet_tl:codeData.wallet_tl ?? codeData.remaining_tl, asset_remaining_tl:codeData.asset_remaining_tl });
            pendingMediaStart = audioEl.currentTime;
            pendingDurationMs = durationMs;
            segmentIndexPending = n - 1;
            // 실제 재생시간을 서버에 확정하고 미사용 예약분은 환급한다.
            segmentTimer = setInterval(async function() {
              const playedSeconds = Math.max(0, audioEl.currentTime - pendingMediaStart);
              if (playedSeconds + 0.025 < durationMs / 1000) return;
              clearInterval(segmentTimer);
              segmentTimer = null;
              pendingMediaStart = -1;
              await confirmPending(Math.min(durationMs / 1000, playedSeconds));
              n++;
              if (!stopped) _next();
            }, 50);
            
          } catch (e) {
            console.error('[TL3v4] _next error:', e);
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
