import { createServer } from 'node:http';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
const port = Number(process.env.PORT || 4173);
const sessionDuration = 30 * 60 * 1000;
const sessions = new Map();
const attempts = new Map();
const cookieName = 'sole_one_session';
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.otf': 'font/otf', '.ttf': 'font/ttf' };

const archive = {
  sections: {
    'behind-scenes': { title: 'Behind the scenes', intro: 'A working archive for the people, places, and moments behind the making of Sole One.', items: [
      { eyebrow: 'PRODUCTION PHOTOGRAPH', title: 'On set', description: 'Production photographs and shooting details will be added when supplied.', placeholder: 'BEHIND-THE-SCENES PHOTO TO BE ADDED', mediaType: 'image', asset: null },
      { eyebrow: 'SHOOTING EXPERIENCE', title: 'The making', description: 'A space for production notes and first-hand shooting experiences.', placeholder: 'PRODUCTION MOMENT TO BE ADDED', mediaType: 'image', asset: null },
      { eyebrow: 'PRODUCTION VIDEO', title: 'Moving image', description: 'Behind-the-scenes footage will be added when supplied.', placeholder: 'BEHIND-THE-SCENES VIDEO TO BE ADDED', mediaType: 'video', asset: null }
    ] },
    characters: { title: 'Characters', intro: 'Meet the four characters at the heart of the Sole One universe.', items: [
      { eyebrow: 'ORIGINAL', title: 'Sole One', description: 'Character details will be added when supplied.', placeholder: 'SOLE ONE CHARACTER IMAGE TO BE ADDED' },
      { eyebrow: 'CLONE 01', title: 'Green', description: 'Character details will be added when supplied.', placeholder: 'GREEN CHARACTER IMAGE TO BE ADDED' },
      { eyebrow: 'CLONE 02', title: 'Blue', description: 'Character details will be added when supplied.', placeholder: 'BLUE CHARACTER IMAGE TO BE ADDED' },
      { eyebrow: 'CLONE 03', title: 'Yellow', description: 'Character details will be added when supplied.', placeholder: 'YELLOW CHARACTER IMAGE TO BE ADDED' }
    ] },
    'photos-videos': { title: 'Photos & videos', intro: 'A dedicated home for selected stills and moving images from the project.', items: [
      { eyebrow: 'PHOTO ARCHIVE', title: 'Selected stills', description: 'Project photographs will be added when supplied.', placeholder: 'PHOTO GALLERY PLACEHOLDER', mediaType: 'image', asset: null },
      { eyebrow: 'FILM ARCHIVE', title: 'Selected films', description: 'Project videos will be added when supplied.', placeholder: 'VIDEO GALLERY PLACEHOLDER', mediaType: 'video', asset: null }
    ] },
    games: { title: 'Games', intro: 'Tune into the signal, remember its pattern, and see how far your focus can carry you.', items: [] },
    'story-making': { title: 'Story / making', intro: 'The story and creative process, ready for the project’s own words and production details.', items: [
      { eyebrow: 'THE STORY', title: 'A universe unfolds', description: 'The Sole One story has not been provided yet. This space is ready for the approved synopsis.', placeholder: 'STORY ARTWORK TO BE ADDED' },
      { eyebrow: 'CREATIVE PROCESS', title: 'From idea to screen', description: 'Concept notes and selected production details will be added when supplied.', placeholder: 'MAKING-OF MATERIAL TO BE ADDED' }
    ] }
  }
};

function headers(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; media-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
}

