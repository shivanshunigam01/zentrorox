# ZENTROROX Phase 1 — Implementation Status

## Connected stack

- **Frontend** now uses the **real API by default** (`VITE_USE_LOCAL_API` must be `true` to use localStorage demo).
- **Backend** extended for booking types, pickup tasks, receiving records, VOC records, and media categories.
- Copy `Frontend/.env.example` → `Frontend/.env` with `VITE_USE_LOCAL_API=false` and `VITE_API_BASE_URL=/api/v1`.

## Run

```bash
# Terminal 1
cd Backend && npm run dev

# Terminal 2
cd Frontend && npm run dev
```

Login: seed with `npm run db:seed` → `DEMO-MOTORS` / `rajesh@demomotors.com` / `demo1234`

## New / updated API routes

| Route | Purpose |
|-------|---------|
| `POST/PATCH /api/v1/bookings` | `bookingType`, `breakdownDetails`, phase-1 statuses |
| `PATCH /api/v1/bookings/:id/status` | Server-validated transitions |
| `GET /api/v1/pickups` | Pickup operations queue |
| `PATCH /api/v1/pickups/:id/assign` | Assign driver |
| `PATCH /api/v1/pickups/:id/status` | Pickup lifecycle |
| `GET /api/v1/receiving/queue` | Expected arrivals + active visits |
| `GET /api/v1/receiving/by-visit/:id/workspace` | Booking + pickup + receiving + VOC + media |
| `GET/PUT/POST /api/v1/receiving/by-visit/:id/*` | Receiving draft & complete (Zod, idempotent complete) |
| `GET /api/v1/service-visits/:id/phase-eligibility` | `readyForInspection` / blockers for Phase 2 |
| `GET/PUT/POST /api/v1/voc/by-visit/:id/*` | VOC complaints & confirm |
| `POST /api/v1/uploads/image` | `imageCategory` metadata |

## Frontend pages

- **Bookings** — Normal vs Breakdown cards, breakdown fields, API-backed create.
- **Pickup Operations** — `/app/workshop/pickup`
- **Vehicle Receiving** — `/app/workshop/receiving-hub` → unified workspace `/app/service-visits/:visitId/receiving`

## Remaining for full spec (next iterations)

- Unified service-visit stepper (gate-in + inventory + VOC in one screen)
- Full inventory master integration and printable acknowledgment PDF
- Multi-image uploader component with categories
- RBAC per permission on new routes
- Automated E2E tests (scenarios A–L)
- Idempotent complete-receiving (double-click guard)

## MongoDB

New collections: `pickuptasks`, `receivingrecords`, `vocrecords`. Extended `bookings` and `media` fields. No destructive migration; legacy `BOOKED`/`ARRIVED` normalized in API responses.
