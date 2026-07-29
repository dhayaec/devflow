import { test, expect } from "@playwright/test"
import { login, TEST_ORG } from "./helpers"

test.describe("Organization Management", () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test("displays the organization dashboard", async ({ page }) => {
    await expect(page).toHaveURL(/\/test-org/)
    await expect(page.getByRole("heading", { name: /test organization/i })).toBeVisible()
  })

  test("creates a new organization", async ({ page }) => {
    await page.goto("/create-org")

    await page.getByLabel(/organization name/i).fill("My New Org")
    await page.getByLabel(/slug/i).fill("my-new-org")
    await page.getByRole("button", { name: /create organization/i }).click()

    // Should redirect to new org's dashboard
    await page.waitForURL("/my-new-org")
    await expect(page.getByRole("heading", { name: /my new org/i })).toBeVisible()
  })

  test("navigates to members page", async ({ page }) => {
    await page.goto(`/${TEST_ORG.slug}/members`)
    await expect(page.getByRole("heading", { name: /members/i })).toBeVisible()
  })

  test("navigates to teams page", async ({ page }) => {
    await page.goto(`/${TEST_ORG.slug}/teams`)
    await expect(page.getByRole("heading", { name: /teams/i })).toBeVisible()
  })

  test("navigates to settings page", async ({ page }) => {
    await page.goto(`/${TEST_ORG.slug}/settings`)
    await expect(page.getByRole("heading", { name: /settings/i })).toBeVisible()
  })

  test("sidebar shows organization navigation", async ({ page }) => {
    await page.goto(`/${TEST_ORG.slug}`)

    const sidebar = page.getByRole("navigation")
    await expect(sidebar.getByRole("link", { name: /dashboard/i })).toBeVisible()
    await expect(sidebar.getByRole("link", { name: /projects/i })).toBeVisible()
    await expect(sidebar.getByRole("link", { name: /chat/i })).toBeVisible()
    await expect(sidebar.getByRole("link", { name: /members/i })).toBeVisible()
  })

  test("organization switcher is visible", async ({ page }) => {
    await page.goto(`/${TEST_ORG.slug}`)

    // The org switcher should show current org name
    await expect(page.getByText(/test organization/i).first()).toBeVisible()
  })
})
