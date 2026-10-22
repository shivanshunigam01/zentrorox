# Zentroverse Backend API Documentation

Node.js + Express.js + MongoDB backend specification for the Zentroverse website and admin panel.

> **Current state:** The frontend ships with a lightweight Node API in `server/index.mjs` (file-based lead storage). This document describes the **target MongoDB backend** to implement separately or migrate to.

---

## Backend Project Structure

```
server/
  src/
    config/
      db.js
      env.js
    controllers/
      auth.controller.js
      lead.controller.js
      audit.controller.js
      calculator.controller.js
      blog.controller.js
      faq.controller.js
      testimonial.controller.js
      caseStudy.controller.js
      gallery.controller.js
      solution.controller.js
      industry.controller.js
      setting.controller.js
    models/
      User.js
      Lead.js
      AuditRequest.js
      CalculatorLead.js
      Blog.js
      FAQ.js
      Testimonial.js
      CaseStudy.js
      Gallery.js
      Solution.js
      Industry.js
      Setting.js
    routes/
      auth.routes.js
      lead.routes.js
      audit.routes.js
      calculator.routes.js
      blog.routes.js
      faq.routes.js
      testimonial.routes.js
      caseStudy.routes.js
      gallery.routes.js
      solution.routes.js
      industry.routes.js
      setting.routes.js
    middleware/
      auth.middleware.js
      error.middleware.js
      validate.middleware.js
    utils/
      sendEmail.js
      sendWhatsApp.js
      apiResponse.js
  app.js
  server.js
  package.json
  .env.example
```

---

## Environment Variables

```env
PORT=8787
MONGODB_URI=mongodb://127.0.0.1:27017/zentroverse
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=7d
ADMIN_PANEL_TOKEN=ZV-ADMIN-2026-DEMO
CORS_ORIGIN=http://localhost:5173
LEAD_WEBHOOK_URL=
WHATSAPP_NOTIFY_URL=
ADMIN_NOTIFY_EMAIL=digital@zentroverse.com
```

Frontend uses `VITE_API_BASE_URL` (empty in dev → Vite proxy to `/api`).

---

## Standard Response Format

### Success

```json
{
  "ok": true,
  "data": {}
}
```

### Error

```json
{
  "ok": false,
  "error": "Human-readable message",
  "code": "VALIDATION_ERROR"
}
```

HTTP status: `400` validation, `401` unauthorized, `404` not found, `500` server error.

---

## Authentication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | Public | Admin login |
| GET | `/api/auth/me` | Admin JWT | Current admin user |

### POST `/api/auth/login`

**Request**

```json
{
  "email": "admin@zentroverse.in",
  "password": "Zentro@2026"
}
```

**Response `200`**

```json
{
  "ok": true,
  "data": {
    "token": "jwt-token",
    "user": { "id": "...", "email": "admin@zentroverse.in", "role": "admin" }
  }
}
```

**Validation:** email required, password min 6 chars.

### GET `/api/auth/me`

**Headers:** `Authorization: Bearer <token>`

---

## Leads

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/leads` | Public |
| GET | `/api/leads` | Admin |
| GET | `/api/leads/:id` | Admin |
| PATCH | `/api/leads/:id/status` | Admin |
| DELETE | `/api/leads/:id` | Admin |

### POST `/api/leads`

**Request**

```json
{
  "name": "Rajesh Kumar",
  "phone": "9876543210",
  "email": "rajesh@example.com",
  "city": "Patna",
  "business_type": "Automotive Dealer",
  "product_interest": "ZentroFLOW",
  "message": "Need CRM demo",
  "source": "website",
  "form_type": "contact",
  "audit_type": null,
  "calculator_type": null,
  "company_name": null,
  "tool_id": null,
  "score": null,
  "report_summary": null,
  "report_data": null
}
```

**Validation:** `name`, `phone`, `email` required. Email format valid.

**Response `201`**

```json
{ "ok": true, "data": { "lead": { "id": "...", "status": "new", "created_at": "..." } } }
```

### GET `/api/leads`

Query: `search`, `status`, `form_type`, `from`, `to`, `page`, `limit`

### PATCH `/api/leads/:id/status`

```json
{ "status": "contacted", "admin_notes": "Called back" }
```

Status enum: `new` | `contacted` | `qualified` | `won` | `lost`

---

## Audit Requests

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/audits` | Public |
| GET | `/api/audits` | Admin |
| GET | `/api/audits/:id` | Admin |
| PATCH | `/api/audits/:id/status` | Admin |

### POST `/api/audits`

```json
{
  "name": "Amit",
  "phone": "9876543210",
  "email": "amit@example.com",
  "audit_type": "business-growth",
  "company_name": "ABC Motors",
  "message": "Need full audit"
}
```

---

## Calculator Leads

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/calculators/submit` | Public |
| GET | `/api/calculators/leads` | Admin |
| GET | `/api/calculators/leads/:id` | Admin |

### POST `/api/calculators/submit`

```json
{
  "name": "Priya",
  "phone": "9876543210",
  "email": "priya@example.com",
  "calculator_type": "marketing-roi",
  "report_summary": "ROI: 300% on ₹50,000 spend",
  "report_data": { "spend": 50000, "revenue": 200000 }
}
```

Can also use `POST /api/leads` with `form_type: "calculator"` (current frontend pattern).

---

## Blogs

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/blogs` | Admin |
| GET | `/api/blogs` | Public |
| GET | `/api/blogs/:slug` | Public |
| PATCH | `/api/blogs/:id` | Admin |
| DELETE | `/api/blogs/:id` | Admin |

### Blog model fields

`title`, `slug`, `category`, `excerpt`, `body`, `metaDescription`, `datePublished`, `published`

---

