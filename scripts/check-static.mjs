import fs from 'node:fs';
const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('src/app.js', 'utf8');

if (!html.includes('<main')) throw new Error('Missing <main landmark');
if (!html.includes('<label') && !html.includes('aria-label') && !html.includes('aria-labelledby')) {
  throw new Error('Missing accessible labelling marker');
}
if (!html.includes('aria-')) throw new Error('Missing ARIA marker for dynamic UI');

const repoCards = html.match(/data-repo-card/g) || [];
if (repoCards.length !== 7) throw new Error(`Expected 7 repo dashboard cards, found ${repoCards.length}`);

const statusSections = html.match(/class="status-dashboard"/g) || [];
if (statusSections.length !== 7) throw new Error(`Expected 7 status dashboards, found ${statusSections.length}`);

for (const requiredText of ['Now usable', 'Likely next feature', 'Local demo and README']) {
  const matches = html.match(new RegExp(requiredText, 'g')) || [];
  if (matches.length !== 7) throw new Error(`Expected ${requiredText} on each repo card`);
}

for (const role of ['law', 'design', 'accessibility', 'civic-tech', 'maintainer']) {
  if (!html.includes(`value="${role}"`)) throw new Error(`Missing role filter option: ${role}`);
  if (!app.includes(role)) throw new Error(`Role filter is not wired in src/app.js: ${role}`);
}

if (!app.includes('filterRepos')) throw new Error('Missing browser-only repo filter function');
console.log('Static accessibility smoke check passed');
