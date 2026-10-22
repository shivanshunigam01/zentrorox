# Zentroverse Growth Hub — API & integration reference

**Version:** 1.0.0  
**Encoding:** All HTTP bodies are **JSON** (`Content-Type: application/json; charset=utf-8`) unless stated otherwise.

This document describes **every programmatic contract** in the repo: the Node payment API, browser `localStorage` shapes, and external services. It is written to be **strict**—field names, types, and status codes match the implementation.

---

## 1. HTTP API (Express — `backend/`)

The production API lives under the **`backend/`** package (`server.js` loads `src/app.js`). The Growth Hub SPA calls it through **`src/config/api.ts`** (`apiUrl`, `API_ROUTES`), **`src/lib/authApi.ts`** (register / login / profile / exists), and **`src/lib/razorpayCheckout.ts`** (Razorpay).

### 1.1 Base URL & transport

| Environment | Base URL | Notes |
|-------------|----------|--------|
| Local dev (with Vite) | Same origin as the app (e.g. `http://localhost:8080`) | Vite proxies `/api` and `/health` → `http://localhost:8787` (see `vite.config.ts`). |
| API process direct | `http://localhost:8787` | Default listen port; override with your process manager if needed. |
| Production | Deploy the Express app and set **`VITE_API_BASE_URL`** at build time to that origin (no trailing slash). | |

**Google OAuth (GIS):** Web Client ID is **`src/config/google.ts`** — default is the Zentrobot OAuth client; override with **`VITE_GOOGLE_CLIENT_ID`** in `.env`.

**CORS:** `cors({ origin: true })` — reflects request origin.

**Razorpay routes:** `RAZORPAY_KEY_SECRET` is server-only. In production, restrict exposure as needed.

**Auth routes:** Persist users in **MongoDB** (`User` model). Passwords are stored as **bcrypt** hashes. Auth HTTP handlers do not use JWT cookies in this version — the SPA mirrors the returned profile into **`localStorage`** for the demo session.

---

### 1.2 `GET /health`

**Status:** `200`

```json
{
  "ok": true,
  "service": "trader-backend-mvc",
  "mongo": { "configured": true, "readyState": 1 }
}
```

| `mongo` | Meaning |
|---------|---------|
| `configured: false` | `MONGODB_URI` unset — API runs without DB. |
| `readyState` | Mongoose connection state (`null` when not configured). |

---

### 1.3 Auth (`/api/auth/*`)

All require **MongoDB connected** (`readyState === 1`). Otherwise **503** `{ "error": "Database is not available..." }`.

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/auth/exists?email=` | Returns `{ "exists": boolean, "authMethod": null \| "password" \| "google" \| "pending" }`. Used before step 2 of registration. |
| `GET` | `/api/auth/profile?email=` | Returns `{ "user": { ... } }` or **404** if unknown — used on Google login when the browser has no local copy. |
| `POST` | `/api/auth/register` | Full signup (personal + company fields). Body matches **`RegisterApiBody`** in `src/lib/authApi.ts`. Use **`authMethod`: `"google"`** (OAuth) or **`"pending"`** (email path — no user-chosen password; an admin sets credentials later). **201** `{ "user": { ... } }` — `user.password` is always JSON `null`. |
| `POST` | `/api/auth/login` | Body `{ "email", "password" }`. **200** `{ "user": { ... } }`, **401** invalid credentials, or **403** if `authMethod` is **`pending`** (password not yet assigned). |

Duplicate email on register: **409** `{ "error": "An account with this email already exists." }`.

---

### 1.4 Plan → amount (server source of truth)

Amounts come from **Plan documents** (`slug` = `planId`). Fallback map in `backend/src/constants/planAmounts.js` if DB empty.

| `planId` (slug) | Amount (INR, paise) | Human INR |
|-----------------|---------------------|-----------|
| `basic-monthly` | `499900` | ₹4,999 |
| `basic-yearly` | `4999000` | ₹49,990 |
| `pro-monthly` | `1299900` | ₹12,999 |
| `pro-yearly` | `12999000` | ₹1,29,990 |

`free-trial` and any other value **must** be rejected by `create-order` with **400**.

---

### 1.8 Pricing plans (`/api/plans`)

Public catalog for `/pricing`. Admin CRUD at `/admin/content/plans`.

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/plans` | Public | `{ trial, plans, updatedAt }` |
| PUT | `/api/plans/catalog` | Admin Bearer | Replace catalog |
| POST | `/api/plans` | Admin Bearer | Create plan |
| PUT | `/api/plans/:id` | Admin Bearer | Update plan |
| DELETE | `/api/plans/:id` | Admin Bearer | Delete plan |
| PUT | `/api/plans/trial` | Admin Bearer | Update free trial |
| POST | `/api/plans/trial/start` | Public | `{ email, planSlug }` start trial |

Each plan feature has `kind`: `"included"` (part of plan) or `"addon"` (additional). Frontend: `src/lib/plans/plansApi.ts`.

---

### 1.5 `POST /api/razorpay/create-order`

Creates a Razorpay **Order** (server-side). Returns data needed to open Razorpay Checkout on the client.

#### Request body (JSON)

| Field | Type | Required | Constraints |
|-------|------|----------|----------------|
| `planId` | `string` | **Yes** | Must match an active paid plan **slug** (`basic-monthly`, `basic-yearly`, `pro-monthly`, `pro-yearly`, or a slug created in admin). |
| `email` | `string` | No | If not a string, treated as `""`. Stored in order `notes`, max **120** chars (server slices). |

#### Success response

**Status:** `200`

```json
{
  "orderId": "order_xxxxxxxxxxxx",
  "amount": 499900,
  "currency": "INR",
  "keyId": "rzp_xxxxxxxx"
}
```

