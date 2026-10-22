# ZENTROROX — Master QA Audit

**Audit date:** 2026-10-22  
**Auditor role:** Code inspection + automated static/unit tests (no full manual E2E on live DB)  
**Evidence:** `Backend/npm run build`, `Backend/npm test` (26 pass), `Frontend/npm run build`; `npm run db:seed:qa` blocked on current `zentrosure` DB (expected).

## Environment snapshot (Section 2)

| Check | Result |
|--------|--------|
| `NODE_ENV` (local `.env`) | `development` |
| MongoDB database name (suffix only) | `zentrosure` — **not** QA/staging named |
| Isolated QA DB available | **No** — money-moving / full journey tests **BLOCKED** |
| Frontend API mode | Real API unless `VITE_USE_LOCAL_API=true` |
| Playwright in repo | Added under `e2e/` — **not executed** in this audit (no CI run) |

**Safe QA setup:** Point `MONGODB_URI` to e.g. `.../zentrorox-qa`, set `ALLOW_QA_SEED=true`, run `npm run db:seed:qa` in `Backend/`. Do **not** run `db:seed` on production.

---

## Module audit matrix

Severity: **P0** financial/security/data leak · **P1** primary workflow · **P2** functional · **P3** cosmetic

| MODULE | EXPECTED FEATURE | CURRENT IMPLEMENTATION | TEST COVERAGE | IDENTIFIED GAP | SEV | RECOMMENDED FIX |
|--------|------------------|------------------------|---------------|----------------|-----|-----------------|
| **Frontend routing** | All workshop phases reachable; legacy URLs redirect | `Frontend/src/routes/index.tsx` — unified `/inspection`, `/qc`, `/billing-delivery`; legacy redirects | None automated | Service-visit stepper may still show legacy stage keys in DB | P2 | Align visit stage labels with `STAGE_UI_PATHS` on read |
| **Sidebar navigation** | Consolidated workshop nav | `SIDEBAR_NAV` 9 workshop items; floor/bay boards redirect to WIP | Manual only | Duplicate “Billing & Delivery” under Sales | P3 | Optional dedupe |
| **Backend API registration** | Phase 1–8 routes mounted | `Backend/src/app.ts` — auth through billing, inventory, qc, etc. | Partial (unit logic) | No OpenAPI contract tests | P2 | Add supertest smoke per router |
| **DB models & indexes** | Tenant-scoped uniqueness | `Backend/src/models/index.ts` — extensive compound indexes | None integration | Performance at 5k+ visits **not measured** | P2 | Load test on QA DB |
| **Authentication** | JWT access + refresh | `auth.routes.ts`, `middleware/auth.ts` | **NOT RUN** live | Demo creds on login in dev only (fixed for prod build) | P2 | Done: hide demo in production |
| **Tenant isolation** | JWT tenant only | `req.tenantId` from user; `requireTenant` | **NOT RUN** cross-tenant | No automated IDOR suite | P1 | API tests with two QA tenants |
| **Branch authorization** | Branch-scoped lists | `X-Branch-Id` + optional filter in services | **NOT RUN** | Users with all branches see all branch data | P2 | Document policy; optional enforce |
| **Master data** | Masters UI + API | `masters.routes`, masters page | Manual | Some purchase screens are generic placeholders | P2 | Implement or label “preview” |
| **Service visit stages** | Valid transitions | `service-visits.service`, enums | Unit (booking only) | Full stage graph not unit-tested | P1 | Transition matrix tests |
| **Phase 1 booking/pickup** | Bookings, pickup tasks | `bookings`, `pickups` modules | `booking-transitions.test.ts` | E2E pickup→gate-in **NOT RUN** | P1 | Playwright on QA DB |
| **Gate-in & receiving** | Receiving record, photos | `receiving` module, Cloudinary uploads | **NOT RUN** | Upload failure UX not verified | P2 | QA manual + mock Cloudinary |
| **VOC / inspection** | Unified module | Inspection + VOC APIs; UI `trial-inspection-*` pages | `inspection-eligibility.test.ts` | File names still “trial-inspection” | P3 | Rename pages (cosmetic) |
| **Estimates** | Tax, HSN/SAC, PDF | `estimates` module | `estimate-calculation.test.ts` | Block issue on bad tax — verify in API test | P1 | Supertest issue guard |
| **Approval & advance** | Credit, advance policy | `approvals`, `payments` | `approval-policy.test.ts` | Credit notes not in AR exposure | P1 | Net credit notes in `computeCreditExposure` |
| **Job cards** | One per visit, teams, bays | `job-cards` module | `delivery-schedule.test.ts` | Duplicate JC prevention **NOT RUN** | P1 | Integration test |
| **WIP** | Sessions, parts flow | `wip`, `parts-requisitions` | **NOT RUN** | Concurrent issue **NOT RUN** | P0/P1 | Concurrency tests on QA |
| **Inventory ledger** | Req/reserve/issue/consume/return | `inventory-transaction.service` | Quantity math unit tests | Double-deduct rules **not integration-tested** | P0 | Ledger integration tests |
| **Additional work** | Supplementary estimate + revision | `additional-work` module | None | Full journey **NOT RUN** | P1 | E2E scenario |
| **Final QC** | Unified QC + road test | `qc` module | `qc-quantity.logic.test.ts` | Failed QC → invoice block **NOT RUN** | P1 | API test on billing queue |
| **Final invoice** | Draft, reconcile, issue | `billing/*` | `billing-eligibility`, `invoice-reconciliation` | E-invoice/IRN absent | P1 | Integrate govt API or mark out of scope |
| **Payments / gate pass / delivery** | Eligibility rules | `gate-pass.service`, billing routes | Logic in code review | Gate pass needs QC pass + pay/credit | P1 | Automated eligibility tests |
| **Feedback & history** | Post-delivery feedback | billing feedback endpoints | **NOT RUN** | CRM history completeness **NOT RUN** | P2 | UAT script |
| **Cloudinary** | Secure uploads | `uploads`, `lib/cloudinary.ts` | **BLOCKED** without creds | Repair PDF images as links only | P2 | Embed images in PDF |
| **SMTP / email** | Nodemailer + SendGrid fallback | `outbound-notify.ts` | **BLOCKED** live send | Not in Zod `env.ts` (process.env OK) | P2 | Smoke test in staging |
| **WhatsApp** | Webhook notify | `WHATSAPP_NOTIFY_URL` | **BLOCKED** | Template/webhook **NOT RUN** | P2 | Staging provider test |
| **PDF generation** | Auth-required download | Frontend `downloadApiFile` | **NOT RUN** | Long invoice memory **NOT RUN** | P2 | Performance test |
| **Audit logs** | Mutations logged | `createAuditLog` in key services | **NOT RUN** | Coverage incomplete per module | P2 | Audit coverage review |
| **Automated tests** | Unit + E2E | 26 backend unit tests; Playwright skeleton | Partial | No frontend unit tests; no supertest | P1 | Expand per Section 21 |

