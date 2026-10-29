const TTL_SECONDS = 300;
const MAX_BYTES = 1_500_000;
const KEY_LENGTH = 6;
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
const KEY_RE = /^[a-z0-9]{6}$/;
const VIEW_KEY = 'stat:home-views';

const MIME_BY_EXT = {
  png: 'image/png',
  jpg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
};

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex',
      'Referrer-Policy': 'no-referrer',
    },
  });
}

export function sniff(buffer) {
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'png';
  }
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'jpg';
  if (buffer.length >= 6) {
    const head = String.fromCharCode(...buffer.subarray(0, 6));
    if (head === 'GIF87a' || head === 'GIF89a') return 'gif';
  }
  if (
    buffer.length >= 12 &&
    String.fromCharCode(...buffer.subarray(0, 4)) === 'RIFF' &&
    String.fromCharCode(...buffer.subarray(8, 12)) === 'WEBP'
  ) {
    return 'webp';
  }
  return null;
}

function decodeBase64(input) {
  const cleaned = String(input).replace(/\s+/g, '');
  if (!cleaned || cleaned.length % 4 === 1 || !/^[A-Za-z0-9+/]+={0,2}$/.test(cleaned)) return null;
  if (cleaned.length > Math.ceil(MAX_BYTES / 3) * 4) return { error: 'too_large' };
  const bytes = new Uint8Array(Buffer.from(cleaned, 'base64'));
  if (!bytes.byteLength) return null;
  if (bytes.byteLength > MAX_BYTES) return { error: 'too_large' };
  return { bytes };
}

function payloadBytes(body) {
  if (!body || typeof body.data !== 'string') return { error: 'bad_request' };
  const dataUrl = body.data.match(/^data:[^;,]+;base64,([A-Za-z0-9+/=\s]+)$/);
  return decodeBase64(dataUrl ? dataUrl[1] : body.data);
}

function randomKey() {
  const bytes = new Uint8Array(KEY_LENGTH);
  crypto.getRandomValues(bytes);
  let key = '';
  for (const value of bytes) key += ALPHABET[value % ALPHABET.length];
  return key;
}

async function upload(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'bad_request' });
  }
  const decoded = payloadBytes(body);
  if (decoded?.error === 'too_large') return json(413, { error: 'too_large' });
  if (!decoded?.bytes) return json(400, { error: 'bad_request' });
  const ext = sniff(decoded.bytes);
  if (!ext) return json(415, { error: 'not_image' });

  let key = '';
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = randomKey();
    const existing = await env.IMAGES.get(candidate, { type: 'arrayBuffer' });
    if (existing == null) {
      key = candidate;
      break;
    }
  }
  if (!KEY_RE.test(key)) return json(500, { error: 'server_error' });

  const stored = decoded.bytes.slice();
  await env.IMAGES.put(key, stored.buffer, {
    expirationTtl: TTL_SECONDS,
    metadata: { ext },
  });

  const origin = new URL(request.url).origin;
  return json(201, {
    key,
    url: `${origin}/v/${key}`,
    expiresAt: new Date(Date.now() + TTL_SECONDS * 1000).toISOString(),
    ttlSeconds: TTL_SECONDS,
  });
}

async function readImage(env, key) {
  if (!KEY_RE.test(key)) return json(404, { error: 'not_found' });
  const found = await env.IMAGES.getWithMetadata(key, { type: 'arrayBuffer' });
  if (!found?.value) return json(404, { error: 'not_found' });
  const bytes = new Uint8Array(found.value);
  const ext = MIME_BY_EXT[found.metadata?.ext] ? found.metadata.ext : sniff(bytes);
  const mime = MIME_BY_EXT[ext];
  if (!mime) return json(404, { error: 'not_found' });
  return new Response(bytes, {
    headers: {
      'Content-Type': mime,
      'Content-Length': String(bytes.byteLength),
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, noimageindex',
      'Referrer-Policy': 'no-referrer',
      'Content-Disposition': `inline; filename="shot.${ext === 'jpg' ? 'jpg' : ext}"`,
    },
  });
}

async function readViewCount(env) {
  const raw = await env.IMAGES.get(VIEW_KEY, { type: 'text' });
  if (raw == null) return 0;
  const text = typeof raw === 'string' ? raw : new TextDecoder().decode(raw);
  if (!/^\d+$/.test(text)) return 0;
  const count = Number(text);
  return Number.isSafeInteger(count) ? count : 0;
}

async function countHomeView(env) {
  const views = (await readViewCount(env)) + 1;
  await env.IMAGES.put(VIEW_KEY, String(views));
  return json(200, { views });
}

function requestScheme(request) {
  const url = new URL(request.url);
  if (url.protocol === 'http:') return 'http';
  const visitor = request.headers.get('cf-visitor');
  if (visitor) {
    try {
      const scheme = JSON.parse(visitor).scheme;
      if (scheme === 'http' || scheme === 'https') return scheme;
    } catch {
      // Ignore a malformed visitor header and use the other signals.
    }
  }
  const forwarded = request.headers.get('x-forwarded-proto');
  if (forwarded) {
    const scheme = forwarded.split(',')[0].trim().toLowerCase();
    if (scheme === 'http' || scheme === 'https') return scheme;
  }
  if (request.cf && request.cf.tlsVersion === '') return 'http';
  return 'https';
}

function redirectToHttps(request) {
  if (requestScheme(request) !== 'http') return null;
  const url = new URL(request.url);
  url.protocol = 'https:';
  const status = request.method === 'GET' || request.method === 'HEAD' ? 301 : 308;
  return Response.redirect(url.toString(), status);
}

export async function handleRequest(request, env) {
  const redirect = redirectToHttps(request);
  if (redirect) return redirect;
  const url = new URL(request.url);
  if (request.method === 'POST' && url.pathname === '/api/views') return countHomeView(env);
  if (request.method === 'POST' && url.pathname === '/api/images') return upload(request, env);
  const match = url.pathname.match(/^\/v\/([^/]+)$/);
  if (request.method === 'GET' && match) return readImage(env, match[1]);
  if (url.pathname === '/api' || url.pathname.startsWith('/api/') || url.pathname.startsWith('/v/')) {
    return json(404, { error: 'not_found' });
  }
  if (env.ASSETS) return env.ASSETS.fetch(request);
  return json(404, { error: 'not_found' });
}

export default {
  async fetch(request, env) {
    return handleRequest(request, env);
  },
};
