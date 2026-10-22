
# Zentroverse Admin Panel — Build Plan

A self-contained `/admin` area with hardcoded login, a sidebar dashboard, full CRUD on leads (real DB) plus dummy data for customers/quotations/invoices/receipts, filtering, Excel/PDF export, and a branded printable receipt/invoice generator. Fully responsive (mobile + desktop).

---

## 1. Auth (demo-only, per your choice)

- Route: `/admin/login`
- Hardcoded credentials in code (e.g. `admin / zentro@2026`) — easy to change later.
- Login state stored in `sessionStorage` (`zv_admin_session=true`).
- `AdminProtected` wrapper redirects to `/admin/login` if not signed in.
- Logout button in sidebar clears session.
- Note shown in chat (and in code comments) that this is NOT secure — fine for demo, swap to real Lovable Cloud auth + `user_roles` later.

## 2. Layout & navigation

`/admin/*` uses `AdminLayout` with collapsible shadcn sidebar:

- Dashboard
- Leads (real)
- Customers (dummy)
- Quotations (dummy + create/edit)
- Invoices (dummy + create-from-quotation)
- Receipts (generated from invoices)
- Settings (company info, GSTIN, default GST %, logo — saved to `localStorage`)

Topbar: page title, mobile sidebar trigger, logout, current admin label.

## 3. Modules

### Dashboard
Cards: total leads, new this week, customers, pending invoices, revenue (dummy). Recent leads table (live from DB). Simple bar chart from dummy monthly revenue using `recharts` (already installed).

### Leads (real — connected to existing `leads` table)
- Lists all rows from `public.leads` (admin-only RLS already in place; will require auth — see note below).
- Columns: name, phone, email, city, business_type, product_interest, status, created_at, actions.
- Filters: search (name/email/phone), status, business_type, date range.
- Row actions: view detail drawer, change status (new → contacted → qualified → won/lost), edit admin notes, delete.
- Bulk: export filtered list to **Excel (.xlsx)** and **PDF**.
- The public site's `EnquiryForm` will be wired to actually `INSERT` into `leads` (currently it just `console.log`s). Validation already exists.

> ⚠️ Important caveat: the `leads` table's existing RLS only allows `SELECT/UPDATE/DELETE` to authenticated admins (via `has_role`). Hardcoded demo login is NOT a real Supabase session, so reads/writes will be blocked by RLS. To keep your "hardcoded login" choice working end-to-end, I will read/write leads through the anon key with a temporary policy relaxation OR (preferred) ship a tiny edge function that uses the service role to fetch/update leads, gated by a shared admin token kept in a secret. I'll go with the **edge function + admin token secret** approach — keeps RLS intact and avoids exposing data publicly. You'll be asked once for the admin token via the secret prompt.

### Customers (dummy, stored in `localStorage`)
- Seeded with ~12 dummy customers (name, company, GSTIN, phone, email, city, total spend).
- Full CRUD, search + city/spend filter, export Excel/PDF.

### Quotations (dummy, `localStorage`)
- Seeded with ~6 quotations linked to customers.
- Create/edit form: customer picker, line items (description, qty, rate), GST % (default from Settings), auto-calc subtotal/GST/total, notes, validity date.
- Actions: edit, duplicate, delete, **Convert to Invoice**, **Download PDF**.

### Invoices (dummy, `localStorage`)
- Similar table + form to quotations, plus invoice number, status (draft/sent/paid/overdue), payment date.
- Create from scratch OR auto-filled from a quotation.
- **Download PDF** (branded receipt format — see §4).
- Mark as paid → generates a Receipt entry.

### Receipts
- List of receipts generated from paid invoices. Download branded PDF.

### Settings
- Company name, address, GSTIN, default GST %, phone, email, bank details, footer note.
- Logo: uses your existing site logo by default; option to upload a new one (stored as base64 in `localStorage`).

## 4. Branded PDF (receipt / invoice / quotation)

A single reusable React-rendered template printed to PDF via `jspdf` + `html2canvas` (both lightweight, no native deps). Format:

```text
┌──────────────────────────────────────────────────────────┐
│ Company name, address, GSTIN          [LOGO — top right]│
│ ────────────────────────────────────────────────────────│
│  INVOICE / RECEIPT / QUOTATION                           │
│  No: INV-0007         Date: 20 Jun 2026                  │
│  Bill To:                                                │
│    Customer name, address, GSTIN, phone                  │
│ ────────────────────────────────────────────────────────│
│  #  Description           Qty   Rate     Amount          │
│  1  …                                                    │
│ ────────────────────────────────────────────────────────│
│                       Subtotal:  ₹ …                     │
│                       GST (18%): ₹ …                     │
│                       Total:     ₹ …                     │
│                                                          │
│  Notes / Terms                  Bank details             │
│  Signature                      "Thank you" footer       │
└──────────────────────────────────────────────────────────┘
```

All values come from Settings + the record. Currency in ₹ (INR). Single A4 page, print-friendly.

## 5. Exports

- **Excel**: `xlsx` (SheetJS) — exports current filtered table.
- **PDF (list view)**: same `jspdf` instance, simple table layout with company header.

## 6. Responsive

- Sidebar collapses to icon-rail on tablet, off-canvas on mobile.
- Tables become stacked cards under `md` (using shadcn patterns we already use).
- Forms switch to single-column on mobile.

## 7. Technical details

### New deps
`xlsx`, `jspdf`, `html2canvas` (all pure JS, small).

### New files
```
src/pages/admin/AdminLogin.tsx        (replace stub)
src/pages/admin/AdminLayout.tsx
src/pages/admin/AdminDashboard.tsx
src/pages/admin/AdminLeads.tsx        (replace stub)
src/pages/admin/AdminCustomers.tsx
src/pages/admin/AdminQuotations.tsx
src/pages/admin/AdminInvoices.tsx
src/pages/admin/AdminReceipts.tsx
src/pages/admin/AdminSettings.tsx
src/components/admin/AdminSidebar.tsx
src/components/admin/AdminProtected.tsx
src/components/admin/DataTable.tsx           (filter+export shell)
src/components/admin/DocumentPdf.tsx         (printable template)
src/lib/admin/auth.ts                        (hardcoded login)
src/lib/admin/store.ts                       (localStorage CRUD helpers)
src/lib/admin/exporters.ts                   (xlsx + pdf helpers)
src/lib/admin/seed.ts                        (dummy data)
src/data/admin/*.ts                          (dummy seed data)
supabase/functions/admin-leads/index.ts      (service-role leads API, token-gated)
```

### Edits
- `src/App.tsx` — nested `/admin/*` routes under `AdminLayout`.
- `src/components/zentro/EnquiryForm.tsx` — actually `INSERT` into `leads` (keeps existing validation + toast).

### Backend
- One edge function `admin-leads` with `list / update / delete` actions, gated by `x-admin-token` matching a secret `ADMIN_PANEL_TOKEN` (I will request this via `add_secret` after you approve the plan).
- No schema migration needed — `leads` table already exists.

### Credentials (defaults, you can change)
- Admin login: `admin@zentroverse.in` / `Zentro@2026`
- Admin token (server): generated random — stored as `ADMIN_PANEL_TOKEN` secret + a matching constant in client (NOT ideal security, but matches your "demo login" choice).

---

If this looks good, hit approve and I'll start building. I'll do it in this order: deps → layout/auth → leads (DB + edge function + form wiring) → customers/quotations/invoices/receipts → PDF template → exports → polish/responsive pass.
