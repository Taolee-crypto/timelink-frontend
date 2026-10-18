/*! tl3-audio-lp-enhanced.js — stateful LP Enhanced playback for TL3 MSE
 * Uses the same stateful DSP stages as tl3-lp-worklet.js.
 * The processor keeps filter, wow/flutter, noise and click state across
 * one-second encrypted TL3 segment boundaries. Transport/settlement stay in tl3.js.
 */
(function (global) {
  'use strict';
  const AudioContextCtor = global.AudioContext || global.webkitAudioContext;
  const DEFAULT = {
    enabled: true, version: 'lp-v1-runtime', seed: 7,
    g: { Gd:.5, Gw:.5, Gv:.4, Gp:.2, Gs:.45, Gi:.5, Gt:.2, Gm:1, nz:-48 }
  };
  function resolvedProfile(meta) {
    const p = Object.assign({}, DEFAULT, meta || {});
    p.g = Object.assign({}, DEFAULT.g, meta && meta.g || {});
    p.seed = Number(meta && (meta.lp_seed ?? meta.seed) || DEFAULT.seed) | 0;
    return p;
  }
  async function attach(audioEl, meta) {
    if (!audioEl) throw new Error('TL3 audio element is required');
    if (!meta || meta.enabled !== true || !AudioContextCtor) {
      return { enabled:false, mode:'bypass', resume:async()=>{}, stop:async()=>{}, state:()=> 'bypass' };
    }
    if (audioEl._tl3AudioController) {
      await audioEl._tl3AudioController.resume();
      return audioEl._tl3AudioController;
    }
    const profile = resolvedProfile(meta);
    const ctx = new AudioContextCtor();
    const source = ctx.createMediaElementSource(audioEl);
    const master = ctx.createGain();
    master.gain.value = 1;
    master.connect(ctx.destination);
    let processor = null;
    let destroyed = false;
    let mode = 'native-passthrough';
    const resume = async function () {
      if (destroyed || audioEl.paused) return;
      try { master.gain.setTargetAtTime(1, ctx.currentTime, .012); } catch (_) { master.gain.value = 1; }
      if (ctx.state === 'suspended') await ctx.resume();
    };
    const stop = async function () {
      if (destroyed) return;
      try { master.gain.setTargetAtTime(0, ctx.currentTime, .006); } catch (_) { master.gain.value = 0; }
      if (ctx.state === 'running') await ctx.suspend().catch(function(){});
    };
    try {
      if (!ctx.audioWorklet || typeof global.AudioWorkletNode !== 'function') throw new Error('AudioWorklet is not supported');
      await ctx.audioWorklet.addModule('/tl3-lp-worklet.js?v=lp-enhanced-stateful-20261018');
      processor = new global.AudioWorkletNode(ctx, 'tl3-reference-lp', {
        numberOfInputs:1, numberOfOutputs:1, outputChannelCount:[2],
        channelCount:2, channelCountMode:'explicit', channelInterpretation:'speakers',
        processorOptions:{
          g:profile.g, seed:profile.seed,
          durationMs:Number(meta.duration_ms || meta.durationMs || 0)
        }
      });
      processor.port.onmessage = function(event) {
        const d = event.data || {};
        if (d.type === 'audio-levels') {
          audioEl._tl3LpLevels = d;
          if (d.inputRms === 0) console.warn('[LP-ENHANCED] processor receives silent input', d);
        }
      };
      source.connect(processor);
      processor.connect(master);
      mode = 'stateful-audioworklet';
    } catch (error) {
      console.warn('[LP-ENHANCED] Worklet unavailable; clean native passthrough used.', error);
      try { if (processor) processor.disconnect(); } catch (_) {}
      try { source.disconnect(); } catch (_) {}
      source.connect(master);
      mode = 'native-passthrough';
    }
    const controller = {
      enabled: mode === 'stateful-audioworklet',
      mode: mode,
      profile: profile,
      resume: resume,
      stop: stop,
      state: function(){ return ctx.state; },
      destroy: async function(){
        if (destroyed) return;
        destroyed = true;
        audioEl.removeEventListener('playing', resume);
        try { source.disconnect(); } catch (_) {}
        try { if (processor) { processor.port.onmessage = null; processor.disconnect(); } } catch (_) {}
        try { master.disconnect(); } catch (_) {}
        if (ctx.state !== 'closed') await ctx.close().catch(function(){});
        if (audioEl._tl3AudioController === controller) audioEl._tl3AudioController = null;
      }
    };
    audioEl._tl3AudioController = controller;
    audioEl.addEventListener('playing', resume);
    console.info('[LP-ENHANCED] Track DSP ready', {
      mode:mode, profile:profile.version, seed:profile.seed,
      sampleRate:ctx.sampleRate, params:profile.g
    });
    if (!audioEl.paused && ctx.state === 'suspended') await ctx.resume().catch(function(){});
    return controller;
  }
  global.TL3Audio = {
    attach:attach,
    defaultProfile:DEFAULT,
    version:'lp-enhanced-stateful-worklet-v1'
  };
})(window);
