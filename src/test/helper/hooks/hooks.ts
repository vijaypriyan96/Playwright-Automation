import { BeforeAll, AfterAll, Before, After, AfterStep, Status, setDefaultTimeout } from "@cucumber/cucumber";
import { browserManager } from '../browser/browserManager';
import fs from "fs-extra";
import { initBrowserRefs } from "../browser/browser";
import { createTestLogger } from "../logger/loggerManager";
import { startTracing, stopTracing } from "../config/tracingUtils";
import { writeSystemInfo } from "../config/systemInfo";
import { Logger } from "winston";

/**
 * import type { ITestCaseHookParameter, ITestStepHookParameter } from '@cucumber/cucumber';
 * instead of deconstructed objects { pickle, gherkinDocument } we can use the ITestCaseHookParameter and ITestStepHookParameter
 * where we can pass scenario: ITestCaseHookParameter and test: ITestStepHookParameter which can used to access further objects
 */

export let logger: Logger;
// Replace global flag with a Map to track failures per feature
const failedFeatures = new Map<string, boolean>();

function isApiFeature(gherkinDocument: any): boolean {
    const uri = gherkinDocument?.uri?.replace(/\\/g, '/').toLowerCase();
    return uri?.includes('pactumjs/features');
}

function getFeatureId(gherkinDocument: any): string {
    return gherkinDocument?.uri || 'unknown';
}

setDefaultTimeout(60 * 1000 * 4);

BeforeAll(async function () {
    await browserManager.launchBrowser();
    await writeSystemInfo(
        browserManager.browser.browserType().name(),
        browserManager.browser.version()
    );
});

Before(async function ({ pickle, gherkinDocument }) {
    const featureId = getFeatureId(gherkinDocument);
    if (failedFeatures.get(featureId) && pickle.tags.some(tag => tag.name === '@SkipOnFailure')) {
        return 'skipped';
    }

    if (!isApiFeature(gherkinDocument)) {
        await browserManager.createContextAndPage();
        initBrowserRefs();
        await startTracing(browserManager.context, pickle.name + pickle.id, pickle.name);
    }
    logger = createTestLogger(pickle.name + pickle.id);

    const scenarioTags = pickle.tags.map(tag => tag.name).join(' ');
    if (scenarioTags) console.log(`${scenarioTags}`);
    console.log(`${pickle.name}`);
});

AfterStep(async function ({ pickle, gherkinDocument }) {
    if (!isApiFeature(gherkinDocument) && browserManager.page) {
        const img = await browserManager.page.screenshot({ path: "./ScreenShots/" + pickle.name + pickle.id + ".png", type: "png" });
        this.attach(img, "image/png");
        await browserManager.page.waitForLoadState('domcontentloaded', { timeout: 100000 });
    }
    // To fetch and print Performance Metrics after each step
    // console.log(await browserManager.getPerformanceMetrics());
});

After(async function ({ pickle, result, gherkinDocument }) {
    try {
        if (!isApiFeature(gherkinDocument)) {
            const tracePath = `./test-results/trace/${pickle.name + pickle.id}.zip`;
            await stopTracing(browserManager.context, tracePath);

            if (browserManager.page) {
                let videoPath: string | null = null;
                try {
                    const temp = await browserManager.page.video()?.path();
                    videoPath = typeof temp === "string" ? temp : null;
                } catch (e) {
                    console.log("Error getting video path:", e);
                }

                if (result?.status === Status.FAILED && videoPath && fs.existsSync(videoPath)) {
                    this.attach(fs.readFileSync(videoPath), "video/webm");
                    const traceFileLink = `<a href="https://trace.playwright.dev/">Open ${tracePath}</a>`;
                    this.attach(`Trace file: ${traceFileLink}`, 'text/html');
                }

                await browserManager.closePage();
            }

            if (browserManager.context) {
                await browserManager.closeContext();
            }
        }

        // Update failure status for this specific feature
        if (result?.status === Status.FAILED) {
            const featureId = getFeatureId(gherkinDocument);
            failedFeatures.set(featureId, true);
        }
    } catch (error) {
        console.error("Error in After hook:", error);
    }
});

AfterAll(async function () {
    try {
        if (browserManager.browser) {
            await browserManager.closeBrowser();
        }
        if (logger) {
            logger.close();
        }
    } catch (error) {
        console.error("Error in AfterAll hook:", error);
    }
});