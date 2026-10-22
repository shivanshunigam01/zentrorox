# Zentroverse Backend — Full Project Spec (ChatGPT / ZIP Ready)

Use this document to generate a **standalone Node.js + Express + MongoDB backend** as a ZIP project. The React frontend (`create-space`) already calls these endpoints — implement them exactly so you can bind with one env variable.

---

## Copy-paste prompt for ChatGPT

```
Create a complete Node.js + Express + MongoDB backend project for Zentroverse website.

Requirements:
- ES modules ("type": "module" in package.json)
- Express, mongoose, cors, dotenv, crypto (built-in)
- Optional: razorpay npm package for payments
- Cloudinary signed uploads (fetch API, no cloudinary SDK required)
- Admin auth via header: x-admin-token (matches ADMIN_PANEL_TOKEN env)
- MongoDB for: leads, CMS content (single document), optional admin users later
- File structure as specified in BACKEND_PROJECT_SPEC.md
- Include: package.json, .env.example, README.md, src/server.js, src/app.js, all routes/controllers/models
- Seed default CMS document on first boot (hero, company, case studies, FAQs from spec)
- CORS enabled for frontend origin
- Port 8787 default
- All API request/response shapes must match the spec exactly

Deliver as a ZIP-ready project with npm run dev script.
```

---

## Quick start (after you generate the backend)

```bash
# Backend repo
cp .env.example .env
# Fill MONGODB_URI, ADMIN_PANEL_TOKEN, CLOUDINARY_*, RAZORPAY_*
npm install
npm run dev

# Frontend repo (create-space)
# In .env:
VITE_API_BASE_URL=http://localhost:8787
npm run dev
```

Production: deploy backend → set `VITE_API_BASE_URL=https://api.zentroverse.com` on frontend host.

---

## Environment variables

```env
# Server
PORT=8787
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,https://zentroverse.com

# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/zentroverse

# Admin API (must match frontend src/lib/admin/auth.ts ADMIN_TOKEN)
ADMIN_PANEL_TOKEN=ZV-ADMIN-2026-DEMO

# Cloudinary (media uploads from admin CMS)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_FOLDER=zentroverse

# Razorpay (optional — subscription checkout)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Lead notifications (optional)
LEAD_WEBHOOK_URL=
WHATSAPP_NOTIFY_URL=
ADMIN_NOTIFY_EMAIL=digital@zentroverse.com

# JWT (future admin login — optional for v1)
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=7d
```

---

## Recommended project structure

```
zentroverse-backend/
├── package.json
├── .env.example
├── README.md
└── src/
    ├── server.js              # listen(PORT)
    ├── app.js                 # express app, middleware, routes
    ├── config/
    │   ├── db.js              # mongoose.connect
    │   └── env.js             # validated env exports
    ├── middleware/
    │   ├── requireAdmin.js    # x-admin-token check
    │   └── errorHandler.js
    ├── models/
    │   ├── Lead.js
    │   └── Cms.js             # single document collection
    ├── controllers/
    │   ├── lead.controller.js
    │   ├── cms.controller.js
    │   ├── media.controller.js
    │   └── razorpay.controller.js
    ├── routes/
    │   ├── lead.routes.js
    │   ├── cms.routes.js
    │   ├── media.routes.js
    │   └── razorpay.routes.js
    ├── services/
    │   ├── cloudinary.service.js
    │   └── notify.service.js
    └── seed/
        └── cmsDefaults.js     # default CMS JSON
```

---

## Authentication

**v1 (current frontend):** Static admin token in header.

```
x-admin-token: ZV-ADMIN-2026-DEMO
```

Required on all admin routes: `GET /api/leads`, `POST /api/leads/update`, `POST /api/leads/delete`, `PUT /api/cms`, `POST /api/media/upload`, `GET /api/media/status`.

**v2 (optional later):** JWT from `POST /api/auth/login` — not required for frontend to work today.

---

## API endpoints (implement all of these)

### Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | Public | Service status |

**Response 200:**
```json
{
  "ok": true,
  "service": "zentroverse-api",
  "leads": true,
  "cms": true,
  "cloudinary": true,
  "mongo": { "configured": true, "readyState": 1 }
}
```

---