function send(res, status, body, type = 'application/json; charset=utf-8', extra = {}) {
  headers(res);
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', ...extra });
  res.end(body);
}
function json(res, status, value, extra) { send(res, status, JSON.stringify(value), 'application/json; charset=utf-8', extra); }
function redirect(res, location) { headers(res); res.writeHead(303, { Location: location, 'Cache-Control': 'no-store' }); res.end(); }
function parseCookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').map(part => part.trim().split('=').map(decodeURIComponent)).filter(pair => pair.length === 2));
}
function sessionFor(req) {
  const token = parseCookies(req)[cookieName];
  const expiresAt = token && sessions.get(token);
  if (!expiresAt) return null;
  if (expiresAt <= Date.now()) { sessions.delete(token); return null; }
  return token;
}
function sessionCookie(token, req, clear = false) {
  const secure = req.socket.encrypted || process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${cookieName}=${clear ? '' : encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict${clear ? '; Max-Age=0' : `; Max-Age=${sessionDuration / 1000}`}${secure}`;
}
function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try { return new URL(origin).host === req.headers.host; } catch { return false; }
}
async function readJson(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 8192) throw new Error('Request too large.');
  }
  return JSON.parse(raw || '{}');
}
async function readExtraAccessConfig() {
  try {
    const config = JSON.parse(await readFile(resolve(root, 'private/extra-access.json'), 'utf8'));
    return config && typeof config === 'object' && !Array.isArray(config) ? config : null;
  } catch { return null; }
}
async function staticFile(res, pathname) {
  const allowed = pathname === '/' ? 'index.html' : pathname.slice(1);
  const file = resolve(root, allowed);
  const allowedFiles = new Set([resolve(root, 'index.html'), resolve(root, 'sole-one-entry.html'), resolve(root, 'sole-one/index.html'), resolve(root, 'sole-one/bts/index.html'), resolve(root, 'sole-one/games/index.html')]);
  const publicRoots = [resolve(root, 'src') + sep, resolve(root, 'public') + sep];
  if (!allowedFiles.has(file) && !publicRoots.some(directory => file.startsWith(directory))) {
    send(res, 404, 'Not found', 'text/plain; charset=utf-8'); return;
  }
  try {
    const data = await readFile(file);
    send(res, 200, data, mimeTypes[extname(file).toLowerCase()] || 'application/octet-stream', { 'Cache-Control': extname(file) === '.html' ? 'no-store' : 'public, max-age=3600' });
  } catch { send(res, 404, 'Not found', 'text/plain; charset=utf-8'); }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const path = decodeURIComponent(url.pathname);
  try {
    if (path === '/api/sole-one/session' && req.method === 'GET') {
      const token = sessionFor(req);
      return json(res, token ? 200 : 401, { authenticated: Boolean(token) });
    }
    if (path === '/api/sole-one/hints' && req.method === 'GET') {
      const config = await readExtraAccessConfig();
      const hint = typeof config?.hint === 'string' && config.hint.trim() ? config.hint.trim() : 'Enter the original name';
      return json(res, 200, { hint });
    }
    if (path === '/api/sole-one/login' && req.method === 'POST') {
      if (!sameOrigin(req)) return json(res, 403, { message: 'Request origin could not be verified.' });
      const config = await readExtraAccessConfig();
      if (typeof config?.password !== 'string' || !config.password.trim()) {
        return json(res, 503, { message: 'EXTRA access is not configured yet. Add the original name to private/extra-access.json.' });
      }
      const ip = req.socket.remoteAddress || 'unknown';
      const attempt = attempts.get(ip) || { count: 0, until: 0 };
      if (attempt.until > Date.now()) return json(res, 429, { message: 'Too many attempts. Please try again later.' }, { 'Retry-After': String(Math.ceil((attempt.until - Date.now()) / 1000)) });
      const body = await readJson(req);
      const supplied = typeof body.password === 'string' ? body.password : '';
      const expectedHash = createHash('sha256').update(config.password).digest();
      const suppliedHash = createHash('sha256').update(supplied).digest();
      if (!timingSafeEqual(expectedHash, suppliedHash)) {
        attempt.count += 1;
        if (attempt.count >= 5) { attempt.count = 0; attempt.until = Date.now() + 15 * 60 * 1000; }
        attempts.set(ip, attempt);
        return json(res, 401, { message: 'That password did not unlock the archive. Try again.' });
      }
      attempts.delete(ip);
      const token = randomBytes(32).toString('base64url');
      sessions.set(token, Date.now() + sessionDuration);
      return json(res, 200, { authenticated: true }, { 'Set-Cookie': sessionCookie(token, req) });
    }
    if (path === '/api/sole-one/logout' && req.method === 'POST') {
      if (!sameOrigin(req)) return json(res, 403, { message: 'Request origin could not be verified.' });
      const token = parseCookies(req)[cookieName];
      if (token) sessions.delete(token);
      return json(res, 200, { authenticated: false }, { 'Set-Cookie': sessionCookie('', req, true) });
    }
    if (path === '/api/sole-one/content' && req.method === 'GET') {
      if (!sessionFor(req)) return json(res, 401, { message: 'Authentication required.' });
      return json(res, 200, archive);
    }
    if (['/sole-one/bts', '/sole-one/bts/', '/sole-one/bts/index.html', '/sole-one/games', '/sole-one/games/', '/sole-one/games/index.html'].includes(path) && req.method === 'GET') {
      if (!sessionFor(req)) return redirect(res, '/sole-one-entry.html#extra-access');
      const page = path.includes('/bts') ? '/sole-one/bts/index.html' : '/sole-one/games/index.html';
      return staticFile(res, page);
    }
    if ((path === '/sole-one' || path === '/sole-one/') && req.method === 'GET') return staticFile(res, '/index.html');
    if (path === '/sole-one/access' && req.method === 'GET') {
      return sessionFor(req) ? redirect(res, '/sole-one/dashboard') : staticFile(res, '/sole-one-entry.html');
    }
    if (path === '/sole-one/dashboard' && req.method === 'GET') return redirect(res, '/sole-one-entry.html#extra-access');
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed', 'text/plain; charset=utf-8', { Allow: 'GET, HEAD' });
    return staticFile(res, path);
  } catch (error) {
    console.error('Request error:', error.message);
    if (!res.headersSent) json(res, 400, { message: 'The request could not be processed.' });
    else res.destroy();
  }
});

server.listen(port, () => console.log(`Pavaruthran is available at http://localhost:${port}`));
