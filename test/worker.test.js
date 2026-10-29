import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { handleRequest } from '../src/index.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

class MemoryKv {
  constructor() {
    this.rows = new Map();
    this.puts = [];
  }

  async put(key, value, options = {}) {
    const bytes = typeof value === 'string' ? Buffer.from(value) : new Uint8Array(value);
    this.puts.push({ key, options });
    this.rows.set(key, {
      bytes,
      metadata: options.metadata ?? null,
      expiresAt: options.expirationTtl ? Date.now() + options.expirationTtl * 1000 : null,
    });
  }

  row(key) {
    const item = this.rows.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() >= item.expiresAt) {
      this.rows.delete(key);
      return null;
    }
    return item;
  }

  async get(key) {
    const item = this.row(key);
    return item ? item.bytes : null;
  }

  async getWithMetadata(key) {
    const item = this.row(key);
    if (!item) return { value: null, metadata: null };
    const copy = new Uint8Array(item.bytes);
    return { value: copy.buffer, metadata: item.metadata };
  }
}

function post(store, data) {
  return handleRequest(new Request('https://shot.test/api/images', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  }), { IMAGES: store });
}

test('stores a base64 png and serves it at a short link', async () => {
  const kv = new MemoryKv();
  const created = await post(kv, PNG.toString('base64'));
  assert.equal(created.status, 201);
  const body = await created.json();
  assert.match(body.key, /^[a-z0-9]{6}$/);
  assert.equal(body.url, `https://shot.test/v/${body.key}`);
  assert.equal(body.ttlSeconds, 300);
  assert.equal(kv.puts[0].options.expirationTtl, 300);
  assert.ok(Date.parse(body.expiresAt) > Date.now());

  const image = await handleRequest(new Request(body.url), { IMAGES: kv });
  assert.equal(image.status, 200);
  assert.equal(image.headers.get('content-type'), 'image/png');
  assert.equal(image.headers.get('cache-control'), 'no-store');
  assert.equal(image.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(image.headers.get('x-robots-tag'), 'noindex, noimageindex');
  assert.equal(created.headers.get('x-robots-tag'), 'noindex');
  assert.deepEqual(Buffer.from(await image.arrayBuffer()), PNG);
});

test('accepts a data url and sniffs jpeg gif and webp', async () => {
  const kv = new MemoryKv();
  const cases = [
    [Buffer.from([0xff, 0xd8, 0xff, 0xd9]), 'image/jpeg'],
    [Buffer.from('GIF89a', 'ascii'), 'image/gif'],
    [Buffer.concat([
      Buffer.from('RIFF', 'ascii'),
      Buffer.from([4, 0, 0, 0]),
      Buffer.from('WEBP', 'ascii'),
    ]), 'image/webp'],
  ];
  for (const [bytes, mime] of cases) {
    const created = await post(kv, `data:text/plain;base64,${bytes.toString('base64')}`);
    assert.equal(created.status, 201);
    const body = await created.json();
    const image = await handleRequest(new Request(body.url), { IMAGES: kv });
    assert.equal(image.headers.get('content-type'), mime);
  }
});

test('rejects a non-image and an oversized body', async () => {
  const kv = new MemoryKv();
  const rejected = await post(kv, Buffer.from('not an image').toString('base64'));
  assert.equal(rejected.status, 415);
  assert.deepEqual(await rejected.json(), { error: 'not_image' });
  assert.equal(kv.rows.size, 0);

  const oversized = await post(kv, 'A'.repeat(2_100_000));
  assert.equal(oversized.status, 413);
  assert.deepEqual(await oversized.json(), { error: 'too_large' });
});

test('rejects bad json, unknown keys, and expired objects', async () => {
  const kv = new MemoryKv();
  const bad = await handleRequest(new Request('https://shot.test/api/images', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{',
  }), { IMAGES: kv });
  assert.equal(bad.status, 400);

  const created = await post(kv, PNG.toString('base64'));
  const body = await created.json();
  kv.rows.get(body.key).expiresAt = Date.now() - 1;
  assert.equal((await handleRequest(new Request(body.url), { IMAGES: kv })).status, 404);
  assert.equal((await handleRequest(new Request('https://shot.test/v/nope'), { IMAGES: kv })).status, 404);
  assert.equal((await handleRequest(new Request('https://shot.test/v/..%2f..%2fsecret'), { IMAGES: kv })).status, 404);
});

test('every page is indexable in English', () => {
  const pages = [
    ['public/index.html', 'https://tosnip.com/', 'titleHome', 'metaHome', 'WebSite'],
    ['public/web/index.html', 'https://tosnip.com/web/', 'titleWeb', 'metaWeb', 'WebApplication'],
    ['public/tool/index.html', 'https://tosnip.com/tool/', 'titleTool', 'metaTool', 'SoftwareApplication'],
    ['public/why/index.html', 'https://tosnip.com/why/', 'titleWhy', 'metaWhy', 'FAQPage'],
  ];
  const headers = fs.readFileSync(path.join(root, 'public', '_headers'), 'utf8');
  assert.equal(headers.includes('noindex'), false);
  const robots = fs.readFileSync(path.join(root, 'public', 'robots.txt'), 'utf8');
  assert.match(robots, /Disallow: \/api\//);
  assert.match(robots, /Disallow: \/v\//);
  assert.match(robots, /Sitemap: https:\/\/tosnip\.com\/sitemap\.xml/);
  const sitemap = fs.readFileSync(path.join(root, 'public', 'sitemap.xml'), 'utf8');
  assert.equal(sitemap.includes('/v/'), false);
  assert.equal(sitemap.includes('.ps1'), false);
  const i18n = fs.readFileSync(path.join(root, 'public', 'i18n.js'), 'utf8');
  assert.match(i18n, /titleHome: \["ToSnip · Print Screen, then Ctrl\+V", "ToSnip · Print Screen แล้ว Ctrl\+V"\]/);
  const og = fs.readFileSync(path.join(root, 'public', 'og.png'));
  assert.equal(og.readUInt32BE(16), 1200);
  assert.equal(og.readUInt32BE(20), 630);
  const touch = fs.readFileSync(path.join(root, 'public', 'apple-touch-icon.png'));
  assert.equal(touch.readUInt32BE(16), 180);
  assert.equal(touch.readUInt32BE(20), 180);
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public', 'site.webmanifest'), 'utf8'));
  assert.equal(manifest.name, 'ToSnip');
  assert.equal(manifest.lang, 'en');
  for (const [file, url, titleKey, metaKey, type] of pages) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    assert.equal(html.includes('noindex'), false, file);
    assert.equal(html.includes('hreflang="th"'), false, file);
    assert.match(html, new RegExp(`<link rel="canonical" href="${url.replace(/[.]/g, '\\.')}">`));
    assert.match(html, new RegExp(`rel="alternate" hreflang="en" href="${url.replace(/[.]/g, '\\.')}"`));
    assert.match(html, new RegExp(`rel="alternate" hreflang="x-default" href="${url.replace(/[.]/g, '\\.')}"`));
    assert.match(html, /name="robots" content="index, follow, max-image-preview:large"/);
    assert.match(html, new RegExp(`property="og:title"[^>]*data-i18n-content="${titleKey}"`));
    assert.match(html, new RegExp(`property="og:description"[^>]*data-i18n-content="${metaKey}"`));
    assert.match(html, /property="og:image" content="https:\/\/tosnip\.com\/og\.png"/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    assert.match(html, /rel="icon" href="\/favicon\.svg"/);
    assert.match(html, /rel="manifest" href="\/site\.webmanifest"/);
    const block = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(block, file);
    const data = JSON.parse(block[1]);
    assert.equal(data['@context'], 'https://schema.org');
    assert.ok(data['@graph'].some((node) => node['@type'] === type), file);
    assert.equal(JSON.stringify(data).includes('aggregateRating'), false);
  }
  assert.ok(sitemap.includes('<loc>https://tosnip.com/</loc>'));
  assert.ok(sitemap.includes('<loc>https://tosnip.com/web/</loc>'));
  assert.ok(sitemap.includes('<loc>https://tosnip.com/tool/</loc>'));
  assert.ok(sitemap.includes('<loc>https://tosnip.com/why/</loc>'));
});

test('the page is a single paste target', () => {
  const home = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
  const html = fs.readFileSync(path.join(root, 'public', 'web', 'index.html'), 'utf8');
  const tool = fs.readFileSync(path.join(root, 'public', 'tool', 'index.html'), 'utf8');
  const i18n = fs.readFileSync(path.join(root, 'public', 'i18n.js'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'public', 'site.css'), 'utf8');
  assert.match(css, /font-family: "Google Sans"/);
  assert.match(css, /google-sans-thai\.woff2/);
  assert.match(home, /class="term-live /);
  assert.match(home, /class="see"/);
  assert.ok(home.indexOf('class="hero"') < home.indexOf('class="demo"'));
  assert.ok(home.indexOf('class="demo"') < home.indexOf('class="quick"'));
  assert.ok(home.indexOf('class="quick"') < home.indexOf('class="problem"'));
  assert.match(home, /src="\/vid\/tosnip-video\.mp4"/);
  assert.match(home, /poster="\/vid\/poster\.jpg"/);
  assert.match(home, /Watch the demo/);
  assert.match(i18n, /ดูเดโม/);
  assert.match(home, /"@type": "VideoObject"/);
  assert.ok(home.indexOf('class="problem"') < home.indexOf('class="see"'));
  assert.ok(home.indexOf('class="see"') < home.indexOf('class="support"'));
  assert.equal(home.includes('class="products"'), false);
  assert.equal(home.includes('class="flow"'), false);
  assert.match(home, /class="problem"/);
  assert.match(home, /Why the screenshot never reaches the CLI/);
  assert.match(i18n, /ทำไมรูปแคปถึงไปไม่ถึง CLI/);
  assert.match(home, /class="quick"/);
  assert.match(home, /irm https:\/\/<wbr>tosnip\.com\/<wbr>install\.ps1 \| iex/);
  assert.match(home, /id="install-command"/);
  assert.match(home, /id="view-stat"/);
  assert.match(home, /class="brand-mark" src="\/logo\.jpg"/);
  assert.match(html, /class="brand-mark" src="\/logo\.jpg"/);
  assert.match(tool, /class="brand-mark" src="\/logo\.jpg"/);
  assert.match(home, /method: "POST"/);
  assert.match(i18n, /viewLabel: \["views", "ครั้ง"\]/);
  assert.match(home, /href="\/tool\/#inspect"/);
  assert.match(i18n, /Or read the script in Notepad before it runs/);
  assert.match(i18n, /หรือเปิดอ่านสคริปต์ใน Notepad ก่อนรัน/);
  assert.equal(home.includes("winget"), false);
  assert.equal(home.includes("scoop"), false);
  assert.match(tool, /id="inspect"/);
  assert.match(home, /Made so a CLI can see the screen/);
  assert.match(i18n, /ทำให้ CLI เห็นหน้าจอ/);
  assert.match(css, /\.see-grid, \.quick-grid \{ grid-template-columns: 1fr/);
  assert.match(home, /class="support"/);
  assert.match(home, /Windows Terminal, PowerShell, or CMD/);
  assert.match(i18n, /เครื่องมือที่พิมพ์เส้นทางลงเทอร์มินัลมีบน Windows/);
  assert.match(i18n, /supportMacH: \["Browser", "หน้าเว็บ"\]/);
  assert.match(home, /google-sans-latin\.woff2/);
  assert.match(home, /<html lang="en">/);
  assert.match(html, /<html lang="en">/);
  assert.match(tool, /<html lang="en">/);
  assert.match(home, /href="\/web\/"/);
  assert.match(home, /href="\/tool\/"/);
  assert.match(home, /href="\/why\/"/);
  assert.match(html, /href="\/why\/"/);
  assert.match(tool, /href="\/why\/"/);
  const why = fs.readFileSync(path.join(root, 'public', 'why', 'index.html'), 'utf8');
  assert.match(why, /class="brand-mark" src="\/logo\.jpg"/);
  assert.match(why, /<html lang="en">/);
  assert.match(why, /href="\/why\/" aria-current="page"/);
  assert.match(why, /A terminal cannot open the clipboard/);
  assert.match(i18n, /navWhy: \["The problem", "ปัญหา"\]/);
  assert.equal(why.includes('วางบนเว็บ'), false);
  assert.match(home, /On the web/);
  assert.match(home, /On this PC/);
  assert.match(home, /class="nav-toggle"/);
  assert.match(html, /class="nav-toggle"/);
  assert.match(tool, /class="nav-toggle"/);
  assert.match(i18n, /navToggle: \["Menu", "เมนู"\]/);
  assert.match(home, /data-lang="th"/);
  assert.match(home, /src="\/i18n\.js"/);
  assert.match(home, /script-src 'self' 'unsafe-inline'/);
  assert.match(home, /<kbd>Win<\/kbd>/);
  assert.equal(home.includes('addEventListener("paste"'), false);
  assert.equal(home.includes('เลือกไฟล์'), false);
  assert.equal(home.includes('วางบนเว็บ'), false);
  assert.equal(i18n.includes('navigator.language'), false);
  assert.match(i18n, /spaceur-lang/);
  assert.match(i18n, /วางบนเว็บ/);
  assert.match(i18n, /เครื่องมือในเครื่อง/);
  assert.match(i18n, /พร้อมใช้งาน/);
  assert.match(i18n, /วางซ้ำไม่ได้/);
  assert.match(i18n, /กำลังอัปโหลด/);
  assert.match(i18n, /ถอนการติดตั้ง/);
  assert.match(i18n, /ไม่มีการอัปโหลดขึ้นเว็บ/);
  assert.match(i18n, /This is the same image as the one just pasted\. It cannot be pasted again\./);
  assert.equal(i18n.includes('เลือกไฟล์'), false);
  assert.match(html, /addEventListener\("paste"/);
  assert.match(html, /const MAX_WIDTH = 1000/);
  assert.match(html, /image\/webp/);
  assert.match(html, /Ready\. The link was copied\./);
  assert.match(html, /SHA-256/);
  assert.match(html, /role="progressbar"/);
  assert.match(html, /Uploading/);
  assert.match(html, /Ctrl\+V/);
  assert.match(html, /<kbd>Win<\/kbd>/);
  assert.match(html, /In the browser/);
  assert.equal(html.includes('เลือกไฟล์'), false);
  assert.match(tool, /Install on this PC/);
  assert.match(tool, /irm https:\/\/tosnip\.com\/install\.ps1 \| iex/);
  assert.match(tool, /id="pkg-inspect"/);
  assert.match(tool, /<span class="ps-cmd">irm<\/span> https:\/\/tosnip\.com\/install\.ps1 \| <span class="ps-cmd">Out-File<\/span> install\.ps1; <span class="ps-cmd">notepad<\/span> install\.ps1/);
  assert.match(i18n, /เสนอทางเลือก Inspect ก่อน Execute:/);
  assert.match(i18n, /แนะนำให้ผู้ใช้อ่านโค้ดก่อน/);
  assert.equal(tool.includes("winget"), false);
  assert.equal(tool.includes("scoop"), false);
  assert.equal(i18n.includes("winget"), false);
  assert.equal(i18n.includes("scoop"), false);
  assert.match(tool, /Uninstall/);
  assert.match(tool, /irm https:\/\/tosnip\.com\/uninstall\.ps1 \| iex/);
  assert.equal(tool.match(/<button type="button" class="copy"/g).length, 2);
  assert.match(tool, /C:\\ToSnip/);
  assert.match(tool, /Nothing is uploaded to the web/);
  assert.equal(tool.includes('เลือกไฟล์'), false);
  const install = fs.readFileSync(path.join(root, 'public', 'install.ps1'), 'utf8');
  const helper = fs.readFileSync(path.join(root, 'public', 'tosnip-paste.ps1'), 'utf8');
  assert.match(install, /https:\/\/tosnip\.com\/install\.ps1/);
  assert.match(install, /\$origin = 'https:\/\/tosnip\.com'/);
  assert.match(install, /\/tosnip-paste\.ps1/);
  assert.match(install, /namespace ToSnip/);
  const uninstall = fs.readFileSync(path.join(root, 'public', 'uninstall.ps1'), 'utf8');
  assert.match(uninstall, /ToSnip paste\.lnk/);
  assert.match(uninstall, /Spaceur paste\.lnk/);
  assert.match(uninstall, /tosnip-paste\.ps1/);
  assert.match(uninstall, /spaceur-paste\.ps1/);
  assert.match(uninstall, /Remove-Item -LiteralPath \$dir -Recurse -Force/);
  assert.match(helper, /https:\/\/tosnip\.com\/api\/images/);
  assert.match(helper, /namespace ToSnip/);
  assert.match(helper, /CASCADIA_HOSTING_WINDOW_CLASS/);
  assert.match(helper, /ConsoleWindowClass/);
  assert.match(helper, /if \(!IsHandleCreated \|\| InvokeRequired\) BeginInvoke\(start\);/);
  assert.match(helper, /File\.WriteAllBytes/);
  assert.match(helper, /tosnip\.txt/);
  assert.match(helper, /AddSeconds\(-300\)/);
  assert.equal(helper.includes('HttpWebRequest'), false);
  assert.match(helper, /FreeConsole\(\)/);
  assert.match(install, /tosnip\.txt/);
  assert.match(uninstall, /tosnip\.txt/);
  assert.match(uninstall, /spaceur\.txt/);
  assert.match(uninstall, /\[a-z0-9\]\{6\}\\\.jpg/);
});

test('counts a homepage view and keeps the total', async () => {
  const kv = new MemoryKv();
  const first = await handleRequest(new Request('https://tosnip.com/api/views', { method: 'POST' }), { IMAGES: kv });
  assert.equal(first.status, 200);
  assert.deepEqual(await first.json(), { views: 1 });
  assert.equal(kv.puts[0].options.expirationTtl, undefined);
  const second = await handleRequest(new Request('https://tosnip.com/api/views', { method: 'POST' }), { IMAGES: kv });
  assert.deepEqual(await second.json(), { views: 2 });
  const image = await handleRequest(new Request('https://tosnip.com/v/stat:home-views'), { IMAGES: kv });
  assert.equal(image.status, 404);
  const read = await handleRequest(new Request('https://tosnip.com/api/views'), { IMAGES: kv });
  assert.equal(read.status, 404);
  assert.equal(kv.puts.length, 2);
});

test('redirects an http visit to https and leaves https in place', async () => {
  const plain = await handleRequest(new Request('http://tosnip.com/web/'), {});
  assert.equal(plain.status, 301);
  assert.equal(plain.headers.get('location'), 'https://tosnip.com/web/');

  const posted = await handleRequest(new Request('http://tosnip.com/api/images', { method: 'POST' }), {});
  assert.equal(posted.status, 308);
  assert.equal(posted.headers.get('location'), 'https://tosnip.com/api/images');

  const visitor = new Request('https://tosnip.com/', { headers: { 'cf-visitor': '{"scheme":"http"}' } });
  const fromVisitor = await handleRequest(visitor, {});
  assert.equal(fromVisitor.status, 301);
  assert.equal(fromVisitor.headers.get('location'), 'https://tosnip.com/');

  const secure = new Request('https://tosnip.com/');
  Object.defineProperty(secure, 'cf', { value: { tlsVersion: 'TLSv1.3' } });
  assert.equal((await handleRequest(secure, {})).status, 404);

  const bareTls = new Request('https://www.tosnip.com/tool/');
  Object.defineProperty(bareTls, 'cf', { value: { tlsVersion: '' } });
  const upgraded = await handleRequest(bareTls, {});
  assert.equal(upgraded.status, 301);
  assert.equal(upgraded.headers.get('location'), 'https://www.tosnip.com/tool/');
});
