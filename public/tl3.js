/*!
 * TimeLink TL3 client library
 * ----------------------------------------------------------------------------
 * Decodes .tl3 (TLNK v2) containers and plays them inside the browser.
 *
 * Segmented playback model (matches timelink-backend):
 *   - Backend pre-charges TL per segment (5s each) on GET /segment/:id
 *   - Client must confirm actual playback time on POST /segment/confirm/:id
 *   - Backend enforces: sequential segments, 1 pending segment, 4s rate limit
 *
 * TL3 layout:
 *   0  4  magic "TLNK"
 *   4  1  version (2)
 *   5  2  metadata length (big-endian uint16)
 *   7  N  metadata JSON (UTF-8)
 *   7+N M XOR-encrypted audio payload
 */
(function (global) {
  'use strict';

  var XOR_KEY = 'TIMELINK_XOR_KEY_2026_SECURE';
  var MAGIC = [0x54, 0x4c, 0x4e, 0x4b]; // "TLNK"

  // ===== Tuning constants =====
  var SEGMENT_DURATION_MS_DEFAULT = 5000;
  var RATE_LIMIT_MS = 4000;              // 백엔드: last_segment_at + 4초 이후 요청 가능
  var CONFIRM_MARGIN_MS = 1000;          // 세그먼트 duration - 1000ms = 4000ms 후 confirm
  var MAX_SEGMENT_RETRIES = 3;
  var RETRY_BASE_DELAY_MS = 500;
  var DEBUG = true;

  function log() {
    if (!DEBUG) return;
    try { console.log.apply(console, ['[TL3]'].concat([].slice.call(arguments))); } catch (e) {}
  }

  var keyBytes = (function () {
    var b = new Uint8Array(XOR_KEY.length);
    for (var i = 0; i < XOR_KEY.length; i++) b[i] = XOR_KEY.charCodeAt(i) & 0xff;
    return b;
  })();

  function xorTransform(bytes) {
    var out = new Uint8Array(bytes.length);
    var kl = keyBytes.length;
    for (var i = 0; i < bytes.length; i++) out[i] = bytes[i] ^ keyBytes[i % kl];
    return out;
  }

  /** Parse an ArrayBuffer (or Uint8Array) holding a TL3 file. */
  function parse(buffer) {
    var bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    if (bytes.length < 7) throw new Error('TL3 too small');
    for (var i = 0; i < 4; i++) {
      if (bytes[i] !== MAGIC[i]) throw new Error('Not a TL3 file (bad magic)');
    }
    var version = bytes[4];
    var mlen = (bytes[5] << 8) | bytes[6];
    if (7 + mlen > bytes.length) throw new Error('TL3 metadata length out of range');
    var metaText = '';
    try {
      metaText = decodeURIComponent(
        Array.prototype.map.call(bytes.subarray(7, 7 + mlen), function (b) {
          return '%' + ('00' + b.toString(16)).slice(-2);
        }).join('')
      );
    } catch (e) {
      metaText = new TextDecoder('utf-8').decode(bytes.subarray(7, 7 + mlen));
    }
    var meta = JSON.parse(metaText);
    var encrypted = bytes.subarray(7 + mlen);
    var audio = xorTransform(encrypted);
    return { version: version, meta: meta, audio: audio };
  }

  /** Build a TL3 container from metadata + raw audio bytes (encoder). */
  function build(meta, audioBytes) {
    var metaBytes = new TextEncoder().encode(JSON.stringify(meta));
    var enc = xorTransform(audioBytes instanceof Uint8Array ? audioBytes : new Uint8Array(audioBytes));
    var out = new Uint8Array(7 + metaBytes.length + enc.length);
    out[0] = MAGIC[0]; out[1] = MAGIC[1]; out[2] = MAGIC[2]; out[3] = MAGIC[3];
    out[4] = 0x02;
    out[5] = (metaBytes.length >> 8) & 0xff;
    out[6] = metaBytes.length & 0xff;
    out.set(metaBytes, 7);
    out.set(enc, 7 + metaBytes.length);
    return out;
  }

  /** Decode a TL3 Blob/File into a playable mp3 Blob. */
  function toMp3Blob(tl3Blob) {
    return tl3Blob.arrayBuffer().then(function (buf) {
      var parsed = parse(buf);
      return { blob: new Blob([parsed.audio], { type: 'audio/mpeg' }), meta: parsed.meta };
    });
  }

  function createPlayer(audioEl) {
    if (!audioEl) audioEl = new Audio();
    audioEl._tl3ObjectUrl = null;
    return audioEl;
  }

  function _setSrc(audioEl, objectUrl) {
    if (audioEl._tl3ObjectUrl) {
      try { URL.revokeObjectURL(audioEl._tl3ObjectUrl); } catch (e) {}
    }
    audioEl._tl3ObjectUrl = objectUrl;
    audioEl.src = objectUrl;
  }

  function play(audioEl, url, opts) {
    opts = opts || {};
    var player = createPlayer(audioEl);
    return fetch(url, opts.fetchOptions || {})
      .then(function (res) {
        if (!res.ok) throw new Error('stream HTTP ' + res.status);
        return res.arrayBuffer();
      })
      .then(function (buf) {
        var parsed = parse(buf);
        var blob = new Blob([parsed.audio], { type: 'audio/mpeg' });
        var objectUrl = URL.createObjectURL(blob);
        _setSrc(player, objectUrl);
        if (opts.autoplay !== false) {
          var p = player.play();
          if (p && p.catch) p.catch(function (e) { if (opts.onError) opts.onError(e); });
        }
        return { meta: parsed.meta, blob: blob, objectUrl: objectUrl };
      });
  }

  function attach(audioEl, url, opts) {
    opts = opts || {};
    var player = createPlayer(audioEl);
    function direct() { _setSrc(player, url); return { decoded: false }; }
    return fetch(url, opts.fetchOptions || {})
      .then(function (res) {
        if (!res.ok) throw new Error('stream HTTP ' + res.status);
        return res.arrayBuffer();
      })
      .then(function (buf) {
        var bytes = new Uint8Array(buf);
        var isTl3 = bytes.length >= 7 &&
          bytes[0] === MAGIC[0] && bytes[1] === MAGIC[1] &&
          bytes[2] === MAGIC[2] && bytes[3] === MAGIC[3];
        if (!isTl3) { _setSrc(player, url); return { decoded: false }; }
        var parsed = parse(buf);
        var blob = new Blob([parsed.audio], { type: 'audio/mpeg' });
        _setSrc(player, URL.createObjectURL(blob));
        return { decoded: true, meta: parsed.meta };
      })
      .catch(function (e) {
        if (opts.fallbackDirect !== false) return direct();
        throw e;
      });
  }

  function resolveUrl(url, opts) {
    opts = opts || {};
    if (!url || typeof url !== 'string') return Promise.resolve(url);
    if (/^(blob:|data:)/i.test(url)) return Promise.resolve(url);
    return fetch(url, opts.fetchOptions || {})
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        if (!opts.onProgress || !res.body || !res.body.getReader) return res.arrayBuffer();
        var total = Number(res.headers.get('content-length')) || 0;
        if (!total) return res.arrayBuffer();
        var reader = res.body.getReader();
        var chunks = [];
        var received = 0;
        return (function pump() {
          return reader.read().then(function (r) {
            if (r.done) {
              var out = new Uint8Array(received);
              var off = 0;
              for (var i = 0; i < chunks.length; i++) { out.set(chunks[i], off); off += chunks[i].length; }
              return out.buffer;
            }
            chunks.push(r.value);
            received += r.value.length;
            try { opts.onProgress(received, total); } catch (e) {}
            return pump();
          });
        })();
      })
      .then(function (buf) {
        var bytes = new Uint8Array(buf);
        var isTl3 = bytes.length >= 7 &&
          bytes[0] === MAGIC[0] && bytes[1] === MAGIC[1] &&
          bytes[2] === MAGIC[2] && bytes[3] === MAGIC[3];
        if (!isTl3) return url;
        var parsed = parse(buf);
        return URL.createObjectURL(new Blob([parsed.audio], { type: 'audio/mpeg' }));
      })
      .catch(function () { return url; });
  }

  function stop(audioEl) {
    if (!audioEl) return;
    try { audioEl.pause(); } catch (e) {}
    if (audioEl._tl3ObjectUrl) {
      try { URL.revokeObjectURL(audioEl._tl3ObjectUrl); } catch (e) {}
      audioEl._tl3ObjectUrl = null;
    }
  }

  // ============================================================
  // streamSegmented — 백엔드 계약(순차 + rate limit + confirm) 정확 준수
  // ============================================================
  function streamSegmented(audioEl, baseUrl, opts) {
    opts = opts || {};
    var player = createPlayer(audioEl);
    var fetchOptions = opts.fetchOptions || {};
    if (!global.MediaSource || !MediaSource.isTypeSupported('audio/mpeg')) {
      return Promise.reject(new Error('이 브라우저는 TL3 시간 세그먼트 재생을 지원하지 않습니다.'));
    }
    if (!opts.sessionId) return Promise.reject(new Error('TL3 재생 세션이 필요합니다.'));

    // baseUrl = ".../api/v1/tl3/segment/{fileId}" → fileId 파싱
    var fileIdMatch = baseUrl.match(/\/segment\/([^/?#]+)/);
    var fileId = fileIdMatch ? fileIdMatch[1] : '';
    if (!fileId) return Promise.reject(new Error('TL3 segment URL에서 fileId를 찾을 수 없습니다.'));
    var confirmBase = baseUrl.replace(/\/segment\/[^/?#]+.*$/, '/segment/confirm/' + fileId);

    var ms = new MediaSource();
    var objectUrl = URL.createObjectURL(ms);
    _setSrc(player, objectUrl);

    var stopped = false;
    var openedResolve, openedReject;
    var opened = new Promise(function (resolve, reject) { openedResolve = resolve; openedReject = reject; });

    // 세션 식별 (곡 변경 감지)
    var generation = (streamSegmented._gen = (streamSegmented._gen || 0) + 1);
    function isStale() { return stopped || generation !== streamSegmented._gen; }

    // ---- 상태 ----
    var sb = null;
    var segmentIndex = 0;            // 다음에 요청할 세그먼트
    var lastSegmentAt = 0;           // 마지막 세그먼트 요청 시각 (rate limit)
    var eofReached = false;
    var appendBusy = false;
    var confirmBusy = false;
    var nextTimer = null;            // 다음 세그먼트 트리거 타이머

    // ---- TL 정산 상태 ----
    var confirmedOffset = 0;         // 서버가 확정한 누적 재생시간(초)
    var pendingDurationSec = 0;      // 현재 pending 세그먼트의 재생 가능 시간(초)
    var pendingReserved = 0;         // 선차감된 TL

    // ---- 공개 인터페이스 (_tl3ResumeSegments 등) ----
    // (아래에서 정의)

    // -------- 유틸 --------
    function clearNextTimer() {
      if (nextTimer) { clearTimeout(nextTimer); nextTimer = null; }
    }

    function getBufferedAhead() {
      try {
        if (!player.buffered || !player.buffered.length) return 0;
        var cur = player.currentTime || 0;
        for (var i = 0; i < player.buffered.length; i++) {
          var s = player.buffered.start(i);
          var e = player.buffered.end(i);
          if (cur >= s && cur <= e) return e - cur;
        }
        var lastEnd = player.buffered.end(player.buffered.length - 1);
        return Math.max(0, lastEnd - cur);
      } catch (e) { return 0; }
    }

    // -------- confirm: 서버에 실제 재생시간 확정 + 미사용분 환불 --------
    function confirmPending(force) {
      if (confirmBusy || stopped || isStale()) return Promise.resolve();
      if (pendingDurationSec <= 0) return Promise.resolve();

      // 실제 재생시간 = min(pendingDurationSec, currentTime - confirmedOffset)
      var elapsed = Math.max(0, player.currentTime - confirmedOffset);
      var played = Math.min(pendingDurationSec, elapsed);
      // 강제가 아니면 최소 0.25초 이상 재생됐을 때만 confirm
      if (!force && played < Math.min(0.25, pendingDurationSec)) return Promise.resolve();

      confirmBusy = true;
      var body = {
        session_id: opts.sessionId,
        played_seconds: Number(played.toFixed(3))
      };
      log('confirm segment', segmentIndex - 1, 'played=', body.played_seconds);

      return fetch(confirmBase, {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, fetchOptions.headers || {}),
        body: JSON.stringify(body)
      }).then(function (r) {
        return r.json().then(function (d) {
          if (!r.ok || !d.ok) {
            // 409: pending 없음 / 정산 필요 → 이미 정산된 상태일 수 있음
            if (r.status === 409) {
              log('confirm 409 (이미 정산됨):', d.error);
              return d;
            }
            throw new Error(d.error || ('confirm HTTP ' + r.status));
          }
          return d;
        });
      }).then(function (d) {
        var settled = Number(d.played_seconds || 0);
        confirmedOffset += settled;
        pendingDurationSec = 0;
        pendingReserved = 0;

        if (opts.onSegment) {
          try {
            opts.onSegment({
              seconds: settled,
              durationMs: settled * 1000,
              remaining: Number(d.remaining_tl || 0),
              segment: Number(d.segment || 0),
              refunded: Number(d.refund || 0),
              reserved: Number(d.reserved || 0),
              creatorRevenue: Number(d.creator_revenue || 0)
            });
          } catch (e) {}
        }
        return d;
      }).catch(function (err) {
        log('confirm error:', err.message);
        // confirm 실패해도 다음 세그먼트 요청은 시도 (서버가 pending 타임아웃 처리)
        throw err;
      }).finally(function () {
        confirmBusy = false;
      });
    }

    // -------- 다음 세그먼트 요청 (rate limit 후) --------
    function requestNextSegment() {
      if (stopped || isStale() || eofReached) return;

      var now = Date.now();
      var elapsed = now - lastSegmentAt;
      var wait = Math.max(0, RATE_LIMIT_MS - elapsed);
      if (wait > 0) {
        clearNextTimer();
        nextTimer = setTimeout(requestNextSegment, wait);
        return;
      }

      // rate limit 통과 → 즉시 요청
      fetchSegment(segmentIndex);
    }

    // -------- 세그먼트 fetch --------
    function fetchSegment(index) {
      if (stopped || isStale() || eofReached) return;
      lastSegmentAt = Date.now();

      var url = baseUrl + (baseUrl.indexOf('?') >= 0 ? '&' : '?') +
        'segment=' + index + '&session_id=' + encodeURIComponent(opts.sessionId);

      log('fetch segment', index);

      var attempt = 0;
      function doFetch() {
        return fetch(url, fetchOptions).then(function (res) {
          if (res.status === 416) {
            // EOF
            eofReached = true;
            try { if (ms.readyState === 'open') ms.endOfStream(); } catch (e) {}
            return null;
          }
          if (res.status === 402) {
            // TL 부족 → 재생 중단
            return res.json().then(function (d) {
              var err = new Error(d.error || '시간 포인트가 부족합니다.');
              err.code = 402;
              err.balance = d.balance;
              throw err;
            });
          }
          if (res.status === 409) {
            // pending 미정산 → confirm 먼저 시도 후 재요청
            return res.json().then(function (d) {
              var err = new Error(d.error || '이전 세그먼트 정산 필요');
              err.code = 409;
              throw err;
            });
          }
          if (res.status === 429) {
            // rate limit → retry_after 후 재시도
            return res.json().then(function (d) {
              var retryAfter = Number(d.retry_after || 1) * 1000;
              var err = new Error(d.error || 'rate limited');
              err.code = 429;
              err.retryAfter = retryAfter;
              throw err;
            });
          }
          if (!res.ok) {
            throw new Error('segment HTTP ' + res.status);
          }

          var durationMs = Number(res.headers.get('X-TL3-Segment-Duration-Ms') || SEGMENT_DURATION_MS_DEFAULT);
          var rawOffset = Number(res.headers.get('X-TL3-Payload-Offset') || 0);
          var remaining = Number(res.headers.get('X-TL3-Remaining-TL') || 0);
          var nextSeg = Number(res.headers.get('X-TL3-Next-Segment') || (index + 1));

          return res.arrayBuffer().then(function (buf) {
            return {
              buf: buf,
              durationMs: durationMs,
              rawOffset: rawOffset,
              remaining: remaining,
              nextSeg: nextSeg,
              index: index
            };
          });
        });
      }

      function runAttempt() {
        return doFetch().catch(function (err) {
          if (isStale()) throw err;
          if (err.code === 402) throw err;   // TL 부족은 재시도 안 함
          if (err.code === 409) {
            // pending 미정산 → confirm 강제 후 재시도
            log('409 → confirm 강제 후 재시도');
            return confirmPending(true).then(function () {
              return new Promise(function (r) { setTimeout(r, 300); }).then(runAttempt);
            });
          }
          if (err.code === 429) {
            log('429 → retry_after', err.retryAfter, 'ms');
            return new Promise(function (r) { setTimeout(r, err.retryAfter || 1000); }).then(runAttempt);
          }
          if (attempt >= MAX_SEGMENT_RETRIES) throw err;
          attempt++;
          var delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1);
          log('retry segment', index, 'attempt', attempt, 'in', delay, 'ms', err.message);
          return new Promise(function (r) { setTimeout(r, delay); }).then(runAttempt);
        });
      }

      return runAttempt().then(function (item) {
        if (isStale()) return;
        if (!item) return; // EOF

        // XOR 복호화 (rawOffset 기반 — TL3 포맷 규칙 그대로)
        var enc = new Uint8Array(item.buf);
        var out = new Uint8Array(enc.length);
        for (var i = 0; i < enc.length; i++) {
          out[i] = enc[i] ^ keyBytes[(item.rawOffset + i) % keyBytes.length];
        }

        // pending 상태 기록
        pendingDurationSec = item.durationMs / 1000;
        pendingReserved = pendingDurationSec;

        if (opts.onBuffer) {
          try {
            opts.onBuffer({
              segment: item.index,
              durationMs: item.durationMs,
              remaining: item.remaining,
              bufferedSeconds: getBufferedAhead(),
              downloaded: true
            });
          } catch (e) {}
        }

        // 다음 세그먼트 인덱스 갱신
        segmentIndex = item.nextSeg;

        // append
        appendSegment(out, item);
      }).catch(function (err) {
        if (isStale()) return;
        log('segment fetch failed permanently:', err.message);
        // TL 부족이면 UI에 알림
        if (err.code === 402 && opts.onError) {
          try { opts.onError(err); } catch (e) {}
        }
        if (!eofReached) openedReject(err);
      });
    }

    // -------- append (SourceBuffer 순차) --------
    function appendSegment(bytes, item) {
      if (stopped || isStale() || !sb) return;
      if (appendBusy || sb.updating) {
        // 이전 append 완료 후 재시도 (실제로는 rate limit 때문에 발생 안 함)
        setTimeout(function () { appendSegment(bytes, item); }, 50);
        return;
      }

      appendBusy = true;
      var handleEnd = function () {
        sb.removeEventListener('updateend', handleEnd);
        sb.removeEventListener('error', handleError);
        appendBusy = false;
        if (isStale()) return;

        // 첫 세그먼트 append 완료 → 재생 개방
        if (item.index === 0) {
          log('segment 0 appended → opened');
          openedResolve({ decoded: true, segmented: true, objectUrl: objectUrl });
        }

        // 다음 세그먼트 트리거 예약 (confirm 타이밍 = duration - 1000ms)
        var waitMs = Math.max(RATE_LIMIT_MS, item.durationMs - CONFIRM_MARGIN_MS);
        clearNextTimer();
        nextTimer = setTimeout(function () {
          if (isStale()) return;
          if (player.paused) {
            // 일시정지 중이면 confirm만 하고 다음 요청은 resume 시
            log('paused: confirm only');
            confirmPending(true).catch(function () {});
            return;
          }
          // confirm → 다음 세그먼트 요청
          confirmPending(true).then(function () {
            if (isStale()) return;
            requestNextSegment();
          }).catch(function (err) {
            log('confirm failed, still trying next:', err.message);
            if (isStale()) return;
            requestNextSegment();
          });
        }, waitMs);
      };
      var handleError = function (e) {
        sb.removeEventListener('updateend', handleEnd);
        sb.removeEventListener('error', handleError);
        appendBusy = false;
        log('append error', e);
        if (!isStale()) openedReject(e);
      };

      sb.addEventListener('updateend', handleEnd);
      sb.addEventListener('error', handleError);
      try {
        sb.appendBuffer(bytes);
      } catch (e) {
        sb.removeEventListener('updateend', handleEnd);
        sb.removeEventListener('error', handleError);
        appendBusy = false;
        log('appendBuffer threw', e);
        if (!isStale()) openedReject(e);
      }
    }

    // -------- MediaSource 초기화 --------
    ms.addEventListener('sourceopen', function onOpen() {
      ms.removeEventListener('sourceopen', onOpen);
      try {
        sb = ms.addSourceBuffer('audio/mpeg');
        sb.mode = 'sequence';
      } catch (e) {
        openedReject(e);
        return;
      }

      // 첫 세그먼트 요청
      lastSegmentAt = 0;   // rate limit 우회 (첫 요청은 즉시)
      fetchSegment(0);
    });

    // -------- pause / ended / timeupdate --------
    function onPause() {
      // 일시정지 시 confirm
      clearNextTimer();
      confirmPending(true).catch(function () {});
    }
    function onEnded() {
      clearNextTimer();
      confirmPending(true).catch(function () {});
    }

    player.addEventListener('pause', onPause);
    player.addEventListener('ended', onEnded);

    // -------- 공개 인터페이스 --------
    player._tl3ResumeSegments = function () {
      if (isStale() || eofReached) return;
      // resume 시 confirm 후 다음 세그먼트 요청
      confirmPending(false).then(function () {
        if (isStale()) return;
        requestNextSegment();
      }).catch(function () {
        if (isStale()) return;
        requestNextSegment();
      });
    };
    player._tl3Confirm = function () { return confirmPending(true); };
    player._tl3SegmentStop = function () {
      stopped = true;
      streamSegmented._gen++;   // 이후 요청 무효화
      clearNextTimer();
      try {
        player.removeEventListener('pause', onPause);
        player.removeEventListener('ended', onEnded);
      } catch (e) {}
      try { if (ms.readyState === 'open') ms.endOfStream(); } catch (e) {}
      setTimeout(function () {
        try { URL.revokeObjectURL(objectUrl); } catch (e) {}
      }, 100);
    };

    return opened;
  }

  // ─────────────────────────────────────
  // streamBlob — 세그먼트를 순차로 모두 받아서 Blob URL로 재생
  // Chrome MSE audio/mpeg 미지원 우회
  // ─────────────────────────────────────
  function streamBlob(audioEl, baseUrl, opts) {
    opts = opts || {};
    var player = createPlayer(audioEl);
    var fetchOptions = opts.fetchOptions || {};
    if (!opts.sessionId) return Promise.reject(new Error('TL3 재생 세션이 필요합니다.'));

    var fileIdMatch = baseUrl.match(/\/segment\/([^/?#]+)/);
    var fileId = fileIdMatch ? fileIdMatch[1] : '';
    if (!fileId) return Promise.reject(new Error('TL3 segment URL에서 fileId를 찾을 수 없습니다.'));
    var confirmBase = baseUrl.replace(/\/segment\/[^/?#]+.*$/, '/segment/confirm/' + fileId);

    var generation = (streamBlob._gen = (streamBlob._gen || 0) + 1);
    var stopped = false;
    function isStale() { return stopped || generation !== streamBlob._gen; }

    var allChunks = [];
    var segmentIndex = 0;
    var maxSegments = opts.maxSegments || 10000;

    function fetchOne(idx) {
      if (isStale()) return Promise.reject(new Error('stale'));
      if (idx >= maxSegments) return Promise.resolve();

      var url = baseUrl + '?segment=' + idx + '&session_id=' + encodeURIComponent(opts.sessionId);
      log('blob fetch segment', idx);

      return fetch(url, fetchOptions).then(function(res) {
        if (res.status === 416) {
          // 재생 종료
          return { done: true };
        }
        if (!res.ok) {
          return res.json().catch(function(){ return {}; }).then(function(d){
            throw new Error('segment HTTP ' + res.status + ' ' + (d.error || ''));
          });
        }
        var durationMs = Number(res.headers.get('X-TL3-Segment-Duration-Ms') || 0);
        return res.arrayBuffer().then(function(buf){
          if (isStale()) return { done: true };
          allChunks.push(new Uint8Array(buf));
          if (opts.onSegment) {
            try { opts.onSegment({ index: idx, durationMs: durationMs }); } catch (e) {}
          }
          // confirm 전송
          return confirmSegment(confirmBase, opts.sessionId, idx, durationMs, fetchOptions).then(function(){
            return { done: false, next: idx + 1 };
          });
        });
      });
    }

    function confirmSegment(confirmBase, sessionId, segIdx, durationMs, fetchOptions) {
      var playedSec = Math.max(0, (durationMs || 0) / 1000);
      return fetch(confirmBase, {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, fetchOptions.headers || {}),
        body: JSON.stringify({ session_id: sessionId, played_seconds: playedSec })
      }).then(function(r){
        return r.json().catch(function(){ return {}; });
      }).then(function(d){
        if (opts.onConfirm) {
          try { opts.onConfirm({ index: segIdx, response: d }); } catch(e) {}
        }
        return d;
      }).catch(function(){ return {}; });
    }

    function loop() {
      return fetchOne(segmentIndex).then(function(r){
        if (r && r.done) return;
        segmentIndex = r.next;
        // 4초 rate limit
        return new Promise(function(resolve){ setTimeout(resolve, 4000); }).then(loop);
      });
    }

    return loop().then(function(){
      if (isStale()) throw new Error('stale');
      // 전체 세그먼트 Blob 만들기
      var total = allChunks.reduce(function(n, c){ return n + c.length; }, 0);
      var merged = new Uint8Array(total);
      var off = 0;
      for (var i = 0; i < allChunks.length; i++) { merged.set(allChunks[i], off); off += allChunks[i].length; }
      var blobUrl = URL.createObjectURL(new Blob([merged], { type: 'audio/mpeg' }));
      _setSrc(player, blobUrl);
      return { decoded: true, blob: true, objectUrl: blobUrl };
    });
  }

  global.TL3 = {
    XOR_KEY: XOR_KEY,
    parse: parse,
    build: build,
    toMp3Blob: toMp3Blob,
    createPlayer: createPlayer,
    play: play,
    attach: attach,
    streamSegmented: streamSegmented,
    streamBlob: streamBlob,
    resolveUrl: resolveUrl,
    stop: stop
  };
})(typeof window !== 'undefined' ? window : this);