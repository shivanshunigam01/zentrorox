# ZENTROROX Phase 1 — QA Guide

## Prerequisites

- Backend: `cd Backend && npm run dev` (port 3000)
- Frontend: `cd Frontend && npm run dev` (port 5173)
- `Frontend/.env`: `VITE_USE_LOCAL_API=false`, `VITE_API_BASE_URL=/api/v1`
- Seed: `cd Backend && npm run db:seed` — login `rajesh@demomotors.com` / `demo1234`, tenant `DEMO-MOTORS`
- Re-run seed (or add masters manually) for `INVENTORY_*` checklist items if an existing tenant predates seed updates.

## Unified receiving workspace

Route: `/app/workshop/receiving-hub` → **Receive** → `/app/service-visits/:visitId/receiving`

Sections on one visit: Booking, Pickup history, Gate-In, Inventory, Images, VOC.

## Manual scenarios (A–L)

| ID | Scenario | Expected |
|----|----------|----------|
| A | Normal booking → gate-in → inventory → VOC → complete | Receiving `COMPLETED`, booking `CHECKED_IN`, phase `READY_FOR_INSPECTION` after VOC confirm |
| B | Breakdown → pickup → handover → receiving | Pickup history visible; booking complaints in VOC |
| C | Scheduled pickup → workshop arrival | Visit in queue; receiving draft persists after refresh |
| D | Multiple VOC complaints | All saved; confirm locks edits |
| E | Multiple images | Upload with category; listed under visit media |
| F | Engine/chassis mismatch | Complete → `EXCEPTION`, not `READY_FOR_INSPECTION` |
| G | Odometer below vehicle master | `ODOMETER_ROLLBACK` flag on draft save |
| H | Inventory MISSING/DAMAGED | Shown on printable report |
| I | Draft save and resume | `PUT .../draft` then reload page |
| J | Duplicate complete POST | Second call returns `alreadyCompleted: true` |
| K | No JWT / wrong role | 401/403 on receiving, pickups, VOC |
| L | Cross-tenant visit id | 404 or forbidden (tenant scope) |

Also verify: cancellation paths, failed Cloudinary upload (error in UI), invalid booking transitions, legacy `BOOKED`/`ARRIVED` statuses.

## Automated tests

```bash
cd Backend && npm test
```

## API smoke (authenticated)

- `GET /api/v1/receiving/by-visit/:visitId/workspace`
- `PUT /api/v1/receiving/by-visit/:visitId/draft`
- `POST /api/v1/receiving/by-visit/:visitId/complete`
- `GET /api/v1/voc/by-visit/:visitId`
- `POST /api/v1/voc/by-visit/:visitId/confirm`
- `GET /api/v1/service-visits/:id/phase-eligibility`

## Phase 2 contract

`GET /service-visits/:id/phase-eligibility` → `readyForInspection: true` only when receiving is `COMPLETED`, VOC `CONFIRMED`, and no blockers (not for `EXCEPTION` or incomplete).
