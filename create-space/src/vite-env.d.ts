/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional. Example: `http://localhost:8787` or `https://api.yourdomain.com` (no trailing slash). */
  readonly VITE_API_BASE_URL?: string;
  /** Optional. Overrides default Google OAuth client id from `src/config/google.ts`. */
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_GTM_ID?: string;
  readonly VITE_GA4_ID?: string;
  readonly VITE_META_PIXEL_ID?: string;
  readonly VITE_CLARITY_ID?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_CONTACT_PHONE?: string;
  readonly VITE_LINKEDIN_PARTNER_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