## FAQs, Testimonials, Case Studies, Gallery, Solutions, Industries

CRUD pattern for each:

- **Public:** `GET` list, `GET` by slug/id
- **Admin:** `POST`, `PATCH`, `DELETE`

### Settings

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/settings` | Public (limited) / Admin (full) |
| PATCH | `/api/settings` | Admin |

Settings include: company info, GSTIN, WhatsApp number, meta title/description, logo URL, default GST %.

---

## Starter Code Examples

### `server.js`

```javascript
import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

const PORT = process.env.PORT || 8787;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`API running on :${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed", err);
    process.exit(1);
  });
```

### `src/app.js`

```javascript
import express from "express";
import cors from "cors";
import leadRoutes from "./routes/lead.routes.js";
import authRoutes from "./routes/auth.routes.js";
import calculatorRoutes from "./routes/calculator.routes.js";
import settingRoutes from "./routes/setting.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "zentroverse-api", mongo: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/calculators", calculatorRoutes);
app.use("/api/settings", settingRoutes);

app.use(errorHandler);

export default app;
```

### `src/config/db.js`

```javascript
import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log("MongoDB connected");
}
```

### `src/middleware/auth.middleware.js`

```javascript
import jwt from "jsonwebtoken";

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const legacy = req.headers["x-admin-token"];

  if (legacy && legacy === process.env.ADMIN_PANEL_TOKEN) return next();

  if (!token) return res.status(401).json({ ok: false, error: "Unauthorized" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ ok: false, error: "Invalid token" });
  }
}
```

### `src/middleware/error.middleware.js`

```javascript
export function errorHandler(err, _req, res, _next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    ok: false,
    error: err.message || "Internal server error",
    code: err.code || "INTERNAL_ERROR",
  });
}
```

### `src/models/Lead.js`

```javascript
import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
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
    report_data: mongoose.Schema.Types.Mixed,
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "won", "lost"],
      default: "new",
    },
    admin_notes: String,
  },
  { timestamps: true },
);

export default mongoose.model("Lead", leadSchema);
```

### `src/controllers/lead.controller.js`

```javascript
import Lead from "../models/Lead.js";

export async function createLead(req, res, next) {
  try {
    const { name, phone, email } = req.body;
    if (!name?.trim() || !phone?.trim() || !email?.trim()) {
      return res.status(400).json({ ok: false, error: "Name, phone and email are required." });
    }
    const lead = await Lead.create(req.body);
    res.status(201).json({ ok: true, data: { lead } });
  } catch (err) {
    next(err);
  }
}

export async function listLeads(req, res, next) {
  try {
    const { status, form_type, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (form_type) filter.form_type = form_type;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
      ];
    }
    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.json({ ok: true, data: { leads } });
  } catch (err) {
    next(err);
  }
}
```

### `src/routes/lead.routes.js`

```javascript
import { Router } from "express";
import { createLead, listLeads } from "../controllers/lead.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", createLead);
router.get("/", requireAdmin, listLeads);

export default router;
```

### `src/models/CalculatorLead.js`

```javascript
import mongoose from "mongoose";

const calculatorLeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    calculator_type: { type: String, required: true },
    report_summary: String,
    report_data: mongoose.Schema.Types.Mixed,
    status: { type: String, default: "new" },
  },
  { timestamps: true },
);

export default mongoose.model("CalculatorLead", calculatorLeadSchema);
```

### `src/controllers/calculator.controller.js`

```javascript
import CalculatorLead from "../models/CalculatorLead.js";

export async function submitCalculator(req, res, next) {
  try {
    const { name, phone, email, calculator_type, report_summary, report_data } = req.body;
    if (!name || !phone || !email || !calculator_type) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }
    const lead = await CalculatorLead.create({
      name,
      phone,
      email,
      calculator_type,
      report_summary,
      report_data,
    });
    res.status(201).json({ ok: true, data: { lead } });
  } catch (err) {
    next(err);
  }
}
```

### `src/models/Setting.js`

```javascript
import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, required: true },
    value: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true },
);

export default mongoose.model("Setting", settingSchema);
```

### `src/controllers/setting.controller.js`

```javascript
import Setting from "../models/Setting.js";

const PUBLIC_KEYS = ["whatsapp_number", "meta_title", "meta_description"];

export async function getSettings(req, res, next) {
  try {
    const isAdmin = !!req.user;
    const docs = await Setting.find(isAdmin ? {} : { key: { $in: PUBLIC_KEYS } });
    const settings = Object.fromEntries(docs.map((d) => [d.key, d.value]));
    res.json({ ok: true, data: { settings } });
  } catch (err) {
    next(err);
  }
}

export async function patchSettings(req, res, next) {
  try {
    const entries = Object.entries(req.body);
    for (const [key, value] of entries) {
      await Setting.findOneAndUpdate({ key }, { value }, { upsert: true });
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
```

---

## Public vs Protected APIs

| Public | Admin only |
|--------|------------|
| POST `/api/leads` | GET/PATCH/DELETE leads |
| POST `/api/audits` | All audit list/update |
| POST `/api/calculators/submit` | Calculator lead list |
| GET `/api/blogs` | Blog/FAQ/testimonial/case study/gallery CRUD |
| GET `/api/settings` (partial) | PATCH `/api/settings` |

Admin auth: JWT (`Authorization: Bearer`) or legacy `x-admin-token` header (current demo panel).

---

## Migration from Current API

The existing `server/index.mjs` already implements:

- `POST /api/leads` — create lead (file store)
- `GET /api/leads` — list (admin token)
- `POST /api/leads/update` — update status
- `POST /api/leads/delete` — delete

Replace `leadsStore.mjs` with MongoDB `Lead` model while keeping the same request/response shapes for zero frontend changes.
