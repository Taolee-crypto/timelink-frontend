/* TimeLink shared TL3 manufacturing pipeline.
 * v3 is the published/playable release; v4 Spine is sealed as an integrity companion.
 * Both Creator entry points call this exact function.
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
    if (!api || !token || !Number.isSafeInteger(fileId) || fileId <= 0) {
      throw new Error('TL3 제조에 필요한 API, 로그인 토큰, file_id가 없습니다.');
    }
    if (o.rightsConfirmed !== true) throw new Error('저작권 또는 적법한 이용 권한 확인이 필요합니다.');
    // LP 오디오는 TL3에 포함하지 않는다. 라이선스/재생 파라미터만 헤더 메타데이터로 전달한다.
    var lpLicense = o.lpLicense || null;
    var releaseBody = {
      file_id: fileId,
      share_id: shareId,
      title: String(o.title || ''),
      artist: String(o.artist || ''),
      price_tl: Math.max(0, Math.floor(Number(o.priceTl || 0))),
      rights_confirmed: true
    };
    if (lpLicense) releaseBody.lp_license = lpLicense;
    const release = await postJson(api + '/api/v1/tl3/releases', token, releaseBody);
    if (Number(release.file_id) !== fileId) throw new Error('서버가 반환한 TL3 file_id가 원본 자산과 일치하지 않습니다.');
    if (String(release.status || '') !== 'released' || Number(release.segment_count || 0) < 1) {
      throw new Error('TL3 제조는 완료됐지만 공개 등록 상태 또는 세그먼트 정보가 유효하지 않습니다.');
    }

    // Creator completion is gated by the exact public header consumed by Track.
    // Spine v4 remains a separate, unpublished integrity archive and is not part
    // of the production v3 playback path; do not let that archive block a valid release.
    const verifyResponse = await fetch(api + '/api/v1/tl3/header/' + encodeURIComponent(fileId), {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const playable = await verifyResponse.json().catch(function () { return {}; });
    if (!verifyResponse.ok || !playable.ok) {
      throw new Error(playable.error || ('Track 공개 헤더 확인 실패 (HTTP ' + verifyResponse.status + ')'));
    }
    if (Number(playable.file_id) !== fileId ||
        Number(playable.mp3 && playable.mp3.N || 0) !== Number(release.segment_count) ||
        !Array.isArray(playable.mp3_tokens) ||
        playable.mp3_tokens.length < Number(release.segment_count) + 1) {
      throw new Error('Track 재생 헤더의 file_id, 세그먼트 수 또는 토큰 체인이 일치하지 않습니다.');
    }
    return {
      ok: true, release: release,
      verification: { track_ready: true, file_id: fileId, segments: Number(release.segment_count), duration_ms: Number(release.duration_ms || 0) },
      file_id: fileId, share_id: String(release.share_id || shareId),
      lp: lpLicense ? { enabled: lpLicense.lp_enabled === true, runtime: true, opus_bytes: 0 } : { enabled: false }
    };
  }
  global.TimeLinkTL3 = Object.freeze({ manufacture: manufacture });
})(window);
