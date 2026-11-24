/* The gate is only worth trusting if it fails when it should. Each case breaks a copy of
   the site in one way and expects checkSite to name that breakage. */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { request } from 'node:http';
import { checkSite, checkReferences, serve } from '../scripts/check-site.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const SITE = new Set(['index.html', 'css', 'js', 'assets']);
const copies = [];
let browser;

before(async () => { browser = await chromium.launch(); });
after(async () => {
  await browser.close();
  for (const dir of copies) rmSync(dir, { recursive: true, force: true });
});

function siteCopy(edit) {
  const dir = mkdtempSync(join(tmpdir(), 'portfolio-verify-'));
  copies.push(dir);
  cpSync(root, dir, { recursive: true, filter: src => src === root || SITE.has(src.slice(root.length + 1).split('/')[0]) });
  edit?.(dir);
  return dir;
}

function editFile(dir, file, change) {
  const path = join(dir, file);
  writeFileSync(path, change(readFileSync(path, 'utf8')));
}

const injectBeforeBodyEnd = (dir, html) => editFile(dir, 'index.html', s => s.replace('</body>', `${html}\n</body>`));

const cases = [
  ['a JavaScript error', d => editFile(d, 'js/main.js', s => `throw new Error('verify-selftest');\n${s}`), /JavaScript error: verify-selftest/],
  ['a request that fails at runtime', d => injectBeforeBodyEnd(d, `<script>fetch('missing-at-runtime.json')</script>`), /HTTP 404: .*missing-at-runtime\.json/],
  ['an image that does not decode', d => writeFileSync(join(d, 'assets/projects/project-01.webp'), 'not an image'), /image does not decode: assets\/projects\/project-01\.webp/],
  ['a missing section', d => editFile(d, 'index.html', s => s.replace('<section id="focus">', '<section>')), /missing sections: focus/],
  ['horizontal scroll at phone width', d => injectBeforeBodyEnd(d, `<div style="width:2000px;height:1px"></div>`), /\[phone\] page is \d+px wide in a 390px viewport/],
  ['a referenced file that does not exist', d => rmSync(join(d, 'assets/aryan.png')), /index\.html references missing file assets\/aryan\.png/],
  ['a missing background image in an inline style', d => rmSync(join(d, 'assets/projects/project-02.webp')), /index\.html references missing file assets\/projects\/project-02\.webp/],
  ['the old company name', d => injectBeforeBodyEnd(d, `<p>Nara Intelligence builds agents.</p>`), /says "Nara Intelligence" 1 time\(s\)/],
  ['a hero name too wide for a phone', d => editFile(d, 'index.html', s => s.replace('>Narwani.<', '>Narwaniiiiiiiiiii.<')), /\[phone\] hero name is cut: "Narwaniiiiiiiiiii\."/],
  /* Found by the M4 review (docs/qa/M4-review.md): the row clips the name before the viewport does. */
  ['a hero name cut by its row but inside the viewport', d => injectBeforeBodyEnd(d, `<style>.hero-name .row{width:200px}</style>`), /hero name is cut: "Narwani\."/],
  ['a hero name that is never revealed', d => editFile(d, 'js/hero.js', s => s.replace(".set(innerTexts[1], { visibility: 'visible' })", '')), /hero name was never revealed/],
  ['an in-page link to nowhere', d => editFile(d, 'index.html', s => s.replace('href="#about"', 'href="#nowhere"')), /links to #nowhere/],
];

/* Found by the M2 review (docs/qa/M2-codex.md). */
test('reads attributes in single quotes too', () => {
  const dir = siteCopy(d => editFile(d, 'index.html', s => s.replace('href="#about"', `href='#nowhere'`).replace('src="assets/aryan.png"', `src='assets/gone.png'`)));
  const problems = checkReferences(dir);
  assert.ok(problems.some(p => /links to #nowhere/.test(p)), problems.join('\n'));
  assert.ok(problems.some(p => /missing file assets\/gone\.png/.test(p)), problems.join('\n'));
});

test('the local server answers a malformed URL with 400 and keeps serving', async () => {
  const server = await serve(siteCopy());
  try {
    const bad = await new Promise((resolve, reject) => {
      const { port } = new URL(server.url);
      request({ host: '127.0.0.1', port, path: '/%ZZ' }, res => resolve(res.statusCode)).on('error', reject).end();
    });
    assert.equal(bad, 400);
    assert.equal((await fetch(server.url)).status, 200);
  } finally {
    server.close();
  }
});

test('the unchanged site passes', async () => {
  assert.deepEqual(await checkSite(siteCopy(), { browser }), []);
});

for (const [name, breakIt, expected] of cases) {
  test(`fails on ${name}`, async () => {
    const problems = await checkSite(siteCopy(breakIt), { browser });
    assert.ok(problems.some(p => expected.test(p)), `expected ${expected} in:\n${problems.join('\n') || '(no problems)'}`);
  });
}

