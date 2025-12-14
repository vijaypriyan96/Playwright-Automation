import { Browser, BrowserContext, Page, chromium, firefox, webkit, LaunchOptions, CDPSession, devices } from "@playwright/test";
import { getEnv } from "../env/env";
import fs from "fs";""
// const deviceName = devices["iPhone 15"] ;

async function getStorageStatePath(): Promise<boolean> {
    try {
        const storageStatePath = "./src/test/helper/browser/storageState.json";
        await fs.promises.access(storageStatePath);
        console.log(`Storage state file exists at ${storageStatePath}`);
        return true;
    } catch (error) {
        console.log(`Storage state file does not exist: ${error}`);
        return false;
    }
}

export class BrowserManager {
    private _browser: Browser | null = null;
    private _context: BrowserContext | null = null;
    private _page: Page | null = null;
    private cdp: CDPSession | null = null;

    private getLaunchOptions(): LaunchOptions {
        getEnv();
        const headless = process.env.npm_config_HEAD || process.env.HEAD;
        return {
            headless: headless === "headless",
            timeout: 100000,
            args: ['--start-maximized']
        };
    }

    private getBrowserType(): string {
        return process.env.npm_config_BROWSER || process.env.BROWSER || "chrome";
    }

    public async launchBrowser(): Promise<Browser> {
        if (this._browser) return this._browser;
        const type = this.getBrowserType();
        const options = this.getLaunchOptions();
        switch (type) {
            case "chrome": this._browser = await chromium.launch(options); break;
            /**
             * To launch any local browser we need to specify the executable path as shown below.
             * case "brave": this._browser = await chromium.launch({ ...options, executablePath: "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe" }); break;
            */
            case "firefox": this._browser = await firefox.launch(options); break;
            case "webkit": this._browser = await webkit.launch(options); break;
            default: throw new Error(`Unknown browser type: ${type}`);
        }
        return this._browser;
    }
    public async createContextAndPage(): Promise<[BrowserContext, Page]> {
        if (!this._browser) await this.launchBrowser();
        this._context = await this._browser!.newContext({
            // ...deviceName, // Specify the type of device at the top and make sure viewport is not passed as null or remove the option
            storageState: await getStorageStatePath() ? "./src/test/helper/browser/storageState.json" : undefined,
            acceptDownloads: true,
            recordVideo: {
                dir: "test-results/videos"
            },
            viewport: null,
            httpCredentials: process.env.AUTH_USER && process.env.AUTH_PASS ? {
                username: process.env.AUTH_USER,
                password: process.env.AUTH_PASS
            } : undefined
        });
        this._page = await this._context.newPage();

        // this.cdp = await this._context.newCDPSession(this._page);

        // To stimulate network speed and latency
        // await this.cdp.send('Network.emulateNetworkConditions', {
        //     offline: false,
        //     downloadThroughput: 780 * 1024 / 8,
        //     uploadThroughput: 330 * 1024 / 8,
        //     latency: 20
        // });
        // Capture all network requests and responses
        // await this.cdp.send('Network.enable');
        // this.cdp.on('Network.requestWillBeSent', (request) => {
        //     // Uncomment below line to see all network requests in console
        //     console.log('Request:', request.request.url);
        // });
        // this.cdp.on('Network.responseReceived', (response) => {
        //     // Uncomment below line to see all network responses in console
        //     console.log('Response:', response.response.url, response.response.status);
        // });
        // Test browser performance metrics
        // await this.cdp.send('Performance.enable');

        return [this._context, this._page];
    }
    public async getPerformanceMetrics(): Promise<any> {
        if (!this._context || !this._page) throw new Error("Context or Page not initialized");
        const metrics = await this.cdp!.send('Performance.getMetrics');
        return metrics;
    }

    public get browser(): Browser {
        if (!this._browser) throw new Error("Browser not initialized");
        return this._browser;
    }
    public get context(): BrowserContext {
        if (!this._context) throw new Error("Context not initialized");
        return this._context;
    }
    public get page(): Page {
        if (!this._page) throw new Error("Page not initialized");
        return this._page;
    }

    public async openTab(index: number): Promise<Page> {
        if (!this._context) throw new Error("Context not initialized");
        const pages = this._context.pages();
        if (pages.length < index) {
            const newPage = await this._context.waitForEvent('page', { timeout: 5000 });
            await newPage.waitForLoadState('domcontentloaded', { timeout: 5000 });
        }
        const allTabs = this._context.pages();
        const targetTab = allTabs[index - 1] ?? allTabs[0];
        await targetTab.bringToFront();
        this._page = targetTab;
        return this._page;
    }

    public async closePage(): Promise<void> {
        if (this._page) await this._page.close();
    }
    public async closeContext(): Promise<void> {
        if (this._context) await this._context.close();
    }
    public async closeBrowser(): Promise<void> {
        if (this._browser) await this._browser.close();
    }
}

export const browserManager = new BrowserManager();