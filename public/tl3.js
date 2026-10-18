/*! tl3.js — TimeLink TL3 v6 Player (2026-10-19 완전 새로 작성)
 * 병렬 파이프라인: 세그먼트 미리 여러 개 fetch + decrypt, append는 연속
 * confirm(정산)은 백그라운드 queue, 재생 블로킹 안 함
 */
(function (global) {
  'use strict';
  const API = (window.TL3_API_BASE) || 'https://api.timelink.digital';

  function hex(b){ return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join(''); }
  function unhex(h){ const a=new Uint8Array(h.length/2); for(let i=0;i<a.length;i++) a[i]=parseInt(h.substr(i*2,2),16); return a; }
  function enc(s){ return new TextEncoder().encode(s); }
  function ivFor(n){ const iv=new Uint8Array(12); new DataView(iv.buffer).setBigUint64(4,BigInt(n),false); return iv; }
  function genSid(){ return 'tl3_'+Date.now()+'_'+Math.random().toString(36).slice(2,10); }
  function getTok(){ return localStorage.getItem('tl_token')||''; }
  function authHeaders(){ return {'Authorization':'Bearer '+getTok()}; }
  async function sha256(...parts){
    let t=0; for(const p of parts) t+=p.length;
    const b=new Uint8Array(t); let o=0;
    for(const p of parts){ b.set(p,o); o+=p.length; }
    return new Uint8Array(await crypto.subtle.digest('SHA-256', b));
  }

  async function playStream(fileId, audioEl, opts) {
    opts = opts || {};
    const onSegment = opts.onSegment || function(){};
    const onError = opts.onError || function(){};
    const onReady = opts.onReady || function(){};
    const sessionId = String(opts.sessionId || genSid());
    const fidStr = String(fileId).split('/').pop().split('?')[0];
    console.log('[TL3v6] START fileId=', fidStr, 'sessionId=', sessionId);

    const lpToggle = document.getElementById('lpEnhancedToggle');
    if (lpToggle) { lpToggle.checked = false; lpToggle.disabled = true; }
    global.setTL3LpEnhanced = function(){ return false; };

    let header;
    try {
      const r = await fetch(API + '/api/v1/tl3/header/' + fidStr, { headers: authHeaders() });
      if (!r.ok) throw new Error('header 로드 실패 (' + r.status + ')');
      header = await r.json();
    } catch (e) { onError(e); throw e; }
    console.log('[TL3v6] header loaded', { N: header.mp3.N, lp_opus: header.lp_opus });

    let lpController = null;
    const lpMeta = header.lp_meta || null;
    const lpLicensed = !!(lpMeta && lpMeta.enabled === true);
    if (lpLicensed && global.TL3LPChain) {
      try {
        lpController = await global.TL3LPChain.create(audioEl, lpMeta, header.duration_ms);
        if (lpController && lpController.available() && lpToggle) lpToggle.disabled = false;
      } catch (e) { console.warn('[TL3v6] LP chain create failed:', e); }
    }
    global.setTL3LpEnhanced = async function(enabled) {
      if (!lpController || typeof lpController.setEnabled !== 'function') return false;
      const ok = await lpController.setEnabled(!!enabled);
      if (lpToggle && !ok) lpToggle.checked = false;
      return ok;
    };

    const ms = new MediaSource();
    const msUrl = URL.createObjectURL(ms);
    let sb = null;
    let stopped = false;
    const N = Number(header.mp3.N || 0);
    if (N <= 0) throw new Error('세그먼트 정보가 없습니다.');

    const payloadCache = new Map();
    const licenseCache = new Map();
    const plainCache = new Map();
    const appendQueue = [];
    let appendBusy = false;
    let nextAppend = 1;
    const settlementQueue = [];
    let settleBusy = false;
    let nextSettle = 1;
    const segmentDurations = new Map();
    const settledSet = new Set();

    async function fetchPayload(n) {
      if (payloadCache.has(n)) return payloadCache.get(n);
      const p = (async () => {
        const url = API + '/api/v1/tl3/segment/' + fidStr + '?segment=' + (n-1) + '&session_id=' + encodeURIComponent(sessionId);
        const res = await fetch(url, { headers: authHeaders() });
        if (res.status === 416) return { status:416 };
        if (!res.ok) throw new Error('segment ' + res.status);
        const bytes = new Uint8Array(await res.arrayBuffer());
        const dur = Number(res.headers.get('X-TL3-Segment-Duration-Ms') || 1000);
        segmentDurations.set(n, dur);
        console.log('[TL3v6] payload ready', n, { bytes: bytes.byteLength, durMs: dur });
        return { status: res.status, ciphertext: bytes, durationMs: dur };
      })();
      payloadCache.set(n, p);
      return p;
    }

    async function fetchLicense(n) {
      if (licenseCache.has(n)) return licenseCache.get(n);
      const p = (async () => {
        const url = API + '/api/v1/tl3/code/' + fidStr + '?segment=' + (n-1) + '&session_id=' + encodeURIComponent(sessionId);
        for (let attempt = 0; attempt < 200; attempt++) {
          if (stopped) throw new Error('stopped');
          const res = await fetch(url, { headers: authHeaders() });
          if (res.status === 409) {
            if (attempt % 20 === 0) console.log('[TL3v6] license 409 wait', n, 'attempt', attempt + 1);
            await new Promise(r => setTimeout(r, 100));
            continue;
          }
          const data = await res.json().catch(() => ({}));
          if (!res.ok || !data.ok) throw new Error(data.error || ('license ' + res.status));
          console.log('[TL3v6] license ready', n, { cost: data.cost, wallet_tl: data.wallet_tl });
          return data;
        }
        throw new Error('license 409 timeout after 200 attempts (20s)');
      })();
      licenseCache.set(n, p);
      return p;
    }

    async function decryptSegment(n) {
      if (plainCache.has(n)) return plainCache.get(n);
      const p = (async () => {
        const payload = await fetchPayload(n);
        if (payload.status === 416) return null;
        const license = await fetchLicense(n);
        const Tprev = (n === 1) ? unhex(header.mp3_tokens[0]) : unhex(header.mp3_tokens[n-1]);
        const lic = unhex(license.lic_n || '');
        const h_n = await sha256(payload.ciphertext);
        const Tnc = await sha256(Tprev, unhex(header.fid), enc(String(n)), h_n);
        if (header.mp3_tokens[n] && hex(Tnc) !== header.mp3_tokens[n]) {
          throw new Error('스파인 검증 실패 T_' + n);
        }
        const k_n = await sha256(Tprev, lic, enc(String(n) + 'K'));
        const key = await crypto.subtle.importKey('raw', k_n, { name: 'AES-GCM' }, false, ['decrypt']);
        const plain = new Uint8Array(await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv: ivFor(n), tagLength: 128 }, key, payload.ciphertext
        ));
        console.log('[TL3v6] decrypted', n, { bytes: plain.length });
        plainCache.set(n, plain);
        return plain;
      })();
      plainCache.set(n, p);
      return p;
    }

    function schedulePrefetch(from, count) {
      for (let i = 0; i < count; i++) {
        const n = from + i;
        if (n < 1 || n > N) continue;
        if (!payloadCache.has(n)) fetchPayload(n).catch(() => {});
        if (!licenseCache.has(n)) fetchLicense(n).catch(() => {});
        if (!plainCache.has(n) && payloadCache.has(n) && licenseCache.has(n)) {
          decryptSegment(n).catch(() => {});
        }
      }
    }

    function enqueueAppend(n) {
      if (n < 1 || n > N) return;
      if (appendQueue.includes(n)) return;
      if (n < nextAppend) return;
      appendQueue.push(n);
      appendQueue.sort((a,b)=>a-b);
      processAppendQueue();
    }

    async function processAppendQueue() {
      if (appendBusy) return;
      appendBusy = true;
      try {
        while (appendQueue.length > 0 && !stopped) {
          const n = appendQueue[0];
          if (nextAppend !== n) { appendQueue.shift(); continue; }
          let plain;
          try { plain = await decryptSegment(n); }
          catch (e) { console.error('[TL3v6] decrypt failed', n, e); onError(e); return; }
          if (!plain) break;
          await new Promise((resolve, reject) => {
            const cleanup = () => {
              sb.removeEventListener('updateend', onEnd);
              sb.removeEventListener('error', onErr);
            };
            const onEnd = () => { cleanup(); resolve(); };
            const onErr = () => { cleanup(); reject(new Error('append error @' + n)); };
            sb.addEventListener('updateend', onEnd, { once: true });
            sb.addEventListener('error', onErr, { once: true });
            try { sb.appendBuffer(plain); } catch (e) { cleanup(); reject(e); }
          });
          const bufEnd = sb.buffered.length ? sb.buffered.end(sb.buffered.length - 1) : 0;
          console.log('[TL3v6] appended', n, { bufEnd, currentTime: audioEl.currentTime });
          appendQueue.shift();
          nextAppend++;
          schedulePrefetch(nextAppend, 5);
          if (audioEl.paused) {
            if (lpController) lpController.resume().catch(() => {});
            audioEl.play().catch(() => {});
          }
          settlementQueue.push(n);
          processSettlementQueue();
        }
      } finally { appendBusy = false; }
    }

    async function processSettlementQueue() {
      if (settleBusy) return;
      settleBusy = true;
      try {
        while (settlementQueue.length > 0 && !stopped) {
          const n = settlementQueue[0];
          if (nextSettle !== n) { settlementQueue.shift(); continue; }
          if (settledSet.has(n)) { settlementQueue.shift(); nextSettle++; continue; }
          try {
            const durMs = segmentDurations.get(n) || 1000;
            const body = {
              session_id: sessionId,
              played_seconds: durMs / 1000,
              next_segment: (n < N) ? n : undefined
            };
            const res = await fetch(API + '/api/v1/tl3/segment/confirm/' + encodeURIComponent(fidStr), {
              method: 'POST',
              headers: Object.assign({'Content-Type':'application/json'}, authHeaders()),
              body: JSON.stringify(body)
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok) {
              console.warn('[TL3v6] settle failed', n, data.error || res.status);
            } else {
              console.log('[TL3v6] settled', n, { wallet_tl: data.wallet_tl, asset_remaining_tl: data.asset_remaining_tl });
              settledSet.add(n);
              onSegment({ index: n - 1, seconds: durMs / 1000, remaining: data.wallet_tl, wallet_tl: data.wallet_tl, asset_remaining_tl: data.asset_remaining_tl });
            }
          } catch (e) { console.warn('[TL3v6] settle error', n, e); }
          settlementQueue.shift();
          nextSettle++;
        }
      } finally { settleBusy = false; }
    }

    return new Promise((resolve, reject) => {
      ms.addEventListener('sourceopen', async function() {
        try {
          sb = ms.addSourceBuffer('audio/mpeg');
          try { sb.mode = 'sequence'; } catch (_) {}
        } catch (e) { onError(e); reject(e); return; }
        console.log('[TL3v6] SourceBuffer ready mode=', sb.mode);
        onReady({ ms, msUrl, header, sessionId });
        resolve({ sessionId, header, mediaSource: ms });
        schedulePrefetch(1, 5);
        enqueueAppend(1);
      });

      audioEl.src = msUrl;
      audioEl.load();

      ['playing','waiting','stalled','ended'].forEach(name => {
        audioEl.addEventListener(name, () => {
          console.log('[TL3v6] audio event:', name, { t: audioEl.currentTime, paused: audioEl.paused, bufEnd: sb && sb.buffered.length ? sb.buffered.end(sb.buffered.length-1) : 0 });
        });
      });

      const playOnce = () => {
        audioEl.play().then(() => console.log('[TL3v6] initial play accepted'))
          .catch(err => console.warn('[TL3v6] play 차단:', err.name));
      };
      if (audioEl.readyState >= 3) playOnce();
      else audioEl.addEventListener('canplay', playOnce, { once: true });
    }).then(function(result) {
      audioEl._tl3Stop = function() {
        if (stopped) return;
        stopped = true;
        try { audioEl.pause(); } catch (_) {}
        if (lpController && typeof lpController.stop === 'function') lpController.stop().catch(() => {});
      };
      audioEl._tl3Confirm = audioEl._tl3Stop;
      audioEl._tl3Suspend = function() {
        if (lpController && typeof lpController.suspend === 'function') return lpController.suspend();
        return Promise.resolve();
      };
      audioEl._tl3Resume = function() {
        if (lpController && typeof lpController.resume === 'function') return lpController.resume();
        return Promise.resolve();
      };
      audioEl._tl3SegmentStop = audioEl._tl3Stop;
      return result;
    });
  }

  global.TL3 = {
    playStream,
    loadHeader: async function(id) {
      const r = await fetch(API + '/api/v1/tl3/header/' + id, { headers: authHeaders() });
      return await r.json();
    },
    version: 'v6-parallel-pipeline-2026-10-19'
  };
})(window);