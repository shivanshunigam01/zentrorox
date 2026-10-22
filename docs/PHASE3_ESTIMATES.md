# Phase 3 — Estimates (implementation status)

## Delivered

- **Models:** `Estimate`, `EstimateRevision` (embedded), `TaxRule`, `DiscountPolicy`, `EstimateCommunication`
- **Calculation engine:** `estimate-calculation.ts` (paise-safe rounding, CGST/SGST vs IGST)
- **API:** `/api/v1/estimates/*` — queue, dashboard, draft save (server totals), review, issue, PDF, customer decision, job-card handoff
- **PDF:** Server-side PDFKit A4 (`GET /estimates/:id/pdf`)
- **Eligibility:** Completed inspection + completed receiving + confirmed VOC
- **Auto-create:** On inspection approval (when tax rules seeded)
- **UI:** `/app/workshop/estimates` queue + editor at `/app/workshop/estimates/:id`
- **Tests:** `estimate-calculation.test.ts` (4 cases) + existing suites — **10 tests pass**

## GST / legal

- **No hardcoded 45% EV rate** for issued estimates; seed includes `EV 45% REQUESTED NOT APPROVED` with `approvalStatus: PENDING`, `active: false`
- Issuance blocked if no **approved** `TaxRule` for line HSN/SAC
- **Legal review required** before enabling non-standard rates

## Email / WhatsApp

- Endpoints exist; return **FAILED** with explicit message until SMTP / WhatsApp Business is configured
- Communications logged in `EstimateCommunication`

## Job card handoff

`GET /estimates/:id/job-card-handoff` — approved line items only when status is `CUSTOMER_APPROVED` or `PARTIALLY_APPROVED`

## Manual QA journey

1. `npm run db:seed` in Backend (tax rules + ESTIMATE numbering)
2. Complete receiving + VOC + inspection approve (Phase 1–2)
3. Open **Workshop → Estimates** — row appears
4. Create/open estimate, add lines with HSN `998729` or `87089900`, **Save draft** — verify totals from API
5. Preview PDF, issue, record customer decision (API or future portal)
6. Call job-card-handoff — verify approved lines only

## Production blockers

- Discount policy enforcement on save (partial — line discounts only)
- Secure customer approval portal + expiring tokens
- SMTP / WhatsApp configuration
- Full category editors (tyre, D&P, battery) UI
- Estimate-level discount allocation
- Automated E2E (33 scenarios)
- Re-login after seed for `estimates.*` permissions on JWT

## Rollback

Unmount `estimatesRoutes` in `app.ts`; Mongo collections can remain without affecting Phase 1–2.
