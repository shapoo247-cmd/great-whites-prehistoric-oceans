// Deterministic frame renderer: headless Chromium canvas -> PNG frames -> ffmpeg.
// Usage:
//   node render.mjs <sceneId> [<sceneId> ...]          render full clips
//   node render.mjs --still <sceneId> <t1,t2,...> [dir]  render preview stills (PNG)
import { chromium } from 'playwright-core';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn, execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(ROOT, '..');
const RENDERS = path.join(REPO, 'renders');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };

let sink = null; // function(buffer) -> Promise
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/frame') {
    const chunks = [];
    req.on('data', d => chunks.push(d));
    req.on('end', async () => { const buf = Buffer.concat(chunks); if (sink) await sink(buf); res.end('ok'); });
    return;
  }
  const u = decodeURIComponent(req.url.split('?')[0]);
  const fp = path.join(ROOT, u === '/' ? 'host.html' : u);
  if (!fp.startsWith(ROOT) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.statusCode = 404; return res.end('nf'); }
  res.setHeader('Content-Type', MIME[path.extname(fp)] || 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-store');
  fs.createReadStream(fp).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const PORT = server.address().port;

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
  args: ['--disable-gpu-vsync', '--font-render-hinting=none', '--disable-lcd-text', '--force-color-profile=srgb']
});

async function openScene(id) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log(`[${id}] ${m.type()}: ${m.text()}`); });
  page.on('pageerror', e => console.log(`[${id}] pageerror: ${e.message}`));
  await page.goto(`http://127.0.0.1:${PORT}/host.html?scene=${encodeURIComponent(id)}`);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
  const err = await page.evaluate(() => window.__error);
  if (err) throw new Error(`Scene ${id} failed: ${err}`);
  const meta = await page.evaluate(() => window.__meta);
  return { page, meta };
}

function buildSfx(meta, wavPath) {
  if (!meta.sfx || !meta.sfx.length) return false;
  const cues = path.join(path.dirname(wavPath), '.cues_' + path.basename(wavPath) + '.json');
  fs.writeFileSync(cues, JSON.stringify({ duration: meta.duration, cues: meta.sfx }));
  execFileSync('python3', [path.join(ROOT, 'sfx', 'mix.py'), cues, wavPath], { stdio: 'inherit' });
  fs.unlinkSync(cues);
  return true;
}

async function renderScene(id) {
  const t0 = Date.now();
  const { page, meta } = await openScene(id);
  const out = path.join(RENDERS, meta.out + (meta.alpha ? '.mov' : '.mp4'));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const wav = path.join(RENDERS, meta.out + '_SFX.wav');
  const hasAudio = buildSfx(meta, wav);
  const args = ['-y', '-v', 'error', '-f', 'image2pipe', '-c:v', 'png', '-framerate', String(meta.fps), '-i', '-'];
  if (hasAudio) args.push('-i', wav);
  if (meta.alpha) args.push('-c:v', 'prores_ks', '-profile:v', '4', '-pix_fmt', 'yuva444p10le', '-vendor', 'apl0', '-qscale:v', String(meta.qscale || 8));
  else args.push('-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', '-tune', 'film', '-movflags', '+faststart');
  if (hasAudio) args.push(...(meta.alpha ? ['-c:a', 'pcm_s16le'] : ['-c:a', 'aac', '-b:a', '256k']), '-shortest');
  args.push('-r', String(meta.fps), out);
  const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg exit ' + c))));
  sink = (buf) => new Promise(r => { if (!ff.stdin.write(buf)) ff.stdin.once('drain', r); else r(); });
  const n = Math.round(meta.duration * meta.fps);
  for (let i = 0; i < n; i++) await page.evaluate(t => window.__frame(t), i / meta.fps);
  sink = null; ff.stdin.end(); await done; await page.close();
  if (meta.ambience) execFileSync('python3', [path.join(REPO, 'tools', 'add_ambience.py'), out, '-6'], { stdio: 'inherit' });
  console.log(`✓ ${id} -> ${path.relative(REPO, out)} (${n} frames, ${((Date.now() - t0) / 1000).toFixed(1)}s)`);
}

async function renderStills(id, times, dir) {
  const { page, meta } = await openScene(id);
  fs.mkdirSync(dir, { recursive: true });
  if (meta.alpha) await page.evaluate(() => { document.body.style.background = 'linear-gradient(135deg,#4a5560,#22282e)'; });
  for (const t of times) {
    await page.evaluate(t => window.__draw(t), t);
    const fp = path.join(dir, `${id}_${String(t).replace('.', '_')}.png`);
    await page.screenshot({ path: fp, omitBackground: false });
    console.log(fp);
  }
  await page.close();
}

const argv = process.argv.slice(2);
try {
  if (argv[0] === '--still') {
    const dir = argv[3] || '/tmp/claude-0/-home-claude/934b8bf6-749c-592a-b1ee-5252cee82290/scratchpad/stills';
    await renderStills(argv[1], argv[2].split(',').map(Number), dir);
  } else {
    for (const id of argv) await renderScene(id);
  }
} catch (e) { console.error(e); process.exitCode = 1; }
await browser.close(); server.close();
