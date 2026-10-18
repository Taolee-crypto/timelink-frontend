/*! tl3-audio.js — TL3 player-owned reference LP runtime */
(function (global) {
  'use strict';

  const Ctor = global.AudioContext || global.webkitAudioContext;
  const WORKLET_URL = '/tl3-lp-worklet.js?v=reference-lp-20261018';

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

  function legacyFallback(ctx, source, meta, masterGain) {
    const g = meta.g || {};
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 30 + 20 * clamp(g.Gd ?? 0.5, 0, 1);
    hp.Q.value = 0.7071;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = clamp(16000 - 7000 * clamp(g.Gw ?? 0.5, 0, 1) - 4000 * clamp(g.Gi ?? 0.5, 0, 1), 9000, 18000);
    lp.Q.value = 0.7071;

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
    const lfo = ctx.createOscillator();
    const depth = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 0.55;
    depth.gain.value = 0.00025 + 0.001 * clamp(g.Gp ?? 0.2, 0, 1);
    lfo.connect(depth);
    depth.connect(delay.delayTime);

    const output = ctx.createGain();
    output.gain.value = 0.96;
    source.connect(hp);
    hp.connect(lp);
    lp.connect(shaper);
    shaper.connect(delay);
    delay.connect(output);
    output.connect(masterGain || ctx.destination);
    lfo.start();
    return {
      nodes: [hp, lp, shaper, delay, lfo, depth, output],
      mode: 'legacy-fallback'
    };
  }

  async function attach(audioEl, meta) {
    if (audioEl && audioEl._tl3AudioController) {
      await audioEl._tl3AudioController.resume();
      return audioEl._tl3AudioController;
    }
    if (!meta || meta.enabled !== true || !Ctor) {
      return { enabled: false, mode: 'bypass', resume: function () { return Promise.resolve(); }, destroy: function () {}, state: function () { return 'bypass'; } };
    }

    const ctx = new Ctor();
    // A dedicated output gate silences LP noise synchronously on stop,
    // before AudioContext suspension completes.
    const masterGain = ctx.createGain();
    masterGain.gain.value = 1;
    masterGain.connect(ctx.destination);
    let source = null;
    let processor = null;
    let fallbackNodes = [];
    let destroyed = false;
    let mode = 'reference-worklet';

    function resume() {
      if (destroyed || audioEl.paused) return Promise.resolve();
      // Restore the output only as part of an explicit playback resume.
      masterGain.gain.setValueAtTime(1, ctx.currentTime);
      if (ctx.state === 'suspended') return ctx.resume().catch(function () {});
      return Promise.resolve();
    }

    // Hard-mute first, then suspend. This guarantees immediate silence even
    // if the browser delays AudioContext.suspend(). Keep the source node alive
    // because MediaElementAudioSourceNode cannot be recreated for this element.
    function stop() {
      if (destroyed) return Promise.resolve();
      try { masterGain.gain.cancelScheduledValues(ctx.currentTime); masterGain.gain.setValueAtTime(0, ctx.currentTime); } catch (_) { masterGain.gain.value = 0; }
      if (ctx.state === 'running') return ctx.suspend().catch(function () {});
      return Promise.resolve();
    }

    try {
      source = ctx.createMediaElementSource(audioEl);
      try {
        if (!ctx.audioWorklet || typeof global.AudioWorkletNode !== 'function') {
          throw new Error('AudioWorklet is not supported in this browser');
        }
        await ctx.audioWorklet.addModule(WORKLET_URL);
        processor = new global.AudioWorkletNode(ctx, 'tl3-reference-lp', {
          numberOfInputs: 1,
          numberOfOutputs: 1,
          outputChannelCount: [2],
          processorOptions: {
            g: meta.g || {},
            seed: meta.seed ?? 7,
            durationMs: meta.duration_ms ?? 0
          }
        });
        source.connect(processor);
        processor.connect(masterGain);
      } catch (workletError) {
        console.warn('[TL3-AUDIO] reference worklet unavailable; using compatibility DSP:', workletError);
        mode = 'legacy-fallback';
        const fallback = legacyFallback(ctx, source, meta, masterGain);
        fallbackNodes = fallback.nodes;
      }

      audioEl.addEventListener('playing', resume);
      await resume();
      console.log('[TL3-AUDIO] LP engine attached', {
        version: 'reference-lp-v1',
        mode: mode,
        sampleRate: ctx.sampleRate,
        profile: meta.version || 'track-reference',
        parameters: meta.g || {}
      });

      const controller = {
        enabled: true,
        mode: mode,
        resume: resume,
        stop: stop,
        state: function () { return ctx.state; },
        destroy: function () {
          if (destroyed) return;
          destroyed = true;
          audioEl.removeEventListener('playing', resume);
          try { if (processor) processor.disconnect(); } catch (_) {}
          fallbackNodes.forEach(function (node) { try { if (node.stop) node.stop(); } catch (_) {} try { node.disconnect(); } catch (_) {} });
          try { if (source) source.disconnect(); } catch (_) {}
          try { masterGain.gain.setValueAtTime(0, ctx.currentTime); } catch (_) { masterGain.gain.value = 0; }
          // Keep the source/context alive for replay; a media element may own
          // only one MediaElementAudioSourceNode during its lifetime.
        }
      };
      audioEl._tl3AudioController = controller;
      return controller;
    } catch (error) {
      console.warn('[TL3-AUDIO] LP setup failed; restoring direct media output.', error);
      try { if (source) { source.disconnect(); source.connect(ctx.destination); } } catch (_) {}
      audioEl.addEventListener('playing', resume);
      await resume();
      const controller = {
        enabled: false,
        mode: 'native-passthrough',
        resume: resume,
        state: function () { return ctx.state; },
        destroy: function () {}
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
    version: 'reference-lp-v1'
  };
})(window);
