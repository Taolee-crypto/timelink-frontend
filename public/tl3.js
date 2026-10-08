/*! tl3.js — TimeLink TL3 v3 재생 클라이언트
 *  서버: /api/v1/tl3/segment/:id (v3, 평문 MP3 세그먼트)
 *  재생: MediaSource API
 */
(function(global){
  'use strict';
  var API = (typeof window !== 'undefined' && window.TL3_API_BASE) || 'https://api.timelink.digital';

  function genSid(){
    return 'tl3_' + Date.now() + '_' + Math.random().toString(36).slice(2,10);
  }

  function _initMediaSource(audio, segBaseUrl, opts){
    opts = opts || {};
    var fileId = String(segBaseUrl).split('/').pop().split('?')[0];
    var sessionId = opts.sessionId || genSid();
    var authHeaders = (opts.fetchOptions && opts.fetchOptions.headers) || {};
    var onSegment = opts.onSegment || function(){};
    var onError = opts.onError || function(){};
    var apiBase = opts.apiBase || API;

    var ms = new MediaSource();
    var msUrl = URL.createObjectURL(ms);
    var sb = null;
    var segIndex = 0;
    var stopped = false;
    var confirmTimers = [];

    function stopAll(){
      stopped = true;
      confirmTimers.forEach(function(t){ clearTimeout(t); });
      confirmTimers = [];
    }

    function confirm(segIndexVal, durationMs){
      var url = apiBase + '/api/v1/tl3/segment/confirm/' + encodeURIComponent(fileId);
      fetch(url, {
        method: 'POST',
        headers: Object.assign({}, authHeaders, {'Content-Type':'application/json'}),
        body: JSON.stringify({session_id: sessionId, played_seconds: durationMs/1000})
      }).catch(function(){});
    }

    function fetchNext(){
      if(stopped) return;
      var url = segBaseUrl + '?segment=' + segIndex + '&session_id=' + encodeURIComponent(sessionId);
      fetch(url, {headers: authHeaders})
        .then(function(r){
          if(r.status === 416){
            try { if(ms.readyState === 'open') ms.endOfStream(); } catch(e){}
            return null;
          }
          if(r.status === 429){
            var retry = Number(r.headers.get('Retry-After') || 4);
            setTimeout(fetchNext, (retry+0.5)*1000);
            return null;
          }
          if(!r.ok){
            return r.json().then(function(j){
              var e = new Error(j.error || ('segment ' + r.status));
              onError(e);
              throw e;
            }).catch(function(){ return null; });
          }
          return r.arrayBuffer().then(function(buf){
            return {
              bytes: new Uint8Array(buf),
              durationMs: Number(r.headers.get('X-TL3-Segment-Duration-Ms') || 5000),
              remaining: Number(r.headers.get('X-TL3-Remaining-TL') || 0),
              index: Number(r.headers.get('X-TL3-Segment-Index') || segIndex),
              next: Number(r.headers.get('X-TL3-Next-Segment') || (segIndex+1))
            };
          });
        })
        .then(function(seg){
          if(!seg || stopped) return;
          onSegment({
            index: seg.index,
            seconds: seg.durationMs / 1000,
            remaining: seg.remaining
          });
          var appendDone = new Promise(function(res){
            var h = function(){ sb.removeEventListener('updateend', h); res(); };
            sb.addEventListener('updateend', h);
            sb.appendBuffer(seg.bytes);
          });
          appendDone.then(function(){
            var timer = setTimeout(function(){ confirm(seg.index, seg.durationMs); }, seg.durationMs);
            confirmTimers.push(timer);
            segIndex = seg.next;
            fetchNext();
          });
        })
        .catch(function(e){
          if(onError) onError(e);
        });
    }

    ms.addEventListener('sourceopen', function(){
      try {
        sb = ms.addSourceBuffer('audio/mpeg');
      } catch(e){
        if(onError) onError(e);
        return;
      }
      fetchNext();
    });

    audio._tl3Stop = stopAll;
    audio._tl3SessionId = sessionId;
    return { msUrl: msUrl, sessionId: sessionId, stop: stopAll };
  }

  function resolveUrl(fileUrl, opts){
    return new Promise(function(resolve, reject){
      try {
        var ms = new MediaSource();
        var msUrl = URL.createObjectURL(ms);
        var fileId = String(fileUrl).split('/').pop().split('?')[0];
        var sessionId = (opts && opts.sessionId) || genSid();
        var authHeaders = (opts && opts.fetchOptions && opts.fetchOptions.headers) || {};
        var apiBase = (opts && opts.apiBase) || API;

        var sb = null, segIndex = 0, stopped = false;

        ms.addEventListener('sourceopen', function(){
          sb = ms.addSourceBuffer('audio/mpeg');
          fetchNext();
        });

        function fetchNext(){
          if(stopped) return;
          var url = fileUrl + '?segment=' + segIndex + '&session_id=' + encodeURIComponent(sessionId);
          fetch(url, {headers: authHeaders})
            .then(function(r){
              if(r.status === 416){
                try { if(ms.readyState === 'open') ms.endOfStream(); } catch(e){}
                return null;
              }
              if(r.status === 429){ setTimeout(fetchNext, 4500); return null; }
              if(!r.ok){ return null; }
              return r.arrayBuffer().then(function(buf){
                return {
                  bytes: new Uint8Array(buf),
                  durationMs: Number(r.headers.get('X-TL3-Segment-Duration-Ms') || 5000),
                  remaining: Number(r.headers.get('X-TL3-Remaining-TL') || 0),
                  index: Number(r.headers.get('X-TL3-Segment-Index') || segIndex),
                  next: Number(r.headers.get('X-TL3-Next-Segment') || (segIndex+1))
                };
              });
            })
            .then(function(seg){
              if(!seg || stopped) return;
              if(opts && opts.onSegment){
                opts.onSegment({
                  index: seg.index,
                  seconds: seg.durationMs / 1000,
                  remaining: seg.remaining
                });
              }
              var appendDone = new Promise(function(res){
                var h = function(){ sb.removeEventListener('updateend', h); res(); };
                sb.addEventListener('updateend', h);
                sb.appendBuffer(seg.bytes);
              });
              appendDone.then(function(){
                setTimeout(function(){
                  fetch(apiBase + '/api/v1/tl3/segment/confirm/' + encodeURIComponent(fileId), {
                    method: 'POST',
                    headers: Object.assign({}, authHeaders, {'Content-Type':'application/json'}),
                    body: JSON.stringify({session_id: sessionId, played_seconds: seg.durationMs/1000})
                  }).catch(function(){});
                }, seg.durationMs);
                segIndex = seg.next;
                fetchNext();
              });
            })
            .catch(function(){});
        }

        resolve(msUrl);
      } catch(e){
        reject(e);
      }
    });
  }

  function streamSegmented(audio, segUrl, opts){
    return new Promise(function(resolve){
      var ctx = _initMediaSource(audio, segUrl, opts);
      audio.src = ctx.msUrl;
      resolve({ decoded: true, sessionId: ctx.sessionId });
    });
  }

  function stop(audio){
    if(audio && audio._tl3Stop) audio._tl3Stop();
    try { audio.pause(); audio.src = ''; } catch(e){}
  }

  global.TL3 = {
    resolveUrl: resolveUrl,
    streamSegmented: streamSegmented,
    stop: stop,
    version: 'v3'
  };
})(window);
