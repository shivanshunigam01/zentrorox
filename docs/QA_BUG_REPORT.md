# ZENTROROX — QA Bug & Gap Report

**Last updated:** 2026-10-22  
Format: defect / gap records from audit + prior implementation review. **FAIL** items require reproduction on QA DB before closure.

---

## Open gaps (launch-blocking / high)

| BUG-ID | Severity | Module | Expected | Actual / gap | Root cause | Fix status | Retest |
|--------|----------|--------|----------|--------------|------------|------------|--------|
| QA-GAP-001 | **P1** | Compliance | E-invoice / IRN where legally required | Not implemented | No govt integration | **Open** | N/A |
| QA-GAP-002 | **P1** | Finance | Credit exposure nets credit notes | AR = sum `balanceDue` only | `computeCreditExposure` omits credit notes | **Open** | NOT RUN |
| QA-GAP-003 | **P1** | QA process | Full E2E workshop journey verified | No executed E2E evidence | No isolated QA MongoDB in audit env | **Open** — use `db:seed:qa` | NOT RUN |
| QA-GAP-004 | **P1** | Inventory | Req/reserve/issue/consume/return integration proof | Unit math only | Missing supertest/ledger tests | **Open** | NOT RUN |
| QA-GAP-005 | **P1** | Security | Cross-tenant IDOR suite | Not automated | No API security test pack | **Open** | NOT RUN |
| QA-GAP-006 | **P1** | Estimates | Block issue when tax master invalid | Documented intent | Needs API-level verification | **Open** | NOT RUN |

---

## Medium / functional

| BUG-ID | Severity | Module | Description | Fix status |
|--------|----------|--------|-------------|------------|
| QA-GAP-007 | P2 | PDF | Repair annexure uses image URLs, not embedded binary | Open |
| QA-GAP-008 | P2 | UI | Billing workspace simplified vs 12-section spec | Open |
| QA-GAP-009 | P2 | Purchase | Several purchase routes are generic placeholder pages | Open |
| QA-GAP-010 | P2 | CORS | `cors` allows all origins | Mitigate via `CORS_ORIGIN` at deploy | Config |
| QA-GAP-011 | P2 | Branch | Optional branch filter — multi-branch users see all | Document or enforce | Open |
| QA-GAP-012 | P2 | Performance | No measured benchmarks at 5k visits | Open | NOT RUN |

---

## Fixed during this QA pass

| BUG-ID | Severity | Description | Fix reference |
|--------|----------|-------------|---------------|
| QA-FIX-001 | P2 | Demo credentials visible on production login build | `login-page.tsx` — `showDemoHints` |
| QA-FIX-002 | P2 | Misleading Frontend README (local API “default”) | `Frontend/README.md` |
| QA-FIX-003 | P1 | Unsafe QA seed against production DB | `qa-environment-guard.ts`, `qa-seed.ts`, tests |
| QA-FIX-004 | P2 | No Playwright harness | `e2e/` package + smoke specs |

---

## P0 watchlist (none confirmed without E2E)

These require **QA database** reproduction before filing as confirmed P0 defects:

- Double stock deduction on consumption
- Invoice payment marking vehicle releasable without clearance
- Tenant B accessing Tenant A records

Code review indicates gate pass and credit clearance logic is present; **not verified under concurrency or attack scenarios**.

---

## Regression tests added

| Test | File |
|------|------|
| QA DB guard | `Backend/src/scripts/qa-environment-guard.test.ts` |
| Existing billing/QC/inventory unit tests | `Backend/src/**/*.test.ts` (26 total) |
