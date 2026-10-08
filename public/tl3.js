/*!
 * TimeLink TL3 v3 client library
 * ----------------------------------------------------------------------------
 * TL3 v3 = mp3 + LP (PCM16) + 시간 + 저작권 + AES-256-GCM + 타임토큰 체인
 *
 * 서버 계약:
 *   POST /api/v1/tl3/create           { share_id, mp3_pcm_b64, lp_pcm_b64, ... }
 *   GET  /api/v1/tl3/segment/:id      ?n=1&kind=mp3&session_id=...
 *        → 206, octet-stream, X-TL3-Token, X-TL3-Next
 *   POST /api/v1/tl3/confirm/:id      { session_id, played_seconds, segment_n, kind }
 *
 * 클라이언트 역할:
 *   1. mp3 → PCM (Int16) 추출 (decodeAudioData)
 *   2. LP 변환 (WAV PCM) → PCM
 *   3. 서버로 전송 (base64)
 *   4. 재생: 서버 세그먼트를 순차로 받아 mp3 평문으로 Blob 재생
 */
(function (global) {
  'use strict';

  var DEBUG = false;
  function log() {
    if (!DEBUG) return;
    try { console.log.apply(console, ['[TL3]'].concat([].slice.call(arguments))); } catch (e) {}
  }

  // ───────────────────────────────────────
  // 유틸: PCM ↔ base64
  // ───────────────────────────────────────
  function int16ToBase64(pcm) {
    var u8 = new Uint8Array(pcm.buffer, pcm.byteOffset, pcm.byteLength);
    var s = '';
    var chunk = 0x8000;
    for (var i = 0; i < u8.length; i += chunk) {
      s += String.fromCharCode.apply(null, u8.subarray(i, i + chunk));
    }
    return btoa(s);
  }

  // ───────────────────────────────────────
  // 오디오 디코딩 → PCM
  // ───────────────────────────────────────
  async function decodeToPcm(blob) {
    var ctx = new (global.AudioContext || global.webkitAudioContext)();
    try {
      var buf = await blob.arrayBuffer();
      var ab = await ctx.decodeAudioData(buf);
      var ch = Math.min(2, ab.numberOfChannels);
      var len = ab.length;
      var out = new Int16Array(len * 2);
      var L = ab.getChannelData(0);
      var R = ch > 1 ? ab.getChannelData(1) : L;
      for (var i = 0; i < len; i++) {
        out[i * 2] = Math.max(-32768, Math.min(32767, Math.round(L[i] * 32767)));
        out[i * 2 + 1] = Math.max(-32768, Math.min(32767, Math.round(R[i] * 32767)));
      }
      return { pcm: out, fs: ab.sampleRate, ch: 2 };
    } finally {
      try { ctx.close(); } catch (e) {}
    }
  }

  // ───────────────────────────────────────
  // TL3.create — 서버에 mp3 PCM + LP PCM 전송 → TL3 파일 생성
  // opts: { API, token, shareId, title, artist, cid, name, genre, bpm, creator_id, lpPcm? }
  // ───────────────────────────────────────
  async function create(mp3Blob, lpBlob, opts) {
    opts = opts || {};
    if (!opts.API) throw new Error('API base 필요');
    if (!opts.token) throw new Error('로그인 토큰 필요');

    log('decoding mp3 → PCM');
    var mp3 = await decodeToPcm(mp3Blob);

    log('decoding LP → PCM');
    var lp = lpBlob ? await decodeToPcm(lpBlob) : mp3;

    // mp3와 LP PCM 길이 맞추기 (짧은 쪽에 맞춤)
    var len = Math.min(mp3.pcm.length, lp.pcm.length);
    var mp3Pcm = mp3.pcm.subarray(0, len);
    var lpPcm = lp.pcm.subarray(0, len);

    var body = {
      title: opts.title || 'Untitled',
      artist: opts.artist || 'Unknown',
      cid: opts.cid || '',
      name: opts.name || 'User',
      genre: opts.genre || '',
      bpm: opts.bpm || 0,
      creator_id: opts.creator_id || 0,
      fs: mp3.fs,
      ch: mp3.ch,
      mp3_pcm_b64: int16ToBase64(mp3Pcm),
      lp_pcm_b64: int16ToBase64(lpPcm)
    };

    log('sending to /api/v1/tl3/create, size=', mp3.pcm.length * 2, 'bytes each');
    var res = await fetch(opts.API + '/api/v1/tl3/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + opts.token
      },
      body: JSON.stringify(body)
    });
    var data = await res.json().catch(function () { return {}; });
    if (!res.ok || !data.ok) throw new Error(data.error || ('create HTTP ' + res.status));
    return data;
  }

  // ───────────────────────────────────────
  // TL3.play — 서버 세그먼트 순차 수신 → 재생 → confirm
  // opts: { API, token, shareId, sessionId?, kind?, onSegment?, onError?, autoplay? }
  // ───────────────────────────────────────
  async function play(audioEl, opts) {
    opts = opts || {};
    if (!opts.API) throw new Error('API base 필요');
    if (!opts.token) throw new Error('로그인 토큰 필요');
    if (!opts.shareId) throw new Error('shareId 필요');

    var sessionId = opts.sessionId || ('sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10));
    var kind = opts.kind || 'mp3';

    var chunks = [];
    var n = 1;
    var stopped = false;
    var stopFn = function () { stopped = true; };

    // 재생 시작 (부분 로드부터)
    var firstUrl = null;
    var player = audioEl;

    function tryPlayFirst() {
      if (player && player.play) {
        var p = player.play();
        if (p && p.catch) p.catch(function () {});
      }
    }

    // 순차 다운로드 → Blob → 첫 세그먼트 도착 시 재생 시작
    async function loop() {
      while (!stopped) {
        var url = opts.API + '/api/v1/tl3/segment/' + encodeURIComponent(opts.shareId) +
          '?n=' + n + '&kind=' + kind + '&session_id=' + encodeURIComponent(sessionId);

        var res = await fetch(url, {
          headers: { 'Authorization': 'Bearer ' + opts.token }
        });

        if (res.status === 416) {
          log('EOF at n=', n);
          break;
        }
        if (res.status === 402) {
          var e402 = await res.json().catch(function () { return {}; });
          var err = new Error(e402.error || 'TL 없음');
          err.code = 402;
          if (opts.onError) opts.onError(err);
          break;
        }
        if (res.status === 409) {
          log('토큰 불일치/변조 감지 n=', n);
          var e409 = await res.json().catch(function () { return {}; });
          var err2 = new Error(e409.error || '변조 감지');
          err2.code = 409;
          if (opts.onError) opts.onError(err2);
          break;
        }
        if (!res.ok) {
          log('segment HTTP', res.status, 'n=', n);
          break;
        }

        var buf = await res.arrayBuffer();
        chunks.push(new Uint8Array(buf));

        // 첫 세그먼트 도착 → 재생 시작
        if (n === 1 && player) {
          var blob = new Blob(chunks, { type: 'audio/mpeg' });
          var url1 = URL.createObjectURL(blob);
          firstUrl = url1;
          if (player._tl3ObjectUrl) {
            try { URL.revokeObjectURL(player._tl3ObjectUrl); } catch (e) {}
          }
          player._tl3ObjectUrl = url1;
          player.src = url1;
          if (opts.autoplay !== false) tryPlayFirst();
        }

        if (opts.onSegment) {
          try {
            opts.onSegment({
              n: n,
              token: res.headers.get('X-TL3-Token'),
              next: Number(res.headers.get('X-TL3-Next') || (n + 1)),
              kind: kind
            });
          } catch (e) {}
        }

        // confirm (초 단위)
        try {
          await fetch(opts.API + '/api/v1/tl3/confirm/' + encodeURIComponent(opts.shareId), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + opts.token
            },
            body: JSON.stringify({
              session_id: sessionId,
              segment_n: n,
              kind: kind,
              played_seconds: 1
            })
          });
        } catch (e) {
          log('confirm 실패 n=', n, e.message);
        }

        n++;

        // 다음 세그먼트 앞서 로드 (1초 = 1세그먼트, 즉시 다음 요청)
        await new Promise(function (r) { setTimeout(r, 50); });
      }

      log('loop 끝, 총 세그먼트:', chunks.length);
    }

    // 백그라운드 다운로드 시작
    loop().catch(function (e) {
      log('loop error', e.message);
      if (opts.onError) opts.onError(e);
    });

    return {
      sessionId: sessionId,
      kind: kind,
      stop: stopFn
    };
  }

  // ───────────────────────────────────────
  // TL3.stop — 정지
  // ───────────────────────────────────────
  function stop(audioEl) {
    if (!audioEl) return;
    try { audioEl.pause(); } catch (e) {}
    if (audioEl._tl3ObjectUrl) {
      try { URL.revokeObjectURL(audioEl._tl3ObjectUrl); } catch (e) {}
      audioEl._tl3ObjectUrl = null;
    }
  }

  global.TL3 = {
    create: create,
    play: play,
    stop: stop,
    decodeToPcm: decodeToPcm,
    int16ToBase64: int16ToBase64
  };
})(typeof window !== 'undefined' ? window : this);