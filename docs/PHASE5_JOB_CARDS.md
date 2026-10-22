# Phase 5 — Job Cards, Teams, Bays & Delivery

## Audit (before implementation)

| Area | Finding |
|------|---------|
| `JobCard` model | Basic header only (`OPEN`…); list/get/by-visit APIs; **no create from approval** |
| `JobCardsLivePage` | Merged service-visit stage queue + job card list — **not** Phase 5 workspace |
| Phase 4 handoff | `FinancialAuthorization.jobCardAuthorized` + `assertEligibleForJobCard`; receipt **not** required when policy/credit allows |
| `Bay` model | Used by bay board; no reservation engine |
| Users | `listTechnicians` by role code; **no** workshop profile until Phase 5 `workshopProfile` on User |
| Parts | Stock balances exist; **no** job-card parts readiness integration yet (stub in workspace) |

## Delivered

### Data model extensions
- **JobCard:** approval/financial refs, delivery plan + revision history, workshop roles, unique `serviceVisitId` per tenant
- **JobWorkItem:** one per approved estimate line
- **WorkshopTeam**, **WorkAssignment** (with history), **WorkshopLocation** (BAY + EXTRA_SPACE), **LocationReservation**
- **User.workshopProfile** for skills, roles, availability, workload cap

### Backend (`/api/v1/job-cards`)
- `GET dashboard`, `GET queue` (eligible + status tabs)
- `POST from-visit/:visitId` (eligibility + idempotency header)
- `GET :id/workspace`, `GET :id/pdf`
- `POST :id/assignments`, `POST :id/assignments/:id/release`
- `POST :id/delivery-plan`
- Masters: `teams`, `locations`, `eligible-employees`
- `GET locations/availability`, `POST locations/reservations`

### Rules
- Eligibility: customer approval on frozen revision, financial `AUTHORIZED` or `EXCEPTION_APPROVED`, approved lines, no duplicate job card
- Work items seeded only from `getJobCardHandoff` approved lines
- Delivery estimate: labour hours ÷ parallel teams + buffer (**not** invoice-based)
- Bay/extra-space: exclusive overlap rejected on reserve

### UI
- `/app/workshop/job-cards` — queue, create, workspace (assign team, release, delivery recalc, PDF)
- Legacy table: `/app/workshop/job-cards-legacy`

### Seed
- Permissions `job_cards.*`, `delivery_commitments.*`, `workshop_teams.manage`, `WORKSHOP_EXECUTIVE` role
- Demo teams MECH-A / ELEC-A, locations from bays + OUTDOOR-1

### Tests
- `delivery-schedule.test.ts` (2 cases) — **15 tests total** with prior suites

## Build & test (verified 2025-10-21)

```bash
cd Backend && npm run build && npm test   # tsc OK, 15 tests pass
cd Frontend && NODE_OPTIONS=--max-old-space-size=4096 npm run build   # tsc + vite OK (default tsc may OOM on low memory)
```

## Blockers / follow-ups (not production-complete)

- Parts readiness from inventory (Part 9) — stub empty array
- Full reassignment API, skill mismatch exceptions, shift/holiday calendar
- WIP/QC execution (Phase 6)
- Automated E2E A–Z matrix
- `job_cards.reassign` permission not wired to dedicated endpoint yet
- TanStack Query migration optional

## Rollback

Unmount new routes handlers in `job-cards.routes.ts` (keep legacy GET list); Mongo collections can remain. Remove unique `serviceVisitId` index only if duplicate job cards required (not recommended).

## Deployment

1. `npm run db:seed` — teams, locations, permissions  
2. Re-login for JWT permissions  
3. Complete Phase 4 authorization on visit → **Create** on job card queue  