| Field | Type | Meaning |
|-------|------|---------|
| `orderId` | `string` | Razorpay order id — pass to Checkout as `order_id`. |
| `amount` | `number` | Paise (integer). **Must** match the order; client should not override when using `order_id`. |
| `currency` | `string` | Currently always `"INR"`. |
| `keyId` | `string` | Public key — safe for frontend Checkout `key`. |

#### Error responses

| Status | Body | When |
|--------|------|------|
| `400` | `{ "error": "Invalid or unpaid plan." }` | Unknown `planId`, free-trial, inactive, or `amountInPaise` missing/0. |
| `503` | `{ "error": "Razorpay is not configured on the server." }` | Missing `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` or Razorpay client not created. |
| `500` | `{ "error": "<message>" }` | Razorpay API / internal error. |

---

### 1.6 `POST /api/razorpay/verify-payment`

Verifies the Razorpay payment signature (HMAC-SHA256). **Always returns HTTP 200** on successful handler execution; **check `ok`**.

#### Request body (JSON)

| Field | Type | Required |
|-------|------|----------|
| `razorpay_order_id` | `string` | **Yes** |
| `razorpay_payment_id` | `string` | **Yes** |
| `razorpay_signature` | `string` | **Yes** |

These names **must** match Razorpay Checkout’s `handler` response fields.

#### Response (always `200` unless server error)

**Valid signature:**

```json
{ "ok": true }
```

**Invalid signature or mismatch:**

```json
{ "ok": false }
```

(`ok` is strictly boolean.)

**Missing fields:**

**Status:** `400`

```json
{ "ok": false, "error": "Missing payment fields." }
```

**Missing server secret:**

**Status:** `503`

```json
{ "ok": false, "error": "Server misconfiguration." }
```

**Unhandled error:**

**Status:** `500`

```json
{ "ok": false, "error": "Verification failed." }
```

#### Signature algorithm (reference)

```
expected = HMAC_SHA256( key = RAZORPAY_KEY_SECRET, message = razorpay_order_id + "|" + razorpay_payment_id )
compare expected (hex) === razorpay_signature
```

---

### 1.7 Client calls (frontend)

| File | Usage |
|------|--------|
| `src/config/api.ts` | `apiUrl()`, `API_ROUTES`, `fetchHealth()` — single place for backend URLs (`VITE_API_BASE_URL`, e.g. `http://localhost:8787`). |
| `src/lib/authApi.ts` | `fetchAuthExists`, `fetchAuthProfile`, `registerAccountApi`, `loginPasswordApi`. |
| `src/lib/razorpayCheckout.ts` | `fetch(apiUrl(API_ROUTES.RAZORPAY_*))` for create-order and verify-payment; loads `https://checkout.razorpay.com/v1/checkout.js`. |

---

## 2. Client-side persistence (no HTTP) — `localStorage`

Strict JSON documents stored in the browser. **Not** a replacement for a production backend.

### 2.1 Keys

| Key | Value |
|-----|--------|
| `zentroverse-demo-users-v2` | JSON array of `DemoUserStored` |
| `zentroverse-demo-session` | Single `DemoUserStored` for current session |

### 2.2 Type: `AccountProfile`

| Field | Type | Required |
|-------|------|----------|
| `fullName` | `string` | Yes |
| `email` | `string` | Yes (normalized to lowercase when stored) |
| `phoneDialCode` | `string` | Yes |
| `phoneNational` | `string` | Yes |
| `companyName` | `string` | Yes |
| `companyDescription` | `string` | Yes |
| `country` | `string` | Yes |
| `state` | `string` | Yes |
| `companySize` | `string` | Yes |
| `industry` | `string` | Yes |
| `websiteUrl` | `string` | Yes |
| `timezone` | `string` | Yes |
| `picture` | `string` | No (OAuth avatar URL) |

### 2.3 Type: `DemoUserStored` (extends `AccountProfile`)

| Field | Type | Required |
|-------|------|----------|
| `password` | `string \| null` | Yes — `null` for Google, `pending`, or when only the API stores hashes |
| `authMethod` | `"password" \| "google" \| "pending"` | Yes — `pending` = registered by email until an admin assigns a password |
| `subscriptionPlan` | `string` | No — e.g. `"starter"` \| `"growth"` \| `"pro"` \| `"enterprise"` |
| `razorpayPaymentId` | `string` | No — set after successful verified payment |

### 2.4 Module

Implementation: `src/lib/demoAuth.ts`.

---

## 3. External services (third-party)

### 3.1 Google Identity Services (OAuth)

- **Library:** `@react-oauth/google` (`GoogleLogin`, `GoogleOAuthProvider`).
- **Client ID:** `src/config/google.ts` → `GOOGLE_CLIENT_ID` (wrap app in `GoogleOAuthProvider` in `App.tsx`).
- **Token:** JWT credential parsed in `src/lib/googleJwt.ts` — fields used: `email`, `name`, `picture`.

### 3.2 Razorpay

- **Checkout script:** `https://checkout.razorpay.com/v1/checkout.js`
- **Server credentials:** `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` (see `.env.example`). **Secret is server-only.**

---

## 4. SPA routing (React Router)

Not a REST API; listed for completeness.

| Path | Purpose |
|------|---------|
| `/` | Marketing site |
| `/pricing` | Public pricing (Basic/Pro monthly & yearly, free trial) |
| `/automation`, `/automation/:category/:slug` | Automation area |
| `/login`, `/register` | Auth UI (modal stack via `location.state.backgroundLocation`) |

---

## 5. Machine-readable OpenAPI

See **`openapi.yaml`** in this folder for OpenAPI 3.0 definitions of §1 HTTP endpoints.