### Enquiries / Leads

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/leads` | Public | Submit enquiry from website forms |
| GET | `/api/leads` | Admin | List all enquiries (newest first) |
| POST | `/api/leads/update` | Admin | Update status or admin notes |
| POST | `/api/leads/delete` | Admin | Delete enquiry |

#### POST `/api/leads` — Request body

```json
{
  "name": "Rajesh Kumar",
  "phone": "+919876543210",
  "email": "rajesh@company.com",
  "city": "Patna",
  "business_type": "Automotive Dealer",
  "product_interest": "ZentroBOT",
  "message": "Need WhatsApp automation",
  "source": "website",
  "form_type": "contact",
  "audit_type": null,
  "calculator_type": null,
  "company_name": "ABC Motors",
  "tool_id": null,
  "score": null,
  "report_summary": null,
  "report_data": null
}
```

**Required:** `name`, `phone`, `email`  
**Response 201:**
```json
{
  "ok": true,
  "lead": { "...Lead object..." }
}
```

#### `form_type` values used by frontend

| form_type | Source component |
|-----------|------------------|
| `contact` | ContactLeadCapture, Contact page |
| `audit` | FreeAuditSection |
| `calculator` | CalculatorsSection |
| `solution` | SolutionLeadForm, ResourcesPage |
| `growth-hub` | LeadReportGate (Growth Hub tools) |

#### Lead object shape

```json
{
  "id": "uuid",
  "name": "string",
  "phone": "string",
  "email": "string",
  "city": "string | null",
  "business_type": "string | null",
  "product_interest": "string | null",
  "message": "string | null",
  "source": "website",
  "form_type": "contact | audit | calculator | solution | growth-hub | null",
  "audit_type": "string | null",
  "calculator_type": "string | null",
  "company_name": "string | null",
  "tool_id": "string | null",
  "score": "number | null",
  "report_summary": "string | null",
  "report_data": "string | null",
  "status": "new | contacted | qualified | won | lost",
  "admin_notes": "string | null",
  "created_at": "ISO8601",
  "updated_at": "ISO8601"
}
```

#### POST `/api/leads/update`

```json
{ "id": "uuid", "status": "contacted", "admin_notes": "Called back" }
```

#### POST `/api/leads/delete`

```json
{ "id": "uuid" }
```

---

### CMS (website content)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/cms` | Public | Full CMS document for website |
| PUT | `/api/cms` | Admin | Replace/save entire CMS document |

**Response GET `/api/cms`:**
```json
{ "cms": { "...CmsContent..." } }
```

**Request PUT `/api/cms`:** Full `CmsContent` JSON body (see schema below).

**Response PUT:**
```json
{ "ok": true, "cms": { "...saved document with updatedAt..." } }
```

Store as **one MongoDB document** (`Cms.findOne()` / upsert). On first boot, seed from `cmsDefaults.js` if empty.

---

### Pricing plans (catalog + CRUD)

Frontend: `/pricing`, `/admin/content/plans`, register plan picker. Client: `src/lib/plans/plansApi.ts`.

**Auth:** `GET /api/plans` is public. All writes and `DELETE` require admin `Authorization: Bearer <token>` (same middleware as CMS).

