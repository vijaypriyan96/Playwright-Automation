import { test, expect } from '../SpecFiles/browserManagerFixture';

test('use storage state in access site', async ({ bm, variables }) => {
    console.log(bm.browser.browserType().name());
    console.log(variables.resolveFunction('<<today-date-time>>'));
    console.log(variables.getRandomUser());
    const context = bm.context;
    let page = bm.page;
    await page.goto('https://opensource-demo.orangehrmlive.com/web');
    await expect(page).toHaveTitle('OrangeHRM');
    await Promise.all([
        context.waitForEvent('page', { timeout: 5000 }),
        page.locator(`.orangehrm-upgrade-link`).click()
    ]);
    page = await bm.openTab(2);
    await expect(page).toHaveURL(`https://orangehrm.com/open-source/upgrade-to-advanced`);
});

test('can open page using custom browser manager', async ({ bm, variables }) => {
    console.log(bm.browser.browserType().name());
    console.log(variables.resolveFunction('<<today-date-time>>'));
    console.log(variables.getRandomUser());
    let page = bm.page;
    await page.goto('https://opensource-demo.orangehrmlive.com/web');
    await expect(page).toHaveTitle('OrangeHRM');
    await page.waitForSelector('//span[text()="Performance"]', { state: 'visible', timeout: 5000 });
    await page.locator(`//span[text()="Performance"]`).click()
});

