import { test, expect } from '@playwright/test'

/**
 * Full workshop journey — requires isolated QA DB (npm run db:seed:qa in Backend)
 * and env: E2E_TENANT_CODE, E2E_USER, E2E_PASSWORD
 */
const tenant = process.env.E2E_TENANT_CODE
const user = process.env.E2E_USER
const password = process.env.E2E_PASSWORD

test.describe('Login', () => {
  test.skip(!tenant || !user || !password, 'Set E2E_TENANT_CODE, E2E_USER, E2E_PASSWORD for QA login')

  test('sign in reaches dashboard', async ({ page }) => {
    test.skip(process.env.E2E_RUN_UI !== '1', 'Set E2E_RUN_UI=1 for browser login test')
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()
    await page.getByPlaceholder('e.g. DEMO-MOTORS').fill(tenant!)
    await page.getByPlaceholder('Enter your identifier').fill(user!)
    await page.getByPlaceholder('Enter your password').fill(password!)
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/app\/dashboard/)
  })
})