---

## API surface (registered under `/api/v1`)

| Prefix | Module |
|--------|--------|
| `/auth` | Login, refresh, logout, me |
| `/customers`, `/vehicles` | CRM |
| `/bookings`, `/pickups`, `/receiving` | Phase 1–2 |
| `/service-visits` | Visit lifecycle |
| `/voc`, `/inspections` | Inspection workspace |
| `/estimates`, `/approvals`, `/payments` | Commercial |
| `/job-cards`, `/wip`, `/parts-requisitions`, `/inventory` | Workshop execution |
| `/additional-work`, `/qc` | Change & QC |
| `/billing` | Invoice, payments, gate pass, delivery, feedback |
| `/masters`, `/uploads`, `/dashboard`, `/search`, `/tenant`, `/branches`, `/users`, `/parts`, `/bays` | Supporting |

---

## Static analysis (Section 3)

| Command | Result | Date |
|---------|--------|------|
| `Backend/npm run build` | **PASS** | 2026-10-22 |
| `Backend/npm test` | **PASS** (26 tests) | 2026-10-22 |
| `Backend/npm run lint` | **N/A** — no lint script in package.json | — |
| `Frontend/npm run build` | **PASS** | 2026-10-22 |
| `Frontend/npm run lint` | **N/A** — no lint script | — |
| `Frontend unit tests` | **N/A** — no test script | — |

---

## Security notes (code review)

- Tenant ID comes from JWT user record, not request body (no `tenantId` override grep hits in controllers).
- CORS callback allows any origin (`origin: true`) — acceptable only with strict auth; tighten `CORS_ORIGIN` in production.
- Rate limiting enabled globally on API app.
- Production JWT length/default check in `Backend/src/index.ts`.
- PDF/file routes use `authenticate` + permissions on billing routes.

---

## Related documents

- `docs/QA_TEST_CASES.md` — case catalog and execution status
- `docs/QA_BUG_REPORT.md` — defects and gaps
- `docs/QA_E2E_EXECUTION_REPORT.md` — what was actually run
- `docs/QA_PRODUCTION_READINESS.md` — gate decision
