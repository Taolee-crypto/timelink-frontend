/* tl3-lp-diff.js — LP 차분 엔진 */
(function(global){
  var SCALE = 128;

  function makeDiff(L0, R0, Lp, Rp){
    var n = L0.length, dL = new Int8Array(n), dR = new Int8Array(n);
    for(var i = 0; i < n; i++){
      var a = Math.round((Lp[i] - L0[i]) * SCALE);
      var b = Math.round((Rp[i] - R0[i]) * SCALE);
      dL[i] = a > 127 ? 127 : (a < -128 ? -128 : a);
      dR[i] = b > 127 ? 127 : (b < -128 ? -128 : b);
    }
    return { dL: dL, dR: dR, n: n, scale: SCALE };
  }

  function applyDiff(L0, R0, diff){
    var inv = 1 / diff.scale;
    for(var i = 0; i < diff.n; i++){
      L0[i] += diff.dL[i] * inv;
      R0[i] += diff.dR[i] * inv;
    }
  }

  async function packDiff(diff){
    var raw = new Uint8Array(diff.n * 2);
    for(var i = 0; i < diff.n; i++){
      raw[i*2] = diff.dL[i] + 128;
      raw[i*2+1] = diff.dR[i] + 128;
    }
    if(typeof CompressionStream === 'undefined') return { codec:'raw', bytes: raw, n: diff.n, scale: diff.scale };
    var cs = new CompressionStream('deflate');
    var w = cs.writable.getWriter();
    w.write(raw); w.close();
    var out = new Uint8Array(await new Response(cs.readable).arrayBuffer());
    return { codec:'deflate', bytes: out, n: diff.n, scale: diff.scale };
  }

  async function unpackDiff(p){
    var raw;
    if(p.codec === 'raw'){ raw = p.bytes; }
    else {
      var ds = new DecompressionStream('deflate');
      var w = ds.writable.getWriter();
      w.write(p.bytes); w.close();
      raw = new Uint8Array(await new Response(ds.readable).arrayBuffer());
    }
    var n = raw.length / 2, dL = new Int8Array(n), dR = new Int8Array(n);
    for(var i = 0; i < n; i++){
      dL[i] = raw[i*2] - 128;
      dR[i] = raw[i*2+1] - 128;
    }
    return { dL: dL, dR: dR, n: n, scale: p.scale };
  }

  global.TL3_LP_DIFF = { makeDiff: makeDiff, applyDiff: applyDiff, packDiff: packDiff, unpackDiff: unpackDiff };
})(window);
