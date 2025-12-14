import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import { URL } from 'url';
import { test, expect } from '@playwright/test';


test('download the json content opening in next tab', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/notes/api/api-docs/');
  await expect(page).toHaveTitle('Swagger-Notes API Documentation');
  await page.waitForSelector('.url', { state: 'visible', timeout: 5000 });
  const downloadLink = await page.locator(`a.link[href*=".json"]`);
  const href = await downloadLink.getAttribute('href');

  // Get full URL if it's relative
  const downloadUrl = new URL(href!, page.url()).toString();
  console.log(`Download URL: ${downloadUrl}`);
  const fileName = path.basename(downloadUrl);
  const filePath = path.join(__dirname, 'test-results', fileName);

  // Create directory if not exists
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  // Download the file manually
  const file = fs.createWriteStream(filePath);
  await new Promise((resolve, reject) => {
    https.get(downloadUrl, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => { }); // Delete file if error
      reject(err);
    });
  });

  console.log(`Downloaded to: ${filePath}`);
  await expect(page.locator(`a[href*="/notes/app"]`)).toBeVisible;

});


test('download the pdf content', async ({ page }) => {
  await page.goto('https://www.princexml.com/samples/');
  await expect(page).toHaveTitle('Prince - Sample Documents');
  await page.waitForSelector('#dictionary .links', { state: 'visible', timeout: 5000 });
  const downloadLink = await page.locator(`#dictionary .links a:has-text("PDF")`);
  const href = await downloadLink.getAttribute('href');
  console.log(`Href URL: ${href}`);
  // Get full URL if it's relative
  const downloadUrl = new URL(href!, page.url()).toString();
  console.log(`Download URL: ${downloadUrl}`);
  const fileName = path.basename(downloadUrl);
  const filePath = path.join(__dirname, 'test-results', fileName);

  // Create directory if not exists
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  // Download the file manually
  const file = fs.createWriteStream(filePath);
  await new Promise((resolve, reject) => {
    https.get(downloadUrl, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => { }); // Delete file if error
      reject(err);
    });
  });

  console.log(`Downloaded to: ${filePath}`);
  await expect(page.locator(`a[href*="/notes/app"]`)).toBeVisible;

});