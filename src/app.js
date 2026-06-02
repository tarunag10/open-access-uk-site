import { track } from './analytics.js';
import { setPressed, setStatus, textElement } from './dom.js';
import { workflows } from './workflows.js';

const workflowDetail = document.querySelector('#workflow-detail');
const workflowCards = [...document.querySelectorAll('[data-workflow]')];
const productPanels = [...document.querySelectorAll('[data-product-panel]')];
const toolCards = [...document.querySelectorAll('[data-tool]')];
const copyTokens = document.querySelector('#copyTokens');
const copyStatus = document.querySelector('#copy-status');
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.querySelector('#primary-nav');

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
  toolCards.forEach((card) => card.classList.toggle('is-active', card.dataset.tool === key));
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

toolCards.forEach((card) => {
  card.addEventListener('mouseenter', () => activateTool(card.dataset.tool));
  card.addEventListener('focusin', () => activateTool(card.dataset.tool));
});

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

renderWorkflow('information');
