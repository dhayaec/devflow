# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication >> Registration >> registers a new user and redirects to create-org
- Location: e2e\auth.spec.ts:6:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /create an account/i })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('heading', { name: /create an account/i })

```

```yaml
- link "Skip to main content":
  - /url: "#main-content"
- text: Create an account Enter your details to get started Name
- textbox "Name":
  - /placeholder: John Doe
- text: Email
- textbox "Email":
  - /placeholder: name@example.com
- text: Password
- textbox "Password":
  - /placeholder: At least 8 characters
- button "Create account"
- paragraph:
  - text: Already have an account?
  - link "Sign in":
    - /url: /login
- alert
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test"
  2   | import { TEST_USER, login } from "./helpers"
  3   | 
  4   | test.describe("Authentication", () => {
  5   |   test.describe("Registration", () => {
  6   |     test("registers a new user and redirects to create-org", async ({ page }) => {
  7   |       await page.goto("/register")
  8   | 
> 9   |       await expect(page.getByRole("heading", { name: /create an account/i })).toBeVisible()
      |                                                                               ^ Error: expect(locator).toBeVisible() failed
  10  | 
  11  |       await page.getByLabel("Name").fill("Fresh User")
  12  |       await page.getByLabel("Email").fill("fresh@test.devflow")
  13  |       await page.getByLabel("Password").fill("FreshPass123!")
  14  |       await page.getByRole("button", { name: /create account/i }).click()
  15  | 
  16  |       // Should redirect to create organization page
  17  |       await page.waitForURL("/create-org")
  18  |       await expect(page.getByRole("heading", { name: /create organization/i })).toBeVisible()
  19  |     })
  20  | 
  21  |     test("shows error for duplicate email", async ({ page }) => {
  22  |       await page.goto("/register")
  23  | 
  24  |       await page.getByLabel("Name").fill("Duplicate User")
  25  |       await page.getByLabel("Email").fill(TEST_USER.email)
  26  |       await page.getByLabel("Password").fill("SomePass123!")
  27  |       await page.getByRole("button", { name: /create account/i }).click()
  28  | 
  29  |       await expect(page.getByText(/already exists/i)).toBeVisible()
  30  |     })
  31  | 
  32  |     test("shows validation error for short password", async ({ page }) => {
  33  |       await page.goto("/register")
  34  | 
  35  |       await page.getByLabel("Name").fill("User")
  36  |       await page.getByLabel("Email").fill("user@test.devflow")
  37  |       await page.getByLabel("Password").fill("123")
  38  |       await page.getByRole("button", { name: /create account/i }).click()
  39  | 
  40  |       // HTML5 validation should catch it (minLength=8)
  41  |       // The form won't submit because browser validates
  42  |       await expect(page).toHaveURL("/register")
  43  |     })
  44  |   })
  45  | 
  46  |   test.describe("Login", () => {
  47  |     test("logs in with valid credentials", async ({ page }) => {
  48  |       await login(page)
  49  | 
  50  |       // Should land on org dashboard
  51  |       await expect(page).toHaveURL(/\/test-org/)
  52  |       await expect(page.getByRole("heading", { name: /test organization/i })).toBeVisible()
  53  |     })
  54  | 
  55  |     test("shows error for invalid credentials", async ({ page }) => {
  56  |       await page.goto("/login")
  57  | 
  58  |       await page.getByLabel("Email").fill(TEST_USER.email)
  59  |       await page.getByLabel("Password").fill("wrongpassword")
  60  |       await page.getByRole("button", { name: "Sign in" }).click()
  61  | 
  62  |       await expect(page.getByText(/invalid email or password/i)).toBeVisible()
  63  |     })
  64  | 
  65  |     test("redirects to login for protected routes", async ({ page }) => {
  66  |       await page.goto("/test-org")
  67  | 
  68  |       // Should redirect to login with callbackUrl
  69  |       await expect(page).toHaveURL(/\/login/)
  70  |       await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible()
  71  |     })
  72  |   })
  73  | 
  74  |   test.describe("Logout", () => {
  75  |     test("signs out and redirects to login", async ({ page }) => {
  76  |       await login(page)
  77  | 
  78  |       // Navigate to settings or find sign out button
  79  |       await page.goto("/test-org/settings")
  80  |       await expect(page).toHaveURL(/\/test-org\/settings/)
  81  | 
  82  |       // Look for sign out button in user menu
  83  |       const signOutBtn = page.getByRole("button", { name: /sign out|logout/i })
  84  |       if (await signOutBtn.isVisible()) {
  85  |         await signOutBtn.click()
  86  |       } else {
  87  |         // If no visible sign-out button, we clear session via API
  88  |         // For now, just verify we're still logged in
  89  |         test.skip("Sign out button not implemented yet",)
  90  |       }
  91  |     })
  92  |   })
  93  | 
  94  |   test.describe("Navigation", () => {
  95  |     test("shows links to login and register from landing page", async ({ page }) => {
  96  |       await page.goto("/login")
  97  |       await expect(page.getByRole("link", { name: /sign up/i })).toBeVisible()
  98  | 
  99  |       await page.getByRole("link", { name: /sign up/i }).click()
  100 |       await expect(page).toHaveURL("/register")
  101 |       await expect(page.getByRole("heading", { name: /create an account/i })).toBeVisible()
  102 |     })
  103 |   })
  104 | })
  105 | 
```