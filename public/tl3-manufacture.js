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
    // ★ LP 라이선스 + 차분 처리
    var lpLicense = o.lpLicense || null;
    var lpDiff = o.lpDiff || null;
    var lpDiffB64 = null;
    if (lpDiff && lpDiff.bytes) {
      try {
        // Uint8Array → base64
        var bytes = lpDiff.bytes;
        var bin = '';
        for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
        lpDiffB64 = btoa(bin);
        console.log('[manufacture] LP diff base64:', lpDiffB64.length, 'chars, codec:', lpDiff.codec);
      } catch (e) {
        console.warn('[manufacture] lpDiff base64 인코딩 실패:', e);
        lpDiffB64 = null;
      }
    }
    var releaseBody = {
      file_id: fileId,
      share_id: shareId,
      title: String(o.title || ''),
      artist: String(o.artist || ''),
      price_tl: Math.max(0, Math.floor(Number(o.priceTl || 0))),
      rights_confirmed: true
    };
    if (lpLicense) releaseBody.lp_license = lpLicense;
    if (lpDiffB64) {
      releaseBody.lp_diff_b64 = lpDiffB64;
      releaseBody.lp_diff_codec = lpDiff.codec || 'deflate';
      releaseBody.lp_diff_n = lpDiff.n || 0;
      releaseBody.lp_diff_scale = lpDiff.scale || 128;
    }
    const release = await postJson(api + '/api/v1/tl3/releases', token, releaseBody);
    if (Number(release.file_id) !== fileId) throw new Error('서버가 반환한 TL3 file_id가 원본 자산과 일치하지 않습니다.');
    let spine = null, spineError = null;
    try {
      spine = await postJson(api + '/api/v1/tl3/spine/releases', token, {
        file_id: fileId, share_id: String(release.share_id || shareId), rights_confirmed: true
      });
      if (Number(spine.file_id) !== fileId) throw new Error('Spine file_id 불일치');
    } catch (error) {
      spineError = error.message || 'Spine v4 제조 실패';
    }
    return { ok: true, release: release, spine: spine, spineError: spineError,
      file_id: fileId, share_id: String(release.share_id || shareId),
      lp: lpLicense ? { enabled: true, diff_bytes: lpDiffB64 ? lpDiffB64.length : 0 } : { enabled: false } };
  }
  global.TimeLinkTL3 = Object.freeze({ manufacture: manufacture });
})(window);