**Route order:** register `/catalog`, `/trial`, `/trial/start` **before** `/:id`.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/plans` | Public | Catalog `{ trial, plans, updatedAt }` |
| PUT | `/api/plans/catalog` | Admin | Replace entire catalog |
| POST | `/api/plans` | Admin | Create one plan (body = `PricingPlan`) |
| GET | `/api/plans/:id` | Public | One plan by Mongo `_id` or `slug` |
| PUT | `/api/plans/:id` | Admin | Update one plan |
| DELETE | `/api/plans/:id` | Admin | Delete one plan |
| PUT | `/api/plans/trial` | Admin | Update free-trial settings only |
| POST | `/api/plans/trial/start` | Public | Start trial for `{ email, planSlug? }` |

**GET `/api/plans` response:**
```json
{
  "trial": {
    "enabled": true,
    "days": 14,
    "title": "14-day free trial",
    "blurb": "Try Basic features with no credit card.",
    "cta": "Start free trial",
    "features": ["Full Basic plan access for 14 days"]
  },
  "plans": [ { "...PricingPlan..." } ],
  "updatedAt": "2026-08-18T12:00:00.000Z"
}
```

**`PricingPlan` schema (exact frontend shape):**
```javascript
{
  id: String,                 // uuid — also store as Mongo id string on create if missing
  slug: String,               // unique, used as Razorpay planId: basic-monthly | basic-yearly | pro-monthly | pro-yearly
  name: String,               // "Basic Monthly"
  tier: "basic" | "pro",
  billingCycle: "monthly" | "yearly",
  priceLabel: String,         // "₹4,999"
  periodLabel: String,        // "/month" | "/year"
  amountInPaise: Number | null, // integer paise; null = custom; 0 = free
  blurb: String,
  cta: String,
  highlighted: Boolean,
  isActive: Boolean,
  sortOrder: Number,
  trialDays: Number,          // complimentary days bundled with paid plan
  features: [{
    id: String,
    label: String,
    kind: "included" | "addon",  // included = part of plan; addon = additional
    extraLabel: String           // optional, e.g. "Additional"
  }]
}
```

**Seed four plans** if collection empty: `basic-monthly` (₹4,999 / 499900), `basic-yearly` (₹49,990 / 4999000), `pro-monthly` (₹12,999 / 1299900), `pro-yearly` (₹1,29,990 / 12999000). Copy feature lists from frontend `src/data/pricingPlans.ts`.

**POST `/api/plans/trial/start` body:** `{ "email": "user@example.com", "planSlug": "basic-monthly" }`

**Response:** `{ "ok": true, "trial": { "planSlug": "basic-monthly", "days": 14, "startsAt": "...", "endsAt": "..." } }`

Persist on the User: `subscriptionPlan: "free-trial"`, `trialEndsAt`. Reject if user already used a trial. 400 if trial disabled.

**Razorpay:** `POST /api/razorpay/create-order` must load the plan by **slug**, require `isActive` and `amountInPaise > 0`, and charge **that** paise amount. Do not trust a client-sent amount. Update `PLAN_AMOUNTS_PAISE` to a DB lookup (keep a fallback map of the four slugs).

---

### CMS content schema (`CmsContent`)

This is the exact shape the frontend expects (`src/lib/cms/types.ts`).

```typescript
type CmsContent = {
  hero: {
    headline: string;
    tagline: string;
    subheadline: string;
  };
  meta: {
    title: string;
    description: string;
  };
  company: {
    legalName: string;
    tagline: string;
    address: string;           // multiline OK
    gstin: string;
    email: string;
    website: string;
    phone: string;             // display format e.g. "+91 98765 43210"
    whatsappNumber: string;    // digits only, country code, no +
    whatsappMessage: string;
    hours: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifsc: string;
    upi: string;
    social: Array<{
      platform: "linkedin" | "instagram" | "twitter" | "facebook" | "youtube";
      url: string;
    }>;
  };
  galleryCategories: string[];
  caseStudies: Array<{
    id: string;
    title: string;
    problem: string;
    solution: string;
    outcome: string;
    tags: string[];
    imageUrl?: string;
    imagePublicId?: string;
  }>;
  testimonials: Array<{
    id: string;
    quote: string;
    name: string;
    company: string;
    designation: string;
    rating: number;            // 1-5
    mediaType: "video" | "image";
    videoUrl?: string;
    thumbnailUrl?: string;
  }>;
  gallery: Array<{
    id: string;
    category: string;
    mediaType: "image" | "video";
    url: string;
    publicId?: string;
    caption?: string;
    alt?: string;
  }>;
  productDemos: Array<{
    id: string;
    title: string;
    product?: string;
    mediaType: "image" | "video";
    url: string;
    publicId?: string;
    caption?: string;
  }>;
  faqs: Array<{ question: string; answer: string }>;
  updatedAt?: string | null;   // ISO8601, set by server on save
};
```

#### What renders where on the website

| CMS field | Frontend component |
|-----------|-------------------|
| `hero`, `meta` | HeroBanner, SeoHead (homepage) |
| `company` | Footer, HeaderContactButtons, WhatsAppButton, ContactLeadCapture |
| `caseStudies` | OurWork (Case Studies section) |
| `testimonials` | ClientSuccessStories |
| `gallery`, `galleryCategories` | Gallery section |
| `productDemos` | ProductDemosSection |
| `faqs` | FaqSection |

---

### Media upload (Cloudinary)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/media/upload` | Admin | Upload image/video to Cloudinary |
| GET | `/api/media/status` | Admin | Check if Cloudinary env is set |

#### POST `/api/media/upload`

```json
{
  "file": "data:image/jpeg;base64,/9j/4AAQ... OR https://example.com/image.jpg",
  "folder": "zentroverse/gallery",
  "resourceType": "auto"
}
```

