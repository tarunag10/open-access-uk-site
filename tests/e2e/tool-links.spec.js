import { expect, test } from '@playwright/test';

test('tool cards expose launch and GitHub links', async ({ page }) => {
  await page.goto('/');
  for (const name of [
    'Letter generator',
    'Accessible forms',
    'Public service directory',
    'Legal templates',
    'Design system'
  ]) {
    const card = page.locator('.tool-card', { hasText: name });
    await expect(card.getByRole('link', { name: /Launch tool/ })).toHaveAttribute(
      'href',
      /^https:\/\//
    );
    await expect(card.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      /github\.com\/tarunag10/
    );
  }
});
