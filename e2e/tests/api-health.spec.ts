import { test, expect } from '@playwright/test'

const apiBase = process.env.E2E_API_BASE_URL ?? 'http://localhost:3000'

test.describe('API smoke', () => {
  test('GET /health returns ok', async ({ request }) => {
    const res = await request.get(`${apiBase}/health`)
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.status).toBe('ok')
    expect(body.service).toBe('zentrosure-api')
  })

  test('protected route rejects missing auth', async ({ request }) => {
    const res = await request.get(`${apiBase}/api/v1/customers`)
    expect(res.status()).toBe(401)
  })
})