`resourceType`: `"auto"` | `"image"` | `"video"`

**Response 200:**
```json
{
  "ok": true,
  "url": "https://res.cloudinary.com/.../secure_url",
  "publicId": "zentroverse/gallery/abc123",
  "resourceType": "image",
  "format": "jpg",
  "width": 1920,
  "height": 1080
}
```

**503** if Cloudinary env vars missing.

#### Cloudinary signed upload (server-side)

```javascript
import crypto from "node:crypto";

export async function uploadToCloudinary({ file, folder, resourceType = "auto" }) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !apiKey || !secret) throw new Error("Cloudinary is not configured");

  const timestamp = Math.round(Date.now() / 1000);
  const params = { folder, timestamp };
  const toSign = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join("&");
  const signature = crypto.createHash("sha1").update(`${toSign}${secret}`).digest("hex");

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);
  form.append("folder", folder);

  const endpoint = resourceType === "auto"
    ? `https://api.cloudinary.com/v1_1/${cloud}/auto/upload`
    : `https://api.cloudinary.com/v1_1/${cloud}/${resourceType}/upload`;

  const res = await fetch(endpoint, { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message ?? "Upload failed");
  return {
    url: data.secure_url,
    publicId: data.public_id,
    resourceType: data.resource_type,
    format: data.format,
    width: data.width,
    height: data.height,
  };
}
```

#### GET `/api/media/status`

```json
{ "configured": true }
```

---

### Razorpay (optional)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/razorpay/create-order` | Public | Create payment order |
| POST | `/api/razorpay/verify-payment` | Public | Verify payment signature |

#### Plan amounts (paise) — source of truth is Plan documents

`create-order` looks up `slug` in the pricing catalog. Fallback map if DB empty:

| planId (slug) | Amount (INR) | Paise |
|---------------|--------------|-------|
| basic-monthly | ₹4,999 | 499900 |
| basic-yearly | ₹49,990 | 4999000 |
| pro-monthly | ₹12,999 | 1299900 |
| pro-yearly | ₹1,29,990 | 12999000 |

`free-trial` and any plan with `amountInPaise` null/0 **must** be rejected by `create-order` with **400**.

#### POST `/api/razorpay/create-order`

```json
{ "planId": "basic-monthly", "email": "user@example.com" }
```

**Response:**
```json
{
  "orderId": "order_xxx",
  "amount": 499900,
  "currency": "INR",
  "keyId": "rzp_live_xxx"
}
```

#### POST `/api/razorpay/verify-payment`

```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "hex_hmac"
}
```

**Response:** `{ "ok": true }` or `{ "ok": false, "error": "..." }`

Verify: `HMAC-SHA256(order_id|payment_id, RAZORPAY_KEY_SECRET) === signature`

---

## MongoDB schemas (Mongoose)

### Lead model

```javascript
import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  city: String,
  business_type: String,
  product_interest: String,
  message: String,
  source: { type: String, default: "website" },
  form_type: String,
  audit_type: String,
  calculator_type: String,
  company_name: String,
  tool_id: String,
  score: Number,
  report_summary: String,
  report_data: String,
  status: {
    type: String,
    enum: ["new", "contacted", "qualified", "won", "lost"],
    default: "new",
  },
  admin_notes: String,
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

// Transform _id → id in JSON
leadSchema.set("toJSON", {
  virtuals: true,
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Lead", leadSchema);
```

### CMS model (single document)

```javascript
import mongoose from "mongoose";

const cmsSchema = new mongoose.Schema({
  slug: { type: String, default: "main", unique: true },
  payload: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Cms", cmsSchema);

// Usage:
// GET: const doc = await Cms.findOne({ slug: "main" }); return doc?.payload;
// PUT: await Cms.findOneAndUpdate({ slug: "main" }, { payload: body, updatedAt: new Date() }, { upsert: true });
```

---

## Starter `package.json`

```json
{
  "name": "zentroverse-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "mongoose": "^8.9.0",
    "razorpay": "^2.9.6"
  }
}
```

---

## Starter `src/app.js` (route wiring)

