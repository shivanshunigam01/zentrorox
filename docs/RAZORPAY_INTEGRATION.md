# Razorpay integration

## Environment (backend `.env` only)

| Variable | Purpose |
|----------|---------|
| `RAZORPAY_MODE` | `test` (default) or `live` |
| `RAZORPAY_KEY_ID` | `rzp_test_*` or `rzp_live_*` |
| `RAZORPAY_KEY_SECRET` | API secret (never log) |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook HMAC secret (separate from API secret) |
| `RAZORPAY_CURRENCY` | Default `INR` |
| `RAZORPAY_PAYMENT_LINK_EXPIRY_HOURS` | Default `24` |

**Security:** Do not commit keys. Rotate any keys shared in chat. Use **test keys** in development.

## API endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/v1/payments/razorpay/links` | JWT + `payments.record` |
| GET | `/api/v1/payments/razorpay/links/:id/status` | JWT + `payments.view` |
| GET | `/api/v1/payments/razorpay/dashboard` | JWT + `payments.view` |
| POST | `/api/v1/payments/razorpay/links/:id/send-email` | JWT + `payments.share` |
| POST | `/api/v1/payments/razorpay/links/:id/send-whatsapp` | JWT + `payments.share` |
| POST | `/api/v1/payments/razorpay/links/:id/cancel` | JWT + `payments.record` (body: optional `reason`) |
| POST | `/api/v1/payments/razorpay/webhook` | `X-Razorpay-Signature` only |

## Webhook registration (Razorpay Dashboard)

1. URL: `https://<api-host>/api/v1/payments/razorpay/webhook`
2. Secret: set `RAZORPAY_WEBHOOK_SECRET` to the dashboard signing secret.
3. Enable payment link and payment captured events.

## Reconciliation

- Collectible amount = issued invoice `balanceDue` (after advances/credits on invoice).
- Webhook + refresh status create **verified** `InvoicePayment` with `transactionReference` = Razorpay payment id (idempotent).
- Partial payments keep `PARTIALLY_PAID` until `balanceDue` is zero.
- No public “mark paid” endpoint.

## Models

`PaymentRequest`, `RazorpayWebhookEvent` in MongoDB.
