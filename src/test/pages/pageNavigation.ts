import { page, browser, context } from '../helper/browser/browser';

export class pageNavigation {
    static async navigateToUrl() {
        let url = typeof (process.env.npm_config_BASEURL) === "string" ? process.env.npm_config_BASEURL : process.env.BASEURL;
        await page.goto(url ? url : "", { timeout: 200000, waitUntil: "domcontentloaded" });
    }
}