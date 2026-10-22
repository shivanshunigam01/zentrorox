/**
 * Google OAuth Web Client ID (GIS). Override with `VITE_GOOGLE_CLIENT_ID` in `.env`.
 * Default is the Zentrobot (OAuth) client you provided.
 */
export const GOOGLE_CLIENT_ID =
  (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() ||
  "247765246302-ts0ji1kalu2shvbfr0hqh83rau7f70pf.apps.googleusercontent.com";
