import { Given, Then, When, setDefaultTimeout } from "@cucumber/cucumber"
import { expect } from "@playwright/test"
import { pageNavigation } from "../pages/pageNavigation";
import {  logger, browser, context, openTab, page } from '../helper/browser/browser';
import * as lc from "../pages/letCode.page";
import path from "path";
import { ElementHandle } from 'playwright';

Given('user navigates to the Let Code - Practice and become pro in test automation', async () => {
    await pageNavigation.navigateToUrl();
    logger.info("Going to the target application")
});

When('user clicks on {string} link text', async function (linkText: string) {
    await lc.eleUsingLinkText(linkText).nth(0).click();
});

When('user clicks on button {string}', async function (text: string) {
    await page.getByRole("button", { name: text }).click();
});

Then('assert that {string} text is visible', async function (text: string) {
    await expect(lc.eleUsingText(text)).toBeVisible({ timeout: 10000 });
});

When('user enters {string} into {string} text box', async function (value: string, fieldLabel: string) {
    await lc.textBoxUsingLabel(fieldLabel).fill(value);
});

When('user appends {string} into {string} text box', async function (value: string, fieldLabel: string) {
    await lc.textBoxUsingLabel(fieldLabel).focus();
    await lc.textBoxUsingLabel(fieldLabel).press("End");
    await lc.textBoxUsingLabel(fieldLabel).pressSequentially(value);
    await lc.textBoxUsingLabel(fieldLabel).press("Escape");
});

Then('user asserts that {string} field is equal to {string} text', async function (fieldLabel: string, value: string) {
    expect(await lc.textBoxUsingLabel(fieldLabel).getAttribute("value")).toEqual(value);
});

Then('user asserts that {string} field is disabled', async function (fieldLabel: string) {
    expect(await lc.textBoxUsingLabel(fieldLabel).isDisabled()).toBeTruthy();
});

Then('user asserts that {string} field is readonly', async function (fieldLabel: string) {
    expect(await lc.textBoxUsingLabel(fieldLabel).getAttribute("readonly")).toBeDefined();
});

When('user downloads by clicking on {string}', async function (text: string) {
    const download = await Promise.all([
        page.waitForEvent("download", { timeout: 5000 }),
        lc.eleUsingLinkText(text).click()
    ]);
    const fileName = await download[0].suggestedFilename();
    const currentRepo = path.join(__dirname, '../../..');
    const filepath = path.join(currentRepo, 'test-results');
    await download[0].saveAs(filepath + "/" + fileName);
    this.attach(`Downloaded file: ${fileName}`, 'text/plain');
});

When('user gets x y coordinates of {string} button', async function (text: string) {
    console.log(await page.getByRole("button").getByText(text).boundingBox());
});

Then('user gets the css properties of button {string}', async function (text: string) {
    const cssProperties = await page.getByRole("button").getByText(text).evaluate((element) => {
        const styles = window.getComputedStyle(element);
        return {
            color: styles.color,
            backgroundColor: styles.backgroundColor,
            fontSize: styles.fontSize,
            // Add other CSS properties you need
        };
    });
    console.log(cssProperties);
});

Then('user asserts that button {string} is disabled', async function (text: string) {
    expect(await page.getByRole("button").getByText(text).isDisabled()).toBeTruthy();
});

When('user clicks and hold {string} button for {int} seconds', async function (text: string, time: number) {
    const button = await page.locator(`//button//*[normalize-space(text())="${text}"]`);
    button.click({
        button: "left",
        delay: time * 1000
    })
});

When('user selects {string} value/values from the dropdown {string}', async function (option: string, dropdown: string) {
    let op = option.split(',').map(option => option.trim());
    const o = op.map(option => ({ label: option }));
    const dd = await lc.dropdownUsingLabel(dropdown);
    await dd?.selectOption(o);
});

When('user gets the length of options and prints all of them from the dropdown {string}', async function (dropdown: string) {
    const dd = await lc.dropdownUsingLabel(dropdown).locator(`//option`);
    const attributeValues = await dd.evaluateAll((options) =>
        options.map(option => (option as HTMLOptionElement).innerText)
    );
    console.log("------List of values in dd - " + attributeValues + '------- Length of the dd - ' + await dd.count());
});

