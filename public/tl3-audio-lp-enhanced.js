/*! tl3-audio-lp-enhanced.js — independent LP Enhanced connector for TL3 Player
 * TL3 remains the original encrypted MP3 + metadata + Spine container.
 * This module routes the decoded player output through the LP Worklet only
 * when the listener enables the Track checkbox. The original path is default.
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
    p.seed = Number(meta && (meta.seed ?? meta.lp_seed) || DEFAULT.seed) | 0;
    return p;
  }
  async function attach(audioEl, meta) {
    if (!audioEl) throw new Error('TL3 audio element is required');
    if (!meta || meta.enabled !== true) {
      return { licensed:false, enabled:false, mode:'native-passthrough',
        setEnabled:async()=>false, resume:async()=>{}, stop:async()=>{},
        state:()=> 'bypass', destroy:async()=>{} };
    }
    if (!AudioContextCtor) throw new Error('Web Audio API is not supported');
    if (audioEl._tl3AudioController) {
      const old = audioEl._tl3AudioController;
      if (typeof old.updateProfile === 'function') {
        await old.updateProfile(meta);
        return old;
      }
      // Keep the existing MediaElementSourceNode alive. Recreating it for the
      // same media element is rejected by browsers, even after context close.
      throw new Error('Existing TL3 audio controller cannot be safely reconfigured');
    }
    let profile = resolvedProfile(meta);
    const ctx = new AudioContextCtor();
    const source = ctx.createMediaElementSource(audioEl);
    const master = ctx.createGain();
    master.gain.value = 1;
    master.connect(ctx.destination);
    let processor = null;
    let workletReady = false;
    let destroyed = false;
    let enabled = false;
    let mode = 'native-passthrough';
    let routeBusy = Promise.resolve();
    const disconnect = function(node){ try { node.disconnect(); } catch (_) {} };
    const setEnabled = function(next) {
      const wanted = !!next;
      routeBusy = routeBusy.then(async function(){
        if (destroyed) return false;
        if (wanted && !processor) return false;
        if (wanted === enabled) return true;
        if (wanted) {
          disconnect(source);
          source.connect(processor);
          processor.connect(master);
          mode = 'stateful-audioworklet';
        } else {
          disconnect(source);
          if (processor) disconnect(processor);
          source.connect(master);
          mode = 'native-passthrough';
        }
        enabled = wanted;
        if (ctx.state === 'suspended') await ctx.resume().catch(function(){});
        console.info('[LP-ENHANCED] player route changed', {enabled:enabled,mode:mode});
        return true;
      });
      return routeBusy;
    };
    const resume = async function() {
      if (destroyed || audioEl.paused) return;
      if (ctx.state === 'suspended') await ctx.resume().catch(function(){});
    };
    const stop = async function() {
      if (destroyed) return;
      if (ctx.state === 'running') await ctx.suspend().catch(function(){});
    };
    try {
      if (!ctx.audioWorklet || typeof global.AudioWorkletNode !== 'function') throw new Error('AudioWorklet is not supported');
      await ctx.audioWorklet.addModule('/tl3-lp-worklet.js?v=lp-enhanced-stateful-20261018');
      workletReady = true;
      const createProcessor = function(p) {
        const node = new global.AudioWorkletNode(ctx, 'tl3-reference-lp', {
          numberOfInputs:1, numberOfOutputs:1, outputChannelCount:[2],
          channelCount:2, channelCountMode:'explicit', channelInterpretation:'speakers',
          processorOptions:{g:p.g,seed:p.seed,durationMs:Number(p.duration_ms || p.durationMs || 0)}
        });
        node.port.onmessage = function(event) {
          const d = event.data || {};
          if (d.type === 'audio-levels') {
            audioEl._tl3LpLevels = d;
            if (d.inputRms === 0) console.warn('[LP-ENHANCED] processor receives silent input', d);
          }
        };
        node.connect(master);
        return node;
      };
      processor = createProcessor(profile);
      source.connect(master); // native sound is the default until the listener opts in
    } catch (error) {
      console.warn('[LP-ENHANCED] Worklet unavailable; LP toggle remains unavailable and native audio is retained.', error);
      disconnect(processor);
      processor = null;
      disconnect(source);
      source.connect(master);
      mode = 'native-passthrough';
    }
    const controller = {
      licensed:true,
      enabled:enabled,
      mode:mode,
      profile:profile,
      available:!!processor,
      updateProfile:async function(nextMeta) {
        if (destroyed) return false;
        const nextProfile = resolvedProfile(nextMeta);
        routeBusy = routeBusy.then(async function() {
          if (destroyed) return false;
          // A new asset starts in native mode; the listener may opt in again.
          disconnect(source);
          if (processor) {
            disconnect(processor);
            if (processor.port) processor.port.onmessage = null;
          }
          enabled = false;
          mode = 'native-passthrough';
          source.connect(master);
          profile = nextProfile;
          controller.profile = nextProfile;
          if (!workletReady) {
            processor = null;
            controller.available = false;
            return false;
          }
          try {
            processor = new global.AudioWorkletNode(ctx, 'tl3-reference-lp', {
              numberOfInputs:1, numberOfOutputs:1, outputChannelCount:[2],
              channelCount:2, channelCountMode:'explicit', channelInterpretation:'speakers',
              processorOptions:{g:profile.g,seed:profile.seed,durationMs:Number(profile.duration_ms || profile.durationMs || 0)}
            });
            processor.port.onmessage = function(event) {
              const d = event.data || {};
              if (d.type === 'audio-levels') {
                audioEl._tl3LpLevels = d;
                if (d.inputRms === 0) console.warn('[LP-ENHANCED] processor receives silent input', d);
              }
            };
            processor.connect(master);
            controller.available = true;
            controller.enabled = false;
            controller.mode = mode;
            if (ctx.state === 'suspended' && !audioEl.paused) await ctx.resume().catch(function(){});
            return true;
          } catch (error) {
            processor = null;
            controller.available = false;
            console.warn('[LP-ENHANCED] profile refresh failed; native playback retained.', error);
            return false;
          }
        });
        return routeBusy;
      },
      setEnabled:async function(next){const ok=await setEnabled(next);controller.enabled=enabled;controller.mode=mode;return ok;},
      resume:resume,
      stop:stop,
      state:function(){return ctx.state;},
      destroy:async function(){
        if (destroyed) return;
        destroyed = true;
        audioEl.removeEventListener('playing',resume);
        disconnect(source); disconnect(processor); disconnect(master);
        if (processor) processor.port.onmessage = null;
        if (ctx.state !== 'closed') await ctx.close().catch(function(){});
        if (audioEl._tl3AudioController === controller) audioEl._tl3AudioController = null;
      }
    };
    audioEl._tl3AudioController = controller;
    audioEl.addEventListener('playing',resume);
    console.info('[LP-ENHANCED] independent player connector ready', {
      mode:mode,licensed:true,defaultEnabled:false,profile:profile.version,seed:profile.seed
    });
    if (!audioEl.paused && ctx.state === 'suspended') await ctx.resume().catch(function(){});
    return controller;
  }
  global.TL3Audio = {attach:attach,defaultProfile:DEFAULT,version:'lp-player-connector-v2'};
})(window);
