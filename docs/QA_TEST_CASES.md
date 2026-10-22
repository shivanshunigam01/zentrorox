# ZENTROROX — QA Test Case Catalog

**Status legend:** PASS · FAIL · BLOCKED · NOT RUN  
**Last updated:** 2026-10-22

> Full manual catalog for Sections 4–20 would exceed 500 cases. Below: **representative cases per module** plus **automation IDs**. Expand by copying the row pattern for each scenario in the master QA prompt.

---

## Automation & static

| ID | Module | Scenario | Preconditions | Steps | Expected | Actual | Status | Severity | Evidence |
|----|--------|----------|---------------|-------|----------|--------|--------|----------|----------|
| AUTO-001 | Build | Backend TypeScript compile | Repo checkout | `npm run build` in Backend | Exit 0 | Exit 0 | **PASS** | — | QA audit 2026-10-22 |
| AUTO-002 | Build | Frontend production build | Repo checkout | `npm run build` in Frontend | Exit 0 | Exit 0 | **PASS** | — | QA audit 2026-10-22 |
| AUTO-003 | Unit | Backend logic tests | Repo checkout | `npm test` in Backend | 26 pass | 26 pass | **PASS** | — | QA audit 2026-10-22 |
| AUTO-004 | QA guard | QA seed refuses prod-like DB | `MONGODB_URI=.../zentrosure` | `npm run db:seed:qa` | Error, no writes | Blocked without `ALLOW_QA_SEED` | **PASS** | — | CLI output 2026-10-22 |
| AUTO-005 | E2E | API health smoke | API running | Playwright `api-health.spec.ts` | 200 on `/health`, 401 on `/customers` | — | **NOT RUN** | P2 | Requires `e2e/npm install` + servers |
| AUTO-006 | E2E | QA login → dashboard | QA DB seeded, E2E_* env | `login-workflow.spec.ts` | Dashboard URL | — | **BLOCKED** | P1 | No isolated QA DB configured |

---

## Section 4 — Authentication & RBAC (sample)

| ID | Module | Scenario | Expected | Status | Severity |
|----|--------|----------|----------|--------|----------|
| AUTH-001 | Login | Valid tenant + user + password | 200, tokens returned | **NOT RUN** | P1 |
| AUTH-002 | Login | Wrong password | 401 | **NOT RUN** | P1 |
| AUTH-003 | Login | Unknown tenant code | 401/404 per API | **NOT RUN** | P1 |
| AUTH-004 | Login | Inactive user | 401 | **NOT RUN** | P1 |
| AUTH-005 | Token | Expired access token | 401 on API | **NOT RUN** | P1 |
| AUTH-006 | Token | Refresh token rotation | New access token | **NOT RUN** | P1 |
| AUTH-007 | Session | Logout invalidates refresh | Subsequent refresh fails | **NOT RUN** | P2 |
| AUTH-008 | RBAC | Route without permission | 403 | **NOT RUN** | P0 |
| AUTH-009 | Tenant | Cross-tenant record GET by ID | 404/403 | **NOT RUN** | P0 |
| AUTH-010 | API | PDF without Bearer token | 401 | **NOT RUN** | P1 |

---

## Section 5 — Customer & vehicle master (sample)

| ID | Scenario | Expected | Status |
|----|----------|----------|--------|
| CRM-001 | Create customer | Persisted, tenant-scoped | **NOT RUN** |
| CRM-002 | Duplicate mobile policy | Per business rules | **NOT RUN** |
| CRM-003 | Multiple vehicles per customer | Allowed | **NOT RUN** |
| CRM-004 | Duplicate registration | Rejected/normalized | **NOT RUN** |
| CRM-005 | Credit profile on customer | Exposure uses correct customer | **NOT RUN** |

---

## Sections 6–7 — Booking, pickup, receiving (sample)

| ID | Scenario | Expected | Status |
|----|----------|----------|--------|
| BK-001 | Normal booking → confirmation | Valid status transition | **NOT RUN** |
| BK-002 | Breakdown booking fee zero | Fee = 0 per policy | **NOT RUN** |
| BK-003 | Pickup complete ≠ gate-in complete | Stages distinct | **NOT RUN** |
| RC-001 | Receiving draft save/resume | Data persists | **NOT RUN** |
| RC-002 | Odometer rollback validation | Blocked or flagged | **NOT RUN** |
| RC-003 | Cloudinary multi-photo | URLs on record | **BLOCKED** (live creds) |

---

## Sections 8–14 — Workshop pipeline (sample)

| ID | Scenario | Expected | Status |
|----|----------|----------|--------|
| INS-001 | Gate-in complete → inspection queue | Case creatable | **NOT RUN** |
| INS-002 | Inactive inspector assignment | Rejected | **NOT RUN** |
| EST-001 | UI totals = API totals | Match | **NOT RUN** |
| EST-002 | Issue without HSN/SAC | Blocked | **NOT RUN** |
| APR-001 | Partial approval | Revision scope correct | **NOT RUN** |
| JC-001 | Duplicate job card | Prevented | **NOT RUN** |
| WIP-001 | Requisition does not deduct on-hand | Ledger correct | **NOT RUN** |
| WIP-002 | Consumption no second deduct | Ledger correct | **NOT RUN** |
| AW-001 | Rejected supplementary not charged | Invoice lines exclude | **NOT RUN** |
| QC-001 | QC fail blocks invoice queue | No issue | **NOT RUN** |
| QC-002 | QC pass allows billing handoff | Queue shows visit | **NOT RUN** |

---

## Sections 15–17 — Billing, delivery, feedback (sample)

| ID | Scenario | Expected | Status |
|----|----------|----------|--------|
| INV-001 | No double-bill parts/labour | Single charge lines | **NOT RUN** |
| INV-002 | Issued invoice immutable | Draft edits blocked | **NOT RUN** |
| PAY-001 | Advance allocation on issue | CONFIRMED advances applied | **NOT RUN** |
| PAY-002 | Credit clearance | `CREDIT_AUTHORIZED`, not false PAID | **NOT RUN** |
| GP-001 | QC fail → gate pass blocked | Validation error | **NOT RUN** |
| GP-002 | Unpaid no credit → gate pass blocked | Validation error | **NOT RUN** |
| DEL-001 | Gate pass issued ≠ delivered | Status distinct | **NOT RUN** |
| FB-001 | Feedback linked to visit | History shows once | **NOT RUN** |

---

## Sections 18–20 — Integrations, security, performance

| ID | Scenario | Expected | Status |
|----|----------|----------|--------|
| INT-001 | SMTP invoice email | Sent, no password in logs | **BLOCKED** |
| INT-002 | WhatsApp notify | Provider 2xx | **BLOCKED** |
| SEC-001 | JWT tamper | 401 | **NOT RUN** |
| PERF-001 | 1000 customers list pagination | <2s p95 | **NOT RUN** |

---

## Metrics (honest)

| Metric | Value |
|--------|------:|
| Total cataloged cases (this file) | 45 |
| **PASS** | 4 |
| **FAIL** | 0 |
| **BLOCKED** | 4 |
| **NOT RUN** | 37 |
| P0 open (from bugs doc) | 0 confirmed in code review; **0 verified closed by E2E** |
| P1 open | See `QA_BUG_REPORT.md` |

**Critical flow coverage (E2E):** **0% executed** — environment blocker.
