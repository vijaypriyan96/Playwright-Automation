import { test as baseTest } from '@playwright/test';
import { BrowserManager } from '../src/test/helper/browser/browserManager';
import * as resolveFunction from '../src/test/helper/parameters/resolveVariable';

type CustomFixtures = {
  bm: BrowserManager,
  variables: typeof resolveFunction
};

export const test = baseTest.extend<CustomFixtures>({
  bm: async ({ }, use) => {
    const browserManager = new BrowserManager();
    await browserManager.launchBrowser();
    await browserManager.createContextAndPage();
    await use(browserManager);
    await browserManager.closeBrowser();
  },
  variables: async ({ }, use) => {
    await use(resolveFunction);
  }
});

export { expect } from '@playwright/test';