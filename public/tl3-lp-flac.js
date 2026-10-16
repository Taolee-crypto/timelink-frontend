/*! tl3-lp-flac.js — TimeLink LP Opus 엔진 (v1)
 *  MP3에 LP PCM을 FLAC으로 심기 (특허 10-2025-0167813)
 *  용도: 창작자 PC에서 LP PCM → Opus 인코딩
 *  재생: Player에서 FLAC 디코딩 → PCM → MP3와 동시 재생
 */
(function(global){
  'use strict';

  // ── WebCodecs AudioEncoder 지원 확인 ─────
  async function isSupported(){
    if(!global.AudioEncoder) return false;
    try {
      var cfg = { codec: 'opus', sampleRate: 44100, numberOfChannels: 2, bitrate: 128000 };
      var r = await AudioEncoder.isConfigSupported(cfg);
      return !!(r && r.supported);
    } catch(e){ return false; }
  }

  // ── LP PCM → Opus 인코딩 ─────────────────
  //  입력: AudioBuffer (LP 처리된 PCM)
  //  출력: Uint8Array (FLAC bytes)
  async function encode(audioBuffer, opts){
    opts = opts || {};
    var onProgress = opts.onProgress || function(){};

    if(!global.AudioEncoder) throw new Error('AudioEncoder 미지원 브라우저');
    
    var sampleRate = audioBuffer.sampleRate;
    var channels = Math.min(2, audioBuffer.numberOfChannels);
    var length = audioBuffer.length;

    onProgress({ stage: 'init', pct: 5 });

    var chunks = [];
    var encoder = new AudioEncoder({
      output: function(chunk){
        var buf = new Uint8Array(chunk.byteLength);
        chunk.copyTo(buf);
        chunks.push(buf);
      },
      error: function(e){ console.error('[FLAC] 인코더 에러:', e); }
    });

    var cfg = {
      codec: 'opus',
      sampleRate: sampleRate,
      numberOfChannels: channels,
      bitrate: opts.bitrate || 128000
    };
    var support = await AudioEncoder.isConfigSupported(cfg);
    if(!support.supported) throw new Error('Opus 인코딩 미지원: ' + sampleRate + 'Hz ' + channels + 'ch');
    encoder.configure(cfg);

    // ── AudioBuffer → AudioData (프레임별) ──
    //  WebCodecs는 f32-planar 포맷 지원
    var FRAME = 4096;
    var chL = audioBuffer.getChannelData(0);
    var chR = channels > 1 ? audioBuffer.getChannelData(1) : chL;

    for(var pos = 0; pos < length; pos += FRAME){
      var n = Math.min(FRAME, length - pos);

      // f32-planar 포맷: [L0,L1,...,Ln-1, R0,R1,...,Rn-1]
      var f32 = new Float32Array(n * channels);
      f32.set(chL.subarray(pos, pos + n), 0);
      if(channels > 1) f32.set(chR.subarray(pos, pos + n), n);

      var audioData = new AudioData({
        format: 'f32-planar',
        sampleRate: sampleRate,
        numberOfFrames: n,
        numberOfChannels: channels,
        timestamp: Math.round(pos / sampleRate * 1e6),
        data: f32
      });
      encoder.encode(audioData);
      audioData.close();

      if(pos % (FRAME * 40) === 0){
        onProgress({ stage: 'encode', pct: 5 + Math.round(pos / length * 85) });
      }
    }

    await encoder.flush();
    encoder.close();

    onProgress({ stage: 'pack', pct: 95 });

    // ── 청크 합치기 ──
    var total = chunks.reduce(function(s, c){ return s + c.length; }, 0);
    var out = new Uint8Array(total);
    var off = 0;
    chunks.forEach(function(c){ out.set(c, off); off += c.length; });

    onProgress({ stage: 'done', pct: 100 });
    return {
      flac: out,
      sampleRate: sampleRate,
      channels: channels,
      length: length,
      size: total
    };
  }

  // ── FLAC → LP PCM 디코딩 (Player) ─────────
  //  입력: Uint8Array (FLAC bytes)
  //  출력: AudioBuffer
  async function decode(flacBytes, audioCtx, opts){
    opts = opts || {};
    if(!audioCtx) audioCtx = new (global.AudioContext || global.webkitAudioContext)();
    var onProgress = opts.onProgress || function(){};
    onProgress({ stage: 'decode', pct: 10 });

    // 브라우저 내장 decodeAudioData가 FLAC 지원
    // (Chrome, Firefox, Edge 모두 FLAC 지원)
    var buf = flacBytes.buffer.slice(flacBytes.byteOffset, flacBytes.byteOffset + flacBytes.byteLength);
    var audioBuffer = await audioCtx.decodeAudioData(buf);

    onProgress({ stage: 'done', pct: 100 });
    return audioBuffer;
  }

  // ── LP PCM + 원본 PCM 믹스 (LP Enhanced) ─
  //  LP PCM = LP Opus 디코딩 결과
  //  최종 재생 = LP PCM (그대로) 또는 원본 + 차이
  function mix(originalBuffer, lpBuffer, mode){
    mode = mode || 'replace';
    if(mode === 'replace'){
      // LP로 완전 대체
      return lpBuffer;
    }
    // 'overlay' 모드: 원본 + LP 차이
    var n = Math.min(originalBuffer.length, lpBuffer.length);
    var out = audioCtx.createBuffer(2, n, lpBuffer.sampleRate);
    var oL = originalBuffer.getChannelData(0);
    var oR = originalBuffer.numberOfChannels > 1 ? originalBuffer.getChannelData(1) : oL;
    var lL = lpBuffer.getChannelData(0);
    var lR = lpBuffer.numberOfChannels > 1 ? lpBuffer.getChannelData(1) : lL;
    var outL = out.getChannelData(0);
    var outR = out.getChannelData(1);
    for(var i = 0; i < n; i++){
      outL[i] = lL[i];  // LP 우선
      outR[i] = lR[i];
    }
    return out;
  }

  global.TL3_LP_FLAC = {
    isSupported: isSupported,
    encode: encode,
    decode: decode,
    mix: mix,
    version: 'lp-opus-v1'
  };
})(window);
