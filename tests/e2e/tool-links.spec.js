import { expect, test } from '@playwright/test';

test('tool cards expose launch and GitHub links', async ({ page }) => {
  await page.goto('/');
  for (const name of [
    'Public-Service Letter Generator',
    'Accessible Public Forms',
    'Public Service Directory',
    'Legal Templates UK',
    'Open Access Design System'
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
