# Phase 4 — Customer Approval, Advance & Job Card Authorization

## Repository audit (pre-implementation)

| Area | Status |
|------|--------|
| Customer / Vehicle / Booking / ServiceVisit | Existing CRM + visit models; vehicle `tenantId+registrationNo` unique |
| Estimate + revisions + embedded `approvals[]` | Phase 3 — issue freezes revision; `POST /estimates/:id/customer-decision` exists |
| Dedicated payment/receipt collections | **Added** in Phase 4 |
| Customer credit profile | Legacy `creditLimit` on Customer; **CustomerCreditProfile** added |
| Job card execution | `JobCard` model exists; **no auto-create** in this phase |
| PDF | Estimate PDF (Phase 3); **advance receipt PDF** (Phase 4) |
| Email/WhatsApp | Estimate + receipt comms log **FAILED** until SMTP/WhatsApp configured |
| UI `/workshop/approvals` | Was `StageQueuePage` placeholder → **ApprovalManagementPage** |

## Delivered

### Models
- `CustomerCreditProfile`, `PaymentPolicy`, `CustomerApproval`, `AdvancePayment`, `Receipt`, `ReceiptCommunication`, `FinancialAuthorization`

### APIs (`/api/v1`)
- **Approvals:** `dashboard`, `queue`, `by-vehicle`, `by-visit/:visitId`, `by-visit/:visitId/decision`, financial authorization evaluate/exception/job-card
- **Payments:** `by-visit/:visitId`, `advances`, `advances/:id/verify`, `advances/:id/reverse`, `receipts/:id/pdf`, send email/WhatsApp stubs
- **Customers:** `GET/PUT /customers/:id/credit`

### Business rules
- Approval requires **issued (frozen)** estimate revision; updates estimate via existing `recordCustomerDecision` + canonical `CustomerApproval` record
- **Separate states:** customer approval, `financialAuthStatus`, `paymentState` on `FinancialAuthorization`
- **Credit exposure** marked **provisional** (no full AR ledger)
- **Advance optional**; zero advance allowed per `PaymentPolicy` seed `ADVANCE_OPTIONAL`
- **Idempotency** on decision and advance via `idempotencyKey`
- Cash auto-confirmed for users with `payments.verify`; UPI/card → `PENDING_VERIFICATION` until cashier verifies
- **Job card authorize** endpoint checks policy + approval; does not create job card lines

### UI
- `/app/workshop/approvals` — KPIs, tabs, paginated queue, registration search with **visit picker**, detail workspace (estimate snapshot, approve/reject, advance modal)

### Seed
- Permissions: `approvals.*`, `payments.*`, `customers.credit.*`, `financial_auth.exception`
- Numbering: `CUSTOMER_APPROVAL`, `ADVANCE_PAYMENT`, `RECEIPT`
- Master `APPROVAL_SOURCE`, payment policies `ADVANCE_OPTIONAL`, `CREDIT_CUSTOMER`

### Tests
- `approval-policy.test.ts` (3 cases) + existing suites

## Manual QA

1. `npm run db:seed` in Backend — **re-login** for new JWT permissions
2. Complete flow to **issued** estimate (`SENT_TO_CUSTOMER`)
3. **Workshop → Approvals** — open visit, record approval, optional advance
4. Verify cashier can **verify** non-cash advance and download receipt PDF
5. `GET /estimates/:id/job-card-handoff` still works for approved lines

## Not in scope / follow-ups

- Customer self-service portal, partial line UI with dependency rules
- Full AR/invoicing reconciliation, payment gateway webhooks
- GST tax invoice vs receipt voucher compliance automation
- Automated E2E matrix from spec Part 20
- Customer detail **Credit Settings** UI tab (API ready)
