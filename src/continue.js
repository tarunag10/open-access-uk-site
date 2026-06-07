import { storageRegistry } from '../../shared/privacy/local-storage.mjs';

const TOOL_URLS = {
  'letter-generator': 'https://letter-generator-psi.vercel.app',
  'accessible-forms': 'https://accessible-forms-two.vercel.app',
  'public-service-directory': 'https://public-service-directory.vercel.app',
  'legal-templates': 'https://legal-templates-seven.vercel.app',
  'design-system': 'https://design-system-two-delta.vercel.app'
};

export function initContinue(mountSelector = '#continue') {
  const mount = document.querySelector(mountSelector);
  if (!mount) return;

  const resumable = storageRegistry.filter((item) => {
    if (!TOOL_URLS[item.tool]) return false;
    try {
      return window.localStorage.getItem(item.key) !== null;
    } catch {
      return false;
    }
  });

  if (!resumable.length) {
    mount.hidden = true;
    return;
  }
  mount.hidden = false;
  const cards = resumable.map((item) => {
    const card = document.createElement('article');
    card.className = 'card';
    const h3 = document.createElement('h3');
    h3.textContent = item.label;
    const p = document.createElement('p');
    p.textContent = item.contains;
    const a = document.createElement('a');
    a.href = TOOL_URLS[item.tool];
    a.textContent = 'Continue →';
    card.append(h3, p, a);
    return card;
  });
  const wrap = document.createElement('div');
  wrap.className = 'cards';
  wrap.append(...cards);
  mount.replaceChildren(wrap);
}
