import { expect, test } from '@playwright/test';

test('homepage loads and core navigation works', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Open Access UK' })).toBeVisible();
  await page.getByRole('link', { name: 'Skip to content' }).focus();
  await expect(page.locator('#main')).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: 'Toolkit' })
    .click();
  await expect(page.locator('#toolkit')).toBeInViewport();
});

test('workflow selection updates content and selected state', async ({ page }) => {
  await page.goto('/');
  const formWorkflow = page.getByRole('button', { name: /Fix an inaccessible form/ });
  await formWorkflow.click();
  await expect(formWorkflow).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#workflow-detail')).toContainText('Fix an inaccessible form');
});

test('mobile navigation is reachable', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 760 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu' });
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
});
