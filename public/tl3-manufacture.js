/* TimeLink TL3 manufacturing pipeline — V5 MP3-preserving container builder. */
(function (global) {
  'use strict';
  async function postJson(url, token, body) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify(body)
    });
    const data = await response.json().catch(function () { return {}; });
    if (!response.ok || !data.ok) {
      const error = new Error(data.error || ('HTTP ' + response.status));
      error.status = response.status; error.data = data; throw error;
    }
    return data;
  }
  async function readDurationMs(file) {
    const objectUrl = URL.createObjectURL(file);
    const audio = new Audio();
    audio.preload = 'metadata';
    try {
      const duration = await new Promise(function (resolve, reject) {
        const timer = setTimeout(function () { cleanup(); reject(new Error('MP3 재생시간을 확인하지 못했습니다.')); }, 15000);
        function cleanup() { clearTimeout(timer); audio.removeEventListener('loadedmetadata', ready); audio.removeEventListener('error', failed); }
        function ready() { cleanup(); resolve(Number(audio.duration)); }
        function failed() { cleanup(); reject(new Error('브라우저가 MP3 재생시간을 읽지 못했습니다.')); }
        audio.addEventListener('loadedmetadata', ready, { once: true });
        audio.addEventListener('error', failed, { once: true });
        audio.src = objectUrl;
        audio.load();
      });
      if (!Number.isFinite(duration) || duration <= 0) throw new Error('MP3 재생시간 정보가 올바르지 않습니다.');
      return Math.round(duration * 1000);
    } finally {
      try { audio.pause(); audio.removeAttribute('src'); audio.load(); } catch (_) {}
      URL.revokeObjectURL(objectUrl);
    }
  }
  async function manufacture(options) {
    const o = options || {};
    const api = String(o.api || '').replace(/\/$/, '');
    const token = String(o.token || '');
    const fileId = Number(o.fileId || 0);
    const shareId = String(o.shareId || ('tl3_' + fileId));
    const sourceFile = o.file;
    const lpLicense = o.lpLicense || null;
    if (!(sourceFile instanceof File)) throw new Error('Creator의 로컬 MP3 원본이 없습니다.');
    if (sourceFile.size > 16 * 1024 * 1024) throw new Error('TL3 V5 1차 버전은 MP3 원본 16MB 이하를 지원합니다. 대용량 음원은 스트리밍 컨테이너 빌더 적용 후 지원합니다.');
    if (!/\.mp3$/i.test(sourceFile.name || '') && sourceFile.type !== 'audio/mpeg') {
      throw new Error('TL3 V5에는 MP3 원본만 등록할 수 있습니다.');
    }
    if (!api || !token || !Number.isSafeInteger(fileId) || fileId <= 0) {
      throw new Error('TL3 제조에 필요한 API, 로그인 토큰, file_id가 없습니다.');
    }
    if (o.rightsConfirmed !== true) throw new Error('저작권 또는 적법한 이용 권한 확인이 필요합니다.');
    if (lpLicense && lpLicense.lp_enabled === true &&
        (!lpLicense.lp_g || typeof lpLicense.lp_g !== 'object' ||
         !Number.isFinite(Number(lpLicense.lp_fs)) || Number(lpLicense.lp_fs) <= 0 ||
         !Number.isFinite(Number(lpLicense.lp_n)) || Number(lpLicense.lp_n) <= 0 ||
         !lpLicense.lp_version)) {
      throw new Error('Creator의 LP 효과 분석이 완성되지 않았습니다. LP 설정 분석을 다시 실행해 주세요.');
    }

    // MP3 remains unchanged in Creator. Only its measured duration and rights
    // manifest accompany it into the final V5 containerization stage.
    const durationMs = await readDurationMs(sourceFile);
    const metadata = {
      file_id: fileId, share_id: shareId,
      title: String(o.title || ''), artist: String(o.artist || ''),
      duration_ms: durationMs, rights_confirmed: true,
      rights_kind: o.rightsKind === 'ai_creation' ? 'ai_creation' : 'copyright',
      composer: String(o.composer || '').slice(0,200),
      lyricist: String(o.lyricist || '').slice(0,200),
      source_platform: String(o.sourcePlatform || '').slice(0,120),
      source_reference: String(o.sourceReference || '').slice(0,240),
      isrc: String(o.isrc || '').slice(0,32),
      iswc: String(o.iswc || '').slice(0,32),
      society_name: String(o.societyName || '').slice(0,160),
      society_reference: String(o.societyReference || '').slice(0,160),
      lp_license: lpLicense
    };
    const form = new FormData();
    form.append('file', sourceFile, sourceFile.name || 'source.mp3');
    form.append('metadata', JSON.stringify(metadata));
    const response = await fetch(api + '/api/v1/tl3/v5/manufacture', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token },
      body: form
    });
    const release = await response.json().catch(function () { return {}; });
    if (!response.ok || !release.ok) {
      const error = new Error(release.error || ('HTTP ' + response.status));
      error.status = response.status; error.data = release; throw error;
    }
    if (Number(release.file_id) !== fileId || Number(release.version) !== 5 ||
        String(release.status) !== 'released' || Number(release.duration_ms) <= 0) {
      throw new Error('TL3 V5 제조 결과가 정상 규격과 일치하지 않습니다.');
    }
    const integrityResponse = await fetch(api + '/api/v1/tl3/v5/verify/' + encodeURIComponent(fileId), {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const integrity = await integrityResponse.json().catch(function () { return {}; });
    if (!integrityResponse.ok || !integrity.ok || integrity.valid !== true || Number(integrity.version) !== 5) {
      throw new Error(integrity.error || integrity.reason || 'TL3 V5 컨테이너 무결성 검증에 실패했습니다.');
    }
    const playableResponse = await fetch(api + '/api/v1/tl3/v5/resolve/' + encodeURIComponent(fileId), {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const playable = await playableResponse.json().catch(function () { return {}; });
    if (!playableResponse.ok || !playable.ok || Number(playable.version) !== 5 ||
        Number(playable.file_id) !== fileId || Number(playable.duration_ms) !== Number(release.duration_ms)) {
      throw new Error(playable.error || 'Track V5 공개 메타데이터 검증에 실패했습니다.');
    }
    return {
      ok: true, release: release,
      verification: { track_ready: true, file_id: fileId, version: 5,
        duration_ms: Number(release.duration_ms), container_bytes: Number(release.container_bytes),
        container_sha256: String(release.container_sha256 || '') },
      file_id: fileId, share_id: String(release.share_id || shareId), version: 5,
      lp: lpLicense && lpLicense.lp_enabled === true
        ? { enabled: true, runtime: true, version: lpLicense.lp_version, sample_rate: Number(lpLicense.lp_fs), samples: Number(lpLicense.lp_n) }
        : { enabled: false }
    };
  }
  global.TimeLinkTL3 = Object.freeze({ manufacture: manufacture, version: 5 });
})(window);
