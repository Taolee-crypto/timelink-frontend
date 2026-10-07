/*!
 * TimeLink TL3 client library
 * ----------------------------------------------------------------------------
 * Decodes .tl3 (TLNK v2) containers and plays them inside the browser.
 *
 *   <script src="/tl3.js"></script>
 *   <script>
 *     const audio = TL3.createPlayer(document.getElementById('player'));
 *     await TL3.play(audio, '/api/stream/tl3_123_ab');   // decodes + plays
 *   </script>
 *
 * TL3 layout (matches server/server.js and public/creator.html):
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
    // decode UTF-8 metadata
    try {
      metaText = decodeURIComponent(
        Array.prototype.map
          .call(bytes.subarray(7, 7 + mlen), function (b) {
            return '%' + ('00' + b.toString(16)).slice(-2);
          })
          .join('')
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

  /**
   * Ensure the given audio element starts playing. Uses the object URL created
   * for the decoded mp3 and revokes the previous one to avoid leaks.
   */
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

  /**
   * Fetch a TL3 stream URL, decode it, and (optionally) play.
   * @returns Promise<{meta, blob}>
   */
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

  /**
   * Attach a stream URL to an audio element, transparently decoding TL3.
   * Fetches the URL, checks for the TLNK magic, and if the response is a TL3
   * container it XOR-decodes the payload into an mp3 Blob URL before assigning
   * it. Plain mp3 / http(s) URLs are assigned directly.
   *
   * @returns Promise<{decoded:boolean, meta?:object}>
   */
  function attach(audioEl, url, opts) {
    opts = opts || {};
    var player = createPlayer(audioEl);

    // Non-fetchable or cross-origin blob/data URLs → assign directly.
    function direct() {
      _setSrc(player, url);
      return { decoded: false };
    }

    return fetch(url, opts.fetchOptions || {})
      .then(function (res) {
        if (!res.ok) throw new Error('stream HTTP ' + res.status);
        return res.arrayBuffer();
      })
      .then(function (buf) {
        var bytes = new Uint8Array(buf);
        var isTl3 =
          bytes.length >= 7 &&
          bytes[0] === MAGIC[0] && bytes[1] === MAGIC[1] &&
          bytes[2] === MAGIC[2] && bytes[3] === MAGIC[3];
        if (!isTl3) {
          // Plain audio served over HTTP — hand the raw URL to the element.
          _setSrc(player, url);
          return { decoded: false };
        }
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

  /**
   * Resolve any audio URL to something an <audio> element can play.
   * If the URL points at a TL3 container it is fetched, decoded, and a fresh
   * Blob URL to the inner mp3 is returned. Otherwise the URL is returned as-is.
   *
   * This is the side-effect-free primitive used to retrofit existing players:
   *
   *   TL3.resolveUrl(url).then(function(playable){
   *     audio.src = playable; audio.load(); audio.play();
   *   });
   *
   * @param {string} url
   * @param {object} [opts] { fetchOptions, force }
   * @returns Promise<string> playable URL
   */
  function resolveUrl(url, opts) {
    opts = opts || {};
    if (!url || typeof url !== 'string') return Promise.resolve(url);
    // Already a local blob/data URL — nothing to decode.
    if (/^(blob:|data:)/i.test(url)) return Promise.resolve(url);
    // Same-origin relative stream endpoint or explicit tl3 marker → decode.
    return fetch(url, opts.fetchOptions || {})
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        // ⭐ onProgress 콜백이 있으면 스트리밍으로 진행률 보고
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
        var isTl3 =
          bytes.length >= 7 &&
          bytes[0] === MAGIC[0] && bytes[1] === MAGIC[1] &&
          bytes[2] === MAGIC[2] && bytes[3] === MAGIC[3];
        if (!isTl3) return url; // plain audio
        var parsed = parse(buf);
        return URL.createObjectURL(new Blob([parsed.audio], { type: 'audio/mpeg' }));
      })
      .catch(function () {
        // On any failure, fall back to the original URL (the browser will
        // surface its own error if it truly cannot play).
        return url;
      });
  }

  /** Stop playback and release the object URL. */
  function stop(audioEl) {
    if (!audioEl) return;
    try { audioEl.pause(); } catch (e) {}
    if (audioEl._tl3ObjectUrl) {
      try { URL.revokeObjectURL(audioEl._tl3ObjectUrl); } catch (e) {}
      audioEl._tl3ObjectUrl = null;
    }
  }


  // Stream TL3 in bounded authenticated ranges through MediaSource.
  // The browser never receives the complete TL3 container in one response.
  function streamSegmented(audioEl, baseUrl, opts) {
    opts = opts || {};
    var player = createPlayer(audioEl);
    var fetchOptions = opts.fetchOptions || {};
    if (!global.MediaSource || !MediaSource.isTypeSupported('audio/mpeg')) {
      return Promise.reject(new Error('이 브라우저는 TL3 시간 세그먼트 재생을 지원하지 않습니다.'));
    }
    if (!opts.sessionId) return Promise.reject(new Error('TL3 재생 세션이 필요합니다.'));
    var ms = new MediaSource();
    var objectUrl = URL.createObjectURL(ms);
    _setSrc(player, objectUrl);
    var stopped = false, segmentIndex = 0;
    var confirmedDuration = 0, pendingDuration = 0, confirmBusy = false;
    var openedResolve, openedReject;
    var opened = new Promise(function(resolve,reject){ openedResolve=resolve; openedReject=reject; });

    function confirmPending(force) {
      if (confirmBusy || pendingDuration <= 0 || stopped) return Promise.resolve();
      var played = Math.max(0, Math.min(pendingDuration, player.currentTime - confirmedDuration));
      if (!force && played < Math.min(0.25, pendingDuration)) return Promise.resolve();
      confirmBusy = true;
      var url=baseUrl.replace('/segment/','/segment/confirm/')+(baseUrl.indexOf('?')>=0?'&':'?');
      return fetch(url,{
        method:'POST',
        headers:Object.assign({'Content-Type':'application/json'},fetchOptions.headers||{}),
        body:JSON.stringify({session_id:opts.sessionId,played_seconds:Number(played.toFixed(3))})
      }).then(function(r){return r.json().then(function(d){if(!r.ok||!d.ok) throw new Error(d.error||('confirm HTTP '+r.status));return d;});})
      .then(function(d){
        confirmedDuration += Number(d.played_seconds||0);
        pendingDuration = 0;
        if(opts.onSegment) opts.onSegment({
          seconds:Number(d.played_seconds||0),
          durationMs:Number(d.played_seconds||0)*1000,
          remaining:Number(d.remaining_tl||0),
          segment:Number(d.segment||0),
          refunded:Number(d.refund||0)
        });
      }).finally(function(){confirmBusy=false;});
    }

    ms.addEventListener('sourceopen', function onOpen() {
      ms.removeEventListener('sourceopen', onOpen);
      var sb;
      try { sb=ms.addSourceBuffer('audio/mpeg'); sb.mode='sequence'; }
      catch(e) { openedReject(e); return; }

      function appendSegment() {
        if (stopped || (segmentIndex > 0 && player.paused)) return;
        var url=baseUrl+(baseUrl.indexOf('?')>=0?'&':'?')+
          'segment='+segmentIndex+'&session_id='+encodeURIComponent(opts.sessionId);
        fetch(url,fetchOptions).then(function(res){
          if(res.status===416){try{if(ms.readyState==='open')ms.endOfStream();}catch(e){}return null;}
          if(!res.ok) throw new Error('segment HTTP '+res.status);
          var durationMs=Number(res.headers.get('X-TL3-Segment-Duration-Ms')||5000);
          var rawOffset=Number(res.headers.get('X-TL3-Payload-Offset')||0);
          var remaining=Number(res.headers.get('X-TL3-Remaining-TL')||0);
          return res.arrayBuffer().then(function(buf){return {buf:buf,durationMs:durationMs,rawOffset:rawOffset,remaining:remaining};});
        }).then(function(item){
          if(!item||stopped)return;
          var enc=new Uint8Array(item.buf),out=new Uint8Array(enc.length);
          for(var i=0;i<enc.length;i++)out[i]=enc[i]^keyBytes[(item.rawOffset+i)%keyBytes.length];
          pendingDuration=item.durationMs/1000;
          var thisSegment=segmentIndex++;
          if(opts.onBuffer)opts.onBuffer({durationMs:item.durationMs,remaining:item.remaining,segment:thisSegment});
          function onEnd(){
            sb.removeEventListener('updateend',onEnd);
            if(thisSegment===0)openedResolve({decoded:true,segmented:true,objectUrl:objectUrl});
            if(stopped)return;
            setTimeout(function(){
              confirmPending(false).then(function(){
                if(!stopped&&!player.paused) appendSegment();
              }).catch(function(e){if(!stopped)openedReject(e);});
            },Math.max(4200,item.durationMs-500));
          }
          sb.addEventListener('updateend',onEnd);
          sb.appendBuffer(out);
        }).catch(function(err){if(!stopped)openedReject(err);});
      }
      appendSegment();
      player._tl3ResumeSegments=function(){
        if(stopped)return;
        confirmPending(false).then(function(){if(!stopped&&!player.paused)appendSegment();});
      };
      player._tl3Confirm=function(){return confirmPending(true);};
    });
    player.addEventListener('pause',function(){confirmPending(true).catch(function(){});});
    player.addEventListener('ended',function(){confirmPending(true).catch(function(){});});
    player._tl3SegmentStop=function(){
      stopped=true;
      try{if(ms.readyState==='open')ms.endOfStream();}catch(e){}
      try{URL.revokeObjectURL(objectUrl);}catch(e){}
    };
    return opened;
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
    resolveUrl: resolveUrl,
    stop: stop
  };
})(typeof window !== 'undefined' ? window : this);