```javascript
import express from "express";
import cors from "cors";
import leadRoutes from "./routes/lead.routes.js";
import cmsRoutes from "./routes/cms.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import razorpayRoutes from "./routes/razorpay.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { isCloudinaryConfigured } from "./services/cloudinary.service.js";

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true }));
app.use(express.json({ limit: "25mb" })); // base64 uploads

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "zentroverse-api",
    leads: true,
    cms: true,
    cloudinary: isCloudinaryConfigured(),
    mongo: {
      configured: Boolean(process.env.MONGODB_URI),
      readyState: mongoose.connection.readyState,
    },
  });
});

app.use("/api/leads", leadRoutes);
app.use("/api/cms", cmsRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/razorpay", razorpayRoutes);

app.use(errorHandler);
export default app;
```

---

## Frontend binding checklist

After backend is deployed, set on frontend (`.env` or hosting env):

```env
VITE_API_BASE_URL=https://your-api-domain.com
```

| Frontend file | Calls |
|---------------|-------|
| `src/lib/leadsApi.ts` | `POST /api/leads` |
| `src/lib/admin/leadsApi.ts` | `GET/POST /api/leads/*` + `x-admin-token` |
| `src/lib/cms/cmsApi.ts` | `GET/PUT /api/cms`, `POST /api/media/upload` |
| `src/lib/plans/plansApi.ts` | `GET/PUT /api/plans*`, `DELETE /api/plans/:id` |
| `src/contexts/CmsContext.tsx` | `GET /api/cms` on load |
| `src/pages/admin/AdminContent.tsx` | `PUT /api/cms`, media upload |
| `src/config/api.ts` | `apiUrl()` helper |

**Admin token** in frontend (`src/lib/admin/auth.ts`):
```javascript
export const ADMIN_TOKEN = "ZV-ADMIN-2026-DEMO";
```
Must match backend `ADMIN_PANEL_TOKEN`.

**Vite dev proxy** (if `VITE_API_BASE_URL` is empty): proxy `/api` and `/health` → `http://localhost:8787`.

---

## Lead notification (optional)

On `POST /api/leads` success, fire webhook:

```javascript
if (process.env.LEAD_WEBHOOK_URL) {
  fetch(process.env.LEAD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: "new_lead",
      lead,
      notifyEmail: process.env.ADMIN_NOTIFY_EMAIL,
    }),
  }).catch(console.error);
}
```

---

## Error responses

All errors should return:

```json
{ "error": "Human readable message" }
```

| Status | When |
|--------|------|
| 400 | Validation failed |
| 401 | Missing/wrong `x-admin-token` |
| 404 | Resource not found |
| 503 | Cloudinary/Razorpay not configured |
| 500 | Server error |

---

## Testing with curl

```bash
# Health
curl http://localhost:8787/health

# Get CMS
curl http://localhost:8787/api/cms

# Submit enquiry
curl -X POST http://localhost:8787/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"919973045587","email":"test@test.com","form_type":"contact"}'

# List enquiries (admin)
curl http://localhost:8787/api/leads -H "x-admin-token: ZV-ADMIN-2026-DEMO"

# Save CMS (admin)
curl -X PUT http://localhost:8787/api/cms \
  -H "Content-Type: application/json" \
  -H "x-admin-token: ZV-ADMIN-2026-DEMO" \
  -d @cms-payload.json
```

---

## Phase 2 endpoints (not wired in frontend yet)

Implement later when you migrate admin off localStorage:

| Method | Path | Purpose |
|--------|------|---------|
| GET/PATCH | `/api/settings/company` | Invoice PDF company settings |
| CRUD | `/api/customers` | Admin customers |
| CRUD | `/api/quotations` | Admin quotations |
| CRUD | `/api/invoices` | Admin invoices |
| POST | `/api/auth/login` | JWT admin login |

---

## Reference: current stub in frontend repo

The frontend repo includes a working file-based stub at `server/index.mjs` you can compare against:
- `server/leadsStore.mjs` — lead CRUD
- `server/cmsStore.mjs` — CMS read/write
- `server/cloudinary.mjs` — upload logic
- `server/cmsDefaults.mjs` — default CMS seed

Use that as the **source of truth** for response shapes until MongoDB backend is live.

---

## Deployment notes

1. Deploy backend (Railway, Render, VPS, etc.) with MongoDB Atlas URI.
2. Set all env vars on backend host.
3. Set `VITE_API_BASE_URL` on frontend build (Vercel/Netlify).
4. Enable CORS for `https://zentroverse.com`.
5. Change `ADMIN_PANEL_TOKEN` in production (update frontend build too).
6. Add Cloudinary credentials for admin media uploads.

---

*Generated for Zentroverse Global — matches frontend `create-space` as of CMS + Cloudinary integration.*
