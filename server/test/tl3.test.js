'use strict';
/**
 * Minimal round-trip test for the TL3 codec (no external test framework).
 *   node test/tl3.test.js
 */
const assert = require('assert');
const { buildTL3, parseTL3, xorTransform } = require('../server.js');

// Fake "mp3" payload — the codec is byte-agnostic, so any bytes round-trip.
const mp3 = Buffer.from(Array.from({ length: 4096 }, (_, i) => (i * 7) & 0xff));
const meta = { v: 2, fmt: 'mp3', dur: 3, bpm: 120, title: 'Test', enc: 'xor', key_id: 'k_2026_01' };

const tl3 = buildTL3(meta, mp3);

// magic + version
assert.strictEqual(tl3.subarray(0, 4).toString('binary'), 'TLNK');
assert.strictEqual(tl3[4], 0x02);

// parse back
const { version, meta: meta2, audio } = parseTL3(tl3);
assert.strictEqual(version, 2);
assert.strictEqual(meta2.title, 'Test');
assert.ok(audio.equals(mp3), 'decoded audio must equal original');

// xor is an involution
assert.ok(xorTransform(xorTransform(mp3)).equals(mp3));

// overhead should be just the header + metadata
const overhead = tl3.length - mp3.length;
assert.ok(overhead > 0 && overhead < 400, 'overhead should be small');

console.log('TL3 codec tests passed');
console.log('  payload:', mp3.length, 'bytes  tl3:', tl3.length, 'bytes  overhead:', overhead);
