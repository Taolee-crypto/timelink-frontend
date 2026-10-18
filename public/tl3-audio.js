/*! tl3-audio.js — TimeLink LP Enhanced native WebAudio playback graph
 * Reuses the established low-latency media-element path for TL3 MSE playback.
 * TL3 encryption, segment delivery and settlement remain owned by tl3.js.
 */
(function (global) {
  'use strict';

  const Ctor = global.AudioContext || global.webkitAudioContext;

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

  async function attach(audioEl, meta) {
    if (!audioEl) throw new Error('TL3 audio element is required');
    if (audioEl._tl3AudioController) {
      await audioEl._tl3AudioController.resume();
      return audioEl._tl3AudioController;
    }
    if (!meta || meta.enabled !== true || !Ctor) {
      return {
        enabled: false, mode: 'bypass',
        resume: function () { return Promise.resolve(); },
        stop: function () { return Promise.resolve(); },
        state: function () { return 'bypass'; }
      };
    }

    const g = meta.g || {};
    const ctx = new Ctor();
    let source = null;
    let oscillator = null;
    let noiseSource = null;
    let destroyed = false;
    const nodes = [];
    const masterGain = ctx.createGain();
    masterGain.gain.value = 1;
    masterGain.connect(ctx.destination);

    function resume() {
      if (destroyed || audioEl.paused) return Promise.resolve();
      try { masterGain.gain.setValueAtTime(1, ctx.currentTime); } catch (_) { masterGain.gain.value = 1; }
      return ctx.state === 'suspended' ? ctx.resume().catch(function () {}) : Promise.resolve();
    }

    // Stop output immediately, then suspend the graph. The graph and its
    // MediaElementAudioSourceNode remain attached for the lifetime of audioEl.
    function stop() {
      if (destroyed) return Promise.resolve();
      try {
        masterGain.gain.cancelScheduledValues(ctx.currentTime);
        masterGain.gain.setValueAtTime(0, ctx.currentTime);
      } catch (_) { masterGain.gain.value = 0; }
      return ctx.state === 'running' ? ctx.suspend().catch(function () {}) : Promise.resolve();
    }

    try {
      source = ctx.createMediaElementSource(audioEl);

      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 30 + 20 * clamp(g.Gd ?? 0.5, 0, 1);
      highpass.Q.value = 0.7071;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = clamp(
        16000 - 7000 * clamp(g.Gw ?? 0.5, 0, 1) - 4000 * clamp(g.Gi ?? 0.5, 0, 1),
        9000, 18000
      );
      lowpass.Q.value = 0.7071;

      const shaper = ctx.createWaveShaper();
      const amount = 1 + 2.5 * clamp(g.Gt ?? 0.2, 0, 1);
      const curve = new Float32Array(2048);
      const norm = Math.tanh(amount) || 1;
      for (let i = 0; i < curve.length; i++) {
        const x = i * 2 / (curve.length - 1) - 1;
        curve[i] = Math.tanh(amount * x) / norm;
      }
      shaper.curve = curve;
      shaper.oversample = '2x';

      const delay = ctx.createDelay(0.04);
      delay.delayTime.value = 0.012;
      oscillator = ctx.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = 0.55;
      const wowDepth = ctx.createGain();
      wowDepth.gain.value = 0.00025 + 0.001 * clamp(g.Gp ?? 0.2, 0, 1);
      oscillator.connect(wowDepth);
      wowDepth.connect(delay.delayTime);

      const output = ctx.createGain();
      output.gain.value = 0.96;
      source.connect(highpass);
      highpass.connect(lowpass);
      lowpass.connect(shaper);
      shaper.connect(delay);
      delay.connect(output);
      output.connect(masterGain);
      nodes.push(highpass, lowpass, shaper, delay, wowDepth, output);
      oscillator.start();

      const noiseDb = Number(g.nz ?? -48);
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
        noiseGain.connect(masterGain);
        nodes.push(noiseFilter, noiseGain);
        noiseSource.start();
      }

      audioEl.addEventListener('playing', resume);
      await resume();

      const controller = {
        enabled: true,
        mode: 'native-webaudio-lp',
        resume: resume,
        stop: stop,
        state: function () { return ctx.state; },
        destroy: function () {
          if (destroyed) return;
          destroyed = true;
          audioEl.removeEventListener('playing', resume);
          try { if (oscillator) oscillator.stop(); } catch (_) {}
          try { if (noiseSource) noiseSource.stop(); } catch (_) {}
          try { source.disconnect(); } catch (_) {}
          nodes.forEach(function (node) { try { node.disconnect(); } catch (_) {} });
          try { masterGain.disconnect(); } catch (_) {}
        }
      };
      audioEl._tl3AudioController = controller;
      console.log('[TL3-AUDIO] LP Enhanced native graph attached', {
        mode: controller.mode, sampleRate: ctx.sampleRate,
        profile: meta.version || 'track-reference', parameters: g
      });
      return controller;
    } catch (error) {
      console.warn('[TL3-AUDIO] LP graph setup failed; restoring native media output.', error);
      try { if (source) { source.disconnect(); source.connect(ctx.destination); } } catch (_) {}
      try { masterGain.disconnect(); } catch (_) {}
      audioEl.addEventListener('playing', function () {
        if (ctx.state === 'suspended') ctx.resume().catch(function () {});
      });
      const controller = {
        enabled: false, mode: 'native-passthrough',
        resume: function () { return ctx.state === 'suspended' ? ctx.resume().catch(function () {}) : Promise.resolve(); },
        stop: function () { return Promise.resolve(); },
        state: function () { return ctx.state; }
      };
      audioEl._tl3AudioController = controller;
      return controller;
    }
  }

  const defaultProfile = {
    enabled: true,
    version: 'player-reference-lp-v1',
    seed: 7,
    g: { Gd: 0.5, Gw: 0.5, Gv: 0.4, Gp: 0.2, Gs: 0.45, Gi: 0.5, Gt: 0.2, Gm: 1, nz: -48 }
  };

  global.TL3Audio = {
    attach: attach,
    defaultProfile: defaultProfile,
    version: 'native-webaudio-lp-v1'
  };
})(window);
