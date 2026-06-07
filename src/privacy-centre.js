import { storageRegistry, clearKnownStorage } from '../../shared/privacy/local-storage.mjs';

function readPresence(key) {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? null : value.length;
  } catch {
    return null;
  }
}

export function initPrivacyCentre(mountSelector = '#privacy-centre') {
  const mount = document.querySelector(mountSelector);
  if (!mount) return;

  function render() {
    const list = document.createElement('ul');
    list.className = 'privacy-list';
    list.setAttribute('aria-label', 'Local data stored in this browser');
    for (const item of storageRegistry) {
      const size = readPresence(item.key);
      const li = document.createElement('li');
      li.className = 'privacy-item';
      const title = document.createElement('strong');
      title.textContent = `${item.label} (${item.tool})`;
      const detail = document.createElement('p');
      detail.textContent =
        size === null
          ? `${item.contains} — nothing stored.`
          : `${item.contains} — ${size} characters stored.`;
      li.append(title, detail);
      list.append(li);
    }
    const clearAll = document.createElement('button');
    clearAll.type = 'button';
    clearAll.className = 'secondary';
    clearAll.textContent = 'Clear all local data';
    clearAll.addEventListener('click', () => {
      clearKnownStorage(window.localStorage);
      render();
      status.textContent = 'Cleared all known local data from this browser.';
    });
    const status = document.createElement('p');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    mount.replaceChildren(list, clearAll, status);
  }

  render();
}
