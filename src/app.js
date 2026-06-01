const workflows = {
  information: {
    title: 'Get information',
    body: 'Start with a letter or template, keep the request focused, export a copy, and use the directory to understand where to go next.',
    steps: ['Choose a request type.', 'Draft locally in the browser.', 'Export a copy and track replies.']
  },
  forms: {
    title: 'Fix an inaccessible form',
    body: 'Use the accessible forms library to inspect a service journey, identify missing labels or grouped-control issues, and export a shareable JSON spec.',
    steps: ['Pick a public-service form pattern.', 'Review readiness and notes.', 'Copy or download the improved spec.']
  },
  escalate: {
    title: 'Escalate a case',
    body: 'Map the right escalation route, gather evidence, save a local plan, and keep official links close to the next action.',
    steps: ['Search the issue.', 'Build an action plan.', 'Save or print the checklist.']
  },
  contribute: {
    title: 'Build or contribute',
    body: 'Start from the parent GitHub repo, choose a public tool, and use contributor docs to make a focused improvement.',
    steps: ['Open the parent repo.', 'Pick a focused issue or improvement.', 'Run the relevant checks before opening a pull request.']
  }
};

const workflowDetail = document.querySelector('#workflow-detail');
const workflowCards = [...document.querySelectorAll('[data-workflow]')];

function renderWorkflow(key) {
  const workflow = workflows[key] || workflows.information;
  if (!workflowDetail) return;
  workflowDetail.innerHTML = `
    <h3>${workflow.title}</h3>
    <p>${workflow.body}</p>
    <ol>${workflow.steps.map((step) => `<li>${step}</li>`).join('')}</ol>
  `;
  workflowCards.forEach((card) => {
    card.classList.toggle('is-selected', card.dataset.workflow === key);
  });
}

workflowCards.forEach((card) => {
  card.addEventListener('click', () => renderWorkflow(card.dataset.workflow));
});

const productPanels = [...document.querySelectorAll('[data-product-panel]')];
const toolCards = [...document.querySelectorAll('[data-tool]')];

function activateTool(key) {
  toolCards.forEach((card) => card.classList.toggle('is-active', card.dataset.tool === key));
  productPanels.forEach((panel) => {
    panel.style.borderColor = panel.dataset.productPanel === key ? 'rgba(100, 210, 255, 0.72)' : '';
    panel.style.transform = panel.dataset.productPanel === key ? 'translateY(-4px)' : '';
  });
}

toolCards.forEach((card) => {
  card.addEventListener('mouseenter', () => activateTool(card.dataset.tool));
  card.addEventListener('focusin', () => activateTool(card.dataset.tool));
});

const copyTokens = document.querySelector('#copyTokens');
copyTokens?.addEventListener('click', async () => {
  const tokenText = document.querySelector('.code-window code')?.textContent.trim() || '';
  try {
    await navigator.clipboard.writeText(tokenText);
    copyTokens.textContent = 'Copied';
  } catch {
    copyTokens.textContent = 'Select and copy';
  }
  window.setTimeout(() => {
    copyTokens.textContent = 'Copy tokens';
  }, 1800);
});

renderWorkflow('information');
