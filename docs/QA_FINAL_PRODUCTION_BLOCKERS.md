# ZENTROROX — Five Production Blockers Closure Report

**Date:** 2026-10-22  
**Scope:** E-invoice/IRN, Playwright E2E, repair PDF images, credit note AR netting, production local-mode disable.

---

## 1. Blocker status summary

| # | Requirement | Status | Evidence |
|---|-------------|--------|----------|
| 1 | E-Invoice / IRN | **PASS** (adapter + validation) · **BLOCKED** (live IRN) | Unit tests `e-invoice-eligibility.test.ts`; no authorized GSP credentials in env |
| 2 | Playwright full E2E | **PARTIAL** | API smoke **PASS** (3/3); UI/browser tests **BLOCKED** (disk space `ENOSPC` on `playwright install`); full journey **NOT RUN** (no QA DB + credentials) |
| 3 | Cloudinary images in repair PDF | **PASS** (implementation) · **BLOCKED** (QA media embed test) | `repair-report-pdf.service.ts` + `pdf-image-loader.ts`; not verified with real Cloudinary bytes in CI |
| 4 | Credit notes & AR exposure | **PASS** (logic + APIs) · **BLOCKED** (Mongo integration) | `ar-receivables.test.ts`; no in-DB allocation integration test run |
| 5 | Disable local mode in production | **PASS** | `local-mode.test.ts` (4/4); Vite production guard; runtime `assertProductionApiConfig` in `main.tsx` |

**Overall production-ready:** **NO** — live e-invoice, full E2E journey, and repair-PDF media smoke remain unverified.

---

## 2. Files modified / added

### Backend
- `src/models/index.ts` — `eInvoicingSettings`, `eInvoice` on invoices, `CreditNote`, `creditsApplied`, allocation indexes
- `src/types/enums.ts` — `CREDIT_NOTE_STATUSES`, `EINVOICE_IRN_STATUSES`, `WIP_EVIDENCE`
- `src/modules/e-invoice/*` — eligibility, payload mapping, GSP HTTP provider, service
- `src/modules/billing/ar-receivables.service.ts` + `.test.ts`
- `src/modules/billing/credit-note.service.ts`
- `src/modules/billing/invoice.service.ts` — issue flow IRN gate, balance formula, repair PDF media sections
- `src/modules/billing/repair-report-pdf.service.ts` — embedded images
- `src/modules/billing/billing.routes.ts` — credit note + e-invoice routes
- `src/modules/approvals/approval-policy.service.ts` — unapplied credit balance in exposure
- `src/utils/pdf-image-loader.ts`
- `src/scripts/seed.ts` — `CREDIT_NOTE` numbering

### Frontend
- `src/lib/local-mode.ts`, `local-mode.test.ts`, `api.ts`, `main.tsx`, `vite.config.ts`, `tsconfig.json`, `package.json`

### E2E
- `e2e/tests/workshop-api-journey.spec.ts`, `security-smoke.spec.ts` (existing + expanded)

---

## 3. APIs changed

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/v1/billing/invoices/:id/e-invoice/irn` | Request IRN for issued invoice (GSP) |
| POST | `/api/v1/billing/invoices/:id/e-invoice/cancel` | Cancel IRN |
| POST | `/api/v1/billing/credit-notes` | Draft credit note |
| POST | `/api/v1/billing/credit-notes/:id/issue` | Issue credit note |
| POST | `/api/v1/billing/credit-notes/apply` | Apply to invoice (allocation) |
| POST | `/api/v1/billing/credit-notes/:id/cancel` | Cancel unapplied credit note |

Issue invoice (`POST .../issue`) now **blocks issue** when e-invoice is **REQUIRED** and GSP returns no real IRN.

---

## 4. Database migrations

No destructive migration. **Optional fields** on `Tenant`, `FinalInvoice`, new `CreditNote` collection — MongoDB creates on first write.

**Index additions:** credit note numbers, allocation idempotency, credit-note allocation uniqueness.

---

## 5. Build results (actual)

| Command | Result | Notes |
|---------|--------|-------|
| `Backend/npm run build` | **PASS** | 2026-10-22 |
| `Backend/npm test` | **PASS** | **34** tests |
| `Frontend/npm test` | **PASS** | **4** tests |
| `Frontend/npm run build` | **PASS** with `VITE_API_BASE_URL=/api/v1` | Fails without URL (by design) |
| `e2e/npx playwright test` | **PARTIAL** | 3 passed, 3 skipped, 1 failed (browser install ENOSPC) |

---

## 6. Automated test results

- Backend: **34/34 PASS**
- Frontend local-mode: **4/4 PASS**
- Playwright: `api-health` + `security-smoke` (API) **PASS**; UI redirect **FAIL** (Chromium not installed — disk full)

---

## 7. E2E execution evidence

```
ok  GET /health returns ok
ok  protected route rejects missing auth
ok  unauthenticated billing blocked
skipped  login-workflow (no E2E_* env)
skipped  workshop-api-journey (no E2E_* env)
failed   legacy inspection UI redirect (playwright install ENOSPC)
```

Full workshop UI journey (booking → feedback): **NOT RUN**.

---

## 8. Tax / financial compliance limitations

- E-invoice eligibility rules are **simplified** — **mandatory tax/compliance review** before go-live.
- **No fake IRN** — mock provider refuses generation; production requires `EINVOICE_GSP_*` env vars.
- Credit note tax line detail is minimal — align with your CA/GST practice before production postings.

---

## 9. External credentials still needed

| Integration | Variables |
|-------------|-----------|
| GSP / IRP | `EINVOICE_GSP_BASE_URL`, `EINVOICE_GSP_CLIENT_ID`, `EINVOICE_GSP_CLIENT_SECRET` |
| Tenant toggle | `Tenant.eInvoicingSettings.enabled`, GSTIN, turnover declaration |
| Cloudinary | Existing `CLOUDINARY_*` for image fetch in PDFs |
| E2E | Isolated `zentrorox-qa` MongoDB, `E2E_TENANT_CODE`, `E2E_USER`, `E2E_PASSWORD` |

---

## 10. Remaining release blockers

1. **Live IRN** generation with authorized GSP — **BLOCKED** without credentials.
2. **Full Playwright journey** on QA MongoDB — **NOT RUN**; browser install blocked by **disk space** on audit machine.
3. **Repair PDF** with real Cloudinary assets — code complete, **not integration-tested**.
4. **Credit note** Mongo transaction tests under concurrency — **NOT RUN**.
5. Production deploy must set **`VITE_API_BASE_URL`** at build time (verified guard).

---

## Configuration reference

### E-invoice (backend `.env`)

```env
EINVOICE_PROVIDER=GSP_HTTP
EINVOICE_GSP_BASE_URL=https://your-authorized-gsp.example/einvoice
EINVOICE_GSP_CLIENT_ID=
EINVOICE_GSP_CLIENT_SECRET=
```

### Production frontend build

```bash
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1 npm run build
```

`VITE_USE_LOCAL_API=true` is ignored at runtime in production builds and **blocks** production Vite build.
