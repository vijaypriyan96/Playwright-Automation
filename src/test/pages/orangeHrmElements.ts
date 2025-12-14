import { page } from "../helper/browser/browser";
import { expect } from "playwright/test";


// Below Elements is generic and can be used entire application
export const eleUsingText = (text: string) => page.locator(`//*[text()="${text}"]`).first();
export const inputEleUsingLabel = (fieldLabel: string) => page.locator(`//label[normalize-space(text())="${fieldLabel}"]/ancestor::div[contains(@class,"input-group")]//input`);
export const inputValueUsingLabel = (fieldLabel: string) => page.locator(`//label[normalize-space(text())="${fieldLabel}"]/ancestor::div[contains(@class,"input-group")]//input//div`);
export const dropdownValueUsingLabel = (fieldLabel: string) => page.locator(`//label[normalize-space(text())="${fieldLabel}"]/ancestor::div[contains(@class,"input-group")]//div[contains(@class,"select-text-input")]`);
export const inputEleUsingPlaceholder = (placeholderText: string) => page.locator(`//input[normalize-space(@placeholder)="${placeholderText}"]`);
export const textAreaEleUsingPlaceholder = (placeholderText: string) => page.locator(`//textarea[normalize-space(@placeholder)="${placeholderText}"]`);
const dropdownIconUsingLabel = (dropdownName: string) => page.locator(`//label[normalize-space(text())="${dropdownName}"]/ancestor::div[contains(@class,"input-group")]//i[contains(@class,"select-text--arrow")]`);
const dropdownOptionUsingLabel = (dropdownValue: string) => page.locator(`//div[@role="option"]//span[normalize-space(text())="${dropdownValue}"]`);
export const dateEleUsingLabel = (fieldLabel: string) => page.locator(`//label[normalize-space(text())="${fieldLabel}"]/ancestor::div[contains(@class,"input-group")]//input`);
export const toggleEleUsingText = (toggleText: string) => page.locator(`//*[text()="${toggleText}"]/ancestor::div[1]//*[contains(@class,"switch-input")]`);
export const radioButton = (labelText: string, option: string) => page.locator(`//label[text()="${labelText}"]/ancestor::div[2]//label[text()="${option}"]`);
export const dateEleCalenderIcon = (fieldLabel: string) => page.locator(`//label[normalize-space(text())="${fieldLabel}"]/ancestor::div[contains(@class,"input-group")]//input`);
const monthDropdown = () => page.locator(`//div[contains(@class,"input-calendar")]//div[contains(@class,"month")]//i`);
const monthSelector = (month: string) => page.locator(`//div[contains(@class,"input-calendar")]//li[contains(@class,"selector-month")]//ul//li[text()="${month}"]`);
const yearDropdown = () => page.locator(`//div[contains(@class,"input-calendar")]//div[contains(@class,"year")]//i`);
const yearSelector = (year: number) => page.locator(`//div[contains(@class,"input-calendar")]//li[contains(@class,"selector-year")]//ul//li[text()="${year}"]`);
const dateSelector = (date: number) => page.locator(`//div[contains(@class,"input-calendar")]//div[contains(@class,"dates")]//div[text()="${date}"]`);


// Below Elements handle specific elements in the application
export const sideMenuExpandCollapseButton = () => page.locator(`//button[contains(@class,"main-menu-button")]//i`);
export const userDropdownIcon = () => page.locator(`//*[contains(@class,"userdropdown-icon")]`);
export const toastMessage = (status: string, message: string) => page.locator(`//div[contains(@class,"toast-content")]//p[text()="${status}"]/following-sibling::p[text()="${message}"]`);
export const toastBannerCloseIcon = () => page.locator(`//div[contains(@class,"toast-close") and @role="button"]`);
export const loadingSpinner = () => page.locator(`//div[@class="oxd-loading-spinner"]`);
export const tableHeaderCheckbox = () => page.locator(`//div[@class="oxd-table-header"]//input[@type="checkbox"]`);
export const tableBodyCheckbox = () => page.locator(`//div[@class="oxd-table-body"]//input[@type="checkbox"]`);
export const tableEditIcon = () => page.locator(`//div[@class="oxd-table-body"]//i[contains(@class,"pencil")]`);
export const tableDeleteIcon = () => page.locator(`//div[@class="oxd-table-body"]//i[contains(@class,"trash")]`);
export const tableDownloadIcon = () => page.locator(`//div[@class="oxd-table-body"]//i[contains(@class,"download")]`);



// Function enables to user in selecting a option from the dropdown menu
export const dropdownSelectByText = async (dropdownName: string, dropdownValue: string) => {
    await dropdownIconUsingLabel(dropdownName).click();
    await dropdownOptionUsingLabel(dropdownValue).scrollIntoViewIfNeeded({ timeout: 5000 });
    await dropdownOptionUsingLabel(dropdownValue).click();
}

// Function enables to user to interact with the Side Menu collapsable tab in the Application
export const sideMenuClick = async (state: string) => {
    let classValue = await sideMenuExpandCollapseButton().getAttribute("class");
    let currentState = typeof (classValue) === "string" ? classValue : "NA";

    // Interacts only if the required state and current state or the side menu is different
    if (state == "collapses" && currentState.indexOf("left") !== -1) {
        await sideMenuExpandCollapseButton().click();
    } else if (state == "expands" && currentState.indexOf("right") !== -1) {
        await sideMenuExpandCollapseButton().click();
    } else if (currentState === "NA") {
        throw new Error("Not able to interact with side menu button");
    }
}

// Enables the user to interact with Date picker element within the application
export const datePicker = async (date: Date) => {

    // Storing the year, date, month in their individual variables
    let [y, d, m] = String(date).split('-');

    // Setting the equivalent Month text for the numeric month value
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    let month: string = monthNames[Number(m) - 1];

    // Clicks on the month dropdown and selects the specified month
    await monthDropdown().click();
    await monthSelector(month).scrollIntoViewIfNeeded({ timeout: 5000 });
    await monthSelector(month).click();
    await (expect(monthSelector(month)).toBeHidden());

    // Clicks on the year dropdown and selects the specified year
    await yearDropdown().click();
    await yearSelector(Number(y)).scrollIntoViewIfNeeded({ timeout: 5000 });
    await yearSelector(Number(y)).click();
    await (expect(yearSelector(Number(y))).toBeHidden());

    // Clicks on the specified date
    await dateSelector(Number(d)).scrollIntoViewIfNeeded({ timeout: 5000 });
    await dateSelector(Number(d)).click();

}

// Function extracts the table date from the current page and stores it in the 2D array
export const getGridData = async () => {
    let gridData: string[][] = [];
    const rows = page.locator(`//div[@class="oxd-table-body"]//div[@role="row"]`);
    const rowCount = await rows.count();

    for (let rowCounter = 0; rowCounter < rowCount; rowCounter++) {
        const row = rows.nth(rowCounter);
        await row.scrollIntoViewIfNeeded({ timeout: 5000 });

        // Locate all cells within the current row
        const cellContents = await row.locator(`//div[@role="cell"]/div`).allInnerTexts();
        
        // Push the array of cell contents to the gridData array
        gridData.push(cellContents);
    }
    return gridData;
}
