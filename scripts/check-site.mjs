/* The checks behind `npm run verify`: serve a copy of the site locally and report every
   way it is broken. Returns a list of problems; an empty list means the site passed. */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, normalize, extname, sep } from 'node:path';
import { chromium } from 'playwright';

export const SECTIONS = ['hero', 'about', 'skills', 'projects', 'experience', 'focus', 'contact'];
export const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'phone', width: 390, height: 844 },
];

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.ico': 'image/x-icon',
};

/* ES modules refuse to load without a JavaScript MIME type, so a plain file server that
   guesses wrong would make a healthy site fail. */
export function serve(root) {
  const server = createServer(async (req, res) => {
    let path;
    try {
      path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }
    const file = normalize(join(root, path.endsWith('/') ? path + 'index.html' : path));
    if (!file.startsWith(root + sep) && file !== root) { res.writeHead(403).end(); return; }
    try {
      if (!(await stat(file)).isFile()) throw new Error('not a file');
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
      res.end(await readFile(file));
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () =>
    resolve({ url: `http://127.0.0.1:${server.address().port}/`, close: () => server.close() })));
}

const isLocal = ref => !/^([a-z]+:|\/\/|#)/i.test(ref) && ref !== '';

/* Files index.html and the stylesheets point to, and in-page links, checked without a
   browser so a missing file is named even when nothing visibly breaks. */
export function checkReferences(root) {
  const problems = [];
  const html = readFileSync(join(root, 'index.html'), 'utf8');

  const requireFile = (from, dir, ref) => {
    if (isLocal(ref) && !existsSync(join(dir, ref.split(/[?#]/)[0]))) problems.push(`${from} references missing file ${ref}`);
  };

  /* The project images are inline `style="background-image:url(…)"`, not <img>. */
  const refs = attributes(html, 'href|src').concat(cssUrls(html));
  for (const ref of refs) requireFile('index.html', root, ref);

  const ids = new Set(attributes(html, 'id'));
  for (const ref of attributes(html, 'href')) {
    if (ref.length > 1 && ref.startsWith('#') && !ids.has(ref.slice(1))) problems.push(`index.html links to ${ref}, which no element has`);
  }

  for (const css of readdirSync(join(root, 'css')).filter(f => f.endsWith('.css'))) {
    for (const ref of cssUrls(readFileSync(join(root, 'css', css), 'utf8'))) requireFile(`css/${css}`, join(root, 'css'), ref);
  }
  return problems;
}

/* Attribute values in double or single quotes (HTML allows both). */
function attributes(html, names) {
  return [...html.matchAll(new RegExp(`\\b(?:${names})=(["'])(.*?)\\1`, 'g'))].map(m => m[2]);
}

/* A quoted url("…") is read whole: base.css has an inline SVG whose text contains
   url(%23n), which a looser pattern mistook for a file. */
function cssUrls(text) {
  return [...text.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^'")\s]*))\s*\)/g)].map(m => m[1] ?? m[2] ?? m[3]);
}

/* Load the page as a visitor would, scroll it top to bottom so the scroll-driven code runs,
   and collect everything that went wrong. */
async function checkInBrowser(browser, url, viewport, screenshotDir) {
  const problems = [];
  const say = msg => problems.push(`[${viewport.name}] ${msg}`);
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();

  page.on('pageerror', e => say(`JavaScript error: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') say(`console error: ${m.text()}`); });
  page.on('requestfailed', r => say(`request failed: ${r.url()} (${r.failure()?.errorText})`));
  page.on('response', r => { if (r.status() >= 400) say(`HTTP ${r.status()}: ${r.url()}`); });

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
    await page.waitForFunction(() => {
      const el = document.getElementById('preloader');
      return !el || getComputedStyle(el).display === 'none' || getComputedStyle(el).opacity === '0';
    }, null, { timeout: 10_000 }).catch(() => say('the preloader never went away'));

    await page.evaluate(async () => {
      const pause = ms => new Promise(r => setTimeout(r, ms));
      for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 2) {
        window.scrollTo(0, y);
        await pause(60);
      }
      window.scrollTo(0, 0);
      await pause(300);
    });
    await page.waitForLoadState('networkidle');

    /* A file that exists but does not decode is invisible to the HTTP checks, and a CSS
       background that fails to decode raises no event at all, so each is loaded here. */
    const found = await page.evaluate(async () => {
      const backgrounds = new Set();
      for (const el of document.querySelectorAll('*')) {
        for (const [, url] of getComputedStyle(el).backgroundImage.matchAll(/url\("([^"]+)"\)/g)) {
          if (url.startsWith(location.origin)) backgrounds.add(url);
        }
      }
      const decodes = url => new Promise(ok => {
        const img = new Image();
        img.onload = () => ok(img.naturalWidth > 0);
        img.onerror = () => ok(false);
        img.src = url;
      });
      const urls = [...document.images].map(i => i.src).concat([...backgrounds]);
      const brokenImages = [];
      for (const url of new Set(urls)) if (!(await decodes(url))) brokenImages.push(url.replace(location.origin + '/', ''));
      return {
        sections: [...document.querySelectorAll('section[id]')].map(s => s.id),
        brokenImages,
        width: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
        viewport: innerWidth,
      };
    });

    const missing = SECTIONS.filter(id => !found.sections.includes(id));
    if (missing.length) say(`missing sections: ${missing.join(', ')}`);
    for (const src of found.brokenImages) say(`image does not decode: ${src}`);
    if (found.width > found.viewport) say(`page is ${found.width}px wide in a ${found.viewport}px viewport (horizontal scroll)`);

    if (screenshotDir) await page.screenshot({ path: join(screenshotDir, `${viewport.name}.png`) });
  } catch (e) {
    say(`page did not load: ${e.message}`);
  } finally {
    await context.close();
  }
  return problems;
}

export async function checkSite(root, { browser, viewports = VIEWPORTS, screenshotDir } = {}) {
  const problems = checkReferences(root);
  const server = await serve(root);
  const ownBrowser = !browser;
  browser ??= await chromium.launch();
  try {
    for (const vp of viewports) problems.push(...await checkInBrowser(browser, server.url, vp, screenshotDir));
  } finally {
    if (ownBrowser) await browser.close();
    server.close();
  }
  return problems;
}
