import { test, expect } from "@playwright/test"
import { login, TEST_ORG } from "./helpers"

test.describe("Project Management", () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test("shows empty projects page", async ({ page }) => {
    await page.goto(`/${TEST_ORG.slug}/projects`)
    await expect(page.getByRole("heading", { name: /projects/i })).toBeVisible()
    await expect(page.getByText(/no projects yet/i)).toBeVisible()
  })

  test("creates a new project", async ({ page }) => {
    await page.goto(`/${TEST_ORG.slug}/projects`)

    // Open create dialog
    await page.getByRole("button", { name: /new project/i }).click()

    // Fill in the form
    await page.getByLabel("Name").fill("Test Project")
    // Slug auto-fills from name
    await page.getByLabel("Description").fill("An E2E test project")

    // Submit
    await page.getByRole("button", { name: /create project/i }).click()

    // Should redirect to the project page
    await page.waitForURL(/\/test-org\/projects\/test-project/)
    await expect(page.getByText(/test project/i)).toBeVisible()
  })

  test("shows created project in the project list", async ({ page }) => {
    // First create a project
    await page.goto(`/${TEST_ORG.slug}/projects`)
    await page.getByRole("button", { name: /new project/i }).click()
    await page.getByLabel("Name").fill("Visible Project")
    await page.locator("#description").fill("Should appear in list")
    await page.getByRole("button", { name: /create project/i }).click()
    await page.waitForURL(/\/test-org\/projects\/visible-project/)

    // Navigate back to project list
    await page.goto(`/${TEST_ORG.slug}/projects`)

    // Should see the project card
    await expect(page.getByText(/visible project/i)).toBeVisible()
  })

  test("navigates to board page", async ({ page }) => {
    await page.goto(`/${TEST_ORG.slug}/projects/test-project/board`)
    await expect(page).toHaveURL(/\/board/)
  })

  test("navigates to backlog page", async ({ page }) => {
    await page.goto(`/${TEST_ORG.slug}/projects/test-project/backlog`)
    await expect(page).toHaveURL(/\/backlog/)
  })

  test("navigates to sprints page", async ({ page }) => {
    await page.goto(`/${TEST_ORG.slug}/projects/test-project/sprints`)
    await expect(page).toHaveURL(/\/sprints/)
  })

  test("shows project detail page", async ({ page }) => {
    // Create a project first
    await page.goto(`/${TEST_ORG.slug}/projects`)
    await page.getByRole("button", { name: /new project/i }).click()
    await page.getByLabel("Name").fill("Detail Project")
    await page.locator("#description").fill("Check detail view")
    await page.getByRole("button", { name: /create project/i }).click()
    await page.waitForURL(/\/test-org\/projects\/detail-project/)

    // Should show project page
    await expect(page.getByText(/detail project/i)).toBeVisible()
  })
})
