# Phase 2 — Trial & Inspection

## Architecture findings

- A full **inspections** service module existed but was excluded from `tsc`; it is now wired with `InspectionCase` Mongoose model, routes, and UI.
- **Diagnosis** remains in `SERVICE_STAGES` for legacy visit history; stage logs mark `DIAGNOSIS` as `SKIPPED` when inspection is approved. UI routes `/workshop/diagnosis` and `/workshop/inspection` redirect to **Trial & Inspection**.
- Eligibility reuses **ReceivingRecord** + **VocRecord** (`inspection-eligibility.ts`). Queue sync runs on dashboard/queue load and after receiving complete.

## Files created / modified

**Backend:** `models/index.ts` (InspectionCase, user `employeeCode`/`metadata`, `vehicleCategory`), `types/enums.ts`, `modules/inspections/*`, `app.ts`, `scripts/seed.ts`, `receiving.service.ts` (sync cases), `tsconfig.json`

**Frontend:** `trial-inspection-dashboard-page.tsx`, `trial-inspection-workspace-page.tsx`, `lib/api.ts`, `routes/index.tsx`, `lib/constants.ts`, `lib/stage-paths.ts`, `multi-image-upload.tsx`

## APIs (`/api/v1/inspections`)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/dashboard` | KPI counts |
| GET | `/queue` | Filterable queue |
| GET | `/inspectors` | Eligible inspectors + workload |
| POST | `/from-visit/:visitId` | Idempotent case create |
| GET/PATCH/POST | `/:id/*` | Assign, start, pause, resume, trial, checklist, findings, submit, review, report |

Permissions: `inspections.view`, `inspections.edit`, `inspections.review` (re-seed or update roles).

## Workflow

`RECEIVING COMPLETED` + `VOC CONFIRMED` → auto case `PENDING_ASSIGNMENT` → assign → start → trial/checklist/findings → submit → review → `COMPLETED` → visit `ESTIMATE` (diagnosis skipped in stage log).

## Manual QA

1. Complete Phase 1 receiving + VOC on a visit.
2. Open `/app/workshop/inspection` (legacy `/app/workshop/trial-inspection` redirects) — vehicle appears.
3. Assign inspector (TECHNICIAN/INSPECTOR role), start, save trial/checklist, add finding, submit, approve.
4. Confirm visit stage is **ESTIMATE** and legacy `/workshop/diagnosis` redirects.

## Remaining blockers

- VOC verification per-complaint UI (backend `vocVerifications` array exists).
- Full trial observation matrix from masters (partial — disposition + odometer).
- Per-checklist-item and per-finding media linkage in UI.
- JWT must include new permissions (run `npm run db:seed` or grant `inspections.*`).
- Concurrent edit protection (optimistic locking) not yet implemented.
- E2E tests A–P not automated in CI.

## Deploy / rollback

- Deploy backend first (new collection `inspectioncases`, no migration script required).
- Rollback: unmount `/inspections` route; existing visits unaffected; cases remain in Mongo.
