import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('src/app.js', 'utf8');

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