When('user gets the value from the dropdown {string}', async function (dropdown: string) {
    const shadowHostHandle = await page.$('#country');

    if (shadowHostHandle) {
        // Access the button within the shadow DOM
        const textHandle = await shadowHostHandle.evaluate((host) => {
            return host.shadowRoot?.querySelector('div');
        });

        // Ensure the buttonHandle is not null and cast it to ElementHandle for DOM interaction
        if (textHandle) {
            // Cast to ElementHandle with 'as unknown as ElementHandle<Element>' to ensure compatibility
            console.log((textHandle as unknown as ElementHandle<Element>).innerText);
        } else {
            console.error("Button element not found in shadow DOM.");
        }
    } else {
        console.error("Shadow host element not found.");
    }
});

When('user clicks {string} for the alert by clicking {string} button', async function (promptAction: "ok" | "cancel", buttonText: string) {
    page.on('dialog', async dialog => {
        console.log('Dialog type - ' + dialog.type());
        console.log('Dialog message - ' + dialog.message());
        promptAction === "ok" ? await dialog.accept() : await dialog.dismiss();
    });
    await page.getByRole("button", { name: buttonText }).click();
});

When('user enters {string} into the alert by clicking {string} button', async function (text: string, buttonText: string) {
    page.on('dialog', async dialog => {
        console.log('Dialog type - ' + dialog.type());
        console.log('Dialog message - ' + dialog.message());
        await dialog.accept(text);
    });
    await page.getByRole("button", { name: buttonText }).click();
});

When('user drags and drops the element', async function () {
    let srcEle = await page.locator(`//*[text()="Drag me to my target"]/parent::div`);
    let desEle = await page.locator(`//*[text()="Drop here"]/parent::div`);
    let sourcePosition = await srcEle.boundingBox();
    let destinationPosition = await desEle.boundingBox();
    // console.log(sourcePosition);
    if (destinationPosition && sourcePosition) {
        await page.mouse.move(sourcePosition.x + sourcePosition.width / 2, sourcePosition.y + sourcePosition.height / 2);
        await page.mouse.down();
        await page.mouse.move(destinationPosition.x + destinationPosition.width / 2, destinationPosition.y + destinationPosition.height / 2);
        await page.mouse.down();
        // console.log(await srcEle.boundingBox());
    } else {
        throw new Error(`No Element found to move`)
    }
});

When('user drags the element to new position', async function () {
    let srcEle = await page.locator(`//*[text()="I can only be dragged within the dotted container"]/parent::div`);
    let sourcePosition = await srcEle.boundingBox();
    // console.log(sourcePosition);
    if (sourcePosition) {
        await page.mouse.click(sourcePosition.x + sourcePosition.width / 2, sourcePosition.y + sourcePosition.height / 2);
        await page.mouse.down();
        await page.mouse.move(sourcePosition.x + sourcePosition.width / 2, sourcePosition.y + sourcePosition.height / 2 + 200);
        await page.mouse.move(sourcePosition.x + sourcePosition.width / 2 + 200, sourcePosition.y + sourcePosition.height / 2 + 200);
        await page.mouse.up();
        // console.log(await srcEle.boundingBox());
    } else {
        throw new Error(`No Element found to move`)
    }
});

When('user drags the {string} work item to {string} section', async function (item: string, section: string) {
    let srcEle = page.locator(`//div[contains(text(),"${item}")]`);
    await srcEle.scrollIntoViewIfNeeded();
    let destArea = page.locator(`//h2[contains(text(),"${section}")]/following-sibling::div`);
    let sourcePosition = await srcEle.boundingBox();
    let destinationPosition = await destArea.boundingBox();
    // console.log(sourcePosition);
    // console.log(destinationPosition);

    if (sourcePosition && destinationPosition) {
        await page.mouse.click(sourcePosition.x + sourcePosition.width / 2, sourcePosition.y + sourcePosition.height / 2);
        await page.mouse.down();
        await page.mouse.move(destinationPosition.x + destinationPosition.width / 2, destinationPosition.y + destinationPosition.height / 2);
        await page.waitForTimeout(2000);
        await page.mouse.move(destinationPosition.x + destinationPosition.width / 2, destinationPosition.y + destinationPosition.height / 2);
        await page.waitForTimeout(2000);
        await page.mouse.up();
    } else {
        throw new Error(`No Element found to move`)
    }
});

Then('user asserts that shadow dom is accessible', async function () {
    console.log(await page.locator(`#open-shadow`).locator(`[for="name"]`).textContent());
});

