import type { Page } from "@playwright/test"

export const TEST_USER = {
  name: "E2E User",
  email: "e2e@test.devflow",
  password: "E2eTestPass123!",
}

export const TEST_ORG = {
  name: "Test Organization",
  slug: "test-org",
}

export async function login(
  page: Page,
  email = TEST_USER.email,
  password = TEST_USER.password,
) {
  await page.goto("/login")
  await page.getByLabel("Email").fill(email)
  await page.getByLabel("Password").fill(password)
  await page.getByRole("button", { name: "Sign in" }).click()
  await page.waitForURL(/\/[^/]+$/)
}

export async function createTestProject(
  page: Page,
  orgSlug: string,
  projectName: string,
) {
  await page.goto(`/${orgSlug}/projects`)
  await page.getByRole("button", { name: /create project|new project/i }).click()
  await page.getByLabel(/name/i).fill(projectName)
  await page.getByRole("button", { name: /create/i }).click()
  await page.waitForURL(/\/[^/]+\/projects\/[^/]+/)
}
