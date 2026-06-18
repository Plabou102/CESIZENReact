import { test, expect } from '@playwright/test';

test('la page React se charge', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('body')).toBeVisible();
});