export function textElement(tag, text) {
  const element = document.createElement(tag);
  element.textContent = text;
  return element;
}

export function setPressed(buttons, activeKey) {
  buttons.forEach((button) => {
    const selected = button.dataset.workflow === activeKey;
    button.classList.toggle('is-selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}

export function setStatus(node, message) {
  if (node) node.textContent = message;
}
