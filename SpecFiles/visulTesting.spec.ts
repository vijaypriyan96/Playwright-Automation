import { test, expect } from '@playwright/test';

test('homepage layout should be visually consistent @Visual', async ({ page }) => {
  await page.goto('https://letcode.in/', { waitUntil: "domcontentloaded" });
  await expect(page).toHaveScreenshot('homepage_baseline.png');
});

test('header section should be visually consistent @Visual', async ({ page }) => {
  await page.goto('https://letcode.in/', { waitUntil: "domcontentloaded" });
  const header = page.locator(`//nav[@aria-label="main navigation"]`);
  await expect(header).toHaveScreenshot('header_baseline.png');
});
