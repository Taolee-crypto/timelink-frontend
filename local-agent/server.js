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
let publicBaseUrl = process.env.TIMELINK_PUBLIC_BASE_URL || 'https://agent.timelink.digital';

// ★ 분석 결과 저장 위치
const ANALYSIS_DIR = path.join(
  process.env.USERPROFILE || 'C:\\Users\\win11',
  'TimeLink',
  'analysis'
);

function json(res, status, body) {
  const data = Buffer.from(JSON.stringify(body));
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': data.length,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Private-Network': 'true'
  });
  res.end(data);
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
}

function safeName(name, kind) {
  const k = String(kind || 'mp3').toLowerCase();
  const fallback = k === 'tl3' ? 'file.tl3' : 'audio.mp3';
  const base = path.basename(String(name || fallback)).replace(/[^a-zA-Z0-9._ -]/g, '_');
  if(k === 'tl3') return base.toLowerCase().endsWith('.tl3') ? base : base + '.tl3';
  return base.toLowerCase().endsWith('.mp3') ? base : base + '.mp3';
}

function startTunnel() {
  if (tunnel) return;
  const bin = process.env.CLOUDFLARED_BIN || 'cloudflared';
  // Named Tunnel 모드: 고정 도메인 사용 (agent.timelink.digital)
  tunnel = spawn(bin, ['tunnel', '--config', 'C:\\Users\\win11\\.cloudflared\\config.yml', 'run', 'timelink-agent'], {
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  const inspect = chunk => {
    const text = chunk.toString();
    console.log('[cloudflared]', text.trim());
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
  });
}

async function analyzeInBackground(mp3Path, token, originalName) {
  await fsp.mkdir(ANALYSIS_DIR, { recursive: true });
  const outPath = path.join(ANALYSIS_DIR, token + '.score.json');
  const metaPath = path.join(ANALYSIS_DIR, token + '.meta.json');

  console.log('[analyze] 시작: ' + token + ' (' + originalName + ')');

  const PYTHON_BIN = 'C:\\\\Users\\\\win11\\\\Desktop\\\\timelink-score\\\\venv\\\\Scripts\\\\python.exe';
  const python = spawn(PYTHON_BIN, [
    '-m', 'timelink_score.cli', 'analyze',
    mp3Path,
    '--out', outPath,
    '--method', 'yin',
    '--max-duration', '30',
  ], {
    cwd: 'C:\\Users\\win11\\Desktop\\timelink-score',
    env: {
      ...process.env,
      PYTHONPATH: 'C:\\Users\\win11\\Desktop\\timelink-score\\src',
    },
    windowsHide: true,
  });

  let stderr = '';
  python.stderr.on('data', (d) => { stderr += d.toString(); });
  python.stdout.on('data', (d) => { console.log('[analyze]', d.toString().trim()); });

  return new Promise((resolve) => {
    python.on('close', async (code) => {
      if (code === 0 && fs.existsSync(outPath)) {
        console.log('[analyze] 완료: ' + token);
        await fsp.writeFile(metaPath, JSON.stringify({
          token,
          score_status: 'ready',
          score_path: outPath,
          completed_at: new Date().toISOString(),
        }, null, 2));
        resolve({ ok: true, score_path: outPath });
      } else {
        console.error('[analyze] 실패: ' + token + ' (code=' + code + ')');
        await fsp.writeFile(metaPath, JSON.stringify({
          token,
          score_status: 'failed',
          error: stderr.slice(0, 500),
          completed_at: new Date().toISOString(),
        }, null, 2));
        resolve({ ok: false, error: stderr });
      }
    });
  });
}

async function handleUpload(req, res, url) {
  const kind = String(url.searchParams.get('kind') || 'mp3').toLowerCase() === 'tl3' ? 'tl3' : 'mp3';
  const name = safeName(url.searchParams.get('name'), kind);
  const token = crypto.randomBytes(18).toString('hex');
  const filePath = path.join(DATA_DIR, token + '-' + name);
  await fsp.mkdir(DATA_DIR, { recursive: true });

  const declared = Number(req.headers['content-length'] || 0);
  if (declared > MAX_FILE) {
    json(res, 413, { ok: false, error: '?뚯씪???덈Т ?쎈땲??(理쒕? 500MB)' });
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
    if (total === 0) throw new Error('鍮??뚯씪?낅땲??');
    files.set(token, { path: filePath, name, size: total, createdAt: Date.now() });
    startTunnel();

    const waitUntil = Date.now() + 12000;
    while (!publicBaseUrl && Date.now() < waitUntil) {
      await new Promise(r => setTimeout(r, 250));
    }
    if (!publicBaseUrl) { /* PC ??μ? ?깃났?쇰줈 ?좎??섍퀬 怨듦컻 URL留?鍮꾩썙 ?붾떎. */ }

    // ★ 백그라운드 분석 시작 (응답 안 기다림)
    analyzeInBackground(filePath, token, name).catch(err => {
      console.error('[analyze] 예외:', err.message);
    });

    json(res, 200, {
      ok: true,
      token,
      name,
      size: total,
      public_url: publicBaseUrl ? publicBaseUrl + '/local/' + token : null,
      stream_url: publicBaseUrl ? publicBaseUrl + '/local/' + token : 'http://' + HOST + ':' + PORT + '/local/' + token,
      local_url: 'http://' + HOST + ':' + PORT + '/local/' + token,
      public_available: !!publicBaseUrl,
      kind,
      storage_mode: 'creator_pc',
      score_status: kind === 'mp3' ? 'analyzing' : null
    });
  } catch (e) {
    out.destroy();
    await fsp.rm(filePath, { force: true }).catch(() => {});
    if (e.message === 'FILE_TOO_LARGE') {
      return json(res, 413, { ok: false, error: '?뚯씪???덈Т ?쎈땲??(理쒕? 500MB)' });
    }
    json(res, 400, { ok: false, error: e.message || '?낅줈???ㅽ뙣' });
  }
}

async function serveFile(req, res, token) {
  const item = files.get(token);
  if (!item) return json(res, 404, { ok: false, error: '怨듭쑀 ?뚯씪??李얠쓣 ???놁뒿?덈떎.' });

  let stat;
  try { stat = await fsp.stat(item.path); }
  catch { return json(res, 404, { ok: false, error: '?먮낯 ?뚯씪??議댁옱?섏? ?딆뒿?덈떎.' }); }

  const range = req.headers.range;
  const etag = '"' + token + '"';

  if (req.headers['if-none-match'] === etag) {
    res.writeHead(304, { 'ETag': etag, 'Cache-Control': 'public, max-age=31536000, immutable' });
    return res.end();
  }

  const common = {
    'Content-Type': item.name.toLowerCase().endsWith('.tl3') ? 'application/octet-stream' : 'audio/mpeg',
    'Accept-Ranges': 'bytes',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Range',
    'Access-Control-Expose-Headers': 'Content-Length, Content-Range, ETag',
    'Cache-Control': 'public, max-age=31536000, immutable',
    'ETag': etag,
    'Content-Disposition': 'inline; filename="' + item.name.replace(/"/g, '') + '"'
  };

  if (!range) {
    res.writeHead(200, { ...common, 'Content-Length': stat.size });
    if (req.method === 'HEAD') return res.end();
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

// ⭐ 시작 시 디스크의 파일을 files Map에 로드 (재시작 후에도 재생 가능)
(async () => {
  try {
    await fsp.mkdir(DATA_DIR, { recursive: true });
    const entries = await fsp.readdir(DATA_DIR);
    for (const name of entries) {
      const m = /^([0-9a-f]{36})-(.+)$/.exec(name);
      if (!m) continue;
      const token = m[1];
      const filePath = path.join(DATA_DIR, name);
      const stat = await fsp.stat(filePath).catch(() => null);
      if (!stat || !stat.isFile()) continue;
      const storedName = m[2];
      const isTl3 = /\.tl3(\.|$)/i.test(storedName);
      files.set(token, {
        token,
        name: storedName,
        size: stat.size,
        path: filePath,
        mime: isTl3 ? 'application/octet-stream' : 'audio/mpeg',
        createdAt: stat.mtimeMs
      });
    }
    console.log('[TimeLink Local] loaded ' + files.size + ' files from disk');
  } catch (e) {
    console.error('[TimeLink Local] load files error:', e && e.message);
  }
})();
const server = http.createServer(async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') {
    return res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Private-Network': 'true',
      'Access-Control-Max-Age': '86400'
    }).end();
  }

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

    if ((req.method === 'GET' || req.method === 'HEAD') && url.pathname.startsWith('/local/')) {
      const token = url.pathname.split('/')[2] || '';
      return serveFile(req, res, token);
    }

    // STREAM_ROUTE: 구 /stream?name=xxx.mp3 지원 (C:\Users\win11\TimeLink 폴더)
    if ((req.method === 'GET' || req.method === 'HEAD') && url.pathname === '/stream') {
      const name = String(url.searchParams.get('name') || '');
      const safe = path.basename(decodeURIComponent(name));
      const legacyRoot = path.join(process.env.USERPROFILE || 'C:\\Users\\win11', 'TimeLink');
      const target = path.join(legacyRoot, safe);
      if (!fs.existsSync(target)) {
        return json(res, 404, { ok: false, error: 'legacy file not found' });
      }
      const stat = await fsp.stat(target);
      const range = req.headers.range;
      const ct = safe.toLowerCase().endsWith('.mp3') ? 'audio/mpeg' : 'application/octet-stream';
      const common = {
        'Content-Type': ct,
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Range',
        'Access-Control-Expose-Headers': 'Content-Length, Content-Range',
        'Cache-Control': 'public, max-age=31536000, immutable'
      };
      if (!range) {
        res.writeHead(200, { ...common, 'Content-Length': stat.size });
        if (req.method === 'HEAD') return res.end();
        return fs.createReadStream(target).pipe(res);
      }
      const m = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!m) { res.writeHead(416, { 'Content-Range': 'bytes */' + stat.size }); return res.end(); }
      let start = m[1] ? Number(m[1]) : 0;
      let end = m[2] ? Number(m[2]) : stat.size - 1;
      start = Math.max(0, start);
      end = Math.min(stat.size - 1, end);
      if (start > end || start >= stat.size) {
        res.writeHead(416, { 'Content-Range': 'bytes */' + stat.size });
        return res.end();
      }
      res.writeHead(206, { ...common, 'Content-Length': end - start + 1, 'Content-Range': `bytes ${start}-${end}/${stat.size}` });
      return fs.createReadStream(target, { start, end }).pipe(res);
    }

    if (req.method === 'GET' && url.pathname === '/files') {
      return json(res, 200, {
        ok: true,
        files: [...files.entries()].map(([token, x]) => ({
          token, name: x.name, size: x.size, public_url: publicBaseUrl ? publicBaseUrl + '/local/' + token : null
        }))
      });
    }

    // ★ 분석 결과 조회
    if (req.method === 'GET' && url.pathname.startsWith('/analysis/')) {
      const token = url.pathname.split('/')[2] || '';
      const scorePath = path.join(ANALYSIS_DIR, token + '.score.json');
      const metaPath = path.join(ANALYSIS_DIR, token + '.meta.json');

      if (fs.existsSync(scorePath)) {
        const scoreData = JSON.parse(await fsp.readFile(scorePath, 'utf-8'));
        return json(res, 200, {
          ok: true,
          score_status: 'ready',
          score: scoreData,
        });
      }
      if (fs.existsSync(metaPath)) {
        const meta = JSON.parse(await fsp.readFile(metaPath, 'utf-8'));
        return json(res, 200, { ok: true, ...meta });
      }
      return json(res, 200, { ok: true, score_status: 'analyzing' });
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
