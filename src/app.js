const paths = {
  law: {
    title: 'Law and advice-sector review',
    description: 'Check template wording for clarity, flag missing source notes, and make sure user-facing copy stays informational rather than advice-giving.',
    links: [
      ['Legal templates guide', '../legal-templates/CONTRIBUTING.md'],
      ['Letter generator guide', '../letter-generator/CONTRIBUTING.md']
    ]
  },
  design: {
    title: 'Service design and plain English',
    description: 'Improve journeys, reduce form friction, rewrite confusing labels, and help each demo feel like a clear public-service interaction.',
    links: [
      ['Accessible forms guide', '../accessible-forms/CONTRIBUTING.md'],
      ['Design system guide', '../design-system/CONTRIBUTING.md']
    ]
  },
  accessibility: {
    title: 'Accessibility testing',
    description: 'Test keyboard flows, screen-reader names, focus order, colour contrast, responsive layout, and WCAG 2.2 AA gaps across the suite.',
    links: [
      ['Site accessibility statement', 'ACCESSIBILITY.md'],
      ['Forms accessibility statement', '../accessible-forms/ACCESSIBILITY.md']
    ]
  },
  'civic-tech': {
    title: 'Civic tech and static tooling',
    description: 'Keep the demos browser-only, add small tested helpers, improve source-backed directory data, and avoid adding personal-data collection.',
    links: [
      ['Directory guide', '../public-service-directory/CONTRIBUTING.md'],
      ['Maintainer helper guide', '../good-first-issues/CONTRIBUTING.md']
    ]
  },
  maintainer: {
    title: 'Maintainer experience',
    description: 'Shape good-first issues, repository health checks, contribution docs, accessibility triage, and release-ready project hygiene.',
    links: [
      ['Maintainer helper demo', '../good-first-issues/index.html'],
      ['Maintainer helper README', '../good-first-issues/README.md']
    ]
  }
};

const roleLabels = {
  all: 'all seven repos',
  law: 'law-focused repos',
  design: 'design-focused repos',
  accessibility: 'accessibility-focused repos',
  'civic-tech': 'civic tech repos',
  maintainer: 'maintainer-focused repos'
};

function renderPath(value) {
  const path = paths[value] || paths.law;
  document.querySelector('#path-title').textContent = path.title;
  document.querySelector('#path-description').textContent = path.description;
  document.querySelector('#path-links').replaceChildren(
    ...path.links.map(([label, href]) => {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      return link;
    })
  );
}

function filterRepos(value) {
  const cards = [...document.querySelectorAll('[data-repo-card]')];
  let visibleCount = 0;

  cards.forEach((card) => {
    const roles = card.dataset.roles.split(' ');
    const isVisible = value === 'all' || roles.includes(value);
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  const plural = visibleCount === 1 ? 'repo' : 'repos';
  const label = roleLabels[value] || roleLabels.all;
  document.querySelector('#repo-filter-status').textContent = `Showing ${visibleCount} ${plural}: ${label}.`;
}

document.querySelector('#year').textContent = new Date().getFullYear();

const select = document.querySelector('#contributor-path');
document.querySelector('#path-button').addEventListener('click', () => renderPath(select.value));
select.addEventListener('change', () => renderPath(select.value));

const repoFilter = document.querySelector('#repo-role-filter');
repoFilter.addEventListener('change', () => filterRepos(repoFilter.value));
filterRepos(repoFilter.value);
