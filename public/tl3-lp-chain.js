/*! tl3-lp-chain.js — TimeLink LP Enhanced player chain (2026-10-18)
 * 원격 tl3.js의 세그먼트 스케줄러(90903a3)는 그대로 두고,
 * <audio>에 MediaElementSource를 1회만 붙여 LP DSP를 병렬로 제공한다.
 * LP ON/OFF는 master.gain 램프로 처리해 재생 파이프라인에 무영향.
 */
(function (global) {
  'use strict';
  const AudioContextCtor = global.AudioContext || global.webkitAudioContext;
  // Prime a reusable context synchronously from the user's Play click.
  // Creating it only after async API requests can leave WebAudio suspended.
  let sharedContext = null;
  function createContext(){
    try{return new AudioContextCtor({latencyHint:'playback'});}
    catch(_){return new AudioContextCtor();}
  }
  function unlock() {
    if (!AudioContextCtor) return Promise.resolve(false);
    try {
      if (!sharedContext || sharedContext.state === 'closed') sharedContext = createContext();
      return sharedContext.state === 'suspended'
        ? sharedContext.resume().then(() => true)
        : Promise.resolve(true);
    } catch (error) { return Promise.reject(error); }
  }
  const DEFAULT = {
    enabled: true, version: 'lp-v1-runtime', seed: 7,
    g: { Gd:.5, Gw:.5, Gv:.4, Gp:.2, Gs:.45, Gi:.5, Gt:.2, Gm:1, nz:-48 }
  };
  function resolved(meta) {
    const p = Object.assign({}, DEFAULT, meta || {});
    p.g = Object.assign({}, DEFAULT.g, (meta && meta.g) || {});
    p.seed = Number((meta && (meta.seed ?? meta.lp_seed)) || DEFAULT.seed) | 0;
    return p;
  }

  async function create(audioEl, meta, durationMs) {
    if (!audioEl) throw new Error('audio element required');
    if (!meta || meta.enabled !== true || !AudioContextCtor) return bypass();

    if (audioEl._tl3LpChain) {
      try { await audioEl._tl3LpChain.updateProfile(meta, durationMs); } catch (_) {}
      return audioEl._tl3LpChain;
    }

    const profile = resolved(meta);
    profile.duration_ms = Number(durationMs || profile.duration_ms || 0);

    const ctx = (sharedContext && sharedContext.state !== 'closed') ? sharedContext : (sharedContext = createContext());
    const source = ctx.createMediaElementSource(audioEl);
    const master = ctx.createGain();
    master.gain.value = 1;
    master.connect(ctx.destination);
    source.connect(master);

    let processor = null;
    let available = false;
    let enabled = false;
    let destroyed = false;
    let workletReady = false;
    let locallySuspended = false;

    async function ensureWorklet() {
      if (workletReady || destroyed) return workletReady;
      if (!ctx.audioWorklet || typeof global.AudioWorkletNode !== 'function') return false;
      try {
        await ctx.audioWorklet.addModule('/tl3-lp-worklet.js?v=lp-stable-20261027');
        workletReady = true;
      } catch (e) {
        console.warn('[LP-CHAIN] worklet load failed:', e);
        workletReady = false;
      }
      return workletReady;
    }

    function releaseProcessor(node){
      if(!node)return;
      try{node.disconnect();}catch(_){}
      node.removeEventListener('processorerror',restoreNative);
      if(node.port){node.port.onmessage=null;try{node.port.close();}catch(_){}}
    }

    async function buildProcessor(p) {
      if (!await ensureWorklet()) return null;
      try {
        const node = new global.AudioWorkletNode(ctx, 'tl3-reference-lp', {
          numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [2],
          channelCount: 2, channelCountMode: 'explicit', channelInterpretation: 'speakers',
          processorOptions: { g: p.g, seed: p.seed, durationMs: Number(p.duration_ms || 0), surfaceNoise: false }
        });
        node.addEventListener('processorerror', restoreNative);
        node.port.onmessage = function (event) {
          const d = event.data || {};
          if (d.type === 'audio-levels') audioEl._tl3LpLevels = d;
        };
        return node;
      } catch (e) {
        console.warn('[LP-CHAIN] AudioWorkletNode create failed:', e);
        return null;
      }
    }

    try {
      processor = await buildProcessor(profile);
      available = !!processor;
    } catch (_) { available = false; }

    function setOutput(value){
      try{master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setTargetAtTime(value,ctx.currentTime,0.008);}
      catch(_){master.gain.value=value;}
    }
    function restoreNative(){
      if(destroyed)return;
      available=false;enabled=false;
      try{source.disconnect();}catch(_){}
      try{if(processor)processor.disconnect();}catch(_){}
      try{source.connect(master);}catch(_){}
      setOutput(locallySuspended?0:1);
      console.warn('[LP-CHAIN] processor failed; restoring native audio');
    }
    function resume() {
      if (destroyed || audioEl.paused) return Promise.resolve();
      locallySuspended=false;setOutput(1);
      return ctx.state !== 'running' && ctx.state !== 'closed' ? ctx.resume().catch(() => {}) : Promise.resolve();
    }
    function suspend() {
      if (destroyed) return Promise.resolve();
      // Each track owns only its gain. Suspending the shared AudioContext
      // here can interrupt a newer track whose playback has already started.
      locallySuspended=true;setOutput(0);return Promise.resolve();
    }

    function setEnabled(next) {
      const wanted = !!next;
      if (destroyed) return Promise.resolve(false);
      if (wanted && !available) return Promise.resolve(false);
      if (wanted === enabled) return Promise.resolve(true);

      try { master.gain.cancelScheduledValues(ctx.currentTime); } catch (_) {}
      try { master.gain.setValueAtTime(0, ctx.currentTime); } catch (_) { master.gain.value = 0; }

      try {
        source.disconnect();
        if (wanted) {
          if (!processor) {
            source.connect(master);
            try { master.gain.setValueAtTime(1, ctx.currentTime); } catch (_) { master.gain.value = 1; }
            return Promise.resolve(false);
          }
          // Rebuild a single clean route on every toggle; never leave duplicate
          // processor-to-master connections behind.
          try { processor.disconnect(); } catch (_) {}
          source.connect(processor);
          processor.connect(master);
        } else {
          if (processor) { try { processor.disconnect(); } catch (_) {} }
          source.connect(master);
        }
      } catch (e) {
        console.warn('[LP-CHAIN] route change failed; restoring native audio:', e);
        try { source.disconnect(); } catch (_) {}
        try { if (processor) processor.disconnect(); } catch (_) {}
        try { source.connect(master); } catch (_) {}
        enabled = false;
        try { master.gain.setValueAtTime(1, ctx.currentTime); } catch (_) { master.gain.value = 1; }
        return Promise.resolve(false);
      }

      enabled = wanted;
      try { master.gain.setValueAtTime(1, ctx.currentTime); } catch (_) { master.gain.value = 1; }
      if (ctx.state === 'suspended' && !audioEl.paused) ctx.resume().catch(() => {});
      return Promise.resolve(true);
    }

    const controller = {
      licensed: true,
      available: () => available,
      enabled: () => enabled,
      mode: () => enabled ? 'stateful-audioworklet' : 'native-passthrough',
      state: () => ctx.state,
      setEnabled,
      resume,
      suspend,
      stop: function(){return controller.destroy();},
      updateProfile: async function (nextMeta, nextDurationMs) {
        if (destroyed) return false;
        const nextProfile = resolved(nextMeta);
        nextProfile.duration_ms = Number(nextDurationMs || nextProfile.duration_ms || 0);
        try { master.gain.setValueAtTime(0, ctx.currentTime); } catch (_) {}
        try {
          releaseProcessor(processor);
          source.disconnect();
          source.connect(master);
          enabled = false;
          processor = await buildProcessor(nextProfile);
          available = !!processor;
          try { master.gain.setValueAtTime(1, ctx.currentTime); } catch (_) { master.gain.value = 1; }
          return available;
        } catch (e) {
          available = false;
          try { source.connect(master); } catch (_) {}
          return false;
        }
      },
      destroy: async function () {
        if (destroyed) return;
        destroyed = true;
        audioEl.removeEventListener('playing',resume);
        releaseProcessor(processor);
        try { source.disconnect(); } catch (_) {}
        try { if (processor) processor.disconnect(); } catch (_) {}
        try { master.disconnect(); } catch (_) {}
        // Keep the shared context alive for the next track.
        if (ctx !== sharedContext) { try { if (ctx.state !== 'closed') await ctx.close(); } catch (_) {} }
        if (audioEl._tl3LpChain === controller) audioEl._tl3LpChain = null;
      }
    };
    audioEl._tl3LpChain = controller;
    audioEl.addEventListener('playing', resume);

    console.info('[LP-CHAIN] ready', {
      available, mode: enabled ? 'stateful-audioworklet' : 'native-passthrough',
      seed: profile.seed, version: profile.version
    });
    return controller;
  }

  function bypass() {
    return {
      licensed: false, available: () => false, enabled: () => false,
      mode: () => 'bypass', state: () => 'bypass',
      setEnabled: async () => false, resume: async () => {}, suspend: async () => {},
      stop: async () => {}, updateProfile: async () => false, destroy: async () => {}
    };
  }

  global.TL3LPChain = { create, unlock, defaultProfile: DEFAULT, version: 'lp-chain-2026-10-27-stable' };
})(window);
