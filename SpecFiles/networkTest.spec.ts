import { test, expect, APIRequestContext, request } from "@playwright/test";

test("Mock API response to 404 not found", async ({ page }) => {
  await page.route(
    "https://practice.expandtesting.com/register",
    async (route) => {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: "",
      });
    }
  );
  await page.goto("https://practice.expandtesting.com/");
  await Promise.all([
    page.locator(`.my-link[href="/register"]`).click(),
    page.waitForResponse((response) => response.status() === 404),
  ]);
});

test.describe("API Tests", () => {
  let apiContext: APIRequestContext;

  test.beforeAll(async () => {
    apiContext = await request.newContext({
      baseURL: "https://jsonplaceholder.typicode.com",
      extraHTTPHeaders: {
        Accept: "application/json",
      },
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test("should fetch a list of posts @API", async () => {
    const response = await apiContext.get("/posts");
    expect(response.ok()).toBeTruthy();
    const posts = await response.json();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0]).toHaveProperty("userId");
    expect(posts[0]).toHaveProperty("id");
    expect(posts[0]).toHaveProperty("title");
  });

  test("should create a new post", async () => {
    const newPost = {
      title: "Playwright Test Post",
      body: "This is a test post created via Playwright API.",
      userId: 1,
    };
    const response = await apiContext.post("/posts", { data: newPost });
    expect(response.status()).toBe(201); // 201 Created
    const createdPost = await response.json();
    expect(createdPost.title).toBe(newPost.title);
    expect(createdPost.body).toBe(newPost.body);
    expect(createdPost.userId).toBe(newPost.userId);
    expect(createdPost).toHaveProperty("id");
  });
});
