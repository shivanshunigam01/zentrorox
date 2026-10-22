import { test, expect } from '@playwright/test'

const apiBase = process.env.E2E_API_BASE_URL ?? 'http://localhost:3000'

test.describe('Security smoke', () => {
  test('unauthenticated billing blocked', async ({ request }) => {
    const res = await request.get(`${apiBase}/api/v1/billing/dashboard`)
    expect(res.status()).toBe(401)
  })

  test('legacy inspection route redirects in UI', async ({ page }) => {
    test.skip(
      process.env.E2E_RUN_UI !== '1' || process.env.E2E_SKIP_UI === '1',
      'Set E2E_RUN_UI=1 (and run npx playwright install) for UI redirect test',
    )
    const tenant = process.env.E2E_TENANT_CODE
    const user = process.env.E2E_USER
    const password = process.env.E2E_PASSWORD
    test.skip(!tenant || !user || !password, 'Set E2E_TENANT_CODE, E2E_USER, E2E_PASSWORD')

    await page.goto('/login')
    await page.getByPlaceholder('e.g. DEMO-MOTORS').fill(tenant!)
    await page.getByPlaceholder('Enter your identifier').fill(user!)
    await page.getByPlaceholder('Enter your password').fill(password!)
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/app\/dashboard/)

    await page.goto('/app/workshop/trial-inspection')
    await expect(page).toHaveURL(/\/app\/workshop\/inspection\/?$/)
  })
})
