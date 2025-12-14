import test, { ElementHandle, expect, Page, TestInfo } from "@playwright/test";
import path, { join } from "path";
import { browser } from "src/test/helper/browser/browser";
import { silly } from "winston";

async function captureStep(page: Page, testInfo: TestInfo, stepName?: string) {
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach(stepName || "Generic Screen Shot", { body: screenshot, contentType: 'image/png' });
}

test('Web inputs page for Automation Testing Practice',
    {
        tag: '@A1',
        annotation: {
            type: 'Test Case Link',
            description: 'https://cloudEnterprise.com/Feature/US/testcase/23180',
        },
    },
    async function ({ page }, testInfo) {
        await page.goto('https://practice.expandtesting.com/inputs', { waitUntil: 'domcontentloaded', timeout: 5000 });
        await page.locator(`//h1[text()='Web inputs page for Automation Testing Practice']`).isVisible({ timeout: 3000 });
        await page.locator(`#input-number`).fill("25");
        await page.locator(`#input-text`).fill("Username");
        await page.locator(`#input-password`).fill("Password");
        await page.locator(`#input-date`).pressSequentially("12122025");
        await captureStep(page, testInfo);
        await page.locator(`#btn-display-inputs`).click();
        expect(await page.locator(`#btn-clear-inputs`).isVisible()).toBe(true);
        await captureStep(page, testInfo);
        await expect(page.locator(`#output-number`)).toHaveText("25");
        await expect(page.locator(`#output-text`)).toHaveText("Username");
        await expect(page.locator(`#output-password`)).toHaveText("Password");
        await expect(page.locator(`#output-date`)).toHaveText("2025-12-12");
        await page.locator(`#btn-clear-inputs`).click();
        await expect(page.locator(`#output-number`)).toBeHidden();
        await captureStep(page, testInfo);

    });

test('Dynamic pagination Table page for Automation Testing Practice', async ({ page }, testInfo) => {
    await page.goto('https://practice.expandtesting.com/dynamic-pagination-table', { waitUntil: 'domcontentloaded', timeout: 5000 });
    await page.locator(`//h1[text()='Dynamic pagination Table page for Automation Testing Practice']`).isVisible({ timeout: 3000 });
    await page.locator(`.form-select`).selectOption("5");
    await expect(page.locator(`table#example tbody tr td:first-child:has-text("Sophia Anderson")`)).not.toBeVisible();
    await page.locator(`#example_next`).click();
    await expect(page.locator(`table#example tbody tr td:first-child:has-text("Sophia Anderson")`)).toBeVisible();
    await captureStep(page, testInfo);
    await page.locator(`[type="search"]`).fill("Dance");
    await expect(page.locator(`table#example tbody tr td:first-child:has-text("Sophia Anderson")`)).toBeVisible();
    await captureStep(page, testInfo);
});

test('Locators Test page for Automation Testing', async ({ page }, testInfo) => {
    await page.goto('https://practice.expandtesting.com/locators', { waitUntil: 'domcontentloaded', timeout: 5000 });
    await page.locator(`//h1[text()='Locators Test page for Automation Testing']`).isVisible({ timeout: 3000 });
    await page.getByRole('link', { name: 'Contact' }).click();
    await expect(page.locator(`//h1[text()='Contact page for Automation Testing Practice']`)).toBeVisible();
    await captureStep(page, testInfo);
    await page.goBack();
    await expect(page.locator(`//h1[text()='Locators Test page for Automation Testing']`)).toBeVisible();
    await expect(page.getByText('🔥 Hot Deal: Buy 1 Get 1 Free')).toBeVisible();
    await page.getByLabel('Choose a country').selectOption("Japan");
    await captureStep(page, testInfo);
    await page.getByPlaceholder('Filter by tag').fill("Japan");
    await captureStep(page, testInfo);
    await page.getByTitle(`Refresh content`).click();
    await expect(page.getByTestId(`status-message`)).toBeVisible();
    await captureStep(page, testInfo);
});

test('Radio Buttons page for Automation Testing Practice', async ({ page }, testInfo) => {
    await page.goto('https://practice.expandtesting.com/radio-buttons', { waitUntil: 'domcontentloaded', timeout: 5000 });
    await page.locator(`//h1[text()='Radio Buttons page for Automation Testing Practice']`).isVisible({ timeout: 3000 });
    await page.locator(`input.form-check-input[value="red"]`).check();
    console.log(await page.locator(`div.page-layout`).innerHTML());
    await captureStep(page, testInfo);
});

test('Drag and Drop Circles', async ({ page }, testInfo) => {
    await page.goto('https://practice.expandtesting.com/drag-and-drop-circles', { waitUntil: 'domcontentloaded', timeout: 5000 });
    await page.locator(`//h1[text()='Drag and Drop Circles']`).isVisible({ timeout: 3000 });
    let targetElement = page.locator(`#target`);
    let src1 = page.locator(`div.red`);
    let src2 = page.locator(`div.blue`);
    let src3 = page.locator(`div.green`);
    await src1.dragTo(targetElement);
    await src2.dragTo(targetElement);
    await src3.dragTo(targetElement);
    await captureStep(page, testInfo);
    await expect(page.locator(`#source [draggable="true"]`)).not.toBeVisible();
});


