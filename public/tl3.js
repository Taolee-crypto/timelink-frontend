  // ───────────────────────────────────────
  // TL3.create — mp3 + LP를 로컬 에이전트에 먼저 저장 후 서버가 fetch
  // opts: { API, token, shareId?, title, artist, cid, name, genre, bpm, creator_id, localAgent }
  // ───────────────────────────────────────
  async function create(mp3Blob, lpBlob, opts) {
    opts = opts || {};
    if (!opts.API) throw new Error('API base 필요');
    if (!opts.token) throw new Error('로그인 토큰 필요');
    var localAgent = opts.localAgent || 'http://127.0.0.1:8787';

    log('upload mp3 to local agent');
    var mp3Token = await uploadToLocal(localAgent, mp3Blob, 'mp3src_' + Date.now() + '.mp3', 'audio/mpeg');
    var flacToken = '';
    if (lpBlob) {
      log('upload LP to local agent');
      flacToken = await uploadToLocal(localAgent, lpBlob, 'lpsrc_' + Date.now() + '.wav', 'audio/wav');
    }

    // 서버에 create 요청 (토큰만 전송 — 데이터 X)
    log('sending create, mp3Token=', mp3Token, 'flacToken=', flacToken);
    var res = await fetch(opts.API + '/api/v1/tl3/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + opts.token
      },
      body: JSON.stringify({
        mp3_token: mp3Token,
        flac_token: flacToken,
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
    return data;
  }

  // 로컬 에이전트에 파일 업로드 → 토큰 반환
  async function uploadToLocal(localAgent, blob, name, contentType) {
    var res = await fetch(localAgent + '/upload?kind=src&name=' + encodeURIComponent(name), {
      method: 'POST',
      headers: { 'Content-Type': contentType },
      body: blob
    });
    var data = await res.json().catch(function () { return {}; });
    if (!res.ok || !data.ok) throw new Error(data.error || 'local upload 실패');
    return data.token;
  }