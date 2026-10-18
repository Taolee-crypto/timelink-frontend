/* TimeLink shared TL3 manufacturing pipeline.
 * Creator keeps the original MP3 local and sends it directly for TL3 v4 sealing.
 * Track consumes the same Spine v4 container and server-side token chain.
 */
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
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  }
  async function manufacture(options) {
    const o = options || {};
    const api = String(o.api || '').replace(/\/$/, '');
    const token = String(o.token || '');
    const fileId = Number(o.fileId || 0);
    const shareId = String(o.shareId || ('tl3_' + fileId));
    const sourceFile = o.file;
    if (!(sourceFile instanceof File)) throw new Error('Creator의 로컬 MP3 원본이 없습니다.');
    if (!api || !token || !Number.isSafeInteger(fileId) || fileId <= 0) {
      throw new Error('TL3 제조에 필요한 API, 로그인 토큰, file_id가 없습니다.');
    }
    if (o.rightsConfirmed !== true) throw new Error('저작권 또는 적법한 이용 권한 확인이 필요합니다.');
    // The original MP3 is sent directly from the browser and is never stored as a source object.
    const metadata = {
      file_id: fileId,
      share_id: shareId,
      title: String(o.title || ''),
      artist: String(o.artist || ''),
      rights_confirmed: true,
      lp_license: o.lpLicense || null
    };
    const form = new FormData();
    form.append('file', sourceFile, sourceFile.name || 'source.mp3');
    form.append('metadata', JSON.stringify(metadata));
    const response = await fetch(api + '/api/v1/tl3/spine/releases', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token },
      body: form
    });
    const release = await response.json().catch(function () { return {}; });
    if (!response.ok || !release.ok) {
      const error = new Error(release.error || ('HTTP ' + response.status));
      error.status = response.status; error.data = release; throw error;
    }
    if (Number(release.file_id) !== fileId || Number(release.version) !== 4 ||
        String(release.status) !== 'released' || Number(release.segment_count) < 1) {
      throw new Error('TL3 v4 제조 결과가 Track 공개 규격과 일치하지 않습니다.');
    }

    // Verify the exact public v4 header and complete server-held Spine chain.
    const verifyResponse = await fetch(api + '/api/v1/tl3/spine/header/' + encodeURIComponent(fileId), {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const playable = await verifyResponse.json().catch(function () { return {}; });
    if (!verifyResponse.ok || !playable.ok || !playable.header ||
        playable.header.profile !== 'TL3-SPINE-1' ||
        Number(playable.header.file_id) !== fileId ||
        !Array.isArray(playable.spine_tokens) ||
        playable.spine_tokens.length !== Number(release.segment_count) + 1) {
      throw new Error(playable.error || ('Track v4 헤더 검증 실패 (HTTP ' + verifyResponse.status + ')'));
    }
    const integrityResponse = await fetch(api + '/api/v1/tl3/spine/' + encodeURIComponent(fileId) + '/verify', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const integrity = await integrityResponse.json().catch(function () { return {}; });
    if (!integrityResponse.ok || !integrity.ok || integrity.valid !== true) {
      throw new Error(integrity.error || integrity.reason || 'TL3 v4 Spine 무결성 검증에 실패했습니다.');
    }
    return {
      ok: true, release: release,
      verification: { track_ready: true, file_id: fileId, segments: Number(release.segment_count), duration_ms: Number(release.duration_ms || 0) },
      file_id: fileId, share_id: String(release.share_id || shareId),
      version: 4,
      lp: lpLicense ? { enabled: lpLicense.lp_enabled === true, runtime: true, opus_bytes: 0 } : { enabled: false }
    };
  }
  global.TimeLinkTL3 = Object.freeze({ manufacture: manufacture });
})(window);
