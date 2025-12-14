import * as pact from "pactum";
import { faker } from '@faker-js/faker';
import path from "path";

let client_id: string = '';
let client_secret: string = '';
let access_token: string = '';
let responseBody = '';
let responseStatus = '';
const randomName = faker.person.fullName();
const randomDescription = faker.lorem.sentence();
const randomEmail = faker.internet.email();

export const setPactumBaseUrl = async (url: string) => {
    pact.request.setBaseUrl(url);
};
export const setPactumRequestTimeout = async (timeout: number) => {
    pact.request.setDefaultTimeout(timeout);
};

export const oAuthToken = async () => {
    const oAuthResponse = await pact.spec()
        .post('/auth_tokens/register/')
        .withHeaders('Content-Type', 'application/json')
        .withBody({
            "name": randomName,
            "description": randomDescription,
            "email": randomEmail
        })
        .expectStatus(201)
        .returns('client_id')
        .returns('client_secret')
        .toss();
    client_id = oAuthResponse[0];
    client_secret = oAuthResponse[1];
    console.log("Client ID: ", client_id, "Client Secret: ", client_secret);
};

export const accessToken = async () => {
    const accessResponse = await pact.spec()
        .post('/auth_tokens/token/')
        .withHeaders('Content-Type', 'application/x-www-form-urlencoded')
        .withForm({
            grant_type: "client_credentials",
            client_id: client_id,
            client_secret: client_secret
        })
        .expectStatus(200)
        .returns('access_token')
        .toss();
    access_token = accessResponse;
    console.log("Access Token: ", access_token);
};

export const apiRequest = async (endpointValue: string, identifierValue: string) => {
    const response = await pact.spec()
        .get(`/{endpoint}/{identifier}`)
        .withBearerToken(access_token)
        .withPathParams('endpoint', endpointValue)
        .withPathParams('identifier', identifierValue)
        .withFollowRedirects(true)
        .toss();
    responseBody = response.body;
    responseStatus = response.statusCode;
};

export const getResponseStatus = () => {
    return parseInt(responseStatus);
};

export function getValueFromResponse(path: string) {
    const responseJson = typeof responseBody === "string" ? JSON.parse(responseBody) : responseBody;
    if (!path) return undefined;
    // Convert brackets to dots and split
    const parts = path.replace(/\[(\w+)\]/g, '.$1').split('.');
    let current = responseJson;
    for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
            current = current[part];
        } else {
            return undefined;
        }
    }
    return current;
}