# Frontend ↔ Backend Interconnection

How the Zentroverse React frontend connects to the Node.js API — **current wired endpoints** and binding steps.

> Full backend build spec (for ChatGPT ZIP): see **`BACKEND_PROJECT_SPEC.md`**

---

## 1. Connect frontend to backend

```env
# Frontend .env (production)
VITE_API_BASE_URL=https://api.zentroverse.com

# Dev: leave empty → Vite proxies /api → localhost:8787
# Run both: npm run dev:all
```

**API helper:** `src/config/api.ts` → `apiUrl("/api/...")`

---

## 2. Environment variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `VITE_API_BASE_URL` | Frontend | API origin |
| `ADMIN_PANEL_TOKEN` | Backend | Must match `src/lib/admin/auth.ts` → `ADMIN_TOKEN` |
| `MONGODB_URI` | Backend | MongoDB (production) |
| `CLOUDINARY_*` | Backend | Admin media uploads |
| `RAZORPAY_*` | Backend | Payment checkout |
| `VITE_WHATSAPP_NUMBER` | Frontend | Fallback if CMS not loaded |
| `VITE_CONTACT_PHONE` | Frontend | Fallback if CMS not loaded |

---

## 3. API endpoints (must implement on backend)

### Public (no auth)

| Method | Path | Frontend consumer |
|--------|------|-------------------|
| GET | `/health` | Health checks |
| GET | `/api/cms` | `CmsContext`, homepage, footer, gallery |
| GET | `/api/plans` | `/pricing`, register plan picker, automation pricing |
| POST | `/api/leads` | All contact/audit/calculator forms |
| POST | `/api/razorpay/create-order` | Register checkout (`planId` = plan **slug**) |
| POST | `/api/razorpay/verify-payment` | Register checkout |
| POST | `/api/plans/trial/start` | Register “Start free trial” |

### Admin (`x-admin-token` header)

| Method | Path | Frontend consumer |
|--------|------|-------------------|
| GET | `/api/leads` | `/admin/leads` (Enquiries) |
| POST | `/api/leads/update` | AdminLeads status/notes |
| POST | `/api/leads/delete` | AdminLeads delete |
| PUT | `/api/cms` | `/admin/content` Save all |
| PUT | `/api/plans/catalog` | `/admin/content/plans` Save & publish |
| POST | `/api/plans` | `/admin/content/plans` Add plan |
| PUT | `/api/plans/:id` | `/admin/content/plans` Update plan |
| DELETE | `/api/plans/:id` | `/admin/content/plans` Delete plan |
| PUT | `/api/plans/trial` | `/admin/content/plans` Free trial settings |
| POST | `/api/media/upload` | AdminContent Cloudinary upload |
| GET | `/api/media/status` | AdminContent upload status |

---

## 4. Admin panel routes

| Admin page | Path | Backend |
|------------|------|---------|
| Dashboard | `/admin` | `GET /api/leads` |
| Enquiries | `/admin/leads` | `GET/POST /api/leads/*` |
| Content CMS | `/admin/content` | `GET/PUT /api/cms`, `POST /api/media/upload` |
| Pricing plans | `/admin/content/plans` | `GET/PUT /api/plans*`, `DELETE /api/plans/:id` |
| Growth Hub | `/admin/growth-hub` | `GET /api/leads` (filtered) |
| Customers | `/admin/customers` | localStorage (Phase 2) |
| Quotations/Invoices | `/admin/*` | localStorage (Phase 2) |
| Settings | `/admin/settings` | localStorage (Phase 2) |

**Admin auth (demo):** `sessionStorage` login + `x-admin-token: ZV-ADMIN-2026-DEMO`

---

## 5. Forms → POST `/api/leads`

| Form | Component | `form_type` |
|------|-----------|-------------|
| Contact | `ContactLeadCapture` | `contact` |
| Free audit | `FreeAuditSection` | `audit` |
| Calculators | `CalculatorsSection` | `calculator` |
| Solution lead | `SolutionLeadForm` | `solution` |
| Growth Hub | `LeadReportGate` | `growth-hub` |

**Client:** `src/lib/leadsApi.ts` → `submitLead()`

---

## 6. CMS → website rendering

| CMS field | Renders in |
|-----------|------------|
| `hero`, `meta` | HeroBanner, Index SeoHead |
| `company` | Footer, WhatsApp, header contact |
| `caseStudies` | OurWork |
| `testimonials` | ClientSuccessStories |
| `gallery` | Gallery |
| `productDemos` | ProductDemosSection |
| `faqs` | FaqSection |

**Load flow:**
```
App mount → CmsProvider → GET /api/cms → cache localStorage → components use useCms()
Admin save → PUT /api/cms → refresh cache
```

**Types:** `src/lib/cms/types.ts`  
**API client:** `src/lib/cms/cmsApi.ts`

---

## 6b. Pricing plans → `/pricing`

Admin CRUD at `/admin/content/plans` is the source of truth. Public pages read `GET /api/plans`.

| Field | Renders in |
|-------|------------|
| `trial` | Free-trial banner on `/pricing`, `/automation#pricing`, post-register picker |
| `plans[]` | Basic/Pro Monthly/Yearly cards — features tagged **included** vs **addon** |

**Auth:** Public GET. Admin writes use `Authorization: Bearer <admin token>` (same as CMS).

**Register `planId`:** send plan **slug** (`basic-monthly`, `basic-yearly`, `pro-monthly`, `pro-yearly`) to Razorpay create-order. Amounts must come from the Plan document, not a hardcoded map.

**Client:** `src/lib/plans/plansApi.ts` · **Hook:** `src/hooks/usePricingPlans.ts`

---

## 7. Media upload flow

```
Admin picks file → base64 in browser
  → POST /api/media/upload { file, folder, resourceType }
  → Backend signs Cloudinary upload
  → Returns { url, publicId }
  → Admin saves URL in CMS field
  → PUT /api/cms
  → Website renders image/video from Cloudinary URL
```

---

## 8. Binding checklist

- [ ] Backend running on port 8787 (or deployed URL)
- [ ] MongoDB connected (or file stub for dev)
- [ ] `ADMIN_PANEL_TOKEN` matches frontend
- [ ] `CLOUDINARY_*` set for uploads
- [ ] `VITE_API_BASE_URL` set on frontend build
- [ ] CORS allows frontend domain
- [ ] Test: submit contact form → appears in `/admin/leads`
- [ ] Test: save CMS in admin → homepage updates after refresh
- [ ] Test: save plans in `/admin/content/plans` → `/pricing` updates
- [ ] Test: start free trial after register
- [ ] Test: upload gallery image → shows on homepage Gallery

---

## 9. Dev commands

```bash
# Frontend repo root
npm run dev:all          # API + Vite together
npm run dev:api          # API only (port 8787)
npm run dev              # Frontend only (port 5173)
```

---

*See `BACKEND_PROJECT_SPEC.md` for complete schemas, Mongoose models, and ChatGPT prompt.*
