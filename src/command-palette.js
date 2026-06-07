import { searchSuite, suiteIndex } from '../../shared/search/index.mjs';

export function initCommandPalette({ root = document } = {}) {
  const dialog = root.querySelector('#command-palette');
  const input = root.querySelector('#command-input');
  const list = root.querySelector('#command-results');
  const openButton = root.querySelector('#command-open');
  if (!dialog || !input || !list) return;

  let active = -1;
  let current = [];

  function render(query) {
    current = query ? searchSuite(query) : suiteIndex.map((e) => ({ ...e }));
    active = current.length ? 0 : -1;
    list.replaceChildren(
      ...current.map((entry, index) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = entry.url;
        link.textContent = entry.title;
        link.setAttribute('role', 'option');
        link.id = `command-option-${index}`;
        link.setAttribute('aria-selected', String(index === active));
        li.append(link);
        return li;
      })
    );
    input.setAttribute('aria-activedescendant', active >= 0 ? `command-option-${active}` : '');
  }

  function open() {
    dialog.hidden = false;
    input.value = '';
    render('');
    input.focus();
  }
  function close() {
    dialog.hidden = true;
    openButton?.focus();
  }

  openButton?.addEventListener('click', open);
  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      dialog.hidden ? open() : close();
    } else if (!dialog.hidden && event.key === 'Escape') {
      close();
    }
  });
  input.addEventListener('input', () => render(input.value));
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      active = Math.min(active + 1, current.length - 1);
      render(input.value);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      active = Math.max(active - 1, 0);
      render(input.value);
    } else if (event.key === 'Enter' && active >= 0) {
      event.preventDefault();
      window.location.href = current[active].url;
    }
  });
}
