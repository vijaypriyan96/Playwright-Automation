import path from "path"
import { chromium } from "playwright";
import fs from "fs/promises";
import { expect } from "@playwright/test";

export default async () => {
    const storageStatePath = path.join(__dirname, 'storageState.json');

    try {
        await fs.access(storageStatePath);
        console.log(`Storage state file exists at ${storageStatePath}`);
        return;
    } catch {
        console.log(`Storage state file does not exist at ${storageStatePath}, creating it...`);
        const browser = await chromium.launch();
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto('https://opensource-demo.orangehrmlive.com/web/auth/login');
        await page.waitForLoadState('domcontentloaded', { timeout: 5000 });
        await page.getByPlaceholder('Username').fill('Admin');
        await page.getByPlaceholder('Password').fill('admin123');
        await page.getByRole('button', { name: 'Login' }).click();
        await page.waitForLoadState('domcontentloaded', { timeout: 5000 });
        await page.waitForSelector('//span[text()="Dashboard"]', { state: 'visible', timeout: 5000 });
        // await expect(page).toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
        await context.storageState({ path: storageStatePath });
        await browser.close();
    }
}