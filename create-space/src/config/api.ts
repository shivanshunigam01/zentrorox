/**
 * Backend HTTP API base. Set `VITE_API_BASE_URL` when the UI and API are on different origins
 * (e.g. production). Leave empty in dev: Vite proxies `/api` → backend (see vite.config.ts).
 */
/** Production API host — always used for production builds. */
const PRODUCTION_API_BASE = "https://backend.zentrosure.com";

const envBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? "";

/** Dev: `.env` or Vite proxy. Production: always EC2 backend (ignores stale Vercel env). */
const raw = import.meta.env.PROD ? PRODUCTION_API_BASE : envBase;

export const API_BASE_URL = raw.replace(/\/$/, "");

/**
 * Paths match the Node app in `/backend` (`server.js` + `src/app.js`).
 * Payment routes are under `/api`; `HEALTH` is at server root.
 */
export const API_ROUTES = {
  HEALTH: "/health",
  AUTH_EXISTS: "/api/auth/exists",
  AUTH_PROFILE: "/api/auth/profile",
  AUTH_REGISTER: "/api/auth/register",
  AUTH_LOGIN: "/api/auth/login",
  RAZORPAY_CREATE_ORDER: "/api/razorpay/create-order",
  RAZORPAY_VERIFY_PAYMENT: "/api/razorpay/verify-payment",
  LEADS: "/api/leads",
  LEADS_UPDATE: "/api/leads/update",
  LEADS_DELETE: "/api/leads/delete",
  BAJAJ_ASD_APPLY: "/api/bajaj-asd/apply",
  BAJAJ_ASD_APPLICATIONS: "/api/bajaj-asd/applications",
  BAJAJ_ASD_UPDATE: "/api/bajaj-asd/update",
  CMS: "/api/cms",
  CMS_SECTION: (section: string) => `/api/cms/sections/${section}`,
  PLANS: "/api/plans",
  PLANS_CATALOG: "/api/plans/catalog",
  PLANS_TRIAL: "/api/plans/trial",
  PLANS_TRIAL_START: "/api/plans/trial/start",
  PLAN: (id: string) => `/api/plans/${id}`,
  MEDIA_UPLOAD: "/api/media/upload",
  MEDIA_STATUS: "/api/media/status",
} as const;

/**
 * Absolute or same-origin URL for the backend.
 * - `VITE_API_BASE_URL` empty → `/api/...` (dev proxy or same host).
 * - `VITE_API_BASE_URL=https://api.example.com` → `https://api.example.com/api/...`
 */
export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!API_BASE_URL) return p;
  return `${API_BASE_URL}${p}`;
}

/** Response shape from `GET /health` on the Node app (`backend/src/app.js`). */
export type HealthResponse = {
  ok: boolean;
  service: string;
  mongo: {
    configured: boolean;
    readyState: number | null;
  };
};

/** `GET /health` — Mongo status and service name. Uses `apiUrl(API_ROUTES.HEALTH)`. */
export async function fetchHealth(): Promise<HealthResponse> {
  const r = await fetch(apiUrl(API_ROUTES.HEALTH));
  const data = (await r.json()) as HealthResponse;
  return data;
}
