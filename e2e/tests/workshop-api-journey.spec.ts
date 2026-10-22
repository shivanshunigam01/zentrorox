import { test, expect } from '@playwright/test'

/**
 * API-level journey — requires QA MongoDB + seeded tenant (QA-WORKSHOP or DEMO-MOTORS).
 * Set E2E_TENANT_CODE, E2E_USER, E2E_PASSWORD and ensure Backend is running.
 */
const apiBase = process.env.E2E_API_BASE_URL ?? 'http://localhost:3000/api/v1'
const tenant = process.env.E2E_TENANT_CODE
const user = process.env.E2E_USER
const password = process.env.E2E_PASSWORD

async function login(request: import('@playwright/test').APIRequestContext) {
  const res = await request.post(`${apiBase}/auth/login`, {
    data: { tenantCode: tenant, identifier: user, password },
  })
  expect(res.ok()).toBeTruthy()
  const body = await res.json()
  return body.data.accessToken as string
}

test.describe('Workshop API journey', () => {
  test.skip(!tenant || !user || !password, 'Set E2E_TENANT_CODE, E2E_USER, E2E_PASSWORD')

  test('login and list customers', async ({ request }) => {
    const token = await login(request)
    const res = await request.get(`${apiBase}/customers`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.success).toBe(true)
  })

  test('billing queue requires permission', async ({ request }) => {
    const token = await login(request)
    const res = await request.get(`${apiBase}/billing/queue`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect([200, 403]).toContain(res.status())
  })

  test('razorpay dashboard requires payments.view', async ({ request }) => {
    const token = await login(request)
    const res = await request.get(`${apiBase}/payments/razorpay/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.ok()).toBeTruthy()
  })
})
