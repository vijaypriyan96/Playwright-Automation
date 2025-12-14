// import { test, expect } from '@playwright/test';
// // import { Client } from 'pg'; 

// // Example for PostgreSQL 
// // // Database configuration (ideally loaded from environment variables or a config file)
// const dbConfig = {
//     user: 'your_user',
//     host: 'localhost',
//     database: 'test_db',
//     password: 'your_password',
//     port: 5432,
// };


// test.describe('User Registration E2E Test', () => {
//     let dbClient: Client;

//     test.beforeAll(async () => {
//         // Connect to the database once before all tests in this suite 
//         dbClient = new Client(dbConfig);
//         await dbClient.connect();
//         // Optional: Clean up any leftover test data before starting 
//         await dbClient.query('DELETE FROM users WHERE email LIKE \'testUser_%\'');
//     });

//     test.afterAll(async () => {
//         // Close the database connection after all tests in this suite 
//         await dbClient.end();
//     });

//     test('should allow a new user to register and verify in DB', async ({ page }) => {
//         const username = `testUser_${Date.now()}`;
//         const email = `${username}@example.com`;
//         const password = 'password123';

//         // 1. Playwright actions: Navigate to registration page, fill orm, submit 
//         await page.goto('/register');
//         await page.fill('#username', username);
//         await page.fill('#email', email);
//         await page.fill('#password', password);
//         await page.click('button[type="submit"]');

//         // 2. Playwright assertion: Verify successful registration message on UI 
//         await expect(page.locator('.registration-success')).toBeVisible();

//         // 3. SQL verification: Query database to confirm user creation 
//         const res = await dbClient.query(`SELECT * FROM users WHERE email = '${email}'`);
//         expect(res.rows.length).toBe(1);
//         expect(res.rows[0].username).toBe(username);
//         // Note: Never store passwords in plain text in DB, and never verify passwords directly 
//         // You might verify a hashed password if your application uses a consistent hashing algorithm for testing. 

//         // 4. SQL cleanup: Delete the created user 
//         await dbClient.query(`DELETE FROM users WHERE email = '${email}'`);
//     });

//     test('should handle duplicate user registration', async ({ page }) => {
//         const existingUsername = 'existing_user';
//         const existingEmail = 'existing@example.com';
//         const existingPassword = 'somepassword';

//         // SQL setup: Insert an existing user directly into the database for this test 
//         await dbClient.query(`INSERT INTO users (username, email, password_hash) VALUES ('${existingUsername}', '${existingEmail}', 'some_hash') ON CONFLICT (email) DO NOTHING;`);

//         // Playwright actions: Attempt to register with the same email 
//         await page.goto('/register');
//         await page.fill('#username', 'new_user');
//         await page.fill('#email', existingEmail); // Duplicate email 
//         await page.fill('#password', 'new_password');
//         await page.click('button[type="submit"]');

//         // Playwright assertion: Verify error message on UI 
//         await expect(page.locator('.error-message')).toHaveText('Email already registered');

//         // SQL verification (optional, just to be sure no new user was created) 
//         const res = await dbClient.query(`SELECT COUNT(*) FROM users WHERE email = '${existingEmail}'`);
//         expect(parseInt(res.rows[0].count)).toBe(1); // Still only one user with that email 

//         // SQL cleanup: Delete the initially inserted existing user 
//         await dbClient.query(`DELETE FROM users WHERE email = '${existingEmail}'`);
//     });
// }); 