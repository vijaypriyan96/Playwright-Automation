import { Given, Then, When } from "@cucumber/cucumber";
import * as page from "../pages/graphql.page";

Given('user sets the graphql url to {string}', async function (url: string) {
    await page.setPactumGraphqlUrl(url);
});

Given('user sets the graphql request timeout to {int} milliseconds', async function (timeout: number) {
    await page.setPactumGraphqlRequestTimeout(timeout);
});

When('user queries with payload in file {string}', async function (filePath: string) {
    await page.graphqlRequest(filePath);
});

Then('user should see the graphql response with status code {int}', async function (statusCode: number) {
    if (page.getResponseStatus() !== statusCode) {
        throw new Error(`Expected status code ${statusCode}, but got ${page.getResponseStatus()}`);
    }
    this.attach(`Response status: ${page.responseStatus}`, 'text/plain');
});

Then('user verifies if the response matches the snapshot in file {string}', async function (filePath: string) {
    await page.graphqlResponseMatchesSnapshot(filePath);
    this.attach(`Response body: ${page.responseBody}`, 'text/plain');
});