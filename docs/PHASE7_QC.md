# Phase 7 — Unified QC, Quantity Verification & Road Test

## Audit

| Before | Finding |
|--------|---------|
| `/app/workshop/qc` | `StageQueuePage` on service visit stage only |
| `/app/workshop/road-test` | Separate stage queue |
| Backend | No QC case, attempts, or invoice handoff |
| Phase 6 | `verifyJobCompletion` sets `READY_FOR_QC` on job card + WIP |

## Delivered

- **Unified UI:** `/app/workshop/qc` (+ `/:qcCaseId`); road test redirect to QC
- **Models:** `QualityControlCase`, `QCAttempt`, `QCReworkRequest`; `ServiceVisit.invoiceReady`, `finalQcOdometer`
- **API:** `/api/v1/qc/*` — queue, dashboard, assign, start, checklist, quantity, VOC, road test, pass/fail, rework, PDF
- **Eligibility:** `qc-eligibility.ts` — WIP verified, work complete, no blocking AWR/open requisitions
- **Quantity:** `qc-quantity.ts` from requisitions, issues, ledger, returns (no stock deduction)
- **Handoff:** QC PASS → `INVOICE_READY` job card, `visit.invoiceReady`, stage `INVOICE` (idempotent `invoiceReleasedAt`)
- **Rework:** FAIL → `QCReworkRequest`, work items `REWORK_REQUIRED`, WIP `IN_PROGRESS`
- **Reinspection:** Job card revision invalidates prior QC → `REINSPECTION_PENDING`
- **Inspector master:** `User.workshopProfile` extended (licence, road test auth); `GET /qc/inspectors`

## Build

```bash
cd Backend && npm run build && npm test
cd Frontend && NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

## Gaps

- Master QC templates from `MasterData` (default road test checklist only)
- Cloudinary upload UI in QC workspace (categories in enum)
- Full Part 21 automated E2E matrix
- `qc.release_invoice` separate from pass (currently combined on pass)

## Rollback

Remove `api.use('/qc', qcRoutes)` from `app.ts`. Collections can remain.
