'use strict';
/**
 * TimeLink TL3 Server
 * ----------------------------------------------------------------------------
 * Provides the missing piece for TimeLink music playback:
 *   1. MP3  -> TL3 conversion  (POST /api/convert  or  POST /api/upload)
 *   2. TL3  -> audio stream     (GET  /api/stream/:id  with Range support)
 *   3. JSON catalog + metadata  (GET  /api/tracks)
 *
 * TL3 container format (v2), identical to the browser encoder in
 * public/creator.html so the same files work in both places:
 *
 *   offset  size  field
 *   0       4     magic "TLNK" (0x54 0x4C 0x4E 0x4B)
 *   4       1     version (0x02)
 *   5       2     metadata length (big-endian uint16)
 *   7       N     metadata JSON (UTF-8)
 *   7+N     M     XOR-encrypted MP3 payload
 *
 * The XOR key is shared with the client (see XOR_KEY) so the browser can
 * decode the payload and feed it to an <audio> element via a Blob URL.
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();

const PORT = process.env.PORT || 8787;
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const TRACKS_DIR = path.join(DATA_DIR, 'tracks');
const DB_FILE = path.join(DATA_DIR, 'catalog.json');

const XOR_KEY = Buffer.from('TIMELINK_XOR_KEY_2026_SECURE', 'binary');
const TLNK_MAGIC = Buffer.from([0x54, 0x4c, 0x4e, 0x4b]); // "TLNK"

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------
fs.mkdirSync(TRACKS_DIR, { recursive: true });

function loadCatalog() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function saveCatalog(list) {
  fs.writeFileSync(DB_FILE, JSON.stringify(list, null, 2));
}

// ---------------------------------------------------------------------------
// TL3 codec
// ---------------------------------------------------------------------------
function xorTransform(data, key = XOR_KEY) {
  const out = Buffer.allocUnsafe(data.length);
  const kl = key.length;
  for (let i = 0; i < data.length; i++) out[i] = data[i] ^ key[i % kl];
  return out;
}

function buildTL3(meta, mp3Buf) {
  const metaBuf = Buffer.from(JSON.stringify(meta), 'utf8');
  if (metaBuf.length > 0xffff) throw new Error('metadata too large for TL3 header');
  const enc = xorTransform(mp3Buf);
  const header = Buffer.alloc(7);
  TLNK_MAGIC.copy(header, 0);
  header[4] = 0x02;
  header.writeUInt16BE(metaBuf.length, 5);
  return Buffer.concat([header, metaBuf, enc]);
}

function parseTL3(buf) {
  if (buf.length < 7 || !buf.subarray(0, 4).equals(TLNK_MAGIC)) {
    throw new Error('not a TL3 file (bad magic)');
  }
  const version = buf[4];
  const mlen = buf.readUInt16BE(5);
  const meta = JSON.parse(buf.subarray(7, 7 + mlen).toString('utf8'));
  const enc = buf.subarray(7 + mlen);
  return { version, meta, audio: xorTransform(enc) };
}

// ---------------------------------------------------------------------------
// Multer (in-memory, audio only)
// ---------------------------------------------------------------------------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (/audio\/|\.mp3$|\.wav$|\.flac$|\.m4a$|\.ogg$/i.test(file.mimetype + file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('audio file required (mp3/wav/flac/m4a/ogg)'));
    }
  }
});

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(express.json({ limit: '1mb' }));
app.use(express.static(PUBLIC_DIR, { extensions: ['html'] }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
  res.header('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges, Content-Length');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'timelink-tl3', time: new Date().toISOString() });
});

// List catalog (optionally add ?genre=)
app.get('/api/tracks', (req, res) => {
  let list = loadCatalog();
  if (req.query.genre) {
    list = list.filter((t) => (t.genre || '').toLowerCase() === String(req.query.genre).toLowerCase());
  }
  res.json({ ok: true, count: list.length, tracks: list });
});

// Fetch single track metadata
app.get('/api/tracks/:id', (req, res) => {
  const t = loadCatalog().find((x) => x.id === req.params.id);
  if (!t) return res.status(404).json({ ok: false, error: 'track not found' });
  res.json({ ok: true, track: t });
});

// Serve TL3 file with Range support so <audio> can stream/seek.
app.get('/api/stream/:id', (req, res) => {
  const t = loadCatalog().find((x) => x.id === req.params.id);
  if (!t) return res.status(404).json({ ok: false, error: 'track not found' });
  const file = path.join(TRACKS_DIR, t.file);
  if (!fs.existsSync(file)) return res.status(404).json({ ok: false, error: 'file missing' });

  const stat = fs.statSync(file);
  const range = req.headers.range;

  // TL3 is a container; the browser only needs the bytes. We advertise
  // audio/mpeg so <audio> is willing to load it (client XOR-decodes anyway).
  res.set('Content-Type', 'audio/mpeg');
  res.set('Accept-Ranges', 'bytes');

  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    let start = m && m[1] ? parseInt(m[1], 10) : 0;
    let end = m && m[2] ? parseInt(m[2], 10) : stat.size - 1;
    if (isNaN(start) || start < 0) start = 0;
    if (isNaN(end) || end >= stat.size) end = stat.size - 1;
    if (start > end) return res.status(416).set('Content-Range', `bytes */${stat.size}`).end();
    res.status(206);
    res.set('Content-Range', `bytes ${start}-${end}/${stat.size}`);
    res.set('Content-Length', String(end - start + 1));
    fs.createReadStream(file, { start, end }).pipe(res);
  } else {
    res.set('Content-Length', String(stat.size));
    fs.createReadStream(file).pipe(res);
  }
});

/**
 * Core conversion: receive an audio file + metadata, persist TL3, record catalog.
 * Shared by /api/convert and /api/upload.
 */
function handleConvert(req, res) {
  try {
    if (!req.file) return res.status(400).json({ ok: false, error: 'file is required' });

    const orig = req.file.buffer;
    const body = req.body || {};
    const title = (body.title || path.basename(req.file.originalname, path.extname(req.file.originalname)) || 'Untitled').trim();
    const artist = (body.artist || body.username || 'Unknown Artist').trim();
    const genre = (body.genre || body.category || 'Music').trim();
    const duration = Number(body.duration) || 0;
    const bpm = Number(body.bpm) || 0;

    const id = 'tl3_' + Date.now() + '_' + crypto.randomBytes(3).toString('hex');
    const fileName = id + '.tl3';
    const hash = crypto.createHash('sha256').update(orig).digest('hex');

    const meta = {
      v: 2,
      fmt: 'mp3',
      dur: duration,
      bpm,
      genre,
      title,
      artist,
      cid: body.user_id ? String(body.user_id) : '',
      name: artist,
      plan: body.plan || 'A',
      ts: new Date().toISOString(),
      hash,
      enc: 'xor',
      key_id: 'k_2026_01'
    };

    const tl3 = buildTL3(meta, orig);
    fs.writeFileSync(path.join(TRACKS_DIR, fileName), tl3);

    const record = {
      id,
      title,
      artist,
      album: (body.album || '').trim(),
      genre,
      duration,
      bpm,
      file: fileName,
      size: tl3.length,
      original_size: orig.length,
      hash,
      file_type: 'audio/tl3',
      cover_url: body.cover_url || '',
      stream_url: `/api/stream/${id}`,
      created_at: Date.now()
    };

    const catalog = loadCatalog();
    catalog.unshift(record);
    saveCatalog(catalog);

    res.json({ ok: true, track: record, stream_url: record.stream_url });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}

app.post('/api/convert', upload.single('file'), handleConvert);
app.post('/api/upload', upload.single('file'), handleConvert);

/**
 * Decode endpoint — returns the raw MP3 bytes (for download / verification).
 */
app.get('/api/decode/:id', (req, res) => {
  const t = loadCatalog().find((x) => x.id === req.params.id);
  if (!t) return res.status(404).json({ ok: false, error: 'track not found' });
  try {
    const buf = fs.readFileSync(path.join(TRACKS_DIR, t.file));
    const { audio, meta } = parseTL3(buf);
    res.set('Content-Type', 'audio/mpeg');
    res.set('Content-Disposition', `inline; filename="${t.id}.mp3"`);
    res.set('X-TL3-Meta', Buffer.from(JSON.stringify(meta)).toString('base64'));
    res.send(audio);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.delete('/api/tracks/:id', (req, res) => {
  const catalog = loadCatalog();
  const idx = catalog.findIndex((x) => x.id === req.params.id);
  if (idx < 0) return res.status(404).json({ ok: false, error: 'track not found' });
  const [removed] = catalog.splice(idx, 1);
  try { fs.unlinkSync(path.join(TRACKS_DIR, removed.file)); } catch (e) {}
  saveCatalog(catalog);
  res.json({ ok: true, removed: removed.id });
});

// ---------------------------------------------------------------------------
// Error handler
// ---------------------------------------------------------------------------
app.use((err, req, res, next) => {
  if (err) return res.status(400).json({ ok: false, error: err.message });
  next();
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TimeLink TL3] listening on http://0.0.0.0:${PORT}`);
    console.log(`[TimeLink TL3] serving static from ${PUBLIC_DIR}`);
  });
}

module.exports = { app, buildTL3, parseTL3, xorTransform };
