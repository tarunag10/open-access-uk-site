import { track } from './analytics.js';
import { setPressed, setStatus, textElement } from './dom.js';
import { publicRepositories } from './repositories.js';
import { workflows } from './workflows.js';

const workflowDetail = document.querySelector('#workflow-detail');
const workflowCards = [...document.querySelectorAll('[data-workflow]')];
const productPanels = [...document.querySelectorAll('[data-product-panel]')];
const copyTokens = document.querySelector('#copyTokens');
const copyStatus = document.querySelector('#copy-status');
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.querySelector('#primary-nav');

function renderToolCards() {
  const grid = document.querySelector('[data-tool-grid]');
  if (!grid || !publicRepositories.length) return;

  const cards = publicRepositories.map((repo, index) => {
    const article = document.createElement('article');
    article.className = `tool-card${index === 0 ? ' is-active' : ''}`;
    article.dataset.tool = repo.toolKey;

    const icon = textElement('span', repo.icon);
    icon.className = `tool-icon ${repo.iconClass}`;

    const heading = textElement('h3', repo.name);
    const summary = textElement('p', repo.summary);
    const risk = textElement('p', `${repo.risk_level} risk · ${repo.status}`);
    risk.className = 'tool-meta';

    const links = document.createElement('div');
    links.className = 'tool-links';
    const demo = document.createElement('a');
    demo.href = repo.demo;
    demo.textContent = 'Launch tool →';
    const github = document.createElement('a');
    github.href = repo.githubUrl;
    github.textContent = 'GitHub';
    links.append(demo, github);

    article.append(icon, heading, summary, risk, links);
    return article;
  });

  grid.replaceChildren(...cards);
}

function renderWorkflow(key) {
  const workflow = workflows[key] || workflows.information;
  if (!workflowDetail) return;

  const heading = textElement('h3', workflow.title);
  const body = textElement('p', workflow.body);
  const list = document.createElement('ol');
  workflow.steps.forEach((step) => list.append(textElement('li', step)));

  workflowDetail.replaceChildren(heading, body, list);
  setPressed(workflowCards, key);
  track('workflow_selected', { key });
}

function activateTool(key) {
  [...document.querySelectorAll('[data-tool]')].forEach((card) =>
    card.classList.toggle('is-active', card.dataset.tool === key)
  );
  productPanels.forEach((panel) => {
    panel.style.borderColor = panel.dataset.productPanel === key ? 'rgba(100, 210, 255, 0.72)' : '';
    panel.style.transform = panel.dataset.productPanel === key ? 'translateY(-4px)' : '';
  });
}

function selectAdjacentWorkflow(current, direction) {
  const index = workflowCards.indexOf(current);
  const next = workflowCards[(index + direction + workflowCards.length) % workflowCards.length];
  next?.focus();
  if (next?.dataset.workflow) renderWorkflow(next.dataset.workflow);
}

workflowCards.forEach((card) => {
  card.addEventListener('click', () => renderWorkflow(card.dataset.workflow));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      selectAdjacentWorkflow(card, 1);
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      selectAdjacentWorkflow(card, -1);
    }
  });
});

function bindToolCards() {
  [...document.querySelectorAll('[data-tool]')].forEach((card) => {
    card.addEventListener('mouseenter', () => activateTool(card.dataset.tool));
    card.addEventListener('focusin', () => activateTool(card.dataset.tool));
  });
}

navToggle?.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') !== 'true';
  navToggle.setAttribute('aria-expanded', String(open));
  primaryNav?.classList.toggle('is-open', open);
});

primaryNav?.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  navToggle?.setAttribute('aria-expanded', 'false');
  primaryNav.classList.remove('is-open');
});

copyTokens?.addEventListener('click', async () => {
  const tokenText = document.querySelector('.code-window code')?.textContent.trim() || '';
  try {
    await navigator.clipboard.writeText(tokenText);
    copyTokens.textContent = 'Copied';
    setStatus(copyStatus, 'Design tokens copied.');
  } catch {
    copyTokens.textContent = 'Select and copy';
    setStatus(copyStatus, 'Copy failed. Select and copy the tokens manually.');
  }
  window.setTimeout(() => {
    copyTokens.textContent = 'Copy tokens';
  }, 1800);
});

renderToolCards();
bindToolCards();
renderWorkflow('information');
