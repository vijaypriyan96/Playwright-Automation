import { Given, Then, When, After, setWorldConstructor } from "@cucumber/cucumber";
import * as page from "../pages/pactumJs.page";

Given('user sets the base url to {string}', async (url:string) => {
    await page.setPactumBaseUrl(url);
});

Given('user sets the request timeout to {int} milliseconds', async (timeout: number) => {
    await page.setPactumRequestTimeout(timeout);
});

Given('user generates OAuth Token', async () => {
    await page.oAuthToken();
});

Given('user generates access token', async () => {
    await page.accessToken();
});

When('user makes a get request to {string} endpoint with {string}', async (endpoint: string, identifierValue: string) => {
    await page.apiRequest(endpoint, identifierValue);
});

Then('user should see the response with status code {int}', async (statusCode: number) => {
    if (page.getResponseStatus() !== statusCode) {
        throw new Error(`Expected status code ${statusCode}, but got ${page.getResponseStatus()}`);
    }
});

Then('user assert that response body contains {string} as {string}', async (key: string, value: string) => {
    const actual = page.getValueFromResponse(key);
    let actualValue = actual;

    // If actual is an array, join it for comparison
    if (Array.isArray(actual)) {
        actualValue = actual.join(',');
    }

    // Check for undefined before comparing
    if (actualValue === undefined) {
        throw new Error(`Key "${key}" not found in response body`);
    }

    // Always compare as trimmed strings
    if (actualValue.toString().trim() !== value.toString().trim()) {
        throw new Error(`Expected ${key} : ${value}, but got ${actualValue}`);
    }
});