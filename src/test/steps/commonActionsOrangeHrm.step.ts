import { Given, Then, When, setDefaultTimeout } from "@cucumber/cucumber"
import { expect } from "@playwright/test"
import { pageNavigation } from "../pages/pageNavigation";
import { page, logger, browser, context, openTab, initBrowserRefs } from '../helper/browser/browser';
import * as user from '../helper/testData/Users.json'
import path from "path";
import * as ele from "../pages/orangeHrmElements";

Given('user navigates to the Orange Hrm application login page', async () => {
    await pageNavigation.navigateToUrl();
    await page.waitForLoadState('networkidle', { timeout: 100000 });
    logger.info("Going to the target application")
});

// The fill() function clears the existing text and types the provided text in the text box.
// The type() function types the provided text character-by-character, similar to human typing. It doesn’t clear existing text by default.

When('user enters {string} into {string} field', async function (value: string, fieldLabel: string) {
    ele.inputEleUsingLabel(fieldLabel).fill(value);
});

When('user enters {string} into {string} placeholder', async function (value: string, placeholderText: string) {
    ele.inputEleUsingPlaceholder(placeholderText).fill(value);
});

When('user enters {string} into {string} textarea', async function (value: string, placeholderText: string) {
    ele.textAreaEleUsingPlaceholder(placeholderText).fill(value);
});

When('user selects {string} from {string} dropdown', async function (dropdownValue: string, fieldLabel: string) {
    await ele.dropdownSelectByText(fieldLabel, dropdownValue);
});

When('user clicks on {string} button', async function (buttonText: string) {
    await page.getByRole('button').getByText(buttonText).nth(0).click();
});

When("user clicks on {string} button's {int} occurrence", async function (buttonText: string, n: number) {
    await page.getByRole('button').getByText(buttonText).nth(n - 1).click();
});

When('user clicks on {string} text', async function (text: string) {
    await page.getByText(text).first().click();
});

When('user clicks on user dropdown icon', async function () {
    await expect(ele.userDropdownIcon()).toBeVisible();
    ele.userDropdownIcon().click();
});

When('user press {string} key/keys on active field', async function (keyValue: string) {
    await page.keyboard.press(keyValue);
});

When('user {string} the side menu', async function (state: "expands" | "collapses") {
    await ele.sideMenuClick(state);
});

When('user clicks on the {string} toggle', async function (toggleText: string) {
    await ele.toggleEleUsingText(toggleText).click();
});

When('user clicks on {string} for {string} radio button', async function (option: string, radioButton: string) {
    await ele.radioButton(radioButton, option).click();
});

When('user selects {string} date from {string} field', async function (date: Date, dateField: string) {
    await ele.dateEleCalenderIcon(dateField).click();
    await ele.datePicker(date);
});

// Below helps the user to upload the file directly to the available input[file] element in the DOM without any pop ups
// setInputFiles function can take array of file paths to be uploaded if the element is input[ multiple file]
When('user uploads {string} file', async function (fileName: string) {
    const currentRepo = path.join(__dirname, '../');
    const infoFilePath = path.join(currentRepo, '/helper/attachments/');
    const filePath = path.join(infoFilePath, fileName);
    const fileInput = await page.locator(`input[type="file"]`);
    await fileInput.setInputFiles(filePath);
});

// Below helps the user to upload the file if input[file] element in the DOM is not available and we need to upload through file explorer
// setFiles function can take array of file paths to be uploaded if the element is input[ multiple file]
When('user uploads {string} file through file explorer', async function (fileName: string) {
    const currentRepo = path.join(__dirname, '../');
    const infoFilePath = path.join(currentRepo, '/helper/attachments/');
    const filePath = path.join(infoFilePath, fileName);
    page.on("filechooser", async (fileChooser) => {
        await fileChooser.setFiles(filePath);
    })
    await page.locator(`//div[text()='Browse']`).click();
});

When('user closes the notification banner', async function () {
    if (expect(ele.toastBannerCloseIcon().isVisible())) {
        await ele.toastBannerCloseIcon().click();
    }
});

When('user clicks on checkbox in the table for row {int}', async function (row: number) {
    await ele.tableBodyCheckbox().nth(row).click();
});

When('user clicks on {string} in the table for row {int}', async function (action: "edit" | "delete", row: number) {
    if (action === "edit") {
        await ele.tableEditIcon().nth(row - 1).click();
    } else {
        await ele.tableDeleteIcon().nth(row - 1).click();
    }
});

When('user clicks on {string} button title', async function (buttonText: string) {
    await page.getByTitle(buttonText).click();
});

Given('user switches to browser tab {int}', async function (tabNumber: number) {
    await openTab(tabNumber);
    initBrowserRefs();
});
When('user clicks on download on row {int}', async function (row: number) {
    const download = await Promise.all([
        page.waitForEvent("download", { timeout: 5000 }),
        ele.tableDownloadIcon().nth(row - 1).click()
    ]);
    const fileName = await download[0].suggestedFilename();
    const currentRepo = path.join(__dirname, '../../..');
    const filepath = path.join(currentRepo, 'test-results');
    await download[0].saveAs(filepath + "/" + fileName);
});
