/*! tl3-lp.js — TimeLink LP 음질 개선 모듈 (v3)
 *  원본: tl3_lp_test.html (참조 구현)
 *  용도: creator.html에서 MP3 → LP WAV 변환
 *  사용:
 *    var an = TL3_LP.analyze(L, R, fs);
 *    var g = TL3_LP.calcG(an, seed);
 *    var out = TL3_LP.render(L, R, fs, g, seed);
 *    var wav = TL3_LP.wavFromBuffers(out.L, out.R, out.fs);
 */
(function(global){
  'use strict';
  var cl = function(v,a,b){ a=a||0; b=(b===undefined)?1:b; return Math.min(b,Math.max(a,v)); };

  function prng(a){
    return function(){
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function fft(re, im){
    var n = re.length;
    for(var i=1,j=0;i<n;i++){
      var b = n>>1;
      for(;j&b;b>>=1) j ^= b;
      j ^= b;
      if(i<j){ var t=re[i]; re[i]=re[j]; re[j]=t; t=im[i]; im[i]=im[j]; im[j]=t; }
    }
    for(var l=2;l<=n;l<<=1){
      var w = -2*Math.PI/l;
      for(var i2=0;i2<n;i2+=l){
        for(var k=0;k<l/2;k++){
          var c = Math.cos(w*k), s = Math.sin(w*k);
          var a = i2+k, b2 = a+l/2;
          var xr = re[b2]*c - im[b2]*s;
          var xi = re[b2]*s + im[b2]*c;
          re[b2] = re[a]-xr; im[b2] = im[a]-xi;
          re[a] += xr; im[a] += xi;
        }
      }
    }
  }

  function analyze(L, R, fs){
    var n = L.length, ss=0, pk=0;
    for(var i=0;i<n;i++){
      var m = (L[i]+R[i])/2;
      ss += m*m;
      pk = Math.max(pk, Math.abs(L[i]), Math.abs(R[i]));
    }
    var r = Math.sqrt(ss/n), N=2048, hop=Math.max(N, Math.floor(n/150));
    var re = new Float64Array(N), im = new Float64Array(N);
    var cs=0, hs=0, k=0;
    for(var s=0;s+N<=n;s+=hop){
      for(var i2=0;i2<N;i2++){
        re[i2] = (L[s+i2]+R[s+i2])/2 * (.5-.5*Math.cos(2*Math.PI*i2/N));
        im[i2] = 0;
      }
      fft(re, im);
      var tot=0, hi=0, w=0;
      for(var b=1;b<N/2;b++){
        var p = re[b]*re[b] + im[b]*im[b];
        var f = b*fs/N;
        tot += p;
        w += p*f;
        if(f>=8000) hi += p;
      }
      if(tot>0){ cs += w/tot; hs += hi/tot; k++; }
    }
    var h = k ? hs/k : 0;
    return {
      r: r, p: pk,
      c: k ? cs/k : 2000,
      h: h,
      DR: pk/(r+1e-9),
      gam: 1-h,
      dur: n/fs
    };
  }

  function calcG(a, seed){
    var g = {}, u = prng(seed)();
    var Ls = cl(a.dur/1200);
    g.Gd = cl(.3+.4*(1-a.gam));
    if(a.DR>20) g.Gd *= .7;
    g.Gw = cl(.4+.3*a.h);
    g.Gv = cl(.2+.5*a.gam);
    g.Gp = .15 + .25*u;
    g.Gs = .25 + .35*a.gam;
    g.Gi = cl(.3+.4*a.c/5000 + .3*Ls);
    g.Gt = .4 + .3*(1-a.gam);
    g.Gm = 1;
    if(a.gam>=.9){ g.Gv=cl(g.Gv*1.1); g.Gs=cl(g.Gs*1.1); g.Gt=cl(g.Gt*1.1); }
    g.nz = -48;
    return g;
  }

  function bq(x, type, f, fs, Q){
    Q = Q || .7071;
    var w = 2*Math.PI*f/fs, c = Math.cos(w), s = Math.sin(w)/(2*Q);
    var a0 = 1+s, a1 = -2*c, a2 = 1-s;
    var b1 = type=='hp' ? -(1+c) : 1-c;
    var b0 = type=='hp' ? (1+c)/2 : (1-c)/2;
    var y = new Float32Array(x.length);
    var x1=0,x2=0,y1=0,y2=0;
    for(var i=0;i<x.length;i++){
      var v = (b0*x[i] + b1*x1 + b0*x2 - a1*y1 - a2*y2)/a0;
      x2=x1; x1=x[i]; y2=y1; y1=v;
      y[i]=v;
    }
    return y;
  }

  function render(L0, R0, fs, g, seed){
    var n = L0.length, dt = 1/fs;
    var L = bq(L0, 'hp', 30+20*g.Gd, fs);
    var R = bq(R0, 'hp', 30+20*g.Gd, fs);
    var S = new Float32Array(n);
    for(var i=0;i<n;i++) S[i] = (L[i]-R[i])/2;
    var SLo = bq(S, 'lp', 180, fs);
    for(var i2=0;i2<n;i2++){
      var M = (L[i2]+R[i2])/2, s2 = S[i2] - g.Gm*SLo[i2];
      L[i2] = M + s2;
      R[i2] = M - s2;
    }
    var amp = Math.pow(10, g.nz/20);
    var ch = function(x, c){
      var rnd = prng(seed*131 + c*7919 + 1);
      var y = new Float32Array(n);
      var a = 1 + 2.5*g.Gt;
      var rcH = 1/(2*Math.PI*3000);
      var ah = rcH/(rcH+dt);
      var a10 = dt/(1/(2*Math.PI*10000)+dt);
      var lp=0, hx=0, hy=0, bl=0, env=0, al=0, beta=0, gi=0;
      for(var i=0;i<n;i++){
        if(i%1024==0){
          gi = cl(g.Gi*(1+i/n));
          var fc = 16000 - 7000*g.Gw - 4000*gi;
          var rc = 1/(2*Math.PI*fc);
          al = dt/(rc+dt);
          beta = .08*(1+gi);
        }
        var v = x[i];
        lp += al*(Math.tanh(a*v) + beta*g.Gt*v*v*Math.sign(v) - lp);
        var hp = ah*(hy+lp-hx); hx = lp; hy = hp;
        bl += a10*(hp-bl);
        var ab = Math.abs(bl);
        env += (ab>env?.02:.0006)*(ab-env);
        y[i] = lp - bl + bl*(env>.05 ? Math.pow(.05/env, .667) : 1);
      }
      var z = new Float32Array(n), ff = 5+3*rnd(), ph = rnd()*6.283;
      var rp = 0;
      for(var i2=0;i2<n;i2++){
        var t = i2/fs, k = Math.floor(rp), f = rp-k;
        z[i2] = k+1<n ? y[k]*(1-f)+y[k+1]*f : 0;
        rp += 1 + g.Gp*.012*Math.sin(2*Math.PI*.55*t) + .004*Math.sin(2*Math.PI*ff*t+ph);
      }
      var nu = new Float32Array(n), hl = 0;
      for(var i3=0;i3<n;i3++){
        hl += .45*((rnd()*2-1)-hl);
        nu[i3] = hl*amp*2.5;
      }
      var lam = .2+3*g.Gs, tau = .0005*fs;
      var tk = -Math.log(1-rnd())/lam;
      while(tk*fs < n){
        var s0 = Math.floor(tk*fs);
        var A2 = (.2+.8*rnd())*amp*40*(rnd()<.5?-1:1);
        for(var j=0;j<tau*6 && s0+j<n;j++){
          nu[s0+j] += A2*Math.exp(-j/tau)*Math.sin(2*Math.PI*2500*j/fs);
        }
        tk += -Math.log(1-rnd())/lam;
      }
      for(var i4=0;i4<n;i4++){
        z[i4] += nu[i4]*(1-cl(3*Math.abs(z[i4]),0,.85))*g.Gs;
      }
      return z;
    };
    var A = ch(L, 0), B = ch(R, 1);
    var mx = 1e-9;
    for(var i5=0;i5<n;i5++) mx = Math.max(mx, Math.abs(A[i5]), Math.abs(B[i5]));
    var k2 = .98/mx;
    for(var i6=0;i6<n;i6++){ A[i6]*=k2; B[i6]*=k2; }
    return { L: A, R: B, fs: fs };
  }

  function wavFromBuffers(L, R, fs){
    var n = L.length;
    var buf = new ArrayBuffer(44 + n*4);
    var view = new DataView(buf);
    var ws = function(o, s){ for(var i=0;i<s.length;i++) view.setUint8(o+i, s.charCodeAt(i)); };
    ws(0, 'RIFF');
    view.setUint32(4, 36 + n*4, true);
    ws(8, 'WAVEfmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 2, true);
    view.setUint32(24, fs, true);
    view.setUint32(28, fs*4, true);
    view.setUint16(32, 4, true);
    view.setUint16(34, 16, true);
    ws(36, 'data');
    view.setUint32(40, n*4, true);
    for(var i=0;i<n;i++){
      var lv = cl(L[i], -1, 1) * 32767;
      var rv = cl(R[i], -1, 1) * 32767;
      view.setInt16(44 + i*4, lv, true);
      view.setInt16(46 + i*4, rv, true);
    }
    return buf;
  }

  global.TL3_LP = {
    analyze: analyze,
    calcG: calcG,
    render: render,
    wavFromBuffers: wavFromBuffers,
    version: 'lp-v1'
  };
})(window);
