# Workflow stage transitions

Single `ServiceVisit` identity; queues are eligibility queries on persisted state (`currentStage`, `invoiceReady`, invoice `paymentStatus`, QC status, etc.).

Catalog: `Backend/src/modules/workflow/workflow-transitions.ts`

Engine: `Backend/src/modules/workflow/workflow-engine.service.ts`

## Hooks (implemented)

| Event | Trigger location |
|-------|------------------|
| `INSPECTION_APPROVED` | `inspections.service` supervisor approve |
| `ESTIMATE_ISSUED` | `estimates.service` issue |
| `JOB_CARD_CREATED` | `job-cards-phase5.service` create |
| `WIP_COMPLETED` → QC | `wip.service` release to QC |
| `QC_PASSED` → INVOICE | `qc.service` invoice release |
| `INVOICE_ISSUED` | `invoice.service` issue |
| `INVOICE_FULLY_PAID` / partial | Razorpay reconcile, manual payment verify |
| `GATE_PASS_ISSUED` | `gate-pass.service` issue |
| `DELIVERY_COMPLETED` | `delivery.service` complete |

## Expected chain

BOOKING → … → QC (`invoiceReady`) → INVOICE → PAYMENT → GATEPASS → DELIVERY → FEEDBACK

Downstream modules must not mark upstream stages complete without backend mutations.
