import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('src/app.js', 'utf8');

test('gtm page has the required brand, nav, and primary actions', () => {
  assert.match(html, /<h1 id="hero-title">Open Access UK<\/h1>/);
  assert.match(html, /Open-source tools for fairer public services/);
  assert.match(html, /openaccessuk\.vercel\.app/);
  assert.match(html, /Explore the toolkit/);
  assert.match(html, /View GitHub/);
  for (const section of ['toolkit', 'workflows', 'design', 'github', 'roadmap']) {
    assert.match(html, new RegExp(`href="#${section}"`));
    assert.match(html, new RegExp(`id="${section}"`));
  }
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
  assert.match(app, /function activateTool/);
  assert.match(app, /navigator\.clipboard\.writeText/);
});

test('generated visual concept is referenced as a project asset', () => {
  assert.match(html, /assets\/open-access-uk-gtm-concept\.png/);
});

test('gtm page does not expose internal slice labels', () => {
  assert.doesNotMatch(html, /Slice \d/i);
  assert.doesNotMatch(html, /slice \d/i);
});
