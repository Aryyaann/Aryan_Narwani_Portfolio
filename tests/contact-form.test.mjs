/* The contact form against stand-ins for Supabase and Formspree. Every request that is not
   to the local server or the CDNs the page loads from is intercepted, so no row is written
   and no email is sent even if contact.js moves to another project or host. The real
   delivery is checked once, by hand, with Aryan's OK (OWNER_ACTIONS.md). */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { serve } from '../scripts/check-site.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const CDNS = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];
const FIELDS = { name: 'Test Visitor', email: 'visitor@example.com', subject: 'Verify', message: 'Gate test, never sent.' };

let browser, server;
before(async () => { [browser, server] = await Promise.all([chromium.launch(), serve(root)]); });
after(async () => { await browser.close(); server.close(); });

/* supabase / formspree: how each stand-in answers — 'down' aborts the request, a number
   is the HTTP status. Returns what reached each one, what was blocked, and what the
   visitor saw. */
async function submit({ supabase, formspree }) {
  const context = await browser.newContext();
  const seen = { supabase: [], formspree: [], blocked: [] };
  const answer = (requests, how, route) => {
    requests.push(route.request());
    return how === 'down' ? route.abort() : route.fulfill({ status: how, contentType: 'application/json', body: '{}' });
  };
  await context.route('**', route => {
    const url = route.request().url();
    const host = new URL(url).hostname;
    if (url.startsWith(server.url) || CDNS.includes(host)) return route.continue();
    if (host.endsWith('.supabase.co')) return answer(seen.supabase, supabase, route);
    if (host === 'formspree.io') return answer(seen.formspree, formspree, route);
    seen.blocked.push(url);
    return route.abort();
  });

  const page = await context.newPage();
  await page.goto(server.url, { waitUntil: 'networkidle' });
  for (const [name, value] of Object.entries(FIELDS)) await page.fill(`#contactForm [name="${name}"]`, value);
  await page.click('#contactForm button[type="submit"]');
  /* If a CDN script failed, initContact never ran and no status appears: fail fast. */
  const status = page.locator('#formStatus');
  await status.waitFor({ state: 'visible', timeout: 10_000 });

  const result = {
    seen,
    status: await status.textContent(),
    button: await page.textContent('#contactForm button[type="submit"]'),
    nameAfter: await page.inputValue('#contactForm [name="name"]'),
  };
  await context.close();
  return result;
}

/* The email request's fields, parsed from its multipart body. */
async function emailFields(request) {
  const body = new Response(request.postDataBuffer(), { headers: { 'content-type': request.headers()['content-type'] } });
  return Object.fromEntries(await body.formData());
}

async function assertEmailSent(r) {
  assert.equal(r.seen.formspree.length, 1, 'the email was sent');
  assert.equal(r.seen.formspree[0].url(), 'https://formspree.io/f/meewzbpo');
  assert.deepEqual(await emailFields(r.seen.formspree[0]), FIELDS);
  assert.match(r.status, /Message received/);
  assert.equal(r.nameAfter, '', 'the form is cleared');
  assert.deepEqual(r.seen.blocked, []);
}

test('the email is still sent when Supabase cannot be reached', async () => {
  const r = await submit({ supabase: 'down', formspree: 200 });
  assert.equal(r.seen.supabase.length, 1, 'the form tried to save');
  await assertEmailSent(r);
});

/* Found by the M3 review (docs/qa/M3-review.md): a refused save (RLS answers 401) is the
   likelier failure than an unreachable server. */
test('the email is still sent when Supabase refuses the save', async () => {
  const r = await submit({ supabase: 401, formspree: 200 });
  assert.equal(r.seen.supabase.length, 1, 'the form tried to save');
  await assertEmailSent(r);
});

test('the save sends only the four fields, with the publishable key', async () => {
  const r = await submit({ supabase: 201, formspree: 200 });
  const req = r.seen.supabase[0];
  assert.match(req.url(), /^https:\/\/[a-z]+\.supabase\.co\/rest\/v1\/portfolio_contacts$/);
  assert.deepEqual(JSON.parse(req.postData()), FIELDS);
  assert.match(req.headers().apikey, /^sb_publishable_/);
  await assertEmailSent(r);
});

test('when the email fails the visitor is told and keeps what they wrote', async () => {
  const r = await submit({ supabase: 201, formspree: 500 });
  assert.match(r.status, /Something went wrong/);
  assert.match(r.button, /Send message/);
  assert.equal(r.nameAfter, FIELDS.name);
  assert.deepEqual(r.seen.blocked, []);
});
