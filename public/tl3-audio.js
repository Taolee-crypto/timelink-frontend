/*! tl3-audio.js — TimeLink 경량 LP 재생 모듈
 * 기존 TL3 MSE/복호화 엔진과 분리된 실시간 LP DSP 출력부
 * 입력: header.lp_meta (enabled, g, seed)
 */
(function (global) {
  'use strict';

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function makeNoiseBuffer(ctx, seed) {
    const length = Math.max(1, Math.floor(ctx.sampleRate));
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let state = (Number(seed) | 0) || 7;
    for (let i = 0; i < length; i++) {
      state = (Math.imul(state ^ (state >>> 15), 1 | state) + 0x6D2B79F5) | 0;
      data[i] = ((state >>> 0) / 2147483648) - 1;
    }
    return buffer;
  }

  function attach(audioEl, meta) {
    const Ctor = global.AudioContext || global.webkitAudioContext;
    let ctx = null;
    let source = null;
    const nodes = [];
    let oscillator = null;
    let noiseSource = null;
    let destroyed = false;
    let direct = false;

    function passthrough() {
      try {
        if (source && ctx) {
          source.disconnect();
          source.connect(ctx.destination);
          direct = true;
        }
      } catch (_) {}
    }

    function resume() {
      if (ctx && ctx.state === 'suspended') return ctx.resume().catch(function () {});
      return Promise.resolve();
    }

    function param(key, fallback) {
      const value = Number(meta && meta.g && meta.g[key]);
      return Number.isFinite(value) ? value : fallback;
    }

    function destroy() {
      if (destroyed) return;
      destroyed = true;
      try { if (oscillator) oscillator.stop(); } catch (_) {}
      try { if (noiseSource) noiseSource.stop(); } catch (_) {}
      try { if (source) source.disconnect(); } catch (_) {}
      nodes.forEach(function (node) { try { node.disconnect(); } catch (_) {} });
      if (ctx) {
        const closing = ctx.close();
        if (closing && closing.catch) closing.catch(function () {});
      }
      oscillator = null;
      noiseSource = null;
      source = null;
      ctx = null;
    }

    if (!meta || meta.enabled !== true || !meta.g || !Ctor) {
      return { resume: resume, destroy: destroy, enabled: false, state: function () { return 'bypass'; } };
    }

    try {
      const p = meta.g;
      ctx = new Ctor();
      source = ctx.createMediaElementSource(audioEl);

      // 1) LP tone: 단순한 2단 필터 체인
      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 30 + 20 * clamp(param('Gd', 0.5), 0, 1);
      highpass.Q.value = 0.707;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = clamp(
        16000 - 7000 * clamp(param('Gw', 0.5), 0, 1) - 4000 * clamp(param('Gi', 0.5), 0, 1),
        9000, 18000
      );
      lowpass.Q.value = 0.707;

      // 2) 약한 아날로그 포화. 커브는 연결 시 한 번만 계산한다.
      const shaper = ctx.createWaveShaper();
      const amount = 1 + 2.5 * clamp(param('Gt', 0.2), 0, 1);
      const curve = new Float32Array(1024);
      const norm = Math.tanh(amount) || 1;
      for (let i = 0; i < curve.length; i++) {
        const x = (i * 2 / (curve.length - 1)) - 1;
        curve[i] = Math.tanh(amount * x) / norm;
      }
      shaper.curve = curve;
      shaper.oversample = 'none';

      const output = ctx.createGain();
      output.gain.value = 0.96;
      source.connect(highpass);
      highpass.connect(lowpass);
      lowpass.connect(shaper);
      shaper.connect(output);
      output.connect(ctx.destination);
      nodes.push(highpass, lowpass, shaper, output);

      // 3) 미세한 wow. 별도 오디오 버퍼나 프레임 복사는 사용하지 않는다.
      const delay = ctx.createDelay(0.04);
      delay.delayTime.value = 0.012;
      oscillator = ctx.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = 0.55;
      const wowDepth = ctx.createGain();
      wowDepth.gain.value = 0.00025 + 0.001 * clamp(param('Gp', 0.2), 0, 1);
      oscillator.connect(wowDepth);
      wowDepth.connect(delay.delayTime);
      output.disconnect();
      shaper.disconnect();
      shaper.connect(delay);
      delay.connect(output);
      nodes.push(delay, wowDepth);
      oscillator.start();

      // 4) LP 표면 노이즈는 아주 작은 단일 루프 버퍼로만 생성한다.
      //    값이 없거나 사실상 꺼진 경우에는 노이즈 경로 자체를 만들지 않는다.
      const noiseDb = param('nz', -48);
      if (Number.isFinite(noiseDb) && noiseDb > -90) {
        noiseSource = ctx.createBufferSource();
        noiseSource.buffer = makeNoiseBuffer(ctx, meta.seed);
        noiseSource.loop = true;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 7500;
        const noiseGain = ctx.createGain();
        noiseGain.gain.value = Math.pow(10, clamp(noiseDb, -90, -24) / 20) * 0.16;
        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        nodes.push(noiseFilter, noiseGain);
        noiseSource.start();
      }

      audioEl.addEventListener('playing', resume);
      resume();
      console.log('[TL3-AUDIO] lightweight LP module attached', {
        version: meta.version || 'lp-meta',
        sampleRate: ctx.sampleRate,
        filterHz: [highpass.frequency.value, lowpass.frequency.value],
        noise: !!noiseSource
      });

      return {
        resume: resume,
        destroy: function () {
          audioEl.removeEventListener('playing', resume);
          destroy();
        },
        enabled: true,
        state: function () { return ctx ? ctx.state : 'closed'; }
      };
    } catch (error) {
      console.warn('[TL3-AUDIO] LP setup failed; switching to direct audio', error);
      passthrough();
      // 실패한 그래프를 정리하되 createMediaElementSource의 네이티브 경로는 보존한다.
      try { if (oscillator) oscillator.stop(); } catch (_) {}
      try { if (noiseSource) noiseSource.stop(); } catch (_) {}
      nodes.forEach(function (node) { try { node.disconnect(); } catch (_) {} });
      if (source && ctx) {
        try { source.disconnect(); source.connect(ctx.destination); } catch (_) {}
      }
      if (ctx) {
        try { const closing = ctx.close(); if (closing && closing.catch) closing.catch(function () {}); } catch (_) {}
      }
      audioEl.addEventListener('playing', resume);
      resume();
      return {
        resume: resume,
        destroy: function () {
          audioEl.removeEventListener('playing', resume);
          if (source) { try { source.disconnect(); } catch (_) {} }
          source = null;
          if (ctx) {
            const closing = ctx.close();
            if (closing && closing.catch) closing.catch(function () {});
          }
          ctx = null;
        },
        enabled: false,
        state: function () { return direct ? 'direct' : 'bypass'; }
      };
    }
  }

  global.TL3Audio = { attach: attach, version: 'audio-lite-v1' };
})(window);
