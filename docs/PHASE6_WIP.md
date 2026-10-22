# Phase 6 — WIP, Parts Requisition & Inventory

## Audit (pre-implementation)

| Area | Finding |
|------|---------|
| WIP UI | `wip-page.tsx` used legacy `/service-visits/wip` stage list |
| Job Cards Phase 5 | Release assignment → `READY_TO_START`; no execution checklist |
| Inventory | `StockBalance` had `available`/`reserved` only — no ledger |
| Parts requisition | Generic placeholder pages only |
| Supplementary estimates | Unique index on `serviceVisitId` blocked multiple estimates per visit |

## Delivered

### Navigation
- Removed **Workshop Floor**, **Bay Board**, **Technician Board** from sidebar
- Routes redirect to `/app/workshop/wip` (deep links preserved)
- Unified workspace: `/app/workshop/wip` and `/app/workshop/wip/:jobCardId`

### Models
- `WipRecord`, `WorkSession`, `PartsRequisition`, `StockLedger`, `StockIssue`, `StockReturn`
- `AdditionalWorkRequest`, `JobCardRevision`
- Extended `JobWorkItem` (execution status, photos, verification, labour minutes)
- Extended `JobCard` (revision number, supplementary value)
- Extended `Estimate` (`estimateKind` PRIMARY/SUPPLEMENTARY, parent refs)
- Extended `StockBalance` (`onHand`, `issuedToWip`)

### APIs
- `/api/v1/wip/*` — dashboard, queue, workspace, work items, sessions, completion/QC handoff
- `/api/v1/parts-requisitions/*` — create, submit, approve, issue
- `/api/v1/inventory/*` — availability, ledger, consume, stock returns
- `/api/v1/additional-work/*` — create, submit, send-to-estimate
- `/api/v1/job-cards/:id/revisions/*` — list, create from supplementary approval
- `/api/v1/parts/warehouses`

### Inventory rules
- Requisition create: **no** stock deduction
- Approve: **RESERVE** ledger + increase `reserved`
- Issue: decrease `onHand`, release reservation, **ISSUE** ledger; optional **CONSUME** separate
- Return: validates against issued qty; reusable stock restores `onHand`

### Seed
- Phase 6 permissions (`wip.*`, `parts_requisitions.*`, `job_cards.revise`, etc.)
- Numbering: PR, SI, SR, AWR
- Technician / Parts Manager role updates

### Tests
- `inventory-transaction.test.ts` (2 cases) — **17 tests** total backend

## Build (verified)

```bash
cd Backend && npm run build && npm test
cd Frontend && NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

## Blockers / follow-ups

- Full 12-section WIP UI (photo upload to Cloudinary, rich additional-work form)
- Automated E2E matrix (Part 21 A–AC)
- Supplementary estimate line editing still uses main Estimate workspace
- Re-evaluate financial authorization on supplementary approval (hook Phase 4)
- MongoDB: drop old `estimates` unique index `{ tenantId, serviceVisitId }` if upgrading existing DB; re-run seed index via `estimateKind`

## Rollback

Unmount `/wip`, `/parts-requisitions`, `/inventory`, `/additional-work` in `app.ts`. WIP collections can remain. Restore sidebar entries and live page routes if needed.

## Deployment

1. `npm run db:seed` — permissions & numbering  
2. Re-login for JWT permissions  
3. Job Card → release assignment → vehicle appears in **WIP** queue  
