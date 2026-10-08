// public/tl3.js — TL3 v3 final (mp3 전용, LP는 별도 솔루션)
// TL3 = mp3 + 시간 + 저작권 + AES-256-GCM + 타임토큰 체인
// LP 효과는 lp.js / lp.ts가 별도로 처리 (파일 저장 X, 실시간)
(function (global) {
  'use strict';

  function log() {
    if (global.TL3_DEBUG) {
      console.log.apply(console, ['[TL3]'].concat([].slice.call(arguments)));
    }
  }

  function getApiBase() {
    return (global.TL3_API_BASE || '').replace(/\/$/, '');
  }

  // ─────────────────────────────────────────
  // Int16Array → base64 (리틀엔디안은 브라우저 네이티브)
  // ─────────────────────────────────────────
  function int16ToBase64(int16) {
    var bytes = new Uint8Array(int16.buffer, int16.byteOffset, int16.byteLength);
    var chunk = 0x8000;
    var out = '';
    for (var i = 0; i < bytes.length; i += chunk) {
      out += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return btoa(out);
  }

  // ─────────────────────────────────────────
  // 오디오 Blob → 인터리브 int16 PCM
  //   { pcm: Int16Array, fs, ch, frames }
  // ─────────────────────────────────────────
  async function blobToInterleavedPcm(blob) {
    var arr = await blob.arrayBuffer();
    var Ctx = global.AudioContext || global.webkitAudioContext;
    var ctx = new Ctx();
    try {
      var audioBuf = await ctx.decodeAudioData(arr.slice(0));
      var fs = audioBuf.sampleRate;
      var ch = audioBuf.numberOfChannels;
      var n = audioBuf.length;
      var pcm = new Int16Array(n * ch);
      var chans = [];
      for (var c = 0; c < ch; c++) chans.push(audioBuf.getChannelData(c));
      var idx = 0;
      for (var i = 0; i < n; i++) {
        for (var c2 = 0; c2 < ch; c2++) {
          var s = Math.max(-1, Math.min(1, chans[c2][i]));
          pcm[idx++] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
      }
      return { pcm: pcm, fs: fs, ch: ch, frames: n };
    } finally {
      try { ctx.close(); } catch (e) {}
    }
  }

  // ─────────────────────────────────────────
  // TL3.create(mp3Blob, opts)
  //   mp3Blob: mp3 File/Blob (필수)
  //   opts   : { API, token, title, artist, cid, name, genre, bpm, creator_id }
  //   returns: { ok, share_id, stream_url, tl3_token, duration_sec, ... }
  // ─────────────────────────────────────────
  async function create(mp3Blob, opts) {
    opts = opts || {};
    var API = opts.API || getApiBase();
    if (!API) throw new Error('TL3: API base 필요');
    if (!opts.token) throw new Error('TL3: 로그인 토큰 필요');
    if (!mp3Blob) throw new Error('TL3: mp3 파일 필요');

    log('decode mp3 → PCM');
    var mp3 = await blobToInterleavedPcm(mp3Blob);
    log('PCM: fs=' + mp3.fs + ' ch=' + mp3.ch + ' frames=' + mp3.frames);

    log('encode base64 (' + mp3.pcm.length + ' samples)');
    var mp3_b64 = int16ToBase64(mp3.pcm);

    log('POST /api/v1/tl3/create');
    var res = await fetch(API + '/api/v1/tl3/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + opts.token
      },
      body: JSON.stringify({
        mp3_pcm_b64: mp3_b64,
        fs: mp3.fs,
        ch: mp3.ch,
        title: opts.title || 'Untitled',
        artist: opts.artist || 'Unknown',
        cid: opts.cid || '',
        name: opts.name || 'User',
        genre: opts.genre || '',
        bpm: opts.bpm || 0,
        creator_id: opts.creator_id || 0
      })
    });
    var data = await res.json().catch(function () { return {}; });
    if (!res.ok || !data.ok) throw new Error(data.error || ('create HTTP ' + res.status));
    log('create ok:', data);
    return data;
  }

  // ─────────────────────────────────────────
  // TL3.play(shareId, audioEl, opts)
  //   shareId: tl_shares.id (예: sh_1791380628872_6vjkh)
  //   audioEl: HTMLAudioElement
  //   opts   : { API, token, lp (bool), lpParams }
  //   returns: { ok, blobUrl, stop }
  // ─────────────────────────────────────────
  async function play(shareId, audioEl, opts) {
    opts = opts || {};
    var API = opts.API || getApiBase();
    if (!API) throw new Error('TL3: API base 필요');

    var res = await fetch(API + '/api/v1/tl3/full/' + encodeURIComponent(shareId), {
      method: 'GET',
      headers: opts.token ? { 'Authorization': 'Bearer ' + opts.token } : {}
    });
    if (!res.ok) throw new Error('TL3 full HTTP ' + res.status);

    var blob = await res.blob();
    var url = URL.createObjectURL(blob);

    var stopLp = null;
    if (audioEl) {
      audioEl.src = url;
      audioEl.load();

      // ⭐ LP 효과는 별도 솔루션 (lp.js) — 선택적 호출, 파일 저장 X
      if (opts.lp !== false && global.lp && typeof global.lp.attach === 'function') {
        try {
          stopLp = global.lp.attach(audioEl, opts.lpParams || {});
          log('lp.js attached');
        } catch (e) {
          log('lp attach fail:', e);
        }
      }

      await audioEl.play();
    }

    return {
      ok: true,
      blobUrl: url,
      stop: function () {
        if (typeof stopLp === 'function') stopLp();
        URL.revokeObjectURL(url);
      }
    };
  }

  global.TL3 = {
    create: create,
    play: play,
    // 유틸 (디버깅/재사용)
    blobToInterleavedPcm: blobToInterleavedPcm,
    int16ToBase64: int16ToBase64,
    version: 'v3-mp3'
  };

  log('loaded, API_BASE=', global.TL3_API_BASE);
})(window);