test('File Uploader page for Automation Testing Practice', async ({ page }, testInfo) => {
    await page.goto('https://practice.expandtesting.com/upload', { waitUntil: 'domcontentloaded', timeout: 5000 });
    await page.locator(`//h1[text()='File Uploader page for Automation Testing Practice']`).isVisible({ timeout: 3000 });
    let filePath = path.join(__dirname, '../', 'src/test/helper/attachments', 'AddressProof.docx');
    console.log(filePath)
    let inputLocator = page.getByTestId("file-input");
    await inputLocator.setInputFiles(filePath);
    await page.getByTestId(`file-submit`).click();
    await page.locator(`//h1[text()='File Uploaded!']`).isVisible({ timeout: 3000 });
    await captureStep(page, testInfo);
    await page.goto('https://practice.expandtesting.com/upload', { waitUntil: 'domcontentloaded', timeout: 5000 });
    await page.locator(`//h1[text()='File Uploader page for Automation Testing Practice']`).isVisible({ timeout: 3000 });
    page.on('filechooser', async (fileChooser) => {
        fileChooser.setFiles(filePath);
    });
    await page.locator(`#fileInput`).click();
    await page.getByTestId(`file-submit`).click();
    await page.locator(`//h1[text()='File Uploaded!']`).isVisible({ timeout: 3000 });
    await captureStep(page, testInfo);
    await page.locator(`//h1[text()='File Uploaded!']`).isVisible({ timeout: 3000 });
    await captureStep(page, testInfo);
});

test('File Downloader page for Automation Testing Practice', async ({ page }, testInfo) => {
    await page.goto('https://practice.expandtesting.com/download', { waitUntil: 'domcontentloaded', timeout: 5000 });
    await page.locator(`//h1[text()='File Downloader page for Automation Testing Practice']`).isVisible({ timeout: 3000 });
    let filePath = path.join(__dirname, 'test-results/');
    console.log(filePath);
    page.on('download', (download) => {
        let fileName = download.suggestedFilename();
        let fl = filePath + fileName;
        console.log(fl);
        download.saveAs(filePath + fileName);
    });
    await page.getByTestId(`some-file.json`).click();
    await captureStep(page, testInfo);
});

test('Dynamic Table page for Automation Testing Practice', async ({ page }, testInfo) => {
    await page.goto('https://practice.expandtesting.com/dynamic-table', { waitUntil: 'domcontentloaded', timeout: 5000 });
    await expect(page.locator(`//h1[text()='Dynamic Table page for Automation Testing Practice']`)).toBeVisible();
    let headerElements = await page.locator(`//table[@class="table table-striped"]/thead/tr/th`);
    let headerCount = headerElements.count();
    let Name, Memory = null;
    let flag = false;
    for (let i = 0; i < await headerCount; i++) {
        if (await headerElements.nth(i).innerText() === 'Name') Name = i;
        else if (await headerElements.nth(i).innerText() === 'Memory') Memory = i;
    }
    if (Name !== null || Memory !== null) {
        let bodyRows = await page.locator(`//table[@class="table table-striped"]/tbody/tr`);
        let bodyRowCount = await bodyRows.count();
        for (let i = 0; i < await bodyRowCount; i++) {
            let rowEle = await bodyRows.nth(i).locator(`//child::td`);
            let columnCount = await rowEle.count();
            for (let j = 0; j < await columnCount; j++) {
                if (await rowEle.nth(Name!).innerText() === 'Chrome') {
                    console.log(await rowEle.nth(j).innerText(), await rowEle.nth(Memory!).innerText());
                    await captureStep(page, testInfo);
                    flag = true;
                    break;
                } else {
                    continue;
                }
            }
            if (flag === true) break;
        }
    }
    else {
        console.error(`Unable to find columns with specified names`)
    }
});

test('Autocomplete page for Automation Testing Practice', async ({ page }, testInfo) => {
    await page.goto('https://practice.expandtesting.com/autocomplete', { waitUntil: 'domcontentloaded', timeout: 5000 });
    await page.locator(`//h1[text()='Autocomplete page for Automation Testing Practice']`).isVisible({ timeout: 3000 });
    await page.locator('#country').fill("United");
    await page.locator(`//input[@value="United Kingdom"]/preceding-sibling::strong`).click();
    await page.locator(`.btn-primary`).click();
    expect(await page.locator(`#result`).innerText()).toBe("You selected: United Kingdom");
    await captureStep(page, testInfo);
});

test('Shadow DOM page for Automation Testing Practice', async ({ page }, testInfo) => {
    await page.goto('https://practice.expandtesting.com/shadowdom', { waitUntil: 'domcontentloaded', timeout: 5000 });
    await page.locator(`//h1[text()='Shadow DOM page for Automation Testing Practice']`).isVisible({ timeout: 3000 });
    let nonShadowButton = page.locator(`#my-btn:has-text("Here's a basic button example.")`);
    let shadowButton = page.locator(`#shadow-host >> #my-btn`);
    console.log(await nonShadowButton.innerText());
    console.log(await shadowButton.innerText());
    await shadowButton.click({ delay: 5000 });
    await captureStep(page, testInfo);
});

