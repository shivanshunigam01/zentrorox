# Phase 8 — Billing, Payments, Gate Pass & Delivery (Hardened)

## Unified workspace

- **UI:** `/app/workshop/billing-delivery` (+ `/:visitId` workspace)
- **API:** `/api/v1/billing/*`

## Increment 1 — Inventory reconciliation & tax

- `invoice-reconciliation.service.ts` — reuses Phase 6 `buildQuantitySnapshots` (requisitions, issues, ledger consume, returns).
- Draft invoice lines: **labour/services** from approved estimates; **parts** from reconciled billable quantity at **approved estimate unit rates** (not current parts master).
- `invoice-draft-builder.ts` + `tax-resolution.ts` — Tax Master lookup per line; blocks issue if HSN/SAC or tax rule missing.
- Issue blocked when reconciliation is **BLOCKING** (outstanding issue, unapproved consumption, etc.).
- `POST /billing/visits/:visitId/reconciliation/resolve` — authorized exception + draft rebuild.

## Increment 2 — Workspace UI

- `billing-delivery-workspace.tsx` — customer/vehicle, reconciliation table, invoice, payments/credit, gate pass, delivery.
- Queue tab **CREDIT_CLEARANCE** supported in API.

## Increment 3 — PDFs

- Tax invoice PDF (existing, enhanced data path).
- **Repair completion report:** `GET /billing/invoices/:id/repair-report` — VOC, QC attempt work checks, completed job work items, parts from invoice, `Media` with `QC_BEFORE` / `QC_AFTER` (URLs in PDF; embedded images not yet rendered in PDFKit).

## Increment 4 — Email / WhatsApp

- `utils/outbound-notify.ts` — **Nodemailer SMTP** (preferred: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`) or **SendGrid** fallback; **WhatsApp webhook** (`WHATSAPP_NOTIFY_URL`).
- Invoice send stores real status on `InvoiceCommunication` (`SENT` / `FAILED` + `NOT_CONFIGURED` message). No fake success.

## Payments & credit

- Advance allocation on issue uses **`CONFIRMED`** advances (aligned with Phase 4).
- Credit clearance validates `CustomerCreditProfile` + `computeCreditExposure` (limit check; exposure still provisional for posted AR).

## Gate pass & delivery

- Void: `POST /billing/gate-passes/:id/void`
- Existing eligibility: QC pass + issued invoice + paid or credit clearance.

## Tests (automated)

| Suite | Status |
|--------|--------|
| `npm run build` (Backend) | Run after pull |
| `npm test` (Backend) | **23** unit tests incl. `computeBillableQuantity`, `financialYearIndia` |
| `npm run build` (Frontend) | Run after pull |
| Playwright / full E2E matrix (42 cases) | **NOT RUN** — no Playwright harness in repo |
| Mongo integration workflow tests | **NOT RUN** — requires live DB + seed visit |

## Configuration (production)

| Variable | Purpose |
|----------|---------|
| `SMTP_*` (Gmail app password) | Invoice, estimate, receipt email + PDF |
| `SENDGRID_API_KEY`, `EMAIL_FROM` | Optional SendGrid instead of SMTP |
| `WHATSAPP_NOTIFY_URL`, `WHATSAPP_API_TOKEN` | WhatsApp notify webhook |
| `PUBLIC_APP_URL` | Secure invoice link in WhatsApp body |
| Tax Master | Approved rules per HSN/SAC |
| Cloudinary / `Media` | QC before/after images on repair report |

## Remaining blockers (not production-complete)

- E-invoice / IRN integration
- Embedded images in PDF (currently links / text for Cloudinary URLs)
- Full posted receivables in `computeCreditExposure`
- Playwright E2E and cross-tenant security automation
- Premium invoice layout (logo, tabular GST, amount in words)
- Webhook delivery status for WhatsApp (provider-dependent)

## Safe deployment

1. Review `Backend/src/scripts/seed.ts` — do **not** run destructive seeds in production; use idempotent permission/numbering upserts only.
2. `npm run build` in Backend and Frontend.
3. Apply indexes (already in Mongoose schemas); no destructive migration required for new optional invoice fields.
4. Configure env vars above.
5. Smoke: QC-pass visit → draft → reconcile → issue → pay/credit → gate pass → deliver.

## Rollback

- Disable route mount in `app.ts` if needed; **do not** delete `FinalInvoice` / payment collections.
- Revert frontend nav to legacy queues only if required; financial data remains in MongoDB.
