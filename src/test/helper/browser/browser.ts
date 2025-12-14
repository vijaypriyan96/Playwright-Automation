// page.ts
import { browserManager } from "./browserManager";
import { logger } from "../hooks/hooks";
import { Browser, BrowserContext, Page } from "@playwright/test";

// Declare variables first
export let page!: Page;
export let context!: BrowserContext;
export let browser!: Browser;

// Initializes these variables once the browser is ready
export function initBrowserRefs() {
    if (!browserManager.page ||
        !browserManager.context ||
        !browserManager.browser) {
        throw new Error("Browser, context, or page is not initialized.");
    }
    page = browserManager.page;
    context = browserManager.context;
    browser = browserManager.browser;
}

export const openTab = (index: number) => browserManager.openTab(index);
export { logger };
export const closePage = async () => {
    try {
        await browserManager.closePage();
    } catch (error) {
        logger.error(`Error closing page: ${error}`);
    }
};
export const closeContext = async () => {
    try {
        await browserManager.closeContext();
    } catch (error) {
        logger.error(`Error closing context: ${error}`);
    }
};
export const closeBrowser = async () => {
    try {
        await browserManager.closeBrowser();
    } catch (error) {
        logger.error(`Error closing browser: ${error}`);
    }
};