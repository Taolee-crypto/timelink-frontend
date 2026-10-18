/* TL3 reference LP runtime — AudioWorklet port of tl3_lp_test.html / tl3-lp.js.
 * Stateful processing is retained across MSE segment boundaries.
 * The offline renderer's whole-file peak normalization is replaced by a
 * streaming safety limiter because future samples are not available live.
 */
(function () {
  'use strict';

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function prng(seed) {
    let a = seed | 0;
    return function () {
      a |= 0;
      a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function coeff(type, frequency, sampleRate, q) {
    const w = 2 * Math.PI * frequency / sampleRate;
    const c = Math.cos(w), s = Math.sin(w) / (2 * (q || 0.7071));
    const a0 = 1 + s;
    return {
      b0: (type === 'hp' ? (1 + c) / 2 : (1 - c) / 2) / a0,
      b1: (type === 'hp' ? -(1 + c) : (1 - c)) / a0,
      b2: (type === 'hp' ? (1 + c) / 2 : (1 - c) / 2) / a0,
      a1: (-2 * c) / a0,
      a2: (1 - s) / a0
    };
  }
  function biquad(state, c, x) {
    const y = c.b0 * x + c.b1 * state.x1 + c.b2 * state.x2
      - c.a1 * state.y1 - c.a2 * state.y2;
    state.x2 = state.x1; state.x1 = x;
    state.y2 = state.y1; state.y1 = y;
    return y;
  }
  function freshBiquad() { return { x1: 0, x2: 0, y1: 0, y2: 0 }; }

  class TL3ReferenceLPProcessor extends AudioWorkletProcessor {
    constructor(options) {
      super();
      const p = options.processorOptions || {};
      const g = p.g || {};
      this.g = {
        Gd: clamp(Number(g.Gd ?? 0.5), 0, 1),
        Gw: clamp(Number(g.Gw ?? 0.5), 0, 1),
        Gv: clamp(Number(g.Gv ?? 0.4), 0, 1),
        Gp: clamp(Number(g.Gp ?? 0.2), 0, 1),
        Gs: clamp(Number(g.Gs ?? 0.45), 0, 1),
        Gi: clamp(Number(g.Gi ?? 0.5), 0, 1),
        Gt: clamp(Number(g.Gt ?? 0.2), 0, 1),
        Gm: clamp(Number(g.Gm ?? 1), 0, 1),
        nz: clamp(Number(g.nz ?? -48), -70, -30)
      };
      this.seed = Number(p.seed ?? 7) | 0;
      this.totalFrames = Math.max(0, Number(p.durationMs || 0) * sampleRate / 1000);
      this.frame = 0;
      this.dt = 1 / sampleRate;
      this.hpC = coeff('hp', 30 + 20 * this.g.Gd, sampleRate);
      this.sideC = coeff('lp', 180, sampleRate);
      this.hpL = freshBiquad(); this.hpR = freshBiquad();
      this.sideLP = freshBiquad();
      this.channels = [this.makeChannel(0), this.makeChannel(1)];
      this.wowRate = 5 + 3 * prng(this.seed * 131 + 1)();
      this.wowPhase = prng(this.seed * 131 + 1)() * 6.283;
      this.wowPhase2 = prng(this.seed * 131 + 7919 + 1)() * 6.283;
      this.wowDelay = [new Float32Array(Math.ceil(sampleRate * 0.04) + 8), new Float32Array(Math.ceil(sampleRate * 0.04) + 8)];
      this.wowWrite = 0;
      this.wowBase = 0.012;
      this.noiseAmp = Math.pow(10, this.g.nz / 20);
      this.gain = 1;
      this.port.onmessage = (event) => {
        if (event.data && event.data.type === 'profile') this.port.postMessage({ type: 'profile-ack' });
      };
    }

    makeChannel(index) {
      const rnd = prng(this.seed * 131 + index * 7919 + 1);
      const rcH = 1 / (2 * Math.PI * 3000);
      const ah = rcH / (rcH + this.dt);
      const a10 = this.dt / (1 / (2 * Math.PI * 10000) + this.dt);
      const tau = Math.max(1, Math.floor(0.0005 * sampleRate));
      const lam = 0.2 + 3 * this.g.Gs;
      return {
        rnd, ah, a10, lp: 0, hx: 0, hy: 0, bl: 0, env: 0,
        al: 0, beta: 0, fcBlock: -1,
        noiseLP: 0, tau, lam,
        nextClick: Math.max(1, Math.floor(-Math.log(1 - rnd()) / lam * sampleRate)),
        clickAge: tau * 7, clickAmp: 0
      };
    }

    process(inputs, outputs) {
      const input = inputs[0], output = outputs[0];
      if (!output || !output.length) return true;
      const outL = output[0], outR = output[1] || output[0];
      const inL = input && input[0], inR = input && (input[1] || input[0]);
      if (!inL || !inR) {
        outL.fill(0);
        if (outR !== outL) outR.fill(0);
        return true;
      }
      const g = this.g;
      for (let i = 0; i < outL.length; i++, this.frame++) {
        let l = biquad(this.hpL, this.hpC, inL[i]);
        let r = biquad(this.hpR, this.hpC, inR[i]);
        const side = (l - r) * 0.5;
        const sideLow = biquad(this.sideLP, this.sideC, side);
        const mid = (l + r) * 0.5;
        const wide = side - g.Gm * sideLow;
        l = mid + wide;
        r = mid - wide;

        const progress = this.totalFrames > 0 ? clamp(this.frame / this.totalFrames, 0, 1) : 0;
        const gi = clamp(g.Gi * (1 + progress), 0, 1);
        const fc = 16000 - 7000 * g.Gw - 4000 * gi;
        if ((this.frame & 1023) === 0 || this.channels[0].fcBlock !== Math.floor(this.frame / 1024)) {
          const rc = 1 / (2 * Math.PI * fc);
          const al = this.dt / (rc + this.dt);
          const beta = 0.08 * (1 + gi);
          for (const ch of this.channels) { ch.al = al; ch.beta = beta; ch.fcBlock = Math.floor(this.frame / 1024); }
        }
        let a = this.processChannel(l, this.channels[0], 0);
        let b = this.processChannel(r, this.channels[1], 1);

        // The reference renderer time-warps with a tiny variable resampling
        // increment. A continuous modulated delay preserves that wow/flutter
        // character without resetting phase at each one-second TL3 segment.
        const t = this.frame / sampleRate;
        const delaySeconds = this.wowBase
          + g.Gp * 0.00070 * Math.sin(2 * Math.PI * 0.55 * t)
          + 0.00010 * Math.sin(2 * Math.PI * this.wowRate * t + this.wowPhase);
        const delaySamples = clamp(delaySeconds * sampleRate, 1, this.wowDelay[0].length - 3);
        const readAt = (this.wowWrite - delaySamples + this.wowDelay[0].length) % this.wowDelay[0].length;
        const idx = Math.floor(readAt), frac = readAt - idx;
        const next = (idx + 1) % this.wowDelay[0].length;
        const delayedL = this.wowDelay[0][idx] * (1 - frac) + this.wowDelay[0][next] * frac;
        const delayedR = this.wowDelay[1][idx] * (1 - frac) + this.wowDelay[1][next] * frac;
        this.wowDelay[0][this.wowWrite] = a;
        this.wowDelay[1][this.wowWrite] = b;
        this.wowWrite = (this.wowWrite + 1) % this.wowDelay[0].length;
        a = delayedL; b = delayedR;

        // Streaming equivalent of the reference's seeded surface noise and
        // stochastic click events. PRNG/filter/click state survives segments.
        a += this.surfaceNoise(this.channels[0], a);
        b += this.surfaceNoise(this.channels[1], b);

        // Whole-file peak normalization cannot be known during live streaming;
        // apply a fast safety limiter only when a transient exceeds 0.98.
        const peak = Math.max(Math.abs(a), Math.abs(b));
        const target = peak > 0.98 ? 0.98 / peak : 1;
        this.gain += (target < this.gain ? 0.35 : 0.002) * (target - this.gain);
        outL[i] = clamp(a * this.gain, -0.999, 0.999);
        outR[i] = clamp(b * this.gain, -0.999, 0.999);
      }
      return true;
    }

    processChannel(x, ch) {
      const a = 1 + 2.5 * this.g.Gt;
      ch.lp += ch.al * (Math.tanh(a * x) + ch.beta * this.g.Gt * x * x * Math.sign(x) - ch.lp);
      const hp = ch.ah * (ch.hy + ch.lp - ch.hx);
      ch.hx = ch.lp; ch.hy = hp;
      ch.bl += ch.a10 * (hp - ch.bl);
      const abs = Math.abs(ch.bl);
      ch.env += (abs > ch.env ? 0.02 : 0.0006) * (abs - ch.env);
      return ch.lp - ch.bl + ch.bl * (ch.env > 0.05 ? Math.pow(0.05 / ch.env, 0.667) : 1);
    }

    surfaceNoise(ch, signal) {
      const rnd = ch.rnd;
      ch.noiseLP += 0.45 * ((rnd() * 2 - 1) - ch.noiseLP);
      let noise = ch.noiseLP * this.noiseAmp * 2.5;
      if (this.frame >= ch.nextClick) {
        ch.clickAmp = (0.2 + 0.8 * rnd()) * this.noiseAmp * 40 * (rnd() < 0.5 ? -1 : 1);
        ch.clickAge = 0;
        ch.nextClick += Math.max(1, Math.floor(-Math.log(1 - rnd()) / ch.lam * sampleRate));
      }
      if (ch.clickAge < ch.tau * 6) {
        const j = ch.clickAge++;
        noise += ch.clickAmp * Math.exp(-j / ch.tau) * Math.sin(2 * Math.PI * 2500 * j / sampleRate);
      }
      return noise * (1 - clamp(3 * Math.abs(signal), 0, 0.85)) * this.g.Gs;
    }
  }

  registerProcessor('tl3-reference-lp', TL3ReferenceLPProcessor);
})();
