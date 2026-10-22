# ZENTROROX — Production deployment

## Pre-flight checklist

| Item | Action |
|------|--------|
| **MongoDB** | Set `MONGODB_URI` (Atlas or self-hosted). Enable backups. |
| **JWT** | Set `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` (≥48 chars, random). Server **exits** in `NODE_ENV=production` if defaults contain `change-me`. |
| **CORS** | Set `CORS_ORIGIN` to your frontend URL (e.g. `https://app.yourdomain.com`). |
| **Email** | Gmail SMTP (`SMTP_*`) or `SENDGRID_API_KEY` + `EMAIL_FROM`. |
| **WhatsApp** | `WHATSAPP_NOTIFY_URL` (+ optional `WHATSAPP_API_TOKEN`). |
| **Cloudinary** | `CLOUDINARY_ENABLED=true`, cloud name, API key/secret, `CLOUDINARY_UPLOAD_FOLDER`. |
| **Public URL** | `PUBLIC_APP_URL` for invoice links in WhatsApp messages. |
| **Secrets** | Never commit `.env`. Rotate credentials if exposed in chat or tickets. |

## Build & run

```bash
# Backend
cd Backend
npm ci
npm run build
NODE_ENV=production node dist/index.js

# Frontend
cd Frontend
npm ci
# Set VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
npm run build
# Serve dist/ via nginx, Cloudflare Pages, etc.
```

## Database

- **Do not** run destructive `npm run db:seed` on production tenant data.
- Use idempotent permission/numbering upserts only when adding new modules.
- No schema migration required for recent billing/workshop nav changes (optional fields only).

## Health

- `GET /health` — API process up
- `GET /api/v1` — versioned API (auth on business routes)

## Verified in dev (re-run after deploy)

| Check | Command / result |
|-------|------------------|
| Backend compile | `npm run build` |
| Backend unit tests | `npm test` (26 tests) |
| Frontend compile | `npm run build` (may need `NODE_OPTIONS=--max-old-space-size=8192` on low-RAM builders) |

## E2E / Playwright

Not included in repo. Run manual UAT: booking → receiving → inspection → estimate → job card → WIP → QC → billing → delivery.

## Known non-production items

- **E-invoice / IRN** — not integrated
- **Embedded images in repair PDF** — URLs/text only
- **Posted AR in credit exposure** — uses issued invoice `balanceDue` (credit notes not netted)
- **Local demo mode** (`VITE_USE_LOCAL_API`) — disable in production builds

## Rollback

1. Redeploy previous backend/frontend artifacts.
2. Do **not** drop Mongo collections; financial and visit history must remain.
3. If a bad deploy issued duplicate documents, use authorized cancellation/credit workflows — do not hard-delete invoices.
