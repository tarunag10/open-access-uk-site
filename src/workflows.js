export const workflows = {
  information: {
    title: 'Get information',
    body: 'Start with a letter or template, keep the request focused, export a copy, and use the directory to understand where to go next.',
    steps: [
      'Choose a request type.',
      'Draft locally in the browser.',
      'Export a copy and track replies.'
    ]
  },
  forms: {
    title: 'Fix an inaccessible form',
    body: 'Use the accessible forms library to inspect a service journey, identify missing labels or grouped-control issues, and export a shareable JSON spec.',
    steps: [
      'Pick a public-service form pattern.',
      'Review readiness and notes.',
      'Copy or download the improved spec.'
    ]
  },
  escalate: {
    title: 'Escalate a case',
    body: 'Map the right escalation route, gather evidence, save a local plan, and keep official links close to the next action.',
    steps: ['Search the issue.', 'Build an action plan.', 'Save or print the checklist.']
  },
  contribute: {
    title: 'Build or contribute',
    body: 'Start from the parent GitHub repo, choose a public tool, and use contributor docs to make a focused improvement.',
    steps: [
      'Open the parent repo.',
      'Pick a focused issue or improvement.',
      'Run the relevant checks before opening a pull request.'
    ]
  }
};
