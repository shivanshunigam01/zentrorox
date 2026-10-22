# ZENTROROX — Complete Platform Documentation

**Projects:** `Frontend/` (ZentroSure UI) + `Backend/` (ZentroSure API)  
**Last updated:** October 2026  
**Scope:** This document covers the **zentrorox** workshop DMS only. It does **not** describe `create-space` or `Zentroverse-backend-final` (Zentroverse marketing site).

---

## Table of contents

1. [Product overview](#1-product-overview)
2. [Architecture](#2-architecture)
3. [Local mode vs real API](#3-local-mode-vs-real-api)
4. [Backend](#4-backend)
5. [Frontend](#5-frontend)
6. [User flows](#6-user-flows)
7. [Relation to other repos](#7-relation-to-other-repos-in-zentrorox)
8. [Adding new features](#8-adding-new-features)
9. [Run locally](#9-run-locally-full-stack)
10. [Maturity notes](#10-maturity-notes)

---

## 1. Product overview

**ZENTROROX** is a **multi-tenant automotive workshop / dealership service-center platform**:

| Area | Capabilities |
|------|----------------|
| **CRM** | Customers, vehicles |
| **Workshop** | Bookings → service visits → staged workflow (pickup, gate-in, inspection, job cards, bays, WIP, QC, delivery, etc.) |
| **Parts & inventory** | Parts master, stock, low-stock views (some purchase/billing screens are UI shells) |
| **Operations** | Branches, bays, users/technicians, master dropdowns, reports, printable documents |

**Branding (frontend):** `Frontend/src/lib/brand.ts`

- Name: **ZENTROROX**
- Tagline: *Automotive Workshop Management Software*
- Pillars: SERVICE | PEOPLE | PARTS | PROFITS

**Package names:** `zentrosure-backend`, `zentrosure-frontend`  
**API service name (health):** `zentrosure-api`

---

## 2. Architecture

```mermaid
flowchart TB
  subgraph fe [Frontend - Vite React]
    LP[Landing /]
    LOGIN[/login]
    APP[/app/* AppShell]
    LOCAL[local-api + localStorage]
  end
  subgraph be [Backend - Express TS]
    API["/api/v1/*"]
    AUTH[JWT access + refresh]
    TENANT[tenantId + X-Branch-Id]
  end
  DB[(MongoDB - e.g. zentrosure)]
  CLD[Cloudinary uploads]

  APP -->|VITE_USE_LOCAL_API=false| API
  APP -->|default local mode| LOCAL
  API --> AUTH
  API --> TENANT
  API --> DB
  API --> CLD
```

| Piece | Path | Dev URL | Stack |
|--------|------|---------|--------|
| **Frontend** | `zentrorox/Frontend` | `http://localhost:5173` | React 19, Vite 8, Tailwind 4, React Router 7, TanStack Query, Radix UI |
| **Backend** | `zentrorox/Backend` | `http://localhost:3000` | Express 5, TypeScript, Mongoose, Zod, JWT, Helmet, rate limit |
| **API base** | — | `http://localhost:3000/api/v1` | All business routes under `/api/v1` |

**Health (no auth):** `GET http://localhost:3000/health`

---

## 3. Local mode vs real API

By default the **frontend does not call the backend**.

`Frontend/src/lib/local-mode.ts`:

- If **`VITE_USE_LOCAL_API` is not `'false'`** → **local mode ON** (`local-api.ts` + `local-db.ts` + `localStorage`).
- Set **`VITE_USE_LOCAL_API=false`** to use MongoDB via the Backend.

### Frontend environment (`Frontend/.env`)

```env
VITE_USE_LOCAL_API=false
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Alternative with Vite proxy (see `Frontend/vite.config.ts`):

```env
VITE_USE_LOCAL_API=false
VITE_API_BASE_URL=/api/v1
```

Proxy maps `/api/v1` → `http://localhost:3000`.

### Backend environment

Copy `Backend/.env.example` → `Backend/.env`:

| Variable | Purpose |
|----------|---------|
| `PORT` | Default `3000` |
| `MONGODB_URI` | MongoDB connection (Atlas or local); often database name **`zentrosure`** |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Min 32 characters |
| `JWT_ACCESS_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` | e.g. `15m` / `7d` |
| `CORS_ORIGIN` | e.g. `http://localhost:5173` |
| `RATE_LIMIT_*` | Rate limiting window and max requests |
| `CLOUDINARY_*` | Optional image uploads |

**MongoDB URI tip:** Special characters in passwords (`#`, `@`, `:`, etc.) must be **URL-encoded** in the connection string (`#` → `%23`).

### Demo seed

```bash
cd Backend
npm run db:seed
```

| Field | Value |
|--------|--------|
| Tenant code | `DEMO-MOTORS` |
| Email | `rajesh@demomotors.com` |
| Password | `demo1234` |

---

## 4. Backend

### 4.1 Project structure

```text
Backend/
  src/
    index.ts              # start server, connect DB
    app.ts                # createApp(), mount /api/v1
    config/env.ts         # Zod-validated env
    lib/mongoose.ts       # connectDatabase
    lib/cloudinary.ts
    middleware/
      auth.ts             # JWT Bearer, load user + permissions
      tenant-isolation.ts # req.tenantId, tenantWhere()
      upload.ts           # multer
      error-handler.ts
    models/index.ts       # all Mongoose schemas
    modules/<name>/       # routes + service per domain
    types/enums.ts        # stages, statuses, customer types
    utils/numbering.ts, audit.ts, errors.ts
    scripts/seed.ts       # npm run db:seed
```

### 4.2 NPM scripts

| Command | Action |
|---------|--------|
| `npm run dev` | `tsx watch src/index.ts` |
| `npm run build` | `tsc` → `dist/` |
| `npm start` | `node dist/index.js` |
| `npm run db:seed` | Demo tenant, users, sample visit |

### 4.3 API modules (`/api/v1/...`)

| Mount | Responsibility |
|--------|----------------|
| `/auth` | Login, refresh, logout, me |
| `/dashboard` | KPIs, today's bookings, WIP, charts |
| `/customers` | List, get, create, patch |
| `/vehicles` | List, get, create, patch |
| `/bookings` | List/filter, get, create, patch, patch status |
| `/service-visits` | List by stage, WIP, CRUD, from-booking, pickup, advance-stage |
| `/approvals` | Phase 4 — approval queue, financial authorization, job-card authorize |
| `/payments` | Phase 4 — advances, receipts, verify/reverse |
| `/job-cards` | Phase 5 — queue, dashboard, create from visit, workspace, assignments, delivery plan, PDF; legacy list/get |
| `/parts` | List, stock, dashboard |
| `/bays` | Bay board |
| `/branches` | Branch list |
| `/users` | Users, technicians |
| `/masters` | Categories, dropdowns, CRUD master data |
| `/search` | Global search |
| `/tenant` | Tenant + branch profile |
| `/uploads` | Images, inspection photos on service visit |

### 4.4 Response shape

Success:

```json
{ "success": true, "data": { } }
```

Errors use `success: false` and `error: { code, message }` (see `error-handler.ts`). Frontend `lib/api.ts` expects this format.

### 4.5 Authentication & multi-tenancy

1. **Login:** `POST /api/v1/auth/login`  
   Body: `{ "tenantCode", "identifier", "password", "rememberMe?" }`  
   Returns: `accessToken`, `refreshToken`, `user` (tenant, branches, role, permissions).

2. **Authenticated requests:**  
   - Header: `Authorization: Bearer <accessToken>`  
   - Optional: `X-Branch-Id` for branch-scoped data

3. **Refresh:** `POST /api/v1/auth/refresh` with `{ "refreshToken" }`

4. **Tenant isolation:** Documents include `tenantId`; services use `req.tenantId` from JWT.

5. **RBAC:** Roles have `permissionCodes` (e.g. `bookings.create`, `service_visits.edit`). Seeded in `scripts/seed.ts`.

### 4.6 Data model (MongoDB)

| Entity | Purpose |
|--------|---------|
| Tenant | Workshop organization |
| Branch | Location per tenant |
| User, Role, Permission, RefreshToken | Auth |
| Customer, Vehicle | CRM |
| Booking | Appointment |
| ServiceVisit | Workflow, stages, pickup, inspection images |
| JobCard, JobWorkItem, WorkAssignment, WorkshopTeam, WorkshopLocation, LocationReservation | Phase 5 job card, work items, multi-team assignments, bays/extra-space |
| CustomerApproval, FinancialAuthorization, AdvancePayment, Receipt | Phase 4 approval & payment handoff |
| Bay | Workshop bay (also mirrored as `WorkshopLocation` type BAY) |
| Part, Warehouse, StockBalance | Inventory |
| MasterData | Dropdown config |
| NumberingSeries | Auto numbering |
| AuditLog, Media | Audit & uploads |

### 4.7 Service visit workflow

Stages (`Backend/src/types/enums.ts` — `SERVICE_STAGES`):

`BOOKING` → `PICKUP` → `ARRIVAL` → `INVENTORY` → `VOC` → `INSPECTION` → `DIAGNOSIS` → `ESTIMATE` → `APPROVAL` → `JOB_CARD` → `ASSIGNMENT` → `BAY` → `WIP` → `QC` → `ROAD_TEST` → `INVOICE` → `PAYMENT` → `GATEPASS` → `DELIVERY` → `FEEDBACK` → `PSF`

Backend `STAGE_UI_PATHS` maps stages to URL segments (e.g. `ARRIVAL` → `gate-in`).

**API flow:**

```text
POST /bookings
POST /service-visits/from-booking/:bookingId
GET/PATCH /service-visits/:id
PATCH /service-visits/:id/advance-stage
Pickup: assign, images, complete
GET /service-visits/wip
GET /service-visits?stage=...
GET /job-cards/by-visit/:visitId
POST /job-cards/from-visit/:visitId   (after Phase 4 authorization)
GET /job-cards/queue, /dashboard, /:id/workspace, /:id/pdf
```

**Phase 4 → 5 handoff:** A visit is job-card eligible when customer approval matches the frozen estimate revision, financial authorization is `AUTHORIZED` or `EXCEPTION_APPROVED`, and no active job card exists for that visit. Receipt is not required when policy/credit allows zero advance.

**Phase 5 UI:** `/app/workshop/job-cards` (queue + workspace). Legacy list: `/app/workshop/job-cards-legacy`. Details: `docs/PHASE4_APPROVALS.md`, `docs/PHASE5_JOB_CARDS.md`.

### 4.8 Security notes

- Tighten CORS in production (currently permissive in `app.ts`).
- Do not commit `.env`.
- Use strong JWT secrets in production.

---

## 5. Frontend

### 5.1 Project structure

```text
Frontend/
  src/
    App.tsx, main.tsx
    routes/index.tsx
    pages/public/, auth/, app/
    components/layout/, auth/, service-visit/, documents/, ui/
    lib/api.ts, auth-storage.ts, local-mode.ts, local-api.ts, local-db.ts
    lib/constants.ts, brand.ts, module-meta.ts, stage-paths.ts
    hooks/
  vite.config.ts
```

### 5.2 NPM scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Vite on port **5173** |
| `npm run build` | `tsc && vite build` |
| `npm run preview` | Preview production build |

### 5.3 Routing map

| Area | Path |
|------|------|
| Marketing | `/` |
| Login | `/login` |
| App (auth required) | `/app/*` |
| Dashboard | `/app/dashboard` |
| Service visit workspace | `/app/service-visits/:visitId/:stage` |
| Workshop | `/app/workshop/inspection` (VOC+trial+inspection), `/app/workshop/qc` (final QC+road test), wip, billing-delivery, … |
| Parts | `/app/parts/*` |
| Purchase | `/app/purchase/*` |
| Billing & delivery (primary) | `/app/workshop/billing-delivery` |
| Billing (legacy receipts) | `/app/billing/receipts`, `/app/billing/outstanding` |
| CRM | `/app/crm/*` |
| Reports / Masters / Admin / Settings | `/app/reports`, `/app/masters`, `/app/administration`, `/app/settings` |

Navigation: `Frontend/src/lib/constants.ts` (`SIDEBAR_NAV`). Unified workshop modules: see `docs/WORKSHOP_UNIFIED_MODULES.md`. Production deploy: see `docs/PRODUCTION_DEPLOYMENT.md`. QA audit pack: `docs/QA_MASTER_AUDIT.md`, `docs/QA_TEST_CASES.md`, `docs/QA_BUG_REPORT.md`, `docs/QA_E2E_EXECUTION_REPORT.md`, `docs/QA_PRODUCTION_READINESS.md`. Blocker closure: `docs/QA_FINAL_PRODUCTION_BLOCKERS.md`.

### 5.4 API client

`Frontend/src/lib/api.ts`:

- `api<T>()` — local vs remote
- `authApi`, `dashboardApi`, `customersApi`, `vehiclesApi`, `bookingsApi`, `serviceVisitsApi`, `jobCardsApi`, `partsApi`, `baysApi`, `branchesApi`, `usersApi`, `searchApi`, `mastersApi`, `tenantApi`
- `uploadImage`, `uploadInspectionPhotos`

Pass `branchId` from `authStorage.getBranchId()` for workshop operations.

### 5.5 Auth storage

`Frontend/src/lib/auth-storage.ts` — access/refresh tokens, user, selected branch.

---

## 6. User flows

### 6.1 Advisor / front office

```text
Login → CRM customers → vehicles → workshop bookings
→ Create service visit from booking
→ /app/service-visits/{id}/{stage} — advance workflow, photos
→ WIP / stage queues → job cards → print documents
```

### 6.2 Parts

```text
/app/parts/dashboard → master → stock
(Some requisition/issue routes are UI shells)
```

### 6.3 Masters & settings

```text
/app/masters — dropdown CRUD
/app/settings — org context
```

---

## 7. Relation to other repos in zentrorox

| Folder | Product |
|--------|---------|
| **Frontend + Backend** | ZENTROROX / ZentroSure workshop DMS |
| **create-space + Zentroverse-backend-final** | Zentroverse website, admin, HR, ZentroFlow, campaigns |

Use **different MongoDB database names** (`zentrosure` vs `zentroverse`) and **ports** (3000 vs 8787) when running both locally.

---

## 8. Adding new features

### Backend

1. Types/enums in `types/enums.ts` if needed  
2. Schema in `models/index.ts`  
3. `modules/<feature>/<feature>.service.ts` + `.routes.ts`  
4. Register in `app.ts` under `/api/v1`  
5. `authenticate` + tenant scoping on all queries  
6. Optional seed in `scripts/seed.ts`

### Frontend

1. Route in `routes/index.tsx`  
2. Nav in `lib/constants.ts`  
3. API methods in `lib/api.ts` (or new `lib/*-api.ts`)  
4. Page under `pages/app/`  
5. Extend `local-api.ts` / `local-db.ts` if local mode must work  
6. `VITE_USE_LOCAL_API=false` for integration testing

---

## 9. Run locally (full stack)

**Terminal 1 — Backend:**

```bash
cd Backend
cp .env.example .env
# Edit MONGODB_URI and JWT secrets
npm install
npm run db:seed
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd Frontend
# Create .env with VITE_USE_LOCAL_API=false and VITE_API_BASE_URL
npm install
npm run dev
```

Open `http://localhost:5173/login` and sign in with seed credentials.

---

## 10. Maturity notes

| Maturity | Areas |
|----------|--------|
| **Strong / API-backed** | Auth, dashboard, customers, vehicles, bookings, service visits (stages, pickup, WIP), Phase 4 approvals/payments, Phase 5 job cards, Phase 6 WIP/parts ledger, Phase 7 QC, **Phase 8 billing-delivery** (invoice, payments, gate pass, delivery, feedback APIs), parts/stock/dashboard, bays, masters, search, uploads (with Cloudinary) |
| **UI-first / partial API** | Many purchase routes; legacy billing receipts/outstanding screens; e-invoice, full parts-to-invoice reconciliation, repair PDF annexure |
| **Default UX** | Local mode without backend — good for UI demos |

---

## Quick reference

| Item | Value |
|------|--------|
| Backend health | `GET /health` |
| API prefix | `/api/v1` |
| Frontend dev port | `5173` |
| Backend dev port | `3000` |
| Seed tenant | `DEMO-MOTORS` |
| Seed user | `rajesh@demomotors.com` / `demo1234` |

---

*For Zentroverse (marketing site) documentation, see separate docs for `create-space` and `Zentroverse-backend-final`.*
