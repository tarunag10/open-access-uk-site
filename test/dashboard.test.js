import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('src/app.js', 'utf8');
const repositories = fs.readFileSync('src/repositories.js', 'utf8');
const vercel = fs.readFileSync('vercel.json', 'utf8');

test('gtm page has the required brand, nav, and primary actions', () => {
  assert.match(html, /<h1 id="hero-title">Open Access UK<\/h1>/);
  assert.match(html, /Open-source tools for fairer public services/);
  assert.match(html, /openaccessuk\.vercel\.app/);
  assert.match(html, /Explore the toolkit/);
  assert.match(html, /View GitHub/);
  for (const section of [
    'toolkit',
    'workflows',
    'design',
    'github',
    'source-safety',
    'privacy',
    'roadmap'
  ]) {
    assert.match(html, new RegExp(`href="#${section}"`));
    assert.match(html, new RegExp(`id="${section}"`));
  }
});

test('gtm page includes SEO and social metadata', () => {
  assert.match(html, /rel="canonical" href="https:\/\/openaccessuk\.vercel\.app\//);
  assert.match(html, /property="og:url" content="https:\/\/openaccessuk\.vercel\.app\//);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /name="robots" content="index, follow"/);
  assert.match(html, /rel="manifest" href="\/site\.webmanifest"/);
});

test('gtm page links all public GitHub repos', () => {
  for (const slug of [
    'open-access-uk',
    'letter-generator',
    'accessible-forms',
    'public-service-directory',
    'legal-templates',
    'design-system'
  ]) {
    assert.match(html, new RegExp(`https://github\\.com/tarunag10/${slug}`));
  }
});

test('gtm page links each live mini-product page', () => {
  for (const url of [
    'https://letter-generator-psi.vercel.app',
    'https://accessible-forms-two.vercel.app',
    'https://public-service-directory.vercel.app',
    'https://legal-templates-seven.vercel.app',
    'https://design-system-two-delta.vercel.app'
  ]) {
    assert.ok(html.includes(url), `missing ${url}`);
  }
});

test('product and workflow interactions are wired in browser JavaScript', () => {
  assert.equal((html.match(/data-product-panel=/g) || []).length, 5);
  assert.equal((html.match(/data-tool=/g) || []).length, 5);
  assert.equal((html.match(/data-workflow=/g) || []).length, 4);
  assert.match(app, /function renderWorkflow/);
  assert.match(app, /publicRepositories/);
  assert.match(app, /function renderToolCards/);
  assert.match(app, /function activateTool/);
  assert.match(app, /navigator\.clipboard\.writeText/);
  assert.doesNotMatch(app, /workflowDetail\.innerHTML/);
  assert.match(app, /replaceChildren/);
});

test('homepage tool cards are backed by generated repository metadata', () => {
  for (const expected of [
    'Public-Service Letter Generator',
    'Accessible Public Forms',
    'Public Service Directory',
    'Legal Templates UK',
    'Open Access Design System'
  ]) {
    assert.match(repositories, new RegExp(expected));
  }
  assert.match(repositories, /risk_level/);
  assert.match(repositories, /githubUrl/);
});

test('homepage accessibility controls are wired', () => {
  assert.match(html, /class="nav-toggle"/);
  assert.match(html, /aria-expanded="false"/);
  assert.equal((html.match(/aria-pressed="/g) || []).length, 4);
  assert.match(html, /id="copy-status"/);
  assert.match(app, /setAttribute\('aria-expanded'/);
  assert.match(app, /setPressed/);
  assert.match(app, /ArrowRight/);
});

test('security headers are configured for Vercel', () => {
  assert.match(vercel, /Content-Security-Policy/);
  assert.match(vercel, /Permissions-Policy/);
  assert.match(vercel, /X-Frame-Options/);
  assert.match(vercel, /Referrer-Policy/);
});

test('generated visual concept is referenced as a project asset', () => {
  assert.match(html, /assets\/open-access-uk-gtm-concept\.webp/);
  assert.match(html, /assets\/open-access-uk-gtm-concept\.png/);
});

test('gtm page does not expose internal slice labels', () => {
  assert.doesNotMatch(html, /Slice \d/i);
  assert.doesNotMatch(html, /slice \d/i);
});

test('source safety and privacy centre sections are visible', () => {
  assert.match(html, /id="source-safety"/);
  assert.match(html, /not legal advice/i);
  assert.match(html, /report stale content/i);
  assert.match(html, /id="privacy"/);
  assert.match(html, /Local-first means you stay in control/);
  assert.match(html, /No hidden collection/);
});
