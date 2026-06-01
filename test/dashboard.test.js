import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('src/app.js', 'utf8');
const suiteReadme = fs.readFileSync('../README.md', 'utf8');

test('umbrella dashboard lists all seven repos with first-slice status', () => {
  assert.equal((html.match(/data-repo-card/g) || []).length, 7);
  assert.equal((html.match(/class="status-dashboard"/g) || []).length, 7);
  assert.equal((html.match(/Now usable/g) || []).length, 7);
  assert.equal((html.match(/Likely next feature/g) || []).length, 7);
  assert.equal((html.match(/Local demo and README/g) || []).length, 7);
});

test('role selector is present and wired to the browser-only filter', () => {
  for (const role of ['law', 'design', 'accessibility', 'civic-tech', 'maintainer']) {
    assert.match(html, new RegExp(`<option value="${role}"`));
    assert.match(html, new RegExp(`data-roles="[^"]*${role}`));
  }

  assert.match(html, /id="repo-role-filter"/);
  assert.match(app, /function filterRepos/);
  assert.match(app, /querySelectorAll\('\[data-repo-card\]'\)/);
  assert.match(app, /\.hidden = !isVisible/);
});

test('slice two dashboard exposes GitHub links and persistence or export status for every repo', () => {
  const githubLinks = html.match(/https:\/\/github\.com\/tarunag10\//g) || [];
  assert.equal(githubLinks.length, 7);
  assert.equal((html.match(/<dt>GitHub<\/dt>/g) || []).length, 7);
  assert.equal((html.match(/<dt>Persistence and export<\/dt>/g) || []).length, 7);
});

test('suite roadmap groups every repo into now next and later work', () => {
  for (const column of ['Now', 'Next', 'Later']) {
    assert.match(html, new RegExp(`<h3>${column}</h3>`));
  }

  for (const repoName of [
    'Open Access UK site',
    'Reasonable Adjustment Letter Generator',
    'Accessible Public Forms',
    'Public Service Directory',
    'Legal Templates UK',
    'Open Access Design System',
    'Open Source Maintainer Helper'
  ]) {
    assert.match(html, new RegExp(`<strong>${repoName}</strong>`));
  }
});

test('suite readme documents repo metadata and publish workflow', () => {
  for (const slug of [
    'open-access-uk-site',
    'letter-generator',
    'accessible-forms',
    'public-service-directory',
    'legal-templates',
    'design-system',
    'good-first-issues'
  ]) {
    assert.match(suiteReadme, new RegExp(`https://github\\.com/tarunag10/${slug}\\.git`));
    assert.match(suiteReadme, new RegExp(`\\./${slug}`));
  }

  assert.match(suiteReadme, /node scripts\/verify-suite\.mjs/);
  assert.match(suiteReadme, /Publish workflow/);
});
