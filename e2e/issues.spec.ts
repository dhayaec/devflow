import { test, expect } from "@playwright/test"
import { login, TEST_ORG } from "./helpers"

test.describe("Issue Tracking", () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test("creates an issue from the board page", async ({ page }) => {
    // First create a project so we have somewhere to put the issue
    await page.goto(`/${TEST_ORG.slug}/projects`)
    await page.getByRole("button", { name: /new project/i }).click()
    await page.getByLabel("Name").fill("Issue Project")
    await page.locator("#description").fill("For issue creation")
    await page.getByRole("button", { name: /create project/i }).click()
    await page.waitForURL(/\/test-org\/projects\/issue-project/)

    // Navigate to board and add issue
    await page.goto(`/${TEST_ORG.slug}/projects/issue-project/board`)
    await page.getByRole("button", { name: /add issue/i }).click()

    // Fill issue form
    await page.getByLabel("Title").fill("Test Issue from E2E")
    await page.getByLabel("Description").fill("This issue was created by an E2E test")

    // Select type and priority
    await page.getByLabel("Type").selectOption("bug")
    await page.getByLabel("Priority").selectOption("high")

    await page.getByRole("button", { name: /create issue/i }).click()

    // Should redirect to the issue detail page
    await page.waitForURL(/\/test-org\/projects\/issue-project\/issues\//)
    await expect(page.getByText(/test issue from e2e/i)).toBeVisible()
  })

  test("adds a comment to an issue", async ({ page }) => {
    // Create project and issue first
    await page.goto(`/${TEST_ORG.slug}/projects`)
    await page.getByRole("button", { name: /new project/i }).click()
    await page.getByLabel("Name").fill("Comment Project")
    await page.locator("#description").fill("For comment testing")
    await page.getByRole("button", { name: /create project/i }).click()
    await page.waitForURL(/\/test-org\/projects\/comment-project/)

    // Create issue
    await page.goto(`/${TEST_ORG.slug}/projects/comment-project/board`)
    await page.getByRole("button", { name: /add issue/i }).click()
    await page.getByLabel("Title").fill("Issue with Comment")
    await page.getByRole("button", { name: /create issue/i }).click()
    await page.waitForURL(/\/test-org\/projects\/comment-project\/issues\//)

    // Navigate back to board to get to issue detail differently
    // Actually, we're already on the issue detail page
    // Add a comment
    const commentText = "This is an E2E test comment"
    const textarea = page.getByPlaceholder(/write a comment/i)
    await expect(textarea).toBeVisible()
    await textarea.fill(commentText)

    await page.getByRole("button", { name: /^comment$/i }).click()

    // The comment should appear after page refresh
    await page.waitForTimeout(500)
    await page.reload()
    await expect(page.getByText("This is an E2E test comment")).toBeVisible()
  })

  test("board page shows issue counts", async ({ page }) => {
    // Create project and issue
    await page.goto(`/${TEST_ORG.slug}/projects`)
    await page.getByRole("button", { name: /new project/i }).click()
    await page.getByLabel("Name").fill("Board View")
    await page.locator("#description").fill("Board testing")
    await page.getByRole("button", { name: /create project/i }).click()
    await page.waitForURL(/\/test-org\/projects\/board-view/)

    // Create issue
    await page.goto(`/${TEST_ORG.slug}/projects/board-view/board`)
    await page.getByRole("button", { name: /add issue/i }).click()
    await page.getByLabel("Title").fill("Board Issue")
    await page.getByRole("button", { name: /create issue/i }).click()
    await page.waitForURL(/\/test-org\/projects\/board-view\/issues\//)

    // Go back to board and verify columns are rendered
    await page.goto(`/${TEST_ORG.slug}/projects/board-view/board`)
    await expect(page.getByText(/backlog/i)).toBeVisible()
    await expect(page.getByText(/to do/i)).toBeVisible()
    await expect(page.getByText(/in progress/i)).toBeVisible()
    await expect(page.getByText(/review/i)).toBeVisible()
    await expect(page.getByText(/done/i)).toBeVisible()
  })

  test("issue detail page shows all sections", async ({ page }) => {
    // Create project and issue
    await page.goto(`/${TEST_ORG.slug}/projects`)
    await page.getByRole("button", { name: /new project/i }).click()
    await page.getByLabel("Name").fill("Detail View")
    await page.locator("#description").fill("Detail testing")
    await page.getByRole("button", { name: /create project/i }).click()
    await page.waitForURL(/\/test-org\/projects\/detail-view/)

    // Create issue
    await page.goto(`/${TEST_ORG.slug}/projects/detail-view/board`)
    await page.getByRole("button", { name: /add issue/i }).click()
    await page.getByLabel("Title").fill("Detail Issue")
    await page.getByRole("button", { name: /create issue/i }).click()
    await page.waitForURL(/\/test-org\/projects\/detail-view\/issues\//)

    // Verify issue detail sections
    await expect(page.getByText(/detail issue/i)).toBeVisible()
    await expect(page.getByText(/comments/i)).toBeVisible()
  })
})
