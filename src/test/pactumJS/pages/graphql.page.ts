import * as pact from "pactum";
import path from "path";
import { deepCompareWithPlaceholders, parseIfJson } from "../helper/jsonCompare";
export let responseStatus: number;
export let responseBody: any;

export const setPactumGraphqlUrl = async (url: string) => {
    pact.request.setBaseUrl(url);
};
export const setPactumGraphqlRequestTimeout = async (timeout: number) => {
    pact.request.setDefaultTimeout(timeout);
};

export const graphqlRequest = async (filePath: string) => {
    const payLoadfile = require(`../graphqlPayloadAndRespnse/${filePath}`);
    const payload = payLoadfile.payload;
    // console.log(payLoadfile, payload);
    const res = await pact.spec()
        .post('/graphql')
        .withGraphQLQuery(payload.query)
        .withGraphQLVariables(payload.variables)
        .withHeaders('Content-Type', 'application/json')
        .expectStatus(200)
        .toss();
    responseStatus = res.statusCode; // Store the status code
    responseBody = res.text
    console.log(`Status Code: ${responseStatus}`);
    console.log(`Response: ${res.text}`);
};

// Add method to get the status code
export const getResponseStatus = (): number => {
    return responseStatus;
};

export const graphqlResponseMatchesSnapshot = async (filePath: string): Promise<void> => {
  const expectedResponse = require(`../graphqlPayloadAndRespnse/${filePath}`);

  // Step 1: Ensure both are proper JSON
  const expectedJson = parseIfJson(expectedResponse.response);
  const actualJson = parseIfJson(responseBody);

  // Step 2: Compare deeply
  const result = deepCompareWithPlaceholders(actualJson, expectedJson);

  // Step 3: Throw detailed error if mismatch
  if (!result.match) {
    const errorDetails = `
❌ Snapshot mismatch at: ${filePath}
🔹 Path: ${result.path}
🔹 ${result.message}
🔹 Expected: ${JSON.stringify(expectedJson, null, 2)}
🔹 Actual:   ${JSON.stringify(actualJson, null, 2)}
`;
    throw new Error(errorDetails);
  }
};