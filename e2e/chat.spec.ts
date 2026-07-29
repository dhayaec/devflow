import { test, expect } from "@playwright/test"
import { login, TEST_ORG } from "./helpers"

test.describe("Real-Time Chat", () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test("chat page shows channel sidebar", async ({ page }) => {
    await page.goto(`/${TEST_ORG.slug}/chat`)

    // Should see the channels heading
    await expect(page.getByText(/channels/i)).toBeVisible()

    // Should see the general channel (seeded in test DB)
    await expect(page.getByText(/#general/i)).toBeVisible()
  })

  test("shows placeholder when no channel is selected", async ({ page }) => {
    await page.goto(`/${TEST_ORG.slug}/chat`)

    // Should show the select-a-channel placeholder
    await expect(page.getByText(/select a channel/i)).toBeVisible()
  })

  test("navigates to a channel", async ({ page }) => {
    await page.goto(`/${TEST_ORG.slug}/chat`)

    // Click on the general channel
    await page.getByText(/#general/i).click()

    // Should navigate to the channel
    await page.waitForURL(/\/test-org\/chat\//)
  })
})
