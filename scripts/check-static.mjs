import fs from 'node:fs';
const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('src/app.js', 'utf8');
const vercel = fs.readFileSync('vercel.json', 'utf8');

if (!html.includes('<main')) throw new Error('Missing <main landmark');
if (!html.includes('<label') && !html.includes('aria-label') && !html.includes('aria-labelledby')) {
  throw new Error('Missing accessible labelling marker');
}
if (!html.includes('aria-')) throw new Error('Missing ARIA marker for dynamic UI');
if (!html.includes('rel="canonical"')) throw new Error('Missing canonical metadata');
if (!html.includes('site.webmanifest')) throw new Error('Missing web manifest link');
if (!html.includes('aria-pressed="true"')) throw new Error('Missing workflow selected state');
if (!html.includes('id="copy-status"')) throw new Error('Missing copy status live region');
if (!html.includes('id="source-safety"')) throw new Error('Missing source/safety section');
if (!html.includes('id="privacy"')) throw new Error('Missing privacy centre section');
if (app.includes('workflowDetail.innerHTML'))
  throw new Error('Workflow rendering must avoid innerHTML');
if (!app.includes('replaceChildren'))
  throw new Error('Workflow rendering must use DOM replacement');
if (!vercel.includes('Content-Security-Policy')) throw new Error('Missing CSP header');

for (const requiredText of [
  'Open Access UK',
  'Public-service tools that stay on your side',
  'local-first toolkit for everyday public accountability',
  'Start with a tool',
  'Plan a route',
  'https://letter-generator-psi.vercel.app',
  'https://public-service-directory.vercel.app'
]) {
  if (!html.includes(requiredText)) throw new Error(`Missing required GTM copy: ${requiredText}`);
}

const toolCards = html.match(/data-tool=/g) || [];
if (toolCards.length !== 7) throw new Error(`Expected 7 toolkit cards, found ${toolCards.length}`);

const workflowCards = html.match(/data-workflow=/g) || [];
if (workflowCards.length !== 4)
  throw new Error(`Expected 4 workflow cards, found ${workflowCards.length}`);

for (const slug of [
  'open-access-uk',
  'letter-generator',
  'accessible-forms',
  'public-service-directory',
  'legal-templates',
  'design-system',
  'foi-tracker',
  'case-builder'
]) {
  if (!html.includes(`https://github.com/tarunag10/${slug}`)) {
    throw new Error(`Missing GitHub link: ${slug}`);
  }
}

for (const requiredFunction of ['renderWorkflow', 'renderToolCards', 'activateTool', 'writeText']) {
  if (!app.includes(requiredFunction))
    throw new Error(`Missing browser interaction: ${requiredFunction}`);
}

console.log('Static accessibility smoke check passed');
