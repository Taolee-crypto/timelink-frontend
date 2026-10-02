const http = require('http');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');

const HOST = '127.0.0.1';
const PORT = Number(process.env.TIMELINK_LOCAL_PORT || 8787);
const MAX_FILE = 500 * 1024 * 1024;
const DATA_DIR = path.join(
  process.env.APPDATA || process.env.HOME || process.cwd(),
  'TimeLink',
  'shared'
);

const files = new Map();
let tunnel = null;
let publicBaseUrl = process.env.TIMELINK_PUBLIC_BASE_URL || '';

function json(res, status, body) {
  const data = Buffer.from(JSON.stringify(body));
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': data.length,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(data);
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function safeName(name) {
  const base = path.basename(String(name || 'audio.mp3')).replace(/[^a-zA-Z0-9._ -]/g, '_');
  return base.toLowerCase().endsWith('.mp3') ? base : base + '.mp3';
}

function startTunnel() {
  if (publicBaseUrl || tunnel) return;
  const bin = process.env.CLOUDFLARED_BIN || 'cloudflared';
  tunnel = spawn(bin, ['tunnel', '--url', `http://${HOST}:${PORT}`, '--no-autoupdate'], {
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  const inspect = chunk => {
    const text = chunk.toString();
    const m = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/i);
    if (m && !publicBaseUrl) {
      publicBaseUrl = m[0].replace(/\/$/, '');
      console.log('TimeLink public URL:', publicBaseUrl);
    }
  };
  tunnel.stdout.on('data', inspect);
  tunnel.stderr.on('data', inspect);
  tunnel.on('error', err => {
    console.error('cloudflared start failed:', err.message);
    tunnel = null;
  });
  tunnel.on('exit', code => {
    console.log('cloudflared exited:', code);
    tunnel = null;
    if (!process.env.TIMELINK_PUBLIC_BASE_URL) publicBaseUrl = '';
  });
}

async function handleUpload(req, res, url) {
  const name = safeName(url.searchParams.get('name'));
  const token = crypto.randomBytes(18).toString('hex');
  const filePath = path.join(DATA_DIR, token + '-' + name);
  await fsp.mkdir(DATA_DIR, { recursive: true });

  const declared = Number(req.headers['content-length'] || 0);
  if (declared > MAX_FILE) {
    json(res, 413, { ok: false, error: '파일이 너무 큽니다 (최대 500MB)' });
    req.resume();
    return;
  }

  let total = 0;
  const out = fs.createWriteStream(filePath, { flags: 'wx' });

  req.on('data', chunk => {
    total += chunk.length;
    if (total > MAX_FILE) req.destroy(new Error('FILE_TOO_LARGE'));
  });

  try {
    await new Promise((resolve, reject) => {
      req.on('error', reject);
      out.on('error', reject);
      out.on('finish', resolve);
      req.pipe(out);
    });
    if (total === 0) throw new Error('빈 파일입니다.');
    files.set(token, { path: filePath, name, size: total, createdAt: Date.now() });
    startTunnel();

    const waitUntil = Date.now() + 30000;
    while (!publicBaseUrl && Date.now() < waitUntil) {
      await new Promise(r => setTimeout(r, 250));
    }
    if (!publicBaseUrl) {
      await fsp.rm(filePath, { force: true });
      files.delete(token);
      return json(res, 503, {
        ok: false,
        error: '공개 터널을 만들지 못했습니다. TimeLink Local 창에서 cloudflared 오류를 확인하십시오.'
      });
    }

    json(res, 200, {
      ok: true,
      token,
      name,
      size: total,
      public_url: publicBaseUrl + '/local/' + token,
      stream_url: publicBaseUrl + '/local/' + token,
      storage_mode: 'creator_pc'
    });
  } catch (e) {
    out.destroy();
    await fsp.rm(filePath, { force: true }).catch(() => {});
    if (e.message === 'FILE_TOO_LARGE') {
      return json(res, 413, { ok: false, error: '파일이 너무 큽니다 (최대 500MB)' });
    }
    json(res, 400, { ok: false, error: e.message || '업로드 실패' });
  }
}

async function serveFile(req, res, token) {
  const item = files.get(token);
  if (!item) return json(res, 404, { ok: false, error: '공유 파일을 찾을 수 없습니다.' });

  let stat;
  try { stat = await fsp.stat(item.path); }
  catch { return json(res, 404, { ok: false, error: '원본 파일이 존재하지 않습니다.' }); }

  const range = req.headers.range;
  const common = {
    'Content-Type': 'audio/mpeg',
    'Accept-Ranges': 'bytes',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store',
    'Content-Disposition': 'inline; filename="' + item.name.replace(/"/g, '') + '"'
  };

  if (!range) {
    res.writeHead(200, { ...common, 'Content-Length': stat.size });
    return fs.createReadStream(item.path).pipe(res);
  }

  const m = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!m) {
    res.writeHead(416, { 'Content-Range': 'bytes */' + stat.size });
    return res.end();
  }

  let start = m[1] ? Number(m[1]) : 0;
  let end = m[2] ? Number(m[2]) : stat.size - 1;
  if (!m[1] && m[2]) start = Math.max(0, stat.size - Number(m[2]));
  start = Math.max(0, start);
  end = Math.min(stat.size - 1, end);

  if (start > end || start >= stat.size) {
    res.writeHead(416, { 'Content-Range': 'bytes */' + stat.size });
    return res.end();
  }

  res.writeHead(206, {
    ...common,
    'Content-Length': end - start + 1,
    'Content-Range': `bytes ${start}-${end}/${stat.size}`
  });
  fs.createReadStream(item.path, { start, end }).pipe(res);
}

const server = http.createServer(async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.writeHead(204).end();

  const url = new URL(req.url, `http://${HOST}:${PORT}`);

  try {
    if (req.method === 'GET' && url.pathname === '/health') {
      return json(res, 200, {
        ok: true,
        service: 'timelink-local',
        online: true,
        host: HOST,
        port: PORT,
        public_url: publicBaseUrl || null,
        files: files.size
      });
    }

    if (req.method === 'POST' && url.pathname === '/upload') {
      return handleUpload(req, res, url);
    }

    if (req.method === 'GET' && url.pathname.startsWith('/local/')) {
      const token = url.pathname.split('/')[2] || '';
      return serveFile(req, res, token);
    }

    if (req.method === 'GET' && url.pathname === '/files') {
      return json(res, 200, {
        ok: true,
        files: [...files.entries()].map(([token, x]) => ({
          token, name: x.name, size: x.size, public_url: publicBaseUrl ? publicBaseUrl + '/local/' + token : null
        }))
      });
    }

    return json(res, 404, { ok: false, error: 'Not found' });
  } catch (e) {
    console.error(e);
    return json(res, 500, { ok: false, error: e.message || 'internal error' });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`TimeLink Local listening on http://${HOST}:${PORT}`);
  startTunnel();
});

function shutdown() {
  if (tunnel) tunnel.kill();
  server.close(() => process.exit(0));
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