test('Slow Resources page for Automation Testing Practice', async ({ page }, testInfo) => {
    await page.goto('https://practice.expandtesting.com/slow', { waitUntil: 'domcontentloaded', timeout: 5000 });
    await page.locator(`//h1[text()='Slow Resources page for Automation Testing Practice']`).isVisible({ timeout: 3000 });
    let spinner = `[role="status"]`;
    await captureStep(page, testInfo);
    await page.waitForSelector(spinner, { state: "detached" });
    expect(await page.locator(`.alert strong`).innerText()).toBe("The slow task has finished. Thanks for waiting!");
    await captureStep(page, testInfo);

});

test('Infinite Scroll page for Automation Testing Practice', async ({ page }, testInfo) => {
    await page.goto('https://practice.expandtesting.com/infinite-scroll', { waitUntil: 'domcontentloaded', timeout: 5000 });
    await page.locator(`//h1[text()='Infinite Scroll page for Automation Testing Practice']`).isVisible({ timeout: 3000 });
    let current = await page.locator(`//b[contains(text(),"Timestamp")]`).count();
    let updated = current;
    while (current <= updated) {
        updated = await page.locator(`//b[contains(text(),"Timestamp")]`).count();
        await captureStep(page, testInfo);
        await page.mouse.wheel(0, 100)
        if (updated === 20) break;
    }
});

test('JavaScript Dialogs page for Automation Testing Practice', async ({ page }, testInfo) => {
    await page.goto('https://practice.expandtesting.com/js-dialogs', { waitUntil: 'domcontentloaded', timeout: 5000 });
    await page.locator(`//h1[text()='JavaScript Dialogs page for Automation Testing Practice']`).isVisible({ timeout: 3000 });
    page.on("dialog", (dialog) => {
        console.log(dialog.type());
        if (dialog.type() === "alert") {
            dialog.accept();
        }
        else if (dialog.type() === "confirm") {
            dialog.dismiss();
        }
        else if (dialog.type() === "prompt") {
            dialog.accept("Entered Value");
        }
    });
    await page.locator(`#js-alert`).click();
    expect(await page.locator(`#dialog-response`).innerText()).toBe("OK");
    await page.locator(`#js-confirm`).click();
    expect(await page.locator(`#dialog-response`).innerText()).toBe("Cancel");
    await page.locator(`#js-prompt`).click();
    expect(await page.locator(`#dialog-response`).innerText()).toBe("Entered Value");
    await captureStep(page, testInfo);
    page.off("dialog", (dialog) => {
        console.log("turning off the dialog listener");
    });
});

test('Horizontal Slider page for Automation Testing Practice', async ({ page }, testInfo) => {
    await page.goto('/horizontal-slider', { waitUntil: 'domcontentloaded', timeout: 5000 });
    await page.locator(`//h1[text()='Horizontal Slider page for Automation Testing Practice']`).isVisible({ timeout: 3000 });
    let slider = page.locator(`[type="range"]`);
    await slider.fill("2.5");
    console.log(await page.locator(`#range`).innerText());
    await captureStep(page, testInfo);
});


test('Dynamic Table page for Automation Testing Practice using Text Content/ InnerTexts', { tag: "@D1" }, async ({ page }, testInfo) => {
    await page.goto('https://practice.expandtesting.com/dynamic-table', { waitUntil: 'domcontentloaded', timeout: 5000 });
    await expect(page.locator(`//h1[text()='Dynamic Table page for Automation Testing Practice']`)).toBeVisible();
    let headerElements = page.locator(`//table[@class="table table-striped"]/thead/tr/th`);
    let bodyElements = page.locator(`//table[@class="table table-striped"]/tbody/tr/td`);
    console.log(await headerElements.allInnerTexts())
    console.log(await bodyElements.allInnerTexts())
});


test.describe.configure({ mode: 'serial', retries: 0, timeout: 20_000 });
test.describe('two annotated tests', {
    tag: "@A2",
    annotation: {
        type: 'issue',
        description: 'https://github.com/microsoft/playwright/issues/23180',
    },
}, () => {
    test.use({ locale: 'en-US' });

    test.skip(({ browserName }) => browserName !== 'firefox', 'firefox only!');

    test('one', {
        tag: "@AB",
        annotation: {
            type: 'issue',
            description: 'https://github.com/microsoft/playwright/issues/23188',
        }
    }, async ({ page, browserName }) => {
        // test.skip(browserName !== 'chromium', 'Chromium only!');
        await page.goto('https://google.com', { waitUntil: 'domcontentloaded' });
        console.log("1st one")
        // ...
    });

    test('two', {
        tag: "@AC",
        annotation: {
            type: 'issue',
            description: 'https://github.com/microsoft/playwright/issues/23189',
        }
    }, async ({ page, browserName }) => {
        // test.skip(browserName !== 'webkit', 'Chromium only!');
        console.log("2nd one")
        // ...
    });
});
