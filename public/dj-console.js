/* DJ 콘솔 로직
 * - 상태 폴링 (5초)
 * - 방송 시작/다음/종료
 * - 자동 진행 (onended → next)
 * - 프리페치 (다음 곡 미리 다운)
 */
(function(){
'use strict';

var API = 'https://api.timelink.digital';
var _token = localStorage.getItem('tl_token') || '';
var _djId = null;
var _setData = null;            // broadcast_set
var _currentIdx = 0;
var _currentTrackId = null;
var _setLength = 0;
var _pollTimer = null;
var _prefetchCache = {};        // trackId -> blobUrl
var _prefetching = false;
var _playing = false;
var _audio = null;
var _progressTimer = null;
var _advancing = false;         // next 중복 방지

function g(id){ return document.getElementById(id); }

function toast(msg, type){
  var t = g('toast');
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(t._t);
  t._t = setTimeout(function(){ t.className = 'toast'; }, 2500);
}

function authHeaders(extra){
  var h = {'Authorization':'Bearer '+_token};
  if(extra) for(var k in extra) h[k] = extra[k];
  return h;
}

async function api(path, opts){
  opts = opts || {};
  opts.headers = authHeaders(opts.headers || {});
  var r = await fetch(API + path, opts);
  var d = await r.json().catch(function(){ return {ok:false, error:'HTTP '+r.status}; });
  return d;
}

/* ─── 로그인 확인 ─── */
if(!_token){
  g('loginWarn').style.display = 'block';
  return;
}
g('main').style.display = 'flex';
g('userInfo').textContent = '로그인됨';

_audio = g('djAudio');

/* ─── 세트 로드 ─── */
async function loadSet(){
  var d = await api('/api/dj-cafe/broadcast-set');
  if(!d.ok || !d.set){
    g('setCount').textContent = '세트 없음';
    g('setList').innerHTML = '<div style="padding:20px;color:var(--t3);font-size:13px">방송 세트가 없습니다.</div>';
    return;
  }
  _setData = d.set;
  _setLength = (_setData.tracks || []).length;
  g('setCount').textContent = _setLength + '곡';
  renderSetList();
}

function renderSetList(){
  if(!_setData || !_setData.tracks) return;
  var html = '';
  var details = _setData.track_details || [];
  for(var i = 0; i < _setData.tracks.length; i++){
    var id = _setData.tracks[i];
    var info = details[i] || {id:id, title:id};
    var isCur = (i === _currentIdx);
    html += '<div class="set-item' + (isCur ? ' current' : '') + '" data-idx="' + i + '">'
      + '<span class="set-num">' + (i+1) + '</span>'
      + '<div class="set-info">'
      +   '<div class="set-name">' + escapeHtml(info.title || id) + '</div>'
      +   '<div class="set-artist">' + escapeHtml(info.artist || '') + '</div>'
      + '</div>'
      + (isCur ? '<span class="set-badge playing">▶ NOW</span>' : '')
      + '</div>';
  }
  g('setList').innerHTML = html;
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

/* ─── 상태 폴링 ─── */
async function pollStatus(){
  try {
    var s = await api('/api/dj-cafe/broadcast/status');
    if(!s.ok || !s.live){
      setLiveUI(false);
      return;
    }
    var live = s.live;
    _djId = live.id;
    _currentIdx = Number(live.live_current_track_idx || 0);
    setLiveUI(!!live.is_live, live.live_listener_count || 0);

    var now = await api('/api/dj-cafe/live/' + _djId + '/now');
    if(now.ok && now.current_track){
      var t = now.current_track;
      if(t.id !== _currentTrackId){
        _currentTrackId = t.id;
        g('trackTitle').textContent = t.title || 'Unknown';
        g('trackArtist').textContent = (t.artist || '') + (t.category ? ' · ' + t.category : '');
        renderSetList();
        playTrack(t);
      }
      updateNowPlaying(t);
    } else {
      g('trackTitle').textContent = '방송 대기 중';
      g('trackArtist').textContent = '-';
      g('status').textContent = now.is_live === false ? '방송 중 아님' : '곡 없음';
    }
  } catch(e){
    console.warn('[poll]', e);
  }
}

function updateNowPlaying(t){
  if(!t) return;
  var idx = _currentIdx;
  g('trackIdx').textContent = (idx+1) + '/' + _setLength;
}

function setLiveUI(isLive, listeners){
  var b = g('liveBadge');
  var txt = g('liveText');
  if(isLive){
    b.classList.remove('off');
    txt.textContent = 'LIVE';
    if(listeners !== undefined) txt.textContent = 'LIVE · ' + listeners + '명';
  } else {
    b.classList.add('off');
    txt.textContent = 'OFFLINE';
  }
  g('btnStart').disabled = isLive;
  g('btnNext').disabled = !isLive;
  g('btnStop').disabled = !isLive;
}

/* ─── 재생 ─── */
async function playTrack(t){
  var status = g('status');
  _playing = false;
  try {
    status.textContent = '⏳ 파일 준비 중...';
    var t0 = Date.now();

    var playable;
    // 프리페치 캐시 확인
    if(_prefetchCache[t.id]){
      playable = _prefetchCache[t.id];
      delete _prefetchCache[t.id];
      status.textContent = '⚡ 캐시에서 즉시 로드';
    } else {
      playable = await TL3.resolveUrl(t.stream_url, {
        fetchOptions: {},
        onProgress: function(recv, total){
          var pct = total ? Math.round(recv/total*100) : 0;
          var mb = (recv/1048576).toFixed(1);
          var totalMb = total ? (total/1048576).toFixed(1) : '?';
          status.textContent = '⏳ ' + pct + '% (' + mb + '/' + totalMb + 'MB)';
        }
      });
    }
    var dt = ((Date.now() - t0)/1000).toFixed(1);

    _audio.src = playable;
    _audio.load();
    _audio.muted = true;   // ⭐ DJ 콘솔은 무음 재생 (청취자 팝업과 소리 겹침 방지)

    _audio.onended = function(){
      console.log('[DJ] onended', t.id);
      _playing = false;
      if(g('autoAdvance').checked){
        status.textContent = '⏭ 곡 종료 → 자동 진행';
        nextTrack();
      } else {
        status.textContent = '⏭ 곡 종료 (자동 진행 OFF)';
      }
    };

    _audio.onerror = function(e){
      status.textContent = '⚠️ 오디오 오류';
      _playing = false;
    };

    await _audio.play();
    _playing = true;
    status.textContent = '✅ 재생 중 (' + dt + 's 로드)';
    startProgressTimer();

    // 프리페치
    prefetchNext();
  } catch(e){
    console.error('[play]', e);
    status.textContent = '⚠️ 재생 실패: ' + (e.message || '');
  }
}

function startProgressTimer(){
  if(_progressTimer) clearInterval(_progressTimer);
  _progressTimer = setInterval(function(){
    var a = _audio;
    if(!a.duration || !isFinite(a.duration)) return;
    var pct = Math.min(100, (a.currentTime / a.duration) * 100);
    g('progressFill').style.width = pct + '%';
  }, 500);
}

/* ─── 프리페치 ─── */
async function prefetchNext(){
  if(_prefetching || !_setLength) return;
  _prefetching = true;
  try {
    var nextIdx = (_currentIdx + 1) % _setLength;
    var nextId = _setData && _setData.tracks && _setData.tracks[nextIdx];
    if(!nextId) return;
    if(_prefetchCache[nextId]) return;
    
    // 다음 곡 정보 필요 — track_details 에서 stream_url 확인
    var info = null;
    if(_setData.track_details){
      for(var i = 0; i < _setData.track_details.length; i++){
        if(_setData.track_details[i].id === nextId){ info = _setData.track_details[i]; break; }
      }
    }
    if(!info || !info.stream_url) return;
    
    // 백그라운드 다운로드 (진행률 표시 X)
    console.log('[prefetch]', nextId, info.title);
    var blobUrl = await TL3.resolveUrl(info.stream_url, { fetchOptions: {} });
    _prefetchCache[nextId] = blobUrl;
    console.log('[prefetch] ready:', nextId);
  } catch(e){
    console.warn('[prefetch]', e);
  } finally {
    _prefetching = false;
  }
}

/* ─── 컨트롤 ─── */
async function startBroadcast(){
  var d = await api('/api/dj-cafe/broadcast/start', { method:'POST' });
  if(d.ok){ toast('방송 시작', 's'); _currentTrackId = null; pollStatus(); }
  else toast('시작 실패: ' + (d.error || ''), 'e');
}

async function nextTrack(){
  if(_advancing) return;
  _advancing = true;
  try {
    var d = await api('/api/dj-cafe/broadcast/next', { method:'POST' });
    if(d.ok){
      toast('다음 곡', 's');
      // ⭐ 즉시 다음 곡 재생 (폴링 대기 X, 백그라운드 탭 대응)
      if(_djId){
        var now = await api('/api/dj-cafe/live/' + _djId + '/now');
        if(now.ok && now.current_track && now.current_track.id !== _currentTrackId){
          _currentTrackId = now.current_track.id;
          g('trackTitle').textContent = now.current_track.title || 'Unknown';
          g('trackArtist').textContent = (now.current_track.artist || '') + (now.current_track.category ? ' · ' + now.current_track.category : '');
          _currentIdx = (_currentIdx + 1) % (_setLength || 1);
          renderSetList();
          playTrack(now.current_track);
        }
      }
    } else {
      toast('실패: ' + (d.error || ''), 'e');
    }
  } finally {
    setTimeout(function(){ _advancing = false; }, 1000);
  }
}

async function stopBroadcast(){
  if(!confirm('방송을 종료하시겠습니까?')) return;
  var d = await api('/api/dj-cafe/broadcast/stop', { method:'POST' });
  if(d.ok){ toast('방송 종료', 's'); try{ _audio.pause(); }catch(e){} }
  else toast('실패: ' + (d.error || ''), 'e');
}

function onAutoToggle(){
  var on = g('autoAdvance').checked;
  g('autoWrap').className = 'toggle-wrap' + (on ? ' on' : '');
  localStorage.setItem('dj_auto_advance', on ? '1' : '0');
}

/* ─── 초기화 ─── */
(async function init(){
  // 자동 진행 토글 복원
  var saved = localStorage.getItem('dj_auto_advance');
  if(saved === '1'){ g('autoAdvance').checked = true; onAutoToggle(); }

  await loadSet();
  await pollStatus();

  _pollTimer = setInterval(pollStatus, 5000);
  console.log('[dj-console] ready');
})();

// 전역 노출 (HTML onclick 용)
window.startBroadcast = startBroadcast;
window.nextTrack = nextTrack;
window.stopBroadcast = stopBroadcast;
window.onAutoToggle = onAutoToggle;

})();